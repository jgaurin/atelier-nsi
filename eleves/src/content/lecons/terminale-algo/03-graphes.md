---
titre: Algorithmes sur les graphes
resume: "Parcourir un graphe en largeur et en profondeur, chercher un chemin, repérer un cycle."
duree: 45
objectifs:
  - "Parcourir un graphe en profondeur et en largeur"
  - "Chercher un chemin dans un graphe"
  - "Repérer la présence d'un cycle"
prerequis: [terminale-structures/graphes, terminale-structures/lineaires]
---

Parcourir un graphe permet de répondre à : peut-on aller de A à B ? en combien d'étapes ?

## 1. Largeur : avec une file

On visite les voisins du départ, puis leurs voisins, etc. On **marque** les sommets déjà découverts.

```python exec
def largeur(g, depart):
    visites = [depart]
    file = [depart]
    while file != []:
        s = file.pop(0)
        for v in g[s]:
            if v not in visites:
                visites.append(v)
                file.append(v)
    return visites

g = {"A": ["B", "C"], "B": ["A", "D"], "C": ["A", "D"], "D": ["B", "C"]}
print(largeur(g, "A"))
```

Le parcours en largeur trouve les sommets par **distance croissante**.

## 2. Profondeur : en récursif

On va le plus loin possible, puis on revient en arrière.

```python exec
def profondeur(g, s, visites):
    visites.append(s)
    for v in g[s]:
        if v not in visites:
            profondeur(g, v, visites)
    return visites

g = {"A": ["B", "C"], "B": ["A", "D"], "C": ["A", "D"], "D": ["B", "C"]}
print(profondeur(g, "A", []))
```

## 3. Chemin et cycle

- **Chemin** : on lance un parcours depuis a et on retient d'où vient chaque sommet.
- **Cycle** (graphe non orienté) : pendant un parcours en profondeur, un voisin déjà visité qui n'est pas celui dont on vient révèle un cycle.

## L'essentiel

- Largeur : une file. Profondeur : la récursivité ou une pile.
- Toujours marquer les sommets visités.
- La largeur donne le plus court chemin en nombre d'arêtes.

## Exercices

::::exercice[QCM : parcours de graphes]{niveau=1 type=quiz}
Une question à la fois : la correction s'affiche aussitôt.

1. Quelle structure utilise le parcours en largeur ?

   - [ ] une pile
   - [x] une file
   - [ ] un arbre binaire de recherche
   - [ ] aucune

   > Les sommets sont traités dans l'ordre de découverte.

1. Quel parcours donne le plus court chemin en nombre d'arêtes ?

   - [x] le parcours en largeur
   - [ ] le parcours en profondeur
   - [ ] les deux
   - [ ] aucun

   > Il découvre les sommets par distance croissante.

