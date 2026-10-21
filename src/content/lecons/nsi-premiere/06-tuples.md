---
titre: p-uplets et p-uplets nommés
resume: "Le cours de première NSI sur les p-uplets (tuple en Python) : regrouper plusieurs valeurs, accéder par indice, dépaqueter, renvoyer plusieurs valeurs depuis une fonction, non-modifiabilité ; et les p-uplets nommés, représentés en Python par des dictionnaires."
duree: 35
objectifs:
  - "Créer un p-uplet, accéder à ses éléments par indice et le dépaqueter"
  - "Écrire une fonction qui renvoie un p-uplet de valeurs"
  - "Savoir qu'un p-uplet n'est pas modifiable"
  - "Représenter un p-uplet nommé (enregistrement) par un dictionnaire"
prerequis: [snt-python/fonctions]
programme: [nsi1-construits]
cartes:
  - q: "Qu'est-ce qu'un p-uplet ?"
    r: "Une suite **ordonnée** et **non modifiable** de p valeurs, éventuellement de types différents. En Python : `(15, \"Léa\", True)`, de type `tuple`."
  - q: "Comment accéder au deuxième élément de `p = (3, 7, 9)` ?"
    r: "`p[1]` (les indices commencent à 0), qui vaut 7."
  - q: "Que fait `x, y = (4, 9)` ?"
    r: "Il **dépaquette** le p-uplet : x reçoit 4 et y reçoit 9."
  - q: "Comment une fonction peut-elle renvoyer deux valeurs ?"
    r: "En renvoyant un p-uplet : `return (q, r)` ; à l'appel, `q, r = division(17, 5)`."
  - q: "Peut-on modifier un élément d'un p-uplet ?"
    r: "Non : `p[0] = 5` provoque une `TypeError`. On crée un nouveau p-uplet."
  - q: "Qu'est-ce qu'un p-uplet nommé ?"
    r: "Un p-uplet dont les éléments sont repérés par un **nom** plutôt qu'un indice ; en Python, on le représente par un dictionnaire : `{\"nom\": \"Léa\", \"age\": 15}`."
---

Les types construits permettent de **regrouper** plusieurs valeurs dans une seule. Le plus simple est le **p-uplet** (un couple, un triplet…), que
Python appelle `tuple`. Il sert partout : coordonnées d'un point, couleur (r, v, b), résultat multiple d'une fonction. C'est un chapitre court, qui
prépare les tableaux et les dictionnaires.

## Ce que dit le programme

Contenu : *p-uplets, p-uplets nommés*. Capacité attendue : **écrire une fonction renvoyant un p-uplet de valeurs**. Les commentaires du programme
(dictionnaires) précisent qu'en Python, **les p-uplets nommés sont implémentés par des dictionnaires**.

## 1. Créer et lire un p-uplet

Un **p-uplet** est une suite **ordonnée** de p valeurs, entre parenthèses, séparées par des virgules. Les valeurs peuvent être de types différents.

```python exec
point = (3, 5)                    # un couple
pixel = (255, 128, 0)             # un triplet
eleve = ("Léa", 15, True)         # types différents
print(point[0], pixel[2], eleve[1], len(eleve))
```

- On accède à un élément par son **indice**, qui commence à **0** : `pixel[0]` vaut 255.
- `len` donne le nombre d'éléments.
- On peut parcourir un p-uplet avec `for`.

## 2. Dépaqueter

On peut affecter tous les éléments d'un coup à des variables : c'est le **dépaquetage**.

```python exec
r, v, b = (255, 128, 0)
print(r, v, b)
a, b = 3, 7
a, b = b, a                       # l'échange de variables utilise un p-uplet
print(a, b)
```

## 3. Une fonction qui renvoie plusieurs valeurs

Une fonction ne renvoie qu'**une** valeur… mais cette valeur peut être un p-uplet. C'est la capacité attendue du programme.

```python exec
def division(a, b):
    """Renvoie le quotient et le reste de la division de a par b."""
    return (a // b, a % b)

q, r = division(17, 5)
print("17 = 5 ×", q, "+", r)

def min_max(t):
    """Renvoie le plus petit et le plus grand élément de t (non vide)."""
    mini = t[0]
    maxi = t[0]
    for x in t:
        if x < mini:
            mini = x
        if x > maxi:
            maxi = x
    return (mini, maxi)

print(min_max((12, 5, 18, 9)))
```

## 4. Un p-uplet n'est pas modifiable

