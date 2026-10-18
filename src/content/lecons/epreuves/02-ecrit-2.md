---
titre: "Écrit 2 : analyser et faire évoluer une solution"
resume: La méthode pour la seconde épreuve d'admissibilité (4 heures, coefficient 2) — lire vite un dossier de documents hétérogènes (code Python ou Java, SQL, UML, automates, assembleur), analyser, compléter et faire évoluer une solution, et argumenter.
duree: 55
objectifs:
  - Connaître le format et les attendus de la seconde épreuve d'admissibilité
  - Lire et reformuler rapidement des documents techniques variés (code, schémas, requêtes)
  - Compléter une solution existante en respectant ses conventions, et proposer des évolutions argumentées
  - S'entraîner sur un mini-dossier de type concours
prerequis: [bdd/sql-jointures, objet/uml, objet/java-objet, langages/automates, systemes/processus]
programme: [id-relationnel, id-sql, lp-uml, lp-java, m-automates, asr-processus]
cartes:
  - q: Format de la seconde épreuve d'admissibilité ?
    r: "4 heures, coefficient 2 : à partir de documents présentant une situation concrète et des éléments de solution, analyser, compléter et faire évoluer la ou les solutions ; une note ≤ 5 est éliminatoire."
  - q: Quels contenus le sujet zéro de l'écrit 2 mobilise-t-il ?
    r: "Automates, SQL (création de tables, insertions, dépendances fonctionnelles, requêtes), classes Python, diagrammes de classes UML avec cardinalités, assembleur, Java et ordonnancement de processus."
  - q: Première chose à faire face au dossier ?
    r: "Survoler **tous** les documents et toutes les questions (15-20 min) : repérer la situation, les conventions (noms, types), les liens entre documents, et les questions indépendantes."
  - q: Comment compléter un code existant ?
    r: "Respecter ses conventions (noms, style, structures choisies), s'appuyer sur les fonctions déjà fournies plutôt que tout réécrire, et vérifier sur un exemple du dossier."
  - q: Comment répondre à « proposez une évolution » ?
    r: "Énoncer le besoin, décrire précisément la modification (schéma, code, diagramme), justifier le choix, en donner les limites ou alternatives : un raisonnement construit, pas une liste d'idées."
---

La **seconde épreuve d'admissibilité** (4 heures, coefficient 2, note éliminatoire ≤ 5) « s'appuie sur un ou plusieurs documents présentant une problématique posée par
une situation concrète et des éléments de mise en œuvre d'une ou plusieurs solutions. Le candidat est invité à analyser, le cas échéant à compléter et à faire
évoluer la ou les solutions [...]. L'épreuve vise à apprécier la capacité du candidat à comprendre et analyser les documents proposés, à construire et exposer un
raisonnement. » Là où l'écrit 1 demande de **construire** des algorithmes, l'écrit 2 demande surtout de **comprendre l'existant** — comme un développeur qui
reprend un projet, ou un professeur qui lit le code d'un élève.

## 1. Ce qui est attendu

Le sujet zéro est très **varié** : un automate, une base de données (création des tables, insertions, **dépendances fonctionnelles**, requêtes), des **classes
Python**, un **diagramme de classes UML** avec cardinalités, de l'**assembleur**, du **Java**, et l'**ordonnancement** de processus. Il faut donc une culture large
sur tout le programme et l'habitude de passer d'un langage, d'une notation, à l'autre.

