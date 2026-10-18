---
titre: "Écrit 1 : résoudre un problème"
resume: La méthode pour la première épreuve d'admissibilité (4 heures, coefficient 3) — ce qui est évalué, la gestion du temps, la rédaction d'un code, d'une preuve et d'un calcul de coût sur copie, et un problème type corrigé pas à pas.
duree: 60
objectifs:
  - Connaître le format et les attendus de la première épreuve d'admissibilité
  - Organiser ses 4 heures et sa copie
  - Rédiger sur papier un code lisible, une preuve (invariant, variant, récurrence) et un calcul de coût justifié
  - S'entraîner sur un problème complet de type concours
prerequis: [algo/preuve, algo/complexite, algo/recursivite, algo/programmation-dynamique, structures/arbres-binaires]
programme: [asd-preuve, asd-cout, asd-iter-rec, asd-progdyn, asd-arbres]
cartes:
  - q: Format de la première épreuve d'admissibilité ?
    r: "4 heures, coefficient 3 : analyse et résolution d'un ou plusieurs problèmes ; elle évalue connaissances, raisonnement, argumentation et programmation. Une note ≤ 5 est éliminatoire."
  - q: Que contient typiquement un sujet d'écrit 1 (d'après le sujet zéro) ?
    r: "Trace d'exécution, invariant et variant de boucle, coût au pire et au mieux, version récursive, relation de récurrence, mémoïsation, puis un problème sur une structure (codage d'arbres binaires)."
  - q: Comment rédiger un calcul de coût ?
    r: "Préciser ce qu'on compte (comparaisons, opérations), en fonction de quel paramètre, dans quel cas (pire, meilleur), poser la somme ou la récurrence, la calculer, conclure par un ordre de grandeur ($O(n^2)$, $\\Theta(n \\log n)$)."
  - q: Comment rédiger une preuve de correction de boucle ?
    r: "Énoncer l'invariant précisément ; montrer qu'il est vrai avant la boucle ; qu'il est conservé par un tour ; en déduire le résultat à la sortie ; prouver la terminaison par un variant (entier positif qui décroît strictement)."
  - q: Que faire d'une question qu'on ne sait pas traiter ?
    r: "Admettre son résultat (« en admettant la question 3 ») et continuer : les questions suivantes restent accessibles et rapportent des points."
---

La **première épreuve d'admissibilité** dure 4 heures (coefficient 3, note éliminatoire ≤ 5). Le texte officiel : « l'épreuve consiste en l'analyse et la
résolution d'un ou plusieurs problèmes. Elle évalue les connaissances disciplinaires ainsi que les capacités de raisonnement, d'argumentation et de programmation
du candidat. » C'est une épreuve d'**informatique** de niveau licence, centrée sur l'algorithmique et la programmation, où la **justification** compte autant
que le résultat.

## 1. Ce qui est attendu

Le sujet zéro donne le ton : une première partie enchaîne **trace d'exécution**, **invariant** et **variant**, **coût** au pire et au mieux, version **récursive**,
**relation de récurrence**, **mémoïsation** ; une seconde partie étudie un problème sur une **structure** (le codage d'arbres binaires). Les questions sont
**progressives** : chacune s'appuie sur les précédentes.

:::retenir[Les trois savoir-faire évalués]
- **Programmer** : écrire sur papier un code Python correct, lisible, qui respecte la spécification (signature, cas limites).
- **Prouver** : correction (invariant), terminaison (variant), propriétés par récurrence.
- **Analyser** : coût en temps (et parfois en mémoire), au pire et au meilleur des cas, avec un calcul justifié.
:::

## 2. Organiser ses 4 heures

| Temps | Activité |
|---|---|
| 15 min | **lire tout le sujet**, repérer les parties indépendantes, les notations, les questions faciles |
| 3 h 15 | traiter les questions **dans l'ordre** de chaque partie, en admettant au besoin un résultat pour avancer |
| 20 min | **relire** : numéros des questions, code (indentation, cas limites), conclusions encadrées |
| 10 min | marge de sécurité |

:::methode[Tenir sa copie]
Numéroter clairement chaque question ; **une idée par paragraphe** ; encadrer ou souligner les résultats ; laisser de la place si l'on compte revenir. Si une
question bloque : écrire ce qu'on a compris (une piste, un cas particulier), puis **admettre le résultat** et continuer (« en admettant le résultat de la
question 4… »). Le correcteur lit des centaines de copies : la clarté est un atout direct.
:::