Un p-uplet est **non mutable** : on ne peut pas modifier un de ses éléments.

```python exec erreur
point = (3, 5)
point[0] = 10        # TypeError : 'tuple' object does not support item assignment
```

Pour « changer » un point, on en crée un nouveau : `point = (10, point[1])`. C'est une sécurité : une donnée qui ne doit pas changer (une date de
naissance, une coordonnée de référence) ne peut pas être modifiée par erreur.

## 5. Les p-uplets nommés

Dans `("Léa", 15, "2D1")`, il faut se souvenir que l'indice 1 est l'âge : ce n'est pas lisible. Un **p-uplet nommé** (ou **enregistrement**) repère
chaque valeur par un **nom** (un champ). En Python, on le représente par un **dictionnaire** (voir le chapitre sur les dictionnaires) :

```python exec
eleve = {"nom": "Léa", "age": 15, "classe": "2D1"}
print(eleve["nom"], "a", eleve["age"], "ans")
```

Les métadonnées EXIF d'une photo (date, appareil, dimensions…) sont un bon exemple d'enregistrement.

## Les erreurs classiques des élèves

:::attention[Ce que tu verras en classe]
- **Commencer les indices à 1** : `p[1]` est le **deuxième** élément.
- **Vouloir modifier un p-uplet** (`TypeError`).
- **Oublier la virgule** pour un p-uplet d'un seul élément : `(5)` est le nombre 5, `(5,)` est un p-uplet.
- **Dépaqueter avec un mauvais nombre de variables** : `a, b = (1, 2, 3)` provoque une erreur.
- **Afficher au lieu de renvoyer** les deux valeurs (`print(q, r)` dans la fonction).
:::

## En classe

:::methode[Activités qui marchent]
1. **Points du plan** : distance entre deux points donnés par des couples, milieu d'un segment (une fonction qui renvoie un couple).
2. **Couleurs** : un pixel est un triplet ; écrire des fonctions qui renvoient le négatif, le gris.
3. **Fonctions à plusieurs résultats** : quotient et reste, minimum et maximum, moyenne et écart.
4. **Lisibilité** : réécrire un p-uplet `("Léa", 15, "2D1")` en dictionnaire et comparer.
:::

## L'essentiel

- Un **p-uplet** (`tuple`) est une suite **ordonnée** de valeurs entre parenthèses ; accès par indice à partir de **0**.
- **Dépaqueter** : `x, y = point`.
- Une fonction **renvoie plusieurs valeurs** en renvoyant un p-uplet : `return (q, r)`.
- Un p-uplet n'est **pas modifiable**.
- **P-uplet nommé** (enregistrement) : valeurs repérées par des noms ; en Python, un **dictionnaire**.

## Exercices

::::exercice[Grand QCM : p-uplets]{niveau=1 type=quiz}
Dix questions sur les p-uplets.

1. Avec `p = (4, 8, 15)`, que vaut `p[1]` ?

   - [ ] 4
   - [x] 8
   - [ ] 15
   - [ ] une erreur

   > Les indices commencent à 0 : p[1] est le deuxième élément.

1. Que vaut `len((4, 8, 15, 16))` ?

   - [ ] 3
   - [x] 4
   - [ ] 16
   - [ ] 43

   > Quatre éléments.

1. Après `a, b, c = (1, 2, 3)`, que vaut `c` ?

   - [ ] 1
   - [ ] 2
   - [x] 3
   - [ ] (1, 2, 3)

   > Dépaquetage : chaque variable reçoit l'élément à sa position.

1. Que provoque `p[0] = 9` si `p = (1, 2)` ?

   - [ ] p devient (9, 2)
   - [x] une erreur, car un p-uplet n'est pas modifiable
   - [ ] p devient (9, 1, 2)
   - [ ] rien

   > `TypeError` : on crée un nouveau p-uplet à la place.

1. Quel est le type de `(5,)` ?

   - [ ] `int`
   - [x] `tuple`
   - [ ] `list`
   - [ ] `str`

   > La virgule fait le p-uplet ; `(5)` serait simplement le nombre 5.

1. Que renvoie `division(17, 5)` si la fonction se termine par `return (a // b, a % b)` ?

   - [ ] 3.4
   - [x] (3, 2)
   - [ ] 3 et 2 affichés à l'écran
   - [ ] (2, 3)

   > Un couple : le quotient puis le reste.

