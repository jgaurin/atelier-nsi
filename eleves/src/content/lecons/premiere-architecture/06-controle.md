---
titre: Contrôle du chapitre
resume: "Un contrôle de 55 minutes noté sur 20 sur l'architecture des machines et le système d'exploitation."
duree: 55
controle: true
programmation: true
objectifs:
  - "Connaître les constituants d'une machine"
  - "Dérouler un programme machine"
  - "Utiliser des commandes et lire des droits"
prerequis: [premiere-architecture/capteurs-ihm]
---

## Consignes

Durée : **55 minutes**. Le contrôle est noté sur **20 points**.

## Exercices

::::exercice[Constituants]{niveau=3 type=associer points=4}
Chaque association vaut 1 point.

| Rôle | Constituant |
| --- | --- |
| Faire les calculs | UAL |
| Stocker le programme en cours | mémoire vive |
| Mesurer une température | capteur |
| Faire tourner un moteur | actionneur |
::::

::::exercice[Dérouler]{niveau=3 type=completer points=6}
La case 40 contient 3, la case 41 contient 1, la case 42 contient 0. Complète le déroulé. Chaque case vaut 1 point.

```
0  LOAD 42
1  ADD 40
2  ADD 40
3  STORE 42
4  LOAD 40
5  SUB 41
6  STORE 40
7  HALT
```

```python calcul
a = 0
a += 3
print(a)
a += 3
print(a)
print(6)
a = 3
print(a)
a -= 1
print(a)
print(2)
```

| Compteur | Instruction | A après l'instruction |
| --- | --- | --- |
| 1 | `ADD 40` | [[3]] |
| 2 | `ADD 40` | [[6]] |
| 3 | `STORE 42` | [[6]] |
| 4 | `LOAD 40` | [[3]] |
| 5 | `SUB 41` | [[2]] |

À la fin, la case 40 contient [[2]].
::::

::::exercice[Commandes]{niveau=3 type=reponses points=5}
Le dossier courant est `/home/ana/nsi`. Chaque question vaut 1 point.

1. Quelle commande remonte au dossier `/home/ana` ?

   - cd ..

1. Quel est le chemin absolu du fichier `tp.py` situé dans le dossier courant ?

   - /home/ana/nsi/tp.py

1. Quelle commande copie `tp.py` en `tp2.py` ?

   - cp tp.py tp2.py

1. Quel nombre correspond aux droits `rwxr-----` ?

   - 740

1. Dans `rw-r--r--`, les autres utilisateurs peuvent-ils modifier le fichier ? Réponds par oui ou par non.

   - non
::::

::::exercice[Pilotage]{niveau=3 points=5}
Cahier des charges : une alarme sonne si la porte est ouverte et que le système est activé, ou si de la fumée est détectée. Écris `alarme(porte_ouverte, activee, fumee)`.

```python depart
def alarme(porte_ouverte, activee, fumee):
    ...
```

```python tests
assert alarme(True, True, False) is True, "porte ouverte, système activé"
assert alarme(True, False, False) is False, "système désactivé"
assert alarme(False, False, True) is True, "fumée"
assert alarme(False, True, False) is False, "rien"
```

:::corrige
```python solution
def alarme(porte_ouverte, activee, fumee):
    return (porte_ouverte and activee) or fumee
```
:::
::::
