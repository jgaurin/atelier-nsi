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

## 2. La file : FIFO

*First In, First Out* : le premier entré est le premier sorti, comme une file d'attente.

Opérations : `enfiler`, `defiler`, `est_vide`.

Usages : impression, requêtes d'un serveur, processus en attente.

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

1. On empile 1, 2, 3 puis on dépile une fois. Quel élément obtient-on ?

   - [ ] 1
   - [ ] 2
   - [x] 3
   - [ ] la pile entière

   > Le sommet est le dernier élément empilé.

1. On enfile A, B, C dans une file puis on défile une fois. Quel élément obtient-on ?

   - [x] A
   - [ ] B
   - [ ] C
   - [ ] rien

   > Premier entré, premier sorti.

1. Quelle structure pour la fonction « annuler » d'un traitement de texte ?

   - [x] une pile
   - [ ] une file
   - [ ] un dictionnaire
   - [ ] un tableau trié

   > On annule d'abord la dernière action.

1. Quelle structure pour une file d'impression ?

   - [ ] une pile
   - [x] une file
   - [ ] un arbre
   - [ ] un ensemble

   > Les documents sont imprimés dans l'ordre d'arrivée.

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

1. Qu'appelle-t-on l'interface d'une structure de données ?

   - [ ] son code Python
   - [x] l'ensemble de ses opérations et de leur effet
   - [ ] son affichage à l'écran
   - [ ] la mémoire qu'elle occupe

   > L'implémentation, elle, est le code.

1. Quelle structure sert à vérifier qu'une expression est bien parenthésée ?

   - [x] une pile
   - [ ] une file
   - [ ] un dictionnaire
   - [ ] une liste triée

   > Chaque parenthèse fermante doit correspondre à la dernière ouvrante.

1. Que provoque `m.valeur` si `m` vaut `None` ?

   - [ ] `None`
   - [ ] 0
   - [x] une `AttributeError`
   - [ ] une `IndexError`

   > Il faut tester `m is not None` avant d'accéder au maillon.
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

::::exercice[Compléter une pile]{niveau=1 type=completer}
Complète cette implémentation d'une pile.

```python trous
class Pile:
    def __init__(self):
        self.contenu = [[[]]]

    def est_vide(self):
        return len(self.contenu) == [[0]]

    def empiler(self, x):
        self.contenu.[[append]](x)

    def depiler(self):
        return self.contenu.[[pop()]]
```
::::

::::exercice[Pile ou file ?]{niveau=1}
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

::::exercice[Fonctions sur une liste chaînée]{niveau=1}
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
