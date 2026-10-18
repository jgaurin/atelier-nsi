---
titre: Booléens, caractères et texte
resume: Coder des valeurs de vérité et du texte — ASCII, ISO-8859-1, Unicode et l'encodage UTF-8 — et comprendre les problèmes d'accents mal affichés.
duree: 60
objectifs:
  - Représenter un booléen et utiliser l'algèbre de Boole sur des bits
  - Expliquer la différence entre un jeu de caractères (ASCII, Unicode) et un encodage (UTF-8)
  - Encoder et décoder un caractère en UTF-8 (nombre d'octets, motif des octets)
  - Diagnostiquer un problème d'encodage (« mojibake ») et le corriger en Python
prerequis: [representation/bases, python/chaines]
programme: [id-types-simples, id-codage, nsi1-base]
cartes:
  - q: Combien de caractères code l'ASCII ? Sur combien de bits ?
    r: "128 caractères (0 à 127), sur 7 bits (stockés dans un octet dont le bit de poids fort vaut 0)."
  - q: Différence entre Unicode et UTF-8 ?
    r: "Unicode attribue un numéro (point de code, noté U+XXXX) à chaque caractère ; UTF-8 est une façon d'écrire ces numéros en octets (1 à 4 octets)."
  - q: Combien d'octets prend « é » (U+00E9) en UTF-8 ? Et « € » (U+20AC) ?
    r: "« é » : 2 octets (C3 A9). « € » : 3 octets (E2 82 AC)."
  - q: Pourquoi UTF-8 est-il compatible avec l'ASCII ?
    r: "Les caractères ASCII (0 à 127) s'écrivent sur un seul octet identique au code ASCII : un texte ASCII est déjà un texte UTF-8 valide."
  - q: Que s'est-il passé quand « é » s'affiche « Ã© » ?
    r: "Le texte, encodé en UTF-8 (C3 A9), a été décodé comme du Latin-1 (ISO-8859-1), où C3 = « Ã » et A9 = « © »."
  - q: Que font `str.encode` et `bytes.decode` ?
    r: "`\"é\".encode(\"utf-8\")` donne les octets `b'\\xc3\\xa9'` ; `b'\\xc3\\xa9'.decode(\"utf-8\")` redonne `\"é\"`."
---

Un texte dans un ordinateur n'est qu'une suite d'octets. Pour qu'un « é » écrit sur un ordinateur s'affiche « é » sur un autre,
il faut s'accorder sur un **code** : quel nombre pour quel caractère, et comment écrire ce nombre en octets. Pendant des
décennies, chaque pays et chaque système a eu son code, d'où les fameux « Ã© » à la place des accents. Aujourd'hui, **Unicode**
et son encodage **UTF-8** (98 % des pages Web) ont presque réglé le problème — à condition de savoir ce qu'on manipule.

## 1. Les booléens

Un booléen ne prend que deux valeurs, Vrai et Faux : un **seul bit** suffit (1 pour vrai, 0 pour faux). En pratique, les
langages le stockent souvent dans un octet entier (le plus petit élément adressable en mémoire). En Python, `True` et `False`
se comportent comme les entiers 1 et 0 :

```python exec
print(True + True, int(False), sum([True, False, True]))   # compter les « vrais »
print(bool(0), bool(42), bool(""), bool("a"))
print(True & False, True | False, True ^ True)               # opérations sur des bits
```

Les opérations booléennes (ET, OU, NON, OU exclusif) sur des bits sont la base des **circuits** du processeur (module
architecture) ; leurs lois (De Morgan…) sont étudiées dans la leçon de logique.

## 2. Un code pour chaque caractère : l'ASCII

L'**ASCII** (*American Standard Code for Information Interchange*, 1963) associe un nombre de **0 à 127** (7 bits) à 128
caractères : lettres latines non accentuées, chiffres, ponctuation, et 33 caractères de **contrôle** (retour à la ligne,
tabulation…).

| caractère | code (décimal) | hexa | binaire |
|-----------|----------------|------|---------|
| `0`       | 48             | 30   | 0110000 |
| `A`       | 65             | 41   | 1000001 |
| `a`       | 97             | 61   | 1100001 |
| espace    | 32             | 20   | 0100000 |
| `\n` (saut de ligne) | 10  | 0A   | 0001010 |

Remarques utiles : les chiffres, les majuscules et les minuscules sont **consécutifs** ; une minuscule a le code de la majuscule
**plus 32** (un seul bit diffère : `A` = 1000001, `a` = 1100001).

L'ASCII ne contient **aucun** accent. Des extensions sur 8 bits (256 caractères) sont apparues, différentes selon les langues :
**ISO-8859-1** (« Latin-1 ») pour l'Europe de l'Ouest, puis ISO-8859-15 (avec €), Windows-1252… Un même octet `E9` est « é »
en Latin-1 mais « щ » dans un code cyrillique : sans savoir quel code a servi, on ne peut pas lire un texte.

## 3. Unicode : un numéro pour tous les caractères

**Unicode** attribue un numéro unique, le **point de code** (noté `U+` suivi de chiffres hexadécimaux), à chaque caractère de
toutes les écritures du monde, plus de nombreux symboles et émojis : plus de 150 000 caractères, de `U+0000` à `U+10FFFF`.
Les 128 premiers sont ceux de l'ASCII, les 256 premiers ceux de Latin-1.

```python exec
for c in "Aé€π😀":
    print(c, ord(c), f"U+{ord(c):04X}")
print(chr(0x263A), "é", "\N{GREEK SMALL LETTER PI}")
```

:::definition
- Un **jeu de caractères** (ASCII, Unicode) associe un **numéro** à chaque caractère.
- Un **encodage** (ASCII, Latin-1, UTF-8, UTF-16) dit comment écrire ces numéros sous forme d'**octets**.

Unicode est un jeu de caractères ; UTF-8 est l'encodage d'Unicode le plus utilisé.
:::

## 4. L'encodage UTF-8

Écrire chaque point de code sur 4 octets fixes (UTF-32) serait simple mais gaspillerait la place (un texte français ou anglais
serait 4 fois plus gros). **UTF-8** utilise de **1 à 4 octets** selon le point de code :

| points de code         | octets | motif binaire                                   |
|------------------------|--------|-------------------------------------------------|
| U+0000 à U+007F        | 1      | `0xxxxxxx`                                      |
| U+0080 à U+07FF        | 2      | `110xxxxx 10xxxxxx`                             |
| U+0800 à U+FFFF        | 3      | `1110xxxx 10xxxxxx 10xxxxxx`                    |
| U+10000 à U+10FFFF     | 4      | `11110xxx 10xxxxxx 10xxxxxx 10xxxxxx`           |

Les `x` reçoivent les bits du point de code, de gauche à droite.

**Exemple : « é » = U+00E9.** $\text{E9}_{16} = 1110\,1001_2$ ; il faut 2 octets (11 bits disponibles) :
on écrit le code sur 11 bits `000 1110 1001`, réparti en `00011` et `101001` : `110 00011` `10 101001` = `C3 A9`.

```python exec
for c in "Aé€😀":
    octets = c.encode("utf-8")
    print(c, len(octets), "octet(s) :", octets.hex(" ").upper(), [format(o, "08b") for o in octets])
```

Propriétés qui expliquent son succès :
- **compatible ASCII** : un texte ASCII est un texte UTF-8 ;
- **auto-synchronisant** : un octet de début de caractère (`0…` ou `11…`) se distingue d'un octet de continuation (`10…`) ;
  après une erreur, on retrouve le début du caractère suivant ;
- économe pour les langues à alphabet latin.

## 5. Les erreurs d'encodage

Le **mojibake** (« caractères transformés ») apparaît quand on décode des octets avec un autre encodage que celui qui a servi
à les écrire :

```python exec
texte = "Été à Noël"
octets = texte.encode("utf-8")
print(octets)
print(octets.decode("latin-1"))        # mauvais décodage : chaque octet lu comme un caractère Latin-1
print(octets.decode("utf-8"))          # bon décodage
try:
    "é".encode("latin-1").decode("utf-8")
except UnicodeDecodeError as e:
    print("erreur :", e)
```

`Ã©` à la place de `é` : du **UTF-8 lu comme du Latin-1**. Un `?` ou un `�` : un caractère qui n'existe pas dans l'encodage
choisi. La règle : **préciser toujours l'encodage** (`open(nom, encoding="utf-8")`, balise `<meta charset="utf-8">` en HTML).

:::prof
Le programme de première demande de « connaître l'existence des différents encodages (ASCII, ISO-8859-1, Unicode) » et
d'« identifier l'intérêt des différents systèmes d'encodage ». Le mojibake est un excellent point de départ (tout le monde en a
déjà vu) ; faire encoder son prénom en UTF-8 à la main, puis vérifier en Python, fixe les idées. Attention au vocabulaire : on
confond souvent « Unicode » et « UTF-8 ».
:::

