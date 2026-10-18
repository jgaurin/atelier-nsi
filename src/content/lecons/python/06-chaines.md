---
titre: Chaînes de caractères
resume: Manipuler du texte en Python, caractère par caractère ou avec les méthodes des chaînes, et comprendre pourquoi une chaîne ne se modifie pas.
duree: 60
objectifs:
  - Accéder aux caractères et aux tranches d'une chaîne, et la parcourir
  - Utiliser les méthodes courantes (`split`, `join`, `strip`, `lower`, `replace`, `find`…)
  - Expliquer l'immuabilité des chaînes et construire une nouvelle chaîne efficacement
  - Passer d'un caractère à son code avec `ord` et `chr` et formater un affichage avec une f-string
prerequis: [python/listes]
programme: [lp-python, id-types-simples, nsi1-base, nsi1-construits]
cartes:
  - q: Que se passe-t-il avec `s = "chat"` puis `s[0] = "C"` ?
    r: "Une erreur `TypeError` : une chaîne est **immuable**. On crée une nouvelle chaîne : `s = \"C\" + s[1:]`."
  - q: Que vaut `"a-b-c".split("-")` ? Et `"-".join(["a", "b"])` ?
    r: "`[\"a\", \"b\", \"c\"]` et `\"a-b\"`."
  - q: Que font `ord` et `chr` ?
    r: "`ord(\"A\")` donne le code (point de code Unicode) du caractère, 65 ; `chr(65)` donne le caractère `\"A\"`."
  - q: Que vaut `"Bonjour".find("jour")` ? Et `"Bonjour".find("soir")` ?
    r: "`3` (indice du début de la première occurrence) et `-1` (absent)."
  - q: Pourquoi construire une longue chaîne avec `"".join(morceaux)` plutôt qu'avec `+=` dans une boucle ?
    r: "Chaque `+=` crée une nouvelle chaîne en recopiant l'ancienne : coût quadratique dans le pire cas. `join` assemble tout en une fois (coût linéaire)."
  - q: "Qu'affiche `f\"{3.14159:.2f}\"` ?"
    r: "`3.14` : la f-string formate le nombre avec 2 décimales."
  - q: "Que représente `\"\\n\"` ?"
    r: "Le caractère « retour à la ligne » (un seul caractère, échappé par la barre oblique inverse)."
---

Un nom, un message, un mot de passe, une ligne de fichier CSV, une page HTML, une séquence d'ADN : énormément de
données sont du **texte**. En Python, un texte est une **chaîne de caractères** (`str`). On l'a déjà utilisée ;
on voit ici comment la découper, la parcourir, la transformer, et pourquoi elle se comporte un peu différemment
d'une liste.

## 1. Une chaîne est une séquence de caractères

On écrit une chaîne entre guillemets simples ou doubles (`'NSI'` ou `"NSI"`) ; entre triples guillemets, elle peut
tenir sur plusieurs lignes. Comme une liste, elle a une longueur, des indices et des tranches :

```python exec
s = "Informatique"
print(len(s), s[0], s[-1], s[2:6], s[::-1])
for c in "abc":
    print(c, end=" ")
print()
print("form" in s, "Form" in s)
```

Certains caractères s'écrivent avec une **séquence d'échappement** commençant par `\` : `"\n"` (retour à la ligne),
`"\t"` (tabulation), `"\""` (guillemet), `"\\"` (barre oblique inverse). Chacune ne compte que pour **un** caractère.

```python exec
texte = "ligne 1\nligne 2\tavec tabulation"
print(texte)
print(len("a\nb"))
```

## 2. Une chaîne ne se modifie pas

:::definition
Une chaîne est **immuable** : une fois créée, on ne peut ni changer, ni ajouter, ni retirer un de ses caractères.
Toutes les opérations qui semblent la « modifier » (`+`, `upper`, `replace`…) **créent une nouvelle chaîne**.
:::

```python exec erreur
s = "chat"
s[0] = "C"
```

```python exec
s = "chat"
s = "C" + s[1:]       # nouvelle chaîne, puis le nom s désigne cette nouvelle chaîne
print(s)
t = s.upper()
print(s, t)           # s n'a pas changé
```

C'est une différence essentielle avec les listes, qui sont **mutables**. Elle a une conséquence sur le coût :
construire une chaîne caractère par caractère avec `+=` recrée à chaque fois une chaîne de plus en plus longue.
Pour assembler beaucoup de morceaux, on les met dans une liste puis on les **joint** une seule fois :

```python exec
morceaux = []
for i in range(5):
    morceaux.append(str(i * i))
