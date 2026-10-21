---
titre: Système d'exploitation et commandes
resume: "Le cours de première NSI sur les systèmes d'exploitation : rôle de l'OS, logiciels libres et propriétaires, arborescence de fichiers, chemins absolus et relatifs, commandes de base du terminal Linux (ls, cd, mkdir, cp, mv, rm, cat), utilisateurs, groupes et droits d'accès (rwx, chmod)."
duree: 50
objectifs:
  - "Expliquer le rôle d'un système d'exploitation"
  - "Se déplacer dans une arborescence avec des chemins absolus et relatifs"
  - "Utiliser les commandes de base du terminal"
  - "Lire et modifier les droits d'accès d'un fichier"
prerequis: [nsi-premiere/von-neumann]
programme: [nsi1-archi]
cartes:
  - q: "Rôle d'un système d'exploitation ?"
    r: "Faire l'intermédiaire entre les **programmes** et le **matériel** : gérer le processeur (partage entre programmes), la mémoire, les fichiers, les périphériques et les utilisateurs (droits)."
  - q: "Chemin absolu ou relatif ?"
    r: "**Absolu** : depuis la racine `/` (`/home/lea/nsi/tp1.py`). **Relatif** : depuis le répertoire courant (`nsi/tp1.py`, `../tom`). `..` = répertoire parent, `.` = répertoire courant."
  - q: "Que font ls, cd, mkdir, cp, mv, rm, cat ?"
    r: "Lister, changer de répertoire, créer un répertoire, copier, déplacer/renommer, supprimer, afficher le contenu d'un fichier."
  - q: "Que signifie -rwxr-x--- ?"
    r: "Un fichier (`-`) ; le **propriétaire** peut lire, écrire, exécuter (rwx) ; le **groupe** peut lire et exécuter (r-x) ; les **autres** n'ont aucun droit (---)."
  - q: "Que fait chmod 640 notes.txt ?"
    r: "6 = rw- pour le propriétaire, 4 = r-- pour le groupe, 0 = --- pour les autres (r = 4, w = 2, x = 1)."
  - q: "Logiciel libre ?"
    r: "Un logiciel qu'on peut **utiliser, étudier (code source), modifier et redistribuer** librement (Linux, Firefox, Python). Un logiciel propriétaire restreint ces libertés (Windows, macOS)."
---

Entre le matériel vu au chapitre précédent et nos programmes, il y a une couche logicielle indispensable : le **système d'exploitation** (OS).
En première, on apprend son rôle et on prend en main le **terminal**, l'outil de base pour manipuler fichiers et droits, sur un système de type
Linux.

## Ce que dit le programme

Contenus : *systèmes d'exploitation*. Capacités attendues : **identifier les fonctions d'un système d'exploitation** ; **utiliser les commandes
de base en ligne de commande** ; **gérer les droits et permissions d'accès aux fichiers**. Le programme cite l'histoire des systèmes (Unix,
Linux, Windows) et la question des **logiciels libres**.

## 1. Le rôle du système d'exploitation

Le système d'exploitation est le **chef d'orchestre** de la machine. Il gère :

- le **processeur** : plusieurs programmes semblent tourner en même temps, l'OS leur attribue le processeur à tour de rôle (vu en terminale
  avec les processus) ;
- la **mémoire** : chaque programme reçoit sa zone, sans empiéter sur les autres ;
- les **fichiers** : leur organisation sur le disque en arborescence ;
- les **périphériques** (clavier, écran, imprimante) grâce aux **pilotes** ;
- les **utilisateurs** et leurs **droits**.

Les programmes ne parlent pas directement au matériel : ils demandent à l'OS (appels système). Exemples : **Linux** (serveurs, Android),
**Windows**, **macOS** et **iOS** (dérivés d'Unix).

:::remarque[Libre et propriétaire]
Un **logiciel libre** garantit quatre libertés : l'utiliser, **étudier** son code source, le **modifier**, le **redistribuer** (Linux, Firefox,
LibreOffice, Python). Un logiciel **propriétaire** ne donne pas accès à son code ou en limite l'usage (Windows, macOS). Unix naît en 1969 aux
Bell Labs ; Linux est créé par Linus Torvalds en 1991 et le projet GNU par Richard Stallman en 1983.
:::

## 2. L'arborescence de fichiers

Sous Linux, tous les fichiers sont rangés dans un **arbre** unique dont la **racine** est `/` :

```
/
├── bin
├── etc
└── home
    ├── lea
    │   ├── nsi
    │   │   └── tp1.py
    │   └── photo.jpg
    └── tom
```

- Le **chemin absolu** part de la racine : `/home/lea/nsi/tp1.py`.
- Le **chemin relatif** part du **répertoire courant**. Si l'on est dans `/home/lea` : `nsi/tp1.py`. Depuis `/home/lea/nsi`, la photo est
  `../photo.jpg`.
