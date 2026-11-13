---
titre: Les processus
resume: "Comment un système lance les programmes et partage le processeur entre eux."
duree: 40
objectifs:
  - "Décrire la création d'un processus"
  - "Dérouler l'ordonnancement de plusieurs processus"
  - "Observer les processus d'une machine"
---

Sur ton ordinateur, la musique joue pendant que tu écris et que le navigateur charge une page. Pourtant, un cœur de processeur n'exécute qu'**une instruction à la fois**. Le secret : le système d'exploitation fait alterner les programmes très vite, des centaines de fois par seconde.

## 1. Programme et processus

Un **programme** est un fichier sur le disque, comme une recette de cuisine dans un livre. Un **processus** est ce programme **en cours d'exécution**, comme un cuisinier qui suit la recette, avec ses ingrédients sortis et l'étape où il en est.

Le même programme peut donner plusieurs processus : deux fenêtres du même navigateur sont deux processus.

Quand on lance un programme, le système :

1. le charge en mémoire ;
2. crée un processus, avec un numéro unique, le **PID** ;
3. note le processus qui l'a lancé, son **parent**, dont le numéro est le **PPID**.

Les processus forment ainsi un arbre : chaque processus a été créé par un autre.

```bash
ps -ef          # lister les processus, avec leur PID et leur PPID
top             # les voir en direct, avec leur consommation
kill 4321       # arrêter le processus de PID 4321
```

## 2. Les états d'un processus

| État | Sens | Exemple |
| --- | --- | --- |
| **Prêt** | il pourrait s'exécuter, il attend son tour | le navigateur attend le processeur |
| **Élu** | il s'exécute en ce moment | le lecteur de musique calcule le son |
| **Bloqué** | il attend une ressource, et ne peut rien faire en attendant | un programme attend la lecture d'un fichier sur le disque |

Les passages entre états :

- prêt → élu : l'ordonnanceur le choisit ;
- élu → prêt : son temps est écoulé, il laisse la place ;
- élu → bloqué : il demande une ressource lente, comme le disque ;
- bloqué → prêt : la ressource est arrivée, il peut repartir.

Un processus bloqué ne passe jamais directement à l'état élu : il redevient d'abord prêt.

## 3. L'ordonnancement

L'**ordonnanceur** est la partie du système qui choisit quel processus prêt s'exécute. Plusieurs stratégies existent.

Prenons trois processus :

| Processus | Arrivée | Durée |
| --- | --- | --- |
| P1 | 0 | 5 |
| P2 | 1 | 2 |
| P3 | 2 | 1 |

Deux mesures permettent de comparer les stratégies :

- le **temps de séjour** = instant de fin − instant d'arrivée ;
- le **temps d'attente** = temps de séjour − durée.

### Premier arrivé, premier servi

Chaque processus s'exécute jusqu'au bout, dans l'ordre d'arrivée.

```
temps : 0  1  2  3  4  5  6  7
        P1 P1 P1 P1 P1 P2 P2 P3
```

P1 finit à 5, P2 à 7, P3 à 8. Temps de séjour : 5, 6 et 6.

### Le plus court d'abord

Quand le processeur se libère, on choisit le processus prêt le plus court. À l'instant 0, seul P1 est arrivé : il s'exécute en entier. À l'instant 5, P2 et P3 attendent : P3, plus court, passe d'abord.

```
temps : 0  1  2  3  4  5  6  7
        P1 P1 P1 P1 P1 P3 P2 P2
```

P1 finit à 5, P3 à 6, P2 à 8. Temps de séjour : 5, 4 et 7. Le défaut : un processus long peut attendre très longtemps si des processus courts arrivent sans cesse.

### Le tourniquet

Chaque processus s'exécute au plus pendant un temps fixé, le **quantum**, puis repasse en fin de file d'attente. Avec un quantum de 2 :

```
temps : 0  1  2  3  4  5  6  7
        P1 P1 P2 P2 P3 P1 P1 P1
```

- De 0 à 2, P1 s'exécute. Il n'a pas fini : il repasse en fin de file, derrière P2 et P3, arrivés entre-temps.
- De 2 à 4, P2 s'exécute et termine.
- De 4 à 5, P3 s'exécute et termine.
- De 5 à 8, P1 termine.

P2 finit à 4, P3 à 5, P1 à 8. Chacun avance régulièrement : c'est la stratégie qui donne l'impression que tout tourne en même temps.

## L'essentiel

- Un processus est un programme en cours d'exécution, avec un PID et un parent.
- États : prêt, élu, bloqué ; un processus bloqué redevient prêt avant d'être élu.
- L'ordonnanceur choisit le processus élu : premier arrivé premier servi, plus court d'abord, tourniquet.
- Temps de séjour = fin − arrivée ; temps d'attente = séjour − durée.

## Exercices

::::exercice[QCM : processus]{niveau=1 type=quiz}
Une question à la fois : la correction s'affiche aussitôt.

1. Qu'est-ce qu'un processus ?

   - [ ] un fichier exécutable sur le disque
   - [x] un programme en cours d'exécution
   - [ ] un composant du processeur
   - [ ] une commande Linux

   > Il a son identifiant (PID) et sa mémoire.

1. Un processus attend la fin d'une lecture sur le disque. Il est :

   - [ ] élu
   - [ ] prêt
   - [x] bloqué
   - [ ] terminé

   > Il ne peut pas avancer tant que la donnée n'est pas arrivée.

