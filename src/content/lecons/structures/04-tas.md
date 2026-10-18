---
titre: Files de priorité et tas
resume: Servir toujours l'élément le plus prioritaire, efficacement, grâce au tas binaire rangé dans un tableau.
duree: 75
objectifs:
  - Spécifier le type abstrait file de priorité et comparer des implémentations naïves
  - Définir un tas binaire (min-tas) et le représenter dans un tableau
  - Programmer l'insertion (remontée) et l'extraction du minimum (descente) en $O(\log n)$
  - Utiliser le module `heapq` et le tri par tas
prerequis: [structures/piles-files, algo/complexite]
programme: [asd-lineaires, asd-arbres, nsit-structures]
cartes:
  - q: Opérations d'une file de priorité (version « min ») ?
    r: "`inserer(x)`, `extraire_min()` (retirer et renvoyer le plus petit), `minimum()`, `est_vide()`."
  - q: Qu'est-ce qu'un min-tas ?
    r: "Un arbre binaire **presque complet** (tous les niveaux pleins sauf le dernier, rempli à gauche) où chaque nœud est **inférieur ou égal** à ses enfants. La racine est le minimum."
  - q: Dans un tas rangé dans un tableau à partir de l'indice 0, où sont les enfants et le parent de la case i ?
    r: "Enfants en `2i + 1` et `2i + 2`, parent en `(i - 1) // 2`."
  - q: Coût de l'insertion et de l'extraction du minimum dans un tas de n éléments ?
    r: "$O(\\log n)$ chacune (hauteur du tas), et $O(1)$ pour lire le minimum."
  - q: Principe de l'insertion dans un tas ?
    r: "On place le nouvel élément dans la première case libre (fin du tableau) puis on le fait **remonter** en l'échangeant avec son parent tant qu'il est plus petit."
  - q: Principe de l'extraction du minimum ?
    r: "On remplace la racine par le dernier élément, puis on le fait **descendre** en l'échangeant avec le plus petit de ses enfants tant qu'il est plus grand."
  - q: Fonctions de `heapq` ?
    r: "`heapq.heappush(t, x)`, `heapq.heappop(t)` (min), `heapq.heapify(t)` (en place, linéaire) ; `t[0]` est le minimum."
---

Aux urgences, on ne soigne pas les patients dans l'ordre d'arrivée mais selon la **gravité** ; un système d'exploitation
donne la main au processus le plus **prioritaire** ; l'algorithme de Dijkstra traite toujours le sommet **le plus proche**.
Il faut une structure qui permette d'ajouter des éléments et de retirer **le plus prioritaire** rapidement : la **file de
priorité**. Sa meilleure implémentation simple, le **tas binaire**, réalise les deux opérations en $O(\log n)$ et tient
dans un simple tableau. Le programme mentionne explicitement la « file à priorité » parmi les structures linéaires.

## 1. Le type abstrait file de priorité

:::definition
Une **file de priorité** (ici « min ») stocke des éléments munis d'une **priorité** comparable. Opérations :
`inserer(x)`, `minimum()` (lire l'élément de plus petite priorité), `extraire_min()` (le retirer et le renvoyer ;
précondition : non vide), `est_vide()`.
:::

Implémentations naïves :

| Implémentation   | `inserer`     | `extraire_min` |
|------------------|---------------|----------------|
| liste non triée  | $\Theta(1)$   | $\Theta(n)$ (chercher le minimum) |
| liste triée (décroissante, min à la fin) | $\Theta(n)$ (insertion à sa place) | $\Theta(1)$ |
| **tas binaire**  | $O(\log n)$   | $O(\log n)$    |

Pour $n$ insertions et $n$ extractions, les deux premières coûtent $\Theta(n^2)$, le tas $\Theta(n \log n)$.

## 2. Le tas binaire

:::definition
Un **min-tas** est un arbre binaire :
- **presque complet** : tous les niveaux sont remplis, sauf peut-être le dernier, rempli de gauche à droite ;
- ordonné en **tas** : chaque nœud est inférieur ou égal à ses enfants.

La **racine** est donc le minimum. (Un max-tas est défini symétriquement.)
:::

Grâce à la forme presque complète, on range le tas **dans un tableau**, niveau par niveau, sans aucun pointeur :
la racine en case 0, ses enfants en 1 et 2, les enfants de 1 en 3 et 4, etc.

