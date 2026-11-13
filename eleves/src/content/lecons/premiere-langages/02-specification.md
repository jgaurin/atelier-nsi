---
titre: Spécifier une fonction
resume: "Dire précisément ce que fait une fonction, ce qu'elle attend et ce qu'elle garantit."
duree: 30
objectifs:
  - "Prototyper une fonction"
  - "Décrire des préconditions et des postconditions"
  - "Utiliser des assertions"
---

Avant de construire une maison, l'architecte dessine un plan : ce que la maison doit contenir. Avant d'écrire une fonction, on dit de même **ce qu'elle doit faire** : c'est sa **spécification**. Elle sert à celui qui écrit la fonction, et à tous ceux qui l'utiliseront.

## 1. La spécification d'une fonction

On l'écrit dans la **docstring**, le texte entre triples guillemets juste sous la ligne `def`.

```python exec
def moyenne(t):
    """Renvoie la moyenne des nombres du tableau t.

    Précondition : t n'est pas vide.
    Postcondition : le résultat est compris entre le minimum et le maximum de t.
    """
    return sum(t) / len(t)

print(moyenne([10, 14]))
```

Une spécification contient trois éléments.

| Élément | Question | Ici |
| --- | --- | --- |
| le **prototype** | comment s'appelle la fonction, que reçoit-elle, que renvoie-t-elle ? | `moyenne(t)` reçoit un tableau et renvoie un nombre |
| une **précondition** | que doit-on garantir **avant** d'appeler la fonction ? | le tableau n'est pas vide |
| une **postcondition** | que garantit la fonction **sur son résultat** ? | la moyenne est entre le minimum et le maximum |

La précondition est la responsabilité de celui qui **appelle** la fonction. La postcondition est la promesse de celui qui l'a **écrite**.

## 2. Vérifier avec des assertions

Une précondition écrite dans un commentaire peut être oubliée. L'instruction `assert` la **vérifie** pendant l'exécution : si la condition est fausse, le programme s'arrête avec le message donné.

```python exec erreur
def moyenne(t):
    assert len(t) > 0, "le tableau est vide"
    return sum(t) / len(t)

moyenne([])
```

Sans l'assertion, on obtiendrait une `ZeroDivisionError`, peu claire, à la dernière ligne. Avec elle, l'erreur dit exactement ce qui ne va pas, à l'endroit où le problème commence : la fonction a été mal appelée.

:::exemple
Pour une fonction `reduction(prix, p)`, qui applique une réduction de p %, une précondition raisonnable est que p est compris entre 0 et 100. On l'écrit : `assert 0 <= p <= 100, "pourcentage invalide"`.
:::

## L'essentiel

- La spécification, dans la docstring, dit ce que fait la fonction.
- Prototype : nom, paramètres, résultat. Précondition : ce qui doit être vrai à l'appel. Postcondition : ce qui est garanti sur le résultat.
- `assert condition, "message"` vérifie une condition et arrête le programme si elle est fausse.

## Exercices

::::exercice[QCM : spécification]{niveau=1 type=quiz}
Une question à la fois : la correction s'affiche aussitôt.

1. Qu'est-ce qu'une précondition ?

   - [ ] ce que la fonction renvoie
   - [x] une condition qui doit être vraie au moment de l'appel
   - [ ] la première ligne de la fonction
   - [ ] un test écrit avant la fonction

   > Exemple : « le tableau n'est pas vide ».

1. Que se passe-t-il si `assert x > 0` est exécuté avec x = -3 ?

   - [ ] rien
   - [ ] x devient positif
   - [x] le programme s'arrête avec une `AssertionError`
   - [ ] la ligne est ignorée

   > Si la condition est fausse, l'exécution s'arrête.

1. Lequel est un test correct de `carre(3)` ?

   - [ ] `assert carre(3) = 9`
   - [x] `assert carre(3) == 9`
   - [ ] `if carre(3) == 9`
   - [ ] `assert 9`

   > `==` compare ; `=` serait une erreur de syntaxe.

1. Que doit contenir la docstring d'une fonction ?

   - [ ] le détail de chaque ligne du code
   - [x] ce que fait la fonction, ses paramètres et ses conditions d'utilisation
   - [ ] le nom de l'auteur uniquement
   - [ ] les tests

   > Elle décrit le « quoi », pas le « comment ».
::::

::::exercice[Pré ou post ?]{niveau=1 type=associer}
La fonction `racine(x)` renvoie la racine carrée de `x`. Classe chaque phrase.

