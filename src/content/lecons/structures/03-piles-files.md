---
titre: Piles et files
resume: Deux structures linéaires à accès restreint — la pile (dernier entré, premier sorti) et la file (premier entré, premier sorti) —, leurs implémentations et leurs applications.
duree: 75
objectifs:
  - Spécifier les types abstraits Pile et File et prévoir le résultat d'une suite d'opérations
  - Implémenter une pile et une file de plusieurs façons, avec des opérations en temps constant
  - Utiliser une pile pour vérifier un parenthésage ou évaluer une expression postfixée
  - Analyser le coût amorti d'une file implémentée avec deux piles
prerequis: [structures/listes-chainees]
programme: [asd-lineaires, asd-types, nsit-structures]
cartes:
  - q: "Pile ou file : LIFO, FIFO ?"
    r: "Pile = LIFO (*last in, first out*, dernier entré premier sorti). File = FIFO (*first in, first out*, premier entré premier sorti)."
  - q: Opérations d'une pile ?
    r: "`pile_vide`, `est_vide`, `empiler` (ajouter au sommet), `depiler` (retirer et renvoyer le sommet), éventuellement `sommet` (lire sans retirer)."
  - q: Implémenter une pile avec une liste Python ?
    r: "`append` pour empiler, `pop()` pour dépiler : les deux en temps constant (amorti), le sommet est à la fin."
  - q: Pourquoi ne pas implémenter une file avec `append` et `pop(0)` ?
    r: "`pop(0)` décale tous les éléments : $\\Theta(n)$. On utilise `collections.deque`, deux piles, ou une liste chaînée avec pointeurs de tête et de queue."
  - q: Principe de la file à deux piles ?
    r: "On enfile dans la pile `entree` ; pour défiler, si `sortie` est vide on y renverse toute `entree`, puis on dépile `sortie`. Coût amorti constant."
  - q: Comment vérifier un parenthésage avec une pile ?
    r: "On empile chaque ouvrante ; pour chaque fermante, la pile doit être non vide et son sommet doit être l'ouvrante correspondante (on dépile). À la fin, la pile doit être vide."
  - q: Évaluer `3 4 + 2 *` (notation postfixée) ?
    r: "Pile : 3 ; 3 4 ; `+` → 7 ; 7 2 ; `*` → 14. Résultat 14."
---

Le bouton « Annuler » d'un éditeur annule **la dernière** action ; une imprimante traite les documents **dans l'ordre**
où ils sont arrivés. Ces deux comportements correspondent aux deux structures linéaires les plus utilisées en
informatique : la **pile** et la **file**. Elles sont au cœur de mécanismes fondamentaux (la pile des appels de fonctions,
le parcours en largeur d'un graphe, l'ordonnancement des processus) et le programme de terminale demande de savoir les
spécifier, les implémenter et les utiliser.

## 1. La pile : dernier entré, premier sorti

:::definition
Une **pile** (*stack*) est une collection où l'on n'accède qu'à l'élément ajouté en **dernier**, le **sommet**.
Opérations : `pile_vide()`, `est_vide(p)`, `empiler(p, x)` (ajouter au sommet), `depiler(p)` (retirer et renvoyer le
sommet ; précondition : pile non vide), et souvent `sommet(p)` (lire sans retirer). C'est le principe **LIFO**.
:::

```mermaid legende="Une pile après empiler 3, empiler 8, empiler 5 : seul le sommet (5) est accessible"
graph TD
  S["5  ← sommet"] --- B["8"] --- C["3"]
```

Avec une liste Python, le sommet est le **dernier** élément : `append` et `pop()` sont en temps constant.

```python exec
class Pile:
    def __init__(self):
        self._t = []

    def est_vide(self):
        return len(self._t) == 0

    def empiler(self, x):
        self._t.append(x)

    def depiler(self):
        if self.est_vide():
            raise IndexError("dépiler une pile vide")
        return self._t.pop()

    def sommet(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self._t[-1]

p = Pile()
for x in [3, 8, 5]:
    p.empiler(x)
print(p.depiler(), p.depiler(), p.sommet())
```

