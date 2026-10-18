---
titre: "SNT : photographie numérique et objets connectés"
resume: Deux thèmes de SNT pour l'enseignant — de la lumière au fichier image (capteur, pixels, couleurs, formats, traitements, métadonnées) et les systèmes embarqués (capteurs, actionneurs, microcontrôleurs, boucle de commande, objets connectés) — avec programmes Python et activités.
duree: 60
objectifs:
  - Expliquer la chaîne de la photographie numérique et calculer la taille d'une image
  - Programmer des traitements d'image simples (niveaux de gris, négatif, seuillage, flou)
  - Décrire un système embarqué (capteurs, actionneurs, microcontrôleur, interface) et programmer une boucle de commande
  - Concevoir des activités et aborder les enjeux (vie privée, retouches, sécurité et sobriété des objets connectés)
prerequis: [representation/bases, python/listes]
programme: [snt-photo, snt-objets, snt-programmation]
cartes:
  - q: Définition et résolution d'une image ?
    r: "La **définition** est le nombre de pixels (4 000 × 3 000, soit 12 mégapixels) ; la **résolution** est une densité de pixels (pixels par pouce, ppp), qui dépend de la taille d'affichage ou d'impression."
  - q: Taille d'une image non compressée en RVB 24 bits ?
    r: "Largeur × hauteur × 3 octets : 4 000 × 3 000 × 3 = 36 millions d'octets (36 Mo), d'où l'intérêt de la compression (JPEG : souvent 10 fois moins)."
  - q: Comment passer une couleur RVB en niveau de gris ?
    r: "On calcule une luminance pondérée, par exemple $0{,}299 R + 0{,}587 G + 0{,}114 B$ (l'œil est plus sensible au vert), puis on met cette valeur dans les trois canaux."
  - q: JPEG ou PNG ?
    r: "JPEG : compression **avec perte**, efficace pour les photographies. PNG : compression **sans perte**, adaptée aux schémas, captures d'écran, transparence."
  - q: Capteur et matrice de Bayer ?
    r: "Chaque photosite du capteur ne mesure qu'une intensité lumineuse ; un filtre coloré en mosaïque (Bayer : 50 % vert, 25 % rouge, 25 % bleu) permet de reconstituer les couleurs par interpolation (dématriçage)."
  - q: Qu'est-ce qu'un système embarqué ?
    r: "Un système informatique intégré à un objet, dédié à une tâche : un **microcontrôleur** lit des **capteurs**, exécute un programme (souvent une boucle infinie) et commande des **actionneurs**, avec une interface homme-machine."
  - q: Pourquoi un thermostat utilise-t-il une hystérésis ?
    r: "Avec un seul seuil, le chauffage s'allumerait et s'éteindrait sans cesse autour de la consigne ; avec deux seuils (allumer sous 19 °C, éteindre au-dessus de 21 °C), on évite ces oscillations."
---

Deux thèmes de SNT parlent d'objets que les élèves ont en poche : l'**appareil photo** du téléphone et les **objets connectés** (montre, enceinte, capteurs
domestiques). Ils permettent de faire beaucoup de programmation concrète — une image n'est qu'un tableau de nombres, un objet connecté n'est qu'une boucle qui
lit des capteurs — tout en ouvrant sur des questions de société.

## 1. La photographie numérique

```mermaid legende="De la lumière au fichier : la chaîne de la photographie numérique"
flowchart LR
  L["lumière"] --> O["objectif"]
  O --> C["capteur : photosites<br/>+ filtres de Bayer"]
  C --> N["conversion<br/>analogique → numérique"]
  N --> T["traitements : dématriçage,<br/>balance des blancs, réduction du bruit…"]
  T --> F["fichier : JPEG/HEIF<br/>+ métadonnées EXIF"]
```

:::definition
- Une image numérique est un **tableau de pixels** ; sa **définition** est le nombre de pixels (largeur × hauteur). La **résolution** (en pixels par pouce)
  relie la définition à une taille physique d'affichage ou d'impression.
- En **RVB** (rouge, vert, bleu) sur 24 bits, chaque pixel a trois composantes de 0 à 255 : $256^3 \approx 16{,}7$ millions de couleurs. Une image de 12
  mégapixels pèse donc 36 Mo sans compression.
