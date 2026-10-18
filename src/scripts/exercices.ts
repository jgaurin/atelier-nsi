// Rend les exercices interactifs : QCM, Python (tests automatiques), SQL (comparaison de résultats)
// et rédaction (corrigé + critères, puis auto-évaluation ; relecture par l'IA si on la demande).
import * as progression from "./progression";
import { executerPython, pythonEstPret, type TestPython } from "./python";
import { comparer, executerSQL, schemaBase } from "./sql";
import { correcteurPourRedaction, type Correction } from "./correction";
import { bouton, differer, el, iconeIA, tableHTML } from "./dom";
import { appelIA, type Relecture } from "./ia";
import { boutonDictee } from "./dictee";
import { synchroConfiguree } from "../data/synchro";
import type { Editeur } from "./editeur";

interface Contexte {
  section: HTMLElement;
  id: string;
  actions: HTMLElement;
  message: HTMLElement;
  etat: HTMLElement;
  indices: HTMLElement[];
  corrige: HTMLElement | null;
  criteres: HTMLElement | null;
  /** L'apprenant a-t-il essayé (exécuté, vérifié, écrit) avant de demander le corrigé ? */
  aEssaye: () => boolean;
  surCorrige?: () => void;
}

export function initialiserExercices(racine: ParentNode = document) {
  racine.querySelectorAll<HTMLElement>("section.exercice:not([data-pret])").forEach((section) => {
    section.dataset.pret = "1";
    try {
      initialiser(section);
    } catch (e) {
      console.error("Exercice", section.dataset.exercice, e);
    }
  });
}

function initialiser(section: HTMLElement) {
  const actions = section.querySelector<HTMLElement>(".exercice-actions")!;
  const message = el("div", { class: "exercice-message", role: "status", "aria-live": "polite" });
  actions.after(message);
  const etat = el("span", { class: "exercice-etat" });
  section.querySelector(".exercice-tete")!.append(etat);

  const ctx: Contexte = {
    section,
    id: section.dataset.exercice!,
    actions,
    message,
    etat,
    indices: [...section.querySelectorAll<HTMLElement>(".exercice-indice")],
    corrige: section.querySelector(".exercice-corrige"),
    criteres: section.querySelector(".exercice-criteres"),
    aEssaye: () => false,
  };
  afficherStatut(ctx);

  switch (section.dataset.type) {
    case "qcm": qcm(ctx); break;
    case "python": exercicePython(ctx); break;
    case "sql": exerciceSQL(ctx); break;
    default: redaction(ctx);
  }
  boutonsCommuns(ctx);
}

function dire(ctx: Contexte, texte: string, ton: "bien" | "moyen" | "info" = "info") {
  ctx.message.dataset.ton = ton;
  ctx.message.textContent = texte;
}

function afficherStatut(ctx: Contexte) {
  const statut = progression.exercice(ctx.id)?.statut;
  ctx.section.dataset.statut = statut ?? "";
  ctx.etat.dataset.statut = statut ?? "";
  ctx.etat.textContent = statut === "reussi" ? "✓ Réussi" : statut === "a-revoir" ? "↺ À revoir" : "";
}

function noter(ctx: Contexte, statut: progression.StatutExercice) {
  progression.noterExercice(ctx.id, statut);
  afficherStatut(ctx);
}

/* Indices et corrigé (communs à tous les types) ------------------------ */
function boutonsCommuns(ctx: Contexte) {
  ctx.actions.append(el("span", { class: "espace" }));
  if (ctx.indices.length) {
    let montres = 0;
    const b = bouton(ctx.indices.length > 1 ? `Indice (1/${ctx.indices.length})` : "Indice", "bouton bouton-petit bouton-discret");
    b.addEventListener("click", () => {
      ctx.indices[montres].hidden = false;
      montres += 1;
      if (montres >= ctx.indices.length) b.remove();
      else b.textContent = `Indice (${montres + 1}/${ctx.indices.length})`;
    });
    ctx.actions.append(b);
  }
  if (ctx.corrige || ctx.criteres) {
    let insistance = false;
    const b = bouton("Voir le corrigé", "bouton bouton-petit bouton-second");
    b.addEventListener("click", () => {
      const visible = ctx.corrige ? !ctx.corrige.hidden : false;
      if (visible) {
        if (ctx.corrige) ctx.corrige.hidden = true;
        if (ctx.criteres) ctx.criteres.hidden = true;
        b.textContent = "Voir le corrigé";
        return;
      }
      if (!ctx.aEssaye() && !insistance) {
        insistance = true;
        dire(ctx, ctx.indices.length
          ? "Cherche encore un peu : un indice peut te débloquer. (Clique à nouveau pour voir le corrigé.)"
          : "Essaie d'abord, même une réponse incomplète : c'est en cherchant qu'on retient. (Clique à nouveau pour voir le corrigé.)");
        return;
      }
      montrerCorrige(ctx);
      b.textContent = "Masquer le corrigé";
    });
    ctx.actions.append(b);
  }
}

