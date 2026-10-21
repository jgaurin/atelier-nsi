---
titre: Tableaux (listes Python)
resume: "Le cours de première NSI sur les tableaux, représentés en Python par le type list : indices, lecture et modification, ajout avec append, parcours par indice ou par valeur, construction par compréhension, tableaux de tableaux (matrices) et piège de l'aliasing."
duree: 50
objectifs:
  - "Lire et modifier un élément d'un tableau par son indice"
  - "Parcourir un tableau par indice et par valeur"
  - "Construire un tableau par ajouts successifs et par compréhension"
  - "Manipuler un tableau de tableaux (matrice) avec a[i][j]"
  - "Comprendre qu'une affectation b = a ne copie pas le tableau"
prerequis: [nsi-premiere/tuples, snt-python/boucles-bornees]
programme: [nsi1-construits]
cartes:
  - q: "Quel est l'indice du dernier élément d'un tableau t ?"
    r: "`len(t) - 1`. Les indices vont de 0 à `len(t) - 1` ; `t[len(t)]` provoque une `IndexError`."
  - q: "Différence entre un tableau (list) et un p-uplet (tuple) en Python ?"
    r: "Le tableau est **modifiable** (`t[0] = 5`, `t.append(8)`), le p-uplet non."
  - q: "Les deux façons de parcourir un tableau ?"
    r: "Par **indice** : `for i in range(len(t)): ... t[i]` (on connaît la position). Par **valeur** : `for x in t: ... x` (plus simple, sans la position)."
  - q: "Que construit `[x * x for x in range(5)]` ?"
    r: "Le tableau `[0, 1, 4, 9, 16]` : c'est une construction **par compréhension**."
  - q: "Comment accéder à la case ligne 1, colonne 2 d'une matrice m ?"
    r: "`m[1][2]` : `m[1]` est la ligne 1 (un tableau), et `[2]` prend sa case d'indice 2."
  - q: "Après `b = a` puis `b[0] = 99`, que vaut `a[0]` ?"
    r: "99 : `a` et `b` désignent le **même** tableau. Pour une copie : `b = list(a)` ou `b = [x for x in a]`."
---

Le **tableau** est la structure de données la plus utilisée en programmation : une suite de valeurs rangées dans des cases numérotées. En Python,
on utilise pour cela le type `list`. Ce chapitre est central en première : tous les algorithmes de l'année (recherche, tris, dichotomie, k plus
proches voisins) travaillent sur des tableaux.

## Ce que dit le programme

Contenu : *tableau indexé, tableau donné en compréhension*. Capacités attendues : **lire et modifier les éléments d'un tableau grâce à leurs
index** ; **construire un tableau par compréhension** ; **utiliser des tableaux de tableaux pour représenter des matrices** (notation `a[i][j]`) ;
**itérer sur les éléments d'un tableau**. Le programme précise que, seuls les tableaux étant au programme, les listes Python sont utilisées
**comme des tableaux** ; les tranches (`t[2:5]`) ne sont pas exigibles.

## 1. Créer et lire un tableau

```python exec
notes = [12, 8, 15, 10]
print(notes[0])          # premier élément
print(notes[3])          # dernier élément
print(len(notes))        # nombre d'éléments
print(notes[len(notes) - 1])
```

Les **indices** vont de `0` à `len(t) - 1`. Un indice trop grand provoque une erreur :

```python exec erreur
notes = [12, 8, 15, 10]
print(notes[4])          # IndexError : list index out of range
```

On peut écrire `notes[-1]` pour le dernier élément, mais ce n'est pas exigible : en classe, on préfère `notes[len(notes) - 1]`, qui fait
comprendre la numérotation.

## 2. Modifier un tableau

Contrairement au p-uplet, un tableau est **modifiable** (mutable).

```python exec
notes = [12, 8, 15, 10]
notes[1] = 9             # on remplace la case d'indice 1
notes.append(17)         # on ajoute une case à la fin
print(notes, len(notes))
```

`append` est la seule méthode d'ajout à connaître. Pour construire un tableau, on part souvent d'un tableau **vide** et on ajoute au fur et à
mesure :

