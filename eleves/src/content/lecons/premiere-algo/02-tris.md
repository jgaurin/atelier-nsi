---
titre: Tris par sélection et par insertion
resume: "Les deux tris au programme, à la main et en Python, avec leur invariant, leur terminaison et leur coût."
duree: 50
objectifs:
  - "Dérouler et écrire les tris par sélection et par insertion"
  - "Décrire leur invariant de boucle"
  - "Justifier leur terminaison et leur coût quadratique"
prerequis: [premiere-algo/parcours]
---

Trier permet ensuite de chercher beaucoup plus vite. Il faut connaître deux tris.

## 1. Le tri par sélection

On cherche le **minimum** du reste, et on l'échange avec le premier élément du reste.

| Tour | Tableau après le tour |
| --- | --- |
| départ | `5 3 8 1` |
| 1 | `1 3 8 5` |
| 2 | `1 3 8 5` |
| 3 | `1 3 5 8` |

```python exec
def tri_selection(t):
    for i in range(len(t) - 1):
        i_min = i
        for j in range(i + 1, len(t)):
            if t[j] < t[i_min]:
                i_min = j
        t[i], t[i_min] = t[i_min], t[i]

t = [5, 3, 8, 1]
tri_selection(t)
print(t)
```

**Invariant** : au début du tour i, les i premières cases contiennent les i plus petits éléments, triés.

## 2. Le tri par insertion

On prend chaque élément et on l'**insère** à sa place dans la partie gauche déjà triée.

| Tour | Tableau après le tour |
| --- | --- |
| départ | `5 3 8 1` |
| 1 | `3 5 8 1` |
| 2 | `3 5 8 1` |
| 3 | `1 3 5 8` |

```python exec
def tri_insertion(t):
    for i in range(1, len(t)):
        valeur = t[i]
        j = i
        while j > 0 and t[j - 1] > valeur:
            t[j] = t[j - 1]
            j = j - 1
        t[j] = valeur

t = [5, 3, 8, 1]
tri_insertion(t)
print(t)
```

**Invariant** : au début du tour i, les i premières cases sont triées.

## 3. Terminaison et coût

**Terminaison** : dans le `while`, `j` diminue à chaque tour et s'arrête au plus tard à 0. C'est un **variant**.

**Coût** : dans le pire cas, on fait environ n²/2 comparaisons. Le coût est **quadratique** : si la taille double, le temps est multiplié par 4.

## L'essentiel

- Sélection : chercher le minimum du reste et l'échanger.
- Insertion : insérer chaque élément dans la partie gauche triée.
- Un invariant prouve la correction ; un variant prouve la terminaison.
- Coût quadratique dans le pire cas.

## Exercices

::::exercice[QCM : les tris]{niveau=1 type=quiz}
Une question à la fois : la correction s'affiche aussitôt.

1. Dans le tri par sélection, que fait-on à chaque tour ?

   - [ ] on insère l'élément suivant dans la partie triée
   - [x] on cherche le minimum de la partie non triée et on l'échange avec son premier élément
   - [ ] on échange deux voisins mal rangés
   - [ ] on coupe le tableau en deux

   > Une sélection, un échange.

1. Que devient `[4, 2, 7, 1]` après le **premier** tour du tri par sélection ?

   - [ ] `[2, 4, 7, 1]`
   - [x] `[1, 2, 7, 4]`
   - [ ] `[1, 4, 2, 7]`
   - [ ] `[1, 2, 4, 7]`

   > Le minimum 1 est échangé avec le premier élément 4.

1. Que devient `[4, 2, 7, 1]` après le **premier** tour du tri par insertion (insertion de `t[1]`) ?

   - [x] `[2, 4, 7, 1]`
   - [ ] `[1, 2, 7, 4]`
   - [ ] `[1, 4, 2, 7]`
   - [ ] `[4, 2, 7, 1]`

   > On insère 2 avant 4.

1. Combien de comparaisons fait le tri par sélection sur 10 éléments ?

   - [ ] 10
   - [ ] 20
   - [x] 45
   - [ ] 100

   > 9 + 8 + … + 1 = 10 × 9 / 2 = 45.

1. Si on double la taille du tableau, le temps d'un tri quadratique est multiplié par :

   - [ ] 2
   - [x] 4
   - [ ] 8
   - [ ] il ne change pas

   > (2n)² = 4n².

1. Quel est le meilleur cas du tri par insertion ?

   - [x] le tableau est déjà trié
   - [ ] le tableau est trié à l'envers
   - [ ] tous les éléments sont différents
   - [ ] le tableau est vide de moitié

   > Chaque élément est déjà à sa place : une seule comparaison par tour.

1. Quel invariant correspond au tri par sélection ?

   - [ ] la partie gauche est triée mais peut encore changer
   - [x] la partie gauche contient les plus petits éléments, triés, à leur place définitive
   - [ ] la partie droite est triée
   - [ ] le tableau est toujours trié

   > Les éléments placés par la sélection ne bougent plus.

1. Comment échanger `t[i]` et `t[j]` en Python ?

   - [ ] `t[i] = t[j]` puis `t[j] = t[i]`
   - [x] `t[i], t[j] = t[j], t[i]`
   - [ ] `swap(t[i], t[j])`
   - [ ] `t[i] == t[j]`

   > La première proposition perd la valeur de `t[i]`.

1. Pourquoi mémoriser `valeur = t[i]` au début du tour dans le tri par insertion ?

   - [ ] pour aller plus vite
   - [x] parce que le décalage écrase `t[i]`
   - [ ] pour pouvoir la renvoyer
   - [ ] ce n'est pas nécessaire

   > Le premier décalage copie `t[i-1]` dans `t[i]`.

