---
titre: Contrôle du chapitre
resume: "Un contrôle d'une heure noté sur 20 sur les structures de données."
duree: 60
controle: true
objectifs:
  - "Utiliser classes, piles et files"
  - "Mesurer un arbre et représenter un graphe"
prerequis: [terminale-structures/graphes]
---

## Consignes

Durée : **1 heure**. Le contrôle est noté sur **20 points**.

## Exercices

::::exercice[Pile et file]{niveau=3 type=reponses points=4}
Chaque question vaut 1 point.

1. Comment appelle-t-on le mode d'une pile ? Réponds en quatre lettres.

   - LIFO

1. On enfile 1, 2, 3, on défile une fois, on enfile 4, on défile une fois. Quel élément obtient-on en dernier ?

   ```python calcul
   f = [1, 2, 3]
   f.pop(0)
   f.append(4)
   print(f.pop(0))
   ```

   - 2

1. Quelle structure utiliser pour la fonction « annuler » d'un logiciel ?

   - pile
   - une pile

1. Quelle structure utiliser pour gérer des requêtes dans leur ordre d'arrivée ?

   - file
   - une file
::::

::::exercice[Une classe]{niveau=3 type=completer points=4}
Chaque case vaut 0,5 point. La classe représente un livre emprunté.

```python trous
class Livre:
    def [[__init__]](self, titre):
        self.titre = [[titre]]
        self.[[emprunte]] = False

    def emprunter([[self]]):
        if self.emprunte:
            return [[False]]
        self.emprunte = [[True]]
        return True

b = [[Livre]]("Dune")
b.[[emprunter()]]
```
::::

::::exercice[Écrire une méthode]{niveau=3 points=5}
Complète la classe `Pile` avec la méthode `sommet()`, qui renvoie l'élément au sommet sans le retirer, et la méthode `taille()`.

```python depart
class Pile:
    def __init__(self):
        self.contenu = []

    def empiler(self, x):
        self.contenu.append(x)

    def sommet(self):
        ...

    def taille(self):
        ...
```

```python tests
p = Pile()
assert p.taille() == 0, "vide"
p.empiler(4)
p.empiler(9)
assert p.sommet() == 9, "sommet"
assert p.taille() == 2, "le sommet n'est pas retiré"
```

:::corrige
```python solution
class Pile:
    def __init__(self):
        self.contenu = []

    def empiler(self, x):
        self.contenu.append(x)

    def sommet(self):
        return self.contenu[len(self.contenu) - 1]

    def taille(self):
        return len(self.contenu)
```
:::
::::

::::exercice[Arbre]{niveau=3 type=reponses points=3}
La hauteur compte les nœuds. Chaque question vaut 1 point.

1. Combien de nœuds au maximum pour un arbre binaire de hauteur 4 ?

   ```python calcul
   print(2 ** 4 - 1)
   ```

   - 15

1. Un arbre binaire a 7 nœuds. Quelle est sa hauteur maximale ?

   - 7

1. Un nœud sans enfant s'appelle…

   - feuille
   - une feuille
::::

::::exercice[Graphe]{niveau=3 points=4}
Écris `degre(m, i)` qui renvoie le degré du sommet `i` d'un graphe non orienté donné par sa matrice d'adjacence.

```python depart
def degre(m, i):
    ...
```

```python tests
m = [[0, 1, 1], [1, 0, 0], [1, 0, 0]]
assert degre(m, 0) == 2, "sommet relié à deux autres"
assert degre(m, 1) == 1, "un seul voisin"
```

:::corrige
```python solution
def degre(m, i):
    d = 0
    for v in m[i]:
        d = d + v
    return d
```
:::
::::
