---
titre: Programmation dynamique
resume: "Mémoriser les résultats des sous-problèmes pour ne jamais les recalculer."
duree: 45
objectifs:
  - "Utiliser la programmation dynamique pour écrire un algorithme"
  - "Discuter du coût en mémoire"
prerequis: [terminale-langages/recursivite, premiere-algo/gloutons]
---

Que vaut 1 + 1 + 1 + 1 + 1 ? Tu comptes : 5. Et si on ajoute + 1 à la fin ? Tu réponds 6 tout de suite, sans tout recompter : tu as **retenu** le résultat précédent. C'est l'idée de la **programmation dynamique** : ne jamais recalculer ce qu'on a déjà calculé.

## 1. Le problème : des calculs répétés

La suite de Fibonacci commence par 0 et 1, puis chaque terme est la somme des deux précédents : 0, 1, 1, 2, 3, 5, 8, 13…

```python exec
def fibo(n):
    if n < 2:
        return n
    return fibo(n - 1) + fibo(n - 2)

print(fibo(20))
```

Ce code est juste, mais très lent. Pour calculer `fibo(5)`, il calcule `fibo(4)` et `fibo(3)`. Mais `fibo(4)` recalcule lui aussi `fibo(3)`, et ainsi de suite. Au total, `fibo(5)` provoque 15 appels, `fibo(20)` en provoque 21 891, et `fibo(30)` plus de 2,6 millions. Le nombre d'appels explose.

## 2. La mémoïsation : retenir les résultats

On garde chaque résultat dans un dictionnaire. Avant de calculer, on regarde s'il est déjà connu.

```python exec
memo = {}

def fibo(n):
    if n in memo:
        return memo[n]
    if n < 2:
        r = n
    else:
        r = fibo(n - 1) + fibo(n - 2)
    memo[n] = r
    return r

print(fibo(80))
```

Chaque valeur n'est calculée **qu'une seule fois** : le calcul devient instantané, même pour `fibo(80)`.

## 3. Calculer de bas en haut

Autre approche : on remplit un tableau en partant des plus petits cas, sans récursivité. Chaque case utilise des cases déjà calculées.

| n | 0 | 1 | 2 | 3 | 4 | 5 | 6 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| fibo(n) | 0 | 1 | 1 | 2 | 3 | 5 | 8 |

## 4. Le rendu de monnaie optimal

En première, le glouton échouait à rendre 6 avec des pièces de 1, 3 et 4 : il rendait 4 + 1 + 1 au lieu de 3 + 3. La programmation dynamique trouve toujours la meilleure solution.

Note nb(s) le nombre minimal de pièces pour rendre s. Pour rendre s, on choisit une première pièce p, puis il reste s − p à rendre de la meilleure façon. Donc :

**nb(s) = 1 + le plus petit des nb(s − p)**, pour chaque pièce p ≤ s, avec nb(0) = 0.

On remplit le tableau de bas en haut :

| s | Calcul | nb(s) |
| --- | --- | --- |
| 0 | rien à rendre | 0 |
| 1 | 1 + nb(0) | 1 |
| 2 | 1 + nb(1) | 2 |
| 3 | 1 + min(nb(2), nb(0)) | 1 |
| 4 | 1 + min(nb(3), nb(1), nb(0)) | 1 |
| 5 | 1 + min(nb(4), nb(2), nb(1)) | 2 |
| 6 | 1 + min(nb(5), nb(3), nb(2)) = 1 + min(2, 1, 2) | 2 |

Pour 6, le meilleur premier choix est la pièce de 3, car il reste 3, qu'on rend en une pièce : **2 pièces**.

```python exec
def rendu(somme, pieces):
    nb = [0] + [float("inf")] * somme
    for s in range(1, somme + 1):
        for p in pieces:
            if p <= s and nb[s - p] + 1 < nb[s]:
                nb[s] = nb[s - p] + 1
    return nb[somme]

print(rendu(6, [1, 3, 4]))
```

`float("inf")` représente l'infini : au départ, aucune solution n'est connue. Le glouton ne regardait qu'un seul choix ; ici, on les compare tous, en réutilisant les résultats déjà calculés.

## 5. Le prix à payer

On gagne énormément de temps, mais on utilise de la **mémoire** : un dictionnaire ou un tableau de toutes les solutions intermédiaires.

Différence avec diviser pour régner : là, les sous-problèmes sont **indépendants**, et ne se répètent pas. Ici, les mêmes sous-problèmes **reviennent** sans cesse : c'est pour cela qu'on les retient.

## L'essentiel

