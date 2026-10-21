---
titre: Spécification, tests et mise au point
resume: "Le cours de première NSI sur la qualité des programmes : spécifier une fonction (docstring, préconditions, postconditions), vérifier avec assert, écrire des jeux de tests dont les cas limites, lire un message d'erreur, déboguer, utiliser la documentation d'une bibliothèque."
duree: 45
objectifs:
  - "Spécifier une fonction : rôle, paramètres, préconditions, valeur renvoyée"
  - "Utiliser assert pour vérifier une précondition et écrire des tests"
  - "Construire un jeu de tests qui couvre les cas limites"
  - "Lire un message d'erreur et corriger un programme"
  - "Utiliser la documentation d'une bibliothèque (help, import)"
prerequis: [snt-python/fonctions, nsi-premiere/tableaux]
programme: [nsi1-langages]
cartes:
  - q: "Que contient la spécification d'une fonction ?"
    r: "Son **rôle**, ses **paramètres** et leur type, les **préconditions** (ce qui doit être vrai à l'appel) et les **postconditions** (ce qui est garanti sur le résultat). En Python, dans la **docstring**."
  - q: "Que fait `assert condition, \"message\"` ?"
    r: "Rien si la condition est vraie ; sinon, le programme s'arrête avec une `AssertionError` et le message."
  - q: "Qu'est-ce qu'un cas limite ?"
    r: "Une entrée à la frontière : tableau vide, un seul élément, valeur égale à un seuil, 0, nombre négatif, élément en première ou dernière position."
  - q: "Un programme qui passe tous les tests est-il correct ?"
    r: "Pas forcément : les tests montrent la présence d'erreurs, jamais leur absence (Dijkstra). Ils augmentent la confiance."
  - q: "Comment lire un message d'erreur Python ?"
    r: "Par la **fin** : la dernière ligne donne le **type** d'erreur (NameError, TypeError, IndexError…) et la ligne au-dessus le **numéro de ligne** fautive."
  - q: "Comment connaître les fonctions d'une bibliothèque ?"
    r: "`import math` puis `help(math)` ou `help(math.sqrt)`, ou la documentation en ligne ; `dir(math)` liste ses noms."
---

Écrire un programme qui « marche sur mon exemple » ne suffit pas. En première NSI, on apprend à dire **précisément** ce qu'une fonction doit
faire (la spécifier), à le **vérifier** (les tests) et à **trouver** les erreurs (la mise au point). Ce chapitre est transversal : il sert dans
tous les autres.

## Ce que dit le programme

Contenus : *constructions élémentaires ; spécification ; mise au point de programmes ; utilisation de bibliothèques*. Capacités attendues :
**prototyper une fonction**, **décrire les préconditions** sur les arguments et les **postconditions** sur les résultats ; **utiliser des jeux
de tests** ; **utiliser la documentation d'une bibliothèque**. Le programme insiste sur l'importance de la **lisibilité** et des
**commentaires**, et sur l'intérêt de tester les **cas limites**.

## 1. Spécifier une fonction

La **spécification** dit **ce que** fait une fonction, pas **comment**. On l'écrit dans la **docstring**, juste sous la ligne `def` :

```python exec
def moyenne(t):
    """Renvoie la moyenne des nombres du tableau t.

    Précondition : t est un tableau non vide de nombres.
    Postcondition : le résultat est compris entre le minimum et le maximum de t.
    """
    total = 0
    for x in t:
        total = total + x
    return total / len(t)

help(moyenne)
```

- **Prototype** : le nom de la fonction, ses paramètres, ce qu'elle renvoie. On peut préciser les types : `def moyenne(t: list) -> float:`.
- **Précondition** : ce qui doit être vrai **avant** l'appel (« t non vide »). Si elle n'est pas respectée, la fonction n'a rien promis.
- **Postcondition** : ce qui est garanti **après** (« le résultat est entre le min et le max »).

## 2. Vérifier avec assert

L'instruction `assert` vérifie qu'une condition est vraie et arrête le programme sinon. On l'utilise pour **vérifier une précondition** :

```python exec erreur
def moyenne(t):
    """Renvoie la moyenne des nombres du tableau t (non vide)."""
    assert len(t) > 0, "le tableau ne doit pas être vide"
    total = 0
    for x in t:
        total = total + x
    return total / len(t)

print(moyenne([]))      # AssertionError : le tableau ne doit pas être vide
```

Le message d'erreur est clair et apparaît **là où le problème est né**, au lieu d'une `ZeroDivisionError` plus loin.

## 3. Écrire des tests

On utilise aussi `assert` pour **tester** une fonction : on compare son résultat au résultat attendu, calculé à la main.

```python exec
def maximum(t):
    """Renvoie le plus grand élément de t (non vide)."""
    m = t[0]
    for x in t:
        if x > m:
            m = x
    return m

# Jeu de tests
assert maximum([3, 9, 2]) == 9            # cas général
assert maximum([7]) == 7                  # un seul élément
assert maximum([9, 1, 2]) == 9            # maximum en première position
assert maximum([1, 2, 9]) == 9            # maximum en dernière position
assert maximum([-5, -2, -8]) == -2        # nombres négatifs
assert maximum([4, 4, 4]) == 4            # tous égaux
print("Tous les tests passent")
```

