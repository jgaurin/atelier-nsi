---
titre: Instructions conditionnelles
resume: "if, elif, else : faire faire au programme des choix. Les comparaisons, les booléens et/ou/non au niveau seconde, l'indentation, et les erreurs classiques des élèves."
duree: 25
objectifs:
  - "Écrire une instruction conditionnelle avec if, elif et else, correctement indentée"
  - "Écrire une condition avec les comparaisons (==, !=, <, <=, >, >=) et and, or, not"
  - "Prévoir le chemin suivi par un programme selon les valeurs"
  - "Repérer les erreurs classiques (= au lieu de ==, deux points, indentation, ordre des elif)"
prerequis: [snt-python/types]
programme: [snt-programmation]
cartes:
  - q: "Structure d'une instruction conditionnelle en Python ?"
    r: "`if condition:` puis le bloc **indenté** ; éventuellement `elif autre_condition:` et `else:`. Les deux-points et l'indentation sont obligatoires."
  - q: "Différence entre `=` et `==` ?"
    r: "`=` **affecte** une valeur à une variable ; `==` **compare** deux valeurs et donne `True` ou `False`."
  - q: "Combien de blocs s'exécutent dans un `if … elif … elif … else` ?"
    r: "**Un seul** : le premier dont la condition est vraie (ou le `else` si aucune ne l'est)."
  - q: "Comment écrire « x est entre 10 et 20 (inclus) » ?"
    r: "`10 <= x and x <= 20`, ou en Python `10 <= x <= 20`."
  - q: "Que vaut `not (3 > 5)` ?"
    r: "`True` : `3 > 5` est faux, et `not` inverse."
---

Une **instruction conditionnelle** permet au programme de faire des **choix** : exécuter certaines instructions seulement si une condition est
vraie. C'est la deuxième grande étape après les variables. Les difficultés des élèves sont surtout de **syntaxe** (deux-points, indentation, `==`)
et de **logique** (ordre des cas, conditions qui se recouvrent).

## Ce que dit le programme

Le programme de SNT cite les *instructions conditionnelles* parmi les contenus de programmation transversaux. On attend des élèves qu'ils écrivent
des conditions simples, avec **if / else** et **elif**, et des comparaisons combinées avec **et / ou / non**. Les tables de vérité et l'algèbre de
Boole relèvent de la NSI (première) : en seconde, on reste sur le sens courant de « et », « ou », « non ».

## La notion

```python exec
note = 13
if note >= 10:
    print("Admis")
else:
    print("Refusé")
```

- La **condition** (`note >= 10`) est une expression qui vaut `True` ou `False`.
- Le bloc sous `if` est **indenté** (décalé de 4 espaces) : c'est l'indentation qui dit à Python ce qui fait partie du `if`.
- `else` (facultatif) traite le cas contraire.

Pour plus de deux cas, on enchaîne avec `elif` (« sinon si ») :

```python exec
note = 15
if note >= 16:
    mention = "Très bien"
elif note >= 14:
    mention = "Bien"
elif note >= 12:
    mention = "Assez bien"
else:
    mention = "Sans mention"
print(mention)
```

Python teste les conditions **dans l'ordre** et n'exécute **que le premier** bloc dont la condition est vraie : avec 15, `note >= 16` est faux,
`note >= 14` est vrai, donc « Bien », et les cas suivants ne sont même pas testés.

| Comparaison | Sens |
|---|---|
| `==` / `!=` | égal / différent |
| `<` / `<=` | inférieur / inférieur ou égal |
| `>` / `>=` | supérieur / supérieur ou égal |

On combine avec `and` (les deux), `or` (au moins une) et `not` (le contraire) :

```python exec
age = 16
accompagne = True
if age >= 18 or accompagne:
    print("Entrée autorisée")
```

## Les erreurs classiques des élèves

:::attention[Ce que tu verras en classe]
- **`=` au lieu de `==`** dans la condition : `if note = 10:` provoque une erreur de syntaxe.
- **Oublier les deux-points** après `if`, `elif`, `else`.
- **L'indentation** : une ligne mal décalée sort du `if` (ou provoque `IndentationError`). Montrer que l'indentation *fait partie du sens*.
- **L'ordre des `elif`** : tester `note >= 12` avant `note >= 16` donne « Assez bien » à tout le monde au-dessus de 12.
- **`if` successifs au lieu de `elif`** : plusieurs messages s'affichent alors au lieu d'un seul.
- **Écrire `if x == 1 or 2:`** pour « x vaut 1 ou 2 » : il faut `x == 1 or x == 2`.
:::