On peut aussi utiliser une **liste chaînée** dont la tête est le sommet : empiler = ajouter en tête, dépiler = retirer la
tête, toutes deux en $\Theta(1)$.

Usages : annulation (« Ctrl + Z »), historique « page précédente » d'un navigateur, **pile d'appels** des fonctions,
évaluation d'expressions, parcours en profondeur, retour sur trace (labyrinthes).

## 2. La file : premier entré, premier sorti

:::definition
Une **file** (*queue*) est une collection où l'on ajoute à la **queue** et où l'on retire à la **tête** : le premier
élément ajouté est le premier retiré (**FIFO**). Opérations : `file_vide()`, `est_vide(f)`, `enfiler(f, x)`,
`defiler(f)` (retirer et renvoyer la tête ; précondition : file non vide).
:::

```mermaid legende="Une file : on enfile à droite (queue), on défile à gauche (tête)"
graph LR
  T["tête → 3"] --- B["8"] --- C["5 ← queue"]
```

Implémenter une file avec une liste Python et `pop(0)` est une **mauvaise idée** : retirer le premier élément décale tous
les autres ($\Theta(n)$). Plusieurs bonnes implémentations existent :

- `collections.deque` (liste doublement chaînée de blocs) : `append` et `popleft` en $\Theta(1)$ ;
- une **liste chaînée** avec une référence vers la tête **et** vers la queue ;
- **deux piles** (voir plus bas) ;
- un **tableau circulaire** de taille fixe, avec deux indices qui tournent (exercice).

```python exec
from collections import deque

f = deque()
for client in ["Ana", "Bilal", "Chloé"]:
    f.append(client)          # enfiler
print(f.popleft(), f.popleft(), list(f))   # défiler
```

Usages : file d'impression, tampons de communication (clavier, réseau), ordonnancement des processus, **parcours en
largeur** d'un graphe (le plus court chemin en nombre d'arêtes).

## 3. Une file avec deux piles

On utilise une pile `entree` (où l'on enfile) et une pile `sortie` (où l'on défile). Quand `sortie` est vide et qu'on
veut défiler, on **renverse** toute `entree` dans `sortie` : le plus ancien élément se retrouve au sommet de `sortie`.

```python exec
class File:
    def __init__(self):
        self._entree = []
        self._sortie = []

    def est_vide(self):
        return not self._entree and not self._sortie

    def enfiler(self, x):
        self._entree.append(x)

    def defiler(self):
        if not self._sortie:
            while self._entree:
                self._sortie.append(self._entree.pop())
        if not self._sortie:
            raise IndexError("défiler une file vide")
        return self._sortie.pop()

f = File()
for x in [1, 2, 3]:
    f.enfiler(x)
print(f.defiler())
f.enfiler(4)
print(f.defiler(), f.defiler(), f.defiler())
```

Un `defiler` peut coûter cher (renverser toute la pile `entree`), mais **chaque élément n'est déplacé qu'une seule fois**
de `entree` vers `sortie`. Sur une suite de $m$ opérations, le coût total est en $\Theta(m)$ : chaque opération coûte
$\Theta(1)$ **en moyenne sur la suite** (on dit en coût **amorti**).

## 4. Applications des piles

**Parenthésage.** Une expression comme `(a[i] + {b * c})` est bien parenthésée si chaque fermante correspond à la
dernière ouvrante non encore fermée : c'est exactement le comportement d'une pile.

**Notation postfixée (polonaise inversée, NPI).** On écrit l'opérateur **après** ses opérandes : `(3 + 4) * 2` s'écrit
`3 4 + 2 *`. Plus besoin de parenthèses ni de priorités. Pour évaluer : on lit de gauche à droite, on empile les nombres,
et pour chaque opérateur on dépile deux valeurs, on calcule, on empile le résultat.

