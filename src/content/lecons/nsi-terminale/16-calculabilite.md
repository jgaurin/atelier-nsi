---
titre: Calculabilité et décidabilité
resume: "Le cours de terminale NSI sur la calculabilité : un programme est aussi une donnée (interpréteurs, compilateurs, fonctions passées en paramètre), la calculabilité ne dépend pas du langage (machine de Turing, thèse de Church-Turing), problèmes décidables et indécidables, et la démonstration par l'absurde de l'indécidabilité du problème de l'arrêt."
duree: 50
objectifs:
  - "Expliquer, sur des exemples, qu'un programme est aussi une donnée"
  - "Savoir que la calculabilité ne dépend pas du langage utilisé"
  - "Distinguer problème décidable et indécidable"
  - "Expliquer pourquoi le problème de l'arrêt est indécidable"
prerequis: [nsi-terminale/recursivite, nsi-terminale/modularite]
programme: [nsit-calculabilite]
cartes:
  - q: "En quel sens un programme est-il une donnée ?"
    r: "Un programme est un texte (ou une suite d'octets) que d'autres programmes **lisent, transforment ou exécutent** : interpréteur, compilateur, antivirus, système d'exploitation. En Python, une fonction peut être passée en paramètre."
  - q: "Qu'est-ce qu'une machine de Turing ?"
    r: "Un modèle théorique de calcul (Alan Turing, 1936) : un ruban infini de cases, une tête de lecture-écriture et une table de règles. Tout ce qu'un ordinateur sait calculer, une machine de Turing le peut aussi."
  - q: "La calculabilité dépend-elle du langage ?"
    r: "Non : Python, C, Java… et les machines de Turing calculent exactement les **mêmes** fonctions (thèse de Church-Turing). Les langages diffèrent en confort et en rapidité, pas en puissance."
  - q: "Problème décidable ?"
    r: "Un problème à réponse oui/non pour lequel il existe un **algorithme** qui donne la bonne réponse **pour toute entrée**, en un temps fini."
  - q: "Le problème de l'arrêt ?"
    r: "Étant donnés un programme P et une entrée e, P s'arrête-t-il sur e ? Turing a démontré (1936) qu'**aucun programme** ne peut répondre correctement pour tous les P et e : il est **indécidable**."
  - q: "Idée de la preuve ?"
    r: "Par l'absurde : si `arret(P, e)` existait, on construit `paradoxe(P)` qui boucle si `arret(P, P)` est vrai et s'arrête sinon ; `paradoxe(paradoxe)` s'arrête si et seulement s'il ne s'arrête pas : contradiction."
---

Les ordinateurs semblent tout pouvoir faire, pourvu qu'on leur donne assez de temps et de mémoire. Pourtant, dès 1936, avant même la
construction du premier ordinateur, **Alan Turing** a démontré qu'il existe des problèmes qu'**aucun programme** ne pourra jamais résoudre. Ce
chapitre, plus philosophique, pose les limites de l'informatique.

## Ce que dit le programme

Contenus : *notion de programme en tant que donnée* ; *calculabilité, décidabilité*. Capacités attendues : **comprendre que tout programme est
aussi une donnée** ; **comprendre que la calculabilité ne dépend pas du langage de programmation utilisé** ; **montrer, sans formalisme
théorique, que le problème de l'arrêt est indécidable**. Le programme précise : l'utilisation d'un interpréteur ou d'un compilateur, le
téléchargement de logiciels, le fonctionnement des systèmes d'exploitation permettent de comprendre un programme comme donnée d'autres
programmes.

## 1. Un programme est une donnée

Un programme Python est un **fichier texte** : d'autres programmes le lisent et le manipulent.

- L'**interpréteur** Python lit ce texte et l'exécute ; un **compilateur** le traduit en un autre programme (en langage machine).
- Le **système d'exploitation** charge des programmes en mémoire et les lance ; un **antivirus** les analyse ; un **éditeur** les colore.
- Quand on **télécharge** une application, elle voyage sur le réseau comme n'importe quel fichier.

En Python, une **fonction** est une valeur comme une autre : on peut la ranger dans une variable, la passer en paramètre, la renvoyer.

```python exec
def appliquer(f, t):
    """Applique la fonction f à chaque élément de t."""
    return [f(x) for x in t]

def carre(x):
    return x * x

print(appliquer(carre, [1, 2, 3]))
print(appliquer(len, ["NSI", "terminale"]))

code = "print(6 * 7)"
exec(code)                # un texte exécuté comme un programme
```

