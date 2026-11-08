---
titre: Interface et implémentation
resume: "Distinguer ce qu'une structure de données permet de faire de la façon dont elle est programmée."
duree: 30
objectifs:
  - "Spécifier une structure de données par son interface"
  - "Distinguer interface et implémentation"
  - "Écrire plusieurs implémentations d'une même structure"
---

Une structure de données se décrit d'abord par **ce qu'on peut faire avec elle**, avant de savoir comment la programmer.

## 1. L'interface d'une file

Une **file** fonctionne comme une file d'attente : premier arrivé, premier servi.

| Opération | Effet |
| --- | --- |
| `creer_file()` | crée une file vide |
| `est_vide(f)` | indique si la file est vide |
| `enfiler(f, x)` | ajoute x à la fin |
| `defiler(f)` | retire le premier élément et le renvoie |

C'est son **interface** : la liste des opérations et leur effet.

## 2. Deux implémentations

L'**implémentation** est la façon de la programmer.

**Avec un tableau :**

```python exec
class File:
    def __init__(self):
        self.contenu = []
    def est_vide(self):
        return len(self.contenu) == 0
    def enfiler(self, x):
        self.contenu.append(x)
    def defiler(self):
        return self.contenu.pop(0)

f = File()
f.enfiler(1); f.enfiler(2)
print(f.defiler())
```

**Avec deux piles :** on enfile sur `entree`. Pour défiler, si `sortie` est vide, on y verse toute la pile `entree`, ce qui inverse l'ordre.

```python exec
class File:
    def __init__(self):
        self.entree = []
        self.sortie = []
    def est_vide(self):
        return self.entree == [] and self.sortie == []
    def enfiler(self, x):
        self.entree.append(x)
    def defiler(self):
        if self.sortie == []:
            while self.entree != []:
                self.sortie.append(self.entree.pop())
        return self.sortie.pop()

f = File()
f.enfiler(1); f.enfiler(2)
print(f.defiler())
```

Le programme qui **utilise** la file n'a pas à changer : il n'utilise que l'interface.

Pourquoi changer ? `pop(0)` décale tous les éléments à chaque retrait : son coût est linéaire. Avec deux piles, chaque élément n'est déplacé qu'une seule fois.

## L'essentiel

- **Interface** : les opérations disponibles et leur effet.
- **Implémentation** : la façon de les programmer.
- On peut changer d'implémentation sans modifier les programmes qui utilisent la structure.

## Exercices

::::exercice[Interface ou implémentation ?]{niveau=1 type=associer}
Classe chaque affirmation.

| Affirmation | Catégorie |
| --- | --- |
| « `defiler` retire le premier élément arrivé » | interface |
| « les éléments sont rangés dans un tableau Python » | implémentation |
| « `est_vide` indique si la file est vide » | interface |
| « on utilise deux piles » | implémentation |
::::

::::exercice[Dérouler une file à deux piles]{niveau=1 type=completer}
On part d'une file vide. Complète le contenu des piles, le sommet étant à droite. Écris `vide` pour une pile vide.

```python calcul
e, s = [], []
def aff(x):
    print(" ".join(map(str, x)) if x else "vide")
e += [1, 2, 3]
aff(e); aff(s)
while e:
    s.append(e.pop())
s.pop()
aff(e); aff(s)
e.append(4)
aff(e); aff(s)
s.pop()
aff(e); aff(s)
```

| Opération | entree | sortie |
| --- | --- | --- |
| enfiler 1, 2 puis 3 | [[1 2 3]] | [[vide]] |
| défiler | [[vide]] | [[3 2]] |
| enfiler 4 | [[4]] | [[3 2]] |
| défiler | [[4]] | [[3]] |
::::

::::exercice[Une file avec une classe]{niveau=2}
Écris une classe `File` (premier arrivé, premier servi) avec les méthodes `est_vide()`, `enfiler(x)` (ajoute à la fin), `defiler()` (retire
et renvoie le premier élément) et `taille()`. L'implémentation interne est libre.