## Exemple guidé

**Problème.** Encoder à la main en UTF-8 le caractère « € » (U+20AC), puis vérifier, et calculer la taille en octets du mot
« Noël 2€ » en UTF-8 et en UTF-32.

**1. Nombre d'octets.** $\text{20AC}_{16} = 8364$ est entre U+0800 et U+FFFF : **3 octets**, motif
`1110xxxx 10xxxxxx 10xxxxxx` (16 bits utiles).

**2. Bits du point de code sur 16 bits.** $2 = 0010$, $0 = 0000$, $A = 1010$, $C = 1100$ : `0010 0000 1010 1100`.

**3. Répartition.** 4 + 6 + 6 bits : `0010` | `000010` | `101100`.

**4. Octets.** `1110 0010` = E2, `10 000010` = 82, `10 101100` = AC : **E2 82 AC**.

```python exec
print("€".encode("utf-8").hex(" ").upper())
mot = "Noël 2€"
print(len(mot), "caractères,", len(mot.encode("utf-8")), "octets en UTF-8,", len(mot.encode("utf-32-be")), "en UTF-32")
```

**5. Taille.** « N », « o », « l », espace, « 2 » : 1 octet chacun (5) ; « ë » : 2 ; « € » : 3 ; total **10 octets** en UTF-8,
contre $7 \times 4 = 28$ en UTF-32. Attention : `len` d'une chaîne Python compte des **caractères** (7), pas des octets.

