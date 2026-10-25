---
titre: Modularité et mise au point
resume: "Le cours de terminale NSI sur la modularité et la qualité du code : découper un programme en modules, créer et importer un module, utiliser une API et sa documentation ; les paradigmes impératif, fonctionnel et objet ; la gestion des bugs typiques (typage, effets de bord, débordements, cas oubliés, flottants) et les tests."
duree: 55
objectifs:
  - "Créer un module, l'importer et documenter ses fonctions"
  - "Utiliser une bibliothèque en s'appuyant sur sa documentation"
  - "Distinguer les paradigmes impératif, fonctionnel et objet sur des exemples"
  - "Reconnaître et corriger les causes typiques de bugs"
prerequis: [nsi-premiere/specification, nsi-terminale/poo]
programme: [nsit-langages]
cartes:
  - q: "Qu'est-ce qu'un module en Python ?"
    r: "Un **fichier .py** qui regroupe des fonctions (et classes) sur un même thème, que l'on **importe** ailleurs avec `import nom` ou `from nom import fonction`."
  - q: "Qu'est-ce qu'une API ?"
    r: "L'**interface** d'une bibliothèque ou d'un service : la liste des fonctions qu'on peut appeler, leurs paramètres et ce qu'elles renvoient, décrits dans sa **documentation**."
  - q: "Les trois paradigmes au programme ?"
    r: "**Impératif** : suite d'instructions qui modifient des variables. **Fonctionnel** : composition de fonctions sans effet de bord ni modification. **Objet** : des objets qui regroupent données et méthodes."
  - q: "Qu'est-ce qu'un effet de bord ?"
    r: "Une modification par une fonction de quelque chose **hors d'elle-même** (un tableau passé en paramètre, une variable globale, un affichage). Non désiré, c'est une source fréquente de bugs."
  - q: "Pourquoi ne pas tester `0.1 + 0.2 == 0.3` ?"
    r: "Les flottants sont approchés : c'est `False`. On compare avec une tolérance : `abs(a - b) < 1e-9`."
  - q: "Que permet `if __name__ == \"__main__\":` ?"
    r: "D'exécuter du code (tests, exemples) **seulement** quand on lance le fichier directement, **pas** quand on l'importe comme module."
---

Un programme réel fait des milliers de lignes, écrites par plusieurs personnes. Pour s'y retrouver, on le **découpe** en **modules** cohérents,
on **réutilise** des bibliothèques existantes plutôt que de tout réécrire, et on chasse méthodiquement les **bugs**. Ce chapitre rassemble ces
bonnes pratiques, et présente les grands **paradigmes** (styles) de programmation.

## Ce que dit le programme

Contenus : *modularité* ; *paradigmes de programmation* ; *mise au point des programmes, gestion des bugs*. Capacités attendues : **utiliser des
API (Application Programming Interface) ou des bibliothèques** ; **exploiter leur documentation** ; **créer des modules simples et les
documenter** ; **distinguer sur des exemples les paradigmes impératif, fonctionnel et objet** ; **choisir le paradigme de programmation selon
le champ d'application d'un programme** ; **dans la pratique de la programmation, savoir répondre aux causes typiques de bugs** : problèmes liés au
typage, effets de bord non désirés, débordements dans les tableaux, instruction conditionnelle non exhaustive, choix des inégalités,
comparaisons et calculs entre flottants, mauvais nommage des variables.

## 1. Créer un module

Un **module** est un fichier `.py`. Par exemple, `geometrie.py` :

```python
"""Fonctions de géométrie plane. Les points sont des couples (x, y)."""
from math import sqrt

def distance(a, b):
    """Renvoie la distance entre les points a et b."""
    return sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2)

def milieu(a, b):
    """Renvoie le milieu du segment [ab]."""
    return ((a[0] + b[0]) / 2, (a[1] + b[1]) / 2)

if __name__ == "__main__":
    # exécuté seulement si on lance ce fichier, pas à l'import
    assert distance((0, 0), (3, 4)) == 5
    assert milieu((0, 0), (2, 4)) == (1, 2)
    print("tests OK")
```

