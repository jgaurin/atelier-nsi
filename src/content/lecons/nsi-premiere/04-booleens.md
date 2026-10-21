---
titre: Booléens et opérateurs logiques
resume: "Le cours de première NSI sur les booléens : valeurs vrai/faux (1/0), opérateurs et, ou, non, ou exclusif, tables de vérité, expressions booléennes, évaluation séquentielle de and/or en Python, et application à l'addition binaire."
duree: 40
objectifs:
  - "Connaître les opérateurs and, or, not et xor et leurs tables de vérité"
  - "Dresser la table de vérité d'une expression booléenne"
  - "Comprendre l'évaluation séquentielle (paresseuse) de and et or en Python"
  - "Relier les booléens à l'addition binaire (demi-additionneur)"
prerequis: [nsi-premiere/entiers-bases]
programme: [nsi1-base]
cartes:
  - q: "Table de vérité de `a and b` ?"
    r: "Vrai **seulement** si a et b sont vrais tous les deux : 0 0 → 0, 0 1 → 0, 1 0 → 0, 1 1 → 1."
  - q: "Table de vérité de `a or b` ?"
    r: "Vrai si **au moins un** des deux est vrai : 0 0 → 0, 0 1 → 1, 1 0 → 1, 1 1 → 1."
  - q: "Qu'est-ce que le ou exclusif (xor) ?"
    r: "Vrai si **exactement un** des deux est vrai : 0 0 → 0, 0 1 → 1, 1 0 → 1, 1 1 → 0. En Python sur des booléens : `a != b` ou `a ^ b`."
  - q: "Combien de lignes a la table de vérité d'une expression à n variables ?"
    r: "**2ⁿ** lignes (4 pour 2 variables, 8 pour 3)."
  - q: "Que signifie l'évaluation séquentielle de `and` ?"
    r: "Dans `a and b`, si `a` est faux, Python **n'évalue pas** `b` (le résultat est déjà faux). Utile pour `i < len(t) and t[i] == x`."
  - q: "Comment additionner deux bits avec des opérateurs logiques ?"
    r: "Demi-additionneur : la **somme** vaut `a xor b`, la **retenue** vaut `a and b`."
  - q: "Lois de De Morgan ?"
    r: "`not (a and b)` = `(not a) or (not b)` ; `not (a or b)` = `(not a) and (not b)`."
---

Les **booléens** (du mathématicien George **Boole**, XIXᵉ siècle) n'ont que deux valeurs : **vrai** et **faux**, ou **1** et **0**. Ils sont au cœur
de l'informatique à deux niveaux : dans les **programmes** (toutes les conditions des `if` et des `while`) et dans le **matériel** (les circuits
électroniques ne manipulent que des 0 et des 1, combinés par des portes logiques). Ce chapitre fait le lien entre les deux.

## Ce que dit le programme

Contenus : *valeurs booléennes : 0, 1 ; opérateurs booléens : and, or, not ; expressions booléennes*. Capacité attendue : **dresser la table d'une
expression booléenne**. Commentaires : le **ou exclusif (xor)** est évoqué ; quelques applications directes comme l'**addition binaire** sont
présentées ; l'attention des élèves est attirée sur le **caractère séquentiel** de certains opérateurs booléens.

## 1. Les opérateurs et leurs tables de vérité

Une **table de vérité** donne la valeur d'une expression pour **toutes** les combinaisons possibles de ses variables.

| a | b | `not a` | `a and b` | `a or b` | `a xor b` |
|---|---|---|---|---|---|
| 0 | 0 | 1 | 0 | 0 | 0 |
| 0 | 1 | 1 | 0 | 1 | 1 |
| 1 | 0 | 0 | 0 | 1 | 1 |
| 1 | 1 | 0 | **1** | 1 | **0** |

