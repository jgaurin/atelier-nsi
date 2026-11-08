---
titre: Variables et affectation
resume: "Ranger une valeur dans une variable, connaître les types de base et faire des calculs."
duree: 30
objectifs:
  - "Affecter une valeur à une variable"
  - "Reconnaître les types de base"
  - "Utiliser les opérations courantes"
---

Une **variable** est un nom qui désigne une valeur. On la crée avec une **affectation**.

## 1. L'affectation

```python exec
age = 15
age = age + 1
print(age)
```

Le signe `=` ne veut pas dire « égal » : il **range** à gauche la valeur calculée à droite. La ligne `age = age + 1` prend donc l'ancienne valeur, ajoute 1, et remplace.

## 2. Les types

| Type | Exemple | Sens |
| --- | --- | --- |
| `int` | `15` | nombre entier |
| `float` | `1.75` | nombre à virgule, écrit avec un point |
| `str` | `"Léa"` | texte, entre guillemets |
| `bool` | `True` | vrai ou faux |

## 3. Les opérations

| Opération | Exemple | Résultat |
| --- | --- | --- |
| addition, soustraction, multiplication | `2 + 3 * 4` | 14 |
| division | `7 / 2` | 3.5 |
| quotient entier | `7 // 2` | 3 |
| reste | `7 % 2` | 1 |
| puissance | `2 ** 3` | 8 |

On peut coller deux textes avec `+` : `"bon" + "jour"` donne `"bonjour"`.

:::attention
`"3" + 4` provoque une erreur : on ne peut pas ajouter un texte et un nombre.
:::

## L'essentiel

- `nom = valeur` range une valeur dans une variable.
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
