---
titre: Logique des propositions
resume: Propositions et connecteurs, tables de vérité, tautologies et équivalences (De Morgan, contraposée), formes normales, satisfiabilité, et quantificateurs avec leur négation.
duree: 65
objectifs:
  - Construire la table de vérité d'une formule et reconnaître une tautologie, une contradiction, une formule satisfiable
  - Utiliser les équivalences usuelles (De Morgan, implication, contraposée, distributivité) pour transformer une formule
  - Mettre une formule sous forme normale disjonctive ou conjonctive
  - Nier correctement une phrase avec des quantificateurs
prerequis: [architecture/circuits]
programme: [m-logique, nsi1-base, nsi1-langages]
cartes:
  - q: Table de vérité de $p \Rightarrow q$ ?
    r: "Fausse seulement quand $p$ est vraie et $q$ fausse ; vraie dans les trois autres cas (en particulier quand $p$ est fausse : « le faux implique n'importe quoi »)."
  - q: "$p \\Rightarrow q$ équivaut à… ?"
    r: "$\\neg p \\lor q$, et aussi à sa **contraposée** $\\neg q \\Rightarrow \\neg p$. Attention : pas à sa réciproque $q \\Rightarrow p$."
  - q: Négation de $p \Rightarrow q$ ?
    r: "$p \\land \\neg q$ : « $p$ est vraie et pourtant $q$ est fausse » (un contre-exemple)."
  - q: Tautologie, contradiction, satisfiable ?
    r: "Tautologie : vraie pour toutes les valeurs des variables ; contradiction : toujours fausse ; satisfiable : vraie pour au moins une valuation."
  - q: Négation de « pour tout $x$, $P(x)$ » ?
    r: "« Il existe $x$ tel que non $P(x)$ » : $\\neg (\\forall x, P(x)) \\equiv \\exists x, \\neg P(x)$. Et $\\neg (\\exists x, P(x)) \\equiv \\forall x, \\neg P(x)$."
  - q: Forme normale conjonctive (FNC) ?
    r: "Une conjonction (ET) de clauses, chaque clause étant une disjonction (OU) de littéraux (variables ou leurs négations) : $(a \\lor \\neg b) \\land (b \\lor c)$."
  - q: Qu'est-ce que le problème SAT ?
    r: "Décider si une formule (en FNC) est satisfiable. On ne connaît pas d'algorithme en temps polynomial (problème NP-complet) ; la recherche exhaustive essaie $2^n$ valuations."
---

