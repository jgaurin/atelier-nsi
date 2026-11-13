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

Tes photos « dans le cloud » ne flottent pas dans les airs. Elles sont enregistrées sur de vrais disques, dans de vrais bâtiments, quelque part dans le monde.

## 1. Où stocker ses fichiers ?

| Support | Exemple | Local ou distant |
| --- | --- | --- |
| Interne | le disque dur ou le SSD de l'ordinateur | local |
| Externe | une clé USB, un disque externe | local |
| Nuage (*cloud*) | un service de stockage en ligne | distant |

Avec le **nuage**, on accède à ses fichiers depuis n'importe quel appareil connecté. En échange, on les confie à une entreprise, et il faut Internet pour y accéder.

Tout support peut tomber en panne, être perdu ou volé. Il faut donc faire des **sauvegardes** : garder une copie à un autre endroit, par exemple sur un disque externe **et** dans le nuage.

## 2. Partager et synchroniser

Ce sont deux choses différentes :

- **Partager**, c'est donner accès à un fichier à d'autres personnes, avec un lien. On choisit si elles peuvent seulement le **lire**, ou aussi le **modifier**.
- **Synchroniser**, c'est garder **le même fichier à jour sur plusieurs appareils**. Tu modifies un document sur ton ordinateur, et la modification apparaît sur ton téléphone.

:::attention
La synchronisation recopie **tout**, y compris les erreurs et les suppressions. Un fichier supprimé par erreur sur un appareil disparaît aussi des autres. La synchronisation n'est donc **pas** une sauvegarde.
:::

## 3. Les centres de données

Le nuage repose sur des **centres de données** : des bâtiments remplis de milliers de serveurs qui tournent jour et nuit.

Ils consomment beaucoup de ressources :

- de l'**électricité**, pour faire fonctionner les serveurs ;
- encore de l'électricité, et souvent de l'**eau**, pour les **refroidir**, car les serveurs chauffent énormément ;
- des **métaux rares**, pour fabriquer les machines.

En ordre de grandeur, les centres de données utilisent environ **1,5 % de l'électricité mondiale**, et cette part augmente.

:::exemple
Un centre de données qui consomme en permanence 20 MW utilise en un an 20 × 8 760 heures = 175 200 MWh, autant qu'environ 35 000 foyers.
:::

Stocker moins de fichiers inutiles et éviter les copies en double réduit cette consommation.

## L'essentiel

- Le nuage est un stockage distant, sur de vrais serveurs, dans des centres de données.
- Partager donne accès à d'autres personnes ; synchroniser garde un fichier identique sur plusieurs appareils.
- La synchronisation n'est pas une sauvegarde.
- Serveurs et refroidissement consomment beaucoup : environ 1,5 % de l'électricité mondiale.

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
