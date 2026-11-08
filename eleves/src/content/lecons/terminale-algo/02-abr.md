---
titre: Arbres binaires de recherche
resume: "Rechercher et insérer une clé dans un arbre binaire de recherche."
duree: 40
objectifs:
  - "Reconnaître un arbre binaire de recherche"
  - "Rechercher et insérer une clé"
  - "Relier le coût à la hauteur de l'arbre"
prerequis: [terminale-algo/arbres]
---

Dans un **arbre binaire de recherche** (ABR), pour **chaque** nœud : les clés de gauche sont **plus petites**, les clés de droite **plus grandes**.

## 1. Rechercher

À chaque nœud, la comparaison indique une seule direction.

```python exec
class Noeud:
    def __init__(self, cle, gauche=None, droit=None):
        self.cle = cle
        self.gauche = gauche
        self.droit = droit

def rechercher(a, x):
    if a is None:
        return False
    if x == a.cle:
        return True
    if x < a.cle:
        return rechercher(a.gauche, x)
    return rechercher(a.droit, x)

abr = Noeud(15, Noeud(8), Noeud(22))
print(rechercher(abr, 22), rechercher(abr, 9))
```

## 2. Insérer

On descend comme pour une recherche, et on crée une **feuille** à l'emplacement vide.

```python exec
class Noeud:
    def __init__(self, cle, gauche=None, droit=None):
        self.cle = cle
        self.gauche = gauche
        self.droit = droit

def inserer(a, x):
    if a is None:
        return Noeud(x)
    if x < a.cle:
        a.gauche = inserer(a.gauche, x)
    elif x > a.cle:
        a.droit = inserer(a.droit, x)
    return a

abr = None
for x in [15, 8, 22]:
    abr = inserer(abr, x)
print(abr.gauche.cle)
```

## 3. Le coût

Le nombre de comparaisons est au plus la **hauteur** de l'arbre : environ log₂(n) si l'arbre est **équilibré**, jusqu'à n s'il est **filiforme**.

Le parcours **infixe** d'un ABR donne les clés **triées**.

## L'essentiel

- Pour chaque nœud : gauche plus petit, droite plus grand.
- Recherche et insertion suivent une seule branche.
- Coût logarithmique si l'arbre est équilibré.
- Le parcours infixe donne les clés triées.

## Exercices

::::exercice[QCM : arbres binaires de recherche]{niveau=1 type=quiz}
Une question à la fois : la correction s'affiche aussitôt.

1. Dans un ABR, où se trouvent les clés plus petites que la racine ?

   - [x] dans le sous-arbre gauche
   - [ ] dans le sous-arbre droit
   - [ ] n'importe où
   - [ ] dans les feuilles seulement

   > Par définition, à gauche plus petit, à droite plus grand.

1. Combien de comparaisons pour trouver 11 ?

   - [ ] 1
   - [ ] 2
   - [x] 3
   - [ ] 7

   > 15 (à gauche), 8 (à droite), 11 (trouvé).

1. Où sera insérée la clé 20 ?

   - [ ] enfant gauche de 19
   - [x] enfant droit de 19
   - [ ] enfant gauche de 30
   - [ ] à la racine

   > 20 > 15 à droite, 20 < 22 à gauche, 20 > 19 à droite.

1. Que donne le parcours infixe de cet arbre ?

   - [ ] 15 8 4 11 22 19 30
   - [x] 4 8 11 15 19 22 30
   - [ ] 4 11 8 19 30 22 15
   - [ ] 15 8 22 4 11 19 30

   > Les clés triées.

1. Où se trouve le minimum d'un ABR ?

   - [ ] à la racine
   - [x] au nœud le plus à gauche
   - [ ] dans la feuille la plus à droite
   - [ ] n'importe où

   > On descend à gauche tant que possible.

1. On insère 1, 2, 3, 4, 5 dans cet ordre dans un ABR vide. Quelle est sa hauteur ?

   - [ ] 2
   - [ ] 3
   - [x] 5
   - [ ] 1

   > Chaque clé va à droite de la précédente : arbre filiforme.

1. Quel est le coût d'une recherche dans un ABR de hauteur h ?

   - [ ] toujours log₂(n)
   - [x] au plus h comparaisons
   - [ ] toujours n comparaisons
   - [ ] constant

   > On suit une seule branche.

1. L'arbre de racine 10, d'enfant gauche 5 et dont 5 a pour enfant droit 12, est-il un ABR ?

   - [ ] oui, car 12 > 5
   - [x] non, car 12 est dans le sous-arbre gauche de 10 et 12 > 10
   - [ ] oui, car il est binaire
   - [ ] impossible à dire

   > La propriété porte sur tout le sous-arbre.

1. Un ABR équilibré contient un million de clés. Combien de comparaisons environ pour une recherche ?

   - [ ] un million
   - [ ] 1 000
   - [x] 20
   - [ ] 1

   > Sa hauteur est d'environ log₂(10⁶) ≈ 20.

