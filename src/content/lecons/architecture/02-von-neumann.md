---
titre: L'architecture de von Neumann
resume: Comment un ordinateur exécute un programme — processeur (unité de commande, UAL, registres), mémoire, bus et entrées-sorties, cycle d'instruction, hiérarchie mémoire, multicœurs et systèmes sur puce.
duree: 65
objectifs:
  - Décrire les composants de l'architecture de von Neumann et leur rôle
  - Dérouler le cycle chargement – décodage – exécution d'une instruction
  - Expliquer la hiérarchie mémoire et calculer un temps d'accès moyen avec un cache
  - Situer les évolutions (multicœurs, GPU, systèmes sur puce) et quelques repères historiques
prerequis: [architecture/circuits, representation/memoire]
programme: [asr-von-neumann, asr-organisation, nsi1-archi, nsit-archi, nsi1-histoire]
cartes:
  - q: Idée centrale de l'architecture de von Neumann (1945) ?
    r: "Le **programme est stocké en mémoire**, au même titre que les données, sous forme de nombres : la machine lit ses instructions en mémoire une à une."
  - q: Les composants de l'architecture de von Neumann ?
    r: "Un **processeur** (unité de commande + unité arithmétique et logique + registres), une **mémoire** (programme et données), des **entrées-sorties**, reliés par des **bus** (adresses, données, contrôle)."
  - q: Le cycle d'une instruction ?
    r: "**Chargement** (lire en mémoire l'instruction à l'adresse du compteur ordinal, l'incrémenter), **décodage** (déterminer l'opération et les opérandes), **exécution** (UAL, accès mémoire, saut)."
  - q: Rôle du compteur ordinal (PC) ?
    r: "Registre qui contient l'adresse de la **prochaine instruction** ; un saut (branchement) consiste à y écrire une autre adresse."
  - q: Pourquoi des mémoires caches ?
    r: "La mémoire principale est environ 100 fois plus lente que le processeur ; un cache, petit et rapide, garde les données récemment ou prochainement utilisées (localité temporelle et spatiale)."
  - q: Le goulot d'étranglement de von Neumann ?
    r: "Instructions et données passent par le **même bus** entre processeur et mémoire : le débit de ce bus limite la vitesse. Caches et architectures Harvard (bus séparés) l'atténuent."
  - q: Qu'est-ce qu'un SoC ?
    r: "Un *système sur puce* : processeur(s), GPU, mémoire, contrôleurs (USB, radio, vidéo…) intégrés sur une seule puce ; économe en énergie et en place (téléphones, tablettes)."
---

Un ordinateur exécute des programmes écrits en Python, en Java… mais le processeur, lui, ne connaît qu'une suite d'**instructions
élémentaires** codées en binaire. Comment sont-elles stockées, lues, exécutées ? Presque tous les ordinateurs depuis 1945 suivent le
même plan, décrit par **John von Neumann** dans un rapport sur l'EDVAC : c'est l'**architecture de von Neumann**.

## 1. Le modèle

```mermaid legende="L'architecture de von Neumann : un processeur, une mémoire unique (programme + données), des entrées-sorties, reliés par des bus"
flowchart LR
  subgraph CPU["Processeur (CPU)"]
    UC["Unité de commande<br/>compteur ordinal (PC)<br/>registre d'instruction"]
    UAL["Unité arithmétique<br/>et logique (UAL)"]
    REG["Registres<br/>R0, R1, …, accumulateur"]
    UC <--> UAL
    UAL <--> REG
  end
  MEM[("Mémoire<br/>programme ET données")]
  ES["Entrées / sorties<br/>clavier, écran, disque, réseau"]
  CPU <-->|"bus d'adresses<br/>bus de données<br/>bus de contrôle"| MEM
  CPU <--> ES
```

:::definition
- La **mémoire** contient à la fois le **programme** (instructions codées en nombres) et les **données** : c'est le principe du
  **programme enregistré**. Elle est formée de cases numérotées par leur **adresse**.
