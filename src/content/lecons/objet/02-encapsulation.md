---
titre: Encapsulation et interface d'une classe
resume: Séparer ce qu'une classe montre (son interface) de ce qu'elle cache (son implémentation), protéger ses invariants avec des attributs privés, des accesseurs et des propriétés.
duree: 60
objectifs:
  - Expliquer le principe d'encapsulation et la distinction interface / implémentation
  - Utiliser les conventions Python (`_attribut`, `__attribut`) et les propriétés (`@property`)
  - Écrire des accesseurs et des mutateurs qui protègent un invariant
  - Changer l'implémentation d'une classe sans modifier son interface
prerequis: [objet/classes-objets]
programme: [lp-poo, asd-types, nsit-structures]
cartes:
  - q: Qu'est-ce que l'encapsulation ?
    r: "Le fait de regrouper données et méthodes dans un objet **et** de cacher l'état interne : on n'agit sur l'objet que par les méthodes de son **interface**."
  - q: Interface ou implémentation ?
    r: "L'**interface** est ce que l'utilisateur de la classe peut appeler (méthodes publiques, leur spécification) ; l'**implémentation** est la façon dont c'est fait (attributs internes, algorithmes)."
  - q: "`_x` et `__x` en Python ?"
    r: "`_x` : convention « interne, ne pas utiliser de l'extérieur » (rien n'est empêché). `__x` : le nom est transformé en `_Classe__x` (*name mangling*), ce qui évite les collisions dans les sous-classes."
  - q: À quoi sert `@property` ?
    r: "À exposer un attribut calculé ou contrôlé avec la syntaxe d'un attribut (`c.solde`), en passant en réalité par une méthode (et `@solde.setter` pour l'affectation)."
  - q: Accesseur et mutateur ?
    r: "Un accesseur (*getter*) renvoie la valeur d'un attribut ; un mutateur (*setter*) la modifie **en vérifiant** qu'elle respecte l'invariant."
  - q: Pourquoi l'encapsulation facilite-t-elle la maintenance ?
    r: "Les utilisateurs ne dépendent que de l'interface : on peut changer l'implémentation (structure interne, algorithme) sans casser leur code."
  - q: Différence avec Java ?
    r: "Java impose la visibilité par mots-clés (`private`, `public`, `protected`, paquet) vérifiés à la compilation ; Python repose sur des conventions."
---

Dans la leçon précédente, rien n'empêchait d'écrire `compte.solde = -1000` : l'invariant « le solde est positif » pouvait être
cassé de l'extérieur, sans passer par `retirer`. L'**encapsulation** règle ce problème : l'objet **cache** son état et ne se laisse
manipuler qu'à travers une **interface** choisie. C'est aussi l'idée des **types abstraits** : on sépare *ce que fait* une structure
de *comment elle le fait*.

## 1. Interface et implémentation