function montrerCorrige(ctx: Contexte) {
  if (ctx.criteres) ctx.criteres.hidden = false;
  if (ctx.corrige) ctx.corrige.hidden = false;
  if (ctx.message.dataset.ton === "info") ctx.message.textContent = "";
  ctx.surCorrige?.();
  if (progression.exercice(ctx.id) === undefined) noter(ctx, "tente");
}

/* QCM ---------------------------------------------------------------- */
function qcm(ctx: Contexte) {
  const liste = ctx.section.querySelector<HTMLOListElement>("ol.qcm");
  if (!liste) return;
  const multiple = liste.dataset.multiple === "1";
  const items = [...liste.children] as HTMLLIElement[];
  items.forEach((li, i) => {
    const contenu = el("div");
    contenu.append(...li.childNodes);
    const choix = el("input", { type: multiple ? "checkbox" : "radio", name: `qcm-${ctx.id}`, value: String(i) });
    li.append(el("label", {}, choix, contenu));
  });
  if (multiple) liste.before(el("p", { class: "editeur-aide" }, "Plusieurs réponses possibles."));

  let verifie = false;
  ctx.aEssaye = () => verifie;
  const b = bouton("Vérifier");
  b.addEventListener("click", () => {
    const entrees = items.map((li) => li.querySelector("input")!);
    if (verifie) {
      verifie = false;
      entrees.forEach((e) => { e.checked = false; e.disabled = false; });
      items.forEach((li) => delete li.dataset.resultat);
      b.textContent = "Vérifier";
      ctx.message.textContent = "";
      if (ctx.corrige) ctx.corrige.hidden = true;
      return;
    }
    const coches = entrees.map((e) => e.checked);
    if (!coches.some(Boolean)) return dire(ctx, "Choisis d'abord une réponse.");
    let juste = true;
    items.forEach((li, i) => {
      const bonne = li.dataset.ok === "1";
      li.dataset.resultat = coches[i] && bonne ? "bonne" : coches[i] ? "erreur" : bonne ? "oubli" : "";
      if (coches[i] !== bonne) juste = false;
    });
    entrees.forEach((e) => (e.disabled = true));
    verifie = true;
    b.textContent = "Recommencer";
    noter(ctx, juste ? "reussi" : "a-revoir");
    dire(ctx, juste ? "Bonne réponse !" : "Pas tout à fait : la ou les bonnes réponses sont encadrées en vert. Lis le corrigé.", juste ? "bien" : "moyen");
    if (ctx.corrige) ctx.corrige.hidden = false;
  });
  ctx.actions.append(b);
}

/* Éditeur de code (chargé à la demande) --------------------------------- */
async function monterEditeur(zone: HTMLElement, texte: string, langage: "python" | "sql", surExecuter: () => void, surChangement: (t: string) => void): Promise<Editeur> {
  const conteneur = el("div", { class: "editeur-cm" });
  zone.append(conteneur);
  try {
    const { creerEditeur } = await import("./editeur");
    return creerEditeur(conteneur, { texte, langage, surExecuter, surChangement });
  } catch {
    conteneur.remove();
    const zoneTexte = el("textarea", { class: "editeur-repli", spellcheck: "false" });
    zoneTexte.value = texte;
    zoneTexte.addEventListener("input", () => surChangement(zoneTexte.value));
    zoneTexte.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); surExecuter(); }
      if (e.key === "Tab") { e.preventDefault(); zoneTexte.setRangeText("    ", zoneTexte.selectionStart, zoneTexte.selectionEnd, "end"); }
    });
    zone.append(zoneTexte);
    return { valeur: () => zoneTexte.value, definir: (t) => (zoneTexte.value = t), focus: () => zoneTexte.focus() };
  }
}

