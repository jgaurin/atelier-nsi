---
titre: Diviser pour régner
resume: Découper un problème en sous-problèmes indépendants plus petits, les résoudre récursivement et combiner leurs solutions — tri fusion, tri rapide et calcul du coût.
duree: 85
objectifs:
  - Reconnaître les trois étapes diviser, régner, combiner dans un algorithme
  - Écrire le tri fusion et le tri rapide, et expliquer leurs différences (coût, mémoire, stabilité)
  - Calculer le coût d'un algorithme « diviser pour régner » avec un arbre de récursion
  - Appliquer le théorème maître simplifié aux récurrences de la forme $C(n) = a\,C(n/b) + n^d$
prerequis: [algo/recursivite, algo/tris-simples]
programme: [asd-dpr, asd-recherche-tris, asd-iter-rec, asd-cout, nsit-algo]
cartes:
  - q: Les trois étapes de « diviser pour régner » ?
    r: "**Diviser** le problème en sous-problèmes plus petits et indépendants, **régner** (les résoudre récursivement), **combiner** leurs solutions."
  - q: Coût de la fusion de deux listes triées de tailles `p` et `q` ?
    r: "Au plus $p + q - 1$ comparaisons : linéaire."
  - q: Relation de récurrence et coût du tri fusion ?
    r: "$C(n) = 2\\,C(n/2) + \\Theta(n)$, donc $C(n) = \\Theta(n \\log n)$ dans tous les cas."
  - q: Coût du tri rapide ?
    r: "$\\Theta(n \\log n)$ en moyenne (et si les pivots coupent en deux), $\\Theta(n^2)$ au pire (pivot toujours extrême, par exemple liste déjà triée avec le premier élément comme pivot)."
  - q: "Tri fusion ou tri rapide : lequel est en place ? lequel est stable ?"
    r: "Le tri rapide (partition) est en place mais pas stable ; le tri fusion est stable mais utilise une mémoire supplémentaire en $\\Theta(n)$."
  - q: Théorème maître simplifié pour $C(n) = a\\,C(n/b) + \\Theta(n^d)$ ?
    r: "Si $a < b^d$ : $\\Theta(n^d)$ ; si $a = b^d$ : $\\Theta(n^d \\log n)$ ; si $a > b^d$ : $\\Theta(n^{\\log_b a})$."
  - q: Qui a proposé le tri fusion ? Le tri rapide ?
    r: "John von Neumann (1945) ; Tony Hoare (1960)."
---

Trier un million de nombres avec un tri par insertion demande de l'ordre de $5 \times 10^{11}$ comparaisons : des heures.
Le **tri fusion** en fait environ $2 \times 10^7$ : moins d'une seconde. Le secret : au lieu d'insérer les éléments un à
un, on **coupe** la liste en deux, on trie chaque moitié (récursivement), et on **fusionne** les deux moitiés triées.
Cette stratégie, **diviser pour régner**, est au programme de terminale et au cœur du sujet zéro de l'oral 1, qui demande
de comparer tri par insertion, tri fusion et tri rapide.

## 1. Le principe

