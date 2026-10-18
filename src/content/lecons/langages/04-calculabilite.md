---
titre: Calculabilité et décidabilité
resume: Ce qu'un programme peut et ne peut pas calculer — programmes comme données, machines de Turing, thèse de Church-Turing, indécidabilité du problème de l'arrêt par l'absurde, et quelques problèmes indécidables ou difficiles.
duree: 65
objectifs:
  - Expliquer qu'un programme est une donnée que d'autres programmes manipulent (interpréteurs, compilateurs)
  - Décrire une machine de Turing et en simuler une
  - Démontrer par l'absurde que le problème de l'arrêt est indécidable
  - Distinguer indécidable, non résolu et difficile (P, NP)
prerequis: [maths/raisonnements, langages/automates, algo/recursivite]
programme: [nsit-calculabilite, m-automates, nsit-langages]
cartes:
  - q: Que signifie « un programme est une donnée » ?
    r: "Le texte d'un programme peut être lu, analysé, transformé ou exécuté par un autre programme : interpréteur, compilateur, débogueur, antivirus, système d'exploitation qui charge un exécutable."
  - q: Qu'est-ce qu'une machine de Turing ?
    r: "Un modèle de calcul (Turing, 1936) : un ruban infini de cases, une tête de lecture/écriture, un nombre fini d'états et une table de transitions (état, symbole lu) → (symbole écrit, déplacement, nouvel état)."
  - q: Thèse de Church-Turing ?
    r: "Tout ce qui est calculable par un procédé effectif (un algorithme) est calculable par une machine de Turing. Tous les langages de programmation usuels ont la même puissance de calcul."
  - q: Qu'est-ce qu'un problème décidable ?
    r: "Un problème (à réponse oui/non) est décidable s'il existe un algorithme qui, pour **toute** entrée, termine et donne la bonne réponse."
  - q: Le problème de l'arrêt ?
    r: "Décider, pour un programme $P$ et une entrée $x$, si $P$ s'arrête sur $x$. Turing a montré (1936) qu'**aucun** programme ne peut le faire pour tous les $P$ et $x$ : il est indécidable."
  - q: Idée de la preuve de l'indécidabilité de l'arrêt ?
    r: "Par l'absurde : si `arret(p, x)` existait, on écrirait `paradoxe(p)` qui boucle si `arret(p, p)` est vrai et s'arrête sinon ; `paradoxe(paradoxe)` s'arrête si et seulement s'il ne s'arrête pas : contradiction."
  - q: "Indécidable, non résolu, difficile : quelle différence ?"
    r: "**Indécidable** : on a **prouvé** qu'aucun algorithme n'existe (arrêt). **Non résolu** : on ne sait pas encore (conjecture de Syracuse). **Difficile** : un algorithme existe mais on n'en connaît pas d'efficace (SAT, voyageur de commerce : NP-complets)."
---

Les leçons précédentes ont montré ce que des automates **ne peuvent pas** faire (compter sans limite). Avec un vrai langage de programmation, la mémoire
n'est plus bornée : peut-on alors **tout** calculer ? Non. Il existe des problèmes parfaitement bien posés qu'**aucun** programme ne résoudra jamais, et on
peut le **démontrer**. C'est l'un des résultats fondateurs de l'informatique (Turing, 1936), au programme de terminale NSI.

## 1. Un programme est une donnée

Le texte d'un programme est une chaîne de caractères : d'autres programmes peuvent le lire, l'analyser, le transformer, l'exécuter.

```python exec
source = """
def carre(x):
    return x * x
print(carre(12))
"""
print("le programme fait", len(source.splitlines()), "lignes et contient", source.count("x"), "fois la lettre x")
exec(source)                               # Python exécute un programme reçu comme donnée

import ast
arbre = ast.parse(source)                  # … ou l'analyse sans l'exécuter
print([type(n).__name__ for n in arbre.body])
```

C'est ce que font un **interpréteur** (Python exécute votre fichier), un **compilateur** (il traduit un programme en un autre), un **système d'exploitation**
(il charge un exécutable en mémoire), un **antivirus** (il analyse des programmes) — et c'est le principe de von Neumann : le programme est en mémoire comme
les données. Une conséquence vertigineuse : un programme peut s'analyser **lui-même**.

## 2. Les machines de Turing

Pour raisonner sur « tout ce qui est calculable », il faut un modèle précis. Alan Turing propose en 1936 une machine très simple :

