---
titre: Ensembles, relations et fonctions
resume: Les opérations ensemblistes, le produit cartésien et l'ensemble des parties, les relations binaires (équivalence, ordre) et les fonctions (injection, surjection, bijection), avec leur traduction en Python et en bases de données.
duree: 60
objectifs:
  - Manipuler les opérations sur les ensembles et calculer des cardinaux (produit cartésien, parties)
  - Reconnaître les propriétés d'une relation binaire et identifier relations d'équivalence et d'ordre
  - Déterminer les classes d'équivalence et la fermeture transitive d'une relation
  - Dire si une fonction entre ensembles finis est injective, surjective, bijective
prerequis: [maths/logique, python/tuples-dictionnaires]
programme: [m-ensembles, id-relationnel, asd-types]
cartes:
  - q: Cardinal de $E \times F$ et de $\mathcal{P}(E)$ ?
    r: "$|E \\times F| = |E| \\times |F|$ ; $|\\mathcal{P}(E)| = 2^{|E|}$ (chaque élément est dans la partie ou non)."
  - q: Relation d'équivalence ?
    r: "Une relation **réflexive**, **symétrique** et **transitive** (« avoir le même reste modulo 3 ») ; elle partage l'ensemble en **classes d'équivalence** disjointes."
  - q: Relation d'ordre ?
    r: "Une relation **réflexive**, **antisymétrique** ($x R y$ et $y R x$ implique $x = y$) et **transitive**. Ordre **total** si deux éléments sont toujours comparables (≤ sur les entiers), **partiel** sinon (divisibilité, inclusion)."
  - q: Injective, surjective, bijective ?
    r: "Injective : deux éléments distincts ont des images distinctes. Surjective : tout élément de l'ensemble d'arrivée a au moins un antécédent. Bijective : les deux (chaque élément d'arrivée a exactement un antécédent)."
  - q: Différence symétrique $A \triangle B$ ?
    r: "Les éléments qui sont dans $A$ ou dans $B$ mais pas dans les deux : $(A \\cup B) \\setminus (A \\cap B)$. En Python : `a ^ b`."
  - q: Fermeture transitive d'une relation ?
    r: "La plus petite relation transitive qui la contient : $x$ est relié à $y$ s'il existe un chemin de $x$ à $y$ dans le graphe de la relation (algorithme de Warshall)."
  - q: Quel est le lien entre une relation et une table SQL ?
    r: "Une relation binaire est un sous-ensemble de $E \\times F$ : un ensemble de couples. Une table est une relation $n$-aire : un ensemble de $n$-uplets (d'où le nom de modèle **relationnel**)."
---

Le vocabulaire des ensembles et des relations est partout en informatique : les types `set` et `dict` de Python, le modèle **relationnel** des bases
de données, les graphes (une relation est un graphe), les tris (qui reposent sur une relation d'ordre), les tables de hachage (qui exigent des clés
comparables). Cette leçon fixe les définitions et les méthodes de vérification.

## 1. Ensembles et opérations

| Notation | Sens | Python |
|---|---|---|
| $x \in A$ | $x$ appartient à $A$ | `x in a` |
| $A \subseteq B$ | tout élément de $A$ est dans $B$ | `a <= b` |
| $A \cup B$ | union | `a \| b` |
| $A \cap B$ | intersection | `a & b` |
| $A \setminus B$ | différence | `a - b` |
| $A \triangle B$ | différence symétrique | `a ^ b` |
| $\lvert A \rvert$ | cardinal | `len(a)` |

Le **produit cartésien** $E \times F$ est l'ensemble des couples $(x, y)$ avec $x \in E$, $y \in F$ : $|E \times F| = |E| \times |F|$. L'**ensemble des
parties** $\mathcal{P}(E)$ contient tous les sous-ensembles de $E$ : $|\mathcal{P}(E)| = 2^{|E|}$.

```python exec
from itertools import product, combinations

E, F = {"a", "b", "c"}, {0, 1}
print(len(set(product(E, F))), "couples dans E × F")
parties = [set(c) for k in range(len(E) + 1) for c in combinations(sorted(E), k)]
print(len(parties), "parties :", parties)

A, B = {1, 2, 3, 4}, {3, 4, 5}
print(A | B, A & B, A - B, A ^ B, {3} <= A)
# Formule d'inclusion-exclusion : |A ∪ B| = |A| + |B| - |A ∩ B|
print(len(A | B) == len(A) + len(B) - len(A & B))
```

## 2. Relations binaires

Une **relation binaire** $R$ sur un ensemble $E$ est un sous-ensemble de $E \times E$ : on note $x \, R \, y$ quand $(x, y) \in R$. C'est aussi un **graphe
orienté** (arc de $x$ vers $y$). Propriétés possibles :

