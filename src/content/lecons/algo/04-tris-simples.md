---
titre: Tris par sélection et par insertion
resume: Trier une liste en place avec deux algorithmes simples, les prouver par un invariant, compter leurs comparaisons et étudier leur stabilité.
duree: 80
objectifs:
  - Écrire le tri par sélection et le tri par insertion, en place
  - Énoncer et démontrer l'invariant de chacun
  - Compter les comparaisons au meilleur et au pire cas, et reconnaître les entrées correspondantes
  - Définir et vérifier la stabilité d'un tri
prerequis: [algo/preuve, algo/recherche]
programme: [asd-recherche-tris, asd-preuve, asd-cout, nsi1-algo]
cartes:
  - q: Principe du tri par sélection ?
    r: "Pour chaque position `i`, chercher le minimum de `t[i..n-1]` et l'échanger avec `t[i]`."
  - q: Principe du tri par insertion ?
    r: "Pour chaque `i`, insérer `t[i]` à sa place dans la partie `t[0..i-1]` déjà triée, en décalant vers la droite les éléments plus grands."
  - q: Invariant du tri par sélection (au début du tour `i`) ?
    r: "`t[0..i-1]` est trié et contient les `i` plus petits éléments de la liste (à leur place définitive)."
  - q: Invariant du tri par insertion (au début du tour `i`) ?
    r: "`t[0..i-1]` est trié et contient les mêmes éléments qu'au départ dans `t[0..i-1]`."
  - q: Nombre de comparaisons du tri par sélection ?
    r: "Toujours $\\frac{n(n-1)}{2}$ : $\\Theta(n^2)$ au meilleur comme au pire."
  - q: Comparaisons du tri par insertion au meilleur et au pire ?
    r: "Meilleur cas (liste déjà triée) : $n - 1$. Pire cas (ordre inverse) : $\\frac{n(n-1)}{2}$."
  - q: Qu'est-ce qu'un tri stable ?
    r: "Un tri qui conserve l'ordre relatif des éléments de clés égales."
  - q: Le tri par sélection est-il stable ? Le tri par insertion ?
    r: "Sélection (avec échange) : non. Insertion (décalage avec comparaison stricte) : oui."
---

Trier, c'est ranger des données dans l'ordre : par note, par nom, par date. C'est l'une des opérations les plus
fréquentes en informatique, et un terrain d'entraînement idéal pour tout ce qu'on vient d'apprendre : écrire un
algorithme sur un tableau, le prouver avec un invariant, compter ses opérations. Le programme de première demande
de connaître deux tris simples, **par sélection** et **par insertion** ; le sujet zéro de l'oral 1 demande de les
comparer à des tris plus rapides. On travaille **en place** : on modifie la liste elle-même par échanges ou décalages.

## 1. Le tri par sélection

**Idée.** On cherche le plus petit élément et on le met en première position ; puis le plus petit des éléments
restants, en deuxième position ; etc. À l'étape `i`, la partie gauche `t[0..i-1]` est triée et définitive.

```python exec
def tri_selection(t):
    n = len(t)
    for i in range(n - 1):
        imin = i
        for j in range(i + 1, n):
            if t[j] < t[imin]:
                imin = j
        t[i], t[imin] = t[imin], t[i]

t = [29, 10, 14, 37, 13]
tri_selection(t)
print(t)
```

| étape `i` | liste au début de l'étape | minimum de `t[i..]` | après l'échange      |
|-----------|---------------------------|---------------------|----------------------|
| 0         | `[29, 10, 14, 37, 13]`    | 10 (indice 1)       | `[10, 29, 14, 37, 13]` |
| 1         | `[10, 29, 14, 37, 13]`    | 13 (indice 4)       | `[10, 13, 14, 37, 29]` |
| 2         | `[10, 13, 14, 37, 29]`    | 14 (indice 2)       | inchangée            |
| 3         | `[10, 13, 14, 37, 29]`    | 29 (indice 4)       | `[10, 13, 14, 29, 37]` |

```mermaid legende="Tri par sélection : une zone triée et définitive à gauche, qui grandit d'une case par étape"
graph LR
  A["t[0..i-1]<br/>triée, définitive<br/>(les i plus petits)"] --- B["t[i..n-1]<br/>non triée<br/>(tous ≥ ceux de gauche)"]
```