```mermaid legende="Le min-tas [2, 5, 3, 9, 6, 8, 4] : chaque parent est ≤ ses enfants"
graph TD
  A["2 (0)"] --> B["5 (1)"]
  A --> C["3 (2)"]
  B --> D["9 (3)"]
  B --> E["6 (4)"]
  C --> F["8 (5)"]
  C --> G["4 (6)"]
```

<div class="cases"><span>2<small>0</small></span><span>5<small>1</small></span><span>3<small>2</small></span><span>9<small>3</small></span><span>6<small>4</small></span><span>8<small>5</small></span><span>4<small>6</small></span></div>

:::retenir
Pour la case `i` : enfants en `2*i + 1` et `2*i + 2` ; parent en `(i - 1) // 2`.
Un tas de $n$ éléments a une hauteur $\lfloor \log_2 n \rfloor$.
:::

## 3. Insérer : faire remonter

On place le nouvel élément dans la **première case libre** (à la fin du tableau), ce qui garde la forme presque complète.
L'ordre de tas peut être violé entre lui et son parent : on les **échange** tant que l'élément est plus petit que son
parent (on le fait « remonter »).

```python exec
def inserer(tas, x):
    tas.append(x)
    i = len(tas) - 1
    while i > 0 and tas[i] < tas[(i - 1) // 2]:
        parent = (i - 1) // 2
        tas[i], tas[parent] = tas[parent], tas[i]
        i = parent

tas = [2, 5, 3, 9, 6, 8, 4]
inserer(tas, 1)
print(tas)
```

Insertion de 1 : placé en case 7 (enfant de 9) ; 1 < 9 → échange (case 3) ; 1 < 5 → échange (case 1) ; 1 < 2 → échange
(case 0). Au plus **hauteur** échanges : $O(\log n)$.

## 4. Extraire le minimum : faire descendre

Le minimum est `tas[0]`. Pour le retirer sans casser la forme, on met à sa place le **dernier** élément du tableau, puis on
le fait **descendre** : tant qu'il est plus grand que l'un de ses enfants, on l'échange avec **le plus petit** des deux.

```python exec
def extraire_min(tas):
    minimum = tas[0]
    dernier = tas.pop()
    if tas:
        tas[0] = dernier
        i = 0
        n = len(tas)
        while True:
            g, d = 2 * i + 1, 2 * i + 2
            plus_petit = i
            if g < n and tas[g] < tas[plus_petit]:
                plus_petit = g
            if d < n and tas[d] < tas[plus_petit]:
                plus_petit = d
            if plus_petit == i:
                break
            tas[i], tas[plus_petit] = tas[plus_petit], tas[i]
            i = plus_petit
    return minimum

tas = [1, 2, 3, 5, 6, 8, 4, 9]
print(extraire_min(tas), tas)
print([extraire_min(tas) for _ in range(len(tas))])
```

Échanger avec le **plus petit** enfant est essentiel : il devient le parent de l'autre enfant, et il lui est bien inférieur.
Au plus **hauteur** échanges : $O(\log n)$.

## 5. En Python : `heapq`

Le module `heapq` manipule une liste Python comme un min-tas, exactement avec la représentation ci-dessus :

```python exec
import heapq

taches = []
heapq.heappush(taches, (3, "répondre aux mails"))
heapq.heappush(taches, (1, "corriger les copies"))
heapq.heappush(taches, (2, "préparer le cours"))
while taches:
    priorite, tache = heapq.heappop(taches)
    print(priorite, tache)

t = [9, 4, 7, 1, 8]
heapq.heapify(t)          # transforme la liste en tas, en temps linéaire
print(t[0], heapq.nsmallest(3, [9, 4, 7, 1, 8]))
```

On utilise des **couples** `(priorité, élément)` : les tuples se comparent d'abord sur leur premier élément.

### Le tri par tas

Insérer les $n$ éléments puis les extraire un à un donne la liste triée : $n$ opérations en $O(\log n)$ chacune, soit
$O(n \log n)$ au pire (contrairement au tri rapide). En construisant le tas avec `heapify` ($O(n)$) et en le faisant dans le
tableau lui-même, on obtient un tri **en place** en $O(n \log n)$ (non stable).

:::prof
Le tas n'est pas explicitement au programme de NSI, mais la file de priorité l'est au concours, et elle apparaît dès qu'on
étudie Dijkstra ou l'ordonnancement. La représentation dans un tableau est un bel exemple de la différence entre la
structure **logique** (un arbre) et la structure **physique** (un tableau). Faire dessiner l'arbre et le tableau côte à côte
à chaque échange est la meilleure façon de le comprendre.
:::

