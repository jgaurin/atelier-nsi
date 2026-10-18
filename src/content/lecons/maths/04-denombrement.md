---
titre: Dénombrement
resume: Compter sans énumérer — principes additif et multiplicatif, listes avec répétition, arrangements, permutations, combinaisons, coefficients binomiaux et triangle de Pascal, principe des tiroirs — et leurs usages pour évaluer la taille d'un espace de recherche.
duree: 65
objectifs:
  - Appliquer les principes de somme et de produit, et l'inclusion-exclusion
  - Reconnaître et compter listes (avec répétition), arrangements, permutations et combinaisons
  - Calculer des coefficients binomiaux (formule, triangle de Pascal) et justifier des identités par un argument combinatoire
  - Évaluer la taille d'un espace de recherche (mots de passe, sous-ensembles, ordres) et en tirer des conséquences algorithmiques
prerequis: [maths/ensembles]
programme: [m-denombrement, asd-cout, nsit-securite]
cartes:
  - q: Nombre de mots de passe de longueur $k$ sur un alphabet de $n$ symboles ?
    r: "$n^k$ (listes avec répétition : $n$ choix pour chaque position). Exemple : 8 caractères parmi 62 → $62^8 \\approx 2{,}2 \\times 10^{14}$."
  - q: Nombre de façons d'ordonner $n$ objets ?
    r: "$n!$ permutations ($n$ choix pour le premier, $n-1$ pour le second…). $10! = 3\\,628\\,800$."
  - q: Arrangements $A_n^k$ ?
    r: "Listes de $k$ éléments **distincts** pris parmi $n$, l'ordre comptant : $\\frac{n!}{(n-k)!} = n(n-1)\\cdots(n-k+1)$ (podiums de $k$ coureurs parmi $n$)."
  - q: Combinaisons $\binom{n}{k}$ ?
    r: "Nombre de parties à $k$ éléments d'un ensemble à $n$ éléments (l'ordre ne compte pas) : $\\frac{n!}{k!(n-k)!}$. $\\binom{5}{2} = 10$."
  - q: Formule de Pascal ?
    r: "$\\binom{n}{k} = \\binom{n-1}{k-1} + \\binom{n-1}{k}$ : une partie à $k$ éléments contient un élément fixé (et $k-1$ autres) ou ne le contient pas."
  - q: Principe des tiroirs ?
    r: "Si l'on range $n + 1$ objets dans $n$ tiroirs, un tiroir au moins contient deux objets. Exemple : parmi 367 personnes, deux ont le même anniversaire."
  - q: Somme des $\binom{n}{k}$ pour $k$ de 0 à $n$ ?
    r: "$2^n$ : on compte toutes les parties d'un ensemble à $n$ éléments, rangées par taille."
---

Combien de mots de passe de 8 caractères ? Combien d'ordres possibles pour visiter 15 villes ? Combien de façons de choisir 3 délégués parmi 30 ?
Le **dénombrement** répond sans tout énumérer — ce qui serait souvent impossible. En informatique, c'est l'outil pour évaluer la **taille d'un
espace de recherche** : savoir si une recherche exhaustive (force brute) est envisageable, ou si un mot de passe résiste à une attaque.

## 1. Les deux principes de base

:::retenir
- **Principe additif** : si un choix se fait **soit** dans $A$ **soit** dans $B$, avec $A$ et $B$ disjoints, il y a $|A| + |B|$ possibilités. S'ils ne
  sont pas disjoints : $|A \cup B| = |A| + |B| - |A \cap B|$ (**inclusion-exclusion**).
- **Principe multiplicatif** : si un choix se fait en **plusieurs étapes** indépendantes, avec $n_1$ possibilités puis $n_2$, …, il y a
  $n_1 \times n_2 \times \cdots$ possibilités (c'est le cardinal d'un produit cartésien).
:::

Exemple : une plaque d'immatriculation française `AB-123-CD` : $26^2 \times 10^3 \times 26^2 \approx 4{,}6 \times 10^8$ (en ignorant les lettres interdites).

