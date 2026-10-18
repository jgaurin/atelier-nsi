---
titre: Dictionnaires et tables de hachage
resume: Le type abstrait dictionnaire et son implémentation la plus utilisée, la table de hachage — fonctions de hachage, collisions, facteur de charge et redimensionnement.
duree: 75
objectifs:
  - Spécifier le type abstrait dictionnaire et comparer ses implémentations (liste, ABR, table de hachage)
  - Expliquer le fonctionnement d'une table de hachage et la gestion des collisions par chaînage
  - Justifier le coût moyen constant (facteur de charge, redimensionnement) et le pire cas linéaire
  - Programmer une table de hachage simple
prerequis: [structures/abr, python/tuples-dictionnaires]
programme: [asd-lineaires, asd-types, nsit-structures]
cartes:
  - q: Opérations du type abstrait dictionnaire ?
    r: "Ajouter (ou modifier) une association clé → valeur, chercher la valeur d'une clé, supprimer une clé, tester la présence d'une clé."
  - q: Principe d'une table de hachage ?
    r: "Un tableau de m cases ; une fonction de hachage calcule, à partir de la clé, l'indice de la case où ranger l'association : `h(cle) % m`."
  - q: Qu'est-ce qu'une collision ?
    r: "Deux clés différentes qui donnent la même case. Elles sont inévitables (plus de clés possibles que de cases)."
  - q: Résolution des collisions par chaînage ?
    r: "Chaque case contient une liste des couples (clé, valeur) qui y tombent ; on cherche dans la liste de la case."
  - q: Qu'est-ce que le facteur de charge ?
    r: "$\\alpha = n / m$ (nombre d'éléments / nombre de cases) : la longueur moyenne des listes. On agrandit la table (souvent ×2) quand α dépasse un seuil."
  - q: Coût des opérations d'une table de hachage ?
    r: "$O(1)$ en moyenne (si la fonction de hachage répartit bien et α est borné) ; $O(n)$ dans le pire cas (toutes les clés dans la même case)."
  - q: Paradoxe des anniversaires ?
    r: "Avec 23 personnes, la probabilité que deux aient le même anniversaire dépasse 50 % : les collisions arrivent bien plus tôt qu'on ne le croit."
---

Le dictionnaire de Python retrouve la valeur associée à une clé en un temps quasiment indépendant du nombre de clés, que
le dictionnaire en contienne dix ou dix millions. Ce n'est pas magique : c'est une **table de hachage**, l'une des
structures de données les plus utilisées (dictionnaires et ensembles des langages, caches, index de bases de données,
tables de routage, détection de doublons…). Le programme de terminale présente le dictionnaire comme structure de données ;
comprendre ce qu'il y a dessous permet de justifier ses coûts et ses contraintes (pourquoi une liste ne peut pas être une clé).

## 1. Le type abstrait dictionnaire

:::definition
Un **dictionnaire** (ou tableau associatif) stocke des associations **clé → valeur**, chaque clé étant unique.
Opérations : `ajouter(d, cle, valeur)` (ou modifier si la clé existe), `chercher(d, cle)` (renvoie la valeur ; précondition
ou erreur si absente), `supprimer(d, cle)`, `contient(d, cle)`.
:::

| Implémentation                  | chercher           | ajouter            | supprimer          | parcours ordonné |
|---------------------------------|--------------------|--------------------|--------------------|------------------|
| liste de couples                | $\Theta(n)$        | $\Theta(n)$ (test de présence) | $\Theta(n)$ | $\Theta(n \log n)$ |
| ABR équilibré                   | $O(\log n)$        | $O(\log n)$        | $O(\log n)$        | $\Theta(n)$      |
| **table de hachage**            | $O(1)$ en moyenne  | $O(1)$ en moyenne  | $O(1)$ en moyenne  | $\Theta(n \log n)$ |

## 2. La table de hachage

L'idée : ranger les associations dans un **tableau** de $m$ cases, et calculer **directement** à partir de la clé la case où
la ranger. On utilise une **fonction de hachage** $h$ qui transforme une clé en un entier, puis on prend $h(\text{cle}) \bmod m$.

