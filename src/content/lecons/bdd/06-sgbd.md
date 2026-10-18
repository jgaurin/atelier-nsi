---
titre: SGBD, transactions et accès depuis Python
resume: Ce que fait un système de gestion de bases de données (cohérence, concurrence, pannes, index), les transactions ACID, et l'accès à une base depuis Python en toute sécurité.
duree: 70
objectifs:
  - Décrire les services rendus par un SGBD (persistance, intégrité, concurrence, sécurité, efficacité)
  - Expliquer les propriétés ACID d'une transaction et utiliser `COMMIT` / `ROLLBACK`
  - Interroger et modifier une base SQLite depuis Python avec des requêtes paramétrées
  - Expliquer une injection SQL et organiser le code d'accès aux données (classe DAO)
prerequis: [bdd/sql-modification, objet/classes-objets]
programme: [id-sql, id-relationnel, nsit-bdd, id-client-serveur]
cartes:
  - q: Quels services rend un SGBD ?
    r: "Persistance des données, respect des contraintes d'intégrité, accès concurrents de plusieurs utilisateurs, reprise après panne, gestion des droits, efficacité des requêtes (index, optimisation)."
  - q: Que signifie ACID ?
    r: "**A**tomicité (tout ou rien), **C**ohérence (contraintes respectées), **I**solation (les transactions concurrentes ne se voient pas à moitié), **D**urabilité (une transaction validée survit aux pannes)."
  - q: COMMIT ou ROLLBACK ?
    r: "`COMMIT` valide définitivement les modifications de la transaction ; `ROLLBACK` les annule toutes."
  - q: Qu'est-ce qu'une injection SQL ?
    r: "Une attaque où une donnée saisie par l'utilisateur, insérée telle quelle dans le texte d'une requête, en modifie le sens (`' OR '1'='1`)."
  - q: Comment s'en protéger en Python ?
    r: "Avec des **requêtes paramétrées** : `cur.execute(\"SELECT * FROM t WHERE nom = ?\", (nom,))` — jamais de concaténation ou de f-string."
  - q: À quoi sert un index ?
    r: "À accélérer la recherche sur une colonne (structure d'arbre équilibré, B-arbre) : recherche en $O(\\log n)$ au lieu d'un parcours de toute la table, au prix d'insertions un peu plus lentes et de place en plus."
  - q: Qu'est-ce qu'une classe DAO ?
    r: "Une classe (*Data Access Object*) qui regroupe toutes les requêtes SQL d'une application et offre des méthodes simples (`get_mots()`, `ajouter_eleve(…)`) au reste du programme."
---

Un fichier CSV suffit pour un tableau de notes personnel. Mais quand mille utilisateurs réservent en même temps des places
de concert, qu'une panne de courant survient au milieu d'un virement bancaire, ou qu'une table atteint cent millions de lignes,
il faut un logiciel spécialisé : un **système de gestion de bases de données** (SGBD) — PostgreSQL, MySQL, Oracle, SQLite… Le
programme demande la « pratique d'un SGBD » ; le sujet zéro de l'écrit 2 fait écrire une classe Python d'accès à une base SQLite.
Cette leçon fait le lien entre les requêtes SQL et les programmes.

## 1. Ce que fait un SGBD

| Service                 | Exemple                                                           |
|-------------------------|-------------------------------------------------------------------|
| **persistance**         | les données survivent à l'arrêt du programme (stockées sur disque) |
| **intégrité**           | les contraintes (clés, `CHECK`) sont toujours vérifiées            |
| **concurrence**         | plusieurs utilisateurs lisent et écrivent en même temps sans conflit |
| **reprise après panne** | une panne ne laisse pas la base dans un état incohérent            |
| **sécurité**            | droits d'accès par utilisateur (`GRANT`, `REVOKE`)                 |
| **efficacité**          | index, optimisation automatique des requêtes                       |