## L'essentiel

- Booléen : un bit (en pratique souvent un octet) ; en Python `True`/`False` valent 1 et 0.
- ASCII : 128 caractères sur 7 bits, sans accents ; extensions 8 bits (Latin-1…) incompatibles entre elles.
- Unicode : un **point de code** U+XXXX par caractère (plus de 150 000) ; UTF-8 : **encodage** sur 1 à 4 octets, compatible ASCII.
- Motifs UTF-8 : `0xxxxxxx`, `110xxxxx 10xxxxxx`, `1110xxxx 10xxxxxx 10xxxxxx`, `11110xxx …`.
- « é » = C3 A9 ; « € » = E2 82 AC. Mojibake « Ã© » = UTF-8 décodé en Latin-1.
- Python : `ord`, `chr`, `str.encode(enc)`, `bytes.decode(enc)` ; toujours préciser `encoding="utf-8"`.

## Exercices

::::exercice[Codes ASCII]{niveau=1}
Le code ASCII de `A` est 65. Quel est le code de `d` ?

- [ ] 68
- [x] 100
- [ ] 99
- [ ] 132

:::corrige
`D` a le code 68 (65 + 3) ; la minuscule a 32 de plus : $68 + 32 = 100$.
:::
::::

::::exercice[Taille en UTF-8]{niveau=1}
Combien d'octets occupe la chaîne « café » encodée en UTF-8 ?

- [ ] 4
- [x] 5
- [ ] 8
- [ ] 16

