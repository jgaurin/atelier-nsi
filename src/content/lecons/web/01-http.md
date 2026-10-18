---
titre: "Le Web : URL, HTTP et client-serveur"
resume: Comprendre ce qui se passe quand on ouvre une page web — URL, nom de domaine, requêtes et réponses HTTP, méthodes GET et POST, codes de statut, cookies et HTTPS.
duree: 60
objectifs:
  - Décomposer une URL (protocole, hôte, port, chemin, paramètres, ancre)
  - Décrire le modèle client-serveur et les étapes du chargement d'une page
  - Lire une requête et une réponse HTTP (méthode, en-têtes, corps, code de statut)
  - Distinguer GET et POST, expliquer le rôle des cookies et de HTTPS
prerequis: [python/chaines, python/tuples-dictionnaires]
programme: [id-web, id-client-serveur, nsi1-web, snt-web]
cartes:
  - q: Web ou Internet ?
    r: "**Internet** est le réseau mondial d'ordinateurs (années 1970-1980) ; le **Web** est un service qui l'utilise : des pages reliées par des liens hypertextes, accessibles par HTTP (Tim Berners-Lee, CERN, 1989-1991)."
  - q: Les parties de `https://www.exemple.fr:8443/cours/page.html?id=3&mode=nuit#exos` ?
    r: "Protocole `https`, hôte `www.exemple.fr`, port `8443`, chemin `/cours/page.html`, paramètres (query) `id=3&mode=nuit`, ancre (fragment) `exos`."
  - q: GET ou POST ?
    r: "GET demande une ressource, les paramètres sont dans l'URL (visibles, mis en favori, mis en cache). POST envoie des données dans le **corps** de la requête (formulaire, données volumineuses ou sensibles)."
  - q: Codes HTTP 200, 301, 404, 500 ?
    r: "200 : OK ; 301 : déplacé définitivement (redirection) ; 404 : ressource introuvable ; 500 : erreur interne du serveur. Familles : 2xx succès, 3xx redirection, 4xx erreur du client, 5xx erreur du serveur."
  - q: Pourquoi des cookies ?
    r: "HTTP est **sans état** : le serveur ne se souvient pas des requêtes précédentes. Il envoie un cookie (`Set-Cookie`) que le navigateur renvoie à chaque requête (`Cookie`), ce qui permet de garder une session."
  - q: Que garantit HTTPS ?
    r: "HTTP chiffré par TLS : **confidentialité** (contenu illisible en chemin), **intégrité** (non modifié) et **authentification du serveur** (certificat)."
  - q: Rôle du DNS dans le chargement d'une page ?
    r: "Traduire le nom de domaine (`www.exemple.fr`) en adresse IP, avant d'ouvrir la connexion vers le serveur."
---

Taper une adresse et voir une page s'afficher prend moins d'une seconde, mais met en jeu une chaîne d'acteurs : navigateur, serveur
de noms, réseau, serveur web. Cette leçon décrit le **modèle client-serveur** et le protocole **HTTP**, qui sont au programme de SNT
(le Web), de première NSI (interactions client-serveur, requêtes HTTP, formulaires) et du concours.

## 1. Le Web et le modèle client-serveur

:::definition
- Le **Web** (World Wide Web) est un système de **documents reliés par des liens hypertextes**, inventé par Tim Berners-Lee au CERN
  (proposition en 1989, premier site en 1991). Il repose sur trois piliers : les **URL** (adresses), le langage **HTML** (pages) et
  le protocole **HTTP** (échanges).
- Dans le modèle **client-serveur**, un **client** (le navigateur) envoie une **requête** à un **serveur** (programme qui attend
  des requêtes sur une machine), qui renvoie une **réponse**. Le serveur répond à de nombreux clients.
:::

```mermaid legende="Ce qui se passe quand on ouvre https://www.exemple.fr/cours/"
sequenceDiagram
  participant N as Navigateur (client)
  participant D as Serveur DNS
  participant S as Serveur web
  N->>D: Quelle est l'adresse IP de www.exemple.fr ?
  D-->>N: 93.184.215.14
  N->>S: connexion TCP (port 443) + négociation TLS
  N->>S: GET /cours/ HTTP/1.1
  S-->>N: HTTP/1.1 200 OK + page HTML
  N->>S: GET /style.css, GET /logo.png, GET /script.js
  S-->>N: 200 OK (×3)
  Note over N: le navigateur construit et affiche la page
```

