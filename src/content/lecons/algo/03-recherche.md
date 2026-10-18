---
titre: Recherche séquentielle et dichotomique
resume: Chercher un élément dans une liste, en la parcourant ou, si elle est triée, en divisant par deux la zone de recherche à chaque étape.
duree: 70
objectifs:
  - Écrire une recherche séquentielle et une recherche dichotomique, itérative et récursive
  - Prouver la correction et la terminaison de la recherche dichotomique
  - Justifier son coût logarithmique et le comparer à la recherche séquentielle
  - Adapter la dichotomie (première occurrence, position d'insertion, recherche sur une réponse)
prerequis: [algo/preuve, python/listes]
programme: [asd-recherche-tris, asd-iter-rec, asd-preuve, asd-cout, nsi1-algo]
cartes:
  - q: Condition pour appliquer une recherche dichotomique ?
    r: "La liste doit être **triée** (et l'accès à un indice doit se faire en temps constant)."
  - q: Nombre maximal de tours de la recherche dichotomique dans une liste de taille `n` ?
    r: "$\\lfloor \\log_2 n \\rfloor + 1$ : environ 20 pour un million d'éléments."
  - q: Invariant de la recherche dichotomique (indices `g` et `d` inclus) ?
    r: "Si `x` est dans `t`, alors il est dans `t[g..d]` (et les éléments hors de cette zone ne valent pas `x`)."
  - q: Variant de la recherche dichotomique ?
    r: "`d - g + 1`, la taille de la zone de recherche : entier positif, au moins divisé par 2 à chaque tour."
  - q: Erreur classique qui rend la dichotomie infinie ?
    r: "Écrire `g = m` (au lieu de `m + 1`) ou `d = m` (au lieu de `m - 1`) avec des bornes incluses : la zone peut ne plus rétrécir."
  - q: Que renvoie `bisect.bisect_left(t, x)` ?
    r: "La première position où insérer `x` en gardant `t` trié, c'est-à-dire le premier indice `i` tel que `t[i] >= x` (ou `len(t)`)."
  - q: Coût de la recherche séquentielle au pire ? De la dichotomie ?
    r: "$\\Theta(n)$ et $\\Theta(\\log n)$ comparaisons."
---

Chercher un mot dans un dictionnaire papier : personne ne lit les pages une à une. On ouvre au milieu, on regarde si
le mot est avant ou après, et on recommence dans la bonne moitié. En dix ouvertures, on trouve un mot parmi mille
pages. Cette idée, la **recherche dichotomique**, est l'un des algorithmes les plus importants (et les plus demandés
aux épreuves) ; elle ne marche que parce que le dictionnaire est **trié**. On commence par la méthode naïve.

## 1. La recherche séquentielle

Sans aucune hypothèse sur la liste, on examine les éléments un par un :

```python exec
def recherche_sequentielle(t, x):
    """Indice de la première occurrence de x dans t, ou -1."""
    for i in range(len(t)):
        if t[i] == x:
            return i
    return -1

print(recherche_sequentielle([7, 3, 9, 3], 3), recherche_sequentielle([7, 3, 9], 5))
```

Coût en comparaisons : **1** au mieux (`x` en tête), **n** au pire (`x` absent ou à la fin) : $\Theta(n)$.
Invariant : au début du tour `i`, `x` n'est pas dans `t[0..i-1]`. On ne peut pas faire mieux sur une liste quelconque :
tant qu'un élément n'a pas été regardé, `x` pourrait être là.

## 2. L'idée de la dichotomie

Si la liste est **triée par ordre croissant**, comparer `x` à l'élément du **milieu** `t[m]` permet d'éliminer d'un
coup la moitié de la zone :

- si `t[m] == x`, on a trouvé ;
- si `t[m] < x`, tous les éléments d'indice `<= m` sont `< x` : on continue **à droite** de `m` ;
- si `t[m] > x`, on continue **à gauche** de `m`.

On maintient deux indices `g` (gauche) et `d` (droite) qui délimitent la zone où `x` peut encore se trouver.

