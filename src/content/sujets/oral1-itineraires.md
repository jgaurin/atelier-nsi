---
titre: "Sujet blanc 3 — Calculer un itinéraire"
epreuve: oral1
duree: 150
resume: "Un sujet original pour s'entraîner à la première épreuve d'admission : un corpus sur les graphes et le calcul d'itinéraires, une réalisation à produire en 2 h 30 (chargement de données, plus court chemin, tests, interface), puis la préparation de l'exposé et des questions du jury."
themes: [graphes, Dijkstra, données CSV, tests, Tkinter, exposé]
ordre: 3
---

## Le sujet

**Thème** : le calcul d'itinéraires dans un réseau de transport.

**Document 1 — Extrait du programme de terminale NSI** (algorithmique) : « Algorithmes sur les graphes : parcours en profondeur et en largeur, repérer la présence d'un cycle,
chercher un chemin. » ; en SNT, thème « Localisation, cartographie et mobilité » : « calculer un itinéraire ».

**Document 2 — Présentation de l'algorithme de Dijkstra** (manuel) : dans un graphe dont les arêtes ont des poids positifs, on maintient pour chaque sommet une distance
provisoire ; on choisit à chaque étape le sommet non définitif de plus petite distance, on le rend définitif, et on met à jour ses voisins. Edsger Dijkstra l'a conçu en
1956, « en vingt minutes », a-t-il raconté, pour une démonstration publique de l'ordinateur ARMAC.

**Document 3 — Les données** d'un petit réseau de bus, au format CSV (`arret_depart;arret_arrivee;minutes`), chaque ligne étant parcourable dans les deux sens :

```text
Gare;Mairie;4
Gare;Lycée;9
Mairie;Lycée;3
Mairie;Marché;6
Lycée;Stade;5
Marché;Stade;2
Marché;Hôpital;7
Stade;Hôpital;8
```

**Travail demandé** : pendant la préparation (2 h 30), réaliser un programme qui charge le réseau, calcule l'itinéraire le plus rapide entre deux arrêts et l'affiche, avec
des tests ; puis préparer un exposé de 30 minutes présentant les documents de façon organisée et la réalisation.

## La réalisation, étape par étape

::::exercice[Charger le réseau]{niveau=4 duree=15}
Écrivez `charger(texte)` qui transforme le contenu CSV du document 3 en un graphe : un dictionnaire `{arret: {voisin: minutes}}`, chaque trajet étant ajouté dans les **deux
sens**. Les lignes vides sont ignorées.

```python depart
def charger(texte):
    ...
```

```python tests
DONNEES = """Gare;Mairie;4
Gare;Lycée;9
Mairie;Lycée;3
Mairie;Marché;6
Lycée;Stade;5
Marché;Stade;2
Marché;Hôpital;7
Stade;Hôpital;8
"""
g = charger(DONNEES)
assert g["Gare"] == {"Mairie": 4, "Lycée": 9}, "voisins de la gare"
assert g["Hôpital"] == {"Marché": 7, "Stade": 8}, "trajets dans les deux sens"
assert len(g) == 6, "six arrêts"
assert charger("") == {}, "texte vide"
```

:::corrige
```python solution
def charger(texte):
    graphe = {}
    for ligne in texte.splitlines():
        if not ligne.strip():
            continue
        a, b, minutes = ligne.split(";")
        graphe.setdefault(a, {})[b] = int(minutes)
        graphe.setdefault(b, {})[a] = int(minutes)
    return graphe
```
`setdefault` crée le dictionnaire des voisins à la première rencontre d'un arrêt. Un dictionnaire de dictionnaires est une **liste d'adjacence pondérée**. Pendant l'oral, on
justifie ce choix (accès direct aux voisins, graphe peu dense) face à une matrice d'adjacence.
:::
::::

::::exercice[Le plus court chemin]{niveau=4 duree=40}
Écrivez `itineraire(graphe, depart, arrivee)` qui renvoie le couple (durée totale, liste des arrêts du trajet) le plus rapide, avec l'algorithme de Dijkstra (vous pouvez
utiliser `heapq`). Si l'arrivée est inaccessible, renvoyer `(None, [])`.

```python depart
import heapq

def itineraire(graphe, depart, arrivee):
    ...
```

