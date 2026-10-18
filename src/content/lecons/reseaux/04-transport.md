---
titre: "La couche transport : TCP et UDP"
resume: Faire communiquer des programmes et non plus des machines — ports et sockets, UDP (rapide, sans garantie), TCP (connexion, numéros de séquence, accusés de réception, retransmission, fenêtre) et le choix entre les deux.
duree: 60
objectifs:
  - Expliquer le rôle des ports et ce qui identifie une communication (adresses et ports)
  - Décrire l'établissement d'une connexion TCP et la fiabilisation (numéros de séquence, accusés de réception, retransmission)
  - Comparer TCP et UDP et choisir selon l'usage
  - Calculer l'effet d'une fenêtre d'émission sur le débit
prerequis: [reseaux/ip-routage, reseaux/physique-liaison]
programme: [asr-transport, nsi1-archi, snt-internet]
cartes:
  - q: À quoi servent les ports ?
    r: "IP achemine jusqu'à une **machine** ; le numéro de **port** (16 bits) désigne le **programme** destinataire sur cette machine : 80 (HTTP), 443 (HTTPS), 53 (DNS), 22 (SSH), 25 (SMTP)."
  - q: Qu'est-ce qui identifie une connexion TCP ?
    r: "Le quadruplet (adresse IP source, port source, adresse IP destination, port destination) : un serveur web distingue ainsi des milliers de clients sur le même port 443."
  - q: La poignée de main TCP ?
    r: "Trois messages : le client envoie SYN (avec son numéro de séquence initial), le serveur répond SYN-ACK, le client confirme par ACK ; la connexion est établie."
  - q: Comment TCP garantit-il une livraison fiable et ordonnée ?
    r: "Chaque octet est numéroté (numéro de séquence) ; le récepteur accuse réception du prochain octet attendu ; l'émetteur retransmet ce qui n'est pas acquitté après un délai ; le récepteur remet les segments dans l'ordre."
  - q: UDP ?
    r: "Protocole de transport **sans connexion** et **sans garantie** (ni livraison, ni ordre, ni doublon) mais très léger et rapide : DNS, visioconférence, jeux en ligne, diffusion vidéo en direct."
  - q: Qu'est-ce que la fenêtre TCP ?
    r: "Le nombre d'octets que l'émetteur peut envoyer sans attendre d'accusé de réception ; elle permet de remplir le « tuyau » (débit ≈ fenêtre / temps d'aller-retour) et sert au contrôle de flux et de congestion."
---

IP transporte des paquets d'une **machine** à une autre, sans garantie : ils peuvent être perdus, dupliqués, arriver dans le désordre. Mais ce
qui communique, ce sont des **programmes** : le navigateur et le serveur web, le client de messagerie et son serveur. La **couche transport**
fait ce lien, et offre deux services très différents : **TCP**, fiable mais plus lourd, et **UDP**, léger mais sans garantie.

## 1. Ports et sockets

Sur une machine, plusieurs programmes utilisent le réseau en même temps. Le **port** (un nombre de 0 à 65 535) désigne le programme
destinataire. Les serveurs écoutent sur des ports **connus** ; les clients reçoivent un port **éphémère** choisi par le système.

| Port | Service | Transport |
|---|---|---|
| 22 | SSH (connexion à distance chiffrée) | TCP |
| 25 / 587 | SMTP (envoi de courriel) | TCP |
| 53 | DNS | UDP (TCP pour les grosses réponses) |
| 80 | HTTP | TCP |
| 443 | HTTPS | TCP (UDP pour HTTP/3) |

Un **socket** est le point d'accès qu'un programme ouvre pour communiquer : une adresse IP et un port. Une connexion TCP est identifiée par le
**quadruplet** (IP source, port source, IP destination, port destination) : c'est ainsi qu'un serveur web, sur le seul port 443, distingue des
milliers de clients simultanés.

## 2. UDP : envoyer et espérer

**UDP** (*User Datagram Protocol*) ajoute aux paquets IP seulement les ports et une somme de contrôle : **pas de connexion**, **pas d'accusé de
réception**, **pas de remise en ordre**. Un datagramme perdu est perdu. En échange, aucun délai d'établissement ni d'attente.

C'est le bon choix quand **la fraîcheur compte plus que l'exhaustivité** (visioconférence, jeu en ligne : une image perdue est vite remplacée
par la suivante, la renvoyer arriverait trop tard), ou pour de **petits échanges** question-réponse (DNS : si la réponse ne vient pas, on
redemande).

## 3. TCP : une connexion fiable

**TCP** (*Transmission Control Protocol*) offre un **flux d'octets fiable et ordonné** : ce que l'émetteur écrit arrive au récepteur, complet,
dans l'ordre, sans doublon — malgré un réseau qui perd et mélange.

