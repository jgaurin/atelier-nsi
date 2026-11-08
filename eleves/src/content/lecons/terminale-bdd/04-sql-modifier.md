---
titre: "SQL : modifier"
resume: "Ajouter, modifier et supprimer des lignes avec INSERT, UPDATE et DELETE."
duree: 30
objectifs:
  - "Écrire des requêtes INSERT, UPDATE et DELETE"
  - "Respecter les contraintes d'intégrité"
prerequis: [terminale-bdd/sql-interroger]
---

Une base de données évolue : on ajoute, on modifie et on supprime des lignes.

## 1. Les trois requêtes

```sql exec base=lycee
INSERT INTO matiere (id_matiere, intitule, coefficient) VALUES (6, 'SVT', 3);
SELECT * FROM matiere WHERE id_matiere = 6;
```

```sql exec base=lycee
UPDATE classe SET salle = 'C305' WHERE id_classe = 'TG2';
SELECT * FROM classe WHERE id_classe = 'TG2';
```

```sql exec base=lycee
DELETE FROM note WHERE id_note = 1;
SELECT COUNT(*) AS nb FROM note;
```

:::attention
Sans `WHERE`, `UPDATE` et `DELETE` s'appliquent à **toutes** les lignes.
:::

## 2. L'ordre compte

Les contraintes de référence imposent un ordre :

- on insère un élève **avant** ses notes ;
- on supprime ses notes **avant** l'élève.

## L'essentiel

- `INSERT INTO t (c1, c2) VALUES (v1, v2);`
- `UPDATE t SET c = v WHERE condition;`
- `DELETE FROM t WHERE condition;`
- Les contraintes de référence imposent l'ordre des opérations.

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

::::exercice[Dans quel ordre ?]{niveau=2 type=ordre}
On veut supprimer un élève et enregistrer un nouvel élève avec une note. Remets ces opérations dans un ordre accepté par le SGBD.

1. Supprimer les notes de l'ancien élève.
1. Supprimer l'ancien élève.
1. Insérer le nouvel élève.
1. Insérer la note du nouvel élève.
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
