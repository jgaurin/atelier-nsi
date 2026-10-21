---
titre: "Boucles non bornées (while)"
resume: "Répéter tant qu'une condition est vraie avec while : quand l'utiliser plutôt que for, comment s'assurer que la boucle s'arrête, et les erreurs classiques des élèves (boucle infinie, condition inversée)."
duree: 25
objectifs:
  - "Écrire une boucle while et prévoir le nombre de tours"
  - "Choisir entre for (nombre de tours connu) et while (condition d'arrêt)"
  - "S'assurer qu'une boucle while se termine (la condition finit par devenir fausse)"
  - "Repérer les erreurs classiques (boucle infinie, condition inversée, variable non mise à jour)"
prerequis: [snt-python/boucles-bornees]
programme: [snt-programmation]
cartes:
  - q: "Que fait `while condition:` ?"
    r: "Il répète le bloc indenté **tant que** la condition est vraie ; la condition est testée **avant** chaque tour."
  - q: "Quand utiliser `while` plutôt que `for` ?"
    r: "Quand on **ne sait pas à l'avance** combien de tours il faudra : attendre une bonne réponse, atteindre un seuil, simuler jusqu'à un événement."
  - q: "Qu'est-ce qu'une boucle infinie ?"
    r: "Une boucle dont la condition ne devient jamais fausse, souvent parce que la variable testée n'est pas modifiée dans la boucle."
  - q: "Combien de tours fait `while x < 0:` si `x` vaut 5 au départ ?"
    r: "**Zéro** : la condition est fausse dès le départ, le bloc n'est jamais exécuté."
  - q: "Comment arrêter une boucle infinie lancée par erreur ?"
    r: "Interrompre le programme (bouton stop de l'éditeur, ou Ctrl + C dans une console)."
---

Une **boucle non bornée** répète des instructions **tant qu'une condition est vraie**, sans savoir à l'avance combien de tours il faudra. En Python,
c'est `while`. La difficulté nouvelle pour les élèves : garantir que la boucle **s'arrête**.

## Ce que dit le programme

Le programme de SNT cite les *boucles bornées et non bornées* : les élèves doivent distinguer les deux et savoir utiliser `while` dans des
situations simples (atteindre un seuil, redemander une saisie, simuler une évolution). La notion formelle de **terminaison** (variant de boucle) est
au programme de NSI, pas de SNT : en seconde, on se contente de vérifier « est-ce que la condition finira par être fausse ? ».

## La notion

```python exec
argent = 100
annees = 0
while argent < 200:
    argent = argent * 1.1      # +10 % par an
    annees = annees + 1
print("Il faut", annees, "ans pour doubler la somme")
```

- La condition `argent < 200` est testée **avant chaque tour**.
- Si elle est vraie, le bloc s'exécute, puis on recommence le test.
- Dès qu'elle est fausse, on sort et on passe à la suite.

On ne savait pas à l'avance qu'il faudrait 8 ans : c'est exactement le cas où `for` ne convient pas.

| | Boucle bornée `for` | Boucle non bornée `while` |
|---|---|---|
| Nombre de tours | connu à l'avance | inconnu, dépend d'une condition |
| Exemple | répéter 10 fois, parcourir un texte | atteindre un seuil, attendre une bonne réponse |
| Variable de boucle | gérée par `for` | à initialiser **et** à mettre à jour soi-même |

Toute boucle `for i in range(n)` peut s'écrire avec `while`, mais il faut alors tout gérer à la main :

```python exec
i = 0
while i < 4:
    print(i)
    i = i + 1
```

## Les erreurs classiques des élèves

:::attention[Ce que tu verras en classe]
- **La boucle infinie** : oublier `i = i + 1`, ou modifier une autre variable que celle de la condition. Le programme ne s'arrête jamais.
- **La condition inversée** : écrire la condition pour **sortir** (`while argent >= 200`) au lieu de la condition pour **continuer**.
- **Variable non initialisée** avant la boucle (`NameError`), ou initialisée **dans** la boucle.
- **Un tour de trop ou de moins** : `<` au lieu de `<=` ; vérifier sur un tableau d'état.
- **Utiliser `while` quand `for` suffit**, ce qui ajoute des risques d'erreur.
:::

