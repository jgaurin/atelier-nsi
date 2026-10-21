---
titre: "Entiers naturels : binaire et hexadécimal"
resume: "Le cours de première NSI sur l'écriture des entiers dans une base : bits et octets, base 2, base 16, conversions dans les deux sens, nombre de bits nécessaires, et applications (couleurs, adresses)."
duree: 45
objectifs:
  - "Comprendre la notation positionnelle en base 10, 2 et 16"
  - "Convertir un entier naturel entre les bases 10, 2 et 16"
  - "Évaluer le nombre de bits nécessaires pour écrire un entier"
  - "Utiliser bin(), hex() et int(…, base) en Python"
prerequis: [snt-python/boucles-non-bornees]
programme: [nsi1-base]
cartes:
  - q: "Que vaut 1011 en base 2 ?"
    r: "1×8 + 0×4 + 1×2 + 1×1 = **11**."
  - q: "Comment convertir 13 en binaire ?"
    r: "Par divisions successives par 2 : 13 = 6×2 + **1**, 6 = 3×2 + **0**, 3 = 1×2 + **1**, 1 = 0×2 + **1** ; on lit les restes de bas en haut : **1101**."
  - q: "Bit et octet ?"
    r: "Un **bit** vaut 0 ou 1 ; un **octet** est un groupe de **8 bits**, qui peut coder 2⁸ = 256 valeurs (de 0 à 255)."
  - q: "Combien de valeurs peut-on coder sur n bits ?"
    r: "**2ⁿ** valeurs : les entiers de 0 à 2ⁿ − 1."
  - q: "Que vaut FF en hexadécimal ?"
    r: "15×16 + 15 = **255**. Un chiffre hexadécimal correspond à 4 bits : FF = 1111 1111."
  - q: "Les chiffres de la base 16 ?"
    r: "0 à 9 puis **A (10), B (11), C (12), D (13), E (14), F (15)**."
  - q: "Fonctions Python de conversion ?"
    r: "`bin(13)` donne `'0b1101'`, `hex(255)` donne `'0xff'`, `int('1101', 2)` donne 13, `int('ff', 16)` donne 255."
---

Un ordinateur ne manipule que des **0** et des **1**. Tout ce qu'il stocke (nombres, textes, images, sons) est donc écrit en **binaire**. Ce premier
chapitre de la représentation des données montre comment on écrit un **entier naturel** (positif) en base 2 et en base 16, et comment passer d'une
base à l'autre. C'est un chapitre très « calculatoire » : les élèves doivent s'entraîner beaucoup.

## Ce que dit le programme

Contenu : *écriture d'un entier positif dans une base b ⩾ 2*. Capacité attendue : **passer de la représentation d'une base dans une autre**. Les
commentaires précisent que les bases **2, 10 et 16** sont privilégiées. On évalue aussi le **nombre de bits** nécessaires (capacité liée aux entiers
relatifs, chapitre suivant).

## 1. La notation positionnelle

En base 10, la valeur d'un chiffre dépend de sa **position** : 352 = 3 × 100 + 5 × 10 + 2 × 1 = 3 × 10² + 5 × 10¹ + 2 × 10⁰. On utilise 10 chiffres
(0 à 9) et des puissances de 10.

Dans une **base b**, on utilise b chiffres et des puissances de b. En **base 2** (binaire), il n'y a que deux chiffres, 0 et 1, et des puissances de 2 :

| Puissance | 2⁷ | 2⁶ | 2⁵ | 2⁴ | 2³ | 2² | 2¹ | 2⁰ |
|---|---|---|---|---|---|---|---|---|
| Valeur | 128 | 64 | 32 | 16 | 8 | 4 | 2 | 1 |

Un chiffre binaire s'appelle un **bit** (*binary digit*) ; 8 bits forment un **octet**.

## 2. Du binaire au décimal

On additionne les puissances de 2 correspondant aux bits à 1 :

