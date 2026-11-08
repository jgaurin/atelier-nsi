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

::::exercice[Combien de comparaisons ?]{niveau=2 type=reponses}
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

::::exercice[Annuaire]{niveau=2}
Une application doit retrouver très souvent le numéro d'un élève à partir de son nom. Un développeur a rangé les données dans un tableau de couples `(nom, numero)`. Explique le problème et propose une amélioration.

:::criteres
- La recherche dans le tableau a un coût linéaire.
- Un dictionnaire dont les clés sont les noms permet un accès à peu près immédiat.
:::

:::corrige
Pour trouver un numéro, il faut parcourir le tableau jusqu'au bon couple : le coût est linéaire et devient important si les recherches sont nombreuses. Un dictionnaire dont les clés sont les noms donne le numéro directement, en un temps à peu près constant.
:::
::::
