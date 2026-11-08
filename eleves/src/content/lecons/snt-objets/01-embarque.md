---
titre: Systèmes embarqués
resume: "Comment un objet mesure, décide et agit, et pourquoi sa sûreté et sa sécurité comptent."
duree: 25
objectifs:
  - "Identifier capteurs, actionneurs et interfaces dans un système courant"
  - "Identifier un algorithme de contrôle"
  - "Comprendre les enjeux de sûreté et de sécurité"
---

Un **système embarqué** est un ordinateur intégré à un objet : voiture, ascenseur, lave-linge, montre.

## 1. Mesurer, décider, agir

| Élément | Rôle | Exemple |
| --- | --- | --- |
| **Capteur** | mesure le monde | thermomètre, caméra |
| **Actionneur** | agit sur le monde | moteur, résistance, LED |
| **IHM** | échange avec la personne | écran, boutons, application |
| **Programme** | décide | algorithme de contrôle |

```
répéter sans fin :
    lire les capteurs
    décider
    commander les actionneurs
```

:::exemple
Un frein ABS mesure la rotation des roues. Si une roue se bloque, le programme relâche brièvement le frein.
:::

## 2. Des contraintes fortes

- **Temps réel** : la réponse doit arriver dans un délai imposé.
- **Consommation** : un objet sur pile doit durer longtemps.
- **Sûreté** : le système ne doit pas commettre d'erreur dangereuse.
- **Sécurité** : il doit résister aux attaques. Des objets connectés mal protégés servent à lancer des attaques sur Internet.

## 3. Quelques dates

| Année | Événement |
| --- | --- |
| 1967 | système de guidage embarqué de la mission Apollo |
| 1971 | premier processeur d'Intel |
| 1984 | Airbus A320, commandes électriques informatisées |
| 1998 | métro sans conducteur Météor, à Paris |
| 1999 | expression « internet des objets » |
| 2007 | arrivée du smartphone |

## L'essentiel

- Capteur : il mesure. Actionneur : il agit. IHM : elle échange avec la personne.
- Un programme répète : lire, décider, agir.
- Temps réel, consommation, sûreté, sécurité.

## Exercices

::::exercice[Capteur, actionneur ou IHM ?]{niveau=1 type=associer}
Classe chaque élément.

| Élément | Catégorie |
| --- | --- |
| Détecteur de fumée | capteur |
| Moteur de volet | actionneur |
| Écran tactile de la cuisine | IHM |
| Caméra de recul | capteur |
::::

::::exercice[QCM : systèmes embarqués]{niveau=1 type=quiz}
Une question à la fois : la correction s'affiche aussitôt.

1. Que signifie « temps réel » ?

   - [ ] le système affiche l'heure
   - [x] la réponse doit arriver dans un délai imposé
   - [ ] le système ne s'arrête jamais
   - [ ] la vidéo est en direct

   > Un frein doit réagir à temps.

1. Quelle est la différence entre sûreté et sécurité ?

   - [ ] aucune
   - [x] la sûreté concerne les erreurs, la sécurité les attaques
   - [ ] la sûreté concerne seulement les avions
   - [ ] la sécurité concerne seulement les mots de passe

   > Les deux sont indispensables.

1. Dans un thermostat, quel élément décide d'allumer le chauffage ?

   - [ ] le capteur
   - [x] le programme
   - [ ] l'écran
   - [ ] le mur

   > Il compare la mesure et la consigne.

1. Pourquoi la consommation est-elle un problème pour un objet connecté ?

   - [x] il fonctionne souvent sur pile
   - [ ] il est trop grand
   - [ ] il n'a pas de capteur
   - [ ] il ne se connecte jamais

   > La batterie doit durer longtemps.
::::

::::exercice[Les étapes d'un portail]{niveau=2 type=ordre}
Remets dans l'ordre le fonctionnement d'un portail automatique.

1. La personne appuie sur la télécommande.
1. Le programme reçoit la commande.
1. Le capteur vérifie l'absence d'obstacle.
1. Le programme commande le moteur.
1. Le moteur ouvre le portail.
::::

::::exercice[Un vélo à assistance électrique]{niveau=3}
Un vélo électrique mesure la force exercée sur les pédales. Le moteur aide davantage si le cycliste pédale fort. Le cycliste choisit un mode sur un petit écran. Au-dessus de 25 km/h, l'assistance doit s'arrêter.

1. Identifie deux capteurs, un actionneur et l'IHM.
2. Écris en français l'algorithme de contrôle, sous la forme « répéter sans fin ».
3. Pourquoi ce système doit-il respecter des contraintes de temps réel ? Donne un exemple.
4. Le vélo se connecte à une application. Donne un risque de sécurité.

:::criteres
- Capteurs de force et de vitesse, moteur, écran.
- Une boucle qui lit, décide selon la vitesse et la force, puis commande le moteur.
- Le moteur doit réagir rapidement.
- Accès au compte, position ou commande du vélo par un tiers.
:::

:::corrige
1. **Capteurs** : la force sur les pédales et la vitesse. **Actionneur** : le moteur. **IHM** : l'écran.
2. Répéter sans fin : lire la force et la vitesse ; si la vitesse dépasse 25 km/h, arrêter le moteur ; sinon, régler l'aide selon la force et le mode choisi.
3. Le moteur doit réagir tout de suite. S'il continue à pousser après l'arrêt du pédalage, le cycliste peut perdre le contrôle.
4. Une personne malveillante pourrait accéder au compte, connaître les trajets, ou tenter de commander le vélo.
:::
::::