- Les formats **compressent** : **JPEG** avec perte (on supprime des détails peu visibles), **PNG** sans perte. Les **métadonnées EXIF** (date, appareil,
  réglages, coordonnées GPS) sont rangées dans le fichier.
:::

Le capteur ne voit pas les couleurs : chaque **photosite** mesure une quantité de lumière à travers un filtre rouge, vert ou bleu disposé en mosaïque (**matrice de
Bayer** : deux fois plus de vert, car l'œil y est plus sensible). Les deux composantes manquantes de chaque pixel sont **interpolées** à partir des voisins. Les
téléphones vont plus loin : ils fusionnent plusieurs prises (HDR, mode nuit) — on parle de **photographie computationnelle**, où les algorithmes comptent
autant que l'optique.

## 2. Traiter une image

Une image en mémoire est un tableau de lignes de pixels ; un traitement est une boucle sur les pixels.

```python exec
image = [  # 3 lignes × 4 pixels (R, V, B)
    [(255, 0, 0), (0, 255, 0), (0, 0, 255), (255, 255, 255)],
    [(120, 60, 30), (200, 200, 50), (0, 0, 0), (90, 90, 90)],
    [(250, 128, 114), (34, 139, 34), (70, 130, 180), (255, 215, 0)],
]

def niveaux_de_gris(img):
    return [[(g, g, g) for (r, v, b) in ligne for g in [round(0.299 * r + 0.587 * v + 0.114 * b)]] for ligne in img]

def negatif(img):
    return [[(255 - r, 255 - v, 255 - b) for (r, v, b) in ligne] for ligne in img]

print(niveaux_de_gris(image)[0])
print(negatif(image)[1])
```

D'autres traitements classiques : le **seuillage** (noir ou blanc selon la luminance), la modification de **luminosité** et de **contraste**, la **symétrie**, et
les **filtres** de voisinage (flou par moyenne des voisins, détection de contours par différences) — c'est le principe des « convolutions » utilisées aussi en
intelligence artificielle.

## 3. Les objets connectés et l'informatique embarquée

:::definition
Un **système embarqué** est un système informatique intégré à un objet et dédié à une tâche. Il comporte :
- des **capteurs** (température, lumière, accélération, bouton…) qui mesurent le monde ;
- un **microcontrôleur** (processeur, mémoire et entrées-sorties sur une seule puce) qui exécute le programme ;
- des **actionneurs** (moteur, LED, haut-parleur, relais) qui agissent sur le monde ;
- une **interface homme-machine** (boutons, écran) et, pour un objet **connecté**, une liaison réseau (Bluetooth, Wi-Fi, réseaux basse consommation).
:::

Le programme d'un objet est presque toujours une **boucle infinie** : lire les capteurs, décider, commander les actionneurs, recommencer. En classe, on utilise
des cartes programmables en Python (micro:bit, Raspberry Pi Pico, cartes Arduino…).

```python exec
def thermostat(temperatures, bas=19, haut=21):
    """Boucle de commande avec hystérésis : allume sous 'bas', éteint au-dessus de 'haut'."""
    chauffe, journal = False, []
    for t in temperatures:          # une mesure par passage dans la boucle
        if t < bas:
            chauffe = True
        elif t > haut:
            chauffe = False
        journal.append("ON" if chauffe else "off")
    return journal

mesures = [20.0, 19.5, 18.8, 19.4, 20.3, 21.2, 20.6, 19.9, 18.9]
print(list(zip(mesures, thermostat(mesures))))
```

:::attention[Les enjeux des objets connectés]
**Sécurité** (mots de passe par défaut jamais changés, objets jamais mis à jour : des millions de caméras piratées ont servi à des attaques), **vie privée**
(enceintes qui écoutent, montres qui mesurent la santé), **sobriété** (fabrication et énergie de milliards d'objets), **dépendance** aux serveurs du fabricant
(un objet devient inutilisable quand le service s'arrête).
:::

:::prof
Photographie : faire photographier une même scène, comparer les tailles de fichiers et les métadonnées, puis programmer des filtres (avec la bibliothèque
PIL/Pillow, ou sur des petites images textuelles comme ci-dessus). Objets connectés : une carte micro:bit par binôme suffit pour faire une station météo, un
podomètre ou une alarme ; on fait d'abord **décrire** le système (capteurs, actionneurs, interface) avant de programmer, et l'on termine par l'analyse des données
envoyées par un objet du commerce.
:::

## Exemple guidé

**Problème.** Un élève photographie un document mal éclairé ; on veut le rendre lisible en **noir et blanc** par seuillage. Quel seuil choisir ?

**1. Niveaux de gris**, puis **histogramme** (combien de pixels pour chaque niveau) : un document a deux « bosses », le fond clair et l'encre sombre.

**2. Choisir le seuil** entre les deux bosses : une méthode simple prend la **moyenne** des niveaux ; la méthode d'Otsu cherche le seuil qui sépare au mieux les
deux groupes.

```python exec
import random

rng = random.Random(3)
# Un « document » de 20 × 30 pixels : fond gris clair bruité, quelques traits d'encre sombre
gris = [[rng.randint(150, 210) for _ in range(30)] for _ in range(20)]
for i in range(5, 15):
    for j in range(4, 26, 3):
        gris[i][j] = rng.randint(20, 70)

valeurs = [g for ligne in gris for g in ligne]
seuil = sum(valeurs) / len(valeurs)
noir_et_blanc = [[0 if g < seuil else 255 for g in ligne] for ligne in gris]
print("seuil :", round(seuil), "| pixels noirs :", sum(row.count(0) for row in noir_et_blanc), "sur", len(valeurs))
for ligne in noir_et_blanc[4:16]:
    print("".join("█" if p == 0 else "·" for p in ligne))
```

**3. Discuter.** Avec un éclairage inégal (un côté plus sombre), un seuil global échoue : on utilise alors un seuil **local** (calculé sur le voisinage de
chaque pixel). C'est ce que font les applications de numérisation de documents.

## L'essentiel

- Photo : capteur (photosites, Bayer, dématriçage), pixels, définition vs résolution, RVB 24 bits (36 Mo pour 12 Mpx), JPEG (avec perte) / PNG (sans perte), EXIF.
- Traitements = boucles sur les pixels : niveaux de gris ($0{,}299R + 0{,}587G + 0{,}114B$), négatif, seuillage, filtres de voisinage ; photographie computationnelle.
- Système embarqué : capteurs → microcontrôleur → actionneurs, interface, réseau ; programme = boucle infinie de commande ; hystérésis.
- Enjeux : vie privée (EXIF, micros), retouches et images truquées, sécurité et mises à jour, sobriété.

## Exercices

::::exercice[Poids d'une image]{niveau=1}
Quelle est la taille, sans compression, d'une image de 1 920 × 1 080 pixels en RVB 24 bits ?

- [ ] environ 2 Mo
- [x] environ 6,2 Mo
- [ ] environ 50 Mo
- [ ] 24 Mo

:::corrige
$1\,920 \times 1\,080 = 2\,073\,600$ pixels, × 3 octets = 6 220 800 octets ≈ 6,2 Mo.
:::
::::

::::exercice[Capteur ou actionneur ?]{niveau=1}
Dans une serre connectée, lequel de ces éléments est un actionneur ?

- [ ] la sonde d'humidité du sol
- [ ] le capteur de luminosité
- [x] la pompe d'arrosage
- [ ] le microcontrôleur

:::corrige
L'actionneur **agit** sur le monde (la pompe arrose) ; les capteurs **mesurent** ; le microcontrôleur **décide**.
:::
::::

::::exercice[Traitements de pixels]{niveau=2}
Une image est une liste de lignes de pixels `(r, v, b)`. Écris `gris(img)` (luminance $0{,}299r + 0{,}587v + 0{,}114b$ arrondie, mise dans les trois canaux),
`seuiller(img, s)` (pixel blanc `(255, 255, 255)` si la luminance est ≥ `s`, noir sinon) et `miroir(img)` (symétrie gauche-droite). Les fonctions renvoient
de nouvelles images.

```python depart
def gris(img):
    ...

def seuiller(img, s):
    ...

def miroir(img):
    ...
```

```python tests
img = [[(255, 0, 0), (0, 255, 0)], [(0, 0, 255), (200, 200, 200)]]
assert gris(img) == [[(76, 76, 76), (150, 150, 150)], [(29, 29, 29), (200, 200, 200)]], "niveaux de gris"
assert seuiller(img, 100) == [[(0, 0, 0), (255, 255, 255)], [(0, 0, 0), (255, 255, 255)]], "seuillage"
assert miroir(img) == [[(0, 255, 0), (255, 0, 0)], [(200, 200, 200), (0, 0, 255)]], "miroir"
assert img[0][0] == (255, 0, 0), "l'image d'origine n'est pas modifiée"
```

:::corrige
```python solution
def luminance(p):
    r, v, b = p
    return round(0.299 * r + 0.587 * v + 0.114 * b)

def gris(img):
    return [[(luminance(p),) * 3 for p in ligne] for ligne in img]

def seuiller(img, s):
    return [[(255, 255, 255) if luminance(p) >= s else (0, 0, 0) for p in ligne] for ligne in img]

def miroir(img):
    return [ligne[::-1] for ligne in img]
```
Une fonction auxiliaire `luminance` évite de répéter la formule. Les compréhensions de listes créent de **nouvelles** listes : l'image d'origine reste intacte
(attention aux références si l'on modifiait les lignes en place).
:::
::::

::::exercice[Un thermostat]{niveau=2}
Écris `commande(temperatures, bas, haut)` qui simule un thermostat à hystérésis (chauffage allumé quand la température passe **strictement** sous `bas`, éteint
quand elle passe **strictement** au-dessus de `haut`, inchangé entre les deux ; éteint au départ) et renvoie le **nombre de démarrages** du chauffage.

```python depart
def commande(temperatures, bas, haut):
    ...
```

```python tests
mesures = [20.0, 19.5, 18.8, 19.4, 20.3, 21.2, 20.6, 19.9, 18.9]
assert commande(mesures, 19, 21) == 2, "deux démarrages avec hystérésis"
oscillant = [19.9, 20.1, 19.8, 20.2, 19.9, 20.1, 18.9, 21.3]
assert commande(oscillant, 20, 20) == 4 and commande(oscillant, 19, 21) == 1, "un seul seuil : beaucoup plus de démarrages"
assert commande([22, 23, 24], 19, 21) == 0, "jamais froid"
assert commande([18, 18, 18], 19, 21) == 1, "allumé une seule fois"
```

:::corrige
```python solution
def commande(temperatures, bas, haut):
    chauffe, demarrages = False, 0
    for t in temperatures:
        if t < bas and not chauffe:
            chauffe = True
            demarrages += 1
        elif t > haut and chauffe:
            chauffe = False
    return demarrages
```
Avec un seul seuil (20 °C), le chauffage redémarre à chaque petite oscillation autour de la consigne : usure du matériel, inconfort. L'écart entre les deux
seuils (l'**hystérésis**) fixe un compromis entre stabilité de la température et nombre de démarrages.
:::
::::

::::exercice[Un filtre de flou]{niveau=3}
Écris `flou(gris)` qui reçoit une image en niveaux de gris (liste de lignes d'entiers) et renvoie une nouvelle image où chaque pixel est remplacé par la
**moyenne arrondie** des pixels de son voisinage 3 × 3 (lui compris) **qui existent** (sur les bords, le voisinage est plus petit).

```python depart
def flou(gris):
    ...
```

```python tests
assert flou([[0, 0, 0], [0, 90, 0], [0, 0, 0]]) == [[22, 15, 22], [15, 10, 15], [22, 15, 22]], "point lumineux étalé"
assert flou([[50] * 4 for _ in range(3)]) == [[50] * 4 for _ in range(3)], "image uniforme inchangée"
assert flou([[100]]) == [[100]], "un seul pixel"
img = [[0, 255], [255, 0]]
assert flou(img) == [[128, 128], [128, 128]] and img == [[0, 255], [255, 0]], "nouvelle image"
```

:::corrige
```python solution
def flou(gris):
    h, l = len(gris), len(gris[0])
    resultat = []
    for i in range(h):
        ligne = []
        for j in range(l):
            voisins = [gris[a][b] for a in range(i - 1, i + 2) for b in range(j - 1, j + 2)
                       if 0 <= a < h and 0 <= b < l]
            ligne.append(round(sum(voisins) / len(voisins)))
        resultat.append(ligne)
    return resultat
```
Chaque pixel est remplacé par une moyenne de son voisinage : les détails (et le bruit) s'atténuent. C'est une **convolution** par un noyau 3 × 3 de coefficients
égaux ; d'autres noyaux détectent les contours. Il faut lire les valeurs dans l'image **d'origine** et écrire dans une nouvelle : sinon les pixels déjà floutés
fausseraient les suivants. (Dans le premier test, le coin a 4 voisins dont le 90 : 90/4 = 22,5, arrondi à 22 — Python arrondit les demis au pair.)
:::
::::

::::exercice[Concevoir un mini-projet « objet connecté »]{niveau=4 duree=25}
Vous proposez à une classe de seconde un mini-projet de 3 séances : réaliser avec une carte micro:bit une « station de mesure » pour la salle de classe.

1. Décrivez le système attendu (capteurs, actionneurs, interface, données produites) et un cahier des charges minimal.
2. Découpez le travail en étapes, avec ce qui est attendu à la fin de chaque séance.
3. Quelles notions du programme de SNT sont travaillées ? Quels enjeux abordez-vous pour finir ?
4. Comment gérez-vous l'hétérogénéité (élèves très à l'aise et élèves en difficulté) ?

:::criteres
- Système cohérent : capteurs disponibles (température, luminosité, bouton), actionneurs (LED, son), interface (affichage, boutons), données (mesures horodatées, envoi radio ou série) ; cahier des charges réaliste.
- Découpage progressif : prise en main et lecture d'un capteur, boucle avec seuil et alerte, enregistrement/transmission et exploitation des données.
- Notions : capteur, actionneur, microcontrôleur, interface homme-machine, programmation (boucle, condition, variables), données ; enjeux (vie privée, consommation, durée de vie, sécurité des objets connectés).
- Différenciation concrète : fiches d'aide graduées, défis supplémentaires, binômes, code à compléter.
:::

:::corrige
1. **Station de mesure** : capteurs de **température** et de **luminosité** (intégrés à la carte), **boutons** ; actionneurs : **matrice de LED** (affichage) et
   éventuellement **haut-parleur** (alerte) ; interface : un bouton affiche la température, l'autre la luminosité ; données : une mesure par minute, horodatée,
   transmise par liaison série (ou radio vers une autre carte). Cahier des charges minimal : afficher les mesures à la demande, alerter si la température dépasse
   un seuil réglable, enregistrer une série de mesures.
2. **Séance 1** : prise en main (afficher un texte, lire un capteur), puis afficher la température à l'appui d'un bouton — attendu : programme qui fonctionne.
   **Séance 2** : boucle de mesure, seuil d'alerte (avec hystérésis pour les plus rapides), choix du seuil par boutons — attendu : alerte fonctionnelle et
   décrite par un schéma « capteurs → décision → actionneurs ». **Séance 3** : enregistrement d'une série de mesures, transfert vers l'ordinateur, tracé de la
   courbe (tableur ou Python), présentation rapide de chaque binôme.
3. Notions : **capteurs**, **actionneurs**, **microcontrôleur**, **interface homme-machine**, programmation (boucle infinie, conditions, variables, fonctions),
   **données** (mesures, horodatage, format). Enjeux en fin de projet : si cette station envoyait ses données sur Internet, qui y aurait accès ? que deviennent les
   objets connectés quand le fabricant arrête ses serveurs ? quel coût énergétique et matériel pour des milliards d'objets ?
4. Code de départ **à compléter** pour les élèves en difficulté et fiches d'aide graduées (indice, puis exemple, puis solution partielle) ; **défis** pour les
   plus rapides (hystérésis, moyenne glissante, communication radio entre deux cartes) ; binômes constitués pour s'entraider sans que l'un fasse tout (rôles qui
   alternent au clavier).
:::
::::
