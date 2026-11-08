---
titre: Anomalies et SGBD
resume: "Repérer les défauts d'un schéma et connaître les services rendus par un système de gestion de bases de données."
duree: 30
objectifs:
  - "Repérer des anomalies dans le schéma d'une base de données"
  - "Identifier les services rendus par un SGBD"
prerequis: [terminale-bdd/modele-relationnel]
---

Un mauvais schéma provoque des erreurs. Un **SGBD** est le logiciel qui gère la base et protège les données.

## 1. Les anomalies

Une seule grande table répète les mêmes informations : c'est de la **redondance**.

| nom | classe | salle |
| --- | --- | --- |
| Léa | 2D1 | B104 |
| Hugo | 2D1 | B104 |

- **Anomalie de mise à jour** : si la 2D1 change de salle, il faut modifier toutes ses lignes.
- **Anomalie d'insertion** : impossible d'enregistrer une classe sans élève.
- **Anomalie de suppression** : supprimer le dernier élève d'une classe fait disparaître sa salle.

La solution : découper en plusieurs relations reliées par des **clés étrangères**.

## 2. Les services d'un SGBD

| Service | Sens |
| --- | --- |
| **Persistance** | les données restent stockées durablement |
| **Accès concurrents** | plusieurs utilisateurs travaillent en même temps sans erreur |
| **Efficacité** | les requêtes sont traitées rapidement |
| **Sécurisation des accès** | comptes et droits d'accès |

## L'essentiel

- La redondance provoque des anomalies de mise à jour, d'insertion et de suppression.
- On découpe en relations reliées par des clés.
- Un SGBD assure persistance, accès concurrents, efficacité et sécurisation des accès.

## Exercices

::::exercice[Quelle anomalie ?]{niveau=1 type=associer}
Dans une table unique `commande(client, adresse_client, produit, prix_produit)`, quelle anomalie apparaît ?

| Situation | Anomalie |
| --- | --- |
| Un client déménage : il faut changer plusieurs lignes | mise à jour |
| On ne peut pas ajouter un produit jamais commandé | insertion |
| Effacer l'unique commande d'un client fait perdre son adresse | suppression |
::::

::::exercice[Quel service ?]{niveau=1 type=associer}
Quel service du SGBD est concerné ?

| Situation | Service |
| --- | --- |
| Après une panne de courant, les données sont toujours là | persistance |
| Deux personnes réservent la dernière place au même moment | accès concurrents |
| Un élève ne peut pas modifier ses notes | sécurisation des accès |
| Une recherche parmi des millions de lignes est rapide | efficacité |
::::

::::exercice[Repérer les anomalies]{niveau=2}
Un club de sport stocke tout dans une seule table :
inscription(nom_membre, telephone, nom_activite, jour, tarif_activite, nom_coach, telephone_coach).
(a) Donne un exemple de chaque anomalie (mise à jour, insertion, suppression). (b) Propose un schéma relationnel sans redondance, avec ses clés
primaires et étrangères.

:::criteres
- (a) Mise à jour : changer le tarif d'une activité ou le téléphone d'un coach sur toutes les lignes ; insertion : impossible d'ajouter une
  activité sans membre ; suppression : le dernier membre qui se désinscrit fait disparaître l'activité et son coach.
- (b) Au moins quatre relations : membre, coach, activite (avec #id_coach), inscription (#id_membre, #id_activite).
- Clés primaires (identifiants) et étrangères correctement placées.
:::

:::corrige
(a) **Mise à jour** : si le tarif du judo augmente, il faut le modifier sur la ligne de **chaque** inscrit ; un oubli et deux tarifs coexistent.
**Insertion** : on ne peut pas créer une nouvelle activité (avec son coach et son tarif) tant que personne n'y est inscrit. **Suppression** :
si le dernier inscrit au yoga part, on perd le tarif du yoga et le téléphone de son coach.

(b) Un schéma possible :

- membre(<u>id_membre</u>, nom, telephone)
- coach(<u>id_coach</u>, nom, telephone)
- activite(<u>id_activite</u>, nom, jour, tarif, #id_coach)
- inscription(<u>#id_membre, #id_activite</u>)

Chaque information est stockée une fois. La clé primaire d'`inscription` est le **couple** (id_membre, id_activite) : un membre ne s'inscrit
qu'une fois à une activité.
:::
::::

::::exercice[Pourquoi un SGBD ?]{niveau=2}
Le lycée gère les réservations de salles dans un fichier tableur partagé, ouvert par plusieurs professeurs en même temps. Explique trois
problèmes qui peuvent survenir et comment un SGBD les résout.

:::criteres
- Accès concurrents : deux professeurs réservent la même salle au même moment, l'un écrase l'autre ; le SGBD gère les transactions.
- Intégrité : rien n'empêche une salle inexistante ou un créneau incohérent ; le SGBD vérifie les contraintes.
- Sécurité et persistance : n'importe qui peut tout effacer, pas de reprise après panne ; le SGBD gère les droits et les sauvegardes.
:::

:::corrige
1. **Accès concurrents** : deux professeurs réservent la salle C201 au même créneau, chacun sur sa copie ouverte ; le dernier qui enregistre
   **écrase** l'autre. Un SGBD traite les modifications comme des **transactions** : la seconde voit la salle déjà prise et est refusée.
2. **Intégrité** : le tableur accepte une salle qui n'existe pas, une date mal écrite, une réservation sans professeur. Un SGBD impose des
   **contraintes** (domaine, clé étrangère vers la table des salles, unicité du couple salle-créneau).
3. **Sécurité et persistance** : n'importe qui peut supprimer toutes les lignes, et un fichier corrompu fait tout perdre. Un SGBD gère des
   **droits** (un professeur ne modifie que ses réservations), journalise les opérations et permet la **reprise** après panne.
:::
::::
