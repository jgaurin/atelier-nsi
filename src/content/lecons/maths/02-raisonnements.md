---
titre: Raisonnements et preuves
resume: Les grandes formes de preuve — directe, par contraposée, par l'absurde, par disjonction de cas, par récurrence (simple, forte, structurelle) — et le contre-exemple, avec leurs usages en informatique.
duree: 70
objectifs:
  - Choisir et rédiger une preuve directe, par contraposée, par l'absurde ou par disjonction de cas
  - Rédiger une démonstration par récurrence simple ou forte (initialisation, hérédité, conclusion)
  - Utiliser l'induction structurelle sur des listes et des arbres
  - Distinguer vérification sur des exemples, contre-exemple et preuve
prerequis: [maths/logique]
programme: [m-logique, asd-preuve, nsit-langages]
cartes:
  - q: Preuve par contraposée ?
    r: "Pour montrer $P \\Rightarrow Q$, on montre $\\neg Q \\Rightarrow \\neg P$, qui lui est équivalente. Exemple : « si $n^2$ est pair alors $n$ est pair » se prouve en montrant « si $n$ est impair alors $n^2$ est impair »."
  - q: Preuve par l'absurde ?
    r: "On suppose le contraire de ce qu'on veut montrer et on en déduit une contradiction ; donc l'hypothèse est fausse. Exemples classiques : $\\sqrt 2$ irrationnel, infinité des nombres premiers."
  - q: Les trois étapes d'une récurrence ?
    r: "**Initialisation** : $P(n_0)$ est vraie. **Hérédité** : pour tout $n \\ge n_0$, si $P(n)$ est vraie alors $P(n+1)$ l'est. **Conclusion** : $P(n)$ est vraie pour tout $n \\ge n_0$."
  - q: Récurrence forte ?
    r: "Dans l'hérédité, on suppose $P(k)$ vraie pour **tous** les $k$ de $n_0$ à $n$ (et non seulement $P(n)$) pour montrer $P(n+1)$. Utile quand le cas $n+1$ se ramène à un cas plus petit quelconque (division, découpage)."
  - q: Induction structurelle ?
    r: "Pour prouver une propriété de tous les arbres (ou listes) : la montrer pour l'arbre vide (cas de base), puis montrer que si elle vaut pour les sous-arbres gauche et droit, elle vaut pour l'arbre construit à partir d'eux."
  - q: Combien d'exemples faut-il pour prouver « pour tout $n$ » ? Pour le réfuter ?
    r: "Aucun nombre fini d'exemples ne prouve un énoncé universel sur un ensemble infini ; **un seul contre-exemple** suffit à le réfuter."
---

Un programme qui marche sur dix tests peut échouer sur le onzième. Pour être **certain** qu'un algorithme est correct, qu'une formule de coût est
juste ou qu'un problème est impossible, il faut une **preuve**. Au concours, on attend des preuves rédigées clairement : cette leçon passe en revue
les formes de raisonnement et leur rédaction.

## 1. Preuve directe, contraposée, disjonction de cas

**Preuve directe** : on part des hypothèses et on enchaîne des déductions jusqu'à la conclusion.

> *Si $a$ et $b$ sont pairs, $a + b$ est pair.* Il existe $k, \ell$ entiers tels que $a = 2k$ et $b = 2\ell$ ; alors $a + b = 2(k + \ell)$, qui est pair.

**Par contraposée** : pour montrer $P \Rightarrow Q$, on montre $\neg Q \Rightarrow \neg P$ (équivalente, leçon précédente).

> *Si $n^2$ est pair, alors $n$ est pair.* Montrons la contraposée : si $n$ est impair, $n = 2k + 1$, et $n^2 = 4k^2 + 4k + 1 = 2(2k^2 + 2k) + 1$
> est impair.

**Par disjonction de cas** : on découpe en cas qui couvrent toutes les possibilités, et on traite chacun.

> *Pour tout entier $n$, $n(n+1)$ est pair.* Si $n$ est pair, le produit contient un facteur pair ; sinon, $n + 1$ est pair. Dans les deux cas, le produit
> est pair.