:::definition[Machine de Turing]
Un **ruban** infini divisé en cases (chacune contient un symbole, ou un blanc), une **tête** placée sur une case, un **état** courant parmi un nombre fini, et
une **table de transitions** : pour chaque (état, symbole lu), elle indique le symbole à **écrire**, le **déplacement** de la tête (gauche ou droite) et le
**nouvel état**. La machine s'arrête quand aucune transition ne s'applique (ou dans un état d'arrêt).
:::

```python exec
def turing(table, ruban, etat="debut", max_etapes=10_000):
    cases = dict(enumerate(ruban))              # ruban « infini » : cases absentes = blanc "_"
    tete = 0
    for _ in range(max_etapes):
        lu = cases.get(tete, "_")
        if (etat, lu) not in table:
            break                               # aucune transition : arrêt
        ecrit, deplacement, etat = table[(etat, lu)]
        cases[tete] = ecrit
        tete += 1 if deplacement == "D" else -1
    lisible = "".join(cases.get(i, "_") for i in range(min(cases), max(cases) + 1))
    return lisible.strip("_"), etat

# Ajouter 1 à un nombre binaire : aller à droite jusqu'au bout, puis propager la retenue vers la gauche
incrementer = {
    ("debut", "0"): ("0", "D", "debut"), ("debut", "1"): ("1", "D", "debut"),
    ("debut", "_"): ("_", "G", "retenue"),
    ("retenue", "1"): ("0", "G", "retenue"),
    ("retenue", "0"): ("1", "G", "fin"), ("retenue", "_"): ("1", "G", "fin"),
}
for n in ["1011", "111", "0"]:
    print(n, "→", turing(incrementer, n))
```

:::retenir[Thèse de Church-Turing]
Tout ce qui peut être calculé par un **algorithme** peut l'être par une machine de Turing. Python, Java, C, une machine de Turing, le λ-calcul de Church : tous
calculent **exactement les mêmes fonctions** (ils diffèrent en confort et en vitesse, pas en puissance). Il existe même une machine de Turing **universelle**,
qui simule n'importe quelle autre à partir de sa description — l'ancêtre de l'ordinateur programmable.
:::

## 3. Le problème de l'arrêt est indécidable

Un problème à réponse oui/non est **décidable** s'il existe un algorithme qui, pour **toute** entrée, **termine** et répond correctement. Le **problème de
l'arrêt** : étant donnés un programme `p` et une entrée `x`, est-ce que `p(x)` finit par s'arrêter ? Il serait très utile (détecter les boucles infinies
dans les copies des élèves !). Mais :

:::retenir[Théorème (Turing, 1936)]
Il n'existe **aucun** programme `arret(p, x)` qui renvoie `True` si `p(x)` s'arrête et `False` sinon, pour **tous** les programmes `p` et toutes les entrées `x`.
:::

**Preuve par l'absurde.** Supposons qu'un tel programme `arret` existe. Écrivons alors :

```python
def paradoxe(p):
    if arret(p, p):          # si p s'arrête quand on lui donne son propre code…
        while True:          # … paradoxe boucle indéfiniment
            pass
    else:
        return 0             # sinon, paradoxe s'arrête
```

Que fait `paradoxe(paradoxe)` ?
- Si `paradoxe(paradoxe)` s'arrête, alors `arret(paradoxe, paradoxe)` vaut `True`, donc `paradoxe(paradoxe)` entre dans la boucle infinie : il ne s'arrête pas.
- S'il ne s'arrête pas, alors `arret(paradoxe, paradoxe)` vaut `False`, donc `paradoxe(paradoxe)` renvoie 0 : il s'arrête.

Dans les deux cas, contradiction. L'hypothèse est fausse : `arret` n'existe pas. ∎

C'est un **argument diagonal** (comme celui de Cantor pour montrer que les réels ne sont pas dénombrables) : on fait agir un programme sur son propre code.
L'ingrédient essentiel est justement le **programme comme donnée**.

:::attention[Ce que le théorème ne dit pas]
Il ne dit pas qu'on ne peut **jamais** savoir si un programme s'arrête : pour beaucoup de programmes, on le prouve (variant de boucle). Il dit qu'aucune
méthode **automatique** ne marche pour **tous**. Les outils d'analyse réels répondent « s'arrête », « boucle » ou « je ne sais pas ».
:::

## 4. D'autres limites

- Par **réduction** au problème de l'arrêt, beaucoup d'autres questions sont indécidables : deux programmes calculent-ils la même fonction ? Ce programme
  affiche-t-il un jour « bonjour » ? (Le **théorème de Rice** dit que toute propriété non triviale du comportement des programmes est indécidable.)
- Certains problèmes sont **non résolus** sans être prouvés indécidables : la **conjecture de Syracuse** (la suite $n \to n/2$ ou $3n+1$ atteint-elle toujours 1 ?) a
  été vérifiée sur des milliards de valeurs, mais personne ne sait la prouver.
- D'autres sont **décidables mais difficiles** : on sait les résoudre, mais on ne connaît que des algorithmes en temps exponentiel (SAT, voyageur de commerce,
  coloration). La classe **P** contient les problèmes résolubles en temps polynomial, **NP** ceux dont une solution se **vérifie** en temps polynomial ; savoir si
  P = NP est le plus célèbre problème ouvert de l'informatique.

