---
titre: Dictionnaires
resume: "Le cours de première NSI sur les dictionnaires Python : associer des clés à des valeurs, lire, ajouter et modifier une entrée, tester la présence d'une clé, parcourir avec keys(), values() et items(), compter des occurrences, et représenter des enregistrements (p-uplets nommés)."
duree: 45
objectifs:
  - "Construire un dictionnaire et accéder à une valeur par sa clé"
  - "Ajouter, modifier une entrée et tester la présence d'une clé avec in"
  - "Parcourir un dictionnaire avec keys(), values() et items()"
  - "Utiliser un dictionnaire pour compter des occurrences"
  - "Représenter un enregistrement par un dictionnaire"
prerequis: [nsi-premiere/tableaux]
programme: [nsi1-construits]
cartes:
  - q: "Qu'est-ce qu'un dictionnaire ?"
    r: "Une structure qui associe des **clés** à des **valeurs** : `{\"Léa\": 15, \"Tom\": 12}`. On accède à une valeur par sa clé, pas par une position."
  - q: "Comment ajouter ou modifier une entrée ?"
    r: "`d[cle] = valeur` : si la clé existe, la valeur est remplacée ; sinon, l'entrée est créée."
  - q: "Que provoque `d[\"Zoé\"]` si la clé n'existe pas ?"
    r: "Une `KeyError`. On teste d'abord avec `if \"Zoé\" in d:`."
  - q: "Que parcourt `for k in d:` ?"
    r: "Les **clés** (comme `for k in d.keys()`). `d.values()` donne les valeurs, `d.items()` les couples (clé, valeur)."
  - q: "Le schéma pour compter des occurrences avec un dictionnaire ?"
    r: "`for x in t: if x in d: d[x] = d[x] + 1 else: d[x] = 1`."
  - q: "Quels types peuvent servir de clés ?"
    r: "Des valeurs **non modifiables** : nombres, chaînes, p-uplets. Pas de tableau (list) comme clé."
---

Dans un tableau, on retrouve une valeur par sa **position** (indice 0, 1, 2…). Mais pour un annuaire, on veut retrouver un numéro par un
**nom**. C'est le rôle du **dictionnaire** : il associe des **clés** à des **valeurs**. On s'en sert pour les fiches (un élève, un livre), les
comptages (combien de fois chaque mot ?) et les correspondances (une traduction, un code).

## Ce que dit le programme

Contenu : *dictionnaires par clés et valeurs*. Capacités attendues : **construire une entrée de dictionnaire** ; **itérer sur les éléments d'un
dictionnaire**. Le programme cite les méthodes `keys()`, `values()` et `items()`, et l'exemple des métadonnées **EXIF** d'une image. Il
rappelle que les p-uplets nommés sont représentés en Python par des dictionnaires.

## 1. Créer et lire

```python exec
ages = {"Léa": 15, "Tom": 16, "Inès": 15}
print(ages["Tom"])
print(len(ages))          # nombre d'entrées
vide = {}                 # dictionnaire vide
print(vide)
```

Chaque **entrée** est un couple `clé: valeur`. Les clés sont **uniques** ; les valeurs peuvent se répéter.

Lire une clé absente provoque une erreur :

```python exec erreur
ages = {"Léa": 15, "Tom": 16}
print(ages["Zoé"])        # KeyError : 'Zoé'
```

D'où l'importance de **tester la présence** d'une clé avec `in` :

```python exec
ages = {"Léa": 15, "Tom": 16}
if "Zoé" in ages:
    print(ages["Zoé"])
else:
    print("Zoé n'est pas dans le dictionnaire")
```

`in` teste les **clés**, pas les valeurs : `15 in ages` vaut `False`.

## 2. Ajouter et modifier

La même instruction `d[cle] = valeur` sert à **ajouter** (clé nouvelle) et à **modifier** (clé existante) :

```python exec
stock = {"pommes": 12, "poires": 5}
stock["kiwis"] = 8            # ajout
stock["pommes"] = 10          # modification
stock["poires"] = stock["poires"] + 3
print(stock)
```

## 3. Parcourir

```python exec
notes = {"maths": 14, "NSI": 17, "anglais": 12}

for matiere in notes:                 # les clés
    print(matiere)

for n in notes.values():              # les valeurs
    print(n)

for matiere, n in notes.items():      # les couples (clé, valeur)
    print(matiere, ":", n)
```

