---
titre: "Entiers relatifs : le complément à deux"
resume: "Le cours de première NSI sur les entiers négatifs en machine : pourquoi le « bit de signe » naïf ne marche pas, le complément à deux sur n bits, ses plages de valeurs (8, 16, 32, 64 bits), l'addition binaire et le dépassement de capacité."
duree: 45
objectifs:
  - "Additionner deux entiers en binaire en gérant les retenues"
  - "Coder et décoder un entier relatif en complément à deux sur n bits"
  - "Connaître les plages de valeurs des entiers sur 8, 16, 32 et 64 bits"
  - "Reconnaître un dépassement de capacité"
prerequis: [nsi-premiere/entiers-bases]
programme: [nsi1-base]
cartes:
  - q: "Comment coder −5 sur 8 bits en complément à deux ?"
    r: "On écrit 5 = 0000 0101, on **inverse** tous les bits (1111 1010), puis on **ajoute 1** : **1111 1011**."
  - q: "Plage des entiers sur 8 bits en complément à deux ?"
    r: "De **−128 à 127** (256 valeurs)."
  - q: "Plage sur n bits en complément à deux ?"
    r: "De **−2ⁿ⁻¹ à 2ⁿ⁻¹ − 1**."
  - q: "Comment reconnaître un nombre négatif en complément à deux ?"
    r: "Son bit de **poids fort** (le plus à gauche) vaut **1**."
  - q: "Comment décoder 1111 1110 (8 bits) ?"
    r: "Le bit de poids fort vaut 1 : c'est négatif. On inverse et on ajoute 1 : 0000 0010 = 2, donc le nombre est **−2**. (Autre méthode : 254 − 256 = −2.)"
  - q: "Qu'est-ce qu'un dépassement de capacité ?"
    r: "Un résultat trop grand pour le nombre de bits disponibles : 127 + 1 sur 8 bits donne −128. Python n'a pas ce problème pour ses entiers, qui ont une taille illimitée."
---

Le chapitre précédent ne traitait que les entiers **positifs**. Comment l'ordinateur code-t-il −5 avec seulement des 0 et des 1 ? La réponse, le
**complément à deux**, est astucieuse : elle permet d'additionner positifs et négatifs avec le **même circuit**. C'est un chapitre court, mais il faut
de la pratique pour être à l'aise.

## Ce que dit le programme

Contenu : *représentation binaire d'un entier relatif*. Capacités attendues : **évaluer le nombre de bits** nécessaires à l'écriture en base 2 d'un
entier, de la somme ou du produit de deux nombres entiers ; **utiliser le complément à 2**. Commentaire : il s'agit de décrire les tailles courantes
des entiers (**8, 16, 32 ou 64 bits**). Les commentaires sur les booléens citent aussi l'**addition binaire** comme application.

## 1. L'addition binaire

On additionne en binaire comme en décimal, colonne par colonne de droite à gauche, avec des **retenues** :

| 0 + 0 | 0 + 1 | 1 + 0 | 1 + 1 | 1 + 1 + 1 (avec retenue) |
|---|---|---|---|---|
| 0 | 1 | 1 | 10 : on pose 0, on retient 1 | 11 : on pose 1, on retient 1 |

```text
   retenues :  1 1 1
               0 1 1 1   (7)
             + 0 0 1 1   (3)
             ---------
               1 0 1 0   (10)
```

## 2. Une première idée qui ne marche pas

Idée naïve : réserver le bit de gauche pour le **signe** (0 = positif, 1 = négatif) et coder la valeur absolue avec les autres. Sur 4 bits, +3 = 0011
et −3 = 1011. Deux problèmes : il y a **deux zéros** (0000 et 1000), et l'addition ne marche plus : 0011 + 1011 = 1110, ce qui donnerait −6 au lieu de 0.

## 3. Le complément à deux

