// Discussion avec l'IA sous une relecture : on pose des questions sur la correction (« pourquoi ? », « un exemple ? »).
// Rien n'est gardé : la discussion disparaît au rechargement, comme la relecture elle-même.
import { appelIA } from "./ia";
import { arreterDictee, micro } from "./dictee";
import { bouton, el } from "./dom";
import { icone } from "./icones";
import { miniMarkdown } from "./ia-ui";

export interface ContexteDiscussion {
  type: "redaction" | "python" | "sql";
  enonce: string;
  corrige: string;
  reponse: string;
  resultats: string;
  /** La relecture, résumée en texte. */
  relecture: string;
}

const MAX_QUESTIONS = 8;
const SUGGESTIONS = {
  redaction: ["Pourquoi ce n'est pas suffisant ?", "Donne-moi un exemple", "Comment l'expliquer à un élève ?"],
  code: ["Pourquoi mon code ne marche pas ?", "Explique-moi la correction ligne par ligne", "Comment l'expliquer à un élève ?"],
};

export function discussionIA(contexte: ContexteDiscussion): HTMLElement {
  const echanges: { question: string; reponse: string }[] = [];
  const fil = el("div", { class: "ia-discussion-fil" });
  const texte = el("textarea", { rows: "1", "aria-label": "Ta question à l'IA", placeholder: "Pose ta question sur cette correction…" });
  const envoyer = el("button", { type: "button", class: "bouton-rond oral-envoyer", "aria-label": "Envoyer la question", title: "Envoyer (Ctrl + Entrée)", disabled: true }, icone("envoyer"));
  const aide = el("p", { class: "oral-aide" });
  const dictee = micro(texte, (m) => (aide.textContent = m));
  const saisie = el("div", { class: "saisie avec-micro ia-discussion-saisie" }, texte, el("div", { class: "saisie-outils" }, dictee, envoyer));
  const suggestions = el("div", { class: "ia-suggestions" },
    ...SUGGESTIONS[contexte.type === "redaction" ? "redaction" : "code"].map((q) => {
      const b = bouton(q, "ia-suggestion");
      b.addEventListener("click", () => { texte.value = q; poser(); });
      return b;
    }));

  const ajuster = () => {
    texte.style.height = "auto";
    texte.style.height = `${Math.min(texte.scrollHeight + 2, 220)}px`;
    envoyer.disabled = texte.value.trim().length < 3;
  };
  texte.addEventListener("input", ajuster);

  function bulle(qui: "ia" | "moi", contenu: Node[]) {
    const ligne = el("div", { class: `oral-ligne oral-${qui}` },
      qui === "ia" ? el("span", { class: "ia-pastille", "aria-hidden": "true" }, icone("etincelles", 14)) : null,
      el("div", { class: "oral-bulles" }, el("div", { class: "oral-bulle" }, ...contenu)));
    fil.append(ligne);
    return ligne;
  }

  async function poser() {
    const question = texte.value.trim();
    if (question.length < 3) return;
    arreterDictee();
    texte.value = "";
    ajuster();
    suggestions.hidden = true;
    bulle("moi", [document.createTextNode(question)]);
    const attente = bulle("ia", [el("span", { class: "oral-frappe" }, el("span"), el("span"), el("span"))]);
    attente.setAttribute("aria-label", "L'IA écrit…");
    envoyer.disabled = true;
    texte.disabled = true;
    try {
      const { reponse } = await appelIA<{ reponse: string }>("discuter", { ...contexte, echanges, question });
      attente.remove();
      bulle("ia", miniMarkdown(reponse));
      echanges.push({ question, reponse });
    } catch (e) {
      attente.remove();
      bulle("ia", [el("p", { class: "ia-discussion-erreur" }, icone("alerte", 15), (e as Error).message)]);
    }
    texte.disabled = false;
    if (echanges.length >= MAX_QUESTIONS) {
      saisie.remove();
      aide.textContent = "Tu as posé beaucoup de questions : relance une relecture pour repartir de zéro.";
    } else {
      texte.focus({ preventScroll: true });
    }
    ajuster();
  }

  envoyer.addEventListener("click", () => void poser());
  texte.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); void poser(); }
  });

  return el("section", { class: "ia-discussion" },
    el("h4", {}, "Une question sur cette correction ?"),
    fil, suggestions, saisie, aide);
}
