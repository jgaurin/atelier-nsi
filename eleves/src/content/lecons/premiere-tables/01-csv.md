---
titre: Importer une table
resume: "Le format CSV et sa lecture en Python sous forme de tableau de dictionnaires."
duree: 30
objectifs:
  - "Décrire le format CSV"
  - "Importer un fichier CSV en Python"
  - "Convertir les valeurs numériques lues"
prerequis: [premiere-construits/dictionnaires]
---

Les données ouvertes, les résultats d'un club, l'export d'un tableur : beaucoup de données se présentent sous forme de **tables**. Une ligne par élément, une colonne par information.

## 1. Le format CSV

Un fichier **CSV** est un simple fichier texte :

```
nom,classe,note
Léa,1G2,15
Tom,1G1,9
```

- La première ligne contient les **descripteurs** : les noms des colonnes.
- Chaque ligne suivante est un **enregistrement** : un élément de la table.
- Les valeurs sont séparées par un **séparateur**, ici la virgule. En France, on trouve souvent le point-virgule, car la virgule sert déjà à écrire les nombres décimaux.

Comme c'est du texte, n'importe quel logiciel peut le lire : un tableur, un éditeur de texte, ou un programme Python.

## 2. Importer en Python

Le module `csv` lit le fichier et donne un **tableau de dictionnaires** : un dictionnaire par ligne, dont les clés sont les descripteurs.

```python
import csv

with open("eleves.csv", encoding="utf-8") as f:
    table = list(csv.DictReader(f, delimiter=","))
```

- `open` ouvre le fichier, en précisant son encodage.
- `csv.DictReader` lit chaque ligne et en fait un dictionnaire.
- `delimiter` indique le séparateur.

Voici ce qu'on obtient, avec un texte qui joue le rôle du fichier :

```python exec
import csv, io
contenu = "nom,classe,note\nLéa,1G2,15\nTom,1G1,9\n"
table = list(csv.DictReader(io.StringIO(contenu)))
print(table[0])
print(table[0]["nom"], table[0]["note"])
print(type(table[0]["note"]))
```

`table[0]` est la première ligne : `{"nom": "Léa", "classe": "1G2", "note": "15"}`.

## 3. Tout est lu comme du texte

Remarque le type affiché : `str`. Le fichier ne dit pas que 15 est un nombre : `"15"` est lu comme une chaîne. Cela pose deux problèmes :

- on ne peut pas calculer : `"15" + 1` provoque une erreur ;
- les comparaisons sont fausses : `"9" > "15"` vaut `True`, car les chaînes se comparent caractère par caractère, et `"9"` vient après `"1"`.

Avant de calculer ou de trier, on **convertit** les colonnes numériques :

```python
for ligne in table:
    ligne["note"] = int(ligne["note"])
```

## L'essentiel

- CSV : un fichier texte ; une ligne de descripteurs, puis une ligne par enregistrement, avec un séparateur.
- `csv.DictReader` donne un tableau de dictionnaires.
- Toutes les valeurs lues sont des **chaînes** : il faut convertir les nombres avant de calculer ou de trier.

## Exercices

::::exercice[Lire un CSV]{niveau=1 type=reponses}
On considère le fichier suivant.

```
ville;pays;habitants
Lyon;France;520000
Porto;Portugal;230000
Gand;Belgique;265000
```

1. Quel est le séparateur ?

   - ;
   - point-virgule

1. Combien de descripteurs y a-t-il ?

   - 3

1. Combien d'enregistrements y a-t-il ?

   - 3

   > La première ligne contient les descripteurs : ce n'est pas un enregistrement.

1. Quel est le descripteur de la valeur `Portugal` ?

   - pays
::::

