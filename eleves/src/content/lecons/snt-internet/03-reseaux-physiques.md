---
titre: Réseaux physiques et pair-à-pair
resume: "Internet fonctionne sur de nombreux réseaux physiques. Les ordres de grandeur, et l'intérêt du pair-à-pair."
duree: 30
objectifs:
  - "Caractériser quelques types de réseaux physiques"
  - "Situer l'ordre de grandeur du trafic sur Internet"
  - "Décrire l'intérêt et les usages illicites du pair-à-pair"
prerequis: [snt-internet/tcp-ip]
---

Internet fonctionne aussi bien par la fibre que par la 4G ou le Wi-Fi. Comment est-ce possible ? Parce que ses protocoles sont des **logiciels**, installés dans chaque appareil : ils peuvent fonctionner sur n'importe quel réseau physique, comme une lettre peut voyager en camion, en train ou en avion.

## 1. Les réseaux physiques

| Réseau | Support | Débit, en ordre de grandeur |
| --- | --- | --- |
| Modem téléphonique (obsolète) | filaire | 50 kbit/s |
| ADSL | filaire, par la ligne téléphonique | 10 Mbit/s |
| Fibre optique | filaire, par la lumière | 1 Gbit/s |
| Ethernet | filaire, en câble réseau | 1 Gbit/s |
| Wi-Fi | sans fil | 100 Mbit/s |
| 4G | sans fil | 50 Mbit/s |
| Bluetooth | sans fil, à courte portée | 2 Mbit/s |

Le **débit** mesure la quantité de données transmise chaque seconde, en **bits par seconde**. 1 Mbit/s vaut un million de bits par seconde, et 1 Gbit/s vaut mille Mbit/s.

## 2. Calculer un temps de téléchargement

:::methode[Trois étapes]
1. Convertir la taille du fichier en bits : 1 octet = 8 bits.
2. Diviser par le débit.
3. Vérifier les unités : des Mbit divisés par des Mbit/s donnent des secondes.
:::

:::exemple
Un fichier de 100 Mo.

1. 100 Mo = 100 × 8 = **800 Mbit**.
2. Avec l'ADSL, à 10 Mbit/s : 800 ÷ 10 = **80 secondes**.
3. Avec la fibre, à 1 000 Mbit/s : 800 ÷ 1 000 = **0,8 seconde**.
:::

:::attention
Les tailles de fichiers sont en **octets**, les débits en **bits**. Oublier la multiplication par 8 donne un temps huit fois trop court.
:::

## 3. Le trafic sur Internet

Le trafic prévu pour 2021 était de 3,3 × 10²¹ octets dans l'année, soit 3 300 milliards de milliards d'octets. Il ne cesse d'augmenter, surtout à cause de la vidéo, qui représente la plus grande part du trafic.

## 4. Le pair-à-pair

Dans un réseau classique, tout le monde télécharge depuis un **serveur unique**, qui peut être saturé. Dans un réseau **pair-à-pair**, chaque ordinateur est à la fois **émetteur et récepteur** : dès qu'il a reçu un morceau de fichier, il peut le transmettre aux autres.

:::exemple
1 000 personnes veulent une vidéo de 1 Go. Avec un serveur unique, il doit envoyer 1 000 Go. En pair-à-pair, chacun récupère des morceaux auprès de plusieurs autres participants : le travail est réparti entre tous.
:::

Le pair-à-pair sert à distribuer légalement de gros fichiers, comme des logiciels libres. Il est aussi utilisé de façon **illicite**, pour partager des films ou de la musique sans l'accord de leurs auteurs.

## 5. Les enjeux

- La **neutralité du Net** : les routeurs doivent transmettre les paquets **sans tenir compte de leur contenu**. Un opérateur ne devrait pas ralentir un service pour en favoriser un autre.
- Le **déni de service** : une attaque qui envoie un très grand nombre de messages à un site, pour le saturer et le rendre inaccessible.

## L'essentiel

- Internet fonctionne sur tout réseau physique, car ses protocoles sont des logiciels.
- Temps = taille en bits ÷ débit, avec 1 octet = 8 bits.
- Pair-à-pair : chaque machine émet et reçoit ; légal ou illicite selon ce qu'on partage.
- Neutralité du Net : aucun contenu n'est privilégié.

## Exercices

::::exercice[Filaire ou sans fil ?]{niveau=1 type=associer}
Classe chaque réseau.

| Réseau | Type |
| --- | --- |
| Fibre optique | filaire |
| 4G | sans fil |
| ADSL | filaire |
| Wi-Fi | sans fil |
::::

::::exercice[Convertir]{niveau=1 type=reponses}
Rappel : 1 octet = 8 bits, et 1 Mo = 1 million d'octets.

1. Combien de bits y a-t-il dans 5 octets ?

   ```python calcul
   print(5 * 8)
   ```

   - 40

1. Combien de Mbit y a-t-il dans un fichier de 50 Mo ?

   ```python calcul
   print(50 * 8)
   ```

   - 400
::::

::::exercice[Quel réseau ?]{niveau=2 type=completer}
Complète le temps de téléchargement d'un fichier de 500 Mo, soit 4 000 Mbit.

```python calcul
print(4000 // 10)
print(4000 // 50)
print(4000 // 1000)
```

| Réseau | Débit | Temps, en secondes |
| --- | --- | --- |
| ADSL | 10 Mbit/s | [[400]] |
| 4G | 50 Mbit/s | [[80]] |
| Fibre | 1 000 Mbit/s | [[4]] |
::::

::::exercice[Partager une vidéo de cours]{niveau=3}
Un professeur veut distribuer une vidéo de 1 Go à 1 000 élèves. Il hésite entre un serveur unique et le pair-à-pair.

1. Avec un serveur unique, quelle quantité de données le serveur doit-il envoyer au total ?
2. Explique comment le pair-à-pair réduit le travail de la première machine.
3. La vidéo appartient au professeur. Ce partage est-il légal ? Dans quel cas le même système serait-il illégal ?
4. Un opérateur décide de ralentir les vidéos, mais pas les courriels. Quel principe remet-il en cause ?

:::criteres
- 1 000 Go au total.
- Chaque élève qui a des morceaux les renvoie aux autres.
- Légal si l'auteur l'autorise, illégal sans son accord.
- La neutralité du Net.
:::

:::corrige
1. 1 000 × 1 Go = **1 000 Go**.
2. Chaque machine récupère des morceaux, puis les transmet aux autres : la vidéo vient de plusieurs sources, et non d'un seul serveur.
3. Oui, car le professeur en est l'auteur et l'autorise. Partager un film sans l'accord de ses ayants droit serait illégal.
4. La **neutralité du Net** : les paquets doivent être transmis indépendamment de leur contenu.
:::
::::
