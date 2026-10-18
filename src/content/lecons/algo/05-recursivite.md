---
titre: Récursivité
resume: Écrire des fonctions qui s'appellent elles-mêmes, comprendre la pile d'appels, prouver leur correction par récurrence et calculer leur coût.
duree: 80
objectifs:
  - Écrire une fonction récursive avec un cas de base et un cas récursif qui se rapproche du cas de base
  - Décrire l'exécution avec la pile d'appels et dessiner l'arbre des appels
  - Prouver la terminaison et la correction d'une fonction récursive par récurrence
  - Établir une relation de récurrence sur le coût et la résoudre dans les cas usuels
prerequis: [algo/preuve, python/fonctions]
programme: [asd-iter-rec, asd-preuve, asd-cout, nsit-langages, nsit-algo]
cartes:
  - q: Les deux ingrédients d'une fonction récursive correcte ?
    r: "Un (ou des) **cas de base**, traités sans appel récursif, et un **cas récursif** qui appelle la fonction sur une entrée plus « petite », qui se rapproche du cas de base."
  - q: Que se passe-t-il si une fonction récursive n'atteint jamais son cas de base ?
    r: "Les appels s'empilent jusqu'à dépasser la limite de la pile : `RecursionError` (environ 1000 appels par défaut en Python)."
  - q: Combien d'appels fait `fact(n)` (cas de base `n == 0`) ?
    r: "$n + 1$ appels."
  - q: Comment prouve-t-on qu'une fonction récursive est correcte ?
    r: "Par récurrence sur la taille de l'entrée : on vérifie le cas de base, puis on suppose les appels récursifs corrects (hypothèse de récurrence) et on montre que l'appel courant l'est."
  - q: Solution de $C(n) = C(n-1) + 1$, $C(0) = 0$ ? De $C(n) = C(n/2) + 1$ ?
    r: "$C(n) = n$ ; $C(n) = \\log_2 n$ (pour $n$ puissance de 2, avec $C(1) = 0$)."
  - q: Pourquoi le calcul récursif naïf de Fibonacci est-il si lent ?
    r: "Il recalcule les mêmes valeurs de nombreuses fois : le nombre d'appels croît comme $\\varphi^n$ (exponentiel)."
  - q: Nombre de déplacements minimal pour les tours de Hanoï à `n` disques ?
    r: "$2^n - 1$."
---

Certains problèmes se décrivent naturellement **en fonction d'eux-mêmes** : $n! = n \times (n-1)!$ ; une liste est vide
ou formée d'un premier élément suivi d'une liste ; pour déplacer une pile de disques, on déplace d'abord la pile du
dessus. Une fonction **récursive** est une fonction qui s'appelle elle-même pour résoudre une version plus petite du
problème. Bien maîtrisée, la récursivité donne des programmes courts et faciles à prouver ; c'est la base du
« diviser pour régner », des arbres, des parcours de graphes — et elle est omniprésente dans les sujets d'écrit.

## 1. Une fonction qui s'appelle elle-même

```python exec
def fact(n):
    """n! pour un entier n >= 0."""
    if n == 0:              # cas de base : réponse directe
        return 1
    return n * fact(n - 1)  # cas récursif : on se ramène à n - 1

print(fact(5), fact(0), fact(20))
```

:::definition
Une fonction **récursive** contient un appel à elle-même. Elle doit comporter :
- au moins un **cas de base**, traité sans appel récursif ;
- un **cas récursif**, qui appelle la fonction sur une entrée « plus petite », de sorte qu'une suite d'appels
  aboutisse toujours à un cas de base.
:::

C'est la traduction directe d'une **définition par récurrence** : $0! = 1$ et $n! = n \times (n-1)!$ pour $n \ge 1$.

## 2. Comment ça s'exécute : la pile d'appels

Chaque appel crée son propre espace de variables locales (ici, son propre `n`). L'appel `fact(3)` ne peut pas finir
avant que `fact(2)` lui ait répondu : les appels en attente s'**empilent**, puis se **dépilent** quand les réponses
remontent.