## 2. Les situations types

| Situation | L'ordre compte ? | Répétitions ? | Nombre | Exemple |
|---|---|---|---|---|
| liste (mot) de $k$ éléments parmi $n$ | oui | oui | $n^k$ | codes PIN : $10^4$ |
| arrangement de $k$ parmi $n$ | oui | non | $A_n^k = \frac{n!}{(n-k)!}$ | podium de 3 parmi 10 : 720 |
| permutation de $n$ | oui | non | $n!$ | ordres de passage de 25 élèves |
| combinaison de $k$ parmi $n$ | non | non | $\binom{n}{k} = \frac{n!}{k!\,(n-k)!}$ | 3 délégués parmi 30 : 4 060 |
| parties d'un ensemble à $n$ éléments | non | non | $2^n$ | sous-ensembles de 20 objets : ~$10^6$ |

```python exec
from math import comb, perm, factorial
from itertools import permutations, combinations, product

print(10 ** 4, perm(10, 3), factorial(25), comb(30, 3), 2 ** 20)
# Vérification par énumération sur de petits cas
E = "ABCD"
print(len(list(product(E, repeat=2))), 4 ** 2)          # listes avec répétition
print(len(list(permutations(E, 2))), perm(4, 2))        # arrangements
print(len(list(combinations(E, 2))), comb(4, 2))        # combinaisons
```

:::methode[Arrangement ou combinaison ?]
Se demander si **deux résultats qui ne diffèrent que par l'ordre** sont considérés comme différents. Un podium (or, argent, bronze) : oui → arrangement.
Un groupe de trois délégués : non → combinaison. Chaque combinaison de $k$ éléments correspond à $k!$ arrangements : $A_n^k = k! \binom{n}{k}$.
:::

## 3. Coefficients binomiaux et triangle de Pascal

$\binom{n}{k}$ (« $k$ parmi $n$ ») compte les parties à $k$ éléments d'un ensemble à $n$ éléments. Propriétés :

- **symétrie** : $\binom{n}{k} = \binom{n}{n-k}$ (choisir les $k$ élus, c'est choisir les $n - k$ exclus) ;
- **Pascal** : $\binom{n}{k} = \binom{n-1}{k-1} + \binom{n-1}{k}$ (on fixe un élément : il est dans la partie ou non) ;
- **somme** : $\sum_{k=0}^{n} \binom{n}{k} = 2^n$ ; **binôme de Newton** : $(a+b)^n = \sum_{k} \binom{n}{k} a^k b^{n-k}$.

```python exec
def pascal(n):
    lignes = [[1]]
    for _ in range(n):
        precedente = lignes[-1]
        lignes.append([1] + [precedente[i] + precedente[i + 1] for i in range(len(precedente) - 1)] + [1])
    return lignes

for ligne in pascal(6):
    print(" ".join(f"{x:2}" for x in ligne).center(40))
```

La formule de Pascal se programme récursivement… mais naïvement le calcul est **exponentiel** (les mêmes valeurs sont recalculées) : c'est
l'exemple type de la **programmation dynamique** (on remplit le triangle ligne par ligne, en $O(n^2)$).

## 4. Le principe des tiroirs

Si $n + 1$ objets sont rangés dans $n$ tiroirs, un tiroir contient au moins deux objets. Plus généralement, avec $m$ objets dans $n$ tiroirs, un tiroir
en contient au moins $\lceil m / n \rceil$.

Conséquences en informatique : une **compression sans perte** ne peut pas raccourcir **tous** les fichiers (il y a $2^n$ fichiers de $n$ bits mais
seulement $2^n - 1$ fichiers plus courts) ; une **fonction de hachage** vers $N$ valeurs a forcément des collisions dès qu'elle reçoit plus de $N$
entrées ; parmi 367 personnes, deux ont le même anniversaire.

:::prof
Le dénombrement n'est pas au programme de NSI en tant que tel, mais il sert à **évaluer la complexité** de la recherche exhaustive (tous les
sous-ensembles : $2^n$ ; tous les ordres : $n!$), à argumenter sur la sécurité des mots de passe (SNT, NSI) et à comprendre pourquoi un problème
comme le voyageur de commerce est difficile. Faire calculer aux élèves le temps d'une force brute sur un mot de passe est très parlant.
:::

