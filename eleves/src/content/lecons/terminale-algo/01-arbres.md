---
titre: Algorithmes sur les arbres
resume: "Calculer la taille et la hauteur d'un arbre, et le parcourir de différentes façons."
duree: 45
objectifs:
  - "Calculer la taille et la hauteur d'un arbre"
  - "Parcourir un arbre en ordre préfixe, infixe, suffixe et en largeur"
prerequis: [terminale-structures/arbres, terminale-langages/recursivite]
---

Un arbre binaire est défini de façon récursive : c'est pourquoi les algorithmes sur les arbres sont naturellement **récursifs**.

## 1. Taille et hauteur

```python exec
class Noeud:
    def __init__(self, valeur, gauche=None, droit=None):
        self.valeur = valeur
        self.gauche = gauche
        self.droit = droit

def taille(a):
    if a is None:
        return 0
    return 1 + taille(a.gauche) + taille(a.droit)

def hauteur(a):
    if a is None:
        return 0
    return 1 + max(hauteur(a.gauche), hauteur(a.droit))

arbre = Noeud("A", Noeud("B", Noeud("D"), Noeud("E")), Noeud("C", None, Noeud("F")))
print(taille(arbre), hauteur(arbre))
```

## 2. Les parcours en profondeur

| Parcours | Ordre | Sur l'arbre ci-dessus |
| --- | --- | --- |
| **préfixe** | racine, gauche, droit | A B D E C F |
| **infixe** | gauche, racine, droit | D B E A C F |
| **suffixe** | gauche, droit, racine | D E B F C A |

## 3. Le parcours en largeur

On visite **niveau par niveau**, à l'aide d'une **file** : A B C D E F.

## L'essentiel

- Taille : 1 + taille(gauche) + taille(droit). Hauteur : 1 + max des hauteurs.
- Préfixe : R G D. Infixe : G R D. Suffixe : G D R.
- Largeur : niveau par niveau, avec une file.

## Exercices

