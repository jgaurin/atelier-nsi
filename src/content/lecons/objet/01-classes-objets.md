---
titre: Classes, objets et méthodes
resume: Regrouper des données et les opérations qui les manipulent dans une classe, créer des objets, écrire des méthodes et des méthodes spéciales en Python.
duree: 70
objectifs:
  - Définir une classe avec un constructeur, des attributs d'instance et des méthodes
  - Créer des objets, appeler leurs méthodes et expliquer le rôle de `self`
  - Distinguer attribut d'instance et attribut de classe
  - Écrire des méthodes spéciales (`__str__`, `__repr__`, `__eq__`, `__lt__`) et représenter une classe en UML
prerequis: [python/fonctions, python/references]
programme: [lp-poo, nsit-structures, nsit-langages]
cartes:
  - q: Classe ou objet ?
    r: "Une **classe** est un modèle (un type) qui décrit des attributs et des méthodes ; un **objet** (ou instance) est un exemplaire concret créé à partir de ce modèle."
  - q: Rôle de `__init__` ?
    r: "C'est le constructeur : il est appelé à la création de l'objet (`Point(3, 4)`) et initialise ses attributs."
  - q: Que désigne `self` ?
    r: "L'objet sur lequel la méthode est appelée : `p.distance()` exécute `Point.distance(p)`, et `self` vaut `p`."
  - q: Attribut d'instance ou attribut de classe ?
    r: "Un attribut d'instance (`self.x`) est propre à chaque objet ; un attribut de classe (défini dans le corps de la classe) est partagé par toutes les instances."
  - q: À quoi sert `__str__` ? `__eq__` ? `__lt__` ?
    r: "`__str__` : le texte affiché par `print` ; `__eq__` : le sens de `==` ; `__lt__` : le sens de `<` (et donc le tri)."
  - q: Que se passe-t-il avec `b = a` quand `a` est un objet ?
    r: "`b` et `a` désignent le **même** objet : modifier un attribut via `b` le modifie pour `a`."
  - q: Les trois caractéristiques d'un objet ?
    r: "Son **état** (valeurs des attributs), son **comportement** (ses méthodes) et son **identité** (c'est un objet distinct des autres, même à état égal)."
---

Un point du plan, c'est deux coordonnées ; un compte bancaire, un titulaire et un solde ; une fraction, un numérateur et un
dénominateur. Jusqu'ici, on représentait ces données par des tuples ou des dictionnaires, et les fonctions qui les manipulent
étaient séparées. La **programmation orientée objet** (POO) regroupe dans une même entité les **données** et les **opérations**
qui ont du sens sur elles. C'est un paradigme au programme de terminale NSI, et le concours exige de connaître ses notions
(classe, encapsulation, composition, héritage, interface…) en Python et en Java.

## 1. Une classe, des objets

```python exec
class Point:
    """Un point du plan."""

    def __init__(self, x, y):      # le constructeur
        self.x = x                 # attributs d'instance
        self.y = y

    def distance_origine(self):    # une méthode
        return (self.x ** 2 + self.y ** 2) ** 0.5

    def translater(self, dx, dy):
        self.x += dx
        self.y += dy

a = Point(3, 4)                    # création d'un objet (une instance)
b = Point(-1, 2)
print(a.x, a.y, a.distance_origine())
a.translater(1, 1)
print(a.x, a.y, b.x, b.y)
```

:::definition
- Une **classe** est un modèle qui décrit des **attributs** (les données) et des **méthodes** (les opérations).
- Un **objet** (ou **instance**) est un exemplaire créé à partir de la classe : `Point(3, 4)`. Chaque objet a son propre **état**
  (les valeurs de ses attributs), un **comportement** (les méthodes de sa classe) et une **identité**.
- Le **constructeur** `__init__` est appelé automatiquement à la création ; il initialise les attributs.
:::

### Le rôle de `self`

Une méthode est une fonction définie dans la classe, dont le premier paramètre, `self`, désigne **l'objet sur lequel on
l'appelle**. L'écriture `a.translater(1, 1)` est un raccourci pour `Point.translater(a, 1, 1)` : `self` vaut `a`. C'est grâce à
`self` que la méthode accède aux attributs **de cet objet-là**.

