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

Beaucoup de données se présentent sous forme de **tables** : une ligne par élément, une colonne par information.

## 1. Le format CSV

Un fichier **CSV** est un simple fichier texte :

```
nom,classe,note
Léa,1G2,15
Tom,1G1,9
```

- chaque ligne est un **enregistrement** ;
- les valeurs sont séparées par un **séparateur** (`,` ou `;`) ;
- la première ligne contient les **descripteurs**, les noms des colonnes.

## 2. Importer en Python

On obtient un **tableau de dictionnaires** : une ligne = un dictionnaire.

```python
import csv

with open("eleves.csv", encoding="utf-8") as f:
    table = list(csv.DictReader(f, delimiter=","))
```

```python exec
import csv, io
contenu = "nom,classe,note\nLéa,1G2,15\nTom,1G1,9\n"
table = list(csv.DictReader(io.StringIO(contenu)))
print(table[0]["nom"], table[0]["note"])
print(type(table[0]["note"]))
```

:::attention[Tout est lu comme du texte]
`"15"` est une chaîne. Avant de calculer ou de trier, on convertit :

```python
for ligne in table:
    ligne["note"] = int(ligne["note"])
```
:::

## L'essentiel

- CSV : un fichier texte, un séparateur, des descripteurs en première ligne.
- `csv.DictReader` donne un tableau de dictionnaires.
- Les valeurs sont des **chaînes** : il faut les convertir pour calculer.

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
