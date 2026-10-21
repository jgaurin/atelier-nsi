---
titre: Tris par sélection et par insertion
resume: "Le cours de première NSI sur les deux tris au programme : tri par sélection et tri par insertion, déroulés pas à pas, écrits en Python, avec leurs invariants (correction), leur terminaison et leur coût quadratique dans le pire cas ; comparaison avec la fonction sorted."
duree: 60
objectifs:
  - "Dérouler à la main le tri par sélection et le tri par insertion"
  - "Écrire les deux tris en Python, en place"
  - "Énoncer l'invariant de boucle qui prouve chaque tri"
  - "Justifier un coût quadratique dans le pire cas"
prerequis: [nsi-premiere/parcours]
programme: [nsi1-algo]
cartes:
  - q: "Principe du tri par sélection ?"
    r: "On **sélectionne** le plus petit élément de la partie non triée et on l'**échange** avec le premier élément de cette partie ; on recommence sur le reste."
  - q: "Principe du tri par insertion ?"
    r: "On prend les éléments un par un et on **insère** chacun à sa place dans la partie déjà triée à sa gauche, en décalant les plus grands vers la droite (comme on range des cartes en main)."
  - q: "Invariant du tri par sélection ?"
    r: "Après i tours, `t[0..i-1]` contient les **i plus petits** éléments, **triés** (et à leur place définitive)."
  - q: "Invariant du tri par insertion ?"
    r: "Avant de traiter `t[i]`, la partie `t[0..i-1]` est **triée** (mais contient les i premiers éléments d'origine, pas forcément les plus petits)."
  - q: "Coût des deux tris ?"
    r: "**Quadratique** dans le pire cas : de l'ordre de n²/2 comparaisons. Si n double, le temps est multiplié par 4. L'insertion est linéaire sur un tableau déjà trié (meilleur cas)."
  - q: "Comment échanger t[i] et t[j] en Python ?"
    r: "`t[i], t[j] = t[j], t[i]`."
---

Trier est une opération omniprésente : classement, recherche rapide (dichotomie), détection de doublons. Le programme de première demande de
connaître **deux** tris simples, par **sélection** et par **insertion**. Ce sont aussi les premiers algorithmes dont on **prouve** la
correction et dont on **calcule** le coût.

## Ce que dit le programme

Contenus : *tris par insertion, par sélection*. Capacités attendues : **écrire un algorithme de tri** ; **décrire un invariant de boucle qui
prouve la correction des tris par insertion, par sélection**. Le programme précise : la **terminaison** de ces algorithmes est à justifier ; on
montre que leur **coût est quadratique dans le pire cas**.

## 1. Le tri par sélection

Idée : on cherche le **minimum** du tableau et on le met en **première** position (par échange) ; puis le minimum du reste en **deuxième**
position, etc.

Déroulé sur `[5, 3, 8, 1, 4]` (la partie triée est avant la barre) :

| Tour | Minimum du reste | Échange | Tableau |
| --- | --- | --- | --- |
| départ | | | `[5, 3, 8, 1, 4]` |
| i = 0 | 1 (indice 3) | t[0] ↔ t[3] | `[1 │ 3, 8, 5, 4]` |
| i = 1 | 3 (indice 1) | aucun | `[1, 3 │ 8, 5, 4]` |
| i = 2 | 4 (indice 4) | t[2] ↔ t[4] | `[1, 3, 4 │ 5, 8]` |
| i = 3 | 5 (indice 3) | aucun | `[1, 3, 4, 5 │ 8]` |

```python exec
def tri_selection(t):
    """Trie le tableau t par ordre croissant (en place)."""
    n = len(t)
    for i in range(n - 1):
        i_min = i
        for j in range(i + 1, n):
            if t[j] < t[i_min]:
                i_min = j
        t[i], t[i_min] = t[i_min], t[i]

t = [5, 3, 8, 1, 4]
tri_selection(t)
print(t)
```

La boucle intérieure est exactement la **recherche de l'indice du minimum** vue au chapitre précédent, sur la partie `t[i..n-1]`.

## 2. Le tri par insertion

Idée : comme pour ranger des cartes dans sa main, on prend les éléments un à un et on **insère** chacun à sa place parmi ceux déjà rangés, à
gauche, en **décalant** d'un cran vers la droite ceux qui sont plus grands.