```python tests
g = {"Gare": {"Mairie": 4, "Lycée": 9}, "Mairie": {"Gare": 4, "Lycée": 3, "Marché": 6},
     "Lycée": {"Gare": 9, "Mairie": 3, "Stade": 5}, "Marché": {"Mairie": 6, "Stade": 2, "Hôpital": 7},
     "Stade": {"Lycée": 5, "Marché": 2, "Hôpital": 8}, "Hôpital": {"Marché": 7, "Stade": 8}}
assert itineraire(g, "Gare", "Lycée") == (7, ["Gare", "Mairie", "Lycée"]), "le détour par la mairie est plus rapide"
assert itineraire(g, "Gare", "Hôpital") == (17, ["Gare", "Mairie", "Marché", "Hôpital"]), "vers l'hôpital"
assert itineraire(g, "Stade", "Stade") == (0, ["Stade"]), "départ = arrivée"
g2 = dict(g); g2["Île"] = {}
assert itineraire(g2, "Gare", "Île") == (None, []), "arrêt inaccessible"
```

:::corrige
```python solution
import heapq

def itineraire(graphe, depart, arrivee):
    dist, pred = {depart: 0}, {}
    tas, definitifs = [(0, depart)], set()
    while tas:
        d, u = heapq.heappop(tas)
        if u in definitifs:
            continue
        definitifs.add(u)
        if u == arrivee:
            break
        for v, poids in graphe[u].items():
            if v not in definitifs and d + poids < dist.get(v, float("inf")):
                dist[v] = d + poids
                pred[v] = u
                heapq.heappush(tas, (dist[v], v))
    if arrivee not in definitifs:
        return None, []
    chemin = [arrivee]
    while chemin[-1] != depart:
        chemin.append(pred[chemin[-1]])
    return dist[arrivee], chemin[::-1]
```
Les prédécesseurs permettent de **reconstruire** le trajet en remontant depuis l'arrivée. On s'arrête dès que l'arrivée devient définitive. Avec un tas, le coût est
$O((S + A) \log S)$ ($S$ arrêts, $A$ trajets). Le premier test montre l'intérêt de l'algorithme : le trajet direct Gare → Lycée (9 min) est plus long que le détour par la
mairie (7 min). Le poids doit être **positif** : c'est l'hypothèse qui rend correct le choix « glouton » du sommet le plus proche.
:::
::::

::::exercice[Interface et démonstration]{niveau=4 duree=30}
Décrivez (et écrivez sur machine, avec Python installé) une interface Tkinter minimale : deux listes déroulantes pour choisir le départ et l'arrivée, un bouton « Calculer »,
et une zone de texte affichant la durée et les arrêts. Précisez ce que vous montrerez au jury pendant la démonstration, et les cas de test que vous préparerez.

:::criteres
- Interface cohérente : `tk.Tk`, deux `OptionMenu` (ou `ttk.Combobox`) alimentés par les arrêts triés, un `Button` avec `command=` (sans parenthèses), un `Label` ou `Text` pour le résultat, `mainloop`.
- Gestion des cas : même arrêt, arrêt inaccessible, message clair.
- Démonstration préparée : un cas où le détour est plus rapide que le trajet direct, un cas limite, éventuellement la modification d'une durée pour montrer l'effet.
:::

:::corrige
```python
import tkinter as tk

graphe = charger(open("reseau.csv", encoding="utf-8").read())
arrets = sorted(graphe)

def calculer():
    duree, trajet = itineraire(graphe, depart.get(), arrivee.get())
    if duree is None:
        resultat.config(text="Aucun trajet possible.")
    else:
        resultat.config(text=f"{duree} min : " + " → ".join(trajet))

fenetre = tk.Tk()
fenetre.title("Itinéraires")
depart, arrivee = tk.StringVar(value=arrets[0]), tk.StringVar(value=arrets[1])
tk.OptionMenu(fenetre, depart, *arrets).pack(padx=10, pady=4)
tk.OptionMenu(fenetre, arrivee, *arrets).pack(padx=10, pady=4)
tk.Button(fenetre, text="Calculer", command=calculer).pack(pady=4)
resultat = tk.Label(fenetre, text="", wraplength=300)
resultat.pack(padx=10, pady=10)
fenetre.mainloop()
```
**Démonstration** : Gare → Lycée (7 min par la mairie, alors que la ligne directe dure 9 min : l'intérêt de l'algorithme se voit immédiatement) ; Stade → Stade (0 min) ;
puis, en modifiant le fichier (travaux : Mairie–Lycée passe à 10 min), on relance et l'itinéraire change. Les **tests automatiques** (`assert`) sont montrés à l'écran
avant l'interface.
:::
::::

## L'exposé et l'échange

