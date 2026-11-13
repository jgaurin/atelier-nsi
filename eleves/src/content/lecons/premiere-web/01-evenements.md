---
titre: Composants et événements
resume: "Les éléments d'une page qui permettent d'interagir, et les programmes qui réagissent aux actions de l'utilisateur."
duree: 35
objectifs:
  - "Identifier les composants graphiques d'une page Web"
  - "Identifier les événements traités par ces composants"
  - "Analyser et modifier ce qui se passe lors d'un clic"
---

Quand tu cliques sur « J'aime », le compteur augmente sans que la page se recharge. Quand tu tapes dans une barre de recherche, des suggestions apparaissent. La page **réagit** à ce que tu fais : c'est son **interface homme-machine** (IHM).

## 1. Deux langages, deux rôles

Une page interactive repose sur deux langages :

- le **HTML** décrit les **composants** : ce qu'il y a sur la page ;
- le **JavaScript** décrit leur **comportement** : ce qui se passe quand on agit dessus.

Voici un compteur avec un bouton.

```html
<p>Valeur : <span id="valeur">0</span></p>
<button id="plus">+1</button>
```

Le HTML crée un texte et un bouton. L'attribut `id` donne à chaque composant un nom unique, pour que le JavaScript puisse le retrouver.

```javascript
let compteur = 0;
const bouton = document.getElementById("plus");
bouton.addEventListener("click", function () {
  compteur = compteur + 1;
  document.getElementById("valeur").textContent = compteur;
});
```

Ligne par ligne :

- `let compteur = 0;` crée une variable, comme en Python.
- `document.getElementById("plus")` retrouve dans la page le composant dont l'`id` est `plus` : le bouton.
- `addEventListener("click", function () { … })` dit : « quand on clique sur ce bouton, exécute cette fonction ».
- Dans la fonction, on augmente le compteur, puis on écrit sa nouvelle valeur dans le texte d'`id` `valeur`, grâce à `textContent`.

## 2. Composants et événements

Un **événement** est une action de l'utilisateur, ou du navigateur, à laquelle la page peut réagir.

| Composant | Balise HTML | Événement courant |
| --- | --- | --- |
| Bouton | `<button>` | `click` : on clique |
| Champ de texte | `<input type="text">` | `input` : le texte change |
| Case à cocher | `<input type="checkbox">` | `change` : on coche ou décoche |
| Liste déroulante | `<select>` | `change` : on choisit une option |
| Formulaire | `<form>` | `submit` : on l'envoie |
| Toute zone | n'importe quelle balise | `mouseover` : la souris passe dessus |

## 3. Un programme qui attend

Un programme Python simple s'exécute de haut en bas, puis s'arrête. Le JavaScript d'une page fonctionne autrement : au chargement, il **associe des fonctions à des événements**, puis il **attend**. Chaque fonction ne s'exécute que lorsque son événement se produit, autant de fois qu'il se produit.

C'est la **programmation événementielle**. Dans le compteur, la fonction ne s'exécute jamais au chargement : seulement à chaque clic.

## 4. Modifier le comportement

Pour changer ce que fait la page, on modifie le JavaScript, pas le HTML. Pour un bouton qui enlève 1, on remplace `compteur + 1` par `compteur - 1`. Pour réagir à chaque frappe dans un champ, on écoute l'événement `input` de ce champ, au lieu de `click` sur un bouton.

## L'essentiel

- HTML : les composants. JavaScript : leur comportement.
- `getElementById` retrouve un composant grâce à son `id`.
- `element.addEventListener("click", fonction)` associe une fonction à un événement.
- Programmation événementielle : la fonction ne s'exécute que lorsque l'événement se produit.

## Exercices

::::exercice[Quel événement ?]{niveau=1 type=associer}
Associe chaque action de l'utilisateur à l'événement correspondant.

| Action | Événement |
| --- | --- |
| Cliquer sur un bouton | click |
| Modifier le texte d'un champ | input |
| Envoyer un formulaire | submit |
| Passer la souris sur une image | mouseover |
::::

::::exercice[HTML ou JavaScript ?]{niveau=1 type=associer}
Dans quel langage écrit-on chacun de ces éléments ?

| Élément | Langage |
| --- | --- |
| La présence d'un bouton sur la page | HTML |
| Ce qui se passe quand on clique dessus | JavaScript |
| La couleur du bouton | CSS |
| Le texte d'un paragraphe | HTML |
::::

::::exercice[Modifier un compteur]{niveau=1 type=completer}
On veut un bouton qui **enlève 1** au compteur. Complète le code.

```javascript trous
const bouton = document.getElementById("moins");
bouton.addEventListener("[[click]]", function () {
  compteur = compteur [[-]] 1;
  document.getElementById("valeur").textContent = [[compteur]];
});
```
::::

::::exercice[Lire le comportement d'une page]{niveau=2 type=reponses}
On considère ce code.

```html
<button id="b">Cliquer</button>
<p id="p">Bonjour</p>
```

```javascript
let n = 0;
document.getElementById("b").addEventListener("click", function () {
  n = n + 2;
  document.getElementById("p").textContent = "Total : " + n;
});
```

1. Quel texte affiche le paragraphe au chargement de la page ?

   - Bonjour

1. Quel texte affiche-t-il après un clic ?

   - Total : 2

1. Quel texte affiche-t-il après trois clics ?

   - Total : 6

1. Quelle fonction JavaScript permet de récupérer le bouton ?

   - getElementById
   - document.getElementById
::::

::::exercice[Réserver des places]{niveau=3 type=reponses}
Une page permet de réserver des places. Au chargement, 20 places sont disponibles.

```html
<input type="text" id="nb">
<button id="ok">Réserver</button>
<p id="places">20</p>
```

```javascript
let places = 20;
document.getElementById("ok").addEventListener("click", function () {
  const n = Number(document.getElementById("nb").value);
  if (n <= places) {
    places = places - n;
  }
  document.getElementById("places").textContent = places;
});
```

1. Quelle balise HTML décrit le composant sur lequel on clique ?

   - button
   - <button>

1. On saisit 5 et on clique. Que contient alors le paragraphe ?

   - 15

1. On saisit ensuite 30 et on clique. Que contient le paragraphe ?

   - 15

   > 30 est supérieur à 15 : la condition est fausse, rien n'est retiré.

1. Le code s'exécute-t-il sur le client ou sur le serveur ?

   - client
   - sur le client

1. On veut qu'un clic réserve toujours une seule place. Par quoi remplace-t-on `n` dans `places = places - n` ?

   - 1

1. On veut réagir à chaque modification du champ, sans bouton. Quel est l'`id` de l'élément à surveiller ?

   - nb

1. Quel événement faut-il alors écouter ?

   - input
::::
