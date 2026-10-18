---
titre: Logique booléenne et circuits
resume: Des transistors aux portes logiques, des portes à l'additionneur — tables de vérité, expressions booléennes, lois de De Morgan, circuits combinatoires et mémoire élémentaire.
duree: 70
objectifs:
  - Dresser la table de vérité d'une expression booléenne et simplifier une expression (lois de De Morgan, distributivité)
  - Construire un circuit à partir de portes ET, OU, NON, OU exclusif, NON-ET
  - Concevoir un demi-additionneur, un additionneur complet et un additionneur de n bits
  - Expliquer la différence entre circuit combinatoire et circuit séquentiel (mémoire)
prerequis: [representation/entiers]
programme: [asr-circuits, asr-organisation, nsi1-base, m-logique]
cartes:
  - q: Tables de vérité de ET, OU, OU exclusif ?
    r: "ET vaut 1 seulement si les deux entrées valent 1 ; OU vaut 0 seulement si les deux valent 0 ; OU exclusif (XOR) vaut 1 si les entrées sont **différentes**."
  - q: Lois de De Morgan ?
    r: "$\\overline{a \\cdot b} = \\overline{a} + \\overline{b}$ et $\\overline{a + b} = \\overline{a} \\cdot \\overline{b}$ : « non (a et b) = (non a) ou (non b) »."
  - q: Pourquoi dit-on que la porte NON-ET (NAND) est universelle ?
    r: "Toute fonction booléenne peut être réalisée avec des portes NAND seules : NON a = NAND(a, a), ET = NON(NAND), OU(a, b) = NAND(NON a, NON b)."
  - q: Demi-additionneur ?
    r: "Additionne deux bits : somme $S = a \\oplus b$ (XOR), retenue $C = a \\cdot b$ (ET)."
  - q: Additionneur complet ?
    r: "Additionne deux bits et une retenue entrante : $S = a \\oplus b \\oplus c$, retenue sortante $= a b + c (a \\oplus b)$. On en chaîne n pour additionner deux nombres de n bits."
  - q: Combinatoire ou séquentiel ?
    r: "Combinatoire : les sorties ne dépendent que des entrées actuelles (additionneur). Séquentiel : elles dépendent aussi de l'état mémorisé (bascule, registre, compteur)."
  - q: Combien de fonctions booléennes de n variables ?
    r: "$2^{2^n}$ : une table de vérité a $2^n$ lignes, et chaque ligne peut valoir 0 ou 1 (16 fonctions de 2 variables)."
---

Un processeur ne sait faire que des opérations très simples sur des **bits**, mais il en fait des milliards par seconde. Ces opérations
sont réalisées par des **circuits logiques**, assemblages de **portes** elles-mêmes faites de **transistors** — plusieurs dizaines de
milliards dans une puce récente. Cette leçon remonte la chaîne : des booléens aux portes, des portes à l'addition binaire, puis à la
mémoire. C'est aussi la base mathématique de la logique (module Mathématiques).

## 1. Booléens et tables de vérité

Une **variable booléenne** vaut 0 (faux) ou 1 (vrai). Trois opérations de base, notées comme en algèbre :

| $a$ | $b$ | NON $a$ ($\overline{a}$) | $a$ ET $b$ ($a \cdot b$) | $a$ OU $b$ ($a + b$) | $a$ XOR $b$ ($a \oplus b$) |
|:-:|:-:|:-:|:-:|:-:|:-:|
| 0 | 0 | 1 | 0 | 0 | 0 |
| 0 | 1 | 1 | 0 | 1 | 1 |
| 1 | 0 | 0 | 0 | 1 | 1 |
| 1 | 1 | 0 | 1 | 1 | 0 |

```python exec
from itertools import product

def table(f, n):
    """Affiche la table de vérité d'une fonction booléenne de n variables."""
    for entrees in product([0, 1], repeat=n):
        print(*entrees, "|", int(f(*entrees)))

# a ET (b OU NON c)
table(lambda a, b, c: a and (b or not c), 3)
```