La plupart des SGBD fonctionnent en **client-serveur** : le serveur (le SGBD) gère la base ; les applications (clients) lui
envoient des requêtes SQL par le réseau et reçoivent les résultats. SQLite est une exception : c'est une bibliothèque qui lit et
écrit directement un fichier, sans serveur (idéal pour les applications locales, les téléphones et l'enseignement).

## 2. Les transactions

Un virement de 100 € de Léa vers Hugo, c'est **deux** modifications : débiter Léa, créditer Hugo. Si une panne survient entre
les deux, 100 € disparaissent. Une **transaction** regroupe plusieurs instructions en une unité **indivisible** :

```sql exec
CREATE TABLE compte (titulaire TEXT PRIMARY KEY, solde INTEGER CHECK (solde >= 0));
INSERT INTO compte VALUES ('Léa', 250), ('Hugo', 40);

BEGIN TRANSACTION;
UPDATE compte SET solde = solde - 100 WHERE titulaire = 'Léa';
UPDATE compte SET solde = solde + 100 WHERE titulaire = 'Hugo';
COMMIT;                                   -- les deux modifications sont validées ensemble

BEGIN TRANSACTION;
UPDATE compte SET solde = solde + 500 WHERE titulaire = 'Hugo';
ROLLBACK;                                 -- annulée : comme si rien ne s'était passé

SELECT * FROM compte;
```

:::definition[Les propriétés ACID]
- **Atomicité** : une transaction est exécutée entièrement ou pas du tout (en cas d'erreur ou de panne, tout est annulé).
- **Cohérence** : elle fait passer la base d'un état respectant les contraintes à un autre état les respectant.
- **Isolation** : des transactions exécutées en même temps ne voient pas les états intermédiaires les unes des autres
  (le résultat est le même que si elles s'étaient exécutées l'une après l'autre).
- **Durabilité** : une fois validée (`COMMIT`), une transaction n'est jamais perdue, même en cas de panne.
:::

Sans isolation, deux clients qui lisent en même temps « il reste 1 place », puis réservent chacun, vendraient deux fois la même
place : c'est le problème des **accès concurrents**, que le SGBD règle par des **verrous**.

## 3. Les index

Chercher les élèves de nom « Martin » dans une table de 10 millions de lignes oblige, sans précaution, à toutes les parcourir.
Un **index** sur la colonne `nom` est une structure annexe (en général un **B-arbre**, un arbre de recherche équilibré à
grand nombre d'enfants) qui permet de trouver les lignes concernées en $O(\log n)$. Les clés primaires sont indexées
automatiquement.

```sql exec base=lycee
CREATE INDEX idx_eleve_nom ON eleve(nom);
EXPLAIN QUERY PLAN SELECT * FROM eleve WHERE nom = 'Martin';
```

Un index accélère les recherches mais ralentit un peu les insertions et occupe de la place : on indexe les colonnes souvent
utilisées dans les `WHERE` et les jointures.

## 4. Utiliser une base depuis Python

Le module `sqlite3` de Python permet d'exécuter des requêtes SQL :

```python exec
import sqlite3

connexion = sqlite3.connect(":memory:")          # une base en mémoire (ou un nom de fichier)
cur = connexion.cursor()
cur.execute("CREATE TABLE eleve (id INTEGER PRIMARY KEY, nom TEXT NOT NULL, note REAL)")
cur.executemany("INSERT INTO eleve (nom, note) VALUES (?, ?)",
                [("Martin", 14.5), ("Durand", 9.0), ("Petit", 16.0)])
connexion.commit()                                 # valider la transaction

cur.execute("SELECT nom, note FROM eleve WHERE note >= ? ORDER BY note DESC", (10,))
for nom, note in cur.fetchall():                   # liste de tuples
    print(nom, note)
connexion.close()
```

- `connect` ouvre la base ; `execute` envoie une requête ; `fetchall` (ou `fetchone`) récupère les lignes sous forme de **tuples** ;
  `commit` valide les modifications.
- Les **`?`** sont des **paramètres** : les valeurs sont transmises **séparément** du texte de la requête.

### L'injection SQL

Construire une requête en collant une saisie de l'utilisateur dans le texte est **dangereux** :

```python exec
import sqlite3

c = sqlite3.connect(":memory:")
c.execute("CREATE TABLE utilisateur (nom TEXT, mot_de_passe TEXT)")
c.execute("INSERT INTO utilisateur VALUES ('admin', 'S3cret!')")

saisie_nom, saisie_mdp = "admin", "' OR '1'='1"
dangereuse = f"SELECT * FROM utilisateur WHERE nom = '{saisie_nom}' AND mot_de_passe = '{saisie_mdp}'"
print(dangereuse)
print("connexion acceptée ?", c.execute(dangereuse).fetchall() != [])          # oui : faille !

sure = "SELECT * FROM utilisateur WHERE nom = ? AND mot_de_passe = ?"
print("connexion acceptée ?", c.execute(sure, (saisie_nom, saisie_mdp)).fetchall() != [])   # non
```

La saisie `' OR '1'='1` ferme l'apostrophe et ajoute une condition toujours vraie : on se connecte sans mot de passe. Avec des
**requêtes paramétrées**, la saisie reste une simple **valeur**, jamais du code SQL. (Et un vrai système ne stocke jamais les mots
de passe en clair, mais une empreinte obtenue par une fonction de hachage adaptée.)

## 5. Organiser le code : la classe DAO

Plutôt que d'éparpiller des requêtes SQL dans tout le programme, on les regroupe dans une classe d'**accès aux données** (*DAO*,
*Data Access Object*). Le reste du programme appelle des méthodes aux noms explicites, sans écrire de SQL ; si la base change,
seule la DAO est modifiée. (C'est la structure du programme fourni dans le sujet zéro de l'écrit 2.)

```python exec
import sqlite3

class EleveDAO:
    def __init__(self, connexion):
        self.c = connexion

    def ajouter(self, nom, classe):
        cur = self.c.execute("INSERT INTO eleve (nom, classe) VALUES (?, ?)", (nom, classe))
        self.c.commit()
        return cur.lastrowid                       # l'identifiant attribué

    def noms_de_la_classe(self, classe):
        lignes = self.c.execute("SELECT nom FROM eleve WHERE classe = ? ORDER BY nom", (classe,)).fetchall()
        return [nom for (nom,) in lignes]

c = sqlite3.connect(":memory:")
c.execute("CREATE TABLE eleve (id INTEGER PRIMARY KEY, nom TEXT NOT NULL, classe TEXT)")
dao = EleveDAO(c)
for nom, classe in [("Petit", "1G1"), ("Martin", "1G1"), ("Leroy", "1G2")]:
    dao.ajouter(nom, classe)
print(dao.noms_de_la_classe("1G1"))
```

:::prof
Le programme de terminale évoque les « services rendus par un SGBD » (persistance, gestion des accès concurrents, efficacité,
sécurisation). Une démonstration marquante : deux onglets qui réservent la dernière place en même temps, avec et sans transaction.
L'injection SQL est un bon support pour parler de sécurité et de responsabilité (en lien avec la sécurisation des communications).
:::

## Exemple guidé

**Problème (type écrit 2).** Une application de quiz enregistre les scores : `joueur(id, pseudo UNIQUE)` et
`partie(id, id_joueur, score, date)`. Écrire une classe `QuizDAO` avec `enregistrer(pseudo, score, date)` (qui crée le joueur s'il
n'existe pas, dans **une seule transaction**) et `meilleurs(n)` (les `n` meilleurs scores avec le pseudo).

```python exec
import sqlite3

class QuizDAO:
    def __init__(self, c):
        self.c = c
        self.c.execute("CREATE TABLE IF NOT EXISTS joueur (id INTEGER PRIMARY KEY, pseudo TEXT NOT NULL UNIQUE)")
        self.c.execute("""CREATE TABLE IF NOT EXISTS partie (id INTEGER PRIMARY KEY,
                          id_joueur INTEGER NOT NULL REFERENCES joueur(id),
                          score INTEGER NOT NULL CHECK (score >= 0), date TEXT NOT NULL)""")

    def enregistrer(self, pseudo, score, date):
        with self.c:                                   # transaction : commit si tout va bien, rollback sinon
            ligne = self.c.execute("SELECT id FROM joueur WHERE pseudo = ?", (pseudo,)).fetchone()
            if ligne is None:
                id_joueur = self.c.execute("INSERT INTO joueur (pseudo) VALUES (?)", (pseudo,)).lastrowid
            else:
                id_joueur = ligne[0]
            self.c.execute("INSERT INTO partie (id_joueur, score, date) VALUES (?, ?, ?)", (id_joueur, score, date))

    def meilleurs(self, n):
        return self.c.execute("""SELECT j.pseudo, p.score FROM partie p JOIN joueur j ON p.id_joueur = j.id
                                 ORDER BY p.score DESC, j.pseudo LIMIT ?""", (n,)).fetchall()

dao = QuizDAO(sqlite3.connect(":memory:"))
dao.enregistrer("ada", 120, "2026-10-01")
dao.enregistrer("alan", 95, "2026-10-01")
dao.enregistrer("ada", 140, "2026-10-02")
try:
    dao.enregistrer("grace", -5, "2026-10-03")        # score invalide : toute la transaction est annulée
except sqlite3.IntegrityError as e:
    print("refusé :", e)
print(dao.meilleurs(2))
print(dao.c.execute("SELECT pseudo FROM joueur ORDER BY pseudo").fetchall())   # « grace » n'a pas été créée
```

**Lecture.** `with self.c:` ouvre une transaction : si la seconde insertion échoue (score négatif refusé par le `CHECK`), le joueur
« grace » inséré juste avant est **annulé** aussi (atomicité). Toutes les valeurs passent par des paramètres `?` : aucune injection
possible. Le reste du programme ne voit que `enregistrer` et `meilleurs`.

## L'essentiel

- SGBD : persistance, intégrité, concurrence, reprise après panne, sécurité, efficacité ; souvent en client-serveur (SQLite : sans serveur).
- Transaction : `BEGIN` … `COMMIT` (valider) ou `ROLLBACK` (annuler) ; propriétés **ACID**.
- Index (B-arbre) : recherche en $O(\log n)$ sur une colonne, au prix d'insertions plus lentes.
- Python : `sqlite3.connect`, `execute`, `fetchall`, `commit` ; **toujours** des paramètres `?`, jamais de f-string (injection SQL).
- DAO : une classe qui regroupe les requêtes et offre des méthodes simples au reste du programme.

## Exercices

::::exercice[Propriétés ACID]{niveau=1}
Une panne de courant survient après le débit du compte de Léa mais avant le crédit du compte de Hugo, dans une même transaction
non encore validée. Quelle propriété garantit que le débit sera annulé ?

- [x] l'atomicité
- [ ] l'isolation
- [ ] la durabilité
- [ ] la cohérence

:::corrige
L'**atomicité** : une transaction est exécutée entièrement ou pas du tout. Non validée au moment de la panne, elle est annulée en
entier au redémarrage.
:::
::::

::::exercice[Repérer une injection]{niveau=1}
Laquelle de ces lignes Python est vulnérable à une injection SQL (`nom` vient d'un formulaire) ?

- [x] `cur.execute(f"SELECT * FROM client WHERE nom = '{nom}'")`
- [ ] `cur.execute("SELECT * FROM client WHERE nom = ?", (nom,))`
- [ ] `cur.execute("SELECT COUNT(*) FROM client")`
- [ ] `cur.executemany("INSERT INTO client (nom) VALUES (?)", [(nom,)])`

:::corrige
La f-string insère la saisie **dans le texte** de la requête : une valeur comme `x' OR '1'='1` change la requête. Les versions avec
`?` transmettent la valeur séparément.
:::
::::

::::exercice[Interroger depuis Python]{niveau=2}
Écris `eleves_admis(connexion, seuil)` qui renvoie la liste des noms (triés par ordre alphabétique) des élèves dont la note est
supérieure ou égale à `seuil`, dans la table `eleve(nom, note)`, avec une requête paramétrée.

```python depart
import sqlite3

def eleves_admis(connexion, seuil):
    ...
```

```python tests
import sqlite3
c = sqlite3.connect(":memory:")
c.execute("CREATE TABLE eleve (nom TEXT, note REAL)")
c.executemany("INSERT INTO eleve VALUES (?, ?)", [("Petit", 16), ("Durand", 9), ("Martin", 14.5), ("Leroy", 10)])
assert eleves_admis(c, 10) == ["Leroy", "Martin", "Petit"], "seuil 10"
assert eleves_admis(c, 15) == ["Petit"], "seuil 15"
assert eleves_admis(c, 20) == [], "personne"
```

:::corrige
```python solution
import sqlite3

def eleves_admis(connexion, seuil):
    lignes = connexion.execute("SELECT nom FROM eleve WHERE note >= ? ORDER BY nom", (seuil,)).fetchall()
    return [nom for (nom,) in lignes]
```
`fetchall` renvoie une liste de **tuples** `[("Leroy",), …]` : on les déballe pour obtenir les noms. Le tri est fait par SQL.
:::
::::

::::exercice[Une transaction en Python]{niveau=3}
Écris `virement(c, de, vers, montant)` qui transfère `montant` du compte `de` vers le compte `vers` (table
`compte(titulaire, solde)` avec la contrainte `CHECK (solde >= 0)`). Si le virement est impossible (solde insuffisant), **aucun**
compte ne doit être modifié et la fonction renvoie `False` ; sinon elle renvoie `True`.

```python depart
import sqlite3

def virement(c, de, vers, montant):
    ...
```

```python tests
import sqlite3
c = sqlite3.connect(":memory:")
c.execute("CREATE TABLE compte (titulaire TEXT PRIMARY KEY, solde INTEGER CHECK (solde >= 0))")
c.executemany("INSERT INTO compte VALUES (?, ?)", [("Léa", 250), ("Hugo", 40)])
c.commit()
soldes = lambda: dict(c.execute("SELECT titulaire, solde FROM compte").fetchall())
assert virement(c, "Léa", "Hugo", 100) == True and soldes() == {"Léa": 150, "Hugo": 140}, "virement possible"
assert virement(c, "Hugo", "Léa", 500) == False and soldes() == {"Léa": 150, "Hugo": 140}, "refusé : rien ne bouge"
```

:::corrige
```python solution
import sqlite3

def virement(c, de, vers, montant):
    try:
        with c:   # transaction : validée à la fin du bloc, annulée en cas d'exception
            c.execute("UPDATE compte SET solde = solde + ? WHERE titulaire = ?", (montant, vers))
            c.execute("UPDATE compte SET solde = solde - ? WHERE titulaire = ?", (montant, de))
        return True
    except sqlite3.IntegrityError:
        return False
```
On crédite d'abord, puis on débite : le débit qui rendrait le solde négatif viole le `CHECK` et lève `IntegrityError` ; le bloc
`with c:` annule alors **toute** la transaction, crédit compris (atomicité). Sans transaction, Léa aurait reçu 500 € gratuitement.
:::
::::

::::exercice[Écrire une classe DAO]{niveau=4 duree=25}
On reprend la base « bibliotheque » simplifiée : `livre(id_livre, titre, disponible)` où `disponible` vaut 1 ou 0, et
`emprunt(id_emprunt, id_livre, nom)`. Écris une classe `BibliothequeDAO` (son constructeur reçoit une connexion déjà ouverte, avec
les tables créées) avec :
- `livres_disponibles()` : liste des titres disponibles, par ordre alphabétique ;
- `emprunter(id_livre, nom)` : enregistre l'emprunt et rend le livre indisponible, **dans une transaction** ; lève `ValueError` si le
  livre n'existe pas ou n'est pas disponible (et ne modifie rien) ;
- `rendre(id_livre)` : rend le livre disponible.

```python depart
import sqlite3

class BibliothequeDAO:
    def __init__(self, c):
        self.c = c

    def livres_disponibles(self):
        ...

    def emprunter(self, id_livre, nom):
        ...

    def rendre(self, id_livre):
        ...
```

```python tests
import sqlite3
c = sqlite3.connect(":memory:")
c.execute("CREATE TABLE livre (id_livre INTEGER PRIMARY KEY, titre TEXT, disponible INTEGER)")
c.execute("CREATE TABLE emprunt (id_emprunt INTEGER PRIMARY KEY, id_livre INTEGER, nom TEXT)")
c.executemany("INSERT INTO livre VALUES (?, ?, 1)", [(1, "La Peste"), (2, "Fondation"), (3, "1984")])
c.commit()
dao = BibliothequeDAO(c)
assert dao.livres_disponibles() == ["1984", "Fondation", "La Peste"], "tous disponibles"
dao.emprunter(2, "Sarah")
assert dao.livres_disponibles() == ["1984", "La Peste"], "Fondation emprunté"
assert c.execute("SELECT nom FROM emprunt WHERE id_livre = 2").fetchall() == [("Sarah",)], "emprunt enregistré"
for mauvais in [2, 99]:
    try:
        dao.emprunter(mauvais, "Paul")
        ok = False
    except ValueError:
        ok = True
    assert ok, "emprunt impossible : " + str(mauvais)
assert c.execute("SELECT COUNT(*) FROM emprunt").fetchone() == (1,), "aucun emprunt en trop"
dao.rendre(2)
assert dao.livres_disponibles() == ["1984", "Fondation", "La Peste"], "rendu"
```

:::corrige
```python solution
import sqlite3

class BibliothequeDAO:
    def __init__(self, c):
        self.c = c

    def livres_disponibles(self):
        lignes = self.c.execute("SELECT titre FROM livre WHERE disponible = 1 ORDER BY titre").fetchall()
        return [titre for (titre,) in lignes]

    def emprunter(self, id_livre, nom):
        with self.c:
            ligne = self.c.execute("SELECT disponible FROM livre WHERE id_livre = ?", (id_livre,)).fetchone()
            if ligne is None or ligne[0] != 1:
                raise ValueError("livre inexistant ou déjà emprunté")
            self.c.execute("UPDATE livre SET disponible = 0 WHERE id_livre = ?", (id_livre,))
            self.c.execute("INSERT INTO emprunt (id_livre, nom) VALUES (?, ?)", (id_livre, nom))

    def rendre(self, id_livre):
        with self.c:
            self.c.execute("UPDATE livre SET disponible = 1 WHERE id_livre = ?", (id_livre,))
```
La vérification et les deux modifications sont dans la **même transaction** : si une erreur survient entre l'`UPDATE` et
l'`INSERT`, rien n'est enregistré. Toutes les valeurs passent par des paramètres. Le reste de l'application (une interface
graphique, un site Web) n'a jamais besoin d'écrire de SQL.
:::
::::
