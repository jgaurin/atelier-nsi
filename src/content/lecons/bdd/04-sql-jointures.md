---
titre: "SQL : jointures et agrégats"
resume: Combiner plusieurs tables avec JOIN, calculer des statistiques avec les fonctions d'agrégat, regrouper avec GROUP BY et filtrer les groupes avec HAVING.
duree: 80
objectifs:
  - Écrire une jointure entre deux ou trois tables avec `JOIN … ON` et des alias
  - Utiliser une jointure externe (`LEFT JOIN`) pour garder les lignes sans correspondance
  - Calculer `COUNT`, `SUM`, `AVG`, `MIN`, `MAX`, globalement ou par groupe avec `GROUP BY`
  - Filtrer des groupes avec `HAVING` et utiliser une sous-requête
prerequis: [bdd/sql-selection]
programme: [id-sql, id-relationnel, nsit-bdd]
cartes:
  - q: À quoi sert une jointure ?
    r: "À combiner les lignes de deux tables qui se correspondent, en général en égalant une clé étrangère et la clé primaire qu'elle référence : `FROM eleve JOIN classe ON eleve.id_classe = classe.id_classe`."
  - q: Différence entre JOIN et LEFT JOIN ?
    r: "`JOIN` (interne) ne garde que les lignes qui ont une correspondance ; `LEFT JOIN` garde aussi les lignes de la table de gauche sans correspondance (avec des NULL à droite)."
  - q: Que calcule `COUNT(*)` ? `COUNT(colonne)` ?
    r: "`COUNT(*)` : le nombre de lignes. `COUNT(colonne)` : le nombre de valeurs non NULL de la colonne."
  - q: Rôle de GROUP BY ?
    r: "Regrouper les lignes qui ont la même valeur d'une ou plusieurs colonnes, pour calculer un agrégat par groupe."
  - q: WHERE ou HAVING ?
    r: "`WHERE` filtre les **lignes** avant le regroupement ; `HAVING` filtre les **groupes** après (il peut utiliser des agrégats)."
  - q: Ordre logique d'une requête complète ?
    r: "FROM / JOIN → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT."
  - q: Pourquoi préfixer les colonnes par le nom (ou l'alias) de la table ?
    r: "Quand deux tables ont une colonne de même nom (`id_classe`), il faut préciser laquelle : sinon, erreur « ambiguous column name »."
---

Les informations d'une base relationnelle sont volontairement **réparties** entre plusieurs tables (c'était le but de la
normalisation) : le nom d'un élève est dans `eleve`, ses notes dans `note`, l'intitulé des matières dans `matiere`. Pour
répondre à « quelle est la moyenne de chaque élève en NSI ? », il faut **recoller** ces tables (les **jointures**) puis
**calculer** sur des groupes de lignes (les **agrégats**). C'est là que SQL devient vraiment puissant — et c'est le cœur des
questions SQL des épreuves.

## 1. La jointure

```sql exec base=lycee
SELECT eleve.nom, eleve.prenom, classe.niveau, classe.salle
FROM eleve JOIN classe ON eleve.id_classe = classe.id_classe
ORDER BY eleve.nom;
```

`JOIN … ON condition` associe chaque ligne de `eleve` aux lignes de `classe` qui vérifient la condition, ici l'égalité entre la
**clé étrangère** `eleve.id_classe` et la **clé primaire** `classe.id_classe`. Le résultat contient les colonnes des deux tables.

```mermaid legende="Jointure : chaque élève est associé à la ligne de sa classe"
graph LR
  E1["eleve : Martin, 2D1"] -- "id_classe = id_classe" --> C1["classe : 2D1, Seconde, B104"]
  E2["eleve : Petit, 1G1"] --> C2["classe : 1G1, Première, C201"]
  E3["eleve : Durand, 1G1"] --> C2
  E4["eleve : David, NULL"] -.- X["aucune classe : absent du JOIN"]
```

Les **alias** de tables raccourcissent l'écriture : `FROM eleve AS e JOIN classe AS c ON e.id_classe = c.id_classe` (le `AS` est
facultatif). On **préfixe** les colonnes quand le même nom existe dans les deux tables.

### Plusieurs jointures

Pour afficher les notes avec le nom de l'élève **et** l'intitulé de la matière, on enchaîne deux jointures :

