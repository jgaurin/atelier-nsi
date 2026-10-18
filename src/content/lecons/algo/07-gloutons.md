---
titre: Algorithmes gloutons
resume: Construire une solution pas à pas en faisant à chaque étape le meilleur choix local, et savoir quand cela donne (ou non) la solution optimale.
duree: 70
objectifs:
  - Décrire le principe d'un algorithme glouton et l'appliquer (rendu de monnaie, activités, sac à dos fractionnaire)
  - Prouver l'optimalité d'un glouton par un argument d'échange
  - Montrer qu'un glouton n'est pas optimal en exhibant un contre-exemple
  - Distinguer les problèmes résolus par un glouton de ceux qui demandent la programmation dynamique
prerequis: [algo/tris-simples, algo/complexite]
programme: [asd-gloutons, asd-preuve, nsi1-algo]
cartes:
  - q: Principe d'un algorithme glouton ?
    r: "Construire la solution étape par étape en faisant à chaque fois le choix qui semble le meilleur sur le moment, sans jamais revenir en arrière."
  - q: "Rendu de 6 avec les pièces {1, 3, 4} : que fait le glouton ? Est-ce optimal ?"
    r: "Glouton : 4 + 1 + 1 (3 pièces). Optimal : 3 + 3 (2 pièces). Le glouton n'est pas optimal pour ce système."
  - q: Quel critère glouton est optimal pour choisir le plus d'activités compatibles ?
    r: "Prendre, parmi les activités compatibles, celle qui **se termine le plus tôt**."
  - q: Comment prouver qu'un glouton est optimal ?
    r: "Souvent par un **argument d'échange** : on montre qu'une solution optimale peut être modifiée pour faire le même premier choix que le glouton sans être moins bonne, puis on recommence (récurrence)."
  - q: "Sac à dos fractionnaire ou 0/1 : lequel est résolu par un glouton ?"
    r: "Le fractionnaire (prendre par rapport valeur/poids décroissant). Pour le 0/1, le glouton peut échouer : programmation dynamique."
  - q: Coût typique d'un algorithme glouton ?
    r: "Souvent dominé par un tri préalable : $\\Theta(n \\log n)$."
---

Pour rendre 87 centimes avec le moins de pièces possible, on prend spontanément la plus grosse pièce qui ne dépasse pas :
50, puis 20, puis 10, puis 5, puis 2… Cette stratégie, « prendre le meilleur choix **maintenant** sans réfléchir à la
suite », s'appelle un algorithme **glouton**. Elle est simple et rapide, et donne parfois la meilleure solution possible —
mais pas toujours. Tout l'enjeu (et la question classique des épreuves) est de savoir **quand** elle est optimale, et de
le **justifier**.

## 1. Le principe

:::definition
Un algorithme **glouton** construit une solution d'un problème d'**optimisation** étape par étape : à chaque étape, il fait
le choix qui paraît **localement** le meilleur selon un critère fixé, et ne revient **jamais** sur ce choix.
:::

Il faut donc choisir un **critère** (la plus grosse pièce, l'activité qui finit le plus tôt, l'objet le plus rentable…).
Un glouton est en général rapide (souvent un tri puis un parcours : $\Theta(n \log n)$), mais rien ne garantit que des choix
localement bons mènent à une solution globalement optimale. Il faut une **preuve** d'optimalité, ou un **contre-exemple**.

## 2. Le rendu de monnaie

**Problème.** Rendre une somme `s` avec le moins de pièces possible, en disposant d'un nombre illimité de pièces de chaque
valeur d'un système donné.

```python exec
def rendu_glouton(s, pieces):
    """pieces : valeurs triées par ordre décroissant. Renvoie la liste des pièces rendues."""
    rendu = []
    for p in pieces:
        while s >= p:
            s -= p
            rendu.append(p)
    return rendu

euros = [200, 100, 50, 20, 10, 5, 2, 1]        # en centimes
print(rendu_glouton(87, euros))
print(rendu_glouton(6, [4, 3, 1]))
```

Avec les euros, le glouton est **optimal** (on dit que le système est **canonique**). Mais avec le système `{4, 3, 1}`,
pour rendre 6, il donne 4 + 1 + 1 (3 pièces) alors que 3 + 3 (2 pièces) est meilleur : **un seul contre-exemple suffit**
à montrer que le glouton n'est pas optimal pour ce système. (Le système britannique d'avant 1971, avec des pièces de
1, 3, 6, 12, 24 et 30 pence, n'était pas canonique : 48 = 30 + 12 + 6 en glouton, alors que 24 + 24 suffit.)

