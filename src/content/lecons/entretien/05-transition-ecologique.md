---
titre: Transition écologique et numérique responsable
resume: Les enjeux de la transition écologique à l'école (éducation au développement durable, éco-délégués, établissement en démarche) et ceux du numérique en particulier (empreinte environnementale, fabrication des terminaux, sobriété), avec des activités pour SNT et NSI.
duree: 45
objectifs:
  - Connaître les dispositifs de l'éducation au développement durable dans les établissements
  - Expliquer l'empreinte environnementale du numérique et ses principales sources, sans caricature
  - Faire des calculs d'ordres de grandeur (énergie, données) et les interpréter
  - Proposer des activités et des pratiques de numérique responsable en SNT et NSI
prerequis: [entretien/presentation, reseaux/couches]
programme: [e-ecologie, snt-internet, snt-donnees]
cartes:
  - q: Qu'est-ce que l'EDD ?
    r: "L'**éducation au développement durable** : une éducation transversale, présente dans toutes les disciplines et dans la vie de l'établissement, pour comprendre les enjeux environnementaux, sociaux et économiques et agir de façon éclairée."
  - q: Qui sont les éco-délégués ?
    r: "Des élèves élus dans chaque classe de collège et de lycée, qui portent des projets en faveur de l'environnement et de la biodiversité dans l'établissement."
  - q: Quelle part de l'empreinte carbone de la France le numérique représentait-il selon l'étude ADEME-Arcep de 2022 ?
    r: "Environ 2,5 % (17,2 millions de tonnes équivalent CO₂ en 2020) ; la mise à jour de janvier 2025, qui intègre notamment les centres de données situés à l'étranger, revoit l'estimation à la hausse. Sans action, l'empreinte pourrait tripler entre 2020 et 2050."
  - q: D'où vient l'essentiel de l'impact environnemental du numérique ?
    r: "Des **terminaux** (téléphones, ordinateurs, écrans, objets connectés), et surtout de leur **fabrication** (extraction des métaux, énergie, eau), plus que de leur usage ; d'où l'enjeu majeur : allonger leur durée de vie."
  - q: Que prévoit la loi REEN de 2021 ?
    r: "La loi visant à réduire l'empreinte environnementale du numérique (15 novembre 2021) prévoit notamment la sensibilisation des élèves à l'impact environnemental du numérique et à la sobriété numérique."
  - q: Énergie consommée par un appareil ?
    r: "Énergie (kWh) = puissance (kW) × durée (h). Un ordinateur de 60 W allumé 6 h consomme 0,36 kWh."
---

Le texte de l'épreuve demande au candidat de « comprendre les enjeux de la transition écologique ». Pour un professeur d'informatique, la question a deux faces :
celle de **tout enseignant** (l'école forme des citoyens capables de comprendre et d'agir) et celle de la **discipline** (le numérique a lui-même une empreinte
environnementale croissante, et il faut en parler avec justesse, sans culpabiliser ni minimiser).

## 1. La transition écologique à l'école

- L'**éducation au développement durable** (EDD) est **transversale** : toutes les disciplines y contribuent (sciences, géographie, mais aussi SNT et NSI), ainsi que la
  vie de l'établissement.
