---
titre: Commandes et droits d'accès
resume: "Se déplacer dans les dossiers, manipuler des fichiers en ligne de commande et gérer les droits."
duree: 40
objectifs:
  - "Utiliser les commandes de base en ligne de commande"
  - "Écrire un chemin absolu ou relatif"
  - "Lire et modifier les droits d'un fichier"
prerequis: [premiere-architecture/systeme]
---

Sous Linux, on peut tout faire au clavier, dans un **terminal**.

## 1. Chemins

Les fichiers forment un arbre dont la **racine** est `/`.

- **Chemin absolu** : depuis la racine, `/home/lea/nsi/tp1.py`.
- **Chemin relatif** : depuis le dossier courant, `nsi/tp1.py`.
- `..` désigne le dossier parent, `.` le dossier courant.

## 2. Commandes

| Commande | Effet |
| --- | --- |
| `pwd` | afficher le dossier courant |
| `ls` | lister le contenu (`ls -l` : avec les droits) |
| `cd` | changer de dossier |
| `mkdir` | créer un dossier |
| `touch` | créer un fichier vide |
| `cat` | afficher un fichier |
| `cp` | copier |
| `mv` | déplacer ou renommer |
| `rm` | supprimer définitivement |
| `chmod` | changer les droits |

## 3. Les droits

```
-rwxr-x---  lea  eleves  jeu.py
```

- Le premier caractère indique le type : `-` fichier, `d` dossier.
- Ensuite, trois groupes de trois lettres : le **propriétaire**, le **groupe**, les **autres**.
- `r` lire, `w` écrire, `x` exécuter.

Avec `chmod`, on compte : r = 4, w = 2, x = 1.

:::exemple
`chmod 750 jeu.py` : 7 = rwx, 5 = r-x, 0 = ---. Le résultat est `rwxr-x---`.
:::

## L'essentiel

- Chemin absolu : depuis `/`. Chemin relatif : depuis le dossier courant. `..` : le parent.
- `ls`, `cd`, `mkdir`, `cp`, `mv`, `rm`, `cat`, `chmod`.
- Droits : propriétaire, groupe, autres ; r = 4, w = 2, x = 1.

## Exercices

::::exercice[QCM : commandes et droits]{niveau=1 type=quiz}
Une question à la fois : la correction s'affiche aussitôt.

1. Que fait la commande `cd ..` ?

   - [ ] elle supprime le répertoire courant
   - [x] elle remonte au répertoire parent
   - [ ] elle va à la racine
   - [ ] elle liste les fichiers

   > `..` désigne le répertoire parent.

1. On est dans `/home/lea`. Quel est le chemin absolu de `nsi/tp1.py` ?

   - [ ] `/nsi/tp1.py`
   - [x] `/home/lea/nsi/tp1.py`
   - [ ] `~/tp1.py`
   - [ ] `../nsi/tp1.py`

   > On ajoute le chemin du répertoire courant devant le chemin relatif.

1. On est dans `/home/lea/nsi`. Quel chemin relatif mène à `/home/tom` ?

   - [ ] `tom`
   - [ ] `../tom`
   - [x] `../../tom`
   - [ ] `/tom`

   > `..` mène à `/home/lea`, `../..` à `/home`.

1. Quelle commande renomme `brouillon.py` en `final.py` ?

   - [ ] `cp brouillon.py final.py`
   - [x] `mv brouillon.py final.py`
   - [ ] `rm brouillon.py final.py`
   - [ ] `rename final.py`

   > `mv` déplace ou renomme ; `cp` ferait une copie en gardant l'original.

1. Que devient un fichier supprimé avec `rm` ?

   - [ ] il va dans la corbeille
   - [x] il est supprimé définitivement
   - [ ] il est caché
   - [ ] il est compressé

   > Il n'y a pas de corbeille en ligne de commande.

1. Dans `-rw-r-----`, que peut faire le groupe ?

   - [ ] lire et écrire
   - [x] seulement lire
   - [ ] rien
   - [ ] lire et exécuter

   > Deuxième triplet : `r--`.

1. Quels droits donne `chmod 755 script.sh` ?

   - [x] `rwxr-xr-x`
   - [ ] `rwxrwxrwx`
   - [ ] `rw-r--r--`
   - [ ] `r-xr-xr-x`

   > 7 = rwx, 5 = r-x.

1. Quel nombre correspond à `rw-r--r--` ?

   - [ ] 755
   - [x] 644
   - [ ] 600
   - [ ] 466

   > 6 = 4 + 2, puis 4 et 4.

1. Que signifie le `d` au début de `drwxr-xr-x` ?

   - [ ] droits du groupe
   - [x] c'est un répertoire
   - [ ] le fichier est supprimé
   - [ ] le fichier est un document

   > `-` pour un fichier ordinaire, `d` pour un répertoire.

::::

::::exercice[Quelle commande ?]{niveau=1 type=reponses}
Écris la commande complète.

1. Se déplacer dans le dossier `nsi`.

   - cd nsi

1. Créer un dossier `projet`.

   - mkdir projet

1. Afficher le contenu du fichier `notes.txt`.

   - cat notes.txt

1. Renommer `a.py` en `b.py`.

   - mv a.py b.py

1. Donner les droits `rw-r--r--` au fichier `f.txt`, en notation chiffrée.

   - chmod 644 f.txt
::::

::::exercice[Lire et écrire des droits]{niveau=1 type=completer}
Complète le tableau.

| Droits | Nombre |
| --- | --- |
| `rwxrwxrwx` | [[777]] |
| `rw-r-----` | [[640]] |
| [[rwxr-xr-x]] | 755 |
| [[rw-------]] | 600 |
::::

::::exercice[Une session au terminal]{niveau=1}
Lea est dans `/home/lea`, qui contient le seul fichier `photo.jpg`. Elle tape dans l'ordre : `mkdir nsi`, `cd nsi`, `touch tp1.py`,
`cp tp1.py tp2.py`, `mv ../photo.jpg .`, `cd ..`, `ls`. Dessine l'arborescence de `/home/lea` à la fin et donne l'affichage de `ls`.
Puis écris la commande qui retire aux autres tout droit sur `tp2.py`, sans toucher aux autres droits.

:::criteres
- Arborescence finale : `/home/lea/nsi` contient `tp1.py`, `tp2.py`, `photo.jpg` ; `/home/lea` ne contient plus que `nsi`.
- `ls` affiche seulement `nsi`.
- Commande : `chmod o-rwx nsi/tp2.py` (ou équivalent, chemin correct depuis `/home/lea`).
:::

:::corrige
`mkdir nsi` crée le répertoire, `cd nsi` y entre, `touch tp1.py` crée un fichier vide, `cp` en fait une copie `tp2.py`, `mv ../photo.jpg .`
**déplace** la photo du répertoire parent vers le répertoire courant (`.`), puis `cd ..` revient dans `/home/lea`.

```
/home/lea
└── nsi
    ├── photo.jpg
    ├── tp1.py
    └── tp2.py
```

`ls` affiche seulement `nsi`. Pour retirer tous les droits aux autres : `chmod o-rwx nsi/tp2.py` (le chemin est relatif à `/home/lea`). La
notation octale ne convient pas ici sans connaître les droits actuels, car elle fixe les trois catégories à la fois.
:::
::::