- `.` désigne le répertoire courant, `..` le répertoire **parent**, `~` le répertoire personnel.

## 3. Les commandes de base

Dans un **terminal**, on tape des commandes interprétées par le **shell** (bash) :

| Commande | Effet | Exemple |
| --- | --- | --- |
| `pwd` | afficher le répertoire courant | `pwd` → `/home/lea` |
| `ls` | lister le contenu (`ls -l` : détails et droits) | `ls -l nsi` |
| `cd` | changer de répertoire | `cd nsi`, `cd ..`, `cd ~` |
| `mkdir` | créer un répertoire | `mkdir projet` |
| `touch` | créer un fichier vide | `touch notes.txt` |
| `cat` | afficher le contenu d'un fichier | `cat tp1.py` |
| `cp` | copier | `cp tp1.py tp1_sauvegarde.py` |
| `mv` | déplacer ou renommer | `mv photo.jpg nsi/` |
| `rm` | supprimer (définitivement !) | `rm brouillon.txt` |
| `rmdir` | supprimer un répertoire vide | `rmdir vieux` |
| `chmod` | changer les droits | `chmod 644 notes.txt` |

Exemple de session :

```bash
cd ~
mkdir projet
cd projet
touch main.py
ls -l
cd ..
```

:::attention[rm ne passe pas par la corbeille]
Un fichier supprimé avec `rm` est **perdu**. `rm -r` supprime un répertoire et tout son contenu : à manier avec précaution.
:::

## 4. Utilisateurs, groupes et droits

