---
titre: Nombres à virgule flottante
resume: "Le cours de première NSI sur les nombres réels en machine : écriture binaire des nombres à virgule, nombres exactement représentables (0,25) ou non (0,1, 1/3), principe de la virgule flottante, et conséquence pratique : ne jamais tester l'égalité de deux flottants."
duree: 40
objectifs:
  - "Convertir une partie décimale en binaire par multiplications successives par 2"
  - "Distinguer les nombres représentables exactement en binaire (0,25) de ceux qui ne le sont pas (0,1 ; 1/3)"
  - "Décrire le principe d'un nombre flottant (signe, mantisse, exposant) sans connaître la norme"
  - "Comparer deux flottants avec une tolérance plutôt qu'avec =="
prerequis: [nsi-premiere/entiers-relatifs]
programme: [nsi1-base]
cartes:
  - q: "Pourquoi `0.1 + 0.2 == 0.3` vaut-il `False` en Python ?"
    r: "Parce que 0,1 et 0,2 n'ont pas d'écriture binaire finie : ils sont stockés de façon **approchée**, et la somme approchée diffère légèrement de 0,3 approché."
  - q: "Comment comparer deux flottants ?"
    r: "Avec une tolérance : `abs(a - b) < 1e-9` (ou `math.isclose(a, b)`), jamais avec `==`."
  - q: "Que vaut 0,101₂ ?"
    r: "1/2 + 0/4 + 1/8 = **0,625**."
  - q: "Comment convertir 0,375 en binaire ?"
    r: "Multiplications par 2 : 0,375 × 2 = **0**,75 ; 0,75 × 2 = **1**,5 ; 0,5 × 2 = **1**,0. On lit les parties entières de haut en bas : **0,011**₂."
  - q: "Quels nombres décimaux ont une écriture binaire finie ?"
    r: "Ceux qui s'écrivent comme une fraction dont le dénominateur est une **puissance de 2** (0,5 ; 0,25 ; 0,375). 0,1 = 1/10 n'en fait pas partie."
  - q: "Principe d'un nombre flottant ?"
    r: "Comme l'écriture scientifique, mais en base 2 : un **signe**, une **mantisse** (les chiffres significatifs, en nombre limité) et un **exposant**. Sur 64 bits, environ 15 à 17 chiffres significatifs."
---

En mathématiques, on manipule des nombres réels avec une précision infinie. Un ordinateur, lui, ne dispose que d'un **nombre fini de bits**. Il doit
donc **approcher** la plupart des nombres réels. Ce chapitre explique pourquoi `0.1 + 0.2` ne donne pas exactement `0.3` en Python, et la règle
pratique qui en découle. C'est une notion qui étonne beaucoup les élèves… et les adultes.

## Ce que dit le programme

Contenu : *représentation approximative des nombres réels : notion de nombre flottant*. Capacité attendue : **calculer sur quelques exemples la
représentation de nombres réels** : 0.1, 0.25 ou 1/3. Commentaires : `0.2 + 0.1` n'est pas égal à `0.3` ; il faut **éviter de tester l'égalité** de
deux flottants ; **aucune connaissance précise de la norme IEEE-754 n'est exigible**.

## 1. L'écriture binaire des nombres à virgule

En base 10, 0,375 = 3/10 + 7/100 + 5/1000. En base 2, les chiffres après la virgule valent **1/2, 1/4, 1/8, 1/16…**

| Position | 1ᵉʳ | 2ᵉ | 3ᵉ | 4ᵉ |
|---|---|---|---|---|
| Poids | 1/2 = 0,5 | 1/4 = 0,25 | 1/8 = 0,125 | 1/16 = 0,0625 |

Ainsi 0,101₂ = 0,5 + 0,125 = **0,625**, et 10,11₂ = 2 + 0,5 + 0,25 = **2,75**.

## 2. Convertir une partie décimale en binaire

**Méthode des multiplications successives par 2** : on multiplie la partie décimale par 2 ; la **partie entière** obtenue (0 ou 1) est le bit suivant ;
on recommence avec la nouvelle partie décimale, jusqu'à obtenir 0.

| Calcul | Bit | Reste |
|---|---|---|
| 0,375 × 2 = 0,75 | **0** | 0,75 |
| 0,75 × 2 = 1,5 | **1** | 0,5 |
| 0,5 × 2 = 1,0 | **1** | 0 → fin |

On lit les bits **de haut en bas** : 0,375 = **0,011**₂. De même 0,25 = **0,01**₂ : ces nombres ont une écriture binaire **finie**.

## 3. Des nombres qu'on ne peut pas écrire exactement

Essayons 0,1 :

| Calcul | Bit |
|---|---|
| 0,1 × 2 = 0,2 | 0 |
| 0,2 × 2 = 0,4 | 0 |
| 0,4 × 2 = 0,8 | 0 |
| 0,8 × 2 = 1,6 | 1 |
| 0,6 × 2 = 1,2 | 1 |
| 0,2 × 2 = 0,4 | 0 ← on retombe sur 0,2 : le motif se répète |

