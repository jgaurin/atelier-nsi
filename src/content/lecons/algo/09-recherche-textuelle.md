---
titre: Recherche textuelle
resume: Trouver toutes les occurrences d'un motif dans un texte, d'abord naïvement, puis avec l'algorithme de Boyer-Moore-Horspool qui saute des positions.
duree: 65
objectifs:
  - Écrire la recherche naïve d'un motif et calculer son coût au pire et au mieux
  - Construire la table de décalage de Boyer-Moore-Horspool et dérouler l'algorithme à la main
  - Programmer l'algorithme de Horspool et comparer son nombre de comparaisons à la méthode naïve
  - Exhiber des entrées favorables et défavorables pour chaque algorithme
prerequis: [python/chaines, algo/complexite]
programme: [asd-recherche-tris, asd-cout, nsit-algo]
cartes:
  - q: Coût de la recherche naïve d'un motif de longueur `m` dans un texte de longueur `n` ?
    r: "Au pire $(n - m + 1) \\times m$ comparaisons, soit $\\Theta(nm)$ ; au mieux $n - m + 1$ (le premier caractère ne correspond jamais)."
  - q: Dans quel sens Boyer-Moore-Horspool compare-t-il le motif ?
    r: "De **droite à gauche** : on commence par le dernier caractère du motif."
  - q: Que contient la table de décalage de Horspool ?
    r: "Pour chaque caractère `c` présent dans `motif[0..m-2]`, la distance entre sa dernière occurrence (hors dernière position) et la fin du motif : `m - 1 - i`. Pour un caractère absent : `m`."
  - q: De combien décale-t-on après une comparaison dans Horspool ?
    r: "De `decalage[c]`, où `c` est le caractère du texte aligné avec la **dernière** position du motif."
  - q: Meilleur cas de Horspool ?
    r: "Environ $n/m$ comparaisons, quand le caractère du texte aligné sur la fin du motif n'apparaît jamais dans le motif : on saute de `m` à chaque fois."
  - q: Pourquoi Horspool est-il efficace sur un texte en français ?
    r: "Les motifs sont plutôt longs et l'alphabet grand : les décalages sont souvent proches de `m`, on examine une petite fraction du texte."
---

Chercher un mot dans un document, une séquence dans un génome, une signature de virus dans un fichier : la **recherche
textuelle** est partout. La commande `Ctrl + F`, la méthode `str.find` ou l'outil `grep` la font en un clin d'œil, même sur
des millions de caractères. L'algorithme naïf est simple mais peut être lent ; l'algorithme de **Boyer-Moore** (1977), et
sa version simplifiée par **Horspool** (1980), au programme de terminale, est souvent beaucoup plus rapide : il réussit à
**ne pas lire** la plupart des caractères du texte.

## 1. La recherche naïve

On place le motif à chaque position possible du texte et on compare caractère par caractère, de gauche à droite,
jusqu'à la première différence.

```python exec
def recherche_naive(texte, motif):
    """Liste des positions où motif apparaît dans texte."""
    n, m = len(texte), len(motif)
    positions = []
    for i in range(n - m + 1):            # position du motif dans le texte
        j = 0
        while j < m and texte[i + j] == motif[j]:
            j += 1
        if j == m:
            positions.append(i)
    return positions

print(recherche_naive("le chat et le chien et le cheval", "che"))
print(recherche_naive("aaaaa", "aa"))       # les occurrences peuvent se chevaucher
```

**Coût** (en comparaisons de caractères), avec $n$ = longueur du texte et $m$ = longueur du motif :
- il y a $n - m + 1$ positions à essayer ;
- **meilleur cas** : le premier caractère diffère à chaque position : $n - m + 1$ comparaisons, $\Theta(n)$ ;
- **pire cas** : on compare presque tout le motif à chaque position, par exemple le motif `"aaab"` dans le texte
  `"aaaa…a"` : $(n - m + 1) \times m$ comparaisons, $\Theta(nm)$.

