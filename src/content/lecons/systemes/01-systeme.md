---
titre: Rôle et architecture d'un système d'exploitation
resume: Ce que fait un système d'exploitation — abstraire le matériel, partager les ressources, protéger — noyau et espace utilisateur, appels système, interruptions, mémoire virtuelle, et un peu d'histoire (Unix, Linux, logiciel libre).
duree: 60
objectifs:
  - Expliquer les rôles d'un système d'exploitation (abstraction, gestion des ressources, protection)
  - Distinguer noyau et espace utilisateur, et décrire un appel système et une interruption
  - Expliquer la mémoire virtuelle et la traduction d'adresses par pagination
  - Situer quelques systèmes (Unix, Linux, Windows, Android) et les enjeux du logiciel libre
prerequis: [architecture/von-neumann]
programme: [asr-os, asr-organisation, nsi1-archi, nsi1-histoire]
cartes:
  - q: Les trois grands rôles d'un système d'exploitation ?
    r: "**Abstraire** le matériel (fichiers, processus, sockets au lieu de secteurs et de registres), **partager** les ressources entre programmes et utilisateurs (processeur, mémoire, périphériques), **protéger** (isoler les programmes, contrôler les accès)."
  - q: Noyau ou espace utilisateur ?
    r: "Le **noyau** s'exécute en mode privilégié (accès à tout le matériel) ; les programmes s'exécutent en mode utilisateur, sans accès direct au matériel : ils passent par des **appels système**."
  - q: Qu'est-ce qu'un appel système ?
    r: "Une demande d'un programme au noyau (ouvrir un fichier, lire, créer un processus, envoyer sur le réseau) : le processeur bascule en mode noyau, le noyau vérifie et exécute, puis rend la main."
  - q: Qu'est-ce qu'une interruption ?
    r: "Un signal (d'un périphérique, d'une horloge, ou d'une erreur) qui suspend le programme en cours pour exécuter une routine du noyau, puis le reprend. L'horloge permet au système de reprendre la main régulièrement."
  - q: À quoi sert la mémoire virtuelle ?
    r: "Chaque processus voit son propre espace d'adresses ; le matériel (MMU) traduit les adresses virtuelles en adresses physiques par pages. Isolation entre processus, et possibilité d'utiliser plus de mémoire que la RAM (pages sur disque)."
  - q: Repères historiques Unix et Linux ?
    r: "Unix : 1969, laboratoires Bell (Thompson, Ritchie), réécrit en C en 1973. Linux : noyau libre créé par Linus Torvalds en 1991 ; associé aux outils GNU (projet de R. Stallman, 1983)."
  - q: Les quatre libertés du logiciel libre ?
    r: "Utiliser le logiciel, étudier son fonctionnement (accès au code source), le redistribuer, le modifier et diffuser les versions modifiées."
---

Un même programme Python tourne sur un PC sous Windows, un Mac, un serveur Linux : il n'a pourtant aucune idée du modèle de disque, de
carte réseau ou de processeur. C'est le **système d'exploitation** (*operating system*, OS) qui fait l'interface entre les programmes et
le matériel, et qui permet à des dizaines de programmes et à plusieurs utilisateurs de partager la même machine sans se gêner.

## 1. Les rôles d'un système d'exploitation

```mermaid legende="Le système d'exploitation entre les applications et le matériel"
flowchart TB
  A["Applications<br/>navigateur, éditeur, Python, jeux…"]
  B["Bibliothèques et utilitaires<br/>(bibliothèque C, shell, interface graphique)"]
  N["Noyau<br/>processus · mémoire · fichiers · réseau · pilotes"]
  M["Matériel<br/>processeur, mémoire, disques, carte réseau, écran"]
  A -->|"appels de fonctions"| B
  B -->|"appels système"| N
  N -->|"instructions privilégiées,<br/>registres des périphériques"| M
  M -.->|"interruptions"| N
```

:::definition
Un **système d'exploitation** est l'ensemble des programmes qui :
- **abstraient** le matériel : les programmes manipulent des **fichiers**, des **processus**, des **connexions réseau**, et non des
  secteurs de disque ou des registres de contrôleurs ;
- **gèrent et partagent les ressources** : temps de processeur (ordonnancement), mémoire, périphériques, espace disque ;
- **protègent** : un programme ne peut pas lire la mémoire d'un autre ni accéder à un fichier sans en avoir le droit.

Son cœur est le **noyau** (*kernel*) ; autour, des bibliothèques, des utilitaires et une interface (shell, interface graphique).
:::

## 2. Noyau, mode utilisateur et appels système

Le processeur a (au moins) deux **modes** : en mode **noyau**, toutes les instructions sont permises (accès aux périphériques, à la
table des pages…) ; en mode **utilisateur**, les instructions dangereuses sont interdites. Les applications tournent en mode
utilisateur : pour lire un fichier, elles font un **appel système**.

