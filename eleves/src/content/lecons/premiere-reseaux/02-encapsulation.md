---
titre: Protocoles et encapsulation
resume: "Les règles qui permettent aux machines de se comprendre, les quatre couches du réseau, et comment les données sont emballées à l'envoi puis déballées à l'arrivée."
duree: 35
objectifs:
  - "Définir un protocole de communication"
  - "Citer les quatre couches et un protocole pour chacune"
  - "Décrire l'encapsulation à l'envoi et à l'arrivée"
  - "Expliquer l'intérêt des couches"
prerequis: [premiere-reseaux/paquets]
---

Pour se parler, deux machines doivent suivre les mêmes règles. Ces règles sont organisées en plusieurs niveaux, et chaque niveau ajoute sa propre « enveloppe » autour des données.

## 1. Qu'est-ce qu'un protocole ?

:::definition[Protocole]
Un **protocole** est un ensemble de règles que des machines suivent pour communiquer : quel format pour les messages, dans quel ordre les envoyer, que faire en cas d'erreur.
:::

Au téléphone, on dit « allô », on parle chacun son tour, on dit « au revoir » : c'est un protocole entre humains.

## 2. Les quatre couches

Un réseau utilise plusieurs protocoles, rangés en **couches**. Chaque couche a un travail précis.

| Couche | Protocole (exemples) | Son travail | Ce qu'elle ajoute |
| --- | --- | --- | --- |
| Application | HTTP, SMTP | échanger des pages, des courriels | le message de l'application |
| Transport | TCP | découper, numéroter, vérifier que tout arrive | les **ports** et le **numéro de séquence** |
| Internet | IP | trouver la route d'un réseau à l'autre | les **adresses IP** |
| Accès réseau | Ethernet, Wi-Fi | transmettre jusqu'à la machine voisine | les **adresses MAC** |

## 3. L'encapsulation

:::definition[Encapsulation]
L'**encapsulation** consiste, pour chaque couche, à ajouter son **en-tête** autour de ce que lui donne la couche du dessus.
:::

C'est comme une lettre glissée dans une enveloppe, elle-même glissée dans une autre enveloppe.

Quand ton navigateur demande une page :

1. **HTTP** écrit la requête ;
2. **TCP** ajoute son en-tête ;
3. **IP** ajoute le sien ;
4. **Ethernet** ajoute le sien, et la **trame** part sur le câble.

```
[ Ethernet | IP | TCP | HTTP : GET /index.html ]
```

À l'arrivée, on fait le chemin inverse : chaque couche **retire son en-tête** et passe le reste à la couche du dessus. C'est la **désencapsulation**.

Un routeur lit l'en-tête IP et refait l'en-tête Ethernet pour le tronçon suivant : les adresses **MAC changent** à chaque étape, les adresses **IP restent les mêmes**.

## 4. À quoi servent les couches ?

Chaque couche ne s'occupe que de son travail. On peut donc en changer une **sans toucher aux autres**.

:::exemple
Tu regardes une page en Wi-Fi, puis tu passes en 4G. Seule la couche du bas change : HTTP, TCP et IP continuent de fonctionner de la même façon.
:::

## L'essentiel

- Un **protocole** est un ensemble de règles de communication.
- Quatre couches : **Application** (HTTP), **Transport** (TCP), **Internet** (IP), **Accès réseau** (Ethernet, Wi-Fi).
- **Encapsulation** : à l'envoi, chaque couche ajoute son en-tête, du haut vers le bas.
- À l'arrivée, chaque couche retire son en-tête, du bas vers le haut.
- Les couches sont **indépendantes** : on peut en changer une sans modifier les autres.

## Exercices

::::exercice[Qui ajoute quoi ?]{niveau=1 type=associer}
Associe chaque information au protocole qui l'ajoute.

| Information | Protocole |
| --- | --- |
| Adresse IP du destinataire | IP |
| Adresse MAC de la machine voisine | Ethernet |
| Numéro de séquence | TCP |
| Page demandée : `GET /index.html` | HTTP |
::::

::::exercice[QCM : protocoles et couches]{niveau=1 type=quiz}
Une question à la fois : la correction s'affiche aussitôt.

