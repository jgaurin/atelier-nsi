---
titre: Fonctions, portée et spécification
resume: Découper un programme en fonctions qui reçoivent des paramètres et renvoient un résultat, et décrire précisément ce qu'elles font.
duree: 70
objectifs:
  - Définir et appeler une fonction avec des paramètres et une valeur de retour
  - Distinguer `return` et `print`, paramètre et argument, variable locale et globale
  - Écrire la spécification d'une fonction (docstring, préconditions, postconditions)
  - Décomposer un problème en fonctions courtes et testables
prerequis: [python/boucles]
programme: [lp-imperatif, lp-python, asd-types, nsi1-langages, nsit-langages, snt-programmation]
cartes:
  - q: Que renvoie une fonction qui se termine sans exécuter de `return` ?
    r: "La valeur `None`."
  - q: Différence entre `return` et `print` ?
    r: "`return` termine la fonction et transmet une valeur à l'appelant ; `print` affiche une valeur à l'écran et ne transmet rien."
  - q: Paramètre ou argument ?
    r: "Le **paramètre** est le nom dans la définition (`def f(x)`) ; l'**argument** est la valeur fournie à l'appel (`f(3)`)."
  - q: "Après `x = 5`, `def g(): x = 10`, puis `g()`, que vaut `x` ?"
    r: "`5` : le `x = 10` dans `g` crée une variable **locale** à `g`, distincte de la variable globale `x`."
  - q: Qu'est-ce qu'une précondition ?
    r: "Une condition que les arguments doivent vérifier pour que la fonction ait le comportement promis (ex. : `n >= 0`). C'est à l'appelant de la respecter."
  - q: Que contient la spécification d'une fonction ?
    r: "Son nom, ses paramètres et leurs types, ses préconditions, ce qu'elle renvoie (postcondition) et ses éventuels effets de bord."
  - q: Comment renvoyer deux valeurs en Python ?
    r: "On renvoie un tuple : `return q, r`, récupéré par `a, b = f(...)`."
  - q: Qu'est-ce qu'un effet de bord ?
    r: "Une modification de l'état extérieur à la fonction (affichage, modification d'une variable globale ou d'un objet reçu, écriture de fichier)."
---

Jusqu'ici, nos programmes étaient une seule suite d'instructions. Dès qu'un programme grandit, il devient
illisible et on recopie les mêmes morceaux. Une **fonction** est un morceau de programme **nommé**, qui reçoit
des données (ses **paramètres**), calcule quelque chose et **renvoie** un résultat. On l'écrit une fois, on la
teste, puis on l'utilise partout sans y repenser — exactement comme `print`, `len` ou `int`, qui sont des
fonctions fournies par Python.

## 1. Définir et appeler une fonction

```python exec
def aire_rectangle(largeur, hauteur):
    return largeur * hauteur

print(aire_rectangle(7, 3))
a = aire_rectangle(2.5, 4)
print(a + 1)
```

- `def` introduit la **définition** : le nom de la fonction, puis ses **paramètres** entre parenthèses, puis `:` ;
- le **corps** est le bloc indenté ;
- `return expression` **termine** la fonction et transmet la valeur de l'expression à l'appelant.

Définir une fonction n'exécute rien : son corps ne s'exécute qu'au moment d'un **appel**, comme
`aire_rectangle(7, 3)`. Les valeurs `7` et `3` sont les **arguments** de l'appel : le paramètre `largeur`
reçoit `7`, `hauteur` reçoit `3`.

```mermaid legende="Une fonction vue de l'extérieur : des entrées, une sortie"
graph LR
  E1([largeur = 7]) --> F["aire_rectangle<br/>return largeur * hauteur"]
  E2([hauteur = 3]) --> F
  F --> S([21])
```

## 2. `return` n'est pas `print`

```python exec
def double_affiche(x):
    print(x * 2)

def double(x):
    return x * 2

r1 = double_affiche(5)
r2 = double(5)
print("r1 =", r1, " r2 =", r2)
```

`double_affiche` **affiche** 10 mais ne renvoie rien : une fonction qui se termine sans `return` renvoie la
valeur spéciale `None`. On ne peut rien calculer avec ce résultat. En pratique, une fonction **calcule et
renvoie** ; c'est le programme principal qui décide d'afficher.

:::attention
`return` termine immédiatement la fonction : les instructions placées après ne sont pas exécutées.
C'est utile pour sortir tôt (dès qu'on a trouvé la réponse), mais attention à un `return` placé par erreur
**dans** une boucle : la boucle ne fera qu'un tour.
:::

