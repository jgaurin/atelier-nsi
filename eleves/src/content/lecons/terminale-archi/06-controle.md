---
titre: Contrôle du chapitre
resume: "Un contrôle d'une heure noté sur 20 sur les systèmes, le routage et la sécurité."
duree: 60
controle: true
objectifs:
  - "Dérouler un ordonnancement"
  - "Trouver une route selon RIP ou OSPF"
  - "Décrire la sécurisation d'HTTPS"
prerequis: [terminale-archi/chiffrement]
---

## Consignes

Durée : **1 heure**. Le contrôle est noté sur **20 points**.

## Exercices

::::exercice[Questions de cours]{niveau=3 type=quiz points=4}
Huit questions, chacune sur 0,5 point.

1. Un processus attend la fin d'une lecture sur le disque. Il est :

   - [ ] élu
   - [ ] prêt
   - [x] bloqué
   - [ ] terminé

   > Il attend une ressource.

1. Quel est un avantage d'un système sur puce ?

   - [x] une faible consommation
   - [ ] la possibilité de changer chaque composant
   - [ ] une grande taille
   - [ ] l'absence de processeur

   > Il est économe et compact.

1. RIP choisit la route :

   - [x] avec le moins de sauts
   - [ ] de coût minimal selon le débit
   - [ ] la plus récente
   - [ ] au hasard

   > Le débit n'est pas pris en compte.

1. Le coût OSPF d'une liaison dépend :

   - [ ] du nombre de routeurs
   - [x] du débit de la liaison
   - [ ] de l'adresse IP
   - [ ] de la distance en kilomètres

   > Coût = 10⁸ / débit.

1. Dans un chiffrement asymétrique, on chiffre avec :

   - [x] la clé publique du destinataire
   - [ ] sa propre clé privée
   - [ ] la clé privée du destinataire
   - [ ] aucune clé

   > Le destinataire déchiffre avec sa clé privée.

1. Dans HTTPS, l'essentiel des données est chiffré :

   - [x] en symétrique
   - [ ] en asymétrique
   - [ ] sans clé
   - [ ] par le routeur

   > Le symétrique est bien plus rapide.

1. Un interblocage se repère à :

   - [ ] un processus terminé
   - [x] un cycle d'attente
   - [ ] un processeur rapide
   - [ ] un quantum trop long

   > Chacun attend une ressource détenue par un autre.

1. À quoi sert un certificat ?

   - [x] à garantir que la clé publique appartient bien au serveur
   - [ ] à accélérer la connexion
   - [ ] à stocker les mots de passe
   - [ ] à choisir un routeur

   > Il empêche un intermédiaire de se faire passer pour le serveur.
::::

::::exercice[Ordonnancement]{niveau=3 type=completer points=6}
Politique : premier arrivé, premier servi. Chaque case vaut 1 point.

```python calcul
t = 0
for a, d in [(0, 3), (1, 5), (4, 2)]:
    t = max(t, a) + d
    print(t)
    print(t - a)
```

| Processus | Arrivée | Durée | Fin | Temps de séjour |
| --- | --- | --- | --- | --- |
| P1 | 0 | 3 | [[3]] | [[3]] |
| P2 | 1 | 5 | [[8]] | [[7]] |
| P3 | 4 | 2 | [[10]] | [[6]] |
::::

::::exercice[Routage]{niveau=3 type=completer points=6}
Routes de R1 vers R4 : par R2 (deux liaisons à 1 Mbit/s) ; par R3 et R5 (trois liaisons à 10 Mbit/s). On prend coût = 10⁸ / débit. Chaque case vaut 1 point. Pour les routes, écris `R1 R2 R4` ou `R1 R3 R5 R4`.

```python calcul
print(2)
print(200)
print(3)
print(30)
print("R1 R2 R4")
print("R1 R3 R5 R4")
```

| Route | Sauts | Coût |
| --- | --- | --- |
| Par R2 | [[2]] | [[200]] |
| Par R3 et R5 | [[3]] | [[30]] |

Route choisie par RIP : [[R1 R2 R4]]

Route choisie par OSPF : [[R1 R3 R5 R4]]
::::

::::exercice[HTTPS]{niveau=3 points=4}
Explique pourquoi HTTPS utilise à la fois le chiffrement asymétrique et le chiffrement symétrique.

:::criteres
- 2 points : l'asymétrique permet d'échanger une clé sans secret partagé au préalable.
- 2 points : le symétrique, beaucoup plus rapide, chiffre ensuite les données.
:::

:::corrige
Le navigateur et le serveur ne partagent aucun secret au départ : le chiffrement asymétrique leur permet de s'échanger une clé de session en toute sécurité. Comme il est très lent, on l'abandonne ensuite : toutes les données sont chiffrées en symétrique avec cette clé.
:::
::::
