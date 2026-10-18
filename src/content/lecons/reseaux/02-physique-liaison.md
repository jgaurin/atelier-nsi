---
titre: Couches physique et liaison
resume: Transmettre des bits (supports, débit, latence, codage), les organiser en trames sur un réseau local (adresses MAC, Ethernet, commutateurs), détecter les erreurs et fiabiliser un échange avec le protocole du bit alterné.
duree: 70
objectifs:
  - Comparer des supports de transmission et calculer un temps de transmission (débit, latence)
  - Décrire une trame Ethernet, le rôle des adresses MAC et le fonctionnement d'un commutateur
  - Détecter des erreurs de transmission (bit de parité, somme de contrôle, CRC)
  - Expliquer et simuler le protocole du bit alterné
prerequis: [reseaux/couches, representation/bases]
programme: [asr-physique-liaison, nsi1-archi, snt-internet]
cartes:
  - q: Débit ou latence ?
    r: "Le **débit** est la quantité de données transmise par seconde (bit/s) ; la **latence** est le temps que met un bit pour aller d'un bout à l'autre (propagation, traitement). Temps total ≈ latence + taille / débit."
  - q: Qu'est-ce qu'une adresse MAC ?
    r: "L'identifiant (48 bits, écrit en 6 octets hexadécimaux `3c:22:fb:0a:91:7e`) d'une interface réseau, utilisé par la couche liaison pour désigner une machine **sur un même réseau local**."
  - q: Comment un commutateur apprend-il où sont les machines ?
    r: "Pour chaque trame reçue, il note l'adresse MAC **source** et le port d'arrivée dans sa table ; il envoie ensuite les trames vers le port associé à la MAC de destination, ou sur tous les ports s'il ne la connaît pas encore."
  - q: À quoi sert un bit de parité ?
    r: "À détecter une erreur : on ajoute un bit pour que le nombre de 1 soit pair ; si un bit (ou un nombre impair de bits) est inversé, la parité est fausse. Deux erreurs se compensent et passent inaperçues."
  - q: Le protocole du bit alterné ?
    r: "L'émetteur numérote ses trames 0, 1, 0, 1… ; il renvoie la trame tant qu'il n'a pas reçu l'accusé de réception portant ce numéro (délai d'attente) ; le récepteur ignore une trame qui porte le même numéro que la précédente (doublon). Il garantit une transmission sans perte ni doublon sur un lien qui peut perdre des messages."
  - q: Pourquoi le bit alterné a-t-il besoin d'un numéro ?
    r: "Si un accusé de réception est perdu, l'émetteur renvoie une trame que le récepteur a déjà reçue : le numéro lui permet de reconnaître le doublon et de ne pas le délivrer deux fois."
---

La couche **physique** transporte des **bits** : des tensions dans un câble de cuivre, des impulsions lumineuses dans une fibre, des ondes
radio. La couche **liaison** organise ces bits en **trames** entre deux machines d'un même réseau local : qui parle à qui, comment savoir
qu'une trame est arrivée intacte, que faire si elle se perd. C'est là qu'apparaît un protocole au programme de première : le **bit alterné**.

## 1. La couche physique

| Support | Débit typique | Portée | Remarques |
|---|---|---|---|
| paire torsadée (câble Ethernet) | 100 Mbit/s à 10 Gbit/s | 100 m | réseaux locaux |
| fibre optique | 1 Gbit/s à plusieurs Tbit/s | dizaines de km sans amplification | insensible aux perturbations électriques |
| Wi-Fi | dizaines de Mbit/s à quelques Gbit/s (théorique) | dizaines de mètres | partagé entre tous les appareils proches |
| 4G / 5G | dizaines à centaines de Mbit/s | kilomètres | réseau mobile |

:::methode[Temps de transmission]
Envoyer $n$ bits sur une liaison de débit $D$ et de latence $L$ prend environ $L + \frac{n}{D}$. Exemple : 10 Mo ($8 \times 10^7$ bits) sur
100 Mbit/s avec 20 ms de latence : $0{,}02 + 0{,}8 = 0{,}82$ s. Pour un petit message (une requête DNS de 100 octets), c'est la latence qui
domine : $0{,}02 + 0{,}000\,008$ s. Dans la fibre, la lumière parcourt environ 200 000 km/s : un aller Paris – New York (≈ 6 000 km) prend au
minimum 30 ms.
:::