`for k in d` et `for k in d.keys()` sont équivalents. `items()` est le plus pratique quand on a besoin des deux, grâce au dépaquetage vu avec
les p-uplets.

## 4. Compter des occurrences

C'est l'usage le plus fréquent en exercice : compter combien de fois apparaît chaque élément.

```python exec
def occurrences(texte):
    compte = {}
    for c in texte:
        if c in compte:
            compte[c] = compte[c] + 1
        else:
            compte[c] = 1
    return compte

print(occurrences("abracadabra"))
```

Ce schéma (« si la clé existe, on ajoute 1, sinon on crée l'entrée à 1 ») est à connaître par cœur.

## 5. Enregistrements et tables

Un dictionnaire représente bien une **fiche** (un p-uplet nommé) :

```python exec
photo = {"fichier": "IMG_0042.jpg", "largeur": 4032, "hauteur": 3024,
         "date": "2026-09-14", "flash": False}
print(photo["largeur"] * photo["hauteur"], "pixels")
```

Et un **tableau de dictionnaires** représente une **table** de données, chaque dictionnaire étant une ligne (c'est la base du chapitre sur les
données en tables) :

```python exec
classe = [
    {"nom": "Léa", "age": 15, "option": "NSI"},
    {"nom": "Tom", "age": 16, "option": "SES"},
    {"nom": "Inès", "age": 15, "option": "NSI"},
]
print([e["nom"] for e in classe if e["option"] == "NSI"])
```

## 6. Ce qu'on peut mettre comme clé

Les clés doivent être **non modifiables** : nombres, chaînes, p-uplets. Un tableau ne peut pas être une clé (`TypeError: unhashable type:
'list'`). Les valeurs, elles, peuvent être de n'importe quel type, y compris des tableaux ou des dictionnaires.

Un dictionnaire n'a **pas d'indice** : `d[0]` cherche la **clé** 0, pas « le premier élément ».

## Les erreurs classiques des élèves

:::attention[Ce que tu verras en classe]
- **`KeyError`** : lire une clé absente sans tester `in` d'abord.
- **Croire que `in` cherche dans les valeurs.**
- **Utiliser un indice** : `d[0]` pour « le premier élément ».
- **Oublier les guillemets** : `d[Léa]` au lieu de `d["Léa"]` (NameError).
- **Parcourir avec `for k in d` et croire obtenir les valeurs.**
- **Mettre un tableau comme clé.**
:::

## En classe

:::methode[Activités qui marchent]
1. **Annuaire, traducteur** : un dictionnaire français-anglais, on traduit une phrase mot à mot.
2. **Comptages** : fréquence des lettres d'un texte (lien avec le chiffre de César et l'analyse fréquentielle), votes d'une élection.
3. **EXIF** : afficher les métadonnées d'une photo des élèves (lien SNT photographie).
4. **Table d'élèves** : un tableau de dictionnaires, avec des requêtes simples (filtrer, moyenne d'un champ), avant le chapitre sur les CSV.
:::

## L'essentiel

- Un **dictionnaire** associe des **clés uniques** à des **valeurs** : `d = {"a": 1}` ; lecture `d[cle]`.
- `d[cle] = v` **ajoute** ou **modifie** ; `cle in d` teste la présence d'une **clé** (évite la `KeyError`).
- Parcours : `for k in d` (clés), `d.values()`, `d.items()` avec `for k, v in d.items()`.
- Schéma de **comptage** : si la clé existe, +1 ; sinon, créer à 1.
- Un dictionnaire représente un **enregistrement** ; un tableau de dictionnaires, une **table**.
- Clés **non modifiables** (nombres, chaînes, p-uplets) ; pas d'indice.

## Exercices

::::exercice[Grand QCM : les dictionnaires]{niveau=1 type=quiz}
Douze questions sur les dictionnaires.

1. Avec `d = {"a": 3, "b": 7}`, que vaut `d["b"]` ?

   - [ ] `"b"`
   - [x] 7
   - [ ] 3
   - [ ] 1

   > On accède à la valeur par sa clé.

1. Que contient `d` après `d = {"a": 3}` puis `d["a"] = 5` ?

   - [ ] `{"a": 3, "a": 5}`
   - [x] `{"a": 5}`
   - [ ] `{"a": 8}`
   - [ ] une erreur

   > Les clés sont uniques : la valeur est remplacée.

