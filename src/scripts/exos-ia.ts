// « Exercices supplémentaires » d'une leçon : l'IA crée un exercice Python au niveau choisi.
// Avant de le montrer, on exécute son corrigé contre ses tests (Pyodide) : un exercice dont le corrigé échoue est
// redemandé. Les exercices gardés vivent dans la progression (synchronisée) et s'affichent comme les autres :
// éditeur, tests, indices, corrigé, relecture par l'IA.
import * as progression from "./progression";
import type { ExerciceGenere } from "./progression";
import { appelIA } from "./ia";
import { executerPython, pythonEstPret, type TestPython } from "./python";
import { initialiserExercices } from "./exercices";
import { objectifCourant } from "./objectif";
import { el } from "./dom";
import { icone } from "./icones";

interface ExerciceIA {
  titre: string;
  enonce: string;
  code_depart: string;
  tests: { intitule: string; code: string }[];
  indices: string[];
  corrige: string;
  explication: string;
  niveau: number;
}

const NOMS_NIVEAUX: Record<number, string> = { 1: "Découverte", 2: "Entraînement", 3: "Approfondissement", 4: "Type concours" };
const CLE_NIVEAU = "atelier-nsi:niveau-ia";
const ESSAIS = 3;

const bloc = document.querySelector<HTMLElement>("[data-exos-ia]");
if (bloc) monter(bloc);

