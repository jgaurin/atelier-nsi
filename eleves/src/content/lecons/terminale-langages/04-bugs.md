---
titre: Les bugs typiques
resume: "Reconnaître les causes d'erreurs les plus fréquentes et savoir les corriger."
duree: 30
objectifs:
  - "Reconnaître les causes typiques de bugs"
  - "Corriger un programme"
---

La plupart des bugs viennent des mêmes causes. Apprends à les repérer.

## Les causes typiques

| Cause | Exemple | Remède |
| --- | --- | --- |
| **Typage** | `input()` renvoie une chaîne | convertir avec `int` |
| **Effet de bord** | une fonction modifie le tableau reçu | travailler sur une copie |
| **Débordement** | `t[len(t)]` | vérifier les bornes |
| **Conditionnelle non exhaustive** | un cas oublié renvoie `None` | prévoir tous les cas |
| **Choix des inégalités** | `>` au lieu de `>=` | tester la valeur frontière |
| **Flottants** | `0.1 + 0.2 == 0.3` est faux | comparer avec une tolérance |
| **Mauvais nommage** | `x`, `tmp2` partout | des noms qui ont un sens |

```python exec
def ajouter_bonus(notes):
    notes.append(20)       # modifie le tableau de l'appelant
    return sum(notes) / len(notes)

mes_notes = [12, 14]
print(ajouter_bonus(mes_notes))
print(mes_notes)
```

## Une méthode

1. **Reproduire** le bug avec un exemple précis.
2. **Isoler** la ligne fautive, avec des tests ou des `print`.
3. **Corriger**, puis relancer tous les tests.

Tester les cas limites est essentiel : tableau vide, valeur frontière, valeurs négatives.

## L'essentiel

- Typage, effets de bord, débordements, cas oubliés, inégalités, flottants, nommage.
- Les spécifications, assertions et tests aident à anticiper ces erreurs.

## Exercices

::::exercice[Quel bug ?]{niveau=1 type=associer}
Associe chaque extrait au problème qu'il contient.

| Extrait | Problème |
| --- | --- |
| `a = b * c2` dans un calcul de prix | mauvais nommage |
| `for i in range(len(t) + 1): print(t[i])` | débordement |
| `if a == 0.3:` avec un flottant calculé | comparaison de flottants |
| `age = input("Âge ?")` puis `age + 1` | typage |
| `if note > 10:` pour « au moins 10 » | choix de l'inégalité |
::::

::::exercice[Que renvoie-t-elle ?]{niveau=1 type=reponses}
On considère la fonction suivante.

```python
def mention(n):
    if n >= 16:
        return "TB"
    elif n >= 14:
        return "B"
```

1. Que renvoie `mention(16)` ?

   ```python calcul
   print("TB")
   ```

   - TB

1. Que renvoie `mention(10)` ?

   - None

   > Aucun cas ne convient : la conditionnelle n'est pas exhaustive.

1. Comment appelle-t-on ce type de bug ? Complète : conditionnelle non…

   - exhaustive
::::

::::exercice[Corriger les bugs typiques]{niveau=2}
Chacune des fonctions ci-dessous contient un bug typique. Corrige-les.

```python depart
def mention(note):
    """Renvoie 'TB' si note >= 16, 'B' si note >= 14, 'AB' si note >= 12, 'P' si note >= 10, sinon 'NA'."""
    if note > 16:
        return "TB"
    elif note >= 14:
        return "B"
    elif note >= 12:
        return "AB"
    elif note >= 10:
        return "P"

def presque_egal(a, b):
    """Renvoie True si a et b sont égaux à 1e-9 près."""
    return a == b

def moyenne_sans_modifier(t):
    """Renvoie la moyenne de t sans ses valeurs extrêmes, sans modifier t (len(t) >= 3)."""
    t.sort()
    t.pop(0)
    t.pop()
    return sum(t) / len(t)
```

