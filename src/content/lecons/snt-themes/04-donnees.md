---
titre: Les données structurées et leur traitement
resume: "Le cours de SNT sur les données : donnée et métadonnée, collections d'objets et descripteurs, tables et fichiers CSV, traitement (filtrer, trier, compter), données ouvertes, cloud et impacts environnementaux."
duree: 40
objectifs:
  - "Définir donnée, métadonnée, descripteur, objet et collection, et les repérer dans une table"
  - "Lire et produire un fichier CSV ; identifier les types des descripteurs"
  - "Traiter une table : filtrer, trier, compter, calculer, avec un tableur ou en Python"
  - "Connaître les données ouvertes, le cloud et l'impact énergétique du stockage des données"
prerequis: [snt-python/boucles-bornees]
programme: [snt-donnees]
cartes:
  - q: "Donnée ou métadonnée ?"
    r: "Une **donnée** est une valeur décrivant un objet (la note 14) ; une **métadonnée** est une donnée **sur** une donnée (la date de prise d'une photo, l'auteur d'un fichier)."
  - q: "Dans une table, qu'est-ce qu'un descripteur ?"
    r: "Une **colonne** : une caractéristique commune à tous les objets (nom, âge, ville). Chaque **ligne** décrit un **objet** ; l'ensemble est une **collection**."
  - q: "Qu'est-ce qu'un fichier CSV ?"
    r: "Un fichier **texte** qui représente une table : une ligne par objet, les valeurs séparées par des virgules (ou des points-virgules), la première ligne donnant souvent les descripteurs."
  - q: "Qu'est-ce que l'open data ?"
    r: "Des **données ouvertes** : publiées librement (souvent par les administrations), réutilisables par tous, par exemple sur data.gouv.fr."
  - q: "Qu'est-ce que le cloud ?"
    r: "Le stockage et le traitement de données sur des **serveurs distants** (centres de données), accessibles par Internet. Il consomme beaucoup d'énergie."
  - q: "Trois traitements de base sur une table ?"
    r: "**Filtrer** (garder certaines lignes), **trier** (selon un descripteur), **calculer** (moyenne, total, nombre de lignes)."
---

Les élèves produisent des données en permanence (photos, messages, pas comptés par le téléphone) sans s'en rendre compte. Ce thème leur apprend à
voir des **données structurées** derrière les applications, à les **traiter** eux-mêmes avec un tableur ou Python, et à réfléchir aux enjeux
(données ouvertes, stockage, énergie). C'est aussi un excellent terrain pour la programmation.

## Ce que dit le programme

Capacités attendues : définir une **donnée personnelle** ; identifier les principaux **formats** et **représentations** de données ; identifier les
différents **descripteurs** d'un objet ; distinguer la **valeur** d'une donnée de son **descripteur** ; utiliser un site de **données ouvertes** pour
sélectionner et récupérer des données ; réaliser des opérations de **recherche, filtre, tri ou calcul** sur une ou plusieurs tables ; utiliser un
tableur ou un programme pour traiter des données ; identifier les principales causes de la **consommation énergétique** des centres de données ;
définir et utiliser le **cloud** (informatique en nuage).

Ce qui **n'est pas** attendu : les bases de données relationnelles et SQL (terminale NSI), les jointures.

## 1. Données, objets, descripteurs

Une **donnée** est une valeur qui décrit quelque chose : une note, un âge, une ville. Pour s'y retrouver, on organise les données en **tables** :

| nom | prénom | âge | ville |
|---|---|---|---|
| Martin | Léa | 15 | Lyon |
| Bernard | Hugo | 16 | Nantes |
| Dubois | Inès | 15 | Lyon |

- Chaque **ligne** décrit un **objet** (ici un élève).
- Chaque **colonne** est un **descripteur** (une caractéristique) : nom, prénom, âge, ville.
- La **valeur** est le contenu d'une case (15, Lyon…).
- L'ensemble des objets forme une **collection**.

