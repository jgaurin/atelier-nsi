---
titre: Préparer ses premiers cours
resume: Prendre un poste de NSI ou de SNT rapidement — s'informer, construire une progression et une séance type, choisir ses outils, tenir le cahier de textes, évaluer, et s'organiser pour tenir dans la durée.
duree: 45
objectifs:
  - Rassembler en quelques jours ce qu'il faut pour démarrer (informations, progression, outils)
  - Construire une séance type de NSI ou de SNT, en salle informatique
  - Mettre en place une évaluation régulière et lisible
  - S'organiser pour préparer ses cours sans s'épuiser
prerequis: [contractuel/gerer-une-classe, lycee/programmes]
programme: [e-metier, e-eleve, snt-programmation, nsi1-langages]
cartes:
  - q: Le cahier de textes est-il obligatoire ?
    r: "Oui : il est tenu (en ligne, dans le logiciel de l'établissement) pour chaque classe, avec le contenu de chaque séance et le travail donné ; il assure la continuité, notamment en cas de remplacement."
  - q: Les quatre temps d'une séance type ?
    r: "Une activité de démarrage (5 min), une phase de découverte ou d'explication courte, une phase de travail des élèves (la plus longue), un bilan avec trace écrite."
  - q: Quels outils pour faire programmer en Python sans installation ?
    r: "Des environnements en ligne : Capytale (intégré aux ENT), Basthon, des notebooks Jupyter en ligne ; sur les postes, un éditeur comme Thonny."
  - q: Combien d'heures de SNT et de NSI par semaine ?
    r: "SNT : 1 h 30 en seconde. NSI : 4 h en première, 6 h en terminale."
  - q: Pourquoi évaluer souvent et peu à la fois ?
    r: "Des évaluations courtes et régulières donnent des retours rapides, permettent de rattraper tôt et préparent à l'épreuve pratique du bac (programmer sur machine)."
---

Un contractuel prend souvent un poste **vite**, parfois en cours d'année, avec des classes qui ont déjà avancé. Il n'est pas possible de tout préparer
d'avance : il faut une **méthode** pour démarrer en quelques jours, puis un rythme de préparation soutenable. Cette leçon donne ce kit de démarrage.

## 1. S'informer dès l'affectation

:::methode[La liste des premiers jours]
- **Chef d'établissement** : emploi du temps, règlement intérieur, accès au **logiciel de vie scolaire** (appel, notes, cahier de textes) et à l'**ENT**.
- **Cahier de textes** de chaque classe : où en sont les élèves ? quelles évaluations ont été faites ? quels travaux sont en cours (projets) ?
- **Collègues** : un professeur de NSI s'il y en a, ceux de mathématiques ou de physique (qui enseignent souvent la SNT), le **professeur principal** de chaque classe.
- **Salle et matériel** : tester un poste, les comptes élèves, les logiciels, l'accès à Internet, le vidéoprojecteur ; savoir qui appeler en cas de panne.
- **Élèves à besoins particuliers** : PAP, PPS (et l'éventuel AESH), PAI.
- **Programmes** : relire le programme officiel du niveau (leçon « Les programmes de SNT et de NSI ») et la liste des capacités attendues.
:::

## 2. Construire une progression

On part de **ce qui est déjà fait** (cahier de textes) et de **ce qui reste à faire** (programme), en tenant compte des contraintes : en terminale NSI, l'épreuve
écrite et l'épreuve pratique du bac ; en première, la cohérence avec la terminale pour ceux qui continuent ; en SNT, les sept thèmes sur l'année (souvent
répartis par trimestre) avec de la programmation transversale.

| Niveau | Horaire | Points d'attention |
|---|---|---|
| SNT (seconde) | 1 h 30 / semaine | tous les élèves, souvent en demi-groupe ; sept thèmes + programmation Python simple |
| NSI première | 4 h / semaine | bases de Python, représentation des données, tables, Web, architecture, algorithmes ; projets |
| NSI terminale | 6 h / semaine | structures de données, bases de données, réseaux et systèmes, algorithmes avancés ; préparation de l'écrit et de la pratique du bac |

Ne pas réinventer : les manuels, les ressources d'Éduscol et les nombreuses ressources partagées par les enseignants de NSI sont de bonnes bases, à adapter.

## 3. Une séance type en salle informatique

```mermaid legende="Une séance de 55 minutes"
flowchart LR
  A["5 min<br/>démarrage<br/>(question flash, rappel)"] --> B["10 min<br/>découverte ou<br/>explication courte"]
  B --> C["30 min<br/>travail des élèves<br/>(programmer, chercher)"]
  C --> D["10 min<br/>bilan et<br/>trace écrite"]
```

- **Démarrage** : une question au tableau dès l'entrée (« que vaut `7 // 2` ? », « qu'est-ce qu'une URL ? ») — les élèves se mettent au travail sans attendre.
- **Découverte** : un problème, une démonstration, une activité débranchée ; l'explication magistrale reste **courte**.
- **Travail** : un document d'activité progressif (consignes numérotées, exemples, exercices du plus simple au plus difficile), des indices pour ceux qui
  bloquent, des défis pour ceux qui finissent.
- **Bilan** : ce qu'il faut retenir, écrit dans le cours (la **trace écrite**), et le travail pour la prochaine fois noté dans le cahier de textes.

Pour programmer sans installation : **Capytale** (plateforme d'activités de l'Éducation nationale, accessible depuis l'ENT : on distribue une activité, on voit
le travail des élèves), **Basthon** ou des notebooks Jupyter en ligne ; sur les postes, un éditeur simple comme **Thonny**. Le Labo de l'Atelier permet de
tester des exemples Python et SQL dans le navigateur.

## 4. Évaluer

- **Souvent et court** : questions flash, petits exercices notés ou non, QCM en fin de chapitre.
- **Sur machine** : des exercices de programmation courts, dans les conditions de l'**épreuve pratique** du bac (programmer à partir d'un énoncé, expliquer son code).
- **Sur projet** : une grille de critères donnée à l'avance, une part individuelle (chaque élève explique une partie du code qu'il a écrite).
- **Des critères lisibles** : l'élève doit savoir ce qu'on attend de lui et pourquoi il a obtenu sa note ; on rend les copies vite, avec un corrigé.