Dans un autre fichier du même dossier :

```python
import geometrie
print(geometrie.distance((1, 1), (4, 5)))

from geometrie import milieu
print(milieu((0, 0), (10, 0)))
```

Intérêts : chaque module a **un rôle clair** ; on peut le **tester** séparément ; on le **réutilise** dans plusieurs programmes ; plusieurs
personnes travaillent en parallèle. Le module s'utilise grâce à son **interface** (ses fonctions documentées), sans connaître son code.

## 2. Utiliser une bibliothèque et sa documentation

Python et sa communauté fournissent des milliers de bibliothèques : `math`, `random`, `csv`, `datetime`, `turtle` (standard), ou
`matplotlib`, `requests`, `pandas` (à installer). L'**API** d'une bibliothèque est la liste de ce qu'elle propose ; on la découvre dans sa
**documentation** ou avec `help`.

```python exec
from datetime import date

aujourd_hui = date(2026, 10, 21)
bac = date(2027, 6, 15)
print((bac - aujourd_hui).days, "jours avant le bac")
print(bac.strftime("%d/%m/%Y"), bac.weekday())    # weekday : 0 = lundi
```

Une API peut aussi être un **service Web** : on lui envoie une requête HTTP (par exemple une adresse) et il répond avec des données, souvent au
format **JSON** (dictionnaires et listes).

## 3. Les paradigmes de programmation

Un même problème, « la somme des carrés des nombres pairs d'un tableau », dans trois styles :

```python exec
t = [3, 4, 7, 10, 1, 2]

# Impératif : des instructions qui modifient des variables
total = 0
for x in t:
    if x % 2 == 0:
        total = total + x * x
print(total)

# Fonctionnel : on compose des fonctions, sans modifier de variable
print(sum(map(lambda x: x * x, filter(lambda x: x % 2 == 0, t))))

# Objet : un objet regroupe les données et les traitements
class Serie:
    def __init__(self, valeurs):
        self.valeurs = valeurs
    def pairs(self):
        return Serie([x for x in self.valeurs if x % 2 == 0])
    def somme_carres(self):
        return sum(x * x for x in self.valeurs)

print(Serie(t).pairs().somme_carres())
```

| Paradigme | Idée | Points forts | Exemples de langages |
| --- | --- | --- | --- |
| **impératif** | une suite d'ordres qui modifient l'état (les variables) | proche de la machine, intuitif | C, Python, assembleur |
| **fonctionnel** | des fonctions **pures** (même entrée, même sortie, sans effet de bord), composées ; pas de modification | facile à tester et à paralléliser | OCaml, Haskell, Lisp |
| **objet** | des objets avec attributs et méthodes, qui interagissent | modéliser des entités, grands logiciels | Java, Python, C++ |

Python est **multi-paradigme**. On choisit selon le problème : objet pour un jeu ou une interface graphique, fonctionnel pour des traitements
de données, impératif pour un algorithme simple.

## 4. Les bugs typiques

| Cause | Exemple | Remède |
| --- | --- | --- |
| **typage** | `input()` renvoie une chaîne : `"3" + 4` | convertir avec `int` ; vérifier les types |
| **effet de bord non désiré** | une fonction trie le tableau reçu avec `t.sort()` et l'appelant le retrouve modifié | travailler sur une copie, ou le documenter |
| **débordement de tableau** | `t[len(t)]`, `range(len(t) + 1)` | vérifier les bornes, tester les cas limites |
| **conditionnelle non exhaustive** | `if note >= 10: ... elif note < 10 and note > 0: ...` oublie 0 | toujours un `else`, envisager tous les cas |
| **choix des inégalités** | `>` au lieu de `>=` pour « au moins 10 » | relire la spécification, tester la valeur frontière |
| **flottants** | `0.1 + 0.2 == 0.3` vaut `False` | comparer avec une tolérance |
| **mauvais nommage** | `l`, `l1`, `tmp2`, `x` pour tout | des noms qui disent ce que contient la variable |

