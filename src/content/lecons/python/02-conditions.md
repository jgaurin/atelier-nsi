---
titre: Booléens et instructions conditionnelles
resume: Comparer des valeurs, combiner des conditions avec and, or, not, et faire des choix avec if, elif, else.
duree: 55
objectifs:
  - Évaluer une expression booléenne avec `and`, `or`, `not` et des comparaisons
  - Écrire une instruction `if / elif / else` correctement indentée et dans le bon ordre
  - Utiliser l'évaluation paresseuse pour éviter une erreur
  - Simplifier une condition avec les lois de De Morgan
prerequis: [python/premiers-pas]
programme: [lp-imperatif, lp-python, nsi1-langages, nsi1-base, snt-programmation]
cartes:
  - q: Que vaut `not (3 > 2 and 2 > 3)` ?
    r: "`True` : `3 > 2 and 2 > 3` vaut `False`, et `not False` vaut `True`."
  - q: Dans quel ordre Python évalue-t-il `not`, `and`, `or` ?
    r: "`not` d'abord, puis `and`, puis `or` (comme « moins unaire », « fois », « plus »)."
  - q: Pourquoi `b != 0 and a % b == 0` ne provoque-t-il jamais de division par zéro ?
    r: "Évaluation paresseuse : si `b != 0` est faux, `and` ne calcule pas la suite (le résultat est forcément `False`)."
  - q: "Loi de De Morgan : `not (a or b)` équivaut à… ?"
    r: "`not a and not b`. Et `not (a and b)` équivaut à `not a or not b`."
  - q: Que vaut `"Zoé" < "adam"` ?
    r: "`True` : les chaînes se comparent caractère par caractère selon leur code, et les majuscules ont des codes plus petits que les minuscules."
  - q: Quelles valeurs sont « fausses » dans un `if` ?
    r: "`False`, `0`, `0.0`, `\"\"` (chaîne vide), `[]`, `{}`, `None`. Tout le reste est considéré comme vrai."
  - q: Pourquoi l'ordre des `elif` compte-t-il ?
    r: "Python teste les conditions de haut en bas et n'exécute que le premier bloc dont la condition est vraie ; les suivantes ne sont même pas évaluées."
  - q: Condition d'une année bissextile ?
    r: "`(a % 4 == 0 and a % 100 != 0) or a % 400 == 0`."
---

Un programme qui fait toujours la même chose ne sert pas à grand-chose. Une application de notes doit afficher
« admis » ou « refusé », un jeu doit savoir si le joueur a gagné, un thermostat doit allumer ou non le chauffage.
Il faut donc pouvoir **poser une question** (« la note est-elle au moins 10 ? ») et **choisir** quoi faire selon
la réponse. Les réponses sont des **booléens**, et les choix se font avec l'instruction **`if`**.

## 1. Les booléens et les comparaisons

Le type `bool` n'a que deux valeurs : `True` (vrai) et `False` (faux). On les obtient surtout en
**comparant** des valeurs :

| Opérateur | Signification            | Exemple       | Valeur  |
|-----------|--------------------------|---------------|---------|
| `==`      | égal à                   | `3 == 3.0`    | `True`  |
| `!=`      | différent de             | `"a" != "A"`  | `True`  |
| `<`, `>`  | strictement inférieur, supérieur | `2 < 2` | `False` |
| `<=`, `>=`| inférieur ou égal, supérieur ou égal | `2 <= 2` | `True` |

```python exec
note = 13.5
print(note >= 10)
print(note == 20)
admis = note >= 10      # un booléen se range dans une variable comme une autre valeur
print(admis, type(admis))
print(0 <= note <= 20)  # comparaisons enchaînées : 0 <= note et note <= 20
```

Les chaînes se comparent dans l'**ordre lexicographique** (celui du dictionnaire), caractère par caractère,
selon le **code** de chaque caractère. Toutes les majuscules ont un code plus petit que les minuscules :

```python exec
print("abc" < "abd", "chat" < "chien", "pomme" < "pommes")
print("Zoé" < "adam")
print(ord("Z"), ord("a"))
```