**1011 0010**₂ = 128 + 32 + 16 + 2 = **178**.

On note la base en indice (1011₂) ou, en Python, avec le préfixe `0b` : `0b1011`.

## 3. Du décimal au binaire

**Méthode des divisions successives** : on divise par 2 jusqu'à obtenir un quotient nul ; les **restes**, lus **de bas en haut**, donnent l'écriture
binaire.

| Division | Quotient | Reste |
|---|---|---|
| 13 ÷ 2 | 6 | **1** |
| 6 ÷ 2 | 3 | **0** |
| 3 ÷ 2 | 1 | **1** |
| 1 ÷ 2 | 0 | **1** |

13 = **1101**₂. Autre méthode, souvent plus rapide pour les petits nombres : **soustraire les plus grandes puissances de 2** (13 = 8 + 4 + 1).

```python exec
def en_binaire(n):
    if n == 0:
        return "0"
    bits = ""
    while n > 0:
        bits = str(n % 2) + bits    # le reste, ajouté à gauche
        n = n // 2
    return bits

print(en_binaire(13), en_binaire(178), bin(178))
```

## 4. Combien de bits ?

Sur **n bits**, on peut écrire **2ⁿ** valeurs différentes : les entiers de **0 à 2ⁿ − 1**.

| Bits | Valeurs | Plus grand entier |
|---|---|---|
| 1 | 2 | 1 |
| 4 | 16 | 15 |
| 8 (un octet) | 256 | 255 |
| 16 | 65 536 | 65 535 |
| 32 | environ 4,3 milliards | 4 294 967 295 |

Pour savoir combien de bits il faut pour écrire un entier N, on cherche la plus petite puissance de 2 strictement supérieure à N : 178 < 256 = 2⁸,
donc **8 bits**. On en déduit aussi que la **somme** de deux entiers de n bits tient sur n + 1 bits, et leur **produit** sur 2n bits.

## 5. La base 16 (hexadécimal)

Le binaire est long à écrire. La **base 16** utilise 16 chiffres : **0 à 9 puis A à F** (A = 10, B = 11, …, F = 15). Son intérêt : **un chiffre
hexadécimal correspond exactement à 4 bits**, donc un octet s'écrit avec **deux** chiffres hexadécimaux.

| Hexadécimal | 0 | 5 | 9 | A | B | C | D | E | F |
|---|---|---|---|---|---|---|---|---|---|
| Décimal | 0 | 5 | 9 | 10 | 11 | 12 | 13 | 14 | 15 |
| Binaire | 0000 | 0101 | 1001 | 1010 | 1011 | 1100 | 1101 | 1110 | 1111 |

- **Binaire → hexadécimal** : on groupe les bits par 4 en partant de la droite : 1011 0010 → **B2**.
- **Hexadécimal → décimal** : B2₁₆ = 11 × 16 + 2 = **178**.

On la rencontre partout : couleurs du Web (`#FF8000` = rouge 255, vert 128, bleu 0), adresses mémoire, adresses MAC, IPv6.

```python exec
print(hex(178), int("b2", 16), int("10110010", 2))
```

## Les erreurs classiques des élèves

:::attention[Ce que tu verras en classe]
- **Lire les restes dans le mauvais sens** (de haut en bas) lors des divisions successives.
- **Oublier les bits à 0** au milieu : 1001 n'est pas 11.
- **Grouper par 4 en partant de la gauche** au lieu de la droite pour passer en hexadécimal.
- **Écrire « 10 » comme chiffre hexadécimal** au lieu de A.
- **Croire qu'on peut coder 2⁸ = 256 sur 8 bits** : le plus grand est 255.
:::

## En classe

