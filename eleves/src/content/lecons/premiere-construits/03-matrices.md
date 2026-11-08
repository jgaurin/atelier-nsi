---
titre: Compréhensions et matrices
resume: "Construire un tableau en une ligne, et représenter une grille par un tableau de tableaux."
duree: 35
objectifs:
  - "Construire un tableau par compréhension"
  - "Lire et parcourir une matrice avec `a[i][j]`"
prerequis: [premiere-construits/tableaux]
---

Deux outils très courants : la **compréhension**, pour construire un tableau en une ligne, et le **tableau de tableaux**, pour représenter une grille.

## 1. Construire par compréhension

```python exec
carres = [i * i for i in range(5)]
notes = [12, 8, 15, 6]
admis = [n for n in notes if n >= 10]
print(carres, admis)
```

La forme générale est `[expression for x in sequence if condition]`. Le `if` est facultatif.

## 2. Les matrices

Une **matrice** est un tableau de lignes. `m[i][j]` désigne la **ligne i, colonne j**.

```python exec
m = [[1, 2, 3],
     [4, 5, 6]]
print(m[1][2], len(m), len(m[0]))

total = 0
for i in range(len(m)):
    for j in range(len(m[0])):
        total = total + m[i][j]
print(total)
```

Pour créer une grille de zéros, on écrit :

```python exec
g = [[0] * 4 for i in range(3)]   # 3 lignes, 4 colonnes
print(g)
```

:::attention
`[[0] * 4] * 3` répète **la même** ligne trois fois : modifier une case modifie toute la colonne.
:::

## L'essentiel

- `[f(x) for x in t if condition]` construit un nouveau tableau.
- `m[i][j]` : ligne i, colonne j. `len(m)` : nombre de lignes. `len(m[0])` : nombre de colonnes.
- On parcourt une matrice avec deux boucles imbriquées.

## Exercices

::::exercice[Lire une compréhension]{niveau=1 type=reponses}
Donne le tableau obtenu.

1. Quel tableau obtient-on ?

   ```python verifier
   print([2 * i for i in range(4)])
   ```

   - [0, 2, 4, 6]

1. Quel tableau obtient-on ?

   ```python verifier
   print([x for x in [4, 11, 7, 15] if x > 8])
   ```

   - [11, 15]

1. Quel tableau obtient-on ?

   ```python verifier
   print([c for c in "NSI" if c != "S"])
   ```

   - ['N', 'I']
::::

::::exercice[Lire une matrice]{niveau=1 type=reponses}
On considère `m = [[1, 2], [3, 4], [5, 6]]`.

1. Que vaut `m[2][0]` ?

   ```python calcul
   print([[1, 2], [3, 4], [5, 6]][2][0])
   ```

   - 5

1. Que vaut `m[0][1]` ?

   ```python calcul
   print([[1, 2], [3, 4], [5, 6]][0][1])
   ```

   - 2

1. Que vaut `len(m)` ?

   ```python calcul
   print(len([[1, 2], [3, 4], [5, 6]]))
   ```

   - 3

1. Que vaut `len(m[0])` ?

   ```python calcul
   print(len([[1, 2], [3, 4], [5, 6]][0]))
   ```

   - 2
::::

::::exercice[Traduire en compréhension]{niveau=2 type=completer}
Les deux codes construisent le même tableau. Complète le second.

```python
resultat = []
for x in t:
    if x % 2 == 0:
        resultat.append(x * x)
```

```python trous
resultat = [[[x * x]] for [[x]] in [[t]] if [[x % 2 == 0]]]
```
::::

::::exercice[Image en niveaux de gris]{niveau=2}
Une image en niveaux de gris est une matrice d'entiers entre 0 (noir) et 255 (blanc). Écris :

- `negatif(img)` qui renvoie une **nouvelle** image où chaque pixel p devient 255 - p ;
- `seuillage(img, s)` qui renvoie une nouvelle image où chaque pixel devient 255 s'il est supérieur ou égal à s, et 0 sinon.

```python depart
def negatif(img):
    ...

def seuillage(img, s):
    ...
```

```python tests
img = [[0, 100], [200, 255]]
assert negatif(img) == [[255, 155], [55, 0]], "négatif"
assert img == [[0, 100], [200, 255]], "l'image de départ n'est pas modifiée"
assert seuillage(img, 128) == [[0, 0], [255, 255]], "seuillage à 128"
assert seuillage([[50, 60, 70]], 60) == [[0, 255, 255]], "une ligne, trois colonnes"
```

:::corrige
```python solution
def negatif(img):
    return [[255 - p for p in ligne] for ligne in img]

def seuillage(img, s):
    resultat = []
    for ligne in img:
        nouvelle = []
        for p in ligne:
            if p >= s:
                nouvelle.append(255)
            else:
                nouvelle.append(0)
        resultat.append(nouvelle)
    return resultat
```

Les deux styles sont corrects : compréhension imbriquée pour le négatif, boucles imbriquées avec `append` pour le seuillage.
:::
::::

::::exercice[Somme des lignes et des colonnes]{niveau=2}
Écris `sommes_lignes(m)` et `sommes_colonnes(m)` qui renvoient respectivement le tableau des sommes de chaque ligne et de chaque colonne d'une
matrice rectangulaire non vide. Puis `est_magique(m)` qui renvoie `True` si toutes les lignes et toutes les colonnes d'une matrice carrée ont la
même somme.

```python depart
def sommes_lignes(m):
    ...

def sommes_colonnes(m):
    ...

def est_magique(m):
    ...
```

```python tests
m = [[1, 2, 3], [4, 5, 6]]
assert sommes_lignes(m) == [6, 15], "lignes"
assert sommes_colonnes(m) == [5, 7, 9], "colonnes"
assert est_magique([[2, 7, 6], [9, 5, 1], [4, 3, 8]]), "carré magique 3x3"
assert not est_magique([[1, 2], [3, 4]]), "pas magique"
```

:::corrige
```python solution
def sommes_lignes(m):
    resultat = []
    for ligne in m:
        s = 0
        for x in ligne:
            s = s + x
        resultat.append(s)
    return resultat

def sommes_colonnes(m):
    resultat = []
    for j in range(len(m[0])):
        s = 0
        for i in range(len(m)):
            s = s + m[i][j]
        resultat.append(s)
    return resultat

def est_magique(m):
    toutes = sommes_lignes(m) + sommes_colonnes(m)
    for s in toutes:
        if s != toutes[0]:
            return False
    return True
```

Pour les colonnes, la boucle extérieure porte sur j (la colonne) et la boucle intérieure sur i (les lignes). On réutilise les deux premières
fonctions dans la troisième.
:::
::::
