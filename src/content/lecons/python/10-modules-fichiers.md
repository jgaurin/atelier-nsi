---
titre: Modules, fichiers et bonnes pratiques
resume: Utiliser et écrire des modules, lire et écrire des fichiers texte et CSV, mesurer un temps d'exécution et écrire un code lisible.
duree: 60
objectifs:
  - Importer un module de la bibliothèque standard et organiser son propre code en modules
  - Lire et écrire un fichier texte avec `with open(...)`, et traiter un fichier CSV
  - Mesurer le temps d'exécution d'une fonction et générer des données aléatoires reproductibles
  - Appliquer les conventions d'écriture (PEP 8, noms, docstrings, fonctions courtes)
prerequis: [python/tests-erreurs]
programme: [lp-python, id-tables, nsi1-langages, nsi1-tables, nsit-langages]
cartes:
  - q: Différence entre `import math` et `from math import sqrt` ?
    r: "`import math` donne accès au module : on écrit `math.sqrt(2)`. `from math import sqrt` importe seulement le nom `sqrt` : on écrit `sqrt(2)`."
  - q: "À quoi sert `if __name__ == \"__main__\":` ?"
    r: "Le bloc ne s'exécute que si le fichier est lancé directement, pas quand il est importé comme module : on y met les tests ou le programme principal."
  - q: Pourquoi ouvrir un fichier avec `with open(...) as f:` ?
    r: "Le fichier est **fermé automatiquement** à la sortie du bloc, même en cas d'erreur."
  - q: "Que font les modes `\"r\"`, `\"w\"`, `\"a\"` de `open` ?"
    r: "Lecture ; écriture (le fichier est **vidé** s'il existe) ; ajout à la fin."
  - q: Comment lire un CSV avec en-tête en obtenant un dictionnaire par ligne ?
    r: "`csv.DictReader(f, delimiter=\";\")` : chaque ligne devient un dictionnaire colonne → valeur (toujours des chaînes)."
  - q: Comment mesurer la durée d'un calcul ?
    r: "`debut = time.perf_counter()`, le calcul, puis `time.perf_counter() - debut` (en secondes)."
  - q: À quoi sert `random.seed(42)` ?
    r: "À rendre les tirages pseudo-aléatoires **reproductibles** : la même graine donne la même suite de nombres."
---

Un vrai programme ne tient pas dans une cellule : il s'appuie sur des **bibliothèques** écrites par d'autres, lit
ses données dans des **fichiers**, et doit rester lisible pour la personne qui le reprendra (souvent soi-même, trois
mois plus tard). C'est aussi ce qu'on attend à l'oral du concours : une réalisation informatique **organisée**,
avec des données, des tests et des mesures. Cette leçon rassemble ces savoir-faire.

## 1. Utiliser des modules

Un **module** est un fichier Python qui regroupe des fonctions et des variables. La **bibliothèque standard** de
Python en fournit des centaines.

```python exec
import math
from random import randint, choice
import statistics as stats

print(math.sqrt(2), math.pi, math.floor(-2.5), math.gcd(252, 105))
print(randint(1, 6), choice(["pile", "face"]))
print(stats.mean([12, 15, 9]), stats.median([12, 15, 9, 20]))
```

| Module        | Utile pour                                       |
|---------------|--------------------------------------------------|
| `math`        | racine, puissances, trigonométrie, `floor`, `ceil`, `gcd`, constantes |
| `random`      | tirages pseudo-aléatoires (`random`, `randint`, `choice`, `shuffle`, `sample`) |
| `time`        | mesurer des durées (`perf_counter`), attendre (`sleep`) |
| `csv`, `json` | lire et écrire des données structurées           |
| `collections` | `Counter`, `deque` (file), `defaultdict`         |
| `heapq`       | file de priorité (tas)                           |
| `copy`        | copies profondes (`deepcopy`)                    |

`help(math)` ou `dir(math)` listent le contenu d'un module.

## 2. Écrire ses propres modules

