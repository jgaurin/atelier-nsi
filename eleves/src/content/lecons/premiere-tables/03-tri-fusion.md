---
titre: Trier et fusionner
resume: "Trier une table selon une colonne et construire une table à partir de deux autres."
duree: 35
objectifs:
  - "Trier une table suivant une colonne"
  - "Construire une table en combinant deux tables"
prerequis: [premiere-tables/recherche]
---

Deux opérations reviennent sans cesse sur les tables : les **trier**, pour les classer, et les **fusionner**, pour réunir des informations venues de deux tables.

## 1. Trier une table

Trier une table de dictionnaires pose une question : trier selon **quoi** ? Le nom, la note, l'âge ? On le dit à Python avec le paramètre `key`, auquel on donne une fonction qui renvoie la valeur selon laquelle trier.

```python exec
table = [{"nom": "Tom", "note": 9}, {"nom": "Léa", "note": 15}, {"nom": "Inès", "note": 18}]

def note(e):
    return e["note"]

print([e["nom"] for e in sorted(table, key=note)])
print([e["nom"] for e in sorted(table, key=note, reverse=True)])
```

- `sorted` renvoie une **nouvelle** table triée ; la table d'origine ne change pas.
- `key=note` : pour comparer deux lignes, Python compare leurs notes.
- `reverse=True` trie dans l'ordre décroissant.

On passe la fonction `note` **sans parenthèses** : `key=note`. On donne la fonction elle-même, que `sorted` appellera sur chaque ligne. `key=note()` provoquerait une erreur.

## 2. Trier selon deux critères

Ce tri est **stable** : deux lignes qui ont la même note gardent leur ordre de départ. On s'en sert pour trier selon deux critères.

:::exemple
On veut classer par note décroissante et, à note égale, par ordre alphabétique. On trie d'abord par nom, le critère **secondaire**, puis par note, le critère **principal**. Grâce à la stabilité, les élèves de même note restent dans l'ordre alphabétique obtenu au premier tri.
:::

## 3. Fusionner deux tables

Une table donne les noms des élèves, une autre leurs notes. Elles partagent une **colonne commune**, l'identifiant de l'élève.

| id | nom |
| --- | --- |
| 1 | Léa |
| 2 | Tom |

| id | note |
| --- | --- |
| 2 | 9 |
| 1 | 15 |

Fusionner, c'est associer les lignes qui ont **la même valeur** dans la colonne commune : la note 9 va avec Tom, la note 15 avec Léa.

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

Pour chaque note, on cherche l'élève qui a le même identifiant, et on construit une nouvelle ligne qui réunit les deux informations.

:::attention
Les valeurs de la colonne commune doivent appartenir au même **domaine de valeurs**. Si un identifiant est écrit `"007"` dans une table et `7` dans l'autre, ils ne seront jamais égaux, et la fusion sera vide. Il faut d'abord les harmoniser.
:::

## L'essentiel

- `sorted(table, key=fonction, reverse=True)` renvoie une nouvelle table triée ; on passe la fonction sans parenthèses.
- Le tri est stable : pour deux critères, on trie d'abord selon le critère secondaire.
- Fusionner : associer les lignes qui ont la même valeur dans une colonne commune.
- Cette colonne doit avoir le même domaine de valeurs dans les deux tables.

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

::::exercice[Clients et commandes]{niveau=3}
Une table `clients` contient des lignes `{"id": "007", "nom": "Ada"}`. Une table `commandes` contient des lignes `{"client": 7, "montant": 20}`. L'identifiant du client est du texte d'un côté, et un entier de l'autre.

1. Écris `harmoniser(clients)`, qui renvoie une nouvelle table où `id` est un entier.
2. Écris `fusion(clients, commandes)`, qui reçoit une table `clients` harmonisée et renvoie une table de lignes `{"nom": ..., "montant": ...}`, une par commande. On ignore les commandes dont le client est inconnu.
3. Écris `classement(lignes)`, qui reçoit le résultat de `fusion` et renvoie les noms des clients, sans répétition, du total dépensé le plus élevé au plus faible.
4. À l'écrit : que se serait-il passé en fusionnant sans `harmoniser` ? Quelle notion du cours cela illustre-t-il ?

```python depart
def harmoniser(clients):
    ...

def fusion(clients, commandes):
    ...

def classement(lignes):
    ...
```

```python tests
cl = [{"id": "007", "nom": "Ada"}, {"id": "012", "nom": "Bob"}]
h = harmoniser(cl)
assert h == [{"id": 7, "nom": "Ada"}, {"id": 12, "nom": "Bob"}], "identifiants entiers"
assert cl[0]["id"] == "007", "table d'origine intacte"
co = [{"client": 12, "montant": 5}, {"client": 7, "montant": 20}, {"client": 12, "montant": 30}, {"client": 99, "montant": 1}]
f = fusion(h, co)
assert f == [{"nom": "Bob", "montant": 5}, {"nom": "Ada", "montant": 20}, {"nom": "Bob", "montant": 30}], "fusion"
assert classement(f) == ["Bob", "Ada"], "classement"
assert classement([]) == [], "aucune ligne"
```

:::corrige
```python solution
def harmoniser(clients):
    return [{"id": int(c["id"]), "nom": c["nom"]} for c in clients]

def fusion(clients, commandes):
    resultat = []
    for co in commandes:
        for c in clients:
            if c["id"] == co["client"]:
                resultat.append({"nom": c["nom"], "montant": co["montant"]})
    return resultat

def total(couple):
    return couple[1]

def classement(lignes):
    totaux = {}
    for l in lignes:
        if l["nom"] in totaux:
            totaux[l["nom"]] = totaux[l["nom"]] + l["montant"]
        else:
            totaux[l["nom"]] = l["montant"]
    return [c[0] for c in sorted(totaux.items(), key=total, reverse=True)]
```

**Question 4.** `"007"` n'est jamais égal à `7` : la fusion serait vide. Les deux colonnes doivent appartenir au même **domaine de valeurs**.
:::
::::