```mermaid legende="Diagramme de classe UML de Point : nom, attributs, méthodes"
classDiagram
  class Point {
    +x : float
    +y : float
    +Point(x, y)
    +distance_origine() float
    +translater(dx, dy)
  }
```

## 2. Attributs d'instance et attributs de classe

Un attribut défini **dans le corps de la classe** (et non via `self`) est un **attribut de classe**, partagé par toutes les
instances — utile pour une constante ou un compteur commun :

```python exec
class Eleve:
    effectif = 0                       # attribut de classe : partagé

    def __init__(self, nom):
        self.nom = nom                 # attribut d'instance : propre à chaque objet
        self.notes = []
        Eleve.effectif += 1

    def ajouter_note(self, n):
        self.notes.append(n)

    def moyenne(self):
        return sum(self.notes) / len(self.notes) if self.notes else None

lea, hugo = Eleve("Léa"), Eleve("Hugo")
lea.ajouter_note(14); lea.ajouter_note(17)
print(lea.moyenne(), hugo.moyenne(), Eleve.effectif)
```

:::attention
Un attribut **mutable** (une liste) doit être créé **dans `__init__`** : s'il était défini comme attribut de classe
(`notes = []` dans le corps de la classe), **tous** les élèves partageraient la même liste de notes.
:::

## 3. Les méthodes spéciales

Python appelle automatiquement certaines méthodes aux noms entourés de doubles soulignés :

| Méthode                 | Appelée par                       |
|-------------------------|-----------------------------------|
| `__init__(self, …)`     | la création `Classe(…)`           |
| `__str__(self)`         | `print(obj)`, `str(obj)` (affichage pour l'utilisateur) |
| `__repr__(self)`        | la console, les listes affichées (représentation pour le développeur) |
| `__eq__(self, autre)`   | `obj == autre`                    |
| `__lt__(self, autre)`   | `obj < autre` (et donc `sorted`)  |
| `__add__(self, autre)`  | `obj + autre`                     |
| `__len__(self)`         | `len(obj)`                        |

```python exec
class Point:
    def __init__(self, x, y):
        self.x, self.y = x, y

    def __repr__(self):
        return f"Point({self.x}, {self.y})"

    def __eq__(self, autre):
        return isinstance(autre, Point) and (self.x, self.y) == (autre.x, autre.y)

    def __add__(self, autre):
        return Point(self.x + autre.x, self.y + autre.y)

a, b = Point(1, 2), Point(1, 2)
print(a == b, a is b, a + b, [a, Point(0, 0)])
```

Sans `__eq__`, `a == b` comparerait les **identités** (comme `is`) et vaudrait `False` : deux objets distincts, même de même
état, sont différents par défaut.

## 4. Objets et références

Comme les listes, les objets sont manipulés par **références** : `b = a` ne copie pas l'objet, et une méthode qui modifie un
objet reçu en paramètre modifie l'objet de l'appelant (leçon « Références »).

```python exec
class Compteur:
    def __init__(self):
        self.valeur = 0
    def incrementer(self):
        self.valeur += 1

c1 = Compteur()
c2 = c1                 # même objet
c2.incrementer()
print(c1.valeur)        # 1
```

:::prof
Le programme de terminale demande d'« écrire la définition d'une classe », d'« accéder aux attributs et méthodes d'une classe » ;
la POO y est aussi un outil pour implémenter des structures de données (pile, file, arbre). Les obstacles classiques : le rôle de
`self` (le faire expliciter avec `Point.translater(a, 1, 1)`), l'oubli de `self.` devant un attribut (création d'une variable locale),
et la confusion classe / objet (« la classe Voiture » contre « ma voiture »).
:::

## Exemple guidé

**Problème.** Écrire une classe `Fraction` qui représente un rationnel $\frac{n}{d}$ sous forme **irréductible** avec un dénominateur
**positif**, avec l'addition, la multiplication, l'égalité et l'affichage.

