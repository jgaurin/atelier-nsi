---
titre: Le protocole du bit alterné
resume: "Comment s'assurer qu'un message arrive en entier, sans doublon, même quand des données se perdent en chemin."
duree: 40
objectifs:
  - "Expliquer le rôle de l'accusé de réception et du délai d'attente"
  - "Dérouler le protocole du bit alterné, avec ou sans perte"
  - "Expliquer à quoi sert le bit"
prerequis: [premiere-reseaux/paquets]
---

Sur un réseau, des données peuvent se perdre. Le protocole du **bit alterné** est une méthode simple pour récupérer ces pertes. On va le dérouler à la main, étape par étape.

## 1. Le problème

Un **émetteur** envoie plusieurs trames à un **récepteur**. Deux choses peuvent se perdre :

- une **trame** envoyée par l'émetteur ;
- l'**accusé de réception** (ACK), le petit message par lequel le récepteur dit « bien reçu ».

## 2. Les règles

Chaque trame porte un **bit** qui vaut 0 ou 1. La première trame porte le bit 0, puis le bit **alterne** d'une nouvelle trame à la suivante : 0, 1, 0, 1…

:::retenir[Côté émetteur]
- Il envoie la trame avec son bit et lance un **minuteur**.
- S'il reçoit l'accusé portant ce bit, il passe à la trame suivante, avec **l'autre bit**.
- Si le minuteur se termine sans accusé, il **renvoie la même trame, avec le même bit**.
:::

:::retenir[Côté récepteur]
- S'il reçoit le bit qu'il attend, il **garde** la trame, envoie l'accusé portant ce bit, puis attend l'autre bit.
- S'il reçoit un autre bit, c'est un **doublon** : il **ne garde pas** la trame, mais il **renvoie l'accusé** portant ce bit.
:::

:::remarque
Certains manuels écrivent les accusés autrement : l'accusé porte alors le bit de la **prochaine** trame attendue. Le principe reste le même. Ici, l'accusé porte le bit de la trame reçue.
:::

## 3. Trois situations

**Tout se passe bien.**

| Émetteur envoie | Bit | Récepteur | Accusé |
| --- | --- | --- | --- |
| A | 0 | garde A | ACK 0 |
| B | 1 | garde B | ACK 1 |

**Une trame est perdue.** Le récepteur ne reçoit rien, donc il n'envoie pas d'accusé. Le minuteur se termine et l'émetteur renvoie la trame.

| Émetteur envoie | Bit | Récepteur | Accusé |
| --- | --- | --- | --- |
| A | 0 | perdue | aucun |
| A (renvoi) | 0 | garde A | ACK 0 |

**Un accusé est perdu.** Le récepteur a bien gardé la trame, mais l'émetteur ne le sait pas et la renvoie.

```mermaid legende="L'accusé de B est perdu : le renvoi de B est reconnu comme un doublon."
sequenceDiagram
    participant E as Émetteur
    participant R as Récepteur
    E->>R: B, bit 1
    Note over R: garde B
    R--xE: ACK 1 perdu
    Note over E: fin du minuteur
    E->>R: B, bit 1 (renvoi)
    Note over R: bit déjà reçu : doublon
    R-->>E: ACK 1
```

## 4. À quoi sert le bit ?

Regarde le dernier cas. Sans bit, le récepteur croirait que le renvoi de B est une nouvelle trame et garderait **B deux fois**. Le bit lui permet de reconnaître un doublon.

:::attention
Le bit **ne change pas** lors d'un renvoi. Il change seulement quand on passe à une nouvelle trame.
:::

Ce protocole a une limite : l'émetteur attend chaque accusé avant de continuer, ce qui est **lent**.

## L'essentiel

- Le récepteur confirme chaque trame par un **accusé de réception**.
- Sans accusé avant la fin du **minuteur**, l'émetteur renvoie la même trame avec le **même bit**.
- Le bit **alterne** à chaque nouvelle trame : 0, 1, 0, 1…
- Le bit permet au récepteur de reconnaître un **doublon**, qu'il ne garde pas mais dont il renvoie l'accusé.

## Exercices

::::exercice[QCM : le bit alterné]{niveau=1 type=quiz}
Une question à la fois : la correction s'affiche aussitôt.

1. Que signifie un accusé de réception ?

   - [ ] le destinataire est absent
   - [x] la trame a bien été reçue
   - [ ] la trame est perdue
   - [ ] le réseau est en panne

   > ACK vient de l'anglais *acknowledgment*.

1. L'émetteur vient d'envoyer une trame avec le bit 1 et reçoit ACK 1. Quel bit porte la trame suivante ?

   - [x] 0
   - [ ] 1
   - [ ] 2
   - [ ] aucun

   > Le bit alterne pour chaque nouvelle trame.

1. Le minuteur se termine sans accusé. Que fait l'émetteur ?

   - [ ] il passe à la trame suivante
   - [x] il renvoie la même trame avec le même bit
   - [ ] il renvoie la même trame avec l'autre bit
   - [ ] il arrête tout

   > Il ne sait pas ce qui s'est passé : il recommence à l'identique.