:::definition
- L'**interface** d'une classe : l'ensemble des méthodes (et attributs) accessibles de l'extérieur, avec leur **spécification**
  (ce qu'elles reçoivent, renvoient, garantissent).
- L'**implémentation** : la représentation interne (quels attributs, quelles structures) et le code des méthodes.
- **Encapsulation** : l'utilisateur ne connaît que l'interface ; l'implémentation est cachée et peut changer.
:::

```mermaid legende="L'utilisateur ne passe que par l'interface ; l'état interne est protégé"
flowchart LR
  U["Code utilisateur"] -->|"deposer(50)<br/>retirer(20)<br/>solde"| I
  subgraph O["Objet Compte"]
    I["Interface publique"] --> E["État interne<br/>_solde, _historique"]
  end
  U -. "accès direct déconseillé" .-> E
```

Avantages : l'objet **garantit ses invariants** (toute modification passe par une méthode qui vérifie) ; le code utilisateur ne
dépend pas des détails internes, qu'on peut donc **modifier** sans rien casser (maintenance) ; l'interface **documente** ce qu'on
peut faire.

## 2. La visibilité en Python : des conventions

Python ne bloque pas l'accès aux attributs ; il s'appuie sur des conventions de nommage :

| Nom        | Signification                                                    |
|------------|------------------------------------------------------------------|
| `solde`    | public : fait partie de l'interface                              |
| `_solde`   | interne (« privé par convention ») : à ne pas utiliser de l'extérieur |
| `__solde`  | renommé en `_Compte__solde` (*name mangling*) : protège des collisions de noms dans les sous-classes |

```python exec
class Compte:
    def __init__(self, titulaire):
        self.titulaire = titulaire
        self.__solde = 0

c = Compte("Léa")
try:
    print(c.__solde)
except AttributeError as e:
    print("AttributeError :", e)
print(c._Compte__solde)     # toujours accessible : ce n'est pas une vraie protection
```

:::remarque
En Java, la visibilité est contrôlée par le compilateur : `private` (la classe seule), `protected` (le paquet et les sous-classes),
`public` (tout le monde), et sans mot-clé (le paquet). Python fait confiance au programmeur : « we are all consenting adults ».
:::

## 3. Accesseurs, mutateurs et propriétés

La façon classique (Java) : rendre l'attribut privé et fournir un **accesseur** (`get_…`) et, si nécessaire, un **mutateur**
(`set_…`) qui **vérifie** la nouvelle valeur.

En Python, la **propriété** (`@property`) offre la même protection avec la syntaxe d'un attribut :

```python exec
class Temperature:
    def __init__(self, celsius):
        self.celsius = celsius            # passe par le mutateur ci-dessous

    @property
    def celsius(self):                    # accesseur
        return self._celsius

    @celsius.setter
    def celsius(self, valeur):            # mutateur : protège l'invariant
        if valeur < -273.15:
            raise ValueError("en dessous du zéro absolu")
        self._celsius = valeur

    @property
    def fahrenheit(self):                 # attribut calculé, en lecture seule
        return self._celsius * 9 / 5 + 32

t = Temperature(20)
t.celsius = 37
print(t.celsius, t.fahrenheit)
try:
    t.celsius = -300
except ValueError as e:
    print("refusé :", e)
try:
    t.fahrenheit = 0
except AttributeError:
    print("fahrenheit est en lecture seule")
```

:::methode[Quand écrire un mutateur ?]
Pas systématiquement ! Un attribut qui ne doit pas changer après la création n'a **pas** de mutateur (objet en lecture seule). Un
attribut qui doit respecter une contrainte a un mutateur qui la **vérifie**. Un mutateur qui se contente de `self._x = x` sans
contrôle n'apporte rien de plus qu'un attribut public… sauf la possibilité d'ajouter un contrôle plus tard sans changer l'interface.
:::

## 4. Changer l'implémentation sans changer l'interface

L'intérêt majeur : l'implémentation peut évoluer. Voici une **pile** avec deux implémentations différentes, et un code utilisateur
qui fonctionne avec l'une comme avec l'autre :

```python exec
class PileListe:
    def __init__(self):
        self._elements = []
    def est_vide(self):
        return self._elements == []
    def empiler(self, x):
        self._elements.append(x)
    def depiler(self):
        return self._elements.pop()

class PileChainee:
    def __init__(self):
        self._sommet = None               # maillons (valeur, suivant)
    def est_vide(self):
        return self._sommet is None
    def empiler(self, x):
        self._sommet = (x, self._sommet)
    def depiler(self):
        x, self._sommet = self._sommet
        return x

def inverser(mot, pile):                  # n'utilise que l'interface
    for c in mot:
        pile.empiler(c)
    resultat = ""
    while not pile.est_vide():
        resultat += pile.depiler()
    return resultat

print(inverser("objet", PileListe()), inverser("objet", PileChainee()))
```

:::prof
En terminale, l'encapsulation se travaille surtout avec les structures de données : « distinguer l'interface et l'implémentation »,
« écrire plusieurs implémentations d'une même structure ». Une activité classique : donner aux élèves une interface (spécification
d'une file) et leur faire écrire deux implémentations, puis échanger leurs fichiers pour vérifier que le programme de test marche
avec les deux.
:::

## Exemple guidé

**Problème.** Une classe `Horaire` stocke une heure de la journée. L'interface : `heures`, `minutes` (lecture), `ajouter(minutes)`
et l'affichage `"08:05"`. Écrire **deux** implémentations : l'une stocke `(h, m)`, l'autre le nombre de minutes depuis minuit.
Laquelle est la plus simple ?

**1. Fixer l'interface et l'invariant.** Invariant : l'heure est entre 00:00 et 23:59 ; `ajouter` fait le tour du cadran (23:50 + 20
min = 00:10).

**2. Implémentation 2 (minutes depuis minuit).** Un seul attribut, invariant `0 <= _total < 1440` :

```python exec
class Horaire:
    def __init__(self, h, m):
        self._total = (h * 60 + m) % 1440

    @property
    def heures(self):
        return self._total // 60

    @property
    def minutes(self):
        return self._total % 60

    def ajouter(self, minutes):
        self._total = (self._total + minutes) % 1440

    def __str__(self):
        return f"{self.heures:02d}:{self.minutes:02d}"

h = Horaire(23, 50)
h.ajouter(20)
print(h, h.heures, h.minutes)
h.ajouter(-30)
print(h)
```