1. Que renvoie `tri_selection(t)` (version du cours) ?

   - [ ] le tableau trié
   - [x] `None` ; c'est `t` qui est modifié
   - [ ] une copie triée
   - [ ] le nombre d'échanges

   > Tri en place, sans `return`.

1. Quel élément justifie la terminaison du `while` dans le tri par insertion ?

   - [ ] le tableau est fini
   - [x] j diminue de 1 à chaque tour et reste positif ou nul
   - [ ] valeur diminue
   - [ ] la boucle `for` extérieure

   > j est un variant de boucle.

1. Pour trier un million de nombres en pratique, on utilise :

   - [ ] le tri par sélection
   - [ ] le tri par insertion
   - [x] `sorted` ou `t.sort()`, de coût de l'ordre de n log n
   - [ ] une recherche du maximum

   > Les tris quadratiques demanderaient des centaines de milliards d'opérations.
::::

::::exercice[Dérouler le tri par sélection]{niveau=1 type=completer}
Complète l'état du tableau après chaque tour.

```python calcul
t = [7, 2, 9, 4]
for i in range(len(t) - 1):
    m = i
    for j in range(i + 1, len(t)):
        if t[j] < t[m]:
            m = j
    t[i], t[m] = t[m], t[i]
    print(" ".join(map(str, t)))
```

| Tour | Tableau |
| --- | --- |
| départ | 7 2 9 4 |
| 1 | [[2 7 9 4]] |
| 2 | [[2 4 9 7]] |
| 3 | [[2 4 7 9]] |
::::

::::exercice[Dérouler le tri par insertion]{niveau=1 type=completer}
Complète l'état du tableau après chaque tour.

```python calcul
t = [7, 2, 9, 4]
for i in range(1, len(t)):
    v = t[i]
    j = i
    while j > 0 and t[j - 1] > v:
        t[j] = t[j - 1]
        j -= 1
    t[j] = v
    print(" ".join(map(str, t)))
```

| Tour | Tableau |
| --- | --- |
| départ | 7 2 9 4 |
| 1 | [[2 7 9 4]] |
| 2 | [[2 7 9 4]] |
| 3 | [[2 4 7 9]] |
::::

::::exercice[Compléter le tri par insertion]{niveau=2 type=completer}
Complète ce programme.

```python trous
def tri_insertion(t):
    for i in range([[1]], len(t)):
        valeur = t[[[i]]]
        j = i
        while j > [[0]] and t[j - 1] > [[valeur]]:
            t[j] = [[t[j - 1]]]
            j = [[j - 1]]
        t[j] = [[valeur]]
```
::::

::::exercice[Coût]{niveau=2 type=reponses}
Réponds à chaque question.

1. Si un tri quadratique trie 1 000 valeurs en 2 secondes, combien de secondes pour 2 000 valeurs ?

   ```python calcul
   print(2 * 4)
   ```

   - 8

1. Combien de comparaisons le tri par sélection fait-il sur un tableau de 10 éléments ?

   ```python calcul
   print(10 * 9 // 2)
   ```

   - 45

1. Dans le tri par insertion, quel nom donne-t-on à `j`, qui décroît et prouve que le `while` s'arrête ?

   - variant
   - un variant
::::

::::exercice[Écrire le tri par sélection]{niveau=1}
Écris `tri_selection(t)` qui trie le tableau `t` par ordre croissant, **en place**, avec la méthode du tri par sélection (sans `sort`, `sorted`,
`min` ni `index`).

```python depart
def tri_selection(t):
    ...
```

```python tests
t = [5, 3, 8, 1, 4]
tri_selection(t)
assert t == [1, 3, 4, 5, 8], "cas général"
t = []
tri_selection(t)
assert t == [], "tableau vide"
t = [2, 2, 1, 2]
tri_selection(t)
assert t == [1, 2, 2, 2], "doublons"
t = [9, 7, 5, 3]
tri_selection(t)
assert t == [3, 5, 7, 9], "trié à l'envers"
```

:::corrige
```python solution
def tri_selection(t):
    n = len(t)
    for i in range(n - 1):
        i_min = i
        for j in range(i + 1, n):
            if t[j] < t[i_min]:
                i_min = j
        t[i], t[i_min] = t[i_min], t[i]
```

On retient l'**indice** du minimum (pas sa valeur) pour pouvoir faire l'échange à la fin du tour.
:::
::::

::::exercice[Écrire le tri par insertion]{niveau=2}
Écris `tri_insertion(t)` qui trie le tableau `t` par ordre croissant, en place, avec la méthode du tri par insertion.

```python depart
def tri_insertion(t):
    ...
```

```python tests
t = [5, 3, 8, 1, 4]
tri_insertion(t)
assert t == [1, 3, 4, 5, 8], "cas général"
t = [1]
tri_insertion(t)
assert t == [1], "un élément"
t = [3, 1, 3, 2]
tri_insertion(t)
assert t == [1, 2, 3, 3], "doublons"
t = ["poire", "abricot", "kiwi"]
tri_insertion(t)
assert t == ["abricot", "kiwi", "poire"], "chaînes"
```

:::corrige
```python solution
def tri_insertion(t):
    for i in range(1, len(t)):
        valeur = t[i]
        j = i
        while j > 0 and t[j - 1] > valeur:
            t[j] = t[j - 1]
            j = j - 1
        t[j] = valeur
```

Le même code trie des chaînes : il suffit que les éléments soient comparables avec `>`.
:::
::::