## Exemple guidé

**Problème.** À partir d'un tas vide, insérer successivement 7, 3, 9, 1, 5, puis extraire deux fois le minimum. Donner
l'état du tableau après chaque opération et compter les échanges.

| opération     | tableau après                 | échanges |
|---------------|-------------------------------|----------|
| insérer 7     | `[7]`                         | 0        |
| insérer 3     | `[3, 7]` (3 < 7 : échange)    | 1        |
| insérer 9     | `[3, 7, 9]` (9 > 3)           | 0        |
| insérer 1     | `[1, 3, 9, 7]` (1 < 7, puis 1 < 3) | 2   |
| insérer 5     | `[1, 3, 9, 7, 5]` (5 > 3)     | 0        |
| extraire → 1  | `[3, 5, 9, 7]` (5 remplace la racine, échange avec 3, puis 5 < 7 : arrêt) | 1 |
| extraire → 3  | `[5, 7, 9]` (7 en racine, échange avec 5) | 1 |

Détail de la première extraction : le dernier élément, 5, remplace la racine : `[5, 3, 9, 7]`. Ses enfants sont 3 et 9 ;
le plus petit, 3, est inférieur à 5 : échange → `[3, 5, 9, 7]`. 5 est maintenant en case 1, son enfant (case 3) vaut 7 :
5 < 7, on s'arrête.

```python exec
import heapq
t = []
for x in [7, 3, 9, 1, 5]:
    heapq.heappush(t, x)
    print("insérer", x, t)
for _ in range(2):
    m = heapq.heappop(t)
    print("extraire", m, t)
```

## L'essentiel

- File de priorité : `inserer`, `extraire_min`, `minimum` ; naïvement, une des deux opérations est en $\Theta(n)$.
- Min-tas : arbre binaire presque complet, chaque parent ≤ ses enfants ; la racine est le minimum.
- Dans un tableau : enfants de `i` en `2i+1`, `2i+2` ; parent en `(i-1)//2` ; hauteur $\lfloor \log_2 n \rfloor$.
- Insertion : à la fin puis **remontée** ; extraction : dernier élément en racine puis **descente** (avec le plus petit enfant). $O(\log n)$.
- Python : `heapq.heappush`, `heappop`, `heapify` (linéaire) ; couples `(priorité, élément)`.
- Tri par tas : $O(n \log n)$ au pire, en place, non stable.

## Exercices

::::exercice[Indices dans un tas]{niveau=1}
Dans un tas rangé dans un tableau à partir de la case 0, quels sont les indices des enfants de la case 4 et de son parent ?

- [ ] enfants 8 et 9, parent 2
- [x] enfants 9 et 10, parent 1
- [ ] enfants 5 et 6, parent 3
- [ ] enfants 9 et 10, parent 2

:::corrige
Enfants : $2 \times 4 + 1 = 9$ et $2 \times 4 + 2 = 10$ ; parent : $(4 - 1) // 2 = 1$.
:::
::::

::::exercice[Reconnaître un tas]{niveau=1}
Lesquels de ces tableaux sont des min-tas ?

- [x] `[1, 3, 2, 7, 4]`
- [ ] `[1, 3, 2, 2, 4, 1]`
- [x] `[5, 5, 5]`
- [ ] `[2, 1, 3]`

:::corrige
`[1, 3, 2, 7, 4]` : 1 ≤ 3, 1 ≤ 2, 3 ≤ 7, 3 ≤ 4 ✓. `[1, 3, 2, 2, 4, 1]` : la case 5 (valeur 1) a pour parent la case 2
(valeur 2) : 2 > 1 ✗. `[5, 5, 5]` : égalités permises ✓. `[2, 1, 3]` : 2 > 1 ✗.
:::
::::

::::exercice[Vérifier la propriété de tas]{niveau=2}
Écris `est_tas(t)` qui renvoie `True` si le tableau `t` représente un min-tas.

```python depart
def est_tas(t):
    ...
```

```python tests
assert est_tas([1, 3, 2, 7, 4]) == True, "tas valide"
assert est_tas([1, 3, 2, 2, 4, 1]) == False, "dernier élément trop petit"
assert est_tas([]) == True, "tas vide"
assert est_tas([5, 5, 5]) == True, "égalités"
assert est_tas([2, 1]) == False, "enfant plus petit que la racine"
```

