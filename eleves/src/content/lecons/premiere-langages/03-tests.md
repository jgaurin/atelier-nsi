---
titre: Tester et corriger
resume: "Construire un bon jeu de tests, lire un message d'erreur et corriger un programme."
duree: 35
objectifs:
  - "Utiliser des jeux de tests"
  - "Choisir des cas limites"
  - "Lire un message d'erreur"
prerequis: [premiere-langages/specification]
---

Un programme qui donne le bon résultat sur un exemple n'est pas forcément correct. Pour gagner en confiance, on l'essaie sur de nombreux cas bien choisis : on le **teste**.

## 1. Un jeu de tests

On écrit chaque test avec `assert` : si le résultat n'est pas celui attendu, le programme s'arrête et indique quel test a échoué.

```python exec
def maximum(t):
    m = t[0]
    for x in t:
        if x > m:
            m = x
    return m

assert maximum([3, 9, 2]) == 9
assert maximum([7]) == 7
assert maximum([-5, -2, -8]) == -2
print("tests réussis")
```

Chaque test vise une situation précise : un cas ordinaire, un tableau d'une seule case, des nombres négatifs.

## 2. Bien choisir ses tests

Les bugs se cachent surtout dans les **cas limites**, aux frontières. Un bon jeu de tests essaie notamment :

| Cas limite | Pourquoi |
| --- | --- |
| tableau vide, ou d'une seule case | la boucle ne fait aucun tour, ou un seul |
| élément en première ou en dernière position | les erreurs d'indice se produisent aux bords |
| élément absent | la fonction doit aussi gérer l'échec |
| valeur égale au seuil | on confond facilement `>` et `>=` |
| nombres négatifs ou zéro | une initialisation à 0 devient fausse |

:::exemple
Avec seulement `assert maximum([3, 9, 2]) == 9`, une fonction qui commence par `m = 0` passerait le test. Le test avec `[-5, -2, -8]` révèle l'erreur, car elle renverrait 0.
:::

:::attention
Réussir tous les tests **ne prouve pas** que le programme est correct : un cas non testé peut encore échouer. Les tests augmentent seulement la confiance. Plus ils sont nombreux et variés, plus cette confiance est grande.
:::

## 3. Lire un message d'erreur

Quand Python rencontre une erreur, il affiche un message. On le lit **à partir de la dernière ligne** : elle donne le **type** d'erreur. Juste au-dessus, on trouve le **numéro de ligne** où elle s'est produite.

| Erreur | Cause fréquente |
| --- | --- |
| `SyntaxError` | un `:` oublié, une parenthèse non fermée |
| `IndentationError` | des lignes mal décalées |
| `NameError` | une variable mal écrite ou jamais définie |
| `TypeError` | une opération impossible, comme `"3" + 4` |
| `IndexError` | un indice en dehors du tableau |
| `KeyError` | une clé absente du dictionnaire |
| `ZeroDivisionError` | une division par zéro |

:::exemple
`print(moyene(notes))` provoque une `NameError` : la fonction s'appelle `moyenne`, il manque un n.
:::

## L'essentiel

- On teste avec des `assert`, sur des cas ordinaires et surtout sur les cas limites.
- Réussir tous les tests ne garantit pas que le programme est correct.
- Un message d'erreur se lit à partir de la dernière ligne : le type d'erreur, puis la ligne concernée.

## Exercices

::::exercice[QCM : tests et erreurs]{niveau=1 type=quiz}
Une question à la fois : la correction s'affiche aussitôt.

1. Pour tester une fonction de recherche dans un tableau, quel cas est un cas limite ?

   - [ ] un tableau de 10 éléments
   - [x] l'élément cherché en dernière position
   - [ ] l'élément cherché au milieu
   - [ ] un tableau d'entiers

   > Les erreurs de borne apparaissent aux extrémités.

1. Une fonction passe tous ses tests. On peut en conclure :

   - [ ] qu'elle est correcte
   - [x] qu'elle donne le bon résultat sur ces cas-là
   - [ ] qu'elle est rapide
   - [ ] qu'elle n'a pas besoin de spécification

   > Les tests montrent la présence d'erreurs, pas leur absence.

1. Où lire en priorité un message d'erreur Python ?

   - [ ] la première ligne
   - [x] la dernière ligne
   - [ ] le milieu
   - [ ] nulle part, il suffit de relancer

   > Elle donne le type d'erreur et l'explication.

1. `print(moyene(notes))` provoque :

   - [ ] une `TypeError`
   - [x] une `NameError`
   - [ ] une `SyntaxError`
   - [ ] une `IndexError`

   > Le nom `moyene` (faute de frappe) n'est pas défini.

1. `"Note : " + 15` provoque :

   - [x] une `TypeError`
   - [ ] une `NameError`
   - [ ] le texte « Note : 15 »
   - [ ] une `ValueError`

   > On ne peut pas additionner une chaîne et un entier ; il faut `str(15)`.

::::

::::exercice[Quelle erreur ?]{niveau=1 type=associer}
Associe chaque instruction à l'erreur qu'elle provoque.

