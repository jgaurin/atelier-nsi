---
titre: Parcours séquentiel d'un tableau
resume: "Le cours de première NSI sur les algorithmes de parcours séquentiel : recherche d'une occurrence, recherche d'un extremum, calcul d'une moyenne, comptage ; écriture avec boucle for ou while, coût linéaire, et premiers raisonnements de correction avec un invariant."
duree: 45
objectifs:
  - "Écrire un algorithme de recherche d'une occurrence, d'un extremum, d'une moyenne"
  - "Choisir entre boucle for et boucle while (arrêt anticipé)"
  - "Compter le nombre d'opérations et justifier un coût linéaire"
  - "Énoncer un invariant de boucle simple"
prerequis: [nsi-premiere/tableaux, nsi-premiere/specification]
programme: [nsi1-algo]
cartes:
  - q: "Qu'est-ce qu'un parcours séquentiel ?"
    r: "Examiner les éléments d'un tableau **un par un**, du premier au dernier (ou jusqu'à trouver ce qu'on cherche)."
  - q: "Coût d'un parcours séquentiel d'un tableau de taille n ?"
    r: "**Linéaire** : de l'ordre de n opérations dans le pire cas. Si n double, le temps double."
  - q: "Pire cas de la recherche d'une occurrence ?"
    r: "L'élément est **absent** (ou en dernière position) : on examine les n éléments."
  - q: "Comment initialiser la recherche du maximum ?"
    r: "Avec le **premier élément** du tableau (`m = t[0]`), pas avec 0 (faux si tous les nombres sont négatifs)."
  - q: "Invariant de la recherche du maximum ?"
    r: "Après avoir traité les éléments d'indice 0 à i, `m` est le maximum de `t[0..i]`. À la fin, c'est le maximum du tableau."
  - q: "Quand préférer un while à un for ?"
    r: "Quand on veut pouvoir **s'arrêter avant la fin** (dès que l'élément est trouvé) sans utiliser `return` dans une boucle `for`."
---

Les algorithmes de **parcours séquentiel** sont les plus simples de l'année, mais ils sont la base de tout le reste : on parcourt le tableau
case par case en mettant à jour une ou plusieurs variables. Trois schémas sont au programme : chercher une valeur, chercher un extremum,
calculer une moyenne. On en profite pour introduire deux notions fondamentales : le **coût** et l'**invariant**.

## Ce que dit le programme

Contenus : *parcours séquentiel d'un tableau*. Capacités attendues : **écrire un algorithme de recherche d'une occurrence** sur des valeurs de
type quelconque ; **écrire un algorithme de recherche d'un extremum, de calcul d'une moyenne**. Le programme précise qu'on **montre que le coût
est linéaire**.

## 1. Rechercher une occurrence

Question : la valeur `x` est-elle dans le tableau `t` ? Et si oui, où ?

```python exec
def appartient(t, x):
    """Renvoie True si x est un élément de t."""
    for v in t:
        if v == x:
            return True
    return False

def indice(t, x):
    """Renvoie l'indice de la première occurrence de x dans t, ou -1."""
    for i in range(len(t)):
        if t[i] == x:
            return i
    return -1

print(appartient([4, 8, 1], 8), indice([4, 8, 1], 8), indice([4, 8, 1], 5))
```

:::attention[Le return False mal placé]
Le `return False` doit être **après** la boucle : on ne peut conclure à l'absence qu'une fois **tout** le tableau examiné. Placé dans un
`else` à l'intérieur de la boucle, il arrêterait la recherche dès le premier élément différent.
:::

Version avec `while`, qui s'arrête dès qu'on a trouvé, sans `return` dans la boucle :

```python exec
def indice_while(t, x):
    i = 0
    while i < len(t) and t[i] != x:
        i = i + 1
    if i < len(t):
        return i
    return -1

print(indice_while([4, 8, 1], 1), indice_while([4, 8, 1], 7))
```

L'ordre des conditions compte : `i < len(t)` est testé **avant** `t[i]`, et `and` n'évalue pas la suite si la première partie est fausse
(évaluation paresseuse). Inversées, elles provoqueraient une `IndexError`.

## 2. Rechercher un extremum

