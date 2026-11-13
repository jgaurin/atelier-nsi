---
titre: "Le routage : RIP et OSPF"
resume: "Trouver la route empruntée par un paquet, selon le nombre de sauts ou selon le coût."
duree: 40
objectifs:
  - "Lire une table de routage"
  - "Identifier la route empruntée selon le protocole RIP ou OSPF"
---

Sur Internet, un paquet traverse en général une dizaine de **routeurs** avant d'arriver. À chaque étape, le routeur doit décider à qui le transmettre. Il s'aide de sa **table de routage**.

## 1. La table de routage

| Destination | Passerelle | Métrique |
| --- | --- | --- |
| Réseau N5 | R3 | 2 |
| Réseau N7 | R2 | 4 |

La première ligne se lit : « pour atteindre le réseau N5, envoie le paquet à R3 ; la route coûte 2 ». La **passerelle** est le routeur voisin à qui l'on transmet, et la **métrique** mesure la qualité de la route.

Chaque routeur ne connaît que le **prochain** routeur, pas tout le trajet. Pour retrouver la route complète d'un paquet, on lit la table du premier routeur, puis celle du suivant, et ainsi de suite.

Comment les routeurs remplissent-ils ces tables ? Grâce à un **protocole de routage**. Le programme en étudie deux.

## 2. RIP : le moins de sauts

**RIP** compte le nombre de **sauts**, c'est-à-dire le nombre de routeurs à traverser. Il choisit la route qui en compte le moins.

Chaque routeur envoie régulièrement sa table à ses **voisins**. Un routeur apprend ainsi les routes de proche en proche :

:::exemple
R2 annonce à R1 : « je suis à 1 saut du réseau N5 ». R1 en déduit qu'il est lui-même à 2 sauts de N5 en passant par R2. Si un autre voisin annonce mieux, R1 garde la meilleure route.
:::

Une distance de **16** signifie « inaccessible ». RIP est simple, mais il ignore la vitesse des liaisons.

## 3. OSPF : le coût le plus faible

**OSPF** tient compte du **débit** des liaisons. Chaque liaison reçoit un **coût**, d'autant plus faible qu'elle est rapide :

**coût = 10⁸ / débit**, avec le débit en bit/s.

| Débit | Calcul | Coût |
| --- | --- | --- |
| 100 Mbit/s | 10⁸ / 10⁸ | 1 |
| 10 Mbit/s | 10⁸ / 10⁷ | 10 |
| 1 Mbit/s | 10⁸ / 10⁶ | 100 |

Le coût d'une route est la **somme** des coûts de ses liaisons. OSPF choisit la route de coût total minimal.

Contrairement à RIP, chaque routeur OSPF connaît **toute la carte** du réseau. Cette carte est un **graphe pondéré** : les routeurs sont les sommets, les liaisons les arêtes, et les coûts leurs poids. Le routeur y calcule le plus court chemin avec l'**algorithme de Dijkstra**.

## 4. Comparer sur un exemple

Pour aller de R1 à R4, il existe deux routes.

| Route | Liaisons | Sauts (RIP) | Coût (OSPF) |
| --- | --- | --- | --- |
| R1, R2, R4 | deux liaisons à 10 Mbit/s | 2 | 10 + 10 = 20 |
| R1, R3, R5, R4 | trois liaisons à 100 Mbit/s | 3 | 1 + 1 + 1 = 3 |

RIP choisit la première route, plus courte en nombre de routeurs. OSPF choisit la seconde, plus longue mais bien plus rapide.

## L'essentiel

- La table de routage donne, pour chaque destination, le prochain routeur et une métrique.
- RIP : le moins de sauts ; les routeurs échangent leurs tables avec leurs voisins ; 16 signifie inaccessible.
- OSPF : coût = 10⁸ / débit ; le coût d'une route est la somme de ses coûts ; carte complète et algorithme de Dijkstra.

## Exercices

::::exercice[QCM : routage]{niveau=1 type=quiz}
Une question à la fois : la correction s'affiche aussitôt.

1. Que connaît un routeur pour une destination donnée ?

   - [ ] le chemin complet
   - [x] le prochain routeur (passerelle) et une métrique
   - [ ] uniquement l'adresse de destination
   - [ ] l'adresse MAC du destinataire final

   > Le paquet avance de proche en proche.

1. Quelle est la métrique de RIP ?

   - [x] le nombre de sauts
   - [ ] le débit
   - [ ] le délai en millisecondes
   - [ ] le coût financier

   > Une limite de 15 sauts en découle.

1. Quelle est la métrique d'OSPF ?

   - [ ] le nombre de sauts
   - [x] un coût qui dépend du débit des liaisons
   - [ ] l'adresse IP
   - [ ] le nombre de voisins

   > Coût = 10⁸ / débit.

1. Quel est le coût OSPF d'une liaison à 10 Mbit/s (référence 10⁸) ?

   - [ ] 1
   - [x] 10
   - [ ] 100
   - [ ] 0,1

   > 10⁸ / 10⁷ = 10.

