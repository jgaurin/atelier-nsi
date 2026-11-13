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

Une recherche, une inscription, une connexion : chaque fois que tu envoies des informations à un site, tu utilises un **formulaire**.

## 1. Un formulaire en HTML

```html
<form action="/recherche" method="get">
  <input type="text" name="ville">
  <input type="submit" value="Chercher">
</form>
```

| Élément | Rôle |
| --- | --- |
| `action="/recherche"` | l'adresse à laquelle envoyer les données |
| `method="get"` | la façon de les envoyer : `get` ou `post` |
| `name="ville"` | le nom sous lequel la donnée du champ est envoyée |
| `type="submit"` | le bouton qui envoie le formulaire |

Un champ **sans** attribut `name` n'est pas envoyé : le serveur ne saurait pas comment l'appeler.

## 2. La méthode GET

Avec GET, les données sont ajoutées **à la fin de l'adresse**, après un `?`. Si tu tapes `Lyon` et que tu cliques sur « Chercher », le navigateur demande :

`/recherche?ville=Lyon`

Chaque donnée s'écrit `nom=valeur`. Plusieurs données sont séparées par `&` :

`/recherche?ville=Lyon&page=2`

L'adresse peut donc être mise en favori ou partagée : elle contient toute la recherche.

## 3. La méthode POST

Avec POST, les données sont placées **dans le corps de la requête**, et non dans l'adresse. Elles n'apparaissent ni dans la barre d'adresse, ni dans l'historique.

| | GET | POST |
| --- | --- | --- |
| Où sont les données ? | dans l'**adresse**, après le `?` | dans le **corps** de la requête |
| Visibles dans la barre d'adresse ? | oui | non |
| Quantité de données | limitée | grande |
| Usages | recherche, filtre, pages à partager | mot de passe, inscription, envoi de fichier |

## 4. POST n'est pas un chiffrement

:::attention
POST cache les données de la barre d'adresse, mais il ne les **chiffre pas** : quelqu'un qui écoute le réseau peut toujours les lire. Pour protéger un mot de passe, il faut **POST et HTTPS**.
:::

:::exemple
Un formulaire de connexion en GET enverrait `/connexion?identifiant=ana&mdp=1234` : le mot de passe resterait affiché dans la barre d'adresse et dans l'historique. On utilise donc POST, sur un site en HTTPS.
:::

## L'essentiel

- `action` : l'adresse de destination. `method` : get ou post. `name` : le nom de chaque donnée envoyée.
- GET : les données dans l'URL, `?nom=valeur&autre=valeur`. Pour consulter.
- POST : les données dans le corps de la requête. Pour les données sensibles ou volumineuses.
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

::::exercice[GET ou POST ?]{niveau=2}
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

::::exercice[Corriger un formulaire de connexion]{niveau=3}
Un site utilise ce formulaire :

```html
<form action="/connexion" method="get">
  <input type="text" name="identifiant">
  <input type="password" name="mdp">
  <input type="submit" value="Entrer">
</form>
```

1. On saisit `ana` et `1234`. Quelle adresse est demandée ?
2. Donne deux problèmes de sécurité que cela pose.
3. Quelle modification faut-il faire dans le code HTML ?
4. Cette modification suffit-elle à protéger le mot de passe sur le réseau ? Justifie.
5. Pourquoi GET reste-t-il adapté à une barre de recherche ?

:::criteres
- `/connexion?identifiant=ana&mdp=1234`.
- Le mot de passe apparaît dans l'adresse, l'historique ou les journaux du serveur.
- `method="post"`.
- Non : POST ne chiffre rien, il faut HTTPS.
- L'adresse d'une recherche peut être partagée ou mise en favori, et elle ne contient rien de sensible.
:::

:::corrige
1. `/connexion?identifiant=ana&mdp=1234`.
2. Le mot de passe s'affiche dans la barre d'adresse et reste dans l'historique du navigateur. Il peut aussi être enregistré dans les journaux du serveur.
3. On remplace par `method="post"`.
4. Non. POST place les données dans le corps de la requête, mais ne les chiffre pas. Il faut aussi utiliser **HTTPS**.
5. Une recherche ne contient pas de données sensibles, et son adresse peut être partagée ou mise en favori.
:::
::::