1. Que vaut `a` après `a, b = 3, 7` puis `a, b = b, a` ?

   - [ ] 3
   - [x] 7
   - [ ] (7, 3)
   - [ ] une erreur

   > L'échange se fait en une instruction grâce aux p-uplets.

1. Comment représenter en Python un p-uplet nommé décrivant un livre (titre, auteur, année) ?

   - [ ] `("titre", "auteur", "annee")`
   - [x] `{"titre": "Le Horla", "auteur": "Maupassant", "annee": 1887}`
   - [ ] `["Le Horla", "Maupassant", 1887]` uniquement
   - [ ] ce n'est pas possible

   > Un dictionnaire : chaque valeur est repérée par un nom.

1. Qu'affiche `for x in (2, 4, 6): print(x * 10)` ?

   - [x] 20, 40 et 60, une valeur par ligne
   - [ ] 2, 4 et 6
   - [ ] (20, 40, 60)
   - [ ] une erreur

   > On peut parcourir un p-uplet avec `for`.

1. Pourquoi une fonction renvoie-t-elle un p-uplet plutôt que d'afficher ses deux résultats ?

   - [ ] parce que `print` est interdit
   - [x] pour que le programme puisse réutiliser les deux valeurs
   - [ ] parce que c'est plus rapide
   - [ ] parce qu'un p-uplet est modifiable

   > `return` donne les valeurs au programme ; `print` ne fait que les montrer.
::::

::::exercice[Milieu d'un segment]{niveau=1}
Les points sont des couples `(x, y)`. Écris `milieu(a, b)` qui renvoie le milieu du segment [ab].

```python depart
def milieu(a, b):
    ...
```

```python tests
assert milieu((0, 0), (4, 2)) == (2, 1), "milieu de (0,0) et (4,2)"
assert milieu((1, 3), (3, 7)) == (2, 5), "autre exemple"
assert milieu((-2, 0), (2, 0)) == (0, 0), "symétrique"
```

:::corrige
```python solution
def milieu(a, b):
    xa, ya = a
    xb, yb = b
    return ((xa + xb) / 2, (ya + yb) / 2)
```

`(2.0, 1.0) == (2, 1)` vaut `True` en Python : les flottants entiers sont égaux aux entiers correspondants.
:::
::::

::::exercice[Minimum, maximum et moyenne]{niveau=2}
Écris `statistiques(notes)` qui reçoit un p-uplet non vide de notes et renvoie le triplet `(minimum, maximum, moyenne)`, sans utiliser `min`, `max`
ni `sum`.

```python depart
def statistiques(notes):
    ...
```

```python tests
assert statistiques((12, 8, 16)) == (8, 16, 12), "trois notes"
assert statistiques((10,)) == (10, 10, 10), "une seule note"
assert statistiques((5, 15, 10, 10)) == (5, 15, 10), "quatre notes"
```

:::corrige
```python solution
def statistiques(notes):
    mini = notes[0]
    maxi = notes[0]
    total = 0
    for n in notes:
        if n < mini:
            mini = n
        if n > maxi:
            maxi = n
        total = total + n
    return (mini, maxi, total / len(notes))
```

À l'appel : `mini, maxi, moy = statistiques(mes_notes)`.
:::
::::

::::exercice[p-uplet ou dictionnaire ?]{niveau=2}
Pour chacune des données suivantes, dis s'il vaut mieux utiliser un p-uplet ou un p-uplet nommé (dictionnaire), et justifie : (a) les coordonnées
(x, y) d'un point ; (b) la fiche d'un élève (nom, prénom, date de naissance, classe, option) ; (c) la couleur (r, v, b) d'un pixel ; (d) les
informations d'une photo (date, appareil, largeur, hauteur, flash, GPS).

:::criteres
- (a) et (c) : p-uplet, car l'ordre est conventionnel et connu, et il y a peu de valeurs.
- (b) et (d) : dictionnaire, car beaucoup de champs dont le nom rend le code lisible.
- La justification parle de lisibilité et de convention.
:::

:::corrige
(a) **p-uplet** : un point est toujours (x, y), tout le monde connaît l'ordre. (c) **p-uplet** : (r, v, b) est une convention universelle, trois
valeurs. (b) **dictionnaire** : cinq champs différents ; `eleve["classe"]` est bien plus lisible que `eleve[3]`. (d) **dictionnaire** : beaucoup de
champs, et c'est exactement ainsi que sont présentées les métadonnées EXIF. Règle pratique : peu de valeurs dans un ordre évident, p-uplet ; des
champs nombreux ou de sens différents, dictionnaire.
:::
::::
