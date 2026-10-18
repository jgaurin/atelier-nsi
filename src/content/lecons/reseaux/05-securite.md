---
titre: Sécuriser les communications
resume: Chiffrement symétrique (de César à AES) et asymétrique (RSA), échange de clés de Diffie-Hellman, fonctions de hachage, signatures et certificats, et leur assemblage dans HTTPS.
duree: 80
objectifs:
  - Distinguer chiffrement symétrique et asymétrique, avec leurs avantages et limites
  - Chiffrer et déchiffrer avec César, Vigenère, XOR et un RSA « jouet », et expliquer pourquoi les premiers sont cassables
  - Expliquer le rôle des fonctions de hachage (intégrité, mots de passe) et des signatures
  - Décrire l'établissement d'une connexion HTTPS (certificat, échange de clé, chiffrement symétrique)
prerequis: [reseaux/transport, maths/denombrement]
programme: [nsit-securite, id-client-serveur, asr-transport]
cartes:
  - q: Chiffrement symétrique ?
    r: "La **même clé** sert à chiffrer et à déchiffrer (César, Vigenère, AES). Rapide ; mais il faut partager la clé secrète au préalable, et une clé par paire d'interlocuteurs."
  - q: Chiffrement asymétrique ?
    r: "Une **paire de clés** : la clé **publique** (diffusée) chiffre, la clé **privée** (gardée secrète) déchiffre (RSA). Pas de secret à partager ; mais beaucoup plus lent."
  - q: Pourquoi le chiffre de César est-il faible ?
    r: "Seulement 25 clés possibles (attaque par force brute immédiate), et il conserve les fréquences des lettres (analyse fréquentielle)."
  - q: Le principe de RSA en une ligne ?
    r: "Clé publique $(n, e)$ avec $n = pq$ produit de deux grands premiers, clé privée $d$ inverse de $e$ modulo $(p-1)(q-1)$ ; chiffrer : $c = m^e \\bmod n$, déchiffrer : $m = c^d \\bmod n$. Sûr car factoriser $n$ est très difficile."
  - q: À quoi sert l'échange de Diffie-Hellman ?
    r: "À ce que deux interlocuteurs construisent un **secret commun** en n'échangeant que des valeurs publiques ($g^a \\bmod p$ et $g^b \\bmod p$) ; un espion ne peut pas en déduire $g^{ab} \\bmod p$ en pratique."
  - q: Propriétés d'une fonction de hachage cryptographique ?
    r: "Empreinte de taille fixe (256 bits pour SHA-256), rapide à calculer, **impossible à inverser**, et impossible en pratique de trouver deux messages de même empreinte ; un bit changé change toute l'empreinte."
  - q: Comment stocker des mots de passe ?
    r: "Jamais en clair : on stocke une empreinte calculée par une fonction **lente** (bcrypt, Argon2) avec un **sel** aléatoire propre à chaque utilisateur, pour empêcher les tables précalculées."
  - q: Les étapes de HTTPS (TLS) ?
    r: "Le serveur présente un **certificat** (sa clé publique signée par une autorité) ; client et serveur établissent une **clé de session** (échange de Diffie-Hellman authentifié) ; tout l'échange est ensuite chiffré **symétriquement** (AES) avec contrôle d'intégrité."
---

