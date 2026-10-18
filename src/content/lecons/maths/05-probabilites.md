---
titre: Probabilités discrètes
resume: Univers fini et équiprobabilité, probabilités conditionnelles et indépendance, formule des probabilités totales et de Bayes, variables aléatoires, espérance et variance, lois usuelles, et simulation de Monte-Carlo.
duree: 70
objectifs:
  - Calculer des probabilités sur un univers fini, par dénombrement ou par énumération
  - Utiliser probabilités conditionnelles, indépendance, probabilités totales et formule de Bayes
  - Calculer l'espérance et la variance d'une variable aléatoire, et reconnaître les lois de Bernoulli, binomiale et géométrique
  - Estimer une probabilité par simulation et interpréter l'écart avec la valeur exacte
prerequis: [maths/denombrement]
programme: [m-probas, asd-cout]
cartes:
  - q: Probabilité en situation d'équiprobabilité ?
    r: "$P(A) = \\frac{|A|}{|\\Omega|}$ : nombre de cas favorables divisé par nombre de cas possibles."
  - q: Probabilité conditionnelle $P(A \mid B)$ ?
    r: "$P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}$ (pour $P(B) > 0$) : la probabilité de $A$ sachant que $B$ est réalisé."
  - q: Événements indépendants ?
    r: "$P(A \\cap B) = P(A) \\times P(B)$ ; de façon équivalente (si $P(B) > 0$), $P(A \\mid B) = P(A)$ : savoir $B$ ne change rien à $A$."
  - q: Formule de Bayes ?
    r: "$P(B \\mid A) = \\frac{P(A \\mid B)\\, P(B)}{P(A)}$, avec souvent $P(A) = P(A \\mid B) P(B) + P(A \\mid \\bar B) P(\\bar B)$ (probabilités totales)."
  - q: Espérance d'une variable aléatoire ?
    r: "$E(X) = \\sum_x x \\, P(X = x)$ : la moyenne des valeurs pondérée par leurs probabilités. Elle est **linéaire** : $E(X + Y) = E(X) + E(Y)$, même sans indépendance."
  - q: Loi binomiale $\mathcal{B}(n, p)$ ?
    r: "Nombre de succès en $n$ épreuves indépendantes de probabilité de succès $p$ : $P(X = k) = \\binom{n}{k} p^k (1-p)^{n-k}$, espérance $np$, variance $np(1-p)$."
  - q: Loi géométrique ?
    r: "Rang du premier succès dans une suite d'épreuves indépendantes de probabilité $p$ : $P(X = k) = (1-p)^{k-1} p$, espérance $\\frac{1}{p}$."
  - q: Paradoxe des anniversaires ?
    r: "Dans un groupe de 23 personnes, la probabilité que deux aient le même anniversaire dépasse 50 %. Conséquence : les collisions d'une fonction de hachage à $N$ valeurs apparaissent vers $\\sqrt{N}$ entrées."
---

Les probabilités interviennent en informatique dès qu'il y a du **hasard** (algorithmes randomisés comme le tri rapide à pivot aléatoire, jeux,
simulations), de l'**incertitude** (filtres anti-spam, dépistage, apprentissage automatique) ou pour analyser le coût **moyen** d'un algorithme. Cette
leçon se limite aux univers **finis** ou dénombrables (probabilités discrètes).

## 1. Univers, événements, équiprobabilité

Une expérience aléatoire a un ensemble de résultats possibles, l'**univers** $\Omega$. Un **événement** est une partie de $\Omega$. Une **probabilité**
associe à chaque résultat un nombre positif, la somme valant 1 ; $P(A)$ est la somme des probabilités des résultats de $A$. Propriétés :
$P(\bar A) = 1 - P(A)$ et $P(A \cup B) = P(A) + P(B) - P(A \cap B)$.

Quand tous les résultats ont la même probabilité (**équiprobabilité**), $P(A) = \frac{|A|}{|\Omega|}$ : on est ramené à du **dénombrement**.

```python exec
from fractions import Fraction
from itertools import product

omega = list(product(range(1, 7), repeat=2))            # deux dés
somme7 = [r for r in omega if sum(r) == 7]
double = [r for r in omega if r[0] == r[1]]
print("P(somme = 7) =", Fraction(len(somme7), len(omega)))
print("P(double)    =", Fraction(len(double), len(omega)))
print("P(au moins un 6) =", 1 - Fraction(5, 6) ** 2)    # par le complémentaire
```

## 2. Conditionnement et indépendance

