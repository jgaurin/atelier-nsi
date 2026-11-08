---
titre: Photosites, pixels et résolution
resume: "Du capteur à l'image : photosites, pixels, définition et poids d'un fichier."
duree: 30
objectifs:
  - "Distinguer les photosites du capteur et les pixels de l'image"
  - "Comparer les résolutions du capteur et de l'image"
  - "Comprendre la profondeur de couleur"
---

La photographie numérique doit désormais plus aux algorithmes qu'à l'optique.

## 1. Du capteur à l'image

Le **capteur** est une matrice de **photosites**, groupés par quatre : **deux verts, un bleu, un rouge**. Chacun mesure l'intensité d'une seule couleur.

L'**image** est faite de **pixels**. Chacun a trois valeurs : rouge, vert, bleu (**RVB**). Un calcul reconstruit ces trois valeurs à partir des photosites.

La résolution du capteur se compte en millions de photosites. Celle de l'image se compte en **mégapixels** (millions de pixels). Elles ne sont pas forcément égales.

## 2. Compter les pixels

**Nombre de pixels = largeur × hauteur.**

:::exemple
Une image de 4 000 × 3 000 contient 12 000 000 de pixels, soit **12 mégapixels**.
:::

## 3. La profondeur de couleur

En général, chaque couleur est codée sur **8 bits** : 256 niveaux, de 0 à 255. Un pixel occupe donc 3 octets, ce qui donne plus de 16 millions de couleurs.

| R, V, B | Couleur |
| --- | --- |
| 255, 0, 0 | rouge |
| 0, 255, 0 | vert |
| 0, 0, 255 | bleu |
| 255, 255, 255 | blanc |
| 0, 0, 0 | noir |

## 4. Les formats

| Format | Compression |
| --- | --- |
| RAW | données brutes du capteur |
| BMP | sans compression |
| TIFF | souvent sans perte |
| JPEG | avec perte |

Sans compression, **taille en octets = nombre de pixels × 3**.

:::histoire
1826 : première photographie. 1969 : premiers capteurs CCD. 1975 : premiers appareils numériques. 2007 : arrivée du smartphone.
:::

## L'essentiel

- Photosites : sur le capteur, une couleur chacun. Pixels : dans l'image, trois valeurs RVB.
- Pixels = largeur × hauteur.
- 8 bits par couleur, soit 3 octets par pixel.
- JPEG compresse avec perte.

## Exercices

::::exercice[Photosite ou pixel ?]{niveau=1 type=associer}
Associe chaque description au bon mot.

| Description | Mot |
| --- | --- |
| Mesure une seule couleur sur le capteur | photosite |
| Possède trois valeurs dans l'image | pixel |
| Million de pixels | mégapixel |
::::

::::exercice[Quelle couleur ?]{niveau=1 type=reponses}
Réponds à chaque question.

1. Combien de niveaux une couleur codée sur 8 bits a-t-elle ?

   ```python calcul
   print(2 ** 8)
   ```

   - 256

1. Quelle couleur, en un mot, correspond à (255, 255, 255) ?

   - blanc

1. Quelle couleur, en un mot, correspond à (0, 0, 0) ?

   - noir

1. Dans un groupe de quatre photosites, combien sont verts ?

   - 2
::::

::::exercice[Calculer]{niveau=2 type=completer}
Complète, pour des images non compressées.

```python calcul
print(2000 * 1000)
print(2000 * 1000 * 3)
print(4000 * 3000)
print(4000 * 3000 * 3)
```

| Dimensions | Pixels | Taille, en octets |
| --- | --- | --- |
| 2 000 × 1 000 | [[2000000;2 000 000]] | [[6000000;6 000 000]] |
| 4 000 × 3 000 | [[12000000;12 000 000]] | [[36000000;36 000 000]] |
::::

::::exercice[Choisir un réglage]{niveau=3 type=reponses}
Un appareil a un capteur de 24 millions de photosites. On l'a réglé pour produire des images de 3 000 × 2 000 pixels.

1. Combien de pixels contient une image, en millions ?

   ```python calcul
   print(3000 * 2000 // 1000000)
   ```

   - 6

1. La résolution de l'image est-elle égale à celle du capteur ? Réponds par oui ou par non.

   - non

1. Combien d'octets occupe une image non compressée ?

   ```python calcul
   print(3000 * 2000 * 3)
   ```

   - 18000000
   - 18 000 000

1. Le JPEG réduit cette taille par 10. Combien de Mo occupe alors l'image ? (1 Mo = 1 million d'octets.)

   ```python calcul
   print(str(3000 * 2000 * 3 / 10 / 1000000).replace(".0", ""))
   ```

   - 1.8
   - 1,8

1. Combien de ces images en JPEG peut-on stocker au maximum sur une carte de 32 000 Mo ?

   ```python calcul
   print(int(32000 // 1.8))
   ```

   - 17777
   - 17 777

1. On veut pouvoir retoucher finement une photo. Quel format conserve les données brutes du capteur ?

   - RAW
::::
