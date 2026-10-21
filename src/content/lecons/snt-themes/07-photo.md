---
titre: La photographie numérique
resume: "Le cours de SNT sur la photo numérique : pixels, définition et résolution, couleurs RVB (0 à 255), poids d'une image et compression, capteur et photosites, algorithmes de prise de vue, traitement d'image par programme, métadonnées EXIF."
duree: 40
objectifs:
  - "Décrire une image numérique comme un tableau de pixels codés en RVB, et calculer définition et poids"
  - "Distinguer photosites du capteur et pixels de l'image"
  - "Transformer une image par programme en agissant sur les composantes de ses pixels"
  - "Citer des algorithmes de prise de vue et retrouver les métadonnées d'une photo"
prerequis: [snt-python/boucles-bornees]
programme: [snt-photo]
cartes:
  - q: "Qu'est-ce qu'un pixel ?"
    r: "Le plus petit élément d'une image numérique (*picture element*) : un petit carré d'une seule couleur. L'image est un tableau de pixels."
  - q: "Comment est codée la couleur d'un pixel ?"
    r: "Par trois nombres de **0 à 255** : l'intensité de **rouge**, de **vert** et de **bleu** (RVB). (0, 0, 0) = noir, (255, 255, 255) = blanc."
  - q: "Définition ou résolution ?"
    r: "La **définition** est le nombre de pixels (4000 × 3000 = 12 mégapixels). La **résolution** est le nombre de pixels par unité de longueur (en points par pouce, ppp) quand on affiche ou imprime."
  - q: "Poids d'une image non compressée de 4000 × 3000 pixels en RVB ?"
    r: "4000 × 3000 × 3 octets = 36 000 000 octets, soit 36 Mo. La compression (JPEG) le réduit fortement."
  - q: "Comment obtenir le négatif d'un pixel (r, v, b) ?"
    r: "(255 - r, 255 - v, 255 - b)."
  - q: "Que sont les métadonnées EXIF ?"
    r: "Des informations enregistrées avec la photo : date, modèle d'appareil, réglages (exposition, focale), et parfois la **position GPS**."
  - q: "Photosite ou pixel ?"
    r: "Un **photosite** est une cellule du **capteur** qui mesure la lumière (d'une seule couleur, grâce à un filtre) ; un **pixel** est un point de l'**image** finale, calculé à partir de plusieurs photosites."
---

La photo est le thème idéal pour faire programmer les élèves avec un résultat **visible** : une image n'est qu'un tableau de nombres, et changer ces
nombres change l'image. Le cours relie le **fonctionnement de l'appareil** (capteur, algorithmes), le **codage** de l'image (pixels, RVB) et le
**traitement** par programme.

## Ce que dit le programme

Capacités attendues : distinguer les **photosites** du capteur et les **pixels** de l'image en comparant les résolutions du capteur et de l'image ;
**traiter par programme** une image pour la transformer en agissant sur les trois composantes de ses pixels ; expliciter des **algorithmes associés
à la prise de vue** ; identifier les étapes de la **construction de l'image** finale ; retrouver les **métadonnées** d'une photographie.

Ce qui **n'est pas** attendu : le détail de la compression JPEG, les filtres de convolution, la représentation binaire des nombres (vue en première).

## 1. Un peu d'histoire

- **1826-1827** : Nicéphore Niépce réalise la première photographie connue (plusieurs heures de pose).
- **1975** : Steven Sasson, chez Kodak, construit le premier appareil photo numérique (0,01 mégapixel, en noir et blanc).
- **2000** : premiers téléphones avec appareil photo ; aujourd'hui, l'immense majorité des photos est prise avec un **smartphone**.

## 2. L'image : un tableau de pixels

Une image numérique est un **tableau** de petits carrés de couleur : les **pixels**. Chaque pixel a une seule couleur.

- La **définition** est le nombre de pixels : largeur × hauteur. Une image de 4000 × 3000 pixels a 12 000 000 pixels, soit **12 mégapixels**.
- La **résolution** est le nombre de pixels par unité de longueur (en **ppp**, points par pouce) quand l'image est affichée ou imprimée : plus elle est
  élevée, plus l'image est fine.

## 3. Le codage des couleurs : RVB

Chaque pixel est codé par **trois nombres de 0 à 255** : l'intensité de **Rouge**, de **Vert** et de **Bleu** (synthèse additive de la lumière, comme
sur un écran).

