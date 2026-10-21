---
titre: Le langage SQL
resume: "Le cours de terminale NSI sur le langage SQL, avec la base d'un lycée : SELECT, FROM, WHERE, ORDER BY, DISTINCT, fonctions d'agrégation (COUNT, SUM, AVG, MIN, MAX), jointures avec JOIN, puis INSERT, UPDATE et DELETE, et le respect des contraintes d'intégrité."
duree: 70
objectifs:
  - "Écrire une requête d'interrogation avec SELECT, FROM, WHERE et ORDER BY"
  - "Utiliser DISTINCT et les fonctions d'agrégation"
  - "Joindre deux ou trois tables avec JOIN … ON"
  - "Insérer, modifier et supprimer des données avec INSERT, UPDATE, DELETE"
prerequis: [nsi-terminale/bdd]
programme: [nsit-bdd]
cartes:
  - q: "Forme d'une requête d'interrogation ?"
    r: "`SELECT colonnes FROM table WHERE condition ORDER BY colonne;` ; `SELECT` choisit les colonnes (projection), `WHERE` les lignes (sélection)."
  - q: "Fonctions d'agrégation ?"
    r: "`COUNT(*)` (nombre de lignes), `SUM`, `AVG` (moyenne), `MIN`, `MAX` : elles résument toutes les lignes sélectionnées en **une** valeur."
  - q: "Comment joindre eleve et classe ?"
    r: "`SELECT ... FROM eleve JOIN classe ON eleve.id_classe = classe.id_classe;` : on associe chaque ligne d'eleve à la ligne de classe qui a la même clé."
  - q: "Ajouter, modifier, supprimer ?"
    r: "`INSERT INTO t (c1, c2) VALUES (v1, v2);` ; `UPDATE t SET c = v WHERE condition;` ; `DELETE FROM t WHERE condition;`."
  - q: "Danger de UPDATE et DELETE ?"
    r: "Sans `WHERE`, ils s'appliquent à **toutes** les lignes de la table."
  - q: "Comment tester une valeur absente ?"
    r: "`IS NULL` (ou `IS NOT NULL`), jamais `= NULL`."
---

**SQL** (*Structured Query Language*) est le langage standard pour interroger et modifier une base de données relationnelle. C'est un langage
**déclaratif** : on décrit **ce qu'on veut** obtenir, pas comment le calculer. Tous les exemples de ce cours s'exécutent sur la base du lycée
(tables `classe`, `eleve`, `matiere`, `note`, décrites au chapitre précédent).

## Ce que dit le programme

Contenus : *langage SQL : requêtes d'interrogation et de mise à jour d'une base de données*. Capacités attendues : **identifier les composants
d'une requête** ; **construire des requêtes d'interrogation à l'aide des clauses du langage SQL : SELECT, FROM, WHERE, JOIN** ; **construire
des requêtes d'insertion et de mise à jour à l'aide de : UPDATE, INSERT, DELETE**. Le programme précise qu'on peut utiliser **DISTINCT**,
**ORDER BY** ou les **fonctions d'agrégation** sans utiliser les clauses `GROUP BY` et `HAVING`.

## 1. SELECT, FROM, WHERE

```sql exec base=lycee
SELECT nom, prenom FROM eleve WHERE id_classe = 'TG1';
```

- `FROM` indique la **table** ;
- `SELECT` indique les **colonnes** à afficher (`*` pour toutes) : c'est une **projection** ;
- `WHERE` garde les **lignes** qui vérifient la condition : c'est une **sélection**.

Les conditions utilisent `=`, `<>` (différent), `<`, `<=`, `>`, `>=`, combinés avec `AND`, `OR`, `NOT`. Les chaînes sont entre **apostrophes**.

```sql exec base=lycee
SELECT id_eleve, valeur FROM note WHERE id_matiere = 2 AND valeur >= 15;
```

On teste une valeur absente avec `IS NULL` (jamais `= NULL`) :

```sql exec base=lycee
SELECT nom, prenom FROM eleve WHERE naissance IS NULL;
```

## 2. ORDER BY et DISTINCT

```sql exec base=lycee
SELECT nom, prenom, naissance FROM eleve
WHERE naissance IS NOT NULL
ORDER BY naissance DESC;
```