## 2. L'idée de Boyer-Moore-Horspool

Deux idées qui, ensemble, permettent de **sauter** des positions :
1. on compare le motif au texte **de droite à gauche** (en commençant par la fin du motif) ;
2. après la comparaison (réussie ou non), on regarde le caractère `c` du texte aligné avec la **dernière case** du motif,
   et on **décale** le motif pour aligner la dernière occurrence de `c` dans le motif (hors dernière case) — ou on saute
   tout le motif si `c` n'y apparaît pas.

Exemple : on cherche `"CHIEN"` dans `"LE CHAT ET LE CHIEN"`. On aligne le motif au début : le caractère du texte sous la
dernière case du motif est `"H"` (position 4 du texte) ; `"H"` apparaît dans le motif en position 1, à 3 cases de la fin :
on décale de 3 pour aligner ce `"H"` avec celui du motif. Si ce caractère était un `"Z"`, absent du motif, on décalerait de
5 d'un coup : aucune position intermédiaire ne pourrait donner une occurrence.

### La table de décalage

:::definition
Pour un motif de longueur $m$, la **table de décalage** associe à chaque caractère $c$ :
- $m - 1 - i$, où $i$ est la position de la **dernière** occurrence de $c$ dans `motif[0..m-2]` (on ignore la dernière case) ;
- $m$ si $c$ n'apparaît pas dans `motif[0..m-2]`.
:::

```python exec
def table_decalage(motif):
    m = len(motif)
    d = {}
    for i in range(m - 1):          # on ignore le dernier caractère
        d[motif[i]] = m - 1 - i     # une occurrence plus à droite écrase la précédente
    return d

print(table_decalage("CHIEN"))
print(table_decalage("ANANAS"))
```

Pour `"ANANAS"` ($m = 6$) : `A` en dernier à la position 4 → décalage 1 ; `N` en position 3 → 2 ; `S` n'apparaît qu'en
dernière position → décalage 6 (comme un caractère absent).

## 3. L'algorithme

```python exec
def horspool(texte, motif):
    n, m = len(texte), len(motif)
    if m == 0 or m > n:
        return []
    d = {}
    for i in range(m - 1):
        d[motif[i]] = m - 1 - i
    positions = []
    i = 0                                   # position du motif dans le texte
    while i <= n - m:
        j = m - 1
        while j >= 0 and texte[i + j] == motif[j]:   # comparaison de droite à gauche
            j -= 1
        if j < 0:
            positions.append(i)
        i += d.get(texte[i + m - 1], m)     # caractère aligné avec la fin du motif
    return positions

texte = "LE CHAT ET LE CHIEN ONT UN CHIEN"
print(horspool(texte, "CHIEN"))
```

Trace de la recherche de `"CHIEN"` (décalages : C → 4, H → 3, I → 2, E → 1, autres → 5) dans `"LE CHAT ET LE CHIEN"` :

| position `i` | fenêtre du texte | comparaisons (de droite à gauche) | caractère sous la fin | décalage |
|--------------|------------------|-----------------------------------|-----------------------|----------|
| 0            | `LE CH`          | `H` ≠ `N` (1)                     | `H`                   | 3        |
| 3            | `CHAT `          | ` ` ≠ `N` (1)                     | ` `                   | 5        |
| 8            | `ET LE`          | `E` ≠ `N` (1)                     | `E`                   | 1        |
| 9            | `T LE `          | ` ` ≠ `N` (1)                     | ` `                   | 5        |
| 14           | `CHIEN`          | 5 égalités : **trouvé**           | `N`                   | 5        |

5 positions examinées et 9 comparaisons, contre 15 positions et au moins 15 comparaisons pour la méthode naïve.

