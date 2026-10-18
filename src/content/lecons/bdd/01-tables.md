---
titre: Données en table
resume: Manipuler des données tabulaires (CSV) en Python — lire, sélectionner, projeter, trier, fusionner, agréger — avant de passer aux bases de données.
duree: 65
objectifs:
  - Lire un fichier CSV en une liste de dictionnaires et convertir les types
  - Sélectionner des lignes, projeter des colonnes et trier selon un ou plusieurs critères
  - Fusionner deux tables selon une clé commune et détecter les incohérences
  - Agréger des données (compter, sommer, moyenne par groupe)
prerequis: [python/modules-fichiers, python/tuples-dictionnaires]
programme: [id-tables, nsi1-tables, snt-donnees]
cartes:
  - q: Qu'est-ce qu'un fichier CSV ?
    r: "Un fichier texte qui représente une table : une ligne par enregistrement, des champs séparés par un délimiteur (`,` ou `;`), souvent une première ligne d'en-tête avec les noms des colonnes."
  - q: Comment représenter une table en Python ?
    r: "Par une liste de dictionnaires (une ligne = un dictionnaire colonne → valeur), ou une liste de tuples avec un en-tête séparé."
  - q: Sélection ou projection ?
    r: "**Sélection** : garder certaines **lignes** (selon une condition). **Projection** : garder certaines **colonnes**."
  - q: Comment trier une liste de dictionnaires par note décroissante, puis par nom ?
    r: "`sorted(t, key=lambda e: (-e[\"note\"], e[\"nom\"]))`, ou deux tris stables successifs (par nom, puis par note décroissante)."
  - q: Comment fusionner (joindre) deux tables efficacement ?
    r: "On indexe l'une des tables par sa clé dans un dictionnaire, puis on parcourt l'autre : coût linéaire au lieu de quadratique."
  - q: Pourquoi faut-il convertir les valeurs lues dans un CSV ?
    r: "Elles sont toujours lues comme des **chaînes** : `\"12\" + \"3\"` donne `\"123\"`, et le tri est alphabétique (`\"10\" < \"9\"`)."
---

Les notes d'une classe, les horaires de trains, les résultats d'une élection, les données ouvertes publiées par l'État : une
grande partie des données du monde est rangée en **tables** (lignes et colonnes). Le format d'échange le plus simple est le
**CSV**, que tout tableur sait lire et écrire. Avant d'utiliser un système de gestion de bases de données, il faut savoir
manipuler ces tables à la main en Python : c'est au programme de première NSI (« traitement de données en tables ») et de SNT
(« données structurées »), et c'est la meilleure façon de comprendre ce que font les requêtes SQL.

## 1. Une table, des enregistrements, des attributs

Une **table** est un ensemble d'**enregistrements** (les lignes) qui ont tous les mêmes **attributs** (les colonnes, aussi appelés
champs ou descripteurs). Chaque attribut a un nom et un type de valeurs.

| nom     | prenom | classe | note |
|---------|--------|--------|------|
| Martin  | Léa    | 1G1    | 14.5 |
| Durand  | Adam   | 1G1    | 9    |
| Petit   | Manon  | 1G2    | 16   |
| Leroy   | Jade   | 1G2    | 12   |

Le fichier CSV correspondant :

```
nom;prenom;classe;note
Martin;Léa;1G1;14.5
Durand;Adam;1G1;9
Petit;Manon;1G2;16
Leroy;Jade;1G2;12
```

## 2. Lire une table en Python

On représente une table par une **liste de dictionnaires** : chaque ligne est un dictionnaire attribut → valeur. Le module
`csv` fait la lecture ; il faut ensuite **convertir** les nombres, car tout est lu comme des chaînes.

```python exec
import csv, io

contenu = """nom;prenom;classe;note
Martin;Léa;1G1;14.5
Durand;Adam;1G1;9
Petit;Manon;1G2;16
Leroy;Jade;1G2;12
"""
# io.StringIO fait d'une chaîne un « fichier » : avec un vrai fichier, on écrirait open("notes.csv", encoding="utf-8")
eleves = list(csv.DictReader(io.StringIO(contenu), delimiter=";"))
print(eleves[0])
for e in eleves:
    e["note"] = float(e["note"])       # conversion indispensable
print(eleves[0])
```