::::exercice[QCM : parcours d'arbres]{niveau=1 type=quiz}
Une question à la fois : la correction s'affiche aussitôt.
enfant droit F.

1. Quel est le parcours préfixe ?

   - [x] A B D E C F
   - [ ] D B E A C F
   - [ ] D E B F C A
   - [ ] A B C D E F

   > Racine, puis sous-arbre gauche, puis droit.

1. Quel est le parcours infixe ?

   - [ ] A B D E C F
   - [x] D B E A C F
   - [ ] D E B F C A
   - [ ] A B C D E F

   > Gauche, racine, droit.

1. Quel est le parcours suffixe ?

   - [ ] A B D E C F
   - [ ] D B E A C F
   - [x] D E B F C A
   - [ ] F E D C B A

   > Gauche, droit, racine : la racine est toujours en dernier.

1. Quel est le parcours en largeur ?

   - [ ] A B D E C F
   - [x] A B C D E F
   - [ ] D E F B C A
   - [ ] A C B F E D

   > Niveau par niveau, de gauche à droite.

1. Quelle structure utilise le parcours en largeur ?

   - [ ] une pile
   - [x] une file
   - [ ] un dictionnaire
   - [ ] un tableau trié

   > Les nœuds sont traités dans l'ordre où on les découvre.

::::

::::exercice[Écrire les parcours]{niveau=1 type=completer}
L'arbre a pour racine 1. Le sous-arbre gauche a pour racine 2, avec une feuille 4 à gauche. Le sous-arbre droit a pour racine 3, avec deux feuilles 5 et 6. Écris les valeurs séparées par un espace.

```python calcul
class N:
    def __init__(s, v, g=None, d=None):
        s.v, s.g, s.d = v, g, d
def pre(a): return [] if a is None else [a.v] + pre(a.g) + pre(a.d)
def inf(a): return [] if a is None else inf(a.g) + [a.v] + inf(a.d)
def suf(a): return [] if a is None else suf(a.g) + suf(a.d) + [a.v]
a = N(1, N(2, N(4)), N(3, N(5), N(6)))
print(" ".join(map(str, pre(a))))
print(" ".join(map(str, inf(a))))
print(" ".join(map(str, suf(a))))
print("1 2 3 4 5 6")
```

| Parcours | Résultat |
| --- | --- |
| Préfixe | [[1 2 4 3 5 6]] |
| Infixe | [[4 2 1 5 3 6]] |
| Suffixe | [[4 2 5 6 3 1]] |
| Largeur | [[1 2 3 4 5 6]] |
::::

::::exercice[Mesures d'un arbre]{niveau=1}
Avec la classe `Noeud` fournie, écris `taille(a)`, `hauteur(a)` (arbre vide : 0, racine seule : 1) et `somme(a)`, la somme des valeurs (des
nombres) de l'arbre.

```python depart
class Noeud:
    def __init__(self, valeur, gauche=None, droit=None):
        self.valeur = valeur
        self.gauche = gauche
        self.droit = droit

def taille(a):
    ...

def hauteur(a):
    ...

def somme(a):
    ...
```

```python tests
a = Noeud(5, Noeud(3, Noeud(1), Noeud(4)), Noeud(8, None, Noeud(9)))
assert taille(a) == 6, "taille"
assert hauteur(a) == 3, "hauteur"
assert somme(a) == 30, "somme"
assert taille(None) == 0 and hauteur(None) == 0 and somme(None) == 0, "arbre vide"
filiforme = Noeud(1, Noeud(2, Noeud(3, Noeud(4))))
assert hauteur(filiforme) == 4 and taille(filiforme) == 4, "arbre filiforme"
```

:::corrige
```python solution
class Noeud:
    def __init__(self, valeur, gauche=None, droit=None):
        self.valeur = valeur
        self.gauche = gauche
        self.droit = droit

def taille(a):
    if a is None:
        return 0
    return 1 + taille(a.gauche) + taille(a.droit)

def hauteur(a):
    if a is None:
        return 0
    return 1 + max(hauteur(a.gauche), hauteur(a.droit))

def somme(a):
    if a is None:
        return 0
    return a.valeur + somme(a.gauche) + somme(a.droit)
```

Trois fonctions, un seul schéma : cas de base `None`, puis combinaison des résultats des deux sous-arbres.
:::
::::

::::exercice[Les trois parcours]{niveau=2}
Écris `prefixe(a)`, `infixe(a)` et `suffixe(a)` qui renvoient la liste des valeurs dans l'ordre de chaque parcours.

```python depart
class Noeud:
    def __init__(self, valeur, gauche=None, droit=None):
        self.valeur = valeur
        self.gauche = gauche
        self.droit = droit

def prefixe(a):
    ...

def infixe(a):
    ...

def suffixe(a):
    ...
```

```python tests
a = Noeud("A", Noeud("B", Noeud("D"), Noeud("E")), Noeud("C", None, Noeud("F")))
assert prefixe(a) == ["A", "B", "D", "E", "C", "F"], "préfixe"
assert infixe(a) == ["D", "B", "E", "A", "C", "F"], "infixe"
assert suffixe(a) == ["D", "E", "B", "F", "C", "A"], "suffixe"
assert prefixe(None) == [] and infixe(None) == [] and suffixe(None) == [], "vide"
```

:::corrige
```python solution
class Noeud:
    def __init__(self, valeur, gauche=None, droit=None):
        self.valeur = valeur
        self.gauche = gauche
        self.droit = droit

def prefixe(a):
    if a is None:
        return []
    return [a.valeur] + prefixe(a.gauche) + prefixe(a.droit)

def infixe(a):
    if a is None:
        return []
    return infixe(a.gauche) + [a.valeur] + infixe(a.droit)

def suffixe(a):
    if a is None:
        return []
    return suffixe(a.gauche) + suffixe(a.droit) + [a.valeur]
```

Seule la **place** de `[a.valeur]` change d'un parcours à l'autre.
:::
::::

::::exercice[Parcours en largeur]{niveau=2}
Écris `par_niveaux(a)` qui renvoie la liste des niveaux de l'arbre, chaque niveau étant la liste de ses valeurs de gauche à droite. Par
exemple, pour l'arbre du cours : `[["A"], ["B", "C"], ["D", "E", "F"]]`.

```python depart
class Noeud:
    def __init__(self, valeur, gauche=None, droit=None):
        self.valeur = valeur
        self.gauche = gauche
        self.droit = droit

def par_niveaux(a):
    ...
```

```python tests
a = Noeud("A", Noeud("B", Noeud("D"), Noeud("E")), Noeud("C", None, Noeud("F")))
assert par_niveaux(a) == [["A"], ["B", "C"], ["D", "E", "F"]], "trois niveaux"
assert par_niveaux(None) == [], "vide"
assert par_niveaux(Noeud(1, None, Noeud(2))) == [[1], [2]], "deux niveaux"
```

:::corrige
```python solution
class Noeud:
    def __init__(self, valeur, gauche=None, droit=None):
        self.valeur = valeur
        self.gauche = gauche
        self.droit = droit

def par_niveaux(a):
    niveaux = []
    courant = []
    if a is not None:
        courant.append(a)
    while len(courant) > 0:
        niveaux.append([n.valeur for n in courant])
        suivant = []
        for n in courant:
            if n.gauche is not None:
                suivant.append(n.gauche)
            if n.droit is not None:
                suivant.append(n.droit)
        courant = suivant
    return niveaux
```

On traite les nœuds niveau par niveau : la liste `courant` joue le rôle de la file, en traitant tout un niveau à la fois.
:::
::::

::::exercice[Reconstituer un arbre]{niveau=2}
Un arbre binaire a pour parcours préfixe `R A C D B E` et pour parcours infixe `C A D R E B`. (a) Dessine-le en expliquant ta démarche.
(b) Donne son parcours suffixe et sa hauteur.

:::criteres
- Démarche : le premier élément du préfixe est la racine ; dans l'infixe, ce qui est à sa gauche forme le sous-arbre gauche, le reste le
  sous-arbre droit ; on recommence.
- Arbre correct : R ; à gauche A (enfants C et D) ; à droite B (enfant gauche E).
- Suffixe : C D A E B R ; hauteur 3 (en comptant les nœuds).
:::

:::corrige
(a) Le préfixe commence par la racine : **R**. Dans l'infixe `C A D | R | E B`, les nœuds à gauche de R (C, A, D) forment le sous-arbre gauche,
ceux à droite (E, B) le sous-arbre droit. Sous-arbre gauche : dans le préfixe, le suivant est **A**, c'est sa racine ; dans l'infixe `C A D`,
C est à gauche de A et D à droite. Sous-arbre droit : le préfixe donne **B** comme racine ; dans l'infixe `E B`, E est à gauche de B.

```
        R
      /   \
     A     B
    / \   /
   C   D E
```

(b) Suffixe : **C D A E B R**. Hauteur : **3** (chemin R, A, C par exemple).
:::
::::
