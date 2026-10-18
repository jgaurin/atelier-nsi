---
titre: "Oral 1 : réalisation informatique et exposé"
resume: La méthode pour la première épreuve d'admission (coefficient 5) — exploiter un corpus, réaliser un programme en 2 h 30, le tester et le mesurer, construire une interface simple (Tkinter), puis présenter en 30 minutes et répondre au jury.
duree: 65
objectifs:
  - Connaître le format et les attendus de la première épreuve d'admission
  - Organiser les 2 h 30 de préparation entre réalisation, tests et préparation de l'exposé
  - "Construire rapidement un démonstrateur : fonctions testées, mesures, interface graphique simple avec Tkinter"
  - Structurer un exposé de 30 minutes et se préparer aux questions du jury
prerequis: [algo/tris-simples, algo/diviser-pour-regner, python/tests-erreurs, web/javascript]
programme: [nsi1-algo, asd-recherche-tris, asd-dpr, nsi1-langages, nsit-langages]
cartes:
  - q: Format de la première épreuve d'admission ?
    r: "2 h 30 de préparation à partir d'un corpus de documents et d'une réalisation informatique à produire, puis 1 h devant le jury (30 min d'exposé, 30 min d'échange) ; coefficient 5 ; la note 0 est éliminatoire."
  - q: Que demandait le sujet zéro de l'oral 1 ?
    r: "Un démonstrateur de quatre tris (glouton, insertion, fusion, rapide), des mesures de temps, un jeu de tests montrant par exemple que le tri rapide n'est pas stable, puis une interface Tkinter."
  - q: Qu'est-ce qu'un tri stable ?
    r: "Un tri qui conserve l'ordre initial des éléments de clés égales. Le tri par insertion et le tri fusion (bien écrit) sont stables ; le tri rapide en place et le tri par sélection ne le sont pas en général."
  - q: La structure minimale d'un programme Tkinter ?
    r: "Créer la fenêtre (`tk.Tk()`), créer les widgets (`Label`, `Entry`, `Button`, `Canvas`) et les placer (`pack` ou `grid`), associer des fonctions aux événements (`command=fonction`, sans parenthèses), lancer la boucle d'événements (`mainloop()`)."
  - q: Comment mesurer le temps d'exécution d'une fonction en Python ?
    r: "`time.perf_counter()` avant et après (ou le module `timeit`), en répétant la mesure et en gardant le minimum ou la médiane, sur des tailles croissantes ; ou compter les opérations (comparaisons), plus reproductible."
  - q: Comment répartir les 2 h 30 de préparation ?
    r: "Environ 20 min de lecture du corpus et de plan, 1 h 20 de réalisation testée par étapes, 40 min pour préparer l'exposé (plan, démonstration, transparents ou tableau), 10 min de marge."
---

La **première épreuve d'admission** est l'épreuve au plus fort coefficient (**5**). Après **2 h 30 de préparation** sur un corpus de documents autour d'un thème, le
candidat dispose d'**une heure** devant le jury : **30 minutes d'exposé** (dont la présentation de la réalisation informatique créée pendant la préparation et une
présentation organisée des documents) puis **30 minutes d'échange**. Le jury apprécie la capacité à faire un exposé **clair et argumenté**, à **communiquer** et à
**interagir**. La note 0 est éliminatoire.

## 1. Ce qui est attendu

Le sujet zéro donne une idée précise : un **démonstrateur de quatre tris** (glouton, insertion, fusion, rapide), des **mesures de temps**, un **jeu de tests** qui
montre par exemple que le tri rapide n'est **pas stable**, puis une **interface Tkinter**. On y retrouve les trois ingrédients de l'épreuve :

- une **réalisation** qui fonctionne (programmes corrects, testés) ;
- une **analyse** (mesures, comparaison, propriétés comme la stabilité, limites) ;
- une **mise en relation avec les documents** et une **présentation** claire, devant un jury qui interrogera sur les choix.

## 2. Organiser les 2 h 30

| Temps | Activité |
|---|---|
| 20 min | lire le corpus, dégager la problématique, faire la liste des fonctionnalités par **priorité** |
| 1 h 20 | réaliser **par étapes** : chaque fonction testée avant de passer à la suivante ; garder à tout moment une version qui marche |
| 40 min | préparer l'exposé : plan, démonstration (données d'exemple prêtes), ce qu'on dira des documents, limites et prolongements |
| 10 min | marge |

