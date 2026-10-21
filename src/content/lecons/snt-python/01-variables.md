---
titre: Variables et affectation
resume: "La première notion de programmation en seconde : une variable est un nom qui désigne une valeur, et l'affectation range une valeur sous ce nom. Ce que les élèves doivent savoir, leurs erreurs classiques et comment l'enseigner."
duree: 25
objectifs:
  - "Expliquer ce qu'est une variable et ce que fait une affectation, avec des mots d'élève de seconde"
  - "Prévoir la valeur des variables après une suite d'affectations (tableau d'état)"
  - "Repérer les erreurs classiques des élèves (signe =, ordre des instructions, x = x + 1)"
  - "Proposer une première activité de classe sur les variables"
prerequis: []
programme: [snt-programmation]
cartes:
  - q: "Que fait l'instruction `x = 5` ?"
    r: "Elle **affecte** la valeur 5 à la variable `x` : désormais, le nom `x` désigne la valeur 5. Le signe `=` n'est pas une égalité mathématique."
  - q: "Que vaut `a` après `a = 3` puis `a = a + 2` ?"
    r: "`5` : Python calcule d'abord la partie droite avec l'ancienne valeur (3 + 2), puis range le résultat dans `a`."
  - q: "Qu'est-ce qu'un tableau d'état (ou tableau de suivi) ?"
    r: "Un tableau où l'on note, ligne après ligne, la valeur de chaque variable après chaque instruction. C'est l'outil n° 1 pour faire comprendre un programme en classe."
  - q: "Que se passe-t-il si on utilise une variable qui n'a pas encore reçu de valeur ?"
    r: "Python s'arrête avec une erreur `NameError` : le nom n'existe pas encore."
  - q: "Où sont les variables dans le programme de SNT ?"
    r: "Dans la partie « programmation » transversale : affectations, variables, séquences d'instructions, conditions, boucles bornées et non bornées, fonctions."
  - q: "Comment échanger le contenu de deux variables `a` et `b` ?"
    r: "Avec une troisième variable (`c = a`, `a = b`, `b = c`) ou, en Python, `a, b = b, a`."
---

En seconde, la programmation n'est pas un thème à part : elle traverse tout le programme de SNT. Et tout commence par les **variables**. C'est une
notion qui paraît simple, mais c'est là que naissent les malentendus qui bloqueront les élèves plus tard (le signe `=`, l'ordre des instructions).
Cette fiche te donne ce qu'il faut savoir **au niveau de la classe**, et la manière de le faire comprendre.

## Ce que dit le programme

Le programme de SNT (2019) range la programmation en **transversal**, avec ces contenus : *affectations, variables ; séquences d'instructions ;
instructions conditionnelles ; boucles bornées et non bornées ; définitions et appels de fonctions*. La capacité attendue est d'**écrire et développer
des programmes** pour répondre à des problèmes, souvent tirés des thèmes (photo, données, localisation…). Le langage utilisé est **Python**.

:::prof
Les élèves de seconde font aussi de l'algorithmique en **mathématiques**, en Python, avec les mêmes notions (variables, types, conditions, boucles,
fonctions). Parler avec le professeur de mathématiques évite de tout refaire deux fois ou d'utiliser des mots différents : c'est un bon réflexe à citer
en entretien.
:::

Ce qui **n'est pas** attendu en seconde : la notion de type abstrait, la mémoire, les références, la portée des variables. On reste sur l'idée simple
« un nom désigne une valeur ».

## La notion

Une **variable** est un **nom** qui désigne une **valeur**. On peut l'imaginer comme une étiquette collée sur une valeur, ou comme une boîte avec
un nom dessus. L'**affectation** donne une valeur à une variable : en Python, elle s'écrit avec le signe `=`.

```python exec
age = 15
prenom = "Léa"
print(prenom, "a", age, "ans")
```

:::definition[Affectation]
`nom = expression` : Python **calcule d'abord** la partie droite, **puis** fait désigner ce résultat par le nom de gauche. Si le nom désignait déjà une
valeur, l'ancienne valeur est remplacée.
:::

Les instructions s'exécutent **dans l'ordre**, de haut en bas : c'est la **séquence d'instructions**. On suit leur effet dans un **tableau d'état** :

