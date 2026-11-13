---
titre: Écrire un entier dans une base
resume: "Passer d'une base à l'autre entre le décimal, le binaire et l'hexadécimal, à la main."
duree: 40
objectifs:
  - "Convertir un entier entre les bases 2, 10 et 16"
  - "Dire quel plus grand entier s'écrit sur un nombre de bits donné"
---

Un ordinateur est fait de milliards de minuscules interrupteurs, qui ne connaissent que deux états : éteint ou allumé, 0 ou 1. Chacun de ces chiffres s'appelle un **bit**. Pour écrire n'importe quel nombre avec seulement 0 et 1, on utilise la **base 2**, ou **binaire**.

## 1. Le principe d'une base

En base 10, celle de tous les jours, la valeur d'un chiffre dépend de sa **position** :

345 = 3 × 100 + 4 × 10 + 5 × 1

Les positions valent 1, 10, 100, 1 000 : les puissances de 10. On utilise dix chiffres, de 0 à 9.

En **base 2**, c'est exactement le même principe, mais les positions valent les **puissances de 2**, et on n'utilise que deux chiffres, 0 et 1.

| Position | 2⁷ | 2⁶ | 2⁵ | 2⁴ | 2³ | 2² | 2¹ | 2⁰ |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Valeur | 128 | 64 | 32 | 16 | 8 | 4 | 2 | 1 |

Chaque position vaut le double de celle de droite. Un groupe de 8 bits s'appelle un **octet**.

## 2. Du binaire au décimal

On additionne les valeurs des positions où il y a un 1.

:::exemple
1011 en binaire : on place les chiffres sous leurs positions.

| 8 | 4 | 2 | 1 |
| --- | --- | --- | --- |
| 1 | 0 | 1 | 1 |

Les 1 sont sous 8, 2 et 1 : la valeur est 8 + 2 + 1 = **11**.
:::

## 3. Du décimal au binaire

**Méthode 1 : retirer les puissances de 2.** On prend la plus grande puissance de 2 qui tient dans le nombre, on la retire, et on recommence avec le reste.

:::exemple
Pour 13 : 8 tient dans 13, il reste 5 ; 4 tient dans 5, il reste 1 ; 2 ne tient pas dans 1 ; 1 tient, il reste 0.

| 8 | 4 | 2 | 1 |
| --- | --- | --- | --- |
| 1 | 1 | 0 | 1 |

13 s'écrit **1101**.
:::

**Méthode 2 : les divisions successives.** On divise par 2 et on note le reste, jusqu'à obtenir un quotient nul. On lit ensuite les restes **de bas en haut**.

| Division | Quotient | Reste |
| --- | --- | --- |
| 13 ÷ 2 | 6 | **1** |
| 6 ÷ 2 | 3 | **0** |
| 3 ÷ 2 | 1 | **1** |
| 1 ÷ 2 | 0 | **1** |

De bas en haut : **1101**. Pourquoi de bas en haut ? Le premier reste dit si le nombre est pair ou impair : c'est le bit des unités, tout à droite.

## 4. L'hexadécimal

Une longue suite de bits est difficile à lire : 10100111. On utilise donc souvent la **base 16**, ou **hexadécimal**. Il faut 16 chiffres : de 0 à 9, puis A, B, C, D, E, F.

| Hexadécimal | 0 à 9 | A | B | C | D | E | F |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Décimal | 0 à 9 | 10 | 11 | 12 | 13 | 14 | 15 |

Comme 16 = 2⁴, un chiffre hexadécimal correspond **exactement à 4 bits**. Pour convertir, on découpe le binaire en paquets de 4, en partant de la droite.

:::exemple
1010 0111 : 1010 vaut 8 + 2 = 10, soit A ; 0111 vaut 4 + 2 + 1 = 7. On obtient **A7**.

Dans l'autre sens, A7 en décimal vaut 10 × 16 + 7 = **167**.
:::

Tu rencontres l'hexadécimal dans les couleurs Web : `#FF8000` code le rouge, le vert et le bleu en trois octets, FF, 80 et 00.

En Python, on écrit `0b1101` pour un nombre binaire et `0xA7` pour un nombre hexadécimal.

## 5. Combien de valeurs avec n bits ?

Avec 1 bit, on écrit 2 valeurs : 0 et 1. Chaque bit ajouté **double** le nombre de possibilités, puisqu'il peut valoir 0 ou 1 devant chacune des anciennes.

| Nombre de bits | Valeurs possibles | De… à… |
| --- | --- | --- |
| 1 | 2 | 0 à 1 |
| 4 | 16 | 0 à 15 |
| 8 | 256 | 0 à 255 |
| n | 2ⁿ | 0 à 2ⁿ − 1 |

Combien de bits faut-il pour écrire 200 ? Avec 7 bits, on va jusqu'à 127 : pas assez. Avec 8 bits, on va jusqu'à 255 : il faut **8 bits**.