```mermaid legende="Connexion TCP : poignée de main en trois temps, échange avec accusés de réception, fermeture"
sequenceDiagram
  participant C as Client (port 50432)
  participant S as Serveur (port 443)
  C->>S: SYN seq=1000
  S-->>C: SYN-ACK seq=5000, ack=1001
  C->>S: ACK ack=5001
  Note over C,S: connexion établie
  C->>S: données (octets 1001 à 1500)
  S-->>C: ACK 1501 (« j'attends l'octet 1501 »)
  C->>S: données (octets 1501 à 2000)
  C->>S: données (octets 2001 à 2500)
  S-->>C: ACK 2501
  C->>S: FIN
  S-->>C: ACK, puis FIN
  C->>S: ACK
```

:::retenir[Les mécanismes de TCP]
- **Connexion** : poignée de main en trois temps (SYN, SYN-ACK, ACK), qui synchronise les numéros de séquence initiaux.
- **Numéros de séquence** : chaque octet est numéroté ; le récepteur **remet dans l'ordre** et élimine les doublons.
- **Accusés de réception cumulatifs** : « ACK 2501 » signifie « j'ai tout reçu jusqu'à 2500 ».
- **Retransmission** : un segment non acquitté après un délai (ajusté au temps d'aller-retour mesuré) est renvoyé.
- **Fenêtre** : l'émetteur peut avoir plusieurs segments « en vol » sans attendre d'ACK (contrairement au bit alterné) ; le récepteur annonce
  combien il peut recevoir (**contrôle de flux**), et l'émetteur réduit son rythme quand des pertes signalent un réseau saturé (**contrôle de
  congestion**).
:::

```python exec
def reassembler(segments):
    """segments : liste de (numéro du premier octet, données), dans l'ordre d'arrivée,
    éventuellement désordonnés ou en double. Renvoie le flux reconstitué à partir de l'octet 0."""
    recus = {}
    for debut, donnees in segments:
        recus[debut] = donnees                     # un doublon écrase la même clé
    flux, attendu = "", 0
    while attendu in recus:                        # on avance tant que la suite est contiguë
        flux += recus[attendu]
        attendu += len(recus[attendu])
    return flux, attendu                           # attendu = valeur du prochain ACK

arrivee = [(0, "Bonj"), (8, "le m"), (4, "our "), (8, "le m"), (16, "!")]
print(reassembler(arrivee))          # le segment 12 manque : on s'arrête à l'octet 12
print(reassembler(arrivee + [(12, "onde")]))
```

## 4. TCP ou UDP ?

| | TCP | UDP |
|---|---|---|
| connexion | oui (poignée de main) | non |
| fiabilité, ordre | garantis | aucun |
| en-tête | 20 octets minimum | 8 octets |
| délai | établissement + attente des retransmissions | minimal |
| usages | Web, courriel, transfert de fichiers, SSH | DNS, voix et vidéo en temps réel, jeux, diffusion |

Le récent **QUIC** (utilisé par HTTP/3) reconstruit au-dessus d'UDP une fiabilité à la TCP, mais plus rapide à établir et chiffrée : la frontière
entre les deux se déplace.

:::prof
En SNT, TCP est présenté comme le protocole qui « découpe en paquets, numérote, vérifie la réception » ; en première NSI, on approfondit avec
le bit alterné, dont TCP est une généralisation (fenêtre de plusieurs segments). Filius permet de lancer un serveur et un client, et d'observer
SYN, SYN-ACK, ACK. Les élèves comprennent bien le choix d'UDP pour la visioconférence en le reliant à leur expérience (image figée vs son haché).
:::

## Exemple guidé

**Problème.** Un serveur est à 50 ms d'aller-retour (RTT). Avec le protocole du bit alterné (un segment de 1 460 octets à la fois), quel débit
maximal obtient-on ? Et avec une fenêtre TCP de 64 Kio ? La liaison fait 100 Mbit/s.

**1. Une trame à la fois.** On envoie 1 460 octets puis on attend l'ACK : au mieux 1 460 octets par RTT, soit
$\frac{1\,460 \times 8}{0{,}05} \approx 234$ kbit/s — 0,2 % des 100 Mbit/s !

**2. Avec une fenêtre de 65 536 octets** : $\frac{65\,536 \times 8}{0{,}05} \approx 10{,}5$ Mbit/s.

**3. Quelle fenêtre pour saturer la liaison ?** Il faut que la fenêtre couvre le **produit débit × délai** : $100 \times 10^6 \times 0{,}05 / 8 = 625\,000$
octets. C'est pourquoi TCP utilise une option d'« agrandissement de fenêtre » pour dépasser 64 Kio.

