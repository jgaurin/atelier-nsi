---
titre: k plus proches voisins
resume: "Le cours de première NSI sur l'algorithme des k plus proches voisins (k-NN) : classer une donnée nouvelle d'après les données connues les plus proches, distance euclidienne, choix de k, vote majoritaire, mise en œuvre en Python sur une table, limites et lien avec l'apprentissage automatique."
duree: 50
objectifs:
  - "Expliquer le principe de l'algorithme des k plus proches voisins"
  - "Calculer une distance euclidienne entre deux données"
  - "Écrire l'algorithme en Python : distances, tri, vote majoritaire"
  - "Discuter l'influence de k et les limites de la méthode"
prerequis: [nsi-premiere/tables, nsi-premiere/tris, nsi-premiere/dictionnaires]
programme: [nsi1-algo]
cartes:
  - q: "Principe des k plus proches voisins ?"
    r: "Pour **classer** une donnée nouvelle, on cherche les **k** données connues les plus **proches** (distance), et on lui attribue la **classe majoritaire** parmi elles."
  - q: "Distance euclidienne entre (x₁, y₁) et (x₂, y₂) ?"
    r: "√((x₂ − x₁)² + (y₂ − y₁)²). En Python : `math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)`."
  - q: "Les étapes de l'algorithme ?"
    r: "1. Calculer la distance de la nouvelle donnée à **chaque** donnée connue. 2. **Trier** par distance croissante. 3. Garder les **k** premières. 4. **Vote** : la classe la plus fréquente."
  - q: "Pourquoi choisir k impair pour deux classes ?"
    r: "Pour éviter les **égalités** lors du vote."
  - q: "Effet de k trop petit ou trop grand ?"
    r: "k = 1 : sensible au **bruit** (une donnée erronée suffit). k trop grand : on vote avec des données **lointaines**, la classe majoritaire de tout le jeu l'emporte."
  - q: "Pourquoi normaliser les données ?"
    r: "Si une caractéristique a des valeurs bien plus grandes (en cm contre en kg…), elle **écrase** les autres dans la distance."
---

Comment une application devine-t-elle l'espèce d'une fleur à partir d'une photo, ou le genre musical d'un morceau ? Une des méthodes les plus
simples d'**apprentissage automatique** consiste à regarder les **exemples connus les plus ressemblants** : c'est l'algorithme des **k plus
proches voisins** (k-NN en anglais). Il réutilise tout ce qui a été vu dans l'année : tables, distances, tri, dictionnaires.

## Ce que dit le programme

Contenus : *algorithme des k plus proches voisins*. Capacités attendues : **écrire un algorithme qui prédit la classe d'un élément en fonction
de la classe majoritaire de ses k plus proches voisins**. Le programme précise : il s'agit d'un exemple d'algorithme d'**apprentissage**.

## 1. Le principe

On dispose d'un **jeu de données** dont la **classe** est connue. Exemple : des fleurs d'iris, décrites par deux caractéristiques (longueur et
largeur du pétale, en cm), avec leur espèce.

| Longueur | Largeur | Espèce |
| --- | --- | --- |
| 1,4 | 0,2 | setosa |
| 1,3 | 0,2 | setosa |
| 1,5 | 0,3 | setosa |
| 4,7 | 1,4 | versicolor |
| 4,5 | 1,5 | versicolor |
| 4,0 | 1,3 | versicolor |
| 6,0 | 2,5 | virginica |
| 5,1 | 1,9 | virginica |
| 5,9 | 2,1 | virginica |

Une nouvelle fleur a un pétale de 4,9 cm sur 1,6 cm. Pour deviner son espèce, avec **k = 3** :

1. on calcule sa **distance** à chacune des fleurs connues ;
2. on garde les **3 plus proches** ;
3. on attribue la **classe majoritaire** parmi ces 3.

Graphiquement, chaque fleur est un **point** ; on trace un cercle autour du nouveau point jusqu'à englober ses k voisins.

## 2. La distance

