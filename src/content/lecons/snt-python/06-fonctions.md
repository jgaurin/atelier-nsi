---
titre: "Fonctions : définir et appeler"
resume: "Définir une fonction avec def, l'appeler avec des arguments, renvoyer un résultat avec return : la différence entre return et print, l'ordre définition puis appel, et les erreurs classiques des élèves de seconde."
duree: 25
objectifs:
  - "Définir une fonction avec des paramètres et l'appeler avec des arguments"
  - "Distinguer renvoyer un résultat (return) et afficher (print)"
  - "Prévoir la valeur renvoyée par un appel de fonction"
  - "Repérer les erreurs classiques (appel avant définition, return oublié, print au lieu de return)"
prerequis: [snt-python/boucles-non-bornees]
programme: [snt-programmation]
cartes:
  - q: "Comment définir une fonction qui calcule le carré d'un nombre ?"
    r: "`def carre(x):` puis, indenté, `return x * x`. On l'appelle ensuite avec `carre(5)`, qui vaut 25."
  - q: "Différence entre `return` et `print` ?"
    r: "`return` **renvoie** une valeur au programme, qui peut la réutiliser (la stocker, la calculer) ; `print` ne fait **qu'afficher** à l'écran."
  - q: "Paramètre ou argument ?"
    r: "Le **paramètre** est le nom dans la définition (`x` dans `def carre(x)`) ; l'**argument** est la valeur donnée à l'appel (`5` dans `carre(5)`)."
  - q: "Que se passe-t-il après un `return` ?"
    r: "La fonction **s'arrête** immédiatement et renvoie la valeur : les lignes suivantes de la fonction ne sont pas exécutées."
  - q: "Pourquoi écrire des fonctions ?"
    r: "Pour **réutiliser** un calcul sans le recopier, **découper** un problème en petites tâches, et **tester** chaque morceau séparément."
---

Une **fonction** est un morceau de programme auquel on donne un **nom**, qu'on peut **réutiliser** autant de fois qu'on veut avec des valeurs
différentes. C'est la dernière notion de programmation du programme de seconde, et la plus utile pour structurer : en NSI, on écrira presque tout
sous forme de fonctions.

## Ce que dit le programme

Le programme de SNT cite les *définitions et appels de fonctions*. Les élèves doivent savoir **appeler** une fonction (y compris une fonction déjà
écrite, fournie par le professeur ou une bibliothèque), en **définir** une simple avec des paramètres, et **renvoyer** un résultat. La portée des
variables, la récursivité et la spécification formelle (préconditions, tests) relèvent de la NSI.

:::prof
En seconde, on fait souvent **appeler** des fonctions fournies avant d'en faire **écrire** : par exemple une fonction `luminosite(pixel)` donnée,
que les élèves utilisent dans une boucle sur une image. Ça permet de travailler les thèmes sans bloquer sur la syntaxe.
:::

## La notion

```python exec
def carre(x):
    return x * x

print(carre(5))
print(carre(3) + carre(4))
```

- `def` **définit** la fonction : son nom (`carre`), ses **paramètres** entre parenthèses (`x`), et son corps **indenté**.
- `return` **renvoie** le résultat : l'appel `carre(5)` **vaut** 25, et on peut l'utiliser dans un calcul.
- Une fonction définie ne fait **rien** tant qu'on ne l'**appelle** pas.

Une fonction peut avoir plusieurs paramètres, et utiliser des conditions ou des boucles :

```python exec
def prix_ttc(prix_ht, taux):
    return prix_ht * (1 + taux / 100)

def maximum(a, b):
    if a > b:
        return a
    else:
        return b

print(prix_ttc(50, 20))
print(maximum(7, 12))
```

**`return` ou `print` ?** C'est la confusion n° 1. `print` **affiche** et le résultat est perdu pour le programme ; `return` **renvoie** une valeur
qu'on peut stocker et réutiliser.

```python exec
def double_affiche(x):
    print(2 * x)

def double(x):
    return 2 * x

a = double(5) + 1           # 11 : on peut calculer avec le résultat
b = double_affiche(5)       # affiche 10, mais b ne contient rien d'utile
print(a, b)
```

## Les erreurs classiques des élèves

:::attention[Ce que tu verras en classe]
- **`print` au lieu de `return`** : la fonction affiche le bon résultat, mais on ne peut pas s'en servir (`None` récupéré).
- **Appeler la fonction avant de la définir** : `NameError`. La définition doit être exécutée avant l'appel.
- **Oublier les parenthèses** à l'appel : `carre` au lieu de `carre(5)`.
- **Redemander les valeurs avec `input()` dans la fonction** au lieu d'utiliser les paramètres.
- **Code après `return`** : il n'est jamais exécuté.
- **Mauvais nombre d'arguments** : `prix_ttc(50)` alors que la fonction en attend deux.
:::