```python exec
a = 3
b = a + 2
a = 10
print(a, b)
```

| Instruction | `a` | `b` |
|---|---|---|
| `a = 3` | 3 | |
| `b = a + 2` | 3 | 5 |
| `a = 10` | 10 | 5 |

`b` vaut toujours 5 : changer `a` **après** ne modifie pas `b`. Une affectation calcule une valeur une fois pour toutes, ce n'est pas une formule
qui se met à jour comme dans un tableur.

L'instruction `x = x + 1`, qui choque les élèves (« x ne peut pas être égal à x + 1 ! »), se lit : *prends la valeur de x, ajoute 1, et range le
résultat dans x*. C'est l'**incrémentation**, omniprésente dans les boucles.

```python exec
score = 0
score = score + 10
score = score + 5
print(score)
```

## Les erreurs classiques des élèves

:::attention[Ce que tu verras en classe]
- **Lire `=` comme une égalité** : `5 = x` ou « `x = x + 1` c'est faux ». Insister : `=` se dit « reçoit » ou « prend la valeur ».
- **Inverser l'affectation** : écrire `10 = prix` au lieu de `prix = 10` (Python répond par une erreur).
- **Utiliser une variable avant de lui donner une valeur** : `NameError: name 'total' is not defined`.
- **Croire que les variables sont liées** : après `b = a + 2`, modifier `a` ne change pas `b`.
- **Confondre le nom et le texte** : `print("age")` affiche le mot *age*, `print(age)` affiche la valeur.
- **Des noms peu parlants** (`a`, `b`, `x`) : leur apprendre tôt à choisir `prix`, `nb_eleves`, `moyenne`.
:::

## En classe

:::methode[Une première séance possible (55 min)]
1. **Débranché (10 min)** : des boîtes en carton étiquetées `a`, `b`, `c` et des papiers avec des nombres. Le professeur « exécute » un programme
   écrit au tableau ; un élève met et remplace les papiers dans les boîtes. On voit que mettre un nouveau papier **remplace** l'ancien.
