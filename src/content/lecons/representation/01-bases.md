---
titre: Bases de numération
resume: Écrire un entier en base 10, 2 ou 16, passer d'une base à l'autre, compter en bits et en octets, et additionner en binaire.
duree: 55
objectifs:
  - Expliquer l'écriture positionnelle d'un entier dans une base quelconque
  - Convertir un entier entre les bases 10, 2 et 16 (à la main et en Python)
  - Calculer le nombre de valeurs représentables sur n bits et le nombre de bits nécessaires pour un entier
  - Poser une addition en binaire et utiliser les unités (bit, octet, Ko, Kio)
prerequis: [python/boucles]
programme: [id-codage, id-types-simples, nsi1-base, snt-photo]
cartes:
  - q: Valeur de $101101_2$ ?
    r: "$32 + 8 + 4 + 1 = 45$."
  - q: Comment convertir un entier en binaire ?
    r: "Divisions successives par 2 : les restes, lus du dernier au premier, sont les chiffres binaires (du poids fort au poids faible)."
  - q: Combien de valeurs différentes sur n bits ?
    r: "$2^n$ (de 0 à $2^n - 1$ pour des entiers naturels)."
  - q: Combien de bits faut-il pour écrire l'entier n ≥ 1 ?
    r: "$\\lfloor \\log_2 n \\rfloor + 1$."
  - q: Pourquoi l'hexadécimal est-il pratique ?
    r: "Un chiffre hexadécimal correspond exactement à 4 bits : on convertit binaire ↔ hexa par paquets de 4, et un octet s'écrit avec 2 chiffres (00 à FF)."
  - q: Différence entre 1 Ko et 1 Kio ?
    r: "1 Ko = 1000 octets (préfixe décimal) ; 1 Kio = 1024 octets (préfixe binaire, kibi)."
  - q: Que vaut `int("ff", 16)` ? `hex(255)` ? `bin(10)` ?
    r: "`255` ; `\"0xff\"` ; `\"0b1010\"`."
---

À l'intérieur d'un ordinateur, tout est fait de **bits**, des 0 et des 1 : nombres, textes, images, sons, programmes. Avant de
comprendre comment on y code des entiers négatifs, des nombres à virgule ou du texte, il faut savoir écrire un simple entier
**en base 2**, et passer d'une base à l'autre. C'est aussi le point de départ de questions très concrètes : pourquoi une
couleur s'écrit `#FF8800`, pourquoi une adresse IPv4 va de 0 à 255 par morceaux, pourquoi un disque de « 1 To » affiche
« 931 Go ».

## 1. L'écriture positionnelle

En base 10, $2026 = 2 \times 10^3 + 0 \times 10^2 + 2 \times 10^1 + 6 \times 10^0$ : chaque chiffre est multiplié par une
**puissance de la base** qui dépend de sa **position**. Il en va de même dans n'importe quelle base $b \ge 2$, avec des
chiffres de $0$ à $b - 1$ :

$$ (a_{k} a_{k-1} \dots a_1 a_0)_b = \sum_{i=0}^{k} a_i\, b^i. $$

| Base | Nom          | Chiffres                    | Exemple          | Valeur décimale |
|------|--------------|-----------------------------|------------------|-----------------|
| 10   | décimale     | 0 à 9                       | $2026_{10}$      | 2026            |
| 2    | binaire      | 0 et 1 (les **bits**)       | $101101_2$       | 45              |
| 16   | hexadécimale | 0 à 9 puis A (10) à F (15)  | $\text{7EA}_{16}$ | 2026           |

## 2. De la base 2 (ou 16) vers la base 10

On additionne les chiffres multipliés par les puissances de la base :

$$ 101101_2 = 1 \times 32 + 0 \times 16 + 1 \times 8 + 1 \times 4 + 0 \times 2 + 1 \times 1 = 45. $$

$$ \text{7EA}_{16} = 7 \times 256 + 14 \times 16 + 10 = 1792 + 224 + 10 = 2026. $$

Pour programmer, la **méthode de Horner** évite de calculer les puissances : on lit les chiffres de gauche à droite et on
fait `valeur = valeur * base + chiffre`.