Déroulé sur `[5, 3, 8, 1, 4]` :

| Tour | Élément à insérer | Tableau après insertion |
| --- | --- | --- |
| départ | | `[5 │ 3, 8, 1, 4]` |
| i = 1 | 3 | `[3, 5 │ 8, 1, 4]` |
| i = 2 | 8 | `[3, 5, 8 │ 1, 4]` |
| i = 3 | 1 | `[1, 3, 5, 8 │ 4]` |
| i = 4 | 4 | `[1, 3, 4, 5, 8]` |

```python exec
def tri_insertion(t):
    """Trie le tableau t par ordre croissant (en place)."""
    for i in range(1, len(t)):
        valeur = t[i]
        j = i
        while j > 0 and t[j - 1] > valeur:
            t[j] = t[j - 1]        # on décale vers la droite
            j = j - 1
        t[j] = valeur              # on place l'élément dans le trou

t = [5, 3, 8, 1, 4]
tri_insertion(t)
print(t)
```

Ici encore, l'ordre des conditions du `while` compte : `j > 0` d'abord, pour ne jamais lire `t[-1]`.

Ces deux fonctions trient **en place** : elles modifient le tableau reçu et ne renvoient rien.

## 3. Pourquoi ça marche : les invariants

**Tri par sélection.** Invariant : *au début du tour i, `t[0..i-1]` contient les i plus petits éléments du tableau, triés.*

- Au départ (i = 0), la partie est vide : c'est vrai.
- Pendant le tour i, on place en position i le plus petit élément du reste ; il est plus grand que ceux déjà placés (qui sont les plus petits) :
  la partie `t[0..i]` contient les i + 1 plus petits, triés.
- À la fin (i = n − 1), `t[0..n-2]` contient les n − 1 plus petits, triés, et le dernier est forcément le plus grand : tout est trié.

**Tri par insertion.** Invariant : *au début du tour i, `t[0..i-1]` est trié* (c'est une permutation des i premiers éléments de départ).

- Au départ (i = 1), `t[0..0]` contient un seul élément : il est trié.
- Le tour i insère `t[i]` à sa place dans la partie triée : `t[0..i]` est triée.
- À la fin, `t[0..n-1]` est triée.

**Terminaison.** Les boucles `for` se terminent toujours. Pour le `while` de l'insertion, `j` diminue de 1 à chaque tour et la boucle s'arrête
au plus quand `j` vaut 0 : `j` est un **variant** (un entier positif qui décroît strictement).

## 4. Le coût est quadratique

Comptons les comparaisons du **tri par sélection** sur un tableau de taille n : au tour 0, n − 1 comparaisons ; au tour 1, n − 2 ; … ; au
dernier, 1. Au total :

$$(n-1) + (n-2) + \dots + 1 = \frac{n(n-1)}{2}$$

soit de l'ordre de **n²/2**, quel que soit le tableau. Le **tri par insertion** fait, dans le **pire cas** (tableau trié à l'envers), autant de
comparaisons et de décalages. Dans le **meilleur cas** (tableau déjà trié), le `while` s'arrête tout de suite : n − 1 comparaisons, coût
linéaire.

On dit que ces tris ont un coût **quadratique** : si n double, le temps est multiplié par **4** ; si n est multiplié par 10, par **100**.

| n | n²/2 comparaisons |
| --- | --- |
| 100 | 5 000 |
| 1 000 | 500 000 |
| 1 000 000 | 500 milliards |

