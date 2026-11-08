---
titre: Dérouler un programme machine
resume: "Suivre à la main l'exécution d'instructions simples, proches de celles du processeur."
duree: 35
objectifs:
  - "Dérouler l'exécution d'une séquence d'instructions de type langage machine"
  - "Expliquer le rôle des instructions de saut"
prerequis: [premiere-architecture/von-neumann]
---

Le processeur exécute des instructions très simples. On les écrit en **assembleur**, la version lisible du **langage machine** (binaire).

## 1. Une machine simple

Notre machine a un registre **A** et ces instructions.

| Instruction | Effet |
| --- | --- |
| `LOAD x` | A reçoit le contenu de la case x |
| `STORE x` | la case x reçoit A |
| `ADD x` | A reçoit A + le contenu de la case x |
| `SUB x` | A reçoit A − le contenu de la case x |
| `JUMP n` | aller à l'instruction n |
| `JUMPZ n` | si A = 0, aller à l'instruction n |
| `HALT` | arrêter |

:::attention
`LOAD 10` charge le **contenu** de la case 10, pas le nombre 10.
:::

## 2. Dérouler

Programme : case 10 = 5, case 11 = 7.

```
0  LOAD 10
1  ADD 11
2  STORE 12
3  HALT
```

| Compteur | Instruction | A | Mémoire |
| --- | --- | --- | --- |
| 0 | `LOAD 10` | 5 | |
| 1 | `ADD 11` | 12 | |
| 2 | `STORE 12` | 12 | case 12 = 12 |
| 3 | `HALT` | 12 | |

## 3. Les sauts

`JUMP` et `JUMPZ` permettent les **conditions** et les **boucles**. Un `if` ou un `while` en Python est traduit avec des sauts.

## L'essentiel

- `LOAD`, `STORE`, `ADD`, `SUB` lisent, écrivent et calculent.
- Pour dérouler, on suit le compteur, le registre et la mémoire.
- Les sauts réalisent les conditions et les boucles.

## Exercices

::::exercice[QCM : langage machine]{niveau=1 type=quiz}
Une question à la fois : la correction s'affiche aussitôt.

1. Que contient le compteur de programme ?

   - [ ] le nombre d'instructions déjà exécutées
   - [x] l'adresse de la prochaine instruction à exécuter
   - [ ] le résultat du dernier calcul
   - [ ] la vitesse du processeur

   > Il avance après chaque instruction, ou change lors d'un saut.

1. La case 10 contient 42. Après `LOAD 10`, que vaut A ?

   - [ ] 10
   - [x] 42
   - [ ] 52
   - [ ] 0

   > On charge le contenu de l'adresse 10.

1. À quoi servent les instructions de saut (`JUMP`, `JUMPZ`) ?

   - [ ] à accélérer le processeur
   - [x] à réaliser des conditions et des boucles
   - [ ] à effacer la mémoire
   - [ ] à communiquer avec l'écran

   > Un `while` devient un test suivi d'un saut en arrière.

1. Quelle est la différence entre langage machine et assembleur ?

   - [ ] l'assembleur est plus rapide
   - [x] l'assembleur est l'écriture lisible des instructions machine
   - [ ] le langage machine est un langage de haut niveau
   - [ ] aucune

   > Une instruction assembleur correspond à une instruction machine.

::::

::::exercice[Dérouler un calcul]{niveau=1 type=completer}
La case 20 contient 9, la case 21 contient 4. Complète le déroulé.

```
0  LOAD 20
1  SUB 21
2  ADD 20
3  STORE 22
4  HALT
```

```python calcul
a = 9
print(a)
a = a - 4
print(a)
a = a + 9
print(a)
print(a)
```

| Compteur | Instruction | A après l'instruction |
| --- | --- | --- |
| 0 | `LOAD 20` | [[9]] |
| 1 | `SUB 21` | [[5]] |
| 2 | `ADD 20` | [[14]] |
| 3 | `STORE 22` | [[14]] |
::::

::::exercice[Dérouler un programme avec une boucle]{niveau=2}
La case 20 contient 3, la case 21 contient 1, la case 22 contient 0. Déroule ce programme instruction par instruction (CP, A, mémoire) et dis
ce qu'il calcule dans la case 22.

