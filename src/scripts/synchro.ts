// Synchronisation de la progression entre appareils (facultative : voir src/data/synchro.ts).
// Connexion par lien reçu par e-mail ; à chaque passage, on lit la progression du compte, on la fusionne avec celle
// de cet appareil (fusion.ts), on garde le résultat ici et on le renvoie au compte s'il a changé.
// La bibliothèque Supabase n'est chargée que si l'on est connecté sur cet appareil ou qu'on se connecte.
import type { Session, SupabaseClient } from "@supabase/supabase-js";
import * as progression from "./progression";
import { fusionner, identiques } from "./fusion";
import { SUPABASE, synchroConfiguree } from "../data/synchro";

export type Statut = "non-configuree" | "deconnecte" | "en-cours" | "a-jour" | "erreur";

export interface EtatSynchro {
  statut: Statut;
  /** Adresse du compte connecté sur cet appareil (absente si déconnecté). */
  email?: string;
  /** Date de la dernière synchronisation réussie. */
  derniere?: string;
  erreur?: string;
}

const TABLE = "progression";
const DELAI_ENVOI = 2500; // ms après le dernier changement
const RELIRE_APRES = 60_000; // en revenant sur l'onglet, relire le compte si la dernière lecture date de plus d'1 min

let client: SupabaseClient | null = null;
let session: Session | null = null;
let etat: EtatSynchro = { statut: synchroConfiguree ? "deconnecte" : "non-configuree" };
let passage: Promise<void> | null = null;
let encore = false;
let aEnvoyer = false;
let applique = false;
let minuteur: number | undefined;

export const etatSynchro = () => etat;
export const connecte = () => Boolean(session);

/** Jeton de connexion à joindre aux appels à l'IA (rafraîchi si besoin), ou null si l'on n'est pas connecté. */
export async function jetonAcces(): Promise<string | null> {
  if (!synchroConfiguree || (!session && !sessionMemorisee())) return null;
  const c = await obtenirClient();
  const { data } = await c.auth.getSession();
  return data.session?.access_token ?? null;
}

function publier(maj: Partial<EtatSynchro>) {
  etat = { ...etat, ...maj };
  document.dispatchEvent(new CustomEvent<EtatSynchro>("atelier:synchro", { detail: etat }));
}

/** Message compréhensible pour les erreurs les plus probables. */
function expliquer(erreur: unknown): string {
  const e = erreur as { message?: string; code?: string; status?: number };
  const message = e?.message ?? String(erreur);
  if (e?.status === 429 || /rate limit/i.test(message))
    return "Trop d'e-mails demandés : Supabase n'en envoie que quelques-uns par heure. Réessaie un peu plus tard.";
  if (/only request this after|once every/i.test(message)) return "Attends une minute avant de redemander un lien.";
  if (e?.code === "PGRST205" || e?.code === "42P01" || /could not find the table|does not exist/i.test(message))
    return "La table « progression » n'existe pas encore : exécute supabase/schema.sql dans Supabase (SQL Editor).";
  if (/failed to fetch|networkerror|load failed/i.test(message)) return "Pas de connexion au serveur (hors ligne ?). Ta progression reste enregistrée sur cet appareil.";
  return message;
}

/** Une session Supabase est-elle mémorisée dans ce navigateur ? (sans charger la bibliothèque) */
function sessionMemorisee() {
  try {
    return Object.keys(localStorage).some((cle) => cle.startsWith("sb-") && cle.endsWith("-auth-token"));
  } catch {
    return false;
  }
}

async function obtenirClient() {
  if (client) return client;
  const { createClient } = await import("@supabase/supabase-js");
  // Flux « implicite » : le lien de connexion marche dans n'importe quel navigateur où on l'ouvre
  // (avec PKCE, il faudrait l'ouvrir dans le navigateur même qui l'a demandé).
  client = createClient(SUPABASE.url, SUPABASE.cle, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: "implicit" },
  });
  client.auth.onAuthStateChange((evenement, nouvelle) => {
    session = nouvelle;
    if (!nouvelle) {
      // Seulement après une vraie déconnexion (sinon on garderait un message d'erreur ou « lien envoyé »).
      if (etat.email) publier({ statut: "deconnecte", email: undefined, derniere: undefined, erreur: undefined });
      return;
    }
    publier({ email: nouvelle.user.email ?? "ton compte" });
    // Pas d'appel à Supabase directement dans ce rappel (la bibliothèque le déconseille) : on diffère.
    if (evenement === "INITIAL_SESSION" || evenement === "SIGNED_IN") window.setTimeout(() => void synchroniser(), 0);
  });
  return client;
}