```python exec
def contient_negatif(nombres):
    for x in nombres:
        if x < 0:
            return True      # on a trouvé : inutile de continuer
    return False             # on a tout parcouru sans trouver

print(contient_negatif([3, 8, -1, 4]), contient_negatif([3, 8]))
```

## 3. Paramètres : position, nom, valeur par défaut

Les arguments sont associés aux paramètres **dans l'ordre**, ou **par nom**. Un paramètre peut avoir une
**valeur par défaut**, utilisée quand l'argument est omis.

```python exec
def prix_ttc(prix_ht, taux=20):
    return prix_ht * (1 + taux / 100)

print(prix_ttc(100))              # taux = 20 par défaut
print(prix_ttc(100, 5.5))         # par position
print(prix_ttc(taux=10, prix_ht=50))  # par nom, dans n'importe quel ordre
```

Pour renvoyer plusieurs résultats, on renvoie un **tuple** (voir la leçon sur les tuples), qu'on « déballe » à l'appel :

```python exec
def division(a, b):
    return a // b, a % b

q, r = division(17, 5)
print(q, r)
```

## 4. Portée des variables : local et global

Une variable créée **dans** une fonction (un paramètre, ou une affectation dans le corps) est **locale** :
elle n'existe que pendant l'exécution de cet appel, et elle est invisible de l'extérieur. Une variable créée
en dehors de toute fonction est **globale**.

```python exec
x = 5                    # globale

def change():
    x = 10               # locale : une AUTRE variable, qui masque la globale
    print("dans la fonction :", x)

change()
print("après l'appel :", x)
```

```mermaid legende="Chaque appel a son propre espace de noms ; la variable locale x masque la globale"
graph LR
  subgraph G["Espace global"]
    gx([x]) --> v5["5"]
    gf([change]) --> fn["fonction"]
  end
  subgraph L["Appel change()"]
    lx([x]) --> v10["10"]
  end
```

Une fonction peut **lire** une variable globale, mais dès qu'elle **affecte** un nom, ce nom devient local à la
fonction. Le mot-clé `global` permet de modifier une globale, mais c'est presque toujours une mauvaise idée :
la fonction dépend alors d'un état caché et devient difficile à tester. **Une bonne fonction reçoit tout ce
dont elle a besoin par ses paramètres, et transmet son résultat par `return`.**

## 5. Spécifier une fonction

La **spécification** (ou contrat) d'une fonction dit **ce qu'elle fait**, sans dire **comment**. Elle permet de
l'utiliser sans lire son code, et de la tester. En Python, on l'écrit dans une **docstring** (chaîne entre
triples guillemets, juste sous la ligne `def`) et on peut indiquer les types avec des **annotations**.

```python exec
def moyenne(notes: list[float]) -> float:
    """Renvoie la moyenne des nombres de la liste notes.

    Précondition : notes est une liste non vide de nombres.
    Postcondition : le résultat est la somme des éléments divisée par leur nombre.
    """
    assert len(notes) > 0, "la liste ne doit pas être vide"
    return sum(notes) / len(notes)

print(moyenne([12, 15, 9]))
print(moyenne.__doc__)
```

