---
titre: Diviser pour régner
resume: "Découper un problème en sous-problèmes indépendants : le tri fusion et la rotation d'image."
duree: 45
objectifs:
  - "Écrire un algorithme utilisant la méthode diviser pour régner"
  - "Écrire le tri fusion et justifier son coût"
prerequis: [terminale-langages/recursivite, premiere-algo/tris]
---

Pour ranger une bibliothèque de 1 000 livres, tu peux la partager avec un ami : chacun range 500 livres, puis vous réunissez vos deux piles rangées. Chacun peut à son tour partager sa moitié… C'est la méthode **diviser pour régner**.

## 1. La méthode en trois étapes

1. **Diviser** : découper le problème en sous-problèmes plus petits et indépendants.
2. **Régner** : résoudre chaque sous-problème, souvent par un appel récursif.
3. **Combiner** : construire la solution du problème à partir de celles des sous-problèmes.

La recherche dichotomique en est un cas simple : on divise en deux, on ne garde qu'une moitié, et il n'y a rien à combiner.

## 2. Fusionner deux tableaux triés

Le cœur du tri fusion est la **fusion** : réunir deux tableaux **déjà triés** en un seul tableau trié. On compare les premiers éléments restants des deux tableaux, et on prend le plus petit.

Fusion de `[2, 7, 9]` et `[3, 4, 8]` :

| Comparaison | Élément pris | Résultat en cours |
| --- | --- | --- |
| 2 et 3 | 2 | 2 |
| 7 et 3 | 3 | 2 3 |
| 7 et 4 | 4 | 2 3 4 |
| 7 et 8 | 7 | 2 3 4 7 |
| 9 et 8 | 8 | 2 3 4 7 8 |
| le second tableau est vide | 9 | 2 3 4 7 8 9 |

Chaque élément est pris une seule fois : fusionner n éléments demande environ n opérations.

## 3. Le tri fusion

1. **Diviser** : couper le tableau en deux moitiés.
2. **Régner** : trier chaque moitié, par le même algorithme.
3. **Combiner** : fusionner les deux moitiés triées.

Un tableau de 0 ou 1 élément est déjà trié : c'est le cas de base.

```
[38, 27, 43, 3, 9]
[38, 27]          [43, 3, 9]
[38] [27]         [43]   [3, 9]
                          [3] [9]
[27, 38]          [43]   [3, 9]
                  [3, 9, 43]
[3, 9, 27, 38, 43]
```

```python exec
def fusion(a, b):
    r, i, j = [], 0, 0
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            r.append(a[i]); i = i + 1
        else:
            r.append(b[j]); j = j + 1
    return r + a[i:] + b[j:]

def tri_fusion(t):
    if len(t) <= 1:
        return t
    m = len(t) // 2
    return fusion(tri_fusion(t[:m]), tri_fusion(t[m:]))

print(tri_fusion([38, 27, 43, 3, 9]))
```

- Dans `fusion`, `i` et `j` avancent dans chacun des deux tableaux. Quand l'un est épuisé, `a[i:] + b[j:]` ajoute ce qui reste de l'autre, déjà trié.
- Dans `tri_fusion`, `t[:m]` et `t[m:]` sont les deux moitiés.

## 4. Pourquoi c'est rapide

On coupe en deux jusqu'à obtenir des tableaux d'un élément : il y a environ **log₂(n)** niveaux de découpage. À chaque niveau, les fusions traitent en tout les n éléments. Le coût total est donc d'environ **n × log₂(n)**.

| n | Tri par sélection : n² | Tri fusion : n log₂ n |
| --- | --- | --- |
| 1 000 | 1 000 000 | 10 000 |
| 1 000 000 | 10¹² | 20 000 000 |

Pour un million de valeurs, le tri fusion est environ 50 000 fois plus rapide. En contrepartie, il crée de nouveaux tableaux : il utilise de la **mémoire** supplémentaire.

## 5. Faire tourner une image

Pour faire tourner d'un quart de tour une image carrée de côté 2ᵏ :

1. **Diviser** : on la coupe en quatre carrés.
2. **Régner** : on fait tourner chaque carré d'un quart de tour, par le même algorithme.
3. **Combiner** : on déplace les quatre carrés en tournant : haut-gauche vers haut-droit, haut-droit vers bas-droit, bas-droit vers bas-gauche, bas-gauche vers haut-gauche.

Les pixels sont **échangés sur place**, sans créer de copie de l'image : la mémoire utilisée reste constante.

## L'essentiel

