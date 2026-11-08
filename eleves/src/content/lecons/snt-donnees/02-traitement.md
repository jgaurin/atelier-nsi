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

Une table devient utile quand on l'interroge. Un **tableur** permet de le faire sans programmer.

## 1. Les opérations

| Opération | Exemple |
| --- | --- |
| **Rechercher** | trouver la note de Léa |
| **Filtrer** | garder les élèves de Lyon |
| **Trier** | classer par note décroissante |
| **Calculer** | obtenir la moyenne des notes |

Un filtre **cache** des lignes. Un tri les **réordonne**.

## 2. Dans un tableur

| | A | B |
| --- | --- | --- |
| **1** | Nom | Note |
| **2** | Léa | 15 |
| **3** | Tom | 9 |
| **4** | Inès | 18 |

| Formule | Résultat |
| --- | --- |
| `=SOMME(B2:B4)` | 42 |
| `=MOYENNE(B2:B4)` | 14 |
| `=MAX(B2:B4)` | 18 |
| `=NB.SI(B2:B4;">=10")` | 2 |

## 3. Croiser deux tables

Deux tables qui partagent un **descripteur commun** peuvent être croisées. On évite ainsi de répéter les mêmes informations.

| id | nom |
| --- | --- |
| 1 | Léa |
| 2 | Tom |

| id | sport |
| --- | --- |
| 2 | judo |
| 1 | tennis |

Grâce à `id`, on sait que Léa fait du tennis et Tom du judo.

## 4. Récupérer des données ouvertes

Sur `data.gouv.fr`, on choisit un jeu de données, on lit sa description, puis on télécharge souvent un fichier CSV à ouvrir dans un tableur.

## L'essentiel

- Rechercher, filtrer, trier, calculer.
- Formules : `SOMME`, `MOYENNE`, `MAX`, `NB.SI`.
- Un descripteur commun permet de croiser deux tables.

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