:::prof
Programme de terminale NSI : « comprendre que tout programme est aussi une donnée », « comprendre que la calculabilité ne dépend pas du langage de
programmation utilisé », « montrer, sans formalisme théorique, que le problème de l'arrêt est indécidable ». Le dialogue « paradoxe » se joue très bien en
classe (un élève joue l'oracle, un autre le paradoxe). Les élèves confondent souvent « indécidable » et « pas encore trouvé » : la conjecture de Syracuse
est un bon contrepoint.
:::

## Exemple guidé

**Problème.** Le programme suivant s'arrête-t-il pour tout entier $n \ge 1$ ?

```python exec
def syracuse(n):
    etapes = 0
    while n != 1:
        n = n // 2 if n % 2 == 0 else 3 * n + 1
        etapes += 1
    return etapes

print([syracuse(n) for n in range(1, 16)])
print(max(range(1, 10_000), key=syracuse), "est, sous 10 000, le départ le plus long :", syracuse(max(range(1, 10_000), key=syracuse)), "étapes")
```

**1. Ce qu'on peut faire** : l'essayer. Il s'arrête pour toutes les valeurs testées (et pour toutes celles jusqu'à plus de $10^{20}$, vérifiées par ordinateur).

**2. Ce qu'on ne peut pas faire** : en déduire qu'il s'arrête toujours. Il n'y a pas de variant évident : $n$ augmente parfois ($3n + 1$).

**3. Le lien avec le théorème** : ce n'est pas parce que l'arrêt est indécidable **en général** que ce programme-là est impossible à analyser ; c'est un problème
mathématique **ouvert**. Inversement, un « détecteur de boucles infinies » universel aurait résolu la conjecture… en une seconde : c'est une façon de sentir
pourquoi il ne peut pas exister.

## L'essentiel

- Un programme est une donnée : interpréteurs, compilateurs, systèmes, analyseurs ; `exec`, `ast` en Python.
- Machine de Turing : ruban infini, tête, états finis, table (état, lu) → (écrit, déplacement, état) ; machine universelle.
- **Church-Turing** : tous les modèles de calcul raisonnables (et tous les langages) calculent les mêmes fonctions.
- **Arrêt indécidable** (Turing 1936) : preuve par l'absurde avec `paradoxe(paradoxe)` (argument diagonal) ; théorème de Rice.
- Indécidable (prouvé impossible) ≠ non résolu (Syracuse) ≠ difficile (NP-complet : SAT, voyageur de commerce) ; P = NP ? reste ouvert.

## Exercices

::::exercice[Que dit le théorème ?]{niveau=1}
Laquelle de ces affirmations découle du théorème de Turing sur l'arrêt ?

- [ ] On ne peut jamais savoir si un programme donné s'arrête
- [x] Aucun programme ne peut décider correctement l'arrêt de tous les programmes sur toutes les entrées
- [ ] Les programmes Python s'arrêtent toujours
- [ ] Un ordinateur plus puissant pourrait résoudre le problème de l'arrêt

:::corrige
Le théorème porte sur l'existence d'une méthode **universelle**. Pour un programme particulier, on peut souvent prouver qu'il s'arrête ; et la puissance de la
machine n'y change rien : c'est une impossibilité logique, pas un manque de vitesse.
:::
::::

::::exercice[Indécidable ou ouvert ?]{niveau=1}
La conjecture de Syracuse (« la suite atteint toujours 1 ») est :