```python exec
def debit_max(fenetre_octets, rtt_s, debit_lien_bits):
    return min(fenetre_octets * 8 / rtt_s, debit_lien_bits)

for fenetre in (1460, 65_536, 625_000, 2_000_000):
    print(f"fenêtre {fenetre:>9} octets → {debit_max(fenetre, 0.05, 100e6) / 1e6:7.2f} Mbit/s")
```

**4. Conclure.** Sur les réseaux lointains, c'est la **latence**, plus que le débit nominal, qui limite un transfert TCP mal réglé ; d'où l'intérêt
des serveurs proches des utilisateurs (réseaux de diffusion de contenu).

## L'essentiel

- La couche transport relie des **programmes** : ports (16 bits ; 80, 443, 53, 22…), sockets ; connexion = (IP, port) × 2.
- **UDP** : datagrammes sans connexion ni garantie, léger et rapide (DNS, temps réel, jeux).
- **TCP** : connexion (SYN, SYN-ACK, ACK), numéros de séquence par octet, ACK cumulatifs, retransmission, remise en ordre, fenêtre (contrôle de flux et de congestion).
- Débit TCP ≤ fenêtre / RTT ; il faut une fenêtre ≥ débit × délai pour remplir la liaison.

## Exercices

::::exercice[Choisir le transport]{niveau=1}
Pour quelle application UDP est-il le plus adapté ?

- [ ] Télécharger une mise à jour du système
- [ ] Envoyer un courriel avec une pièce jointe
- [x] Un appel vidéo en direct
- [ ] Afficher une page web

:::corrige
En direct, une image ou un morceau de son retransmis arriverait trop tard pour servir : mieux vaut perdre un peu de données que d'attendre.
Les trois autres usages exigent que **tout** arrive intact : TCP.
:::
::::

::::exercice[Lire un accusé de réception]{niveau=1}
Un récepteur TCP a reçu les octets 0 à 999 puis 2 000 à 2 999, mais pas 1 000 à 1 999. Quel accusé de réception envoie-t-il ?

- [ ] ACK 3000
- [x] ACK 1000
- [ ] ACK 2000
- [ ] aucun

:::corrige
Les ACK sont **cumulatifs** : ils indiquent le prochain octet attendu dans l'ordre. Tant que 1 000 manque, le récepteur répond « ACK 1000 »
(il garde de côté les octets 2 000 à 2 999). Plusieurs ACK identiques signalent à l'émetteur une perte, qu'il retransmet sans attendre la fin du délai.
:::
::::

::::exercice[Réassembler un flux]{niveau=2}
Écris `prochain_ack(segments)` : `segments` est une liste de couples `(debut, longueur)` dans l'ordre d'arrivée (désordonnés, avec doublons
possibles). Renvoie le numéro du prochain octet attendu, c'est-à-dire la valeur de l'ACK cumulatif, en partant de l'octet 0.

```python depart
def prochain_ack(segments):
    ...
```

```python tests
assert prochain_ack([(0, 500), (500, 500)]) == 1000, "dans l'ordre"
assert prochain_ack([(500, 500), (0, 500)]) == 1000, "désordre"
assert prochain_ack([(0, 500), (1000, 500)]) == 500, "trou"
assert prochain_ack([(0, 500), (0, 500), (500, 100)]) == 600, "doublon"
assert prochain_ack([(200, 100)]) == 0, "rien de contigu depuis 0"
assert prochain_ack([]) == 0, "rien reçu"
```

:::corrige
```python solution
def prochain_ack(segments):
    recus = {}
    for debut, longueur in segments:
        recus[debut] = max(longueur, recus.get(debut, 0))
    attendu = 0
    while attendu in recus:
        attendu += recus[attendu]
    return attendu
```
On range les segments par position de début ; à partir de 0, on avance tant que le segment suivant est présent. C'est exactement ce que fait le
tampon de réception de TCP (en plus, il gère les segments qui se chevauchent partiellement).
:::
::::

::::exercice[Débit et fenêtre]{niveau=2}
Écris `fenetre_necessaire(debit_bits, rtt_s)` qui renvoie la taille de fenêtre minimale, en octets (arrondie à l'entier supérieur), pour remplir
une liaison de débit `debit_bits` avec un temps d'aller-retour `rtt_s`.

```python depart
from math import ceil

def fenetre_necessaire(debit_bits, rtt_s):
    ...
```

```python tests
assert fenetre_necessaire(100e6, 0.05) == 625_000, "100 Mbit/s, 50 ms"
assert fenetre_necessaire(1e9, 0.1) == 12_500_000, "1 Gbit/s, 100 ms"
assert fenetre_necessaire(8, 1) == 1, "cas minuscule"
```

:::corrige
```python solution
from math import ceil

def fenetre_necessaire(debit_bits, rtt_s):
    return ceil(debit_bits * rtt_s / 8)
```
C'est le **produit débit × délai** : la quantité de données « dans le tuyau » pendant un aller-retour. Avec une fenêtre plus petite, l'émetteur
s'arrête en attendant les ACK et la liaison reste en partie inutilisée.
:::
::::

::::exercice[Simuler les retransmissions]{niveau=3}
On simule une fenêtre de taille `w` en « Go-Back-N » : l'émetteur envoie les segments numérotés `0, 1, 2, …, n-1` par tours ; à chaque tour, il
envoie les `w` segments (au plus) à partir du premier non acquitté ; le récepteur n'accepte que les segments **dans l'ordre** (il ignore tout ce qui
suit un segment perdu) ; au tour suivant, l'émetteur reprend au premier segment non reçu. `perdus` est l'ensemble des numéros d'**envoi** (comptés
à partir de 0 sur toute la simulation) qui sont perdus. Écris `go_back_n(n, w, perdus)` qui renvoie le nombre total d'envois.

