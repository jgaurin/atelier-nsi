// Lecture des exercices écrits en Markdown (directive ::::exercice).
// Ce module est partagé par le site (remark-atelier.mjs) et par le script de vérification
// (scripts/verifier.mjs) : un exercice est donc toujours compris de la même façon.
import { toString } from "mdast-util-to-string";
import { visit } from "unist-util-visit";

export const NIVEAUX = {
  1: "Découverte",
  2: "Entraînement",
  3: "Approfondissement",
  4: "Type concours",
};

export const TYPES = {
  qcm: "QCM",
  python: "Python",
  sql: "SQL",
  redaction: "Rédaction",
};

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
 * - une liste à cocher - [x] / - [ ] : un QCM ;
 * - tout le reste : l'énoncé.
 */
export function analyserExercice(noeud) {
  const attributs = noeud.attributes || {};
  const ex = {
    id: attributs.id || "",
    niveau: Number(attributs.niveau || 1),
    base: attributs.base || "",
    duree: attributs.duree || "",
    titre: [],
    enonce: [],
    indices: [],
    corrige: null,
    criteres: null,
    depart: null,
    tests: null,
    solution: null,
    options: null,
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
      if (r.has("depart")) { ex.depart = enfant; continue; }
      if (r.has("tests")) { ex.tests = enfant; continue; }
      if (r.has("solution")) { ex.solution = enfant; ex.enonceSolutionVisible = true; continue; }
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