- Des **éco-délégués** sont élus dans chaque classe de collège et de lycée ; ils portent des projets (tri, biodiversité, économies d'énergie, réemploi).
- Les établissements peuvent s'engager dans une **démarche globale de développement durable** (label E3D) qui relie enseignements, projets et gestion du bâtiment.
- La loi du 15 novembre 2021 visant à réduire l'empreinte environnementale du numérique (**loi REEN**) prévoit la sensibilisation des élèves à l'impact du numérique et
  à la **sobriété numérique**.

## 2. L'empreinte environnementale du numérique

:::retenir[Ce que disent les études]
- L'étude ADEME-Arcep publiée en 2022 évaluait l'empreinte carbone du numérique en France à **17,2 millions de tonnes équivalent CO₂** en 2020, soit environ **2,5 %**
  de l'empreinte nationale ; la **mise à jour de janvier 2025**, qui intègre notamment les centres de données situés à l'étranger utilisés pour des usages français, revoit
  cette estimation à la hausse. Sans action, l'empreinte pourrait **tripler** entre 2020 et 2050.
- L'essentiel de l'impact vient des **terminaux** (téléphones, ordinateurs, téléviseurs, objets connectés) et surtout de leur **fabrication** : extraction de métaux,
  énergie, eau, pollution. Les réseaux et les centres de données comptent aussi, de plus en plus avec l'essor de l'intelligence artificielle.
- Au-delà du carbone : épuisement des ressources minérales, consommation d'eau, déchets électroniques peu recyclés.
:::

:::attention[Éviter les idées fausses]
Supprimer ses vieux courriels a un effet négligeable comparé au fait de garder son téléphone deux ans de plus. Les gestes efficaces : **allonger la durée de vie** des
appareils (réparer, acheter reconditionné), en avoir **moins**, et modérer les usages les plus lourds (vidéo en haute définition sur réseau mobile, par exemple). Il
faut aussi rester nuancé : le numérique sert aussi la transition (modélisation du climat, réseaux électriques intelligents, télétravail).
:::

## 3. Calculer des ordres de grandeur

L'informatique permet de faire **raisonner sur des chiffres** : énergie = puissance × durée ; volume de données = débit × durée ; un calcul simple, des hypothèses
explicites, une conclusion prudente.

```python exec
# Énergie consommée par une salle informatique pendant une année scolaire
postes, puissance_w, heures_par_jour, jours = 30, 60, 7, 160
energie_kwh = postes * puissance_w / 1000 * heures_par_jour * jours
print(f"salle allumée en continu les jours de cours : {energie_kwh:.0f} kWh")
veille_w, heures_veille = 2, 17                   # postes en veille la nuit plutôt qu'éteints
print(f"veille nocturne : {postes * veille_w / 1000 * heures_veille * jours:.0f} kWh de plus")
# Données : une heure de vidéo selon la définition (débits approximatifs)
for qualite, mbits in [("basse définition", 1), ("HD", 5), ("4K", 15)]:
    print(f"1 h de vidéo {qualite} ≈ {mbits * 3600 / 8 / 1000:.1f} Go")
```

## 4. En classe : des activités

- **SNT** : dans les thèmes Internet et données, calculer les volumes transférés, comparer des formats d'image (compression), discuter le cycle de vie d'un téléphone
  (de la mine au recyclage) ; dans le thème objets connectés, interroger leur utilité et leur durée de vie.
- **NSI** : l'efficacité des algorithmes a aussi un coût **énergétique** (un algorithme quadratique au lieu de $n \log n$ sur des millions de données) ; projets de **mesure**
  (consommation d'un programme, poids d'une page web) ; compression de données.
- **Dans l'établissement** : avec les éco-délégués, un audit des postes informatiques (extinction, mise en veille, réemploi des anciens ordinateurs reconditionnés par des
  élèves, installation d'un système léger).

:::prof
Le jury attend un discours **informé et équilibré** : connaître quelques ordres de grandeur sourcés, savoir ce qui pèse vraiment, et proposer des actions **concrètes** à
l'échelle d'une classe ou d'un établissement — sans catastrophisme ni culpabilisation des élèves.
:::

## Exemple guidé

**Problème.** Les éco-délégués proposent de remplacer les 30 ordinateurs de la salle de NSI, âgés de 6 ans, par des neufs « plus économes ». Est-ce une bonne idée pour
l'environnement ?

**1. Les hypothèses** (à expliciter, ordres de grandeur) : la fabrication d'un ordinateur fixe et de son écran représente de l'ordre de la centaine à quelques centaines de kilogrammes équivalent CO₂ ; un
poste consomme de l'ordre de 50 à 60 W en fonctionnement, un poste récent peut-être 20 W de moins ; la salle sert environ 1 100 heures par an.

**2. Le calcul.** Économie d'usage : $30 \times 0{,}02 \text{ kW} \times 1\,100 \text{ h} = 660$ kWh par an. Avec une électricité française peu carbonée (de l'ordre de
quelques dizaines de grammes de CO₂ par kWh), cela représente quelques dizaines de kilogrammes de CO₂ par an — à comparer aux **tonnes** émises pour fabriquer 30
ordinateurs.