```mermaid legende="Une table de hachage à 5 cases, collisions gérées par chaînage"
graph LR
  K1(["'chat'"]) -- "h % 5 = 1" --> C1["case 1"]
  K2(["'chien'"]) -- "h % 5 = 3" --> C3["case 3"]
  K3(["'lapin'"]) -- "h % 5 = 1" --> C1
  C1 --> L1["('chat', 4) → ('lapin', 7)"]
  C3 --> L3["('chien', 2)"]
```

Une bonne fonction de hachage est **rapide** à calculer, donne toujours le **même** résultat pour la même clé, et **répartit**
les clés uniformément dans les cases. Pour une chaîne, on combine les codes de ses caractères, par exemple de façon
polynomiale :

```python exec
def hachage(cle, base=31):
    h = 0
    for c in cle:
        h = h * base + ord(c)
    return h

for mot in ["chat", "chien", "lapin", "niche"]:
    print(mot, hachage(mot), hachage(mot) % 8)
```

Python fournit `hash(x)` pour toutes les valeurs **immuables** (pour les chaînes, ce hachage est même rendu aléatoire à
chaque lancement de Python, pour empêcher des attaques qui provoqueraient volontairement des collisions).

## 3. Les collisions

Il y a bien plus de clés possibles que de cases : deux clés différentes peuvent tomber dans la même case, c'est une
**collision**. Elles arrivent vite : c'est le **paradoxe des anniversaires**. Avec 23 personnes (365 « cases »), la
probabilité qu'au moins deux aient le même anniversaire dépasse 50 %.

```python exec
def proba_collision(k, m=365):
    p_aucune = 1.0
    for i in range(k):
        p_aucune *= (m - i) / m
    return 1 - p_aucune

for k in [10, 23, 50, 70]:
    print(k, "personnes :", round(proba_collision(k), 3))
```

