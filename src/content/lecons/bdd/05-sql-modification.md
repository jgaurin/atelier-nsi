---
titre: "SQL : créer et modifier"
resume: Créer des tables avec leurs contraintes, insérer, modifier et supprimer des données en SQL, et comprendre comment le SGBD protège la cohérence de la base.
duree: 65
objectifs:
  - Créer une table avec `CREATE TABLE`, ses types et ses contraintes (`PRIMARY KEY`, `FOREIGN KEY`, `NOT NULL`, `UNIQUE`, `CHECK`)
  - Insérer, modifier et supprimer des lignes avec `INSERT`, `UPDATE` et `DELETE`
  - Prévoir les refus du SGBD dus aux contraintes d'intégrité
  - Traduire un schéma relationnel en instructions SQL
prerequis: [bdd/sql-jointures, bdd/modele-relationnel]
programme: [id-sql, id-relationnel, nsit-bdd]
cartes:
  - q: Comment déclarer une clé étrangère ?
    r: "Dans `CREATE TABLE` : `id_classe TEXT REFERENCES classe(id_classe)`, ou `FOREIGN KEY (id_classe) REFERENCES classe(id_classe)`."
  - q: Syntaxe d'une insertion ?
    r: "`INSERT INTO table (col1, col2) VALUES (v1, v2);` — on peut insérer plusieurs lignes : `VALUES (…), (…);`."
  - q: Que fait `UPDATE note SET valeur = valeur + 1 WHERE id_matiere = 2;` ?
    r: "Elle ajoute 1 à toutes les notes de la matière 2. Sans `WHERE`, toutes les lignes de la table seraient modifiées."
  - q: Différence entre `DELETE FROM t;` et `DROP TABLE t;` ?
    r: "`DELETE` supprime les lignes (la table reste, vide) ; `DROP TABLE` supprime la table elle-même (structure et données)."
  - q: Pourquoi le SGBD refuse-t-il de supprimer une classe qui a encore des élèves ?
    r: "Les élèves la référencent par une clé étrangère : la supprimer violerait l'intégrité référentielle."
  - q: Que vérifie une contrainte `CHECK (valeur BETWEEN 0 AND 20)` ?
    r: "Qu'à chaque insertion ou modification, la valeur est entre 0 et 20 ; sinon l'opération est refusée."
---

Interroger une base suppose qu'elle existe et qu'elle est remplie. SQL sert aussi à **définir** la structure (les tables et leurs
contraintes : c'est la partie « langage de définition des données ») et à **modifier** le contenu (insérer, mettre à jour,
supprimer). Le programme de terminale demande ces requêtes de mise à jour, et le sujet zéro de l'écrit 2 fait écrire des
`INSERT` et analyser un `CREATE TABLE`. L'enjeu central : comprendre comment les **contraintes** déclarées à la création
empêchent les données incohérentes d'entrer.

## 1. Créer une table

```sql exec
CREATE TABLE eleve (
  id_eleve  INTEGER PRIMARY KEY,
  nom       TEXT NOT NULL,
  prenom    TEXT NOT NULL,
  email     TEXT UNIQUE,
  moyenne   REAL CHECK (moyenne BETWEEN 0 AND 20),
  id_classe TEXT REFERENCES classe(id_classe)
);
SELECT name, sql FROM sqlite_master WHERE type = 'table';
```

Pour chaque colonne : un **nom**, un **type** (`INTEGER`, `REAL`, `TEXT`, `DATE`… selon le SGBD) et des **contraintes** :

| Contrainte                    | Signification                                              |
|-------------------------------|------------------------------------------------------------|
| `PRIMARY KEY`                 | clé primaire : unique et non nulle                          |
| `NOT NULL`                    | valeur obligatoire                                          |
| `UNIQUE`                      | pas deux lignes avec la même valeur                         |
| `CHECK (condition)`           | la condition doit être vraie (contrainte de domaine)        |
| `DEFAULT valeur`              | valeur utilisée si on n'en donne pas                        |
| `REFERENCES t(col)`           | clé étrangère vers `t(col)`                                 |

Une clé primaire **composée** se déclare à la fin : `PRIMARY KEY (id_trajet, id_passager)`, de même qu'une clé étrangère :
`FOREIGN KEY (id_eleve) REFERENCES eleve(id_eleve)`. `DROP TABLE t;` supprime une table.

:::remarque
SQLite est un SGBD léger (un simple fichier) : il est assez permissif sur les types, et ne vérifie les clés étrangères que si on
l'active (`PRAGMA foreign_keys = ON;`, déjà fait dans l'Atelier). PostgreSQL ou MySQL sont plus stricts. La syntaxe ci-dessus est
standard.
:::