`ORDER BY` trie (`ASC` croissant par défaut, `DESC` décroissant). Sans `ORDER BY`, l'ordre des lignes n'est **pas garanti**.

`DISTINCT` supprime les doublons :

```sql exec base=lycee
SELECT DISTINCT niveau FROM classe;
```

## 3. Les fonctions d'agrégation

Elles **résument** toutes les lignes sélectionnées en **une seule** valeur :

```sql exec base=lycee
SELECT COUNT(*) AS nb_notes, AVG(valeur) AS moyenne, MIN(valeur) AS mini, MAX(valeur) AS maxi
FROM note WHERE id_matiere = 2;
```

| Fonction | Résultat |
| --- | --- |
| `COUNT(*)` | nombre de lignes |
| `SUM(c)` | somme de la colonne |
| `AVG(c)` | moyenne |
| `MIN(c)`, `MAX(c)` | plus petite, plus grande valeur |

`AS` donne un nom à la colonne du résultat. `COUNT(DISTINCT c)` compte les valeurs différentes.

## 4. Les jointures

Les notes ne contiennent que des **numéros** d'élèves. Pour afficher les **noms**, il faut **joindre** les tables `note` et `eleve` grâce à la
clé étrangère :

```sql exec base=lycee
SELECT eleve.nom, eleve.prenom, note.valeur
FROM note
JOIN eleve ON note.id_eleve = eleve.id_eleve
WHERE note.id_matiere = 2
ORDER BY note.valeur DESC;
```

`JOIN … ON` associe chaque ligne de `note` à la ligne de `eleve` qui a le **même** `id_eleve`. On préfixe les colonnes par le nom de la table
quand il y a ambiguïté. On peut joindre **trois** tables, et utiliser des **alias** courts :

```sql exec base=lycee
SELECT e.nom, m.intitule, n.valeur
FROM note n
JOIN eleve e ON n.id_eleve = e.id_eleve
JOIN matiere m ON n.id_matiere = m.id_matiere
WHERE e.id_classe = 'TG1' AND n.valeur >= 16;
```

:::methode[Écrire une requête avec jointure]
1. Quelles **colonnes** veut-on afficher ? Dans quelles **tables** sont-elles ?
2. Quelles **conditions** ? Sur quelles tables ?
3. Relier toutes ces tables par des `JOIN … ON` en suivant les **clés étrangères** du schéma.
:::

## 5. Modifier les données

**Insérer** une ligne :

```sql exec base=lycee
INSERT INTO eleve (id_eleve, nom, prenom, naissance, id_classe)
VALUES (17, 'Roux', 'Zoé', '2010-02-08', '2D3');
SELECT * FROM eleve WHERE id_eleve = 17;
```

**Modifier** des lignes :

```sql exec base=lycee
UPDATE classe SET salle = 'C305' WHERE id_classe = 'TG2';
SELECT * FROM classe WHERE niveau = 'Terminale';
```

**Supprimer** des lignes :

```sql exec base=lycee
DELETE FROM note WHERE id_eleve = 16;
SELECT COUNT(*) AS nb FROM note;
```

:::attention[Toujours un WHERE]
`UPDATE note SET valeur = 20;` met 20 à **toutes** les notes, et `DELETE FROM eleve;` vide la table. On écrit d'abord le `SELECT` avec le même
`WHERE` pour vérifier les lignes concernées.
:::

