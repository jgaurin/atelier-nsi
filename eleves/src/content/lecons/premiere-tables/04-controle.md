---
titre: Contrôle du chapitre
resume: "Un contrôle de 55 minutes noté sur 20 sur le traitement des données en tables."
duree: 55
controle: true
objectifs:
  - "Lire un CSV et interroger une table"
  - "Trier et fusionner des tables"
prerequis: [premiere-tables/tri-fusion]
---

## Consignes

Durée : **55 minutes**. Le contrôle est noté sur **20 points**. On considère une table de films représentée par un tableau de dictionnaires, avec les colonnes `titre`, `annee` et `duree`, toutes déjà converties.

```python
films = [{"titre": "Wall-E", "annee": 2008, "duree": 98},
         {"titre": "Up", "annee": 2009, "duree": 96},
         {"titre": "Coco", "annee": 2017, "duree": 105}]
```

## Exercices

::::exercice[Lire du code]{niveau=3 type=reponses points=6}
Chaque question vaut 1,5 point.

1. Que s'affiche-t-il ?

   ```python verifier
   films = [{"titre": "Wall-E", "annee": 2008, "duree": 98}, {"titre": "Up", "annee": 2009, "duree": 96}, {"titre": "Coco", "annee": 2017, "duree": 105}]
   print(films[2]["titre"])
   ```

   - Coco

1. Que s'affiche-t-il ?

   ```python verifier
   films = [{"titre": "Wall-E", "annee": 2008, "duree": 98}, {"titre": "Up", "annee": 2009, "duree": 96}, {"titre": "Coco", "annee": 2017, "duree": 105}]
   print([f["titre"] for f in films if f["duree"] < 100 and f["annee"] > 2008])
   ```

   - ['Up']

1. Que s'affiche-t-il ?

   ```python verifier
   films = [{"titre": "Wall-E", "annee": 2008, "duree": 98}, {"titre": "Up", "annee": 2009, "duree": 96}, {"titre": "Coco", "annee": 2017, "duree": 105}]
   def d(f):
       return f["duree"]
   print(sorted(films, key=d)[0]["titre"])
   ```

   - Up

1. Une colonne contient `"12"` et `"9"` sous forme de chaînes. Laquelle vient en premier dans un tri croissant ?

   - "12"
   - 12

   > Les chaînes se comparent caractère par caractère : `"1"` vient avant `"9"`.
::::

::::exercice[Compléter]{niveau=3 type=completer points=4}
Chaque case vaut 0,5 point. La fonction renvoie la durée moyenne des films sortis à partir de l'année `a`, ou `None` s'il n'y en a aucun.

```python trous
def duree_moyenne(films, a):
    selection = [[[f["duree"]]] for f in [[films]] if f["annee"] [[>=]] a]
    if len(selection) == [[0]]:
        return [[None]]
    total = 0
    for d in [[selection]]:
        total = total + [[d]]
    return total / [[len(selection)]]
```
::::

::::exercice[Écrire une recherche]{niveau=3 points=5}
Écris `plus_long(films)` qui renvoie le titre du film le plus long d'une table non vide.

```python depart
def plus_long(films):
    ...
```

```python tests
f = [{"titre": "A", "duree": 98}, {"titre": "B", "duree": 120}, {"titre": "C", "duree": 96}]
assert plus_long(f) == "B", "au milieu"
assert plus_long([{"titre": "Z", "duree": 1}]) == "Z", "une seule ligne"
```

:::corrige
```python solution
def plus_long(films):
    meilleur = films[0]
    for f in films:
        if f["duree"] > meilleur["duree"]:
            meilleur = f
    return meilleur["titre"]
```
:::
::::

::::exercice[Fusionner]{niveau=3 points=5}
Écris `ajoute_pays(villes, pays)` : `villes` est une table de lignes `{"ville": ..., "code": ...}`, `pays` un dictionnaire qui associe à chaque code le nom du pays. La fonction renvoie une nouvelle table de lignes `{"ville": ..., "pays": ...}`. Les villes dont le code est inconnu sont ignorées.

```python depart
def ajoute_pays(villes, pays):
    ...
```

```python tests
v = [{"ville": "Lyon", "code": "FR"}, {"ville": "Gand", "code": "BE"}, {"ville": "Oslo", "code": "NO"}]
p = {"FR": "France", "BE": "Belgique"}
assert ajoute_pays(v, p) == [{"ville": "Lyon", "pays": "France"}, {"ville": "Gand", "pays": "Belgique"}], "fusion"
assert ajoute_pays([], p) == [], "table vide"
```

:::corrige
```python solution
def ajoute_pays(villes, pays):
    resultat = []
    for ligne in villes:
        if ligne["code"] in pays:
            resultat.append({"ville": ligne["ville"], "pays": pays[ligne["code"]]})
    return resultat
```
:::
::::
