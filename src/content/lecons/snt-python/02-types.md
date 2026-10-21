---
titre: "Les types de base : nombres, textes, booléens"
resume: "Entiers, flottants, chaînes de caractères et booléens : ce que les élèves de seconde manipulent, les opérations utiles (/, //, %), les conversions et les pièges du niveau seconde."
duree: 25
objectifs:
  - "Reconnaître le type d'une valeur (int, float, str, bool) et prévoir le type d'un résultat"
  - "Utiliser les opérations courantes : + - * /, // et %, ** ; la concaténation de textes"
  - "Convertir une valeur avec int(), float(), str() ; comprendre le rôle de input()"
  - "Anticiper les erreurs classiques des élèves (\"5\" + 3, input qui renvoie un texte)"
prerequis: [snt-python/variables]
programme: [snt-programmation]
cartes:
  - q: "Les quatre types de base vus en seconde ?"
    r: "`int` (entiers : 3, -12), `float` (nombres à virgule : 2.5, notés avec un **point**), `str` (textes entre guillemets : \"bonjour\") et `bool` (`True` ou `False`)."
  - q: "Que valent `7 / 2`, `7 // 2` et `7 % 2` ?"
    r: "`3.5` (division décimale), `3` (quotient entier) et `1` (reste)."
  - q: "Que renvoie toujours `input()` ?"
    r: "Une **chaîne de caractères** (`str`), même si l'utilisateur tape un nombre : il faut convertir avec `int(...)` ou `float(...)`."
  - q: "Que donne `\"5\" + \"3\"` ? et `\"5\" + 3` ?"
    r: "`\"53\"` (concaténation de textes) ; `\"5\" + 3` provoque une erreur `TypeError` : on ne peut pas additionner un texte et un nombre."
  - q: "Comment savoir si un nombre `n` est pair ?"
    r: "Avec le reste de la division par 2 : `n % 2 == 0`."
  - q: "Comment afficher un texte et un nombre ensemble ?"
    r: "`print(\"Tu as\", age, \"ans\")` (virgules) ou `\"Tu as \" + str(age) + \" ans\"` (conversion puis concaténation)."
---

Une valeur a toujours un **type**, qui dit ce qu'elle représente et quelles opérations on peut faire avec. En seconde, on n'en fait pas un cours
théorique : les élèves rencontrent les types **en programmant**, souvent à cause d'une erreur (« pourquoi `"5" + 3` ne marche pas ? »). Cette fiche
liste ce qu'ils doivent maîtriser et la façon de leur faire comprendre.

## Ce que dit le programme

En SNT, les types ne sont pas un contenu à part : ils accompagnent *affectations et variables*. Les élèves manipulent des **nombres** (entiers et
décimaux), des **textes** et des **booléens** (résultats de comparaisons, utilisés dans les conditions). Le programme de mathématiques de seconde cite
aussi explicitement les types entiers, flottants, chaînes de caractères et booléens.

Ce qui **n'est pas** attendu : la représentation en mémoire (binaire, flottants approchés), qui relève de la NSI en première. On peut juste signaler
que les calculs à virgule sont parfois approchés si la question arrive.

## La notion

| Type | Ce qu'il représente | Exemples |
|---|---|---|
| `int` | nombre entier | `3`, `-12`, `2024` |
| `float` | nombre à virgule (avec un **point**) | `2.5`, `-0.1`, `3.0` |
| `str` | texte (chaîne de caractères), entre guillemets | `"bonjour"`, `'Léa'`, `"42"` |
| `bool` | vrai ou faux | `True`, `False` |

```python exec
print(type(15), type(2.5), type("15"), type(15 > 3))
```

**Les opérations sur les nombres.** En plus de `+`, `-`, `*`, Python a **trois** façons utiles de diviser :

```python exec
print(17 / 5)    # division décimale : 3.4
print(17 // 5)   # quotient entier : 3
print(17 % 5)    # reste : 2
print(2 ** 10)   # puissance : 1024
```

Le reste `%` sert énormément en classe : savoir si un nombre est **pair** (`n % 2 == 0`), récupérer le **chiffre des unités** (`n % 10`), convertir
des **secondes en minutes et secondes**.

**Les opérations sur les textes.** `+` **colle** deux textes (concaténation) et `*` répète :

```python exec
prenom = "Léa"
print("Bonjour " + prenom + " !")
print("ha" * 3)
print(len(prenom))   # nombre de caractères
```

**Les conversions.** `int()`, `float()` et `str()` changent le type d'une valeur. C'est indispensable avec `input()`, qui renvoie **toujours** un
texte :