## 2. Par l'absurde

On suppose que la conclusion est **fausse**, et l'on en déduit une **contradiction** : l'hypothèse était donc impossible.

:::exemple[Il y a une infinité de nombres premiers (Euclide)]
Supposons qu'il n'y en ait qu'un nombre fini : $p_1, p_2, \dots, p_k$. Posons $N = p_1 p_2 \cdots p_k + 1$. $N > 1$ a au moins un diviseur premier $p$,
qui est l'un des $p_i$. Alors $p$ divise $p_1 \cdots p_k$ et $N$, donc leur différence, 1 : impossible. L'hypothèse est fausse.
:::

:::exemple[$\sqrt{2}$ est irrationnel]
Supposons $\sqrt 2 = \frac{a}{b}$ avec une fraction **irréductible**. Alors $a^2 = 2b^2$ : $a^2$ est pair, donc $a$ est pair (section 1), $a = 2c$.
Alors $4c^2 = 2b^2$, soit $b^2 = 2c^2$ : $b$ est pair aussi. $a$ et $b$ sont tous deux pairs : la fraction n'était pas irréductible, contradiction.
:::

En informatique, le raisonnement par l'absurde sert à prouver qu'une chose est **impossible** : l'indécidabilité du problème de l'arrêt (module
Automates et langages) en est l'exemple le plus célèbre.

## 3. Le contre-exemple, et les limites des exemples

Vérifier un énoncé sur beaucoup de cas n'est **pas** une preuve. Un seul cas où il est faux (un **contre-exemple**) suffit en revanche à le réfuter.

```python exec
def est_premier(n):
    return n >= 2 and all(n % d for d in range(2, int(n ** 0.5) + 1))

# Euler : n² + n + 41 est premier pour n = 0, 1, 2… mais pas toujours !
n = 0
while est_premier(n * n + n + 41):
    n += 1
print("premier contre-exemple : n =", n, "→", n * n + n + 41, "=", 41, "×", (n * n + n + 41) // 41)
```

L'énoncé était vrai pour les 40 premières valeurs ! L'ordinateur est en revanche un excellent outil pour **chercher** des contre-exemples ou se
forger une conviction avant de chercher une preuve.

## 4. La récurrence

Pour prouver une propriété $P(n)$ pour tout entier $n \ge n_0$ :

:::methode[Rédiger une récurrence]
1. **Énoncer** précisément la propriété $P(n)$.
2. **Initialisation** : vérifier $P(n_0)$.
3. **Hérédité** : soit $n \ge n_0$ ; **supposons** $P(n)$ (hypothèse de récurrence) et **montrons** $P(n+1)$, en utilisant l'hypothèse.
4. **Conclusion** : par récurrence, $P(n)$ est vraie pour tout $n \ge n_0$.
:::

> *Pour tout $n \ge 1$, $1 + 3 + 5 + \dots + (2n - 1) = n^2$.* Soit $P(n)$ cette égalité.
> **Initialisation** : pour $n = 1$, la somme vaut $1 = 1^2$.
> **Hérédité** : supposons $P(n)$. Alors $1 + 3 + \dots + (2n-1) + (2n+1) = n^2 + 2n + 1 = (n+1)^2$ : c'est $P(n+1)$.
> **Conclusion** : $P(n)$ est vraie pour tout $n \ge 1$.

**Récurrence forte** : dans l'hérédité, on suppose $P(k)$ pour **tous** les $k \le n$. Exemple : *tout entier $n \ge 2$ est un produit de nombres
premiers*. Si $n + 1$ est premier, c'est fini ; sinon $n + 1 = ab$ avec $2 \le a, b \le n$, et par hypothèse $a$ et $b$ sont des produits de
premiers, donc $n + 1$ aussi. C'est le raisonnement qui prouve les algorithmes « diviser pour régner » (le tri fusion trie des moitiés de taille
quelconque inférieure).