## 2. Insérer des lignes

```sql exec base=lycee
INSERT INTO classe (id_classe, niveau, salle) VALUES ('TG3', 'Terminale', 'C305');
INSERT INTO eleve (id_eleve, nom, prenom, naissance, id_classe) VALUES
  (17, 'Bonnet', 'Yanis', '2008-11-03', 'TG3'),
  (18, 'Mercier', 'Lina', '2008-01-27', 'TG3');
SELECT * FROM eleve WHERE id_classe = 'TG3';
```

On nomme les colonnes (plus sûr qu'un ordre implicite) ; les colonnes non citées prennent leur valeur par défaut, ou `NULL`.

## 3. Modifier et supprimer

```sql exec base=lycee
UPDATE note SET valeur = valeur + 1 WHERE id_matiere = 5 AND valeur <= 19;   -- un point de plus en anglais
UPDATE classe SET salle = 'C302' WHERE id_classe = 'TG2';
DELETE FROM note WHERE valeur < 8;
SELECT id_classe, salle FROM classe WHERE id_classe = 'TG2';
```

:::attention
`UPDATE` et `DELETE` **sans `WHERE`** s'appliquent à **toutes** les lignes de la table. Avant de lancer une modification, on vérifie
les lignes concernées avec un `SELECT` ayant le même `WHERE`. (Et en production, on travaille dans une **transaction** qu'on peut
annuler : leçon suivante.)
:::

## 4. Les contraintes en action

Le SGBD **refuse** toute instruction qui violerait une contrainte, et laisse la base inchangée :

```sql exec base=lycee erreur
INSERT INTO note (id_note, id_eleve, id_matiere, valeur, date_eval) VALUES (99, 1, 1, 25, '2026-10-05');  -- CHECK
```

```sql exec base=lycee erreur
DELETE FROM classe WHERE id_classe = '1G1';      -- des élèves référencent encore cette classe
```

```sql exec base=lycee erreur
INSERT INTO matiere VALUES (6, 'NSI', 2);        -- intitulé déjà présent (UNIQUE)
```

Pour supprimer une classe, il faut d'abord réaffecter ou supprimer ses élèves (ou déclarer la clé étrangère avec
`ON DELETE CASCADE`, qui supprime automatiquement les lignes qui la référencent — à utiliser avec prudence).

:::prof
En terminale, on demande de « construire des requêtes d'insertion et de mise à jour à partir de plusieurs tables ». Faire
**provoquer** volontairement chaque violation de contrainte aux élèves (une note de 25, un élève dans une classe inexistante)
montre concrètement l'intérêt du modèle relationnel par rapport au tableur.
:::

## Exemple guidé

**Problème (type écrit 2).** Traduire en SQL le schéma de covoiturage de la leçon « Le modèle relationnel » :
`Personne(id_personne, nom, telephone)`, `Trajet(id_trajet, date, ville_depart, ville_arrivee, prix, #id_conducteur)`,
`Reservation(#id_trajet, #id_passager)` ; puis insérer un trajet avec deux passagers.

**1. Ordre de création** : une table référencée doit exister avant celle qui la référence : `personne`, puis `trajet`, puis
`reservation`.

```sql exec
CREATE TABLE personne (
  id_personne INTEGER PRIMARY KEY,
  nom         TEXT NOT NULL,
  telephone   TEXT UNIQUE
);
CREATE TABLE trajet (
  id_trajet     INTEGER PRIMARY KEY,
  date          TEXT NOT NULL,
  ville_depart  TEXT NOT NULL,
  ville_arrivee TEXT NOT NULL,
  prix          REAL NOT NULL CHECK (prix >= 0),
  id_conducteur INTEGER NOT NULL REFERENCES personne(id_personne)
);
CREATE TABLE reservation (
  id_trajet   INTEGER REFERENCES trajet(id_trajet),
  id_passager INTEGER REFERENCES personne(id_personne),
  PRIMARY KEY (id_trajet, id_passager)
);
INSERT INTO personne VALUES (1, 'Ana', '0600000001'), (2, 'Bilal', '0600000002'), (3, 'Chloé', NULL);
INSERT INTO trajet VALUES (10, '2026-11-02', 'Lyon', 'Grenoble', 8.5, 1);
INSERT INTO reservation VALUES (10, 2), (10, 3);
SELECT p.nom AS passager, t.ville_depart, t.ville_arrivee, t.prix
FROM reservation r JOIN personne p ON r.id_passager = p.id_personne JOIN trajet t ON r.id_trajet = t.id_trajet;
```