C'est le principe de l'architecture de **von Neumann** : programme et données sont rangés dans la **même** mémoire, sous la même forme.

## 2. La calculabilité ne dépend pas du langage

Pour étudier ce qu'on peut calculer, Turing invente une machine minimale : la **machine de Turing**. Un ruban infini de cases contenant des
symboles, une tête qui lit et écrit une case et se déplace d'une case à gauche ou à droite, et une table de règles du type « dans l'état q, si
je lis 1, j'écris 0, je vais à droite et je passe dans l'état r ».

```python exec
def machine(ruban, regles, etat="q0"):
    """Simule une machine de Turing ; s'arrête dans l'état 'fin'."""
    ruban = list(ruban)
    tete = 0
    while etat != "fin":
        symbole = ruban[tete] if tete < len(ruban) else "_"
        if tete == len(ruban):
            ruban.append("_")
        ecrit, direction, etat = regles[(etat, symbole)]
        ruban[tete] = ecrit
        tete = tete + (1 if direction == "D" else -1)
    return "".join(ruban).strip("_")

# Machine qui inverse les bits jusqu'au premier blanc
inverseur = {
    ("q0", "0"): ("1", "D", "q0"),
    ("q0", "1"): ("0", "D", "q0"),
    ("q0", "_"): ("_", "D", "fin"),
}
print(machine("1011001", inverseur))
```

Ce modèle très simple peut calculer **tout** ce que calcule un ordinateur. Inversement, tout langage de programmation usuel (Python, C, Java,
JavaScript…) peut simuler une machine de Turing : on dit qu'ils sont **Turing-complets**. Ils calculent donc exactement les **mêmes**
fonctions. C'est la **thèse de Church-Turing** : tout ce qui est calculable par un procédé mécanique est calculable par une machine de Turing.

Conséquence : ce qu'un langage ne peut pas calculer, **aucun** ne le peut. Les langages diffèrent par leur confort, leur rapidité, leur
sécurité, pas par ce qu'ils peuvent calculer.

## 3. Décidable ou indécidable

Un **problème de décision** est une question à réponse **oui ou non** qui dépend d'une entrée. Il est **décidable** s'il existe un algorithme
qui, pour **toute** entrée, s'arrête et donne la bonne réponse.

- « n est-il pair ? », « ce tableau est-il trié ? », « n est-il premier ? » : décidables.
- « Ce programme s'arrête-t-il sur cette entrée ? » : **indécidable**.

Indécidable ne veut pas dire « difficile » ou « trop long » : cela veut dire qu'**aucun** algorithme, même infiniment rapide, ne donne la bonne
réponse pour **toutes** les entrées.

## 4. Le problème de l'arrêt est indécidable

**Le problème** : étant donnés un programme P et une entrée e, le programme P, exécuté sur e, finit-il par s'arrêter, ou boucle-t-il
indéfiniment ? Un tel détecteur serait précieux pour trouver les bugs.

**Démonstration par l'absurde.** Supposons qu'il existe une fonction `arret(P, e)` qui renvoie toujours, en un temps fini, `True` si P
s'arrête sur e et `False` sinon. Comme un programme est une donnée, on peut écrire :

```python
def paradoxe(P):
    if arret(P, P):          # si P s'arrête quand on lui donne son propre code…
        while True:          # … alors paradoxe boucle indéfiniment
            pass
    else:
        return               # sinon, paradoxe s'arrête
```

Que se passe-t-il pour `paradoxe(paradoxe)` ?

- Si `paradoxe(paradoxe)` **s'arrête**, alors `arret(paradoxe, paradoxe)` vaut `True`, donc `paradoxe` entre dans la boucle infinie : il **ne
  s'arrête pas**. Contradiction.
- Si `paradoxe(paradoxe)` **ne s'arrête pas**, alors `arret(paradoxe, paradoxe)` vaut `False`, donc `paradoxe` fait `return` : il **s'arrête**.
  Contradiction.

Dans les deux cas, c'est impossible : la fonction `arret` **ne peut pas exister**. Le problème de l'arrêt est **indécidable**.

:::remarque[Ce que cela ne dit pas]
On peut très bien savoir que **certains** programmes s'arrêtent (une boucle `for` sur un tableau) ou bouclent (`while True: pass`). Ce qui est
impossible, c'est un **seul** programme qui réponde correctement pour **tous** les programmes. Les outils d'analyse de code donnent donc des
avertissements, jamais des certitudes sur tout.
:::