0,1 = 0,0 0011 0011 0011…₂ : l'écriture binaire est **infinie** (périodique), comme 1/3 = 0,333… en base 10. Avec un nombre fini de bits, l'ordinateur
la **tronque** : il stocke une valeur très proche de 0,1, mais pas 0,1.

:::retenir[Quels nombres sont exacts ?]
Un nombre a une écriture binaire finie **si et seulement si** c'est une fraction dont le dénominateur est une **puissance de 2** (1/2, 3/4, 5/8…).
0,1 = 1/10, 0,2 et 1/3 ne sont **pas** représentables exactement.
:::

## 4. Le principe de la virgule flottante

Pour représenter aussi bien de très grands que de très petits nombres, on utilise l'équivalent binaire de l'**écriture scientifique** (6,02 × 10²³) :
un nombre flottant est formé d'un **signe**, d'une **mantisse** (les chiffres significatifs) et d'un **exposant** (la position de la virgule, qui
« flotte »). Sur **64 bits** (le type `float` de Python), la mantisse permet environ **15 à 17 chiffres significatifs**. Le détail de la norme
(IEEE 754) n'est pas au programme.

## 5. Les conséquences en programmation

```python exec
print(0.1 + 0.2)
print(0.1 + 0.2 == 0.3)
print(0.25 + 0.5 == 0.75)      # nombres exacts en binaire : pas de problème
print(abs((0.1 + 0.2) - 0.3) < 1e-9)
```

:::attention[Règle d'or]
**Ne jamais tester l'égalité de deux flottants avec `==`.** On teste si leur différence est très petite : `abs(a - b) < 1e-9`, ou
`math.isclose(a, b)`. Pour l'argent, on calcule souvent en **centimes entiers**.
:::

Les erreurs peuvent aussi **s'accumuler** : ajouter 0,1 dix fois ne donne pas exactement 1.

```python exec
total = 0
for i in range(10):
    total = total + 0.1
print(total, total == 1)
```

## Les erreurs classiques des élèves

:::attention[Ce que tu verras en classe]
- **Croire à un bug de Python** quand `0.1 + 0.2` affiche `0.30000000000000004`.
- **Lire les bits dans le mauvais sens** lors des multiplications (on les lit de haut en bas, contrairement aux divisions successives).
- **Continuer les multiplications sans fin** sur 0,1 au lieu de repérer la période.
- **Utiliser `==` pour une condition d'arrêt** de boucle avec des flottants (`while x != 1:` qui ne s'arrête jamais).
:::

## En classe

:::methode[Activités qui marchent]
1. **Le mystère** : faire calculer `0.1 + 0.2` aux élèves, recueillir leurs hypothèses avant d'expliquer.
2. **Analogie décimale** : 1/3 ne s'écrit pas exactement en base 10 ; 1/10 ne s'écrit pas exactement en base 2.
3. **Conversions** à la main de 0,25, 0,375, 0,1 (repérer la période).
4. **La boucle qui ne s'arrête pas** : `x = 0` puis `while x != 1: x = x + 0.1`, à arrêter à la main ; corriger avec une tolérance ou une boucle bornée.
:::

## L'essentiel

- Après la virgule, les bits valent 1/2, 1/4, 1/8… ; conversion par **multiplications successives par 2** (bits lus de haut en bas).
- Seules les fractions de dénominateur **puissance de 2** s'écrivent exactement : 0,25 oui, **0,1 et 1/3 non**.
- Un **flottant** = signe + mantisse + exposant ; précision limitée (environ 15 à 17 chiffres sur 64 bits).
- Les calculs sont **approchés** : `0.1 + 0.2 != 0.3`. **Ne jamais comparer deux flottants avec `==`** : utiliser une tolérance.

## Exercices

::::exercice[Grand QCM : nombres flottants]{niveau=1 type=quiz}
Onze questions sur la représentation des nombres réels.

1. Que vaut 0,1₂ (en binaire) ?

   - [ ] 0,1
   - [x] 0,5
   - [ ] 0,25
   - [ ] 1

   > Le premier chiffre après la virgule vaut 1/2.

1. Que vaut 0,11₂ ?

   - [ ] 0,11
   - [ ] 0,5
   - [x] 0,75
   - [ ] 3

   > 1/2 + 1/4 = 0,75.

1. Quelle est l'écriture binaire de 0,25 ?

   - [x] 0,01
   - [ ] 0,1
   - [ ] 0,11
   - [ ] 0,001

   > 0,25 = 1/4 : le deuxième bit après la virgule.

1. Quelle est l'écriture binaire de 0,625 ?

   - [ ] 0,011
   - [x] 0,101
   - [ ] 0,110
   - [ ] 0,111

   > 0,5 + 0,125 = 0,625.

1. Lequel de ces nombres a une écriture binaire finie ?

   - [ ] 0,1
   - [ ] 1/3
   - [x] 0,75
   - [ ] 0,2

   > 0,75 = 3/4 : dénominateur puissance de 2.

