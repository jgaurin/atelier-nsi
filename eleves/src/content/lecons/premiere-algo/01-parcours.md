---
titre: Parcourir un tableau
resume: "Chercher une valeur, un extremum, calculer une moyenne, et mesurer le coût de ces algorithmes."
duree: 35
objectifs:
  - "Écrire une recherche d'occurrence, d'extremum et un calcul de moyenne"
  - "Justifier qu'un parcours a un coût linéaire"
prerequis: [premiere-construits/tableaux]
---

Beaucoup d'algorithmes examinent un tableau **case par case**, du début à la fin : c'est un **parcours séquentiel**. C'est ce que tu fais quand tu cherches un nom dans une liste qui n'est pas rangée : tu lis les lignes une à une.

## 1. Chercher une valeur

### L'idée

On regarde chaque case. Dès qu'on trouve la valeur, on s'arrête et on donne sa position. Si on arrive au bout sans l'avoir trouvée, elle est absente : on renvoie -1 par convention, puisque -1 n'est jamais une position valide.

### À la main

On cherche 8 dans `[4, 8, 1]`.

| Tour | `i` | `t[i]` | Est-ce 8 ? | Ce qu'on fait |
| --- | --- | --- | --- | --- |
| 1 | 0 | 4 | non | on continue |
| 2 | 1 | 8 | oui | on renvoie 1 |

On cherche maintenant 5 : les trois cases sont examinées, aucune ne vaut 5, donc on renvoie -1.

### Le code, ligne par ligne

```python exec
def indice(t, x):
    for i in range(len(t)):
        if t[i] == x:
            return i
    return -1

print(indice([4, 8, 1], 8), indice([4, 8, 1], 5))
```

- `for i in range(len(t))` : `i` prend chaque position, de 0 à `len(t) - 1`.
- `if t[i] == x: return i` : dès qu'on trouve, `return` arrête la fonction.
- `return -1` est **après** la boucle, au même niveau que le `for`. On n'y arrive que si toutes les cases ont été examinées sans succès.

:::attention
Mettre `return -1` dans un `else`, à l'intérieur de la boucle, est une erreur classique : la fonction s'arrêterait dès la première case différente de `x`. On ne peut conclure à l'absence qu'après avoir tout regardé.
:::

## 2. Chercher le maximum

### L'idée

Imagine que tu lis des notes une par une, en retenant la meilleure vue jusqu'ici. À chaque nouvelle note, tu la compares à celle que tu retiens : si elle est meilleure, elle la remplace.

### À la main

On cherche le maximum de `[5, 9, 2, 9]`. La variable `m` retient le meilleur vu jusqu'ici.

| Valeur lue | Comparaison | `m` après |
| --- | --- | --- |
| départ | on prend la première case | 5 |
| 9 | 9 > 5, oui | 9 |
| 2 | 2 > 9, non | 9 |
| 9 | 9 > 9, non | 9 |

### Le code, ligne par ligne

```python exec
def maximum(t):
    m = t[0]
    for x in t:
        if x > m:
            m = x
    return m

print(maximum([5, 9, 2, 9]), maximum([-4, -1, -7]))
```

- `m = t[0]` : on part d'une vraie valeur du tableau.
- `for x in t` : on n'a besoin que des valeurs, pas des positions.
- `if x > m: m = x` : une valeur plus grande remplace l'ancien maximum.

:::attention
Si on écrit `m = 0` au départ, le résultat est faux pour un tableau de nombres négatifs : avec `[-4, -1, -7]`, aucune valeur ne dépasse 0, et la fonction renverrait 0, qui n'est même pas dans le tableau.
:::

Pourquoi le résultat est-il juste ? Au début de chaque tour, `m` est le maximum des valeurs déjà lues. C'est vrai au départ, chaque tour le conserve, donc à la fin `m` est le maximum de tout le tableau. Une telle phrase s'appelle un **invariant** : tu la retrouveras dans les tris.

## 3. Calculer une moyenne

On additionne toutes les valeurs dans une variable, puis on divise par leur nombre. Cette variable qui grossit à chaque tour s'appelle un **accumulateur**.

```python exec
def moyenne(t):
    s = 0
    for x in t:
        s = s + x
    return s / len(t)

print(moyenne([12, 15, 9]))
```

Pour `[12, 15, 9]`, `s` vaut successivement 0, 12, 27 puis 36, et on renvoie 36 / 3 = 12.

Le tableau ne doit pas être vide : sinon, on diviserait par 0.

## 4. Le coût

Le **coût** d'un algorithme est le nombre d'opérations qu'il fait, selon la taille n des données.

