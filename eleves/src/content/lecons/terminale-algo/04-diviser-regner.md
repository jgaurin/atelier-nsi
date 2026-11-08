---
titre: Diviser pour régner
resume: "Découper un problème en sous-problèmes indépendants : le tri fusion et la rotation d'image."
duree: 45
objectifs:
  - "Écrire un algorithme utilisant la méthode diviser pour régner"
  - "Écrire le tri fusion et justifier son coût"
prerequis: [terminale-langages/recursivite, premiere-algo/tris]
---

**Diviser pour régner**, c'est découper un problème, résoudre les morceaux, puis **combiner** les résultats.

## 1. La méthode

1. **Diviser** en sous-problèmes indépendants.
2. **Régner** : les résoudre, souvent récursivement.
3. **Combiner** leurs solutions.

La recherche dichotomique est un cas particulier : on ne garde qu'une moitié, il n'y a donc rien à combiner.

## 2. Le tri fusion

On coupe le tableau en deux, on trie chaque moitié, puis on **fusionne**.

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

Il y a environ log₂(n) niveaux de découpage, et à chaque niveau les fusions traitent n éléments. Le coût est en **n log₂ n**, bien meilleur que n².

## 3. La rotation d'une image

Pour faire tourner d'un quart de tour une image carrée de côté 2ᵏ : on la coupe en **quatre**, on tourne chaque quart récursivement, puis on **permute** les quatre quarts. En échangeant les pixels sur place, le coût en mémoire reste **constant**.

## L'essentiel

- Diviser, régner, combiner.
- Tri fusion : couper en deux, trier, fusionner. Coût : n log₂ n.
- Rotation d'image : quatre quarts tournés récursivement, puis permutés.

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
