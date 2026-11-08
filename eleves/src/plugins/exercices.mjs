// Lecture des exercices écrits en Markdown (directive ::::exercice).
// Ce module est partagé par le site (remark-atelier.mjs) et par le script de vérification
// (scripts/verifier.mjs) : un exercice est donc toujours compris de la même façon.
import { toString } from "mdast-util-to-string";
import { visit } from "unist-util-visit";

export const NIVEAUX = {
  1: "Pour commencer",
  2: "Entraînement",
  3: "Type contrôle",
};

export const TYPES = {
  qcm: "QCM",
  quiz: "Grand QCM",
  python: "Python",
  sql: "SQL",
  redaction: "Rédaction",
  reponses: "Réponses courtes",
  completer: "À compléter",
  ordre: "Remettre dans l'ordre",
  associer: "À associer",
};

/** Une case à remplir, écrite [[réponse]] ou [[réponse;autre réponse acceptée]]. */
export const MOTIF_TROU = /\[\[([^\]]+)\]\]/g;

/** Lit les informations d'un bloc de code : ```python exec base=lycee legende="..." */
export function lireMeta(meta) {
  const resultat = { drapeaux: new Set(), valeurs: {} };
  if (!meta) return resultat;
  const motif = /([\w-]+)(?:=(?:"([^"]*)"|'([^']*)'|(\S+)))?/g;
  let m;
  while ((m = motif.exec(meta))) {
    const valeur = m[2] ?? m[3] ?? m[4];
    if (valeur === undefined) resultat.drapeaux.add(m[1]);
    else resultat.valeurs[m[1]] = valeur;
  }
  return resultat;
}

function role(code) {
  return lireMeta(code.meta).drapeaux;
}

/**
 * Découpe un bloc ```python tests en tests individuels.
 * Chaque test se termine par une ligne « assert ... » (en début de ligne) ; les lignes qui précèdent
 * servent à le préparer. Le message de l'assertion sert d'intitulé : assert f(3) == 6, "cas simple".
 */
export function decouperTests(code) {
  // Un test se termine après une instruction `assert` écrite en colonne 0, y compris ses lignes de
  // continuation (indentées ou fermant une parenthèse) : on coupe à la ligne suivante en colonne 0.
  const lignes = code.replace(/\r/g, "").split("\n");
  const tests = [];
  let courant = [];
  let assertEnCours = false;
  for (const ligne of lignes) {
    const colonne0 = /^\S/.test(ligne) && !/^[)\]}]/.test(ligne);
    if (assertEnCours && colonne0) {
      tests.push(courant.join("\n").trim());
      courant = [];
      assertEnCours = false;
    }
    courant.push(ligne);
    if (/^assert\b/.test(ligne)) assertEnCours = true;
  }
  const reste = courant.join("\n").trim();
  if (reste) {
    if (assertEnCours || !tests.length) tests.push(reste);
    else tests[tests.length - 1] += "\n" + reste;
  }
  return tests.map((code, i) => ({ label: intitule(code, i), code }));
}

