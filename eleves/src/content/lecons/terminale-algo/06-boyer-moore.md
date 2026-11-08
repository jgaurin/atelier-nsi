---
titre: Recherche textuelle
resume: "Chercher un motif dans un texte, de la méthode naïve à Boyer-Moore."
duree: 40
objectifs:
  - "Écrire la recherche naïve"
  - "Étudier l'algorithme de Boyer-Moore et l'intérêt du prétraitement"
prerequis: [premiere-algo/parcours]
---

Chercher un mot dans un texte peut aller bien plus vite qu'on ne le croit.

## 1. La recherche naïve

On place le motif à chaque position, on compare, et on décale d'**un** cran.

## 2. L'idée de Boyer-Moore

- On compare le motif **de droite à gauche**.
- En cas d'échec, on regarde le caractère du texte aligné avec la fin du motif, et on **saute** plusieurs positions d'un coup.

Ces décalages sont calculés **une fois pour toutes** à partir du motif : c'est le **prétraitement**.

## 3. La table des décalages

Pour un motif de longueur m, chaque caractère de `motif[0..m-2]` a pour décalage **m − 1 − sa dernière position** (hors dernière case). Un caractère absent donne un décalage **m**.

Pour `DABRA` (m = 5) :

| caractère | D | A | B | R | autre |
| --- | --- | --- | --- | --- | --- |
| décalage | 4 | 3 | 2 | 1 | 5 |

C'est la version simplifiée, dite de **Horspool**. Un caractère absent du motif ne peut correspondre à aucune case : on saute donc toute la longueur.

## 4. L'algorithme

```
i = 0
tant que i ≤ n − m :
    comparer le motif à texte[i .. i+m−1], de droite à gauche
    si tout correspond : noter la position i
    c = texte[i+m−1]
    i = i + décalage de c (m si c n'est pas dans la table)
```

## L'essentiel

- Naïf : décalage d'un cran.
- Boyer-Moore : comparaison de droite à gauche et sauts grâce à un prétraitement du motif.
- Un caractère absent du motif permet de sauter toute sa longueur.

## Exercices

::::exercice[QCM : recherche textuelle]{niveau=1 type=quiz}
Une question à la fois : la correction s'affiche aussitôt.

1. Dans la recherche naïve, de combien décale-t-on le motif après un échec ?

   - [x] d'une position
   - [ ] de la longueur du motif
   - [ ] de deux positions
   - [ ] cela dépend de la table

   > C'est ce qui la rend lente.

1. Dans quel sens Boyer-Moore-Horspool compare-t-il le motif au texte ?

   - [ ] de gauche à droite
   - [x] de droite à gauche
   - [ ] du milieu vers les bords
   - [ ] au hasard

   > On commence par la fin du motif.

1. De quoi dépend la table des décalages ?

   - [ ] du texte
   - [x] du motif seulement
   - [ ] du texte et du motif
   - [ ] de la longueur du texte

   > Elle est calculée une fois, avant la recherche.

1. Pour le motif `"DABRA"`, quel est le décalage associé à un caractère absent du motif, comme `"Z"` ?

   - [ ] 1
   - [ ] 4
   - [x] 5
   - [ ] 0

   > On peut sauter tout le motif.

1. Pour le motif `"DABRA"`, quel est le décalage de `"A"` ?

   - [ ] 1
   - [x] 3
   - [ ] 4
   - [ ] 5

   > Dernière position de A hors la dernière case : 1 ; 5 − 1 − 1 = 3.
::::

::::exercice[Table des décalages]{niveau=1 type=completer}
Complète la table de Horspool du motif `CHAT`.

```python calcul
m = "CHAT"
t = {}
for i in range(len(m) - 1):
    t[m[i]] = len(m) - 1 - i
print(t["C"]); print(t["H"]); print(t["A"]); print(len(m))
```

| Caractère | C | H | A | autre |
| --- | --- | --- | --- | --- |
| Décalage | [[3]] | [[2]] | [[1]] | [[4]] |
::::

::::exercice[La table des décalages]{niveau=2}
Écris `table_decalages(motif)` qui renvoie le dictionnaire des décalages de Horspool pour les caractères de `motif[0..m−2]` (les caractères absents
ne figurent pas dans le dictionnaire).

```python depart
def table_decalages(motif):
    ...
```

```python tests
assert table_decalages("DABRA") == {"D": 4, "A": 3, "B": 2, "R": 1}, "DABRA"
assert table_decalages("ABAB") == {"A": 1, "B": 2}, "dernière occurrence avant la fin"
assert table_decalages("X") == {}, "motif d'un caractère"
assert table_decalages("GCAGAGAG") == {"G": 2, "C": 6, "A": 1}, "ADN"
```

