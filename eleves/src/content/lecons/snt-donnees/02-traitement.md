---
titre: Traiter une table
resume: "Rechercher, filtrer, trier, calculer et croiser des tables, à la main ou avec un tableur."
duree: 35
objectifs:
  - "Réaliser des opérations de recherche, de filtre, de tri ou de calcul"
  - "Croiser deux tables grâce à un descripteur commun"
  - "Utiliser un site de données ouvertes"
prerequis: [snt-donnees/descripteurs]
---

Une table de données ne sert à rien si on ne sait pas l'interroger. Un **tableur** permet de chercher, trier et calculer sans programmer.

## 1. Les quatre opérations

| Opération | Ce qu'elle fait | Exemple |
| --- | --- | --- |
| **Rechercher** | trouver une information précise | la note de Léa |
| **Filtrer** | ne garder que les lignes qui vérifient une condition | les élèves de Lyon |
| **Trier** | ranger les lignes dans un ordre | du meilleur au moins bon |
| **Calculer** | obtenir un résultat à partir des valeurs | la moyenne de la classe |

Attention à la différence : un **filtre** cache des lignes, sans changer leur ordre. Un **tri** garde toutes les lignes, mais change leur ordre.

## 2. Calculer dans un tableur

Dans un tableur, chaque case s'appelle une **cellule** et porte un nom : la lettre de sa colonne et le numéro de sa ligne. `B3` est la cellule de la colonne B, ligne 3.

| | A | B |
| --- | --- | --- |
| **1** | Nom | Note |
| **2** | Léa | 15 |
| **3** | Tom | 9 |
| **4** | Inès | 18 |

Une **formule** commence par `=`. `B2:B4` désigne toutes les cellules de B2 à B4.

| Formule | Ce qu'elle calcule | Résultat |
| --- | --- | --- |
| `=SOMME(B2:B4)` | 15 + 9 + 18 | 42 |
| `=MOYENNE(B2:B4)` | 42 ÷ 3 | 14 |
| `=MAX(B2:B4)` | la plus grande valeur | 18 |
| `=NB.SI(B2:B4;">=10")` | le nombre de notes au moins égales à 10 | 2 |

L'avantage d'une formule : si une note change, le résultat se met à jour tout seul.

## 3. Croiser deux tables

Pourquoi utiliser deux tables plutôt qu'une ? Pour ne pas répéter les mêmes informations. Si le nom d'un élève était recopié sur chaque ligne de chacune de ses notes, il faudrait le corriger partout en cas d'erreur.

On relie deux tables grâce à un **descripteur commun** :

| id | nom |
| --- | --- |
| 1 | Léa |
| 2 | Tom |

| id | sport |
| --- | --- |
| 2 | judo |
| 1 | tennis |

Le descripteur commun est `id`. En associant les lignes qui ont le même `id`, on obtient une information nouvelle : Léa fait du tennis, et Tom du judo.

## 4. Récupérer des données ouvertes

Sur `data.gouv.fr`, on choisit un jeu de données, on lit sa description pour savoir ce que signifie chaque colonne, puis on télécharge souvent un fichier CSV. On l'ouvre ensuite dans un tableur pour le trier, le filtrer et calculer.

## L'essentiel

- Rechercher, filtrer, trier, calculer. Un filtre cache des lignes ; un tri les réordonne.
- Une formule commence par `=` : `SOMME`, `MOYENNE`, `MAX`, `NB.SI`.
- Un descripteur commun permet de croiser deux tables, sans répéter les informations.

## Exercices

::::exercice[Quelle opération ?]{niveau=1 type=associer}
Associe chaque besoin à l'opération correspondante.

| Besoin | Opération |
| --- | --- |
| Ne voir que les films de 2020 | filtrer |
| Classer les films du plus long au plus court | trier |
| Connaître la durée moyenne | calculer |
| Trouver la durée d'un film précis | rechercher |
::::

::::exercice[Des formules]{niveau=1 type=completer}
Les notes sont dans les cellules `C2` à `C9`. Complète les formules.

| Besoin | Formule |
| --- | --- |
| La moyenne | `=`[[MOYENNE]]`(C2:C9)` |
| La meilleure note | `=`[[MAX]]`(C2:C9)` |
| La somme | `=`[[SOMME]]`(C2:C9)` |
::::

::::exercice[Lire une table]{niveau=2 type=reponses}
Voici une table de villes.

| Ville | Région | Habitants |
| --- | --- | --- |
| Lyon | ARA | 520000 |
| Nice | PACA | 340000 |
| Grenoble | ARA | 160000 |
| Marseille | PACA | 870000 |

1. Quelle ville a le plus d'habitants ?

   - Marseille

1. Combien de lignes restent si on filtre la région `ARA` ?

   - 2

1. Quel est le total d'habitants de la région `ARA` ?

   ```python calcul
   print(520000 + 160000)
   ```

   - 680000
   - 680 000

1. Après un tri par habitants croissants, quelle ville arrive en premier ?

   - Grenoble
::::

::::exercice[La bibliothèque]{niveau=3 type=reponses}
Une bibliothèque utilise deux tables.

| id_livre | titre | pages |
| --- | --- | --- |
| 1 | Dune | 900 |
| 2 | Candide | 150 |
| 3 | Persepolis | 370 |

| id_emprunt | id_livre | eleve |
| --- | --- | --- |
| 10 | 3 | Léa |
| 11 | 1 | Tom |
| 12 | 3 | Inès |

1. Quel est le descripteur commun aux deux tables ?

   - id_livre

1. Quel livre Tom a-t-il emprunté ?

   - Dune

1. Quel livre a été emprunté deux fois ?

   - Persepolis

1. Combien de pages au total représentent les trois emprunts ?

   ```python calcul
   print(370 + 900 + 370)
   ```

   - 1640
   - 1 640

1. Quel titre n'a jamais été emprunté ?

   - Candide

1. Dans `=MOYENNE(C2:C4)`, si la colonne C contient les pages, quelle valeur obtient-on, arrondie à l'unité ?

   ```python calcul
   print(round((900 + 150 + 370) / 3))
   ```

   - 473
::::
