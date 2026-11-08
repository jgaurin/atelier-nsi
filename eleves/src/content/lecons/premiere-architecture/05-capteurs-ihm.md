---
titre: Capteurs, actionneurs et IHM
resume: "Comment une machine mesure le monde et agit dessus, et comment programmer une interface simple."
duree: 35
programmation: true
objectifs:
  - "Identifier le rôle des capteurs et des actionneurs"
  - "Écrire un programme répondant à un cahier des charges simple"
prerequis: [premiere-architecture/von-neumann]
---

Un robot, un thermostat ou un téléphone mesurent ce qui les entoure et réagissent.

## 1. Capteurs et actionneurs

- Un **capteur** mesure une grandeur physique : température, lumière, distance.
- Un **actionneur** agit sur le monde : moteur, LED, haut-parleur.
- Entre les deux, un **programme** décide.

## 2. Le schéma d'un programme

```
répéter sans fin :
    lire le capteur
    décider
    commander l'actionneur
```

## 3. Une interface homme-machine

Une **IHM** permet à une personne de commander la machine : boutons, écran, écran tactile. On commence par rédiger un **cahier des charges** : ce que le système doit faire dans chaque situation.

:::exemple
Cahier des charges d'une veilleuse : la lampe s'allume si la luminosité est inférieure à 30, et si le bouton est en position marche.
:::

```python exec
def lampe_allumee(luminosite, marche):
    return marche and luminosite < 30

print(lampe_allumee(10, True), lampe_allumee(50, True), lampe_allumee(10, False))
```

## L'essentiel

- Capteur : il mesure. Actionneur : il agit. Programme : il décide.
- Une IHM permet à une personne de commander la machine.
- Un cahier des charges décrit le comportement attendu.

## Exercices

::::exercice[Capteur ou actionneur ?]{niveau=1 type=associer}
Classe chaque composant.

| Composant | Catégorie |
| --- | --- |
| Thermomètre | capteur |
| Moteur | actionneur |
| Micro | capteur |
| Haut-parleur | actionneur |
| LED | actionneur |
::::

::::exercice[Lire un programme de pilotage]{niveau=1 type=reponses}
Donne ce que le programme affiche.

1. Réponds `True` ou `False`.

   ```python verifier
   def ventilateur(temp):
       return temp >= 28

   print(ventilateur(28))
   ```

   - True

1. Que s'affiche-t-il ?

   ```python verifier
   mesures = [18, 22, 31, 25]
   n = 0
   for m in mesures:
       if m > 24:
           n = n + 1
   print(n)
   ```

   - 2
::::

::::exercice[Un portail automatique]{niveau=1}
Cahier des charges : le portail s'ouvre si un badge valide est présenté et si aucun obstacle n'est détecté. Écris `portail_ouvert(badge, obstacle)`, où les deux paramètres sont des booléens.

```python depart
def portail_ouvert(badge, obstacle):
    ...
```

```python tests
assert portail_ouvert(True, False) is True, "badge et pas d'obstacle"
assert portail_ouvert(True, True) is False, "obstacle"
assert portail_ouvert(False, False) is False, "pas de badge"
```

:::corrige
```python solution
def portail_ouvert(badge, obstacle):
    return badge and not obstacle
```
:::
::::

::::exercice[Un thermostat]{niveau=2}
Écris `commande(temperature, consigne)` qui renvoie `"chauffer"` si la température est inférieure à la consigne de plus de 1 degré, `"couper"` si elle lui est supérieure de plus de 1 degré, et `"attendre"` sinon.

```python depart
def commande(temperature, consigne):
    ...
```

```python tests
assert commande(17, 20) == "chauffer", "trop froid"
assert commande(23, 20) == "couper", "trop chaud"
assert commande(20, 20) == "attendre", "à la consigne"
assert commande(19, 20) == "attendre", "exactement 1 degré d'écart"
assert commande(21, 20) == "attendre", "exactement 1 degré d'écart"
```

:::corrige
```python solution
def commande(temperature, consigne):
    if temperature < consigne - 1:
        return "chauffer"
    if temperature > consigne + 1:
        return "couper"
    return "attendre"
```
:::
::::
