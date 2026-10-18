// Dictée au micro : la reconnaissance vocale intégrée au navigateur (Chrome, Edge) écrit ce que tu dis dans une zone
// de texte. Gratuite, sans IA ni clé. Le micro n'apparaît que si le navigateur sait le faire.
import { el } from "./dom";
import { icone } from "./icones";

type Reconnaissance = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  onresult: ((e: { resultIndex: number; results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
};

const Constructeur = (window as unknown as { SpeechRecognition?: new () => Reconnaissance; webkitSpeechRecognition?: new () => Reconnaissance })
  .SpeechRecognition ?? (window as unknown as { webkitSpeechRecognition?: new () => Reconnaissance }).webkitSpeechRecognition;

export const dicteeDisponible = () => Boolean(Constructeur);

let enCours: (() => void) | null = null; // une seule dictée à la fois sur la page

/**
 * Micro d'une zone de texte : un bouton rond, et l'indication « Écoute… » pendant la dictée.
 * null si le navigateur ne sait pas faire. surErreur reçoit les messages d'erreur (micro bloqué…).
 */
export function micro(zone: HTMLTextAreaElement, surErreur?: (texte: string) => void): HTMLElement | null {
  if (!Constructeur) return null;
  const b = el("button", { type: "button", class: "bouton-rond micro-bouton", "aria-pressed": "false", "aria-label": "Dicter ta réponse", title: "Dicter ta réponse" }, icone("micro"));
  const etat = el("span", { class: "micro-etat", "aria-live": "polite" }, el("span", { class: "micro-point" }), "Écoute…");
  const bloc = el("div", { class: "micro" }, etat, b);
  let reco: Reconnaissance | null = null;
  let actif = false;

  const afficher = () => {
    bloc.toggleAttribute("data-actif", actif);
    b.setAttribute("aria-pressed", String(actif));
    b.setAttribute("aria-label", actif ? "Arrêter la dictée" : "Dicter ta réponse");
    b.title = actif ? "Arrêter la dictée" : "Dicter ta réponse";
    b.replaceChildren(icone(actif ? "stop" : "micro"));
  };

  const arreter = () => {
    actif = false;
    reco?.stop();
    if (enCours === arreter) enCours = null;
    afficher();
  };

  const ecouter = () => {
    // Une phrase à la fois (continuous = false), relancée tant qu'on n'arrête pas : évite les doublons
    // que produit le mode continu sur Chrome Android.
    reco = new Constructeur!();
    reco.lang = "fr-FR";
    reco.continuous = false;
    reco.interimResults = false;
    reco.onresult = (e) => {
      let ajout = "";
      for (let i = e.resultIndex; i < e.results.length; i++) if (e.results[i].isFinal) ajout += e.results[i][0].transcript;
      ajout = ajout.trim();
      if (!ajout) return;
      const avant = zone.value;
      zone.value = avant + (avant && !/\s$/.test(avant) ? " " : "") + ajout;
      zone.dispatchEvent(new Event("input", { bubbles: true })); // brouillon enregistré, hauteur ajustée
    };
    reco.onerror = (e) => {
      if (e.error === "no-speech" || e.error === "aborted") return;
      arreter();
      surErreur?.(e.error === "not-allowed" || e.error === "service-not-allowed"
        ? "Le micro est bloqué : autorise-le pour ce site dans les réglages du navigateur."
        : "La dictée s'est arrêtée (pas de réseau ?). Réessaie.");
    };
    reco.onend = () => { if (actif) ecouter(); };
    try { reco.start(); } catch { arreter(); }
  };

  b.addEventListener("click", () => {
    if (actif) return arreter();
    enCours?.();
    enCours = arreter;
    actif = true;
    afficher();
    ecouter();
  });
  return bloc;
}

/** Arrête la dictée en cours sur la page (avant d'envoyer une réponse, par exemple). */
export const arreterDictee = () => enCours?.();