```mermaid legende="Une étape de dichotomie : on garde la moitié qui peut contenir x"
graph TD
  A["zone t[g..d], milieu m = (g + d) // 2"] --> B{"comparer t[m] et x"}
  B -- "t[m] == x" --> C["trouvé : renvoyer m"]
  B -- "t[m] < x" --> D["g = m + 1<br/>(on garde la droite)"]
  B -- "t[m] > x" --> E["d = m - 1<br/>(on garde la gauche)"]
  D --> F{"g <= d ?"}
  E --> F
  F -- oui --> A
  F -- non --> G["zone vide : renvoyer -1"]
```

## 3. L'algorithme

```python exec
def dichotomie(t, x):
    """t est triée par ordre croissant. Renvoie un indice de x dans t, ou -1."""
    g, d = 0, len(t) - 1
    while g <= d:
        m = (g + d) // 2
        if t[m] == x:
            return m
        elif t[m] < x:
            g = m + 1
        else:
            d = m - 1
    return -1

t = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
print(dichotomie(t, 23), dichotomie(t, 2), dichotomie(t, 91), dichotomie(t, 50))
```

Trace de la recherche de 23 dans la liste ci-dessus (10 éléments) :

| tour | `g` | `d` | `m` | `t[m]` | décision        |
|------|-----|-----|-----|--------|-----------------|
| 1    | 0   | 9   | 4   | 16     | 16 < 23 → `g = 5` |
| 2    | 5   | 9   | 7   | 56     | 56 > 23 → `d = 6` |
| 3    | 5   | 6   | 5   | 23     | trouvé : 5      |

Et de 50 (absent) : `m = 4` (16) → `g = 5` ; `m = 7` (56) → `d = 6` ; `m = 5` (23) → `g = 6` ; `m = 6` (38) →
`g = 7` ; alors `g > d` : on renvoie -1 après 4 comparaisons au lieu de 10.

## 4. Preuve et coût

**Correction.** Invariant $\mathcal I$ : « si `x` apparaît dans `t`, alors il apparaît dans `t[g..d]` ».
- *Initialisation* : `g = 0`, `d = n - 1`, la zone est toute la liste.
- *Conservation* : si `t[m] < x`, comme `t` est triée, tous les `t[k]` pour `k <= m` sont `<= t[m] < x` : aucun ne vaut
  `x`, donc s'il est dans `t[g..d]`, il est dans `t[m+1..d]`. Symétrique si `t[m] > x`. (Si `t[m] == x`, on renvoie `m`,
  qui est correct.)
- *Conclusion* : si la boucle se termine sans avoir trouvé, `g > d`, la zone `t[g..d]` est vide ; d'après l'invariant,
  `x` n'est pas dans `t` : renvoyer -1 est correct.

**Terminaison.** Variant : la taille de la zone $T = d - g + 1$. C'est un entier, positif dans la boucle ($g \le d$).
À chaque tour sans succès, la nouvelle zone est `t[g..m-1]` ou `t[m+1..d]`, de taille au plus $\lfloor T/2 \rfloor < T$.

**Coût.** La taille de la zone est au moins divisée par 2 à chaque tour : après $k$ tours, elle vaut au plus
$n / 2^k$. Elle devient nulle après au plus $\lfloor \log_2 n \rfloor + 1$ tours. Le coût dans le pire cas est donc
$\Theta(\log n)$ comparaisons (et 1 au mieux, si `x` est au premier milieu).

| `n`            | 10 | 1 000 | 1 000 000 | 1 000 000 000 |
|----------------|----|-------|-----------|---------------|
| séquentielle (pire) | 10 | 1 000 | 1 000 000 | 1 000 000 000 |
| dichotomie (pire)   | 4  | 10    | 20        | 30            |

:::attention
La dichotomie exige une liste **triée**. Trier coûte $\Theta(n \log n)$ : pour **une seule** recherche, la recherche
séquentielle ($\Theta(n)$) est moins chère. Trier une fois puis faire de nombreuses recherches dichotomiques devient
rentable dès qu'on cherche souvent.
:::

### Version récursive

```python exec
def dichotomie_rec(t, x, g, d):
    """Cherche x dans t[g..d] (bornes incluses)."""
    if g > d:
        return -1
    m = (g + d) // 2
    if t[m] == x:
        return m
    if t[m] < x:
        return dichotomie_rec(t, x, m + 1, d)
    return dichotomie_rec(t, x, g, m - 1)

t = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
print(dichotomie_rec(t, 72, 0, len(t) - 1))
```

