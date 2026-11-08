---
titre: La recherche dichotomique
resume: "Chercher très vite dans un tableau trié en coupant la zone de recherche en deux."
duree: 35
objectifs:
  - "Dérouler et écrire la recherche dichotomique"
  - "Montrer sa terminaison avec un variant"
prerequis: [premiere-algo/parcours]
---

Dans un tableau **trié**, on peut éliminer la moitié des cases à chaque comparaison.

## 1. Le principe

On garde une zone entre `debut` et `fin`. On regarde le **milieu** :

- si c'est la valeur cherchée, c'est fini ;
- si la valeur cherchée est plus petite, on garde la moitié **gauche** ;
- sinon, la moitié **droite**.

```python exec
def dichotomie(t, x):
    debut = 0
    fin = len(t) - 1
    while debut <= fin:
        milieu = (debut + fin) // 2
        if t[milieu] == x:
            return milieu
        elif x < t[milieu]:
            fin = milieu - 1
        else:
            debut = milieu + 1
    return -1

print(dichotomie([2, 5, 8, 12, 16], 12), dichotomie([2, 5, 8, 12, 16], 3))
```

## 2. Terminaison

La quantité `fin - debut` est un entier qui **diminue à chaque tour** : c'est un **variant**. Quand elle devient négative, la boucle s'arrête.

## 3. Coût

La zone est divisée par 2 à chaque étape : le coût est **logarithmique**. Pour un million de valeurs, il faut environ 20 comparaisons.

## L'essentiel

- Le tableau doit être **trié**.
- `milieu = (debut + fin) // 2`, puis `fin = milieu - 1` ou `debut = milieu + 1`.
- Variant : `fin - debut`, qui décroît strictement.
- Coût logarithmique.

## Exercices

::::exercice[Dérouler]{niveau=1 type=completer}
On cherche 23 dans `[2, 5, 8, 12, 16, 23, 38, 56]`, d'indices 0 à 7. Complète.

```python calcul
t = [2, 5, 8, 12, 16, 23, 38, 56]
d, f = 0, 7
m = (d + f) // 2
print(m); print(t[m]); d = m + 1
print(d); print(f)
m = (d + f) // 2
print(m); print(t[m])
print(m)
```

| debut | fin | milieu | t[milieu] |
| --- | --- | --- | --- |
| 0 | 7 | [[3]] | [[12]] |
| [[4]] | [[7]] | [[5]] | [[23]] |

La valeur 23 est à l'indice [[5]].
::::

::::exercice[Compléter]{niveau=1 type=completer}
Complète la recherche dichotomique.

```python trous
def dichotomie(t, x):
    debut = 0
    fin = [[len(t) - 1]]
    while debut [[<=]] fin:
        milieu = [[(debut + fin) // 2]]
        if t[milieu] == x:
            return milieu
        elif x < t[milieu]:
            fin = [[milieu - 1]]
        else:
            debut = [[milieu + 1]]
    return -1
```
::::

::::exercice[QCM : les pièges de la dichotomie]{niveau=2 type=quiz}
Une borne fausse d'une unité suffit à tout casser. La correction s'affiche aussitôt.

1. Avec la fonction du cours, que renvoie la recherche de 5 dans `[5, 1, 9, 3]` ?

   - [ ] 0
   - [x] -1
   - [ ] 3
   - [ ] une erreur

   > Le tableau n'est pas trié : on part à droite après avoir vu 1, et on ne voit jamais le 5. Il n'y a pas d'erreur, juste un résultat faux.

1. Avec `debut = 3` et `fin = 8`, que vaut `milieu = (debut + fin) // 2` ?

   - [ ] 5.5
   - [x] 5
   - [ ] 6
   - [ ] 4

   > `//` donne un quotient entier. Un indice ne peut pas valoir 5.5.

1. On écrit `debut = milieu` au lieu de `debut = milieu + 1`. Que se passe-t-il en cherchant 3 dans `[1, 3]` ?

   - [ ] on renvoie 1
   - [ ] on renvoie -1
   - [x] la boucle ne s'arrête jamais
   - [ ] une `IndexError`

   > `milieu` vaut 0, donc `debut` reste à 0 : la zone ne rétrécit plus.

1. On écrit `while debut < fin:`. Que renvoie la recherche de 4 dans `[4]` ?

   - [ ] 0
   - [x] -1
   - [ ] 4
   - [ ] une erreur

   > `debut` et `fin` valent 0 : la boucle ne s'exécute pas. Une zone d'une seule case doit encore être examinée.

1. On écrit `fin = len(t)` au départ. Que provoque la recherche de 9 dans `[2, 4]` ?

   - [ ] -1
   - [ ] 1
   - [x] une `IndexError`
   - [ ] une boucle infinie

   > `milieu` finit par valoir 2, mais la dernière case a l'indice 1.

1. Combien de comparaisons environ pour un tableau trié d'un milliard d'éléments ?

   - [x] 30
   - [ ] 1 000
   - [ ] 500 millions
   - [ ] 1 milliard

   > 2³⁰ dépasse le milliard. Diviser par deux à chaque étape va très vite.

1. Si la taille du tableau double, le nombre maximal d'étapes :

   - [ ] double
   - [ ] est multiplié par 4
   - [x] augmente d'environ 1
   - [ ] ne change pas

   > Une étape supplémentaire suffit à revenir à la moitié.

1. Quelle quantité est un variant de la boucle ?

   - [ ] `milieu`
   - [ ] `x`
   - [x] `fin - debut`
   - [ ] `t[milieu]`

   > `milieu` peut monter ou descendre. `fin - debut` diminue strictement à chaque tour.

