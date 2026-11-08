---
titre: Listes, piles et files
resume: "Trois structures linéaires, leurs opérations et le choix de la bonne structure."
duree: 40
objectifs:
  - "Distinguer listes, piles et files par leurs opérations"
  - "Utiliser les modes LIFO et FIFO"
  - "Choisir une structure adaptée à une situation"
prerequis: [terminale-structures/poo]
---

Trois structures rangent les éléments les uns à la suite des autres. Ce qui les distingue, c'est **comment on y accède**.

## 1. La pile : LIFO

*Last In, First Out* : le dernier entré est le premier sorti, comme une pile d'assiettes.

Opérations : `empiler`, `depiler`, `sommet`, `est_vide`.

Usages : annuler une action, retour en arrière, parenthèses, appels de fonctions.

En Python, un tableau suffit : `append` empile, `pop()` dépile. Ces deux opérations sont immédiates.

## 2. La file : FIFO

*First In, First Out* : le premier entré est le premier sorti, comme une file d'attente.

Opérations : `enfiler`, `defiler`, `est_vide`.

Usages : impression, requêtes d'un serveur, processus en attente.

On ne voit que le bout de ces structures. Pour lire tous les éléments sans les perdre, on les retire dans une structure auxiliaire, puis on les remet.

## 3. La liste chaînée

Une suite de **maillons** : chacun contient une **valeur** et un lien vers le **maillon suivant**.

```python exec
class Maillon:
    def __init__(self, valeur, suivant=None):
        self.valeur = valeur
        self.suivant = suivant

liste = Maillon(3, Maillon(8, Maillon(5)))

def longueur(m):
    n = 0
    while m is not None:
        n = n + 1
        m = m.suivant
    return n

print(longueur(liste))
```

| Opération | Tableau | Liste chaînée |
| --- | --- | --- |
| lire le i-ème élément | immédiat | il faut parcourir |
| ajouter au début | il faut tout décaler | immédiat |

## L'essentiel

- Pile : LIFO. File : FIFO.
- Liste chaînée : des maillons (valeur, suivant).
- On choisit la structure selon l'ordre de traitement voulu.

## Exercices

::::exercice[QCM : listes, piles, files]{niveau=1 type=quiz}
Une question à la fois : la correction s'affiche aussitôt.

1. Une pile fonctionne selon le principe :

   - [ ] FIFO
   - [x] LIFO
   - [ ] trié
   - [ ] aléatoire

   > Dernier entré, premier sorti.

1. On enfile A, B, C dans une file puis on défile une fois. Quel élément obtient-on ?

   - [x] A
   - [ ] B
   - [ ] C
   - [ ] rien

   > Premier entré, premier sorti.

1. Que contient un maillon d'une liste chaînée ?

   - [ ] seulement une valeur
   - [x] une valeur et une référence vers le maillon suivant
   - [ ] l'indice du maillon
   - [ ] la longueur de la liste

   > Le dernier maillon a `None` pour suivant.

1. Quel est le coût de l'accès au i-ème élément d'une liste chaînée ?

   - [ ] immédiat
   - [x] linéaire : il faut parcourir i maillons
   - [ ] quadratique
   - [ ] logarithmique

   > Contrairement au tableau, pas d'accès direct.

1. Quelle opération est immédiate sur une liste chaînée et coûteuse sur un tableau ?

   - [ ] lire le dernier élément
   - [x] ajouter un élément en tête
   - [ ] lire le i-ème élément
   - [ ] connaître la longueur

   > Dans un tableau, il faut décaler tous les éléments.
::::

::::exercice[Dérouler une pile et une file]{niveau=1 type=reponses}
Réponds à chaque question.

1. On empile 4, 7 puis 2, puis on dépile une fois. Quel élément obtient-on ?

   - 2

1. On enfile 4, 7 puis 2, puis on défile une fois. Quel élément obtient-on ?

   - 4

1. Pile vide. On empile 1, 2, 3, on dépile, on empile 9, on dépile deux fois. Quel est le dernier élément dépilé ?

   ```python calcul
   p = [1, 2, 3]
   p.pop()
   p.append(9)
   p.pop()
   print(p.pop())
   ```

   - 2
::::

::::exercice[Pile ou file ?]{niveau=2}
Pour chaque situation, indique s'il faut une pile ou une file, et justifie : (a) l'historique du bouton « précédent » d'un navigateur ; (b) les
requêtes reçues par un serveur Web ; (c) les appels de fonctions en cours d'un programme ; (d) les messages envoyés à une imprimante partagée ;
(e) l'exploration d'un labyrinthe en revenant au dernier carrefour quand on est bloqué.

:::criteres
- (a) pile, (b) file, (c) pile, (d) file, (e) pile.
- Chaque justification parle de l'ordre de traitement : le plus récent d'abord (pile) ou dans l'ordre d'arrivée (file).
:::

:::corrige
(a) **Pile** : « précédent » ramène à la page la plus **récente**. (b) **File** : les requêtes sont traitées dans leur **ordre d'arrivée**,
pour être équitable. (c) **Pile** : la fonction appelée en **dernier** est la première à se terminer (c'est la pile d'appels). (d) **File** :
premier document envoyé, premier imprimé. (e) **Pile** : on revient au **dernier** carrefour rencontré ; c'est le parcours en profondeur
d'un graphe. Règle : le plus récent d'abord, pile ; le plus ancien d'abord, file.
:::
::::

