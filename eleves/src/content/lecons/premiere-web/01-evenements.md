---
titre: Composants et événements
resume: "Les éléments d'une page qui permettent d'interagir, et les programmes qui réagissent aux actions de l'utilisateur."
duree: 35
objectifs:
  - "Identifier les composants graphiques d'une page Web"
  - "Identifier les événements traités par ces composants"
  - "Analyser et modifier ce qui se passe lors d'un clic"
---

Une page Web réagit à ce que tu fais : un clic, une saisie, le passage de la souris. C'est l'**interface homme-machine** (IHM).

## 1. HTML décrit, JavaScript fait réagir

```html
<p>Valeur : <span id="valeur">0</span></p>
<button id="plus">+1</button>
```

```javascript
let compteur = 0;
const bouton = document.getElementById("plus");
bouton.addEventListener("click", function () {
  compteur = compteur + 1;
  document.getElementById("valeur").textContent = compteur;
});
```

- Le **HTML** décrit les composants : ici un bouton et un texte.
- Le **JavaScript** décrit leur comportement : la fonction exécutée lors d'un clic.

## 2. Composants et événements

| Composant | Balise | Événement courant |
| --- | --- | --- |
| Bouton | `<button>` | `click` |
| Champ de texte | `<input type="text">` | `input` |
| Case à cocher | `<input type="checkbox">` | `change` |
| Liste déroulante | `<select>` | `change` |
| Formulaire | `<form>` | `submit` |

Le programme ne s'exécute pas de haut en bas une seule fois : il **attend des événements**. On parle de **programmation événementielle**.

## L'essentiel

- HTML : les composants. JavaScript : leur comportement.
- `element.addEventListener("click", fonction)` associe une fonction à un événement.
- La fonction ne s'exécute que lorsque l'événement se produit.

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

::::exercice[Pourquoi le programme attend-il ?]{niveau=2}
Explique en deux ou trois phrases la différence entre un programme Python qui s'exécute de haut en bas et le code JavaScript d'une page avec des boutons.

:::criteres
- Le programme Python exécute ses instructions dans l'ordre, puis s'arrête.
- Le code de la page associe des fonctions à des événements.
- Ces fonctions s'exécutent seulement quand l'événement se produit, autant de fois qu'il se produit.
:::

:::corrige
Un programme Python simple exécute ses instructions dans l'ordre, puis s'arrête. Dans une page, le JavaScript associe des fonctions à des événements, puis attend. Chaque fonction s'exécute seulement quand l'événement se produit, par exemple à chaque clic.
:::
::::