```python exec
def compter(texte, motif):
    n, m = len(texte), len(motif)
    naive = 0
    for i in range(n - m + 1):
        j = 0
        while j < m:
            naive += 1
            if texte[i + j] != motif[j]:
                break
            j += 1
    d = {motif[i]: m - 1 - i for i in range(m - 1)}
    bmh, i = 0, 0
    while i <= n - m:
        j = m - 1
        while j >= 0:
            bmh += 1
            if texte[i + j] != motif[j]:
                break
            j -= 1
        i += d.get(texte[i + m - 1], m)
    return naive, bmh

phrase = "dans une recherche textuelle on cherche un motif dans un texte tres long " * 50
print(compter(phrase, "algorithme"), compter(phrase, "texte"))
```

### Coût

- **Meilleur cas** : le caractère sous la fin du motif est presque toujours absent du motif : on saute de $m$ à chaque fois,
  avec une comparaison : environ $n / m$ comparaisons. Plus le motif est long, plus c'est rapide !
- **Pire cas** : $\Theta(nm)$, comme la méthode naïve (par exemple le motif `"baaa"` dans un texte `"aaaa…a"` : on compare
  `m` caractères à chaque position et on ne décale que de 1).
- En pratique (texte en langue naturelle, alphabet assez grand), le comportement est proche du meilleur cas. L'algorithme
  de Boyer-Moore complet ajoute une seconde règle (« bon suffixe ») qui garantit un pire cas linéaire ; l'algorithme de
  Knuth-Morris-Pratt garantit aussi $\Theta(n + m)$.

:::prof
La recherche textuelle est au programme de terminale NSI (« étudier l'algorithme de Boyer-Moore, avec la version
simplifiée de Horspool »). Faire dérouler l'algorithme à la main sur une bande de papier (le motif écrit sur une
réglette qu'on fait glisser) rend le décalage évident. Les élèves confondent souvent le caractère qui sert au décalage :
c'est celui du **texte** aligné avec la **fin** du motif, pas le caractère où la comparaison a échoué.
:::

## Exemple guidé

**Problème.** On cherche le motif `"GCAGAGAG"` dans une séquence d'ADN. 1. Construire la table de décalage.
2. Trouver une séquence de longueur 16 sur laquelle Horspool fait exactement 2 comparaisons.
3. Montrer qu'il existe des motifs et des textes pour lesquels Horspool est aussi lent que l'algorithme naïf.

**1. Table** ($m = 8$, on regarde `motif[0..6]` = `G C A G A G A`) : dernières occurrences hors dernière case :
`G` en position 5 → $8 - 1 - 5 = 2$ ; `A` en position 6 → 1 ; `C` en position 1 → 6 ; `T` absent → 8.

```python exec
motif = "GCAGAGAG"
print({motif[i]: len(motif) - 1 - i for i in range(len(motif) - 1)})
```

**2. Meilleur cas.** Si le caractère sous la fin du motif est toujours `T` (absent), on saute de 8 avec une seule
comparaison : la séquence `"TTTTTTTTTTTTTTTT"` (16 caractères) donne 2 positions examinées (0 et 8), 2 comparaisons.

**3. Pire cas.** Il faut que les comparaisons aillent loin vers la gauche avant d'échouer, **et** que les décalages soient
petits. Pour `"GCAGAGAG"`, un texte `"AAAA…A"` ne suffit pas : on compare `G` (fin du motif) à `A`, échec immédiat, une
seule comparaison par position. Prenons plutôt le motif `"BAAA"` et le texte `"AAAA…A"` : à chaque position, les trois `A`
de droite sont égaux puis `B` ≠ `A` (4 comparaisons), et le caractère sous la fin, `A`, donne un décalage `d["A"] = 1`.
Toutes les positions sont examinées : $(n - m + 1) \times m$ comparaisons, exactement comme l'algorithme naïf.

## L'essentiel