| Phrase | Type |
| --- | --- |
| x doit être positif ou nul | précondition |
| le résultat est positif ou nul | postcondition |
| x doit être un nombre | précondition |
| le carré du résultat est proche de x | postcondition |
::::

::::exercice[Écrire une précondition]{niveau=1 type=completer}
Complète l'assertion qui vérifie que `p` est un pourcentage, compris entre 0 et 100.

```python trous
def reduction(prix, p):
    assert [[0 <= p <= 100;p >= 0 and p <= 100;0 <= p and p <= 100]], "pourcentage invalide"
    return prix * (1 - p / 100)
```
::::

::::exercice[Précondition et tests]{niveau=2}
Écris `indice_premier(t, x)` qui renvoie l'indice de la première occurrence de `x` dans le tableau `t`, ou `-1` si `x` est absent, puis
`moyenne_ponderee(notes, coefs)` qui renvoie la moyenne pondérée. Pour cette seconde fonction, vérifie avec `assert` les préconditions : les
deux tableaux ont la même longueur et la somme des coefficients est strictement positive.

```python depart
def indice_premier(t, x):
    ...

def moyenne_ponderee(notes, coefs):
    ...
```

```python tests
assert indice_premier([4, 7, 4], 4) == 0, "première occurrence"
assert indice_premier([4, 7, 4], 9) == -1, "absent"
assert indice_premier([], 1) == -1, "tableau vide"
assert indice_premier([1, 2, 3], 3) == 2, "dernière position"
assert moyenne_ponderee([10, 16], [1, 2]) == 14, "pondération"
erreur = False
try:
    moyenne_ponderee([10, 16], [1])
except AssertionError:
    erreur = True
assert erreur, "longueurs différentes : AssertionError attendue"
erreur = False
try:
    moyenne_ponderee([10], [0])
except AssertionError:
    erreur = True
assert erreur, "coefficients nuls : AssertionError attendue"
```

:::corrige
```python solution
def indice_premier(t, x):
    for i in range(len(t)):
        if t[i] == x:
            return i
    return -1

def moyenne_ponderee(notes, coefs):
    assert len(notes) == len(coefs), "autant de notes que de coefficients"
    somme_coefs = 0
    for c in coefs:
        somme_coefs = somme_coefs + c
    assert somme_coefs > 0, "la somme des coefficients doit être positive"
    total = 0
    for i in range(len(notes)):
        total = total + notes[i] * coefs[i]
    return total / somme_coefs
```

Le `return i` dans la boucle arrête la fonction dès la première occurrence. Les `assert` empêchent un résultat absurde (ou une division par
zéro) et donnent un message clair.
:::
::::

::::exercice[Une caisse automatique]{niveau=3}
Une caisse automatique calcule la monnaie à rendre.

1. Écris `monnaie(prix, paye)`, qui renvoie `paye - prix`. Ajoute deux assertions : le prix est positif ou nul, et le montant payé suffit.
2. Écris `total(prix, quantites)`, qui renvoie la somme des `prix[i] * quantites[i]`. Ajoute une assertion : les deux tableaux ont la même taille.
3. À l'écrit : rédige la docstring de `monnaie`, avec sa précondition et sa postcondition. Pourquoi une assertion est-elle préférable à un résultat faux renvoyé sans prévenir ?

```python depart
def monnaie(prix, paye):
    ...

def total(prix, quantites):
    ...
```

```python tests
def refuse(f, *args):
    try:
        f(*args)
    except AssertionError:
        return True
    return False

assert monnaie(3, 5) == 2, "monnaie"
assert monnaie(5, 5) == 0, "compte juste"
assert refuse(monnaie, 8, 5), "montant insuffisant"
assert refuse(monnaie, -1, 5), "prix négatif"
assert total([2, 3], [10, 1]) == 23, "total"
assert total([], []) == 0, "panier vide"
assert refuse(total, [2, 3], [1]), "tailles différentes"
```

:::corrige
```python solution
def monnaie(prix, paye):
    """Renvoie la monnaie à rendre.

    Précondition : prix >= 0 et paye >= prix.
    Postcondition : le résultat est positif ou nul.
    """
    assert prix >= 0, "prix négatif"
    assert paye >= prix, "montant insuffisant"
    return paye - prix

def total(prix, quantites):
    assert len(prix) == len(quantites), "tailles différentes"
    s = 0
    for i in range(len(prix)):
        s = s + prix[i] * quantites[i]
    return s
```

**Question 3.** La docstring figure dans le corrigé. Une assertion arrête le programme là où le problème commence ; un résultat faux pourrait se propager sans que personne ne s'en aperçoive.
:::
::::