Pour un million d'éléments, c'est beaucoup trop. La fonction `sorted` de Python et la méthode `t.sort()` utilisent un tri bien plus efficace
(Timsort, de coût de l'ordre de n log n), proche du **tri fusion** vu en terminale. En pratique, on utilise `sorted` ; écrire les tris sert à
comprendre et à raisonner sur les algorithmes.

## Les erreurs classiques des élèves

:::attention[Ce que tu verras en classe]
- **Sélection** : échanger à chaque fois qu'on trouve plus petit (au lieu de retenir l'indice et d'échanger une seule fois à la fin), ou
  chercher le minimum de **tout** le tableau à chaque tour.
- **Insertion** : oublier de mémoriser `valeur = t[i]` avant de décaler (la valeur est écrasée).
- **Insertion** : `while t[j - 1] > valeur and j > 0` : lit `t[-1]`, le dernier élément.
- **Échange raté** : `t[i] = t[j]` puis `t[j] = t[i]` (la première valeur est perdue).
- **Confondre les deux tris**, ou leurs invariants : seule la sélection place les éléments à leur **position définitive**.
- **Écrire `t = tri_selection(t)`** : la fonction renvoie `None`, le tableau est perdu.
:::

## En classe

:::methode[Activités qui marchent]
1. **Débranché** : trier des cartes à jouer ou des élèves par taille, en respectant strictement la méthode ; compter les comparaisons.
2. **Visualisations** animées des tris (de nombreuses sont en ligne) : reconnaître lequel est lequel.
3. **Déroulés** au tableau, en coloriant la partie triée.
4. **Mesure** : chronométrer pour n, 2n, 4n ; le temps est multiplié par 4. Comparer avec `sorted`.
:::

## L'essentiel

- **Sélection** : chercher le minimum du reste, l'échanger avec le premier du reste. Invariant : les i premiers sont les i plus petits, triés.
- **Insertion** : insérer chaque élément dans la partie gauche triée en décalant. Invariant : la partie gauche est triée.
- **Terminaison** : boucles `for`, et un variant `j` qui décroît pour le `while`.
- **Coût quadratique** dans le pire cas, n(n − 1)/2 comparaisons ; insertion linéaire si le tableau est déjà trié.
- En pratique : `sorted(t)` (nouveau tableau) ou `t.sort()` (en place), bien plus rapides.

## Exercices

::::exercice[Grand QCM : les tris]{niveau=1 type=quiz}
Douze questions sur les tris par sélection et par insertion.

1. Dans le tri par sélection, que fait-on à chaque tour ?

   - [ ] on insère l'élément suivant dans la partie triée
   - [x] on cherche le minimum de la partie non triée et on l'échange avec son premier élément
   - [ ] on échange deux voisins mal rangés
   - [ ] on coupe le tableau en deux

   > Une sélection, un échange.

1. Que devient `[4, 2, 7, 1]` après le **premier** tour du tri par sélection ?

   - [ ] `[2, 4, 7, 1]`
   - [x] `[1, 2, 7, 4]`
   - [ ] `[1, 4, 2, 7]`
   - [ ] `[1, 2, 4, 7]`

   > Le minimum 1 est échangé avec le premier élément 4.

1. Que devient `[4, 2, 7, 1]` après le **premier** tour du tri par insertion (insertion de `t[1]`) ?

   - [x] `[2, 4, 7, 1]`
   - [ ] `[1, 2, 7, 4]`
   - [ ] `[1, 4, 2, 7]`
   - [ ] `[4, 2, 7, 1]`

   > On insère 2 avant 4.

1. Combien de comparaisons fait le tri par sélection sur 10 éléments ?

   - [ ] 10
   - [ ] 20
   - [x] 45
   - [ ] 100

   > 9 + 8 + … + 1 = 10 × 9 / 2 = 45.

1. Si on double la taille du tableau, le temps d'un tri quadratique est multiplié par :

   - [ ] 2
   - [x] 4
   - [ ] 8
   - [ ] il ne change pas

   > (2n)² = 4n².

1. Quel est le meilleur cas du tri par insertion ?

   - [x] le tableau est déjà trié
   - [ ] le tableau est trié à l'envers
   - [ ] tous les éléments sont différents
   - [ ] le tableau est vide de moitié

   > Chaque élément est déjà à sa place : une seule comparaison par tour.

1. Quel invariant correspond au tri par sélection ?

   - [ ] la partie gauche est triée mais peut encore changer
   - [x] la partie gauche contient les plus petits éléments, triés, à leur place définitive
   - [ ] la partie droite est triée
   - [ ] le tableau est toujours trié

   > Les éléments placés par la sélection ne bougent plus.

1. Comment échanger `t[i]` et `t[j]` en Python ?

   - [ ] `t[i] = t[j]` puis `t[j] = t[i]`
   - [x] `t[i], t[j] = t[j], t[i]`
   - [ ] `swap(t[i], t[j])`
   - [ ] `t[i] == t[j]`

   > La première proposition perd la valeur de `t[i]`.

1. Pourquoi mémoriser `valeur = t[i]` au début du tour dans le tri par insertion ?

   - [ ] pour aller plus vite
   - [x] parce que le décalage écrase `t[i]`
   - [ ] pour pouvoir la renvoyer
   - [ ] ce n'est pas nécessaire

   > Le premier décalage copie `t[i-1]` dans `t[i]`.

1. Que renvoie `tri_selection(t)` (version du cours) ?

   - [ ] le tableau trié
   - [x] `None` ; c'est `t` qui est modifié
   - [ ] une copie triée
   - [ ] le nombre d'échanges

   > Tri en place, sans `return`.

1. Quel élément justifie la terminaison du `while` dans le tri par insertion ?

   - [ ] le tableau est fini
   - [x] j diminue de 1 à chaque tour et reste positif ou nul
   - [ ] valeur diminue
   - [ ] la boucle `for` extérieure

   > j est un variant de boucle.

1. Pour trier un million de nombres en pratique, on utilise :

   - [ ] le tri par sélection
   - [ ] le tri par insertion
   - [x] `sorted` ou `t.sort()`, de coût de l'ordre de n log n
   - [ ] une recherche du maximum

   > Les tris quadratiques demanderaient des centaines de milliards d'opérations.
::::

::::exercice[Écrire le tri par sélection]{niveau=1}
Écris `tri_selection(t)` qui trie le tableau `t` par ordre croissant, **en place**, avec la méthode du tri par sélection (sans `sort`, `sorted`,
`min` ni `index`).

```python depart
def tri_selection(t):
    ...
```

```python tests
t = [5, 3, 8, 1, 4]
tri_selection(t)
assert t == [1, 3, 4, 5, 8], "cas général"
t = []
tri_selection(t)
assert t == [], "tableau vide"
t = [2, 2, 1, 2]
tri_selection(t)
assert t == [1, 2, 2, 2], "doublons"
t = [9, 7, 5, 3]
tri_selection(t)
assert t == [3, 5, 7, 9], "trié à l'envers"
```

:::corrige
```python solution
def tri_selection(t):
    n = len(t)
    for i in range(n - 1):
        i_min = i
        for j in range(i + 1, n):
            if t[j] < t[i_min]:
                i_min = j
        t[i], t[i_min] = t[i_min], t[i]
```

On retient l'**indice** du minimum (pas sa valeur) pour pouvoir faire l'échange à la fin du tour.
:::
::::

::::exercice[Écrire le tri par insertion]{niveau=2}
Écris `tri_insertion(t)` qui trie le tableau `t` par ordre croissant, en place, avec la méthode du tri par insertion.

```python depart
def tri_insertion(t):
    ...
```

```python tests
t = [5, 3, 8, 1, 4]
tri_insertion(t)
assert t == [1, 3, 4, 5, 8], "cas général"
t = [1]
tri_insertion(t)
assert t == [1], "un élément"
t = [3, 1, 3, 2]
tri_insertion(t)
assert t == [1, 2, 3, 3], "doublons"
t = ["poire", "abricot", "kiwi"]
tri_insertion(t)
assert t == ["abricot", "kiwi", "poire"], "chaînes"
```

:::corrige
```python solution
def tri_insertion(t):
    for i in range(1, len(t)):
        valeur = t[i]
        j = i
        while j > 0 and t[j - 1] > valeur:
            t[j] = t[j - 1]
            j = j - 1
        t[j] = valeur
```

Le même code trie des chaînes : il suffit que les éléments soient comparables avec `>`.
:::
::::

::::exercice[Compter les comparaisons]{niveau=2}
Modifie les deux tris pour qu'ils **renvoient** le nombre de comparaisons entre éléments du tableau (`t[j] < t[i_min]` pour la sélection,
`t[j - 1] > valeur` pour l'insertion), tout en triant le tableau en place. Puis observe : quel tri fait le moins de comparaisons sur un tableau
déjà trié ?

```python depart
def selection_compte(t):
    ...

def insertion_compte(t):
    ...
```

```python tests
t = [4, 3, 2, 1]
assert selection_compte(t) == 6 and t == [1, 2, 3, 4], "sélection : n(n-1)/2"
t = [1, 2, 3, 4]
assert selection_compte(t) == 6, "sélection : toujours n(n-1)/2"
t = [4, 3, 2, 1]
assert insertion_compte(t) == 6 and t == [1, 2, 3, 4], "insertion, pire cas"
t = [1, 2, 3, 4]
assert insertion_compte(t) == 3, "insertion, tableau déjà trié"
```

:::corrige
```python solution
def selection_compte(t):
    n = len(t)
    comparaisons = 0
    for i in range(n - 1):
        i_min = i
        for j in range(i + 1, n):
            comparaisons = comparaisons + 1
            if t[j] < t[i_min]:
                i_min = j
        t[i], t[i_min] = t[i_min], t[i]
    return comparaisons

def insertion_compte(t):
    comparaisons = 0
    for i in range(1, len(t)):
        valeur = t[i]
        j = i
        while j > 0:
            comparaisons = comparaisons + 1
            if t[j - 1] > valeur:
                t[j] = t[j - 1]
                j = j - 1
            else:
                break
        t[j] = valeur
    return comparaisons
```

La sélection fait **toujours** n(n − 1)/2 comparaisons ; l'insertion n'en fait que n − 1 sur un tableau déjà trié. Pour compter précisément, on
a dû séparer le test `t[j - 1] > valeur` de la condition du `while`.
:::
::::

::::exercice[Trier une table par sélection]{niveau=2}
Écris `classer(table, cle)` qui trie **en place**, par ordre **décroissant** de la colonne `cle`, un tableau de dictionnaires, avec la méthode
du tri par sélection (on sélectionne le **maximum** à chaque tour).

```python depart
def classer(table, cle):
    ...
```

```python tests
t = [{"nom": "Léa", "pts": 12}, {"nom": "Tom", "pts": 30}, {"nom": "Ana", "pts": 21}]
classer(t, "pts")
assert [e["nom"] for e in t] == ["Tom", "Ana", "Léa"], "décroissant"
t = [{"v": 1}]
classer(t, "v")
assert t == [{"v": 1}], "une ligne"
```

:::corrige
```python solution
def classer(table, cle):
    n = len(table)
    for i in range(n - 1):
        i_max = i
        for j in range(i + 1, n):
            if table[j][cle] > table[i_max][cle]:
                i_max = j
        table[i], table[i_max] = table[i_max], table[i]
```

Deux changements par rapport au tri du cours : on compare la **colonne** `cle` des lignes, et on sélectionne le **maximum** pour un ordre
décroissant.
:::
::::

::::exercice[Expliquer l'invariant du tri par insertion]{niveau=2}
Un élève a compris comment fonctionne le tri par insertion mais ne voit pas « à quoi sert l'invariant ». Explique-lui, sur l'exemple
`[6, 2, 9, 4]`, ce qu'est l'invariant de ce tri, pourquoi il est vrai à chaque étape et ce qu'il permet de conclure.

:::criteres
- Énoncé correct : au début du tour i, `t[0..i-1]` est trié.
- Vérification sur l'exemple, étape par étape : `[6]`, `[2, 6]`, `[2, 6, 9]`, `[2, 4, 6, 9]`.
- Les trois temps : vrai au départ, conservé par chaque tour, donne le résultat à la fin.
- Intérêt : prouver que le tri marche pour **tous** les tableaux, ce que des tests ne peuvent pas garantir.
:::

:::corrige
L'invariant est une phrase qui reste **vraie à chaque tour** de boucle : ici, « la partie à gauche de l'élément qu'on va insérer est triée ».
Sur `[6, 2, 9, 4]` : au départ, la partie gauche est `[6]`, triée (un seul élément). On insère 2 : `[2, 6]`, triée. On insère 9 : `[2, 6, 9]`,
triée. On insère 4 : `[2, 4, 6, 9]`, triée. Pourquoi est-ce toujours vrai ? Parce qu'insérer un élément **à sa place** dans une partie triée
donne une partie triée plus grande d'un élément. À la fin, la « partie gauche » est le tableau entier : il est trié. L'intérêt : on a
**prouvé** que l'algorithme marche pour **n'importe quel** tableau, alors que des tests ne vérifient que quelques cas.
:::
::::