Le SGBD vérifie les **contraintes** : il refuse d'insérer une note pour un élève inexistant, ou de supprimer un élève qui a encore des notes
(il faut d'abord supprimer ses notes).

```sql exec base=lycee erreur
INSERT INTO note (id_note, id_eleve, id_matiere, valeur, date_eval) VALUES (100, 1, 1, 25, '2026-10-10');
```

## Les erreurs classiques des élèves

:::attention[Ce que tu verras en classe]
- **Oublier la condition de jointure** (`ON`) : on obtient toutes les combinaisons de lignes.
- **Guillemets** : `WHERE id_classe = TG1` (sans apostrophes, TG1 est pris pour une colonne).
- **`= NULL`** au lieu de `IS NULL`.
- **Colonne ambiguë** : `id_eleve` existe dans deux tables jointes, il faut préciser `note.id_eleve`.
- **`UPDATE` ou `DELETE` sans `WHERE`.**
- **Mélanger agrégat et colonne simple** : `SELECT nom, MAX(valeur)` n'a pas de sens sans `GROUP BY` (hors programme).
:::

## En classe

:::methode[Activités qui marchent]
1. **DB Browser for SQLite** ou un site d'exercices SQL en ligne, avec une base réaliste (films, communes, ventes).
2. **Traduire** des questions en français en requêtes, puis l'inverse : expliquer en français ce que fait une requête.
3. **Construire la jointure pas à pas** : d'abord `SELECT *` sur la jointure, puis filtrer, puis projeter.
4. **Le piège du `DELETE` sans `WHERE`** sur une copie de la base : marquant, et sans risque.
:::

## L'essentiel

- `SELECT colonnes FROM table WHERE condition ORDER BY colonne` ; projection (colonnes) et sélection (lignes).
- `DISTINCT` (sans doublons), `IS NULL`, `AS` (renommer).
- **Agrégats** : `COUNT(*)`, `SUM`, `AVG`, `MIN`, `MAX` résument les lignes en une valeur (pas de `GROUP BY` au programme).
- **Jointure** : `FROM a JOIN b ON a.cle_etrangere = b.cle_primaire`, en suivant le schéma.
- **Mises à jour** : `INSERT INTO … VALUES`, `UPDATE … SET … WHERE`, `DELETE FROM … WHERE` ; toujours un `WHERE` ; contraintes vérifiées.

## Exercices

::::exercice[Grand QCM : SQL]{niveau=1 type=quiz}
Douze questions sur SQL, avec la base du lycée.

1. Quelle clause choisit les lignes d'une table ?

   - [ ] `SELECT`
   - [ ] `FROM`
   - [x] `WHERE`
   - [ ] `ORDER BY`

   > `SELECT` choisit les colonnes.

1. Que renvoie `SELECT COUNT(*) FROM eleve;` ?

   - [ ] la liste des élèves
   - [x] le nombre d'élèves
   - [ ] le nombre de colonnes
   - [ ] une erreur

   > Une seule valeur.

1. Comment sélectionner les élèves dont la date de naissance est inconnue ?

   - [ ] `WHERE naissance = NULL`
   - [x] `WHERE naissance IS NULL`
   - [ ] `WHERE naissance = ''`
   - [ ] `WHERE NOT naissance`

   > Toute comparaison avec NULL avec `=` est « inconnue ».

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

1. Que se passe-t-il si on oublie le `ON` d'une jointure (en SQLite) ?

   - [ ] une erreur systématique
   - [x] on obtient toutes les combinaisons de lignes des deux tables
   - [ ] la jointure se fait automatiquement sur la bonne colonne
   - [ ] la requête ne renvoie rien

   > C'est le produit cartésien : des lignes sans signification.

1. Quelle requête ajoute une matière ?

   - [x] `INSERT INTO matiere (id_matiere, intitule, coefficient) VALUES (6, 'SVT', 3);`
   - [ ] `UPDATE matiere SET intitule = 'SVT';`
   - [ ] `ADD matiere VALUES (6, 'SVT', 3);`
   - [ ] `SELECT 'SVT' INTO matiere;`

   > `UPDATE` modifie des lignes existantes.

1. Que fait `UPDATE note SET valeur = valeur + 1;` ?

   - [ ] ajoute 1 à une note au hasard
   - [x] ajoute 1 à toutes les notes
   - [ ] ajoute une note
   - [ ] une erreur

   > Sans `WHERE`, toutes les lignes sont modifiées.

1. Pourquoi `DELETE FROM eleve WHERE id_eleve = 1;` est-il refusé ?

   - [ ] l'élève n'existe pas
   - [x] des notes référencent cet élève (contrainte de référence)
   - [ ] il faut écrire `REMOVE`
   - [ ] on ne peut pas supprimer d'élève

   > Il faut d'abord supprimer ses notes.

1. Quelle requête donne la meilleure note de NSI (id_matiere = 2) ?

   - [ ] `SELECT valeur FROM note WHERE id_matiere = 2;`
   - [x] `SELECT MAX(valeur) FROM note WHERE id_matiere = 2;`
   - [ ] `SELECT TOP(valeur) FROM note;`
   - [ ] `SELECT valeur FROM note ORDER BY valeur;`

   > La dernière proposition trie par ordre croissant, sans s'arrêter à la meilleure.

1. SQL est un langage :

   - [ ] impératif : on décrit les étapes du calcul
   - [x] déclaratif : on décrit le résultat voulu
   - [ ] orienté objet
   - [ ] de balisage

   > Le SGBD choisit lui-même comment calculer le résultat.
::::

::::exercice[Les élèves de première]{niveau=1 base=lycee}
Affiche le nom et le prénom des élèves des classes `1G1` et `1G2`, triés par nom.

:::corrige
```sql solution
SELECT nom, prenom FROM eleve
WHERE id_classe = '1G1' OR id_classe = '1G2'
ORDER BY nom;
```

On peut aussi écrire `WHERE id_classe IN ('1G1', '1G2')`.
:::
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

::::exercice[Moyenne d'une classe]{niveau=2 base=lycee}
Affiche la moyenne de toutes les notes des élèves de la classe `TG1` (colonne `moyenne`), arrondie à deux décimales avec `ROUND(x, 2)`.

:::corrige
```sql solution
SELECT ROUND(AVG(n.valeur), 2) AS moyenne
FROM note n
JOIN eleve e ON n.id_eleve = e.id_eleve
WHERE e.id_classe = 'TG1';
```

La classe est dans `eleve`, les notes dans `note` : la jointure est indispensable avant de calculer la moyenne.
:::
::::

::::exercice[Salles des terminales]{niveau=2 base=lycee}
Affiche le nom, le prénom et la salle de tous les élèves de Terminale (niveau `'Terminale'` dans la table `classe`), triés par nom.

:::corrige
```sql solution
SELECT e.nom, e.prenom, c.salle
FROM eleve e
JOIN classe c ON e.id_classe = c.id_classe
WHERE c.niveau = 'Terminale'
ORDER BY e.nom;
```

L'élève n° 16, sans classe (`id_classe` à NULL), n'apparaît pas : la jointure ne garde que les lignes qui ont une correspondance.
:::
::::

::::exercice[Rattrapage]{niveau=2 base=lycee}
Après un rattrapage, toutes les notes de NSI (`id_matiere = 2`) inférieures à 10 passent à 10. Écris la mise à jour, puis une requête qui affiche
l'`id_eleve` et la valeur de toutes les notes de NSI, par `id_eleve`.

:::corrige
```sql solution
UPDATE note SET valeur = 10 WHERE id_matiere = 2 AND valeur < 10;
SELECT id_eleve, valeur FROM note WHERE id_matiere = 2 ORDER BY id_eleve;
```

Les deux conditions sont indispensables : sans `id_matiere = 2`, on modifierait aussi les autres matières ; sans `valeur < 10`, toutes les
notes de NSI passeraient à 10.
:::
::::

::::exercice[Un nouvel élève et sa note]{niveau=2 base=lycee}
Une élève, Nina Faure, née le 2009-08-30, arrive en `1G2` avec l'identifiant 18. Elle obtient 14 en NSI (matière 2) le 2026-10-08 (note n° 50).
Écris les insertions dans le bon ordre, puis une requête qui affiche son nom, l'intitulé de la matière et la valeur.

:::corrige
```sql solution
INSERT INTO eleve (id_eleve, nom, prenom, naissance, id_classe) VALUES (18, 'Faure', 'Nina', '2009-08-30', '1G2');
INSERT INTO note (id_note, id_eleve, id_matiere, valeur, date_eval) VALUES (50, 18, 2, 14, '2026-10-08');
SELECT e.nom, m.intitule, n.valeur
FROM note n
JOIN eleve e ON n.id_eleve = e.id_eleve
JOIN matiere m ON n.id_matiere = m.id_matiere
WHERE n.id_note = 50;
```

L'élève doit exister **avant** sa note, qui la référence par une clé étrangère.
:::
::::

::::exercice[Lire une requête]{niveau=2}
Explique en français, à un élève, ce que renvoie cette requête, et comment elle est construite :

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