:::definition
- Une **précondition** est une condition sur les arguments que l'appelant doit respecter.
- Une **postcondition** décrit le résultat (et l'état) après l'appel, quand les préconditions sont respectées.
- Un **effet de bord** est une modification visible hors de la fonction : affichage, modification d'une liste
  reçue en paramètre, d'une variable globale, d'un fichier.
:::

Les annotations (`notes: list[float]`, `-> float`) documentent les types attendus mais **ne sont pas vérifiées**
par Python à l'exécution. L'`assert` vérifie la précondition pendant le développement : si elle est fausse, le
programme s'arrête avec une `AssertionError` claire au lieu d'une erreur obscure plus loin.

:::retenir
Le programme de NSI demande de « prototyper une fonction » (nom, paramètres, types, valeur de retour) et de
« décrire les préconditions ». À l'écrit du concours, on écrit souvent la spécification avant le code.
:::

## 6. Décomposer un problème en fonctions

Une fonction peut en appeler d'autres. On résout un gros problème en le découpant en **sous-problèmes**, chacun
confié à une fonction courte, qui a **une seule responsabilité** et un nom qui la décrit.

```python exec
def est_bissextile(annee):
    return (annee % 4 == 0 and annee % 100 != 0) or annee % 400 == 0

def nb_jours_annee(annee):
    if est_bissextile(annee):
        return 366
    return 365

def nb_jours_entre(debut, fin):
    """Nombre de jours des années debut (incluse) à fin (exclue)."""
    total = 0
    for annee in range(debut, fin):
        total += nb_jours_annee(annee)
    return total

print(nb_jours_entre(2000, 2025))
```

Chaque appel crée un nouvel espace de variables locales, empilé sur les précédents : c'est la **pile d'appels**.
Quand une fonction se termine, son espace disparaît et l'exécution reprend dans la fonction appelante, juste
après l'appel. Cette pile sera centrale dans la leçon sur la récursivité.

### Les fonctions sont des valeurs

En Python, une fonction est une valeur comme une autre : on peut la ranger dans une variable ou la passer en
argument. Une `lambda` est une petite fonction anonyme réduite à une expression.

```python exec
def appliquer(f, valeurs):
    return [f(v) for v in valeurs]

def carre(x):
    return x * x

print(appliquer(carre, [1, 2, 3]))
print(appliquer(lambda x: x + 10, [1, 2, 3]))
```

C'est l'idée de base de la **programmation fonctionnelle**, l'un des paradigmes au programme de terminale.

:::prof
Au lycée, la confusion `print` / `return` est l'obstacle numéro un : l'élève « voit » le bon résultat à l'écran
et ne comprend pas pourquoi le test échoue. Faire écrire `resultat = f(3)` puis `print(resultat)`, et tracer
l'appel, lève l'obstacle. Autre point : les élèves réutilisent souvent le même nom pour la variable globale et
le paramètre, ce qui brouille la notion de portée ; des noms différents au début aident.
:::

## Exemple guidé

**Problème.** Un entier `n ≥ 2` est **parfait** s'il est égal à la somme de ses diviseurs propres (diviseurs
positifs autres que lui-même) : $6 = 1 + 2 + 3$. Écrire une fonction qui donne la liste des nombres parfaits
inférieurs à une borne, en découpant le problème.

**1. Découper.** Il nous faut : la somme des diviseurs propres d'un entier ; un test « est parfait » ; une boucle
sur les entiers jusqu'à la borne. Trois fonctions, chacune spécifiée et testable séparément.

**2. Écrire et spécifier.**

```python exec
def somme_diviseurs_propres(n):
    """Somme des diviseurs d de n avec 1 <= d < n. Précondition : n >= 1."""
    somme = 0
    for d in range(1, n):
        if n % d == 0:
            somme += d
    return somme

def est_parfait(n):
    """True si n >= 2 est égal à la somme de ses diviseurs propres."""
    return n >= 2 and somme_diviseurs_propres(n) == n

def parfaits_jusqu_a(borne):
    """Liste croissante des nombres parfaits strictement inférieurs à borne."""
    resultat = []
    for n in range(2, borne):
        if est_parfait(n):
            resultat.append(n)
    return resultat

assert somme_diviseurs_propres(12) == 1 + 2 + 3 + 4 + 6
assert est_parfait(28) and not est_parfait(12)
print(parfaits_jusqu_a(1000))
```

**3. Tester chaque morceau.** Les `assert` vérifient chaque fonction sur un cas calculé à la main **avant**
de faire confiance à la fonction suivante. Si `parfaits_jusqu_a` donnait un résultat faux, on saurait dans
quelle fonction chercher.

**4. Évaluer le coût et améliorer.** `somme_diviseurs_propres(n)` fait `n - 1` tours ; `parfaits_jusqu_a(B)`
fait donc environ $B^2/2$ tours au total. Pour aller plus loin, on peut ne tester les diviseurs que jusqu'à
$\sqrt n$ en ajoutant `d` et `n // d` à chaque fois : seule `somme_diviseurs_propres` change, les autres
fonctions restent identiques. C'est l'intérêt du découpage.

## L'essentiel

- `def nom(parametres):` définit une fonction ; son corps s'exécute à chaque **appel** `nom(arguments)`.
- `return` termine la fonction et transmet une valeur ; sans `return`, la fonction renvoie `None`.
- Paramètres par position, par nom, avec valeur par défaut ; plusieurs résultats → un tuple.
- Les variables affectées dans une fonction sont **locales** ; éviter `global` : tout passe par les paramètres et `return`.
- Spécification = docstring (préconditions, postcondition, effets de bord) + annotations de types + `assert`.
- Découper : une fonction = une responsabilité, testée séparément. Les fonctions sont des valeurs.

## Exercices

