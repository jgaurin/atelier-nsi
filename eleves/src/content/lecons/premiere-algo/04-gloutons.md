---
titre: Les algorithmes gloutons
resume: "Faire à chaque étape le meilleur choix immédiat : rendu de monnaie et sac à dos."
duree: 35
objectifs:
  - "Résoudre un problème par un algorithme glouton"
  - "Montrer qu'un glouton n'est pas toujours optimal"
prerequis: [premiere-algo/tris]
---

Un algorithme **glouton** construit sa solution étape par étape. À chaque étape, il fait le choix qui paraît **le meilleur sur le moment**, et il ne revient **jamais** en arrière.

C'est rapide et simple, mais le meilleur choix immédiat ne mène pas toujours à la meilleure solution finale.

## 1. Le rendu de monnaie

### Le problème

Un commerçant doit rendre une somme avec **le moins de pièces possible**. Il dispose de pièces de 50, 20, 10, 5, 2 et 1.

### L'idée gloutonne

Rendre à chaque fois **la plus grande pièce possible**, tant qu'il reste quelque chose à rendre.

### À la main

On rend 87.

| Reste à rendre | Plus grande pièce possible | Reste ensuite |
| --- | --- | --- |
| 87 | 50 | 37 |
| 37 | 20 | 17 |
| 17 | 10 | 7 |
| 7 | 5 | 2 |
| 2 | 2 | 0 |

On rend 5 pièces : 50 + 20 + 10 + 5 + 2.

### Le code, ligne par ligne

```python exec
def rendu(somme, pieces):
    resultat = []
    for p in pieces:
        while somme >= p:
            resultat.append(p)
            somme = somme - p
    return resultat

print(rendu(87, [50, 20, 10, 5, 2, 1]))
print(rendu(40, [50, 20, 10, 5, 2, 1]))
```

- `for p in pieces` : on essaie les pièces dans l'ordre donné. Cet ordre doit aller de la **plus grande** à la plus petite.
- `while somme >= p` : on peut rendre **plusieurs fois** la même pièce, comme 20 + 20 pour 40. Avec un `if`, on la rendrait au plus une fois.
- À chaque pièce rendue, on l'ajoute au résultat et on diminue la somme.

### Quand le glouton se trompe

Avec des pièces de 4, 3 et 1, pour rendre 6 :

| Méthode | Pièces | Nombre de pièces |
| --- | --- | --- |
| Glouton | 4 + 1 + 1 | 3 |
| Meilleure solution | 3 + 3 | 2 |

Le glouton prend 4, la plus grande pièce, et ne remet jamais ce choix en cause. Avec les pièces en euros, en revanche, il donne toujours la meilleure solution.

## 2. Le sac à dos

### Le problème

On veut remplir un sac qui supporte une masse maximale, avec des objets qui ont chacun une masse et une valeur. Le but est d'obtenir la **plus grande valeur totale**.

### L'idée gloutonne

Prendre les objets par **rapport valeur / masse** décroissant, c'est-à-dire les plus « rentables » au kilo d'abord, tant qu'ils rentrent.

### À la main

Le sac supporte 10 kg.

| Objet | Masse | Valeur | Valeur / masse |
| --- | --- | --- | --- |
| A | 2 kg | 10 € | 5 |
| B | 5 kg | 20 € | 4 |
| C | 4 kg | 12 € | 3 |
| D | 3 kg | 6 € | 2 |

| Objet examiné | Rentre-t-il ? | Masse dans le sac | Valeur |
| --- | --- | --- | --- |
| A | oui | 2 kg | 10 € |
| B | oui | 7 kg | 30 € |
| C | non : 7 + 4 = 11 kg | 7 kg | 30 € |
| D | oui | 10 kg | 36 € |

Le glouton obtient 36 €.

### Quand le glouton se trompe

Sac de 6 kg. A : 5 kg et 11 €, soit un rapport de 2,2. B et C : 3 kg et 6 € chacun, soit un rapport de 2.

Le glouton prend A, puis plus rien ne rentre : il obtient 11 €. Pourtant, B et C ensemble rapportent 12 €.

## 3. Ce qu'il faut retenir sur les gloutons

- Ils sont **rapides** : un seul choix par étape, sans essayer toutes les possibilités.
- Ils ne sont **pas toujours optimaux**. Un seul contre-exemple suffit à le prouver.
- Réussir sur dix exemples ne prouve pas qu'un glouton est toujours optimal.

Trouver la meilleure solution exacte demande d'autres méthodes, que tu verras en terminale.

## L'essentiel

- Glouton : le meilleur choix immédiat, sans retour en arrière.
- Rendu de monnaie : la plus grande pièce possible, avec des pièces triées de la plus grande à la plus petite.
- Sac à dos : le meilleur rapport valeur / masse d'abord.
- Rapide, mais pas toujours optimal : un contre-exemple suffit à le montrer.

## Exercices

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

::::exercice[QCM : les pièges des gloutons]{niveau=2 type=quiz}
Le meilleur choix immédiat n'est pas toujours le meilleur choix tout court. La correction s'affiche aussitôt.

