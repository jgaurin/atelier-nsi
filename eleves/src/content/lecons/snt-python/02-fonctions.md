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

Quand tu calcules souvent la même chose, avec des nombres différents, tu ne veux pas réécrire le calcul à chaque fois. Tu lui donnes un nom une fois pour toutes : c'est une **fonction**. C'est comme une recette : on l'écrit une fois, puis on la suit avec les ingrédients du jour.

## 1. Définir une fonction

```python exec
def double(x):
    return 2 * x
```

- `def` annonce qu'on **définit** une fonction, ici nommée `double`.
- `x` est un **paramètre** : une variable qui recevra la valeur donnée au moment de l'appel.
- La ligne se termine par `:`, et les lignes de la fonction sont **décalées** vers la droite. Ce décalage, l'**indentation**, indique ce qui fait partie de la fonction.
- `return` renvoie le résultat et termine la fonction.

Définir une fonction ne l'exécute pas : on a seulement écrit la recette.

## 2. Appeler une fonction

```python exec
def double(x):
    return 2 * x

print(double(4))
print(double(10))
```

Quand Python lit `double(4)` :

1. il donne la valeur 4 au paramètre `x` ;
2. il exécute les lignes de la fonction : `2 * 4` ;
3. `return` renvoie 8, qui remplace `double(4)` à l'endroit de l'appel.

## 3. Plusieurs paramètres

```python exec
def aire_rectangle(longueur, largeur):
    return longueur * largeur

print(aire_rectangle(5, 3))
```

Les valeurs sont données **dans l'ordre** des paramètres : `longueur` reçoit 5 et `largeur` reçoit 3.

## 4. `return` n'est pas `print`

- `print` **affiche** une valeur à l'écran, pour la personne qui regarde.
- `return` **renvoie** la valeur au programme, qui peut s'en resservir dans un calcul.

```python exec
def carre(x):
    return x * x

resultat = carre(3) + 1
print(resultat)
```

`carre(3)` vaut 9, et on peut l'utiliser dans un calcul : 9 + 1 = 10. Si la fonction faisait seulement `print(x * x)`, elle afficherait 9, mais ne renverrait rien d'utilisable : elle renverrait la valeur spéciale `None`, et `None + 1` provoquerait une erreur.

## 5. Des fonctions qui en utilisent d'autres

Une fonction peut en appeler une autre :

```python exec
def prix_ttc(prix_ht):
    return prix_ht * 1.2

def prix_total(prix_ht, quantite):
    return prix_ttc(prix_ht) * quantite

print(prix_total(10, 3))
```

Si le taux de TVA change, on ne modifie qu'une ligne, dans `prix_ttc`.

## L'essentiel

- `def nom(parametres):` définit une fonction ; son contenu est indenté.
- À l'appel, les paramètres reçoivent les valeurs données, dans l'ordre.
- `return` renvoie le résultat au programme ; `print` ne fait que l'afficher.

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
