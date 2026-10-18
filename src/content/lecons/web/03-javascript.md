---
titre: JavaScript côté client
resume: Le langage des pages web — syntaxe de base comparée à Python, manipulation du DOM, programmation événementielle, et requêtes asynchrones vers un serveur.
duree: 70
objectifs:
  - Lire et écrire du JavaScript de base (variables, types, conditions, boucles, fonctions, tableaux, objets)
  - Modifier une page en manipulant le DOM (sélection, contenu, classes, création d'éléments)
  - Programmer de façon événementielle (`addEventListener`) et expliquer la boucle d'événements
  - Distinguer ce qui s'exécute sur le client et sur le serveur, et appeler un serveur avec `fetch`
prerequis: [web/html-css, python/fonctions]
programme: [id-client-serveur, nsi1-web, nsi1-langages, snt-web]
cartes:
  - q: Où s'exécute JavaScript dans une page web ?
    r: "Dans le **navigateur** (côté client), après le chargement de la page ; il peut modifier la page sans la recharger. Le code côté serveur (PHP, Python…) s'exécute **avant** l'envoi de la page."
  - q: "`let`, `const`, `var` ?"
    r: "`const` : variable non réaffectable ; `let` : variable réaffectable, portée du bloc `{ }` ; `var` : ancienne forme, portée de la fonction (à éviter)."
  - q: "`==` ou `===` ?"
    r: "`===` compare sans conversion de type (`1 === \"1\"` est faux) ; `==` convertit d'abord (`1 == \"1\"` est vrai, `0 == \"\"` aussi) : toujours utiliser `===`."
  - q: Comment réagir à un clic sur un bouton ?
    r: "`bouton.addEventListener(\"click\", (evenement) => { … })` : on enregistre une fonction (gestionnaire) que le navigateur appellera à chaque clic."
  - q: Qu'est-ce que la programmation événementielle ?
    r: "Le programme ne suit pas un fil unique : il enregistre des gestionnaires, puis le navigateur les appelle quand les événements surviennent (clic, frappe, réponse réseau), un par un, via la **boucle d'événements**."
  - q: À quoi sert `fetch` ?
    r: "À envoyer une requête HTTP depuis la page, sans la recharger ; la réponse arrive plus tard (promesse), qu'on attend avec `await`."
  - q: Sélectionner un élément du DOM ?
    r: "`document.querySelector(\"#id\")` (le premier qui correspond au sélecteur CSS) ou `document.querySelectorAll(\".classe\")` (tous)."
---

HTML structure, CSS met en forme… et **JavaScript** rend la page **interactive** : réagir à un clic, vérifier un formulaire avant
l'envoi, afficher des données sans recharger. Créé en 1995 par Brendan Eich chez Netscape (en dix jours, dit la légende), normalisé
sous le nom d'**ECMAScript**, c'est aujourd'hui le seul langage exécuté nativement par tous les navigateurs. Le programme de première
NSI demande de comprendre les interactions client-serveur et la **programmation événementielle** ; le concours, de savoir lire un code
JavaScript côté client.

## 1. Le langage, vu depuis Python

Les exemples marqués « JavaScript » s'exécutent dans ta page, dans un bac à sable isolé : `console.log` y joue le rôle de `print`.

```javascript exec
// Variables : const (non réaffectable) et let
const prenom = "Léa";
let age = 17;
age = age + 1;

// Chaînes : gabarits avec ${…}  ≈ f-strings
console.log(`${prenom} a ${age} ans`);

// Conditions et booléens : && || !, et === pour comparer
if (age >= 18 && prenom !== "") {
  console.log("majeure");
} else {
  console.log("mineure");
}

// Boucles
let somme = 0;
for (let i = 1; i <= 10; i++) {
  somme += i;
}
console.log("somme :", somme);

// Tableaux  ≈ listes
const notes = [12, 15.5, 9];
notes.push(17);
for (const n of notes) {        // for … of  ≈ for … in de Python
  console.log(n);
}
console.log(notes.length, notes.map((n) => n * 2), notes.filter((n) => n >= 12));
```

```javascript exec
// Fonctions : deux syntaxes
function moyenne(t) {
  let s = 0;
  for (const x of t) s += x;
  return s / t.length;
}
const carre = (x) => x * x;          // fonction fléchée  ≈ lambda

// Objets  ≈ dictionnaires
const eleve = { nom: "Hugo", classe: "1G2", notes: [11, 14] };
eleve.notes.push(16);
console.log(eleve.nom, moyenne(eleve.notes), carre(4));
console.log(Object.keys(eleve));
```

| Python | JavaScript |
|---|---|
| `x = 3` | `let x = 3;` ou `const x = 3;` |
| `True`, `False`, `None` | `true`, `false`, `null` (et `undefined`) |
| `and`, `or`, `not` | `&&`, `\|\|`, `!` |
| `==` | `===` (le `==` de JavaScript convertit les types) |
| `print(…)` | `console.log(…)` |
| `len(t)`, `t.append(x)` | `t.length`, `t.push(x)` |
| `for x in t:` | `for (const x of t) { … }` |
| `def f(x): return …` | `function f(x) { return …; }` ou `(x) => …` |
| `d = {"a": 1}`, `d["a"]` | `const d = { a: 1 };`, `d.a` ou `d["a"]` |
| `7 // 2` | `Math.floor(7 / 2)` (`/` est toujours flottant) |

:::attention[Les pièges de JavaScript]
Tous les nombres sont des flottants 64 bits (`7 / 2` vaut `3.5`, et les entiers sont exacts seulement jusqu'à $2^{53}$). Le `==` convertit
les types : `0 == ""`, `"1" == 1` et `null == undefined` sont vrais. `"3" + 1` vaut `"31"` (concaténation) mais `"3" - 1` vaut `2`.
Une variable non déclarée ou un attribut absent donne `undefined` au lieu d'une erreur.
:::

```javascript exec
console.log(7 / 2, 0.1 + 0.2, "3" + 1, "3" - 1);
console.log(1 == "1", 1 === "1", 0 == "", null == undefined);
const o = { a: 1 };
console.log(o.b, typeof o.b, typeof null);   // undefined, "undefined", "object" (erreur historique du langage)
```

## 2. Le DOM : lire et modifier la page

Dans une page, JavaScript accède à l'arbre du document par l'objet `document`. (Ces exemples ont besoin d'une vraie page : on les lit
ici, et on les essaie dans la console du navigateur, touche F12.)

```html
<p id="message">Bonjour</p>
<ul id="liste"></ul>
<button id="ajouter">Ajouter</button>
```

```javascript
const message = document.querySelector("#message");     // sélecteur CSS
message.textContent = "Bienvenue !";                     // remplacer le texte
message.classList.add("important");                      // ajouter une classe (→ CSS)
message.style.color = "darkgreen";                       // style direct (à limiter)

const liste = document.querySelector("#liste");
for (const fruit of ["pomme", "kiwi"]) {
  const li = document.createElement("li");               // créer un nœud
  li.textContent = fruit;
  liste.append(li);                                      // l'accrocher dans l'arbre
}
```

:::attention[Sécurité]
Pour insérer un texte venant de l'utilisateur, utiliser `textContent`, **jamais** `innerHTML` : avec `innerHTML`, un texte contenant
`<img src=x onerror="…">` serait interprété comme du HTML et exécuterait du code — c'est une faille **XSS** (*cross-site scripting*).
:::

## 3. La programmation événementielle

```javascript
const bouton = document.querySelector("#ajouter");
let compteur = 0;

bouton.addEventListener("click", () => {        // on ENREGISTRE une fonction…
  compteur++;
  const li = document.createElement("li");
  li.textContent = `élément ${compteur}`;
  liste.append(li);
});
// … que le navigateur APPELLERA à chaque clic. Ce code-ci se termine tout de suite.
```

Le programme n'a plus un déroulement linéaire : il **enregistre des gestionnaires** d'événements (`click`, `input`, `submit`,
`keydown`, `load`…), puis le navigateur les appelle **quand** les événements surviennent.

```mermaid legende="La boucle d'événements : les gestionnaires s'exécutent un par un, jamais en même temps"
flowchart LR
  E1["clic"] --> F[("file des<br/>événements")]
  E2["frappe clavier"] --> F
  E3["réponse réseau"] --> F
  F --> B{"boucle d'événements"}
  B -->|"prend le suivant"| G["exécute son gestionnaire<br/>jusqu'au bout"]
  G --> R["le navigateur<br/>redessine la page"]
  R --> B
```

Conséquence importante : un gestionnaire qui calcule longtemps **bloque** toute la page (plus de clics, plus d'affichage), puisque
les autres événements attendent dans la file.

## 4. Client et serveur : `fetch`

Une page peut interroger un serveur **sans se recharger** : c'est ainsi que fonctionnent les suggestions de recherche ou le
défilement infini. La réponse arrive **plus tard** : `fetch` renvoie une **promesse**, qu'on attend avec `await` dans une fonction
`async` — pendant l'attente, la boucle d'événements continue de traiter les clics.

```javascript
async function chargerMeteo(ville) {
  const reponse = await fetch(`/api/meteo?ville=${encodeURIComponent(ville)}`);   // requête GET
  if (!reponse.ok) throw new Error(`HTTP ${reponse.status}`);
  const donnees = await reponse.json();          // le serveur répond en JSON
  document.querySelector("#temp").textContent = `${donnees.temperature} °C`;
}
```

```javascript exec
// L'asynchronisme sans réseau : setTimeout programme une fonction pour plus tard.
console.log("1. début");
setTimeout(() => console.log("3. dans le minuteur (même avec un délai de 0 ms)"), 0);
console.log("2. fin du code principal");
await new Promise((r) => setTimeout(r, 10));   // on laisse au minuteur le temps de passer
```

:::retenir[Ce qui s'exécute où]
- **Côté serveur** (PHP, Python avec Flask, Node.js…) : avant l'envoi de la page ou en réponse à une requête ; accès à la base de
  données, aux secrets ; l'utilisateur ne voit pas ce code.
- **Côté client** (JavaScript du navigateur) : après la réception ; réactivité, confort ; le code est **visible et modifiable** par
  l'utilisateur. Toute vérification de sécurité faite côté client doit donc être **refaite** côté serveur.
:::

:::prof
En première NSI : « identifier les événements que les fonctions associées aux différents composants graphiques sont capables de
traiter », « analyser et modifier les méthodes exécutées lors d'un clic sur un bouton ». Une progression efficace : partir d'une page
fournie avec un bouton qui marche, faire **modifier** le gestionnaire, puis en écrire un. La console du navigateur (F12) permet de tester
chaque instruction sur une vraie page. Le parallèle avec Tkinter (`bouton.config(command=…)`) aide les élèves qui l'ont vu en Python.
:::

## Exemple guidé

**Problème.** Un compteur de caractères sous une zone de texte, qui devient rouge au-delà de 280 caractères, et un bouton « Publier »
désactivé quand le texte est vide ou trop long.

**1. Le HTML.**

```html
<textarea id="texte" rows="4"></textarea>
<p id="compteur">0 / 280</p>
<button id="publier" disabled>Publier</button>
```

**2. Choisir l'événement.** `input` est déclenché à **chaque** modification du contenu (frappe, collage, suppression) ; `change` ne
l'est qu'à la perte du focus : on prend `input`.

**3. Séparer le calcul de l'affichage.** La règle (« le texte est-il publiable ? ») est une fonction pure, testable sans page :

```javascript exec
const MAX = 280;
function etat(texte) {
  const n = [...texte].length;           // compte les caractères (et pas les unités UTF-16)
  return { n, trop: n > MAX, publiable: n > 0 && n <= MAX };
}
console.log(etat(""), etat("Bonjour"), etat("x".repeat(281)));
console.log(etat("😀").n, "😀".length);   // 1 caractère, mais 2 unités pour .length
```

**4. Brancher l'affichage.**

```javascript
const zone = document.querySelector("#texte");
const compteur = document.querySelector("#compteur");
const publier = document.querySelector("#publier");

zone.addEventListener("input", () => {
  const e = etat(zone.value);
  compteur.textContent = `${e.n} / ${MAX}`;
  compteur.classList.toggle("alerte", e.trop);   // la couleur est dans le CSS : .alerte { color: red; }
  publier.disabled = !e.publiable;
});
```

Le serveur qui reçoit la publication doit **revérifier** la longueur : on peut désactiver ce JavaScript, ou envoyer une requête à la main.

## L'essentiel

- JavaScript s'exécute dans le navigateur (client) ; il rend la page interactive sans la recharger.
- Syntaxe : `const`/`let`, `===`, `&& || !`, `for (… of …)`, `function` et fonctions fléchées, tableaux (`push`, `length`, `map`, `filter`), objets `{clé: valeur}`.
- Pièges : nombres tous flottants, `==` qui convertit, `"3" + 1 === "31"`, `undefined`.
- DOM : `document.querySelector`, `textContent` (jamais `innerHTML` avec des données utilisateur), `classList`, `createElement`, `append`.
- Événementiel : `addEventListener(type, gestionnaire)` ; la boucle d'événements exécute les gestionnaires un par un.
- `fetch` + `await` : requête HTTP asynchrone ; toute vérification côté client doit être refaite côté serveur.

## Exercices

::::exercice[Comparer en JavaScript]{niveau=1}
Laquelle de ces expressions vaut `true` ?

- [ ] `1 === "1"`
- [x] `0 == ""`
- [ ] `"3" + 1 === 4`
- [ ] `[1, 2].length === 3`

:::corrige
`==` convertit la chaîne vide en nombre 0 : `0 == ""` est vrai (c'est pour cela qu'on utilise `===`). `1 === "1"` est faux (types
différents), `"3" + 1` vaut la chaîne `"31"`, et le tableau a 2 éléments.
:::
::::

::::exercice[Client ou serveur ?]{niveau=1}
Sur un site de vente, laquelle de ces tâches **doit** être faite côté serveur ?

- [ ] Afficher en direct le nombre de caractères d'un avis
- [ ] Ouvrir un menu au survol
- [x] Vérifier que le prix payé correspond bien au prix de l'article
- [ ] Agrandir une photo au clic

:::corrige
Tout ce qui touche à la sécurité ou à l'argent doit être fait (ou refait) sur le serveur : le code client est modifiable par
l'utilisateur, qui pourrait envoyer un prix de 0 €. Les trois autres tâches relèvent du confort d'affichage.
:::
::::

::::exercice[Prédire l'ordre d'exécution]{niveau=2}
Dans quel ordre s'affichent les lettres ? Réponds par la suite des lettres.

```javascript
console.log("A");
setTimeout(() => console.log("B"), 0);
document.querySelector("#b").addEventListener("click", () => console.log("C"));
console.log("D");
// l'utilisateur clique sur le bouton #b une seconde plus tard
```

:::corrige
**A, D, B, C**. Le code principal s'exécute d'abord jusqu'au bout (A, D) : `setTimeout` et `addEventListener` ne font
qu'**enregistrer** des fonctions. Puis la boucle d'événements traite le minuteur (B, même avec 0 ms il passe après le code
principal) et, une seconde plus tard, le clic (C). Sans clic, C ne s'affiche jamais.
:::
::::

::::exercice[Simuler la boucle d'événements]{niveau=3}
On simule en Python une boucle d'événements. `gestionnaires` est un dictionnaire `{type d'événement: liste de fonctions}` ; chaque
fonction reçoit l'événement (un dictionnaire) et peut renvoyer une liste de **nouveaux événements** à ajouter en fin de file. Écris
`boucle(file_initiale, gestionnaires)` qui traite les événements dans l'ordre d'arrivée (une file), appelle **tous** les gestionnaires
du type de chaque événement dans l'ordre d'enregistrement, et renvoie la liste des types traités. Un événement sans gestionnaire est
traité quand même (rien ne se passe).

```python depart
from collections import deque

def boucle(file_initiale, gestionnaires):
    ...
```

```python tests
journal = []
def au_clic(e):
    journal.append("clic " + e["cible"])
    return [{"type": "requete", "cible": e["cible"]}]
def compter(e):
    journal.append("compte")
    return []
def a_la_reponse(e):
    journal.append("réponse " + e["cible"])
    return None
g = {"click": [au_clic, compter], "requete": [a_la_reponse]}
traites = boucle([{"type": "click", "cible": "b1"}, {"type": "survol", "cible": "img"}, {"type": "click", "cible": "b2"}], g)
assert traites == ["click", "survol", "click", "requete", "requete"], "ordre de la file"
assert journal == ["clic b1", "compte", "clic b2", "compte", "réponse b1", "réponse b2"], "gestionnaires appelés dans l'ordre"
```

:::corrige
```python solution
from collections import deque

def boucle(file_initiale, gestionnaires):
    file = deque(file_initiale)
    traites = []
    while file:
        evenement = file.popleft()
        traites.append(evenement["type"])
        for gestionnaire in gestionnaires.get(evenement["type"], []):
            nouveaux = gestionnaire(evenement)
            if nouveaux:
                file.extend(nouveaux)
    return traites
```
Les requêtes déclenchées par les clics passent **après** les événements déjà en file : c'est pour cela qu'une réponse réseau n'interrompt
jamais un gestionnaire en cours. (Le vrai navigateur a plusieurs files avec des priorités, mais le principe est celui-ci.)
:::
::::

::::exercice[Écrire un gestionnaire]{niveau=3}
Une page contient `<input id="nombre" type="number">`, `<button id="tester">Tester</button>` et `<p id="verdict"></p>`. Écris le
JavaScript qui, au clic, affiche dans le paragraphe « 17 est premier » ou « 18 n'est pas premier » (ou « Entre un entier ≥ 2 » si la
saisie n'est pas valide). Sépare la fonction `estPremier(n)` du gestionnaire.

:::criteres
- Fonction pure `estPremier(n)` correcte (diviseurs jusqu'à $\sqrt{n}$, cas $n < 2$).
- Sélection des éléments avec `querySelector` ; `addEventListener("click", …)` ; lecture de `input.value` convertie en nombre (`Number`, `parseInt`) et validation (`Number.isInteger`).
- Affichage avec `textContent` (pas `innerHTML`) ; message adapté à chaque cas.
:::

:::corrige
```javascript
function estPremier(n) {
  if (n < 2) return false;
  for (let d = 2; d * d <= n; d++) {
    if (n % d === 0) return false;
  }
  return true;
}

const champ = document.querySelector("#nombre");
const verdict = document.querySelector("#verdict");

document.querySelector("#tester").addEventListener("click", () => {
  const n = Number(champ.value);           // "" donne 0, "abc" donne NaN
  if (!Number.isInteger(n) || n < 2) {
    verdict.textContent = "Entre un entier ≥ 2";
  } else {
    verdict.textContent = estPremier(n) ? `${n} est premier` : `${n} n'est pas premier`;
  }
});
```
`input.value` est **toujours une chaîne** : sans conversion, `"17" % 2` fonctionnerait par conversion implicite, mais `"17" + 1` donnerait
`"171"`. La fonction `estPremier` se teste dans la console, indépendamment de la page.
:::
::::

::::exercice[Concevoir une activité]{niveau=4 duree=25}
Vous préparez une séance de première NSI sur la programmation événementielle, avec une page qui contient un formulaire d'inscription à
un club (nom, adresse électronique, niveau, case « j'accepte le règlement »).

1. Quels événements et quelles vérifications côté client proposez-vous de programmer ? Donnez le code d'un gestionnaire `submit` qui
   empêche l'envoi si la case n'est pas cochée.
2. Expliquez pourquoi le serveur doit refaire ces vérifications, et comment le montrer aux élèves.
3. Quelle erreur d'élève anticipez-vous avec `addEventListener`, et comment la faire diagnostiquer ?

:::criteres
- Événements pertinents (`input` pour un retour immédiat, `submit` sur le formulaire, `change` sur la case) ; vérifications (champ vide, format d'adresse, case cochée).
- Gestionnaire `submit` correct avec `evenement.preventDefault()` et message affiché par `textContent`.
- Argument serveur : code client contournable (désactivation de JavaScript, outils de développement, requête forgée) ; démonstration concrète.
- Erreur anticipée crédible (appel de la fonction au lieu de la passer : `addEventListener("click", f())`, élément sélectionné avant d'exister, `onclick` écrasé…) et méthode de diagnostic (console, `console.log`, points d'arrêt).
:::

:::corrige
1. Événements : `input` sur l'adresse (retour immédiat : bordure rouge si le format est invalide), `change` sur la case, et surtout
   `submit` sur le formulaire, qui centralise les vérifications avant l'envoi :
   ```javascript
   const formulaire = document.querySelector("#inscription");
   const erreur = document.querySelector("#erreur");
   formulaire.addEventListener("submit", (evenement) => {
     const accepte = document.querySelector("#reglement").checked;
     if (!accepte) {
       evenement.preventDefault();               // annule l'envoi
       erreur.textContent = "Tu dois accepter le règlement.";
     }
   });
   ```
   Pour les vérifications simples (champ requis, format d'adresse), les attributs HTML `required` et `type="email"` suffisent : le
   JavaScript sert aux règles que HTML ne sait pas exprimer.
2. Le code client s'exécute chez l'utilisateur, qui le contrôle : il peut désactiver JavaScript, supprimer `required` dans
   l'inspecteur, ou envoyer directement une requête POST forgée (onglet Réseau → « Modifier et renvoyer »). Démonstration en classe :
   retirer la vérification dans l'inspecteur et constater que l'envoi passe ; le serveur reçoit alors une inscription sans
   acceptation du règlement s'il ne vérifie rien.
3. Erreur classique : `bouton.addEventListener("click", verifier())` — les parenthèses **appellent** la fonction immédiatement (au
   chargement) et passent son résultat (souvent `undefined`) au lieu de la fonction. Symptôme : « ça se déclenche tout seul au
   chargement et plus jamais au clic ». Autre erreur fréquente : sélectionner un élément avant qu'il existe (script placé dans `<head>`
   sans `defer`), d'où `null`. Diagnostic : la console (message d'erreur, `console.log` dans le gestionnaire pour vérifier qu'il est
   appelé), puis faire verbaliser la différence entre « nommer une fonction » et « l'appeler ».
:::
::::
