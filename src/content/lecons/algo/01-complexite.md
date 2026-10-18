---
titre: Coût d'un algorithme
resume: Compter les opérations d'un algorithme en fonction de la taille des données, distinguer meilleur et pire cas, et comparer avec les notations O et Θ.
duree: 75
objectifs:
  - Compter le nombre d'opérations élémentaires d'un algorithme en fonction de la taille `n` des données
  - Identifier le meilleur et le pire cas, et exhiber une entrée qui les réalise
  - Utiliser les notations $O$, $\Omega$ et $\Theta$ et reconnaître les classes de complexité usuelles
  - Estimer un temps d'exécution et repérer le coût caché des opérations Python
prerequis: [python/listes, python/tuples-dictionnaires]
programme: [asd-cout, asd-recherche-tris, nsi1-algo, nsit-algo]
cartes:
  - q: Qu'est-ce que le coût (ou complexité en temps) d'un algorithme ?
    r: "Le nombre d'opérations élémentaires qu'il effectue, exprimé en fonction de la taille `n` de l'entrée (au pire, au mieux, ou en moyenne)."
  - q: "Combien de tours fait `while n > 1: n = n // 2` à partir de `n` ?"
    r: "Environ $\\log_2 n$ (exactement $\\lfloor \\log_2 n \\rfloor$ pour $n \\ge 1$) : on divise par 2 à chaque tour."
  - q: "Que vaut $1 + 2 + \\dots + n$ ?"
    r: "$\\frac{n(n+1)}{2}$, donc de l'ordre de $n^2$."
  - q: "Définition de $f(n) = O(g(n))$ ?"
    r: "Il existe une constante $c > 0$ et un rang $n_0$ tels que $f(n) \\le c\\, g(n)$ pour tout $n \\ge n_0$ : $f$ ne croît pas plus vite que $g$, à une constante près."
  - q: "Différence entre $O$ et $\\Theta$ ?"
    r: "$O$ est une borne supérieure ; $\\Theta$ est une borne supérieure **et** inférieure : $f = \\Theta(g)$ signifie que $f$ et $g$ ont le même ordre de grandeur."
  - q: Classes usuelles, de la plus rapide à la plus lente ?
    r: "$1 < \\log n < n < n \\log n < n^2 < n^3 < 2^n < n!$"
  - q: Un algorithme en $\\Theta(n^2)$ met 1 s pour $n = 10^4$. Combien pour $n = 10^5$ ?
    r: "Environ 100 s : $n$ multiplié par 10, donc temps multiplié par $10^2$."
  - q: Coût de `x in t` pour une liste et pour un ensemble ?
    r: "Linéaire pour la liste ; constant en moyenne pour un `set` ou un `dict` (table de hachage)."
---

Deux programmes peuvent donner le même résultat et pourtant ne pas être utilisables de la même façon : l'un répond
en une fraction de seconde sur un million de données, l'autre mettrait des jours. Pour choisir un algorithme, il faut
pouvoir **prévoir** son temps d'exécution sans le chronométrer sur toutes les machines. On compte donc ses
**opérations**, en fonction de la **taille** des données. C'est la question « évaluer le coût au pire et au mieux »
qu'on retrouve dans presque tous les sujets d'écrit.

## 1. Compter des opérations

Le temps réel dépend de la machine, du langage, des autres programmes en cours… mais il est (à peu près)
proportionnel au **nombre d'opérations élémentaires** effectuées : affectation, comparaison, opération arithmétique,
accès à une case de tableau. On compte ce nombre en fonction de la **taille** `n` de l'entrée (longueur d'une liste,
nombre de chiffres, nombre de sommets…).

```python exec
def somme(t):
    s = 0                 # 1 affectation
    for x in t:           # n tours
        s = s + x         # 1 addition + 1 affectation par tour
    return s

print(somme(list(range(10))))
```