Sur Internet, les paquets traversent des réseaux et des routeurs qui ne nous appartiennent pas : n'importe quel intermédiaire peut les lire,
les modifier, ou se faire passer pour le serveur. Trois besoins en découlent : la **confidentialité** (personne d'autre ne lit), l'**intégrité**
(personne n'a modifié) et l'**authentification** (on parle bien au bon interlocuteur). La cryptographie y répond avec quelques outils, que
HTTPS assemble.

## 1. Le chiffrement symétrique

Le même **secret** (la clé) sert à chiffrer et à déchiffrer.

```python exec
def cesar(texte, cle):
    return "".join(chr((ord(c) - 65 + cle) % 26 + 65) if c.isupper() else c for c in texte)

def vigenere(texte, cle, sens=1):
    resultat, i = "", 0
    for c in texte:
        if c.isupper():
            decalage = ord(cle[i % len(cle)]) - 65
            resultat += chr((ord(c) - 65 + sens * decalage) % 26 + 65)
            i += 1
        else:
            resultat += c
    return resultat

print(cesar("ATTAQUE A L AUBE", 3))
secret = vigenere("ATTAQUE A L AUBE", "NSI")
print(secret, "→", vigenere(secret, "NSI", -1))
```

- **César** n'a que 25 clés : on les essaie toutes (**force brute**). Et une même lettre est toujours chiffrée pareil : l'**analyse fréquentielle**
  (le E est la lettre la plus fréquente en français) le casse aussi.
- **Vigenère** change de décalage d'une lettre à l'autre ; il a résisté trois siècles, mais la répétition de la clé permet de le casser (méthode
  de Kasiski, XIXᵉ siècle).
- Le **masque jetable** (XOR avec une clé aléatoire aussi longue que le message, utilisée une seule fois) est **parfaitement sûr**, mais
  impraticable : il faut échanger autant de clé que de message.
- **AES** (2001), standard actuel, chiffre par blocs de 128 bits avec des clés de 128 à 256 bits : $2^{128}$ clés, hors de portée de toute force
  brute.

```python exec
def xor(donnees, cle):
    return bytes(b ^ cle[i % len(cle)] for i, b in enumerate(donnees))

message = "Rendez-vous à 18 h".encode()
cle = b"\x5a\x13\xc7"
chiffre = xor(message, cle)
print(chiffre.hex())
print(xor(chiffre, cle).decode())          # XOR deux fois avec la même clé : on retrouve le message
```

:::attention[Le problème de la clé]
Le chiffrement symétrique suppose que les deux interlocuteurs **partagent déjà** la clé secrète. Comment la transmettre à un site web qu'on
visite pour la première fois, à travers un réseau qu'on sait espionné ? Et avec $n$ personnes, il faut $\frac{n(n-1)}{2}$ clés différentes.
:::

## 2. Le chiffrement asymétrique

Idée révolutionnaire des années 1970 : utiliser **deux clés liées**. La clé **publique** est donnée à tout le monde et sert à chiffrer ; seule la
clé **privée** permet de déchiffrer. N'importe qui peut m'envoyer un message secret, sans secret partagé au préalable.

**RSA** (Rivest, Shamir, Adleman, 1977) :
1. choisir deux grands nombres premiers $p$ et $q$ ; calculer $n = pq$ et $\varphi = (p-1)(q-1)$ ;
2. choisir $e$ premier avec $\varphi$ ; calculer $d$ tel que $e \times d \equiv 1 \pmod{\varphi}$ ;
3. clé publique $(n, e)$, clé privée $d$ ; chiffrer : $c = m^e \bmod n$ ; déchiffrer : $m = c^d \bmod n$.

```python exec
p, q = 61, 53                    # en vrai : des nombres de plus de 300 chiffres
n, phi = p * q, (p - 1) * (q - 1)
e = 17
d = pow(e, -1, phi)              # inverse modulaire (Python 3.8+)
print("clé publique :", (n, e), " clé privée :", d)

m = 65                           # le message est un nombre < n
c = pow(m, e, n)                 # exponentiation modulaire rapide
print("chiffré :", c, " déchiffré :", pow(c, d, n))
```

La sécurité repose sur un problème **difficile** : retrouver $d$ demande de connaître $\varphi$, donc de **factoriser** $n$. Avec $n$ de 2 048 bits,
aucun algorithme connu n'y parvient en un temps raisonnable (un ordinateur quantique suffisamment grand le pourrait : on prépare déjà des
algorithmes « post-quantiques »). Inconvénient : RSA est des **milliers de fois plus lent** qu'AES.

### Diffie-Hellman : construire un secret commun en public

Alice et Bob conviennent publiquement d'un grand premier $p$ et d'un nombre $g$. Alice choisit un secret $a$ et envoie $A = g^a \bmod p$ ; Bob
choisit $b$ et envoie $B = g^b \bmod p$. Alice calcule $B^a \bmod p$, Bob $A^b \bmod p$ : ils obtiennent tous deux $g^{ab} \bmod p$. Un espion
connaît $g$, $p$, $A$, $B$, mais retrouver $a$ à partir de $A$ (le **logarithme discret**) est hors de portée pour de grands nombres.

```python exec
p, g = 2_147_483_647, 7                  # p premier (2^31 - 1) ; en vrai : 2 048 bits ou courbes elliptiques
a, b = 123_456, 654_321                  # secrets d'Alice et de Bob
A, B = pow(g, a, p), pow(g, b, p)        # valeurs échangées en public
print("Alice calcule", pow(B, a, p), "— Bob calcule", pow(A, b, p))
```

## 3. Hachage, intégrité et signatures

Une **fonction de hachage cryptographique** (SHA-256) transforme n'importe quelle donnée en une **empreinte** de taille fixe. Elle est facile à
calculer mais **impossible à inverser**, et on ne sait pas trouver deux messages de même empreinte.

```python exec
import hashlib

for texte in ["Virement de 100 € à Léa", "Virement de 900 € à Léa"]:
    print(hashlib.sha256(texte.encode()).hexdigest()[:32], "…", texte)
```

Usages : vérifier l'**intégrité** d'un fichier téléchargé (comparer son empreinte à celle publiée) ; stocker les **mots de passe** (on garde
l'empreinte, calculée avec un **sel** aléatoire et une fonction volontairement lente comme bcrypt ou Argon2) ; **signer**.

Une **signature numérique** inverse les rôles des clés : l'auteur chiffre l'empreinte du document avec sa clé **privée** ; tout le monde peut
la vérifier avec sa clé **publique**. Elle prouve l'**authenticité** (seul le détenteur de la clé privée a pu signer) et l'**intégrité** (une
modification du document change l'empreinte).

Reste un problème : comment être sûr qu'une clé publique appartient bien à `www.mabanque.fr` et non à un imposteur ? Un **certificat** est un
document qui associe un nom de domaine à une clé publique, **signé** par une **autorité de certification** dont les navigateurs connaissent
déjà la clé publique.

## 4. HTTPS : tout assembler

```mermaid legende="Établissement d'une connexion HTTPS (TLS 1.3, simplifié)"
sequenceDiagram
  participant C as Navigateur
  participant S as Serveur www.mabanque.fr
  C->>S: ClientHello : versions, algorithmes, part Diffie-Hellman du client
  S-->>C: ServerHello : part Diffie-Hellman du serveur
  S-->>C: certificat (clé publique signée par une autorité)
  S-->>C: signature de l'échange avec sa clé privée
  Note over C: vérifie la chaîne de certificats et la signature :<br/>c'est bien mabanque.fr
  Note over C,S: les deux calculent la même clé de session (Diffie-Hellman)
  C->>S: requêtes HTTP chiffrées (AES), avec contrôle d'intégrité
  S-->>C: réponses chiffrées
```

:::retenir[Pourquoi ce mélange ?]
L'**asymétrique** (certificat, signature) sert à **authentifier** le serveur ; **Diffie-Hellman** fournit une **clé de session** sans l'avoir
jamais transmise ; le **symétrique** (AES), rapide, chiffre ensuite tout l'échange. Chaque outil est utilisé là où il est le meilleur. Le cadenas
du navigateur garantit qu'on parle au bon **domaine** de façon confidentielle — pas que le site est honnête.
:::

:::prof
Programme de terminale NSI : « décrire les principes de chiffrement symétrique (clé partagée) et asymétrique (avec clé privée/clé publique) »,
« décrire l'échange d'une clé symétrique en utilisant un protocole asymétrique pour sécuriser une communication HTTPS ». Les élèves aiment casser
César par force brute puis par analyse fréquentielle en Python ; l'analogie du **cadenas** (n'importe qui peut fermer un cadenas ouvert que je
distribue, seul moi ai la clé) illustre l'asymétrique. Le mélange de peintures illustre Diffie-Hellman.
:::

## Exemple guidé

**Problème.** Casser un message chiffré par César, sans connaître la clé : `"HQ IUDQFH, OD QXLW HVW QRLUH"`.

**1. Force brute** : on essaie les 25 décalages et on regarde lequel donne du français. Simple, mais il faut lire 25 textes.

**2. Analyse fréquentielle** : en français, la lettre la plus fréquente est le E. On suppose que la lettre la plus fréquente du message chiffré
code un E, ce qui donne la clé.

```python exec
from collections import Counter

def cesar(texte, cle):
    return "".join(chr((ord(c) - 65 + cle) % 26 + 65) if c.isupper() else c for c in texte)

chiffre = "HQ IUDQFH, OD QXLW HVW QRLUH"
lettre, nombre = Counter(c for c in chiffre if c.isupper()).most_common(1)[0]
cle = (ord(lettre) - ord("E")) % 26
print("lettre la plus fréquente :", lettre, "→ clé supposée :", cle)
print(cesar(chiffre, -cle))
```

**3. Limites.** Sur un texte court, la lettre la plus fréquente n'est pas toujours le E : on compare alors **toute** la distribution des fréquences
aux fréquences du français (et l'on garde la clé qui s'en rapproche le plus). C'est l'idée de l'attaque de Vigenère : découper le texte selon la
longueur de la clé, et faire une analyse fréquentielle sur chaque morceau.

## L'essentiel

- Objectifs : confidentialité, intégrité, authentification.
- **Symétrique** : une clé partagée (César, Vigenère, XOR, AES) ; rapide ; problème de l'échange de clé ; César : force brute et fréquences.
- **Asymétrique** : clé publique pour chiffrer, privée pour déchiffrer (RSA : $c = m^e \bmod n$, $m = c^d \bmod n$, sûreté = difficulté de factoriser) ; lent.
- **Diffie-Hellman** : secret commun construit à partir de valeurs publiques (logarithme discret).
- **Hachage** (SHA-256) : empreinte non inversible ; intégrité, mots de passe (sel + fonction lente) ; **signature** = empreinte chiffrée avec la clé privée ; **certificat** = clé publique signée par une autorité.
- **HTTPS** = TLS : certificat (authentification) + Diffie-Hellman (clé de session) + AES (chiffrement rapide).

## Exercices

::::exercice[Symétrique ou asymétrique ?]{niveau=1}
Laquelle de ces affirmations est vraie ?

- [ ] Avec RSA, on chiffre avec la clé privée du destinataire
- [x] Avec un chiffrement symétrique, émetteur et destinataire doivent partager la même clé secrète
- [ ] AES est un chiffrement asymétrique
- [ ] HTTPS n'utilise que du chiffrement asymétrique

:::corrige
Symétrique = une seule clé, partagée. Pour envoyer un secret avec RSA, on chiffre avec la clé **publique** du destinataire. AES est symétrique.
HTTPS combine asymétrique (authentification, échange de clé) et symétrique (chiffrement des données).
:::
::::

::::exercice[Rôle du certificat]{niveau=1}
Que garantit le certificat présenté par un site en HTTPS ?

- [ ] Que le site ne contient pas de virus
- [ ] Que les données sont stockées de façon sécurisée sur le serveur
- [x] Que la clé publique présentée appartient bien au nom de domaine visité
- [ ] Que le site est une entreprise honnête

:::corrige
Le certificat, signé par une autorité de certification, lie une **clé publique** à un **nom de domaine**. Il ne dit rien de l'honnêteté du site
ni de la sécurité de ses serveurs : un site d'hameçonnage peut avoir un certificat valide… pour son propre domaine.
:::
::::

::::exercice[Casser César]{niveau=2}
Écris `dechiffrer_cesar(message)` qui retrouve le texte clair d'un message en majuscules chiffré par César, en supposant que la lettre la plus
fréquente du message code un E. En cas d'égalité de fréquence, prends la lettre qui apparaît en premier dans le message.

```python depart
def dechiffrer_cesar(message):
    ...
```

```python tests
assert dechiffrer_cesar("HQ IUDQFH, OD QXLW HVW QRLUH") == "EN FRANCE, LA NUIT EST NOIRE", "clé 3"
assert dechiffrer_cesar("LE CHEMIN EST LE BUT") == "LE CHEMIN EST LE BUT", "clé 0"
assert dechiffrer_cesar("XQ HQWLHU HVW HQ HWH") == "UN ENTIER EST EN ETE", "clé 3, texte court"
```

:::corrige
```python solution
def dechiffrer_cesar(message):
    lettres = [c for c in message if c.isupper()]
    plus_frequente = max(lettres, key=lambda c: (lettres.count(c), -lettres.index(c)))
    cle = (ord(plus_frequente) - ord("E")) % 26
    return "".join(chr((ord(c) - 65 - cle) % 26 + 65) if c.isupper() else c for c in message)
```
Le critère `(nombre d'occurrences, -première position)` prend la plus fréquente, et en cas d'égalité la première apparue. Sur des textes
courts ou atypiques, la méthode peut se tromper : il faut alors comparer toute la distribution des fréquences.
:::
::::

::::exercice[Un RSA jouet]{niveau=2}
Écris `cles_rsa(p, q, e)` qui renvoie `((n, e), d)`, puis `chiffrer(m, publique)` et `dechiffrer(c, n, d)`. Utilise `pow(base, exposant, module)`
et `pow(e, -1, phi)` pour l'inverse modulaire.

```python depart
def cles_rsa(p, q, e):
    ...

def chiffrer(m, publique):
    ...

def dechiffrer(c, n, d):
    ...
```

```python tests
publique, d = cles_rsa(61, 53, 17)
assert publique == (3233, 17) and d == 2753, "clés du cours"
assert chiffrer(65, publique) == 2790, "chiffrement"
assert dechiffrer(2790, 3233, d) == 65, "déchiffrement"
pub2, d2 = cles_rsa(1009, 1013, 65537)
assert all(dechiffrer(chiffrer(m, pub2), pub2[0], d2) == m for m in range(0, 2000, 37)), "aller-retour"
```

:::corrige
```python solution
def cles_rsa(p, q, e):
    n, phi = p * q, (p - 1) * (q - 1)
    d = pow(e, -1, phi)
    return (n, e), d

def chiffrer(m, publique):
    n, e = publique
    return pow(m, e, n)

def dechiffrer(c, n, d):
    return pow(c, d, n)
```
`pow(m, e, n)` calcule $m^e \bmod n$ par exponentiation rapide, sans jamais former l'énorme nombre $m^e$. L'aller-retour fonctionne grâce au
théorème d'Euler : $m^{ed} \equiv m \pmod n$ quand $ed \equiv 1 \pmod{\varphi(n)}$. 65 537 est l'exposant public le plus utilisé en pratique.
:::
::::

::::exercice[Retrouver un mot de passe faible]{niveau=3}
Une base de données a fuité ; elle contient pour chaque utilisateur l'empreinte SHA-256 (en hexadécimal) de son mot de passe, **sans sel**.
Écris `retrouver(empreintes, dictionnaire)` qui renvoie un dictionnaire `{utilisateur: mot de passe}` pour ceux dont le mot de passe figure dans
la liste `dictionnaire`, en ne calculant **qu'une fois** l'empreinte de chaque mot du dictionnaire.

```python depart
import hashlib

def retrouver(empreintes, dictionnaire):
    ...
```

```python tests
import hashlib
h = lambda s: hashlib.sha256(s.encode()).hexdigest()
fuite = {"lea": h("soleil"), "hugo": h("azerty"), "ines": h("T7#qL!9z"), "noe": h("azerty")}
assert retrouver(fuite, ["123456", "azerty", "soleil", "motdepasse"]) == {"lea": "soleil", "hugo": "azerty", "noe": "azerty"}, "mots courants retrouvés"
assert retrouver(fuite, []) == {}, "dictionnaire vide"
```

:::corrige
```python solution
import hashlib

def retrouver(empreintes, dictionnaire):
    table = {hashlib.sha256(mot.encode()).hexdigest(): mot for mot in dictionnaire}
    return {u: table[e] for u, e in empreintes.items() if e in table}
```
On précalcule une table empreinte → mot, puis chaque recherche est un accès au dictionnaire. Sans sel, deux utilisateurs qui ont le même mot de
passe ont la même empreinte (hugo et noe), et une seule table sert pour toute la base. Avec un **sel** aléatoire par utilisateur, il faudrait
recalculer tout le dictionnaire **pour chaque** utilisateur ; avec une fonction **lente** (bcrypt), chaque essai coûte cher. Et un mot de passe
long et aléatoire (ines) n'est dans aucun dictionnaire.
:::
::::

::::exercice[Expliquer HTTPS en classe]{niveau=4 duree=25}
Un élève de terminale affirme : « Si on utilise RSA, qui est très sûr, pourquoi HTTPS ne chiffre-t-il pas tout avec RSA ? Et si quelqu'un intercepte
la clé publique du site, il peut déchiffrer ? »

1. Corrigez les deux idées fausses ou imprécises.
2. Expliquez le rôle de chacun des trois mécanismes utilisés par HTTPS.
3. Décrivez une attaque de l'« homme du milieu » et ce qui l'empêche en HTTPS.
4. Proposez une séquence de deux séances sur ce thème (objectifs, activités, évaluation).

:::criteres
- Corrections : RSA est lent (milliers de fois plus qu'AES) et limité en taille de message, d'où un chiffrement hybride ; la clé publique est faite pour être connue, elle ne permet pas de déchiffrer.
- Rôles : certificat + signature (authentifier le serveur), échange de clé (Diffie-Hellman ou chiffrement de la clé de session), chiffrement symétrique (confidentialité et intégrité des données).
- Homme du milieu : un intermédiaire se fait passer pour le serveur auprès du client et pour le client auprès du serveur ; le certificat signé par une autorité de confiance (et la signature de l'échange) l'empêche, sauf si l'utilisateur ignore l'alerte du navigateur.
- Séquence cohérente : manipulation (César, force brute, fréquences), cadenas/peinture, RSA jouet en Python, observation d'un certificat dans le navigateur ; évaluation sur un schéma d'échange à compléter ou expliquer.
:::

:::corrige
1. **« Tout chiffrer avec RSA »** : RSA est des milliers de fois plus lent qu'AES et ne chiffre que des nombres plus petits que $n$ ; chiffrer une
   page web ou une vidéo avec RSA serait beaucoup trop lent. On l'utilise (ou un équivalent sur courbes elliptiques) seulement pour
   **authentifier** et **établir une clé**, puis AES chiffre les données : c'est un chiffrement **hybride**. **« Intercepter la clé publique »** :
   elle est publique **par construction** ; elle permet de chiffrer et de vérifier des signatures, pas de déchiffrer. Le secret est la clé
   **privée**, qui ne quitte jamais le serveur.
2. **Certificat et signature** (asymétrique) : prouver que le serveur est bien `mabanque.fr` (authentification). **Échange de clé** (Diffie-Hellman) :
   construire une clé de session secrète commune sans la transmettre ; comme elle est nouvelle à chaque connexion, voler plus tard la clé privée
   du serveur ne permet pas de déchiffrer les échanges passés. **Chiffrement symétrique** (AES avec contrôle d'intégrité) : rendre les données
   illisibles et détecter toute modification en route.
3. **Homme du milieu** : un intermédiaire (Wi-Fi piégé) intercepte la connexion, se fait passer pour le serveur auprès du client et pour le client
   auprès du serveur ; il déchiffre, lit et rechiffre tout. En HTTPS, il ne peut pas présenter un certificat **valide** pour `mabanque.fr` (il
   faudrait la signature d'une autorité reconnue) ni signer l'échange avec la clé privée du vrai site : le navigateur affiche une alerte. L'attaque
   ne réussit que si l'utilisateur passe outre l'alerte, ou si une autorité de certification est compromise.
4. Séance 1 : **chiffrement symétrique** — chiffrer et casser César en Python (force brute, fréquences), Vigenère, puis poser le problème de
   l'échange de la clé. Séance 2 : **asymétrique et HTTPS** — analogie du cadenas, RSA jouet en Python, mélange de couleurs pour Diffie-Hellman,
   puis observation d'un vrai certificat dans le navigateur (cadenas → certificat : émetteur, validité, domaine). Évaluation : compléter un
   diagramme d'échange HTTPS en indiquant pour chaque message ce qui est chiffré, avec quelle clé, et pourquoi.
:::
::::