Les conditions des programmes (`if age >= 18 and not suspendu`), les requêtes SQL (`WHERE ... AND ... OR ...`), les circuits du processeur et
les preuves d'algorithmes reposent sur la même logique : celle des **propositions**, énoncés qui sont vrais ou faux. La maîtriser évite des
erreurs très concrètes (une condition mal niée, une boucle qui ne s'arrête pas) et donne le vocabulaire des preuves.

## 1. Propositions et connecteurs

Une **proposition** est un énoncé vrai (V, 1) ou faux (F, 0). On les combine avec des **connecteurs** :

| $p$ | $q$ | $\neg p$ | $p \land q$ | $p \lor q$ | $p \Rightarrow q$ | $p \Leftrightarrow q$ |
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| 0 | 0 | 1 | 0 | 0 | 1 | 1 |
| 0 | 1 | 1 | 0 | 1 | 1 | 0 |
| 1 | 0 | 0 | 0 | 1 | 0 | 0 |
| 1 | 1 | 0 | 1 | 1 | 1 | 1 |

:::attention[L'implication]
$p \Rightarrow q$ n'est fausse que si $p$ est vraie et $q$ fausse. « S'il pleut, je prends mon parapluie » n'est pas contredit les jours où il ne
pleut pas. Le OU logique est **inclusif** : $p \lor q$ est vraie quand les deux sont vraies (le « ou exclusif » se note $\oplus$).
:::

```python exec
from itertools import product

def table(formule, variables):
    print(" ".join(variables), "| résultat")
    for valeurs in product([False, True], repeat=len(variables)):
        env = dict(zip(variables, valeurs))
        print(" ".join(str(int(v)) for v in valeurs), "|", int(formule(**env)))

implique = lambda a, b: (not a) or b
# (p ⇒ q) ∧ p ⇒ q : le modus ponens
table(lambda p, q: implique(implique(p, q) and p, q), ["p", "q"])
```

Une formule toujours vraie est une **tautologie** (comme le *modus ponens* ci-dessus), toujours fausse une **contradiction** ; une formule vraie
pour au moins une valuation est **satisfiable**. Deux formules sont **équivalentes** ($\equiv$) si elles ont la même table de vérité.

## 2. Les équivalences à connaître

| Équivalence | Nom |
|---|---|
| $\neg \neg p \equiv p$ | double négation |
| $\neg (p \land q) \equiv \neg p \lor \neg q$ et $\neg (p \lor q) \equiv \neg p \land \neg q$ | lois de De Morgan |
| $p \land (q \lor r) \equiv (p \land q) \lor (p \land r)$ et $p \lor (q \land r) \equiv (p \lor q) \land (p \lor r)$ | distributivités |
| $p \Rightarrow q \equiv \neg p \lor q$ | implication |
| $p \Rightarrow q \equiv \neg q \Rightarrow \neg p$ | contraposée |
| $\neg (p \Rightarrow q) \equiv p \land \neg q$ | négation de l'implication |
| $p \Leftrightarrow q \equiv (p \Rightarrow q) \land (q \Rightarrow p)$ | double implication |

:::methode[Nier une condition de programme]
La boucle `while i < n and t[i] != x:` s'arrête quand $\neg(i < n \land t[i] \ne x)$, c'est-à-dire, par De Morgan, quand $i \ge n \lor t[i] = x$ :
on a soit parcouru tout le tableau, soit trouvé $x$. C'est exactement ce qu'on écrit pour prouver la recherche séquentielle.
:::

## 3. Formes normales

Toute formule est équivalente à une **forme normale disjonctive** (FND : un OU de ET de littéraux) et à une **forme normale conjonctive** (FNC :
un ET de OU de littéraux). On lit la FND sur la table de vérité : un terme par ligne où la formule vaut 1.

```python exec
from itertools import product

def fnd(formule, variables):
    termes = []
    for valeurs in product([False, True], repeat=len(variables)):
        if formule(*valeurs):
            litteraux = [v if b else "¬" + v for v, b in zip(variables, valeurs)]
            termes.append("(" + " ∧ ".join(litteraux) + ")")
    return " ∨ ".join(termes) if termes else "⊥"

print(fnd(lambda p, q: p != q, ["p", "q"]))          # ou exclusif
print(fnd(lambda a, b, c: (a and b) or c, ["a", "b", "c"]))
```

La FND obtenue ainsi est souvent longue ; on la **simplifie** avec les équivalences (comme pour les circuits). La FNC est la forme d'entrée des
solveurs **SAT**, qui décident si une formule est satisfiable. On ne connaît pas d'algorithme efficace dans le pire cas (SAT est le premier
problème démontré **NP-complet**, par Cook en 1971), mais les solveurs modernes traitent des millions de clauses en pratique.

## 4. Quantificateurs

Dès qu'un énoncé dépend d'une variable (« $x$ est pair »), on parle de **prédicat** $P(x)$. Les **quantificateurs** en font des propositions :
$\forall x \in E,\ P(x)$ (« pour tout ») et $\exists x \in E,\ P(x)$ (« il existe »).

:::retenir[Nier une phrase quantifiée]
On échange $\forall$ et $\exists$ et on nie la propriété :
$\neg(\forall x, P(x)) \equiv \exists x, \neg P(x)$ et $\neg(\exists x, P(x)) \equiv \forall x, \neg P(x)$.
« Tous les élèves ont rendu le devoir » a pour négation « **au moins un** élève n'a pas rendu le devoir » — et non « aucun élève n'a rendu le
devoir ». L'ordre des quantificateurs compte : $\forall x, \exists y, y > x$ (vrai dans $\mathbb{N}$) n'est pas $\exists y, \forall x, y > x$ (faux).
:::

En Python, `all(P(x) for x in E)` et `any(P(x) for x in E)` sont les quantificateurs sur un ensemble fini ; `not all(...)` équivaut à
`any(not ...)`.

:::prof
En NSI, la logique apparaît dans les booléens (première), les conditions et les opérateurs paresseux (`and`, `or` évaluent de gauche à droite et
s'arrêtent dès que le résultat est connu), les requêtes SQL et les preuves (terminale). L'erreur la plus fréquente des élèves est la négation
d'une condition composée (`not (a and b)` lu comme `not a and not b`) : faire vérifier par une table de vérité en Python est très efficace.
:::

## Exemple guidé

**Problème.** Simplifier la condition `not (x < 0 or x > 100) and not (x >= 50 and x != 75)` et dire quelles valeurs entières la vérifient.

**1. De Morgan sur chaque parenthèse.** $\neg(x < 0 \lor x > 100) \equiv x \ge 0 \land x \le 100$ ; $\neg(x \ge 50 \land x \ne 75) \equiv x < 50 \lor x = 75$.

**2. Distribuer.** $(0 \le x \le 100) \land (x < 50 \lor x = 75) \equiv (0 \le x < 50) \lor (x = 75)$.

**3. Vérifier par l'exhaustivité** sur un intervalle qui contient tous les cas :

```python exec
originale = lambda x: not (x < 0 or x > 100) and not (x >= 50 and x != 75)
simplifiee = lambda x: 0 <= x < 50 or x == 75
print(all(originale(x) == simplifiee(x) for x in range(-50, 200)))
print([x for x in range(-5, 120) if simplifiee(x)][-5:])
```

Les valeurs acceptées sont les entiers de 0 à 49, et 75. La version simplifiée est plus lisible **et** plus facile à tester (deux cas, des bornes).

## L'essentiel

- Connecteurs $\neg, \land, \lor, \Rightarrow, \Leftrightarrow$ ; $p \Rightarrow q$ n'est faux que pour $p$ vrai et $q$ faux ; OU inclusif.
- Tautologie, contradiction, satisfiable ; équivalence = même table de vérité.
- De Morgan, distributivités, $p \Rightarrow q \equiv \neg p \lor q \equiv \neg q \Rightarrow \neg p$ (contraposée), $\neg(p \Rightarrow q) \equiv p \land \neg q$.
- FND (OU de ET, lue sur la table) et FNC (ET de OU, entrée des solveurs SAT ; SAT est NP-complet).
- Quantificateurs : $\neg \forall \equiv \exists \neg$, $\neg \exists \equiv \forall \neg$ ; l'ordre compte ; `all` / `any` en Python.

## Exercices

::::exercice[Négation d'une implication]{niveau=1}
Quelle est la négation de « si un nombre est divisible par 4, alors il est pair » ?

- [ ] Si un nombre n'est pas divisible par 4, alors il n'est pas pair
- [ ] Si un nombre est pair, alors il est divisible par 4
- [x] Il existe un nombre divisible par 4 qui n'est pas pair
- [ ] Aucun nombre divisible par 4 n'est pair

:::corrige
L'énoncé est « pour tout $n$, $D(n) \Rightarrow P(n)$ ». Sa négation : « il existe $n$ tel que $\neg(D(n) \Rightarrow P(n))$ », soit $D(n) \land \neg P(n)$.
La première proposition est la **contraposée** de la réciproque ; la deuxième est la **réciproque** ; aucune n'est la négation.
:::
::::

::::exercice[Contraposée]{niveau=1}
Quelle phrase est équivalente à « si le programme termine, alors la boucle a été exécutée au plus $n$ fois » ?

- [ ] si la boucle a été exécutée au plus $n$ fois, alors le programme termine
- [x] si la boucle a été exécutée plus de $n$ fois, alors le programme ne termine pas
- [ ] si le programme ne termine pas, alors la boucle a été exécutée plus de $n$ fois
- [ ] le programme termine et la boucle a été exécutée au plus $n$ fois

:::corrige
La contraposée de $p \Rightarrow q$ est $\neg q \Rightarrow \neg p$ : « non (au plus $n$ fois) ⇒ non (termine) ». La première est la réciproque, la troisième
la réciproque de la contraposée (équivalente à la réciproque), la dernière une conjonction.
:::
::::

::::exercice[Tautologie ou non ?]{niveau=2}
Écris `classer(formule, n)` qui renvoie `"tautologie"`, `"contradiction"` ou `"satisfiable"` (satisfiable mais pas tautologie) pour une
fonction booléenne de `n` variables.

```python depart
from itertools import product

def classer(formule, n):
    ...
```

```python tests
imp = lambda a, b: (not a) or b
assert classer(lambda p: p or not p, 1) == "tautologie", "tiers exclu"
assert classer(lambda p: p and not p, 1) == "contradiction", "contradiction"
assert classer(lambda p, q: imp(p, q), 2) == "satisfiable", "implication"
assert classer(lambda p, q: imp(p, q) == imp(not q, not p), 2) == "tautologie", "contraposée"
assert classer(lambda p, q: imp(p, q) == imp(q, p), 2) == "satisfiable", "réciproque : pas équivalente"
```

:::corrige
```python solution
from itertools import product

def classer(formule, n):
    valeurs = [bool(formule(*v)) for v in product([False, True], repeat=n)]
    if all(valeurs):
        return "tautologie"
    if not any(valeurs):
        return "contradiction"
    return "satisfiable"
```
On examine les $2^n$ lignes de la table : `all` pour la tautologie, `not any` pour la contradiction. Le dernier test montre que l'implication et sa
réciproque ne sont pas équivalentes (la formule « elles sont égales » n'est pas une tautologie).
:::
::::

::::exercice[Évaluer une formule en FNC]{niveau=2}
Une formule en FNC est représentée par une liste de clauses ; chaque clause est une liste d'entiers non nuls : `3` signifie $x_3$ et `-3` signifie
$\neg x_3$. Écris `evaluer(fnc, valuation)` où `valuation` est un dictionnaire `{numéro: booléen}`.

```python depart
def evaluer(fnc, valuation):
    ...
```

```python tests
f = [[1, -2], [2, 3], [-1, -3]]            # (x1 ∨ ¬x2) ∧ (x2 ∨ x3) ∧ (¬x1 ∨ ¬x3)
assert evaluer(f, {1: True, 2: True, 3: False}), "satisfaite"
assert not evaluer(f, {1: True, 2: False, 3: True}), "dernière clause fausse"
assert not evaluer(f, {1: False, 2: True, 3: True}), "première clause fausse"
assert evaluer([], {}), "formule vide : vraie"
assert not evaluer([[]], {}), "clause vide : fausse"
```

:::corrige
```python solution
def evaluer(fnc, valuation):
    return all(any(valuation[abs(l)] == (l > 0) for l in clause) for clause in fnc)
```
Un littéral `l` est vrai si la variable `abs(l)` vaut `True` et `l > 0`, ou vaut `False` et `l < 0` : c'est `valuation[abs(l)] == (l > 0)`. Une FNC est un
`all` de `any`. Par convention, la conjonction vide est vraie et la disjonction vide (clause vide) est fausse. C'est le format DIMACS des solveurs SAT.
:::
::::

::::exercice[Un solveur SAT naïf]{niveau=3}
Écris `sat(fnc, n)` qui renvoie une valuation `{1: …, …, n: …}` satisfaisant la FNC (même représentation que l'exercice précédent) ou `None`
si elle est insatisfiable. Commence par la recherche exhaustive ; pour aller plus loin, élague : dès qu'une clause est fausse avec les variables
déjà fixées, inutile de continuer dans cette branche (retour sur trace).

```python depart
def sat(fnc, n):
    ...
```

```python tests
def ok(fnc, v):
    return all(any(v[abs(l)] == (l > 0) for l in c) for c in fnc)
f = [[1, -2], [2, 3], [-1, -3]]
s = sat(f, 3)
assert s is not None and ok(f, s), "satisfiable"
assert sat([[1], [-1]], 1) is None, "x1 et non x1"
g = [[1, 2], [-1, 2], [1, -2], [-1, -2]]
assert sat(g, 2) is None, "les quatre combinaisons interdites"
pigeons = [[1, 2], [3, 4], [5, 6], [-1, -3], [-1, -5], [-3, -5], [-2, -4], [-2, -6], [-4, -6]]
assert sat(pigeons, 6) is None, "3 pigeons dans 2 trous : impossible"
grand = [[i, i + 1] for i in range(1, 40)]
s = sat(grand, 40)
assert s is not None and ok(grand, s), "40 variables : il faut élaguer"
```

:::corrige
```python solution
def sat(fnc, n):
    valuation = {}

    def clause_fausse(clause):
        # fausse si tous ses littéraux sont fixés et faux
        return all(abs(l) in valuation and valuation[abs(l)] != (l > 0) for l in clause)

    def chercher(i):
        if any(clause_fausse(c) for c in fnc):
            return False
        if i > n:
            return True
        for b in (True, False):
            valuation[i] = b
            if chercher(i + 1):
                return True
            del valuation[i]
        return False

    return dict(valuation) if chercher(1) else None
```
La recherche exhaustive essaie $2^n$ valuations : $2^{40} \approx 10^{12}$ pour le dernier test, beaucoup trop. Le **retour sur trace** abandonne une
branche dès qu'une clause est entièrement fausse, ce qui ici trouve une solution immédiatement. Les vrais solveurs ajoutent la propagation
unitaire (une clause dont il ne reste qu'un littéral libre force sa valeur) et l'apprentissage de clauses. L'exemple des pigeons illustre un
principe combinatoire (le « principe des tiroirs ») que la logique propositionnelle exprime.
:::
::::

::::exercice[Logique et conditions en classe]{niveau=4 duree=20}
Un élève de première écrit, pour une boucle de saisie qui doit **recommencer** tant que la réponse n'est ni `"o"` ni `"n"` :

```python
reponse = input("Continuer (o/n) ? ")
while reponse != "o" or reponse != "n":
    reponse = input("Répondre o ou n : ")
```

1. Montrez que cette boucle ne s'arrête jamais, à l'aide d'un raisonnement logique.
2. Corrigez la condition de deux façons (directement et par De Morgan).
3. Proposez une activité qui fasse travailler aux élèves la négation des conditions composées.

:::criteres
- Démonstration : quelle que soit la réponse, elle ne peut pas être égale à la fois à "o" et à "n", donc au moins une des deux inégalités est vraie : la condition est une tautologie (sur les valeurs possibles).
- Corrections : `while reponse != "o" and reponse != "n"`, ou `while not (reponse == "o" or reponse == "n")`, ou `while reponse not in ("o", "n")` ; justification par De Morgan.
- Activité : tables de vérité, prédiction puis exécution, phrases du quotidien à nier, vérification exhaustive en Python ; production attendue explicite.
:::

:::corrige
1. Pour que la boucle s'arrête, il faudrait $\neg(r \ne o \lor r \ne n)$, c'est-à-dire (De Morgan) $r = o \land r = n$ : la réponse devrait être à la
   fois `"o"` et `"n"`, ce qui est impossible. La condition est donc toujours vraie : la boucle est infinie, même quand l'utilisateur tape `o`.
2. Ce qu'on veut : continuer tant que la réponse n'est **ni** `o` **ni** `n`, c'est-à-dire $\neg(r = o \lor r = n)$. Par De Morgan :
   $r \ne o \land r \ne n$, d'où `while reponse != "o" and reponse != "n":`. Directement : `while not (reponse == "o" or reponse == "n"):`. En
   Python idiomatique : `while reponse not in ("o", "n"):`.
3. Partir de phrases du quotidien (« je sors s'il ne pleut pas et s'il fait jour » : quand est-ce que je reste ?) à nier par écrit, puis vérifier avec
   une **table de vérité** construite à la main. Ensuite, des conditions de programmes à nier, dont on vérifie la négation **exhaustivement** en
   Python (`all(not (a and b) == (not a or not b) for a in (True, False) for b in (True, False))`). Enfin, un débogage : ce programme de saisie
   donné tel quel, avec la consigne de trouver pourquoi il ne s'arrête pas. Trace écrite : les lois de De Morgan, avec ce contre-exemple.
:::
::::
