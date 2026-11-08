---
titre: Adresses IP et DNS
resume: "Passer d'un nom comme wikipedia.fr à l'adresse numérique d'une machine."
duree: 25
objectifs:
  - "Distinguer adresse symbolique et adresse IP"
  - "Retrouver une adresse IP à partir d'un nom, et inversement"
prerequis: [snt-internet/tcp-ip]
---

Les machines communiquent avec des nombres, mais nous préférons retenir des noms.

## 1. Deux sortes d'adresses

- Une **adresse IP** est numérique et hiérarchique. Exemple : `91.198.174.192`. Dans sa version 4, elle s'écrit avec quatre nombres de 0 à 255.
- Une **adresse symbolique** est un nom lisible. Exemple : `wikipedia.fr`.

## 2. Le DNS

Le **DNS** (*Domain Name System*) transforme une adresse symbolique en adresse IP. C'est l'annuaire d'Internet.

Il n'existe pas un seul annuaire central. Le DNS est réparti sur un **grand nombre d'ordinateurs**, constamment mis à jour. Cela évite qu'une seule panne bloque tout.

## 3. Une consultation

1. Tu tapes `wikipedia.fr`.
2. Ton ordinateur demande l'adresse à un **serveur DNS**.
3. Le serveur répond avec l'adresse IP.
4. Ton ordinateur contacte la machine à cette adresse.

## 4. Essayer sur ton ordinateur

Dans un terminal, `nslookup wikipedia.fr` affiche l'adresse IP. Avec une adresse IP, `nslookup` peut parfois retrouver le nom associé.

## L'essentiel

- Adresse IP : numérique. Adresse symbolique : lisible par les humains.
- Le DNS transforme un nom en adresse IP.
- Il est réparti sur de nombreux ordinateurs.

## Exercices

::::exercice[Quelle adresse ?]{niveau=1 type=associer}
Indique le type de chaque adresse.

| Adresse | Type |
| --- | --- |
| `192.0.2.14` | IP |
| `lycee.exemple.fr` | symbolique |
| `203.0.113.8` | IP |
| `wikipedia.org` | symbolique |
::::

::::exercice[QCM : DNS]{niveau=1 type=quiz}
Une question à la fois : la correction s'affiche aussitôt.

1. À quoi sert le DNS ?

   - [ ] à chiffrer les pages
   - [x] à transformer un nom en adresse IP
   - [ ] à découper les paquets
   - [ ] à afficher les pages

   > C'est l'annuaire d'Internet.

1. Laquelle est une adresse IP valide ?

   - [ ] `300.1.2.3`
   - [x] `192.0.2.1`
   - [ ] `192.0.2`
   - [ ] `exemple.fr`

   > Quatre nombres de 0 à 255.

1. Pourquoi le DNS est-il réparti sur de nombreux ordinateurs ?

   - [x] pour supporter un grand nombre de demandes et résister aux pannes
   - [ ] pour rendre les noms plus courts
   - [ ] pour stocker les vidéos
   - [ ] pour remplacer les routeurs

   > Un annuaire unique serait un point faible.

1. Quelle commande permet d'interroger le DNS ?

   - [ ] `print`
   - [x] `nslookup`
   - [ ] `chmod`
   - [ ] `cd`

   > Elle affiche l'adresse IP d'un nom.
::::

::::exercice[Consulter un annuaire]{niveau=2 type=reponses}
Un serveur DNS fictif contient ces lignes.

| Nom | Adresse IP |
| --- | --- |
| `ent.exemple.fr` | `192.0.2.10` |
| `cantine.exemple.fr` | `192.0.2.25` |
| `video.exemple.org` | `203.0.113.7` |

1. Quelle est l'adresse IP de `cantine.exemple.fr` ?

   - 192.0.2.25

1. Quel nom correspond à l'adresse `203.0.113.7` ?

   - video.exemple.org

1. Combien de nombres compte chacune de ces adresses IP ?

   - 4
::::

::::exercice[Une panne de DNS]{niveau=3}
Un matin, plus aucun site ne s'ouvre quand Tom tape son nom. Pourtant, quand il tape directement l'adresse IP d'un site, la page s'affiche.

1. Quel service semble en panne ? Justifie à partir de l'observation de Tom.
2. Pourquoi le réseau lui-même fonctionne-t-il encore ?
3. Quelle commande permettrait de vérifier si le nom est traduit ?
4. Pourquoi une panne qui touche un seul serveur DNS n'empêche-t-elle pas en général tout Internet de fonctionner ?

:::criteres
- Le DNS, car le passage du nom à l'adresse échoue, alors que l'accès par adresse réussit.
- Les paquets atteignent bien la machine quand on connaît son adresse.
- `nslookup`.
- Le DNS est réparti sur de nombreux ordinateurs.
:::

:::corrige
1. Le **DNS** : l'accès par adresse IP fonctionne, seule la traduction du nom échoue.
2. Avec l'adresse IP, les paquets sont routés normalement : le DNS n'intervient pas dans leur transport.
3. `nslookup` suivi du nom du site.
4. Le DNS est réparti sur un grand nombre d'ordinateurs : d'autres serveurs peuvent répondre.
:::
::::
