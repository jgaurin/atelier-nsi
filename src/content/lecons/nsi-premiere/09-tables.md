---
titre: "Données en tables : CSV, recherche, tri, fusion"
resume: "Le cours de première NSI sur le traitement de données en tables : le format CSV, l'importation d'une table en tableau de dictionnaires, la sélection de lignes, la projection de colonnes, le test de cohérence, le tri selon une colonne et la fusion de deux tables."
duree: 55
objectifs:
  - "Décrire le format CSV et importer une table dans un tableau de dictionnaires"
  - "Rechercher les lignes vérifiant une condition et projeter des colonnes"
  - "Vérifier la cohérence d'une table (doublons, valeurs manquantes)"
  - "Trier une table selon une colonne avec sorted et key"
  - "Fusionner deux tables ayant une colonne commune"
prerequis: [nsi-premiere/dictionnaires]
programme: [nsi1-tables]
cartes:
  - q: "Qu'est-ce qu'un fichier CSV ?"
    r: "Un fichier texte où chaque ligne est un enregistrement et où les valeurs sont séparées par un **séparateur** (virgule ou point-virgule). La première ligne contient en général les **descripteurs** (noms des colonnes)."
  - q: "Comment représente-t-on une table en Python en première ?"
    r: "Par un **tableau de dictionnaires** : chaque dictionnaire est une ligne, ses clés sont les descripteurs."
  - q: "Piège à l'import d'un CSV ?"
    r: "Toutes les valeurs sont lues comme des **chaînes** : il faut convertir avec `int` ou `float` avant de calculer ou de trier."
  - q: "Comment trier une table selon la colonne \"note\" ?"
    r: "`sorted(table, key=lambda e: e[\"note\"])`, ou avec une fonction `def cle(e): return e[\"note\"]` et `sorted(table, key=cle)` ; `reverse=True` pour l'ordre décroissant."
  - q: "Sélection et projection ?"
    r: "**Sélection** : garder certaines **lignes** (une condition). **Projection** : garder certaines **colonnes**."
  - q: "Fusionner deux tables ?"
    r: "Pour chaque ligne de la première table, chercher la ligne de la seconde qui a la même valeur dans la **colonne commune** et réunir les deux dictionnaires."
---

Les données ouvertes (open data), un tableur, l'export de Pronote : beaucoup de données se présentent en **tables**. En première, on apprend à
les **charger** en Python puis à les **interroger** : chercher, trier, regrouper. C'est l'étape avant les bases de données et SQL de terminale.

## Ce que dit le programme

Contenus : *indexation de tables ; recherche dans une table ; tri d'une table ; fusion de tables*. Capacités attendues : **importer une table
depuis un fichier texte tabulé ou un fichier CSV** ; **rechercher les lignes d'une table vérifiant des critères** ; **utiliser un tri** suivant
une colonne ; **construire une nouvelle table en combinant les données de deux tables**. Le programme insiste sur le **test de cohérence**
(doublons, valeurs manquantes) et le lien avec les données ouvertes.

## 1. Le format CSV

Un fichier CSV (*comma-separated values*) est un simple **fichier texte** :

```
nom,classe,note
Léa,1G2,15
Tom,1G1,9
Inès,1G2,18
```

- chaque ligne est un **enregistrement** (une **ligne** de la table) ;
- les valeurs sont séparées par un **séparateur** (`,` ou `;` en France, où la virgule sert aux décimaux) ;
- la première ligne donne les **descripteurs** (les noms des **colonnes**, aussi appelés attributs).

## 2. Importer une table

On représente la table par un **tableau de dictionnaires**. Le module `csv` le fait directement :

```python
import csv

with open("eleves.csv", encoding="utf-8") as f:
    table = list(csv.DictReader(f, delimiter=","))
```

Voici ce qu'on obtient (on simule le fichier avec une chaîne pour pouvoir l'exécuter ici) :

```python exec
import csv, io

contenu = "nom,classe,note\nLéa,1G2,15\nTom,1G1,9\nInès,1G2,18\n"
table = list(csv.DictReader(io.StringIO(contenu)))
print(table[0])
print(table[0]["note"], type(table[0]["note"]))
```

:::attention[Tout est chaîne]
Après l'import, `"15"` est une **chaîne**. Il faut convertir avant de calculer ou de trier : sinon `"9" > "15"` est vrai (ordre
alphabétique) ! On convertit une fois pour toutes :