C'est un premier exemple de **diviser pour régner** : on ramène le problème à un seul sous-problème de taille moitié.
On évite d'écrire `dichotomie_rec(t[m+1:], x)` : la tranche **copie** la moitié de la liste, ce qui coûte $\Theta(n)$
et ruine le coût logarithmique.

## 5. Variantes utiles

**Première occurrence / position d'insertion.** Avec des doublons, la version précédente renvoie *un* indice de `x`,
pas forcément le premier. Pour trouver le **premier indice `i` tel que `t[i] >= x`** (la position où insérer `x`), on
travaille avec une zone **semi-ouverte** `[g, d[` :

```python exec
def position_insertion(t, x):
    """Premier indice i tel que t[i] >= x (len(t) si aucun). t triée."""
    g, d = 0, len(t)
    while g < d:
        m = (g + d) // 2
        if t[m] < x:
            g = m + 1
        else:
            d = m
    return g

t = [1, 3, 3, 3, 7, 9]
print(position_insertion(t, 3), position_insertion(t, 4), position_insertion(t, 10), position_insertion(t, 0))

import bisect
print(bisect.bisect_left(t, 3), bisect.bisect_right(t, 3))
```

Ici `d = m` est correct car `d` est **exclu** de la zone et `m < d` ; la zone rétrécit donc toujours. Le module
`bisect` de Python fournit `bisect_left` (la même fonction) et `bisect_right`.

**Dichotomie sur la réponse.** Le principe s'applique dès qu'une propriété est « fausse puis vraie » le long d'un
intervalle d'entiers. Exemple : la racine carrée entière de `n` est le plus grand `r` tel que $r^2 \le n$.

:::prof
La dichotomie est au programme de première NSI, avec la justification de son coût. Le jeu « devine le nombre entre
1 et 100 » (réponses « plus grand / plus petit ») la fait découvrir sans ordinateur : les élèves trouvent seuls la
stratégie optimale et constatent qu'il ne faut jamais plus de 7 essais ($2^7 = 128$). Les erreurs de bornes
(`<` ou `<=`, `m` ou `m + 1`) sont la principale difficulté : faire tracer les cas « absent, plus petit que tout,
plus grand que tout ».
:::

## Exemple guidé

**Problème.** Écrire `racine_entiere(n)` qui renvoie $\lfloor \sqrt n \rfloor$ pour un entier $n \ge 0$, sans
utiliser de flottants, en temps $O(\log n)$. Justifier.

**1. Reformuler.** On cherche le plus grand entier `r` de $[0, n]$ tel que $r^2 \le n$. La propriété « $r^2 \le n$ »
est vraie pour $r = 0$, puis vraie jusqu'à un certain rang, puis fausse : on peut chercher la frontière par dichotomie.

**2. Choisir l'invariant.** On maintient `g` et `d` avec : $g^2 \le n$ et $(d + 1)^2 > n$ (la réponse est dans `[g, d]`).

```python exec
def racine_entiere(n):
    g, d = 0, n
    while g < d:
        m = (g + d + 1) // 2      # milieu arrondi vers le haut
        if m * m <= n:
            g = m                  # m est une réponse possible : la réponse est >= m
        else:
            d = m - 1              # m est trop grand
    return g

print([racine_entiere(n) for n in [0, 1, 2, 3, 4, 15, 16, 17, 10**12]])
```

**3. Justifier.**
- *Initialisation* : $0^2 \le n$ et $(n + 1)^2 > n$.
- *Conservation* : si $m^2 \le n$, `g = m` conserve $g^2 \le n$ ; sinon `d = m - 1` conserve $(d + 1)^2 = m^2 > n$.
- *Conclusion* : à la sortie `g == d`, donc $g^2 \le n < (g + 1)^2$ : $g = \lfloor \sqrt n \rfloor$.
- *Terminaison* : le milieu est arrondi **vers le haut** ($m > g$ dès que $g < d$), donc dans les deux cas $d - g$
  diminue strictement. Avec l'arrondi vers le bas, pour `g = 2, d = 3`, on aurait `m = 2` et `g = m` ne changerait
  rien : boucle infinie. C'est le piège classique.
- *Coût* : la zone est divisée par 2 à chaque tour : environ $\log_2 n$ tours, soit 40 tours pour $n = 10^{12}$.