async function unPassage() {
  if (!client || !session) return;
  aEnvoyer = false;
  publier({ statut: "en-cours" });
  try {
    const id = session.user.id;
    const lu = await client.from(TABLE).select("etat").eq("user_id", id).maybeSingle();
    if (lu.error) throw lu.error;
    const distant = (lu.data as { etat?: unknown } | null)?.etat ?? null;
    // Fusion et enregistrement d'un seul tenant : un changement fait pendant la lecture est bien pris en compte.
    const fusion = fusionner(progression.lire(), distant);
    if (!identiques(fusion, progression.lire())) {
      applique = true;
      try {
        progression.remplacer(fusion);
      } finally {
        applique = false;
      }
    }
    if (distant === null || !identiques(fusion, distant)) {
      const ecrit = await client.from(TABLE).upsert({ user_id: id, etat: fusion, maj: new Date().toISOString() }, { onConflict: "user_id" });
      if (ecrit.error) throw ecrit.error;
    }
    publier({ statut: "a-jour", derniere: new Date().toISOString(), erreur: undefined });
  } catch (erreur) {
    publier({ statut: "erreur", erreur: expliquer(erreur) });
  }
}

/** Lance une synchronisation (une seule à la fois ; un changement arrivé entre-temps en relance une). */
export function synchroniser(): Promise<void> {
  if (passage) {
    encore = true;
    return passage;
  }
  passage = (async () => {
    do {
      encore = false;
      await unPassage();
    } while (encore && session);
  })().finally(() => {
    passage = null;
  });
  return passage;
}

/** Envoie le lien de connexion ; il ramène sur la page Réglages de ce site. */
export async function recevoirLien(email: string) {
  try {
    const c = await obtenirClient();
    const { error } = await c.auth.signInWithOtp({ email, options: { emailRedirectTo: `${location.origin}/reglages/` } });
    if (error) throw error;
  } catch (erreur) {
    throw new Error(expliquer(erreur));
  }
}

/** Déconnecte CET appareil seulement ; sa progression reste enregistrée ici. */
export async function seDeconnecter() {
  window.clearTimeout(minuteur);
  if (aEnvoyer) await synchroniser();
  await client?.auth.signOut({ scope: "local" });
}

/* Démarrage ------------------------------------------------------------ */
if (synchroConfiguree) {
  // Retour d'un lien de connexion expiré ou déjà utilisé : Supabase l'indique dans l'adresse.
  const retour = new URLSearchParams(location.hash.slice(1));
  if (retour.get("error_description")) {
    publier({
      statut: "erreur",
      erreur: retour.get("error_code") === "otp_expired"
        ? "Ce lien de connexion a expiré ou a déjà servi. Demande un nouveau lien."
        : `Lien de connexion refusé (${retour.get("error_description")}). Demande un nouveau lien.`,
    });
    history.replaceState(null, "", location.pathname + location.search);
  }
  if (sessionMemorisee() || retour.has("access_token")) {
    obtenirClient().catch((erreur) => publier({ statut: "erreur", erreur: expliquer(erreur) }));
  }

  progression.surChangement(() => {
    if (applique || !session) return;
    aEnvoyer = true;
    window.clearTimeout(minuteur);
    minuteur = window.setTimeout(() => void synchroniser(), DELAI_ENVOI);
  });

  document.addEventListener("visibilitychange", () => {
    if (!session) return;
    if (document.visibilityState === "hidden") {
      // On quitte l'onglet : envoyer tout de suite ce qui attendait.
      if (aEnvoyer) {
        window.clearTimeout(minuteur);
        void synchroniser();
      }
    } else if (!etat.derniere || Date.now() - Date.parse(etat.derniere) > RELIRE_APRES) {
      // On revient : récupérer ce qui a pu être fait sur un autre appareil.
      void synchroniser();
    }
  });
}
