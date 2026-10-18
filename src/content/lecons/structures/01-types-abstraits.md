---
titre: Type abstrait et implémentation
resume: Décrire une structure de données par ses opérations (son interface) indépendamment de la façon de la programmer (son implémentation), et comparer plusieurs implémentations.
duree: 60
objectifs:
  - Définir un type abstrait de données par ses opérations et leur spécification
  - Distinguer interface et implémentation, et expliquer l'intérêt de les séparer
  - Proposer plusieurs implémentations d'un même type abstrait et comparer leurs coûts
  - Écrire du code « client » qui n'utilise que l'interface
prerequis: [python/tuples-dictionnaires, algo/complexite]
programme: [asd-types, nsit-structures, lp-poo]
cartes:
  - q: Qu'est-ce qu'un type abstrait de données (TAD) ?
    r: "Un type défini par l'ensemble de ses **opérations** et de leur **spécification** (ce qu'elles font), indépendamment de la façon dont les données sont représentées en mémoire."
  - q: Interface ou implémentation ?
    r: "L'**interface** est la liste des opérations et de leurs contrats (ce que voit l'utilisateur). L'**implémentation** est le code et la représentation choisis pour les réaliser."
  - q: Pourquoi séparer interface et implémentation ?
    r: "On peut changer d'implémentation (pour gagner en efficacité) sans modifier le code qui utilise le type ; on raisonne sur les opérations sans se soucier des détails."
  - q: "TAD Ensemble : quelles opérations ?"
    r: "Créer un ensemble vide, ajouter un élément, retirer un élément, tester l'appartenance, taille (et éventuellement union, intersection, parcours)."
  - q: Coût du test d'appartenance d'un ensemble implémenté par une liste non triée ? par une table de hachage ?
    r: "Linéaire ; constant en moyenne."
  - q: Comment spécifier une opération ?
    r: "Par sa signature (types des paramètres et du résultat), ses préconditions et ce qu'elle garantit (postcondition, axiomes reliant les opérations)."
---

Quand on utilise une liste Python, on écrit `t.append(x)` sans se demander comment Python range les éléments en mémoire.
Quand on utilise un dictionnaire, on écrit `d[cle]` sans savoir comment fonctionne la table de hachage. On utilise ces types
à travers leurs **opérations**, pas à travers leur **représentation**. Cette séparation est l'idée centrale de tout le
module : un **type abstrait** dit *ce qu'on peut faire* avec des données ; une **implémentation** dit *comment on le fait*.
Le programme du concours insiste explicitement sur cette « différence entre type de données abstrait et implémentation ».

## 1. Un type défini par ses opérations

:::definition
Un **type abstrait de données** (TAD) est défini par :
- un **nom** et les types qu'il utilise ;
- une liste d'**opérations**, avec leur **signature** (types des arguments et du résultat) ;
- leur **spécification** : préconditions et comportement (souvent sous forme de propriétés, ou **axiomes**, qui relient les opérations).

Il ne dit **rien** de la représentation des données en mémoire.
:::

Exemple : le TAD **Ensemble** d'éléments.

| Opération              | Signature                          | Spécification                                      |
|------------------------|------------------------------------|----------------------------------------------------|
| `ensemble_vide()`      | → Ensemble                         | renvoie un ensemble sans élément                    |
| `ajouter(e, x)`        | Ensemble × Élément → (rien)        | après l'appel, `x` appartient à `e`                 |
| `retirer(e, x)`        | Ensemble × Élément → (rien)        | après l'appel, `x` n'appartient pas à `e`           |
| `contient(e, x)`       | Ensemble × Élément → Booléen       | vrai si et seulement si `x` est dans `e`            |
| `taille(e)`            | Ensemble → Entier                  | nombre d'éléments distincts                         |

Quelques **axiomes** : `contient(ensemble_vide(), x)` est faux ; après `ajouter(e, x)`, `contient(e, x)` est vrai ;
ajouter deux fois le même élément ne change pas la taille.

## 2. Interface et implémentation

```mermaid legende="Le code client ne voit que l'interface ; l'implémentation peut changer sans qu'il le sache"
graph LR
  C["Code client<br/>(utilise ajouter, contient…)"] --> I["Interface du TAD<br/>ajouter · retirer · contient · taille"]
  I --> A["Implémentation 1<br/>liste Python"]
  I -.-> B["Implémentation 2<br/>dictionnaire / set"]
  I -.-> D["Implémentation 3<br/>tableau de booléens"]
```

