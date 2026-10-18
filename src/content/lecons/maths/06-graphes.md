---
titre: "Graphes : vocabulaire et propriétés"
resume: Le vocabulaire des graphes (degré, chemin, cycle, connexité, arbres, graphes pondérés, bipartis), le lemme des poignées de main, les chemins eulériens, la caractérisation des arbres et la coloration.
duree: 65
objectifs:
  - Utiliser précisément le vocabulaire des graphes orientés et non orientés
  - Démontrer et utiliser le lemme des poignées de main et le théorème d'Euler sur les chemins eulériens
  - Caractériser les arbres (connexes, sans cycle, n − 1 arêtes) et reconnaître un graphe biparti
  - Colorier un graphe (algorithme glouton) et interpréter le nombre chromatique
prerequis: [maths/raisonnements, structures/graphes]
programme: [m-graphes, asd-graphes]
cartes:
  - q: Lemme des poignées de main ?
    r: "Dans un graphe non orienté, la somme des degrés vaut **deux fois le nombre d'arêtes** (chaque arête compte pour ses deux extrémités). Conséquence : le nombre de sommets de degré impair est pair."
  - q: Quand un graphe connexe admet-il un chemin eulérien (qui passe une fois par chaque arête) ?
    r: "Si et seulement s'il a **0 ou 2** sommets de degré impair (théorème d'Euler, 1736) ; avec 0, il existe même un **cycle** eulérien."
  - q: Caractérisations d'un arbre à $n$ sommets ?
    r: "Les propriétés suivantes sont équivalentes : connexe et sans cycle ; connexe avec $n - 1$ arêtes ; sans cycle avec $n - 1$ arêtes ; deux sommets quelconques sont reliés par un unique chemin."
  - q: Graphe biparti ?
    r: "Ses sommets se partagent en deux groupes, toute arête reliant un sommet de chaque groupe ; c'est le cas si et seulement s'il n'a **aucun cycle de longueur impaire** (il est 2-coloriable)."
  - q: Nombre chromatique ?
    r: "Le plus petit nombre de couleurs permettant de colorier les sommets sans que deux voisins aient la même couleur. Le trouver est difficile en général ; l'algorithme glouton donne au plus (degré maximal + 1) couleurs."
  - q: Graphe complet $K_n$ ?
    r: "Graphe où chaque paire de sommets est reliée : $\\frac{n(n-1)}{2}$ arêtes ; son nombre chromatique est $n$."
  - q: Chemin, chaîne, cycle, circuit ?
    r: "Dans un graphe non orienté on parle de **chaîne** et de **cycle**, dans un graphe orienté de **chemin** et de **circuit** (en NSI, « chemin » est souvent employé dans les deux cas)."
---

