---
titre: Automates finis déterministes
resume: Alphabets, mots et langages ; automates finis déterministes (états, transitions, états acceptants), leur exécution, la construction d'automates pour des langages simples, le complémentaire et l'intersection, et leurs limites.
duree: 70
objectifs:
  - Utiliser le vocabulaire des langages formels (alphabet, mot, mot vide, langage, concaténation)
  - Lire, exécuter et programmer un automate fini déterministe
  - Construire un automate qui reconnaît un langage donné (divisibilité, motif, parité), le compléter, le complémenter
  - Construire l'automate produit (intersection) et comprendre pourquoi certains langages ne sont pas reconnaissables
prerequis: [maths/ensembles, python/tuples-dictionnaires]
programme: [m-automates, nsit-langages]
cartes:
  - q: Alphabet, mot, langage ?
    r: "Un **alphabet** $\\Sigma$ est un ensemble fini de symboles ; un **mot** est une suite finie de symboles ($\\varepsilon$ : le mot vide) ; un **langage** est un ensemble de mots, partie de $\\Sigma^*$ (l'ensemble de tous les mots)."
  - q: Définition d'un automate fini déterministe ?
    r: "Un quintuplet $(Q, \\Sigma, \\delta, q_0, F)$ : un ensemble fini d'états $Q$, un alphabet $\\Sigma$, une fonction de transition $\\delta : Q \\times \\Sigma \\to Q$, un état initial $q_0$ et un ensemble d'états acceptants $F \\subseteq Q$."
  - q: Quand un automate accepte-t-il un mot ?
    r: "On part de l'état initial, on suit la transition de chaque lettre du mot dans l'ordre ; le mot est accepté si l'état atteint à la fin est **acceptant** (et s'il n'y a pas de blocage en route)."
  - q: Automate complet, état puits ?
    r: "Complet : une transition définie pour chaque état et chaque lettre. On complète en ajoutant un **état puits** non acceptant, qui boucle sur lui-même, vers lequel vont les transitions manquantes."
  - q: Comment obtenir un automate du complémentaire d'un langage ?
    r: "À partir d'un automate **complet** et déterministe, on échange états acceptants et non acceptants."
  - q: Automate produit ?
    r: "Ses états sont les couples d'états des deux automates, qui avancent en parallèle ; avec comme états acceptants les couples dont les deux composantes acceptent, il reconnaît l'**intersection** des langages."
  - q: Un exemple de langage qu'aucun automate fini ne reconnaît ?
    r: "$\\{a^n b^n \\mid n \\ge 0\\}$ (autant de $b$ que de $a$), ou les mots bien parenthésés : il faudrait compter sans limite, et un automate n'a qu'un nombre fini d'états (mémoire finie)."
---

Un digicode qui s'ouvre quand on tape `1984`, un distributeur de boissons, l'analyse lexicale d'un compilateur qui reconnaît les nombres et les mots-clés,
la vérification qu'une adresse électronique est bien formée : tous ces systèmes lisent des symboles un par un et changent d'**état**. Un **automate
fini** est le modèle mathématique de ces machines à mémoire finie. C'est la base de la théorie des langages, au programme du concours.

## 1. Mots et langages

:::definition
- Un **alphabet** $\Sigma$ est un ensemble fini de **lettres** (symboles) : $\{0, 1\}$, $\{a, b\}$, les caractères ASCII.
- Un **mot** est une suite finie de lettres ; sa **longueur** est $|u|$ ; le **mot vide** $\varepsilon$ a pour longueur 0. $\Sigma^*$ est l'ensemble de tous les mots.
- La **concaténation** de $u$ et $v$ est le mot $uv$ ($u$ suivi de $v$) ; $u^n$ est $u$ répété $n$ fois.
- Un **langage** est un ensemble de mots (fini ou infini) : « les écritures binaires des multiples de 3 », « les mots qui contiennent $ab$ ».
:::

## 2. Automates finis déterministes

Un **automate fini déterministe** (AFD) est donné par un ensemble fini d'**états** $Q$, un **état initial** $q_0$, un ensemble d'**états acceptants** $F$ et
une **fonction de transition** $\delta$ : depuis un état et pour une lettre, **au plus un** état d'arrivée (c'est le sens de « déterministe »).