```mermaid legende="Exécution de fact(3) : descente jusqu'au cas de base, puis remontée des résultats"
sequenceDiagram
  participant P as programme
  participant A as fact(3)
  participant B as fact(2)
  participant C as fact(1)
  participant D as fact(0)
  P->>A: appel
  A->>B: 3 * fact(2) ?
  B->>C: 2 * fact(1) ?
  C->>D: 1 * fact(0) ?
  D-->>C: 1
  C-->>B: 1
  B-->>A: 2
  A-->>P: 6
```

Au moment où `fact(0)` s'exécute, la pile contient quatre appels en attente. Python limite la hauteur de la pile
(environ 1000 par défaut) : au-delà, il lève `RecursionError`. C'est aussi ce qui arrive si on oublie le cas de base,
ou si le cas récursif ne s'en rapproche pas :

```python exec erreur
def compte_a_rebours(n):
    print(n)
    compte_a_rebours(n - 1)      # pas de cas de base : la descente ne s'arrête jamais

compte_a_rebours(3)
```

:::attention
`fact(-1)` aussi ne termine pas : $-1, -2, -3…$ ne rencontrent jamais 0. La **précondition** (`n >= 0`) fait partie
de la preuve de terminaison. On peut la protéger : `if n < 0: raise ValueError(...)`.
:::

## 3. Prouver une fonction récursive

**Terminaison.** On exhibe un **variant** : une quantité entière positive qui diminue strictement à chaque appel
récursif (ici `n`). Il ne peut y avoir qu'un nombre fini d'appels imbriqués.

**Correction.** On raisonne par **récurrence** sur la taille de l'entrée.

