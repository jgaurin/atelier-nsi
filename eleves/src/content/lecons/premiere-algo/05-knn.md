---
titre: Les k plus proches voisins
resume: "Prédire la classe d'un élément d'après les éléments connus qui lui ressemblent le plus."
duree: 35
objectifs:
  - "Dérouler l'algorithme des k plus proches voisins"
  - "Écrire un algorithme qui prédit une classe"
prerequis: [premiere-algo/tris, premiere-construits/dictionnaires]
---

Pour deviner la classe d'un nouvel élément, on regarde les **k** éléments connus les **plus proches**. C'est un exemple d'algorithme d'**apprentissage**.

## 1. L'algorithme

1. Calculer la **distance** entre le nouvel élément et chaque élément connu.
2. **Trier** par distance croissante.
3. Garder les **k** premiers.
4. Prédire la **classe majoritaire** parmi eux.

Avec deux caractéristiques, on utilise la distance euclidienne :

$$d = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$$

## 2. Le choix de k

- **k trop petit** : une seule donnée erronée peut tromper l'algorithme.
- **k trop grand** : on fait voter des éléments qui ne ressemblent plus au nouvel élément.
- Avec deux classes, on choisit k **impair** pour éviter les égalités.

:::exemple
Avec k = 3, les trois voisins les plus proches sont de classes A, B, A : on prédit **A**.
:::

## L'essentiel

- Distances, tri, k premiers, classe majoritaire.
- Distance euclidienne : √((x₂ − x₁)² + (y₂ − y₁)²).
- Le choix de k influence le résultat ; k impair pour deux classes.

## Exercices

::::exercice[QCM : k plus proches voisins]{niveau=1 type=quiz}
Une question à la fois : la correction s'affiche aussitôt.

1. À quoi sert l'algorithme des k plus proches voisins ?

   - [ ] à trier un tableau
   - [x] à prédire la classe d'une donnée nouvelle
   - [ ] à chercher un élément dans un tableau trié
   - [ ] à compresser des données

   > C'est un algorithme de classification.

1. Que vaut la distance euclidienne entre (1, 2) et (4, 6) ?

   - [ ] 7
   - [x] 5
   - [ ] 25
   - [ ] 3

   > √(3² + 4²) = √25 = 5.

1. Avec k = 3, les trois plus proches voisins sont de classes A, B, A. Quelle classe prédit-on ?

   - [x] A
   - [ ] B
   - [ ] aucune, il y a égalité
   - [ ] la classe du plus lointain

   > Vote majoritaire : 2 contre 1.

1. Pourquoi choisir k impair quand il y a deux classes ?

   - [ ] pour aller plus vite
   - [x] pour éviter les égalités au vote
   - [ ] parce que k pair provoque une erreur
   - [ ] pour avoir plus de voisins

   > Avec k = 4, on pourrait avoir 2 contre 2.

1. Quel est le défaut de k = 1 ?

   - [ ] il est trop lent
   - [x] une seule donnée mal étiquetée peut fausser la prédiction
   - [ ] il donne toujours la même classe
   - [ ] il ne marche pas

   > On ne se fie qu'à un seul exemple.

1. Que se passe-t-il si k est égal au nombre total de données ?

   - [ ] la prédiction est parfaite
   - [x] on prédit toujours la classe la plus fréquente du jeu de données
   - [ ] l'algorithme plante
   - [ ] on prédit toujours la classe du plus proche

   > Toutes les données votent, quelle que soit la nouvelle.

1. Dans l'algorithme, que trie-t-on ?

   - [ ] les classes par ordre alphabétique
   - [x] les distances à la nouvelle donnée, avec leur classe
   - [ ] les données par première caractéristique
   - [ ] les votes

   > On garde le lien entre chaque distance et sa classe.

1. Quelle structure est pratique pour compter les votes ?

   - [ ] un p-uplet
   - [x] un dictionnaire classe → nombre de votes
   - [ ] une chaîne
   - [ ] un booléen

   > Le schéma de comptage des occurrences.

1. L'algorithme des k plus proches voisins est un exemple :

   - [ ] d'algorithme glouton
   - [x] d'apprentissage supervisé
   - [ ] de tri
   - [ ] de recherche dichotomique

   > Il apprend à partir d'exemples dont la classe est connue.
::::

::::exercice[Dérouler à la main]{niveau=1 type=completer}
On veut classer le point P = (2, 2) avec k = 3. Complète le tableau en donnant le **carré** de la distance à P, puis la réponse.

