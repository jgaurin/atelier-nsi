---
titre: Associations entre objets et composition
resume: Faire collaborer des objets qui se connaissent ou se contiennent, choisir entre association, agrégation et composition, et implémenter des structures récursives (listes chaînées, arbres) avec des classes.
duree: 65
objectifs:
  - Modéliser des objets qui en référencent d'autres (association, agrégation, composition)
  - Gérer les associations dans les deux sens et leurs multiplicités
  - Implémenter une structure récursive (maillon, nœud) avec une classe
  - Préférer la composition à l'héritage quand la relation est « a un »
prerequis: [objet/classes-objets, objet/encapsulation]
programme: [lp-poo, lp-uml, asd-lineaires, asd-arbres, nsit-structures]
cartes:
  - q: Association ?
    r: "Un lien entre deux classes dont les objets se connaissent (un attribut d'un objet référence un autre objet) : un élève **appartient à** une classe."
  - q: Agrégation ou composition ?
    r: "Agrégation : le tout regroupe des parties qui existent indépendamment (une playlist et ses morceaux). Composition : les parties n'existent pas sans le tout et sont créées/détruites avec lui (une maison et ses pièces)."
  - q: Multiplicité `0..*` ?
    r: "Zéro, un ou plusieurs objets liés. `1` : exactement un ; `0..1` : au plus un ; `1..*` : au moins un."
  - q: Comment implémenter une association « une classe contient plusieurs élèves » ?
    r: "Un attribut liste dans `Classe` (`self.eleves = []`) et, si on navigue dans l'autre sens, un attribut `classe` dans `Eleve` ; une méthode d'ajout met à jour les deux côtés."
  - q: Structure récursive en POO ?
    r: "Une classe dont un attribut est du même type (ou `None`) : `Maillon(valeur, suivant)`, `Noeud(valeur, gauche, droit)`."
  - q: « Préférer la composition à l'héritage » ?
    r: "Si B **a un** A (et n'**est** pas un A), B doit contenir un A en attribut plutôt qu'hériter de A : moins de couplage, interface maîtrisée."
---

Un objet seul est rarement utile : un élève appartient à une classe, une commande contient des lignes, un nœud d'arbre a des enfants.
Ces **liens entre objets** se représentent par des attributs qui **référencent** d'autres objets. Cette leçon montre comment les
modéliser (vocabulaire UML) et les implémenter proprement — y compris les structures récursives du programme de terminale.

## 1. Association : des objets qui se connaissent

```python exec
class Classe:
    def __init__(self, nom):
        self.nom = nom
        self.eleves = []                     # 0..* élèves

    def inscrire(self, eleve):
        if eleve.classe is not None:
            eleve.classe.eleves.remove(eleve)   # quitte l'ancienne classe
        self.eleves.append(eleve)
        eleve.classe = self                  # on met à jour les DEUX côtés

class Eleve:
    def __init__(self, nom):
        self.nom = nom
        self.classe = None                   # 0..1 classe

t1, t2 = Classe("TG1"), Classe("TG2")
lea = Eleve("Léa")
t1.inscrire(lea)
t2.inscrire(lea)
print(lea.classe.nom, [e.nom for e in t1.eleves], [e.nom for e in t2.eleves])
```

```mermaid legende="Association entre Classe et Eleve avec ses multiplicités"
classDiagram
  direction LR
  class Classe {
    +nom : str
    +inscrire(eleve: Eleve)
  }
  class Eleve {
    +nom : str
  }
  Classe "0..1" -- "0..*" Eleve : contient
```

:::definition
- Une **association** relie deux classes dont les objets se connaissent. Elle est **navigable** dans un sens ou les deux (qui
  référence qui).
- La **multiplicité** à chaque extrémité indique combien d'objets sont liés : `1`, `0..1`, `0..*` (ou `*`), `1..*`, `2..4`…
:::

