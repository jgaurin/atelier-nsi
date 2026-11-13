---
titre: Compréhensions et matrices
resume: "Construire un tableau en une ligne, et représenter une grille par un tableau de tableaux."
duree: 35
objectifs:
  - "Construire un tableau par compréhension"
  - "Lire et parcourir une matrice avec `a[i][j]`"
prerequis: [premiere-construits/tableaux]
---

Deux outils très utiles : la **compréhension**, pour construire un tableau en une seule ligne, et le **tableau de tableaux**, pour représenter une grille comme une image ou un plateau de jeu.

## 1. Construire un tableau par compréhension

Pour obtenir les carrés de 0 à 4, on pourrait écrire une boucle :

```python exec
carres = []
for i in range(5):
    carres.append(i * i)
print(carres)
```

La **compréhension** fait la même chose en une ligne :

```python exec
carres = [i * i for i in range(5)]
print(carres)
```

Elle se lit presque comme une phrase : « le tableau des `i * i`, pour `i` allant de 0 à 4 ».

On peut ajouter une condition, pour ne garder que certains éléments :

```python exec
notes = [12, 8, 15, 6]
admis = [n for n in notes if n >= 10]
print(admis)
```

« Le tableau des `n`, pour chaque `n` de `notes`, si `n` est au moins 10. »

La forme générale est `[expression for x in sequence if condition]`. Le `if` est facultatif.

## 2. Les matrices

Une **matrice** est un tableau de lignes, chaque ligne étant elle-même un tableau.

```python exec
m = [[1, 2, 3],
     [4, 5, 6]]
print(m[1][2], len(m), len(m[0]))
```

| | colonne 0 | colonne 1 | colonne 2 |
| --- | --- | --- | --- |
| **ligne 0** | 1 | 2 | 3 |
| **ligne 1** | 4 | 5 | 6 |

- `m[1]` est la ligne 1 : `[4, 5, 6]`.
- `m[1][2]` est la case de la ligne 1, colonne 2 : **6**. On lit d'abord la ligne, puis la colonne.
- `len(m)` donne le nombre de lignes, ici 2, et `len(m[0])` le nombre de colonnes, ici 3.

## 3. Parcourir une matrice

On utilise **deux boucles imbriquées** : une sur les lignes, et dans chaque ligne, une sur les colonnes.

```python exec
m = [[1, 2, 3],
     [4, 5, 6]]
total = 0
for i in range(len(m)):
    for j in range(len(m[0])):
        total = total + m[i][j]
print(total)
```

`i` prend les valeurs 0 et 1. Pour chacune, `j` prend 0, 1 et 2 : on visite les 6 cases, ligne par ligne.

## 4. Créer une grille vide

```python exec
g = [[0] * 4 for i in range(3)]
g[0][0] = 9
print(g)
```

On obtient 3 lignes de 4 zéros, et seule la première case est modifiée.

:::attention
`[[0] * 4] * 3` semble faire la même chose, mais il répète **trois fois la même ligne**, comme `b = a` pour un tableau. Modifier `g[0][0]` modifierait alors toute la colonne 0. La compréhension, elle, fabrique une nouvelle ligne à chaque tour.
:::

## L'essentiel

- `[f(x) for x in t if condition]` construit un nouveau tableau en une ligne.
- `m[i][j]` : ligne i, colonne j. `len(m)` : nombre de lignes. `len(m[0])` : nombre de colonnes.
- On parcourt une matrice avec deux boucles imbriquées.
- On crée une grille avec `[[0] * p for i in range(n)]`, jamais avec `[[0] * p] * n`.

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

::::exercice[Le morpion]{niveau=3}
Une grille de morpion est une matrice carrée. Une case contient `"X"`, `"O"` ou `""` si elle est vide.

1. Écris `grille_vide(n)`, qui renvoie une grille vide de côté `n`.
2. Écris `ligne_pleine(g, i, s)`, qui renvoie `True` si toutes les cases de la ligne `i` contiennent `s`.
3. Écris `colonne_pleine(g, j, s)`, de même pour la colonne `j`.
4. Écris `gagne(g, s)`, qui renvoie `True` si `s` remplit une ligne, une colonne ou l'une des deux diagonales.
5. À l'écrit : pourquoi ne faut-il pas écrire `[[""] * n] * n` pour créer la grille ?

```python depart
def grille_vide(n):
    ...

def ligne_pleine(g, i, s):
    ...

def colonne_pleine(g, j, s):
    ...

def gagne(g, s):
    ...
```

```python tests
g = grille_vide(3)
assert g == [["", "", ""], ["", "", ""], ["", "", ""]], "grille vide"
g[0][0] = "X"
assert g[1][0] == "", "les lignes sont indépendantes"
g = [["X", "X", "X"], ["O", "", "O"], ["", "O", ""]]
assert ligne_pleine(g, 0, "X") and not ligne_pleine(g, 1, "O"), "ligne"
c = [["O", "X", ""], ["O", "X", ""], ["O", "", "X"]]
assert colonne_pleine(c, 0, "O") and not colonne_pleine(c, 1, "X"), "colonne"
assert gagne(g, "X") and not gagne(g, "O"), "gagne par ligne"
assert gagne(c, "O"), "gagne par colonne"
assert gagne([["X", "", ""], ["", "X", ""], ["", "", "X"]], "X"), "diagonale"
assert gagne([["", "", "O"], ["", "O", ""], ["O", "", ""]], "O"), "autre diagonale"
assert not gagne(grille_vide(3), "X"), "grille vide"
```

:::corrige
```python solution
def grille_vide(n):
    return [[""] * n for i in range(n)]

def ligne_pleine(g, i, s):
    for j in range(len(g)):
        if g[i][j] != s:
            return False
    return True

def colonne_pleine(g, j, s):
    for i in range(len(g)):
        if g[i][j] != s:
            return False
    return True

def gagne(g, s):
    n = len(g)
    for k in range(n):
        if ligne_pleine(g, k, s) or colonne_pleine(g, k, s):
            return True
    d1 = True
    d2 = True
    for k in range(n):
        if g[k][k] != s:
            d1 = False
        if g[k][n - 1 - k] != s:
            d2 = False
    return d1 or d2
```

**Question 5.** Cette écriture répète **le même** tableau `n` fois. Modifier une case modifierait alors toute sa colonne.
:::
::::
