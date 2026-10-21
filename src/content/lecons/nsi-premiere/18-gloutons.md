---
titre: Algorithmes gloutons
resume: "Le cours de première NSI sur les algorithmes gloutons : problèmes d'optimisation, principe du choix localement optimal sans retour en arrière, rendu de monnaie, problème du sac à dos, planification d'activités ; quand le glouton donne la solution optimale et quand il échoue."
duree: 50
objectifs:
  - "Reconnaître un problème d'optimisation et décrire une stratégie gloutonne"
  - "Écrire l'algorithme glouton du rendu de monnaie"
  - "Résoudre le problème du sac à dos par une stratégie gloutonne"
  - "Montrer sur un contre-exemple qu'un glouton n'est pas toujours optimal"
prerequis: [nsi-premiere/tris, nsi-premiere/parcours]
programme: [nsi1-algo]
cartes:
  - q: "Qu'est-ce qu'un algorithme glouton ?"
    r: "Un algorithme qui construit une solution étape par étape en faisant à chaque fois le **choix qui semble le meilleur sur le moment** (localement optimal), **sans jamais revenir** sur ses choix."
  - q: "Glouton du rendu de monnaie ?"
    r: "Rendre à chaque étape la **plus grande pièce** possible qui ne dépasse pas la somme restante."
  - q: "Le glouton du rendu de monnaie est-il toujours optimal ?"
    r: "Pour le système euro, oui. Pas pour tout système : avec des pièces de 1, 3 et 4, rendre 6 donne 4 + 1 + 1 (3 pièces) au lieu de 3 + 3 (2 pièces)."
  - q: "Glouton pour le sac à dos ?"
    r: "Trier les objets par **rapport valeur / masse** décroissant et les prendre dans cet ordre tant qu'ils rentrent. Rapide, mais pas toujours optimal."
  - q: "Avantage et inconvénient d'un glouton ?"
    r: "**Simple et rapide** (souvent un tri puis un parcours) ; mais la solution n'est **pas toujours optimale**."
  - q: "Planification d'activités : quel critère glouton est optimal ?"
    r: "Choisir à chaque fois l'activité **compatible qui finit le plus tôt** : il donne le nombre maximal d'activités."
---

Rendre la monnaie avec le moins de pièces, remplir un sac avec les objets les plus précieux, placer le plus de cours possible dans une salle : ce
sont des **problèmes d'optimisation**. Il existe souvent un nombre énorme de solutions possibles, et les essayer toutes est trop long. Les
**algorithmes gloutons** proposent une stratégie simple : à chaque étape, prendre ce qui paraît **le meilleur sur le moment**.

## Ce que dit le programme

Contenus : *algorithmes gloutons*. Capacités attendues : **résoudre un problème grâce à un algorithme glouton**. Le programme cite **le rendu de
monnaie** et **le problème du sac à dos**, et précise qu'il faut montrer que **l'algorithme glouton ne donne pas toujours une solution
optimale**. La comparaison avec une recherche exhaustive (essayer toutes les solutions) est l'occasion de parler de coût.

## 1. Le principe

Un algorithme **glouton** construit sa solution **pas à pas** :

1. à chaque étape, il fait le **choix localement optimal** (le meilleur choix immédiat) ;
2. il ne **revient jamais** en arrière.

C'est **rapide** et **simple**. Mais le meilleur choix immédiat ne mène pas toujours à la meilleure solution globale.

## 2. Le rendu de monnaie

Problème : rendre une somme avec **le moins de pièces possible**, en disposant de pièces de valeurs données (en quantité illimitée).

Stratégie gloutonne : rendre la **plus grande pièce** qui ne dépasse pas la somme restante, et recommencer.

```python exec
def rendu_glouton(somme, pieces):
    """pieces : valeurs triées par ordre décroissant. Renvoie les pièces rendues."""
    rendu = []
    for p in pieces:
        while somme >= p:
            rendu.append(p)
            somme = somme - p
    return rendu

euros = [200, 100, 50, 20, 10, 5, 2, 1]       # en euros (billets et pièces)
print(rendu_glouton(87, euros))
```

Pour 87 € : 50 + 20 + 10 + 5 + 2 = 5 billets et pièces, ce qui est optimal. On peut montrer que pour le **système euro**, le glouton donne
**toujours** la solution optimale (on dit que le système est *canonique*).

Mais avec un autre système de pièces :

```python exec
def rendu_glouton(somme, pieces):
    rendu = []
    for p in pieces:
        while somme >= p:
            rendu.append(p)
            somme = somme - p
    return rendu

print(rendu_glouton(6, [4, 3, 1]))       # 3 pièces, alors que 3 + 3 en fait 2
```

