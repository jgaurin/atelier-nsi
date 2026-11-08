---
titre: Les entiers relatifs
resume: "Comment représenter les nombres négatifs avec le complément à 2, et combien de bits il faut pour un résultat."
duree: 35
objectifs:
  - "Coder et décoder un entier relatif en complément à 2"
  - "Donner l'intervalle des entiers représentables sur n bits"
  - "Évaluer le nombre de bits d'une somme ou d'un produit"
prerequis: [premiere-donnees/bases]
---

La mémoire ne contient que des 0 et des 1 : il n'y a pas de signe « moins ». On utilise donc une convention, le **complément à 2**.

## 1. Le complément à 2

Sur 8 bits, le bit de gauche indique le signe : **0 pour un positif, 1 pour un négatif**.

:::methode[Coder un nombre négatif sur 8 bits]
1. On écrit la valeur absolue en binaire sur 8 bits.
2. On inverse tous les bits.
3. On ajoute 1.
:::

:::exemple
Pour −5 : 5 s'écrit 0000 0101. On inverse : 1111 1010. On ajoute 1 : **1111 1011**.
:::

## 2. Décoder

Si le premier bit vaut 1, le nombre est négatif. On applique la même méthode pour retrouver sa valeur absolue.

:::exemple
1111 1110 : on inverse, 0000 0001 ; on ajoute 1, 0000 0010, soit 2. Le nombre est **−2**.
:::

Avec cette écriture, l'addition habituelle fonctionne : 5 + (−5) donne bien 0, en ignorant la dernière retenue.

## 3. Les valeurs possibles

Sur n bits, on écrit les entiers de **−2ⁿ⁻¹ à 2ⁿ⁻¹ − 1**.

| Taille | Plus petit | Plus grand |
| --- | --- | --- |
| 8 bits | −128 | 127 |
| 16 bits | −32 768 | 32 767 |
| 32 bits | −2 147 483 648 | 2 147 483 647 |

Si le résultat d'un calcul sort de cet intervalle, on parle de **dépassement**. En Python, les entiers n'ont pas de taille limite, mais dans d'autres langages le dépassement existe.

## 4. Combien de bits pour un résultat ?

Pour des entiers positifs écrits sur n bits :

- la **somme** de deux nombres tient sur au plus **n + 1** bits ;
- le **produit** de deux nombres tient sur au plus **2n** bits.

:::exemple
Sur 4 bits, le plus grand nombre est 15. 15 + 15 = 30 tient sur 5 bits. 15 × 15 = 225 tient sur 8 bits.
:::

## L'essentiel

- Complément à 2 : inverser les bits de la valeur absolue, puis ajouter 1.
- Premier bit à 1 : le nombre est négatif.
- Sur n bits : de −2ⁿ⁻¹ à 2ⁿ⁻¹ − 1.
- Somme : au plus n + 1 bits. Produit : au plus 2n bits.

## Exercices

::::exercice[QCM : entiers relatifs]{niveau=1 type=quiz}
Une question à la fois : la correction s'affiche aussitôt.

1. Combien vaut 1 + 1 en binaire ?

   - [ ] 2
   - [x] 10
   - [ ] 11
   - [ ] 1

   > On pose 0 et on retient 1 : 10₂ = 2.

1. Quel est le résultat de 0110 + 0011 (sur 4 bits) ?

   - [x] 1001
   - [ ] 1000
   - [ ] 0111
   - [ ] 1101

   > 6 + 3 = 9 = 1001.

1. Comment code-t-on −1 en complément à deux sur 8 bits ?

   - [ ] 1000 0001
   - [x] 1111 1111
   - [ ] 0000 0001
   - [ ] 1111 1110

   > 1 = 0000 0001, inversé 1111 1110, plus 1 : 1111 1111.

1. Comment code-t-on −5 ?

   - [ ] 1000 0101
   - [ ] 1111 1010
   - [x] 1111 1011
   - [ ] 0000 0101

   > 0000 0101 inversé donne 1111 1010, plus 1 : 1111 1011.

1. Que vaut 1000 0000 en complément à deux sur 8 bits ?

   - [ ] 128
   - [ ] 0
   - [x] −128
   - [ ] −0

   > 128 − 256 = −128 : c'est le plus petit entier sur 8 bits.

1. Que vaut 1111 1100 ?

   - [ ] 252
   - [x] −4
   - [ ] −3
   - [ ] −124

   > Négatif (bit de gauche à 1) : 252 − 256 = −4.

1. Que vaut 0111 0000 ?

   - [x] 112
   - [ ] −112
   - [ ] −16
   - [ ] 240

   > Bit de gauche à 0 : positif, 64 + 32 + 16 = 112.

