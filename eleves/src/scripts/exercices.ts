// Rend les exercices interactifs : QCM, réponses courtes, tableaux et textes à compléter, remise en ordre, association,
// Python (tests automatiques), SQL (comparaison de résultats) et rédaction (corrigé, critères, puis auto-évaluation).
import * as progression from "./progression";
import { executerPython, pythonEstPret, type TestPython } from "./python";
import { comparer, executerSQL, schemaBase } from "./sql";
import { bouton, differer, el, tableHTML, blocConsole } from "./dom";
import { icone } from "./icones";
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
    case "quiz": quiz(ctx); break;
    case "reponses":
    case "completer": saisies(ctx); break;
    case "associer": associer(ctx); break;
    case "ordre": ordre(ctx); break;
    case "python": exercicePython(ctx); break;
    case "sql": exerciceSQL(ctx); break;
    default: redaction(ctx);
  }
  boutonsCommuns(ctx);
  rendreRepliable(section);
}

/* Exercice repliable : l'en-tête et le titre restent visibles, le reste se déplie d'un clic. ------- */
function rendreRepliable(section: HTMLElement) {
  const tete = section.querySelector<HTMLElement>(".exercice-tete");
  const titre = section.querySelector<HTMLElement>(".exercice-titre");
  if (!tete || !titre) return;
  const corps = el("div", { class: "exercice-corps", id: `${section.id || `ex-${section.dataset.exercice}`}-corps` });
  for (let n = titre.nextSibling; n; ) {
    const suivant = n.nextSibling;
    corps.append(n);
    n = suivant;
  }
  section.append(corps);
  const bascule = el("button", { type: "button", class: "exercice-bascule", "aria-expanded": "false", "aria-controls": corps.id },
    el("span", { class: "exercice-bascule-texte" }, ...titre.childNodes), icone("chevron", 18, "exercice-chevron"));
  titre.replaceChildren(bascule);
  const basculer = () => ouvrirExercice(section, !section.hasAttribute("data-ouvert"));
  bascule.addEventListener("click", basculer);
  tete.addEventListener("click", (e) => {
    if (!(e.target as HTMLElement).closest("button, a")) basculer();
  });
  ouvrirExercice(section, location.hash === `#${section.id}`);
}

