---
titre: Contrôle du chapitre
resume: "Un contrôle de 55 minutes noté sur 20 sur les algorithmes de première."
duree: 55
controle: true
objectifs:
  - "Dérouler et écrire les algorithmes du programme"
  - "Raisonner sur le coût, l'invariant et le variant"
prerequis: [premiere-algo/knn]
---

## Consignes

Durée : **55 minutes**. Le contrôle est noté sur **20 points**.

## Exercices

::::exercice[Questions de cours]{niveau=3 type=reponses points=5}
Chaque question vaut 1 point.

1. Quel est le coût d'une recherche séquentielle : linéaire, quadratique ou logarithmique ?

   - linéaire

1. Quel est le coût du tri par sélection dans le pire cas ?

   - quadratique

1. Quelle condition doit vérifier un tableau pour une recherche dichotomique ?

   - trié
   - il doit être trié

1. Comment appelle-t-on une quantité entière qui décroît strictement et prouve qu'une boucle s'arrête ?

   - variant
   - un variant

1. Avec deux classes, faut-il choisir k pair ou impair ?

   - impair
::::

::::exercice[Dérouler un tri]{niveau=3 type=completer points=4}
Tri par insertion de `[6, 1, 5, 2]`. Chaque ligne vaut 1 point, sauf la dernière réponse, sur 1 point aussi.

```python calcul
t = [6, 1, 5, 2]
for i in range(1, len(t)):
    v = t[i]
    j = i
    while j > 0 and t[j - 1] > v:
        t[j] = t[j - 1]
        j -= 1
    t[j] = v
    print(" ".join(map(str, t)))
print("quadratique")
```

| Tour | Tableau |
| --- | --- |
| 1 | [[1 6 5 2]] |
| 2 | [[1 5 6 2]] |
| 3 | [[1 2 5 6]] |

Le coût de ce tri dans le pire cas est [[quadratique]].
::::

::::exercice[Monnaie]{niveau=3 type=reponses points=3}
Chaque question vaut 1 point.

1. Quelles pièces le glouton rend-il pour 6 avec des pièces de 4, 3 et 1 ? Écris-les séparées par des virgules, de la plus grande à la plus petite.

   ```python calcul
   s = 6
   r = []
   for p in [4, 3, 1]:
       while s >= p:
           r.append(p)
           s -= p
   print(", ".join(map(str, r)))
   ```

   - 4, 1, 1
   - 4,1,1

1. Combien de pièces suffisent en réalité pour rendre 6 avec ces pièces ?

   - 2

1. Le glouton donne-t-il toujours la solution optimale ? Réponds par oui ou par non.

   - non
::::

::::exercice[Écrire une recherche]{niveau=3 points=4}
Écris `compte_superieurs_moyenne(t)` qui renvoie le nombre d'éléments d'un tableau non vide strictement supérieurs à sa moyenne.

```python depart
def compte_superieurs_moyenne(t):
    ...
```

```python tests
assert compte_superieurs_moyenne([1, 2, 3, 6]) == 1, "un seul"
assert compte_superieurs_moyenne([5, 5]) == 0, "tous égaux"
assert compte_superieurs_moyenne([0, 10, 10]) == 2, "deux"
```

:::corrige
```python solution
def compte_superieurs_moyenne(t):
    s = 0
    for x in t:
        s = s + x
    m = s / len(t)
    n = 0
    for x in t:
        if x > m:
            n = n + 1
    return n
```
:::
::::

::::exercice[Invariant]{niveau=3 points=4}
On considère la fonction `maximum` du cours.

```python
def maximum(t):
    m = t[0]
    for x in t:
        if x > m:
            m = x
    return m
```

1. Énonce un invariant de boucle.
2. Explique pourquoi il prouve que la fonction renvoie le maximum.

:::criteres
- 2 points : l'invariant dit que `m` est le maximum des éléments déjà examinés.
- 2 points : à la fin, tous les éléments ont été examinés, donc `m` est le maximum du tableau.
:::

:::corrige
Invariant : après chaque tour, `m` contient le maximum des éléments déjà examinés. C'est vrai au départ, puisque `m` vaut `t[0]`. À chaque tour, `m` est remplacé si le nouvel élément est plus grand, donc la propriété reste vraie. À la fin, tous les éléments ont été examinés : `m` est le maximum du tableau.
:::
::::
