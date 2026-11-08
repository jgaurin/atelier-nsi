---
titre: Contrôle du chapitre
resume: "Un contrôle de 55 minutes noté sur 20 sur les p-uplets, les tableaux et les dictionnaires."
duree: 55
controle: true
objectifs:
  - "Lire un programme qui utilise des tableaux ou des dictionnaires"
  - "Compléter et écrire des fonctions simples"
prerequis: [premiere-construits/dictionnaires]
---

## Consignes

Durée : **55 minutes**. Le contrôle est noté sur **20 points**. Pas de documents.

## Exercices

::::exercice[Lire du code]{niveau=3 type=reponses points=6}
Chaque question vaut 1 point. Donne ce qui s'affiche.

1. Que s'affiche-t-il ?

   ```python verifier
   t = [5, 3, 8]
   print(t[len(t) - 1])
   ```

   - 8

1. Que s'affiche-t-il ?

   ```python verifier
   def f(a, b):
       return (b, a)

   print(f(1, 2))
   ```

   - (2, 1)

1. Que s'affiche-t-il ?

   ```python verifier
   print([x + 1 for x in [1, 2, 3] if x != 2])
   ```

   - [2, 4]

1. Que s'affiche-t-il ?

   ```python verifier
   m = [[1, 2, 3], [4, 5, 6]]
   print(m[1][0] + m[0][2])
   ```

   - 7

1. Que s'affiche-t-il ?

   ```python verifier
   d = {"a": 1}
   d["b"] = 2
   d["a"] = 3
   print(len(d))
   ```

   - 2

1. Que s'affiche-t-il ?

   ```python verifier
   t = [1, 2]
   u = t
   u.append(3)
   print(len(t))
   ```

   - 3
::::

::::exercice[Compléter des fonctions]{niveau=3 type=completer points=5}
Chaque case vaut 0,5 point.

La fonction `somme_diagonale` renvoie la somme de la diagonale d'une matrice carrée.

```python trous
def somme_diagonale(m):
    s = [[0]]
    for i in range([[len(m)]]):
        s = s + m[[[i]]][[[i]]]
    return s
```

La fonction `inverse` échange les clés et les valeurs d'un dictionnaire.

```python trous
def inverse(d):
    res = {}
    for cle, valeur in d.[[items()]]:
        res[[[valeur]]] = [[cle]]
    return [[res]]
```
::::

::::exercice[Écrire une fonction]{niveau=3 points=5}
Écris `nb_superieurs(t, seuil)` qui renvoie le nombre d'éléments de `t` strictement supérieurs à `seuil`.

```python depart
def nb_superieurs(t, seuil):
    ...
```

```python tests
assert nb_superieurs([1, 5, 8], 4) == 2, "cas général"
assert nb_superieurs([], 4) == 0, "tableau vide"
assert nb_superieurs([4, 4], 4) == 0, "égalité : pas compté"
```

:::corrige
```python solution
def nb_superieurs(t, seuil):
    n = 0
    for x in t:
        if x > seuil:
            n = n + 1
    return n
```
:::
::::

::::exercice[Dictionnaire d'inventaire]{niveau=3 points=4}
Un inventaire est un dictionnaire qui associe à chaque objet sa quantité. Écris `total(inventaire)` qui renvoie la quantité totale d'objets.

```python depart
def total(inventaire):
    ...
```

```python tests
assert total({"a": 2, "b": 5}) == 7, "deux objets"
assert total({}) == 0, "inventaire vide"
```

:::corrige
```python solution
def total(inventaire):
    s = 0
    for q in inventaire.values():
        s = s + q
    return s
```
:::
::::