| Couleur | (R, V, B) |
|---|---|
| noir | (0, 0, 0) |
| blanc | (255, 255, 255) |
| rouge | (255, 0, 0) |
| jaune (rouge + vert) | (255, 255, 0) |
| gris moyen | (128, 128, 128) |

Chaque composante tient sur un **octet** (256 valeurs) : un pixel occupe 3 octets, et l'on peut représenter 256 × 256 × 256 ≈ **16,7 millions** de
couleurs.

**Le poids d'une image.** Sans compression : largeur × hauteur × 3 octets. Une photo de 12 mégapixels pèse donc 36 Mo ! Les formats comme **JPEG**
**compressent** l'image (en perdant des détails peu visibles) pour la réduire souvent d'un facteur 10 ou plus ; **PNG** compresse sans perte.

## 4. Du capteur à l'image

Le **capteur** de l'appareil est une grille de millions de **photosites**, des cellules qui mesurent la quantité de lumière reçue. Chaque photosite est
couvert d'un **filtre** rouge, vert ou bleu (motif de Bayer) : il ne mesure donc qu'**une** couleur. L'appareil **calcule** ensuite la couleur de
chaque pixel en combinant les photosites voisins (dématriçage). Photosites et pixels ne sont donc pas la même chose, et leur nombre peut différer
selon les réglages (une image peut être enregistrée en définition réduite).

Les **algorithmes** interviennent à chaque étape de la prise de vue :

- **mise au point** automatique (détection du contraste ou des visages) ;
- **exposition** : régler le temps de pose et la sensibilité selon la lumière ;
- **balance des blancs** : corriger la couleur dominante de l'éclairage ;
- **HDR**, mode nuit, mode portrait : combiner **plusieurs** photos prises en rafale pour en faire une seule ;
- **compression** et enregistrement avec les métadonnées.

## 5. Traiter une image par programme

Une image peut se représenter en Python par une **liste de lignes**, chaque ligne étant une liste de pixels `(r, v, b)`. Transformer l'image, c'est
parcourir tous les pixels avec **deux boucles** et calculer une nouvelle couleur.

```python exec
image = [
    [(255, 0, 0), (0, 255, 0)],
    [(0, 0, 255), (200, 200, 200)],
]

negatif = []
for ligne in image:
    nouvelle_ligne = []
    for (r, v, b) in ligne:
        nouvelle_ligne.append((255 - r, 255 - v, 255 - b))
    negatif.append(nouvelle_ligne)
print(negatif)
```

Quelques transformations classiques :

| Effet | Nouveau pixel |
|---|---|
| négatif | (255 − r, 255 − v, 255 − b) |
| niveaux de gris | (g, g, g) avec g = (r + v + b) / 3 (arrondi) |
| supprimer le rouge | (0, v, b) |
| noir et blanc (seuil) | blanc si g > 128, noir sinon |

En classe, on utilise une bibliothèque (comme **Pillow**, avec `getpixel` et `putpixel`) pour appliquer ces calculs à de vraies photos.

## 6. Les métadonnées EXIF

Une photo contient aussi des **métadonnées** au format **EXIF** : date et heure, modèle de l'appareil, réglages (temps de pose, ouverture, focale,
flash) et souvent la **position GPS**. On les voit dans les propriétés du fichier. Elles peuvent révéler où vit quelqu'un : on peut désactiver la
géolocalisation des photos, et la plupart des réseaux sociaux les suppriment à la publication.

## Les erreurs classiques des élèves

:::attention[Ce que tu verras en classe]
- **Confondre définition et résolution** (« ma photo a une résolution de 12 Mpx »).
- **Croire qu'un pixel peut avoir plusieurs couleurs.**
- **Penser qu'augmenter la taille d'une image ajoute des détails** : on ne crée pas d'information.
- **Dépasser 255** dans un calcul (luminosité × 1,5) : il faut limiter avec `min(255, …)`.
- **Oublier une des deux boucles** et ne traiter qu'une ligne.
:::

## En classe

