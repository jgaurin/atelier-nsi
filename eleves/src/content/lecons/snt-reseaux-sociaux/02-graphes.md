---
titre: Graphes et petit monde
resume: "Représenter des relations par un graphe, calculer son diamètre, son rayon et son centre."
duree: 35
objectifs:
  - "Représenter des relations par un graphe"
  - "Déterminer le rayon, le diamètre et le centre d'un graphe simple"
  - "Décrire la notion de petit monde"
  - "Expliquer comment le choix des amis conditionne l'information reçue"
---

Un réseau social peut se représenter par un **graphe** : les **sommets** sont les personnes, les **arêtes** sont les liens d'amitié.

## 1. Distance et excentricité

- La **distance** entre deux sommets est le plus petit nombre d'arêtes pour aller de l'un à l'autre.
- L'**excentricité** d'un sommet est sa distance au sommet le plus éloigné.

## 2. Diamètre, rayon et centre

| Mesure | Définition |
| --- | --- |
| **Diamètre** | la plus grande excentricité |
| **Rayon** | la plus petite excentricité |
| **Centre** | les sommets dont l'excentricité est égale au rayon |

:::exemple
Graphe : A–B, B–C, C–D, B–E.

| Sommet | A | B | C | D | E |
| --- | --- | --- | --- | --- | --- |
| Excentricité | 3 | 2 | 2 | 3 | 3 |

Le diamètre vaut 3, le rayon vaut 2, et le centre est formé de B et C.
:::

## 3. Un petit monde

En 1967, l'expérience de **Milgram** suggère que deux personnes sont reliées par environ six intermédiaires. Un graphe où les distances restent petites malgré un grand nombre de sommets est un **petit monde**.

## 4. L'information que tu reçois

Tu vois surtout ce que partagent tes contacts, et ce que recommande l'algorithme : tes choix **conditionnent** l'information reçue.

- **Bonding** : renforcer les liens dans un même groupe.
- **Bridging** : créer de nouveaux liens vers d'autres groupes.

Trop de bonding peut enfermer dans une bulle et appauvrir l'esprit critique.

## L'essentiel

- Excentricité : distance au sommet le plus éloigné.
- Diamètre : la plus grande excentricité. Rayon : la plus petite.
- Centre : les sommets d'excentricité égale au rayon.
- Petit monde : de courtes distances, même dans un immense réseau.

## Exercices

::::exercice[Vocabulaire]{niveau=1 type=associer}
Associe chaque définition à son nom.

| Définition | Nom |
| --- | --- |
| Une personne du réseau | sommet |
| Un lien entre deux personnes | arête |
| La plus grande excentricité | diamètre |
| La plus petite excentricité | rayon |
::::

::::exercice[Lire des distances]{niveau=1 type=reponses}
Graphe : Ali–Bea, Bea–Cleo, Cleo–Dan.

1. Quelle est la distance entre Ali et Cleo ?

   - 2

1. Quelle est la distance entre Ali et Dan ?

   - 3

1. Quelle est l'excentricité de Bea ?

   - 2

   > Dan est à distance 2.
::::

::::exercice[Calculer un diamètre]{niveau=2 type=completer}
Graphe : Ana–Bo, Bo–Cy, Cy–Di, Di–Eva, Cy–Fay. Complète les excentricités, puis les mesures.

```python calcul
g = {"Ana": ["Bo"], "Bo": ["Ana", "Cy"], "Cy": ["Bo", "Di", "Fay"], "Di": ["Cy", "Eva"], "Eva": ["Di"], "Fay": ["Cy"]}
def ex(s):
    d = {s: 0}
    f = [s]
    while f:
        x = f.pop(0)
        for v in g[x]:
            if v not in d:
                d[v] = d[x] + 1
                f.append(v)
    return max(d.values())
e = [ex(s) for s in g]
for v in e:
    print(v)
print(max(e))
print(min(e))
print("Cy")
```

| Sommet | Ana | Bo | Cy | Di | Eva | Fay |
| --- | --- | --- | --- | --- | --- | --- |
| Excentricité | [[4]] | [[3]] | [[2]] | [[3]] | [[4]] | [[3]] |

Le diamètre vaut [[4]], le rayon vaut [[2]], et le centre est [[Cy]].
::::

::::exercice[Deux communautés]{niveau=3}
Un graphe contient deux groupes d'amis très soudés. Dans le groupe 1, A, B et C sont tous reliés entre eux. Dans le groupe 2, D, E et F sont tous reliés entre eux. Seule l'arête C–D relie les deux groupes.

1. Quel est le diamètre de ce graphe ? Donne deux sommets qui le réalisent.
2. Quel est son rayon ? Quel est son centre ?
3. L'arête C–D disparaît. Peut-on encore calculer un diamètre ? Justifie.
4. Une information circule seulement dans le groupe 1. Pourquoi les membres du groupe 2 risquent-ils de ne pas la recevoir ? Cet exemple relève-t-il du bonding ou du bridging ? Quel est le rôle de l'arête C–D ?

:::criteres
- Diamètre 3, par exemple entre A et E.
- Rayon 2, centre C et D.
- Non : certains sommets ne sont plus reliés.
- Les liens internes relèvent du bonding, C–D du bridging.
:::

:::corrige
1. Le diamètre vaut **3**, par exemple A → C → D → E.
2. C et D sont à distance au plus 2 de tous les sommets : le rayon vaut **2**, et le centre est formé de **C et D**.
3. Non : il n'existe plus de chemin entre les deux groupes. Certaines distances ne sont donc plus définies.
4. Tant que l'information reste dans le groupe 1, elle ne passe pas par C–D. Les liens très denses dans chaque groupe relèvent du **bonding**. L'arête C–D est un lien de **bridging** : c'est le pont qui permet à l'information de changer de groupe.
:::
::::