- [ ] un problème prouvé indécidable
- [x] un problème ouvert : on ne sait ni la démontrer ni la réfuter
- [ ] fausse, car un contre-exemple est connu
- [ ] démontrée par ordinateur

:::corrige
Elle est vérifiée pour un nombre gigantesque de valeurs, mais une vérification n'est pas une preuve, et aucun contre-exemple n'est connu : c'est un problème
**ouvert**. Indécidable voudrait dire qu'on a **prouvé** qu'aucun algorithme ne peut répondre, ce qui n'est pas le cas.
:::
::::

::::exercice[Simuler une machine de Turing]{niveau=2}
Écris `executer_turing(table, ruban, etat, max_etapes)` qui simule une machine de Turing (transitions `(état, lu) → (écrit, "G" ou "D", nouvel état)`, blanc
noté `"_"`, tête au départ sur la case 0) et renvoie le couple (contenu du ruban sans les blancs aux extrémités, nombre d'étapes effectuées), ou `None` si la
machine ne s'est pas arrêtée après `max_etapes` étapes.

```python depart
def executer_turing(table, ruban, etat, max_etapes):
    ...
```

```python tests
inc = {("d", "0"): ("0", "D", "d"), ("d", "1"): ("1", "D", "d"), ("d", "_"): ("_", "G", "r"),
       ("r", "1"): ("0", "G", "r"), ("r", "0"): ("1", "G", "f"), ("r", "_"): ("1", "G", "f")}
assert executer_turing(inc, "1011", "d", 100) == ("1100", 8), "incrément"
assert executer_turing(inc, "111", "d", 100) == ("1000", 8), "retenues jusqu'au bout"
boucle = {("q", "_"): ("_", "D", "q")}
assert executer_turing(boucle, "", "q", 1000) is None, "machine qui ne s'arrête pas"
assert executer_turing({}, "abc", "q", 10) == ("abc", 0), "aucune transition : arrêt immédiat"
```

:::corrige
```python solution
def executer_turing(table, ruban, etat, max_etapes):
    cases = dict(enumerate(ruban))
    tete = 0
    for etape in range(max_etapes + 1):
        lu = cases.get(tete, "_")
        if (etat, lu) not in table:
            if not cases:
                return "", etape
            texte = "".join(cases.get(i, "_") for i in range(min(cases), max(cases) + 1))
            return texte.strip("_"), etape
        if etape == max_etapes:
            return None
        ecrit, sens, etat = table[(etat, lu)]
        cases[tete] = ecrit
        tete += 1 if sens == "D" else -1
```
Le ruban « infini » est un dictionnaire indice → symbole : les cases jamais écrites valent blanc, et les indices peuvent devenir négatifs. Le paramètre
`max_etapes` est indispensable : on ne peut pas savoir à l'avance si une machine s'arrêtera — c'est exactement le problème de l'arrêt.
:::
::::

::::exercice[Écrire une machine de Turing]{niveau=3}
Complète la table d'une machine qui reconnaît les mots de la forme $a^n b^n$ ($n \ge 0$) : elle doit s'arrêter dans l'état `"oui"` si le mot (écrit sur le
ruban) est de cette forme, et dans un autre état sinon. Idée : effacer un `a` à gauche (le remplacer par `_`), aller au bout, effacer le dernier `b`, revenir,
recommencer. Le simulateur `turing_etat` (fourni dans les tests) renvoie l'état final.

```python depart
table = {
    # état "debut" : la tête est sur le premier symbole non effacé
    ("debut", "_"): ("_", "D", "oui"),     # plus rien : le mot était de la forme a^n b^n
    # à compléter
}
```

```python tests
def turing_etat(table, ruban, etat="debut", max_etapes=100_000):
    cases, tete = dict(enumerate(ruban)), 0
    for _ in range(max_etapes):
        lu = cases.get(tete, "_")
        if (etat, lu) not in table:
            return etat
        ecrit, sens, etat = table[(etat, lu)]
        cases[tete] = ecrit
        tete += 1 if sens == "D" else -1
    return "boucle"
oui = ["", "ab", "aabb", "aaabbb"]
non = ["a", "b", "ba", "aab", "abb", "abab", "aabbb", "bbaa"]
assert all(turing_etat(table, m) == "oui" for m in oui), "mots de la forme a^n b^n"
assert all(turing_etat(table, m) != "oui" for m in non), "les autres mots sont refusés"
```

