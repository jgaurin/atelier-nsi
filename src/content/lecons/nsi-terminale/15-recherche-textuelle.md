---
titre: Recherche textuelle
resume: "Le cours de terminale NSI sur la recherche d'un motif dans un texte : algorithme naïf (fenêtre glissante) et son coût, algorithme de Boyer-Moore-Horspool (comparaison de droite à gauche, table des décalages calculée par prétraitement), déroulés pas à pas et applications (éditeurs, génomique)."
duree: 55
objectifs:
  - "Écrire l'algorithme naïf de recherche d'un motif et estimer son coût"
  - "Calculer la table des décalages de Boyer-Moore-Horspool"
  - "Dérouler et écrire l'algorithme de Boyer-Moore-Horspool"
  - "Expliquer l'intérêt du prétraitement du motif"
prerequis: [nsi-premiere/texte, nsi-premiere/dictionnaires, nsi-premiere/parcours]
programme: [nsit-algo]
cartes:
  - q: "Principe de la recherche naïve ?"
    r: "Placer le motif à chaque position du texte (fenêtre glissante) et comparer caractère par caractère ; en cas d'échec, **décaler d'un cran**."
  - q: "Coût de la recherche naïve ?"
    r: "Dans le pire cas, de l'ordre de **n × m** comparaisons (n : longueur du texte, m : longueur du motif)."
  - q: "Idée de Boyer-Moore-Horspool ?"
    r: "Comparer le motif **de droite à gauche** ; en cas d'échec, regarder le caractère du texte aligné avec la **fin** du motif, et **sauter** directement de plusieurs positions grâce à une table calculée à l'avance."
  - q: "Table des décalages de Horspool ?"
    r: "Pour chaque caractère c présent dans le motif **sauf à la dernière position** : décalage = m − 1 − (dernière position de c dans motif[0..m−2]). Un caractère absent : décalage **m**."
  - q: "Pourquoi Boyer-Moore est-il rapide en pratique ?"
    r: "Si le caractère lu n'est pas dans le motif, on saute de **m** positions d'un coup : on lit souvent beaucoup moins de caractères que la longueur du texte."
  - q: "Qu'est-ce qu'un prétraitement ?"
    r: "Un calcul fait **une fois** sur le motif avant la recherche (la table des décalages), qui accélère ensuite toute la recherche."
---

Ctrl+F dans un navigateur, recherche dans un traitement de texte, détection d'une séquence de gènes dans un génome de 3 milliards de lettres,
antivirus qui cherche des signatures : la **recherche d'un motif dans un texte** est partout. L'algorithme naïf est simple, mais il existe une
méthode bien plus rapide en pratique, due à **Boyer et Moore** (1977), simplifiée par **Horspool** (1980).

## Ce que dit le programme

Contenus : *recherche textuelle*. Capacités attendues : **étudier l'algorithme de Boyer-Moore pour la recherche d'un motif dans un texte**. Le
programme précise : l'intérêt du **prétraitement du motif** est mis en avant ; l'étude du coût, difficile, ne peut être exigée.

## 1. La recherche naïve

On fait glisser le motif le long du texte. À chaque position, on compare caractère par caractère ; au premier désaccord, on décale le motif
d'**un** cran.

```python exec
def recherche_naive(texte, motif):
    """Renvoie la liste des positions où motif apparaît dans texte."""
    n = len(texte)
    m = len(motif)
    positions = []
    for i in range(n - m + 1):
        j = 0
        while j < m and texte[i + j] == motif[j]:
            j = j + 1
        if j == m:
            positions.append(i)
    return positions

print(recherche_naive("ABRACADABRA", "ABRA"))
```

Dans le pire cas (texte `AAAA…AAB`, motif `AAAB`), on fait presque m comparaisons à chacune des n positions : de l'ordre de **n × m**
comparaisons. Et surtout, l'algorithme n'exploite pas ce qu'il a appris lors des comparaisons précédentes.

## 2. L'idée de Boyer-Moore-Horspool

Deux idées :

1. Comparer le motif au texte **de droite à gauche** (en commençant par la fin du motif).
2. En cas d'échec, regarder le caractère du texte aligné avec la **dernière** position du motif, et décaler le motif pour aligner ce caractère avec
   sa **dernière occurrence** dans le motif (hors dernière position). S'il n'apparaît pas dans le motif, on peut **sauter tout le motif**.

Les décalages ne dépendent que du **motif** : on les calcule **une seule fois**, avant la recherche. C'est le **prétraitement**.