1. Avec RIP, à quoi correspond une distance de 16 ?

   - [ ] 16 routeurs
   - [x] une destination inaccessible
   - [ ] un débit de 16 Mbit/s
   - [ ] une erreur de configuration

   > C'est « l'infini » de RIP.
::::

::::exercice[Calculer des coûts]{niveau=1 type=reponses}
On prend coût = 10⁸ / débit en bit/s.

1. Quel est le coût d'une liaison à 100 Mbit/s ?

   ```python calcul
   print(10**8 // (100 * 10**6))
   ```

   - 1

1. Quel est le coût d'une liaison à 1 Mbit/s ?

   ```python calcul
   print(10**8 // 10**6)
   ```

   - 100

1. Quel est le coût total d'un chemin de deux liaisons à 10 Mbit/s et d'une liaison à 100 Mbit/s ?

   ```python calcul
   print(10 + 10 + 1)
   ```

   - 21
::::

::::exercice[Quelle route ?]{niveau=2 type=completer}
On considère les routes possibles de A vers D.

| Route | Liaisons |
| --- | --- |
| A → B → D | A–B : 10 Mbit/s ; B–D : 10 Mbit/s |
| A → C → E → D | A–C, C–E, E–D : 100 Mbit/s chacune |

Complète, en écrivant la route choisie sous la forme `A B D` ou `A C E D`.

```python calcul
print(2)
print(20)
print(3)
print(3)
print("A B D")
print("A C E D")
```

| Route | Nombre de sauts | Coût OSPF |
| --- | --- | --- |
| A → B → D | [[2]] | [[20]] |
| A → C → E → D | [[3]] | [[3]] |

Avec RIP, le paquet suit la route : [[A B D]]

Avec OSPF, le paquet suit la route : [[A C E D]]
::::

::::exercice[RIP ou OSPF ?]{niveau=2}
Une entreprise a deux sites reliés de deux façons : une liaison directe à 2 Mbit/s, et un chemin passant par trois routeurs intermédiaires dont
toutes les liaisons sont en fibre à 1 Gbit/s (4 liaisons). (a) Quelle route choisit RIP ? OSPF (coûts 10⁸ / débit, sans arrondi) ? (b) Laquelle
est la meilleure pour transférer de gros fichiers ? (c) Que se passe-t-il avec chaque protocole si la liaison directe tombe en panne ?

:::criteres
- (a) RIP : liaison directe (1 saut contre 4). OSPF : coût direct 50, chemin fibre 4 × 0,1 = 0,4 ; OSPF choisit la fibre.
- (b) La fibre : débit 500 fois supérieur.
- (c) RIP finit par basculer vers le chemin par la fibre après expiration de la route (plus lent) ; OSPF n'utilisait déjà pas la liaison
  directe, pas d'impact.
:::

:::corrige
(a) **RIP** compte les sauts : 1 pour la liaison directe, 4 par la fibre ; il choisit la **liaison directe**. **OSPF** compte les coûts :
10⁸ / (2 × 10⁶) = **50** pour la liaison directe ; 4 × 10⁸ / 10⁹ = **0,4** par la fibre ; il choisit la **fibre**. (b) La fibre est 500 fois
plus rapide : c'est le meilleur choix pour de gros transferts, malgré les routeurs intermédiaires. (c) Avec **RIP**, la route directe disparaît
après un délai (absence de mises à jour), puis les échanges avec les voisins font converger les tables vers le chemin par la fibre : quelques
minutes de perturbation. Avec **OSPF**, la panne ne change rien au trafic, qui passait déjà par la fibre ; et en cas de panne d'une liaison
utilisée, l'information se diffuse à tout le réseau et chaque routeur recalcule immédiatement avec Dijkstra.
:::
::::

::::exercice[Le réseau d'une entreprise]{niveau=3 type=reponses}
Liaisons d'un réseau : R1–R2 et R2–R5 à 10 Mbit/s ; R1–R3, R3–R4 et R4–R5 à 100 Mbit/s. On prend coût = 10⁸ / débit. Écris les routes sous la forme `R1 R2 R5`.

1. Avec RIP, quelle route R1 choisit-il pour atteindre R5 ?

   - R1 R2 R5

1. Quel est le coût OSPF de cette route ?

   ```python calcul
   print(10 + 10)
   ```

   - 20

1. Quel est le coût OSPF de la route passant par R3 et R4 ?

   ```python calcul
   print(1 + 1 + 1)
   ```

   - 3

1. Avec OSPF, quelle route R1 choisit-il pour atteindre R5 ?

   - R1 R3 R4 R5

1. Dans la table OSPF de R1, quelle est la passerelle pour atteindre R5 ?

   - R3

1. La liaison R3–R4 tombe en panne. Avec OSPF, quelle route R1 utilise-t-il maintenant ?

   - R1 R2 R5

1. Avant la panne, quel est le nombre de sauts de R3 vers R5 avec RIP ?

   - 2
::::
