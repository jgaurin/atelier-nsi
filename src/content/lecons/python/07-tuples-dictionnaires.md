---
titre: Tuples et dictionnaires
resume: Regrouper des valeurs dans un p-uplet, associer des valeurs à des clés avec un dictionnaire, et choisir la bonne structure.
duree: 70
objectifs:
  - Créer et déballer un tuple, et savoir quand le préférer à une liste
  - Créer, lire, modifier et parcourir un dictionnaire (`get`, `in`, `items`)
  - Utiliser un dictionnaire pour compter, regrouper ou indexer des données
  - Expliquer pourquoi une clé doit être immuable et pourquoi l'accès par clé est rapide
prerequis: [python/chaines]
programme: [lp-python, asd-lineaires, nsi1-construits, nsit-structures]
cartes:
  - q: Différence entre un tuple et une liste ?
    r: "Un tuple est **immuable** (on ne peut pas modifier ses éléments) ; une liste est mutable. On utilise un tuple pour un enregistrement de taille fixe (coordonnées, couple)."
  - q: "Comment écrire un tuple à un seul élément ?"
    r: "Avec une virgule : `(5,)`. Sans virgule, `(5)` est juste l'entier 5 entre parenthèses."
  - q: "Que se passe-t-il avec `d[\"x\"]` si la clé `\"x\"` n'existe pas ? Comment l'éviter ?"
    r: "Une `KeyError`. On teste avant avec `\"x\" in d`, ou on utilise `d.get(\"x\", valeur_par_defaut)`."
  - q: Comment parcourir à la fois les clés et les valeurs d'un dictionnaire ?
    r: "`for cle, valeur in d.items():`"
  - q: Pourquoi une liste ne peut-elle pas être une clé de dictionnaire ?
    r: "Une clé doit être **hachable** (immuable) : le dictionnaire range la clé selon un calcul fait sur sa valeur ; si la valeur changeait, il ne la retrouverait plus."
  - q: Coût moyen de `x in d` pour un dictionnaire, et de `x in t` pour une liste ?
    r: "Constant en moyenne pour le dictionnaire (table de hachage) ; linéaire pour la liste (parcours)."
  - q: Comment compter les occurrences des éléments d'une liste `t` ?
    r: "`c = {}` puis `for x in t: c[x] = c.get(x, 0) + 1`."
  - q: Qu'est-ce qu'un ensemble (`set`) ?
    r: "Une collection sans doublons et sans ordre, avec un test d'appartenance rapide : `vus = set()`, `vus.add(x)`, `x in vus`."
---

Une liste range des valeurs **par position** : pour retrouver la note de Léa, il faudrait savoir qu'elle est à
l'indice 12, ou parcourir toute la liste. Dans la vraie vie, on cherche plutôt **par nom** : un annuaire associe
un nom à un numéro, un dictionnaire un mot à sa définition. Python offre pour cela le **dictionnaire**. Et pour
regrouper quelques valeurs qui vont ensemble (une date, un point, un couple nom-note), le **tuple**.

## 1. Les tuples (p-uplets)

Un **tuple** est une séquence **immuable** : on l'écrit avec des virgules, en général entre parenthèses.

```python exec
point = (3, -2)
date = (14, "juillet", 1789)
print(point[0], date[1], len(date))
x, y = point            # « déballage » : x reçoit 3, y reçoit -2
jour, mois, annee = date
print(x + y, annee)
singleton = (5,)        # la virgule fait le tuple
print(type(singleton), type((5)))
```

On l'utilise pour un **enregistrement** dont la taille et le sens de chaque case sont fixés (coordonnées, date,
couple `(nom, note)`), et pour **renvoyer plusieurs valeurs** d'une fonction. Comme il est immuable, un tuple
peut servir de clé de dictionnaire (voir plus bas).

```python exec erreur
point = (3, -2)
point[0] = 4
```

## 2. Les dictionnaires

:::definition
Un **dictionnaire** est une collection de couples **clé → valeur**, où chaque clé est unique. On accède à une valeur
par sa clé : `d[cle]`. En Python, le type est `dict`, et on l'écrit `{cle1: valeur1, cle2: valeur2}`.
:::

