---
titre: GPS et trames NMEA
resume: "Comment un récepteur calcule sa position, et comment lire les coordonnées d'une trame NMEA."
duree: 35
objectifs:
  - "Décrire le principe de fonctionnement de la géolocalisation"
  - "Décoder une trame NMEA pour trouver des coordonnées géographiques"
  - "Régler le partage de sa position"
---

Ton téléphone sait où tu es, à quelques mètres près, n'importe où sur Terre. Il n'envoie pourtant rien aux satellites : il se contente d'**écouter**.

:::histoire
Le **GPS** a été conçu par l'armée américaine. Son premier satellite est lancé en 1978. Il en existe aujourd'hui une trentaine. **Galileo** est le système européen, plus précis.
:::

## 1. Calculer une distance avec l'heure

Chaque satellite contient une **horloge atomique**, extrêmement précise. Il envoie sans arrêt un message qui dit : « je suis tel satellite, et il est exactement telle heure ».

Ce message voyage à la vitesse de la lumière, environ 300 000 km par seconde. Le récepteur compare l'heure d'envoi et l'heure d'arrivée, et en déduit la distance :

**distance = vitesse × durée du trajet**

:::exemple
Le message met 0,07 seconde à arriver : le satellite est à 300 000 × 0,07 = **21 000 km**.
:::

## 2. Trouver sa position

Connaître la distance à **un** satellite ne suffit pas : tu pourrais être n'importe où sur une sphère autour de lui. Avec la distance à **trois** satellites, les possibilités se réduisent à un seul point. Un **quatrième** satellite est nécessaire pour corriger l'horloge du téléphone, bien moins précise que celles des satellites.

C'est pourquoi un récepteur a besoin d'**au moins quatre satellites** visibles. En ville, les immeubles masquent une partie du ciel : le téléphone s'aide alors des bornes Wi-Fi proches, dont la position est connue.

## 3. Lire une trame NMEA

Un récepteur GPS donne la position sous forme de texte, selon le protocole **NMEA 0183**. Chaque ligne, appelée **trame**, contient des champs séparés par des virgules.

`$GPGGA,123519,4807.038,N,01131.000,E,1,08,0.9,545.4,M,46.9,M,,*47`

| Champ | Valeur | Sens |
| --- | --- | --- |
| Type | `GPGGA` | une position GPS |
| Heure | `123519` | 12 h 35 min 19 s |
| Latitude | `4807.038,N` | 48° 07,038′ Nord |
| Longitude | `01131.000,E` | 11° 31,000′ Est |
| Satellites | `08` | 8 satellites utilisés |
| Altitude | `545.4,M` | 545,4 mètres |

Dans la latitude `4807.038`, les deux premiers chiffres sont les **degrés** (48), et le reste les **minutes** (07,038). Pour la longitude, les degrés ont trois chiffres : `011`.

## 4. Convertir en degrés décimaux

Les cartes numériques utilisent des degrés décimaux. Une minute vaut 1/60 de degré :

**degrés décimaux = degrés + minutes ÷ 60**

:::exemple
48° 07,038′ donne 48 + 7,038 ÷ 60 = 48 + 0,1173 = **48,1173°**.
:::

Une latitude **Sud** ou une longitude **Ouest** est comptée **négativement**.

## 5. Ta position, une donnée sensible

De nombreuses applications ont accès à ta position : elles peuvent t'envoyer des publicités ciblées, retracer tes trajets, ou permettre à quelqu'un de te localiser. Le GPS peut aussi être brouillé. Dans les réglages du téléphone, tu choisis quelles applications peuvent utiliser ta position, et tu peux consulter ou effacer ton historique de localisation.

## L'essentiel

- Distance = vitesse × durée ; il faut au moins 4 satellites : 3 pour la position, 1 pour corriger l'horloge.
- Une trame NMEA donne l'heure, la latitude, la longitude, le nombre de satellites et l'altitude.
- Degrés décimaux = degrés + minutes ÷ 60 ; Sud et Ouest sont négatifs.
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
