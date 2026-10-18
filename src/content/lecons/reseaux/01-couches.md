---
titre: Le modèle en couches
resume: Pourquoi découper les communications en couches, les modèles OSI et TCP/IP, l'encapsulation des données, le vocabulaire (trame, paquet, segment) et les équipements de chaque couche.
duree: 55
objectifs:
  - Expliquer l'intérêt d'une architecture en couches et le principe d'encapsulation
  - Citer les couches des modèles OSI et TCP/IP, leur rôle et des protocoles de chacune
  - Nommer l'unité de données de chaque couche et les équipements associés (concentrateur, commutateur, routeur)
  - Calculer la part des en-têtes dans une transmission
prerequis: [web/http]
programme: [asr-couches, nsi1-archi, snt-internet]
cartes:
  - q: Pourquoi un modèle en couches ?
    r: "Chaque couche rend un service à la couche du dessus en utilisant celle du dessous, sans connaître leurs détails : on peut changer une couche (Wi-Fi au lieu d'Ethernet) sans toucher aux autres. C'est de l'abstraction et de la modularité."
  - q: Les 4 couches du modèle TCP/IP ?
    r: "Accès réseau (Ethernet, Wi-Fi), Internet (IP), Transport (TCP, UDP), Application (HTTP, DNS, SMTP…)."
  - q: Les 7 couches du modèle OSI ?
    r: "1 physique, 2 liaison, 3 réseau, 4 transport, 5 session, 6 présentation, 7 application."
  - q: Qu'est-ce que l'encapsulation ?
    r: "En descendant les couches, chacune ajoute son **en-tête** (et parfois une fin) autour des données reçues de la couche supérieure ; à l'arrivée, chaque couche retire l'en-tête qui la concerne (désencapsulation)."
  - q: Trame, paquet, segment ?
    r: "Segment (ou datagramme UDP) : couche transport ; paquet : couche réseau (IP) ; trame : couche liaison (Ethernet) ; bits : couche physique."
  - q: Commutateur ou routeur ?
    r: "Le **commutateur** (switch, couche 2) relie les machines d'un même réseau local d'après les adresses MAC ; le **routeur** (couche 3) relie des réseaux différents d'après les adresses IP."
---

Envoyer un message d'un téléphone à un serveur à l'autre bout du monde mobilise des ondes radio, des fibres optiques, des dizaines de
routeurs, des programmes écrits par des milliers de personnes qui ne se sont jamais parlé. Ce n'est possible que parce que le problème est
**découpé en couches** : chacune résout une partie du problème et fait confiance aux autres pour le reste.

## 1. L'idée des couches

