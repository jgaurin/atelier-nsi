---
titre: "SNT : données structurées, localisation et cartographie"
resume: Deux thèmes de SNT pour l'enseignant — données et métadonnées, tables, données ouvertes, informatique en nuage ; géolocalisation par satellites, trames NMEA, coordonnées, distances, cartes et calcul d'itinéraires — avec activités et enjeux.
duree: 60
objectifs:
  - Maîtriser les notions des thèmes « données structurées » et « localisation, cartographie et mobilité » de SNT
  - Exploiter une table de données (filtrer, trier, agréger) et distinguer données et métadonnées
  - Expliquer le principe de la géolocalisation par satellites et décoder une trame NMEA
  - Calculer une distance entre deux points du globe et relier calcul d'itinéraire et graphes
prerequis: [python/listes, web/xml-json, maths/graphes]
programme: [snt-donnees, snt-localisation, nsi1-tables]
cartes:
  - q: Données ou métadonnées ?
    r: "Les **données** sont l'information elle-même (les pixels d'une photo, les lignes d'une table) ; les **métadonnées** décrivent ces données (date et lieu de la photo, auteur d'un fichier, nom et type des colonnes)."
  - q: Qu'est-ce que l'open data ?
    r: "Des données publiées librement, dans un format ouvert et réutilisable (data.gouv.fr) : horaires de transports, qualité de l'air, budgets publics…"
  - q: Principe de la géolocalisation par satellites (GPS, Galileo) ?
    r: "Le récepteur mesure le temps de trajet des signaux d'au moins 4 satellites (positions connues, horloges atomiques) : il en déduit sa distance à chacun, puis sa position par **trilatération** (le 4e satellite corrige l'horloge du récepteur)."
  - q: Qu'est-ce qu'une trame NMEA GGA ?
    r: "Une ligne de texte envoyée par un récepteur GPS : `$GPGGA,heure,latitude,N/S,longitude,E/W,qualité,nb satellites,…` ; la latitude est au format degrés-minutes `ddmm.mmmm`."
  - q: Comment convertir 4807.038 N en degrés décimaux ?
    r: "48° + 07,038′ = 48 + 7,038/60 ≈ 48,1173° (positif au nord, négatif au sud ; pour la longitude, positif à l'est, négatif à l'ouest)."
  - q: Quel algorithme calcule un itinéraire ?
    r: "Le réseau routier est un **graphe pondéré** (carrefours, tronçons avec distances ou durées) ; on cherche un plus court chemin, par exemple avec l'algorithme de **Dijkstra** (ou A*)."
---

Deux thèmes de SNT parlent de **données** : le thème « Les données structurées et leur traitement », qui pose le vocabulaire (données, métadonnées, tables,
formats, données ouvertes, nuage), et le thème « Localisation, cartographie et mobilité », où les données sont des **positions** sur la Terre. Ils se prêtent
à des activités très concrètes, à partir de fichiers réels et du téléphone des élèves.

## 1. Les données structurées

:::definition
- Une **donnée** est une valeur décrivant un objet, une personne, un événement ; des données **structurées** sont organisées selon des **descripteurs**
  communs (les colonnes d'une table : nom, date de naissance, ville…).
- Les **métadonnées** sont des données **sur** les données : date de création d'un fichier, appareil et coordonnées GPS d'une photo (EXIF), nom et type des
  colonnes, licence d'un jeu de données.
- Une **collection** de données structurées se stocke souvent dans un fichier **CSV** (une ligne par objet, des valeurs séparées par des virgules ou des
  points-virgules), ou en JSON, ou dans une base de données.
:::

```python exec
import csv, io

texte = """ville;departement;population;altitude
Lyon;69;522250;175
Grenoble;38;156389;212
Chamonix;74;8628;1035
Annecy;74;130721;448
Saint-Étienne;42;171924;516"""
lignes = list(csv.DictReader(io.StringIO(texte), delimiter=";"))
haut = sorted((l for l in lignes if int(l["altitude"]) > 400), key=lambda l: -int(l["altitude"]))
print([l["ville"] for l in haut])
print("population totale de la Haute-Savoie :", sum(int(l["population"]) for l in lignes if l["departement"] == "74"))
```

Le thème aborde aussi les **données ouvertes** (*open data* : data.gouv.fr, données des collectivités), l'**informatique en nuage** (les données des élèves
sont stockées dans des centres de données, ailleurs), et les **enjeux** : protection des données personnelles (RGPD), consommation énergétique du stockage,
qualité et biais des données.