Une page web n'est presque jamais un seul fichier : le HTML référence des feuilles de style, des images, des scripts, que le navigateur
demande ensuite, chacun par **une requête**.

## 2. Les URL

```python exec
from urllib.parse import urlsplit, parse_qs

url = "https://www.exemple.fr:8443/cours/page.html?id=3&mode=nuit#exos"
u = urlsplit(url)
print("protocole :", u.scheme)
print("hôte      :", u.hostname)
print("port      :", u.port)
print("chemin    :", u.path)
print("paramètres:", parse_qs(u.query))
print("ancre     :", u.fragment)
```

| Partie | Exemple | Rôle |
|---|---|---|
| protocole (schéma) | `https` | comment dialoguer (`http` port 80 par défaut, `https` port 443) |
| hôte | `www.exemple.fr` | quelle machine (nom traduit en IP par le DNS) |
| port | `8443` | quel programme sur la machine (facultatif) |
| chemin | `/cours/page.html` | quelle ressource sur le serveur |
| paramètres | `?id=3&mode=nuit` | données transmises (paires `clé=valeur` séparées par `&`) |
| ancre | `#exos` | position dans la page, **jamais envoyée** au serveur |

Les caractères spéciaux (espaces, accents, `&`…) sont **encodés** : un espace devient `%20` ou `+`, « é » devient `%C3%A9` (ses deux
octets UTF-8 en hexadécimal).

## 3. Le protocole HTTP

HTTP est un protocole **texte** : une requête et une réponse sont des lignes de texte (en HTTP/1.1), suivies éventuellement d'un corps.

```text
GET /cours/page.html?id=3 HTTP/1.1          ← ligne de requête : méthode, chemin, version
Host: www.exemple.fr                         ← en-têtes (clé: valeur)
User-Agent: Mozilla/5.0 (…)
Accept: text/html
Accept-Language: fr-FR
Cookie: session=a8f3k2
                                             ← ligne vide : fin des en-têtes
```

```text
HTTP/1.1 200 OK                              ← ligne de statut : version, code, message
Content-Type: text/html; charset=utf-8
Content-Length: 1534
Set-Cookie: theme=sombre; Max-Age=31536000

<!DOCTYPE html>                              ← corps : le document demandé
<html lang="fr"> …
```

### Les méthodes

| Méthode | Usage | Données envoyées |
|---|---|---|
| `GET` | obtenir une ressource | dans l'URL (`?a=1&b=2`) |
| `POST` | envoyer des données (formulaire, création) | dans le **corps** |
| `PUT` / `DELETE` | remplacer / supprimer une ressource (API) | corps / aucune |

Un **formulaire** HTML choisit sa méthode : `<form action="/inscription" method="post">`. Avec GET, les champs apparaissent dans
l'URL : à proscrire pour un mot de passe (historique, journaux du serveur). Mais POST n'est **pas** chiffré pour autant : seul HTTPS
protège le contenu.

### Les codes de statut

| Famille | Sens | Exemples |
|---|---|---|
| 1xx | information | 101 changement de protocole |
| 2xx | succès | **200 OK**, 201 créé, 204 pas de contenu |
| 3xx | redirection | **301** déplacé définitivement, 302 trouvé ailleurs, **304** non modifié (cache) |
| 4xx | erreur du **client** | 400 requête invalide, 401 non authentifié, **403** interdit, **404** introuvable |
| 5xx | erreur du **serveur** | **500** erreur interne, 503 service indisponible |

## 4. Un protocole sans état : cookies et sessions

Chaque requête HTTP est **indépendante** : le serveur ne sait pas que deux requêtes viennent du même navigateur. Pour qu'un site
« se souvienne » de nous (panier, connexion), le serveur envoie un **cookie** :

```mermaid legende="Une session par cookie : le navigateur renvoie le jeton à chaque requête"
sequenceDiagram
  participant N as Navigateur
  participant S as Serveur
  N->>S: POST /connexion (identifiant, mot de passe)
  S-->>N: 302 vers /accueil + Set-Cookie: session=a8f3k2
  N->>S: GET /accueil + Cookie: session=a8f3k2
  Note over S: session a8f3k2 → utilisatrice « lea »
  S-->>N: 200 « Bonjour Léa »
```