/** Ouvre (ou referme) un exercice repliable. */
export function ouvrirExercice(section: HTMLElement, ouvert = true) {
  const corps = section.querySelector<HTMLElement>(":scope > .exercice-corps");
  if (!corps) return;
  section.toggleAttribute("data-ouvert", ouvert);
  corps.hidden = !ouvert;
  section.querySelector(".exercice-bascule")?.setAttribute("aria-expanded", String(ouvert));
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

/* Grand QCM : une série de questions, la correction s'affiche à chaque réponse ---------------- */
const SEUIL_QUIZ = 0.8; // part de bonnes réponses pour que le grand QCM compte comme réussi

function quiz(ctx: Contexte) {
  const liste = ctx.section.querySelector<HTMLOListElement>("ol.quiz");
  if (!liste) return;
  const questions = [...liste.children] as HTMLLIElement[];
  const total = questions.length;
  const score = el("div", { class: "quiz-score", "aria-live": "polite" });
  const barre = el("div", { class: "quiz-barre", "aria-hidden": "true" }, el("span"));
  liste.before(el("div", { class: "quiz-tete" }, score, barre));

  questions.forEach((q, i) => {
    q.dataset.numero = String(i + 1);
    q.querySelector(".quiz-enonce")?.prepend(el("span", { class: "quiz-numero" }, `Question ${i + 1} / ${total}`));
    q.querySelectorAll<HTMLLIElement>(".quiz-options > li").forEach((li) => {
      const choix = el("button", { type: "button", class: "quiz-choix" });
      choix.append(...li.childNodes);
      li.append(choix);
      choix.addEventListener("click", () => repondre(q, li));
    });
  });

  const repondues = () => questions.filter((q) => q.dataset.resultat);
  const justes = () => questions.filter((q) => q.dataset.resultat === "juste").length;
  ctx.aEssaye = () => repondues().length > 0;

  function afficherScore() {
    const n = repondues().length;
    score.replaceChildren(n
      ? el("span", {}, el("strong", {}, `${justes()} / ${n}`), ` bonne${justes() > 1 ? "s" : ""} réponse${justes() > 1 ? "s" : ""} · ${total - n} question${total - n > 1 ? "s" : ""} restante${total - n > 1 ? "s" : ""}`)
      : el("span", {}, `${total} questions · clique sur une réponse : la correction s'affiche aussitôt.`));
    (barre.firstElementChild as HTMLElement).style.width = `${(100 * n) / total}%`;
  }

  function repondre(q: HTMLLIElement, choisi: HTMLLIElement) {
    if (q.dataset.resultat) return;
    const juste = choisi.dataset.ok === "1";
    q.dataset.resultat = juste ? "juste" : "faux";
    choisi.dataset.resultat = juste ? "bonne" : "erreur";
    if (!juste) {
      const bonne = q.querySelector<HTMLElement>('.quiz-options > li[data-ok="1"]');
      if (bonne) bonne.dataset.resultat = "solution";
    }
    q.querySelectorAll<HTMLButtonElement>(".quiz-choix").forEach((b) => (b.disabled = true));
    const explication = q.querySelector<HTMLElement>(".quiz-explication");
    if (explication) explication.hidden = false;
    afficherScore();
    if (repondues().length === total) terminer();
  }

  function terminer() {
    const taux = justes() / total;
    const acquis = taux >= SEUIL_QUIZ;
    noter(ctx, acquis ? "reussi" : "a-revoir");
    dire(ctx, acquis
      ? `Score final : ${justes()} / ${total}. C'est acquis !`
      : `Score final : ${justes()} / ${total}. Relis les explications des questions ratées, puis refais-les (il faut ${Math.ceil(SEUIL_QUIZ * total)} bonnes réponses).`,
    acquis ? "bien" : "moyen");
    refaire.hidden = justes() === total;
  }

  function remettre(q: HTMLLIElement) {
    delete q.dataset.resultat;
    q.querySelectorAll<HTMLElement>(".quiz-options > li").forEach((li) => delete li.dataset.resultat);
    q.querySelectorAll<HTMLButtonElement>(".quiz-choix").forEach((b) => (b.disabled = false));
    const explication = q.querySelector<HTMLElement>(".quiz-explication");
    if (explication) explication.hidden = true;
  }

  const refaire = bouton("Refaire mes erreurs", "bouton bouton-petit");
  refaire.hidden = true;
  refaire.addEventListener("click", () => {
    const ratees = questions.filter((q) => q.dataset.resultat === "faux");
    ratees.forEach(remettre);
    ctx.message.textContent = "";
    refaire.hidden = true;
    afficherScore();
    ratees[0]?.scrollIntoView({ behavior: "smooth", block: "center" });
  });
  const recommencer = bouton("Tout recommencer", "bouton bouton-petit bouton-discret");
  recommencer.addEventListener("click", () => {
    questions.forEach(remettre);
    ctx.message.textContent = "";
    refaire.hidden = true;
    afficherScore();
  });
  ctx.actions.append(refaire, recommencer);
  afficherScore();
}

/* Réponses à saisir : réponses courtes, tableaux et textes à compléter, associations ---------- */
const normaliser = (s: string) => s.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .replace(/\s+/g, " ").replace(/(\d) (?=\d)/g, "$1").replace(/,/g, ".").replace(/\.$/, "");

/** Pour du code : les espaces et le type de guillemets ne comptent pas. */
const compact = (s: string) => s.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "").replace(/"/g, "'");

function saisies(ctx: Contexte) {
  const champs = [...ctx.section.querySelectorAll<HTMLInputElement | HTMLSelectElement>("input.trou, select.trou")];
  if (!champs.length) return;
  const acceptees = (c: HTMLInputElement | HTMLSelectElement) => (c.tagName === "SELECT" ? [c.dataset.reponses!] : c.dataset.reponses!.split(";"));
  const estJuste = (c: HTMLInputElement | HTMLSelectElement) => acceptees(c).some((r) => normaliser(r) === normaliser(c.value) || compact(r) === compact(c.value));
  const explications = [...ctx.section.querySelectorAll<HTMLElement>(".quiz-explication")];
  let essaye = false;
  ctx.aEssaye = () => essaye;

  const verifier = bouton("Vérifier");
  const reponses = bouton("Afficher les réponses", "bouton bouton-petit bouton-second");
  const recommencer = bouton("Recommencer", "bouton bouton-petit bouton-discret");
  reponses.hidden = true;
  recommencer.hidden = true;

  function corriger() {
    if (champs.every((c) => !c.value.trim())) return dire(ctx, "Remplis d'abord au moins une réponse.");
    essaye = true;
    let justes = 0;
    for (const c of champs) {
      const juste = estJuste(c);
      c.dataset.resultat = juste ? "bonne" : "erreur";
      if (juste) justes += 1;
    }
    explications.forEach((e) => (e.hidden = false));
    const tout = justes === champs.length;
    noter(ctx, tout ? "reussi" : "a-revoir");
    dire(ctx, tout ? `Tout est juste : ${justes} / ${champs.length}.` : `${justes} / ${champs.length} : corrige ce qui est en rouge, puis vérifie à nouveau.`, tout ? "bien" : "moyen");
    reponses.hidden = tout;
    recommencer.hidden = false;
  }

  verifier.addEventListener("click", corriger);
  reponses.addEventListener("click", () => {
    for (const c of champs) {
      if (estJuste(c)) continue;
      c.value = acceptees(c)[0];
      c.dataset.resultat = "solution";
    }
    reponses.hidden = true;
    ctx.message.textContent = "";
    if (ctx.corrige) ctx.corrige.hidden = false;
  });
  recommencer.addEventListener("click", () => {
    for (const c of champs) { c.value = ""; delete c.dataset.resultat; }
    explications.forEach((e) => (e.hidden = true));
    if (ctx.corrige) ctx.corrige.hidden = true;
    ctx.message.textContent = "";
    reponses.hidden = true;
    recommencer.hidden = true;
  });
  for (const c of champs) {
    c.setAttribute("autocomplete", "off");
    c.setAttribute("autocapitalize", "off");
    c.setAttribute("spellcheck", "false");
    c.addEventListener("input", () => delete c.dataset.resultat);
    c.addEventListener("keydown", (e) => {
      if ((e as KeyboardEvent).key === "Enter") { e.preventDefault(); corriger(); }
    });
  }
  ctx.actions.append(verifier, reponses, recommencer);
}

function melanger<T>(t: T[]) {
  for (let i = t.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [t[i], t[j]] = [t[j], t[i]];
  }
  return t;
}

function associer(ctx: Contexte) {
  const zone = ctx.section.querySelector<HTMLElement>(".associer");
  if (!zone) return;
  const choix: string[] = JSON.parse(zone.dataset.choix || "[]");
  zone.querySelectorAll<HTMLElement>(".associer-ligne").forEach((ligne) => {
    const liste = el("select", { class: "trou", "data-reponses": ligne.dataset.bonne!, "aria-label": `Associer à : ${ligne.textContent?.trim()}` },
      el("option", { value: "" }, "Choisir…"));
    for (const c of melanger([...choix])) liste.append(el("option", { value: c }, c));
    ligne.append(liste);
  });
  saisies(ctx);
}

/* Remettre dans l'ordre ------------------------------------------------- */
function ordre(ctx: Contexte) {
  const liste = ctx.section.querySelector<HTMLOListElement>("ol.ordre");
  if (!liste) return;
  const elements = [...liste.children] as HTMLLIElement[];
  let essaye = false;
  ctx.aEssaye = () => essaye;

  const effacer = () => elements.forEach((li) => delete li.dataset.resultat);
  function deplacer(li: HTMLLIElement, sens: -1 | 1) {
    const voisin = (sens < 0 ? li.previousElementSibling : li.nextElementSibling) as HTMLLIElement | null;
    if (!voisin) return;
    if (sens < 0) voisin.before(li);
    else voisin.after(li);
    effacer();
    ctx.message.textContent = "";
    majBoutons();
  }
  function majBoutons() {
    [...liste!.children].forEach((li, i, tous) => {
      li.querySelector<HTMLButtonElement>("[data-haut]")!.disabled = i === 0;
      li.querySelector<HTMLButtonElement>("[data-bas]")!.disabled = i === tous.length - 1;
    });
  }
  for (const li of elements) {
    const texte = el("div", { class: "ordre-texte" });
    texte.append(...li.childNodes);
    const haut = el("button", { type: "button", class: "ordre-bouton", "data-haut": "1", "aria-label": "Monter" }, icone("chevron", 16, "ordre-haut"));
    const bas = el("button", { type: "button", class: "ordre-bouton", "data-bas": "1", "aria-label": "Descendre" }, icone("chevron", 16, "ordre-bas"));
    haut.addEventListener("click", () => deplacer(li, -1));
    bas.addEventListener("click", () => deplacer(li, 1));
    li.append(texte, el("div", { class: "ordre-boutons" }, haut, bas));
  }
  function brasser() {
    const ordonne = () => [...liste!.children].every((li, i) => (li as HTMLElement).dataset.rang === String(i));
    do melanger(elements).forEach((li) => liste!.append(li));
    while (elements.length > 1 && ordonne());
    effacer();
    majBoutons();
  }
  brasser();

  const verifier = bouton("Vérifier");
  verifier.addEventListener("click", () => {
    essaye = true;
    let justes = 0;
    [...liste.children].forEach((li, i) => {
      const juste = (li as HTMLElement).dataset.rang === String(i);
      (li as HTMLElement).dataset.resultat = juste ? "bonne" : "erreur";
      if (juste) justes += 1;
    });
    const tout = justes === elements.length;
    noter(ctx, tout ? "reussi" : "a-revoir");
    dire(ctx, tout ? "C'est le bon ordre." : `${justes} / ${elements.length} à la bonne place : déplace ce qui est en rouge.`, tout ? "bien" : "moyen");
  });
  const recommencer = bouton("Mélanger à nouveau", "bouton bouton-petit bouton-discret");
  recommencer.addEventListener("click", () => { brasser(); ctx.message.textContent = ""; });
  ctx.actions.append(verifier, recommencer);
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
    // La console s'affiche tout de suite et se remplit pendant l'exécution, même si le programme ne s'arrête pas.
    const console_ = blocConsole(true, "Rien n'a été affiché. Ajoute des print(...) pour suivre ce que fait ton programme.");
    resultat.replaceChildren(
      el("p", { class: "note" }, el("span", { class: "chargement" }, pythonEstPret() ? "Exécution…" : "Chargement de Python… (quelques secondes la première fois)")),
      console_.bloc,
    );
    const r = await executerPython(editeur!.valeur(), tests, { surSortie: (sortie) => console_.maj(sortie) });
    lancer.disabled = false;
    essais += 1;
    const morceaux: Node[] = [];
    if (r.erreur) {
      morceaux.push(enTete("mal", "Ton code s'arrête sur une erreur"));
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
    if (r.sortie.trim()) bilanTests += `\nSortie console :\n${r.sortie.slice(0, 2000)}`;
    console_.maj(r.sortie, r.erreur, true);
    morceaux.push(console_.bloc);
    resultat.replaceChildren(...morceaux);
  }

  lancer.addEventListener("click", executer);
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
}

/* Rédaction ------------------------------------------------------------ */
function redaction(ctx: Contexte) {
  const zone = ctx.section.querySelector<HTMLElement>(".zone-reponse");
  if (!zone) return;
  const texte = el("textarea", {
    placeholder: "Écris ta réponse ici, avec des phrases complètes.",
    "aria-label": "Ta réponse",
    spellcheck: "true",
  });
  texte.value = progression.exercice(ctx.id)?.brouillon ?? "";
  const ajuster = () => { texte.style.height = "auto"; texte.style.height = `${Math.max(texte.scrollHeight + 4, 120)}px`; };
  const sauver = differer((t: string) => progression.garderBrouillon(ctx.id, t));
  texte.addEventListener("input", () => { ajuster(); sauver(texte.value); });
  zone.append(el("div", { class: "saisie" }, texte), el("p", { class: "aide" }, "Ta réponse reste sur cet appareil."));
  requestAnimationFrame(ajuster);
  ctx.aEssaye = () => texte.value.trim().length >= 15;

  const boite = el("div", { class: "auto-evaluation", hidden: true });
  ctx.section.querySelector(".exercice-corps")?.append(boite) ?? ctx.section.append(boite);
  ctx.surCorrige = () => autoEvaluer(ctx, boite);
}

function autoEvaluer(ctx: Contexte, boite: HTMLElement) {
  boite.hidden = false;
  boite.replaceChildren(el("p", {}, "Compare ta réponse au corrigé. Comment ça s'est passé ?"));
  const choix: [string, string, progression.StatutExercice][] = [
    ["J'ai réussi", "bouton bouton-petit bouton-vert", "reussi"],
    ["À revoir", "bouton bouton-petit bouton-second", "a-revoir"],
  ];
  const ligne = el("div", { class: "boutons" });
  for (const [libelle, classes, statut] of choix) {
    const b = bouton(libelle, classes);
    b.addEventListener("click", () => {
      noter(ctx, statut);
      dire(ctx, statut === "reussi" ? "Bien joué." : "Noté à revoir : reviens-y dans quelques jours.", statut === "reussi" ? "bien" : "moyen");
      boite.hidden = true;
    });
    ligne.append(b);
  }
  boite.append(ligne);
}