Les bits sont **codés** en signaux. Le codage **Manchester** (Ethernet 10 Mbit/s) représente un 0 par une transition haut → bas et un 1 par
une transition bas → haut au milieu de chaque période : il y a toujours une transition, ce qui permet au récepteur de rester synchronisé
même sur une longue suite de 0.

## 2. La couche liaison : trames et adresses MAC

Chaque interface réseau a une **adresse MAC** de 48 bits, écrite en hexadécimal (`3c:22:fb:0a:91:7e`) ; les 3 premiers octets identifient
le fabricant. Une **trame Ethernet** contient :

| Préambule | MAC destination | MAC source | Type (ex. IPv4) | Données (46 à 1 500 octets) | CRC (4 octets) |
|---|---|---|---|---|---|

Le **commutateur** (*switch*) relie les machines d'un réseau local. Il **apprend** où se trouve chaque machine en lisant les adresses MAC
**sources** des trames qu'il reçoit, et n'envoie ensuite chaque trame que sur le bon port.

```mermaid legende="Un commutateur apprend l'emplacement des machines au fil des trames"
sequenceDiagram
  participant A as Machine A (port 1)
  participant S as Commutateur
  participant B as Machine B (port 2)
  participant C as Machine C (port 3)
  A->>S: trame A → B
  Note over S: apprend « A est sur le port 1 »<br/>B inconnu : diffusion
  S->>B: trame A → B
  S->>C: trame A → B (C l'ignore)
  B->>S: trame B → A
  Note over S: apprend « B est sur le port 2 »<br/>A connu : port 1 seulement
  S->>A: trame B → A
```

## 3. Détecter les erreurs

Un bruit électrique, une interférence radio peuvent inverser des bits. La couche liaison ajoute donc des **bits de contrôle** calculés à partir
des données ; le récepteur refait le calcul et compare.

- **Bit de parité** : on ajoute un bit pour que le nombre total de 1 soit pair. Détecte toute erreur sur un nombre **impair** de bits.
- **Somme de contrôle** : somme des octets (modulo 256, par exemple) ajoutée à la fin.
- **CRC** (contrôle de redondance cyclique, utilisé par Ethernet) : le reste d'une division de polynômes ; il détecte toutes les erreurs
  courtes et groupées (rafales), et la quasi-totalité des autres.

```python exec
def ajouter_parite(bits):
    return bits + [sum(bits) % 2]           # le total de 1 devient pair

def parite_ok(bits):
    return sum(bits) % 2 == 0

envoye = ajouter_parite([1, 0, 1, 1, 0, 0, 1])
print("envoyé :", envoye, parite_ok(envoye))
un_bit = envoye.copy();  un_bit[2] ^= 1
deux_bits = envoye.copy();  deux_bits[2] ^= 1;  deux_bits[5] ^= 1
print("1 erreur détectée :", not parite_ok(un_bit))
print("2 erreurs détectées :", not parite_ok(deux_bits))     # elles se compensent !
```

Ethernet **jette** une trame dont le CRC est faux, sans prévenir : c'est aux couches supérieures (TCP) de s'apercevoir de la perte. Le Wi-Fi,
plus exposé aux erreurs, accuse réception de chaque trame et la renvoie si besoin.

## 4. Le protocole du bit alterné

Comment transmettre une suite de messages **sans perte ni doublon** sur un lien qui peut **perdre** des trames (une trame abîmée est jetée,
ce qui revient à la perdre) ? Le **protocole du bit alterné** est la solution la plus simple :

1. L'émetteur envoie la trame avec un **numéro de séquence** d'un bit (0 pour la première, puis 1, 0, 1…) et déclenche un **minuteur**.
2. Le récepteur qui reçoit une trame renvoie un **accusé de réception** (ACK) portant ce numéro. Si le numéro est celui qu'il **attendait**,
   il délivre la donnée et attend désormais l'autre numéro ; sinon (doublon), il **ignore** la donnée mais renvoie quand même l'ACK.
3. Si l'émetteur reçoit l'ACK attendu, il passe à la trame suivante en **alternant** le bit ; si le minuteur expire, il **renvoie** la même trame.

```mermaid legende="Bit alterné : l'accusé de réception de la trame 1 est perdu, la trame est renvoyée et reconnue comme doublon"
sequenceDiagram
  participant E as Émetteur
  participant R as Récepteur
  E->>R: trame « A » (bit 0)
  R-->>E: ACK 0
  E->>R: trame « B » (bit 1)
  R--xE: ACK 1 (perdu)
  Note over E: délai dépassé : renvoi
  E->>R: trame « B » (bit 1)
  Note over R: attendait 0 : doublon, ignoré
  R-->>E: ACK 1
  E->>R: trame « C » (bit 0)
  R-->>E: ACK 0
```