function enTete(ton: "bien" | "mal" | "info", texte: string) {
  return el("div", { class: "resultat-tete", "data-ton": ton }, texte);
}

/* Python -------------------------------------------------------------- */
function exercicePython(ctx: Contexte) {
  const zone = ctx.section.querySelector<HTMLElement>(".editeur-python")!;
  const depart = zone.dataset.depart ?? "";
  const tests: TestPython[] = JSON.parse(zone.dataset.tests || "[]");
  const resultat = el("div", { class: "resultat", "aria-live": "polite" });
  ctx.actions.after(resultat);
  let essais = 0;
  let bilanTests = "";
  ctx.aEssaye = () => essais > 0;

  const lancer = bouton("▶ Exécuter les tests");
  const reinitialiser = bouton("Réinitialiser", "bouton bouton-petit bouton-discret", "Revenir au code de départ");
  ctx.actions.append(lancer, reinitialiser);
  zone.after(el("p", { class: "editeur-aide" }, "Ctrl + Entrée pour exécuter · ton code est enregistré sur cet appareil."));

  const sauver = differer((t: string) => progression.garderBrouillon(ctx.id, t));
  let editeur: Editeur | null = null;
  const pret = monterEditeur(zone, progression.exercice(ctx.id)?.brouillon ?? depart, "python", () => executer(), sauver)
    .then((e) => (editeur = e));

  async function executer() {
    await pret;
    lancer.disabled = true;
    resultat.replaceChildren(el("p", { class: "note" }, el("span", { class: "chargement" }, pythonEstPret() ? "Exécution…" : "Chargement de Python… (quelques secondes la première fois)")));
    const r = await executerPython(editeur!.valeur(), tests);
    lancer.disabled = false;
    essais += 1;
    const morceaux: Node[] = [];
    if (r.erreur) {
      morceaux.push(enTete("mal", "Ton code s'arrête sur une erreur"), el("pre", { class: "resultat-sortie erreur" }, r.erreur));
      bilanTests = `Le code s'arrête sur une erreur :\n${r.erreur}`;
      noter(ctx, "tente");
    } else {
      const reussis = r.tests.filter((t) => t.ok).length;
      const tout = tests.length > 0 && reussis === tests.length;
      bilanTests = `${reussis} test(s) réussi(s) sur ${tests.length} :\n` +
        r.tests.map((t) => `${t.ok ? "✓" : "✗"} ${t.label}${t.detail ? ` (${t.detail})` : ""}`).join("\n");
      morceaux.push(enTete(tout ? "bien" : "mal", tout ? `Bravo : les ${tests.length} tests passent.` : `${reussis} test(s) sur ${tests.length} réussi(s)`));
      morceaux.push(el("ul", { class: "resultat-tests" }, ...r.tests.map((t) =>
        el("li", {}, el("span", { class: t.ok ? "ok" : "ko" }, t.ok ? "✓" : "✗"), el("span", {}, t.label), t.detail ? el("span", { class: "detail" }, t.detail) : null))));
      noter(ctx, tout ? "reussi" : "tente");
      if (tout) dire(ctx, "Exercice réussi. Compare quand même avec le corrigé : il y a parfois une solution plus simple.", "bien");
      else ctx.message.textContent = "";
    }
    if (r.sortie.trim()) morceaux.push(el("pre", { class: "resultat-sortie" }, r.sortie));
    resultat.replaceChildren(...morceaux);
  }

  lancer.addEventListener("click", executer);
  boutonRelecture(ctx, { type: "python", reponse: async () => (await pret, editeur!.valeur()), resultats: () => bilanTests, noteParIA: false });
  reinitialiser.addEventListener("click", async () => {
    await pret;
    if (editeur!.valeur() !== depart && !confirm("Effacer ton code et revenir au code de départ ?")) return;
    editeur!.definir(depart);
    resultat.replaceChildren();
  });
}