## 3. Sélectionner, projeter, trier

**Sélection** (garder des lignes) et **projection** (garder des colonnes) s'écrivent naturellement avec des compréhensions :

```python exec
eleves = [{"nom": "Martin", "prenom": "Léa", "classe": "1G1", "note": 14.5},
          {"nom": "Durand", "prenom": "Adam", "classe": "1G1", "note": 9.0},
          {"nom": "Petit", "prenom": "Manon", "classe": "1G2", "note": 16.0},
          {"nom": "Leroy", "prenom": "Jade", "classe": "1G2", "note": 12.0}]

admis = [e for e in eleves if e["note"] >= 10]                     # sélection
noms = [e["nom"] for e in eleves]                                   # projection sur une colonne
fiches = [{"nom": e["nom"], "note": e["note"]} for e in admis]      # sélection + projection
print(fiches)

par_note = sorted(eleves, key=lambda e: e["note"], reverse=True)   # tri décroissant
print([e["nom"] for e in par_note])
classe_puis_nom = sorted(eleves, key=lambda e: (e["classe"], e["nom"]))   # deux critères
print([(e["classe"], e["nom"]) for e in classe_puis_nom])
```

Le paramètre `key` donne, pour chaque ligne, la valeur selon laquelle trier ; un **tuple** permet plusieurs critères
(d'abord la classe, puis le nom en cas d'égalité). Les tris de Python sont **stables** : on peut aussi trier d'abord par nom,
puis par classe.

## 4. Fusionner deux tables

Souvent, l'information est répartie entre plusieurs tables : une table des élèves avec un identifiant de classe, une table des
classes avec leur professeur principal. Pour les **fusionner**, on associe les lignes qui ont la même valeur de **clé**.

```python exec
eleves = [{"nom": "Martin", "classe": "1G1"}, {"nom": "Petit", "classe": "1G2"},
          {"nom": "Durand", "classe": "1G1"}, {"nom": "David", "classe": "TG3"}]
classes = [{"classe": "1G1", "pp": "M. Ricard"}, {"classe": "1G2", "pp": "Mme Ndiaye"}]

index = {c["classe"]: c for c in classes}        # on indexe une table par sa clé
fusion = []
for e in eleves:
    if e["classe"] in index:
        fusion.append({**e, "pp": index[e["classe"]]["pp"]})
    else:
        print("classe inconnue pour", e["nom"])
print(fusion)
```

Avec une double boucle (pour chaque élève, chercher sa classe dans la liste), le coût serait $\Theta(n \times m)$ ; avec un
dictionnaire, il est **linéaire** en moyenne. La ligne de David, dont la classe n'existe pas, révèle une **incohérence** :
c'est exactement le problème que résoudra la notion de **clé étrangère** dans le modèle relationnel.

## 5. Agréger

Calculer un nombre par groupe (effectif, moyenne par classe…) : on parcourt la table en accumulant dans un dictionnaire.

```python exec
eleves = [{"nom": "Martin", "classe": "1G1", "note": 14.5}, {"nom": "Durand", "classe": "1G1", "note": 9.0},
          {"nom": "Petit", "classe": "1G2", "note": 16.0}, {"nom": "Leroy", "classe": "1G2", "note": 12.0}]
somme, effectif = {}, {}
for e in eleves:
    c = e["classe"]
    somme[c] = somme.get(c, 0) + e["note"]
    effectif[c] = effectif.get(c, 0) + 1
print({c: somme[c] / effectif[c] for c in somme})
```

C'est l'équivalent du `GROUP BY` de SQL.

:::prof
Le programme de première demande d'« importer une table depuis un fichier CSV », de « rechercher les lignes vérifiant des
critères », de « trier une table suivant une colonne » et de « construire une nouvelle table en combinant les données de deux
tables ». Les données ouvertes (data.gouv.fr, INSEE) offrent des jeux réels motivants ; prévoir les pièges classiques :
séparateur `;` et décimales à virgule, encodage, valeurs manquantes, et l'oubli de conversion (tri alphabétique de nombres).
:::

## Exemple guidé

**Problème.** À partir d'une table des ventes d'une coopérative scolaire (`date;article;quantite;prix_unitaire`), calculer le
chiffre d'affaires par article, trié du plus grand au plus petit, et repérer les lignes invalides.