:::prof
Avant de faire exécuter une boucle `while`, demander aux élèves : « **qu'est-ce qui change à chaque tour ?** et **pourquoi la condition finira par
être fausse ?** ». C'est la version seconde de la terminaison, et ça évite la plupart des boucles infinies. Prévoir aussi de montrer comment
**interrompre** un programme qui tourne sans fin.
:::

## En classe

:::methode[Situations qui justifient while]
1. **Jeu du nombre mystère** : l'ordinateur choisit un nombre, l'élève propose jusqu'à trouver ; on ne sait pas combien d'essais il faudra.
2. **Placement** : au bout de combien d'années une somme double-t-elle ?
3. **Seuil d'un capteur** (thème objets connectés) : tant que la température est inférieure à 19 °C, le chauffage reste allumé.
4. **Comparer** une même tâche écrite avec `for` et avec `while`, pour faire sentir quand chacune est naturelle.
:::

## L'essentiel

- `while condition:` répète **tant que** la condition est vraie ; elle est testée avant chaque tour (peut-être zéro tour).
- `while` quand le nombre de tours est **inconnu** ; `for` quand il est **connu**.
- La variable de la condition doit être **initialisée avant** et **modifiée dans** la boucle, sinon boucle infinie.
- Question à se poser : « qu'est-ce qui change à chaque tour, et pourquoi la boucle va-t-elle s'arrêter ? »

## Exercices

::::exercice[Grand QCM : boucles non bornées]{niveau=1 type=quiz}
Dix questions sur les boucles `while`.

1. Combien de fois `x` est-il affiché ?

   ```python
   x = 1
   while x < 4:
       print(x)
       x = x + 1
   ```

   - [ ] 4
   - [x] 3
   - [ ] 2
   - [ ] à l'infini

   > x vaut 1, 2, 3 ; quand x vaut 4, la condition `x < 4` est fausse.

1. Que se passe-t-il ?

   ```python
   x = 1
   while x < 4:
       print(x)
   ```

   - [ ] affiche 1, 2, 3
   - [x] affiche 1 sans fin (boucle infinie)
   - [ ] n'affiche rien
   - [ ] une erreur

   > `x` n'est jamais modifié dans la boucle : la condition reste vraie pour toujours.

1. Combien de tours fait cette boucle ?

   ```python
   n = 10
   while n < 5:
       n = n + 1
   ```

   - [x] 0
   - [ ] 5
   - [ ] 10
   - [ ] une infinité

   > La condition est fausse dès le départ : le bloc ne s'exécute jamais.

1. Dans quel cas une boucle `while` est-elle la plus adaptée ?

   - [ ] afficher 10 fois un message
   - [ ] parcourir toutes les lettres d'un mot
   - [x] redemander un mot de passe jusqu'à ce qu'il soit correct
   - [ ] calculer 1 + 2 + … + 100

   > On ne sait pas combien d'essais il faudra : c'est une répétition **conditionnelle**.

1. Que vaut `n` à la fin ?

   ```python
   n = 1
   while n < 100:
       n = n * 2
   ```

   - [ ] 100
   - [ ] 64
   - [x] 128
   - [ ] 99

   > 1, 2, 4, 8, 16, 32, 64, puis 128 : 128 < 100 est faux, on s'arrête. La valeur finale **dépasse** le seuil.

1. Quand la condition d'un `while` est-elle testée ?

   - [ ] une seule fois, au début
   - [x] avant chaque tour
   - [ ] après chaque tour seulement
   - [ ] à la fin du programme

   > Python teste la condition, exécute le bloc si elle est vraie, puis reteste.

1. Quelle boucle `while` affiche 0, 1, 2, 3, 4 ?

   - [x] `i = 0` puis `while i < 5:` avec `print(i)` et `i = i + 1`
   - [ ] `i = 0` puis `while i <= 5:` avec `print(i)` et `i = i + 1`
   - [ ] `while i < 5:` avec `print(i)` et `i = i + 1`, sans initialisation
   - [ ] `i = 0` puis `while i < 5:` avec `print(i)` seulement

   > Il faut initialiser, mettre à jour, et la bonne condition (`<= 5` afficherait aussi 5).

