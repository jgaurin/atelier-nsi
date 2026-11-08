---
titre: Utiliser une bibliothèque
resume: "Importer un module et trouver dans sa documentation comment l'utiliser."
duree: 25
objectifs:
  - "Importer un module"
  - "Utiliser la documentation d'une bibliothèque"
prerequis: [premiere-langages/constructions]
---

Inutile de tout réécrire : Python fournit des **bibliothèques** de fonctions prêtes à l'emploi.

## 1. Importer

```python exec
import math
from random import randint

print(math.sqrt(16), math.floor(2.7))
print(1 <= randint(1, 6) <= 6)
```

- `import math` : on écrit ensuite `math.sqrt(16)`.
- `from random import randint` : on écrit directement `randint(1, 6)`.

## 2. Lire une documentation

Pour savoir ce que fait une fonction, on utilise `help(math.sqrt)` ou la documentation en ligne. On y cherche :

- ce que fait la fonction ;
- ses **paramètres** ;
- ce qu'elle **renvoie**.

## L'essentiel

- `import module` puis `module.fonction()`, ou `from module import fonction`.
- `help(fonction)` affiche la documentation.
- Dans une documentation, on cherche le rôle, les paramètres et la valeur renvoyée.

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

::::exercice[Hypoténuse]{niveau=1}
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