Un bon jeu de tests couvre les **cas limites** :

- tableau **vide** (si autorisé) ou à **un seul** élément ;
- élément cherché en **première** ou **dernière** position, ou **absent** ;
- valeurs **égales** à un seuil (`>=` ou `>` ?) ;
- **0**, nombres **négatifs**, chaîne vide.

:::remarque[Les tests ne prouvent rien]
Un programme qui passe 100 tests peut être faux sur le 101e. « Tester un programme peut montrer la présence de bugs, jamais leur absence »
(Edsger Dijkstra). Les tests augmentent la **confiance** ; la **preuve** de correction (invariant de boucle) est abordée avec les algorithmes.
:::

On écrit souvent les tests **avant** la fonction : c'est une façon de réfléchir à la spécification.

## 4. Lire un message d'erreur

Un message d'erreur se lit **par la fin** :

```
Traceback (most recent call last):
  File "tp.py", line 7, in <module>
    print(moyenne(notes))
  File "tp.py", line 4, in moyenne
    total = total + x
TypeError: unsupported operand type(s) for +: 'int' and 'str'
```

La dernière ligne donne le **type** d'erreur et l'explication ; la ligne au-dessus, l'**endroit** (ligne 4, dans `moyenne`). Ici, le tableau
contenait une chaîne (`"15"` lue dans un fichier ?).

| Erreur | Cause fréquente |
| --- | --- |
| `SyntaxError` | `:` oublié, parenthèse non fermée, `=` au lieu de `==` |
| `IndentationError` | indentation incohérente |
| `NameError` | variable mal orthographiée ou non définie |
| `TypeError` | opération entre types incompatibles (`"3" + 4`) |
| `IndexError` | indice hors du tableau |
| `KeyError` | clé absente d'un dictionnaire |
| `ZeroDivisionError` | division par zéro |

Les erreurs les plus difficiles sont celles **sans message** : le programme tourne mais donne un mauvais résultat. C'est là que les tests
servent.

## 5. Mettre au point (déboguer)

Méthode :

1. **Reproduire** l'erreur avec un exemple **le plus petit possible**.
2. **Observer** : ajouter des `print` des variables dans la boucle, ou utiliser **Python Tutor** / le débogueur de Thonny (pas à pas).
3. **Faire une hypothèse**, corriger, puis **relancer tous les tests** (une correction peut en casser une autre).

## 6. Utiliser une bibliothèque

Inutile de tout réécrire : Python fournit des **modules**.

```python exec
import math
from random import randint

print(math.sqrt(16), math.pi)
print(randint(1, 6))      # un entier entre 1 et 6 inclus
```

Pour savoir ce qu'ils contiennent : `help(math)`, `help(math.sqrt)`, `dir(math)`, ou la documentation officielle (docs.python.org). Savoir lire
une documentation est une compétence à part entière.

## Les erreurs classiques des élèves

:::attention[Ce que tu verras en classe]
- **Ne tester que l'exemple de l'énoncé**, jamais les cas limites.
- **Confondre `assert` et `if`** : `assert` arrête le programme, il ne sert pas à choisir un chemin.
- **Écrire `assert f(x) = 5`** (affectation au lieu de comparaison).
- **Lire le message d'erreur par le haut**, ou ne pas le lire du tout.
- **Corriger au hasard** sans comprendre, puis ne pas relancer les tests.
- **Docstring qui raconte le code** (« on fait une boucle ») au lieu de dire ce que fait la fonction.
:::

## En classe

:::methode[Activités qui marchent]
1. **Chasse au bug** : des fonctions avec une erreur cachée (indice de départ, `<` au lieu de `<=`), les élèves écrivent le test qui la révèle.
2. **Tests d'abord** : on donne seulement la spécification, chaque binôme écrit des tests ; on les fait tourner sur les fonctions des autres.
3. **Collection d'erreurs** : afficher au tableau des messages d'erreur réels, les élèves trouvent la cause.
4. **Documentation** : découvrir une fonction inconnue du module `random` ou `turtle` avec `help`.
:::

## L'essentiel

- **Spécification** (docstring) : rôle, paramètres, **préconditions**, **postconditions**.
- `assert condition, "message"` : vérifie une précondition ou écrit un **test**.
- Un bon jeu de tests couvre les **cas limites** (vide, un élément, premier, dernier, absent, égalité au seuil, négatifs).
- Les tests ne **prouvent** pas la correction, ils la rendent plausible.
- Message d'erreur : lire **la dernière ligne** (type) puis le **numéro de ligne**.
- Mise au point : reproduire petit, observer, corriger, **relancer tous les tests**. Bibliothèques : `import`, `help`.

## Exercices

::::exercice[Grand QCM : spécification et tests]{niveau=1 type=quiz}
Dix questions sur la spécification, les tests et la mise au point.