Pour deux données à deux caractéristiques, on utilise en général la **distance euclidienne** (la distance « à vol d'oiseau » du plan) :

$$d = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$$

```python exec
from math import sqrt

def distance(a, b):
    """a et b sont des couples (longueur, largeur)."""
    return sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2)

print(round(distance((4.9, 1.6), (4.7, 1.4)), 3))
print(round(distance((4.9, 1.6), (1.4, 0.2)), 3))
```

Avec plus de caractéristiques, on ajoute un carré par caractéristique. On peut aussi utiliser d'autres distances, comme la distance de
**Manhattan** (|x₂ − x₁| + |y₂ − y₁|).

## 3. L'algorithme en Python

```python exec
from math import sqrt

iris = [
    (1.4, 0.2, "setosa"), (1.3, 0.2, "setosa"), (1.5, 0.3, "setosa"),
    (4.7, 1.4, "versicolor"), (4.5, 1.5, "versicolor"), (4.0, 1.3, "versicolor"),
    (6.0, 2.5, "virginica"), (5.1, 1.9, "virginica"), (5.9, 2.1, "virginica"),
]

def distance(a, b):
    return sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2)

def premier(couple):
    return couple[0]

def knn(donnees, nouveau, k):
    # 1. distances à toutes les données connues
    distances = []
    for d in donnees:
        distances.append((distance(d, nouveau), d[2]))
    # 2. tri par distance croissante, 3. les k premières
    voisins = sorted(distances, key=premier)[:k]
    # 4. vote majoritaire
    votes = {}
    for dist, classe in voisins:
        if classe in votes:
            votes[classe] = votes[classe] + 1
        else:
            votes[classe] = 1
    gagnant = None
    for classe in votes:
        if gagnant is None or votes[classe] > votes[gagnant]:
            gagnant = classe
    return gagnant

print(knn(iris, (4.9, 1.6), 3))
print(knn(iris, (1.6, 0.4), 3))
```

On retrouve les briques de l'année : un **parcours** pour les distances, un **tri** selon une colonne, un **dictionnaire** pour compter les
votes, une **recherche de maximum** pour le gagnant.

## 4. Le choix de k

- **k = 1** : la nouvelle donnée prend la classe de son voisin le plus proche. Très sensible au **bruit** : une seule donnée mal étiquetée
  suffit à tromper.
- **k trop grand** : on fait voter des données **lointaines**, qui ne ressemblent plus à la nouvelle ; à la limite (k = taille du jeu), on
  renvoie toujours la classe la plus fréquente.
- Avec **deux classes**, on choisit k **impair** pour éviter les égalités.

En pratique, on choisit k en **testant** : on cache une partie des données dont on connaît la classe, on les classe avec l'algorithme, et on
mesure le **taux de réussite** pour plusieurs valeurs de k.

## 5. Limites et enjeux

- **Normalisation** : si une caractéristique est en milliers (un salaire) et une autre en unités (un âge), la première **écrase** la seconde
  dans la distance. On ramène chaque caractéristique sur une même échelle.
- **Coût** : pour chaque prédiction, on calcule la distance à **toutes** les données, puis on trie : c'est lent pour des millions de données.
- **Qualité des données** : l'algorithme ne fait que reproduire ce qu'il a vu. Des données biaisées donnent des prédictions biaisées (voir les
  enjeux de l'IA : recrutement, crédit, reconnaissance faciale).
- C'est un algorithme d'**apprentissage supervisé** : il apprend à partir d'exemples étiquetés.

## Les erreurs classiques des élèves

:::attention[Ce que tu verras en classe]
- **Oublier la racine carrée** ou mettre les carrés au mauvais endroit (c'est sans conséquence pour le classement, mais ce n'est plus la
  distance).
- **Trier les données** au lieu de trier les **distances**, ou perdre la classe associée à chaque distance.
- **Prendre les k plus éloignés** (tri dans le mauvais sens).
- **Mal gérer le vote** : renvoyer le nombre de votes au lieu de la classe.
- **Croire que k-NN « comprend »** : il compare des nombres, rien de plus.
:::

## En classe

:::methode[Activités qui marchent]
1. **Débranché** : des points colorés sur une feuille, un point gris à classer ; on trace des cercles pour k = 1, 3, 5.
2. **Iris de Fisher** (jeu de données classique) ou **Pokémon** (type selon attaque et défense) : charger le CSV, classer, tracer avec
   matplotlib.
3. **Mesurer le taux de réussite** selon k avec un jeu de test.
4. **Débat** sur les biais des données et les décisions automatiques.
:::

## L'essentiel

- **k-NN** : classer une donnée nouvelle d'après la **classe majoritaire** de ses **k plus proches voisins**.
- **Distance euclidienne** : √((x₂ − x₁)² + (y₂ − y₁)²).
- Étapes : distances à toutes les données, **tri** croissant, **k premières**, **vote** (dictionnaire).
- **k** : trop petit, sensible au bruit ; trop grand, peu précis ; impair pour deux classes ; on le choisit en testant.
- Limites : **normalisation**, coût, **biais** des données. C'est de l'**apprentissage supervisé**.

## Exercices

::::exercice[Grand QCM : k plus proches voisins]{niveau=1 type=quiz}
Dix questions sur l'algorithme des k plus proches voisins.

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

1. Pourquoi normaliser les caractéristiques ?

   - [ ] pour que les calculs soient exacts
   - [x] pour qu'une caractéristique aux grandes valeurs n'écrase pas les autres
   - [ ] pour réduire le nombre de données
   - [ ] pour éviter les égalités

   > Une différence de 1 000 € pèse bien plus qu'une différence de 2 ans.

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

::::exercice[Mesurer le taux de réussite]{niveau=2}
Pour choisir k, on sépare les données en un jeu d'**apprentissage** et un jeu de **test** dont on connaît aussi les classes. Écris
`taux_reussite(apprentissage, test, k)` qui renvoie la proportion (entre 0 et 1) des données de test bien classées par k-NN. La fonction `knn`
de l'exercice précédent est fournie.

```python depart
from math import sqrt

def distance(a, b):
    return sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2)

def knn(donnees, nouveau, k):
    voisins = sorted([(distance(d, nouveau), d[2]) for d in donnees])[:k]
    votes = {}
    for _, c in voisins:
        votes[c] = votes.get(c, 0) + 1
    gagnant = None
    for _, c in voisins:
        if gagnant is None or votes[c] > votes[gagnant]:
            gagnant = c
    return gagnant

def taux_reussite(apprentissage, test, k):
    ...
```

```python tests
appr = [(1, 1, "A"), (1, 2, "A"), (2, 1, "A"), (8, 8, "B"), (8, 9, "B"), (9, 8, "B")]
test = [(1.5, 1.5, "A"), (8.5, 8.5, "B"), (2, 2, "A"), (4, 4, "B")]
assert taux_reussite(appr, test, 1) == 0.75, "trois sur quatre"
assert taux_reussite(appr, [(1, 1, "A")], 3) == 1, "parfait"
assert taux_reussite(appr, [(1, 1, "B")], 3) == 0, "raté"
```

:::corrige
```python solution
from math import sqrt

def distance(a, b):
    return sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2)

def knn(donnees, nouveau, k):
    voisins = sorted([(distance(d, nouveau), d[2]) for d in donnees])[:k]
    votes = {}
    for _, c in voisins:
        votes[c] = votes.get(c, 0) + 1
    gagnant = None
    for _, c in voisins:
        if gagnant is None or votes[c] > votes[gagnant]:
            gagnant = c
    return gagnant

def taux_reussite(apprentissage, test, k):
    bons = 0
    for x, y, classe in test:
        if knn(apprentissage, (x, y), k) == classe:
            bons = bons + 1
    return bons / len(test)
```

Le point (4, 4) est plus proche du groupe A : la prédiction est A alors que sa classe est B. On recommence pour k = 1, 3, 5… et
on garde la valeur qui donne le meilleur taux.
:::
::::

::::exercice[Les limites de k-NN]{niveau=2}
Une banque veut utiliser k-NN pour décider d'accorder un prêt, à partir de deux caractéristiques : le **revenu annuel** (entre 15 000 et
120 000 €) et l'**âge** (entre 18 et 80 ans), et de l'historique de ses anciens clients (remboursé ou non). Explique deux problèmes de cette
démarche, l'un technique, l'autre éthique, et propose une réponse pour chacun.

:::criteres
- Technique : l'échelle du revenu écrase celle de l'âge dans la distance ; réponse : normaliser (ramener chaque caractéristique entre 0 et 1).
- Éthique : les décisions passées peuvent être biaisées (discriminations), l'algorithme les reproduit ; réponse : auditer les données,
  garder une décision humaine, expliquer la décision au client.
- Une mention du choix de k ou de la qualité des données est un plus.
:::

:::corrige
**Problème technique** : dans la distance, une différence de revenu de 10 000 € compte 10 000 fois plus qu'une différence d'âge d'un an.
L'âge ne sert donc à rien. Réponse : **normaliser** chaque caractéristique, par exemple (valeur − minimum) / (maximum − minimum), pour la
ramener entre 0 et 1. **Problème éthique** : k-NN ne fait que **reproduire** les décisions et les situations passées. Si certains clients ont
été historiquement défavorisés (selon leur quartier, leur âge…), l'algorithme reproduira ces **biais**, sans pouvoir l'expliquer. Réponses :
vérifier les données d'apprentissage, mesurer les taux d'erreur selon les groupes, garder une **décision humaine** et pouvoir **justifier** la
décision au client (c'est d'ailleurs une exigence du RGPD pour les décisions automatisées).
:::
::::