- Diviser, régner, combiner.
- Fusion de deux tableaux triés : on prend à chaque fois le plus petit des deux premiers éléments.
- Tri fusion : couper en deux, trier chaque moitié, fusionner ; coût en n log₂ n.
- Rotation d'image : quatre carrés tournés récursivement, puis déplacés.

## Exercices

::::exercice[QCM : diviser pour régner]{niveau=1 type=quiz}
Une question à la fois : la correction s'affiche aussitôt.

1. Quelles sont les trois étapes de la méthode ?

   - [ ] trier, chercher, afficher
   - [x] diviser, régner, combiner
   - [ ] lire, calculer, écrire
   - [ ] découper, compter, choisir

   > Régner = résoudre les sous-problèmes, souvent récursivement.

1. Que renvoie `fusion([1, 4, 9], [2, 3, 10])` ?

   - [ ] `[1, 4, 9, 2, 3, 10]`
   - [x] `[1, 2, 3, 4, 9, 10]`
   - [ ] `[1, 2, 4, 3, 9, 10]`
   - [ ] `[10, 9, 4, 3, 2, 1]`

   > On prend à chaque fois le plus petit des deux premiers éléments.

1. Quel est le cas de base du tri fusion ?

   - [ ] un tableau de 2 éléments
   - [x] un tableau de 0 ou 1 élément
   - [ ] un tableau déjà trié
   - [ ] il n'y en a pas

   > Un tel tableau est trié par définition.

1. Quel est le coût du tri fusion dans le pire cas ?

   - [ ] n
   - [x] n log₂ n
   - [ ] n²
   - [ ] log₂ n

   > Contrairement au tri par insertion, il n'a pas de « mauvais cas ».

1. Pour faire tourner une image d'un quart de tour par diviser pour régner, on :

   - [ ] trie les pixels
   - [x] découpe l'image en quatre quarts, les fait tourner récursivement et les permute
   - [ ] lit les pixels ligne par ligne
   - [ ] divise les couleurs par deux

   > Possible sans image supplémentaire.
::::

::::exercice[Dérouler la fusion]{niveau=1 type=completer}
On fusionne `a = [2, 7, 9]` et `b = [3, 4, 8]`. Complète, étape par étape, l'élément ajouté.

```python calcul
a, b, r = [2, 7, 9], [3, 4, 8], []
while a and b:
    r.append(a.pop(0) if a[0] <= b[0] else b.pop(0))
r += a + b
for x in r:
    print(x)
```

| Étape | 1 | 2 | 3 | 4 | 5 | 6 |
| --- | --- | --- | --- | --- | --- | --- |
| Élément ajouté | [[2]] | [[3]] | [[4]] | [[7]] | [[8]] | [[9]] |
::::

::::exercice[Coût]{niveau=1 type=reponses}
Donne des ordres de grandeur.

1. Pour n = 1 024, combien vaut log₂(n) ?

   ```python calcul
   print(10)
   ```

   - 10

1. Pour n = 1 024, combien vaut n × log₂(n) ?

   ```python calcul
   print(1024 * 10)
   ```

   - 10240
   - 10 240

1. Quel est le coût du tri par sélection, en ordre de grandeur, pour n = 1 024 ? Donne n².

   ```python calcul
   print(1024 ** 2)
   ```

   - 1048576
   - 1 048 576
::::

::::exercice[Fusionner deux tableaux triés]{niveau=2}
Écris `fusion(a, b)` qui renvoie le tableau trié contenant les éléments des deux tableaux triés `a` et `b`, en un seul parcours (sans `sort` ni
`sorted`).

```python depart
def fusion(a, b):
    ...
```

```python tests
assert fusion([1, 4, 9], [2, 3, 10]) == [1, 2, 3, 4, 9, 10], "cas général"
assert fusion([], [5, 6]) == [5, 6] and fusion([5, 6], []) == [5, 6], "un tableau vide"
assert fusion([1, 2], [3, 4, 5, 6]) == [1, 2, 3, 4, 5, 6], "a épuisé en premier"
assert fusion([2, 2], [2]) == [2, 2, 2], "égalités"
```

:::corrige
```python solution
def fusion(a, b):
    resultat = []
    i = 0
    j = 0
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            resultat.append(a[i])
            i = i + 1
        else:
            resultat.append(b[j])
            j = j + 1
    while i < len(a):
        resultat.append(a[i])
        i = i + 1
    while j < len(b):
        resultat.append(b[j])
        j = j + 1
    return resultat
```

Les deux dernières boucles ajoutent le reste du tableau qui n'est pas épuisé (une seule des deux s'exécute vraiment).
:::
::::

