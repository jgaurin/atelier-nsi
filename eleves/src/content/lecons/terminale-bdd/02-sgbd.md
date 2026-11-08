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

La solution : découper en plusieurs relations reliées par des **clés étrangères**. Ici, une relation `classe` garde la salle une seule fois, et chaque élève référence sa classe.

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

::::exercice[La billetterie d'un festival]{niveau=3}
Un festival enregistre tout dans une seule table : billet(spectateur, email, concert, date_concert, salle, capacite_salle).

1. Donne un exemple précis de chaque anomalie : mise à jour, insertion, suppression.
2. Propose un schéma relationnel sans ces anomalies, avec les clés primaires et étrangères.
3. Deux guichets vendent au même instant la dernière place d'un concert. Quel service du SGBD évite une double vente ?
4. Une coupure de courant survient juste après une vente. Quel service garantit que la vente n'est pas perdue ?
5. Seul le personnel doit pouvoir modifier les concerts. Quel service est concerné ?

:::criteres
- Trois anomalies illustrées avec les colonnes du sujet.
- Des relations séparées pour spectateur, salle, concert, billet, reliées par des clés étrangères.
- Accès concurrents, persistance, sécurisation des accès.
:::

:::corrige
1. **Mise à jour** : si une salle change de capacité, il faut modifier toutes les lignes de ses billets. **Insertion** : on ne peut pas enregistrer un concert sans billet vendu. **Suppression** : supprimer le dernier billet d'un concert efface les informations sur ce concert.
2. spectateur(<u>id_spectateur</u>, nom, email) ; salle(<u>id_salle</u>, nom, capacite) ; concert(<u>id_concert</u>, titre, date_concert, #id_salle) ; billet(<u>id_billet</u>, #id_spectateur, #id_concert).
3. La gestion des **accès concurrents**.
4. La **persistance**.
5. La **sécurisation des accès**.
:::
::::
