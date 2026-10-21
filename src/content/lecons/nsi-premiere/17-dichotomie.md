---
titre: Recherche dichotomique
resume: "Le cours de première NSI sur la recherche dichotomique dans un tableau trié : principe du « coupé en deux », déroulé pas à pas, écriture itérative en Python, terminaison par un variant, invariant, coût logarithmique comparé au parcours séquentiel."
duree: 50
objectifs:
  - "Expliquer pourquoi la dichotomie exige un tableau trié"
  - "Dérouler la recherche dichotomique en suivant debut, fin et milieu"
  - "Écrire la recherche dichotomique itérative en Python"
  - "Justifier la terminaison avec un variant"
  - "Comparer le coût logarithmique au coût linéaire"
prerequis: [nsi-premiere/parcours, nsi-premiere/tris]
programme: [nsi1-algo]
cartes:
  - q: "Condition pour utiliser la recherche dichotomique ?"
    r: "Le tableau doit être **trié**."
  - q: "Principe de la dichotomie ?"
    r: "On compare la valeur cherchée à l'élément du **milieu** : égale, on a trouvé ; plus petite, on cherche dans la moitié **gauche** ; plus grande, dans la moitié **droite**. La zone de recherche est divisée par 2 à chaque étape."
  - q: "Variant de la recherche dichotomique ?"
    r: "La taille de la zone `fin - debut` : c'est un entier qui **diminue strictement** à chaque tour ; la boucle s'arrête quand `debut > fin`."
  - q: "Combien d'étapes au plus pour un tableau trié d'un million d'éléments ?"
    r: "Environ **20**, car 2²⁰ ≈ 1 000 000. Coût **logarithmique** (log₂ n), contre un million pour le parcours séquentiel."
  - q: "Pourquoi `debut = milieu + 1` et pas `debut = milieu` ?"
    r: "`t[milieu]` a déjà été comparé ; avec `debut = milieu`, la zone peut ne plus diminuer et la boucle ne jamais s'arrêter."
  - q: "Invariant de la dichotomie ?"
    r: "Si x est dans le tableau, il est dans la zone `t[debut..fin]`."
---

Pour chercher un mot dans un dictionnaire papier, on ne lit pas toutes les pages : on l'ouvre au milieu, on regarde si le mot est avant ou après,
et on recommence dans la bonne moitié. C'est la **recherche dichotomique** (« couper en deux »). Elle est spectaculairement plus rapide que le
parcours séquentiel, à une condition : le tableau doit être **trié**.

## Ce que dit le programme

Contenus : *recherche dichotomique dans un tableau trié*. Capacités attendues : **montrer la terminaison de la recherche dichotomique à l'aide
d'un variant de boucle**. Le programme précise que des assertions peuvent être utilisées pour garantir des préconditions ou des invariants, et
qu'on compare l'efficacité avec la recherche séquentielle.

## 1. Le principe

On cherche `x` dans un tableau **trié** `t`. On garde une **zone de recherche** délimitée par deux indices, `debut` et `fin` (au départ, tout
le tableau).

1. On regarde l'élément du **milieu** de la zone.
2. S'il est égal à `x` : trouvé.
3. Si `x` est plus **petit** : il ne peut être qu'à **gauche** (le tableau est trié) ; on garde la moitié gauche.
4. Sinon : on garde la moitié **droite**.
5. On recommence tant que la zone n'est pas **vide**.

## 2. Déroulé

On cherche 23 dans `t = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]` (indices 0 à 9) :

| Étape | debut | fin | milieu | t[milieu] | Décision |
| --- | --- | --- | --- | --- | --- |
| 1 | 0 | 9 | 4 | 16 | 23 > 16 : à droite, debut = 5 |
| 2 | 5 | 9 | 7 | 56 | 23 < 56 : à gauche, fin = 6 |
| 3 | 5 | 6 | 5 | 23 | trouvé à l'indice 5 |

Trois comparaisons au lieu de six avec le parcours séquentiel. On cherche maintenant 10 :

| Étape | debut | fin | milieu | t[milieu] | Décision |
| --- | --- | --- | --- | --- | --- |
| 1 | 0 | 9 | 4 | 16 | 10 < 16 : fin = 3 |
| 2 | 0 | 3 | 1 | 5 | 10 > 5 : debut = 2 |
| 3 | 2 | 3 | 2 | 8 | 10 > 8 : debut = 3 |
| 4 | 3 | 3 | 3 | 12 | 10 < 12 : fin = 2 |
| 5 | 3 | 2 | | | zone vide : absent |

## 3. En Python

```python exec
def dichotomie(t, x):
    """Renvoie un indice de x dans le tableau trié t, ou -1 si x est absent."""
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

t = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
print(dichotomie(t, 23), dichotomie(t, 10), dichotomie(t, 2), dichotomie(t, 91))
```

Points d'attention :