Une **métadonnée** est une donnée **sur** les données : la date de création d'un fichier, son auteur, la position GPS d'une photo (voir le thème
photographie). Une **donnée personnelle** est une donnée qui permet d'identifier une personne, directement ou indirectement : elle est protégée par le
**RGPD**.

## 2. Le format CSV

Une table se stocke souvent dans un fichier **CSV** (*comma-separated values*) : un simple fichier texte, une ligne par objet, des séparateurs entre
les valeurs.

```text
nom,prenom,age,ville
Martin,Léa,15,Lyon
Bernard,Hugo,16,Nantes
Dubois,Inès,15,Lyon
```

Avantage : n'importe quel logiciel (tableur, Python, site web) sait le lire. Attention : en France, les tableurs utilisent souvent le
**point-virgule** comme séparateur (la virgule servant de séparateur décimal). D'autres formats existent : **JSON** (utilisé sur le Web), les
tableurs (`.ods`, `.xlsx`), les bases de données.

## 3. Traiter des données

Les traitements de base, au tableur comme en Python :

- **rechercher** une valeur (la ville d'Inès) ;
- **filtrer** : ne garder que certaines lignes (les élèves de Lyon) ;
- **trier** selon un descripteur (par âge croissant) ;
- **calculer** : compter, faire une moyenne, un maximum.

En Python, on peut représenter la table par une **liste de dictionnaires**, un dictionnaire par objet :

```python exec
eleves = [
    {"nom": "Martin", "prenom": "Léa", "age": 15, "ville": "Lyon"},
    {"nom": "Bernard", "prenom": "Hugo", "age": 16, "ville": "Nantes"},
    {"nom": "Dubois", "prenom": "Inès", "age": 15, "ville": "Lyon"},
]
nb_lyon = 0
for e in eleves:
    if e["ville"] == "Lyon":
        nb_lyon = nb_lyon + 1
print("Élèves de Lyon :", nb_lyon)
```

## 4. Données ouvertes et cloud

- Les **données ouvertes** (*open data*) sont publiées librement, souvent par l'État ou les collectivités (horaires de transport, qualité de l'air,
  résultats des examens…), sur des sites comme **data.gouv.fr**. Tout le monde peut les réutiliser.
- Le **cloud** (informatique en nuage) consiste à stocker et traiter les données sur des **serveurs distants**, dans des **centres de données**
  (*data centers*), plutôt que sur son propre appareil : photos sauvegardées, documents partagés, streaming.