`somme` fait de l'ordre de $2n + 1$ opérations : son coût est **proportionnel à `n`** (linéaire). En pratique, on ne
compte pas tout : on choisit une **opération caractéristique** (les comparaisons pour une recherche ou un tri, les
multiplications pour une puissance) et on compte combien de fois elle est exécutée. C'est ce que demandent les
sujets : « le coût considéré étant le nombre de comparaisons de caractères ».

### Les situations types

| Structure du code                                   | Nombre de tours        | Ordre de grandeur |
|-----------------------------------------------------|------------------------|-------------------|
| une boucle `for i in range(n)`                      | $n$                    | $n$               |
| deux boucles imbriquées sur `n`                     | $n \times n$           | $n^2$             |
| `for i in range(n): for j in range(i):`             | $0 + 1 + \dots + (n-1) = \frac{n(n-1)}{2}$ | $n^2$ |
| `while n > 1: n = n // 2`                           | $\lfloor \log_2 n \rfloor$ | $\log n$      |
| boucle sur `n` contenant une division par 2 répétée | $n \log_2 n$           | $n \log n$        |

Deux formules à connaître par cœur :

$$ \sum_{i=1}^{n} i = \frac{n(n+1)}{2} \qquad\qquad \sum_{k=0}^{p} 2^k = 2^{p+1} - 1 $$

et le fait que le nombre de fois qu'on peut diviser `n` par 2 avant d'atteindre 1 est $\lfloor \log_2 n \rfloor$
($\log_2 1024 = 10$, $\log_2 10^6 \approx 20$).

```python exec
def compte_divisions(n):
    tours = 0
    while n > 1:
        n = n // 2
        tours += 1
    return tours

for n in [8, 1000, 10**6, 10**9]:
    print(n, compte_divisions(n))
```

## 2. Meilleur cas, pire cas

Pour une même taille `n`, le nombre d'opérations peut dépendre des **valeurs** de l'entrée.

```python exec
def recherche(t, x):
    for i in range(len(t)):
        if t[i] == x:       # opération comptée : comparaison
            return i
    return -1
```

- **Meilleur cas** : `x` est en première position → **1** comparaison.
- **Pire cas** : `x` est absent (ou en dernière position) → **n** comparaisons.

:::definition
Le **coût dans le pire cas** est le maximum du nombre d'opérations sur toutes les entrées de taille `n` ;
le **coût dans le meilleur cas** est le minimum. Le **coût moyen** est la moyenne sur toutes les entrées
(selon une loi de probabilité à préciser). Le pire cas est le plus utilisé : c'est une **garantie**.
:::

:::methode[Répondre à « évaluer le coût au pire et au mieux »]
1. Préciser l'opération comptée et la taille `n`.
2. Décrire le **meilleur cas** par une entrée concrète, et compter.
3. Décrire le **pire cas** par une entrée concrète, et compter (souvent une somme à calculer).
4. Conclure avec un ordre de grandeur : « le coût est en $\Theta(n)$ dans le pire cas ».
:::

## 3. Les notations $O$, $\Omega$, $\Theta$