```python exec
def ajouter_bonus(notes):
    notes.append(20)          # effet de bord : modifie le tableau de l'appelant
    return sum(notes) / len(notes)

mes_notes = [12, 14]
print(ajouter_bonus(mes_notes))
print(mes_notes)              # [12, 14, 20] : surprise !

print(0.1 + 0.2 == 0.3, abs((0.1 + 0.2) - 0.3) < 1e-9)
```

## 5. Tester

Les **tests** protègent contre les **régressions** : une modification qui casse ce qui marchait. On les écrit avec `assert`, dans le module
(sous `if __name__ == "__main__":`) ou dans un fichier de tests. Les **doctests** placent des exemples directement dans la documentation :

```python exec
def carre(x):
    """Renvoie le carré de x.

    >>> carre(3)
    9
    >>> carre(-2)
    4
    """
    return x * x

import doctest
print(doctest.testmod())
```

## Les erreurs classiques des élèves

:::attention[Ce que tu verras en classe]
- **Nommer son fichier comme un module standard** (`random.py`, `math.py`) : `import random` importe alors son propre fichier.
- **Code de test exécuté à l'import** (sans `if __name__ == "__main__":`).
- **Effet de bord caché** dans une fonction qui modifie le tableau reçu.
- **Comparer des flottants avec `==`.**
- **Croire qu'un paradigme est « le bon »** : ils se complètent.
- **Ignorer la documentation** et deviner les paramètres d'une fonction.
:::

## En classe

:::methode[Activités qui marchent]
1. **Projet en équipe** découpé en modules (un élève par module), avec l'interface fixée à l'avance.
2. **Explorer une documentation** : trouver dans la doc de `random` ou de `datetime` comment faire une tâche donnée.
3. **Trois versions** d'un même programme (impératif, fonctionnel, objet), et discussion.
4. **Chasse aux bugs** : un programme qui contient un exemple de chaque bug typique.
:::

## L'essentiel

- **Module** = fichier `.py` importé (`import`, `from … import`) ; documenté par des docstrings ; tests sous `if __name__ == "__main__":`.
- **API** = interface d'une bibliothèque ou d'un service, décrite par sa **documentation**.
- Paradigmes **impératif** (instructions, état), **fonctionnel** (fonctions pures, composition), **objet** (objets, méthodes).
- **Bugs typiques** : typage, effets de bord, débordements, cas oubliés, inégalités, flottants, nommage.
- **Tests** (assert, doctest) contre les régressions.

## Exercices

::::exercice[Grand QCM : modularité et bugs]{niveau=1 type=quiz}
Dix questions sur les modules, les paradigmes et les bugs.

1. Qu'est-ce qu'un module Python ?

   - [x] un fichier .py dont on importe les fonctions
   - [ ] une fonction très longue
   - [ ] une classe
   - [ ] un dossier

   > On l'utilise avec `import`.

1. À quoi sert `if __name__ == "__main__":` dans un module ?

   - [ ] à importer le module
   - [x] à n'exécuter un code que si le fichier est lancé directement
   - [ ] à déclarer la fonction principale obligatoire
   - [ ] à accélérer le programme

   > Pratique pour les tests et les exemples.

1. Que désigne une API ?

   - [ ] un langage de programmation
   - [x] l'interface d'une bibliothèque ou d'un service : ses fonctions et leur usage
   - [ ] un type de bug
   - [ ] un protocole réseau

   > Application Programming Interface.

1. Quel style correspond au paradigme fonctionnel ?

   - [ ] une boucle qui modifie un compteur
   - [x] des fonctions sans effet de bord composées entre elles
   - [ ] une classe avec des méthodes
   - [ ] des instructions de saut

   > Pas de modification de variables.

1. Quel style correspond au paradigme impératif ?

   - [x] une suite d'instructions qui modifient des variables
   - [ ] des fonctions pures uniquement
   - [ ] uniquement des objets
   - [ ] des requêtes SQL

   > C'est le style le plus proche de la machine.

1. Une fonction modifie le tableau qu'on lui a passé alors qu'on ne s'y attendait pas. C'est :

   - [ ] un débordement
   - [x] un effet de bord non désiré
   - [ ] une erreur de typage
   - [ ] un problème de flottants

   > Le tableau est partagé entre l'appelant et la fonction.