**3. Comparer.** Avec `(h, m)`, `ajouter` doit gérer deux retenues (minutes → heures → tour du jour), et le constructeur doit
normaliser deux valeurs. Avec un total unique, tout est un modulo. L'interface étant la même (`heures`, `minutes` sont des
propriétés), le code utilisateur ne voit **aucune** différence : on peut passer de l'une à l'autre sans rien casser.

## L'essentiel

- **Encapsulation** : l'objet cache son état et n'est manipulé que par son **interface** ; il garantit ainsi ses invariants.
- Interface = *ce que fait* la classe (méthodes publiques + spécification) ; implémentation = *comment*.
- Python : `_x` (interne, par convention), `__x` (renommé `_Classe__x`) ; Java : `private`, `protected`, `public`, contrôlés à la compilation.
- Accesseur / mutateur, ou en Python `@property` et `@x.setter` ; un mutateur **vérifie** la valeur ; pas de mutateur pour une donnée qui ne doit pas changer.
- On peut changer l'implémentation (structure interne) sans toucher au code des utilisateurs.

## Exercices

::::exercice[Le vocabulaire]{niveau=1}
Parmi ces affirmations, laquelle est vraie ?

- [ ] En Python, un attribut nommé `_x` ne peut pas être lu de l'extérieur de la classe
- [x] Changer la représentation interne d'une classe ne casse pas le code qui n'utilise que son interface
- [ ] Tout attribut doit avoir un mutateur
- [ ] L'interface d'une classe est la liste de ses attributs internes

:::corrige
L'encapsulation sert précisément à pouvoir changer l'implémentation sans casser l'interface. `_x` n'est qu'une convention ; un
attribut qui ne doit pas changer n'a pas de mutateur ; l'interface, ce sont les méthodes publiques et leur spécification.
:::
::::

::::exercice[Name mangling]{niveau=1}
Avec `class A:` dont le constructeur fait `self.__v = 1`, que fait `print(A()._A__v)` ?

- [ ] une erreur `AttributeError`
- [x] il affiche `1`
- [ ] une erreur de syntaxe
- [ ] il affiche `None`

:::corrige
`self.__v` est stocké sous le nom `_A__v` : on peut toujours y accéder avec ce nom. Le *name mangling* évite les collisions, il ne
protège pas vraiment.
:::
::::

::::exercice[Une propriété protégée]{niveau=2}
Complète la classe `Rectangle` : `largeur` et `hauteur` sont des propriétés qui refusent (avec `ValueError`) une valeur négative ou
nulle ; `aire` est une propriété en lecture seule.

```python depart
class Rectangle:
    def __init__(self, largeur, hauteur):
        self.largeur = largeur
        self.hauteur = hauteur

    # à compléter : propriétés largeur, hauteur (avec setters) et aire
```

```python tests
r = Rectangle(3, 4)
assert r.aire == 12, "aire"
r.largeur = 5
assert r.aire == 20, "modification de la largeur"
for mauvais in (0, -2):
    try:
        r.hauteur = mauvais
        ok = False
    except ValueError:
        ok = True
    assert ok, "hauteur refusée"
try:
    Rectangle(-1, 2)
    ok = False
except ValueError:
    ok = True
assert ok, "construction refusée"
try:
    r.aire = 3
    ok = False
except AttributeError:
    ok = True
assert ok, "aire en lecture seule"
```

:::corrige
```python solution
class Rectangle:
    def __init__(self, largeur, hauteur):
        self.largeur = largeur
        self.hauteur = hauteur

    @property
    def largeur(self):
        return self._largeur

    @largeur.setter
    def largeur(self, v):
        if v <= 0:
            raise ValueError("largeur strictement positive")
        self._largeur = v

    @property
    def hauteur(self):
        return self._hauteur

    @hauteur.setter
    def hauteur(self, v):
        if v <= 0:
            raise ValueError("hauteur strictement positive")
        self._hauteur = v

    @property
    def aire(self):
        return self._largeur * self._hauteur
```
Le constructeur passe par les mutateurs (`self.largeur = …`) : la vérification est faite aussi à la création. `aire` n'a pas de
`setter`, d'où l'`AttributeError` en cas d'affectation.
:::
::::

::::exercice[File à deux piles]{niveau=3}
Implémente une file (premier entré, premier sorti) avec **deux listes utilisées comme des piles** : on empile dans `_entree` ;
pour défiler, si `_sortie` est vide, on y transfère tous les éléments de `_entree` (ce qui inverse leur ordre), puis on dépile
`_sortie`. Interface : `est_vide()`, `enfiler(x)`, `defiler()` (lève `IndexError` si la file est vide), `__len__`.