:::retenir[Les verbes de l'épreuve]
- **Analyser** : dire ce que fait un code, une requête, un schéma ; repérer une erreur, une limite, un cas non traité.
- **Compléter** : écrire la partie manquante **dans le style** de l'existant.
- **Faire évoluer** : modifier la solution pour un nouveau besoin, et **justifier**.
- **Argumenter** : comparer des choix, en donner avantages et limites.
:::

## 2. Lire un dossier

:::methode[Les 20 premières minutes]
1. **Survoler** tous les documents : de quoi parle la situation ? quels sont les acteurs, les données, les traitements ?
2. Repérer les **conventions** : noms de tables et de colonnes, noms de classes et d'attributs, types, langages utilisés.
3. Faire un petit **schéma de synthèse** au brouillon (entités et liens), qui servira pour toutes les questions.
4. Lire **toutes les questions** et repérer celles qui sont indépendantes ou faciles.
:::

Pour un **code inconnu**, le reformuler en une phrase avant d'y toucher (« cette fonction renvoie la liste des adhérents qui ont un emprunt en retard ») ; le
**tracer** sur un petit exemple ; repérer les **préconditions** implicites. Pour un **schéma** (UML, relationnel, automate), relire les cardinalités, les clés, les
états acceptants : c'est là que se cachent les questions.

## 3. Répondre

- **Compléter** : réutiliser les fonctions et méthodes fournies, garder les mêmes noms, ne pas changer la structure sans le dire.
- **Corriger** : désigner précisément l'erreur (ligne, condition), expliquer **pourquoi** elle est fausse (un exemple qui la met en défaut), donner la correction.
- **Faire évoluer** : décrire la modification **complète** (nouvelle table et clés, nouvelle méthode et ses appels, nouvel état et ses transitions), puis ses
  conséquences sur le reste de la solution.
- **Argumenter** : une structure courte — besoin, proposition, justification, limites.

:::prof
L'écrit 2 ressemble à ce que fait un professeur : lire vite des productions variées, comprendre ce qui a été voulu, repérer ce qui ne va pas, proposer une
amélioration et l'expliquer clairement. Le soin de l'explication est évalué (« construire et exposer un raisonnement »).
:::

## Exemple guidé

**Dossier (extrait).** Une médiathèque utilise la base `bibliotheque` (tables `auteur`, `livre`, `adherent`, `emprunt`, où `date_retour` vaut `NULL` tant que le
livre n'est pas rendu). Un développeur a écrit en Python :

```python
def peut_emprunter(nb_emprunts_en_cours, en_retard):
    return nb_emprunts_en_cours <= 3 or not en_retard
```

Règle de la médiathèque : *un adhérent peut emprunter s'il a **moins de 3** emprunts en cours **et** aucun retard.*

**Q1. Analyser la fonction.** Deux erreurs : `<= 3` autorise un 4ᵉ emprunt (il faut `< 3`) ; `or` au lieu de `and` laisse emprunter un adhérent en retard tant
qu'il a peu d'emprunts. Contre-exemple : `peut_emprunter(1, True)` renvoie `True` alors que l'adhérent est en retard. Correction :
`return nb_emprunts_en_cours < 3 and not en_retard`.

**Q2. Requête : les emprunts en cours**, avec le nom de l'adhérent et le titre :

```sql exec base=bibliotheque
SELECT a.nom, a.prenom, l.titre, e.date_emprunt
FROM emprunt e
JOIN adherent a ON a.id_adherent = e.id_adherent
JOIN livre l ON l.id_livre = e.id_livre
WHERE e.date_retour IS NULL
ORDER BY e.date_emprunt;
```

**Q3. Faire évoluer** : la médiathèque veut gérer **plusieurs exemplaires** d'un même livre. *Proposition* : une table `exemplaire(id_exemplaire, id_livre, etat,
date_achat)` ; `emprunt` référence désormais `id_exemplaire` (et non plus `id_livre`). *Justification* : un emprunt porte sur un objet physique ; les informations
bibliographiques (titre, auteur) restent dans `livre`, sans redondance. *Conséquences* : les requêtes qui joignaient `emprunt` à `livre` passent par `exemplaire` ;
il faut migrer les données existantes (un exemplaire par livre actuel).

## L'essentiel

- Écrit 2 : 4 h, coefficient 2, ≤ 5 éliminatoire ; analyser, compléter, faire évoluer une solution à partir de documents.
- Contenus variés (sujet zéro) : automates, SQL et dépendances fonctionnelles, classes Python, UML, assembleur, Java, ordonnancement.
- 20 premières minutes : survol complet, conventions, schéma de synthèse, repérage des questions.
- Compléter dans le style existant ; corriger avec un contre-exemple ; faire évoluer de façon complète ; argumenter (besoin, proposition, justification, limites).

## Exercices

::::exercice[Lire un code Java]{niveau=1}
Dans un dossier, on lit :

```java
public int nbEnRetard(List<Emprunt> emprunts, LocalDate aujourdhui) {
    int n = 0;
    for (Emprunt e : emprunts) {
        if (e.getDateRetour() == null && e.getDateLimite().isBefore(aujourdhui)) n++;
    }
    return n;
}
```

Que compte cette méthode ?

- [ ] le nombre total d'emprunts
- [ ] les emprunts rendus après la date limite
- [x] les emprunts non rendus dont la date limite est dépassée
- [ ] les emprunts dont la date limite est aujourd'hui

:::corrige
`getDateRetour() == null` : pas encore rendu ; `getDateLimite().isBefore(aujourdhui)` : date limite passée. La méthode compte les emprunts **en cours et en retard**.
(Ici `== null` est correct : on teste l'absence de référence, pas l'égalité de deux objets.)
:::
::::

::::exercice[Repérer l'erreur]{niveau=1}
Règle : « un adhérent peut emprunter s'il a moins de 3 emprunts en cours et aucun retard ». Quelle fonction est correcte ?

- [ ] `return n <= 3 and not retard`
- [ ] `return n < 3 or not retard`
- [x] `return n < 3 and not retard`
- [ ] `return not (n < 3 and retard)`

:::corrige
« moins de 3 » se traduit par `n < 3`, et les deux conditions doivent être vraies : `and`. La dernière, par De Morgan, vaut `n >= 3 or not retard` : rien à voir.
:::
::::

::::exercice[Requête du dossier]{niveau=2 base=bibliotheque}
La médiathèque veut relancer les adhérents qui ont des emprunts **non rendus** : affiche, pour chaque adhérent concerné, son nom, son prénom et le **nombre** de livres
qu'il n'a pas rendus (colonne `nb`), du plus grand nombre au plus petit, puis par nom.

:::corrige
```sql solution
SELECT a.nom, a.prenom, COUNT(*) AS nb
FROM emprunt e
JOIN adherent a ON a.id_adherent = e.id_adherent
WHERE e.date_retour IS NULL
GROUP BY a.id_adherent
ORDER BY nb DESC, a.nom;
```
Le filtre `date_retour IS NULL` (et non `= NULL`, toujours inconnu en SQL) garde les emprunts en cours ; on regroupe par adhérent (par sa clé, pour ne pas fusionner
deux homonymes) et l'on compte.
:::
::::

::::exercice[Compléter une classe]{niveau=2}
Le dossier fournit une classe `Adherent` à compléter. Écris la méthode `emprunter(livre)` (refuse avec `ValueError` si l'adhérent a déjà 3 emprunts ou un retard)
et la méthode `rendre(livre)`, en **réutilisant** les attributs et la méthode fournis.

```python depart
class Adherent:
    MAX = 3

    def __init__(self, nom):
        self.nom = nom
        self.emprunts = []        # livres en cours
        self.en_retard = False

    def peut_emprunter(self):
        return len(self.emprunts) < Adherent.MAX and not self.en_retard

    def emprunter(self, livre):
        ...

    def rendre(self, livre):
        ...
```

```python tests
a = Adherent("Léa")
for titre in ["Dune", "Ubik", "Solaris"]:
    a.emprunter(titre)
assert a.emprunts == ["Dune", "Ubik", "Solaris"], "trois emprunts"
try:
    a.emprunter("Neuromancien"); ok = False
except ValueError:
    ok = True
assert ok, "quatrième emprunt refusé"
a.rendre("Ubik")
assert a.emprunts == ["Dune", "Solaris"], "rendu"
a.en_retard = True
try:
    a.emprunter("Neuromancien"); ok = False
except ValueError:
    ok = True
assert ok, "refus en cas de retard"
```

:::corrige
```python solution
class Adherent:
    MAX = 3

    def __init__(self, nom):
        self.nom = nom
        self.emprunts = []
        self.en_retard = False

    def peut_emprunter(self):
        return len(self.emprunts) < Adherent.MAX and not self.en_retard

    def emprunter(self, livre):
        if not self.peut_emprunter():
            raise ValueError("emprunt impossible")
        self.emprunts.append(livre)

    def rendre(self, livre):
        self.emprunts.remove(livre)
```
On réutilise `peut_emprunter` plutôt que de réécrire la règle : si elle change, un seul endroit à modifier. C'est exactement ce que le correcteur attend quand une
méthode est fournie.
:::
::::

::::exercice[Dépendances fonctionnelles]{niveau=3 duree=15}
Un document propose la table unique `emprunt_complet(id_emprunt, date_emprunt, id_adherent, nom_adherent, email, id_livre, titre, auteur)`.

1. Donnez trois dépendances fonctionnelles valables dans cette table.
2. Montrez sur un exemple les anomalies (redondance, mise à jour, suppression) que cette conception provoque.
3. Proposez une décomposition en plusieurs tables, avec clés primaires et étrangères.

:::criteres
- Dépendances : `id_emprunt → date_emprunt, id_adherent, id_livre` ; `id_adherent → nom_adherent, email` ; `id_livre → titre, auteur`.
- Anomalies illustrées : email répété à chaque emprunt (redondance, incohérence en cas de modification partielle) ; supprimer le dernier emprunt d'un livre fait perdre son titre ; impossible d'enregistrer un adhérent sans emprunt.
- Décomposition : `adherent(id_adherent, nom, email)`, `livre(id_livre, titre, auteur)` (ou `auteur` séparé), `emprunt(id_emprunt, date_emprunt, #id_adherent, #id_livre)`.
:::

:::corrige
1. `id_emprunt → date_emprunt, id_adherent, id_livre` (c'est la clé) ; `id_adherent → nom_adherent, email` ; `id_livre → titre, auteur`.
2. **Redondance** : si Léa a fait 20 emprunts, son adresse est stockée 20 fois. **Mise à jour** : si elle change d'adresse et qu'on n'en modifie qu'une partie des
   lignes, la base devient incohérente. **Suppression** : supprimer le seul emprunt d'un livre fait perdre son titre et son auteur. **Insertion** : impossible
   d'enregistrer un nouvel adhérent avant son premier emprunt (il faudrait un `id_emprunt`).
3. Chaque dépendance qui ne part pas de la clé donne une table : `adherent(id_adherent, nom, email)`, `livre(id_livre, titre, auteur)`,
   `emprunt(id_emprunt, date_emprunt, #id_adherent, #id_livre)` — les clés étrangères relient les tables, et chaque information n'est stockée qu'une fois (on peut
   aller jusqu'à une table `auteur`).
:::
::::

::::exercice[Un mini-dossier complet]{niveau=4 duree=45}
**Situation.** Un lycée gère les **réservations de salles informatiques**. Documents : (A) la table `reservation(id, salle, jour, creneau, professeur)` ; (B) la
fonction Python suivante, utilisée avant chaque insertion :

```python
def libre(reservations, salle, jour, creneau):
    for r in reservations:
        if r["salle"] == salle and r["jour"] == jour:
            return False
    return True
```

(C) un diagramme d'états d'une réservation : `demandée → confirmée → (utilisée | annulée)`.

1. Analysez la fonction `libre` : que fait-elle réellement ? Donnez un exemple où elle se trompe et corrigez-la.
2. Écrivez la requête SQL qui liste, pour un jour donné, les salles **réservées** au créneau 3, avec le professeur.
3. Proposez une contrainte dans la base qui empêche, même en cas de bug dans le programme, deux réservations de la même salle au même moment.
4. On veut gérer les annulations sans supprimer les lignes. Faites évoluer la table et la fonction `libre` en cohérence avec le diagramme d'états.
5. Expliquez à un élève de terminale pourquoi la contrainte de la question 3 est préférable à une simple vérification dans le programme.

:::criteres
- Q1 : la fonction ignore le créneau (une salle réservée le matin est vue occupée toute la journée) ; exemple ; correction en ajoutant `r["creneau"] == creneau`.
- Q2 : `SELECT salle, professeur FROM reservation WHERE jour = ? AND creneau = 3 ORDER BY salle;` (paramètre pour le jour).
- Q3 : contrainte d'unicité `UNIQUE (salle, jour, creneau)` (ou clé primaire composée), avec justification.
- Q4 : colonne `etat` (demandée, confirmée, utilisée, annulée) avec contrainte de domaine ; `libre` ignore les réservations annulées ; la contrainte d'unicité doit alors tenir compte de l'état (index partiel ou vérification).
- Q5 : la base est le garant de l'intégrité quel que soit le programme qui l'utilise (plusieurs applications, accès concurrents, bugs) ; lien avec les transactions.
:::

:::corrige
1. La fonction renvoie `False` dès qu'il existe une réservation de cette salle **ce jour-là**, sans regarder le **créneau** : une salle réservée au créneau 1 est
   déclarée occupée aux créneaux 2 à 8. Exemple : avec une seule réservation `{"salle": "B12", "jour": "lundi", "creneau": 1}`, `libre(r, "B12", "lundi", 3)` renvoie
   `False` alors que la salle est libre. Correction : ajouter la condition `and r["creneau"] == creneau`.
2. ```sql
   SELECT salle, professeur
   FROM reservation
   WHERE jour = ? AND creneau = 3
   ORDER BY salle;
   ```
   (le `?` est un paramètre, remplacé par le jour demandé, pour éviter toute injection).
3. `UNIQUE (salle, jour, creneau)` (ou `PRIMARY KEY (salle, jour, creneau)` à la place de `id`) : le SGBD **refuse** toute insertion d'une seconde réservation du
   même créneau, quelle que soit l'application qui insère.
4. Ajouter une colonne `etat TEXT NOT NULL CHECK (etat IN ('demandee', 'confirmee', 'utilisee', 'annulee')) DEFAULT 'demandee'` ; annuler = passer `etat` à
   `'annulee'` (transition autorisée seulement depuis `demandee` ou `confirmee`, d'après le diagramme). `libre` doit **ignorer** les réservations annulées :
   `… and r["etat"] != "annulee"`. La contrainte d'unicité doit alors ne porter que sur les réservations actives (un index unique **partiel**
   `… WHERE etat <> 'annulee'` en SQLite ou PostgreSQL), sinon une salle annulée ne pourrait plus être réservée.
5. Le programme n'est qu'**un** des accès à la base : une autre application, un script d'import, deux enseignants qui réservent au même instant (deux vérifications
   « c'est libre » simultanées, puis deux insertions) peuvent contourner la vérification. La contrainte dans la base est vérifiée **à chaque** écriture, de façon
   atomique : c'est le SGBD qui garantit l'intégrité. La vérification dans le programme reste utile pour afficher un message clair, mais elle ne suffit pas.
:::
::::