```python exec
age = {"Léa": 16, "Hugo": 17}
print(age["Léa"])
age["Inès"] = 15          # ajout d'un nouveau couple
age["Hugo"] = 18          # modification de la valeur associée à une clé existante
print(age, len(age))
print("Hugo" in age, "Paul" in age)   # in teste les CLÉS
print(age.get("Paul"), age.get("Paul", 0))
del age["Léa"]
print(age)
```

```mermaid legende="Un dictionnaire associe chaque clé (unique) à une valeur"
graph LR
  K1(["'Léa'"]) --> V1[16]
  K2(["'Hugo'"]) --> V2[18]
  K3(["'Inès'"]) --> V3[15]
```

:::attention
Lire une clé absente avec `d[cle]` provoque une `KeyError`. Deux parades : tester d'abord avec `cle in d`,
ou utiliser `d.get(cle, defaut)` qui renvoie `defaut` (ou `None`) si la clé manque.
:::

### Parcourir un dictionnaire

```python exec
stock = {"pommes": 12, "poires": 0, "kiwis": 7}
for fruit in stock:                    # les clés
    print(fruit, end=" ")
print()
print(list(stock.values()))            # les valeurs
for fruit, quantite in stock.items():  # les couples (clé, valeur)
    if quantite > 0:
        print(f"{fruit} : {quantite}")
```

Depuis Python 3.7, un dictionnaire conserve l'**ordre d'insertion** des clés lors d'un parcours.

## 3. Trois usages typiques

**Compter.** C'est l'usage le plus fréquent : la clé est l'objet compté, la valeur son nombre d'occurrences.

```python exec
mots = "le chat et le chien et le lapin".split()
compte = {}
for m in mots:
    compte[m] = compte.get(m, 0) + 1
print(compte)
```

**Regrouper.** La valeur associée à une clé peut être une liste qu'on complète :

```python exec
eleves = [("Léa", "1G1"), ("Hugo", "1G2"), ("Inès", "1G1")]
par_classe = {}
for nom, classe in eleves:
    if classe not in par_classe:
        par_classe[classe] = []
    par_classe[classe].append(nom)
print(par_classe)
```

**Indexer / décrire.** Un dictionnaire peut représenter un **enregistrement** aux champs nommés
(`{"nom": "Martin", "prenom": "Léa", "classe": "1G1"}`), ou une **table** qui associe un identifiant à des
informations. C'est aussi une façon naturelle de représenter un **graphe** : sommet → liste de voisins.

## 4. Pourquoi les clés doivent être immuables

Un dictionnaire Python est une **table de hachage** : à partir de la clé, une fonction de **hachage** calcule un
nombre qui indique où ranger le couple. Pour retrouver une clé, on recalcule ce nombre et on va directement au bon
endroit, sans parcourir les autres : l'accès, l'ajout et le test `in` prennent un temps **constant en moyenne**.

Si une clé pouvait changer après avoir été rangée, son hachage changerait et on ne la retrouverait plus. D'où la
règle : une clé doit être **hachable**, ce qui pour les types de base veut dire **immuable** : `int`, `float`,
`str`, `bool`, `tuple` (de valeurs immuables) conviennent ; `list` et `dict` non.

```python exec erreur
d = {}
d[[1, 2]] = "liste"
```

| Opération                 | Liste `t` (taille n) | Dictionnaire `d` (n clés) |
|---------------------------|----------------------|---------------------------|
| accès par position `t[i]` | constant             | (pas de positions)        |
| accès par clé `d[k]`      | (pas de clés)        | constant en moyenne       |
| test `x in …`             | linéaire             | constant en moyenne       |
| ajout                     | constant (à la fin)  | constant en moyenne       |

Le module « Structures de données » détaille les tables de hachage et leurs collisions.

### Les ensembles

Un **ensemble** (`set`) est un dictionnaire sans valeurs : une collection de clés uniques, sans ordre, avec un test
`in` rapide. Idéal pour mémoriser « ce qu'on a déjà vu » ou éliminer des doublons.

```python exec
vus = set()
for x in [3, 1, 3, 2, 1]:
    vus.add(x)
print(vus, 2 in vus, len(vus))
print({1, 2, 3} & {2, 3, 4}, {1, 2} | {5})   # intersection, union
```