Tout fichier `.py` est un module. Si `geometrie.py` contient une fonction `aire_disque`, un autre fichier du même
dossier peut écrire `from geometrie import aire_disque`. On sépare ainsi le code en fichiers cohérents : par exemple
`donnees.py` (lecture des fichiers), `tris.py` (les algorithmes), `interface.py` (l'affichage), `tests.py`.

Quand un module est importé, **tout son code est exécuté**. Pour qu'un module puisse à la fois être importé et lancé
directement (pour ses tests), on protège le programme principal :

```python
# fichier tris.py
def tri_insertion(t):
    ...

if __name__ == "__main__":       # vrai seulement si on lance « python tris.py »
    assert tri_insertion([3, 1, 2]) == [1, 2, 3]
    print("tests de tris.py : OK")
```

```mermaid legende="Un projet découpé en modules : chaque fichier a une responsabilité"
graph TD
  P[principal.py<br/>programme principal] --> D[donnees.py<br/>lire / écrire les fichiers]
  P --> T[tris.py<br/>algorithmes]
  P --> I[interface.py<br/>affichage]
  X[tests.py] --> T
  X --> D
```

## 3. Lire et écrire des fichiers texte

```python exec
with open("courses.txt", "w", encoding="utf-8") as f:   # "w" : écriture (vide le fichier)
    f.write("pain\n")
    f.write("lait\n")
    f.write("pommes\n")

with open("courses.txt", "a", encoding="utf-8") as f:   # "a" : ajout à la fin
    f.write("café\n")

with open("courses.txt", "r", encoding="utf-8") as f:   # "r" : lecture
    for numero, ligne in enumerate(f, start=1):
        print(numero, ligne.strip())
```

- `open(nom, mode, encoding="utf-8")` ouvre le fichier ; préciser l'encodage évite les surprises avec les accents.
- `with … as f:` garantit la **fermeture** du fichier à la fin du bloc, même si une erreur survient.
- Parcourir `f` donne les lignes **avec** leur `"\n"` final : `strip()` l'enlève. `f.read()` donne tout le texte,
  `f.readlines()` la liste des lignes.

:::attention
Le mode `"w"` **efface** le contenu d'un fichier existant. Ouvrir en lecture un fichier absent lève
`FileNotFoundError`. (Dans l'Atelier, les fichiers sont créés dans un espace de travail temporaire du navigateur.)
:::

## 4. Les fichiers CSV

Un fichier **CSV** (*comma-separated values*) contient un tableau : une ligne par enregistrement, des champs séparés
par un délimiteur (`,` ou `;` en France), et souvent une première ligne d'**en-tête**. Le module `csv` gère les cas
délicats (champs entre guillemets contenant le séparateur).

```python exec
import csv

with open("notes.csv", "w", encoding="utf-8", newline="") as f:
    f.write("nom;classe;note\nMartin;1G1;14.5\nDurand;1G2;9\nPetit;1G1;16\n")

with open("notes.csv", encoding="utf-8", newline="") as f:
    lignes = list(csv.DictReader(f, delimiter=";"))

print(lignes[0])
notes_1g1 = [float(l["note"]) for l in lignes if l["classe"] == "1G1"]
print(sum(notes_1g1) / len(notes_1g1))
```

`DictReader` donne une liste de **dictionnaires** (colonne → valeur) : c'est la représentation d'une **table** utilisée
dans la leçon « Données en table ». Toutes les valeurs lues sont des **chaînes** : il faut convertir (`float`, `int`).

## 5. Hasard et mesure du temps

Les tirages de `random` sont **pseudo-aléatoires** : calculés par un algorithme à partir d'une **graine**. Fixer la
graine avec `random.seed` rend une expérience **reproductible** — indispensable pour tester ou comparer des algorithmes
sur les mêmes données.

```python exec
import random, time

random.seed(2027)
donnees = [random.randint(0, 1000) for _ in range(20000)]

debut = time.perf_counter()
trie = sorted(donnees)
fin = time.perf_counter()
print(f"tri de {len(donnees)} entiers : {(fin - debut) * 1000:.2f} ms")
print(donnees[:5], trie[:5])
```

`time.perf_counter()` donne un instant précis ; la différence de deux appels est une durée en secondes. Une mesure
varie d'une exécution à l'autre (autres programmes, cache…) : on répète la mesure et on garde le minimum ou la
moyenne. C'est ce que demande l'oral 1 quand il faut « afficher le temps de calcul de chaque algorithme ».

## 6. Écrire un code lisible

Le guide **PEP 8** fixe les conventions de la communauté Python. Les plus utiles :

- noms en minuscules avec `_` pour les variables et fonctions (`nb_eleves`, `calculer_moyenne`), en `CamelCase` pour
  les classes (`CompteBancaire`), en majuscules pour les constantes (`TAUX_TVA = 20`) ;
- indentation de 4 espaces, lignes de longueur raisonnable, espaces autour des opérateurs (`x = a + b`) ;
- une **docstring** pour chaque fonction, des commentaires qui expliquent le **pourquoi** (pas le comment) ;
- des fonctions **courtes**, avec une seule responsabilité, sans variables globales modifiées ;
- des tests, et un historique des versions avec un outil comme **Git**.

:::prof
En NSI, l'usage de bibliothèques est au programme dès la première (« utiliser la documentation d'une bibliothèque »).
Les projets d'élèves gagnent beaucoup à être découpés en modules dès le départ, avec un fichier de tests ; c'est aussi
une bonne habitude pour préparer la réalisation informatique de l'oral 1, qu'on doit présenter et justifier.
:::

## Exemple guidé

**Problème (inspiré de l'oral 1).** Comparer empiriquement le tri par insertion (à écrire) et la fonction `sorted` de
Python sur des listes aléatoires de tailles croissantes, avec des mesures reproductibles.

**1. Organiser le code** en fonctions qui ont chacune un rôle : générer les données, trier, mesurer, afficher.

```python exec
import random, time

def tri_insertion(t):
    """Renvoie une nouvelle liste triée (tri par insertion)."""
    t = list(t)
    for i in range(1, len(t)):
        x = t[i]
        j = i
        while j > 0 and t[j - 1] > x:
            t[j] = t[j - 1]
            j -= 1
        t[j] = x
    return t

def donnees_aleatoires(n, graine=0):
    random.seed(graine)
    return [random.randint(0, 10**6) for _ in range(n)]

def duree(tri, t, repetitions=3):
    """Plus petite durée (en ms) de tri(t) sur plusieurs répétitions."""
    meilleure = float("inf")
    for _ in range(repetitions):
        debut = time.perf_counter()
        tri(t)
        meilleure = min(meilleure, time.perf_counter() - debut)
    return meilleure * 1000

for n in [250, 500, 1000, 2000]:
    t = donnees_aleatoires(n)
    assert tri_insertion(t) == sorted(t)          # on vérifie avant de mesurer
    print(f"n = {n:5d}   insertion : {duree(tri_insertion, t):8.2f} ms   sorted : {duree(sorted, t):6.3f} ms")
```

**2. Lire les résultats.** Quand `n` double, la durée du tri par insertion est multipliée par environ 4 : c'est la
signature d'un coût **quadratique** ($n^2$). Celle de `sorted` augmente à peine plus que proportionnellement :
coût en $n \log n$ (et code optimisé en C).

**3. Justifier les choix.** Graine fixée (mêmes données pour les deux tris), vérification du résultat **avant** de
mesurer, minimum de plusieurs mesures (pour écarter les perturbations), tailles qui doublent (pour lire l'ordre de
grandeur). Ce sont exactement les justifications attendues devant un jury.

## L'essentiel

- `import module` (puis `module.nom`) ou `from module import nom` ; bibliothèque standard : `math`, `random`, `time`, `csv`, `collections`…
- Un fichier `.py` est un module ; le code de test va sous `if __name__ == "__main__":`.
- `with open(nom, mode, encoding="utf-8") as f:` ; modes `"r"`, `"w"` (efface), `"a"` ; `strip()` sur les lignes lues.
- CSV : `csv.DictReader(f, delimiter=";")` → liste de dictionnaires de **chaînes** à convertir.
- `random.seed` pour la reproductibilité ; `time.perf_counter()` pour mesurer (répéter, garder le minimum).
- PEP 8, docstrings, fonctions courtes, tests, Git.

## Exercices

::::exercice[Importer]{niveau=1}
Après `from math import sqrt`, laquelle de ces instructions fonctionne ?

- [ ] `math.sqrt(16)`
- [x] `sqrt(16)`
- [ ] `math(sqrt(16))`
- [ ] aucune

:::corrige
`from math import sqrt` importe le **nom** `sqrt`, pas le nom `math`. Avec `import math`, il faudrait écrire `math.sqrt(16)`.
:::
::::

::::exercice[Mode d'ouverture]{niveau=1}
Un fichier `journal.txt` contient déjà 100 lignes. On exécute `with open("journal.txt", "w") as f: f.write("début\n")`.
Combien de lignes contient-il ensuite ?

- [x] 1
- [ ] 101
- [ ] 100
- [ ] une erreur, car le fichier existe déjà

:::corrige
Le mode `"w"` vide le fichier avant d'écrire. Pour ajouter à la fin, il faut le mode `"a"` (on aurait alors 101 lignes).
:::
::::

::::exercice[Écrire puis relire des lignes]{niveau=2}
Écris deux fonctions : `ecrire_lignes(nom, lignes)` qui écrit chaque chaîne de la liste `lignes` sur une ligne du
fichier `nom` (en remplaçant son contenu), et `lire_lignes(nom)` qui renvoie la liste des lignes du fichier, sans
les retours à la ligne.

```python depart
def ecrire_lignes(nom, lignes):
    ...

def lire_lignes(nom):
    ...
```

```python tests
ecrire_lignes("essai.txt", ["un", "deux", "trois"])
assert lire_lignes("essai.txt") == ["un", "deux", "trois"], "aller-retour"
ecrire_lignes("essai.txt", ["seul"])
assert lire_lignes("essai.txt") == ["seul"], "le contenu précédent est remplacé"
ecrire_lignes("vide.txt", [])
assert lire_lignes("vide.txt") == [], "fichier vide"
```

:::corrige
```python solution
def ecrire_lignes(nom, lignes):
    with open(nom, "w", encoding="utf-8") as f:
        for ligne in lignes:
            f.write(ligne + "\n")

def lire_lignes(nom):
    with open(nom, encoding="utf-8") as f:
        return [ligne.rstrip("\n") for ligne in f]
```
`rstrip("\n")` n'enlève que le retour à la ligne final (`strip()` enlèverait aussi des espaces voulus).
:::
::::

::::exercice[Moyenne d'une colonne CSV]{niveau=2}
Une chaîne contient un fichier CSV (séparateur `;`, première ligne d'en-tête). Écris `moyenne_colonne(texte, colonne)`
qui renvoie la moyenne des valeurs (numériques) de la colonne indiquée. N'utilise pas le module `csv` : découpe toi-même.

```python depart
def moyenne_colonne(texte, colonne):
    ...
```

```python tests
csv_texte = "nom;note;age\nLéa;12;16\nHugo;8;17\nInès;16;15\n"
assert moyenne_colonne(csv_texte, "note") == 12, "colonne note"
assert moyenne_colonne(csv_texte, "age") == 16, "colonne age"
assert moyenne_colonne("x;y\n1;2\n", "y") == 2, "une seule ligne de données"
```

:::corrige
```python solution
def moyenne_colonne(texte, colonne):
    lignes = texte.strip().split("\n")
    entete = lignes[0].split(";")
    k = entete.index(colonne)
    valeurs = [float(ligne.split(";")[k]) for ligne in lignes[1:]]
    return sum(valeurs) / len(valeurs)
```
`entete.index(colonne)` donne la position de la colonne cherchée. Le `strip()` initial évite une ligne vide finale.
Cette méthode simple échoue si un champ contient lui-même un `;` entre guillemets : c'est ce que gère le module `csv`.
:::
::::

::::exercice[Simulation de dés]{niveau=3}
Écris `lancers(n, graine)` qui simule `n` lancers d'un dé à six faces (avec `random.seed(graine)` puis
`random.randint`) et renvoie un dictionnaire face → nombre d'apparitions, avec **les six faces** présentes
(même à 0).

```python depart
import random

def lancers(n, graine):
    ...
```

```python tests
r = lancers(600, 1)
assert sorted(r.keys()) == [1, 2, 3, 4, 5, 6], "les six faces sont présentes"
assert sum(r.values()) == 600, "600 lancers au total"
assert lancers(600, 1) == r, "même graine, même résultat"
assert lancers(0, 5) == {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0}, "aucun lancer"
assert all(60 <= v <= 140 for v in lancers(600, 7).values()), "fréquences plausibles"
```

:::corrige
```python solution
import random

def lancers(n, graine):
    random.seed(graine)
    compte = {face: 0 for face in range(1, 7)}
    for _ in range(n):
        compte[random.randint(1, 6)] += 1
    return compte
```
Le troisième test vérifie la **reproductibilité** apportée par la graine. Le dernier vérifie un ordre de grandeur :
sur 600 lancers, chaque face apparaît environ 100 fois (l'écart typique est d'une dizaine).
:::
::::

::::exercice[Organiser une réalisation pour l'oral]{niveau=4 duree=25}
À l'oral 1, on te demande de réaliser en 2 h 30 un démonstrateur qui lit une liste d'entiers saisie par l'utilisateur,
la trie avec trois algorithmes (insertion, fusion, rapide), affiche le résultat et le temps de chaque tri, puis
d'ajouter si possible une interface graphique.

1. Propose une organisation du code en modules et fonctions (noms, rôle, signature de chaque fonction principale).
2. Explique comment tu garantis que tes tris sont corrects avant de présenter les temps, et comment tu rends les
   mesures fiables.
3. Comment conçois-tu ton code pour pouvoir ajouter l'interface graphique **à la fin** sans tout réécrire ?
4. Quelles données de test choisirais-tu pour montrer au jury des différences de comportement entre les algorithmes ?

:::criteres
- Découpage clair : un module d'algorithmes (fonctions de tri pures, qui renvoient une nouvelle liste ou trient en place, documentées), un module de mesure, un module d'entrées/sorties (saisie, affichage), un programme principal, des tests.
- Correction : tests unitaires de chaque tri sur cas limites (vide, un élément, déjà trié, ordre inverse, doublons) et comparaison avec `sorted` sur des listes aléatoires.
- Fiabilité des mesures : `time.perf_counter`, plusieurs répétitions, mêmes données pour tous les tris (copie de la liste, graine fixée), tailles croissantes.
- Séparation calcul / affichage : les tris ne font aucun `print` ni `input`, l'interface (console puis Tkinter) appelle les mêmes fonctions.
- Données de test pertinentes : liste déjà triée, inversée, aléatoire, avec beaucoup de doublons, de grande taille ; montrer la stabilité (couples de même clé) et le pire cas du tri rapide naïf.
:::

:::corrige
1. **Organisation.**
   - `tris.py` : `tri_insertion(t: list) -> list`, `tri_fusion(t: list) -> list`, `tri_rapide(t: list) -> list`,
     chacune documentée, **sans affichage**, renvoyant une nouvelle liste (ou triant une copie).
   - `mesure.py` : `duree(tri, t, repetitions=5) -> float` (meilleure durée en ms sur une copie de `t`) et
     `comparer(tris: dict, t: list) -> dict` (nom → durée).
   - `donnees.py` : `lire_liste(texte: str) -> list[int]` (analyse de la saisie, `ValueError` si invalide),
     `aleatoire(n, graine)`, `presque_triee(n, graine)`.
   - `principal.py` : saisie, appels, affichage console ; `interface.py` : la version Tkinter, ajoutée à la fin.
   - `tests.py` : les tests de `tris.py` et de `donnees.py`.
2. **Correction** : chaque tri est testé sur `[]`, `[x]`, une liste triée, inversée, avec doublons, puis sur
   des centaines de listes aléatoires comparées à `sorted(t)`. **Mesures fiables** : on trie toujours une **copie**
   des mêmes données (graine fixée), on prend le minimum de plusieurs répétitions avec `time.perf_counter()`,
   on fait varier `n` (en doublant) pour observer l'évolution plutôt qu'une valeur isolée.
3. **Séparer calcul et interface** : les fonctions de tri et de mesure ne font ni `input` ni `print` ; elles
   reçoivent des données et renvoient des résultats. L'interface console et l'interface Tkinter ne font qu'appeler
   ces fonctions et afficher leurs résultats : ajouter Tkinter ne touche pas au cœur du programme.
4. **Données** : une liste déjà triée (insertion devient linéaire, le tri rapide avec le premier élément comme pivot
   devient quadratique) ; une liste en ordre inverse (pire cas de l'insertion) ; une liste aléatoire (comportement
   moyen) ; une liste de couples `(clé, nom)` avec des clés égales, triés selon la clé, pour montrer que le tri par
   insertion et le tri fusion sont **stables** et pas le tri rapide par partition ; une grande liste (10 000 éléments)
   pour rendre visible l'écart entre $n^2$ et $n \log n$.
:::
::::