/** Texte de l'IA → nœuds sûrs (jamais d'innerHTML) : paragraphes, listes « - », `code`, **gras**, blocs ```. */
function miniMarkdown(texte: string): Node[] {
  const noeuds: Node[] = [];
  const enLigne = (ligne: string) => {
    const morceaux: Node[] = [];
    for (const m of ligne.split(/(`[^`]+`|\*\*[^*]+\*\*)/g)) {
      if (!m) continue;
      if (m.startsWith("`") && m.endsWith("`") && m.length > 1) morceaux.push(el("code", {}, m.slice(1, -1)));
      else if (m.startsWith("**") && m.endsWith("**") && m.length > 4) morceaux.push(el("strong", {}, m.slice(2, -2)));
      else morceaux.push(document.createTextNode(m));
    }
    return morceaux;
  };
  texte.replace(/\r/g, "").split(/```/).forEach((partie, i) => {
    if (i % 2 === 1) {
      noeuds.push(el("pre", { class: "code-genere" }, el("code", {}, partie.replace(/^[a-z]*\n/i, "").replace(/\n$/, ""))));
      return;
    }
    for (const paragraphe of partie.split(/\n\s*\n/)) {
      const lignes = paragraphe.split("\n").filter((l) => l.trim());
      if (!lignes.length) continue;
      if (lignes.every((l) => /^\s*[-*] /.test(l))) {
        noeuds.push(el("ul", {}, ...lignes.map((l) => el("li", {}, ...enLigne(l.replace(/^\s*[-*] /, ""))))));
      } else {
        const p = el("p");
        lignes.forEach((l, j) => { if (j) p.append(el("br")); p.append(...enLigne(l.trim())); });
        noeuds.push(p);
      }
    }
  });
  return noeuds;
}

function monter(bloc: HTMLElement) {
  const lecon = bloc.dataset.exosIa!;
  const generer = bloc.querySelector<HTMLButtonElement>("[data-exos-ia-generer]")!;
  const etat = bloc.querySelector<HTMLElement>("[data-exos-ia-etat]")!;
  const liste = bloc.querySelector<HTMLDetailsElement>("[data-exos-ia-liste]")!;
  const nombre = bloc.querySelector<HTMLElement>("[data-exos-ia-nombre]")!;
  const conteneur = bloc.querySelector<HTMLElement>("[data-exos-ia-exercices]")!;
  const choix = [...bloc.querySelectorAll<HTMLButtonElement>("[data-niveau]")];

  let niveau = 2;
  try { niveau = Number(localStorage.getItem(CLE_NIVEAU)) || 2; } catch { /* rien */ }
  const choisir = (n: number) => {
    niveau = n;
    choix.forEach((b) => b.setAttribute("aria-checked", String(Number(b.dataset.niveau) === n)));
    try { localStorage.setItem(CLE_NIVEAU, String(n)); } catch { /* rien */ }
  };
  choix.forEach((b) => b.addEventListener("click", () => choisir(Number(b.dataset.niveau))));
  choisir(niveau);

  const afficherEtat = (texte: string, ton: "info" | "erreur" = "info", attente = false) => {
    etat.dataset.ton = ton;
    etat.replaceChildren(...(texte ? [attente ? icone("chargement", 16, "tourne") : ton === "erreur" ? icone("alerte", 16) : null, texte].filter(Boolean) as (Node | string)[] : []));
  };

  /* Affichage d'un exercice gardé, avec exactement la structure des exercices des leçons -------- */
  function section(id: string, e: ExerciceGenere, numero: number) {
    const c = e.contenu!;
    const supprimer = el("button", { type: "button", class: "bouton-rond exercice-supprimer", "aria-label": "Supprimer cet exercice", title: "Supprimer cet exercice" }, icone("croix", 16));
    const s = el("section", {
      class: "exercice exercice-python exercice-genere", id: `ex-${id}`, "data-exercice": id, "data-type": "python",
      "data-niveau": String(e.niveau), "data-genere": "",
    },
      el("header", { class: "exercice-tete" },
        el("span", { class: "exercice-numero" }, `Exercice ${numero}`),
        el("span", { class: `niveau niveau-${e.niveau}` }, `Niveau ${e.niveau} · ${NOMS_NIVEAUX[e.niveau] ?? ""}`),
        el("span", { class: "exercice-type" }, "Python"),
        el("span", { class: "exercice-ia" }, icone("etincelles", 13), "IA"),
        supprimer),
      el("h3", { class: "exercice-titre" }, c.titre),
      el("div", { class: "exercice-enonce" }, ...miniMarkdown(c.enonce)),
      el("div", { class: "editeur editeur-python", "data-depart": c.depart, "data-tests": JSON.stringify(c.tests) }),
      el("div", { class: "exercice-actions" }),
      ...c.indices.map((t, i) => el("div", { class: "exercice-indice", hidden: true, "data-indice": String(i + 1) },
        el("p", { class: "indice-titre" }, c.indices.length > 1 ? `Indice ${i + 1}` : "Indice"), ...miniMarkdown(t))),
      el("div", { class: "exercice-corrige", hidden: true },
        el("p", { class: "corrige-titre" }, "Corrigé"),
        el("pre", { class: "code-genere" }, el("code", {}, c.corrige)),
        ...miniMarkdown(c.explication)),
    );
    supprimer.addEventListener("click", () => {
      if (!confirm("Supprimer cet exercice généré (sur tous tes appareils) ?")) return;
      progression.supprimerExerciceGenere(id);
    });
    return s;
  }

  /** Met la liste à jour depuis la progression (aussi quand la synchronisation apporte ou retire des exercices). */
  function rafraichir() {
    const gardes = progression.exercicesGeneres(lecon);
    const ids = new Set(gardes.map(([id]) => id));
    conteneur.querySelectorAll<HTMLElement>("section.exercice-genere").forEach((s) => { if (!ids.has(s.dataset.exercice!)) s.remove(); });
    const affiches = new Set([...conteneur.querySelectorAll<HTMLElement>("section.exercice-genere")].map((s) => s.dataset.exercice!));
    gardes.forEach(([id, e], i) => {
      if (!affiches.has(id)) conteneur.append(section(id, e, i + 1));
    });
    // Numérotation et compteur.
    conteneur.querySelectorAll<HTMLElement>("section.exercice-genere .exercice-numero").forEach((n, i) => (n.textContent = `Exercice ${i + 1}`));
    nombre.textContent = String(gardes.length);
    liste.hidden = gardes.length === 0;
    initialiserExercices(conteneur);
  }
  rafraichir();
  progression.surChangement(() => {
    const attendus = progression.exercicesGeneres(lecon).length;
    if (attendus !== conteneur.querySelectorAll("section.exercice-genere").length) rafraichir();
  });

  /* Génération ------------------------------------------------------------------------------- */
  async function creer(): Promise<[string, ExerciceGenere]> {
    let probleme = "";
    const eviter = progression.exercicesGeneres(lecon).map(([, e]) => e.contenu!.titre);
    for (let essai = 1; essai <= ESSAIS; essai++) {
      afficherEtat(essai === 1 ? "L'IA prépare un exercice…" : `Le corrigé proposé était faux : l'IA en refait un (essai ${essai}/${ESSAIS})…`, "info", true);
      const e = await appelIA<ExerciceIA>("exercice", { lecon, niveau, objectif: objectifCourant(), eviter, probleme });
      const tests: TestPython[] = e.tests.map((t, i) => ({ label: t.intitule.trim() || `Test ${i + 1}`, code: t.code }));
      afficherEtat(pythonEstPret() ? "Vérification du corrigé…" : "Vérification du corrigé (chargement de Python, quelques secondes)…", "info", true);
      const r = await executerPython(e.corrige, tests);
      const echecs = r.erreur
        ? [`le corrigé s'arrête sur une erreur : ${r.erreur.slice(0, 300)}`]
        : r.tests.filter((t) => !t.ok).map((t) => `le test « ${t.label} » échoue sur le corrigé (${t.detail.replace(/\n/g, " ")})`);
      if (!echecs.length && r.tests.length === tests.length) {
        const depart = await executerPython(e.code_depart, tests);
        if (depart.erreur || !depart.tests.every((t) => t.ok)) {
          const id = `ia-${lecon.replace("/", "-")}-${Date.now().toString(36)}`;
          return [id, {
            lecon, niveau, cree: new Date().toISOString(),
            contenu: { titre: e.titre, enonce: e.enonce, depart: e.code_depart, tests, indices: e.indices.slice(0, 3), corrige: e.corrige, explication: e.explication },
          }];
        }
        echecs.push("le code de départ réussit déjà tous les tests");
      }
      probleme = echecs.slice(0, 3).join(" ; ");
    }
    throw new Error("L'IA n'a pas réussi à créer un exercice fiable cette fois-ci. Réessaie, ou change de niveau.");
  }

  generer.addEventListener("click", async () => {
    generer.disabled = true;
    try {
      const [id, e] = await creer();
      progression.ajouterExerciceGenere(id, e);
      rafraichir();
      liste.open = true;
      afficherEtat("");
      const nouvelle = conteneur.querySelector<HTMLElement>(`[data-exercice="${id}"]`);
      nouvelle?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (e) {
      afficherEtat((e as Error).message, "erreur");
    }
    generer.disabled = false;
  });
}