Le même raisonnement montre que beaucoup d'autres questions sur les programmes sont indécidables : « ce programme est-il un virus ? », « ces
deux programmes calculent-ils la même chose ? ». C'est pourquoi aucun antivirus ne peut être parfait.

## Les erreurs classiques des élèves

:::attention[Ce que tu verras en classe]
- **Confondre indécidable et « trop long à calculer »** ou « pas encore résolu ».
- **Croire qu'on ne peut jamais savoir si un programme s'arrête** : on le peut pour beaucoup de programmes particuliers.
- **Ne pas voir l'étape clé** : on donne à `paradoxe` son **propre** code comme donnée.
- **Croire qu'un langage plus moderne pourrait résoudre le problème de l'arrêt.**
- **Confondre la machine de Turing (modèle théorique) et un ordinateur réel** (mémoire finie).
:::

## En classe

:::methode[Activités qui marchent]
1. **Programmes qui manipulent des programmes** : un script qui compte les lignes ou les fonctions d'un fichier Python, `exec`, `eval`.
2. **Simulateur de machine de Turing** (en ligne ou en Python) : additionner 1 à un nombre binaire, recopier un mot.
3. **Paradoxes** : le paradoxe du menteur, le barbier qui rase tous ceux qui ne se rasent pas eux-mêmes ; même structure que la preuve.
4. **Histoire** : Hilbert et son programme, Gödel, Turing et Enigma, Church.
:::

## L'essentiel

- Un **programme est une donnée** : lu, traduit, exécuté, transmis par d'autres programmes (interpréteur, compilateur, OS) ; en Python, les
  fonctions sont des valeurs.
- **Machine de Turing** : ruban, tête, règles ; les langages usuels sont **Turing-complets** : la calculabilité **ne dépend pas du langage**.
- **Décidable** : un algorithme répond correctement pour toute entrée en un temps fini.
- Le **problème de l'arrêt est indécidable** (Turing, 1936) : preuve par l'absurde avec `paradoxe(paradoxe)`.

## Exercices

::::exercice[Grand QCM : calculabilité]{niveau=1 type=quiz}
Dix questions sur la calculabilité et la décidabilité.

1. Pourquoi peut-on dire qu'un programme est une donnée ?

   - [ ] parce qu'il contient des nombres
   - [x] parce que d'autres programmes le lisent, le traduisent ou l'exécutent
   - [ ] parce qu'il est stocké dans une base de données
   - [ ] ce n'est pas vrai

   > Interpréteur, compilateur, système d'exploitation, antivirus.

1. Que fait un interpréteur Python ?

   - [ ] il traduit du français en Python
   - [x] il lit le texte d'un programme Python et l'exécute
   - [ ] il corrige les bugs
   - [ ] il compresse le programme

   > Le programme est la donnée de l'interpréteur.

1. Qui a inventé le modèle de la machine de Turing ?

   - [ ] John von Neumann
   - [x] Alan Turing
   - [ ] Ada Lovelace
   - [ ] Edsger Dijkstra

   > En 1936, avant les premiers ordinateurs.

1. Un problème calculable en C l'est-il aussi en Python ?

   - [x] oui, les langages usuels calculent les mêmes fonctions
   - [ ] non, C est plus puissant
   - [ ] non, Python est plus puissant
   - [ ] seulement s'il est court

   > Ils sont tous Turing-complets.

1. Qu'est-ce qu'un problème décidable ?

   - [ ] un problème facile
   - [x] un problème pour lequel un algorithme répond correctement pour toute entrée en un temps fini
   - [ ] un problème déjà résolu par un humain
   - [ ] un problème à plusieurs réponses

   > Oui ou non, toujours, et en un temps fini.

1. « Ce nombre est-il premier ? » est un problème :

   - [x] décidable
   - [ ] indécidable
   - [ ] ni l'un ni l'autre
   - [ ] impossible à poser

   > On peut tester les diviseurs.

1. Que signifie « le problème de l'arrêt est indécidable » ?

   - [ ] aucun programme ne s'arrête
   - [ ] on ne peut jamais savoir si un programme s'arrête
   - [x] aucun programme ne peut dire correctement, pour tout programme et toute entrée, s'il s'arrête
   - [ ] les ordinateurs actuels sont trop lents pour le résoudre

   > Pour certains programmes particuliers, on peut le savoir.

