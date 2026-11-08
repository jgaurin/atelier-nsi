---
titre: Rechercher et vérifier
resume: "Sélectionner les lignes d'une table selon des critères, garder certaines colonnes, repérer doublons et incohérences."
duree: 35
objectifs:
  - "Rechercher les lignes qui vérifient des critères"
  - "Sélectionner des colonnes"
  - "Tester la cohérence d'une table"
prerequis: [premiere-tables/csv]
---

Une fois la table chargée, on l'interroge : qui a plus de 10 ? combien de lignes sont incomplètes ?

## 1. Rechercher des lignes

On utilise une compréhension avec une condition, éventuellement avec `and`, `or`, `not`.

```python exec
table = [
    {"nom": "Léa", "classe": "1G2", "note": 15},
    {"nom": "Tom", "classe": "1G1", "note": 9},
    {"nom": "Inès", "classe": "1G2", "note": 18},
]
print([e["nom"] for e in table if e["classe"] == "1G2" and e["note"] >= 16])
```

- Garder des **lignes** : c'est une **sélection** (le `if`).
- Garder des **colonnes** : c'est une **projection** (`e["nom"]`).

## 2. Tester la cohérence

Des données réelles contiennent souvent des erreurs. On vérifie notamment :

- les **doublons** : la même ligne, ou le même identifiant, apparaît deux fois ;
- les **valeurs manquantes** : une case vide ;
- les **valeurs impossibles** : une note de 25 sur 20.

```python exec
table = [{"id": 1, "note": 15}, {"id": 2, "note": 25}, {"id": 1, "note": 15}]

vus = {}
for ligne in table:
    if ligne["id"] in vus:
        print("doublon :", ligne["id"])
    vus[ligne["id"]] = True

print([l["id"] for l in table if l["note"] > 20])
```

## L'essentiel

- `[e for e in table if critere]` sélectionne des lignes ; `[e["colonne"] for e in table]` projette une colonne.
- Les critères s'écrivent avec `and`, `or`, `not`.
- Avant d'exploiter une table, on cherche doublons, valeurs manquantes et valeurs impossibles.

## Exercices

::::exercice[QCM : tables et recherche]{niveau=1 type=quiz}
Une question à la fois : la correction s'affiche aussitôt.

1. Dans un fichier CSV, que contient en général la première ligne ?

   - [ ] le premier enregistrement
   - [x] les descripteurs (noms des colonnes)
   - [ ] le nombre de lignes
   - [ ] le séparateur utilisé

   > Les lignes suivantes sont les enregistrements.

1. Pourquoi les CSV français utilisent-ils souvent `;` comme séparateur ?

   - [ ] c'est plus rapide
   - [x] parce que la virgule sert de séparateur décimal en français
   - [ ] parce que la virgule est interdite
   - [ ] pour économiser de la place

   > Avec `12,5` dans une case, la virgule serait ambiguë.

1. Après `csv.DictReader`, quel est le type de la valeur `table[0]["note"]` ?

   - [ ] `int`
   - [ ] `float`
   - [x] `str`
   - [ ] `bool`

   > Tout est lu comme du texte ; il faut convertir.

1. Que vaut `"9" > "15"` en Python ?

   - [x] `True`
   - [ ] `False`
   - [ ] une erreur
   - [ ] `None`

   > Comparaison de chaînes caractère par caractère : '9' > '1'. D'où l'importance de convertir.

1. `[e["nom"] for e in table]` est :

   - [ ] une sélection
   - [x] une projection
   - [ ] un tri
   - [ ] une fusion

   > On garde une colonne pour toutes les lignes.

1. `[e for e in table if e["classe"] == "1G1"]` est :

   - [x] une sélection
   - [ ] une projection
   - [ ] un tri
   - [ ] une fusion

   > On garde certaines lignes entières.

::::

::::exercice[Quelles lignes ?]{niveau=1 type=reponses}
On considère cette table.

```python
t = [{"nom": "Léa", "age": 17, "ville": "Lyon"},
     {"nom": "Tom", "age": 15, "ville": "Lyon"},
     {"nom": "Inès", "age": 17, "ville": "Nantes"}]
```

1. Que s'affiche-t-il ?

   ```python verifier
   t = [{"nom": "Léa", "age": 17, "ville": "Lyon"}, {"nom": "Tom", "age": 15, "ville": "Lyon"}, {"nom": "Inès", "age": 17, "ville": "Nantes"}]
   print([e["nom"] for e in t if e["ville"] == "Lyon"])
   ```

   - ['Léa', 'Tom']