L'**interface** est le « contrat » : la liste des opérations et leur spécification. L'**implémentation** choisit une
**représentation** (une liste, un dictionnaire, une liste chaînée…) et programme les opérations. Tant que l'implémentation
respecte le contrat, le code qui utilise le type (le code **client**) fonctionne sans changement.

## 3. Plusieurs implémentations d'un même TAD

**Implémentation 1 : une liste sans doublons.**

```python exec
def ensemble_vide():
    return []

def contient(e, x):
    return x in e                  # parcours : linéaire

def ajouter(e, x):
    if not contient(e, x):
        e.append(x)

def retirer(e, x):
    if contient(e, x):
        e.remove(x)

def taille(e):
    return len(e)

# Code client : n'utilise que l'interface
e = ensemble_vide()
for mot in "le chat et le chien et le lapin".split():
    ajouter(e, mot)
print(taille(e), contient(e, "chat"), contient(e, "loup"))
```

**Implémentation 2 : une table de hachage (ici un dictionnaire dont les valeurs ne servent pas).**

```python exec
def ensemble_vide():
    return {}

def contient(e, x):
    return x in e                  # constant en moyenne

def ajouter(e, x):
    e[x] = True

def retirer(e, x):
    e.pop(x, None)

def taille(e):
    return len(e)

e = ensemble_vide()
for mot in "le chat et le chien et le lapin".split():
    ajouter(e, mot)
print(taille(e), contient(e, "chat"), contient(e, "loup"))
```

Le code client est **identique** dans les deux cas ; seules les performances changent.

| Opération     | Liste sans doublons | Liste triée            | Table de hachage    | Tableau de booléens (entiers de 0 à N) |
|---------------|---------------------|------------------------|---------------------|-----------------------------|
| `contient`    | $\Theta(n)$         | $\Theta(\log n)$ (dichotomie) | $O(1)$ en moyenne | $O(1)$                     |
| `ajouter`     | $\Theta(n)$ (test)  | $\Theta(n)$ (décalage) | $O(1)$ en moyenne   | $O(1)$                      |
| `retirer`     | $\Theta(n)$         | $\Theta(n)$            | $O(1)$ en moyenne   | $O(1)$                      |
| mémoire       | $\Theta(n)$         | $\Theta(n)$            | $\Theta(n)$         | $\Theta(N)$, même si peu d'éléments |
| parcours trié | $\Theta(n \log n)$  | $\Theta(n)$            | $\Theta(n \log n)$  | $\Theta(N)$                 |

