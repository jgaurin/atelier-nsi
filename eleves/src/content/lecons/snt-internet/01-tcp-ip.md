---
titre: "TCP/IP : paquets et routage"
resume: "Comment les données traversent Internet, et ce que garantissent IP et TCP."
duree: 35
objectifs:
  - "Distinguer le rôle des protocoles IP et TCP"
  - "Caractériser les principes du routage et ses limites"
  - "Distinguer fiabilité de transmission et garantie de délai"
---

**Internet** est un réseau mondial de réseaux. Les réseaux généraux naissent avec ArpaNet (1970) aux États-Unis et Cyclades (1971) en France. Internet lui-même naît en 1983.

## 1. Des paquets

Les données sont découpées en **paquets**. Chaque paquet contient :

- un morceau du **contenu** : texte, image, son, vidéo ;
- les **adresses** de l'émetteur et du destinataire.

## 2. IP et TCP

| Protocole | Son rôle |
| --- | --- |
| **IP** | identifier les machines et acheminer les paquets |
| **TCP** | fiabiliser l'échange : redemander les paquets manquants, les remettre en ordre |

IP ne garantit pas que le paquet arrive. C'est TCP qui s'en charge, dans les ordinateurs aux deux extrémités.

## 3. Le routage

Les **routeurs** font passer les paquets de proche en proche. Chaque routeur connaît seulement une **carte locale**, établie en échangeant avec ses voisins. Il envoie le paquet au routeur suivant selon la destination.

Il n'y a pas de carte globale d'Internet : c'est ce qui permet au réseau de grandir. Si un routeur disparaît, ses voisins s'adaptent.

## 4. Les limites

Un paquet peut être perdu :

- à cause d'une **panne** de ligne ou de routeur ;
- parce qu'il a atteint son **nombre maximal de routeurs** à traverser : il est alors détruit, pour ne pas encombrer le réseau.

TCP assure la **fiabilité** : tout finit par arriver, sauf panne définitive. Mais il n'y a **aucune garantie de délai**. C'est gênant pour une visioconférence : une image perdue est acceptable, un retard ne l'est pas.

## L'essentiel

- IP adresse et achemine, TCP fiabilise.
- Chaque routeur a une carte locale et transmet au suivant.
- Un paquet peut être perdu : panne, ou trop de routeurs traversés.
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
