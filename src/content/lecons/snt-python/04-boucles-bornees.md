---
titre: "Boucles bornées (for)"
resume: "Répéter un nombre de fois connu à l'avance avec for et range : les valeurs prises par la variable de boucle, l'accumulation (somme, compteur), le parcours d'un texte, et les erreurs classiques des élèves."
duree: 25
objectifs:
  - "Écrire une boucle for avec range et prévoir les valeurs de la variable de boucle"
  - "Utiliser une boucle pour accumuler (somme, compteur, produit)"
  - "Parcourir les caractères d'un texte avec for"
  - "Suivre une boucle dans un tableau d'état et repérer les erreurs classiques (range, indentation, initialisation)"
prerequis: [snt-python/conditions]
programme: [snt-programmation]
cartes:
  - q: "Quelles valeurs prend `i` dans `for i in range(5)` ?"
    r: "0, 1, 2, 3, 4 : `range(n)` commence à 0 et s'arrête **avant** n (n tours)."
  - q: "Et dans `for i in range(2, 6)` ?"
    r: "2, 3, 4, 5 : le début est inclus, la fin exclue."
  - q: "Quand utiliser une boucle bornée (`for`) ?"
    r: "Quand on sait **à l'avance** combien de fois répéter (ou qu'on parcourt tous les éléments d'un texte, d'une liste)."
  - q: "Schéma d'une somme avec une boucle ?"
    r: "`total = 0` **avant** la boucle, puis dans la boucle `total = total + …`, et on utilise `total` **après** la boucle."
  - q: "Que fait `for lettre in \"chat\":` ?"
    r: "La variable `lettre` prend successivement les valeurs \"c\", \"h\", \"a\", \"t\"."
---

Une **boucle bornée** répète des instructions un nombre de fois **connu à l'avance**. En Python, c'est la boucle `for`. C'est souvent la notion où
les élèves décrochent, parce qu'il faut suivre une variable qui change à chaque tour : le **tableau d'état** devient indispensable.

## Ce que dit le programme