## L'essentiel

- En base 2, les positions valent 1, 2, 4, 8, 16… ; on additionne celles qui portent un 1.
- Décimal vers binaire : retirer les puissances de 2, ou divisions successives avec les restes lus de bas en haut.
- Un chiffre hexadécimal correspond à 4 bits ; A = 10, …, F = 15.
- Avec n bits : 2ⁿ valeurs, de 0 à 2ⁿ − 1.

## Exercices

::::exercice[QCM : binaire et hexadécimal]{niveau=1 type=quiz}
Une question à la fois : la correction s'affiche aussitôt.

1. Que vaut 101₂ en décimal ?

   - [ ] 3
   - [x] 5
   - [ ] 101
   - [ ] 6

   > 4 + 0 + 1 = 5.

1. Quelle est l'écriture binaire de 25 ?

   - [ ] 10011
   - [x] 11001
   - [ ] 11010
   - [ ] 10101

   > 25 = 16 + 8 + 1.

1. Combien de valeurs différentes peut-on coder avec 8 bits ?

   - [ ] 8
   - [ ] 255
   - [x] 256
   - [ ] 64

   > 2⁸ = 256 valeurs, de 0 à 255.

1. Combien de bits faut-il au minimum pour écrire 200 ?

   - [ ] 7
   - [x] 8
   - [ ] 9
   - [ ] 200

   > 128 ≤ 200 < 256 = 2⁸.

1. Quelle est l'écriture hexadécimale de 1010 1111₂ ?

   - [x] AF
   - [ ] FA
   - [ ] 10 15
   - [ ] A7

   > 1010 = A, 1111 = F, en groupant par 4 à partir de la droite.
::::

::::exercice[Du binaire au décimal]{niveau=1 type=reponses}
Donne la valeur décimale.

1. 101

   ```python calcul
   print(0b101)
   ```

   - 5

   > 4 + 1.

1. 11010

   ```python calcul
   print(0b11010)
   ```

   - 26

   > 16 + 8 + 2.

1. 1000 0001

   ```python calcul
   print(0b10000001)
   ```

   - 129

   > 128 + 1.

1. 1111 1111

   ```python calcul
   print(0b11111111)
   ```

   - 255

   > C'est le plus grand entier sur 8 bits.
::::

::::exercice[Du décimal au binaire]{niveau=1 type=reponses}
Écris ces nombres en binaire, sans zéro au début.

1. 9

   ```python calcul
   print(format(9, "b"))
   ```

   - 1001

1. 37

   ```python calcul
   print(format(37, "b"))
   ```

   - 100101

1. 64

   ```python calcul
   print(format(64, "b"))
   ```

   - 1000000

1. 200

   ```python calcul
   print(format(200, "b"))
   ```

   - 11001000
::::

::::exercice[Tableau de conversions]{niveau=2 type=completer}
Complète le tableau. Écris l'hexadécimal en majuscules.

```python calcul
for n in (10, 42):
    print(format(n, "b"))
    print(format(n, "X"))
print(0b11110000)
print(format(0b11110000, "X"))
print(0xFF)
print(format(0xFF, "b"))
```

| Décimal | Binaire | Hexadécimal |
| --- | --- | --- |
| 10 | [[1010]] | [[A]] |
| 42 | [[101010]] | [[2A]] |
| [[240]] | 1111 0000 | [[F0]] |
| [[255]] | [[11111111]] | FF |

:::corrige
Pour passer du binaire à l'hexadécimal, on regroupe les bits par 4 en partant de la droite : 10 1010 donne 2 et A.
:::
::::

::::exercice[Le codage d'une image]{niveau=3 type=reponses}
Dans une image, chaque pixel est codé sur 3 octets : rouge, vert, bleu. La couleur s'écrit en hexadécimal sous la forme `#RRVVBB`.

1. Dans `#7F00C8`, quelle est la valeur décimale du rouge ?

   ```python calcul
   print(0x7F)
   ```

   - 127

1. Écris en binaire, sur 8 bits, le bleu de cette couleur.

   ```python calcul
   print(format(0xC8, "08b"))
   ```

   - 11001000
   - 1100 1000

1. Un gris a le même niveau pour les trois couleurs. Écris en hexadécimal, sans `#`, le gris de niveau 200.

   ```python calcul
   print(format(200, "02X") * 3)
   ```

   - C8C8C8

1. Combien de couleurs différentes peut-on coder ainsi ?

   ```python calcul
   print(2 ** 24)
   ```

   - 16777216
   - 16 777 216

1. Quelle est la taille en octets d'une image de 200 × 100 pixels, sans compter l'en-tête ?

   ```python calcul
   print(200 * 100 * 3)
   ```

   - 60000
   - 60 000

1. On numérote 1 000 images à partir de 0. Combien de bits faut-il au minimum pour écrire ces numéros ?

   ```python calcul
   print((1000 - 1).bit_length())
   ```

   - 10
::::
