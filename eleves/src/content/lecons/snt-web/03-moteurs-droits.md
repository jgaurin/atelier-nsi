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

Un moteur de recherche trouve en une fraction de seconde des pages dont tu ignorais l'existence, parmi des milliards. Comment fait-il ? Et que faut-il savoir pour l'utiliser sans risque ?

## 1. Les trois étapes d'un moteur de recherche

**1. Collecter.** Des programmes, appelés **robots**, parcourent le Web sans arrêt. Ils partent de pages connues, suivent leurs liens, puis les liens de ces nouvelles pages, et ainsi de suite.

**2. Indexer.** Le moteur ne relit pas tout le Web à chaque recherche : ce serait bien trop long. Il prépare à l'avance un **index**, qui associe à chaque mot les adresses des pages qui le contiennent, comme l'index à la fin d'un livre.

| Mot | Pages qui le contiennent |
| --- | --- |
| chat | A, C |
| chien | B, C |

**3. Classer.** Quand tu cherches « chat chien », le moteur lit dans l'index les pages qui contiennent les deux mots : ici, la page C. S'il y en a beaucoup, il les classe selon leur **pertinence** (les mots sont-ils dans le titre ?) et leur **popularité** : une page vers laquelle beaucoup d'autres pages font des liens est jugée importante.

## 2. Garder un esprit critique

- Les premiers résultats sont parfois des **publicités** : des sites paient pour apparaître en haut.
- Une page bien classée n'est pas forcément **vraie** : on vérifie qui l'a écrite, et on compare plusieurs sources.
- Les recommandations te montrent surtout ce qui ressemble à ce que tu as déjà vu : tu risques de t'enfermer dans une **bulle informationnelle**.
- Ce qui est publié peut rester en ligne très longtemps, et il est difficile de l'effacer : c'est la question du **droit à l'oubli**.

## 3. Se protéger en naviguant

| Risque | Comment se protéger |
| --- | --- |
| des **cookies** de suivi enregistrent tes visites pour te cibler | les refuser, ou les effacer dans les réglages du navigateur |
| l'**historique** garde la liste des sites visités | l'effacer, ou utiliser la navigation privée |
| un programme malveillant s'exécute sur ton appareil | bloquer les scripts douteux, se méfier des téléchargements |
| l'**hameçonnage** : une fausse page imite un vrai site pour voler ton mot de passe | examiner l'**adresse** avant de cliquer et avant de saisir quoi que ce soit |

:::exemple
Un message dit : « Votre compte sera fermé aujourd'hui, cliquez vite ». Le lien mène à `ent-lycee.secure-login.exemple.net` au lieu du vrai site `ent.lycee.exemple.fr`. L'urgence et l'adresse différente doivent alerter : c'est de l'hameçonnage.
:::

:::attention
La navigation privée efface seulement les traces **sur ton appareil**. Les sites visités et le réseau, celui du lycée par exemple, peuvent toujours voir tes connexions.
:::

## 4. Ce que dit le droit

- Le **droit d'auteur** protège une œuvre, texte, photo ou musique, **dès sa création**, sans aucune démarche.
- Une **licence** indique ce qu'on a le droit de faire avec une œuvre. Les licences **Creative Commons** autorisent certains usages, à condition par exemple de citer l'auteur.
- Le **droit d'usage** permet d'utiliser un bien sans le posséder : un film acheté en streaming se regarde, mais ne se revend pas.
- Un bien numérique a une **valeur**, même si le copier ne coûte presque rien.

Une image trouvée avec un moteur de recherche n'est donc pas libre d'usage : il faut vérifier sa licence.

## L'essentiel

- Un moteur collecte les pages, les indexe, puis les classe selon leur pertinence et leur popularité.
- Vérifier les sources, repérer les publicités, se méfier des bulles.
- Examiner l'adresse avant de cliquer ; gérer cookies et historique ; la navigation privée ne cache pas tout.
- Une œuvre est protégée dès sa création ; la licence dit ce qui est permis.

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
