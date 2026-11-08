---
titre: Programmation dynamique
resume: "Mémoriser les résultats des sous-problèmes pour ne jamais les recalculer."
duree: 45
objectifs:
  - "Utiliser la programmation dynamique pour écrire un algorithme"
  - "Discuter du coût en mémoire"
prerequis: [terminale-langages/recursivite, premiere-algo/gloutons]
---

Quand les mêmes sous-problèmes reviennent plusieurs fois, on garde leurs solutions : c'est la **programmation dynamique**.

## 1. Le problème

```python exec
def fibo(n):
    if n < 2:
        return n
    return fibo(n - 1) + fibo(n - 2)

print(fibo(20))
```

`fibo(n - 1)` et `fibo(n - 2)` recalculent les mêmes valeurs : le nombre d'appels explose.

## 2. Mémoïser

On garde les résultats dans un dictionnaire.

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

## 3. Le rendu de monnaie optimal

nb(s), le nombre minimal de pièces pour rendre s, vérifie : nb(0) = 0 et nb(s) = 1 + le minimum des nb(s − p), pour chaque pièce p ≤ s.

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

Le résultat est optimal, même là où le glouton échoue. En échange, on utilise un **tableau en mémoire**.

## L'essentiel

- Sous-problèmes qui se répètent : on stocke leurs solutions.
- Mémoïsation : récursion + dictionnaire. Ou tableau rempli de bas en haut.
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

1. Avec des pièces de 1, 3 et 4, combien de pièces au minimum pour rendre 6 ?

   - [ ] 1
   - [x] 2
   - [ ] 3
   - [ ] 6

   > 3 + 3. Le glouton en rend 3.

1. Dans le rendu de monnaie dynamique, que vaut nb(0) ?

   - [x] 0
   - [ ] 1
   - [ ] l'infini
   - [ ] la plus petite pièce

   > Rendre 0 ne demande aucune pièce.

1. Combien de chemins (droite ou bas) dans une grille de 2 lignes et 2 colonnes, d'un coin à l'autre ?

   - [ ] 1
   - [x] 2
   - [ ] 3
   - [ ] 4

   > Droite puis bas, ou bas puis droite.

1. Quelle est la différence avec « diviser pour régner » ?

   - [ ] il n'y en a pas
   - [x] en diviser pour régner, les sous-problèmes sont indépendants ; ici ils se répètent
   - [ ] la programmation dynamique n'utilise pas de sous-problèmes
   - [ ] diviser pour régner n'est jamais récursif

   > D'où l'intérêt de stocker les solutions.

1. Que coûte la programmation dynamique en échange du gain de temps ?

   - [ ] de la précision
   - [x] de la mémoire
   - [ ] des résultats faux
   - [ ] rien du tout

   > Il faut stocker les solutions des sous-problèmes.

1. Dans l'approche de bas en haut, dans quel ordre remplit-on le tableau ?

   - [x] des plus petits sous-problèmes aux plus grands
   - [ ] des plus grands aux plus petits
   - [ ] au hasard
   - [ ] l'ordre n'a pas d'importance

   > Chaque case utilise des cases déjà calculées.
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

::::exercice[Compléter]{niveau=2 type=completer}
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

::::exercice[Fibonacci, trois versions]{niveau=1}
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

::::exercice[Glouton ou dynamique ?]{niveau=2}
Explique à un camarade, sur l'exemple du rendu de 6 avec des pièces de 1, 3 et 4, pourquoi l'algorithme glouton se trompe et pourquoi la
programmation dynamique ne peut pas se tromper. Dis aussi ce que coûte la programmation dynamique de plus.

:::criteres
- Glouton : prend 4 (meilleur choix immédiat), puis 1 et 1 : 3 pièces ; il ne revient jamais sur son premier choix.
- Dynamique : pour 6, elle compare tous les premiers choix possibles (1, 3 ou 4) en utilisant les meilleures solutions déjà calculées pour 5, 3
  et 2 ; elle trouve 3 + 3.
- Coût : remplir un tableau de toutes les sommes de 0 à 6, en temps et en mémoire.
:::

:::corrige
Le **glouton** prend la plus grande pièce possible, 4, parce que c'est le meilleur choix **sur le moment** ; il reste 2, qu'il rend avec 1 + 1 :
3 pièces. Il ne revient jamais en arrière, et ne découvre donc pas que commencer par 3 était mieux. La **programmation dynamique** calcule
d'abord la meilleure façon de rendre **chaque** somme plus petite (0, 1, 2, …, 5). Pour 6, elle **essaie tous les premiers choix** : 1 puis le
meilleur rendu de 5 (2 pièces) ; 3 puis le meilleur rendu de 3 (1 pièce) ; 4 puis le meilleur rendu de 2 (2 pièces). Le minimum est 1 + 1 =
**2 pièces** (3 + 3). Elle ne peut pas se tromper car elle envisage tous les cas, mais sans les recalculer. En contrepartie, elle fait plus de
travail que le glouton et utilise un **tableau** de taille 7 (toutes les sommes jusqu'à 6) : pour une grande somme, c'est plus de temps et de
mémoire.
:::
::::