## L'essentiel

- Recherche séquentielle : toute liste, $\Theta(n)$ au pire, invariant « `x` n'est pas dans `t[0..i-1]` ».
- Dichotomie : liste **triée** ; on compare au milieu et on garde la bonne moitié ; $\Theta(\log n)$ au pire
  ($\lfloor \log_2 n \rfloor + 1$ tours).
- Invariant : « si `x` est dans `t`, il est dans `t[g..d]` » ; variant : `d - g + 1`.
- Bornes incluses : `while g <= d`, `g = m + 1`, `d = m - 1`. Bornes semi-ouvertes : `while g < d`, `g = m + 1`, `d = m`.
- Version récursive : passer les bornes, ne pas copier de tranches.
- Variantes : première occurrence / position d'insertion (`bisect`), dichotomie sur la réponse.

## Exercices

::::exercice[Nombre de comparaisons]{niveau=1}
Combien de tours de boucle fait au plus la recherche dichotomique dans une liste triée de 1 000 éléments ?

- [ ] 500
- [ ] 100
- [x] 10
- [ ] 1 000

:::corrige
$2^9 = 512 \le 1000 < 1024 = 2^{10}$ : au plus $\lfloor \log_2 1000 \rfloor + 1 = 10$ tours.
:::
::::

::::exercice[Suivre la dichotomie]{niveau=1}
On cherche 7 dans `t = [1, 3, 4, 7, 9, 11, 15]` avec la fonction `dichotomie` du cours. Quelles sont les valeurs
successives de `m` ?

- [ ] 3
- [x] 3 seulement : on trouve 7 au premier tour
- [ ] 3, 1, 2
- [ ] 3, 5, 4

