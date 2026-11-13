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

Afficher les nombres de 1 à 100, ou relancer un dé jusqu'à faire 6 : on ne va pas écrire cent lignes. On utilise une **boucle**, qui répète des instructions.

## 1. La boucle `for` : un nombre de tours connu

```python exec
for i in range(4):
    print(i)
```

`range(4)` donne les nombres 0, 1, 2 et 3. À chaque tour, `i` prend la valeur suivante, puis le bloc décalé s'exécute. Il y a donc **4 tours**.

| Écriture | Valeurs de `i` | Nombre de tours |
| --- | --- | --- |
| `range(4)` | 0, 1, 2, 3 | 4 |
| `range(2, 5)` | 2, 3, 4 | 3 |
| `range(1, 11)` | 1 à 10 | 10 |

:::attention
La dernière valeur n'est **jamais** atteinte : `range(1, 11)` s'arrête à 10. Pour aller jusqu'à n, on écrit `range(1, n + 1)`.
:::

## 2. Additionner avec une boucle

Pour calculer 1 + 2 + 3 + 4 + 5, on utilise une variable qui grossit à chaque tour, un **accumulateur**.

```python exec
somme = 0
for i in range(1, 6):
    somme = somme + i
print(somme)
```

| Tour | `i` | `somme` après le tour |
| --- | --- | --- |
| départ | | 0 |
| 1 | 1 | 1 |
| 2 | 2 | 3 |
| 3 | 3 | 6 |
| 4 | 4 | 10 |
| 5 | 5 | 15 |

Deux règles : on **initialise** l'accumulateur **avant** la boucle, et on le **met à jour** dedans. Si on écrivait `somme = 0` dans la boucle, il serait remis à zéro à chaque tour.

## 3. La boucle `while` : tant que…

Quand on ne sait pas à l'avance combien de tours il faut, on répète **tant qu'** une condition est vraie.

```python exec
n = 1
while n < 20:
    n = n * 2
print(n)
```

| Test | `n < 20` ? | `n` après le tour |
| --- | --- | --- |
| n = 1 | oui | 2 |
| n = 2 | oui | 4 |
| n = 4 | oui | 8 |
| n = 8 | oui | 16 |
| n = 16 | oui | 32 |
| n = 32 | non : on sort | |

Le programme affiche 32 : c'est la première puissance de 2 qui dépasse 20.

:::attention
Si la condition reste toujours vraie, la boucle ne s'arrête **jamais**. Il faut que quelque chose change à chaque tour pour qu'elle finisse par devenir fausse.
:::

## 4. Laquelle choisir ?

- On connaît le nombre de tours : **`for`**. Par exemple, faire 10 lancers de dé.
- On répète jusqu'à ce qu'une condition change : **`while`**. Par exemple, lancer le dé jusqu'à obtenir un 6.

## L'essentiel

- `for i in range(n)` : n tours, avec i de 0 à n − 1.
- `while condition:` répète tant que la condition est vraie ; quelque chose doit changer à chaque tour.
- Accumulateur : on l'initialise avant la boucle, on le met à jour dedans.

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