**Chaînage.** Chaque case contient une **liste** des couples `(clé, valeur)` qui y sont tombés. Chercher une clé, c'est
calculer sa case puis parcourir cette (courte) liste. (Autre méthode : l'**adressage ouvert**, où l'on cherche la case libre
suivante dans le tableau ; c'est ce que fait Python.)

## 4. Le coût : facteur de charge et redimensionnement

:::definition
Le **facteur de charge** est $\alpha = n / m$, le nombre d'éléments divisé par le nombre de cases : c'est la longueur
**moyenne** des listes de collisions.
:::

Si la fonction de hachage répartit bien les clés, une recherche parcourt en moyenne une liste de longueur $\alpha$ :
coût moyen $O(1 + \alpha)$. Pour que ce coût reste **constant**, on garde $\alpha$ borné : quand $\alpha$ dépasse un seuil
(par exemple 1), on **double** le nombre de cases et on **réinsère** tous les éléments (leur case change, puisque $m$ change).
Ce redimensionnement coûte $\Theta(n)$, mais il est rare : comme pour `append`, le coût **amorti** d'un ajout reste $O(1)$.

:::attention
Le coût constant est un coût **moyen**. Dans le **pire cas** (toutes les clés dans la même case, à cause d'une mauvaise
fonction de hachage ou de clés choisies par un attaquant), une recherche coûte $\Theta(n)$. Et une clé doit être
**immuable** : si elle changeait, son hachage changerait et on la chercherait dans la mauvaise case.
:::

:::prof
Le programme de terminale NSI demande de connaître l'interface du dictionnaire et son coût d'accès « en temps constant en
moyenne » ; le fonctionnement interne (hachage, collisions) est un approfondissement apprécié des bons élèves et des
jurys. L'analogie du vestiaire (un numéro calculé à partir du nom, plusieurs manteaux par patère) ou des casiers de courrier
par initiale aide à comprendre les collisions.
:::

## Exemple guidé

**Problème.** Programmer une table de hachage par chaînage, avec redimensionnement automatique quand le facteur de charge
dépasse 1, et vérifier qu'elle se comporte comme un dictionnaire.

```python exec
class TableHachage:
    def __init__(self, m=8):
        self._cases = [[] for _ in range(m)]
        self._n = 0

    def _indice(self, cle):
        return hash(cle) % len(self._cases)

    def ajouter(self, cle, valeur):
        case = self._cases[self._indice(cle)]
        for i, (k, _) in enumerate(case):
            if k == cle:
                case[i] = (cle, valeur)        # clé déjà présente : on remplace
                return
        case.append((cle, valeur))
        self._n += 1
        if self._n > len(self._cases):         # facteur de charge > 1
            self._agrandir()

    def chercher(self, cle):
        for k, v in self._cases[self._indice(cle)]:
            if k == cle:
                return v
        raise KeyError(cle)

    def supprimer(self, cle):
        case = self._cases[self._indice(cle)]
        for i, (k, _) in enumerate(case):
            if k == cle:
                del case[i]
                self._n -= 1
                return
        raise KeyError(cle)

    def _agrandir(self):
        anciennes = self._cases
        self._cases = [[] for _ in range(2 * len(anciennes))]
        self._n = 0
        for case in anciennes:
            for k, v in case:
                self.ajouter(k, v)            # chaque clé change de case

    def plus_longue_liste(self):
        return max(len(c) for c in self._cases)

t = TableHachage()
for i in range(1000):
    t.ajouter(f"eleve{i}", i)
t.supprimer("eleve3")
print(t.chercher("eleve42"), len(t._cases), t._n, t.plus_longue_liste())
```

**Lecture.** Après 1000 insertions, la table a 1024 cases (elle a doublé 7 fois), le facteur de charge est inférieur à 1 et
la plus longue liste ne contient que quelques éléments : une recherche ne fait que quelques comparaisons. Les 7
redimensionnements ont réinséré en tout $9 + 17 + 33 + \dots + 513 = 1\,023$ éléments : environ une réinsertion par ajout
en moyenne, d'où le coût amorti constant.

## L'essentiel

- Dictionnaire : associations clé → valeur, clés uniques ; liste $\Theta(n)$, ABR $O(\log n)$ (ordonné), table de hachage $O(1)$ en moyenne.
- Table de hachage : tableau de $m$ cases, case = `hash(cle) % m` ; bonne fonction : rapide, déterministe, uniforme.
- Collisions inévitables et fréquentes (anniversaires) ; chaînage (liste par case) ou adressage ouvert.
- Facteur de charge $\alpha = n/m$ : coût moyen $O(1 + \alpha)$ ; redimensionnement par doublement → $O(1)$ amorti.
- Pire cas $\Theta(n)$ ; les clés doivent être immuables (hachables) ; l'ordre des clés n'est pas exploitable.

## Exercices

::::exercice[Facteur de charge]{niveau=1}
Une table de hachage par chaînage a 1 000 cases et contient 3 000 éléments. Quelle est la longueur moyenne d'une liste ?

- [ ] 0,3
- [x] 3
- [ ] 1 000
- [ ] on ne peut pas savoir

:::corrige
Le facteur de charge vaut $\alpha = 3000 / 1000 = 3$ : c'est la longueur moyenne des listes. (Une liste précise peut être plus
longue ou plus courte.)
:::
::::

::::exercice[Pourquoi des clés immuables ?]{niveau=1}
Pourquoi Python refuse-t-il `{[1, 2]: "a"}` ?

- [ ] parce qu'une liste ne peut pas être comparée avec `==`
- [x] parce que la case d'une clé dépend de son hachage, qui changerait si la liste était modifiée
- [ ] parce que les dictionnaires ne contiennent que des chaînes
- [ ] parce qu'une liste est trop grande

:::corrige
La position d'une association dépend du hachage de sa clé. Si l'on pouvait modifier la clé après coup, son hachage changerait
et on ne la retrouverait plus dans la bonne case. Les listes, mutables, ne sont donc pas hachables.
:::
::::

::::exercice[Une fonction de hachage]{niveau=2}
Écris `hachage(cle, m)` qui renvoie l'indice de case d'une chaîne `cle` dans une table de `m` cases, avec le hachage
polynomial $h = (\dots((c_0 \times 31 + c_1) \times 31 + c_2) \dots)$ où $c_i$ est le code du i-ème caractère, puis
$h \bmod m$. Pour éviter des nombres énormes, applique le modulo à chaque étape.