Aucune implémentation n'est la meilleure en tout : le choix dépend des opérations **les plus fréquentes** et des
contraintes (mémoire, besoin d'ordre, type des éléments).

## 4. Encapsuler l'implémentation

Avec des fonctions, rien n'empêche le client d'écrire `e.append(x)` directement et de casser l'invariant « pas de
doublons ». La **programmation objet** permet de regrouper la représentation et les opérations dans une **classe**, et
de signaler que la représentation est interne (en Python, par convention, un nom qui commence par `_`) :

```python exec
class Ensemble:
    def __init__(self):
        self._elements = {}            # représentation interne (convention : ne pas y toucher)

    def ajouter(self, x):
        self._elements[x] = True

    def retirer(self, x):
        self._elements.pop(x, None)

    def contient(self, x):
        return x in self._elements

    def taille(self):
        return len(self._elements)

e = Ensemble()
for x in [3, 1, 3, 2]:
    e.ajouter(x)
print(e.taille(), e.contient(2))
```

C'est l'**encapsulation**, détaillée dans le module objet. Les types de Python (`list`, `dict`, `set`) sont eux-mêmes des
implémentations de types abstraits, fournies par le langage.

:::retenir
Les types **simples** (entiers, flottants, booléens, caractères) ont aussi une spécification (les opérations permises) et
une représentation (binaire, IEEE 754…) étudiée dans le module « Représentation de l'information ». La démarche est la même :
on raisonne sur les opérations, on connaît les limites de la représentation.
:::

:::prof
En terminale NSI, le programme demande de « spécifier une structure de données par son interface » et de « distinguer
interface et implémentation », puis d'« écrire plusieurs implémentations d'une même structure ». Une bonne activité :
donner aux élèves un programme client qui utilise un TAD, et leur faire écrire deux implémentations interchangeables ;
mesurer ensuite les temps sur de grandes données.
:::

## Exemple guidé

**Problème (type écrit 2).** Une bibliothèque veut gérer les emprunts en cours : savoir si un livre (identifié par un
numéro) est emprunté, l'enregistrer comme emprunté ou rendu, et compter les emprunts en cours. 1. Spécifier un TAD.
2. Proposer deux implémentations et comparer. 3. Justifier un choix.

**1. Spécification du TAD `Emprunts`.**

- `nouveau()` → Emprunts : aucun livre emprunté ;
- `emprunter(e, numero)` : précondition : le livre n'est pas déjà emprunté ; après, `est_emprunte(e, numero)` est vrai ;
- `rendre(e, numero)` : précondition : le livre est emprunté ; après, `est_emprunte(e, numero)` est faux ;
- `est_emprunte(e, numero)` → Booléen ;
- `nombre(e)` → Entier : nombre de livres empruntés.

C'est en fait le TAD Ensemble, avec des préconditions en plus (on ne peut pas emprunter un livre déjà sorti).

**2. Deux implémentations.**
- Une **liste** des numéros empruntés : `est_emprunte` et `rendre` en $\Theta(n)$ ($n$ = nombre d'emprunts en cours) ;
- un **`set`** Python : toutes les opérations en $O(1)$ en moyenne.

```python exec
class Emprunts:
    def __init__(self):
        self._sortis = set()

    def emprunter(self, numero):
        if numero in self._sortis:
            raise ValueError(f"le livre {numero} est déjà emprunté")
        self._sortis.add(numero)

    def rendre(self, numero):
        if numero not in self._sortis:
            raise ValueError(f"le livre {numero} n'est pas emprunté")
        self._sortis.remove(numero)

    def est_emprunte(self, numero):
        return numero in self._sortis

    def nombre(self):
        return len(self._sortis)

e = Emprunts()
e.emprunter(1042); e.emprunter(77); e.rendre(1042)
print(e.est_emprunte(1042), e.est_emprunte(77), e.nombre())
```

**3. Choix.** Les opérations les plus fréquentes sont les tests et les mises à jour : la table de hachage s'impose. Si l'on
voulait en plus afficher les emprunts **par numéro croissant** très souvent, une liste triée (ou un arbre binaire de
recherche, voir plus loin) pourrait devenir intéressante. Les préconditions sont vérifiées par des exceptions, car elles
peuvent être violées par une erreur de l'utilisateur.

## L'essentiel

- TAD = opérations + spécification (signatures, préconditions, axiomes), sans représentation.
- Interface (ce que voit le client) ≠ implémentation (représentation + code des opérations).
- Plusieurs implémentations d'un même TAD ont des coûts différents : on choisit selon les opérations fréquentes.
- Le code client n'utilise que l'interface : on peut changer d'implémentation sans le modifier.
- Encapsulation (classe, attributs « privés » `_nom`) : protège les invariants de la représentation.

## Exercices

::::exercice[Interface ou implémentation ?]{niveau=1}
Parmi ces éléments, lesquels font partie de l'**interface** du TAD Ensemble (et pas de son implémentation) ?

- [x] l'opération `contient(e, x)` renvoie un booléen
- [ ] les éléments sont rangés dans une liste Python
- [x] après `ajouter(e, x)`, `contient(e, x)` est vrai
- [ ] on utilise un dictionnaire dont les valeurs valent `True`

:::corrige
L'interface, ce sont les opérations et leur comportement. Le choix d'une liste ou d'un dictionnaire relève de
l'implémentation : il peut changer sans que le client s'en aperçoive.
:::
::::

::::exercice[Choisir une implémentation]{niveau=1}
Un programme fait un million de tests d'appartenance dans un ensemble de 100 000 chaînes de caractères, et très peu
d'ajouts. Quelle implémentation choisir ?

- [ ] une liste non triée
- [ ] un tableau de booléens indexé par les éléments
- [x] une table de hachage (`set` ou `dict`)
- [ ] peu importe, les coûts sont les mêmes

:::corrige
Avec une liste non triée, chaque test coûte jusqu'à 100 000 comparaisons. Un tableau de booléens ne fonctionne que pour de
petits entiers, pas pour des chaînes. La table de hachage donne un test en temps constant en moyenne.
:::
::::

::::exercice[Ensemble par liste triée]{niveau=2}
Implémente le TAD Ensemble d'entiers avec une **liste triée** sans doublons : `contient` doit être en $O(\log n)$
(dichotomie), `ajouter` insère à la bonne place. Tu peux utiliser le module `bisect`.

```python depart
import bisect

def ensemble_vide():
    return []

def contient(e, x):
    ...

def ajouter(e, x):
    ...

def elements(e):
    return list(e)
```

```python tests
e = ensemble_vide()
for x in [5, 1, 9, 1, 3, 5]:
    ajouter(e, x)
assert elements(e) == [1, 3, 5, 9], "triée et sans doublons"
assert contient(e, 9) and contient(e, 1), "présents"
assert not contient(e, 4) and not contient(e, 10) and not contient(e, 0), "absents"
assert not contient(ensemble_vide(), 1), "ensemble vide"
```

:::corrige
```python solution
import bisect

def ensemble_vide():
    return []

def contient(e, x):
    i = bisect.bisect_left(e, x)
    return i < len(e) and e[i] == x

def ajouter(e, x):
    i = bisect.bisect_left(e, x)
    if i == len(e) or e[i] != x:
        e.insert(i, x)

def elements(e):
    return list(e)
```
`contient` est en $O(\log n)$, mais `ajouter` reste en $\Theta(n)$ à cause du décalage de `insert`.
:::
::::

::::exercice[Une classe Compteur]{niveau=2}
Le TAD **Multiensemble** compte les occurrences : `ajouter(x)` ajoute une occurrence, `nombre(x)` renvoie le nombre
d'occurrences de `x` (0 s'il est absent), `retirer(x)` retire une occurrence (précondition : `nombre(x) > 0`, sinon
`ValueError`), `total()` renvoie le nombre total d'occurrences. Implémente-le par une classe utilisant un dictionnaire.

```python depart
class Multiensemble:
    def __init__(self):
        ...

    def ajouter(self, x):
        ...

    def nombre(self, x):
        ...

    def retirer(self, x):
        ...

    def total(self):
        ...
```

```python tests
m = Multiensemble()
for x in "abracadabra":
    m.ajouter(x)
assert m.nombre("a") == 5 and m.nombre("z") == 0, "comptages"
assert m.total() == 11, "total"
m.retirer("a")
assert m.nombre("a") == 4 and m.total() == 10, "après retrait"
try:
    m.retirer("z")
    ok = False
except ValueError:
    ok = True
assert ok, "retirer un absent lève ValueError"
```

:::corrige
```python solution
class Multiensemble:
    def __init__(self):
        self._compte = {}
        self._total = 0

    def ajouter(self, x):
        self._compte[x] = self._compte.get(x, 0) + 1
        self._total += 1

    def nombre(self, x):
        return self._compte.get(x, 0)

    def retirer(self, x):
        if self.nombre(x) == 0:
            raise ValueError("élément absent")
        self._compte[x] -= 1
        if self._compte[x] == 0:
            del self._compte[x]
        self._total -= 1

    def total(self):
        return self._total
```
Garder `_total` à jour donne `total()` en temps constant (au lieu de sommer toutes les valeurs) : c'est un choix
d'implémentation invisible pour le client.
:::
::::

::::exercice[Spécifier par des axiomes]{niveau=3}
On considère le TAD **Pile** avec les opérations `pile_vide()`, `est_vide(p)`, `empiler(p, x)` (renvoie une nouvelle pile),
`sommet(p)` et `depiler(p)` (renvoie la pile sans son sommet). Écris les signatures, les préconditions et au moins quatre
axiomes qui caractérisent le comportement d'une pile.

:::criteres
- Signatures correctes : `pile_vide : → Pile`, `est_vide : Pile → Booléen`, `empiler : Pile × Élément → Pile`, `sommet : Pile → Élément`, `depiler : Pile → Pile`.
- Préconditions : `sommet(p)` et `depiler(p)` exigent que `p` ne soit pas vide.
- Axiomes : `est_vide(pile_vide())` est vrai ; `est_vide(empiler(p, x))` est faux ; `sommet(empiler(p, x)) = x` ; `depiler(empiler(p, x)) = p`.
- Il est remarqué que ces axiomes expriment le principe « dernier entré, premier sorti ».
:::

:::corrige
Signatures : `pile_vide : → Pile` ; `est_vide : Pile → Booléen` ; `empiler : Pile × Élément → Pile` ;
`sommet : Pile → Élément` ; `depiler : Pile → Pile`.
Préconditions : `sommet(p)` et `depiler(p)` ne sont définis que si `est_vide(p)` est faux.
Axiomes, pour toute pile `p` et tout élément `x` :
1. `est_vide(pile_vide()) = Vrai` ;
2. `est_vide(empiler(p, x)) = Faux` ;
3. `sommet(empiler(p, x)) = x` ;
4. `depiler(empiler(p, x)) = p`.

Les axiomes 3 et 4 disent exactement que le dernier élément empilé est le premier accessible et le premier retiré :
c'est le principe LIFO (« dernier entré, premier sorti »). Toute implémentation qui les respecte est une pile.
:::
::::

::::exercice[Concevoir un TAD et ses implémentations]{niveau=4 duree=25}
Une application de covoiturage gère, pour chaque trajet, une **liste d'attente** de passagers : un passager s'inscrit (il
passe en dernier), le premier inscrit est servi quand une place se libère, un passager peut se désinscrire à tout moment,
et l'on veut connaître sa position dans la file.

1. Spécifie un TAD `ListeAttente` (opérations, signatures, préconditions, comportement attendu).
2. Propose une implémentation par une liste Python et donne le coût de chaque opération.
3. Propose une implémentation dans laquelle `inscrire`, `servir` et `desinscrire` sont en temps constant en moyenne, en
   acceptant que `position` reste plus coûteuse. Décris la représentation et justifie les coûts.
4. Écris un court code client qui ne dépend pas de l'implémentation choisie.

:::criteres
- Opérations spécifiées : créer, inscrire (passager absent), servir (file non vide, renvoie le premier), desinscrire (passager présent), position (passager présent, rang à partir de 1), taille, est_vide.
- Implémentation par liste : inscrire `append` $O(1)$, servir `pop(0)` $\Theta(n)$, desinscrire `remove` $\Theta(n)$, position `index` $\Theta(n)$.
- Implémentation améliorée cohérente : par exemple un dictionnaire ordonné passager → numéro d'arrivée (ou une file + un ensemble de désinscrits) ; servir et desinscrire en $O(1)$ en moyenne ; position en $\Theta(n)$ (parcours).
- Justification des coûts par la représentation choisie (table de hachage, ordre d'insertion conservé).
- Code client qui n'appelle que les opérations du TAD.
:::

:::corrige
1. **TAD `ListeAttente`** :
   - `creer() → ListeAttente` : file vide ;
   - `inscrire(f, p)` : précondition `p` absent ; `p` devient le dernier de la file ;
   - `servir(f) → Passager` : précondition file non vide ; renvoie le premier inscrit et le retire ;
   - `desinscrire(f, p)` : précondition `p` présent ; le retire, l'ordre des autres est conservé ;
   - `position(f, p) → Entier` : précondition `p` présent ; rang de `p` (1 pour le premier) ;
   - `taille(f) → Entier`, `est_vide(f) → Booléen`.
2. **Liste Python** (le premier en tête) : `inscrire` = `append`, $O(1)$ amorti ; `servir` = `pop(0)`, $\Theta(n)$ (décalage) ;
   `desinscrire` = `remove`, $\Theta(n)$ ; `position` = `index(p) + 1`, $\Theta(n)$ ; `taille` = `len`, $O(1)$.
3. **Dictionnaire ordonné** : `collections.OrderedDict` associe une table de hachage à une liste doublement chaînée qui
   mémorise l'ordre d'insertion. On range `passager → True`. `inscrire` : `d[p] = True`, $O(1)$ en moyenne ;
   `desinscrire` : `del d[p]`, $O(1)$ en moyenne (on trouve le maillon par hachage et on le décroche de la liste chaînée) ;
   `servir` : `d.popitem(last=False)` retire le premier inscrit en $O(1)$ ; `position` : on parcourt les clés jusqu'à `p`,
   $\Theta(n)$. (Un `dict` ordinaire conserve aussi l'ordre d'insertion, mais retirer **la première** clé à répétition n'y est
   pas garanti en temps constant. Variante : `collections.deque` pour l'ordre et un ensemble des désinscrits, ignorés au
   moment de servir.)
4. ```python
   f = creer()
   for nom in ["Ana", "Bilal", "Chloé"]:
       inscrire(f, nom)
   desinscrire(f, "Bilal")
   print(position(f, "Chloé"))   # 2
   print(servir(f))              # Ana
   ```
   Ce code fonctionne à l'identique avec les deux implémentations.
:::
::::