:::corrige
`g = 0`, `d = 6`, `m = 3` et `t[3] = 7` : trouvé dès le premier tour (c'est le meilleur cas).
:::
::::

::::exercice[Écrire la recherche dichotomique]{niveau=2}
Écris `dichotomie(t, x)` pour une liste triée par ordre croissant : elle renvoie un indice de `x`, ou -1 s'il est absent.
Elle doit faire au plus $\lfloor \log_2 n \rfloor + 1$ tours.

```python depart
def dichotomie(t, x):
    ...
```

```python tests
t = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
assert dichotomie(t, 23) == 5, "au milieu"
assert dichotomie(t, 2) == 0, "en première position"
assert dichotomie(t, 91) == 9, "en dernière position"
assert dichotomie(t, 50) == -1, "absent, entre deux valeurs"
assert dichotomie(t, 1) == -1, "plus petit que tout"
assert dichotomie(t, 100) == -1, "plus grand que tout"
assert dichotomie([], 3) == -1, "liste vide"
assert dichotomie([4], 4) == 0, "un seul élément"
```

:::corrige
```python solution
def dichotomie(t, x):
    g, d = 0, len(t) - 1
    while g <= d:
        m = (g + d) // 2
        if t[m] == x:
            return m
        elif t[m] < x:
            g = m + 1
        else:
            d = m - 1
    return -1
```
Les tests aux extrémités (premier, dernier, plus petit, plus grand que tout) et la liste vide sont ceux qui révèlent
les erreurs de bornes.
:::
::::

::::exercice[Racine carrée entière]{niveau=2}
Écris `racine_entiere(n)` qui renvoie $\lfloor \sqrt{n} \rfloor$ pour un entier `n >= 0`, par dichotomie, sans flottants
(n'utilise ni `**0.5`, ni `math.sqrt`, ni `math.isqrt`).

```python depart
def racine_entiere(n):
    ...
```

```python tests
assert racine_entiere(0) == 0, "0"
assert racine_entiere(1) == 1, "1"
assert racine_entiere(15) == 3, "15"
assert racine_entiere(16) == 4, "carré parfait"
assert racine_entiere(17) == 4, "juste après un carré"
assert racine_entiere(10**18) == 10**9, "très grand nombre"
assert racine_entiere(10**18 - 1) == 10**9 - 1, "très grand, juste avant un carré"
```

:::corrige
```python solution
def racine_entiere(n):
    g, d = 0, n
    while g < d:
        m = (g + d + 1) // 2
        if m * m <= n:
            g = m
        else:
            d = m - 1
    return g
```
Voir l'exemple guidé pour la preuve. Les flottants seraient faux pour $10^{18} - 1$ : la racine flottante arrondie
donne $10^9$, alors que la bonne réponse est $10^9 - 1$.
:::
::::

::::exercice[Première occurrence]{niveau=3}
Écris `premiere_occurrence(t, x)` qui renvoie l'indice de la **première** occurrence de `x` dans la liste triée `t`
(qui peut contenir des doublons), ou -1, en $O(\log n)$.

```python depart
def premiere_occurrence(t, x):
    ...
```

```python tests
assert premiere_occurrence([1, 3, 3, 3, 7], 3) == 1, "doublons"
assert premiere_occurrence([3, 3, 3], 3) == 0, "uniquement des doublons"
assert premiere_occurrence([1, 2, 4], 3) == -1, "absent"
assert premiere_occurrence([], 3) == -1, "liste vide"
assert premiere_occurrence([1, 2, 3], 3) == 2, "en dernière position"
assert premiere_occurrence([5] * 1000 + [6], 5) == 0, "beaucoup de doublons"
```

:::indice
Calcule d'abord la position d'insertion « premier indice `i` tel que `t[i] >= x` », puis vérifie si `t[i] == x`.
:::

:::corrige
```python solution
def premiere_occurrence(t, x):
    g, d = 0, len(t)
    while g < d:
        m = (g + d) // 2
        if t[m] < x:
            g = m + 1
        else:
            d = m
    if g < len(t) and t[g] == x:
        return g
    return -1
```
Invariant : tous les éléments d'indice `< g` sont `< x`, et tous ceux d'indice `>= d` sont `>= x`. À la sortie `g == d`
est la première position où `t[i] >= x`. La version « je trouve un `x` puis je recule » serait linéaire dans le pire
cas (le test avec 1000 doublons).
:::
::::

::::exercice[Compter en temps logarithmique]{niveau=3}
Écris `nb_occurrences(t, x)` qui compte les occurrences de `x` dans la liste triée `t` en $O(\log n)$. Tu peux utiliser
le module `bisect`.

```python depart
import bisect

def nb_occurrences(t, x):
    ...
```

```python tests
assert nb_occurrences([1, 3, 3, 3, 7], 3) == 3, "trois occurrences"
assert nb_occurrences([1, 3, 7], 4) == 0, "absent"
assert nb_occurrences([], 1) == 0, "vide"
assert nb_occurrences([2] * 500, 2) == 500, "tous égaux"
```

:::corrige
```python solution
import bisect

def nb_occurrences(t, x):
    return bisect.bisect_right(t, x) - bisect.bisect_left(t, x)
```
`bisect_left` donne le premier indice où `t[i] >= x`, `bisect_right` le premier où `t[i] > x` : les occurrences de `x`
sont exactement entre les deux. Deux dichotomies : $O(\log n)$.
:::
::::

::::exercice[Une dichotomie qui ne termine pas]{niveau=3}
Un élève a écrit cette version. Trouve une entrée pour laquelle elle ne s'arrête jamais, explique pourquoi, et corrige-la.

```python
def dichotomie(t, x):
    g, d = 0, len(t) - 1
    while g <= d:
        m = (g + d) // 2
        if t[m] == x:
            return m
        elif t[m] < x:
            g = m
        else:
            d = m
    return -1
```

:::criteres
- Une entrée concrète est donnée, par exemple `dichotomie([1, 3], 5)` (ou toute recherche d'un élément absent).
- Trace : `g = 0, d = 1, m = 0`, `t[0] < 5` donc `g = 0` : l'état ne change plus, boucle infinie.
- Explication : avec `g = m` ou `d = m`, la zone de recherche ne rétrécit pas toujours (en particulier quand `g == d` ou `d == g + 1`) ; le variant `d - g + 1` ne décroît pas.
- Correction : `g = m + 1` et `d = m - 1` (bornes incluses).
:::

:::corrige
Avec `t = [1, 3]` et `x = 5` : `g = 0`, `d = 1`, `m = 0`, `t[0] = 1 < 5` donc `g = m = 0`. L'état n'a pas changé :
la boucle tourne indéfiniment. Même chose pour `x = 0` dès que `g == d` (`d = m = d`). Le problème : `t[m]` vient d'être
comparé et ne vaut pas `x`, mais on le garde dans la zone ; quand `m == g`, rien ne bouge. Le variant `d - g + 1` ne
décroît pas strictement.

Correction : exclure `m` de la nouvelle zone, `g = m + 1` et `d = m - 1`. Alors la taille de la zone diminue au moins
de 1 à chaque tour (et est en fait au moins divisée par 2).
:::
::::

::::exercice[Coût exact de la dichotomie]{niveau=4 duree=20}
On note $C(n)$ le nombre maximal de tours de la boucle de `dichotomie` (version du cours, bornes incluses) pour une liste
triée de taille $n$.

1. Montre que si la zone a une taille $T \ge 1$ au début d'un tour sans succès, la zone suivante a une taille au plus
   $\lfloor T / 2 \rfloor$. (Distingue $T$ pair et $T$ impair.)
2. En déduire que $C(n) \le \lfloor \log_2 n \rfloor + 1$ pour $n \ge 1$.
3. Montre que cette borne est atteinte : donne, pour $n = 7$ puis pour $n = 8$, une valeur cherchée qui provoque le
   nombre maximal de tours.
4. Combien de tours au plus pour un annuaire de 60 millions de noms ?

:::criteres
- Q1 : avec `m = (g + d) // 2`, la partie gauche a `m - g` éléments et la droite `d - m` ; pour $T$ impair les deux ont $(T-1)/2$ éléments, pour $T$ pair elles ont $T/2 - 1$ et $T/2$ ; donc au plus $\lfloor T/2 \rfloor$.
- Q2 : après $k$ tours sans succès, la taille est au plus $\lfloor n / 2^k \rfloor$ ; elle est nulle dès que $2^k > n$, c'est-à-dire pour $k = \lfloor \log_2 n \rfloor + 1$ ; la boucle fait donc au plus ce nombre de tours.
- Q3 : pour $n = 7$, chercher un élément absent plus grand que tout donne les zones 7, 3, 1 : 3 tours $= \lfloor \log_2 7 \rfloor + 1$ ; pour $n = 8$, chercher une valeur plus grande que tout donne les zones 8, 4, 2, 1 : 4 tours $= \lfloor \log_2 8 \rfloor + 1$.
- Q4 : $2^{25} < 6 \times 10^7 < 2^{26}$, donc au plus 26 tours.
:::

:::corrige
1. La zone `t[g..d]` a $T = d - g + 1$ éléments et `m = (g + d) // 2`. À gauche de `m` il reste $m - g$ éléments, à
   droite $d - m$. Si $T$ est impair, $g + d$ est pair, `m` est exactement au milieu : $m - g = d - m = (T - 1)/2$.
   Si $T$ est pair, $m - g = T/2 - 1$ et $d - m = T/2$. Dans tous les cas, la nouvelle zone a au plus
   $\lfloor T/2 \rfloor$ éléments.
2. Par récurrence, après $k$ tours sans succès, la zone a au plus $\lfloor n / 2^k \rfloor$ éléments (on utilise
   $\lfloor \lfloor a/2 \rfloor / 2 \rfloor = \lfloor a/4 \rfloor$). Soit $p = \lfloor \log_2 n \rfloor$, donc
   $2^p \le n < 2^{p+1}$. Après $p + 1$ tours, la taille est au plus $\lfloor n / 2^{p+1} \rfloor = 0$ : la boucle
   s'arrête. Il y a donc au plus $p + 1 = \lfloor \log_2 n \rfloor + 1$ tours.
3. $n = 7$, on cherche 100 dans `[1, 2, 3, 4, 5, 6, 7]` : zones de tailles 7 (m = 3), 3 (m = 5), 1 (m = 6), puis vide :
   **3** tours $= \lfloor \log_2 7 \rfloor + 1$. $n = 8$, on cherche 100 dans `[1, …, 8]` : zones 8 (m = 3), 4 (m = 5),
   2 (m = 6), 1 (m = 7), puis vide : **4** tours $= \lfloor \log_2 8 \rfloor + 1$. La borne est atteinte.
4. $2^{25} = 33\,554\,432 \le 6 \times 10^7 < 2^{26} = 67\,108\,864$ : au plus $25 + 1 = $ **26** tours.
:::
::::