La récurrence est le pendant mathématique de la **récursivité** : la fonction récursive se ramène à un cas plus petit, la preuve aussi. Elle
sert aussi à prouver un **invariant de boucle** (la propriété vraie avant la boucle et conservée à chaque tour).

## 5. L'induction structurelle

Pour les objets **définis récursivement** (listes, arbres, formules), on raisonne sur leur **structure** : on prouve la propriété pour les cas de
base (liste vide, arbre vide), puis on montre qu'elle se transmet à l'objet construit (liste $x$ suivi de $L$, arbre de sous-arbres $G$ et $D$).

> *Un arbre binaire à $n$ nœuds a exactement $n + 1$ sous-arbres vides.* L'arbre vide a 0 nœud et 1 sous-arbre vide (lui-même). Un arbre de racine
> $r$ et de sous-arbres $G$ ($n_G$ nœuds) et $D$ ($n_D$ nœuds) a $n = 1 + n_G + n_D$ nœuds et, par hypothèse, $(n_G + 1) + (n_D + 1) = n + 1$ sous-arbres vides.

```python exec
def compter(arbre):
    """arbre : None (vide) ou (gauche, valeur, droite). Renvoie (nœuds, sous-arbres vides)."""
    if arbre is None:
        return 0, 1
    g, _, d = arbre
    ng, vg = compter(g)
    nd, vd = compter(d)
    return 1 + ng + nd, vg + vd

a = ((None, 1, None), 2, ((None, 3, None), 4, None))
print(compter(a))          # (4, 5) : n + 1 sous-arbres vides
```

:::prof
En terminale NSI, on prouve la correction et la terminaison d'algorithmes (invariants, variants) ; la récurrence n'est pas exigée des élèves,
mais le professeur doit savoir justifier ce qu'il affirme. Au concours, les sujets demandent des preuves courtes et rigoureuses : énoncer
précisément la propriété, ne pas confondre « montrer $P(n+1)$ » et « supposer $P(n+1)$ », et conclure explicitement.
:::

## Exemple guidé

**Problème.** Prouver que l'algorithme suivant renvoie bien $2^n$, pour tout entier $n \ge 0$.

```python
def puissance2(n):
    r, i = 1, 0
    while i < n:
        r, i = 2 * r, i + 1
    return r
```

**1. Trouver l'invariant.** On observe : avant chaque test de la boucle, $r = 2^i$ et $0 \le i \le n$.

**2. Le prouver par récurrence sur le nombre de tours $k$.** Après $k$ tours, $i = k$ et $r = 2^k$. *Initialisation* : avant le premier tour,
$i = 0$, $r = 1 = 2^0$. *Hérédité* : si $r = 2^i$ avant un tour, après le tour $r' = 2 \times 2^i = 2^{i+1}$ et $i' = i + 1$, donc $r' = 2^{i'}$.

**3. Conclure à la sortie.** La boucle s'arrête quand $i \ge n$ ; comme $i$ augmente de 1 à partir de 0 et $n \ge 0$, on sort avec $i = n$ exactement
(terminaison : $n - i$ diminue strictement et reste positif). L'invariant donne alors $r = 2^i = 2^n$.

```python exec
def puissance2(n):
    r, i = 1, 0
    while i < n:
        assert r == 2 ** i          # l'invariant, vérifié à l'exécution (ce n'est pas une preuve !)
        r, i = 2 * r, i + 1
    return r

print(all(puissance2(n) == 2 ** n for n in range(50)))
```

## L'essentiel

