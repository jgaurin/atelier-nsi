---
titre: Le modèle de von Neumann
resume: "De quoi est fait un ordinateur et comment il exécute un programme."
duree: 35
objectifs:
  - "Distinguer les rôles des constituants d'une machine"
  - "Décrire le cycle d'exécution d'une instruction"
  - "Distinguer architecture monoprocesseur et multiprocesseur"
---

Ordinateur, téléphone, console de jeu : malgré leurs différences, presque tous suivent le même plan d'organisation, décrit en 1945. On l'appelle le **modèle de von Neumann**.

## 1. Les constituants

| Constituant | Son rôle | Une image |
| --- | --- | --- |
| **Unité arithmétique et logique** (UAL) | faire les calculs et les comparaisons | la calculatrice |
| **Unité de contrôle** | lire les instructions une à une et commander les autres composants | le chef d'orchestre |
| **Registres** | garder quelques valeurs juste au moment où on les utilise | le brouillon à côté de la calculatrice |
| **Mémoire** | contenir le programme **et** les données | le cahier |
| **Entrées-sorties** | échanger avec l'extérieur | clavier, écran, disque, réseau |
| **Bus** | transporter les données et les adresses entre les composants | les routes |

L'UAL, l'unité de contrôle et les registres forment ensemble le **processeur**.

Deux sortes de mémoire coexistent :

- la **mémoire vive** (RAM) est rapide, mais elle s'efface quand on éteint l'ordinateur : elle contient les programmes en cours ;
- le **disque** est beaucoup plus lent, mais il conserve les données sans courant : il contient les fichiers.

