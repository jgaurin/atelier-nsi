---
titre: Sécuriser les communications
resume: "Chiffrement symétrique, chiffrement asymétrique, et comment HTTPS combine les deux."
duree: 40
objectifs:
  - "Décrire les principes du chiffrement symétrique et asymétrique"
  - "Décrire l'échange d'une clé symétrique pour sécuriser HTTPS"
---

Sur Internet, les données traversent des réseaux que l'on ne contrôle pas. Pour les protéger, on les **chiffre**.

## 1. Chiffrement symétrique

La **même clé** sert à chiffrer et à déchiffrer. C'est rapide, mais il faut **partager cette clé** secrètement au préalable.

:::exemple
Chiffre de César avec un décalage de 3 : `A` devient `D`, `B` devient `E`. La clé est 3.
:::

## 2. Chiffrement asymétrique

Deux clés liées :

- la **clé publique**, connue de tous, sert à **chiffrer** ;
- la **clé privée**, gardée secrète, sert à **déchiffrer**.

Pour écrire à Bob, Alice chiffre avec la **clé publique de Bob**. Seul Bob peut lire.

La clé privée ne circule jamais : c'est plus sûr pour démarrer un échange. En revanche, c'est **beaucoup plus lent**.

## 3. HTTPS

1. Le serveur envoie son **certificat**, qui contient sa clé publique.
2. Le navigateur vérifie le certificat.
3. Le navigateur crée une **clé de session** et l'envoie chiffrée avec la clé publique du serveur.
4. Tout le reste de l'échange est chiffré en **symétrique** avec cette clé.

Le certificat empêche un intermédiaire de se faire passer pour le serveur.

## L'essentiel

- Symétrique : une seule clé partagée, rapide.
- Asymétrique : clé publique pour chiffrer, clé privée pour déchiffrer.
- HTTPS : l'asymétrique sert à échanger une clé de session, puis on chiffre en symétrique.

## Exercices

::::exercice[QCM : chiffrement]{niveau=1 type=quiz}
Une question à la fois : la correction s'affiche aussitôt.

1. Dans un chiffrement symétrique :

   - [x] la même clé sert à chiffrer et à déchiffrer
   - [ ] il y a une clé publique et une clé privée
   - [ ] il n'y a pas de clé
   - [ ] seul le destinataire a une clé

   > Émetteur et destinataire partagent le même secret.

1. Alice veut envoyer un message secret à Bob avec un chiffrement asymétrique. Elle chiffre avec :

   - [ ] sa clé privée
   - [ ] sa clé publique
   - [x] la clé publique de Bob
   - [ ] la clé privée de Bob

   > Seul Bob, avec sa clé privée, pourra déchiffrer.

1. La clé publique :

   - [ ] doit rester secrète
   - [x] peut être diffusée à tout le monde
   - [ ] sert à déchiffrer
   - [ ] change à chaque message

   > C'est la clé privée qui reste secrète.

1. Pourquoi HTTPS n'utilise-t-il pas l'asymétrique pour tout l'échange ?

   - [ ] parce qu'il est moins sûr
   - [x] parce qu'il est beaucoup plus lent
   - [ ] parce que les navigateurs ne le connaissent pas
   - [ ] parce qu'il ne chiffre que les nombres

   > On l'utilise seulement pour établir la clé de session.

1. Dans HTTPS, à quoi sert le chiffrement asymétrique ?

   - [x] à échanger de façon sûre une clé de session symétrique
   - [ ] à chiffrer les images
   - [ ] à compresser les pages
   - [ ] à choisir le routeur

   > Ensuite, l'échange se fait en symétrique.
::::

::::exercice[Chiffrer à la main]{niveau=1 type=reponses}
On utilise le chiffre de César.

1. Chiffre `NSI` avec un décalage de 3.

   ```python calcul
   print("".join(chr((ord(c) - 65 + 3) % 26 + 65) for c in "NSI"))
   ```

   - QVL

1. Déchiffre `EDF` avec un décalage de 3.

   ```python calcul
   print("".join(chr((ord(c) - 65 - 3) % 26 + 65) for c in "EDF"))
   ```

   - BAC

1. Combien de décalages utiles faut-il essayer au plus pour casser ce chiffrement ?

   - 25
::::

::::exercice[Les étapes de HTTPS]{niveau=2 type=ordre}
Remets dans l'ordre l'établissement d'une connexion HTTPS.