:::attention[Sécurité]
Celui qui vole le cookie de session usurpe la session : d'où **HTTPS** (le cookie circule chiffré) et les attributs `Secure` (envoyé
uniquement en HTTPS) et `HttpOnly` (inaccessible au JavaScript de la page). Les cookies **tiers** (déposés par un autre site que
celui visité, via une publicité par exemple) servent au pistage : c'est un thème de SNT (RGPD, consentement).
:::

## 5. HTTPS

HTTPS = HTTP transporté dans une connexion **TLS**. Le serveur présente un **certificat** signé par une autorité de certification, qui
prouve qu'il est bien `www.exemple.fr` ; client et serveur établissent une clé de session (chiffrement asymétrique pour l'échange de
clé, puis symétrique pour les données). On obtient : confidentialité, intégrité, authentification du serveur (détails dans la leçon
« Sécurité » du module Réseaux).

:::prof
En SNT, le thème « Le Web » demande de connaître les étapes d'une requête, de distinguer Internet et Web, de décomposer une URL et
d'aborder les moteurs de recherche et la confidentialité. En première NSI, on fait **observer** des requêtes réelles : l'onglet
« Réseau » des outils de développement du navigateur (F12) montre chaque requête, ses en-têtes, son code de statut et son temps.
Faire comparer un formulaire GET et POST dans cet onglet est très parlant.
:::

## Exemple guidé

**Problème.** Écrire une fonction qui analyse une réponse HTTP brute (texte) et renvoie le code de statut, les en-têtes (dictionnaire,
noms en minuscules) et le corps.

**1. Repérer la structure.** Ligne de statut, en-têtes jusqu'à la **ligne vide**, puis le corps. Les lignes se terminent par `\r\n`
(retour chariot + saut de ligne) dans le protocole.

```python exec
def analyser_reponse(brut):
    entete, _, corps = brut.partition("\r\n\r\n")     # la première ligne vide sépare
    lignes = entete.split("\r\n")
    version, code, message = lignes[0].split(" ", 2)
    en_tetes = {}
    for ligne in lignes[1:]:
        nom, _, valeur = ligne.partition(":")
        en_tetes[nom.strip().lower()] = valeur.strip()
    return int(code), en_tetes, corps

brut = ("HTTP/1.1 404 Not Found\r\n"
        "Content-Type: text/html; charset=utf-8\r\n"
        "Content-Length: 22\r\n"
        "\r\n"
        "<h1>Introuvable</h1>\r\n")
code, en_tetes, corps = analyser_reponse(brut)
print(code, en_tetes["content-type"], repr(corps))
```

**2. Les choix.** `partition` coupe à la **première** occurrence : un corps qui contient lui-même une ligne vide reste intact.
`split(" ", 2)` limite à deux coupures : le message (« Not Found ») peut contenir des espaces. Les noms d'en-têtes ne sont pas
sensibles à la casse, d'où `lower()`.

## L'essentiel

- Web = documents hypertextes (URL + HTML + HTTP) au-dessus d'Internet ; modèle **client-serveur** : requête → réponse.
- URL : protocole, hôte, port, chemin, paramètres `?k=v&…`, ancre `#…` (non envoyée) ; DNS traduit le nom en adresse IP.
- HTTP (texte en 1.1) : requête = méthode + chemin + en-têtes (+ corps) ; réponse = code de statut + en-têtes + corps.
- GET : paramètres dans l'URL ; POST : données dans le corps ; aucun des deux n'est chiffré sans HTTPS.
- Codes : 2xx succès, 3xx redirection, 4xx erreur client (404, 403), 5xx erreur serveur (500).
- HTTP est **sans état** : sessions par cookies ; HTTPS = HTTP + TLS (confidentialité, intégrité, authentification du serveur).

## Exercices

::::exercice[Internet ou Web ?]{niveau=1}
Laquelle de ces affirmations est exacte ?

- [ ] Le Web et Internet sont deux noms de la même chose
- [x] Le Web est un service qui fonctionne grâce à Internet, comme le courrier électronique
- [ ] Internet a été inventé par Tim Berners-Lee en 1991
- [ ] Le Web n'utilise pas le protocole HTTP

:::corrige
Internet est l'infrastructure (réseau de réseaux, protocole IP) ; le Web, le courriel, la visioconférence sont des **services** qui
l'utilisent. Tim Berners-Lee a inventé le Web (1989-1991), pas Internet.
:::
::::