Le glouton prend 4 (le meilleur choix immédiat) et se retrouve à rendre 2 avec des pièces de 1. La solution optimale, 3 + 3, commence par un
choix qui ne paraît pas le meilleur. **Le glouton n'est pas toujours optimal.**

## 3. Le problème du sac à dos

Un randonneur peut porter **15 kg** au plus. Il choisit parmi des objets ayant chacun une **masse** et une **valeur** (utilité). But :
**maximiser la valeur** totale sans dépasser la masse maximale.

| Objet | Masse (kg) | Valeur | Valeur / masse |
| --- | --- | --- | --- |
| A | 12 | 40 | 3,3 |
| B | 2 | 10 | 5 |
| C | 4 | 18 | 4,5 |
| D | 6 | 24 | 4 |
| E | 1 | 3 | 3 |

Plusieurs critères gloutons sont possibles : prendre d'abord les objets les plus **précieux**, les plus **légers**, ou ceux qui ont le meilleur
**rapport valeur/masse**. Ce dernier est en général le plus efficace :

```python exec
def ratio(objet):
    return objet[2] / objet[1]

def sac_glouton(objets, masse_max):
    """objets : liste de (nom, masse, valeur). Renvoie les noms choisis."""
    tries = sorted(objets, key=ratio, reverse=True)
    choisis = []
    masse = 0
    for nom, m, v in tries:
        if masse + m <= masse_max:
            choisis.append(nom)
            masse = masse + m
    return choisis

objets = [("A", 12, 40), ("B", 2, 10), ("C", 4, 18), ("D", 6, 24), ("E", 1, 3)]
print(sac_glouton(objets, 15))
```

Le glouton prend B, C, D (12 kg, valeur 52), puis E (13 kg, valeur 55) ; A ne rentre plus. Ici, c'est optimal. Mais avec une capacité de 12 kg
et les objets X (masse 7, valeur 15), Y (6, 12) et Z (6, 12), le glouton prend X (meilleur rapport, 2,14) puis ne peut plus rien ajouter :
valeur 15, alors que Y + Z donnent 24.

Pour être sûr d'avoir l'optimum, il faudrait essayer **tous les sous-ensembles** d'objets : il y en a 2ⁿ (plus d'un million pour 20 objets,
plus d'un milliard de milliards pour 60). La **programmation dynamique**, vue en terminale, fait mieux.

## 4. La planification d'activités

Des activités ont chacune un horaire de début et de fin ; une salle ne peut en accueillir qu'une à la fois. Comment en placer **le plus
possible** ? Le critère glouton « choisir l'activité **compatible qui finit le plus tôt** » donne **toujours** la solution optimale : finir tôt
laisse le plus de place pour la suite. D'autres critères (la plus courte, celle qui commence le plus tôt) échouent sur des contre-exemples. Le
choix du **critère** est essentiel.

## Les erreurs classiques des élèves

