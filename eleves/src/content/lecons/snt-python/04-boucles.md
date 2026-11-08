---
titre: Les boucles
resume: "Répéter des instructions un nombre connu de fois, ou tant qu'une condition est vraie."
duree: 35
objectifs:
  - "Écrire une boucle bornée avec for"
  - "Écrire une boucle non bornée avec while"
  - "Utiliser un compteur et un accumulateur"
prerequis: [snt-python/conditions]
---

Une boucle répète des instructions. On distingue deux sortes de boucles.

## 1. La boucle bornée : `for`

On l'utilise quand on connaît le nombre de tours.

```python exec
for i in range(4):
    print(i)
```

| Écriture | Valeurs de `i` |
| --- | --- |
| `range(4)` | 0, 1, 2, 3 |
| `range(2, 5)` | 2, 3, 4 |

La dernière valeur n'est jamais atteinte.

## 2. La boucle non bornée : `while`

Elle répète **tant que** la condition est vraie.

```python exec
n = 1
while n < 20:
    n = n * 2
print(n)
```

:::attention
Si la condition reste toujours vraie, la boucle ne s'arrête jamais. Quelque chose doit changer à chaque tour.
:::

## 3. Compter et additionner

Une variable de départ, puis une mise à jour à chaque tour.

```python exec
somme = 0
for i in range(1, 6):
    somme = somme + i
print(somme)
```

## L'essentiel

- `for i in range(n)` : n tours, avec i de 0 à n − 1.
- `while condition:` répète tant que la condition est vraie.
- Pour accumuler : on initialise avant la boucle, on met à jour dedans.

## Exercices

::::exercice[QCM : boucles]{niveau=1 type=quiz}
Une question à la fois : la correction s'affiche aussitôt.

1. Combien de tours fait `for i in range(5):` ?

   - [ ] 4
   - [x] 5
   - [ ] 6
   - [ ] on ne peut pas savoir

   > i prend les valeurs 0, 1, 2, 3 et 4.

1. Quelle est la dernière valeur de `i` dans `for i in range(3, 7):` ?

   - [ ] 3
   - [x] 6
   - [ ] 7
   - [ ] 4

   > La valeur 7 n'est pas atteinte.

1. Quelle boucle choisir pour répéter jusqu'à ce que le joueur gagne ?

   - [ ] `for`
   - [x] `while`
   - [ ] `if`
   - [ ] `def`

   > On ne connaît pas le nombre de tours à l'avance.

1. Que risque-t-on avec `while x > 0:` si `x` ne change jamais ?

   - [x] une boucle infinie
   - [ ] une erreur de syntaxe
   - [ ] rien
   - [ ] un seul tour

   > La condition reste vraie.
::::

::::exercice[Dérouler une boucle]{niveau=1 type=reponses}
Lis chaque programme et donne ce qu'il affiche.

1. Que s'affiche-t-il ?

   ```python verifier
   s = 0
   for i in range(4):
       s = s + 2
   print(s)
   ```

   - 8

1. Que s'affiche-t-il ?

   ```python verifier
   s = 0
   for i in range(4):
       s = s + i
   print(s)
   ```

   - 6

1. Que s'affiche-t-il ?

   ```python verifier
   n = 100
   t = 0
   while n > 1:
       n = n // 2
       t = t + 1
   print(t)
   ```

   - 6
::::

::::exercice[La somme des carrés]{niveau=2}
Écris `somme_carres(n)`, qui renvoie 1² + 2² + … + n².

```python depart
def somme_carres(n):
    ...
```

```python tests
assert somme_carres(1) == 1, "1"
assert somme_carres(3) == 14, "1 + 4 + 9"
assert somme_carres(0) == 0, "aucun terme"
```

:::corrige
```python solution
def somme_carres(n):
    s = 0
    for i in range(1, n + 1):
        s = s + i * i
    return s
```

Il faut écrire `n + 1`, car la borne de droite de `range` n'est pas atteinte.
:::
::::

::::exercice[Une tirelire]{niveau=3}
On place 100 € sur un livret qui rapporte 3 % chaque année.

1. Écris `capital(depart, annees)`, qui renvoie le capital après un nombre donné d'années.
2. Écris `annees_pour(depart, objectif)`, qui renvoie le nombre d'années nécessaires pour atteindre au moins `objectif`.
3. À l'écrit : pourquoi utilise-t-on `for` dans la première fonction et `while` dans la seconde ?

```python depart
def capital(depart, annees):
    ...

def annees_pour(depart, objectif):
    ...
```

```python tests
assert capital(100, 0) == 100, "aucune année"
assert round(capital(100, 2), 2) == 106.09, "deux ans"
assert annees_pour(100, 100) == 0, "objectif déjà atteint"
assert annees_pour(100, 106) == 2, "deux ans"
assert annees_pour(100, 200) == 24, "doubler"
```

:::corrige
```python solution
def capital(depart, annees):
    c = depart
    for i in range(annees):
        c = c * 1.03
    return c

def annees_pour(depart, objectif):
    c = depart
    n = 0
    while c < objectif:
        c = c * 1.03
        n = n + 1
    return n
```

**Question 3.** Dans `capital`, on connaît le nombre de tours. Dans `annees_pour`, c'est justement ce qu'on cherche : on répète tant que l'objectif n'est pas atteint.
:::
::::
