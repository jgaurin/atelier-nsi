---
titre: Parcourir un tableau
resume: "Chercher une valeur, un extremum, calculer une moyenne, et mesurer le coût de ces algorithmes."
duree: 35
objectifs:
  - "Écrire une recherche d'occurrence, d'extremum et un calcul de moyenne"
  - "Justifier qu'un parcours a un coût linéaire"
prerequis: [premiere-construits/tableaux]
---

Beaucoup d'algorithmes examinent un tableau **case par case** : c'est un **parcours séquentiel**.

## 1. Chercher une occurrence

```python exec
def indice(t, x):
    for i in range(len(t)):
        if t[i] == x:
            return i
    return -1

print(indice([4, 8, 1], 8), indice([4, 8, 1], 5))
```

Le `return -1` est **après** la boucle : on ne conclut à l'absence qu'après avoir tout vu.

## 2. Chercher un extremum

```python exec
def maximum(t):
    m = t[0]
    for x in t:
        if x > m:
            m = x
    return m

print(maximum([-4, -1, -7]))
```

On initialise avec `t[0]`, et non avec 0 : sinon, le résultat est faux pour des nombres négatifs.

## 3. Calculer une moyenne

```python exec
def moyenne(t):
    s = 0
    for x in t:
        s = s + x
    return s / len(t)

print(moyenne([12, 15, 9]))
```

## 4. Le coût est linéaire

Le **coût** est le nombre d'opérations en fonction de la taille n du tableau. Ici, on examine au plus n cases : le coût est **linéaire**. Si le tableau est deux fois plus grand, le temps double.

Pour la recherche, le **pire cas** est l'élément absent.

## L'essentiel

- Occurrence : conclure à l'absence après la boucle.
- Extremum : initialiser avec `t[0]`.
- Coût linéaire : proportionnel à la taille du tableau.

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
