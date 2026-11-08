---
titre: Le modèle relationnel
resume: "Relations, attributs, domaines, clés primaires et étrangères, schéma d'une base de données."
duree: 35
objectifs:
  - "Identifier les concepts du modèle relationnel"
  - "Distinguer la structure d'une base de son contenu"
  - "Repérer clés primaires et clés étrangères"
---

Quand les données deviennent nombreuses et partagées, on utilise une **base de données relationnelle** : des tables reliées entre elles.

## 1. Vocabulaire

| Terme | Sens |
| --- | --- |
| **Relation** | une table |
| **Attribut** | une colonne |
| **Domaine** | le type de valeurs d'un attribut : entier, texte, date |
| **Enregistrement** | une ligne |
| **Schéma** | la structure de la base : relations, attributs, clés |

## 2. Les clés

- La **clé primaire** identifie **de façon unique** chaque ligne. On la souligne.
- Une **clé étrangère** fait référence à la clé primaire d'une autre relation. On la note avec `#`.

Exemple :

- classe(<u>id_classe</u>, niveau, salle)
- eleve(<u>id_eleve</u>, nom, prenom, #id_classe)
- note(<u>id_note</u>, #id_eleve, valeur)

## 3. Les contraintes d'intégrité

| Contrainte | Garantit que… | Exemple refusé |
| --- | --- | --- |
| de **domaine** | chaque valeur a le bon type | une note égale à `"bien"` |
| de **relation** | la clé primaire est unique et non vide | deux élèves avec le même identifiant |
| de **référence** | une clé étrangère désigne une ligne existante | une note pour un élève inexistant |

Le **schéma** est la **structure** de la base. Les lignes en sont le **contenu**.

## L'essentiel

- Relation = table, attribut = colonne, enregistrement = ligne.
- Clé primaire : unique. Clé étrangère : référence une autre relation.
- Contraintes : de domaine, de relation, de référence.

## Exercices

::::exercice[QCM : modèle relationnel]{niveau=1 type=quiz}
Une question à la fois : la correction s'affiche aussitôt.

1. Dans le modèle relationnel, une relation est :

   - [ ] un lien entre deux tables
   - [x] une table
   - [ ] une ligne
   - [ ] une requête

   > Le vocabulaire est trompeur : « relation » désigne la table elle-même.

1. Un enregistrement est :

   - [ ] une colonne
   - [x] une ligne
   - [ ] la base entière
   - [ ] une clé

   > On dit aussi n-uplet.

1. Quel attribut convient comme clé primaire de `eleve` ?

   - [ ] nom
   - [ ] naissance
   - [x] id_eleve
   - [ ] id_classe

   > Le seul qui ne peut pas se répéter.

1. Dans `note`, `id_eleve` est :

   - [ ] la clé primaire
   - [x] une clé étrangère vers `eleve`
   - [ ] un attribut sans lien
   - [ ] un domaine

   > Il référence la clé primaire de `eleve`.

1. Quelle opération le SGBD refuse-t-il à cause de la contrainte de référence ?

   - [ ] ajouter un élève sans date de naissance
   - [x] ajouter une note pour un élève qui n'existe pas
   - [ ] modifier la salle d'une classe
   - [ ] ajouter une matière

   > La clé étrangère doit désigner une ligne existante.

1. Deux élèves ont le même `id_eleve`. Quelle contrainte est violée ?

   - [ ] de domaine
   - [x] d'entité (unicité de la clé primaire)
   - [ ] de référence
   - [ ] aucune

   > La clé primaire doit être unique et non vide.

1. Une note de 25 sur 20 viole une contrainte :

   - [x] de domaine
   - [ ] d'entité
   - [ ] de référence
   - [ ] de redondance

   > La base impose `valeur BETWEEN 0 AND 20`.

1. Que décrit le schéma relationnel ?

   - [ ] les données contenues dans la base
   - [x] la structure : les relations, leurs attributs et leurs clés
   - [ ] les requêtes possibles
   - [ ] les utilisateurs

   > Le contenu (les lignes) change sans cesse ; le schéma rarement.

1. Comment note-t-on une clé étrangère dans un schéma relationnel ?

   - [ ] en la soulignant
   - [x] avec un # devant
   - [ ] en majuscules
   - [ ] entre parenthèses

   > La clé primaire, elle, est soulignée.
::::

::::exercice[Quelle contrainte ?]{niveau=1 type=associer}
Quelle contrainte chaque action viole-t-elle ?

| Action | Contrainte |
| --- | --- |
| Écrire une date dans une colonne d'entiers | domaine |
| Créer deux livres avec le même identifiant | relation |
| Enregistrer un emprunt pour un adhérent inexistant | référence |
::::

::::exercice[Lire un schéma]{niveau=2 type=reponses}
On considère film(<u>id_film</u>, titre, annee, #id_realisateur) et realisateur(<u>id_realisateur</u>, nom).

1. Quelle est la clé primaire de `film` ?

   - id_film

1. Quelle est la clé étrangère de `film` ?

   - id_realisateur

1. Combien d'attributs possède la relation `film` ?

   - 4

1. Un film peut-il avoir deux réalisateurs dans ce schéma ? Réponds par oui ou par non.

   - non
::::

::::exercice[Lire un schéma]{niveau=1}
Voici le schéma de la base d'une médiathèque :

- auteur(<u>id_auteur</u>, nom, prenom, naissance, nationalite)
- livre(<u>id_livre</u>, titre, #id_auteur, annee, genre, pages)
- adherent(<u>id_adherent</u>, nom, prenom, email, ville, inscription)
- emprunt(<u>id_emprunt</u>, #id_livre, #id_adherent, date_emprunt, date_retour)

(a) Donne les clés primaires et étrangères de chaque relation. (b) Un livre peut-il avoir deux auteurs dans ce schéma ? (c) Pourquoi ne pas
mettre le nom de l'auteur directement dans `livre` ? (d) Quelles opérations le SGBD refusera-t-il si l'on veut supprimer l'adhérent n° 3 qui a
des emprunts en cours ?

:::criteres
- (a) Clés primaires : les id ; clés étrangères : `livre.id_auteur`, `emprunt.id_livre`, `emprunt.id_adherent`.
- (b) Non : un seul `id_auteur` par livre ; il faudrait une relation d'association écrit(#id_livre, #id_auteur).
- (c) Redondance : le nom serait répété pour chaque livre de l'auteur, avec risque d'incohérence.
- (d) La suppression est refusée (contrainte de référence) tant que des emprunts le référencent.
:::

:::corrige
(a) **Clés primaires** : `id_auteur`, `id_livre`, `id_adherent`, `id_emprunt`. **Clés étrangères** : `livre.id_auteur` (vers `auteur`),
`emprunt.id_livre` (vers `livre`) et `emprunt.id_adherent` (vers `adherent`). (b) **Non** : chaque livre n'a qu'**un** `id_auteur`. Pour
plusieurs auteurs, on supprimerait cet attribut et on créerait une relation d'association `ecrit(#id_livre, #id_auteur)`, dont la clé
primaire est le couple. (c) Le nom de l'auteur serait **répété** pour chacun de ses livres (redondance) : une faute corrigée sur un seul livre
rendrait la base incohérente. (d) Le SGBD **refuse** de supprimer l'adhérent tant que des lignes de `emprunt` le référencent (contrainte de
**référence**) : il faut d'abord traiter ses emprunts.
:::
::::
