// « Explique-le à l'oral » en fin de leçon : l'IA pose une question sur une notion, relance, puis fait un bilan.
// On répond à voix haute (dictée) ou au clavier. Rien n'est envoyé tant qu'on ne clique pas.
import { appelIA, lectureDisponible, lire, type TourOral } from "./ia";
import { boutonDictee } from "./dictee";
import { bouton, el } from "./dom";
import { objectifCourant } from "./objectif";

const bloc = document.querySelector<HTMLElement>("[data-oral]");
if (bloc) monter(bloc);

function monter(bloc: HTMLElement) {
  const cle = bloc.dataset.oral!;
  const fil = bloc.querySelector<HTMLElement>("[data-oral-fil]")!;
  const demarrer = bloc.querySelector<HTMLButtonElement>("[data-oral-demarrer]")!;
  const memoire = `atelier-nsi:oral:${cle}`;
  let echanges: { question: string; reponse: string }[] = [];
  let question = "";

  const questionsRecentes = (): string[] => {
    try { return JSON.parse(localStorage.getItem(memoire) || "[]"); } catch { return []; }
  };
  const retenirQuestion = (q: string) => {
    try { localStorage.setItem(memoire, JSON.stringify([q, ...questionsRecentes()].slice(0, 6))); } catch { /* rien */ }
  };

  const bulleIA = (texte: string, avecLecture = true) => {
    const b = el("div", { class: "oral-bulle oral-ia" }, el("p", {}, texte));
    if (avecLecture && lectureDisponible()) {
      const ecouter = bouton("🔊 Écouter", "bouton bouton-petit bouton-discret");
      ecouter.addEventListener("click", () => lire(texte));
      b.append(ecouter);
    }
    fil.append(b);
    return b;
  };
  const attente = (texte: string) => {
    const a = el("p", { class: "oral-attente", role: "status" }, texte);
    fil.append(a);
    return a;
  };
  const probleme = (message: string, reessayer: () => void) => {
    const p = el("div", { class: "oral-erreur", role: "alert" }, el("p", {}, `⚠ ${message}`));
    const b = bouton("Réessayer", "bouton bouton-petit bouton-second");
    b.addEventListener("click", () => { p.remove(); reessayer(); });
    p.append(b);
    fil.append(p);
  };

  async function tour(terminer = false) {
    const patience = attente(echanges.length ? "L'IA lit ta réponse…" : "L'IA prépare une question…");
    let t: TourOral;
    try {
      t = await appelIA<TourOral>("oral", {
        lecon: cle,
        objectif: objectifCourant(),
        echanges,
        terminer,
        eviter: echanges.length ? [] : questionsRecentes(),
      });
    } catch (e) {
      patience.remove();
      probleme((e as Error).message, () => void tour(terminer));
      if (!echanges.length) demarrer.hidden = false;
      return;
    }
    patience.remove();
    if (t.reaction.trim()) bulleIA(t.reaction, false);
    if (t.termine) return afficherBilan(t);
    question = t.question;
    if (!echanges.length) retenirQuestion(question);
    bulleIA(question);
    zoneReponse();
  }

  function zoneReponse() {
    const texte = el("textarea", { class: "oral-reponse", "aria-label": "Ta réponse", placeholder: "Réponds comme à l'oral : clique sur 🎤 Dicter et parle, ou écris." });
    const message = el("p", { class: "aide" });
    const envoyer = bouton("Envoyer ma réponse", "bouton bouton-petit");
    const finir = bouton("Terminer et voir le bilan", "bouton bouton-petit bouton-discret");
    const micro = boutonDictee(texte, (m) => (message.textContent = m));
    const zone = el("div", { class: "oral-zone" }, texte, el("div", { class: "boutons" }, micro, envoyer, echanges.length ? finir : null), message);
    fil.append(zone);
    texte.focus({ preventScroll: true });
    const valider = (terminer: boolean) => {
      const reponse = texte.value.trim();
      if (!terminer && reponse.length < 10) {
        message.textContent = "Réponds d'abord, même en quelques phrases.";
        return;
      }
      if (micro?.getAttribute("aria-pressed") === "true") micro.click(); // coupe la dictée
      zone.remove();
      if (reponse) {
        fil.append(el("div", { class: "oral-bulle oral-moi" }, el("p", {}, reponse)));
        echanges.push({ question, reponse });
      }
      void tour(terminer);
    };
    envoyer.addEventListener("click", () => valider(false));
    finir.addEventListener("click", () => valider(true));
  }

  function afficherBilan(t: TourOral) {
    const liste = (titre: string, elements: string[], classe: string) =>
      elements.length ? el("div", { class: classe }, el("strong", {}, titre), el("ul", {}, ...elements.map((x) => el("li", {}, x)))) : null;
    const etoiles = t.note > 0 ? `${"★".repeat(t.note)}${"☆".repeat(5 - t.note)}` : "";
    const modele = t.explication_modele.trim();
    const ecouter = modele && lectureDisponible() ? bouton("🔊 Écouter", "bouton bouton-petit bouton-discret") : null;
    ecouter?.addEventListener("click", () => lire(modele));
    const encore = bouton("Une autre question", "bouton bouton-petit");
    encore.addEventListener("click", () => {
      fil.replaceChildren();
      echanges = [];
      void tour();
    });
    fil.append(el("div", { class: "oral-bilan" }, ...[
      el("div", { class: "oral-bilan-tete" }, el("strong", {}, "Bilan"), etoiles ? el("span", { class: "oral-note", "aria-label": `${t.note} sur 5` }, etoiles) : null),
      t.justesse ? el("p", {}, el("strong", {}, "Justesse : "), t.justesse) : null,
      t.clarte ? el("p", {}, el("strong", {}, "Clarté : "), t.clarte) : null,
      liste("Ce qui était bien", t.points_forts, "relecture-bien"),
      liste("À améliorer", t.a_ameliorer, "relecture-revoir"),
      t.conseil ? el("p", { class: "relecture-conseil" }, el("strong", {}, "Conseil : "), t.conseil) : null,
      modele ? el("div", { class: "oral-modele" }, el("strong", {}, "Une explication possible"), el("p", {}, modele), ecouter) : null,
      el("div", { class: "boutons" }, encore),
    ].filter(Boolean) as HTMLElement[]));
  }

  demarrer.addEventListener("click", () => {
    demarrer.hidden = true;
    fil.replaceChildren();
    echanges = [];
    void tour();
  });
}
