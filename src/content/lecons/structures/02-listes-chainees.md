---
titre: Tableaux et listes chaînées
resume: Deux façons de ranger une suite d'éléments — des cases contiguës ou des maillons reliés — et leurs conséquences sur le coût des opérations.
duree: 75
objectifs:
  - Expliquer la représentation d'un tableau et celle d'une liste chaînée en mémoire
  - Implémenter une liste chaînée en Python (classe `Cellule`) et ses opérations de base, itérativement et récursivement
  - Comparer les coûts des opérations (accès, insertion, suppression) selon la représentation
  - Manipuler les liens d'une liste chaînée sans perdre de maillon (renversement, insertion, fusion)
prerequis: [structures/types-abstraits, algo/recursivite, python/references]
programme: [asd-lineaires, asd-types, id-memoire, nsit-structures]
cartes:
  - q: Coût de l'accès au i-ème élément d'un tableau ? d'une liste chaînée ?
    r: "Tableau : constant (calcul d'adresse). Liste chaînée : proportionnel à `i` (il faut suivre `i` liens)."
  - q: Coût de l'ajout en tête d'un tableau ? d'une liste chaînée ?
    r: "Tableau : linéaire (décaler tous les éléments). Liste chaînée : constant (un nouveau maillon qui pointe vers l'ancienne tête)."
  - q: Qu'est-ce qu'une cellule (maillon) d'une liste chaînée ?
    r: "Un objet qui contient une valeur et une référence vers la cellule suivante (`None` pour la dernière)."
  - q: Définition récursive d'une liste ?
    r: "Une liste est soit vide, soit formée d'un premier élément (la tête) suivi d'une liste (la queue)."
  - q: Comment ajouter en queue d'une liste chaînée en temps constant ?
    r: "En gardant une référence vers la dernière cellule (pointeur de fin)."
  - q: Piège classique quand on modifie les liens d'une liste chaînée ?
    r: "Perdre la référence vers la suite : il faut sauvegarder `suivant` avant de modifier `c.suivant`."
---

Une liste Python range ses éléments dans des cases **consécutives** de la mémoire : c'est un **tableau**. Accéder à la
case `i` est immédiat, mais insérer un élément au début oblige à décaler toutes les autres cases. Une autre représentation,
la **liste chaînée**, fait le choix inverse : chaque élément est rangé n'importe où en mémoire, avec un **lien** vers le
suivant. Insérer au début devient immédiat ; accéder au 1000ᵉ élément oblige à suivre 1000 liens. Connaître ces deux
représentations, leurs coûts et la manipulation des liens est au programme (« structures linéaires : tableaux, listes ») et
revient très souvent à l'écrit.

## 1. Le tableau : des cases contiguës

Dans un tableau, les éléments occupent des cases consécutives de même taille. Si la première case est à l'adresse $a$ et
qu'une case occupe $k$ octets, la case `i` est à l'adresse $a + i \times k$ : l'accès à `t[i]` est en **temps constant**.

<div class="cases"><span>12<small>@ a</small></span><span>8<small>@ a+8</small></span><span>15<small>@ a+16</small></span><span>10<small>@ a+24</small></span><span>17<small>@ a+32</small></span></div>

En contrepartie, insérer ou supprimer au milieu oblige à **décaler** les éléments suivants ($\Theta(n)$). Les listes Python
sont des **tableaux dynamiques** : quand la place réservée est pleine, Python réserve une zone plus grande (environ
1,125 fois plus) et recopie tout ; ces recopies sont assez rares pour que `append` soit en temps constant **en moyenne**
(on dit **amorti**).

## 2. La liste chaînée : des maillons reliés

:::definition
Une **liste chaînée** est une suite de **cellules** (ou maillons). Chaque cellule contient une **valeur** et une
**référence** vers la cellule suivante. La dernière cellule pointe vers `None`. La liste est désignée par une référence
vers sa première cellule (la **tête**) ; la liste vide est `None`.
:::

```mermaid legende="La liste chaînée 3 → 1 → 4 : chaque cellule pointe vers la suivante"
graph LR
  L([liste]) --> A["3 | •"]
  A --> B["1 | •"]
  B --> C["4 | •"]
  C --> N["None"]
```

C'est aussi la définition **récursive** d'une liste, celle du programme de terminale : une liste est soit **vide**, soit un
**premier élément** (la tête) suivi d'une **liste** (la queue).

