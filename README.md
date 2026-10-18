# Atelier NSI

Plateforme pour se préparer à **enseigner NSI et SNT au lycée**, en français, avec deux objectifs au choix :

- **Entretien de professeur contractuel** (objectif par défaut) : un parcours en cinq étapes — réussir l'entretien (recrutement,
  questions types, gestion de classe, premiers cours, valeurs du service public), puis enseigner la SNT, la NSI de première, la NSI de
  terminale, et aller plus loin en classe. Le niveau visé est celui de la classe : cours, exemple guidé et exercices « Découverte » et
  « Entraînement » ; les exercices plus difficiles sont repliés (affichables en un clic).
- **CAPES externe NSI (session 2027)** : tout le programme du concours, jusqu'aux exercices de type concours, et la méthode des
  quatre épreuves.

Le site s'ouvre directement sur **Mon parcours** : choix de l'objectif, statistiques (leçons validées, exercices réussis, cartes à
réviser, lien « reprendre ») et leçons de l'objectif, étape par étape.

## Ce que contient le site

- **93 leçons** réparties en 16 modules (programmation Python, programmation objet et Java, algorithmique, structures de données,
  représentation des données, bases de données, Web, architecture, systèmes, réseaux, mathématiques discrètes, automates et
  langages, devenir professeur contractuel, programmes du lycée, méthode des épreuves du CAPES, entretien du CAPES). Chaque leçon suit le même plan : objectifs, cours avec schémas
  et exemples de code **exécutables dans la page**, exemple guidé, l'essentiel, puis des exercices progressifs (découverte →
  entraînement → approfondissement → type concours).
- **Plus de 600 exercices** : QCM, exercices Python et SQL **corrigés automatiquement** dans le navigateur (tests), rédactions
  avec critères de réussite et corrigé détaillé (auto-évaluation).
- **Plus de 600 cartes de révision** avec répétition espacée (page Révisions).
- **4 sujets blancs** originaux (écrit 1, écrit 2, oral 1, entretien), avec chronomètre.
- Une page **Couverture du programme** qui relie chaque ligne du programme officiel aux leçons correspondantes (toutes sont couvertes).
- Un **Labo** (bac à sable Python et SQL), un thème sombre, une mise en page adaptée au téléphone.

Python tourne dans le navigateur grâce à **Pyodide** (dans un Web Worker), SQL grâce à **sql.js** (SQLite), JavaScript dans un bac à
sable isolé. La progression est enregistrée **dans le navigateur** (localStorage). Une fois Supabase configuré (voir plus bas), on se
connecte par un lien reçu par e-mail et elle est **synchronisée entre tous ses appareils** ; la page Réglages permet aussi de
l'exporter et de l'importer dans un fichier.

Les sujets et exercices sont **originaux** : ils imitent le format des sujets zéro officiels mais ne sont pas des sujets officiels.
Vérifier les textes officiels (programmes, modalités, calendrier) sur devenirenseignant.gouv.fr et Éduscol avant les épreuves.

## Lancer le site sur l'ordinateur

Il faut **Node.js 22.18 ou plus récent** (le vérificateur `npm run check` lit directement des fichiers TypeScript, ce que les versions antérieures ne savent pas faire).

- Le plus simple : double-cliquer sur **`Ouvrir Atelier NSI.bat`** (installe les dépendances la première fois, lance le serveur et
  ouvre le navigateur).
- En ligne de commande :

```bash
npm install
npm run dev
```

puis ouvrir <http://localhost:4321>.

Autres commandes :

| Commande | Rôle |
|---|---|
| `npm run build` | construit le site statique dans `dist/` |
| `npm run preview` | sert le site construit, pour le tester tel qu'il sera en ligne |
| `npm run check` | vérifie tout le contenu : en-têtes des leçons, structure, couverture du programme, et **exécute** chaque solution Python et SQL contre ses tests et chaque exemple de code (Python, SQL, JavaScript) |

`npm run check` utilise Python (commande `python`) pour exécuter les solutions. Ajouter `-- --strict` pour transformer les
avertissements de couverture du programme en erreurs.

## Organisation du code

```text
src/
  content/lecons/<module>/NN-<sujet>.md   les leçons (Markdown + directives, voir docs/rediger-une-lecon.md)
  content/sujets/*.md                     les sujets blancs
  data/modules.ts                         les modules et l'ordre des leçons (le plan du parcours)
  data/programme.ts                       les lignes du programme officiel (pour la couverture)
  data/concours.ts                        les épreuves et le calendrier
  data/objectifs.ts                       les objectifs (contractuel, CAPES) : étapes, leçons et niveau visé
  data/synchro.ts                         l'adresse et la clé publique du projet Supabase (synchronisation)
  plugins/                                le plugin Markdown (encadrés, exercices, schémas, code exécutable)
  pages/                                  les pages du site (Astro)
  scripts/                                le code du navigateur (exercices, Python, SQL, révisions, progression…)
  styles/global.css                       le style
public/
  python-worker.mjs                       Python (Pyodide) dans un Web Worker
  bases/*.sql                             les bases de données des exercices SQL
scripts/verifier.mjs                      le vérificateur de contenu (npm run check)
supabase/schema.sql                       la table de la synchronisation et ses règles d'accès
docs/                                     guide de rédaction et plan de la correction par IA
_ancienne-version/                        l'ancienne version du site, conservée telle quelle
```