/* SQL ----------------------------------------------------------------- */
function exerciceSQL(ctx: Contexte) {
  const zone = ctx.section.querySelector<HTMLElement>(".editeur-sql")!;
  const base = zone.dataset.base ?? "";
  const solution = zone.dataset.solution ?? "";
  const ordreCompte = zone.dataset.ordre === "1";
  const resultat = el("div", { class: "resultat", "aria-live": "polite" });
  let essais = 0;
  let bilanRequete = "";
  ctx.aEssaye = () => essais > 0;

  const schema = el("details", { class: "schema-base" }, el("summary", {}, `Voir les tables de la base « ${base} »`));
  schema.addEventListener("toggle", async () => {
    if (!schema.open || schema.dataset.charge) return;
    schema.dataset.charge = "1";
    const tables = await schemaBase(base);
    schema.append(el("ul", {}, ...tables.map((t) => el("li", {}, el("strong", {}, t.table), ` (${t.colonnes.join(", ")})`))));
  });
  zone.before(schema);
  ctx.actions.after(resultat);
  zone.after(el("p", { class: "editeur-aide" }, "Ctrl + Entrée pour exécuter · la base est remise à zéro à chaque exécution."));

  const lancer = bouton("▶ Exécuter la requête");
  ctx.actions.append(lancer);
  const sauver = differer((t: string) => progression.garderBrouillon(ctx.id, t));
  let editeur: Editeur | null = null;
  const pret = monterEditeur(zone, progression.exercice(ctx.id)?.brouillon ?? (zone.dataset.depart || "SELECT "), "sql", () => executer(), sauver)
    .then((e) => (editeur = e));

  async function executer() {
    await pret;
    lancer.disabled = true;
    resultat.replaceChildren(el("p", { class: "note" }, el("span", { class: "chargement" }, "Exécution…")));
    const [r, attendu] = await Promise.all([executerSQL(editeur!.valeur(), base), executerSQL(solution, base)]);
    lancer.disabled = false;
    essais += 1;
    if (r.erreur) {
      resultat.replaceChildren(enTete("mal", "La requête n'a pas pu s'exécuter"), el("pre", { class: "resultat-sortie erreur" }, r.erreur));
      bilanRequete = `La requête ne s'exécute pas :\n${r.erreur}`;
      noter(ctx, "tente");
      return;
    }
    const obtenu = r.tables.at(-1);
    const verdict = comparer(obtenu, attendu.tables.at(-1), ordreCompte);
    bilanRequete = verdict.egal
      ? "Le résultat est identique au résultat attendu."
      : `Le résultat diffère du résultat attendu : ${verdict.raison}` +
        (obtenu ? `\nColonnes obtenues : ${obtenu.colonnes.join(", ")} ; ${obtenu.lignes.length} ligne(s).` : "\nAucune ligne renvoyée.");
    const morceaux: Node[] = [enTete(verdict.egal ? "bien" : "mal", verdict.egal ? "Résultat identique au résultat attendu." : verdict.raison)];
    if (obtenu) {
      morceaux.push(tableHTML(obtenu.colonnes, obtenu.lignes));
      if (obtenu.lignes.length > 60) morceaux.push(el("p", { class: "note" }, `… ${obtenu.lignes.length - 60} ligne(s) de plus non affichée(s).`));
    } else {
      morceaux.push(el("p", { class: "note" }, "La requête ne renvoie aucune ligne."));
    }
    resultat.replaceChildren(...morceaux);
    noter(ctx, verdict.egal ? "reussi" : "tente");
    if (verdict.egal) dire(ctx, "Exercice réussi. D'autres requêtes peuvent donner le même résultat : compare avec le corrigé.", "bien");
    else ctx.message.textContent = "";
  }
  lancer.addEventListener("click", executer);
  boutonRelecture(ctx, { type: "sql", reponse: async () => (await pret, editeur!.valeur()), resultats: () => bilanRequete, noteParIA: false });
}