1. Quelle est la plage des entiers sur 8 bits en complément à deux ?

   - [ ] de 0 à 255
   - [x] de −128 à 127
   - [ ] de −127 à 127
   - [ ] de −255 à 255

   > 256 valeurs : −2⁷ à 2⁷ − 1.

1. Quelle est la plage sur 16 bits ?

   - [ ] de −65 536 à 65 535
   - [x] de −32 768 à 32 767
   - [ ] de 0 à 65 535
   - [ ] de −16 à 15

   > −2¹⁵ à 2¹⁵ − 1.

1. Pourquoi n'utilise-t-on pas un simple bit de signe ?

   - [ ] parce qu'il prend trop de place
   - [x] parce qu'il donne deux zéros et que l'addition habituelle donne de faux résultats
   - [ ] parce qu'il ne permet pas de coder les positifs
   - [ ] parce que l'ordinateur ne connaît pas les signes

   > Le complément à deux n'a qu'un zéro, et le même additionneur sert pour tous les entiers.

1. Sur 8 bits, que donne 127 + 1 ?

   - [ ] 128
   - [x] −128 (dépassement de capacité)
   - [ ] 0
   - [ ] une erreur affichée par le processeur

   > 0111 1111 + 1 = 1000 0000, qui code −128.

1. En Python, que vaut `2 ** 100` ?

   - [x] le bon résultat : les entiers Python n'ont pas de taille limite
   - [ ] un nombre négatif à cause du dépassement
   - [ ] une erreur
   - [ ] 0

   > Python gère des entiers aussi grands que la mémoire le permet.
::::

::::exercice[Coder sur 8 bits]{niveau=1 type=reponses}
Écris ces nombres en complément à 2 sur 8 bits, sans espace.

1. 12

   ```python calcul
   print(format(12 & 0xFF, "08b"))
   ```

   - 00001100

1. −1

   ```python calcul
   print(format(-1 & 0xFF, "08b"))
   ```

   - 11111111

1. −12

   ```python calcul
   print(format(-12 & 0xFF, "08b"))
   ```

   - 11110100

1. −128

   ```python calcul
   print(format(-128 & 0xFF, "08b"))
   ```

   - 10000000
::::

::::exercice[Décoder]{niveau=2 type=reponses}
Ces mots de 8 bits sont écrits en complément à 2. Donne la valeur décimale, avec son signe s'il est négatif.

1. 0001 0100

   ```python calcul
   v = 0b00010100
   print(v - 256 if v >= 128 else v)
   ```

   - 20

1. 1111 0000

   ```python calcul
   v = 0b11110000
   print(v - 256 if v >= 128 else v)
   ```

   - -16
   - −16

1. 1000 0001

   ```python calcul
   v = 0b10000001
   print(v - 256 if v >= 128 else v)
   ```

   - -127
   - −127

1. 0111 1111

   ```python calcul
   v = 0b01111111
   print(v - 256 if v >= 128 else v)
   ```

   - 127
::::

::::exercice[Intervalles et tailles]{niveau=2 type=reponses}
Réponds à chaque question.
1. Quel est le plus petit entier représentable en complément à 2 sur 6 bits ?

   ```python calcul
   print(-2 ** 5)
   ```

   - -32
   - −32

1. Quel est le plus grand entier représentable en complément à 2 sur 6 bits ?

   ```python calcul
   print(2 ** 5 - 1)
   ```

   - 31

1. Deux entiers positifs tiennent chacun sur 8 bits. Sur combien de bits au plus tient leur somme ?

   - 9

1. Deux entiers positifs tiennent chacun sur 8 bits. Sur combien de bits au plus tient leur produit ?

   - 16

1. Sur 8 bits en complément à 2, on calcule 127 + 1. Quelle valeur obtient-on ?

   ```python calcul
   v = (127 + 1) & 0xFF
   print(v - 256 if v >= 128 else v)
   ```

   - -128
   - −128

   > 0111 1111 + 1 donne 1000 0000 : c'est un dépassement.
::::

::::exercice[Dérouler le complément à 2]{niveau=1 type=completer}
Complète les étapes pour coder −20 sur 8 bits.

```python calcul
print(format(20, "08b"))
print(format(20 ^ 0xFF, "08b"))
print(format(-20 & 0xFF, "08b"))
```

| Étape | Résultat |
| --- | --- |
| 20 en binaire sur 8 bits | [[00010100]] |
| On inverse tous les bits | [[11101011]] |
| On ajoute 1 | [[11101100]] |
::::