## 2. Se localiser : la géolocalisation par satellites

Un récepteur GPS (ou Galileo, le système européen) capte les signaux de satellites dont il connaît la position exacte. Chaque signal indique l'heure de son
émission (horloges atomiques à bord) : le récepteur en déduit le **temps de trajet**, donc la **distance** au satellite (vitesse de la lumière). Avec la
distance à plusieurs satellites, il calcule sa position par **trilatération** : il faut au moins **4** satellites (3 pour la position, 1 de plus pour corriger
l'horloge, imprécise, du récepteur).

:::attention[L'ordre de grandeur qui fait réfléchir]
La lumière parcourt 300 m en une microseconde : une erreur d'**un millionième de seconde** sur l'horloge donne une erreur de 300 m. D'où les horloges atomiques
et le quatrième satellite. La relativité (vitesse et gravité) décale aussi les horloges d'environ 38 microsecondes par jour, que le système corrige.
:::

Le récepteur transmet sa position au format **NMEA 0183** : des lignes de texte. La trame **GGA** contient l'heure, la latitude, la longitude, la qualité du
signal, le nombre de satellites et l'altitude :

```text
$GPGGA,123519,4807.038,N,01131.000,E,1,08,0.9,545.4,M,46.9,M,,*47
        heure  latitude   longitude  ↑ ↑   ↑   altitude
               ddmm.mmm   dddmm.mmm  qualité, satellites, précision
```

## 3. Coordonnées, distances et cartes

Une position est donnée par sa **latitude** (de −90° au sud à +90° au nord) et sa **longitude** (de −180° à +180°, positive à l'est de Greenwich). La distance
« à vol d'oiseau » entre deux points se calcule sur la sphère terrestre (rayon moyen 6 371 km) avec la **formule de haversine** :

```python exec
from math import radians, sin, cos, asin, sqrt

def distance_km(lat1, lon1, lat2, lon2):
    p1, p2 = radians(lat1), radians(lat2)
    dp, dl = radians(lat2 - lat1), radians(lon2 - lon1)
    h = sin(dp / 2) ** 2 + cos(p1) * cos(p2) * sin(dl / 2) ** 2
    return 2 * 6371 * asin(sqrt(h))

print(round(distance_km(48.8566, 2.3522, 45.7640, 4.8357)), "km entre Paris et Lyon")
print(round(distance_km(48.8566, 2.3522, 40.7128, -74.0060)), "km entre Paris et New York")
```

Une **carte numérique** superpose des couches (fond, routes, points d'intérêt) ; OpenStreetMap est une carte **libre** construite par des contributeurs.
Pour le **calcul d'itinéraire**, le réseau routier est un **graphe pondéré** (sommets : carrefours ; arêtes : tronçons, pondérés par la distance ou la durée) et
l'on cherche un **plus court chemin** (algorithme de Dijkstra, ou A* qui l'accélère).

:::prof
Activités classiques : décoder des trames NMEA réelles (enregistrées avec une application de téléphone), placer les points sur une carte (Géoportail,
OpenStreetMap), calculer des distances ; traiter un fichier CSV de données ouvertes (tri, filtre, moyenne) en Python ou au tableur ; extraire les
métadonnées EXIF d'une photo pour découvrir… où elle a été prise (un excellent déclencheur sur la vie privée). Côté enjeux : traçage des déplacements,
autorisations des applications, géolocalisation des photos publiées.
:::

## Exemple guidé

**Problème.** Décoder une trame GGA en latitude et longitude décimales, pour ensuite placer le point sur une carte.

**1. Découper** la ligne selon les virgules : le champ 2 est la latitude `4807.038`, le champ 3 l'hémisphère `N`, le champ 4 la longitude `01131.000`, le
champ 5 `E`.

**2. Convertir degrés-minutes en degrés décimaux** : les **deux** premiers chiffres de la latitude (trois pour la longitude) sont des degrés, le reste des
minutes : $48 + \frac{7{,}038}{60}$.

**3. Signe** : négatif au sud et à l'ouest.

```python exec
def decoder_gga(trame):
    champs = trame.split(",")
    lat = int(champs[2][:2]) + float(champs[2][2:]) / 60
    lon = int(champs[4][:3]) + float(champs[4][3:]) / 60
    if champs[3] == "S":
        lat = -lat
    if champs[5] == "W":
        lon = -lon
    return round(lat, 5), round(lon, 5), int(champs[7])     # et le nombre de satellites

print(decoder_gga("$GPGGA,123519,4807.038,N,01131.000,E,1,08,0.9,545.4,M,46.9,M,,*47"))
print(decoder_gga("$GPGGA,091502,3352.128,S,15112.558,E,1,10,0.8,40.0,M,20.1,M,,*4F"))
```

Le premier point est près de Munich, le second à Sydney (latitude sud). Avec les élèves, on vérifie en plaçant les points sur une carte : c'est la meilleure
validation possible.

## L'essentiel

- Données structurées : descripteurs (colonnes), CSV, JSON ; **métadonnées** (EXIF, dates, auteurs) ; open data ; nuage ; enjeux (RGPD, énergie, biais).
- Géolocalisation : temps de trajet → distances → **trilatération**, au moins 4 satellites ; horloges atomiques ; GPS, Galileo.
- Trame **NMEA GGA** : latitude `ddmm.mmmm` + N/S, longitude `dddmm.mmmm` + E/W ; conversion $d + m/60$, signe au sud et à l'ouest.
- Distance sur la sphère : haversine (rayon 6 371 km) ; cartes en couches, OpenStreetMap.
- Itinéraire = plus court chemin dans un graphe pondéré (Dijkstra, A*).

## Exercices

::::exercice[Métadonnées]{niveau=1}
Parmi ces informations sur une photo publiée, laquelle est une **métadonnée** ?

- [ ] la couleur du ciel sur la photo
- [x] les coordonnées GPS du lieu de prise de vue enregistrées dans le fichier
- [ ] le visage de la personne photographiée
- [ ] le nombre de personnes sur la photo

:::corrige
Les coordonnées GPS sont stockées dans les données EXIF du fichier : elles décrivent la photo sans en faire partie. Les autres informations se lisent dans
l'image elle-même. Ces métadonnées révèlent souvent le domicile de la personne : d'où l'intérêt de les supprimer avant de publier.
:::
::::

::::exercice[Combien de satellites ?]{niveau=1}
Combien de satellites un récepteur GPS doit-il capter, au minimum, pour se localiser en trois dimensions ?

- [ ] 1
- [ ] 2
- [ ] 3
- [x] 4

:::corrige
Trois distances suffiraient avec une horloge parfaite ; mais l'horloge du récepteur est imprécise : son décalage est une quatrième inconnue, d'où un quatrième
satellite.
:::
::::

::::exercice[Convertir des coordonnées]{niveau=2}
Écris `vers_decimal(valeur, hemisphere)` qui convertit une coordonnée NMEA (`"4807.038"` pour une latitude, `"01131.000"` pour une longitude — on distingue
par le nombre de chiffres avant le point : 4 pour une latitude, 5 pour une longitude) en degrés décimaux arrondis à 5 décimales, négatifs pour `"S"` et `"W"`.

```python depart
def vers_decimal(valeur, hemisphere):
    ...
```

```python tests
assert vers_decimal("4807.038", "N") == 48.1173, "latitude nord"
assert vers_decimal("01131.000", "E") == 11.51667, "longitude est"
assert vers_decimal("3352.128", "S") == -33.8688, "latitude sud"
assert vers_decimal("00221.120", "W") == -2.352, "longitude ouest"
```

:::corrige
```python solution
def vers_decimal(valeur, hemisphere):
    nb_degres = valeur.index(".") - 2          # les 2 chiffres avant le point sont des minutes entières
    degres = int(valeur[:nb_degres])
    minutes = float(valeur[nb_degres:])
    resultat = degres + minutes / 60
    if hemisphere in ("S", "W"):
        resultat = -resultat
    return round(resultat, 5)
```
Les minutes occupent toujours les deux chiffres juste avant le point (et la partie décimale) ; ce qui précède, ce sont les degrés (2 chiffres pour une latitude,
3 pour une longitude). 07,038 minutes = 0,1173 degré.
:::
::::

::::exercice[La station la plus proche]{niveau=2}
Écris `plus_proche(position, stations)` qui renvoie le nom de la station la plus proche (distance de haversine) d'une position `(lat, lon)`, parmi une liste de
dictionnaires `{"nom": …, "lat": …, "lon": …}`.

```python depart
from math import radians, sin, cos, asin, sqrt

def distance_km(lat1, lon1, lat2, lon2):
    p1, p2 = radians(lat1), radians(lat2)
    dp, dl = radians(lat2 - lat1), radians(lon2 - lon1)
    h = sin(dp / 2) ** 2 + cos(p1) * cos(p2) * sin(dl / 2) ** 2
    return 2 * 6371 * asin(sqrt(h))

def plus_proche(position, stations):
    ...
```

```python tests
stations = [{"nom": "Gare", "lat": 45.7605, "lon": 4.8597}, {"nom": "Bellecour", "lat": 45.7578, "lon": 4.8320},
            {"nom": "Croix-Rousse", "lat": 45.7744, "lon": 4.8320}]
assert plus_proche((45.7590, 4.8340), stations) == "Bellecour", "proche de Bellecour"
assert plus_proche((45.7760, 4.8300), stations) == "Croix-Rousse", "proche de la Croix-Rousse"
assert plus_proche((45.7600, 4.8600), stations) == "Gare", "proche de la gare"
```

:::corrige
```python solution
from math import radians, sin, cos, asin, sqrt

def distance_km(lat1, lon1, lat2, lon2):
    p1, p2 = radians(lat1), radians(lat2)
    dp, dl = radians(lat2 - lat1), radians(lon2 - lon1)
    h = sin(dp / 2) ** 2 + cos(p1) * cos(p2) * sin(dl / 2) ** 2
    return 2 * 6371 * asin(sqrt(h))

def plus_proche(position, stations):
    lat, lon = position
    return min(stations, key=lambda s: distance_km(lat, lon, s["lat"], s["lon"]))["nom"]
```
`min` avec une clé calcule la distance de chaque station : c'est une recherche séquentielle du minimum, en $O(n)$. Pour des millions de points (toutes les
stations d'un pays), on utilise des structures spatiales (grilles, arbres) qui évitent de tout parcourir.
:::
::::

::::exercice[Analyser un trajet enregistré]{niveau=3}
Un élève a enregistré son trajet : une liste de trames GGA, une toutes les 10 secondes. Écris `bilan(trames)` qui renvoie le couple (distance totale en km, vitesse
moyenne en km/h), arrondis à 2 décimales, en ignorant les trames dont la qualité (champ 6) vaut `0` (pas de position valide). Les heures (champ 1, `hhmmss`)
permettent de calculer la durée entre la première et la dernière trame valides.

```python depart
from math import radians, sin, cos, asin, sqrt

def distance_km(lat1, lon1, lat2, lon2):
    p1, p2 = radians(lat1), radians(lat2)
    dp, dl = radians(lat2 - lat1), radians(lon2 - lon1)
    h = sin(dp / 2) ** 2 + cos(p1) * cos(p2) * sin(dl / 2) ** 2
    return 2 * 6371 * asin(sqrt(h))

def bilan(trames):
    ...
```

```python tests
trames = ["$GPGGA,080000,4545.000,N,00450.000,E,1,07,1.0,170.0,M,0,M,,*00",
          "$GPGGA,080010,4545.050,N,00450.000,E,1,07,1.0,170.0,M,0,M,,*00",
          "$GPGGA,080020,0000.000,N,00000.000,E,0,00,0.0,0.0,M,0,M,,*00",
          "$GPGGA,080030,4545.100,N,00450.000,E,1,07,1.0,170.0,M,0,M,,*00"]
d, v = bilan(trames)
assert abs(d - 0.19) < 0.01, "environ 185 m parcourus vers le nord"
assert abs(v - 22.24) < 0.2, "en 30 secondes, environ 22 km/h"
assert bilan(trames[:1]) == (0.0, 0.0), "une seule position : rien à mesurer"
```

:::corrige
```python solution
from math import radians, sin, cos, asin, sqrt

def distance_km(lat1, lon1, lat2, lon2):
    p1, p2 = radians(lat1), radians(lat2)
    dp, dl = radians(lat2 - lat1), radians(lon2 - lon1)
    h = sin(dp / 2) ** 2 + cos(p1) * cos(p2) * sin(dl / 2) ** 2
    return 2 * 6371 * asin(sqrt(h))

def bilan(trames):
    points = []
    for t in trames:
        c = t.split(",")
        if c[6] == "0":
            continue
        lat = int(c[2][:2]) + float(c[2][2:]) / 60
        lon = int(c[4][:3]) + float(c[4][3:]) / 60
        if c[3] == "S":
            lat = -lat
        if c[5] == "W":
            lon = -lon
        secondes = int(c[1][:2]) * 3600 + int(c[1][2:4]) * 60 + int(c[1][4:6])
        points.append((secondes, lat, lon))
    if len(points) < 2:
        return 0.0, 0.0
    distance = sum(distance_km(a[1], a[2], b[1], b[2]) for a, b in zip(points, points[1:]))
    duree_h = (points[-1][0] - points[0][0]) / 3600
    return round(distance, 2), round(distance / duree_h, 2)
```
On additionne les distances entre points **consécutifs** (le trajet réel est approché par une ligne brisée), après avoir écarté les positions invalides. 0,1 minute
de latitude vaut environ 185 m : en 30 s, cela fait 22 km/h, un trajet à vélo. Un relevé plus espacé sous-estime la distance des trajets sinueux.
:::
::::

::::exercice[Concevoir une activité « données »]{niveau=4 duree=20}
Vous voulez faire travailler le thème « données structurées » de SNT à partir d'un jeu de données ouvertes réel (par exemple la liste des stations de vélos en libre
service de votre ville, au format CSV).

1. Formulez trois questions de difficulté croissante que les élèves pourront résoudre (au tableur puis en Python).
2. Quelles notions du programme sont travaillées ? Quels pièges techniques anticipez-vous avec un fichier réel ?
3. Quelle question ouverte sur les enjeux posez-vous en fin de séance ?

:::criteres
- Questions progressives et réalistes (repérer descripteurs et métadonnées ; filtrer/trier/compter ; agréger ou croiser avec une position, carte).
- Notions : données, descripteurs, formats ouverts, métadonnées, traitement (tri, filtre, agrégation), open data, lien avec la localisation.
- Pièges réalistes : séparateur, encodage (UTF-8 / Latin-1), virgule décimale, valeurs manquantes, types (tout est texte en CSV), en-têtes, doublons.
- Question d'enjeux pertinente (qui produit et finance ces données, vie privée, réutilisation commerciale, mise à jour, fiabilité).
:::

:::corrige
1. (a) « Quels sont les descripteurs de ce fichier ? Trouvez ses métadonnées (producteur, date de mise à jour, licence) sur la page du jeu de données. »
   (b) « Combien y a-t-il de stations ? Lesquelles ont plus de 30 emplacements ? Triez-les par capacité. » (c) « Quelle est la station la plus proche du lycée ?
   Placez les dix plus grandes stations sur une carte et commentez leur répartition. »
2. Notions : données et **descripteurs**, **métadonnées**, **format ouvert** (CSV), traitement (filtre, tri, comptage, agrégation), **données ouvertes**, et lien
   avec la **localisation** (coordonnées, distance, carte). Pièges : séparateur `;` plutôt que `,`, **encodage** (accents mal affichés), **virgule décimale**
   française dans les coordonnées, cases **vides**, nombres lus comme du **texte** (tri « alphabétique » de capacités : 100 avant 20), lignes en double ou d'en-tête
   répétées. Les rencontrer fait partie de l'apprentissage : on les anticipe avec une fiche d'aide.
3. « Qui produit ces données, avec quel argent, et pourquoi sont-elles ouvertes ? Une entreprise peut-elle les utiliser pour gagner de l'argent ? Et si le
   fichier contenait les trajets individuels des utilisateurs, quels risques poserait sa publication ? » — ouverture sur la licence, les données personnelles
   (anonymisation, réidentification) et le RGPD.
:::
::::