On ne garde que l'**ordre de grandeur** quand `n` devient grand : $3n^2 + 5n + 7$ et $n^2$ « se comportent pareil »
(le terme dominant l'emporte et les constantes dépendent de la machine).

:::definition
Pour deux fonctions positives $f$ et $g$ :
- $f(n) = O(g(n))$ s'il existe $c > 0$ et $n_0$ tels que $f(n) \le c\, g(n)$ pour tout $n \ge n_0$ ($f$ croît **au plus** comme $g$) ;
- $f(n) = \Omega(g(n))$ s'il existe $c > 0$ et $n_0$ tels que $f(n) \ge c\, g(n)$ pour tout $n \ge n_0$ (**au moins** comme $g$) ;
- $f(n) = \Theta(g(n))$ si les deux sont vrais (**même ordre de grandeur**).
:::

Exemple : $f(n) = 3n^2 + 5n + 7$. Pour $n \ge 1$, $f(n) \le 3n^2 + 5n^2 + 7n^2 = 15n^2$, donc $f = O(n^2)$ ; et
$f(n) \ge 3n^2$, donc $f = \Omega(n^2)$. Ainsi $f = \Theta(n^2)$.

:::attention
$O$ n'est qu'une borne supérieure : $3n + 5$ est aussi un $O(n^2)$ (c'est vrai, mais peu informatif). Pour dire
« le coût est exactement de l'ordre de $n^2$ », on écrit $\Theta(n^2)$. Beaucoup de documents écrivent $O$ en
pensant $\Theta$ : à l'écrit, sois précis.
:::

### Les classes usuelles

| Classe          | Nom           | Exemple d'algorithme                        | $n = 10^3$  | $n = 10^6$       |
|-----------------|---------------|---------------------------------------------|-------------|------------------|
| $\Theta(1)$     | constant      | accès `t[i]`, `append`                      | 1 ns        | 1 ns             |
| $\Theta(\log n)$| logarithmique | recherche dichotomique                      | 10 ns       | 20 ns            |
| $\Theta(n)$     | linéaire      | recherche séquentielle, maximum             | 1 µs        | 1 ms             |
| $\Theta(n \log n)$ | quasi-linéaire | tri fusion                              | 10 µs       | 20 ms            |
| $\Theta(n^2)$   | quadratique   | tri par insertion (pire cas)                | 1 ms        | 17 min           |
| $\Theta(n^3)$   | cubique       | produit de matrices naïf                    | 1 s         | 32 ans           |
| $\Theta(2^n)$   | exponentiel   | énumérer toutes les parties d'un ensemble   | $\approx 10^{284}$ ans | —      |

(temps estimés à raison d'un milliard d'opérations par seconde)

Ce tableau dit l'essentiel : passer de $n^2$ à $n \log n$ change tout dès que les données sont grandes, et un
algorithme exponentiel est inutilisable au-delà de quelques dizaines d'éléments.

### Règles de calcul

- **Séquence** : deux blocs à la suite → on **additionne** ; l'ordre de grandeur est celui du plus coûteux
  ($\Theta(n) + \Theta(n^2) = \Theta(n^2)$).
- **Boucle** : coût du corps × nombre de tours (si le corps a un coût constant) ; sinon, on **somme** le coût de
  chaque tour.
- **Appel de fonction** : on compte le coût de la fonction appelée, pas « 1 ».

## 4. Estimer un temps d'exécution

Si un algorithme est en $\Theta(n^2)$ et met 1 seconde pour $n = 10^4$, alors pour $n = 10^5$ (10 fois plus de
données) il mettra environ $10^2 = 100$ fois plus longtemps, soit 100 s. Pour un algorithme en $\Theta(n)$, 10 s ;
en $\Theta(n \log n)$, un peu plus de 10 s. On peut vérifier ces prévisions en mesurant :

```python exec
import time

def paires_egales(t):          # Θ(n²) : toutes les paires
    c = 0
    for i in range(len(t)):
        for j in range(i + 1, len(t)):
            if t[i] == t[j]:
                c += 1
    return c

for n in [500, 1000, 2000]:
    t = [i % 7 for i in range(n)]
    debut = time.perf_counter()
    paires_egales(t)
    print(n, f"{(time.perf_counter() - debut) * 1000:.1f} ms")
```

Quand `n` double, le temps est environ multiplié par 4 : signature d'un coût quadratique.

## 5. Le coût caché des opérations Python

Une ligne de Python n'est pas toujours une opération élémentaire. Certaines cachent une boucle :

| Opération                          | Coût              |
|------------------------------------|-------------------|
| `t[i]`, `t[i] = v`, `len(t)`, `t.append(v)`, `t.pop()` | constant |
| `x in t`, `t.index(x)`, `t.count(x)`, `t.remove(x)`, `min(t)`, `sum(t)` | linéaire |
| `t.insert(0, v)`, `t.pop(0)`       | linéaire (décalage) |
| `t[a:b]` (tranche), `t + u`, `t.copy()` | proportionnel à la taille copiée |
| `sorted(t)`, `t.sort()`            | $\Theta(n \log n)$ |
| `x in d`, `d[k]`, `x in s` (dict, set) | constant en moyenne |

```python
for x in t:                 # n tours
    if x in t[:10]:         # copie de 10 éléments + recherche : constant
        ...
for x in t:                 # n tours
    if t.count(x) > 1:      # count parcourt toute la liste : n
        ...                 # → Θ(n²) au total, alors qu'on ne voit qu'une boucle !
```

### Et la mémoire ?

On mesure aussi le **coût en espace** : la mémoire utilisée **en plus** de l'entrée. `somme` utilise une mémoire
constante ; une fonction qui construit une copie triée de la liste utilise une mémoire linéaire. Le tri fusion
(mémoire linéaire) et le tri par insertion en place (mémoire constante) illustrent ce compromis.

:::prof
Au lycée, on parle de « coût » plutôt que de « complexité », et on reste souvent au niveau « linéaire, quadratique,
logarithmique ». Faire **mesurer** des temps pour des tailles qui doublent rend la notion concrète (on voit le
facteur 2 ou 4). L'erreur classique des élèves : croire qu'une seule boucle visible implique un coût linéaire,
sans voir le `in` ou le `count` caché dans le corps.
:::

## Exemple guidé

**Problème (type écrit 1).** Déterminer le coût, en nombre de comparaisons `t[j] == x`, de la fonction suivante,
au meilleur et au pire, pour une liste `t` de taille `n`.

```python exec
def frequence_max(t):
    """Nombre d'apparitions de l'élément le plus fréquent de t (t non vide)."""
    meilleur = 0
    for i in range(len(t)):
        x = t[i]
        compte = 0
        for j in range(len(t)):
            if t[j] == x:
                compte += 1
        if compte > meilleur:
            meilleur = compte
    return meilleur

print(frequence_max([3, 1, 3, 2, 3, 1]))
```

**1. Opération comptée et taille.** La comparaison `t[j] == x`, en fonction de `n = len(t)`.

**2. Compter.** La boucle externe fait `n` tours ; à chaque tour, la boucle interne fait **toujours** `n` tours
(aucune sortie anticipée). Le nombre de comparaisons est donc exactement $n \times n = n^2$, **quelle que soit
l'entrée** : meilleur cas = pire cas = $n^2$. Le coût est en $\Theta(n^2)$.

**3. Améliorer.** Un dictionnaire de fréquences fait un seul parcours : chaque élément met à jour son compteur en
temps constant en moyenne, puis on prend le maximum des compteurs.

```python exec
def frequence_max_rapide(t):
    compte = {}
    for x in t:
        compte[x] = compte.get(x, 0) + 1
    return max(compte.values())

print(frequence_max_rapide([3, 1, 3, 2, 3, 1]))
```

Coût : $n$ mises à jour en temps constant moyen, plus le maximum de au plus $n$ valeurs : $\Theta(n)$ en moyenne,
au prix d'une mémoire supplémentaire en $O(n)$. Pour $n = 10^6$, on passe d'environ $10^{12}$ comparaisons
(plusieurs heures en Python) à environ $10^6$ opérations (moins d'une seconde).

## L'essentiel

- Coût = nombre d'opérations caractéristiques en fonction de la taille `n` ; on précise l'opération comptée.
- Meilleur cas / pire cas : on les illustre par une **entrée concrète**. Le pire cas est une garantie.
- $O$ : au plus ; $\Omega$ : au moins ; $\Theta$ : même ordre de grandeur. On garde le terme dominant, sans constante.
- $1 < \log n < n < n\log n < n^2 < n^3 < 2^n$ ; $\sum_{i=1}^n i = \frac{n(n+1)}{2}$ ; diviser par 2 jusqu'à 1 : $\log_2 n$ étapes.
- Boucles imbriquées : on multiplie (ou on somme si la boucle interne dépend de l'externe).
- Attention aux coûts cachés : `in`, `count`, `index`, tranches, `insert(0)` sur une liste sont linéaires.

## Exercices

::::exercice[Une boucle simple]{niveau=1}
Quel est l'ordre de grandeur du nombre de tours de cette boucle, en fonction de `n` ?

```python
i = 1
while i < n:
    i = i * 2
```

- [ ] $\Theta(1)$
- [x] $\Theta(\log n)$
- [ ] $\Theta(n)$
- [ ] $\Theta(n^2)$

:::corrige
`i` vaut 1, 2, 4, 8… $2^k$ après $k$ tours ; la boucle s'arrête quand $2^k \ge n$, soit après $\lceil \log_2 n \rceil$
tours : $\Theta(\log n)$.
:::
::::

::::exercice[Reconnaître Θ(n²)]{niveau=1}
Lesquelles de ces fonctions sont en $\Theta(n^2)$ ?

- [x] $\frac{n(n-1)}{2}$
- [ ] $3n + 5$
- [x] $5n^2 + 100n\log n$
- [ ] $n^3 / 1000$
- [x] $(n + 1)^2$

:::corrige
$\frac{n(n-1)}{2} = \frac{n^2}{2} - \frac{n}{2}$, $5n^2 + 100 n \log n$ et $(n+1)^2 = n^2 + 2n + 1$ ont tous $n^2$
comme terme dominant. $3n + 5$ est en $\Theta(n)$ (c'est un $O(n^2)$, mais pas un $\Theta(n^2)$). $n^3/1000$ est en
$\Theta(n^3)$ : la constante $1/1000$ ne change pas l'ordre de grandeur.
:::
::::

::::exercice[Estimer un temps]{niveau=1}
Un algorithme en $\Theta(n^2)$ traite 20 000 données en 4 secondes. Combien de temps faut-il environ pour 60 000 données ?

- [ ] 12 s
- [x] 36 s
- [ ] 8 s
- [ ] 64 s

:::corrige
$n$ est multiplié par 3, donc le temps par $3^2 = 9$ : environ $4 \times 9 = 36$ s.
:::
::::

::::exercice[Compter exactement]{niveau=2}
Combien de fois l'instruction `c += 1` est-elle exécutée, en fonction de `n` ? Justifie par un calcul de somme,
puis donne l'ordre de grandeur.

```python
c = 0
for i in range(n):
    for j in range(i, n):
        c += 1
```

:::criteres
- Le nombre de tours de la boucle interne pour un `i` donné est `n - i`.
- La somme $\sum_{i=0}^{n-1} (n - i) = n + (n-1) + \dots + 1 = \frac{n(n+1)}{2}$ est calculée.
- La conclusion est $\Theta(n^2)$.
:::

:::corrige
Pour `i` fixé, `j` va de `i` à `n - 1` : `n - i` tours. Au total :
$$ \sum_{i=0}^{n-1} (n - i) = n + (n - 1) + \dots + 1 = \frac{n(n+1)}{2}. $$
Par exemple, pour $n = 4$ : $4 + 3 + 2 + 1 = 10$. C'est un $\Theta(n^2)$.
:::
::::

::::exercice[Les « leaders » d'une liste]{niveau=2}
Un élément d'une liste est un **leader** s'il est strictement plus grand que tous les éléments situés à sa droite
(le dernier élément est toujours un leader). Écris `leaders(t)` qui renvoie la liste des leaders, dans l'ordre où ils
apparaissent dans `t`, avec un coût **linéaire**.

```python depart
def leaders(t):
    ...
```

```python tests
assert leaders([16, 17, 4, 3, 5, 2]) == [17, 5, 2], "cas courant"
assert leaders([1, 2, 3]) == [3], "liste croissante"
assert leaders([3, 2, 1]) == [3, 2, 1], "liste décroissante"
assert leaders([]) == [], "liste vide"
assert leaders([5, 5]) == [5], "égalité : strictement plus grand"
```

:::indice
La solution naïve compare chaque élément à tous ceux de droite : $\Theta(n^2)$. Parcours plutôt la liste **de droite
à gauche** en retenant le maximum déjà vu.
:::

:::corrige
```python solution
def leaders(t):
    resultat = []
    maxi = None
    for i in range(len(t) - 1, -1, -1):
        if maxi is None or t[i] > maxi:
            resultat.append(t[i])
            maxi = t[i]
    resultat.reverse()
    return resultat
```
Un seul parcours (n tours, chacun en temps constant) puis un renversement linéaire : $\Theta(n)$. L'invariant :
`maxi` est le maximum des éléments déjà parcourus (ceux de droite).
:::
::::

::::exercice[Meilleur et pire cas]{niveau=3}
On considère la fonction suivante, qui renvoie l'indice du premier élément strictement plus grand que son successeur,
ou -1. On compte les comparaisons `t[i] > t[i + 1]`.

```python
def premiere_descente(t):
    for i in range(len(t) - 1):
        if t[i] > t[i + 1]:
            return i
    return -1
```

Donne le nombre de comparaisons dans le meilleur et le pire cas pour une liste de taille $n \ge 2$, avec à chaque fois
un exemple d'entrée de taille 5.

:::criteres
- Meilleur cas : 1 comparaison, quand `t[0] > t[1]` ; exemple `[2, 1, 3, 4, 5]`.
- Pire cas : $n - 1$ comparaisons, quand la liste est croissante (au sens large) ou que la seule descente est entre les deux derniers ; exemple `[1, 2, 3, 4, 5]`.
- Conclusion : coût en $\Theta(n)$ dans le pire cas, $\Theta(1)$ dans le meilleur.
:::

:::corrige
- **Meilleur cas** : la première comparaison est vraie (`t[0] > t[1]`) et la fonction s'arrête : **1** comparaison.
  Exemple : `[2, 1, 3, 4, 5]`.
- **Pire cas** : aucune descente (liste croissante au sens large), ou une seule à la fin : la boucle fait ses
  $n - 1$ tours : **n − 1** comparaisons. Exemple : `[1, 2, 3, 4, 5]` (ou `[1, 2, 3, 5, 4]`).

Le coût est donc en $\Theta(1)$ au mieux et en $\Theta(n)$ au pire.
:::
::::

::::exercice[Un coût caché]{niveau=3}
Quel est le coût dans le pire cas de cette fonction, en fonction de `n = len(t)` ? Propose une version de même
résultat en $\Theta(n)$ en moyenne.

```python
def sans_doublons(t):
    resultat = []
    for x in t:
        if x not in resultat:
            resultat.append(x)
    return resultat
```

:::criteres
- Le test `x not in resultat` est identifié comme un parcours de `resultat`, de coût proportionnel à sa taille.
- Pire cas : tous les éléments distincts ; `resultat` grandit de 1 à chaque tour ; total $0 + 1 + \dots + (n-1) = \frac{n(n-1)}{2}$ comparaisons, soit $\Theta(n^2)$.
- La version améliorée utilise un `set` des éléments vus (test en temps constant en moyenne), en gardant l'ordre avec la liste résultat.
:::

:::corrige
Le `in` sur une liste est un parcours. Dans le pire cas (éléments tous distincts), au tour `k` la liste `resultat`
contient `k` éléments, tous comparés à `x` : au total $\sum_{k=0}^{n-1} k = \frac{n(n-1)}{2}$ comparaisons, soit
$\Theta(n^2)$, alors qu'on « ne voit » qu'une boucle.

```python
def sans_doublons(t):
    vus = set()
    resultat = []
    for x in t:
        if x not in vus:          # constant en moyenne
            vus.add(x)
            resultat.append(x)
    return resultat
```
Coût linéaire en moyenne, mémoire supplémentaire linéaire (l'ensemble `vus`).
:::
::::

::::exercice[Analyse complète d'un algorithme]{niveau=4 duree=25}
On veut savoir si une liste `t` de `n` entiers contient trois éléments d'indices distincts dont la somme est nulle.

```python
def triplet_nul(t):
    n = len(t)
    for i in range(n):
        for j in range(i + 1, n):
            for k in range(j + 1, n):
                if t[i] + t[j] + t[k] == 0:
                    return True
    return False
```

1. On compte les tests `t[i] + t[j] + t[k] == 0`. Quel est le nombre de tests dans le pire cas ? Justifie et donne
   l'ordre de grandeur. Décris une entrée qui réalise le pire cas.
2. Quel est le meilleur cas ?
3. On suppose maintenant la liste **triée**. Pour `i` fixé, explique comment trouver `j` et `k` (avec `i < j < k`) tels
   que `t[j] + t[k] == -t[i]` en un seul parcours, à l'aide de deux indices qui se rapprochent. Écris la fonction
   correspondante et donne son coût total, tri compris.

:::criteres
- Pire cas : aucun triplet ne convient ; le nombre de tests est le nombre de triplets $i < j < k$, soit $\binom{n}{3} = \frac{n(n-1)(n-2)}{6}$, donc $\Theta(n^3)$ ; exemple : une liste de nombres tous strictement positifs.
- Meilleur cas : `t[0] + t[1] + t[2] == 0`, un seul test.
- Méthode à deux indices : `j = i + 1`, `k = n - 1` ; si la somme est trop petite on avance `j`, trop grande on recule `k`, égale on a trouvé ; arrêt quand `j >= k`.
- Justification de la méthode : la liste étant triée, augmenter `j` augmente la somme, diminuer `k` la diminue ; on n'écarte jamais de solution.
- Coût : $\Theta(n)$ par valeur de `i`, donc $\Theta(n^2)$, plus $\Theta(n \log n)$ pour le tri : total $\Theta(n^2)$.
:::

:::corrige
1. Chaque triplet d'indices $i < j < k$ est testé une fois au plus. Dans le pire cas (aucun triplet nul — par exemple
   une liste de nombres tous strictement positifs), on les teste tous : il y en a autant que de façons de choisir 3
   indices parmi `n`, soit
   $$ \binom{n}{3} = \frac{n(n-1)(n-2)}{6} $$
   tests (on peut aussi le calculer par $\sum_i \sum_{j>i} (n - 1 - j)$). C'est un $\Theta(n^3)$.
2. Meilleur cas : `t[0] + t[1] + t[2] == 0` : **un seul** test.
3. Liste triée. Pour `i` fixé, on cherche `j < k` dans `t[i+1:]` avec `t[j] + t[k] == -t[i]`. On part de `j = i + 1`
   et `k = n - 1`. Si `t[j] + t[k]` est trop petit, seul augmenter `j` peut aider (diminuer `k` ferait encore baisser
   la somme) ; s'il est trop grand, on diminue `k`. Aucune solution n'est jamais écartée, et `k - j` diminue de 1 à
   chaque étape : au plus `n` étapes par valeur de `i`.
   ```python
   def triplet_nul_rapide(t):
       t = sorted(t)
       n = len(t)
       for i in range(n - 2):
           j, k = i + 1, n - 1
           while j < k:
               s = t[i] + t[j] + t[k]
               if s == 0:
                   return True
               elif s < 0:
                   j += 1
               else:
                   k -= 1
       return False
   ```
   Coût : $\Theta(n \log n)$ pour le tri, puis $\Theta(n)$ par valeur de `i`, donc $\Theta(n^2)$ au total.
   Pour $n = 10^4$, on passe d'environ $1{,}7 \times 10^{11}$ tests à environ $10^8$.
:::
::::
