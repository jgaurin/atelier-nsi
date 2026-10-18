---
titre: Parcours de graphes
resume: Explorer un graphe en largeur (avec une file) ou en profondeur (récursivement ou avec une pile), et s'en servir pour les distances, la connexité, les cycles et l'ordonnancement.
duree: 90
objectifs:
  - Programmer le parcours en largeur et le parcours en profondeur d'un graphe, en marquant les sommets visités
  - Calculer les plus courts chemins (en nombre d'arêtes) avec le parcours en largeur, et reconstruire un chemin
  - Utiliser un parcours pour déterminer la connexité, détecter un cycle, calculer un tri topologique
  - Justifier le coût $\Theta(n + m)$ d'un parcours avec des listes d'adjacence
prerequis: [structures/graphes, structures/piles-files, algo/recursivite]
programme: [asd-graphes, asd-recherche-tris, asd-iter-rec, nsit-algo, m-graphes]
cartes:
  - q: Structure utilisée par le parcours en largeur ? en profondeur ?
    r: "Largeur : une **file**. Profondeur : une **pile** (explicite, ou la pile des appels récursifs)."
  - q: Pourquoi marquer les sommets visités ?
    r: "Pour ne pas traiter deux fois un sommet et ne pas boucler indéfiniment sur un cycle."
  - q: Que calcule le parcours en largeur depuis un sommet s ?
    r: "Les sommets par distance croissante à s ; la distance (en nombre d'arêtes) de s à chaque sommet atteignable, et un plus court chemin grâce au tableau des parents."
  - q: Coût d'un parcours avec des listes d'adjacence ? avec une matrice ?
    r: "$\\Theta(n + m)$ avec des listes ; $\\Theta(n^2)$ avec une matrice."
  - q: Comment compter les composantes connexes d'un graphe non orienté ?
    r: "Pour chaque sommet non encore visité, on lance un parcours (qui marque toute sa composante) et on compte les lancements."
  - q: Qu'est-ce qu'un tri topologique ?
    r: "Un ordre des sommets d'un graphe orienté **sans cycle** tel que pour tout arc u → v, u vient avant v (par exemple l'ordre suffixe inversé d'un parcours en profondeur)."
  - q: Comment détecter un cycle dans un graphe orienté avec un parcours en profondeur ?
    r: "On colore les sommets : blanc (non vu), gris (en cours d'exploration), noir (terminé). Rencontrer un sommet **gris** signifie qu'on a trouvé un cycle."
---

Comment un GPS trouve-t-il un itinéraire ? Comment un réseau social calcule-t-il qu'une personne est « ami d'un ami » ?
Comment un robot sort-il d'un labyrinthe ? Comment un logiciel de compilation décide-t-il dans quel ordre compiler des
fichiers qui dépendent les uns des autres ? Tous partent de la même brique : **parcourir** un graphe, c'est-à-dire visiter
tous les sommets accessibles depuis un point de départ, en suivant les arêtes, sans tourner en rond. Les deux parcours
fondamentaux, **en largeur** et **en profondeur**, sont au programme de terminale et omniprésents dans les sujets.

Dans toute la leçon, le graphe est donné par des **listes d'adjacence** : un dictionnaire sommet → liste de voisins.

## 1. Le parcours en largeur (BFS)

On explore **par couches** : d'abord le départ, puis tous ses voisins, puis les voisins de ses voisins, etc. On utilise une
**file** des sommets découverts mais pas encore traités, et on **marque** chaque sommet dès qu'il est découvert, pour ne
jamais l'ajouter deux fois.

```python exec
from collections import deque

G = {"A": ["B", "C"], "B": ["A", "D", "E"], "C": ["A", "F"],
     "D": ["B"], "E": ["B", "F"], "F": ["C", "E"], "G": ["H"], "H": ["G"]}

def largeur(G, depart):
    vus = {depart}
    file = deque([depart])
    ordre = []
    while file:
        s = file.popleft()
        ordre.append(s)
        for v in G[s]:
            if v not in vus:
                vus.add(v)          # marquer à la découverte
                file.append(v)
    return ordre

print(largeur(G, "A"))
```

```mermaid legende="Parcours en largeur depuis A : couche 0 (A), couche 1 (B, C), couche 2 (D, E, F)"
graph LR
  A((A)) --- B((B))
  A --- C((C))
  B --- D((D))
  B --- E((E))
  C --- F((F))
  E --- F
  G((G)) --- H((H))
```

Ordre de visite : A, B, C, D, E, F. Les sommets G et H ne sont pas atteints : ils ne sont pas dans la même **composante
connexe** que A.

### Plus courts chemins en nombre d'arêtes

Comme le parcours en largeur visite les sommets **par distance croissante**, il calcule les **distances** (en nombre
d'arêtes) depuis le départ. En retenant pour chaque sommet celui qui l'a découvert (son **parent**), on reconstruit un plus
court chemin en remontant.

```python exec
from collections import deque

G = {"A": ["B", "C"], "B": ["A", "D", "E"], "C": ["A", "F"],
     "D": ["B"], "E": ["B", "F"], "F": ["C", "E"], "G": ["H"], "H": ["G"]}

def distances(G, depart):
    dist = {depart: 0}
    parent = {depart: None}
    file = deque([depart])
    while file:
        s = file.popleft()
        for v in G[s]:
            if v not in dist:
                dist[v] = dist[s] + 1
                parent[v] = s
                file.append(v)
    return dist, parent

def chemin(parent, arrivee):
    if arrivee not in parent:
        return None                   # pas atteignable
    c = []
    while arrivee is not None:
        c.append(arrivee)
        arrivee = parent[arrivee]
    return c[::-1]

dist, parent = distances(G, "A")
print(dist)
print(chemin(parent, "F"), chemin(parent, "H"))
```

## 2. Le parcours en profondeur (DFS)

On s'enfonce **le plus loin possible** le long d'un chemin avant de revenir en arrière pour explorer les autres branches,
comme dans un labyrinthe où l'on suivrait toujours le premier couloir non exploré. La version **récursive** est la plus
naturelle :

```python exec
G = {"A": ["B", "C"], "B": ["A", "D", "E"], "C": ["A", "F"],
     "D": ["B"], "E": ["B", "F"], "F": ["C", "E"], "G": ["H"], "H": ["G"]}

def profondeur(G, s, vus=None, ordre=None):
    if vus is None:
        vus, ordre = set(), []
    vus.add(s)
    ordre.append(s)
    for v in G[s]:
        if v not in vus:
            profondeur(G, v, vus, ordre)
    return ordre

def profondeur_iteratif(G, depart):
    vus, ordre = set(), []
    pile = [depart]
    while pile:
        s = pile.pop()
        if s not in vus:
            vus.add(s)
            ordre.append(s)
            for v in reversed(G[s]):     # pour visiter les voisins dans l'ordre de la liste
                if v not in vus:
                    pile.append(v)
    return ordre

print(profondeur(G, "A"), profondeur_iteratif(G, "A"))
```

Ordre : A, B, D, E, F, C. Remplacer la **file** du parcours en largeur par une **pile** donne un parcours en profondeur
(dans la version itérative, on marque au moment où l'on **dépile**, sinon l'ordre diffère du parcours récursif).

:::retenir
Les deux parcours visitent **tous** les sommets atteignables depuis le départ, chacun une seule fois, et examinent chaque
arête au plus deux fois : avec des listes d'adjacence, leur coût est $\Theta(n + m)$ ; avec une matrice d'adjacence, trouver
les voisins coûte $\Theta(n)$ par sommet, d'où $\Theta(n^2)$.
:::

| Parcours   | Structure | Visite                              | Usage typique |
|------------|-----------|-------------------------------------|---------------|
| largeur    | file      | par couches (distance croissante)   | plus court chemin en nombre d'arêtes, « degrés de séparation » |
| profondeur | pile / récursion | branche par branche          | connexité, cycles, tri topologique, labyrinthes, retour sur trace |

## 3. Applications

**Connexité.** Pour un graphe non orienté, on lance un parcours depuis chaque sommet non encore visité : chaque lancement
découvre une **composante connexe**.

**Détection de cycle (graphe orienté).** Pendant un parcours en profondeur, on colore les sommets : **blanc** (pas encore
vu), **gris** (en cours : on est en train d'explorer ses descendants), **noir** (terminé). Si l'on rencontre un arc vers un
sommet **gris**, on revient vers un ancêtre du chemin en cours : c'est un **cycle**.

**Tri topologique.** Dans un graphe orienté **sans cycle** (par exemple des tâches et leurs prérequis), on cherche un ordre
où chaque sommet vient après ses prérequis. L'ordre dans lequel les sommets sont **terminés** (noircis) par le parcours en
profondeur, **inversé**, convient.

```python exec
def tri_topologique(G):
    """G orienté : sommet -> successeurs. Lève ValueError s'il y a un cycle."""
    couleur = {s: "blanc" for s in G}
    ordre = []
    def visiter(s):
        couleur[s] = "gris"
        for v in G[s]:
            if couleur[v] == "gris":
                raise ValueError(f"cycle détecté (arc {s} -> {v})")
            if couleur[v] == "blanc":
                visiter(v)
        couleur[s] = "noir"
        ordre.append(s)              # s est terminé : tous ses successeurs sont déjà dans ordre
    for s in G:
        if couleur[s] == "blanc":
            visiter(s)
    return ordre[::-1]

modules = {"Python": ["Algorithmique", "Données"], "Algorithmique": ["Graphes", "Projet"],
           "Données": ["Projet"], "Graphes": [], "Projet": []}
print(tri_topologique(modules))
try:
    tri_topologique({"a": ["b"], "b": ["c"], "c": ["a"]})
except ValueError as e:
    print(e)
```

:::prof
Le programme de terminale demande de « parcourir un graphe en profondeur d'abord, en largeur d'abord », de « repérer la
présence d'un cycle » et de « chercher un chemin dans un graphe ». Une activité débranchée très efficace : faire parcourir
un plan (ou le graphe de la classe sur un tableau) en notant la file ou la pile à chaque étape. L'erreur fréquente est
d'oublier de marquer les sommets (boucle infinie sur un cycle) ou de les marquer trop tard dans le BFS (un sommet ajouté
plusieurs fois dans la file).
:::

## Exemple guidé

**Problème.** Un labyrinthe est une grille de caractères : `#` pour un mur, `.` pour une case libre, `D` le départ et `S`
la sortie. On se déplace d'une case libre à une case libre voisine (haut, bas, gauche, droite). Trouver le nombre minimal de
déplacements pour sortir.

**1. Modéliser.** Chaque case libre est un **sommet** ; deux cases libres adjacentes sont reliées par une **arête**. On ne
construit pas le graphe à l'avance : les voisins d'une case se calculent à la volée.

**2. Choisir le parcours.** Le nombre minimal de déplacements est une distance en nombre d'arêtes : **parcours en largeur**.

```python exec
from collections import deque

labyrinthe = [
    "#########",
    "#D..#...#",
    "#.#.#.#.#",
    "#.#...#.#",
    "#.#####.#",
    "#......S#",
    "#########",
]

def sortie_minimale(lab):
    lignes, colonnes = len(lab), len(lab[0])
    depart = next((i, j) for i in range(lignes) for j in range(colonnes) if lab[i][j] == "D")
    dist = {depart: 0}
    file = deque([depart])
    while file:
        i, j = file.popleft()
        if lab[i][j] == "S":
            return dist[(i, j)]
        for di, dj in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            v = (i + di, j + dj)
            if lab[v[0]][v[1]] != "#" and v not in dist:
                dist[v] = dist[(i, j)] + 1
                file.append(v)
    return None          # sortie inaccessible

print(sortie_minimale(labyrinthe))
```

**3. Justifier.** La file contient des sommets de distances $d$ puis $d + 1$ (jamais plus) : le premier moment où l'on
défile la sortie, sa distance est minimale. Le bord est entièrement fait de murs, donc on ne sort jamais de la grille.

**4. Coût.** Chaque case libre entre au plus une fois dans la file et a 4 voisins : $\Theta(\text{nombre de cases})$. Un
parcours en profondeur trouverait **une** sortie, mais pas forcément par le plus court chemin.

## L'essentiel

- Parcourir = visiter tous les sommets atteignables, en **marquant** les sommets vus (sinon on boucle sur les cycles).
- **Largeur** : file, par couches, donne les **distances** en nombre d'arêtes et, avec les parents, un plus court chemin.
- **Profondeur** : récursion ou pile ; sert à la connexité, aux cycles (couleurs blanc/gris/noir), au tri topologique (ordre de fin inversé).
- Coût : $\Theta(n + m)$ avec des listes d'adjacence, $\Theta(n^2)$ avec une matrice.
- Composantes connexes : un parcours par sommet non encore visité.

## Exercices

::::exercice[Ordre du parcours en largeur]{niveau=1}
Avec `G = {1: [2, 3], 2: [1, 4], 3: [1, 4, 5], 4: [2, 3], 5: [3]}`, dans quel ordre le parcours en largeur depuis 1 (voisins
examinés dans l'ordre des listes) visite-t-il les sommets ?

- [ ] 1, 2, 4, 3, 5
- [x] 1, 2, 3, 4, 5
- [ ] 1, 3, 5, 4, 2
- [ ] 1, 2, 3, 5, 4

:::corrige
File : [1] → on traite 1, on découvre 2 et 3 → [2, 3] → on traite 2, on découvre 4 → [3, 4] → on traite 3, on découvre 5
(4 est déjà vu) → [4, 5] → 4, puis 5. Ordre : 1, 2, 3, 4, 5.
:::
::::

::::exercice[Ordre du parcours en profondeur]{niveau=1}
Même graphe, parcours en profondeur **récursif** depuis 1 : quel est l'ordre de visite ?

- [x] 1, 2, 4, 3, 5
- [ ] 1, 2, 3, 4, 5
- [ ] 1, 3, 5, 4, 2
- [ ] 1, 2, 4, 5, 3

:::corrige
1 → premier voisin 2 → premier voisin non vu de 2 : 4 → premier voisin non vu de 4 : 3 → voisin non vu de 3 : 5. Puis on
remonte : tout est vu. Ordre : 1, 2, 4, 3, 5.
:::
::::

::::exercice[Parcours en largeur]{niveau=2}
Écris `largeur(G, depart)` qui renvoie la liste des sommets dans l'ordre du parcours en largeur.

```python depart
from collections import deque

def largeur(G, depart):
    ...
```

```python tests
G = {1: [2, 3], 2: [1, 4], 3: [1, 4, 5], 4: [2, 3], 5: [3]}
assert largeur(G, 1) == [1, 2, 3, 4, 5], "depuis 1"
assert largeur(G, 5) == [5, 3, 1, 4, 2], "depuis 5"
assert largeur({"a": ["b"], "b": ["a"], "c": []}, "a") == ["a", "b"], "c non atteignable"
assert largeur({"x": []}, "x") == ["x"], "sommet isolé"
```

:::corrige
```python solution
from collections import deque

def largeur(G, depart):
    vus = {depart}
    file = deque([depart])
    ordre = []
    while file:
        s = file.popleft()
        ordre.append(s)
        for v in G[s]:
            if v not in vus:
                vus.add(v)
                file.append(v)
    return ordre
```
On marque `v` **dès qu'il entre** dans la file : sinon, un sommet découvert par deux voisins pourrait y entrer deux fois.
:::
::::

::::exercice[Distance et chemin]{niveau=2}
Écris `plus_court_chemin(G, depart, arrivee)` qui renvoie la liste des sommets d'un plus court chemin (en nombre d'arêtes)
de `depart` à `arrivee`, ou `None` s'il n'en existe pas.

```python depart
from collections import deque

def plus_court_chemin(G, depart, arrivee):
    ...
```

```python tests
G = {1: [2, 3], 2: [1, 4], 3: [1, 4, 5], 4: [2, 3, 6], 5: [3, 6], 6: [4, 5]}
c = plus_court_chemin(G, 1, 6)
assert len(c) == 4 and c[0] == 1 and c[-1] == 6, "longueur 3 arêtes"
assert all(c[k + 1] in G[c[k]] for k in range(len(c) - 1)), "c'est bien un chemin"
assert plus_court_chemin(G, 2, 2) == [2], "départ = arrivée"
assert plus_court_chemin({1: [2], 2: [1], 3: []}, 1, 3) is None, "inaccessible"
```

:::corrige
```python solution
from collections import deque

def plus_court_chemin(G, depart, arrivee):
    parent = {depart: None}
    file = deque([depart])
    while file:
        s = file.popleft()
        if s == arrivee:
            break
        for v in G[s]:
            if v not in parent:
                parent[v] = s
                file.append(v)
    if arrivee not in parent:
        return None
    chemin = []
    s = arrivee
    while s is not None:
        chemin.append(s)
        s = parent[s]
    return chemin[::-1]
```
Le dictionnaire `parent` sert aussi d'ensemble des sommets vus. On remonte de l'arrivée vers le départ, puis on renverse.
:::
::::

::::exercice[Composantes connexes]{niveau=2}
Écris `nb_composantes(G)` qui renvoie le nombre de composantes connexes d'un graphe non orienté.

```python depart
def nb_composantes(G):
    ...
```

```python tests
G = {"A": ["B"], "B": ["A"], "C": ["D", "E"], "D": ["C"], "E": ["C"], "F": []}
assert nb_composantes(G) == 3, "trois composantes"
assert nb_composantes({1: [2], 2: [1, 3], 3: [2]}) == 1, "connexe"
assert nb_composantes({}) == 0, "graphe vide"
assert nb_composantes({i: [] for i in range(5)}) == 5, "sommets isolés"
```

:::corrige
```python solution
def nb_composantes(G):
    vus = set()
    nb = 0
    for s in G:
        if s not in vus:
            nb += 1
            pile = [s]
            vus.add(s)
            while pile:
                u = pile.pop()
                for v in G[u]:
                    if v not in vus:
                        vus.add(v)
                        pile.append(v)
    return nb
```
Chaque parcours lancé depuis un sommet non vu marque toute sa composante. Coût total $\Theta(n + m)$ : chaque sommet et
chaque arête ne sont examinés qu'une fois sur l'ensemble des parcours.
:::
::::

::::exercice[Détecter un cycle dans un graphe orienté]{niveau=3}
Écris `a_un_cycle(G)` pour un graphe **orienté** (sommet → successeurs), avec le parcours en profondeur et les trois couleurs.

```python depart
def a_un_cycle(G):
    ...
```

```python tests
assert a_un_cycle({"a": ["b"], "b": ["c"], "c": ["a"]}) == True, "cycle a -> b -> c -> a"
assert a_un_cycle({"a": ["b", "c"], "b": ["d"], "c": ["d"], "d": []}) == False, "losange sans cycle"
assert a_un_cycle({"a": ["a"]}) == True, "boucle"
assert a_un_cycle({"a": [], "b": ["a"], "c": ["b"], "d": ["c", "b"]}) == False, "plusieurs départs, pas de cycle"
```

:::corrige
```python solution
def a_un_cycle(G):
    couleur = {s: "blanc" for s in G}
    def visiter(s):
        couleur[s] = "gris"
        for v in G[s]:
            if couleur[v] == "gris":
                return True
            if couleur[v] == "blanc" and visiter(v):
                return True
        couleur[s] = "noir"
        return False
    return any(couleur[s] == "blanc" and visiter(s) for s in G)
```
Dans le « losange », `d` est atteint deux fois (par `b` puis par `c`), mais il est alors **noir** (terminé) : ce n'est pas un
cycle. Avec seulement « vu / pas vu », on conclurait à tort à un cycle : c'est pour cela qu'il faut trois couleurs.
:::
::::

::::exercice[Correction et coût du parcours en largeur]{niveau=4 duree=25}
On considère le parcours en largeur qui calcule `dist` depuis un sommet $s$ d'un graphe non orienté (version du cours).

1. Montre qu'à tout moment, les distances des sommets présents dans la file forment une suite croissante, et que la dernière
   et la première diffèrent d'au plus 1.
2. En déduire que, pour tout sommet $v$ atteint, `dist[v]` est égale à la longueur d'un plus court chemin de $s$ à $v$.
   (Indice : raisonne par récurrence sur la distance réelle $\delta(v)$.)
3. Montre que le coût est $\Theta(n + m)$ avec des listes d'adjacence et $\Theta(n^2)$ avec une matrice d'adjacence.
4. Pourquoi ce parcours ne donne-t-il pas les plus courts chemins dans un graphe **pondéré** ? Donne un contre-exemple à
   trois sommets.

:::criteres
- Q1 : invariant de la file : distances $d, \dots, d, d+1, \dots, d+1$ ; on retire en tête un sommet de distance $d$ et on ajoute en queue des sommets de distance $d+1$ : l'invariant est conservé.
- Q2 : `dist[v]` est la longueur d'un chemin réel (chemin des parents), donc $\ge \delta(v)$ ; récurrence sur $\delta$ : si $u$ est le prédécesseur de $v$ sur un plus court chemin, $u$ est traité avec `dist[u] = δ(v) − 1`, et $v$ est découvert au plus tard à ce moment, avec une distance ≤ δ(v) (les sommets traités avant ont une distance ≤ δ(v) − 1 d'après Q1).
- Q3 : chaque sommet entre une fois dans la file et en sort une fois ; la liste des voisins de chaque sommet est parcourue une fois : $\sum \deg = 2m$, total $\Theta(n + m)$ ; avec une matrice, trouver les voisins d'un sommet coûte $n$, total $\Theta(n^2)$.
- Q4 : le BFS minimise le nombre d'arêtes, pas la somme des poids ; contre-exemple : A–C de poids 10, A–B poids 1, B–C poids 1 : BFS donne A → C (1 arête, coût 10) alors que A → B → C coûte 2. Il faut l'algorithme de Dijkstra.
:::

:::corrige
1. **Invariant** : la file contient des sommets de distances $d, d, \dots, d, d + 1, \dots, d + 1$ (croissante, écart au plus
   1). Au départ : seulement $s$, de distance 0. Un tour retire la tête (distance $d$) et ajoute en queue ses voisins non vus,
   avec la distance $d + 1$ : la file reste de la forme $d, \dots, d, d+1, \dots, d+1$ (ou $d+1, \dots, d+1$ s'il ne restait
   plus de sommet à distance $d$). L'invariant est conservé.
2. Notons $\delta(v)$ la vraie distance. D'abord, `dist[v]` est la longueur du chemin $s \to \dots \to$ `parent[v]` $\to v$,
   donc $\text{dist}[v] \ge \delta(v)$. Montrons l'égalité par récurrence sur $\delta(v)$. Pour $\delta = 0$, $v = s$, `dist = 0`.
   Soit $v$ avec $\delta(v) = k \ge 1$ et $u$ son prédécesseur sur un plus court chemin : $\delta(u) = k - 1$, donc (hypothèse)
   `dist[u] = k - 1`. Quand $u$ est défilé, $v$ est soit déjà découvert, soit découvert à ce moment avec `dist = k`. S'il était
   déjà découvert, c'est par un sommet défilé **avant** $u$, de distance $\le k - 1$ d'après la question 1, donc
   `dist[v] ≤ k`. Avec $\text{dist}[v] \ge \delta(v) = k$ : égalité.
3. Chaque sommet atteint entre une seule fois dans la file (il est marqué à son entrée) et en sort une fois : $\Theta(n)$
   opérations sur la file. Quand un sommet $u$ est défilé, on parcourt sa liste de voisins : au total
   $\sum_u \deg(u) = 2m$ examens. Coût $\Theta(n + m)$. Avec une matrice, obtenir les voisins de $u$ demande de lire toute sa
   ligne ($n$ cases), pour chacun des $n$ sommets : $\Theta(n^2)$.
4. Le parcours en largeur minimise le **nombre d'arêtes**, pas la **somme des poids**. Contre-exemple : arêtes A–C (poids 10),
   A–B (poids 1), B–C (poids 1). Depuis A, le BFS découvre C directement (une arête) et lui attribue le chemin A → C de coût
   10, alors que A → B → C coûte 2. Pour les graphes pondérés (poids positifs), on utilise l'algorithme de **Dijkstra**
   (leçon suivante).
:::
::::
