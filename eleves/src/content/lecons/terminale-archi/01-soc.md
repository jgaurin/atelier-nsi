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

En contrepartie, on ne peut pas remplacer un seul composant.

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

::::exercice[QCM : systèmes sur puce]{niveau=1 type=qcm}
Quel est un inconvénient d'un système sur puce ?

- [ ] il prend beaucoup de place
- [ ] il consomme énormément
- [x] on ne peut pas remplacer un composant séparément
- [ ] il ne contient pas de processeur

:::corrige
Tous les composants sont réunis sur une même puce : si l'un d'eux est défaillant ou dépassé, il faut changer la puce entière.
:::
::::