function intitule(code, i) {
  const lignes = code.split("\n");
  const debut = lignes.map((l) => /^assert\b/.test(l)).lastIndexOf(true);
  const assertion = debut < 0 ? "" : lignes.slice(debut).map((l) => l.trim().replace(/\\$/, "")).join(" ");
  const message = assertion.match(/,\s*(["'])((?:(?!\1).)*)\1\s*$/);
  if (message) return message[2];
  const expression = assertion.replace(/^assert\s+/, "").trim();
  return expression ? expression.slice(0, 100) : `Test ${i + 1}`;
}

/**
 * Analyse un nœud ::::exercice et renvoie ses morceaux.
 * - étiquette [Titre] : le titre ;
 * - :::indice (plusieurs possibles), :::corrige, :::criteres ;
 * - ```python depart / ```python tests / ```sql solution (le bloc solution peut être dans le corrigé) ;
 * - ```python trous : code affiché avec des cases [[réponse]] ;
 * - ```python calcul : jamais affiché, exécuté par npm run check pour contrôler les réponses attendues ;
 * - ```python verifier : affiché, et contrôlé de la même façon ;
 * - une liste à cocher - [x] / - [ ] : un QCM ;
 * - tout le reste : l'énoncé.
 */
/**
 * Une question de grand QCM (élément de la liste numérotée) : l'énoncé, la liste des réponses (- [x] / - [ ]),
 * et une explication facultative écrite en citation (> …).
 */
export function analyserQuestion(item) {
  const q = { enonce: [], options: null, explication: null };
  for (const enfant of item.children) {
    if (!q.options && enfant.type === "list" && enfant.children.some((li) => typeof li.checked === "boolean")) q.options = enfant;
    else if (!q.explication && enfant.type === "blockquote") q.explication = enfant;
    else q.enonce.push(enfant);
  }
  return q;
}

/** Une question à réponse courte : l'énoncé, la liste des réponses acceptées (- 12), une explication facultative (> …). */
export function analyserReponse(item) {
  const q = { enonce: [], reponses: [], explication: null, verification: null };
  for (const enfant of item.children) {
    if (enfant.type === "code" && role(enfant).has("calcul")) { q.verification = enfant; continue; }
    if (enfant.type === "code" && role(enfant).has("verifier")) q.verification = enfant;
    if (!q.reponses.length && enfant.type === "list" && !enfant.ordered) q.reponses = enfant.children.map((li) => toString(li).trim());
    else if (!q.explication && enfant.type === "blockquote") q.explication = enfant;
    else q.enonce.push(enfant);
  }
  return q;
}

/** Les cases d'un exercice à compléter : les réponses acceptées de chaque [[…]] de l'énoncé. */
export function trousDe(noeuds) {
  const trous = [];
  visit({ type: "root", children: noeuds }, (t) => {
    if (t.type !== "text" && !(t.type === "code" && role(t).has("trous"))) return;
    for (const m of t.value.matchAll(MOTIF_TROU)) trous.push(m[1]);
  });
  return trous;
}

export function analyserExercice(noeud) {
  const attributs = noeud.attributes || {};
  const ex = {
    id: attributs.id || "",
    niveau: Number(attributs.niveau || 1),
    base: attributs.base || "",
    duree: attributs.duree || "",
    points: attributs.points || "",
    titre: [],
    enonce: [],
    indices: [],
    corrige: null,
    criteres: null,
    depart: null,
    tests: null,
    solution: null,
    options: null,
    questions: null,
    etapes: null,
    table: null,
    calcul: null,
    type: attributs.type || "",
  };
  for (const enfant of noeud.children) {
    if (enfant.type === "paragraph" && enfant.data?.directiveLabel) {
      ex.titre = enfant.children;
      continue;
    }
    if (enfant.type === "containerDirective") {
      if (enfant.name === "indice") { ex.indices.push(enfant); continue; }
      if (enfant.name === "corrige") { ex.corrige = enfant; continue; }
      if (enfant.name === "criteres") { ex.criteres = enfant; continue; }
    }
    if (enfant.type === "code") {
      const r = role(enfant);
      if (r.has("calcul")) { ex.calcul = enfant; continue; }
      if (r.has("depart")) { ex.depart = enfant; continue; }
      if (r.has("tests")) { ex.tests = enfant; continue; }
      if (r.has("solution")) { ex.solution = enfant; ex.enonceSolutionVisible = true; continue; }
    }
    if ((ex.type === "quiz" || ex.type === "reponses") && !ex.questions && enfant.type === "list" && enfant.ordered) {
      ex.questions = enfant;
      continue;
    }
    if (ex.type === "ordre" && !ex.etapes && enfant.type === "list" && enfant.ordered) {
      ex.etapes = enfant;
      continue;
    }
    if (ex.type === "associer" && !ex.table && enfant.type === "table") {
      ex.table = enfant;
      continue;
    }
    if (!ex.options && enfant.type === "list" && enfant.children.some((li) => typeof li.checked === "boolean")) {
      ex.options = enfant;
      continue;
    }
    ex.enonce.push(enfant);
  }
  if (!ex.solution && ex.corrige) {
    visit(ex.corrige, "code", (code) => {
      if (!ex.solution && role(code).has("solution")) ex.solution = code;
    });
  }
  if (!ex.type) {
    if (ex.options) ex.type = "qcm";
    else if (ex.solution?.lang === "sql") ex.type = "sql";
    else if (ex.tests) ex.type = "python";
    else ex.type = "redaction";
  }
  ex.titreTexte = toString({ type: "paragraph", children: ex.titre }).trim();
  return ex;
}