```python exec
class Cellule:
    def __init__(self, valeur, suivant=None):
        self.valeur = valeur
        self.suivant = suivant

# La liste 3 -> 1 -> 4, construite en ajoutant en tête
liste = Cellule(4)
liste = Cellule(1, liste)
liste = Cellule(3, liste)

c = liste
while c is not None:          # parcours : on suit les liens
    print(c.valeur, end=" -> ")
    c = c.suivant
print("None")
```

## 3. Les opérations de base

```python exec
class Cellule:
    def __init__(self, valeur, suivant=None):
        self.valeur = valeur
        self.suivant = suivant

def longueur(lst):                   # itératif : Θ(n)
    n = 0
    while lst is not None:
        n += 1
        lst = lst.suivant
    return n

def longueur_rec(lst):               # récursif : vide -> 0, sinon 1 + longueur de la queue
    if lst is None:
        return 0
    return 1 + longueur_rec(lst.suivant)

def ieme(lst, i):                    # Θ(i) : on suit i liens
    for _ in range(i):
        if lst is None:
            raise IndexError("indice trop grand")
        lst = lst.suivant
    if lst is None:
        raise IndexError("indice trop grand")
    return lst.valeur

def ajouter_en_tete(lst, x):         # Θ(1) : un nouveau maillon
    return Cellule(x, lst)

def ajouter_en_queue(lst, x):        # Θ(n) : il faut trouver la dernière cellule
    nouvelle = Cellule(x)
    if lst is None:
        return nouvelle
    c = lst
    while c.suivant is not None:
        c = c.suivant
    c.suivant = nouvelle
    return lst

def vers_liste_python(lst):
    t = []
    while lst is not None:
        t.append(lst.valeur)
        lst = lst.suivant
    return t

l = None
for x in [4, 1, 3]:
    l = ajouter_en_tete(l, x)
l = ajouter_en_queue(l, 9)
print(vers_liste_python(l), longueur(l), longueur_rec(l), ieme(l, 2))
```

| Opération (n éléments)       | Tableau (liste Python)       | Liste chaînée simple       |
|------------------------------|------------------------------|----------------------------|
| accès au i-ème               | $\Theta(1)$                  | $\Theta(i)$                |
| ajout / retrait en tête      | $\Theta(n)$                  | $\Theta(1)$                |
| ajout en fin                 | $\Theta(1)$ amorti           | $\Theta(n)$ ($\Theta(1)$ avec un pointeur de fin) |
| insertion après une cellule connue | —                      | $\Theta(1)$                |
| insertion au milieu (par indice) | $\Theta(n)$ (décalage)   | $\Theta(i)$ (recherche) + $\Theta(1)$ |
| recherche d'une valeur       | $\Theta(n)$                  | $\Theta(n)$                |
| mémoire                      | contiguë, compacte           | une référence en plus par élément |

## 4. Modifier les liens sans rien perdre

Pour supprimer la cellule qui suit `c`, il suffit de la « court-circuiter » : `c.suivant = c.suivant.suivant`. Pour insérer
`x` après `c` : `c.suivant = Cellule(x, c.suivant)`. Ces opérations sont en temps constant — **à condition** d'avoir déjà
une référence vers `c`.

