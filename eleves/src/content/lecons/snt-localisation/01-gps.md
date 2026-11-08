---
titre: GPS et trames NMEA
resume: "Comment un récepteur calcule sa position, et comment lire les coordonnées d'une trame NMEA."
duree: 35
objectifs:
  - "Décrire le principe de fonctionnement de la géolocalisation"
  - "Décoder une trame NMEA pour trouver des coordonnées géographiques"
  - "Régler le partage de sa position"
---

Le **GPS**, conçu par l'armée américaine, a lancé son premier satellite en 1978. **Galileo** est le système européen.

## 1. Le principe

Chaque satellite possède une **horloge atomique** et envoie régulièrement l'heure exacte. Le signal voyage à la vitesse de la lumière, environ 300 000 km/s.

Le récepteur compare l'heure d'envoi et l'heure d'arrivée :

**distance = vitesse × durée**

Avec les distances à plusieurs satellites, il calcule sa position : trois satellites la situent, et un **quatrième** corrige l'erreur d'horloge du récepteur.

:::attention
Le téléphone ne « parle » pas au satellite : il reçoit seulement ses signaux.
:::

En ville, le signal peut être gêné : le téléphone s'aide alors des bornes Wi-Fi proches.

## 2. Une trame NMEA

Le protocole **NMEA 0183** donne la position sous forme de texte, avec des champs séparés par des virgules.

`$GPGGA,123519,4807.038,N,01131.000,E,1,08,0.9,545.4,M,46.9,M,,*47`

| Champ | Valeur | Sens |
| --- | --- | --- |
| Type | `GPGGA` | position GPS |
| Heure | `123519` | 12 h 35 min 19 s |
| Latitude | `4807.038,N` | 48° 07,038′ Nord |
| Longitude | `01131.000,E` | 11° 31,000′ Est |
| Satellites | `08` | 8 satellites |
| Altitude | `545.4,M` | 545,4 mètres |

## 3. Convertir en degrés décimaux

Une minute vaut 1/60 de degré.

:::exemple
48° 07,038′ donne 48 + 7,038 / 60 = **48,1173°**.
:::

Une latitude Sud ou une longitude Ouest est comptée négativement.

## 4. Sa position, une donnée sensible

Le GPS peut être brouillé, et de nombreuses applications ont accès à la position. Dans les réglages du téléphone, on choisit quelles applications peuvent l'utiliser, et on peut consulter ou effacer son historique.

## L'essentiel

- Distance = vitesse × durée, avec au moins 4 satellites.
- Une trame NMEA donne l'heure, la latitude, la longitude, l'altitude.
- Degrés décimaux = degrés + minutes / 60.
- La position se règle dans les paramètres du téléphone.

## Exercices

::::exercice[QCM : GPS]{niveau=1 type=quiz}
Une question à la fois : la correction s'affiche aussitôt.

1. Que contient un satellite GPS pour mesurer le temps ?

   - [ ] un sablier
   - [x] une horloge atomique
   - [ ] un capteur de lumière
   - [ ] un routeur

   > Elle est extrêmement précise.

1. Combien faut-il de satellites, en général, pour calculer une position ?

   - [ ] 1
   - [ ] 2
   - [x] 4
   - [ ] 10

   > Le quatrième corrige l'horloge du récepteur.

1. Le téléphone envoie-t-il un signal au satellite GPS ?

   - [ ] oui, toujours
   - [x] non, il reçoit seulement
   - [ ] seulement en ville
   - [ ] seulement la nuit

   > Le GPS fonctionne dans un seul sens.

1. Quel est le système européen de géolocalisation ?

   - [ ] Mosaic
   - [x] Galileo
   - [ ] Météor
   - [ ] Unix

   > Il est complémentaire du GPS.
::::

::::exercice[Calculer une distance]{niveau=1 type=reponses}
Le signal voyage à 300 000 km/s.

1. Le signal met 0,07 seconde pour arriver. À combien de kilomètres se trouve le satellite ?

   ```python calcul
   print(round(300000 * 0.07))
   ```

   - 21000
   - 21 000

1. Le signal met 0,1 seconde pour arriver. À combien de kilomètres se trouve le satellite ?

   ```python calcul
   print(round(300000 * 0.1))
   ```

   - 30000
   - 30 000
::::

::::exercice[Lire une trame]{niveau=2 type=reponses}
`$GPGGA,094510,4521.600,N,00505.400,E,1,07,1.1,212.0,M,47.0,M,,*4A`

1. À quelle heure la mesure a-t-elle été faite ? Écris-la sous la forme `09:45:10`.

   - 09:45:10
   - 9:45:10

1. Combien de satellites sont utilisés ?

   - 7

1. Quelle est l'altitude, en mètres ?

   - 212

1. Quelle est la latitude en degrés décimaux, arrondie à quatre chiffres ?

   ```python calcul
   print(round(45 + 21.6 / 60, 4))
   ```

   - 45.36
   - 45,36

1. Quelle est la longitude en degrés décimaux, arrondie à quatre chiffres ?

   ```python calcul
   print(round(5 + 5.4 / 60, 4))
   ```

   - 5.09
   - 5,09
::::

::::exercice[Retrouver un randonneur]{niveau=3}
Un randonneur envoie cette trame : `$GPGGA,151200,4303.600,N,00002.400,W,1,05,1.4,1500.0,M,48.0,M,,*5C`.

1. Donne l'heure, l'altitude et le nombre de satellites.
2. Calcule sa latitude en degrés décimaux. Détaille le calcul.
3. Calcule sa longitude en degrés décimaux. Attention à son signe.
4. Il est au fond d'une gorge étroite et sa position est imprécise. Explique pourquoi.
5. Son application de course publie sa position à tous ses abonnés. Quel risque cela pose-t-il ? Quel réglage conseilles-tu ?

:::criteres
- 15 h 12 min 00 s, 1 500 m, 5 satellites.
- 43 + 3,6 / 60 = 43,06.
- Longitude Ouest : −(0 + 2,4 / 60) = −0,04.
- Peu de satellites visibles, signal gêné.
- Suivi de ses déplacements ; limiter le partage de la position.
:::

:::corrige
1. Il est **15 h 12 min 00 s**, l'altitude est de **1 500 m**, et **5** satellites sont utilisés.
2. 43 + 3,6 / 60 = **43,06°** Nord.
3. 0 + 2,4 / 60 = 0,04. Comme la longitude est à l'**Ouest**, on obtient **−0,04°**.
4. Les parois masquent une partie du ciel : peu de satellites sont visibles, et les signaux sont gênés.
5. Tout le monde peut connaître ses déplacements et ses habitudes. Il vaut mieux désactiver la position pour cette application, ou limiter le partage à quelques personnes.
:::
::::