```python exec
carres = []
for i in range(6):
    carres.append(i * i)
print(carres)
```

On peut aussi créer un tableau de taille fixe rempli d'une même valeur : `[0] * 5` donne `[0, 0, 0, 0, 0]`.

## 3. Parcourir un tableau

Deux manières, à bien distinguer :

```python exec
t = [4, 7, 1, 9]

# Par valeur : x prend successivement chaque valeur
total = 0
for x in t:
    total = total + x
print("somme :", total)

# Par indice : i prend 0, 1, 2, 3 et on lit t[i]
for i in range(len(t)):
    print("case", i, ":", t[i])
```

:::methode[Laquelle choisir ?]
- Si on a seulement besoin des **valeurs** (somme, maximum, compter) : parcours **par valeur**, plus lisible.
- Si on a besoin de la **position** (où est le maximum ?, modifier les cases, comparer t[i] et t[i+1]) : parcours **par indice**.
:::

Par exemple, pour **modifier** chaque case, le parcours par valeur ne marche pas (`x = x * 2` change la variable x, pas la case) :

```python exec
t = [4, 7, 1, 9]
for i in range(len(t)):
    t[i] = t[i] * 2
print(t)
```

## 4. Construire par compréhension

Python permet d'écrire en une ligne la construction « pour chaque x de …, mettre … » :

```python exec
carres = [i * i for i in range(6)]
notes = [12, 8, 15, 10, 6, 18]
doubles = [2 * n for n in notes]
admis = [n for n in notes if n >= 10]       # avec un filtre
print(carres)
print(doubles)
print(admis)
```

La compréhension `[expression for x in sequence if condition]` équivaut exactement à la boucle avec `append` : c'est la même chose, écrite
plus court. Il faut savoir passer de l'une à l'autre.

## 5. Tableaux de tableaux : les matrices

Un tableau peut contenir des tableaux. C'est ainsi qu'on représente une **matrice** (une grille, une image, un plateau de jeu) : un tableau de
**lignes**.

```python exec
m = [[1, 2, 3],
     [4, 5, 6]]
print(m[0])          # la ligne 0
print(m[1][2])       # ligne 1, colonne 2
print(len(m), "lignes et", len(m[0]), "colonnes")

# Parcours de toutes les cases
total = 0
for i in range(len(m)):
    for j in range(len(m[0])):
        total = total + m[i][j]
print("somme :", total)
```

Pour créer une grille de zéros, on utilise une compréhension :

```python exec
grille = [[0] * 4 for i in range(3)]      # 3 lignes, 4 colonnes
grille[1][2] = 7
print(grille)
```

:::attention[Le piège de [[0] * 4] * 3]
`[[0] * 4] * 3` crée trois fois **la même** ligne : modifier une case modifie toute la colonne. Toujours utiliser la compréhension
`[[0] * 4 for i in range(3)]`.
:::

## 6. Affectation et copie

Une variable ne « contient » pas le tableau : elle le **désigne**. Après `b = a`, les deux noms désignent le même tableau.

```python exec
a = [1, 2, 3]
b = a
b[0] = 99
print(a)                 # a a changé aussi !
c = [x for x in a]       # une vraie copie
c[1] = 0
print(a, c)
```

