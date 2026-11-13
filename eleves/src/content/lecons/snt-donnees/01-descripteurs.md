---
titre: Données, descripteurs et métadonnées
resume: "Comment organiser des données dans une table, reconnaître une donnée personnelle et lire des métadonnées."
duree: 30
objectifs:
  - "Identifier les descripteurs d'un objet"
  - "Distinguer la valeur d'une donnée de son descripteur"
  - "Définir une donnée personnelle"
  - "Identifier les principaux formats de données et retrouver des métadonnées"
---

Ton carnet de contacts, la liste des films que tu as vus, les résultats d'une compétition : ce sont des **données**. Pour pouvoir les retrouver, les trier ou les compter, il faut les organiser.

## 1. Données, descripteurs, valeurs

Une **donnée** est une valeur qui décrit un objet, une personne ou un événement. Le numéro de téléphone d'un ami est une donnée.

Pour décrire un contact, on utilise plusieurs **descripteurs** : nom, prénom, ville, téléphone. Pour chaque contact, chaque descripteur a une **valeur**.

| Nom | Âge | Ville |
| --- | --- | --- |
| Léa | 15 | Lyon |
| Tom | 16 | Nantes |

- Le **descripteur**, c'est le titre de la colonne : `Ville`.
- La **valeur**, c'est le contenu d'une case : `Lyon`.
- Une **collection** regroupe des objets qui ont les mêmes descripteurs : tous tes contacts.

Les objets sont en **lignes**, les descripteurs en **colonnes**, et chaque valeur se trouve à leur croisement. Des données rangées ainsi sont dites **structurées** : un ordinateur peut facilement les trier ou les filtrer.

Une **base de données** regroupe plusieurs collections reliées entre elles. Celle d'une bibliothèque contient les livres, les abonnés, et les emprunts qui relient les deux.

## 2. Les formats de fichiers

| Format | Usage |
| --- | --- |
| **CSV** | une table, avec les valeurs séparées par des virgules ou des points-virgules |
| **vCard** | des contacts, compris par tous les téléphones |

Les données ont aussi des **types** : nombre, texte, date. Le type décide de ce qu'on peut en faire : on calcule une moyenne d'âges, mais pas une moyenne de prénoms.

## 3. Les métadonnées

Les **métadonnées** sont des **données sur les données** : elles décrivent un fichier. Pour une photo : la date, l'appareil, le lieu. Pour un document : l'auteur, la date de création, la taille.

Certaines sont enregistrées **automatiquement** par l'appareil, comme la date d'une photo. D'autres sont **saisies** par une personne, comme le titre d'un document. On les consulte dans les **propriétés** du fichier.

## 4. Les données personnelles

Une **donnée personnelle** permet d'identifier une personne, **directement** (nom, photo, numéro de téléphone) ou **indirectement**, par recoupement (date de naissance + ville + lycée).

En Europe, le **RGPD** les protège. Tu as notamment le droit de savoir quelles données une entreprise collecte sur toi, d'y accéder, et de demander leur effacement.

À l'inverse, les **données ouvertes**, ou *open data*, sont des données publiques que chacun peut télécharger et réutiliser librement, par exemple sur `data.gouv.fr`.

## L'essentiel

- Descripteur : le titre de la colonne. Valeur : le contenu d'une case. Collection : des objets aux mêmes descripteurs.
- Une table présente une collection : objets en lignes, descripteurs en colonnes.
- Métadonnées : des données qui décrivent un fichier.
- Donnée personnelle : permet d'identifier une personne, même indirectement. Le RGPD la protège.

## Exercices

::::exercice[Descripteur ou valeur ?]{niveau=1 type=associer}
Dans une table de films, indique la nature de chaque élément.

| Élément | Nature |
| --- | --- |
| Titre | descripteur |
| Wall-E | valeur |
| Année | descripteur |
| 2008 | valeur |
::::

::::exercice[QCM : données]{niveau=1 type=quiz}
Une question à la fois : la correction s'affiche aussitôt.

1. Dans une table, que trouve-t-on en colonnes ?

   - [ ] les objets
   - [x] les descripteurs
   - [ ] les fichiers
   - [ ] les métadonnées

   > Les objets sont en lignes.

1. Laquelle est une donnée personnelle ?

   - [ ] la température à Paris
   - [x] un numéro de téléphone
   - [ ] le prix d'un livre
   - [ ] le nom d'une ville

   > Elle permet de joindre et d'identifier une personne.

1. Quelle est une métadonnée d'une photo ?

   - [x] la date de prise de vue
   - [ ] la couleur du ciel
   - [ ] le sourire d'une personne
   - [ ] le nombre d'arbres visibles

   > Elle décrit le fichier.

1. Que signifie CSV ?

   - [ ] un format d'image
   - [x] des valeurs séparées, pour enregistrer une table
   - [ ] un langage de programmation
   - [ ] un réseau social

   > *Comma Separated Values*.
::::

::::exercice[Lire un fichier CSV]{niveau=2 type=reponses}
Voici un fichier.

```
titre;annee;duree
Wall-E;2008;98
Coco;2017;105
Up;2009;96
```

1. Quel est le séparateur ?

   - ;
   - point-virgule

1. Combien de descripteurs y a-t-il ?

   - 3

1. Combien d'objets la collection contient-elle ?

   - 3

1. Quelle est la valeur du descripteur `duree` pour Coco ?

   - 105
::::

::::exercice[Une application de carnet de santé]{niveau=3}
Une application enregistre : prénom, date de naissance, taille, poids, ville. Chaque enregistrement crée aussi automatiquement un fichier dont les informations sont : date de création, modèle du téléphone, coordonnées GPS.

1. Propose une représentation en table, avec une ligne d'exemple.
2. Quels éléments sont des métadonnées ? Sont-ils saisis par l'utilisateur ?
3. Lesquelles de ces informations sont des données personnelles ? Justifie.
4. Peut-on diffuser cette table en données ouvertes telle quelle ? Que faut-il changer ?
5. Que permet le RGPD à l'utilisateur ?

:::criteres
- Une table correcte, avec les descripteurs en colonnes.
- Métadonnées enregistrées automatiquement.
- Des données qui identifient directement ou par recoupement, comme les coordonnées GPS.
- Retirer ce qui permet d'identifier une personne.
- Savoir ce qui est collecté, accéder aux données, demander leur effacement.
:::

:::corrige
1. Colonnes : prénom, naissance, taille, poids, ville. Par exemple : Léa, 2010-03-02, 165, 52, Lyon.
2. La date de création, le modèle du téléphone et les coordonnées GPS sont des métadonnées, enregistrées **automatiquement**.
3. Toutes peuvent le devenir par recoupement, en particulier le prénom, la date de naissance et les coordonnées GPS : elles permettent d'identifier ou de localiser une personne.
4. Non. Il faut retirer ou rendre anonyme ce qui permet de retrouver quelqu'un.
5. Il permet de savoir quelles données sont collectées, d'y accéder et de demander leur effacement.
:::
::::
