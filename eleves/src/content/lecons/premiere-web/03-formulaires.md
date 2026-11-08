---
titre: "Les formulaires : GET et POST"
resume: "Comment les données d'un formulaire sont envoyées au serveur, et comment choisir entre GET et POST."
duree: 30
objectifs:
  - "Analyser le fonctionnement d'un formulaire simple"
  - "Distinguer les transmissions par GET et par POST"
  - "Choisir la bonne méthode selon les données à envoyer"
prerequis: [premiere-web/client-serveur]
---

Un **formulaire** permet d'envoyer des informations à un serveur : une recherche, une inscription, une connexion.

## 1. Un formulaire

```html
<form action="/recherche" method="get">
  <input type="text" name="ville">
  <input type="submit" value="Chercher">
</form>
```

- `action` : l'adresse à laquelle envoyer les données ;
- `method` : la méthode, `get` ou `post` ;
- `name` : le nom de chaque donnée envoyée. Un champ sans `name` n'est pas envoyé.

## 2. GET et POST

| | GET | POST |
| --- | --- | --- |
| Où sont les données ? | dans l'**URL**, après le `?` | dans le **corps** de la requête |
| Visibles dans l'adresse ? | oui | non |
| Taille | limitée | grande |
| Usage | recherche, filtre | mot de passe, fichier, inscription |

Avec GET, si on tape `Lyon` : `/recherche?ville=Lyon`. Plusieurs paramètres sont séparés par `&` : `?ville=Lyon&page=2`.

:::attention
POST ne chiffre rien : il cache seulement les données de l'adresse. Pour protéger un mot de passe, il faut aussi **HTTPS**.
:::

## L'essentiel

- `name` donne le nom de la donnée, `action` la destination, `method` la méthode.
- GET : paramètres dans l'URL. POST : paramètres dans le corps de la requête.
- GET pour consulter, POST pour envoyer des données sensibles ou volumineuses.
- Seul HTTPS chiffre les échanges.

## Exercices

::::exercice[QCM : formulaires]{niveau=1 type=quiz}
Une question à la fois : la correction s'affiche aussitôt.

1. Avec un formulaire en GET, où sont transmis les paramètres ?

   - [x] dans l'URL, après le `?`
   - [ ] dans le corps de la requête, cachés
   - [ ] dans un cookie
   - [ ] ils ne sont pas transmis

   > Exemple : `/recherche?q=nsi&page=2`.

1. Pour envoyer un mot de passe, on utilise de préférence :

   - [ ] GET, car c'est plus rapide
   - [x] POST, et surtout HTTPS
   - [ ] GET avec HTTPS, car l'URL est chiffrée et ne reste nulle part
   - [ ] peu importe

   > Avec GET, le mot de passe resterait dans l'historique et les journaux du serveur. HTTPS chiffre l'échange.

1. Quelle URL correspond au formulaire `<form action="/cherche" method="get">` avec un champ `name="ville"` rempli par « Lyon » ?

   - [ ] `/cherche/Lyon`
   - [x] `/cherche?ville=Lyon`
   - [ ] `/cherche?Lyon=ville`
   - [ ] `/cherche#ville=Lyon`

   > Les paramètres sont des couples `name=valeur`.

1. Un champ de formulaire n'a pas d'attribut `name`. Que se passe-t-il à l'envoi ?

   - [ ] le formulaire ne s'envoie pas
   - [x] sa valeur n'est pas transmise
   - [ ] sa valeur est transmise sous le nom « champ »
   - [ ] une erreur 500

   > Le navigateur n'envoie que les champs nommés.

::::

::::exercice[Quelle URL ?]{niveau=1 type=reponses}
On considère ce formulaire, méthode `get`, `action="/cherche"`, avec deux champs nommés `sport` et `ville`. On saisit `judo` et `Nantes`.

1. Quelle est l'adresse demandée ? Écris-la en partant de `/cherche`, avec `sport` en premier.

   - /cherche?sport=judo&ville=Nantes

1. Combien de paramètres sont envoyés ?

   - 2

1. Quel caractère sépare les paramètres ?

   - &

1. Quel caractère sépare l'adresse des paramètres ?

   - ?
::::

::::exercice[Compléter un formulaire]{niveau=2 type=completer}
On veut un formulaire de connexion qui envoie un identifiant et un mot de passe à l'adresse `/login`, sans les faire apparaître dans l'URL. Complète.

```html trous
<form action="[[/login]]" method="[[post]]">
  <input type="text" name="identifiant">
  <input type="[[password]]" name="mdp">
  <input type="submit" value="Se connecter">
</form>
```
::::

::::exercice[GET ou POST ?]{niveau=1}
Pour chacun de ces formulaires, choisis GET ou POST et justifie en une phrase : (a) la barre de recherche d'un site de recettes ; (b) la
connexion à l'ENT ; (c) le filtre « prix croissant » d'une boutique en ligne ; (d) l'envoi d'une photo de profil ; (e) le formulaire de
commande avec adresse de livraison.

:::criteres
- (a) et (c) en GET : pas de donnée sensible, et on veut pouvoir partager ou mettre en favori le résultat.
- (b), (d) et (e) en POST : données sensibles, volumineuses ou action qui modifie des données sur le serveur.
- Mention de HTTPS pour les données sensibles.
:::

:::corrige
(a) **GET** : la recherche n'est pas secrète, et l'URL `?q=crepes` peut être partagée ou mise en favori. (b) **POST** (et HTTPS) : le mot de
passe ne doit pas apparaître dans l'URL ni dans l'historique. (c) **GET** : un filtre est une simple consultation, on veut pouvoir partager le
lien. (d) **POST** : une photo est trop volumineuse pour une URL. (e) **POST** (et HTTPS) : données personnelles, et l'action crée une commande
sur le serveur. Règle simple : GET pour **consulter**, POST pour **envoyer** ou **modifier**, HTTPS dès qu'il y a des données personnelles.
:::
::::
