---
titre: Programmation dynamique
resume: "Le cours de terminale NSI sur la programmation dynamique : sous-problèmes qui se chevauchent, explosion de la récursion naïve (Fibonacci), mémoïsation avec un dictionnaire, calcul de bas en haut avec un tableau, rendu de monnaie optimal là où le glouton échoue, chemins dans une grille, coût en temps et en mémoire."
duree: 60
objectifs:
  - "Repérer des sous-problèmes qui se chevauchent dans une récursion"
  - "Mémoïser une fonction récursive avec un dictionnaire"
  - "Écrire un algorithme de programmation dynamique de bas en haut avec un tableau"
  - "Résoudre le rendu de monnaie de façon optimale"
prerequis: [nsi-terminale/recursivite, nsi-premiere/gloutons, nsi-premiere/dictionnaires]
programme: [nsit-algo]
cartes:
  - q: "Quand utiliser la programmation dynamique ?"
    r: "Quand un problème se décompose en **sous-problèmes qui se chevauchent** (les mêmes reviennent plusieurs fois) et que la solution optimale se construit à partir des solutions optimales des sous-problèmes."
  - q: "Qu'est-ce que la mémoïsation ?"
    r: "Garder en mémoire (dans un **dictionnaire**) les résultats déjà calculés d'une fonction récursive, pour ne **jamais recalculer** deux fois le même sous-problème."
  - q: "Approche de bas en haut ?"
    r: "Remplir un **tableau** des solutions des sous-problèmes, des plus petits aux plus grands, sans récursion."
  - q: "Pourquoi fibo naïf est-il si lent ?"
    r: "fibo(n) appelle fibo(n − 1) et fibo(n − 2), qui recalculent les mêmes valeurs : le nombre d'appels croît **exponentiellement** (plus d'un milliard pour n = 45)."
  - q: "Rendu de monnaie en programmation dynamique ?"
    r: "nb(s) = 1 + min(nb(s − p)) pour chaque pièce p ≤ s, avec nb(0) = 0 ; on remplit nb(0), nb(1), …, nb(somme). Toujours optimal, même là où le glouton échoue."
  - q: "Différence avec diviser pour régner ?"
    r: "Diviser pour régner : sous-problèmes **indépendants**. Programmation dynamique : sous-problèmes qui **se répètent**, d'où l'intérêt de stocker leurs solutions."
---

Certains problèmes récursifs cachent un piège : la même question est posée des milliers de fois. La **programmation dynamique** consiste à
**retenir** les réponses déjà trouvées pour ne jamais refaire deux fois le même calcul. On échange un peu de **mémoire** contre un gain de temps
énorme. Elle permet aussi de résoudre **exactement** des problèmes d'optimisation où les algorithmes gloutons échouent.

## Ce que dit le programme

Contenus : *programmation dynamique*. Capacités attendues : **utiliser la programmation dynamique pour écrire un algorithme**. Le programme précise
que les exemples de l'**alignement de séquences** ou du **rendu de monnaie** peuvent être présentés, et que la discussion sur le **coût en
mémoire** peut être développée.

## 1. Le problème : Fibonacci

La suite de Fibonacci : F(0) = 0, F(1) = 1, F(n) = F(n − 1) + F(n − 2). La version récursive est immédiate :

```python exec
appels = 0

def fibo(n):
    global appels
    appels = appels + 1
    if n < 2:
        return n
    return fibo(n - 1) + fibo(n - 2)

print(fibo(25), "en", appels, "appels")
```

Plus de 240 000 appels pour F(25) ! fibo(5) appelle fibo(4) et fibo(3) ; mais fibo(4) appelle **aussi** fibo(3) : les **sous-problèmes se
chevauchent**, et la même valeur est recalculée un nombre exponentiel de fois. Pour F(50), il faudrait des dizaines de milliards d'appels.

## 2. Première solution : la mémoïsation

On garde dans un **dictionnaire** les valeurs déjà calculées. Avant de calculer, on regarde si la réponse est connue.

```python exec
memo = {}

def fibo_memo(n):
    if n in memo:
        return memo[n]
    if n < 2:
        resultat = n
    else:
        resultat = fibo_memo(n - 1) + fibo_memo(n - 2)
    memo[n] = resultat
    return resultat

print(fibo_memo(100))
```

Chaque valeur de 0 à n n'est calculée qu'**une fois** : le coût devient **linéaire**. C'est l'approche **de haut en bas** : on garde la
récursion, en ajoutant une mémoire.

