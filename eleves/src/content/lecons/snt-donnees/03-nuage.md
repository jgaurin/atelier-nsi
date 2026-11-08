---
titre: Les données dans le nuage
resume: "Stocker et partager dans le nuage, sauvegarder, et mesurer le coût énergétique des centres de données."
duree: 25
objectifs:
  - "Utiliser un stockage dans le nuage, partager des fichiers et paramétrer la synchronisation"
  - "Identifier les causes de la consommation énergétique des centres de données"
  - "Situer son ordre de grandeur"
prerequis: [snt-donnees/descripteurs]
---

Un fichier est toujours stocké sur un support physique, même quand il est « dans le nuage ».

## 1. Stocker

| Support | Exemple | Local ou distant |
| --- | --- | --- |
| Interne | disque dur, SSD | local |
| Externe | clé USB | local |
| Nuage (*cloud*) | service en ligne | distant |

Tout support peut tomber en panne : il faut faire des **sauvegardes**, si possible à deux endroits.

## 2. Partager et synchroniser

- **Partager** : on donne un lien, en choisissant lecture seule ou modification.
- **Synchroniser** : le même fichier est mis à jour sur plusieurs appareils.

:::attention
Avec la synchronisation, un fichier supprimé sur un appareil peut disparaître partout. Ce n'est donc pas une sauvegarde.
:::

## 3. Les centres de données

Le nuage repose sur des **centres de données** : des bâtiments remplis de serveurs.

Ils consomment :

- de l'**électricité**, pour les serveurs et leur refroidissement ;
- de l'**eau**, pour le refroidissement ;
- des **métaux rares**, pour la fabrication des machines.

En ordre de grandeur, les centres de données utilisent environ **1,5 % de l'électricité mondiale**.

## L'essentiel

- Le nuage est un stockage distant, sur de vraies machines.
- Partager donne accès, synchroniser garde des copies identiques.
- Serveurs et refroidissement sont les principales causes de consommation.
- Ordre de grandeur : environ 1,5 % de l'électricité mondiale.

## Exercices

::::exercice[Local ou distant ?]{niveau=1 type=associer}
Classe chaque support.

| Support | Type |
| --- | --- |
| Clé USB | local |
| Service de stockage en ligne | distant |
| SSD de l'ordinateur | local |
| Serveur d'un hébergeur | distant |
::::

::::exercice[QCM : nuage]{niveau=1 type=quiz}
Une question à la fois : la correction s'affiche aussitôt.

1. Où sont vraiment les fichiers du nuage ?

   - [ ] dans l'air
   - [x] sur des serveurs, dans des centres de données
   - [ ] dans le navigateur uniquement
   - [ ] dans les satellites GPS

   > « Nuage » est une image.

1. Pourquoi faire des sauvegardes ?

   - [x] parce qu'un support peut tomber en panne
   - [ ] pour accélérer Internet
   - [ ] pour rendre les fichiers publics
   - [ ] pour réduire la taille des fichiers

   > Une copie ailleurs protège les données.

1. Pourquoi les centres de données ont-ils besoin d'eau ou de climatisation ?

   - [ ] pour nettoyer les serveurs
   - [x] pour refroidir les machines
   - [ ] pour produire les données
   - [ ] pour accélérer les paquets

   > Les serveurs chauffent beaucoup.

1. Quelle part de l'électricité mondiale utilisent-ils environ ?

   - [x] 1,5 %
   - [ ] 15 %
   - [ ] 50 %
   - [ ] 90 %

   > C'est un ordre de grandeur, en augmentation.
::::

::::exercice[Bien partager]{niveau=2}
Un groupe prépare un exposé. Chacun doit pouvoir modifier le diaporama, mais les autres classes doivent seulement le lire. Explique quels réglages utiliser, et pourquoi la synchronisation ne remplace pas une sauvegarde.

:::criteres
- Accès en modification pour le groupe, lecture seule pour les autres.
- Une suppression ou une erreur peut être synchronisée partout.
:::

:::corrige
On donne un accès en **modification** aux membres du groupe, et un lien en **lecture seule** aux autres classes. La synchronisation recopie aussi les erreurs et les suppressions : pour se protéger, il faut garder une copie séparée.
:::
::::

::::exercice[Un centre de données]{niveau=3 type=reponses}
Un centre de données consomme en permanence une puissance de 20 MW. Un foyer consomme environ 5 MWh par an. Une année compte 8 760 heures. Rappel : énergie (MWh) = puissance (MW) × durée (h).

1. Combien de MWh consomme-t-il en un an ?

   ```python calcul
   print(20 * 8760)
   ```

   - 175200
   - 175 200

1. Cela correspond à la consommation annuelle de combien de foyers ?

   ```python calcul
   print(20 * 8760 // 5)
   ```

   - 35040
   - 35 040

1. Si 40 % de cette énergie sert au refroidissement, combien de MWh cela représente-t-il ?

   ```python calcul
   print(20 * 8760 * 40 // 100)
   ```

   - 70080
   - 70 080

1. Cite une ressource, autre que l'électricité, utilisée pour le refroidissement.

   - eau
   - l'eau
::::