1. Pourquoi 0,1 ne peut-il pas être stocké exactement ?

   - [ ] parce qu'il est trop petit
   - [x] parce que son écriture en base 2 est infinie (périodique)
   - [ ] parce que Python arrondit tout à l'entier
   - [ ] parce que c'est un nombre négatif

   > 0,1 = 0,000110011…₂ : il faut tronquer.

1. Que renvoie `0.1 + 0.2 == 0.3` en Python ?

   - [ ] `True`
   - [x] `False`
   - [ ] une erreur
   - [ ] `0.3`

   > La somme vaut 0.30000000000000004.

1. Comment tester correctement si un flottant `x` vaut 0,3 ?

   - [ ] `x == 0.3`
   - [x] `abs(x - 0.3) < 1e-9`
   - [ ] `x = 0.3`
   - [ ] `int(x) == 0.3`

   > On compare avec une tolérance.

1. Que vaut `0.5 + 0.25 == 0.75` ?

   - [x] `True`
   - [ ] `False`
   - [ ] une erreur
   - [ ] cela dépend de l'ordinateur

   > Ces nombres sont exacts en binaire : le calcul l'est aussi.

1. Qu'est-ce qu'un nombre flottant ?

   - [ ] un nombre entier très grand
   - [x] une représentation approchée d'un réel avec un signe, une mantisse et un exposant
   - [ ] un nombre qui change de valeur tout seul
   - [ ] un nombre écrit en hexadécimal

   > C'est l'écriture scientifique en base 2, avec une précision limitée.

1. Un élève écrit `x = 0` puis `while x != 1: x = x + 0.1`. Que se passe-t-il ?

   - [ ] la boucle s'arrête après 10 tours
   - [x] la boucle ne s'arrête jamais, car x ne vaut jamais exactement 1
   - [ ] une erreur
   - [ ] la boucle ne s'exécute pas

   > Les erreurs d'arrondi s'accumulent : x passe à côté de 1. Utiliser une boucle bornée ou une tolérance.
::::

::::exercice[Partie décimale en binaire]{niveau=1}
Écris `bits_apres_virgule(x, n)` qui renvoie les `n` premiers bits (un texte) de l'écriture binaire de la partie décimale du nombre `x` (avec
0 ≤ x < 1), par multiplications successives par 2.

```python depart
def bits_apres_virgule(x, n):
    ...
```

```python tests
assert bits_apres_virgule(0.375, 3) == "011", "0,375 = 0,011"
assert bits_apres_virgule(0.25, 4) == "0100", "0,25 = 0,01 (complété par des 0)"
assert bits_apres_virgule(0.1, 8) == "00011001", "0,1 : début de la période"
```

:::corrige
```python solution
def bits_apres_virgule(x, n):
    bits = ""
    for i in range(n):
        x = x * 2
        if x >= 1:
            bits = bits + "1"
            x = x - 1
        else:
            bits = bits + "0"
    return bits
```

Pour 0,1, on voit apparaître le motif 0011 qui se répète : l'écriture binaire ne se termine jamais.
:::
::::

::::exercice[Égalité presque]{niveau=1}
Écris `presque_egaux(a, b)` qui renvoie `True` si les flottants `a` et `b` diffèrent de moins de 10⁻⁹.

```python depart
def presque_egaux(a, b):
    ...
```

```python tests
assert presque_egaux(0.1 + 0.2, 0.3) is True, "0.1 + 0.2 et 0.3"
assert presque_egaux(1.0, 1.1) is False, "nombres différents"
assert presque_egaux(2.5, 2.5) is True, "nombres égaux"
```

:::corrige
```python solution
def presque_egaux(a, b):
    return abs(a - b) < 1e-9
```
:::
::::

::::exercice[Répondre à « Python s'est trompé »]{niveau=2}
Un élève affiche `0.1 + 0.2` et obtient `0.30000000000000004`. Il déclare : « Python ne sait pas compter ! ». Rédige ta réponse en quelques phrases,
avec une analogie en base 10.

:::criteres
- L'analogie : 1/3 ne s'écrit pas exactement en base 10 (0,333…).
- L'explication : 0,1 n'a pas d'écriture binaire finie, l'ordinateur stocke une valeur approchée avec un nombre fini de bits.
- La conséquence pratique est donnée : comparer avec une tolérance.
- Le ton reconnaît que la surprise est légitime.
:::

:::corrige
« C'est surprenant, mais Python n'a pas faux : il calcule avec des valeurs **approchées**. Pense à 1/3 : en base 10, on ne peut pas l'écrire
exactement, on écrit 0,333… et on doit s'arrêter quelque part. L'ordinateur calcule en base 2, et en base 2, c'est **0,1** qui ne tombe pas juste :
son écriture binaire est infinie. Comme la mémoire est limitée, il stocke une valeur très proche de 0,1, et pareil pour 0,2 ; la somme est donc
très proche de 0,3, mais pas exactement égale. C'est pour ça qu'on ne compare jamais deux flottants avec `==`, mais avec une petite tolérance :
`abs(x - 0.3) < 1e-9`. »
:::
::::
