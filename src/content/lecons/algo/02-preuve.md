---
titre: "Prouver un algorithme : invariant et variant"
resume: Démontrer qu'une boucle s'arrête (variant) et qu'elle calcule le bon résultat (invariant), avec une rédaction attendue à l'écrit.
duree: 80
objectifs:
  - Distinguer correction partielle, terminaison et correction totale
  - Prouver la terminaison d'une boucle à l'aide d'un variant
  - Énoncer un invariant de boucle et le démontrer (initialisation, conservation, conclusion)
  - Trouver un invariant à partir de la postcondition
prerequis: [algo/complexite, python/boucles]
programme: [asd-preuve, asd-iter-rec, m-logique, nsi1-algo]
cartes:
  - q: Que signifie « correction totale » ?
    r: "Correction partielle (si l'algorithme s'arrête, le résultat respecte la spécification) + terminaison (il s'arrête toujours)."
  - q: Qu'est-ce qu'un variant de boucle ?
    r: "Une quantité entière, positive ou nulle tant que la boucle tourne, qui décroît strictement à chaque tour. Elle garantit la terminaison."
  - q: Qu'est-ce qu'un invariant de boucle ?
    r: "Une propriété vraie avant le premier tour, et qui, si elle est vraie au début d'un tour, l'est encore à la fin de ce tour."
  - q: Les trois étapes d'une preuve par invariant ?
    r: "Initialisation (vrai avant la boucle), conservation (un tour la préserve), conclusion (invariant + condition de sortie ⇒ postcondition)."
  - q: "Invariant de `s = 0; for i in range(n): s += t[i]` ?"
    r: "Au début du tour d'indice `i` : `s == t[0] + ... + t[i-1]` (somme des `i` premiers éléments). À la sortie, `i = n` donne la somme totale."
  - q: Comment trouver un invariant ?
    r: "Partir de la postcondition et remplacer la borne finale (n) par la variable de boucle (i) : « le résultat pour la partie déjà traitée »."
  - q: "Variant de l'algorithme d'Euclide `while b != 0: a, b = b, a % b` ?"
    r: "`b` : entier naturel, et `a % b < b` donc il décroît strictement."
  - q: Pourquoi un invariant ressemble-t-il à une récurrence ?
    r: "L'initialisation est le cas de base, la conservation est l'hérédité, et le numéro du tour joue le rôle de l'entier n."
---

