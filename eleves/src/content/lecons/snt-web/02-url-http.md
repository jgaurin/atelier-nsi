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

Chaque page a une adresse unique : son **URL**.

## 1. Lire une URL

`https://www.exemple.fr/cours/snt.html?page=2`

| Partie | Exemple | Sens |
| --- | --- | --- |
| protocole | `https` | la façon de communiquer |
| nom de domaine | `www.exemple.fr` | le serveur |
| chemin | `/cours/snt.html` | la ressource demandée |
| paramètres | `page=2` | des valeurs envoyées au serveur |

**HTTPS** chiffre les échanges : une page dont l'adresse commence par `https` est sécurisée. **HTTP** ne chiffre rien.

## 2. Le client et le serveur

Le **client** est l'application qui demande, souvent un navigateur. Le **serveur** est la machine qui répond.

1. Le client envoie une **requête HTTP**.
2. Le serveur renvoie une page, stockée ou créée à ce moment.
3. Le client l'affiche, et exécute son éventuel JavaScript.

```
GET /cours/snt.html?page=2 HTTP/1.1
Host: www.exemple.fr
```

Cette requête utilise la méthode `GET`, demande le chemin `/cours/snt.html` et transmet le paramètre `page`, de valeur 2.

## 3. Qui exécute quoi ?

| Sur le client | Sur le serveur |
| --- | --- |
| affichage de la page | recherche dans une base de données |
| code JavaScript | code PHP |

Dans le navigateur, le **code source** d'une page montre le HTML reçu. Le code exécuté sur le serveur n'y apparaît pas.

## L'essentiel

- URL : protocole, nom de domaine, chemin, paramètres.
- `https` : échanges chiffrés.
- Le client demande, le serveur répond.
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