- Recherche naïve : chaque position, comparaison de gauche à droite ; $\Theta(nm)$ au pire, $\Theta(n)$ au mieux.
- Horspool : comparaison de **droite à gauche** ; décalage selon le caractère du texte sous la **fin** du motif.
- Table : `d[c] = m - 1 - i` pour la dernière occurrence `i` de `c` dans `motif[0..m-2]`, sinon `m`.
- Meilleur cas ≈ $n/m$ comparaisons (motif long, caractères absents) ; pire cas $\Theta(nm)$ ; très rapide en pratique.
- Boyer-Moore complet et Knuth-Morris-Pratt garantissent un coût linéaire.

## Exercices

::::exercice[Coût naïf]{niveau=1}
Combien de comparaisons de caractères fait la recherche naïve du motif `"aab"` dans le texte `"aaaaaa"` (6 caractères) ?

- [ ] 6
- [ ] 4
- [x] 12
- [ ] 18

:::corrige
Il y a $6 - 3 + 1 = 4$ positions ; à chacune, on compare `a = a`, `a = a`, puis `a ≠ b` : 3 comparaisons. Total
$4 \times 3 = 12$ : c'est le pire cas $(n - m + 1) \times m$.
:::
::::

::::exercice[Table de décalage]{niveau=1}
Quelle est la table de décalage de Horspool pour le motif `"RADAR"` ?

- [ ] `{'R': 4, 'A': 3, 'D': 2}`
- [x] `{'R': 4, 'A': 1, 'D': 2}`
- [ ] `{'R': 0, 'A': 1, 'D': 2}`
- [ ] `{'A': 1, 'D': 2}`

:::corrige
$m = 5$, on regarde `RADA` (positions 0 à 3) : `R` en 0 → $5 - 1 - 0 = 4$ ; `A` en dernier en 3 → 1 ; `D` en 2 → 2.
Les autres caractères ont un décalage de 5.
:::
::::

::::exercice[Toutes les occurrences, naïvement]{niveau=2}
Écris `occurrences(texte, motif)` qui renvoie la liste des positions de toutes les occurrences (même chevauchantes) de
`motif` dans `texte`, par la méthode naïve, sans utiliser `find`, `index`, `in` ni les tranches.

```python depart
def occurrences(texte, motif):
    ...
```

```python tests
assert occurrences("abracadabra", "abra") == [0, 7], "deux occurrences"
assert occurrences("aaaa", "aa") == [0, 1, 2], "chevauchements"
assert occurrences("abc", "d") == [], "absent"
assert occurrences("ab", "abc") == [], "motif plus long que le texte"
assert occurrences("abcabc", "c") == [2, 5], "un seul caractère"
```

:::corrige
```python solution
def occurrences(texte, motif):
    n, m = len(texte), len(motif)
    resultat = []
    for i in range(n - m + 1):
        j = 0
        while j < m and texte[i + j] == motif[j]:
            j += 1
        if j == m:
            resultat.append(i)
    return resultat
```
Quand `m > n`, `range(n - m + 1)` est vide : aucune erreur d'indice.
:::
::::

::::exercice[Construire la table]{niveau=2}
Écris `table_decalage(motif)` qui renvoie le dictionnaire des décalages de Horspool pour les caractères de
`motif[0..m-2]` (les caractères absents ne figurent pas dans le dictionnaire).

```python depart
def table_decalage(motif):
    ...
```

```python tests
assert table_decalage("CHIEN") == {"C": 4, "H": 3, "I": 2, "E": 1}, "lettres distinctes"
assert table_decalage("RADAR") == {"R": 4, "A": 1, "D": 2}, "lettres répétées"
assert table_decalage("AAAB") == {"A": 1}, "le dernier caractère est ignoré"
assert table_decalage("X") == {}, "motif d'une lettre"
```

:::corrige
```python solution
def table_decalage(motif):
    m = len(motif)
    d = {}
    for i in range(m - 1):
        d[motif[i]] = m - 1 - i
    return d
```
En parcourant de gauche à droite, une occurrence plus à droite écrase la précédente : on garde bien la **dernière**.
:::
::::