::::exercice[Le tri fusion]{niveau=2}
Écris `tri_fusion(t)` qui renvoie un nouveau tableau trié, avec la méthode diviser pour régner. La fonction `fusion` est fournie.

```python depart
def fusion(a, b):
    resultat = []
    i, j = 0, 0
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            resultat.append(a[i]); i = i + 1
        else:
            resultat.append(b[j]); j = j + 1
    return resultat + a[i:] + b[j:]

def tri_fusion(t):
    ...
```

```python tests
assert tri_fusion([38, 27, 43, 3, 9, 82, 10]) == [3, 9, 10, 27, 38, 43, 82], "cas général"
assert tri_fusion([]) == [] and tri_fusion([5]) == [5], "cas de base"
assert tri_fusion([5, 4, 3, 2, 1]) == [1, 2, 3, 4, 5], "ordre inverse"
import random
t = [random.randint(0, 1000) for i in range(500)]
assert tri_fusion(t) == sorted(t), "500 valeurs aléatoires"
```

:::corrige
```python solution
def fusion(a, b):
    resultat = []
    i, j = 0, 0
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            resultat.append(a[i]); i = i + 1
        else:
            resultat.append(b[j]); j = j + 1
    return resultat + a[i:] + b[j:]

def tri_fusion(t):
    if len(t) <= 1:
        return t
    milieu = len(t) // 2
    return fusion(tri_fusion(t[:milieu]), tri_fusion(t[milieu:]))
```

Trois lignes après le cas de base : diviser (les tranches), régner (deux appels récursifs), combiner (la fusion).
:::
::::

::::exercice[Faire tourner une image]{niveau=3}
Une image carrée de côté 2ᵏ est une matrice `im` de pixels. On veut la faire tourner d'un quart de tour dans le sens des aiguilles d'une montre, **sans créer de nouvelle matrice**.

1. Écris `echanger(im, l1, c1, l2, c2, n)`, qui échange les deux blocs carrés de côté `n` dont les coins supérieurs gauches sont `(l1, c1)` et `(l2, c2)`.
2. Écris `tourner(im, l, c, n)`, qui fait tourner le bloc de côté `n` et de coin `(l, c)`. Si `n` vaut 1, il n'y a rien à faire. Sinon, tourne récursivement les quatre quarts, puis déplace-les : haut-gauche vers haut-droit, haut-droit vers bas-droit, bas-droit vers bas-gauche, bas-gauche vers haut-gauche.
3. À l'écrit : identifie les étapes diviser, régner et combiner. Pourquoi la mémoire utilisée pour l'image reste-t-elle constante ?

:::indice
Trois échanges suffisent : haut-gauche avec bas-gauche, puis bas-gauche avec bas-droit, puis bas-droit avec haut-droit.
:::

```python depart
def echanger(im, l1, c1, l2, c2, n):
    ...

def tourner(im, l, c, n):
    ...
```

```python tests
im = [[1, 2], [3, 4]]
echanger(im, 0, 0, 1, 1, 1)
assert im == [[4, 2], [3, 1]], "échange de deux pixels"
im = [[1, 2], [3, 4]]
tourner(im, 0, 0, 2)
assert im == [[3, 1], [4, 2]], "image 2 × 2"
im = [[i * 4 + j for j in range(4)] for i in range(4)]
attendu = [list(x) for x in zip(*im[::-1])]
tourner(im, 0, 0, 4)
assert im == attendu, "image 4 × 4"
im = [[7]]
tourner(im, 0, 0, 1)
assert im == [[7]], "un pixel"
```

:::corrige
```python solution
def echanger(im, l1, c1, l2, c2, n):
    for i in range(n):
        for j in range(n):
            im[l1 + i][c1 + j], im[l2 + i][c2 + j] = im[l2 + i][c2 + j], im[l1 + i][c1 + j]

def tourner(im, l, c, n):
    if n == 1:
        return
    m = n // 2
    tourner(im, l, c, m)
    tourner(im, l, c + m, m)
    tourner(im, l + m, c, m)
    tourner(im, l + m, c + m, m)
    echanger(im, l, c, l + m, c, m)
    echanger(im, l + m, c, l + m, c + m, m)
    echanger(im, l + m, c + m, l, c + m, m)
```

**Question 3.** **Diviser** : couper en quatre quarts. **Régner** : tourner chaque quart. **Combiner** : déplacer les quarts. Les pixels sont échangés sur place : on ne crée aucune copie de l'image.
:::
::::