```python exec
def vers_decimal(chiffres, base):
    valeur = 0
    for c in chiffres:
        valeur = valeur * base + int(c, 16)     # int(c, 16) convertit aussi '0'..'9', 'A'..'F'
    return valeur

print(vers_decimal("101101", 2), vers_decimal("7EA", 16))
print(int("101101", 2), int("7EA", 16), 0b101101, 0x7EA)   # ce que fournit Python
```

## 3. De la base 10 vers la base 2 : divisions successives

On divise par 2 ; le **reste** est le chiffre de poids faible ; on recommence avec le quotient jusqu'à obtenir 0. Les restes,
lus **du dernier au premier**, donnent l'écriture binaire.

| division   | quotient | reste |
|------------|----------|-------|
| 45 ÷ 2     | 22       | **1** (poids faible) |
| 22 ÷ 2     | 11       | **0** |
| 11 ÷ 2     | 5        | **1** |
| 5 ÷ 2      | 2        | **1** |
| 2 ÷ 2      | 1        | **0** |
| 1 ÷ 2      | 0        | **1** (poids fort) |

Lecture de bas en haut : $45 = 101101_2$. La même méthode marche pour toute base $b$ (divisions par $b$).

```python exec
def vers_base(n, base):
    """Écriture de l'entier n >= 0 dans la base donnée (2 à 16)."""
    if n == 0:
        return "0"
    chiffres = "0123456789ABCDEF"
    resultat = ""
    while n > 0:
        resultat = chiffres[n % base] + resultat
        n = n // base
    return resultat

print(vers_base(45, 2), vers_base(2026, 16), vers_base(2026, 2))
print(bin(45), hex(2026), format(2026, "b"), format(2026, "X"))
```

La preuve de cette méthode (avec son invariant) a été faite dans la leçon « Prouver un algorithme ».

## 4. L'hexadécimal, raccourci du binaire

Comme $16 = 2^4$, **un chiffre hexadécimal correspond exactement à 4 bits**. On convertit donc par paquets de 4 bits, en
partant de la droite :

$$ 2026 = \underbrace{0111}_{7}\ \underbrace{1110}_{E}\ \underbrace{1010}_{A}{}_2 = \text{7EA}_{16} $$

| hexa | binaire | | hexa | binaire | | hexa | binaire | | hexa | binaire |
|------|---------|-|------|---------|-|------|---------|-|------|---------|
| 0 | 0000 | | 4 | 0100 | | 8 | 1000 | | C | 1100 |
| 1 | 0001 | | 5 | 0101 | | 9 | 1001 | | D | 1101 |
| 2 | 0010 | | 6 | 0110 | | A | 1010 | | E | 1110 |
| 3 | 0011 | | 7 | 0111 | | B | 1011 | | F | 1111 |

Un **octet** (8 bits) s'écrit donc avec exactement 2 chiffres hexadécimaux, de `00` à `FF` (0 à 255) : c'est pourquoi les
couleurs du Web s'écrivent `#RRGGBB` (un octet par composante rouge, vert, bleu), et les adresses mémoire ou MAC en hexadécimal.

## 5. Compter en bits

:::retenir
- Sur $n$ bits, on peut écrire $2^n$ valeurs différentes : les entiers de $0$ à $2^n - 1$. Un octet : 256 valeurs (0 à 255).
- Pour écrire un entier $N \ge 1$, il faut $\lfloor \log_2 N \rfloor + 1$ bits (car $2^{k} \le N < 2^{k+1}$ avec $k + 1$ bits).
- Ajouter un bit **double** le nombre de valeurs ; décaler à gauche d'un bit **multiplie par 2**.
:::

**Unités.** 1 octet = 8 bits. Les préfixes du Système international sont décimaux : 1 ko = 1 000 octets, 1 Mo = $10^6$
octets, 1 Go = $10^9$, 1 To = $10^{12}$. Les préfixes **binaires** sont : 1 Kio (kibioctet) = $2^{10}$ = 1024 octets,
1 Mio = $2^{20}$, 1 Gio = $2^{30}$. Un disque vendu « 1 To » ($10^{12}$ octets) est affiché « 931 Go » par un système qui
compte en réalité en Gio : $10^{12} / 2^{30} \approx 931$.