1. Quel est le parcours en largeur depuis A (voisins dans l'ordre alphabétique) ?

   - [x] A B C D E
   - [ ] A B D C E
   - [ ] A B D E C
   - [ ] A B C D E F

   > F n'est pas atteignable depuis A.

1. Quel est le parcours en profondeur récursif depuis A (voisins dans l'ordre alphabétique) ?

   - [ ] A B C D E
   - [x] A B D C E
   - [ ] A C D B E
   - [ ] A B D E C

   > A, puis B, puis D (voisin de B), puis C (premier voisin non visité de D), puis E.

1. Pourquoi marquer les sommets visités ?

   - [ ] pour les afficher
   - [x] pour ne pas les traiter deux fois et éviter une boucle infinie
   - [ ] pour trier le graphe
   - [ ] ce n'est utile que pour les graphes orientés

   > Un graphe non orienté contient toujours des allers-retours.

::::

::::exercice[Dérouler les parcours]{niveau=1 type=completer}
Graphe : `g = {"A": ["B", "D"], "B": ["A", "C"], "C": ["B", "E"], "D": ["A", "E"], "E": ["C", "D"]}`. Les voisins sont pris dans l'ordre des listes. Écris les sommets séparés par un espace.

```python calcul
g = {"A": ["B", "D"], "B": ["A", "C"], "C": ["B", "E"], "D": ["A", "E"], "E": ["C", "D"]}
vus, f = ["A"], ["A"]
while f:
    s = f.pop(0)
    for v in g[s]:
        if v not in vus:
            vus.append(v); f.append(v)
print(" ".join(vus))
def p(s, v):
    v.append(s)
    for x in g[s]:
        if x not in v:
            p(x, v)
    return v
print(" ".join(p("A", [])))
```

| Parcours depuis A | Ordre de visite |
| --- | --- |
| En largeur | [[A B D C E]] |
| En profondeur | [[A B C E D]] |
::::

::::exercice[Les deux parcours]{niveau=2}
Écris `largeur(g, depart)` et `profondeur(g, depart)` qui renvoient la liste des sommets dans l'ordre où ils sont visités. Pour la profondeur,
utilise la version récursive (avec une fonction auxiliaire ou un paramètre). Les voisins sont parcourus dans l'ordre des listes.

```python depart
def largeur(g, depart):
    ...

def profondeur(g, depart):
    ...
```

```python tests
g = {"A": ["B", "C"], "B": ["A", "D"], "C": ["A", "D"], "D": ["B", "C", "E"], "E": ["D"], "F": []}
assert largeur(g, "A") == ["A", "B", "C", "D", "E"], "largeur depuis A"
assert profondeur(g, "A") == ["A", "B", "D", "C", "E"], "profondeur depuis A"
assert largeur(g, "F") == ["F"] and profondeur(g, "F") == ["F"], "sommet isolé"
assert largeur(g, "E") == ["E", "D", "B", "C", "A"], "largeur depuis E"
```

:::corrige
```python solution
def largeur(g, depart):
    visites = [depart]
    file = [depart]
    while len(file) > 0:
        s = file.pop(0)
        for v in g[s]:
            if v not in visites:
                visites.append(v)
                file.append(v)
    return visites

def profondeur(g, depart):
    visites = []

    def explorer(s):
        visites.append(s)
        for v in g[s]:
            if v not in visites:
                explorer(v)

    explorer(depart)
    return visites
```

Dans le parcours en largeur, on marque un sommet **dès qu'on l'enfile**, pour ne pas l'enfiler deux fois.
:::
::::

::::exercice[Plus court chemin en nombre d'arêtes]{niveau=2}
Écris `distances(g, depart)` qui renvoie un dictionnaire associant à chaque sommet atteignable sa distance (nombre d'arêtes) au départ, puis
`chemin(g, a, b)` qui renvoie un plus court chemin de a à b sous forme de liste de sommets, ou `None` s'il n'y en a pas. Utilise un parcours en
largeur en retenant le **prédécesseur** de chaque sommet.

```python depart
def distances(g, depart):
    ...

def chemin(g, a, b):
    ...
```

```python tests
g = {"A": ["B", "C"], "B": ["A", "D"], "C": ["A", "D"], "D": ["B", "C", "E"], "E": ["D"], "F": []}
assert distances(g, "A") == {"A": 0, "B": 1, "C": 1, "D": 2, "E": 3}, "distances"
assert chemin(g, "A", "E") == ["A", "B", "D", "E"], "chemin A vers E"
assert chemin(g, "A", "F") is None, "pas de chemin"
assert chemin(g, "C", "C") == ["C"], "chemin trivial"
```

:::corrige
```python solution
def distances(g, depart):
    dist = {depart: 0}
    file = [depart]
    while len(file) > 0:
        s = file.pop(0)
        for v in g[s]:
            if v not in dist:
                dist[v] = dist[s] + 1
                file.append(v)
    return dist

def chemin(g, a, b):
    pred = {a: None}
    file = [a]
    while len(file) > 0:
        s = file.pop(0)
        for v in g[s]:
            if v not in pred:
                pred[v] = s
                file.append(v)
    if b not in pred:
        return None
    resultat = []
    s = b
    while s is not None:
        resultat.append(s)
        s = pred[s]
    resultat.reverse()
    return resultat
```

Les dictionnaires `dist` et `pred` servent aussi de marquage : un sommet y figure dès qu'il est découvert. On reconstruit le chemin **à
l'envers**, de b vers a, en suivant les prédécesseurs.
:::
::::

::::exercice[Repérer un cycle]{niveau=2}
Écris `a_un_cycle(g)` qui renvoie `True` si le graphe **non orienté** `g` contient un cycle. Utilise un parcours en profondeur qui retient le
sommet d'où l'on vient : un voisin déjà visité **différent du parent** signale un cycle. Pense aux graphes non connexes.

```python depart
def a_un_cycle(g):
    ...
```

```python tests
g1 = {"A": ["B", "C"], "B": ["A", "D"], "C": ["A", "D"], "D": ["B", "C", "E"], "E": ["D"], "F": []}
assert a_un_cycle(g1), "cycle A-B-D-C"
arbre = {"A": ["B", "C"], "B": ["A", "D"], "C": ["A"], "D": ["B"]}
assert not a_un_cycle(arbre), "un arbre n'a pas de cycle"
deux = {"A": ["B"], "B": ["A"], "C": ["D", "E"], "D": ["C", "E"], "E": ["C", "D"]}
assert a_un_cycle(deux), "cycle dans la deuxième composante"
assert not a_un_cycle({"X": []}), "sommet seul"
```

:::corrige
```python solution
def a_un_cycle(g):
    visites = []

    def explorer(s, parent):
        visites.append(s)
        for v in g[s]:
            if v not in visites:
                if explorer(v, s):
                    return True
            elif v != parent:
                return True
        return False

    for s in g:
        if s not in visites:
            if explorer(s, None):
                return True
    return False
```

Le voisin `parent` est toujours déjà visité (c'est l'arête par laquelle on est arrivé) : il ne compte pas. La boucle finale relance le
parcours depuis chaque sommet non visité, pour couvrir toutes les composantes.
:::
::::