:::methode[Activités qui marchent]
1. **Zoomer** très fort sur une photo pour voir les pixels.
2. **Synthèse additive** : un outil de choix de couleur (pipette) pour trouver les valeurs RVB, deviner des couleurs à partir de leurs composantes.
3. **Programmer des filtres** : négatif, niveaux de gris, suppression d'une couleur, sur une vraie image avec Pillow.
4. **EXIF** : examiner les métadonnées d'une photo fournie par le professeur (pas celles des élèves).
5. **Calculs** : poids d'une image non compressée, comparaison avec le fichier JPEG réel.
:::

## L'essentiel

- Une image numérique est un **tableau de pixels** ; **définition** = nombre de pixels, **résolution** = pixels par unité de longueur.
- Couleur d'un pixel : **(R, V, B)**, trois nombres de **0 à 255** (3 octets) ; 16,7 millions de couleurs.
- Poids non compressé = largeur × hauteur × 3 octets ; **JPEG** compresse avec perte.
- Le **capteur** a des **photosites** (une couleur chacun) ; l'image est **calculée** par des algorithmes (dématriçage, exposition, HDR…).
- Traiter une image = parcourir les pixels (deux boucles) et calculer ; **EXIF** = métadonnées (date, appareil, GPS).

## Exercices

::::exercice[Grand QCM : la photographie numérique]{niveau=1 type=quiz}
Douze questions sur la photographie numérique.

1. Qu'est-ce qu'un pixel ?

   - [ ] une cellule du capteur
   - [x] le plus petit élément de l'image, d'une seule couleur
   - [ ] un fichier image
   - [ ] une unité de poids

   > *Picture element* : un petit carré de couleur.

1. Quelle couleur correspond à (255, 255, 255) ?

   - [ ] noir
   - [x] blanc
   - [ ] gris
   - [ ] rouge

   > Les trois composantes au maximum donnent du blanc (synthèse additive).

1. Quelle couleur correspond à (255, 255, 0) ?

   - [ ] blanc
   - [ ] vert
   - [x] jaune
   - [ ] orange

   > Rouge + vert en lumière donnent du jaune.

1. Une image de 2000 × 1000 pixels a une définition de…

   - [ ] 3000 pixels
   - [x] 2 mégapixels
   - [ ] 20 mégapixels
   - [ ] 2000 ppp

   > 2000 × 1000 = 2 000 000 pixels.

1. Quel est le poids non compressé d'une image de 1000 × 1000 pixels en RVB ?

   - [ ] 1 Mo
   - [x] 3 Mo
   - [ ] 1000 octets
   - [ ] 255 Mo

   > 1 000 000 pixels × 3 octets = 3 000 000 octets.

1. Combien de valeurs différentes peut prendre une composante (rouge, vert ou bleu) ?

   - [ ] 100
   - [ ] 255
   - [x] 256
   - [ ] 16,7 millions

   > De 0 à 255 : 256 valeurs (un octet).

1. Quel est le négatif du pixel (200, 50, 0) ?

   - [x] (55, 205, 255)
   - [ ] (0, 50, 200)
   - [ ] (200, 50, 0)
   - [ ] (255, 255, 255)

   > On calcule 255 − chaque composante.

1. Quelle est la différence entre un photosite et un pixel ?

   - [ ] aucune
   - [x] le photosite est une cellule du capteur qui mesure une seule couleur ; le pixel est un point de l'image finale, calculé
   - [ ] le pixel est sur le capteur, le photosite sur l'écran
   - [ ] le photosite est plus grand qu'une image

   > L'appareil calcule les pixels à partir de plusieurs photosites.

1. Que fait le mode HDR d'un téléphone ?

   - [ ] il agrandit l'image
   - [x] il combine plusieurs photos prises avec des expositions différentes
   - [ ] il supprime les métadonnées
   - [ ] il convertit en noir et blanc

   > C'est un algorithme de prise de vue : plusieurs images fusionnées.

1. Que contiennent les métadonnées EXIF ?

   - [ ] les pixels de l'image
   - [x] la date, l'appareil, les réglages et parfois la position GPS
   - [ ] le nom des personnes photographiées
   - [ ] un antivirus

   > À vérifier avant de partager une photo.

1. Pourquoi un fichier JPEG pèse-t-il beaucoup moins que l'image non compressée ?

   - [ ] il contient moins de pixels
   - [x] il est compressé, en supprimant des détails peu visibles
   - [ ] il n'a pas de couleurs
   - [ ] il est stocké dans le cloud

   > Compression avec perte.