Le programme de SNT cite les *boucles bornées et non bornées*. Une boucle bornée correspond à un nombre de répétitions fixé : en Python, `for` avec
`range`, ou le parcours d'un texte. Les élèves doivent savoir **écrire** une boucle pour répéter une action, calculer une **somme** ou **compter**, et
**prévoir** ce que fait une boucle simple. Les boucles imbriquées peuvent apparaître (parcourir les pixels d'une image en ligne et en colonne), mais
on ne les exige pas sans accompagnement.

## La notion

```python exec
for i in range(4):
    print("Tour numéro", i)
print("Fini")
```

- `range(4)` produit les valeurs **0, 1, 2, 3** : 4 tours, en commençant à 0.
- La variable `i` prend ces valeurs **une par une** ; le bloc indenté est exécuté à chaque tour.
- La ligne non indentée (`print("Fini")`) s'exécute **une seule fois**, après la boucle.

| Écriture | Valeurs de `i` |
|---|---|
| `range(5)` | 0, 1, 2, 3, 4 |
| `range(1, 6)` | 1, 2, 3, 4, 5 |
| `range(0, 10, 2)` | 0, 2, 4, 6, 8 |

**Accumuler.** Le schéma le plus important : une variable **initialisée avant** la boucle, **mise à jour** dans la boucle, **utilisée après**.

```python exec
total = 0
for k in range(1, 6):
    total = total + k
print("1 + 2 + 3 + 4 + 5 =", total)
```

| Tour | `k` | `total` après le tour |
|---|---|---|
| 1 | 1 | 1 |
| 2 | 2 | 3 |
| 3 | 3 | 6 |
| 4 | 4 | 10 |
| 5 | 5 | 15 |

**Parcourir un texte.** `for` parcourt aussi directement les caractères d'une chaîne :

```python exec
mot = "bonjour"
nb_o = 0
for lettre in mot:
    if lettre == "o":
        nb_o = nb_o + 1
print(nb_o)
```

## Les erreurs classiques des élèves

:::attention[Ce que tu verras en classe]
- **`range(1, 10)` pour aller jusqu'à 10** : la fin est exclue, il faut `range(1, 11)`.
- **Initialiser dans la boucle** : `total = 0` placé **dans** la boucle remet le total à zéro à chaque tour.
- **Le `print` dans la boucle** au lieu d'après : le résultat s'affiche à chaque tour.
- **Modifier la variable de boucle** (`i = i + 1` dans un `for`) en croyant sauter un tour : c'est inutile, `for` gère `i` tout seul.
- **Oublier les deux-points** ou l'**indentation**, comme pour `if`.
- **Confondre l'indice et la valeur** quand on parcourt un texte.
:::

## En classe

:::methode[Faire comprendre la boucle]
1. **Sans ordinateur** : « Écris 5 fois *je ne bavarde pas* » au tableau, puis la même chose avec une boucle : la boucle évite de se répéter.
2. **Tableau d'état obligatoire** sur une somme : les élèves remplissent une ligne par tour, puis vérifient avec `print` dans la boucle.
3. **Faire varier `range`** : prédire les valeurs de `range(5)`, `range(1, 6)`, `range(0, 10, 2)` avant d'exécuter.
4. **Applications aux thèmes** : compter les lettres d'un message, calculer une moyenne de valeurs d'un capteur, assombrir tous les pixels d'une ligne.
:::

## L'essentiel

- `for i in range(n)` répète **n** fois, avec `i` = 0, 1, …, n-1 ; `range(a, b)` va de a à b-1.
- Le bloc indenté est répété ; ce qui suit sans indentation s'exécute après la boucle.
- Accumuler : **initialiser avant**, **mettre à jour dans**, **utiliser après**.
- `for lettre in texte` parcourt les caractères d'un texte.
- Le **tableau d'état** (une ligne par tour) est l'outil pour comprendre une boucle.

## Exercices

::::exercice[Grand QCM : boucles bornées]{niveau=1 type=quiz}
Douze questions sur les boucles `for`.

1. Combien de fois `bonjour` est-il affiché ?

   ```python
   for i in range(3):
       print("bonjour")
   ```

   - [ ] 2
   - [x] 3
   - [ ] 4
   - [ ] 1

   > `range(3)` produit 0, 1, 2 : trois tours.

1. Quelles valeurs prend `i` dans `for i in range(4)` ?

   - [ ] 1, 2, 3, 4
   - [x] 0, 1, 2, 3
   - [ ] 0, 1, 2, 3, 4
   - [ ] 4

   > `range(n)` commence à 0 et s'arrête avant n.

1. Quelles valeurs prend `i` dans `for i in range(2, 5)` ?

   - [x] 2, 3, 4
   - [ ] 2, 3, 4, 5
   - [ ] 3, 4, 5
   - [ ] 2, 5

   > Le début est inclus, la fin est exclue.

1. Que vaut `s` à la fin ?

   ```python
   s = 0
   for k in range(4):
       s = s + k
   ```

   - [ ] 10
   - [x] 6
   - [ ] 4
   - [ ] 3

   > k prend 0, 1, 2, 3 : 0 + 1 + 2 + 3 = 6. Piège : `range(4)` ne contient pas 4.

1. Pour calculer 1 + 2 + … + 10, quelle boucle utiliser ?

   - [ ] `for k in range(10):`
   - [x] `for k in range(1, 11):`
   - [ ] `for k in range(1, 10):`
   - [ ] `for k in range(11, 1):`

   > Il faut que k prenne les valeurs 1 à 10 : la fin, exclue, doit être 11.

1. Qu'affiche ce programme ?

   ```python
   total = 0
   for k in range(3):
       total = 0
       total = total + 5
   print(total)
   ```

   - [ ] 15
   - [x] 5
   - [ ] 0
   - [ ] 3

   > `total = 0` est **dans** la boucle : il est remis à zéro à chaque tour. Erreur classique d'initialisation.

1. Combien de lignes affiche ce programme ?

   ```python
   for i in range(3):
       print(i)
   print("fin")
   ```

   - [ ] 3
   - [x] 4
   - [ ] 6
   - [ ] 2

   > Trois lignes dans la boucle (0, 1, 2), puis « fin » une seule fois, car il n'est pas indenté.

1. Quelles valeurs prend `i` dans `for i in range(0, 10, 3)` ?

   - [x] 0, 3, 6, 9
   - [ ] 0, 3, 6, 9, 12
   - [ ] 3, 6, 9
   - [ ] 0, 10, 3

   > Le troisième nombre est le **pas** : on avance de 3 en 3, en restant sous 10.

1. Que vaut `n` à la fin ?

   ```python
   n = 0
   for lettre in "banane":
       if lettre == "a":
           n = n + 1
   ```

   - [ ] 3
   - [x] 2
   - [ ] 6
   - [ ] 1

   > La boucle parcourt les 6 lettres ; « a » apparaît deux fois.

1. Quand préfère-t-on une boucle `for` à une boucle `while` ?

   - [x] quand on connaît à l'avance le nombre de répétitions
   - [ ] quand on ne sait pas combien de fois répéter
   - [ ] jamais, `while` est toujours mieux
   - [ ] seulement pour afficher du texte

   > `for` est la boucle **bornée** : nombre de tours fixé. `while` sert quand on répète tant qu'une condition est vraie.

1. Que vaut `p` à la fin ?

   ```python
   p = 1
   for k in range(1, 5):
       p = p * k
   ```

   - [ ] 10
   - [x] 24
   - [ ] 120
   - [ ] 0

   > 1 × 1 × 2 × 3 × 4 = 24. Pour un produit, on initialise à **1**, pas à 0.

1. Un élève écrit `i = i + 2` dans le bloc d'un `for i in range(10):` pour « sauter » des valeurs. Que se passe-t-il ?

   - [ ] la boucle saute bien une valeur sur deux
   - [x] rien de visible sur les tours : au tour suivant, `for` redonne à `i` la valeur suivante de `range`
   - [ ] une erreur
   - [ ] la boucle devient infinie

   > Avec `for`, c'est `range` qui fournit les valeurs. Pour sauter, on utilise le **pas** : `range(0, 10, 2)`.
::::

::::exercice[Somme des n premiers entiers]{niveau=1}
Écris `somme(n)` qui renvoie 1 + 2 + … + n avec une boucle `for`.

```python depart
def somme(n):
    ...
```

```python tests
assert somme(5) == 15, "1 + 2 + 3 + 4 + 5 = 15"
assert somme(1) == 1, "un seul terme"
assert somme(100) == 5050, "la somme de Gauss"
```

:::corrige
```python solution
def somme(n):
    total = 0
    for k in range(1, n + 1):
        total = total + k
    return total
```
:::
::::

::::exercice[Compter les voyelles]{niveau=2}
Écris `nb_voyelles(texte)` qui renvoie le nombre de voyelles (a, e, i, o, u, y) d'un texte en minuscules.

```python depart
def nb_voyelles(texte):
    ...
```

```python tests
assert nb_voyelles("bonjour") == 3, "o, o, u"
assert nb_voyelles("python") == 2, "y et o"
assert nb_voyelles("rythme") == 2, "y et e"
assert nb_voyelles("") == 0, "texte vide"
```

:::indice
Parcours les lettres avec `for lettre in texte:` et teste `if lettre in "aeiouy":`.
:::

:::corrige
```python solution
def nb_voyelles(texte):
    n = 0
    for lettre in texte:
        if lettre in "aeiouy":
            n = n + 1
    return n
```
:::
::::

::::exercice[Table de multiplication]{niveau=2}
Écris `table(n)` qui renvoie le **texte** de la table de multiplication de `n` de 1 à 10, une ligne par résultat (par exemple `"3 x 1 = 3"`), les
lignes séparées par `"\n"`.

```python depart
def table(n):
    ...
```

```python tests
assert table(3).split("\n")[0] == "3 x 1 = 3", "première ligne"
assert table(3).split("\n")[-1] == "3 x 10 = 30", "dernière ligne"
assert len(table(7).split("\n")) == 10, "dix lignes"
```

:::corrige
```python solution
def table(n):
    lignes = ""
    for k in range(1, 11):
        lignes = lignes + str(n) + " x " + str(k) + " = " + str(n * k)
        if k < 10:
            lignes = lignes + "\n"
    return lignes
```

En classe, on commence plutôt par **afficher** la table avec `print` dans la boucle ; construire un texte est une étape de plus.
:::
::::
