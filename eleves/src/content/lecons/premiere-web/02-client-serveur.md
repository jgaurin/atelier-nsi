---
titre: Client, serveur et HTTP
resume: "Ce qui s'exécute dans le navigateur, ce qui s'exécute sur le serveur, ce qui est mémorisé, et quand les échanges sont chiffrés."
duree: 35
objectifs:
  - "Distinguer ce qui est exécuté sur le client et sur le serveur, et dans quel ordre"
  - "Distinguer ce qui est mémorisé dans le client et retransmis au serveur"
  - "Reconnaître quand et pourquoi la transmission est chiffrée"
prerequis: [premiere-web/evenements]
---

En seconde, tu as vu que le navigateur, le **client**, demande des pages à un **serveur**. Voyons précisément qui fait quoi, dans quel ordre, et ce que chacun mémorise.

## 1. L'échange, étape par étape

Quand tu ouvres la page de tes notes sur l'ENT :

1. Le **client** envoie une **requête HTTP** au serveur : « donne-moi `/notes` ».
2. Le **serveur** reçoit la requête. Il exécute un programme, en PHP ou en Python par exemple, qui va chercher tes notes dans une base de données.
3. Le serveur fabrique la page HTML et l'envoie dans une **réponse**, avec un code qui dit comment ça s'est passé.
4. Le client **affiche** la page, et exécute son éventuel JavaScript.

| Code | Sens |
| --- | --- |
| 200 | tout va bien, voici la page |
| 404 | la page demandée n'existe pas |
| 500 | le programme du serveur a rencontré une erreur |

Une page **statique** est un fichier envoyé tel quel. Une page **dynamique** est fabriquée par le serveur au moment de la requête : la page de tes notes n'est pas la même que celle de ton voisin.

## 2. Qui exécute quoi ?

| Sur le client, le navigateur | Sur le serveur |
| --- | --- |
| afficher le HTML et appliquer le CSS | exécuter le programme du site, en PHP ou en Python |
| exécuter le JavaScript de la page | lire et écrire dans la base de données |
| réagir aux clics | vérifier un mot de passe |

Quand tu affiches le code source d'une page, tu vois le HTML et le JavaScript reçus. Le code PHP, lui, n'apparaît jamais : il s'est exécuté sur le serveur, qui n'a envoyé que son résultat.

:::attention
Tout ce qui s'exécute sur le client peut être lu et modifié par l'utilisateur. Si un site vérifie en JavaScript qu'une note est entre 0 et 20, un utilisateur peut désactiver cette vérification et envoyer 25. Le serveur doit donc **toujours revérifier** ce qu'il reçoit.
:::

## 3. Ce que le client mémorise : les cookies

HTTP n'a pas de mémoire : chaque requête est traitée comme si c'était la première. Comment l'ENT sait-il que c'est toi, d'une page à l'autre ?

Après ta connexion, le serveur demande au navigateur de garder un petit texte, un **cookie**, par exemple `session=A81F`. Le navigateur le **stocke**, puis le **renvoie automatiquement au serveur à chaque requête** vers ce site. Le serveur le reconnaît : « c'est la session de cet élève ».

## 4. HTTPS : quand la transmission est chiffrée

Avec **HTTP**, les requêtes et les réponses circulent **en clair** : quelqu'un qui écoute le réseau, sur un Wi-Fi public par exemple, peut les lire. Avec **HTTPS**, tout est **chiffré**. On le reconnaît au `https://` au début de l'adresse.

Le chiffrement est indispensable dès qu'on transmet un mot de passe, des données personnelles ou un paiement.

## L'essentiel

- Le client envoie une requête, le serveur calcule et répond avec un code, le client affiche.
- JavaScript : sur le client. PHP, programme du site, base de données : sur le serveur.
- Le serveur doit revérifier tout ce qu'il reçoit.
- Un cookie est stocké par le client et renvoyé au serveur à chaque requête. HTTPS chiffre les échanges.

## Exercices

::::exercice[QCM : client et serveur]{niveau=1 type=quiz}
Une question à la fois : la correction s'affiche aussitôt.

1. Où s'exécute le JavaScript d'une page Web ?

   - [ ] sur le serveur
   - [x] dans le navigateur du client
   - [ ] sur le routeur
   - [ ] dans la base de données

   > Le serveur l'envoie comme un fichier, le navigateur l'exécute.

1. Que signifie le code de réponse 404 ?

   - [ ] tout va bien
   - [ ] erreur interne du serveur
   - [x] ressource introuvable
   - [ ] accès interdit

   > 200 OK, 403 interdit, 404 introuvable, 500 erreur du serveur.

