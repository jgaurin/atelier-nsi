---
titre: Programmation objet
resume: "Définir une classe, créer des objets, utiliser leurs attributs et leurs méthodes."
duree: 40
objectifs:
  - "Écrire la définition d'une classe"
  - "Accéder aux attributs et aux méthodes d'un objet"
prerequis: [terminale-structures/interface]
---

Une **classe** regroupe des données et les fonctions qui les manipulent. C'est un modèle à partir duquel on crée des **objets**.

## 1. Une classe

```python exec
class Chien:
    def __init__(self, nom, age):
        self.nom = nom
        self.age = age

    def anniversaire(self):
        self.age = self.age + 1

rex = Chien("Rex", 3)
rex.anniversaire()
print(rex.nom, rex.age)
```

| Mot | Sens |
| --- | --- |
| **classe** | le modèle : `Chien` |
| **objet** | un exemplaire : `rex` |
| **attribut** | une donnée de l'objet : `self.nom` |
| **méthode** | une fonction de la classe : `anniversaire` |
| **constructeur** | `__init__`, appelé à la création de l'objet |

## 2. `self`

`self` désigne l'objet sur lequel on appelle la méthode. `rex.anniversaire()` exécute `anniversaire` avec `self = rex`.

:::attention
Sans `self.`, `nom = nom` crée une simple variable locale, et l'attribut n'existe pas.
:::

## L'essentiel

- Une classe définit des attributs et des méthodes ; `__init__` crée les attributs.
- `self` est l'objet courant.
- On écrit `objet.attribut` et `objet.methode()`.

## Exercices

::::exercice[QCM : programmation objet]{niveau=1 type=quiz}
Une question à la fois : la correction s'affiche aussitôt.

1. Qu'est-ce qu'une classe ?

   - [ ] une variable qui contient un objet
   - [x] un modèle qui décrit les attributs et les méthodes des objets
   - [ ] une fonction qui renvoie un dictionnaire
   - [ ] un module Python

   > Les objets sont fabriqués à partir de ce modèle.

1. Quand la méthode `__init__` est-elle exécutée ?

   - [ ] quand on appelle `obj.__init__()` explicitement seulement
   - [x] automatiquement, à la création de l'objet
   - [ ] à la fin du programme
   - [ ] jamais

   > `Chien("Rex", 3)` appelle `__init__`.

1. Dans `rex.anniversaire()`, que vaut `self` pendant l'exécution de la méthode ?

   - [ ] la classe `Chien`
   - [x] l'objet `rex`
   - [ ] `None`
   - [ ] l'âge de rex

   > `self` est l'objet sur lequel on appelle la méthode.

1. Comment accède-t-on à l'attribut `age` de l'objet `rex` ?

   - [ ] `rex["age"]`
   - [x] `rex.age`
   - [ ] `age(rex)`
   - [ ] `Chien.age`

   > Notation pointée.

1. Que se passe-t-il avec `def __init__(self, nom): nom = nom` ?

   - [ ] l'attribut nom est créé
   - [x] aucun attribut n'est créé : il faut `self.nom = nom`
   - [ ] une erreur de syntaxe
   - [ ] l'attribut est créé dans la classe

   > Sans `self.`, c'est une simple variable locale.

1. On crée `a = Compte("Léa", 10)` et `b = Compte("Tom", 10)`, puis `a.deposer(5)`. Que vaut `b.solde` ?

   - [x] 10
   - [ ] 15
   - [ ] 5
   - [ ] une erreur

   > Chaque objet a ses propres attributs.

1. Quel est le premier paramètre de toute méthode d'une classe ?

   - [ ] `this`
   - [x] `self`
   - [ ] le nom de la classe
   - [ ] aucun

   > Par convention `self`, qui reçoit l'objet.

1. Que renvoie `rex.aboyer` (sans parenthèses) ?

   - [ ] le texte « Rex : Wouf ! »
   - [x] la méthode elle-même, sans l'exécuter
   - [ ] une erreur
   - [ ] `None`

   > Il faut des parenthèses pour appeler la méthode.

1. À quoi sert la méthode `__str__` ?

   - [ ] à créer l'objet
   - [x] à définir le texte affiché par `print(objet)`
   - [ ] à comparer deux objets
   - [ ] à supprimer l'objet

   > Sans elle, `print` affiche une adresse peu lisible.

