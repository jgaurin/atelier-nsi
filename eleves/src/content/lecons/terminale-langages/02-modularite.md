---
titre: Modules et API
resume: "Créer un module, le documenter, et exploiter la documentation d'une bibliothèque."
duree: 30
objectifs:
  - "Créer un module simple et le documenter"
  - "Utiliser une API ou une bibliothèque grâce à sa documentation"
---

Un logiciel réel compte des milliers de lignes. Si tout était dans un seul fichier, on s'y perdrait. On le découpe donc en **modules**, comme un livre en chapitres : chaque fichier regroupe les fonctions d'un même thème.

## 1. Créer un module

On écrit un fichier `geometrie.py` :

```python
"""Fonctions de géométrie plane."""
from math import sqrt

def distance(a, b):
    """Renvoie la distance entre les points a et b."""
    return sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2)

if __name__ == "__main__":
    assert distance((0, 0), (3, 4)) == 5
```

Puis, dans un autre fichier du même dossier, on l'utilise :

```python
from geometrie import distance
print(distance((1, 1), (4, 5)))
```

Trois éléments à comprendre :

- **La docstring** : le texte entre triples guillemets, au début du fichier ou sous un `def`. Elle explique ce que fait le module ou la fonction. On la lit avec `help(distance)`.
- **L'import** : `from geometrie import distance` exécute le fichier `geometrie.py` et rend la fonction `distance` disponible.
- **Le bloc de test** : quand on lance `geometrie.py` directement, la variable spéciale `__name__` vaut `"__main__"`, et les tests s'exécutent. Quand on l'importe, elle vaut `"geometrie"`, et les tests sont ignorés. On peut donc tester un module sans gêner ceux qui l'utilisent.

:::attention
Ne nomme jamais ton fichier comme un module de Python, par exemple `random.py` : `import random` importerait ton propre fichier à la place du vrai module.
:::

## 2. Pourquoi découper

- **Réutiliser** : la même fonction sert dans plusieurs programmes, sans la recopier.
- **Comprendre** : chaque module a un rôle clair et se lit seul.
- **Corriger** : une erreur se corrige à un seul endroit.
- **Travailler à plusieurs** : chacun développe son module.

## 3. Utiliser une API

Une **API** (*interface de programmation*) est l'ensemble des fonctions qu'une bibliothèque ou un service met à ta disposition. Sa **documentation** indique, pour chaque fonction :

- ce qu'elle fait ;
- ses **paramètres** ;
- ce qu'elle **renvoie**, et ce qui se passe en cas de problème.

:::exemple
La documentation dit : « `randint(a, b)` renvoie un entier au hasard entre a et b, **bornes comprises** ». Sans lire son code, tu sais que `randint(1, 6)` simule un dé.
:::

C'est l'idée d'interface vue avec les structures de données : on s'appuie sur ce que la documentation promet, pas sur le code. Si la bibliothèque change son code sans changer sa documentation, ton programme continue de fonctionner.

## L'essentiel

- Un module est un fichier `.py` qu'on importe ; sa docstring le documente.
- `if __name__ == "__main__":` contient les tests, ignorés lors d'un import.
- On découpe pour réutiliser, comprendre, corriger et travailler à plusieurs.
- Une API s'utilise grâce à sa documentation, sans connaître son code.

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

::::exercice[Une API météo]{niveau=3}
Un module fournit une seule fonction, dont voici la documentation :

> `releves(ville)` : renvoie le tableau des températures mesurées dans `ville`, ou un tableau vide si la ville est inconnue.

Tu dois l'utiliser sans regarder son code.

1. Écris `moyenne_ville(ville)`, qui renvoie la température moyenne, ou `None` si la ville est inconnue.
2. Écris `plus_chaude(villes)`, qui renvoie le nom de la ville dont la moyenne est la plus élevée, en ignorant les villes inconnues. S'il n'y en a aucune, elle renvoie `None`.
3. À l'écrit : rédige la docstring de `moyenne_ville`. Si le service change sa façon de stocker les données sans changer `releves`, faut-il modifier tes fonctions ?

```python depart
def releves(ville):
    donnees = {"Lyon": [10, 20], "Nice": [18, 22], "Brest": [12, 14]}
    return donnees.get(ville, [])

def moyenne_ville(ville):
    ...

def plus_chaude(villes):
    ...
```

```python tests
assert moyenne_ville("Lyon") == 15, "moyenne"
assert moyenne_ville("Atlantide") is None, "ville inconnue"
assert plus_chaude(["Lyon", "Nice", "Brest"]) == "Nice", "la plus chaude"
assert plus_chaude(["Atlantide", "Brest"]) == "Brest", "ville inconnue ignorée"
assert plus_chaude(["Atlantide"]) is None, "aucune ville connue"
assert plus_chaude([]) is None, "liste vide"
```

:::corrige
```python solution
def releves(ville):
    donnees = {"Lyon": [10, 20], "Nice": [18, 22], "Brest": [12, 14]}
    return donnees.get(ville, [])

def moyenne_ville(ville):
    """Renvoie la température moyenne de ville, ou None si elle est inconnue."""
    t = releves(ville)
    if len(t) == 0:
        return None
    return sum(t) / len(t)

def plus_chaude(villes):
    meilleure = None
    meilleure_moyenne = None
    for v in villes:
        m = moyenne_ville(v)
        if m is not None and (meilleure is None or m > meilleure_moyenne):
            meilleure = v
            meilleure_moyenne = m
    return meilleure
```

**Question 3.** Non : ces fonctions dépendent seulement de ce que `releves` promet dans sa documentation.
:::
::::
