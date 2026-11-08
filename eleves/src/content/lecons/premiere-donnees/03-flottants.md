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
