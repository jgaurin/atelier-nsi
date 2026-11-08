---
titre: "Pages Web : HTML et CSS"
resume: "Distinguer le contenu d'une page de son style, et modifier une page simple."
duree: 35
objectifs:
  - "Distinguer le contenu d'une page de sa présentation"
  - "Étudier et modifier une page HTML simple"
  - "Créer un lien hypertexte"
  - "Connaître les étapes du développement du Web"
---

Le **Web** est un ensemble de pages reliées par des liens et accessibles grâce à Internet. Internet est le réseau, le Web est un service qui l'utilise.

## 1. Quelques dates

| Année | Événement |
| --- | --- |
| 1965 | Ted Nelson invente l'hypertexte |
| 1989 | Tim Berners-Lee crée le Web au CERN |
| 1993 | le Web passe dans le domaine public, premier navigateur Mosaic |
| 1995 | JavaScript et PHP rendent les sites interactifs et dynamiques |
| 2001 | le DOM standardise les pages |
| 2010 | des technologies pour développer des applications sur mobiles |

## 2. HTML : le contenu

Le langage **HTML** décrit le contenu avec des **balises**.

```html
<h1>Mon lycée</h1>
<p>Bienvenue sur <strong>notre</strong> site.</p>
<a href="https://exemple.fr/menu.html">Voir le menu</a>
<img src="photo.jpg" alt="La cour">
```

| Balise | Rôle |
| --- | --- |
| `<h1>` | titre |
| `<p>` | paragraphe |
| `<strong>` | texte important |
| `<a href="...">` | lien hypertexte |
| `<img src="...">` | image |

Un **hypertexte** contient des liens vers d'autres contenus, qui peuvent se trouver sur n'importe quelle machine.

## 3. CSS : le style

Le langage **CSS** décrit la présentation.

```css
h1 {
  color: blue;
}
p {
  font-size: 18px;
}
```

On peut changer tout le style d'un site sans toucher à son contenu.

## L'essentiel

- HTML : le contenu, avec des balises. CSS : le style.
- `<a href="adresse">texte</a>` crée un lien.
- Web : 1989, au CERN, par Tim Berners-Lee.

## Exercices

::::exercice[HTML ou CSS ?]{niveau=1 type=associer}
Indique le langage concerné.

| Élément | Langage |
| --- | --- |
| Le texte d'un titre | HTML |
| La couleur d'un titre | CSS |
| Un lien vers une autre page | HTML |
| La taille des caractères | CSS |
::::

::::exercice[QCM : pages Web]{niveau=1 type=quiz}
Une question à la fois : la correction s'affiche aussitôt.

1. Quelle balise crée un lien ?

   - [ ] `<p>`
   - [x] `<a>`
   - [ ] `<h1>`
   - [ ] `<img>`

   > L'attribut `href` donne la destination.

1. Qui a créé le Web, et où ?

   - [ ] Ted Nelson, à Paris
   - [x] Tim Berners-Lee, au CERN
   - [ ] Alan Turing, à Londres
   - [ ] Bill Gates, à Seattle

   > C'était en 1989.

1. Que change `color: red;` ?

   - [ ] le contenu du texte
   - [x] la couleur du texte
   - [ ] l'adresse de la page
   - [ ] la taille de l'image

   > C'est une règle de style.

1. Quelle différence y a-t-il entre Internet et le Web ?

   - [ ] aucune
   - [x] Internet est le réseau, le Web est un service qui l'utilise
   - [ ] le Web est plus ancien
   - [ ] Internet n'existe que sur les ordinateurs

   > Le courriel, par exemple, utilise Internet sans être le Web.
::::

::::exercice[Compléter une page]{niveau=2 type=completer}
Complète ce code. Le titre affiche « NSI », et le lien mène à `cours.html`.

```html trous
<[[h1]]>NSI</h1>
<a [[href]]="[[cours.html]]">Voir le cours</[[a]]>
```

Complète la règle CSS pour afficher les paragraphes en vert.

```css trous
[[p]] {
  [[color]]: green;
}
```
::::

::::exercice[Analyser une page]{niveau=3 type=reponses}
Voici le code d'une page.

```html
<h1>Club photo</h1>
<p>Réunion le <strong>mardi</strong>.</p>
<a href="https://exemple.fr/photos.html">Nos photos</a>
<img src="club.jpg" alt="Le club">
```

```css
h1 { color: red; }
strong { color: blue; }
```

1. Quel texte s'affiche dans le titre principal ?

   - Club photo

1. De quelle couleur, en anglais, le mot « mardi » s'affiche-t-il ?

   - blue

1. Quel texte voit-on pour le lien ?

   - Nos photos

1. Vers quelle adresse mène le lien ?

   - https://exemple.fr/photos.html

1. Pour écrire le titre en vert, quel langage faut-il modifier : HTML ou CSS ?

   - CSS

1. Pour remplacer « mardi » par « jeudi », quel langage faut-il modifier : HTML ou CSS ?

   - HTML

1. Quelle balise faut-il remplacer pour transformer le paragraphe en titre : `p` ou `strong` ?

   - p
::::
