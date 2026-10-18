---
titre: Listes et tableaux
resume: Ranger plusieurs valeurs dans une liste, y accéder par indice, la parcourir, la modifier et écrire les algorithmes de parcours classiques.
duree: 75
objectifs:
  - Accéder aux éléments d'une liste par indice (positif ou négatif) et par tranche
  - Parcourir une liste par valeur, par indice ou avec `enumerate`
  - Modifier une liste (`append`, `pop`, affectation d'un élément) en connaissant le coût des opérations
  - Construire des listes par compréhension et manipuler des tableaux à deux dimensions
  - Écrire les parcours séquentiels classiques (somme, maximum, recherche, comptage)
prerequis: [python/fonctions]
programme: [lp-python, asd-lineaires, asd-recherche-tris, id-types-simples, nsi1-construits, nsi1-algo]
cartes:
  - q: Quels sont les indices valides d'une liste de longueur `n` ?
    r: "De `0` à `n - 1`, ou de `-n` à `-1` en partant de la fin (`t[-1]` est le dernier)."
  - q: Que vaut `[10, 20, 30, 40, 50][1:3]` ?
    r: "`[20, 30]` : la tranche va de l'indice 1 inclus à l'indice 3 exclu."
  - q: Coût de `t.append(x)` et de `t.insert(0, x)` sur une liste de taille `n` ?
    r: "`append` : temps constant (amorti). `insert(0, x)` : proportionnel à `n` (il faut décaler tous les éléments)."
  - q: Que vaut `[x * x for x in range(5) if x % 2 == 1]` ?
    r: "`[1, 9]`."
  - q: Pourquoi ne pas créer une grille avec `[[0] * 3] * 2` ?
    r: "Les deux lignes sont le **même** objet liste : modifier `g[0][0]` modifie aussi `g[1][0]`. Écrire `[[0] * 3 for _ in range(2)]`."
  - q: À quoi sert `enumerate(t)` ?
    r: "À parcourir à la fois les indices et les valeurs : `for i, x in enumerate(t):`."
  - q: Coût d'une recherche séquentielle dans une liste de `n` éléments ?
    r: "Au pire `n` comparaisons (élément absent ou en dernière position), au mieux 1 (en première position)."
  - q: Quelle valeur initiale pour chercher le maximum d'une liste non vide ?
    r: "Son premier élément `t[0]` (et pas 0, faux si tous les éléments sont négatifs)."
---

Une classe de 30 élèves, les températures d'un mois, les pixels d'une image, les cases d'un plateau de jeu :
on manipule très souvent **beaucoup de valeurs du même genre**. Créer 30 variables `note1`, `note2`… serait absurde.
On range ces valeurs dans une **liste** (le programme de NSI parle de **tableau**), une seule variable qui contient
une suite ordonnée de valeurs, chacune repérée par sa position.

## 1. Une liste, des indices

```python exec
notes = [12, 8.5, 15, 10, 17]
print(notes)
print(len(notes))          # nombre d'éléments
print(notes[0], notes[2])  # le premier, le troisième
print(notes[-1])           # le dernier
```

Les éléments sont numérotés à partir de **0**. Pour une liste de longueur `n`, les indices valides vont de
`0` à `n - 1` ; les indices négatifs comptent depuis la fin (`-1` est le dernier).

<div class="cases"><span>12<small>0 / −5</small></span><span>8.5<small>1 / −4</small></span><span>15<small>2 / −3</small></span><span>10<small>3 / −2</small></span><span>17<small>4 / −1</small></span></div>

```python exec erreur
notes = [12, 8.5, 15, 10, 17]
print(notes[5])     # il n'y a pas d'indice 5 : IndexError
```

:::definition
Un **tableau** est une suite finie d'éléments repérés par un **indice** entier, auquel on accède en temps constant
quelle que soit sa position. En Python, ce rôle est joué par le type `list`, qui est de plus **dynamique**
(sa taille peut changer) et peut contenir des valeurs de types différents (mais on évite de les mélanger).
:::

## 2. Parcourir une liste

Trois façons de parcourir, selon ce dont on a besoin :

```python exec
fruits = ["pomme", "kiwi", "poire"]

for f in fruits:                    # par valeur : quand l'indice ne sert pas
    print(f)

for i in range(len(fruits)):        # par indice : quand on a besoin de i (voisins, modification…)
    print(i, fruits[i])

for i, f in enumerate(fruits):      # les deux à la fois
    print(i, f)
```

Le test d'appartenance `in` parcourt la liste pour nous : `"kiwi" in fruits` vaut `True`.

## 3. Modifier une liste

Une liste est **modifiable** (on dit **mutable**) : on peut changer un élément, en ajouter, en retirer.

```python exec
t = [3, 1, 4]
t[1] = 10          # remplace l'élément d'indice 1
t.append(5)        # ajoute à la fin
t.insert(0, 7)     # insère en position 0 (décale tout le reste)
dernier = t.pop()  # retire et renvoie le dernier
t.remove(4)        # retire la première occurrence de la valeur 4
print(t, dernier)
```

| Opération            | Effet                                   | Coût (liste de taille `n`) |
|----------------------|-----------------------------------------|----------------------------|
| `t[i]`, `t[i] = v`   | lire, modifier l'élément d'indice `i`  | constant                   |
| `t.append(v)`        | ajouter à la fin                        | constant (en moyenne)      |
| `t.pop()`            | retirer le dernier                      | constant                   |
| `t.insert(i, v)`, `t.pop(i)` | insérer, retirer à l'indice `i` | proportionnel à `n - i` (décalage) |
| `v in t`, `t.index(v)`, `t.remove(v)` | chercher une valeur    | proportionnel à `n`        |
| `len(t)`             | longueur                                | constant                   |

Ces coûts s'expliquent par la représentation en mémoire : les éléments d'une liste Python sont rangés dans
une zone **contiguë** (voir le module représentation). Insérer au début oblige à décaler toutes les cases.

## 4. Construire des listes

```python exec
zeros = [0] * 5                              # répétition
carres = [k * k for k in range(1, 6)]        # liste en compréhension
pairs = [k for k in range(20) if k % 2 == 0] # avec un filtre
mots = "le chat dort".split()                # à partir d'une chaîne
print(zeros, carres, pairs, mots, sep="\n")
```

Une liste **en compréhension** `[expression for x in sequence if condition]` se lit comme en mathématiques :
« l'ensemble des $k^2$ pour $k$ de 1 à 5 ». Elle équivaut à une boucle avec `append` :

```python
carres = []
for k in range(1, 6):
    carres.append(k * k)
```

### Les tranches

`t[a:b]` est une **nouvelle** liste avec les éléments d'indice `a` (inclus) à `b` (exclu).
On peut omettre une borne et préciser un pas : `t[:3]` (les 3 premiers), `t[3:]` (à partir de l'indice 3),
`t[::2]` (un sur deux), `t[::-1]` (à l'envers).

```python exec
t = [10, 20, 30, 40, 50, 60]
print(t[1:4], t[:2], t[4:], t[::2], t[::-1])
```

## 5. Tableaux à deux dimensions

Une liste peut contenir des listes : c'est ainsi qu'on représente une **matrice**, une grille de jeu ou une image.
`m[i]` est la ligne `i`, et `m[i][j]` l'élément de la ligne `i` et de la colonne `j`.

```python exec
m = [[1, 2, 3],
     [4, 5, 6]]
print(len(m), len(m[0]))     # 2 lignes, 3 colonnes
print(m[1][2])               # ligne 1, colonne 2 : 6
total = 0
for ligne in m:
    for valeur in ligne:
        total += valeur
print(total)
```

:::attention[Le piège de la grille partagée]
`[[0] * 3] * 2` ne crée **pas** deux lignes indépendantes : il crée une ligne, et une liste qui contient deux fois
**la même** ligne. Modifier une case modifie « les deux lignes ». La bonne écriture est
`[[0] * 3 for _ in range(2)]`, qui crée une nouvelle ligne à chaque tour. La leçon sur les références explique pourquoi.
:::

```python exec
mauvaise = [[0] * 3] * 2
bonne = [[0] * 3 for _ in range(2)]
mauvaise[0][0] = 9
bonne[0][0] = 9
print(mauvaise)
print(bonne)
```

## 6. Les parcours séquentiels classiques

Le programme de première demande de savoir écrire ces algorithmes **sans** les fonctions toutes faites
(`sum`, `max`, `index`…), et d'en connaître le coût.

```python exec
def somme(t):
    s = 0
    for x in t:
        s += x
    return s

def maximum(t):
    """Précondition : t non vide."""
    m = t[0]
    for x in t[1:]:
        if x > m:
            m = x
    return m

def recherche(t, cible):
    """Indice de la première occurrence de cible, ou -1."""
    for i in range(len(t)):
        if t[i] == cible:
            return i
    return -1

t = [4, -2, 9, 9, 1]
print(somme(t), maximum(t), recherche(t, 9), recherche(t, 7))
```

Chacun fait au plus `n` tours de boucle : leur coût est **linéaire** (proportionnel à `n`). Pour `recherche`,
le meilleur cas est 1 comparaison (la cible est en tête) et le pire `n` (absente ou en dernière position).

:::prof
Erreurs fréquentes : indices de 1 à `n` au lieu de 0 à `n - 1` (`IndexError` sur le dernier tour),
`range(len(t) - 1)` qui oublie le dernier élément, initialisation du maximum à 0 (faux pour une liste de négatifs),
modification d'une liste pendant qu'on la parcourt avec `for` (éléments sautés). En classe, les cases dessinées
avec leurs indices, et des tests sur liste vide, à un élément, et avec doublons, sont très efficaces.
:::

## Exemple guidé

**Problème (type écrit 1).** Écrire une fonction `renverser(t)` qui inverse l'ordre des éléments de la liste `t`
**en place** (sans créer de nouvelle liste), puis justifier sa correction et donner son coût.

**1. Idée.** On échange le premier et le dernier, puis le deuxième et l'avant-dernier, etc., en rapprochant deux
indices `i` (depuis le début) et `j` (depuis la fin) jusqu'à ce qu'ils se croisent.

<div class="cases"><span>a<small>↑ i</small></span><span>b<small>&nbsp;</small></span><span>c<small>&nbsp;</small></span><span>d<small>&nbsp;</small></span><span>e<small>↑ j</small></span></div>

**2. Code.**

```python exec
def renverser(t):
    i, j = 0, len(t) - 1
    while i < j:
        t[i], t[j] = t[j], t[i]
        i += 1
        j -= 1

lettres = ["a", "b", "c", "d", "e"]
renverser(lettres)
print(lettres)
```

La fonction ne renvoie rien (`None`) : elle **modifie** la liste reçue. C'est un **effet de bord** voulu, à écrire
dans la spécification.

**3. Correction.** Invariant : au début de chaque tour, les éléments d'indices `< i` et `> j` sont déjà à leur place
finale, et ceux entre `i` et `j` sont ceux de départ. Un tour place correctement `t[i]` et `t[j]`, puis rapproche
les indices : l'invariant est conservé. À la sortie, `i >= j` : il reste au plus un élément au milieu, qui est déjà
à sa place. Toute la liste est donc renversée.

**4. Terminaison et coût.** `j - i` diminue de 2 à chaque tour : la boucle s'arrête. Elle fait `n // 2` tours,
donc `n // 2` échanges : coût **linéaire**, et mémoire supplémentaire **constante** (deux indices).
`t[::-1]` donnerait le même ordre, mais en créant une nouvelle liste (mémoire proportionnelle à `n`).

## L'essentiel

- `t[i]` avec `0 <= i < len(t)` ou `-len(t) <= i < 0` ; hors limites : `IndexError`.
- Parcours par valeur (`for x in t`), par indice (`for i in range(len(t))`), ou `enumerate`.
- Liste **mutable** : `t[i] = v`, `append`, `pop`, `insert`, `remove`. `append`/`pop()` en temps constant, `insert(0, …)` en temps linéaire.
- Compréhension : `[f(x) for x in t if condition]` ; tranche `t[a:b]` (b exclu) = nouvelle liste.
- Matrice = liste de listes, `m[i][j]` ; créer avec `[[0] * c for _ in range(l)]`.
- Parcours séquentiels (somme, max, recherche, comptage) : coût linéaire ; max initialisé au premier élément.

## Exercices

::::exercice[Indices]{niveau=1}
Avec `t = [5, 8, 2, 9]`, que vaut `t[-1] + t[1]` ?

- [ ] `13`
- [x] `17`
- [ ] `7`
- [ ] une erreur

:::corrige
`t[-1]` est le dernier élément, `9` ; `t[1]` est le deuxième, `8`. La somme vaut `17`.
:::
::::

::::exercice[Tranches et compréhensions]{niveau=1}
Lesquelles de ces égalités sont vraies ?

- [x] `[10, 20, 30, 40, 50][1:3] == [20, 30]`
- [ ] `[10, 20, 30, 40, 50][:2] == [10, 20, 30]`
- [x] `[x * 2 for x in range(4) if x % 2 == 0] == [0, 4]`
- [x] `[1, 2, 3][::-1] == [3, 2, 1]`

:::corrige
- `t[1:3]` va de l'indice 1 inclus à 3 exclu : `[20, 30]`. ✓
- `t[:2]` contient les **deux** premiers éléments : `[10, 20]`. ✗
- `x` parcourt 0, 1, 2, 3 ; on garde 0 et 2, doublés : `[0, 4]`. ✓
- `[::-1]` parcourt à l'envers. ✓
:::
::::

::::exercice[Maximum sans max]{niveau=2}
Écris `maximum(t)` qui renvoie le plus grand élément d'une liste **non vide**, sans utiliser `max` ni trier.

```python depart
def maximum(t):
    ...
```

```python tests
assert maximum([3, 9, 2, 5]) == 9, "cas courant"
assert maximum([-8, -3, -5]) == -3, "uniquement des négatifs"
assert maximum([4]) == 4, "un seul élément"
assert maximum([7, 7, 7]) == 7, "tous égaux"
assert maximum([1, 2, 3, 10]) == 10, "maximum à la fin"
```

:::corrige
```python solution
def maximum(t):
    m = t[0]
    for x in t:
        if x > m:
            m = x
    return m
```
Initialiser `m` à 0 serait faux pour `[-8, -3, -5]`. Invariant : après avoir examiné les `k` premiers éléments,
`m` est le maximum de ces `k` éléments.
:::
::::

::::exercice[Compter les occurrences]{niveau=2}
Écris `compter(t, x)` qui renvoie le nombre de fois où `x` apparaît dans `t`, sans utiliser `t.count`.

```python depart
def compter(t, x):
    ...
```

```python tests
assert compter([1, 3, 1, 1, 2], 1) == 3, "plusieurs occurrences"
assert compter([1, 3, 1], 5) == 0, "absent"
assert compter([], 1) == 0, "liste vide"
assert compter(["a", "b", "a"], "a") == 2, "chaînes"
```

:::corrige
```python solution
def compter(t, x):
    n = 0
    for v in t:
        if v == x:
            n += 1
    return n
```
Version en une ligne : `return sum(1 for v in t if v == x)`.
:::
::::

::::exercice[Indice du minimum]{niveau=2}
Écris `indice_min(t)` qui renvoie l'indice du plus petit élément d'une liste non vide (le premier en cas d'égalité).

```python depart
def indice_min(t):
    ...
```

```python tests
assert indice_min([5, 3, 8, 1, 9]) == 3, "cas courant"
assert indice_min([2, 5, 2]) == 0, "égalité : le premier"
assert indice_min([7]) == 0, "un élément"
assert indice_min([4, 3, 2, 1]) == 3, "minimum à la fin"
```

:::corrige
```python solution
def indice_min(t):
    imin = 0
    for i in range(1, len(t)):
        if t[i] < t[imin]:
            imin = i
    return imin
```
On garde un **indice** plutôt qu'une valeur. Avec `<` strict, en cas d'égalité, on garde le premier rencontré.
Cette fonction est le cœur du tri par sélection.
:::
::::

::::exercice[Transposer une matrice]{niveau=2}
La **transposée** d'une matrice `m` (liste de `l` lignes de `c` éléments) est la matrice de `c` lignes et `l` colonnes
telle que `t[j][i] == m[i][j]`. Écris `transposee(m)` qui renvoie une **nouvelle** matrice.

```python depart
def transposee(m):
    ...
```

```python tests
assert transposee([[1, 2, 3], [4, 5, 6]]) == [[1, 4], [2, 5], [3, 6]], "2 x 3"
assert transposee([[1]]) == [[1]], "1 x 1"
assert transposee([[1, 2]]) == [[1], [2]], "une ligne"
m = [[1, 2], [3, 4]]
t = transposee(m)
assert m == [[1, 2], [3, 4]], "la matrice d'origine n'est pas modifiée"
```

:::corrige
```python solution
def transposee(m):
    lignes, colonnes = len(m), len(m[0])
    return [[m[i][j] for i in range(lignes)] for j in range(colonnes)]
```
Version avec des boucles : créer `t = [[0] * lignes for _ in range(colonnes)]`, puis `t[j][i] = m[i][j]` pour tous `i, j`.
:::
::::

::::exercice[Renverser en place]{niveau=3}
Écris `renverser(t)` qui inverse l'ordre des éléments de `t` **en place** : la fonction modifie `t` et ne renvoie
rien. Interdit : `t.reverse()`, `t[::-1]`, `reversed`.

```python depart
def renverser(t):
    ...
```

```python tests
a = [1, 2, 3, 4, 5]
renverser(a)
assert a == [5, 4, 3, 2, 1], "longueur impaire"
b = [1, 2, 3, 4]
renverser(b)
assert b == [4, 3, 2, 1], "longueur paire"
c = []
renverser(c)
assert c == [], "liste vide"
assert renverser([1, 2]) is None, "la fonction ne renvoie rien"
```

:::corrige
```python solution
def renverser(t):
    i, j = 0, len(t) - 1
    while i < j:
        t[i], t[j] = t[j], t[i]
        i += 1
        j -= 1
```
Voir l'exemple guidé pour la preuve. Les tests vérifient les longueurs paire et impaire, et la liste vide.
:::
::::

::::exercice[Sommes cumulées]{niveau=3}
Écris `sommes_prefixes(t)` qui renvoie la liste `p` de longueur `len(t) + 1` telle que `p[k]` est la somme des
`k` premiers éléments de `t` (donc `p[0] == 0`). La fonction doit faire un seul parcours de `t`.
Explique ensuite comment `p` permet de calculer la somme de `t[a:b]` en temps constant.

```python depart
def sommes_prefixes(t):
    ...
```

```python tests
assert sommes_prefixes([3, 1, 4, 1, 5]) == [0, 3, 4, 8, 9, 14], "cas courant"
assert sommes_prefixes([]) == [0], "liste vide"
assert sommes_prefixes([-2, 2]) == [0, -2, 0], "négatifs"
p = sommes_prefixes([3, 1, 4, 1, 5])
assert p[4] - p[1] == 1 + 4 + 1, "somme de t[1:4]"
```

:::corrige
```python solution
def sommes_prefixes(t):
    p = [0]
    for x in t:
        p.append(p[-1] + x)
    return p
```
La somme de `t[a:b]` vaut `p[b] - p[a]` : une soustraction, quel que soit l'intervalle. Après une préparation
linéaire, chaque requête de somme coûte un temps constant au lieu d'un temps proportionnel à `b - a`.
C'est une idée qu'on retrouve en programmation dynamique.
:::
::::

::::exercice[La liste est-elle triée ?]{niveau=4 duree=25}
1. Écris une fonction `est_triee(t)` qui renvoie `True` si la liste `t` est triée par ordre croissant
   (au sens large), `False` sinon. Elle doit s'arrêter dès qu'elle trouve un défaut.
2. Prouve la correction de ta fonction à l'aide d'un invariant de boucle.
3. Évalue son coût au meilleur et au pire, en nombre de comparaisons entre éléments, en fonction de `n = len(t)`.
   Donne une liste de chaque type pour `n = 5`.

:::criteres
- Le code compare chaque élément au suivant (`t[i] > t[i + 1]` pour `i` de 0 à `n - 2`) et renvoie `False` dès un défaut, `True` après la boucle.
- Les cas `n = 0` et `n = 1` renvoient `True` sans erreur d'indice.
- Invariant énoncé : au début du tour d'indice `i`, la tranche `t[0 : i + 1]` est triée.
- Initialisation, conservation et conclusion de l'invariant sont justifiées (à la sortie normale, `i = n - 1`, donc toute la liste est triée ; un `return False` n'a lieu que si deux voisins sont mal ordonnés).
- Coût : au mieux 1 comparaison (les deux premiers éléments sont dans le mauvais ordre), au pire `n - 1` comparaisons (liste triée, ou défaut à la fin).
- Exemples : `[2, 1, 3, 4, 5]` pour le meilleur cas, `[1, 2, 3, 4, 5]` pour le pire.
:::

:::corrige
1. ```python
   def est_triee(t):
       for i in range(len(t) - 1):
           if t[i] > t[i + 1]:
               return False
       return True
   ```
   Pour `n = 0` ou `n = 1`, `range(len(t) - 1)` est vide : la fonction renvoie `True` (une liste vide ou à un
   élément est triée), sans accès hors limites.
2. **Invariant** : au début du tour d'indice `i`, la tranche `t[0 : i + 1]` est triée.
   *Initialisation* : pour `i = 0`, la tranche `t[0:1]` a un seul élément, elle est triée.
   *Conservation* : si `t[0 : i + 1]` est triée et que le tour ne renvoie pas `False`, c'est que `t[i] <= t[i + 1]` ;
   donc `t[0 : i + 2]` est triée, ce qui est l'invariant au tour suivant.
   *Conclusion* : si la fonction renvoie `False`, c'est qu'il existe `i` avec `t[i] > t[i + 1]` : la liste n'est pas
   triée, la réponse est juste. Si la boucle va jusqu'au bout, l'invariant au « tour » `i = n - 1` dit que
   `t[0 : n]`, c'est-à-dire toute la liste, est triée : `True` est juste.
3. Chaque tour fait une comparaison. **Meilleur cas** : `t[0] > t[1]`, on s'arrête au premier tour, **1** comparaison
   (ex. `[2, 1, 3, 4, 5]`). **Pire cas** : aucun défaut, ou un défaut seulement entre les deux derniers : **n − 1**
   comparaisons (ex. `[1, 2, 3, 4, 5]`, ou `[1, 2, 3, 5, 4]`). Le coût au pire est linéaire.
:::
::::