:::definition
- **Probabilité conditionnelle** : $P(A \mid B) = \frac{P(A \cap B)}{P(B)}$, la probabilité de $A$ quand on **sait** que $B$ est réalisé.
- $A$ et $B$ sont **indépendants** si $P(A \cap B) = P(A)\,P(B)$.
- **Probabilités totales** : si $B_1, \dots, B_k$ partagent $\Omega$, $P(A) = \sum_i P(A \mid B_i) \, P(B_i)$.
- **Formule de Bayes** : $P(B \mid A) = \frac{P(A \mid B)\,P(B)}{P(A)}$ — elle « retourne » un conditionnement.
:::

```mermaid legende="Arbre de probabilités d'un test de dépistage (maladie touchant 1 % de la population)"
flowchart LR
  O(( )) -->|"0,01"| M["malade"]
  O -->|"0,99"| S["sain"]
  M -->|"0,99"| MP["test positif"]
  M -->|"0,01"| MN["test négatif"]
  S -->|"0,05"| SP["test positif"]
  S -->|"0,95"| SN["test négatif"]
```

:::attention[Ne pas confondre $P(A \mid B)$ et $P(B \mid A)$]
Avec ce test (sensibilité 99 %, 5 % de faux positifs), une personne testée positive n'est malade qu'avec une probabilité
$\frac{0{,}01 \times 0{,}99}{0{,}01 \times 0{,}99 + 0{,}99 \times 0{,}05} \approx 17\,\%$ : la maladie est rare, et la plupart des positifs sont des faux positifs.
C'est aussi le principe des filtres anti-spam « bayésiens ».
:::

## 3. Variables aléatoires, espérance, variance