```python
for e in table:
    e["note"] = int(e["note"])
```
:::

Pour la suite, on écrit directement la table en Python :

```python exec
table = [
    {"nom": "Léa", "classe": "1G2", "note": 15},
    {"nom": "Tom", "classe": "1G1", "note": 9},
    {"nom": "Inès", "classe": "1G2", "note": 18},
    {"nom": "Noé", "classe": "1G1", "note": 12},
]
print(len(table), "lignes ;", list(table[0].keys()))
```

## 3. Rechercher : sélection et projection

**Sélection** : garder les **lignes** qui vérifient une condition. **Projection** : garder certaines **colonnes**. Les compréhensions sont
idéales.

```python exec
table = [
    {"nom": "Léa", "classe": "1G2", "note": 15},
    {"nom": "Tom", "classe": "1G1", "note": 9},
    {"nom": "Inès", "classe": "1G2", "note": 18},
    {"nom": "Noé", "classe": "1G1", "note": 12},
]
classe_1g2 = [e for e in table if e["classe"] == "1G2"]              # sélection
noms = [e["nom"] for e in table]                                     # projection
admis = [e["nom"] for e in table if e["note"] >= 10]                 # les deux
print(classe_1g2)
print(noms)
print(admis)
```

On peut aussi calculer sur une colonne (moyenne, maximum) avec les algorithmes de parcours habituels.

## 4. Tester la cohérence

Des données réelles sont souvent « sales » : lignes en double, cases vides, valeurs aberrantes. Avant de les exploiter, on vérifie :

```python exec
table = [
    {"id": "1", "nom": "Léa", "note": "15"},
    {"id": "2", "nom": "Tom", "note": ""},
    {"id": "1", "nom": "Léa", "note": "15"},
]

def ids_en_double(table):
    vus = {}
    doublons = []
    for e in table:
        if e["id"] in vus and e["id"] not in doublons:
            doublons.append(e["id"])
        vus[e["id"]] = True
    return doublons

print("doublons :", ids_en_double(table))
print("valeurs manquantes :", [e["id"] for e in table if e["note"] == ""])
```

## 5. Trier selon une colonne

La fonction `sorted` renvoie une **nouvelle** table triée. Le paramètre `key` indique **selon quoi** trier : une fonction qui, à une ligne,
associe la valeur de la colonne.

```python exec
table = [
    {"nom": "Léa", "classe": "1G2", "note": 15},
    {"nom": "Tom", "classe": "1G1", "note": 9},
    {"nom": "Inès", "classe": "1G2", "note": 18},
    {"nom": "Noé", "classe": "1G1", "note": 12},
]

def note(e):
    return e["note"]

par_note = sorted(table, key=note)                       # croissant
classement = sorted(table, key=note, reverse=True)       # décroissant
par_nom = sorted(table, key=lambda e: e["nom"])          # avec une lambda
print([e["nom"] for e in classement])
print([e["nom"] for e in par_nom])
```

`lambda e: e["nom"]` est une petite fonction sans nom, équivalente à `def cle(e): return e["nom"]`. Les deux écritures sont acceptées.

`sorted` est **stable** : à valeur égale, l'ordre de départ est conservé. On peut donc trier par classe puis par note en triant d'abord par
note, puis par classe.

## 6. Fusionner deux tables

Deux tables qui partagent une **colonne commune** peuvent être combinées : c'est l'ancêtre de la **jointure** SQL de terminale.

```python exec
eleves = [
    {"id": 1, "nom": "Léa", "classe": "1G2"},
    {"id": 2, "nom": "Tom", "classe": "1G1"},
]
notes = [
    {"id_eleve": 2, "matiere": "NSI", "note": 9},
    {"id_eleve": 1, "matiere": "NSI", "note": 15},
    {"id_eleve": 1, "matiere": "maths", "note": 13},
]

fusion = []
for n in notes:
    for e in eleves:
        if e["id"] == n["id_eleve"]:
            fusion.append({"nom": e["nom"], "matiere": n["matiere"], "note": n["note"]})
print(fusion)
```

Autre cas : **réunir** deux tables de même structure (deux classes) en une seule, en évitant les doublons.

## Les erreurs classiques des élèves

