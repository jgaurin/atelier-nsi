---
titre: Les booléens
resume: "Les opérateurs and, or, not et xor, les tables de vérité, et l'addition binaire réalisée par des circuits."
duree: 40
objectifs:
  - "Dresser la table de vérité d'une expression booléenne"
  - "Connaître le ou exclusif"
  - "Expliquer l'évaluation séquentielle de and et de or"
---

Un **booléen** ne peut prendre que deux valeurs : vrai ou faux, 1 ou 0. Ils servent dans les conditions des programmes, et les circuits du processeur en sont faits.

## 1. Les opérateurs

| a | b | not a | a and b | a or b | a xor b |
| --- | --- | --- | --- | --- | --- |
| 0 | 0 | 1 | 0 | 0 | 0 |
| 0 | 1 | 1 | 0 | 1 | 1 |
| 1 | 0 | 0 | 0 | 1 | 1 |
| 1 | 1 | 0 | 1 | 1 | 0 |

- **not** inverse la valeur.
- **and** vaut 1 si les deux valent 1.
- **or** vaut 1 si au moins un vaut 1.
- **xor** (ou exclusif) vaut 1 si **exactement un** vaut 1.

## 2. Dresser une table

:::methode[Table de vérité]
On écrit toutes les combinaisons des variables (4 pour 2 variables, 8 pour 3), puis on ajoute une colonne par morceau de l'expression.
:::

:::exemple
Pour `not a or b`, on calcule d'abord `not a`, puis on fait le `or` avec `b`.
:::

## 3. Évaluation séquentielle

Python lit `and` et `or` **de gauche à droite** et s'arrête dès que le résultat est connu.

- Dans `a and b`, si `a` est faux, `b` n'est pas évalué.
- Dans `a or b`, si `a` est vrai, `b` n'est pas évalué.

Cela évite des erreurs :

```python
if i < len(t) and t[i] == 5:
```

Si `i` est trop grand, `t[i]` n'est jamais lu.

## 4. Additionner avec des booléens

Pour additionner deux bits a et b :

- la **somme** vaut `a xor b` ;
- la **retenue** vaut `a and b`.

C'est le **demi-additionneur**. Un **circuit combinatoire** réalise ainsi une fonction booléenne : les processeurs sont faits de tels circuits.

:::histoire
George Boole invente en 1847 ce calcul sur le vrai et le faux, un siècle avant les premiers ordinateurs.
:::

## L'essentiel

- `and` : les deux. `or` : au moins un. `not` : l'inverse. `xor` : exactement un.
- Une table de vérité liste toutes les combinaisons.
- `and` et `or` s'évaluent de gauche à droite et s'arrêtent dès que possible.
- Somme de deux bits : `xor`. Retenue : `and`.

## Exercices

::::exercice[QCM : booléens]{niveau=1 type=quiz}
Une question à la fois : la correction s'affiche aussitôt.

1. Que vaut `True and False` ?

   - [ ] `True`
   - [x] `False`
   - [ ] 1
   - [ ] une erreur

   > `and` demande que les deux soient vrais.

1. Que vaut `True or False` ?

   - [x] `True`
   - [ ] `False`
   - [ ] 0
   - [ ] une erreur

   > Un seul vrai suffit pour `or`.

1. Que vaut `True or True` ?

   - [x] `True`
   - [ ] `False`
   - [ ] cela dépend
   - [ ] une erreur

   > Le « ou » logique est **inclusif**.

1. Que vaut `a xor b` quand a = 1 et b = 1 ?

   - [ ] 1
   - [x] 0
   - [ ] 2
   - [ ] 11

   > Le ou exclusif est vrai si **exactement un** des deux est vrai.

1. Combien de lignes compte la table de vérité d'une expression à 3 variables ?

   - [ ] 3
   - [ ] 6
   - [x] 8
   - [ ] 9

   > 2³ = 8 combinaisons.

1. Que vaut `not (3 > 2 and 1 > 5)` ?

   - [x] `True`
   - [ ] `False`
   - [ ] 3
   - [ ] une erreur

   > `3 > 2 and 1 > 5` est faux ; `not` donne vrai.

1. Quelle expression est équivalente à `not (a or b)` ?

   - [ ] `not a or not b`
   - [x] `not a and not b`
   - [ ] `a and b`
   - [ ] `not a or b`

   > Loi de De Morgan : la négation d'un « ou » est le « et » des négations.

1. Pour quelles valeurs `(a or b) and not c` est-il vrai quand a = 1, b = 0 ?

   - [x] seulement si c = 0
   - [ ] seulement si c = 1
   - [ ] toujours
   - [ ] jamais

   > `a or b` vaut 1 ; il faut `not c` vrai, donc c = 0.