:::attention[Ce que tu verras en classe]
- **Croire qu'un glouton est toujours optimal** parce qu'il marche sur l'exemple.
- **Oublier de trier** les pièces ou les objets avant le parcours.
- **Rendu de monnaie** : utiliser `if` au lieu de `while` (on ne rend chaque pièce qu'une fois).
- **Sac à dos** : s'arrêter au premier objet qui ne rentre pas, alors qu'un objet plus léger plus loin pourrait rentrer.
- **Confondre « rapide » et « optimal ».**
:::

## En classe

:::methode[Activités qui marchent]
1. **Rendu de monnaie** avec de vraies pièces, puis un système imaginaire (pièces de 1, 3, 4) : les élèves trouvent eux-mêmes le
   contre-exemple.
2. **Sac à dos** avec des objets réels et une balance ; comparer les critères (valeur, masse, rapport) en équipes.
3. **Planning de salle** : chaque groupe propose un critère, on cherche des contre-exemples.
4. **Recherche exhaustive** pour peu d'objets en Python : comparer au glouton, mesurer l'explosion du nombre de cas.
:::

## L'essentiel

- **Glouton** : à chaque étape, le **meilleur choix immédiat**, sans retour en arrière ; souvent un **tri** puis un **parcours**.
- **Rendu de monnaie** : la plus grande pièce possible ; optimal pour l'euro, **pas** pour tout système (1, 3, 4 pour rendre 6).
- **Sac à dos** : trier par **valeur/masse** décroissante et prendre ce qui rentre ; rapide mais **pas toujours optimal**.
- **Planification** : la compatible qui **finit le plus tôt** est optimale.
- L'optimum garanti exige souvent d'explorer **beaucoup** de solutions (2ⁿ pour le sac à dos).

## Exercices

::::exercice[Grand QCM : algorithmes gloutons]{niveau=1 type=quiz}
Dix questions sur les algorithmes gloutons.

1. Qu'est-ce qui caractérise un algorithme glouton ?

   - [ ] il essaie toutes les solutions
   - [x] il fait à chaque étape le meilleur choix immédiat, sans revenir en arrière
   - [ ] il est toujours optimal
   - [ ] il utilise la récursivité

   > Choix localement optimal, jamais remis en cause.

1. Quelles pièces le glouton rend-il pour 38 € avec le système euro ?

   - [ ] 10 + 10 + 10 + 5 + 2 + 1
   - [x] 20 + 10 + 5 + 2 + 1
   - [ ] 20 + 10 + 2 + 2 + 2 + 2
   - [ ] 20 + 5 + 5 + 5 + 2 + 1

   > Toujours la plus grande valeur possible.

1. Avec des pièces de 1, 3 et 4, combien de pièces le glouton rend-il pour 6 ?

   - [ ] 2
   - [x] 3
   - [ ] 4
   - [ ] 6

   > 4 + 1 + 1, alors que 3 + 3 suffit.

1. Le glouton du rendu de monnaie est-il optimal pour l'euro ?

   - [x] oui
   - [ ] non
   - [ ] seulement pour les sommes paires
   - [ ] seulement sous 100 €

   > Le système euro est dit canonique.

1. Dans le rendu de monnaie glouton, pourquoi utiliser `while somme >= p` plutôt que `if` ?

   - [ ] c'est plus rapide
   - [x] pour pouvoir rendre plusieurs fois la même pièce
   - [ ] pour éviter une erreur
   - [ ] c'est équivalent

   > Pour 40 €, on rend deux billets de 20.

1. Pour le sac à dos, quel critère glouton est en général le plus efficace ?

   - [ ] les objets les plus lourds d'abord
   - [ ] les objets les plus légers d'abord
   - [x] le meilleur rapport valeur/masse d'abord
   - [ ] l'ordre alphabétique

   > Il privilégie la valeur par kilo.

1. Combien de sous-ensembles faut-il examiner pour résoudre exactement le sac à dos par recherche exhaustive avec 20 objets ?

   - [ ] 20
   - [ ] 400
   - [x] environ un million (2²⁰)
   - [ ] 20 × 19

   > Chaque objet est pris ou non : 2 × 2 × … × 2.

1. Quel est le principal avantage d'un algorithme glouton ?

   - [x] il est simple et rapide
   - [ ] il donne toujours la meilleure solution
   - [ ] il n'a pas besoin de données
   - [ ] il revient sur ses choix

   > La rapidité se paie parfois par une solution non optimale.

1. Pour placer le plus d'activités possible dans une salle, quel critère glouton est optimal ?

   - [ ] la plus courte d'abord
   - [ ] celle qui commence le plus tôt
   - [x] la compatible qui finit le plus tôt
   - [ ] la plus longue d'abord

   > Elle libère la salle au plus vite pour les suivantes.

1. Un glouton donne la bonne réponse sur 10 exemples. On peut conclure :

   - [ ] qu'il est optimal
   - [x] rien de définitif : il faut une preuve ou chercher un contre-exemple
   - [ ] qu'il est faux
   - [ ] qu'il est rapide

   > Un seul contre-exemple suffit à montrer qu'un glouton n'est pas optimal.
::::

::::exercice[Rendu de monnaie]{niveau=1}
Écris `rendu(somme, pieces)` qui renvoie la liste des pièces rendues par l'algorithme glouton. Les valeurs de `pieces` ne sont **pas
forcément triées** : trie-les d'abord par ordre décroissant. On suppose qu'il existe une pièce de 1.

```python depart
def rendu(somme, pieces):
    ...
```

```python tests
assert rendu(87, [1, 2, 5, 10, 20, 50, 100, 200]) == [50, 20, 10, 5, 2], "euros"
assert rendu(0, [1, 2, 5]) == [], "rien à rendre"
assert rendu(6, [1, 3, 4]) == [4, 1, 1], "système non canonique"
assert rendu(40, [20, 10, 1]) == [20, 20], "même pièce deux fois"
```

:::corrige
```python solution
def rendu(somme, pieces):
    resultat = []
    for p in sorted(pieces, reverse=True):
        while somme >= p:
            resultat.append(p)
            somme = somme - p
    return resultat
```

Le troisième test montre la limite : 3 pièces alors que 3 + 3 en demande 2. L'algorithme est correct (il rend la bonne somme) mais pas
optimal pour ce système.
:::
::::

::::exercice[Sac à dos glouton]{niveau=2}
Écris `sac(objets, masse_max)` où `objets` est une liste de dictionnaires `{"nom": ..., "masse": ..., "valeur": ...}`. La fonction renvoie le
couple `(noms_choisis, valeur_totale)` obtenu par le glouton « meilleur rapport valeur/masse d'abord » ; un objet qui ne rentre pas est sauté,
on continue avec les suivants.

```python depart
def sac(objets, masse_max):
    ...
```

```python tests
objets = [
    {"nom": "A", "masse": 12, "valeur": 40},
    {"nom": "B", "masse": 2, "valeur": 10},
    {"nom": "C", "masse": 4, "valeur": 18},
    {"nom": "D", "masse": 6, "valeur": 24},
    {"nom": "E", "masse": 1, "valeur": 3},
]
assert sac(objets, 15) == (["B", "C", "D", "E"], 55), "capacité 15"
assert sac(objets, 0) == ([], 0), "sac vide"
piege = [{"nom": "X", "masse": 7, "valeur": 15}, {"nom": "Y", "masse": 6, "valeur": 12}, {"nom": "Z", "masse": 6, "valeur": 12}]
assert sac(piege, 12) == (["X"], 15), "glouton non optimal (Y + Z vaut 24)"
```

:::corrige
```python solution
def rapport(objet):
    return objet["valeur"] / objet["masse"]

def sac(objets, masse_max):
    noms = []
    masse = 0
    valeur = 0
    for o in sorted(objets, key=rapport, reverse=True):
        if masse + o["masse"] <= masse_max:
            noms.append(o["nom"])
            masse = masse + o["masse"]
            valeur = valeur + o["valeur"]
    return (noms, valeur)
```

Le dernier test est le contre-exemple du cours : X a le meilleur rapport, mais le prendre empêche de prendre Y et Z.
:::
::::

::::exercice[Planifier des activités]{niveau=2}
Des activités sont données par des couples `(debut, fin)` (en heures entières). Deux activités sont compatibles si l'une finit avant ou au
moment où l'autre commence. Écris `planning(activites)` qui renvoie la liste des activités choisies par le glouton « la compatible qui finit le
plus tôt », dans l'ordre chronologique.

```python depart
def planning(activites):
    ...
```

```python tests
acts = [(9, 12), (8, 10), (10, 11), (11, 14), (13, 15), (12, 13)]
assert planning(acts) == [(8, 10), (10, 11), (12, 13), (13, 15)], "quatre activités"
assert planning([]) == [], "aucune activité"
assert planning([(1, 5), (2, 3), (3, 4)]) == [(2, 3), (3, 4)], "la plus longue est écartée"
```

:::corrige
```python solution
def fin(activite):
    return activite[1]

def planning(activites):
    choisies = []
    fin_derniere = None
    for a in sorted(activites, key=fin):
        if fin_derniere is None or a[0] >= fin_derniere:
            choisies.append(a)
            fin_derniere = a[1]
    return choisies
```

On trie par heure de **fin**, puis on prend chaque activité qui commence après la fin de la dernière choisie. Ici : (8, 10), (10, 11), (12, 13),
(13, 15). Ce critère est prouvé optimal, contrairement à « la plus courte d'abord ».
:::
::::

::::exercice[Trouver un contre-exemple]{niveau=2}
Une élève propose, pour placer le plus d'activités dans une salle, le critère glouton « choisir d'abord l'activité la **plus courte** ». (a)
Trouve un exemple avec trois activités où ce critère donne une moins bonne solution que l'optimum. (b) Explique pourquoi un seul contre-exemple
suffit pour conclure.

:::criteres
- (a) Un exemple valide : une activité courte à cheval sur deux longues compatibles entre elles, par exemple (1, 5), (4, 6), (5, 10).
- La solution gloutonne (1 activité) et l'optimum (2 activités) sont donnés.
- (b) Pour affirmer « toujours optimal », il faut que ce soit vrai pour **tous** les cas ; un cas faux suffit à le réfuter.
:::

:::corrige
(a) Activités (1, 5), (4, 6) et (5, 10). La plus courte est (4, 6), de durée 2 : le glouton la choisit. Elle chevauche les deux autres, qui ne
sont plus compatibles : **1** activité. Or (1, 5) et (5, 10) sont compatibles entre elles : l'optimum est **2**. (b) Dire « ce critère est
optimal », c'est affirmer qu'il donne la meilleure solution pour **tous** les ensembles d'activités. Un seul exemple où il échoue suffit à
montrer que c'est faux. À l'inverse, montrer qu'un critère est optimal exige une **preuve**, pas des exemples.
:::
::::