1. Que contient `d` après `d = {"a": 3}` puis `d["b"] = 5` ?

   - [ ] une erreur, la clé n'existe pas
   - [x] `{"a": 3, "b": 5}`
   - [ ] `{"b": 5}`
   - [ ] `{"a": 5}`

   > L'affectation crée l'entrée si la clé est nouvelle.

1. Que provoque `d["z"]` si `"z"` n'est pas une clé de `d` ?

   - [ ] `None`
   - [ ] 0
   - [x] une `KeyError`
   - [ ] une chaîne vide

   > Il faut tester `"z" in d` avant.

1. Avec `d = {"x": 10, "y": 20}`, que vaut `10 in d` ?

   - [ ] `True`
   - [x] `False`
   - [ ] 10
   - [ ] une erreur

   > `in` teste les clés : `"x"` et `"y"`, pas les valeurs.

1. Que parcourt `for k in d:` ?

   - [x] les clés
   - [ ] les valeurs
   - [ ] les couples (clé, valeur)
   - [ ] les indices 0, 1, 2…

   > C'est équivalent à `for k in d.keys()`.

1. Quelle méthode donne les couples (clé, valeur) ?

   - [ ] `keys()`
   - [ ] `values()`
   - [x] `items()`
   - [ ] `pairs()`

   > `for k, v in d.items()`.

1. Que vaut `len({"a": 1, "b": 1, "c": 2})` ?

   - [ ] 2
   - [x] 3
   - [ ] 4
   - [ ] 6

   > Trois entrées ; que deux valeurs soient égales n'a pas d'importance.

1. Lequel ne peut **pas** être une clé de dictionnaire ?

   - [ ] `"NSI"`
   - [ ] `42`
   - [ ] `(3, 4)`
   - [x] `[3, 4]`

   > Un tableau est modifiable, il ne peut pas servir de clé.

1. Après le comptage des lettres de `"aba"` avec le schéma du cours, que vaut le dictionnaire ?

   - [ ] `{"a": 1, "b": 1}`
   - [x] `{"a": 2, "b": 1}`
   - [ ] `{"aba": 3}`
   - [ ] `[2, 1]`

   > 'a' apparaît deux fois et 'b' une fois.

1. Avec `d = {0: "zéro", 5: "cinq"}`, que vaut `d[0]` ?

   - [x] `"zéro"`
   - [ ] la première entrée, quelle qu'elle soit
   - [ ] une erreur
   - [ ] `"cinq"`

   > Ici 0 est une clé : `d[0]` cherche la clé 0, pas une position.

1. Pour représenter la fiche d'un livre (titre, auteur, année), on utilise de préférence :

   - [ ] un tableau `["titre", "auteur", 1887]`
   - [x] un dictionnaire `{"titre": ..., "auteur": ..., "annee": ...}`
   - [ ] trois variables séparées
   - [ ] une chaîne de caractères

   > Un enregistrement : chaque champ a un nom.
::::

::::exercice[Compter les mots]{niveau=1}
Écris `compter_mots(phrase)` qui renvoie un dictionnaire associant à chaque mot de la phrase son nombre d'occurrences. Les mots sont séparés par
des espaces : `phrase.split()` donne le tableau des mots.

```python depart
def compter_mots(phrase):
    ...
```

```python tests
assert compter_mots("le chat et le chien") == {"le": 2, "chat": 1, "et": 1, "chien": 1}, "phrase simple"
assert compter_mots("oui oui oui") == {"oui": 3}, "un seul mot répété"
assert compter_mots("") == {}, "phrase vide"
```

:::corrige
```python solution
def compter_mots(phrase):
    compte = {}
    for mot in phrase.split():
        if mot in compte:
            compte[mot] = compte[mot] + 1
        else:
            compte[mot] = 1
    return compte
```

C'est exactement le schéma de comptage du cours, appliqué aux mots au lieu des lettres.
:::
::::