:::corrige
```python solution
def table_decalages(motif):
    m = len(motif)
    table = {}
    for i in range(m - 1):
        table[motif[i]] = m - 1 - i
    return table
```

On parcourt le motif de gauche à droite, sans la dernière case : chaque nouvelle occurrence d'un caractère **écrase** l'ancienne, on garde donc
la dernière.
:::
::::

::::exercice[Dérouler Horspool]{niveau=2}
On cherche le motif `"CHAT"` dans le texte `"UN CHIEN ET UN CHAT"`. (a) Calcule la table des décalages. (b) Déroule l'algorithme : pour chaque
position i examinée, donne la fenêtre, le résultat de la comparaison, le caractère sous la fin du motif et le décalage. (c) Combien de fenêtres
la recherche naïve examinerait-elle au plus ?

:::criteres
- (a) C : 3, H : 2, A : 1 ; autres caractères : 4.
- (b) Déroulé cohérent avec les règles, se terminant par l'occurrence en position 15.
- (c) 19 − 4 + 1 = 16 fenêtres pour la recherche naïve.
:::

:::corrige
(a) m = 4 ; sans le dernier caractère (T) : C en position 0 → 3, H en 1 → 2, A en 2 → 1 ; tout autre caractère → **4**.

(b) Le texte compte 19 caractères (positions 0 à 18) :

| i | fenêtre | comparaison | sous la fin | décalage |
| --- | --- | --- | --- | --- |
| 0 | `UN C` | C ≠ T | C | 3 |
| 3 | `CHIE` | E ≠ T | E | 4 |
| 7 | `N ET` | T = T, E ≠ A | T | 4 |
| 11 | ` UN ` | espace ≠ T | espace | 4 |
| 15 | `CHAT` | tout correspond : trouvé en 15 | T | 4 |

Pour la fenêtre en 7, T n'est pas dans la table (il n'apparaît qu'en dernière position du motif) : décalage 4.

(c) La recherche naïve examinerait jusqu'à 19 − 4 + 1 = **16** fenêtres ; Horspool en examine **5**.
:::
::::

::::exercice[Boyer-Moore-Horspool]{niveau=3}
Écris `horspool(texte, motif)` qui renvoie la liste des positions des occurrences du motif, avec l'algorithme de Boyer-Moore-Horspool, et
`nb_fenetres(texte, motif)` qui renvoie le nombre de positions du motif examinées (le nombre de tours de la boucle principale).

```python depart
def table_decalages(motif):
    m = len(motif)
    table = {}
    for i in range(m - 1):
        table[motif[i]] = m - 1 - i
    return table

def horspool(texte, motif):
    ...

def nb_fenetres(texte, motif):
    ...
```

```python tests
assert horspool("ABRACADABRA", "DABRA") == [6], "une occurrence"
assert horspool("ABRACADABRA", "ABRA") == [0, 7], "deux occurrences"
assert horspool("AAAA", "AA") == [0, 1, 2], "chevauchement"
assert horspool("bonjour", "xyz") == [], "absent"
assert nb_fenetres("ABRACADABRA", "DABRA") == 3, "trois fenêtres"
texte = "le chat dort sur le canapé du salon " * 20
assert horspool(texte, "salon") == [i for i in range(len(texte) - 4) if texte[i:i + 5] == "salon"], "texte long"
assert nb_fenetres(texte, "salon") < len(texte) / 2, "beaucoup moins de fenêtres que de caractères"
```

:::corrige
```python solution
def table_decalages(motif):
    m = len(motif)
    table = {}
    for i in range(m - 1):
        table[motif[i]] = m - 1 - i
    return table

def parcours(texte, motif):
    n = len(texte)
    m = len(motif)
    table = table_decalages(motif)
    positions = []
    fenetres = 0
    i = 0
    while i <= n - m:
        fenetres = fenetres + 1
        j = m - 1
        while j >= 0 and texte[i + j] == motif[j]:
            j = j - 1
        if j < 0:
            positions.append(i)
        c = texte[i + m - 1]
        i = i + table.get(c, m)
    return positions, fenetres

def horspool(texte, motif):
    return parcours(texte, motif)[0]

def nb_fenetres(texte, motif):
    return parcours(texte, motif)[1]
```

`table.get(c, m)` renvoie le décalage de c s'il est dans la table, m sinon. Sur un texte en français, la plupart des fenêtres se terminent par un
caractère absent de « salon » : on saute 5 positions d'un coup.
:::
::::
