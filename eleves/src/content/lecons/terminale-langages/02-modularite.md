---
titre: Modules et API
resume: "Créer un module, le documenter, et exploiter la documentation d'une bibliothèque."
duree: 30
objectifs:
  - "Créer un module simple et le documenter"
  - "Utiliser une API ou une bibliothèque grâce à sa documentation"
---

Un grand programme se découpe en **modules** : des fichiers qui regroupent des fonctions sur un même thème.

## 1. Créer un module

Fichier `geometrie.py` :

```python
"""Fonctions de géométrie plane."""
from math import sqrt

def distance(a, b):
    """Renvoie la distance entre les points a et b."""
    return sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2)

if __name__ == "__main__":
    assert distance((0, 0), (3, 4)) == 5
```

Dans un autre fichier :

```python
from geometrie import distance
print(distance((1, 1), (4, 5)))
```

Le bloc `if __name__ == "__main__":` ne s'exécute que si on lance le fichier directement, pas lors d'un import.

## 2. Une API

Une **API** est l'ensemble des fonctions qu'une bibliothèque ou un service met à disposition. Sa **documentation** indique le rôle, les paramètres et la valeur renvoyée de chaque fonction. On peut s'en servir **sans connaître son code**.

## L'essentiel

- Un module est un fichier `.py` documenté, qu'on importe.
- `if __name__ == "__main__":` protège le code de test.
- Une API s'utilise grâce à sa documentation.

## Exercices

::::exercice[QCM : modules et API]{niveau=1 type=quiz}
Une question à la fois : la correction s'affiche aussitôt.

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

::::exercice[Lire une API]{niveau=1 type=reponses}
Voici la documentation d'un module `pile`.

> `creer()` : renvoie une pile vide.
> `empiler(p, x)` : ajoute x au sommet de p.
> `depiler(p)` : retire et renvoie le sommet de p.
> `est_vide(p)` : renvoie True si p est vide.

1. Quelle fonction faut-il appeler en premier pour obtenir une pile ?

   - creer
   - creer()

1. Combien de paramètres reçoit `empiler` ?

   - 2

1. Que renvoie `est_vide` : un entier, une pile ou un booléen ?

   - booleen
   - un booléen

1. A-t-on besoin de savoir comment la pile est programmée pour l'utiliser ? Réponds par oui ou par non.

   - non
::::

::::exercice[Compléter un module]{niveau=1 type=completer}
Complète l'utilisation du module `geometrie`, et le test du module.

```python trous
[[from]] geometrie [[import]] distance

if __name__ == "[[__main__]]":
    [[assert]] distance((0, 0), (6, 8)) == 10
```
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