## En classe

:::methode[Une progression qui marche]
1. **Débranché** : un organigramme au tableau (« As-tu plus de 18 ans ? → oui / non »), puis sa traduction en Python.
2. **Prévoir le chemin** : un programme avec `if / elif / else` et plusieurs valeurs de départ ; les élèves prédisent l'affichage, puis testent.
3. **Écrire** : mention au bac, tarif de cinéma selon l'âge, signe d'un nombre, comparaison de deux nombres.
4. **Tester les cas limites** : que se passe-t-il pour une note de exactement 10 ? 16 ? C'est l'occasion de parler de `>` et `>=`.
:::

Lien avec les thèmes de SNT : un **objet connecté** allume une lampe *si* la luminosité est faible, un filtre **photo** met un pixel en noir *si*
son intensité est sous un seuil.

## L'essentiel

- `if condition:` + bloc indenté ; `elif` pour d'autres cas ; `else` pour le reste. Deux-points et indentation obligatoires.
- Une condition vaut `True` ou `False` ; `==` compare, `=` affecte.
- Dans un `if / elif / else`, **un seul** bloc s'exécute : le premier dont la condition est vraie. L'ordre compte.
- `and`, `or`, `not` combinent des conditions ; chaque comparaison doit être complète (`x == 1 or x == 2`).
- Toujours tester les **cas limites** (exactement 10, exactement 16…).

## Exercices

::::exercice[Grand QCM : instructions conditionnelles]{niveau=1 type=quiz}
Douze questions sur les conditions, au niveau de la seconde.

1. Qu'affiche ce programme ?

   ```python
   x = 7
   if x > 5:
       print("grand")
   else:
       print("petit")
   ```

   - [x] grand
   - [ ] petit
   - [ ] grand puis petit
   - [ ] rien

   > 7 > 5 est vrai : seul le bloc du `if` s'exécute.

1. Quelle ligne est correcte ?

   - [ ] `if x = 3:`
   - [x] `if x == 3:`
   - [ ] `if x == 3`
   - [ ] `if (x = 3)`

   > Il faut `==` pour comparer, et les deux-points en fin de ligne.

1. Qu'affiche ce programme pour `note = 15` ?

   ```python
   if note >= 12:
       print("Assez bien")
   elif note >= 14:
       print("Bien")
   else:
       print("Sans mention")
   ```

   - [x] Assez bien
   - [ ] Bien
   - [ ] Assez bien puis Bien
   - [ ] Sans mention

   > Le premier test vrai l'emporte : 15 >= 12, donc « Assez bien ». Les cas sont dans le mauvais ordre : il faut tester 14 avant 12.

1. Combien de blocs peuvent s'exécuter dans un `if … elif … else` ?

   - [ ] tous ceux dont la condition est vraie
   - [x] un seul
   - [ ] deux au maximum
   - [ ] aucun, jamais

   > Python s'arrête au premier bloc dont la condition est vraie (ou exécute le `else`).

1. Comment écrire « `x` vaut 1 ou 2 » ?

   - [ ] `x == 1 or 2`
   - [x] `x == 1 or x == 2`
   - [ ] `x == (1 or 2)`
   - [ ] `x = 1 or x = 2`

   > Chaque comparaison doit être complète. `x == 1 or 2` est toujours considéré comme vrai par Python : piège classique.

1. Que vaut `(5 > 3) and (2 > 4)` ?

   - [ ] `True`
   - [x] `False`
   - [ ] 5
   - [ ] une erreur

   > `and` demande que les deux soient vraies ; `2 > 4` est faux.

1. Que vaut `(5 > 3) or (2 > 4)` ?

   - [x] `True`
   - [ ] `False`
   - [ ] 2
   - [ ] une erreur

   > `or` demande qu'au moins une condition soit vraie.

1. À quoi sert l'indentation (le décalage) sous un `if` ?

   - [ ] à rendre le code plus joli, sans effet
   - [x] à indiquer les instructions qui font partie du `if`
   - [ ] à accélérer le programme
   - [ ] à mettre un commentaire

   > En Python, l'indentation **délimite les blocs** : elle change le sens du programme.

