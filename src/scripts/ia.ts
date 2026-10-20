// Appels du navigateur aux fonctions IA du serveur (/api/relire, /api/oral, /api/exercice, /api/discuter).
// La clé de l'API Claude reste sur le serveur : ici, on envoie seulement le jeton de connexion du compte (Supabase),
// que le serveur vérifie avant d'appeler Claude.
import { jetonAcces } from "./synchro";

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