:::definition
Un algorithme **diviser pour régner** procède en trois étapes :
1. **Diviser** : découper le problème en sous-problèmes **plus petits** et **indépendants** (de même nature) ;
2. **Régner** : résoudre chaque sous-problème, récursivement (ou directement s'il est assez petit) ;
3. **Combiner** : construire la solution du problème à partir des solutions des sous-problèmes.
:::

On l'a déjà rencontré : la **recherche dichotomique** (un seul sous-problème de taille moitié, combinaison immédiate),
l'**exponentiation rapide** ($x^n$ à partir de $x^{n/2}$), le maximum par moitiés. L'efficacité vient de ce que la taille
des sous-problèmes **diminue géométriquement** : on atteint les cas de base en $\log n$ niveaux.

## 2. Le tri fusion

**Combiner : fusionner deux listes triées.** On compare les premiers éléments restants des deux listes, on prend le
plus petit, et on recommence. Chaque comparaison place un élément : au plus $p + q - 1$ comparaisons.

```python exec
def fusion(a, b):
    """Fusionne deux listes triées en une nouvelle liste triée."""
    resultat = []
    i = j = 0
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:          # <= : à égalité, on prend d'abord dans a (stabilité)
            resultat.append(a[i])
            i += 1
        else:
            resultat.append(b[j])
            j += 1
    resultat.extend(a[i:])        # l'une des deux listes est épuisée :
    resultat.extend(b[j:])        # on recopie le reste de l'autre
    return resultat

print(fusion([1, 4, 9, 12], [2, 3, 10]))
```

**Le tri.** Une liste de 0 ou 1 élément est triée (cas de base). Sinon, on la coupe en deux moitiés, on trie chacune
récursivement, et on fusionne.

```python exec
def tri_fusion(t):
    if len(t) <= 1:
        return t
    milieu = len(t) // 2
    gauche = tri_fusion(t[:milieu])
    droite = tri_fusion(t[milieu:])
    return fusion(gauche, droite)

def fusion(a, b):
    resultat, i, j = [], 0, 0
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            resultat.append(a[i]); i += 1
        else:
            resultat.append(b[j]); j += 1
    return resultat + a[i:] + b[j:]

print(tri_fusion([38, 27, 43, 3, 9, 82, 10]))
```

```mermaid legende="Tri fusion de [38, 27, 43, 3, 9, 82, 10] : on divise jusqu'aux listes d'un élément, puis on fusionne en remontant"
graph TD
  A["[38, 27, 43, 3, 9, 82, 10]"] --> B["[38, 27, 43]"]
  A --> C["[3, 9, 82, 10]"]
  B --> D["[38]"]
  B --> E["[27, 43]"]
  E --> F["[27]"]
  E --> G["[43]"]
  C --> H["[3, 9]"]
  C --> I["[82, 10]"]
  H --> J["[3]"]
  H --> K["[9]"]
  I --> L["[82]"]
  I --> M["[10]"]
  F -.-> N["[27, 43]"]
  G -.-> N
  D -.-> O["[27, 38, 43]"]
  N -.-> O
  J -.-> P["[3, 9]"]
  K -.-> P
  L -.-> Q["[10, 82]"]
  M -.-> Q
  P -.-> R["[3, 9, 10, 82]"]
  Q -.-> R
  O -.-> S["[3, 9, 10, 27, 38, 43, 82]"]
  R -.-> S
```

**Correction** (récurrence forte sur la taille) : une liste de taille ≤ 1 est triée ; sinon, par hypothèse de
récurrence, `gauche` et `droite` sont les deux moitiés triées, et la fusion de deux listes triées est triée et contient
tous leurs éléments.

**Coût.** Soit $C(n)$ le nombre de comparaisons. Diviser coûte une copie linéaire, fusionner au plus $n - 1$
comparaisons : $C(n) = 2\,C(n/2) + n$ (en majorant, pour $n$ puissance de 2). L'**arbre de récursion** a $\log_2 n$
niveaux ; à chaque niveau, les fusions portent en tout sur $n$ éléments, donc coûtent au plus $n$. Total :
$n \log_2 n$.

```mermaid legende="Arbre de récursion du tri fusion : log₂ n niveaux, coût n par niveau"
graph TD
  A["niveau 0 : 1 fusion de taille n → coût n"] --> B["niveau 1 : 2 fusions de taille n/2 → coût n"]
  B --> C["niveau 2 : 4 fusions de taille n/4 → coût n"]
  C --> D["…"]
  D --> E["niveau log₂ n : n listes d'un élément"]
```

Le tri fusion est en $\Theta(n \log n)$ **dans tous les cas**, il est **stable** (grâce au `<=`), mais il utilise une
**mémoire supplémentaire** proportionnelle à $n$ (les listes intermédiaires).

## 3. Le tri rapide

Le tri rapide (*quicksort*) fait le travail **avant** les appels récursifs, et non après : on choisit un **pivot**, on
**partitionne** la liste en « plus petits que le pivot » et « plus grands », puis on trie récursivement chaque partie.
Il n'y a rien à combiner : les parties sont déjà à leur place l'une par rapport à l'autre.

```python exec
def tri_rapide(t):
    """Version lisible (pas en place) : renvoie une nouvelle liste triée."""
    if len(t) <= 1:
        return t
    pivot = t[0]
    petits = [x for x in t[1:] if x < pivot]
    grands = [x for x in t[1:] if x >= pivot]
    return tri_rapide(petits) + [pivot] + tri_rapide(grands)

print(tri_rapide([38, 27, 43, 3, 9, 82, 10]))
```

La version **en place** utilise une procédure de **partition** qui réorganise `t[g..d]` autour du pivot par échanges
(ici, partition de Lomuto avec le dernier élément comme pivot) :

```python exec
def partition(t, g, d):
    """Réorganise t[g..d] autour du pivot t[d] ; renvoie la position finale du pivot."""
    pivot = t[d]
    i = g                       # t[g..i-1] contient les éléments < pivot
    for j in range(g, d):
        if t[j] < pivot:
            t[i], t[j] = t[j], t[i]
            i += 1
    t[i], t[d] = t[d], t[i]
    return i

def tri_rapide_en_place(t, g=0, d=None):
    if d is None:
        d = len(t) - 1
    if g < d:
        p = partition(t, g, d)
        tri_rapide_en_place(t, g, p - 1)
        tri_rapide_en_place(t, p + 1, d)

t = [38, 27, 43, 3, 9, 82, 10]
tri_rapide_en_place(t)
print(t)
```

**Coût.** La partition de `n` éléments fait $n - 1$ comparaisons. Tout dépend de l'équilibre des parties :
- **cas favorable** (le pivot coupe en deux moitiés) : $C(n) = 2\,C(n/2) + n$, donc $\Theta(n \log n)$ ;
- **pire cas** (le pivot est toujours le plus petit ou le plus grand, par exemple une liste **déjà triée** avec le
  premier ou le dernier élément comme pivot) : $C(n) = C(n - 1) + (n - 1)$, donc $\frac{n(n-1)}{2}$, $\Theta(n^2)$ ;
- **en moyenne** (sur toutes les permutations, ou avec un pivot choisi au hasard) : $\Theta(n \log n)$, environ
  $1{,}39\, n \log_2 n$ comparaisons.

En pratique, le tri rapide est souvent le plus rapide (en place, peu de mouvements, bonne utilisation du cache). Il
n'est **pas stable** (les échanges à distance mélangent les égaux), et sa profondeur de récursion peut atteindre `n`
au pire. On choisit le pivot au hasard (ou la médiane de trois éléments) pour éviter le pire cas sur les listes triées.

| Tri        | Meilleur      | Moyen         | Pire          | Mémoire en plus | Stable | En place |
|------------|---------------|---------------|---------------|-----------------|--------|----------|
| sélection  | $n^2$         | $n^2$         | $n^2$         | constante       | non    | oui      |
| insertion  | $n$           | $n^2$         | $n^2$         | constante       | oui    | oui      |
| fusion     | $n \log n$    | $n \log n$    | $n \log n$    | $n$             | oui    | non      |
| rapide     | $n \log n$    | $n \log n$    | $n^2$         | $\log n$ (pile) | non    | oui      |

## 4. Le coût des algorithmes « diviser pour régner »

Un algorithme qui découpe un problème de taille $n$ en $a$ sous-problèmes de taille $n/b$, avec un travail
$\Theta(n^d)$ pour diviser et combiner, a un coût qui vérifie

$$ C(n) = a\, C(n/b) + \Theta(n^d). $$

:::retenir[Théorème maître (version simplifiée)]
- si $a < b^d$ : $C(n) = \Theta(n^d)$ (le travail à la racine domine) ;
- si $a = b^d$ : $C(n) = \Theta(n^d \log n)$ (chaque niveau coûte autant) ;
- si $a > b^d$ : $C(n) = \Theta(n^{\log_b a})$ (les feuilles dominent).
:::

| Algorithme             | $a$ | $b$ | $d$ | Cas         | Coût |
|------------------------|-----|-----|-----|-------------|------|
| dichotomie             | 1   | 2   | 0   | $a = b^d$   | $\Theta(\log n)$ |
| tri fusion             | 2   | 2   | 1   | $a = b^d$   | $\Theta(n \log n)$ |
| maximum par moitiés    | 2   | 2   | 0   | $a > b^d$   | $\Theta(n)$ |
| Karatsuba (produit de grands nombres) | 3 | 2 | 1 | $a > b^d$ | $\Theta(n^{\log_2 3}) \approx \Theta(n^{1{,}585})$ |

Sans retenir le théorème, on peut toujours **dessiner l'arbre de récursion** : nombre de nœuds à chaque niveau × coût
d'un nœud, sommé sur les niveaux.

:::prof
« Diviser pour régner » est au programme de terminale NSI, avec le tri fusion comme exemple obligatoire. Une activité
débranchée efficace : trier un paquet de copies à plusieurs (chacun trie un petit tas, puis on fusionne deux à deux).
Pour l'oral 1 (sujet zéro sur les tris), il faut savoir **montrer** expérimentalement la non-stabilité du tri rapide et
la différence $n^2$ / $n \log n$, et expliquer le pire cas du tri rapide sur une liste déjà triée.
:::

## Exemple guidé

**Problème.** Compter les **inversions** d'une liste (couples `i < j` avec `t[i] > t[j]`) en $\Theta(n \log n)$, en
adaptant le tri fusion. (La double boucle naïve est en $\Theta(n^2)$.)

**1. Diviser.** Les inversions de `t` sont de trois sortes : celles dans la moitié gauche, celles dans la moitié droite,
et les inversions « croisées » (un élément à gauche, un à droite).

**2. Régner.** Les deux premières sortes se comptent récursivement (en triant chaque moitié au passage).

**3. Combiner.** Les deux moitiés étant **triées**, pendant la fusion, quand on prend un élément `b[j]` de la droite
alors qu'il reste `len(a) - i` éléments dans la gauche, ces éléments sont tous plus grands que `b[j]` et situés avant
lui : ce sont exactement `len(a) - i` inversions croisées.

```python exec
def tri_et_inversions(t):
    """Renvoie (liste triée, nombre d'inversions de t)."""
    if len(t) <= 1:
        return t, 0
    m = len(t) // 2
    a, inv_g = tri_et_inversions(t[:m])
    b, inv_d = tri_et_inversions(t[m:])
    resultat, i, j, croisees = [], 0, 0, 0
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            resultat.append(a[i]); i += 1
        else:
            resultat.append(b[j]); j += 1
            croisees += len(a) - i
    resultat += a[i:] + b[j:]
    return resultat, inv_g + inv_d + croisees

print(tri_et_inversions([5, 2, 4, 6, 1, 3]))
```

**4. Coût.** La fusion reste linéaire (le comptage ajoute une addition par élément pris à droite) :
$C(n) = 2\,C(n/2) + \Theta(n)$, donc $\Theta(n \log n)$. On retrouve les 9 inversions de la leçon sur les tris simples.

## L'essentiel

- Diviser pour régner : diviser en sous-problèmes indépendants plus petits, les résoudre récursivement, combiner.
- **Fusion** de deux listes triées : linéaire. **Tri fusion** : $\Theta(n \log n)$ toujours, stable, mémoire $\Theta(n)$.
- **Tri rapide** : pivot, partition, deux appels ; $\Theta(n \log n)$ en moyenne, $\Theta(n^2)$ au pire (liste triée avec pivot
  extrême) ; en place, non stable ; pivot aléatoire pour éviter le pire cas.
- Coût : $C(n) = a\,C(n/b) + n^d$ ; arbre de récursion ou théorème maître ($a$ comparé à $b^d$).
- Exemples : dichotomie $\log n$, tri fusion $n \log n$, Karatsuba $n^{\log_2 3}$.

## Exercices

::::exercice[Coût du tri fusion]{niveau=1}
Quel est le coût du tri fusion dans le pire cas, pour une liste de taille `n` ?

- [ ] $\Theta(n)$
- [x] $\Theta(n \log n)$
- [ ] $\Theta(n^2)$
- [ ] $\Theta(\log n)$

:::corrige
$C(n) = 2C(n/2) + \Theta(n)$ : $\log_2 n$ niveaux de coût $n$, soit $\Theta(n \log n)$, et ce dans **tous** les cas.
:::
::::

::::exercice[Reconnaître la méthode]{niveau=1}
Lesquels de ces algorithmes relèvent de « diviser pour régner » ?

- [x] la recherche dichotomique
- [x] le tri fusion
- [ ] le tri par sélection
- [x] l'exponentiation rapide ($x^n$ à partir de $x^{n/2}$)
- [ ] le calcul de la somme d'une liste par une boucle

:::corrige
Dichotomie, tri fusion et exponentiation rapide ramènent le problème à des sous-problèmes de taille divisée par 2.
Le tri par sélection réduit la taille de 1 à chaque étape (approche « incrémentale ») ; une boucle de somme n'a pas de
sous-problème récursif.
:::
::::

::::exercice[Fusionner deux listes triées]{niveau=2}
Écris `fusion(a, b)` qui renvoie une nouvelle liste triée contenant les éléments des listes triées `a` et `b`, en
temps linéaire (sans `sort` ni `sorted`).

```python depart
def fusion(a, b):
    ...
```

```python tests
assert fusion([1, 4, 9], [2, 3, 10]) == [1, 2, 3, 4, 9, 10], "cas courant"
assert fusion([], [1, 2]) == [1, 2], "a vide"
assert fusion([5], []) == [5], "b vide"
assert fusion([1, 1, 3], [1, 2]) == [1, 1, 1, 2, 3], "doublons"
assert fusion([7, 8], [1, 2]) == [1, 2, 7, 8], "b entièrement avant a"
```

:::corrige
```python solution
def fusion(a, b):
    resultat = []
    i = j = 0
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            resultat.append(a[i])
            i += 1
        else:
            resultat.append(b[j])
            j += 1
    resultat.extend(a[i:])
    resultat.extend(b[j:])
    return resultat
```
Oublier de recopier la fin de la liste non épuisée est l'erreur classique (tests « a vide », « b vide »).
:::
::::

::::exercice[Écrire le tri fusion]{niveau=2}
Écris `tri_fusion(t)` qui renvoie une nouvelle liste triée. Tu peux réécrire `fusion` dans ta réponse.

```python depart
def tri_fusion(t):
    ...
```

```python tests
assert tri_fusion([38, 27, 43, 3, 9, 82, 10]) == [3, 9, 10, 27, 38, 43, 82], "cas courant"
assert tri_fusion([]) == [], "vide"
assert tri_fusion([5]) == [5], "un élément"
assert tri_fusion([3, 1, 3, 1]) == [1, 1, 3, 3], "doublons"
import random
random.seed(1)
grande = [random.randint(0, 1000) for _ in range(2000)]
assert tri_fusion(grande) == sorted(grande), "2000 éléments aléatoires"
```

:::corrige
```python solution
def fusion(a, b):
    resultat, i, j = [], 0, 0
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            resultat.append(a[i])
            i += 1
        else:
            resultat.append(b[j])
            j += 1
    return resultat + a[i:] + b[j:]

def tri_fusion(t):
    if len(t) <= 1:
        return t
    m = len(t) // 2
    return fusion(tri_fusion(t[:m]), tri_fusion(t[m:]))
```
Le dernier test (2 000 éléments) passerait aussi avec un tri en $n^2$, mais il vérifie le résultat sur beaucoup de cas.
:::
::::

::::exercice[Écrire le tri rapide]{niveau=3}
Écris `tri_rapide(t)` qui renvoie une nouvelle liste triée selon le principe du tri rapide (pivot = premier élément,
partition en deux listes). Attention aux éléments égaux au pivot.

```python depart
def tri_rapide(t):
    ...
```

```python tests
assert tri_rapide([38, 27, 43, 3, 9, 82, 10]) == [3, 9, 10, 27, 38, 43, 82], "cas courant"
assert tri_rapide([]) == [], "vide"
assert tri_rapide([2, 2, 2]) == [2, 2, 2], "tous égaux"
assert tri_rapide([5, 1, 5, 1, 5]) == [1, 1, 5, 5, 5], "doublons du pivot"
assert tri_rapide(list(range(300, 0, -1))) == list(range(1, 301)), "ordre inverse"
```

:::corrige
```python solution
def tri_rapide(t):
    if len(t) <= 1:
        return t
    pivot = t[0]
    petits = [x for x in t[1:] if x < pivot]
    grands = [x for x in t[1:] if x >= pivot]
    return tri_rapide(petits) + [pivot] + tri_rapide(grands)
```
Si on écrivait `x > pivot` pour les grands, les autres éléments égaux au pivot disparaîtraient. Sur une liste triée
(ou en ordre inverse), la partie « petits » (ou « grands ») est vide à chaque fois : profondeur `n`, coût
$\Theta(n^2)$. Avec 1 000 éléments triés, on dépasserait la limite de récursion de Python.
:::
::::

::::exercice[Pire cas du tri rapide]{niveau=3}
On applique le tri rapide « pivot = premier élément » à la liste déjà triée `[1, 2, …, n]`.
1. Décris les appels récursifs successifs. 2. Établis la relation de récurrence du nombre de comparaisons et résous-la.
3. Propose deux façons d'éviter ce pire cas.

:::criteres
- Avec le premier élément comme pivot, la partie « petits » est vide et la partie « grands » contient les `n - 1` autres éléments ; la profondeur des appels est `n`.
- $C(n) = C(n - 1) + (n - 1)$, $C(1) = 0$, donc $C(n) = \frac{n(n-1)}{2}$, soit $\Theta(n^2)$.
- Remèdes : pivot choisi au hasard, médiane de trois (premier, milieu, dernier), ou mélanger la liste au départ.
:::

:::corrige
1. Le pivot 1 est le plus petit : `petits = []`, `grands = [2, …, n]`. Puis le pivot 2 donne `grands = [3, …, n]`, etc.
   Chaque appel ne retire que le pivot : il y a `n` niveaux d'appels.
2. La partition de `k` éléments fait `k - 1` comparaisons : $C(n) = C(n-1) + (n - 1)$ avec $C(1) = 0$. En déroulant :
   $C(n) = (n-1) + (n-2) + \dots + 1 = \frac{n(n-1)}{2}$ : $\Theta(n^2)$.
3. Choisir le pivot **au hasard** (le pire cas devient très improbable, le coût moyen est $\Theta(n \log n)$ quelle que
   soit l'entrée) ; ou prendre la **médiane de trois** éléments (premier, milieu, dernier), qui coupe bien les listes
   triées ; ou **mélanger** la liste une fois au départ.
:::
::::

::::exercice[Inversions en n log n]{niveau=3}
Écris `nb_inversions(t)` en $\Theta(n \log n)$ en adaptant le tri fusion (voir l'exemple guidé). La fonction renvoie
seulement le nombre d'inversions.

```python depart
def nb_inversions(t):
    ...
```

```python tests
assert nb_inversions([5, 2, 4, 6, 1, 3]) == 9, "exemple du cours"
assert nb_inversions([1, 2, 3, 4]) == 0, "triée"
assert nb_inversions(list(range(100, 0, -1))) == 4950, "ordre inverse : n(n-1)/2"
assert nb_inversions([2, 2, 1]) == 2, "égaux"
assert nb_inversions([]) == 0, "vide"
```

:::corrige
```python solution
def nb_inversions(t):
    def aux(t):
        if len(t) <= 1:
            return t, 0
        m = len(t) // 2
        a, x = aux(t[:m])
        b, y = aux(t[m:])
        res, i, j, c = [], 0, 0, 0
        while i < len(a) and j < len(b):
            if a[i] <= b[j]:
                res.append(a[i])
                i += 1
            else:
                res.append(b[j])
                j += 1
                c += len(a) - i
        return res + a[i:] + b[j:], x + y + c
    return aux(t)[1]
```
Le `<=` est essentiel : deux éléments égaux ne forment pas une inversion, il faut donc prendre d'abord celui de gauche.
:::
::::

::::exercice[Résoudre des récurrences]{niveau=4 duree=25}
Pour chacun des algorithmes suivants, établis la relation de récurrence de son coût, puis résous-la (par l'arbre de
récursion ou le théorème maître), en supposant $n$ puissance de 2.

1. `A(n)` découpe le problème en **deux** moitiés, fait un travail **constant** pour combiner.
2. `B(n)` découpe en **deux** moitiés, mais fait un travail en $n^2$ pour combiner.
3. Algorithme de **Karatsuba** : pour multiplier deux nombres de $n$ chiffres, on fait **trois** multiplications de
   nombres de $n/2$ chiffres, plus des additions en $\Theta(n)$. Combien de multiplications de chiffres pour
   $n = 1024$, comparé à l'algorithme de l'école primaire ?
4. Pour `A`, retrouve le résultat en sommant explicitement les coûts des niveaux de l'arbre de récursion.

:::criteres
- 1 : $C(n) = 2C(n/2) + \Theta(1)$ ; $a = 2 > b^d = 1$ ; $\Theta(n)$.
- 2 : $C(n) = 2C(n/2) + \Theta(n^2)$ ; $a = 2 < b^d = 4$ ; $\Theta(n^2)$.
- 3 : $C(n) = 3C(n/2) + \Theta(n)$ ; $a = 3 > 2$ ; $\Theta(n^{\log_2 3}) \approx \Theta(n^{1{,}585})$ ; pour $n = 1024 = 2^{10}$, $3^{10} = 59\,049$ multiplications de chiffres contre $1024^2 \approx 10^6$.
- 4 : niveau $k$ : $2^k$ nœuds de coût constant ; somme $\sum_{k=0}^{\log_2 n} 2^k = 2n - 1$, donc $\Theta(n)$.
:::

:::corrige
1. $C(n) = 2\,C(n/2) + c$. Ici $a = 2$, $b = 2$, $d = 0$ : $a > b^d = 1$, donc $C(n) = \Theta(n^{\log_2 2}) = \Theta(n)$.
2. $C(n) = 2\,C(n/2) + c\,n^2$ : $a = 2 < b^d = 4$, donc $C(n) = \Theta(n^2)$. Le travail de la racine domine :
   les niveaux coûtent $n^2$, $n^2/2$, $n^2/4$… (série géométrique de raison 1/2, somme $\le 2n^2$).
3. $M(n) = 3\,M(n/2) + \Theta(n)$ : $a = 3 > b^d = 2$, donc $M(n) = \Theta(n^{\log_2 3})$, avec
   $\log_2 3 \approx 1{,}585$. En ne comptant que les multiplications de chiffres, $M(1) = 1$ et $M(2^k) = 3^k$ :
   pour $n = 1024 = 2^{10}$, $3^{10} = 59\,049$ multiplications, contre $n^2 = 1\,048\,576$ pour la méthode de
   l'école primaire (environ 18 fois moins).
4. Au niveau $k$ de l'arbre, il y a $2^k$ sous-problèmes, chacun de coût constant $c$. Il y a $\log_2 n + 1$ niveaux :
   $C(n) = c \sum_{k=0}^{\log_2 n} 2^k = c\,(2^{\log_2 n + 1} - 1) = c\,(2n - 1)$, donc $\Theta(n)$.
:::
::::
