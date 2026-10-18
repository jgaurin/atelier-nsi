# Plan d’action — Atelier NSI, préparation complète au CAPES bac+3

## Avancement de la première grande livraison · 15 octobre 2026

La première grande réorganisation de la bibliothèque est intégrée dans l’application locale : **64 unités dans 7 blocs** (50 disciplinaires, 8 programmes/didactique, 6 entretien). Chaque leçon suit maintenant un fil unique : objectif, cours en quatre développements propres à la notion, exemple travaillé, exercices progressifs, fiche mémo, puis validation. Chaque cours comporte neuf activités, dont **deux exercices supplémentaires rédigés pour sa notion**, en plus de l’application, du cas limite, du diagnostic d’erreur, du transfert, du problème de niveau concours, du rappel et de l’explication orale. Cela représente **576 étapes de travail** et **128 exercices spécifiques ajoutés**. Les cours de programmation concernés renvoient au laboratoire Python, qui exécute 25 problèmes avec des tests réels dans le navigateur.

Cette livraison améliore le volume et la cohérence du parcours, mais elle ne doit pas être présentée comme une préparation déjà irréprochable : chaque corrigé détaillé doit encore faire l’objet d’une relecture scientifique, les réponses rédactionnelles sont comparées à un modèle et non évaluées automatiquement, le laboratoire n’exécute que du Python et il manque encore des sujets blancs intégraux en nombre suffisant pour chaque format officiel. La validation d’une leçon est une auto-évaluation, pas une note du jury.

## 1. Le constat honnête

Tu as raison : empiler des pages, des cartes et des quiz ne suffit pas. Le parcours visible a donc été recentré sur les 64 cours détaillés pour éviter que plusieurs rubriques enseignent ou reposent les mêmes questions. Les anciennes vues générales d’entraînement ne sont plus au premier plan ; le fil de chaque cours rassemble maintenant l’explication, son exemple, ses exercices et son bilan. Le contenu doit encore être relu, approfondi et complété par des sujets blancs intégraux.

La cible n’est donc pas d’empiler des cartes. C’est de construire un **parcours complet, vérifiable et progressif** : pour chaque notion, un cours accessible en partant de zéro, une fiche de révision, des exercices variés de difficulté croissante, des corrections exploitables et un test de maîtrise. Puis il faut réutiliser toutes ces notions dans les quatre formats du concours.

