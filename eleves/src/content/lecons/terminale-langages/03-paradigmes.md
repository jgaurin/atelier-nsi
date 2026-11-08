---
titre: Les paradigmes
resume: "Reconnaître les styles impératif, fonctionnel et objet, et choisir selon le problème."
duree: 30
objectifs:
  - "Distinguer les paradigmes impératif, fonctionnel et objet sur des exemples"
  - "Choisir un paradigme selon l'application"
---

Un **paradigme** est une façon de programmer. Python permet d'en utiliser plusieurs, même dans un seul programme.

## 1. Un même calcul, trois styles

La somme des carrés des nombres pairs d'un tableau.

```python exec
t = [3, 4, 7, 10]

# Impératif : des instructions qui modifient des variables
total = 0
for x in t:
    if x % 2 == 0:
        total = total + x * x
print(total)

# Fonctionnel : des fonctions, sans modifier de variable
print(sum(map(lambda x: x * x, filter(lambda x: x % 2 == 0, t))))

# Objet : un objet regroupe données et méthodes
class Serie:
    def __init__(self, valeurs):
        self.valeurs = valeurs
    def somme_carres_pairs(self):
        return sum(x * x for x in self.valeurs if x % 2 == 0)

print(Serie(t).somme_carres_pairs())
```

## 2. Comparaison

| Paradigme | Idée | Convient pour |
| --- | --- | --- |
| **Impératif** | des instructions qui modifient l'état | algorithmes simples, scripts |
| **Fonctionnel** | des fonctions pures, sans effet de bord | transformations de données |
| **Objet** | des objets avec attributs et méthodes | jeux, interfaces, grands logiciels |

Une fonction **pure** donne toujours le même résultat pour les mêmes entrées et ne modifie rien autour d'elle. Elle est donc plus facile à tester.

Dans le style fonctionnel, `map(f, t)` applique `f` à chaque élément, `filter(c, t)` garde les éléments qui vérifient `c`, et `lambda x: …` définit une petite fonction sans nom.

## L'essentiel

- Impératif : instructions et variables modifiées.
- Fonctionnel : fonctions pures et composition.
- Objet : objets qui regroupent données et méthodes.
- On choisit selon l'application, et on peut les mélanger.

## Exercices

::::exercice[Quel paradigme ?]{niveau=1 type=associer}
Associe chaque extrait au paradigme qu'il illustre.

| Extrait | Paradigme |
| --- | --- |
| `for x in t: s = s + x` | impératif |
| `list(map(f, t))` | fonctionnel |
| `joueur.attaquer(ennemi)` | objet |
::::

::::exercice[Pure ou pas ?]{niveau=1 type=reponses}
Réponds par oui ou par non : la fonction est-elle pure ?

1. Fonction `f` :

   ```python
   def f(x):
       return x * 2
   ```

   - oui

1. Fonction `g` :

   ```python
   def g(t):
       t.append(0)
       return len(t)
   ```

   - non

   > Elle modifie le tableau reçu.

1. Fonction `h` :

   ```python
   compteur = 0
   def h(x):
       global compteur
       compteur = compteur + 1
       return x
   ```

   - non

   > Elle modifie une variable extérieure.
::::

::::exercice[Impératif et fonctionnel]{niveau=2}
Écris deux versions de chaque fonction : `longueurs_imp(mots)` en style impératif (boucle et `append`) et `longueurs_fonc(mots)` en style
fonctionnel (une expression avec `map` ou une compréhension, sans modifier de variable), qui renvoient la liste des longueurs des mots de plus
de 3 lettres. Puis `compose(f, g)` qui renvoie la fonction x ↦ f(g(x)).

```python depart
def longueurs_imp(mots):
    ...

def longueurs_fonc(mots):
    ...

def compose(f, g):
    ...
```

```python tests
mots = ["le", "chat", "dort", "sur", "le", "canapé"]
assert longueurs_imp(mots) == [4, 4, 6], "impératif"
assert longueurs_fonc(mots) == [4, 4, 6], "fonctionnel"
assert longueurs_imp([]) == [] and longueurs_fonc([]) == [], "vide"
double_puis_plus1 = compose(lambda x: x + 1, lambda x: 2 * x)
assert double_puis_plus1(5) == 11, "composition"
assert compose(len, str)(12345) == 5, "composition de fonctions existantes"
```

