---
titre: La récursivité
resume: "Écrire et analyser une fonction qui s'appelle elle-même."
duree: 45
objectifs:
  - "Écrire un programme récursif"
  - "Analyser le fonctionnement d'un programme récursif"
---

Tu fais la queue au cinéma et tu veux savoir à quelle place tu es, sans sortir de la file. Tu demandes à la personne devant toi : « À quelle place es-tu ? » Elle pose la même question à la personne devant elle, et ainsi de suite, jusqu'à la première personne, qui répond « 1 ». Chacun ajoute alors 1 à la réponse reçue et la transmet en arrière.

Chacun résout **le même problème**, mais **plus petit**, et une personne sait répondre directement. C'est le principe de la **récursivité** : une fonction qui s'appelle elle-même.

## 1. Un premier exemple : la factorielle

La factorielle de n, notée n!, est le produit 1 × 2 × … × n. Par exemple, 4! = 1 × 2 × 3 × 4 = 24. On remarque que **n! = n × (n − 1)!** : pour calculer 4!, il suffit de connaître 3!.

```python exec
def fact(n):
    if n == 0:
        return 1
    return n * fact(n - 1)

print(fact(4))
```

Toute fonction récursive a deux parties :

- un **cas de base**, qui répond directement, sans appel récursif : ici, `fact(0)` vaut 1 ;
- un **appel récursif** sur un problème **plus petit**, qui se rapproche du cas de base : ici, `fact(n - 1)`.

## 2. Ce qui se passe vraiment : la pile d'appels

Quand `fact(3)` appelle `fact(2)`, il ne peut pas finir son calcul : il attend la réponse. Les appels en attente s'empilent, puis se terminent dans l'ordre inverse.

```
fact(3) = 3 * fact(2)                 en attente
              fact(2) = 2 * fact(1)          en attente
                            fact(1) = 1 * fact(0)   en attente
                                          fact(0) = 1   cas de base
                            fact(1) = 1 * 1 = 1
              fact(2) = 2 * 1 = 2
fact(3) = 3 * 2 = 6
```

Les appels en attente sont rangés dans la **pile d'appels** : le dernier appel lancé est le premier terminé, comme dans une pile.

## 3. Quand ça ne s'arrête pas

Si le cas de base n'est jamais atteint, les appels s'empilent sans fin. Python s'arrête alors avec une erreur `RecursionError`.

```python exec erreur
def fact(n):
    return n * fact(n - 1)

fact(3)
```

Il manque le cas de base : `fact(3)` appelle `fact(2)`, puis `fact(1)`, `fact(0)`, `fact(-1)`, et ainsi de suite.

Par défaut, Python accepte environ **1 000** appels en attente. Une fonction récursive correcte échoue donc aussi si elle doit descendre plus profond.

## 4. Une méthode pour écrire une fonction récursive

Exemple : la somme des éléments d'un tableau `t`, à partir de l'indice `i`.

1. **Le cas le plus simple** : si `i` vaut `len(t)`, il ne reste rien à additionner, la somme vaut 0.
2. **La confiance** : on suppose que l'appel `somme(t, i + 1)` renvoie la bonne somme du reste. Il suffit d'y ajouter `t[i]`.
3. **La vérification** : `i` augmente à chaque appel, donc on finit par atteindre `len(t)`.

```python exec
def somme(t, i):
    if i == len(t):
        return 0
    return t[i] + somme(t, i + 1)

print(somme([4, 1, 7], 0))
```

## L'essentiel

- Une fonction récursive s'appelle elle-même sur un problème plus petit.
- Il faut un **cas de base**, et un appel qui s'en rapproche.
- Les appels en attente forment la **pile d'appels** : le dernier lancé finit le premier.
- Sans cas de base atteint, ou au-delà d'environ 1 000 appels : `RecursionError`.

## Exercices