```python depart
class File:
    def __init__(self):
        self._entree = []
        self._sortie = []

    def est_vide(self):
        ...

    def enfiler(self, x):
        ...

    def defiler(self):
        ...

    def __len__(self):
        ...
```

```python tests
f = File()
assert f.est_vide() and len(f) == 0, "file vide"
for x in [1, 2, 3]:
    f.enfiler(x)
assert f.defiler() == 1 and len(f) == 2, "premier sorti"
f.enfiler(4)
assert [f.defiler() for _ in range(3)] == [2, 3, 4], "ordre FIFO conservé"
try:
    f.defiler()
    ok = False
except IndexError:
    ok = True
assert ok, "défiler une file vide"
```

:::corrige
```python solution
class File:
    def __init__(self):
        self._entree = []
        self._sortie = []

    def est_vide(self):
        return not self._entree and not self._sortie

    def enfiler(self, x):
        self._entree.append(x)

    def defiler(self):
        if not self._sortie:
            while self._entree:
                self._sortie.append(self._entree.pop())
        if not self._sortie:
            raise IndexError("file vide")
        return self._sortie.pop()

    def __len__(self):
        return len(self._entree) + len(self._sortie)
```
Chaque élément est empilé deux fois et dépilé deux fois au plus : sur une suite de $n$ opérations, le coût total est $O(n)$, soit
$O(1)$ **amorti** par opération. L'utilisateur ne voit qu'une file : l'encapsulation cache les deux piles.
:::
::::

::::exercice[Justifier l'encapsulation]{niveau=4 duree=20}
Un élève de terminale a écrit une classe `Date` avec trois attributs publics `jour`, `mois`, `annee`, et un camarade utilise
`d.jour += 1` pour passer au lendemain.

1. Montrez sur un exemple précis pourquoi ce code est dangereux.
2. Proposez une interface encapsulée pour `Date` (méthodes et propriétés, sans écrire tout le code), en précisant l'invariant.
3. Le professeur décide ensuite de stocker une date comme le nombre de jours depuis le 1er janvier 1970. Expliquez pourquoi,
   avec votre interface, le code du camarade n'a pas à changer.
4. En tant qu'enseignant, quelle activité proposeriez-vous pour faire **ressentir** aux élèves l'intérêt de l'encapsulation ?

:::criteres
- Exemple concret d'invariant cassé (31 janvier + 1 → « 32 janvier », 29 février d'une année non bissextile…).
- Interface : constructeur qui vérifie la validité, propriétés en lecture `jour`, `mois`, `annee`, méthodes `lendemain()` ou `ajouter_jours(n)`, comparaison ; invariant « la date existe ».
- Explication : le camarade n'utilise que l'interface, l'implémentation interne peut changer.
- Activité pédagogique concrète (changement d'implémentation imposé, bug provoqué par un accès direct, travail en binôme interface / implémentation).
:::

:::corrige
1. Le 31 janvier 2027, `d.jour += 1` donne une « date » 32/01/2027, qui n'existe pas ; tout code qui suppose une date valide (calcul
   du jour de la semaine, affichage, comparaison) devient faux. L'invariant « la date existe » n'est protégé par rien.
2. Interface : `Date(jour, mois, annee)` qui lève `ValueError` si la date n'existe pas (mois 1-12, jour selon le mois, années
   bissextiles) ; propriétés **en lecture seule** `jour`, `mois`, `annee` ; méthodes `lendemain()` (renvoie une nouvelle date) ou
   `ajouter_jours(n)`, `jour_semaine()`, `__eq__`, `__lt__`, `__str__`. **Invariant** : l'objet représente toujours une date du
   calendrier grégorien. Pas de mutateur public : on crée une nouvelle date plutôt que de modifier un champ.
3. Le camarade écrit `d.lendemain()` et lit `d.jour` : ce sont des éléments de l'interface. Si l'on remplace les trois attributs par
   un entier `_jours_depuis_1970`, il suffit de réécrire les propriétés (qui recalculent jour/mois/année) et `lendemain` (qui ajoute
   1 au compteur) : la signature et le comportement sont inchangés, donc son code fonctionne sans modification.
4. Par exemple : faire écrire par une moitié de la classe un programme utilisant `Date` (version attributs publics), puis annoncer
   que l'implémentation change (compteur de jours) : les programmes qui accédaient directement aux attributs cassent, ceux qui
   passaient par l'interface marchent. Ou un « bug provoqué » : faire chercher pourquoi l'agenda affiche le 32 janvier. Une trace
   écrite fixe ensuite le vocabulaire interface / implémentation / invariant.
:::
::::
