---
titre: Dictionnaires, index et clés
resume: "Pourquoi chercher dans un dictionnaire est beaucoup plus rapide que chercher dans une liste."
duree: 25
objectifs:
  - "Distinguer la recherche d'une valeur dans une liste et dans un dictionnaire"
  - "Choisir entre liste et dictionnaire"
prerequis: [terminale-structures/lineaires]
---

Un dictionnaire associe des **clés** à des valeurs. Sa grande force : retrouver une valeur **sans parcourir** toutes les autres.

## 1. Chercher dans une liste

Pour savoir si un nom est dans une liste de n éléments, il faut les examiner un par un : le coût est **linéaire**.

## 2. Chercher dans un dictionnaire

Un dictionnaire calcule directement où ranger chaque clé. Chercher une clé prend donc un temps **à peu près constant**, quelle que soit la taille du dictionnaire.

Seules les **clés** profitent de cette vitesse : chercher une **valeur** oblige à tout parcourir.

Une clé doit être **non modifiable** : si elle changeait, le dictionnaire ne saurait plus où la retrouver.

```python exec
import time

n = 200000
liste = list(range(n))
dico = {i: True for i in range(n)}

debut = time.perf_counter()
for _ in range(100):
    (n - 1) in liste
milieu = time.perf_counter()
for _ in range(100):
    (n - 1) in dico
fin = time.perf_counter()

print("liste plus lente :", milieu - debut > fin - milieu)
```

## 3. Quand choisir quoi ?

| Besoin | Structure |
| --- | --- |
| accéder à un élément par sa **position** | liste |
| garder un **ordre** | liste |
| retrouver une valeur par une **clé** | dictionnaire |
| tester souvent si un élément est présent | dictionnaire |

## 4. Un index

Un **index** associe à chaque mot les endroits où il apparaît, comme à la fin d'un livre : `{"pile": [12, 40], "file": [13]}`. On trouve ainsi les pages d'un mot sans relire tout le livre.

## L'essentiel

- Dans une liste, la recherche d'une valeur a un coût linéaire.
- Dans un dictionnaire, la recherche d'une clé est à peu près immédiate.
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