:::corrige
```python solution
def est_tas(t):
    for i in range(1, len(t)):
        if t[(i - 1) // 2] > t[i]:
            return False
    return True
```
Il suffit de comparer chaque élément (sauf la racine) à son parent : $n - 1$ comparaisons.
:::
::::

::::exercice[Insertion dans un tas]{niveau=2}
Écris `inserer(tas, x)` qui ajoute `x` au min-tas `tas` (une liste Python) en le faisant remonter, sans utiliser `heapq`.

```python depart
def inserer(tas, x):
    ...
```

```python tests
t = []
for x in [7, 3, 9, 1, 5]:
    inserer(t, x)
assert t == [1, 3, 9, 7, 5], "insertions successives"
inserer(t, 0)
assert t[0] == 0, "nouveau minimum à la racine"
assert all(t[(i - 1) // 2] <= t[i] for i in range(1, len(t))), "propriété de tas"
```

:::corrige
```python solution
def inserer(tas, x):
    tas.append(x)
    i = len(tas) - 1
    while i > 0 and tas[i] < tas[(i - 1) // 2]:
        p = (i - 1) // 2
        tas[i], tas[p] = tas[p], tas[i]
        i = p
```
La comparaison stricte `<` évite des échanges inutiles avec un parent égal.
:::
::::

::::exercice[Extraction du minimum]{niveau=3}
Écris `extraire_min(tas)` qui retire et renvoie le minimum du min-tas `tas` en faisant descendre le dernier élément
(sans `heapq`). Précondition : tas non vide.

```python depart
def extraire_min(tas):
    ...
```

```python tests
t = [1, 3, 9, 7, 5]
assert extraire_min(t) == 1 and t == [3, 5, 9, 7], "première extraction"
assert extraire_min(t) == 3, "deuxième extraction"
u = [4]
assert extraire_min(u) == 4 and u == [], "un seul élément"
import random
random.seed(5)
v = []
for x in random.sample(range(1000), 200):
    v.append(x)
    i = len(v) - 1
    while i > 0 and v[i] < v[(i - 1) // 2]:
        v[i], v[(i - 1) // 2] = v[(i - 1) // 2], v[i]
        i = (i - 1) // 2
sortie = [extraire_min(v) for _ in range(200)]
assert sortie == sorted(sortie), "200 extractions dans l'ordre croissant"
```

:::corrige
```python solution
def extraire_min(tas):
    minimum = tas[0]
    dernier = tas.pop()
    if tas:
        tas[0] = dernier
        i, n = 0, len(tas)
        while True:
            g, d = 2 * i + 1, 2 * i + 2
            m = i
            if g < n and tas[g] < tas[m]:
                m = g
            if d < n and tas[d] < tas[m]:
                m = d
            if m == i:
                break
            tas[i], tas[m] = tas[m], tas[i]
            i = m
    return minimum
```
Cas délicat : un seul élément (`pop` le retire et il ne reste rien à faire descendre). Le dernier test extrait 200 fois et
vérifie que les minima sortent dans l'ordre croissant : c'est le tri par tas.
:::
::::

::::exercice[Les k plus grands]{niveau=3}
Écris `k_plus_grands(t, k)` qui renvoie la liste des `k` plus grands éléments de `t`, du plus grand au plus petit, en
$O(n \log k)$ : on garde un **min-tas** de taille au plus `k` contenant les `k` plus grands vus jusqu'ici. Utilise `heapq`.

```python depart
import heapq

def k_plus_grands(t, k):
    ...
```

```python tests
assert k_plus_grands([5, 1, 9, 3, 7, 6], 3) == [9, 7, 6], "trois plus grands"
assert k_plus_grands([4, 4, 1], 2) == [4, 4], "doublons"
assert k_plus_grands([2, 1], 5) == [2, 1], "k plus grand que n"
assert k_plus_grands([], 3) == [], "liste vide"
```

:::corrige
```python solution
import heapq

def k_plus_grands(t, k):
    tas = []
    for x in t:
        if len(tas) < k:
            heapq.heappush(tas, x)
        elif k > 0 and x > tas[0]:
            heapq.heapreplace(tas, x)     # retire le minimum et insère x
    return sorted(tas, reverse=True)
```
Le minimum du tas est le **plus petit des k meilleurs** : un nouvel élément n'entre que s'il le dépasse. Chaque opération
sur un tas de taille `k` coûte $O(\log k)$ : total $O(n \log k)$, bien mieux que trier ($O(n \log n)$) quand `k` est petit.
:::
::::

