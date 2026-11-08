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

Une carte numérique rassemble toutes les échelles et plusieurs types d'informations.

## 1. Les couches

Sur **Géoportail**, on superpose des **couches** : photographies aériennes, routes, relief, limites administratives. On choisit ce qu'on veut voir.

Quand on change d'échelle, certaines informations disparaissent, sinon la carte serait illisible. Une route garde à peu près la même largeur à l'écran, quelle que soit l'échelle.

## 2. D'où viennent les données ?

Services géographiques des États, satellites, avions, voitures, utilisateurs. **OpenStreetMap** est une carte collaborative en libre accès : chacun peut la compléter, et ses ajouts deviennent visibles par tous.

Une carte n'est jamais parfaite : une erreur peut avoir de graves conséquences, et la mise à jour demande beaucoup de travail.

## 3. Calculer un itinéraire

On représente le réseau par un **graphe** :

- les **sommets** sont les carrefours ;
- les **arêtes** sont les routes ;
- chaque arête a un **poids** : distance, durée ou coût.

Un itinéraire est un **chemin**. Le meilleur est celui dont la somme des poids est la plus petite.

:::exemple
A–B : 4 km, B–C : 3 km, A–C : 9 km. De A à C, le chemin A, B, C mesure 7 km, et il bat la route directe de 9 km.
:::

Changer de poids change la réponse : le plus court n'est pas forcément le plus rapide.

## L'essentiel

- Une carte numérique superpose des couches.
- OpenStreetMap est collaboratif.
- Un réseau routier est un graphe pondéré.
- Le meilleur itinéraire minimise la somme des poids.

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