Sur **n bits**, on code un entier négatif −x par l'entier positif **2ⁿ − x**. Concrètement, pour obtenir le codage de −x :

1. écrire x en binaire sur n bits ;
2. **inverser** tous les bits (les 0 deviennent 1 et inversement) ;
3. **ajouter 1**.

Exemple sur 8 bits, coder −5 :

```text
 5        = 0000 0101
 inversé  = 1111 1010
 + 1      = 1111 1011    → c'est −5
```

Vérification : 5 + (−5) doit donner 0.

```text
   0000 0101
 + 1111 1011
 -----------
 1 0000 0000   → la retenue qui sort à gauche est perdue : il reste 0000 0000 = 0
```

L'addition « normale » donne le bon résultat : c'est tout l'intérêt du complément à deux.

| Codage sur 8 bits | Valeur |
|---|---|
| 0111 1111 | 127 |
| 0000 0001 | 1 |
| 0000 0000 | 0 |
| 1111 1111 | −1 |
| 1111 1110 | −2 |
| 1000 0000 | −128 |

**Décoder** un codage :
- si le bit de poids fort est **0**, le nombre est **positif** : on le lit normalement ;
- s'il est **1**, le nombre est **négatif** : on inverse les bits et on ajoute 1 pour obtenir sa valeur absolue. Ou plus simplement : on lit le
  nombre comme un positif, puis on soustrait 2ⁿ (1111 1110 = 254, et 254 − 256 = −2).

## 4. Les plages de valeurs

Sur **n bits** en complément à deux, on code les entiers de **−2ⁿ⁻¹ à 2ⁿ⁻¹ − 1** :

| Taille | Plage |
|---|---|
| 8 bits | −128 à 127 |
| 16 bits | −32 768 à 32 767 |
| 32 bits | environ −2,1 à 2,1 milliards |
| 64 bits | environ ± 9,2 × 10¹⁸ |

## 5. Le dépassement de capacité

Si le résultat d'un calcul sort de la plage, il est **faux** : sur 8 bits, 127 + 1 donne 1000 0000, c'est-à-dire −128. C'est un **dépassement de
capacité** (*overflow*). Il a causé de vrais incidents (le compteur de vues d'une vidéo célèbre qui a dépassé 2³¹ − 1 en 2014, des bugs de logiciels
embarqués). En Python, les entiers ont une **taille illimitée** : ce problème n'apparaît pas, mais il existe dans la plupart des autres langages et
dans le matériel.

```python exec
def complement_a_deux(x, n):
    """Codage binaire (texte de n bits) de l'entier relatif x."""
    if x < 0:
        x = 2 ** n + x
    bits = bin(x)[2:]
    return "0" * (n - len(bits)) + bits

print(complement_a_deux(-5, 8), complement_a_deux(5, 8), complement_a_deux(-128, 8))
```

## Les erreurs classiques des élèves

:::attention[Ce que tu verras en classe]
- **Oublier d'ajouter 1** après l'inversion.
- **Oublier de compléter avec des 0 à gauche** avant d'inverser (5 doit être écrit 0000 0101 sur 8 bits, pas 101).
- **Croire que le bit de gauche est un simple signe** et lire 1000 0101 comme −5.
- **Garder la retenue finale** qui sort à gauche dans une addition sur n bits.
- **Confondre plage non signée** (0 à 255) **et signée** (−128 à 127) sur 8 bits.
:::

## En classe

:::methode[Activités qui marchent]
1. **Faire échouer l'idée naïve** avant de présenter le complément à deux : les élèves voient eux-mêmes que l'addition ne marche pas.
2. **Le compteur kilométrique** : un compteur à 3 chiffres qui recule depuis 000 affiche 999, comme −1 ; c'est l'idée du complément.
3. **Tableau des 16 codages sur 4 bits** à compléter (de −8 à 7).
4. **Programmer** le codage et le décodage, vérifier sur de nombreux exemples.
:::

