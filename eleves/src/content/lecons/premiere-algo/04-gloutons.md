---
titre: Les algorithmes gloutons
resume: "Faire à chaque étape le meilleur choix immédiat : rendu de monnaie et sac à dos."
duree: 35
objectifs:
  - "Résoudre un problème par un algorithme glouton"
  - "Montrer qu'un glouton n'est pas toujours optimal"
prerequis: [premiere-algo/tris]
---

Un algorithme **glouton** construit sa solution étape par étape, en prenant à chaque fois **le meilleur choix immédiat**, sans revenir en arrière.

## 1. Le rendu de monnaie

On veut rendre une somme avec le moins de pièces possible. Le glouton rend à chaque fois la **plus grande pièce** possible.

```python exec
def rendu(somme, pieces):
    resultat = []
    for p in pieces:
        while somme >= p:
            resultat.append(p)
            somme = somme - p
    return resultat

print(rendu(87, [50, 20, 10, 5, 2, 1]))
print(rendu(6, [4, 3, 1]))
```

Avec les euros, le glouton est optimal. Mais avec des pièces de 4, 3 et 1, il rend 4 + 1 + 1 pour 6, alors que 3 + 3 suffit.

## 2. Le sac à dos

On choisit des objets pour **maximiser la valeur**, sans dépasser une masse maximale. On prend les objets par **rapport valeur / masse** décroissant, tant qu'ils rentrent.

Cette méthode est rapide, mais elle ne donne **pas toujours** la meilleure solution.

## L'essentiel

- Glouton : le meilleur choix immédiat, sans retour en arrière.
- Rendu de monnaie : la plus grande pièce possible.
- Sac à dos : le meilleur rapport valeur / masse.
- Un glouton est rapide, mais pas toujours optimal.

## Exercices

::::exercice[QCM : algorithmes gloutons]{niveau=1 type=quiz}
Une question à la fois : la correction s'affiche aussitôt.

1. Qu'est-ce qui caractérise un algorithme glouton ?

   - [ ] il essaie toutes les solutions
   - [x] il fait à chaque étape le meilleur choix immédiat, sans revenir en arrière
   - [ ] il est toujours optimal
   - [ ] il utilise la récursivité

   > Choix localement optimal, jamais remis en cause.

1. Quelles pièces le glouton rend-il pour 38 € avec le système euro ?

   - [ ] 10 + 10 + 10 + 5 + 2 + 1
   - [x] 20 + 10 + 5 + 2 + 1
   - [ ] 20 + 10 + 2 + 2 + 2 + 2
   - [ ] 20 + 5 + 5 + 5 + 2 + 1

   > Toujours la plus grande valeur possible.

1. Avec des pièces de 1, 3 et 4, combien de pièces le glouton rend-il pour 6 ?

   - [ ] 2
   - [x] 3
   - [ ] 4
   - [ ] 6

   > 4 + 1 + 1, alors que 3 + 3 suffit.

1. Le glouton du rendu de monnaie est-il optimal pour l'euro ?

   - [x] oui
   - [ ] non
   - [ ] seulement pour les sommes paires
   - [ ] seulement sous 100 €

   > Le système euro est dit canonique.

1. Dans le rendu de monnaie glouton, pourquoi utiliser `while somme >= p` plutôt que `if` ?

   - [ ] c'est plus rapide
   - [x] pour pouvoir rendre plusieurs fois la même pièce
   - [ ] pour éviter une erreur
   - [ ] c'est équivalent

   > Pour 40 €, on rend deux billets de 20.

1. Pour le sac à dos, quel critère glouton est en général le plus efficace ?

   - [ ] les objets les plus lourds d'abord
   - [ ] les objets les plus légers d'abord
   - [x] le meilleur rapport valeur/masse d'abord
   - [ ] l'ordre alphabétique

   > Il privilégie la valeur par kilo.

1. Combien de sous-ensembles faut-il examiner pour résoudre exactement le sac à dos par recherche exhaustive avec 20 objets ?

   - [ ] 20
   - [ ] 400
   - [x] environ un million (2²⁰)
   - [ ] 20 × 19

   > Chaque objet est pris ou non : 2 × 2 × … × 2.

1. Quel est le principal avantage d'un algorithme glouton ?

   - [x] il est simple et rapide
   - [ ] il donne toujours la meilleure solution
   - [ ] il n'a pas besoin de données
   - [ ] il revient sur ses choix

   > La rapidité se paie parfois par une solution non optimale.

1. Un glouton donne la bonne réponse sur 10 exemples. On peut conclure :

   - [ ] qu'il est optimal
   - [x] rien de définitif : il faut une preuve ou chercher un contre-exemple
   - [ ] qu'il est faux
   - [ ] qu'il est rapide

   > Un seul contre-exemple suffit à montrer qu'un glouton n'est pas optimal.
::::

