---
titre: Les systèmes sur puce
resume: "Ce qu'un système sur puce regroupe et pourquoi cette intégration change tout."
duree: 25
objectifs:
  - "Identifier les principaux composants d'un système sur puce"
  - "Donner les avantages de leur intégration"
  - "Situer l'évolution des rôles du logiciel et du matériel"
---

Dans un téléphone, presque tout tient sur une seule puce : un **système sur puce** (SoC, *System on Chip*).

## 1. Ce qu'il contient

| Composant | Rôle |
| --- | --- |
| **Cœurs de processeur** | exécuter les programmes |
| **Mémoire locale** | stocker au plus près du calcul |
| **Accélérateur graphique** (GPU) | afficher et calculer les images |
| **Interfaces radio** | Wi-Fi, 4G/5G, Bluetooth |
| **Interfaces filaires** | USB, écran |
| **Gestion d'énergie** | adapter la consommation |
| **Réseau sur puce** | faire communiquer les blocs |

## 2. Pourquoi intégrer ?

- **Vitesse** : les distances sont plus courtes, les échanges plus rapides.
- **Consommation** : moins d'énergie perdue, essentiel sur batterie.
- **Taille** et **coût** réduits en grande série.

Sur un ordinateur classique, ces composants sont séparés sur une carte mère. En les intégrant, on perd une possibilité : on ne peut pas remplacer un seul composant.

## 3. Logiciel et matériel

:::histoire
Les premiers ordinateurs étaient programmés en recâblant la machine. Le logiciel a ensuite pris une place croissante. Aujourd'hui, une puce est elle-même conçue de façon logicielle, et ses blocs sont accessibles par des API, comme une bibliothèque.
:::

## L'essentiel

- Un SoC regroupe sur une puce processeur, mémoire, graphique, radio, gestion d'énergie.
- Avantages : vitesse, faible consommation, petite taille, coût.
- Limite : on ne peut pas remplacer un composant seul.

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