print(", ".join(morceaux))
```

## 3. Les méthodes utiles

Une **méthode** est une fonction attachée à une valeur, qu'on appelle avec un point : `s.upper()`.

| Méthode                       | Exemple                              | Résultat               |
|-------------------------------|--------------------------------------|------------------------|
| `lower()`, `upper()`          | `"NsI".lower()`                      | `"nsi"`                |
| `strip()`                     | `"  bonjour \n".strip()`             | `"bonjour"`            |
| `split(sep)`                  | `"12;8;15".split(";")`               | `["12", "8", "15"]`    |
| `split()` (sans argument)     | `"le  chat  dort".split()`           | `["le", "chat", "dort"]` |
| `sep.join(liste)`             | `"-".join(["a", "b", "c"])`          | `"a-b-c"`              |
| `replace(a, b)`               | `"banane".replace("a", "o")`         | `"bonone"`             |
| `find(sous)`                  | `"banane".find("na")`                | `2` (ou `-1` si absent)|
| `count(sous)`                 | `"banane".count("an")`               | `2`                    |
| `startswith`, `endswith`      | `"photo.png".endswith(".png")`       | `True`                 |
| `isdigit()`, `isalpha()`      | `"2026".isdigit()`                   | `True`                 |

```python exec
ligne = "Martin;Léa;14.5\n"
nom, prenom, note = ligne.strip().split(";")
print(prenom, nom, float(note) + 1)
```

Ce découpage `strip().split(";")` est exactement ce qu'on fait pour lire un fichier CSV ligne à ligne
(leçon « Données en table »).

## 4. Caractères et codes

Chaque caractère a un **code** numérique (son point de code Unicode). `ord` donne le code d'un caractère,
`chr` le caractère d'un code. Les lettres non accentuées ont des codes consécutifs : `ord("a")` vaut 97,
`ord("b")` 98… et les majuscules commencent à 65.

```python exec
print(ord("A"), ord("a"), ord("é"), ord("€"))
print(chr(65), chr(97 + 2))
# rang d'une lettre dans l'alphabet (0 pour a, 25 pour z)
lettre = "k"
print(ord(lettre) - ord("a"))
```

Le module « Représentation de l'information » explique comment ces codes sont ensuite écrits en octets (ASCII, UTF-8).

## 5. Formater un affichage : les f-strings

Une **f-string** (préfixe `f`) insère des valeurs dans un texte, entre accolades, avec un format optionnel :

```python exec
nom, moyenne, rang = "Inès", 14.6666, 3
print(f"{nom} a {moyenne:.2f} de moyenne et est {rang}e.")
print(f"{42:5d}|{3.5:8.3f}|{'ok':>6}|")
print(f"{nom=}, {rang * 2 = }")
```

`:.2f` affiche 2 décimales ; `:5d` un entier sur 5 caractères ; `:>6` aligne à droite sur 6 caractères.

:::prof
L'immuabilité surprend les élèves qui viennent de manipuler des listes : faire comparer `t[0] = …` (liste) et
`s[0] = …` (chaîne) dans la console est très parlant. Autre source d'erreur : confondre `split` (chaîne → liste)
et `join` (liste → chaîne), et oublier que `input` et les lectures de fichier donnent des chaînes (`"12" + 1`
provoque une erreur). Le chiffrement de César est une activité classique et motivante pour travailler `ord`/`chr`
et le modulo.
:::

## Exemple guidé

**Problème.** Écrire une fonction `cesar(message, cle)` qui chiffre un message en décalant chaque lettre minuscule
de `cle` rangs dans l'alphabet (en revenant à `a` après `z`) et laisse les autres caractères inchangés.
Puis écrire le déchiffrement.

**1. Le cœur du problème : une lettre.** Le rang de la lettre `c` est `r = ord(c) - ord("a")`, entre 0 et 25.
Le rang décalé est `(r + cle) % 26` : le **modulo** fait le « retour au début ». On revient à une lettre avec
`chr(ord("a") + nouveau_rang)`.

**2. Le message entier.** On ne peut pas modifier la chaîne : on construit la liste des caractères chiffrés, puis on
la joint.

```python exec
def cesar(message, cle):
    resultat = []
    for c in message:
        if "a" <= c <= "z":
            rang = (ord(c) - ord("a") + cle) % 26
            resultat.append(chr(ord("a") + rang))
        else:
            resultat.append(c)
    return "".join(resultat)