```python exec
def evaluer_npi(expression):
    pile = []
    for jeton in expression.split():
        if jeton in "+-*/":
            b = pile.pop()          # attention à l'ordre : b est le second opérande
            a = pile.pop()
            if jeton == "+": pile.append(a + b)
            elif jeton == "-": pile.append(a - b)
            elif jeton == "*": pile.append(a * b)
            else: pile.append(a / b)
        else:
            pile.append(float(jeton))
    return pile.pop()

print(evaluer_npi("3 4 + 2 *"), evaluer_npi("5 1 2 + 4 * + 3 -"))
```

| jeton | 5 | 1 | 2 | + | 4 | * | + | 3 | - |
|-------|---|---|---|---|---|---|---|---|---|
| pile  | 5 | 5 1 | 5 1 2 | 5 3 | 5 3 4 | 5 12 | 17 | 17 3 | 14 |

:::prof
En terminale NSI, piles et files sont introduites comme types abstraits, avec au moins deux implémentations chacune.
Une activité classique : jouer la file d'attente et la pile d'assiettes, puis programmer la vérification de parenthèses
ou une calculatrice NPI. L'erreur fréquente est l'**ordre des opérandes** lors du dépilement (pour `-` et `/`, le premier
dépilé est le **second** opérande).
:::

## Exemple guidé

**Problème.** Écrire `bien_parenthesee(texte)` qui vérifie le bon emboîtement de `()`, `[]` et `{}` (les autres caractères
sont ignorés), justifier, et donner le coût.

**1. Idée.** On parcourt le texte. Une ouvrante est empilée. Une fermante doit correspondre au **sommet** de la pile (la
dernière ouvrante non fermée) : sinon, ou si la pile est vide, c'est faux ; si oui, on dépile. À la fin, il ne doit rester
aucune ouvrante.

```python exec
def bien_parenthesee(texte):
    paire = {")": "(", "]": "[", "}": "{"}
    pile = []
    for c in texte:
        if c in "([{":
            pile.append(c)
        elif c in ")]}":
            if not pile or pile.pop() != paire[c]:
                return False
    return len(pile) == 0

for t in ["(a[i] + {b * c})", "(]", "((a)", "a)(", ""]:
    print(repr(t), bien_parenthesee(t))
```

**2. Les trois façons d'échouer** : une fermante sans ouvrante (`"a)("`, pile vide), une fermante du mauvais type
(`"(]"`), une ouvrante jamais fermée (`"((a)"`, pile non vide à la fin).

**3. Invariant.** Après lecture d'un préfixe sans échec, la pile contient, dans l'ordre, les ouvrantes non encore fermées
du préfixe, et le préfixe est « bien parenthésé à ces ouvrantes près ». Une fermante est correcte si et seulement si elle
ferme la dernière d'entre elles, c'est-à-dire le sommet.

**4. Coût.** Un passage sur le texte, chaque caractère donnant au plus un empilement ou un dépilement en $\Theta(1)$ :
$\Theta(n)$ en temps, $O(n)$ en mémoire (la pile, dans le pire cas `"(((((("`).

## L'essentiel