::::exercice[QCM : récursivité]{niveau=1 type=quiz}
Une question à la fois : la correction s'affiche aussitôt.

1. À quoi sert le cas de base ?

   - [ ] à accélérer la fonction
   - [x] à arrêter les appels récursifs
   - [ ] à afficher le résultat
   - [ ] à initialiser les variables

   > Sans lui, les appels ne s'arrêtent jamais.

1. Que vaut `fact(4)` avec la fonction du cours ?

   - [ ] 4
   - [ ] 10
   - [x] 24
   - [ ] 16

   > 4 × 3 × 2 × 1.

1. Combien d'appels à `fact` provoque `fact(4)` (en comptant le premier) ?

   - [ ] 4
   - [x] 5
   - [ ] 3
   - [ ] 24

   > fact(4), fact(3), fact(2), fact(1), fact(0).

1. Que provoque une fonction récursive sans cas de base en Python ?

   - [ ] une boucle infinie silencieuse
   - [x] une `RecursionError`
   - [ ] une `SyntaxError`
   - [ ] elle renvoie `None`

   > La pile d'appels est limitée à environ 1 000 appels.

1. Quelle structure de données le système utilise-t-il pour les appels en attente ?

   - [x] une pile
   - [ ] une file
   - [ ] un arbre binaire de recherche
   - [ ] un dictionnaire

   > Le dernier appel lancé est le premier terminé.
::::

::::exercice[Dérouler]{niveau=1 type=reponses}
Donne le résultat.

1. Que s'affiche-t-il ?

   ```python verifier
   def f(n):
       if n == 0:
           return 0
       return 2 + f(n - 1)

   print(f(4))
   ```

   - 8

1. Que s'affiche-t-il ?

   ```python verifier
   def g(s):
       if s == "":
           return 0
       return 1 + g(s[1:])

   print(g("NSI"))
   ```

   - 3

1. Que s'affiche-t-il ?

   ```python verifier
   def h(n):
       if n < 10:
           return n
       return h(n // 10)

   print(h(4827))
   ```

   - 4
::::

::::exercice[Compléter]{niveau=1 type=completer}
Cette fonction renvoie la somme des éléments d'un tableau à partir de l'indice `i`.

```python trous
def somme(t, i):
    if i == [[len(t)]]:
        return [[0]]
    return t[i] + somme(t, [[i + 1]])
```
::::

::::exercice[Premières fonctions récursives]{niveau=2}
Écris en **récursif** (sans boucle) : `somme_entiers(n)` qui renvoie 1 + 2 + … + n (0 si n = 0), `puissance(a, n)` et `compte(s, c)` qui
renvoie le nombre d'occurrences du caractère `c` dans la chaîne `s`.

```python depart
def somme_entiers(n):
    ...

def puissance(a, n):
    ...

def compte(s, c):
    ...
```

```python tests
assert somme_entiers(4) == 10 and somme_entiers(0) == 0, "somme des entiers"
assert puissance(2, 10) == 1024 and puissance(5, 0) == 1, "puissance"
assert compte("abracadabra", "a") == 5, "compte"
assert compte("", "a") == 0, "chaîne vide"
```

:::corrige
```python solution
def somme_entiers(n):
    if n == 0:
        return 0
    return n + somme_entiers(n - 1)

def puissance(a, n):
    if n == 0:
        return 1
    return a * puissance(a, n - 1)

def compte(s, c):
    if s == "":
        return 0
    if s[0] == c:
        return 1 + compte(s[1:], c)
    return compte(s[1:], c)
```

Même méthode à chaque fois : un cas de base (0, chaîne vide), puis on traite un élément et on fait confiance à l'appel sur le reste.
:::
::::

::::exercice[Palindromes et maximum]{niveau=2}
Écris en récursif `est_palindrome(s)` (la chaîne se lit pareil dans les deux sens) et `maximum(t)` qui renvoie le plus grand élément d'un
tableau non vide. Pour éviter de copier le tableau, `maximum` peut utiliser une fonction auxiliaire avec un indice.

