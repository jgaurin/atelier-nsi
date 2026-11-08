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

## 4. Programmer une IHM

Une IHM garde un **état**, réagit à des **événements** et met à jour l'**affichage**.

```python exec
etat = {"marche": False}

def traiter(evenement):
    if evenement == "bouton":
        etat["marche"] = not etat["marche"]

def affichage():
    if etat["marche"]:
        return "Lampe allumée"
    return "Lampe éteinte"

traiter("bouton")
print(affichage())
```

## L'essentiel

- Capteur : il mesure. Actionneur : il agit. Programme : il décide.
- Une IHM permet à une personne de commander la machine.
- Un cahier des charges décrit le comportement attendu.
- Une IHM garde un état, réagit aux événements et met à jour l'affichage.

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

::::exercice[Un portail automatique]{niveau=2}
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

::::exercice[L'interface d'un thermostat]{niveau=3}
Un thermostat a trois boutons. Voici son cahier des charges.

- L'état contient `"marche"` (booléen) et `"consigne"` (entier). Au départ, il est à l'arrêt, avec une consigne de 19.
- Le bouton `"marche"` allume ou éteint l'appareil.
- Les boutons `"plus"` et `"moins"` changent la consigne de 1, seulement si l'appareil est en marche. La consigne reste entre 15 et 25.
- L'écran affiche `"ARRET"` à l'arrêt. En marche, il affiche la consigne suivie de `" chauffe"` si la température est inférieure à la consigne, sinon de `" veille"`.

1. Écris `traiter(etat, evenement)`, qui modifie `etat`.
2. Écris `affichage(etat, temperature)`, qui renvoie le texte de l'écran.
3. Écris `simuler(evenements)`, qui part de l'état initial, traite les événements dans l'ordre et renvoie l'état final.
4. À l'écrit : dans ce système, quel élément est le capteur ? l'actionneur ? Quelle partie constitue l'IHM ?

```python depart
def traiter(etat, evenement):
    ...

def affichage(etat, temperature):
    ...

def simuler(evenements):
    ...
```

```python tests
e = {"marche": False, "consigne": 19}
traiter(e, "plus")
assert e["consigne"] == 19, "à l'arrêt, rien ne change"
traiter(e, "marche")
assert e["marche"] is True, "mise en marche"
traiter(e, "plus")
assert e["consigne"] == 20, "plus"
traiter(e, "moins")
assert e["consigne"] == 19, "moins"
assert affichage({"marche": False, "consigne": 19}, 10) == "ARRET", "arrêt"
assert affichage({"marche": True, "consigne": 19}, 10) == "19 chauffe", "chauffe"
assert affichage({"marche": True, "consigne": 19}, 19) == "19 veille", "veille"
assert simuler([]) == {"marche": False, "consigne": 19}, "aucun événement"
assert simuler(["marche"] + ["plus"] * 10)["consigne"] == 25, "maximum"
assert simuler(["marche"] + ["moins"] * 10)["consigne"] == 15, "minimum"
```

:::corrige
```python solution
def traiter(etat, evenement):
    if evenement == "marche":
        etat["marche"] = not etat["marche"]
    elif etat["marche"]:
        if evenement == "plus" and etat["consigne"] < 25:
            etat["consigne"] = etat["consigne"] + 1
        elif evenement == "moins" and etat["consigne"] > 15:
            etat["consigne"] = etat["consigne"] - 1

def affichage(etat, temperature):
    if not etat["marche"]:
        return "ARRET"
    if temperature < etat["consigne"]:
        return str(etat["consigne"]) + " chauffe"
    return str(etat["consigne"]) + " veille"

def simuler(evenements):
    etat = {"marche": False, "consigne": 19}
    for ev in evenements:
        traiter(etat, ev)
    return etat
```

**Question 4.** Le **capteur** est le thermomètre. L'**actionneur** est le chauffage. L'**IHM** comprend les boutons et l'écran.
:::
::::
