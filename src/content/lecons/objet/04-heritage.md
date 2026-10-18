---
titre: Héritage, polymorphisme et interfaces
resume: Définir une classe à partir d'une autre, redéfinir des méthodes, exploiter le polymorphisme et comprendre les classes abstraites et les interfaces.
duree: 75
objectifs:
  - Écrire une sous-classe qui hérite d'une classe et appelle son constructeur avec `super()`
  - Redéfinir une méthode et expliquer quelle version est exécutée (liaison dynamique)
  - Utiliser le polymorphisme pour écrire un code qui marche pour plusieurs classes
  - Distinguer héritage, classe abstraite et interface, et savoir quand ne pas hériter
prerequis: [objet/classes-objets, objet/associations]
programme: [lp-poo, lp-uml, nsit-langages]
cartes:
  - q: Que signifie `class B(A):` ?
    r: "B **hérite** de A : un objet B a tous les attributs et méthodes de A, et B peut en ajouter ou en **redéfinir**. Relation « B **est un** A »."
  - q: À quoi sert `super().__init__(…)` ?
    r: "À appeler le constructeur de la classe mère pour initialiser la partie héritée de l'objet, avant d'ajouter les attributs propres à la sous-classe."
  - q: Redéfinition (*override*) ?
    r: "Une sous-classe réécrit une méthode de la classe mère avec la même signature ; pour un objet de la sous-classe, c'est la nouvelle version qui s'exécute."
  - q: Polymorphisme ?
    r: "Un même appel (`f.aire()`) exécute une méthode différente selon la classe réelle de l'objet : on écrit un code général qui fonctionne pour toutes les sous-classes."
  - q: Liaison dynamique ?
    r: "La méthode exécutée est choisie **à l'exécution**, d'après la classe réelle de l'objet (et non d'après le type déclaré de la variable)."
  - q: Classe abstraite ?
    r: "Une classe qu'on n'instancie pas, qui déclare des méthodes sans les implémenter (abstraites) ; ses sous-classes concrètes doivent les définir."
  - q: Interface (Java) ?
    r: "Un contrat : une liste de méthodes sans état qu'une classe s'engage à fournir (`implements`). Une classe hérite d'une seule classe mais peut implémenter plusieurs interfaces."
  - q: Quand ne pas hériter ?
    r: "Quand la relation n'est pas « est un » ou que la sous-classe ne peut pas tenir toutes les promesses de la mère (principe de substitution de Liskov) : préférer la composition."
---

Un cercle, un rectangle et un triangle sont tous des **formes** : ils ont une aire, un périmètre, une position. Plutôt que d'écrire
trois classes indépendantes qui répètent le même code, on définit une classe générale `Forme` et des **sous-classes** qui en
**héritent**. Mieux : on peut ensuite écrire un code qui manipule « des formes » sans savoir lesquelles — c'est le **polymorphisme**.

## 1. Hériter d'une classe

```python exec
class Animal:
    def __init__(self, nom):
        self.nom = nom

    def presenter(self):
        return f"Je suis {self.nom}"

    def cri(self):
        return "..."

class Chien(Animal):                       # Chien hérite d'Animal
    def __init__(self, nom, race):
        super().__init__(nom)              # initialise la partie « Animal »
        self.race = race                   # ajoute un attribut

    def cri(self):                         # redéfinit la méthode
        return "Wouf"

rex = Chien("Rex", "berger")
print(rex.presenter(), "-", rex.cri(), "-", rex.race)
print(isinstance(rex, Chien), isinstance(rex, Animal), issubclass(Chien, Animal))
```

:::definition
- `class Chien(Animal)` : `Chien` est une **sous-classe** (classe fille, dérivée) d'`Animal` (classe mère, super-classe). Un chien
  **est un** animal : il **hérite** de ses attributs et méthodes.
- La sous-classe peut **ajouter** des attributs et des méthodes, et **redéfinir** (*override*) une méthode héritée.
- `super()` donne accès aux méthodes de la classe mère, en particulier à son constructeur.
:::

```mermaid legende="En UML, l'héritage est une flèche à triangle vide vers la classe mère"
classDiagram
  Animal <|-- Chien
  Animal <|-- Chat
  class Animal {
    +nom : str
    +presenter() str
    +cri() str
  }
  class Chien {
    +race : str
    +cri() str
  }
  class Chat {
    +cri() str
  }
```