**3. La conclusion.** Remplacer des ordinateurs qui fonctionnent n'est **pas** bénéfique pour le climat en France : mieux vaut les **entretenir** (ajout de mémoire, disque
SSD, système léger), et réfléchir au réemploi le jour où ils seront remplacés. C'est un raisonnement qu'on peut faire mener aux élèves eux-mêmes, en insistant sur la
transparence des hypothèses.

## L'essentiel

- EDD transversale ; éco-délégués dans chaque classe de collège et de lycée ; démarche E3D ; loi REEN (2021) : sensibilisation à la sobriété numérique.
- Numérique : environ 2,5 % de l'empreinte carbone française selon l'étude ADEME-Arcep de 2022 (revue à la hausse en 2025), pouvant tripler d'ici 2050 ; l'essentiel vient de la **fabrication des terminaux**.
- Gestes efficaces : allonger la durée de vie, moins d'équipements, modérer les usages lourds ; éviter les idées fausses et le catastrophisme.
- En classe : ordres de grandeur calculés avec des hypothèses explicites (énergie = puissance × durée), activités en SNT et NSI, projets avec les éco-délégués.

## Exercices

::::exercice[Ce qui pèse le plus]{niveau=1}
Pour réduire l'impact environnemental de son usage du numérique, quel geste est le plus efficace ?

- [ ] Supprimer ses anciens courriels
- [x] Garder son téléphone plus longtemps (réparer plutôt que remplacer)
- [ ] Éteindre l'écran pendant les pauses de cinq minutes
- [ ] Utiliser un fond d'écran sombre

:::corrige
L'essentiel de l'impact vient de la **fabrication** des terminaux : allonger leur durée de vie est de loin le levier le plus efficace. Les autres gestes ont un effet
faible, voire négligeable.
:::
::::

::::exercice[Les éco-délégués]{niveau=1}
Où sont élus des éco-délégués ?

- [ ] Uniquement au conseil d'administration
- [x] Dans chaque classe de collège et de lycée
- [ ] Seulement dans les lycées labellisés E3D
- [ ] Ils sont nommés par le chef d'établissement parmi les professeurs

:::corrige
Des élèves éco-délégués sont élus dans chaque classe de collège et de lycée ; ils animent des projets de développement durable dans l'établissement.
:::
::::

::::exercice[Énergie d'une salle informatique]{niveau=2}
Écris `energie_kwh(postes, puissance_w, heures_par_jour, jours)` qui renvoie l'énergie consommée (kWh) par `postes` ordinateurs de puissance `puissance_w` (W), puis
`economie(puissance_avant, puissance_apres, postes, heures_par_jour, jours)` qui renvoie l'énergie économisée (kWh) en remplaçant les postes. Arrondis à 0,1 kWh.

```python depart
def energie_kwh(postes, puissance_w, heures_par_jour, jours):
    ...

def economie(puissance_avant, puissance_apres, postes, heures_par_jour, jours):
    ...
```

```python tests
assert energie_kwh(30, 60, 7, 160) == 2016.0, "salle de 30 postes"
assert energie_kwh(1, 1000, 1, 1) == 1.0, "1 kW pendant 1 h"
assert economie(60, 40, 30, 7, 160) == 672.0, "20 W de moins par poste"
assert economie(50, 50, 30, 7, 160) == 0.0, "même puissance"
```

:::corrige
```python solution
def energie_kwh(postes, puissance_w, heures_par_jour, jours):
    return round(postes * puissance_w / 1000 * heures_par_jour * jours, 1)

def economie(puissance_avant, puissance_apres, postes, heures_par_jour, jours):
    return round(energie_kwh(postes, puissance_avant - puissance_apres, heures_par_jour, jours), 1)
```
Énergie = puissance × durée, en convertissant les watts en kilowatts. L'économie se calcule sur la **différence** de puissance. Reste à la comparer à l'énergie et aux
émissions de la **fabrication** de nouveaux postes : c'est là que se joue la décision.
:::
::::

::::exercice[Des données à la vidéo]{niveau=3 duree=10}
Un élève affirme : « Regarder une série en streaming, ça ne pollue pas, c'est juste des données. » Comment l'amener à raisonner, avec un calcul et des nuances ?

:::criteres
- Calcul de volume : débit × durée (par exemple 5 Mbit/s pendant 1 h ≈ 2,25 Go), comparaison selon la définition et l'écran.
- Chaîne d'impact expliquée : centres de données, réseaux (plus coûteux en mobile qu'en fibre), terminal (fabrication et usage) ; l'essentiel de l'impact vient de l'équipement.
- Nuances : ordres de grandeur variables selon les études, électricité française peu carbonée, effet du nombre d'équipements et de leur renouvellement ; pas de culpabilisation, des leviers (définition adaptée, Wi-Fi plutôt que réseau mobile, garder ses appareils).
:::