1. Qu'est-ce qu'une précondition ?

   - [ ] ce que la fonction renvoie
   - [x] une condition qui doit être vraie au moment de l'appel
   - [ ] la première ligne de la fonction
   - [ ] un test écrit avant la fonction

   > Exemple : « le tableau n'est pas vide ».

1. Que se passe-t-il si `assert x > 0` est exécuté avec x = -3 ?

   - [ ] rien
   - [ ] x devient positif
   - [x] le programme s'arrête avec une `AssertionError`
   - [ ] la ligne est ignorée

   > Si la condition est fausse, l'exécution s'arrête.

1. Lequel est un test correct de `carre(3)` ?

   - [ ] `assert carre(3) = 9`
   - [x] `assert carre(3) == 9`
   - [ ] `if carre(3) == 9`
   - [ ] `assert 9`

   > `==` compare ; `=` serait une erreur de syntaxe.

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

1. Comment afficher la documentation de la fonction `sqrt` du module `math` ?

   - [ ] `doc(sqrt)`
   - [x] `import math` puis `help(math.sqrt)`
   - [ ] `math.help()`
   - [ ] `print(sqrt)`

   > `help` affiche la docstring.

1. Que doit contenir la docstring d'une fonction ?

   - [ ] le détail de chaque ligne du code
   - [x] ce que fait la fonction, ses paramètres et ses conditions d'utilisation
   - [ ] le nom de l'auteur uniquement
   - [ ] les tests

   > Elle décrit le « quoi », pas le « comment ».
::::

::::exercice[Corriger une fonction boguée]{niveau=1}
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

::::exercice[Précondition et tests]{niveau=2}
Écris `indice_premier(t, x)` qui renvoie l'indice de la première occurrence de `x` dans le tableau `t`, ou `-1` si `x` est absent, puis
`moyenne_ponderee(notes, coefs)` qui renvoie la moyenne pondérée. Pour cette seconde fonction, vérifie avec `assert` les préconditions : les
deux tableaux ont la même longueur et la somme des coefficients est strictement positive.

```python depart
def indice_premier(t, x):
    ...

def moyenne_ponderee(notes, coefs):
    ...
```

```python tests
assert indice_premier([4, 7, 4], 4) == 0, "première occurrence"
assert indice_premier([4, 7, 4], 9) == -1, "absent"
assert indice_premier([], 1) == -1, "tableau vide"
assert indice_premier([1, 2, 3], 3) == 2, "dernière position"
assert moyenne_ponderee([10, 16], [1, 2]) == 14, "pondération"
erreur = False
try:
    moyenne_ponderee([10, 16], [1])
except AssertionError:
    erreur = True
assert erreur, "longueurs différentes : AssertionError attendue"
erreur = False
try:
    moyenne_ponderee([10], [0])
except AssertionError:
    erreur = True
assert erreur, "coefficients nuls : AssertionError attendue"
```

:::corrige
```python solution
def indice_premier(t, x):
    for i in range(len(t)):
        if t[i] == x:
            return i
    return -1

def moyenne_ponderee(notes, coefs):
    assert len(notes) == len(coefs), "autant de notes que de coefficients"
    somme_coefs = 0
    for c in coefs:
        somme_coefs = somme_coefs + c
    assert somme_coefs > 0, "la somme des coefficients doit être positive"
    total = 0
    for i in range(len(notes)):
        total = total + notes[i] * coefs[i]
    return total / somme_coefs
```

Le `return i` dans la boucle arrête la fonction dès la première occurrence. Les `assert` empêchent un résultat absurde (ou une division par
zéro) et donnent un message clair.
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

::::exercice[Apprendre à lire une erreur]{niveau=1}
Un élève t'appelle : « Python me dit `IndexError: list index out of range` à la ligne 5, mais mon code est juste ! » Voici sa fonction :
`def somme_voisins(t): s = [] ; for i in range(len(t)): s.append(t[i] + t[i + 1]) ; return s` (sur plusieurs lignes). Explique-lui la
démarche pour comprendre l'erreur, puis la correction.

:::criteres
- Lire la dernière ligne : type IndexError, un indice dépasse la taille du tableau.
- Identifier la ligne et l'expression : `t[i + 1]` quand i vaut `len(t) - 1`.
- Démarche : afficher i ou dérouler à la main sur un petit tableau ; puis corriger en `range(len(t) - 1)` et retester (tableau vide, un
  élément).
:::

:::corrige
Je lui fais lire le message **par la fin** : `IndexError` veut dire qu'on accède à une case qui n'existe pas, à la ligne 5, celle du `append`.
Sur cette ligne, deux accès : `t[i]` et `t[i + 1]`. Je lui fais **dérouler** sur un petit exemple, `t = [1, 2, 3]` : i va de 0 à 2 ; pour
i = 2, `t[3]` n'existe pas. On peut aussi ajouter `print(i)` dans la boucle pour le voir. Correction : la boucle doit s'arrêter un cran plus tôt,
`for i in range(len(t) - 1)`. Puis on **reteste**, y compris avec `[]` et `[5]` qui doivent donner `[]`. Le message n'est pas un reproche :
c'est un indice précis qui dit où chercher.
:::
::::