| Propriété | Définition | Exemple |
|---|---|---|
| réflexive | $\forall x, \; x R x$ | $\le$, « a le même âge que » |
| symétrique | $x R y \Rightarrow y R x$ | « est ami avec » |
| antisymétrique | $(x R y \land y R x) \Rightarrow x = y$ | $\le$, « divise » sur $\mathbb{N}$ |
| transitive | $(x R y \land y R z) \Rightarrow x R z$ | $<$, « est un ancêtre de » |

:::definition
- Une **relation d'équivalence** est réflexive, symétrique et transitive. Elle partage $E$ en **classes d'équivalence** disjointes : la classe de $x$
  est l'ensemble des éléments équivalents à $x$. Exemple : « a le même reste dans la division par 3 » partage $\mathbb{Z}$ en trois classes.
- Une **relation d'ordre** est réflexive, antisymétrique et transitive. Elle est **totale** si deux éléments sont toujours comparables ($\le$ sur les
  nombres, ordre alphabétique), **partielle** sinon (inclusion des ensembles, divisibilité : ni 2 | 3 ni 3 | 2).
:::

```python exec
def proprietes(E, R):
    return {
        "réflexive": all((x, x) in R for x in E),
        "symétrique": all((y, x) in R for (x, y) in R),
        "antisymétrique": all(x == y for (x, y) in R if (y, x) in R),
        "transitive": all((x, z) in R for (x, y) in R for (y2, z) in R if y == y2),
    }

E = range(1, 7)
divise = {(a, b) for a in E for b in E if b % a == 0}
modulo3 = {(a, b) for a in E for b in E if a % 3 == b % 3}
print("divise   :", proprietes(E, divise))
print("modulo 3 :", proprietes(E, modulo3))
```

Trier une liste suppose une relation d'**ordre total** : si l'on trie avec une comparaison qui n'est pas transitive, le résultat n'a plus de sens.
L'**ordre lexicographique** (celui du dictionnaire, et des tuples en Python) compare d'abord les premières composantes, puis les suivantes en cas
d'égalité : c'est un ordre total si chaque composante l'est.

## 3. Fonctions

Une **fonction** (ou application) $f : E \to F$ associe à chaque élément de $E$ **exactement un** élément de $F$. En Python, un dictionnaire dont les
clés sont tous les éléments de $E$ en est une représentation.

- $f$ est **injective** si deux éléments distincts ont toujours des images distinctes (pas de « collision ») ;
- $f$ est **surjective** si tout élément de $F$ est l'image d'au moins un élément ;
- $f$ est **bijective** si elle est les deux : elle a alors une **réciproque** $f^{-1}$.

Pour des ensembles finis : $f$ injective impose $|E| \le |F|$, surjective $|E| \ge |F|$, bijective $|E| = |F|$. Le **principe des tiroirs** en
découle : si $|E| > |F|$, aucune fonction de $E$ dans $F$ n'est injective. Une **fonction de hachage** de toutes les chaînes vers les entiers de 0 à
$2^{256} - 1$ ne peut donc pas être injective : les collisions existent forcément ; on demande seulement qu'elles soient introuvables en pratique.

:::prof
Ces notions sont surtout utiles au professeur pour parler juste : une table SQL est une **relation** (ensemble de $n$-uplets, donc sans doublon ni
ordre — d'où `DISTINCT` et `ORDER BY`), une clé primaire rend la fonction « clé → ligne » injective, un dictionnaire Python est une fonction
finie. En SNT et NSI, le type `set` de Python et les opérations ensemblistes sur les données (intersection de deux listes d'élèves…) en sont des
applications directes.
:::

## Exemple guidé

**Problème.** Dans un réseau social scolaire, on connaît une liste de couples « $a$ a envoyé un message à $b$ ». Deux élèves sont dans le même
**groupe** s'ils sont reliés par une chaîne de messages (dans un sens ou dans l'autre). Calculer les groupes.

**1. Reconnaître une relation d'équivalence.** « Être relié par une chaîne » est réflexive (chaîne vide), symétrique (on ignore le sens) et transitive
(on concatène les chaînes) : les groupes sont ses **classes d'équivalence** — les composantes connexes du graphe.

**2. Calculer les classes** par un parcours : on prend un élève non encore classé, on explore tous ceux qu'on peut atteindre.

```python exec
messages = [("Léa", "Hugo"), ("Hugo", "Inès"), ("Noé", "Adam"), ("Jade", "Jade"), ("Inès", "Léa")]
eleves = {x for couple in messages for x in couple} | {"Zoé"}

voisins = {e: set() for e in eleves}
for a, b in messages:
    voisins[a].add(b)
    voisins[b].add(a)              # on symétrise

classes, vus = [], set()
for e in sorted(eleves):
    if e in vus:
        continue
    classe, pile = set(), [e]
    while pile:
        x = pile.pop()
        if x not in classe:
            classe.add(x)
            pile.extend(voisins[x] - classe)
    vus |= classe
    classes.append(sorted(classe))
print(classes)
```

**3. Vérifier.** Les classes forment une **partition** : elles sont non vides, disjointes, et leur union est l'ensemble des élèves (Zoé, sans message,
forme sa propre classe).