1. Combien de pièces le glouton rend-il pour 63, avec 50, 20, 10, 5, 2 et 1 ?

   - [ ] 3
   - [x] 4
   - [ ] 5
   - [ ] 6

   > 50 + 10 + 2 + 1. Il n'y a pas de pièce de 3.

1. Avec la fonction `rendu` du cours, sans tri préalable, combien de pièces obtient-on pour `rendu(6, [1, 3, 4])` ?

   - [ ] 2
   - [ ] 3
   - [x] 6
   - [ ] une erreur

   > La fonction suit l'ordre donné : elle rend d'abord six pièces de 1. Il faut lui donner les pièces de la plus grande à la plus petite.

1. Avec des pièces de 4, 3 et 1, pour rendre 6, le glouton est-il optimal ?

   - [ ] oui, il rend 2 pièces
   - [x] non, il en rend 3 alors que 2 suffisent
   - [ ] non, il ne trouve aucune solution
   - [ ] oui, car il commence par la plus grande

   > Il rend 4 + 1 + 1, alors que 3 + 3 suffit.

1. Dans `rendu`, on remplace `while somme >= p:` par `if somme >= p:`. Que devient `rendu(40, [20, 10, 5])` ?

   - [ ] `[20, 20]`
   - [x] `[20, 10, 5]`, et il reste 5 à rendre
   - [ ] `[20, 10, 10]`
   - [ ] une erreur

   > Avec `if`, chaque pièce est utilisée au plus une fois.

1. Quels objets choisir en premier ? A : 2 kg, 10 €. B : 5 kg, 20 €. C : 1 kg, 3 €.

   - [x] A, car son rapport valeur / masse est le plus élevé
   - [ ] B, car il vaut le plus cher
   - [ ] C, car il est le plus léger
   - [ ] peu importe

   > Les rapports valent 5, 4 et 3. Le plus cher n'est pas le plus rentable.

1. Sac de 10 kg. A : 6 kg, 12 €. B : 5 kg, 9 €. C : 5 kg, 9 €. Que rapporte le glouton selon le rapport valeur / masse ?

   - [x] 12 €
   - [ ] 18 €
   - [ ] 21 €
   - [ ] 30 €

   > Il prend A, de rapport 2, puis il reste 4 kg : plus rien ne rentre. Pourtant, B et C rapporteraient 18 €.

1. Un programme essaie toutes les combinaisons d'objets et garde la meilleure. Est-il glouton ?

   - [ ] oui, car il cherche le maximum
   - [x] non, car un glouton fait un seul choix à chaque étape, sans revenir en arrière
   - [ ] oui, car il utilise un sac à dos
   - [ ] non, car il est plus rapide

   > C'est une recherche exhaustive : elle donne l'optimum, mais elle est bien plus lente.

1. Un glouton donne la bonne réponse sur 10 exemples. Que peut-on conclure ?

   - [ ] il est toujours optimal
   - [ ] il est optimal pour les petites valeurs
   - [x] rien de général : un contre-exemple peut exister
   - [ ] il est forcément faux

   > Des exemples réussis ne constituent pas une preuve.
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

::::exercice[Rendu de monnaie]{niveau=2}
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

::::exercice[Réserver une salle]{niveau=3}
Une salle reçoit des demandes de réservation. Chaque demande est un couple `(debut, fin)`. Deux réservations sont compatibles si l'une finit avant que l'autre commence, ou au moment où elle commence. On veut accepter le plus de demandes possible.

1. Écris `compatibles(a, b)`, qui renvoie `True` si les deux réservations sont compatibles.
2. Écris `selection(demandes)`, avec la stratégie gloutonne suivante : on examine les demandes par **heure de fin croissante** et on garde chacune si elle est compatible avec la dernière gardée. La fonction renvoie la liste des demandes gardées.
3. À l'écrit : on essaie une autre stratégie, qui examine les demandes par **heure de début croissante**. Donne un exemple où elle garde moins de réservations. Qu'est-ce qui fait de ces deux stratégies des algorithmes gloutons ?

```python depart
def compatibles(a, b):
    ...

def selection(demandes):
    ...
```

```python tests
assert compatibles((8, 10), (10, 12)), "à la suite"
assert compatibles((13, 14), (8, 10)), "dans l'autre ordre"
assert not compatibles((8, 11), (10, 12)), "chevauchement"
d = [(8, 18), (9, 10), (10, 12), (11, 13), (12, 14)]
assert selection(d) == [(9, 10), (10, 12), (12, 14)], "trois réservations"
assert selection([]) == [], "aucune demande"
assert selection([(1, 2)]) == [(1, 2)], "une demande"
```

:::corrige
```python solution
def compatibles(a, b):
    return a[1] <= b[0] or b[1] <= a[0]

def fin(demande):
    return demande[1]

def selection(demandes):
    gardees = []
    for d in sorted(demandes, key=fin):
        if len(gardees) == 0 or compatibles(gardees[len(gardees) - 1], d):
            gardees.append(d)
    return gardees
```

**Question 3.** Avec `(8, 18)`, `(9, 10)` et `(10, 12)`, commencer par le début fait garder seulement `(8, 18)`, alors qu'on peut garder les deux autres. Ces stratégies sont gloutonnes : à chaque étape, on fait un choix immédiat, sans jamais revenir en arrière.
:::
::::
