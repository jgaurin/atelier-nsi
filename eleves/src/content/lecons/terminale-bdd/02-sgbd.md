---
titre: Anomalies et SGBD
resume: "Repérer les défauts d'un schéma et connaître les services rendus par un système de gestion de bases de données."
duree: 30
objectifs:
  - "Repérer des anomalies dans le schéma d'une base de données"
  - "Identifier les services rendus par un SGBD"
prerequis: [terminale-bdd/modele-relationnel]
---

Pourquoi découper les données en plusieurs tables plutôt que tout mettre dans une seule ? Et quel logiciel gère tout cela ? C'est l'objet de cette leçon.

## 1. Le problème d'une table unique

Imagine qu'on range tout dans une seule table.

| nom | classe | salle |
| --- | --- | --- |
| Léa | 2D1 | B104 |
| Hugo | 2D1 | B104 |
| Inès | 2D1 | B104 |

La salle de la 2D1 est écrite trois fois : c'est de la **redondance**. Elle provoque trois problèmes, appelés **anomalies**.

| Anomalie | Ce qui se passe |
| --- | --- |
| **de mise à jour** | la 2D1 change de salle : il faut modifier les trois lignes. Si on en oublie une, la base devient incohérente. |
| **d'insertion** | une nouvelle classe est créée, sans élève pour l'instant : impossible d'enregistrer sa salle, car chaque ligne doit contenir un élève. |
| **de suppression** | le dernier élève de la 2D1 part : en supprimant sa ligne, on perd aussi la salle de la classe. |

## 2. La solution : découper

On sépare les informations en deux tables reliées par une clé :

| <u>id_classe</u> | salle |
| --- | --- |
| 2D1 | B104 |

| <u>id_eleve</u> | nom | #id_classe |
| --- | --- | --- |
| 1 | Léa | 2D1 |
| 2 | Hugo | 2D1 |
| 3 | Inès | 2D1 |

La salle n'est plus écrite qu'**une seule fois**. Changer de salle ne modifie qu'une ligne, une classe peut exister sans élève, et supprimer un élève ne supprime pas la classe.

## 3. Le SGBD

Un **système de gestion de bases de données** (SGBD) est le logiciel qui stocke la base et répond aux requêtes. Il rend quatre services.

| Service | Ce qu'il garantit | Exemple |
| --- | --- | --- |
| **persistance** | les données restent enregistrées durablement | après une panne de courant, les notes sont toujours là |
| **gestion des accès concurrents** | plusieurs personnes travaillent en même temps sans s'abîmer leurs données | deux guichets ne vendent pas la même dernière place |
| **efficacité** | les requêtes sont traitées rapidement, même sur des millions de lignes | retrouver un élève parmi des millions instantanément |
| **sécurisation des accès** | chacun ne voit et ne modifie que ce qu'il a le droit de voir | un élève consulte ses notes mais ne peut pas les changer |

## L'essentiel

- La redondance provoque des anomalies de mise à jour, d'insertion et de suppression.
- On découpe en tables reliées par des clés : chaque information n'est écrite qu'une fois.
- Un SGBD assure la persistance, les accès concurrents, l'efficacité et la sécurisation des accès.

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
