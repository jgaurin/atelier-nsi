---
titre: Programmer un objet connecté
resume: "Écrire des programmes simples qui lisent un capteur, commandent un actionneur et réagissent à une interface."
duree: 35
objectifs:
  - "Écrire des programmes simples d'acquisition de données"
  - "Écrire des programmes de commande d'un actionneur"
  - "Réaliser une IHM simple"
prerequis: [snt-objets/embarque, snt-python/boucles]
---

Dans un vrai objet connecté, un capteur envoie une mesure, et le programme commande un moteur ou une lampe. Ici, on simule l'objet : une **valeur** joue le rôle de la mesure du capteur, et le **résultat** de la fonction joue le rôle de l'ordre donné à l'actionneur.

## 1. Décider à partir d'une mesure

Une lampe doit s'allumer quand il fait sombre, c'est-à-dire quand la luminosité mesurée est inférieure à 30.

```python exec
def lampe(luminosite):
    if luminosite < 30:
        return "allumer"
    return "eteindre"

print(lampe(10), lampe(70))
```

La fonction reçoit la mesure du capteur, et renvoie l'ordre pour l'actionneur. Pour 10, il fait sombre : on allume. Pour 70, il fait clair : on éteint.

## 2. Traiter une série de mesures

Un capteur de température envoie une mesure toutes les heures. Combien de fois a-t-il fait plus de 25 °C ?

```python exec
mesures = [12, 18, 31, 27]
n = 0
for m in mesures:
    if m > 25:
        n = n + 1
print(n)
```

On parcourt les mesures une par une, et on compte celles qui dépassent 25 : 31 et 27, donc 2.

## 3. Envoyer une commande sous forme de texte

Un robot reçoit souvent ses ordres sous forme de **texte**. Par exemple, `"A50"` signifie : « moteur A, à 50 % de sa vitesse ». Il faut séparer la lettre et le nombre.

```python exec
message = "A50"
moteur = message[0]
vitesse = int(message[1:])
print(moteur, vitesse)
```

- `message[0]` est le premier caractère : `"A"`.
- `message[1:]` est tout le reste, à partir du caractère 1 : `"50"`.
- `int(...)` transforme le texte `"50"` en nombre 50, pour pouvoir calculer avec.

## 4. Une interface simple

Une **IHM** relie une action de l'utilisateur à un changement d'état. Un bouton qui allume et éteint une lumière inverse l'état à chaque appui :

```python exec
def bouton(etat):
    return not etat

lumiere = False
lumiere = bouton(lumiere)
print(lumiere)
lumiere = bouton(lumiere)
print(lumiere)
```

`not` transforme `False` en `True`, et `True` en `False` : le premier appui allume, le second éteint.

## L'essentiel

- Un capteur donne une valeur ; le programme décide ; l'actionneur reçoit l'ordre.
- Une boucle permet de traiter plusieurs mesures.
- Une commande comme `"A50"` se découpe : `message[0]` pour la lettre, `int(message[1:])` pour le nombre.
- Une IHM associe une action de l'utilisateur à un changement d'état.

## Exercices

::::exercice[Lire un programme]{niveau=1 type=reponses}
Donne ce que chaque programme affiche.

1. Que s'affiche-t-il ?

   ```python verifier
   def alarme(temperature):
       return temperature > 60

   print(alarme(60))
   ```

   - False

1. Que s'affiche-t-il ?

   ```python verifier
   message = "B75"
   print(int(message[1:]) + 5)
   ```

   - 80
::::

::::exercice[Compléter un arrosage]{niveau=1 type=completer}
La pompe s'allume si l'humidité est inférieure à 40.

```python trous
def pompe(humidite):
    [[if]] humidite [[<]] 40:
        return "allumer"
    return [["eteindre"]]
```
::::

::::exercice[Un ventilateur à trois vitesses]{niveau=2}
Écris `vitesse(temperature)`, qui renvoie 0 si la température est inférieure à 20, 50 de 20 à 29 inclus, et 100 à partir de 30.

```python depart
def vitesse(temperature):
    ...
```

```python tests
assert vitesse(19) == 0, "arrêt"
assert vitesse(20) == 50, "seuil 20"
assert vitesse(29) == 50, "29"
assert vitesse(30) == 100, "seuil 30"
```

:::corrige
```python solution
def vitesse(temperature):
    if temperature < 20:
        return 0
    elif temperature < 30:
        return 50
    return 100
```
:::
::::

::::exercice[Piloter un robot]{niveau=3}
Un robot reçoit des messages comme `"A50"` : la lettre désigne un moteur, le nombre sa vitesse.

1. Écris `decoder(message)`, qui renvoie le couple `(moteur, vitesse)`, avec la vitesse en entier.
2. Écris `ordre(distance)`, qui fabrique le message du moteur `A` selon la distance à un obstacle : `"A0"` en dessous de 20 cm, `"A30"` de 20 à 49 cm, et `"A100"` à partir de 50 cm.
3. Écris `vitesses_finales(messages)`, qui renvoie un dictionnaire associant à chaque moteur sa dernière vitesse reçue.
4. À l'écrit : dans ce système, qui joue le rôle du capteur ? de l'actionneur ?

```python depart
def decoder(message):
    ...

def ordre(distance):
    ...

def vitesses_finales(messages):
    ...
```

```python tests
assert decoder("A50") == ("A", 50), "décoder"
assert decoder("B5") == ("B", 5), "un seul chiffre"
assert ordre(19) == "A0", "obstacle proche"
assert ordre(20) == "A30", "seuil 20"
assert ordre(50) == "A100", "seuil 50"
assert vitesses_finales(["A50", "B20", "A75"]) == {"A": 75, "B": 20}, "dernières vitesses"
assert vitesses_finales([]) == {}, "aucun message"
```

:::corrige
```python solution
def decoder(message):
    return (message[0], int(message[1:]))

def ordre(distance):
    if distance < 20:
        return "A0"
    elif distance < 50:
        return "A30"
    return "A100"

def vitesses_finales(messages):
    v = {}
    for m in messages:
        moteur, vitesse = decoder(m)
        v[moteur] = vitesse
    return v
```

**Question 4.** Le **capteur** est celui qui mesure la distance. Les **actionneurs** sont les moteurs.
:::
::::