```python
age = input("Ton âge ? ")    # si l'élève tape 15, age vaut "15" (un texte)
age = int(age)                # maintenant age vaut 15 (un entier)
print("L'an prochain tu auras", age + 1, "ans")
```

## Les erreurs classiques des élèves

:::attention[Ce que tu verras en classe]
- **Oublier de convertir `input()`** : `age + 1` provoque `TypeError: can only concatenate str (not "int") to str`. C'est l'erreur n° 1 des élèves.
- **Mélanger texte et nombre** : `"Score : " + 12` est une erreur ; il faut `"Score : " + str(12)` ou `print("Score :", 12)`.
- **La virgule décimale** : écrire `2,5` au lieu de `2.5` (Python comprend alors deux valeurs, 2 et 5).
- **Confondre `/` et `//`** : `7 / 2` vaut `3.5`, pas `3`.
- **Les guillemets** : `print(bonjour)` cherche une variable *bonjour* ; `print("bonjour")` affiche le mot.
- **`True` et `False`** s'écrivent avec une majuscule.
:::

## En classe

:::methode[Faire découvrir les types par l'erreur]
1. Donner un programme qui demande l'âge et affiche l'âge l'année suivante… **sans** conversion. Les élèves l'exécutent : erreur.
2. Lire **ensemble** le message d'erreur (apprendre à lire une erreur est un objectif en soi), faire afficher `type(age)`.
3. Faire corriger avec `int(...)`, puis tester avec `"quinze"` : nouvelle erreur, qui montre les limites de la conversion.
4. Prolonger avec des petits défis : pair ou impair, chiffre des unités, durée en heures et minutes.
:::

Avec les thèmes de SNT, les types sont partout : une **photo** est faite de nombres (intensités de 0 à 255), un **fichier CSV** contient du texte
qu'on convertit en nombres, une **trame GPS** est un texte qu'on découpe.

## L'essentiel

- Quatre types en seconde : `int`, `float` (avec un point), `str` (entre guillemets), `bool` (`True` / `False`).
- `/` division décimale, `//` quotient entier, `%` reste, `**` puissance ; `+` colle deux textes.
- `input()` renvoie **toujours** un texte : convertir avec `int()` ou `float()`.
- On ne peut pas additionner un texte et un nombre : convertir avec `str()` ou afficher avec des virgules dans `print`.
- `n % 2 == 0` teste la parité ; `n % 10` donne le chiffre des unités.

## Exercices

::::exercice[Grand QCM : les types de base]{niveau=1 type=quiz}
Douze questions pour vérifier les types et les opérations du niveau seconde.

1. Quel est le type de `3.0` ?

   - [ ] `int`
   - [x] `float`
   - [ ] `str`
   - [ ] `bool`

   > Le point décimal en fait un nombre à virgule (`float`), même si la partie décimale est nulle.

1. Quel est le type de `"42"` ?

   - [ ] `int`
   - [ ] `float`
   - [x] `str`
   - [ ] `bool`

   > Les guillemets en font un **texte**, même s'il ne contient que des chiffres.

1. Que vaut `7 / 2` ?

   - [ ] 3
   - [x] 3.5
   - [ ] 1
   - [ ] 3.0

   > `/` est la division décimale : le résultat est toujours un `float`.

1. Que vaut `17 % 5` ?

   - [ ] 3
   - [ ] 3.4
   - [x] 2
   - [ ] 5

   > `%` donne le **reste** : 17 = 5 × 3 + 2.

1. Que vaut `17 // 5` ?

   - [x] 3
   - [ ] 3.4
   - [ ] 2
   - [ ] 4

   > `//` donne le **quotient entier** : combien de fois 5 « rentre » dans 17.

1. Que donne `"5" + "3"` ?

   - [ ] 8
   - [x] `"53"`
   - [ ] une erreur
   - [ ] `"8"`

   > Avec deux textes, `+` les **colle** (concaténation).

1. Que donne `"5" + 3` ?

   - [ ] 8
   - [ ] `"53"`
   - [x] une erreur `TypeError`
   - [ ] `"8"`

   > Python refuse d'additionner un texte et un nombre. Il faut convertir l'un des deux.

1. Un élève écrit `age = input("Ton âge ? ")` puis `print(age + 1)`. Que se passe-t-il ?

   - [ ] Python affiche l'âge plus 1
   - [x] une erreur, car `age` est un texte
   - [ ] Python affiche l'âge suivi de 1
   - [ ] Python demande l'âge deux fois

   > `input()` renvoie toujours un texte. Il faut écrire `age = int(input("Ton âge ? "))`.

1. Quelle expression teste si `n` est pair ?

   - [ ] `n / 2 == 0`
   - [x] `n % 2 == 0`
   - [ ] `n // 2 == 0`
   - [ ] `n == 2`

   > Un nombre est pair quand le **reste** de sa division par 2 est nul.

1. Que vaut `len("Python")` ?

   - [ ] 5
   - [x] 6
   - [ ] 7
   - [ ] une erreur

   > `len` compte les caractères : P, y, t, h, o, n.

1. Quelle écriture est correcte pour le nombre deux et demi ?

   - [ ] `2,5`
   - [x] `2.5`
   - [ ] `"2.5"`
   - [ ] `2 1/2`

   > Python utilise le **point** décimal. `2,5` est compris comme deux valeurs séparées.

1. Que vaut `2 ** 3` ?

   - [ ] 6
   - [ ] 5
   - [x] 8
   - [ ] 9

   > `**` est la puissance : 2 × 2 × 2 = 8.
::::

::::exercice[Pair ou impair]{niveau=1}
Écris une fonction `est_pair(n)` qui renvoie `True` si l'entier `n` est pair, `False` sinon.

```python depart
def est_pair(n):
    ...
```

```python tests
assert est_pair(4) is True, "4 est pair"
assert est_pair(7) is False, "7 est impair"
assert est_pair(0) is True, "0 est pair"
```

:::corrige
```python solution
def est_pair(n):
    return n % 2 == 0
```

`n % 2 == 0` est déjà un booléen : pas besoin d'écrire `if ... : return True else: return False` (mais c'est une étape normale chez les élèves).
:::
::::

