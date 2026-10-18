---
titre: Les k plus proches voisins
resume: Prédire la classe d'une nouvelle donnée à partir des données connues qui lui ressemblent le plus — un premier algorithme d'apprentissage automatique.
duree: 60
objectifs:
  - Expliquer le principe de la classification supervisée et de l'algorithme des k plus proches voisins
  - Calculer des distances (euclidienne, de Manhattan) et programmer l'algorithme
  - Évaluer un classifieur sur des données de test et discuter le choix de k
  - Identifier les limites (coût, normalisation des attributs, biais des données)
prerequis: [python/tuples-dictionnaires, algo/complexite]
programme: [nsi1-algo, asd-recherche-tris, id-tables]
cartes:
  - q: Principe de l'algorithme des k plus proches voisins ?
    r: "Pour classer une nouvelle donnée, on cherche les `k` données connues les plus proches (selon une distance) et on lui attribue la classe majoritaire parmi elles."
  - q: Distance euclidienne entre $(x_1, y_1)$ et $(x_2, y_2)$ ?
    r: "$\\sqrt{(x_1 - x_2)^2 + (y_1 - y_2)^2}$."
  - q: Distance de Manhattan ?
    r: "$|x_1 - x_2| + |y_1 - y_2|$ (la somme des écarts sur chaque attribut)."
  - q: Pourquoi normaliser les attributs ?
    r: "Si un attribut a des valeurs beaucoup plus grandes (un salaire contre un âge), il écrase les autres dans le calcul de la distance."
  - q: Effet d'un `k` trop petit ? trop grand ?
    r: "Trop petit (k = 1) : très sensible au bruit et aux erreurs d'étiquetage. Trop grand : la classe majoritaire globale l'emporte, les frontières s'effacent."
  - q: Coût de la classification d'un point avec n données connues ?
    r: "Calcul de n distances, puis sélection des k plus petites : $\\Theta(n \\log n)$ avec un tri, $\\Theta(n \\cdot k)$ ou $\\Theta(n)$ avec une sélection."
---

