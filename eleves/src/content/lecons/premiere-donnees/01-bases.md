---
titre: Écrire un entier dans une base
resume: "Passer d'une base à l'autre entre le décimal, le binaire et l'hexadécimal, à la main."
duree: 40
objectifs:
  - "Convertir un entier entre les bases 2, 10 et 16"
  - "Dire quel plus grand entier s'écrit sur un nombre de bits donné"
---

Un ordinateur ne manipule que des **bits**, qui valent 0 ou 1. Pour écrire des nombres avec seulement ces deux chiffres, on utilise la **base 2**.

## 1. Le principe d'une base

En base 10, chaque chiffre a une valeur selon sa position : 345 = 3×100 + 4×10 + 5×1.

En **base 2**, c'est pareil avec les puissances de 2.

| 128 | 64 | 32 | 16 | 8 | 4 | 2 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2⁷ | 2⁶ | 2⁵ | 2⁴ | 2³ | 2² | 2¹ | 2⁰ |

Un **octet** est un groupe de 8 bits.

:::histoire
Leibniz décrit le calcul en binaire vers 1700. Claude Shannon montre en 1937 que les circuits électriques peuvent réaliser les opérations logiques.
:::

## 2. Du binaire au décimal

On additionne les puissances de 2 là où il y a un 1.

:::exemple
1011 en binaire vaut 8 + 2 + 1 = **11**.
:::

## 3. Du décimal au binaire

:::methode[Divisions successives]
On divise par 2 jusqu'à obtenir 0, puis on lit les restes **de bas en haut**.
:::

:::exemple
Pour 13 : 13 = 2×6 + **1** ; 6 = 2×3 + **0** ; 3 = 2×1 + **1** ; 1 = 2×0 + **1**.
On lit de bas en haut : 13 s'écrit **1101**.
:::

## 4. L'hexadécimal

La **base 16** utilise 16 chiffres : 0 à 9, puis A = 10, B = 11, C = 12, D = 13, E = 14, F = 15.

Un chiffre hexadécimal correspond exactement à **4 bits**. C'est une façon courte d'écrire du binaire.

:::exemple
1010 0111 se découpe en 1010 (A) et 0111 (7) : cela donne **A7**.
A7 en décimal vaut 10×16 + 7 = **167**.
:::

En Python, on écrit `0b1101` pour le binaire et `0xA7` pour l'hexadécimal.

## 5. Combien de valeurs ?

Avec n bits, on peut écrire **2ⁿ** valeurs, de 0 à 2ⁿ − 1. Sur 8 bits : 256 valeurs, de 0 à 255.

## L'essentiel

- En base 2, les positions valent 1, 2, 4, 8, 16…
- Décimal vers binaire : divisions successives par 2, restes lus de bas en haut.
- Un chiffre hexadécimal = 4 bits.
- Sur n bits : 2ⁿ valeurs, de 0 à 2ⁿ − 1.

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