- Quand les mêmes sous-problèmes reviennent, on retient leurs solutions pour ne pas les recalculer.
- Mémoïsation : récursivité et dictionnaire. Ou bien un tableau rempli de bas en haut.
- Rendu de monnaie : nb(s) = 1 + min des nb(s − p) ; la solution est toujours optimale.
- On échange de la mémoire contre du temps.

## Exercices

::::exercice[QCM : programmation dynamique]{niveau=1 type=quiz}
Une question à la fois : la correction s'affiche aussitôt.

1. Quand la programmation dynamique est-elle utile ?

   - [ ] quand les sous-problèmes sont tous différents
   - [x] quand les mêmes sous-problèmes reviennent plusieurs fois
   - [ ] quand le problème n'a pas de solution
   - [ ] seulement pour trier

   > On stocke les solutions pour les réutiliser.

1. Pourquoi la version récursive naïve de Fibonacci est-elle lente ?

   - [ ] à cause des additions
   - [x] elle recalcule les mêmes valeurs un nombre exponentiel de fois
   - [ ] à cause de la limite de récursion
   - [ ] parce que les nombres sont grands

   > fibo(n − 1) et fibo(n − 2) recalculent les mêmes termes.

1. Qu'est-ce que la mémoïsation ?

   - [ ] apprendre par cœur un algorithme
   - [x] garder en mémoire les résultats déjà calculés d'une fonction
   - [ ] supprimer la récursion
   - [ ] trier les données avant de les traiter

   > Souvent avec un dictionnaire.

1. Quel est le coût de Fibonacci avec mémoïsation ?

   - [ ] exponentiel
   - [x] linéaire
   - [ ] quadratique
   - [ ] constant

   > Chaque terme est calculé une fois.

1. Quelle est la différence avec « diviser pour régner » ?

   - [ ] il n'y en a pas
   - [x] en diviser pour régner, les sous-problèmes sont indépendants ; ici ils se répètent
   - [ ] la programmation dynamique n'utilise pas de sous-problèmes
   - [ ] diviser pour régner n'est jamais récursif

   > D'où l'intérêt de stocker les solutions.
::::

::::exercice[Remplir le tableau]{niveau=1 type=completer}
Pièces : 1, 3, 4. Complète le nombre minimal de pièces pour rendre chaque somme.

```python calcul
nb = [0] + [10**9] * 7
for s in range(1, 8):
    for p in [1, 3, 4]:
        if p <= s and nb[s - p] + 1 < nb[s]:
            nb[s] = nb[s - p] + 1
for s in range(1, 8):
    print(nb[s])
```

| Somme | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Pièces | 0 | [[1]] | [[2]] | [[1]] | [[1]] | [[2]] | [[2]] | [[2]] |
::::

::::exercice[Compléter]{niveau=1 type=completer}
Complète la version mémoïsée.

```python trous
memo = {}

def f(n):
    if n [[in]] memo:
        return memo[[[n]]]
    if n < 2:
        r = n
    else:
        r = f([[n - 1]]) + f([[n - 2]])
    memo[n] = [[r]]
    return r
```
::::

::::exercice[Fibonacci, trois versions]{niveau=2}
Écris `fibo_memo(n)` (récursive avec un dictionnaire de mémoïsation) et `fibo_iter(n)` (de bas en haut, avec seulement deux variables). On a
F(0) = 0, F(1) = 1.

```python depart
def fibo_memo(n, memo=None):
    ...

def fibo_iter(n):
    ...
```

```python tests
assert [fibo_memo(n) for n in range(8)] == [0, 1, 1, 2, 3, 5, 8, 13], "premiers termes"
assert fibo_memo(90) == 2880067194370816120, "grand terme (instantané)"
assert [fibo_iter(n) for n in range(8)] == [0, 1, 1, 2, 3, 5, 8, 13], "itératif"
assert fibo_iter(90) == 2880067194370816120, "itératif, grand terme"
```

:::corrige
```python solution
def fibo_memo(n, memo=None):
    if memo is None:
        memo = {}
    if n in memo:
        return memo[n]
    if n < 2:
        resultat = n
    else:
        resultat = fibo_memo(n - 1, memo) + fibo_memo(n - 2, memo)
    memo[n] = resultat
    return resultat

def fibo_iter(n):
    a, b = 0, 1
    for i in range(n):
        a, b = b, a + b
    return a
```

On passe le dictionnaire en paramètre pour qu'il soit partagé par tous les appels récursifs. La version itérative n'a besoin que des deux
derniers termes : mémoire constante.
:::
::::