```python depart
def hachage(cle, m):
    ...
```

```python tests
assert hachage("a", 100) == 97, "un caractère"
assert hachage("ab", 1000) == (97 * 31 + 98) % 1000, "deux caractères"
assert hachage("", 7) == 0, "chaîne vide"
assert 0 <= hachage("une très longue clé" * 100, 13) < 13, "résultat dans [0, m)"
assert hachage("chien", 10**9 + 7) != hachage("niche", 10**9 + 7), "anagrammes distingués"
```

:::corrige
```python solution
def hachage(cle, m):
    h = 0
    for c in cle:
        h = (h * 31 + ord(c)) % m
    return h
```
Prendre le modulo à chaque étape donne le même résultat que tout à la fin (propriétés du modulo), sans manipuler de très
grands entiers. Contrairement à la somme des codes, ce hachage distingue les anagrammes.
:::
::::

::::exercice[Table de hachage par chaînage]{niveau=2}
Complète la classe : `ajouter(cle, valeur)` (remplace la valeur si la clé existe), `chercher(cle)` (renvoie `None` si
absente) et `taille()`. La table a un nombre fixe de cases (pas de redimensionnement ici).

```python depart
class Table:
    def __init__(self, m=16):
        self._cases = [[] for _ in range(m)]
        self._n = 0

    def _case(self, cle):
        return self._cases[hash(cle) % len(self._cases)]

    def ajouter(self, cle, valeur):
        ...

    def chercher(self, cle):
        ...

    def taille(self):
        return self._n
```

```python tests
t = Table(4)
for i in range(20):
    t.ajouter(i, i * i)
assert t.chercher(7) == 49 and t.chercher(19) == 361, "valeurs retrouvées malgré les collisions"
assert t.chercher(25) is None, "clé absente"
t.ajouter(7, "sept")
assert t.chercher(7) == "sept" and t.taille() == 20, "remplacement sans doublon"
t.ajouter("x", 1)
assert t.taille() == 21, "nouvelle clé"
```

:::corrige
```python solution
class Table:
    def __init__(self, m=16):
        self._cases = [[] for _ in range(m)]
        self._n = 0

    def _case(self, cle):
        return self._cases[hash(cle) % len(self._cases)]

    def ajouter(self, cle, valeur):
        case = self._case(cle)
        for i in range(len(case)):
            if case[i][0] == cle:
                case[i] = (cle, valeur)
                return
        case.append((cle, valeur))
        self._n += 1

    def chercher(self, cle):
        for k, v in self._case(cle):
            if k == cle:
                return v
        return None

    def taille(self):
        return self._n
```
Avec 4 cases et 20 clés, chaque liste contient environ 5 éléments ($\alpha = 5$) : tout fonctionne, mais plus lentement
qu'avec une table plus grande.
:::
::::

::::exercice[Simuler le paradoxe des anniversaires]{niveau=3}
Écris `premiere_collision(m, graine)` qui tire des entiers au hasard entre 0 et m − 1 (avec `random.seed(graine)` puis
`random.randrange(m)`) jusqu'à obtenir une valeur **déjà tirée**, et renvoie le nombre de tirages effectués. Puis estime la
moyenne sur 1000 graines pour m = 365.

```python depart
import random

def premiere_collision(m, graine):
    ...
```

```python tests
assert premiere_collision(1, 0) == 2, "une seule case : collision au 2e tirage"
assert 2 <= premiere_collision(365, 1) <= 366, "au plus m + 1 tirages"
assert premiere_collision(365, 3) == premiere_collision(365, 3), "reproductible"
moyenne = sum(premiere_collision(365, g) for g in range(1000)) / 1000
assert 21 <= moyenne <= 27, "en moyenne environ 24-25 tirages"
```