```python exec
def maximum(t):
    """Renvoie le plus grand élément de t (non vide)."""
    m = t[0]
    for v in t:
        if v > m:
            m = v
    return m

def indice_minimum(t):
    """Renvoie l'indice du plus petit élément de t (non vide)."""
    i_min = 0
    for i in range(1, len(t)):
        if t[i] < t[i_min]:
            i_min = i
    return i_min

print(maximum([-4, -1, -7]), indice_minimum([5, 2, 9, 2]))
```

On initialise avec le **premier élément**, jamais avec 0 : avec `m = 0`, le maximum de `[-4, -1, -7]` serait 0, qui n'est même pas dans le
tableau.

## 3. Calculer une moyenne (et compter)

```python exec
def moyenne(t):
    """Renvoie la moyenne de t (non vide)."""
    somme = 0
    for v in t:
        somme = somme + v
    return somme / len(t)

def compter(t, x):
    """Renvoie le nombre d'occurrences de x dans t."""
    n = 0
    for v in t:
        if v == x:
            n = n + 1
    return n

print(moyenne([12, 15, 9]), compter([1, 3, 1, 1], 1))
```

Ces schémas marchent sur des valeurs de **tout type** : chercher un mot dans un tableau de chaînes, le plus jeune élève dans une table, etc.

## 4. Le coût est linéaire

On mesure l'efficacité d'un algorithme par le **nombre d'opérations élémentaires** (comparaisons, affectations) en fonction de la taille `n`
des données.

- La recherche du maximum fait **exactement** n − 1 comparaisons `v > m` (une par élément après le premier).
- La recherche d'une occurrence fait au plus n comparaisons : c'est le **pire cas** (élément absent). Au mieux, une seule (élément en
  première position).

Dans tous ces algorithmes, le nombre d'opérations est **proportionnel à n** : le coût est **linéaire**. Si le tableau est 10 fois plus grand, le
temps est environ 10 fois plus long.

```python exec
import time

def maximum(t):
    m = t[0]
    for v in t:
        if v > m:
            m = v
    return m

for n in (100_000, 200_000, 400_000):
    t = list(range(n))
    debut = time.perf_counter()
    maximum(t)
    print(n, "éléments :", round((time.perf_counter() - debut) * 1000, 1), "ms")
```

Les mesures varient d'une exécution à l'autre, mais le temps double à peu près quand n double.

## 5. Pourquoi c'est correct : l'invariant

Comment être **sûr** que `maximum` est correct, pour **tous** les tableaux ? On utilise un **invariant** : une propriété vraie à chaque tour de
boucle.

> Invariant : après avoir traité les éléments `t[0]`, …, `t[i]`, la variable `m` contient le maximum de ces éléments.

- **Au départ**, `m = t[0]` : c'est bien le maximum de `t[0]` seul.
- **À chaque tour**, si le nouvel élément est plus grand, `m` le prend ; sinon il reste : `m` est le maximum des éléments déjà vus.
- **À la fin**, tous les éléments ont été vus : `m` est le maximum du tableau.

C'est la première rencontre avec la preuve d'algorithme, approfondie avec les tris.

## Les erreurs classiques des élèves

:::attention[Ce que tu verras en classe]
- **`return False` dans un `else` de la boucle** : la recherche s'arrête au premier élément.
- **Initialiser le maximum à 0** (faux pour des nombres négatifs).
- **Confondre l'indice et la valeur** du maximum.
- **Diviser par `len(t)` dans la boucle**, ou oublier la division.
- **Inverser les conditions du `while`** (`t[i] != x and i < len(t)` provoque une `IndexError`).
- **Penser que le coût dépend de la machine** : on compte les opérations, pas les secondes.
:::

## En classe

:::methode[Activités qui marchent]
1. **Débranché** : des cartes face cachée ; pour trouver la plus grande, on n'en retourne qu'une à la fois en gardant la meilleure en main.
   C'est l'algorithme du maximum, et on compte les comparaisons.
2. **Variations sur une table** réelle : le pays le plus peuplé, la moyenne des températures, le nombre de jours de pluie.
3. **Mesurer** le temps pour n, 2n, 4n et tracer la courbe : une droite.
4. **Chasse au bug** sur un `return False` mal placé.
:::

## L'essentiel