## 2. Polymorphisme et liaison dynamique

```python exec
from math import pi

class Forme:
    def aire(self):
        raise NotImplementedError("chaque forme définit son aire")

    def decrire(self):                     # utilise aire(), sans savoir laquelle
        return f"{type(self).__name__} d'aire {self.aire():.2f}"

class Cercle(Forme):
    def __init__(self, r):
        self.r = r
    def aire(self):
        return pi * self.r ** 2

class Rectangle(Forme):
    def __init__(self, l, h):
        self.l, self.h = l, h
    def aire(self):
        return self.l * self.h

class Carre(Rectangle):
    def __init__(self, c):
        super().__init__(c, c)

formes = [Cercle(1), Rectangle(2, 3), Carre(2)]
for f in formes:
    print(f.decrire())                     # un seul code, trois comportements
print(sum(f.aire() for f in formes))
```

:::retenir[Polymorphisme]
`f.aire()` exécute la méthode de la **classe réelle** de l'objet, choisie **à l'exécution** (liaison dynamique). Même la méthode
`decrire`, écrite dans `Forme`, appelle la bonne version d'`aire`. On peut ajouter une nouvelle forme **sans modifier** le code qui
les manipule : c'est le principal intérêt de l'héritage.
:::

### L'ordre de recherche d'une méthode

Pour `objet.m()`, Python cherche `m` dans la classe de l'objet, puis dans sa mère, puis la mère de sa mère… et prend la **première**
trouvée. Pour `Carre(2).aire()` : `Carre` n'a pas d'`aire` → `Rectangle` en a une → c'est elle. (`Carre.__mro__` affiche cet ordre.)

## 3. Classes abstraites et interfaces

`Forme` ne devrait pas être instanciée : son `aire` n'a pas de sens. C'est une **classe abstraite**. Python le permet avec le
module `abc` :

```python exec erreur
from abc import ABC, abstractmethod

class Forme(ABC):
    @abstractmethod
    def aire(self):
        ...

class Cercle(Forme):
    def __init__(self, r):
        self.r = r
    def aire(self):
        return 3.14159 * self.r ** 2

print(Cercle(2).aire())
Forme()          # TypeError : on ne peut pas instancier une classe abstraite
```

:::definition[Interface]
Une **interface** est un pur contrat : une liste de méthodes (sans attributs ni code) qu'une classe s'engage à fournir. En Java :
`interface Comparable<T> { int compareTo(T o); }`, et `class Eleve implements Comparable<Eleve>`. Une classe Java n'**hérite** que
d'**une** classe (`extends`), mais peut **implémenter plusieurs** interfaces. En Python, on se contente souvent du *duck typing* :
« si ça a une méthode `aire`, c'est une forme ».
:::

## 4. Hériter… ou pas

L'héritage crée un **couplage fort** : la sous-classe dépend des détails de sa mère. Deux règles :

1. **« est un »** : n'hériter que si tout objet de la sous-classe **est** vraiment un objet de la mère. Une pile *n'est pas* une liste
   (elle *en utilise* une : composition).
2. **Substitution (Liskov)** : partout où le programme attend un objet de la mère, un objet de la sous-classe doit pouvoir être utilisé
   sans surprise. Le contre-exemple classique : un `Carre` qui hérite d'un `Rectangle` **modifiable** — si l'on fixe sa largeur
   puis sa hauteur, on obtient un « carré » non carré, ou un code qui s'attendait à un rectangle se fait piéger.