1. Le serveur envoie son certificat, avec sa clé publique.
1. Le navigateur vérifie le certificat.
1. Le navigateur crée une clé de session.
1. Il l'envoie, chiffrée avec la clé publique du serveur.
1. Le serveur la déchiffre avec sa clé privée.
1. Les échanges se font ensuite en chiffrement symétrique.
::::

::::exercice[Expliquer HTTPS]{niveau=2}
Explique à un camarade, sans formule, ce qui se passe quand il se connecte à `https://ent.exemple.fr`, depuis la saisie de l'adresse jusqu'à l'envoi
de son mot de passe. Utilise une image (cadenas, coffre…) pour le chiffrement asymétrique, et dis pourquoi on ne chiffre pas tout en
asymétrique.

:::criteres
- Le serveur envoie son certificat avec sa clé publique ; le navigateur vérifie le certificat (autorité de certification).
- Le navigateur crée une clé de session, l'envoie chiffrée avec la clé publique ; seul le serveur (clé privée) peut la lire.
- Ensuite, chiffrement symétrique rapide ; le mot de passe voyage chiffré.
- Image correcte (cadenas ouvert distribué, clé gardée) et raison : l'asymétrique est lent.
:::

:::corrige
Quand tu tapes l'adresse, ton navigateur contacte le serveur de l'ENT, qui lui envoie sa **carte d'identité numérique** : le **certificat**. Il
contient sa **clé publique**, et il est signé par un organisme de confiance que ton navigateur connaît : le navigateur vérifie qu'il parle bien
au vrai `ent.exemple.fr`. Imagine que la clé publique est un **cadenas ouvert** que le serveur distribue à tout le monde : n'importe qui peut
fermer une boîte avec, mais seul le serveur a la **clé** (la clé privée) pour l'ouvrir. Ton navigateur invente alors un **code secret**
aléatoire (la clé de session), le met dans une boîte, la ferme avec le cadenas du serveur et l'envoie : même si quelqu'un intercepte la boîte, il
ne peut pas l'ouvrir. Maintenant, ton navigateur et le serveur connaissent tous les deux ce code secret, et l'utilisent pour chiffrer tout le
reste de l'échange en **symétrique**, dont ton **mot de passe**. Pourquoi ne pas tout faire avec le cadenas ? Parce que le chiffrement
asymétrique est environ **mille fois plus lent** : on ne l'utilise que pour s'échanger le code secret.
:::
::::

::::exercice[Alice, Bob et Ève]{niveau=3}
Alice veut envoyer un message secret à Bob, qu'elle n'a jamais rencontré. Ève écoute tout ce qui passe sur le réseau.

1. Alice et Bob utilisent le chiffre de César. Pourquoi ce choix est-il doublement mauvais ?
2. Alice chiffre maintenant avec la clé publique de Bob. Ève intercepte le message et connaît cette clé publique. Peut-elle lire le message ? Justifie.
3. Ève réussit à donner à Alice sa propre clé publique, en la faisant passer pour celle de Bob. Que peut-elle faire ? Quel élément de HTTPS empêche cette attaque ?
4. Pourquoi Alice et Bob ne chiffrent-ils pas toute leur conversation en asymétrique ? Que font-ils à la place ?

:::criteres
- César : clé à partager au préalable, et seulement 25 décalages utiles à essayer.
- Non : seule la clé privée de Bob déchiffre.
- Attaque de l'homme du milieu, évitée par le certificat.
- L'asymétrique est trop lent : il sert à échanger une clé symétrique.
:::

:::corrige
1. Il faut partager la clé au préalable, ce qu'Alice et Bob ne peuvent pas faire en secret. De plus, il n'y a que 25 décalages utiles : on les essaie tous très vite.
2. Non. La clé publique sert seulement à chiffrer ; seule la **clé privée** de Bob déchiffre, et elle ne circule jamais.
3. Ève lit le message avec sa clé privée, puis le chiffre avec la vraie clé de Bob et le transmet : c'est l'attaque de l'**homme du milieu**. Le **certificat** permet de vérifier que la clé appartient bien au serveur annoncé.
4. L'asymétrique est beaucoup plus lent. Il sert seulement à échanger une **clé de session**, puis toute la conversation est chiffrée en **symétrique**.
:::
::::