:::methode[Activités qui marchent]
1. **Cartes binaires** (débranché) : cinq cartes portant 16, 8, 4, 2, 1 points, face visible ou cachée ; écrire un nombre en retournant les cartes.
2. **Compter en binaire sur les doigts** (jusqu'à 31 avec une main).
3. **Entraînement intensif** : conversions dans tous les sens, vérifiées avec `bin`, `hex`, `int`.
4. **Programmer** les conversions (divisions successives, puis lecture de gauche à droite).
5. **Couleurs du Web** : décoder `#FF8000`, choisir une couleur dans un sélecteur et lire son code.
:::

## L'essentiel

- En base 2, un nombre s'écrit avec des **bits** (0 et 1) pondérés par des **puissances de 2** ; 8 bits = 1 **octet**.
- Binaire → décimal : **additionner** les puissances de 2 des bits à 1.
- Décimal → binaire : **divisions successives** par 2, restes lus de bas en haut.
- Sur **n bits** : **2ⁿ** valeurs, de 0 à 2ⁿ − 1 (un octet : 0 à 255).
- Base 16 : chiffres 0-9 et A-F ; **un chiffre hexadécimal = 4 bits**.
- Python : `bin`, `hex`, `int(texte, base)`.

## Exercices

::::exercice[Grand QCM : binaire et hexadécimal]{niveau=1 type=quiz}
Quatorze questions de conversion et de vocabulaire. Fais les calculs sur papier.

1. Que vaut 101₂ en décimal ?

   - [ ] 3
   - [x] 5
   - [ ] 101
   - [ ] 6

   > 4 + 0 + 1 = 5.

1. Que vaut 1111₂ en décimal ?

   - [ ] 4
   - [ ] 16
   - [x] 15
   - [ ] 1111

   > 8 + 4 + 2 + 1 = 15 = 2⁴ − 1.

1. Que vaut 1000 0000₂ ?

   - [x] 128
   - [ ] 256
   - [ ] 8
   - [ ] 127

   > Seul le bit de poids 2⁷ = 128 est à 1.

1. Quelle est l'écriture binaire de 10 ?

   - [ ] 0101
   - [x] 1010
   - [ ] 1100
   - [ ] 1001

   > 10 = 8 + 2.

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

1. Quel est le plus grand entier naturel codable sur 4 bits ?

   - [ ] 16
   - [x] 15
   - [ ] 4
   - [ ] 8

   > 2⁴ − 1 = 15 (1111₂).

1. Combien de bits faut-il au minimum pour écrire 200 ?

   - [ ] 7
   - [x] 8
   - [ ] 9
   - [ ] 200

   > 128 ≤ 200 < 256 = 2⁸.

1. Que vaut le chiffre hexadécimal C ?

   - [ ] 11
   - [x] 12
   - [ ] 13
   - [ ] 14

   > A = 10, B = 11, C = 12.

1. Que vaut 1F₁₆ en décimal ?

   - [ ] 25
   - [x] 31
   - [ ] 115
   - [ ] 16

   > 1 × 16 + 15 = 31.

1. Quelle est l'écriture hexadécimale de 1010 1111₂ ?

   - [x] AF
   - [ ] FA
   - [ ] 10 15
   - [ ] A7

   > 1010 = A, 1111 = F, en groupant par 4 à partir de la droite.

1. Pourquoi utilise-t-on souvent l'hexadécimal ?

   - [ ] parce que l'ordinateur calcule en base 16
   - [x] parce qu'un chiffre hexadécimal remplace exactement 4 bits : c'est plus court à lire et à écrire
   - [ ] parce qu'il permet de coder plus de nombres
   - [ ] parce que c'est la base des nombres négatifs

   > L'ordinateur calcule en binaire ; l'hexadécimal est une écriture compacte pour les humains.

1. Quelle couleur web correspond à `#00FF00` ?

   - [ ] rouge
   - [x] vert
   - [ ] bleu
   - [ ] blanc

   > Rouge 00, vert FF (255), bleu 00.

1. Que renvoie `int("101", 2)` en Python ?

   - [ ] 101
   - [x] 5
   - [ ] `"0b101"`
   - [ ] une erreur

   > `int` lit le texte comme un nombre écrit en base 2.
::::

::::exercice[Du binaire au décimal]{niveau=1}
Écris `decimal(bits)` qui reçoit un texte composé de 0 et de 1 et renvoie l'entier correspondant, **sans** utiliser `int(…, 2)`.

```python depart
def decimal(bits):
    ...
```

```python tests
assert decimal("1011") == 11, "1011 = 11"
assert decimal("0") == 0, "zéro"
assert decimal("11111111") == 255, "un octet à 1"
assert decimal("10110010") == 178, "178"
```

:::indice
Parcours les bits de gauche à droite : à chaque bit, la valeur déjà calculée est multipliée par 2, puis on ajoute le bit. Pour « 1011 » : 1, puis 2 + 0
= 2, puis 4 + 1 = 5, puis 10 + 1 = 11.
:::

:::corrige
```python solution
def decimal(bits):
    valeur = 0
    for b in bits:
        valeur = valeur * 2 + int(b)
    return valeur
```

On peut aussi additionner les puissances de 2, en parcourant de droite à gauche ; la méthode ci-dessus (méthode de Horner) évite de calculer les
puissances.
:::
::::

::::exercice[Du décimal au binaire]{niveau=1}
Écris `binaire(n)` qui renvoie l'écriture binaire (un texte) de l'entier `n ≥ 0`, par divisions successives, **sans** utiliser `bin`.

```python depart
def binaire(n):
    ...
```

```python tests
assert binaire(13) == "1101", "13"
assert binaire(0) == "0", "zéro"
assert binaire(1) == "1", "un"
assert binaire(255) == "11111111", "255"
```

:::corrige
```python solution
def binaire(n):
    if n == 0:
        return "0"
    bits = ""
    while n > 0:
        bits = str(n % 2) + bits
        n = n // 2
    return bits
```
:::
::::

::::exercice[Couleur web en RVB]{niveau=2}
Une couleur web s'écrit `#RRVVBB` : trois octets en hexadécimal. Écris `rvb(code)` qui renvoie le triplet d'entiers correspondant. Tu peux utiliser
`int(…, 16)`.

```python depart
def rvb(code):
    ...
```

```python tests
assert rvb("#FF8000") == (255, 128, 0), "orange"
assert rvb("#000000") == (0, 0, 0), "noir"
assert rvb("#1F2E3D") == (31, 46, 61), "couleur quelconque"
```

:::indice
`code[1:3]` donne les deux caractères du rouge (ici `"FF"`).
:::

:::corrige
```python solution
def rvb(code):
    return (int(code[1:3], 16), int(code[3:5], 16), int(code[5:7], 16))
```
:::
::::

::::exercice[Expliquer les divisions successives]{niveau=2}
Un élève ne comprend pas pourquoi on lit les restes « de bas en haut ». Explique-le-lui sur l'exemple de 6, en trois ou quatre phrases.

:::criteres
- Le premier reste correspond au bit de poids faible (les unités, 2⁰), car il dit si le nombre est pair ou impair.
- Les restes suivants donnent les bits de poids 2¹, 2², … : ils doivent être écrits de plus en plus à gauche.
- L'exemple de 6 est traité correctement (6 = 110₂).
:::

:::corrige
« Divisons 6 par 2 : 6 = 3 × 2 + **0**. Ce premier reste dit si 6 est pair : c'est le chiffre des **unités** en binaire, celui le plus à **droite**.
Puis 3 = 1 × 2 + **1**, c'est le chiffre des « deux », juste à sa gauche ; enfin 1 = 0 × 2 + **1**, le chiffre des « quatre ». Les restes sortent
donc du plus petit poids au plus grand : on les écrit de droite à gauche, ce qui revient à les lire de bas en haut : 6 = **110**₂ (4 + 2). »
:::
::::