## En classe

:::methode[Introduire les fonctions]
1. **Constat** : un programme qui recopie trois fois le même calcul (prix TTC de trois articles). « Et s'il y en avait cent ? »
2. **Analogie** : une fonction est comme une **machine** : on met des valeurs à l'entrée (arguments), elle renvoie un résultat.
3. **Appeler d'abord** des fonctions fournies, **puis** compléter le corps d'une fonction dont la définition est donnée, **puis** en écrire une.
4. **Tester** : faire écrire aux élèves deux ou trois appels avec le résultat attendu (`print(carre(3))` doit afficher 9).
:::

## L'essentiel

- `def nom(paramètres):` puis le corps indenté ; on l'**appelle** avec `nom(arguments)`.
- `return` renvoie une valeur utilisable ; `print` ne fait qu'afficher.
- Une fonction ne fait rien tant qu'elle n'est pas appelée, et doit être définie **avant** l'appel.
- `return` arrête la fonction.
- Les fonctions évitent de recopier du code et découpent un problème en tâches simples.

## Exercices

::::exercice[Grand QCM : fonctions]{niveau=1 type=quiz}
Onze questions sur les fonctions, au niveau de la seconde.

1. Que vaut `f(3)` ?

   ```python
   def f(x):
       return x + 10
   ```

   - [ ] 3
   - [x] 13
   - [ ] 10
   - [ ] `x + 10`

   > À l'appel, le paramètre `x` vaut 3 : la fonction renvoie 3 + 10.

1. Qu'affiche ce programme ?

   ```python
   def bonjour():
       print("Bonjour !")
   ```

   - [ ] Bonjour !
   - [x] rien
   - [ ] une erreur
   - [ ] `bonjour`

   > La fonction est **définie** mais jamais **appelée** : il manque `bonjour()`.

1. Dans `def aire(longueur, largeur):`, que sont `longueur` et `largeur` ?

   - [ ] des arguments
   - [x] des paramètres
   - [ ] des valeurs renvoyées
   - [ ] des fonctions

   > Les noms dans la définition sont les **paramètres** ; les valeurs données à l'appel sont les **arguments**.

1. Que vaut `r` ?

   ```python
   def triple(x):
       print(3 * x)

   r = triple(4)
   ```

   - [ ] 12
   - [x] `None` (rien d'utilisable)
   - [ ] 4
   - [ ] une erreur

   > La fonction **affiche** 12 mais ne **renvoie** rien : `r` ne contient pas 12. Il fallait `return 3 * x`.

1. Que vaut `g(2) + g(3)` ?

   ```python
   def g(n):
       return n * n
   ```

   - [ ] 5
   - [x] 13
   - [ ] 25
   - [ ] 10

   > 4 + 9 = 13 : chaque appel **vaut** une valeur qu'on peut additionner.

1. Que se passe-t-il ?

   ```python
   print(moitie(10))

   def moitie(x):
       return x / 2
   ```

   - [ ] affiche 5.0
   - [x] erreur : `moitie` n'est pas encore définie au moment de l'appel
   - [ ] affiche 5
   - [ ] n'affiche rien

   > Python exécute dans l'ordre : la définition doit venir **avant** l'appel.

1. Que renvoie `test(5)` ?

   ```python
   def test(x):
       return x
       return 2 * x
   ```

   - [x] 5
   - [ ] 10
   - [ ] 5 puis 10
   - [ ] une erreur

   > `return` arrête la fonction : la deuxième ligne n'est jamais exécutée.

1. Combien d'arguments faut-il donner à `def prix(ht, taux, remise):` ?

   - [ ] 1
   - [ ] 2
   - [x] 3
   - [ ] autant qu'on veut

   > Un argument par paramètre : `prix(100, 20, 10)`.

1. Que vaut `maxi(4, 9)` ?

   ```python
   def maxi(a, b):
       if a > b:
           return a
       return b
   ```

   - [ ] 4
   - [x] 9
   - [ ] 13
   - [ ] `True`

   > 4 > 9 est faux : on ne passe pas par le premier `return`, la fonction renvoie `b`.

1. Pourquoi est-il préférable d'utiliser `return` plutôt que `print` dans une fonction de calcul ?

   - [ ] parce que `print` est interdit dans une fonction
   - [x] parce qu'on peut réutiliser le résultat (le stocker, faire d'autres calculs, le tester)
   - [ ] parce que `return` affiche plus joliment
   - [ ] parce que c'est plus rapide

   > `print` montre une valeur à l'écran ; `return` la donne au programme.

