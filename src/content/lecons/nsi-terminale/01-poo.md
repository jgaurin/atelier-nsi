---
titre: Programmation orientée objet
resume: "Le cours de terminale NSI sur la programmation orientée objet en Python : classes et objets, constructeur __init__ et self, attributs, méthodes, plusieurs objets d'une même classe, objets qui contiennent d'autres objets, et lien avec la notion d'interface d'une structure de données."
duree: 55
objectifs:
  - "Écrire la définition d'une classe avec un constructeur, des attributs et des méthodes"
  - "Créer des objets (instances) et accéder à leurs attributs et méthodes"
  - "Comprendre le rôle de self"
  - "Utiliser une classe comme interface pour une structure de données"
prerequis: [nsi-premiere/dictionnaires, nsi-premiere/specification]
programme: [nsit-structures]
cartes:
  - q: "Classe et objet ?"
    r: "Une **classe** est un **modèle** (un plan) ; un **objet** (une **instance**) est une réalisation concrète de ce modèle, avec ses propres valeurs d'attributs."
  - q: "Rôle de `__init__` ?"
    r: "C'est le **constructeur** : appelé automatiquement à la création de l'objet (`Chien(\"Rex\", 3)`), il initialise les **attributs**."
  - q: "Que désigne `self` ?"
    r: "L'**objet lui-même**, sur lequel la méthode est appelée. `rex.aboyer()` exécute `aboyer` avec `self = rex`."
  - q: "Attribut et méthode ?"
    r: "Un **attribut** est une donnée de l'objet (`self.nom`) ; une **méthode** est une fonction définie dans la classe, qui agit sur l'objet (`def aboyer(self):`)."
  - q: "Pourquoi programmer avec des objets ?"
    r: "Pour **regrouper** données et traitements qui vont ensemble, et **cacher** l'implémentation derrière une **interface** (les méthodes) : on peut changer l'intérieur sans changer le code qui utilise la classe."
  - q: "Erreur classique dans une méthode ?"
    r: "Oublier `self` : en paramètre (`def aboyer():`) ou devant l'attribut (`nom` au lieu de `self.nom`)."
---

En première, une fiche d'élève était un dictionnaire, et les fonctions qui la traitaient étaient écrites à part. La **programmation orientée
objet** (POO) regroupe dans une même **classe** les **données** (les attributs) et les **traitements** (les méthodes). C'est le
paradigme de la plupart des grands logiciels, et c'est l'outil qui permet, en terminale, de **définir ses propres structures de données**.

## Ce que dit le programme

Contenus : *vocabulaire de la programmation objet : classes, attributs, méthodes, objets*. Capacités attendues : **écrire la définition d'une
classe** ; **accéder aux attributs et méthodes d'une classe**. Le programme précise : on n'aborde pas ici tous les aspects de la programmation
objet comme le **polymorphisme** et l'**héritage**.

## 1. Une première classe

```python exec
class Chien:
    def __init__(self, nom, age):
        self.nom = nom
        self.age = age

    def aboyer(self):
        return self.nom + " : Wouf !"

    def anniversaire(self):
        self.age = self.age + 1

rex = Chien("Rex", 3)          # création d'un objet : appel du constructeur
print(rex.nom, rex.age)        # accès aux attributs
print(rex.aboyer())            # appel d'une méthode
rex.anniversaire()
print(rex.age)
```

- `class Chien:` définit la **classe** (par convention, nom avec une majuscule).
- `__init__` est le **constructeur** : il est appelé automatiquement par `Chien("Rex", 3)` et crée les **attributs** `self.nom` et `self.age`.
- `aboyer` et `anniversaire` sont des **méthodes** : des fonctions de la classe, dont le premier paramètre est toujours `self`.
- On accède aux attributs et méthodes avec la **notation pointée** : `rex.nom`, `rex.aboyer()`.

## 2. Plusieurs objets, et le rôle de self

Une classe permet de créer autant d'**objets** (d'**instances**) qu'on veut, chacun avec **ses** valeurs :

```python exec
class Chien:
    def __init__(self, nom, age):
        self.nom = nom
        self.age = age

    def anniversaire(self):
        self.age = self.age + 1

rex = Chien("Rex", 3)
medor = Chien("Médor", 7)
rex.anniversaire()
print(rex.age, medor.age)      # seul Rex a vieilli
```

Quand on écrit `rex.anniversaire()`, Python exécute `anniversaire` avec `self = rex`. C'est pour cela que `self` est indispensable : il dit **de
quel objet** on parle. `rex.anniversaire()` équivaut à `Chien.anniversaire(rex)`.

## 3. Un exemple complet : un compte bancaire

