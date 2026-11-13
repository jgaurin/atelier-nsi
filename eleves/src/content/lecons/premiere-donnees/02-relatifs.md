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

La mémoire ne contient que des 0 et des 1 : il n'y a pas de case pour le signe « moins ». Comment écrire −5 ? Il faut une convention.

## 1. Une fausse bonne idée : un bit de signe

On pourrait réserver le premier bit au signe : 0 pour positif, 1 pour négatif. Ainsi, sur 8 bits, 5 s'écrirait 0000 0101 et −5 s'écrirait 1000 0101.

Mais l'addition ordinaire ne marche plus :

```
  0000 0101     (5)
+ 1000 0101     (−5 ?)
= 1000 1010     ce qui se lirait −10, et non 0
```

En plus, 0 aurait deux écritures, +0 et −0. On utilise donc une autre méthode : le **complément à 2**.

## 2. Le complément à 2

On travaille sur un nombre fixe de bits, par exemple 8.

:::methode[Écrire un nombre négatif]
1. On écrit sa valeur absolue en binaire sur 8 bits.
2. On inverse tous les bits : 0 devient 1, 1 devient 0.
3. On ajoute 1.
:::

:::exemple
Pour −5 :

| Étape | Résultat |
| --- | --- |
| 5 sur 8 bits | 0000 0101 |
| on inverse tous les bits | 1111 1010 |
| on ajoute 1 | **1111 1011** |
:::

Les nombres positifs s'écrivent normalement. Le premier bit vaut donc 0 pour un positif et 1 pour un négatif.

## 3. Pourquoi ça marche

Vérifions que 5 + (−5) donne bien 0 :

```
  0000 0101     (5)
+ 1111 1011     (−5)
= 1 0000 0000
```

Le résultat a 9 bits. Comme on travaille sur 8 bits, la retenue de gauche est perdue : il reste **0000 0000**, soit 0. L'addition habituelle fonctionne, sans règle spéciale pour les négatifs : c'est tout l'intérêt du complément à 2.

## 4. Décoder

Si le premier bit vaut 0, le nombre est positif : on le lit normalement. S'il vaut 1, il est négatif : on applique la même méthode pour retrouver sa valeur absolue.

:::exemple
1111 1110 commence par 1 : il est négatif. On inverse, 0000 0001, puis on ajoute 1 : 0000 0010, soit 2. Le nombre est **−2**.
:::

Autre méthode, plus rapide : sur 8 bits, un mot qui commence par 1 vaut sa valeur ordinaire moins 256. Ici, 1111 1110 vaut 254, et 254 − 256 = −2.

## 5. Les valeurs possibles

Sur n bits, on écrit les entiers de **−2ⁿ⁻¹ à 2ⁿ⁻¹ − 1** : la moitié des écritures pour les négatifs, l'autre pour 0 et les positifs.

| Taille | Plus petit | Plus grand |
| --- | --- | --- |
| 8 bits | −128 | 127 |
| 16 bits | −32 768 | 32 767 |
| 32 bits | −2 147 483 648 | 2 147 483 647 |

Si un calcul sort de cet intervalle, on parle de **dépassement**. Sur 8 bits, 127 + 1 donne 1000 0000, qui se lit −128 ! En Python, les entiers n'ont pas de taille limite, mais dans beaucoup d'autres langages, le dépassement existe.

## 6. Combien de bits pour un résultat ?

Pour deux entiers positifs écrits sur n bits :

- leur **somme** tient sur au plus **n + 1** bits : chacun est inférieur à 2ⁿ, donc leur somme est inférieure à 2 × 2ⁿ = 2ⁿ⁺¹ ;
- leur **produit** tient sur au plus **2n** bits : il est inférieur à 2ⁿ × 2ⁿ = 2²ⁿ.

:::exemple
Sur 4 bits, le plus grand nombre est 15. 15 + 15 = 30 tient sur 5 bits, et 15 × 15 = 225 tient sur 8 bits.
:::

## L'essentiel

- Complément à 2 : on inverse les bits de la valeur absolue, puis on ajoute 1.
- Premier bit à 1 : le nombre est négatif. Sur 8 bits, il vaut sa valeur ordinaire moins 256.
- L'addition habituelle fonctionne ; la retenue qui dépasse est perdue.
- Sur n bits : de −2ⁿ⁻¹ à 2ⁿ⁻¹ − 1. Somme : au plus n + 1 bits ; produit : au plus 2n bits.

## Exercices

::::exercice[QCM : entiers relatifs]{niveau=1 type=quiz}
Une question à la fois : la correction s'affiche aussitôt.

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

1. Quelle est la plage des entiers sur 8 bits en complément à deux ?

   - [ ] de 0 à 255
   - [x] de −128 à 127
   - [ ] de −127 à 127
   - [ ] de −255 à 255

   > 256 valeurs : −2⁷ à 2⁷ − 1.

1. Sur 8 bits, que donne 127 + 1 ?

   - [ ] 128
   - [x] −128 (dépassement de capacité)
   - [ ] 0
   - [ ] une erreur affichée par le processeur

   > 0111 1111 + 1 = 1000 0000, qui code −128.
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

::::exercice[Un capteur de température]{niveau=3 type=reponses}
Un capteur envoie des températures entières, codées en complément à 2 sur 8 bits.

1. Le capteur envoie `1110 1100`. Quelle température, en degrés, a-t-il mesurée ?

   ```python calcul
   v = 0b11101100
   print(v - 256)
   ```

   - -20
   - −20

1. Écris cette valeur en hexadécimal.

   ```python calcul
   print(format(0b11101100, "X"))
   ```

   - EC

1. Quelle est la température la plus élevée que ce capteur peut envoyer ?

   - 127

1. Un calcul additionne 100 et 50 sur 8 bits. Quelle valeur obtient-on, en lisant le résultat en complément à 2 ?

   ```python calcul
   v = (100 + 50) & 0xFF
   print(v - 256 if v >= 128 else v)
   ```

   - -106
   - −106

1. Comment appelle-t-on ce phénomène ?

   - dépassement
   - un dépassement

1. On multiplie deux entiers positifs écrits chacun sur 12 bits. Combien de bits faut-il prévoir au maximum pour le résultat ?

   ```python calcul
   print(2 * 12)
   ```

   - 24
::::