- **Occurrence** : parcourir, renvoyer dès qu'on trouve ; conclure à l'absence **après** la boucle. Avec `while` : `i < len(t)` en premier.
- **Extremum** : initialiser avec **t[0]** ; garder l'indice si on veut la position.
- **Moyenne, comptage** : accumuler dans une variable, diviser à la fin.
- **Coût linéaire** : de l'ordre de n opérations ; pire cas de la recherche : élément absent.
- **Invariant** : propriété vraie à chaque tour, qui prouve le résultat final.

## Exercices

::::exercice[Grand QCM : parcours séquentiel]{niveau=1 type=quiz}
Dix questions sur les parcours de tableaux.

1. Combien de comparaisons fait la recherche d'un élément **absent** dans un tableau de 50 éléments ?

   - [ ] 1
   - [ ] 25
   - [x] 50
   - [ ] 2 500

   > Il faut tout examiner pour conclure à l'absence.

1. Quel est le coût de la recherche du maximum dans un tableau de taille n ?

   - [ ] constant
   - [x] linéaire
   - [ ] quadratique
   - [ ] logarithmique

   > n − 1 comparaisons.

1. Pourquoi initialise-t-on le maximum avec `t[0]` plutôt qu'avec 0 ?

   - [ ] pour aller plus vite
   - [x] parce que 0 serait faux si tous les nombres sont négatifs
   - [ ] parce que 0 provoque une erreur
   - [ ] c'est une convention sans importance

   > Le résultat serait 0, qui n'est même pas dans le tableau.

1. Où placer `return False` dans la fonction `appartient` ?

   - [ ] dans un `else` dans la boucle
   - [x] après la boucle
   - [ ] avant la boucle
   - [ ] nulle part

   > On ne peut conclure à l'absence qu'après avoir tout examiné.

1. Pourquoi écrire `while i < len(t) and t[i] != x` dans cet ordre ?

   - [ ] pour la lisibilité seulement
   - [x] pour ne jamais lire `t[i]` quand i est hors du tableau
   - [ ] parce que `and` est commutatif
   - [ ] pour aller plus vite

   > Si `i < len(t)` est faux, Python n'évalue pas `t[i]`.

1. Si le tableau est 3 fois plus grand, le temps d'un algorithme linéaire est environ :

   - [ ] le même
   - [x] 3 fois plus grand
   - [ ] 9 fois plus grand
   - [ ] 3 fois plus petit

   > Coût proportionnel à n.

1. Quel est le meilleur cas pour la recherche d'une occurrence ?

   - [x] l'élément est en première position
   - [ ] l'élément est absent
   - [ ] l'élément est au milieu
   - [ ] le tableau est trié

   > Une seule comparaison suffit.

1. Que renvoie `indice_minimum([5, 2, 9, 2])` avec la fonction du cours ?

   - [ ] 2
   - [x] 1
   - [ ] 3
   - [ ] [1, 3]

   > La comparaison stricte garde la première occurrence du minimum.

1. Quel est l'invariant de la recherche du maximum ?

   - [ ] m est toujours égal à t[0]
   - [x] m est le maximum des éléments déjà examinés
   - [ ] m augmente à chaque tour
   - [ ] m est le dernier élément examiné

   > Il est vrai au départ, conservé à chaque tour, et donne le résultat à la fin.

1. Ces algorithmes de parcours marchent-ils sur un tableau de chaînes ?

   - [ ] non, seulement sur des nombres
   - [x] oui, les chaînes se comparent avec `==`, `<`, `>`
   - [ ] seulement la recherche du maximum
   - [ ] seulement la moyenne

   > Recherche et extremum marchent sur tout type comparable ; la moyenne exige des nombres.
::::

::::exercice[Minimum et maximum en un seul parcours]{niveau=1}
Écris `extremums(t)` qui renvoie le couple `(minimum, maximum)` d'un tableau non vide, en **un seul** parcours, sans `min` ni `max`.

```python depart
def extremums(t):
    ...
```

```python tests
assert extremums([4, 9, 1, 7]) == (1, 9), "cas général"
assert extremums([5]) == (5, 5), "un élément"
assert extremums([-3, -8, -1]) == (-8, -1), "négatifs"
```

