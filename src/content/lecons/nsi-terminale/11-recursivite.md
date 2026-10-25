---
titre: Récursivité
resume: "Le cours de terminale NSI sur la récursivité : fonction qui s'appelle elle-même, cas de base et cas récursif, exemples (factorielle, puissance, somme, chaînes), déroulé et pile d'appels, terminaison, limite de récursion, comparaison avec l'itératif, puissance rapide."
duree: 55
objectifs:
  - "Écrire une fonction récursive avec un cas de base et un cas récursif"
  - "Dérouler l'exécution d'une fonction récursive et décrire la pile d'appels"
  - "Justifier la terminaison d'une fonction récursive"
  - "Passer d'une version itérative à une version récursive et inversement"
prerequis: [snt-python/fonctions, nsi-premiere/tableaux]
programme: [nsit-langages]
cartes:
  - q: "Qu'est-ce qu'une fonction récursive ?"
    r: "Une fonction qui **s'appelle elle-même** sur un problème **plus petit**, jusqu'à un **cas de base** qu'elle sait résoudre directement."
  - q: "Les deux ingrédients d'une fonction récursive ?"
    r: "Un **cas de base** (arrêt, sans appel récursif) et un **cas récursif** qui se rapproche du cas de base."
  - q: "Factorielle en récursif ?"
    r: "`def fact(n): if n == 0: return 1 ; return n * fact(n - 1)`."
  - q: "Qu'est-ce que la pile d'appels ?"
    r: "La structure où le système range les appels **en attente** : chaque appel récursif empile un contexte (variables locales), dépilé quand l'appel renvoie son résultat."
  - q: "Que provoque une récursion sans cas de base atteint ?"
    r: "Une `RecursionError` (maximum recursion depth exceeded) : la pile d'appels déborde (environ 1 000 appels par défaut en Python)."
  - q: "Puissance rapide ?"
    r: "aⁿ = (a^(n/2))² si n est pair, a × aⁿ⁻¹ si n est impair : environ log₂(n) multiplications au lieu de n."
---

Une poupée russe contient une poupée plus petite, qui en contient une plus petite… jusqu'à la dernière, pleine. Une **fonction récursive**
fonctionne de la même façon : pour résoudre un problème, elle se ramène au **même problème en plus petit**, jusqu'à un cas si simple qu'on
connaît directement la réponse. C'est une façon de penser essentielle en terminale : arbres, graphes, diviser pour régner en dépendent.

## Ce que dit le programme

Contenus : *récursivité*. Capacités attendues : **écrire un programme récursif** ; **analyser le fonctionnement d'un programme récursif**. Le
programme précise : des exemples relevant de domaines variés sont à privilégier ; on peut évoquer la **pile d'appels** et la **terminaison**.

## 1. Un premier exemple : la factorielle

La factorielle de n est n! = n × (n − 1) × … × 2 × 1, avec 0! = 1. On remarque que n! = n × (n − 1)! : c'est une définition **récursive**.

```python exec
def fact(n):
    if n == 0:                  # cas de base
        return 1
    return n * fact(n - 1)      # cas récursif

print(fact(5), fact(0), fact(10))
```

Toute fonction récursive a deux parties :

- un **cas de base**, qui renvoie un résultat **sans** appel récursif ;
- un **cas récursif**, qui appelle la fonction sur un problème **plus petit**, qui **se rapproche** du cas de base.

## 2. Comment ça s'exécute : la pile d'appels

Déroulons `fact(3)` :

```
fact(3) = 3 * fact(2)                 en attente
              fact(2) = 2 * fact(1)        en attente
                            fact(1) = 1 * fact(0)   en attente
                                          fact(0) = 1
                            fact(1) = 1 * 1 = 1
              fact(2) = 2 * 1 = 2
fact(3) = 3 * 2 = 6
```

Chaque appel attend le résultat du suivant. Le système range ces appels **en attente** dans la **pile d'appels** : on empile à chaque appel, on
dépile quand un appel renvoie son résultat. Le dernier appel lancé (`fact(0)`) est le premier terminé : c'est bien une **pile** (LIFO).

```python exec
def fact(n, profondeur=0):
    print("  " * profondeur + "appel fact(" + str(n) + ")")
    if n == 0:
        resultat = 1
    else:
        resultat = n * fact(n - 1, profondeur + 1)
    print("  " * profondeur + "fact(" + str(n) + ") renvoie " + str(resultat))
    return resultat

fact(3)
```

