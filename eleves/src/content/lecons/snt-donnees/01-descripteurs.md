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

Une **donnée** est une valeur qui décrit un objet, une personne ou un événement.

## 1. Organiser en table

- Un **descripteur** est une caractéristique : nom, âge, ville.
- Une **valeur** est le contenu pour un objet précis : `Lyon`.
- Une **collection** regroupe des objets qui ont les mêmes descripteurs.

| Nom | Âge | Ville |
| --- | --- | --- |
| Léa | 15 | Lyon |
| Tom | 16 | Nantes |

Les objets sont en **lignes**, les descripteurs en **colonnes**, les données à l'intersection. Ces données sont dites **structurées**.

Une **base de données** regroupe plusieurs collections reliées entre elles : livres, abonnés et emprunts d'une bibliothèque, par exemple.

## 2. Les formats

| Format | Usage |
| --- | --- |
| CSV | une table, avec des valeurs séparées |
| vCard | des contacts |

Les données ont des **types** : nombre, texte, date. Le type détermine les traitements possibles.

## 3. Les métadonnées

Les **métadonnées** sont des données qui décrivent un fichier : date, auteur, taille, lieu d'une photo. Certaines sont enregistrées par l'appareil, d'autres saisies par une personne. On les consulte dans les propriétés du fichier.

## 4. Les données personnelles

Une **donnée personnelle** permet d'identifier une personne, directement ou indirectement : nom, adresse, numéro de téléphone, photo.

Le **RGPD** protège ces données en Europe : on doit pouvoir savoir ce qui est collecté, et demander à y accéder ou à l'effacer.

Les **données ouvertes** (*open data*) sont publiques et réutilisables, comme sur `data.gouv.fr`.

## L'essentiel

- Descripteur : la colonne. Valeur : le contenu d'une case.
- Une table présente une collection.
- Métadonnées : les informations sur un fichier.
- Donnée personnelle : permet d'identifier une personne. Le RGPD la protège.

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