```python exec
class Compte:
    def __init__(self, titulaire, solde=0):
        self.titulaire = titulaire
        self.solde = solde

    def deposer(self, montant):
        assert montant > 0, "montant positif"
        self.solde = self.solde + montant

    def retirer(self, montant):
        """Retire montant si le solde le permet ; renvoie True si le retrait a eu lieu."""
        if montant <= self.solde:
            self.solde = self.solde - montant
            return True
        return False

    def __str__(self):
        return "Compte de " + self.titulaire + " : " + str(self.solde) + " €"

c = Compte("Léa", 100)
c.deposer(50)
print(c.retirer(500), c.retirer(30))
print(c)
```

La méthode spéciale `__str__` définit ce qu'affiche `print(c)`. On peut aussi donner une **valeur par défaut** à un paramètre (`solde=0`).

## 4. Des objets qui contiennent des objets

Un attribut peut être un tableau, un dictionnaire… ou un autre objet.

```python exec
class Eleve:
    def __init__(self, nom):
        self.nom = nom
        self.notes = []

    def ajouter_note(self, note):
        self.notes.append(note)

    def moyenne(self):
        if len(self.notes) == 0:
            return None
        return sum(self.notes) / len(self.notes)

class Classe:
    def __init__(self, nom):
        self.nom = nom
        self.eleves = []

    def inscrire(self, eleve):
        self.eleves.append(eleve)

    def meilleur(self):
        best = None
        for e in self.eleves:
            if e.moyenne() is not None and (best is None or e.moyenne() > best.moyenne()):
                best = e
        return best

lea = Eleve("Léa"); lea.ajouter_note(15); lea.ajouter_note(17)
tom = Eleve("Tom"); tom.ajouter_note(12)
tg1 = Classe("TG1"); tg1.inscrire(lea); tg1.inscrire(tom)
print(tg1.meilleur().nom)
```

## 5. Interface et implémentation

