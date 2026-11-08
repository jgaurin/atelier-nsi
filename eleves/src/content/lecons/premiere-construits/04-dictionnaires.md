---
titre: Les dictionnaires
resume: "Associer des clés à des valeurs, ajouter une entrée, parcourir un dictionnaire."
duree: 40
objectifs:
  - "Construire une entrée de dictionnaire"
  - "Parcourir un dictionnaire avec `keys()`, `values()` et `items()`"
  - "Compter des occurrences avec un dictionnaire"
prerequis: [premiere-construits/tableaux]
---

Dans un tableau, on retrouve une valeur par sa position. Dans un **dictionnaire**, on la retrouve par une **clé** : un nom, un mot, un identifiant.

## 1. Créer et lire

```python exec
ages = {"Léa": 15, "Tom": 16}
print(ages["Tom"], len(ages))
```

Une clé absente provoque une `KeyError`. On teste d'abord avec `in` :

```python exec
ages = {"Léa": 15, "Tom": 16}
print("Zoé" in ages)
```

`in` teste les **clés**, pas les valeurs.

## 2. Ajouter ou modifier

La même instruction ajoute une entrée, ou la remplace si la clé existe :

```python exec
stock = {"pommes": 12}
stock["kiwis"] = 8
stock["pommes"] = 10
print(stock)
```

## 3. Parcourir

```python exec
notes = {"maths": 14, "NSI": 17}

for matiere in notes.keys():
    print(matiere)

for n in notes.values():
    print(n)

for matiere, n in notes.items():
    print(matiere, n)
```

`for k in d` parcourt aussi les clés.

## 4. Compter des occurrences

```python exec
compte = {}
for lettre in "abracadabra":
    if lettre in compte:
        compte[lettre] = compte[lettre] + 1
    else:
        compte[lettre] = 1
print(compte)
```

:::exemple
Les données **EXIF** d'une photo forment un enregistrement : `{"largeur": 4032, "hauteur": 3024, "flash": False}`.
:::

## L'essentiel

- `d[cle]` lit, `d[cle] = v` ajoute ou modifie, `cle in d` teste la présence d'une clé.
- `keys()` donne les clés, `values()` les valeurs, `items()` les couples.
- Schéma de comptage : si la clé existe, on ajoute 1, sinon on la crée à 1.

## Exercices

::::exercice[QCM : les dictionnaires]{niveau=1 type=quiz}
Une question à la fois : la correction s'affiche aussitôt.

1. Avec `d = {"a": 3, "b": 7}`, que vaut `d["b"]` ?

   - [ ] `"b"`
   - [x] 7
   - [ ] 3
   - [ ] 1

   > On accède à la valeur par sa clé.

1. Que contient `d` après `d = {"a": 3}` puis `d["b"] = 5` ?

   - [ ] une erreur, la clé n'existe pas
   - [x] `{"a": 3, "b": 5}`
   - [ ] `{"b": 5}`
   - [ ] `{"a": 5}`

   > L'affectation crée l'entrée si la clé est nouvelle.

1. Que provoque `d["z"]` si `"z"` n'est pas une clé de `d` ?

   - [ ] `None`
   - [ ] 0
   - [x] une `KeyError`
   - [ ] une chaîne vide

   > Il faut tester `"z" in d` avant.

1. Avec `d = {"x": 10, "y": 20}`, que vaut `10 in d` ?

   - [ ] `True`
   - [x] `False`
   - [ ] 10
   - [ ] une erreur

   > `in` teste les clés : `"x"` et `"y"`, pas les valeurs.

1. Quelle méthode donne les couples (clé, valeur) ?

   - [ ] `keys()`
   - [ ] `values()`
   - [x] `items()`
   - [ ] `pairs()`

   > `for k, v in d.items()`.
::::

::::exercice[Compléter un comptage]{niveau=1 type=completer}
Cette fonction compte les occurrences de chaque élément d'un tableau. Complète-la.

```python trous
def occurrences(t):
    compte = {}
    for x in t:
        if x [[in]] compte:
            compte[x] = [[compte[x] + 1;1 + compte[x]]]
        else:
            compte[[[x]]] = [[1]]
    return compte
```
::::

::::exercice[Parcourir un dictionnaire]{niveau=1 type=completer}
On a `notes = {"maths": 14, "NSI": 17}`. Complète chaque parcours avec `keys`, `values` ou `items`.