1. Combien de processus peuvent être élus en même temps sur un processeur à un seul cœur ?

   - [x] un
   - [ ] deux
   - [ ] autant que de processus prêts
   - [ ] aucun

   > L'impression de simultanéité vient de l'alternance rapide.

1. Quelle commande affiche la liste des processus sous Linux ?

   - [ ] `ls`
   - [x] `ps`
   - [ ] `kill`
   - [ ] `cd`

   > `kill` sert à les arrêter.

1. Dans le tourniquet, que devient un processus dont le quantum est écoulé mais qui n'a pas fini ?

   - [ ] il est terminé
   - [x] il repasse en fin de file des processus prêts
   - [ ] il devient bloqué
   - [ ] il garde le processeur

   > Chacun son tour.
::::

::::exercice[Premier arrivé, premier servi]{niveau=1 type=completer}
Complète les instants de fin et les temps de séjour.

```python calcul
t = 0
for a, d in [(0, 4), (1, 3), (2, 1)]:
    t = max(t, a) + d
    print(t)
    print(t - a)
```

| Processus | Arrivée | Durée | Fin | Séjour |
| --- | --- | --- | --- | --- |
| A | 0 | 4 | [[4]] | [[4]] |
| B | 1 | 3 | [[7]] | [[6]] |
| C | 2 | 1 | [[8]] | [[6]] |
::::

::::exercice[Tourniquet]{niveau=2 type=completer}
A (durée 3) et B (durée 2) arrivent à l'instant 0, A en premier. Quantum : 1. Complète le processus exécuté à chaque instant.

```python calcul
reste = {"A": 3, "B": 2}
f = ["A", "B"]
fins = {}
t = 0
while f:
    p = f.pop(0)
    print(p)
    reste[p] -= 1
    t += 1
    if reste[p]:
        f.append(p)
    else:
        fins[p] = t
print(fins["A"])
print(fins["B"])
```

| Instant | 0 | 1 | 2 | 3 | 4 |
| --- | --- | --- | --- | --- | --- |
| Processus | [[A]] | [[B]] | [[A]] | [[B]] | [[A]] |

A se termine à l'instant [[5]] et B à l'instant [[4]].
::::

::::exercice[Comparer des stratégies]{niveau=2}
Quatre processus arrivent tous à l'instant 0, dans l'ordre P1 (durée 8), P2 (durée 2), P3 (durée 4), P4 (durée 1). (a) Donne les instants de fin
et le temps d'attente moyen avec FIFO, puis avec « plus court d'abord ». (b) Quelle stratégie choisirait-on pour un ordinateur de bureau
utilisé de façon interactive ? Pourquoi ?

:::criteres
- (a) FIFO : fins 8, 10, 14, 15 ; attentes 0, 8, 10, 14 ; moyenne 8.
- Plus court d'abord : ordre P4, P2, P3, P1 ; fins 1, 3, 7, 15 ; attentes 0, 1, 3, 7 ; moyenne 2,75.
- (b) Le tourniquet : réactivité, aucun programme ne monopolise le processeur, pas besoin de connaître les durées.
:::

:::corrige
(a) **FIFO** : P1 finit à 8, P2 à 10, P3 à 14, P4 à 15. Temps d'attente (fin − durée, tous arrivés à 0) : 0, 8, 10, 14 ; moyenne **8**.
**Plus court d'abord** : ordre P4, P2, P3, P1 ; fins 1, 3, 7, 15 ; attentes 0, 1, 3, 7 ; moyenne **2,75**. Le plus court d'abord minimise
l'attente moyenne, mais il faut connaître les durées et le long P1 peut subir une famine. (b) Pour un usage **interactif**, on choisit le
**tourniquet** (avec priorités) : chaque programme obtient régulièrement le processeur, la souris et le clavier restent réactifs même si un
calcul long tourne, et il n'est pas nécessaire de connaître les durées à l'avance.
:::
::::

::::exercice[Observer une machine]{niveau=3 type=reponses}
La commande `ps -ef` affiche ce tableau, simplifié.

| PID | PPID | Commande |
| --- | --- | --- |
| 1 | 0 | init |
| 420 | 1 | bash |
| 512 | 420 | python jeu.py |
| 530 | 512 | python son.py |
| 600 | 1 | serveur |

Ensuite, on applique le tourniquet avec un quantum de 2 aux processus P1 (arrivée 0, durée 3), P2 (arrivée 1, durée 4) et P3 (arrivée 4, durée 1). Un processus qui arrive à la fin d'un quantum entre dans la file **avant** le processus interrompu.

1. Quel est le PID du parent de `python son.py` ?

   - 512

1. Quelle commande a créé `bash` ?

   - init

1. Combien de processus descendent de `bash`, en comptant les enfants et les petits-enfants ?

   - 2

1. À quel instant P1 se termine-t-il ?

   ```python calcul
   print(5)
   ```

   - 5

1. À quel instant P3 se termine-t-il ?

   ```python calcul
   arrivees = {"P1": 0, "P2": 1, "P3": 4}
   reste = {"P1": 3, "P2": 4, "P3": 1}
   file, fins, t, attente = ["P1"], {}, 0, ["P2", "P3"]
   while file:
       p = file.pop(0)
       d = min(2, reste[p])
       t2 = t + d
       for q in list(attente):
           if arrivees[q] <= t2:
               file.append(q)
               attente.remove(q)
       reste[p] -= d
       t = t2
       if reste[p] > 0:
           file.append(p)
       else:
           fins[p] = t
   print(fins["P3"])
   ```

   - 6

1. Quel est le temps de séjour de P2 ?

   ```python calcul
   print(8 - 1)
   ```

   - 7
::::