:::corrige
« c », « a », « f » : 1 octet chacun ; « é » (U+00E9) : 2 octets. Total : 5 octets, pour 4 caractères.
:::
::::

::::exercice[Reconnaître le mojibake]{niveau=1}
Un fichier affiche « Ã  bientÃ´t ». Quelle est l'explication la plus probable ?

- [ ] le fichier est corrompu
- [x] le texte a été écrit en UTF-8 et lu comme du Latin-1 (ou Windows-1252)
- [ ] le texte a été écrit en Latin-1 et lu comme de l'UTF-8
- [ ] la police ne contient pas les accents

:::corrige
Chaque caractère accentué (2 octets en UTF-8) est affiché comme deux caractères Latin-1 : `Ã ` puis `Ã´`. Dans le cas inverse
(Latin-1 lu en UTF-8), on obtiendrait des `�` ou une erreur de décodage.
:::
::::

::::exercice[Nombre d'octets UTF-8]{niveau=2}
Écris `nb_octets_utf8(c)` qui renvoie le nombre d'octets nécessaires pour encoder le caractère `c` en UTF-8, à partir de son
point de code (`ord`), **sans** utiliser `encode`.

```python depart
def nb_octets_utf8(c):
    ...
```

```python tests
assert nb_octets_utf8("A") == 1, "ASCII"
assert nb_octets_utf8("é") == 2, "é"
assert nb_octets_utf8("€") == 3, "euro"
assert nb_octets_utf8("😀") == 4, "émoji"
assert nb_octets_utf8("߿") == 2 and nb_octets_utf8("ࠀ") == 3, "bornes"
```

:::corrige
```python solution
def nb_octets_utf8(c):
    p = ord(c)
    if p < 0x80:
        return 1
    if p < 0x800:
        return 2
    if p < 0x10000:
        return 3
    return 4
```
Les bornes viennent du nombre de bits disponibles : 7, 11 ($5 + 6$), 16 ($4 + 6 + 6$) et 21 ($3 + 6 \times 3$).
:::
::::

::::exercice[Encoder en UTF-8 à la main]{niveau=3}
Écris `utf8(c)` qui renvoie la liste des octets (entiers) de l'encodage UTF-8 du caractère `c`, en appliquant les motifs avec
des décalages (`>>`) et des masques (`&`), **sans** utiliser `encode`.

```python depart
def utf8(c):
    ...
```

```python tests
assert utf8("A") == [0x41], "1 octet"
assert utf8("é") == [0xC3, 0xA9], "2 octets"
assert utf8("€") == [0xE2, 0x82, 0xAC], "3 octets"
assert utf8("😀") == list("😀".encode("utf-8")), "4 octets"
assert all(utf8(chr(p)) == list(chr(p).encode("utf-8")) for p in range(0, 0x3000, 7)), "comparaison avec encode"
```

:::corrige
```python solution
def utf8(c):
    p = ord(c)
    if p < 0x80:
        return [p]
    if p < 0x800:
        return [0b11000000 | (p >> 6), 0b10000000 | (p & 0b111111)]
    if p < 0x10000:
        return [0b11100000 | (p >> 12),
                0b10000000 | ((p >> 6) & 0b111111),
                0b10000000 | (p & 0b111111)]
    return [0b11110000 | (p >> 18),
            0b10000000 | ((p >> 12) & 0b111111),
            0b10000000 | ((p >> 6) & 0b111111),
            0b10000000 | (p & 0b111111)]
```
`p & 0b111111` extrait les 6 bits de poids faible ; `>> 6` les « consomme » ; le `|` pose le motif `10` ou `110`… en tête.
(Les points de code U+D800 à U+DFFF, réservés à UTF-16, ne sont pas des caractères : `encode` les refuse, le test les évite.)
:::
::::

::::exercice[Décoder un flux d'octets]{niveau=4 duree=25}
On reçoit la suite d'octets (hexadécimal) `4E 6F C3 AB 6C 20 E2 82 AC`.

1. Décode-la à la main en UTF-8 : pour chaque caractère, indique les octets, le motif reconnu, le point de code et le caractère.
2. Que donnerait le même flux décodé en Latin-1 ? Combien de caractères ?
3. Un octet a été perdu pendant la transmission : on reçoit `4E 6F AB 6C 20 E2 82 AC`. Explique comment un décodeur UTF-8
   détecte l'erreur et comment il peut reprendre le décodage au caractère suivant (propriété d'auto-synchronisation).
4. Explique pourquoi on ne peut pas savoir, en ne regardant que les octets, si un fichier est en Latin-1 ou en Windows-1252, alors
   qu'on peut souvent détecter qu'il n'est **pas** en UTF-8.

:::criteres
- Q1 : `4E` = N, `6F` = o, `C3 AB` (110xxxxx 10xxxxxx) = U+00EB = ë, `6C` = l, `20` = espace, `E2 82 AC` (3 octets) = U+20AC = € ; texte « Noël € ».
- Q2 : en Latin-1, chaque octet est un caractère : 9 caractères, « NoÃ«l â‚¬ » (les octets 82 et AC correspondent à un caractère de contrôle et à « ¬ » en Latin-1 strict).
- Q3 : l'octet `AB` (10101011) est un octet de continuation qui ne suit pas un octet de début : erreur détectée ; on saute les octets de la forme 10xxxxxx jusqu'au prochain octet qui commence par 0 ou 11, où le décodage reprend (ici `6C`).
- Q4 : en Latin-1 et Windows-1252, toute suite d'octets est valide (un octet = un caractère), donc rien ne permet de les distinguer ; UTF-8 impose une structure (octets de continuation après un octet de début), qu'un texte non UTF-8 contenant des octets ≥ 0x80 respecte rarement.
:::

:::corrige
1. | octets     | motif                        | point de code | caractère |
   |------------|------------------------------|---------------|-----------|
   | `4E`       | `0xxxxxxx`                   | U+004E        | N         |
   | `6F`       | `0xxxxxxx`                   | U+006F        | o         |
   | `C3 AB`    | `110 00011` `10 101011`      | $00011\,101011_2$ = U+00EB | ë |
   | `6C`       | `0xxxxxxx`                   | U+006C        | l         |
   | `20`       | `0xxxxxxx`                   | U+0020        | espace    |
   | `E2 82 AC` | `1110 0010` `10 000010` `10 101100` | U+20AC | €         |

   Texte : « Noël € » (6 caractères, 9 octets).
2. En Latin-1, chaque octet est un caractère : 9 caractères. `C3` = « Ã », `AB` = « « », `E2` = « â » ; `82` est un caractère de
   contrôle (invisible) en Latin-1 strict (« ‚ » en Windows-1252) et `AC` = « ¬ ». On lit quelque chose comme « NoÃ«l â¬ ».
3. Après `6F`, le décodeur lit `AB` = `10101011` : c'est un octet de **continuation** (motif `10xxxxxx`), qui ne peut pas commencer
   un caractère. L'erreur est détectée immédiatement (Python lève `UnicodeDecodeError`, ou remplace par `�` avec
   `errors="replace"`). Pour reprendre, il suffit d'avancer jusqu'au prochain octet qui **commence un caractère** (`0xxxxxxx` ou
   `11xxxxxx`), ici `6C` : seul le caractère abîmé est perdu, la suite « l € » est correctement décodée.
4. En Latin-1 comme en Windows-1252, **toute** suite d'octets est valide (un octet = un caractère) ; ils ne diffèrent que par
   l'interprétation de quelques octets (0x80 à 0x9F) : les octets seuls ne permettent pas de trancher (on ne peut que deviner
   d'après le sens). UTF-8, au contraire, impose des contraintes fortes (chaque octet ≥ 0x80 doit faire partie d'une séquence
   bien formée) : un texte Latin-1 qui contient des accents les viole presque toujours, ce qui permet de détecter qu'il n'est pas en
   UTF-8.
:::
::::