::::exercice[Programmer Horspool]{niveau=3}
Écris `horspool(texte, motif)` qui renvoie la liste des positions de toutes les occurrences de `motif` dans `texte`
(motif non vide), avec l'algorithme de Boyer-Moore-Horspool.

```python depart
def horspool(texte, motif):
    ...
```

```python tests
assert horspool("LE CHAT ET LE CHIEN ONT UN CHIEN", "CHIEN") == [14, 27], "deux occurrences"
assert horspool("abracadabra", "abra") == [0, 7], "abracadabra"
assert horspool("aaaa", "aa") == [0, 1, 2], "chevauchements"
assert horspool("abc", "abcd") == [], "motif trop long"
import random
random.seed(3)
t = "".join(random.choice("ACGT") for _ in range(2000))
naif = [i for i in range(len(t) - 5) if t[i:i + 6] == "GATTAC"]
assert horspool(t, "GATTAC") == naif, "ADN aléatoire : mêmes résultats que la méthode naïve"
```

:::corrige
```python solution
def horspool(texte, motif):
    n, m = len(texte), len(motif)
    d = {}
    for i in range(m - 1):
        d[motif[i]] = m - 1 - i
    positions = []
    i = 0
    while i <= n - m:
        j = m - 1
        while j >= 0 and texte[i + j] == motif[j]:
            j -= 1
        if j < 0:
            positions.append(i)
        i += d.get(texte[i + m - 1], m)
    return positions
```
Le décalage se fait **dans tous les cas** (même après une occurrence trouvée), selon le caractère sous la fin du motif.
Le dernier test compare avec une recherche par tranches sur une séquence aléatoire.
:::
::::

::::exercice[Dérouler à la main]{niveau=3}
Déroule l'algorithme de Horspool pour la recherche du motif `"ANA"` dans le texte `"BANANAS"` : pour chaque position du
motif, indique les comparaisons faites, le caractère utilisé pour le décalage et la valeur du décalage. Combien de
comparaisons au total ? Combien en ferait l'algorithme naïf ?

:::criteres
- Table : `A` → 2 (position 0), `N` → 1 ; autres → 3.
- Position 0 (`BAN`) : `N ≠ A`, 1 comparaison ; caractère sous la fin `N`, décalage 1.
- Position 1 (`ANA`) : 3 comparaisons, occurrence trouvée ; caractère `A`, décalage 2.
- Position 3 (`ANA`) : 3 comparaisons, occurrence ; caractère `A`, décalage 2 ; position 5 > n − m = 4 : fin.
- Total : 7 comparaisons ; occurrences en 1 et 3.
- Naïf : positions 0 à 4 : 1 + 3 + 1 + 3 + 1 = 9 comparaisons.
:::

:::corrige
Table pour `"ANA"` ($m = 3$, on regarde `AN`) : `A` → 2, `N` → 1, autres → 3. Texte `B A N A N A S` (positions 0 à 6), $n - m = 4$.

| `i` | fenêtre | comparaisons (droite → gauche) | sous la fin | décalage |
|-----|---------|-------------------------------|-------------|----------|
| 0   | `BAN`   | `N` ≠ `A` (1)                 | `N`         | 1        |
| 1   | `ANA`   | `A`=`A`, `N`=`N`, `A`=`A` (3) : occurrence | `A` | 2   |
| 3   | `ANA`   | 3 égalités (3) : occurrence   | `A`         | 2        |
| 5   | —       | $5 > 4$ : fin                 |             |          |

Total : **7** comparaisons, occurrences en 1 et 3. Naïf : positions 0 (`B`≠`A` : 1), 1 (3), 2 (`N`≠`A` : 1), 3 (3),
4 (`N`≠`A` : 1) : **9** comparaisons. Sur un texte si court et un motif de 3 lettres, le gain est faible ; il devient
important avec des motifs longs.
:::
::::

::::exercice[Analyse des cas extrêmes]{niveau=4 duree=20}
On note $n$ la longueur du texte et $m$ celle du motif ($m \le n$), et on compte les comparaisons de caractères.