1. Que vaut `0.1 + 0.2 == 0.3` en Python ?

   - [ ] `True`
   - [x] `False`
   - [ ] une erreur
   - [ ] `None`

   > Les flottants sont des approximations binaires.

1. Que renvoie `input()` quand l'utilisateur tape 42 ?

   - [ ] l'entier 42
   - [x] la chaîne `"42"`
   - [ ] le flottant 42.0
   - [ ] `None`

   > Il faut convertir avec `int`.

1. Un élève nomme son fichier `random.py` puis écrit `import random`. Que se passe-t-il ?

   - [ ] rien de particulier
   - [x] Python importe son propre fichier au lieu du module standard
   - [ ] le module standard est supprimé
   - [ ] une erreur de syntaxe

   > Le dossier courant est prioritaire.

1. Quel est l'intérêt principal de découper un programme en modules ?

   - [ ] le rendre plus rapide
   - [x] organiser, tester séparément, réutiliser et travailler à plusieurs
   - [ ] le rendre plus court
   - [ ] éviter les classes

   > Chaque module a un rôle clair et une interface.
::::

::::exercice[Corriger les bugs typiques]{niveau=1}
Chacune des fonctions ci-dessous contient un bug typique. Corrige-les.

```python depart
def mention(note):
    """Renvoie 'TB' si note >= 16, 'B' si note >= 14, 'AB' si note >= 12, 'P' si note >= 10, sinon 'NA'."""
    if note > 16:
        return "TB"
    elif note >= 14:
        return "B"
    elif note >= 12:
        return "AB"
    elif note >= 10:
        return "P"

def presque_egal(a, b):
    """Renvoie True si a et b sont égaux à 1e-9 près."""
    return a == b

def moyenne_sans_modifier(t):
    """Renvoie la moyenne de t sans ses valeurs extrêmes, sans modifier t (len(t) >= 3)."""
    t.sort()
    t.pop(0)
    t.pop()
    return sum(t) / len(t)
```

```python tests
assert mention(16) == "TB" and mention(15) == "B" and mention(12) == "AB", "inégalités"
assert mention(8) == "NA", "cas oublié"
assert presque_egal(0.1 + 0.2, 0.3), "flottants"
assert not presque_egal(1.0, 1.1), "vraiment différents"
notes = [12, 3, 18, 10]
assert moyenne_sans_modifier(notes) == 11, "moyenne sans extrêmes"
assert notes == [12, 3, 18, 10], "le tableau n'est pas modifié"
```

:::corrige
```python solution
def mention(note):
    if note >= 16:
        return "TB"
    elif note >= 14:
        return "B"
    elif note >= 12:
        return "AB"
    elif note >= 10:
        return "P"
    else:
        return "NA"

def presque_egal(a, b):
    return abs(a - b) < 1e-9

def moyenne_sans_modifier(t):
    copie = sorted(t)
    copie = copie[1:len(copie) - 1]
    return sum(copie) / len(copie)
```

