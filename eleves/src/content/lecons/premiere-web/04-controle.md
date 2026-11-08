---
titre: Contrôle du chapitre
resume: "Un contrôle de 55 minutes noté sur 20 sur les interactions sur le Web."
duree: 55
controle: true
objectifs:
  - "Analyser une page avec des événements"
  - "Distinguer client et serveur"
  - "Analyser un formulaire"
prerequis: [premiere-web/formulaires]
---

## Consignes

Durée : **55 minutes**. Le contrôle est noté sur **20 points**.

## Exercices

::::exercice[Cours]{niveau=3 type=reponses points=5}
Chaque question vaut 1 point.

1. Quel langage décrit le comportement d'un bouton lors d'un clic ?

   - JavaScript

1. Quel code de réponse signifie « page introuvable » ?

   - 404

1. Où est exécuté le code PHP d'un site : sur le client ou sur le serveur ?

   - serveur
   - sur le serveur

1. Qui stocke les cookies : le client ou le serveur ?

   - client
   - le client

1. Quel protocole chiffre les échanges entre le navigateur et le serveur ?

   - HTTPS
::::

::::exercice[Analyser une page]{niveau=3 type=reponses points=5}
Chaque question vaut 1 point.

```html
<input type="text" id="prenom">
<button id="ok">Saluer</button>
<p id="sortie"></p>
```

```javascript
document.getElementById("ok").addEventListener("click", function () {
  const p = document.getElementById("prenom").value;
  document.getElementById("sortie").textContent = "Salut " + p;
});
```

1. Combien de composants interactifs compte la page ?

   - 2

1. Quel événement déclenche la fonction ?

   - click

1. Que contient le paragraphe avant le premier clic ? Réponds `rien` s'il est vide.

   - rien

1. On saisit `Ana` puis on clique. Que contient le paragraphe ?

   - Salut Ana

1. Cette fonction envoie-t-elle une requête au serveur ? Réponds par oui ou par non.

   - non
::::

::::exercice[Modifier le comportement]{niveau=3 type=completer points=3}
On veut maintenant afficher le message quand le texte du champ change, sans bouton. Chaque case vaut 1 point.

```javascript trous
document.getElementById("[[prenom]]").addEventListener("[[input]]", function () {
  const p = document.getElementById("prenom").[[value]];
  document.getElementById("sortie").textContent = "Salut " + p;
});
```
::::

::::exercice[Formulaire]{niveau=3 type=reponses points=4}
Un site de réservation utilise `<form action="/resa" method="get">` avec les champs nommés `nom` et `carte` (numéro de carte bancaire). On saisit `Ana` et `4970`. Chaque question vaut 1 point.

1. Quelle adresse est demandée, en partant de `/resa` ?

   - /resa?nom=Ana&carte=4970

1. Le numéro de carte apparaît-il dans l'adresse ? Réponds par oui ou par non.

   - oui

1. Quelle méthode faudrait-il utiliser à la place de GET ?

   - POST

1. Quel protocole faut-il utiliser pour que le numéro soit chiffré ?

   - HTTPS
::::

::::exercice[Justifier]{niveau=3 points=3}
Pourquoi une vérification faite en JavaScript ne suffit-elle pas à protéger un site ?

:::criteres
- 1 point : le JavaScript s'exécute sur le client.
- 1 point : l'utilisateur peut le modifier ou envoyer ses propres requêtes.
- 1 point : le serveur doit donc vérifier les données qu'il reçoit.
:::

:::corrige
Le JavaScript s'exécute dans le navigateur, sous le contrôle de l'utilisateur, qui peut le modifier ou envoyer ses propres requêtes. Le serveur ne doit donc jamais faire confiance aux données reçues : il doit les vérifier lui-même.
:::
::::