## Exemple guidé

**Problème.** Un site impose des mots de passe de 8 caractères parmi les 26 minuscules, 26 majuscules et 10 chiffres. Un attaquant teste $10^{10}$
mots de passe par seconde. Combien de temps lui faut-il, au pire, pour tout essayer ? Et si on impose au moins un chiffre ?

**1. Sans contrainte** : $62^8 \approx 2{,}18 \times 10^{14}$ mots de passe, soit $2{,}18 \times 10^{4}$ s ≈ 6 heures.

**2. Avec au moins un chiffre** : on compte le **complémentaire** (aucun chiffre) : $62^8 - 52^8$. On ne gagne… rien : on a **retiré** des possibilités.

**3. Mieux : allonger.** 12 caractères : $62^{12} \approx 3{,}2 \times 10^{21}$, soit environ 10 000 ans.

```python exec
vitesse = 1e10
for longueur in (8, 10, 12, 16):
    n = 62 ** longueur
    secondes = n / vitesse
    print(f"{longueur:2} caractères : {n:.2e} mots de passe, {secondes / 3600 / 24 / 365:.2e} ans")
print("au moins un chiffre (8) :", f"{62**8 - 52**8:.3e}", "<", f"{62**8:.3e}")
```

**4. Conclure.** La longueur compte bien plus que la variété des caractères ($62^{k}$ croît exponentiellement en $k$), et les contraintes de composition
**réduisent** l'espace de recherche (elles n'aident que parce qu'elles empêchent des mots de passe trop prévisibles). Les attaques réelles testent
d'abord les mots probables (dictionnaires), d'où l'intérêt des **phrases de passe** longues.

## L'essentiel

- Principe additif (somme, inclusion-exclusion) et multiplicatif (produit).
- Listes avec répétition $n^k$ ; arrangements $\frac{n!}{(n-k)!}$ ; permutations $n!$ ; combinaisons $\binom{n}{k} = \frac{n!}{k!(n-k)!}$ ; parties $2^n$.
- Pascal $\binom{n}{k} = \binom{n-1}{k-1} + \binom{n-1}{k}$, symétrie, somme $2^n$, binôme de Newton.
- Compter le complémentaire quand « au moins un » ; principe des tiroirs (collisions, compression).
- Taille d'un espace de recherche : $2^n$ sous-ensembles, $n!$ ordres → recherche exhaustive vite impossible.

## Exercices

::::exercice[Arrangement ou combinaison]{niveau=1}
Dans une classe de 30 élèves, on élit un délégué et un suppléant. Combien de résultats possibles ?

- [ ] $\binom{30}{2} = 435$
- [x] $30 \times 29 = 870$
- [ ] $30^2 = 900$
- [ ] $2^{30}$

:::corrige
Les deux rôles sont différents : l'ordre compte, et une même personne ne peut pas occuper les deux postes. C'est un arrangement : $30 \times 29 = 870$.
S'il s'agissait d'élire deux délégués interchangeables, ce serait $\binom{30}{2} = 435$.
:::
::::

::::exercice[Au moins un]{niveau=1}
On lance 3 dés à six faces. Combien de résultats (ordonnés) contiennent au moins un 6 ?

- [ ] 3
- [ ] 18
- [x] 91
- [ ] 108

:::corrige
On compte le complémentaire : $6^3 = 216$ résultats en tout, dont $5^3 = 125$ sans aucun 6 ; donc $216 - 125 = 91$. (Ajouter « 6 au premier dé ou au
deuxième ou au troisième » compterait plusieurs fois les résultats avec plusieurs 6.)
:::
::::