1. Qu'affiche ce programme pour `t = 30` ?

   ```python
   if t > 25:
       print("chaud")
   if t > 15:
       print("doux")
   ```

   - [ ] chaud
   - [ ] doux
   - [x] chaud puis doux
   - [ ] rien

   > Ce sont deux `if` **indépendants** (pas de `elif`) : les deux conditions sont testées et vraies.

1. Quelle condition est vraie pour un âge compris entre 12 et 17 ans inclus ?

   - [ ] `12 < age < 17`
   - [x] `12 <= age <= 17`
   - [ ] `age >= 12 or age <= 17`
   - [ ] `age == 12 and age == 17`

   > « Inclus » demande `<=`. Avec `or`, la condition serait vraie pour tout le monde.

1. Que vaut `not (4 == 4)` ?

   - [ ] `True`
   - [x] `False`
   - [ ] 4
   - [ ] une erreur

   > `4 == 4` est vrai ; `not` donne le contraire.

1. Un élève oublie les deux-points après `if age >= 18`. Que fait Python ?

   - [ ] il ajoute les deux-points tout seul
   - [ ] il ignore la ligne
   - [x] il signale une erreur de syntaxe (`SyntaxError`)
   - [ ] il exécute le bloc dans tous les cas

   > Python vérifie la syntaxe avant d'exécuter : le programme ne démarre pas.
::::

::::exercice[Le signe d'un nombre]{niveau=1}
Écris `signe(x)` qui renvoie le texte `"positif"`, `"négatif"` ou `"nul"` selon le nombre `x`.

```python depart
def signe(x):
    ...
```

```python tests
assert signe(5) == "positif", "5 est positif"
assert signe(-2) == "négatif", "-2 est négatif"
assert signe(0) == "nul", "0 est nul"
```

:::corrige
```python solution
def signe(x):
    if x > 0:
        return "positif"
    elif x < 0:
        return "négatif"
    else:
        return "nul"
```
:::
::::

::::exercice[Tarif du cinéma]{niveau=2}
Au cinéma, la place coûte 6 € pour les moins de 14 ans, 8 € de 14 à 25 ans inclus, et 11 € au-delà. Écris `tarif(age)` qui renvoie le prix.

```python depart
def tarif(age):
    ...
```

```python tests
assert tarif(10) == 6, "10 ans : 6 €"
assert tarif(14) == 8, "14 ans : 8 € (cas limite)"
assert tarif(25) == 8, "25 ans : 8 € (cas limite)"
assert tarif(26) == 11, "26 ans : 11 €"
```

:::corrige
```python solution
def tarif(age):
    if age < 14:
        return 6
    elif age <= 25:
        return 8
    else:
        return 11
```

Grâce au `elif`, la deuxième condition n'a pas besoin de répéter `age >= 14` : on ne l'atteint que si `age < 14` est faux. Les tests sur 14 et 25
vérifient les **cas limites**, là où les élèves se trompent entre `<` et `<=`.
:::
::::

::::exercice[Corriger un programme d'élève]{niveau=2}
Un élève a écrit ce programme pour donner une mention, et tous ses camarades au-dessus de 12 obtiennent « Assez bien ». Explique-lui le problème et
comment le corriger.

```python
if note >= 12:
    mention = "Assez bien"
elif note >= 14:
    mention = "Bien"
elif note >= 16:
    mention = "Très bien"
```

:::criteres
- L'explication dit que les conditions sont testées dans l'ordre et qu'un seul bloc s'exécute.
- Elle montre, sur un exemple (16 ou 15), que la première condition « attrape » tout.
- La correction propose de tester les seuils du plus grand au plus petit.
- Le cas d'une note inférieure à 12 (aucune mention) est signalé.
:::

:::corrige
« Prenons 16 : Python teste d'abord `note >= 12`, c'est vrai, donc il met "Assez bien" et **ne regarde pas** les `elif` suivants. Avec `elif`, un
seul bloc s'exécute : le premier vrai. Il faut donc commencer par le seuil le plus haut : `if note >= 16`, puis `elif note >= 14`, puis
`elif note >= 12`. Et pense au cas où la note est sous 12 : ajoute un `else` (« Sans mention »), sinon la variable `mention` n'existe pas. »
:::
::::