:::prof
Le programme de terminale mentionne l'héritage et le polymorphisme comme notions de POO ; le concours attend la maîtrise du
vocabulaire (redéfinition, liaison dynamique, classe abstraite, interface) et sa transposition en Java. Côté élèves, éviter les
hiérarchies artificielles (`Animal`/`Chien` amuse mais ne montre pas l'intérêt) : préférer un exemple où le polymorphisme évite un
`if type(x) == …` (formes d'un logiciel de dessin, personnages d'un jeu, opérations d'une calculatrice).
:::

## Exemple guidé

**Problème.** Évaluer des expressions arithmétiques représentées par des arbres : `(2 + 3) × 4`. Concevoir des classes pour que
l'évaluation et l'affichage ne contiennent **aucun test de type**.

**1. Hiérarchie.** Une classe abstraite `Expr` avec `valeur()` et `__str__` ; des sous-classes `Nombre` (feuille) et `Operation`
(nœud), elle-même spécialisée en `Somme` et `Produit` qui ne diffèrent que par le symbole et l'opération.

```python exec
class Expr:
    def valeur(self):
        raise NotImplementedError

class Nombre(Expr):
    def __init__(self, n):
        self.n = n
    def valeur(self):
        return self.n
    def __str__(self):
        return str(self.n)

class Operation(Expr):
    symbole = "?"
    def __init__(self, gauche, droite):
        self.gauche, self.droite = gauche, droite
    def calculer(self, a, b):
        raise NotImplementedError
    def valeur(self):                       # écrit une fois pour toutes les opérations
        return self.calculer(self.gauche.valeur(), self.droite.valeur())
    def __str__(self):
        return f"({self.gauche} {self.symbole} {self.droite})"

class Somme(Operation):
    symbole = "+"
    def calculer(self, a, b):
        return a + b

class Produit(Operation):
    symbole = "×"
    def calculer(self, a, b):
        return a * b

e = Produit(Somme(Nombre(2), Nombre(3)), Nombre(4))
print(e, "=", e.valeur())
```

**2. Lire la liaison dynamique.** `e.valeur()` : `Produit` n'a pas de `valeur` → celle d'`Operation`, qui appelle
`self.calculer` → c'est celle de `Produit` (classe réelle de `e`). Récursivement, `self.gauche.valeur()` exécute la version de `Somme`,
puis de `Nombre`.

**3. Étendre sans modifier.** Pour ajouter la soustraction, on écrit seulement une classe `Difference(Operation)` avec `symbole = "-"`
et `calculer`. Aucune ligne existante ne change : le code est **ouvert à l'extension, fermé à la modification**.

## L'essentiel

- `class B(A)` : B **est un** A, hérite de ses attributs et méthodes, peut en ajouter et en **redéfinir** ; `super().__init__(…)` initialise la partie héritée.
- **Polymorphisme** : un même appel exécute la méthode de la classe réelle de l'objet (**liaison dynamique**) ; on ajoute des sous-classes sans modifier le code existant.
- Recherche d'une méthode : classe de l'objet, puis ses ancêtres dans l'ordre (`__mro__`).
- **Classe abstraite** : non instanciable, méthodes abstraites à définir dans les sous-classes (`abc.ABC`, `@abstractmethod`) ; **interface** : contrat sans état (Java : une seule classe mère, plusieurs interfaces).
- N'hériter que pour une vraie relation « est un » respectant la substitution ; sinon, composition.

## Exercices

::::exercice[Quelle méthode s'exécute ?]{niveau=1}
Qu'affiche ce programme ?

```python
class A:
    def nom(self):
        return "A"
    def saluer(self):
        return "Bonjour de " + self.nom()

class B(A):
    def nom(self):
        return "B"

print(B().saluer())
```

- [ ] `Bonjour de A`
- [x] `Bonjour de B`
- [ ] une erreur, car `B` n'a pas de méthode `saluer`
- [ ] `Bonjour de AB`

:::corrige
`saluer` est héritée de `A`, mais `self` est un objet `B` : `self.nom()` exécute la version de `B` (liaison dynamique).
:::
::::

::::exercice[Le vocabulaire]{niveau=1}
Une méthode d'une sous-classe porte le même nom et les mêmes paramètres qu'une méthode de sa classe mère. Comment appelle-t-on cela ?

- [ ] une surcharge
- [x] une redéfinition
- [ ] une encapsulation
- [ ] une instanciation

:::corrige
C'est une **redéfinition** (*override*). La **surcharge** (*overload*), qui existe en Java mais pas en Python, consiste à définir dans une
même classe plusieurs méthodes de même nom avec des paramètres **différents**.
:::
::::

::::exercice[Des comptes spécialisés]{niveau=2}
Écris `CompteEpargne(Compte)` : le constructeur reçoit aussi un `taux` (par exemple `0.03`), la méthode `appliquer_interets()` ajoute
`solde × taux` au solde. Puis `CompteCourant(Compte)` avec un `decouvert` autorisé : `retirer` accepte que le solde descende jusqu'à
`-decouvert` (sinon `ValueError`).

```python depart
class Compte:
    def __init__(self, titulaire):
        self.titulaire = titulaire
        self.solde = 0

    def deposer(self, montant):
        if montant <= 0:
            raise ValueError("montant invalide")
        self.solde += montant

    def retirer(self, montant):
        if montant <= 0 or montant > self.solde:
            raise ValueError("retrait impossible")
        self.solde -= montant

class CompteEpargne(Compte):
    ...

class CompteCourant(Compte):
    ...
```

```python tests
e = CompteEpargne("Léa", 0.03)
e.deposer(1000); e.appliquer_interets()
assert abs(e.solde - 1030) < 1e-9 and e.titulaire == "Léa", "intérêts"
c = CompteCourant("Hugo", 200)
c.deposer(50); c.retirer(200)
assert c.solde == -150, "découvert utilisé"
try:
    c.retirer(100)
    ok = False
except ValueError:
    ok = True
assert ok and c.solde == -150, "découvert dépassé"
assert isinstance(c, Compte), "un compte courant est un compte"
```

:::corrige
```python solution
class Compte:
    def __init__(self, titulaire):
        self.titulaire = titulaire
        self.solde = 0

    def deposer(self, montant):
        if montant <= 0:
            raise ValueError("montant invalide")
        self.solde += montant

    def retirer(self, montant):
        if montant <= 0 or montant > self.solde:
            raise ValueError("retrait impossible")
        self.solde -= montant

class CompteEpargne(Compte):
    def __init__(self, titulaire, taux):
        super().__init__(titulaire)
        self.taux = taux

    def appliquer_interets(self):
        self.solde += self.solde * self.taux

class CompteCourant(Compte):
    def __init__(self, titulaire, decouvert):
        super().__init__(titulaire)
        self.decouvert = decouvert

    def retirer(self, montant):
        if montant <= 0 or self.solde - montant < -self.decouvert:
            raise ValueError("découvert dépassé")
        self.solde -= montant
```
`CompteCourant` redéfinit `retirer` ; `deposer` est héritée telle quelle. Remarque de conception : l'invariant « solde ≥ 0 » de
`Compte` n'est plus vrai pour un `CompteCourant` — un code qui comptait dessus serait piégé (substitution). Une meilleure hiérarchie
ferait de « solde minimal » un paramètre de `Compte`.
:::
::::

::::exercice[Polymorphisme sans test de type]{niveau=3}
Dans un jeu, chaque personnage a des points de vie `pv` et une méthode `subir(degats)`. Un `Guerrier` a une armure : il subit les
dégâts moins 2 (jamais négatif). Un `Mage` subit des dégâts doublés. Écris les classes, puis la fonction `explosion(personnages, d)`
qui inflige `d` dégâts à chacun et renvoie la liste des noms encore en vie (`pv > 0`). **Aucun** `isinstance` ni `type` dans
`explosion`.

```python depart
class Personnage:
    def __init__(self, nom, pv):
        self.nom = nom
        self.pv = pv

    def subir(self, degats):
        self.pv -= degats

class Guerrier(Personnage):
    ...

class Mage(Personnage):
    ...

def explosion(personnages, d):
    ...
```

```python tests
g, m, p = Guerrier("Aria", 10), Mage("Zed", 10), Personnage("Bob", 5)
assert explosion([g, m, p], 5) == ["Aria"], "seul le guerrier survit"
assert (g.pv, m.pv, p.pv) == (7, 0, 0), "points de vie"
g2 = Guerrier("Tank", 3)
g2.subir(1)
assert g2.pv == 3, "l'armure absorbe un petit coup"
```

:::corrige
```python solution
class Personnage:
    def __init__(self, nom, pv):
        self.nom = nom
        self.pv = pv

    def subir(self, degats):
        self.pv -= degats

class Guerrier(Personnage):
    def subir(self, degats):
        super().subir(max(0, degats - 2))

class Mage(Personnage):
    def subir(self, degats):
        super().subir(2 * degats)

def explosion(personnages, d):
    for p in personnages:
        p.subir(d)
    return [p.nom for p in personnages if p.pv > 0]
```
Chaque sous-classe **adapte** le comportement en réutilisant celui de la mère (`super().subir(…)`). `explosion` ne connaît que
l'interface `subir` : un nouveau type de personnage n'exige aucune modification.
:::
::::

::::exercice[Concevoir une hiérarchie]{niveau=4 duree=25}
Un logiciel de gestion de lycée manipule des **personnes** : élèves (nom, classe, notes), professeurs (nom, matières enseignées,
salaire) et agents (nom, service, salaire). Toutes les personnes ont un nom et une adresse électronique de la forme
`prenom.nom@lycee.fr`. Les professeurs et les agents sont des **personnels** payés chaque mois.

1. Proposez un diagramme de classes UML avec héritage (au moins une classe abstraite), en justifiant chaque relation « est un ».
2. Écrivez en Python la classe abstraite et une méthode polymorphe `fiche()` qui renvoie une description propre à chaque catégorie.
3. Un collègue propose de faire hériter `Classe` (la classe de lycée) de `list` pour stocker ses élèves. Qu'en pensez-vous ?
4. Comment écririez-vous la masse salariale du lycée sans tester le type des objets ?

:::criteres
- Hiérarchie cohérente : `Personne` (abstraite) ← `Eleve`, `Personnel` (abstraite, salaire) ← `Professeur`, `Agent` ; attributs placés au bon niveau (pas de duplication).
- Code : `ABC` + `@abstractmethod fiche`, constructeurs avec `super().__init__`, `fiche` redéfinie dans chaque classe concrète.
- Critique de l'héritage de `list` : une classe n'est pas une liste, elle exposerait `sort`, `insert`, `clear`… ; préférer la composition.
- Masse salariale : somme sur les objets `Personnel` (liste dédiée ou méthode `salaire_mensuel()` polymorphe, éventuellement 0 pour un élève, à discuter).
:::

:::corrige
1. ```mermaid
   classDiagram
     Personne <|-- Eleve
     Personne <|-- Personnel
     Personnel <|-- Professeur
     Personnel <|-- Agent
     class Personne {
       <<abstract>>
       +prenom : str
       +nom : str
       +email() str
       +fiche()* str
     }
     class Eleve {
       +classe : str
       +notes : list
     }
     class Personnel {
       <<abstract>>
       +salaire : float
     }
     class Professeur {
       +matieres : list
     }
     class Agent {
       +service : str
     }
   ```
   Un élève **est une** personne ; un professeur et un agent **sont des** personnels, qui **sont des** personnes. Le salaire est
   factorisé dans `Personnel` (pas de duplication), le nom et l'adresse dans `Personne`.
2. ```python
   from abc import ABC, abstractmethod

   class Personne(ABC):
       def __init__(self, prenom, nom):
           self.prenom, self.nom = prenom, nom

       def email(self):
           return f"{self.prenom}.{self.nom}@lycee.fr".lower()

       @abstractmethod
       def fiche(self):
           ...

   class Personnel(Personne):
       def __init__(self, prenom, nom, salaire):
           super().__init__(prenom, nom)
           self.salaire = salaire

   class Professeur(Personnel):
       def __init__(self, prenom, nom, salaire, matieres):
           super().__init__(prenom, nom, salaire)
           self.matieres = matieres

       def fiche(self):
           return f"Professeur {self.nom} ({', '.join(self.matieres)})"
   ```
   (et de même `Agent.fiche`, `Eleve.fiche`). `Personnel` reste abstraite puisqu'elle ne définit pas `fiche`.
3. Mauvaise idée : une classe de lycée **n'est pas** une liste. Elle hériterait de `sort`, `insert`, `clear`, `+`… et n'importe quel
   code pourrait y ajouter autre chose qu'un élève, ou contourner les règles (effectif maximal, mise à jour de `eleve.classe`). Il
   faut une **composition** : un attribut `self._eleves = []` et des méthodes `inscrire`, `retirer`, `__len__`, `__iter__`.
4. En gardant une liste des personnels (le lycée connaît ses personnels), `sum(p.salaire for p in self.personnels)`. Si l'on veut
   parcourir toutes les personnes, on peut ajouter une méthode polymorphe `cout_mensuel()` : le salaire pour un personnel, 0 pour un
   élève — à discuter, car cela met dans `Eleve` une notion qui ne le concerne pas.
:::
::::