Une application doit deviner si un message est un spam, si un champignon photographié est comestible, quel film
recommander. Personne n'écrit la règle à la main : on part d'**exemples déjà étiquetés** et on prédit la réponse pour un
nouvel exemple en regardant les exemples **qui lui ressemblent**. L'algorithme des **k plus proches voisins** (kNN, pour
*k nearest neighbours*) est la version la plus simple de cette idée. Il est au programme de première NSI, et c'est une
porte d'entrée vers l'**apprentissage automatique** (et vers les questions éthiques qu'il pose).

## 1. Classer à partir d'exemples

:::definition
En **classification supervisée**, on dispose d'un **jeu de données étiquetées** : chaque donnée est décrite par des
**attributs** numériques (taille, poids, âge…) et appartient à une **classe** connue. On veut prédire la classe d'une
**nouvelle** donnée, dont on ne connaît que les attributs.
:::

Exemple : des fleurs d'iris décrites par la longueur et la largeur de leurs pétales (en cm), et leur espèce.

| longueur | largeur | espèce      |
|----------|---------|-------------|
| 1,4      | 0,2     | setosa      |
| 1,3      | 0,2     | setosa      |
| 1,5      | 0,3     | setosa      |
| 4,7      | 1,4     | versicolor  |
| 4,5      | 1,5     | versicolor  |
| 4,0      | 1,3     | versicolor  |
| 6,0      | 2,5     | virginica   |
| 5,1      | 1,9     | virginica   |
| 5,9      | 2,1     | virginica   |

Une nouvelle fleur a des pétales de 4,9 × 1,6 cm : de quelle espèce est-elle ?

## 2. Mesurer la ressemblance : une distance

Chaque donnée est vue comme un **point** dans l'espace des attributs. Deux données se ressemblent si leurs points sont
**proches**. Les distances les plus utilisées :

- **euclidienne** (la distance « à vol d'oiseau ») : $d(A, B) = \sqrt{\sum_i (a_i - b_i)^2}$ ;
- **de Manhattan** (comme dans une ville en quadrillage) : $d(A, B) = \sum_i |a_i - b_i|$.

```python exec
from math import sqrt

def distance_euclidienne(a, b):
    return sqrt(sum((x - y) ** 2 for x, y in zip(a, b)))

def distance_manhattan(a, b):
    return sum(abs(x - y) for x, y in zip(a, b))

print(distance_euclidienne((4.9, 1.6), (4.7, 1.4)), distance_manhattan((4.9, 1.6), (4.7, 1.4)))
```

## 3. L'algorithme

1. Calculer la distance entre la nouvelle donnée et **chaque** donnée connue.
2. Garder les **k** données les plus proches.
3. Attribuer la classe **majoritaire** parmi ces `k` voisins.

```python exec
from math import sqrt

fleurs = [((1.4, 0.2), "setosa"), ((1.3, 0.2), "setosa"), ((1.5, 0.3), "setosa"),
          ((4.7, 1.4), "versicolor"), ((4.5, 1.5), "versicolor"), ((4.0, 1.3), "versicolor"),
          ((6.0, 2.5), "virginica"), ((5.1, 1.9), "virginica"), ((5.9, 2.1), "virginica")]

def distance(a, b):
    return sqrt(sum((x - y) ** 2 for x, y in zip(a, b)))

def knn(donnees, point, k):
    voisins = sorted(donnees, key=lambda d: distance(d[0], point))[:k]
    votes = {}
    for _, classe in voisins:
        votes[classe] = votes.get(classe, 0) + 1
    return max(votes, key=votes.get), voisins

classe, voisins = knn(fleurs, (4.9, 1.6), 3)
print(classe)
for attributs, c in voisins:
    print(attributs, c, round(distance(attributs, (4.9, 1.6)), 3))
```

Les trois voisins les plus proches de (4,9 ; 1,6) sont deux *versicolor* et une *virginica* : la prédiction est
**versicolor**.

**Coût.** Pour $n$ données connues : $n$ calculs de distance, puis un tri en $\Theta(n \log n)$ (on peut faire mieux en
ne gardant que les `k` meilleurs au fil du parcours : $\Theta(nk)$). Il n'y a **pas d'apprentissage préalable** : tout le
travail est fait au moment de la prédiction, ce qui devient coûteux avec des millions de données.

## 4. Choisir k et évaluer

Le résultat dépend de `k`. Avec `k = 1`, une seule donnée mal étiquetée suffit à fausser les prédictions autour d'elle ;
avec `k` très grand (jusqu'à $n$), on prédit toujours la classe la plus fréquente. Avec deux classes, on prend `k` impair
pour éviter les égalités de votes.

Pour choisir `k` et mesurer la qualité du classifieur, on **met de côté** une partie des données étiquetées (le **jeu de
test**), on prédit leur classe à partir des autres (le **jeu d'apprentissage**) et on compte la proportion de bonnes
réponses (l'**exactitude**). Ne jamais évaluer sur les données qui servent à prédire : avec `k = 1`, chaque point serait
son propre voisin et l'exactitude serait de 100 %, sans rien prouver.

### Normaliser les attributs

Si un attribut se mesure en milliers (un revenu) et un autre en unités (un nombre d'enfants), le premier domine la
distance. On **normalise** chaque attribut, par exemple en le ramenant entre 0 et 1 :
$x' = \frac{x - \min}{\max - \min}$.

:::attention
Un classifieur reproduit les régularités — et les **biais** — des données d'apprentissage. Si un groupe est
sous-représenté ou si les étiquettes passées étaient injustes, les prédictions le seront aussi. C'est un point de
vigilance éthique majeur pour tout système de décision automatique (et un thème à aborder avec les élèves).
:::

:::prof
Le programme de première NSI demande d'« écrire un algorithme qui prédit la classe d'un élément en fonction de la
classe majoritaire de ses k plus proches voisins ». L'activité classique utilise le jeu de données Iris (Fisher, 1936)
ou des personnages fictifs. Faire placer les points sur un graphique (avec `matplotlib`) et faire varier `k` montre
l'influence du choix. C'est aussi l'occasion d'un échange sur les biais des données (lien avec l'entretien et les valeurs
d'égalité).
:::

## Exemple guidé

**Problème.** Évaluer l'algorithme sur les fleurs ci-dessus par la méthode « **leave-one-out** » : on retire chaque fleur à
tour de rôle, on prédit sa classe à partir des 8 autres, et on compte les erreurs. Comparer `k = 1`, `k = 3` et `k = 5`.

```python exec
from math import sqrt

fleurs = [((1.4, 0.2), "setosa"), ((1.3, 0.2), "setosa"), ((1.5, 0.3), "setosa"),
          ((4.7, 1.4), "versicolor"), ((4.5, 1.5), "versicolor"), ((4.0, 1.3), "versicolor"),
          ((6.0, 2.5), "virginica"), ((5.1, 1.9), "virginica"), ((5.9, 2.1), "virginica")]

def distance(a, b):
    return sqrt(sum((x - y) ** 2 for x, y in zip(a, b)))

def knn(donnees, point, k):
    voisins = sorted(donnees, key=lambda d: distance(d[0], point))[:k]
    votes = {}
    for _, c in voisins:
        votes[c] = votes.get(c, 0) + 1
    return max(votes, key=votes.get)

for k in (1, 3, 5):
    erreurs = 0
    for i, (attributs, vraie) in enumerate(fleurs):
        autres = fleurs[:i] + fleurs[i + 1:]
        if knn(autres, attributs, k) != vraie:
            erreurs += 1
    print(f"k = {k} : {erreurs} erreur(s) sur {len(fleurs)}, exactitude {1 - erreurs / len(fleurs):.0%}")
```

**Lecture.** Avec `k = 1` et `k = 3`, une seule erreur : la *virginica* (5,1 ; 1,9), plus proche des *versicolor* que des
autres *virginica*. Avec `k = 5`, **toutes** les prédictions sont fausses : une fleur retirée n'a plus que 2 voisines de
son espèce (chaque classe n'en compte que 3), et les 3 autres voisins, d'une même autre espèce, l'emportent. Sur un si
petit jeu de données, un `k` trop grand noie les petites classes. Sur de vraies données (les 150 iris de Fisher), on
obtient en général une exactitude d'environ 95 % pour `k` entre 3 et 15.

## L'essentiel

- Classification supervisée : des données **étiquetées**, on prédit la classe d'une nouvelle donnée.
- kNN : distances à toutes les données connues, les `k` plus proches, **vote majoritaire**.
- Distances : euclidienne $\sqrt{\sum (a_i - b_i)^2}$, Manhattan $\sum |a_i - b_i|$ ; **normaliser** les attributs.
- Coût d'une prédiction : $n$ distances + sélection ($\Theta(n \log n)$ avec un tri) ; pas de phase d'apprentissage.
- `k` : petit = sensible au bruit, grand = frontières floues ; impair pour 2 classes ; choisir avec un **jeu de test**.
- Les données d'apprentissage transmettent leurs **biais** aux prédictions.

## Exercices

::::exercice[Calculer une distance]{niveau=1}
Quelle est la distance de Manhattan entre les points (1, 5) et (4, 1) ? Et la distance euclidienne ?

- [ ] 7 et 7
- [x] 7 et 5
- [ ] 5 et 7
- [ ] 25 et 5

:::corrige
Manhattan : $|1 - 4| + |5 - 1| = 3 + 4 = 7$. Euclidienne : $\sqrt{3^2 + 4^2} = \sqrt{25} = 5$.
:::
::::

::::exercice[Influence de k]{niveau=1}
Dans un jeu de données de 100 exemples, 70 sont de classe A et 30 de classe B. Que prédit l'algorithme des
`k` plus proches voisins avec `k = 100`, pour n'importe quel nouveau point ?

- [x] toujours A
- [ ] toujours B
- [ ] la classe du point le plus proche
- [ ] cela dépend du point

:::corrige
Avec `k = 100`, tous les exemples sont « voisins » : le vote donne toujours la classe majoritaire globale, A. C'est la
limite des `k` trop grands.
:::
::::

::::exercice[Distance euclidienne]{niveau=2}
Écris `distance(a, b)` qui renvoie la distance euclidienne entre deux points donnés sous forme de tuples de même longueur
(n'importe quelle dimension).

```python depart
from math import sqrt

def distance(a, b):
    ...
```

```python tests
assert distance((1, 5), (4, 1)) == 5, "triangle 3-4-5"
assert distance((0, 0, 0), (1, 2, 2)) == 3, "dimension 3"
assert distance((2,), (7,)) == 5, "dimension 1"
assert distance((1.5, 2.5), (1.5, 2.5)) == 0, "même point"
```

:::corrige
```python solution
from math import sqrt

def distance(a, b):
    s = 0
    for i in range(len(a)):
        s += (a[i] - b[i]) ** 2
    return sqrt(s)
```
Version compacte : `sqrt(sum((x - y) ** 2 for x, y in zip(a, b)))`. Le module `math` fournit aussi `math.dist(a, b)`.
:::
::::

::::exercice[Les k plus proches]{niveau=2}
Les données sont une liste de couples `(point, classe)`. Écris `plus_proches(donnees, point, k)` qui renvoie la liste des
**classes** des `k` données les plus proches de `point`, de la plus proche à la moins proche (distance euclidienne).

```python depart
from math import sqrt

def plus_proches(donnees, point, k):
    ...
```

```python tests
d = [((0, 0), "a"), ((5, 5), "b"), ((1, 0), "a"), ((6, 5), "b"), ((0, 2), "c")]
assert plus_proches(d, (0, 0), 2) == ["a", "a"], "deux plus proches"
assert plus_proches(d, (5, 4), 1) == ["b"], "un voisin"
assert plus_proches(d, (0, 1.5), 3) == ["c", "a", "a"], "trois voisins dans l'ordre"
```

:::corrige
```python solution
from math import sqrt

def plus_proches(donnees, point, k):
    def dist(d):
        return sqrt(sum((x - y) ** 2 for x, y in zip(d[0], point)))
    tries = sorted(donnees, key=dist)
    return [classe for _, classe in tries[:k]]
```
`sorted` avec `key` trie selon la distance calculée pour chaque donnée. Pour `(0, 1.5)` : `(0, 2)` à 0,5, `(0, 0)` à 1,5,
`(1, 0)` à environ 1,80.
:::
::::

::::exercice[Vote majoritaire]{niveau=2}
Écris `vote(classes)` qui renvoie la classe la plus fréquente d'une liste non vide. En cas d'égalité, on renvoie celle qui
apparaît **en premier** dans la liste (c'est-à-dire celle du voisin le plus proche).

```python depart
def vote(classes):
    ...
```

```python tests
assert vote(["a", "b", "a"]) == "a", "majorité simple"
assert vote(["b", "a", "a", "b"]) == "b", "égalité : la première rencontrée"
assert vote(["c"]) == "c", "un seul voisin"
assert vote(["x", "y", "z", "y"]) == "y", "majorité relative"
```

:::corrige
```python solution
def vote(classes):
    compte = {}
    for c in classes:
        compte[c] = compte.get(c, 0) + 1
    meilleure = classes[0]
    for c in classes:
        if compte[c] > compte[meilleure]:
            meilleure = c
    return meilleure
```
En parcourant `classes` dans l'ordre et en ne remplaçant qu'avec `>` strict, la première classe rencontrée gagne les égalités.
:::
::::

::::exercice[Normaliser]{niveau=3}
Écris `normaliser(points)` qui renvoie une nouvelle liste de points (tuples) dont chaque coordonnée est ramenée dans
$[0, 1]$ par $x' = \frac{x - \min}{\max - \min}$, colonne par colonne. Si une colonne est constante, ses valeurs deviennent 0.

```python depart
def normaliser(points):
    ...
```

```python tests
r = normaliser([(1, 100), (3, 300), (2, 200)])
assert r == [(0.0, 0.0), (1.0, 1.0), (0.5, 0.5)], "deux colonnes"
assert normaliser([(5, 1), (5, 3)]) == [(0, 0.0), (0, 1.0)], "colonne constante"
assert normaliser([]) == [], "aucun point"
```

:::corrige
```python solution
def normaliser(points):
    if not points:
        return []
    dim = len(points[0])
    mins = [min(p[j] for p in points) for j in range(dim)]
    maxs = [max(p[j] for p in points) for j in range(dim)]
    resultat = []
    for p in points:
        q = []
        for j in range(dim):
            if maxs[j] == mins[j]:
                q.append(0)
            else:
                q.append((p[j] - mins[j]) / (maxs[j] - mins[j]))
        resultat.append(tuple(q))
    return resultat
```
Sans normalisation, dans le premier exemple, la seconde colonne (des centaines) écraserait complètement la première.
:::
::::

::::exercice[Exactitude sur un jeu de test]{niveau=3}
Écris `exactitude(apprentissage, test, k)` : pour chaque donnée `(point, classe)` du jeu de test, prédis sa classe par kNN
à partir du jeu d'apprentissage (distance euclidienne, vote majoritaire, égalité → la classe du voisin le plus proche), et
renvoie la proportion de bonnes prédictions.

```python depart
from math import sqrt

def exactitude(apprentissage, test, k):
    ...
```

```python tests
app = [((0, 0), "a"), ((0, 1), "a"), ((1, 0), "a"), ((5, 5), "b"), ((5, 6), "b"), ((6, 5), "b")]
test = [((0.5, 0.5), "a"), ((5.5, 5.5), "b"), ((4, 4), "b"), ((2, 2), "b")]
assert exactitude(app, test, 3) == 0.75, "3 bonnes réponses sur 4"
assert exactitude(app, test[:2], 1) == 1.0, "tout juste"
assert exactitude(app, [((2, 2), "a")], 1) == 1.0, "(2, 2) est plus près des a"
```

:::corrige
```python solution
from math import sqrt

def exactitude(apprentissage, test, k):
    def predire(point):
        voisins = sorted(apprentissage, key=lambda d: sqrt(sum((x - y) ** 2 for x, y in zip(d[0], point))))[:k]
        classes = [c for _, c in voisins]
        compte = {}
        for c in classes:
            compte[c] = compte.get(c, 0) + 1
        meilleure = classes[0]
        for c in classes:
            if compte[c] > compte[meilleure]:
                meilleure = c
        return meilleure
    bonnes = sum(1 for point, classe in test if predire(point) == classe)
    return bonnes / len(test)
```
Le point `(2, 2)` étiqueté `"b"` dans le test est en réalité plus proche des `"a"` : la prédiction est fausse, d'où 75 %.
:::
::::

::::exercice[Concevoir et critiquer un classifieur]{niveau=4 duree=25}
Un lycée envisage de prédire, en début d'année, les élèves « à risque de décrochage » avec l'algorithme des k plus proches
voisins, à partir des données des années précédentes : moyenne générale de l'an passé (sur 20), nombre d'absences
(de 0 à 200 demi-journées) et âge (en années), et une étiquette « a décroché / n'a pas décroché ».

1. Explique pourquoi il faut normaliser les attributs avant d'appliquer l'algorithme, avec un exemple chiffré.
2. Propose une méthode rigoureuse pour choisir `k` et estimer la fiabilité du classifieur.
3. Évalue le coût d'une prédiction si l'établissement dispose de $n = 20\,000$ élèves étiquetés.
4. Indique au moins trois limites ou risques (techniques et éthiques) de ce projet, et ce que tu répondrais en tant que
   professeur si l'on te demandait de l'utiliser pour orienter tes élèves.

:::criteres
- Normalisation : les absences (0 à 200) ont une étendue bien plus grande que la moyenne (0 à 20) ou l'âge ; un écart de 10 absences pèse autant qu'un écart de 10 points de moyenne, ce qui n'a pas de sens ; exemple chiffré correct ; normalisation min-max ou centrée réduite.
- Choix de k : séparer apprentissage et test (ou validation croisée / leave-one-out), tester plusieurs valeurs de k, retenir la meilleure exactitude, puis évaluer sur des données jamais utilisées ; regarder aussi les erreurs par classe (faux négatifs).
- Coût : 20 000 distances (3 attributs) puis sélection des k plus proches : de l'ordre de $n \log n$ avec un tri, ou $nk$ ; négligeable pour un ordinateur (millisecondes).
- Limites : classes déséquilibrées (peu de décrocheurs → exactitude trompeuse), biais des données passées, attributs incomplets (le décrochage a des causes non mesurées), effet d'étiquette (prophétie autoréalisatrice), données personnelles (RGPD), décision automatique sur des mineurs.
- Posture : l'outil peut au mieux aider à repérer des élèves à accompagner, jamais décider ; transparence, avis humain, cadre légal et éthique, respect des valeurs du service public.
:::

:::corrige
1. Les attributs n'ont pas la même échelle : la moyenne varie de 0 à 20, l'âge sur quelques années, les absences de 0 à 200.
   Entre un élève (12 de moyenne, 10 absences) et un élève (6 de moyenne, 20 absences), la distance euclidienne vaut
   $\sqrt{6^2 + 10^2} \approx 11{,}7$ : les 10 absences d'écart pèsent plus que 6 points de moyenne, simplement à cause de
   l'unité. Il faut ramener chaque attribut sur une échelle comparable (min-max dans $[0, 1]$, ou centrer-réduire).
2. On sépare les données étiquetées en un jeu d'apprentissage et un jeu de test (ou on fait une **validation croisée** /
   leave-one-out). Pour chaque `k` candidat (1, 3, 5, …, 31), on mesure les performances sur les données de validation,
   on retient le meilleur `k`, puis on estime la fiabilité finale sur des données **jamais** utilisées pour le choix.
   L'exactitude seule ne suffit pas si les décrocheurs sont rares (prédire « ne décroche pas » pour tous donnerait 95 %
   d'exactitude) : on regarde la proportion de décrocheurs effectivement repérés.
3. Une prédiction demande 20 000 calculs de distance (3 soustractions, 3 carrés, une racine) et la sélection des `k` plus
   proches (tri en $\Theta(n \log n)$, environ $3 \times 10^5$ comparaisons, ou $\Theta(nk)$) : quelques millisecondes.
   Le coût n'est pas le problème.
4. Limites et risques : (a) classes déséquilibrées et exactitude trompeuse ; (b) les données passées contiennent des biais
   (selon le milieu social, l'établissement d'origine…) que l'algorithme reproduit ; (c) le décrochage dépend de causes non
   mesurées (santé, famille, harcèlement) : trois attributs ne suffisent pas ; (d) étiqueter un élève « à risque » peut
   modifier le regard porté sur lui (effet Pygmalion inversé) ; (e) il s'agit de données personnelles de mineurs : base
   légale, minimisation, information des familles (RGPD). En tant que professeur, je considérerais un tel outil au mieux
   comme une **aide au repérage**, à croiser avec l'avis de l'équipe pédagogique, jamais comme une décision ou une
   orientation automatique ; la décision reste humaine, transparente et justifiable.
:::
::::
