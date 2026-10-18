---
titre: "Sujet blanc 1 — Sous-tableaux et files de priorité"
epreuve: ecrit1
duree: 240
resume: "Un sujet original de 4 heures dans l'esprit de la première épreuve d'admissibilité : analyse et preuve d'algorithmes sur le problème du sous-tableau de somme maximale, puis étude d'une file de priorité implémentée par un tas."
themes: [preuve, coût, récursivité, diviser pour régner, programmation dynamique, tas]
ordre: 1
---

Le sujet comporte deux parties **indépendantes**. Les programmes sont écrits en Python. Toute réponse doit être **justifiée** ; on peut admettre le résultat d'une
question pour traiter les suivantes. Dans tout le sujet, `t` désigne une liste non vide de $n$ entiers relatifs, et `t[i:j]` la tranche des indices $i$ à $j - 1$.

## Partie A — Le sous-tableau de somme maximale

Un **sous-tableau** de `t` est une tranche `t[i:j]` avec $0 \le i < j \le n$ (non vide). On cherche la **somme maximale** d'un sous-tableau. Par exemple, pour
`t = [2, -5, 4, -1, 3, -6, 2]`, le maximum vaut 6, atteint par `[4, -1, 3]`.

::::exercice[Algorithme naïf]{niveau=4}
1. Écrire une fonction `somme_max_naif(t)` qui examine **tous** les sous-tableaux et calcule chaque somme **sans** utiliser `sum` sur une tranche (une boucle sur $j$
   accumule la somme de `t[i:j]`).
2. Combien d'additions effectue-t-elle, en fonction de $n$ ? En déduire son coût.

```python depart
def somme_max_naif(t):
    ...
```

```python tests
assert somme_max_naif([2, -5, 4, -1, 3, -6, 2]) == 6, "exemple de l'énoncé"
assert somme_max_naif([-3, -1, -2]) == -1, "que des négatifs : le meilleur élément seul"
assert somme_max_naif([5]) == 5, "un seul élément"
assert somme_max_naif([1, 2, 3]) == 6, "tout le tableau"
```

:::corrige
```python solution
def somme_max_naif(t):
    n = len(t)
    meilleur = t[0]
    for i in range(n):
        s = 0
        for j in range(i + 1, n + 1):
            s += t[j - 1]                  # s = somme de t[i:j]
            if s > meilleur:
                meilleur = s
    return meilleur
```
Pour chaque $i$, la boucle interne fait $n - i$ additions : au total $\sum_{i=0}^{n-1} (n - i) = \frac{n(n+1)}{2}$ additions, soit un coût **quadratique**
$\Theta(n^2)$. (Recalculer chaque somme avec `sum(t[i:j])` donnerait un coût cubique.) L'initialisation à `t[0]` (et non à 0) traite le cas où tous les éléments
sont négatifs.
:::
::::

::::exercice[Diviser pour régner]{niveau=4 duree=40}
On coupe `t` en deux moitiés `G = t[:m]` et `D = t[m:]` avec $m = \lfloor n/2 \rfloor$ (pour $n \ge 2$). Un sous-tableau de somme maximale est entièrement dans `G`,
entièrement dans `D`, ou **à cheval** sur les deux.

1. Écrire une fonction `a_cheval(t, m)` qui calcule en $O(n)$ la somme maximale d'un sous-tableau contenant `t[m-1]` et `t[m]`.
2. En déduire une fonction récursive `somme_max_dpr(t)`.
3. Établir la relation de récurrence vérifiée par son coût $C(n)$ et la résoudre pour $n$ puissance de 2.

```python depart
def a_cheval(t, m):
    ...

def somme_max_dpr(t):
    ...
```

```python tests
assert a_cheval([2, -5, 4, -1, 3, -6, 2], 3) == 6, "à cheval sur 4 | -1"
assert a_cheval([1, -10, 5, 5], 2) == 1, "le meilleur suffixe gauche est négatif mais obligatoire"
assert somme_max_dpr([2, -5, 4, -1, 3, -6, 2]) == 6, "exemple"
assert somme_max_dpr([-3, -1, -2]) == -1, "négatifs"
import random
rng = random.Random(4)
for _ in range(200):
    t = [rng.randint(-20, 20) for _ in range(rng.randint(1, 30))]
    best = max(sum(t[i:j]) for i in range(len(t)) for j in range(i + 1, len(t) + 1))
    if somme_max_dpr(t) != best:
        break
assert somme_max_dpr(t) == best, "comparaison avec la force brute sur 200 tableaux"
```

