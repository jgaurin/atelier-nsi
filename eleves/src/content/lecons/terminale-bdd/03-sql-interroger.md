---
titre: "SQL : interroger"
resume: "Écrire des requêtes avec SELECT, FROM, WHERE, JOIN, ORDER BY, DISTINCT et les fonctions d'agrégation."
duree: 55
objectifs:
  - "Identifier les composants d'une requête"
  - "Écrire des requêtes avec SELECT, FROM, WHERE et JOIN"
  - "Utiliser DISTINCT, ORDER BY et les fonctions d'agrégation"
prerequis: [terminale-bdd/modele-relationnel]
---

**SQL** est le langage des bases de données : on décrit ce qu'on veut obtenir. Les exemples utilisent la base d'un lycée : `classe`, `eleve`, `matiere`, `note`.

## 1. Sélectionner

```sql exec base=lycee
SELECT nom, prenom FROM eleve WHERE id_classe = 'TG1';
```

- `FROM` : la table ;
- `SELECT` : les colonnes ;
- `WHERE` : la condition sur les lignes.

Les conditions utilisent `=`, `<>`, `<`, `>`, `AND`, `OR`, `NOT`. Une valeur absente se teste avec `IS NULL`.

## 2. Trier et éliminer les doublons

```sql exec base=lycee
SELECT DISTINCT niveau FROM classe ORDER BY niveau;
```