```mermaid legende="Ce qui se passe quand un programme Python lit un fichier"
sequenceDiagram
  participant P as Programme (mode utilisateur)
  participant N as Noyau (mode privilégié)
  participant D as Disque
  P->>N: appel système read(fichier, 4096 octets)
  Note over N: vérifie les droits, cherche dans le cache disque
  N->>D: commande de lecture (pilote)
  Note over N: le processus est mis en attente,<br/>un autre s'exécute
  D-->>N: interruption : données prêtes
  N-->>P: copie des données, retour en mode utilisateur
```

```python exec
import os
print("mon numéro de processus :", os.getpid())       # appel système getpid
with open("essai.txt", "w") as f:                    # appels système open, write, close
    f.write("bonjour\n")
print(os.stat("essai.txt").st_size, "octets")         # appel système stat
os.remove("essai.txt")                                # appel système unlink
```

(Dans cette page, Python tourne dans le navigateur : ces appels sont **émulés**. Sur un vrai Linux, la commande `strace python3 script.py`
affiche tous les appels système d'un programme.)

Les **interruptions** permettent au matériel de prévenir le noyau (« données disponibles », « touche pressée ») sans qu'il ait à surveiller
en boucle. L'**horloge** déclenche une interruption plusieurs centaines de fois par seconde : le noyau reprend ainsi régulièrement la main
pour décider quel processus s'exécute (leçon suivante).

## 3. La mémoire virtuelle

Chaque processus croit disposer de toute la mémoire, à partir de l'adresse 0 : ce sont des adresses **virtuelles**. La mémoire est découpée
en **pages** (souvent 4 Kio) ; une **table des pages** propre à chaque processus indique dans quel **cadre** (page physique) se trouve
chaque page. Le circuit **MMU** du processeur fait la traduction à chaque accès.

$$ \text{adresse virtuelle} = (\text{numéro de page}, \text{décalage}) \;\longmapsto\; \text{adresse physique} = \text{cadre} \times \text{taille} + \text{décalage} $$

```python exec
TAILLE_PAGE = 4096
table_des_pages = {0: 5, 1: 2, 2: None, 3: 7}      # page → cadre (None : page absente de la RAM)

def traduire(adresse_virtuelle):
    page, decalage = divmod(adresse_virtuelle, TAILLE_PAGE)
    cadre = table_des_pages.get(page)
    if cadre is None:
        return f"défaut de page (page {page})"
    return cadre * TAILLE_PAGE + decalage

for a in (100, 4100, 9000, 12_300, 20_000):
    print(a, "→", traduire(a))
```

Conséquences : les processus sont **isolés** (aucun n'a d'entrée vers les cadres des autres) ; une page absente déclenche un **défaut de
page** que le noyau traite en la chargeant depuis le disque (zone d'échange, *swap*) — on peut donc utiliser plus de mémoire que la RAM, au
prix d'une grande lenteur si cela arrive souvent ; une page peut être partagée (bibliothèques communes).

## 4. Un peu d'histoire et le logiciel libre

| Année | Repère |
|---|---|
| années 1950-60 | traitement par lots, puis systèmes à temps partagé (plusieurs utilisateurs) |
| 1969 | **Unix** aux laboratoires Bell (Ken Thompson, Dennis Ritchie) ; réécrit en C en 1973, donc portable |
| 1983 | projet **GNU** de Richard Stallman : un système libre compatible Unix ; licence GPL (1989) |
| 1985 | Windows 1.0 (Microsoft), interface graphique au-dessus de MS-DOS |
| 1991 | **Linux** : noyau libre de Linus Torvalds ; avec les outils GNU, un système complet |
| 2001 | Mac OS X, fondé sur un noyau d'origine Unix |
| 2008 | **Android** (noyau Linux) ; aujourd'hui le système le plus répandu au monde |

:::definition[Logiciel libre]
Un logiciel est **libre** si sa licence garantit quatre libertés : l'**utiliser** pour tout usage, **étudier** son fonctionnement (donc
accéder au code source), le **redistribuer**, le **modifier** et diffuser ses modifications. Un logiciel **propriétaire** restreint ces
droits. « Libre » ne veut pas dire « gratuit » (*free as in freedom*), et un logiciel gratuit n'est pas forcément libre.
:::

:::prof
En première NSI : « identifier les fonctions d'un système d'exploitation », « utiliser les commandes de base en ligne de commande »,
« gérer les droits et permissions » ; le programme cite aussi l'histoire et les enjeux des logiciels libres. Pour le concours, il faut
savoir expliquer appel système, mode noyau, interruption, mémoire virtuelle avec précision. Une activité parlante : le gestionnaire des
tâches (ou `top` / `htop`) montre processus, mémoire et charge processeur en direct ; un « live USB » Linux permet d'utiliser un autre
système sans rien installer.
:::

## Exemple guidé

**Problème.** Un processus de 14 000 octets doit être chargé dans une mémoire de pages de 4 096 octets. Combien de pages lui faut-il ?
Quelle place est perdue ? Que vaut l'adresse virtuelle 9 000 si la page 2 est dans le cadre 11 ?

**1. Nombre de pages.** $\lceil 14\,000 / 4\,096 \rceil = \lceil 3{,}42 \rceil = 4$ pages.

**2. Place perdue** (fragmentation interne) : $4 \times 4\,096 - 14\,000 = 2\,384$ octets dans la dernière page. Des pages plus petites
gaspillent moins, mais la table des pages grandit.

**3. Traduction.** $9\,000 = 2 \times 4\,096 + 808$ : page 2, décalage 808 ; adresse physique $11 \times 4\,096 + 808 = 45\,864$.

```python exec
from math import ceil
taille, page = 14_000, 4096
print(ceil(taille / page), "pages,", ceil(taille / page) * page - taille, "octets perdus")
p, d = divmod(9000, page)
print("page", p, "décalage", d, "→", 11 * page + d)
```

Comme la taille d'une page est une puissance de 2, la division se fait en séparant les bits : sur 4 096 = $2^{12}$, les 12 bits de poids
faible sont le décalage, les autres le numéro de page. Le matériel n'a aucune division à faire.

## L'essentiel

- Système d'exploitation : **abstraction** du matériel, **partage** des ressources, **protection** ; son cœur est le **noyau**.
- Mode noyau (privilégié) / mode utilisateur ; les programmes passent par des **appels système** (`open`, `read`, `write`, `fork`…).
- **Interruptions** : le matériel ou l'horloge suspend le programme pour exécuter le noyau ; c'est ainsi que le système reprend la main.
- **Mémoire virtuelle** par pagination : adresse = (page, décalage), table des pages par processus, MMU, défaut de page ; isolation et swap.
- Repères : Unix (1969), GNU (1983), Linux (1991), Android (2008) ; logiciel libre = 4 libertés.

## Exercices

::::exercice[Le rôle du noyau]{niveau=1}
Un programme veut écrire dans un fichier. Que se passe-t-il ?

- [ ] Il écrit directement sur le disque en envoyant des commandes au contrôleur
- [x] Il fait un appel système ; le noyau vérifie les droits et réalise l'écriture
- [ ] Il demande à un autre programme de le faire à sa place
- [ ] Il copie le fichier dans la mémoire du noyau, qui l'écrit plus tard s'il le veut bien

:::corrige
En mode utilisateur, l'accès direct au matériel est interdit : le programme demande au noyau par un **appel système**, et le noyau
contrôle les droits avant d'agir (protection).
:::
::::

::::exercice[Libre ou gratuit]{niveau=1}
Parmi ces affirmations, laquelle est exacte ?

- [ ] Un logiciel gratuit est forcément libre
- [ ] Un logiciel libre est forcément gratuit et sans licence
- [x] Un logiciel libre garantit le droit d'étudier son code source et de le modifier
- [ ] Linux est un logiciel propriétaire de la société de Linus Torvalds

:::corrige
La liberté porte sur les droits (utiliser, étudier, redistribuer, modifier), pas sur le prix ; un logiciel libre a bien une licence (GPL,
MIT…). Linux est distribué sous licence GPL.
:::
::::

::::exercice[Traduire une adresse]{niveau=2}
Écris `traduire(adresse, table, taille_page)` qui renvoie l'adresse physique correspondant à une adresse virtuelle, ou lève
`LookupError` si la page n'est pas en mémoire (absente de la table ou associée à `None`).

```python depart
def traduire(adresse, table, taille_page):
    ...
```

```python tests
table = {0: 5, 1: 2, 2: None, 3: 7}
assert traduire(100, table, 4096) == 5 * 4096 + 100, "page 0"
assert traduire(4100, table, 4096) == 2 * 4096 + 4, "page 1"
assert traduire(3 * 1024 + 5, {3: 0}, 1024) == 5, "autre taille de page"
for a in (9000, 50_000):
    try:
        traduire(a, table, 4096)
        ok = False
    except LookupError:
        ok = True
    assert ok, "défaut de page"
```

:::corrige
```python solution
def traduire(adresse, table, taille_page):
    page, decalage = divmod(adresse, taille_page)
    cadre = table.get(page)
    if cadre is None:
        raise LookupError(f"défaut de page : page {page}")
    return cadre * taille_page + decalage
```
`divmod` sépare numéro de page et décalage ; le décalage est **conservé** : seule la page change de place.
:::
::::

::::exercice[Remplacement de pages]{niveau=3}
La RAM ne peut contenir que `k` pages. Quand une page demandée est absente (défaut de page) et que la RAM est pleine, on évince la page
**arrivée en premier** (FIFO). Écris `defauts_fifo(references, k)` qui renvoie le nombre de défauts de page pour la suite de pages
`references`.

```python depart
from collections import deque

def defauts_fifo(references, k):
    ...
```

```python tests
r = [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5]
assert defauts_fifo([1, 2, 1, 2, 1], 2) == 2, "tout tient en mémoire"
assert defauts_fifo([1, 2, 3, 1], 2) == 4, "éviction FIFO"
assert defauts_fifo(r, 3) == 9, "suite de Belady, 3 cadres"
assert defauts_fifo(r, 4) == 10, "anomalie de Belady : plus de cadres, plus de défauts"
```

:::corrige
```python solution
from collections import deque

def defauts_fifo(references, k):
    memoire, ordre, defauts = set(), deque(), 0
    for p in references:
        if p not in memoire:
            defauts += 1
            if len(memoire) == k:
                memoire.discard(ordre.popleft())
            memoire.add(p)
            ordre.append(p)
    return defauts
```
Le dernier test illustre l'**anomalie de Belady** (1969) : avec FIFO, ajouter de la mémoire peut **augmenter** le nombre de défauts. Les
algorithmes comme LRU (moins récemment utilisée) n'ont pas ce défaut ; les systèmes réels utilisent des approximations de LRU.
:::
::::

::::exercice[Expliquer la protection]{niveau=4 duree=20}
Un élève demande : « Pourquoi un virus qui tourne sur mon compte ne peut-il pas simplement lire la mémoire de mon navigateur pour voler
mes mots de passe ? Et pourquoi un programme planté ne fait-il pas planter tout l'ordinateur ? »

1. Répondez en mobilisant le mode noyau / utilisateur et la mémoire virtuelle.
2. Nuancez : dans quels cas ces protections ne suffisent-elles pas ?
3. Proposez une analogie utilisable en classe, et dites où elle trouve ses limites.

:::criteres
- Mémoire virtuelle : chaque processus a sa table des pages, aucune entrée vers la mémoire des autres ; un accès hors de son espace provoque une erreur (le processus fautif est arrêté, pas le système).
- Mode utilisateur : instructions privilégiées et accès directs au matériel interdits ; tout passe par les appels système, contrôlés par le noyau (droits).
- Nuances : un programme lancé par le même utilisateur a ses droits (fichiers, appels de débogage), failles du noyau ou du matériel, compte administrateur, pilotes en mode noyau.
- Analogie pertinente (immeuble et appartements avec gardien, guichet de banque…) et limites explicitées.
:::

:::corrige
1. Chaque processus a son **propre espace d'adresses virtuelles** : sa table des pages ne contient aucune entrée vers les cadres du
   navigateur. Une adresse « du navigateur » n'a donc aucun sens pour le virus : elle désigne une page à lui, ou une page absente, et
   un accès invalide déclenche une erreur (« segmentation fault ») qui arrête **le seul processus fautif**. Le virus ne peut pas modifier
   les tables des pages ni parler directement au matériel : ces opérations exigent le **mode noyau**, et il n'en dispose qu'à travers les
   appels système, que le noyau contrôle. De même, un programme planté ne corrompt que sa propre mémoire : le noyau le termine et
   continue.
2. Ces protections séparent les **processus**, pas les **intentions** : un programme lancé sur le compte de l'utilisateur a ses droits —
   il peut lire ses fichiers (dont la base de mots de passe du navigateur si elle n'est pas chiffrée), utiliser les appels système de
   débogage (lire la mémoire d'un processus du même utilisateur, si le système le permet), enregistrer les frappes via l'interface
   graphique. Avec les droits d'administrateur, ou grâce à une faille du noyau, d'un pilote ou du processeur (Meltdown, Spectre en 2018),
   il peut contourner l'isolation. D'où les mises à jour, les comptes non administrateurs, le bac à sable des navigateurs.
3. Analogie : un **immeuble** dont chaque appartement (processus) a sa propre numérotation de pièces (adresses virtuelles) ; seul le
   **gardien** (noyau) a le passe-partout et le plan réel ; pour toute demande (eau, électricité, courrier : appels système), on passe par
   lui. Limites : dans l'immeuble, rien n'empêche physiquement de frapper chez le voisin, alors que la MMU rend l'accès **impossible** et
   non simplement interdit ; et l'analogie cache que le « gardien » est lui-même un programme qui peut avoir des failles.
:::
::::
