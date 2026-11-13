---
titre: "SQL : modifier"
resume: "Ajouter, modifier et supprimer des lignes avec INSERT, UPDATE et DELETE."
duree: 30
objectifs:
  - "Écrire des requêtes INSERT, UPDATE et DELETE"
  - "Respecter les contraintes d'intégrité"
prerequis: [terminale-bdd/sql-interroger]
---

Une base de données vit : des élèves arrivent, des notes sont corrigées, des lignes sont supprimées. Trois instructions SQL permettent de **modifier** le contenu.

## 1. Ajouter une ligne : `INSERT`

```sql exec base=lycee
INSERT INTO matiere (id_matiere, intitule, coefficient) VALUES (6, 'SVT', 3);
SELECT * FROM matiere WHERE id_matiere = 6;
```

On donne la table, la liste des colonnes, puis les valeurs **dans le même ordre**. La seconde requête vérifie que la ligne a bien été ajoutée.

## 2. Modifier des lignes : `UPDATE`

```sql exec base=lycee
UPDATE classe SET salle = 'C305' WHERE id_classe = 'TG2';
SELECT * FROM classe WHERE id_classe = 'TG2';
```

`SET` indique la nouvelle valeur, et `WHERE` les lignes concernées. Ici, seule la classe TG2 change de salle.

## 3. Supprimer des lignes : `DELETE`

```sql exec base=lycee
DELETE FROM note WHERE id_note = 1;
SELECT COUNT(*) AS nb FROM note;
```

Seule la note numéro 1 est supprimée.

:::attention
Sans `WHERE`, `UPDATE` et `DELETE` s'appliquent à **toutes** les lignes de la table. `DELETE FROM note;` efface toutes les notes du lycée.
:::

## 4. L'ordre des opérations

Les contraintes de référence imposent un ordre. Une note fait référence à un élève par sa clé étrangère :

- pour enregistrer un nouvel élève et sa note, on insère d'abord l'**élève**, puis la **note** : sinon, la note désignerait un élève qui n'existe pas encore ;
- pour supprimer un élève, on supprime d'abord ses **notes**, puis l'**élève** : sinon, ses notes désigneraient un élève disparu.

Une requête qui viole une contrainte est **refusée** : la base ne change pas.

:::methode[Changer une clé déjà utilisée]
Pour renommer la classe 1G2 en 1G5, alors que des élèves y sont rattachés :
1. on insère la nouvelle classe 1G5 ;
2. on rattache les élèves à 1G5 avec un `UPDATE` ;
3. on supprime l'ancienne classe 1G2, qui n'est plus référencée.
:::

## L'essentiel

- `INSERT INTO t (c1, c2) VALUES (v1, v2);` ajoute une ligne.
- `UPDATE t SET c = v WHERE condition;` modifie des lignes.
- `DELETE FROM t WHERE condition;` supprime des lignes. Sans `WHERE`, toute la table est touchée.
- Les contraintes de référence imposent l'ordre : l'élève avant ses notes, ses notes avant lui à la suppression.

## Exercices

::::exercice[Quelle requête ?]{niveau=1 type=associer}
Associe chaque besoin à l'instruction SQL à utiliser.

| Besoin | Instruction |
| --- | --- |
| Ajouter une nouvelle matière | INSERT |
| Changer le coefficient d'une matière | UPDATE |
| Retirer une note | DELETE |
| Afficher les notes | SELECT |
::::

::::exercice[Compléter]{niveau=1 type=completer}
Complète ces requêtes.

```sql trous
[[INSERT]] INTO classe (id_classe, niveau, salle) [[VALUES]] ('2D4', 'Seconde', 'B110');

[[UPDATE]] classe [[SET]] salle = 'B112' WHERE id_classe = '2D4';

[[DELETE]] [[FROM]] classe WHERE id_classe = '2D4';
```
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

::::exercice[Renommer une classe]{niveau=3 base=lycee}
La classe `1G2` s'appelle désormais `1G5`. Elle est de niveau `'Première'` et reste en salle `'C203'`. Le SGBD refuse `UPDATE classe SET id_classe = '1G5' WHERE id_classe = '1G2';`.

1. À l'écrit : pourquoi cette requête est-elle refusée ?
2. Écris les trois requêtes qui font ce changement en respectant les contraintes, puis une requête qui affiche le nom des élèves de `1G5`, triés par nom.

:::corrige
```sql solution
INSERT INTO classe (id_classe, niveau, salle) VALUES ('1G5', 'Première', 'C203');
UPDATE eleve SET id_classe = '1G5' WHERE id_classe = '1G2';
DELETE FROM classe WHERE id_classe = '1G2';
SELECT nom FROM eleve WHERE id_classe = '1G5' ORDER BY nom;
```

**Question 1.** `id_classe` est référencée par la clé étrangère de `eleve`. La modifier laisserait des élèves rattachés à une classe qui n'existe plus : la contrainte de référence l'interdit.
:::
::::