- **Directe** (hypothèses → conclusion), **contraposée** ($\neg Q \Rightarrow \neg P$), **disjonction de cas** (cas exhaustifs).
- **Absurde** : supposer le contraire, aboutir à une contradiction ($\sqrt 2$ irrationnel, infinité des premiers, problème de l'arrêt).
- Les exemples ne prouvent pas un énoncé universel ; un **contre-exemple** suffit à le réfuter ($n^2 + n + 41$ pour $n = 40$).
- **Récurrence** : initialisation, hérédité (supposer $P(n)$, montrer $P(n+1)$), conclusion ; **forte** : supposer tous les $P(k)$, $k \le n$.
- **Induction structurelle** sur listes et arbres ; lien avec la récursivité et les invariants de boucle.

## Exercices

::::exercice[Quel raisonnement ?]{niveau=1}
Pour montrer « il n'existe pas de plus grand nombre premier », quel raisonnement est le plus naturel ?

- [ ] Une vérification sur les nombres premiers jusqu'à un million
- [x] Un raisonnement par l'absurde
- [ ] Une récurrence sur le nombre de chiffres
- [ ] Un contre-exemple

:::corrige
On suppose qu'il existe un plus grand premier (donc un nombre fini de premiers) et on aboutit à une contradiction (preuve d'Euclide). Une
vérification, même énorme, ne prouve rien ; un contre-exemple sert à réfuter, pas à prouver.
:::
::::

::::exercice[Erreur de récurrence]{niveau=1}
« Montrons que tous les chevaux ont la même couleur, par récurrence sur le nombre $n$ de chevaux. Pour $n = 1$, c'est évident. Si c'est vrai pour $n$
chevaux, prenons $n + 1$ chevaux : les $n$ premiers ont la même couleur, les $n$ derniers aussi ; comme ces deux groupes ont des chevaux en commun,
tous ont la même couleur. » Où est l'erreur ?

- [ ] Dans l'initialisation
- [x] L'hérédité est fausse pour passer de $n = 1$ à $n = 2$ : les deux groupes n'ont alors aucun cheval en commun
- [ ] On ne peut pas faire de récurrence sur des chevaux
- [ ] Il faudrait une récurrence forte

:::corrige
Avec 2 chevaux, « les $n$ premiers » = le cheval 1 et « les $n$ derniers » = le cheval 2 : les groupes sont disjoints, l'argument tombe. L'hérédité
doit être valable pour **tout** $n \ge n_0$ ; ici elle ne l'est que pour $n \ge 2$, et la chaîne se brise au premier maillon.
:::
::::

::::exercice[Chercher un contre-exemple]{niveau=2}
Écris `contre_exemple(propriete, debut, fin)` qui renvoie le plus petit entier `n` de `range(debut, fin)` pour lequel `propriete(n)` est fausse,
ou `None` s'il n'y en a pas. Puis utilise-la pour trouver le plus petit $n \ge 1$ tel que $2^n + 1$ n'est pas premier (on appelle `est_premier`
fournie).

```python depart
def est_premier(n):
    return n >= 2 and all(n % d for d in range(2, int(n ** 0.5) + 1))

def contre_exemple(propriete, debut, fin):
    ...

premier_echec = ...   # plus petit n ≥ 1 tel que 2**n + 1 n'est pas premier
```

```python tests
assert contre_exemple(lambda n: n * n >= n, 0, 100) is None, "propriété vraie sur l'intervalle"
assert contre_exemple(lambda n: est_premier(n * n + n + 41), 0, 100) == 40, "polynôme d'Euler"
assert contre_exemple(lambda n: n < 10, 5, 20) == 10, "à partir de debut"
assert premier_echec == 3, "2³ + 1 = 9"
```

:::corrige
```python solution
def est_premier(n):
    return n >= 2 and all(n % d for d in range(2, int(n ** 0.5) + 1))

def contre_exemple(propriete, debut, fin):
    for n in range(debut, fin):
        if not propriete(n):
            return n
    return None

premier_echec = contre_exemple(lambda n: est_premier(2 ** n + 1), 1, 100)
```
$2^1 + 1 = 3$ et $2^2 + 1 = 5$ sont premiers, $2^3 + 1 = 9$ ne l'est pas. Fermat avait conjecturé que les $2^{2^k} + 1$ sont tous premiers : Euler a
trouvé le contre-exemple $2^{32} + 1 = 641 \times 6\,700\,417$. Chercher un contre-exemple n'est jamais une preuve de l'énoncé, mais en trouver un
suffit à le réfuter.
:::
::::

