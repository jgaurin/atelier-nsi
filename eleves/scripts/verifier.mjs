// Vérification du contenu : `npm run check`.
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
import { analyserExercice, analyserQuestion, analyserReponse, decouperTests, lireMeta, trousDe } from "../src/plugins/exercices.mjs";
import { MODULES } from "../src/data/modules.ts";

const RACINE = fileURLToPath(new URL("..", import.meta.url));
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

const AUTO_CORRIGES = new Set(["quiz", "reponses", "completer", "ordre", "associer"]);

function verifierCorps(fichier, corps, { estLecon, controle = false, programmation = true }) {
  const arbre = analyseur.parse(corps);

  // Plan de la leçon.
  const titres = arbre.children.filter((n) => n.type === "heading" && n.depth === 2).map((n) => toString(n).trim());
  if (estLecon) {
    const normaliser = (t) => t.toLowerCase().replace(/’/g, "'");
    const iEssentiel = titres.findIndex((t) => normaliser(t).startsWith("l'essentiel"));
    const iExercices = titres.findIndex((t) => normaliser(t).startsWith("exercices"));
    if (iExercices === -1) erreur(fichier, "pas de section « ## Exercices »");
    else if (iExercices !== titres.length - 1) erreur(fichier, "« ## Exercices » doit être la dernière section");
    if (!controle && iEssentiel === -1) erreur(fichier, "pas de section « ## L'essentiel »");
    else if (iExercices !== -1 && iEssentiel > iExercices) erreur(fichier, "« L'essentiel » doit venir avant « Exercices »");
    if (titres.some((t) => /^(en classe|ce que dit le programme|les erreurs classiques des élèves)/i.test(t))) erreur(fichier, "section destinée au prof : ce site parle aux élèves");
  }

  // Exercices.
  let nombre = 0;
  const parNiveau = [0, 0, 0, 0, 0];
  const niveaux = [];
  visit(arbre, "containerDirective", (noeud) => {
    if (noeud.name !== "exercice") return;
    nombre += 1;
    const ex = analyserExercice(noeud);
    const nom = `exercice ${nombre}${ex.titreTexte ? ` « ${ex.titreTexte} »` : ""}`;
    if (!ex.titreTexte) avertir(fichier, `${nom} sans titre`);
    if (!(ex.niveau >= 1 && ex.niveau <= 3)) erreur(fichier, `${nom} : niveau ${ex.niveau} invalide (1 à 3)`);
    if (!programmation && (ex.type === "python" || ex.type === "sql")) erreur(fichier, `${nom} : pas de programmation ici, ce chapitre n'en demande pas au programme`);
    parNiveau[ex.niveau] = (parNiveau[ex.niveau] ?? 0) + 1;
    niveaux.push(ex.niveau);
    if (ex.type === "quiz" && !controle && (ex.questions?.children.length ?? 0) > 10) avertir(fichier, `${nom} : QCM trop long`);
    if (ex.id) {
      if (idsExercices.has(ex.id)) erreur(fichier, `${nom} : identifiant #${ex.id} déjà utilisé dans ${idsExercices.get(ex.id)}`);
      idsExercices.set(ex.id, fichier);
    }
    if (!ex.corrige && !AUTO_CORRIGES.has(ex.type)) erreur(fichier, `${nom} : pas de :::corrige`);
    if (ex.enonce.length === 0) erreur(fichier, `${nom} : énoncé vide`);
    if (ex.type === "quiz") {
      const questions = ex.questions?.children ?? [];
      if (questions.length < 4) erreur(fichier, `${nom} : un QCM compte au moins 4 questions (liste numérotée)`);
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
    if (ex.type === "reponses") {
      const questions = ex.questions?.children ?? [];
      if (!questions.length) erreur(fichier, `${nom} : aucune question (liste numérotée)`);
      questions.forEach((item, i) => {
        const q = analyserReponse(item);
        if (!q.enonce.length) erreur(fichier, `${nom}, question ${i + 1} : énoncé vide`);
        if (!q.reponses.length) erreur(fichier, `${nom}, question ${i + 1} : aucune réponse acceptée (- réponse)`);
        if (q.verification && q.reponses.length) ajouterTache(`${fichier}, ${nom}, question ${i + 1}`, { nature: "sortie", code: q.verification.value, attendus: [q.reponses[0]] });
      });
    }
    if (ex.type === "completer" && trousDe(ex.enonce).length === 0) erreur(fichier, `${nom} : aucune case [[réponse]] à compléter`);
    if (ex.type === "completer" && ex.calcul) ajouterTache(`${fichier}, ${nom}`, { nature: "sortie", code: ex.calcul.value, attendus: trousDe(ex.enonce).map((t) => t.split(";")[0]) });
    if (ex.type === "ordre" && (ex.etapes?.children.length ?? 0) < 3) erreur(fichier, `${nom} : il faut au moins 3 étapes (liste numérotée, dans le bon ordre)`);
    if (ex.type === "associer") {
      const lignes = ex.table?.children.slice(1) ?? [];
      if (lignes.length < 3) erreur(fichier, `${nom} : il faut un tableau d'au moins 3 lignes`);
      if (lignes.some((l) => l.children.length !== 2)) erreur(fichier, `${nom} : le tableau doit avoir exactement 2 colonnes`);
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
    if (nombre < 3) avertir(fichier, `seulement ${nombre} exercice(s)`);
    if (!controle) {
      if (nombre > 7) avertir(fichier, `${nombre} exercices : trop pour une leçon`);
      if (!niveaux.includes(3)) avertir(fichier, "aucun exercice type bac (niveau 3)");
      if (niveaux.some((n, i) => i > 0 && n < niveaux[i - 1])) avertir(fichier, "les exercices doivent aller du plus simple au plus difficile");
    }
  }

  // Exemples exécutables.
  visit(arbre, "code", (code) => {
    const meta = lireMeta(code.meta);
    if (!meta.drapeaux.has("exec")) return;
    const erreurAttendue = meta.drapeaux.has("erreur");
    const lieu = `${fichier}, exemple ligne ${code.position?.start.line}`;
    if (!programmation && code.lang !== "javascript") erreur(fichier, `exemple exécutable ligne ${code.position?.start.line} : pas de programmation dans ce chapitre`);
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
const lecons = [];
let totalExercices = 0;

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
    for (const champ of ["objectifs", "prerequis"])
      for (const v of entete[champ] ?? []) if (typeof v !== "string") erreur(fichier, `${champ} : « ${JSON.stringify(v).slice(0, 50)} » n'est pas un texte (mets-le entre guillemets)`);
    lecons.push({ cle, fichier, prerequis: entete.prerequis ?? [] });
    totalExercices += verifierCorps(fichier, corps, { estLecon: true, controle: entete.controle === true, programmation: entete.programmation ?? module?.programmation ?? true });
  }
}
const clesLecons = new Set(lecons.map((l) => l.cle));
for (const l of lecons) for (const p of l.prerequis) if (!clesLecons.has(p)) avertir(l.fichier, `prérequis « ${p} » : leçon pas (encore) écrite`);
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

/* Bilan ------------------------------------------------------------------ */
const prevues = MODULES.reduce((n, m) => n + m.plan.length, 0);
console.log(`\nNSI Lycée — vérification du contenu`);
console.log(`  ${lecons.length} leçons écrites sur ${prevues} prévues · ${totalExercices} exercices · ${executees} solutions et exemples exécutés`);
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