1. Que s'affiche-t-il ?

   ```python verifier
   t = [{"nom": "Léa", "age": 17, "ville": "Lyon"}, {"nom": "Tom", "age": 15, "ville": "Lyon"}, {"nom": "Inès", "age": 17, "ville": "Nantes"}]
   print([e["nom"] for e in t if e["age"] == 17 and e["ville"] != "Lyon"])
   ```

   - ['Inès']

1. Que s'affiche-t-il ?

   ```python verifier
   t = [{"nom": "Léa", "age": 17, "ville": "Lyon"}, {"nom": "Tom", "age": 15, "ville": "Lyon"}, {"nom": "Inès", "age": 17, "ville": "Nantes"}]
   print(len([e for e in t if e["age"] < 17 or e["ville"] == "Nantes"]))
   ```

   - 2
::::

::::exercice[Écrire la recherche]{niveau=1 type=completer}
On veut les noms des élèves de la classe `1G1` ayant une note supérieure ou égale à 10. Complète.

```python trous
admis = [[[e["nom"]]] for e in table if e["classe"] == "1G1" [[and]] e["note"] [[>=]] 10]
```
::::

::::exercice[Interroger une table de films]{niveau=2}
On dispose d'une table de films (déjà convertie) :

```python
films = [
    {"titre": "Le Voyage de Chihiro", "annee": 2001, "duree": 125, "genre": "animation"},
    {"titre": "Intouchables", "annee": 2011, "duree": 112, "genre": "comédie"},
    {"titre": "Wall-E", "annee": 2008, "duree": 98, "genre": "animation"},
    {"titre": "Le Grand Bleu", "annee": 1988, "duree": 168, "genre": "drame"},
]
```

Écris :
- `titres_genre(films, genre)` : les titres des films de ce genre, dans l'ordre de la table ;
- `duree_moyenne(films)` : la durée moyenne (table non vide) ;
- `plus_recent(films)` : le titre du film le plus récent.

```python depart
def titres_genre(films, genre):
    ...

def duree_moyenne(films):
    ...

def plus_recent(films):
    ...
```

```python tests
films = [
    {"titre": "Le Voyage de Chihiro", "annee": 2001, "duree": 125, "genre": "animation"},
    {"titre": "Intouchables", "annee": 2011, "duree": 112, "genre": "comédie"},
    {"titre": "Wall-E", "annee": 2008, "duree": 98, "genre": "animation"},
    {"titre": "Le Grand Bleu", "annee": 1988, "duree": 168, "genre": "drame"},
]
assert titres_genre(films, "animation") == ["Le Voyage de Chihiro", "Wall-E"], "sélection et projection"
assert titres_genre(films, "western") == [], "genre absent"
assert duree_moyenne(films) == 125.75, "moyenne"
assert plus_recent(films) == "Intouchables", "plus récent"
```

:::corrige
```python solution
def titres_genre(films, genre):
    return [f["titre"] for f in films if f["genre"] == genre]

def duree_moyenne(films):
    total = 0
    for f in films:
        total = total + f["duree"]
    return total / len(films)

def plus_recent(films):
    meilleur = films[0]
    for f in films:
        if f["annee"] > meilleur["annee"]:
            meilleur = f
    return meilleur["titre"]
```

Pour `plus_recent`, on garde la **ligne** entière du meilleur, puis on en projette le titre.
:::
::::

::::exercice[Repérer les doublons]{niveau=2}
Écris `doublons(table, cle)` qui renvoie, sans répétition et dans l'ordre où on les découvre, les valeurs de la colonne `cle` qui apparaissent plusieurs fois.

```python depart
def doublons(table, cle):
    ...
```

```python tests
t = [{"id": 1}, {"id": 2}, {"id": 1}, {"id": 3}, {"id": 2}, {"id": 1}]
assert doublons(t, "id") == [1, 2], "deux valeurs répétées"
assert doublons([{"id": 1}], "id") == [], "aucun doublon"
assert doublons([], "id") == [], "table vide"
```

:::corrige
```python solution
def doublons(table, cle):
    vus = {}
    resultat = []
    for ligne in table:
        v = ligne[cle]
        if v in vus and v not in resultat:
            resultat.append(v)
        vus[v] = True
    return resultat
```
:::
::::
