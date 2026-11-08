---
titre: Contrôle du chapitre
resume: "Un contrôle de 55 minutes noté sur 20 pour vérifier que tu maîtrises tout le chapitre."
duree: 55
controle: true
objectifs:
  - "Expliquer l'intérêt des paquets et de l'encapsulation"
  - "Dérouler le protocole du bit alterné"
  - "Rédiger une explication claire et justifiée"
prerequis: [premiere-reseaux/bit-alterne, premiere-reseaux/reseau-local]
---

## Consignes

Durée : **55 minutes**. Le contrôle est noté sur **20 points**. Tu n'as pas droit à ton cours.

Pour les exercices corrigés automatiquement, compte les points à la proportion de bonnes réponses.

## Exercices

::::exercice[Questions de cours]{niveau=3 type=quiz points=4}
Huit questions, chacune sur 0,5 point.

1. Quel est l'intérêt du découpage en paquets ?

   - [x] on ne renvoie que ce qui est perdu
   - [ ] les données deviennent secrètes
   - [ ] le fichier devient plus petit
   - [ ] il n'y a plus besoin d'adresses

   > Le découpage limite ce qu'il faut renvoyer et permet de partager le réseau.

1. À quoi sert le numéro d'ordre d'un paquet ?

   - [ ] à trouver l'adresse du destinataire
   - [x] à reconstituer les données dans le bon ordre
   - [ ] à choisir le routeur
   - [ ] à accélérer l'envoi

   > Les paquets peuvent arriver dans le désordre.

1. Quel protocole ajoute les numéros de port ?

   - [ ] HTTP
   - [x] TCP
   - [ ] IP
   - [ ] Ethernet

   > C'est la couche Transport.

1. Lors de l'encapsulation à l'envoi, quel en-tête est ajouté en dernier ?

   - [ ] HTTP
   - [ ] TCP
   - [ ] IP
   - [x] Ethernet

   > C'est la couche la plus basse, juste avant la transmission.

1. Dans le bit alterné, un renvoi porte :

   - [x] le même bit que l'envoi précédent de cette trame
   - [ ] l'autre bit
   - [ ] toujours 0
   - [ ] toujours 1

   > Le bit change seulement pour une nouvelle trame.

1. Le récepteur reçoit un doublon. Il :

   - [ ] le garde
   - [x] ne le garde pas et renvoie l'accusé
   - [ ] ne fait rien
   - [ ] demande la trame suivante sans accusé

   > L'accusé permet à l'émetteur de continuer.

1. Quel appareil relie les machines d'un même réseau local ?

   - [x] le commutateur
   - [ ] le routeur
   - [ ] le serveur
   - [ ] le navigateur

   > Le routeur relie des réseaux différents.

1. `192.168.3.4/24` et `192.168.4.4/24` sont :

   - [ ] sur le même réseau
   - [x] sur des réseaux différents
   - [ ] la même machine
   - [ ] des adresses MAC

   > Le troisième nombre est différent.
::::

::::exercice[Calculs sur les paquets]{niveau=3 type=reponses points=4}
Un fichier de 45 000 octets est envoyé dans des paquets contenant chacun 1 500 octets de données et un en-tête de 40 octets. Chaque question vaut 1 point.

1. Combien de paquets faut-il ?

   - 30

   > 45 000 ÷ 1 500 = 30.

1. Combien d'octets d'en-têtes sont envoyés au total ?

   - 1200
   - 1 200

   > 30 × 40 = 1 200.

1. Combien d'octets sont transmis au total, en-têtes compris ?

   - 46200
   - 46 200

   > 45 000 + 1 200 = 46 200.

1. Un seul paquet se perd. Combien d'octets faut-il renvoyer, en-tête compris ?

   - 1540
   - 1 540

   > 1 500 + 40 = 1 540.
::::

::::exercice[Les couches]{niveau=3 type=completer points=4}
Complète le tableau, puis la phrase. Chaque case vaut 0,5 point.

| Couche | Protocole | Ce qu'il ajoute |
| --- | --- | --- |
| Application | [[HTTP]] | la requête |
| Transport | TCP | les [[ports]] et le numéro de séquence |
| Internet | [[IP]] | les adresses [[IP]] |
| Accès réseau | [[Ethernet]] | les adresses [[MAC]] |

À l'envoi, chaque couche ajoute son en-tête : c'est l'[[encapsulation]].

À l'arrivée, le premier en-tête lu est celui de [[Ethernet]].

:::corrige
De haut en bas : HTTP, TCP, IP, Ethernet. L'en-tête Ethernet, ajouté en dernier, est lu en premier à l'arrivée.
:::
::::

::::exercice[Dérouler le bit alterné]{niveau=3 type=completer points=5}
L'émetteur envoie A, B et C. La première tentative d'envoi de B est perdue. Ensuite, l'accusé du premier renvoi de B est perdu. Complète le tableau, puis les deux réponses. Écris **oui** ou **non** dans la colonne « Gardée ? ».

| Étape | Trame envoyée | Bit | Arrivée | Gardée ? | Accusé |
| --- | --- | --- | --- | --- | --- |
| 1 | A | [[0]] | reçue | [[oui]] | ACK 0, reçu |
| 2 | B | [[1]] | perdue | non | aucun |
| 3 | B (renvoi) | [[1]] | reçue | [[oui]] | ACK 1, perdu |
| 4 | B (renvoi) | [[1]] | reçue | [[non]] | ACK 1, reçu |
| 5 | C | [[0]] | reçue | [[oui]] | ACK 0, reçu |

Nombre total de trames envoyées : [[5]]

Trames gardées par le récepteur, dans l'ordre : [[A B C;ABC;A, B, C]]

:::corrige
À l'étape 2, B est perdue : le récepteur n'envoie rien et l'émetteur renvoie B avec le bit 1. À l'étape 3, B est gardée, mais son accusé se perd. À l'étape 4, B arrive à nouveau alors que le récepteur attend le bit 0 : c'est un doublon. Il n'est pas gardé, mais l'accusé est renvoyé. C part ensuite avec le bit 0.
:::
::::

::::exercice[Rédiger une explication]{niveau=3 points=3}
Explique pourquoi le récepteur doit renvoyer un accusé même lorsqu'il reçoit un doublon. Appuie-toi sur une situation précise.

:::criteres
- 1 point : tu expliques qu'un doublon apparaît quand l'accusé précédent s'est perdu.
- 1 point : tu expliques que l'émetteur attend toujours son accusé.
- 1 point : tu expliques que, sans cet accusé, l'émetteur renverrait la même trame sans jamais continuer.
:::

:::corrige
Un doublon apparaît lorsque la trame a bien été reçue, mais que son accusé s'est perdu. L'émetteur, qui n'a rien reçu, renvoie la trame et attend toujours l'accusé. Si le récepteur ne répondait pas au doublon, le minuteur de l'émetteur se terminerait encore et l'émetteur renverrait la même trame sans jamais passer à la suivante.
:::
::::