:::attention[Tenir dans la durée]
Préparer tous ses cours de zéro chaque soir épuise en quelques semaines. Quelques principes : préparer **par séquence** (deux ou trois semaines d'avance quand
c'est possible), **réutiliser** et adapter des ressources existantes, mutualiser avec les collègues, corriger avec des grilles, et s'accorder du temps de repos.
Demander de l'aide n'est pas un aveu d'échec.
:::

:::prof
Dans l'entretien, une question fréquente : « Comment prépareriez-vous une séance sur [notion] ? » Répondre avec la structure démarrage – découverte – travail –
bilan, un exemple concret d'activité, et la façon d'évaluer, montre qu'on sait passer du savoir à la classe. Les leçons du parcours contiennent des encadrés
« Côté enseignant » et des activités qu'on peut transposer.
:::

## Exemple guidé

**Question.** « Comment feriez-vous découvrir les boucles `for` à une classe de SNT ? »

**1. Objectif** : comprendre qu'une boucle répète des instructions, et écrire une boucle `for` simple.

**2. Démarrage** (5 min) : au tableau, un dessin de 5 étoiles alignées : « comment dire à un robot de dessiner ça ? » (les élèves proposent « fais une étoile, avance »
cinq fois).

**3. Découverte** (10 min) : on écrit ensemble le programme avec `for i in range(5):` et on l'exécute ; on change le 5 en 20 : l'intérêt de la boucle saute aux yeux.

**4. Travail** (30 min) : une fiche progressive — afficher les nombres de 1 à 10, la table de 7, une somme, puis un dessin avec le module `turtle` ; des indices
et un défi (un escalier, une spirale).

**5. Bilan** (10 min) : trace écrite (« `for i in range(n):` répète n fois le bloc indenté ; `i` prend les valeurs 0, 1, …, n−1 »), une question flash pour vérifier, et
le cahier de textes.

## L'essentiel

- Premiers jours : chef d'établissement, cahier de textes, collègues et professeur principal, salle et comptes, élèves à besoins particuliers, programmes.
- Progression : partir de ce qui est fait, viser ce qui reste ; SNT 1 h 30 (sept thèmes), NSI 4 h puis 6 h (bac écrit et pratique en terminale).
- Séance type : démarrage, découverte courte, travail des élèves (le plus long), bilan et trace écrite ; outils en ligne (Capytale, Basthon, Jupyter).
- Évaluer souvent, court, sur machine et sur projet, avec des critères lisibles.
- Tenir dans la durée : préparer par séquence, réutiliser, mutualiser, demander de l'aide.

## Exercices

::::exercice[Le cahier de textes]{niveau=1}
À quoi sert le cahier de textes de la classe ?

- [ ] À noter le comportement des élèves
- [x] À indiquer pour chaque séance ce qui a été fait et le travail donné, ce qui assure la continuité
- [ ] À enregistrer les notes du trimestre
- [ ] Il est facultatif et personnel au professeur

:::corrige
Le cahier de textes (en ligne) est obligatoire : élèves, familles, collègues et remplaçants y trouvent le contenu des séances et le travail à faire. C'est le premier
document à consulter quand on remplace quelqu'un.
:::
::::

::::exercice[Les horaires]{niveau=1}
Combien d'heures par semaine compte l'enseignement de spécialité NSI en terminale ?

- [ ] 1 h 30
- [ ] 4 h
- [x] 6 h
- [ ] 2 h

:::corrige
6 heures en terminale, 4 heures en première ; SNT compte 1 h 30 en seconde.
:::
::::

::::exercice[Préparer une séance de SNT]{niveau=2 duree=20}
Prépare une séance d'1 h 30 de SNT sur le thème « Le Web » : objectif, déroulement minuté selon les quatre temps, activité des élèves, trace écrite.

:::criteres
- Objectif précis tiré du programme (par exemple : décomposer une URL, écrire une page HTML simple, comprendre une requête HTTP).
- Déroulement minuté réaliste avec démarrage, découverte, travail (le plus long), bilan.
- Activité concrète des élèves (modifier une page HTML, analyser des URL, observer des requêtes avec les outils du navigateur).
- Trace écrite courte et juste ; travail ou prolongement noté au cahier de textes.
:::

:::corrige
**Objectif** : écrire une page HTML simple et comprendre comment le navigateur l'obtient. **Démarrage** (5 min) : « que se passe-t-il quand vous tapez une adresse ? »
(on note les idées). **Découverte** (15 min) : on ouvre une page, on affiche son code source (Ctrl+U), on repère quelques balises ; on décompose une URL au tableau.
**Travail** (55 min) : à partir d'un modèle, chaque élève crée une page de présentation d'un sujet de son choix (titre, paragraphes, une liste, un lien, une image),
puis ajoute une feuille de style ; défi : un tableau. **Bilan** (15 min) : trace écrite — une page web est un fichier texte en **HTML** (structure) mis en forme par du
**CSS**, demandé au serveur par le navigateur avec le protocole **HTTP** ; l'**URL** indique le protocole, le serveur et le chemin. Cahier de textes : terminer la page.
:::
::::

::::exercice[Arriver en cours d'année]{niveau=3 duree=15}
Tu remplaces, à partir de janvier, un professeur de terminale NSI parti sans laisser beaucoup d'informations. Le cahier de textes s'arrête en novembre. Comment
reconstruis-tu où en est la classe et comment organises-tu les trois premières semaines ?

:::criteres
- Recueil d'informations : élèves eux-mêmes (cahiers, classeurs, Capytale ou ENT), collègues, professeur principal, notes déjà saisies, direction.
- Diagnostic rapide (questionnaire ou petite évaluation non notée) pour situer les acquis.
- Organisation des premières semaines : reprise courte des bases nécessaires, puis avancée dans le programme en tenant compte des épreuves du bac ; information des familles et de l'équipe.
:::

:::corrige
**Reconstituer** : je regarde les cahiers ou classeurs de plusieurs élèves (et leurs espaces Capytale ou ENT), les notes déjà saisies, je demande au professeur principal
et aux collègues de NSI ou de mathématiques ce qu'ils savent, et je pose la question aux élèves eux-mêmes (« quels chapitres avez-vous vus ? »). **Diagnostiquer** : une
évaluation courte **non notée** sur les notions essentielles de terminale (POO, structures, récursivité, SQL) pour situer les acquis réels. **Organiser** : semaine 1, reprise
ciblée de ce qui manque le plus et présentation de la progression jusqu'au bac ; semaines 2-3, avancée dans le programme avec un rythme régulier d'exercices de type bac et
d'exercices sur machine (épreuve pratique) ; j'informe le professeur principal et les familles (ENT) de la progression prévue, et je note tout dans le cahier de textes.
:::
::::

::::exercice[Une séquence complète]{niveau=4 duree=30}
Construis une séquence de trois semaines en première NSI sur « les tableaux (listes) en Python » : objectifs, découpage en séances, activités, évaluation, et
différenciation.

:::criteres
- Objectifs tirés du programme (créer, parcourir, modifier une liste ; compréhensions de listes ; tableaux à deux dimensions ; parcours séquentiel).
- Découpage cohérent et progressif (environ 12 heures), alternant découverte, pratique sur machine et synthèse.
- Évaluation formative et sommative, dont une partie sur machine.
- Différenciation concrète (indices, niveaux d'exercices, défis) ; lien avec les leçons et exercices de l'Atelier.
:::

:::corrige
**Objectifs** : créer une liste, accéder et modifier par indice, parcourir (par indice et par valeur), construire par compréhension, utiliser des listes de listes, écrire
une recherche et un calcul de maximum. **Semaine 1** : découverte (une liste de notes : moyenne, maximum à la main puis en Python), indices et `len`, parcours ; exercices
progressifs sur machine. **Semaine 2** : modification et méthodes (`append`, `pop`), compréhensions de listes, petits problèmes (filtrer, compter), une évaluation
formative courte. **Semaine 3** : tableaux à deux dimensions (une grille, un tableau de notes par élève), mini-projet (jeu du morpion ou traitement d'images en niveaux de
gris), puis une évaluation sommative en deux parties (questions papier sur la lecture de code, exercice sur machine). **Différenciation** : fiches d'indices, exercices
classés par niveau (comme Découverte / Entraînement / Approfondissement dans l'Atelier, leçon « Listes et tableaux »), défis pour les plus avancés, binômes à rôles.
:::
::::