L'intérêt majeur des objets en NSI : séparer l'**interface** (ce qu'on peut faire : les méthodes, leur spécification) de l'**implémentation**
(comment c'est fait à l'intérieur). Celui qui **utilise** une classe n'a besoin que de l'interface.

```python exec
class Pile:
    """Une pile : on empile et on dépile par le sommet."""
    def __init__(self):
        self.contenu = []

    def est_vide(self):
        return len(self.contenu) == 0

    def empiler(self, x):
        self.contenu.append(x)

    def depiler(self):
        assert not self.est_vide(), "pile vide"
        return self.contenu.pop()

p = Pile()
p.empiler(1); p.empiler(2); p.empiler(3)
print(p.depiler(), p.depiler())
```

On pourrait remplacer le tableau `contenu` par une liste chaînée (chapitre suivant) **sans changer** le code qui utilise `empiler` et
`depiler`. C'est ainsi que sont construites les **structures de données** de terminale : piles, files, arbres, graphes.

:::remarque[Attributs « privés »]
Par convention, un attribut dont le nom commence par `_` (`self._contenu`) ne doit pas être utilisé hors de la classe : il fait partie de
l'implémentation. Python ne l'interdit pas, mais c'est une règle de bonne conduite.
:::

## Les erreurs classiques des élèves

:::attention[Ce que tu verras en classe]
- **Oublier `self`** en premier paramètre d'une méthode (`TypeError: takes 0 positional arguments but 1 was given`).
- **Oublier `self.`** devant un attribut : `nom = nom` crée une variable locale, l'attribut n'existe pas.
- **Confondre classe et objet** : `Chien.aboyer()` au lieu de `rex.aboyer()`.
- **Oublier les parenthèses** : `rex.aboyer` (la méthode elle-même) au lieu de `rex.aboyer()` (l'appel).
- **Passer `self` à l'appel** : `rex.aboyer(rex)`.
- **Écrire `__init__` avec un seul tiret bas** (`_init_`) : le constructeur n'est jamais appelé.
:::

## En classe

:::methode[Activités qui marchent]
1. **Débranché** : un « moule » (la classe) et des « gâteaux » (les objets) ; chaque élève remplit une fiche-objet à partir de la fiche-classe.
2. **Modéliser** un jeu : un `Personnage` avec des points de vie, une méthode `attaquer(autre)` qui modifie un autre objet.
3. **Python Tutor** pour voir les objets en mémoire et `self` pointer vers l'objet courant.
4. **Réécrire** un programme de première écrit avec des dictionnaires en version objet, et comparer.
:::

## L'essentiel

- **Classe** = modèle ; **objet** (instance) = réalisation, créée par `NomClasse(arguments)`.
- **Constructeur** `__init__(self, ...)` : initialise les **attributs** `self.attribut`.
- **Méthode** : fonction de la classe, premier paramètre **`self`** = l'objet sur lequel on l'appelle.
- Notation pointée : `objet.attribut`, `objet.methode()`.
- **Interface** (les méthodes) / **implémentation** (l'intérieur) : on change l'une sans toucher au code qui utilise l'autre.
- Hors programme : héritage, polymorphisme.

## Exercices

::::exercice[Grand QCM : programmation objet]{niveau=1 type=quiz}
Douze questions sur les classes et les objets.

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

1. Quelle notion n'est **pas** au programme de terminale NSI ?

   - [ ] les attributs
   - [ ] les méthodes
   - [x] l'héritage
   - [ ] le constructeur

   > Héritage et polymorphisme ne sont pas abordés.

1. Un attribut nommé `_contenu` signale :

   - [ ] une erreur
   - [x] qu'il fait partie de l'implémentation et ne doit pas être utilisé hors de la classe
   - [ ] qu'il est constant
   - [ ] qu'il est obligatoire

   > C'est une convention, Python ne l'interdit pas.
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

::::exercice[Une file avec une classe]{niveau=2}
Écris une classe `File` (premier arrivé, premier servi) avec les méthodes `est_vide()`, `enfiler(x)` (ajoute à la fin), `defiler()` (retire
et renvoie le premier élément) et `taille()`. L'implémentation interne est libre.

```python depart
class File:
    ...
```

```python tests
f = File()
assert f.est_vide(), "vide au départ"
f.enfiler("A"); f.enfiler("B"); f.enfiler("C")
assert f.taille() == 3, "trois éléments"
assert f.defiler() == "A", "premier arrivé, premier servi"
assert f.defiler() == "B", "puis B"
f.enfiler("D")
assert f.defiler() == "C" and f.defiler() == "D", "puis C et D"
assert f.est_vide(), "vide à la fin"
```

:::corrige
```python solution
class File:
    def __init__(self):
        self._contenu = []

    def est_vide(self):
        return len(self._contenu) == 0

    def enfiler(self, x):
        self._contenu.append(x)

    def defiler(self):
        assert not self.est_vide(), "file vide"
        return self._contenu.pop(0)

    def taille(self):
        return len(self._contenu)
```

`pop(0)` retire le premier élément, mais décale tous les autres : c'est coûteux pour une grande file. Le chapitre suivant propose une
implémentation avec **deux piles**, sans changer l'interface.
:::
::::

::::exercice[Modéliser un jeu]{niveau=2}
Écris une classe `Personnage` : constructeur avec un nom et des points de vie (`pv`) ; `est_vivant()` ; `subir(degats)` qui retire des points de
vie sans descendre sous 0 ; `attaquer(autre, degats)` qui fait subir les dégâts à un autre personnage **si l'attaquant est vivant**.

```python depart
class Personnage:
    ...
```

```python tests
a = Personnage("Arya", 30)
b = Personnage("Bran", 20)
a.attaquer(b, 15)
assert b.pv == 5, "Bran touché"
a.attaquer(b, 15)
assert b.pv == 0 and not b.est_vivant(), "pas de points de vie négatifs"
b.attaquer(a, 10)
assert a.pv == 30, "un personnage mort n'attaque pas"
```

:::corrige
```python solution
class Personnage:
    def __init__(self, nom, pv):
        self.nom = nom
        self.pv = pv

    def est_vivant(self):
        return self.pv > 0

    def subir(self, degats):
        self.pv = max(0, self.pv - degats)

    def attaquer(self, autre, degats):
        if self.est_vivant():
            autre.subir(degats)
```

`attaquer` modifie **un autre objet** en appelant sa méthode `subir` : on ne touche pas directement à `autre.pv`, on passe par son interface.
:::
::::

::::exercice[Expliquer self à un élève]{niveau=2}
Un élève demande : « Pourquoi on écrit `def aboyer(self):` avec un paramètre, alors qu'on appelle `rex.aboyer()` sans rien entre les
parenthèses ? » Réponds-lui clairement, avec un exemple à deux objets.

:::criteres
- `self` reçoit automatiquement l'objet placé avant le point.
- `rex.aboyer()` équivaut à `Chien.aboyer(rex)`.
- Exemple à deux objets : la même méthode donne des résultats différents car `self` change.
- Utilité : la méthode doit savoir de quel objet utiliser les attributs.
:::

:::corrige
Quand tu écris `rex.aboyer()`, Python **passe automatiquement** l'objet placé avant le point, `rex`, comme premier argument : c'est
exactement `Chien.aboyer(rex)`. Dans la méthode, `self` désigne donc `rex`, et `self.nom` vaut « Rex ». Si tu écris ensuite `medor.aboyer()`,
la **même** méthode s'exécute avec `self = medor`, et `self.nom` vaut « Médor ». C'est tout l'intérêt : la classe n'écrit la méthode qu'**une
fois**, et `self` lui indique **sur quel objet** travailler. Sans ce paramètre, la méthode ne saurait pas quel nom afficher.
:::
::::