```mermaid legende="Automate des mots sur {a, b} contenant le facteur ab (état initial q0, état acceptant q2 en double contour)"
stateDiagram-v2
  direction LR
  [*] --> q0
  q0 --> q0 : b
  q0 --> q1 : a
  q1 --> q1 : a
  q1 --> q2 : b
  q2 --> q2 : a, b
  q2 --> [*]
```

Pour lire le mot `bbaab` : $q_0 \xrightarrow{b} q_0 \xrightarrow{b} q_0 \xrightarrow{a} q_1 \xrightarrow{a} q_1 \xrightarrow{b} q_2$ ; on finit dans $q_2$, acceptant : le mot est
**accepté**. Le mot `ba` finit dans $q_1$ : **refusé**. Le **langage reconnu** par l'automate est l'ensemble des mots acceptés.

```python exec
automate = {
    "initial": "q0",
    "acceptants": {"q2"},
    "transitions": {("q0", "a"): "q1", ("q0", "b"): "q0",
                    ("q1", "a"): "q1", ("q1", "b"): "q2",
                    ("q2", "a"): "q2", ("q2", "b"): "q2"},
}

def accepte(automate, mot):
    etat = automate["initial"]
    for lettre in mot:
        if (etat, lettre) not in automate["transitions"]:
            return False                      # blocage : pas de transition
        etat = automate["transitions"][(etat, lettre)]
    return etat in automate["acceptants"]

for mot in ["bbaab", "ba", "", "ab", "bbbb", "aaab"]:
    print(repr(mot), accepte(automate, mot))
```

L'exécution d'un AFD est très efficace : **une** transition par lettre, donc un temps **linéaire** en la longueur du mot, avec une mémoire **constante**
(l'état courant). C'est pourquoi on les utilise pour analyser de grands textes.

:::methode[Construire un automate]
Se demander : **que faut-il retenir** du début du mot pour savoir la suite ? Chaque « chose à retenir » est un état.
- « contient $ab$ » : je n'ai rien vu d'utile / je viens de lire un $a$ / j'ai déjà vu $ab$ — 3 états ;
- « nombre pair de $a$ » : la parité du nombre de $a$ lus — 2 états ;
- « écriture binaire d'un multiple de 3 » : le **reste** modulo 3 de ce qui a été lu — 3 états (lire un bit $b$ transforme le nombre $n$ en $2n + b$, donc
  le reste $r$ en $(2r + b) \bmod 3$).
:::

## 3. Opérations sur les automates

Un automate est **complet** si chaque état a une transition pour chaque lettre. On le complète en ajoutant un **état puits**, non acceptant, qui boucle
sur lui-même. Sur un automate **complet** et déterministe :

- **Complémentaire** : échanger états acceptants et non acceptants reconnaît $\Sigma^* \setminus L$ (attention : sur un automate incomplet, les mots qui
  bloquent seraient oubliés) ;
- **Intersection** : l'**automate produit** fait avancer les deux automates **en parallèle** ; ses états sont des couples $(p, q)$, et il accepte quand
  les deux acceptent. Avec « l'un ou l'autre » acceptant, on obtient l'union.

Ces constructions montrent que les langages reconnus par des automates (dits **rationnels** ou **réguliers**) sont stables par complémentaire,
intersection et union.

## 4. Les limites : une mémoire finie

Un automate à $k$ états ne peut « retenir » que $k$ informations différentes. Le langage $\{a^n b^n \mid n \ge 0\}$ ($\varepsilon$, $ab$, $aabb$…) n'est
reconnu par **aucun** automate fini : lire $a^n$ pour $n = 0, 1, \dots, k$ donne $k + 1$ débuts de mot, donc deux d'entre eux, $a^i$ et $a^j$ avec $i \ne j$,
mènent au même état (principe des tiroirs) ; alors $a^i b^i$ et $a^j b^i$ aboutissent au même état final, mais le premier doit être accepté et pas le second :
contradiction. Il en va de même des expressions bien **parenthésées** : il faut une **pile** (automates à pile, grammaires) — c'est ce que fait l'analyse
syntaxique d'un compilateur.

