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

**SQL** est le langage qui permet d'interroger une base de données. On y décrit **ce qu'on veut obtenir**, pas la façon de le chercher : le SGBD s'en charge.

Les exemples utilisent la base d'un lycée, avec les tables `classe`, `eleve`, `matiere` et `note`. Tu peux modifier et relancer chaque requête.

## 1. Sélectionner des lignes et des colonnes

```sql exec base=lycee
SELECT nom, prenom FROM eleve WHERE id_classe = 'TG1';
```

Lis cette requête dans l'ordre où le SGBD la traite :

1. `FROM eleve` : on part de la table des élèves.
2. `WHERE id_classe = 'TG1'` : on garde seulement les lignes des élèves de TG1.
3. `SELECT nom, prenom` : de ces lignes, on n'affiche que deux colonnes.

`SELECT *` affiche toutes les colonnes. Les textes et les dates s'écrivent entre apostrophes : `'TG1'`.

Les conditions utilisent `=`, `<>` (différent), `<`, `>`, `<=`, `>=`, et se combinent avec `AND`, `OR` et `NOT`. Une valeur absente se teste avec `IS NULL`, jamais avec `= NULL`.

## 2. Trier et éliminer les doublons

```sql exec base=lycee
SELECT DISTINCT niveau FROM classe ORDER BY niveau;
```

- Plusieurs classes ont le même niveau. Sans `DISTINCT`, chaque niveau apparaîtrait plusieurs fois.
- `ORDER BY niveau` trie le résultat par ordre croissant. On ajoute `DESC` pour l'ordre décroissant.

## 3. Calculer un résumé

```sql exec base=lycee
SELECT COUNT(*) AS nb, AVG(valeur) AS moyenne, MAX(valeur) AS maxi
FROM note WHERE id_matiere = 2;
```

Les **fonctions d'agrégation** résument toutes les lignes retenues en une seule valeur : `COUNT` les compte, `SUM` additionne, `AVG` fait la moyenne, `MIN` et `MAX` donnent les extrêmes. `AS nb` donne un nom à la colonne du résultat.

## 4. Relier deux tables : la jointure

La table `note` ne contient pas le nom des élèves, seulement leur `id_eleve`. Pour afficher le nom à côté de la note, il faut aller chercher l'élève correspondant dans la table `eleve`.

À la main, avec deux petites tables :

| <u>id_note</u> | #id_eleve | valeur |
| --- | --- | --- |
| 10 | 2 | 14 |
| 11 | 1 | 9 |

| <u>id_eleve</u> | nom |
| --- | --- |
| 1 | Martin |
| 2 | Durand |

La jointure associe chaque note à l'élève qui a le même `id_eleve` : la note 14 va avec Durand, la note 9 avec Martin.

```sql exec base=lycee
SELECT eleve.nom, note.valeur
FROM note
JOIN eleve ON note.id_eleve = eleve.id_eleve
WHERE note.id_matiere = 2;
```

`JOIN eleve ON note.id_eleve = eleve.id_eleve` signifie : « colle à chaque note la ligne de l'élève dont l'identifiant est le même ». Comme les deux tables ont une colonne `id_eleve`, on précise la table devant chaque nom de colonne.

On peut donner un nom court à chaque table, et enchaîner plusieurs jointures :

```sql exec base=lycee
SELECT e.nom, m.intitule, n.valeur
FROM note n
JOIN eleve e ON n.id_eleve = e.id_eleve
JOIN matiere m ON n.id_matiere = m.id_matiere
WHERE n.valeur >= 18;
```

Ici, `n`, `e` et `m` désignent les tables `note`, `eleve` et `matiere`. Chaque note est reliée à son élève, puis à sa matière.

:::attention
Si tu oublies la condition `ON`, chaque note est associée à **tous** les élèves : le résultat contient beaucoup trop de lignes et n'a pas de sens.
:::

## L'essentiel

- `SELECT colonnes FROM table WHERE condition ORDER BY colonne` ; le SGBD part de `FROM`, filtre avec `WHERE`, puis garde les colonnes du `SELECT`.
- `DISTINCT` retire les doublons ; `COUNT`, `SUM`, `AVG`, `MIN`, `MAX` résument les lignes.
- `FROM a JOIN b ON a.cle = b.cle` relie les lignes qui ont la même clé.

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
