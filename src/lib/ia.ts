// Côté serveur uniquement (fonctions Vercel /api/…) : accès à Claude, réservé au compte de l'apprenant.
// La clé ANTHROPIC_API_KEY est lue dans les variables d'environnement du serveur (process.env), jamais dans le navigateur.
// IA_EMAILS_AUTORISES : adresse(s) des comptes Supabase autorisés, séparées par des virgules. Sans elle, tout est refusé.
import Anthropic from "@anthropic-ai/sdk";
import { SUPABASE } from "../data/synchro";

export const MODELE = "claude-haiku-5-5";

/** Tailles maximales acceptées (caractères), pour éviter les abus et les factures surprises. */
export const LIMITES = { court: 4_000, long: 12_000, echanges: 4 } as const;

let client: Anthropic | null = null;
export const claude = () => (client ??= new Anthropic()); // lit ANTHROPIC_API_KEY

export const erreur = (status: number, message: string) => Response.json({ erreur: message }, { status });

/** null si la demande vient bien d'un compte autorisé ; sinon la réponse d'erreur à renvoyer. */
export async function verifierAcces(request: Request): Promise<Response | null> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return erreur(503, "L'IA n'est pas encore configurée : la clé ANTHROPIC_API_KEY manque dans les réglages de Vercel.");
  }
  const autorises = (process.env.IA_EMAILS_AUTORISES ?? "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
  if (!autorises.length) {
    return erreur(503, "L'IA n'est pas encore configurée : la variable IA_EMAILS_AUTORISES manque dans les réglages de Vercel.");
  }
  const jeton = request.headers.get("authorization")?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!jeton) return erreur(401, "Connecte-toi (Réglages → Synchroniser entre appareils) pour utiliser l'IA.");
  let email = "";
  try {
    const r = await fetch(`${SUPABASE.url}/auth/v1/user`, { headers: { apikey: SUPABASE.cle, authorization: `Bearer ${jeton}` } });
    if (!r.ok) return erreur(401, "Ta connexion a expiré : reconnecte-toi dans Réglages.");
    email = String(((await r.json()) as { email?: string }).email ?? "").toLowerCase();
  } catch {
    return erreur(502, "Impossible de vérifier ta connexion pour le moment. Réessaie dans un instant.");
  }
  if (!autorises.includes(email)) return erreur(403, "Ce compte n'a pas accès à l'IA.");
  return null;
}

/** Texte d'un champ envoyé par le navigateur, coupé à la taille maximale. */
export const champ = (x: unknown, max: number) => (typeof x === "string" ? x.slice(0, max) : "");

/** Traduit une erreur de l'API en message pour l'apprenant. */
export function erreurAPI(e: unknown): Response {
  if (e instanceof Anthropic.RateLimitError) return erreur(429, "Trop de demandes d'un coup : réessaie dans une minute.");
  if (e instanceof Anthropic.AuthenticationError) return erreur(503, "La clé de l'API Claude est refusée (expirée ou supprimée ?) : remplace-la dans Vercel.");
  if (e instanceof Anthropic.BadRequestError && /credit|balance/i.test(e.message)) {
    return erreur(402, "Plus de crédit sur ton compte Claude (console Anthropic → Billing).");
  }
  if (e instanceof Anthropic.APIError) {
    console.error("API Claude", e.status, e.message);
    return erreur(502, "Le service Claude ne répond pas correctement pour le moment. Réessaie plus tard.");
  }
  // Réponse du modèle qui ne respecte pas le format attendu (JSON abîmé ou champ inattendu).
  const nom = (e as { name?: string })?.name ?? "";
  if (nom === "ZodError" || nom === "SyntaxError" || /parse|json/i.test(nom)) {
    console.error("Réponse de l'IA au mauvais format", e);
    return erreur(502, "La réponse de l'IA n'avait pas le format attendu. Réessaie (ça arrive de temps en temps).");
  }
  console.error(e);
  return erreur(500, `Erreur inattendue du serveur (${nom || "inconnue"}). Réessaie ; si ça recommence, signale-le.`);
}

/** Réponse du modèle inutilisable (coupée ou refusée) : message clair plutôt qu'un résultat tronqué. */
export function reponseIncomplete(stop: string | null | undefined): Response | null {
  if (stop === "refusal") return erreur(422, "L'IA n'a pas voulu traiter cette demande. Reformule ta réponse et réessaie.");
  if (stop === "max_tokens") return erreur(502, "La réponse de l'IA a été coupée. Réessaie (ou raccourcis ta réponse).");
  return null;
}
