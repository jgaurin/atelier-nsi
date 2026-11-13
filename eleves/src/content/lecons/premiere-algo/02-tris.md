---
titre: Tris par sélection et par insertion
resume: "Les deux tris au programme, à la main et en Python, avec leur invariant, leur terminaison et leur coût."
duree: 60
objectifs:
  - "Dérouler et écrire les tris par sélection et par insertion"
  - "Décrire leur invariant de boucle"
  - "Justifier leur terminaison et leur coût quadratique"
prerequis: [premiere-algo/parcours]
---

Trier, c'est ranger des valeurs dans l'ordre. C'est utile, car on cherche beaucoup plus vite dans un tableau trié : c'est le principe de la recherche dichotomique, vue dans la leçon suivante.

Il existe de nombreux tris. Le programme en demande deux, simples à faire à la main : le tri par **sélection** et le tri par **insertion**.

## 1. Le tri par sélection

### L'idée

Imagine que tu dois classer des copies par note. Tu cherches la plus petite note et tu la mets en premier. Puis tu cherches la plus petite parmi les copies **restantes**, et tu la mets en deuxième. Et ainsi de suite.

Dans un tableau, on ne peut pas « mettre » une valeur au début : on **échange** deux cases.

### À la main

On trie `[5, 3, 8, 1]`. La barre `|` sépare la partie déjà triée, à gauche, du reste.

| Tour | On cherche le minimum dans | Minimum trouvé | Ce qu'on fait | Tableau après le tour |
| --- | --- | --- | --- | --- |
| 1 | `5 3 8 1` | 1, case 3 | on échange les cases 0 et 3 | `1 \| 3 8 5` |
| 2 | `3 8 5` | 3, case 1 | 3 est déjà à sa place, rien ne bouge | `1 3 \| 8 5` |
| 3 | `8 5` | 5, case 3 | on échange les cases 2 et 3 | `1 3 5 \| 8` |

Il reste une seule valeur, 8 : c'est forcément la plus grande, elle est déjà à sa place. Pour 4 valeurs, il suffit donc de **3 tours**.

À gauche de la barre, les valeurs sont triées **et à leur place définitive** : elles ne bougeront plus.

### Le code, ligne par ligne

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

- `for i in range(len(t) - 1)` : `i` est la case qu'on remplit à ce tour. Le dernier tour est inutile, d'où le `- 1`.
- `i_min = i` : on suppose d'abord que le minimum est en case `i`.
- La boucle sur `j` regarde chaque case suivante. Si elle contient une valeur plus petite, on retient sa **position** dans `i_min`.
- On retient la position, et non la valeur, car on en a besoin pour faire l'échange.
- La dernière ligne échange les cases `i` et `i_min`.

:::attention
Écrire `t[i] = t[i_min]` puis `t[i_min] = t[i]` ne marche pas : la première ligne efface l'ancienne valeur de `t[i]`. En Python, on échange en une seule ligne : `t[i], t[i_min] = t[i_min], t[i]`.
:::

La fonction ne renvoie rien : elle modifie le tableau qu'elle reçoit. On dit qu'elle trie **en place**.

## 2. Le tri par insertion

### L'idée

Pense à des cartes que tu ramasses une par une. À chaque nouvelle carte, tu la glisses à sa place parmi celles que tu as déjà en main. Les cartes en main sont donc toujours rangées.

### À la main

On trie de nouveau `[5, 3, 8, 1]`. Au départ, la première case, seule, est déjà triée.

| Tour | Valeur à insérer | Ce qu'on fait | Tableau après le tour |
| --- | --- | --- | --- |
| 1 | 3 | 5 est plus grand que 3 : on décale 5 d'un cran à droite, puis on pose 3 au début | `3 5 \| 8 1` |
| 2 | 8 | 5 est plus petit que 8 : rien à décaler, 8 reste en place | `3 5 8 \| 1` |
| 3 | 1 | 8, 5 et 3 sont plus grands que 1 : on les décale tous, puis on pose 1 au début | `1 3 5 8` |

Ici, la partie gauche est triée, mais **pas définitive** : au tour 3, le 1 est venu se glisser devant tout le monde.

### Le détail d'une insertion

Voici le tour 3 au ralenti. On met d'abord 1 de côté, puis on décale vers la droite les valeurs plus grandes, une par une.