- **Pile** (LIFO) : `empiler`, `depiler`, `sommet`, `est_vide` ; liste Python (`append`/`pop()`) ou liste chaînée (tête = sommet) : $\Theta(1)$.
- **File** (FIFO) : `enfiler` en queue, `defiler` en tête ; `deque`, liste chaînée avec tête et queue, deux piles (amorti $\Theta(1)$), tableau circulaire. Jamais `pop(0)`.
- Pile : annulation, pile d'appels, parenthésage, NPI, parcours en profondeur. File : impression, tampons, ordonnancement, parcours en largeur.
- Évaluer en NPI : empiler les nombres, dépiler deux opérandes par opérateur (attention à l'ordre).
- Coût amorti : coût total d'une suite d'opérations divisé par leur nombre.

## Exercices

::::exercice[Suivre une pile]{niveau=1}
On part d'une pile vide et on fait : empiler 1, empiler 2, dépiler, empiler 3, empiler 4, dépiler, dépiler.
Quelles valeurs ont été dépilées, dans l'ordre ?

- [ ] 1, 2, 3
- [x] 2, 4, 3
- [ ] 2, 3, 4
- [ ] 4, 3, 2

:::corrige
Pile : [1] → [1, 2] → dépile **2** → [1, 3] → [1, 3, 4] → dépile **4** → dépile **3** → [1].
:::
::::

::::exercice[Suivre une file]{niveau=1}
Même suite d'opérations avec une **file** : enfiler 1, enfiler 2, défiler, enfiler 3, enfiler 4, défiler, défiler.
Quelles valeurs sont sorties ?

- [x] 1, 2, 3
- [ ] 2, 4, 3
- [ ] 1, 3, 4
- [ ] 4, 3, 2

:::corrige
File (tête à gauche) : [1] → [1, 2] → défile **1** → [2, 3] → [2, 3, 4] → défile **2** → défile **3** → [4].
:::
::::

::::exercice[Classe Pile]{niveau=2}
Implémente une classe `Pile` avec les méthodes `est_vide()`, `empiler(x)`, `depiler()` (lève `IndexError` si la pile est
vide), `sommet()` et `taille()`, en utilisant une **liste chaînée** (une cellule = `(valeur, suivant)` sous forme de tuple,
ou une classe), et non une liste Python.

```python depart
class Pile:
    def __init__(self):
        self._tete = None
        self._taille = 0

    def est_vide(self):
        ...

    def empiler(self, x):
        ...

    def depiler(self):
        ...

    def sommet(self):
        ...

    def taille(self):
        ...
```

```python tests
p = Pile()
assert p.est_vide() and p.taille() == 0, "pile vide"
for x in [3, 8, 5]:
    p.empiler(x)
assert p.sommet() == 5 and p.taille() == 3, "sommet et taille"
assert p.depiler() == 5 and p.depiler() == 8, "ordre LIFO"
assert p.taille() == 1 and not p.est_vide(), "un élément restant"
p.depiler()
try:
    p.depiler()
    ok = False
except IndexError:
    ok = True
assert ok, "dépiler une pile vide lève IndexError"
```

:::corrige
```python solution
class Pile:
    def __init__(self):
        self._tete = None          # chaque cellule est un tuple (valeur, suivant)
        self._taille = 0

    def est_vide(self):
        return self._tete is None

    def empiler(self, x):
        self._tete = (x, self._tete)
        self._taille += 1

    def depiler(self):
        if self._tete is None:
            raise IndexError("pile vide")
        x, self._tete = self._tete
        self._taille -= 1
        return x

    def sommet(self):
        if self._tete is None:
            raise IndexError("pile vide")
        return self._tete[0]

    def taille(self):
        return self._taille
```
Toutes les opérations sont en $\Theta(1)$. Le compteur `_taille` évite de parcourir la liste pour la taille.
:::
::::

::::exercice[File à deux piles]{niveau=2}
Implémente une classe `File` avec `enfiler(x)`, `defiler()` (lève `IndexError` si vide) et `est_vide()`, à l'aide de **deux
listes Python utilisées comme des piles** (seulement `append`, `pop()` et le test de vacuité).

```python depart
class File:
    def __init__(self):
        self._entree = []
        self._sortie = []

    def est_vide(self):
        ...

    def enfiler(self, x):
        ...

    def defiler(self):
        ...
```

```python tests
f = File()
for x in [1, 2, 3]:
    f.enfiler(x)
assert f.defiler() == 1, "premier entré, premier sorti"
f.enfiler(4)
assert [f.defiler(), f.defiler(), f.defiler()] == [2, 3, 4], "ordre FIFO conservé"
assert f.est_vide(), "file vide"
try:
    f.defiler()
    ok = False
except IndexError:
    ok = True
assert ok, "défiler une file vide lève IndexError"
```

:::corrige
```python solution
class File:
    def __init__(self):
        self._entree = []
        self._sortie = []

    def est_vide(self):
        return not self._entree and not self._sortie

    def enfiler(self, x):
        self._entree.append(x)

    def defiler(self):
        if not self._sortie:
            while self._entree:
                self._sortie.append(self._entree.pop())
        if not self._sortie:
            raise IndexError("file vide")
        return self._sortie.pop()
```
On ne renverse `entree` que lorsque `sortie` est **vide** : sinon, on mélangerait l'ordre (le test après l'enfilement de 4
le vérifie).
:::
::::