Un jeu de tests, même bien choisi, ne vérifie qu'un nombre fini de cas. Pour être **sûr** qu'un algorithme est
juste pour **toutes** les entrées, il faut le **démontrer**. C'est exigé à l'écrit du CAPES (« Démontrer que la
fonction est correcte. Pour cela, on proposera, en le justifiant, un invariant de l'itération, puis un variant de
l'itération ») et c'est un excellent outil pour écrire du code juste du premier coup. Bonne nouvelle : la méthode
est toujours la même.

## 1. Ce qu'on prouve

On prouve qu'un algorithme respecte sa **spécification** : si les entrées vérifient la **précondition**, alors le
résultat vérifie la **postcondition**. Cela se découpe en deux questions indépendantes :

:::definition
- **Correction partielle** : *si* l'algorithme s'arrête, alors son résultat vérifie la postcondition.
- **Terminaison** : l'algorithme s'arrête, pour toute entrée vérifiant la précondition.
- **Correction totale** = correction partielle + terminaison.
:::

Les instructions sans boucle (et sans récursion) ne posent pas de problème : on suit les affectations. Toute la
difficulté est dans les **boucles**. Pour une boucle, on prouve la terminaison avec un **variant**, et la correction
partielle avec un **invariant**.

## 2. Prouver la terminaison : le variant

Une boucle `for i in range(n)` s'arrête toujours (si on ne modifie pas `n` ni la séquence parcourue). Le problème
vient des boucles `while`.

:::definition
Un **variant** d'une boucle est une expression à valeurs **entières**, **positive ou nulle** tant que la condition
de boucle est vraie, et qui **décroît strictement** à chaque tour.
:::

Comme il n'existe pas de suite infinie strictement décroissante d'entiers naturels, la boucle ne peut faire qu'un
nombre fini de tours. En prime, la valeur initiale du variant **majore le nombre de tours**, ce qui sert pour le coût.

```python exec
def nb_chiffres(n):
    """Nombre de chiffres de l'entier n >= 1."""
    c = 0
    while n > 0:        # variant : n (entier, > 0 dans la boucle, n // 10 < n)
        n = n // 10
        c += 1
    return c

print(nb_chiffres(40372))
```

Ici `n` est un variant : c'est un entier, strictement positif tant que la boucle tourne, et pour $n \ge 1$,
$n /\!/ 10 < n$. D'autres variants classiques : `j - i` pour deux indices qui se rapprochent, `n - i` pour un compteur
qui monte jusqu'à `n`, `b` dans l'algorithme d'Euclide, la taille d'une liste qu'on réduit.

:::attention
Le variant doit décroître **strictement** à **chaque** tour, et rester un **entier positif** : « `x` diminue » ne
suffit pas si `x` est un réel (0,5 ; 0,25 ; 0,125… diminue indéfiniment). Et si aucun variant n'existe, la boucle peut
ne pas terminer (la suite de Syracuse est une boucle dont on ne sait pas prouver la terminaison).
:::

## 3. Prouver la correction : l'invariant

:::definition
Un **invariant** de boucle est une propriété portant sur les variables du programme qui est :
1. **vraie avant le premier tour** (initialisation) ;
2. **conservée par un tour** : si elle est vraie au début d'un tour (et que la condition de boucle est vraie),
   elle est encore vraie à la fin du tour (conservation).

Elle est donc vraie après chaque tour, et en particulier **à la sortie** de la boucle. On combine alors l'invariant
avec la **condition de sortie** pour obtenir la postcondition (conclusion).
:::

C'est exactement un **raisonnement par récurrence** sur le nombre de tours : l'initialisation est le cas de base, la
conservation est l'hérédité.

```mermaid legende="Où l'invariant doit être vrai : avant la boucle et à chaque retour au test"
graph TD
  A["Initialisation<br/>✓ invariant vrai"] --> B{"condition ?"}
  B -- vraie --> C["corps de la boucle<br/>(l'invariant peut être<br/>momentanément faux)"]
  C --> D["fin du tour<br/>✓ invariant de nouveau vrai"]
  D --> B
  B -- fausse --> E["Sortie : invariant ✓ + condition fausse<br/>⇒ postcondition"]
```

### Un premier exemple complet : la somme

```python exec
def somme(t):
    s = 0
    i = 0
    while i < len(t):
        s = s + t[i]
        i = i + 1
    return s

print(somme([3, 1, 4, 1, 5]))
```

**Spécification.** Précondition : `t` est une liste de nombres de longueur `n`. Postcondition : le résultat vaut
$\sum_{k=0}^{n-1} t[k]$.

**Invariant** $\mathcal{I}$ : « $0 \le i \le n$ et $s = \sum_{k=0}^{i-1} t[k]$ » (somme des `i` premiers éléments).

- *Initialisation* : avant la boucle, $i = 0$ et $s = 0$, qui est la somme vide. $\mathcal I$ est vrai.
- *Conservation* : supposons $\mathcal I$ vrai au début d'un tour, avec $i < n$. Le tour calcule
  $s' = s + t[i] = \sum_{k=0}^{i-1} t[k] + t[i] = \sum_{k=0}^{i} t[k]$ puis $i' = i + 1 \le n$. Donc
  $s' = \sum_{k=0}^{i'-1} t[k]$ : $\mathcal I$ est vrai à la fin du tour.
- *Conclusion* : à la sortie, $\mathcal I$ est vrai et la condition est fausse : $i \ge n$. Avec $i \le n$, on a
  $i = n$, donc $s = \sum_{k=0}^{n-1} t[k]$ : c'est la postcondition.
- *Terminaison* : $n - i$ est un entier, positif dans la boucle, qui diminue de 1 à chaque tour.

