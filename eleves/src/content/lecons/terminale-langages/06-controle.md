---
titre: Contrôle du chapitre
resume: "Un contrôle d'une heure noté sur 20 sur la récursivité, les paradigmes, les bugs et la calculabilité."
duree: 60
controle: true
objectifs:
  - "Écrire et analyser une fonction récursive"
  - "Reconnaître les paradigmes et les bugs typiques"
  - "Expliquer l'indécidabilité de l'arrêt"
prerequis: [terminale-langages/calculabilite]
---

## Consignes

Durée : **1 heure**. Le contrôle est noté sur **20 points**.

## Exercices

::::exercice[Analyser]{niveau=3 type=reponses points=4}
Donne ce qui s'affiche. Chaque question vaut 2 points.

1. Que s'affiche-t-il ?

   ```python verifier
   def f(n):
       if n <= 1:
           return 1
       return n + f(n - 2)

   print(f(7))
   ```

   - 16

1. Que s'affiche-t-il ?

   ```python verifier
   def g(t):
       if len(t) == 1:
           return t[0]
       return max(t[0], g(t[1:]))

   print(g([4, 9, 2]))
   ```

   - 9
::::

::::exercice[Écrire une fonction récursive]{niveau=3 points=5}
Écris en **récursif** `nb_occurrences(t, x, i)`, qui renvoie le nombre d'occurrences de `x` dans `t` à partir de l'indice `i`.

```python depart
def nb_occurrences(t, x, i):
    ...
```

```python tests
assert nb_occurrences([1, 2, 1, 1], 1, 0) == 3, "depuis le début"
assert nb_occurrences([1, 2, 1, 1], 1, 2) == 2, "depuis l'indice 2"
assert nb_occurrences([], 1, 0) == 0, "tableau vide"
```

:::corrige
```python solution
def nb_occurrences(t, x, i):
    if i == len(t):
        return 0
    if t[i] == x:
        return 1 + nb_occurrences(t, x, i + 1)
    return nb_occurrences(t, x, i + 1)
```
:::
::::

::::exercice[Paradigmes et bugs]{niveau=3 type=associer points=4}
Chaque association vaut 1 point.

| Extrait | Notion |
| --- | --- |
| Une fonction modifie le tableau reçu sans le dire | effet de bord |
| `partie.jouer()` | programmation objet |
| `list(map(carre, t))` | programmation fonctionnelle |
| `t[len(t)]` | débordement |
::::

::::exercice[Corriger]{niveau=3 points=3}
Cette fonction doit renvoyer `True` si `x` et `y` sont égaux à 0,001 près. Corrige-la.

```python depart
def proches(x, y):
    return x == y
```

```python tests
assert proches(0.1 + 0.2, 0.3), "flottants"
assert not proches(1.0, 1.5), "différents"
```

:::corrige
```python solution
def proches(x, y):
    return abs(x - y) < 0.001
```
:::
::::

::::exercice[L'arrêt]{niveau=3 points=4}
Explique pourquoi on ne pourra jamais écrire un programme qui détecte, pour tout programme, s'il s'arrête.

:::criteres
- 1 point : le raisonnement suppose qu'une fonction `arret` existe.
- 1 point : `paradoxe` fait le contraire de ce que prédit `arret` sur lui-même.
- 1 point : on obtient une contradiction dans les deux cas.
- 1 point : `arret` ne peut donc pas exister, quelle que soit la puissance de la machine.
:::

:::corrige
Supposons qu'une fonction `arret` réponde toujours correctement. On écrit `paradoxe`, qui boucle si `arret(P, P)` est vrai et s'arrête sinon. Si `paradoxe(paradoxe)` s'arrête, `arret` a répondu faux, ce qui est contradictoire. S'il ne s'arrête pas, `arret` a répondu vrai, ce qui l'est aussi. La fonction `arret` ne peut donc pas exister, quelle que soit la puissance de la machine.
:::
::::
