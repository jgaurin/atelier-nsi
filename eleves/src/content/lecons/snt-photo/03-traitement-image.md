---
titre: Traiter une image par programme
resume: "Transformer une image en agissant sur les trois composantes de ses pixels."
duree: 35
programmation: true
objectifs:
  - "Agir sur les trois composantes d'un pixel"
  - "Parcourir une image avec deux boucles"
  - "Programmer un passage en niveaux de gris et un négatif"
prerequis: [snt-photo/pixels, snt-python/boucles]
---

Retoucher une photo, c'est faire des calculs sur ses pixels. Tu vas voir comment un programme transforme une image en couleur en image grise, ou en négatif.

## 1. Un pixel, trois nombres

Chaque pixel est un triplet `(r, v, b)` : ses quantités de rouge, de vert et de bleu, chacune de 0 à 255.

```python exec
pixel = (200, 100, 50)
r, v, b = pixel
print(r, v, b)
```

La deuxième ligne range les trois valeurs dans trois variables d'un coup.

## 2. Passer en niveaux de gris

Un gris a la même quantité de rouge, de vert et de bleu : (128, 128, 128) est un gris moyen. Pour griser un pixel, on remplace ses trois valeurs par leur **moyenne**.

:::exemple
Pour (200, 100, 50) : la moyenne vaut (200 + 100 + 50) / 3, soit environ 116. Le pixel devient (116, 116, 116).
:::

```python exec
def gris(pixel):
    r, v, b = pixel
    m = (r + v + b) // 3
    return (m, m, m)

print(gris((200, 100, 50)))
```

On utilise `//` pour obtenir un entier, car un niveau de couleur est un nombre entier.

## 3. Le négatif

Dans un négatif, le clair devient sombre et le sombre devient clair. Chaque valeur c devient **255 − c** : 0, le noir, devient 255, le blanc, et inversement.

:::exemple
(200, 100, 50) devient (55, 155, 205).
:::

## 4. Parcourir toute l'image

Une image est un tableau de **lignes**, et chaque ligne est un tableau de pixels. Pour visiter tous les pixels, on utilise **deux boucles** : une sur les lignes, et dans chaque ligne, une sur ses pixels.

```python exec
image = [[(10, 20, 30), (0, 0, 0)],
         [(255, 255, 255), (90, 90, 90)]]

nb = 0
for ligne in image:
    for pixel in ligne:
        if pixel == (0, 0, 0):
            nb = nb + 1
print(nb)
```

Cette image a 2 lignes de 2 pixels. Le programme les visite tous et compte les pixels noirs : il y en a 1.

Pour transformer toute l'image, on construit une nouvelle image en appliquant la même transformation, comme `gris`, à chaque pixel.

## 5. Détecter les contours

Un **contour** est l'endroit où l'image change brusquement : entre un objet sombre et un fond clair, par exemple. Dans une image en niveaux de gris, on compare chaque pixel à son voisin. Si la différence dépasse un **seuil**, on est sur un contour.

## L'essentiel

- Un pixel est un triplet `(r, v, b)`, chaque valeur de 0 à 255.
- Gris : la moyenne des trois valeurs. Négatif : 255 − c pour chaque valeur.
- Deux boucles imbriquées parcourent une image, ligne par ligne.
- Un contour est un endroit où deux pixels voisins diffèrent fortement.

## Exercices

::::exercice[Calculer un pixel]{niveau=1 type=reponses}
On considère le pixel `(30, 60, 90)`.

1. Quelle est la moyenne de ses trois composantes ?

   ```python calcul
   print((30 + 60 + 90) // 3)
   ```

   - 60

1. Que devient son rouge dans le négatif ?

   ```python calcul
   print(255 - 30)
   ```

   - 225

1. Que devient son bleu dans le négatif ?

   ```python calcul
   print(255 - 90)
   ```

   - 165
::::

::::exercice[Compléter une fonction]{niveau=1 type=completer}
Cette fonction renvoie le négatif d'un pixel.

```python trous
def negatif(pixel):
    r, v, b = [[pixel]]
    return ([[255 - r]], [[255 - v]], [[255 - b]])
```
::::

::::exercice[Transformer un pixel]{niveau=2}
Écris `sans_rouge(pixel)`, qui met la composante rouge à 0, et `plus_clair(pixel)`, qui ajoute 50 à chaque composante, sans dépasser 255.

```python depart
def sans_rouge(pixel):
    ...

def plus_clair(pixel):
    ...
```

```python tests
assert sans_rouge((10, 20, 30)) == (0, 20, 30), "rouge supprimé"
assert plus_clair((10, 20, 30)) == (60, 70, 80), "plus clair"
assert plus_clair((240, 205, 0)) == (255, 255, 50), "maximum 255"
```

:::corrige
```python solution
def sans_rouge(pixel):
    r, v, b = pixel
    return (0, v, b)

def plus_clair(pixel):
    r, v, b = pixel
    return (min(r + 50, 255), min(v + 50, 255), min(b + 50, 255))
```
:::
::::

::::exercice[Un mini-logiciel de retouche]{niveau=3}
Une image est un tableau de lignes de pixels `(r, v, b)`.

1. Écris `image_grise(image)`, qui renvoie une nouvelle image en niveaux de gris, avec la moyenne entière des trois composantes.
2. Écris `image_negative(image)`, qui renvoie une nouvelle image.
3. Écris `contours(image, seuil)`. L'image reçue est une matrice d'entiers en niveaux de gris. La fonction renvoie une nouvelle matrice de même taille : un pixel vaut 255 si la différence absolue avec son voisin de **droite** est strictement supérieure à `seuil`, et 0 sinon. La dernière colonne vaut 0.
4. À l'écrit : que devient une image si on applique deux fois `image_negative` ? Justifie.

```python depart
def image_grise(image):
    ...

def image_negative(image):
    ...

def contours(image, seuil):
    ...
```

```python tests
im = [[(10, 20, 30), (255, 255, 255)], [(0, 0, 0), (1, 1, 4)]]
assert image_grise(im) == [[(20, 20, 20), (255, 255, 255)], [(0, 0, 0), (2, 2, 2)]], "gris"
assert im[0][0] == (10, 20, 30), "image d'origine intacte"
assert image_negative([[(0, 10, 255)]]) == [[(255, 245, 0)]], "négatif"
g = [[0, 0, 200], [100, 90, 10]]
assert contours(g, 50) == [[0, 255, 0], [0, 255, 0]], "contours"
assert contours([[5]], 1) == [[0]], "une seule colonne"
```

:::corrige
```python solution
def image_grise(image):
    resultat = []
    for ligne in image:
        nouvelle = []
        for r, v, b in ligne:
            m = (r + v + b) // 3
            nouvelle.append((m, m, m))
        resultat.append(nouvelle)
    return resultat

def image_negative(image):
    resultat = []
    for ligne in image:
        nouvelle = []
        for r, v, b in ligne:
            nouvelle.append((255 - r, 255 - v, 255 - b))
        resultat.append(nouvelle)
    return resultat

def contours(image, seuil):
    resultat = []
    for ligne in image:
        nouvelle = []
        for j in range(len(ligne) - 1):
            if abs(ligne[j] - ligne[j + 1]) > seuil:
                nouvelle.append(255)
            else:
                nouvelle.append(0)
        nouvelle.append(0)
        resultat.append(nouvelle)
    return resultat
```

**Question 4.** On retrouve l'image de départ : 255 − (255 − c) = c.
:::
::::