:::corrige
```python solution
def extremums(t):
    mini = t[0]
    maxi = t[0]
    for v in t:
        if v < mini:
            mini = v
        if v > maxi:
            maxi = v
    return (mini, maxi)
```

Un seul parcours, deux variables mises à jour : le coût reste linéaire.
:::
::::

::::exercice[Dernière occurrence et toutes les occurrences]{niveau=2}
Écris `derniere(t, x)` qui renvoie l'indice de la **dernière** occurrence de `x` dans `t` (ou `-1`), et `positions(t, x)` qui renvoie le
tableau de **tous** les indices où `x` apparaît.

```python depart
def derniere(t, x):
    ...

def positions(t, x):
    ...
```

```python tests
assert derniere([3, 7, 3, 1], 3) == 2, "dernière occurrence"
assert derniere([3, 7], 5) == -1, "absent"
assert derniere([], 5) == -1, "vide"
assert positions([3, 7, 3, 1, 3], 3) == [0, 2, 4], "toutes les positions"
assert positions([1, 2], 9) == [], "aucune"
```

:::corrige
```python solution
def derniere(t, x):
    resultat = -1
    for i in range(len(t)):
        if t[i] == x:
            resultat = i
    return resultat

def positions(t, x):
    return [i for i in range(len(t)) if t[i] == x]
```

Pour la dernière occurrence, on ne s'arrête pas : on retient le dernier indice trouvé. On pourrait aussi parcourir à l'envers
(`range(len(t) - 1, -1, -1)`) et s'arrêter au premier trouvé.
:::
::::

::::exercice[Le plus jeune de la classe]{niveau=2}
Une table d'élèves est un tableau de dictionnaires `{"nom": ..., "naissance": (annee, mois, jour)}`. Écris `plus_jeune(classe)` qui renvoie le
nom de l'élève le plus jeune (date de naissance la plus **récente**). Les p-uplets se comparent dans l'ordre : `(2009, 5, 1) > (2009, 3, 20)`.

```python depart
def plus_jeune(classe):
    ...
```

```python tests
classe = [
    {"nom": "Léa", "naissance": (2009, 3, 20)},
    {"nom": "Tom", "naissance": (2009, 11, 2)},
    {"nom": "Inès", "naissance": (2008, 12, 30)},
]
assert plus_jeune(classe) == "Tom", "le plus jeune"
assert plus_jeune([{"nom": "Noé", "naissance": (2010, 1, 1)}]) == "Noé", "un seul élève"
```

:::corrige
```python solution
def plus_jeune(classe):
    meilleur = classe[0]
    for e in classe:
        if e["naissance"] > meilleur["naissance"]:
            meilleur = e
    return meilleur["nom"]
```

C'est une recherche de **maximum** sur des valeurs qui ne sont pas des nombres : on compare les dates (p-uplets), on garde la ligne entière.
:::
::::

::::exercice[Compter les opérations]{niveau=2}
On cherche une valeur dans un tableau de 1 000 éléments avec la recherche séquentielle. (a) Combien de comparaisons dans le meilleur cas, le pire
cas ? (b) Si l'élément est présent et que toutes les positions sont équiprobables, combien en moyenne ? (c) Un tableau de 1 000 éléments est
traité en 0,2 ms ; combien de temps environ pour un million d'éléments ? Justifie.

:::criteres
- (a) Meilleur cas : 1 comparaison (première position) ; pire cas : 1 000 (absent ou dernière position).
- (b) Environ 500 (la moitié en moyenne) ; précisément (1 + 1 000) / 2 = 500,5.
- (c) Environ 200 ms : coût linéaire, 1 000 fois plus d'éléments, 1 000 fois plus de temps.
:::

:::corrige
(a) **Meilleur cas** : l'élément est en première position, **1** comparaison. **Pire cas** : il est absent ou en dernière position, **1 000**
comparaisons. (b) S'il est en position k (de 1 à 1 000), il faut k comparaisons ; en moyenne (1 + 2 + … + 1 000) / 1 000 = 1 001 / 2 ≈
**500**. (c) Le coût est **linéaire** : un million d'éléments, c'est 1 000 fois plus, donc environ 1 000 × 0,2 ms = **200 ms**. On verra avec la
dichotomie qu'un tableau **trié** permet de faire beaucoup mieux.
:::
::::
