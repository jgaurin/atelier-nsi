---
titre: Représenter du texte
resume: "Les encodages ASCII, ISO-8859-1 et Unicode, et pourquoi des caractères s'affichent parfois mal."
duree: 30
objectifs:
  - "Expliquer le rôle d'un encodage"
  - "Comparer ASCII, ISO-8859-1 et Unicode"
  - "Convertir un fichier texte dans un autre encodage"
prerequis: [premiere-donnees/bases]
---

Un ordinateur ne stocke que des nombres. Pour stocker du texte, on associe un nombre à chaque caractère : c'est un **encodage**.

## 1. ASCII

L'**ASCII** (1963) code 128 caractères sur **7 bits** : les lettres sans accent, les chiffres, la ponctuation.

| Caractère | `A` | `B` | `a` | `0` | espace |
| --- | --- | --- | --- | --- | --- |
| Code | 65 | 66 | 97 | 48 | 32 |

Mais l'ASCII ne contient **ni accents ni autres alphabets**.

## 2. ISO-8859-1

L'**ISO-8859-1** (ou Latin-1) utilise **8 bits**, soit 256 caractères. Il ajoute les lettres accentuées de l'Europe de l'Ouest, comme `é`. Il reste limité : pas d'alphabets grec, arabe ou chinois, par exemple.

## 3. Unicode et UTF-8

**Unicode** donne un numéro à **tous les caractères** du monde, y compris les émojis. **UTF-8** est sa façon la plus courante de les stocker, sur **1 à 4 octets** :

- les caractères ASCII prennent 1 octet ;
- `é` prend 2 octets ;
- `€` prend 3 octets.

C'est l'encodage presque universel du Web.

## 4. Quand ça s'affiche mal

Si un fichier est écrit dans un encodage et lu dans un autre, on voit apparaître des caractères incorrects : `é` s'affiche `Ã©`.

Pour **convertir un fichier**, on l'ouvre dans un éditeur de texte avec son encodage d'origine, puis on l'enregistre en choisissant un autre encodage.

En Python, `ord("A")` donne 65, le numéro d'un caractère, et `chr(65)` donne `"A"`.

## L'essentiel

- Un **encodage** associe des nombres aux caractères.
- **ASCII** : 7 bits, sans accents. **ISO-8859-1** : 8 bits, avec les accents d'Europe de l'Ouest.
- **Unicode** couvre tous les caractères ; **UTF-8** les stocke sur 1 à 4 octets.
- Lire un fichier avec le mauvais encodage donne des caractères incorrects.

## Exercices

::::exercice[QCM : encodage du texte]{niveau=1 type=quiz}
Une question à la fois : la correction s'affiche aussitôt.

1. Combien de caractères compte la table ASCII ?

   - [ ] 26
   - [x] 128
   - [ ] 256
   - [ ] plus de 150 000

   > Codes 0 à 127, sur 7 bits.

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

1. Un texte affiche « Ã© » au lieu de « é ». Quelle est la cause ?

   - [ ] le fichier est corrompu
   - [x] un texte encodé en UTF-8 a été lu comme de l'ISO-8859-1
   - [ ] le clavier est mal configuré
   - [ ] l'écran est trop petit

   > Les deux octets de « é » sont lus comme deux caractères.
::::

::::exercice[Quel encodage ?]{niveau=1 type=associer}
Associe chaque description à l'encodage correspondant.

| Description | Encodage |
| --- | --- |
| 128 caractères sur 7 bits, sans accents | ASCII |
| 256 caractères sur 8 bits, avec `é` mais sans alphabet chinois | ISO-8859-1 |
| 1 à 4 octets par caractère, tous les alphabets | UTF-8 |
::::

::::exercice[Codes et tailles]{niveau=1 type=reponses}
On rappelle que `A` a pour code 65 et `a` a pour code 97.

1. Quel est le code ASCII de `D` ?

   ```python calcul
   print(ord("D"))
   ```

   - 68

1. Quel caractère a pour code 99 ?

   ```python calcul
   print(chr(99))
   ```

   - c

1. Combien d'octets occupe le mot `chat` en UTF-8 ?

   ```python calcul
   print(len("chat".encode("utf-8")))
   ```

   - 4

1. Combien d'octets occupe le mot `été` en UTF-8 ?

   ```python calcul
   print(len("été".encode("utf-8")))
   ```

   - 5

   > Deux `é` de 2 octets, plus un `t` de 1 octet.

1. Combien d'octets occupe le mot `été` en ISO-8859-1 ?

   ```python calcul
   print(len("été".encode("latin-1")))
   ```

   - 3
::::

::::exercice[Un fichier illisible]{niveau=2}
Une élève ouvre un fichier CSV et lit `PrÃ©nom` au lieu de `Prénom`. Explique ce qui s'est passé et ce qu'elle doit faire.

:::criteres
- Le fichier a été écrit dans un encodage (ici UTF-8) et lu dans un autre (ici ISO-8859-1).
- Le `é`, codé sur deux octets, est lu comme deux caractères.
- Il faut ouvrir le fichier en indiquant le bon encodage, ou le convertir.
:::

:::corrige
Le fichier a été enregistré en UTF-8, où `é` occupe deux octets, mais il est lu comme de l'ISO-8859-1, où chaque octet est un caractère. Les deux octets s'affichent donc comme `Ã` et `©`. Elle doit ouvrir le fichier en indiquant l'encodage UTF-8, ou le convertir.
:::
::::

::::exercice[Convertir un fichier]{niveau=3 type=reponses}
Un fichier contient 1 000 caractères : 900 caractères ASCII et 100 lettres accentuées comme `é`.

1. Combien d'octets occupe-t-il en ISO-8859-1 ?

   ```python calcul
   print(1000)
   ```

   - 1000
   - 1 000

1. Combien d'octets occupe-t-il en UTF-8 ?

   ```python calcul
   print(900 + 100 * 2)
   ```

   - 1100
   - 1 100

1. On ajoute 20 fois le symbole `€`, qui n'existe pas en ISO-8859-1. Combien d'octets occupe alors le fichier en UTF-8 ?

   ```python calcul
   print(1100 + 20 * 3)
   ```

   - 1160
   - 1 160

1. Un fichier encodé en ASCII peut-il être lu sans erreur comme de l'UTF-8 ? Réponds par oui ou par non.

   - oui

   > UTF-8 code les caractères ASCII sur un octet, avec les mêmes valeurs.

1. Un mot en UTF-8 est lu par erreur en ISO-8859-1. Chaque `é` s'affiche sur combien de caractères ?

   - 2

   > Les deux octets de `é` sont lus comme deux caractères.

1. On veut écrire un texte en japonais. Lequel de ces encodages convient : ASCII, ISO-8859-1 ou UTF-8 ?

   - UTF-8
::::
