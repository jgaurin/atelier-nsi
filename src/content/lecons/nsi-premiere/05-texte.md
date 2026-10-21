---
titre: "Encodage du texte : ASCII, Unicode, UTF-8"
resume: "Le cours de première NSI sur la représentation du texte : un caractère est un nombre, la table ASCII, les encodages sur un octet (ISO-8859-1), Unicode et UTF-8, les problèmes d'accents mal décodés, et ord/chr/encode en Python."
duree: 40
objectifs:
  - "Expliquer qu'un texte est stocké comme une suite de nombres selon un encodage"
  - "Connaître ASCII, ISO-8859-1 et Unicode/UTF-8 et l'intérêt de chacun"
  - "Expliquer l'origine des caractères mal affichés (é qui devient Ã©)"
  - "Utiliser ord, chr, encode et decode en Python"
prerequis: [nsi-premiere/entiers-bases]
programme: [nsi1-base]
cartes:
  - q: "Qu'est-ce que l'ASCII ?"
    r: "Une table de **128 caractères** (codes 0 à 127, sur 7 bits) : lettres sans accents, chiffres, ponctuation, caractères de contrôle. « A » = 65, « a » = 97, « 0 » = 48."
  - q: "Pourquoi l'ASCII ne suffit-il pas ?"
    r: "Il ne contient **aucune lettre accentuée** ni les autres alphabets (grec, arabe, chinois…), ni les emojis."
  - q: "Qu'est-ce qu'Unicode ?"
    r: "Un catalogue universel qui attribue un numéro (**point de code**) à chaque caractère de toutes les écritures : é = U+00E9, € = U+20AC. Plus de 150 000 caractères."
  - q: "Qu'est-ce que UTF-8 ?"
    r: "Une façon d'écrire les points de code Unicode en octets, sur **1 à 4 octets** selon le caractère ; les caractères ASCII gardent le même octet (compatibilité). C'est l'encodage du Web."
  - q: "Pourquoi voit-on « Ã© » au lieu de « é » ?"
    r: "Le texte a été **encodé en UTF-8** (é = 2 octets C3 A9) puis **lu comme de l'ISO-8859-1**, où C3 = Ã et A9 = ©."
  - q: "`ord` et `chr` en Python ?"
    r: "`ord('A')` donne le point de code 65 ; `chr(65)` donne 'A'."
---

Un ordinateur ne stocke que des nombres. Pour stocker du **texte**, il faut donc une convention qui associe un **nombre** à chaque **caractère** :
c'est un **encodage**. Ce chapitre explique les principaux encodages et pourquoi on voit parfois des « Ã© » à la place des « é ». C'est un sujet
concret, que les élèves ont souvent déjà rencontré.

## Ce que dit le programme

Contenu : *représentation d'un texte en machine ; exemples des encodages ASCII, ISO-8859-1, Unicode*. Capacités attendues : **identifier l'intérêt
des différents systèmes d'encodage** ; **convertir un fichier texte dans différents formats d'encodage**. Commentaire : **aucune connaissance précise
des normes d'encodage n'est exigible**.

## 1. Un caractère est un nombre

Un **encodage** associe à chaque caractère un nombre, lui-même écrit en binaire. Pour lire un texte, il faut connaître l'encodage qui a servi à
l'écrire, exactement comme il faut connaître une langue pour lire un livre.

## 2. L'ASCII (1963)

L'**ASCII** (*American Standard Code for Information Interchange*) code **128 caractères** sur **7 bits** :

| Caractères | Codes |
|---|---|
| caractères de contrôle (retour à la ligne = 10…) | 0 à 31 |
| espace | 32 |
| chiffres « 0 » à « 9 » | 48 à 57 |
| majuscules « A » à « Z » | 65 à 90 |
| minuscules « a » à « z » | 97 à 122 |

Remarques utiles : les lettres se suivent (on passe de « A » à « B » en ajoutant 1), et une minuscule vaut sa majuscule + 32. Mais l'ASCII ne contient
**aucun accent** : il a été conçu pour l'anglais.

```python exec
print(ord("A"), ord("a"), ord("0"), chr(66), chr(ord("c") - 32))
```

## 3. Les encodages sur un octet : ISO-8859-1

Un octet permet 256 valeurs : on a donc utilisé les codes 128 à 255 pour ajouter des caractères. L'**ISO-8859-1** (ou *Latin-1*) ajoute les lettres
accentuées d'Europe de l'Ouest (é, è, à, ç, ñ, ü…). Problème : chaque région avait son propre encodage sur un octet (grec, cyrillique, …), et 256
caractères ne suffisent pas pour le chinois ou le japonais. Un même octet pouvait donc représenter des caractères différents selon l'encodage.

## 4. Unicode et UTF-8

