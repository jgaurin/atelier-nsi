// Vérification du contenu : `npm run check` (ajouter --strict pour exiger la couverture complète du programme).
//
// - chaque leçon : en-tête complet, plan (… → L'essentiel → Exercices en dernier), prérequis et lignes de programme valides ;
// - chaque exercice : un corrigé ; QCM avec au moins une bonne réponse ; Python : la solution passe tous les tests ;
//   SQL : la requête de solution s'exécute sur sa base et renvoie des lignes ;
// - chaque exemple ```python exec / ```sql exec / ```javascript exec s'exécute sans erreur (ou avec l'erreur annoncée
//   par le drapeau `erreur`) ;
// - couverture du programme officiel.
import { readFileSync, readdirSync, existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { runInNewContext } from "node:vm";
import { fileURLToPath } from "node:url";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkDirective from "remark-directive";
import { visit } from "unist-util-visit";
import { toString } from "mdast-util-to-string";
import { parse as lireYaml } from "yaml";
import { analyserExercice, analyserQuestion, decouperTests, lireMeta } from "../src/plugins/exercices.mjs";
import { MODULES } from "../src/data/modules.ts";
import { TOUTES_LES_LIGNES } from "../src/data/programme.ts";
import { OBJECTIFS } from "../src/data/objectifs.ts";

const RACINE = fileURLToPath(new URL("..", import.meta.url));
const strict = process.argv.includes("--strict");
const erreurs = [];
const avertissements = [];
const taches = [];
const lieuDesTaches = new Map();
const exemplesJS = [];

const erreur = (fichier, message) => erreurs.push(`${fichier} : ${message}`);
const avertir = (fichier, message) => avertissements.push(`${fichier} : ${message}`);

function lireFichier(chemin) {
  const brut = readFileSync(chemin, "utf8").replace(/\r\n/g, "\n");
  const m = brut.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { entete: null, corps: brut };
  try {
    return { entete: lireYaml(m[1]), corps: m[2] };
  } catch (e) {
    return { entete: null, corps: m[2], erreurYaml: String(e.message).split(/\r?\n/)[0] };
  }
}

const analyseur = unified().use(remarkParse).use(remarkGfm).use(remarkDirective);

function baseSQL(nom) {
  const chemin = join(RACINE, "public", "bases", `${nom}.sql`);
  return existsSync(chemin) ? readFileSync(chemin, "utf8") : null;
}

function ajouterTache(lieu, tache) {
  const id = `t${taches.length}`;
  taches.push({ ...tache, id });
  lieuDesTaches.set(id, lieu);
}

const idsExercices = new Map();

function verifierCorps(fichier, corps, { estLecon, niveauClasse = false }) {
  const arbre = analyseur.parse(corps);

  // Plan de la leçon.
  const titres = arbre.children.filter((n) => n.type === "heading" && n.depth === 2).map((n) => toString(n).trim());
  if (estLecon) {
    const normaliser = (t) => t.toLowerCase().replace(/’/g, "'");
    const iEssentiel = titres.findIndex((t) => normaliser(t).startsWith("l'essentiel"));
    const iExercices = titres.findIndex((t) => normaliser(t).startsWith("exercices"));
    if (iExercices === -1) erreur(fichier, "pas de section « ## Exercices »");
    else if (iExercices !== titres.length - 1) erreur(fichier, "« ## Exercices » doit être la dernière section");
    if (iEssentiel === -1) erreur(fichier, "pas de section « ## L'essentiel »");
    else if (iExercices !== -1 && iEssentiel > iExercices) erreur(fichier, "« L'essentiel » doit venir avant « Exercices »");
    if (titres.length < 4) avertir(fichier, `seulement ${titres.length} sections de niveau 2 : leçon un peu courte ?`);
  }

  // Exercices.
  let nombre = 0;
  const parNiveau = [0, 0, 0, 0, 0];
  visit(arbre, "containerDirective", (noeud) => {
    if (noeud.name !== "exercice") return;
    nombre += 1;
    const ex = analyserExercice(noeud);
    const nom = `exercice ${nombre}${ex.titreTexte ? ` « ${ex.titreTexte} »` : ""}`;
    if (!ex.titreTexte) avertir(fichier, `${nom} sans titre`);
    if (!(ex.niveau >= 1 && ex.niveau <= 4)) erreur(fichier, `${nom} : niveau ${ex.niveau} invalide (1 à 4)`);
    parNiveau[ex.niveau] = (parNiveau[ex.niveau] ?? 0) + 1;
    if (ex.id) {
      if (idsExercices.has(ex.id)) erreur(fichier, `${nom} : identifiant #${ex.id} déjà utilisé dans ${idsExercices.get(ex.id)}`);
      idsExercices.set(ex.id, fichier);
    }
    if (!ex.corrige && ex.type !== "quiz") erreur(fichier, `${nom} : pas de :::corrige`);
    if (ex.enonce.length === 0) erreur(fichier, `${nom} : énoncé vide`);
    if (ex.type === "quiz") {
      const questions = ex.questions?.children ?? [];
      if (questions.length < 5) erreur(fichier, `${nom} : un grand QCM compte au moins 5 questions (liste numérotée)`);
      questions.forEach((item, i) => {
        const q = analyserQuestion(item);
        const options = q.options?.children ?? [];
        const bonnes = options.filter((li) => li.checked).length;
        if (options.length < 2) erreur(fichier, `${nom}, question ${i + 1} : au moins deux réponses (- [ ] / - [x])`);
        if (bonnes !== 1) erreur(fichier, `${nom}, question ${i + 1} : il faut exactement une bonne réponse [x] (${bonnes} trouvée(s))`);
        if (!q.explication) avertir(fichier, `${nom}, question ${i + 1} : pas d'explication (> …)`);
        if (!q.enonce.length) erreur(fichier, `${nom}, question ${i + 1} : énoncé vide`);
      });
    }
    if (ex.type === "qcm") {
      const options = ex.options?.children ?? [];
      if (options.length < 2) erreur(fichier, `${nom} : un QCM doit proposer au moins deux réponses`);
      if (!options.some((li) => li.checked)) erreur(fichier, `${nom} : aucune bonne réponse cochée [x]`);
    }
    if (ex.type === "python") {
      if (!ex.tests) erreur(fichier, `${nom} : pas de bloc \`\`\`python tests`);
      if (!ex.solution) erreur(fichier, `${nom} : pas de bloc \`\`\`python solution dans le corrigé`);
      if (ex.tests && ex.solution) {
        const tests = decouperTests(ex.tests.value);
        if (tests.length < 2) avertir(fichier, `${nom} : un seul test, pense aux cas limites`);
        ajouterTache(`${fichier}, ${nom}`, { nature: "python", code: ex.solution.value, tests });
      }
    }
    if (ex.type === "sql") {
      const base = baseSQL(ex.base);
      if (!ex.base || base === null) erreur(fichier, `${nom} : base SQL « ${ex.base} » introuvable dans public/bases/`);
      else if (!ex.solution) erreur(fichier, `${nom} : pas de bloc \`\`\`sql solution`);
      else ajouterTache(`${fichier}, ${nom}`, { nature: "sql", code: ex.solution.value, base });
    }
  });
  if (estLecon) {
    if (nombre < 4) avertir(fichier, `seulement ${nombre} exercice(s)`);
    if (nombre > 0 && !niveauClasse && parNiveau[3] + parNiveau[4] === 0) avertir(fichier, "aucun exercice de niveau 3 ou 4");
    if (niveauClasse && parNiveau[3] + parNiveau[4] > 0) avertir(fichier, "fiche de classe : exercice de niveau 3 ou 4 (niveau concours) à éviter");
  }

  // Exemples exécutables.
  visit(arbre, "code", (code) => {
    const meta = lireMeta(code.meta);
    if (!meta.drapeaux.has("exec")) return;
    const erreurAttendue = meta.drapeaux.has("erreur");
    const lieu = `${fichier}, exemple ligne ${code.position?.start.line}`;
    if (code.lang === "python") ajouterTache(lieu, { nature: "exemple", code: code.value, erreur_attendue: erreurAttendue });
    else if (code.lang === "sql") {
      const base = meta.valeurs.base ? baseSQL(meta.valeurs.base) : "";
      if (base === null) erreur(fichier, `exemple SQL : base « ${meta.valeurs.base} » introuvable`);
      else ajouterTache(lieu, { nature: "sql-exemple", code: code.value, base, erreur_attendue: erreurAttendue });
    } else if (code.lang === "javascript") exemplesJS.push({ lieu, code: code.value, erreurAttendue });
  });
  return nombre;
}

/* Leçons ---------------------------------------------------------------- */
const dossierLecons = join(RACINE, "src", "content", "lecons");
const modulesConnus = new Map(MODULES.map((m) => [m.id, m]));
const lignesConnues = new Set(TOUTES_LES_LIGNES.map((l) => l.id));
const couverture = new Map();
const lecons = [];
let totalExercices = 0;
let totalCartes = 0;

for (const dossier of readdirSync(dossierLecons, { withFileTypes: true })) {
  if (!dossier.isDirectory()) continue;
  if (!modulesConnus.has(dossier.name)) erreur(`lecons/${dossier.name}`, "dossier qui ne correspond à aucun module de src/data/modules.ts");
  for (const nomFichier of readdirSync(join(dossierLecons, dossier.name))) {
    if (!nomFichier.endsWith(".md")) continue;
    const fichier = `lecons/${dossier.name}/${nomFichier}`;
    const m = nomFichier.match(/^(\d\d)-(.+)\.md$/);
    if (!m) { erreur(fichier, "nom attendu : NN-slug.md"); continue; }
    const cle = `${dossier.name}/${m[2]}`;
    const module = modulesConnus.get(dossier.name);
    const position = module?.plan.findIndex(([slug]) => slug === m[2]) ?? -1;
    if (module && position === -1) avertir(fichier, "leçon absente du plan du module (src/data/modules.ts)");
    else if (module && Number(m[1]) !== position + 1) avertir(fichier, `numéro ${m[1]} différent de sa place dans le plan (${position + 1})`);
    const { entete, corps, erreurYaml } = lireFichier(join(dossierLecons, dossier.name, nomFichier));
    if (!entete) { erreur(fichier, erreurYaml ? `en-tête YAML invalide : ${erreurYaml} (mets la valeur entre guillemets)` : "en-tête YAML manquant"); continue; }
    for (const champ of ["titre", "resume", "duree", "objectifs"]) if (!entete[champ]) erreur(fichier, `champ « ${champ} » manquant`);
    // Mêmes types que le schéma de src/content.config.ts : un « : » non protégé transforme un texte en dictionnaire.
    for (const champ of ["titre", "resume"]) if (entete[champ] && typeof entete[champ] !== "string") erreur(fichier, `« ${champ} » doit être un texte (mets-le entre guillemets)`);
    for (const champ of ["objectifs", "prerequis", "programme"])
      for (const v of entete[champ] ?? []) if (typeof v !== "string") erreur(fichier, `${champ} : « ${JSON.stringify(v).slice(0, 50)} » n'est pas un texte (mets-le entre guillemets)`);
    for (const c of entete.cartes ?? []) if (c && (typeof c.q !== "string" || typeof c.r !== "string")) erreur(fichier, `carte « ${String(c.q).slice(0, 40)} » : question et réponse doivent être des textes (guillemets)`);
    for (const ligne of entete.programme ?? []) {
      if (!lignesConnues.has(ligne)) erreur(fichier, `ligne de programme inconnue : ${ligne}`);
      couverture.set(ligne, [...(couverture.get(ligne) ?? []), cle]);
    }
    const cartes = entete.cartes ?? [];
    totalCartes += cartes.length;
    if (cartes.length < 4) avertir(fichier, `seulement ${cartes.length} carte(s) de révision`);
    for (const c of cartes) if (!c?.q || !c?.r) erreur(fichier, "carte de révision sans question (q) ou sans réponse (r)");
    for (const c of cartes) if (/\\"/.test(`${c?.q}${c?.r}`)) erreur(fichier, `carte « ${String(c.q).slice(0, 40)}… » : \\" visible, mets la valeur YAML entre guillemets doubles`);
    lecons.push({ cle, fichier, prerequis: entete.prerequis ?? [] });
    totalExercices += verifierCorps(fichier, corps, { estLecon: true, niveauClasse: module?.partie === "classe" });
  }
}
const clesLecons = new Set(lecons.map((l) => l.cle));
for (const l of lecons) for (const p of l.prerequis) if (!clesLecons.has(p)) avertir(l.fichier, `prérequis « ${p} » : leçon pas (encore) écrite`);
// Parcours par objectif (src/data/objectifs.ts) : chaque leçon citée doit exister, une seule fois par objectif.
for (const o of OBJECTIFS) {
  const vues = new Set();
  for (const e of o.etapes) for (const c of e.lecons) {
    if (!clesLecons.has(c)) erreur("src/data/objectifs.ts", `objectif « ${o.id} », étape « ${e.id} » : leçon inconnue « ${c} »`);
    if (vues.has(c)) erreur("src/data/objectifs.ts", `objectif « ${o.id} » : leçon « ${c} » citée deux fois`);
    vues.add(c);
  }
}

/* Sujets ---------------------------------------------------------------- */
const dossierSujets = join(RACINE, "src", "content", "sujets");
let nbSujets = 0;
if (existsSync(dossierSujets)) {
  for (const nomFichier of readdirSync(dossierSujets)) {
    if (!nomFichier.endsWith(".md")) continue;
    nbSujets += 1;
    const fichier = `sujets/${nomFichier}`;
    const { entete, corps } = lireFichier(join(dossierSujets, nomFichier));
    if (!entete?.titre || !entete?.epreuve || !entete?.duree) erreur(fichier, "en-tête incomplet (titre, epreuve, duree)");
    totalExercices += verifierCorps(fichier, corps, { estLecon: false });
  }
}

/* Exécution des solutions et exemples ------------------------------------ */
let executees = 0;

// Exemples JavaScript : exécutés ici même, dans un contexte isolé, comme dans le Worker de la page.
for (const { lieu, code, erreurAttendue } of exemplesJS) {
  let leve = null;
  try {
    // Comme dans la page : le code est le corps d'une fonction asynchrone (on peut y écrire `await`).
    const contexte = { console: { log() {}, info() {}, warn() {}, error() {}, table() {} }, setTimeout, clearTimeout };
    await runInNewContext(`(async () => {\n${code}\n})()`, contexte, { timeout: 3000 });
  } catch (e) {
    leve = e;
  }
  executees += 1;
  if (erreurAttendue && !leve) erreurs.push(`${lieu} : exemple JavaScript marqué « erreur » mais aucune erreur levée`);
  if (!erreurAttendue && leve) erreurs.push(`${lieu} : exemple JavaScript en erreur : ${leve.message}`);
}

if (taches.length) {
  const python = process.platform === "win32" ? "python" : "python3";
  // Dossier temporaire : les exemples qui écrivent des fichiers ne salissent pas le projet.
  const bac = mkdtempSync(join(tmpdir(), "atelier-nsi-"));
  const r = spawnSync(python, ["-I", join(RACINE, "scripts", "executer_verifications.py")], {
    input: JSON.stringify(taches), encoding: "utf8", timeout: 180_000, maxBuffer: 64 * 1024 * 1024, cwd: bac,
  });
  rmSync(bac, { recursive: true, force: true });
  if (r.error || r.status !== 0) {
    erreurs.push(`Impossible d'exécuter les vérifications Python (${r.error?.message ?? r.stderr}). Python est-il installé ?`);
  } else {
    for (const res of JSON.parse(r.stdout)) {
      executees += 1;
      if (!res.ok) erreurs.push(`${lieuDesTaches.get(res.id)} : ${res.message}`);
    }
  }
}

/* Couverture du programme ----------------------------------------------- */
const nonCouvertes = TOUTES_LES_LIGNES.filter((l) => !couverture.has(l.id));
for (const l of nonCouvertes) (strict ? erreurs : avertissements).push(`programme : « ${l.texte} » (${l.id}) n'est couvert par aucune leçon`);

/* Bilan ------------------------------------------------------------------ */
const prevues = MODULES.reduce((n, m) => n + m.plan.length, 0);
console.log(`\nAtelier NSI — vérification du contenu`);
console.log(`  ${lecons.length} leçons écrites sur ${prevues} prévues · ${nbSujets} sujets · ${totalExercices} exercices · ${totalCartes} cartes`);
console.log(`  ${executees} solutions et exemples exécutés · programme couvert : ${TOUTES_LES_LIGNES.length - nonCouvertes.length}/${TOUTES_LES_LIGNES.length} lignes`);
if (avertissements.length) {
  console.log(`\n${avertissements.length} avertissement(s) :`);
  for (const a of avertissements) console.log(`  · ${a}`);
}
if (erreurs.length) {
  console.log(`\n${erreurs.length} erreur(s) :`);
  for (const e of erreurs) console.log(`  ✗ ${e}`);
  process.exit(1);
}
console.log("\n✓ Aucune erreur.");