## 3. Choisir des activités compatibles

**Problème.** On dispose de créneaux `(debut, fin)` pour des activités qui utilisent la même salle. Deux activités sont
compatibles si leurs créneaux ne se chevauchent pas (l'une finit avant que l'autre commence). Trouver le **plus grand
nombre** d'activités compatibles.

Plusieurs critères gloutons viennent à l'esprit : la plus **courte**, celle qui **commence** le plus tôt, celle qui a le
moins de **conflits**… Le bon critère est : **celle qui se termine le plus tôt**. Intuition : elle laisse la salle libre
le plus longtemps possible pour la suite.

```python exec
def selection_activites(activites):
    """activites : liste de couples (debut, fin). Renvoie une sélection maximale."""
    choisies = []
    fin_derniere = float("-inf")
    for debut, fin in sorted(activites, key=lambda a: a[1]):   # tri par heure de fin
        if debut >= fin_derniere:
            choisies.append((debut, fin))
            fin_derniere = fin
    return choisies

creneaux = [(1, 4), (3, 5), (0, 6), (5, 7), (3, 9), (5, 9), (6, 10), (8, 11), (8, 12), (2, 14), (12, 16)]
print(selection_activites(creneaux))
```

| activité (tri par fin) | (1, 4) | (3, 5) | (0, 6) | (5, 7) | (3, 9) | (5, 9) | (6, 10) | (8, 11) | (8, 12) | (2, 14) | (12, 16) |
|---|---|---|---|---|---|---|---|---|---|---|---|
| choisie ?              | oui    | non    | non    | oui    | non    | non    | non     | oui     | non     | non     | oui      |

Coût : le tri en $\Theta(n \log n)$, puis un parcours linéaire.

## 4. Prouver l'optimalité : l'argument d'échange

:::methode[Prouver qu'un glouton est optimal (argument d'échange)]
1. Considérer une solution **optimale** quelconque $O$.
2. Montrer qu'on peut la **modifier** pour qu'elle fasse le **même premier choix** que le glouton, sans la rendre moins bonne.
3. Après ce premier choix, il reste un sous-problème de même nature : conclure par **récurrence**.
:::

Pour les activités : soit $a_1$ l'activité qui finit le plus tôt et $O$ une sélection optimale, ordonnée par heure de fin,
dont la première activité est $o_1$. Comme $a_1$ finit au plus tard quand $o_1$ finit, remplacer $o_1$ par $a_1$ dans $O$
ne crée aucun conflit avec les activités suivantes (qui commencent après la fin de $o_1$). On obtient une sélection
optimale (même nombre d'activités) qui commence par $a_1$. Il reste à choisir au mieux parmi les activités qui commencent
après la fin de $a_1$ : c'est le même problème, sur lequel le glouton fait encore le bon choix (récurrence).

Pour montrer au contraire qu'un critère est **mauvais**, un contre-exemple suffit. « La plus courte d'abord » : avec
`(0, 5)`, `(4, 6)`, `(5, 10)`, on choisit `(4, 6)`, incompatible avec les deux autres : 1 activité au lieu de 2.

## 5. Le sac à dos : fractionnaire ou entier

On veut emporter des objets de **poids** et de **valeur** donnés dans un sac de capacité limitée, en maximisant la valeur.

- **Sac à dos fractionnaire** : on peut prendre une **fraction** d'un objet (de la poudre d'or, du sable…). Le glouton qui
  prend les objets par **rapport valeur/poids décroissant** (et fractionne le dernier) est **optimal**.
- **Sac à dos 0/1** : chaque objet est pris entier ou pas du tout. Le même glouton **n'est pas optimal**.

```python exec
def sac_fractionnaire(objets, capacite):
    """objets : liste de (poids, valeur). Renvoie la valeur maximale emportée."""
    total = 0.0
    for poids, valeur in sorted(objets, key=lambda o: o[1] / o[0], reverse=True):
        if capacite <= 0:
            break
        pris = min(poids, capacite)
        total += valeur * pris / poids
        capacite -= pris
    return total

objets = [(10, 60), (20, 100), (30, 120)]     # (poids, valeur), rapports 6, 5, 4
print(sac_fractionnaire(objets, 50))
```

