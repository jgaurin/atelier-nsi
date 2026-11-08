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

::::exercice[QCM : parcours séquentiel]{niveau=1 type=quiz}
Une question à la fois : la correction s'affiche aussitôt.

1. Combien de comparaisons fait la recherche d'un élément **absent** dans un tableau de 50 éléments ?

   - [ ] 1
   - [ ] 25
   - [x] 50
   - [ ] 2 500

   > Il faut tout examiner pour conclure à l'absence.

1. Quel est le coût de la recherche du maximum dans un tableau de taille n ?

   - [ ] constant
   - [x] linéaire
   - [ ] quadratique
   - [ ] logarithmique

   > n − 1 comparaisons.

1. Pourquoi initialise-t-on le maximum avec `t[0]` plutôt qu'avec 0 ?

   - [ ] pour aller plus vite
   - [x] parce que 0 serait faux si tous les nombres sont négatifs
   - [ ] parce que 0 provoque une erreur
   - [ ] c'est une convention sans importance

   > Le résultat serait 0, qui n'est même pas dans le tableau.

1. Où placer `return False` dans la fonction `appartient` ?

   - [ ] dans un `else` dans la boucle
   - [x] après la boucle
   - [ ] avant la boucle
   - [ ] nulle part

   > On ne peut conclure à l'absence qu'après avoir tout examiné.

1. Pourquoi écrire `while i < len(t) and t[i] != x` dans cet ordre ?

   - [ ] pour la lisibilité seulement
   - [x] pour ne jamais lire `t[i]` quand i est hors du tableau
   - [ ] parce que `and` est commutatif
   - [ ] pour aller plus vite

   > Si `i < len(t)` est faux, Python n'évalue pas `t[i]`.

1. Si le tableau est 3 fois plus grand, le temps d'un algorithme linéaire est environ :

   - [ ] le même
   - [x] 3 fois plus grand
   - [ ] 9 fois plus grand
   - [ ] 3 fois plus petit

   > Coût proportionnel à n.

1. Quel est le meilleur cas pour la recherche d'une occurrence ?

   - [x] l'élément est en première position
   - [ ] l'élément est absent
   - [ ] l'élément est au milieu
   - [ ] le tableau est trié

   > Une seule comparaison suffit.

1. Que renvoie `indice_minimum([5, 2, 9, 2])` avec la fonction du cours ?

   - [ ] 2
   - [x] 1
   - [ ] 3
   - [ ] [1, 3]

   > La comparaison stricte garde la première occurrence du minimum.

1. Ces algorithmes de parcours marchent-ils sur un tableau de chaînes ?

   - [ ] non, seulement sur des nombres
   - [x] oui, les chaînes se comparent avec `==`, `<`, `>`
   - [ ] seulement la recherche du maximum
   - [ ] seulement la moyenne

   > Recherche et extremum marchent sur tout type comparable ; la moyenne exige des nombres.
::::

::::exercice[Lire un parcours]{niveau=1 type=reponses}
Donne ce que le programme affiche.

1. Que s'affiche-t-il ?

   ```python verifier
   t = [3, 7, 2, 7]
   r = -1
   for i in range(len(t)):
       if t[i] == 7:
           r = i
   print(r)
   ```

   - 3

1. Que s'affiche-t-il ?

   ```python verifier
   t = [5, 1, 4]
   m = t[0]
   for x in t:
       if x < m:
           m = x
   print(m)
   ```

   - 1
::::

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

::::exercice[Minimum et maximum en un seul parcours]{niveau=1}
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

::::exercice[Le plus jeune de la classe]{niveau=2}
Une table d'élèves est un tableau de dictionnaires `{"nom": ..., "naissance": (annee, mois, jour)}`. Écris `plus_jeune(classe)` qui renvoie le
nom de l'élève le plus jeune (date de naissance la plus **récente**). Les p-uplets se comparent dans l'ordre : `(2009, 5, 1) > (2009, 3, 20)`.

```python depart
def plus_jeune(classe):
    ...
```

```python tests
classe = [
    {"nom": "Léa", "naissance": (2009, 3, 20)},
    {"nom": "Tom", "naissance": (2009, 11, 2)},
    {"nom": "Inès", "naissance": (2008, 12, 30)},
]
assert plus_jeune(classe) == "Tom", "le plus jeune"
assert plus_jeune([{"nom": "Noé", "naissance": (2010, 1, 1)}]) == "Noé", "un seul élève"
```

:::corrige
```python solution
def plus_jeune(classe):
    meilleur = classe[0]
    for e in classe:
        if e["naissance"] > meilleur["naissance"]:
            meilleur = e
    return meilleur["nom"]
```

C'est une recherche de **maximum** sur des valeurs qui ne sont pas des nombres : on compare les dates (p-uplets), on garde la ligne entière.
:::
::::
