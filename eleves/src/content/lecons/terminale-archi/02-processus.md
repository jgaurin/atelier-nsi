---
titre: Les processus
resume: "Comment un système lance les programmes et partage le processeur entre eux."
duree: 40
objectifs:
  - "Décrire la création d'un processus"
  - "Dérouler l'ordonnancement de plusieurs processus"
  - "Observer les processus d'une machine"
---

Un programme en cours d'exécution est un **processus**. Sur un cœur, un seul s'exécute à la fois : le système les fait alterner très vite.

## 1. Créer un processus

Un **programme** est un fichier. Le système le charge en mémoire et crée un **processus**, avec un identifiant, le **PID**, et un parent, le **PPID**.

```bash
ps -ef          # lister les processus
top             # les voir en direct
kill 4321       # arrêter le processus 4321
```

## 2. Les états

- **Prêt** : il attend le processeur.
- **Élu** : il s'exécute.
- **Bloqué** : il attend une ressource, comme une lecture sur le disque.

## 3. L'ordonnancement

L'**ordonnanceur** choisit quel processus prêt s'exécute. Trois processus : P1 (arrivé à 0, durée 5), P2 (arrivé à 1, durée 2), P3 (arrivé à 2, durée 1).

**Premier arrivé, premier servi** : P1 finit à 5, P2 à 7, P3 à 8.

**Plus court d'abord**, sans interruption : P1 finit à 5, P3 à 6, P2 à 8.

**Tourniquet**, quantum 2 : chaque processus s'exécute au plus 2 unités, puis repasse en fin de file.

```
temps : 0  1  2  3  4  5  6  7
        P1 P1 P2 P2 P3 P1 P1 P1
```

Le **temps de séjour** d'un processus est : instant de fin − instant d'arrivée.

## L'essentiel

- Un processus est un programme en cours d'exécution, avec un PID et un parent.
- États : prêt, élu, bloqué.
- Ordonnancement : premier arrivé premier servi, plus court d'abord, tourniquet.

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

1. Quel est le défaut de la stratégie « plus court d'abord » ?

   - [ ] elle est toujours plus lente
   - [x] un long processus peut attendre indéfiniment (famine)
   - [ ] elle provoque des interblocages
   - [ ] elle ne marche qu'avec deux processus

   > S'il arrive sans cesse des processus courts.

1. Trois processus de durées 6, 1 et 1 arrivent ensemble dans cet ordre. En FIFO, quand finit le dernier ?

   - [ ] à 1
   - [ ] à 6
   - [x] à 8
   - [ ] à 2

   > 6 + 1 + 1 ; les deux courts attendent derrière le long.

::::

::::exercice[Quel état ?]{niveau=1 type=associer}
Dans quel état se trouve le processus ?

| Situation | État |
| --- | --- |
| Il s'exécute sur le processeur | élu |
| Il attend que le processeur se libère | prêt |
| Il attend la fin d'une lecture sur le disque | bloqué |
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
