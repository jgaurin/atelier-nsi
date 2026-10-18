# Atelier NSI

Plateforme de préparation au CAPES externe NSI bac+3, session 2027. Application web française, pensée pour apprendre depuis les bases et s'entraîner aux quatre épreuves.

## Ce qui fonctionne dans l'application

- **Parcours de 64 cours**, organisé en 7 blocs : 50 cours disciplinaires, 8 cours sur les programmes et la didactique, puis 6 cours d’entretien professionnel. Chaque unité suit un seul fil : objectif d’apprentissage, leçon en quatre développements, exemple travaillé, neuf activités progressives, fiche de révision globale par thème et auto-validation. Le menu placé dès le titre permet de choisir directement n’importe quelle leçon du thème, sans devoir avancer une par une. Les activités comprennent des rappels, deux exercices spécifiques au cours, application, cas limite, diagnostic d’erreur, transfert, question de niveau concours et explication orale.
- **128 exercices supplémentaires rédigés pour les cours** (deux par unité), avec énoncé et correction de référence. Les réponses écrites sont sauvegardées sur l’appareil ; il faut les rédiger, consulter le corrigé, comparer les critères puis déclarer l’activité faite. La plateforme ne prétend pas noter automatiquement une rédaction.
- **Quatre simulations d’épreuve**, alignées sur les formats écrits et oraux, avec chronomètre, zones de rédaction sauvegardées et grille d’auto-évaluation. Les sujets et consignes d’entraînement sont originaux et ne sont pas présentés comme des sujets officiels.
- **570 cartes de base** (122 rédigées + 448 générées à partir des 64 cours, soit 7 par unité), classées par matière et reliées aux notions, fiches, exemples et pièges. Les anciennes cartes qui répétaient à l’identique des exercices ont été retirées pour privilégier des rappels variés. Chaque carte demande d’abord une réponse, puis propose un corrigé et un point de vigilance. Les niveaux « encore », « difficile », « bien » et « facile » planifient les révisions (10 minutes, puis des intervalles progressifs) ; les cartes oubliées peuvent être reprises immédiatement. Les nouvelles cartes sont mélangées et les révisions arrivées à échéance passent en priorité.
- Atelier Python avec 25 problèmes progressifs et tests automatiques sur cas ordinaires, limites et entrées particulières. Python tourne dans le navigateur avec Pyodide, à l'écart du fil principal dans un Web Worker. Les tests montrent les cas réussis, le premier cas à reprendre et des pistes de débogage. L'éditeur mémorise les brouillons, insère quatre espaces avec Tab et exécute avec Ctrl+Entrée.
- Thème sombre, mise en page responsive pour grand écran, tablette et téléphone, navigation clavier et réglage de mouvement réduit.
- Sauvegarde locale automatique. Export et import d'une sauvegarde JSON.
- Connexion e-mail sans mot de passe et synchronisation entre appareils prévues avec Supabase. Les données des apprenants sont isolées par des politiques Row Level Security (RLS).

Les 9 activités par cours sont des étapes de travail différentes ; les deux exercices propres au cours, les sujets et leurs corrections sont rassemblés dans sa leçon. Les tests du labo Python sont exécutés dans le navigateur ; ils ne constituent ni une preuve exhaustive de correction ni une note de concours. Les simulations et exercices sont originaux, pas des sujets officiels. Le contenu est aligné sur le programme publié pour la session 2027 ; vérifie les mises à jour du ministère avant les épreuves. La bibliothèque complète les sujets du jury et les annales, elle ne les remplace pas.

Le détail des priorités déjà intégrées et des chantiers restant à approfondir figure dans [PLAN_ACTION_PREPARATION.md](PLAN_ACTION_PREPARATION.md).

## Lancer localement

Le Web Worker et la connexion e-mail nécessitent une origine web, donc un petit serveur local (ouvrir `index.html` directement en `file://` ne suffit pas pour ces fonctions).

```powershell
node serve.mjs
```

Ouvre ensuite <http://localhost:4173>. Si Python n'est pas disponible sous le nom `py`, utilise tout serveur statique local équivalent.

## Activer la synchronisation multi-appareil

La synchronisation est désactivée tant qu'aucun projet Supabase n'est configuré. Aucun compte ou identifiant de projet n'était présent sur l'ordinateur lors de la préparation de cette version.

1. Crée un projet Supabase et récupère son Project URL et sa **publishable key** (jamais la clé `service_role` ou une clé secrète).
2. Copie ces deux valeurs dans `config.js` (`supabaseUrl` et `supabasePublishableKey`). La clé publishable est visible dans le navigateur par conception ; l'accès aux lignes est protégé par RLS.
3. Dans Supabase > SQL Editor, exécute `supabase-schema.sql`. La table n'autorise chaque compte authentifié qu'à lire et modifier sa propre progression.
4. Dans les réglages d'authentification Supabase, renseigne le site URL et les URL de redirection autorisées, par exemple `http://localhost:4173` et l'URL de production Vercel.
5. Déploie de nouveau l'application. Ouvre Réglages > Configurer / connecter mon compte, demande le lien de connexion e-mail et connecte chaque appareil avec le même compte.

La progression actuelle de l'appareil est fusionnée avec le compte lors de la première connexion : les leçons validées et les brouillons de chaque exercice sont conservés. En cas de modification du même brouillon hors ligne sur deux appareils, la dernière synchronisation écrase ce champ ; exporter une sauvegarde reste possible.

## Déployer sur Vercel avec Git

1. Crée un dépôt GitHub contenant les fichiers de ce dossier `atelier-nsi` et pousse le code.
2. Dans Vercel, importe le dépôt GitHub comme projet. Garde le dossier racine `.` et aucun build command ; publie les fichiers statiques à la racine.
3. Déploie, puis ajoute l'URL `*.vercel.app` comme Site URL et URL de redirection autorisée dans Supabase.
4. Pour activer le multi-appareil, configure les clés publiques dans `config.js`, commit cette configuration et laisse Vercel redéployer.

Les commits suivants vers le dépôt connecté déclenchent les déploiements Vercel associés. `vercel.json` garde une configuration simple pour une application statique.

## Sources officielles

- [Programme officiel du CAPES externe NSI bac+3, session 2027](https://www.devenirenseignant.gouv.fr/media/20677/download)
- [Format des épreuves](https://www.devenirenseignant.gouv.fr/les-epreuves-du-capes-externe-bac3-section-numerique-et-sciences-informatiques-1459)
- [Calendrier des concours 2027](https://www.devenirenseignant.gouv.fr/le-calendrier-des-concours-de-recrutement-d-enseignants-du-second-degre-de-la-session-2027-1562)
- [Programmes du lycée sur Éduscol](https://eduscol.education.gouv.fr/4368/enseigner-au-lycee-generaltechnologique)
- [Documentation Pyodide : usage dans le navigateur](https://pyodide.org/en/stable/usage/index.html)
- [Documentation Pyodide : exécution en Web Worker](https://pyodide.org/en/stable/usage/webworker.html)
- [Documentation Supabase Auth](https://supabase.com/docs/guides/auth)
- [Documentation Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Déploiement Vite et sites front-end sur Vercel](https://vercel.com/docs/frameworks/frontend/vite)