```python depart
def est_palindrome(s):
    ...

def maximum(t):
    ...
```

```python tests
assert est_palindrome("radar") and est_palindrome("abba"), "palindromes"
assert not est_palindrome("radis"), "pas un palindrome"
assert est_palindrome("") and est_palindrome("x"), "cas de base"
assert maximum([3, 9, 2, 7]) == 9, "maximum"
assert maximum([-4]) == -4, "un élément"
```

:::corrige
```python solution
def est_palindrome(s):
    if len(s) <= 1:
        return True
    if s[0] != s[len(s) - 1]:
        return False
    return est_palindrome(s[1:len(s) - 1])

def maximum(t):
    def max_depuis(i):
        if i == len(t) - 1:
            return t[i]
        m = max_depuis(i + 1)
        if t[i] > m:
            return t[i]
        return m
    return max_depuis(0)
```

Pour le palindrome, il y a **deux** cas de base : longueur 0 ou 1 (vrai), premier et dernier caractères différents (faux).
:::
::::

::::exercice[L'arborescence d'un disque]{niveau=3}
Un dossier est représenté par un objet `Dossier`. Il contient une liste de fichiers, chacun étant un couple `(nom, taille)`, et une liste de sous-dossiers.

1. Écris `taille_totale(d)`, qui renvoie la taille de tous les fichiers de `d` et de ses sous-dossiers.
2. Écris `contient(d, nom)`, qui renvoie `True` si un fichier portant ce nom se trouve dans `d` ou dans un de ses sous-dossiers.
3. Écris `profondeur(d)`. Un dossier sans sous-dossier a une profondeur de 1.
4. À l'écrit : où se trouve le cas de base de `taille_totale` ? Que peut-il se passer avec 5 000 dossiers imbriqués les uns dans les autres ?

```python depart
class Dossier:
    def __init__(self, nom, fichiers, sous_dossiers):
        self.nom = nom
        self.fichiers = fichiers
        self.sous_dossiers = sous_dossiers

def taille_totale(d):
    ...

def contient(d, nom):
    ...

def profondeur(d):
    ...
```

```python tests
photos = Dossier("photos", [("a.jpg", 300), ("b.jpg", 200)], [])
cours = Dossier("cours", [("nsi.txt", 10)], [Dossier("vide", [], [])])
racine = Dossier("racine", [("lisez.txt", 1)], [photos, cours])
assert taille_totale(photos) == 500, "un seul dossier"
assert taille_totale(racine) == 511, "tous les niveaux"
assert contient(racine, "nsi.txt"), "fichier dans un sous-dossier"
assert not contient(racine, "absent"), "fichier absent"
assert profondeur(photos) == 1, "aucun sous-dossier"
assert profondeur(racine) == 3, "trois niveaux"
```

:::corrige
```python solution
class Dossier:
    def __init__(self, nom, fichiers, sous_dossiers):
        self.nom = nom
        self.fichiers = fichiers
        self.sous_dossiers = sous_dossiers

def taille_totale(d):
    total = 0
    for f in d.fichiers:
        total = total + f[1]
    for s in d.sous_dossiers:
        total = total + taille_totale(s)
    return total

def contient(d, nom):
    for f in d.fichiers:
        if f[0] == nom:
            return True
    for s in d.sous_dossiers:
        if contient(s, nom):
            return True
    return False

def profondeur(d):
    maxi = 0
    for s in d.sous_dossiers:
        maxi = max(maxi, profondeur(s))
    return 1 + maxi
```

**Question 4.** Le cas de base est implicite : pour un dossier sans sous-dossier, la seconde boucle ne fait aucun appel. Avec 5 000 niveaux, le nombre d'appels en attente dépasse la limite de Python : on obtient une `RecursionError`.
:::
::::