## 6. Additionner en binaire

On pose l'addition comme en base 10, avec les tables $0 + 0 = 0$, $0 + 1 = 1$, $1 + 1 = 10_2$ (on écrit 0 et on **retient** 1),
$1 + 1 + 1 = 11_2$ :

```
    1 1 1        ← retenues
    1 0 1 1 0 1      (45)
  +   1 1 0 1 1      (27)
  -------------
  1 0 0 1 0 0 0      (72)
```

```python exec
print(bin(45 + 27), 0b101101 + 0b11011)
print(bin(45 << 1), 45 << 1, bin(45 >> 2), 45 >> 2)     # décalages : × 2 et ÷ 4 (division entière)
```

:::prof
La conversion décimal ↔ binaire est au programme de première NSI (« passer de la représentation d'une base à une autre »)
et apparaît en SNT (pixels, couleurs). Les élèves inversent souvent l'ordre de lecture des restes : faire vérifier par la
conversion inverse est un bon réflexe. Les activités débranchées (cartes à points 1, 2, 4, 8, 16 de CS Unplugged) font
comprendre la numération binaire en quelques minutes.
:::

## Exemple guidé

**Problème.** Une couleur est notée `#2E86C1`. Donner ses composantes rouge, verte et bleue en décimal, puis l'écrire en
binaire sur 24 bits, et dire combien de couleurs différentes ce codage permet.

**1. Découper.** `#RRGGBB` : rouge `2E`, vert `86`, bleu `C1`.

**2. Convertir chaque octet.** $\text{2E}_{16} = 2 \times 16 + 14 = 46$ ; $\text{86}_{16} = 8 \times 16 + 6 = 134$ ;
$\text{C1}_{16} = 12 \times 16 + 1 = 193$.

**3. En binaire, par paquets de 4 bits.** `2` = 0010, `E` = 1110, `8` = 1000, `6` = 0110, `C` = 1100, `1` = 0001 :
`00101110 10000110 11000001`.

**4. Nombre de couleurs.** 24 bits, donc $2^{24} = 16\,777\,216$ couleurs (environ 16,8 millions).

```python exec
couleur = "#2E86C1"
r, v, b = (int(couleur[i:i + 2], 16) for i in (1, 3, 5))
print(r, v, b)
print(" ".join(format(x, "08b") for x in (r, v, b)))
print(2 ** 24)
```

## L'essentiel

- Écriture positionnelle : $(a_k \dots a_0)_b = \sum a_i b^i$ ; base 2 (bits), 16 (0-9, A-F).
- Base $b$ → décimal : somme des chiffres × puissances (Horner : `v = v * b + chiffre`).
- Décimal → base $b$ : divisions successives par $b$, restes lus du dernier au premier.
- 1 chiffre hexa = 4 bits ; 1 octet = 8 bits = 2 chiffres hexa (00 à FF).
- $n$ bits : $2^n$ valeurs ; il faut $\lfloor \log_2 N \rfloor + 1$ bits pour $N$ ; Ko (1000) ≠ Kio (1024).
- Python : `bin`, `hex`, `int(s, base)`, `format(n, "b")`, `0b…`, `0x…`.

## Exercices

::::exercice[Du binaire au décimal]{niveau=1}
Que vaut $110010_2$ en décimal ?

- [ ] 48
- [x] 50
- [ ] 52
- [ ] 100

:::corrige
$32 + 16 + 2 = 50$.
:::
::::

::::exercice[Hexadécimal]{niveau=1}
Lesquelles de ces égalités sont vraies ?

- [x] $\text{FF}_{16} = 255$
- [ ] $\text{10}_{16} = 10$
- [x] $\text{A}_{16} = 1010_2$
- [x] $\text{100}_{16} = 256$

:::corrige
$\text{FF}_{16} = 15 \times 16 + 15 = 255$ ; $\text{10}_{16} = 16$ (et non 10) ; $\text{A} = 10 = 1010_2$ ;
$\text{100}_{16} = 16^2 = 256$.
:::
::::

::::exercice[Nombre de bits]{niveau=1}
Combien de bits faut-il au minimum pour écrire en binaire tous les entiers de 0 à 1000 ?

- [ ] 9
- [x] 10
- [ ] 11
- [ ] 1000

:::corrige
$2^9 = 512 \le 1000 < 1024 = 2^{10}$ : il faut 10 bits ($\lfloor \log_2 1000 \rfloor + 1 = 10$).
:::
::::

::::exercice[Écrire en binaire]{niveau=2}
Écris `binaire(n)` qui renvoie l'écriture binaire de l'entier `n >= 0` sous forme de chaîne, par divisions successives
(sans `bin` ni `format`).

```python depart
def binaire(n):
    ...
```

```python tests
assert binaire(45) == "101101", "45"
assert binaire(0) == "0", "zéro"
assert binaire(1) == "1", "un"
assert binaire(255) == "11111111", "un octet plein"
assert binaire(1024) == "10000000000", "puissance de 2"
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
On ajoute chaque reste **devant** la chaîne : c'est la lecture « du dernier au premier ». Le cas 0 est traité à part (la
boucle ne ferait aucun tour).
:::
::::

::::exercice[D'une base quelconque vers le décimal]{niveau=2}
Écris `valeur(chiffres, base)` qui renvoie la valeur de la chaîne `chiffres` (chiffres de 0 à 9 puis A à F, en majuscules)
écrite dans la base donnée (2 à 16), avec la méthode de Horner et sans `int(…, base)`.

```python depart
def valeur(chiffres, base):
    ...
```

```python tests
assert valeur("101101", 2) == 45, "binaire"
assert valeur("7EA", 16) == 2026, "hexadécimal"
assert valeur("777", 8) == 511, "octal"
assert valeur("0", 2) == 0, "zéro"
assert valeur("FFFF", 16) == 65535, "deux octets"
```

:::corrige
```python solution
def valeur(chiffres, base):
    symboles = "0123456789ABCDEF"
    v = 0
    for c in chiffres:
        v = v * base + symboles.index(c)
    return v
```
Horner : $((a_k b + a_{k-1}) b + a_{k-2}) b + \dots$ ; aucune puissance n'est calculée, et il n'y a qu'une multiplication
par chiffre.
:::
::::

::::exercice[Addition binaire]{niveau=3}
Écris `addition(a, b)` qui additionne deux nombres écrits en binaire (chaînes de 0 et de 1) et renvoie le résultat en binaire,
**sans convertir en entiers** : pose l'addition chiffre par chiffre avec une retenue.

```python depart
def addition(a, b):
    ...
```

```python tests
assert addition("101101", "11011") == "1001000", "45 + 27 = 72"
assert addition("1", "1") == "10", "1 + 1"
assert addition("0", "0") == "0", "0 + 0"
assert addition("1111", "1") == "10000", "retenue jusqu'au bout"
assert addition("100", "0") == "100", "ajouter zéro"
```

:::corrige
```python solution
def addition(a, b):
    i, j = len(a) - 1, len(b) - 1
    retenue = 0
    resultat = ""
    while i >= 0 or j >= 0 or retenue:
        s = retenue
        if i >= 0:
            s += int(a[i]); i -= 1
        if j >= 0:
            s += int(b[j]); j -= 1
        resultat = str(s % 2) + resultat
        retenue = s // 2
    return resultat if resultat else "0"
```
On parcourt les deux nombres depuis la droite ; la somme de deux bits et d'une retenue vaut au plus 3 : bit `s % 2`,
retenue `s // 2`. La condition `or retenue` traite la dernière retenue (cas `1111 + 1`).
:::
::::

::::exercice[Unités et ordres de grandeur]{niveau=3}
1. Un fichier fait 3 Mio. Combien d'octets exactement ? Combien de Mo ?
2. Une image non compressée de 1920 × 1080 pixels, chaque pixel codé sur 24 bits : quelle taille en octets, en Mo et en Mio ?
3. Pourquoi un disque vendu « 2 To » est-il affiché environ « 1,82 To » par certains systèmes ?

:::criteres
- 3 Mio = $3 \times 2^{20} = 3\,145\,728$ octets ≈ 3,15 Mo.
- Image : $1920 \times 1080 \times 3 = 6\,220\,800$ octets ≈ 6,2 Mo ≈ 5,93 Mio.
- Le disque contient $2 \times 10^{12}$ octets ; le système compte en Tio ($2^{40}$) en affichant « To » : $2 \times 10^{12} / 2^{40} \approx 1{,}82$.
:::

:::corrige
1. $3 \text{ Mio} = 3 \times 2^{20} = 3 \times 1\,048\,576 = 3\,145\,728$ octets, soit environ $3{,}15$ Mo (Mo = $10^6$ octets).
2. $1920 \times 1080 = 2\,073\,600$ pixels × 3 octets (24 bits) $= 6\,220\,800$ octets, soit environ $6{,}2$ Mo ou
   $6\,220\,800 / 1\,048\,576 \approx 5{,}93$ Mio. D'où l'intérêt de la compression (JPEG, PNG).
3. Le fabricant compte en unités décimales : $2 \text{ To} = 2 \times 10^{12}$ octets. Le système divise par
   $2^{40} \approx 1{,}0995 \times 10^{12}$ (des Tio) mais affiche « To » : $2 \times 10^{12} / 2^{40} \approx 1{,}82$.
   Il ne manque rien : seule l'unité diffère.
:::
::::

::::exercice[Bits nécessaires et conversion en base b]{niveau=4 duree=20}
1. Démontre que l'écriture d'un entier $N \ge 1$ en base $b$ comporte exactement $\lfloor \log_b N \rfloor + 1$ chiffres.
2. En déduire le nombre de divisions effectuées par l'algorithme des divisions successives, et le comparer pour $b = 2$ et
   $b = 16$ (relation entre les deux).
3. Un élève affirme : « pour convertir de l'hexadécimal au binaire, il faut repasser par la base 10 ». Explique pourquoi c'est
   inutile, et généralise : entre quelles bases peut-on convertir « par paquets » ?

:::criteres
- Q1 : un nombre à $k + 1$ chiffres en base $b$ (premier chiffre non nul) vérifie $b^k \le N < b^{k+1}$ ; donc $k \le \log_b N < k + 1$, $k = \lfloor \log_b N \rfloor$.
- Q2 : une division par chiffre produit, soit $\lfloor \log_b N \rfloor + 1$ divisions ; en base 16 environ 4 fois moins de chiffres qu'en base 2 ($\log_{16} N = \log_2 N / 4$).
- Q3 : chaque chiffre hexadécimal correspond à exactement 4 bits car $16 = 2^4$ : $\sum h_i 16^i = \sum h_i 2^{4i}$ ; conversion directe par paquets ; possible entre bases $b$ et $b^k$ (ex. 2 et 8, 2 et 16, 3 et 9).
:::

:::corrige
1. Si $N$ s'écrit avec $k + 1$ chiffres $(a_k \dots a_0)_b$ et $a_k \ne 0$, alors $N \ge a_k b^k \ge b^k$ et
   $N \le (b - 1)(b^k + \dots + 1) = b^{k+1} - 1 < b^{k+1}$. Donc $b^k \le N < b^{k+1}$, c'est-à-dire $k \le \log_b N < k + 1$,
   et $k = \lfloor \log_b N \rfloor$ : il y a $\lfloor \log_b N \rfloor + 1$ chiffres.
2. Chaque division produit un chiffre : l'algorithme fait $\lfloor \log_b N \rfloor + 1$ divisions. Comme
   $\log_{16} N = \log_2 N / \log_2 16 = \log_2 N / 4$, l'écriture hexadécimale a environ 4 fois moins de chiffres que
   l'écriture binaire (exactement $\lceil k_2 / 4 \rceil$ si $k_2$ est le nombre de bits).
3. Comme $16 = 2^4$, $N = \sum_i h_i\, 16^i = \sum_i h_i\, 2^{4i}$, et chaque chiffre $h_i \in [0, 15]$ s'écrit sur exactement
   4 bits : l'écriture binaire de $N$ est la concaténation des écritures sur 4 bits de ses chiffres hexadécimaux. Aucun passage
   par la base 10 n'est nécessaire. Plus généralement, on convertit par paquets de $k$ chiffres entre les bases $b$ et $b^k$
   (2 et 8 par paquets de 3 bits, 2 et 16 par 4, 3 et 9 par 2…).
:::
::::