## 3. Terminaison

Une fonction récursive se **termine** si chaque appel récursif se rapproche **strictement** du cas de base, et finit par l'atteindre. Pour
`fact`, n diminue de 1 à chaque appel et finit par valoir 0 (pour n entier positif).

Sans cela, les appels s'empilent sans fin et Python s'arrête avec une erreur :

```python exec erreur
def fact_faux(n):
    return n * fact_faux(n - 1)     # pas de cas de base

fact_faux(5)                        # RecursionError: maximum recursion depth exceeded
```

Python limite la pile à environ **1 000** appels. Même une fonction correcte échoue donc si la profondeur dépasse cette limite (`fact(5000)`) :
il faut alors une version itérative.

## 4. D'autres exemples

```python exec
def somme(t, i=0):
    """Somme des éléments de t à partir de l'indice i."""
    if i == len(t):
        return 0
    return t[i] + somme(t, i + 1)

def puissance(a, n):
    if n == 0:
        return 1
    return a * puissance(a, n - 1)

def inverse(s):
    """Renvoie la chaîne s à l'envers."""
    if s == "":
        return ""
    return inverse(s[1:]) + s[0]

def nb_chiffres(n):
    if n < 10:
        return 1
    return 1 + nb_chiffres(n // 10)

print(somme([3, 1, 4, 1, 5]), puissance(2, 10), inverse("NSI"), nb_chiffres(20260))
```

La méthode pour écrire une fonction récursive :

1. **Cas de base** : quelle est l'entrée la plus simple (0, chaîne vide, tableau vide, arbre vide) et sa réponse ?
2. **Cas récursif** : *en supposant* que la fonction marche sur un problème plus petit, comment obtenir la réponse ?
3. **Terminaison** : vérifier que le problème diminue et atteint le cas de base.

## 5. Récursif ou itératif ?

Tout programme récursif peut s'écrire avec des boucles, et inversement.

```python exec
def fact_iter(n):
    r = 1
    for k in range(2, n + 1):
        r = r * k
    return r

print(fact_iter(5))
```

- La version **récursive** est souvent plus **proche de la définition** et plus **lisible**, surtout pour des structures récursives (arbres,
  graphes).
- La version **itérative** n'utilise pas la pile d'appels : pas de limite de profondeur, et souvent un peu plus rapide.

Attention aux récursions qui **recalculent** plusieurs fois la même chose : la suite de Fibonacci écrite naïvement (`fibo(n - 1) +
fibo(n - 2)`) fait un nombre d'appels qui explose. C'est le point de départ de la **programmation dynamique**.

## 6. La puissance rapide

La récursivité permet aussi des algorithmes **plus efficaces**. Pour calculer aⁿ :

- si n est **pair**, aⁿ = (a^(n/2))² ;
- si n est **impair**, aⁿ = a × aⁿ⁻¹.

```python exec
def puissance_rapide(a, n):
    if n == 0:
        return 1
    if n % 2 == 0:
        p = puissance_rapide(a, n // 2)
        return p * p
    return a * puissance_rapide(a, n - 1)

print(puissance_rapide(2, 10), puissance_rapide(3, 13))
```

n est divisé par 2 au moins une fois sur deux : environ **2 log₂(n)** multiplications au lieu de n. Pour n = 1 000 000, une quarantaine au lieu
d'un million. C'est le principe de **diviser pour régner**.

## Les erreurs classiques des élèves