Pourquoi un **seul** bit suffit-il ? Parce que l'émetteur n'envoie jamais la trame suivante avant d'avoir reçu l'accusé de la précédente : le
récepteur n'a qu'à distinguer « la nouvelle » de « la précédente renvoyée ». En contrepartie, l'émetteur passe beaucoup de temps à attendre :
TCP, au-dessus, autorise plusieurs segments « en vol » avec des numéros de séquence beaucoup plus grands.

:::prof
Le programme de première NSI cite explicitement le « protocole du bit alterné » (capacité attendue : « dérouler le fonctionnement d'un
protocole simple de récupération de perte de paquets »). Il se joue très bien en classe : deux élèves (émetteur et récepteur), un troisième
qui « perd » des billets au hasard. Faire chercher ce qui se passe **sans** le bit (doublons) puis **sans** le minuteur (blocage) fait
découvrir le rôle de chaque ingrédient.
:::

## Exemple guidé

**Problème.** Simuler le bit alterné sur un canal qui perd certains messages, et vérifier que le récepteur reçoit exactement la suite envoyée.

**1. Modéliser les pertes.** Pour un résultat reproductible, le canal reçoit la liste des numéros d'envoi (trames et ACK confondus, comptés à
partir de 0) qui seront perdus.

**2. Écrire la boucle de l'émetteur** : tant qu'il reste des messages, envoyer la trame courante ; si elle arrive, le récepteur répond par un
ACK, qui peut lui aussi se perdre ; si l'ACK attendu arrive, alterner le bit et passer au message suivant ; sinon (délai dépassé), recommencer.

```python exec
def bit_alterne(messages, pertes):
    envoi = 0                      # compteur de tous les envois sur le canal
    def transmis():                # le canal transmet-il cet envoi ?
        nonlocal envoi
        ok = envoi not in pertes
        envoi += 1
        return ok

    recus, attendu, bit, i, journal = [], 0, 0, 0, []
    while i < len(messages):
        journal.append(f"→ {messages[i]} (bit {bit})")
        if transmis():                                   # la trame arrive
            if bit == attendu:
                recus.append(messages[i])                # nouvelle donnée délivrée
                attendu = 1 - attendu
            else:
                journal.append("  doublon ignoré")
            if transmis():                               # l'ACK arrive
                journal.append(f"← ACK {bit}")
                bit, i = 1 - bit, i + 1
                continue
            journal.append("  ACK perdu")
        else:
            journal.append("  trame perdue")
        journal.append("  délai dépassé : renvoi")
    return recus, journal

recus, journal = bit_alterne(["A", "B", "C"], pertes={3, 6})
print("\n".join(journal))
print("reçu :", recus)
```

**3. Vérifier.** Malgré la perte d'un ACK (envoi n° 3) et d'une trame (envoi n° 6), le récepteur a reçu A, B, C une seule fois, dans l'ordre.
Essaie d'autres ensembles de pertes : le résultat est toujours le même, seul le nombre d'envois augmente.

## L'essentiel

- Couche physique : supports (cuivre, fibre, radio), **débit** (bit/s) et **latence** ; temps ≈ latence + taille/débit ; codage (Manchester).
- Couche liaison : trames, **adresses MAC** (48 bits) ; trame Ethernet = MAC destination, MAC source, type, données, CRC.
- Commutateur : apprend MAC source → port, transmet vers le bon port, diffuse si inconnu.
- Détection d'erreurs : parité (erreurs en nombre impair), somme de contrôle, CRC ; trame erronée = trame perdue.
- **Bit alterné** : numéro 0/1, accusé de réception, minuteur et renvoi ; le récepteur ignore les doublons ; fiable mais lent (une trame à la fois).

## Exercices

::::exercice[Adresse MAC]{niveau=1}
Combien d'adresses MAC différentes existe-t-il ?

- [ ] $2^{32}$, environ 4 milliards
- [x] $2^{48}$, environ 281 000 milliards
- [ ] $6 \times 256$
- [ ] $16^{12} / 2$

:::corrige
Une adresse MAC fait 48 bits (6 octets) : $2^{48} \approx 2{,}8 \times 10^{14}$ valeurs (c'est aussi $16^{12}$, puisqu'elle s'écrit avec 12
chiffres hexadécimaux).
:::
::::