Trois bugs typiques : **inégalité** stricte au lieu de large (16 donnait « B ») et **conditionnelle non exhaustive** (8 donnait `None`) ;
**comparaison de flottants** avec `==` ; **effet de bord** (`sort` et `pop` modifiaient le tableau de l'appelant) corrigé avec `sorted`, qui
renvoie une copie.
:::
::::

::::exercice[Impératif et fonctionnel]{niveau=2}
Écris deux versions de chaque fonction : `longueurs_imp(mots)` en style impératif (boucle et `append`) et `longueurs_fonc(mots)` en style
fonctionnel (une expression avec `map` ou une compréhension, sans modifier de variable), qui renvoient la liste des longueurs des mots de plus
de 3 lettres. Puis `compose(f, g)` qui renvoie la fonction x ↦ f(g(x)).

```python depart
def longueurs_imp(mots):
    ...

def longueurs_fonc(mots):
    ...

def compose(f, g):
    ...
```

```python tests
mots = ["le", "chat", "dort", "sur", "le", "canapé"]
assert longueurs_imp(mots) == [4, 4, 6], "impératif"
assert longueurs_fonc(mots) == [4, 4, 6], "fonctionnel"
assert longueurs_imp([]) == [] and longueurs_fonc([]) == [], "vide"
double_puis_plus1 = compose(lambda x: x + 1, lambda x: 2 * x)
assert double_puis_plus1(5) == 11, "composition"
assert compose(len, str)(12345) == 5, "composition de fonctions existantes"
```

:::corrige
```python solution
def longueurs_imp(mots):
    resultat = []
    for m in mots:
        if len(m) > 3:
            resultat.append(len(m))
    return resultat

def longueurs_fonc(mots):
    return list(map(len, filter(lambda m: len(m) > 3, mots)))

def compose(f, g):
    return lambda x: f(g(x))
```

`compose` renvoie une **fonction** : en programmation fonctionnelle, les fonctions sont des valeurs comme les autres, qu'on passe en paramètre et
qu'on renvoie.
:::
::::

::::exercice[Utiliser une documentation]{niveau=2}
En utilisant le module `datetime` (`from datetime import date`), écris `jours_avant(annee, mois, jour, aujourd_hui)` qui renvoie le nombre de jours
entre la date `aujourd_hui` (un objet `date`) et la date donnée, et `jour_semaine(annee, mois, jour)` qui renvoie le nom du jour en français
(`"lundi"` … `"dimanche"`). La méthode `weekday()` d'un objet `date` renvoie 0 pour lundi, 6 pour dimanche ; la différence de deux dates a un
attribut `days`.

```python depart
from datetime import date

def jours_avant(annee, mois, jour, aujourd_hui):
    ...

def jour_semaine(annee, mois, jour):
    ...
```

```python tests
from datetime import date
assert jours_avant(2027, 6, 15, date(2026, 10, 21)) == 237, "jours avant le bac"
assert jours_avant(2026, 10, 21, date(2026, 10, 21)) == 0, "aujourd'hui"
assert jour_semaine(2026, 10, 21) == "mercredi", "un mercredi"
assert jour_semaine(1969, 7, 21) == "lundi", "premier pas sur la Lune"
```

:::corrige
```python solution
from datetime import date

def jours_avant(annee, mois, jour, aujourd_hui):
    return (date(annee, mois, jour) - aujourd_hui).days

def jour_semaine(annee, mois, jour):
    noms = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"]
    return noms[date(annee, mois, jour).weekday()]
```

On n'a pas eu à programmer le calendrier (années bissextiles, longueur des mois) : la bibliothèque le fait, il suffit de lire son API.
:::
::::

::::exercice[Choisir un paradigme]{niveau=2}
Pour chaque projet, dis quel paradigme te semble le plus adapté et justifie : (a) un jeu vidéo avec des personnages, des ennemis et des objets ;
(b) un programme qui transforme un gros fichier de mesures (filtrer, convertir, agréger) ; (c) un petit script qui renomme les fichiers d'un
dossier. Puis explique pourquoi un programme fonctionnel est plus facile à tester.

:::criteres
- (a) objet : entités avec état et comportements.
- (b) fonctionnel : chaîne de transformations de données, sans état.
- (c) impératif : suite simple d'instructions.
- Test : une fonction pure donne toujours le même résultat pour les mêmes entrées, sans dépendre d'un état ni le modifier.
:::

:::corrige
(a) **Objet** : chaque personnage, ennemi ou objet a un **état** (position, points de vie) et des **comportements** (se déplacer, attaquer) ; les
classes les modélisent naturellement. (b) **Fonctionnel** : le traitement est une suite de **transformations** (filtrer, convertir, agréger)
qui se composent, sans état à gérer ; c'est aussi plus facile à paralléliser sur de gros volumes. (c) **Impératif** : quelques instructions
qui s'enchaînent (lister, renommer) ; inutile de sortir des classes. Une fonction **pure** renvoie toujours le même résultat pour les mêmes
entrées et ne modifie rien autour d'elle : un test suffit à vérifier son comportement, sans préparer d'état ni craindre qu'un appel précédent
change le résultat.
:::
::::