## 3. La table des décalages

Pour un motif de longueur m, pour chaque caractère c qui apparaît dans `motif[0..m−2]` (tout sauf le dernier caractère) :

$$\text{décalage}(c) = m - 1 - (\text{dernière position de } c \text{ dans } motif[0..m-2])$$

et pour tout autre caractère, décalage = **m**.

Exemple, motif `"DABRA"` (m = 5) :

| caractère | D | A | B | R | autre |
| --- | --- | --- | --- | --- | --- |
| dernière position (hors la dernière case) | 0 | 1 | 2 | 3 | |
| décalage | 4 | 3 | 2 | 1 | 5 |

Le A de la position 4 (la dernière) n'est pas pris en compte ; seule sa dernière occurrence **avant** compte (position 1).

```python exec
def table_decalages(motif):
    m = len(motif)
    table = {}
    for i in range(m - 1):
        table[motif[i]] = m - 1 - i      # les occurrences suivantes écrasent les précédentes
    return table

print(table_decalages("DABRA"))
```

## 4. L'algorithme

```python exec
def table_decalages(motif):
    m = len(motif)
    table = {}
    for i in range(m - 1):
        table[motif[i]] = m - 1 - i
    return table

def horspool(texte, motif):
    n = len(texte)
    m = len(motif)
    table = table_decalages(motif)
    positions = []
    i = 0                                      # position du motif dans le texte
    while i <= n - m:
        j = m - 1
        while j >= 0 and texte[i + j] == motif[j]:
            j = j - 1                          # comparaison de droite à gauche
        if j < 0:
            positions.append(i)                # motif trouvé
        c = texte[i + m - 1]                   # caractère sous la fin du motif
        if c in table:
            i = i + table[c]
        else:
            i = i + m
    return positions

print(horspool("ABRACADABRA", "DABRA"), horspool("ABRACADABRA", "ABRA"))
```

Déroulé : chercher `"DABRA"` dans `"ABRACADABRA"`.

| i | fenêtre | comparaison | caractère sous la fin | décalage |
| --- | --- | --- | --- | --- |
| 0 | ABRAC | C ≠ A, échec immédiat | C (absent) | 5 |
| 5 | ADABR | R ≠ A, échec | R | 1 |
| 6 | DABRA | tout correspond : trouvé en 6 | A | 3 |
| 9 | | 9 > 11 − 5 : fin | | |

Trois fenêtres examinées au lieu de sept pour la recherche naïve, et dès la première, un saut de 5.

## 5. Pourquoi c'est rapide

- Plus le **motif est long**, plus les sauts peuvent être grands : paradoxalement, chercher un long motif peut être plus rapide qu'un court.
- Avec un grand alphabet (texte en français), beaucoup de caractères ne sont pas dans le motif : on saute souvent de m positions. On lit alors
  environ **n / m** caractères seulement.
- Dans le pire cas, le coût reste de l'ordre de n × m, mais ce cas est rare en pratique.

L'algorithme de Boyer-Moore complet ajoute une seconde règle (le « bon suffixe ») pour des sauts encore plus grands. On le trouve dans les
éditeurs de texte, la commande `grep`, et ses idées en bio-informatique.

## Les erreurs classiques des élèves

:::attention[Ce que tu verras en classe]
- **Inclure le dernier caractère du motif** dans la table des décalages (son décalage serait 0 : boucle infinie).
- **Garder la première occurrence** au lieu de la **dernière** (avant la fin) d'un caractère.
- **Regarder le caractère qui a provoqué l'échec** au lieu de celui aligné avec la **fin** du motif (c'est la règle de Horspool).
- **Borne de la boucle** : `i <= n - m`, sinon on lit hors du texte.
- **Croire que la table dépend du texte** : elle ne dépend que du motif.
:::

## En classe

:::methode[Activités qui marchent]
1. **Bandes de papier** : le texte sur une longue bande, le motif sur une réglette qu'on fait glisser ; compter les comparaisons des deux
   méthodes.
2. **Construire la table** de plusieurs motifs, puis dérouler à la main.
3. **Mesurer** en Python le nombre de comparaisons des deux algorithmes sur un roman entier (*Les Misérables* sur le projet Gutenberg).
4. **Génomique** : chercher une courte séquence d'ADN (alphabet A, C, G, T) et observer que les sauts sont plus petits.
:::

## L'essentiel