::::exercice[Calculatrice NPI]{niveau=2}
Écris `npi(expression)` qui évalue une expression postfixée d'entiers séparés par des espaces, avec les opérateurs `+`,
`-`, `*` et `//` (division entière). Lève `ValueError` si l'expression est mal formée (pas assez d'opérandes, ou plusieurs
valeurs restantes à la fin).

```python depart
def npi(expression):
    ...
```

```python tests
assert npi("3 4 + 2 *") == 14, "(3 + 4) * 2"
assert npi("5 1 2 + 4 * + 3 -") == 14, "exemple du cours"
assert npi("10 3 -") == 7, "ordre des opérandes"
assert npi("17 5 //") == 3, "division entière"
assert npi("42") == 42, "un seul nombre"
for faux in ["3 +", "3 4", ""]:
    try:
        npi(faux)
        ok = False
    except ValueError:
        ok = True
    assert ok, "expression mal formée : " + repr(faux)
```

:::corrige
```python solution
def npi(expression):
    pile = []
    for jeton in expression.split():
        if jeton in ("+", "-", "*", "//"):
            if len(pile) < 2:
                raise ValueError("pas assez d'opérandes")
            b = pile.pop()
            a = pile.pop()
            if jeton == "+":
                pile.append(a + b)
            elif jeton == "-":
                pile.append(a - b)
            elif jeton == "*":
                pile.append(a * b)
            else:
                pile.append(a // b)
        else:
            pile.append(int(jeton))
    if len(pile) != 1:
        raise ValueError("expression mal formée")
    return pile[0]
```
`b` est dépilé **avant** `a` : pour `10 3 -`, on calcule bien `10 - 3`.
:::
::::

::::exercice[File circulaire bornée]{niveau=3}
Implémente une file de **capacité fixe** dans un tableau de taille `capacite`, avec un indice `debut` (tête) et un compteur
`n` d'éléments : l'élément suivant la dernière case est la case 0 (« circulaire »). `enfiler` lève `OverflowError` si la
file est pleine, `defiler` lève `IndexError` si elle est vide. Toutes les opérations doivent être en $\Theta(1)$.

```python depart
class FileCirculaire:
    def __init__(self, capacite):
        self._t = [None] * capacite
        self._debut = 0
        self._n = 0

    def enfiler(self, x):
        ...

    def defiler(self):
        ...

    def taille(self):
        return self._n
```

```python tests
f = FileCirculaire(3)
f.enfiler(1); f.enfiler(2); f.enfiler(3)
try:
    f.enfiler(4)
    plein = False
except OverflowError:
    plein = True
assert plein, "file pleine"
assert f.defiler() == 1, "tête"
f.enfiler(4)                      # va dans la case 0 libérée
assert [f.defiler(), f.defiler(), f.defiler()] == [2, 3, 4], "ordre FIFO en faisant le tour"
assert f.taille() == 0, "vide"
try:
    f.defiler()
    vide = False
except IndexError:
    vide = True
assert vide, "défiler une file vide"
```