**Unicode** est un **catalogue universel** : il attribue un numéro unique, appelé **point de code**, à **chaque caractère de toutes les écritures du
monde**, y compris les emojis (plus de 150 000 caractères). On les note U+ suivi du numéro en hexadécimal : « A » = U+0041, « é » = U+00E9,
« € » = U+20AC.

Il faut ensuite écrire ces numéros en octets. **UTF-8** est l'encodage le plus utilisé (plus de 98 % des pages web) :

| Caractère | Point de code | Octets en UTF-8 | Nombre d'octets |
|---|---|---|---|
| A | U+0041 | 41 | 1 |
| é | U+00E9 | C3 A9 | 2 |
| € | U+20AC | E2 82 AC | 3 |
| 😀 | U+1F600 | F0 9F 98 80 | 4 |

- Les caractères ASCII gardent **le même octet** : un texte ASCII est déjà un texte UTF-8 valide (compatibilité).
- Les autres caractères prennent **2, 3 ou 4 octets**.

```python exec
for c in "Aé€":
    print(c, ord(c), hex(ord(c)), c.encode("utf-8"), len(c.encode("utf-8")), "octet(s)")
```

## 5. Quand le décodage se trompe

Si un texte est **écrit** en UTF-8 et **lu** comme de l'ISO-8859-1, chaque octet est pris pour un caractère : les deux octets de « é » (C3 et A9)
deviennent « Ã » et « © ». On obtient **« Ã© »** : c'est le célèbre problème des accents mal affichés (*mojibake*).

```python exec
octets = "été".encode("utf-8")
print(octets)
print(octets.decode("latin-1"))      # mauvais décodage
print(octets.decode("utf-8"))        # bon décodage
```

Pour éviter ces problèmes : utiliser **UTF-8 partout**, et l'indiquer (dans une page HTML : `<meta charset="utf-8">` ; en Python :
`open(fichier, encoding="utf-8")`).

## Les erreurs classiques des élèves

:::attention[Ce que tu verras en classe]
- **Croire qu'un caractère occupe toujours un octet** : en UTF-8, « é » en prend deux.
- **Confondre Unicode et UTF-8** : Unicode numérote, UTF-8 écrit ces numéros en octets.
- **Confondre le caractère « 7 » et le nombre 7** : `ord("7")` vaut 55.
- **Penser que le fichier est « abîmé »** quand les accents s'affichent mal : il est simplement lu avec le mauvais encodage.
:::

## En classe

:::methode[Activités qui marchent]
1. **Message codé** : écrire un message en codes ASCII, le faire décoder par le voisin.
2. **Explorer** avec `ord` et `chr` : trouver les régularités (majuscules/minuscules, chiffres).
3. **Provoquer le bug** : enregistrer un fichier en UTF-8 et l'ouvrir en Latin-1 (éditeur de texte qui permet de choisir), puis réparer.
4. **Compter les octets** de textes en français, en grec, avec des emojis.
5. **Chiffre de César** en Python avec `ord` et `chr`.
:::

## L'essentiel

- Un **encodage** associe un nombre à chaque caractère.
- **ASCII** : 128 caractères sur 7 bits, sans accents (A = 65, a = 97, 0 = 48).
- **ISO-8859-1** : 256 caractères sur un octet, avec les accents d'Europe de l'Ouest ; insuffisant pour toutes les langues.
- **Unicode** numérote tous les caractères (points de code U+…) ; **UTF-8** les écrit sur **1 à 4 octets**, compatible ASCII, standard du Web.
- « Ã© » : texte UTF-8 lu en ISO-8859-1. Python : `ord`, `chr`, `encode`, `decode`.

## Exercices

::::exercice[Grand QCM : encodage du texte]{niveau=1 type=quiz}
Onze questions sur l'encodage du texte.

1. Combien de caractères compte la table ASCII ?

   - [ ] 26
   - [x] 128
   - [ ] 256
   - [ ] plus de 150 000

   > Codes 0 à 127, sur 7 bits.

1. Que renvoie `ord("B")` ?

   - [ ] 2
   - [x] 66
   - [ ] 98
   - [ ] "B"

   > « A » vaut 65, les lettres se suivent.

1. Que renvoie `chr(97)` ?

   - [ ] "A"
   - [x] "a"
   - [ ] "97"
   - [ ] une erreur

   > Les minuscules commencent à 97.

1. Pourquoi l'ASCII ne suffit-il pas pour écrire le français ?

   - [ ] il n'a pas de chiffres
   - [x] il ne contient pas les lettres accentuées
   - [ ] il n'a pas de majuscules
   - [ ] il est trop lent

   > Il a été conçu pour l'anglais.