/* Rédaction ------------------------------------------------------------ */
function redaction(ctx: Contexte) {
  const zone = ctx.section.querySelector<HTMLElement>(".zone-reponse");
  if (!zone) return;
  const texte = el("textarea", {
    placeholder: "Écris ta réponse ici : raisonnement, trace, code, schéma décrit en mots…",
    "aria-label": "Ta réponse",
    spellcheck: "true",
  });
  texte.value = progression.exercice(ctx.id)?.brouillon ?? "";
  const ajuster = () => { texte.style.height = "auto"; texte.style.height = `${Math.max(texte.scrollHeight + 4, 120)}px`; };
  const sauver = differer((t: string) => progression.garderBrouillon(ctx.id, t));
  texte.addEventListener("input", () => { ajuster(); sauver(texte.value); });
  const micro = boutonDictee(texte, (m) => dire(ctx, m));
  zone.append(
    texte,
    el("div", { class: "zone-outils" }, micro,
      el("p", { class: "aide" }, "Ta réponse est enregistrée sur cet appareil. Rédige comme le jour de l'épreuve : phrases complètes, justifications.")),
  );
  requestAnimationFrame(ajuster);
  ctx.aEssaye = () => texte.value.trim().length >= 15;

  boutonRelecture(ctx, { type: "redaction", reponse: () => texte.value, noteParIA: true });

  const boite = el("div", { class: "auto-evaluation", hidden: true });
  ctx.section.append(boite);
  ctx.surCorrige = async () => {
    const criteres = [...(ctx.criteres?.querySelectorAll("li") ?? [])].map((li) => li.textContent?.trim() ?? "");
    let correction: Correction;
    try {
      correction = await correcteurPourRedaction().corriger({
        exercice: ctx.id,
        type: "redaction",
        enonce: ctx.section.querySelector(".exercice-enonce")?.textContent?.trim() ?? "",
        reponse: texte.value,
        corrige: ctx.corrige?.textContent?.trim() ?? "",
        criteres,
      });
    } catch (e) {
      correction = { verdict: "a-evaluer", messages: [(e as Error).message], source: "auto-evaluation" };
    }
    afficherCorrection(ctx, boite, correction);
  };
}

const VERDICTS = { juste: "✓ Juste", partiel: "≈ En partie", faux: "✗ À retravailler" } as const;

/** Texte d'un bloc pour l'IA : chaque formule KaTeX remplacée par sa source LaTeX (sinon elle apparaît en double). */
function texteLisible(noeud: Element | null): string {
  if (!noeud) return "";
  const copie = noeud.cloneNode(true) as Element;
  copie.querySelectorAll(".katex").forEach((k) => k.replaceWith(` $${k.querySelector("annotation")?.textContent ?? k.textContent ?? ""}$ `));
  return (copie.textContent ?? "").replace(/[ \t]+/g, " ").trim();
}

/**
 * Bouton « Faire relire par l'IA » (rien n'est envoyé sans ce clic) : la réponse ou le code est comparé au corrigé.
 * noteParIA : pour une rédaction, le verdict de l'IA note l'exercice ; pour du code, ce sont les tests qui notent.
 */
function boutonRelecture(ctx: Contexte, o: {
  type: "redaction" | "python" | "sql";
  reponse: () => string | Promise<string>;
  resultats?: () => string;
  noteParIA: boolean;
}) {
  if (!synchroConfiguree) return;
  const relire = el("button", { type: "button", class: "bouton-icone-ia", title: "Faire relire par l'IA", "aria-label": "Faire relire par l'IA" }, iconeIA());
  const boite = el("div", { class: "relecture-ia", hidden: true });
  ctx.message.after(boite);
  relire.addEventListener("click", async () => {
    const reponse = (await o.reponse()).trim();
    if (reponse.length < (o.type === "redaction" ? 15 : 5)) {
      return dire(ctx, o.type === "redaction"
        ? "Écris d'abord ta réponse (quelques phrases) : l'IA la comparera au corrigé."
        : "Écris d'abord ton code : l'IA le comparera au corrigé.");
    }
    relire.disabled = true;
    relire.setAttribute("aria-busy", "true");
    dire(ctx, "Relecture par l'IA en cours…");
    try {
      const r = await appelIA<Relecture>("relire", {
        type: o.type,
        enonce: texteLisible(ctx.section.querySelector(".exercice-enonce")),
        corrige: texteLisible(ctx.corrige),
        criteres: [...(ctx.criteres?.querySelectorAll("li") ?? [])].map(texteLisible),
        resultats: o.resultats?.() ?? "",
        reponse,
      });
      dire(ctx, "");
      afficherRelecture(ctx, boite, r, o.noteParIA);
    } catch (e) {
      dire(ctx, (e as Error).message, "moyen");
    }
    relire.disabled = false;
    relire.removeAttribute("aria-busy");
  });
  ctx.actions.append(relire);
}