Le module « Structures de données » a présenté les graphes comme une structure (matrice, listes d'adjacence) et leurs parcours. Cette leçon prend le
point de vue **mathématique** : vocabulaire précis, propriétés démontrables, théorèmes classiques. Ce sont eux qui disent ce qui est possible (un
circuit qui passe par tous les ponts) et ce qui est difficile (colorier avec le moins de couleurs).

## 1. Vocabulaire

:::definition
- Un **graphe** $G = (S, A)$ : un ensemble de **sommets** $S$ et un ensemble d'**arêtes** $A$ (paires de sommets) ; s'il est **orienté**, on parle
  d'**arcs** (couples). Un graphe **pondéré** associe un poids à chaque arête.
- Le **degré** d'un sommet est son nombre de voisins (en orienté : degré entrant et sortant). Deux sommets reliés sont **adjacents**.
- Une **chaîne** (chemin) est une suite de sommets consécutivement adjacents ; elle est **élémentaire** si elle ne repasse pas par un sommet ; un
  **cycle** est une chaîne qui revient à son départ.
- Un graphe est **connexe** si deux sommets quelconques sont reliés par une chaîne ; ses **composantes connexes** sont ses « morceaux ».
- Un **arbre** est un graphe connexe sans cycle ; un graphe **complet** $K_n$ relie toutes les paires ; un graphe **biparti** a ses sommets répartis en deux
  groupes, chaque arête allant d'un groupe à l'autre.
:::

```mermaid legende="Les sept ponts de Königsberg (1736) : 4 zones de la ville, 7 ponts"
flowchart LR
  N(("Nord<br/>deg 3")) ---|"1"| I(("Île<br/>deg 5"))
  N ---|"2"| I
  S(("Sud<br/>deg 3")) ---|"3"| I
  S ---|"4"| I
  N ---|"5"| E(("Est<br/>deg 3"))
  I ---|"6"| E
  S ---|"7"| E
```

## 2. Le lemme des poignées de main

:::retenir
Dans tout graphe non orienté, $\sum_{s \in S} \deg(s) = 2\,|A|$. En effet, chaque arête est comptée une fois dans le degré de **chacune** de ses deux
extrémités. **Conséquence** : le nombre de sommets de degré impair est **pair** (sinon la somme des degrés serait impaire).
:::

Application : peut-on avoir 7 personnes qui ont chacune serré la main d'exactement 3 autres ? Non : la somme des degrés vaudrait 21, impaire.

## 3. Chemins eulériens : le problème des ponts

Peut-on se promener dans Königsberg en traversant **chaque pont une et une seule fois** ? Euler (1736) répond non, et crée la théorie des graphes.

:::retenir[Théorème d'Euler]
Un graphe **connexe** admet une chaîne passant une fois par chaque arête (**chaîne eulérienne**) si et seulement s'il a **0 ou 2** sommets de degré
impair. Avec 0, la chaîne peut se refermer (**cycle eulérien**) ; avec 2, elle part de l'un et arrive à l'autre.
:::

Idée de la nécessité : à chaque passage par un sommet intermédiaire, on entre par une arête et on ressort par une autre : les arêtes d'un sommet
intermédiaire vont **par paires**. Seuls le départ et l'arrivée peuvent avoir un degré impair. À Königsberg, les quatre zones ont un degré impair
(3, 5, 3, 3) : aucune promenade ne convient. La réciproque se prouve en construisant le cycle (algorithme de Hierholzer).

```python exec
from collections import Counter

ponts = [("N", "I"), ("N", "I"), ("S", "I"), ("S", "I"), ("N", "E"), ("I", "E"), ("S", "E")]
degres = Counter()
for a, b in ponts:
    degres[a] += 1
    degres[b] += 1
impairs = [s for s, d in degres.items() if d % 2 == 1]
print(dict(degres), "somme =", sum(degres.values()), "= 2 ×", len(ponts))
print("sommets de degré impair :", impairs, "→ chaîne eulérienne :", len(impairs) in (0, 2))
```

À l'inverse, savoir s'il existe un cycle passant une fois par chaque **sommet** (cycle **hamiltonien**) est un problème difficile : on ne connaît pas
d'algorithme efficace (il est NP-complet). Deux questions proches, deux difficultés très différentes.

## 4. Arbres

:::retenir[Caractérisations des arbres]
Pour un graphe à $n$ sommets, les propriétés suivantes sont **équivalentes** : (1) connexe et sans cycle ; (2) connexe avec $n - 1$ arêtes ; (3) sans
cycle avec $n - 1$ arêtes ; (4) deux sommets sont toujours reliés par une **unique** chaîne élémentaire. Retirer une arête d'un arbre le déconnecte ;
en ajouter une crée un cycle.
:::

Les arbres sont les graphes connexes **minimaux** : c'est pourquoi on cherche des **arbres couvrants** de poids minimal pour relier des points au
moindre coût (réseaux électriques, câblage — algorithmes de Kruskal et Prim), et pourquoi un parcours (en largeur ou en profondeur) d'un graphe
connexe définit un arbre.

## 5. Coloration

Colorier un graphe, c'est attribuer une couleur à chaque sommet de sorte que deux voisins aient des couleurs **différentes**. Le **nombre chromatique**
$\chi(G)$ est le nombre minimal de couleurs. Applications : emplois du temps (deux cours qui partagent un élève ne peuvent pas avoir lieu en même temps),
allocation de registres dans un compilateur, fréquences radio d'antennes voisines.

- Un graphe est **2-coloriable** (biparti) si et seulement s'il n'a pas de cycle de longueur impaire — et on le teste facilement par un parcours.
- Décider si un graphe est 3-coloriable est NP-complet ; l'algorithme **glouton** (on colorie les sommets un par un avec la plus petite couleur libre)
  utilise au plus $\Delta + 1$ couleurs ($\Delta$ = degré maximal), mais pas forcément le minimum.
- Le **théorème des quatre couleurs** (1976, première grande preuve assistée par ordinateur) : toute carte plane se colorie avec 4 couleurs.

:::prof
En terminale NSI, les graphes sont une structure de données (représentations, parcours, recherche de chemin et de cycle). Le vocabulaire précis
(connexe, cycle, degré) et des résultats comme le lemme des poignées de main ou le problème de Königsberg sont d'excellentes portes d'entrée,
débranchées puis programmées. La coloration de graphe est un très bon exemple d'heuristique gloutonne qui ne donne pas toujours l'optimum.
:::

## Exemple guidé

**Problème.** Planifier les épreuves d'un examen : deux épreuves qui ont un candidat en commun ne peuvent pas avoir lieu le même jour. Combien de jours
faut-il au minimum ?

**1. Modéliser.** Un sommet par épreuve, une arête entre deux épreuves qui ont un candidat commun : un **jour** = une **couleur**. On cherche le
nombre chromatique.

**2. Colorier glouton** dans l'ordre des degrés décroissants (heuristique de Welsh et Powell) :

```python exec
conflits = {
    "Maths": ["NSI", "Physique", "Anglais"],
    "NSI": ["Maths", "Philo"],
    "Physique": ["Maths", "Philo", "Anglais"],
    "Philo": ["NSI", "Physique"],
    "Anglais": ["Maths", "Physique"],
    "SES": [],
}

def glouton(graphe, ordre):
    couleur = {}
    for s in ordre:
        prises = {couleur[v] for v in graphe[s] if v in couleur}
        couleur[s] = min(c for c in range(len(graphe)) if c not in prises)
    return couleur

ordre = sorted(conflits, key=lambda s: -len(conflits[s]))
c = glouton(conflits, ordre)
print(c, "→", max(c.values()) + 1, "jours")
```

**3. Prouver l'optimalité.** Maths, Physique et Anglais sont **deux à deux** en conflit (un triangle, $K_3$) : il faut au moins 3 jours. Le glouton en
utilise 3 : c'est optimal. Sans un tel argument (une borne inférieure), on ne sait pas si le glouton a trouvé le minimum.

## L'essentiel

- Graphe (orienté ou non, pondéré), degré, chaîne/chemin, cycle, connexité, composantes, arbre, complet $K_n$ ($\frac{n(n-1)}{2}$ arêtes), biparti.
- **Poignées de main** : $\sum \deg = 2|A|$ ; le nombre de sommets de degré impair est pair.
- **Euler** : chaîne eulérienne ⇔ connexe avec 0 ou 2 sommets de degré impair (Königsberg : 4, impossible) ; hamiltonien : difficile.
- **Arbres** : connexe sans cycle ⇔ connexe à $n-1$ arêtes ⇔ chemin unique entre deux sommets ; arbres couvrants minimaux.
- **Coloration** : $\chi(G)$ ; biparti ⇔ pas de cycle impair ; glouton ≤ $\Delta + 1$ couleurs ; une clique donne une borne inférieure.

## Exercices

::::exercice[Poignées de main]{niveau=1}
Un graphe non orienté a 10 sommets, chacun de degré 3. Combien a-t-il d'arêtes ?

- [ ] 30
- [x] 15
- [ ] 10
- [ ] 13

:::corrige
Somme des degrés $= 10 \times 3 = 30 = 2|A|$, donc $|A| = 15$.
:::
::::

::::exercice[Euler]{niveau=1}
Un graphe connexe a des sommets de degrés 2, 4, 3, 2, 3, 4. Admet-il une chaîne eulérienne ?

- [ ] Non, car il y a des sommets de degré impair
- [x] Oui, une chaîne qui commence et finit aux deux sommets de degré 3
- [ ] Oui, et même un cycle eulérien
- [ ] On ne peut pas savoir sans le dessin

:::corrige
Exactement deux sommets de degré impair : il existe une chaîne eulérienne, qui part de l'un et arrive à l'autre, mais pas de cycle eulérien (il en
faudrait zéro). La connexité est donnée, le dessin est inutile.
:::
::::

::::exercice[Tester Euler]{niveau=2}
Écris `eulerien(sommets, aretes)` qui renvoie `"cycle"`, `"chaine"` ou `"non"` pour un graphe non orienté donné par la liste de ses sommets et la liste
de ses arêtes (couples, arêtes multiples possibles). Le graphe doit être **connexe** en ne considérant que les sommets de degré non nul (sinon `"non"`).

```python depart
def eulerien(sommets, aretes):
    ...
```

```python tests
ponts = [("N", "I"), ("N", "I"), ("S", "I"), ("S", "I"), ("N", "E"), ("I", "E"), ("S", "E")]
assert eulerien(["N", "S", "I", "E"], ponts) == "non", "Königsberg"
assert eulerien([1, 2, 3], [(1, 2), (2, 3), (3, 1)]) == "cycle", "triangle"
assert eulerien([1, 2, 3, 4], [(1, 2), (2, 3), (3, 4)]) == "chaine", "chaîne simple"
assert eulerien([1, 2, 3, 4], [(1, 2), (3, 4)]) == "non", "non connexe"
assert eulerien([1, 2, 3, 4, 5], [(1, 2), (2, 3), (3, 1)]) == "cycle", "sommets isolés ignorés"
```

:::corrige
```python solution
def eulerien(sommets, aretes):
    voisins = {s: [] for s in sommets}
    for a, b in aretes:
        voisins[a].append(b)
        voisins[b].append(a)
    utiles = [s for s in sommets if voisins[s]]
    if utiles:
        vus, pile = {utiles[0]}, [utiles[0]]
        while pile:
            for v in voisins[pile.pop()]:
                if v not in vus:
                    vus.add(v)
                    pile.append(v)
        if any(s not in vus for s in utiles):
            return "non"
    impairs = sum(1 for s in sommets if len(voisins[s]) % 2 == 1)
    return "cycle" if impairs == 0 else "chaine" if impairs == 2 else "non"
```
Deux vérifications : la **connexité** (parcours en profondeur depuis un sommet non isolé) puis la **parité** des degrés. Les sommets isolés n'empêchent
rien : la chaîne n'a pas à passer par eux, seulement par toutes les arêtes.
:::
::::

::::exercice[Est-ce un arbre ?]{niveau=2}
Écris `est_arbre(n, aretes)` pour un graphe non orienté à `n` sommets numérotés de 0 à `n - 1` : il doit avoir exactement `n - 1` arêtes et être connexe.

```python depart
def est_arbre(n, aretes):
    ...
```

```python tests
assert est_arbre(4, [(0, 1), (1, 2), (1, 3)]), "étoile"
assert not est_arbre(4, [(0, 1), (1, 2), (2, 0)]), "triangle et sommet isolé : 3 arêtes mais pas connexe"
assert not est_arbre(3, [(0, 1)]), "pas assez d'arêtes"
assert not est_arbre(3, [(0, 1), (1, 2), (2, 0)]), "cycle"
assert est_arbre(1, []), "un seul sommet"
```

:::corrige
```python solution
def est_arbre(n, aretes):
    if len(aretes) != n - 1:
        return False
    voisins = [[] for _ in range(n)]
    for a, b in aretes:
        voisins[a].append(b)
        voisins[b].append(a)
    vus, pile = {0}, [0]
    while pile:
        for v in voisins[pile.pop()]:
            if v not in vus:
                vus.add(v)
                pile.append(v)
    return len(vus) == n
```
Grâce à la caractérisation « connexe avec $n - 1$ arêtes », pas besoin de chercher des cycles. Le deuxième test montre pourquoi le seul compte des
arêtes ne suffit pas : 3 arêtes pour 4 sommets, mais un cycle et un sommet isolé.
:::
::::

::::exercice[Biparti]{niveau=3}
Écris `deux_couleurs(graphe)` qui renvoie une coloration `{sommet: 0 ou 1}` telle que deux voisins aient des couleurs différentes, ou `None` si c'est
impossible. Le graphe (dictionnaire de listes de voisins, non orienté) peut avoir plusieurs composantes connexes. Utilise un parcours en largeur.

```python depart
from collections import deque

def deux_couleurs(graphe):
    ...
```

```python tests
def valide(g, c):
    return all(c[u] != c[v] for u in g for v in g[u])
carre = {1: [2, 4], 2: [1, 3], 3: [2, 4], 4: [3, 1]}
c = deux_couleurs(carre)
assert c is not None and valide(carre, c), "cycle pair"
assert deux_couleurs({1: [2, 3], 2: [1, 3], 3: [1, 2]}) is None, "triangle : cycle impair"
deux = {1: [2], 2: [1], 3: [4, 5], 4: [3], 5: [3]}
c = deux_couleurs(deux)
assert c is not None and valide(deux, c) and len(c) == 5, "deux composantes"
assert deux_couleurs({1: []}) == {1: 0}, "sommet isolé"
```

:::corrige
```python solution
from collections import deque

def deux_couleurs(graphe):
    couleur = {}
    for depart in graphe:
        if depart in couleur:
            continue
        couleur[depart] = 0
        file = deque([depart])
        while file:
            u = file.popleft()
            for v in graphe[u]:
                if v not in couleur:
                    couleur[v] = 1 - couleur[u]
                    file.append(v)
                elif couleur[v] == couleur[u]:
                    return None          # deux voisins de même couleur : cycle impair
    return couleur
```
Le parcours en largeur colorie par **niveaux** alternés. Si deux voisins tombent sur la même couleur, le graphe contient un cycle de longueur impaire :
aucune 2-coloration n'existe (preuve : en parcourant un cycle, les couleurs alternent, donc sa longueur est paire). Coût linéaire en $|S| + |A|$.
:::
::::

::::exercice[Königsberg en classe]{niveau=4 duree=20}
Vous voulez introduire les graphes en terminale avec le problème des ponts de Königsberg.

1. Décrivez le déroulement d'une séance d'environ 45 minutes, de la question initiale à la formulation du théorème par les élèves.
2. Rédigez la preuve de la condition nécessaire telle que vous l'attendriez d'un bon élève.
3. Proposez un prolongement en programmation et un prolongement « problème difficile ».

:::criteres
- Séance : énoncé concret avec plan de la ville, recherche libre, modélisation (zones = sommets, ponts = arêtes), comptage des degrés sur plusieurs graphes à tracer « sans lever le crayon », émergence de la conjecture sur les degrés impairs, institutionnalisation du vocabulaire.
- Preuve claire : chaque passage par un sommet intermédiaire utilise deux arêtes, donc degré pair ; seuls départ et arrivée peuvent être impairs ; d'où 0 ou 2 sommets impairs.
- Prolongements : programme qui teste la condition (degrés + connexité) ou construit le chemin ; problème hamiltonien ou voyageur de commerce comme contraste de difficulté.
:::

:::corrige
1. **Accroche** (5 min) : plan de Königsberg, la question « peut-on traverser chaque pont une seule fois ? ». **Recherche** (10 min) : les élèves essaient
   sur le plan, échouent. **Modélisation** (10 min) : on remplace zones et ponts par des points et des traits ; on propose plusieurs dessins « à tracer
   sans lever le crayon » (enveloppe, maison, étoile). **Conjecture** (10 min) : les élèves remplissent un tableau « nombre de sommets de degré impair /
   possible ou non » et remarquent que seuls 0 ou 2 sommets impairs marchent. **Institutionnalisation** (10 min) : vocabulaire (sommet, arête, degré,
   chaîne, connexe), énoncé du théorème, preuve de la condition nécessaire.
2. *Supposons qu'une chaîne passe exactement une fois par chaque arête. Considérons un sommet qui n'est ni le départ ni l'arrivée : chaque fois que la
   chaîne passe par lui, elle y entre par une arête et en ressort par une autre, toutes deux utilisées une seule fois. Ses arêtes vont donc par paires :
   son degré est pair. Seuls le départ et l'arrivée peuvent avoir un degré impair (et s'ils sont confondus, leur degré est pair aussi). Un graphe qui
   admet une chaîne eulérienne a donc 0 ou 2 sommets de degré impair. À Königsberg, il y en a 4 : c'est impossible.*
3. **Programmation** : écrire une fonction qui teste la condition (degrés et connexité), puis l'algorithme de Hierholzer qui construit le cycle eulérien.
   **Problème difficile** : poser la question « passer une fois par chaque **zone** » (cycle hamiltonien) ; les élèves cherchent un critère aussi simple et
   n'en trouvent pas : on ouvre sur les problèmes dont on ne connaît pas de solution efficace (voyageur de commerce).
:::
::::
