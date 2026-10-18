// POST /api/relire : relecture d'une réponse rédigée par Claude Haiku, comparée au corrigé et aux critères.
// Fonction serveur (Vercel) ; réservée au compte autorisé (voir src/lib/ia.ts).
import type { APIRoute } from "astro";
import { z } from "zod/v4";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { champ, claude, erreur, erreurAPI, LIMITES, MODELE, reponseIncomplete, verifierAcces } from "../../lib/ia";

export const prerender = false;

const Relecture = z.object({
  verdict: z.enum(["juste", "partiel", "faux"]),
  criteres: z.array(z.object({ texte: z.string(), atteint: z.boolean(), commentaire: z.string() })),
  points_forts: z.array(z.string()),
  a_revoir: z.array(z.string()),
  conseil: z.string(),
});

// Consignes fixes (identiques à chaque appel).
const CONSIGNES = `Tu relis la réponse d'un futur professeur de NSI et de SNT (il prépare un entretien de professeur contractuel et le CAPES de NSI) à un exercice de rédaction : explication, justification, trace d'exécution, analyse, mise en situation.

Tu reçois l'énoncé, le corrigé de référence, les critères de réussite (parfois aucun) et sa réponse. Évalue sa réponse :
- par rapport au corrigé et aux critères : un raisonnement juste mais différent du corrigé est accepté ; une affirmation vague ou non justifiée ne valide pas un critère ;
- en repérant les erreurs de fond, les oublis importants et le vocabulaire imprécis ; cite brièvement ce qu'il a écrit quand tu pointes un problème ;
- sans recopier le corrigé : dis ce qui manque, pas toute la solution.

Verdict : « juste » si l'essentiel est là sans erreur ; « partiel » s'il manque un élément important ou s'il y a une imprécision notable ; « faux » en cas d'erreur de fond, de hors-sujet ou de réponse vide.
Critères : un élément par critère fourni, dans l'ordre, avec un commentaire d'une phrase ; liste vide s'il n'y a pas de critère.
Points forts et points à revoir : 0 à 4 éléments chacun, une phrase courte par élément.
Conseil : une ou deux phrases sur ce qu'il doit travailler en priorité.
Écris en français, en le tutoyant, avec des phrases courtes et concrètes. Sois exigeant et bienveillant.`;

export const POST: APIRoute = async ({ request }) => {
  const refus = await verifierAcces(request);
  if (refus) return refus;

  let d: Record<string, unknown>;
  try {
    d = await request.json();
  } catch {
    return erreur(400, "Demande illisible.");
  }
  const enonce = champ(d.enonce, LIMITES.long);
  const corrige = champ(d.corrige, LIMITES.long);
  const reponse = champ(d.reponse, LIMITES.long);
  const criteres = Array.isArray(d.criteres) ? d.criteres.slice(0, 12).map((c) => champ(c, 500)).filter(Boolean) : [];
  if (reponse.trim().length < 15) return erreur(400, "Écris d'abord une réponse un peu plus développée.");

  try {
    const r = await claude().messages.parse({
      model: MODELE,
      max_tokens: 8000,
      output_config: { effort: "low", format: zodOutputFormat(Relecture) },
      system: CONSIGNES,
      messages: [{
        role: "user",
        content:
          `ÉNONCÉ :\n${enonce}\n\nCORRIGÉ DE RÉFÉRENCE :\n${corrige || "(pas de corrigé)"}\n\n` +
          `CRITÈRES DE RÉUSSITE :\n${criteres.length ? criteres.map((c) => `- ${c}`).join("\n") : "(aucun)"}\n\n` +
          `RÉPONSE DU CANDIDAT :\n${reponse}`,
      }],
    });
    const incomplete = reponseIncomplete(r.stop_reason);
    if (incomplete) return incomplete;
    if (!r.parsed_output) return erreur(502, "La réponse de l'IA était illisible. Réessaie.");
    return Response.json(r.parsed_output);
  } catch (e) {
    return erreurAPI(e);
  }
};
