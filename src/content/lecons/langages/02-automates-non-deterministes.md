---
titre: Automates non déterministes et déterminisation
resume: Les automates finis non déterministes (plusieurs transitions possibles, transitions spontanées), leur exécution par ensembles d'états, la construction des sous-ensembles qui les rend déterministes, et son coût.
duree: 65
objectifs:
  - Lire un automate non déterministe et décider si un mot est accepté (existence d'un chemin acceptant)
  - Simuler un automate non déterministe en suivant l'ensemble des états possibles
  - Déterminiser un automate par la construction des sous-ensembles
  - Expliquer l'explosion possible du nombre d'états et l'intérêt pratique du non-déterminisme
prerequis: [langages/automates]
programme: [m-automates, nsit-langages]
cartes:
  - q: Qu'est-ce qu'un automate fini non déterministe (AFN) ?
    r: "Un automate où, depuis un état et pour une lettre, il peut y avoir **plusieurs** transitions (ou aucune), et éventuellement des transitions spontanées $\\varepsilon$ ; il peut avoir plusieurs états initiaux."
  - q: Quand un AFN accepte-t-il un mot ?
    r: "S'il **existe au moins un** chemin étiqueté par le mot qui va d'un état initial à un état acceptant (les autres chemins peuvent échouer)."
  - q: Comment simuler efficacement un AFN ?
    r: "En suivant l'**ensemble** des états où l'automate peut se trouver : on part des états initiaux, et chaque lettre transforme l'ensemble courant en l'ensemble des états atteignables. Le mot est accepté si l'ensemble final contient un état acceptant."
  - q: La construction des sous-ensembles ?
    r: "Elle déterminise un AFN : chaque état de l'AFD est un **ensemble** d'états de l'AFN (ceux atteints par le même préfixe) ; on ne construit que les ensembles accessibles depuis l'ensemble initial."
  - q: Combien d'états peut avoir l'automate déterminisé ?
    r: "Jusqu'à $2^n$ pour un AFN à $n$ états. Exemple : « la $k$-ième lettre avant la fin est un $a$ » : AFN à $k+1$ états, mais tout AFD en a au moins $2^k$."
  - q: AFN et AFD reconnaissent-ils les mêmes langages ?
    r: "Oui (théorème de Rabin et Scott, 1959) : tout langage reconnu par un AFN l'est par un AFD, obtenu par déterminisation. Le non-déterminisme n'ajoute pas de puissance, seulement de la concision."
---

Construire un automate déterministe pour « les mots dont l'avant-dernière lettre est un $a$ » oblige à réfléchir : il faut se souvenir des **deux**
dernières lettres. Il serait plus simple de dire : « lis le mot ; à un moment, **devine** que tu es sur l'avant-dernière lettre, vérifie que c'est un $a$,
puis qu'il ne reste qu'une lettre ». C'est l'idée du **non-déterminisme** : autoriser plusieurs choix, et accepter si **l'un** d'eux réussit. Ces automates
sont plus faciles à construire, et l'on sait les transformer en automates déterministes.

## 1. Le non-déterminisme

:::definition
Un **automate fini non déterministe** (AFN) est comme un AFD, sauf que :
- depuis un état et pour une lettre, il peut y avoir **zéro, une ou plusieurs** transitions ($\delta(q, x)$ est un **ensemble** d'états) ;
- il peut avoir **plusieurs** états initiaux, et des **$\varepsilon$-transitions** (changement d'état sans lire de lettre).

Un mot est **accepté** s'il **existe** un chemin qui le lit, partant d'un état initial et finissant dans un état acceptant.
:::

```mermaid legende="AFN des mots sur {a, b} dont l'avant-dernière lettre est un a"
stateDiagram-v2
  direction LR
  [*] --> p0
  p0 --> p0 : a, b
  p0 --> p1 : a
  p1 --> p2 : a, b
  p2 --> [*]
```

Depuis $p_0$, en lisant $a$, l'automate peut **rester** en $p_0$ ou **parier** que ce $a$ est l'avant-dernière lettre et passer en $p_1$. Pour `bab`, le
chemin $p_0 \xrightarrow{b} p_0 \xrightarrow{a} p_1 \xrightarrow{b} p_2$ réussit : accepté. Pour `abb`, aucun chemin n'aboutit en $p_2$ à la fin : refusé.

## 2. Simuler par ensembles d'états

Essayer tous les chemins un par un serait exponentiel. On fait mieux : on suit **l'ensemble** des états où l'automate **pourrait** être. On part de
l'ensemble des états initiaux ; chaque lettre transforme l'ensemble courant en l'ensemble de tous les successeurs.

```python exec
transitions = {("p0", "a"): {"p0", "p1"}, ("p0", "b"): {"p0"},
               ("p1", "a"): {"p2"}, ("p1", "b"): {"p2"}}
initiaux, acceptants = {"p0"}, {"p2"}

def accepte(mot, trace=False):
    courant = set(initiaux)
    for lettre in mot:
        courant = set().union(*(transitions.get((q, lettre), set()) for q in courant))
        if trace:
            print(f"  après {lettre!r} : {sorted(courant)}")
    return bool(courant & acceptants)

print(accepte("bab", trace=True))
print(accepte("abb", trace=True))
```

Le coût par lettre est proportionnel au nombre d'états (au plus $n$ états dans l'ensemble) : la simulation est **polynomiale**, en $O(|\text{mot}| \times n^2)$
au pire. C'est ainsi que certains moteurs d'expressions rationnelles fonctionnent.

## 3. La déterminisation

La simulation précédente suggère la construction : un ensemble d'états de l'AFN devient **un** état d'un AFD. C'est la **construction des
sous-ensembles** (Rabin et Scott, 1959).

:::methode[Déterminiser un AFN]
1. L'état initial de l'AFD est l'ensemble des états initiaux de l'AFN.
2. Pour chaque ensemble $E$ déjà construit et chaque lettre $x$, l'état atteint est $\delta(E, x) = \bigcup_{q \in E} \delta(q, x)$ ; s'il est nouveau, on l'ajoute.
3. On s'arrête quand plus aucun ensemble nouveau n'apparaît. Les états acceptants de l'AFD sont les ensembles qui **contiennent** un état acceptant.
(Avec des $\varepsilon$-transitions, on remplace chaque ensemble par sa **clôture** : tous les états atteignables par des $\varepsilon$-transitions.)
:::

| état de l'AFD | lire $a$ | lire $b$ | acceptant ? |
|---|---|---|---|
| $\{p_0\}$ | $\{p_0, p_1\}$ | $\{p_0\}$ | non |
| $\{p_0, p_1\}$ | $\{p_0, p_1, p_2\}$ | $\{p_0, p_2\}$ | non |
| $\{p_0, p_1, p_2\}$ | $\{p_0, p_1, p_2\}$ | $\{p_0, p_2\}$ | oui |
| $\{p_0, p_2\}$ | $\{p_0, p_1\}$ | $\{p_0\}$ | oui |

On obtient un AFD à 4 états, qui retient en fait les deux dernières lettres lues.

## 4. Le prix de la déterminisation

Un AFN à $n$ états a $2^n$ ensembles d'états possibles : l'AFD peut en avoir jusqu'à $2^n$. Ce n'est pas qu'une borne : pour « la $k$-ième lettre avant la fin
est un $a$ », l'AFN a $k + 1$ états, mais **tout** AFD en a au moins $2^k$ (il doit retenir les $k$ dernières lettres : deux suites différentes de $k$ lettres
diffèrent à une position $i$, et en ajoutant $i - 1$ lettres, l'une doit être acceptée et pas l'autre).

D'où le compromis des outils : déterminiser à l'avance donne une lecture ultra-rapide (une transition par lettre) mais peut coûter beaucoup de mémoire ;
simuler l'AFN économise la mémoire mais coûte plus par lettre.

:::prof
Le non-déterminisme est une notion délicate : il ne s'agit pas d'un automate « aléatoire », mais d'un automate qui accepte si **un** choix réussit. L'image
du « clonage » (à chaque choix, l'automate se duplique et toutes les copies avancent ensemble) aide à comprendre la simulation par ensembles. La même
idée revient en calculabilité et en complexité (la classe NP).
:::

## Exemple guidé

**Problème.** Programmer la construction des sous-ensembles et vérifier, sur tous les mots courts, que l'AFD obtenu reconnaît le même langage que l'AFN.

```python exec
from itertools import product

def determiniser(alphabet, transitions, initiaux, acceptants):
    depart = frozenset(initiaux)
    etats, delta, a_traiter = {depart}, {}, [depart]
    while a_traiter:
        E = a_traiter.pop()
        for x in alphabet:
            F = frozenset(q2 for q in E for q2 in transitions.get((q, x), ()))
            delta[(E, x)] = F
            if F not in etats:
                etats.add(F)
                a_traiter.append(F)
    finaux = {E for E in etats if E & set(acceptants)}
    return etats, delta, depart, finaux

transitions = {("p0", "a"): {"p0", "p1"}, ("p0", "b"): {"p0"},
               ("p1", "a"): {"p2"}, ("p1", "b"): {"p2"}}
etats, delta, depart, finaux = determiniser("ab", transitions, {"p0"}, {"p2"})
print(len(etats), "états :", [sorted(E) for E in etats])

def accepte_afd(mot):
    E = depart
    for x in mot:
        E = delta[(E, x)]
    return E in finaux

mots = ["".join(p) for n in range(9) for p in product("ab", repeat=n)]
print(all(accepte_afd(m) == (len(m) >= 2 and m[-2] == "a") for m in mots))
```

Les états de l'AFD sont des `frozenset` (ensembles non modifiables, donc utilisables comme clés de dictionnaire). Seuls les ensembles **accessibles** sont
construits : ici 4 sur les $2^3 = 8$ possibles.

## L'essentiel

- AFN : plusieurs transitions possibles (ou aucune), plusieurs initiaux, $\varepsilon$-transitions ; accepte s'il **existe** un chemin acceptant.
- Simulation : suivre l'**ensemble** des états possibles ; coût polynomial.
- **Construction des sous-ensembles** : états de l'AFD = ensembles d'états de l'AFN accessibles ; acceptant s'il contient un état acceptant ; clôture pour les $\varepsilon$.
- AFN et AFD reconnaissent les mêmes langages (Rabin-Scott), mais l'AFD peut avoir $2^n$ états (« $k$-ième lettre avant la fin »).

## Exercices

::::exercice[Accepter dans un AFN]{niveau=1}
Dans l'AFN « avant-dernière lettre $a$ » de la leçon, combien de chemins différents lisent le mot `aab` depuis $p_0$ (en comptant ceux qui échouent ou se
bloquent en route) ?

- [ ] 1
- [ ] 2
- [x] 3
- [ ] 4

:::corrige
Au premier `a` : rester en $p_0$ ou aller en $p_1$. Depuis $p_1$, le deuxième `a` mène en $p_2$, d'où le `b` bloque (1 chemin bloqué). Depuis $p_0$, le deuxième
`a` : rester en $p_0$ (puis `b` → $p_0$, refus) ou aller en $p_1$ (puis `b` → $p_2$, **succès**). Trois chemins, dont un acceptant : le mot est accepté.
:::
::::

::::exercice[Nombre d'états]{niveau=1}
Un AFN a 5 états. Combien d'états, au plus, a l'automate déterministe obtenu par la construction des sous-ensembles ?

- [ ] 5
- [ ] 10
- [ ] 25
- [x] 32

:::corrige
Chaque état de l'AFD est une partie de l'ensemble des 5 états : au plus $2^5 = 32$ (en comptant l'ensemble vide, qui joue le rôle d'état puits). En pratique,
on n'en construit souvent qu'une petite partie (les accessibles).
:::
::::

::::exercice[Simuler un AFN]{niveau=2}
Écris `accepte_afn(afn, mot)` où `afn` est un dictionnaire avec les clés `"initiaux"` (ensemble), `"acceptants"` (ensemble) et `"transitions"`
(dictionnaire `(état, lettre) → ensemble d'états`, transitions absentes = aucun successeur).

```python depart
def accepte_afn(afn, mot):
    ...
```

```python tests
contient_aba = {"initiaux": {0}, "acceptants": {3},
                "transitions": {(0, "a"): {0, 1}, (0, "b"): {0}, (1, "b"): {2}, (2, "a"): {3},
                                (3, "a"): {3}, (3, "b"): {3}}}
assert accepte_afn(contient_aba, "bbabab"), "contient aba"
assert not accepte_afn(contient_aba, "abba"), "ne contient pas aba"
assert not accepte_afn(contient_aba, ""), "mot vide"
deux_initiaux = {"initiaux": {"x", "y"}, "acceptants": {"x"}, "transitions": {("y", "a"): {"x"}}}
assert accepte_afn(deux_initiaux, "") and accepte_afn(deux_initiaux, "a"), "plusieurs états initiaux"
```

:::corrige
```python solution
def accepte_afn(afn, mot):
    courant = set(afn["initiaux"])
    for lettre in mot:
        suivant = set()
        for q in courant:
            suivant |= afn["transitions"].get((q, lettre), set())
        courant = suivant
        if not courant:
            return False                 # tous les chemins sont bloqués
    return bool(courant & afn["acceptants"])
```
L'ensemble courant contient **tous** les états atteignables : il n'y a jamais de retour en arrière. Si l'ensemble devient vide, aucun chemin ne peut plus
réussir et l'on s'arrête tôt.
:::
::::

::::exercice[Déterminiser]{niveau=3}
Écris `determiniser(afn, alphabet)` (représentation de l'exercice précédent) qui renvoie un AFD sous la forme d'un dictionnaire avec les clés `"initial"`
(un `frozenset`), `"acceptants"` (ensemble de `frozenset`) et `"transitions"` (`(frozenset, lettre) → frozenset`), ne contenant que les états accessibles.

```python depart
def determiniser(afn, alphabet):
    ...
```

```python tests
from itertools import product
def accepte_afd(afd, mot):
    e = afd["initial"]
    for l in mot:
        e = afd["transitions"][(e, l)]
    return e in afd["acceptants"]
def kieme(k):          # la k-ième lettre avant la fin est un a
    t = {(0, "a"): {0, 1}, (0, "b"): {0}}
    for i in range(1, k):
        t[(i, "a")] = {i + 1}
        t[(i, "b")] = {i + 1}
    return {"initiaux": {0}, "acceptants": {k}, "transitions": t}
resultats = {}
for k in (1, 2, 3, 4):
    d = determiniser(kieme(k), "ab")
    mots = ["".join(p) for n in range(k + 4) for p in product("ab", repeat=n)]
    meme_langage = all(accepte_afd(d, m) == (len(m) >= k and m[-k] == "a") for m in mots)
    etats = {d["initial"]} | {e for (e, _) in d["transitions"]} | set(d["transitions"].values())
    resultats[k] = (meme_langage, len(etats))
assert all(ok for ok, _ in resultats.values()), "même langage que l'AFN (k = 1 à 4)"
assert [n for _, n in resultats.values()] == [2, 4, 8, 16], "2^k états accessibles"
assert determiniser({"initiaux": {0}, "acceptants": {0}, "transitions": {}}, "ab")["acceptants"] == {frozenset({0})}, "AFN sans transition"
```

:::corrige
```python solution
def determiniser(afn, alphabet):
    initial = frozenset(afn["initiaux"])
    vus, transitions, pile = {initial}, {}, [initial]
    while pile:
        E = pile.pop()
        for x in alphabet:
            F = frozenset(q2 for q in E for q2 in afn["transitions"].get((q, x), ()))
            transitions[(E, x)] = F
            if F not in vus:
                vus.add(F)
                pile.append(F)
    acceptants = {E for E in vus if E & afn["acceptants"]}
    return {"initial": initial, "acceptants": acceptants, "transitions": transitions}
```
Le test vérifie à la fois le **langage** (sur tous les mots courts) et l'**explosion** : pour « la $k$-ième lettre avant la fin », l'AFN a $k + 1$ états et l'AFD
exactement $2^k$ états accessibles — chacun correspond à une suite possible des $k$ dernières lettres (l'ensemble vide n'est jamais atteint car $p_0$ boucle
sur toutes les lettres).
:::
::::

::::exercice[Concevoir avec le non-déterminisme]{niveau=4 duree=20}
On veut reconnaître les mots sur $\{a, b\}$ qui **contiennent** le facteur `abab` **ou** se terminent par `bb`.

1. Construisez un AFN simple pour chacun des deux langages, puis un AFN pour leur union (sans déterminiser).
2. Combien d'états a votre AFN ? Déterminisez-le en partie : donnez les premiers états de l'AFD obtenu.
3. Pourquoi, en pratique, les outils de recherche (comme `grep`) construisent-ils d'abord un automate non déterministe à partir d'une expression rationnelle ?

:::criteres
- AFN « contient abab » : 5 états avec boucle initiale sur a, b et boucle finale ; AFN « finit par bb » : 3 états ; union : réunir les deux automates avec deux états initiaux (ou un nouvel état initial et des ε-transitions).
- Décompte correct des états et début de construction des sous-ensembles cohérent (ensemble initial, transitions sur a et b).
- Pratique : la traduction expression → AFN (Thompson) est directe et linéaire en taille ; l'AFD peut être exponentiel, on le construit à la demande ou on simule l'AFN.
:::

:::corrige
1. « Contient `abab` » : états $c_0$ à $c_4$, $c_0$ initial boucle sur $a$ et $b$, puis $c_0 \xrightarrow{a} c_1 \xrightarrow{b} c_2 \xrightarrow{a} c_3 \xrightarrow{b} c_4$,
   et $c_4$ acceptant boucle sur $a, b$. « Finit par `bb` » : $f_0$ initial boucle sur $a, b$, $f_0 \xrightarrow{b} f_1 \xrightarrow{b} f_2$, $f_2$ acceptant. **Union** :
   on met les deux automates côte à côte, avec **deux états initiaux** $c_0$ et $f_0$ et les acceptants $c_4$ et $f_2$ (ou un nouvel état initial relié par
   $\varepsilon$ à $c_0$ et $f_0$). Un mot est accepté si l'une des deux parties l'accepte.
2. 8 états. Construction des sous-ensembles : initial $\{c_0, f_0\}$ ; avec $a$ : $\{c_0, c_1, f_0\}$ ; avec $b$ : $\{c_0, f_0, f_1\}$ ; depuis $\{c_0, c_1, f_0\}$ avec $b$ :
   $\{c_0, c_2, f_0, f_1\}$ ; depuis $\{c_0, f_0, f_1\}$ avec $b$ : $\{c_0, f_0, f_1, f_2\}$ (acceptant)… On poursuit jusqu'à ce qu'aucun ensemble nouveau n'apparaisse.
3. Une expression rationnelle se traduit **mécaniquement** en AFN (construction de Thompson), avec un nombre d'états proportionnel à sa longueur ; la
   déterminiser d'emblée pourrait coûter un nombre exponentiel d'états. Les outils simulent donc l'AFN, ou construisent l'AFD **à la demande** (seulement les
   états rencontrés sur le texte lu) et les gardent en cache : on combine la concision de l'AFN et la vitesse de l'AFD.
:::
::::