::::exercice[Rédiger une récurrence]{niveau=2}
Démontrez par récurrence que, pour tout entier $n \ge 0$, $\sum_{k=0}^{n} 2^k = 2^{n+1} - 1$. Puis interprétez ce résultat en binaire, et pour un arbre
binaire parfait de hauteur $n + 1$.

:::criteres
- Propriété énoncée ; initialisation ($n = 0$ : $1 = 2^1 - 1$) ; hérédité correctement rédigée (supposer $P(n)$, ajouter $2^{n+1}$, obtenir $2^{n+2} - 1$) ; conclusion.
- Interprétation binaire : $n + 1$ chiffres 1 = le nombre qui précède $2^{n+1}$.
- Interprétation arbre : nombre de nœuds d'un arbre binaire parfait (1, 2, 4… nœuds par niveau).
:::

:::corrige
Soit $P(n)$ : « $\sum_{k=0}^{n} 2^k = 2^{n+1} - 1$ ».
**Initialisation** : pour $n = 0$, la somme vaut $2^0 = 1$ et $2^1 - 1 = 1$.
**Hérédité** : soit $n \ge 0$ tel que $P(n)$ est vraie. Alors $\sum_{k=0}^{n+1} 2^k = \left(\sum_{k=0}^{n} 2^k\right) + 2^{n+1} = 2^{n+1} - 1 + 2^{n+1} = 2^{n+2} - 1$ :
$P(n+1)$ est vraie.
**Conclusion** : $P(n)$ est vraie pour tout $n \ge 0$.
**En binaire**, $\sum_{k=0}^{n} 2^k$ s'écrit avec $n + 1$ chiffres 1 ($111\ldots1_2$) ; en lui ajoutant 1, toutes les retenues se propagent et l'on obtient
$1000\ldots0_2 = 2^{n+1}$. **Arbre** : un arbre binaire parfait a $2^k$ nœuds au niveau $k$ ; avec les niveaux 0 à $n$, il a $2^{n+1} - 1$ nœuds (par
exemple 7 nœuds pour 3 niveaux) — d'où la hauteur logarithmique d'un tas.
:::
::::

::::exercice[Induction sur les arbres]{niveau=3}
On représente un arbre binaire par `None` ou un triplet `(gauche, valeur, droite)`. Écris `taille(a)`, `hauteur(a)` (l'arbre vide a une hauteur 0,
une feuille 1) et `verifie_borne(a)` qui renvoie `True` si $\text{taille} \le 2^{\text{hauteur}} - 1$. Puis rédige (en commentaire ou mentalement) la
preuve par induction structurelle que cette borne est toujours vraie.

```python depart
def taille(a):
    ...

def hauteur(a):
    ...

def verifie_borne(a):
    ...
```

```python tests
import random
def aleatoire(n, rng):
    if n == 0:
        return None
    k = rng.randrange(n)
    return (aleatoire(k, rng), n, aleatoire(n - 1 - k, rng))
rng = random.Random(1)
arbres = [aleatoire(rng.randrange(30), rng) for _ in range(300)]
assert taille(None) == 0 and hauteur(None) == 0, "arbre vide"
assert taille(((None, 1, None), 2, None)) == 2 and hauteur(((None, 1, None), 2, None)) == 2, "petit arbre"
assert all(verifie_borne(a) for a in arbres), "la borne est vérifiée sur 300 arbres aléatoires"
assert all(taille(a) == (taille(a[0]) + 1 + taille(a[2]) if a else 0) for a in arbres), "définition récursive"
```