::::exercice[Que vaut y ?]{niveau=1}
```python
def f(x):
    print(x * 2)

y = f(3)
```
Que vaut `y` après ces instructions ?

- [ ] `6`
- [ ] `"6"`
- [x] `None`
- [ ] le programme provoque une erreur

:::corrige
`f` **affiche** 6 mais ne contient pas de `return` : elle renvoie `None`, qui est rangé dans `y`.
:::
::::

::::exercice[Portée]{niveau=1}
Qu'affiche ce programme ?

```python
n = 1
def incremente(n):
    n = n + 1
    return n

incremente(n)
print(n)
```

- [x] `1`
- [ ] `2`
- [ ] `None`
- [ ] une erreur

:::corrige
Le paramètre `n` est une variable **locale** à `incremente` : la modifier ne change pas la variable globale `n`.
De plus, la valeur renvoyée (2) n'est rangée nulle part. Pour mettre à jour `n`, il faudrait écrire `n = incremente(n)`.
:::
::::

::::exercice[Jours dans un mois]{niveau=2}
Écris `nb_jours(mois, annee)` qui renvoie le nombre de jours du mois (1 = janvier, …, 12 = décembre).
Février a 29 jours les années bissextiles. Utilise une fonction `est_bissextile`, que tu écris aussi.

```python depart
def est_bissextile(annee):
    ...

def nb_jours(mois, annee):
    ...
```

```python tests
assert nb_jours(1, 2025) == 31, "janvier"
assert nb_jours(4, 2025) == 30, "avril"
assert nb_jours(2, 2025) == 28, "février 2025"
assert nb_jours(2, 2024) == 29, "février 2024 (bissextile)"
assert nb_jours(2, 1900) == 28, "1900 n'est pas bissextile"
assert nb_jours(2, 2000) == 29, "2000 est bissextile"
assert nb_jours(12, 2025) == 31, "décembre"
```

:::corrige
```python solution
def est_bissextile(annee):
    return (annee % 4 == 0 and annee % 100 != 0) or annee % 400 == 0

def nb_jours(mois, annee):
    if mois == 2:
        if est_bissextile(annee):
            return 29
        return 28
    if mois in (4, 6, 9, 11):
        return 30
    return 31
```
`mois in (4, 6, 9, 11)` teste l'appartenance à un tuple : plus lisible que quatre `==` reliés par `or`.
:::
::::