## L'essentiel

- L'addition binaire se fait colonne par colonne avec des retenues (1 + 1 = 10).
- **Complément à deux** sur n bits : pour coder −x, écrire x sur n bits, **inverser** les bits, **ajouter 1**.
- Bit de poids fort à 1 : nombre **négatif**. Un seul zéro, et l'addition fonctionne normalement.
- Plage sur n bits : **−2ⁿ⁻¹ à 2ⁿ⁻¹ − 1** (8 bits : −128 à 127).
- Un résultat hors plage est un **dépassement de capacité** ; les entiers Python n'ont pas de limite.

## Exercices

::::exercice[Grand QCM : entiers relatifs]{niveau=1 type=quiz}
Douze questions sur l'addition binaire et le complément à deux (codages sur 8 bits sauf mention contraire).

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

::::exercice[Coder en complément à deux]{niveau=1}
Écris `code(x, n)` qui renvoie le codage (un texte de `n` caractères 0/1) de l'entier relatif `x` en complément à deux sur `n` bits. On suppose que `x`
est dans la plage. Tu peux utiliser `bin`.

```python depart
def code(x, n):
    ...
```

```python tests
assert code(5, 8) == "00000101", "5 sur 8 bits"
assert code(-5, 8) == "11111011", "−5 sur 8 bits"
assert code(-1, 4) == "1111", "−1 sur 4 bits"
assert code(-128, 8) == "10000000", "le plus petit sur 8 bits"
```

:::indice
Un négatif x est codé comme le positif 2ⁿ + x. `bin(5)` donne `"0b101"` : enlève les deux premiers caractères, puis complète avec des 0 à gauche.
:::

:::corrige
```python solution
def code(x, n):
    if x < 0:
        x = 2 ** n + x
    bits = bin(x)[2:]
    return "0" * (n - len(bits)) + bits
```
:::
::::

::::exercice[Décoder un codage]{niveau=2}
Écris `valeur(bits)` qui renvoie l'entier relatif codé en complément à deux par le texte `bits` (sa longueur donne n).

```python depart
def valeur(bits):
    ...
```

```python tests
assert valeur("00000101") == 5, "positif"
assert valeur("11111011") == -5, "négatif"
assert valeur("1000") == -8, "le plus petit sur 4 bits"
assert valeur("0111") == 7, "le plus grand sur 4 bits"
```

:::corrige
```python solution
def valeur(bits):
    n = len(bits)
    v = int(bits, 2)
    if bits[0] == "1":
        v = v - 2 ** n
    return v
```

Si le bit de poids fort est 1, le nombre lu comme positif vaut 2ⁿ + x : on retire 2ⁿ.
:::
::::

::::exercice[Expliquer le complément à deux]{niveau=2}
Explique à un élève de première, en quelques phrases et sur un exemple sur 4 bits, **pourquoi** le complément à deux est un bon choix pour coder les
entiers négatifs.

:::criteres
- L'exemple montre un codage sur 4 bits (par exemple −3 = 1101).
- L'explication montre que l'addition habituelle donne le bon résultat (3 + (−3) = 0, la retenue sortante étant perdue).
- Elle mentionne le zéro unique, ou compare avec le bit de signe naïf.
:::

:::corrige
« Sur 4 bits, 3 s'écrit 0011. Pour −3, on inverse (1100) et on ajoute 1 : **1101**. Additionnons-les comme d'habitude : 0011 + 1101 = 1 0000 ; la
retenue qui dépasse à gauche n'a pas de place sur 4 bits, il reste **0000** : on obtient bien 0 ! Avec l'idée naïve (un bit de signe, −3 = 1011), on
aurait 0011 + 1011 = 1110, qui ne vaut pas 0, et il y aurait deux zéros (0000 et 1000). Le complément à deux permet donc au processeur d'utiliser le
**même circuit d'addition** pour tous les entiers. »
:::
::::