```python trous
for matiere in notes.[[keys]]():
    print(matiere)

for n in notes.[[values]]():
    print(n)

for matiere, n in notes.[[items]]():
    print(matiere, n)
```
::::

::::exercice[Compter les mots]{niveau=2}
Écris `compter_mots(phrase)` qui renvoie un dictionnaire associant à chaque mot de la phrase son nombre d'occurrences. Les mots sont séparés par
des espaces : `phrase.split()` donne le tableau des mots.

```python depart
def compter_mots(phrase):
    ...
```

```python tests
assert compter_mots("le chat et le chien") == {"le": 2, "chat": 1, "et": 1, "chien": 1}, "phrase simple"
assert compter_mots("oui oui oui") == {"oui": 3}, "un seul mot répété"
assert compter_mots("") == {}, "phrase vide"
```

:::corrige
```python solution
def compter_mots(phrase):
    compte = {}
    for mot in phrase.split():
        if mot in compte:
            compte[mot] = compte[mot] + 1
        else:
            compte[mot] = 1
    return compte
```

C'est exactement le schéma de comptage du cours, appliqué aux mots au lieu des lettres.
:::
::::

::::exercice[Le mot le plus fréquent]{niveau=2}
Écris `plus_frequent(compte)` qui reçoit un dictionnaire non vide de comptages (comme celui de l'exercice précédent) et renvoie la clé ayant la
plus grande valeur. En cas d'égalité, renvoie n'importe laquelle des clés à égalité.

```python depart
def plus_frequent(compte):
    ...
```

```python tests
assert plus_frequent({"le": 2, "chat": 1, "et": 1}) == "le", "le gagne"
assert plus_frequent({"a": 1}) == "a", "une seule clé"
assert plus_frequent({"x": 3, "y": 7, "z": 5}) == "y", "y gagne"
```

:::corrige
```python solution
def plus_frequent(compte):
    meilleur = None
    for cle, valeur in compte.items():
        if meilleur is None or valeur > compte[meilleur]:
            meilleur = cle
    return meilleur
```

On retient la **clé** du meilleur, pas sa valeur : on peut toujours retrouver la valeur avec `compte[meilleur]`.
:::
::::

::::exercice[Les ventes d'une boulangerie]{niveau=3}
Une boulangerie enregistre ses ventes dans un tableau de couples `(produit, quantite)`. Le dictionnaire `prix` associe à chaque produit son prix en euros.

1. Écris `quantites(ventes)`, qui renvoie un dictionnaire associant à chaque produit la quantité totale vendue.
2. Écris `recette(ventes, prix)`, qui renvoie le montant total des ventes.
3. Écris `meilleur_produit(ventes, prix)`, qui renvoie le produit ayant rapporté le plus d'argent, ou `None` s'il n'y a aucune vente.
4. À l'écrit : pour afficher chaque produit avec son prix, quelle méthode de dictionnaire utiliser ? Écris la boucle.

```python depart
def quantites(ventes):
    ...

def recette(ventes, prix):
    ...

def meilleur_produit(ventes, prix):
    ...
```

```python tests
p = {"pain": 1, "tarte": 15, "cookie": 2}
v = [("pain", 10), ("tarte", 1), ("pain", 5), ("cookie", 4)]
assert quantites(v) == {"pain": 15, "tarte": 1, "cookie": 4}, "quantités"
assert quantites([]) == {}, "aucune vente"
assert recette(v, p) == 38, "recette"
assert meilleur_produit(v, p) in ("pain", "tarte"), "égalité possible"
assert meilleur_produit([("cookie", 1), ("pain", 1)], p) == "cookie", "le meilleur"
assert meilleur_produit([], p) is None, "aucune vente"
```

:::corrige
```python solution
def quantites(ventes):
    q = {}
    for produit, n in ventes:
        if produit in q:
            q[produit] = q[produit] + n
        else:
            q[produit] = n
    return q

def recette(ventes, prix):
    total = 0
    for produit, n in ventes:
        total = total + n * prix[produit]
    return total

def meilleur_produit(ventes, prix):
    meilleur = None
    maxi = 0
    q = quantites(ventes)
    for produit, n in q.items():
        montant = n * prix[produit]
        if meilleur is None or montant > maxi:
            meilleur = produit
            maxi = montant
    return meilleur
```

**Question 4.** La méthode `items()` : `for produit, valeur in prix.items(): print(produit, valeur)`.
:::
::::