1. Quel est l'intérêt de séparer interface et implémentation ?

   - [ ] le programme est plus court
   - [x] on peut changer l'implémentation sans modifier le code qui utilise la classe
   - [ ] le programme est plus rapide
   - [ ] on n'a plus besoin de tests

   > L'utilisateur ne dépend que des méthodes et de leur spécification.

::::

::::exercice[Lire une classe]{niveau=1 type=reponses}
Donne ce que le programme affiche.

1. Que s'affiche-t-il ?

   ```python verifier
   class Compteur:
       def __init__(self):
           self.n = 0
       def plus(self):
           self.n = self.n + 1

   c = Compteur()
   c.plus()
   c.plus()
   print(c.n)
   ```

   - 2

1. Que s'affiche-t-il ?

   ```python verifier
   class Compteur:
       def __init__(self):
           self.n = 0
       def plus(self):
           self.n = self.n + 1

   a = Compteur()
   b = Compteur()
   a.plus()
   print(b.n)
   ```

   - 0
::::

::::exercice[Compléter une classe]{niveau=1 type=completer}
Complète cette classe.

```python trous
class Rectangle:
    def [[__init__]](self, largeur, hauteur):
        [[self]].largeur = largeur
        self.hauteur = [[hauteur]]

    def aire([[self]]):
        return self.largeur * [[self.hauteur]]
```
::::

::::exercice[Une classe Point]{niveau=1}
Écris une classe `Point` dont le constructeur reçoit `x` et `y`, avec les méthodes `distance_origine()` (distance à (0, 0)), `translater(dx,
dy)` qui déplace le point, et `distance(autre)` qui renvoie la distance à un autre point.

```python depart
from math import sqrt

class Point:
    ...
```

```python tests
p = Point(3, 4)
assert p.x == 3 and p.y == 4, "attributs"
assert p.distance_origine() == 5, "distance à l'origine"
p.translater(1, -1)
assert (p.x, p.y) == (4, 3), "translation"
assert Point(0, 0).distance(Point(6, 8)) == 10, "distance entre deux points"
```

:::corrige
```python solution
from math import sqrt

class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def distance_origine(self):
        return sqrt(self.x ** 2 + self.y ** 2)

    def translater(self, dx, dy):
        self.x = self.x + dx
        self.y = self.y + dy

    def distance(self, autre):
        return sqrt((self.x - autre.x) ** 2 + (self.y - autre.y) ** 2)
```

Dans `distance`, `self` est le point sur lequel on appelle la méthode, `autre` le point passé en argument : on accède aux attributs des deux.
:::
::::

::::exercice[Un compte avec historique]{niveau=2}
Écris une classe `Compte` avec : un constructeur qui reçoit le titulaire (solde initial 0, historique vide) ; `deposer(montant)` ;
`retirer(montant)` qui renvoie `False` et ne fait rien si le solde est insuffisant, `True` sinon ; et un attribut `historique`, tableau des
opérations réussies sous la forme `("depot", montant)` ou `("retrait", montant)`.

```python depart
class Compte:
    ...
```

```python tests
c = Compte("Léa")
assert c.titulaire == "Léa" and c.solde == 0, "création"
c.deposer(100)
assert c.retirer(30) is True, "retrait possible"
assert c.retirer(500) is False, "retrait refusé"
assert c.solde == 70, "solde"
assert c.historique == [("depot", 100), ("retrait", 30)], "historique sans le retrait refusé"
assert Compte("Tom").historique == [], "chaque compte a son historique"
```

:::corrige
```python solution
class Compte:
    def __init__(self, titulaire):
        self.titulaire = titulaire
        self.solde = 0
        self.historique = []

    def deposer(self, montant):
        self.solde = self.solde + montant
        self.historique.append(("depot", montant))

    def retirer(self, montant):
        if montant > self.solde:
            return False
        self.solde = self.solde - montant
        self.historique.append(("retrait", montant))
        return True
```

L'historique est créé **dans** `__init__` : chaque compte a ainsi son propre tableau. Le dernier test le vérifie.
:::
::::