```python depart
def go_back_n(n, w, perdus):
    ...
```

```python tests
assert go_back_n(10, 4, set()) == 10, "aucune perte"
assert go_back_n(6, 3, {1}) == 8, "perte du 2e envoi : renvoi des segments 1 et 2"
assert go_back_n(4, 1, {0, 2}) == 6, "fenêtre 1 = bit alterné sans perte d'ACK"
assert go_back_n(5, 5, {0}) == 10, "tout est renvoyé"
```

:::corrige
```python solution
def go_back_n(n, w, perdus):
    base, envoi = 0, 0                   # base : premier segment non reçu
    while base < n:
        prochaine_base = base
        bloque = False
        for seg in range(base, min(base + w, n)):
            perdu = envoi in perdus
            envoi += 1
            if not bloque and not perdu:
                prochaine_base = seg + 1     # reçu dans l'ordre
            else:
                bloque = True                # tout ce qui suit est ignoré
        base = prochaine_base
    return envoi
```
Deuxième test : tour 1, envois 0, 1, 2 (segments 0, 1, 2) ; l'envoi 1 est perdu, le segment 2 est ignoré. Tour 2 : segments 1, 2, 3 (envois 3,
4, 5). Tour 3 : segments 4, 5 (envois 6, 7). Total 8. Une perte coûte le renvoi de toute la fin de la fenêtre : TCP moderne limite ce gâchis
en gardant les segments reçus hors ordre (acquittements sélectifs).
:::
::::

::::exercice[Justifier un choix de protocole]{niveau=4 duree=20}
Des élèves de terminale développent un jeu multijoueur en réseau local : chaque joueur envoie sa position 30 fois par seconde au serveur, et le
serveur envoie aussi les messages du « chat » entre joueurs.

1. Quel protocole de transport conseillez-vous pour les positions ? pour le chat ? Justifiez précisément.
2. Avec UDP pour les positions, comment le serveur peut-il ignorer une position arrivée en retard (après une plus récente) ?
3. Quelle expérience proposeriez-vous pour leur faire **mesurer** la différence entre TCP et UDP ?

:::criteres
- Positions : UDP (données vite périmées, 30 envois/s, une perte est compensée par l'envoi suivant, pas de blocage en tête de file) ; chat : TCP (chaque message doit arriver, dans l'ordre, une fois).
- Position en retard : numéro de séquence ou horodatage dans chaque datagramme, le serveur ne garde que le plus récent.
- Expérience concrète : simulation de pertes (Filius, outil de perte réseau, ou perte simulée dans le programme), mesure de latence et de saccades, comparaison argumentée.
:::

:::corrige
1. **Positions : UDP.** Une position est périmée en 33 ms : si elle se perd, la suivante la remplace ; la retransmettre (TCP) arriverait trop tard,
   et surtout bloquerait la livraison des positions **suivantes**, déjà arrivées, en attendant la retransmission (TCP livre dans l'ordre) : le jeu
   « saccade ». **Chat : TCP.** Chaque message doit arriver, complet, une seule fois, dans l'ordre ; quelques dizaines de millisecondes de retard
   ne gênent pas.
2. Chaque datagramme porte un **numéro de séquence** (ou un horodatage) croissant par joueur ; le serveur mémorise le dernier numéro traité et
   **ignore** tout datagramme plus ancien. C'est un mécanisme « à la TCP » réduit à ce qui est utile.
3. Programmer les deux versions (positions en TCP, puis en UDP) et ajouter une **perte simulée** (le serveur jette volontairement 5 % des
   messages reçus, ou un outil qui dégrade le réseau) ; afficher un compteur de saccades et le retard moyen entre l'envoi et l'affichage. Les
   élèves constatent qu'en TCP les pertes provoquent des « gels » puis des rafales, et qu'en UDP le mouvement reste fluide avec de petits sauts.
:::
::::