- Pour le maximum et la moyenne, on regarde toujours les n cases.
- Pour la recherche, cela dépend de la position de la valeur. Le **meilleur cas** est une valeur en première case : une seule comparaison. Le **pire cas** est une valeur absente ou en dernière case : n comparaisons.

| Taille du tableau | Comparaisons dans le pire cas |
| --- | --- |
| 10 | 10 |
| 1 000 | 1 000 |
| 1 000 000 | 1 000 000 |

Le nombre d'opérations est proportionnel à la taille : si le tableau est deux fois plus grand, il faut deux fois plus de temps. On dit que le coût est **linéaire**.

## L'essentiel

- Recherche : on s'arrête dès qu'on trouve ; on ne conclut à l'absence qu'**après** la boucle.
- Maximum : on part de `t[0]`, jamais de 0, et on garde le meilleur vu jusqu'ici.
- Moyenne : un accumulateur, puis une division ; le tableau ne doit pas être vide.
- Le coût d'un parcours est **linéaire**. Pour la recherche, le pire cas est une valeur absente.

## Exercices

::::exercice[Compléter la recherche du minimum]{niveau=1 type=completer}
Complète cette fonction, qui renvoie l'**indice** du plus petit élément.

```python trous
def indice_min(t):
    i_min = [[0]]
    for i in range(1, [[len(t)]]):
        if t[i] < t[[[i_min]]]:
            i_min = [[i]]
    return i_min
```
::::

::::exercice[QCM : les pièges du parcours]{niveau=2 type=quiz}
Lis bien le code : un seul détail change tout. La correction s'affiche aussitôt.

1. Que renvoie `indice([4, 8, 1], 8)` ?

   ```python
   def indice(t, x):
       for i in range(len(t)):
           if t[i] == x:
               return i
           else:
               return -1
   ```

   - [ ] 1
   - [x] -1
   - [ ] 0
   - [ ] une erreur

   > Dès le premier tour, 4 est différent de 8 : le `else` renvoie -1. On ne peut conclure à l'absence qu'après la boucle.

1. On initialise le maximum avec `m = 0`. Que renvoie la fonction pour `[-4, -1, -7]` ?

   - [ ] -1
   - [ ] -7
   - [x] 0
   - [ ] une erreur

   > Aucune valeur ne dépasse 0 : `m` ne change jamais. Il faut partir de `t[0]`.

1. Que renvoie cette fonction pour `[5, 5, 5]` ?

   ```python
   def compte(t):
       n = 0
       for x in t:
           if x == 5:
               n = n + 1
           return n
   ```

   - [ ] 3
   - [x] 1
   - [ ] 0
   - [ ] `None`

   > Le `return` est dans la boucle : la fonction s'arrête à la fin du premier tour.

1. Que renvoie `indice_max([7, 3, 7])` ?

   ```python
   def indice_max(t):
       i_max = 0
       for i in range(len(t)):
           if t[i] >= t[i_max]:
               i_max = i
       return i_max
   ```

   - [ ] 0
   - [ ] 1
   - [x] 2
   - [ ] 7

   > Avec `>=`, une valeur égale remplace la précédente : on obtient la dernière position. La fonction renvoie un indice, pas une valeur.

1. On écrit `m = t[0]`, puis `for i in range(1, len(t)):`. Cette boucle est-elle correcte pour chercher le maximum ?

   - [x] oui, `t[0]` est déjà pris en compte
   - [ ] non, elle oublie `t[0]`
   - [ ] non, elle provoque une `IndexError`
   - [ ] non, elle est fausse pour les nombres négatifs

   > Commencer à l'indice 1 évite seulement une comparaison inutile.

1. Que provoque `moyenne([])`, avec une fonction qui termine par `return s / len(t)` ?

   - [ ] elle renvoie 0
   - [ ] elle renvoie `None`
   - [ ] une `IndexError`
   - [x] une `ZeroDivisionError`

   > La boucle ne fait aucun tour, puis on divise par 0. Aucune case n'est lue : ce n'est pas une `IndexError`.

1. Dans quel cas une recherche séquentielle fait-elle n comparaisons sur un tableau de taille n ?

   - [ ] l'élément est au milieu
   - [x] l'élément est absent ou en dernière position
   - [ ] l'élément est en première position
   - [ ] jamais

   > C'est le pire cas. En première position, une seule comparaison suffit.

