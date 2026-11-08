---
titre: Découper les données en paquets
resume: "Pourquoi un fichier n'est jamais envoyé d'un seul bloc, ce que contient un paquet, et comment le message est reconstitué à l'arrivée."
duree: 30
objectifs:
  - "Expliquer pourquoi les données sont découpées en paquets"
  - "Dire ce que contient un paquet"
  - "Calculer le nombre de paquets nécessaires pour envoyer un fichier"
---

En seconde, tu as vu qu'Internet transporte les données grâce au protocole TCP/IP. Voyons maintenant de plus près comment un fichier voyage d'un ordinateur à un autre.

## 1. Pourquoi découper ?

Quand tu envoies une photo, elle ne part pas d'un seul bloc : elle est **découpée en petits morceaux**, les **paquets**.

Il y a trois bonnes raisons à cela.

- **Partager le réseau.** Les paquets de plusieurs personnes passent à tour de rôle sur le même câble. Personne ne bloque la ligne.
- **Limiter les dégâts.** Si un paquet se perd, on renvoie seulement ce paquet, pas tout le fichier.
- **Choisir le chemin.** Chaque paquet peut prendre une route différente. Si une route est coupée ou encombrée, les paquets passent ailleurs.

:::definition[Paquet]
Un **paquet** est un petit morceau de données envoyé sur un réseau, accompagné des informations nécessaires pour arriver à destination.
:::

## 2. Ce qu'il y a dans un paquet

Un paquet a deux parties :

- l'**en-tête**, qui contient notamment l'**adresse de l'expéditeur**, l'**adresse du destinataire** et un **numéro d'ordre** ;
- les **données**, c'est-à-dire le morceau du fichier.

C'est comme une enveloppe : l'en-tête est ce qui est écrit dessus, les données sont la lettre à l'intérieur.

## 3. Combien de paquets ?

Sur un réseau courant, un paquet transporte environ **1 500 octets** de données.

:::methode[Calculer un nombre de paquets]
On divise la taille du fichier par la taille des données d'un paquet, puis on **arrondit à l'entier supérieur** : un morceau incomplet a quand même besoin d'un paquet.
:::

:::exemple
Une photo de 3 Mo fait 3 000 000 octets.
3 000 000 ÷ 1 500 = **2 000 paquets**.

Un fichier de 4 000 octets : 4 000 ÷ 1 500 ≈ 2,67, donc **3 paquets**.
:::

## 4. Le voyage et l'arrivée

Les paquets passent de routeur en routeur jusqu'à la destination. Comme ils ne prennent pas forcément le même chemin, ils peuvent **arriver dans le désordre**.

Grâce à leur **numéro d'ordre**, l'ordinateur qui les reçoit les remet dans le bon ordre et reconstitue le fichier. S'il manque un numéro, il sait qu'un paquet s'est perdu.

## L'essentiel

