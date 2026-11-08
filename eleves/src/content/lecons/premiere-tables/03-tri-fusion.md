---
titre: Trier et fusionner
resume: "Trier une table selon une colonne et construire une table à partir de deux autres."
duree: 35
objectifs:
  - "Trier une table suivant une colonne"
  - "Construire une table en combinant deux tables"
prerequis: [premiere-tables/recherche]
---

Deux opérations reviennent sans cesse : classer les lignes, et réunir les informations de deux tables.

## 1. Trier une table

`sorted` renvoie une **nouvelle** table triée. Le paramètre `key` indique selon quelle valeur trier.

```python exec
table = [{"nom": "Tom", "note": 9}, {"nom": "Léa", "note": 15}, {"nom": "Inès", "note": 18}]

def note(e):
    return e["note"]

print([e["nom"] for e in sorted(table, key=note)])
print([e["nom"] for e in sorted(table, key=note, reverse=True)])
```

On passe la fonction `note` sans parenthèses : `key=note`, et non `key=note()`.

## 2. Fusionner deux tables

Deux tables peuvent partager une **colonne commune**. Les valeurs de cette colonne doivent appartenir au même **domaine** : un identifiant d'élève des deux côtés, par exemple.

```python exec
eleves = [{"id": 1, "nom": "Léa"}, {"id": 2, "nom": "Tom"}]
notes = [{"id": 2, "note": 9}, {"id": 1, "note": 15}]

resultat = []
for n in notes:
    for e in eleves:
        if e["id"] == n["id"]:
            resultat.append({"nom": e["nom"], "note": n["note"]})
print(resultat)
```

## L'essentiel

- `sorted(table, key=fonction, reverse=True)` renvoie une nouvelle table triée.
- Fusionner, c'est associer les lignes qui ont la même valeur dans une colonne commune.
- Les valeurs de cette colonne doivent appartenir au même domaine.

## Exercices

::::exercice[QCM : tri et fusion]{niveau=1 type=quiz}
Une question à la fois : la correction s'affiche aussitôt.

1. Que renvoie `sorted(table, key=note)` ?

   - [ ] rien, la table est triée sur place
   - [x] une nouvelle table triée par ordre croissant de note
   - [ ] la note maximale
   - [ ] une table triée par ordre décroissant

   > `sorted` renvoie un nouveau tableau ; `reverse=True` pour l'ordre décroissant.

1. Quelle écriture est correcte ?

   - [ ] `sorted(table, key=note())`
   - [x] `sorted(table, key=note)`
   - [ ] `sorted(table, note)`
   - [ ] `sorted(key=note)`

   > On passe la fonction elle-même, sans l'appeler.

1. Que signifie « tri stable » ?

   - [ ] le tri ne plante jamais
   - [x] deux lignes de même valeur gardent leur ordre de départ
   - [ ] le tri est toujours rapide
   - [ ] la table n'est pas modifiée

   > Utile pour trier selon plusieurs critères successifs.

1. Pour fusionner une table « élèves » et une table « notes », il faut :

   - [ ] qu'elles aient le même nombre de lignes
   - [x] une colonne commune (l'identifiant de l'élève)
   - [ ] qu'elles soient triées
   - [ ] qu'elles aient exactement les mêmes colonnes

   > On associe les lignes qui ont la même valeur dans la colonne commune.
::::

::::exercice[Lire un tri]{niveau=1 type=reponses}
On considère `t = [{"n": "A", "v": 3}, {"n": "B", "v": 1}, {"n": "C", "v": 2}]` et la fonction `v(e)` qui renvoie `e["v"]`.

1. Que s'affiche-t-il ?

   ```python verifier
   t = [{"n": "A", "v": 3}, {"n": "B", "v": 1}, {"n": "C", "v": 2}]
   def v(e):
       return e["v"]
   print([e["n"] for e in sorted(t, key=v)])
   ```

   - ['B', 'C', 'A']

