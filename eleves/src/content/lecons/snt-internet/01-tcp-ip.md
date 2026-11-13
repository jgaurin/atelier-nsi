---
titre: "TCP/IP : paquets et routage"
resume: "Comment les données traversent Internet, et ce que garantissent IP et TCP."
duree: 35
objectifs:
  - "Distinguer le rôle des protocoles IP et TCP"
  - "Caractériser les principes du routage et ses limites"
  - "Distinguer fiabilité de transmission et garantie de délai"
---

Quand tu envoies une photo à un ami à l'autre bout du monde, elle arrive en une seconde. Pourtant, aucun câble ne relie directement vos deux téléphones. Voici comment Internet s'y prend.

:::histoire
Les premiers réseaux indépendants des constructeurs naissent avec ArpaNet en 1970, aux États-Unis, et Cyclades en 1971, en France. Internet, tel qu'on le connaît, naît en 1983.
:::

## 1. Des paquets

Ta photo n'est pas envoyée d'un seul bloc. Elle est **découpée en petits morceaux**, les **paquets**, tous de taille limitée. Chaque paquet contient :

- un morceau du **contenu** : du texte, une partie d'image, de son ou de vidéo ;
- l'**adresse de l'émetteur** et l'**adresse du destinataire**, comme sur une enveloppe.

Les paquets ont tous la même forme, quel que soit leur contenu : Internet transporte de la même façon un message, une photo ou une vidéo.

## 2. Le routage : de proche en proche

Les paquets traversent une série de machines spécialisées, les **routeurs**. Chaque routeur fonctionne comme un carrefour : il lit l'adresse du destinataire, et envoie le paquet vers le routeur voisin qui le rapproche de sa destination.

Aucun routeur ne connaît la carte complète d'Internet. Chacun connaît seulement une **carte locale**, construite en échangeant en permanence avec ses voisins. Si un routeur tombe en panne, ses voisins s'en rendent compte et font passer les paquets ailleurs. C'est ce qui permet à Internet de relier des milliards de machines.

## 3. IP et TCP : deux rôles différents

| Protocole | Son rôle | Une image |
| --- | --- | --- |
| **IP** | donner une adresse à chaque machine, et acheminer chaque paquet | l'adresse sur l'enveloppe, et la poste qui achemine |
| **TCP** | vérifier que tout est arrivé : redemander les paquets manquants, les remettre dans l'ordre | le destinataire qui vérifie qu'il a toutes les pages numérotées d'une lettre |

IP achemine chaque paquet du mieux qu'il peut, mais **ne garantit pas** qu'il arrive. TCP, lui, travaille dans les deux ordinateurs, aux extrémités : il numérote les paquets au départ, et à l'arrivée il réclame ceux qui manquent.

## 4. Pourquoi un paquet se perd

Un paquet peut disparaître pour deux raisons :

- une **panne**, d'une ligne ou d'un routeur ;
- sa **destruction volontaire** : chaque paquet indique un nombre maximal de routeurs à traverser. S'il l'atteint, il est détruit. Sans cette règle, un paquet perdu tournerait sans fin et encombrerait le réseau.

## 5. Fiable, mais sans garantie de délai

Grâce à TCP, la transmission est **fiable** : tout finit par arriver, sauf panne définitive. Mais rien ne garantit **quand**. Sur un réseau encombré, les paquets et leurs renvois mettent plus de temps.

Pour un fichier, ce n'est pas grave : on attend un peu. Pour une visioconférence, c'est gênant : une image qui arrive en retard ne sert plus à rien. On peut perdre une image isolée, mais pas le fil du temps.

## L'essentiel

- Les données voyagent en paquets, avec les adresses de l'émetteur et du destinataire.
- Les routeurs transmettent de proche en proche, avec une simple carte locale.
- IP adresse et achemine ; TCP vérifie, redemande et remet en ordre.
- Internet est fiable grâce à TCP, mais sans garantie de délai.

## Exercices

::::exercice[IP ou TCP ?]{niveau=1 type=associer}
Associe chaque rôle au protocole concerné.