- **non** (`not`) inverse la valeur ;
- **et** (`and`) n'est vrai que si **les deux** sont vrais ;
- **ou** (`or`) est vrai si **au moins un** est vrai (ce n'est pas le « ou » du « fromage ou dessert » !) ;
- **ou exclusif** (`xor`) est vrai si **exactement un** est vrai.

En Python, les booléens s'écrivent `True` et `False` ; `True` vaut 1 et `False` vaut 0 dans un calcul.

## 2. Dresser la table d'une expression

Avec n variables, il y a **2ⁿ** combinaisons, donc 2ⁿ lignes. On ajoute une colonne par sous-expression. Exemple : `(a or b) and not c`.

| a | b | c | `a or b` | `not c` | `(a or b) and not c` |
|---|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 1 | 0 |
| 0 | 0 | 1 | 0 | 0 | 0 |
| 0 | 1 | 0 | 1 | 1 | **1** |
| 0 | 1 | 1 | 1 | 0 | 0 |
| 1 | 0 | 0 | 1 | 1 | **1** |
| 1 | 0 | 1 | 1 | 0 | 0 |
| 1 | 1 | 0 | 1 | 1 | **1** |
| 1 | 1 | 1 | 1 | 0 | 0 |

```python exec
for a in (False, True):
    for b in (False, True):
        print(int(a), int(b), int(a and b), int(a or b), int(a != b))
```

Deux expressions sont **équivalentes** si elles ont la même table. Les **lois de De Morgan** en sont un exemple utile :
`not (a and b)` équivaut à `(not a) or (not b)`, et `not (a or b)` à `(not a) and (not b)`.

## 3. L'évaluation séquentielle de and et or

En Python, `and` et `or` sont évalués **de gauche à droite**, et Python **s'arrête dès que le résultat est connu** :

- dans `a and b`, si `a` est faux, `b` n'est **pas évalué** ;
- dans `a or b`, si `a` est vrai, `b` n'est **pas évalué**.

C'est très utile pour éviter une erreur :

```python exec
t = [4, 8, 15]
i = 5
if i < len(t) and t[i] == 8:     # t[5] n'existe pas, mais il n'est jamais évalué
    print("trouvé")
else:
    print("pas trouvé")
```

Si on inverse les deux conditions (`t[i] == 8 and i < len(t)`), le programme plante (`IndexError`) : l'**ordre compte**, contrairement à la logique
mathématique.

## 4. Application : l'addition binaire

Additionner deux bits a et b donne un bit de **somme** et un bit de **retenue** :

| a | b | retenue | somme |
|---|---|---|---|
| 0 | 0 | 0 | 0 |
| 0 | 1 | 0 | 1 |
| 1 | 0 | 0 | 1 |
| 1 | 1 | 1 | 0 |

On reconnaît : **somme = a xor b** et **retenue = a and b**. C'est le **demi-additionneur**, réalisé dans le processeur avec deux portes logiques. En
enchaînant des additionneurs, on additionne des nombres de 8, 32 ou 64 bits : toute l'arithmétique de l'ordinateur repose sur ces portes.

## Les erreurs classiques des élèves

:::attention[Ce que tu verras en classe]
- **Le « ou » exclusif du langage courant** : croire que `a or b` est faux quand a et b sont vrais.
- **Oublier des lignes** dans une table de vérité (il en faut 2ⁿ) ; ne pas les ordonner (compter en binaire évite les oublis).
- **Écrire `if x == 1 or 2:`** au lieu de `x == 1 or x == 2`.
- **Mal appliquer De Morgan** : `not (a and b)` n'est pas `not a and not b`.
- **Ignorer l'ordre des conditions** avec `and` (accès hors du tableau).
:::

## En classe

:::methode[Activités qui marchent]
1. **Phrases du quotidien** : « Tu peux sortir si tu as fini tes devoirs et rangé ta chambre » ; traduire en expressions booléennes.
2. **Tables de vérité** à compléter, d'abord à 2 puis à 3 variables, en ordonnant les lignes comme on compte en binaire.
3. **Vérifier par programme** : écrire des boucles qui affichent la table d'une expression ; vérifier De Morgan.
4. **Portes logiques** : simulateur en ligne pour construire un demi-additionneur (lien avec l'architecture).
:::

## L'essentiel

- Deux valeurs : **vrai/faux**, **1/0** (`True`/`False` en Python).
- `not`, `and` (les deux), `or` (au moins un), `xor` (exactement un).
- Une table de vérité à n variables a **2ⁿ** lignes ; deux expressions de même table sont équivalentes (De Morgan).
- `and` et `or` s'évaluent **de gauche à droite et s'arrêtent dès que le résultat est connu** : l'ordre des conditions compte.
- Addition de deux bits : **somme = a xor b**, **retenue = a and b**.

## Exercices

::::exercice[Grand QCM : booléens]{niveau=1 type=quiz}
Douze questions sur les booléens et les tables de vérité.

1. Que vaut `True and False` ?

   - [ ] `True`
   - [x] `False`
   - [ ] 1
   - [ ] une erreur

   > `and` demande que les deux soient vrais.

1. Que vaut `True or False` ?

   - [x] `True`
   - [ ] `False`
   - [ ] 0
   - [ ] une erreur

   > Un seul vrai suffit pour `or`.

1. Que vaut `True or True` ?

   - [x] `True`
   - [ ] `False`
   - [ ] cela dépend
   - [ ] une erreur

   > Le « ou » logique est **inclusif**.

1. Que vaut `a xor b` quand a = 1 et b = 1 ?

   - [ ] 1
   - [x] 0
   - [ ] 2
   - [ ] 11

   > Le ou exclusif est vrai si **exactement un** des deux est vrai.

1. Combien de lignes compte la table de vérité d'une expression à 3 variables ?

   - [ ] 3
   - [ ] 6
   - [x] 8
   - [ ] 9

   > 2³ = 8 combinaisons.

1. Que vaut `not (3 > 2 and 1 > 5)` ?

   - [x] `True`
   - [ ] `False`
   - [ ] 3
   - [ ] une erreur

   > `3 > 2 and 1 > 5` est faux ; `not` donne vrai.

1. Quelle expression est équivalente à `not (a or b)` ?

   - [ ] `not a or not b`
   - [x] `not a and not b`
   - [ ] `a and b`
   - [ ] `not a or b`

   > Loi de De Morgan : la négation d'un « ou » est le « et » des négations.

1. Pour quelles valeurs `(a or b) and not c` est-il vrai quand a = 1, b = 0 ?

   - [x] seulement si c = 0
   - [ ] seulement si c = 1
   - [ ] toujours
   - [ ] jamais

   > `a or b` vaut 1 ; il faut `not c` vrai, donc c = 0.

1. Avec `t = [1, 2]` et `i = 3`, que fait `i < len(t) and t[i] > 0` ?

   - [ ] une erreur `IndexError`
   - [x] il vaut `False` sans évaluer `t[i]`
   - [ ] il vaut `True`
   - [ ] il vaut 0

   > `i < len(t)` est faux : Python n'évalue pas la suite.

1. Et que fait `t[i] > 0 and i < len(t)` avec les mêmes valeurs ?

   - [x] une erreur `IndexError`
   - [ ] il vaut `False`
   - [ ] il vaut `True`
   - [ ] rien

   > `t[3]` est évalué en premier : il n'existe pas.

1. Dans un demi-additionneur, comment obtient-on le bit de retenue ?

   - [ ] `a or b`
   - [ ] `a xor b`
   - [x] `a and b`
   - [ ] `not a`

   > La retenue vaut 1 seulement pour 1 + 1.

1. Que vaut `True + True` en Python ?

   - [ ] `True`
   - [x] 2
   - [ ] une erreur
   - [ ] 1

   > Dans un calcul, `True` vaut 1.
::::

::::exercice[Ou exclusif]{niveau=1}
Écris `xor(a, b)` qui renvoie le ou exclusif des booléens `a` et `b`, en n'utilisant **que** `and`, `or` et `not`.

```python depart
def xor(a, b):
    ...
```

```python tests
assert xor(False, False) is False, "0 0"
assert xor(False, True) is True, "0 1"
assert xor(True, False) is True, "1 0"
assert xor(True, True) is False, "1 1"
```

:::corrige
```python solution
def xor(a, b):
    return (a or b) and not (a and b)
```

« Au moins un, mais pas les deux ». Autre écriture : `(a and not b) or (not a and b)`. En Python, `a != b` donne aussi le xor de deux booléens.
:::
::::

::::exercice[Demi-additionneur et additionneur complet]{niveau=2}
Écris `demi_add(a, b)` qui renvoie le couple `(retenue, somme)` de l'addition de deux bits (entiers 0 ou 1), puis `add_complet(a, b, r)` qui additionne
trois bits (deux bits et une retenue entrante) et renvoie `(retenue, somme)`. Utilise les opérateurs logiques, pas `+`.

```python depart
def demi_add(a, b):
    ...

def add_complet(a, b, r):
    ...
```

```python tests
assert demi_add(1, 1) == (1, 0), "1 + 1 = 10"
assert demi_add(0, 1) == (0, 1), "0 + 1 = 01"
assert add_complet(1, 1, 1) == (1, 1), "1 + 1 + 1 = 11"
assert add_complet(1, 0, 1) == (1, 0), "1 + 0 + 1 = 10"
assert add_complet(0, 0, 1) == (0, 1), "0 + 0 + 1 = 01"
```

:::indice
Un additionneur complet s'obtient avec deux demi-additionneurs : additionne a et b, puis ajoute r à la somme obtenue ; il y a une retenue finale si
l'un des deux demi-additionneurs en a produit une.
:::

:::corrige
```python solution
def demi_add(a, b):
    retenue = int(a == 1 and b == 1)
    somme = int((a == 1) != (b == 1))
    return (retenue, somme)

def add_complet(a, b, r):
    r1, s1 = demi_add(a, b)
    r2, s = demi_add(s1, r)
    return (int(r1 == 1 or r2 == 1), s)
```

C'est exactement ainsi qu'est construit l'additionneur d'un processeur : on enchaîne un additionneur complet par bit.
:::
::::

::::exercice[Table de vérité à la main]{niveau=1}
Dresse la table de vérité de `not a or (a and b)`. Que remarques-tu en la comparant à celle de « si a alors b » (fausse seulement quand a est vrai et
b faux) ?

:::criteres
- La table a 4 lignes, ordonnées.
- Les valeurs sont justes : 1, 1, 0, 1 pour (a, b) = (0,0), (0,1), (1,0), (1,1).
- La remarque : l'expression n'est fausse que pour a = 1 et b = 0, comme l'implication.
:::

:::corrige
| a | b | `not a` | `a and b` | `not a or (a and b)` |
|---|---|---|---|---|
| 0 | 0 | 1 | 0 | 1 |
| 0 | 1 | 1 | 0 | 1 |
| 1 | 0 | 0 | 0 | 0 |
| 1 | 1 | 0 | 1 | 1 |

L'expression n'est fausse que lorsque a est vrai et b faux : c'est exactement l'implication « si a alors b ». (Elle est d'ailleurs équivalente à
`not a or b`.)
:::
::::
