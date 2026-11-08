---
titre: p-uplets et p-uplets nommés
resume: "Regrouper plusieurs valeurs, renvoyer plusieurs résultats depuis une fonction, nommer les champs d'un enregistrement."
duree: 30
objectifs:
  - "Créer un p-uplet et lire ses éléments"
  - "Écrire une fonction qui renvoie un p-uplet"
  - "Représenter un enregistrement avec un dictionnaire"
---

Un **p-uplet** (`tuple` en Python) regroupe plusieurs valeurs dans une seule variable : les coordonnées d'un point, ou une couleur en rouge, vert, bleu.

## 1. Créer et lire

```python exec
point = (3, 5)
eleve = ("Léa", 15, True)
print(point[0], eleve[1], len(eleve))
```

Les indices commencent à **0**. Un p-uplet **ne se modifie pas** : `point[0] = 10` provoque une erreur.

## 2. Dépaqueter

```python exec
x, y = (3, 5)
print(x, y)
```

## 3. Renvoyer plusieurs valeurs

Une fonction peut renvoyer un p-uplet. C'est ce que demande le programme.

```python exec
def division(a, b):
    return (a // b, a % b)

q, r = division(17, 5)
print(q, r)
```

## 4. Les p-uplets nommés

Dans `("Léa", 15)`, il faut se souvenir que l'indice 1 est l'âge. Un **p-uplet nommé** donne un **nom** à chaque valeur. En Python, on utilise un dictionnaire :

```python exec
eleve = {"nom": "Léa", "age": 15}
print(eleve["age"])
```

## L'essentiel

- Un p-uplet s'écrit entre parenthèses, se lit par indice à partir de 0 et ne se modifie pas.
- `x, y = point` dépaquette un p-uplet.
- Une fonction renvoie plusieurs valeurs avec `return (a, b)`.
- Un p-uplet nommé associe un nom à chaque valeur : en Python, un dictionnaire.

## Exercices

::::exercice[QCM : p-uplets]{niveau=1 type=quiz}
Une question à la fois : la correction s'affiche aussitôt.

1. Avec `p = (4, 8, 15)`, que vaut `p[1]` ?

   - [ ] 4
   - [x] 8
   - [ ] 15
   - [ ] une erreur

   > Les indices commencent à 0 : p[1] est le deuxième élément.

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

1. Que renvoie `division(17, 5)` si la fonction se termine par `return (a // b, a % b)` ?

   - [ ] 3.4
   - [x] (3, 2)
   - [ ] 3 et 2 affichés à l'écran
   - [ ] (2, 3)

   > Un couple : le quotient puis le reste.

1. Comment représenter en Python un p-uplet nommé décrivant un livre (titre, auteur, année) ?

   - [ ] `("titre", "auteur", "annee")`
   - [x] `{"titre": "Le Horla", "auteur": "Maupassant", "annee": 1887}`
   - [ ] `["Le Horla", "Maupassant", 1887]` uniquement
   - [ ] ce n'est pas possible

   > Un dictionnaire : chaque valeur est repérée par un nom.
::::

::::exercice[Compléter une fonction]{niveau=1 type=completer}
Cette fonction renvoie le plus petit et le plus grand de deux nombres. Complète-la.

```python trous
def ordonner(a, b):
    if a < b:
        return ([[a]], [[b]])
    return ([[b]], [[a]])
```
::::

::::exercice[Milieu d'un segment]{niveau=2}
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

::::exercice[Un trajet GPS]{niveau=3}
Un trajet est un tableau de points, chaque point étant un couple `(x, y)`, en kilomètres. Des stations sont représentées par des p-uplets nommés : `{"nom": "Gare", "pos": (1, 2)}`.

1. Écris `distance(a, b)`, qui renvoie la distance entre deux points.
2. Écris `longueur(trajet)`, qui renvoie la longueur totale d'un trajet.
3. Écris `extremes(trajet)`, qui renvoie le couple `(x_min, x_max)` des abscisses d'un trajet non vide.
4. Écris `plus_proche(stations, p)`, qui renvoie le nom de la station la plus proche du point `p`, dans un tableau non vide.
5. À l'écrit : pourquoi un p-uplet convient-il pour un point ? Pourquoi un p-uplet nommé est-il plus clair pour une station ?

```python depart
from math import sqrt

def distance(a, b):
    ...

def longueur(trajet):
    ...

def extremes(trajet):
    ...

def plus_proche(stations, p):
    ...
```

```python tests
assert distance((0, 0), (3, 4)) == 5, "distance"
assert longueur([(0, 0), (3, 4), (3, 10)]) == 11, "deux segments"
assert longueur([(1, 1)]) == 0, "un seul point"
assert extremes([(3, 0), (-1, 5), (7, 2)]) == (-1, 7), "extrêmes"
s = [{"nom": "Gare", "pos": (1, 2)}, {"nom": "Port", "pos": (10, 0)}]
assert plus_proche(s, (2, 2)) == "Gare", "la plus proche"
assert plus_proche(s, (9, 1)) == "Port", "autre station"
```

:::corrige
```python solution
from math import sqrt

def distance(a, b):
    return sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2)

def longueur(trajet):
    total = 0
    for i in range(len(trajet) - 1):
        total = total + distance(trajet[i], trajet[i + 1])
    return total

def extremes(trajet):
    x_min = trajet[0][0]
    x_max = trajet[0][0]
    for p in trajet:
        if p[0] < x_min:
            x_min = p[0]
        if p[0] > x_max:
            x_max = p[0]
    return (x_min, x_max)

def plus_proche(stations, p):
    meilleure = stations[0]
    for s in stations:
        if distance(s["pos"], p) < distance(meilleure["pos"], p):
            meilleure = s
    return meilleure["nom"]
```

**Question 5.** Un point regroupe peu de valeurs, toujours dans le même ordre, et ne change pas : un p-uplet convient. Pour une station, `s["nom"]` est plus lisible qu'un indice.
:::
::::