1. Un élève veut continuer tant que le score est inférieur à 50. Quelle condition écrire ?

   - [ ] `while score >= 50:`
   - [x] `while score < 50:`
   - [ ] `while score == 50:`
   - [ ] `while score > 50:`

   > La condition d'un `while` est celle pour **continuer**, pas pour s'arrêter.

1. Pour éviter une boucle infinie, quelle question faut-il se poser ?

   - [ ] « Est-ce que la boucle est assez courte ? »
   - [x] « Qu'est-ce qui change à chaque tour, et pourquoi la condition finira-t-elle par être fausse ? »
   - [ ] « Est-ce que j'ai mis un `print` ? »
   - [ ] « Est-ce que j'ai utilisé `range` ? »

   > C'est l'idée de la terminaison, à la portée d'un élève de seconde.

1. Peut-on toujours remplacer `for i in range(5):` par une boucle `while` ?

   - [x] oui, en initialisant `i = 0`, avec `while i < 5:` et `i = i + 1` dans la boucle
   - [ ] non, c'est impossible
   - [ ] oui, en écrivant `while range(5):`
   - [ ] seulement si la boucle affiche quelque chose

   > Toute boucle bornée s'écrit avec `while`, mais il faut gérer soi-même la variable : `for` est alors plus simple et plus sûr.
::::

::::exercice[Doubler une somme]{niveau=1}
Une somme placée rapporte 5 % par an (elle est multipliée par 1,05 chaque année). Écris `annees_pour_doubler(somme)` qui renvoie le nombre
d'années nécessaires pour que la somme atteigne au moins le double de la somme de départ.

```python depart
def annees_pour_doubler(somme):
    ...
```

```python tests
assert annees_pour_doubler(100) == 15, "à 5 %, il faut 15 ans"
assert annees_pour_doubler(1000) == 15, "le résultat ne dépend pas de la somme de départ"
```

:::corrige
```python solution
def annees_pour_doubler(somme):
    objectif = 2 * somme
    annees = 0
    while somme < objectif:
        somme = somme * 1.05
        annees = annees + 1
    return annees
```

On garde l'objectif dans une variable **avant** la boucle : sinon `2 * somme` changerait à chaque tour et la boucle ne s'arrêterait jamais.
:::
::::

::::exercice[Premier multiple]{niveau=2}
Écris `premier_multiple(n, seuil)` qui renvoie le plus petit multiple de `n` strictement supérieur à `seuil` (par exemple, le premier multiple de 7
au-dessus de 50 est 56). Utilise une boucle `while`.

```python depart
def premier_multiple(n, seuil):
    ...
```

```python tests
assert premier_multiple(7, 50) == 56, "7 → 56"
assert premier_multiple(5, 10) == 15, "10 n'est pas strictement supérieur à 10"
assert premier_multiple(3, 0) == 3, "seuil 0"
```

:::corrige
```python solution
def premier_multiple(n, seuil):
    m = n
    while m <= seuil:
        m = m + n
    return m
```
:::
::::

::::exercice[Aider un élève bloqué par une boucle infinie]{niveau=2}
Un élève lance ce programme et « l'ordinateur ne répond plus ». Explique-lui ce qui se passe et comment le corriger, et donne-lui une question à se
poser la prochaine fois.

```python
compteur = 0
while compteur < 10:
    print("Coucou")
```

:::criteres
- L'explication dit que la condition reste toujours vraie car `compteur` ne change jamais.
- Elle explique comment interrompre le programme.
- La correction ajoute `compteur = compteur + 1` dans la boucle (ou propose `for`).
- Une question réutilisable est donnée (« qu'est-ce qui change à chaque tour ? »).
:::

:::corrige
« Ton programme tourne sans fin : c'est une **boucle infinie**. Il répète tant que `compteur < 10`, mais rien ne modifie `compteur` dans la boucle,
donc il vaut toujours 0 et la condition est toujours vraie. Arrête-le avec le bouton stop, puis ajoute `compteur = compteur + 1` dans la boucle (bien
indenté). Ici, comme tu sais que tu veux 10 tours, une boucle `for i in range(10):` serait même plus simple. La prochaine fois, avant de lancer un
`while`, demande-toi : *qu'est-ce qui change à chaque tour, et pourquoi la boucle va-t-elle s'arrêter ?* »
:::
::::