```python tests
assert mention(16) == "TB" and mention(15) == "B" and mention(12) == "AB", "inégalités"
assert mention(8) == "NA", "cas oublié"
assert presque_egal(0.1 + 0.2, 0.3), "flottants"
assert not presque_egal(1.0, 1.1), "vraiment différents"
notes = [12, 3, 18, 10]
assert moyenne_sans_modifier(notes) == 11, "moyenne sans extrêmes"
assert notes == [12, 3, 18, 10], "le tableau n'est pas modifié"
```

:::corrige
```python solution
def mention(note):
    if note >= 16:
        return "TB"
    elif note >= 14:
        return "B"
    elif note >= 12:
        return "AB"
    elif note >= 10:
        return "P"
    else:
        return "NA"

def presque_egal(a, b):
    return abs(a - b) < 1e-9

def moyenne_sans_modifier(t):
    copie = sorted(t)
    copie = copie[1:len(copie) - 1]
    return sum(copie) / len(copie)
```

Trois bugs typiques : **inégalité** stricte au lieu de large (16 donnait « B ») et **conditionnelle non exhaustive** (8 donnait `None`) ;
**comparaison de flottants** avec `==` ; **effet de bord** (`sort` et `pop` modifiaient le tableau de l'appelant) corrigé avec `sorted`, qui
renvoie une copie.
:::
::::

::::exercice[Un carnet de températures]{niveau=3}
Ces trois fonctions respectent mal leur spécification. Chacune contient au moins un bug typique : corrige-les.

À l'écrit : quel bug un test de `maximum` avec seulement `[1, 5, 3]` n'aurait-il pas détecté ? Qu'en déduis-tu sur les jeux de tests ?

```python depart
def maximum(t):
    """Renvoie la plus grande valeur du tableau non vide t."""
    m = 0
    for i in range(len(t) + 1):
        if t[i] > m:
            m = t[i]
    return m

def corriger(t, ecart):
    """Renvoie un nouveau tableau où ecart est ajouté à chaque valeur. t n'est pas modifié."""
    for i in range(len(t)):
        t[i] = t[i] + ecart
    return t

def niveau(temp):
    """Renvoie 'froid' si temp < 10, 'doux' si 10 <= temp <= 25, 'chaud' si temp > 25."""
    if temp < 10:
        return "froid"
    elif temp > 10 and temp < 25:
        return "doux"
    elif temp > 25:
        return "chaud"
```

```python tests
assert maximum([1, 5, 3]) == 5, "cas général"
assert maximum([-4, -2, -9]) == -2, "valeurs négatives"
t = [10, 20]
assert corriger(t, 1) == [11, 21], "nouveau tableau"
assert t == [10, 20], "t n'est pas modifié"
assert niveau(9) == "froid", "froid"
assert niveau(10) == "doux", "frontière 10"
assert niveau(25) == "doux", "frontière 25"
assert niveau(26) == "chaud", "chaud"
```

:::corrige
```python solution
def maximum(t):
    """Renvoie la plus grande valeur du tableau non vide t."""
    m = t[0]
    for i in range(len(t)):
        if t[i] > m:
            m = t[i]
    return m

def corriger(t, ecart):
    """Renvoie un nouveau tableau où ecart est ajouté à chaque valeur. t n'est pas modifié."""
    return [x + ecart for x in t]

def niveau(temp):
    """Renvoie 'froid' si temp < 10, 'doux' si 10 <= temp <= 25, 'chaud' si temp > 25."""
    if temp < 10:
        return "froid"
    elif temp <= 25:
        return "doux"
    return "chaud"
```

`maximum` avait un débordement et une mauvaise initialisation. `corriger` avait un effet de bord. `niveau` oubliait les frontières 10 et 25, et renvoyait alors `None`.

**À l'écrit.** Ce test ne détecte pas l'initialisation à 0 : il faut essayer un tableau de valeurs négatives. Réussir des tests ne prouve pas qu'un programme est correct.
:::
::::
