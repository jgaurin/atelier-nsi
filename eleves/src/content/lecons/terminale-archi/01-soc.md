---
titre: Les systèmes sur puce
resume: "Ce qu'un système sur puce regroupe et pourquoi cette intégration change tout."
duree: 25
objectifs:
  - "Identifier les principaux composants d'un système sur puce"
  - "Donner les avantages de leur intégration"
  - "Situer l'évolution des rôles du logiciel et du matériel"
---

Ouvre un ordinateur de bureau : tu y vois une carte mère, avec un processeur, des barrettes de mémoire, une carte graphique, une carte Wi-Fi, chacun séparé. Ouvre un téléphone : presque tout tient sur **une seule puce**. C'est un **système sur puce**, ou SoC (*System on Chip*).

## 1. Ce que contient un système sur puce

| Composant | Son rôle | Dans un téléphone |
| --- | --- | --- |
| **Cœurs de processeur** | exécuter les programmes | faire tourner les applications |
| **Mémoire locale** | garder les données au plus près du calcul | accélérer les calculs en cours |
| **Accélérateur graphique** (GPU) | calculer les images | afficher un jeu ou une vidéo |
| **Interfaces radio** | communiquer sans fil | Wi-Fi, 4G ou 5G, Bluetooth |
| **Interfaces filaires** | brancher des appareils | USB, écran |
| **Gestion d'énergie** | adapter la consommation | ralentir quand on ne fait rien |
| **Réseau sur puce** | faire communiquer les blocs entre eux | transmettre les données d'un bloc à l'autre |

## 2. Pourquoi tout intégrer sur une puce ?

- **Vitesse** : les signaux électriques mettent du temps à voyager. Sur une seule puce, les composants sont à quelques millimètres les uns des autres, au lieu de plusieurs centimètres sur une carte mère : les échanges sont plus rapides.
- **Consommation** : faire circuler un signal sur une longue piste coûte de l'énergie. Des distances courtes consomment moins, ce qui est essentiel sur batterie.
- **Taille et coût** : une seule puce prend très peu de place, et coûte peu cher à fabriquer en grande série.

En contrepartie, on ne peut **pas remplacer un seul composant**. Si le module Wi-Fi d'un ordinateur de bureau tombe en panne, on change la carte Wi-Fi ; sur un système sur puce, il faut changer la puce entière.

## 3. Le logiciel et le matériel

:::histoire
Les premiers ordinateurs se programmaient en recâblant la machine à la main. Le logiciel a ensuite pris une place de plus en plus grande. Aujourd'hui, une puce est elle-même conçue à l'aide de logiciels, et ses blocs sont commandés par des **API**, comme on appelle les fonctions d'une bibliothèque.
:::

Un programme qui veut afficher une image ne parle pas directement au circuit graphique : il appelle une fonction de l'API, sans connaître le détail du circuit.

## L'essentiel

- Un système sur puce regroupe processeur, mémoire, graphique, radio et gestion d'énergie sur une seule puce.
- Avantages : vitesse et faible consommation (distances courtes), petite taille, faible coût.
- Limite : on ne peut pas remplacer un composant seul.
- Ses blocs sont commandés par des API.

## Exercices

::::exercice[Quel composant ?]{niveau=1 type=associer}
Associe chaque tâche au composant du SoC concerné.

| Tâche | Composant |
| --- | --- |
| Exécuter une application | processeur |
| Calculer l'affichage d'un jeu | accélérateur graphique |
| Se connecter en 5G | interface radio |
| Réduire la consommation quand l'écran est éteint | gestion d'énergie |
::::

::::exercice[Vrai ou faux ?]{niveau=1 type=reponses}
Réponds par vrai ou par faux.

1. Rapprocher les composants augmente la vitesse des échanges.

   - vrai

1. Un SoC consomme généralement plus qu'un ensemble de composants séparés.

   - faux

1. Sur un SoC, on peut remplacer facilement le processeur seul.

   - faux

1. Les blocs d'une puce peuvent être accessibles par des API.

   - vrai
::::

::::exercice[Pourquoi dans un téléphone ?]{niveau=2}
Explique pourquoi les téléphones utilisent des systèmes sur puce. Donne au moins deux arguments.

:::criteres
- La faible consommation est liée à l'usage sur batterie.
- La petite taille est nécessaire dans un téléphone.
- La vitesse des échanges est un argument valable.
:::

:::corrige
Un téléphone fonctionne sur batterie : regrouper les composants réduit la consommation. Il dispose aussi de très peu de place, et une seule puce en occupe bien moins que plusieurs circuits. Enfin, les composants étant proches, les échanges sont plus rapides.
:::
::::

::::exercice[Une montre connectée]{niveau=3}
Une montre mesure le rythme cardiaque, affiche l'heure sur un écran et envoie les mesures au téléphone en Bluetooth. Le fabricant hésite entre une carte à composants séparés et un système sur puce.

1. Cite quatre blocs du système sur puce nécessaires à cette montre, avec le rôle de chacun.
2. Donne deux avantages du système sur puce, en les reliant aux contraintes d'une montre.
3. Le module Bluetooth tombe en panne. Quelle différence entre les deux solutions pour la réparation ?
4. Pourquoi dit-on qu'on utilise les blocs d'un système sur puce comme une bibliothèque logicielle ?

:::criteres
- Quatre blocs cohérents : processeur, mémoire, interface radio, contrôleur d'écran, gestion d'énergie.
- Avantages reliés à la batterie et à la taille.
- Sur un système sur puce, on ne peut pas remplacer le module seul.
- Les blocs sont accessibles par des API.
:::

:::corrige
1. Le **processeur** exécute le programme ; la **mémoire** garde les données et le code ; l'**interface radio** assure le Bluetooth ; la **gestion d'énergie** adapte la consommation.
2. Une montre a une petite batterie : la **faible consommation** est essentielle. Elle a peu de place : la **petite taille** de la puce unique convient.
3. Avec des composants séparés, on peut remplacer le module. Avec un système sur puce, il faut remplacer toute la puce.
4. Le programme commande les blocs par des **API**, sans connaître leur circuit, comme il appelle les fonctions d'une bibliothèque.
:::
::::