:::attention[Ce que tu verras en classe]
- **Oublier de convertir** les valeurs lues dans le CSV (tri alphabétique de nombres, `"15" + "3"` qui donne `"153"`).
- **Mauvais séparateur** : un fichier français séparé par `;` lu avec `,` donne une seule colonne.
- **Problèmes d'encodage** (accents illisibles) : préciser `encoding="utf-8"`.
- **Confondre sélection et projection.**
- **Croire que `sorted` modifie la table** : il renvoie une nouvelle table (c'est `table.sort(...)` qui modifie).
- **Écrire `key=note()`** au lieu de `key=note` : on passe la fonction, on ne l'appelle pas.
:::

## En classe

:::methode[Activités qui marchent]
1. **Ouvrir un CSV dans un éditeur de texte** puis dans un tableur : voir que c'est du texte.
2. **Données ouvertes** : prénoms donnés en France, stations Vélib', communes (data.gouv.fr) ; poser des questions concrètes.
3. **Données sales** fournies exprès : doublons, cases vides, virgules décimales ; les élèves écrivent les tests de cohérence.
4. **Fusion** : une table « élèves » et une table « notes », comme deux onglets d'un tableur ; puis le lien avec SQL en terminale.
:::

## L'essentiel

- **CSV** : fichier texte, une ligne par enregistrement, un **séparateur**, la première ligne donne les **descripteurs**.
- En Python, une table = **tableau de dictionnaires** ; import avec `csv.DictReader` ; **convertir** les nombres (tout est lu en chaîne).
- **Sélection** (lignes) et **projection** (colonnes) par compréhension.
- **Cohérence** : doublons, valeurs manquantes, valeurs aberrantes.
- **Tri** : `sorted(table, key=fonction, reverse=...)`, qui renvoie une nouvelle table ; tri stable.
- **Fusion** : combiner deux tables par une colonne commune.

## Exercices

::::exercice[Grand QCM : données en tables]{niveau=1 type=quiz}
Dix questions sur le traitement des tables.

1. Dans un fichier CSV, que contient en général la première ligne ?

   - [ ] le premier enregistrement
   - [x] les descripteurs (noms des colonnes)
   - [ ] le nombre de lignes
   - [ ] le séparateur utilisé

   > Les lignes suivantes sont les enregistrements.

1. Pourquoi les CSV français utilisent-ils souvent `;` comme séparateur ?

   - [ ] c'est plus rapide
   - [x] parce que la virgule sert de séparateur décimal en français
   - [ ] parce que la virgule est interdite
   - [ ] pour économiser de la place

   > Avec `12,5` dans une case, la virgule serait ambiguë.

1. Après `csv.DictReader`, quel est le type de la valeur `table[0]["note"]` ?

   - [ ] `int`
   - [ ] `float`
   - [x] `str`
   - [ ] `bool`

   > Tout est lu comme du texte ; il faut convertir.

1. Que vaut `"9" > "15"` en Python ?

   - [x] `True`
   - [ ] `False`
   - [ ] une erreur
   - [ ] `None`

   > Comparaison de chaînes caractère par caractère : '9' > '1'. D'où l'importance de convertir.

1. `[e["nom"] for e in table]` est :

   - [ ] une sélection
   - [x] une projection
   - [ ] un tri
   - [ ] une fusion

   > On garde une colonne pour toutes les lignes.

1. `[e for e in table if e["classe"] == "1G1"]` est :

   - [x] une sélection
   - [ ] une projection
   - [ ] un tri
   - [ ] une fusion

   > On garde certaines lignes entières.

1. Que renvoie `sorted(table, key=note)` ?

   - [ ] rien, la table est triée sur place
   - [x] une nouvelle table triée par ordre croissant de note
   - [ ] la note maximale
   - [ ] une table triée par ordre décroissant

   > `sorted` renvoie un nouveau tableau ; `reverse=True` pour l'ordre décroissant.

1. Quelle écriture est correcte ?

   - [ ] `sorted(table, key=note())`
   - [x] `sorted(table, key=note)`
   - [ ] `sorted(table, note)`
   - [ ] `sorted(key=note)`

   > On passe la fonction elle-même, sans l'appeler.

1. Que signifie « tri stable » ?

   - [ ] le tri ne plante jamais
   - [x] deux lignes de même valeur gardent leur ordre de départ
   - [ ] le tri est toujours rapide
   - [ ] la table n'est pas modifiée

   > Utile pour trier selon plusieurs critères successifs.

1. Pour fusionner une table « élèves » et une table « notes », il faut :

   - [ ] qu'elles aient le même nombre de lignes
   - [x] une colonne commune (l'identifiant de l'élève)
   - [ ] qu'elles soient triées
   - [ ] qu'elles aient exactement les mêmes colonnes

   > On associe les lignes qui ont la même valeur dans la colonne commune.
::::

::::exercice[Charger un CSV]{niveau=1}
Écris `charger(contenu, sep)` qui reçoit le **texte** d'un fichier CSV (descripteurs sur la première ligne) et son séparateur, et renvoie le
tableau de dictionnaires correspondant, sans utiliser le module `csv`. On utilisera `contenu.split("\n")` pour couper en lignes et
`ligne.split(sep)` pour couper une ligne en valeurs. Les lignes vides sont ignorées. Les valeurs restent des chaînes.

```python depart
def charger(contenu, sep):
    ...
```

```python tests
t = charger("nom;note\nLéa;15\nTom;9\n", ";")
assert t == [{"nom": "Léa", "note": "15"}, {"nom": "Tom", "note": "9"}], "deux lignes"
assert charger("a,b\n", ",") == [], "aucun enregistrement"
assert charger("x,y,z\n1,2,3", ",") == [{"x": "1", "y": "2", "z": "3"}], "pas de saut de ligne final"
```

:::corrige
```python solution
def charger(contenu, sep):
    lignes = contenu.split("\n")
    descripteurs = lignes[0].split(sep)
    table = []
    for ligne in lignes[1:]:
        if ligne != "":
            valeurs = ligne.split(sep)
            enregistrement = {}
            for i in range(len(descripteurs)):
                enregistrement[descripteurs[i]] = valeurs[i]
            table.append(enregistrement)
    return table
```

C'est ce que fait `csv.DictReader`, en plus robuste (il gère les guillemets et les séparateurs à l'intérieur des valeurs).
:::
::::

