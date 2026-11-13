---
titre: Variables et affectation
resume: "Ranger une valeur dans une variable, connaître les types de base et faire des calculs."
duree: 30
objectifs:
  - "Affecter une valeur à une variable"
  - "Reconnaître les types de base"
  - "Utiliser les opérations courantes"
---

Un programme a besoin de retenir des informations : un score, un prix, un prénom. Il les range dans des **variables**.

## 1. Une variable, c'est une étiquette

Imagine une étiquette sur laquelle on écrit un nom, et qu'on colle sur une valeur. Quand on écrit `age = 15`, on colle l'étiquette `age` sur la valeur 15. Ensuite, chaque fois qu'on écrit `age`, Python va chercher la valeur qui porte cette étiquette.

```python exec
age = 15
print(age)
age = age + 1
print(age)
```

## 2. Le signe `=` ne veut pas dire « égal »

En mathématiques, `age = age + 1` serait absurde. En Python, `=` est une **affectation** : Python calcule d'abord ce qui est **à droite**, puis range le résultat dans la variable **à gauche**.

Pour `age = age + 1`, Python fait donc :

1. il lit la valeur actuelle de `age` : 15 ;
2. il calcule 15 + 1 = 16 ;
3. il range 16 dans `age`, à la place de 15.

:::exemple
Que vaut `b` à la fin ?

```python
a = 4
b = a + 3
a = 10
```

| Ligne | `a` | `b` |
| --- | --- | --- |
| `a = 4` | 4 | |
| `b = a + 3` | 4 | 7 |
| `a = 10` | 10 | 7 |

`b` vaut 7. Quand on a calculé `b`, `a` valait 4. Changer `a` ensuite ne modifie pas `b`.
:::

Pour suivre un programme à la main, on fait toujours ce genre de tableau : une colonne par variable, une ligne par instruction.

## 3. Les types de valeurs

| Type | Exemple | Sens |
| --- | --- | --- |
| `int` | `15` | nombre entier |
| `float` | `1.75` | nombre à virgule, écrit avec un **point** |
| `str` | `"Léa"` | texte, entre guillemets |
| `bool` | `True` ou `False` | vrai ou faux |

## 4. Les opérations

| Opération | Exemple | Résultat | Explication |
| --- | --- | --- | --- |
| addition, soustraction, multiplication | `2 + 3 * 4` | 14 | la multiplication passe avant, comme en maths |
| division | `7 / 2` | 3.5 | toujours un nombre à virgule |
| quotient entier | `7 // 2` | 3 | combien de fois 2 tient dans 7 |
| reste | `7 % 2` | 1 | ce qui reste : 7 = 3 × 2 + 1 |
| puissance | `2 ** 3` | 8 | 2 × 2 × 2 |

`//` et `%` servent souvent ensemble. Pour convertir 130 minutes : `130 // 60` donne 2 heures, et `130 % 60` donne les 10 minutes restantes.

On peut aussi coller deux textes avec `+` : `"bon" + "jour"` donne `"bonjour"`.

:::attention
`"3" + 4` provoque une erreur : `"3"` est un texte, pas un nombre. Python refuse d'ajouter un texte et un nombre.
:::

## L'essentiel

- `nom = valeur` range une valeur dans une variable ; Python calcule d'abord la droite, puis range à gauche.
- Pour suivre un programme, on fait un tableau des valeurs de chaque variable.
- Types de base : `int`, `float`, `str`, `bool`.
- `//` donne le quotient entier, `%` le reste, `**` la puissance.

## Exercices

::::exercice[QCM : variables]{niveau=1 type=quiz}
Une question à la fois : la correction s'affiche aussitôt.

1. Que fait `x = 5` ?

   - [ ] compare x et 5
   - [x] range 5 dans la variable x
   - [ ] affiche 5
   - [ ] crée un texte

   > Le signe `=` est une affectation.

1. Quel est le type de `"12"` ?

   - [ ] `int`
   - [ ] `float`
   - [x] `str`
   - [ ] `bool`

   > Les guillemets indiquent un texte.

1. Que vaut `7 % 3` ?

   - [x] 1
   - [ ] 2
   - [ ] 2.33
   - [ ] 21

   > 7 = 2 × 3 + 1 : le reste vaut 1.

1. Que vaut `9 // 2` ?

   - [ ] 4.5
   - [x] 4
   - [ ] 5
   - [ ] 1

   > C'est le quotient entier.
::::

::::exercice[Que s'affiche-t-il ?]{niveau=1 type=reponses}
Lis chaque programme et donne ce qu'il affiche.

1. Que s'affiche-t-il ?

   ```python verifier
   a = 4
   b = a + 3
   a = 10
   print(b)
   ```

   - 7

   > `b` a reçu 7. Changer `a` ensuite ne modifie pas `b`.

1. Que s'affiche-t-il ?

   ```python verifier
   x = 2
   x = x * x
   x = x + 1
   print(x)
   ```

   - 5

1. Que s'affiche-t-il ?

   ```python verifier
   print("NS" + "I")
   ```

   - NSI
::::

::::exercice[Le prix des places]{niveau=2}
Une place coûte 8,50 € et on en achète 4. Complète le programme pour que `total` contienne le prix à payer, et `rendu` la monnaie rendue sur 50 €.

```python depart
prix = 8.5
places = 4
total = ...
rendu = ...
```

```python tests
assert total == 34.0, "4 places à 8,50 €"
assert rendu == 16.0, "50 € moins le total"
```

:::corrige
```python solution
prix = 8.5
places = 4
total = prix * places
rendu = 50 - total
```

On réutilise les variables au lieu de réécrire les nombres : le programme reste juste si le prix change.
:::
::::

::::exercice[Convertir une durée]{niveau=3}
Une vidéo dure `7384` secondes. Calcule, avec `//` et `%`, le nombre d'`heures`, de `minutes` restantes et de `secondes` restantes.

À l'écrit : pourquoi `minutes = duree // 60` ne convient-il pas ici ?

```python depart
duree = 7384
heures = ...
minutes = ...
secondes = ...
```

```python tests
assert heures == 2, "2 heures"
assert minutes == 3, "3 minutes"
assert secondes == 4, "4 secondes"
```

:::corrige
```python solution
duree = 7384
heures = duree // 3600
minutes = (duree % 3600) // 60
secondes = duree % 60
```

`duree % 3600` donne ce qui reste après avoir retiré les heures entières. `duree // 60` donnerait 123 : le nombre total de minutes, heures comprises.
:::
::::
