---
titre: "Localisation, cartographie et mobilité"
resume: "Le cours de SNT sur la localisation : latitude et longitude, principe du GPS (satellites, temps, trilatération), trames NMEA, cartes numériques en couches, calcul d'itinéraire sur un graphe, et confidentialité de la position."
duree: 40
objectifs:
  - "Repérer un lieu par sa latitude et sa longitude"
  - "Décrire le principe de la géolocalisation par satellites"
  - "Décoder une trame NMEA pour trouver des coordonnées géographiques"
  - "Représenter un calcul d'itinéraire comme un problème sur un graphe ; régler le partage de sa position"
prerequis: [snt-python/types]
programme: [snt-localisation]
cartes:
  - q: "Que repèrent la latitude et la longitude ?"
    r: "La **latitude** : la position nord-sud par rapport à l'équateur (de 0° à 90° N ou S). La **longitude** : la position est-ouest par rapport au méridien de Greenwich (de 0° à 180° E ou O)."
  - q: "Principe du GPS ?"
    r: "Des satellites émettent en permanence l'heure exacte (horloges atomiques) et leur position. Le récepteur mesure le temps de trajet des signaux, en déduit sa **distance** à chaque satellite et calcule sa position par **trilatération** (au moins 4 satellites)."
  - q: "Pourquoi faut-il au moins 4 satellites ?"
    r: "Trois distances suffiraient pour la position, mais l'horloge du récepteur n'est pas précise : un quatrième satellite permet de corriger l'erreur de temps."
  - q: "Qu'est-ce qu'une trame NMEA ?"
    r: "Une ligne de texte envoyée par un récepteur GPS, avec des champs séparés par des virgules (heure, latitude, longitude, nombre de satellites, altitude…). Exemple : `$GPGGA,…`."
  - q: "Comment un logiciel calcule-t-il un itinéraire ?"
    r: "Il représente les routes par un **graphe** (intersections = sommets, routes = arêtes pondérées par une distance ou une durée) et cherche le **plus court chemin**."
  - q: "Système européen de positionnement par satellites ?"
    r: "**Galileo**, opérationnel depuis 2016. Les autres : GPS (États-Unis), GLONASS (Russie), BeiDou (Chine)."
---

Les élèves utilisent la géolocalisation en permanence (cartes, livraisons, réseaux sociaux, jeux). Ce thème explique **comment** un téléphone sait où
il est, comment une **carte numérique** est construite, et comment une application **calcule un itinéraire**. Il mobilise des maths (coordonnées),
de la programmation (décoder une trame) et des graphes.

## Ce que dit le programme

Capacités attendues : **décrire le principe** de fonctionnement de la géolocalisation ; identifier les différentes **couches d'information** d'une
carte (Géoportail) pour extraire différents types de données ; contribuer à **OpenStreetMap** de façon collaborative ; **décoder une trame NMEA**
pour trouver des coordonnées géographiques ; utiliser un logiciel pour **calculer un itinéraire** ; **représenter un calcul d'itinéraire** comme un
problème sur un **graphe** ; régler les paramètres de **confidentialité** d'un téléphone pour partager ou non sa position.

Ce qui **n'est pas** attendu : le détail des calculs de trilatération, l'algorithme de Dijkstra (vu en terminale NSI, au mieux évoqué ici).

## 1. Se repérer : latitude et longitude

Un point de la Terre est repéré par deux angles :

- la **latitude** : de 0° (équateur) à 90° Nord (pôle Nord) ou 90° Sud ;
- la **longitude** : de 0° (méridien de **Greenwich**, à Londres) à 180° Est ou Ouest.