```python depart
class File:
    ...
```

```python tests
f = File()
assert f.est_vide(), "vide au départ"
f.enfiler("A"); f.enfiler("B"); f.enfiler("C")
assert f.taille() == 3, "trois éléments"
assert f.defiler() == "A", "premier arrivé, premier servi"
assert f.defiler() == "B", "puis B"
f.enfiler("D")
assert f.defiler() == "C" and f.defiler() == "D", "puis C et D"
assert f.est_vide(), "vide à la fin"
```

:::corrige
```python solution
class File:
    def __init__(self):
        self._contenu = []

    def est_vide(self):
        return len(self._contenu) == 0

    def enfiler(self, x):
        self._contenu.append(x)

    def defiler(self):
        assert not self.est_vide(), "file vide"
        return self._contenu.pop(0)

    def taille(self):
        return len(self._contenu)
```

`pop(0)` retire le premier élément, mais décale tous les autres : c'est coûteux pour une grande file. Le chapitre suivant propose une
implémentation avec **deux piles**, sans changer l'interface.
:::
::::

::::exercice[Une imprimante partagée]{niveau=3}
Une imprimante range les documents à imprimer dans une file. Un document est un couple `(nom, pages)`. La classe `File` est fournie : utilise **seulement** `est_vide()`, `enfiler(x)` et `defiler()`.

1. Écris `total_pages(f)`, qui renvoie le nombre total de pages en attente. À la fin, la file doit être comme au départ.
2. Écris `retirer_gros(f, limite)`, qui retire les documents de plus de `limite` pages, garde les autres dans le même ordre et renvoie le nombre de documents retirés.
3. À l'écrit : on remplace `File` par une version à deux piles. Faut-il modifier tes fonctions ? Justifie.

:::indice
Pour parcourir une file sans la perdre, défile tout dans une file auxiliaire, puis remets tout en place.
:::

```python depart
class File:
    def __init__(self):
        self.contenu = []
    def est_vide(self):
        return len(self.contenu) == 0
    def enfiler(self, x):
        self.contenu.append(x)
    def defiler(self):
        return self.contenu.pop(0)

def total_pages(f):
    ...

def retirer_gros(f, limite):
    ...
```

```python tests
f = File()
for d in [("a", 3), ("b", 50), ("c", 2)]:
    f.enfiler(d)
assert total_pages(f) == 55, "somme des pages"
assert f.defiler() == ("a", 3), "la file n'a pas changé"
f = File()
for d in [("a", 3), ("b", 50), ("c", 2), ("d", 40)]:
    f.enfiler(d)
assert retirer_gros(f, 10) == 2, "deux documents retirés"
assert f.defiler() == ("a", 3) and f.defiler() == ("c", 2), "ordre conservé"
assert f.est_vide(), "plus rien"
assert total_pages(File()) == 0, "file vide"
```

:::corrige
```python solution
class File:
    def __init__(self):
        self.contenu = []
    def est_vide(self):
        return len(self.contenu) == 0
    def enfiler(self, x):
        self.contenu.append(x)
    def defiler(self):
        return self.contenu.pop(0)

def total_pages(f):
    aux = File()
    total = 0
    while not f.est_vide():
        d = f.defiler()
        total = total + d[1]
        aux.enfiler(d)
    while not aux.est_vide():
        f.enfiler(aux.defiler())
    return total

def retirer_gros(f, limite):
    aux = File()
    retires = 0
    while not f.est_vide():
        d = f.defiler()
        if d[1] > limite:
            retires = retires + 1
        else:
            aux.enfiler(d)
    while not aux.est_vide():
        f.enfiler(aux.defiler())
    return retires
```

**Question 3.** Non : ces fonctions n'utilisent que l'interface. Si les méthodes gardent le même effet, le code qui les appelle fonctionne sans changement.
:::
::::
