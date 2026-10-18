---
titre: Entiers et complément à deux
resume: Représenter des entiers sur un nombre fixe de bits, y compris les négatifs grâce au complément à deux, comprendre les dépassements et manipuler les bits.
duree: 65
objectifs:
  - Donner l'intervalle des entiers représentables sur n bits, avec ou sans signe
  - Coder et décoder un entier relatif en complément à deux
  - Expliquer pourquoi l'addition fonctionne « naturellement » en complément à deux, et détecter un dépassement
  - Utiliser les opérateurs bit à bit (`&`, `|`, `^`, `<<`, `>>`) et les masques
prerequis: [representation/bases]
programme: [id-types-simples, id-codage, id-memoire, nsi1-base, asr-circuits]
cartes:
  - q: Intervalle des entiers sur n bits non signés ? signés en complément à deux ?
    r: "Non signés : $0$ à $2^n - 1$. Complément à deux : $-2^{n-1}$ à $2^{n-1} - 1$ (sur 8 bits : −128 à 127)."
  - q: Comment obtenir le complément à deux de −x sur n bits ?
    r: "On écrit x en binaire sur n bits, on inverse tous les bits, puis on ajoute 1. (C'est l'écriture de $2^n - x$.)"
  - q: Que vaut l'octet `11111111` interprété en complément à deux ?
    r: "−1."
  - q: Comment reconnaître le signe d'un entier en complément à deux ?
    r: "Le bit de poids fort vaut 1 pour un négatif, 0 pour un positif ou nul."
  - q: Quand y a-t-il dépassement dans une addition signée en complément à deux ?
    r: "Quand les deux opérandes ont le même signe et que le résultat (sur n bits) a le signe opposé."
  - q: À quoi sert un masque comme `x & 0xFF` ?
    r: "À garder seulement certains bits (ici les 8 bits de poids faible) et à mettre les autres à 0."
  - q: Qu'est-ce que le bogue de l'an 2038 ?
    r: "Les systèmes qui comptent le temps en secondes depuis le 1er janvier 1970 sur un entier signé de 32 bits dépasseront $2^{31} - 1$ le 19 janvier 2038 à 03:14:07 UTC."
---

En Python, `2 ** 100` s'affiche sans problème : les entiers de Python n'ont pas de limite de taille. Mais dans un processeur,
un registre a une taille **fixe** (8, 16, 32 ou 64 bits), et la plupart des langages (C, Java…) manipulent des entiers sur un
nombre fixe de bits. Il faut alors savoir quels entiers on peut représenter, comment coder les **négatifs**, et ce qui arrive
quand un calcul **dépasse**. Ces questions sont au programme de première NSI et reviennent dans les sujets (assembleur,
architecture).

## 1. Entiers naturels sur n bits

Sur $n$ bits, on représente les entiers de $0$ à $2^n - 1$ :

| bits | valeurs                   | usage typique                       |
|------|---------------------------|-------------------------------------|
| 8    | 0 à 255                   | un octet, une composante de couleur |
| 16   | 0 à 65 535                | numéro de port TCP/UDP              |
| 32   | 0 à 4 294 967 295         | adresse IPv4                        |
| 64   | 0 à environ $1{,}8 \times 10^{19}$ | registres des processeurs actuels |

Si un calcul dépasse, seuls les $n$ bits de poids faible sont conservés : le résultat est calculé **modulo** $2^n$. Sur 8 bits,
$200 + 100 = 300$ donne $300 - 256 = 44$ (le neuvième bit est perdu).

```python exec
n = 8
print((200 + 100) % 2**n, (200 + 100) & 0xFF)     # même chose : on garde les 8 bits de poids faible
print((0 - 1) % 2**n)                             # 0 - 1 « fait le tour » : 255
```

## 2. Représenter les négatifs : le complément à deux

Première idée : réserver un bit pour le signe (**signe et valeur absolue**). Elle a deux défauts : deux zéros (`00000000` et
`10000000`) et des additions compliquées (il faut traiter les signes à part). Les processeurs utilisent le **complément à deux**.

:::definition
Sur $n$ bits, en **complément à deux** :
- un entier $x$ avec $0 \le x \le 2^{n-1} - 1$ est représenté par son écriture binaire (le bit de poids fort vaut 0) ;
- un entier négatif $x$ avec $-2^{n-1} \le x < 0$ est représenté par l'écriture binaire de $2^n + x$ (le bit de poids fort vaut 1).

L'intervalle représentable est $[-2^{n-1}, 2^{n-1} - 1]$ : sur 8 bits, de −128 à 127.
:::