::::exercice[Que s'affiche-t-il ?]{niveau=1 type=reponses}
La table `t` vaut `[{"nom": "Léa", "note": "15"}, {"nom": "Tom", "note": "9"}]`. Attention : les notes sont des chaînes.

1. Que s'affiche-t-il ?

   ```python verifier
   t = [{"nom": "Léa", "note": "15"}, {"nom": "Tom", "note": "9"}]
   print(t[1]["nom"])
   ```

   - Tom

1. Que s'affiche-t-il ?

   ```python verifier
   t = [{"nom": "Léa", "note": "15"}, {"nom": "Tom", "note": "9"}]
   print(t[0]["note"] + t[1]["note"])
   ```

   - 159

   > Les notes sont des chaînes : `+` les met bout à bout.

1. Que s'affiche-t-il ?

   ```python verifier
   t = [{"nom": "Léa", "note": "15"}, {"nom": "Tom", "note": "9"}]
   print(int(t[0]["note"]) + int(t[1]["note"]))
   ```

   - 24

1. Réponds `True` ou `False` : que s'affiche-t-il ?

   ```python verifier
   print("9" > "15")
   ```

   - True

   > Les chaînes se comparent caractère par caractère.
::::

::::exercice[Compléter l'import]{niveau=2 type=completer}
Ce code lit un fichier séparé par des points-virgules, puis convertit la colonne `age` en entier. Complète-le.

```python trous
import csv

with open("clients.csv", encoding="utf-8") as f:
    table = list(csv.[[DictReader]](f, delimiter="[[;]]"))

for ligne in [[table]]:
    ligne["age"] = [[int]](ligne["age"])
```
::::

::::exercice[Charger un CSV]{niveau=2}
Écris `charger(contenu, sep)` qui reçoit le **texte** d'un fichier CSV (descripteurs sur la première ligne) et son séparateur, et renvoie le
tableau de dictionnaires correspondant, sans utiliser le module `csv`. On utilisera `contenu.split("\n")` pour couper en lignes et
`ligne.split(sep)` pour couper une ligne en valeurs. Les lignes vides sont ignorées. Les valeurs restent des chaînes.

```python depart
def charger(contenu, sep):
    ...
```

```python tests
t = charger("nom;note\nLéa;15\nTom;9\n", ";")
assert t == [{"nom": "Léa", "note": "15"}, {"nom": "Tom", "note": "9"}], "deux lignes"
assert charger("a,b\n", ",") == [], "aucun enregistrement"
assert charger("x,y,z\n1,2,3", ",") == [{"x": "1", "y": "2", "z": "3"}], "pas de saut de ligne final"
```

:::corrige
```python solution
def charger(contenu, sep):
    lignes = contenu.split("\n")
    descripteurs = lignes[0].split(sep)
    table = []
    for ligne in lignes[1:]:
        if ligne != "":
            valeurs = ligne.split(sep)
            enregistrement = {}
            for i in range(len(descripteurs)):
                enregistrement[descripteurs[i]] = valeurs[i]
            table.append(enregistrement)
    return table
```

C'est ce que fait `csv.DictReader`, en plus robuste (il gère les guillemets et les séparateurs à l'intérieur des valeurs).
:::
::::

::::exercice[Des villes européennes]{niveau=3}
Une table, importée d'un fichier CSV, contient des lignes comme `{"ville": "Lyon", "pays": "France", "hab": "520000"}`. Toutes les valeurs sont donc des chaînes.

1. Écris `convertir(table)`, qui renvoie une **nouvelle** table où `hab` est un entier.
2. Écris `habitants_par_pays(table)`, qui reçoit une table convertie et renvoie un dictionnaire associant à chaque pays son nombre total d'habitants.
3. Écris `pays_le_plus_peuple(table)`, qui reçoit une table convertie non vide et renvoie le nom de ce pays.
4. À l'écrit : sans conversion, que vaut `"9" > "15"` ? Pourquoi ?

```python depart
def convertir(table):
    ...

def habitants_par_pays(table):
    ...

def pays_le_plus_peuple(table):
    ...
```

```python tests
brut = [{"ville": "Lyon", "pays": "France", "hab": "520000"}, {"ville": "Porto", "pays": "Portugal", "hab": "230000"}, {"ville": "Nice", "pays": "France", "hab": "340000"}]
t = convertir(brut)
assert t[0]["hab"] == 520000, "conversion"
assert brut[0]["hab"] == "520000", "table d'origine intacte"
assert t[0]["ville"] == "Lyon", "autres colonnes conservées"
assert habitants_par_pays(t) == {"France": 860000, "Portugal": 230000}, "total par pays"
assert habitants_par_pays([]) == {}, "table vide"
assert pays_le_plus_peuple(t) == "France", "le plus peuplé"
```

:::corrige
```python solution
def convertir(table):
    resultat = []
    for ligne in table:
        resultat.append({"ville": ligne["ville"], "pays": ligne["pays"], "hab": int(ligne["hab"])})
    return resultat

def habitants_par_pays(table):
    total = {}
    for ligne in table:
        p = ligne["pays"]
        if p in total:
            total[p] = total[p] + ligne["hab"]
        else:
            total[p] = ligne["hab"]
    return total

def pays_le_plus_peuple(table):
    total = habitants_par_pays(table)
    meilleur = None
    for p in total:
        if meilleur is None or total[p] > total[meilleur]:
            meilleur = p
    return meilleur
```

**Question 4.** `"9" > "15"` vaut `True` : les chaînes se comparent caractère par caractère, et `"9"` vient après `"1"`.
:::
::::