1. Qu'est-ce qu'Unicode ?

   - [ ] un encodage sur un octet
   - [x] un catalogue qui attribue un numéro unique à chaque caractère de toutes les écritures
   - [ ] un logiciel de traitement de texte
   - [ ] un synonyme d'ASCII

   > Unicode numérote ; les encodages comme UTF-8 écrivent ces numéros en octets.

1. Combien d'octets occupe « é » en UTF-8 ?

   - [ ] 1
   - [x] 2
   - [ ] 3
   - [ ] 4

   > C3 A9.

1. Combien d'octets occupe « A » en UTF-8 ?

   - [x] 1
   - [ ] 2
   - [ ] 4
   - [ ] 8

   > Les caractères ASCII gardent leur octet : compatibilité.

1. Un texte affiche « Ã© » au lieu de « é ». Quelle est la cause ?

   - [ ] le fichier est corrompu
   - [x] un texte encodé en UTF-8 a été lu comme de l'ISO-8859-1
   - [ ] le clavier est mal configuré
   - [ ] l'écran est trop petit

   > Les deux octets de « é » sont lus comme deux caractères.

1. Quel est l'encodage le plus utilisé sur le Web ?

   - [ ] ASCII
   - [ ] ISO-8859-1
   - [x] UTF-8
   - [ ] binaire

   > Plus de 98 % des pages web.

1. Que renvoie `ord("7")` ?

   - [ ] 7
   - [x] 55
   - [ ] "7"
   - [ ] 48

   > Le caractère « 7 » n'est pas le nombre 7 : les chiffres commencent à 48.

1. Quelle est la différence entre Unicode et UTF-8 ?

   - [ ] aucune
   - [x] Unicode attribue un numéro à chaque caractère ; UTF-8 est une manière d'écrire ces numéros en octets
   - [ ] UTF-8 est plus ancien qu'Unicode
   - [ ] Unicode ne contient que l'anglais

   > Il existe d'autres encodages d'Unicode, comme UTF-16.
::::

::::exercice[Majuscules sans upper]{niveau=1}
Écris `majuscule(c)` qui renvoie la majuscule d'une lettre minuscule non accentuée `c` (et `c` inchangé si ce n'est pas une minuscule de « a » à « z »),
avec `ord` et `chr`, sans utiliser `upper()`.

```python depart
def majuscule(c):
    ...
```

```python tests
assert majuscule("a") == "A", "a → A"
assert majuscule("z") == "Z", "z → Z"
assert majuscule("Q") == "Q", "déjà majuscule"
assert majuscule("!") == "!", "pas une lettre"
```

:::corrige
```python solution
def majuscule(c):
    if "a" <= c <= "z":
        return chr(ord(c) - 32)
    return c
```

Une minuscule a un code supérieur de 32 à sa majuscule (97 − 65 = 32).
:::
::::

::::exercice[Chiffre de César]{niveau=2}
Le chiffre de César décale chaque lettre de l'alphabet. Écris `cesar(texte, d)` qui décale de `d` positions chaque lettre **majuscule** (de « A » à
« Z », en revenant à « A » après « Z ») et laisse les autres caractères inchangés.

```python depart
def cesar(texte, d):
    ...
```

```python tests
assert cesar("ABC", 1) == "BCD", "décalage de 1"
assert cesar("XYZ", 3) == "ABC", "retour au début de l'alphabet"
assert cesar("SALUT NSI", 13) == "FNYHG AFV", "ROT13"
assert cesar(cesar("BONJOUR", 5), 21) == "BONJOUR", "5 + 21 = 26 : on retrouve le texte"
```

:::indice
Pour une lettre, calcule son rang de 0 à 25 avec `ord(c) - 65`, ajoute `d`, prends le reste de la division par 26, puis reviens à un caractère avec
`chr(… + 65)`.
:::

:::corrige
```python solution
def cesar(texte, d):
    resultat = ""
    for c in texte:
        if "A" <= c <= "Z":
            rang = (ord(c) - 65 + d) % 26
            resultat = resultat + chr(rang + 65)
        else:
            resultat = resultat + c
    return resultat
```
:::
::::

::::exercice[Taille d'un texte en UTF-8]{niveau=1}
Écris `taille_utf8(texte)` qui renvoie le nombre d'**octets** du texte encodé en UTF-8 (à comparer avec son nombre de caractères `len(texte)`).

```python depart
def taille_utf8(texte):
    ...
```

```python tests
assert taille_utf8("Bonjour") == 7, "7 caractères ASCII : 7 octets"
assert taille_utf8("été") == 5, "é prend 2 octets : 2 + 1 + 2"
assert taille_utf8("10 €") == 6, "€ prend 3 octets"
```

:::corrige
```python solution
def taille_utf8(texte):
    return len(texte.encode("utf-8"))
```

`encode` transforme le texte en suite d'octets ; `len` de cette suite compte les octets, pas les caractères.
:::
::::