1. Quel type de raisonnement prouve l'indécidabilité de l'arrêt ?

   - [ ] une récurrence
   - [x] un raisonnement par l'absurde
   - [ ] un calcul de coût
   - [ ] une expérience sur ordinateur

   > On suppose que `arret` existe et on aboutit à une contradiction.

1. Dans la preuve, que reçoit `paradoxe` comme argument ?

   - [ ] un nombre entier
   - [x] son propre code
   - [ ] la fonction `arret`
   - [ ] rien

   > C'est possible parce qu'un programme est une donnée.

1. Peut-on écrire un antivirus qui détecte parfaitement tous les virus ?

   - [ ] oui, avec assez de mémoire
   - [x] non, c'est un problème indécidable du même type que l'arrêt
   - [ ] oui, en Python
   - [ ] oui, si on connaît tous les virus existants

   > Les antivirus réels font des compromis (signatures, comportements suspects).
::::

::::exercice[Des fonctions comme données]{niveau=1}
Écris `appliquer_n_fois(f, n, x)` qui renvoie f(f(…f(x))) avec n applications de f (x si n = 0), et `meilleur(t, critere)` qui renvoie l'élément
du tableau non vide `t` qui donne la plus grande valeur de `critere` (une fonction).

```python depart
def appliquer_n_fois(f, n, x):
    ...

def meilleur(t, critere):
    ...
```

```python tests
def double(x):
    return 2 * x
assert appliquer_n_fois(double, 10, 1) == 1024, "dix doublements"
assert appliquer_n_fois(double, 0, 7) == 7, "aucune application"
assert appliquer_n_fois(str.upper, 1, "nsi") == "NSI", "fonction sur les chaînes"
assert meilleur(["le", "chat", "dort"], len) == "chat", "mot le plus long (premier rencontré)"
assert meilleur([-5, 3, -8], abs) == -8, "plus grande valeur absolue"
```

:::corrige
```python solution
def appliquer_n_fois(f, n, x):
    for i in range(n):
        x = f(x)
    return x

def meilleur(t, critere):
    m = t[0]
    for x in t:
        if critere(x) > critere(m):
            m = x
    return m
```

`f` et `critere` sont des **fonctions reçues en paramètre** : le même code marche avec `double`, `str.upper`, `len` ou `abs`.
:::
::::