::::exercice[Rendre la monnaie]{niveau=1 type=reponses}
On dispose de pièces de 50, 20, 10, 5, 2 et 1. Donne le nombre de pièces rendues par l'algorithme glouton.

1. Pour 38.

   ```python calcul
   s, n = 38, 0
   for p in [50, 20, 10, 5, 2, 1]:
       n += s // p
       s %= p
   print(n)
   ```

   - 5

1. Pour 99.

   ```python calcul
   s, n = 99, 0
   for p in [50, 20, 10, 5, 2, 1]:
       n += s // p
       s %= p
   print(n)
   ```

   - 6

1. Pour 40.

   ```python calcul
   s, n = 40, 0
   for p in [50, 20, 10, 5, 2, 1]:
       n += s // p
       s %= p
   print(n)
   ```

   - 2
::::

::::exercice[Le sac à dos à la main]{niveau=2 type=completer}
Le sac supporte 10 kg. Complète les rapports, puis le choix du glouton.

```python calcul
print(25 // 5)
print(16 // 4)
print(9 // 3)
print("B")
print("C")
print(5 + 4)
print(25 + 16)
```

| Objet | Masse | Valeur | Valeur / masse |
| --- | --- | --- | --- |
| A | 6 | 18 | 3 |
| B | 5 | 25 | [[5]] |
| C | 4 | 16 | [[4]] |
| D | 3 | 9 | [[3]] |

Le glouton choisit d'abord l'objet [[B]], puis l'objet [[C]].

Masse totale : [[9]] kg.

Valeur totale : [[41]].

:::corrige
On classe par rapport décroissant : B (5), C (4), puis A et D (3). B (5 kg) et C (4 kg) rentrent, soit 9 kg. Il reste 1 kg : ni A ni D ne rentrent. Valeur : 25 + 16 = 41.
:::
::::

::::exercice[Rendu de monnaie]{niveau=1}
Écris `rendu(somme, pieces)` qui renvoie la liste des pièces rendues par l'algorithme glouton. Les valeurs de `pieces` ne sont **pas
forcément triées** : trie-les d'abord par ordre décroissant. On suppose qu'il existe une pièce de 1.

```python depart
def rendu(somme, pieces):
    ...
```

```python tests
assert rendu(87, [1, 2, 5, 10, 20, 50, 100, 200]) == [50, 20, 10, 5, 2], "euros"
assert rendu(0, [1, 2, 5]) == [], "rien à rendre"
assert rendu(6, [1, 3, 4]) == [4, 1, 1], "système non canonique"
assert rendu(40, [20, 10, 1]) == [20, 20], "même pièce deux fois"
```

:::corrige
```python solution
def rendu(somme, pieces):
    resultat = []
    for p in sorted(pieces, reverse=True):
        while somme >= p:
            resultat.append(p)
            somme = somme - p
    return resultat
```

Le troisième test montre la limite : 3 pièces alors que 3 + 3 en demande 2. L'algorithme est correct (il rend la bonne somme) mais pas
optimal pour ce système.
:::
::::

::::exercice[Sac à dos glouton]{niveau=2}
Écris `sac(objets, masse_max)` où `objets` est une liste de dictionnaires `{"nom": ..., "masse": ..., "valeur": ...}`. La fonction renvoie le
couple `(noms_choisis, valeur_totale)` obtenu par le glouton « meilleur rapport valeur/masse d'abord » ; un objet qui ne rentre pas est sauté,
on continue avec les suivants.

```python depart
def sac(objets, masse_max):
    ...
```

```python tests
objets = [
    {"nom": "A", "masse": 12, "valeur": 40},
    {"nom": "B", "masse": 2, "valeur": 10},
    {"nom": "C", "masse": 4, "valeur": 18},
    {"nom": "D", "masse": 6, "valeur": 24},
    {"nom": "E", "masse": 1, "valeur": 3},
]
assert sac(objets, 15) == (["B", "C", "D", "E"], 55), "capacité 15"
assert sac(objets, 0) == ([], 0), "sac vide"
piege = [{"nom": "X", "masse": 7, "valeur": 15}, {"nom": "Y", "masse": 6, "valeur": 12}, {"nom": "Z", "masse": 6, "valeur": 12}]
assert sac(piege, 12) == (["X"], 15), "glouton non optimal (Y + Z vaut 24)"
```

:::corrige
```python solution
def rapport(objet):
    return objet["valeur"] / objet["masse"]

def sac(objets, masse_max):
    noms = []
    masse = 0
    valeur = 0
    for o in sorted(objets, key=rapport, reverse=True):
        if masse + o["masse"] <= masse_max:
            noms.append(o["nom"])
            masse = masse + o["masse"]
            valeur = valeur + o["valeur"]
    return (noms, valeur)
```

Le dernier test est le contre-exemple du cours : X a le meilleur rapport, mais le prendre empêche de prendre Y et Z.
:::
::::