| Étape | Tableau | `j` |
| --- | --- | --- |
| on garde `valeur = 1` de côté | `3 5 8 1` | 3 |
| 8 > 1 : on recopie 8 un cran à droite | `3 5 8 8` | 2 |
| 5 > 1 : on recopie 5 un cran à droite | `3 5 5 8` | 1 |
| 3 > 1 : on recopie 3 un cran à droite | `3 3 5 8` | 0 |
| on est au début : on pose 1 en case 0 | `1 3 5 8` | 0 |

### Le code, ligne par ligne

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

- `range(1, len(t))` : on commence à la case 1, car la case 0 seule est déjà triée.
- `valeur = t[i]` : on met la valeur de côté, car le premier décalage va écraser `t[i]`.
- La boucle `while` continue tant qu'on n'est pas au début du tableau et que la case de gauche est plus grande. Elle recopie alors cette case un cran à droite.
- Quand elle s'arrête, `j` est la place libre : on y pose `valeur`.

## 3. Les deux tris côte à côte

| | Sélection | Insertion |
| --- | --- | --- |
| À chaque tour | on cherche le minimum du reste, puis on échange | on insère la valeur suivante dans la partie triée |
| La partie de gauche | triée et définitive | triée, mais elle peut encore bouger |
| Sur un tableau déjà trié | autant de travail que d'habitude | très rapide : une seule comparaison par tour |

## 4. Prouver que le tri est correct : l'invariant

Un **invariant de boucle** est une phrase vraie au début de **chaque** tour. Pour prouver un algorithme, on vérifie trois choses :

1. la phrase est vraie au départ ;
2. si elle est vraie au début d'un tour, elle l'est encore au tour suivant ;
3. à la fin de la boucle, elle donne le résultat voulu.

C'est comme une chaîne de dominos : le premier tombe, et chacun fait tomber le suivant.

**Pour la sélection**, l'invariant est : « au début du tour `i`, les `i` premières cases contiennent les `i` plus petites valeurs, triées ».

1. Au départ, `i` vaut 0 : il n'y a aucune case, c'est vrai.
2. Pendant un tour, on place le plus petit du reste en case `i`. Il est plus grand que les valeurs déjà placées, et plus petit que toutes les autres. La phrase devient vraie pour `i + 1` cases.
3. À la fin, les n − 1 premières cases contiennent les n − 1 plus petites valeurs, triées. La dernière case contient donc la plus grande : tout le tableau est trié.

**Pour l'insertion**, l'invariant est : « au début du tour `i`, les `i` premières cases sont triées ». Elles ne contiennent pas forcément les plus petites valeurs, puisqu'une valeur peut encore venir s'y glisser.

## 5. Prouver que le tri s'arrête : le variant

Une boucle `for` s'arrête toujours : elle fait un nombre de tours fixé à l'avance. Il faut seulement vérifier la boucle `while` du tri par insertion.

À chaque tour, `j` diminue de 1. Comme la condition `j > 0` est testée, `j` ne peut pas descendre sous 0 : la boucle fait au plus `j` tours. Un entier qui diminue strictement à chaque tour sans pouvoir descendre indéfiniment s'appelle un **variant**. Il prouve que la boucle s'arrête.

## 6. Le coût

Comptons les comparaisons du tri par sélection sur 5 valeurs. Au tour 1, on compare le minimum provisoire aux 4 autres valeurs ; au tour 2, aux 3 restantes, et ainsi de suite.

4 + 3 + 2 + 1 = **10 comparaisons**.

Pour n valeurs, on fait (n − 1) + … + 1 = n(n − 1) / 2 comparaisons, soit environ n² / 2.

| Nombre de valeurs | Comparaisons |
| --- | --- |
| 10 | 45 |
| 100 | 4 950 |
| 1 000 | 499 500 |

Quand le nombre de valeurs est multiplié par 10, le nombre de comparaisons est multiplié par environ 100. Si la taille **double**, le temps est multiplié par **4**. On dit que le coût est **quadratique**.

Le tri par insertion a le même coût dans le **pire cas**, un tableau trié à l'envers, car chaque valeur doit être décalée jusqu'au début. Dans le **meilleur cas**, un tableau déjà trié, il ne fait qu'une comparaison par tour.