:::corrige
```python solution
def longueurs_imp(mots):
    resultat = []
    for m in mots:
        if len(m) > 3:
            resultat.append(len(m))
    return resultat

def longueurs_fonc(mots):
    return list(map(len, filter(lambda m: len(m) > 3, mots)))

def compose(f, g):
    return lambda x: f(g(x))
```

`compose` renvoie une **fonction** : en programmation fonctionnelle, les fonctions sont des valeurs comme les autres, qu'on passe en paramètre et
qu'on renvoie.
:::
::::

::::exercice[Choisir un paradigme]{niveau=2}
Pour chaque projet, dis quel paradigme te semble le plus adapté et justifie : (a) un jeu vidéo avec des personnages, des ennemis et des objets ;
(b) un programme qui transforme un gros fichier de mesures (filtrer, convertir, agréger) ; (c) un petit script qui renomme les fichiers d'un
dossier. Puis explique pourquoi un programme fonctionnel est plus facile à tester.

:::criteres
- (a) objet : entités avec état et comportements.
- (b) fonctionnel : chaîne de transformations de données, sans état.
- (c) impératif : suite simple d'instructions.
- Test : une fonction pure donne toujours le même résultat pour les mêmes entrées, sans dépendre d'un état ni le modifier.
:::

:::corrige
(a) **Objet** : chaque personnage, ennemi ou objet a un **état** (position, points de vie) et des **comportements** (se déplacer, attaquer) ; les
classes les modélisent naturellement. (b) **Fonctionnel** : le traitement est une suite de **transformations** (filtrer, convertir, agréger)
qui se composent, sans état à gérer ; c'est aussi plus facile à paralléliser sur de gros volumes. (c) **Impératif** : quelques instructions
qui s'enchaînent (lister, renommer) ; inutile de sortir des classes. Une fonction **pure** renvoie toujours le même résultat pour les mêmes
entrées et ne modifie rien autour d'elle : un test suffit à vérifier son comportement, sans préparer d'état ni craindre qu'un appel précédent
change le résultat.
:::
::::

::::exercice[Un panier en trois styles]{niveau=3}
Un panier est un tableau de couples `(article, prix)`.

1. Style impératif : écris `total(panier)` avec une boucle.
2. Style fonctionnel : écris `avec_remise(panier, taux)`, qui renvoie un **nouveau** panier où chaque prix est multiplié par `1 - taux`, sans modifier `panier`.
3. Style objet : écris la classe `Panier`, avec un attribut `articles` (initialement vide) et les méthodes `ajouter(article, prix)` et `total()`.
4. À l'écrit : un collègue écrit une version de `avec_remise` qui modifie directement `panier`. Quel problème cela pose-t-il pour celui qui appelle la fonction ?

```python depart
def total(panier):
    ...

def avec_remise(panier, taux):
    ...

class Panier:
    ...
```

```python tests
p = [("stylo", 2.0), ("cahier", 4.0)]
assert total(p) == 6.0, "total"
assert total([]) == 0, "panier vide"
r = avec_remise(p, 0.5)
assert r == [("stylo", 1.0), ("cahier", 2.0)], "remise"
assert p == [("stylo", 2.0), ("cahier", 4.0)], "panier d'origine intact"
q = Panier()
assert q.articles == [] and q.total() == 0, "objet vide"
q.ajouter("stylo", 2.0)
q.ajouter("sac", 8.0)
assert q.total() == 10.0, "total de l'objet"
```

:::corrige
```python solution
def total(panier):
    s = 0
    for article in panier:
        s = s + article[1]
    return s

def avec_remise(panier, taux):
    return [(a[0], a[1] * (1 - taux)) for a in panier]

class Panier:
    def __init__(self):
        self.articles = []

    def ajouter(self, article, prix):
        self.articles.append((article, prix))

    def total(self):
        return total(self.articles)
```

**Question 4.** C'est un **effet de bord** : le panier de l'appelant change sans qu'il le demande. Par exemple, il perd les prix d'origine.
:::
::::