- Le **processeur** comprend l'**unité de commande** (elle lit, décode et orchestre), l'**unité arithmétique et logique** (UAL :
  additions, comparaisons, opérations bit à bit) et des **registres** (petites mémoires internes très rapides).
- Les **bus** transportent les adresses, les données et les signaux de contrôle (lecture/écriture) ; les **entrées-sorties** relient la
  machine au monde extérieur.
:::

Avant ce principe, une machine comme l'ENIAC (1945) se programmait en **recâblant** des panneaux : changer de programme prenait des
jours. Stocker le programme en mémoire permet de le changer aussi facilement que des données — et même qu'un programme en produise un
autre (c'est ce que font les compilateurs).

## 2. Le cycle d'instruction

Deux registres pilotent l'exécution : le **compteur ordinal** (PC, *program counter*), qui contient l'adresse de la prochaine
instruction, et le **registre d'instruction** (RI), qui contient l'instruction en cours.

```mermaid legende="Le cycle chargement – décodage – exécution, répété des milliards de fois par seconde"
flowchart LR
  F["1. Chargement<br/>RI ← mémoire[PC]<br/>PC ← PC + 1"] --> D["2. Décodage<br/>quelle opération ?<br/>quels opérandes ?"]
  D --> E["3. Exécution<br/>calcul (UAL), lecture/écriture<br/>en mémoire, ou saut (PC ← adresse)"]
  E --> F
```

Le programme suivant simule une petite machine : chaque instruction est un tuple, la mémoire une liste qui contient **à la fois** le
programme (cases 0 à 6) et les données (cases 7 à 9).

```python exec
memoire = [
    ("LOAD", 7),     # 0 : ACC ← mémoire[7]
    ("ADD", 8),      # 1 : ACC ← ACC + mémoire[8]
    ("STORE", 9),    # 2 : mémoire[9] ← ACC
    ("PRINT", 9),    # 3 : affiche mémoire[9]
    ("HALT", 0),     # 4 : arrêt
    None, None,      # 5, 6 : inutilisées
    20,              # 7 : donnée
    22,              # 8 : donnée
    0,               # 9 : résultat
]

pc, acc = 0, 0
while True:
    instruction = memoire[pc]          # chargement
    pc += 1
    op, adresse = instruction          # décodage
    if op == "LOAD":                   # exécution
        acc = memoire[adresse]
    elif op == "ADD":
        acc += memoire[adresse]
    elif op == "STORE":
        memoire[adresse] = acc
    elif op == "PRINT":
        print("sortie :", memoire[adresse])
    elif op == "HALT":
        break
print("mémoire finale :", memoire[7:])
```

Les vraies instructions sont des **nombres binaires** : une partie (le code opération) désigne l'opération, le reste les opérandes
(registres, adresse, constante). La leçon suivante les écrit en **assembleur**.

## 3. La hiérarchie mémoire

Le processeur exécute une instruction en une fraction de nanoseconde, mais un accès à la mémoire principale (RAM) prend de l'ordre
de 100 ns : sans précaution, il passerait son temps à attendre. C'est le **goulot d'étranglement de von Neumann**. La solution : une
**hiérarchie** de mémoires, de plus en plus grandes et lentes.

| Niveau | Taille typique | Temps d'accès (ordre de grandeur) |
|---|---|---|
| registres | quelques centaines d'octets | < 1 ns (1 cycle) |
| cache L1 / L2 / L3 | 64 Kio / 1 Mio / dizaines de Mio | 1 ns / 4 ns / 10-20 ns |
| mémoire vive (RAM) | 8 à 64 Gio | ~ 100 ns |
| SSD | 0,5 à 4 To | ~ 50-100 µs |
| disque dur | plusieurs To | ~ 5-10 ms |

Les caches fonctionnent grâce à la **localité** des programmes : une donnée utilisée le sera probablement de nouveau bientôt (localité
**temporelle**, une variable de boucle) ; ses voisines aussi (localité **spatiale**, les cases suivantes d'un tableau). Le cache charge
donc des **lignes** entières (64 octets) et garde les plus récentes.

:::methode[Temps d'accès moyen]
Si une fraction $h$ des accès trouve la donnée dans le cache (**taux de succès**), de temps $t_c$, et que les autres vont chercher en
mémoire principale (temps supplémentaire $t_m$) : $\bar{t} = t_c + (1 - h) \, t_m$. Avec $t_c = 1$ ns, $t_m = 100$ ns et $h = 0{,}95$ :
$\bar{t} = 1 + 0{,}05 \times 100 = 6$ ns, soit 17 fois mieux que sans cache. Passer à $h = 0{,}99$ donne 2 ns : quelques pourcents de
succès en plus changent tout.
:::

```python exec
import time

n = 1000
grille = [[1] * n for _ in range(n)]

debut = time.perf_counter()
s = 0
for i in range(n):              # parcours ligne par ligne
    for j in range(n):
        s += grille[i][j]
t1 = time.perf_counter() - debut

debut = time.perf_counter()
s = 0
for j in range(n):              # parcours colonne par colonne
    for i in range(n):
        s += grille[i][j]
t2 = time.perf_counter() - debut
print(f"lignes : {t1:.2f} s   colonnes : {t2:.2f} s")
```

(En Python, l'écart est atténué par le coût de l'interpréteur ; en C, le parcours par colonnes d'un grand tableau peut être plusieurs fois
plus lent, faute de localité spatiale.)

## 4. Au-delà du modèle de 1945

- **Plusieurs cœurs** : depuis le milieu des années 2000, la fréquence plafonne (vers 3-5 GHz, pour des raisons de dissipation
  thermique) ; on multiplie les **cœurs**, processeurs complets qui exécutent plusieurs programmes (ou fils d'exécution) en parallèle.
- **GPU** : des milliers d'unités de calcul simples qui exécutent la même opération sur beaucoup de données (images, calcul
  scientifique, apprentissage automatique).
- **Systèmes sur puce (SoC)** : processeur, GPU, mémoire, modem, contrôleurs vidéo et audio intégrés sur une même puce. Moins de
  connexions, donc moins d'énergie et de place : c'est l'architecture des téléphones et de nombreux ordinateurs portables.
- **Architecture Harvard** : bus séparés pour les instructions et les données (microcontrôleurs) ; les processeurs modernes en
  reprennent l'idée avec des caches L1 séparés pour les instructions et pour les données.

:::remarque[Quelques repères historiques]
1936 : machine de Turing (modèle théorique). 1945 : rapport de von Neumann sur l'EDVAC ; l'ENIAC entre en service. 1947 : invention du
transistor (laboratoires Bell). 1948 : la « Manchester Baby » exécute le premier programme enregistré. 1971 : premier microprocesseur,
l'Intel 4004 (environ 2 300 transistors). 1965-1975 : Gordon Moore observe que le nombre de transistors par puce double à intervalle
régulier (tous les deux ans, dans sa version de 1975) — tendance tenue pendant des décennies.
:::

:::prof
En première NSI : « distinguer les rôles et les caractéristiques des différents constituants d'une machine » et « dérouler l'exécution
d'une séquence d'instructions simples du type langage machine » ; en terminale : « identifier les principaux composants sur un schéma de
circuit et les avantages de leur intégration en termes de vitesse et de consommation » (SoC). Le simulateur de machine (type « M10 » ou
les simulateurs en ligne d'Y86, de RISC-V ou d'AQA) rend le cycle visible pas à pas ; démonter un vieux PC reste un excellent point de
départ.
:::

## Exemple guidé

**Problème.** Combien de temps un programme passe-t-il à attendre la mémoire ? Un programme exécute $10^9$ instructions ; 30 % d'entre
elles font un accès mémoire. Le processeur tourne à 3 GHz (1 instruction par cycle hors attente). Le cache a un taux de succès de 97 %,
un succès ne coûte rien de plus, un échec coûte 100 ns.

**1. Le temps de calcul pur.** $10^9$ cycles à $3 \times 10^9$ cycles par seconde : $\frac{10^9}{3 \times 10^9} \approx 0{,}33$ s.

**2. Le nombre d'échecs.** $10^9 \times 0{,}30 \times 0{,}03 = 9 \times 10^6$ accès vont jusqu'à la mémoire principale.

**3. Le temps d'attente.** $9 \times 10^6 \times 100 \times 10^{-9} = 0{,}9$ s.

```python exec
instructions = 1e9
frequence = 3e9
part_memoire, succes, penalite = 0.30, 0.97, 100e-9

calcul = instructions / frequence
attente = instructions * part_memoire * (1 - succes) * penalite
print(f"calcul : {calcul:.2f} s, attente : {attente:.2f} s, total : {calcul + attente:.2f} s")
for h in (0.90, 0.97, 0.99, 0.999):
    print(h, f"{calcul + instructions * part_memoire * (1 - h) * penalite:.2f} s")
```

**4. Conclure.** Le programme passe **près des trois quarts** de son temps à attendre la mémoire, alors que 97 % des accès réussissent dans
le cache ! Améliorer la localité (parcourir les données dans l'ordre où elles sont rangées) est souvent plus efficace qu'un processeur
plus rapide.

## L'essentiel

- Von Neumann (1945) : **programme enregistré** en mémoire avec les données ; processeur (unité de commande, UAL, registres), mémoire, entrées-sorties, bus.
- Cycle : **chargement** (RI ← mémoire[PC], PC + 1), **décodage**, **exécution** ; un saut modifie le PC.
- Goulot d'étranglement processeur-mémoire → **hiérarchie** : registres, caches L1/L2/L3, RAM, SSD, disque ; localité temporelle et spatiale.
- Temps moyen : $\bar{t} = t_c + (1-h)\,t_m$.
- Multicœurs, GPU, **SoC** (tout sur une puce : vitesse, consommation), Harvard (bus séparés).
- Repères : ENIAC et rapport EDVAC (1945), transistor (1947), Intel 4004 (1971), loi de Moore.

## Exercices

::::exercice[Le principe de von Neumann]{niveau=1}
Quelle est l'idée essentielle de l'architecture de von Neumann ?

- [ ] Le processeur contient toute la mémoire de l'ordinateur
- [x] Les instructions du programme sont rangées dans la mémoire, comme les données
- [ ] Chaque programme dispose de son propre processeur
- [ ] Les données sont stockées sur le disque et les programmes dans le processeur

:::corrige
C'est le **programme enregistré** : instructions et données partagent la même mémoire. Changer de programme revient à changer le contenu
de la mémoire.
:::
::::

::::exercice[Le compteur ordinal]{niveau=1}
Juste après le chargement de l'instruction située à l'adresse 40 (instructions d'une case), que contient le compteur ordinal ?

- [ ] 40
- [x] 41
- [ ] l'instruction elle-même
- [ ] l'adresse de la donnée manipulée par l'instruction

:::corrige
Pendant la phase de chargement, le PC est incrémenté pour désigner l'instruction **suivante** : 41. Si l'instruction 40 est un saut,
l'exécution remplacera ensuite cette valeur.
:::
::::

::::exercice[Temps d'accès moyen]{niveau=2}
Écris `temps_moyen(niveaux, t_final)` pour une hiérarchie de caches : `niveaux` est une liste de couples `(temps_d_acces, taux_de_succes)`
du plus rapide au plus lent ; un accès essaie chaque niveau dans l'ordre (en payant son temps d'accès) jusqu'au premier succès ; s'ils
échouent tous, on paie en plus `t_final` (la RAM). Renvoie le temps moyen.

```python depart
def temps_moyen(niveaux, t_final):
    ...
```

```python tests
assert abs(temps_moyen([(1, 0.95)], 100) - 6) < 1e-9, "un cache"
assert abs(temps_moyen([], 100) - 100) < 1e-9, "pas de cache"
assert abs(temps_moyen([(1, 0.9), (4, 0.8)], 100) - 3.4) < 1e-9, "deux niveaux"
```

:::corrige
```python solution
def temps_moyen(niveaux, t_final):
    total = 0
    proba_arrivee = 1          # probabilité qu'un accès atteigne ce niveau
    for temps, succes in niveaux:
        total += proba_arrivee * temps
        proba_arrivee *= 1 - succes
    return total + proba_arrivee * t_final
```
Deux niveaux : on paie toujours L1 (1 ns) ; 10 % des accès vont en L2 (4 ns) ; 10 % × 20 % = 2 % vont en RAM (100 ns) :
$1 + 0{,}1 \times 4 + 0{,}02 \times 100 = 3{,}4$ ns. C'est la formule $\bar t = t_c + (1-h)\,t_m$ appliquée récursivement.
:::
::::

::::exercice[Étendre la machine]{niveau=2}
Complète le simulateur `executer(memoire)` de la section 2 avec les instructions `SUB a` (ACC ← ACC − mémoire[a]), `JUMP a` (saut à
l'adresse a) et `JUMPZ a` (saut si ACC vaut 0). `PRINT a` ajoute mémoire[a] à une liste de sorties, renvoyée à la fin (au `HALT`).

```python depart
def executer(memoire):
    pc, acc, sorties = 0, 0, []
    while True:
        op, a = memoire[pc]
        pc += 1
        ...
```

```python tests
# compte à rebours : affiche 3, 2, 1
prog = [("PRINT", 9), ("LOAD", 9), ("SUB", 10), ("STORE", 9), ("JUMPZ", 6), ("JUMP", 0),
        ("HALT", 0), None, None, 3, 1]
assert executer(prog) == [3, 2, 1], "boucle avec saut conditionnel"
assert executer([("LOAD", 3), ("PRINT", 3), ("HALT", 0), 42]) == [42], "programme simple"
```

:::corrige
```python solution
def executer(memoire):
    pc, acc, sorties = 0, 0, []
    while True:
        op, a = memoire[pc]
        pc += 1
        if op == "LOAD":
            acc = memoire[a]
        elif op == "ADD":
            acc += memoire[a]
        elif op == "SUB":
            acc -= memoire[a]
        elif op == "STORE":
            memoire[a] = acc
        elif op == "PRINT":
            sorties.append(memoire[a])
        elif op == "JUMP":
            pc = a
        elif op == "JUMPZ":
            if acc == 0:
                pc = a
        elif op == "HALT":
            return sorties
```
Un saut n'est rien d'autre qu'une écriture dans le compteur ordinal. Avec un saut conditionnel, la machine peut réaliser des boucles et
des conditions : elle devient capable de calculer tout ce qui est calculable (dans la limite de sa mémoire).
:::
::::

::::exercice[Localité]{niveau=3}
Un cache contient 4 lignes de 4 mots ; l'adresse $a$ appartient à la ligne $\lfloor a/4 \rfloor$. Quand une ligne absente est demandée
et que le cache est plein, on remplace la ligne **la moins récemment utilisée** (LRU). Écris `taux_succes(adresses)` qui simule une
suite d'accès et renvoie la proportion de succès.

```python depart
def taux_succes(adresses):
    ...
```

```python tests
sequentiel = list(range(64))
assert taux_succes(sequentiel) == 0.75, "parcours séquentiel : 3 succès sur 4"
saute = [i * 4 for i in range(64)]
assert taux_succes(saute) == 0, "pas de 4 : aucune localité spatiale"
boucle = list(range(16)) * 4
assert taux_succes(boucle) == (64 - 4) / 64, "boucle sur 16 mots qui tiennent dans le cache"
assert taux_succes([0, 4, 8, 12, 16, 0]) == 0, "LRU : la ligne 0 a été évincée"
```

:::corrige
```python solution
def taux_succes(adresses):
    cache = []                       # numéros de ligne, du moins au plus récemment utilisé
    succes = 0
    for a in adresses:
        ligne = a // 4
        if ligne in cache:
            succes += 1
            cache.remove(ligne)
        elif len(cache) == 4:
            cache.pop(0)             # évince la moins récemment utilisée
        cache.append(ligne)
    return succes / len(adresses)
```
Parcours séquentiel : seul le premier mot de chaque ligne est un échec (localité spatiale, 75 %). Pas de 4 : chaque accès tombe dans
une nouvelle ligne (0 %). La boucle sur 16 mots tient dans les 4 lignes : seuls les 4 premiers chargements échouent (localité
temporelle). C'est pourquoi l'ordre de parcours d'un tableau compte.
:::
::::

::::exercice[Analyser un document technique]{niveau=4 duree=25}
Un téléphone récent est vendu avec « un SoC gravé en 3 nm, 6 cœurs (2 performants + 4 économes), un GPU 5 cœurs, un moteur neuronal,
8 Go de mémoire unifiée ».

1. Expliquez chaque élément de cette description à un élève de terminale.
2. Pourquoi intégrer tous ces composants sur une seule puce ? Quels inconvénients ?
3. Pourquoi deux sortes de cœurs ? Quel lien avec l'ordonnancement des processus ?
4. « Mémoire unifiée » : en quoi est-ce encore une architecture de von Neumann ?

:::criteres
- Explications justes : SoC (système sur puce), finesse de gravure (taille caractéristique des transistors, densité, consommation), cœurs (exécution parallèle), GPU (calcul massivement parallèle, graphisme), moteur neuronal (calcul spécialisé pour l'apprentissage automatique), mémoire partagée par tous les composants.
- Avantages de l'intégration (distances courtes donc vitesse, moins d'énergie, encombrement, coût en volume) et inconvénients (pas de réparation ni d'évolution d'un composant isolé, dissipation thermique concentrée, conception coûteuse).
- Cœurs hétérogènes : performance contre efficacité énergétique ; le système d'exploitation choisit sur quel cœur placer chaque processus.
- Mémoire unifiée : une seule mémoire pour programmes et données de tous les composants, reliée par des bus : principe du programme enregistré.
:::

:::corrige
1. **SoC** : tous les composants d'un ordinateur (processeurs, processeur graphique, contrôleurs, modem…) réunis sur **une seule puce**.
   **3 nm** : nom commercial de la génération de gravure, liée à la taille des transistors — plus ils sont petits, plus on en loge (des
   dizaines de milliards) et moins chacun consomme. **6 cœurs** : six processeurs capables d'exécuter des programmes en même temps.
   **GPU** : processeur spécialisé dans les calculs massivement parallèles (images, jeux). **Moteur neuronal** : unité spécialisée dans les
   calculs des réseaux de neurones (multiplications de matrices), pour la reconnaissance d'images ou de la voix. **Mémoire unifiée** : une
   seule mémoire vive partagée par le processeur, le GPU et le reste.
2. Intégrer raccourcit les connexions : les signaux vont plus vite et consomment moins d'énergie (essentiel sur batterie) ; la puce prend
   moins de place et coûte moins cher produite en très grand nombre. Inconvénients : impossible de changer ou d'ajouter un composant
   (pas d'extension de mémoire, réparation difficile), chaleur concentrée sur une petite surface, conception très coûteuse.
3. Les cœurs **performants** sont rapides mais consomment beaucoup ; les cœurs **économes** sont plus lents mais très sobres. Le système
   d'exploitation, en **ordonnançant** les processus, place les tâches de fond (synchronisation, courriel) sur les cœurs économes et les
   tâches exigeantes (jeu, montage vidéo) sur les performants : autonomie et réactivité.
4. Le principe de von Neumann est que programmes et données résident dans une même mémoire adressable, lue par le processeur via des bus.
   La mémoire unifiée étend ce principe à tous les composants de la puce : ils partagent le même espace mémoire au lieu d'avoir chacun
   la sienne (avant, le GPU avait sa mémoire dédiée et il fallait copier les données de l'une à l'autre). Les caches de chaque cœur
   restent nécessaires pour masquer la lenteur relative de cette mémoire.
:::
::::