**Méthode pratique** pour coder $-x$ : écrire $x$ sur $n$ bits, **inverser** tous les bits, puis **ajouter 1**.

Exemple sur 8 bits : $45 = 00101101$ ; on inverse : $11010010$ ; on ajoute 1 : $11010011$. Donc $-45$ s'écrit `11010011`
(c'est bien $256 - 45 = 211 = 11010011_2$).

**Décoder** : si le bit de poids fort vaut 0, on lit normalement ; s'il vaut 1, la valeur est $(\text{valeur non signée}) - 2^n$.
Autrement dit, le bit de poids fort « pèse » $-2^{n-1}$ au lieu de $+2^{n-1}$ :

$$ (b_{n-1} b_{n-2} \dots b_0) \mapsto -b_{n-1} 2^{n-1} + \sum_{i=0}^{n-2} b_i 2^i. $$

`11010011` vaut $-128 + 64 + 16 + 2 + 1 = -45$.

```python exec
def code_c2(x, n=8):
    """Écriture de x (entre -2**(n-1) et 2**(n-1)-1) en complément à deux sur n bits."""
    return format(x % 2**n, f"0{n}b")

def valeur_c2(bits):
    v = int(bits, 2)
    return v - 2**len(bits) if bits[0] == "1" else v

for x in [45, -45, -1, -128, 127, 0]:
    b = code_c2(x)
    print(f"{x:5d} -> {b} -> {valeur_c2(b)}")
```

| valeur | 8 bits      |
|--------|-------------|
| 127    | `01111111`  |
| 1      | `00000001`  |
| 0      | `00000000`  |
| −1     | `11111111`  |
| −2     | `11111110`  |
| −128   | `10000000`  |

## 3. L'addition « gratuite »

L'intérêt du complément à deux : on additionne **les représentations comme des entiers naturels**, modulo $2^n$, et on
obtient la représentation du bon résultat (s'il est dans l'intervalle). Le même circuit additionneur sert pour les entiers
signés et non signés, et la soustraction $a - b$ devient $a + (-b)$.

```
    00101101      (45)
  + 11100010      (-30)
  ----------
  1 00001111      → on garde 8 bits : 00001111 = 15  ✓
```

**Dépassement (overflow).** Si le vrai résultat sort de $[-2^{n-1}, 2^{n-1} - 1]$, la représentation obtenue est fausse :
$100 + 50$ sur 8 bits donne `10010110`, interprété comme $-106$. On le détecte facilement : il y a dépassement **si et
seulement si** les deux opérandes ont le **même signe** et le résultat a le **signe opposé**. (Ajouter un positif et un négatif
ne déborde jamais.)

```python exec
def addition_8_bits(a, b):
    r = (a + b) % 256
    signe = lambda v: v >= 128          # bit de poids fort à 1
    ra, rb = a % 256, b % 256
    depassement = signe(ra) == signe(rb) and signe(r) != signe(ra)
    valeur = r - 256 if r >= 128 else r
    return valeur, depassement

print(addition_8_bits(45, -30), addition_8_bits(100, 50), addition_8_bits(-100, -50), addition_8_bits(-128, -1))
```

:::attention
Les dépassements ont causé de vrais accidents et bogues : l'explosion du premier vol d'Ariane 5 (1996) a été provoquée par la
conversion d'un flottant 64 bits en entier signé 16 bits qui dépassait ; le compteur de vues de YouTube a dû passer en 64
bits en 2014 quand une vidéo a approché $2^{31} - 1$ vues ; et les systèmes qui comptent les secondes depuis le 1ᵉʳ janvier
1970 sur un entier signé de 32 bits déborderont le 19 janvier 2038 (« bogue de l'an 2038 »).
:::

## 4. Les opérations bit à bit

Python (comme C ou Java) fournit des opérateurs qui agissent **bit par bit** :

| Opérateur | Nom       | Exemple (sur 4 bits)        | Usage                              |
|-----------|-----------|-----------------------------|------------------------------------|
| `a & b`   | ET        | `1100 & 1010 = 1000`        | **masquer** : garder certains bits |
| `a \| b`  | OU        | `1100 \| 1010 = 1110`       | **allumer** des bits               |
| `a ^ b`   | OU exclusif | `1100 ^ 1010 = 0110`      | **inverser** des bits, chiffrement |
| `~a`      | NON       | `~5 == -6` (en Python)      | inverser tous les bits             |
| `a << k`  | décalage à gauche | `0011 << 2 = 1100`  | multiplier par $2^k$               |
| `a >> k`  | décalage à droite | `1100 >> 2 = 0011`  | diviser par $2^k$ (division entière) |

```python exec
x = 0b10110110
print(x & 0b00001111)          # les 4 bits de poids faible : 6
print((x >> 4) & 0b1111)       # les 4 bits de poids fort : 11
print(x & 1 == 0)              # x pair ?
droits = 0b110                 # lecture, écriture, pas d'exécution (comme rwx sous Unix)
print(bool(droits & 0b100), bool(droits & 0b001))
print(bin(x | 0b1), bin(x ^ 0xFF))
```

Les **masques** servent partout : extraire un octet d'une couleur (`(c >> 8) & 0xFF`), tester un indicateur (droits d'accès
Unix, drapeaux d'un processeur), calculer une adresse réseau (`ip & masque`, module réseaux).

:::prof
Le programme de première demande d'« évaluer le nombre de bits nécessaires » et d'utiliser le complément à deux sur des
exemples. Le « compteur kilométrique » qui revient à zéro (ou un compteur à 3 chiffres où 999 + 1 = 000, et où 999 joue le rôle
de −1) fait comprendre le complément à deux sans formule. Les élèves oublient souvent le « + 1 » ou la taille fixe : toujours
préciser « sur n bits ».
:::

## Exemple guidé

**Problème.** Sur 16 bits en complément à deux : 1. coder −1000 ; 2. donner l'intervalle représentable ; 3. calculer
$30\,000 + 10\,000$ et interpréter ; 4. dire à quelle date un compteur signé de 32 bits de secondes depuis 1970 déborde.

**1.** $1000 = 0000\,0011\,1110\,1000_2$. Inverser : $1111\,1100\,0001\,0111$. Ajouter 1 : $1111\,1100\,0001\,1000_2$ (en
hexadécimal `FC18`). Vérification : $2^{16} - 1000 = 64\,536 = \text{FC18}_{16}$.

**2.** $[-2^{15}, 2^{15} - 1] = [-32\,768, 32\,767]$.

**3.** $40\,000 > 32\,767$ : dépassement. Le résultat sur 16 bits est $40\,000 - 65\,536 = -25\,536$ : deux positifs donnent un
négatif, signe d'un dépassement.

**4.** Le compteur atteint $2^{31} - 1 = 2\,147\,483\,647$ secondes, soit environ 68 ans après le 1ᵉʳ janvier 1970.

```python exec
from datetime import datetime, timedelta, timezone

print(format(-1000 % 2**16, "016b"), hex(-1000 % 2**16))
r = (30000 + 10000) % 2**16
print(r - 2**16 if r >= 2**15 else r)
debut = datetime(1970, 1, 1, tzinfo=timezone.utc)
print(debut + timedelta(seconds=2**31 - 1))
```

## L'essentiel

- Sur $n$ bits non signés : $[0, 2^n - 1]$ ; les calculs se font modulo $2^n$ (dépassement = on perd les bits en trop).
- Complément à deux : $[-2^{n-1}, 2^{n-1} - 1]$ ; $-x$ = inverser les bits de $x$ puis ajouter 1 ; bit de poids fort = signe ; il pèse $-2^{n-1}$.
- L'addition des représentations (modulo $2^n$) donne le bon résultat ; dépassement si deux opérandes de même signe donnent un résultat de signe opposé.
- Opérateurs bit à bit : `&` (masquer), `|` (allumer), `^` (inverser), `<<`, `>>` (× ou ÷ par puissances de 2).
- Python : entiers non bornés ; on simule n bits avec `% 2**n` ou `& masque`.

## Exercices

::::exercice[Intervalle sur 8 bits]{niveau=1}
Quel est l'intervalle des entiers représentables sur 8 bits en complément à deux ?

- [ ] 0 à 255
- [ ] −127 à 127
- [x] −128 à 127
- [ ] −255 à 255

:::corrige
$[-2^7, 2^7 - 1] = [-128, 127]$ : il y a toujours 256 valeurs, mais réparties autour de 0, avec un négatif de plus.
:::
::::

::::exercice[Décoder]{niveau=1}
Que vaut l'octet `11110110` interprété en complément à deux ?

- [ ] 246
- [x] −10
- [ ] −118
- [ ] −9

:::corrige
Le bit de poids fort vaut 1 : négatif. Valeur non signée $246$, donc $246 - 256 = -10$. Vérification : $10 = 00001010$,
inversé $11110101$, plus 1 : $11110110$.
:::
::::

::::exercice[Coder en complément à deux]{niveau=2}
Écris `complement_deux(x, n)` qui renvoie la chaîne de `n` bits représentant `x` en complément à deux. Si `x` n'est pas
représentable, lève `ValueError`. N'utilise pas `%` avec une puissance de 2 : applique la méthode « inverser puis ajouter 1 »
pour les négatifs.

```python depart
def complement_deux(x, n):
    ...
```

```python tests
assert complement_deux(45, 8) == "00101101", "positif"
assert complement_deux(-45, 8) == "11010011", "négatif"
assert complement_deux(-1, 8) == "11111111", "-1"
assert complement_deux(-128, 8) == "10000000", "plus petit"
assert complement_deux(0, 4) == "0000", "zéro"
for hors in [(128, 8), (-129, 8)]:
    try:
        complement_deux(*hors)
        ok = False
    except ValueError:
        ok = True
    assert ok, "hors intervalle : " + str(hors)
```

:::corrige
```python solution
def complement_deux(x, n):
    if not -2 ** (n - 1) <= x <= 2 ** (n - 1) - 1:
        raise ValueError("non représentable sur %d bits" % n)
    if x >= 0:
        return format(x, "0%db" % n)
    bits = format(-x, "0%db" % n)
    inverse = "".join("1" if b == "0" else "0" for b in bits)
    return format(int(inverse, 2) + 1, "0%db" % n)
```
Pour $-128$ sur 8 bits : $128 = 10000000$, inversé $01111111$, plus 1 : $10000000$ ; il tient bien sur 8 bits.
:::
::::

::::exercice[Décoder une représentation]{niveau=2}
Écris `valeur(bits)` qui renvoie l'entier représenté par la chaîne `bits` en complément à deux (sa longueur est le nombre de
bits), avec la formule « le bit de poids fort pèse $-2^{n-1}$ ».

```python depart
def valeur(bits):
    ...
```

```python tests
assert valeur("11010011") == -45, "-45"
assert valeur("01111111") == 127, "127"
assert valeur("10000000") == -128, "-128"
assert valeur("1111") == -1, "sur 4 bits"
assert valeur("0") == 0, "un seul bit nul"
```

:::corrige
```python solution
def valeur(bits):
    n = len(bits)
    v = -int(bits[0]) * 2 ** (n - 1)
    for i in range(1, n):
        v += int(bits[i]) * 2 ** (n - 1 - i)
    return v
```
Équivalent : `int(bits, 2) - (2 ** n if bits[0] == "1" else 0)`.
:::
::::

::::exercice[Compter les bits à 1]{niveau=2}
Écris `nb_uns(x)` qui compte les bits à 1 de l'entier `x >= 0`, en n'utilisant que les opérateurs bit à bit (`&`, `>>`), sans
convertir en chaîne.

```python depart
def nb_uns(x):
    ...
```

```python tests
assert nb_uns(0) == 0, "zéro"
assert nb_uns(0b1011) == 3, "1011"
assert nb_uns(255) == 8, "un octet plein"
assert nb_uns(2 ** 40) == 1, "puissance de 2"
assert nb_uns(2 ** 40 - 1) == 40, "40 bits à 1"
```

:::corrige
```python solution
def nb_uns(x):
    n = 0
    while x > 0:
        n += x & 1        # le bit de poids faible
        x >>= 1           # on décale d'un bit vers la droite
    return n
```
Variante astucieuse : `x & (x - 1)` efface le bit à 1 le plus faible ; on compte combien de fois on peut le faire avant 0
(autant de tours que de bits à 1). Python 3.10+ fournit `x.bit_count()`.
:::
::::

::::exercice[Addition sur n bits avec drapeaux]{niveau=3}
Écris `additionner(a, b, n)` qui simule un additionneur de `n` bits : `a` et `b` sont des entiers signés représentables sur
`n` bits ; la fonction renvoie un triplet `(resultat, retenue, debordement)` : `resultat` est la valeur signée lue sur `n` bits,
`retenue` indique si l'addition des représentations non signées produit un bit au-delà des `n` bits (drapeau « carry »), et
`debordement` indique un dépassement signé (drapeau « overflow »).

```python depart
def additionner(a, b, n):
    ...
```

```python tests
assert additionner(45, -30, 8) == (15, True, False), "45 - 30 : retenue mais pas de débordement"
assert additionner(100, 50, 8) == (-106, False, True), "débordement positif"
assert additionner(-100, -50, 8) == (106, True, True), "débordement négatif"
assert additionner(1, 2, 8) == (3, False, False), "cas simple"
assert additionner(-1, 1, 4) == (0, True, False), "-1 + 1 sur 4 bits"
```

:::corrige
```python solution
def additionner(a, b, n):
    m = 2 ** n
    ua, ub = a % m, b % m              # représentations non signées
    somme = ua + ub
    retenue = somme >= m
    r = somme % m
    resultat = r - m if r >= m // 2 else r
    debordement = (a >= 0) == (b >= 0) and (resultat >= 0) != (a >= 0)
    return resultat, retenue, debordement
```
La **retenue** concerne l'arithmétique **non signée** ; le **débordement**, l'arithmétique **signée**. Les deux drapeaux existent
dans les processeurs, et les instructions de saut conditionnel les utilisent. On voit qu'il peut y avoir retenue sans
débordement (45 − 30) et débordement sans retenue (100 + 50).
:::
::::

::::exercice[Justifier le complément à deux]{niveau=4 duree=20}
On travaille sur $n$ bits. On note $R(x)$ l'entier naturel dont l'écriture binaire sur $n$ bits représente $x$ en complément à
deux : $R(x) = x$ si $x \ge 0$, $R(x) = 2^n + x$ si $x < 0$.

1. Montre que $R(x) \equiv x \pmod{2^n}$ pour tout $x$ de l'intervalle, et que $R$ est une bijection de
   $[-2^{n-1}, 2^{n-1} - 1]$ sur $[0, 2^n - 1]$.
2. En déduire que si $a$, $b$ et $a + b$ sont dans l'intervalle, alors $(R(a) + R(b)) \bmod 2^n = R(a + b)$ : l'additionneur
   non signé calcule la bonne représentation.
3. Justifie la méthode « inverser les bits puis ajouter 1 ». (Indice : que vaut $R(x) + \text{inverse}(R(x))$ ?)
4. Montre qu'il ne peut pas y avoir de dépassement quand $a$ et $b$ sont de signes opposés.

:::criteres
- Q1 : pour $x < 0$, $R(x) - x = 2^n$ ; les positifs vont sur $[0, 2^{n-1} - 1]$, les négatifs sur $[2^{n-1}, 2^n - 1]$ ; injective et les ensembles ont $2^n$ éléments, donc bijective.
- Q2 : $R(a) + R(b) \equiv a + b \equiv R(a + b) \pmod{2^n}$, et $R(a+b) \in [0, 2^n - 1]$, donc c'est le reste de la division.
- Q3 : un nombre de $n$ bits plus son inverse bit à bit donne $11\dots1 = 2^n - 1$ ; donc $\text{inverse}(R(x)) + 1 = 2^n - R(x)$, qui est $R(-x)$ (pour $x > 0$ : $2^n - x$).
- Q4 : si $a \ge 0 > b$, alors $b < a + b < a$ (ou égal pour $b$ ou $a$ extrême), donc $a + b$ reste dans l'intervalle $[b, a]$, inclus dans l'intervalle représentable.
:::

:::corrige
1. Si $x \ge 0$, $R(x) = x$ ; si $x < 0$, $R(x) = x + 2^n$ : dans les deux cas $R(x) \equiv x \pmod{2^n}$. Les $x$ de
   $[0, 2^{n-1} - 1]$ ont pour image $[0, 2^{n-1} - 1]$ et ceux de $[-2^{n-1}, -1]$ ont pour image $[2^{n-1}, 2^n - 1]$ : $R$ est
   injective (deux valeurs distinctes de l'intervalle diffèrent de moins de $2^n$, donc ne sont pas congrues), entre deux
   ensembles de $2^n$ éléments : c'est une bijection.
2. $R(a) + R(b) \equiv a + b \pmod{2^n}$, et comme $a + b$ est dans l'intervalle, $R(a + b) \equiv a + b$ avec
   $R(a + b) \in [0, 2^n - 1]$. Donc $R(a + b)$ est le reste de $R(a) + R(b)$ modulo $2^n$ : c'est exactement ce que calcule
   un additionneur de $n$ bits qui ignore la retenue sortante.
3. Pour tout mot $m$ de $n$ bits, $m + \text{inverse}(m) = 11\dots1_2 = 2^n - 1$ (chaque position contient un 0 et un 1, sans
   retenue). Donc $\text{inverse}(R(x)) + 1 = 2^n - R(x)$. Pour $0 < x \le 2^{n-1}$, $R(x) = x$ et $2^n - x = R(-x)$ : on obtient
   bien la représentation de $-x$.
4. Si $a \ge 0$ et $b < 0$, alors $b \le a + b < a$ (puisque $b < 0 \le a$). Or $a$ et $b$ sont dans l'intervalle
   $[-2^{n-1}, 2^{n-1} - 1]$ : $a + b$, compris entre $b$ et $a$, y est aussi. Le dépassement est impossible.
:::
::::