:::corrige
```python solution
class FileCirculaire:
    def __init__(self, capacite):
        self._t = [None] * capacite
        self._debut = 0
        self._n = 0

    def enfiler(self, x):
        if self._n == len(self._t):
            raise OverflowError("file pleine")
        fin = (self._debut + self._n) % len(self._t)
        self._t[fin] = x
        self._n += 1

    def defiler(self):
        if self._n == 0:
            raise IndexError("file vide")
        x = self._t[self._debut]
        self._t[self._debut] = None
        self._debut = (self._debut + 1) % len(self._t)
        self._n -= 1
        return x

    def taille(self):
        return self._n
```
Le modulo fait « tourner » les indices. C'est l'implémentation des tampons de taille fixe (buffers clavier, audio, réseau).
:::
::::

::::exercice[Coût amorti de la file à deux piles]{niveau=4 duree=25}
On considère la file à deux piles du cours. On compte comme opérations élémentaires les `append` et `pop` sur les listes.

1. Quel est le coût d'un `defiler` dans le pire cas, en fonction du nombre $k$ d'éléments dans `entree` ? Donne une suite
   d'opérations qui le provoque.
2. Montre que, pour **toute** suite de $m$ opérations `enfiler`/`defiler` partant d'une file vide, le nombre total
   d'opérations élémentaires est au plus $4m$. (Indice : suis le parcours d'un élément.)
3. En déduire le coût amorti d'une opération. Pourquoi cette notion est-elle pertinente ici, et dans quel contexte un pire
   cas ponctuel pourrait-il quand même poser problème ?
4. La file de Python `collections.deque` a un coût $\Theta(1)$ dans le pire cas pour chaque opération. Que préférer en
   pratique ?

:::criteres
- Pire cas d'un `defiler` : `sortie` vide et `entree` contenant $k$ éléments : $k$ `pop` + $k$ `append` + 1 `pop`, soit $2k + 1$ ; exemple : $k$ enfilements puis un défilement.
- Argument : chaque élément subit au plus 4 opérations élémentaires dans sa vie (un `append` dans `entree`, un `pop` de `entree`, un `append` dans `sortie`, un `pop` de `sortie`) ; il y a au plus $m$ éléments enfilés, donc au plus $4m$ opérations.
- Coût amorti : $O(1)$ par opération ; pertinent car on s'intéresse au temps total d'un programme qui fait beaucoup d'opérations.
- Limite : contexte temps réel ou interactif où chaque opération doit répondre vite (un `defiler` isolé peut être long).
- Conclusion pratique : `deque` (pire cas constant, code standard et éprouvé), la file à deux piles restant utile quand on ne dispose que de piles (ou en programmation fonctionnelle).
:::

:::corrige
1. Si `sortie` est vide et que `entree` contient $k$ éléments, `defiler` fait $k$ `pop` sur `entree`, $k$ `append` sur
   `sortie`, puis un `pop` sur `sortie` : $2k + 1$ opérations, $\Theta(k)$. Exemple : enfiler $k$ éléments puis défiler.
2. Suivons un élément `x` : il est ajouté à `entree` (1 `append`), éventuellement transféré **une seule fois** vers `sortie`
   (1 `pop` + 1 `append`) — on ne transfère jamais de `sortie` vers `entree` —, puis éventuellement retiré de `sortie`
   (1 `pop`). Soit au plus **4** opérations élémentaires par élément. Une suite de $m$ opérations enfile au plus $m$
   éléments : au plus $4m$ opérations élémentaires au total (les tests de vacuité ajoutent $O(m)$).
3. Le coût total d'une suite de $m$ opérations est $O(m)$ : chaque opération coûte $O(1)$ **en coût amorti**. C'est la
   bonne mesure quand on s'intéresse au temps total d'un traitement (parcours en largeur, simulation…). En revanche, dans
   un contexte **temps réel** (un jeu qui doit afficher 60 images par seconde, un système embarqué), un `defiler`
   exceptionnellement long peut provoquer un à-coup : il faut alors un pire cas constant.
4. En pratique, `collections.deque` : chaque opération est en $\Theta(1)$ dans le pire cas, et c'est une bibliothèque
   standard, testée et optimisée. La file à deux piles reste utile quand on ne dispose que de piles (sujets d'écrit,
   structures immuables en programmation fonctionnelle).
:::
::::
