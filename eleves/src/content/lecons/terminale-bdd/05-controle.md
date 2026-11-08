---
titre: Contrôle du chapitre
resume: "Un contrôle d'une heure noté sur 20 sur les bases de données et SQL."
duree: 60
controle: true
objectifs:
  - "Lire un schéma relationnel et repérer ses anomalies"
  - "Écrire des requêtes SQL"
prerequis: [terminale-bdd/sql-modifier]
---

## Consignes

Durée : **1 heure**. Le contrôle est noté sur **20 points**. La base contient les relations suivantes :

- classe(<u>id_classe</u>, niveau, salle)
- eleve(<u>id_eleve</u>, nom, prenom, naissance, #id_classe)
- matiere(<u>id_matiere</u>, intitule, coefficient)
- note(<u>id_note</u>, #id_eleve, #id_matiere, valeur, date_eval)

## Exercices

::::exercice[Le modèle]{niveau=3 type=reponses points=4}
Chaque question vaut 1 point.

1. Quelle est la clé primaire de `matiere` ?

   - id_matiere

1. Combien de clés étrangères possède `note` ?

   - 2

1. Comment s'appelle la contrainte qui empêche d'enregistrer une note pour un élève inexistant ?

   - référence
   - contrainte de référence
   - integrite referentielle

1. Pourquoi le nom de l'élève n'est-il pas répété dans `note` ? Réponds en un mot.

   - redondance
::::

::::exercice[Lister les élèves de Seconde]{niveau=3 base=lycee points=3}
Affiche le nom et le prénom des élèves dont la classe est `2D1`, triés par nom.

:::corrige
```sql solution
SELECT nom, prenom FROM eleve WHERE id_classe = '2D1' ORDER BY nom;
```
:::
::::

::::exercice[La meilleure note]{niveau=3 base=lycee points=3}
Affiche la meilleure note de la matière d'identifiant 1, dans une colonne nommée `meilleure`.

:::corrige
```sql solution
SELECT MAX(valeur) AS meilleure FROM note WHERE id_matiere = 1;
```
:::
::::

::::exercice[Jointure]{niveau=3 base=lycee points=4}
Affiche le nom de l'élève et la valeur de la note pour toutes les notes supérieures ou égales à 18, de la meilleure à la moins bonne.

:::corrige
```sql solution
SELECT e.nom, n.valeur
FROM note n JOIN eleve e ON n.id_eleve = e.id_eleve
WHERE n.valeur >= 18
ORDER BY n.valeur DESC;
```
:::
::::

::::exercice[Mise à jour]{niveau=3 base=lycee points=3}
Le coefficient de la matière d'identifiant 5 passe à 3. Écris la mise à jour, puis une requête qui affiche l'intitulé et le coefficient de cette matière.

:::corrige
```sql solution
UPDATE matiere SET coefficient = 3 WHERE id_matiere = 5;
SELECT intitule, coefficient FROM matiere WHERE id_matiere = 5;
```
:::
::::

::::exercice[Un mauvais schéma]{niveau=3 points=3}
Un lycée utilise une table unique `emprunt(eleve, classe, titre_livre, auteur_livre)`. Donne un exemple d'anomalie de mise à jour et propose un meilleur schéma.

:::criteres
- 1 point : une anomalie correcte, par exemple un auteur à corriger sur plusieurs lignes.
- 2 points : un schéma avec au moins deux relations reliées par une clé étrangère.
:::

:::corrige
Si le nom d'un auteur est mal écrit, il faut le corriger sur toutes les lignes de ses livres, avec un risque d'oubli. Un meilleur schéma : eleve(<u>id_eleve</u>, nom, classe), livre(<u>id_livre</u>, titre, auteur), emprunt(<u>id_emprunt</u>, #id_eleve, #id_livre).
:::
::::
