---
titre: Les tableaux
resume: "Lire et modifier les cases d'un tableau, et le parcourir de deux façons."
duree: 40
objectifs:
  - "Lire et modifier un élément grâce à son indice"
  - "Parcourir un tableau par valeur et par indice"
prerequis: [premiere-construits/tuples]
---

Pour garder les notes de toute une classe, on ne crée pas trente variables. On utilise un **tableau** : une suite de cases numérotées. En Python, un tableau s'appelle une liste, de type `list`.

## 1. Lire et modifier une case

```python exec
notes = [12, 8, 15, 10]
print(notes[0], notes[3], len(notes))
notes[1] = 9
print(notes)
```

| Indice | 0 | 1 | 2 | 3 |
| --- | --- | --- | --- | --- |
| Valeur | 12 | 8 | 15 | 10 |

- Les indices commencent à **0** : la première case est `notes[0]`.
- La dernière case a l'indice `len(notes) - 1`, ici 3.
- `notes[1] = 9` remplace la valeur de la case 1.
- `notes.append(17)` ajoute une case à la fin.

:::attention
`notes[4]` n'existe pas : il n'y a que 4 cases, d'indices 0 à 3. Python provoque une `IndexError`.
:::

## 2. Parcourir un tableau

Il y a deux façons de parcourir un tableau.

**Par les valeurs**, quand seules les valeurs comptent :

```python exec
notes = [12, 8, 15]
total = 0
for n in notes:
    total = total + n
print(total)
```

À chaque tour, `n` prend la valeur suivante : 12, puis 8, puis 15.

**Par les indices**, quand on a besoin de la position :

```python exec
notes = [12, 8, 15]
for i in range(len(notes)):
    print("case", i, ":", notes[i])
```

`range(len(notes))` donne 0, 1, 2 : exactement les indices du tableau.

:::methode[Lequel choisir ?]
- On veut seulement les **valeurs** : somme, comptage, maximum. On écrit `for x in t`.
- On a besoin de la **position**, ou on veut **modifier** les cases. On écrit `for i in range(len(t))`.
:::

:::attention
`for x in t: x = 0` ne change pas le tableau. `x` est une simple copie de la valeur : on modifie la variable `x`, pas la case. Pour modifier les cases, il faut écrire `t[i] = 0` avec une boucle sur les indices.
:::

## 3. Un tableau n'est pas copié par `=`

```python exec
a = [1, 2]
b = a
b.append(3)
print(a)
```

Surprise : `a` a changé ! `b = a` ne fabrique pas un nouveau tableau. `a` et `b` sont deux noms pour **le même** tableau, comme deux étiquettes collées sur la même boîte. Toute modification faite par l'un se voit par l'autre.

## L'essentiel

- `t[i]` lit une case, `t[i] = v` la modifie, `len(t)` donne la taille, `t.append(v)` ajoute à la fin.
- Les indices vont de 0 à `len(t) - 1`.
- `for x in t` parcourt les valeurs ; `for i in range(len(t))` parcourt les indices.
- `b = a` ne copie pas le tableau : les deux noms désignent le même.

## Exercices

::::exercice[QCM : les tableaux]{niveau=1 type=quiz}
Une question à la fois : la correction s'affiche aussitôt.

1. Quel est l'indice du dernier élément d'un tableau de 10 éléments ?

   - [ ] 10
   - [x] 9
   - [ ] 11
   - [ ] -10

   > Les indices vont de 0 à `len(t) - 1`.

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

::::exercice[Des relevés de température]{niveau=3}
Le tableau `t` contient une température par jour.

1. Écris `nb_gel(t)`, qui renvoie le nombre de jours où la température est strictement négative.
2. Écris `plus_forte_hausse(t)`, qui renvoie la plus grande augmentation entre deux jours consécutifs, pour un tableau d'au moins deux valeurs.
3. Écris `plus_longue_serie(t, seuil)`, qui renvoie le plus grand nombre de jours **consécutifs** où la température est strictement supérieure à `seuil`.
4. À l'écrit : pour `plus_forte_hausse`, pourquoi `for x in t` ne suffit-il pas ? Quelle borne faut-il donner à la boucle, et pourquoi ?

```python depart
def nb_gel(t):
    ...

def plus_forte_hausse(t):
    ...

def plus_longue_serie(t, seuil):
    ...
```

```python tests
assert nb_gel([3, -1, 0, -4]) == 2, "deux jours de gel"
assert nb_gel([]) == 0, "tableau vide"
assert plus_forte_hausse([1, 4, 2, 9, 8]) == 7, "de 2 à 9"
assert plus_forte_hausse([5, 3]) == -2, "seulement une baisse"
assert plus_longue_serie([21, 25, 26, 19, 30, 31, 32, 10], 20) == 3, "dernière série"
assert plus_longue_serie([1, 2], 20) == 0, "aucun jour"
assert plus_longue_serie([25, 26], 20) == 2, "série jusqu'à la fin"
```

:::corrige
```python solution
def nb_gel(t):
    n = 0
    for x in t:
        if x < 0:
            n = n + 1
    return n

def plus_forte_hausse(t):
    maxi = t[1] - t[0]
    for i in range(len(t) - 1):
        if t[i + 1] - t[i] > maxi:
            maxi = t[i + 1] - t[i]
    return maxi

def plus_longue_serie(t, seuil):
    meilleure = 0
    courante = 0
    for x in t:
        if x > seuil:
            courante = courante + 1
            if courante > meilleure:
                meilleure = courante
        else:
            courante = 0
    return meilleure
```

**Question 4.** Il faut comparer chaque case à la **suivante** : on a besoin des indices. La boucle s'arrête à `len(t) - 1` : au-delà, `t[i + 1]` provoquerait une `IndexError`.
:::
::::