## L'essentiel

- Opérations : $\cup$, $\cap$, $\setminus$, $\triangle$, $\subseteq$ (`|`, `&`, `-`, `^`, `<=`) ; $|E \times F| = |E||F|$, $|\mathcal{P}(E)| = 2^{|E|}$ ; inclusion-exclusion.
- Relation binaire = ensemble de couples = graphe ; réflexive, symétrique, antisymétrique, transitive.
- **Équivalence** (réflexive, symétrique, transitive) → partition en classes ; **ordre** (réflexive, antisymétrique, transitive), total ou partiel ; ordre lexicographique.
- Fonctions : injective, surjective, bijective ; principe des tiroirs ; une table SQL est une relation $n$-aire.

## Exercices

::::exercice[Nature d'une relation]{niveau=1}
Sur l'ensemble des élèves d'un lycée, la relation « est dans la même classe que » est :

- [ ] une relation d'ordre
- [x] une relation d'équivalence
- [ ] ni réflexive ni symétrique
- [ ] antisymétrique

:::corrige
Chacun est dans la même classe que lui-même (réflexive) ; si A est avec B, B est avec A (symétrique) ; si A est avec B et B avec C, A est avec C
(transitive). Les classes d'équivalence sont… les classes du lycée.
:::
::::

::::exercice[Compter des parties]{niveau=1}
Un menu propose 6 garnitures, et l'on peut en choisir autant qu'on veut (y compris aucune). Combien de pizzas différentes ?

- [ ] 6
- [ ] 36
- [x] 64
- [ ] 720

:::corrige
Une pizza correspond à une partie de l'ensemble des 6 garnitures : $2^6 = 64$ (chaque garniture est présente ou non).
:::
::::

::::exercice[Propriétés d'une relation]{niveau=2}
Écris `est_equivalence(E, R)` et `est_ordre(E, R)` pour une relation `R` (ensemble de couples) sur un ensemble fini `E`.

```python depart
def est_equivalence(E, R):
    ...

def est_ordre(E, R):
    ...
```

```python tests
E = range(1, 9)
assert est_ordre(E, {(a, b) for a in E for b in E if b % a == 0}), "divisibilité"
assert not est_equivalence(E, {(a, b) for a in E for b in E if b % a == 0}), "divisibilité : pas symétrique"
assert est_equivalence(E, {(a, b) for a in E for b in E if a % 3 == b % 3}), "modulo 3"
assert not est_ordre(E, {(a, b) for a in E for b in E if a < b}), "< n'est pas réflexive"
assert not est_equivalence({1, 2, 3}, {(1, 1), (2, 2), (3, 3), (1, 2), (2, 1), (2, 3), (3, 2)}), "pas transitive"
```

:::corrige
```python solution
def reflexive(E, R):
    return all((x, x) in R for x in E)

def symetrique(R):
    return all((y, x) in R for (x, y) in R)

def antisymetrique(R):
    return all(x == y for (x, y) in R if (y, x) in R)

def transitive(R):
    return all((x, z) in R for (x, y) in R for (y2, z) in R if y == y2)

def est_equivalence(E, R):
    return reflexive(E, R) and symetrique(R) and transitive(R)

def est_ordre(E, R):
    return reflexive(E, R) and antisymetrique(R) and transitive(R)
```
Chaque propriété est une phrase quantifiée traduite par `all`. Le dernier test : 1 R 2 et 2 R 3, mais pas 1 R 3. La vérification de la transitivité
coûte $O(|R|^2)$.
:::
::::

::::exercice[Injective, surjective]{niveau=2}
Une fonction finie est donnée par un dictionnaire `f` (ses clés forment l'ensemble de départ) et un ensemble d'arrivée `F`. Écris
`nature(f, F)` qui renvoie `"bijective"`, `"injective"`, `"surjective"` ou `"aucune"`.

```python depart
def nature(f, F):
    ...
```

```python tests
assert nature({1: "a", 2: "b", 3: "c"}, {"a", "b", "c"}) == "bijective", "bijection"
assert nature({1: "a", 2: "b"}, {"a", "b", "c"}) == "injective", "injection"
assert nature({1: "a", 2: "a", 3: "b"}, {"a", "b"}) == "surjective", "surjection"
assert nature({1: "a", 2: "a"}, {"a", "b"}) == "aucune", "ni l'une ni l'autre"
```

:::corrige
```python solution
def nature(f, F):
    images = list(f.values())
    injective = len(set(images)) == len(images)
    surjective = set(images) == set(F)
    if injective and surjective:
        return "bijective"
    if injective:
        return "injective"
    if surjective:
        return "surjective"
    return "aucune"
```
Injective : pas de doublon parmi les images (`set` les élimine). Surjective : l'ensemble des images couvre tout l'ensemble d'arrivée.
:::
::::

::::exercice[Fermeture transitive]{niveau=3}
Écris `fermeture(E, R)` qui renvoie la fermeture transitive de la relation `R` sur `E` (ensemble de couples), avec l'algorithme de **Warshall** : pour
chaque élément `k` de `E`, pour tous `i`, `j`, si `(i, k)` et `(k, j)` sont dans la relation, on ajoute `(i, j)`.

```python depart
def fermeture(E, R):
    ...
```

```python tests
assert fermeture({1, 2, 3}, {(1, 2), (2, 3)}) == {(1, 2), (2, 3), (1, 3)}, "chaîne"
assert fermeture({1, 2, 3, 4}, {(1, 2), (2, 3), (3, 4)}) == {(1, 2), (2, 3), (3, 4), (1, 3), (2, 4), (1, 4)}, "chaîne de 4"
assert fermeture({1, 2}, {(1, 2), (2, 1)}) == {(1, 2), (2, 1), (1, 1), (2, 2)}, "cycle"
assert fermeture({1, 2, 3}, set()) == set(), "relation vide"
```

:::corrige
```python solution
def fermeture(E, R):
    T = set(R)
    for k in E:
        for i in E:
            if (i, k) in T:
                for j in E:
                    if (k, j) in T:
                        T.add((i, j))
    return T
```
Invariant de Warshall : après avoir traité les éléments $k_1, \dots, k_m$, $(i, j) \in T$ si et seulement s'il existe un chemin de $i$ à $j$ dont tous les
sommets intermédiaires sont parmi $k_1, \dots, k_m$. À la fin, tous les intermédiaires sont permis : c'est l'accessibilité dans le graphe. Coût
$O(|E|^3)$. (« Être ancêtre de » est la fermeture transitive de « être parent de ».)
:::
::::

::::exercice[Relations et bases de données]{niveau=4 duree=20}
Un professeur explique : « Une table SQL, c'est une relation. »

1. Justifiez cette phrase à partir de la définition mathématique d'une relation, et expliquez ce qu'elle implique sur les doublons et l'ordre des lignes.
2. La clé primaire d'une table : quelle propriété d'une fonction exprime-t-elle ?
3. La relation « a pour classe » entre élèves et classes est-elle une fonction ? Et « a pour professeur » entre élèves et professeurs ? Quelles
   conséquences pour la modélisation (nombre de tables) ?

:::criteres
- Une relation $n$-aire est un sous-ensemble de $D_1 \times \dots \times D_n$ : un ensemble de $n$-uplets ; donc pas de doublon ni d'ordre (d'où DISTINCT et ORDER BY en SQL, qui s'écartent du modèle).
- Clé primaire : la fonction « valeur de clé → ligne » est bien définie et injective (deux lignes distinctes n'ont pas la même clé) ; dépendance fonctionnelle.
- « a pour classe » : fonction (chaque élève a une classe) → clé étrangère dans la table élève ; « a pour professeur » : relation plusieurs à plusieurs, pas une fonction → table d'association.
:::

:::corrige
1. Une relation entre des ensembles $D_1, \dots, D_n$ est un sous-ensemble de $D_1 \times \dots \times D_n$, c'est-à-dire un **ensemble de $n$-uplets**. Une
   table dont les colonnes prennent leurs valeurs dans des domaines est exactement cela : chaque ligne est un $n$-uplet. Comme c'est un **ensemble**,
   il n'y a en théorie ni doublon ni ordre des lignes ; les SGBD s'en écartent (ils acceptent des doublons, d'où `DISTINCT`, et l'ordre n'est garanti que
   par `ORDER BY`).
2. La clé primaire garantit que la clé **détermine** la ligne : la correspondance « clé → ligne » est une **fonction** (bien définie) et elle est
   **injective** (deux lignes distinctes n'ont jamais la même clé). On parle de **dépendance fonctionnelle** : tous les attributs dépendent de la clé.
3. « a pour classe » : chaque élève a exactement une classe, c'est une **fonction** élèves → classes (non injective, surjective si chaque classe a au
   moins un élève) : il suffit d'une **clé étrangère** `id_classe` dans la table `eleve`. « a pour professeur » : un élève a plusieurs professeurs et un
   professeur plusieurs élèves : ce n'est **pas** une fonction mais une relation plusieurs à plusieurs ; il faut une **table d'association**
   (`enseignement(id_eleve, id_prof, matiere)`).
:::
::::
