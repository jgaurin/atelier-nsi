---
titre: Programmation dynamique
resume: Résoudre un problème en combinant les solutions de sous-problèmes qui se répètent, calculées une seule fois et rangées dans un tableau ou un dictionnaire.
duree: 95
objectifs:
  - Reconnaître un problème à sous-problèmes qui se chevauchent et à sous-structure optimale
  - Écrire une relation de récurrence avec ses cas de base, puis la programmer par mémoïsation et par tabulation
  - Reconstruire une solution optimale (et pas seulement sa valeur)
  - Résoudre les problèmes classiques (rendu de monnaie, sac à dos 0/1, plus longue sous-suite commune, distance d'édition) et évaluer leur coût
prerequis: [algo/recursivite, algo/gloutons]
programme: [asd-progdyn, asd-iter-rec, asd-cout, nsit-algo]
cartes:
  - q: Deux propriétés qui rendent la programmation dynamique utile ?
    r: "Des **sous-problèmes qui se chevauchent** (les mêmes calculs reviennent) et une **sous-structure optimale** (une solution optimale se construit à partir de solutions optimales de sous-problèmes)."
  - q: Mémoïsation ou tabulation ?
    r: "**Mémoïsation** : fonction récursive qui range chaque résultat calculé dans un dictionnaire (calcul « de haut en bas »). **Tabulation** : on remplit un tableau dans un ordre où les sous-problèmes nécessaires sont déjà calculés (« de bas en haut »)."
  - q: Coût de Fibonacci mémoïsé ?
    r: "$\\Theta(n)$ appels utiles (chaque valeur calculée une fois), contre $\\Theta(\\varphi^n)$ en récursif naïf."
  - q: Récurrence du rendu de monnaie optimal ?
    r: "$m(0) = 0$ et $m(s) = 1 + \\min_{p \\le s} m(s - p)$ ; coût $\\Theta(s \\times k)$ pour $k$ pièces."
  - q: Récurrence du sac à dos 0/1 ?
    r: "$V(i, c) = V(i-1, c)$ si $p_i > c$, sinon $\\max(V(i-1, c),\\ v_i + V(i-1, c - p_i))$, avec $V(0, c) = 0$."
  - q: Récurrence de la plus longue sous-suite commune ?
    r: "$L(i, j) = L(i-1, j-1) + 1$ si $a_i = b_j$, sinon $\\max(L(i-1, j), L(i, j-1))$ ; $L(0, j) = L(i, 0) = 0$."
  - q: Comment reconstruire la solution, pas seulement sa valeur ?
    r: "En remontant le tableau depuis la case finale et en refaisant à chaque fois le choix qui a donné la valeur (ou en mémorisant ce choix pendant le calcul)."
---

Calculer `fib(40)` naïvement demande plus de 300 millions d'appels, alors qu'il n'y a que 41 valeurs différentes à
calculer : on recalcule sans cesse les mêmes choses. La **programmation dynamique** (inventée par Richard Bellman dans les
années 1950) consiste à **calculer chaque sous-problème une seule fois** et à **ranger** son résultat. C'est la méthode qui
résout le rendu de monnaie quand le glouton échoue, le sac à dos 0/1, la comparaison de textes (`diff`), la correction
orthographique, l'alignement de séquences d'ADN… et elle est demandée explicitement dans le sujet zéro de l'écrit 1
(« exprimer une relation de récurrence », « utiliser une structure de données auxiliaire contenant les valeurs déjà
calculées », « calculer le coût »).

## 1. De la récursion naïve à la mémoïsation

```python exec
def fib_naif(n):
    if n < 2:
        return n
    return fib_naif(n - 1) + fib_naif(n - 2)

def fib_memo(n, memo=None):
    if memo is None:
        memo = {}
    if n < 2:
        return n
    if n not in memo:                       # on ne calcule que ce qui ne l'a jamais été
        memo[n] = fib_memo(n - 1, memo) + fib_memo(n - 2, memo)
    return memo[n]

print(fib_naif(25), fib_memo(25), fib_memo(300))
```

La **mémoïsation** garde la fonction récursive, mais range chaque résultat dans un dictionnaire (la « mémoire ») et le
réutilise. Chaque `fib_memo(k)` n'est réellement calculé qu'une fois : $\Theta(n)$ additions au lieu de $\Theta(\varphi^n)$.
Python fournit le décorateur `functools.cache` qui fait la même chose automatiquement :

```python exec
from functools import cache

@cache
def fib(n):
    return n if n < 2 else fib(n - 1) + fib(n - 2)

print(fib(200))
```

On peut aussi calculer **de bas en haut**, dans un tableau rempli dans l'ordre : c'est la **tabulation**. Plus de
récursion (donc pas de limite de pile), et on voit clairement l'ordre des calculs.

```python exec
def fib_tab(n):
    f = [0] * (n + 1)
    if n >= 1:
        f[1] = 1
    for k in range(2, n + 1):
        f[k] = f[k - 1] + f[k - 2]       # f[k-1] et f[k-2] sont déjà calculés
    return f[n]

print(fib_tab(90))
```

Comme seules les deux dernières valeurs servent, on peut même ne garder que deux variables : mémoire constante.

## 2. La méthode

:::methode[Résoudre un problème par programmation dynamique]
1. **Définir les sous-problèmes** : « $m(s)$ = nombre minimal de pièces pour la somme $s$ », « $V(i, c)$ = valeur maximale
   avec les $i$ premiers objets et une capacité $c$ ». C'est l'étape décisive.
2. **Écrire la relation de récurrence** qui exprime un sous-problème en fonction de plus petits, et les **cas de base**.
3. **Choisir l'ordre de calcul** (tabulation) ou laisser la récursion le faire (mémoïsation).
4. **Calculer le coût** : nombre de sous-problèmes × coût de chacun (souvent un `min` ou un `max` sur quelques cas).
5. **Reconstruire** la solution si on la demande, en remontant les choix.
:::

Deux conditions la rendent pertinente : les sous-problèmes se **chevauchent** (sinon, diviser pour régner suffit) et le
problème a une **sous-structure optimale** (une solution optimale contient des solutions optimales de sous-problèmes).

## 3. Le rendu de monnaie optimal

Le glouton échoue avec `{1, 3, 4}`. Soit $m(s)$ le nombre minimal de pièces pour rendre $s$. La dernière pièce rendue est
l'une des pièces $p \le s$ ; il reste alors $s - p$ à rendre de façon optimale :

$$ m(0) = 0, \qquad m(s) = 1 + \min_{p \in P,\ p \le s} m(s - p). $$

```python exec
def rendu_optimal(s, pieces):
    m = [0] + [float("inf")] * s
    choix = [None] * (s + 1)              # pour reconstruire : la dernière pièce utilisée
    for v in range(1, s + 1):
        for p in pieces:
            if p <= v and m[v - p] + 1 < m[v]:
                m[v] = m[v - p] + 1
                choix[v] = p
    rendu = []
    v = s
    while v > 0 and choix[v] is not None:   # reconstruction en remontant
        rendu.append(choix[v])
        v -= choix[v]
    return m[s], rendu

print(rendu_optimal(6, [1, 3, 4]))
print(rendu_optimal(87, [1, 2, 5, 10, 20, 50]))
```

| $s$    | 0 | 1 | 2 | 3 | 4 | 5 | 6 |
|--------|---|---|---|---|---|---|---|
| $m(s)$ | 0 | 1 | 2 | 1 | 1 | 2 | 2 |

Coût : $s$ sous-problèmes, chacun en $\Theta(k)$ pour $k$ valeurs de pièces : $\Theta(s \cdot k)$.

## 4. Le sac à dos 0/1

On a $n$ objets de poids $p_i$ et de valeurs $v_i$, et un sac de capacité $C$ (entiers). Soit $V(i, c)$ la valeur maximale
qu'on peut obtenir avec les $i$ premiers objets et une capacité $c$. Pour l'objet $i$, deux possibilités : on ne le prend
pas, ou on le prend (s'il rentre) :

$$ V(0, c) = 0, \qquad V(i, c) = \begin{cases} V(i-1, c) & \text{si } p_i > c \\ \max\big(V(i-1, c),\ v_i + V(i-1, c - p_i)\big) & \text{sinon} \end{cases} $$

```python exec
def sac_a_dos(objets, C):
    """objets : liste de (poids, valeur). Renvoie (valeur max, indices des objets pris)."""
    n = len(objets)
    V = [[0] * (C + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        p, v = objets[i - 1]
        for c in range(C + 1):
            V[i][c] = V[i - 1][c]
            if p <= c and v + V[i - 1][c - p] > V[i][c]:
                V[i][c] = v + V[i - 1][c - p]
    pris, c = [], C
    for i in range(n, 0, -1):            # reconstruction : l'objet i a-t-il été pris ?
        if V[i][c] != V[i - 1][c]:
            pris.append(i - 1)
            c -= objets[i - 1][0]
    return V[n][C], sorted(pris)

print(sac_a_dos([(10, 60), (20, 100), (30, 120)], 50))
```

Coût : $(n + 1)(C + 1)$ cases remplies en temps constant, soit $\Theta(n \cdot C)$. Attention, ce coût dépend de la
**valeur** de $C$, pas de sa taille en mémoire (on parle de coût **pseudo-polynomial**) : avec $C = 10^9$, c'est inutilisable.

## 5. Comparer deux textes : plus longue sous-suite commune

Une **sous-suite** de `"ABCBDAB"` s'obtient en supprimant des lettres sans changer l'ordre (`"BCAB"`). La **plus longue
sous-suite commune** (PLSC) de deux mots mesure leur ressemblance ; c'est le principe de la commande `diff`.
Soit $L(i, j)$ la longueur de la PLSC des préfixes $a[0..i-1]$ et $b[0..j-1]$ :

$$ L(i, 0) = L(0, j) = 0, \qquad L(i, j) = \begin{cases} L(i-1, j-1) + 1 & \text{si } a_{i-1} = b_{j-1} \\ \max\big(L(i-1, j),\ L(i, j-1)\big) & \text{sinon} \end{cases} $$

```python exec
def plsc(a, b):
    L = [[0] * (len(b) + 1) for _ in range(len(a) + 1)]
    for i in range(1, len(a) + 1):
        for j in range(1, len(b) + 1):
            if a[i - 1] == b[j - 1]:
                L[i][j] = L[i - 1][j - 1] + 1
            else:
                L[i][j] = max(L[i - 1][j], L[i][j - 1])
    # reconstruction
    i, j, mot = len(a), len(b), []
    while i > 0 and j > 0:
        if a[i - 1] == b[j - 1]:
            mot.append(a[i - 1]); i -= 1; j -= 1
        elif L[i - 1][j] >= L[i][j - 1]:
            i -= 1
        else:
            j -= 1
    return L[len(a)][len(b)], "".join(reversed(mot))

print(plsc("ABCBDAB", "BDCABA"))
print(plsc("informatique", "mathematiques"))
```

Coût : $\Theta(|a| \times |b|)$ en temps et en mémoire.

```mermaid legende="Dépendances d'une case du tableau : on remplit ligne par ligne, de gauche à droite"
graph LR
  A["L(i-1, j-1)"] --> D["L(i, j)"]
  B["L(i-1, j)"] --> D
  C["L(i, j-1)"] --> D
```

:::prof
La programmation dynamique est au programme de terminale NSI (« utiliser la programmation dynamique pour écrire un
algorithme », exemples : rendu de monnaie, alignement de séquences). La progression qui marche : Fibonacci naïf (on
**compte** les appels), puis mémoïsation (on les compte encore), puis tableau. La difficulté pour les élèves est de
**définir le sous-problème** : faire formuler en français « $m(s)$ est… » avant toute formule.
:::

## Exemple guidé

**Problème (type écrit 1).** Un voleur peut emporter au plus 5 kg. Objets : A (2 kg, 3 €), B (3 kg, 4 €), C (4 kg, 5 €),
D (5 kg, 6 €). Remplir le tableau $V(i, c)$, en déduire la valeur maximale et les objets pris, puis comparer avec le glouton.

**1. Le tableau** (lignes : objets considérés ; colonnes : capacité $c$ de 0 à 5).

| $i$ \ $c$        | 0 | 1 | 2 | 3 | 4 | 5 |
|------------------|---|---|---|---|---|---|
| 0 (aucun objet)  | 0 | 0 | 0 | 0 | 0 | 0 |
| 1 (A : 2 kg, 3 €)| 0 | 0 | 3 | 3 | 3 | 3 |
| 2 (B : 3 kg, 4 €)| 0 | 0 | 3 | 4 | 4 | **7** |
| 3 (C : 4 kg, 5 €)| 0 | 0 | 3 | 4 | 5 | 7 |
| 4 (D : 5 kg, 6 €)| 0 | 0 | 3 | 4 | 5 | 7 |

Exemple de calcul : $V(2, 5) = \max(V(1, 5),\ 4 + V(1, 2)) = \max(3, 4 + 3) = 7$.

**2. Reconstruction.** On part de $V(4, 5) = 7$. $V(4, 5) = V(3, 5)$ : D n'est pas pris. $V(3, 5) = V(2, 5)$ : C non plus.
$V(2, 5) = 7 \ne V(1, 5) = 3$ : B est pris, il reste $5 - 3 = 2$ kg. $V(1, 2) = 3 \ne V(0, 2)$ : A est pris. Solution :
**A et B**, 5 kg, **7 €**.

**3. Le glouton par rapport valeur/poids** (A : 1,5 ; B : 1,33 ; C : 1,25 ; D : 1,2) prend A puis B : 7 €, ici optimal
par chance. Avec un sac de 9 kg, il prendrait A, B, C (9 kg, 12 €), optimal aussi ; mais avec les objets
`(10, 60), (20, 100), (30, 120)` et 50 kg, il obtient 160 au lieu de 220.

**4. Coût.** $(n + 1)(C + 1) = 5 \times 6 = 30$ cases ; en général $\Theta(nC)$.

```python exec
def tableau_sac(objets, C):
    V = [[0] * (C + 1) for _ in range(len(objets) + 1)]
    for i, (p, v) in enumerate(objets, start=1):
        for c in range(C + 1):
            V[i][c] = V[i - 1][c]
            if p <= c:
                V[i][c] = max(V[i][c], v + V[i - 1][c - p])
    return V

for ligne in tableau_sac([(2, 3), (3, 4), (4, 5), (5, 6)], 5):
    print(ligne)
```

## L'essentiel

- Programmation dynamique = sous-problèmes qui se **chevauchent** + **sous-structure optimale** ; chaque sous-problème est
  calculé **une fois** et rangé.
- **Mémoïsation** (récursion + dictionnaire, `functools.cache`) ou **tabulation** (tableau rempli dans le bon ordre).
- Méthode : définir le sous-problème en français, récurrence + cas de base, ordre de calcul, coût, reconstruction.
- Rendu de monnaie : $m(s) = 1 + \min_p m(s-p)$, $\Theta(sk)$. Sac à dos 0/1 : $V(i,c)$, $\Theta(nC)$ (pseudo-polynomial).
- PLSC : $L(i,j)$, $\Theta(|a||b|)$ ; distance d'édition : même schéma.
- Coût = nombre de sous-problèmes × coût de chacun.

## Exercices

::::exercice[Quand utiliser la programmation dynamique ?]{niveau=1}
Quelle propriété rend la mémoïsation **utile** (par rapport à une simple récursion) ?

- [ ] le problème a un seul cas de base
- [x] les mêmes sous-problèmes apparaissent plusieurs fois dans l'arbre des appels
- [ ] les sous-problèmes sont tous de taille moitié
- [ ] la fonction n'a qu'un paramètre

:::corrige
La mémoïsation évite de recalculer un sous-problème déjà résolu : elle n'apporte rien si chaque sous-problème n'apparaît
qu'une fois (comme dans le tri fusion, où les sous-listes sont toutes différentes).
:::
::::

::::exercice[Coût de Fibonacci mémoïsé]{niveau=1}
Combien d'additions fait `fib_memo(n)` (version du cours), pour $n \ge 2$ ?

- [x] $n - 1$
- [ ] $2^n$
- [ ] $n^2$
- [ ] $\log_2 n$

:::corrige
Chaque valeur `fib_memo(k)` pour $2 \le k \le n$ est calculée une seule fois, avec une addition : $n - 1$ additions,
$\Theta(n)$.
:::
::::

::::exercice[Fibonacci en tabulation]{niveau=2}
Écris `fib(n)` (avec $F_0 = 0$, $F_1 = 1$) **sans récursion**, en $\Theta(n)$ et avec une mémoire constante.

```python depart
def fib(n):
    ...
```

```python tests
assert fib(0) == 0, "F0"
assert fib(1) == 1, "F1"
assert fib(10) == 55, "F10"
assert fib(90) == 2880067194370816120, "F90"
```

:::corrige
```python solution
def fib(n):
    a, b = 0, 1          # a = F(k), b = F(k+1), avec k = 0
    for _ in range(n):
        a, b = b, a + b
    return a
```
Invariant : après $k$ tours, `a` vaut $F_k$ et `b` vaut $F_{k+1}$.
:::
::::

::::exercice[Rendu de monnaie optimal]{niveau=2}
Écris `nb_pieces_min(s, pieces)` qui renvoie le nombre minimal de pièces pour rendre `s` (`s >= 0`), ou `None` si c'est
impossible (par exemple 3 avec les pièces `{2, 5}`).

```python depart
def nb_pieces_min(s, pieces):
    ...
```

```python tests
assert nb_pieces_min(6, [1, 3, 4]) == 2, "3 + 3"
assert nb_pieces_min(0, [1, 2]) == 0, "rien à rendre"
assert nb_pieces_min(3, [2, 5]) is None, "impossible"
assert nb_pieces_min(11, [2, 5]) == 4, "5 + 2 + 2 + 2"
assert nb_pieces_min(87, [1, 2, 5, 10, 20, 50]) == 5, "50 + 20 + 10 + 5 + 2"
```

:::corrige
```python solution
def nb_pieces_min(s, pieces):
    INF = float("inf")
    m = [0] + [INF] * s
    for v in range(1, s + 1):
        for p in pieces:
            if p <= v and m[v - p] + 1 < m[v]:
                m[v] = m[v - p] + 1
    return None if m[s] == INF else m[s]
```
`float("inf")` représente « impossible » : $\infty + 1 = \infty$ et il ne gagne jamais un `min`.
:::
::::

::::exercice[Chemins avec obstacles]{niveau=2}
Une grille est donnée sous forme de liste de chaînes, `"."` pour une case libre et `"#"` pour un obstacle. On part de la
case en haut à gauche et on va en bas à droite, en se déplaçant seulement vers la droite ou vers le bas, sans passer par
un obstacle. Écris `nb_chemins(grille)` en $\Theta(\text{lignes} \times \text{colonnes})$.

```python depart
def nb_chemins(grille):
    ...
```

```python tests
assert nb_chemins(["...", "...", "..."]) == 6, "3 x 3 sans obstacle"
assert nb_chemins(["...", ".#.", "..."]) == 2, "obstacle au centre"
assert nb_chemins(["#.."]) == 0, "départ bloqué"
assert nb_chemins(["." * 16] * 16) == 155117520, "16 x 16 (impossible en récursif naïf)"
```

:::corrige
```python solution
def nb_chemins(grille):
    l, c = len(grille), len(grille[0])
    N = [[0] * c for _ in range(l)]
    for i in range(l):
        for j in range(c):
            if grille[i][j] == "#":
                N[i][j] = 0
            elif i == 0 and j == 0:
                N[i][j] = 1
            else:
                haut = N[i - 1][j] if i > 0 else 0
                gauche = N[i][j - 1] if j > 0 else 0
                N[i][j] = haut + gauche
    return N[l - 1][c - 1]
```
On arrive en `(i, j)` depuis le haut ou depuis la gauche : $N(i, j) = N(i-1, j) + N(i, j-1)$, et 0 sur un obstacle.
Pour la grille 16 × 16 : $\binom{30}{15} = 155\,117\,520$ chemins, calculés avec 256 cases.
:::
::::

::::exercice[Sac à dos 0/1]{niveau=3}
Écris `sac_a_dos(objets, C)` qui renvoie la valeur maximale qu'on peut emporter (objets entiers, au plus une fois chacun).
`objets` est une liste de couples `(poids, valeur)` entiers.

```python depart
def sac_a_dos(objets, C):
    ...
```

```python tests
assert sac_a_dos([(10, 60), (20, 100), (30, 120)], 50) == 220, "le glouton donnerait 160"
assert sac_a_dos([(2, 3), (3, 4), (4, 5), (5, 6)], 5) == 7, "exemple guidé"
assert sac_a_dos([], 10) == 0, "aucun objet"
assert sac_a_dos([(5, 10)], 4) == 0, "objet trop lourd"
assert sac_a_dos([(1, 1)] * 3, 10) == 3, "chaque objet une seule fois"
```

:::corrige
```python solution
def sac_a_dos(objets, C):
    V = [0] * (C + 1)          # V[c] pour les objets déjà considérés
    for p, v in objets:
        for c in range(C, p - 1, -1):     # de droite à gauche : chaque objet au plus une fois
            V[c] = max(V[c], v + V[c - p])
    return V[C]
```
Version à une seule ligne de tableau : en parcourant les capacités **de la plus grande à la plus petite**, `V[c - p]` vaut
encore la valeur « sans l'objet courant ». De gauche à droite, on pourrait prendre plusieurs fois le même objet (c'est le
sac à dos « non borné »). Le dernier test vérifie ce point.
:::
::::

::::exercice[Distance d'édition]{niveau=3}
La **distance d'édition** (de Levenshtein) entre deux mots est le nombre minimal d'opérations (insérer, supprimer ou
remplacer une lettre) pour passer de l'un à l'autre. Soit $D(i, j)$ la distance entre $a[0..i-1]$ et $b[0..j-1]$ :
$D(i, 0) = i$, $D(0, j) = j$, et $D(i, j) = D(i-1, j-1)$ si $a_{i-1} = b_{j-1}$, sinon
$1 + \min(D(i-1, j), D(i, j-1), D(i-1, j-1))$. Écris `distance(a, b)`.

```python depart
def distance(a, b):
    ...
```

```python tests
assert distance("chat", "chien") == 3, "chat -> chien"
assert distance("", "abc") == 3, "trois insertions"
assert distance("kitten", "sitting") == 3, "exemple classique"
assert distance("nsi", "nsi") == 0, "identiques"
assert distance("ab", "ba") == 2, "deux remplacements"
```

:::corrige
```python solution
def distance(a, b):
    D = [[0] * (len(b) + 1) for _ in range(len(a) + 1)]
    for i in range(len(a) + 1):
        D[i][0] = i
    for j in range(len(b) + 1):
        D[0][j] = j
    for i in range(1, len(a) + 1):
        for j in range(1, len(b) + 1):
            if a[i - 1] == b[j - 1]:
                D[i][j] = D[i - 1][j - 1]
            else:
                D[i][j] = 1 + min(D[i - 1][j], D[i][j - 1], D[i - 1][j - 1])
    return D[len(a)][len(b)]
```
Les trois cas du `min` correspondent à : supprimer $a_{i-1}$, insérer $b_{j-1}$, remplacer. Coût $\Theta(|a| \times |b|)$.
C'est l'algorithme des correcteurs orthographiques (« vouliez-vous dire… ? »).
:::
::::

::::exercice[Plus longue sous-suite croissante]{niveau=4 duree=30}
Une **sous-suite** d'une liste `t` s'obtient en supprimant des éléments sans changer l'ordre des autres. On cherche la
longueur de la plus longue sous-suite **strictement croissante** de `t` (pour `[3, 10, 2, 1, 20, 4, 6, 7]`, c'est 4 :
`[3, 4, 6, 7]`).

1. On note $L(i)$ la longueur de la plus longue sous-suite strictement croissante **qui se termine par** `t[i]`.
   Exprime $L(i)$ en fonction des $L(j)$ pour $j < i$. Quel est le cas de base ? Comment obtient-on la réponse au problème ?
2. Calcule les $L(i)$ pour l'exemple ci-dessus.
3. Écris une fonction récursive naïve `L(t, i)`, puis explique pourquoi son coût est exponentiel dans le pire cas
   (indique une entrée défavorable). Écris ensuite une version mémoïsée et une version par tabulation.
4. Donne le coût de la tabulation. Explique comment reconstruire une sous-suite optimale.

:::criteres
- $L(i) = 1 + \max\{L(j) : j < i,\ t[j] < t[i]\}$, avec $\max \emptyset = 0$ (donc $L(i) = 1$ si aucun $j$ ne convient) ; réponse : $\max_i L(i)$ (0 si la liste est vide).
- Valeurs pour l'exemple : 1, 2, 1, 1, 3, 2, 3, 4 ; maximum 4.
- La version naïve rappelle $L(j)$ pour tous les $j$ plus petits, de nombreuses fois ; sur une liste strictement croissante, le nombre d'appels vérifie $A(i) = 1 + \sum_{j<i} A(j)$, soit $2^i$ : exponentiel.
- Versions mémoïsée (dictionnaire ou `cache`) et tabulée (boucle sur `i` croissant) correctes.
- Coût de la tabulation $\Theta(n^2)$ ; reconstruction en mémorisant pour chaque `i` l'indice `j` qui réalise le maximum (prédécesseur) et en remontant depuis l'indice du maximum.
:::

:::corrige
1. Une sous-suite croissante qui se termine par `t[i]` est soit réduite à `t[i]`, soit une sous-suite croissante qui se
   termine par un `t[j]` avec $j < i$ et $t[j] < t[i]$, prolongée par `t[i]`. Donc
   $$ L(i) = 1 + \max\{L(j) : 0 \le j < i,\ t[j] < t[i]\} $$
   avec la convention $\max \emptyset = 0$ (en particulier $L(0) = 1$, cas de base). La réponse est $\max_{i} L(i)$
   (et 0 pour une liste vide).
2. `t = [3, 10, 2, 1, 20, 4, 6, 7]` : $L = [1, 2, 1, 1, 3, 2, 3, 4]$ (par exemple $L(7) = 1 + L(6) = 4$ via 3, 4, 6, 7).
   Le maximum est **4**.
3. ```python
   def L(t, i):
       meilleur = 0
       for j in range(i):
           if t[j] < t[i]:
               meilleur = max(meilleur, L(t, j))
       return 1 + meilleur
   ```
   Sur une liste strictement croissante, `L(t, i)` appelle `L(t, j)` pour **tous** les $j < i$ : le nombre d'appels
   $A(i) = 1 + \sum_{j<i} A(j)$ vérifie $A(i) = 2^i$. Pour `n = 40`, plus de mille milliards d'appels.
   ```python
   from functools import cache

   def plssc(t):
       @cache
       def L(i):
           return 1 + max([L(j) for j in range(i) if t[j] < t[i]], default=0)
       return max((L(i) for i in range(len(t))), default=0)

   def plssc_tab(t):
       n = len(t)
       L = [1] * n
       for i in range(n):
           for j in range(i):
               if t[j] < t[i] and L[j] + 1 > L[i]:
                   L[i] = L[j] + 1
       return max(L, default=0)
   ```
4. La tabulation fait $\sum_{i} i = \frac{n(n-1)}{2}$ comparaisons : $\Theta(n^2)$ (et une mémoire $\Theta(n)$). Pour
   reconstruire, on mémorise `pred[i]`, l'indice `j` qui a donné le maximum (ou `None`), puis on part de l'indice `k` qui
   maximise `L` et on remonte `k, pred[k], pred[pred[k]], …` ; on renverse la liste obtenue. (Il existe un algorithme en
   $\Theta(n \log n)$, avec une recherche dichotomique, hors programme.)
:::
::::