Le CAPES bac+3 comporte deux écrits de 4 h (coefficients 3 et 2), un oral disciplinaire avec 2 h 30 de préparation puis 1 h d’épreuve (coefficient 5), et un entretien de 35 min (coefficient 3). Le programme comprend les programmes d’informatique du lycée **et** le programme spécifique 2027. Ce sont donc deux pans distincts à couvrir. Sources : [programme officiel 2027](https://www.devenirenseignant.gouv.fr/media/20677/download), [formats officiels des épreuves](https://www.devenirenseignant.gouv.fr/les-epreuves-du-capes-externe-bac3-section-numerique-et-sciences-informatiques-1459), [programmes NSI](https://eduscol.education.gouv.fr/5823/programmes-et-ressources-en-numerique-et-sciences-informatiques-voie-g), [programme SNT](https://eduscol.education.gouv.fr/5841/programmes-et-ressources-en-sciences-numeriques-et-technologie-voie-gt).

## 2. La cible de contenu

Construire **64 cours complets** : 50 cours disciplinaires, 8 cours d’enseignement au lycée et de didactique, puis 6 cours de préparation à l’entretien professionnel. La liste ci-dessous est une première carte du territoire ; elle sera contrôlée point par point contre les programmes officiels avant de déclarer un thème couvert.

### A. Langages et programmation — 8 cours

1. Instructions, expressions, variables, types et affectation.
2. Conditions, boucles, parcours et traces d’exécution en Python.
3. Types Python, chaînes, listes, dictionnaires, mutabilité et alias.
4. Fonctions, paramètres, valeurs renvoyées, contrats et modularité.
5. Tests, assertions, débogage, erreurs et exceptions.
6. Récursivité, cas de base, terminaison et trace de pile.
7. Classes, objets, attributs, méthodes et bases du langage Java.
8. Encapsulation, composition, agrégation, héritage, interfaces, surcharge, diagrammes de classes et cas d’utilisation.

### B. Algorithmique et structures de données — 12 cours

1. Types, spécification, contrats, TAD et distinction entre interface et implémentation.
2. Tableaux, listes, accès, parcours et modifications.
3. Piles, files et files à priorité : opérations, usages et coûts.
4. Arbres, arbres binaires et arbres binaires de recherche.
5. Graphes : sommets, arêtes, orientations, poids et représentations.
6. Recherche séquentielle, dichotomie et parcours de structures.
7. Tris : principes, traces, propriétés et comparaison des coûts.
8. Stratégies gloutonnes et preuve du choix local.
9. Diviser pour régner et récurrences élémentaires.
10. Programmation dynamique, mémoïsation et construction de tables.
11. Correction : cas de base, invariants, variants et arguments de preuve.
12. Coûts au meilleur et au pire cas, décompte d’opérations et ordres de grandeur.

### C. Information, données et Web — 12 cours

1. Binaire, bases, codage et représentation symbolique de l’information.
2. Booléens, entiers, flottants, chaînes et limites des représentations.
3. Tableaux et représentation des données en mémoire.
4. Références, objets mutables, copies et partage de mémoire.
5. Données structurées en tables et passage d’un besoin à un modèle.
6. Modèle relationnel, schémas, attributs, domaines et clés.
7. Intégrité référentielle et relations entre tables.
8. SQL : sélection, projection, filtres, tri et mise à jour.
9. SQL : jointures, valeurs NULL, agrégats et regroupements.
10. Accès à l’information sur le Web, URL, requêtes et réponses.
11. HTML et CSS : structure, sémantique et présentation.
12. XML, client-serveur et JavaScript côté client.

### D. Architecture, systèmes et réseaux — 10 cours

1. Composants d’un ordinateur, processeur, mémoire, entrées-sorties et bus.
2. Architecture de von Neumann et cycle d’exécution des instructions.
3. Logique booléenne, portes, circuits et opérations élémentaires.
4. Lire et écrire des opérations simples en assembleur.
5. Architecture et fonctions d’un système d’exploitation.
6. Processus, états, ordonnancement et partage des ressources.
7. Fichiers, entrées-sorties, shell, chemins, utilisateurs et permissions.
8. Réseau en couches : supports physiques, liaison et réseau local.
9. Adressage IP, tables et décisions de routage.
10. Transport, ports et services de base de TCP et UDP.

### E. Mathématiques pour l’informatique — 8 cours

1. Logique des propositions, connecteurs et tables de vérité.
2. Méthodes de preuve, contre-exemple, contraposée et raisonnement par l’absurde.
3. Ensembles, produits, relations, fonctions et propriétés élémentaires.
4. Dénombrement : principes additif et multiplicatif, arrangements et combinaisons.
5. Probabilités discrètes, événements et probabilités conditionnelles simples.
6. Graphes : vocabulaire, chemins, connexité et propriétés élémentaires.
7. Automates finis : états, transitions, déterminisme et acceptation.
8. Langages et expressions rationnelles : construire, lire et tester des motifs.

### F. Enseigner les programmes SNT et NSI — 8 cours appliqués

1. Lire les programmes en vigueur et construire une progression annuelle cohérente.
2. SNT : Internet et Web, avec une activité et des critères de réussite.
3. SNT : réseaux sociaux, objets connectés, données, géolocalisation et enjeux associés.
4. SNT : photographie numérique, représentation et traitement de données.
5. NSI : représenter et manipuler les données ; concevoir des exercices gradués.
6. NSI : algorithmique et programmation ; apprendre à tracer, tester et déboguer.
7. NSI : architecture, systèmes, réseaux et bases de données en activités.
8. Concevoir une séance complète : objectifs, prérequis, consignes, différenciation, évaluation et trace écrite.

### G. Entretien et posture professionnelle — 6 cours

1. Présentation de motivation de 5 minutes, personnalisée et appuyée sur des exemples.
2. Échange sur son parcours, ses choix et sa représentation du métier.
3. Valeurs de la République, laïcité, neutralité et obligations du service public.
4. Égalité filles-garçons, lutte contre les discriminations et prévention des stéréotypes.
5. Inclusion, besoins des élèves, coopération et situations de classe.
6. Transition écologique, épanouissement des élèves et construction d’une réponse nuancée.

## 3. Le paquet obligatoire pour chaque cours

Chaque cours doit être une unité complète, pas seulement une page de texte.

1. **Cours guidé depuis zéro** : objectif observable, prérequis expliqués, vocabulaire, intuition, définitions, exemple travaillé ligne par ligne, pièges fréquents et résumé.
2. **Fiche de révision associée** : une page imprimable, avec définitions, schémas ou traces, code ou méthode type, coûts à retenir, erreurs classiques et mini-quiz.
3. **Au moins 12 exercices gradués**, sans compter les variantes : trois de prise en main guidée, trois d’application directe, trois de transfert ou de combinaison, trois au format concours et sous contrainte de temps.
4. **Correction complète pour chaque exercice** : résultat attendu, raisonnement étape par étape, tests et cas limites, explication des erreurs fréquentes, critères de notation et points partiels. Pour le code, ajouter une solution de référence commentée et les coûts.
5. **Validation de fin de cours** : quiz court, un exercice autonome et une question de transfert. Une réussite est enregistrée par compétence, pas seulement par page visitée.
6. **Révision espacée** : au moins 8 à 12 cartes de rappel utiles par cours, associées aux erreurs concrètes et aux prochaines dates de révision.

À ce rythme, la cible représente au minimum **768 exercices** pour les 64 cours, plus les variantes de données, les projets intégrateurs et les sujets blancs. Les exercices ne seront pas tous des QCM : il faudra tracer un algorithme, écrire du code, détecter un bug, construire une requête SQL, justifier un coût, prouver une propriété ou rédiger une réponse.

## 4. La progression de difficulté commune

Chaque notion suit le même escalier, avec des consignes et des corrigés adaptés à son domaine :

| Niveau | Ce que tu fais | Ce que la correction doit apporter |
|---|---|---|
| 0 — Comprendre | Exemple guidé, vocabulaire, prédiction | Explication lente, sans prérequis caché |
| 1 — Appliquer | Cas direct et exercice court | Étapes attendues et erreur typique |
| 2 — Consolider | Cas limites, bug ou variante | Tests, contre-exemples et justification |
| 3 — Combiner | Plusieurs notions dans un problème | Choix de structures et argumentation |
| 4 — Concours | Sujet inédit, temps limité, rédaction complète | Barème détaillé, points partiels et solution commentée |

On ne passe pas au niveau suivant parce qu’on a cliqué « terminé » : il faut réussir des exercices variés, puis retrouver la notion plus tard sans aide. Les seuils seront visibles et pourront être ajustés au fil des essais.

## 5. Le système de correction à construire

- **Python** : garder l’exécution dans un Web Worker Pyodide ; afficher exemples publics, tests de bord, résultat attendu/réel, erreurs d’exécution, indices gradués et correction après tentative. Un passage des tests aide à vérifier une solution, mais ne prouve pas sa correction pour tous les cas.
- **SQL** : ajouter un petit bac à sable local avec schémas et jeux de données d’exercice ; exécuter les requêtes et comparer leurs résultats, en acceptant les requêtes différentes mais équivalentes lorsque c’est possible.
- **Java** : ajouter des sujets d’écriture, lecture et trace de code. L’exécution automatique ne sera activée qu’avec un bac à sable isolé et correctement limité ; on ne lancera jamais le code utilisateur dans le serveur web ordinaire.
- **Raisonnement et rédaction** : proposer une grille explicite, les éléments attendus et les points partiels. Ne pas présenter l’auto-évaluation comme une note automatique ou une note du jury.
- **Réponse de l’apprenant** : révéler le corrigé après une première tentative, préserver le brouillon, permettre une nouvelle tentative et transformer une erreur en exercice de remédiation.

## 6. Les épreuves blanches à produire

1. **Écrit 1 — problème et programmation, 4 h, coefficient 3** : au moins 6 sujets complets originaux couvrant plusieurs domaines, avec énoncé, fichiers ou données, corrigé pas à pas, tests, barème et notation par compétence.
2. **Écrit 2 — analyse d’un dossier et évolution d’une solution, 4 h, coefficient 2** : au moins 6 dossiers originaux avec documents cohérents, questions d’analyse, proposition d’évolution et grille de rédaction.
3. **Oral 1 — exposé disciplinaire, préparation 2 h 30 puis exposé/échange 30 min + 30 min, coefficient 5** : au moins 10 corpus d’entraînement. Pour chacun : documents, problème, réalisation informatique attendue, exemple démontrable, plan d’exposé, questions du jury et grille d’auto-évaluation.
4. **Oral 2 — entretien, 35 min, coefficient 3** : au moins 20 mises en situation renouvelables, entraînement à la présentation de 5 min et au dialogue, feedback sur les faits, le cadre, l’action immédiate, le suivi et la justification.
5. **Mode examen** : chronomètre fidèle, sauvegarde locale et compte, navigation clavier, aucun corrigé visible avant la fin, reprise après interruption et bilan final par compétences.

Les annales et sujets zéro officiels seront référencés clairement. Les exercices originaux ne seront jamais présentés comme des sujets réels du jury. Le calendrier ministériel actuel place les écrits du CAPES externe bac+3 dans la fenêtre du **9 au 19 mars 2027** ; la date détaillée par épreuve reste à surveiller sur la page officielle du [calendrier 2027](https://www.devenirenseignant.gouv.fr/le-calendrier-des-concours-de-recrutement-d-enseignants-du-second-degre-de-la-session-2027-1562).

## 7. Ordre de développement — les sprints

### Sprint 0 — cartographie et audit · première version réalisée

- La matrice de 64 unités est intégrée dans `curriculum.js` et affichée par bloc ; une vérification éditoriale exhaustive contre les textes officiels reste à refaire avant de déclarer la couverture définitive.
- Marquer honnêtement les 28 leçons existantes : introduction, partiellement couvert, ou complet. Ne pas assimiler une mention dans une carte à un cours enseigné.
- Ajouter le statut de couverture dans l’application afin de voir les trous.

### Sprint 1 — modèle pédagogique et gabarit · intégré, à enrichir

- Créer une structure de données durable pour `cours`, `fiche`, `exercice`, `correction`, `compétence`, `source` et `progression`.
- Construire une page de cours, une fiche imprimable et un exercice à correction progressive.
- Le gabarit de cours, fiche imprimable, réponses sauvegardées, corrections de référence, exercices gradués et auto-validation est intégré aux 64 unités ; l’enrichissement d’un cours pilote en chapitre long reste une priorité éditoriale.
- Vérifier le rendu sur grand écran, tablette et téléphone, et la sauvegarde de chaque réponse.

### Sprints 2 et 3 — bases, Python, algorithmique · première couverture intégrée

- Les 8 unités langage et les 12 unités d’algorithmique sont intégrées avec activités et corrigés de référence ; relire et approfondir chaque leçon et ajouter de nouveaux exercices spécifiquement rédigés reste à faire.
- Priorité aux fonctions, tests, listes, piles/files, arbres, graphes, tris, récursion, correction et complexité.
- Faire passer chaque exercice automatisable dans les tests ; revoir les corrigés manuellement avant de le déclarer prêt.

### Sprints 4 et 5 — données, Web, architecture, systèmes et réseaux · première couverture intégrée

- Les 12 unités données/Web et les 10 unités architecture/systèmes/réseaux sont intégrées ; l’atelier SQL exécutable et des sujets multi-domaines restent à développer.
- Ajouter l’atelier SQL local et les exercices d’analyse de schémas.
- Faire des sujets mêlant Python, données et système comme dans une épreuve, au lieu de laisser les blocs isolés.

### Sprint 6 — mathématiques et théorie · première couverture intégrée

- Les 8 unités sont intégrées avec preuves, contre-exemples et applications ; compléter les séries de calculs, traces et exercices de preuve est encore nécessaire.
- Ajouter des versions débutantes et concours de chaque exercice afin de ne pas sauter directement aux notations formelles.

### Sprint 7 — programmes lycée et pédagogie · première couverture intégrée

- Les 8 unités appliquées sont intégrées avec situations d’enseignement ; mettre à jour précisément chaque activité à partir des programmes SNT/NSI en vigueur reste à faire.
- Recontrôler les textes officiels avant la session et actualiser les activités SNT si le programme évolue.
- Chaque notion disciplinaire doit aussi apparaître dans au moins une séquence ou activité d’enseignement, avec objectif, consigne, obstacles prévisibles et critères de réussite.

### Sprint 8 — oraux et simulations intégrales · à poursuivre

- Les 6 unités d’entretien sont intégrées et l’application propose déjà quatre formats chronométrés ainsi que des dossiers ouverts ; les 6 sujets complets par écrit, 10 corpus d’oral disciplinaire et 20 situations d’entretien restent à rédiger.
- Ajouter les 12 sujets blancs (6 par écrit), puis les corpus d’oral ; commencer par un sujet intégral de chaque format avant de varier les thèmes.

### Sprint 9 — maîtrise, synchronisation et finition · partiellement intégré

- La progression par cours, le suivi des exercices, l’auto-validation et les brouillons sont intégrés ; les statuts « fragile » et « à réviser » par compétence restent à construire.
- Recommandation de séance selon les erreurs, les échéances de cartes et le temps disponible.
- L’export/import, le thème responsive et le mécanisme de synchro sont présents ; le projet Supabase de cet utilisateur n’est pas configuré ici, donc le fichier local reste pour l’instant sauvegardé sur ce PC.
- Faire une revue de contenu : aucune ligne officielle sans cours, fiche, exercices corrigés et preuve de validation.

## 8. Comment mesurer que le plan est réellement exécuté

Un cours ne passe au statut « complet » que si son cours guidé, sa fiche, ses 12 exercices, ses corrigés et sa validation sont présents. Un bloc ne passe à « couvert » que si toutes ses lignes officielles ont ce statut. L’accueil de l’application affichera le nombre de notions **réellement couvertes**, pas seulement le nombre de cartes ou de pages.

Les corrections automatiques vérifieront les cas ordinaires et les cas limites. Les corrections de rédaction montreront le barème et les attendus, sans inventer une note de concours. Les sujets blancs auront un temps réaliste et une solution complète. Les liens vers les programmes, sujets zéro et rapports de jury seront versionnés afin de pouvoir mettre le parcours à jour.

## 9. Cadence de préparation pour la session 2027

À partir d’octobre 2026, le parcours doit proposer un rythme réglable selon tes heures disponibles : bases d’abord, couverture complète ensuite, révisions espacées en parallèle, puis sujets chronométrés. La dernière phase avant la fenêtre des écrits de mars doit réserver une place fixe aux deux écrits de quatre heures et à la correction approfondie. Les oraux ne doivent pas attendre les résultats : l’oral disciplinaire et l’entretien se travaillent en petites séances régulières dès que les fondamentaux sont posés.

Le tableau de bord doit aider à choisir la prochaine séance, sans suggérer qu’un score élevé sur des QCM garantit l’admissibilité. Le bon indicateur est la capacité à résoudre un problème inédit, justifier son code et l’expliquer clairement dans les temps.
