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

1. Que contient `d` après `d = {"a": 3}` puis `d["a"] = 5` ?

   - [ ] `{"a": 3, "a": 5}`
   - [x] `{"a": 5}`
   - [ ] `{"a": 8}`
   - [ ] une erreur

   > Les clés sont uniques : la valeur est remplacée.

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

1. Que parcourt `for k in d:` ?

   - [x] les clés
   - [ ] les valeurs
   - [ ] les couples (clé, valeur)
   - [ ] les indices 0, 1, 2…

   > C'est équivalent à `for k in d.keys()`.

1. Quelle méthode donne les couples (clé, valeur) ?

   - [ ] `keys()`
   - [ ] `values()`
   - [x] `items()`
   - [ ] `pairs()`

   > `for k, v in d.items()`.

1. Que vaut `len({"a": 1, "b": 1, "c": 2})` ?

   - [ ] 2
   - [x] 3
   - [ ] 4
   - [ ] 6

   > Trois entrées ; que deux valeurs soient égales n'a pas d'importance.

1. Lequel ne peut **pas** être une clé de dictionnaire ?

   - [ ] `"NSI"`
   - [ ] `42`
   - [ ] `(3, 4)`
   - [x] `[3, 4]`

   > Un tableau est modifiable, il ne peut pas servir de clé.

1. Après le comptage des lettres de `"aba"` avec le schéma du cours, que vaut le dictionnaire ?

   - [ ] `{"a": 1, "b": 1}`
   - [x] `{"a": 2, "b": 1}`
   - [ ] `{"aba": 3}`
   - [ ] `[2, 1]`

   > 'a' apparaît deux fois et 'b' une fois.

1. Avec `d = {0: "zéro", 5: "cinq"}`, que vaut `d[0]` ?

   - [x] `"zéro"`
   - [ ] la première entrée, quelle qu'elle soit
   - [ ] une erreur
   - [ ] `"cinq"`

   > Ici 0 est une clé : `d[0]` cherche la clé 0, pas une position.

1. Pour représenter la fiche d'un livre (titre, auteur, année), on utilise de préférence :

   - [ ] un tableau `["titre", "auteur", 1887]`
   - [x] un dictionnaire `{"titre": ..., "auteur": ..., "annee": ...}`
   - [ ] trois variables séparées
   - [ ] une chaîne de caractères

   > Un enregistrement : chaque champ a un nom.
::::

::::exercice[Lire un programme]{niveau=1 type=reponses}
Donne ce que le programme affiche.

1. Que s'affiche-t-il ?

   ```python verifier
   d = {"a": 3, "b": 7}
   d["a"] = d["a"] + d["b"]
   print(d["a"])
   ```

   - 10

1. Que s'affiche-t-il ?

   ```python verifier
   d = {"x": 1, "y": 2, "z": 2}
   s = 0
   for v in d.values():
       s = s + v
   print(s)
   ```

   - 5

1. Que s'affiche-t-il ? Réponds `True` ou `False`.

   ```python verifier
   d = {"x": 1}
   print(1 in d)
   ```

   - False
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

::::exercice[Compter les mots]{niveau=1}
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

::::exercice[Traducteur mot à mot]{niveau=2}
Écris `traduire(phrase, dico)` qui traduit une phrase mot à mot avec un dictionnaire. Un mot absent du dictionnaire est gardé tel quel. Les mots
traduits sont recollés avec des espaces : `" ".join(tableau)` donne la chaîne.

```python depart
def traduire(phrase, dico):
    ...
```

```python tests
fr_en = {"le": "the", "chat": "cat", "noir": "black", "dort": "sleeps"}
assert traduire("le chat dort", fr_en) == "the cat sleeps", "tout est connu"
assert traduire("le chat de Léa", fr_en) == "the cat de Léa", "mots inconnus gardés"
assert traduire("", fr_en) == "", "phrase vide"
```

:::corrige
```python solution
def traduire(phrase, dico):
    resultat = []
    for mot in phrase.split():
        if mot in dico:
            resultat.append(dico[mot])
        else:
            resultat.append(mot)
    return " ".join(resultat)
```

Le test `if mot in dico` évite la `KeyError` sur les mots inconnus.
:::
::::