:::criteres
- `a_cheval` : meilleure somme d'un suffixe non vide de `t[:m]` (en partant de `m-1` vers la gauche) + meilleur préfixe non vide de `t[m:]` ; coût linéaire.
- Récursion correcte avec cas de base $n = 1$, maximum des trois candidats.
- Récurrence $C(n) = 2C(n/2) + \Theta(n)$, résolue en $\Theta(n \log n)$ par déroulement (ou arbre des appels : $\log_2 n$ niveaux de coût $n$).
:::

:::corrige
```python solution
def a_cheval(t, m):
    s, gauche = 0, None
    for i in range(m - 1, -1, -1):          # suffixes de t[:m] contenant t[m-1]
        s += t[i]
        if gauche is None or s > gauche:
            gauche = s
    s, droite = 0, None
    for j in range(m, len(t)):              # préfixes de t[m:] contenant t[m]
        s += t[j]
        if droite is None or s > droite:
            droite = s
    return gauche + droite

def somme_max_dpr(t):
    if len(t) == 1:
        return t[0]
    m = len(t) // 2
    return max(somme_max_dpr(t[:m]), somme_max_dpr(t[m:]), a_cheval(t, m))
```
Un sous-tableau à cheval s'écrit `t[i:m] + t[m:j]` avec $i < m < j$ : sa somme est maximale quand chacune des deux parties l'est, d'où la somme du meilleur suffixe
de gauche et du meilleur préfixe de droite. **Coût** : deux appels sur des moitiés, plus un travail linéaire (`a_cheval` et les tranches) :
$C(n) = 2C(n/2) + an$, $C(1) = b$. En déroulant pour $n = 2^k$ : $C(n) = 2^k C(1) + a n k = bn + an\log_2 n = \Theta(n \log n)$.
:::
::::

::::exercice[Un algorithme linéaire et sa preuve]{niveau=4 duree=40}
On considère la fonction suivante (algorithme de Kadane) :

```python
def somme_max(t):
    fin = t[0]          # meilleure somme d'un sous-tableau se terminant à l'indice courant
    meilleur = t[0]
    for k in range(1, len(t)):
        fin = max(t[k], fin + t[k])
        meilleur = max(meilleur, fin)
    return meilleur
```

1. Donner la trace (valeurs de `k`, `fin`, `meilleur`) pour `t = [2, -5, 4, -1, 3, -6, 2]`.
2. Énoncer un invariant de boucle portant sur `fin` et `meilleur`, et le démontrer.
3. En déduire la correction, la terminaison et le coût.

:::criteres
- Trace exacte (k = 1 à 6 : fin = −3, 4, 3, 6, 0, 2 ; meilleur = 2, 4, 4, 6, 6, 6).
- Invariant : au début du tour k, `fin` est la somme maximale d'un sous-tableau se terminant à l'indice k−1, et `meilleur` la somme maximale d'un sous-tableau de `t[0:k]`.
- Conservation : un sous-tableau se terminant en k est soit `[t[k]]`, soit un sous-tableau se terminant en k−1 prolongé ; mise à jour de `meilleur`.
- Conclusion à la sortie (k = n), terminaison (boucle bornée), coût linéaire Θ(n).
:::

:::corrige
1. Au départ `fin = meilleur = 2`. $k=1$ : `fin = max(-5, -3) = -3`, `meilleur = 2`. $k=2$ : `fin = max(4, 1) = 4`, `meilleur = 4`. $k=3$ : `fin = 3`, `meilleur = 4`. $k=4$ :
   `fin = 6`, `meilleur = 6`. $k=5$ : `fin = max(-6, 0) = 0`, `meilleur = 6`. $k=6$ : `fin = 2`, `meilleur = 6`. Résultat : 6.
