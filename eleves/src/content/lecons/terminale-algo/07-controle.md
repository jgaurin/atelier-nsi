---
titre: Contrôle du chapitre
resume: "Un contrôle d'une heure noté sur 20 sur les algorithmes de terminale."
duree: 60
controle: true
objectifs:
  - "Parcourir des arbres et des graphes"
  - "Utiliser diviser pour régner et la programmation dynamique"
prerequis: [terminale-algo/boyer-moore]
---

## Consignes

Durée : **1 heure**. Le contrôle est noté sur **20 points**.

## Exercices

::::exercice[Arbres]{niveau=3 type=completer points=5}
L'arbre a pour racine 8, un sous-arbre gauche de racine 3 (avec deux feuilles 1 et 6) et un sous-arbre droit de racine 10 (avec une feuille droite 14). Écris les valeurs séparées par un espace.

```python calcul
class N:
    def __init__(s, v, g=None, d=None):
        s.v, s.g, s.d = v, g, d
def pre(a): return [] if a is None else [a.v] + pre(a.g) + pre(a.d)
def inf(a): return [] if a is None else inf(a.g) + [a.v] + inf(a.d)
def suf(a): return [] if a is None else suf(a.g) + suf(a.d) + [a.v]
a = N(8, N(3, N(1), N(6)), N(10, None, N(14)))
print(" ".join(map(str, pre(a))))
print(" ".join(map(str, inf(a))))
print(" ".join(map(str, suf(a))))
print("oui")
print(3)
```

| Parcours | Résultat |
| --- | --- |
| Préfixe | [[8 3 1 6 10 14]] |
| Infixe | [[1 3 6 8 10 14]] |
| Suffixe | [[1 6 3 14 10 8]] |

Cet arbre est-il un ABR ? [[oui]]

Sa hauteur, en comptant les nœuds, est [[3]].
::::

::::exercice[Graphe]{niveau=3 type=reponses points=4}
`g = {"A": ["B", "C"], "B": ["D"], "C": ["D"], "D": []}`, graphe orienté. Chaque question vaut 1 point.

1. Quelle structure utilise le parcours en largeur ?

   - file
   - une file

1. Ordre du parcours en largeur depuis A, séparé par des espaces.

   ```python calcul
   g = {"A": ["B", "C"], "B": ["D"], "C": ["D"], "D": []}
   v, f = ["A"], ["A"]
   while f:
       s = f.pop(0)
       for x in g[s]:
           if x not in v:
               v.append(x); f.append(x)
   print(" ".join(v))
   ```

   - A B C D

1. Peut-on aller de D à A ? Réponds par oui ou par non.

   - non

1. Pourquoi marque-t-on les sommets visités ? Réponds en complétant : pour éviter une boucle…

   - infinie
::::

::::exercice[Écrire un parcours]{niveau=3 points=4}
Écris `atteignable(g, a, b)` qui renvoie `True` s'il existe un chemin de `a` à `b` dans le graphe `g`, donné par un dictionnaire de listes de successeurs.

```python depart
def atteignable(g, a, b):
    ...
```

```python tests
g = {"A": ["B"], "B": ["C"], "C": [], "D": ["A"]}
assert atteignable(g, "A", "C"), "chemin en deux étapes"
assert not atteignable(g, "C", "A"), "sens interdit"
assert atteignable(g, "A", "A"), "même sommet"
```

:::corrige
```python solution
def atteignable(g, a, b):
    visites = [a]
    file = [a]
    while file != []:
        s = file.pop(0)
        if s == b:
            return True
        for v in g[s]:
            if v not in visites:
                visites.append(v)
                file.append(v)
    return False
```
:::
::::

::::exercice[Coûts]{niveau=3 type=associer points=3}
Associe chaque algorithme à son coût dans le pire cas.

| Algorithme | Coût |
| --- | --- |
| Tri fusion | n log₂ n |
| Tri par sélection | n² |
| Recherche dans un ABR filiforme | n |
::::

::::exercice[Rendu optimal]{niveau=3 points=4}
Complète `nb_pieces(somme, pieces)` : la fonction renvoie le nombre minimal de pièces. On suppose qu'une pièce de 1 existe.

```python depart
def nb_pieces(somme, pieces):
    nb = [0] * (somme + 1)
    for s in range(1, somme + 1):
        nb[s] = s
        ...
    return nb[somme]
```

```python tests
assert nb_pieces(6, [1, 3, 4]) == 2, "3 + 3"
assert nb_pieces(0, [1]) == 0, "rien à rendre"
assert nb_pieces(7, [1, 5]) == 3, "5 + 1 + 1"
```

:::corrige
```python solution
def nb_pieces(somme, pieces):
    nb = [0] * (somme + 1)
    for s in range(1, somme + 1):
        nb[s] = s
        for p in pieces:
            if p <= s and nb[s - p] + 1 < nb[s]:
                nb[s] = nb[s - p] + 1
    return nb[somme]
```
:::
::::