**2. Ordre d'insertion** : d'abord les personnes, puis le trajet (qui référence son conducteur), puis les réservations.
Insérer une réservation pour le trajet 11, qui n'existe pas, serait refusé ; insérer deux fois `(10, 2)` aussi (clé primaire).

**3. Limite** : rien n'empêche encore Ana de réserver une place dans son propre trajet ; cette règle demanderait une contrainte
plus élaborée (un déclencheur, *trigger*) ou une vérification par l'application.

## L'essentiel

- `CREATE TABLE t (col TYPE contraintes, …)` : `PRIMARY KEY`, `NOT NULL`, `UNIQUE`, `CHECK`, `DEFAULT`, `REFERENCES` ; `DROP TABLE t`.
- Créer d'abord les tables référencées ; clé composée : `PRIMARY KEY (a, b)`.
- `INSERT INTO t (cols) VALUES (…), (…)` ; `UPDATE t SET col = expr WHERE …` ; `DELETE FROM t WHERE …`.
- Sans `WHERE`, `UPDATE`/`DELETE` touchent toutes les lignes : vérifier d'abord avec un `SELECT`.
- Le SGBD refuse toute opération qui viole une contrainte (domaine, entité, référence) et laisse la base intacte.

## Exercices

::::exercice[Effet d'un UPDATE]{niveau=1}
Que fait `UPDATE eleve SET id_classe = 'TG1';` ?

- [ ] il met l'élève courant en TG1
- [x] il met **tous** les élèves en TG1
- [ ] il ne fait rien sans `WHERE`
- [ ] il crée une classe TG1

:::corrige
Sans `WHERE`, la modification s'applique à toutes les lignes de la table : tous les élèves passent en TG1. C'est une erreur
classique et grave.
:::
::::

::::exercice[Prévoir un refus]{niveau=1}
Sur la base lycee (avec les clés étrangères activées), laquelle de ces instructions est refusée ?

- [ ] `INSERT INTO classe VALUES ('2D4', 'Seconde', 'B110');`
- [x] `INSERT INTO eleve VALUES (20, 'Roy', 'Eva', '2010-05-05', '2D9');`
- [ ] `UPDATE note SET valeur = 20 WHERE id_note = 1;`
- [ ] `DELETE FROM note WHERE id_eleve = 3;`

:::corrige
La classe `'2D9'` n'existe pas : la clé étrangère `id_classe` de l'élève ne référencerait aucune ligne. Les autres instructions
respectent toutes les contraintes (20 est une note valide, supprimer des notes ne casse aucune référence).
:::
::::

::::exercice[Insérer un élève et sa note]{niveau=2 base=lycee}
Insère dans la base l'élève n° 20, Eva Roy, née le 2010-05-05, en 2D3, puis sa note de 15 en Anglais (matière 5) du 2026-10-06
(identifiant de note 46). Termine par une requête qui affiche le nom de l'élève, l'intitulé de la matière et la valeur de cette note.

:::corrige
```sql solution
INSERT INTO eleve (id_eleve, nom, prenom, naissance, id_classe) VALUES (20, 'Roy', 'Eva', '2010-05-05', '2D3');
INSERT INTO note (id_note, id_eleve, id_matiere, valeur, date_eval) VALUES (46, 20, 5, 15, '2026-10-06');
SELECT e.nom, m.intitule, n.valeur
FROM note n JOIN eleve e ON n.id_eleve = e.id_eleve JOIN matiere m ON n.id_matiere = m.id_matiere
WHERE n.id_note = 46;
```
L'élève doit être inséré **avant** sa note, qui le référence.
:::
::::

::::exercice[Changement de salle]{niveau=2 base=lycee}
La salle C201 est en travaux : toutes les classes qui y ont cours passent en salle C209. Écris la mise à jour, puis une requête qui
affiche l'identifiant et la salle de toutes les classes, par identifiant.

:::corrige
```sql solution
UPDATE classe SET salle = 'C209' WHERE salle = 'C201';
SELECT id_classe, salle FROM classe ORDER BY id_classe;
```
Le `WHERE` porte sur l'ancienne salle : une seule classe est concernée ici (1G1), mais la requête serait juste s'il y en avait plusieurs.
:::
::::

::::exercice[Supprimer avec précaution]{niveau=3 base=lycee}
On veut supprimer l'élève Hugo Bernard (n° 2), qui a quitté le lycée. Écris les instructions nécessaires (elles doivent être
acceptées par le SGBD), puis une requête qui compte les élèves restants (colonne `nb`).