:::retenir[Règles de calcul]
- Neutres et absorbants : $a + 0 = a$, $a \cdot 1 = a$, $a + 1 = 1$, $a \cdot 0 = 0$ ; idempotence $a + a = a$ ; $a + \overline{a} = 1$, $a \cdot \overline{a} = 0$.
- Distributivité **dans les deux sens** : $a \cdot (b + c) = a b + a c$ **et** $a + b c = (a + b)(a + c)$.
- **De Morgan** : $\overline{a \cdot b} = \overline{a} + \overline{b}$ et $\overline{a + b} = \overline{a} \cdot \overline{b}$.
- Absorption : $a + a b = a$ et $a (a + b) = a$.
:::

Une fonction de $n$ variables est entièrement décrite par sa table, de $2^n$ lignes. Réciproquement, toute table peut s'écrire comme un
**OU de ET** (forme normale disjonctive) : pour chaque ligne qui vaut 1, on écrit le ET des variables (barrées si elles valent 0).

## 2. Des transistors aux portes

Un **transistor** se comporte, en logique, comme un **interrupteur commandé** par une tension : il laisse passer le courant ou non. En
technologie CMOS, quelques transistors suffisent pour une porte : 2 pour un NON, 4 pour un NON-ET.

```mermaid legende="Les portes logiques usuelles et leur symbole fonctionnel"
flowchart LR
  subgraph s1[" "]
    a1(["a"]) --> NON["NON"] --> s_1(["ā"])
  end
  subgraph s2[" "]
    a2(["a"]) --> ET["ET"]
    b2(["b"]) --> ET --> s_2(["a·b"])
  end
  subgraph s3[" "]
    a3(["a"]) --> OU["OU"]
    b3(["b"]) --> OU --> s_3(["a+b"])
  end
  subgraph s4[" "]
    a4(["a"]) --> XOR["OU excl."]
    b4(["b"]) --> XOR --> s_4(["a⊕b"])
  end
```

:::definition[Porte universelle]
La porte **NON-ET** (NAND) vaut $\overline{a \cdot b}$. Elle est **universelle** : NON, ET et OU (donc tout circuit) s'écrivent avec des
NAND seules :
$\overline{a} = \text{NAND}(a, a)$ ; $a \cdot b = \text{NAND}(\text{NAND}(a,b), \text{NAND}(a,b))$ ;
$a + b = \text{NAND}(\overline{a}, \overline{b})$ (par De Morgan). Les fabricants peuvent donc tout construire à partir d'un seul motif.
:::

```python exec
def nand(a, b):
    return 1 - (a & b)

def non(a):     return nand(a, a)
def et(a, b):   return non(nand(a, b))
def ou(a, b):   return nand(non(a), non(b))

for a in (0, 1):
    for b in (0, 1):
        print(a, b, "| NON a :", non(a), " ET :", et(a, b), " OU :", ou(a, b))
```

## 3. Circuits combinatoires : additionner

Pour additionner deux bits $a$ et $b$ : $0+0 = 0$, $0+1 = 1$, $1+1 = 10_2$ (on pose 0, on retient 1). La somme est $a \oplus b$, la retenue
$a \cdot b$ : c'est le **demi-additionneur**.

Pour additionner deux nombres de plusieurs bits, chaque colonne reçoit **trois** bits : $a_i$, $b_i$ et la retenue de la colonne
précédente. L'**additionneur complet** les additionne :

$$ s_i = a_i \oplus b_i \oplus c_i \qquad c_{i+1} = a_i b_i + c_i (a_i \oplus b_i) $$