::::exercice[Le mot le plus fréquent]{niveau=2}
Écris `plus_frequent(compte)` qui reçoit un dictionnaire non vide de comptages (comme celui de l'exercice précédent) et renvoie la clé ayant la
plus grande valeur. En cas d'égalité, renvoie n'importe laquelle des clés à égalité.

```python depart
def plus_frequent(compte):
    ...
```

```python tests
assert plus_frequent({"le": 2, "chat": 1, "et": 1}) == "le", "le gagne"
assert plus_frequent({"a": 1}) == "a", "une seule clé"
assert plus_frequent({"x": 3, "y": 7, "z": 5}) == "y", "y gagne"
```

:::corrige
```python solution
def plus_frequent(compte):
    meilleur = None
    for cle, valeur in compte.items():
        if meilleur is None or valeur > compte[meilleur]:
            meilleur = cle
    return meilleur
```

On retient la **clé** du meilleur, pas sa valeur : on peut toujours retrouver la valeur avec `compte[meilleur]`.
:::
::::

::::exercice[Traducteur mot à mot]{niveau=2}
Écris `traduire(phrase, dico)` qui traduit une phrase mot à mot avec un dictionnaire. Un mot absent du dictionnaire est gardé tel quel. Les mots
traduits sont recollés avec des espaces : `" ".join(tableau)` donne la chaîne.

```python depart
def traduire(phrase, dico):
    ...
```

```python tests
fr_en = {"le": "the", "chat": "cat", "noir": "black", "dort": "sleeps"}
assert traduire("le chat dort", fr_en) == "the cat sleeps", "tout est connu"
assert traduire("le chat de Léa", fr_en) == "the cat de Léa", "mots inconnus gardés"
assert traduire("", fr_en) == "", "phrase vide"
```

:::corrige
```python solution
def traduire(phrase, dico):
    resultat = []
    for mot in phrase.split():
        if mot in dico:
            resultat.append(dico[mot])
        else:
            resultat.append(mot)
    return " ".join(resultat)
```

Le test `if mot in dico` évite la `KeyError` sur les mots inconnus.
:::
::::

::::exercice[Une table d'élèves]{niveau=2}
Une classe est un tableau de dictionnaires `{"nom": ..., "option": ..., "note": ...}`. Écris :

- `moyenne_option(classe, option)` qui renvoie la moyenne des notes des élèves de cette option, ou `None` si personne ne la suit ;
- `effectifs(classe)` qui renvoie un dictionnaire associant à chaque option le nombre d'élèves qui la suivent.

```python depart
def moyenne_option(classe, option):
    ...

def effectifs(classe):
    ...
```

```python tests
classe = [
    {"nom": "Léa", "option": "NSI", "note": 16},
    {"nom": "Tom", "option": "SES", "note": 11},
    {"nom": "Inès", "option": "NSI", "note": 12},
    {"nom": "Noé", "option": "HGGSP", "note": 14},
]
assert moyenne_option(classe, "NSI") == 14, "moyenne NSI"
assert moyenne_option(classe, "SVT") is None, "option absente"
assert effectifs(classe) == {"NSI": 2, "SES": 1, "HGGSP": 1}, "effectifs"
assert effectifs([]) == {}, "classe vide"
```

:::corrige
```python solution
def moyenne_option(classe, option):
    total = 0
    nb = 0
    for eleve in classe:
        if eleve["option"] == option:
            total = total + eleve["note"]
            nb = nb + 1
    if nb == 0:
        return None
    return total / nb

def effectifs(classe):
    compte = {}
    for eleve in classe:
        opt = eleve["option"]
        if opt in compte:
            compte[opt] = compte[opt] + 1
        else:
            compte[opt] = 1
    return compte
```

On prépare ici le chapitre sur les données en tables : chaque dictionnaire est une ligne, chaque clé une colonne.
:::
::::

::::exercice[Tableau ou dictionnaire ?]{niveau=2}
Un élève demande : « Pourquoi utiliser un dictionnaire alors qu'on a déjà les tableaux ? » Réponds-lui avec deux exemples concrets, un où le
tableau convient mieux et un où le dictionnaire convient mieux.

:::criteres
- Tableau : les données sont repérées par une **position** (notes dans l'ordre, pixels, classement).
- Dictionnaire : les données sont repérées par un **nom** (annuaire, comptage de mots, fiche).
- Mention de l'accès direct par la clé, sans chercher dans tout le tableau.
:::

:::corrige
On choisit selon la façon dont on **retrouve** une donnée. Si c'est par sa **position** — la 3e note du trimestre, le pixel de la ligne 10,
le 1er du classement —, un **tableau** convient : `notes[2]`. Si c'est par un **nom** — le numéro de téléphone de Léa, le nombre
d'occurrences du mot « chat », l'auteur d'un livre —, un **dictionnaire** convient : `annuaire["Léa"]`. Avec un tableau de couples, il
faudrait parcourir tout le tableau pour trouver Léa ; avec le dictionnaire, on y accède directement par la clé.
:::
::::