Pour le 0/1 avec ces trois objets et une capacité de 50, le glouton prend l'objet de rapport 6 puis celui de rapport 5
(poids 30, valeur 160) et ne peut plus prendre le troisième ; or `(20, 100) + (30, 120)` donne 220. Ce problème demande la
**programmation dynamique** (leçon suivante).

:::retenir
D'autres algorithmes célèbres sont gloutons et **optimaux** : Dijkstra (plus courts chemins), Prim et Kruskal (arbre
couvrant de poids minimal), Huffman (codage compressé). D'autres gloutons ne sont que des **heuristiques** : rapides,
souvent bonnes, sans garantie (coloration de graphe, voyageur de commerce par plus proche voisin).
:::

:::prof
Les algorithmes gloutons sont au programme de première NSI, avec le rendu de monnaie comme exemple classique et la
consigne de « mettre en évidence qu'un algorithme glouton ne donne pas toujours la solution optimale ». Faire chercher aux
élèves des systèmes de pièces non canoniques, ou des contre-exemples aux mauvais critères d'activités, est une excellente
activité de raisonnement. La preuve d'optimalité (échange) relève plutôt du niveau concours.
:::

## Exemple guidé

**Problème (type écrit 1).** Montrer que le rendu glouton est optimal pour le système `{1, 2, 5}`.

**1. Ce qu'on doit montrer.** Pour toute somme $s$, le glouton donne $\lfloor s/5 \rfloor$ pièces de 5, puis rend le reste
$r = s \bmod 5 \in \{0, …, 4\}$ avec des 2 et des 1 (au plus 2 pièces de 2 et 1 pièce de 1). Il faut montrer qu'aucune
solution n'utilise moins de pièces.

**2. Propriétés d'une solution optimale** $O$ (on raisonne par l'absurde à chaque fois) :
- $O$ contient **au plus une pièce de 1** : sinon, on remplacerait deux 1 par un 2 (une pièce de moins) ;
- $O$ contient **au plus deux pièces de 2** : sinon, on remplacerait trois 2 (= 6) par 5 + 1 (une pièce de moins) ;
- $O$ ne contient pas **à la fois deux 2 et un 1** : sinon, on remplacerait 2 + 2 + 1 par un 5.

**3. Conclusion.** La partie de $O$ en pièces de 1 et de 2 vaut donc au plus $2 + 2 = 4$ (ou $2 + 1 = 3$) : elle est
**strictement inférieure à 5**. Le reste de la somme est payé en pièces de 5. Donc $O$ contient exactement
$\lfloor s/5 \rfloor$ pièces de 5, et rend $r = s \bmod 5$ avec des 1 et des 2 — avec au plus un 1, donc
$\lfloor r/2 \rfloor$ pièces de 2 et $r \bmod 2$ pièce de 1. C'est exactement la solution gloutonne : elle est optimale.

**4. Vérification par programme** (sur toutes les sommes jusqu'à 100), en comparant avec une recherche exhaustive :

```python exec
def optimal(s, pieces):
    """Nombre minimal de pièces (programmation dynamique, voir la leçon suivante)."""
    meilleur = [0] + [float("inf")] * s
    for v in range(1, s + 1):
        for p in pieces:
            if p <= v:
                meilleur[v] = min(meilleur[v], meilleur[v - p] + 1)
    return meilleur[s]

def glouton(s, pieces):
    n = 0
    for p in sorted(pieces, reverse=True):
        n += s // p
        s %= p
    return n

print(all(glouton(s, [1, 2, 5]) == optimal(s, [1, 2, 5]) for s in range(101)))
print([s for s in range(30) if glouton(s, [1, 3, 4]) != optimal(s, [1, 3, 4])])
```

## L'essentiel

- Glouton : à chaque étape, le choix localement le meilleur selon un critère, sans retour en arrière. Rapide (souvent un tri).
- Il n'est pas toujours optimal : un **contre-exemple** suffit à le montrer (rendu de 6 avec {1, 3, 4}).
- Optimalité : **argument d'échange** + récurrence (sélection d'activités par fin croissante, rendu avec {1, 2, 5} ou les euros).
- Sac à dos **fractionnaire** : glouton par valeur/poids optimal. Sac à dos **0/1** : glouton non optimal → programmation dynamique.
- Gloutons optimaux célèbres : Dijkstra, Prim, Kruskal, Huffman.

## Exercices

::::exercice[Un système non canonique]{niveau=1}
Avec les pièces `{1, 3, 4}`, combien de pièces le rendu glouton utilise-t-il pour rendre 6, et combien en faut-il au minimum ?