::::exercice[Hauteur et coût d'un tas]{niveau=4 duree=20}
1. Montre qu'un arbre binaire presque complet de hauteur $h$ (la racine est au niveau 0) a entre $2^h$ et $2^{h+1} - 1$
   nœuds. En déduire que la hauteur d'un tas de $n$ éléments est $\lfloor \log_2 n \rfloor$.
2. En déduire le nombre maximal d'échanges d'une insertion et d'une extraction.
3. Prouve que l'insertion par remontée préserve la propriété de tas (indique ce qui est vrai à chaque étape de la remontée).
4. Quel est le coût du tri par tas (n insertions puis n extractions) ? Pourquoi n'est-il pas stable ? Donne un exemple.

:::criteres
- Q1 : niveaux $0$ à $h - 1$ pleins ($2^h - 1$ nœuds) plus au moins un et au plus $2^h$ nœuds au niveau $h$ ; d'où $2^h \le n \le 2^{h+1} - 1$, donc $h \le \log_2 n < h + 1$, $h = \lfloor \log_2 n \rfloor$.
- Q2 : au plus $h = \lfloor \log_2 n \rfloor$ échanges pour chaque opération (un par niveau), donc $O(\log n)$.
- Q3 : invariant de la remontée : le tableau est un tas sauf peut-être entre l'élément remonté et son parent ; un échange restaure la relation localement (l'ancien parent, plus petit que ses anciens enfants, reste bien placé) ; à l'arrêt (racine ou parent ≤), c'est un tas.
- Q4 : $n$ opérations de chaque type en $O(\log n)$ : $O(n \log n)$ ; non stable car les échanges à distance (avec le dernier élément, avec le parent) peuvent inverser deux éléments de même priorité ; exemple avec des couples de même clé.
:::

:::corrige
1. Dans un arbre presque complet de hauteur $h$, les niveaux $0$ à $h-1$ sont pleins : $1 + 2 + \dots + 2^{h-1} = 2^h - 1$
   nœuds ; le niveau $h$ contient entre 1 et $2^h$ nœuds. Donc $2^h \le n \le 2^{h+1} - 1 < 2^{h+1}$, d'où
   $h \le \log_2 n < h + 1$ : $h = \lfloor \log_2 n \rfloor$.
2. Chaque échange de la remontée fait monter l'élément d'un niveau ; chaque échange de la descente le fait descendre d'un
   niveau. Il y a au plus $h = \lfloor \log_2 n \rfloor$ échanges par opération : $O(\log n)$.
3. **Invariant de la remontée** : la propriété « parent ≤ enfant » est vraie pour toutes les paires, **sauf peut-être** entre
   l'élément `x` en remontée (case `i`) et son parent `p`. De plus, le parent `p` est ≤ aux enfants de `x`. Si `x < p`, on
   échange : `x` devient le parent de `p` (et de l'autre enfant de l'ancien `p`, qui était ≥ `p` > `x`) : relations vérifiées ;
   `p` descend à la place de `x`, et il est ≤ aux enfants de `x` (car ils étaient ≥ `p` par l'invariant précédent, ou parce que
   `p` était déjà leur ancêtre). Seule la paire (`x`, nouveau parent) peut être fausse : invariant conservé. On s'arrête quand
   `x` est la racine ou que son parent est ≤ `x` : plus aucune paire n'est fausse, c'est un tas.
4. $n$ insertions et $n$ extractions en $O(\log n)$ : $O(n \log n)$ au pire. Il n'est pas stable : insérons, en comparant
   **seulement la priorité** (le nombre), les couples `(1, "a")`, `(0, "c")`, `(1, "b")` dans cet ordre. Le tableau devient
   `[(0, "c"), (1, "a"), (1, "b")]`. L'extraction de `(0, "c")` met le **dernier** élément, `(1, "b")`, à la racine ; son
   enfant `(1, "a")` n'est pas strictement plus petit, il n'y a pas d'échange : `(1, "b")` sort avant `(1, "a")`, alors qu'il
   avait été inséré après. Les échanges « à distance » (dernier élément placé à la racine) cassent l'ordre des égaux.
:::
::::