1. Une page dynamique est :

   - [ ] une page avec des animations
   - [x] une page fabriquée par un programme sur le serveur au moment de la requête
   - [ ] une page qui contient du JavaScript
   - [ ] une page qui change de couleur

   > Dynamique au sens « générée côté serveur », par exemple à partir d'une base de données.

1. Pourquoi le serveur doit-il revérifier les données d'un formulaire déjà vérifiées en JavaScript ?

   - [ ] parce que JavaScript fait des erreurs de calcul
   - [x] parce que l'utilisateur peut contourner ou modifier le code exécuté chez lui
   - [ ] parce que HTTP perd des données
   - [ ] ce n'est pas nécessaire

   > Tout ce qui s'exécute sur le client est sous le contrôle de l'utilisateur.

1. Que garantit le cadenas HTTPS ?

   - [ ] que le site est honnête
   - [x] que les échanges sont chiffrés et que le serveur possède un certificat pour ce nom de domaine
   - [ ] que le site n'a pas de virus
   - [ ] que les données ne sont pas stockées

   > Un site frauduleux peut avoir HTTPS : le cadenas ne dit rien de ses intentions.
::::

::::exercice[Client ou serveur ?]{niveau=1 type=associer}
Où chaque action se déroule-t-elle ? Réponds pour un site comme un ENT.

| Action | Lieu |
| --- | --- |
| Afficher un menu animé en JavaScript | client |
| Chercher tes notes dans la base de données | serveur |
| Vérifier ton mot de passe | serveur |
| Stocker le cookie de connexion | client |
::::

::::exercice[Dans quel ordre ?]{niveau=1 type=ordre}
Remets dans l'ordre ce qui se passe quand tu ouvres la page de tes notes.

1. Le navigateur envoie une requête HTTP au serveur.
1. Le serveur vérifie qui tu es grâce au cookie reçu.
1. Le serveur va chercher tes notes dans la base de données.
1. Le serveur fabrique la page et l'envoie.
1. Le navigateur affiche la page.
::::

::::exercice[Lire une requête]{niveau=2 type=reponses}
Voici le début d'une requête.

```
GET /eleves/fiche.php?id=42 HTTP/1.1
Host: www.exemple.fr
Cookie: session=A81F
```

1. Quelle méthode HTTP est utilisée ?

   - GET

1. Quel est le nom du paramètre transmis ?

   - id

1. Quelle est sa valeur ?

   - 42

1. Quelle information prouve au serveur que tu es déjà connecté ?

   - le cookie
   - cookie
   - session=A81F
::::

::::exercice[Une boutique en ligne]{niveau=3}
Une boutique en ligne garde le panier du visiteur dans un cookie, sous la forme `article=velo; prix=300`. Au paiement, le serveur lit ce cookie pour connaître le montant à payer. Le site utilise l'adresse `http://boutique.exemple`.

1. Pourquoi le site a-t-il besoin d'un cookie pour se souvenir du visiteur d'une page à l'autre ?
2. Où ce cookie est-il stocké ? Quand est-il transmis ?
3. Explique comment un utilisateur peut payer moins cher. Comment corriger ce problème ?
4. Quel danger présente le paiement sur ce site ? Comment le supprimer ?
5. Une page affiche le code 500, une autre le code 404. Dans chaque cas, qui faut-il corriger, et quoi ?

:::criteres
- HTTP ne garde pas la mémoire des requêtes.
- Le cookie est stocké par le client et renvoyé à chaque requête vers ce site.
- Le client peut modifier le cookie : le prix doit venir du serveur.
- Sans HTTPS, les données circulent en clair.
- 500 : erreur du serveur. 404 : adresse introuvable.
:::

:::corrige
1. HTTP ne garde pas la mémoire des requêtes précédentes.
2. Il est stocké par le **navigateur**, qui le renvoie au serveur à chaque requête vers ce site.
3. Tout ce qui est sur le client peut être modifié : il suffit de changer `prix=300` en `prix=1`. Le serveur doit retrouver lui-même le prix dans sa base de données, à partir de l'article.
4. Sans chiffrement, quelqu'un qui écoute le réseau peut lire les données de paiement. Il faut utiliser **HTTPS**.
5. 500 : une erreur du programme côté serveur, à corriger sur le site. 404 : la page demandée n'existe pas ; il faut corriger le lien ou l'adresse.
:::
::::