Le lycée Henri-IV, à Paris, est par exemple vers 48,85° N et 2,35° E. On écrit aussi les coordonnées en degrés et minutes : 48° 51′ N (une minute
d'angle = 1/60 de degré).

## 2. Le principe de la géolocalisation par satellites

Le **GPS** (américain) utilise une trentaine de satellites, à environ 20 000 km d'altitude. Chacun possède une **horloge atomique** très précise et
émet en permanence un signal contenant **l'heure d'émission** et **sa position**.

1. Le récepteur (ton téléphone) reçoit le signal et compare l'heure d'émission à l'heure de réception : il obtient le **temps de trajet**.
2. Le signal voyageant à la vitesse de la lumière (environ 300 000 km/s), il en déduit sa **distance** au satellite.
3. Avec les distances à plusieurs satellites, il calcule sa position : c'est la **trilatération** (chaque distance place le récepteur sur une sphère
   autour du satellite ; l'intersection donne la position).

Il faut **au moins 4 satellites** : 3 pour la position, et un de plus parce que l'horloge du téléphone n'est pas assez précise (une erreur d'un
millionième de seconde ferait 300 m d'erreur). La précision courante est de quelques mètres. D'autres systèmes existent : **Galileo** (Europe),
GLONASS (Russie), BeiDou (Chine) ; les téléphones les combinent. En ville, le téléphone s'aide aussi des antennes relais et du Wi-Fi.

## 3. Les trames NMEA

Un récepteur GPS transmet ses résultats sous forme de **trames NMEA** : des lignes de texte, champs séparés par des virgules. La plus utilisée est la
trame **GGA** :

```text
$GPGGA,123519,4807.038,N,01131.000,E,1,08,0.9,545.4,M,46.9,M,,*47
```

| Champ | Valeur | Signification |
|---|---|---|
| 1 | `123519` | heure : 12 h 35 min 19 s (UTC) |
| 2-3 | `4807.038,N` | latitude : 48° 07,038′ Nord |
| 4-5 | `01131.000,E` | longitude : 11° 31,000′ Est |
| 6 | `1` | qualité : position valide |
| 7 | `08` | nombre de satellites utilisés |
| 9 | `545.4` | altitude (en mètres) |

Pour passer en **degrés décimaux** : 48° 07,038′ = 48 + 7,038 / 60 ≈ **48,1173°**. C'est un très bon exercice de programmation en seconde :
découper la trame avec `split(",")`, puis convertir.

```python exec
trame = "$GPGGA,123519,4807.038,N,01131.000,E,1,08,0.9,545.4,M,46.9,M,,*47"
champs = trame.split(",")
lat = float(champs[2])          # 4807.038
degres = int(lat // 100)        # 48
minutes = lat - degres * 100    # 7.038
print(degres + minutes / 60)    # environ 48.1173
```

## 4. Les cartes numériques

Une carte numérique est faite de **couches** superposées : fond de carte, routes, bâtiments, relief, transports, limites administratives…
**Géoportail** (IGN) permet d'afficher ou masquer ces couches. **OpenStreetMap** est une carte **collaborative** et **libre**, construite par des
bénévoles, comme Wikipédia : chacun peut y contribuer (ajouter un banc, un passage piéton).

## 5. Calculer un itinéraire : un problème de graphe

Pour calculer un trajet, le logiciel représente le réseau routier par un **graphe** :

- les **sommets** sont les intersections (ou les villes) ;
- les **arêtes** sont les routes, avec un **poids** : distance, durée ou coût.

```mermaid legende="Un réseau routier vu comme un graphe pondéré (durées en minutes)"
flowchart LR
  A((Lycée)) ---|"5"| B((Gare))
  A ---|"12"| C((Centre))
  B ---|"4"| C
  B ---|"10"| D((Stade))
  C ---|"3"| D
```

Le meilleur itinéraire est le **plus court chemin** : la suite d'arêtes dont la somme des poids est minimale. De Lycée à Stade : Lycée → Gare →
Centre → Stade fait 5 + 4 + 3 = **12 min**, mieux que Lycée → Centre → Stade (15 min) ou Lycée → Gare → Stade (15 min). Les logiciels utilisent des
algorithmes efficaces (comme celui de **Dijkstra**) sur des graphes de millions de sommets, et tiennent compte du trafic en temps réel.

## 6. Confidentialité de la position

La position est une **donnée personnelle** très sensible (domicile, lycée, habitudes). Sur un téléphone, on peut choisir quelles applications y ont
accès (toujours, pendant l'utilisation, jamais), désactiver la localisation des photos, et ne pas partager sa position en direct.

## Les erreurs classiques des élèves

:::attention[Ce que tu verras en classe]
- **Croire que le téléphone envoie sa position au satellite** : c'est l'inverse, le téléphone **reçoit** seulement des signaux (le GPS fonctionne
  sans réseau).
- **Inverser latitude et longitude**, ou oublier N/S/E/O.
- **Lire 4807.038 comme 48,07038°** au lieu de 48° 07,038′.
- **Croire que le plus court chemin en kilomètres est toujours le plus rapide.**
:::

## En classe

:::methode[Activités qui marchent]
1. **Géoportail** : retrouver le lycée, afficher et masquer des couches, mesurer une distance.
2. **Trilatération sur papier** : trois cercles sur une carte avec des distances à trois villes, leur intersection donne le lieu.
3. **Python** : décoder une trame NMEA, convertir en degrés décimaux, placer le point sur une carte.
4. **Graphe** : chercher à la main le plus court chemin sur un petit graphe, puis comparer avec un calculateur d'itinéraire.
5. **Téléphone** : regarder (sans les montrer à la classe) les autorisations de localisation des applications.
:::

## L'essentiel

- **Latitude** (nord-sud, depuis l'équateur) et **longitude** (est-ouest, depuis Greenwich) repèrent un point.
- **GPS** : les satellites émettent l'heure et leur position ; le récepteur calcule ses distances (temps × vitesse de la lumière) puis sa position par
  **trilatération** ; au moins **4 satellites**.
- **Trame NMEA** (GGA) : texte avec heure, latitude, longitude, satellites, altitude ; 4807.038 = 48° 07,038′.
- **Cartes numériques** en couches (Géoportail), cartes collaboratives (OpenStreetMap).
- **Itinéraire** = **plus court chemin** dans un **graphe pondéré**.
- La position est une donnée personnelle : régler le partage.

## Exercices

::::exercice[Grand QCM : localisation et mobilité]{niveau=1 type=quiz}
Onze questions sur le thème localisation, cartographie et mobilité.

1. Que mesure la latitude ?

   - [x] la position nord-sud par rapport à l'équateur
   - [ ] la position est-ouest par rapport à Greenwich
   - [ ] l'altitude
   - [ ] la distance au satellite

   > De 0° à l'équateur à 90° aux pôles.

1. Dans le GPS, que fait le téléphone ?

   - [ ] il envoie sa position aux satellites
   - [x] il reçoit les signaux des satellites et calcule lui-même sa position
   - [ ] il demande sa position à une antenne
   - [ ] il mesure la vitesse des satellites

   > Le récepteur est passif : il ne fait qu'écouter.

1. Comment le récepteur connaît-il sa distance à un satellite ?

   - [ ] le satellite la lui envoie
   - [x] il mesure le temps de trajet du signal et le multiplie par la vitesse de la lumière
   - [ ] grâce à la puissance du signal
   - [ ] grâce au Wi-Fi

   > distance = vitesse × temps de trajet.

1. Combien de satellites faut-il au minimum pour se localiser ?

   - [ ] 1
   - [ ] 2
   - [ ] 3
   - [x] 4

   > Trois pour la position, un de plus pour corriger l'horloge imprécise du récepteur.

1. Comment s'appelle le système européen de positionnement par satellites ?

   - [ ] GPS
   - [x] Galileo
   - [ ] GLONASS
   - [ ] NMEA

   > GPS est américain, GLONASS russe, BeiDou chinois ; NMEA est un format de trames.

1. Dans la trame `$GPGGA,123519,4807.038,N,01131.000,E,…`, quelle est la latitude ?

   - [ ] 48,07038° N
   - [x] 48° 07,038′ N, soit environ 48,117° N
   - [ ] 12° 35′ N
   - [ ] 11° 31′ N

   > Le format est degrés puis minutes : 48 + 7,038 / 60.

1. Que représente le champ `123519` de cette trame ?

   - [ ] l'altitude
   - [x] l'heure : 12 h 35 min 19 s
   - [ ] le numéro du satellite
   - [ ] la vitesse

   > C'est l'heure UTC du calcul de position.

1. Qu'est-ce qu'OpenStreetMap ?

   - [ ] une carte payante de l'IGN
   - [x] une carte libre et collaborative, construite par des bénévoles
   - [ ] un GPS européen
   - [ ] un réseau social

   > Comme Wikipédia, chacun peut y contribuer.

1. Pour calculer un itinéraire, un logiciel représente les routes par…

   - [ ] un tableau de nombres aléatoires
   - [x] un graphe dont les arêtes ont des poids (distances ou durées)
   - [ ] une trame NMEA
   - [ ] une photo satellite

   > Le meilleur trajet est le plus court chemin dans ce graphe.

1. Sur le graphe du cours, quel est le trajet le plus rapide de Lycée à Stade ?

   - [ ] Lycée → Stade directement
   - [ ] Lycée → Centre → Stade (15 min)
   - [x] Lycée → Gare → Centre → Stade (12 min)
   - [ ] Lycée → Gare → Stade (15 min)

   > 5 + 4 + 3 = 12 : un trajet avec plus d'étapes peut être plus court.

1. Pourquoi la position est-elle une donnée sensible ?

   - [ ] parce qu'elle est longue à calculer
   - [x] parce qu'elle révèle le domicile, les habitudes et les déplacements d'une personne
   - [ ] parce qu'elle est fausse
   - [ ] elle ne l'est pas

   > C'est une donnée personnelle : on choisit quelles applications y ont accès.
::::

::::exercice[Convertir en degrés décimaux]{niveau=1}
Dans une trame NMEA, une latitude est donnée sous la forme `ddmm.mmmm` (par exemple `4807.038` pour 48° 07,038′). Écris `en_degres(valeur)` qui
reçoit le nombre `valeur` et renvoie les degrés décimaux, arrondis à 4 chiffres après la virgule avec `round(…, 4)`.

```python depart
def en_degres(valeur):
    ...
```

```python tests
assert en_degres(4807.038) == 48.1173, "48 + 7.038 / 60"
assert en_degres(4500.0) == 45.0, "45° 00′"
assert en_degres(1131.0) == 11.5167, "11 + 31 / 60 (une longitude)"
```

:::indice
Les degrés sont la partie entière de `valeur / 100` ; les minutes sont ce qui reste : `valeur - degres * 100`.
:::

:::corrige
```python solution
def en_degres(valeur):
    degres = int(valeur // 100)
    minutes = valeur - degres * 100
    return round(degres + minutes / 60, 4)
```
:::
::::

::::exercice[Lire une trame GGA]{niveau=2}
Écris `infos(trame)` qui renvoie un couple `(latitude, nb_satellites)` à partir d'une trame GGA : la latitude en degrés décimaux arrondie à 4
chiffres (positive au nord, **négative au sud**), et le nombre de satellites (champ d'indice 7) en entier. Tu peux réutiliser la conversion de
l'exercice précédent.

```python depart
def infos(trame):
    champs = trame.split(",")
    ...
```

```python tests
assert infos("$GPGGA,123519,4807.038,N,01131.000,E,1,08,0.9,545.4,M,46.9,M,,*47") == (48.1173, 8), "trame d'exemple"
assert infos("$GPGGA,081200,3352.000,S,15112.000,E,1,10,0.8,20.0,M,0.0,M,,*00") == (-33.8667, 10), "Sydney : hémisphère sud"
```

:::corrige
```python solution
def infos(trame):
    champs = trame.split(",")
    valeur = float(champs[2])
    degres = int(valeur // 100)
    lat = round(degres + (valeur - degres * 100) / 60, 4)
    if champs[3] == "S":
        lat = -lat
    return (lat, int(champs[7]))
```

`int("08")` donne bien 8. Le signe négatif pour le sud est la convention utilisée par les cartes numériques.
:::
::::

::::exercice[Durée d'un trajet]{niveau=2}
Un graphe pondéré est représenté par un dictionnaire : `duree[(a, b)]` donne la durée en minutes de la route entre `a` et `b`, dans ce sens. Écris
`duree_trajet(duree, chemin)` qui renvoie la durée totale d'un chemin donné par la liste de ses étapes.

```python depart
duree = {
    ("Lycée", "Gare"): 5, ("Lycée", "Centre"): 12, ("Gare", "Centre"): 4,
    ("Gare", "Stade"): 10, ("Centre", "Stade"): 3,
}

def duree_trajet(duree, chemin):
    ...
```

```python tests
assert duree_trajet(duree, ["Lycée", "Gare", "Centre", "Stade"]) == 12, "5 + 4 + 3"
assert duree_trajet(duree, ["Lycée", "Centre", "Stade"]) == 15, "12 + 3"
assert duree_trajet(duree, ["Lycée"]) == 0, "aucun déplacement"
```

:::corrige
```python solution
duree = {
    ("Lycée", "Gare"): 5, ("Lycée", "Centre"): 12, ("Gare", "Centre"): 4,
    ("Gare", "Stade"): 10, ("Centre", "Stade"): 3,
}

def duree_trajet(duree, chemin):
    total = 0
    for i in range(len(chemin) - 1):
        total = total + duree[(chemin[i], chemin[i + 1])]
    return total
```

On additionne le poids de chaque arête parcourue : étape `i` vers étape `i + 1`. Comparer plusieurs chemins avec cette fonction, c'est déjà
chercher le plus court chemin « à la main ».
:::
::::