:::attention
Une association **bidirectionnelle** est stockée deux fois (`classe.eleves` et `eleve.classe`) : une seule méthode doit la modifier
et mettre à jour les deux côtés, sinon les deux informations divergent. C'est encore une affaire d'invariant et d'encapsulation.
:::

## 2. Agrégation et composition

Deux cas particuliers d'association de type « tout / partie » :

| Relation      | Sens                                                         | UML              | Exemple                       |
|---------------|--------------------------------------------------------------|------------------|-------------------------------|
| agrégation    | le tout **regroupe** des parties qui vivent sans lui          | losange **vide** | playlist ◇— morceaux          |
| composition   | les parties **appartiennent** au tout, créées et détruites avec lui | losange **plein** | facture ◆— lignes de facture |

```mermaid legende="Agrégation (losange vide) et composition (losange plein)"
classDiagram
  Playlist o-- "0..*" Morceau
  Facture *-- "1..*" Ligne
  class Playlist {
    +nom : str
  }
  class Morceau {
    +titre : str
  }
  class Facture {
    +numero : int
    +total() float
  }
  class Ligne {
    +produit : str
    +quantite : int
    +prix : float
  }
```

En code, la différence se voit **à la création** : dans une composition, c'est le tout qui crée ses parties (et personne d'autre
ne les référence) ; dans une agrégation, les parties sont créées ailleurs et passées au tout.

```python exec
class Ligne:
    def __init__(self, produit, quantite, prix):
        self.produit, self.quantite, self.prix = produit, quantite, prix
    def montant(self):
        return self.quantite * self.prix

class Facture:
    def __init__(self, numero):
        self.numero = numero
        self._lignes = []                       # composition : créées par la facture
    def ajouter(self, produit, quantite, prix):
        self._lignes.append(Ligne(produit, quantite, prix))
    def total(self):
        return sum(l.montant() for l in self._lignes)

f = Facture(42)
f.ajouter("clé USB", 3, 8.5)
f.ajouter("câble", 2, 4.0)
print(f.total())
```

## 3. Composition plutôt qu'héritage

Une classe peut réutiliser une autre de deux façons : **contenir** un objet (composition, relation « **a un** ») ou en **hériter**
(relation « **est un** », leçon suivante). Une pile *a* une liste pour stocker ses éléments ; elle n'*est* pas une liste — sinon elle
hériterait de `insert`, `sort`, `__getitem__`… qui permettent de contourner la discipline LIFO.

```python exec
class Pile:
    def __init__(self):
        self._contenu = []            # composition : la pile A UNE liste
    def empiler(self, x):
        self._contenu.append(x)
    def depiler(self):
        return self._contenu.pop()
    def est_vide(self):
        return not self._contenu

p = Pile()
p.empiler(1); p.empiler(2)
print(p.depiler(), hasattr(p, "insert"))   # l'interface ne propose que les opérations de pile
```

## 4. Structures récursives : maillons et nœuds

Un objet peut référencer un objet **de sa propre classe**. C'est ainsi qu'on implémente en POO les listes chaînées et les arbres :

```python exec
class Noeud:
    def __init__(self, valeur, gauche=None, droit=None):
        self.valeur = valeur
        self.gauche = gauche          # un Noeud ou None
        self.droit = droit

def taille(n):
    return 0 if n is None else 1 + taille(n.gauche) + taille(n.droit)

def hauteur(n):
    return 0 if n is None else 1 + max(hauteur(n.gauche), hauteur(n.droit))

#        8
#      /   \
#     3     10
#    / \      \
#   1   6      14
arbre = Noeud(8, Noeud(3, Noeud(1), Noeud(6)), Noeud(10, None, Noeud(14)))
print(taille(arbre), hauteur(arbre))
```

```mermaid legende="Association réflexive : un nœud a 0, 1 ou 2 enfants qui sont des nœuds"
classDiagram
  class Noeud {
    +valeur
  }
  Noeud --> "0..1" Noeud : gauche
  Noeud --> "0..1" Noeud : droit
```

