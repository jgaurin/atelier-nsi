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

Comment l'ordinateur stocke-t-il 0,1 ou 3,14 ? Sous une forme appelée **nombre flottant**. Tu vas voir que ce stockage est souvent **approximatif**, et pourquoi.

## 1. La virgule en base 10

En base 10, les positions après la virgule valent un dixième, un centième, un millième :

0,375 = 3/10 + 7/100 + 5/1 000

## 2. La virgule en base 2

En base 2, c'est pareil, mais chaque position vaut la **moitié** de la précédente.

| Position | 1/2 | 1/4 | 1/8 | 1/16 |
| --- | --- | --- | --- | --- |
| Valeur | 0,5 | 0,25 | 0,125 | 0,0625 |

:::exemple
0,101 en binaire : il y a un 1 sous 0,5 et un 1 sous 0,125. La valeur est 0,5 + 0,125 = **0,625**.
:::

## 3. Convertir un nombre décimal en binaire

:::methode[Les multiplications par 2]
On multiplie la partie après la virgule par 2. La partie entière obtenue, 0 ou 1, est le bit suivant. On recommence avec ce qui reste après la virgule, jusqu'à obtenir 0.
:::

Pourquoi ? Multiplier par 2 décale tous les bits d'un cran vers la gauche : le premier bit après la virgule passe devant la virgule, où on peut le lire.

:::exemple
Pour 0,625 :

| Calcul | Bit obtenu | Il reste |
| --- | --- | --- |
| 0,625 × 2 = **1**,25 | 1 | 0,25 |
| 0,25 × 2 = **0**,5 | 0 | 0,5 |
| 0,5 × 2 = **1**,0 | 1 | 0 |

On lit les bits de haut en bas : 0,625 s'écrit **0,101**.
:::

## 4. Des nombres qui ne tombent jamais juste

Essayons avec 0,1 :

| Calcul | Bit | Il reste |
| --- | --- | --- |
| 0,1 × 2 = 0,2 | 0 | 0,2 |
| 0,2 × 2 = 0,4 | 0 | 0,4 |
| 0,4 × 2 = 0,8 | 0 | 0,8 |
| 0,8 × 2 = 1,6 | 1 | 0,6 |
| 0,6 × 2 = 1,2 | 1 | 0,2 |
| 0,2 × 2 = 0,4 | 0 | 0,4 |

On retombe sur 0,2 : les calculs recommencent à l'identique, sans jamais atteindre 0. 0,1 s'écrit 0,000110011001100… avec **0011** qui se répète à l'infini. De même, 1/3 s'écrit 0,010101… sans fin.

C'est comme 1/3 en base 10 : 0,3333… ne s'arrête jamais. Or la mémoire est limitée : l'ordinateur **coupe** l'écriture et garde une valeur **approchée**.

Seuls les nombres qui sont des sommes de 1/2, 1/4, 1/8… s'écrivent exactement : 0,5, 0,25 ou 0,75 tombent juste, 0,1 ou 0,2 non.

## 5. La conséquence

0,1 et 0,2 sont tous les deux légèrement faux en mémoire. Leurs petites erreurs s'additionnent :

```python
>>> 0.1 + 0.2
0.30000000000000004
>>> 0.1 + 0.2 == 0.3
False
>>> 0.5 + 0.25 == 0.75
True
```

La dernière égalité est vraie, car 0,5, 0,25 et 0,75 s'écrivent exactement en binaire.

:::attention[Ne jamais tester l'égalité de deux flottants]
On vérifie plutôt que les deux nombres sont **très proches** :

```python
abs(a - b) < 0.000001
```
:::

## L'essentiel

- Après la virgule, les positions binaires valent 0,5 ; 0,25 ; 0,125…
- Pour convertir : on multiplie par 2, et la partie entière donne le bit suivant.
- 0,1 ou 1/3 n'ont pas d'écriture binaire finie : l'ordinateur en garde une valeur approchée.
- On ne teste jamais l'égalité de deux flottants avec `==`.

## Exercices

::::exercice[QCM : nombres flottants]{niveau=1 type=quiz}
Une question à la fois : la correction s'affiche aussitôt.

1. Que vaut 0,11₂ ?

   - [ ] 0,11
   - [ ] 0,5
   - [x] 0,75
   - [ ] 3

   > 1/2 + 1/4 = 0,75.

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

::::exercice[Une boucle qui ne s'arrête pas]{niveau=3}
Une cagnotte augmente de 10 centimes à chaque tour. Le programme suivant ne s'arrête jamais.

```python
x = 0
while x != 1:
    x = x + 0.1
```

1. Explique pourquoi `x` ne vaut jamais exactement 1.
2. Corrige la condition en gardant des flottants, pour que la boucle s'arrête quand `x` atteint environ 1.
3. Propose une autre façon de faire, sans flottant.
4. Un autre programme additionne dix fois `0.25` et teste si le résultat vaut `2.5`. Le test réussit-il ? Justifie.

:::criteres
- 0,1 n'a pas d'écriture binaire finie : la mémoire en garde une valeur approchée, et les erreurs s'accumulent.
- On arrête la boucle avec une condition du type `x < 1 - 0.000001`.
- On compte en centimes entiers.
- 0,25 s'écrit exactement en binaire, donc le test réussit.
:::

:::corrige
1. 0,1 n'a pas d'écriture binaire finie. L'ordinateur en garde une valeur approchée, et les petites erreurs s'accumulent : après dix tours, `x` vaut 0,99999… et non 1. La condition reste vraie indéfiniment.
2. On écrit `while x < 1 - 0.000001:` : on ne teste plus l'égalité.
3. On compte en **centimes**, avec des entiers : `c = 0`, puis `while c != 100: c = c + 10`.
4. Oui. 0,25 vaut 2⁻², et 2,5 s'écrit exactement en binaire : aucun arrondi n'intervient.
:::
::::