::::exercice[Coefficients binomiaux]{niveau=2}
Écris `binomial(n, k)` **sans** utiliser `math.comb` ni les factorielles, en construisant le triangle de Pascal ligne par ligne (programmation
dynamique). Renvoie 0 si $k < 0$ ou $k > n$.

```python depart
def binomial(n, k):
    ...
```

```python tests
assert binomial(5, 2) == 10, "5 parmi 2"
assert binomial(30, 3) == 4060, "délégués"
assert binomial(10, 0) == 1 and binomial(10, 10) == 1, "bords"
assert binomial(4, 7) == 0 and binomial(4, -1) == 0, "hors limites"
assert binomial(100, 50) == 100891344545564193334812497256, "grand coefficient (calcul rapide exigé)"
assert all(sum(binomial(n, k) for k in range(n + 1)) == 2 ** n for n in range(15)), "somme = 2^n"
```

:::corrige
```python solution
def binomial(n, k):
    if k < 0 or k > n:
        return 0
    ligne = [1]
    for _ in range(n):
        ligne = [1] + [ligne[i] + ligne[i + 1] for i in range(len(ligne) - 1)] + [1]
    return ligne[k]
```
On ne garde que la ligne courante : $O(n^2)$ additions et $O(n)$ mémoire. La version récursive directe de la formule de Pascal recalcule les mêmes
coefficients un nombre exponentiel de fois ($\binom{100}{50}$ serait hors de portée) : c'est la motivation de la programmation dynamique.
:::
::::

::::exercice[Énumérer pour vérifier]{niveau=2}
Écris `compter_mots(alphabet, k, condition)` qui énumère tous les mots de longueur `k` sur `alphabet` (avec `itertools.product`) et compte ceux qui
vérifient `condition` (une fonction qui reçoit le mot sous forme de chaîne). Utilise-la pour vérifier deux calculs de dénombrement.

```python depart
from itertools import product

def compter_mots(alphabet, k, condition):
    ...
```

```python tests
assert compter_mots("ab", 3, lambda m: True) == 8, "2^3 mots"
assert compter_mots("0123456789", 4, lambda m: len(set(m)) == 4) == 5040, "chiffres distincts : arrangements"
assert compter_mots("123456", 3, lambda m: "6" in m) == 91, "au moins un 6"
assert compter_mots("abc", 4, lambda m: list(m) == sorted(m)) == 15, "mots croissants : combinaisons avec répétition"
```

:::corrige
```python solution
from itertools import product

def compter_mots(alphabet, k, condition):
    return sum(1 for t in product(alphabet, repeat=k) if condition("".join(t)))
```
L'énumération confirme les formules : $A_{10}^4 = 10 \times 9 \times 8 \times 7 = 5\,040$, $6^3 - 5^3 = 91$. Le dernier compte les mots croissants de 4
lettres sur 3 : ce sont des **combinaisons avec répétition**, au nombre de $\binom{3 + 4 - 1}{4} = 15$. Énumérer n'est possible que pour de petits
cas : c'est un outil de vérification, pas de calcul.
:::
::::

::::exercice[Chemins dans une grille]{niveau=3}
Un robot part du coin inférieur gauche d'une grille et doit atteindre le point $(L, H)$ en ne faisant que des pas vers la droite ou vers le haut. Certaines
cases sont interdites. Écris `chemins(L, H, interdites)` qui renvoie le nombre de chemins (programmation dynamique : le nombre de chemins vers $(x, y)$
est la somme des nombres de chemins vers $(x-1, y)$ et $(x, y-1)$). Sans case interdite, le résultat doit valoir $\binom{L+H}{L}$.

```python depart
def chemins(L, H, interdites=frozenset()):
    ...
```

```python tests
from math import comb
assert chemins(2, 2) == 6, "grille 2 × 2"
assert all(chemins(L, H) == comb(L + H, L) for L in range(6) for H in range(6)), "formule binomiale"
assert chemins(2, 2, {(1, 1)}) == 2, "le centre est interdit"
assert chemins(3, 3, {(0, 1), (1, 0)}) == 0, "départ bloqué"
assert chemins(20, 20) == comb(40, 20), "grande grille : calcul rapide"
```