:::definition
Dans une **architecture en couches**, chaque couche :
- rend un **service** à la couche du dessus (par exemple « acheminer ce paquet jusqu'à cette adresse IP ») ;
- utilise pour cela le service de la couche du dessous, **sans connaître ses détails** ;
- dialogue avec la couche **de même niveau** sur la machine distante, selon un **protocole** (des règles et des formats de messages).
:::

On peut ainsi remplacer une couche sans toucher aux autres : une page web arrive de la même façon par Wi-Fi, par fibre ou par 4G ; un
navigateur n'a pas à savoir s'il passe par un câble ou des ondes. C'est le même principe d'**abstraction** que les fonctions ou les types
abstraits en programmation.

:::remarque[Une analogie postale]
Tu écris une lettre (application) ; tu la mets dans une enveloppe avec une adresse (réseau) ; La Poste la place dans un sac pour le centre
de tri (liaison) ; le sac voyage en camion (physique). À chaque centre de tri, on ouvre le sac et on relit l'adresse pour choisir le sac
suivant, mais personne n'ouvre ta lettre. À l'arrivée, chaque étape retire son emballage.
:::

## 2. Les modèles OSI et TCP/IP

Le modèle **OSI** (normalisé par l'ISO en 1984) décrit 7 couches ; il sert de **référence** pour le vocabulaire. Internet suit le modèle
**TCP/IP** (années 1970-1980), plus simple, à 4 couches.

| OSI | TCP/IP | Rôle | Protocoles | Unité de données | Équipement |
|---|---|---|---|---|---|
| 7 application<br/>6 présentation<br/>5 session | application | services aux programmes | HTTP, DNS, SMTP, IMAP, SSH, TLS | message | |
| 4 transport | transport | communication entre **programmes** (ports), fiabilité | TCP, UDP | segment (TCP), datagramme (UDP) | |
| 3 réseau | internet | acheminement **entre réseaux** (adresses IP, routage) | IP, ICMP | paquet | routeur |
| 2 liaison | accès réseau | transmission **sur un même réseau** (adresses MAC) | Ethernet, Wi-Fi | trame | commutateur |
| 1 physique | accès réseau | transport des **bits** (signaux électriques, lumineux, radio) | câble, fibre, ondes | bit | concentrateur, répéteur |

## 3. L'encapsulation

En descendant les couches, chaque couche **ajoute un en-tête** contenant les informations dont elle a besoin (adresses, numéros, contrôle
d'erreur) autour de ce qu'elle reçoit. À l'arrivée, chaque couche **retire** son en-tête et passe le reste à la couche supérieure.

```mermaid legende="Encapsulation : chaque couche emballe les données de la couche supérieure"
flowchart TB
  A["Application : GET /index.html …"]
  T["Transport : [en-tête TCP : ports 50432 → 443, n° de séquence] + message"]
  R["Réseau : [en-tête IP : 192.168.1.20 → 93.184.215.14, durée de vie] + segment"]
  L["Liaison : [en-tête Ethernet : MAC source → MAC routeur] + paquet + [contrôle CRC]"]
  P["Physique : 0110100101110…"]
  A -->|"encapsulation"| T --> R --> L --> P
```

```python exec
def encapsuler(message, couches):
    """Chaque couche ajoute son en-tête devant (la liaison ajoute aussi une fin)."""
    donnees = message
    for nom, entete in couches:
        donnees = f"[{nom}:{entete}]" + donnees + ("[FIN]" if nom == "ETH" else "")
        print(f"{nom:4} → {donnees}")
    return donnees

trame = encapsuler("GET /", [("TCP", "50432>443"), ("IP", "192.168.1.20>93.184.215.14"), ("ETH", "a4:5e>3c:22")])
```

Un **routeur** désencapsule jusqu'à la couche réseau (il lit l'adresse IP de destination), choisit la sortie, puis réencapsule dans une
**nouvelle trame** pour le lien suivant : l'en-tête Ethernet change à chaque saut, l'en-tête IP (presque) pas, le segment TCP jamais.

:::prof
En SNT (thème Internet), on présente l'idée de protocole, de paquets et le rôle d'IP et de TCP ; en première NSI, le modèle en couches,
l'encapsulation et le simulateur **Filius**, qui permet de construire un réseau, d'envoyer des données et d'observer les trames couche par
couche. L'analogie postale aide, mais il faut en montrer les limites (un paquet IP peut être découpé, perdu, arriver dans le désordre).
:::

## Exemple guidé

**Problème.** On envoie un fichier de 1 Mo ($10^6$ octets) par TCP/IP sur Ethernet. Chaque trame transporte au plus 1 460 octets de
données utiles, avec 20 octets d'en-tête TCP, 20 d'en-tête IP, 18 d'en-tête et fin Ethernet. Quelle part de la transmission est
constituée d'en-têtes ?

**1. Nombre de trames.** $\lceil 10^6 / 1\,460 \rceil = 685$ trames.

**2. Surcoût.** $685 \times (20 + 20 + 18) = 39\,730$ octets d'en-têtes.

**3. Proportion.** $\frac{39\,730}{10^6 + 39\,730} \approx 3{,}8\,\%$.

```python exec
from math import ceil

def surcout(taille, charge_max=1460, entetes=(20, 20, 18)):
    trames = ceil(taille / charge_max)
    octets_entetes = trames * sum(entetes)
    return trames, octets_entetes / (taille + octets_entetes)

for taille in (10**6, 100, 1):
    t, part = surcout(taille)
    print(f"{taille:>8} octets : {t} trame(s), en-têtes = {part:.1%}")
```

**4. Interpréter.** Pour un gros fichier, les en-têtes coûtent peu. Pour un tout petit message (un caractère tapé dans un terminal à
distance), ils représentent **98 %** de la trame : d'où les techniques de regroupement de petits envois.

## L'essentiel

- Couches : chacune rend un service à celle du dessus, utilise celle du dessous, dialogue avec son homologue distante par un protocole.
- OSI (7 couches, référence) et TCP/IP (4 couches : accès réseau, internet, transport, application).
- Protocoles : Ethernet/Wi-Fi (liaison), IP (réseau), TCP/UDP (transport), HTTP/DNS/SMTP (application).
- Encapsulation : chaque couche ajoute son en-tête ; unités : bit, trame, paquet, segment, message.
- Équipements : concentrateur/répéteur (1), commutateur (2, adresses MAC), routeur (3, adresses IP).

## Exercices

::::exercice[À quelle couche ?]{niveau=1}
À quelle couche du modèle TCP/IP appartient le protocole IP ?

- [ ] Accès réseau
- [x] Internet (réseau)
- [ ] Transport
- [ ] Application

:::corrige
IP assure l'adressage et l'acheminement des paquets **entre réseaux** : c'est la couche Internet (couche 3, réseau, du modèle OSI). TCP et UDP
sont au-dessus (transport), Ethernet en dessous.
:::
::::

::::exercice[Quel équipement ?]{niveau=1}
Quel équipement relie le réseau local d'une maison au réseau du fournisseur d'accès, en lisant les adresses IP ?

- [ ] Un concentrateur
- [ ] Un commutateur
- [x] Un routeur
- [ ] Un câble croisé

:::corrige
Relier deux réseaux différents en choisissant la route d'après l'adresse IP est le rôle du **routeur** (couche 3). La « box » combine en
fait un routeur, un commutateur et un point d'accès Wi-Fi.
:::
::::

::::exercice[Désencapsuler]{niveau=2}
Une trame est représentée par des dictionnaires imbriqués : chaque couche est un dictionnaire avec les clés `"couche"`, `"entete"` et
`"donnees"` (qui contient la couche suivante, ou le message final, une chaîne). Écris `desencapsuler(trame)` qui renvoie le couple
(liste des noms de couches traversées dans l'ordre, message final).

```python depart
def desencapsuler(trame):
    ...
```

```python tests
t = {"couche": "Ethernet", "entete": {"dst": "3c:22"},
     "donnees": {"couche": "IP", "entete": {"dst": "93.184.215.14"},
                 "donnees": {"couche": "TCP", "entete": {"port": 443}, "donnees": "GET /"}}}
assert desencapsuler(t) == (["Ethernet", "IP", "TCP"], "GET /"), "trois couches"
assert desencapsuler({"couche": "UDP", "entete": {}, "donnees": "ping"}) == (["UDP"], "ping"), "une couche"
```

:::corrige
```python solution
def desencapsuler(trame):
    couches = []
    donnees = trame
    while isinstance(donnees, dict):
        couches.append(donnees["couche"])
        donnees = donnees["donnees"]
    return couches, donnees
```
Chaque tour de boucle « retire un emballage » : c'est ce que fait la pile réseau de la machine destinataire, de la couche liaison à
l'application.
:::
::::

::::exercice[Débit utile]{niveau=2}
Écris `debit_utile(debit, charge_max, entetes)` qui renvoie le débit **utile** (en bits par seconde) d'une liaison de débit brut `debit`
quand chaque trame transporte `charge_max` octets de données et `entetes` octets d'en-têtes (on suppose les trames pleines et envoyées
sans pause).

```python depart
def debit_utile(debit, charge_max, entetes):
    ...
```

```python tests
assert abs(debit_utile(100e6, 1460, 58) - 100e6 * 1460 / 1518) < 1e-6, "Ethernet 100 Mbit/s"
assert debit_utile(1000, 100, 0) == 1000, "sans en-tête"
assert abs(debit_utile(1e9, 1, 57) - 1e9 / 58) < 1e-6, "petits messages"
```

:::corrige
```python solution
def debit_utile(debit, charge_max, entetes):
    return debit * charge_max / (charge_max + entetes)
```
Sur chaque trame de `charge_max + entetes` octets, seuls `charge_max` sont utiles. Avec des trames pleines, on récupère environ 96 % du débit ;
avec des messages d'un octet, moins de 2 %.
:::
::::

::::exercice[Suivre un paquet de saut en saut]{niveau=3}
Un paquet traverse une suite de liens. `chemin` est la liste des adresses MAC des interfaces traversées : `[source, routeur1, routeur2, …,
destination]`. Écris `trames(chemin, ip_src, ip_dst, message)` qui renvoie la liste des trames émises sur chaque lien, chacune sous la forme
`(mac_src, mac_dst, ip_src, ip_dst, message)` : l'en-tête Ethernet change à chaque lien, l'en-tête IP et le message restent identiques.

```python depart
def trames(chemin, ip_src, ip_dst, message):
    ...
```

```python tests
r = trames(["aa", "r1", "r2", "bb"], "10.0.0.1", "8.8.8.8", "Bonjour")
assert r == [("aa", "r1", "10.0.0.1", "8.8.8.8", "Bonjour"),
             ("r1", "r2", "10.0.0.1", "8.8.8.8", "Bonjour"),
             ("r2", "bb", "10.0.0.1", "8.8.8.8", "Bonjour")], "trois liens"
assert trames(["aa", "bb"], "1", "2", "x") == [("aa", "bb", "1", "2", "x")], "même réseau : un seul lien"
```

:::corrige
```python solution
def trames(chemin, ip_src, ip_dst, message):
    return [(chemin[i], chemin[i + 1], ip_src, ip_dst, message) for i in range(len(chemin) - 1)]
```
Les adresses MAC n'ont de sens que **sur un lien** (couche 2) ; les adresses IP désignent les **extrémités** (couche 3). En réalité, un
routeur décrémente aussi la durée de vie (TTL) de l'en-tête IP à chaque saut, et une box qui fait de la traduction d'adresses (NAT) change
l'adresse IP source.
:::
::::

::::exercice[Expliquer les couches]{niveau=4 duree=20}
En SNT, un élève demande : « Pourquoi ne pas faire un seul protocole qui fait tout, ce serait plus simple ? »

1. Répondez-lui avec deux arguments concrets.
2. Proposez une activité (débranchée ou avec Filius) qui fasse comprendre l'encapsulation.
3. Citez une limite de l'analogie postale et la façon de la corriger.

:::criteres
- Arguments : indépendance des couches (changer de support physique sans changer les applications), réutilisation (un même IP pour toutes les applications), répartition du travail entre équipements (un routeur n'a besoin que des couches basses), évolution indépendante, normalisation par des acteurs différents.
- Activité concrète : enveloppes imbriquées annotées par des groupes jouant chaque couche, ou capture dans Filius avec lecture des en-têtes, avec consignes et production attendue.
- Limite pertinente : paquets découpés, perdus, dupliqués ou désordonnés ; TCP qui accuse réception ; routes qui changent ; et façon de la travailler.
:::

:::corrige
1. **Indépendance** : une même application (le navigateur) fonctionne en Wi-Fi, en 4G ou par câble, parce qu'elle ne parle qu'à la couche
   transport ; si un protocole unique faisait tout, il faudrait le réécrire pour chaque technologie (et chaque nouvelle technologie
   obligerait à modifier tous les programmes). **Répartition** : un routeur au milieu d'Internet n'a besoin que des couches basses (lire l'adresse
   IP) ; il n'a pas à comprendre le Web, le courriel ou la visioconférence — et de nouvelles applications peuvent apparaître sans changer les
   millions de routeurs.
2. Activité débranchée : quatre groupes jouent les couches application, transport, réseau, liaison sur deux « machines ». Le message est écrit
   sur une feuille, glissée dans une enveloppe « transport » (numéro de port, numéro de morceau), elle-même dans une enveloppe « réseau »
   (adresses IP), dans une enveloppe « liaison » (adresses MAC) ; un élève « routeur » ouvre seulement l'enveloppe liaison, lit l'adresse IP
   et réemballe dans une nouvelle enveloppe liaison. Prolongement dans **Filius** : capturer l'échange et retrouver chaque en-tête dans la
   fenêtre des données échangées.
3. Limite : une lettre arrive entière et dans l'ordre ; sur Internet, un message est **découpé** en paquets qui peuvent emprunter des chemins
   différents, être perdus ou arriver dans le désordre — c'est TCP qui numérote, accuse réception et réordonne. On corrige l'analogie en
   découpant la lettre en cartes postales numérotées envoyées séparément, dont certaines « se perdent », et le destinataire réclame les
   numéros manquants.
:::
::::
