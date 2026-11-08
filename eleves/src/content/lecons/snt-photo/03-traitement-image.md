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

Une image est un tableau de lignes, et chaque ligne est un tableau de pixels.

## 1. Un pixel

Un pixel est un triplet `(r, v, b)`.

```python exec
pixel = (200, 100, 50)
r, v, b = pixel
print(r, v, b)
```

## 2. Deux transformations

**Niveau de gris** : on donne aux trois composantes leur moyenne.

```python exec
def gris(pixel):
    r, v, b = pixel
    m = (r + v + b) // 3
    return (m, m, m)

print(gris((200, 100, 50)))
```

**Négatif** : chaque composante c devient 255 − c.

## 3. Parcourir l'image

Une boucle parcourt les lignes, une autre les pixels de chaque ligne.

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

## 4. Détecter un contour

Dans une image en niveaux de gris, un **contour** apparaît là où un pixel diffère fortement de son voisin. On compare la différence à un **seuil**.

## L'essentiel

- Un pixel est un triplet `(r, v, b)`.
- Gris : la moyenne des trois composantes.
- Négatif : 255 − c.
- Deux boucles imbriquées parcourent une image.

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
