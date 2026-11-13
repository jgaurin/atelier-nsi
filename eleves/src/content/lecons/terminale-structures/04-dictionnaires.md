---
titre: Dictionnaires, index et clés
resume: "Pourquoi chercher dans un dictionnaire est beaucoup plus rapide que chercher dans une liste."
duree: 25
objectifs:
  - "Distinguer la recherche d'une valeur dans une liste et dans un dictionnaire"
  - "Choisir entre liste et dictionnaire"
prerequis: [terminale-structures/lineaires]
---

Dans un tableau, on retrouve une valeur par sa **position**. Dans un dictionnaire, on la retrouve par une **clé** : un nom, un mot, un numéro. Sa grande force est de retrouver une valeur **sans parcourir** toutes les autres.

## 1. Chercher dans un tableau

Pour savoir si « Zoé » est dans un tableau de 1 000 noms, Python compare « Zoé » au premier nom, puis au deuxième, et ainsi de suite. Dans le pire cas, il fait 1 000 comparaisons. Le coût est **linéaire** : deux fois plus de noms, deux fois plus de temps.

## 2. Chercher dans un dictionnaire

Un dictionnaire ne range pas ses clés au hasard. À partir de la clé elle-même, il **calcule** directement l'emplacement où la ranger. Pour la retrouver, il refait le même calcul et va directement au bon endroit, comme si chaque nom avait son casier numéroté.

Chercher une clé prend donc un temps **à peu près constant**, que le dictionnaire contienne 10 ou 1 million de clés.

```python exec
import time

n = 200000
tableau = list(range(n))
dico = {i: True for i in range(n)}

debut = time.perf_counter()
for _ in range(100):
    (n - 1) in tableau
milieu = time.perf_counter()
for _ in range(100):
    (n - 1) in dico
fin = time.perf_counter()

print("le tableau est plus lent :", milieu - debut > fin - milieu)
```

Deux conséquences importantes :

- Seules les **clés** profitent de cette vitesse. Chercher une **valeur** dans un dictionnaire oblige à tout parcourir.
- Une clé doit être **non modifiable** : nombre, chaîne ou p-uplet. Si une clé changeait, son emplacement calculé ne serait plus le bon, et le dictionnaire ne la retrouverait plus. C'est pourquoi une liste ne peut pas être une clé.

## 3. Choisir entre tableau et dictionnaire

| Besoin | Structure | Pourquoi |
| --- | --- | --- |
| lire la 3e mesure d'une série | tableau | accès direct par la position |
| garder les éléments dans un ordre précis | tableau | l'ordre des cases a un sens |
| retrouver un numéro de téléphone à partir d'un nom | dictionnaire | accès direct par la clé |
| tester très souvent si un élément est présent | dictionnaire | test immédiat au lieu d'un parcours |

## 4. Un index

Un **index** est un dictionnaire qui associe à chaque mot les endroits où il apparaît, comme l'index à la fin d'un livre :

```python
index = {"pile": [12, 40], "file": [13], "arbre": [55, 56]}
```

Pour trouver les pages qui parlent de piles, on lit directement `index["pile"]`, sans relire tout le livre. Les moteurs de recherche et les bases de données utilisent ce principe.

## L'essentiel

- Tableau : recherche d'une valeur au coût linéaire.
- Dictionnaire : recherche d'une **clé** à peu près immédiate, car l'emplacement est calculé à partir de la clé.
- Chercher une **valeur** dans un dictionnaire reste linéaire.
- Une clé doit être non modifiable : nombre, chaîne, p-uplet.

## Exercices

::::exercice[Liste ou dictionnaire ?]{niveau=1 type=associer}
Quelle structure choisir ?

| Besoin | Structure |
| --- | --- |
| Retrouver le numéro de téléphone d'un élève à partir de son nom | dictionnaire |
| Conserver les températures de chaque jour dans l'ordre | liste |
| Compter le nombre d'occurrences de chaque mot d'un texte | dictionnaire |
| Lire la 3e valeur d'une série de mesures | liste |
::::

::::exercice[Combien de comparaisons ?]{niveau=1 type=reponses}
Une liste contient 1 000 000 de noms distincts.

1. Au pire, combien de noms faut-il examiner pour une recherche séquentielle ?

   - 1000000
   - 1 000 000

1. Si la liste est triée, combien de comparaisons environ faut-il pour une dichotomie ?

   - 20

   > 2²⁰ ≈ 1 000 000.

1. Le coût d'une recherche dans un dictionnaire dépend-il beaucoup de sa taille ? Réponds par oui ou par non.

   - non
::::

::::exercice[Éviter les doublons]{niveau=2}
Écris `sans_doublons(t)` qui renvoie les éléments de `t`, sans répétition, dans l'ordre de leur première apparition. Utilise un dictionnaire pour mémoriser les éléments déjà vus.

```python depart
def sans_doublons(t):
    ...
```

```python tests
assert sans_doublons([3, 1, 3, 2, 1]) == [3, 1, 2], "doublons"
assert sans_doublons([]) == [], "vide"
assert sans_doublons(["a", "a"]) == ["a"], "chaînes"
```

:::corrige
```python solution
def sans_doublons(t):
    vus = {}
    resultat = []
    for x in t:
        if x not in vus:
            vus[x] = True
            resultat.append(x)
    return resultat
```

Tester `x not in vus` est immédiat, alors que `x not in resultat` obligerait à parcourir le tableau à chaque tour.
:::
::::

::::exercice[L'index d'un livre]{niveau=3}
Un livre est un tableau de pages, et chaque page un tableau de mots. La première page porte le numéro 1.

1. Écris `indexer(pages)`, qui renvoie un dictionnaire associant à chaque mot la liste croissante des numéros de pages où il apparaît, sans répétition.
2. Écris `pages_communes(index, m1, m2)`, qui renvoie la liste croissante des pages contenant les deux mots. Si un mot n'est pas dans l'index, elle renvoie `[]`.
3. À l'écrit : un collègue range l'index dans un tableau de couples `(mot, pages)`. Pourquoi est-ce moins adapté si l'on fait beaucoup de recherches ?

```python depart
def indexer(pages):
    ...

def pages_communes(index, m1, m2):
    ...
```

```python tests
livre = [["pile", "file", "pile"], ["file"], ["arbre", "pile"]]
i = indexer(livre)
assert i == {"pile": [1, 3], "file": [1, 2], "arbre": [3]}, "index"
assert indexer([]) == {}, "livre vide"
assert pages_communes(i, "pile", "file") == [1], "page commune"
assert pages_communes(i, "arbre", "file") == [], "aucune page commune"
assert pages_communes(i, "graphe", "file") == [], "mot absent"
```

:::corrige
```python solution
def indexer(pages):
    index = {}
    for i in range(len(pages)):
        numero = i + 1
        for mot in pages[i]:
            if mot not in index:
                index[mot] = []
            if numero not in index[mot]:
                index[mot].append(numero)
    return index

def pages_communes(index, m1, m2):
    if m1 not in index or m2 not in index:
        return []
    return [p for p in index[m1] if p in index[m2]]
```

**Question 3.** Dans un tableau de couples, il faut parcourir les entrées jusqu'au bon mot : chaque recherche a un coût linéaire. Avec un dictionnaire dont les clés sont les mots, l'accès est à peu près immédiat.
:::
::::