**Invariant** (au début de l'étape `i`) : `t[0..i-1]` est trié, et tout élément de `t[0..i-1]` est inférieur ou égal
à tout élément de `t[i..n-1]`.
- *Initialisation* : pour `i = 0`, la zone de gauche est vide.
- *Conservation* : l'étape place en position `i` le minimum de `t[i..n-1]` ; il est supérieur ou égal aux éléments
  de gauche (invariant) et inférieur ou égal aux éléments restants : `t[0..i]` est trié et tous ses éléments sont
  `<=` ceux de `t[i+1..n-1]`.
- *Conclusion* : après l'étape `n - 2`, `t[0..n-2]` est trié et ses éléments sont `<=` `t[n-1]` : toute la liste est triée.

**Coût.** À l'étape `i`, la recherche du minimum fait `n - 1 - i` comparaisons, **quelles que soient les valeurs** :

$$ \sum_{i=0}^{n-2} (n - 1 - i) = (n-1) + (n-2) + \dots + 1 = \frac{n(n-1)}{2} $$

Meilleur cas = pire cas = $\frac{n(n-1)}{2}$ : $\Theta(n^2)$. En revanche, il fait au plus $n - 1$ échanges, ce qui
est intéressant si déplacer un élément coûte cher.

## 2. Le tri par insertion

**Idée.** C'est la façon de trier des cartes à jouer en main : on prend les cartes une à une et on insère chacune à sa
place parmi celles déjà triées. Pour insérer `t[i]`, on décale d'une case vers la droite les éléments plus grands que
lui, puis on le pose dans le trou.

```python exec
def tri_insertion(t):
    for i in range(1, len(t)):
        x = t[i]
        j = i
        while j > 0 and t[j - 1] > x:
            t[j] = t[j - 1]      # décalage vers la droite
            j -= 1
        t[j] = x

t = [29, 10, 14, 37, 13]
tri_insertion(t)
print(t)
```

| étape `i` | élément inséré | liste après l'insertion |
|-----------|----------------|-------------------------|
| 1         | 10             | `[10, 29, 14, 37, 13]`  |
| 2         | 14             | `[10, 14, 29, 37, 13]`  |
| 3         | 37             | `[10, 14, 29, 37, 13]` (aucun décalage) |
| 4         | 13             | `[10, 13, 14, 29, 37]`  |

**Invariant** (au début de l'étape `i`) : `t[0..i-1]` contient les mêmes éléments qu'au départ dans ces positions, mais
**triés**. (Contrairement à la sélection, ce ne sont pas encore les plus petits de toute la liste.)
- La boucle interne a elle-même un invariant : les éléments `t[j+1..i]` sont ceux de `t[j..i-1]` décalés, tous `> x`.
- À la fin de l'étape, `x` est posé après les éléments `<= x` et avant ceux `> x` : `t[0..i]` est trié.
- Après la dernière étape (`i = n - 1`), toute la liste est triée.

**Coût** (comparaisons `t[j - 1] > x`).
- **Meilleur cas** : liste déjà triée. Chaque insertion s'arrête dès la première comparaison : $n - 1$ comparaisons,
  $\Theta(n)$.
- **Pire cas** : liste triée dans l'ordre **inverse**. Chaque `x` doit remonter jusqu'au début : `i` comparaisons à
  l'étape `i`, soit $1 + 2 + \dots + (n-1) = \frac{n(n-1)}{2}$ : $\Theta(n^2)$.
- Plus précisément, le nombre de décalages est égal au nombre d'**inversions** de la liste (couples `i < j` avec
  `t[i] > t[j]`) : le tri par insertion est très rapide sur une liste **presque triée**.

## 3. La stabilité

:::definition
Un tri est **stable** s'il conserve l'ordre relatif des éléments **de même clé**. Si Inès et Léa ont toutes deux 15
et qu'Inès est avant Léa dans la liste de départ, un tri stable par note laisse Inès avant Léa.
:::

C'est important quand on trie selon plusieurs critères : trier par prénom, puis (stablement) par note, donne une liste
par note où les ex aequo restent par ordre alphabétique.

```python exec
def tri_insertion_cle(t, cle):
    for i in range(1, len(t)):
        x = t[i]
        j = i
        while j > 0 and cle(t[j - 1]) > cle(x):   # > strict : on ne dépasse pas un égal
            t[j] = t[j - 1]
            j -= 1
        t[j] = x

def tri_selection_cle(t, cle):
    n = len(t)
    for i in range(n - 1):
        imin = i
        for j in range(i + 1, n):
            if cle(t[j]) < cle(t[imin]):
                imin = j
        t[i], t[imin] = t[imin], t[i]

eleves = [("Inès", 15), ("Hugo", 12), ("Léa", 15), ("Adam", 9)]
a, b = eleves.copy(), eleves.copy()
tri_insertion_cle(a, lambda e: e[1])
tri_selection_cle(b, lambda e: e[1])
print("insertion :", a)
print("sélection :", b)
```

Le tri par insertion est **stable** (la comparaison stricte `>` empêche un élément de passer devant un égal).
Le tri par sélection **ne l'est pas** : l'échange à longue distance peut faire passer un élément devant un égal — ici,
à l'étape 0, Inès est échangée avec Adam et se retrouve derrière Léa.

:::retenir
Pour un tri en place qui échange des éléments éloignés (sélection, tri rapide), la stabilité est en général perdue.
`sorted` et `list.sort` de Python sont stables.
:::

## 4. Le tri à bulles (pour mémoire)

On parcourt la liste en échangeant deux voisins mal ordonnés ; après le premier passage, le maximum est à la fin.
On recommence sur la partie restante. Il est stable et en $\Theta(n^2)$ au pire ; avec un drapeau « aucun échange
pendant ce passage », il s'arrête après un passage sur une liste triée. Il est rarement utilisé en pratique, mais
apparaît dans les manuels et les sujets.

:::prof
Le programme de première NSI demande d'écrire ces deux tris, de les prouver « à l'aide d'un invariant » et de
connaître leur coût quadratique. L'activité débranchée avec des cartes (ou des élèves de tailles différentes) fait
découvrir les deux stratégies. Les élèves confondent souvent les invariants : pour la sélection, la partie gauche
est **définitive** ; pour l'insertion, elle est seulement **triée**. Mesurer les temps pour des tailles qui doublent
(× 4) est très convaincant.
:::

## Exemple guidé

**Problème (type écrit 1).** On applique le tri par insertion du cours à la liste `[5, 2, 4, 6, 1, 3]`.
1. Donner l'état de la liste à la fin de chaque étape. 2. Compter les comparaisons `t[j - 1] > x` effectuées.
3. Relier ce nombre au nombre d'inversions.

**1. États successifs.**

| `i` | `x` | décalages        | liste à la fin de l'étape |
|-----|-----|------------------|---------------------------|
| 1   | 2   | 5                | `[2, 5, 4, 6, 1, 3]`      |
| 2   | 4   | 5                | `[2, 4, 5, 6, 1, 3]`      |
| 3   | 6   | aucun            | `[2, 4, 5, 6, 1, 3]`      |
| 4   | 1   | 6, 5, 4, 2       | `[1, 2, 4, 5, 6, 3]`      |
| 5   | 3   | 6, 5, 4          | `[1, 2, 3, 4, 5, 6]`      |

**2. Comparaisons.** À chaque étape, on fait une comparaison par décalage, plus une comparaison qui échoue — sauf si
`x` arrive au début (`j == 0`), auquel cas la condition `j > 0` arrête la boucle sans comparer les valeurs.
Étape 1 : 1 décalage, `x` arrive au début → 1 comparaison. Étape 2 : 1 + 1 = 2. Étape 3 : 0 + 1 = 1.
Étape 4 : 4 décalages, `x` arrive au début → 4. Étape 5 : 3 + 1 = 4. Total : **12** comparaisons.

```python exec
def tri_insertion_compte(t):
    comparaisons = decalages = 0
    for i in range(1, len(t)):
        x, j = t[i], i
        while j > 0:
            comparaisons += 1
            if t[j - 1] > x:
                t[j] = t[j - 1]
                decalages += 1
                j -= 1
            else:
                break
        t[j] = x
    return comparaisons, decalages

print(tri_insertion_compte([5, 2, 4, 6, 1, 3]))
```

**3. Inversions.** Les couples mal ordonnés de `[5, 2, 4, 6, 1, 3]` sont (5,2), (5,4), (5,1), (5,3), (2,1), (4,1),
(4,3), (6,1), (6,3) : **9 inversions**, exactement le nombre de décalages (chaque décalage corrige une inversion, et
une seule). Le nombre de comparaisons est compris entre (inversions) et (inversions + n − 1).

## L'essentiel

- **Sélection** : à l'étape `i`, on échange `t[i]` avec le minimum de `t[i..n-1]`. Invariant : `t[0..i-1]` trié et
  **définitif**. Toujours $\frac{n(n-1)}{2}$ comparaisons, au plus $n - 1$ échanges. Non stable.
- **Insertion** : à l'étape `i`, on insère `t[i]` dans `t[0..i-1]` trié, par décalages. Invariant : `t[0..i-1]` trié
  (mêmes éléments qu'au départ). $n - 1$ comparaisons au mieux (déjà trié), $\frac{n(n-1)}{2}$ au pire (ordre inverse).
  Stable. Très bon sur les listes presque triées (décalages = inversions).
- Les deux sont **en place** (mémoire constante) et en $\Theta(n^2)$ au pire.
- Stable = conserve l'ordre des éléments de même clé.

## Exercices

::::exercice[État après une étape]{niveau=1}
On applique le tri par sélection du cours à `[4, 1, 3, 2]`. Quelle est la liste à la fin de l'étape `i = 1` ?

- [ ] `[1, 4, 3, 2]`
- [x] `[1, 2, 3, 4]`
- [ ] `[1, 3, 4, 2]`
- [ ] `[1, 2, 4, 3]`

:::corrige
Étape 0 : le minimum 1 est échangé avec 4 → `[1, 4, 3, 2]`. Étape 1 : le minimum de `[4, 3, 2]` est 2 (indice 3),
échangé avec `t[1] = 4` → `[1, 2, 3, 4]`.
:::
::::

::::exercice[Meilleur cas]{niveau=1}
Pour quelles listes de taille `n` le tri par insertion fait-il le **moins** de comparaisons ?

- [x] les listes déjà triées par ordre croissant
- [ ] les listes triées par ordre décroissant
- [ ] toutes les listes : le nombre de comparaisons ne dépend que de `n`
- [ ] les listes dont tous les éléments sont distincts

:::corrige
Sur une liste triée, chaque insertion s'arrête dès la première comparaison : $n - 1$ comparaisons. C'est le tri par
**sélection** dont le nombre de comparaisons ne dépend que de `n`.
:::
::::

::::exercice[Stabilité]{niveau=1}
Lesquels de ces tris sont stables (dans leur version du cours) ?

- [x] le tri par insertion
- [ ] le tri par sélection
- [x] la fonction `sorted` de Python
- [x] le tri à bulles (échange de voisins seulement si strictement mal ordonnés)

:::corrige
Insertion et bulles ne font passer un élément devant un autre que s'il est **strictement** plus petit : les égaux
gardent leur ordre. La sélection échange des éléments éloignés et peut inverser deux égaux. `sorted` (algorithme
Timsort) est stable, c'est garanti par la documentation.
:::
::::

::::exercice[Écrire le tri par sélection]{niveau=2}
Écris `tri_selection(t)` qui trie la liste `t` en place par ordre croissant (sans `sort` ni `sorted`) et ne renvoie rien.

```python depart
def tri_selection(t):
    ...
```

```python tests
a = [29, 10, 14, 37, 13]
tri_selection(a)
assert a == [10, 13, 14, 29, 37], "cas courant"
b = []
tri_selection(b)
assert b == [], "liste vide"
c = [3, 1, 2, 1, 3]
tri_selection(c)
assert c == [1, 1, 2, 3, 3], "doublons"
d = list(range(20, 0, -1))
tri_selection(d)
assert d == list(range(1, 21)), "ordre inverse"
assert tri_selection([2, 1]) is None, "ne renvoie rien"
```

:::corrige
```python solution
def tri_selection(t):
    n = len(t)
    for i in range(n - 1):
        imin = i
        for j in range(i + 1, n):
            if t[j] < t[imin]:
                imin = j
        t[i], t[imin] = t[imin], t[i]
```
La boucle externe s'arrête à `n - 2` : quand il ne reste qu'un élément, il est forcément à sa place.
:::
::::

::::exercice[Écrire le tri par insertion]{niveau=2}
Écris `tri_insertion(t)` qui trie `t` en place par décalages (pas d'échanges successifs) et ne renvoie rien.

```python depart
def tri_insertion(t):
    ...
```

```python tests
a = [5, 2, 4, 6, 1, 3]
tri_insertion(a)
assert a == [1, 2, 3, 4, 5, 6], "cas courant"
b = [1]
tri_insertion(b)
assert b == [1], "un élément"
c = [2, 2, 1, 1]
tri_insertion(c)
assert c == [1, 1, 2, 2], "doublons"
d = [-3, 10, -7, 0]
tri_insertion(d)
assert d == [-7, -3, 0, 10], "négatifs"
```

:::corrige
```python solution
def tri_insertion(t):
    for i in range(1, len(t)):
        x = t[i]
        j = i
        while j > 0 and t[j - 1] > x:
            t[j] = t[j - 1]
            j -= 1
        t[j] = x
```
L'ordre des conditions `j > 0 and t[j - 1] > x` compte : grâce à l'évaluation paresseuse, `t[j - 1]` n'est pas lu
quand `j == 0` (sinon `t[-1]`, le dernier élément, serait comparé par erreur).
:::
::::

::::exercice[Compter les inversions]{niveau=3}
Une **inversion** d'une liste `t` est un couple d'indices `(i, j)` avec `i < j` et `t[i] > t[j]`. Écris
`nb_inversions(t)` (une double boucle suffit). Vérifie ensuite sur quelques exemples que ce nombre est égal au nombre
de décalages du tri par insertion.

```python depart
def nb_inversions(t):
    ...
```

```python tests
assert nb_inversions([5, 2, 4, 6, 1, 3]) == 9, "exemple du cours"
assert nb_inversions([1, 2, 3]) == 0, "triée"
assert nb_inversions([3, 2, 1]) == 3, "ordre inverse (n = 3)"
assert nb_inversions(list(range(10, 0, -1))) == 45, "ordre inverse : n(n-1)/2"
assert nb_inversions([2, 2]) == 0, "égaux : pas d'inversion"
```

:::corrige
```python solution
def nb_inversions(t):
    c = 0
    for i in range(len(t)):
        for j in range(i + 1, len(t)):
            if t[i] > t[j]:
                c += 1
    return c
```
Une liste en ordre inverse a toutes ses paires inversées : $\binom{n}{2} = \frac{n(n-1)}{2}$ inversions, d'où le pire
cas du tri par insertion. On peut compter les inversions en $\Theta(n \log n)$ en adaptant le tri fusion.
:::
::::

::::exercice[Tri à bulles avec arrêt anticipé]{niveau=3}
Écris `tri_bulles(t)` qui trie `t` en place par échanges de voisins, en s'arrêtant dès qu'un passage complet n'a fait
aucun échange. La fonction renvoie le **nombre de passages** effectués.

```python depart
def tri_bulles(t):
    ...
```

```python tests
a = [5, 1, 4, 2, 8]
p = tri_bulles(a)
assert a == [1, 2, 4, 5, 8], "liste triée"
assert p == 3, "3 passages (le dernier sans échange)"
b = [1, 2, 3, 4]
assert tri_bulles(b) == 1, "déjà triée : un seul passage"
c = [4, 3, 2, 1]
tri_bulles(c)
assert c == [1, 2, 3, 4], "ordre inverse"
assert tri_bulles([]) == 0, "liste vide : aucun passage"
```

:::corrige
```python solution
def tri_bulles(t):
    passages = 0
    fin = len(t) - 1
    echange = True
    while echange and fin > 0:
        echange = False
        passages += 1
        for j in range(fin):
            if t[j] > t[j + 1]:
                t[j], t[j + 1] = t[j + 1], t[j]
                echange = True
        fin -= 1
    return passages
```
Après chaque passage, le plus grand élément de la zone est « remonté » à la fin : on peut réduire la zone (`fin -= 1`).
Sur `[5, 1, 4, 2, 8]` : passage 1 → `[1, 4, 2, 5, 8]`, passage 2 → `[1, 2, 4, 5, 8]`, passage 3 sans échange.
:::
::::

::::exercice[Analyse complète du tri par sélection]{niveau=4 duree=25}
On considère le tri par sélection du cours.

1. Énonce un invariant de la boucle externe et démontre-le (initialisation, conservation, conclusion).
2. Donne le nombre **exact** de comparaisons `t[j] < t[imin]` et le nombre maximal d'échanges, pour une liste de
   taille `n`. Y a-t-il un meilleur et un pire cas ?
3. Montre sur un exemple de 3 éléments que ce tri n'est pas stable. Peut-on le rendre stable en gardant un coût en
   $\Theta(n^2)$ ? Explique comment.
4. Une liste de 100 000 éléments est triée en 400 secondes par ce tri. Estime le temps pour 20 000 éléments, et
   explique pourquoi un tri en $\Theta(n \log n)$ serait préférable.

:::criteres
- Invariant : au début de l'étape `i`, `t[0..i-1]` est trié et tout élément de `t[0..i-1]` est `<=` tout élément de `t[i..n-1]` (et la liste est une permutation de la liste initiale).
- Conservation justifiée par le choix du minimum de `t[i..n-1]` ; conclusion à `i = n - 1`.
- Comparaisons : $\sum_{i=0}^{n-2}(n-1-i) = \frac{n(n-1)}{2}$, quelle que soit l'entrée : pas de meilleur ni de pire cas pour les comparaisons ; au plus $n - 1$ échanges.
- Contre-exemple de stabilité correct, par exemple `[(2, a), (2, b), (1, c)]` triés par la première composante, qui donne `(1, c), (2, b), (2, a)`.
- Version stable : au lieu d'échanger, extraire le minimum et décaler la zone `t[i..imin-1]` d'une case (rotation) ; coût toujours $\Theta(n^2)$.
- Estimation : $n$ divisé par 5 donc temps divisé par 25, environ 16 s ; un tri $n \log n$ ferait environ $1{,}7 \times 10^6$ comparaisons au lieu de $5 \times 10^9$ pour $n = 10^5$.
:::

:::corrige
1. **Invariant** $\mathcal I_i$ (au début de l'étape `i`) : la liste est une permutation de la liste initiale,
   `t[0..i-1]` est trié, et tout élément de `t[0..i-1]` est inférieur ou égal à tout élément de `t[i..n-1]`.
   *Initialisation* : `i = 0`, la zone de gauche est vide. *Conservation* : l'étape trouve l'indice `imin` du minimum
   de `t[i..n-1]` puis échange (ce qui garde une permutation). Le nouvel élément `t[i]` est `>=` tous ceux de
   `t[0..i-1]` (par l'invariant) et `<=` tous ceux de `t[i+1..n-1]` (c'est un minimum) : $\mathcal I_{i+1}$ est vrai.
   *Conclusion* : à la fin (après l'étape `n - 2`), $\mathcal I_{n-1}$ : `t[0..n-2]` trié et `<=` `t[n-1]`, donc toute
   la liste est triée.
2. Étape `i` : `n - 1 - i` comparaisons, quel que soit le contenu. Total
   $\sum_{i=0}^{n-2} (n - 1 - i) = \frac{n(n-1)}{2}$, identique pour toutes les entrées de taille `n` : pas de meilleur
   ni de pire cas pour les comparaisons. Une étape fait au plus un échange : au plus $n - 1$ échanges.
3. Avec `[(2, "a"), (2, "b"), (1, "c")]` trié selon le premier nombre : à l'étape 0, le minimum `(1, "c")` est échangé
   avec `(2, "a")`, ce qui donne `[(1, "c"), (2, "b"), (2, "a")]` ; l'étape 1 ne change rien. `(2, "a")` et `(2, "b")`
   ont été inversés : le tri n'est pas stable. Pour le rendre stable, au lieu d'**échanger**, on **extrait** le minimum
   (le premier minimum, avec `<` strict) et on décale d'une case vers la droite les éléments `t[i..imin-1]`, puis on
   place le minimum en `i`. Les éléments restants gardent leur ordre relatif. Les décalages coûtent au plus `n` par
   étape : le coût reste en $\Theta(n^2)$.
4. Le coût est quadratique : diviser `n` par 5 divise le temps par $5^2 = 25$, soit environ $400 / 25 = 16$ s. Pour
   $n = 10^5$, le tri par sélection fait $\frac{n(n-1)}{2} \approx 5 \times 10^9$ comparaisons ; un tri en
   $\Theta(n \log n)$ (tri fusion) en fait de l'ordre de $n \log_2 n \approx 1{,}7 \times 10^6$, soit environ 3 000
   fois moins.
:::
::::