- `milieu = (debut + fin) // 2` : division **entière**, un indice doit être un entier.
- `fin = milieu - 1` et `debut = milieu + 1` : on **exclut** le milieu, déjà examiné.
- La condition `debut <= fin` : la zone contient au moins un élément (avec `<`, on oublierait de tester le dernier).

## 4. Correction et terminaison

**Invariant** : *si x est dans le tableau, alors il est dans la zone `t[debut..fin]`.* Vrai au départ (la zone est tout le tableau) ; conservé à
chaque tour, car on n'élimine que des éléments dont on sait, grâce au tri, qu'ils sont différents de x. Quand la zone est vide, x n'est donc pas
dans le tableau : renvoyer −1 est correct.

**Terminaison** : la quantité `fin - debut` est un entier ; à chaque tour où l'on ne trouve pas x, soit `fin` diminue, soit `debut` augmente
d'au moins 1. Elle **décroît strictement** et finit par devenir négative : la boucle s'arrête. C'est un **variant** de boucle.

:::attention[La boucle infinie classique]
Avec `debut = milieu` au lieu de `milieu + 1`, quand `debut` et `fin` sont voisins, `milieu` vaut `debut` et la zone ne diminue plus : la
boucle ne s'arrête jamais. Le variant permet de repérer ce genre d'erreur.
:::

## 5. Le coût est logarithmique

À chaque étape, la taille de la zone est **divisée par 2** (environ). Pour un tableau de taille n, après k étapes, il reste n / 2ᵏ éléments.
La recherche s'arrête au plus quand il en reste 1 : il faut environ **log₂(n)** étapes, le nombre de fois qu'on peut diviser n par 2.

| n | Séquentielle (pire cas) | Dichotomique (pire cas) |
| --- | --- | --- |
| 1 000 | 1 000 | 10 |
| 1 000 000 | 1 000 000 | 20 |
| 1 milliard | 1 milliard | 30 |

Quand la taille **double**, il ne faut qu'**une** étape de plus. Mais attention : il faut que le tableau soit **déjà trié**. Trier coûte plus
cher qu'une recherche séquentielle ; la dichotomie est rentable quand on fait **beaucoup** de recherches dans le même tableau.

## Les erreurs classiques des élèves

:::attention[Ce que tu verras en classe]
- **Appliquer la dichotomie à un tableau non trié.**
- **`milieu = (debut + fin) / 2`** : un flottant, donc une `TypeError` à l'indexation.
- **`debut = milieu`** ou **`fin = milieu`** : boucle infinie.
- **`while debut < fin`** : le dernier élément de la zone n'est jamais testé.
- **Inverser les deux cas** (chercher à droite quand x est plus petit).
- **Croire que la dichotomie est toujours meilleure** : elle exige un tableau trié.
:::

## En classe

:::methode[Activités qui marchent]
1. **Le nombre mystère** entre 1 et 100 : la meilleure stratégie trouve en au plus 7 questions (2⁷ = 128). C'est la dichotomie.
2. **Annuaire ou dictionnaire papier** : chercher un mot en comptant les pages ouvertes.
3. **Déroulés** au tableau avec `debut`, `fin`, `milieu` sur des cas : présent, absent, aux bords.
4. **Mesure** : chercher 1 000 valeurs dans un tableau d'un million, en séquentiel puis en dichotomie.
:::

## L'essentiel

- La recherche dichotomique exige un tableau **trié**.
- On compare x à `t[milieu]` et on garde la **moitié** utile ; `milieu = (debut + fin) // 2` ; `debut = milieu + 1` ou `fin = milieu - 1`.
- Boucle `while debut <= fin` ; zone vide : x est absent.
- **Invariant** : si x est présent, il est dans `t[debut..fin]`. **Variant** : `fin - debut`, qui décroît strictement : terminaison.
- Coût **logarithmique** : environ log₂(n) étapes (20 pour un million), contre n pour le séquentiel.

## Exercices

::::exercice[Grand QCM : dichotomie]{niveau=1 type=quiz}
Dix questions sur la recherche dichotomique.

1. Quelle condition est indispensable pour la recherche dichotomique ?

   - [ ] le tableau a une taille paire
   - [x] le tableau est trié
   - [ ] l'élément est présent
   - [ ] le tableau contient des entiers

   > Sinon, on ne sait pas de quel côté chercher.

1. Avec `debut = 0` et `fin = 9`, que vaut `milieu` ?

   - [ ] 4,5
   - [x] 4
   - [ ] 5
   - [ ] 9

   > Division entière : 9 // 2 = 4.

1. `t[milieu]` vaut 40 et on cherche 25. Que fait-on ?

   - [x] `fin = milieu - 1`
   - [ ] `debut = milieu + 1`
   - [ ] `fin = milieu`
   - [ ] on s'arrête

   > 25 < 40 : on cherche à gauche.

1. Combien d'étapes au plus pour un tableau trié de 1 000 éléments ?

   - [ ] 1 000
   - [ ] 500
   - [ ] 100
   - [x] environ 10

   > 2¹⁰ = 1 024.