L'invariant contient « $0 \le i \le n$ » : sans cette précision, on ne pourrait pas conclure $i = n$ à la sortie.
Penser à ces **bornes** est un point souvent oublié.

## 4. Trouver un invariant

:::methode[Construire un invariant]
1. Écrire la **postcondition** en fonction de la taille : « `s` est la somme des `n` éléments ».
2. Remplacer la quantité finale par la **variable de boucle** : « `s` est la somme des `i` premiers éléments ».
   C'est le « résultat pour la partie déjà traitée ».
3. Ajouter les **bornes** de la variable de boucle (`0 <= i <= n`) et les propriétés des autres variables.
4. Vérifier : (a) vrai au départ ? (b) un tour le conserve ? (c) avec la condition de sortie, donne-t-il la postcondition ?
   Si (c) échoue, l'invariant est trop faible ; si (b) échoue, il est faux ou trop fort.
:::

Deux autres exemples classiques :

| Algorithme | Invariant (au début du tour d'indice `i`) |
|---|---|
| maximum : `m = t[0]`, puis `for i in range(1, n): if t[i] > m: m = t[i]` | `m` est le maximum de `t[0..i-1]` |
| recherche : `for i in range(n): if t[i] == x: return i` | `x` n'apparaît pas dans `t[0..i-1]` |
| tri par sélection, tour `i` | `t[0..i-1]` est trié et contient les `i` plus petits éléments |
| division euclidienne par soustractions | `a == b * q + r` et `r >= 0` |

```python exec
def division(a, b):
    """Quotient et reste de a par b, pour a >= 0 et b > 0."""
    q, r = 0, a
    while r >= b:
        assert a == b * q + r and r >= 0     # l'invariant, vérifié à chaque tour
        q, r = q + 1, r - b
    return q, r

print(division(17, 5), division(3, 5), division(20, 5))
```

Ici l'invariant $a = bq + r$ et $r \ge 0$ est conservé ($b(q+1) + (r - b) = bq + r$, et $r - b \ge 0$ puisqu'on
est entré dans la boucle avec $r \ge b$). À la sortie, $r < b$ : on a $a = bq + r$ avec $0 \le r < b$, la définition
même du quotient et du reste. Variant : $r$, entier positif qui diminue de $b \ge 1$ à chaque tour.

:::retenir
Écrire l'invariant dans le code avec `assert` est une bonne pratique de développement : si on s'est trompé dans le
code (ou dans l'invariant), l'assertion le révèle immédiatement sur les tests.
:::

## 5. Et les fonctions récursives ?

Pour une fonction récursive, on prouve la correction par **récurrence** sur la taille de l'entrée (le paramètre qui
diminue) : on vérifie le cas de base, puis on suppose que les appels récursifs (sur des entrées plus petites) sont
corrects et on montre que l'appel courant l'est. La terminaison se prouve encore avec un variant : une quantité
entière positive qui diminue strictement à chaque appel. Ce sera développé dans la leçon sur la récursivité.

:::prof
Au lycée, l'invariant est abordé de façon informelle en première (« montrer la correction d'un algorithme de tri
à l'aide d'un invariant ») et la terminaison avec un variant. Une bonne activité : donner un algorithme et quatre
propriétés candidates, et faire trier aux élèves celles qui sont des invariants, celles qui sont vraies mais
inutiles, celles qui sont fausses. Les « points d'observation » (afficher l'état au début de chaque tour) font
**voir** l'invariant avant de le démontrer.
:::

## Exemple guidé

**Problème (type écrit 1).** On considère la fonction d'exponentiation rapide itérative ci-dessous, pour un nombre
`x` et un entier `n >= 0`. Montrer qu'elle termine et qu'elle renvoie $x^n$.

```python exec
def puissance(x, n):
    resultat = 1
    base, e = x, n
    while e > 0:
        if e % 2 == 1:
            resultat = resultat * base
        base = base * base
        e = e // 2
    return resultat

print(puissance(3, 13), 3 ** 13, puissance(2, 0))
```

