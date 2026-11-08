---
titre: Les tableaux
resume: "Lire et modifier les cases d'un tableau, et le parcourir de deux façons."
duree: 40
objectifs:
  - "Lire et modifier un élément grâce à son indice"
  - "Parcourir un tableau par valeur et par indice"
prerequis: [premiere-construits/tuples]
---

Un **tableau** est une suite de valeurs rangées dans des cases numérotées. En Python, on utilise le type `list`.

## 1. Lire et modifier

```python exec
notes = [12, 8, 15, 10]
print(notes[0], notes[3], len(notes))
notes[1] = 9
print(notes)
```

Les indices vont de `0` à `len(t) - 1`. Lire `t[len(t)]` provoque une `IndexError`.

Pour ajouter une case à la fin, on écrit `notes.append(17)`.

## 2. Parcourir

```python exec
t = [4, 7, 1]

for x in t:               # par valeur
    print(x)

for i in range(len(t)):   # par indice
    print(i, t[i])
```

:::methode[Lequel choisir ?]
- On veut seulement les **valeurs** (somme, comptage) : `for x in t`.
- On a besoin de la **position**, ou on modifie les cases : `for i in range(len(t))`.
:::

:::attention
`for x in t: x = 0` ne change pas le tableau : seule la variable `x` change.
:::

## 3. Un tableau n'est pas copié par `=`

Après `b = a`, les deux noms désignent **le même** tableau : modifier `b` modifie aussi `a`.

## L'essentiel

- `t[i]` lit une case, `t[i] = v` la modifie, `len(t)` donne la taille.
- Les indices vont de 0 à `len(t) - 1`.
- `for x in t` parcourt les valeurs ; `for i in range(len(t))` parcourt les indices.

## Exercices

::::exercice[QCM : les tableaux]{niveau=1 type=quiz}
Une question à la fois : la correction s'affiche aussitôt.

1. Avec `t = [5, 3, 8, 1]`, que vaut `t[2]` ?

   - [ ] 3
   - [x] 8
   - [ ] 1
   - [ ] 5

   > Indices 0, 1, 2, 3 : la case d'indice 2 est la troisième.

1. Quel est l'indice du dernier élément d'un tableau de 10 éléments ?

   - [ ] 10
   - [x] 9
   - [ ] 11
   - [ ] -10

   > Les indices vont de 0 à `len(t) - 1`.

1. Que vaut `t` après `t = [1, 2, 3]` puis `t.append(4)` ?

   - [ ] `[4, 1, 2, 3]`
   - [x] `[1, 2, 3, 4]`
   - [ ] `[1, 2, 3]`
   - [ ] `[5, 6, 7]`

   > `append` ajoute à la fin.

1. Que fait `for x in t: x = 0` sur `t = [3, 4]` ?

   - [ ] t devient `[0, 0]`
   - [x] rien : t reste `[3, 4]`
   - [ ] une erreur
   - [ ] t devient `[]`

   > On change la variable x, pas les cases. Il faut `for i in range(len(t)): t[i] = 0`.

1. Après `a = [1, 2]`, `b = a`, `b.append(3)`, que vaut `a` ?

   - [ ] `[1, 2]`
   - [x] `[1, 2, 3]`
   - [ ] `[3]`
   - [ ] une erreur

   > `a` et `b` désignent le même tableau.

1. Que provoque `t[3]` si `t = [1, 2, 3]` ?

   - [ ] 3
   - [ ] `None`
   - [x] une `IndexError`
   - [ ] 0

   > L'indice maximal est 2.

1. Quel parcours faut-il pour trouver la **position** du maximum ?

   - [ ] `for x in t`
   - [x] `for i in range(len(t))`
   - [ ] aucun, il faut `max`
   - [ ] `while True`

   > On a besoin des indices pour retenir la position.
::::

::::exercice[Lire un programme]{niveau=1 type=reponses}
Donne ce que le programme affiche.

1. Que s'affiche-t-il ?

   ```python verifier
   t = [3, 6, 9]
   t[0] = t[1] + t[2]
   print(t[0])
   ```

   - 15

1. Que s'affiche-t-il ?

   ```python verifier
   t = [2, 5, 1, 7]
   s = 0
   for x in t:
       if x > 2:
           s = s + x
   print(s)
   ```

   - 12

1. Que s'affiche-t-il ?

   ```python verifier
   t = [1, 2, 3]
   for i in range(len(t)):
       t[i] = t[i] * 2
   print(t)
   ```

   - [2, 4, 6]

1. Que s'affiche-t-il ?

   ```python verifier
   a = [1, 2]
   b = a
   b[0] = 9
   print(a)
   ```

   - [9, 2]
::::

::::exercice[Compléter un parcours]{niveau=1 type=completer}
Cette fonction compte les valeurs strictement positives d'un tableau. Complète-la.

```python trous
def nb_positifs(t):
    n = [[0]]
    for x in t:
        if x > [[0]]:
            n = [[n + 1;1 + n]]
    return [[n]]
```
::::

::::exercice[Position du maximum]{niveau=2}
Écris `indice_max(t)` qui renvoie l'indice de la **première** occurrence du plus grand élément d'un tableau non vide, sans utiliser `max` ni
`index`.

```python depart
def indice_max(t):
    ...
```

```python tests
assert indice_max([3, 9, 2, 7]) == 1, "maximum au milieu"
assert indice_max([5]) == 0, "un seul élément"
assert indice_max([4, 8, 8, 1]) == 1, "première occurrence"
assert indice_max([-5, -2, -9]) == 1, "nombres négatifs"
```

:::corrige
```python solution
def indice_max(t):
    i_max = 0
    for i in range(1, len(t)):
        if t[i] > t[i_max]:
            i_max = i
    return i_max
```

On initialise avec l'indice 0 (et non avec la valeur 0, qui serait fausse pour un tableau de nombres négatifs). La comparaison stricte `>`
garde la première occurrence.
:::
::::

::::exercice[Transformer un tableau sur place]{niveau=2}
Écris `plafonner(t, limite)` qui **modifie** le tableau `t` en remplaçant chaque valeur supérieure à `limite` par `limite`. La fonction ne
renvoie rien.

```python depart
def plafonner(t, limite):
    ...
```

```python tests
notes = [12, 25, 18, 30]
plafonner(notes, 20)
assert notes == [12, 20, 18, 20], "valeurs plafonnées à 20"
t = [1, 2]
plafonner(t, 5)
assert t == [1, 2], "rien à changer"
```

:::corrige
```python solution
def plafonner(t, limite):
    for i in range(len(t)):
        if t[i] > limite:
            t[i] = limite
```

Le parcours **par indice** est indispensable pour modifier les cases. Le tableau est modifié directement : c'est un effet de bord, voulu ici.
:::
::::
