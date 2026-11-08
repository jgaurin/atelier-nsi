---
titre: Les nombres flottants
resume: "Pourquoi un ordinateur ne stocke qu'une valeur approchée de la plupart des nombres à virgule, et pourquoi 0.1 + 0.2 n'est pas égal à 0.3."
duree: 30
objectifs:
  - "Écrire en binaire quelques nombres comme 0,25 ou 0,75"
  - "Expliquer pourquoi 0,1 n'a pas d'écriture binaire exacte"
  - "Ne pas tester l'égalité de deux flottants"
prerequis: [premiere-donnees/bases]
---

Les nombres à virgule sont stockés sous une forme appelée **nombre flottant**. Cette forme est souvent **approximative**, et cela a des conséquences très concrètes.

## 1. La virgule en binaire

Après la virgule, les positions valent ½, ¼, ⅛…

| ½ | ¼ | ⅛ | 1/16 |
| --- | --- | --- | --- |
| 0,5 | 0,25 | 0,125 | 0,0625 |

:::exemple
0,101 en binaire vaut 0,5 + 0,125 = **0,625**.
:::

:::methode[Partie décimale vers le binaire]
On multiplie par 2. La partie entière obtenue donne le bit suivant. On recommence avec la partie décimale.
:::

:::exemple
Pour 0,75 : 0,75 × 2 = **1**,5 ; 0,5 × 2 = **1**,0. Donc 0,75 s'écrit **0,11** en binaire.
:::

## 2. Des nombres sans écriture exacte

0,25 s'écrit exactement. Mais 0,1 ne tombe jamais juste :

0,1 → 0,2 → 0,4 → 0,8 → 1,6 → 1,2 → 0,4 → …

Les bits **0011** se répètent à l'infini : 0,1 s'écrit 0,0001100110011… De même, 1/3 s'écrit 0,010101… sans fin.

Or la mémoire est limitée. L'ordinateur **coupe** cette écriture : il garde une valeur **approchée**.

## 3. La conséquence

```python
>>> 0.1 + 0.2
0.30000000000000004
>>> 0.1 + 0.2 == 0.3
False
```