::::exercice[Lire un code de statut]{niveau=1}
Un élève obtient `403 Forbidden` en ouvrant une page de l'ENT. Que signifie ce code ?

- [ ] La page n'existe pas
- [x] Le serveur a compris la requête mais refuse l'accès à cette ressource
- [ ] Le serveur est en panne
- [ ] La page a été déplacée

:::corrige
Les 4xx sont des erreurs côté client ; 403 = interdit (droits insuffisants). 404 = introuvable, 5xx = panne du serveur, 301 = déplacé.
:::
::::

::::exercice[Décomposer une URL]{niveau=2}
Écris `decomposer(url)` qui renvoie un dictionnaire avec les clés `protocole`, `hote`, `chemin` (`"/"` s'il est vide) et `parametres`
(un dictionnaire `{clé: valeur}`, valeurs en chaînes). On suppose l'URL sans port ni ancre, et des paramètres sans caractère encodé.
N'utilise pas `urllib`.

```python depart
def decomposer(url):
    ...
```

```python tests
assert decomposer("https://www.exemple.fr/cours/page.html?id=3&mode=nuit") == {
    "protocole": "https", "hote": "www.exemple.fr", "chemin": "/cours/page.html",
    "parametres": {"id": "3", "mode": "nuit"}}, "URL complète"
assert decomposer("http://site.org") == {"protocole": "http", "hote": "site.org", "chemin": "/", "parametres": {}}, "URL minimale"
assert decomposer("http://a.fr/?q=nsi")["parametres"] == {"q": "nsi"}, "paramètre seul"
```

:::corrige
```python solution
def decomposer(url):
    protocole, reste = url.split("://", 1)
    reste, _, requete = reste.partition("?")
    hote, barre, chemin = reste.partition("/")
    parametres = {}
    if requete:
        for paire in requete.split("&"):
            cle, _, valeur = paire.partition("=")
            parametres[cle] = valeur
    return {"protocole": protocole, "hote": hote, "chemin": "/" + chemin, "parametres": parametres}
```
On découpe de gauche à droite : le protocole avant `://`, les paramètres après `?`, puis l'hôte jusqu'à la première `/`. `partition`
renvoie toujours trois morceaux (vides si le séparateur est absent), ce qui évite les cas particuliers.
:::
::::

::::exercice[Construire une requête]{niveau=2}
Écris `requete_get(hote, chemin, parametres)` qui renvoie le texte d'une requête HTTP/1.1 GET minimale : ligne de requête (chemin
suivi de `?k=v&…` si `parametres` n'est pas vide, dans l'ordre du dictionnaire), en-tête `Host`, puis la ligne vide. Les lignes se
terminent par `\r\n`.

```python depart
def requete_get(hote, chemin, parametres):
    ...
```

```python tests
assert requete_get("www.exemple.fr", "/recherche", {"q": "nsi", "page": "2"}) == \
    "GET /recherche?q=nsi&page=2 HTTP/1.1\r\nHost: www.exemple.fr\r\n\r\n", "avec paramètres"
assert requete_get("a.fr", "/", {}) == "GET / HTTP/1.1\r\nHost: a.fr\r\n\r\n", "sans paramètre"
```

:::corrige
```python solution
def requete_get(hote, chemin, parametres):
    cible = chemin
    if parametres:
        cible += "?" + "&".join(f"{k}={v}" for k, v in parametres.items())
    return f"GET {cible} HTTP/1.1\r\nHost: {hote}\r\n\r\n"
```
L'en-tête `Host` est obligatoire en HTTP/1.1 : une même machine (une même adresse IP) héberge souvent plusieurs sites, et c'est lui
qui indique lequel est demandé.
:::
::::

::::exercice[Suivre des redirections]{niveau=3}
Un serveur est simulé par un dictionnaire `serveur` : `serveur[chemin]` vaut `(code, valeur)` où `valeur` est le contenu de la page
si le code est 200, ou le chemin de destination si le code est 301 ou 302. Un chemin absent donne 404. Écris `charger(serveur, chemin)`
qui suit les redirections et renvoie `(code_final, contenu_ou_None, nombre_de_redirections)`. Au-delà de 5 redirections (boucle
possible), renvoie `(310, None, 5)`.

```python depart
def charger(serveur, chemin):
    ...
```