1. Un élève veut éclaircir une image en multipliant chaque composante par 1,5. Quel problème va-t-il rencontrer ?

   - [ ] aucun
   - [x] certaines valeurs vont dépasser 255 : il faut les limiter avec `min(255, …)` (et arrondir)
   - [ ] l'image va devenir plus petite
   - [ ] les métadonnées vont disparaître

   > Une composante doit rester un entier entre 0 et 255.
::::

::::exercice[Négatif d'un pixel]{niveau=1}
Écris `negatif(pixel)` qui reçoit un couple de trois composantes `(r, v, b)` et renvoie le pixel négatif.

```python depart
def negatif(pixel):
    r, v, b = pixel
    ...
```

```python tests
assert negatif((0, 0, 0)) == (255, 255, 255), "le noir devient blanc"
assert negatif((200, 50, 0)) == (55, 205, 255), "pixel quelconque"
assert negatif((128, 128, 128)) == (127, 127, 127), "gris moyen"
```

:::corrige
```python solution
def negatif(pixel):
    r, v, b = pixel
    return (255 - r, 255 - v, 255 - b)
```
:::
::::

::::exercice[Image en niveaux de gris]{niveau=2}
Une image est une liste de lignes, chaque ligne une liste de pixels `(r, v, b)`. Écris `gris(image)` qui renvoie une **nouvelle** image où chaque pixel
est remplacé par `(g, g, g)`, avec `g = (r + v + b) // 3`.

```python depart
def gris(image):
    ...
```

```python tests
img = [[(255, 0, 0), (0, 255, 0)], [(30, 60, 90), (255, 255, 255)]]
assert gris(img) == [[(85, 85, 85), (85, 85, 85)], [(60, 60, 60), (255, 255, 255)]], "image 2 × 2"
assert img[0][0] == (255, 0, 0), "l'image de départ n'est pas modifiée"
assert gris([[]]) == [[]], "ligne vide"
```

:::indice
Deux boucles : une sur les lignes, une sur les pixels de chaque ligne. Construis une nouvelle ligne avec `append`, puis ajoute-la à la nouvelle image.
:::

:::corrige
```python solution
def gris(image):
    resultat = []
    for ligne in image:
        nouvelle = []
        for (r, v, b) in ligne:
            g = (r + v + b) // 3
            nouvelle.append((g, g, g))
        resultat.append(nouvelle)
    return resultat
```
:::
::::

::::exercice[Poids d'une photo]{niveau=1}
Écris `poids_mo(largeur, hauteur)` qui renvoie le poids **non compressé** d'une image RVB en mégaoctets (1 Mo = 1 000 000 octets).

```python depart
def poids_mo(largeur, hauteur):
    ...
```

```python tests
assert poids_mo(4000, 3000) == 36, "12 mégapixels : 36 Mo"
assert poids_mo(1000, 1000) == 3, "1 mégapixel : 3 Mo"
```

:::corrige
```python solution
def poids_mo(largeur, hauteur):
    return largeur * hauteur * 3 / 1_000_000
```

Une photo JPEG de 12 mégapixels pèse en réalité quelques mégaoctets : la compression divise le poids par 10 environ.
:::
::::

::::exercice[Expliquer une image numérique]{niveau=2}
Explique à une classe de seconde, en quelques phrases et avec un exemple chiffré, ce qu'est une image numérique, comment une couleur est codée, et
pourquoi une photo prend de la place en mémoire.

:::criteres
- L'image est décrite comme un tableau de pixels, avec la définition (largeur × hauteur).
- La couleur est codée par trois nombres de 0 à 255 (RVB), avec un exemple.
- Le calcul du poids est fait sur un exemple (3 octets par pixel).
- La compression est mentionnée.
:::

:::corrige
« Une image numérique est un **tableau de pixels**, de petits carrés d'une seule couleur. Une photo de téléphone en contient par exemple 4000 × 3000,
soit 12 millions : c'est sa **définition**, 12 mégapixels. Chaque pixel est codé par trois nombres de 0 à 255 : la quantité de **rouge**, de **vert**
et de **bleu**. Par exemple (255, 128, 0) donne un orange. Chaque nombre prend un octet, donc un pixel prend 3 octets et la photo 36 millions
d'octets, 36 Mo ! Heureusement, le format JPEG **compresse** l'image en supprimant des détails invisibles à l'œil : le fichier ne pèse plus que
quelques mégaoctets. »
:::
::::