:::attention[Ne jamais tester l'égalité de deux flottants]
On vérifie plutôt que les deux nombres sont **très proches** :

```python
abs(a - b) < 0.000001
```
:::

## L'essentiel

- Après la virgule, les positions binaires valent 0,5 ; 0,25 ; 0,125…
- Beaucoup de nombres, comme 0,1 ou 1/3, n'ont pas d'écriture binaire finie.
- Un flottant est donc souvent une **valeur approchée**.
- On ne teste pas l'égalité de deux flottants avec `==`.

## Exercices

::::exercice[QCM : nombres flottants]{niveau=1 type=quiz}
Une question à la fois : la correction s'affiche aussitôt.

1. Que vaut 0,1₂ (en binaire) ?

   - [ ] 0,1
   - [x] 0,5
   - [ ] 0,25
   - [ ] 1

   > Le premier chiffre après la virgule vaut 1/2.

1. Que vaut 0,11₂ ?

   - [ ] 0,11
   - [ ] 0,5
   - [x] 0,75
   - [ ] 3

   > 1/2 + 1/4 = 0,75.

1. Quelle est l'écriture binaire de 0,25 ?

   - [x] 0,01
   - [ ] 0,1
   - [ ] 0,11
   - [ ] 0,001

   > 0,25 = 1/4 : le deuxième bit après la virgule.

1. Quelle est l'écriture binaire de 0,625 ?

   - [ ] 0,011
   - [x] 0,101
   - [ ] 0,110
   - [ ] 0,111

   > 0,5 + 0,125 = 0,625.

1. Lequel de ces nombres a une écriture binaire finie ?

   - [ ] 0,1
   - [ ] 1/3
   - [x] 0,75
   - [ ] 0,2

   > 0,75 = 3/4 : dénominateur puissance de 2.

1. Pourquoi 0,1 ne peut-il pas être stocké exactement ?

   - [ ] parce qu'il est trop petit
   - [x] parce que son écriture en base 2 est infinie (périodique)
   - [ ] parce que Python arrondit tout à l'entier
   - [ ] parce que c'est un nombre négatif

   > 0,1 = 0,000110011…₂ : il faut tronquer.

1. Que renvoie `0.1 + 0.2 == 0.3` en Python ?

   - [ ] `True`
   - [x] `False`
   - [ ] une erreur
   - [ ] `0.3`

   > La somme vaut 0.30000000000000004.

1. Comment tester correctement si un flottant `x` vaut 0,3 ?

   - [ ] `x == 0.3`
   - [x] `abs(x - 0.3) < 1e-9`
   - [ ] `x = 0.3`
   - [ ] `int(x) == 0.3`

   > On compare avec une tolérance.

1. Que vaut `0.5 + 0.25 == 0.75` ?

   - [x] `True`
   - [ ] `False`
   - [ ] une erreur
   - [ ] cela dépend de l'ordinateur

   > Ces nombres sont exacts en binaire : le calcul l'est aussi.

1. Qu'est-ce qu'un nombre flottant ?

   - [ ] un nombre entier très grand
   - [x] une représentation approchée d'un réel avec un signe, une mantisse et un exposant
   - [ ] un nombre qui change de valeur tout seul
   - [ ] un nombre écrit en hexadécimal

   > C'est l'écriture scientifique en base 2, avec une précision limitée.

1. Un élève écrit `x = 0` puis `while x != 1: x = x + 0.1`. Que se passe-t-il ?

   - [ ] la boucle s'arrête après 10 tours
   - [x] la boucle ne s'arrête jamais, car x ne vaut jamais exactement 1
   - [ ] une erreur
   - [ ] la boucle ne s'exécute pas

   > Les erreurs d'arrondi s'accumulent : x passe à côté de 1. Utiliser une boucle bornée ou une tolérance.
::::

::::exercice[Écrire en binaire]{niveau=1 type=reponses}
Écris ces nombres en binaire, avec une virgule.

1. 0,5

   - 0,1

1. 0,25

   - 0,01

1. 0,625

   - 0,101

1. 2,75

   - 10,11

   > 2 s'écrit 10 et 0,75 s'écrit 0,11.
::::

::::exercice[Du binaire au décimal]{niveau=1 type=reponses}
Donne la valeur décimale, avec une virgule.

1. 0,11

   ```python calcul
   print(0.5 + 0.25)
   ```

   - 0,75

1. 0,001

   ```python calcul
   print(0.125)
   ```

   - 0,125

1. 1,1

   ```python calcul
   print(1 + 0.5)
   ```

   - 1,5

1. 101,01

   ```python calcul
   print(5 + 0.25)
   ```

   - 5,25
::::

::::exercice[Dérouler les multiplications]{niveau=2 type=completer}
On cherche l'écriture binaire de 0,1. Complète le tableau.

| Nombre | Nombre × 2 | Bit obtenu | Reste |
| --- | --- | --- | --- |
| 0,1 | 0,2 | 0 | 0,2 |
| 0,2 | [[0,4]] | [[0]] | [[0,4]] |
| 0,4 | [[0,8]] | [[0]] | [[0,8]] |
| 0,8 | [[1,6]] | [[1]] | [[0,6]] |
| 0,6 | [[1,2]] | [[1]] | [[0,2]] |

Le reste 0,2 est déjà apparu : les bits vont donc se répéter [[à l'infini;indéfiniment;sans fin]].

:::corrige
On retrouve le reste 0,2 : on retombe sur les mêmes calculs. L'écriture binaire de 0,1 est infinie, donc l'ordinateur en garde une valeur approchée.
:::
::::

::::exercice[Que renvoie Python ?]{niveau=2 type=reponses}
Réponds `True` ou `False`.

1. Que vaut cette expression ?

   ```python verifier
   print(0.5 + 0.25 == 0.75)
   ```

   - True

   > 0,5 et 0,25 s'écrivent exactement en binaire.

1. Que vaut cette expression ?

   ```python verifier
   print(0.1 + 0.2 == 0.3)
   ```

   - False

   > 0,1 et 0,2 sont des valeurs approchées.

1. Que vaut cette expression ?

   ```python verifier
   print(abs(0.1 + 0.2 - 0.3) < 0.000001)
   ```

   - True

   > C'est la bonne façon de comparer deux flottants.
::::

::::exercice[Expliquer un résultat surprenant]{niveau=2}
Un camarade voit `0.30000000000000004` s'afficher et affirme que Python s'est trompé. Explique-lui ce qui se passe, en deux ou trois phrases.

:::criteres
- 0,1 et 0,2 n'ont pas d'écriture binaire finie.
- La mémoire étant limitée, l'ordinateur stocke des valeurs approchées.
- Le résultat est donc lui aussi approché : il n'y a pas d'erreur de Python.
:::

:::corrige
Python ne se trompe pas : 0,1 et 0,2 n'ont pas d'écriture finie en binaire. Comme la mémoire est limitée, l'ordinateur en garde des valeurs approchées, et leur somme l'est aussi. C'est pour cela qu'on ne compare pas des flottants avec `==`.
:::
::::