## 3. Rédiger : code, preuve, coût

**Le code sur papier.** Indentation visible (traits verticaux si besoin), noms de variables parlants, **commentaires** brefs aux endroits clés, cas limites
traités (liste vide, $n = 0$), et **pas** de fonctions de bibliothèque qui feraient tout le travail demandé (si l'on demande d'écrire un tri, `sorted` est
hors sujet). Rappeler la spécification si elle n'est pas donnée.

**La preuve d'une boucle.**

> *Invariant* : « au début de l'itération d'indice $i$, `m` est le maximum de `t[0..i-1]` ». *Initialisation* : avant la boucle, $i = 1$ et `m = t[0]`.
> *Conservation* : si l'invariant est vrai au début du tour $i$, après `m = max(m, t[i])`, `m` est le maximum de `t[0..i]` : il est vrai au début du tour
> $i + 1$. *Conclusion* : à la sortie, $i = n$, donc `m` est le maximum de `t[0..n-1]`. *Terminaison* : boucle `for` bornée (ou variant $n - i$).

**Le calcul de coût.** Dire **ce qu'on compte**, **en fonction de quoi**, **dans quel cas**, puis calculer :

> On compte les comparaisons entre éléments, en fonction de $n = \text{len}(t)$. Dans le pire cas (tableau trié à l'envers), la boucle interne fait $i$
> comparaisons au tour $i$, soit $\sum_{i=1}^{n-1} i = \frac{n(n-1)}{2}$ : le coût est **quadratique**, $\Theta(n^2)$. Dans le meilleur cas (tableau trié), une
> comparaison par tour : $n - 1$, linéaire.

**Une récurrence de coût.** Pour un algorithme récursif, écrire $C(n)$ en fonction de $C$ sur des tailles plus petites, préciser le cas de base, puis
**résoudre** (déroulement, ou résultat de cours justifié) : $C(n) = 2C(n/2) + n$ donne $C(n) = \Theta(n \log n)$ ; $C(n) = C(n-1) + C(n-2) + 1$ donne une
croissance exponentielle (comme Fibonacci).

:::attention[Les pertes de points classiques]
Un code sans les cas limites ; un invariant vague (« la variable contient le bon résultat ») ; un coût sans dire ce qu'on compte ; une récurrence sans cas de
base ; confondre $O$ (majorant) et « exactement » ; ne pas répondre **précisément** à la question posée (on demande le pire cas, on donne le cas moyen).
:::

:::prof
Le jury lit aussi, à travers la copie, un futur professeur : rigueur des définitions, clarté des explications, vocabulaire juste. Rédiger comme on voudrait que
ses élèves rédigent est la bonne boussole.
:::

## Exemple guidé

**Énoncé (extrait type).** On appelle **inversion** d'un tableau `t` un couple d'indices $(i, j)$ avec $i < j$ et $t[i] > t[j]$.

*Q1. Écrire une fonction `inversions(t)` qui renvoie le nombre d'inversions. Q2. Donner son coût. Q3. Proposer un algorithme en $O(n \log n)$.*

**Q1.** Deux boucles imbriquées sur les couples :

```python exec
def inversions(t):
    n = len(t)
    nb = 0
    for i in range(n):
        for j in range(i + 1, n):
            if t[i] > t[j]:
                nb += 1
    return nb

print(inversions([3, 1, 2]), inversions([1, 2, 3]), inversions([3, 2, 1]))
```

**Q2.** *On compte les comparaisons `t[i] > t[j]`. Pour chaque $i$, la boucle interne en fait $n - 1 - i$, d'où $\sum_{i=0}^{n-1} (n - 1 - i) = \frac{n(n-1)}{2}$
comparaisons, quel que soit le tableau : coût $\Theta(n^2)$.*

**Q3.** *Diviser pour régner* : on adapte le **tri fusion**. Les inversions de `t` sont celles de la moitié gauche, celles de la moitié droite, et celles « à
cheval » ; pendant la fusion de deux moitiés triées, quand on prend un élément de **droite**, il est inférieur à **tous** les éléments restants de gauche : on
ajoute leur nombre.

```python exec
def tri_inversions(t):
    """Renvoie (t trié, nombre d'inversions de t)."""
    if len(t) <= 1:
        return list(t), 0
    milieu = len(t) // 2
    g, ig = tri_inversions(t[:milieu])
    d, id_ = tri_inversions(t[milieu:])
    fusion, i, j, croisees = [], 0, 0, 0
    while i < len(g) and j < len(d):
        if g[i] <= d[j]:
            fusion.append(g[i]); i += 1
        else:
            fusion.append(d[j]); j += 1
            croisees += len(g) - i          # d[j] est plus petit que tous les g restants
    fusion += g[i:] + d[j:]
    return fusion, ig + id_ + croisees

def inversions(t):                         # la version quadratique, pour comparer
    return sum(1 for i in range(len(t)) for j in range(i + 1, len(t)) if t[i] > t[j])

import random
rng = random.Random(0)
t = [rng.randint(0, 100) for _ in range(300)]
print(tri_inversions(t)[1] == inversions(t))
```

*Coût : $C(n) = 2C(n/2) + \Theta(n)$ (la fusion est linéaire), donc $C(n) = \Theta(n \log n)$.* La rédaction attendue justifie aussi le `<=` (des éléments
égaux ne forment pas une inversion) et le calcul de `len(g) - i`.

## L'essentiel

- Écrit 1 : 4 h, coefficient 3, ≤ 5 éliminatoire ; problèmes d'algorithmique et de programmation ; questions progressives.
- 15 min de lecture, traiter dans l'ordre, admettre pour avancer, 20 min de relecture.
- Code : lisible, indenté, cas limites, pas de bibliothèque qui fait le travail demandé.
- Preuve : invariant précis (initialisation, conservation, conclusion) + variant ; récurrence avec cas de base.
- Coût : ce qu'on compte, en fonction de quoi, quel cas, calcul (somme ou récurrence), ordre de grandeur.

## Exercices

::::exercice[Lire une consigne de coût]{niveau=1}
Une question demande « le coût dans le pire des cas de la fonction, en nombre de comparaisons, en fonction de $n$ ». Laquelle de ces réponses est la mieux rédigée ?

- [ ] « $O(n^2)$ car il y a deux boucles. »
- [x] « Dans le pire cas (tableau trié à l'envers), le tour $i$ fait $i$ comparaisons, soit $\sum_{i=1}^{n-1} i = \frac{n(n-1)}{2}$ : coût quadratique. »
- [ ] « C'est rapide pour de petits tableaux. »
- [ ] « Le coût est $n^2$ en moyenne. »

:::corrige
La bonne réponse dit **quel cas**, **ce qu'on compte**, fait le **calcul** et conclut. « Deux boucles donc $n^2$ » est un raisonnement fragile (les bornes des boucles
comptent), et la question porte sur le pire cas, pas sur la moyenne.
:::
::::

::::exercice[Admettre un résultat]{niveau=1}
Vous bloquez sur la question 3 d'une partie qui en compte 8. Que faites-vous ?

- [ ] Je reste sur la question 3 jusqu'à la trouver, car les suivantes en dépendent
- [x] J'écris ce que j'ai trouvé, puis je passe à la suite en admettant le résultat de la question 3
- [ ] Je saute toute la partie
- [ ] Je recopie l'énoncé

:::corrige
Les questions suivantes sont souvent faisables en admettant les précédentes : on le signale (« en admettant la question 3 ») et on continue. On reviendra à la
question 3 s'il reste du temps.
:::
::::

::::exercice[Nombre d'arbres binaires]{niveau=2}
On note $C_n$ le nombre d'arbres binaires (non étiquetés) à $n$ nœuds : $C_0 = 1$ et $C_n = \sum_{k=0}^{n-1} C_k \, C_{n-1-k}$ (on choisit $k$ nœuds dans le
sous-arbre gauche). Écris `nb_arbres(n)` avec **mémoïsation** (ou programmation dynamique), de façon que `nb_arbres(100)` soit immédiat.

```python depart
def nb_arbres(n):
    ...
```

```python tests
assert [nb_arbres(n) for n in range(7)] == [1, 1, 2, 5, 14, 42, 132], "premiers termes"
assert nb_arbres(30) == 3814986502092304, "n = 30"
assert nb_arbres(100) % 10**9 == 745909320, "n = 100 rapidement"
```

:::corrige
```python solution
def nb_arbres(n):
    c = [1] + [0] * n
    for m in range(1, n + 1):
        c[m] = sum(c[k] * c[m - 1 - k] for k in range(m))
    return c[n]
```
Ce sont les **nombres de Catalan**. La version récursive directe recalcule les mêmes valeurs un nombre exponentiel de fois ; en remplissant le tableau des $C_m$
dans l'ordre croissant, chaque valeur est calculée une fois : $O(n^2)$ opérations. Sur copie, on justifie : « la valeur $C_m$ ne dépend que de valeurs d'indices
plus petits, déjà calculées ».
:::
::::

::::exercice[Coder un arbre binaire]{niveau=3}
On code un arbre binaire (`None` ou triplet `(gauche, valeur, droite)`) par une chaîne : l'arbre vide donne `"."`, un nœud donne `"("` + code de gauche + `str(valeur)`
+ code de droite + `")"`. Écris `coder(a)` et `decoder(s)` (les valeurs sont des chiffres de 0 à 9), avec `decoder(coder(a)) == a` pour tout arbre.

```python depart
def coder(a):
    ...

def decoder(s):
    ...
```

```python tests
a = ((None, 1, None), 2, ((None, 3, None), 4, None))
assert coder(None) == "." and coder((None, 5, None)) == "(.5.)", "cas simples"
assert coder(a) == "((.1.)2((.3.)4.))", "arbre de 4 nœuds"
assert decoder(coder(a)) == a and decoder(".") is None, "décodage"
import random
def aleatoire(n, rng):
    if n == 0:
        return None
    k = rng.randrange(n)
    return (aleatoire(k, rng), rng.randrange(10), aleatoire(n - 1 - k, rng))
rng = random.Random(5)
assert all(decoder(coder(t)) == t for t in (aleatoire(rng.randrange(15), rng) for _ in range(200))), "aller-retour sur 200 arbres"
```

:::corrige
```python solution
def coder(a):
    if a is None:
        return "."
    g, v, d = a
    return "(" + coder(g) + str(v) + coder(d) + ")"

def decoder(s):
    def lire(i):
        """Lit un arbre à partir de la position i ; renvoie (arbre, position suivante)."""
        if s[i] == ".":
            return None, i + 1
        g, i = lire(i + 1)              # saute "("
        v = int(s[i])
        d, i = lire(i + 1)
        return (g, v, d), i + 1         # saute ")"
    arbre, _ = lire(0)
    return arbre
```
Le décodage est une **analyse récursive** : la fonction auxiliaire lit un arbre à partir d'une position et renvoie aussi la position où elle s'arrête. Preuve de
correction par **induction structurelle** : `lire` appliqué au début du code d'un arbre $A$ renvoie $A$ et la position juste après son code. Coût linéaire en la
longueur du code, qui fait $4n + 1$ caractères pour $n$ nœuds (3 par nœud, plus un « . » pour chacun des $n + 1$ sous-arbres vides).
:::
::::

::::exercice[Un problème complet en temps limité]{niveau=4 duree=45}
**Problème : la plus longue sous-suite croissante.** Une sous-suite de `t` s'obtient en supprimant des éléments (on garde l'ordre) ; elle est croissante si ses
éléments le sont strictement. Exemple : dans `[3, 10, 2, 1, 20, 4, 6, 7]`, `[3, 4, 6, 7]` est une plus longue sous-suite croissante (longueur 4).