**1. Choisir l'état et son invariant.** Attributs `num` et `den`, avec l'**invariant** : `den > 0` et `pgcd(num, den) == 1`. Le
constructeur le **établit** ; chaque opération crée une nouvelle fraction via le constructeur, qui le rétablit.

```python exec
from math import gcd

class Fraction:
    def __init__(self, num, den=1):
        if den == 0:
            raise ZeroDivisionError("dénominateur nul")
        if den < 0:
            num, den = -num, -den
        g = gcd(num, den)
        self.num, self.den = num // g, den // g

    def __add__(self, autre):
        return Fraction(self.num * autre.den + autre.num * self.den, self.den * autre.den)

    def __mul__(self, autre):
        return Fraction(self.num * autre.num, self.den * autre.den)

    def __eq__(self, autre):
        return (self.num, self.den) == (autre.num, autre.den)   # grâce à l'invariant

    def __repr__(self):
        return f"{self.num}/{self.den}" if self.den != 1 else str(self.num)

print(Fraction(1, 2) + Fraction(1, 3), Fraction(2, -4), Fraction(3, 4) * Fraction(8, 3))
print(Fraction(1, 2) + Fraction(1, 2) == Fraction(1), Fraction(6, 8) == Fraction(3, 4))
```

**2. Pourquoi l'invariant simplifie tout.** Comme toute fraction est stockée sous forme irréductible avec un dénominateur positif,
deux fractions égales ont **exactement** les mêmes attributs : `__eq__` se contente de les comparer. Sans l'invariant, il faudrait
comparer $a \times d$ et $b \times c$.

**3. Tester.** $\frac12 + \frac13 = \frac56$ ; $\frac{2}{-4} = -\frac12$ ; $\frac34 \times \frac83 = 2$. Cas limite : un dénominateur
nul lève une exception dès la création. (Python fournit le module `fractions.Fraction`, qui fait la même chose.)

## L'essentiel

- Classe = modèle (attributs + méthodes) ; objet = instance avec un état, un comportement, une identité.
- `__init__` construit l'objet ; `self` désigne l'objet sur lequel la méthode est appelée (`a.m(x)` ≡ `Classe.m(a, x)`).
- Attributs d'instance (`self.x`, dans `__init__`) / attributs de classe (partagés) ; jamais d'attribut de classe mutable par erreur.
- Méthodes spéciales : `__str__`, `__repr__`, `__eq__`, `__lt__`, `__add__`, `__len__`.
- Les objets sont manipulés par références ; sans `__eq__`, `==` compare les identités.
- Un **invariant** de classe, établi par le constructeur et préservé par les méthodes, garantit la cohérence de l'état.

## Exercices

::::exercice[Classe ou objet]{niveau=1}
Dans `p = Point(3, 4)`, que sont `Point` et `p` ?

- [ ] `Point` est un objet et `p` une classe
- [x] `Point` est une classe et `p` une instance de cette classe
- [ ] ce sont deux classes
- [ ] `p` est une méthode de `Point`

:::corrige
`Point` est la classe (le modèle) ; l'appel `Point(3, 4)` crée une **instance**, désignée par `p`.
:::
::::

::::exercice[Oubli de self]{niveau=1}
Qu'affiche ce programme ?

```python
class Boite:
    def __init__(self, contenu):
        contenu = contenu
    def lire(self):
        return self.contenu

print(Boite(5).lire())
```

- [ ] `5`
- [ ] `None`
- [x] une erreur `AttributeError`
- [ ] `contenu`

:::corrige
`contenu = contenu` affecte une variable **locale** au constructeur ; l'objet n'a pas d'attribut `contenu`. `self.contenu` dans `lire`
lève `AttributeError`. Il fallait écrire `self.contenu = contenu`.
:::
::::

::::exercice[Un compte bancaire]{niveau=2}
Écris une classe `Compte` : le constructeur reçoit un titulaire (solde initial 0) ; `deposer(montant)` ajoute un montant
strictement positif ; `retirer(montant)` retire un montant strictement positif inférieur ou égal au solde. Dans les deux cas, un
montant invalide lève `ValueError`. Ajoute un attribut `solde`.