- Les données sont découpées en **paquets** : le réseau est partagé, une perte coûte peu, les chemins peuvent varier.
- Un paquet = un **en-tête** (adresses, numéro d'ordre) + des **données**.
- Nombre de paquets = taille du fichier ÷ taille des données d'un paquet, **arrondi au-dessus**.
- Les paquets peuvent arriver dans le désordre : leur **numéro** permet de les remettre en ordre.

## Exercices

::::exercice[QCM : les paquets]{niveau=1 type=quiz}
Une question à la fois : la correction s'affiche aussitôt.

1. Pourquoi découpe-t-on un fichier en paquets ?

   - [ ] pour qu'il prenne moins de place sur le disque
   - [x] pour partager le réseau et ne renvoyer que ce qui est perdu
   - [ ] pour le protéger contre le piratage
   - [ ] parce que les câbles sont courts

   > Le découpage ne compresse rien et ne protège pas les données : il rend la transmission plus souple.

1. Un paquet contient :

   - [ ] seulement des données
   - [ ] seulement une adresse
   - [x] un en-tête et des données
   - [ ] le fichier entier

   > L'en-tête indique notamment où va le paquet ; les données sont le morceau du fichier.

1. À quoi sert le numéro d'ordre d'un paquet ?

   - [ ] à choisir sa route
   - [x] à remettre les paquets dans l'ordre à l'arrivée
   - [ ] à mesurer sa taille
   - [ ] à le chiffrer

   > Sans numéro, impossible de savoir dans quel ordre recoller les morceaux.

1. Deux paquets d'un même fichier :

   - [ ] prennent toujours le même chemin
   - [x] peuvent prendre des chemins différents
   - [ ] arrivent toujours dans l'ordre
   - [ ] partent forcément en même temps

   > Chaque paquet est acheminé séparément.

1. Un paquet se perd pendant l'envoi d'une vidéo. Que faut-il renvoyer ?

   - [ ] toute la vidéo
   - [x] seulement ce paquet
   - [ ] la moitié de la vidéo
   - [ ] rien, la vidéo est perdue

   > C'est tout l'intérêt du découpage.
::::

::::exercice[Calculer des nombres de paquets]{niveau=1 type=reponses}
Chaque paquet transporte 1 500 octets de données. On rappelle que 1 Mo = 1 000 000 octets.

1. Combien de paquets pour un fichier de 6 000 octets ?

   - 4

   > 6 000 ÷ 1 500 = 4.

1. Combien de paquets pour un fichier de 7 000 octets ?

   - 5

   > 7 000 ÷ 1 500 ≈ 4,67 : on arrondit au-dessus, donc 5.

1. Combien de paquets pour une photo de 3 Mo ?

   - 2000
   - 2 000

   > 3 000 000 ÷ 1 500 = 2 000.

1. Sur ces paquets de la photo, un seul se perd. Combien de paquets faut-il renvoyer ?

   - 1

   > Uniquement le paquet perdu.

1. Si la photo était envoyée d'un seul bloc et que l'envoi échouait, combien d'octets faudrait-il renvoyer ?

   - 3000000
   - 3 000 000

   > Toute la photo : 3 000 000 octets.
::::

::::exercice[Le voyage d'un message]{niveau=1 type=ordre}
Remets dans l'ordre les étapes de l'envoi d'un fichier.

1. Le fichier est découpé en paquets.
1. Chaque paquet reçoit un en-tête avec les adresses et un numéro d'ordre.
1. Les paquets partent sur le réseau.
1. Les paquets passent de routeur en routeur, parfois par des chemins différents.
1. Les paquets arrivent, parfois dans le désordre.
1. L'ordinateur destinataire les remet en ordre grâce à leur numéro et reconstitue le fichier.
::::

::::exercice[Remettre les paquets en ordre]{niveau=2 type=completer}
Quatre paquets arrivent dans le désordre.

| Ordre d'arrivée | Numéro du paquet | Données |
| --- | --- | --- |
| 1er arrivé | 3 | `LE ` |
| 2e arrivé | 1 | `BON` |
| 3e arrivé | 4 | `BAC` |
| 4e arrivé | 2 | `NE CHANCE POUR ` |

Pour reconstituer le message, on lit les paquets dans cet ordre.

| Position dans le message | Numéro du paquet | Ordre d'arrivée de ce paquet |
| --- | --- | --- |
| 1re | 1 | [[2]] |
| 2e | [[2]] | [[4]] |
| 3e | [[3]] | [[1]] |
| 4e | [[4]] | [[3]] |

Le message reconstitué est : [[BONNE CHANCE POUR LE BAC]]

:::corrige
On trie les paquets selon leur numéro : 1, 2, 3, 4. On lit alors `BON`, `NE CHANCE POUR `, `LE `, `BAC`.
:::
::::

::::exercice[Envoyer une vidéo]{niveau=3 type=reponses}
Une vidéo de 6 Mo (6 000 000 octets) est envoyée sur un réseau. Chaque paquet contient 1 500 octets de données et un en-tête de 40 octets.

1. Combien de paquets faut-il ?

   ```python calcul
   print(6000000 // 1500)
   ```

   - 4000
   - 4 000

1. Combien d'octets d'en-têtes sont envoyés au total ?

   ```python calcul
   print(4000 * 40)
   ```

   - 160000
   - 160 000

1. Combien d'octets sont envoyés au total ?

   ```python calcul
   print(6000000 + 4000 * 40)
   ```

   - 6160000
   - 6 160 000

1. La ligne a un débit de 8 millions de bits par seconde. Combien de secondes dure l'envoi ?

   ```python calcul
   print(str(6160000 * 8 / 8000000).replace(".", ","))
   ```

   - 6,16

1. Un paquet se perd. Combien d'octets faut-il renvoyer, en-tête compris ?

   ```python calcul
   print(1500 + 40)
   ```

   - 1540
   - 1 540

1. Les paquets 7, 5 et 6 arrivent dans cet ordre. Quel paquet est traité en premier une fois remis en ordre ?

   - 5
::::