1. Combien de sous-suites a un tableau de $n$ éléments ? Qu'en concluez-vous pour une recherche exhaustive ?
2. On note $L[i]$ la longueur de la plus longue sous-suite croissante **qui se termine** par `t[i]`. Exprimez $L[i]$ en fonction des $L[j]$, $j < i$, et justifiez.
3. Écrivez la fonction `plsc(t)` qui renvoie la longueur cherchée, et donnez son coût.
4. Modifiez-la pour renvoyer aussi une sous-suite de longueur maximale.
5. Rédigez la preuve de correction de la relation de la question 2.

:::criteres
- Q1 : $2^n$ sous-suites (chaque élément gardé ou non) → recherche exhaustive exponentielle, impraticable.
- Q2 : $L[i] = 1 + \max\{L[j] : j < i,\ t[j] < t[i]\}$ (et $L[i] = 1$ si l'ensemble est vide), justifiée par la décomposition d'une sous-suite optimale (avant-dernier élément).
- Q3 : programmation dynamique, réponse $\max_i L[i]$ (0 pour le tableau vide), coût $\Theta(n^2)$ justifié.
- Q4 : tableau des prédécesseurs et reconstruction en remontant.
- Q5 : preuve par récurrence forte sur $i$, double inégalité (toute sous-suite se termine par un prolongement ; la valeur est atteinte).
:::

:::corrige
1. Chaque élément est gardé ou non : $2^n$ sous-suites. Les examiner toutes coûte un temps exponentiel : pour $n = 50$, $2^{50} \approx 10^{15}$ — impossible.
2. Une sous-suite croissante qui se termine par `t[i]` est soit réduite à `t[i]` (longueur 1), soit le prolongement par `t[i]` d'une sous-suite croissante se terminant
   par un `t[j]` avec $j < i$ et $t[j] < t[i]$. D'où $L[i] = 1 + \max\{L[j] \mid j < i,\ t[j] < t[i]\}$, avec la convention $\max \varnothing = 0$.
3. ```python
   def plsc(t):
       n = len(t)
       L = [1] * n
       for i in range(n):
           for j in range(i):
               if t[j] < t[i] and L[j] + 1 > L[i]:
                   L[i] = L[j] + 1
       return max(L, default=0)
   ```
   Les $L[i]$ sont calculés par indices croissants, donc chaque $L[j]$ utilisé est déjà connu. Coût : $\sum_{i} i = \frac{n(n-1)}{2}$ comparaisons, $\Theta(n^2)$.
   (Un algorithme plus fin, avec une recherche dichotomique, atteint $O(n \log n)$.)
4. On mémorise, pour chaque $i$, l'indice `pred[i]` du $j$ qui a donné le maximum (ou `None`) ; on part de l'indice où $L$ est maximal et l'on remonte les
   prédécesseurs, puis on renverse la liste obtenue.
5. *Par récurrence forte sur $i$.* Supposons la relation vraie pour tous les indices $< i$ ($L[j]$ est bien la longueur optimale pour $j < i$). **Majoration** : soit
   une sous-suite croissante de longueur $\ell$ se terminant par `t[i]`. Si $\ell = 1$, $\ell \le$ la formule. Sinon, son avant-dernier élément est un `t[j]` avec $j < i$ et
   $t[j] < t[i]$, et ce qui précède `t[i]` est une sous-suite croissante se terminant par `t[j]`, de longueur $\ell - 1 \le L[j]$ : donc $\ell \le 1 + L[j] \le$ la formule.
   **Atteinte** : si le maximum est atteint en $j$, prolonger par `t[i]` une sous-suite optimale se terminant par `t[j]` (qui existe par hypothèse) donne une sous-suite
   croissante de longueur $1 + L[j]$. Les deux inégalités donnent l'égalité.
:::
::::
