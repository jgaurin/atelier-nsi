---
titre: URL, HTTP et client-serveur
resume: "Lire une adresse Web, comprendre une requête et savoir qui fait quoi."
duree: 30
objectifs:
  - "Décomposer l'URL d'une page"
  - "Reconnaître une page sécurisée"
  - "Décomposer une requête HTTP et ses paramètres"
  - "Distinguer ce qui s'exécute sur le client et sur le serveur"
prerequis: [snt-web/html-css]
---

Chaque page du Web a une adresse unique : son **URL**. Quand tu la tapes, ton navigateur dialogue avec une machine lointaine pour obtenir la page.

## 1. Lire une URL

`https://www.exemple.fr/cours/snt.html?page=2`

| Partie | Dans l'exemple | Sens |
| --- | --- | --- |
| **protocole** | `https` | la façon de communiquer |
| **nom de domaine** | `www.exemple.fr` | la machine, le serveur, à contacter |
| **chemin** | `/cours/snt.html` | la page demandée sur ce serveur |
| **paramètres** | `page=2` | des informations envoyées au serveur, après le `?` |

Plusieurs paramètres sont séparés par `&` : `?mot=chat&page=3`.

## 2. HTTP et HTTPS

**HTTP** est le protocole qui permet de demander et d'envoyer des pages. Avec HTTP, tout circule **en clair** : quelqu'un qui écoute le réseau, sur un Wi-Fi public par exemple, peut lire ce qui passe.

**HTTPS** est sa version sécurisée : les échanges sont **chiffrés**. Une page dont l'adresse commence par `https` est donc sécurisée. Elle est indispensable dès qu'on saisit un mot de passe ou un numéro de carte bancaire.

## 3. Le client et le serveur

Le **client** est l'application qui demande, en général ton navigateur. Le **serveur** est la machine qui répond.

1. Le client envoie une **requête HTTP**, qui précise la page voulue.
2. Le serveur renvoie la page. Elle peut être **stockée** telle quelle, ou **fabriquée** au moment de la demande, comme la page de tes notes.
3. Le client l'affiche, et exécute son éventuel programme JavaScript.

Une requête ressemble à ceci :

```
GET /cours/snt.html?page=2 HTTP/1.1
Host: www.exemple.fr
```

Elle se lit : « avec la méthode GET, je demande le chemin `/cours/snt.html` au serveur `www.exemple.fr`, avec le paramètre `page` qui vaut 2 ».

## 4. Qui exécute quoi ?

| Sur le client, ton navigateur | Sur le serveur |
| --- | --- |
| afficher la page | chercher des informations dans une base de données |
| exécuter le code JavaScript | exécuter le code PHP, ou un autre programme du site |

Dans le navigateur, on peut afficher le **code source** d'une page : on y voit le HTML et le JavaScript reçus. Le code PHP, lui, n'y apparaît jamais : il s'est exécuté sur le serveur, qui n'a envoyé que son résultat.

## L'essentiel

- Une URL contient un protocole, un nom de domaine, un chemin et éventuellement des paramètres.
- `https` : les échanges sont chiffrés.
- Le client envoie une requête, le serveur répond avec la page.
- JavaScript s'exécute sur le client, PHP sur le serveur.

## Exercices

::::exercice[Client ou serveur ?]{niveau=1 type=associer}
Indique où se déroule chaque action.

| Action | Lieu |
| --- | --- |
| Afficher la page | client |
| Chercher un produit dans la base de données | serveur |
| Exécuter le JavaScript de la page | client |
| Exécuter un programme PHP | serveur |
::::

::::exercice[Décomposer une URL]{niveau=1 type=completer}
Complète pour l'adresse `http://blog.exemple.org/articles/web.html?lang=fr`.

| Partie | Valeur |
| --- | --- |
| protocole | [[http]] |
| nom de domaine | [[blog.exemple.org]] |
| chemin | [[/articles/web.html]] |
| nom du paramètre | [[lang]] |
| valeur du paramètre | [[fr]] |
::::

::::exercice[Lire une requête]{niveau=2 type=reponses}
Voici une requête.

```
GET /recherche?mot=chat&page=3 HTTP/1.1
Host: www.exemple.fr
```

1. Quelle méthode est utilisée ?

   - GET

1. À quel serveur la requête est-elle adressée ?

   - www.exemple.fr

1. Quelle est la valeur du paramètre `mot` ?

   - chat

1. Combien de paramètres sont transmis ?

   - 2
::::

::::exercice[Un site de vente]{niveau=3}
Un élève visite `http://boutique.exemple.fr/panier.php?article=42`, puis saisit son numéro de carte bancaire sur cette page.

1. Décompose cette URL.
2. Quel paramètre est envoyé au serveur ? Avec quelle valeur ?
3. Pourquoi ne doit-il pas saisir son numéro de carte sur cette page ?
4. Le fichier se termine par `.php`. Le code PHP s'exécute-t-il sur son ordinateur ? Pourra-t-il le voir dans le code source de la page ?

:::criteres
- Protocole `http`, domaine `boutique.exemple.fr`, chemin `/panier.php`, paramètre `article=42`.
- Le paramètre `article`, de valeur 42.
- La page n'est pas chiffrée : les données peuvent être lues.
- PHP s'exécute sur le serveur, et n'apparaît pas dans le code source reçu.
:::

:::corrige
1. Protocole : `http`. Nom de domaine : `boutique.exemple.fr`. Chemin : `/panier.php`. Paramètre : `article=42`.
2. Le paramètre `article`, qui vaut 42.
3. L'adresse commence par `http` : les échanges ne sont pas chiffrés et peuvent être lus sur le réseau.
4. Non. Le PHP s'exécute sur le **serveur**. Le navigateur reçoit seulement le résultat : le code PHP n'apparaît pas dans le code source.
:::
::::
