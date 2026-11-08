---
titre: Sujet pratique n° 1
resume: "Un sujet d'entraînement sur ordinateur : traiter les résultats d'une course à pied."
duree: 60
controle: true
objectifs:
  - "Programmer à partir d'un document"
  - "Analyser et corriger une fonction existante"
  - "Expliquer ses choix"
prerequis: [terminale-bac/epreuve]
---

## Le document

Sujet original, au format de la partie pratique. Durée conseillée : **1 heure**. Après chaque question, prépare-toi à expliquer ta réponse, comme avec l'examinateur.

Une application enregistre les résultats d'une course. Les données forment une liste de dictionnaires. Chaque coureur est décrit par :

- `"dossard"` : un entier ;
- `"nom"` : une chaîne de caractères ;
- `"categorie"` : `"junior"`, `"senior"` ou `"veteran"` ;
- `"temps"` : le temps de course, en secondes (entier), ou `None` si le coureur a abandonné.

Exemple :

```python
{"dossard": 12, "nom": "Ana", "categorie": "senior", "temps": 2710}
```

## Exercices

::::exercice[Question 1 : temps moyen]{niveau=3 points=5}
Écris `temps_moyen(coureurs, categorie)`, qui renvoie le temps moyen des coureurs de cette catégorie ayant terminé la course. S'il n'y en a aucun, la fonction renvoie `None`.

```python depart
def temps_moyen(coureurs, categorie):
    ...
```

```python tests
c = [
    {"dossard": 1, "nom": "Ana", "categorie": "senior", "temps": 3000},
    {"dossard": 2, "nom": "Bo", "categorie": "senior", "temps": None},
    {"dossard": 3, "nom": "Cy", "categorie": "junior", "temps": 2000},
    {"dossard": 4, "nom": "Di", "categorie": "senior", "temps": 4000},
]
assert temps_moyen(c, "senior") == 3500, "l'abandon est ignoré"
assert temps_moyen(c, "junior") == 2000, "un seul coureur"
assert temps_moyen(c, "veteran") is None, "catégorie vide"
```

:::corrige
```python solution
def temps_moyen(coureurs, categorie):
    total = 0
    n = 0
    for c in coureurs:
        if c["categorie"] == categorie and c["temps"] is not None:
            total = total + c["temps"]
            n = n + 1
    if n == 0:
        return None
    return total / n
```
:::
::::

::::exercice[Question 2 : le podium]{niveau=3 points=6}
Écris `podium(coureurs)`, qui renvoie la liste des noms des trois coureurs les plus rapides, du plus rapide au moins rapide. S'il y a moins de trois arrivants, on renvoie seulement ceux qui ont terminé.

```python depart
def podium(coureurs):
    ...
```

```python tests
c = [
    {"dossard": 1, "nom": "Ana", "categorie": "senior", "temps": 3000},
    {"dossard": 2, "nom": "Bo", "categorie": "senior", "temps": None},
    {"dossard": 3, "nom": "Cy", "categorie": "junior", "temps": 2000},
    {"dossard": 4, "nom": "Di", "categorie": "senior", "temps": 4000},
    {"dossard": 5, "nom": "El", "categorie": "veteran", "temps": 2500},
]
assert podium(c) == ["Cy", "El", "Ana"], "trois plus rapides"
assert podium(c[:2]) == ["Ana"], "un seul arrivant"
assert podium([]) == [], "liste vide"
```

:::corrige
```python solution
def temps(c):
    return c["temps"]

def podium(coureurs):
    arrivants = [c for c in coureurs if c["temps"] is not None]
    tries = sorted(arrivants, key=temps)
    return [c["nom"] for c in tries[:3]]
```
:::
::::

::::exercice[Question 3 : corriger une fonction]{niveau=3 points=5}
La fonction suivante doit convertir un temps en secondes en une chaîne `"h:mm:ss"`, avec les minutes et les secondes écrites sur deux chiffres. Elle contient une erreur. Teste-la avec `3725`, qui doit donner `"1:02:05"`, puis corrige-la.

```python depart
def format_temps(s):
    h = s // 3600
    m = s // 60
    r = s % 60
    return str(h) + ":" + str(m).zfill(2) + ":" + str(r).zfill(2)
```

```python tests
assert format_temps(3725) == "1:02:05", "1 h 2 min 5 s"
assert format_temps(59) == "0:00:59", "moins d'une minute"
assert format_temps(7200) == "2:00:00", "heures rondes"
```

:::corrige
```python solution
def format_temps(s):
    h = s // 3600
    m = (s % 3600) // 60
    r = s % 60
    return str(h) + ":" + str(m).zfill(2) + ":" + str(r).zfill(2)
```

Le nombre de minutes doit se calculer sur ce qui reste après avoir retiré les heures : `s // 60` donnait 62 au lieu de 2.
:::
::::

::::exercice[Question 4 : un cas limite]{niveau=3 points=4}
On utilise `format_temps(c["temps"])` pour afficher le temps de chaque coureur. Identifie un cas qui fait échouer ce code, et propose une solution.

:::criteres
- Tu identifies le cas d'un coureur qui a abandonné, dont le temps vaut `None`.
- Tu expliques l'erreur : on ne peut pas calculer `None // 3600`.
- Tu proposes un test avant l'appel, ou un affichage spécifique.
:::

:::corrige
Si un coureur a abandonné, `c["temps"]` vaut `None` et `None // 3600` provoque une `TypeError`. Il faut tester le cas avant : si le temps vaut `None`, on affiche `"abandon"`, sinon on appelle `format_temps`.
:::
::::
