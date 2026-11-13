---
titre: Calculabilité et décidabilité
resume: "Un programme est une donnée, tous les langages calculent la même chose, et certains problèmes n'ont pas de solution."
duree: 35
objectifs:
  - "Comprendre que tout programme est aussi une donnée"
  - "Comprendre que la calculabilité ne dépend pas du langage"
  - "Montrer que le problème de l'arrêt est indécidable"
---

Les ordinateurs deviennent toujours plus puissants. Pourrons-nous un jour tout calculer ? Alan Turing a montré en 1936 que **non** : certains problèmes n'auront **jamais** de programme pour les résoudre, quelle que soit la puissance de la machine.

## 1. Un programme est une donnée

Un programme est un fichier, comme une photo ou un texte. D'autres programmes le manipulent sans cesse :

- l'**interpréteur** Python lit ton programme et l'exécute ;
- un **compilateur** le traduit en langage machine ;
- le **système d'exploitation** le charge en mémoire ;
- un **antivirus** l'analyse ;
- un programme de **téléchargement** le copie.

En Python, une fonction peut même être passée en paramètre à une autre fonction :

```python exec
def appliquer(f, t):
    return [f(x) for x in t]

print(appliquer(len, ["NSI", "bac"]))
```

Ici, la fonction `len` est une donnée transmise à `appliquer`.

## 2. Tous les langages calculent les mêmes choses

Python, C, Java ou JavaScript diffèrent par leur écriture, leur confort et leur vitesse. Mais ce qu'un langage peut calculer, un autre peut le calculer aussi. Turing a décrit un modèle très simple de machine, la **machine de Turing**, qui calcule exactement les mêmes choses que tous ces langages. La **calculabilité** ne dépend donc pas du langage.

## 3. Le problème de l'arrêt

Un problème est **décidable** s'il existe un programme qui donne la bonne réponse, oui ou non, pour **toute** entrée, en un temps fini.

:::exemple
« Ce nombre est-il premier ? » est décidable : on essaie tous les diviseurs possibles, et on finit toujours par répondre.
:::

Le **problème de l'arrêt** pose la question : « Le programme P s'arrête-t-il quand on lui donne l'entrée e ? » Ce serait très utile pour détecter les boucles infinies. Turing a prouvé qu'aucun programme ne peut y répondre dans tous les cas.

### La preuve, par l'absurde

On **suppose** qu'il existe une fonction `arret(P, e)` qui répond toujours correctement : `True` si P s'arrête sur e, `False` sinon. On écrit alors un programme qui fait exprès le contraire de ce qu'elle prédit :

```python
def paradoxe(P):
    if arret(P, P):
        while True:
            pass
```

`paradoxe(P)` boucle sans fin si `arret` prédit que P s'arrête sur lui-même, et s'arrête sinon.

Que fait `paradoxe(paradoxe)` ?

- **S'il s'arrête**, c'est qu'il n'est pas entré dans la boucle, donc `arret(paradoxe, paradoxe)` a répondu `False` : « il ne s'arrête pas ». La fonction s'est trompée.
- **S'il ne s'arrête pas**, c'est qu'il est entré dans la boucle, donc `arret(paradoxe, paradoxe)` a répondu `True` : « il s'arrête ». La fonction s'est encore trompée.

Dans les deux cas, `arret` se trompe : elle ne peut donc pas exister. Le problème de l'arrêt est **indécidable**.

Conséquence concrète : aucun logiciel ne pourra jamais détecter **toutes** les boucles infinies, ni tous les virus. On peut seulement faire des outils qui réussissent souvent.

## L'essentiel

- Un programme est une donnée pour d'autres programmes : interpréteur, compilateur, système, antivirus.
- Tous les langages usuels calculent les mêmes choses.
- Décidable : un programme répond correctement pour toute entrée, en temps fini.
- Le problème de l'arrêt est indécidable : la preuve est un raisonnement par l'absurde.

## Exercices

::::exercice[QCM : calculabilité]{niveau=1 type=quiz}
Une question à la fois : la correction s'affiche aussitôt.

1. Pourquoi peut-on dire qu'un programme est une donnée ?

   - [ ] parce qu'il contient des nombres
   - [x] parce que d'autres programmes le lisent, le traduisent ou l'exécutent
   - [ ] parce qu'il est stocké dans une base de données
   - [ ] ce n'est pas vrai

   > Interpréteur, compilateur, système d'exploitation, antivirus.

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
::::

::::exercice[Décidable ?]{niveau=1 type=reponses}
Réponds par oui ou par non : ce problème est-il décidable ?

1. Ce tableau est-il trié ?

   - oui

1. Ce nombre est-il premier ?

   - oui

1. Ce programme s'arrête-t-il sur toute entrée donnée ?

   - non
::::

::::exercice[La preuve dans l'ordre]{niveau=2 type=ordre}
Remets dans l'ordre le raisonnement de Turing.

1. On suppose qu'une fonction `arret` répond toujours correctement.
1. On écrit `paradoxe`, qui boucle si `arret(P, P)` est vrai et s'arrête sinon.
1. On étudie `paradoxe(paradoxe)`.
1. S'il s'arrête, `arret` a répondu faux : c'est contradictoire.
1. S'il ne s'arrête pas, `arret` a répondu vrai : c'est contradictoire.
1. Donc `arret` ne peut pas exister.
::::

::::exercice[Des fonctions comme données]{niveau=2}
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

::::exercice[Expliquer l'indécidabilité de l'arrêt]{niveau=3}
Un camarade affirme : « Avec un ordinateur assez puissant, on pourra un jour écrire un programme qui détecte toutes les boucles infinies. » Réponds-
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