:::corrige
```sql solution
DELETE FROM note WHERE id_eleve = 2;
DELETE FROM eleve WHERE id_eleve = 2;
SELECT COUNT(*) AS nb FROM eleve;
```
Il faut d'abord supprimer ses **notes**, qui le référencent ; sinon la suppression de l'élève est refusée (intégrité
référentielle). On pourrait aussi déclarer `ON DELETE CASCADE` sur la clé étrangère de `note` dès la création.
:::
::::

::::exercice[Écrire un schéma en SQL]{niveau=4 duree=25}
Une plateforme de cours en ligne gère des **utilisateurs** (identifiant, pseudo unique, e-mail unique, date d'inscription), des
**cours** (identifiant, titre, niveau entre 1 et 4, auteur qui est un utilisateur) et des **inscriptions** d'utilisateurs à des
cours (avec une date et une progression entre 0 et 100, valant 0 par défaut ; un utilisateur ne s'inscrit qu'une fois à un cours).

1. Écris les `CREATE TABLE` avec toutes les contraintes utiles, dans un ordre valide.
2. Écris une requête qui insère une inscription de l'utilisateur 3 au cours 7 avec la date du jour (`'2026-10-15'`) et la
   progression par défaut.
3. Écris la requête qui fait passer à 100 la progression de toutes les inscriptions au cours 7 dont la progression dépasse 90.
4. Explique ce qui se passe si l'on tente de supprimer un utilisateur auteur d'un cours, et propose deux politiques possibles.

:::criteres
- Tables créées dans l'ordre utilisateur, cours, inscription ; clés primaires ; `UNIQUE` sur pseudo et e-mail ; `NOT NULL` pertinents.
- `CHECK (niveau BETWEEN 1 AND 4)`, `CHECK (progression BETWEEN 0 AND 100)`, `DEFAULT 0` sur la progression.
- Clé étrangère `auteur REFERENCES utilisateur(id)` ; inscription : deux clés étrangères et clé primaire composée `(id_utilisateur, id_cours)`.
- Insertion sans préciser la progression (colonnes nommées) ; `UPDATE inscription SET progression = 100 WHERE id_cours = 7 AND progression > 90`.
- Suppression d'un auteur refusée (intégrité référentielle) ; politiques : interdire (comportement par défaut), supprimer en cascade les cours (dangereux), réaffecter les cours à un compte « auteur supprimé » ou mettre l'auteur à NULL (`ON DELETE SET NULL`, si autorisé).
:::

:::corrige
1. ```sql
   CREATE TABLE utilisateur (
     id_utilisateur INTEGER PRIMARY KEY,
     pseudo         TEXT NOT NULL UNIQUE,
     email          TEXT NOT NULL UNIQUE,
     inscription    TEXT NOT NULL
   );
   CREATE TABLE cours (
     id_cours INTEGER PRIMARY KEY,
     titre    TEXT NOT NULL,
     niveau   INTEGER NOT NULL CHECK (niveau BETWEEN 1 AND 4),
     auteur   INTEGER NOT NULL REFERENCES utilisateur(id_utilisateur)
   );
   CREATE TABLE inscription (
     id_utilisateur INTEGER REFERENCES utilisateur(id_utilisateur),
     id_cours       INTEGER REFERENCES cours(id_cours),
     date           TEXT NOT NULL,
     progression    INTEGER NOT NULL DEFAULT 0 CHECK (progression BETWEEN 0 AND 100),
     PRIMARY KEY (id_utilisateur, id_cours)
   );
   ```
2. `INSERT INTO inscription (id_utilisateur, id_cours, date) VALUES (3, 7, '2026-10-15');` — la progression prend la valeur par
   défaut 0. Une seconde insertion identique serait refusée (clé primaire composée).
3. `UPDATE inscription SET progression = 100 WHERE id_cours = 7 AND progression > 90;`
4. Le SGBD **refuse** la suppression : des cours référencent l'utilisateur comme auteur. Politiques possibles : (a) interdire
   (comportement par défaut, le plus sûr) ; (b) `ON DELETE CASCADE` sur `cours.auteur` : les cours de l'auteur (et leurs
   inscriptions, si la cascade est aussi déclarée) disparaissent — dangereux ; (c) réaffecter les cours à un compte « auteur
   supprimé » avant de supprimer l'utilisateur, ou autoriser `NULL` et déclarer `ON DELETE SET NULL`.
:::
::::