:::corrige
Je lui propose de **calculer** : une heure de vidéo en HD à environ 5 Mbit/s représente $5 \times 3\,600 / 8 \approx 2\,250$ Mo, soit plus de 2 Go ; en 4K, trois fois plus.
Ces données sont **stockées** dans des centres de données, **transportées** par des réseaux (plus gourmands en mobile qu'en fibre ou en Wi-Fi) et **affichées** par un
terminal, dont la fabrication est la principale source d'impact. Nuances : les chiffres par heure de vidéo varient beaucoup selon les études et le pays (l'électricité
française est peu carbonée), et l'effet d'une heure de streaming est faible comparé à celui de changer de téléphone. Conclusion : « ce ne sont pas *juste* des données,
il y a une infrastructure matérielle derrière ; les leviers les plus utiles sont d'adapter la définition à l'écran, de préférer le Wi-Fi, et surtout de garder ses
appareils longtemps. »
:::
::::

::::exercice[Un projet avec les éco-délégués]{niveau=4 duree=20}
Les éco-délégués de ton lycée veulent mener un projet sur le numérique responsable. En tant que professeur de NSI, propose un projet d'une dizaine de séances associant
des élèves de NSI : objectifs, étapes, rôle de l'informatique, production finale, et lien avec les programmes.

:::criteres
- Objectifs clairs (mesurer, comprendre, agir) et réalistes à l'échelle du lycée.
- Étapes : diagnostic (inventaire du parc, âge, usages), mesures et calculs (énergie, données), propositions (extinction automatique, réemploi, reconditionnement, système léger, sensibilisation), réalisation, communication.
- Rôle de l'informatique : programmes de calcul et de visualisation, script d'extinction, base de données de l'inventaire, page web de restitution.
- Liens explicites avec les programmes (SNT : données, Internet, objets ; NSI : bases de données, systèmes, Web, projet) et avec l'EDD ; évaluation et valorisation.
:::

:::corrige
**Objectifs** : mesurer l'empreinte du parc informatique du lycée, comprendre ce qui pèse, et mettre en œuvre deux actions concrètes. **Étapes** : (1) inventaire des
ordinateurs (âge, état, usage) dans une **base de données** construite par les élèves de terminale ; (2) mesures de consommation avec un wattmètre et calcul de l'énergie
annuelle (programme Python, graphiques) ; (3) étude documentaire sur la fabrication et la fin de vie des équipements ; (4) propositions : extinction automatique des postes
le soir (script système), reconditionnement d'anciens ordinateurs avec un système léger pour une association ou pour des élèves, campagne de sensibilisation ;
(5) réalisation d'une **page web** de restitution ; (6) présentation au conseil de la vie lycéenne ou au conseil d'administration. **Liens** : NSI (bases de données,
systèmes d'exploitation et shell, Web, conduite de projet), SNT (données, objets connectés), EDD ; les éco-délégués portent la communication et les actions dans les
classes. **Valorisation** : le projet peut nourrir un sujet de Grand oral.
:::
::::
