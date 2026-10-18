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
sable isolé. La progression est enregistrée **dans le navigateur** (localStorage) ; la page Réglages permet de l'exporter et de
l'importer (par exemple pour passer d'un ordinateur à un autre, ou du site local au site en ligne).

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
  plugins/                                le plugin Markdown (encadrés, exercices, schémas, code exécutable)
  pages/                                  les pages du site (Astro)
  scripts/                                le code du navigateur (exercices, Python, SQL, révisions, progression…)
  styles/global.css                       le style
public/
  python-worker.mjs                       Python (Pyodide) dans un Web Worker
  bases/*.sql                             les bases de données des exercices SQL
scripts/verifier.mjs                      le vérificateur de contenu (npm run check)
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

**Progression** : elle est propre à chaque adresse. Pour retrouver sa progression locale sur le site en ligne : Réglages → *Exporter
ma progression* sur l'un, puis *Importer* sur l'autre. La progression de l'ancienne version (format différent) n'est pas reprise.

## Correction par intelligence artificielle (prévue)

Les rédactions sont aujourd'hui auto-évaluées avec le corrigé et les critères. Une correction détaillée par Claude Haiku, appelée
depuis une fonction serveur (la clé d'API ne va jamais dans le navigateur), est prévue : voir **[docs/correction-ia.md](docs/correction-ia.md)**.

## Sources officielles

- [Épreuves du CAPES externe NSI bac + 3](https://www.devenirenseignant.gouv.fr/les-epreuves-du-capes-externe-bac3-section-numerique-et-sciences-informatiques-1459)
- [Calendrier des concours, session 2027](https://www.devenirenseignant.gouv.fr/le-calendrier-des-concours-de-recrutement-d-enseignants-du-second-degre-de-la-session-2027-1562)
- [Programmes du lycée sur Éduscol](https://eduscol.education.gouv.fr/4368/enseigner-au-lycee-generaltechnologique)
- [Épreuve de NSI au baccalauréat (BO spécial n° 4 du 17 septembre 2026)](https://www.education.gouv.fr/bo/2026/Special4/MENE2622643N)
- [Pyodide](https://pyodide.org/) · [sql.js](https://sql.js.org/) · [Astro](https://docs.astro.build/)
