---
titre: Photosites, pixels et résolution
resume: "Du capteur à l'image : photosites, pixels, définition et poids d'un fichier."
duree: 30
objectifs:
  - "Distinguer les photosites du capteur et les pixels de l'image"
  - "Comparer les résolutions du capteur et de l'image"
  - "Comprendre la profondeur de couleur"
---

Un téléphone actuel prend des photos d'une qualité qui demandait autrefois un appareil professionnel. Ce progrès vient surtout des **calculs** faits sur l'image. Pour les comprendre, il faut savoir de quoi une photo numérique est faite.

:::histoire
1826 : première photographie. 1969 : premiers capteurs CCD. 1975 : premiers appareils numériques. 2007 : arrivée du smartphone.
:::

## 1. Du capteur à l'image

Le **capteur** de l'appareil est une grille de minuscules cellules sensibles à la lumière, les **photosites**. Chaque photosite ne mesure qu'**une seule couleur**, grâce à un petit filtre. Ils sont groupés par quatre : **deux verts, un rouge, un bleu**, car notre œil est plus sensible au vert.

L'**image** finale est faite de **pixels**. Chaque pixel a **trois** valeurs : rouge, vert, bleu, notées **RVB**. Un calcul reconstruit ces trois valeurs à partir des photosites voisins.

Photosites et pixels ne sont donc pas la même chose, et leur nombre peut être différent : un appareil de 24 millions de photosites peut produire des images de 6 millions de pixels si on le règle ainsi.

## 2. La définition d'une image

Le nombre de pixels se calcule comme l'aire d'un rectangle :

**nombre de pixels = largeur × hauteur**

:::exemple
Une image de 4 000 × 3 000 contient 4 000 × 3 000 = 12 000 000 pixels, soit **12 mégapixels**. Un mégapixel vaut un million de pixels.
:::

## 3. La profondeur de couleur

Chaque couleur d'un pixel est codée en général sur **8 bits**, soit 256 niveaux, de 0 (pas du tout) à 255 (au maximum).

| R, V, B | Couleur obtenue |
| --- | --- |
| 255, 0, 0 | rouge |
| 0, 255, 0 | vert |
| 0, 0, 255 | bleu |
| 255, 255, 0 | jaune : rouge + vert |
| 255, 255, 255 | blanc : tout au maximum |
| 0, 0, 0 | noir : tout éteint |

Un pixel occupe donc 3 × 8 = 24 bits, soit **3 octets**. Cela permet 256 × 256 × 256, plus de 16 millions de couleurs.

## 4. La taille d'un fichier

Sans compression, **taille en octets = nombre de pixels × 3**.

:::exemple
Une image de 12 mégapixels occupe 12 000 000 × 3 = 36 000 000 octets, soit 36 Mo.
:::

C'est beaucoup : on **compresse** donc les images.

| Format | Compression |
| --- | --- |
| RAW | aucune : les données brutes du capteur, idéales pour la retouche |
| BMP | aucune |
| TIFF | souvent sans perte : on retrouve exactement l'image |
| JPEG | avec perte : des détails peu visibles sont supprimés, et le fichier est bien plus léger |

## L'essentiel

- Photosites : sur le capteur, une couleur chacun. Pixels : dans l'image, trois valeurs RVB.
- Nombre de pixels = largeur × hauteur ; 1 mégapixel = 1 million de pixels.
- 8 bits par couleur, donc 3 octets par pixel et plus de 16 millions de couleurs.
- Sans compression : taille = pixels × 3 octets. JPEG compresse avec perte.

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