:::prof
Dans le programme de première, les p-uplets et dictionnaires font partie des « types construits » ; en terminale,
le dictionnaire est revu comme **structure de données** (interface : ajouter, chercher, supprimer une association).
Les élèves confondent souvent le parcours des clés et des valeurs, et oublient l'initialisation dans les comptages
(`compte[m] += 1` sur une clé absente → `KeyError`). Faire écrire la version `if m in compte … else …` avant de
montrer `get` aide à comprendre ce que fait `get`.
:::

## Exemple guidé

**Problème.** Trouver les trois mots les plus fréquents d'un texte, en ignorant la casse et la ponctuation simple.

**1. Normaliser.** On met en minuscules, on remplace la ponctuation par des espaces, puis on découpe.

**2. Compter** avec un dictionnaire mot → nombre.

**3. Classer.** `sorted` accepte un paramètre `key` : la fonction qui donne, pour chaque élément, la valeur selon
laquelle trier. Ici on trie les couples `(mot, nombre)` selon le nombre, du plus grand au plus petit.

```python exec
def plus_frequents(texte, k):
    for signe in ".,;:!?'":
        texte = texte.replace(signe, " ")
    compte = {}
    for mot in texte.lower().split():
        compte[mot] = compte.get(mot, 0) + 1
    couples = sorted(compte.items(), key=lambda kv: kv[1], reverse=True)
    return couples[:k]

texte = "Le chat dort. Le chien aboie, le chat se réveille ; le chien part."
print(plus_frequents(texte, 3))
```

**4. Coût.** Le comptage est linéaire en nombre de mots `n` (chaque accès au dictionnaire est en temps constant
en moyenne). Le tri des `m` mots distincts coûte de l'ordre de $m \log m$. Pour un texte de taille `n`, c'est donc
au plus de l'ordre de $n \log n$.

**5. Et les égalités ?** `sorted` est **stable** : deux mots de même fréquence restent dans l'ordre où ils sont apparus
dans le dictionnaire, c'est-à-dire leur ordre de première apparition dans le texte.

## L'essentiel

- **Tuple** : séquence immuable, `(a, b)`, `(a,)` ; déballage `x, y = point` ; idéal pour un enregistrement fixe.
- **Dictionnaire** : `{cle: valeur}`, accès `d[cle]` (KeyError si absente), `d.get(cle, defaut)`, `cle in d`, `del d[cle]`.
- Parcours : `for k in d`, `d.values()`, `for k, v in d.items()`.
- Usages : compter (`d[x] = d.get(x, 0) + 1`), regrouper (valeurs = listes), indexer, représenter un graphe.
- Clés **hachables** (immuables) ; accès, ajout et test `in` en temps constant **en moyenne** (table de hachage).
- `set` : collection sans doublons, test `in` rapide.

## Exercices

::::exercice[Accès à une clé absente]{niveau=1}
Avec `d = {"a": 1, "b": 2}`, que vaut `d.get("c", 0) + d["b"]` ?

- [ ] une `KeyError`
- [x] `2`
- [ ] `3`
- [ ] `None`

