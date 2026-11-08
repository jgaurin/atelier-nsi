---
titre: Les graphes
resume: "Modéliser des relations par un graphe et le représenter par une matrice ou par des listes de successeurs."
duree: 35
objectifs:
  - "Modéliser une situation sous forme de graphe"
  - "Implémenter un graphe par matrice d'adjacence et par listes de successeurs"
  - "Passer d'une représentation à une autre"
prerequis: [terminale-structures/arbres]
---

Réseau routier, Internet, réseau social : dès qu'on représente des **relations**, on obtient un **graphe**.

## 1. Vocabulaire

- Un graphe est formé de **sommets** reliés par des **arêtes**.
- Dans un graphe **orienté**, les liens sont des **arcs**, à sens unique.
- Deux sommets reliés sont **voisins**. Le **degré** d'un sommet est son nombre de voisins.

## 2. Deux représentations

Graphe : A–B, A–C, B–C, C–D.

**Matrice d'adjacence** : `m[i][j]` vaut 1 s'il y a un lien entre i et j.

```python
#     A  B  C  D
m = [[0, 1, 1, 0],   # A
     [1, 0, 1, 0],   # B
     [1, 1, 0, 1],   # C
     [0, 0, 1, 0]]   # D
```

**Listes de successeurs** : un dictionnaire.

```python
g = {"A": ["B", "C"], "B": ["A", "C"], "C": ["A", "B", "D"], "D": ["C"]}
```

| | Matrice | Listes |
| --- | --- | --- |
| Tester si i et j sont liés | immédiat | parcourir la liste |
| Lister les voisins | parcourir toute la ligne | immédiat |
| Mémoire | n² cases | selon le nombre d'arêtes |

La matrice d'un graphe **non orienté** est **symétrique**.

## L'essentiel

- Sommets, arêtes (arcs si orienté), voisins, degré.
- Matrice d'adjacence ou dictionnaire de listes de successeurs.
- Le choix dépend du traitement à effectuer.

## Exercices

::::exercice[QCM : graphes]{niveau=1 type=quiz}
Une question à la fois : la correction s'affiche aussitôt.

1. Quel est le degré du sommet D ?

   - [ ] 1
   - [ ] 2
   - [x] 3
   - [ ] 5

   > D est relié à B, C et E.

1. Le graphe est-il connexe ?

   - [ ] oui
   - [x] non, F n'est relié à aucun sommet
   - [ ] oui, car il a un cycle
   - [ ] impossible à dire

   > Connexe : on peut aller de n'importe quel sommet à n'importe quel autre.

1. Lequel est un cycle ?

   - [ ] A, B, D, E
   - [x] A, B, D, C, A
   - [ ] A, B, A
   - [ ] D, E, D

   > A, B, A réutilise la même arête : ce n'est pas un cycle.

1. Dans la matrice d'adjacence d'un graphe **non orienté**, on a toujours :

   - [x] `m[i][j] == m[j][i]`
   - [ ] `m[i][i] == 1`
   - [ ] une seule case à 1 par ligne
   - [ ] des valeurs différentes de 0 et 1

   > La matrice est symétrique.

1. Quelle représentation occupe n² cases de mémoire, quel que soit le nombre d'arêtes ?

   - [x] la matrice d'adjacence
   - [ ] les listes d'adjacence
   - [ ] les deux
   - [ ] aucune

   > Les listes n'occupent de la place que pour les arêtes existantes.

1. Dans un graphe orienté avec l'arc A → B, peut-on aller directement de B à A ?

   - [ ] oui
   - [x] non, sauf s'il existe aussi un arc B → A
   - [ ] seulement si le graphe est pondéré
   - [ ] seulement si A et B ont le même degré

   > Un arc a un sens.

1. Qu'est-ce qu'un arbre, du point de vue des graphes ?

   - [ ] un graphe orienté quelconque
   - [x] un graphe connexe sans cycle
   - [ ] un graphe complet
   - [ ] un graphe pondéré

   > On peut aller de tout sommet à tout autre, d'une seule façon.
::::

::::exercice[Du dictionnaire à la matrice]{niveau=1 type=completer}
Graphe non orienté : `g = {"A": ["B"], "B": ["A", "C"], "C": ["B"]}`. Complète la matrice, dans l'ordre A, B, C.

```python calcul
g = {"A": ["B"], "B": ["A", "C"], "C": ["B"]}
s = "ABC"
print(1 if "A" in g["A"] else 0)
print(1 if "B" in g["A"] else 0)
print(1 if "C" in g["A"] else 0)
print(1 if "A" in g["B"] else 0)
print(1 if "B" in g["B"] else 0)
print(1 if "C" in g["B"] else 0)
print(1 if "A" in g["C"] else 0)
print(1 if "B" in g["C"] else 0)
print(1 if "C" in g["C"] else 0)
```

