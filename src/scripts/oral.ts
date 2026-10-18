// « Explique-le à l'oral » en fin de leçon : l'IA pose une question sur une notion, relance, puis fait un bilan.
// Présenté comme une conversation. On répond à voix haute (micro) ou au clavier ; rien n'est envoyé sans clic.
import { appelIA, lectureDisponible, lire, type TourOral } from "./ia";
import { arreterDictee, micro } from "./dictee";
import { bouton, el } from "./dom";
import { icone } from "./icones";
import { conseilIA, enTeteIA, listeIA, pointsARevoir, pointsForts } from "./ia-ui";
import { objectifCourant } from "./objectif";

const bloc = document.querySelector<HTMLElement>("[data-oral]");
if (bloc) monter(bloc);

function monter(bloc: HTMLElement) {
  const cle = bloc.dataset.oral!;
  const fil = bloc.querySelector<HTMLElement>("[data-oral-fil]")!;
  const accueil = bloc.querySelector<HTMLElement>("[data-oral-accueil]")!;
  const memoire = `atelier-nsi:oral:${cle}`;
  let echanges: { question: string; reponse: string }[] = [];
  let question = "";

  const questionsRecentes = (): string[] => {
    try { return JSON.parse(localStorage.getItem(memoire) || "[]"); } catch { return []; }
  };
  const retenirQuestion = (q: string) => {
    try { localStorage.setItem(memoire, JSON.stringify([q, ...questionsRecentes()].slice(0, 6))); } catch { /* rien */ }
  };
  const defiler = (n: Element) => n.scrollIntoView({ block: "nearest", behavior: "smooth" });

  /** Messages de l'IA, groupés derrière une seule pastille ; la dernière bulle peut être lue à voix haute. */
  function messageIA(textes: string[], aLire?: string) {
    const bulles = el("div", { class: "oral-bulles" }, ...textes.filter((t) => t.trim()).map((t) => el("p", { class: "oral-bulle" }, t)));
    if (aLire && lectureDisponible()) {
      const ecouter = el("button", { type: "button", class: "bouton-lien oral-ecouter", "aria-label": "Écouter la question" }, icone("son", 16), "Écouter");
      ecouter.addEventListener("click", () => lire(aLire));
      bulles.append(ecouter);
    }
    const ligne = el("div", { class: "oral-ligne oral-ia" }, el("span", { class: "ia-pastille", "aria-hidden": "true" }, icone("etincelles", 14)), bulles);
    fil.append(ligne);
    defiler(ligne);
  }

  function frappe() {
    const ligne = el("div", { class: "oral-ligne oral-ia", role: "status", "aria-label": "L'IA écrit…" },
      el("span", { class: "ia-pastille", "aria-hidden": "true" }, icone("etincelles", 14)),
      el("div", { class: "oral-bulles" }, el("p", { class: "oral-bulle oral-frappe" }, el("span", {}), el("span", {}), el("span", {}))));
    fil.append(ligne);
    defiler(ligne);
    return ligne;
  }

  function probleme(message: string, reessayer: () => void) {
    const relancer = bouton("Réessayer", "bouton-lien");
    const p = el("div", { class: "oral-erreur", role: "alert" }, icone("alerte", 18), el("p", {}, message), relancer);
    relancer.addEventListener("click", () => { p.remove(); reessayer(); });
    fil.append(p);
    defiler(p);
  }

  async function tour(terminer = false) {
    const attente = frappe();
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
      attente.remove();
      probleme((e as Error).message, () => void tour(terminer));
      if (!echanges.length) accueil.hidden = false;
      return;
    }
    attente.remove();
    if (t.termine) {
      if (t.reaction.trim()) messageIA([t.reaction]);
      return afficherBilan(t);
    }
    question = t.question;
    if (!echanges.length) retenirQuestion(question);
    messageIA([t.reaction, question], question);
    zoneReponse();
  }

  function zoneReponse() {
    const texte = el("textarea", { rows: "2", "aria-label": "Ta réponse", placeholder: "Réponds comme à l'oral : parle avec le micro, ou écris." });
    const envoyer = el("button", { type: "button", class: "bouton-rond oral-envoyer", "aria-label": "Envoyer ma réponse", title: "Envoyer (Ctrl + Entrée)", disabled: true }, icone("envoyer"));
    const aide = el("p", { class: "oral-aide" }, "Ctrl + Entrée pour envoyer");
    const dictee = micro(texte, (m) => (aide.textContent = m));
    const finir = echanges.length ? bouton("Terminer et voir le bilan", "bouton-lien") : null;
    const ajuster = () => {
      texte.style.height = "auto";
      texte.style.height = `${Math.min(texte.scrollHeight + 2, 320)}px`;
      envoyer.disabled = texte.value.trim().length < 10;
    };
    texte.addEventListener("input", ajuster);
    const zone = el("div", { class: "oral-composer" },
      el("div", { class: "saisie avec-micro" }, texte, el("div", { class: "saisie-outils" }, dictee, envoyer)),
      el("div", { class: "oral-sous-composer" }, aide, finir));
    fil.append(zone);
    defiler(zone);
    texte.focus({ preventScroll: true });

    const valider = (terminer: boolean) => {
      const reponse = texte.value.trim();
      if (!terminer && reponse.length < 10) return;
      arreterDictee();
      zone.remove();
      if (reponse) {
        fil.append(el("div", { class: "oral-ligne oral-moi" }, el("div", { class: "oral-bulles" }, el("p", { class: "oral-bulle" }, reponse))));
        echanges.push({ question, reponse });
      }
      void tour(terminer);
    };
    envoyer.addEventListener("click", () => valider(false));
    texte.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); valider(false); }
    });
    finir?.addEventListener("click", () => valider(true));
  }

  function afficherBilan(t: TourOral) {
    const note = Math.max(0, Math.min(5, t.note));
    const etoiles = note > 0
      ? el("span", { class: "oral-note", "aria-label": `Note : ${note} sur 5` },
          ...Array.from({ length: 5 }, (_, i) => icone("etoile", 16, i < note ? "pleine" : "")), el("span", {}, `${note}/5`))
      : null;
    const modele = t.explication_modele.trim();
    let ecouter: HTMLButtonElement | null = null;
    if (modele && lectureDisponible()) {
      ecouter = el("button", { type: "button", class: "bouton-lien", "aria-label": "Écouter l'explication" }, icone("son", 16), "Écouter");
      ecouter.addEventListener("click", () => lire(modele));
    }
    const encore = el("button", { type: "button", class: "bouton bouton-petit bouton-second" }, icone("recommencer", 16), "Une autre question");
    encore.addEventListener("click", () => {
      fil.replaceChildren();
      echanges = [];
      void tour();
    });
    const carte = el("div", { class: "ia-carte oral-bilan" }, ...[
      enTeteIA("Bilan de la séance", etoiles),
      t.justesse || t.clarte
        ? el("dl", { class: "oral-criteres" },
            t.justesse ? el("div", {}, el("dt", {}, "Justesse"), el("dd", {}, t.justesse)) : null,
            t.clarte ? el("div", {}, el("dt", {}, "Clarté"), el("dd", {}, t.clarte)) : null)
        : null,
      listeIA("Ce qui était bien", pointsForts(t.points_forts)),
      listeIA("À améliorer", pointsARevoir(t.a_ameliorer)),
      conseilIA(t.conseil),
      modele ? el("section", { class: "oral-modele" }, el("div", { class: "oral-modele-tete" }, el("h4", {}, "Une explication possible"), ecouter), el("p", {}, modele)) : null,
      el("div", { class: "ia-pied" }, el("span", {}, "L'IA peut se tromper : garde un œil critique."), encore),
    ].filter(Boolean) as HTMLElement[]);
    fil.append(carte);
    defiler(carte);
  }

  bloc.querySelector<HTMLButtonElement>("[data-oral-demarrer]")!.addEventListener("click", () => {
    accueil.hidden = true;
    fil.replaceChildren();
    echanges = [];
    void tour();
  });
}