1. Un élève a écrit une fonction qui commence par `x = int(input("Nombre ? "))` alors qu'elle a un paramètre `x`. Que lui dire ?

   - [ ] c'est parfait
   - [x] la valeur arrive déjà par le paramètre : la redemander écrase l'argument donné à l'appel
   - [ ] il faut mettre deux `input()`
   - [ ] il faut enlever le paramètre et garder `input()`

   > Une fonction reçoit ses données par ses **paramètres** ; la saisie se fait, si besoin, à l'extérieur, au moment de l'appel.
::::

::::exercice[Aire d'un rectangle]{niveau=1}
Écris `aire_rectangle(longueur, largeur)` qui renvoie l'aire d'un rectangle.

```python depart
def aire_rectangle(longueur, largeur):
    ...
```

```python tests
assert aire_rectangle(4, 3) == 12, "4 × 3 = 12"
assert aire_rectangle(5, 5) == 25, "un carré"
assert aire_rectangle(0, 7) == 0, "largeur nulle"
```

:::corrige
```python solution
def aire_rectangle(longueur, largeur):
    return longueur * largeur
```
:::
::::

::::exercice[Moyenne de trois notes]{niveau=1}
Écris `moyenne(a, b, c)` qui renvoie la moyenne de trois notes, puis `appreciation(m)` qui renvoie `"Bien"` si `m >= 14`, `"Correct"` si
`m >= 10` et `"Insuffisant"` sinon. Les deux fonctions s'utilisent ensemble : `appreciation(moyenne(12, 16, 17))`.

```python depart
def moyenne(a, b, c):
    ...

def appreciation(m):
    ...
```

```python tests
assert moyenne(12, 15, 9) == 12, "(12 + 15 + 9) / 3 = 12"
assert appreciation(15) == "Bien", "15 : Bien"
assert appreciation(10) == "Correct", "10 : Correct (cas limite)"
assert appreciation(moyenne(8, 9, 7)) == "Insuffisant", "moyenne 8 : Insuffisant"
```

:::corrige
```python solution
def moyenne(a, b, c):
    return (a + b + c) / 3

def appreciation(m):
    if m >= 14:
        return "Bien"
    elif m >= 10:
        return "Correct"
    else:
        return "Insuffisant"
```

Le dernier test montre l'intérêt de `return` : le résultat de `moyenne` sert directement d'argument à `appreciation`.
:::
::::

::::exercice[Compter les multiples]{niveau=2}
Écris `nb_multiples(n, k)` qui renvoie le nombre d'entiers de 1 à `n` (inclus) qui sont multiples de `k`. Tu peux utiliser une boucle.

```python depart
def nb_multiples(n, k):
    ...
```

```python tests
assert nb_multiples(10, 3) == 3, "3, 6, 9"
assert nb_multiples(20, 5) == 4, "5, 10, 15, 20"
assert nb_multiples(4, 7) == 0, "aucun"
```

:::corrige
```python solution
def nb_multiples(n, k):
    compteur = 0
    for i in range(1, n + 1):
        if i % k == 0:
            compteur = compteur + 1
    return compteur
```

Cet exercice réunit toute la programmation de seconde : une fonction, une boucle, une condition, un compteur.
:::
::::

::::exercice[Expliquer return et print]{niveau=2}
Un élève demande : « Ma fonction affiche bien 12, alors pourquoi `total = triple(4) + 1` ne marche pas ? ». Sa fonction est la suivante. Explique-lui
la différence entre `print` et `return`, avec une image ou une analogie.

```python
def triple(x):
    print(3 * x)
```

:::criteres
- L'explication distingue afficher (pour l'humain) et renvoyer (pour le programme).
- Elle dit que la fonction ne renvoie rien (`None`), d'où l'erreur.
- Une analogie ou une image claire est proposée.
- La correction est donnée : `return 3 * x`.
:::

:::corrige
« Ta fonction **montre** le résultat à l'écran, mais elle ne le **donne** pas au programme. C'est comme une calculatrice qui afficherait 12 sans te
laisser le réutiliser : tu le vois, mais tu ne peux pas continuer le calcul. `print` est fait pour toi, l'humain qui regarde l'écran ; `return` est
fait pour le programme, qui récupère la valeur. Ici, `triple(4)` ne renvoie rien (`None`), et Python ne sait pas faire `None + 1`. Remplace
`print(3 * x)` par `return 3 * x` : `triple(4)` vaudra 12, et `total` vaudra 13. »
:::
::::