1. Pour l'algorithme naïf, démontre que le nombre de comparaisons est compris entre $n - m + 1$ et $(n - m + 1)\,m$, et
   donne pour chaque borne une famille d'entrées qui l'atteint.
2. Pour Horspool, montre qu'avec le motif `"a" * (m - 1) + "b"` et le texte `"c" * n`, il y a exactement
   $\lfloor (n - m) / m \rfloor + 1$ comparaisons. Pourquoi est-ce bien meilleur que l'algorithme naïf pour de grands $m$ ?
3. Pour Horspool, exhibe une famille d'entrées qui nécessite $(n - m + 1)\,m$ comparaisons. Justifie.
4. Conclure : dans quels contextes Horspool est-il intéressant ? Cite un algorithme au pire cas linéaire.

:::criteres
- Naïf : $n - m + 1$ positions, entre 1 et $m$ comparaisons chacune ; borne basse atteinte quand le premier caractère du motif n'apparaît pas dans le texte (texte « ccc… », motif « ab… ») ; borne haute avec texte « aaa…a » et motif « aa…ab ».
- Horspool, Q2 : à chaque position, une comparaison (`c` ≠ `b`) ; `c` absent du motif donc décalage $m$ ; positions $0, m, 2m, \dots \le n - m$ : $\lfloor (n-m)/m \rfloor + 1$ positions donc autant de comparaisons, environ $n/m$.
- Horspool, Q3 : texte « aaa…a », motif « baa…a » ($m - 1$ fois `a` après `b`) : $m$ comparaisons par position (les $m-1$ `a` égaux puis `b` ≠ `a`), décalage `d['a'] = 1` ; toutes les positions sont examinées.
- Conclusion : intéressant pour des motifs longs et des alphabets assez grands (texte, ADN avec motifs longs) ; Knuth-Morris-Pratt ou Boyer-Moore complet (avec la règle du bon suffixe) sont linéaires au pire.
:::

:::corrige
1. Il y a $n - m + 1$ positions ; à chacune, on fait au moins 1 et au plus $m$ comparaisons. Borne basse : si le premier
   caractère du motif n'apparaît pas dans le texte (texte `"ccc…c"`, motif `"ab…"`), une comparaison par position :
   $n - m + 1$. Borne haute : texte `"aaa…a"` et motif `"aa…ab"` : à chaque position, $m - 1$ égalités puis un échec
   sur `b` : $(n - m + 1)\,m$.
2. À chaque position, la première comparaison (de droite à gauche) oppose `"c"` à `"b"` : échec immédiat, 1 comparaison.
   Le caractère sous la fin est `"c"`, absent du motif : décalage $m$. Les positions examinées sont $0, m, 2m, \dots$
   tant que $km \le n - m$, soit $\lfloor (n - m)/m \rfloor + 1$ positions et autant de comparaisons — environ $n/m$.
   Pour $m = 100$ et $n = 10^6$, environ $10^4$ comparaisons contre au moins $10^6$ pour l'algorithme naïf.
3. Texte `"aaa…a"` et motif `"b" + "a" * (m - 1)`. À chaque position, on compare de droite à gauche les $m - 1$ caractères
   `a` du motif (égaux), puis `b` ≠ `a` : $m$ comparaisons. Le caractère sous la fin est `a`, dont la dernière occurrence
   dans `motif[0..m-2]` est en position $m - 2$ : décalage 1. Toutes les $n - m + 1$ positions sont examinées :
   $(n - m + 1)\,m$ comparaisons, comme le pire cas naïf.
4. Horspool est intéressant quand les motifs sont assez longs et l'alphabet assez grand (recherche dans des textes,
   éditeurs, `grep`) : on saute souvent de presque $m$ caractères. Pour une garantie dans le pire cas, on utilise
   **Knuth-Morris-Pratt** ou **Boyer-Moore** complet (règle du bon suffixe), en $\Theta(n + m)$.
:::
::::
