---
titre: Métadonnées et algorithmes
resume: "Ce que contient une photo sans se voir, et ce que calculent les appareils."
duree: 25
objectifs:
  - "Retrouver les métadonnées d'une photographie"
  - "Expliciter des algorithmes associés à la prise de vue"
  - "Identifier les étapes de la construction de l'image finale"
prerequis: [snt-photo/pixels]
---

Une photo contient bien plus que ses pixels.

## 1. Les métadonnées EXIF

Le format **EXIF** enregistre dans le fichier des informations comme : modèle de l'appareil, objectif, vitesse, diaphragme, date, auteur, position GPS.

On les lit dans les **propriétés** du fichier, ou avec un logiciel.

:::attention
Si la position GPS est enregistrée, une photo partagée peut révéler où tu habites.
:::

## 2. La construction de l'image

| Étape | Algorithmes |
| --- | --- |
| **Prise de vue** | calcul de l'exposition, mise au point, stabilisation |
| **Développement** | gestion de la lumière, balance des blancs, netteté, correction des distorsions |
| **Après le développement** | compression du fichier |

## 3. La fusion d'images

Un téléphone a un petit capteur. Il prend souvent **plusieurs images** et les combine :

- **réduction du bruit** ;
- **HDR** : détails à la fois dans les zones claires et sombres ;
- **panorama** ;
- *focus stacking* : plusieurs mises au point pour étendre la netteté.

## 4. Les enjeux

Une image se copie sans coût et se diffuse vite. Elle peut être truquée, être difficile à faire disparaître, ou permettre de pister une personne. Se pose aussi la question de sa conservation à long terme.

## L'essentiel

- EXIF : les métadonnées d'une photo, dont parfois sa position.
- Prise de vue, développement, compression.
- Un téléphone combine souvent plusieurs images.

## Exercices

::::exercice[Quelle étape ?]{niveau=1 type=associer}
Associe chaque algorithme à son étape.

| Algorithme | Étape |
| --- | --- |
| Mise au point automatique | prise de vue |
| Balance des blancs | développement |
| Passage au format JPEG | compression |
| Stabilisation | prise de vue |
::::

::::exercice[QCM : photo]{niveau=1 type=quiz}
Une question à la fois : la correction s'affiche aussitôt.

1. Que contiennent les métadonnées EXIF ?

   - [ ] les pixels de l'image
   - [x] des informations sur la prise de vue
   - [ ] la liste des amis
   - [ ] le prix de l'appareil

   > Modèle, réglages, date, position.

1. À quoi sert le HDR ?

   - [x] à garder des détails dans les zones claires et sombres
   - [ ] à diminuer le nombre de pixels
   - [ ] à écrire la date sur la photo
   - [ ] à supprimer les métadonnées

   > Il combine plusieurs expositions.

1. Pourquoi un téléphone combine-t-il plusieurs images ?

   - [ ] pour remplir la mémoire
   - [x] pour compenser un capteur et un objectif minuscules
   - [ ] pour éviter d'utiliser un processeur
   - [ ] pour transmettre plus lentement

   > Le calcul améliore l'image.

1. Quel risque présente une position GPS dans une photo partagée ?

   - [ ] la photo devient floue
   - [x] elle peut révéler un lieu privé
   - [ ] elle change de couleur
   - [ ] aucun

   > Il vaut mieux la retirer avant de partager.
::::

::::exercice[Lire des EXIF]{niveau=2 type=reponses}
Voici un extrait de métadonnées.

| Champ | Valeur |
| --- | --- |
| Appareil | Exemple X10 |
| Date | 2026-06-14 18:32 |
| Exposition | 1/250 s |
| GPS | 45.1885, 5.7245 |
| Auteur | Lina |

1. Quel est le modèle de l'appareil ?

   - Exemple X10

1. Quelle est l'année de la prise de vue ?

   - 2026

1. Qui est indiqué comme auteur ?

   - Lina

1. Quel champ permet de savoir où la photo a été prise ?

   - GPS
::::

::::exercice[Publier une photo]{niveau=3}
Maël prend une photo de nuit dans sa chambre avec son téléphone. L'application annonce « Mode nuit : 3 secondes ». Il veut la publier sur un forum public.

1. Pourquoi le téléphone prend-il plusieurs images pendant ces 3 secondes ? Que fait-il ensuite ?
2. Cite, dans l'ordre, trois étapes qui mènent à l'image finale.
3. Quelle métadonnée peut poser problème sur un forum public ? Que doit-il faire ?
4. Une fois la photo publiée, pourra-t-il être sûr de la faire disparaître ? Justifie.

:::criteres
- Plusieurs images combinées pour réduire le bruit et capter plus de lumière.
- Prise de vue, développement, compression.
- La position GPS ; la retirer avant de publier.
- Non : la photo peut avoir été copiée.
:::

:::corrige
1. De nuit, chaque image capte peu de lumière et contient du bruit. Le téléphone en prend plusieurs, puis les **fusionne** pour obtenir une image plus nette et plus lumineuse.
2. Prise de vue (exposition, mise au point), développement (lumière, netteté), puis compression en JPEG.
3. La **position GPS**, qui pourrait indiquer son domicile. Il doit retirer cette métadonnée avant de publier.
4. Non. Une image se copie immédiatement : d'autres personnes peuvent l'avoir enregistrée. C'est la question du droit à l'oubli.
:::
::::