2. **Invariant** $I(k)$ : « `fin` est la somme maximale d'un sous-tableau de `t` **se terminant à l'indice** $k - 1$, et `meilleur` est la somme maximale d'un
   sous-tableau de `t[0:k]` ». *Initialisation* ($k = 1$) : le seul sous-tableau se terminant en 0 est `[t[0]]`, et c'est le seul sous-tableau de `t[0:1]`. *Conservation* :
   supposons $I(k)$. Un sous-tableau se terminant en $k$ est soit `[t[k]]`, soit un sous-tableau se terminant en $k - 1$ prolongé par `t[k]` ; la meilleure somme du
   second type est `fin + t[k]` par $I(k)$ ; donc la nouvelle valeur `max(t[k], fin + t[k])` est la meilleure somme se terminant en $k$. Un sous-tableau de `t[0:k+1]`
   est soit dans `t[0:k]` (meilleure somme `meilleur`), soit se termine en $k$ (meilleure somme : la nouvelle `fin`) : la mise à jour de `meilleur` donne $I(k + 1)$.
3. À la sortie, $k = n$ : `meilleur` est la somme maximale d'un sous-tableau de `t[0:n] = t` — correction. La boucle `for` est bornée : terminaison. Chaque tour fait un
   nombre constant d'opérations : coût **linéaire** $\Theta(n)$, optimal puisqu'il faut lire chaque élément. C'est de la **programmation dynamique** : `fin` résume les
   sous-problèmes « se terminant en $k$ ».
:::
::::

## Partie B — Une file de priorité

Une **file de priorité** stocke des éléments comparables et permet d'**insérer** un élément et d'**extraire le minimum**. On l'implémente par un **tas binaire minimum**
rangé dans une liste `tas` : la racine est en position 0, les enfants de la position $i$ sont en $2i + 1$ et $2i + 2$, et chaque nœud est inférieur ou égal à ses enfants.

::::exercice[Positions dans un tas]{niveau=4}
1. Quelle est la position du parent d'un nœud en position $i > 0$ ?
2. Le tas `[1, 3, 2, 7, 4, 5]` est-il valide ? Dessiner l'arbre correspondant.
3. Quelle est la hauteur d'un tas de $n$ éléments (nombre de niveaux) ? Justifier.

:::criteres
- Parent : $\lfloor (i - 1)/2 \rfloor$.
- Arbre dessiné : 1 (racine), enfants 3 et 2, enfants de 3 : 7 et 4, enfant de 2 : 5 ; chaque parent ≤ enfants : valide.
- Hauteur : $\lfloor \log_2 n \rfloor + 1$ niveaux, car le niveau $k$ contient $2^k$ nœuds (sauf le dernier) : $2^{h-1} \le n < 2^h$.
:::

:::corrige
1. Les enfants de $p$ sont $2p + 1$ et $2p + 2$ : le parent de $i$ est $p = \lfloor (i - 1)/2 \rfloor$, soit `(i - 1) // 2`.
2. Racine 1 (position 0) ; ses enfants 3 et 2 (positions 1, 2) ; enfants de 3 : 7 et 4 (positions 3, 4) ; enfant de 2 : 5 (position 5). On vérifie $1 \le 3, 2$ ;
   $3 \le 7, 4$ ; $2 \le 5$ : le tas est **valide**.
3. Le tas est un arbre **complet** : les niveaux $0$ à $h - 2$ sont pleins ($2^k$ nœuds au niveau $k$) et le dernier est rempli à gauche. Donc
   $2^{h-1} \le n \le 2^h - 1$, d'où $h = \lfloor \log_2 n \rfloor + 1$. C'est cette hauteur **logarithmique** qui rend les opérations efficaces.
:::
::::

::::exercice[Insérer et extraire]{niveau=4 duree=40}
1. Écrire `inserer(tas, x)` qui ajoute `x` en fin de liste puis le fait **remonter** tant qu'il est strictement plus petit que son parent.
2. Écrire `extraire_min(tas)` qui renvoie la racine, la remplace par le dernier élément, puis fait **descendre** celui-ci en l'échangeant avec le plus petit de ses
   enfants tant que nécessaire. On suppose le tas non vide.
3. Donner le coût de chaque opération.

```python depart
def inserer(tas, x):
    ...

def extraire_min(tas):
    ...
```