- **Recherche naïve** : fenêtre glissante, décalage d'un cran ; pire cas de l'ordre de **n × m**.
- **Boyer-Moore-Horspool** : comparaison **de droite à gauche** ; en cas d'échec, décalage selon le caractère du texte aligné avec la **fin** du
  motif.
- **Prétraitement** : table des décalages, m − 1 − (dernière position avant la fin) ; m pour un caractère absent.
- En pratique, beaucoup plus rapide (sauts de m positions) ; d'autant plus que le motif est long et l'alphabet grand.

## Exercices

::::exercice[Grand QCM : recherche textuelle]{niveau=1 type=quiz}
Dix questions sur la recherche d'un motif.

1. Dans la recherche naïve, de combien décale-t-on le motif après un échec ?

   - [x] d'une position
   - [ ] de la longueur du motif
   - [ ] de deux positions
   - [ ] cela dépend de la table

   > C'est ce qui la rend lente.

1. Quel est le coût de la recherche naïve dans le pire cas (texte de longueur n, motif de longueur m) ?

   - [ ] n
   - [ ] m
   - [x] n × m
   - [ ] n + m

   > Jusqu'à m comparaisons à chacune des n positions.

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

1. Pourquoi ne tient-on pas compte du dernier caractère du motif dans la table ?

   - [ ] pour économiser de la mémoire
   - [x] son décalage vaudrait 0 et l'algorithme n'avancerait plus
   - [ ] parce qu'il est toujours absent du texte
   - [ ] c'est une convention sans importance

   > m − 1 − (m − 1) = 0.

1. Quel caractère du texte utilise Horspool pour choisir le décalage ?

   - [ ] celui qui a provoqué l'échec
   - [x] celui aligné avec la dernière position du motif
   - [ ] le premier caractère du texte
   - [ ] le caractère suivant la fenêtre

   > C'est la simplification de Horspool.

1. Quand Boyer-Moore-Horspool est-il particulièrement efficace ?

   - [ ] avec un motif d'un seul caractère
   - [x] avec un motif long et un grand alphabet
   - [ ] avec un alphabet de deux lettres
   - [ ] quand le motif est absent du texte seulement

   > Les sauts de m positions sont alors fréquents.

1. Qu'appelle-t-on prétraitement ici ?

   - [ ] la lecture du texte
   - [x] le calcul de la table des décalages avant la recherche
   - [ ] le tri du texte
   - [ ] la conversion en majuscules

   > Un calcul fait une fois, qui sert à toute la recherche.
::::

::::exercice[Recherche naïve]{niveau=1}
Écris `recherche_naive(texte, motif)` qui renvoie la liste des positions de toutes les occurrences du motif (non vide) dans le texte, et
`nb_comparaisons(texte, motif)` qui renvoie le nombre total de comparaisons de caractères effectuées.

```python depart
def recherche_naive(texte, motif):
    ...

def nb_comparaisons(texte, motif):
    ...
```

```python tests
assert recherche_naive("ABRACADABRA", "ABRA") == [0, 7], "deux occurrences"
assert recherche_naive("AAAA", "AA") == [0, 1, 2], "occurrences qui se chevauchent"
assert recherche_naive("NSI", "XYZ") == [], "absent"
assert recherche_naive("AB", "ABC") == [], "motif plus long"
assert nb_comparaisons("AAAAB", "AAB") == 9, "trois positions, trois comparaisons chacune"
```

:::corrige
```python solution
def recherche_naive(texte, motif):
    n = len(texte)
    m = len(motif)
    positions = []
    for i in range(n - m + 1):
        j = 0
        while j < m and texte[i + j] == motif[j]:
            j = j + 1
        if j == m:
            positions.append(i)
    return positions

def nb_comparaisons(texte, motif):
    n = len(texte)
    m = len(motif)
    total = 0
    for i in range(n - m + 1):
        j = 0
        while j < m:
            total = total + 1
            if texte[i + j] != motif[j]:
                break
            j = j + 1
    return total
```

Pour `"AAAAB"` et `"AAB"`, il y a trois positions : les fenêtres « AAA », « AAA » et « AAB ». Dans les deux premières, on
compare A = A, A = A, puis A ≠ B : 3 comparaisons ; la troisième correspond entièrement : 3 comparaisons. Total : 9, pour un motif trouvé
une seule fois. C'est le pire cas de la recherche naïve : on recompare des caractères déjà lus.
:::
::::

::::exercice[La table des décalages]{niveau=1}
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

::::exercice[Boyer-Moore-Horspool]{niveau=2}
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
