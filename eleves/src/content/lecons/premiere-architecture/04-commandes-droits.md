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

Sous Linux, on peut tout faire au clavier, dans un **terminal** : se déplacer dans les dossiers, créer des fichiers, les copier, changer qui a le droit de les lire. C'est souvent plus rapide qu'à la souris, et indispensable sur un serveur, qui n'a pas d'écran.

## 1. L'arborescence et les chemins

Les fichiers forment un **arbre**. Sa racine s'écrit `/`.

```
/
└── home
    ├── lea
    │   └── nsi
    │       └── tp1.py
    └── tom
```

Un **chemin** indique où se trouve un fichier :

- un chemin **absolu** part de la racine : `/home/lea/nsi/tp1.py` ;
- un chemin **relatif** part du **dossier courant**, celui où l'on se trouve. Depuis `/home/lea`, le même fichier s'écrit `nsi/tp1.py`.

Deux raccourcis : `.` désigne le dossier courant, et `..` le dossier **parent**, juste au-dessus. Depuis `/home/lea/nsi`, le chemin `../../tom` mène à `/home/tom` : on remonte deux fois, puis on descend dans `tom`.

## 2. Les commandes de base

| Commande | Effet | Exemple |
| --- | --- | --- |
| `pwd` | afficher le dossier courant | `pwd` |
| `ls` | lister le contenu d'un dossier | `ls -l` affiche aussi les droits |
| `cd` | changer de dossier | `cd nsi`, `cd ..` |
| `mkdir` | créer un dossier | `mkdir projet` |
| `touch` | créer un fichier vide | `touch notes.txt` |
| `cat` | afficher le contenu d'un fichier | `cat notes.txt` |
| `cp` | copier | `cp a.py b.py` |
| `mv` | déplacer ou renommer | `mv brouillon.py final.py` |
| `rm` | supprimer, **définitivement** | `rm vieux.txt` |
| `chmod` | changer les droits | `chmod 750 jeu.py` |

:::attention
`rm` ne passe pas par une corbeille : le fichier est supprimé définitivement.
:::

## 3. Les droits d'accès

`ls -l` affiche par exemple :

```
-rwxr-x---  lea  eleves  jeu.py
```

On lit les dix premiers caractères ainsi :

| `-` | `rwx` | `r-x` | `---` |
| --- | --- | --- | --- |
| type : `-` fichier, `d` dossier | la propriétaire, lea | le groupe `eleves` | tous les autres |

Dans chaque groupe de trois lettres : `r` permet de **lire**, `w` d'**écrire** (modifier), `x` d'**exécuter**. Un tiret signifie que le droit est refusé.

Ici, lea peut tout faire ; les membres du groupe `eleves` peuvent lire et exécuter, mais pas modifier ; les autres ne peuvent rien faire.

## 4. Changer les droits avec chmod

On code chaque groupe de trois lettres par un chiffre, en additionnant : **r = 4, w = 2, x = 1**.

| Droits | Calcul | Chiffre |
| --- | --- | --- |
| `rwx` | 4 + 2 + 1 | 7 |
| `r-x` | 4 + 0 + 1 | 5 |
| `rw-` | 4 + 2 + 0 | 6 |
| `r--` | 4 + 0 + 0 | 4 |
| `---` | 0 | 0 |

`chmod 750 jeu.py` donne donc `rwx` à la propriétaire, `r-x` au groupe et `---` aux autres : on retrouve `rwxr-x---`.

## L'essentiel

- Chemin absolu : depuis `/`. Chemin relatif : depuis le dossier courant. `..` : le dossier parent.
- `pwd`, `ls`, `cd`, `mkdir`, `touch`, `cat`, `cp`, `mv`, `rm`, `chmod`.
- Droits : propriétaire, groupe, autres ; `r` lire, `w` écrire, `x` exécuter.
- Avec chmod : r = 4, w = 2, x = 1, et un chiffre par groupe.

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

1. Quelle commande renomme `brouillon.py` en `final.py` ?

   - [ ] `cp brouillon.py final.py`
   - [x] `mv brouillon.py final.py`
   - [ ] `rm brouillon.py final.py`
   - [ ] `rename final.py`

   > `mv` déplace ou renomme ; `cp` ferait une copie en gardant l'original.

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

::::exercice[Une session au terminal]{niveau=2}
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

::::exercice[Le dossier d'un projet]{niveau=3 type=reponses}
Ana est dans `/home/ana/projet`. La commande `ls -l` affiche :

```
-rwxr-x---  ana  eleves  jeu.py
-rw-r--r--  ana  eleves  notes.txt
drwxr-xr-x  ana  eleves  images
```

Tom appartient au groupe `eleves`. Zoé n'y appartient pas.

1. Tom peut-il exécuter `jeu.py` ? Réponds par oui ou par non.

   - oui

1. Tom peut-il modifier `notes.txt` ? Réponds par oui ou par non.

   - non

1. Zoé peut-elle lire `jeu.py` ? Réponds par oui ou par non.

   - non

1. Quel nombre correspond aux droits de `jeu.py` ?

   - 750

1. Écris la commande qui retire aux autres le droit de lire `notes.txt`, sans changer les autres droits.

   - chmod 640 notes.txt

1. Quel est le chemin absolu du dossier `images` ?

   - /home/ana/projet/images

1. Depuis le dossier `images`, quel chemin relatif mène à `jeu.py` ?

   - ../jeu.py

1. Depuis `projet`, écris la commande qui copie `notes.txt` dans `images`.

   - cp notes.txt images
   - cp notes.txt images/
::::