```
0  LOAD 20
1  JUMPZ 9
2  LOAD 22
3  ADD 20
4  STORE 22
5  LOAD 20
6  SUB 21
7  STORE 20
8  JUMP 0
9  HALT
```

:::criteres
- Le déroulé suit correctement les sauts : trois passages dans la boucle.
- Les valeurs successives de la case 22 : 3, 5, 6.
- La conclusion : le programme calcule 3 + 2 + 1 = 6 (la somme des entiers de 1 à n).
:::

:::corrige
Premier passage : A = 3 (non nul, pas de saut), case 22 = 0 + 3 = 3, case 20 = 3 − 1 = 2, saut en 0. Deuxième passage : A = 2, case 22 =
3 + 2 = 5, case 20 = 1. Troisième passage : A = 1, case 22 = 5 + 1 = 6, case 20 = 0. Quatrième passage : `LOAD 20` donne A = 0, `JUMPZ 9`
saute à `HALT`. La case 22 contient **6 = 3 + 2 + 1** : le programme calcule la somme des entiers de 1 à n (n étant dans la case 20). En
Python : `while n != 0: s = s + n; n = n - 1`.
:::
::::

::::exercice[Écrire un programme en assembleur]{niveau=2}
Avec les instructions du cours, écris un programme qui calcule `d = a − b + c`, avec a en case 10, b en case 11, c en case 12 et d en case 13.
Puis explique pourquoi il faut une instruction `STORE` à la fin.

:::criteres
- Programme correct : `LOAD 10`, `SUB 11`, `ADD 12`, `STORE 13`, `HALT`.
- Explication : le résultat est dans le registre A, il faut l'écrire en mémoire pour le conserver ; le registre sera écrasé par la suite.
:::

:::corrige
```
0  LOAD 10
1  SUB 11
2  ADD 12
3  STORE 13
4  HALT
```

Le calcul se fait dans le registre **A**, à l'intérieur du processeur. Sans `STORE 13`, le résultat n'existerait que dans ce registre, qui
sera réutilisé (et écrasé) par l'instruction `LOAD` suivante : il faut le recopier dans une case **mémoire** pour le conserver et que le reste du
programme puisse s'en servir.
:::
::::

::::exercice[Une multiplication sans multiplier]{niveau=3 type=reponses}
La case 20 contient 4, la case 21 contient 3, la case 22 contient 0 et la case 23 contient 1.

```
0  LOAD 20
1  JUMPZ 9
2  LOAD 22
3  ADD 21
4  STORE 22
5  LOAD 20
6  SUB 23
7  STORE 20
8  JUMP 0
9  HALT
```

1. Que contient la case 22 à la fin ?

   ```python calcul
   m = {20: 4, 21: 3, 22: 0, 23: 1}
   p = 0
   a = 0
   code = [("LOAD", 20), ("JUMPZ", 9), ("LOAD", 22), ("ADD", 21), ("STORE", 22), ("LOAD", 20), ("SUB", 23), ("STORE", 20), ("JUMP", 0), ("HALT", 0)]
   while code[p][0] != "HALT":
       i, x = code[p]
       p = p + 1
       if i == "LOAD": a = m[x]
       elif i == "ADD": a = a + m[x]
       elif i == "SUB": a = a - m[x]
       elif i == "STORE": m[x] = a
       elif i == "JUMP": p = x
       elif i == "JUMPZ" and a == 0: p = x
   print(m[22])
   ```

   - 12

1. Combien de fois l'instruction `ADD 21` est-elle exécutée ?

   - 4

1. Combien d'instructions sont exécutées au total, `HALT` compris ?

   ```python calcul
   print(9 * 4 + 3)
   ```

   - 39

1. Quel est le numéro de l'instruction qui décide de sortir de la boucle ?

   - 1

1. Quelle valeur contient le registre A à la fin ?

   - 0

1. Si la case 20 contient 0 au départ, que contient la case 22 à la fin ?

   - 0

1. En Python, ce programme correspond à quelle boucle : `for` ou `while` ?

   - while
::::