Chaque fichier appartient à un **propriétaire** et à un **groupe**. Les droits sont donnés à trois catégories : le **propriétaire** (u), le
**groupe** (g) et les **autres** (o). Pour chacune : lecture **r**, écriture **w**, exécution **x** (pour un répertoire, x permet d'y entrer).

```
-rwxr-x---  1 lea  eleves  2048 sept. 14 10:00 jeu.py
drwxr-xr-x  2 lea  eleves  4096 sept. 14 10:00 nsi
```

Le premier caractère indique le type (`-` fichier, `d` répertoire), puis trois groupes de trois lettres.

`chmod` modifie les droits, en notation **octale** : r = 4, w = 2, x = 1, et on additionne pour chaque catégorie.

| Droits | Calcul | Chiffre |
| --- | --- | --- |
| `rwx` | 4 + 2 + 1 | 7 |
| `rw-` | 4 + 2 | 6 |
| `r-x` | 4 + 1 | 5 |
| `r--` | 4 | 4 |
| `---` | 0 | 0 |

Ainsi `chmod 750 jeu.py` donne `rwxr-x---`. On peut aussi écrire `chmod u+x jeu.py` (ajouter l'exécution au propriétaire) ou `chmod o-r
notes.txt` (retirer la lecture aux autres).

L'administrateur, **root**, a tous les droits ; on utilise `sudo` pour agir en son nom.

```python exec
def octal(droits):
    """'rwxr-x---' -> 750"""
    valeurs = {"r": 4, "w": 2, "x": 1, "-": 0}
    resultat = 0
    for k in range(3):
        chiffre = 0
        for i in range(3):
            chiffre = chiffre + valeurs[droits[3 * k + i]]
        resultat = resultat * 10 + chiffre
    return resultat

print(octal("rwxr-x---"), octal("rw-r--r--"))
```

## Les erreurs classiques des élèves

:::attention[Ce que tu verras en classe]
- **Confondre chemin absolu et relatif** : `cd home` au lieu de `cd /home`.
- **Oublier les espaces** : `cd..` au lieu de `cd ..`.
- **Croire que `rm` envoie à la corbeille.**
- **Mal lire les droits** : `r-x` pour le groupe et non pour le propriétaire ; oublier le premier caractère `d`/`-`.
- **Additionner mal** : `rw-` vaut 6, pas 3.
- **Confondre système d'exploitation et logiciel** (« Chrome est mon système d'exploitation »).
:::

## En classe

:::methode[Activités qui marchent]
1. **Terminus** (jeu d'aventure en ligne de commande) ou un **terminal en ligne** pour découvrir `cd`, `ls`, `cat` sans risque.
2. **Chasse au trésor** dans une arborescence préparée : chaque fichier donne le chemin relatif du suivant.
3. **Droits en binôme** sur un serveur du lycée : un élève crée un fichier, l'autre essaie de le lire ; on modifie avec `chmod`.
4. **Débat** sur les logiciels libres et l'histoire d'Unix et Linux.
:::

## L'essentiel

- L'**OS** gère processeur, mémoire, fichiers, périphériques et utilisateurs ; il fait l'intermédiaire entre programmes et matériel.
- **Libre** (utiliser, étudier, modifier, redistribuer) / **propriétaire**.
- **Arborescence** depuis `/` ; chemin **absolu** (depuis `/`) ou **relatif** (depuis le répertoire courant ; `..` = parent).
- Commandes : `pwd`, `ls`, `cd`, `mkdir`, `touch`, `cat`, `cp`, `mv`, `rm`, `chmod`.
- **Droits** rwx pour propriétaire, groupe, autres ; **octal** r = 4, w = 2, x = 1 (`chmod 754`).

## Exercices

::::exercice[Grand QCM : système d'exploitation]{niveau=1 type=quiz}
Douze questions sur le système et le terminal.

1. Lequel de ces logiciels est un système d'exploitation ?

   - [ ] Firefox
   - [x] Linux
   - [ ] Python
   - [ ] LibreOffice

   > Les autres sont des applications qui tournent sur un système d'exploitation.

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

1. Laquelle n'est **pas** une fonction du système d'exploitation ?

   - [ ] partager le processeur entre les programmes
   - [ ] gérer les droits des utilisateurs
   - [x] corriger l'orthographe d'un texte
   - [ ] organiser les fichiers sur le disque

   > C'est le rôle d'une application.

1. Un logiciel libre est un logiciel :

   - [ ] forcément gratuit et sans auteur
   - [x] dont on peut étudier, modifier et redistribuer le code source
   - [ ] sans licence
   - [ ] qui ne fonctionne que sous Linux

   > « Libre » parle de libertés, pas de prix.
::::

::::exercice[Des droits à l'octal]{niveau=1}
Écris `octal(droits)` qui convertit une chaîne de 9 caractères comme `"rwxr-x---"` en l'entier `750`, puis `lettres(n)` qui fait l'inverse :
`lettres(644)` renvoie `"rw-r--r--"`.

```python depart
def octal(droits):
    ...

def lettres(n):
    ...
```

```python tests
assert octal("rwxr-x---") == 750, "750"
assert octal("rw-r--r--") == 644, "644"
assert octal("---------") == 0, "aucun droit"
assert lettres(644) == "rw-r--r--", "644 en lettres"
assert lettres(751) == "rwxr-x--x", "751 en lettres"
assert lettres(octal("r-x-w--wx")) == "r-x-w--wx", "aller-retour"
```

:::corrige
```python solution
def octal(droits):
    valeurs = {"r": 4, "w": 2, "x": 1, "-": 0}
    resultat = 0
    for k in range(3):
        chiffre = 0
        for i in range(3):
            chiffre = chiffre + valeurs[droits[3 * k + i]]
        resultat = resultat * 10 + chiffre
    return resultat

def lettres(n):
    chiffres = [n // 100, (n // 10) % 10, n % 10]
    resultat = ""
    for c in chiffres:
        for lettre, valeur in (("r", 4), ("w", 2), ("x", 1)):
            if c >= valeur:
                resultat = resultat + lettre
                c = c - valeur
            else:
                resultat = resultat + "-"
    return resultat
```

Pour `lettres`, on décompose chaque chiffre en 4 + 2 + 1, comme une écriture en base 2 sur trois bits : 6 = 110 donne `rw-`.
:::
::::

::::exercice[Résoudre un chemin relatif]{niveau=2}
Écris `absolu(courant, relatif)` qui renvoie le chemin absolu obtenu en partant du répertoire `courant` (chemin absolu sans `/` final, `"/"`
pour la racine) et en suivant le chemin `relatif`, qui peut contenir des `..` et des `.`.

```python depart
def absolu(courant, relatif):
    ...
```

```python tests
assert absolu("/home/lea", "nsi/tp1.py") == "/home/lea/nsi/tp1.py", "descendre"
assert absolu("/home/lea/nsi", "../photo.jpg") == "/home/lea/photo.jpg", "remonter"
assert absolu("/home/lea/nsi", "../../tom") == "/home/tom", "remonter deux fois"
assert absolu("/home", "./lea/../tom") == "/home/tom", "point et point-point"
assert absolu("/", "etc") == "/etc", "depuis la racine"
assert absolu("/home", "..") == "/", "jusqu'à la racine"
```

:::corrige
```python solution
def absolu(courant, relatif):
    pile = [r for r in courant.split("/") if r != ""]
    for morceau in relatif.split("/"):
        if morceau == "..":
            if len(pile) > 0:
                pile.pop()
        elif morceau != "." and morceau != "":
            pile.append(morceau)
    return "/" + "/".join(pile)
```

On représente le chemin courant par la liste des répertoires depuis la racine ; `..` retire le dernier, un nom l'ajoute. C'est ce que fait le
shell à chaque `cd`.
:::
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