```sql exec base=lycee
SELECT e.nom, e.prenom, m.intitule, n.valeur
FROM note n
JOIN eleve e ON n.id_eleve = e.id_eleve
JOIN matiere m ON n.id_matiere = m.id_matiere
WHERE m.intitule = 'NSI'
ORDER BY n.valeur DESC;
```

### La jointure externe

Un `JOIN` (jointure **interne**) ne garde que les lignes qui ont une correspondance : Louis David, sans classe, disparaît de la
jointure précédente, et la classe 2D3, qui n'a encore aucun élève, aussi. Pour garder toutes les classes :

```sql exec base=lycee
SELECT c.id_classe, e.nom
FROM classe c LEFT JOIN eleve e ON e.id_classe = c.id_classe
ORDER BY c.id_classe;
```

`LEFT JOIN` garde **toutes** les lignes de la table de gauche (`classe`), même celles sans élève : les colonnes de droite valent
alors `NULL`. C'est indispensable pour répondre à « les classes **sans** élève », « les livres **jamais** empruntés »…

## 2. Les fonctions d'agrégat

Une fonction d'**agrégat** calcule **une** valeur à partir de **plusieurs** lignes :

| Fonction            | Résultat                                  |
|---------------------|-------------------------------------------|
| `COUNT(*)`          | nombre de lignes                          |
| `COUNT(col)`        | nombre de valeurs non `NULL` de `col`     |
| `COUNT(DISTINCT col)` | nombre de valeurs distinctes            |
| `SUM(col)`, `AVG(col)` | somme, moyenne (les `NULL` sont ignorés) |
| `MIN(col)`, `MAX(col)` | plus petite, plus grande valeur        |

```sql exec base=lycee
SELECT COUNT(*) AS nb_notes, ROUND(AVG(valeur), 2) AS moyenne, MIN(valeur), MAX(valeur)
FROM note;
```

## 3. GROUP BY : un calcul par groupe

`GROUP BY` regroupe les lignes qui ont la même valeur, et les agrégats sont calculés **dans chaque groupe** :

```sql exec base=lycee
SELECT m.intitule, COUNT(*) AS nb, ROUND(AVG(n.valeur), 2) AS moyenne
FROM note n JOIN matiere m ON n.id_matiere = m.id_matiere
GROUP BY m.intitule
ORDER BY moyenne DESC;
```

:::attention
Dans une requête avec `GROUP BY`, les colonnes du `SELECT` doivent être soit des colonnes du `GROUP BY`, soit des agrégats.
`SELECT nom, AVG(valeur) … GROUP BY id_classe` n'a pas de sens : quel nom afficher pour une classe de plusieurs élèves ?
(SQLite l'accepte en choisissant une ligne au hasard ; d'autres SGBD le refusent.)
:::

## 4. HAVING : filtrer les groupes

`WHERE` filtre les **lignes** avant le regroupement ; pour filtrer les **groupes** selon un agrégat, on utilise `HAVING` :

```sql exec base=lycee
SELECT e.nom, e.prenom, COUNT(*) AS nb_notes, ROUND(AVG(n.valeur), 2) AS moyenne
FROM eleve e JOIN note n ON n.id_eleve = e.id_eleve
GROUP BY e.id_eleve
HAVING AVG(n.valeur) >= 14
ORDER BY moyenne DESC;
```

```mermaid legende="Ordre logique d'évaluation d'une requête complète"
graph LR
  F["FROM / JOIN"] --> W["WHERE<br/>lignes"] --> G["GROUP BY"] --> H["HAVING<br/>groupes"] --> S["SELECT"] --> O["ORDER BY"] --> L["LIMIT"]
```

## 5. Les sous-requêtes

Une requête peut en contenir une autre, entre parenthèses. Par exemple, les notes **supérieures à la moyenne générale** :

```sql exec base=lycee
SELECT id_eleve, valeur FROM note
WHERE valeur > (SELECT AVG(valeur) FROM note)
ORDER BY valeur DESC;
```

Ou les élèves qui ont **au moins une** note en NSI (sous-requête avec `IN`) :

```sql exec base=lycee
SELECT nom, prenom FROM eleve
WHERE id_eleve IN (SELECT id_eleve FROM note WHERE id_matiere = 2)
ORDER BY nom;
```

