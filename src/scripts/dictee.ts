// Dictée au micro : la reconnaissance vocale intégrée au navigateur (Chrome, Edge) écrit ce que tu dis dans une zone
// de texte. Gratuite, sans IA ni clé. Le bouton n'apparaît que si le navigateur sait le faire.
import { el } from "./dom";

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

/** Bouton « Dicter » pour une zone de texte ; null si le navigateur ne sait pas faire. */
export function boutonDictee(zone: HTMLTextAreaElement, surMessage?: (texte: string) => void): HTMLButtonElement | null {
  if (!Constructeur) return null;
  const b = el("button", { type: "button", class: "bouton bouton-petit bouton-second bouton-micro", "aria-pressed": "false" }, "🎤 Dicter");
  let reco: Reconnaissance | null = null;
  let actif = false;

  const arreter = () => {
    actif = false;
    reco?.stop();
    b.setAttribute("aria-pressed", "false");
    b.textContent = "🎤 Dicter";
    if (enCours === arreter) enCours = null;
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
      surMessage?.(e.error === "not-allowed" || e.error === "service-not-allowed"
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
    b.setAttribute("aria-pressed", "true");
    b.textContent = "⏹ Arrêter la dictée";
    surMessage?.("Parle : le texte s'écrit au fur et à mesure. Clique sur « Arrêter » quand tu as fini.");
    ecouter();
  });
  return b;
}