| Instruction | Erreur |
| --- | --- |
| `print(1 / 0)` | ZeroDivisionError |
| `print([1, 2][5])` | IndexError |
| `print("a" + 1)` | TypeError |
| `print({"a": 1}["b"])` | KeyError |
| `print(variable_inconnue)` | NameError |
::::

::::exercice[Corriger une fonction boguée]{niveau=2}
La fonction suivante doit compter les notes supérieures **ou égales** à `seuil`, mais elle est fausse. Écris les tests qui révèlent l'erreur,
puis corrige-la.

```python depart
def nb_admis(notes, seuil):
    """Renvoie le nombre de notes supérieures ou égales à seuil."""
    compte = 0
    for i in range(1, len(notes)):
        if notes[i] > seuil:
            compte = compte + 1
    return compte
```

```python tests
assert nb_admis([12, 8, 15], 10) == 2, "cas général"
assert nb_admis([10, 9], 10) == 1, "note égale au seuil, en première position"
assert nb_admis([], 10) == 0, "tableau vide"
assert nb_admis([14], 10) == 1, "un seul élément"
```

:::corrige
```python solution
def nb_admis(notes, seuil):
    """Renvoie le nombre de notes supérieures ou égales à seuil."""
    compte = 0
    for i in range(len(notes)):
        if notes[i] >= seuil:
            compte = compte + 1
    return compte
```

Deux erreurs : la boucle commençait à 1 (la première note était oubliée) et la comparaison stricte excluait les notes égales au seuil. Le test
`[10, 9]` révèle les deux d'un coup : 10 est en première position **et** égal au seuil. L'exemple `[12, 8, 15]` ne révélait rien !
:::
::::

::::exercice[Tester une fonction qu'on n'a pas écrite]{niveau=2}
On te donne seulement la spécification : « `est_trie(t)` renvoie `True` si le tableau `t` est trié par ordre croissant (au sens large), `False`
sinon. » Écris une implémentation et le jeu de tests le plus complet possible, en commentant chaque cas.

```python depart
def est_trie(t):
    ...
```

```python tests
assert est_trie([1, 2, 3]), "trié"
assert not est_trie([1, 3, 2]), "désordre à la fin"
assert not est_trie([2, 1, 3]), "désordre au début"
assert est_trie([]), "vide : trié"
assert est_trie([5]), "un élément : trié"
assert est_trie([2, 2, 3]), "égalités autorisées"
assert not est_trie([3, 2, 1]), "décroissant"
```

:::corrige
```python solution
def est_trie(t):
    for i in range(len(t) - 1):
        if t[i] > t[i + 1]:
            return False
    return True
```

Les cas à tester : tableau trié, désordre au **début** et à la **fin** (erreurs de borne), tableau **vide** et à **un élément** (trié par
convention), **égalités** (« au sens large » : `>` et non `>=`), tableau décroissant. La boucle s'arrête à `len(t) - 2` pour que `t[i + 1]`
existe : une erreur fréquente est d'écrire `range(len(t))`, qui provoque une `IndexError` que seul un test révèle.
:::
::::

::::exercice[Un jeu de tests qui détecte les bugs]{niveau=3}
Spécification : `nb_depassements(t, s)` renvoie le nombre de valeurs du tableau `t` **strictement** supérieures à `s`.

Écris `valide(f)`, qui applique un jeu de tests à une fonction `f` censée respecter cette spécification. Elle renvoie `True` si tous les tests réussissent, `False` sinon. Ton jeu de tests doit être assez bon pour détecter toutes les versions fausses essayées par le correcteur.

À l'écrit : si `valide(f)` renvoie `True`, la fonction `f` est-elle forcément correcte ? Justifie.

:::indice
Pense à la valeur égale au seuil, au premier élément, au dernier élément, au tableau vide et aux valeurs négatives.
:::

```python depart
def valide(f):
    ...
```

```python tests
def juste(t, s):
    return len([x for x in t if x > s])

def large(t, s):
    return len([x for x in t if x >= s])

def sans_dernier(t, s):
    return len([t[i] for i in range(len(t) - 1) if t[i] > s])

def sans_premier(t, s):
    return len([t[i] for i in range(1, len(t)) if t[i] > s])

def positifs(t, s):
    return len([x for x in t if x > s and x > 0])

def plante_si_vide(t, s):
    return t[0] * 0 + len([x for x in t if x > s])

assert valide(juste) is True, "version correcte acceptée"
assert valide(large) is False, "la valeur égale au seuil ne compte pas"
assert valide(sans_dernier) is False, "le dernier élément compte"
assert valide(sans_premier) is False, "le premier élément compte"
assert valide(positifs) is False, "les valeurs négatives comptent"
```

:::corrige
```python solution
def valide(f):
    return (f([1, 5, 9], 4) == 2
            and f([4, 4], 4) == 0
            and f([9, 1, 1], 4) == 1
            and f([1, 1, 9], 4) == 1
            and f([-1, -5], -3) == 1
            and f([], 0) == 0)
```

Chaque test vise une erreur précise : valeur égale au seuil, premier élément, dernier élément, valeurs négatives, tableau vide.

**À l'écrit.** Non : réussir des tests augmente la confiance, mais ne prouve rien pour les cas qui n'ont pas été essayés.
:::
::::
