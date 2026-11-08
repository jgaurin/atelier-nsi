---
titre: Sujet pratique n° 2
resume: "Un sujet d'entraînement sur ordinateur : gérer les trains d'une gare avec une classe et une file."
duree: 60
controle: true
objectifs:
  - "Programmer à partir d'un document"
  - "Utiliser une classe et une structure de données adaptée"
  - "Analyser et corriger une fonction existante"
prerequis: [terminale-bac/epreuve]
---

## Le document

Sujet original, au format de la partie pratique. Durée conseillée : **1 heure**. Après chaque question, prépare-toi à expliquer ta réponse.

Une petite gare n'a qu'une voie. Les trains qui arrivent attendent dans l'ordre d'arrivée, puis partent chacun leur tour. Un train est représenté par un dictionnaire :

```python
{"numero": 8412, "destination": "Lyon", "retard": 5}
```

Le champ `"retard"` est un nombre de minutes.

## Exercices

::::exercice[Question 1 : la file d'attente]{niveau=3 points=5}
Écris la classe `Gare` avec un attribut `attente` (initialement vide) et les méthodes `arrivee(train)`, qui ajoute un train à la file, et `depart()`, qui retire le premier train arrivé et le renvoie, ou renvoie `None` si la file est vide.

```python depart
class Gare:
    ...
```

```python tests
g = Gare()
assert g.depart() is None, "file vide"
t1 = {"numero": 1, "destination": "Lyon", "retard": 0}
t2 = {"numero": 2, "destination": "Metz", "retard": 3}
g.arrivee(t1)
g.arrivee(t2)
assert g.depart() == t1, "premier arrivé, premier parti"
assert g.depart() == t2, "ensuite le second"
assert g.depart() is None, "de nouveau vide"
```

:::corrige
```python solution
class Gare:
    def __init__(self):
        self.attente = []

    def arrivee(self, train):
        self.attente.append(train)

    def depart(self):
        if len(self.attente) == 0:
            return None
        return self.attente.pop(0)
```
:::
::::

::::exercice[Question 2 : compter par destination]{niveau=3 points=5}
Écris `par_destination(trains)`, qui renvoie un dictionnaire associant à chaque destination le nombre de trains qui y vont.

```python depart
def par_destination(trains):
    ...
```

```python tests
t = [{"numero": 1, "destination": "Lyon", "retard": 0},
     {"numero": 2, "destination": "Metz", "retard": 3},
     {"numero": 3, "destination": "Lyon", "retard": 1}]
assert par_destination(t) == {"Lyon": 2, "Metz": 1}, "deux destinations"
assert par_destination([]) == {}, "aucun train"
```

:::corrige
```python solution
def par_destination(trains):
    compte = {}
    for t in trains:
        d = t["destination"]
        if d in compte:
            compte[d] = compte[d] + 1
        else:
            compte[d] = 1
    return compte
```
:::
::::

::::exercice[Question 3 : le plus en retard]{niveau=3 points=4}
Écris `plus_en_retard(trains)`, qui renvoie le numéro du train qui a le plus grand retard, ou `None` si la liste est vide. En cas d'égalité, on renvoie le premier rencontré.

```python depart
def plus_en_retard(trains):
    ...
```

```python tests
t = [{"numero": 1, "destination": "Lyon", "retard": 2},
     {"numero": 2, "destination": "Metz", "retard": 9},
     {"numero": 3, "destination": "Lyon", "retard": 9}]
assert plus_en_retard(t) == 2, "premier des plus en retard"
assert plus_en_retard([]) is None, "liste vide"
```

:::corrige
```python solution
def plus_en_retard(trains):
    if len(trains) == 0:
        return None
    meilleur = trains[0]
    for t in trains:
        if t["retard"] > meilleur["retard"]:
            meilleur = t
    return meilleur["numero"]
```
:::
::::

::::exercice[Question 4 : corriger une fonction]{niveau=3 points=3}
La fonction suivante doit renvoyer le retard moyen des trains, ou 0 si la liste est vide. Elle contient **deux** erreurs. Corrige-la.

```python depart
def retard_moyen(trains):
    total = 0
    for i in range(1, len(trains)):
        total = total + trains[i]["retard"]
    return total / len(trains)
```

```python tests
t = [{"retard": 2}, {"retard": 4}, {"retard": 6}]
assert retard_moyen(t) == 4, "le premier train compte aussi"
assert retard_moyen([]) == 0, "liste vide"
```

:::corrige
```python solution
def retard_moyen(trains):
    if len(trains) == 0:
        return 0
    total = 0
    for i in range(len(trains)):
        total = total + trains[i]["retard"]
    return total / len(trains)
```

La boucle oubliait le premier train, et une liste vide provoquait une division par zéro.
:::
::::

::::exercice[Question 5 : justifier un choix]{niveau=3 points=3}
Pourquoi une file convient-elle mieux qu'une pile pour cette gare ? Et que penser de `pop(0)` si des milliers de trains attendent ?

:::criteres
- Une file respecte l'ordre d'arrivée, une pile ferait partir le dernier arrivé.
- `pop(0)` décale tous les éléments : son coût est linéaire.
- Une file à deux piles ou une liste chaînée évite ce décalage.
:::

:::corrige
Les trains doivent partir dans leur ordre d'arrivée : c'est le principe d'une file, alors qu'une pile ferait partir le dernier arrivé. Cependant, `pop(0)` décale tous les éléments suivants : avec des milliers de trains, chaque départ coûte cher. Une implémentation à deux piles, ou une liste chaînée, permet d'éviter ce décalage sans changer l'interface.
:::
::::