secret = cesar("rendez-vous a minuit", 3)
print(secret)
print(cesar(secret, -3))
```

**3. Déchiffrer.** Décaler de `-cle` annule le décalage : en Python, `(r - 3) % 26` reste entre 0 et 25 même si
`r - 3` est négatif (car `%` renvoie un résultat du signe du diviseur). Pas besoin d'une autre fonction.

**4. Tester les cas limites.** `cesar("xyz", 3)` doit donner `"abc"` (passage de `z` à `a`) ; un message vide doit
donner `""` ; les espaces, chiffres et lettres accentuées restent inchangés.

**5. Limite.** Ce chiffrement ne résiste pas à une attaque : il n'y a que 26 clés possibles, et la fréquence des
lettres trahit le décalage. Le module réseaux présente le chiffrement moderne.

## L'essentiel

- Une chaîne est une séquence : `len`, indices, tranches, `in`, parcours avec `for`.
- Une chaîne est **immuable** : toute « modification » crée une nouvelle chaîne.
- Pour assembler beaucoup de morceaux : liste + `"".join(liste)`, plutôt que `+=` en boucle.
- Méthodes clés : `strip`, `split`, `join`, `lower`/`upper`, `replace`, `find`, `count`, `startswith`.
- `ord(c)` donne le code d'un caractère, `chr(n)` le caractère ; rang d'une lettre : `ord(c) - ord("a")`.
- f-string : `f"{valeur:.2f}"`.

## Exercices

::::exercice[Immuabilité]{niveau=1}
Après `s = "python"` puis `t = s.upper()`, que valent `s` et `t` ?

- [ ] `s == "PYTHON"` et `t == "PYTHON"`
- [x] `s == "python"` et `t == "PYTHON"`
- [ ] `s == "PYTHON"` et `t is None`
- [ ] une erreur, car une chaîne est immuable

:::corrige
`upper` ne modifie pas `s` (c'est impossible) : elle **renvoie une nouvelle chaîne**, rangée dans `t`.
:::
::::

::::exercice[split et join]{niveau=1}
Que vaut `"-".join("12/03/2026".split("/"))` ?

- [ ] `"12/03/2026"`
- [x] `"12-03-2026"`
- [ ] `["12", "03", "2026"]`
- [ ] `"-12-03-2026-"`

:::corrige
`split("/")` donne `["12", "03", "2026"]`, puis `join` recolle les morceaux avec `"-"` entre eux (pas aux extrémités).
:::
::::

::::exercice[Compter les voyelles]{niveau=2}
Écris `nb_voyelles(texte)` qui compte les voyelles (a, e, i, o, u, y), en majuscules comme en minuscules.
On ignore les accents (ils ne comptent pas).

```python depart
def nb_voyelles(texte):
    ...
```

```python tests
assert nb_voyelles("informatique") == 6, "informatique"
assert nb_voyelles("NSI") == 1, "majuscules"
assert nb_voyelles("") == 0, "chaîne vide"
assert nb_voyelles("rythme") == 2, "le y compte"
assert nb_voyelles("bcdfg") == 0, "aucune voyelle"
```

:::corrige
```python solution
def nb_voyelles(texte):
    n = 0
    for c in texte.lower():
        if c in "aeiouy":
            n += 1
    return n
```
On met le texte en minuscules une seule fois, au lieu de tester `"aeiouyAEIOUY"`.
:::
::::

::::exercice[Palindrome]{niveau=2}
Un **palindrome** se lit de la même façon dans les deux sens. Écris `est_palindrome(phrase)` qui ignore les espaces et
la casse : `"Esope reste ici et se repose"` est un palindrome.

```python depart
def est_palindrome(phrase):
    ...
```

```python tests
assert est_palindrome("radar") == True, "mot simple"
assert est_palindrome("Esope reste ici et se repose") == True, "phrase avec espaces et majuscule"
assert est_palindrome("python") == False, "pas un palindrome"
assert est_palindrome("") == True, "chaîne vide"
assert est_palindrome("ab") == False, "deux lettres différentes"
```

:::corrige
```python solution
def est_palindrome(phrase):
    s = phrase.lower().replace(" ", "")
    i, j = 0, len(s) - 1
    while i < j:
        if s[i] != s[j]:
            return False
        i += 1
        j -= 1
    return True
```
On pourrait écrire `return s == s[::-1]`, mais cette version crée une chaîne retournée et compare toujours tout ;
celle avec deux indices s'arrête au premier défaut et n'utilise pas de mémoire supplémentaire.
:::
::::

::::exercice[Compression par plages]{niveau=2}
On compresse une chaîne en remplaçant chaque suite de caractères identiques consécutifs par le caractère suivi du
nombre de répétitions : `"aaabccdddd"` devient `"a3b1c2d4"`. Écris `compresser(s)`.

```python depart
def compresser(s):
    ...