```python tests
def est_tas(t):
    return all(t[(i - 1) // 2] <= t[i] for i in range(1, len(t)))
tas = []
for x in [5, 3, 8, 1, 9, 2, 7]:
    inserer(tas, x)
    assert est_tas(tas), "propriété de tas après insertion"
assert tas[0] == 1, "le minimum est à la racine"
sortie = [extraire_min(tas) for _ in range(7)]
assert sortie == [1, 2, 3, 5, 7, 8, 9], "extraction dans l'ordre croissant"
assert tas == [], "tas vidé"
import random
rng = random.Random(9)
valeurs = [rng.randint(0, 1000) for _ in range(300)]
for v in valeurs:
    inserer(tas, v)
assert [extraire_min(tas) for _ in range(300)] == sorted(valeurs), "tri par tas sur 300 valeurs"
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

def extraire_min(tas):
    mini = tas[0]
    dernier = tas.pop()
    if tas:
        tas[0] = dernier
        i, n = 0, len(tas)
        while True:
            g, d, plus_petit = 2 * i + 1, 2 * i + 2, i
            if g < n and tas[g] < tas[plus_petit]:
                plus_petit = g
            if d < n and tas[d] < tas[plus_petit]:
                plus_petit = d
            if plus_petit == i:
                break
            tas[i], tas[plus_petit] = tas[plus_petit], tas[i]
            i = plus_petit
    return mini
```
Chaque opération parcourt au plus un chemin de la racine à une feuille : coût $O(\log n)$ (hauteur du tas). Le cas où l'on extrait le dernier élément (tas d'un seul
élément) est traité à part : `tas.pop()` le retire et il n'y a rien à faire descendre.
:::
::::

::::exercice[Fusionner k listes triées]{niveau=4 duree=30}
On dispose de $k$ listes triées dont la somme des longueurs vaut $N$. On veut les fusionner en une liste triée.

1. Quel est le coût de la méthode qui concatène tout puis trie avec un tri en $O(N \log N)$ ? Celle qui fusionne les listes deux à deux de gauche à droite ?
2. Proposer un algorithme utilisant une file de priorité contenant **au plus $k$ éléments**, l'écrire (on pourra utiliser le module `heapq`, dont `heappush` et `heappop`
   implémentent un tas minimum sur une liste), et donner son coût.

```python depart
import heapq

def fusionner(listes):
    ...
```

```python tests
assert fusionner([[1, 4, 9], [2, 3, 10], [5]]) == [1, 2, 3, 4, 5, 9, 10], "trois listes"
assert fusionner([[], [1], []]) == [1], "listes vides"
assert fusionner([]) == [], "aucune liste"
import random
rng = random.Random(2)
ls = [sorted(rng.randint(0, 99) for _ in range(rng.randint(0, 20))) for _ in range(15)]
assert fusionner(ls) == sorted(x for l in ls for x in l), "quinze listes aléatoires"
```

:::criteres
- Coûts : tri global $O(N \log N)$ ; fusions successives de gauche à droite jusqu'à $O(kN)$ dans le pire cas (la liste accumulée est relue à chaque fusion).
- Algorithme : un tas de triplets (valeur, numéro de liste, indice) contenant la tête de chaque liste non vide ; on extrait le minimum, on ajoute l'élément suivant de la même liste.
- Code correct (listes vides) ; coût $O(N \log k)$ justifié (N extractions et insertions dans un tas de taille ≤ k).
:::

:::corrige
1. Concaténer puis trier : $O(N \log N)$, sans exploiter le fait que les listes sont triées. Fusionner deux à deux de gauche à droite : la $i$-ème fusion relit tout ce
   qui a déjà été fusionné ; avec des listes de tailles égales $N/k$, le coût total est de l'ordre de $\sum_{i=1}^{k} i\frac{N}{k} = O(kN)$.
2. On garde dans un tas la **tête** de chaque liste (un élément par liste au plus) : le plus petit élément restant est forcément l'une de ces têtes. On extrait le
   minimum, on l'ajoute au résultat, et l'on insère l'élément suivant de la même liste.

```python solution
import heapq

def fusionner(listes):
    tas = [(l[0], i, 0) for i, l in enumerate(listes) if l]
    heapq.heapify(tas)
    resultat = []
    while tas:
        valeur, i, j = heapq.heappop(tas)
        resultat.append(valeur)
        if j + 1 < len(listes[i]):
            heapq.heappush(tas, (listes[i][j + 1], i, j + 1))
    return resultat
```
Le numéro de liste dans le triplet départage les valeurs égales. Chaque élément entre et sort du tas une fois, et le tas contient au plus $k$ éléments : coût
$O(N \log k)$, meilleur que $O(N \log N)$ quand $k$ est petit devant $N$. C'est le principe des **fusions externes** de fichiers triés.
:::
::::