**1. Lire et nettoyer.** On convertit `quantite` en entier et `prix_unitaire` en nombre (la virgule décimale française doit
être remplacée par un point). Une ligne dont la conversion échoue est mise de côté.

**2. Agréger** le montant `quantite × prix_unitaire` par article. **3. Trier** les couples (article, total).

```python exec
import csv, io

ventes = """date;article;quantite;prix_unitaire
2026-09-12;stylo;10;1,20
2026-09-12;cahier;4;2,50
2026-09-13;stylo;5;1,20
2026-09-13;gourde;2;8,90
2026-09-14;cahier;abc;2,50
2026-09-14;gourde;1;8,90
"""
totaux, invalides = {}, []
for ligne in csv.DictReader(io.StringIO(ventes), delimiter=";"):
    try:
        q = int(ligne["quantite"])
        p = float(ligne["prix_unitaire"].replace(",", "."))
    except ValueError:
        invalides.append(ligne)
        continue
    totaux[ligne["article"]] = totaux.get(ligne["article"], 0) + q * p

for article, total in sorted(totaux.items(), key=lambda c: c[1], reverse=True):
    print(f"{article:8s} {total:7.2f} €")
print(len(invalides), "ligne(s) invalide(s) :", invalides)
```

**4. Analyser.** La ligne `cahier;abc` est ignorée et signalée : on ne la corrige pas en silence. On remarque aussi que le prix
d'un article est répété à chaque vente : si le prix change, il faudra modifier plusieurs lignes (risque d'incohérence). Le
modèle relationnel propose de ranger les articles et leur prix dans une table à part.

## L'essentiel

- Table = enregistrements (lignes) × attributs (colonnes) ; CSV = texte, séparateur, en-tête.
- En Python : liste de dictionnaires ; `csv.DictReader(f, delimiter=";")` ; **convertir** les types (tout est lu en chaînes).
- Sélection (lignes) : `[e for e in t if …]` ; projection (colonnes) : `[e["col"] for e in t]` ; tri : `sorted(t, key=…)`, tuple pour plusieurs critères, tris stables.
- Fusion de deux tables sur une clé : indexer l'une dans un dictionnaire (coût linéaire) ; repérer les clés absentes.
- Agrégation par groupe : accumuler dans un dictionnaire (équivalent de `GROUP BY`).

## Exercices

::::exercice[Sélection ou projection]{niveau=1}
L'instruction `[e["ville"] for e in clients]` réalise :

- [ ] une sélection
- [x] une projection
- [ ] une fusion
- [ ] un tri