:::prof
Le programme de terminale demande d'écrire des requêtes avec `JOIN` et des fonctions d'agrégation simples ; le concours attend
en plus la maîtrise de `GROUP BY`, `HAVING`, des sous-requêtes et des valeurs `NULL`. Dessiner les tables et relier à la main les
lignes qui se correspondent avant d'écrire la jointure évite la plupart des erreurs ; pour les agrégats, faire d'abord la requête
**sans** `GROUP BY` (toutes les lignes), puis regrouper.
:::

## Exemple guidé

**Problème (base bibliotheque).** « Pour chaque adhérent ayant emprunté au moins 2 livres, afficher son nom, son prénom et le
nombre de ses emprunts, du plus gros lecteur au plus petit ; à égalité, par nom. »

**1. Tables** : les emprunts (`emprunt`) et les noms (`adherent`) → une jointure sur `id_adherent`.
**2. Groupes** : un groupe par adhérent → `GROUP BY a.id_adherent`.
**3. Agrégat** : le nombre d'emprunts → `COUNT(*)`.
**4. Filtre sur les groupes** : au moins 2 → `HAVING COUNT(*) >= 2`.
**5. Tri** : `ORDER BY nb DESC, a.nom`.

```sql exec base=bibliotheque
SELECT a.nom, a.prenom, COUNT(*) AS nb
FROM emprunt e JOIN adherent a ON e.id_adherent = a.id_adherent
GROUP BY a.id_adherent
HAVING COUNT(*) >= 2
ORDER BY nb DESC, a.nom;
```

**6. Variante avec jointure externe** : « les adhérents qui n'ont **jamais** emprunté ». Une jointure interne les ferait
disparaître ; on fait un `LEFT JOIN` et on garde ceux pour qui aucun emprunt ne correspond :

```sql exec base=bibliotheque
SELECT a.nom, a.prenom
FROM adherent a LEFT JOIN emprunt e ON e.id_adherent = a.id_adherent
WHERE e.id_emprunt IS NULL;
```

## L'essentiel

- Jointure : `FROM t1 JOIN t2 ON t1.cle_etrangere = t2.cle_primaire` ; alias (`FROM eleve e`) ; préfixer les colonnes ambiguës.
- `JOIN` interne : seulement les correspondances ; `LEFT JOIN` : toutes les lignes de gauche (NULL à droite) → « sans … », « jamais … ».
- Agrégats : `COUNT(*)`, `COUNT(col)` (non NULL), `SUM`, `AVG`, `MIN`, `MAX`, `COUNT(DISTINCT col)`.
- `GROUP BY` : un résultat par groupe ; le `SELECT` ne contient que des colonnes de regroupement et des agrégats.
- `WHERE` filtre les lignes (avant), `HAVING` filtre les groupes (après, avec agrégats).
- Sous-requêtes : `WHERE x > (SELECT AVG(…) …)`, `WHERE id IN (SELECT …)`.

## Exercices

::::exercice[Jointure interne]{niveau=1}
Sur la base lycee, `SELECT e.nom FROM eleve e JOIN classe c ON e.id_classe = c.id_classe;` renvoie 15 lignes alors que la table
`eleve` en contient 16. Pourquoi ?

- [ ] il y a un doublon dans `classe`
- [x] un élève a une classe `NULL`, sans correspondance dans `classe`
- [ ] la requête est fausse
- [ ] la classe TG2 n'a qu'un élève

:::corrige
La jointure interne ne garde que les élèves qui ont une classe correspondante. Louis David a `id_classe` à `NULL` : il disparaît.
Un `LEFT JOIN` depuis `eleve` le garderait.
:::
::::

::::exercice[WHERE ou HAVING]{niveau=1}
On veut les classes dont la moyenne des notes dépasse 13. Où placer la condition `AVG(n.valeur) > 13` ?

- [ ] dans le `WHERE`
- [x] dans le `HAVING`, après `GROUP BY`
- [ ] dans le `SELECT`
- [ ] dans le `ORDER BY`

:::corrige
La condition porte sur un **agrégat** calculé par groupe : elle se place dans `HAVING`. Le `WHERE` est évalué avant le
regroupement, ligne par ligne, et ne peut pas contenir d'agrégat.
:::
::::

::::exercice[Notes et noms]{niveau=2 base=lycee}
Affiche le nom, le prénom et la valeur de chaque note de **Mathématiques**, triées par valeur décroissante puis par nom.