::::exercice[Un programme qui lit un programme]{niveau=2}
Écris `analyser(code)` qui reçoit le **texte** d'un programme Python et renvoie un dictionnaire avec le nombre de lignes non vides (`"lignes"`),
la liste des noms des fonctions définies (`"fonctions"`, dans l'ordre, une ligne `def nom(...)` pouvant être indentée) et le nombre de boucles
(`"boucles"` : lignes qui commencent, après l'indentation, par `for ` ou `while `).

```python depart
def analyser(code):
    ...
```

```python tests
programme = '''def carre(x):
    return x * x

def somme(t):
    s = 0
    for x in t:
        s = s + carre(x)
    return s

while False:
    pass
'''
r = analyser(programme)
assert r["lignes"] == 9, "lignes non vides"
assert r["fonctions"] == ["carre", "somme"], "fonctions"
assert r["boucles"] == 2, "boucles"
assert analyser("") == {"lignes": 0, "fonctions": [], "boucles": 0}, "programme vide"
```

:::corrige
```python solution
def analyser(code):
    lignes = 0
    fonctions = []
    boucles = 0
    for ligne in code.split("\n"):
        l = ligne.strip()
        if l == "":
            continue
        lignes = lignes + 1
        if l.startswith("def "):
            fonctions.append(l[4:l.index("(")])
        if l.startswith("for ") or l.startswith("while "):
            boucles = boucles + 1
    return {"lignes": lignes, "fonctions": fonctions, "boucles": boucles}
```

Le programme analysé n'est jamais exécuté : il est traité comme un simple **texte**. C'est ce que font, en bien plus élaboré, les éditeurs, les
correcteurs de style et les compilateurs.
:::
::::

::::exercice[Une machine de Turing]{niveau=2}
Avec le simulateur fourni, écris les règles `ajoute_un` d'une machine qui ajoute 1 à un nombre écrit en binaire sur le ruban. La tête démarre sur
le premier chiffre (à gauche) dans l'état `"q0"`. Idée : aller à droite jusqu'au blanc (état `"q0"`), revenir d'une case et passer dans l'état
`"retenue"` ; en état retenue, un 1 devient 0 et on continue à gauche, un 0 devient 1 et on s'arrête (`"fin"`). Pour le cas `111`, la machine
doit écrire un 1 dans le blanc à gauche : le simulateur prolonge le ruban à gauche.

```python depart
def machine(ruban, regles, etat="q0"):
    ruban = list(ruban)
    tete = 0
    while etat != "fin":
        if tete < 0:
            ruban.insert(0, "_")
            tete = 0
        if tete == len(ruban):
            ruban.append("_")
        ecrit, direction, etat = regles[(etat, ruban[tete])]
        ruban[tete] = ecrit
        tete = tete + (1 if direction == "D" else -1)
    return "".join(ruban).strip("_")

ajoute_un = {
    ...
}
```

```python tests
assert machine("1011", ajoute_un) == "1100", "11 + 1 = 12"
assert machine("0", ajoute_un) == "1", "0 + 1"
assert machine("111", ajoute_un) == "1000", "retenue jusqu'au bout"
assert machine("100", ajoute_un) == "101", "sans retenue"
```

:::corrige
```python solution
def machine(ruban, regles, etat="q0"):
    ruban = list(ruban)
    tete = 0
    while etat != "fin":
        if tete < 0:
            ruban.insert(0, "_")
            tete = 0
        if tete == len(ruban):
            ruban.append("_")
        ecrit, direction, etat = regles[(etat, ruban[tete])]
        ruban[tete] = ecrit
        tete = tete + (1 if direction == "D" else -1)
    return "".join(ruban).strip("_")

ajoute_un = {
    ("q0", "0"): ("0", "D", "q0"),
    ("q0", "1"): ("1", "D", "q0"),
    ("q0", "_"): ("_", "G", "retenue"),
    ("retenue", "1"): ("0", "G", "retenue"),
    ("retenue", "0"): ("1", "G", "fin"),
    ("retenue", "_"): ("1", "G", "fin"),
}
```

Six règles suffisent pour additionner 1 à n'importe quel nombre binaire. Avec suffisamment de règles, une machine de Turing calcule tout ce que
calcule Python.
:::
::::

::::exercice[Expliquer l'indécidabilité de l'arrêt]{niveau=2}
Un élève affirme : « Avec un ordinateur assez puissant, on pourra un jour écrire un programme qui détecte toutes les boucles infinies. » Réponds-
lui en expliquant la preuve de Turing avec tes mots, et en précisant ce que l'on peut quand même faire en pratique.

:::criteres
- Ce n'est pas une question de puissance : c'est une impossibilité logique.
- Preuve : supposer `arret` ; construire `paradoxe` qui fait le contraire de ce que prédit `arret` sur lui-même ; contradiction dans les deux
  cas.
- Rôle clé : un programme est une donnée (on donne à `paradoxe` son propre code).
- En pratique : on détecte certains cas, on donne des avertissements, on prouve l'arrêt de programmes particuliers (variants).
:::

:::corrige
Ce n'est pas une question de puissance : c'est **logiquement impossible**, Turing l'a démontré en 1936. Imagine qu'un tel détecteur existe :
`arret(P, e)` dit toujours, sans se tromper, si le programme P s'arrête sur l'entrée e. Comme un programme est une donnée, je peux écrire un
programme `paradoxe` qui prend un programme P, demande au détecteur ce que fait P quand on lui donne **son propre code**, et fait **exactement
le contraire** : il boucle si le détecteur dit « s'arrête », il s'arrête si le détecteur dit « boucle ». Maintenant, je lance `paradoxe` sur son
propre code. S'il s'arrête, c'est que le détecteur a dit « boucle », donc le détecteur s'est trompé. S'il boucle, c'est que le détecteur a dit
« s'arrête », donc il s'est encore trompé. Dans tous les cas, le détecteur se trompe : il ne peut pas exister, quelle que soit la puissance de la
machine.

En pratique, on peut quand même **beaucoup** : les outils d'analyse repèrent des cas fréquents (`while True` sans `break`), donnent des
avertissements, et pour un programme particulier, on peut **prouver** qu'il s'arrête avec un **variant** de boucle. Ce qui est impossible, c'est
un outil qui ne se trompe **jamais**, pour **tous** les programmes.
:::
::::