::::exercice[Secondes en minutes et secondes]{niveau=2}
La variable `total` contient une durée en secondes. Calcule `minutes` et `secondes` (par exemple 200 s = 3 min 20 s), puis construis le texte
`message` sous la forme `"3 min 20 s"`.

```python depart
total = 200
minutes = ...
secondes = ...
message = ...
```

```python tests
assert minutes == 3, "200 s = 3 min …"
assert secondes == 20, "… et 20 s"
assert message == "3 min 20 s", "le message est « 3 min 20 s »"
```

:::indice
Le texte se construit avec `str(minutes) + " min " + ...` : il faut convertir les nombres en textes avant de les coller.
:::

:::corrige
```python solution
total = 200
minutes = total // 60
secondes = total % 60
message = str(minutes) + " min " + str(secondes) + " s"
```
:::
::::

::::exercice[Le chiffre des unités]{niveau=2}
Écris `unites(n)` qui renvoie le chiffre des unités de l'entier positif `n` (par exemple `unites(2024)` renvoie `4`).

```python depart
def unites(n):
    ...
```

```python tests
assert unites(2024) == 4, "2024 → 4"
assert unites(7) == 7, "un seul chiffre"
assert unites(130) == 0, "130 → 0"
```

:::corrige
```python solution
def unites(n):
    return n % 10
```

Le reste de la division par 10 est le dernier chiffre : 2024 = 10 × 202 + 4.
:::
::::

::::exercice[Lire un message d'erreur avec un élève]{niveau=2}
Un élève obtient `TypeError: can only concatenate str (not "int") to str` sur la ligne `print("Tu auras " + age + 1 + " ans")`, où `age` vient d'un
`input()`. Explique en quelques phrases ce que tu lui dis pour qu'il **comprenne** l'erreur (et pas seulement pour la corriger).

:::criteres
- Le message d'erreur est traduit avec des mots simples (on essaie de coller un texte et un nombre).
- La cause est identifiée : `input()` renvoie un texte, et `1` est un nombre.
- Une correction est proposée : convertir `age` avec `int()`, puis convertir le résultat en texte (ou utiliser des virgules dans `print`).
- L'élève est amené à vérifier lui-même (afficher `type(age)`, tester).
:::

:::corrige
« Lisons le message : *on ne peut coller (concatenate) qu'un texte (str) avec un texte, pas avec un entier (int)*. Python essaie de coller ton texte
`"Tu auras "` avec `age`, puis avec le nombre `1`. Or `input()` renvoie toujours un texte : `age` vaut `"15"`, pas `15`. Vérifie avec
`print(type(age))`. Il faut donc convertir : `age = int(input(...))` pour calculer `age + 1`, puis afficher avec des virgules :
`print("Tu auras", age + 1, "ans")`. »
:::
::::