1. Si la taille du tableau double, le nombre d'étapes de la dichotomie :

   - [ ] double
   - [x] augmente de 1
   - [ ] est multiplié par 4
   - [ ] ne change pas

   > Une étape de plus suffit à couper la taille en deux.

1. Quel est le variant qui prouve la terminaison ?

   - [ ] milieu
   - [x] fin − debut
   - [ ] x
   - [ ] len(t)

   > Il décroît strictement à chaque tour.

1. Pourquoi écrire `debut = milieu + 1` plutôt que `debut = milieu` ?

   - [ ] pour aller plus vite seulement
   - [x] pour que la zone diminue toujours, sinon la boucle peut être infinie
   - [ ] parce que milieu est un flottant
   - [ ] c'est équivalent

   > `t[milieu]` est déjà examiné, on peut l'exclure.

1. Quand s'arrête la boucle si l'élément est absent ?

   - [ ] quand milieu vaut 0
   - [x] quand debut > fin (zone vide)
   - [ ] quand debut == fin
   - [ ] jamais

   > Avec `while debut < fin`, on oublierait de tester le dernier élément.

1. Quel est le coût de la recherche dichotomique ?

   - [ ] linéaire
   - [ ] quadratique
   - [x] logarithmique
   - [ ] constant

   > De l'ordre de log₂(n).

1. On ne fait qu'**une seule** recherche dans un tableau **non trié** d'un million d'éléments. Que faire ?

   - [ ] trier puis faire une dichotomie
   - [x] faire une recherche séquentielle
   - [ ] faire une dichotomie directement
   - [ ] c'est impossible

   > Trier coûte plus cher qu'un parcours ; la dichotomie se rentabilise sur de nombreuses recherches.
::::

::::exercice[Écrire la dichotomie]{niveau=1}
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

::::exercice[Compter les étapes]{niveau=2}
Écris `etapes_dichotomie(t, x)` qui renvoie le **nombre de tours de boucle** effectués par la recherche dichotomique (présent ou absent), puis
`etapes_max(n)` qui renvoie le nombre de fois qu'on peut diviser `n` par 2 (division entière) avant d'arriver à 0. Vérifie que
`etapes_max(len(t))` majore toujours `etapes_dichotomie`.

```python depart
def etapes_dichotomie(t, x):
    ...

def etapes_max(n):
    ...
```

```python tests
t = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
assert etapes_dichotomie(t, 23) == 3, "23 trouvé en 3 étapes"
assert etapes_dichotomie(t, 10) == 4, "10 absent : 4 étapes"
assert etapes_max(10) == 4, "10, 5, 2, 1 : 4 divisions"
assert etapes_max(1000000) == 20, "un million : 20"
grand = list(range(0, 2000, 2))
assert all(etapes_dichotomie(grand, v) <= etapes_max(len(grand)) for v in range(-1, 2001)), "majoration"
```

:::corrige
```python solution
def etapes_dichotomie(t, x):
    debut = 0
    fin = len(t) - 1
    n = 0
    while debut <= fin:
        n = n + 1
        milieu = (debut + fin) // 2
        if t[milieu] == x:
            return n
        elif x < t[milieu]:
            fin = milieu - 1
        else:
            debut = milieu + 1
    return n

def etapes_max(n):
    k = 0
    while n > 0:
        n = n // 2
        k = k + 1
    return k
```

`etapes_max(n)` est le nombre de chiffres de n en binaire, soit environ log₂(n) : 20 pour un million. Quelle que soit la valeur cherchée, la
dichotomie ne fait jamais plus de tours.
:::
::::

::::exercice[Première occurrence]{niveau=2}
Dans un tableau trié avec doublons, la dichotomie renvoie **un** indice de x, pas forcément le premier. Écris `premiere_occurrence(t, x)` qui
renvoie l'indice de la **première** occurrence de x (ou −1) en gardant un coût logarithmique : quand on trouve x, on note l'indice et on
continue à chercher **à gauche**.

```python depart
def premiere_occurrence(t, x):
    ...
```

```python tests
assert premiere_occurrence([1, 3, 3, 3, 5, 8], 3) == 1, "doublons"
assert premiere_occurrence([3, 3, 3], 3) == 0, "que des 3"
assert premiere_occurrence([1, 2, 4], 3) == -1, "absent"
assert premiere_occurrence([1, 2, 4, 4], 4) == 2, "à la fin"
assert premiere_occurrence([], 4) == -1, "vide"
```

:::corrige
```python solution
def premiere_occurrence(t, x):
    debut = 0
    fin = len(t) - 1
    resultat = -1
    while debut <= fin:
        milieu = (debut + fin) // 2
        if t[milieu] == x:
            resultat = milieu
            fin = milieu - 1
        elif x < t[milieu]:
            fin = milieu - 1
        else:
            debut = milieu + 1
    return resultat
```

Même variant, même coût : on ne s'arrête plus au premier x trouvé, mais la zone continue de se réduire de moitié.
:::
::::

::::exercice[Le nombre mystère]{niveau=1}
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