/** Résultat de la relecture IA ; pour une rédaction, son verdict note l'exercice (modifiable d'un clic). */
function afficherRelecture(ctx: Contexte, boite: HTMLElement, r: Relecture, noteParIA: boolean) {
  const statut: progression.StatutExercice = r.verdict === "juste" ? "reussi" : "a-revoir";
  if (noteParIA) noter(ctx, statut);
  const liste = (titre: string, elements: string[], classe: string) =>
    elements.length ? el("div", { class: classe }, el("strong", {}, titre), el("ul", {}, ...elements.map((t) => el("li", {}, t)))) : null;
  const correctif = el("p", { class: "relecture-statut" }, `Exercice noté « ${statut === "reussi" ? "réussi" : "à revoir"} » d'après l'IA. Pas d'accord ? `);
  const autre = bouton(statut === "reussi" ? "Le marquer à revoir" : "Le marquer réussi", "bouton bouton-petit bouton-discret");
  autre.addEventListener("click", () => {
    noter(ctx, statut === "reussi" ? "a-revoir" : "reussi");
    correctif.textContent = "C'est noté.";
  });
  correctif.append(autre);
  boite.hidden = false;
  boite.replaceChildren(...[
    el("div", { class: "relecture-tete" }, el("span", { class: "relecture-titre" }, iconeIA(16), "Relecture par l'IA"),
      el("span", { class: "relecture-verdict", "data-verdict": r.verdict }, VERDICTS[r.verdict])),
    liste("Ce qui est bien", r.points_forts, "relecture-bien"),
    liste("À revoir", r.a_revoir, "relecture-revoir"),
    r.criteres.length
      ? el("div", { class: "relecture-criteres" }, el("strong", {}, "Critères"),
          el("ul", {}, ...r.criteres.map((c) => el("li", { "data-atteint": String(c.atteint) }, `${c.atteint ? "✓" : "✗"} ${c.texte}`, c.commentaire ? el("small", {}, c.commentaire) : null))))
      : null,
    r.conseil ? el("p", { class: "relecture-conseil" }, el("strong", {}, "Conseil : "), r.conseil) : null,
    r.code_ameliore?.trim()
      ? el("details", { class: "relecture-code" }, el("summary", {}, "Voir une version améliorée de ton code"), el("pre", {}, el("code", {}, r.code_ameliore)))
      : null,
    noteParIA ? correctif : null,
    el("p", { class: "aide" }, "L'IA peut se tromper : compare aussi avec le corrigé."),
  ].filter(Boolean) as HTMLElement[]);
}

function afficherCorrection(ctx: Contexte, boite: HTMLElement, correction: Correction) {
  boite.hidden = false;
  boite.replaceChildren();
  if (correction.source === "ia") {
    boite.append(el("p", {}, "Correction détaillée"));
    correction.messages.forEach((m) => boite.append(el("p", { class: "aide" }, m)));
    correction.criteres?.forEach((c) => boite.append(el("p", {}, `${c.atteint ? "✓" : "✗"} ${c.texte}`)));
    noter(ctx, correction.verdict === "juste" ? "reussi" : "a-revoir");
    return;
  }
  boite.append(el("p", {}, "Avec le corrigé sous les yeux : comment s'est passé cet exercice ?"));
  const choix: [string, string, progression.StatutExercice][] = [
    ["✓ Réussi", "bouton bouton-petit bouton-vert", "reussi"],
    ["≈ En partie", "bouton bouton-petit bouton-second", "a-revoir"],
    ["✗ À retravailler", "bouton bouton-petit bouton-second", "a-revoir"],
  ];
  const ligne = el("div", { class: "boutons" });
  for (const [libelle, classes, statut] of choix) {
    const b = bouton(libelle, classes);
    b.addEventListener("click", () => {
      noter(ctx, statut);
      dire(ctx, statut === "reussi" ? "Noté comme réussi." : "Noté « à revoir » : tu le retrouveras dans ta liste d'exercices à refaire.", statut === "reussi" ? "bien" : "moyen");
      boite.hidden = true;
    });
    ligne.append(b);
  }
  boite.append(ligne);
}