| Rôle | Protocole |
| --- | --- |
| Identifier une machine par une adresse numérique | IP |
| Redemander un paquet manquant | TCP |
| Acheminer un paquet vers sa destination | IP |
| Remettre les paquets dans l'ordre | TCP |
::::

::::exercice[QCM : Internet]{niveau=1 type=quiz}
Une question à la fois : la correction s'affiche aussitôt.

1. Que contient un paquet ?

   - [ ] seulement le contenu
   - [x] un morceau du contenu et des adresses
   - [ ] seulement les adresses
   - [ ] le fichier entier

   > Les adresses permettent de l'acheminer.

1. Que connaît un routeur ?

   - [ ] la carte complète d'Internet
   - [x] une carte locale, établie avec ses voisins
   - [ ] le contenu de tous les paquets
   - [ ] rien

   > Il n'existe pas de carte globale.

1. Pourquoi un paquet peut-il être détruit par un routeur ?

   - [x] il a atteint son nombre maximal de routeurs
   - [ ] il contient une vidéo
   - [ ] il est trop récent
   - [ ] il vient d'un autre pays

   > Cela évite d'encombrer le réseau.

1. Internet garantit-il un délai d'arrivée ?

   - [ ] oui, grâce à IP
   - [ ] oui, grâce à TCP
   - [x] non
   - [ ] seulement pour les vidéos

   > TCP garantit l'arrivée, pas le moment de l'arrivée.
::::

::::exercice[Les étapes d'un envoi]{niveau=2 type=ordre}
Remets dans l'ordre l'envoi d'une photo.

1. La photo est découpée en paquets.
1. Chaque paquet reçoit les adresses de l'émetteur et du destinataire.
1. Les routeurs transmettent les paquets de proche en proche.
1. TCP redemande les paquets manquants.
1. TCP remet les paquets en ordre et la photo est reconstituée.
::::

::::exercice[Suivre un paquet]{niveau=2 type=reponses}
Voici, pour chaque routeur, le routeur suivant vers la destination D.

| Routeur | Suivant vers D |
| --- | --- |
| R1 | R3 |
| R2 | D |
| R3 | R2 |

1. Un paquet part de R1. Quel routeur le reçoit juste après R1 ?

   - R3

1. Combien de routeurs traverse-t-il avant D, R1 compris ?

   - 3

1. Si le paquet ne peut pas traverser plus de 2 routeurs, arrive-t-il à D ? Réponds par oui ou par non.

   - non

   > Il est détruit avant d'arriver.
::::

::::exercice[Fichier ou visioconférence ?]{niveau=3}
Léa envoie un fichier de cours à Tom. Ensuite, elle l'appelle en visioconférence. Le réseau est très encombré, et des paquets se perdent.

1. Que fait TCP pour le fichier ? Pourquoi le fichier arrive-t-il finalement complet ?
2. Pourquoi peut-il arriver en retard, malgré TCP ?
3. Pourquoi l'image de la visioconférence peut-elle se figer ?
4. Pour la visioconférence, vaut-il mieux attendre une image perdue, ou passer à la suivante ? Justifie.
5. Un routeur tombe en panne. Pourquoi l'échange peut-il continuer ?

:::criteres
- TCP redemande les paquets manquants et les remet en ordre.
- Il n'y a pas de garantie de délai.
- Les paquets de la vidéo arrivent trop tard ou sont perdus.
- On passe à l'image suivante : le fil du temps compte plus qu'une image.
- Les routeurs s'adaptent et les paquets prennent une autre route.
:::

:::corrige
1. TCP redemande chaque paquet manquant et remet les paquets dans l'ordre : le fichier finit complet, sauf panne définitive.
2. Rien ne garantit le délai : sur un réseau encombré, les paquets et leurs renvois mettent plus de temps.
3. Les paquets de la vidéo arrivent trop tard ou se perdent : il manque des images à afficher.
4. Il vaut mieux passer à la suivante : une image perdue gêne peu, alors qu'attendre décale toute la conversation.
5. Les routeurs voisins adaptent leur carte locale : les paquets passent par un autre chemin, s'il en existe un.
:::
::::
