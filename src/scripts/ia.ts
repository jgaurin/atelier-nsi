// Appels du navigateur aux fonctions IA du serveur (/api/relire, /api/oral, /api/exercice, /api/discuter).
// La clé de l'API Claude reste sur le serveur : ici, on envoie seulement le jeton de connexion du compte (Supabase),
// que le serveur vérifie avant d'appeler Claude.
import { jetonAcces } from "./synchro";
import { el } from "./dom";
import { icone } from "./icones";

export interface Relecture {
  verdict: "juste" | "partiel" | "faux";
  criteres: { texte: string; atteint: boolean; commentaire: string }[];
  points_forts: string[];
  a_revoir: string[];
  conseil: string;
  /** Relecture de code seulement : sa solution corrigée et améliorée. */
  code_ameliore?: string;
}

export interface TourOral {
  reaction: string;
  question: string;
  termine: boolean;
  note: number;
  justesse: string;
  clarte: string;
  points_forts: string[];
  a_ameliorer: string[];
  conseil: string;
  explication_modele: string;
}

export async function appelIA<T>(chemin: "relire" | "oral" | "exercice" | "discuter", corps: unknown): Promise<T> {
  const jeton = await jetonAcces().catch(() => null);
  if (!jeton) throw new Error("Connecte-toi d'abord dans Réglages (« Synchroniser entre appareils ») : l'IA est réservée à ton compte.");
  const minuterie = new AbortController();
  const delai = window.setTimeout(() => minuterie.abort(), 75_000);
  let reponse: Response;
  try {
    reponse = await fetch(`/api/${chemin}`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${jeton}` },
      body: JSON.stringify(corps),
      signal: minuterie.signal,
    });
  } catch {
    throw new Error(minuterie.signal.aborted ? "L'IA met trop de temps à répondre. Réessaie." : "Pas de connexion à Internet : l'IA a besoin du réseau.");
  } finally {
    window.clearTimeout(delai);
  }
  const donnees = await reponse.json().catch(() => null);
  if (!reponse.ok) {
    if (reponse.status === 404 && !donnees) throw new Error("L'IA n'est disponible que sur le site en ligne (atelier-nsi.vercel.app).");
    throw new Error(donnees?.erreur ?? `L'IA n'a pas pu répondre (erreur ${reponse.status}).`);
  }
  return donnees as T;
}

/* Lecture à voix haute (synthèse vocale du navigateur, gratuite) ------------------------------------ */
export const lectureDisponible = () => "speechSynthesis" in window;

/** Fin de la lecture en cours (pour remettre son bouton sur « Écouter »). */
let finEnCours: (() => void) | null = null;

/** Arrête toute lecture en cours. */
export function arreterLecture() {
  if (!lectureDisponible()) return;
  speechSynthesis.cancel();
  finEnCours?.();
  finEnCours = null;
}

export function lire(texte: string, surFin?: () => void) {
  if (!lectureDisponible()) return;
  arreterLecture();
  const enonce = new SpeechSynthesisUtterance(texte);
  enonce.lang = "fr-FR";
  const voix = speechSynthesis.getVoices().find((v) => v.lang.startsWith("fr"));
  if (voix) enonce.voice = voix;
  let fini = false;
  const finir = () => {
    if (fini) return;
    fini = true;
    if (finEnCours === finir) finEnCours = null;
    surFin?.();
  };
  enonce.onend = finir;
  enonce.onerror = finir;
  finEnCours = finir;
  speechSynthesis.speak(enonce);
}

/** Bouton « Écouter » qui devient « Arrêter » pendant la lecture ; null si le navigateur ne sait pas lire. */
export function boutonLecture(texte: string, libelle = "Écouter"): HTMLButtonElement | null {
  if (!lectureDisponible()) return null;
  const b = el("button", { type: "button", class: "bouton-lien bouton-lecture" });
  let actif = false;
  const afficher = () => {
    b.replaceChildren(icone(actif ? "stop" : "son", 15), actif ? "Arrêter" : libelle);
    b.setAttribute("aria-pressed", String(actif));
    b.setAttribute("aria-label", actif ? "Arrêter la lecture" : libelle);
  };
  afficher();
  b.addEventListener("click", () => {
    if (actif) return arreterLecture();
    actif = true;
    afficher();
    lire(texte, () => { actif = false; afficher(); });
  });
  return b;
}

// On coupe la voix en quittant la page.
if (lectureDisponible()) window.addEventListener("pagehide", arreterLecture);