::::exercice[Rôle du numéro]{niveau=1}
Dans le protocole du bit alterné, que se passerait-il sans le numéro de séquence, si un accusé de réception se perdait ?

- [ ] L'émetteur se bloquerait définitivement
- [x] Le récepteur recevrait deux fois le même message sans pouvoir le savoir
- [ ] Le message serait perdu
- [ ] Rien, le minuteur suffit

:::corrige
L'émetteur, sans ACK, renvoie la trame ; le récepteur l'a déjà reçue mais, sans numéro, ne peut pas distinguer ce renvoi d'un nouveau message :
il le délivre deux fois. C'est le **doublon** que le bit alterné permet d'éviter.
:::
::::

::::exercice[Codage Manchester]{niveau=2}
Écris `manchester(bits)` qui renvoie la liste des niveaux (0 ou 1) transmis : chaque bit devient deux demi-périodes, `0` → `[1, 0]` (haut puis
bas), `1` → `[0, 1]`. Puis `decoder(niveaux)` qui fait l'inverse et lève `ValueError` si une paire n'est pas valide (`[0, 0]` ou `[1, 1]`,
signe d'une erreur).

```python depart
def manchester(bits):
    ...

def decoder(niveaux):
    ...
```

```python tests
assert manchester([1, 0, 0]) == [0, 1, 1, 0, 1, 0], "codage"
assert decoder([0, 1, 1, 0, 1, 0]) == [1, 0, 0], "décodage"
assert decoder(manchester([0] * 8)) == [0] * 8, "longue suite de zéros"
try:
    decoder([0, 1, 1, 1])
    ok = False
except ValueError:
    ok = True
assert ok, "paire invalide détectée"
```

:::corrige
```python solution
def manchester(bits):
    niveaux = []
    for b in bits:
        niveaux += [0, 1] if b == 1 else [1, 0]
    return niveaux

def decoder(niveaux):
    bits = []
    for i in range(0, len(niveaux), 2):
        paire = niveaux[i:i + 2]
        if paire == [0, 1]:
            bits.append(1)
        elif paire == [1, 0]:
            bits.append(0)
        else:
            raise ValueError(f"paire invalide à la position {i}")
    return bits
```
Chaque bit produit une transition au milieu de sa période, même pour une longue suite de 0 : le récepteur y cale son horloge. Le prix : il faut
deux fois plus de changements de niveau que de bits.
:::
::::

::::exercice[Un commutateur qui apprend]{niveau=2}
Écris `commuter(trames)` : `trames` est une liste de triplets `(port_arrivee, mac_source, mac_destination)`. Pour chaque trame, le commutateur
apprend `mac_source → port_arrivee`, puis renvoie la liste des ports de sortie : le port connu de la destination (sauf si c'est le port
d'arrivée : liste vide), ou sinon **tous** les ports de 1 à 4 sauf le port d'arrivée. Renvoie la liste des listes de ports de sortie.

```python depart
def commuter(trames):
    ...
```

```python tests
r = commuter([(1, "A", "B"), (2, "B", "A"), (1, "A", "B"), (3, "C", "A"), (1, "A", "D")])
assert r == [[2, 3, 4], [1], [2], [1], [2, 3, 4]], "apprentissage progressif"
assert commuter([(1, "A", "B"), (1, "B", "A")]) == [[2, 3, 4], []], "même port : on ne renvoie pas"
```

:::corrige
```python solution
def commuter(trames):
    table, sorties = {}, []
    for port, src, dst in trames:
        table[src] = port
        if dst in table:
            sorties.append([] if table[dst] == port else [table[dst]])
        else:
            sorties.append([p for p in range(1, 5) if p != port])
    return sorties
```
La table (un dictionnaire MAC → port) se remplit uniquement avec les adresses **sources**. Une destination jamais vue est **diffusée** ; une fois
apprise, le trafic ne va plus que sur le bon port, ce qui évite d'encombrer le reste du réseau.
:::
::::

::::exercice[Bit alterné : compter les envois]{niveau=3}
Écris `nombre_envois(n, pertes)` qui simule le protocole du bit alterné pour `n` messages, le canal perdant les envois (trames **et** ACK,
numérotés à partir de 0 dans l'ordre où ils passent sur le canal) dont le numéro est dans l'ensemble `pertes`. Renvoie le couple (nombre total
d'envois sur le canal, nombre de doublons ignorés par le récepteur).

```python depart
def nombre_envois(n, pertes):
    ...
```

```python tests
assert nombre_envois(3, set()) == (6, 0), "aucune perte : une trame et un ACK par message"
assert nombre_envois(3, {3, 6}) == (9, 1), "un ACK perdu (doublon) et une trame perdue"
assert nombre_envois(1, {0, 1, 2}) == (5, 0), "trois trames perdues de suite, puis succès"
assert nombre_envois(2, {1}) == (6, 1), "ACK perdu : la trame renvoyée est un doublon"
```

:::corrige
```python solution
def nombre_envois(n, pertes):
    envoi, doublons, attendu, bit, i = 0, 0, 0, 0, 0
    while i < n:
        trame_ok = envoi not in pertes
        envoi += 1
        if trame_ok:
            if bit == attendu:
                attendu = 1 - attendu
            else:
                doublons += 1
            ack_ok = envoi not in pertes
            envoi += 1
            if ack_ok:
                bit, i = 1 - bit, i + 1
    return envoi, doublons
```
Déroulé du deuxième test (pertes 3 et 6) : 0 trame A, 1 ACK 0 ; 2 trame B (délivrée), 3 ACK 1 **perdu** ; 4 renvoi de B, **doublon** ignoré,
5 ACK 1 ; 6 trame C **perdue** ; 7 renvoi de C (délivrée), 8 ACK 0. Total : 9 envois, 1 doublon. Une trame perdue ne coûte qu'un renvoi ; un
ACK perdu coûte un renvoi **et** produit un doublon, que le numéro permet d'écarter. Une trame n'est suivie d'un ACK que si elle arrive : quand
elle est perdue, l'envoi suivant est de nouveau une trame (troisième test).
:::
::::

::::exercice[Faire découvrir le protocole]{niveau=4 duree=25}
Vous voulez faire **découvrir** le protocole du bit alterné à des élèves de première, plutôt que de le leur présenter.

1. Décrivez une situation de départ (activité débranchée) et le problème posé aux élèves.
2. Décrivez les étapes successives (versions naïves, défauts observés, améliorations) qui mènent au protocole.
3. Quelle trace écrite finale proposez-vous ? Quel exercice d'évaluation ?

:::criteres
- Situation : transmission de messages (cartes, billets) entre deux élèves, un « canal » qui perd des messages au hasard (dé, élève perturbateur) ; problème : que le récepteur reconstitue exactement le message.
- Progression : sans rien → pertes ; accusé de réception → blocage si l'ACK est perdu ; minuteur et renvoi → doublons ; numéro (un seul bit suffit) → protocole correct ; justification de chaque ajout par un défaut observé.
- Trace écrite : règles de l'émetteur et du récepteur, diagramme de séquence avec perte ; évaluation : dérouler un scénario de pertes donné, ou trouver l'erreur dans une variante.
:::

:::corrige
1. Par binômes, un **émetteur** doit transmettre un mot lettre par lettre (une lettre par carte) à un **récepteur** assis loin ; un **facteur** porte
   les cartes et, quand il lance un dé et obtient 1, **perd** la carte (il la garde). Consigne : le récepteur doit écrire exactement le mot, sans
   lettre manquante ni en double. Les élèves inventent des règles par écrit avant de jouer.
2. **Version 1** (on envoie et on espère) : des lettres manquent. **Version 2** (le récepteur renvoie une carte « reçu ») : si le « reçu » se perd,
   l'émetteur attend indéfiniment → on ajoute un **minuteur** (compte jusqu'à 10, puis renvoi). **Version 3** : quand c'est le « reçu » qui s'est
   perdu, la lettre renvoyée est écrite deux fois → il faut **numéroter**. Les élèves numérotent 1, 2, 3… ; on leur demande alors combien de
   numéros sont vraiment nécessaires, sachant que l'émetteur n'envoie jamais la lettre suivante avant le « reçu » : **deux** suffisent (0 et 1),
   d'où le nom du protocole.
3. Trace écrite : les règles de l'émetteur (numéroter 0/1, minuteur, renvoi tant que pas d'ACK de même numéro, alterner) et du récepteur (ACK
   toujours, délivrer seulement si numéro attendu) ; un diagramme de séquence avec une trame perdue et un ACK perdu ; le vocabulaire (accusé de
   réception, délai d'attente, doublon). Évaluation : dérouler un scénario de pertes donné en écrivant chaque envoi et ce que délivre le
   récepteur ; ou analyser une variante fautive (le récepteur n'envoie pas d'ACK pour un doublon → blocage) et expliquer le problème.
:::
::::
