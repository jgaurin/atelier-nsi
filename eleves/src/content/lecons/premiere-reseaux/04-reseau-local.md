---
titre: Le réseau local
resume: "Les appareils du réseau de ton lycée, les adresses IP et MAC, et comment simuler un petit réseau avec le logiciel Filius."
duree: 45
objectifs:
  - "Donner le rôle des éléments d'un réseau local"
  - "Dire si deux machines sont sur le même réseau"
  - "Simuler un réseau et tester une connexion"
prerequis: [premiere-reseaux/encapsulation]
---

Le réseau de ton lycée relie des ordinateurs, des imprimantes et des serveurs. Voici les éléments qui le composent et comment les machines s'y retrouvent.

## 1. Les éléments d'un réseau local

| Élément | Son rôle |
| --- | --- |
| **Carte réseau** | relie une machine au réseau |
| **Câble** ou **Wi-Fi** | transporte les données |
| **Commutateur** (switch) | relie les machines d'un **même réseau** |
| **Borne Wi-Fi** | relie les appareils sans fil au réseau |
| **Routeur** | relie des **réseaux différents**, par exemple le lycée et Internet |
| **Serveur** | fournit un service : fichiers, comptes, pages Web |

## 2. Deux adresses

Chaque machine a deux sortes d'adresses.

- L'**adresse MAC** est liée à la carte réseau. Elle sert à atteindre une machine **voisine**. Exemple : `3C:52:82:1A:7F:09`.
- L'**adresse IP** indique où se trouve la machine sur le réseau. Exemple : `192.168.1.17`.

Une adresse IP a deux parties : le **réseau** et la **machine**. Dans ce chapitre, les réseaux sont notés **/24**, ce qui signifie que les **trois premiers nombres** désignent le réseau. Le masque correspondant est `255.255.255.0`.

:::exemple
Dans `192.168.1.17/24`, le réseau est `192.168.1` et le numéro de la machine est `17`.
:::

:::methode[Même réseau ou non ?]
On compare les trois premiers nombres des deux adresses. S'ils sont identiques, les machines sont sur le même réseau.
:::

## 3. Qui passe par où ?

- Si les deux machines sont sur le **même réseau**, les données passent par le **commutateur**.
- Sinon, elles passent par un **routeur**. La machine doit connaître l'adresse de ce routeur : c'est sa **passerelle**.

:::exemple
`192.168.1.17` et `192.168.1.200` sont sur le même réseau.
`192.168.1.17` et `192.168.2.17` sont sur deux réseaux différents : il faut un routeur.
:::

## 4. Simuler avec Filius

**Filius** est un logiciel gratuit qui permet de construire un réseau virtuel sans rien brancher.

On y travaille en deux temps :

- en **mode conception**, on place les machines, on les relie et on règle leurs adresses ;
- en **mode simulation**, on installe des logiciels sur les machines et on observe les échanges.

La commande `ping` suivie d'une adresse IP vérifie qu'une machine répond.

## L'essentiel

- **Commutateur** : relie les machines d'un même réseau. **Routeur** : relie des réseaux différents.
- Adresse **MAC** : celle de la carte réseau. Adresse **IP** : la position sur le réseau.
- En /24, les **trois premiers nombres** désignent le réseau.
- Même réseau : on passe par le commutateur. Réseaux différents : on passe par le routeur (la **passerelle**).
- `ping` teste si une machine répond.

## Exercices

::::exercice[Qui fait quoi ?]{niveau=1 type=associer}
Associe chaque élément à son rôle.

| Élément | Rôle |
| --- | --- |
| Commutateur | relie les machines d'un même réseau |
| Routeur | relie des réseaux différents |
| Carte réseau | relie une machine au réseau |
| Serveur | fournit un service aux autres machines |
::::

::::exercice[QCM : le réseau local]{niveau=1 type=quiz}
Une question à la fois : la correction s'affiche aussitôt.

1. Quel appareil relie le réseau du lycée à Internet ?

   - [ ] le commutateur
   - [x] le routeur
   - [ ] la carte réseau
   - [ ] l'imprimante

   > Internet est un autre réseau : il faut un routeur.

1. Quelle adresse est une adresse IP ?

   - [x] `192.168.1.17`
   - [ ] `3C:52:82:1A:7F:09`
   - [ ] `www.education.gouv.fr`
   - [ ] `eleve@lycee.fr`

   > Une adresse IP s'écrit ici avec quatre nombres séparés par des points.