## 3. Deuxième solution : de bas en haut

On calcule les sous-problèmes **dans l'ordre**, du plus petit au plus grand, en remplissant un **tableau** :

```python exec
def fibo_tableau(n):
    f = [0] * (n + 1)
    if n >= 1:
        f[1] = 1
    for i in range(2, n + 1):
        f[i] = f[i - 1] + f[i - 2]
    return f[n]

print(fibo_tableau(100))
```

Pas de récursion, donc pas de limite de pile. Et ici, comme on n'utilise que les deux dernières valeurs, on peut même se contenter de **deux
variables** : le coût en mémoire devient constant.

## 4. Le rendu de monnaie optimal

Avec des pièces de 1, 3 et 4, le glouton rend 6 = 4 + 1 + 1 (3 pièces) au lieu de 3 + 3 (2 pièces). La programmation dynamique trouve
**toujours** l'optimum.

Notons nb(s) le nombre minimal de pièces pour rendre s. Pour rendre s, on commence par **une** pièce p (n'importe laquelle, si p ≤ s), puis on
rend s − p de façon optimale :

$$nb(0) = 0 \qquad nb(s) = 1 + \min_{p \le s} nb(s - p)$$

On remplit le tableau nb(0), nb(1), …, nb(somme) :

```python exec
def rendu_optimal(somme, pieces):
    nb = [0] + [float("inf")] * somme
    for s in range(1, somme + 1):
        for p in pieces:
            if p <= s and nb[s - p] + 1 < nb[s]:
                nb[s] = nb[s - p] + 1
    return nb[somme]

print(rendu_optimal(6, [1, 3, 4]), rendu_optimal(87, [1, 2, 5, 10, 20, 50]))
```

| s | 0 | 1 | 2 | 3 | 4 | 5 | 6 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| nb(s) | 0 | 1 | 2 | 1 | 1 | 2 | 2 |

nb(6) = 1 + min(nb(5), nb(3), nb(2)) = 1 + min(2, 1, 2) = 2 : on commence par une pièce de 3, puis nb(3) = 1. Le coût est de l'ordre de
**somme × nombre de pièces**. Pour retrouver **quelles** pièces, on retient pour chaque s la pièce qui a donné le minimum.

## 5. Un problème de grille

Combien de chemins pour aller du coin en haut à gauche au coin en bas à droite d'une grille, en ne faisant que des pas vers la **droite** ou vers
le **bas** ? Pour arriver dans une case, on vient de celle du dessus ou de celle de gauche :

chemins(i, j) = chemins(i − 1, j) + chemins(i, j − 1), avec 1 chemin pour toute case de la première ligne ou de la première colonne.

```python exec
def nb_chemins(lignes, colonnes):
    c = [[1] * colonnes for i in range(lignes)]
    for i in range(1, lignes):
        for j in range(1, colonnes):
            c[i][j] = c[i - 1][j] + c[i][j - 1]
    return c[lignes - 1][colonnes - 1]

print(nb_chemins(3, 3), nb_chemins(10, 10))
```

Le même schéma, un tableau à deux dimensions rempli case par case, sert pour l'**alignement de séquences** (comparer deux brins d'ADN, ou deux
versions d'un texte comme le fait un correcteur ou un outil de comparaison de fichiers).

## 6. La démarche

1. **Exprimer** la solution du problème à partir des solutions de **sous-problèmes** plus petits (une relation de récurrence).
2. **Repérer** que ces sous-problèmes se **répètent**.
3. **Stocker** leurs solutions : mémoïsation (dictionnaire, de haut en bas) ou tableau (de bas en haut).
4. Si besoin, **reconstruire** la solution elle-même (pas seulement sa valeur) en retenant les choix faits.

## Les erreurs classiques des élèves

:::attention[Ce que tu verras en classe]
- **Mémoïser sans consulter la mémoire** avant de calculer.
- **Mauvaise initialisation** du tableau (cas de base oubliés, 0 au lieu de l'infini pour un minimum).
- **Remplir le tableau dans le mauvais ordre** : utiliser une case pas encore calculée.
- **Confondre avec le glouton** : la programmation dynamique envisage **tous** les premiers choix.
- **Oublier le coût en mémoire** (un tableau de taille somme, ou lignes × colonnes).
:::

## En classe

:::methode[Activités qui marchent]
1. **Compter les appels** de fibo naïf pour n = 10, 20, 30, puis avec mémoïsation.
2. **Dessiner l'arbre des appels** de fibo(5) et entourer les calculs répétés.
3. **Rendu de monnaie** : remplir le tableau à la main au tableau, comparer au glouton.
4. **Pyramide de nombres** : trouver le chemin de somme maximale du sommet à la base (comparaison glouton, force brute, dynamique).
:::

## L'essentiel

- **Programmation dynamique** : sous-problèmes **qui se chevauchent** ; on **stocke** leurs solutions pour ne pas les recalculer.
- **Mémoïsation** (de haut en bas) : récursion + dictionnaire. **De bas en haut** : tableau rempli des petits aux grands sous-problèmes.
- Fibonacci : d'exponentiel à **linéaire**.
- **Rendu de monnaie** : nb(s) = 1 + min nb(s − p), optimal pour tout système de pièces (contrairement au glouton).
- On échange de la **mémoire** contre du **temps**.

## Exercices

::::exercice[Grand QCM : programmation dynamique]{niveau=1 type=quiz}
Dix questions sur la programmation dynamique.

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

::::exercice[Chemins dans une grille avec obstacles]{niveau=2}
Une grille est un tableau de tableaux : 0 pour une case libre, 1 pour un obstacle. Écris `nb_chemins(grille)` qui renvoie le nombre de chemins
du coin en haut à gauche au coin en bas à droite, en ne se déplaçant que vers la droite ou vers le bas, sans passer par un obstacle.

```python depart
def nb_chemins(grille):
    ...
```

```python tests
assert nb_chemins([[0, 0, 0], [0, 0, 0], [0, 0, 0]]) == 6, "grille 3x3 libre"
assert nb_chemins([[0, 0, 0], [0, 1, 0], [0, 0, 0]]) == 2, "obstacle au centre"
assert nb_chemins([[0, 1], [1, 0]]) == 0, "bloqué"
assert nb_chemins([[0]]) == 1, "une seule case"
```

:::corrige
```python solution
def nb_chemins(grille):
    n = len(grille)
    p = len(grille[0])
    c = [[0] * p for i in range(n)]
    for i in range(n):
        for j in range(p):
            if grille[i][j] == 1:
                c[i][j] = 0
            elif i == 0 and j == 0:
                c[i][j] = 1
            else:
                haut = c[i - 1][j] if i > 0 else 0
                gauche = c[i][j - 1] if j > 0 else 0
                c[i][j] = haut + gauche
    return c[n - 1][p - 1]
```

On parcourt les cases ligne par ligne, de gauche à droite : la case du dessus et celle de gauche sont toujours déjà calculées. Un obstacle
compte 0 chemin.
:::
::::

::::exercice[La pyramide de nombres]{niveau=2}
Dans une pyramide de nombres (une liste de lignes, la ligne i ayant i + 1 nombres), on descend du sommet à la base en allant à chaque étape sur
l'un des deux nombres situés juste en dessous (même indice ou indice + 1). Écris `somme_max(pyramide)` qui renvoie la plus grande somme possible.
Indication : en partant de la **base** et en remontant, chaque nombre peut être remplacé par lui-même plus le plus grand de ses deux voisins du
dessous.

```python depart
def somme_max(pyramide):
    ...
```

```python tests
p = [[3], [7, 4], [2, 4, 6], [8, 5, 9, 3]]
assert somme_max(p) == 23, "3 + 7 + 4 + 9"
assert somme_max([[5]]) == 5, "un seul nombre"
assert somme_max([[1], [2, 3]]) == 4, "deux lignes"
assert p == [[3], [7, 4], [2, 4, 6], [8, 5, 9, 3]], "pyramide non modifiée"
```

:::corrige
```python solution
def somme_max(pyramide):
    meilleur = list(pyramide[-1])
    for i in range(len(pyramide) - 2, -1, -1):
        ligne = pyramide[i]
        meilleur = [ligne[j] + max(meilleur[j], meilleur[j + 1]) for j in range(len(ligne))]
    return meilleur[0]
```

Un glouton (aller toujours vers le plus grand voisin) donnerait 3 + 7 + 4 + 9 ici par chance, mais échoue sur d'autres pyramides ; essayer tous
les chemins en coûte 2ⁿ⁻¹. La programmation dynamique ne fait qu'un passage par case.
:::
::::

::::exercice[Glouton ou dynamique ?]{niveau=2}
Explique à un élève, sur l'exemple du rendu de 6 avec des pièces de 1, 3 et 4, pourquoi l'algorithme glouton se trompe et pourquoi la
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