:::attention
L'erreur classique : modifier `c.suivant` **avant** d'avoir sauvegardé l'ancienne valeur, et perdre ainsi tout le reste de
la liste (plus aucune référence ne permet d'y accéder). Dessiner les maillons et les flèches **avant** d'écrire le code,
puis vérifier l'ordre des affectations.
:::

### Variantes

- **Liste doublement chaînée** : chaque cellule pointe aussi vers la **précédente** ; on peut retirer une cellule connue en
  $\Theta(1)$ et parcourir dans les deux sens (c'est ainsi que sont faites `collections.deque` et `OrderedDict`).
- **Liste avec pointeur de fin** : ajout en queue en $\Theta(1)$ (utile pour implémenter une file).
- **Liste circulaire** : la dernière cellule pointe vers la première.

:::prof
En terminale NSI, on présente la liste comme un type abstrait (vide, ajouter en tête, tête, queue) avec plusieurs
implémentations, dont la liste chaînée. Les schémas « boîtes et flèches » sont indispensables ; faire jouer la liste chaînée
par des élèves qui se tiennent par l'épaule (chacun ne connaît que le suivant) fait comprendre pourquoi l'accès au i-ème
est lent. Les erreurs de pointeurs (`AttributeError: 'NoneType' object has no attribute 'suivant'`) se déboguent avec ces
mêmes schémas.
:::

## Exemple guidé

**Problème (classique d'écrit).** Écrire une fonction qui **renverse** une liste chaînée **en place**, en modifiant les liens
(sans créer de nouvelle cellule), et justifier sa correction.

**1. Idée.** On parcourt la liste en retournant chaque flèche. Il faut trois références : `precedent` (le début déjà
renversé), `courant` (la cellule à traiter), et une sauvegarde de `courant.suivant` avant de le modifier.

```mermaid legende="Au milieu du renversement : la partie de gauche est déjà retournée"
graph RL
  B["1"] --> A["3"]
  A --> N1["None"]
  P([precedent]) -.-> B
  C([courant]) -.-> D["4"]
  D --> E["5"]
  E --> N2["None"]
```

**2. Code.**

```python exec
class Cellule:
    def __init__(self, valeur, suivant=None):
        self.valeur, self.suivant = valeur, suivant

def renverser(lst):
    precedent = None
    courant = lst
    while courant is not None:
        suivant = courant.suivant      # 1. sauvegarder la suite
        courant.suivant = precedent    # 2. retourner la flèche
        precedent = courant            # 3. avancer
        courant = suivant
    return precedent                   # nouvelle tête

l = Cellule(3, Cellule(1, Cellule(4, Cellule(5))))
l = renverser(l)
c = l
while c:
    print(c.valeur, end=" ")
    c = c.suivant
```

**3. Correction.** Invariant : `precedent` est la tête de la liste renversée des cellules déjà traitées, et `courant` est
la tête de la partie pas encore traitée (dans l'ordre d'origine). Au départ, aucune cellule traitée (`None`) et `courant`
est toute la liste. Un tour déplace la cellule `courant` en tête de la partie renversée : l'invariant est conservé.
À la fin, `courant` est `None` : toutes les cellules sont traitées, `precedent` est la liste entièrement renversée.

**4. Coût.** Un tour par cellule, chacun en temps constant : $\Theta(n)$ ; mémoire supplémentaire constante (trois
références). Si on avait écrit `courant.suivant = precedent` **avant** de sauvegarder `courant.suivant`, on aurait perdu
la suite de la liste dès le premier tour.

## L'essentiel

- **Tableau** : cases contiguës, accès $\Theta(1)$, insertion/suppression au début ou au milieu $\Theta(n)$ ; liste Python = tableau dynamique (`append` amorti $\Theta(1)$).
- **Liste chaînée** : cellules (valeur, suivant) ; ajout/retrait en tête $\Theta(1)$, accès au i-ème $\Theta(i)$.
- Définition récursive : une liste est vide, ou une tête suivie d'une liste ; d'où des fonctions récursives naturelles.
- Modifier les liens : toujours sauvegarder `suivant` avant de le changer ; dessiner boîtes et flèches.
- Variantes : doublement chaînée, pointeur de fin, circulaire.

## Exercices

::::exercice[Choisir la représentation]{niveau=1}
Un programme ajoute très souvent des éléments **au début** d'une séquence et la parcourt de temps en temps. Quelle
représentation choisir ?

- [ ] un tableau (liste Python), car l'accès par indice est rapide
- [x] une liste chaînée, car l'ajout en tête est en temps constant
- [ ] les deux se valent
- [ ] un dictionnaire

:::corrige
Ajouter au début d'un tableau oblige à décaler tous les éléments ($\Theta(n)$) ; dans une liste chaînée, c'est un nouveau
maillon ($\Theta(1)$). Le parcours coûte $\Theta(n)$ dans les deux cas.
:::
::::

::::exercice[Lire du code de liens]{niveau=1}
On part de la liste chaînée `a → b → c → None`, désignée par `l`. Que devient-elle après `l.suivant = l.suivant.suivant` ?

- [ ] `a → c → b → None`
- [x] `a → c → None`
- [ ] `b → c → None`
- [ ] `a → None`

:::corrige
`l.suivant` désignait `b` ; `l.suivant.suivant` désigne `c`. La cellule `a` pointe désormais vers `c` : `b` est sortie de la
liste (elle n'est plus accessible depuis `l`).
:::
::::

::::exercice[Longueur et appartenance]{niveau=2}
Avec la classe `Cellule` fournie, écris `longueur(lst)` (itérative) et `appartient(lst, x)` (récursive).

```python depart
class Cellule:
    def __init__(self, valeur, suivant=None):
        self.valeur = valeur
        self.suivant = suivant

def longueur(lst):
    ...

def appartient(lst, x):
    ...
```

```python tests
l = Cellule(3, Cellule(1, Cellule(4)))
assert longueur(l) == 3, "trois cellules"
assert longueur(None) == 0, "liste vide"
assert appartient(l, 4) and appartient(l, 3), "présents"
assert not appartient(l, 2), "absent"
assert not appartient(None, 1), "liste vide"
```

:::corrige
```python solution
class Cellule:
    def __init__(self, valeur, suivant=None):
        self.valeur = valeur
        self.suivant = suivant

def longueur(lst):
    n = 0
    while lst is not None:
        n += 1
        lst = lst.suivant
    return n

def appartient(lst, x):
    if lst is None:
        return False
    return lst.valeur == x or appartient(lst.suivant, x)
```
Les deux suivent la définition « vide, ou tête + queue ». La version récursive est limitée par la profondeur de pile
(environ 1000 cellules en Python).
:::
::::

::::exercice[Construire depuis une liste Python]{niveau=2}
Écris `depuis(t)` qui renvoie la liste chaînée contenant les éléments de la liste Python `t` **dans le même ordre**, en
temps linéaire, et `vers(lst)` qui fait l'inverse.

```python depart
class Cellule:
    def __init__(self, valeur, suivant=None):
        self.valeur = valeur
        self.suivant = suivant

def depuis(t):
    ...

def vers(lst):
    ...
```

```python tests
assert vers(depuis([3, 1, 4])) == [3, 1, 4], "aller-retour"
assert depuis([]) is None, "liste vide"
assert depuis([7]).valeur == 7 and depuis([7]).suivant is None, "une cellule"
assert vers(depuis(list(range(5000)))) == list(range(5000)), "longue liste (pas de récursion)"
```

:::corrige
```python solution
class Cellule:
    def __init__(self, valeur, suivant=None):
        self.valeur = valeur
        self.suivant = suivant

def depuis(t):
    lst = None
    for x in reversed(t):          # ajouter en tête en partant de la fin
        lst = Cellule(x, lst)
    return lst

def vers(lst):
    t = []
    while lst is not None:
        t.append(lst.valeur)
        lst = lst.suivant
    return t
```
Ajouter en tête est en $\Theta(1)$ : en parcourant `t` à l'envers, on obtient le bon ordre en $\Theta(n)$. Ajouter
en queue à chaque fois coûterait $\Theta(n^2)$ (sauf à garder un pointeur de fin).
:::
::::

::::exercice[Supprimer une occurrence]{niveau=3}
Écris `supprimer(lst, x)` qui retire la **première** cellule de valeur `x` (si elle existe) en modifiant les liens, et
renvoie la tête de la liste (qui change si on supprime la première cellule).

```python depart
class Cellule:
    def __init__(self, valeur, suivant=None):
        self.valeur = valeur
        self.suivant = suivant

def supprimer(lst, x):
    ...
```

```python tests
def vers(l):
    t = []
    while l:
        t.append(l.valeur); l = l.suivant
    return t
l = Cellule(3, Cellule(1, Cellule(4, Cellule(1))))
assert vers(supprimer(l, 1)) == [3, 4, 1], "première occurrence au milieu"
l = Cellule(3, Cellule(1))
assert vers(supprimer(l, 3)) == [1], "suppression de la tête"
l = Cellule(3, Cellule(1))
assert vers(supprimer(l, 9)) == [3, 1], "absent : rien ne change"
assert supprimer(None, 1) is None, "liste vide"
```

:::corrige
```python solution
class Cellule:
    def __init__(self, valeur, suivant=None):
        self.valeur = valeur
        self.suivant = suivant

def supprimer(lst, x):
    if lst is None:
        return None
    if lst.valeur == x:
        return lst.suivant                 # la tête change
    c = lst
    while c.suivant is not None and c.suivant.valeur != x:
        c = c.suivant
    if c.suivant is not None:
        c.suivant = c.suivant.suivant      # court-circuit
    return lst
```
On s'arrête sur la cellule **précédente** (on regarde `c.suivant.valeur`), car c'est son lien qu'il faut modifier.
:::
::::

::::exercice[Insérer dans une liste triée]{niveau=3}
Écris `inserer_trie(lst, x)` qui insère une nouvelle cellule de valeur `x` dans la liste chaînée **triée** `lst`, à sa place,
et renvoie la tête.

```python depart
class Cellule:
    def __init__(self, valeur, suivant=None):
        self.valeur = valeur
        self.suivant = suivant

def inserer_trie(lst, x):
    ...
```

```python tests
def vers(l):
    t = []
    while l:
        t.append(l.valeur); l = l.suivant
    return t
l = None
for v in [5, 1, 4, 1, 9, 0]:
    l = inserer_trie(l, v)
assert vers(l) == [0, 1, 1, 4, 5, 9], "insertions successives"
assert vers(inserer_trie(None, 3)) == [3], "liste vide"
```

:::corrige
```python solution
class Cellule:
    def __init__(self, valeur, suivant=None):
        self.valeur = valeur
        self.suivant = suivant

def inserer_trie(lst, x):
    if lst is None or x <= lst.valeur:
        return Cellule(x, lst)              # en tête
    c = lst
    while c.suivant is not None and c.suivant.valeur < x:
        c = c.suivant
    c.suivant = Cellule(x, c.suivant)       # après c
    return lst
```
Insérer `n` valeurs une à une ainsi, c'est un **tri par insertion** sur liste chaînée : $\Theta(n^2)$ au pire, mais sans
aucun décalage d'éléments.
:::
::::

::::exercice[Fusion en place de deux listes chaînées triées]{niveau=4 duree=25}
On dispose de deux listes chaînées **triées** `a` et `b` (classe `Cellule` du cours).

1. Écris `fusion(a, b)` qui renvoie une liste chaînée triée contenant toutes les cellules de `a` et `b`, **sans créer de
   nouvelle cellule** (on réutilise les cellules existantes en modifiant leurs liens).
2. Justifie la correction de ton algorithme (invariant) et sa terminaison.
3. Donne son coût en comparaisons et en mémoire supplémentaire. Compare avec la fusion de deux listes Python vue dans le
   tri fusion.
4. En déduire un tri fusion de listes chaînées : comment couper une liste chaînée en deux moitiés ? Quel est le coût du tri ?

:::criteres
- Code correct : une cellule « sentinelle » (ou un traitement de la tête), puis tant que `a` et `b` sont non vides, on accroche la plus petite tête à la fin du résultat et on avance ; on accroche enfin le reste non vide.
- Invariant : la liste construite (depuis la sentinelle jusqu'à `fin`) est triée, contient exactement les cellules déjà retirées de `a` et `b`, et son dernier élément est inférieur ou égal aux têtes restantes.
- Terminaison : le nombre total de cellules restantes dans `a` et `b` diminue de 1 à chaque tour.
- Coût : au plus $n_a + n_b - 1$ comparaisons, mémoire supplémentaire constante (aucune cellule créée), contre une nouvelle liste de taille $n_a + n_b$ pour la version tableau.
- Découpage : parcours avec deux pointeurs (un qui avance d'une cellule, l'autre de deux) ou calcul de la longueur ; coût du tri $\Theta(n \log n)$, mémoire supplémentaire hors pile constante.
:::

:::corrige
1. ```python
   def fusion(a, b):
       sentinelle = Cellule(None)          # cellule factice qui évite de traiter la tête à part
       fin = sentinelle
       while a is not None and b is not None:
           if a.valeur <= b.valeur:
               fin.suivant = a
               a = a.suivant
           else:
               fin.suivant = b
               b = b.suivant
           fin = fin.suivant
       fin.suivant = a if a is not None else b   # on accroche le reste
       return sentinelle.suivant
   ```
2. **Invariant** : la liste qui part de `sentinelle.suivant` et se termine en `fin` est triée, contient exactement les
   cellules déjà retirées de `a` et `b`, et `fin.valeur` (si elle existe) est inférieure ou égale à toutes les valeurs
   restantes dans `a` et `b` (car on prend toujours la plus petite des deux têtes, et les listes sont triées). À la sortie,
   l'une des listes est vide ; on accroche l'autre, déjà triée et dont toutes les valeurs sont `>=` `fin.valeur` : le
   résultat est trié et contient toutes les cellules. **Terminaison** : le nombre de cellules restantes dans `a` et `b`
   diminue de 1 à chaque tour.
3. Chaque comparaison place une cellule ; la dernière liste restante est accrochée sans comparaison : au plus
   $n_a + n_b - 1$ comparaisons, $\Theta(n_a + n_b)$. Mémoire supplémentaire **constante** (une sentinelle et deux
   références), contre une nouvelle liste de $n_a + n_b$ éléments pour la fusion de tableaux.
4. Pour couper en deux : on avance un pointeur « lent » d'une cellule et un pointeur « rapide » de deux ; quand le rapide
   atteint la fin, le lent est au milieu ; on coupe en mettant `lent.suivant = None`. On trie chaque moitié récursivement
   et on les fusionne : $C(n) = 2C(n/2) + \Theta(n)$, soit $\Theta(n \log n)$, sans copie des éléments (seule la pile
   d'appels, de hauteur $\log_2 n$, consomme de la mémoire). C'est le tri de référence pour les listes chaînées.
:::
::::