1. Quelle adresse est liée à la carte réseau ?

   - [ ] l'adresse IP
   - [x] l'adresse MAC
   - [ ] l'adresse du site
   - [ ] l'adresse e-mail

   > L'adresse MAC identifie la carte réseau.

1. `10.0.5.1/24` et `10.0.5.200/24` sont :

   - [x] sur le même réseau
   - [ ] sur deux réseaux différents
   - [ ] impossibles
   - [ ] la même machine

   > Les trois premiers nombres sont identiques.

1. `10.0.5.1/24` et `10.0.6.1/24` sont :

   - [ ] sur le même réseau
   - [x] sur deux réseaux différents
   - [ ] la même machine
   - [ ] reliées par un commutateur seul

   > Le troisième nombre diffère.

1. Qu'est-ce que la passerelle d'une machine ?

   - [ ] son câble
   - [ ] son mot de passe
   - [x] l'adresse du routeur à utiliser pour sortir de son réseau
   - [ ] le nom de la machine

   > Sans passerelle, la machine ne peut pas joindre un autre réseau.

1. Que fait la commande `ping 192.168.1.20` ?

   - [ ] elle éteint la machine
   - [x] elle vérifie que la machine répond
   - [ ] elle change son adresse
   - [ ] elle copie un fichier

   > C'est la façon la plus simple de tester une connexion.
::::

::::exercice[Lire une adresse]{niveau=1 type=reponses}
Toutes les adresses sont en /24.

1. Quelle est la partie réseau de `172.16.5.42` ?

   - 172.16.5

   > Les trois premiers nombres.

1. Quel est le numéro de la machine `172.16.5.42` ?

   - 42

   > Le dernier nombre.

1. Quelle commande permet de tester si une machine répond ?

   - ping

   > Par exemple : `ping 172.16.5.42`.

1. Quel appareil faut-il pour relier deux réseaux différents ?

   - routeur
   - un routeur

   > Le commutateur ne relie que les machines d'un même réseau.
::::

::::exercice[Par où passent les données ?]{niveau=2 type=completer}
On donne quatre machines, toutes en /24.

| Machine | Adresse IP |
| --- | --- |
| A | `192.168.1.10` |
| B | `192.168.1.20` |
| C | `192.168.2.5` |
| D | `192.168.2.8` |

Complète le tableau. Écris **oui** ou **non**, puis **commutateur** ou **routeur**.

| Échange | Même réseau ? | Les données doivent passer par un… |
| --- | --- | --- |
| A vers B | [[oui]] | [[commutateur;switch]] |
| A vers C | [[non]] | [[routeur]] |
| C vers D | [[oui]] | [[commutateur;switch]] |
| B vers D | [[non]] | [[routeur]] |

:::corrige
A et B ont le réseau `192.168.1`, C et D le réseau `192.168.2`. Dans un même réseau, le commutateur suffit. Pour passer d'un réseau à l'autre, il faut un routeur.
:::
::::

::::exercice[TP : construire un réseau avec Filius]{niveau=2}
Sur un ordinateur où Filius est installé, réalise ce réseau.

1. En mode conception, place deux ordinateurs et un commutateur, puis relie-les.
1. Donne-leur les adresses `192.168.1.10` et `192.168.1.20`, avec le masque `255.255.255.0`.
1. En mode simulation, installe la **ligne de commande** sur le premier ordinateur.
1. Tape `ping 192.168.1.20` et observe le résultat.
1. Change l'adresse du deuxième ordinateur en `192.168.2.20`, puis recommence le `ping`.

Note ce que tu observes à l'étape 4 et à l'étape 5, puis explique la différence.

:::criteres
- À l'étape 4, le `ping` réussit.
- À l'étape 5, le `ping` échoue.
- Tu expliques que les deux machines ne sont plus sur le même réseau et qu'il faudrait un routeur.
:::

:::corrige
À l'étape 4, le `ping` réussit : les deux machines sont sur le réseau `192.168.1` et sont reliées par le commutateur. À l'étape 5, il échoue : la deuxième machine est maintenant sur le réseau `192.168.2`. Pour les faire communiquer, il faudrait ajouter un routeur et indiquer une passerelle à chaque machine.
:::
::::