:::corrige
```sql solution
SELECT e.nom, e.prenom, n.valeur
FROM note n
JOIN eleve e ON n.id_eleve = e.id_eleve
JOIN matiere m ON n.id_matiere = m.id_matiere
WHERE m.intitule = 'Mathématiques'
ORDER BY n.valeur DESC, e.nom;
```
On pourrait filtrer sur `n.id_matiere = 1` sans joindre `matiere`, mais la requête dépendrait alors d'un identifiant à connaître.
:::
::::

::::exercice[Effectif par classe]{niveau=2 base=lycee}
Affiche, pour chaque classe, son identifiant et son nombre d'élèves, **y compris les classes sans élève** (avec 0), par identifiant
de classe.

:::indice
Pars de `classe` et fais un `LEFT JOIN` vers `eleve`. Attention : `COUNT(*)` compterait 1 pour une classe vide (la ligne avec NULL).
:::

:::corrige
```sql solution
SELECT c.id_classe, COUNT(e.id_eleve) AS effectif
FROM classe c LEFT JOIN eleve e ON e.id_classe = c.id_classe
GROUP BY c.id_classe
ORDER BY c.id_classe;
```
`COUNT(e.id_eleve)` ne compte que les valeurs **non NULL** : une classe sans élève (une seule ligne avec `e.id_eleve` à NULL)
donne bien 0, alors que `COUNT(*)` donnerait 1.
:::
::::

::::exercice[Moyenne par élève]{niveau=3 base=lycee}
Affiche le nom, le prénom et la moyenne (arrondie à 2 décimales, colonne `moyenne`) des élèves qui ont **au moins 3 notes**, de la
meilleure à la moins bonne moyenne, puis par nom.

:::corrige
```sql solution
SELECT e.nom, e.prenom, ROUND(AVG(n.valeur), 2) AS moyenne
FROM eleve e JOIN note n ON n.id_eleve = e.id_eleve
GROUP BY e.id_eleve
HAVING COUNT(*) >= 3
ORDER BY moyenne DESC, e.nom;
```
On regroupe par `id_eleve` (et non par nom : deux élèves pourraient avoir le même nom). `HAVING COUNT(*) >= 3` porte sur le nombre
de notes de chaque groupe.
:::
::::

::::exercice[Livres jamais empruntés]{niveau=3 base=bibliotheque}
Affiche le titre des livres qui n'ont **jamais** été empruntés, par ordre alphabétique.

:::corrige
```sql solution
SELECT l.titre
FROM livre l LEFT JOIN emprunt e ON e.id_livre = l.id_livre
WHERE e.id_emprunt IS NULL
ORDER BY l.titre;
```
Autre écriture avec une sous-requête : `SELECT titre FROM livre WHERE id_livre NOT IN (SELECT id_livre FROM emprunt) ORDER BY titre;`
(attention : `NOT IN` se comporte mal si la sous-requête renvoie un `NULL`).
:::
::::

::::exercice[Statistiques de la médiathèque]{niveau=4 duree=25 base=bibliotheque}
Écris une requête qui affiche, pour chaque **nationalité** d'auteur ayant au moins un livre **emprunté**, le nombre d'emprunts et
le nombre de livres **différents** empruntés, la nationalité qui a le plus d'emprunts en premier (à égalité, par nationalité).
Colonnes : `nationalite`, `nb_emprunts`, `nb_livres`.

:::criteres
- Trois tables jointes : `emprunt` → `livre` (par `id_livre`) → `auteur` (par `id_auteur`).
- Regroupement par `auteur.nationalite`.
- `COUNT(*)` pour les emprunts et `COUNT(DISTINCT livre.id_livre)` pour les livres différents.
- Tri `ORDER BY nb_emprunts DESC, nationalite`.
- Les nationalités sans emprunt n'apparaissent pas (jointures internes depuis `emprunt`).
:::

:::corrige
```sql solution
SELECT a.nationalite, COUNT(*) AS nb_emprunts, COUNT(DISTINCT l.id_livre) AS nb_livres
FROM emprunt e
JOIN livre l ON e.id_livre = l.id_livre
JOIN auteur a ON l.id_auteur = a.id_auteur
GROUP BY a.nationalite
ORDER BY nb_emprunts DESC, a.nationalite;
```
Un même livre emprunté deux fois compte pour 2 emprunts mais pour 1 livre : d'où `COUNT(DISTINCT …)`. En partant de `emprunt`
avec des jointures **internes**, seules les nationalités ayant au moins un emprunt apparaissent, comme demandé.
:::
::::
