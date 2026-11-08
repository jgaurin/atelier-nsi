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

Une clé primaire doit rester unique pour **toutes** les lignes possibles. Un nom ne convient donc pas : deux personnes peuvent le porter. On ajoute souvent un identifiant.

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

1. Que décrit le schéma relationnel ?

   - [ ] les données contenues dans la base
   - [x] la structure : les relations, leurs attributs et leurs clés
   - [ ] les requêtes possibles
   - [ ] les utilisateurs

   > Le contenu (les lignes) change sans cesse ; le schéma rarement.
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

::::exercice[Une application de covoiturage]{niveau=3}
Une application utilise le schéma suivant :

- conducteur(<u>id_conducteur</u>, nom, telephone)
- trajet(<u>id_trajet</u>, depart, arrivee, jour, #id_conducteur)
- reservation(<u>id_reservation</u>, #id_trajet, passager, places)

1. Quelles sont les clés étrangères ? Que référencent-elles ?
2. Pourrait-on choisir `nom` comme clé primaire de `conducteur` ? Justifie.
3. Propose une contrainte de domaine pertinente pour l'attribut `places`.
4. On ajoute une réservation pour le trajet 99, qui n'existe pas. Que se passe-t-il ? Quelle contrainte est en jeu ?
5. On veut supprimer un conducteur qui a des trajets. Pourquoi est-ce refusé ? Que faut-il faire avant ?
6. Ajouter une colonne `prix` et ajouter une nouvelle réservation : laquelle de ces actions modifie le schéma ?

:::criteres
- `id_conducteur` référence `conducteur`, `id_trajet` référence `trajet`.
- Non : deux conducteurs peuvent avoir le même nom.
- `places` est un entier strictement positif.
- Refus, à cause de la contrainte de référence.
- Il faut d'abord supprimer ce qui dépend de ce conducteur : réservations, puis trajets.
- Ajouter une colonne modifie le schéma ; ajouter une ligne modifie le contenu.
:::

:::corrige
1. `id_conducteur`, dans `trajet`, référence la clé primaire de `conducteur`. `id_trajet`, dans `reservation`, référence celle de `trajet`.
2. Non. Une clé primaire doit être unique, or deux conducteurs peuvent avoir le même nom.
3. `places` doit être un entier strictement positif.
4. Le SGBD refuse l'insertion : la **contrainte de référence** impose que `id_trajet` désigne un trajet existant.
5. Des trajets référencent ce conducteur : le supprimer violerait la contrainte de référence. Il faut d'abord supprimer les réservations de ses trajets, puis ses trajets, puis le conducteur.
6. Ajouter une colonne modifie le **schéma**, donc la structure. Ajouter une réservation ne change que le **contenu**.
:::
::::