1. Quel protocole sert à demander une page Web ?

   - [x] HTTP
   - [ ] IP
   - [ ] Ethernet
   - [ ] TCP

   > HTTP est un protocole de la couche Application.

1. Quel protocole utilise les adresses IP pour acheminer les paquets ?

   - [ ] HTTP
   - [ ] TCP
   - [x] IP
   - [ ] SMTP

   > Le protocole IP fait voyager les paquets d'un réseau à l'autre.

1. Quelle couche numérote les données et vérifie que tout arrive ?

   - [ ] Application
   - [x] Transport
   - [ ] Internet
   - [ ] Accès réseau

   > C'est le rôle de TCP.

1. Encapsuler, c'est :

   - [ ] chiffrer les données
   - [ ] compresser les données
   - [x] ajouter un en-tête autour des données de la couche du dessus
   - [ ] supprimer des données

   > Chaque couche ajoute son enveloppe.

1. Tu passes du Wi-Fi à la 4G. Quelle couche change ?

   - [ ] Application
   - [ ] Transport
   - [ ] Internet
   - [x] Accès réseau

   > Seul le moyen de transmission change.
::::

::::exercice[À l'arrivée]{niveau=2 type=completer}
Une trame arrive sur l'ordinateur destinataire. Complète l'ordre dans lequel les en-têtes sont lus et retirés. Écris le nom du protocole.

| Ordre | Protocole qui lit et retire son en-tête |
| --- | --- |
| 1 | [[Ethernet]] |
| 2 | [[IP]] |
| 3 | [[TCP]] |
| 4 | le message arrive à [[HTTP]] |

On parle alors de [[désencapsulation;desencapsulation]].

:::corrige
L'en-tête ajouté en dernier à l'envoi est lu en premier à l'arrivée : Ethernet, puis IP, puis TCP, et enfin le message HTTP.
:::
::::

::::exercice[La taille des en-têtes]{niveau=2 type=reponses}
Un message HTTP de 1 000 octets est envoyé. TCP ajoute 20 octets, IP ajoute 20 octets et Ethernet ajoute 18 octets.

1. Quelle est la taille totale de la trame, en octets ?

   - 1058
   - 1 058

   > 1 000 + 20 + 20 + 18 = 1 058.

1. Combien d'octets d'en-têtes sont ajoutés au total ?

   - 58

   > 20 + 20 + 18 = 58.

1. Quelle serait la taille totale de la trame pour un message de 100 octets ?

   - 158

   > 100 + 58 = 158.

1. Quelle part de cette trame de 158 octets est occupée par les en-têtes ? Donne un pourcentage arrondi à l'unité, sans le signe %.

   - 37

   > 58 ÷ 158 ≈ 0,367, soit environ 37 %. Pour un petit message, les en-têtes pèsent lourd.
::::

::::exercice[Analyser une trame]{niveau=3 type=reponses}
Un ordinateur A (`192.168.1.10`) demande une page au serveur S (`93.184.216.34`). Il passe par sa passerelle R. Voici la trame qui quitte A.

| Couche | Informations |
| --- | --- |
| Ethernet | MAC source : celle de A ; MAC destination : celle de R |
| IP | IP source : `192.168.1.10` ; IP destination : `93.184.216.34` |
| TCP | port source : 49152 ; port destination : 80 ; numéro de séquence : 1 |
| HTTP | `GET /index.html` |

1. Quelle couche indique la page demandée ?

   - application
   - HTTP

1. L'adresse MAC de destination est-elle celle du serveur ou celle de la passerelle ?

   - passerelle
   - la passerelle

1. Pourquoi ne met-on pas directement la MAC du serveur ? Complète : le serveur n'est pas sur le même…

   - réseau

1. Après le passage par R, quelle adresse a changé : MAC ou IP ?

   - MAC

1. Quelle est l'adresse IP de destination après le passage par R ?

   - 93.184.216.34

1. Quel en-tête le serveur retire-t-il en premier ?

   - Ethernet

1. Quel protocole utilisera le numéro de séquence pour vérifier que tout arrive ?

   - TCP
::::