- [ ] glouton 2, minimum 2
- [x] glouton 3, minimum 2
- [ ] glouton 3, minimum 3
- [ ] glouton 2, minimum 1

:::corrige
Glouton : 4, puis 1, puis 1 → 3 pièces. Mais 3 + 3 = 6 avec 2 pièces.
:::
::::

::::exercice[Le bon critère]{niveau=1}
Pour sélectionner le plus grand nombre d'activités compatibles, quel critère glouton est toujours optimal ?

- [ ] la plus courte d'abord
- [ ] celle qui commence le plus tôt d'abord
- [x] celle qui se termine le plus tôt d'abord
- [ ] celle qui est en conflit avec le plus d'autres d'abord

:::corrige
« Fin la plus tôt » est optimal (argument d'échange du cours). Les deux premiers critères ont des contre-exemples :
`(0, 10)` commence le plus tôt mais bloque `(1, 2)` et `(3, 4)` ; `(4, 6)` est la plus courte mais bloque `(0, 5)` et `(5, 10)`.
:::
::::

::::exercice[Rendu glouton]{niveau=2}
Écris `rendu_glouton(s, pieces)` qui renvoie la liste des pièces rendues par l'algorithme glouton pour la somme `s >= 0`.
La liste `pieces` n'est **pas** forcément triée et contient toujours 1.

```python depart
def rendu_glouton(s, pieces):
    ...
```

```python tests
assert rendu_glouton(87, [1, 2, 5, 10, 20, 50, 100, 200]) == [50, 20, 10, 5, 2], "87 centimes"
assert rendu_glouton(0, [1, 2, 5]) == [], "rien à rendre"
assert rendu_glouton(6, [1, 3, 4]) == [4, 1, 1], "système non canonique"
assert rendu_glouton(13, [5, 1, 2]) == [5, 5, 2, 1], "pièces non triées"
```

:::corrige
```python solution
def rendu_glouton(s, pieces):
    rendu = []
    for p in sorted(pieces, reverse=True):
        while s >= p:
            s -= p
            rendu.append(p)
    return rendu
```
On trie les pièces par valeur décroissante. Le nombre de tours de `while` peut être grand si une petite pièce est rendue
beaucoup de fois ; `s // p` et `s % p` permettent de calculer directement combien de pièces `p` rendre.
:::
::::

::::exercice[Sélection d'activités]{niveau=2}
Écris `nb_activites(creneaux)` qui renvoie le nombre maximal d'activités compatibles (une activité `(d, f)` est compatible
avec la précédente choisie si `d >= f_precedente`).

```python depart
def nb_activites(creneaux):
    ...
```

```python tests
c = [(1, 4), (3, 5), (0, 6), (5, 7), (3, 9), (5, 9), (6, 10), (8, 11), (8, 12), (2, 14), (12, 16)]
assert nb_activites(c) == 4, "exemple du cours"
assert nb_activites([]) == 0, "aucune activité"
assert nb_activites([(0, 5), (4, 6), (5, 10)]) == 2, "la plus courte n'est pas le bon choix"
assert nb_activites([(0, 10), (1, 2), (3, 4)]) == 2, "la plus précoce n'est pas le bon choix"
assert nb_activites([(1, 2), (2, 3), (3, 4)]) == 3, "activités qui se touchent"
```

:::corrige
```python solution
def nb_activites(creneaux):
    n = 0
    fin_derniere = float("-inf")
    for d, f in sorted(creneaux, key=lambda c: c[1]):
        if d >= fin_derniere:
            n += 1
            fin_derniere = f
    return n
```
Le tri par **heure de fin** est la clé. Coût : $\Theta(n \log n)$.
:::
::::

::::exercice[Sac à dos fractionnaire]{niveau=2}
Écris `sac_fractionnaire(objets, capacite)` qui renvoie la valeur maximale emportée quand on peut prendre des fractions
d'objets. `objets` est une liste de couples `(poids, valeur)` avec des poids strictement positifs.

```python depart
def sac_fractionnaire(objets, capacite):
    ...
```

```python tests
assert abs(sac_fractionnaire([(10, 60), (20, 100), (30, 120)], 50) - 240) < 1e-9, "exemple du cours"
assert abs(sac_fractionnaire([(10, 60)], 5) - 30) < 1e-9, "une moitié d'objet"
assert sac_fractionnaire([(4, 10)], 0) == 0, "capacité nulle"
assert abs(sac_fractionnaire([(1, 1), (1, 5), (1, 3)], 2) - 8) < 1e-9, "on prend les plus rentables"
```

:::corrige
```python solution
def sac_fractionnaire(objets, capacite):
    total = 0
    for poids, valeur in sorted(objets, key=lambda o: o[1] / o[0], reverse=True):
        if capacite <= 0:
            break
        pris = min(poids, capacite)
        total += valeur * pris / poids
        capacite -= pris
    return total
```
Exemple du cours : on prend les objets de rapports 6 et 5 entiers (poids 30, valeur 160), puis 20 kg sur 30 du dernier
(rapport 4) : $160 + 80 = 240$.
:::
::::

::::exercice[Coloration gloutonne]{niveau=3}
Colorier un graphe, c'est donner à chaque sommet un numéro de couleur (0, 1, 2…) de sorte que deux sommets voisins
n'aient jamais la même couleur. Le glouton parcourt les sommets dans un ordre donné et donne à chacun la **plus petite
couleur** non utilisée par ses voisins déjà coloriés. Écris `coloration(graphe, ordre)` qui renvoie le dictionnaire
sommet → couleur. Le graphe est un dictionnaire sommet → liste de voisins.

```python depart
def coloration(graphe, ordre):
    ...
```

```python tests
cycle4 = {"a": ["b", "d"], "b": ["a", "c"], "c": ["b", "d"], "d": ["c", "a"]}
assert coloration(cycle4, ["a", "b", "c", "d"]) == {"a": 0, "b": 1, "c": 0, "d": 1}, "cycle de longueur 4"
triangle = {1: [2, 3], 2: [1, 3], 3: [1, 2]}
assert sorted(coloration(triangle, [1, 2, 3]).values()) == [0, 1, 2], "triangle : 3 couleurs"
g = {1: [4], 2: [3], 3: [2], 4: [1]}
assert max(coloration(g, [1, 3, 2, 4]).values()) == 1, "deux arêtes isolées : 2 couleurs"
```

:::corrige
```python solution
def coloration(graphe, ordre):
    couleur = {}
    for s in ordre:
        prises = {couleur[v] for v in graphe[s] if v in couleur}
        c = 0
        while c in prises:
            c += 1
        couleur[s] = c
    return couleur
```
Cette coloration est valide mais pas toujours **minimale** : selon l'ordre de parcours, elle peut utiliser bien plus de
couleurs que nécessaire (sur un graphe biparti « en couronne », un mauvais ordre donne $n/2$ couleurs au lieu de 2).
C'est une heuristique. Trouver le nombre minimal de couleurs est un problème difficile (NP-complet).
:::
::::

::::exercice[Contre-exemples]{niveau=3}
Pour le problème des activités, donne un contre-exemple (une liste de créneaux) qui montre que chacun de ces critères
gloutons n'est pas optimal :
1. « l'activité la plus courte d'abord » ;
2. « l'activité qui commence le plus tôt d'abord » ;
3. « l'activité qui a le moins de conflits d'abord » (plus difficile : il faut un exemple où la moins conflictuelle
   empêche une solution meilleure).

:::criteres
- Contre-exemple valide pour la plus courte, par exemple `(0, 5), (4, 6), (5, 10)` : glouton 1 activité, optimum 2.
- Contre-exemple valide pour la plus précoce, par exemple `(0, 10), (1, 2), (3, 4)` : glouton 1, optimum 2.
- Pour le critère du moins de conflits, un exemple construit (classiquement à 11 activités) où l'activité la moins conflictuelle n'appartient à aucune solution optimale, avec le décompte des conflits vérifié.
- Chaque contre-exemple indique le résultat du glouton et une meilleure solution.
:::

:::corrige
1. `(0, 5)`, `(4, 6)`, `(5, 10)` : la plus courte est `(4, 6)` (durée 2), qui chevauche les deux autres : le glouton
   n'en choisit qu'**une**, alors que `(0, 5)` et `(5, 10)` sont compatibles : **deux**.
2. `(0, 10)`, `(1, 2)`, `(3, 4)` : `(0, 10)` commence le plus tôt et bloque tout : **une** activité au lieu de **deux**.
3. On construit 11 activités. Une « ligne » de quatre activités compatibles : A = `(0, 3)`, B = `(4, 7)`, C = `(8, 11)`,
   D = `(12, 15)` ; une activité E = `(6, 9)` à cheval sur B et C ; trois copies de `(2, 5)` à cheval sur A et B ; trois
   copies de `(10, 13)` à cheval sur C et D. Nombre de conflits : E en a **2** (B et C) ; A et D en ont 3 ; B et C en ont 4 ;
   chaque copie de `(2, 5)` ou `(10, 13)` en a 4 (deux activités de la ligne et les deux autres copies). Le glouton choisit
   donc E, ce qui élimine B et C ; il ne peut ensuite prendre qu'une activité à gauche (A ou une copie de `(2, 5)`) et une à
   droite : **trois** activités. Or A, B, C, D sont compatibles : **quatre**.

```python exec
def conflits(a, b):
    return a[0] < b[1] and b[0] < a[1]

activites = [(0, 3), (4, 7), (8, 11), (12, 15), (6, 9)] + [(2, 5)] * 3 + [(10, 13)] * 3
for i, a in enumerate(activites[:5]):
    n = sum(conflits(a, b) for j, b in enumerate(activites) if j != i)
    print(a, n, "conflits")
```
:::
::::

::::exercice[Optimalité pour les euros]{niveau=4 duree=25}
On considère le système de pièces `{1, 2, 5, 10}` (en euros, par exemple).

1. Montre que dans une solution optimale, la somme payée avec des pièces de 1, 2 et 5 est au plus 9.
2. En déduire que toute solution optimale contient exactement $\lfloor s / 10 \rfloor$ pièces de 10, puis conclus que le
   glouton est optimal pour ce système (tu peux utiliser le résultat de l'exemple guidé pour `{1, 2, 5}`).
3. Montre que si l'on ajoute une pièce de 4 (système `{1, 2, 4, 5, 10}`), le glouton n'est plus optimal.
4. Le coût du glouton pour rendre `s` avec `k` valeurs de pièces est-il en $\Theta(s)$ ou peut-il être meilleur ?

:::criteres
- Q1 : dans une solution optimale, au plus un 1, au plus deux 2, pas deux 2 et un 1, au plus un 5 (deux 5 → un 10) ; donc la partie en 1, 2, 5 vaut au plus 5 + 4 = 9.
- Q2 : la partie en pièces de 10 vaut donc s moins un nombre entre 0 et 9, multiple de 10 : c'est $10 \lfloor s/10 \rfloor$ ; le reste $s \bmod 10$ est payé optimalement en {1, 2, 5}, où le glouton est optimal (exemple guidé) ; donc la solution optimale est celle du glouton.
- Q3 : contre-exemple, par exemple 8 : glouton 5 + 2 + 1 (3 pièces) contre 4 + 4 (2 pièces).
- Q4 : avec les quotients (`s // p`, `s % p`), le coût est $\Theta(k)$ opérations arithmétiques, indépendant de `s` (après le tri des pièces) ; avec des soustractions une à une, il serait proportionnel au nombre de pièces rendues.
:::

:::corrige
1. Soit $O$ optimale. Comme dans l'exemple guidé : au plus **un** 1 (deux 1 → un 2), au plus **deux** 2 (trois 2 → 5 + 1),
   jamais deux 2 **et** un 1 (→ un 5) ; et au plus **un** 5 (deux 5 → un 10). La partie en 1 et 2 vaut donc au plus 4, et
   la partie en 1, 2 et 5 au plus $5 + 4 = 9$.
2. La partie payée en pièces de 10 vaut donc $s - r$ avec $0 \le r \le 9$ ; elle est multiple de 10, donc
   $s - r = 10 \lfloor s/10 \rfloor$ et $r = s \bmod 10$. Toute solution optimale contient donc exactement
   $\lfloor s/10 \rfloor$ pièces de 10, comme le glouton, et rend $r$ de façon optimale avec `{1, 2, 5}`. D'après l'exemple
   guidé, le glouton est optimal pour `{1, 2, 5}` : il rend $r$ avec le nombre minimal de pièces. La solution gloutonne
   est donc optimale.
3. Avec `{1, 2, 4, 5, 10}` et $s = 8$ : le glouton donne 5 + 2 + 1 (3 pièces), alors que 4 + 4 (2 pièces) est meilleur.
4. En calculant `n = s // p` et `s = s % p` pour chaque valeur, le glouton fait $\Theta(k)$ opérations (plus le tri des
   $k$ valeurs, $\Theta(k \log k)$), quel que soit `s`. La version qui soustrait les pièces une à une fait autant de tours
   que de pièces rendues (au plus de l'ordre de $s / p_{\max} + k$).
:::
::::
