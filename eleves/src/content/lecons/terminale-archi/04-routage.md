---
titre: "Le routage : RIP et OSPF"
resume: "Trouver la route empruntée par un paquet, selon le nombre de sauts ou selon le coût."
duree: 40
objectifs:
  - "Lire une table de routage"
  - "Identifier la route empruntée selon le protocole RIP ou OSPF"
---

Sur Internet, chaque **routeur** décide vers où envoyer un paquet grâce à sa **table de routage**.

## 1. Table de routage

| Destination | Passerelle | Métrique |
| --- | --- | --- |
| Réseau N5 | R3 | 2 |

« Pour atteindre N5, envoyer le paquet à R3. » Chaque routeur ne connaît que le **prochain** routeur.

## 2. RIP : le nombre de sauts

**RIP** choisit la route qui traverse le **moins de routeurs**. Chaque routeur échange sa table avec ses voisins. Une distance de 16 signifie « inaccessible ».

## 3. OSPF : le coût

**OSPF** tient compte du **débit** des liaisons. Chaque liaison a un **coût** :

coût = 10⁸ / débit (en bit/s)

| Débit | Coût |
| --- | --- |
| 100 Mbit/s | 1 |
| 10 Mbit/s | 10 |
| 1 Mbit/s | 100 |

OSPF choisit la route de **coût total minimal**. Chaque routeur connaît toute la carte du réseau, un **graphe** pondéré, et calcule le plus court chemin.

:::exemple
Route 1 : deux liaisons à 10 Mbit/s, coût 20. Route 2 : trois liaisons à 100 Mbit/s, coût 3.
RIP choisit la route 1, plus courte en sauts. OSPF choisit la route 2, plus rapide.
:::

## L'essentiel

- Une table de routage donne le prochain routeur pour chaque destination.
- RIP : le moins de sauts.
- OSPF : le coût total minimal, coût = 10⁸ / débit.

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

1. Quel algorithme utilise OSPF pour calculer les meilleurs chemins ?

   - [ ] la recherche dichotomique
   - [ ] le tri par insertion
   - [x] l'algorithme de Dijkstra
   - [ ] le parcours en profondeur

   > Plus courts chemins dans un graphe pondéré.

1. Avec RIP, quelle route R1 choisit-il pour atteindre R5 ?

   - [x] par R3 (2 sauts)
   - [ ] par R2 et R4 (3 sauts)
   - [ ] les deux en alternance
   - [ ] aucune

   > Le moins de sauts.

1. Avec les coûts OSPF du cours, quelle route R1 choisit-il pour atteindre R5 ?

   - [ ] par R3, coût 20
   - [x] par R2 et R4, coût 3
   - [ ] par R3 puis R4, coût 12
   - [ ] aucune

   > Plus de sauts mais des liaisons rapides.

1. Avec RIP, à quoi correspond une distance de 16 ?

   - [ ] 16 routeurs
   - [x] une destination inaccessible
   - [ ] un débit de 16 Mbit/s
   - [ ] une erreur de configuration

   > C'est « l'infini » de RIP.

1. Quel protocole connaît la carte complète du réseau ?

   - [ ] RIP
   - [x] OSPF
   - [ ] les deux
   - [ ] aucun

   > Chaque routeur OSPF reçoit l'état de toutes les liaisons.
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