:::methode[Réaliser sans se perdre]
1. **Le cœur d'abord** : les fonctions demandées, sans interface, avec des **tests** (`assert`) sur des cas simples et des cas limites.
2. **Puis l'analyse** : mesures (temps ou nombre d'opérations) sur des tailles croissantes, tests de propriétés (stabilité, cas extrêmes).
3. **L'interface en dernier**, minimale et robuste : mieux vaut une fenêtre simple qui marche qu'une interface riche qui plante pendant la démonstration.
4. Sauvegarder régulièrement ; noter au fil de l'eau les choix et les difficultés (ils nourriront l'exposé et les réponses).
:::

## 3. Tester et mesurer

```python exec
import random, time

def tri_insertion(t):
    t = list(t)
    for i in range(1, len(t)):
        x, j = t[i], i - 1
        while j >= 0 and t[j] > x:
            t[j + 1] = t[j]
            j -= 1
        t[j + 1] = x
    return t

def tri_fusion(t):
    if len(t) <= 1:
        return list(t)
    m = len(t) // 2
    g, d = tri_fusion(t[:m]), tri_fusion(t[m:])
    res, i, j = [], 0, 0
    while i < len(g) and j < len(d):
        if g[i] <= d[j]:
            res.append(g[i]); i += 1
        else:
            res.append(d[j]); j += 1
    return res + g[i:] + d[j:]

# Tests : comparer à sorted sur des cas variés, dont les cas limites
for cas in ([], [1], [2, 1], [3, 3, 1], list(range(10, 0, -1))):
    assert tri_insertion(cas) == sorted(cas) == tri_fusion(cas)

# Mesures sur des tailles croissantes
rng = random.Random(1)
for n in (500, 1000, 2000):
    t = [rng.random() for _ in range(n)]
    for tri in (tri_insertion, tri_fusion):
        debut = time.perf_counter()
        tri(t)
        print(f"{tri.__name__:14} n = {n:5} : {time.perf_counter() - debut:.4f} s")
```

Quand $n$ double, le temps du tri par insertion est environ multiplié par **4** (quadratique), celui du tri fusion par un peu plus de **2** ($n \log n$) : c'est ce
que le jury attend qu'on **interprète**. Les mesures de temps varient d'une exécution à l'autre ; **compter les comparaisons** donne des résultats reproductibles.

**La stabilité** se teste avec des éléments de **même clé** mais distinguables (par exemple des couples `(note, nom)` triés selon la note) : un tri stable conserve
l'ordre initial des noms à note égale.

## 4. Une interface avec Tkinter

Tkinter est la bibliothèque graphique fournie avec Python. Un programme Tkinter suit toujours le même schéma : créer la fenêtre, créer et placer des **widgets**,
associer des **fonctions** aux **événements**, lancer la **boucle d'événements** (programmation événementielle, comme en JavaScript).

```python
import tkinter as tk

def trier():
    """Appelée à chaque clic sur le bouton."""
    try:
        valeurs = [int(x) for x in entree.get().split()]
    except ValueError:
        resultat.config(text="Entrez des entiers séparés par des espaces")
        return
    resultat.config(text=" ".join(map(str, sorted(valeurs))))
    dessiner(sorted(valeurs))

def dessiner(valeurs):
    canevas.delete("all")
    if not valeurs:
        return
    largeur = 400 / len(valeurs)
    hauteur_max = max(max(valeurs), 1)
    for i, v in enumerate(valeurs):
        h = 180 * v / hauteur_max
        canevas.create_rectangle(i * largeur, 200 - h, (i + 1) * largeur - 2, 200, fill="steelblue")

fenetre = tk.Tk()
fenetre.title("Démonstrateur de tris")
entree = tk.Entry(fenetre, width=40)
entree.pack(padx=10, pady=5)
tk.Button(fenetre, text="Trier", command=trier).pack()     # command=trier : SANS parenthèses
resultat = tk.Label(fenetre, text="")
resultat.pack(pady=5)
canevas = tk.Canvas(fenetre, width=400, height=200, bg="white")
canevas.pack(padx=10, pady=10)
fenetre.mainloop()                                           # boucle d'événements
```

