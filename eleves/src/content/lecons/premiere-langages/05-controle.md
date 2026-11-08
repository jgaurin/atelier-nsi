---
titre: Contrôle du chapitre
resume: "Un contrôle de 55 minutes noté sur 20 sur la spécification, les tests et les bibliothèques."
duree: 55
controle: true
objectifs:
  - "Spécifier une fonction"
  - "Choisir des tests et corriger un programme"
prerequis: [premiere-langages/bibliotheques]
---

## Consignes

Durée : **55 minutes**. Le contrôle est noté sur **20 points**.

## Exercices

::::exercice[Vocabulaire]{niveau=3 type=associer points=4}
Chaque association vaut 1 point.

| Situation | Notion |
| --- | --- |
| Le tableau reçu ne doit pas être vide | précondition |
| Le résultat renvoyé est positif | postcondition |
| On vérifie la fonction avec un tableau à un seul élément | cas limite |
| `from math import sqrt` | utilisation d'une bibliothèque |
::::

::::exercice[Erreurs]{niveau=3 type=reponses points=4}
Donne le nom de l'erreur provoquée. Chaque question vaut 1 point.

1. `print(prix)` alors que `prix` n'a jamais été défini.

   - NameError

1. `t = [1, 2]` puis `print(t[2])`.

   - IndexError

1. `print("Note : " + 15)`.

   - TypeError

1. `assert 2 > 3`.

   - AssertionError
::::

::::exercice[Trouver le bug]{niveau=3 points=6}
Cette fonction doit renvoyer `True` si `x` est dans `t`. Elle est fausse. Corrige-la.

```python depart
def present(t, x):
    for v in t:
        if v == x:
            return True
        else:
            return False
    return False
```

```python tests
assert present([1, 2, 3], 3), "à la fin"
assert present([1, 2, 3], 1), "au début"
assert not present([1, 2], 5), "absent"
assert not present([], 5), "vide"
```

:::corrige
```python solution
def present(t, x):
    for v in t:
        if v == x:
            return True
    return False
```

Le `else` arrêtait la boucle dès le premier élément différent de `x`.
:::
::::

::::exercice[Spécifier et tester]{niveau=3 points=6}
On veut une fonction `nb_voyelles(mot)` qui compte les voyelles minuscules a, e, i, o, u, y d'un mot.

1. Écris une précondition raisonnable pour cette fonction.
2. Donne au moins quatre tests en précisant, pour chacun, ce qu'il vérifie.
3. Pourquoi ces tests ne garantissent-ils pas que la fonction est correcte ?

:::criteres
- 1 point : une précondition correcte (par exemple : `mot` est une chaîne de lettres minuscules).
- 3 points : quatre tests variés dont un mot vide et un mot sans voyelle.
- 2 points : les tests vérifient des cas particuliers et ne couvrent pas tous les mots possibles.
:::

:::corrige
Précondition : `mot` est une chaîne de lettres minuscules. Tests : `nb_voyelles("") == 0` (mot vide) ; `nb_voyelles("brr") == 0` (aucune voyelle) ; `nb_voyelles("eau") == 3` (que des voyelles) ; `nb_voyelles("chat") == 1` (cas général). Ces tests ne vérifient que quelques mots : même s'ils réussissent tous, la fonction peut être fausse sur un autre mot.
:::
::::