:::corrige
```python solution
def taille(a):
    return 0 if a is None else taille(a[0]) + 1 + taille(a[2])

def hauteur(a):
    return 0 if a is None else 1 + max(hauteur(a[0]), hauteur(a[2]))

def verifie_borne(a):
    return taille(a) <= 2 ** hauteur(a) - 1
```
**Preuve par induction structurelle.** Arbre vide : taille 0, hauteur 0, et $0 \le 2^0 - 1 = 0$. Arbre de sous-arbres $G$ et $D$ : par hypothèse,
$t_G \le 2^{h_G} - 1$ et $t_D \le 2^{h_D} - 1$ ; avec $h = 1 + \max(h_G, h_D)$, on a $t = 1 + t_G + t_D \le 1 + 2 \times (2^{h-1} - 1) = 2^h - 1$.
Conséquence : un arbre de $n$ nœuds a une hauteur au moins $\log_2(n + 1)$ — la recherche dans un ABR ne peut pas faire mieux que logarithmique.
:::
::::

::::exercice[Enseigner la preuve d'algorithme]{niveau=4 duree=25}
On veut prouver que la recherche dichotomique suivante est correcte (elle renvoie un indice de `x` si `x` est dans le tableau trié `t`, sinon -1) et
qu'elle termine.

```python
def dicho(t, x):
    g, d = 0, len(t) - 1
    while g <= d:
        m = (g + d) // 2
        if t[m] == x:
            return m
        elif t[m] < x:
            g = m + 1
        else:
            d = m - 1
    return -1
```

1. Énoncez un invariant de boucle et prouvez qu'il est conservé.
2. Prouvez la terminaison avec un variant.
3. Concluez sur la correction.
4. Comment amèneriez-vous des élèves de terminale à formuler eux-mêmes cet invariant ?

:::criteres
- Invariant : si $x$ est dans $t$, alors il est dans $t[g..d]$ (et $0 \le g$, $d \le n-1$) ; conservation prouvée dans les deux branches en utilisant le tri.
- Variant : $d - g + 1$ (taille de la zone) entier positif qui diminue strictement à chaque tour (car $g \le m \le d$).
- Conclusion : si on renvoie $m$, $t[m] = x$ ; si on sort avec $g > d$, la zone est vide, donc par l'invariant $x$ n'est pas dans $t$.
- Démarche pédagogique : traces sur des exemples, zone colorée, formulation par les élèves, contre-exemple d'une version fautive (`g = m`), lien avec la récurrence.
:::

:::corrige
1. **Invariant** $I$ : « $0 \le g$, $d \le n - 1$, et si $x$ apparaît dans $t$, alors il apparaît dans $t[g..d]$ ». Il est vrai avant la boucle ($g = 0$,
   $d = n - 1$ : la zone est tout le tableau). Supposons $I$ vrai au début d'un tour qui ne renvoie pas $m$. Si $t[m] < x$, comme $t$ est trié,
   $t[g..m]$ ne contient que des valeurs $\le t[m] < x$ : si $x$ est dans la zone, il est dans $t[m+1..d]$, et l'on pose $g = m + 1$. Cas symétrique si
   $t[m] > x$ avec $d = m - 1$. $I$ est conservé.
2. **Variant** $v = d - g + 1$ (nombre de cases de la zone) : c'est un entier, strictement positif tant que la boucle tourne ($g \le d$). Comme
   $g \le m \le d$, poser $g = m + 1$ ou $d = m - 1$ le fait **strictement** diminuer. Une suite d'entiers positifs strictement décroissante est finie :
   la boucle s'arrête.
3. Si la fonction renvoie $m$, c'est que $t[m] = x$ : correct. Sinon on sort avec $g > d$ : la zone $t[g..d]$ est vide, donc par l'invariant $x$ n'est
   pas dans $t$, et renvoyer $-1$ est correct.
4. Faire dérouler l'algorithme sur des exemples en **coloriant** à chaque tour la zone $[g, d]$ ; demander « qu'est-ce qui reste vrai à chaque tour ? »
   jusqu'à faire émerger « $x$, s'il existe, est dans la zone colorée ». Proposer une version fautive (`g = m` au lieu de `g = m + 1`) qui boucle
   indéfiniment sur certains cas : les élèves comprennent pourquoi le variant doit diminuer **strictement**. Faire le lien avec la récurrence : on
   prouve l'invariant « tour après tour ».
:::
::::