:::methode[Prouver qu'une fonction récursive est correcte]
1. **Cas de base** : vérifier que le résultat est juste.
2. **Hérédité** : supposer que les appels récursifs (sur des entrées plus petites) renvoient le bon résultat
   (hypothèse de récurrence), et montrer qu'alors l'appel courant renvoie le bon résultat.
3. Conclure par le principe de récurrence (simple, ou forte si l'appel porte sur une entrée « plus petite »
   quelconque, comme `n // 2`).
:::

Pour `fact` : $P(n)$ : « `fact(n)` renvoie $n!$ ». $P(0)$ est vrai (renvoie 1 = 0!). Si $P(n - 1)$ est vrai, `fact(n)`
renvoie $n \times (n-1)! = n!$ : $P(n)$ est vrai.

## 4. Récursion sur les listes et les chaînes

Une liste est vide, ou c'est un premier élément suivi du reste : cette vision mène à des fonctions récursives naturelles.
Pour ne pas copier de tranches (coût caché), on passe un **indice** :

```python exec
def somme(t, i=0):
    """Somme de t[i:]."""
    if i == len(t):
        return 0
    return t[i] + somme(t, i + 1)

def maximum(t, i=0):
    """Maximum de t[i:], liste non vide (i < len(t))."""
    if i == len(t) - 1:
        return t[i]
    m = maximum(t, i + 1)
    return t[i] if t[i] > m else m

def est_palindrome(s, g, d):
    """s[g..d] est-il un palindrome ?"""
    if g >= d:
        return True
    return s[g] == s[d] and est_palindrome(s, g + 1, d - 1)

print(somme([3, 1, 4, 1, 5]), maximum([3, 1, 4, 1, 5]), est_palindrome("kayak", 0, 4))
```

## 5. L'arbre des appels et le coût

Quand une fonction fait **plusieurs** appels récursifs, on représente l'exécution par un **arbre des appels**.
La suite de Fibonacci ($F_0 = 0$, $F_1 = 1$, $F_n = F_{n-1} + F_{n-2}$) programmée naïvement :

```python exec
appels = 0
def fib(n):
    global appels
    appels += 1
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

for n in [5, 10, 20, 25]:
    appels = 0
    print(n, fib(n), appels, "appels")
```

```mermaid legende="Arbre des appels de fib(5) : fib(3) est calculé 2 fois, fib(2) 3 fois…"
graph TD
  A["fib(5)"] --> B["fib(4)"]
  A --> C["fib(3)"]
  B --> D["fib(3)"]
  B --> E["fib(2)"]
  C --> F["fib(2)"]
  C --> G["fib(1)"]
  D --> H["fib(2)"]
  D --> I["fib(1)"]
  E --> J["fib(1)"]
  E --> K["fib(0)"]
  F --> L["fib(1)"]
  F --> M["fib(0)"]
  H --> N["fib(1)"]
  H --> O["fib(0)"]
```

Le nombre d'appels $A(n)$ vérifie $A(n) = A(n-1) + A(n-2) + 1$ : il croît comme $F_n$, donc **exponentiellement**
(environ $1{,}618^n$). Les mêmes valeurs sont recalculées des milliers de fois. La **mémoïsation** (retenir les valeurs
déjà calculées) supprime ces redondances : c'est le point de départ de la **programmation dynamique**.

### Relations de récurrence usuelles

Le coût $C(n)$ d'une fonction récursive s'exprime par une **relation de récurrence**, qu'on résout :

| Relation (avec $C$ de base constant)  | Exemple                          | Solution |
|---------------------------------------|----------------------------------|----------|
| $C(n) = C(n-1) + 1$                   | factorielle, somme d'une liste   | $\Theta(n)$ |
| $C(n) = C(n-1) + n$                   | tri par sélection récursif       | $\Theta(n^2)$ |
| $C(n) = C(n/2) + 1$                   | dichotomie, puissance rapide     | $\Theta(\log n)$ |
| $C(n) = 2\,C(n/2) + n$                | tri fusion                       | $\Theta(n \log n)$ |
| $C(n) = 2\,C(n-1) + 1$                | tours de Hanoï                   | $\Theta(2^n)$ |
| $C(n) = C(n-1) + C(n-2) + 1$          | Fibonacci naïf                   | $\Theta(\varphi^n)$ |

Pour résoudre, on **déroule** : $C(n) = C(n-1) + 1 = C(n-2) + 2 = \dots = C(0) + n$.

## 6. Récursif ou itératif ?

Tout algorithme récursif peut s'écrire avec des boucles (éventuellement en gérant soi-même une pile), et inversement.
La version récursive est souvent plus **lisible** et plus facile à **prouver** (récurrence) ; la version itérative évite
la limite de profondeur et le coût des appels. En Python, on évite la récursion quand la profondeur peut dépasser
quelques centaines (parcourir une liste de 10 000 éléments récursivement échoue).

```python exec
import sys
print(sys.getrecursionlimit())
```

:::prof
La récursivité est au programme de terminale NSI. Les obstacles classiques : croire que la fonction « boucle »
(il faut insister sur les **différentes copies** des variables locales, une par appel), oublier le cas de base, ou
l'écrire après l'appel récursif. Les poupées russes, la trace avec la pile dessinée, et l'outil Python Tutor aident
beaucoup. La définition récursive des listes (vide ou tête + queue) prépare les structures de données.
:::

## Exemple guidé

**Problème (classique d'écrit).** Les **tours de Hanoï** : `n` disques de tailles différentes sont empilés sur la tige
A, du plus grand en bas au plus petit en haut. Il faut les déplacer sur la tige C, un disque à la fois, sans jamais
poser un disque sur un plus petit, en s'aidant de la tige B. Écrire un algorithme, et montrer qu'il fait $2^n - 1$
déplacements.

**1. L'idée récursive.** Pour déplacer `n` disques de A vers C : déplacer les `n - 1` disques du dessus de A vers B
(en s'aidant de C), puis déplacer le grand disque de A vers C, puis déplacer les `n - 1` disques de B vers C (en s'aidant
de A). Pour `n = 0`, il n'y a rien à faire.

```python exec
def hanoi(n, depart, arrivee, aide, deplacements):
    if n == 0:
        return
    hanoi(n - 1, depart, aide, arrivee, deplacements)
    deplacements.append((depart, arrivee))
    hanoi(n - 1, aide, arrivee, depart, deplacements)

d = []
hanoi(3, "A", "C", "B", d)
print(len(d), d)
```

**2. Correction** (par récurrence sur `n`). Pour `n = 0` : rien à faire, c'est juste. Supposons que l'appel pour
`n - 1` disques déplace correctement une pile de `n - 1` disques sans enfreindre la règle, quels que soient les
disques plus grands en dessous (ils ne gênent pas, puisqu'ils sont plus grands). Alors : le premier appel libère le
grand disque ; il est posé sur C, vide ; le second appel pose les `n - 1` petits disques par-dessus, ce qui est permis.

**3. Nombre de déplacements.** $D(0) = 0$ et $D(n) = 2 D(n-1) + 1$. Montrons $D(n) = 2^n - 1$ par récurrence :
$D(0) = 0 = 2^0 - 1$ ; si $D(n-1) = 2^{n-1} - 1$, alors $D(n) = 2(2^{n-1} - 1) + 1 = 2^n - 1$.

**4. Optimalité (idée).** Pour déplacer le plus grand disque, les `n - 1` autres doivent tous être sur la troisième
tige : il faut donc au moins $D_{\min}(n-1)$ déplacements avant, 1 pour le grand, et au moins $D_{\min}(n-1)$ après.
D'où $D_{\min}(n) \ge 2 D_{\min}(n-1) + 1$ : l'algorithme est optimal. Avec 64 disques, $2^{64} - 1 \approx 1{,}8
\times 10^{19}$ déplacements : à un par seconde, plus de 500 milliards d'années.

## L'essentiel

- Fonction récursive = cas de base (sans appel) + cas récursif sur une entrée plus petite.
- Chaque appel a ses propres variables ; les appels en attente forment la **pile d'appels** (limite ≈ 1000 en Python).
- Terminaison : variant entier positif strictement décroissant d'un appel à l'autre (attention à la précondition).
- Correction : récurrence sur la taille (cas de base, puis hérédité en supposant les appels récursifs corrects).
- Plusieurs appels → **arbre des appels** ; redondances (Fibonacci) → coût exponentiel → mémoïsation.
- Coût = relation de récurrence : $C(n-1)+1 \to n$, $C(n/2)+1 \to \log n$, $2C(n/2)+n \to n \log n$, $2C(n-1)+1 \to 2^n$.

## Exercices

::::exercice[Oubli du cas de base]{niveau=1}
Que se passe-t-il à l'appel `f(3)` ?

```python
def f(n):
    return n + f(n - 1)
```

- [ ] la fonction renvoie 6
- [ ] la fonction renvoie 0
- [x] une erreur `RecursionError` après de nombreux appels
- [ ] le programme tourne indéfiniment sans erreur

:::corrige
Il n'y a pas de cas de base : `f(3)` appelle `f(2)`, `f(1)`, `f(0)`, `f(-1)`… La pile d'appels grandit jusqu'à sa limite
et Python lève `RecursionError` (« maximum recursion depth exceeded »).
:::
::::

::::exercice[Compter les appels]{niveau=1}
Avec la fonction `fact` du cours (cas de base `n == 0`), combien d'appels à `fact` l'instruction `fact(5)` provoque-t-elle,
y compris le premier ?

- [ ] 5
- [x] 6
- [ ] 120
- [ ] 1

:::corrige
`fact(5)`, `fact(4)`, `fact(3)`, `fact(2)`, `fact(1)`, `fact(0)` : 6 appels, soit $n + 1$ en général.
:::
::::

::::exercice[Somme des chiffres]{niveau=2}
Écris une fonction **récursive** `somme_chiffres(n)` qui renvoie la somme des chiffres de l'entier `n >= 0`
(par exemple 1 + 9 + 4 + 8 = 22 pour 1948). Pas de boucle, pas de conversion en chaîne.

```python depart
def somme_chiffres(n):
    ...
```

```python tests
assert somme_chiffres(1948) == 22, "1948"
assert somme_chiffres(0) == 0, "zéro"
assert somme_chiffres(7) == 7, "un chiffre"
assert somme_chiffres(10**30) == 1, "très grand nombre"
```

:::corrige
```python solution
def somme_chiffres(n):
    if n < 10:
        return n
    return n % 10 + somme_chiffres(n // 10)
```
Cas de base : un seul chiffre. Cas récursif : dernier chiffre + somme des chiffres du reste. Variant : `n` (ou son
nombre de chiffres), qui diminue strictement. Nombre d'appels : le nombre de chiffres de `n`.
:::
::::

::::exercice[Puissance rapide récursive]{niveau=2}
Écris `puissance(x, n)` récursive, pour `n >= 0`, en utilisant $x^n = (x^{n/2})^2$ si `n` est pair et
$x^n = x \cdot (x^{(n-1)/2})^2$ si `n` est impair. Un seul appel récursif par appel !

```python depart
def puissance(x, n):
    ...
```

```python tests
assert puissance(2, 10) == 1024, "2^10"
assert puissance(3, 0) == 1, "exposant nul"
assert puissance(5, 1) == 5, "exposant 1"
assert puissance(3, 13) == 1594323, "3^13"
assert puissance(2, 1000) == 2 ** 1000, "grand exposant (profondeur ~ 10)"
```

:::corrige
```python solution
def puissance(x, n):
    if n == 0:
        return 1
    moitie = puissance(x, n // 2)
    if n % 2 == 0:
        return moitie * moitie
    return x * moitie * moitie
```
Écrire `puissance(x, n // 2) * puissance(x, n // 2)` ferait **deux** appels et redonnerait un coût linéaire
($C(n) = 2C(n/2) + 1$). Avec un seul appel, $C(n) = C(n/2) + O(1)$, soit $O(\log n)$ multiplications.
:::
::::

::::exercice[Palindrome récursif]{niveau=2}
Écris `palindrome(s)` récursive, qui renvoie `True` si la chaîne `s` se lit pareil dans les deux sens. Tu peux utiliser
une fonction auxiliaire avec des indices.

```python depart
def palindrome(s):
    ...
```

```python tests
assert palindrome("radar") == True, "impair"
assert palindrome("abba") == True, "pair"
assert palindrome("abca") == False, "pas un palindrome"
assert palindrome("") == True, "vide"
assert palindrome("x") == True, "un caractère"
```

:::corrige
```python solution
def palindrome(s):
    def aux(g, d):
        if g >= d:
            return True
        return s[g] == s[d] and aux(g + 1, d - 1)
    return aux(0, len(s) - 1)
```
La version `palindrome(s[1:-1])` est correcte mais copie la chaîne à chaque appel : coût quadratique. Avec les indices,
le coût est linéaire. Variant : `d - g`.
:::
::::

::::exercice[Toutes les parties d'un ensemble]{niveau=3}
Écris `parties(t)` qui renvoie la liste de toutes les sous-listes de `t` (les « parties »), l'ordre des éléments de `t`
étant conservé dans chaque sous-liste. Idée : les parties de `t` sont les parties de `t[1:]`, et ces mêmes parties
auxquelles on ajoute `t[0]` en tête.

```python depart
def parties(t):
    ...
```

```python tests
assert sorted(parties([1, 2])) == [[], [1], [1, 2], [2]], "deux éléments"
assert parties([]) == [[]], "ensemble vide : une seule partie"
assert len(parties([1, 2, 3, 4, 5])) == 32, "2^5 parties"
assert [3, 5] in parties([3, 4, 5]), "une partie non contiguë"
```

:::corrige
```python solution
def parties(t):
    if len(t) == 0:
        return [[]]
    reste = parties(t[1:])
    return reste + [[t[0]] + p for p in reste]
```
Si `t` a $n$ éléments, il a $2^n$ parties : $P(n) = 2 P(n-1)$ avec $P(0) = 1$. Le coût est donc au moins exponentiel,
ce qui est inévitable puisqu'il faut toutes les écrire.
:::
::::

::::exercice[Chemins dans une grille]{niveau=3}
On se déplace dans une grille de `l` lignes et `c` colonnes, de la case en haut à gauche à la case en bas à droite, en
allant uniquement vers la droite ou vers le bas. Écris `nb_chemins(l, c)` récursive (`l, c >= 1`).

```python depart
def nb_chemins(l, c):
    ...
```

```python tests
assert nb_chemins(1, 1) == 1, "une seule case"
assert nb_chemins(2, 2) == 2, "grille 2 x 2"
assert nb_chemins(3, 3) == 6, "grille 3 x 3"
assert nb_chemins(3, 7) == 28, "grille 3 x 7"
assert nb_chemins(1, 10) == 1, "une seule ligne"
```

:::indice
Le dernier pas arrive soit d'en haut, soit de la gauche.
:::

:::corrige
```python solution
def nb_chemins(l, c):
    if l == 1 or c == 1:
        return 1
    return nb_chemins(l - 1, c) + nb_chemins(l, c - 1)
```
On retrouve le triangle de Pascal : $\text{nb\_chemins}(l, c) = \binom{l + c - 2}{l - 1}$. Mais comme pour Fibonacci,
l'arbre des appels est exponentiel : pour une grille 16 × 16, il y a plus de 300 millions d'appels. La programmation
dynamique résout le problème en $\Theta(l \times c)$.
:::
::::

::::exercice[Analyser une fonction récursive]{niveau=4 duree=25}
On considère la fonction suivante, pour une liste `t` et deux indices `g <= d` valides.

```python
def maxi(t, g, d):
    if g == d:
        return t[g]
    m = (g + d) // 2
    a = maxi(t, g, m)
    b = maxi(t, m + 1, d)
    return a if a >= b else b
```

1. Que renvoie `maxi(t, 0, len(t) - 1)` ? Dessine l'arbre des appels pour `t = [4, 9, 2, 7, 5]`.
2. Prouve la terminaison (donne un variant) et la correction (par récurrence forte sur la taille `n = d - g + 1`).
3. Soit $C(n)$ le nombre de comparaisons `a >= b`. Établis la relation de récurrence (pour $n$ puissance de 2) et
   résous-la. Compare avec la recherche itérative du maximum.
4. Quelle est la hauteur maximale de la pile d'appels ? Est-ce un problème pour une liste d'un million d'éléments ?

:::criteres
- La fonction renvoie le maximum de `t[g..d]`, donc de toute la liste ; l'arbre des appels est correct (feuilles = les 5 éléments).
- Variant : `d - g` (taille de la zone − 1), qui diminue strictement à chaque appel car `g <= m < d` quand `g < d`.
- Récurrence forte : cas de base `g == d` ; hérédité en supposant les deux appels corrects sur des zones plus petites, le plus grand des deux maxima est le maximum de la zone.
- $C(1) = 0$ et $C(n) = 2C(n/2) + 1$, d'où $C(n) = n - 1$ : autant que l'algorithme itératif.
- La profondeur de la pile est $\lceil \log_2 n \rceil + 1$ (environ 21 pour un million) : aucun problème, contrairement à une récursion linéaire.
:::

:::corrige
1. La fonction renvoie le **maximum** de `t[g..d]`. Pour `[4, 9, 2, 7, 5]` : `maxi(0,4)` appelle `maxi(0,2)` et
   `maxi(3,4)` ; `maxi(0,2)` appelle `maxi(0,1)` (qui appelle `maxi(0,0)` = 4 et `maxi(1,1)` = 9) et `maxi(2,2)` = 2 ;
   `maxi(3,4)` appelle `maxi(3,3)` = 7 et `maxi(4,4)` = 5. Remontée : 9, 9, 7, puis **9**.
   ```mermaid
   graph TD
     A["maxi(0,4)"] --> B["maxi(0,2)"]
     A --> C["maxi(3,4)"]
     B --> D["maxi(0,1)"]
     B --> E["maxi(2,2) = 2"]
     D --> F["maxi(0,0) = 4"]
     D --> G["maxi(1,1) = 9"]
     C --> H["maxi(3,3) = 7"]
     C --> I["maxi(4,4) = 5"]
   ```
2. **Terminaison** : si `g < d`, alors `g <= m < d`, donc les zones `[g, m]` et `[m+1, d]` sont strictement plus petites :
   `d - g` est un variant entier positif. **Correction** par récurrence forte sur $n = d - g + 1$. Si $n = 1$ (`g == d`),
   le maximum de `t[g..g]` est `t[g]`. Si $n \ge 2$, supposons la fonction correcte pour toutes les zones de taille
   $< n$ : `a` est le maximum de `t[g..m]` et `b` celui de `t[m+1..d]` ; le plus grand des deux est le maximum de leur
   réunion `t[g..d]`.
3. $C(1) = 0$ et, pour $n$ puissance de 2, $C(n) = 2C(n/2) + 1$. En déroulant : $C(n) = 2^k C(n/2^k) + (2^k - 1)$ ;
   pour $2^k = n$, $C(n) = n - 1$. (On le prouve aussi par récurrence : $2(n/2 - 1) + 1 = n - 1$.) C'est exactement le
   nombre de comparaisons de l'algorithme itératif : diviser pour régner ne gagne rien ici, mais ne perd rien.
4. Chaque appel divise la zone par 2 : la profondeur de la pile est $\lceil \log_2 n \rceil + 1$, soit 21 pour
   $n = 10^6$. Aucun risque de `RecursionError`, contrairement à `maximum(t, i)` qui s'appelle sur `i + 1`
   (profondeur `n`).
:::
::::