```

```python tests
assert compresser("aaabccdddd") == "a3b1c2d4", "cas courant"
assert compresser("abc") == "a1b1c1", "aucune répétition"
assert compresser("") == "", "chaîne vide"
assert compresser("zzzz") == "z4", "une seule plage"
```

:::indice
Garde le caractère courant et un compteur. Quand le caractère change, ajoute le morceau terminé au résultat.
N'oublie pas la dernière plage après la boucle.
:::

:::corrige
```python solution
def compresser(s):
    if s == "":
        return ""
    morceaux = []
    courant, compte = s[0], 1
    for c in s[1:]:
        if c == courant:
            compte += 1
        else:
            morceaux.append(courant + str(compte))
            courant, compte = c, 1
    morceaux.append(courant + str(compte))
    return "".join(morceaux)
```
L'oubli de la **dernière plage** (après la boucle) est l'erreur classique : le test `"zzzz"` la détecte.
Ce codage (RLE, *run-length encoding*) est utilisé dans certains formats d'images simples.
:::
::::

::::exercice[Anagrammes]{niveau=3}
Deux mots sont des **anagrammes** s'ils contiennent exactement les mêmes lettres, avec le même nombre d'occurrences
(« chien » et « niche »). Écris `anagrammes(a, b)` **sans trier**, en comptant les lettres.

```python depart
def anagrammes(a, b):
    ...
```

```python tests
assert anagrammes("chien", "niche") == True, "chien / niche"
assert anagrammes("aab", "abb") == False, "mêmes lettres, pas mêmes nombres"
assert anagrammes("abc", "abcd") == False, "longueurs différentes"
assert anagrammes("", "") == True, "deux chaînes vides"
```

:::corrige
```python solution
def anagrammes(a, b):
    if len(a) != len(b):
        return False
    compte = {}
    for c in a:
        compte[c] = compte.get(c, 0) + 1
    for c in b:
        if compte.get(c, 0) == 0:
            return False
        compte[c] -= 1
    return True
```
On utilise un **dictionnaire** lettre → nombre (leçon suivante). Coût linéaire en la longueur des mots, contre
$n \log n$ pour la solution qui compare `sorted(a) == sorted(b)`.
:::
::::

::::exercice[Chercher l'erreur dans un test de palindrome]{niveau=4 duree=15}
Un élève propose cette fonction pour tester si un mot est un palindrome.

```python
def palindrome(mot):
    n = len(mot)
    for i in range(n):
        if mot[i] != mot[n - i]:
            return False
    return True
```

1. Que se passe-t-il à l'appel `palindrome("kayak")` ? Explique précisément.
2. Corrige la fonction. Combien de comparaisons de caractères fait ta version, au pire et au mieux, pour un mot de
   longueur `n` ?
3. Propose une amélioration qui divise par deux le nombre de comparaisons au pire, et justifie qu'elle reste correcte.

:::criteres
- L'erreur est identifiée : pour `i = 0`, on accède à `mot[n]`, hors limites (`IndexError`), car le dernier indice est `n - 1`.
- La correction compare `mot[i]` à `mot[n - 1 - i]`.
- Coût de la version corrigée : au pire `n` comparaisons (palindrome), au mieux 1 (premier et dernier caractères différents).
- L'amélioration arrête la boucle à la moitié (`range(n // 2)`), avec la justification : la comparaison de `i` et de `n - 1 - i` est la même que celle de `n - 1 - i` et `i`, et le caractère central d'un mot de longueur impaire n'a pas besoin d'être comparé.
- Le nouveau coût au pire est `n // 2` comparaisons.
:::

:::corrige
1. Pour `i = 0`, la fonction compare `mot[0]` à `mot[n - 0]`, c'est-à-dire `mot[5]` pour `"kayak"`. Or les indices
   valides vont de 0 à `n - 1 = 4` : l'appel provoque une **`IndexError`** dès le premier tour, avant toute comparaison.
   Le caractère symétrique de `mot[i]` est `mot[n - 1 - i]`.
2. ```python
   def palindrome(mot):
       n = len(mot)
       for i in range(n):
           if mot[i] != mot[n - 1 - i]:
               return False
       return True
   ```
   Au pire (le mot est un palindrome), la boucle fait `n` tours, donc **n** comparaisons. Au mieux (premier et dernier
   caractères différents), **1** comparaison.
3. On s'arrête à la moitié : `for i in range(n // 2):`. Les comparaisons pour `i >= n // 2` refont, dans l'autre sens,
   celles déjà faites (comparer `mot[i]` et `mot[n-1-i]` revient à comparer `mot[n-1-i]` et `mot[i]`), et si `n` est
   impair, le caractère du milieu (`i = n // 2`) est comparé à lui-même. On fait alors au pire **n // 2** comparaisons,
   pour exactement la même réponse.
:::
::::