:::attention[L'impact environnemental]
Les centres de données consomment beaucoup d'électricité : pour faire tourner les serveurs, et surtout pour les **refroidir**. Le stockage « infini »
n'est pas gratuit pour la planète : supprimer les fichiers inutiles, éviter les copies multiples, limiter la vidéo en haute définition.
:::

## Les erreurs classiques des élèves

:::attention[Ce que tu verras en classe]
- **Confondre descripteur et valeur** (« Lyon » est une valeur, « ville » est le descripteur).
- **Confondre donnée et métadonnée.**
- **Croire que le cloud est « dans le ciel »** : ce sont des bâtiments remplis de serveurs.
- **Ouvrir un CSV dans un tableur et tout voir dans une seule colonne** (mauvais séparateur).
- **En Python, comparer un nombre lu dans un CSV sans le convertir** (« 15 » est un texte).
:::

## En classe

:::methode[Activités qui marchent]
1. **Construire une table** à partir d'un sujet familier (films préférés de la classe) : choisir les descripteurs, discuter les types.
2. **Open data** : récupérer un jeu de données réel sur data.gouv.fr (par exemple les prénoms donnés en France), le filtrer et le trier au tableur.
3. **Python** : le même traitement avec une liste de dictionnaires ; comparer tableur et programme.
4. **Métadonnées** : regarder les propriétés d'un fichier ou d'une photo.
:::

## L'essentiel

- Une table : des **objets** (lignes), des **descripteurs** (colonnes), des **valeurs** (cases) ; une **collection** d'objets.
- **Métadonnée** : donnée sur une donnée. **Donnée personnelle** : permet d'identifier quelqu'un (RGPD).
- **CSV** : format texte simple pour les tables.
- Traiter : **rechercher, filtrer, trier, calculer**, au tableur ou en Python.
- **Open data** : données publiques réutilisables ; **cloud** : serveurs distants, coûteux en énergie.

## Exercices

::::exercice[Grand QCM : données structurées]{niveau=1 type=quiz}
Onze questions sur le thème des données.

1. Dans une table décrivant des élèves, que représente une colonne ?

   - [ ] un élève
   - [x] un descripteur, comme « ville » ou « âge »
   - [ ] une valeur
   - [ ] une métadonnée

   > Chaque colonne est une caractéristique commune à tous les objets.

1. Que représente une ligne ?

   - [x] un objet de la collection (ici un élève)
   - [ ] un descripteur
   - [ ] le format du fichier
   - [ ] une métadonnée

   > Une ligne regroupe toutes les valeurs d'un même objet.

1. Dans la table du cours, « Lyon » est…

   - [ ] un descripteur
   - [x] une valeur du descripteur « ville »
   - [ ] une métadonnée
   - [ ] un objet

   > Le descripteur est « ville » ; « Lyon » est l'une de ses valeurs.

1. Laquelle est une métadonnée d'une photo ?

   - [ ] la couleur d'un pixel
   - [x] la date et l'heure de la prise de vue
   - [ ] le visage de la personne photographiée
   - [ ] le nombre de pixels rouges

   > C'est une information **sur** la photo, enregistrée avec elle.

1. Qu'est-ce qu'un fichier CSV ?

   - [ ] un fichier image
   - [x] un fichier texte où chaque ligne est un objet et les valeurs sont séparées par des virgules ou points-virgules
   - [ ] un programme Python
   - [ ] une base de données en ligne

   > C'est l'un des formats les plus simples pour échanger des tables.

1. Quelle opération consiste à ne garder que les élèves de 15 ans ?

   - [ ] trier
   - [x] filtrer
   - [ ] calculer
   - [ ] indexer

   > Filtrer, c'est garder les lignes qui vérifient une condition.

1. Qu'est-ce que l'open data ?

   - [ ] des données piratées
   - [x] des données publiées librement et réutilisables par tous
   - [ ] des données personnelles
   - [ ] un logiciel de tableur

   > Par exemple sur data.gouv.fr.

1. Qu'est-ce que le cloud ?

   - [ ] un satellite qui stocke les données
   - [x] le stockage et le traitement de données sur des serveurs distants, dans des centres de données
   - [ ] la mémoire du téléphone
   - [ ] un type de fichier

   > « Dans le nuage » veut dire « ailleurs, sur des serveurs accessibles par Internet ».

1. Quelle est une cause importante de la consommation électrique des centres de données ?

   - [ ] l'éclairage des bureaux
   - [x] le refroidissement des serveurs
   - [ ] l'impression des documents
   - [ ] le Wi-Fi des visiteurs

   > Les serveurs chauffent beaucoup : il faut les refroidir en permanence.

1. Laquelle est une donnée personnelle ?

   - [ ] la température moyenne à Paris en juillet
   - [x] l'adresse postale d'un élève
   - [ ] le nombre d'habitants d'une ville
   - [ ] la liste des stations de métro

   > Elle permet d'identifier une personne : elle est protégée par le RGPD.

1. Un élève ouvre un CSV dans un tableur et tout apparaît dans une seule colonne. Quelle est la cause la plus probable ?

   - [ ] le fichier est vide
   - [x] le tableur n'utilise pas le bon séparateur (virgule ou point-virgule)
   - [ ] le fichier contient des nombres
   - [ ] il faut un ordinateur plus puissant

   > Il suffit de préciser le séparateur à l'ouverture.
::::

::::exercice[Filtrer une table]{niveau=1}
La table `films` est une liste de dictionnaires. Écris `films_de(films, annee)` qui renvoie la liste des **titres** des films sortis l'année donnée.

```python depart
films = [
    {"titre": "Le Voyage", "annee": 2021, "duree": 112},
    {"titre": "La Nuit", "annee": 2023, "duree": 95},
    {"titre": "L'Île", "annee": 2021, "duree": 128},
]

def films_de(films, annee):
    ...
```

```python tests
assert films_de(films, 2021) == ["Le Voyage", "L'Île"], "deux films en 2021"
assert films_de(films, 2023) == ["La Nuit"], "un film en 2023"
assert films_de(films, 1999) == [], "aucun film"
```

:::corrige
```python solution
films = [
    {"titre": "Le Voyage", "annee": 2021, "duree": 112},
    {"titre": "La Nuit", "annee": 2023, "duree": 95},
    {"titre": "L'Île", "annee": 2021, "duree": 128},
]

def films_de(films, annee):
    titres = []
    for f in films:
        if f["annee"] == annee:
            titres.append(f["titre"])
    return titres
```
:::
::::

::::exercice[Lire un CSV et calculer une moyenne]{niveau=2}
Le texte `donnees` contient un petit fichier CSV (première ligne : les descripteurs). Écris `moyenne_age(donnees)` qui renvoie l'âge moyen.

```python depart
donnees = """nom,age,ville
Léa,15,Lyon
Hugo,16,Nantes
Inès,17,Lyon"""

def moyenne_age(donnees):
    lignes = donnees.split("\n")
    ...
```

```python tests
assert moyenne_age(donnees) == 16, "(15 + 16 + 17) / 3 = 16"
assert moyenne_age("nom,age,ville\nZoé,14,Paris") == 14, "une seule ligne de données"
```

:::indice
Saute la première ligne (`lignes[1:]`). Pour chaque ligne, `ligne.split(",")` donne `["Léa", "15", "Lyon"]` : l'âge est le texte d'indice 1, à
convertir avec `int()`.
:::

:::corrige
```python solution
donnees = """nom,age,ville
Léa,15,Lyon
Hugo,16,Nantes
Inès,17,Lyon"""

def moyenne_age(donnees):
    lignes = donnees.split("\n")
    total = 0
    nb = 0
    for ligne in lignes[1:]:
        valeurs = ligne.split(",")
        total = total + int(valeurs[1])
        nb = nb + 1
    return total / nb
```

C'est exactement ce que fait un tableur en lisant un CSV : découper chaque ligne au niveau des séparateurs, puis convertir les nombres.
:::
::::

::::exercice[Concevoir une table]{niveau=2}
Ta classe veut recenser ses lectures de l'année. Propose une table : ses descripteurs (au moins cinq), le type de chaque descripteur (texte, nombre,
date…), deux lignes d'exemple, et une question à laquelle cette table permettrait de répondre par un filtre ou un tri.

:::criteres
- Au moins cinq descripteurs pertinents (titre, auteur, genre, nombre de pages, date de lecture, note…).
- Les types sont cohérents (nombre pour les pages, date pour la date…).
- Les deux lignes d'exemple respectent les descripteurs.
- La question proposée utilise bien un filtre, un tri ou un calcul.
:::

:::corrige
Descripteurs : `titre` (texte), `auteur` (texte), `genre` (texte : roman, BD, manga…), `pages` (nombre entier), `date_lecture` (date), `note` (nombre de
0 à 5), `lecteur` (texte).

| titre | auteur | genre | pages | date_lecture | note | lecteur |
|---|---|---|---|---|---|---|
| Le Petit Prince | Saint-Exupéry | conte | 96 | 2026-10-02 | 5 | Léa |
| Astérix le Gaulois | Goscinny et Uderzo | BD | 48 | 2026-10-10 | 4 | Hugo |

Questions possibles : quels livres ont une note de 5 (filtre) ? quel est le livre le plus long (tri ou maximum) ? combien de pages la classe a-t-elle
lues en tout (calcul) ?
:::
::::
