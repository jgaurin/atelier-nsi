---
titre: Moteurs de recherche, sécurité et droits
resume: "Comment un moteur classe les pages, comment se protéger, et ce que dit le droit."
duree: 35
objectifs:
  - "Expliquer le fonctionnement d'un moteur de recherche"
  - "Analyser les résultats d'un moteur de façon critique"
  - "Maîtriser les réglages de sécurité et de confidentialité"
  - "Connaître des notions juridiques : licence, droit d'auteur, droit d'usage"
prerequis: [snt-web/url-http]
---

Un **moteur de recherche** trouve des pages dont on ne connaît pas l'adresse.

## 1. Trois étapes

1. **Collecter** : des robots parcourent le Web en suivant les liens.
2. **Indexer** : un **index** associe chaque mot aux adresses des pages qui le contiennent.
3. **Classer** : à chaque requête, le moteur construit une liste ordonnée selon la **popularité** et la **pertinence** des pages.

| Mot | Pages |
| --- | --- |
| chat | A, C |
| chien | B, C |

Une page qui reçoit beaucoup de liens est considérée comme populaire.

## 2. Garder un esprit critique

- Les premiers résultats peuvent être des **publicités**.
- Une page bien classée n'est pas forcément vraie : on **vérifie la source**.
- Les recommandations peuvent enfermer dans une **bulle informationnelle**.
- Ce qui est publié peut rester longtemps : c'est la question du **droit à l'oubli**.

## 3. Se protéger

| Risque | Protection |
| --- | --- |
| Cookies de suivi | les refuser ou les effacer |
| Historique conservé | l'effacer, utiliser la navigation privée |
| Programmes malveillants | bloquer les scripts douteux, se méfier des téléchargements |
| **Hameçonnage** : une fausse page réclame tes informations | examiner l'adresse avant de cliquer |

La navigation privée n'efface les traces que **sur ton appareil** : les sites et le réseau peuvent encore te repérer.

## 4. Le droit

- Le **droit d'auteur** protège une œuvre dès sa création.
- Une **licence** indique ce qu'on a le droit de faire avec. Les licences **Creative Commons** autorisent certains usages, à condition par exemple de citer l'auteur.
- Le **droit d'usage** permet d'utiliser un bien sans le posséder, comme un film acheté en streaming.
- Un bien numérique a une **valeur**, même si le copier ne coûte presque rien.

## L'essentiel

- Moteur : collecter, indexer, classer.
- Vérifier les sources, repérer les publicités.
- Examiner l'adresse d'un lien, gérer ses cookies et son historique.
- Une œuvre est protégée : la licence dit ce qui est permis.

## Exercices

::::exercice[Les étapes d'un moteur]{niveau=1 type=ordre}
Remets ces étapes dans l'ordre.

1. Des robots parcourent le Web.
1. Le moteur associe chaque mot aux pages qui le contiennent.
1. Un internaute fait une requête.
1. Le moteur renvoie une liste ordonnée de pages.
::::

::::exercice[Quel risque ?]{niveau=1 type=associer}
Associe chaque situation à la notion correspondante.

| Situation | Notion |
| --- | --- |
| Un faux site de banque demande ton mot de passe | hameçonnage |
| Un site retient tes visites grâce à un petit fichier | cookie |
| On te montre seulement des avis proches des tiens | bulle informationnelle |
| Une photo te permet une réutilisation en citant son auteur | licence Creative Commons |
::::

::::exercice[Construire un index]{niveau=2 type=reponses}
Trois pages contiennent ces mots : A (chat, souris), B (chien, chat), C (souris, fromage).

1. Quelles pages contiennent `chat` ? Écris-les séparées par une virgule, dans l'ordre alphabétique.

   - A, B
   - A,B

1. Quelles pages contiennent `souris` ? Écris-les de la même façon.

   - A, C
   - A,C

1. Quelle page contient à la fois `chat` et `chien` ?

   - B

1. A reçoit 2 liens, B reçoit 7 liens et C reçoit 1 lien. Parmi les pages qui contiennent `chat`, laquelle est la plus populaire ?

   - B
::::

::::exercice[Un message suspect]{niveau=3}
Lina reçoit ce message : « Votre compte ENT sera fermé aujourd'hui. Cliquez vite sur ce lien. » En survolant le lien, elle lit `http://ent-lycee.secure-login.exemple.net/connexion`. Le vrai site est `https://ent.lycee.exemple.fr`.

1. Donne trois indices qui montrent qu'il peut s'agir d'hameçonnage.
2. Que doit-elle faire ?
3. Elle veut illustrer un exposé avec une photo trouvée sur un moteur de recherche. A-t-elle automatiquement le droit de l'utiliser ? Que doit-elle vérifier ?
4. Elle utilise la navigation privée au lycée. Le réseau du lycée peut-il encore voir les sites visités ? Justifie.

:::criteres
- L'urgence, le nom de domaine différent, l'absence de chiffrement.
- Ne pas cliquer, aller sur le vrai site, signaler le message.
- Non : l'image est protégée, il faut vérifier sa licence.
- Oui : la navigation privée agit seulement sur les traces de l'appareil.
:::

:::corrige
1. Le message crée une **urgence**. L'adresse n'est pas celle du vrai domaine `lycee.exemple.fr`. Elle commence par `http`, donc les échanges ne sont pas chiffrés.
2. Ne pas cliquer, se connecter en tapant soi-même la vraie adresse, et signaler le message.
3. Non. Une image est protégée par le **droit d'auteur** : elle doit vérifier sa **licence**, et citer l'auteur si la licence l'exige.
4. Oui. La navigation privée limite seulement les traces gardées sur l'appareil : le réseau peut toujours voir les connexions.
:::
::::
