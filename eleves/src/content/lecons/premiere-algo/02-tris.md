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

## 3. Prouver avec un invariant

Un **invariant** est une propriété vraie à chaque tour. Pour prouver qu'un algorithme est correct :

1. on vérifie qu'elle est vraie au départ ;
2. on montre qu'un tour la conserve ;
3. on regarde ce qu'elle dit à la fin de la boucle.

Pour la sélection, à la fin, les n − 1 premières cases contiennent les n − 1 plus petits éléments, triés. La dernière case contient donc le plus grand : tout est trié.

## 4. Terminaison et coût

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

1. Quel invariant correspond au tri par sélection ?

   - [ ] la partie gauche est triée mais peut encore changer
   - [x] la partie gauche contient les plus petits éléments, triés, à leur place définitive
   - [ ] la partie droite est triée
   - [ ] le tableau est toujours trié

   > Les éléments placés par la sélection ne bougent plus.

1. Quel élément justifie la terminaison du `while` dans le tri par insertion ?

   - [ ] le tableau est fini
   - [x] j diminue de 1 à chaque tour et reste positif ou nul
   - [ ] valeur diminue
   - [ ] la boucle `for` extérieure

   > j est un variant de boucle.
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

::::exercice[Écrire le tri par sélection]{niveau=2}
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

::::exercice[Trier et compter]{niveau=3}
1. Écris `tri_par_age(eleves)`, qui trie **en place**, avec le tri par insertion, un tableau de dictionnaires `{"nom": ..., "age": ...}` par âge croissant. Deux élèves du même âge gardent leur ordre.
2. Écris `nb_decalages(t)`, qui renvoie le nombre de décalages effectués par le tri par insertion de `t`, sans modifier `t`.
3. À l'écrit : pour un tableau de n éléments, quel tableau demande le plus de décalages ? Combien ? Donne l'invariant du tri par insertion et explique pourquoi la boucle `while` s'arrête.

```python depart
def tri_par_age(eleves):
    ...

def nb_decalages(t):
    ...
```

```python tests
e = [{"nom": "A", "age": 18}, {"nom": "B", "age": 16}, {"nom": "C", "age": 18}, {"nom": "D", "age": 15}]
tri_par_age(e)
assert [x["nom"] for x in e] == ["D", "B", "A", "C"], "tri stable par âge"
tri_par_age([])
assert nb_decalages([1, 2, 3]) == 0, "déjà trié"
assert nb_decalages([3, 2, 1]) == 3, "ordre inverse"
assert nb_decalages([2, 1, 3]) == 1, "un décalage"
t = [5, 4, 3, 2, 1]
assert nb_decalages(t) == 10, "cinq éléments à l'envers"
assert t == [5, 4, 3, 2, 1], "t n'est pas modifié"
```

:::corrige
```python solution
def tri_par_age(eleves):
    for i in range(1, len(eleves)):
        e = eleves[i]
        j = i
        while j > 0 and eleves[j - 1]["age"] > e["age"]:
            eleves[j] = eleves[j - 1]
            j = j - 1
        eleves[j] = e

def nb_decalages(t):
    c = [x for x in t]
    n = 0
    for i in range(1, len(c)):
        v = c[i]
        j = i
        while j > 0 and c[j - 1] > v:
            c[j] = c[j - 1]
            j = j - 1
            n = n + 1
        c[j] = v
    return n
```

**Question 3.** Le pire cas est un tableau trié à l'envers : 1 + 2 + … + (n − 1) = n(n − 1) / 2 décalages. Invariant : au début du tour i, les i premières cases sont triées. `j` est un entier qui diminue à chaque tour et ne peut pas descendre sous 0 : c'est un variant, donc le `while` s'arrête.
:::
::::