```python calcul
pts = [((2, 3), "A"), ((5, 2), "B"), ((1, 1), "A"), ((2, 6), "B")]
for (x, y), c in pts:
    print((x - 2) ** 2 + (y - 2) ** 2)
print("A")
```

| Point | Classe | Carré de la distance à P |
| --- | --- | --- |
| (2, 3) | A | [[1]] |
| (5, 2) | B | [[9]] |
| (1, 1) | A | [[2]] |
| (2, 6) | B | [[16]] |

La classe prédite est : [[A]]

:::corrige
Les trois plus proches sont (2, 3), (1, 1) et (5, 2), de classes A, A et B. La classe majoritaire est A.
:::
::::

::::exercice[Compter les votes]{niveau=1 type=completer}
Cette fonction renvoie la classe la plus fréquente d'un tableau non vide. Complète-la.

```python trous
def majoritaire(classes):
    votes = {}
    for c in classes:
        if c [[in]] votes:
            votes[c] = votes[c] + 1
        else:
            votes[c] = [[1]]
    gagnant = classes[0]
    for c in votes:
        if votes[c] > votes[[[gagnant]]]:
            gagnant = [[c]]
    return gagnant
```
::::

::::exercice[Distance et plus proche voisin]{niveau=1}
Écris `distance(a, b)` qui renvoie la distance euclidienne entre deux points `(x, y)`, puis `plus_proche(points, p)` qui renvoie le point de
la liste (non vide) `points` le plus proche de `p`.

```python depart
from math import sqrt

def distance(a, b):
    ...

def plus_proche(points, p):
    ...
```

```python tests
assert distance((1, 2), (4, 6)) == 5, "triangle 3-4-5"
assert distance((0, 0), (0, 0)) == 0, "même point"
assert plus_proche([(0, 0), (5, 5), (2, 1)], (3, 2)) == (2, 1), "plus proche"
assert plus_proche([(7, 7)], (0, 0)) == (7, 7), "un seul point"
```

:::corrige
```python solution
from math import sqrt

def distance(a, b):
    return sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2)

def plus_proche(points, p):
    meilleur = points[0]
    for q in points:
        if distance(q, p) < distance(meilleur, p):
            meilleur = q
    return meilleur
```

C'est k-NN avec k = 1 : une recherche de **minimum** sur les distances.
:::
::::

::::exercice[Écrire k-NN]{niveau=2}
Écris `knn(donnees, nouveau, k)` où `donnees` est une liste de triplets `(x, y, classe)` et `nouveau` un couple `(x, y)`. La fonction renvoie la
classe majoritaire parmi les k plus proches voisins. En cas d'égalité au vote, renvoie la classe du **plus proche** voisin parmi les classes à
égalité. Tu peux utiliser `sorted` et la fonction `distance` de l'exercice précédent.

```python depart
from math import sqrt

def distance(a, b):
    return sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2)

def knn(donnees, nouveau, k):
    ...
```

```python tests
iris = [
    (1.4, 0.2, "setosa"), (1.3, 0.2, "setosa"), (1.5, 0.3, "setosa"),
    (4.7, 1.4, "versicolor"), (4.5, 1.5, "versicolor"), (4.0, 1.3, "versicolor"),
    (6.0, 2.5, "virginica"), (5.1, 1.9, "virginica"), (5.9, 2.1, "virginica"),
]
assert knn(iris, (4.9, 1.6), 3) == "versicolor", "fleur moyenne"
assert knn(iris, (1.6, 0.4), 3) == "setosa", "petite fleur"
assert knn(iris, (5.8, 2.2), 1) == "virginica", "k = 1"
assert knn([(0, 0, "A"), (3, 0, "B")], (1, 0), 2) == "A", "égalité : le plus proche gagne"
```

:::corrige
```python solution
from math import sqrt

def distance(a, b):
    return sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2)

def premier(couple):
    return couple[0]

def knn(donnees, nouveau, k):
    distances = [(distance(d, nouveau), d[2]) for d in donnees]
    voisins = sorted(distances, key=premier)
    votes = {}
    for i in range(k):
        classe = voisins[i][1]
        if classe in votes:
            votes[classe] = votes[classe] + 1
        else:
            votes[classe] = 1
    gagnant = None
    for i in range(k):
        classe = voisins[i][1]
        if gagnant is None or votes[classe] > votes[gagnant]:
            gagnant = classe
    return gagnant
```

Pour départager les égalités, on parcourt les voisins **du plus proche au plus lointain** et on ne remplace le gagnant que si une classe a
**strictement** plus de votes : à égalité, la classe rencontrée en premier (la plus proche) reste.
:::
::::