1. Avec `t = [1, 2]` et `i = 3`, que fait `i < len(t) and t[i] > 0` ?

   - [ ] une erreur `IndexError`
   - [x] il vaut `False` sans évaluer `t[i]`
   - [ ] il vaut `True`
   - [ ] il vaut 0

   > `i < len(t)` est faux : Python n'évalue pas la suite.

1. Et que fait `t[i] > 0 and i < len(t)` avec les mêmes valeurs ?

   - [x] une erreur `IndexError`
   - [ ] il vaut `False`
   - [ ] il vaut `True`
   - [ ] rien

   > `t[3]` est évalué en premier : il n'existe pas.

1. Dans un demi-additionneur, comment obtient-on le bit de retenue ?

   - [ ] `a or b`
   - [ ] `a xor b`
   - [x] `a and b`
   - [ ] `not a`

   > La retenue vaut 1 seulement pour 1 + 1.

1. Que vaut `True + True` en Python ?

   - [ ] `True`
   - [x] 2
   - [ ] une erreur
   - [ ] 1

   > Dans un calcul, `True` vaut 1.
::::

::::exercice[Compléter une table]{niveau=1 type=completer}
Complète la table de `a and not b`.

```python calcul
for a in (0, 1):
    for b in (0, 1):
        print(1 - b)
        print(int(a and (1 - b)))
```

| a | b | not b | a and not b |
| --- | --- | --- | --- |
| 0 | 0 | [[1]] | [[0]] |
| 0 | 1 | [[0]] | [[0]] |
| 1 | 0 | [[1]] | [[1]] |
| 1 | 1 | [[0]] | [[0]] |
::::

::::exercice[Une table à trois variables]{niveau=2 type=completer}
Complète la table de `(a or b) and c`.

```python calcul
for a in (0, 1):
    for b in (0, 1):
        for c in (0, 1):
            print(int(a or b))
            print(int((a or b) and c))
```

| a | b | c | a or b | (a or b) and c |
| --- | --- | --- | --- | --- |
| 0 | 0 | 0 | [[0]] | [[0]] |
| 0 | 0 | 1 | [[0]] | [[0]] |
| 0 | 1 | 0 | [[1]] | [[0]] |
| 0 | 1 | 1 | [[1]] | [[1]] |
| 1 | 0 | 0 | [[1]] | [[0]] |
| 1 | 0 | 1 | [[1]] | [[1]] |
| 1 | 1 | 0 | [[1]] | [[0]] |
| 1 | 1 | 1 | [[1]] | [[1]] |
::::

::::exercice[Que vaut cette expression ?]{niveau=1 type=reponses}
On a `a = True`, `b = False` et `n = 5`. Réponds `True` ou `False`.

1. Que vaut cette expression ?

   ```python verifier
   a, b, n = True, False, 5
   print(a and not b)
   ```

   - True

1. Que vaut cette expression ?

   ```python verifier
   a, b, n = True, False, 5
   print(b or n > 10)
   ```

   - False

1. Que vaut cette expression ?

   ```python verifier
   a, b, n = True, False, 5
   print(not (a and n == 5))
   ```

   - False

1. Que vaut cette expression ?

   ```python verifier
   a, b, n = True, False, 5
   print(a != b)
   ```

   - True

   > Sur des booléens, `!=` se comporte comme le ou exclusif.
::::

::::exercice[Le demi-additionneur]{niveau=2 type=completer}
Complète la table d'addition de deux bits.

```python calcul
for a in (0, 1):
    for b in (0, 1):
        print(a ^ b)
        print(a & b)
print("xor")
print("and")
```

| a | b | Somme | Retenue |
| --- | --- | --- | --- |
| 0 | 0 | [[0]] | [[0]] |
| 0 | 1 | [[1]] | [[0]] |
| 1 | 0 | [[1]] | [[0]] |
| 1 | 1 | [[0]] | [[1]] |

La colonne Somme correspond à l'opérateur [[xor;ou exclusif]] et la colonne Retenue à l'opérateur [[and;et]].
::::

::::exercice[Évaluation séquentielle]{niveau=2}
On considère `t = [4, 8]`, puis les deux instructions suivantes :

```python
i = 2
print(i < len(t) and t[i] == 8)
print(t[i] == 8 and i < len(t))
```

La première ligne d'affichage fonctionne, la seconde provoque une erreur. Explique pourquoi.

:::criteres
- Tu dis que `and` évalue de gauche à droite et s'arrête dès que le résultat est connu.
- Dans la première expression, `i < len(t)` est faux : `t[i]` n'est pas lu.
- Dans la seconde, `t[i]` est lu en premier, alors que l'indice 2 n'existe pas.
:::

:::corrige
`and` évalue ses opérandes de gauche à droite et s'arrête dès que le résultat est connu. Dans la première expression, `i < len(t)` est faux : le résultat est donc faux et `t[i]` n'est pas lu. Dans la seconde, `t[2]` est lu en premier, or le tableau n'a pas d'indice 2 : Python provoque une `IndexError`.
:::
::::
