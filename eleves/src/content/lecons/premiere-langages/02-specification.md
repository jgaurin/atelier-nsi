---
titre: Spécifier une fonction
resume: "Dire précisément ce que fait une fonction, ce qu'elle attend et ce qu'elle garantit."
duree: 30
objectifs:
  - "Prototyper une fonction"
  - "Décrire des préconditions et des postconditions"
  - "Utiliser des assertions"
---

Avant d'écrire une fonction, on dit **ce qu'elle doit faire** : c'est sa **spécification**.

## 1. La spécification

On l'écrit dans la **docstring**, juste sous `def`.

```python exec
def moyenne(t):
    """Renvoie la moyenne des nombres du tableau t.

    Précondition : t n'est pas vide.
    Postcondition : le résultat est compris entre le minimum et le maximum de t.
    """
    return sum(t) / len(t)

print(moyenne([10, 14]))
```

- Le **prototype** : le nom de la fonction, ses paramètres et ce qu'elle renvoie.
- Une **précondition** : ce qui doit être vrai **à l'appel**.
- Une **postcondition** : ce qui est garanti **sur le résultat**.

## 2. Les assertions

`assert` arrête le programme si une condition est fausse.

```python exec erreur
def moyenne(t):
    assert len(t) > 0, "le tableau est vide"
    return sum(t) / len(t)

moyenne([])
```

L'erreur est claire et apparaît là où le problème commence.

## L'essentiel

- La docstring dit ce que fait la fonction.
- Précondition : ce qui est attendu à l'appel. Postcondition : ce qui est garanti sur le résultat.
- `assert condition, "message"` vérifie une condition.

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