`ORDER BY` trie (`DESC` pour l'ordre décroissant). `DISTINCT` supprime les doublons.

## 3. Agréger

```sql exec base=lycee
SELECT COUNT(*) AS nb, AVG(valeur) AS moyenne, MAX(valeur) AS maxi
FROM note WHERE id_matiere = 2;
```

`COUNT`, `SUM`, `AVG`, `MIN`, `MAX` résument les lignes en une seule valeur.

## 4. Joindre

```sql exec base=lycee
SELECT eleve.nom, note.valeur
FROM note
JOIN eleve ON note.id_eleve = eleve.id_eleve
WHERE note.id_matiere = 2;
```

`JOIN … ON` associe les lignes de deux tables grâce à leur clé.

On peut donner un nom court à une table, et enchaîner les jointures :

```sql exec base=lycee
SELECT e.nom, m.intitule, n.valeur
FROM note n
JOIN eleve e ON n.id_eleve = e.id_eleve
JOIN matiere m ON n.id_matiere = m.id_matiere
WHERE n.valeur >= 18;
```

## L'essentiel

- `SELECT colonnes FROM table WHERE condition ORDER BY colonne`.
- `DISTINCT` retire les doublons ; `COUNT`, `SUM`, `AVG`, `MIN`, `MAX` agrègent.
- `FROM a JOIN b ON a.cle = b.cle` joint deux tables.

## Exercices

::::exercice[QCM : SQL]{niveau=1 type=quiz}
Une question à la fois : la correction s'affiche aussitôt.

1. Quelle clause choisit les lignes d'une table ?

   - [ ] `SELECT`
   - [ ] `FROM`
   - [x] `WHERE`
   - [ ] `ORDER BY`

   > `SELECT` choisit les colonnes.

1. Que fait `ORDER BY valeur DESC` ?

   - [ ] supprime les doublons
   - [x] trie par valeur décroissante
   - [ ] garde les plus grandes valeurs seulement
   - [ ] trie par ordre croissant

   > `ASC` est l'ordre par défaut.

1. Que fait `SELECT DISTINCT id_classe FROM eleve;` ?

   - [x] affiche chaque classe une seule fois
   - [ ] compte les classes
   - [ ] affiche les élèves sans classe
   - [ ] trie les classes

   > Les doublons sont supprimés.

1. Pour afficher le nom de l'élève à côté de chaque note, il faut :

   - [ ] deux requêtes séparées
   - [x] une jointure `note JOIN eleve ON note.id_eleve = eleve.id_eleve`
   - [ ] `SELECT nom FROM note`
   - [ ] un `UPDATE`

   > Le nom est dans `eleve`, la note dans `note`.

1. Quelle requête donne la meilleure note de NSI (id_matiere = 2) ?

   - [ ] `SELECT valeur FROM note WHERE id_matiere = 2;`
   - [x] `SELECT MAX(valeur) FROM note WHERE id_matiere = 2;`
   - [ ] `SELECT TOP(valeur) FROM note;`
   - [ ] `SELECT valeur FROM note ORDER BY valeur;`

   > La dernière proposition trie par ordre croissant, sans s'arrêter à la meilleure.
::::

::::exercice[Compléter des requêtes]{niveau=1 type=completer}
Complète ces requêtes.

Les noms des élèves de la classe `1G1`, par ordre alphabétique :

```sql trous
[[SELECT]] nom [[FROM]] eleve [[WHERE]] id_classe = '1G1' [[ORDER BY]] nom;
```

Le nombre de notes :

```sql trous
SELECT [[COUNT]](*) FROM note;
```

Le nom de chaque élève et sa note :

```sql trous
SELECT e.nom, n.valeur
FROM note n
[[JOIN]] eleve e [[ON]] n.id_eleve = e.[[id_eleve]];
```
::::

::::exercice[Statistiques de mathématiques]{niveau=1 base=lycee}
Affiche, pour la matière n° 1 (Mathématiques), le nombre de notes (colonne `nb`), la moyenne (colonne `moyenne`) et la note la plus basse
(colonne `mini`).

:::corrige
```sql solution
SELECT COUNT(*) AS nb, AVG(valeur) AS moyenne, MIN(valeur) AS mini
FROM note WHERE id_matiere = 1;
```

Les trois agrégats sont calculés sur les mêmes lignes sélectionnées par le `WHERE`.
:::
::::

::::exercice[Les notes de NSI avec les noms]{niveau=2 base=lycee}
Affiche le nom, le prénom et la note de chaque élève en NSI, de la meilleure à la moins bonne note. N'utilise pas le numéro de la matière :
filtre sur son intitulé `'NSI'`.

:::corrige
```sql solution
SELECT e.nom, e.prenom, n.valeur
FROM note n
JOIN eleve e ON n.id_eleve = e.id_eleve
JOIN matiere m ON n.id_matiere = m.id_matiere
WHERE m.intitule = 'NSI'
ORDER BY n.valeur DESC;
```

Trois tables : `note` (la valeur), `eleve` (le nom), `matiere` (l'intitulé), reliées par les deux clés étrangères de `note`.
:::
::::

::::exercice[Lire une requête]{niveau=2}
Explique en français, à un camarade, ce que renvoie cette requête, et comment elle est construite :

```sql
SELECT DISTINCT e.nom, e.prenom
FROM eleve e
JOIN note n ON n.id_eleve = e.id_eleve
WHERE n.valeur >= 18
ORDER BY e.nom;
```

:::criteres
- Sens : les élèves (nom et prénom) qui ont au moins une note supérieure ou égale à 18, triés par nom.
- La jointure associe chaque note à son élève.
- `DISTINCT` évite qu'un élève apparaisse plusieurs fois s'il a plusieurs notes de 18 ou plus.
:::

:::corrige
La requête affiche le **nom et le prénom des élèves qui ont obtenu au moins une note de 18 ou plus**, par ordre alphabétique de nom. On la lit
dans l'ordre logique : `FROM … JOIN` associe chaque **note** à l'**élève** qui l'a obtenue (même `id_eleve`) ; `WHERE` garde les lignes où la
note vaut au moins 18 ; `SELECT` ne garde que le nom et le prénom ; `DISTINCT` supprime les doublons, car un élève avec deux notes de 18 ou plus
apparaîtrait deux fois ; `ORDER BY` trie par nom.
:::
::::

::::exercice[Les élèves à féliciter]{niveau=3 base=lycee}
Le lycée veut féliciter les élèves de **Terminale** qui ont obtenu au moins une note supérieure ou égale à 16 en **NSI**.

Affiche leur nom et leur prénom, sans répétition, triés par nom. N'utilise aucun numéro de matière ou de classe : filtre sur `'NSI'` et sur `'Terminale'`.

À l'écrit : que se passe-t-il pour un élève qui a deux notes de 17 si tu oublies `DISTINCT` ?

:::indice
Il faut relier quatre tables : `note`, `eleve`, `matiere` et `classe`.
:::

:::corrige
```sql solution
SELECT DISTINCT e.nom, e.prenom
FROM note n
JOIN eleve e ON n.id_eleve = e.id_eleve
JOIN matiere m ON n.id_matiere = m.id_matiere
JOIN classe c ON e.id_classe = c.id_classe
WHERE m.intitule = 'NSI' AND c.niveau = 'Terminale' AND n.valeur >= 16
ORDER BY e.nom;
```

Sans `DISTINCT`, cet élève apparaît deux fois : la jointure produit une ligne par note retenue.
:::
::::