:::retenir[L'idée de von Neumann]
Le **programme est stocké en mémoire**, comme les données. Pour changer ce que fait la machine, il suffit de charger un autre programme : pas besoin de la recâbler.
:::

## 2. Le cycle d'exécution

Le processeur répète sans fin trois étapes :

1. **Chercher** : l'unité de contrôle lit en mémoire l'instruction dont l'adresse est dans le **compteur de programme**.
2. **Décoder** : elle comprend ce que demande l'instruction.
3. **Exécuter** : elle fait faire le travail, par exemple un calcul par l'UAL. Puis le compteur de programme passe à l'instruction suivante.

Un processeur actuel répète ce cycle plusieurs milliards de fois par seconde.

## 3. Les circuits

À l'intérieur, l'UAL est faite de **circuits combinatoires** : des circuits électroniques qui réalisent des fonctions booléennes, comme le demi-additionneur vu avec les booléens. En les combinant, on obtient des additions, des comparaisons, et tous les calculs de la machine.

## 4. Un ou plusieurs processeurs

Une architecture **monoprocesseur** exécute une seule suite d'instructions à la fois. Une architecture **multiprocesseur**, avec plusieurs **cœurs**, en exécute plusieurs **en même temps**.

Pourquoi plusieurs cœurs ? Pendant longtemps, on accélérait les processeurs en augmentant leur fréquence. Vers les années 2000, ils chauffaient trop : on a alors multiplié les cœurs. Mais deux cœurs ne vont deux fois plus vite que si le travail peut être partagé en tâches indépendantes.

:::histoire
Le modèle est décrit par John von Neumann en 1945. Les premiers ordinateurs à programme enregistré fonctionnent en 1948.
:::

## L'essentiel

- Processeur = UAL + unité de contrôle + registres. La mémoire contient le programme **et** les données.
- RAM : rapide, effacée à l'extinction. Disque : lent, durable.
- Cycle : chercher, décoder, exécuter, à l'adresse indiquée par le compteur de programme.
- L'UAL est faite de circuits combinatoires. Plusieurs cœurs exécutent plusieurs instructions en même temps.

## Exercices

::::exercice[QCM : architecture]{niveau=1 type=quiz}
Une question à la fois : la correction s'affiche aussitôt.

1. Quelle est l'idée essentielle de l'architecture de von Neumann ?

   - [ ] le processeur a plusieurs cœurs
   - [x] le programme est stocké en mémoire, comme les données
   - [ ] les données sont sur le disque
   - [ ] la machine est programmée en recâblant des fils

   > C'est le principe du « programme enregistré ».

1. Quel composant effectue une addition ?

   - [ ] l'unité de contrôle
   - [x] l'unité arithmétique et logique
   - [ ] la mémoire
   - [ ] le bus

   > L'UAL calcule ; l'unité de contrôle commande.

1. Que contient le compteur de programme ?

   - [ ] le nombre d'instructions déjà exécutées
   - [x] l'adresse de la prochaine instruction à exécuter
   - [ ] le résultat du dernier calcul
   - [ ] la vitesse du processeur

   > Il avance après chaque instruction, ou change lors d'un saut.

1. Dans l'ordre, les étapes du cycle d'une instruction sont :

   - [ ] exécuter, décoder, chercher
   - [x] chercher, décoder, exécuter
   - [ ] décoder, chercher, exécuter
   - [ ] chercher, exécuter, décoder

   > On ne peut décoder qu'une instruction déjà lue.

1. Pourquoi les processeurs ont-ils plusieurs cœurs depuis les années 2000 ?

   - [ ] pour consommer plus
   - [x] parce qu'on ne pouvait plus augmenter la fréquence sans trop chauffer
   - [ ] parce que la loi de Moore s'est arrêtée en 1990
   - [ ] pour pouvoir utiliser plusieurs écrans

   > On fait travailler plusieurs cœurs en parallèle plutôt qu'un seul plus vite.
::::

::::exercice[Qui fait quoi ?]{niveau=1 type=associer}
Associe chaque rôle au constituant correspondant.

| Rôle | Constituant |
| --- | --- |
| Effectuer une addition | UAL |
| Lire et décoder les instructions | unité de contrôle |
| Conserver le programme et les données | mémoire |
| Transporter les données entre les composants | bus |
::::

::::exercice[Le cycle]{niveau=1 type=ordre}
Remets dans l'ordre l'exécution d'une instruction.

1. Le compteur de programme indique l'adresse de l'instruction.
1. L'instruction est lue en mémoire.
1. L'instruction est décodée.
1. L'instruction est exécutée.
1. Le compteur de programme passe à l'instruction suivante.
::::

::::exercice[RAM et disque]{niveau=2}
Explique la différence entre la mémoire vive (RAM) et le disque, en parlant de vitesse et de ce qui se passe à l'extinction de l'ordinateur.

:::criteres
- La RAM est plus rapide que le disque.
- La RAM s'efface à l'extinction, le disque conserve les données.
:::

:::corrige
La mémoire vive est très rapide : le processeur y lit le programme en cours et ses données. Elle s'efface quand on éteint l'ordinateur. Le disque est bien plus lent, mais il conserve les données sans alimentation.
:::
::::

::::exercice[Un ou deux cœurs]{niveau=3 type=reponses}
Un logiciel d'images traite 4 photos. Chaque photo demande 3 secondes de calcul sur un cœur. Les photos sont indépendantes.

1. Combien de secondes faut-il avec un processeur à un seul cœur ?

   ```python calcul
   print(4 * 3)
   ```

   - 12

1. Combien de secondes faut-il au mieux avec deux cœurs ?

   ```python calcul
   print(2 * 3)
   ```

   - 6

1. Chaque photo doit maintenant attendre le résultat de la précédente. Combien de secondes faut-il avec deux cœurs ?

   - 12

   > Les calculs ne peuvent plus se faire en même temps.

1. Quelle architecture exécute plusieurs instructions en même temps : monoprocesseur ou multiprocesseur ?

   - multiprocesseur

1. Quel constituant du processeur réalise les additions de ce calcul ?

   - UAL
   - l'UAL
   - unité arithmétique et logique

1. L'UAL est faite de circuits qui réalisent des fonctions booléennes. Comment les appelle-t-on ?

   - circuits combinatoires
   - combinatoires

1. Où se trouvent le programme et les photos pendant le calcul : en mémoire vive ou sur le disque ?

   - mémoire vive
   - en mémoire vive
   - RAM
::::