:::attention[Ce que tu verras en classe]
- **Oublier le cas de base**, ou un cas de base jamais atteint (`n == 0` alors que n diminue de 2 et part d'un nombre impair).
- **Oublier le `return`** devant l'appel récursif : `fact(n - 1)` calcule mais le résultat est perdu, la fonction renvoie `None`.
- **Appeler sur le même problème** (`fact(n)` dans `fact(n)`) : récursion infinie.
- **Vouloir suivre tous les appels de tête** : il faut au contraire faire confiance à l'appel sur le problème plus petit.
- **Appeler deux fois la même fonction** au lieu de stocker le résultat (`puissance_rapide(a, n // 2) * puissance_rapide(a, n // 2)`).
:::

## En classe

:::methode[Activités qui marchent]
1. **Débranché** : la file d'élèves où chacun demande à son voisin « combien de personnes derrière toi ? » ; les poupées russes.
2. **Dessins récursifs** avec `turtle` : arbre fractal, flocon de Koch, triangle de Sierpiński.
3. **Python Tutor** pour voir la pile d'appels grandir puis se vider.
4. **Les tours de Hanoï** : la solution récursive en trois lignes, et le nombre de coups 2ⁿ − 1.
:::

## L'essentiel

- Une fonction **récursive** s'appelle sur un problème **plus petit** ; elle a un **cas de base** et un **cas récursif**.
- L'exécution utilise la **pile d'appels** : les appels en attente s'empilent, puis se résolvent dans l'ordre inverse.
- **Terminaison** : le problème diminue strictement et atteint le cas de base ; sinon `RecursionError` (limite ≈ 1 000 appels).
- Récursif (proche de la définition, idéal pour les arbres) ou itératif (pas de limite de pile) : les deux sont possibles.
- **Puissance rapide** : environ log₂(n) étapes, un premier exemple de diviser pour régner.

## Exercices

::::exercice[Grand QCM : récursivité]{niveau=1 type=quiz}
Dix questions sur la récursivité.

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

::::exercice[Puissance rapide et nombre de multiplications]{niveau=2}
Écris `puissance_rapide(a, n)` puis `nb_mult(n)` qui renvoie le nombre de multiplications effectuées par la puissance rapide pour un exposant n
(une pour `p * p`, une pour `a * ...` ; 0 pour n = 0).

```python depart
def puissance_rapide(a, n):
    ...

def nb_mult(n):
    ...
```

```python tests
assert puissance_rapide(2, 10) == 1024, "2^10"
assert puissance_rapide(3, 13) == 3 ** 13, "3^13"
assert puissance_rapide(7, 0) == 1, "exposant nul"
assert nb_mult(1) == 1 and nb_mult(2) == 2, "petits exposants"
assert nb_mult(1024) == 11, "1024 = 2^10"
assert nb_mult(1000000) < 50, "bien moins qu'un million"
```

:::corrige
```python solution
def puissance_rapide(a, n):
    if n == 0:
        return 1
    if n % 2 == 0:
        p = puissance_rapide(a, n // 2)
        return p * p
    return a * puissance_rapide(a, n - 1)

def nb_mult(n):
    if n == 0:
        return 0
    if n % 2 == 0:
        return 1 + nb_mult(n // 2)
    return 1 + nb_mult(n - 1)
```

`nb_mult` a exactement la même structure que `puissance_rapide` : on compte au lieu de calculer. Pour 1 024 : dix carrés et une multiplication
par a (pour n = 1).
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

::::exercice[Expliquer la récursivité]{niveau=2}
Un élève dit : « Je ne comprends pas comment `fact(n - 1)` peut marcher alors qu'on n'a pas fini d'écrire `fact` ! » Explique-lui, en
déroulant `fact(3)` et en parlant de la pile d'appels, puis donne-lui une méthode pour écrire lui-même une fonction récursive.

:::criteres
- Au moment de l'exécution, la fonction est entièrement définie : l'appel `fact(n - 1)` exécute le même code avec un autre n.
- Déroulé de `fact(3)` jusqu'à `fact(0)`, puis remontée des résultats (1, 1, 2, 6).
- La pile d'appels : chaque appel attend le résultat du suivant.
- Méthode : cas de base, puis supposer que l'appel sur plus petit marche, vérifier la terminaison.
:::

:::corrige
Quand Python **exécute** `fact(3)`, la fonction est déjà entièrement définie : l'appel `fact(2)` exécute simplement **le même code** avec une
autre valeur de n, comme si on appelait une autre fonction. `fact(3)` attend le résultat de `fact(2)`, qui attend `fact(1)`, qui attend
`fact(0)`. Ces appels en attente sont rangés dans la **pile d'appels**. `fact(0)` répond directement 1 (cas de base) ; alors `fact(1)` peut
calculer 1 × 1 = 1, `fact(2)` calcule 2 × 1 = 2, et `fact(3)` calcule 3 × 2 = 6 : les appels se dépilent dans l'ordre inverse.

Pour écrire une fonction récursive : 1) trouve le **cas le plus simple** et sa réponse ; 2) **suppose** que ta fonction marche déjà pour un
problème un peu plus petit, et demande-toi comment t'en servir ; 3) vérifie que chaque appel se **rapproche** du cas simple. Ne cherche pas à
suivre tous les appels dans ta tête : fais confiance à l'appel plus petit.
:::
::::