On distingue souvent deux classes : `Noeud` (la cellule) et `Arbre` (ou `Liste`) qui **encapsule** la racine et offre l'interface
(`taille()`, `inserer(x)`…) — l'arbre vide est alors un objet `Arbre` dont la racine vaut `None`, ce qui évite de manipuler `None`
dans le code utilisateur.

:::prof
Le programme de terminale demande d'implémenter les listes, piles, files et arbres « à l'aide de la POO ». Deux choix sont
classiques : arbre vide = `None` (fonctions externes récursives, comme ci-dessus) ou une classe enveloppe. Il faut savoir justifier
le sien et rester cohérent ; les sujets de bac utilisent souvent `None`. Faire dessiner les objets et leurs références (diagramme
d'objets) aide les élèves à comprendre le chaînage.
:::

## Exemple guidé

**Problème.** Une médiathèque : des **adhérents** empruntent des **livres** (au plus 3 à la fois) ; un livre est emprunté par au plus
un adhérent. Modéliser puis implémenter `emprunter` et `rendre` en garantissant la cohérence.

**1. Modéliser.** Association `Adherent "0..1" -- "0..3" Livre : emprunte`, navigable dans les deux sens (on veut la liste des
emprunts d'un adhérent et l'emprunteur d'un livre). Ce n'est **ni** une composition (le livre existe sans l'adhérent) **ni** un
héritage.

**2. Implémenter les deux côtés dans une seule méthode** :

```python exec
class Livre:
    def __init__(self, titre):
        self.titre = titre
        self.emprunteur = None

class Adherent:
    MAX = 3

    def __init__(self, nom):
        self.nom = nom
        self.emprunts = []

    def emprunter(self, livre):
        if livre.emprunteur is not None:
            raise ValueError(f"{livre.titre} est déjà emprunté")
        if len(self.emprunts) >= Adherent.MAX:
            raise ValueError("3 emprunts maximum")
        self.emprunts.append(livre)
        livre.emprunteur = self

    def rendre(self, livre):
        if livre.emprunteur is not self:
            raise ValueError("ce livre n'est pas emprunté par cet adhérent")
        self.emprunts.remove(livre)
        livre.emprunteur = None

ines = Adherent("Inès")
dune = Livre("Dune")
ines.emprunter(dune)
print(dune.emprunteur.nom, [l.titre for l in ines.emprunts])
ines.rendre(dune)
print(dune.emprunteur, ines.emprunts)
```

**3. Vérifier l'invariant.** « `livre in a.emprunts` ⇔ `livre.emprunteur is a` » : `emprunter` et `rendre` modifient toujours les deux
côtés ensemble, et vérifient leurs préconditions avant de modifier quoi que ce soit.

## L'essentiel

- Une **association** = des objets qui se référencent ; multiplicités `1`, `0..1`, `0..*`, `1..*` ; navigabilité.
- Une association bidirectionnelle est stockée des deux côtés : une seule méthode la met à jour (invariant de cohérence).
- **Agrégation** (losange vide) : parties indépendantes du tout ; **composition** (losange plein) : parties créées et détruites avec le tout.
- « **a un** » → composition (attribut) ; « **est un** » → héritage. Préférer la composition quand on hésite.
- Structures récursives : une classe dont les attributs référencent des objets de la même classe (`Maillon`, `Noeud`), `None` pour l'absence.

## Exercices

::::exercice[Quelle relation ?]{niveau=1}
Une voiture possède quatre roues ; un garage accueille des voitures qui existent sans lui. Quelles relations UML choisir ?

- [ ] héritage pour les deux
- [x] composition voiture–roues, agrégation garage–voitures
- [ ] agrégation voiture–roues, composition garage–voitures
- [ ] association simple dans les deux cas, sans distinction possible

:::corrige
Les roues font partie de la voiture (dans ce modèle, elles sont créées et détruites avec elle) : composition. Les voitures existent
indépendamment du garage : agrégation. Aucune relation « est un » ici : pas d'héritage.
:::
::::

::::exercice[Lire une multiplicité]{niveau=1}
Sur le diagramme `Professeur "1" -- "1..*" Cours : enseigne`, que signifie la multiplicité `1..*` ?

- [ ] un cours est enseigné par un ou plusieurs professeurs
- [x] un professeur enseigne au moins un cours
- [ ] un professeur enseigne exactement un cours
- [ ] un cours peut n'avoir aucun professeur

:::corrige
La multiplicité se lit à l'extrémité opposée : un professeur est lié à **1..*** cours (au moins un). Le `1` côté `Professeur` dit que
chaque cours a exactement un professeur.
:::
::::

::::exercice[Une liste chaînée en POO]{niveau=2}
Complète la classe `Liste` (qui encapsule le premier `Maillon`) : `ajouter_debut(x)`, `__len__`, `__contains__(x)` (pour
`x in liste`) et `vers_liste()` qui renvoie une liste Python des valeurs dans l'ordre.

```python depart
class Maillon:
    def __init__(self, valeur, suivant=None):
        self.valeur = valeur
        self.suivant = suivant

class Liste:
    def __init__(self):
        self._tete = None

    def ajouter_debut(self, x):
        ...

    def __len__(self):
        ...

    def __contains__(self, x):
        ...

    def vers_liste(self):
        ...
```

```python tests
l = Liste()
assert len(l) == 0 and l.vers_liste() == [], "liste vide"
for x in [3, 2, 1]:
    l.ajouter_debut(x)
assert l.vers_liste() == [1, 2, 3], "ordre"
assert len(l) == 3, "longueur"
assert 2 in l and 5 not in l, "appartenance"
```

:::corrige
```python solution
class Maillon:
    def __init__(self, valeur, suivant=None):
        self.valeur = valeur
        self.suivant = suivant

class Liste:
    def __init__(self):
        self._tete = None

    def ajouter_debut(self, x):
        self._tete = Maillon(x, self._tete)

    def __len__(self):
        n, m = 0, self._tete
        while m is not None:
            n, m = n + 1, m.suivant
        return n

    def __contains__(self, x):
        m = self._tete
        while m is not None:
            if m.valeur == x:
                return True
            m = m.suivant
        return False

    def vers_liste(self):
        valeurs, m = [], self._tete
        while m is not None:
            valeurs.append(m.valeur)
            m = m.suivant
        return valeurs
```
La classe `Liste` compose des maillons (elle les crée et elle seule les manipule) : l'utilisateur ne voit jamais `Maillon`.
:::
::::

::::exercice[Un arbre binaire de recherche]{niveau=3}
Complète la classe `ABR` : `inserer(x)` (sans doublon), `contient(x)` et `en_ordre()` qui renvoie la liste triée des valeurs
(parcours infixe). Utilise la classe `Noeud` fournie ; l'arbre vide a une racine `None`.

```python depart
class Noeud:
    def __init__(self, valeur):
        self.valeur = valeur
        self.gauche = None
        self.droit = None

class ABR:
    def __init__(self):
        self.racine = None

    def inserer(self, x):
        ...

    def contient(self, x):
        ...

    def en_ordre(self):
        ...
```

```python tests
a = ABR()
assert a.en_ordre() == [] and not a.contient(3), "arbre vide"
for x in [8, 3, 10, 1, 6, 14, 6]:
    a.inserer(x)
assert a.en_ordre() == [1, 3, 6, 8, 10, 14], "parcours infixe trié, sans doublon"
assert a.contient(6) and not a.contient(7), "recherche"
assert a.racine.valeur == 8 and a.racine.gauche.droit.valeur == 6, "forme de l'arbre"
```

:::corrige
```python solution
class Noeud:
    def __init__(self, valeur):
        self.valeur = valeur
        self.gauche = None
        self.droit = None

class ABR:
    def __init__(self):
        self.racine = None

    def inserer(self, x):
        if self.racine is None:
            self.racine = Noeud(x)
            return
        n = self.racine
        while True:
            if x == n.valeur:
                return
            cote = "gauche" if x < n.valeur else "droit"
            enfant = getattr(n, cote)
            if enfant is None:
                setattr(n, cote, Noeud(x))
                return
            n = enfant

    def contient(self, x):
        n = self.racine
        while n is not None:
            if x == n.valeur:
                return True
            n = n.gauche if x < n.valeur else n.droit
        return False

    def en_ordre(self):
        resultat = []
        def parcours(n):
            if n is not None:
                parcours(n.gauche)
                resultat.append(n.valeur)
                parcours(n.droit)
        parcours(self.racine)
        return resultat
```
Une version plus scolaire de `inserer` écrit les deux branches (`if x < n.valeur: … else: …`) au lieu de `getattr`/`setattr`. Le
coût de `inserer` et `contient` est proportionnel à la hauteur de l'arbre.
:::
::::

::::exercice[Modéliser un réseau social scolaire]{niveau=4 duree=25}
Un ENT propose des **groupes** de discussion. Un **utilisateur** (élève ou professeur) peut être membre de plusieurs groupes ; un
groupe a exactement un **créateur** et des membres ; un groupe contient des **messages**, chacun écrit par un utilisateur, qui
disparaissent si le groupe est supprimé.

1. Donnez le diagramme de classes UML (classes, attributs principaux, associations, multiplicités, agrégation / composition).
2. Écrivez en Python la méthode `Groupe.ajouter_membre(u)` et la méthode `Groupe.publier(auteur, texte)`, en précisant les
   préconditions vérifiées.
3. Justifiez le choix entre agrégation et composition pour les deux relations du groupe (membres, messages).

:::criteres
- Classes `Utilisateur`, `Groupe`, `Message` ; association membres `0..*`–`0..*` ; créateur `1` ; messages en composition (losange plein côté `Groupe`) ; auteur d'un message `1`.
- `ajouter_membre` met à jour les deux côtés et refuse les doublons ; `publier` vérifie que l'auteur est membre et crée le `Message` dans le groupe.
- Justification : un utilisateur existe sans le groupe (agrégation / association) ; un message n'a pas de sens sans son groupe et disparaît avec lui (composition).
:::

:::corrige
1. ```mermaid
   classDiagram
     class Utilisateur {
       +pseudo : str
       +groupes : list
     }
     class Groupe {
       +nom : str
       +ajouter_membre(u)
       +publier(auteur, texte)
     }
     class Message {
       +texte : str
       +date : str
     }
     Groupe "0..*" o-- "1..*" Utilisateur : membres
     Groupe "0..*" --> "1" Utilisateur : créateur
     Groupe *-- "0..*" Message
     Message "0..*" --> "1" Utilisateur : auteur
   ```
   (Le créateur fait partie des membres, d'où `1..*` membres.)
2. ```python
   class Groupe:
       def __init__(self, nom, createur):
           self.nom = nom
           self.createur = createur
           self.membres = []
           self._messages = []
           self.ajouter_membre(createur)

       def ajouter_membre(self, u):
           if u in self.membres:
               raise ValueError("déjà membre")
           self.membres.append(u)
           u.groupes.append(self)        # les deux côtés

       def publier(self, auteur, texte):
           if auteur not in self.membres:
               raise PermissionError("seuls les membres peuvent publier")
           if not texte.strip():
               raise ValueError("message vide")
           self._messages.append(Message(auteur, texte))   # créé PAR le groupe
   ```
3. Les utilisateurs existent avant le groupe et lui survivent, et ils appartiennent à plusieurs groupes : c'est une agrégation (ou
   une simple association). Les messages sont créés par le groupe (`publier`), n'appartiennent qu'à lui et sont supprimés avec lui :
   composition.
:::
::::