```python depart
class Compte:
    def __init__(self, titulaire):
        ...

    def deposer(self, montant):
        ...

    def retirer(self, montant):
        ...
```

```python tests
c = Compte("Léa")
assert c.titulaire == "Léa" and c.solde == 0, "création"
c.deposer(100); c.retirer(30)
assert c.solde == 70, "dépôt puis retrait"
for operation, montant in [(c.retirer, 100), (c.deposer, -5), (c.retirer, 0)]:
    try:
        operation(montant)
        ok = False
    except ValueError:
        ok = True
    assert ok, "opération invalide refusée"
assert c.solde == 70, "le solde n'a pas changé après les refus"
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
```
Invariant : `solde >= 0`. Les méthodes vérifient leurs préconditions **avant** de modifier l'état : un refus laisse l'objet intact.
:::
::::

::::exercice[Comparer et trier des objets]{niveau=2}
Complète la classe `Eleve` pour que `print` affiche `"Léa (15.5)"`, que deux élèves soient égaux s'ils ont le même nom et la même
moyenne, et que `sorted` les classe par moyenne **décroissante** (puis par nom croissant).

```python depart
class Eleve:
    def __init__(self, nom, moyenne):
        self.nom = nom
        self.moyenne = moyenne

    def __str__(self):
        ...

    def __eq__(self, autre):
        ...

    def __lt__(self, autre):
        ...
```

```python tests
a, b, c = Eleve("Léa", 15.5), Eleve("Hugo", 12), Eleve("Inès", 15.5)
assert str(a) == "Léa (15.5)", "affichage"
assert a == Eleve("Léa", 15.5) and not (a == c), "égalité"
assert [e.nom for e in sorted([b, a, c])] == ["Inès", "Léa", "Hugo"], "tri par moyenne décroissante puis nom"
```

:::corrige
```python solution
class Eleve:
    def __init__(self, nom, moyenne):
        self.nom = nom
        self.moyenne = moyenne

    def __str__(self):
        return f"{self.nom} ({self.moyenne})"

    def __eq__(self, autre):
        return (self.nom, self.moyenne) == (autre.nom, autre.moyenne)

    def __lt__(self, autre):
        return (-self.moyenne, self.nom) < (-autre.moyenne, autre.nom)
```
`sorted` n'utilise que `<` : définir « être avant » comme « meilleure moyenne, ou même moyenne et nom avant » suffit.
:::
::::

::::exercice[Une classe Duree]{niveau=3}
Écris une classe `Duree` (heures, minutes, secondes) qui respecte l'invariant `0 <= minutes < 60` et `0 <= secondes < 60`, quel que
soit ce qu'on passe au constructeur (on accepte `Duree(0, 0, 3725)` qui devient 1 h 2 min 5 s). Ajoute `en_secondes()`, l'addition
`+` et l'affichage `"1 h 02 min 05 s"`.

```python depart
class Duree:
    def __init__(self, h=0, m=0, s=0):
        ...

    def en_secondes(self):
        ...

    def __add__(self, autre):
        ...

    def __str__(self):
        ...
```

```python tests
d = Duree(0, 0, 3725)
assert (d.h, d.m, d.s) == (1, 2, 5), "normalisation"
assert d.en_secondes() == 3725, "conversion"
assert str(Duree(1, 59, 59) + Duree(0, 0, 1)) == "2 h 00 min 00 s", "addition avec retenues"
assert str(Duree(0, 125)) == "2 h 05 min 00 s", "minutes en trop"
```

:::corrige
```python solution
class Duree:
    def __init__(self, h=0, m=0, s=0):
        total = h * 3600 + m * 60 + s
        self.h, reste = divmod(total, 3600)
        self.m, self.s = divmod(reste, 60)

    def en_secondes(self):
        return self.h * 3600 + self.m * 60 + self.s

    def __add__(self, autre):
        return Duree(0, 0, self.en_secondes() + autre.en_secondes())

    def __str__(self):
        return f"{self.h} h {self.m:02d} min {self.s:02d} s"
```
Le constructeur **normalise** toujours (il passe par le total en secondes) : l'invariant est garanti pour tout objet, et
l'addition n'a qu'à construire une nouvelle durée. `divmod(a, b)` renvoie `(a // b, a % b)`.
:::
::::

