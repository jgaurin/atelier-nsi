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

En seconde, tu as vu que le navigateur (le **client**) demande une page à un **serveur**. Voyons qui fait quoi, et dans quel ordre.

## 1. L'échange

1. Le **client** envoie une **requête HTTP** : `GET /notes.html`.
2. Le **serveur** reçoit la requête, fait ses calculs, consulte éventuellement une base de données.
3. Le serveur envoie une **réponse** : un code et le contenu de la page.
4. Le client **affiche** la page et exécute son JavaScript.

| Code | Sens |
| --- | --- |
| 200 | tout va bien |
| 404 | page introuvable |
| 500 | erreur du serveur |

## 2. Client ou serveur ?

| Sur le client | Sur le serveur |
| --- | --- |
| affichage HTML et CSS | programmes PHP ou Python du site |
| JavaScript de la page | accès à la base de données |
| réaction aux clics | vérification du mot de passe |

Une page **statique** est envoyée telle quelle. Une page **dynamique** est fabriquée par le serveur au moment de la requête.

:::attention
Tout ce qui s'exécute sur le client peut être lu et modifié par l'utilisateur. Le serveur doit donc toujours **revérifier** ce qu'il reçoit.
:::

## 3. Ce que le client mémorise : les cookies

HTTP ne garde pas la mémoire des requêtes précédentes. Pour te reconnaître, le serveur demande au navigateur de conserver un petit texte, le **cookie**. Le navigateur le **stocke**, puis le **renvoie au serveur à chaque requête** vers ce site.

## 4. HTTPS

Avec **HTTPS**, les échanges sont **chiffrés** : on le reconnaît au `https://` dans l'adresse. Il protège les mots de passe et les données personnelles de quiconque écoute le réseau.

## L'essentiel

- Le client envoie une requête, le serveur calcule et répond, le client affiche.
- JavaScript de la page : client. PHP, Python du site, base de données : serveur.
- Un **cookie** est stocké par le client et renvoyé au serveur à chaque requête.
- **HTTPS** chiffre les échanges.

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
