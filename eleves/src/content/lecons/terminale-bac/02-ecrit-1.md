---
titre: Sujet d'écrit n° 1
resume: "Un sujet d'entraînement au format de l'écrit : trois exercices indépendants, plus courts que le jour du bac."
duree: 90
controle: true
objectifs:
  - "S'entraîner au format de l'écrit"
  - "Mobiliser plusieurs parties du programme"
prerequis: [terminale-bac/epreuve]
---

## Consignes

Ce sujet original comporte **trois exercices indépendants**, notés chacun sur 6 points, plus 2 points de maîtrise de la langue. Il est **plus court qu'un vrai sujet** : compte environ **1 h 30**.

Rédige tes réponses avec des phrases complètes.

**Exercice 1 : historique d'un navigateur.** Thèmes : programmation objet, piles.

**Exercice 2 : la base d'un lycée.** Thèmes : bases de données, SQL.

**Exercice 3 : un index trié.** Thèmes : arbres binaires de recherche, récursivité.

## Exercices

::::exercice[Exercice 1, partie A : la classe]{niveau=3 type=completer points=2}
Un navigateur garde l'historique des pages visitées. Le bouton « précédent » ramène à la dernière page visitée. Complète la classe.

```python trous
class Historique:
    def __init__(self):
        self.pages = [[[]]]

    def visiter(self, url):
        self.pages.[[append]](url)

    def precedent(self):
        if len(self.pages) <= [[1]]:
            return None
        self.pages.[[pop()]]
        return self.pages[len(self.pages) - [[1]]]
```
::::

::::exercice[Exercice 1, partie B : dérouler]{niveau=3 type=reponses points=2}
Donne ce qui s'affiche.

1. Après `h = Historique()`, on visite `a`, puis `b`, puis `c`. Que renvoie `h.precedent()` ?

   ```python calcul
   p = ["a", "b", "c"]
   p.pop()
   print(p[-1])
   ```

   - b

1. On visite ensuite `d`, puis on appelle deux fois `h.precedent()`. Que renvoie le dernier appel ?

   ```python calcul
   p = ["a", "b", "d"]
   p.pop()
   p.pop()
   print(p[-1])
   ```

   - a

1. Quelle structure de données la classe `Historique` utilise-t-elle ?

   - pile
   - une pile
::::

::::exercice[Exercice 1, partie C : ajouter une méthode]{niveau=3 points=2}
Ajoute la méthode `nb_visites(url)`, qui renvoie le nombre de fois où `url` est présente dans l'historique.

```python depart
class Historique:
    def __init__(self):
        self.pages = []

    def visiter(self, url):
        self.pages.append(url)

    def nb_visites(self, url):
        ...
```

```python tests
h = Historique()
assert h.nb_visites("a") == 0, "historique vide"
h.visiter("a"); h.visiter("b"); h.visiter("a")
assert h.nb_visites("a") == 2, "deux visites"
assert h.nb_visites("z") == 0, "jamais visitée"
```

:::corrige
```python solution
class Historique:
    def __init__(self):
        self.pages = []

    def visiter(self, url):
        self.pages.append(url)

    def nb_visites(self, url):
        n = 0
        for p in self.pages:
            if p == url:
                n = n + 1
        return n
```
:::
::::

