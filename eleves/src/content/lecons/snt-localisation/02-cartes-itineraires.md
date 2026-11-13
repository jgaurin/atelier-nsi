---
titre: Cartes numériques et itinéraires
resume: "Les couches d'une carte numérique, la contribution à OpenStreetMap et le calcul d'un itinéraire sur un graphe."
duree: 30
objectifs:
  - "Identifier les couches d'information d'une carte numérique"
  - "Comprendre le principe collaboratif d'OpenStreetMap"
  - "Représenter un calcul d'itinéraire comme un problème de graphe"
prerequis: [snt-localisation/gps]
---

Une carte numérique fait bien plus qu'une carte papier : on y zoome, on y choisit ce qu'on veut voir, et on y calcule un itinéraire. Voyons comment.

## 1. Les couches d'information

Sur un site comme **Géoportail**, la carte est faite de **couches** superposées : photographies aériennes, routes, relief, cours d'eau, limites des communes… On affiche ou on masque chaque couche, selon ce qu'on cherche.

Quand on dézoome, la carte masque les petits détails, sinon elle deviendrait illisible : les noms des petites rues disparaissent. Une route garde à peu près la même largeur à l'écran, quelle que soit l'échelle, pour rester visible.

## 2. D'où viennent les données ?

Elles viennent des services géographiques des États, de photos prises par des satellites, des avions ou des voitures, et des utilisateurs eux-mêmes.

**OpenStreetMap** est une carte **collaborative**, libre et gratuite : n'importe qui peut y ajouter une rue, un commerce ou un chemin, et l'ajout devient visible par tous. C'est le même principe que Wikipédia, appliqué aux cartes.

Une carte n'est jamais parfaite : le monde change sans cesse, et une erreur, comme une route qui n'existe plus, peut avoir de graves conséquences.

## 3. Un itinéraire, c'est un graphe

Pour calculer un itinéraire, le logiciel représente le réseau routier par un **graphe** :

| Dans la réalité | Dans le graphe |
| --- | --- |
| un carrefour | un **sommet** |
| une route entre deux carrefours | une **arête** |
| la longueur ou la durée de cette route | le **poids** de l'arête |
| un trajet | un **chemin** |

Le meilleur itinéraire est le chemin dont la **somme des poids** est la plus petite.

:::exemple
Trois carrefours A, B et C. A–B mesure 4 km, B–C mesure 3 km, et la route directe A–C mesure 9 km.

| Chemin de A à C | Longueur |
| --- | --- |
| A, C | 9 km |
| A, B, C | 4 + 3 = 7 km |

Passer par B est plus court que la route directe : 7 km contre 9 km.
:::

Le logiciel compare ainsi les chemins possibles, avec des algorithmes qui évitent de les essayer tous.

## 4. Le plus court n'est pas le plus rapide

Si les poids sont des **durées** au lieu des distances, la réponse peut changer : une autoroute plus longue en kilomètres peut être plus rapide qu'une petite route. C'est pourquoi les applications proposent « le plus court » ou « le plus rapide ».

## L'essentiel

- Une carte numérique superpose des couches qu'on affiche ou masque.
- OpenStreetMap est une carte collaborative : chacun peut la compléter.
- Un réseau routier est un graphe : carrefours, routes, et des poids (distance ou durée).
- Le meilleur itinéraire minimise la somme des poids ; il dépend du poids choisi.

## Exercices

::::exercice[Sommet ou arête ?]{niveau=1 type=associer}
Dans la modélisation d'un réseau routier, associe chaque élément à sa représentation.

| Élément réel | Représentation |
| --- | --- |
| Un carrefour | sommet |
| Une route entre deux carrefours | arête |
| La durée pour parcourir une route | poids |
| Un trajet complet | chemin |
::::

::::exercice[QCM : cartes]{niveau=1 type=quiz}
Une question à la fois : la correction s'affiche aussitôt.

1. Qu'est-ce qu'une couche sur une carte numérique ?

   - [x] un type d'information qu'on peut afficher ou masquer
   - [ ] un satellite
   - [ ] une route barrée
   - [ ] une erreur de la carte

   > Par exemple, les routes ou le relief.

1. Quel est le principe d'OpenStreetMap ?

   - [ ] seuls les États peuvent la modifier
   - [x] les utilisateurs complètent une carte en libre accès
   - [ ] elle est réservée aux avions
   - [ ] elle n'affiche que des photos

   > C'est une carte collaborative.

1. Que représente le poids d'une arête ?

   - [ ] le nombre de voitures à l'arrêt
   - [x] une distance, une durée ou un coût
   - [ ] la masse d'un satellite
   - [ ] le nom de la route

   > On choisit selon ce qu'on veut minimiser.

1. Pourquoi masque-t-on des détails quand on dézoome ?

   - [ ] pour économiser les satellites
   - [x] pour garder la carte lisible
   - [ ] parce qu'ils n'existent plus
   - [ ] pour cacher des informations

   > Tout afficher serait illisible.
::::

::::exercice[Comparer des chemins]{niveau=2 type=completer}
Graphe, avec les distances en kilomètres : A–B : 5, A–C : 2, C–B : 1, B–D : 4, C–D : 7. Complète.

```python calcul
print(5 + 4)
print(2 + 1 + 4)
print(2 + 7)
print("A C B D")
```

| Chemin | Longueur |
| --- | --- |
| A, B, D | [[9]] |
| A, C, B, D | [[7]] |
| A, C, D | [[9]] |

Le plus court chemin de A à D, écrit avec des espaces, est [[A C B D]].
::::

::::exercice[Choisir un trajet]{niveau=3 type=reponses}
Un livreur va de E à H. Les tronçons sont donnés par leur distance en km, puis leur durée en minutes.

| Tronçon | Distance | Durée |
| --- | --- | --- |
| E–F | 10 | 8 |
| F–H | 10 | 30 |
| E–G | 15 | 10 |
| G–H | 12 | 9 |

1. Quelle est la longueur du trajet passant par F ?

   ```python calcul
   print(10 + 10)
   ```

   - 20

1. Quelle est la longueur du trajet passant par G ?

   ```python calcul
   print(15 + 12)
   ```

   - 27

1. Quel sommet est traversé par le trajet le plus court en distance ?

   - F

1. Quelle est, en minutes, la durée du trajet passant par F ?

   ```python calcul
   print(8 + 30)
   ```

   - 38

1. Quelle est, en minutes, la durée du trajet passant par G ?

   ```python calcul
   print(10 + 9)
   ```

   - 19

1. Quel sommet est traversé par le trajet le plus rapide ?

   - G

1. La route G–H est coupée. Quelle est maintenant, en minutes, la durée du meilleur trajet ?

   - 38
::::
