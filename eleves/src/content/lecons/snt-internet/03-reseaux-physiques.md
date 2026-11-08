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

Les protocoles d'Internet sont des **logiciels**. Ils peuvent donc fonctionner sur n'importe quel réseau physique.

## 1. Les réseaux physiques

| Réseau | Support | Débit, en ordre de grandeur |
| --- | --- | --- |
| Modem téléphonique (obsolète) | filaire | 50 kbit/s |
| ADSL | filaire | 10 Mbit/s |
| Fibre optique | filaire | 1 Gbit/s |
| Ethernet | filaire | 1 Gbit/s |
| Wi-Fi | sans fil | 100 Mbit/s |
| 4G | sans fil | 50 Mbit/s |
| Bluetooth | sans fil | 2 Mbit/s |

Un octet vaut 8 bits. Pour estimer un temps : **temps = taille en bits ÷ débit**.

:::exemple
Un fichier de 100 Mo fait 800 Mbit. À 10 Mbit/s, il faut 800 ÷ 10 = **80 secondes**.
:::

## 2. Le trafic

Le trafic prévu pour 2021 était de 3,3 × 10²¹ octets par an, soit 3 300 milliards de milliards d'octets. Il ne cesse d'augmenter, surtout à cause de la vidéo.

## 3. Le pair-à-pair

Dans un réseau **pair-à-pair**, chaque ordinateur est à la fois **émetteur et récepteur**. Un fichier est récupéré par morceaux auprès de plusieurs machines : on ne dépend pas d'un seul serveur.

Ce système sert à distribuer légalement de gros fichiers, mais aussi, de façon **illicite**, à partager des œuvres sans l'accord de leurs auteurs.

## 4. Les enjeux

- La **neutralité du Net** : les routeurs transmettent les paquets indépendamment de leur contenu.
- Le **déni de service** : un site est saturé par un très grand nombre de messages.

## L'essentiel

- Internet fonctionne sur tout réseau physique.
- Temps = taille en bits ÷ débit, avec 1 octet = 8 bits.
- Pair-à-pair : chaque machine émet et reçoit.
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