::::exercice[Exercice 2, partie A : le schéma]{niveau=3 type=reponses points=2}
La base contient : classe(<u>id_classe</u>, niveau, salle), eleve(<u>id_eleve</u>, nom, prenom, naissance, #id_classe), matiere(<u>id_matiere</u>, intitule, coefficient), note(<u>id_note</u>, #id_eleve, #id_matiere, valeur, date_eval).

1. Quelle est la clé primaire de `eleve` ?

   - id_eleve

1. Quelle relation fait référence à la fois à `eleve` et à `matiere` ?

   - note

1. Quelle contrainte interdit d'ajouter une note pour un élève inexistant ?

   - référence
   - contrainte de référence
   - integrite referentielle

1. Pourquoi l'intitulé de la matière n'est-il pas écrit dans chaque note ? Réponds en un mot.

   - redondance
::::

::::exercice[Exercice 2, partie B : une sélection]{niveau=3 base=lycee points=1}
Affiche le nom et le prénom des élèves nés avant le 1er janvier 2009, triés par nom. Une date s'écrit `'2009-01-01'`.

:::corrige
```sql solution
SELECT nom, prenom FROM eleve WHERE naissance < '2009-01-01' ORDER BY nom;
```
:::
::::

::::exercice[Exercice 2, partie C : une jointure]{niveau=3 base=lycee points=2}
Affiche, pour chaque note de la matière dont l'intitulé est `'Français'`, le nom de l'élève et la valeur de la note, de la plus haute à la plus basse.

:::corrige
```sql solution
SELECT e.nom, n.valeur
FROM note n
JOIN eleve e ON n.id_eleve = e.id_eleve
JOIN matiere m ON n.id_matiere = m.id_matiere
WHERE m.intitule = 'Français'
ORDER BY n.valeur DESC;
```
:::
::::

::::exercice[Exercice 2, partie D : une mise à jour]{niveau=3 base=lycee points=1}
La classe `TG2` s'installe en salle `C310`. Écris la mise à jour, puis une requête qui affiche la salle de cette classe.

:::corrige
```sql solution
UPDATE classe SET salle = 'C310' WHERE id_classe = 'TG2';
SELECT salle FROM classe WHERE id_classe = 'TG2';
```
:::
::::

::::exercice[Exercice 3, partie A : construire]{niveau=3 type=reponses points=2}
On insère les clés 50, 30, 70, 20, 40, 60 dans cet ordre dans un arbre binaire de recherche vide.

1. Quel est l'enfant droit de 30 ?

   - 40

1. Quel est l'enfant gauche de 70 ?

   - 60

1. Quelle est la hauteur de l'arbre, en comptant les nœuds ?

   - 3

1. Donne le parcours infixe, séparé par des espaces.

   ```python calcul
   print(" ".join(map(str, sorted([50, 30, 70, 20, 40, 60]))))
   ```

   - 20 30 40 50 60 70
::::

::::exercice[Exercice 3, partie B : écrire]{niveau=3 points=2}
Écris `nb_cles_inf(a, x)`, récursive, qui renvoie le nombre de clés de l'arbre binaire de recherche `a` strictement inférieures à `x`.

```python depart
class Noeud:
    def __init__(self, cle, gauche=None, droit=None):
        self.cle = cle
        self.gauche = gauche
        self.droit = droit

def nb_cles_inf(a, x):
    ...
```

```python tests
a = Noeud(50, Noeud(30, Noeud(20), Noeud(40)), Noeud(70, Noeud(60)))
assert nb_cles_inf(a, 45) == 3, "20, 30 et 40"
assert nb_cles_inf(a, 20) == 0, "aucune"
assert nb_cles_inf(None, 10) == 0, "arbre vide"
assert nb_cles_inf(a, 100) == 6, "toutes"
```

:::corrige
```python solution
class Noeud:
    def __init__(self, cle, gauche=None, droit=None):
        self.cle = cle
        self.gauche = gauche
        self.droit = droit

def nb_cles_inf(a, x):
    if a is None:
        return 0
    return (1 if a.cle < x else 0) + nb_cles_inf(a.gauche, x) + nb_cles_inf(a.droit, x)
```
:::
::::

::::exercice[Exercice 3, partie C : justifier]{niveau=3 points=2}
On insère les clés 1, 2, 3, …, 1 000 dans cet ordre dans un ABR vide. Quelle est la hauteur de l'arbre obtenu ? Quelle conséquence pour le coût d'une recherche ? Quelle hauteur minimale aurait-on avec un arbre équilibré ?

:::criteres
- 1 point : l'arbre est filiforme, sa hauteur est 1 000, la recherche a un coût linéaire.
- 1 point : un arbre équilibré a une hauteur d'environ 10, puisque 2¹⁰ ≈ 1 000.
:::

:::corrige
Chaque clé est plus grande que les précédentes : elle va à droite. L'arbre est filiforme et sa hauteur est 1 000 ; une recherche peut donc demander 1 000 comparaisons, comme un parcours séquentiel. Un arbre équilibré aurait une hauteur d'environ 10, car 2¹⁰ = 1 024.
:::
::::