:::corrige
```python solution
table = {
    ("debut", "_"): ("_", "D", "oui"),
    ("debut", "a"): ("_", "D", "droite"),      # efface un a
    ("droite", "a"): ("a", "D", "droite"),     # va au bout du mot
    ("droite", "b"): ("b", "D", "droite"),
    ("droite", "_"): ("_", "G", "dernier"),
    ("dernier", "b"): ("_", "G", "retour"),    # efface le dernier b
    ("retour", "a"): ("a", "G", "retour"),     # revient au début
    ("retour", "b"): ("b", "G", "retour"),
    ("retour", "_"): ("_", "D", "debut"),
}
```
Les cas d'échec sont ceux où aucune transition ne s'applique : un `b` en tête (`("debut", "b")`), ou pas de `b` à la fin (`("dernier", "a")` ou `("dernier", "_")`) :
la machine s'arrête alors dans un état autre que `"oui"`. Ce langage n'est reconnu par **aucun automate fini**, mais une machine de Turing le reconnaît : elle
peut écrire sur son ruban, donc « compter » sans limite.
:::
::::

::::exercice[Rédiger la preuve de l'arrêt]{niveau=4 duree=25}
1. Rédigez la démonstration de l'indécidabilité du problème de l'arrêt comme vous l'attendriez d'un très bon élève de terminale.
2. Un élève objecte : « Il suffit de lancer le programme et d'attendre ; s'il s'arrête, on répond oui. » Que lui répondez-vous ?
3. Un autre propose : « On n'a qu'à limiter à une minute : si ça dure plus, on dit qu'il boucle. » Que lui répondez-vous ?
4. Montrez, par une réduction, que le problème « ce programme affiche-t-il un jour le mot `fin` ? » est lui aussi indécidable.

:::criteres
- Preuve complète : hypothèse d'existence de `arret`, construction de `paradoxe`, étude des deux cas de `paradoxe(paradoxe)`, contradiction, conclusion.
- Réponse 2 : on ne peut répondre « oui » qu'en cas d'arrêt ; si le programme boucle, on attend indéfiniment sans jamais répondre « non » (semi-décision).
- Réponse 3 : un programme peut s'arrêter après plus d'une minute (exemple concret) : la réponse serait fausse ; aucune borne fixe ne convient.
- Réduction correcte : à partir de `p` et `x`, construire un programme qui exécute `p(x)` sans rien afficher puis affiche `fin` ; un décideur pour « affiche fin » déciderait l'arrêt.
:::

:::corrige
1. *Supposons qu'il existe une fonction `arret(p, x)` qui, pour tout programme `p` et toute entrée `x`, termine et renvoie `True` si `p(x)` s'arrête, `False`
   sinon. Définissons `paradoxe(p)` : si `arret(p, p)` vaut `True`, il entre dans une boucle infinie, sinon il renvoie 0. Considérons `paradoxe(paradoxe)`.
   S'il s'arrête, alors `arret(paradoxe, paradoxe)` vaut `True` par définition d'`arret`, donc `paradoxe(paradoxe)` boucle : contradiction. S'il ne s'arrête
   pas, `arret(paradoxe, paradoxe)` vaut `False`, donc `paradoxe(paradoxe)` renvoie 0 et s'arrête : contradiction. L'hypothèse est donc fausse : aucun
   programme ne décide l'arrêt de tous les programmes.*
2. Lancer le programme permet de répondre « oui » **quand** il s'arrête, mais s'il ne s'arrête pas, on attend **indéfiniment** sans jamais pouvoir répondre « non ».
   Une procédure de décision doit **toujours** terminer. (On dit que l'arrêt est **semi-décidable**.)
3. Certains programmes s'arrêtent après une minute et une seconde, ou après un siècle : la limite donnerait une réponse **fausse**. Quelle que soit la limite
   choisie, il existe des programmes qui s'arrêtent juste après (par exemple une boucle qui compte jusqu'à un nombre gigantesque).
4. Supposons qu'un programme `affiche_fin(q)` décide si `q` affiche un jour `fin`. Pour décider si `p(x)` s'arrête, construisons le programme `q` : « exécuter
   `p(x)` en supprimant ses affichages, puis afficher `fin` ». `q` affiche `fin` si et seulement si `p(x)` s'arrête. Donc `arret(p, x) = affiche_fin(q)` serait un
   décideur de l'arrêt, ce qui est impossible : `affiche_fin` n'existe pas. C'est le principe d'une **réduction**.
:::
::::