::::exercice[Interroger une table de films]{niveau=2}
On dispose d'une table de films (déjà convertie) :

```python
films = [
    {"titre": "Le Voyage de Chihiro", "annee": 2001, "duree": 125, "genre": "animation"},
    {"titre": "Intouchables", "annee": 2011, "duree": 112, "genre": "comédie"},
    {"titre": "Wall-E", "annee": 2008, "duree": 98, "genre": "animation"},
    {"titre": "Le Grand Bleu", "annee": 1988, "duree": 168, "genre": "drame"},
]
```

Écris :
- `titres_genre(films, genre)` : les titres des films de ce genre, dans l'ordre de la table ;
- `duree_moyenne(films)` : la durée moyenne (table non vide) ;
- `plus_recent(films)` : le titre du film le plus récent.

```python depart
def titres_genre(films, genre):
    ...

def duree_moyenne(films):
    ...

def plus_recent(films):
    ...
```

```python tests
films = [
    {"titre": "Le Voyage de Chihiro", "annee": 2001, "duree": 125, "genre": "animation"},
    {"titre": "Intouchables", "annee": 2011, "duree": 112, "genre": "comédie"},
    {"titre": "Wall-E", "annee": 2008, "duree": 98, "genre": "animation"},
    {"titre": "Le Grand Bleu", "annee": 1988, "duree": 168, "genre": "drame"},
]
assert titres_genre(films, "animation") == ["Le Voyage de Chihiro", "Wall-E"], "sélection et projection"
assert titres_genre(films, "western") == [], "genre absent"
assert duree_moyenne(films) == 125.75, "moyenne"
assert plus_recent(films) == "Intouchables", "plus récent"
```

:::corrige
```python solution
def titres_genre(films, genre):
    return [f["titre"] for f in films if f["genre"] == genre]

def duree_moyenne(films):
    total = 0
    for f in films:
        total = total + f["duree"]
    return total / len(films)

def plus_recent(films):
    meilleur = films[0]
    for f in films:
        if f["annee"] > meilleur["annee"]:
            meilleur = f
    return meilleur["titre"]
```

Pour `plus_recent`, on garde la **ligne** entière du meilleur, puis on en projette le titre.
:::
::::