Pour ajouter ou modifier une leçon : voir **[docs/rediger-une-lecon.md](docs/rediger-une-lecon.md)**, puis lancer `npm run check`.

## Mettre en ligne sur Vercel

Le site est **statique** : Vercel le détecte automatiquement (framework Astro).

1. Mettre le projet dans un dépôt GitHub (le dossier `node_modules`, `dist` et `.astro` sont ignorés par `.gitignore`).
2. Sur vercel.com : *Add New → Project*, importer le dépôt. Réglages détectés : *Build Command* `npm run build`, *Output Directory*
   `dist`. Déployer.
3. Chaque modification poussée sur GitHub est publiée automatiquement.

**Progression** : sans synchronisation, elle est propre à chaque adresse (Réglages → *Exporter* sur l'une, *Importer* sur l'autre).
La progression de l'ancienne version (format différent) n'est pas reprise.

## Synchronisation entre appareils (Supabase)

On se connecte avec son adresse e-mail (lien de connexion, pas de mot de passe) sur chaque appareil : la progression est fusionnée
et la même partout. La fusion (`src/scripts/fusion.ts`) ne perd rien : pour chaque leçon, exercice, carte ou chronomètre, la
modification la plus récente l'emporte ; « Tout effacer » en étant connecté remet à zéro tous les appareils. La bibliothèque
Supabase n'est chargée que sur un appareil connecté.

1. Créer un projet gratuit sur supabase.com, **avec la même adresse e-mail que celle qui servira à se connecter** : sans serveur
   d'envoi personnalisé, Supabase n'envoie ses e-mails qu'aux membres du projet, et seulement quelques-uns par heure.
2. *SQL Editor* : coller le contenu de `supabase/schema.sql` et cliquer sur *Run* (table `progression` ; chaque compte ne voit
   que sa ligne).
3. *Authentication → URL Configuration* (les noms de menus de Supabase changent parfois : chercher « URL Configuration ») :
   *Site URL* = l'adresse Vercel ; dans *Redirect URLs*, ajouter
   `https://<adresse-vercel>/**` et `http://localhost:4321/**`.
4. Bouton *Connect* en haut du projet, ou *Project Settings → API Keys* : recopier la *Project URL* et la **publishable key** (`sb_publishable_…`) dans
   `src/data/synchro.ts`, puis pousser sur GitHub. Ces deux valeurs sont publiques par conception ; **jamais** la clé secrète
   ni la clé `service_role`.
5. Sur chaque appareil : Réglages → *Synchroniser entre appareils* → recevoir le lien et cliquer dessus. Facultatif, une fois
   connecté : dans les réglages d'authentification (*Sign In / Providers*), désactiver *Allow new users to sign up*, pour que
   personne d'autre ne puisse créer de compte. Ouvrir le lien dans le navigateur où l'on utilise le site (sinon, copier le lien
   dans sa barre d'adresse).

## Intelligence artificielle (Claude Haiku)

Toujours à la demande, réservée au compte connecté : **Faire relire par l'IA** sur les exercices de rédaction, **Explique-le à
l'oral** en fin de leçon (entraînement face au jury pour les leçons sur le métier), et la **dictée au micro**. La clé de l'API reste
sur le serveur (fonctions Vercel `src/pages/api/`). Configuration (deux variables sur Vercel), coûts et architecture :
**[docs/correction-ia.md](docs/correction-ia.md)**.

## Sources officielles

- [Épreuves du CAPES externe NSI bac + 3](https://www.devenirenseignant.gouv.fr/les-epreuves-du-capes-externe-bac3-section-numerique-et-sciences-informatiques-1459)
- [Calendrier des concours, session 2027](https://www.devenirenseignant.gouv.fr/le-calendrier-des-concours-de-recrutement-d-enseignants-du-second-degre-de-la-session-2027-1562)
- [Programmes du lycée sur Éduscol](https://eduscol.education.gouv.fr/4368/enseigner-au-lycee-generaltechnologique)
- [Épreuve de NSI au baccalauréat (BO spécial n° 4 du 17 septembre 2026)](https://www.education.gouv.fr/bo/2026/Special4/MENE2622643N)
- [Pyodide](https://pyodide.org/) · [sql.js](https://sql.js.org/) · [Astro](https://docs.astro.build/)