:::corrige
```python solution
import random

def premiere_collision(m, graine):
    random.seed(graine)
    vus = set()
    tirages = 0
    while True:
        x = random.randrange(m)
        tirages += 1
        if x in vus:
            return tirages
        vus.add(x)
```
On trouve en moyenne environ 24,6 tirages pour 365 cases : de l'ordre de $\sqrt{\pi m / 2}$. Dans une table de hachage de $m$
cases, la première collision arrive donc après environ $\sqrt m$ insertions, bien avant que la table soit pleine.
:::
::::

::::exercice[Analyse du redimensionnement]{niveau=4 duree=25}
Une table de hachage démarre avec 8 cases et double son nombre de cases (en réinsérant tout) dès que le nombre d'éléments
dépasse le nombre de cases.

1. Après $n$ insertions de clés distinctes ($n \ge 9$), combien de redimensionnements ont eu lieu, et combien de
   réinsertions en tout ? Montre que ce total est inférieur à $2n$.
2. En déduire le coût amorti d'une insertion, en supposant que chaque insertion « ordinaire » coûte $O(1)$ en moyenne.
3. Pourquoi multiplier le nombre de cases par 2 (et non ajouter 8 cases à chaque fois) est-il essentiel ? Calcule le coût
   total de $n$ insertions avec la stratégie « + 8 cases ».
4. Que faudrait-il faire si l'on supprime beaucoup d'éléments ? Pourquoi faut-il éviter de diviser la table par 2 dès que
   $\alpha < 1/2$ ?

:::criteres
- Q1 : redimensionnements quand n dépasse 8, 16, 32… ; nombre $\lceil \log_2(n/8) \rceil$ ; réinsertions $8 + 16 + \dots + 2^k$ avec $2^k < n$, somme $< 2^{k+1} \le 2n$.
- Q2 : coût total $O(n) + O(2n) = O(n)$, donc $O(1)$ amorti par insertion.
- Q3 : avec + 8 cases, un redimensionnement toutes les 8 insertions, chacun réinsérant tous les éléments : $8 + 16 + 24 + \dots \approx n^2/16$, coût total $\Theta(n^2)$, soit $\Theta(n)$ amorti par insertion.
- Q4 : réduire la table quand α devient petit (pour économiser la mémoire), mais avec un seuil plus bas que le seuil d'agrandissement (par exemple diviser par 2 quand α < 1/4), sinon une alternance ajout/suppression autour du seuil provoquerait un redimensionnement à chaque opération (coût Θ(n) à chaque fois).
:::

:::corrige
1. On redimensionne quand le nombre d'éléments passe 8, puis 16, 32, … : à chaque fois toutes les clés sont réinsérées
   (8, puis 16, puis 32…). Si le dernier redimensionnement a eu lieu en passant $2^k$ éléments ($2^k < n$), le nombre de
   réinsertions est $8 + 16 + \dots + 2^k = 2^{k+1} - 8 < 2^{k+1} \le 2n$ (car $2^k < n$). Il y a eu $k - 2$
   redimensionnements, soit environ $\log_2(n/8)$.
2. Les $n$ insertions ordinaires coûtent $O(n)$ en moyenne, les réinsertions moins de $2n$ insertions supplémentaires : coût
   total $O(n)$, donc **$O(1)$ amorti** par insertion.
3. Avec « + 8 cases », il y a un redimensionnement toutes les 8 insertions, et le $j$-ième réinsère environ $8j$ éléments :
   au total $8(1 + 2 + \dots + n/8) \approx n^2/16$ réinsertions, $\Theta(n^2)$ : chaque insertion coûte en moyenne $\Theta(n)$.
   C'est la croissance **géométrique** (× 2) qui rend la somme des réinsertions proportionnelle à $n$.
4. Après de nombreuses suppressions, la table occupe beaucoup de mémoire inutile : on peut la **réduire** (diviser par 2) quand
   $\alpha$ devient petit. Mais il faut un seuil de réduction nettement plus bas que celui d'agrandissement (par exemple
   réduire quand $\alpha < 1/4$, agrandir quand $\alpha > 1$) : sinon, juste au niveau du seuil, une alternance
   ajout / suppression déclencherait un redimensionnement (coûteux) à chaque opération.
:::
::::
