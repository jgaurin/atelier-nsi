---
titre: Utiliser une bibliothèque
resume: "Importer un module et trouver dans sa documentation comment l'utiliser."
duree: 25
objectifs:
  - "Importer un module"
  - "Utiliser la documentation d'une bibliothèque"
prerequis: [premiere-langages/constructions]
---

Pour calculer une racine carrée ou tirer un nombre au hasard, inutile de tout réécrire : Python fournit des **bibliothèques**, appelées aussi modules, remplies de fonctions prêtes à l'emploi et déjà testées.

## 1. Importer une bibliothèque

Il y a deux façons d'importer.

```python exec
import math
print(math.sqrt(16), math.floor(2.7))
```

`import math` rend disponible tout le module. On écrit ensuite le nom du module devant chaque fonction : `math.sqrt(16)` calcule la racine carrée de 16, et `math.floor(2.7)` arrondit à l'entier inférieur.

```python exec
from random import randint
de = randint(1, 6)
print(1 <= de <= 6)
```

`from random import randint` importe une seule fonction : on l'écrit alors directement, sans `random.` devant. `randint(1, 6)` renvoie un entier au hasard entre 1 et 6.

## 2. Lire une documentation

Comment savoir ce que fait une fonction, et comment l'appeler ? On lit sa **documentation**, avec `help(math.sqrt)` dans Python ou sur le site officiel. On y cherche trois choses :

| Question | Exemple pour `randint(a, b)` |
| --- | --- |
| Que fait-elle ? | elle renvoie un entier au hasard |
| Quels **paramètres** ? | a et b, les bornes |
| Que **renvoie**-t-elle, exactement ? | un entier entre a et b, **bornes comprises** |

Ce dernier détail compte : avec `randint(1, 6)`, on peut obtenir 6. Ce n'est pas le cas de `range(1, 6)`, qui s'arrête à 5. Seule la documentation permet de le savoir sans deviner.

:::methode[Utiliser une fonction inconnue]
1. Lire sa documentation : rôle, paramètres, valeur renvoyée.
2. L'essayer sur un exemple simple, dont on connaît le résultat.
3. Seulement ensuite, l'utiliser dans son programme.
:::

On n'a pas besoin de connaître le **code** d'une fonction de bibliothèque pour l'utiliser : la documentation suffit.

## L'essentiel

- `import module`, puis `module.fonction()` ; ou `from module import fonction`, puis `fonction()`.
- La documentation donne le rôle, les paramètres et la valeur renvoyée : on la lit avec `help(fonction)`.
- On s'appuie sur la documentation, sans lire le code de la fonction.

## Exercices

::::exercice[Lire une documentation]{niveau=1 type=reponses}
Voici un extrait de documentation.

> `round(x, n)` : renvoie `x` arrondi à `n` chiffres après la virgule. Si `n` est omis, renvoie l'entier le plus proche.

1. Combien de paramètres cette fonction peut-elle recevoir au plus ?

   - 2

1. Que renvoie `round(3.14159, 2)` ?

   ```python calcul
   print(round(3.14159, 2))
   ```

   - 3.14
   - 3,14

1. Que renvoie `round(7.8)` ?

   ```python calcul
   print(round(7.8))
   ```

   - 8
::::

::::exercice[Écrire les bons imports]{niveau=1 type=completer}
Complète ces programmes.

```python trous
import [[math]]
print(math.sqrt(25))

from random [[import]] randint
de = randint(1, 6)
```
::::

::::exercice[Hypoténuse]{niveau=2}
Écris `hypotenuse(a, b)` qui renvoie la longueur de l'hypoténuse d'un triangle rectangle de côtés `a` et `b`, en utilisant `math.sqrt`.

```python depart
import math

def hypotenuse(a, b):
    ...
```

```python tests
assert hypotenuse(3, 4) == 5, "triangle 3-4-5"
assert hypotenuse(6, 8) == 10, "triangle 6-8-10"
```

:::corrige
```python solution
import math

def hypotenuse(a, b):
    return math.sqrt(a ** 2 + b ** 2)
```
:::
::::

::::exercice[Lancer des dés]{niveau=2}
Écris `somme_des(n)` qui simule le lancer de `n` dés à six faces avec `randint` et renvoie la somme obtenue.

```python depart
from random import randint

def somme_des(n):
    ...
```

```python tests
assert somme_des(0) == 0, "aucun dé"
assert all(1 <= somme_des(1) <= 6 for _ in range(100)), "un dé"
assert all(3 <= somme_des(3) <= 18 for _ in range(100)), "trois dés"
```

:::corrige
```python solution
from random import randint

def somme_des(n):
    s = 0
    for i in range(n):
        s = s + randint(1, 6)
    return s
```
:::
::::

::::exercice[Organiser une sortie]{niveau=3}
Voici un extrait de documentation :

> `math.ceil(x)` : renvoie le plus petit entier supérieur ou égal à `x`.
>
> `random.sample(population, k)` : renvoie une liste de `k` éléments distincts de `population`, choisis au hasard.

1. Écris `nb_bus(eleves, places)`, qui renvoie le nombre de bus nécessaires.
2. Écris `tirage(noms, n)`, qui renvoie `n` noms distincts choisis au hasard. Si `n` dépasse le nombre de noms, elle renvoie tous les noms.
3. À l'écrit : quels renseignements as-tu utilisés dans la documentation ? As-tu eu besoin de lire le code de ces fonctions ?

```python depart
import math
import random

def nb_bus(eleves, places):
    ...

def tirage(noms, n):
    ...
```

```python tests
assert nb_bus(100, 50) == 2, "compte juste"
assert nb_bus(101, 50) == 3, "un bus de plus"
assert nb_bus(0, 50) == 0, "aucun élève"
noms = ["a", "b", "c", "d"]
t = tirage(noms, 2)
assert len(t) == 2 and t[0] != t[1], "deux noms distincts"
assert t[0] in noms and t[1] in noms, "noms de la liste"
assert sorted(tirage(noms, 10)) == noms, "n trop grand"
```

:::corrige
```python solution
import math
import random

def nb_bus(eleves, places):
    return math.ceil(eleves / places)

def tirage(noms, n):
    if n > len(noms):
        return noms
    return random.sample(noms, n)
```

**Question 3.** Le rôle de chaque fonction, ses paramètres et la valeur qu'elle renvoie. Le code n'est pas nécessaire : c'est l'intérêt d'une bibliothèque documentée.
:::
::::