::::exercice[Fonctions sur une liste chaînée]{niveau=2}
Avec la classe `Maillon` fournie, écris `somme(m)` (somme des valeurs), `contient(m, x)` et `vers_tableau(m)` qui renvoie le tableau Python des
valeurs dans l'ordre. `m` est le premier maillon, ou `None` pour une liste vide.

```python depart
class Maillon:
    def __init__(self, valeur, suivant=None):
        self.valeur = valeur
        self.suivant = suivant

def somme(m):
    ...

def contient(m, x):
    ...

def vers_tableau(m):
    ...
```

```python tests
l = Maillon(3, Maillon(8, Maillon(5)))
assert somme(l) == 16, "somme"
assert somme(None) == 0, "liste vide"
assert contient(l, 8) and not contient(l, 4), "contient"
assert vers_tableau(l) == [3, 8, 5], "conversion"
assert vers_tableau(None) == [], "vide"
```

:::corrige
```python solution
class Maillon:
    def __init__(self, valeur, suivant=None):
        self.valeur = valeur
        self.suivant = suivant

def somme(m):
    s = 0
    while m is not None:
        s = s + m.valeur
        m = m.suivant
    return s

def contient(m, x):
    while m is not None:
        if m.valeur == x:
            return True
        m = m.suivant
    return False

def vers_tableau(m):
    t = []
    while m is not None:
        t.append(m.valeur)
        m = m.suivant
    return t
```

Le schéma est toujours le même : `while m is not None:` … `m = m.suivant`. On modifie la variable locale `m`, pas la liste.
:::
::::

::::exercice[Bien parenthésé ?]{niveau=2}
Écris `bien_parenthese(texte)` qui renvoie `True` si les parenthèses `()`, crochets `[]` et accolades `{}` du texte sont correctement
appariés et imbriqués. Utilise une pile (un tableau avec `append` et `pop` suffit). Les autres caractères sont ignorés.

```python depart
def bien_parenthese(texte):
    ...
```

```python tests
assert bien_parenthese("(a + [b * c]) - {d}"), "correct"
assert not bien_parenthese("(a + b]"), "mauvais type"
assert not bien_parenthese("([)]"), "mauvaise imbrication"
assert not bien_parenthese("((a)"), "ouvrante en trop"
assert not bien_parenthese("a)"), "fermante en trop"
assert bien_parenthese(""), "vide"
```

:::corrige
```python solution
def bien_parenthese(texte):
    paires = {")": "(", "]": "[", "}": "{"}
    pile = []
    for c in texte:
        if c in "([{":
            pile.append(c)
        elif c in ")]}":
            if len(pile) == 0 or pile.pop() != paires[c]:
                return False
    return len(pile) == 0
```

Chaque fermante doit correspondre à la **dernière** ouvrante encore ouverte : c'est le sommet de la pile. À la fin, la pile doit être vide
(sinon une ouvrante n'a jamais été fermée).
:::
::::

::::exercice[Annuler et rétablir]{niveau=3}
Un éditeur de texte garde les mots saisis dans une pile `mots`, et les mots annulés dans une pile `annules`.

1. Écris `saisir(mot)`, qui empile `mot` sur `mots` et vide `annules`.
2. Écris `annuler()`, qui déplace le sommet de `mots` vers `annules`, et ne fait rien si `mots` est vide.
3. Écris `retablir()`, qui fait le déplacement inverse, et ne fait rien si `annules` est vide.
4. Écris `texte()`, qui renvoie les mots dans l'ordre de saisie, séparés par une espace.
5. À l'écrit : pourquoi `saisir` doit-il vider `annules` ? Donne un exemple.

```python depart
class Editeur:
    def __init__(self):
        self.mots = []
        self.annules = []

    def saisir(self, mot):
        ...

    def annuler(self):
        ...

    def retablir(self):
        ...

    def texte(self):
        ...
```

```python tests
e = Editeur()
e.annuler()
e.retablir()
assert e.texte() == "", "éditeur vide"
e.saisir("le"); e.saisir("chat"); e.saisir("dort")
e.annuler()
assert e.texte() == "le chat", "annuler"
e.annuler()
e.retablir()
assert e.texte() == "le chat", "rétablir"
e.annuler()
e.saisir("chien")
assert e.texte() == "le chien", "nouvelle saisie"
e.retablir()
assert e.texte() == "le chien", "plus rien à rétablir"
```

:::corrige
```python solution
class Editeur:
    def __init__(self):
        self.mots = []
        self.annules = []

    def saisir(self, mot):
        self.mots.append(mot)
        self.annules = []

    def annuler(self):
        if len(self.mots) > 0:
            self.annules.append(self.mots.pop())

    def retablir(self):
        if len(self.annules) > 0:
            self.mots.append(self.annules.pop())

    def texte(self):
        return " ".join(self.mots)
```

**Question 5.** Après une nouvelle saisie, les mots annulés ne font plus partie de la suite du texte. Si on saisit « le chat », qu'on annule « chat », puis qu'on saisit « chien », « rétablir » ne doit pas ajouter « chat » après « chien ».
:::
::::