```mermaid legende="Additionneur de 4 bits : la retenue se propage de colonne en colonne"
flowchart RL
  A0["AC₀<br/>a₀ b₀"] -->|"c₁"| A1["AC₁<br/>a₁ b₁"]
  A1 -->|"c₂"| A2["AC₂<br/>a₂ b₂"]
  A2 -->|"c₃"| A3["AC₃<br/>a₃ b₃"]
  C0(["c₀ = 0"]) --> A0
  A0 --> S0(["s₀"])
  A1 --> S1(["s₁"])
  A2 --> S2(["s₂"])
  A3 --> S3(["s₃"])
  A3 -->|"c₄"| D(["débordement"])
```

```python exec
def additionneur_complet(a, b, c):
    s = a ^ b ^ c
    retenue = (a & b) | (c & (a ^ b))
    return s, retenue

def additionner(x, y):
    """x, y : listes de bits, poids faible en premier. Renvoie la somme (même longueur) et la retenue finale."""
    c, somme = 0, []
    for a, b in zip(x, y):
        s, c = additionneur_complet(a, b, c)
        somme.append(s)
    return somme, c

# 6 + 7 sur 4 bits : 0110 + 0111 (écrits poids faible en premier)
print(additionner([0, 1, 1, 0], [1, 1, 1, 0]))    # ([1, 0, 1, 1], 0) : 1101 = 13
print(additionner([1, 1, 1, 1], [1, 0, 0, 0]))    # 15 + 1 : ([0, 0, 0, 0], 1) débordement
```

Cet **additionneur à propagation de retenue** est simple, mais lent : la dernière colonne attend que la retenue ait traversé toutes les
autres ($n$ étapes). Les processeurs utilisent des additionneurs à **anticipation de retenue**, qui calculent les retenues en parallèle.
Avec quelques portes de plus, le même circuit soustrait (en complément à deux : $a - b = a + \overline{b} + 1$) : c'est le cœur de
l'**UAL** (unité arithmétique et logique).

Un autre circuit combinatoire essentiel : le **multiplexeur**, qui choisit une entrée parmi plusieurs selon un bit de sélection $s$ :
$\text{mux}(s, x, y) = \overline{s} \cdot x + s \cdot y$ (vaut $x$ si $s = 0$, $y$ si $s = 1$).

## 4. Circuits séquentiels : mémoriser

Dans un circuit **combinatoire**, les sorties ne dépendent que des entrées du moment. Pour **mémoriser**, il faut **reboucler** des
sorties sur des entrées : deux portes NON-OU croisées forment une **bascule RS**, qui garde un bit tant qu'on ne la modifie pas. Les
**bascules D**, synchronisées par une **horloge**, mémorisent leur entrée à chaque top d'horloge ; huit, trente-deux ou soixante-quatre
bascules côte à côte forment un **registre**. La fréquence de l'horloge (quelques gigahertz) cadence tout le processeur.

| Circuit | Type | Exemple |
|---|---|---|
| additionneur, multiplexeur, décodeur, comparateur | combinatoire | l'UAL |
| bascule, registre, compteur | séquentiel | les registres du processeur, la mémoire cache (SRAM) |

:::prof
En première NSI : « dresser la table d'une expression booléenne », « identifier les portes ET, OU, NON, XOR et exprimer une fonction
avec ces opérateurs ». Les simulateurs de circuits (Logisim Evolution, ou des simulateurs en ligne) permettent de faire construire un
demi-additionneur puis un additionneur 4 bits par les élèves : la propagation de la retenue devient visible. Le lien avec les
opérateurs `and`, `or`, `not`, `^`, `&`, `|` de Python est à expliciter (opérateurs logiques paresseux contre opérateurs bit à bit).
:::

## Exemple guidé

**Problème.** Un système d'alarme a trois capteurs $a$, $b$, $c$. L'alarme $A$ doit sonner quand **au moins deux** capteurs sont
activés (vote majoritaire). Trouver une expression simple et le circuit.

**1. La table de vérité.** $A = 1$ pour les lignes 011, 101, 110, 111.

**2. Forme normale disjonctive.** $A = \overline{a} b c + a \overline{b} c + a b \overline{c} + a b c$.