1. Le récepteur attend le bit 0 et reçoit une trame avec le bit 1. C'est :

   - [ ] une nouvelle trame à garder
   - [x] un doublon
   - [ ] une erreur fatale
   - [ ] un accusé

   > Il a déjà reçu cette trame.

1. Que fait le récepteur face à un doublon ?

   - [ ] il le garde
   - [ ] il l'ignore et ne répond rien
   - [x] il ne le garde pas, mais renvoie l'accusé
   - [ ] il arrête la communication

   > Sans accusé, l'émetteur renverrait la trame sans fin.

1. Une trame est perdue. Le récepteur :

   - [x] n'envoie aucun accusé
   - [ ] envoie un accusé
   - [ ] garde la trame
   - [ ] prévient l'émetteur de la perte

   > Il ne peut pas réagir à ce qu'il n'a pas reçu.

1. À quoi sert le bit ?

   - [ ] à chiffrer la trame
   - [ ] à indiquer la taille de la trame
   - [x] à reconnaître les doublons
   - [ ] à choisir la route

   > Il distingue une nouvelle trame d'un renvoi.
::::

::::exercice[Quel bit ?]{niveau=1 type=reponses}
La première trame porte le bit 0. On suppose ici qu'aucune donnée n'est perdue.

1. Quel bit porte la 2e trame ?

   - 1

   > 0, puis 1.

1. Quel bit porte la 4e trame ?

   - 1

   > 0, 1, 0, 1.

1. Quel bit porte la 7e trame ?

   - 0

   > Les trames de rang impair portent le bit 0.

1. Quel bit porte la 100e trame ?

   - 1

   > Les trames de rang pair portent le bit 1.
::::

::::exercice[Un accusé perdu]{niveau=2 type=ordre}
L'accusé de la trame B se perd. Remets les étapes dans l'ordre.

1. L'émetteur envoie B avec le bit 1.
1. Le récepteur garde B et envoie ACK 1.
1. ACK 1 se perd.
1. Le minuteur de l'émetteur se termine.
1. L'émetteur renvoie B avec le bit 1.
1. Le récepteur reconnaît un doublon, ne garde pas B et renvoie ACK 1.
1. L'émetteur reçoit ACK 1 et passe à la trame suivante.
::::

::::exercice[Dérouler : une trame perdue]{niveau=2 type=completer}
L'émetteur envoie les trames A, B et C. La première tentative d'envoi de B est perdue. Complète le tableau. Écris **oui** ou **non** dans la colonne « Gardée ? ».

| Étape | Trame envoyée | Bit | Arrivée | Gardée ? | Accusé envoyé |
| --- | --- | --- | --- | --- | --- |
| 1 | A | [[0]] | reçue | [[oui]] | ACK [[0]] |
| 2 | B | [[1]] | perdue | non | aucun |
| 3 | B (renvoi) | [[1]] | reçue | [[oui]] | ACK [[1]] |
| 4 | C | [[0]] | reçue | [[oui]] | ACK [[0]] |

:::corrige
La trame B n'arrive pas : le récepteur n'envoie rien. À la fin du minuteur, l'émetteur renvoie B avec le même bit, 1. Le récepteur attendait justement le bit 1 : il garde B. C porte ensuite le bit 0.
:::
::::

::::exercice[Dérouler : un accusé perdu]{niveau=3 type=completer}
L'émetteur envoie M1 puis M2. L'accusé de M1 se perd la première fois. Complète le tableau.

| Étape | Trame envoyée | Bit | Gardée ? | Accusé envoyé |
| --- | --- | --- | --- | --- |
| 1 | M1 | 0 | oui | ACK 0 (perdu) |
| 2 | M1 (renvoi) | [[0]] | [[non]] | ACK [[0]] |
| 3 | M2 | [[1]] | [[oui]] | ACK [[1]] |

Nombre total de trames envoyées : [[3]]

Nombre de trames gardées par le récepteur : [[2]]

:::corrige
M1 a déjà été gardée à l'étape 1. Au renvoi, le récepteur attend le bit 1 et reçoit le bit 0 : c'est un doublon. Il ne le garde pas, mais renvoie ACK 0. L'émetteur peut alors envoyer M2 avec le bit 1.
:::
::::

::::exercice[Pourquoi un bit ?]{niveau=3}
Une élève propose de supprimer le bit : « L'émetteur renvoie la trame s'il n'a pas d'accusé, ça suffit. »

Décris une situation précise où son idée provoque une erreur, puis explique comment le bit l'évite.

:::criteres
- Tu décris le cas où la trame arrive mais où son accusé se perd.
- Tu expliques que le récepteur garderait la trame deux fois.
- Tu expliques que le renvoi porte le même bit, ce qui permet de reconnaître le doublon.
:::

:::corrige
La trame B arrive et le récepteur la garde, mais son accusé se perd. L'émetteur renvoie donc B. Sans bit, le récepteur croit recevoir une nouvelle trame : il garde B deux fois et le message est faux. Avec le bit, le renvoi de B porte le même bit que la trame déjà reçue. Le récepteur, qui attend l'autre bit, reconnaît un doublon : il ne le garde pas et renvoie l'accusé.
:::
::::
