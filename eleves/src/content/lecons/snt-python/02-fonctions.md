---
titre: Les fonctions
resume: "Donner un nom à un calcul pour le réutiliser avec des valeurs différentes."
duree: 30
objectifs:
  - "Définir une fonction avec des paramètres"
  - "Renvoyer un résultat avec return"
  - "Appeler une fonction"
prerequis: [snt-python/variables]
---

Une **fonction** donne un nom à un calcul. On l'écrit une fois, puis on l'utilise autant qu'on veut.

## 1. Définir et appeler

```python exec
def double(x):
    return 2 * x

print(double(4))
print(double(10))
```

- `def` commence la définition, et la ligne finit par `:`.
- `x` est un **paramètre** : il reçoit la valeur donnée à l'appel.
- Les lignes de la fonction sont **décalées** vers la droite : c'est l'**indentation**.
- `return` renvoie le résultat et termine la fonction.

## 2. Plusieurs paramètres

```python exec
def aire_rectangle(longueur, largeur):
    return longueur * largeur

print(aire_rectangle(5, 3))
```

## 3. `return` n'est pas `print`

`print` **affiche** à l'écran. `return` **donne** le résultat au programme, qui peut s'en resservir.

```python exec
def carre(x):
    return x * x

print(carre(3) + 1)
```

Sans `return`, la fonction renvoie la valeur spéciale `None`.

## L'essentiel

- `def nom(parametres):` définit une fonction.
- `return` renvoie le résultat.
- On appelle une fonction en écrivant son nom et ses valeurs entre parenthèses.

## Exercices

::::exercice[QCM : fonctions]{niveau=1 type=quiz}
Une question à la fois : la correction s'affiche aussitôt.

1. Quel mot commence la définition d'une fonction ?

   - [ ] `function`
   - [x] `def`
   - [ ] `return`
   - [ ] `print`

   > `def` vient de « define ».

1. Que renvoie `f(3)` si `def f(x): return x + 1` ?

   - [ ] 3
   - [x] 4
   - [ ] `x + 1`
   - [ ] rien

   > x reçoit 3, donc la fonction renvoie 4.

1. À quoi sert `return` ?

   - [x] à renvoyer un résultat
   - [ ] à afficher un texte
   - [ ] à créer une variable
   - [ ] à recommencer la fonction

   > `print` affiche, `return` renvoie.

1. Dans `def aire(a, b):`, que sont `a` et `b` ?

   - [ ] des fonctions
   - [x] des paramètres
   - [ ] des textes
   - [ ] des résultats

   > Ils reçoivent les valeurs données à l'appel.
::::

::::exercice[Compléter une fonction]{niveau=1 type=completer}
Cette fonction renvoie le périmètre d'un carré de côté `c`.

```python trous
[[def]] perimetre(c)[[:]]
    [[return]] 4 * [[c]]
```
::::

::::exercice[Un prix avec réduction]{niveau=2}
Écris `prix_reduit(prix, reduction)`, qui renvoie le prix après une réduction en pourcentage. Par exemple, `prix_reduit(50, 20)` renvoie `40.0`.

```python depart
def prix_reduit(prix, reduction):
    ...
```

```python tests
assert prix_reduit(50, 20) == 40.0, "20 % sur 50"
assert prix_reduit(80, 0) == 80.0, "pas de réduction"
assert prix_reduit(30, 100) == 0.0, "gratuit"
```

:::corrige
```python solution
def prix_reduit(prix, reduction):
    return prix * (1 - reduction / 100)
```
:::
::::

::::exercice[Le coût d'un trajet]{niveau=3}
Un trajet en voiture consomme 6 litres pour 100 km, et un litre coûte `prix_litre` euros.

1. Écris `litres(km)`, qui renvoie la quantité d'essence consommée.
2. Écris `cout(km, prix_litre)`, qui renvoie le coût du trajet, en utilisant `litres`.
3. Écris `cout_par_personne(km, prix_litre, personnes)`, en utilisant `cout`.
4. À l'écrit : quel est l'intérêt d'utiliser `litres` dans `cout`, si la consommation de la voiture change ?

```python depart
def litres(km):
    ...

def cout(km, prix_litre):
    ...

def cout_par_personne(km, prix_litre, personnes):
    ...
```

```python tests
assert litres(100) == 6, "100 km"
assert litres(50) == 3, "50 km"
assert cout(100, 2) == 12, "coût"
assert cout_par_personne(100, 2, 4) == 3, "partage"
```

:::corrige
```python solution
def litres(km):
    return km * 6 / 100

def cout(km, prix_litre):
    return litres(km) * prix_litre

def cout_par_personne(km, prix_litre, personnes):
    return cout(km, prix_litre) / personnes
```

**Question 4.** On ne modifie qu'une seule ligne, dans `litres` : les autres fonctions restent justes.
:::
::::