**1. Observer.** Pour `x = 3, n = 13`, au début de chaque tour :

| tour | `resultat` | `base`   | `e`  | `resultat * base**e` |
|------|------------|----------|------|----------------------|
| 1    | 1          | 3        | 13   | $3^{13}$             |
| 2    | 3          | 9        | 6    | $3 \cdot 9^6 = 3^{13}$ |
| 3    | 3          | 81       | 3    | $3 \cdot 81^3 = 3^{13}$ |
| 4    | 243        | 6561     | 1    | $243 \cdot 6561 = 3^{13}$ |
| sortie | 1594323  | …        | 0    | $3^{13}$             |

La dernière colonne ne change pas : c'est l'invariant.

**2. Invariant** $\mathcal I$ : « `e` est un entier positif ou nul et $\text{resultat} \times \text{base}^{e} = x^n$ ».

- *Initialisation* : `resultat = 1`, `base = x`, `e = n` : $1 \times x^n = x^n$.
- *Conservation* : supposons $\mathcal I$ au début d'un tour, avec $e > 0$. Notons $e = 2k + b$ avec $b = e \% 2$.
  Après le tour : $e' = k$, $\text{base}' = \text{base}^2$, et $\text{resultat}' = \text{resultat} \times \text{base}^b$.
  Alors $\text{resultat}' \times (\text{base}')^{e'} = \text{resultat} \times \text{base}^{b} \times \text{base}^{2k}
  = \text{resultat} \times \text{base}^{e} = x^n$.
- *Conclusion* : à la sortie, $e = 0$ (entier positif ou nul et non strictement positif), donc
  $\text{resultat} \times \text{base}^0 = \text{resultat} = x^n$.

**3. Variant** : `e`, entier strictement positif dans la boucle, et $e /\!/ 2 < e$ pour $e \ge 1$. La boucle termine.

**4. Coût (en bonus).** `e` est divisé par 2 à chaque tour : la boucle fait $\lfloor \log_2 n \rfloor + 1$ tours
pour $n \ge 1$, avec au plus 2 multiplications par tour : $O(\log n)$ multiplications, contre $n$ pour la méthode naïve.

## L'essentiel

- Correction totale = correction partielle (si ça s'arrête, c'est juste) + terminaison.
- **Variant** : entier, positif dans la boucle, strictement décroissant ⇒ terminaison (et majoration du nombre de tours).
- **Invariant** : vrai avant la boucle (initialisation), conservé par un tour (conservation) ; avec la condition de
  sortie, il donne la postcondition (conclusion). C'est une récurrence sur le nombre de tours.
- Pour le trouver : la postcondition où l'on remplace `n` par la variable de boucle, + les bornes de cette variable.
- Rédaction : énoncer l'invariant précisément, puis les trois étapes, puis le variant.

## Exercices

::::exercice[Choisir un variant]{niveau=1}
Quelle expression est un variant de cette boucle (avec `i` et `n` entiers, `i = 0` au départ) ?

```python
while i < n:
    i = i + 2
```

- [ ] `i`
- [x] `n - i`
- [ ] `i - n`
- [ ] `n`

:::corrige
`n - i` est un entier, strictement positif tant que `i < n`, et il diminue de 2 à chaque tour. `i` augmente (pas un
variant), `i - n` est négatif dans la boucle, `n` ne change pas.
:::
::::

::::exercice[Reconnaître l'invariant]{niveau=1}
On considère `p = 1` puis `for i in range(1, n + 1): p = p * i`. Quelle propriété est un invariant utile, vrai au
début du tour où la variable vaut `i` ?

- [ ] `p == i`
- [x] `p` est le produit des entiers de 1 à `i - 1`, c'est-à-dire $(i-1)!$
- [ ] `p` est le produit des entiers de 1 à `n`
- [ ] `p > 0`

:::corrige
Au début du tour `i`, on a multiplié par 1, 2, …, i − 1 : $p = (i-1)!$. À la fin du dernier tour (`i = n`),
$p = n!$. « `p > 0` » est vrai mais ne permet pas de conclure ; « `p` est le produit de 1 à n » n'est vrai qu'à la fin.
:::
::::

::::exercice[Prouver une terminaison]{niveau=2}
Pour deux entiers `a` et `b` strictement positifs, montre que cette boucle termine.

```python
while a != b:
    if a > b:
        a = a - b
    else:
        b = b - a
```

:::criteres
- Il est montré que `a` et `b` restent des entiers strictement positifs (on soustrait le plus petit du plus grand, qui est strictement plus grand).
- Un variant est proposé : `a + b` (ou `max(a, b)`).
- La décroissance stricte est justifiée : à chaque tour, `a + b` diminue du plus petit des deux, qui est au moins 1.
- La conclusion : un entier naturel ne peut décroître strictement indéfiniment, donc la boucle s'arrête.
:::

:::corrige
Montrons d'abord que `a` et `b` restent des entiers **strictement positifs** : dans la boucle, $a \ne b$ ; si $a > b$,
la nouvelle valeur $a - b$ est $\ge 1$ ; sinon $b > a$ et $b - a \ge 1$. Prenons comme variant $V = a + b$ : c'est un
entier positif. À chaque tour, on retire à l'un des deux nombres le plus petit, qui vaut au moins 1 : $V$ diminue
strictement. Une suite strictement décroissante d'entiers naturels est finie : la boucle termine (en au plus
$a + b$ tours). (C'est l'algorithme d'Euclide par soustractions ; à la sortie, $a = b = \text{pgcd}$.)
:::
::::

::::exercice[Une preuve par invariant complète]{niveau=2}
Prouve que la fonction suivante renvoie le nombre d'éléments pairs de `t`, en donnant un invariant et les trois étapes.

```python
def nb_pairs(t):
    c = 0
    for i in range(len(t)):
        if t[i] % 2 == 0:
            c += 1
    return c
```

:::criteres
- Invariant : « au début du tour d'indice `i`, `c` est le nombre d'éléments pairs parmi `t[0], …, t[i-1]` ».
- Initialisation : `i = 0`, `c = 0`, nombre de pairs parmi zéro élément.
- Conservation : on ajoute 1 à `c` exactement quand `t[i]` est pair, donc à la fin du tour `c` compte les pairs de `t[0..i]`.
- Conclusion : après le dernier tour (`i = n - 1`), `c` compte les pairs de `t[0..n-1]`, c'est-à-dire de toute la liste.
- Terminaison : une boucle `for` sur `range(len(t))` fait exactement `n` tours.
:::

:::corrige
**Invariant** : au début du tour d'indice `i`, `c` est le nombre d'éléments pairs parmi `t[0], …, t[i - 1]`.
*Initialisation* : au premier tour, `i = 0` et `c = 0` : il y a 0 élément pair parmi les 0 premiers.
*Conservation* : pendant le tour `i`, `c` augmente de 1 si et seulement si `t[i]` est pair ; à la fin du tour, `c` est
donc le nombre de pairs parmi `t[0..i]`, ce qui est l'invariant au début du tour `i + 1`.
*Conclusion* : la propriété est vraie après le dernier tour (`i = n - 1`) : `c` compte les pairs de `t[0..n-1]`,
toute la liste. *Terminaison* : une boucle `for` sur `range(n)` fait exactement `n` tours.
:::
::::

::::exercice[Division euclidienne vérifiée]{niveau=2}
Écris `division(a, b)` qui renvoie le couple `(q, r)` du quotient et du reste de `a` par `b` (pour `a >= 0`, `b > 0`)
par **soustractions successives** (sans `//` ni `%`). Ajoute dans la boucle un `assert` qui vérifie l'invariant.

```python depart
def division(a, b):
    ...
```

```python tests
assert division(17, 5) == (3, 2), "17 = 5 × 3 + 2"
assert division(3, 5) == (0, 3), "a < b"
assert division(20, 5) == (4, 0), "division exacte"
assert division(0, 7) == (0, 0), "a = 0"
assert division(1000, 1) == (1000, 0), "b = 1"
```

:::corrige
```python solution
def division(a, b):
    q, r = 0, a
    while r >= b:
        assert a == b * q + r and r >= 0
        q += 1
        r -= b
    return q, r
```
Invariant : $a = bq + r$ et $r \ge 0$. À la sortie, $r < b$, d'où la définition de la division euclidienne.
Variant : $r$, qui diminue de $b \ge 1$. Coût : $q = a /\!/ b$ tours, c'est-à-dire linéaire en la valeur de `a`
(pas en son nombre de chiffres) : très lent pour de grands nombres.
:::
::::

::::exercice[L'invariant révèle le bug]{niveau=3}
Cette fonction doit renvoyer le **minimum** d'une liste non vide, mais elle est fausse. Un élève propose l'invariant
« au début du tour d'indice `i`, `m` est le minimum de `t[0..i-1]` ». Montre à quelle étape de la preuve l'invariant
échoue, donne un contre-exemple, puis corrige le code.

```python
def minimum(t):
    m = 0
    for i in range(len(t)):
        if t[i] < m:
            m = t[i]
    return m
```

:::criteres
- L'étape fautive est l'initialisation : `m = 0` n'est pas le minimum de la liste vide `t[0..-1]` (qui n'a pas de minimum), et plus concrètement après le premier tour `m` vaut `min(0, t[0])`, pas `t[0]`.
- Un contre-exemple est donné : `minimum([3, 5])` renvoie 0 au lieu de 3.
- La correction initialise `m = t[0]` (et la boucle peut commencer à 1), avec l'invariant « `m` est le minimum de `t[0..i-1]` » pour `i >= 1`.
:::

:::corrige
L'initialisation échoue : au premier tour (`i = 0`), l'invariant parlerait du minimum de zéro élément, qui n'existe
pas ; et après le premier tour, `m` vaut $\min(0, t[0])$ et non $t[0]$. Dès que tous les éléments sont strictement
positifs, le résultat est faux : `minimum([3, 5])` renvoie `0`. La conservation, elle, est juste.

```python
def minimum(t):
    m = t[0]
    for i in range(1, len(t)):
        if t[i] < m:
            m = t[i]
    return m
```
Invariant corrigé : au début du tour d'indice `i` (pour $1 \le i \le n$), `m` est le minimum de `t[0..i-1]`.
Initialisation : pour `i = 1`, `m = t[0]` est bien le minimum de `t[0..0]`.
:::
::::

::::exercice[Preuve complète : conversion en binaire]{niveau=4 duree=30}
La fonction suivante calcule l'écriture binaire d'un entier `n >= 0` sous forme d'une liste de bits, **du bit de
poids faible au bit de poids fort** (par exemple `binaire(6)` renvoie `[0, 1, 1]`, car $6 = 0 \times 2^0 + 1 \times 2^1 + 1 \times 2^2$).

```python
def binaire(n):
    bits = []
    m = n
    while m > 0:
        bits.append(m % 2)
        m = m // 2
    return bits
```

1. Fais la trace de `binaire(13)` en indiquant, au début de chaque tour, `m`, `bits` et la valeur de
   $m \times 2^k + \sum_{i=0}^{k-1} \text{bits}[i] \, 2^i$ où $k$ est la longueur de `bits`.
2. Démontre que la boucle termine et donne le nombre exact de tours en fonction de `n` (pour $n \ge 1$).
3. Démontre que la propriété $\mathcal I$ : « $n = m \times 2^k + \sum_{i=0}^{k-1} \text{bits}[i]\, 2^i$, où $k$ est
   la longueur de `bits`, et chaque `bits[i]` vaut 0 ou 1 » est un invariant, et conclus sur la correction.
4. Que renvoie la fonction pour `n = 0` ? Est-ce conforme à la spécification « liste des bits de l'écriture binaire » ?
   Propose une correction si nécessaire.

:::criteres
- Trace : `m` vaut 13, 6, 3, 1, puis 0 ; `bits` vaut [], [1], [1, 0], [1, 0, 1], [1, 0, 1, 1] ; la quantité vaut 13 à chaque ligne.
- Terminaison : `m` est un entier positif dans la boucle et `m // 2 < m` pour `m >= 1` ; le nombre de tours est le nombre de chiffres binaires de `n`, soit $\lfloor \log_2 n \rfloor + 1$.
- Initialisation : `bits = []`, `k = 0`, `m = n` : $n = n \times 2^0 + 0$.
- Conservation : avec `m = 2q + b` (b = m % 2), après le tour $m' \times 2^{k+1} + \sum_{i \le k} \text{bits}[i] 2^i = q \, 2^{k+1} + b\, 2^k + \sum_{i<k} \dots = m \, 2^k + \sum_{i<k} \dots = n$.
- Conclusion : à la sortie `m = 0`, donc $n = \sum \text{bits}[i] 2^i$ avec des bits 0 ou 1 : c'est l'écriture binaire (le dernier bit ajouté vaut 1 car il vient de `m = 1`, donc pas de zéro de tête).
- Cas `n = 0` : la fonction renvoie `[]` ; selon la convention, on attend `[0]` : on traite ce cas à part.
:::

:::corrige
1. | tour   | `m` | `bits`        | $k$ | valeur |
   |--------|-----|---------------|-----|--------|
   | 1      | 13  | `[]`          | 0   | $13 \cdot 1 = 13$ |
   | 2      | 6   | `[1]`         | 1   | $6 \cdot 2 + 1 = 13$ |
   | 3      | 3   | `[1, 0]`      | 2   | $3 \cdot 4 + 1 = 13$ |
   | 4      | 1   | `[1, 0, 1]`   | 3   | $1 \cdot 8 + 1 + 4 = 13$ |
   | sortie | 0   | `[1, 0, 1, 1]`| 4   | $0 + 1 + 4 + 8 = 13$ |

   La fonction renvoie `[1, 0, 1, 1]` : $13 = 1101_2$ lu de droite à gauche.
2. **Terminaison** : `m` est un entier, strictement positif dans la boucle, et pour $m \ge 1$, $m /\!/ 2 < m$ :
   c'est un variant. **Nombre de tours** : si $2^{p} \le n < 2^{p+1}$, alors après $j$ tours $m = \lfloor n / 2^j \rfloor$,
   qui vaut 0 pour la première fois quand $j = p + 1$. Il y a donc $p + 1 = \lfloor \log_2 n \rfloor + 1$ tours :
   le nombre de chiffres binaires de `n`.
3. **Initialisation** : `bits = []` ($k = 0$, somme vide) et `m = n` : $n = n \times 2^0 + 0$. ✓
   **Conservation** : au début d'un tour, supposons $n = m \, 2^k + S$ avec $S = \sum_{i<k} \text{bits}[i] 2^i$.
   Écrivons $m = 2q + b$ avec $b = m \% 2 \in \{0, 1\}$. Le tour ajoute $b$ en position $k$ et remplace $m$ par $q$ :
   $q \, 2^{k+1} + (S + b\, 2^k) = (2q + b)\, 2^k + S = m\, 2^k + S = n$, et le nouveau bit vaut 0 ou 1. ✓
   **Conclusion** : à la sortie, $m = 0$ (entier positif ou nul qui n'est pas $> 0$), donc
   $n = \sum_{i=0}^{k-1} \text{bits}[i]\, 2^i$ avec des bits dans $\{0, 1\}$. De plus le dernier bit ajouté provient de
   $m = 1$ (seul cas où $m /\!/ 2 = 0$ avec $m > 0$), il vaut donc 1 : pas de zéro inutile en tête. C'est bien
   l'écriture binaire de `n`, du poids faible au poids fort.
4. Pour `n = 0`, la boucle ne fait aucun tour et la fonction renvoie `[]`. L'invariant reste vrai (somme vide = 0),
   mais l'écriture binaire de 0 s'écrit habituellement « 0 » : on ajoute `if n == 0: return [0]` en début de fonction
   (ou on l'indique dans la spécification).
:::
::::