2. **Prévoir avant d'exécuter (15 min)** : trois petits programmes au tableau ; chaque élève remplit le tableau d'état, puis on vérifie sur machine.
3. **Écrire (20 min)** : calculer un prix TTC, une moyenne de trois notes, convertir des minutes en heures et minutes.
4. **Bilan (10 min)** : trace écrite courte (définition, `=` se dit « reçoit », un exemple de tableau d'état).
:::

Pour **évaluer**, rien ne vaut « que vaut `x` à la fin ? » sur des programmes courts : c'est rapide, ça se corrige d'un coup d'œil et ça révèle
immédiatement les conceptions erronées.

## L'essentiel

- Une **variable** est un nom qui désigne une valeur ; l'**affectation** `nom = valeur` la lui donne (le `=` se lit « reçoit »).
- Python calcule **d'abord** la droite, **puis** range le résultat à gauche ; `x = x + 1` augmente `x` de 1.
- Les instructions s'exécutent **dans l'ordre** ; une variable garde sa valeur tant qu'on ne la réaffecte pas.
- Le **tableau d'état** est l'outil principal pour comprendre et faire comprendre.
- Erreurs typiques : `=` vu comme une égalité, variable non définie, variables crues « liées ».

## Exercices

::::exercice[Grand QCM : variables et affectation]{niveau=1 type=quiz}
Treize questions pour vérifier que tu maîtrises les variables comme un élève devrait les maîtriser, et que tu sais répondre à ses questions.

1. Que vaut `x` après ces instructions ?

   ```python
   x = 4
   x = 7
   ```

   - [ ] 4
   - [x] 7
   - [ ] 11
   - [ ] Python affiche une erreur

   > La deuxième affectation **remplace** la valeur précédente : `x` désigne maintenant 7.

1. Que vaut `b` à la fin ?

   ```python
   a = 2
   b = a * 3
   a = 10
   ```

   - [ ] 30
   - [x] 6
   - [ ] 10
   - [ ] 2

   > `b` reçoit `2 * 3 = 6` au moment de la deuxième ligne. Modifier `a` ensuite ne change pas `b`.

1. Comment se lit l'instruction `n = n + 1` ?

   - [ ] « n est égal à n plus 1 », ce qui est impossible
   - [x] « n reçoit la valeur de n plus 1 »
   - [ ] « on compare n et n + 1 »
   - [ ] « on crée une deuxième variable n »

   > Le signe `=` est une **affectation** : on calcule `n + 1` avec la valeur actuelle de `n`, puis on range le résultat dans `n`.

1. Que fait Python avec ce programme ?

   ```python
   print(total)
   total = 12
   ```

   - [ ] il affiche 12
   - [ ] il affiche 0
   - [x] il s'arrête avec une erreur, car `total` n'existe pas encore
   - [ ] il affiche le mot « total »

   > Les instructions s'exécutent dans l'ordre : à la première ligne, `total` n'a pas encore de valeur (`NameError`).

1. Quelle instruction est **correcte** en Python ?

   - [ ] `15 = age`
   - [x] `age = 15`
   - [ ] `age == 15` pour donner la valeur 15
   - [ ] `age := 15` est obligatoire

   > Le nom de la variable est **à gauche**, la valeur à droite. `==` sert à **comparer**, pas à affecter.

1. Qu'affiche `print("prix")` si `prix = 20` ?

   - [ ] 20
   - [x] prix
   - [ ] "20"
   - [ ] une erreur

   > Entre guillemets, `"prix"` est un **texte**, pas la variable : Python affiche le mot tel quel.

1. Que valent `a` et `b` à la fin ?

   ```python
   a = 5
   b = 8
   a = b
   b = a
   ```

   - [ ] `a = 8`, `b = 5`
   - [x] `a = 8`, `b = 8`
   - [ ] `a = 5`, `b = 5`
   - [ ] `a = 5`, `b = 8`

   > Après `a = b`, `a` vaut 8 et l'ancienne valeur 5 est perdue ; `b = a` remet donc 8 dans `b`. C'est l'erreur classique quand on veut **échanger**.

1. Quelle suite d'instructions **échange** correctement les valeurs de `a` et `b` ?

   - [ ] `a = b` puis `b = a`
   - [x] `c = a` puis `a = b` puis `b = c`
   - [ ] `b = a` puis `a = b`
   - [ ] `a = a + b` seulement

   > Il faut une troisième variable pour garder l'ancienne valeur de `a` (en Python, on peut aussi écrire `a, b = b, a`).

1. Que vaut `s` à la fin ?

   ```python
   s = 0
   s = s + 4
   s = s + 4
   s = s * 2
   ```

   - [ ] 8
   - [ ] 12
   - [x] 16
   - [ ] 4

   > 0, puis 4, puis 8, puis 8 × 2 = 16. Le tableau d'état évite de se tromper.

1. Quel nom de variable est le plus adapté pour le nombre d'élèves d'une classe ?

   - [ ] `x`
   - [x] `nb_eleves`
   - [ ] `n°élèves`
   - [ ] `2nde`

   > Un nom explicite rend le programme lisible. `n°élèves` contient des caractères interdits et un nom ne peut pas commencer par un chiffre.

1. Que vaut `prix` à la fin ?

   ```python
   prix = 50
   remise = 10
   prix = prix - remise
   remise = 20
   ```

   - [ ] 30
   - [x] 40
   - [ ] 50
   - [ ] 20

   > `prix` reçoit `50 - 10 = 40`. La dernière ligne change `remise`, mais `prix` a déjà été calculé.

1. À quoi sert un **tableau d'état** ?

   - [ ] à ranger les variables dans la mémoire de l'ordinateur
   - [x] à noter la valeur de chaque variable après chaque instruction, pour suivre un programme
   - [ ] à remplacer Python
   - [ ] à trier des données

   > C'est un outil papier pour **simuler** l'exécution : indispensable pour faire comprendre et pour évaluer.

1. Un élève dit : « `x = x + 1`, c'est faux, x ne peut pas être égal à x + 1 ». Quelle réponse est la plus utile ?

   - [ ] « En informatique, les maths ne s'appliquent pas. »
   - [x] « Ici `=` veut dire *reçoit* : on calcule x + 1, puis on range le résultat dans x. »
   - [ ] « Il faut écrire `x == x + 1`. »
   - [ ] « C'est une convention, apprends-la par cœur. »

   > On s'appuie sur ce que l'élève sait (l'égalité en maths) pour expliquer la **différence** de sens du signe `=`.
::::

::::exercice[Prix TTC]{niveau=1}
Un article coûte `prix_ht = 40` euros hors taxes. La TVA est de 20 %. Complète le programme pour que la variable `prix_ttc` contienne le prix toutes
taxes comprises (40 × 1,2).

```python depart
prix_ht = 40
prix_ttc = ...
print(prix_ttc)
```

```python tests
assert prix_ttc == 48, "40 € HT donnent 48 € TTC"
assert prix_ht == 40, "prix_ht garde sa valeur"
```

:::corrige
```python solution
prix_ht = 40
prix_ttc = prix_ht * 1.2
print(prix_ttc)
```

On calcule à partir de la variable `prix_ht` plutôt que d'écrire `48` directement : si le prix change, il suffit de modifier la première ligne.
:::
::::

::::exercice[Moyenne de trois notes]{niveau=1}
Avec les variables `n1 = 12`, `n2 = 15` et `n3 = 9`, calcule la moyenne dans une variable `moyenne`.

```python depart
n1 = 12
n2 = 15
n3 = 9
moyenne = ...
```

```python tests
assert moyenne == 12, "(12 + 15 + 9) / 3 = 12"
assert (n1, n2, n3) == (12, 15, 9), "les notes ne changent pas"
```

:::corrige
```python solution
n1 = 12
n2 = 15
n3 = 9
moyenne = (n1 + n2 + n3) / 3
```

Attention aux **parenthèses** : `n1 + n2 + n3 / 3` ne divise que `n3` par 3. C'est une erreur fréquente chez les élèves, à faire repérer.
:::
::::

::::exercice[Minutes en heures et minutes]{niveau=2}
La variable `duree` contient une durée en minutes (par exemple `135`). Calcule `heures` et `minutes` (ici 2 h 15). Indice : `//` donne le quotient
entier et `%` le reste.

```python depart
duree = 135
heures = ...
minutes = ...
```

```python tests
assert heures == 2, "135 min = 2 h …"
assert minutes == 15, "… et 15 min"
```

:::indice
135 = 60 × 2 + 15 : le quotient de la division par 60 donne les heures, le reste donne les minutes.
:::

:::corrige
```python solution
duree = 135
heures = duree // 60
minutes = duree % 60
```
:::
::::

::::exercice[Expliquer à un élève]{niveau=2}
Un élève écrit le programme ci-dessous pour échanger deux notes, et ne comprend pas pourquoi il obtient 14 et 14. Rédige ce que tu lui dis (trois ou
quatre phrases), en t'appuyant sur un tableau d'état.

```python
note_a = 9
note_b = 14
note_a = note_b
note_b = note_a
```

:::criteres
- Le tableau d'état (ou une explication ligne par ligne) montre que 9 est perdu à la troisième ligne.
- L'explication dit qu'une affectation **remplace** l'ancienne valeur.
- Une correction est proposée (variable intermédiaire, ou `note_a, note_b = note_b, note_a`).
- Le ton aide l'élève à comprendre son erreur, sans donner seulement la réponse.
:::

:::corrige
« Suivons ton programme ligne par ligne. Au début, `note_a` vaut 9 et `note_b` vaut 14. À la troisième ligne, `note_a` **reçoit** 14 : son ancienne
valeur, 9, est remplacée, donc perdue. À la quatrième ligne, `note_b` reçoit la valeur de `note_a`, c'est-à-dire 14. Pour échanger, il faut d'abord
**mettre 9 de côté** dans une autre variable : `temp = note_a`, puis `note_a = note_b`, puis `note_b = temp`. »

| Instruction | `note_a` | `note_b` |
|---|---|---|
| `note_a = 9` | 9 | |
| `note_b = 14` | 9 | 14 |
| `note_a = note_b` | 14 | 14 |
| `note_b = note_a` | 14 | 14 |
:::
::::