::::exercice[Rendu de monnaie optimal]{niveau=2}
Écris `rendu_optimal(somme, pieces)` qui renvoie la **liste** des pièces d'un rendu utilisant le moins de pièces possible (dans n'importe quel
ordre). Remplis le tableau `nb` de bas en haut et, pour chaque somme, retiens dans un tableau `choix` la pièce qui donne le minimum ; reconstruis
ensuite la solution.

```python depart
def rendu_optimal(somme, pieces):
    ...
```

```python tests
assert sorted(rendu_optimal(6, [1, 3, 4])) == [3, 3], "là où le glouton échoue"
assert len(rendu_optimal(87, [1, 2, 5, 10, 20, 50])) == 5, "système euro"
assert sum(rendu_optimal(87, [1, 2, 5, 10, 20, 50])) == 87, "la somme est juste"
assert rendu_optimal(0, [1, 2]) == [], "rien à rendre"
assert sorted(rendu_optimal(30, [1, 15, 25])) == [15, 15], "autre système non canonique"
```

:::corrige
```python solution
def rendu_optimal(somme, pieces):
    nb = [0] + [float("inf")] * somme
    choix = [0] * (somme + 1)
    for s in range(1, somme + 1):
        for p in pieces:
            if p <= s and nb[s - p] + 1 < nb[s]:
                nb[s] = nb[s - p] + 1
                choix[s] = p
    rendu = []
    s = somme
    while s > 0:
        rendu.append(choix[s])
        s = s - choix[s]
    return rendu
```

Pour 30 avec des pièces de 1, 15 et 25, le glouton rend 25 + 1 + 1 + 1 + 1 + 1 (6 pièces) ; la programmation dynamique trouve 15 + 15.
:::
::::

::::exercice[Le robot collecteur]{niveau=3}
Un robot part de la case en haut à gauche d'une grille de gains et doit arriver en bas à droite. Il se déplace seulement vers la droite ou vers le bas. Il veut maximiser la somme des gains des cases traversées, départ et arrivée compris.

1. Écris `max_recursif(g, l, c)`, récursive, qui renvoie le gain maximal à partir de la case `(l, c)`.
2. Écris `max_tableau(g)`, qui renvoie le gain maximal du trajet complet, en remplissant un tableau de bas en haut.
3. À l'écrit : pourquoi `max_recursif` devient-elle très lente sur une grande grille ? Quel est le coût de `max_tableau` en temps et en mémoire, pour une grille de n lignes et m colonnes ?

:::indice
Dans le tableau, `m[l][c]` est le gain maximal pour **arriver** à la case `(l, c)` : on vient soit de la case du dessus, soit de celle de gauche.
:::

```python depart
def max_recursif(g, l, c):
    ...

def max_tableau(g):
    ...
```

```python tests
g = [[1, 3, 1], [1, 5, 1], [4, 2, 1]]
assert max_recursif(g, 0, 0) == 12, "1 + 3 + 5 + 2 + 1"
assert max_recursif(g, 2, 2) == 1, "case d'arrivée"
assert max_tableau(g) == 12, "même résultat"
assert max_tableau([[7]]) == 7, "une seule case"
assert max_tableau([[1, 2, 3]]) == 6, "une seule ligne"
grande = [[1] * 60 for i in range(60)]
assert max_tableau(grande) == 119, "grande grille, résultat immédiat"
```

:::corrige
```python solution
def max_recursif(g, l, c):
    if l == len(g) - 1 and c == len(g[0]) - 1:
        return g[l][c]
    if l == len(g) - 1:
        return g[l][c] + max_recursif(g, l, c + 1)
    if c == len(g[0]) - 1:
        return g[l][c] + max_recursif(g, l + 1, c)
    return g[l][c] + max(max_recursif(g, l + 1, c), max_recursif(g, l, c + 1))

def max_tableau(g):
    n, p = len(g), len(g[0])
    m = [[0] * p for i in range(n)]
    for l in range(n):
        for c in range(p):
            if l == 0 and c == 0:
                m[l][c] = g[l][c]
            elif l == 0:
                m[l][c] = m[l][c - 1] + g[l][c]
            elif c == 0:
                m[l][c] = m[l - 1][c] + g[l][c]
            else:
                m[l][c] = max(m[l - 1][c], m[l][c - 1]) + g[l][c]
    return m[n - 1][p - 1]
```

**Question 3.** La version récursive recalcule les mêmes cases un très grand nombre de fois : le nombre d'appels explose. `max_tableau` calcule chaque case une seule fois : son coût en temps est proportionnel à n × m, et elle utilise un tableau de n × m cases.
:::
::::