1. On doit faire **une seule** recherche dans un tableau **non trié** d'un million de valeurs. Que choisir ?

   - [x] une recherche séquentielle
   - [ ] trier, puis faire une dichotomie
   - [ ] une dichotomie directement
   - [ ] un tri par sélection, puis un parcours

   > Trier coûte plus cher qu'un seul parcours. Trier devient rentable si les recherches sont nombreuses.
::::

::::exercice[Écrire la dichotomie]{niveau=2}
Écris `dichotomie(t, x)` qui renvoie un indice de `x` dans le tableau **trié** `t`, ou `-1` si `x` est absent, avec une boucle `while`.

```python depart
def dichotomie(t, x):
    ...
```

```python tests
t = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
assert dichotomie(t, 23) == 5, "présent au milieu"
assert dichotomie(t, 2) == 0, "premier"
assert dichotomie(t, 91) == 9, "dernier"
assert dichotomie(t, 10) == -1, "absent"
assert dichotomie(t, 100) == -1, "plus grand que tout"
assert dichotomie([], 3) == -1, "tableau vide"
assert dichotomie([7], 7) == 0, "un élément"
```

:::corrige
```python solution
def dichotomie(t, x):
    debut = 0
    fin = len(t) - 1
    while debut <= fin:
        milieu = (debut + fin) // 2
        if t[milieu] == x:
            return milieu
        elif x < t[milieu]:
            fin = milieu - 1
        else:
            debut = milieu + 1
    return -1
```

Les tests couvrent les cas limites : premier, dernier, absent, au-delà des bornes, tableau vide, un seul élément.
:::
::::

::::exercice[Le nombre mystère]{niveau=2}
Dans le jeu du nombre mystère entre 1 et 100, l'ordinateur répond « plus grand », « plus petit » ou « gagné ». (a) Explique la meilleure
stratégie et pourquoi elle garantit de gagner en au plus 7 coups. (b) Combien de coups au plus entre 1 et 1 000 ? Entre 1 et un million ?
(c) Quel lien avec la recherche dichotomique dans un tableau ?

:::criteres
- (a) Proposer toujours le milieu de l'intervalle possible ; chaque réponse divise l'intervalle par 2 ; 2⁷ = 128 ≥ 100.
- (b) 10 coups (2¹⁰ = 1 024) ; 20 coups (2²⁰ ≈ 1 048 576).
- (c) L'intervalle des possibles joue le rôle de la zone `debut..fin` d'un tableau trié `[1, 2, …, 100]`.
:::

:::corrige
(a) On propose toujours le **milieu** des valeurs encore possibles : 50, puis 25 ou 75, etc. Chaque réponse élimine la **moitié** des
possibilités : 100, 50, 25, 13, 7, 4, 2, 1. Après 7 coups il ne reste qu'une valeur, car 2⁷ = 128 ≥ 100. (b) Entre 1 et 1 000 : **10** coups
(2¹⁰ = 1 024) ; entre 1 et un million : **20** coups (2²⁰ ≈ 1,05 million). (c) C'est exactement la dichotomie dans le tableau trié
`[1, 2, …, 100]` : l'intervalle des possibles est la zone `debut..fin`, le nombre proposé est `t[milieu]`, et « plus grand / plus petit »
indique la moitié à garder.
:::
::::

::::exercice[Des valeurs répétées]{niveau=3}
Un tableau trié peut contenir plusieurs fois la même valeur. La dichotomie du cours renvoie alors n'importe quelle occurrence.

1. Écris `premiere(t, x)`, qui renvoie l'indice de la **première** occurrence de `x`, ou `-1`. Le coût doit rester logarithmique.
2. Écris `position_insertion(t, x)`, qui renvoie l'indice où insérer `x` pour que `t` reste trié, à gauche des valeurs égales.
3. À l'écrit : comment prouver que la boucle de `premiere` s'arrête ? Quel gain obtient-on sur un tableau d'un million de valeurs, par rapport à une recherche séquentielle ?

:::indice
Quand `t[milieu]` vaut `x`, retiens l'indice, puis continue à chercher dans la moitié gauche.
:::

```python depart
def premiere(t, x):
    ...

def position_insertion(t, x):
    ...
```

```python tests
t = [1, 3, 3, 3, 7, 9]
assert premiere(t, 3) == 1, "première occurrence"
assert premiere(t, 9) == 5, "dernière case"
assert premiere(t, 4) == -1, "absent"
assert premiere([], 4) == -1, "vide"
assert premiere([2] * 1000, 2) == 0, "que des doublons"
assert position_insertion(t, 3) == 1, "à gauche des égaux"
assert position_insertion(t, 0) == 0, "au début"
assert position_insertion(t, 10) == 6, "à la fin"
assert position_insertion(t, 5) == 4, "au milieu"
```

:::corrige
```python solution
def premiere(t, x):
    debut = 0
    fin = len(t) - 1
    trouve = -1
    while debut <= fin:
        milieu = (debut + fin) // 2
        if t[milieu] == x:
            trouve = milieu
            fin = milieu - 1
        elif x < t[milieu]:
            fin = milieu - 1
        else:
            debut = milieu + 1
    return trouve

def position_insertion(t, x):
    debut = 0
    fin = len(t)
    while debut < fin:
        milieu = (debut + fin) // 2
        if t[milieu] < x:
            debut = milieu + 1
        else:
            fin = milieu
    return debut
```

**Question 3.** `fin - debut` est un entier qui diminue strictement à chaque tour : c'est un variant. Il faut environ 20 comparaisons au lieu d'un million dans le pire cas.
:::
::::