(Tkinter ne fonctionne pas dans le navigateur : ce code s'exécute avec Python installé sur l'ordinateur, comme le jour de l'épreuve.) Pour animer un tri, on utilise
`fenetre.after(delai_ms, fonction)`, qui programme un appel ultérieur sans bloquer la fenêtre — jamais `time.sleep` dans un gestionnaire d'événement, qui gèlerait
l'interface.

## 5. L'exposé et l'échange

:::methode[Un plan d'exposé de 30 minutes]
1. **Introduction** (3 min) : le thème, la problématique, l'annonce du plan.
2. **Les documents** (7 min) : une présentation **organisée** (ce que chacun apporte, leurs liens), pas un résumé document par document.
3. **La réalisation** (12 min) : ce qu'elle fait, les **choix** (structures, algorithmes), une **démonstration** préparée, les **tests** et les **mesures** interprétées.
4. **Limites et prolongements** (5 min) : ce qui ne marche pas ou pas encore, ce qu'on améliorerait, et éventuellement une exploitation en classe.
5. **Conclusion** (3 min) : retour à la problématique.
:::

Pendant l'**échange**, le jury questionne les choix (« pourquoi ce tri ? », « quel est son coût ? », « que se passe-t-il si la liste est déjà triée ? »), demande
parfois de **modifier** le programme en direct, et élargit au programme (stabilité, preuve, autres algorithmes). Écouter la question jusqu'au bout, reformuler si
besoin, **réfléchir à voix haute**, reconnaître une erreur et la corriger : c'est l'interaction qui est évaluée, pas l'infaillibilité.

:::prof
L'oral 1 évalue un futur professeur : clarté, structure, vocabulaire précis, capacité à expliquer un choix et à réagir à une objection. S'entraîner **à voix haute**,
chronomètre en main, sur plusieurs sujets (tris, graphes, bases de données, arbres, réseaux) est la seule préparation efficace.
:::

## Exemple guidé

**Problème.** Montrer, avec un test convaincant pour le jury, que le tri rapide « en place » n'est pas stable alors que le tri fusion l'est.

**1. Des données à clés égales** : des couples `(note, nom)`, triés selon la note seulement.

**2. Les deux tris, avec une clé** :

```python exec
def tri_rapide(t, cle, g=0, d=None):
    """Tri rapide en place (partition de Lomuto) selon cle(x)."""
    if d is None:
        d = len(t) - 1
    if g < d:
        pivot, i = cle(t[d]), g
        for j in range(g, d):
            if cle(t[j]) <= pivot:
                t[i], t[j] = t[j], t[i]
                i += 1
        t[i], t[d] = t[d], t[i]
        tri_rapide(t, cle, g, i - 1)
        tri_rapide(t, cle, i + 1, d)

def tri_fusion(t, cle):
    if len(t) <= 1:
        return list(t)
    m = len(t) // 2
    a, b = tri_fusion(t[:m], cle), tri_fusion(t[m:], cle)
    res, i, j = [], 0, 0
    while i < len(a) and j < len(b):
        if cle(a[i]) <= cle(b[j]):          # <= : à égalité, on prend à gauche → stable
            res.append(a[i]); i += 1
        else:
            res.append(b[j]); j += 1
    return res + a[i:] + b[j:]

eleves = [(12, "Léa"), (15, "Hugo"), (12, "Inès"), (9, "Noé"), (15, "Adam"), (12, "Zoé")]
note = lambda x: x[0]
t = list(eleves); tri_rapide(t, note)
print("rapide :", t)
print("fusion :", tri_fusion(eleves, note))
```

**3. Interpréter.** Dans l'entrée, à note 12, l'ordre est Léa, Inès, Zoé. Le tri fusion le conserve ; le tri rapide en place l'a modifié (les échanges à longue
distance de la partition « sautent » par-dessus des éléments égaux). Ce test, préparé à l'avance, se montre en quelques secondes pendant l'exposé — et l'on
explique **pourquoi** le `<=` de la fusion garantit la stabilité.

## L'essentiel

- Oral 1 : 2 h 30 de préparation, 30 min d'exposé (documents + réalisation), 30 min d'échange ; coefficient 5 ; 0 éliminatoire.
- Préparation : lecture et priorités (20 min), réalisation par étapes testées (1 h 20), préparation de l'exposé (40 min), marge.
- Tester (`assert`, cas limites, comparaison à `sorted`), mesurer (tailles croissantes, interprétation ; compter les opérations), tester les propriétés (stabilité).
- Tkinter : fenêtre, widgets (`Label`, `Entry`, `Button`, `Canvas`), `pack`/`grid`, `command=fonction` sans parenthèses, `mainloop`, `after` pour animer.
- Exposé structuré (introduction, documents organisés, réalisation et démonstration, limites, conclusion) ; échange : écouter, reformuler, raisonner à voix haute.

## Exercices

::::exercice[Un bouton qui ne réagit pas]{niveau=1}
Un candidat écrit `tk.Button(fenetre, text="Trier", command=trier())`. Que se passe-t-il ?

- [ ] Le bouton fonctionne normalement
- [x] `trier` est exécutée une fois à la création du bouton, et le clic ne fait plus rien
- [ ] Une erreur de syntaxe empêche le lancement
- [ ] Le tri s'exécute deux fois à chaque clic

:::corrige
Avec les parenthèses, `trier()` est **appelée** immédiatement et c'est son résultat (souvent `None`) qui est passé comme `command`. Il faut passer la **fonction**
elle-même : `command=trier`. C'est la même erreur qu'avec `addEventListener` en JavaScript.
:::
::::

::::exercice[Interpréter une mesure]{niveau=1}
Un tri met 0,2 s pour $n = 10\,000$ et 0,8 s pour $n = 20\,000$. Que peut-on conjecturer sur son coût ?

- [ ] linéaire
- [ ] en $n \log n$
- [x] quadratique
- [ ] exponentiel

:::corrige
Quand $n$ double, le temps est multiplié par 4 = $2^2$ : comportement quadratique. En $n \log n$, il serait multiplié par un peu plus de 2 ; linéaire, par 2. Une
conjecture à confirmer sur plusieurs tailles, et à relier à l'analyse théorique de l'algorithme.
:::
::::

::::exercice[Tester la stabilité]{niveau=2}
Écris `est_stable(tri, donnees)` : `tri` est une fonction qui prend une liste de couples `(cle, etiquette)` et renvoie une **nouvelle** liste triée selon la **clé**
seulement ; `donnees` est une liste de tels couples. Renvoie `True` si, dans le résultat, les éléments de même clé apparaissent dans le même ordre que dans `donnees`.

```python depart
def est_stable(tri, donnees):
    ...
```

```python tests
donnees = [(2, "a"), (1, "b"), (2, "c"), (1, "d"), (2, "e")]
stable = lambda t: sorted(t, key=lambda x: x[0])
def selection(t):
    t = list(t)
    for i in range(len(t)):
        m = min(range(i, len(t)), key=lambda k: t[k][0])
        t[i], t[m] = t[m], t[i]
    return t
assert est_stable(stable, donnees), "sorted est stable"
assert not est_stable(selection, donnees), "le tri par sélection par échanges ne l'est pas"
assert est_stable(selection, [(1, "x"), (2, "y")]), "pas de clés égales : rien à perturber"
```

:::corrige
```python solution
def est_stable(tri, donnees):
    resultat = tri(list(donnees))
    for cle in {c for c, _ in donnees}:
        avant = [e for c, e in donnees if c == cle]
        apres = [e for c, e in resultat if c == cle]
        if avant != apres:
            return False
    return True
```
Pour chaque clé, on compare l'ordre des étiquettes avant et après. Sur l'exemple, la sélection échange `(2, "a")` avec `(1, "b")` dès le premier tour : `a` passe
derrière `c`. Un tel test, préparé à l'avance, est une démonstration convaincante devant le jury.
:::
::::

::::exercice[Compter plutôt que chronométrer]{niveau=3}
Écris `comparaisons_insertion(t)` et `comparaisons_fusion(t)` qui renvoient le nombre de comparaisons entre éléments effectuées par le tri par insertion et par le tri
fusion (versions de la leçon) sur la liste `t`. Convention : pour l'insertion, chaque évaluation de `t[j] > x` compte, y compris celle qui arrête la
boucle ; pour la fusion, chaque comparaison `g[i] <= d[j]`. Les tests vérifient des valeurs exactes.

```python depart
def comparaisons_insertion(t):
    ...

def comparaisons_fusion(t):
    ...
```

```python tests
assert comparaisons_insertion([1, 2, 3, 4]) == 3, "liste triée : n - 1 comparaisons"
assert comparaisons_insertion([4, 3, 2, 1]) == 6, "pire cas : n(n-1)/2"
assert comparaisons_insertion(list(range(100, 0, -1))) == 4950, "pire cas, n = 100"
assert comparaisons_fusion([4, 3, 2, 1]) == 4, "fusion sur 4 éléments à l'envers"
assert comparaisons_fusion(list(range(64))) == 192, "liste triée de 64 : n/2 log2 n"
assert comparaisons_fusion([]) == 0 and comparaisons_insertion([]) == 0, "liste vide"
```

:::corrige
```python solution
def comparaisons_insertion(t):
    t, n = list(t), 0
    for i in range(1, len(t)):
        x, j = t[i], i - 1
        while j >= 0:
            n += 1                    # une comparaison t[j] > x
            if t[j] > x:
                t[j + 1] = t[j]
                j -= 1
            else:
                break
        t[j + 1] = x
    return n

def comparaisons_fusion(t):
    def trier(t):
        if len(t) <= 1:
            return list(t), 0
        m = len(t) // 2
        g, cg = trier(t[:m])
        d, cd = trier(t[m:])
        res, i, j, c = [], 0, 0, cg + cd
        while i < len(g) and j < len(d):
            c += 1
            if g[i] <= d[j]:
                res.append(g[i]); i += 1
            else:
                res.append(d[j]); j += 1
        return res + g[i:] + d[j:], c
    return trier(t)[1]
```
Pour l'insertion, chaque test `t[j] > x` est compté, y compris celui qui arrête la boucle : d'où $n - 1$ comparaisons sur une liste triée. Devant le jury, il
faut toujours **annoncer** ce qu'on compte : une autre convention donnerait d'autres nombres, mais les mêmes ordres de grandeur. Pour la fusion d'une liste
triée, chaque fusion de deux moitiés de taille $k$ fait $k$ comparaisons (on épuise la gauche) : $\frac{n}{2}\log_2 n = 192$ pour $n = 64$. Ces comptes sont
exacts et reproductibles, contrairement aux temps.
:::
::::

::::exercice[Préparer un oral blanc]{niveau=4 duree=40}
**Sujet (inspiré du sujet zéro).** Corpus : un extrait du programme de NSI sur les tris, une page de manuel sur le tri fusion, un article sur les tris utilisés par
les langages (Timsort). Réalisation demandée : un programme qui compare au moins trois tris, mesure leur coût sur des listes aléatoires, triées et inversées, et vérifie
leur stabilité, avec une interface minimale.

1. Établissez la liste des fonctionnalités par ordre de priorité et votre planning des 2 h 30.
2. Rédigez le plan détaillé de l'exposé de 30 minutes (titres et contenus).
3. Préparez cinq questions que le jury pourrait poser, avec une réponse brève pour chacune.

:::criteres
- Priorités réalistes : tris corrects et testés, puis mesures (trois types de listes), puis stabilité, puis interface ; planning cohérent avec 2 h 30 et une version fonctionnelle à chaque étape.
- Plan d'exposé : problématique, présentation organisée des documents (programme, manuel, article), réalisation et démonstration, résultats interprétés (quadratique vs n log n, cas favorables), stabilité, limites, prolongement pédagogique, conclusion.
- Questions pertinentes avec réponses justes : coût et preuve d'un tri, meilleur cas de l'insertion, stabilité et son intérêt, pourquoi Timsort (runs, insertion sur petites séquences), tri en place / mémoire, récursivité du tri fusion, choix du pivot.
:::

:::corrige
1. **Priorités** : (1) trois tris (insertion, sélection, fusion) écrits et **testés** contre `sorted` ; (2) mesures du nombre de comparaisons (ou du temps) pour
   $n = 100, 200, 400, 800$ sur des listes aléatoires, triées et inversées ; (3) test de stabilité sur des couples ; (4) interface Tkinter : saisie de $n$, choix du
   type de liste, affichage du tableau de résultats. **Planning** : 20 min de lecture et de plan ; 35 min pour (1) ; 25 min pour (2) ; 10 min pour (3) ; 15 min pour
   (4) ; 40 min de préparation de l'exposé ; 5 min de marge.
2. **Plan** : *Introduction* — trier, une opération omniprésente ; problématique : quel tri choisir, selon quels critères ? *Les documents* — le programme (ce qu'on
   attend des élèves : insertion, sélection, coût quadratique, invariants), le manuel (diviser pour régner, fusion), l'article (en pratique, des tris hybrides comme
   Timsort). *La réalisation* — architecture (fonctions de tri, fonctions de mesure, interface), démonstration, tableau des comparaisons et son interprétation
   (quadratique contre $n \log n$ ; l'insertion linéaire sur une liste triée), test de stabilité. *Limites* — mesures de temps bruitées, tailles modestes ; *prolongements*
   — une activité de première où les élèves comptent les comparaisons. *Conclusion* — le « meilleur » tri dépend des données : c'est l'idée de Timsort.
3. Questions possibles : « Quel est le meilleur cas du tri par insertion ? » — une liste triée, $n - 1$ comparaisons. « Pourquoi le tri fusion est-il en $n \log n$ ? » —
   $\log_2 n$ niveaux de découpage, chacun coûte $O(n)$ en fusions. « À quoi sert la stabilité ? » — trier successivement selon plusieurs critères (par nom puis par
   note). « Pourquoi Python utilise-t-il Timsort ? » — il exploite les portions déjà triées des données réelles et utilise l'insertion sur de petits morceaux. « Le tri
   fusion trie-t-il en place ? » — non, il utilise une mémoire supplémentaire en $O(n)$, contrairement à l'insertion.
:::
::::