**3. Simplifier.** On utilise $x + x = x$ pour dupliquer $abc$ trois fois, puis on factorise :
$A = (\overline{a} b c + a b c) + (a \overline{b} c + a b c) + (a b \overline{c} + a b c) = bc(\overline{a} + a) + ac(\overline{b} + b) + ab(\overline{c} + c)$,
soit $A = ab + bc + ac$.

**4. Vérifier par la table** (on n'a pas le droit de se tromper en simplifiant) :

```python exec
from itertools import product

fnd = lambda a, b, c: (not a and b and c) or (a and not b and c) or (a and b and not c) or (a and b and c)
simple = lambda a, b, c: (a and b) or (b and c) or (a and c)
print(all(bool(fnd(*e)) == bool(simple(*e)) for e in product([0, 1], repeat=3)))
```

Le circuit : trois portes ET et deux portes OU, au lieu de quatre ET à trois entrées, trois NON et un OU à quatre entrées. C'est aussi
exactement la **retenue sortante** d'un additionneur complet : « au moins deux des trois bits valent 1 ».

## L'essentiel

- Booléens 0/1 ; NON ($\overline{a}$), ET ($a\cdot b$), OU ($a+b$), XOR ($a\oplus b$, vrai si différents) ; tables de vérité à $2^n$ lignes.
- Lois : distributivités, absorption, **De Morgan** $\overline{ab} = \overline{a}+\overline{b}$, $\overline{a+b} = \overline{a}\,\overline{b}$ ; toute fonction s'écrit en OU de ET.
- Les portes sont faites de transistors ; NAND est universelle.
- Demi-additionneur : $S = a\oplus b$, $C = ab$ ; additionneur complet : $s = a\oplus b\oplus c$, $c' = ab + c(a\oplus b)$ ; chaînés : additionneur $n$ bits ; UAL.
- Combinatoire (sorties = fonction des entrées) contre séquentiel (bascules, registres, horloge : mémoire).

## Exercices

::::exercice[Lire une table]{niveau=1}
Quelle expression a pour table de vérité : 0 0 → 1 ; 0 1 → 1 ; 1 0 → 1 ; 1 1 → 0 ?

- [ ] $a \cdot b$
- [ ] $a + b$
- [x] $\overline{a \cdot b}$
- [ ] $a \oplus b$

:::corrige
La sortie vaut 0 seulement quand les deux entrées valent 1 : c'est NON(a ET b), la porte NAND (et, par De Morgan, $\overline{a} + \overline{b}$).
:::
::::

::::exercice[De Morgan]{niveau=1}
À quelle expression est égale $\overline{a + \overline{b}}$ ?

- [ ] $\overline{a} + b$
- [x] $\overline{a} \cdot b$
- [ ] $a \cdot \overline{b}$
- [ ] $\overline{a} \cdot \overline{b}$

:::corrige
De Morgan : $\overline{a + \overline{b}} = \overline{a} \cdot \overline{\overline{b}} = \overline{a} \cdot b$.
:::
::::

::::exercice[Table de vérité automatique]{niveau=2}
Écris `table_verite(f, n)` qui renvoie la liste des sorties (0 ou 1) d'une fonction booléenne de `n` variables, dans l'ordre des lignes
000…0, 000…1, …, 111…1 (la première variable est le bit de poids fort). Puis `equivalentes(f, g, n)`.

```python depart
def table_verite(f, n):
    ...

def equivalentes(f, g, n):
    ...
```

```python tests
assert table_verite(lambda a, b: a and b, 2) == [0, 0, 0, 1], "ET"
assert table_verite(lambda a, b, c: a ^ b ^ c, 3) == [0, 1, 1, 0, 1, 0, 0, 1], "XOR à trois entrées"
assert equivalentes(lambda a, b: not (a and b), lambda a, b: (not a) or (not b), 2), "De Morgan"
assert not equivalentes(lambda a, b: not (a and b), lambda a, b: (not a) and (not b), 2), "erreur classique"
```

:::corrige
```python solution
def table_verite(f, n):
    sorties = []
    for k in range(2 ** n):
        entrees = [(k >> (n - 1 - i)) & 1 for i in range(n)]
        sorties.append(int(bool(f(*entrees))))
    return sorties

def equivalentes(f, g, n):
    return table_verite(f, n) == table_verite(g, n)
```
La ligne numéro $k$ correspond à l'écriture binaire de $k$ sur $n$ bits : on extrait chaque bit par décalage et masque. Deux
expressions sont équivalentes si et seulement si leurs tables sont identiques (vérification exhaustive, en $2^n$ lignes).
:::
::::

::::exercice[Tout avec des NAND]{niveau=2}
En utilisant **uniquement** la fonction `nand` fournie (pas d'opérateur logique ni de condition), écris `xor(a, b)` et
`mux(s, x, y)` (qui vaut `x` si `s == 0`, `y` si `s == 1`).

```python depart
def nand(a, b):
    return 1 - (a & b)

def xor(a, b):
    ...

def mux(s, x, y):
    ...
```

```python tests
assert [xor(a, b) for a in (0, 1) for b in (0, 1)] == [0, 1, 1, 0], "xor"
assert [mux(s, x, y) for s in (0, 1) for x in (0, 1) for y in (0, 1)] == [0, 0, 1, 1, 0, 1, 0, 1], "multiplexeur"
```

:::corrige
```python solution
def nand(a, b):
    return 1 - (a & b)

def xor(a, b):
    n = nand(a, b)
    return nand(nand(a, n), nand(b, n))

def mux(s, x, y):
    return nand(nand(x, nand(s, s)), nand(y, s))
```
Le XOR classique en 4 NAND : avec $n = \overline{ab}$, $\text{NAND}(a, n) = \overline{a} + b$ et $\text{NAND}(b, n) = a + \overline{b}$, et
leur NAND vaut $a\overline{b} + \overline{a}b = a \oplus b$. Le multiplexeur : $\overline{s}x + sy = \text{NAND}(\text{NAND}(x, \overline{s}), \text{NAND}(y, s))$
par De Morgan, avec $\overline{s} = \text{NAND}(s, s)$.
:::
::::

::::exercice[Soustracteur en complément à deux]{niveau=3}
Avec l'additionneur complet fourni, écris `soustraire(x, y)` qui calcule $x - y$ sur $n$ bits (listes de bits, poids faible en premier)
en complément à deux : on additionne $x$, l'inverse bit à bit de $y$, et une retenue initiale de 1. Renvoie la liste des $n$ bits du
résultat (la retenue finale est ignorée).

```python depart
def additionneur_complet(a, b, c):
    return a ^ b ^ c, (a & b) | (c & (a ^ b))

def soustraire(x, y):
    ...
```

```python tests
def vers_bits(v, n):
    return [(v >> i) & 1 for i in range(n)]
def vers_entier_signe(bits):
    v = sum(b << i for i, b in enumerate(bits))
    return v - (1 << len(bits)) if bits[-1] else v
assert vers_entier_signe(soustraire(vers_bits(13, 8), vers_bits(6, 8))) == 7, "13 - 6"
assert vers_entier_signe(soustraire(vers_bits(6, 8), vers_bits(13, 8))) == -7, "6 - 13 négatif"
assert vers_entier_signe(soustraire(vers_bits(0, 4), vers_bits(1, 4))) == -1, "0 - 1 sur 4 bits"
```

:::corrige
```python solution
def additionneur_complet(a, b, c):
    return a ^ b ^ c, (a & b) | (c & (a ^ b))

def soustraire(x, y):
    c, resultat = 1, []
    for a, b in zip(x, y):
        s, c = additionneur_complet(a, 1 - b, c)
        resultat.append(s)
    return resultat
```
$-y$ s'écrit en complément à deux $\overline{y} + 1$ : on réutilise l'additionneur en inversant les bits de $y$ (une porte XOR par bit
commandée par un signal « soustraction ») et en injectant la retenue initiale 1. C'est ainsi qu'une UAL fait addition et soustraction
avec le même circuit.
:::
::::

::::exercice[Concevoir un comparateur]{niveau=4 duree=25}
On veut un circuit qui compare deux nombres de 2 bits $A = a_1 a_0$ et $B = b_1 b_0$ et dont la sortie $G$ vaut 1 si et seulement si
$A > B$.

1. Combien de lignes a la table de vérité ? Donnez une expression de $G$ en raisonnant sur les bits de poids fort puis de poids faible
   (sans écrire les 16 lignes).
2. Dessinez (ou décrivez) le circuit avec des portes ET, OU, NON, XOR.
3. Généralisez l'idée à des nombres de $n$ bits : combien de « niveaux » de portes traverse le signal dans votre construction ?
4. Proposez une séance de première NSI où les élèves construisent ce comparateur, avec la façon dont ils vérifient leur circuit.

:::criteres
- 16 lignes ($2^4$) ; $G = a_1 \overline{b_1} + (a_1 \odot b_1) \, a_0 \overline{b_0}$ où $a_1 \odot b_1 = \overline{a_1 \oplus b_1}$ (égalité des bits de poids fort).
- Circuit cohérent avec l'expression (NON, ET, XOR suivi de NON pour l'égalité, OU final).
- Généralisation : comparaison du poids fort au poids faible, « supérieur au rang i et égaux au-dessus » ; profondeur proportionnelle à n pour la version en cascade (ou logarithmique avec une construction en arbre, si évoqué).
- Séance : simulateur (Logisim), construction progressive (1 bit puis 2), vérification par table de vérité exhaustive ou tests automatiques, lien avec la comparaison d'entiers.
:::

:::corrige
1. Quatre entrées, donc $2^4 = 16$ lignes. On compare d'abord les bits de poids fort : si $a_1 = 1$ et $b_1 = 0$, alors $A > B$ ; s'ils
   sont **égaux**, on décide sur les poids faibles ($a_0 = 1$ et $b_0 = 0$) ; sinon $A < B$. D'où
   $$ G = a_1 \overline{b_1} + \overline{(a_1 \oplus b_1)} \cdot a_0 \overline{b_0}. $$
2. Une porte NON sur $b_1$ et une sur $b_0$ ; un ET pour $a_1 \overline{b_1}$ ; un XOR suivi d'un NON (porte XNOR) pour l'égalité
   $e_1 = \overline{a_1 \oplus b_1}$ ; un ET à trois entrées $e_1 \cdot a_0 \cdot \overline{b_0}$ ; un OU final.
3. Pour $n$ bits : $G = g_{n-1} + e_{n-1} g_{n-2} + e_{n-1} e_{n-2} g_{n-3} + \dots$, avec $g_i = a_i \overline{b_i}$ (« strictement plus
   grand au rang $i$ ») et $e_i$ (« égaux au rang $i$ »). En cascade (on traite les rangs l'un après l'autre), le signal traverse un nombre
   de portes proportionnel à $n$, comme la retenue d'un additionneur. On peut aussi comparer par blocs en arbre (profondeur en $\log n$).
   Remarque : $A > B$ équivaut aussi à « la soustraction $B - A$ produit un emprunt », ce que fait l'UAL.
4. Séance avec un simulateur (Logisim Evolution) : comparer 1 bit (table à 4 lignes, $g = a\overline{b}$), puis l'égalité d'un bit
   (XNOR), puis 2 bits en combinant. Vérification : remplir la table de vérité complète en manipulant les entrées (ou utiliser
   l'outil d'analyse combinatoire du simulateur, qui produit la table et l'expression), et comparer avec la table attendue construite
   à partir des valeurs décimales de $A$ et $B$. Bilan : lien avec l'ordre lexicographique et avec `<` en Python.
:::
::::