Une **variable aléatoire** $X$ associe un nombre à chaque résultat (la somme des dés, le nombre de comparaisons d'un algorithme). Sa **loi** donne
$P(X = x)$ pour chaque valeur.

- **Espérance** : $E(X) = \sum_x x \, P(X = x)$, la valeur moyenne. Elle est **linéaire** : $E(aX + bY) = aE(X) + bE(Y)$, **même** si $X$ et $Y$ ne sont
  pas indépendantes.
- **Variance** : $V(X) = E\big((X - E(X))^2\big) = E(X^2) - E(X)^2$ ; **écart type** $\sigma = \sqrt{V(X)}$, qui mesure la dispersion.

| Loi | Situation | $P(X = k)$ | $E(X)$ | $V(X)$ |
|---|---|---|---|---|
| Bernoulli $\mathcal{B}(p)$ | un succès ou un échec | $P(X=1) = p$ | $p$ | $p(1-p)$ |
| binomiale $\mathcal{B}(n, p)$ | nombre de succès en $n$ épreuves indépendantes | $\binom{n}{k} p^k (1-p)^{n-k}$ | $np$ | $np(1-p)$ |
| géométrique $\mathcal{G}(p)$ | rang du premier succès | $(1-p)^{k-1} p$ | $\frac{1}{p}$ | $\frac{1-p}{p^2}$ |
| uniforme sur $\{1, \dots, n\}$ | tirage équiprobable | $\frac{1}{n}$ | $\frac{n+1}{2}$ | $\frac{n^2 - 1}{12}$ |

:::exemple[Coût moyen d'une recherche séquentielle]
On cherche un élément présent dans une liste de $n$ éléments, à une position uniforme. Le nombre de comparaisons $X$ suit la loi uniforme sur
$\{1, \dots, n\}$ : en moyenne $\frac{n+1}{2}$ comparaisons — linéaire, comme le pire cas, mais deux fois moins.
:::

## 4. Simuler : la méthode de Monte-Carlo

Quand le calcul exact est difficile, on **simule** l'expérience un grand nombre de fois et l'on mesure la fréquence. La **loi des grands nombres**
garantit que la fréquence se rapproche de la probabilité ; l'erreur typique diminue comme $\frac{1}{\sqrt{N}}$ (diviser l'erreur par 10 demande 100 fois
plus de simulations).

```python exec
import random

rng = random.Random(2027)                    # graine fixée : résultats reproductibles
def anniversaires_communs(n):
    jours = [rng.randrange(365) for _ in range(n)]
    return len(set(jours)) < n

N = 5_000
for n in (10, 23, 40):
    freq = sum(anniversaires_communs(n) for _ in range(N)) / N
    exact = 1.0
    for i in range(n):
        exact *= (365 - i) / 365
    print(f"{n} personnes : simulation {freq:.3f}, exact {1 - exact:.3f}")
```

:::prof
Au lycée, les probabilités relèvent des mathématiques ; en NSI, on les rencontre dans les simulations (module `random`), les algorithmes randomisés et
l'analyse du coût moyen. Pour le concours, il faut savoir mener un calcul simple de probabilité ou d'espérance et le confronter à une simulation —
un excellent exercice de programmation à proposer aux élèves (avec `random.seed` pour des résultats reproductibles).
:::

## Exemple guidé

**Problème.** On mélange une liste de $n$ éléments distincts uniformément au hasard. Combien d'éléments restent, en moyenne, à leur place d'origine
(points fixes) ?

**1. Écrire $X$ comme une somme.** $X = X_1 + \dots + X_n$ où $X_i$ vaut 1 si l'élément $i$ est à sa place, 0 sinon. Chaque $X_i$ suit une loi de
Bernoulli de paramètre $\frac{1}{n}$ (l'élément $i$ a autant de chances d'arriver à chacune des $n$ positions).

**2. Linéarité de l'espérance.** $E(X) = \sum_i E(X_i) = n \times \frac{1}{n} = 1$ — quel que soit $n$ ! Les $X_i$ ne sont pas indépendantes, mais la
linéarité n'en a pas besoin.

**3. Confronter à l'énumération et à la simulation.**

```python exec
from itertools import permutations
from fractions import Fraction
import random

def points_fixes(p):
    return sum(1 for i, x in enumerate(p) if i == x)

n = 6
toutes = list(permutations(range(n)))
print("exact (énumération) :", Fraction(sum(points_fixes(p) for p in toutes), len(toutes)))

rng = random.Random(1)
N = 10_000
total = 0
for _ in range(N):
    p = list(range(30))
    rng.shuffle(p)
    total += points_fixes(p)
print("simulation (n = 30) :", total / N)
```

**4. Conclure.** L'énumération confirme $E(X) = 1$ pour $n = 6$, et la simulation donne environ 1 pour $n = 30$. La linéarité de l'espérance est l'outil
le plus efficace de l'analyse en moyenne des algorithmes (coût moyen du tri rapide, des tables de hachage).

## L'essentiel

- Univers, événements, $P(\bar A) = 1 - P(A)$, $P(A \cup B) = P(A) + P(B) - P(A \cap B)$ ; équiprobabilité : $\frac{|A|}{|\Omega|}$.
- $P(A \mid B) = \frac{P(A \cap B)}{P(B)}$ ; indépendance $P(A \cap B) = P(A)P(B)$ ; probabilités totales ; **Bayes** (ne pas confondre $P(A \mid B)$ et $P(B \mid A)$).
- Espérance (linéaire, même sans indépendance), variance, écart type ; lois de Bernoulli, binomiale ($np$), géométrique ($1/p$), uniforme ($\frac{n+1}{2}$).
- Monte-Carlo : fréquence ≈ probabilité, erreur en $1/\sqrt{N}$ ; graine fixée pour reproduire.

## Exercices

::::exercice[Deux enfants]{niveau=1}
Une famille a deux enfants ; on sait qu'au moins l'un est une fille. Quelle est la probabilité que les deux soient des filles (naissances équiprobables
et indépendantes) ?

- [ ] $\frac{1}{2}$
- [x] $\frac{1}{3}$
- [ ] $\frac{1}{4}$
- [ ] $\frac{2}{3}$

:::corrige
Univers {FF, FG, GF, GG} équiprobable ; on sait qu'on n'est pas dans GG : il reste 3 cas, dont un seul est FF. $P(FF \mid \text{au moins une F}) = \frac{1/4}{3/4} = \frac{1}{3}$.
:::
::::

::::exercice[Espérance d'un dé]{niveau=1}
Quelle est l'espérance de la somme de deux dés équilibrés ?

- [ ] 6
- [x] 7
- [ ] 6,5
- [ ] 12

:::corrige
Chaque dé a pour espérance $\frac{1+2+\dots+6}{6} = 3{,}5$ ; par linéarité, la somme a pour espérance $3{,}5 + 3{,}5 = 7$.
:::
::::

::::exercice[Probabilité exacte par énumération]{niveau=2}
Écris `proba(univers, evenement)` qui renvoie, sous forme de `Fraction`, la probabilité d'un événement (une fonction qui reçoit un résultat et renvoie un
booléen) dans un univers fini équiprobable (une liste de résultats). Utilise-la pour calculer la probabilité d'obtenir au moins deux 6 en lançant
quatre dés.

```python depart
from fractions import Fraction
from itertools import product

def proba(univers, evenement):
    ...

deux_six = ...    # P(au moins deux 6 avec quatre dés)
```

```python tests
from fractions import Fraction
from itertools import product
de2 = list(product(range(1, 7), repeat=2))
assert proba(de2, lambda r: sum(r) == 7) == Fraction(1, 6), "somme 7"
assert proba(de2, lambda r: True) == 1 and proba(de2, lambda r: False) == 0, "certain et impossible"
assert deux_six == Fraction(19, 144), "au moins deux 6 sur quatre dés"
```

:::corrige
```python solution
from fractions import Fraction
from itertools import product

def proba(univers, evenement):
    return Fraction(sum(1 for r in univers if evenement(r)), len(univers))

deux_six = proba(list(product(range(1, 7), repeat=4)), lambda r: r.count(6) >= 2)
```
Par la loi binomiale : $1 - P(X=0) - P(X=1) = 1 - \left(\frac56\right)^4 - 4 \cdot \frac16 \left(\frac56\right)^3 = 1 - \frac{625}{1296} - \frac{500}{1296} = \frac{171}{1296} = \frac{19}{144}$.
L'énumération des $6^4 = 1\,296$ résultats donne le même résultat exact grâce aux fractions.
:::
::::

::::exercice[Bayes appliqué]{niveau=2}
Écris `proba_malade_si_positif(prevalence, sensibilite, faux_positifs)` qui renvoie $P(\text{malade} \mid \text{positif})$, où `sensibilite` est
$P(\text{positif} \mid \text{malade})$ et `faux_positifs` est $P(\text{positif} \mid \text{sain})$.

```python depart
def proba_malade_si_positif(prevalence, sensibilite, faux_positifs):
    ...
```

```python tests
assert abs(proba_malade_si_positif(0.01, 0.99, 0.05) - 0.1667) < 1e-3, "maladie rare"
assert abs(proba_malade_si_positif(0.5, 0.99, 0.05) - 0.9519) < 1e-3, "maladie fréquente"
assert proba_malade_si_positif(0.2, 1.0, 0.0) == 1.0, "test parfait"
```

:::corrige
```python solution
def proba_malade_si_positif(prevalence, sensibilite, faux_positifs):
    positif = sensibilite * prevalence + faux_positifs * (1 - prevalence)   # probabilités totales
    return sensibilite * prevalence / positif                                # Bayes
```
Le même test donne 17 % de malades parmi les positifs quand la maladie touche 1 % de la population, mais 95 % quand elle en touche la moitié : le
résultat dépend fortement de la probabilité **a priori**. C'est l'erreur de raisonnement la plus courante en probabilités.
:::
::::

::::exercice[Monte-Carlo : estimer π]{niveau=3}
On tire des points uniformément dans le carré $[0, 1]^2$ ; la proportion de points dans le quart de disque $x^2 + y^2 \le 1$ tend vers $\frac{\pi}{4}$.
Écris `estimer_pi(n, graine)` qui utilise `random.Random(graine)` pour tirer `n` points et renvoie l'estimation de $\pi$. Puis `erreur_moyenne(n, essais)`
qui renvoie la moyenne des écarts absolus $|\text{estimation} - \pi|$ sur les graines `0, 1, …, essais - 1`.

```python depart
import random, math

def estimer_pi(n, graine):
    ...

def erreur_moyenne(n, essais):
    ...
```

```python tests
import math
assert abs(estimer_pi(50_000, 7) - math.pi) < 0.03, "estimation raisonnable"
assert estimer_pi(1000, 3) == estimer_pi(1000, 3), "reproductible avec une graine"
e1, e2 = erreur_moyenne(100, 30), erreur_moyenne(10_000, 30)
assert e2 < e1 / 4, "100 fois plus de points : erreur environ 10 fois plus petite"
```

:::corrige
```python solution
import random, math

def estimer_pi(n, graine):
    rng = random.Random(graine)
    dedans = 0
    for _ in range(n):
        x, y = rng.random(), rng.random()
        if x * x + y * y <= 1:
            dedans += 1
    return 4 * dedans / n

def erreur_moyenne(n, essais):
    return sum(abs(estimer_pi(n, g) - math.pi) for g in range(essais)) / essais
```
Le nombre de points dans le disque suit une loi binomiale $\mathcal{B}(n, \frac\pi4)$ : son écart type relatif est en $\frac{1}{\sqrt n}$. Multiplier $n$ par 100
divise l'erreur typique par 10 — la convergence de Monte-Carlo est lente, mais elle ne dépend pas de la dimension, d'où son intérêt pour des
problèmes à beaucoup de paramètres.
:::
::::

::::exercice[Le tri rapide randomisé]{niveau=4 duree=25}
Le tri rapide choisit un pivot, partage la liste en éléments plus petits et plus grands, et trie récursivement les deux parties.

1. Quel est son coût (nombre de comparaisons) dans le pire cas, et pour quelle situation si le pivot est toujours le premier élément ?
2. On choisit le pivot **au hasard**. Montrez que deux éléments de rangs $i < j$ (dans l'ordre trié) sont comparés si et seulement si l'un d'eux est le
   premier pivot choisi parmi les éléments de rang $i$ à $j$ ; en déduire que cette probabilité vaut $\frac{2}{j - i + 1}$.
3. En déduire, par linéarité de l'espérance, que le nombre moyen de comparaisons est de l'ordre de $2 n \ln n$.
4. Comment feriez-vous constater expérimentalement ce résultat à des élèves de terminale ?

:::criteres
- Pire cas : $\frac{n(n-1)}{2}$ comparaisons, quadratique, atteint avec le premier élément comme pivot sur une liste déjà triée.
- Argument : tant qu'aucun élément de rang entre $i$ et $j$ n'a été pivot, $i$ et $j$ restent dans la même sous-liste ; le premier pivot choisi parmi eux sépare $i$ et $j$ sauf s'il est l'un d'eux (seul cas où ils sont comparés) ; chacun des $j - i + 1$ éléments a la même probabilité d'être choisi en premier.
- Espérance : somme des indicatrices, $\sum_{i<j} \frac{2}{j-i+1} \le 2n \sum_{k=2}^{n} \frac1k \approx 2n \ln n$.
- Expérience : compter les comparaisons sur des listes aléatoires de tailles croissantes, comparer à $2n\ln n$ et au pire cas sur liste triée, graphique.
:::

:::corrige
1. Si chaque pivot est le plus petit (ou le plus grand) élément, le partage laisse une partie vide et l'autre de taille $n - 1$ : $(n-1) + (n-2) + \dots + 1 =
   \frac{n(n-1)}{2}$ comparaisons, coût **quadratique**. Avec le premier élément comme pivot, cela arrive sur une liste **déjà triée** — cas fréquent en pratique.
2. Notons $e_1 < e_2 < \dots < e_n$ les éléments triés. Deux éléments ne sont comparés que si l'un est pivot pendant qu'ils sont dans la même sous-liste.
   Tant qu'aucun élément de $\{e_i, \dots, e_j\}$ n'a été choisi comme pivot, ces éléments restent ensemble (un pivot extérieur les envoie tous du même
   côté). Le premier pivot choisi dans cet ensemble les sépare : si c'est $e_i$ ou $e_j$, ils sont comparés (à ce pivot) ; si c'est un élément strictement
   entre les deux, $e_i$ et $e_j$ partent de part et d'autre et ne seront jamais comparés. Le pivot étant uniforme, chacun des $j - i + 1$ éléments a la même
   chance d'être ce premier pivot : la probabilité vaut $\frac{2}{j - i + 1}$.
3. Le nombre de comparaisons est $X = \sum_{i < j} X_{ij}$ où $X_{ij}$ indique si $e_i$ et $e_j$ sont comparés. Par linéarité,
   $E(X) = \sum_{i<j} \frac{2}{j-i+1} = \sum_{i=1}^{n} \sum_{k=2}^{n-i+1} \frac{2}{k} \le 2n \sum_{k=2}^{n} \frac{1}{k} \approx 2 n \ln n$
   (la série harmonique se comporte comme $\ln n$). Le coût moyen est donc en $O(n \log n)$, **quelle que soit** la liste d'entrée : le hasard est dans
   l'algorithme, pas dans les données.
4. Programmer le tri rapide avec un compteur de comparaisons ; pour $n = 1\,000, 2\,000, \dots, 10\,000$, mesurer la moyenne sur plusieurs listes (et
   plusieurs graines) et tracer le résultat avec la courbe $2n\ln n$ ; puis lancer la version « premier élément pivot » sur une liste triée de 2 000 éléments
   (environ 2 millions de comparaisons, voire dépassement de la profondeur de récursion) et comparer avec le pivot aléatoire.
:::
::::