1. Un parcours linéaire prend 2 ms sur 1 000 éléments. Combien de temps prend-il environ sur 4 000 éléments ?

   - [ ] 4 ms
   - [x] 8 ms
   - [ ] 16 ms
   - [ ] 32 ms

   > La taille est multipliée par 4, le temps aussi. 32 ms serait le résultat d'un coût quadratique.
::::

::::exercice[Minimum et maximum en un seul parcours]{niveau=2}
Écris `extremums(t)` qui renvoie le couple `(minimum, maximum)` d'un tableau non vide, en **un seul** parcours, sans `min` ni `max`.

```python depart
def extremums(t):
    ...
```

```python tests
assert extremums([4, 9, 1, 7]) == (1, 9), "cas général"
assert extremums([5]) == (5, 5), "un élément"
assert extremums([-3, -8, -1]) == (-8, -1), "négatifs"
```

:::corrige
```python solution
def extremums(t):
    mini = t[0]
    maxi = t[0]
    for v in t:
        if v < mini:
            mini = v
        if v > maxi:
            maxi = v
    return (mini, maxi)
```

Un seul parcours, deux variables mises à jour : le coût reste linéaire.
:::
::::

::::exercice[Dernière occurrence et toutes les occurrences]{niveau=2}
Écris `derniere(t, x)` qui renvoie l'indice de la **dernière** occurrence de `x` dans `t` (ou `-1`), et `positions(t, x)` qui renvoie le
tableau de **tous** les indices où `x` apparaît.

```python depart
def derniere(t, x):
    ...

def positions(t, x):
    ...
```

```python tests
assert derniere([3, 7, 3, 1], 3) == 2, "dernière occurrence"
assert derniere([3, 7], 5) == -1, "absent"
assert derniere([], 5) == -1, "vide"
assert positions([3, 7, 3, 1, 3], 3) == [0, 2, 4], "toutes les positions"
assert positions([1, 2], 9) == [], "aucune"
```

:::corrige
```python solution
def derniere(t, x):
    resultat = -1
    for i in range(len(t)):
        if t[i] == x:
            resultat = i
    return resultat

def positions(t, x):
    return [i for i in range(len(t)) if t[i] == x]
```

Pour la dernière occurrence, on ne s'arrête pas : on retient le dernier indice trouvé. On pourrait aussi parcourir à l'envers
(`range(len(t) - 1, -1, -1)`) et s'arrêter au premier trouvé.
:::
::::

::::exercice[Une liste de lecture]{niveau=3}
Une liste de lecture est un tableau `d` de durées de morceaux, en secondes.

1. Écris `indice_plus_long(d)`, qui renvoie l'indice du premier morceau le plus long, pour un tableau non vide.
2. Écris `dernier_ecoute(d, temps)`, qui renvoie l'indice du morceau en cours après `temps` secondes d'écoute, ou `-1` si la liste est terminée. Un morceau de durée 60 occupe les instants de 0 inclus à 60 exclu.
3. Écris `est_croissant(d)`, qui renvoie `True` si chaque durée est supérieure ou égale à la précédente.
4. À l'écrit : pour `est_croissant`, quel est le meilleur cas ? Quel est le pire cas ? Quel est son coût dans le pire cas ?

```python depart
def indice_plus_long(d):
    ...

def dernier_ecoute(d, temps):
    ...

def est_croissant(d):
    ...
```

```python tests
assert indice_plus_long([100, 200, 200, 50]) == 1, "premier maximum"
assert indice_plus_long([7]) == 0, "un seul morceau"
assert dernier_ecoute([60, 100], 0) == 0, "début"
assert dernier_ecoute([60, 100], 60) == 1, "changement de morceau"
assert dernier_ecoute([60, 100], 159) == 1, "dernier instant"
assert dernier_ecoute([60, 100], 160) == -1, "liste terminée"
assert est_croissant([1, 2, 2, 5]), "croissant"
assert not est_croissant([1, 3, 2]), "non croissant"
assert est_croissant([]) and est_croissant([4]), "cas limites"
```

:::corrige
```python solution
def indice_plus_long(d):
    i_max = 0
    for i in range(len(d)):
        if d[i] > d[i_max]:
            i_max = i
    return i_max

def dernier_ecoute(d, temps):
    cumul = 0
    for i in range(len(d)):
        cumul = cumul + d[i]
        if temps < cumul:
            return i
    return -1

def est_croissant(d):
    for i in range(len(d) - 1):
        if d[i + 1] < d[i]:
            return False
    return True
```

**Question 4.** Meilleur cas : les deux premières valeurs sont mal rangées, on s'arrête aussitôt. Pire cas : le tableau est croissant, on examine tout. Le coût est **linéaire** dans le pire cas.
:::
::::