:::corrige
On garde une **colonne** (l'attribut `ville`) de toutes les lignes : c'est une projection. Une sélection garderait certaines
lignes selon une condition.
:::
::::

::::exercice[Le piège des chaînes]{niveau=1}
On lit un CSV de notes et on trie avec `sorted(t, key=lambda e: e["note"])` sans convertir. Pour les notes `"9"`, `"12"`,
`"15.5"`, quel ordre obtient-on ?

- [ ] 9, 12, 15.5
- [x] 12, 15.5, 9
- [ ] 15.5, 12, 9
- [ ] une erreur

:::corrige
Les notes sont des **chaînes** : elles sont comparées caractère par caractère, `"1" < "9"`. On obtient `"12"`, `"15.5"`, `"9"`.
Il faut convertir avec `float` avant de trier.
:::
::::

::::exercice[Lire et convertir]{niveau=2}
Écris `lire_table(texte)` qui transforme le contenu d'un CSV (séparateur `;`, en-tête) en liste de dictionnaires, en convertissant
automatiquement chaque valeur en `int` si possible, sinon en `float` si possible, sinon en la laissant en chaîne.

```python depart
import csv, io

def lire_table(texte):
    ...
```

```python tests
t = lire_table("nom;age;taille\nLéa;16;1.68\nHugo;17;1.75\n")
assert t == [{"nom": "Léa", "age": 16, "taille": 1.68}, {"nom": "Hugo", "age": 17, "taille": 1.75}], "conversion des types"
assert lire_table("a;b\n") == [], "en-tête seul"
assert lire_table("code;x\n007;2.5e3\n")[0] == {"code": 7, "x": 2500.0}, "conversions automatiques"
```

:::corrige
```python solution
import csv, io

def convertir(v):
    for typ in (int, float):
        try:
            return typ(v)
        except ValueError:
            pass
    return v

def lire_table(texte):
    lignes = csv.DictReader(io.StringIO(texte), delimiter=";")
    return [{k: convertir(v) for k, v in ligne.items()} for ligne in lignes]
```
Attention : la conversion automatique peut être une erreur de conception (le code `"007"` devient `7` : on perd les zéros). Pour
des identifiants, des codes postaux ou des numéros de téléphone, on garde des chaînes.
:::
::::

::::exercice[Trier selon deux critères]{niveau=2}
Écris `classement(eleves)` qui renvoie la liste des noms triés par **note décroissante**, puis par **nom croissant** en cas
d'égalité. `eleves` est une liste de dictionnaires avec les clés `"nom"` et `"note"`.

```python depart
def classement(eleves):
    ...
```

```python tests
e = [{"nom": "Petit", "note": 12}, {"nom": "Durand", "note": 15}, {"nom": "Martin", "note": 12}, {"nom": "Leroy", "note": 18}]
assert classement(e) == ["Leroy", "Durand", "Martin", "Petit"], "égalité départagée par le nom"
assert classement([]) == [], "table vide"
```

:::corrige
```python solution
def classement(eleves):
    tries = sorted(eleves, key=lambda e: (-e["note"], e["nom"]))
    return [e["nom"] for e in tries]
```
Le signe moins inverse l'ordre des notes (nombres) tout en gardant l'ordre croissant des noms. Variante avec deux tris
stables : `sorted(sorted(eleves, key=nom), key=note, reverse=True)`.
:::
::::

::::exercice[Fusionner deux tables]{niveau=2}
Écris `fusionner(commandes, clients)` : `commandes` contient des dictionnaires `{"id_client", "montant"}` et `clients` des
dictionnaires `{"id_client", "nom"}`. Renvoie la liste des `{"nom", "montant"}` pour chaque commande dont le client existe, dans
l'ordre des commandes, en temps linéaire.

```python depart
def fusionner(commandes, clients):
    ...
```

```python tests
cl = [{"id_client": 1, "nom": "Ana"}, {"id_client": 2, "nom": "Bilal"}]
co = [{"id_client": 2, "montant": 30}, {"id_client": 3, "montant": 12}, {"id_client": 1, "montant": 50}]
assert fusionner(co, cl) == [{"nom": "Bilal", "montant": 30}, {"nom": "Ana", "montant": 50}], "client 3 inconnu ignoré"
assert fusionner([], cl) == [], "aucune commande"
```

:::corrige
```python solution
def fusionner(commandes, clients):
    nom_de = {c["id_client"]: c["nom"] for c in clients}
    return [{"nom": nom_de[c["id_client"]], "montant": c["montant"]}
            for c in commandes if c["id_client"] in nom_de]
```
L'index `nom_de` donne le nom d'un client en temps constant moyen. C'est une **jointure** (la même opération que `JOIN` en SQL).
:::
::::

::::exercice[Moyenne par groupe]{niveau=3}
Écris `moyennes_par(table, groupe, valeur)` qui renvoie un dictionnaire associant à chaque valeur de l'attribut `groupe` la
moyenne de l'attribut `valeur`, arrondie à 2 décimales.

```python depart
def moyennes_par(table, groupe, valeur):
    ...
```

```python tests
t = [{"classe": "1G1", "note": 14.5}, {"classe": "1G1", "note": 9}, {"classe": "1G2", "note": 16}, {"classe": "1G2", "note": 12}, {"classe": "1G2", "note": 11}]
assert moyennes_par(t, "classe", "note") == {"1G1": 11.75, "1G2": 13.0}, "par classe"
assert moyennes_par([], "classe", "note") == {}, "table vide"
v = [{"ville": "Lyon", "age": 30}, {"ville": "Lyon", "age": 41}]
assert moyennes_par(v, "ville", "age") == {"Lyon": 35.5}, "autre table"
```

:::corrige
```python solution
def moyennes_par(table, groupe, valeur):
    somme, nombre = {}, {}
    for ligne in table:
        g = ligne[groupe]
        somme[g] = somme.get(g, 0) + ligne[valeur]
        nombre[g] = nombre.get(g, 0) + 1
    return {g: round(somme[g] / nombre[g], 2) for g in somme}
```
En SQL : `SELECT classe, ROUND(AVG(note), 2) FROM t GROUP BY classe;`.
:::
::::

::::exercice[Concevoir le traitement d'un fichier réel]{niveau=4 duree=20}
Un professeur exporte de son logiciel de vie scolaire un fichier `absences.csv` (séparateur `;`, encodage inconnu) :
`nom;prenom;classe;date;demi_journees;motif`. Il veut, pour chaque classe, le nombre total de demi-journées d'absence non
justifiées (motif vide) et la liste des trois élèves les plus absents.

1. Quels problèmes concrets risques-tu de rencontrer à la lecture du fichier, et comment les traites-tu ?
2. Décris (en pseudo-code ou en Python) l'algorithme complet : lecture, nettoyage, agrégations, tris.
3. Évalue son coût en fonction du nombre de lignes $n$ (et du nombre d'élèves $e$).
4. Quelles précautions liées aux données personnelles (RGPD) doit prendre le professeur ?

:::criteres
- Problèmes identifiés : encodage (essayer UTF-8, sinon Latin-1/Windows-1252), séparateur, en-tête, lignes vides ou incomplètes, `demi_journees` non numérique, homonymes (utiliser nom + prénom + classe, ou un identifiant), espaces parasites.
- Algorithme : lecture avec `csv.DictReader`, conversion et filtrage des lignes invalides (signalées), dictionnaire classe → total des non justifiées, dictionnaire (élève, classe) → total, puis pour chaque classe tri des élèves par total décroissant et 3 premiers.
- Coût : lecture et agrégation en $\Theta(n)$ ; tris en $O(e \log e)$ au total ; linéaire ou quasi linéaire.
- RGPD : données personnelles d'élèves mineurs ; usage limité à la finalité pédagogique, pas de diffusion, stockage sécurisé, suppression après usage, pas d'envoi sur des services en ligne non validés par l'établissement.
:::

:::corrige
1. **Encodage** : ouvrir en UTF-8, et en cas d'erreur (`UnicodeDecodeError`) réessayer en `cp1252` ; **séparateur** et **en-tête** à
   vérifier ; **lignes vides ou incomplètes** ; `demi_journees` vide ou non numérique (`int` dans un `try`) ; **espaces** autour des
   valeurs (`strip`) ; **homonymes** : identifier un élève par (nom, prénom, classe), ou mieux par un identifiant s'il existe. Les
   lignes invalides sont comptées et signalées, pas ignorées en silence.
2. ```python
   total_classe, total_eleve = {}, {}
   for ligne in csv.DictReader(f, delimiter=";"):
       try:
           n = int(ligne["demi_journees"])
       except ValueError:
           invalides.append(ligne); continue
       if ligne["motif"].strip() == "":                       # non justifiée
           c = ligne["classe"].strip()
           eleve = (ligne["nom"].strip(), ligne["prenom"].strip(), c)
           total_classe[c] = total_classe.get(c, 0) + n
           total_eleve[eleve] = total_eleve.get(eleve, 0) + n
   par_classe = {}
   for eleve, n in total_eleve.items():
       par_classe.setdefault(eleve[2], []).append((n, eleve))
   top3 = {c: sorted(l, reverse=True)[:3] for c, l in par_classe.items()}
   ```
   (Le tri porte sur le nombre de demi-journées ; pour la question posée, seules les absences non justifiées comptent.)
3. Une passe sur les $n$ lignes, chaque mise à jour de dictionnaire en temps constant moyen : $\Theta(n)$. Puis les tris par
   classe : en tout $O(e \log e)$ pour $e$ élèves. Le coût total est donc quasi linéaire.
4. Ce sont des **données personnelles** d'élèves (souvent mineurs), relatives à leur scolarité : le traitement doit rester limité
   à la finalité pédagogique et au cadre de l'établissement, le fichier stocké de façon sécurisée (pas sur un ordinateur partagé
   ni sur un service en ligne non autorisé), non diffusé (pas de classement affiché), et supprimé quand il n'est plus utile.
:::
::::