```python tests
s = {"/": (301, "/accueil"), "/accueil": (200, "Bienvenue"), "/vieux": (302, "/"),
     "/a": (302, "/b"), "/b": (302, "/a"), "/casse": (301, "/nulle-part")}
assert charger(s, "/accueil") == (200, "Bienvenue", 0), "page directe"
assert charger(s, "/vieux") == (200, "Bienvenue", 2), "deux redirections"
assert charger(s, "/casse") == (404, None, 1), "redirection vers une page absente"
assert charger(s, "/a") == (310, None, 5), "boucle de redirections"
```

:::corrige
```python solution
def charger(serveur, chemin):
    redirections = 0
    while True:
        if chemin not in serveur:
            return (404, None, redirections)
        code, valeur = serveur[chemin]
        if code in (301, 302):
            if redirections == 5:
                return (310, None, 5)
            chemin = valeur
            redirections += 1
        else:
            return (code, valeur, redirections)
```
Les navigateurs font de même : ils suivent automatiquement l'en-tête `Location` des réponses 3xx, avec une limite (une vingtaine) pour
ne pas tourner indéfiniment. (310 n'est pas un code officiel : il est utilisé ici pour signaler l'erreur.)
:::
::::

::::exercice[Analyser une situation d'élève]{niveau=4 duree=20}
Un élève de première a écrit un formulaire de connexion pour son projet :

```html
<form action="connexion.php" method="get">
  <input type="text" name="login">
  <input type="password" name="mdp">
  <button>Se connecter</button>
</form>
```

Son site est servi en `http://`. Il affirme : « Le champ est de type `password`, donc le mot de passe est protégé. »

1. Après un clic, quelle URL apparaît dans la barre d'adresse si l'élève saisit `lea` et `Secret!42` ? Expliquez l'encodage.
2. Énumérez les endroits où le mot de passe peut être lu.
3. Quelles corrections proposez-vous, et que protège chacune ?
4. Comment feriez-vous constater ces problèmes aux élèves eux-mêmes ?

:::criteres
- URL : `connexion.php?login=lea&mdp=Secret%2142` ; `!` est encodé `%21` (code hexadécimal), les paramètres GET sont dans l'URL.
- Lieux d'exposition : barre d'adresse et historique, favoris, journaux du serveur, en-tête `Referer` vers d'autres sites, et sur le réseau en clair (HTTP) pour quiconque intercepte.
- Corrections : `method="post"` (sort de l'URL, de l'historique, des journaux) ET HTTPS (chiffre le trafic) ; `type="password"` ne fait que masquer à l'écran ; côté serveur, stocker un hachage du mot de passe.
- Activité : outils de développement (onglet Réseau), comparaison GET/POST, capture de trafic en HTTP sur un réseau de test (Wireshark/Filius).
:::

:::corrige
1. `http://…/connexion.php?login=lea&mdp=Secret%2142`. Le caractère `!` n'est pas autorisé tel quel dans une URL : il est encodé `%21`
   (21 est son code ASCII en hexadécimal). Avec GET, tous les champs du formulaire sont ajoutés à l'URL.
2. Dans la barre d'adresse (quelqu'un qui regarde l'écran), l'**historique** et les favoris du navigateur, les **journaux** du serveur
   (qui enregistrent les URL demandées), l'en-tête `Referer` envoyé aux sites liés depuis la page suivante, et surtout **sur le
   réseau** : en HTTP, la requête circule en clair, lisible par quiconque partage le réseau (Wi-Fi public) ou par un intermédiaire.
3. `method="post"` : le mot de passe passe dans le **corps** de la requête, il disparaît de l'URL, de l'historique et des journaux,
   mais il circule toujours en clair. **HTTPS** : tout le trafic est chiffré (URL comprise, sauf le nom d'hôte), ce qui protège contre
   l'interception. Il faut **les deux**. `type="password"` ne protège que contre le regard par-dessus l'épaule. Côté serveur, ne
   stocker qu'un hachage salé du mot de passe.
4. Faire ouvrir l'onglet **Réseau** des outils de développement et comparer la requête en GET et en POST ; montrer l'historique du
   navigateur ; sur un réseau de test ou dans un simulateur (Filius), capturer le trafic HTTP et retrouver le mot de passe, puis
   constater qu'en HTTPS il est illisible. Les élèves formulent eux-mêmes la règle.
:::
::::