:::prof
Les automates ne sont pas au programme de NSI, mais ils apparaissent au concours (mathématiques pour l'informatique) et dans l'enseignement à travers
les expressions rationnelles, l'analyse de texte et les machines à états (feux tricolores, digicodes, jeux). Une activité motivante : programmer en
Python l'automate d'un digicode, puis se demander combien d'états il faut et ce qui se passe quand on se trompe au milieu du code.
:::

## Exemple guidé

**Problème.** Construire un automate qui accepte les écritures binaires (lues de gauche à droite, bit de poids fort d'abord) des nombres **divisibles par 3**.

**1. Les états.** Ce qu'il faut retenir du préfixe lu : son reste $r$ modulo 3. États $0, 1, 2$ ; initial $0$ (mot vide = nombre 0) ; acceptant $0$.

**2. Les transitions.** Lire le bit $b$ après un préfixe de valeur $n$ donne $2n + b$, de reste $(2r + b) \bmod 3$ :

| état | lire 0 | lire 1 |
|---|---|---|
| 0 | 0 | 1 |
| 1 | 2 | 0 |
| 2 | 1 | 2 |

**3. Vérifier exhaustivement** sur les entiers de 0 à 999 :

```python exec
transitions = {(r, b): (2 * r + int(b)) % 3 for r in range(3) for b in "01"}

def multiple_de_3(mot):
    r = 0
    for b in mot:
        r = transitions[(r, b)]
    return r == 0

print(transitions)
print(all(multiple_de_3(format(n, "b")) == (n % 3 == 0) for n in range(1000)))
```

**4. Généraliser.** La même idée donne un automate à $d$ états pour la divisibilité par $d$ en base $k$ : $r \mapsto (k r + b) \bmod d$.

## L'essentiel

- Alphabet $\Sigma$, mots (dont $\varepsilon$), concaténation, langage $\subseteq \Sigma^*$.
- AFD $(Q, \Sigma, \delta, q_0, F)$ : un état courant, une transition par lettre ; mot accepté si l'état final est acceptant ; lecture en temps linéaire, mémoire constante.
- Construire : un état par « information à retenir » (reste, parité, progression dans un motif).
- Complet (état puits), complémentaire (échange des acceptants sur un AFD complet), produit (intersection, union).
- Mémoire finie : $\{a^n b^n\}$ et le bon parenthésage ne sont pas reconnaissables (principe des tiroirs).

## Exercices

::::exercice[Lire un automate]{niveau=1}
Avec l'automate « contient $ab$ » de la leçon, lequel de ces mots est accepté ?

- [ ] `bbba`
- [ ] `aaaa`
- [x] `baaba`
- [ ] le mot vide

:::corrige
`baaba` : $q_0 \to q_0 \to q_1 \to q_1 \to q_2 \to q_2$ (le facteur $ab$ apparaît aux positions 3-4) : accepté. Les autres ne contiennent pas $ab$.
:::
::::

::::exercice[Nombre d'états]{niveau=1}
Combien d'états faut-il au minimum à un automate qui accepte les mots sur $\{a, b\}$ dont le nombre de $a$ est un multiple de 4 ?

- [ ] 2
- [x] 4
- [ ] 5
- [ ] une infinité

:::corrige
Il faut retenir le nombre de $a$ modulo 4 : 4 états (0, 1, 2, 3), initial et acceptant 0 ; un $a$ fait passer de $r$ à $(r+1) \bmod 4$, un $b$ ne change rien.
Avec moins de 4 états, deux restes différents mèneraient au même état et l'automate se tromperait.
:::
::::

::::exercice[Programmer un automate]{niveau=2}
Complète le dictionnaire `transitions` d'un automate sur l'alphabet $\{a, b\}$ qui accepte les mots qui **se terminent par** `ab`. États : `0` (initial),
`1`, `2` ; acceptant : `2`. La fonction `accepte` est fournie.

```python depart
transitions = {
    (0, "a"): ..., (0, "b"): ...,
    (1, "a"): ..., (1, "b"): ...,
    (2, "a"): ..., (2, "b"): ...,
}

def accepte(mot):
    etat = 0
    for lettre in mot:
        etat = transitions[(etat, lettre)]
    return etat == 2
```

```python tests
from itertools import product
assert accepte("ab") and accepte("bbab") and accepte("abab"), "se terminent par ab"
assert not accepte("") and not accepte("aba") and not accepte("abb"), "ne se terminent pas par ab"
mots = ["".join(p) for n in range(8) for p in product("ab", repeat=n)]
assert all(accepte(m) == m.endswith("ab") for m in mots), "tous les mots jusqu'à 7 lettres"
```

:::corrige
```python solution
transitions = {
    (0, "a"): 1, (0, "b"): 0,
    (1, "a"): 1, (1, "b"): 2,
    (2, "a"): 1, (2, "b"): 0,
}

def accepte(mot):
    etat = 0
    for lettre in mot:
        etat = transitions[(etat, lettre)]
    return etat == 2
```
L'état retient « où on en est » de la fin `ab` : 0 = rien d'utile, 1 = le mot finit par `a`, 2 = il finit par `ab`. Depuis 2, un `a` ramène en 1 (le `a` peut
commencer un nouveau `ab`), un `b` ramène en 0. La vérification exhaustive sur tous les mots courts est un bon réflexe.
:::
::::

::::exercice[Compléter et complémenter]{niveau=2}
Un automate est un dictionnaire avec les clés `"etats"`, `"alphabet"`, `"initial"`, `"acceptants"` (ensemble) et `"transitions"` (dictionnaire
`(état, lettre) → état`, éventuellement incomplet). Écris `completer(a)` qui renvoie un nouvel automate complet (avec un état puits `"puits"` si
nécessaire) et `complementaire(a)` qui renvoie un automate reconnaissant le complémentaire.

```python depart
def completer(a):
    ...

def complementaire(a):
    ...
```

```python tests
from itertools import product
def accepte(a, mot):
    e = a["initial"]
    for l in mot:
        if (e, l) not in a["transitions"]:
            return False
        e = a["transitions"][(e, l)]
    return e in a["acceptants"]
# mots qui commencent par a (incomplet : pas de transition depuis 0 sur b)
debut_a = {"etats": {0, 1}, "alphabet": {"a", "b"}, "initial": 0, "acceptants": {1},
           "transitions": {(0, "a"): 1, (1, "a"): 1, (1, "b"): 1}}
c = completer(debut_a)
assert all((e, l) in c["transitions"] for e in c["etats"] for l in c["alphabet"]), "complet"
mots = ["".join(p) for n in range(6) for p in product("ab", repeat=n)]
assert all(accepte(c, m) == accepte(debut_a, m) for m in mots), "même langage"
non = complementaire(debut_a)
assert all(accepte(non, m) == (not m.startswith("a")) for m in mots), "complémentaire"
assert debut_a["acceptants"] == {1} and "puits" not in debut_a["etats"], "l'automate d'origine n'est pas modifié"
```

:::corrige
```python solution
def completer(a):
    etats = set(a["etats"])
    transitions = dict(a["transitions"])
    manque = [(e, l) for e in etats for l in a["alphabet"] if (e, l) not in transitions]
    if manque:
        etats.add("puits")
        for e, l in manque:
            transitions[(e, l)] = "puits"
        for l in a["alphabet"]:
            transitions[("puits", l)] = "puits"
    return {"etats": etats, "alphabet": set(a["alphabet"]), "initial": a["initial"],
            "acceptants": set(a["acceptants"]), "transitions": transitions}

def complementaire(a):
    c = completer(a)
    c["acceptants"] = c["etats"] - c["acceptants"]
    return c
```
Il faut **compléter avant** d'échanger : dans l'automate incomplet, le mot `b` bloque (refusé) ; si l'on échangeait directement les acceptants, il
serait encore refusé dans le « complémentaire ». Avec l'état puits, `b` aboutit dans `puits`, qui devient acceptant.
:::
::::

::::exercice[Automate produit]{niveau=3}
Écris `produit(a1, a2)` qui construit l'automate produit (intersection) de deux automates **complets** sur le même alphabet (représentation de
l'exercice précédent) : états = couples **accessibles** depuis le couple initial, transitions en parallèle, acceptants = couples dont les deux composantes
sont acceptantes.

```python depart
def produit(a1, a2):
    ...
```

```python tests
from itertools import product as prod
def accepte(a, mot):
    e = a["initial"]
    for l in mot:
        e = a["transitions"][(e, l)]
    return e in a["acceptants"]
pair_a = {"etats": {0, 1}, "alphabet": {"a", "b"}, "initial": 0, "acceptants": {0},
          "transitions": {(0, "a"): 1, (1, "a"): 0, (0, "b"): 0, (1, "b"): 1}}
fin_b = {"etats": {"x", "y"}, "alphabet": {"a", "b"}, "initial": "x", "acceptants": {"y"},
         "transitions": {("x", "a"): "x", ("x", "b"): "y", ("y", "a"): "x", ("y", "b"): "y"}}
p = produit(pair_a, fin_b)
mots = ["".join(t) for n in range(7) for t in prod("ab", repeat=n)]
assert all(accepte(p, m) == (m.count("a") % 2 == 0 and m.endswith("b")) for m in mots), "intersection"
assert p["initial"] == (0, "x") and len(p["etats"]) == 4, "quatre couples accessibles"
```

:::corrige
```python solution
def produit(a1, a2):
    initial = (a1["initial"], a2["initial"])
    etats, transitions, pile = {initial}, {}, [initial]
    while pile:
        p, q = pile.pop()
        for l in a1["alphabet"]:
            suivant = (a1["transitions"][(p, l)], a2["transitions"][(q, l)])
            transitions[((p, q), l)] = suivant
            if suivant not in etats:
                etats.add(suivant)
                pile.append(suivant)
    acceptants = {(p, q) for (p, q) in etats if p in a1["acceptants"] and q in a2["acceptants"]}
    return {"etats": etats, "alphabet": set(a1["alphabet"]), "initial": initial,
            "acceptants": acceptants, "transitions": transitions}
```
On ne construit que les couples **accessibles** (un parcours depuis le couple initial), ce qui évite de créer les $|Q_1| \times |Q_2|$ états quand beaucoup sont
inutiles. Changer la condition d'acceptation en « l'un ou l'autre » donne l'union, « l'un mais pas l'autre » la différence.
:::
::::

::::exercice[Un digicode]{niveau=4 duree=20}
Un digicode à touches 0-9 ouvre la porte dès que les quatre derniers chiffres tapés sont `1984`.

1. Construisez un automate déterministe qui reconnaît les suites de chiffres se terminant par `1984` : combien d'états faut-il ? Donnez les transitions
   importantes (en particulier quand on se trompe au milieu du code).
2. Que deviendrait le nombre d'états pour un code de longueur $k$ ?
3. Quelles notions d'informatique (et de mathématiques) cette activité permet-elle de travailler avec des élèves ?

:::criteres
- 5 états (« rien », « 1 », « 19 », « 198 », « 1984 ») ; transitions correctes y compris les retours partiels : depuis « 198 », lire 1 mène à « 1 », lire 9… mène à l'état correspondant au plus long suffixe qui est un préfixe du code ; depuis « 1984 », lire 1 mène à « 1 ».
- Généralisation : $k + 1$ états (lien avec l'automate de recherche de motif / algorithme KMP).
- Notions : machines à états, modélisation, représentation (diagramme, table, dictionnaire), test exhaustif, recherche textuelle.
:::

:::corrige
1. Les états retiennent la **plus longue fin** de ce qui a été tapé qui est un **début** du code : $e_0$ (rien), $e_1$ (« 1 »), $e_2$ (« 19 »), $e_3$ (« 198 »),
   $e_4$ (« 1984 », acceptant) : **5 états**. Transitions : le bon chiffre fait avancer ($e_0 \xrightarrow{1} e_1 \xrightarrow{9} e_2 \xrightarrow{8} e_3 \xrightarrow{4} e_4$). Un mauvais
   chiffre ne ramène pas toujours à $e_0$ : depuis n'importe quel état, taper `1` mène à $e_1$ (ce `1` peut commencer le code) ; depuis $e_1$, taper encore `1`
   reste en $e_1$. Tous les autres chiffres incorrects ramènent à $e_0$. Depuis $e_4$ (porte ouverte), on continue comme depuis $e_0$, `1` menant à $e_1$.
2. Pour un code de $k$ chiffres : $k + 1$ états (préfixes de longueur 0 à $k$). Les transitions « de repli » se calculent comme dans l'algorithme de recherche
   de motif de Knuth-Morris-Pratt (pour un code comme `1212`, se tromper après `121` peut ramener à `1` ou à `12`).
3. Modélisation par une **machine à états** (états, transitions, état acceptant), représentations (diagramme, table, dictionnaire Python), programmation
   d'un automate et **tests exhaustifs** sur toutes les suites courtes, lien avec la **recherche textuelle** (un motif dans un texte) et, côté sécurité, le
   nombre de codes possibles ($10^4$) et le temps pour tous les essayer.
:::
::::