:::corrige
```python solution
def chemins(L, H, interdites=frozenset()):
    nb = {}
    for x in range(L + 1):
        for y in range(H + 1):
            if (x, y) in interdites:
                nb[(x, y)] = 0
            elif x == 0 and y == 0:
                nb[(x, y)] = 1
            else:
                nb[(x, y)] = nb.get((x - 1, y), 0) + nb.get((x, y - 1), 0)
    return nb[(L, H)]
```
Sans obstacle, un chemin est une suite de $L + H$ pas dont $L$ vers la droite : choisir leurs positions, c'est $\binom{L+H}{L}$. La récurrence
$c(x, y) = c(x-1, y) + c(x, y-1)$ est exactement la formule de Pascal, « tournée » d'un quart de tour. La programmation dynamique fonctionne encore avec
des obstacles, là où la formule close ne s'applique plus.
:::
::::

::::exercice[Taille d'un espace de recherche]{niveau=4 duree=20}
Un élève veut écrire un programme qui trouve le meilleur ordre pour visiter les 20 villes d'un circuit touristique (problème du voyageur de commerce)
en essayant **tous** les ordres.

1. Combien d'ordres de visite y a-t-il (départ et arrivée dans la même ville fixée, sens de parcours indifférent) ? Combien de temps à un milliard
   d'ordres testés par seconde ?
2. Même question pour la recherche du meilleur sous-ensemble de 40 objets à emporter dans un sac (sac à dos) par force brute.
3. Que proposeriez-vous à l'élève ? Comment lui faire comprendre la différence entre $2^n$, $n!$ et $n^2$ ?

:::criteres
- Voyageur : $\frac{(n-1)!}{2} = \frac{19!}{2} \approx 6 \times 10^{16}$ ordres, soit environ 2 ans à $10^9$ par seconde (et ×21×20… dès qu'on ajoute des villes).
- Sac à dos : $2^{40} \approx 1{,}1 \times 10^{12}$ sous-ensembles, environ 18 minutes ; à 60 objets, 36 ans.
- Propositions : heuristiques (plus proche voisin, glouton), programmation dynamique (sac à dos à capacité entière), algorithmes d'approximation ; accepter une solution non optimale.
- Comparaison concrète des croissances (tableau de valeurs, temps de calcul mesurés pour de petits n, extrapolation).
:::

:::corrige
1. On fixe la ville de départ ; les 19 autres peuvent être visitées dans $19!$ ordres, et chaque circuit est compté deux fois (dans un sens et dans
   l'autre) : $\frac{19!}{2} \approx 6{,}1 \times 10^{16}$ circuits. À $10^9$ par seconde : $6{,}1 \times 10^7$ s, environ **2 ans**. Avec 25 villes, $\frac{24!}{2}
   \approx 3 \times 10^{23}$ : dix millions d'années.
2. Chaque objet est pris ou non : $2^{40} \approx 1{,}1 \times 10^{12}$ sous-ensembles, soit environ **18 minutes** — faisable ! Mais 60 objets donnent
   $2^{60} \approx 1{,}2 \times 10^{18}$, soit 36 ans : chaque objet en plus double le temps.
3. Proposer d'abandonner l'**optimalité garantie** : heuristique du plus proche voisin, puis amélioration locale (échanger deux villes tant que ça
   raccourcit) ; pour le sac à dos à poids entiers, la **programmation dynamique** est exacte et rapide. Pour faire sentir les croissances : un tableau
   de $n^2$, $2^n$, $n!$ pour $n = 5, 10, 15, 20, 25$, et mesurer le temps réel de la force brute pour $n = 6, 7, 8, 9, 10$ villes : chaque ville en plus
   multiplie le temps par environ $n$, ce que les élèves extrapolent eux-mêmes.
:::
::::