| | A | B | C |
| --- | --- | --- | --- |
| **A** | [[0]] | [[1]] | [[0]] |
| **B** | [[1]] | [[0]] | [[1]] |
| **C** | [[0]] | [[1]] | [[0]] |
::::

::::exercice[Lire une matrice]{niveau=1 type=reponses}
Graphe **orienté** de sommets 0, 1, 2 : `m = [[0, 1, 1], [0, 0, 1], [1, 0, 0]]`.

1. Y a-t-il un arc de 0 vers 2 ? Réponds par oui ou par non.

   - oui

1. Y a-t-il un arc de 2 vers 1 ? Réponds par oui ou par non.

   - non

1. Combien d'arcs compte ce graphe ?

   ```python calcul
   print(sum(map(sum, [[0, 1, 1], [0, 0, 1], [1, 0, 0]])))
   ```

   - 4

1. Quels sont les successeurs du sommet 1 ?

   - 2
::::

::::exercice[D'une représentation à l'autre]{niveau=1}
Écris `vers_dico(m, noms)` qui transforme une matrice d'adjacence en dictionnaire de listes d'adjacence (les sommets d'indice i s'appellent
`noms[i]`, voisins dans l'ordre des indices), et `vers_matrice(g, noms)` qui fait l'inverse.

```python depart
def vers_dico(m, noms):
    ...

def vers_matrice(g, noms):
    ...
```

```python tests
m = [[0, 1, 1], [1, 0, 0], [1, 0, 0]]
noms = ["A", "B", "C"]
assert vers_dico(m, noms) == {"A": ["B", "C"], "B": ["A"], "C": ["A"]}, "matrice vers dictionnaire"
assert vers_matrice({"A": ["B", "C"], "B": ["A"], "C": ["A"]}, noms) == m, "dictionnaire vers matrice"
assert vers_dico([[0]], ["X"]) == {"X": []}, "un sommet isolé"
```

:::corrige
```python solution
def vers_dico(m, noms):
    g = {}
    for i in range(len(m)):
        g[noms[i]] = [noms[j] for j in range(len(m)) if m[i][j] == 1]
    return g

def vers_matrice(g, noms):
    n = len(noms)
    m = [[0] * n for i in range(n)]
    for i in range(n):
        for v in g[noms[i]]:
            j = noms.index(v)
            m[i][j] = 1
    return m
```

`noms.index(v)` retrouve le numéro d'un sommet ; pour un grand graphe, on construirait plutôt un dictionnaire nom → indice.
:::
::::

::::exercice[Modéliser par un graphe]{niveau=2}
Pour chaque situation, dis quels sont les sommets et les arêtes, si le graphe est orienté et/ou pondéré, et quelle question se ramène à un
parcours : (a) le réseau des amis d'un réseau social ; (b) les abonnements sur un réseau où l'on suit des comptes sans réciprocité ; (c) un plan
de métro avec les temps de trajet ; (d) les prérequis entre les chapitres d'un cours.

:::criteres
- (a) sommets = personnes, arêtes = amitié, non orienté, non pondéré ; question : « ami d'ami » (largeur, distance 2).
- (b) orienté (A suit B) ; question : qui peut voir passer un message (parcours depuis un compte).
- (c) sommets = stations, arêtes = tronçons, pondéré par le temps ; question : plus court trajet (pondéré : Dijkstra).
- (d) orienté (prérequis → chapitre) ; un cycle serait une incohérence ; ordre possible des chapitres.
:::

:::corrige
(a) **Sommets** : les personnes ; **arêtes** : « est ami avec ». **Non orienté** (l'amitié est réciproque), non pondéré. « Qui sont les amis de
mes amis ? » : parcours en largeur, sommets à distance 2. (b) **Orienté** : un arc A → B si A suit B. « Jusqu'où un message republié peut-il se
diffuser ? » : parcours depuis l'auteur. (c) **Sommets** : les stations ; **arêtes** : les tronçons entre deux stations ; **pondéré** par le
temps de trajet. Le plus court trajet **en temps** demande l'algorithme de **Dijkstra** ; le parcours en largeur donne le trajet avec le moins
de stations. (d) **Orienté** : un arc du prérequis vers le chapitre. Un **cycle** serait absurde (A exige B qui exige A) ; un parcours en
profondeur permet de le détecter et de trouver un ordre valide des chapitres.
:::
::::