Il en va de même quand on passe un tableau à une fonction : la fonction peut le **modifier** (on parle d'effet de bord).

## Les erreurs classiques des élèves

:::attention[Ce que tu verras en classe]
- **`IndexError`** : boucle `for i in range(len(t) + 1)` ou accès à `t[len(t)]`.
- **Confondre indice et valeur** : `for x in t: print(t[x])`.
- **Modifier avec un parcours par valeur** : `for x in t: x = 0` ne change rien au tableau.
- **Oublier de créer le tableau vide** avant les `append`, ou le recréer **dans** la boucle.
- **Inverser ligne et colonne** dans `m[i][j]`.
- **Croire que `b = a` copie** le tableau.
:::

## En classe

:::methode[Activités qui marchent]
1. **Débranché** : des boîtes numérotées de 0 à 5 avec des cartes ; les élèves exécutent « t[2] = t[0] + t[4] » à la main.
2. **Tableaux de notes** : moyenne, nombre de notes au-dessus de 10, meilleure note et sa position.
3. **Traduire** des boucles `append` en compréhensions et inversement.
4. **Matrices** : une image en niveaux de gris en tableau de tableaux (négatif, seuillage), le morpion, la bataille navale.
5. **Python Tutor** pour visualiser l'aliasing `b = a`.
:::

## L'essentiel

- Un **tableau** (`list`) : cases d'indices `0` à `len(t) - 1` ; `t[i]` pour lire, `t[i] = v` pour modifier, `t.append(v)` pour ajouter.
- Parcours **par valeur** (`for x in t`) pour les valeurs ; **par indice** (`for i in range(len(t))`) quand on a besoin de la position ou
  qu'on modifie.
- **Compréhension** : `[expr for x in seq if cond]`.
- **Matrice** : tableau de lignes ; `m[i][j]` = ligne i, colonne j ; créer avec `[[0] * p for i in range(n)]`.
- `b = a` ne copie pas : les deux noms désignent le même tableau.

## Exercices

::::exercice[Grand QCM : les tableaux]{niveau=1 type=quiz}
Douze questions sur les tableaux en Python.

1. Avec `t = [5, 3, 8, 1]`, que vaut `t[2]` ?

   - [ ] 3
   - [x] 8
   - [ ] 1
   - [ ] 5

   > Indices 0, 1, 2, 3 : la case d'indice 2 est la troisième.

1. Quel est l'indice du dernier élément d'un tableau de 10 éléments ?

   - [ ] 10
   - [x] 9
   - [ ] 11
   - [ ] -10

   > Les indices vont de 0 à `len(t) - 1`.

1. Que vaut `t` après `t = [1, 2, 3]` puis `t.append(4)` ?

   - [ ] `[4, 1, 2, 3]`
   - [x] `[1, 2, 3, 4]`
   - [ ] `[1, 2, 3]`
   - [ ] `[5, 6, 7]`

   > `append` ajoute à la fin.

1. Que construit `[2 * i for i in range(4)]` ?

   - [ ] `[2, 4, 6, 8]`
   - [x] `[0, 2, 4, 6]`
   - [ ] `[0, 1, 2, 3]`
   - [ ] `[2, 2, 2, 2]`

   > i prend 0, 1, 2, 3.

1. Que construit `[x for x in [4, 11, 7, 15] if x > 8]` ?

   - [ ] `[4, 7]`
   - [x] `[11, 15]`
   - [ ] `[True, False]`
   - [ ] `[11, 7, 15]`

   > Le `if` filtre : on ne garde que les valeurs supérieures à 8.

1. Avec `m = [[1, 2], [3, 4], [5, 6]]`, que vaut `m[2][0]` ?

   - [ ] 2
   - [ ] 3
   - [x] 5
   - [ ] 6

   > `m[2]` est la ligne `[5, 6]`, et sa case 0 vaut 5.

1. Avec la même matrice, que vaut `len(m)` ?

   - [ ] 2
   - [x] 3
   - [ ] 6
   - [ ] 1

   > `m` contient 3 lignes.

1. Que fait `for x in t: x = 0` sur `t = [3, 4]` ?

   - [ ] t devient `[0, 0]`
   - [x] rien : t reste `[3, 4]`
   - [ ] une erreur
   - [ ] t devient `[]`

   > On change la variable x, pas les cases. Il faut `for i in range(len(t)): t[i] = 0`.

1. Après `a = [1, 2]`, `b = a`, `b.append(3)`, que vaut `a` ?

   - [ ] `[1, 2]`
   - [x] `[1, 2, 3]`
   - [ ] `[3]`
   - [ ] une erreur

   > `a` et `b` désignent le même tableau.

1. Que provoque `t[3]` si `t = [1, 2, 3]` ?

   - [ ] 3
   - [ ] `None`
   - [x] une `IndexError`
   - [ ] 0

   > L'indice maximal est 2.

1. Quelle instruction crée correctement une grille de 3 lignes et 4 colonnes remplie de 0 ?

   - [ ] `[0] * 12`
   - [ ] `[[0] * 4] * 3`
   - [x] `[[0] * 4 for i in range(3)]`
   - [ ] `[[0] * 3 for i in range(4)]`

   > La deuxième proposition répète la même ligne ; la quatrième inverse lignes et colonnes.

1. Quel parcours faut-il pour trouver la **position** du maximum ?

   - [ ] `for x in t`
   - [x] `for i in range(len(t))`
   - [ ] aucun, il faut `max`
   - [ ] `while True`

   > On a besoin des indices pour retenir la position.
::::

::::exercice[Moyenne et notes au-dessus de la moyenne]{niveau=1}
Écris `moyenne(t)` qui renvoie la moyenne d'un tableau non vide, puis `au_dessus(t)` qui renvoie le tableau des valeurs strictement supérieures
à la moyenne, dans l'ordre. N'utilise pas `sum`.

```python depart
def moyenne(t):
    ...

def au_dessus(t):
    ...
```

```python tests
assert moyenne([10, 12, 14]) == 12, "moyenne simple"
assert moyenne([7]) == 7, "un seul élément"
assert au_dessus([10, 12, 14]) == [14], "au-dessus"
assert au_dessus([5, 15, 8, 12]) == [15, 12], "ordre conservé"
assert au_dessus([10, 10]) == [], "personne au-dessus"
```

:::corrige
```python solution
def moyenne(t):
    total = 0
    for x in t:
        total = total + x
    return total / len(t)

def au_dessus(t):
    m = moyenne(t)
    return [x for x in t if x > m]
```

On calcule la moyenne **une seule fois** avant de filtrer, au lieu de la recalculer pour chaque élément.
:::
::::

::::exercice[Position du maximum]{niveau=2}
Écris `indice_max(t)` qui renvoie l'indice de la **première** occurrence du plus grand élément d'un tableau non vide, sans utiliser `max` ni
`index`.

```python depart
def indice_max(t):
    ...
```

```python tests
assert indice_max([3, 9, 2, 7]) == 1, "maximum au milieu"
assert indice_max([5]) == 0, "un seul élément"
assert indice_max([4, 8, 8, 1]) == 1, "première occurrence"
assert indice_max([-5, -2, -9]) == 1, "nombres négatifs"
```

:::corrige
```python solution
def indice_max(t):
    i_max = 0
    for i in range(1, len(t)):
        if t[i] > t[i_max]:
            i_max = i
    return i_max
```

On initialise avec l'indice 0 (et non avec la valeur 0, qui serait fausse pour un tableau de nombres négatifs). La comparaison stricte `>`
garde la première occurrence.
:::
::::

::::exercice[Transformer un tableau sur place]{niveau=2}
Écris `plafonner(t, limite)` qui **modifie** le tableau `t` en remplaçant chaque valeur supérieure à `limite` par `limite`. La fonction ne
renvoie rien.

```python depart
def plafonner(t, limite):
    ...
```

```python tests
notes = [12, 25, 18, 30]
plafonner(notes, 20)
assert notes == [12, 20, 18, 20], "valeurs plafonnées à 20"
t = [1, 2]
plafonner(t, 5)
assert t == [1, 2], "rien à changer"
```

:::corrige
```python solution
def plafonner(t, limite):
    for i in range(len(t)):
        if t[i] > limite:
            t[i] = limite
```

Le parcours **par indice** est indispensable pour modifier les cases. Le tableau est modifié directement : c'est un effet de bord, voulu ici.
:::
::::

::::exercice[Image en niveaux de gris]{niveau=2}
Une image en niveaux de gris est une matrice d'entiers entre 0 (noir) et 255 (blanc). Écris :

- `negatif(img)` qui renvoie une **nouvelle** image où chaque pixel p devient 255 - p ;
- `seuillage(img, s)` qui renvoie une nouvelle image où chaque pixel devient 255 s'il est supérieur ou égal à s, et 0 sinon.

```python depart
def negatif(img):
    ...

def seuillage(img, s):
    ...
```

```python tests
img = [[0, 100], [200, 255]]
assert negatif(img) == [[255, 155], [55, 0]], "négatif"
assert img == [[0, 100], [200, 255]], "l'image de départ n'est pas modifiée"
assert seuillage(img, 128) == [[0, 0], [255, 255]], "seuillage à 128"
assert seuillage([[50, 60, 70]], 60) == [[0, 255, 255]], "une ligne, trois colonnes"
```

:::corrige
```python solution
def negatif(img):
    return [[255 - p for p in ligne] for ligne in img]

def seuillage(img, s):
    resultat = []
    for ligne in img:
        nouvelle = []
        for p in ligne:
            if p >= s:
                nouvelle.append(255)
            else:
                nouvelle.append(0)
        resultat.append(nouvelle)
    return resultat
```

Les deux styles sont corrects : compréhension imbriquée pour le négatif, boucles imbriquées avec `append` pour le seuillage.
:::
::::

::::exercice[Somme des lignes et des colonnes]{niveau=2}
Écris `sommes_lignes(m)` et `sommes_colonnes(m)` qui renvoient respectivement le tableau des sommes de chaque ligne et de chaque colonne d'une
matrice rectangulaire non vide. Puis `est_magique(m)` qui renvoie `True` si toutes les lignes et toutes les colonnes d'une matrice carrée ont la
même somme.

```python depart
def sommes_lignes(m):
    ...

def sommes_colonnes(m):
    ...

def est_magique(m):
    ...
```

```python tests
m = [[1, 2, 3], [4, 5, 6]]
assert sommes_lignes(m) == [6, 15], "lignes"
assert sommes_colonnes(m) == [5, 7, 9], "colonnes"
assert est_magique([[2, 7, 6], [9, 5, 1], [4, 3, 8]]), "carré magique 3x3"
assert not est_magique([[1, 2], [3, 4]]), "pas magique"
```

:::corrige
```python solution
def sommes_lignes(m):
    resultat = []
    for ligne in m:
        s = 0
        for x in ligne:
            s = s + x
        resultat.append(s)
    return resultat

def sommes_colonnes(m):
    resultat = []
    for j in range(len(m[0])):
        s = 0
        for i in range(len(m)):
            s = s + m[i][j]
        resultat.append(s)
    return resultat

def est_magique(m):
    toutes = sommes_lignes(m) + sommes_colonnes(m)
    for s in toutes:
        if s != toutes[0]:
            return False
    return True
```

Pour les colonnes, la boucle extérieure porte sur j (la colonne) et la boucle intérieure sur i (les lignes). On réutilise les deux premières
fonctions dans la troisième.
:::
::::

::::exercice[Expliquer l'aliasing à un élève]{niveau=2}
Un élève écrit `sauvegarde = notes` pour garder une copie de ses notes avant de les modifier, puis s'étonne que la sauvegarde ait changé aussi.
Explique-lui ce qui se passe, avec un schéma ou une image simple, et donne-lui la bonne instruction.

:::criteres
- L'explication dit que les deux noms désignent le **même** tableau (pas deux tableaux).
- Une image concrète (étiquettes collées sur la même boîte, deux noms pour une même personne…).
- La bonne instruction : `sauvegarde = list(notes)` ou `[x for x in notes]`.
:::

:::corrige
Une variable n'est pas une boîte qui contient le tableau : c'est une **étiquette** collée sur le tableau. Avec `sauvegarde = notes`, tu colles
une deuxième étiquette sur **le même** tableau ; quand tu modifies les notes, tu modifies ce tableau unique, et tu le vois par les deux
étiquettes. C'est comme un élève qui a deux surnoms : si on lui coupe les cheveux, les deux surnoms désignent quelqu'un aux cheveux courts. Pour
une vraie copie, il faut fabriquer un **nouveau** tableau : `sauvegarde = [x for x in notes]` (ou `list(notes)`). Python Tutor permet de voir
les deux flèches pointer vers le même tableau.
:::
::::
