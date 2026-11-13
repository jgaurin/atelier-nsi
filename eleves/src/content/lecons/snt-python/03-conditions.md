---
titre: Les conditions
resume: "Faire exécuter des instructions seulement si une condition est vraie."
duree: 30
objectifs:
  - "Écrire une instruction conditionnelle"
  - "Utiliser les comparaisons et les opérateurs logiques"
prerequis: [snt-python/fonctions]
---

Un programme doit souvent choisir : « si le mot de passe est juste, ouvrir la session, sinon afficher une erreur ». C'est le rôle des **conditions**.

## 1. `if` et `else`

```python exec
def acces(age):
    if age >= 18:
        return "majeur"
    else:
        return "mineur"

print(acces(20), acces(15))
```

- Après `if` vient une **condition**, qui est vraie ou fausse, puis `:`.
- Si elle est vraie, Python exécute le bloc décalé sous le `if`.
- Sinon, il exécute le bloc sous le `else`.

## 2. Plusieurs cas : `elif`

```python exec
def mention(note):
    if note >= 16:
        return "Très bien"
    elif note >= 10:
        return "Admis"
    else:
        return "Refusé"

print(mention(17), mention(12), mention(8))
```

Python teste les conditions **dans l'ordre**, et exécute seulement le **premier** bloc dont la condition est vraie.

| Note | `note >= 16` ? | `note >= 10` ? | Résultat |
| --- | --- | --- | --- |
| 17 | oui | pas testé | Très bien |
| 12 | non | oui | Admis |
| 8 | non | non | Refusé |

Pour 17, la condition `note >= 10` est vraie aussi, mais elle n'est même pas testée : la première a suffi. L'**ordre** des conditions compte donc beaucoup.

## 3. Comparer

| Écriture | Sens |
| --- | --- |
| `==` | égal à |
| `!=` | différent de |
| `<` et `<=` | inférieur, inférieur ou égal |
| `>` et `>=` | supérieur, supérieur ou égal |

:::attention
`=` **range** une valeur dans une variable. `==` **compare** deux valeurs. `if x = 3:` est une erreur ; il faut écrire `if x == 3:`.
:::

Attention aussi aux valeurs frontières : « admis à partir de 10 » s'écrit `note >= 10`. Avec `note > 10`, un élève qui a exactement 10 serait refusé.

## 4. Combiner des conditions

| Mot | Sens | Exemple |
| --- | --- | --- |
| `and` | vrai si **les deux** sont vraies | `age < 18 and carte` |
| `or` | vrai si **au moins une** est vraie | `age < 14 or etudiant` |
| `not` | inverse une condition | `not ferme` |

```python exec
age = 16
carte = True
print(age < 18 and carte)
```

## L'essentiel

- `if condition:` puis, éventuellement, `elif` et `else`, chacun suivi d'un bloc décalé.
- Python exécute le premier bloc dont la condition est vraie : l'ordre compte.
- `==` compare, `=` range.
- `and`, `or` et `not` combinent des conditions.

## Exercices

::::exercice[QCM : conditions]{niveau=1 type=quiz}
Une question à la fois : la correction s'affiche aussitôt.

1. Comment tester si `x` vaut 3 ?

   - [ ] `if x = 3:`
   - [x] `if x == 3:`
   - [ ] `if x is 3`
   - [ ] `x == 3 if:`

   > La comparaison s'écrit `==`, et la ligne finit par `:`.

1. Que vaut `5 > 3 and 2 > 4` ?

   - [ ] `True`
   - [x] `False`
   - [ ] 5
   - [ ] une erreur

   > La seconde condition est fausse.

1. Que vaut `5 > 3 or 2 > 4` ?

   - [x] `True`
   - [ ] `False`
   - [ ] 2
   - [ ] une erreur

   > Une seule condition vraie suffit.

1. Quand le bloc `else` est-il exécuté ?

   - [ ] toujours
   - [x] quand aucune condition précédente n'est vraie
   - [ ] quand la première condition est vraie
   - [ ] jamais

   > C'est le dernier cas possible.
::::

::::exercice[Quel résultat ?]{niveau=1 type=reponses}
On considère cette fonction.

```python
def f(x):
    if x > 10:
        return "grand"
    elif x > 5:
        return "moyen"
    return "petit"
```

1. Que renvoie `f(12)` ?

   - grand

1. Que renvoie `f(10)` ?

   - moyen

   > 10 n'est pas strictement supérieur à 10.

1. Que renvoie `f(5)` ?

   - petit
::::

::::exercice[Pair ou impair]{niveau=2}
Écris `parite(n)`, qui renvoie `"pair"` si l'entier `n` est pair et `"impair"` sinon.

```python depart
def parite(n):
    ...
```

```python tests
assert parite(4) == "pair", "4"
assert parite(7) == "impair", "7"
assert parite(0) == "pair", "0"
```

:::corrige
```python solution
def parite(n):
    if n % 2 == 0:
        return "pair"
    return "impair"
```

Un nombre est pair lorsque le reste de sa division par 2 vaut 0.
:::
::::

::::exercice[Le tarif du cinéma]{niveau=3}
Un cinéma applique les tarifs suivants : 5 € pour les moins de 14 ans ; 7 € pour les 14 à 25 ans, ou pour toute personne qui a une carte étudiante ; 10 € sinon.

1. Écris `tarif(age, etudiant)`, où `etudiant` est un booléen.
2. Écris `total(age, etudiant, popcorn)`, qui ajoute 4 € si `popcorn` est vrai.
3. À l'écrit : un camarade teste d'abord `age <= 25`, puis `age < 14`. Que se passe-t-il pour un enfant de 10 ans ?

```python depart
def tarif(age, etudiant):
    ...

def total(age, etudiant, popcorn):
    ...
```

```python tests
assert tarif(10, False) == 5, "enfant"
assert tarif(14, False) == 7, "14 ans"
assert tarif(25, False) == 7, "25 ans"
assert tarif(26, False) == 10, "plein tarif"
assert tarif(40, True) == 7, "étudiant"
assert total(30, False, True) == 14, "avec popcorn"
assert total(10, False, False) == 5, "sans popcorn"
```

:::corrige
```python solution
def tarif(age, etudiant):
    if age < 14:
        return 5
    elif age <= 25 or etudiant:
        return 7
    return 10

def total(age, etudiant, popcorn):
    if popcorn:
        return tarif(age, etudiant) + 4
    return tarif(age, etudiant)
```

**Question 3.** La première condition serait vraie pour 10 ans : il paierait 7 €. Le test `age < 14` ne serait jamais atteint pour un enfant. L'ordre des conditions compte.
:::
::::