:::attention
`=` **affecte**, `==` **compare**. Écrire `if note = 10:` est une erreur de syntaxe en Python.
Et `0.1 + 0.2 == 0.3` vaut `False` : on ne compare pas des flottants avec `==` (voir la leçon précédente).
:::

## 2. Combiner des conditions : `and`, `or`, `not`

Les **opérateurs logiques** construisent des conditions plus riches.

| `a`     | `b`     | `a and b` | `a or b` | `not a` |
|---------|---------|-----------|----------|---------|
| `False` | `False` | `False`   | `False`  | `True`  |
| `False` | `True`  | `False`   | `True`   | `True`  |
| `True`  | `False` | `False`   | `True`   | `False` |
| `True`  | `True`  | `True`    | `True`   | `False` |

- `a and b` est vrai quand **les deux** sont vrais ;
- `a or b` est vrai quand **au moins un** des deux est vrai (ce n'est pas un « ou exclusif ») ;
- `not a` est la négation.

Priorités : `not` d'abord, puis `and`, puis `or`. Ainsi `not a or b and c` se lit `(not a) or (b and c)`.
Mets des parenthèses dès que c'est ambigu pour un lecteur.

```python exec
age, inscrit = 17, True
print(age >= 18 and inscrit)
print(age >= 18 or inscrit)
print(not inscrit)
print(not age >= 18 or inscrit and age > 15)   # (not (age >= 18)) or (inscrit and age > 15)
```

### L'évaluation paresseuse

Pour `a and b`, si `a` est faux, le résultat est forcément faux : Python **n'évalue pas** `b`.
De même pour `a or b` quand `a` est vrai. On parle d'évaluation **paresseuse** (ou en court-circuit).
C'est très utile pour **protéger** un calcul :

```python exec
a, b = 10, 0
print(b != 0 and a % b == 0)   # a % b n'est jamais calculé : pas d'erreur
```

```python exec erreur
a, b = 10, 0
print(a % b == 0 and b != 0)   # dans cet ordre, a % b est calculé d'abord : ZeroDivisionError
```

:::retenir
Dans `a and b` (et `a or b`), on place **d'abord** la condition qui garantit que la seconde peut être calculée.
:::

### Les lois de De Morgan

Pour **nier** une condition composée, on nie chaque morceau et on échange `and` et `or` :

$$ \text{non}(a \text{ et } b) = \text{non } a \text{ ou non } b \qquad \text{non}(a \text{ ou } b) = \text{non } a \text{ et non } b $$

Exemple : « la note n'est pas valide » = `not (0 <= note <= 20)` = `note < 0 or note > 20`.
Ces lois sont démontrées dans la leçon de logique (module mathématiques) ; ici, on s'en sert pour écrire
des conditions lisibles.

## 3. Choisir : `if`, `elif`, `else`

```python exec
note = 13.5
if note >= 10:
    print("Admis")
    print("Bravo !")
else:
    print("Refusé")
print("Fin du programme")
```

Les deux-points `:` ouvrent un **bloc**, et le bloc est délimité par l'**indentation** (4 espaces, par convention).
Toutes les lignes indentées sous le `if` font partie du bloc exécuté quand la condition est vraie ;
la première ligne non indentée (`print("Fin du programme")`) est exécutée dans tous les cas.

Pour plus de deux cas, on enchaîne avec `elif` (contraction de *else if*) :

```python exec
note = 14.5
if note >= 16:
    mention = "Très bien"
elif note >= 14:
    mention = "Bien"
elif note >= 12:
    mention = "Assez bien"
elif note >= 10:
    mention = "Passable"
else:
    mention = "Non admis"
print(mention)
```

```mermaid legende="Une chaîne if / elif / else : on teste de haut en bas, le premier « oui » gagne"
graph TD
  D([note]) --> C1{note >= 16 ?}
  C1 -- oui --> M1[Très bien]
  C1 -- non --> C2{note >= 14 ?}
  C2 -- oui --> M2[Bien]
  C2 -- non --> C3{note >= 12 ?}
  C3 -- oui --> M3[Assez bien]
  C3 -- non --> C4{note >= 10 ?}
  C4 -- oui --> M4[Passable]
  C4 -- non --> M5[Non admis]
```

:::definition
Dans une instruction `if c1: … elif c2: … else: …`, Python évalue les conditions **dans l'ordre** et exécute
**uniquement le premier bloc** dont la condition est vraie (ou le bloc `else` si aucune ne l'est).
Les blocs sont **exclusifs** : un seul est exécuté.
:::

:::question[Que se passerait-il si on testait `note >= 10` en premier ?]
Toute note d'au moins 10 tomberait dans ce premier cas : un 18 obtiendrait « Passable ». Quand les conditions
se chevauchent, on les range de la plus restrictive à la moins restrictive.
:::

On peut aussi **imbriquer** des `if` (un `if` dans le bloc d'un autre), mais au-delà de deux niveaux le code
devient difficile à lire : une chaîne de `elif` ou une condition combinée est souvent plus claire.

## 4. Des conditions qui sont des valeurs

Une condition est une **expression** comme une autre : on peut la ranger dans une variable, ou la renvoyer.
C'est souvent plus clair que des `if` qui ne font que produire `True` ou `False` :

```python
# Lourd                         # Direct
if age >= 18:                   majeur = age >= 18
    majeur = True
else:
    majeur = False
```

### Ce que Python considère comme vrai ou faux

Un `if` accepte n'importe quelle valeur, pas seulement un booléen. Sont considérés comme **faux** :
`False`, `0`, `0.0`, la chaîne vide `""`, la liste vide `[]`, le dictionnaire vide `{}` et `None`.
Tout le reste est considéré comme **vrai**.

```python exec
nom = ""
if nom:
    print("Bonjour", nom)
else:
    print("Nom manquant")
```

:::prof
Erreurs fréquentes des élèves : écrire `if x == True:` (correct mais redondant : `if x:`), traduire mot à mot
« si la note est supérieure à 10 ou inférieure à 20 » en `note > 10 or < 20` (il faut répéter la variable :
`note > 10 or note < 20`, et ici c'est d'ailleurs un `and` qui était voulu), oublier que `or` est inclusif,
et mal indenter (le bloc `else` aligné sur la mauvaise ligne). Faire construire des tables de vérité et faire
**tester tous les cas** (un jeu de valeurs par branche) installe de bons réflexes.
:::

## Exemple guidé

**Problème.** Une année est **bissextile** si elle est divisible par 4 mais pas par 100, sauf si elle est
divisible par 400. Écrire une condition qui dit si `annee` est bissextile, puis la tester.

**1. Traduire l'énoncé en logique.** « divisible par 4 mais pas par 100 » donne `annee % 4 == 0 and annee % 100 != 0`.
« sauf si divisible par 400 » signifie : divisible par 400 suffit. D'où :

```python exec
def bissextile(annee):
    return (annee % 4 == 0 and annee % 100 != 0) or annee % 400 == 0

for annee in [2023, 2024, 1900, 2000]:
    print(annee, bissextile(annee))
```

(Une **fonction** `def … return …` permet de tester la condition sur plusieurs valeurs ; on les étudie en détail
dans la leçon 4. La boucle `for` est la leçon suivante.)

**2. Choisir les tests.** Il faut au moins un exemple par cas de la règle :

| Année | divisible par 4 | par 100 | par 400 | Bissextile ? |
|-------|-----------------|---------|---------|--------------|
| 2023  | non             | non     | non     | non          |
| 2024  | oui             | non     | non     | **oui**      |
| 1900  | oui             | oui     | non     | non          |
| 2000  | oui             | oui     | oui     | **oui**      |

**3. Variante avec `if`.** On peut aussi écrire la règle de la plus restrictive à la moins restrictive :

```python
if annee % 400 == 0:
    resultat = True
elif annee % 100 == 0:
    resultat = False
else:
    resultat = annee % 4 == 0
```

Les deux versions sont correctes ; l'expression booléenne est plus compacte, la version `if` suit mot à mot
l'énoncé. Savoir passer de l'une à l'autre est exactement ce qu'on attend en épreuve.

## L'essentiel

- Un booléen vaut `True` ou `False` ; on l'obtient par comparaison : `==`, `!=`, `<`, `<=`, `>`, `>=`.
- `and` : les deux ; `or` : au moins un (inclusif) ; `not` : négation. Priorité : `not`, puis `and`, puis `or`.
- Évaluation **paresseuse** : la seconde partie de `and`/`or` n'est calculée que si nécessaire.
- De Morgan : `not (a and b)` = `not a or not b` ; `not (a or b)` = `not a and not b`.
- `if / elif / else` : conditions testées dans l'ordre, **un seul** bloc exécuté. Les blocs sont définis par l'indentation.
- Une condition est une valeur : `majeur = age >= 18`.
- Sont « faux » : `False`, `0`, `""`, `[]`, `{}`, `None`.

## Exercices

::::exercice[Évaluer une expression booléenne]{niveau=1}
Avec `x = 5` et `y = 8`, que vaut `not (x > 3 and y < 8) or x == y` ?

- [x] `True`
- [ ] `False`
- [ ] une erreur
- [ ] `None`

:::corrige
`x > 3` vaut `True`, `y < 8` vaut `False`, donc `x > 3 and y < 8` vaut `False` et `not (...)` vaut `True`.
Avec `or`, l'expression vaut donc `True` (et `x == y` n'est même pas évalué).
:::
::::

::::exercice[Comparer des chaînes]{niveau=1}
Lesquelles de ces expressions valent `True` ?

- [x] `"chat" < "chien"`
- [ ] `"Paris" < "Brest"`
- [x] `"Zoé" < "adam"`
- [x] `"10" < "9"`

:::corrige
Les chaînes se comparent caractère par caractère, selon le code des caractères.
- `"chat" < "chien"` : `c = c`, `h = h`, puis `a < i` → vrai.
- `"Paris" < "Brest"` : `P` vient après `B` → faux.
- `"Zoé" < "adam"` : `Z` (code 90) est avant `a` (code 97) → vrai.
- `"10" < "9"` : on compare le caractère `"1"` au caractère `"9"` → vrai. Ce sont des **textes**, pas des nombres :
  c'est un piège classique quand on oublie de convertir une saisie.
:::
::::

::::exercice[Nier une condition]{niveau=1}
Quelle expression est équivalente à `not (x >= 0 and x < 10)` ?

- [ ] `x < 0 and x >= 10`
- [x] `x < 0 or x >= 10`
- [ ] `x <= 0 or x > 10`
- [ ] `not x >= 0 and not x < 10`

:::corrige
Par De Morgan, `not (a and b)` = `not a or not b`. Ici `not (x >= 0)` est `x < 0` et `not (x < 10)` est `x >= 10`.
La première proposition (avec `and`) ne serait jamais vraie : un nombre ne peut pas être à la fois négatif et au moins 10.
:::
::::

::::exercice[Mention au baccalauréat]{niveau=2}
Complète la fonction `mention(note)` qui renvoie `"Très bien"` (note ≥ 16), `"Bien"` (≥ 14), `"Assez bien"` (≥ 12),
`"Passable"` (≥ 10) ou `"Non admis"`. Tu n'écris que le corps de la fonction ; `return valeur` renvoie le résultat.

```python depart
def mention(note):
    # renvoie la mention correspondant à la note
    ...
```

```python tests
assert mention(17) == "Très bien", "17 donne Très bien"
assert mention(16) == "Très bien", "16 (limite) donne Très bien"
assert mention(15.5) == "Bien", "15,5 donne Bien"
assert mention(12) == "Assez bien", "12 (limite) donne Assez bien"
assert mention(10) == "Passable", "10 (limite) donne Passable"
assert mention(9.99) == "Non admis", "9,99 donne Non admis"
```

:::indice
Range les tests du plus exigeant (16) au moins exigeant (10) : le premier vrai gagne.
:::

:::corrige
```python solution
def mention(note):
    if note >= 16:
        return "Très bien"
    elif note >= 14:
        return "Bien"
    elif note >= 12:
        return "Assez bien"
    elif note >= 10:
        return "Passable"
    else:
        return "Non admis"
```
Les tests aux **valeurs limites** (16, 12, 10) vérifient le choix entre `>` et `>=`, l'erreur la plus fréquente.
:::
::::

::::exercice[Le plus grand de trois nombres]{niveau=2}
Écris `max3(a, b, c)` qui renvoie le plus grand des trois nombres, **sans** utiliser la fonction `max`.

```python depart
def max3(a, b, c):
    ...
```

```python tests
assert max3(1, 2, 3) == 3, "le plus grand à la fin"
assert max3(3, 2, 1) == 3, "le plus grand au début"
assert max3(1, 3, 2) == 3, "le plus grand au milieu"
assert max3(-5, -2, -9) == -2, "nombres négatifs"
assert max3(4, 4, 1) == 4, "égalités"
```

:::corrige
```python solution
def max3(a, b, c):
    plus_grand = a
    if b > plus_grand:
        plus_grand = b
    if c > plus_grand:
        plus_grand = c
    return plus_grand
```
On garde « le plus grand vu jusqu'ici » et on le met à jour : c'est l'idée qui servira pour le maximum d'une liste
de taille quelconque. Une version avec `if a >= b and a >= c: … elif b >= c: … else: …` est aussi correcte.
:::
::::

::::exercice[Triangle constructible]{niveau=2}
Trois longueurs `a`, `b`, `c` forment un triangle (non aplati) si elles sont strictement positives et si chacune est
strictement inférieure à la somme des deux autres. Écris `est_triangle(a, b, c)` qui renvoie `True` ou `False`,
en une seule expression booléenne.

```python depart
def est_triangle(a, b, c):
    return ...
```

```python tests
assert est_triangle(3, 4, 5) == True, "triangle rectangle 3-4-5"
assert est_triangle(1, 1, 3) == False, "1 + 1 < 3 : impossible"
assert est_triangle(1, 2, 3) == False, "triangle aplati (1 + 2 = 3)"
assert est_triangle(0, 4, 4) == False, "longueur nulle"
assert est_triangle(5, 5, 5) == True, "équilatéral"
```

:::corrige
```python solution
def est_triangle(a, b, c):
    return a > 0 and b > 0 and c > 0 and a < b + c and b < a + c and c < a + b
```
Une expression booléenne se renvoie directement : pas besoin de `if … return True else return False`.
Le cas `(1, 2, 3)` vérifie qu'on a bien mis des inégalités **strictes**.
:::
::::

::::exercice[Trouver l'erreur]{niveau=3}
Ce programme doit afficher le tarif d'un billet : gratuit avant 4 ans, 5 € de 4 à 11 ans, 8 € de 12 à 17 ans,
12 € à partir de 18 ans. Il est faux. Trouve pour quels âges il se trompe, explique pourquoi et corrige-le.

```python
if age >= 4:
    tarif = 5
elif age >= 12:
    tarif = 8
elif age >= 18:
    tarif = 12
else:
    tarif = 0
```

:::criteres
- L'erreur est identifiée : tout âge ≥ 4 entre dans la première branche, donc les branches 8 € et 12 € ne sont jamais atteintes.
- Les âges concernés sont donnés : 12 ans et plus paient 5 € au lieu de 8 € ou 12 €.
- La correction teste les conditions de la plus restrictive à la moins restrictive (≥ 18, puis ≥ 12, puis ≥ 4), ou utilise des intervalles explicites.
- Des valeurs de test sont proposées aux limites : 3, 4, 11, 12, 17, 18.
:::

:::corrige
Python n'exécute que le **premier** bloc dont la condition est vraie. Pour `age = 15` ou `age = 40`, la condition
`age >= 4` est déjà vraie : le tarif vaut 5 et les branches suivantes ne sont jamais testées. Seuls les moins de
4 ans (gratuit) et les 4-11 ans (5 €) sont correctement traités.

```python
if age >= 18:
    tarif = 12
elif age >= 12:
    tarif = 8
elif age >= 4:
    tarif = 5
else:
    tarif = 0
```

Tests aux bornes : 3 → 0, 4 → 5, 11 → 5, 12 → 8, 17 → 8, 18 → 12.
:::
::::

::::exercice[Simplifier une condition]{niveau=3}
Un élève a écrit le code ci-dessous. Réécris-le avec une seule condition, sans `not`, et justifie l'équivalence.

```python
if not (x < 0 or x > 100):
    print("pourcentage valide")
```

:::criteres
- La loi de De Morgan est citée : `not (a or b)` équivaut à `not a and not b`.
- La négation de chaque comparaison est correcte : `not (x < 0)` est `x >= 0`, `not (x > 100)` est `x <= 100`.
- La condition obtenue est `x >= 0 and x <= 100`, ou `0 <= x <= 100`.
:::

:::corrige
Par De Morgan, `not (x < 0 or x > 100)` équivaut à `not (x < 0) and not (x > 100)`, c'est-à-dire
`x >= 0 and x <= 100`, que Python permet d'écrire `0 <= x <= 100` :

```python
if 0 <= x <= 100:
    print("pourcentage valide")
```

Attention à la négation des comparaisons : le contraire de `x < 0` est `x >= 0` (et non `x > 0`).
:::
::::

::::exercice[Court-circuit et sûreté]{niveau=4 duree=15}
On considère la fonction suivante, qui doit dire si `b` divise `a` (avec la convention : 0 ne divise que 0).

```python
def divise(b, a):
    if a % b == 0 and b != 0:
        return True
    elif b == 0 and a == 0:
        return True
    return False
```

1. Donne un appel qui provoque une erreur, et explique pourquoi.
2. Corrige la fonction en modifiant le moins de choses possible, et justifie précisément pourquoi ta version ne peut
   plus provoquer cette erreur.
3. Réécris la fonction en une seule instruction `return` (une expression booléenne), puis propose un jeu de tests
   couvrant tous les cas.

:::criteres
- Un appel fautif est donné, par exemple `divise(0, 5)`, avec l'explication : `a % b` est calculé alors que `b` vaut 0 (ZeroDivisionError).
- La correction inverse l'ordre des opérandes du `and` : `b != 0 and a % b == 0`.
- La justification invoque l'évaluation paresseuse : si `b != 0` est faux, `a % b` n'est jamais calculé.
- Une expression unique correcte est proposée, par exemple `return (b != 0 and a % b == 0) or (b == 0 and a == 0)`.
- Les tests couvrent : `b` diviseur, `b` non diviseur, `b = 0` avec `a = 0`, `b = 0` avec `a ≠ 0`, nombres négatifs.
:::

:::corrige
1. `divise(0, 5)` : la première condition calcule `5 % 0`, ce qui lève `ZeroDivisionError` avant même que
   `b != 0` soit examiné.
2. Il suffit d'inverser les deux opérandes du `and` : `if b != 0 and a % b == 0:`. Avec l'évaluation paresseuse,
   `and` évalue d'abord `b != 0` ; si c'est faux, le résultat est `False` sans calculer `a % b`. Le reste n'est donc
   calculé que lorsque `b` est non nul : la division par zéro est impossible. La deuxième branche est déjà sûre
   (elle ne fait aucune division).
3. ```python
   def divise(b, a):
       return (b != 0 and a % b == 0) or (b == 0 and a == 0)
   ```
   Tests : `divise(3, 12)` → `True` ; `divise(5, 12)` → `False` ; `divise(0, 0)` → `True` ;
   `divise(0, 7)` → `False` (sans erreur) ; `divise(-3, 12)` → `True` ; `divise(4, -8)` → `True`.
:::
::::