1. Que s'affiche-t-il ?

   ```python verifier
   t = [{"n": "A", "v": 3}, {"n": "B", "v": 1}, {"n": "C", "v": 2}]
   def v(e):
       return e["v"]
   print(sorted(t, key=v, reverse=True)[0]["n"])
   ```

   - A
::::

::::exercice[Compléter un tri]{niveau=1 type=completer}
On veut les villes classées de la plus peuplée à la moins peuplée.

```python trous
def habitants(ligne):
    return ligne[[["habitants"]]]

classement = sorted(villes, key=[[habitants]], reverse=[[True]])
```
::::

::::exercice[Fusionner à la main]{niveau=1 type=completer}
On fusionne ces deux tables selon la colonne `id`.

| id | prenom |
| --- | --- |
| 1 | Léa |
| 2 | Tom |

| id | sport |
| --- | --- |
| 2 | judo |
| 1 | tennis |

Complète la table obtenue.

| id | prenom | sport |
| --- | --- | --- |
| 1 | Léa | [[tennis]] |
| 2 | Tom | [[judo]] |
::::

::::exercice[Classement]{niveau=2}
Écris `classement(table)` qui renvoie la liste des noms triés par note **décroissante** et, à note égale, par ordre **alphabétique** du nom.
Utilise `sorted` (deux tris successifs, grâce à la stabilité).

```python depart
def classement(table):
    ...
```

```python tests
t = [
    {"nom": "Tom", "note": 12},
    {"nom": "Léa", "note": 15},
    {"nom": "Ana", "note": 12},
    {"nom": "Inès", "note": 18},
]
assert classement(t) == ["Inès", "Léa", "Ana", "Tom"], "note décroissante puis nom"
assert classement([]) == [], "table vide"
```

:::corrige
```python solution
def nom(e):
    return e["nom"]

def note(e):
    return e["note"]

def classement(table):
    par_nom = sorted(table, key=nom)
    par_note = sorted(par_nom, key=note, reverse=True)
    return [e["nom"] for e in par_note]
```

On trie d'abord selon le critère **secondaire** (le nom), puis selon le critère **principal** (la note) : la stabilité garde l'ordre
alphabétique entre les notes égales. Remarque : avec `reverse=True`, Python conserve bien l'ordre des égaux.
:::
::::

::::exercice[Fusionner élèves et notes]{niveau=2}
Écris `bulletin(eleves, notes)` qui renvoie une table où chaque ligne contient `nom`, `matiere` et `note`, en associant chaque note à l'élève
dont l'`id` est égal à l'`id_eleve` de la note. Les notes dont l'élève est inconnu sont ignorées. L'ordre est celui de la table `notes`.

```python depart
def bulletin(eleves, notes):
    ...
```

```python tests
eleves = [{"id": 1, "nom": "Léa"}, {"id": 2, "nom": "Tom"}]
notes = [
    {"id_eleve": 2, "matiere": "NSI", "note": 9},
    {"id_eleve": 3, "matiere": "NSI", "note": 20},
    {"id_eleve": 1, "matiere": "maths", "note": 13},
]
assert bulletin(eleves, notes) == [
    {"nom": "Tom", "matiere": "NSI", "note": 9},
    {"nom": "Léa", "matiere": "maths", "note": 13},
], "fusion"
assert bulletin(eleves, []) == [], "pas de notes"
```

:::corrige
```python solution
def bulletin(eleves, notes):
    noms = {}
    for e in eleves:
        noms[e["id"]] = e["nom"]
    resultat = []
    for n in notes:
        if n["id_eleve"] in noms:
            resultat.append({"nom": noms[n["id_eleve"]], "matiere": n["matiere"], "note": n["note"]})
    return resultat
```

Plutôt que deux boucles imbriquées, on construit d'abord un dictionnaire `id → nom` : chaque recherche devient immédiate. La double boucle du
cours est aussi une réponse correcte.
:::
::::