::::exercice[Concevoir une classe]{niveau=4 duree=25}
On veut représenter un **intervalle** de nombres réels $[a, b]$ (fermé, avec $a \le b$), pour un logiciel de réservation de créneaux.

1. Propose les attributs, l'invariant de la classe et la réaction du constructeur si $a > b$.
2. Écris la classe `Intervalle` avec : `longueur()`, `contient(x)`, `chevauche(autre)` (les deux intervalles ont au moins un point
   commun), `intersection(autre)` (renvoie un intervalle ou `None`), `__eq__` et `__repr__`.
3. Donne le diagramme de classe UML.
4. Propose un jeu de tests pour `chevauche`, en justifiant les cas limites.

:::criteres
- Attributs `a` et `b` (ou `debut`, `fin`) ; invariant `a <= b` ; le constructeur lève `ValueError` si `a > b` (ou échange les bornes, choix justifié).
- `longueur = b - a` ; `contient(x)` : `a <= x <= b` ; `chevauche` : `self.a <= autre.b and autre.a <= self.b` ; `intersection` : `[max(a), min(b)]` si non vide, sinon `None`.
- `__eq__` compare les bornes ; `__repr__` lisible.
- Diagramme UML correct (nom, attributs typés, méthodes avec paramètres et types de retour).
- Tests : disjoints, imbriqués, partiellement superposés, identiques, se touchant en un point (chevauchement vrai pour des intervalles fermés), intervalle réduit à un point.
:::

:::corrige
1. Attributs `a` (début) et `b` (fin) ; **invariant** : `a <= b`. Si on reçoit $a > b$, le plus sûr est de lever `ValueError` (une
   erreur de l'appelant ne doit pas passer inaperçue) ; échanger silencieusement les bornes serait un autre choix, à documenter.
2. ```python
   class Intervalle:
       def __init__(self, a, b):
           if a > b:
               raise ValueError("intervalle vide : a > b")
           self.a, self.b = a, b

       def longueur(self):
           return self.b - self.a

       def contient(self, x):
           return self.a <= x <= self.b

       def chevauche(self, autre):
           return self.a <= autre.b and autre.a <= self.b

       def intersection(self, autre):
           if not self.chevauche(autre):
               return None
           return Intervalle(max(self.a, autre.a), min(self.b, autre.b))

       def __eq__(self, autre):
           return (self.a, self.b) == (autre.a, autre.b)

       def __repr__(self):
           return f"[{self.a}, {self.b}]"
   ```
   `chevauche` : deux intervalles **ne** se rencontrent **pas** si l'un finit avant que l'autre commence (`self.b < autre.a` ou
   `autre.b < self.a`) ; la négation (De Morgan) donne la condition écrite.
3. ```mermaid
   classDiagram
     class Intervalle {
       +a : float
       +b : float
       +Intervalle(a, b)
       +longueur() float
       +contient(x) bool
       +chevauche(autre: Intervalle) bool
       +intersection(autre: Intervalle) Intervalle
     }
   ```
4. Tests de `chevauche` : `[0, 2]` et `[3, 5]` → faux (disjoints) ; `[0, 10]` et `[2, 3]` → vrai (imbriqués) ; `[0, 4]` et `[3, 6]`
   → vrai (partiel) ; `[1, 2]` et `[1, 2]` → vrai (identiques) ; `[0, 3]` et `[3, 5]` → **vrai** (ils se touchent en 3 : cas limite qui
   vérifie le choix de `<=`, intervalles fermés) ; `[2, 2]` et `[0, 5]` → vrai (intervalle réduit à un point) ; et chaque test dans
   les deux sens (`a.chevauche(b)` et `b.chevauche(a)`), car la relation doit être symétrique.
:::
::::