::::exercice[Classement]{niveau=2}
Écris `classement(table)` qui renvoie la liste des noms triés par note **décroissante** et, à note égale, par ordre **alphabétique** du nom.
Utilise `sorted` (deux tris successifs, grâce à la stabilité).

```python depart
def classement(table):
    ...
```

```python tests
t = [
    {"nom": "Tom", "note": 12},
    {"nom": "Léa", "note": 15},
    {"nom": "Ana", "note": 12},
    {"nom": "Inès", "note": 18},
]
assert classement(t) == ["Inès", "Léa", "Ana", "Tom"], "note décroissante puis nom"
assert classement([]) == [], "table vide"
```

:::corrige
```python solution
def nom(e):
    return e["nom"]

def note(e):
    return e["note"]

def classement(table):
    par_nom = sorted(table, key=nom)
    par_note = sorted(par_nom, key=note, reverse=True)
    return [e["nom"] for e in par_note]
```

On trie d'abord selon le critère **secondaire** (le nom), puis selon le critère **principal** (la note) : la stabilité garde l'ordre
alphabétique entre les notes égales. Remarque : avec `reverse=True`, Python conserve bien l'ordre des égaux.
:::
::::

::::exercice[Fusionner élèves et notes]{niveau=2}
Écris `bulletin(eleves, notes)` qui renvoie une table où chaque ligne contient `nom`, `matiere` et `note`, en associant chaque note à l'élève
dont l'`id` est égal à l'`id_eleve` de la note. Les notes dont l'élève est inconnu sont ignorées. L'ordre est celui de la table `notes`.

```python depart
def bulletin(eleves, notes):
    ...
```

```python tests
eleves = [{"id": 1, "nom": "Léa"}, {"id": 2, "nom": "Tom"}]
notes = [
    {"id_eleve": 2, "matiere": "NSI", "note": 9},
    {"id_eleve": 3, "matiere": "NSI", "note": 20},
    {"id_eleve": 1, "matiere": "maths", "note": 13},
]
assert bulletin(eleves, notes) == [
    {"nom": "Tom", "matiere": "NSI", "note": 9},
    {"nom": "Léa", "matiere": "maths", "note": 13},
], "fusion"
assert bulletin(eleves, []) == [], "pas de notes"
```

:::corrige
```python solution
def bulletin(eleves, notes):
    noms = {}
    for e in eleves:
        noms[e["id"]] = e["nom"]
    resultat = []
    for n in notes:
        if n["id_eleve"] in noms:
            resultat.append({"nom": noms[n["id_eleve"]], "matiere": n["matiere"], "note": n["note"]})
    return resultat
```

Plutôt que deux boucles imbriquées, on construit d'abord un dictionnaire `id → nom` : chaque recherche devient immédiate. La double boucle du
cours est aussi une réponse correcte.
:::
::::

::::exercice[Pourquoi tester la cohérence ?]{niveau=2}
Une élève a téléchargé un CSV des prénoms donnés en France et calcule le prénom le plus donné. Elle trouve un résultat absurde. Donne trois
problèmes possibles dans les données ou dans son import, et pour chacun, comment le détecter en Python.

:::criteres
- Au moins trois problèmes pertinents : nombres non convertis (tri ou max sur des chaînes), doublons, valeurs manquantes ou codes spéciaux
  (« XXXX », « _PRENOMS_RARES »), mauvais séparateur, encodage.
- Pour chacun, un test concret en Python.
:::

:::corrige
1. **Nombres non convertis** : le maximum est calculé sur des chaînes (`"999" > "12000"`). Détection : `type(table[0]["nombre"])` ; correction
   par `int(...)`. 2. **Lignes spéciales** : le fichier de l'Insee contient des lignes « _PRENOMS_RARES » ou des années « XXXX » qui regroupent
   beaucoup de naissances. Détection : afficher les lignes dont le prénom commence par `_` ou dont l'année n'est pas un nombre. 3. **Doublons ou
   regroupements** : le même prénom apparaît une fois par année et par sexe ; il faut additionner avant de comparer. Détection : compter les
   occurrences de chaque prénom avec un dictionnaire. On peut ajouter le mauvais séparateur (une seule colonne détectée) ou l'encodage (accents
   illisibles).
:::
::::