Pour un million de valeurs, un tri quadratique ferait environ 500 milliards de comparaisons. C'est pourquoi `sorted` utilise une méthode bien plus rapide, que tu verras en terminale.

## L'essentiel

- **Sélection** : on cherche le minimum du reste et on l'échange avec la première case du reste. La partie gauche est définitive.
- **Insertion** : on glisse chaque valeur à sa place dans la partie gauche, en décalant les plus grandes vers la droite.
- Un **invariant** prouve que le tri est correct, un **variant** prouve que la boucle s'arrête.
- Les deux tris ont un coût **quadratique** dans le pire cas. L'insertion est très rapide sur un tableau déjà trié.

## Exercices

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

::::exercice[QCM : les pièges des tris]{niveau=2 type=quiz}
Ne confonds pas les deux tris : c'est là que se cachent la plupart des pièges. La correction s'affiche aussitôt.

1. Que devient `[4, 2, 7, 1]` après le **premier** tour du tri par sélection ?

   - [ ] `[2, 4, 7, 1]`
   - [x] `[1, 2, 7, 4]`
   - [ ] `[1, 4, 2, 7]`
   - [ ] `[1, 2, 4, 7]`

   > Le minimum 1 est **échangé** avec 4. Il n'y a pas de décalage : `[1, 4, 2, 7]` serait une insertion. `[2, 4, 7, 1]` est un tour d'insertion.

1. Que devient `[5, 3, 8, 1]` après **deux** tours du tri par insertion ?

   - [x] `[3, 5, 8, 1]`
   - [ ] `[1, 3, 8, 5]`
   - [ ] `[3, 5, 1, 8]`
   - [ ] `[1, 3, 5, 8]`

   > On insère 3, puis 8, déjà à sa place. Le 1 n'a pas encore été regardé. `[1, 3, 8, 5]` serait deux tours de sélection.

1. Au début du tour i du tri par **insertion**, que sait-on des i premières cases ?

   - [ ] elles contiennent les i plus petites valeurs du tableau
   - [ ] elles sont à leur place définitive
   - [x] elles sont triées, mais une valeur plus petite peut encore s'y insérer
   - [ ] on ne sait rien

   > Les deux premières réponses décrivent l'invariant de la **sélection**.

1. Pour échanger deux cases, on écrit `t[0] = t[1]` puis `t[1] = t[0]`. Que devient `t = [3, 1]` ?

   - [ ] `[1, 3]`
   - [x] `[1, 1]`
   - [ ] `[3, 3]`
   - [ ] `[3, 1]`

   > La première ligne efface le 3. Il faut écrire `t[0], t[1] = t[1], t[0]`.

1. Le tableau de 100 éléments est **déjà trié**. Combien de comparaisons fait le tri par **sélection** ?

   - [ ] 0
   - [ ] 99
   - [x] 4 950
   - [ ] 10 000

   > La sélection cherche toujours le minimum du reste : 99 + 98 + … + 1 = 4 950. Être déjà trié ne l'aide pas.

1. Même tableau déjà trié. Combien de comparaisons fait le tri par **insertion** ?

   - [ ] 0
   - [x] 99
   - [ ] 4 950
   - [ ] 10 000

   > Chaque élément est comparé une fois à son voisin de gauche, puis il reste en place. C'est le meilleur cas.

1. Un tri quadratique prend 3 s sur 1 000 valeurs. Combien de temps prend-il environ sur 3 000 valeurs ?

   - [ ] 9 s
   - [x] 27 s
   - [ ] 3 000 s
   - [ ] 6 s

   > La taille est multipliée par 3, le temps par 3² = 9. 9 s est le piège : c'est le coefficient, pas le résultat.

1. Dans le `while` du tri par insertion, quelle quantité est un **variant** ?

   - [ ] `valeur`
   - [x] `j`
   - [ ] `t[j]`
   - [ ] `len(t)`

   > `j` est un entier qui diminue à chaque tour et ne descend pas sous 0. `valeur` ne change pas.

1. La fonction du cours n'a pas de `return`. Qu'affiche ce code ?

   ```python
   t2 = tri_selection([3, 1, 2])
   print(t2)
   ```

   - [ ] `[1, 2, 3]`
   - [ ] `[3, 1, 2]`
   - [x] `None`
   - [ ] une erreur

   > Le tri modifie le tableau reçu, en place, et ne renvoie rien.
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