::::exercice[Construire l'exposé]{niveau=4 duree=40}
Rédigez le plan détaillé de l'exposé de 30 minutes (titres, contenu, durée de chaque partie), en présentant les **documents de façon organisée** (et non l'un après l'autre)
et en mettant en valeur la réalisation.

:::criteres
- Problématique explicite (comment un logiciel trouve-t-il l'itinéraire le plus rapide ?) et plan annoncé.
- Documents mis en relation : le programme (ce qu'on attend des élèves), la méthode (Dijkstra), les données (modélisation par un graphe pondéré).
- Réalisation : modélisation, choix de structures, algorithme et justification (poids positifs), tests, démonstration, coût.
- Limites (temps d'attente aux arrêts, correspondances, horaires, grands réseaux, A*) et prolongement pédagogique (activité débranchée, SNT/NSI) ; conclusion qui répond à la problématique ; minutage réaliste.
:::

:::corrige
**Introduction (3 min)** : les applications d'itinéraire que tout le monde utilise ; problématique : *comment calculer rapidement le trajet le plus court dans un réseau ?* ;
plan. **I. Modéliser (7 min)** : des données (document 3) à un **graphe pondéré** non orienté ; ce que disent les programmes (document 1 : chercher un chemin en terminale,
calculer un itinéraire en SNT) ; pourquoi un parcours en largeur ne suffit pas (il minimise le nombre d'arrêts, pas la durée). **II. L'algorithme de Dijkstra (8 min)** :
principe (document 2), déroulé sur l'exemple Gare → Lycée au tableau, justification (poids positifs : le sommet le plus proche non définitif ne peut plus être amélioré),
coût avec un tas. **III. La réalisation (9 min)** : architecture (chargement, calcul, interface), tests, démonstration (le détour plus rapide que le trajet direct,
modification d'une durée), limites (pas d'horaires ni de correspondances, temps d'attente ignorés ; pour de très grands réseaux, A* et prétraitements). **Conclusion
(3 min)** : réponse à la problématique, et prolongement en classe : une activité débranchée où les élèves déroulent Dijkstra sur le plan des bus de la ville.
:::
::::

::::exercice[Anticiper les questions]{niveau=4 duree=20}
Préparez des réponses brèves à ces questions possibles du jury : (1) « Que se passe-t-il avec un poids négatif ? » (2) « Quelle différence avec un parcours en largeur ? »
(3) « Quel est le coût de votre programme ? » (4) « Comment prendre en compte une correspondance de 3 minutes au Marché ? » (5) « Comment feriez-vous découvrir cet algorithme
à des élèves de terminale ? »

:::criteres
- (1) Dijkstra peut se tromper (un sommet rendu définitif pourrait être amélioré) ; Bellman-Ford convient (sans cycle de poids négatif) ; exemple ou argument.
- (2) Le parcours en largeur minimise le nombre d'arêtes ; il coïncide avec Dijkstra si tous les poids sont égaux.
- (3) $O((S + A)\log S)$ avec un tas ; $O(S^2)$ avec une recherche linéaire du minimum.
- (4) Modélisation enrichie : sommets (arrêt, ligne) et arêtes de correspondance pondérées par 3 minutes.
- (5) Démarche : activité débranchée sur un plan, puis algorithme formalisé, puis programmation ; erreurs anticipées.
:::

:::corrige
(1) Avec un poids négatif, un sommet rendu définitif pourrait encore être amélioré par un chemin passant par l'arête négative : Dijkstra peut renvoyer un résultat faux. On
utilise alors **Bellman-Ford** (s'il n'y a pas de cycle de poids négatif). (2) Le **parcours en largeur** trouve le chemin avec le moins d'**arrêts** ; Dijkstra minimise la
**durée** ; ils coïncident si tous les trajets ont la même durée. (3) Avec un tas : $O((S + A)\log S)$ ; sans tas, en cherchant le minimum par un parcours : $O(S^2)$ — sur ce petit
réseau, c'est immédiat dans les deux cas. (4) On **dédouble** les sommets : un sommet par couple (arrêt, ligne), des arêtes de trajet sur chaque ligne et des arêtes de
**correspondance** de poids 3 entre les sommets d'un même arrêt sur des lignes différentes ; Dijkstra s'applique tel quel au nouveau graphe. (5) Une activité **débranchée** :
sur un plan, les élèves cherchent le trajet le plus rapide, puis on formalise leur stratégie en « tableau de Dijkstra » (distances provisoires, sommet choisi) ; ensuite on
programme, en fournissant le chargement des données ; erreurs anticipées : oublier de rendre un sommet définitif, mettre à jour un sommet déjà définitif, confondre
distance et nombre d'arrêts.
:::
::::