::::exercice[PGCD et PPCM]{niveau=2}
Écris `pgcd(a, b)` (algorithme d'Euclide) puis `ppcm(a, b)` pour deux entiers strictement positifs, en utilisant
la relation $\text{ppcm}(a, b) \times \text{pgcd}(a, b) = a \times b$.

```python depart
def pgcd(a, b):
    ...

def ppcm(a, b):
    ...
```

```python tests
assert pgcd(252, 105) == 21, "pgcd(252, 105)"
assert pgcd(7, 13) == 1, "nombres premiers entre eux"
assert pgcd(12, 12) == 12, "nombres égaux"
assert ppcm(4, 6) == 12, "ppcm(4, 6)"
assert ppcm(7, 13) == 91, "ppcm de premiers entre eux"
assert isinstance(ppcm(4, 6), int), "le ppcm est un entier (utilise //)"
```

:::corrige
```python solution
def pgcd(a, b):
    while b != 0:
        a, b = b, a % b
    return a

def ppcm(a, b):
    return a * b // pgcd(a, b)
```
`//` garantit un résultat entier (la division est exacte ici). Avec `/`, on obtiendrait un `float` : `12.0`.
:::
::::

::::exercice[Appliquer une fonction plusieurs fois]{niveau=3}
Écris `iterer(f, x, n)` qui renvoie $f(f(\dots f(x)))$ où `f` est appliquée `n` fois (`n ≥ 0` ; pour `n = 0`,
on renvoie `x`). `f` est une fonction passée en argument.

```python depart
def iterer(f, x, n):
    ...
```

```python tests
assert iterer(lambda v: v + 1, 0, 5) == 5, "ajouter 1 cinq fois"
assert iterer(lambda v: 2 * v, 1, 10) == 1024, "doubler dix fois"
assert iterer(lambda v: v * v, 3, 0) == 3, "zéro application"
assert iterer(str.upper, "nsi", 1) == "NSI", "fonction sur les chaînes"
```

:::corrige
```python solution
def iterer(f, x, n):
    for _ in range(n):
        x = f(x)
    return x
```
Le nom `_` indique une variable de boucle dont on n'utilise pas la valeur. `f` est un paramètre comme un autre,
dont la valeur est une fonction : on l'appelle avec `f(x)`.
:::
::::

::::exercice[Écrire une spécification]{niveau=3}
Voici une fonction sans documentation. Écris sa docstring complète (rôle, paramètres, préconditions, valeur
renvoyée, effets de bord éventuels), puis propose quatre tests pertinents, dont deux cas limites.

```python
def position(t, x):
    for i in range(len(t)):
        if t[i] == x:
            return i
    return -1
```

:::criteres
- Le rôle est dit : renvoie l'indice de la **première** occurrence de `x` dans `t`, ou -1 si `x` est absent.
- Les paramètres sont décrits (une liste `t`, une valeur `x` comparable avec `==`) ; il n'y a pas de précondition forte (la liste peut être vide).
- Il est précisé que la fonction n'a pas d'effet de bord (elle ne modifie pas `t`).
- Les tests incluent : élément présent au milieu, plusieurs occurrences (on attend la première), élément absent (-1), liste vide (-1).
:::

:::corrige
```python
def position(t, x):
    """Renvoie l'indice de la première occurrence de x dans la liste t, ou -1 si x n'y est pas.

    Paramètres : t, une liste ; x, une valeur comparable avec == aux éléments de t.
    Préconditions : aucune (t peut être vide).
    Effet de bord : aucun, t n'est pas modifiée.
    """
```
Tests : `position([4, 7, 9], 7) == 1` (cas courant) ; `position([5, 2, 5], 5) == 0` (première occurrence) ;
`position([4, 7, 9], 3) == -1` (absent) ; `position([], 3) == -1` (liste vide, cas limite) ;
on peut ajouter `position([4, 7, 9], 9) == 2` (dernier élément, autre cas limite).
:::
::::

::::exercice[Trace d'appels imbriqués]{niveau=4 duree=15}
On considère le programme suivant.

```python
def g(a):
    b = a * 2
    return b + 1

def f(a, b):
    c = g(b) + a
    b = c - 1
    return b

a = 3
b = 4
c = f(b, a)
print(a, b, c)
```

1. Qu'affiche ce programme ? Justifie en décrivant, pour chaque appel, les variables locales et leurs valeurs
   (tu peux représenter la pile d'appels au moment où `g` s'exécute).
2. Pourquoi les variables `a`, `b` et `c` du programme principal ne sont-elles pas modifiées par les affectations
   faites dans `f` et `g` ?

:::criteres
- L'appel `f(b, a)` lie les paramètres par position : dans `f`, `a = 4` et `b = 3`.
- L'appel `g(3)` donne, dans `g`, `a = 3`, `b = 6`, et renvoie 7.
- Dans `f` : `c = 7 + 4 = 11`, puis `b = 10`, et `f` renvoie 10.
- L'affichage est `3 4 10`.
- La pile au moment de `g` est décrite : programme principal (a=3, b=4), puis f (a=4, b=3), puis g (a=3, b=6).
- L'explication invoque les variables locales : chaque appel a son propre espace de noms ; seul `c = f(...)` modifie la variable globale `c`.
:::

:::corrige
1. Dans le programme principal, `a = 3`, `b = 4`. L'appel `f(b, a)` associe les arguments **par position** :
   le paramètre `a` de `f` reçoit `4` et le paramètre `b` reçoit `3`. Dans `f`, l'appel `g(b)` est `g(3)` :
   dans `g`, `a = 3`, puis `b = 6`, et `g` renvoie `7`. De retour dans `f` : `c = 7 + 4 = 11`, puis `b = 10`,
   et `f` renvoie `10`, qui est rangé dans la variable `c` du programme principal. Le programme affiche **`3 4 10`**.

   Pile d'appels pendant l'exécution de `g` (du bas vers le haut) :

   | Espace            | Variables          |
   |-------------------|--------------------|
   | `g` (sommet)      | `a = 3`, `b = 6`   |
   | `f`               | `a = 4`, `b = 3` (`c` pas encore définie) |
   | programme principal | `a = 3`, `b = 4` |

2. Chaque appel de fonction crée son propre espace de noms : les paramètres et les variables affectées dans le
   corps sont **locaux**. Les affectations `b = c - 1` dans `f` ou `b = a * 2` dans `g` modifient les variables
   locales `b` de ces appels, pas la variable globale `b`. Seule l'affectation `c = f(b, a)`, faite au niveau
   global, modifie une variable globale.
:::
::::