1. Dans `inserer`, pourquoi écrire `a.gauche = inserer(a.gauche, x)` ?

   - [ ] pour aller plus vite
   - [x] pour rattacher le nouveau nœud quand `a.gauche` était vide
   - [ ] pour supprimer le sous-arbre gauche
   - [ ] ce n'est pas nécessaire

   > Si `a.gauche` vaut `None`, l'appel renvoie le nouveau nœud, qu'il faut accrocher.
::::

::::exercice[Dérouler une insertion]{niveau=1 type=reponses}
On insère dans cet ordre, dans un ABR vide : 40, 20, 60, 10, 30.

1. Quelle clé est à la racine ?

   - 40

1. Quel est l'enfant gauche de 20 ?

   - 10

1. Quel est l'enfant droit de 20 ?

   - 30

1. Combien de comparaisons faut-il pour trouver 30 ?

   - 3

1. Quel est le résultat du parcours infixe ? Écris les valeurs séparées par un espace.

   ```python calcul
   print(" ".join(map(str, sorted([40, 20, 60, 10, 30]))))
   ```

   - 10 20 30 40 60
::::

::::exercice[Compléter la recherche]{niveau=1 type=completer}
Complète la version itérative.

```python trous
def rechercher(a, x):
    while a is not [[None]]:
        if x == a.cle:
            return [[True]]
        elif x < a.cle:
            a = a.[[gauche]]
        else:
            a = a.[[droit]]
    return [[False]]
```
::::

::::exercice[Rechercher et insérer]{niveau=1}
Écris `rechercher(a, x)` et `inserer(a, x)` pour un ABR représenté avec la classe `Noeud` fournie. `inserer` renvoie l'arbre et ne fait rien si
x est déjà présent.

```python depart
class Noeud:
    def __init__(self, cle, gauche=None, droit=None):
        self.cle = cle
        self.gauche = gauche
        self.droit = droit

def rechercher(a, x):
    ...

def inserer(a, x):
    ...
```

```python tests
abr = None
for x in [15, 8, 22, 4, 11, 19, 30]:
    abr = inserer(abr, x)
assert abr.cle == 15 and abr.gauche.cle == 8 and abr.droit.droit.cle == 30, "forme"
assert rechercher(abr, 19) and rechercher(abr, 4), "présents"
assert not rechercher(abr, 12) and not rechercher(None, 3), "absents"
abr = inserer(abr, 12)
assert abr.gauche.droit.droit.cle == 12, "12 enfant droit de 11"
abr = inserer(abr, 15)
assert abr.droit.cle == 22 and abr.gauche.cle == 8, "doublon ignoré"
```

:::corrige
```python solution
class Noeud:
    def __init__(self, cle, gauche=None, droit=None):
        self.cle = cle
        self.gauche = gauche
        self.droit = droit

def rechercher(a, x):
    while a is not None:
        if x == a.cle:
            return True
        elif x < a.cle:
            a = a.gauche
        else:
            a = a.droit
    return False

def inserer(a, x):
    if a is None:
        return Noeud(x)
    if x < a.cle:
        a.gauche = inserer(a.gauche, x)
    elif x > a.cle:
        a.droit = inserer(a.droit, x)
    return a
```

La recherche est écrite en itératif, l'insertion en récursif : les deux versions sont attendues à l'écrit.
:::
::::

::::exercice[Est-ce un ABR ?]{niveau=2}
Écris `est_abr(a)` qui renvoie `True` si l'arbre binaire `a` est un arbre binaire de recherche (clés distinctes). Indication : un arbre est un
ABR si et seulement si son parcours infixe est **strictement croissant**.

```python depart
class Noeud:
    def __init__(self, cle, gauche=None, droit=None):
        self.cle = cle
        self.gauche = gauche
        self.droit = droit

def est_abr(a):
    ...
```

```python tests
bon = Noeud(15, Noeud(8, Noeud(4), Noeud(11)), Noeud(22, Noeud(19), Noeud(30)))
assert est_abr(bon), "ABR du cours"
piege = Noeud(10, Noeud(5, None, Noeud(12)), Noeud(20))
assert not est_abr(piege), "12 est à gauche de 10"
assert est_abr(None) and est_abr(Noeud(3)), "cas limites"
assert not est_abr(Noeud(5, Noeud(7))), "enfant gauche plus grand"
```

:::corrige
```python solution
class Noeud:
    def __init__(self, cle, gauche=None, droit=None):
        self.cle = cle
        self.gauche = gauche
        self.droit = droit

def infixe(a):
    if a is None:
        return []
    return infixe(a.gauche) + [a.cle] + infixe(a.droit)

def est_abr(a):
    t = infixe(a)
    for i in range(len(t) - 1):
        if t[i] >= t[i + 1]:
            return False
    return True
```

Comparer chaque nœud à ses seuls enfants ne suffirait pas : l'arbre `piege` passerait ce test (12 > 5) alors que ce n'est pas un ABR.
:::
::::
