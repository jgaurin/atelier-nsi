---
titre: La récursivité
resume: "Écrire et analyser une fonction qui s'appelle elle-même."
duree: 45
objectifs:
  - "Écrire un programme récursif"
  - "Analyser le fonctionnement d'un programme récursif"
---

Une fonction **récursive** s'appelle elle-même sur un problème **plus petit**.

## 1. Un exemple

```python exec
def fact(n):
    if n == 0:                  # cas de base
        return 1
    return n * fact(n - 1)      # appel récursif

print(fact(5))
```

Il faut toujours :

- un **cas de base**, qui s'arrête sans appel récursif ;
- un **appel récursif** sur un problème qui **se rapproche** du cas de base.

## 2. La pile d'appels

```
fact(3) = 3 * fact(2)
              fact(2) = 2 * fact(1)
                            fact(1) = 1 * fact(0)
                                          fact(0) = 1
```

Chaque appel attend le résultat du suivant, dans la **pile d'appels**. Le dernier lancé est le premier terminé.

Sans cas de base atteint, Python s'arrête avec une `RecursionError`.

## 3. Méthode

1. Quelle est l'entrée la plus simple, et sa réponse ?
2. En supposant que la fonction marche sur un problème plus petit, comment obtenir la réponse ?
3. Le problème se rapproche-t-il bien du cas de base ?

## L'essentiel

- Un cas de base et un appel sur un problème plus petit.
- Les appels en attente sont rangés dans la pile d'appels.
- Sans cas de base atteint : `RecursionError`.

## Exercices

::::exercice[QCM : récursivité]{niveau=1 type=quiz}
Une question à la fois : la correction s'affiche aussitôt.

1. Qu'est-ce qu'une fonction récursive ?

   - [ ] une fonction qui contient une boucle
   - [x] une fonction qui s'appelle elle-même
   - [ ] une fonction sans paramètre
   - [ ] une fonction qui renvoie une fonction

   > Sur un problème plus petit, jusqu'au cas de base.

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

1. Que renvoie cette fonction pour n = 3 : `def f(n): if n == 0: return 0 ; f(n - 1)` (le cas récursif n'a pas de `return`) ?

   - [ ] 0
   - [ ] 3
   - [x] `None`
   - [ ] une erreur

   > Le résultat de l'appel récursif est calculé puis perdu.

1. Que vaut `inverse("abc")` avec la fonction du cours ?

   - [x] `"cba"`
   - [ ] `"abc"`
   - [ ] `"bca"`
   - [ ] `""`

   > inverse("bc") + "a" = "cb" + "a".

1. Combien de multiplications environ pour calculer a¹⁰²⁴ avec la puissance rapide ?

   - [ ] 1 024
   - [ ] 512
   - [x] une dizaine
   - [ ] 2

   > 1 024 = 2¹⁰ : on élève au carré dix fois.

1. Laquelle de ces affirmations est vraie ?

   - [ ] une fonction récursive est toujours plus rapide que sa version itérative
   - [x] tout programme récursif peut s'écrire de façon itérative
   - [ ] une fonction récursive ne peut pas avoir deux cas de base
   - [ ] la récursivité est interdite pour les tableaux

   > Les deux styles sont équivalents en puissance.
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

::::exercice[Premières fonctions récursives]{niveau=1}
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

::::exercice[Les tours de Hanoï]{niveau=2}
On doit déplacer n disques de la tour `"A"` vers la tour `"C"`, en s'aidant de `"B"`, sans jamais poser un disque sur un plus petit. La
solution récursive : déplacer n − 1 disques de A vers B, déplacer le plus grand de A vers C, puis déplacer les n − 1 disques de B vers C.
Écris `hanoi(n, depart, arrivee, aide)` qui renvoie la liste des mouvements, chacun sous la forme d'un couple `(depart, arrivee)`.

```python depart
def hanoi(n, depart, arrivee, aide):
    ...
```

```python tests
assert hanoi(1, "A", "C", "B") == [("A", "C")], "un disque"
assert hanoi(2, "A", "C", "B") == [("A", "B"), ("A", "C"), ("B", "C")], "deux disques"
assert len(hanoi(3, "A", "C", "B")) == 7, "trois disques : 7 coups"
assert len(hanoi(10, "A", "C", "B")) == 1023, "dix disques : 2^10 - 1 coups"
```

:::corrige
```python solution
def hanoi(n, depart, arrivee, aide):
    if n == 0:
        return []
    return (hanoi(n - 1, depart, aide, arrivee)
            + [(depart, arrivee)]
            + hanoi(n - 1, aide, arrivee, depart))
```

Le nombre de coups vérifie c(n) = 2 c(n − 1) + 1, donc c(n) = 2ⁿ − 1 : pour 64 disques, à un coup par seconde, il faudrait plus de 500
milliards d'années.
:::
::::
