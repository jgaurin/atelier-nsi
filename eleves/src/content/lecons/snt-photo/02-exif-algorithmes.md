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

Une photo contient bien plus que ce que l'on voit. Et l'image que tu regardes n'est pas ce qu'a capté le capteur : des algorithmes l'ont calculée.

## 1. Les métadonnées EXIF

Quand tu prends une photo, l'appareil enregistre dans le fichier, en plus des pixels, des informations sur la prise de vue. Ce sont des **métadonnées**, au format **EXIF** :

| Métadonnée | Exemple |
| --- | --- |
| modèle de l'appareil | Exemple X10 |
| date et heure | 14 juin 2026, 18 h 32 |
| réglages | temps de pose 1/250 s, ouverture f/2 |
| position GPS | 45,1885 ; 5,7245 |
| auteur | Lina |

On les lit dans les **propriétés** du fichier, ou avec un logiciel de photo.

:::attention
Si la position GPS est enregistrée, une photo prise chez toi et publiée en ligne peut révéler ton adresse. Avant de publier, on peut supprimer ces métadonnées, ou désactiver la localisation de l'appareil photo.
:::

## 2. Comment l'image est fabriquée

Entre l'appui sur le bouton et l'image finale, l'appareil enchaîne trois grandes étapes, chacune faite d'algorithmes.

| Étape | Ce que font les algorithmes |
| --- | --- |
| **Prise de vue** | calculer l'exposition (ni trop sombre, ni trop claire), faire la mise au point, stabiliser contre les tremblements |
| **Développement** | transformer les mesures brutes du capteur en image : régler la lumière et le contraste, corriger les couleurs (balance des blancs), renforcer la netteté, corriger les déformations de l'objectif |
| **Enregistrement** | compresser le fichier, par exemple en JPEG |

## 3. La fusion d'images

Le capteur d'un téléphone est minuscule : il capte peu de lumière. Pour compenser, le téléphone prend souvent **plusieurs images** en une fraction de seconde, puis les **combine** :

- **réduction du bruit** : en moyennant plusieurs images, les petits points parasites disparaissent ;
- **HDR** : une image sombre garde les détails du ciel, une image claire ceux des zones d'ombre, et on combine les deux ;
- **panorama** : plusieurs photos sont assemblées en une seule image large ;
- **mise au point étendue** : plusieurs images nettes à différentes distances sont combinées pour que tout soit net.

C'est ce que fait le « mode nuit » : il prend des images pendant quelques secondes et les fusionne.

## 4. Les enjeux

Une photo numérique se copie gratuitement et se diffuse en un instant. Cela pose de nouvelles questions : une image publiée peut ne jamais disparaître, elle peut être truquée de façon presque invisible, ou permettre de suivre une personne grâce à ses métadonnées.

## L'essentiel

- Les métadonnées EXIF décrivent la prise de vue : appareil, date, réglages, parfois position GPS.
- Prise de vue, développement, enregistrement : chaque étape repose sur des algorithmes.
- Un téléphone combine souvent plusieurs images pour compenser son petit capteur.

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