:::corrige
`d.get("c", 0)` renvoie la valeur par défaut `0` (pas d'erreur), et `d["b"]` vaut `2` : la somme vaut `2`.
C'est `d["c"]` qui provoquerait une `KeyError`.
:::
::::

::::exercice[Des clés valides]{niveau=1}
Lesquelles de ces valeurs peuvent être des clés de dictionnaire ?

- [x] `(1, 2)`
- [x] `"abc"`
- [ ] `[1, 2]`
- [x] `3.5`
- [ ] `{"x": 1}`

:::corrige
Une clé doit être hachable : les tuples (de valeurs immuables), chaînes, nombres conviennent ; les listes et les
dictionnaires, mutables, sont refusés (`TypeError: unhashable type`).
:::
::::

::::exercice[Table de fréquences]{niveau=2}
Écris `frequences(t)` qui renvoie un dictionnaire associant à chaque élément de la liste `t` son nombre d'occurrences.

```python depart
def frequences(t):
    ...
```

```python tests
assert frequences(["a", "b", "a"]) == {"a": 2, "b": 1}, "lettres"
assert frequences([]) == {}, "liste vide"
assert frequences([3, 3, 3]) == {3: 3}, "un seul élément répété"
assert frequences([1, 2, 1, 3, 2, 1]) == {1: 3, 2: 2, 3: 1}, "nombres"
```

:::corrige
```python solution
def frequences(t):
    compte = {}
    for x in t:
        compte[x] = compte.get(x, 0) + 1
    return compte
```
Python fournit aussi `collections.Counter(t)`, qui fait la même chose ; à l'écrit, on attend la version à la main.
:::
::::

::::exercice[Supprimer les doublons en gardant l'ordre]{niveau=2}
Écris `sans_doublons(t)` qui renvoie une **nouvelle** liste contenant la première occurrence de chaque élément,
dans l'ordre d'origine. La liste `t` ne doit pas être modifiée, et le coût doit être linéaire (utilise un ensemble).

```python depart
def sans_doublons(t):
    ...
```

```python tests
assert sans_doublons([3, 1, 3, 2, 1]) == [3, 1, 2], "ordre conservé"
assert sans_doublons([]) == [], "liste vide"
assert sans_doublons(["a", "a", "a"]) == ["a"], "tous identiques"
t = [1, 1, 2]
sans_doublons(t)
assert t == [1, 1, 2], "la liste d'origine n'est pas modifiée"
```

:::corrige
```python solution
def sans_doublons(t):
    vus = set()
    resultat = []
    for x in t:
        if x not in vus:
            vus.add(x)
            resultat.append(x)
    return resultat
```
`list(set(t))` élimine aussi les doublons mais **ne garde pas l'ordre**. Tester `x not in resultat` (une liste)
fonctionnerait, mais avec un coût quadratique.
:::
::::

::::exercice[Moyenne par élève]{niveau=2}
On dispose d'une liste de couples `(nom, note)`. Écris `moyennes(notes)` qui renvoie un dictionnaire
nom → moyenne des notes de cet élève.

```python depart
def moyennes(notes):
    ...
```

```python tests
r = moyennes([("Léa", 12), ("Hugo", 8), ("Léa", 16), ("Hugo", 10), ("Inès", 15)])
assert r == {"Léa": 14, "Hugo": 9, "Inès": 15}, "trois élèves"
assert moyennes([]) == {}, "aucune note"
```

:::indice
Accumule d'abord, pour chaque nom, la somme et le nombre de notes (deux dictionnaires, ou un dictionnaire de listes).
:::

:::corrige
```python solution
def moyennes(notes):
    somme = {}
    nombre = {}
    for nom, note in notes:
        somme[nom] = somme.get(nom, 0) + note
        nombre[nom] = nombre.get(nom, 0) + 1
    return {nom: somme[nom] / nombre[nom] for nom in somme}
```
La dernière ligne est un **dictionnaire en compréhension**, sur le modèle des listes en compréhension.
:::
::::

::::exercice[Regrouper par longueur]{niveau=3}
Écris `par_longueur(mots)` qui renvoie un dictionnaire associant à chaque longueur la liste des mots de cette
longueur, dans leur ordre d'apparition.

```python depart
def par_longueur(mots):
    ...
```

```python tests
assert par_longueur(["le", "chat", "a", "un", "nez"]) == {2: ["le", "un"], 4: ["chat"], 1: ["a"], 3: ["nez"]}, "cas courant"
assert par_longueur([]) == {}, "liste vide"
```

:::corrige
```python solution
def par_longueur(mots):
    groupes = {}
    for m in mots:
        n = len(m)
        if n not in groupes:
            groupes[n] = []
        groupes[n].append(m)
    return groupes
```
`groupes.setdefault(n, []).append(m)` fait la même chose en une ligne.
:::
::::

::::exercice[Deux nombres de somme donnée]{niveau=3}
Écris `deux_sommes(t, cible)` qui renvoie `True` s'il existe deux éléments d'indices **différents** dont la somme
vaut `cible`. Ta solution doit faire **un seul parcours** de la liste.

```python depart
def deux_sommes(t, cible):
    ...
```

```python tests
assert deux_sommes([3, 8, 1, 5], 9) == True, "8 + 1"
assert deux_sommes([3, 8, 1, 5], 20) == False, "impossible"
assert deux_sommes([4, 2], 8) == False, "on ne prend pas deux fois le même élément"
assert deux_sommes([4, 2, 4], 8) == True, "deux 4 différents"
assert deux_sommes([], 0) == False, "liste vide"
```

:::indice
En parcourant, garde dans un ensemble les valeurs déjà vues. Pour la valeur courante `x`, quel nombre faudrait-il
avoir déjà vu ?
:::

:::corrige
```python solution
def deux_sommes(t, cible):
    vus = set()
    for x in t:
        if cible - x in vus:
            return True
        vus.add(x)
    return False
```
Pour chaque `x`, on cherche son **complément** `cible - x` parmi les éléments **précédents** (d'où l'ajout de `x`
après le test, qui évite d'utiliser deux fois le même élément). Coût moyen linéaire, contre quadratique pour la
double boucle qui teste tous les couples.
:::
::::

::::exercice[Détecter un doublon : comparer deux méthodes]{niveau=4 duree=20}
On veut savoir si une liste `t` de `n` entiers contient deux fois la même valeur. On propose deux fonctions.

```python
def doublon_a(t):
    for i in range(len(t)):
        for j in range(i + 1, len(t)):
            if t[i] == t[j]:
                return True
    return False

def doublon_b(t):
    vus = set()
    for x in t:
        if x in vus:
            return True
        vus.add(x)
    return False
```

1. Justifie que les deux fonctions sont correctes.
2. Compte, pour `doublon_a`, le nombre de comparaisons `t[i] == t[j]` dans le pire cas. Quel est ce pire cas ?
3. Quel est le coût de `doublon_b` ? Précise l'hypothèse sur laquelle repose ton estimation, et la mémoire utilisée.
4. Propose une troisième méthode n'utilisant qu'une mémoire supplémentaire constante (en dehors de la liste), en
   acceptant de modifier `t`, et donne son coût.

:::criteres
- `doublon_a` examine chaque paire `{i, j}` avec `i < j` exactement une fois : elle répond `True` si et seulement si une paire d'éléments égaux existe.
- `doublon_b` : invariant « `vus` contient les éléments déjà parcourus » ; un doublon est détecté au moment de sa deuxième occurrence.
- Pire cas de `doublon_a` : aucun doublon (ou doublon dans la dernière paire) ; nombre de comparaisons $n(n-1)/2$, donc coût quadratique.
- `doublon_b` : au plus `n` tests d'appartenance et `n` ajouts, chacun en temps constant **en moyenne** grâce au hachage, donc coût linéaire en moyenne ; mémoire supplémentaire proportionnelle à `n`.
- Troisième méthode : trier `t` (par exemple `t.sort()`), puis comparer chaque élément à son voisin ; coût de l'ordre de $n \log n$, mémoire supplémentaire faible.
:::

:::corrige
1. `doublon_a` parcourt toutes les paires d'indices `i < j` : elle renvoie `True` dès qu'une paire a deux valeurs
   égales, et `False` seulement après avoir examiné toutes les paires, donc seulement s'il n'y a aucun doublon.
   `doublon_b` maintient l'invariant « `vus` est l'ensemble des éléments déjà parcourus » : quand on rencontre `x`
   déjà dans `vus`, c'est qu'une occurrence précédente existe (doublon) ; si on termine, aucun élément n'a été vu
   deux fois.
2. Pour `i` fixé, la boucle interne fait `n - 1 - i` comparaisons. Dans le pire cas (aucun doublon), on obtient
   $\sum_{i=0}^{n-1} (n-1-i) = \frac{n(n-1)}{2}$ comparaisons : coût **quadratique**.
3. `doublon_b` fait au plus `n` tests `x in vus` et `n` ajouts. Un `set` étant une table de hachage, chacune de ces
   opérations prend un temps **constant en moyenne** (hypothèse : la fonction de hachage répartit bien les valeurs,
   peu de collisions). Le coût est donc **linéaire en moyenne**. En contrepartie, la mémoire supplémentaire est
   proportionnelle à `n` (l'ensemble).
4. On trie la liste en place, puis deux valeurs égales sont forcément voisines :
   ```python
   def doublon_c(t):
       t.sort()
       for i in range(len(t) - 1):
           if t[i] == t[i + 1]:
               return True
       return False
   ```
   Le tri coûte de l'ordre de $n \log n$ comparaisons, le parcours `n - 1` : coût total en $n \log n$, sans
   structure auxiliaire (mais la liste d'origine est modifiée, ce qu'il faut signaler dans la spécification).
:::
::::
