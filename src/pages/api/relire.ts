// POST /api/relire : relecture par Claude Haiku d'une réponse rédigée, ou d'un code Python ou SQL, comparés au corrigé.
// Fonction serveur (Vercel) ; réservée au compte autorisé (voir src/lib/ia.ts).
import type { APIRoute } from "astro";
import { z } from "zod/v4";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { champ, claude, erreur, erreurAPI, LIMITES, MODELE, reponseIncomplete, verifierAcces } from "../../lib/ia";

export const prerender = false;

// Le verdict est un texte libre (« juste », « partiel », « faux » demandés) : l'API ne garantit pas la liste exacte,
// et une formulation voisine (« Partiel », « en partie ») ne doit pas faire échouer toute la relecture.
const Relecture = z.object({
  verdict: z.string().describe("juste, partiel ou faux"),
  criteres: z.array(z.object({ texte: z.string(), atteint: z.boolean(), commentaire: z.string() })),
  points_forts: z.array(z.string()),
  a_revoir: z.array(z.string()),
  conseil: z.string(),
});

const RelectureCode = Relecture.extend({ code_ameliore: z.string() });

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

const CONSIGNES_CODE = `Tu relis le code d'un futur professeur de NSI (il prépare un entretien de professeur contractuel et le CAPES de NSI) pour un exercice de programmation en Python ou en SQL.

Tu reçois l'énoncé, le corrigé de référence, le résultat des tests automatiques (s'ils ont été lancés) et son code. Les tests disent déjà si le code donne le bon résultat. Ton rôle :
- s'il y a une erreur ou un test qui échoue : expliquer pourquoi, avec des mots simples, en citant l'instruction ou la ligne en cause ;
- dans tous les cas : dire comment l'améliorer : lisibilité (noms, structure), simplicité, cas limites oubliés, efficacité, et ce qu'on attend d'un code montré à des élèves de lycée ;
- comparer avec le corrigé : si son approche est différente mais juste, le dire ; si le corrigé est plus simple ou plus efficace, expliquer l'idée sans tout recopier.

Verdict : « juste » si le code est correct et propre ; « partiel » s'il est correct mais nettement améliorable, ou presque correct ; « faux » s'il ne marche pas (erreur, tests qui échouent, hors sujet).
Critères : liste vide.
Points forts et points à revoir : 0 à 4 éléments chacun, une phrase courte par élément.
Conseil : une ou deux phrases sur ce qu'il doit travailler en priorité.
code_ameliore : SA solution corrigée et améliorée, complète, en gardant son approche quand elle est valable ; dans le même langage ; pas de Markdown ni de balises de code ; chaîne vide si son code est déjà très bien.
Écris en français, en le tutoyant, avec des phrases courtes et concrètes. Sois exigeant et bienveillant.`;

/** Ramène la formulation du modèle à l'un des trois verdicts affichés. */
function normaliserVerdict(texte: string): "juste" | "partiel" | "faux" {
  const t = texte.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  if (/faux|fausse|retravailler|incorrect|echec/.test(t)) return "faux";
  if (/partiel|partie|presque|incomplet/.test(t)) return "partiel";
  if (/juste|correct|reussi|bon/.test(t)) return "juste";
  return "partiel";
}

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
  const langage = d.type === "python" ? "Python" : d.type === "sql" ? "SQL" : null;
  const resultats = champ(d.resultats, LIMITES.court);
  if (reponse.trim().length < (langage ? 5 : 15)) {
    return erreur(400, langage ? "Écris d'abord ton code." : "Écris d'abord une réponse un peu plus développée.");
  }

  try {
    const r = langage
      ? await claude().messages.parse({
          model: MODELE,
          max_tokens: 10000,
          output_config: { effort: "low", format: zodOutputFormat(RelectureCode) },
          system: CONSIGNES_CODE,
          messages: [{
            role: "user",
            content:
              `LANGAGE : ${langage}\n\nÉNONCÉ :\n${enonce}\n\nCORRIGÉ DE RÉFÉRENCE :\n${corrige || "(pas de corrigé)"}\n\n` +
              `RÉSULTAT DES TESTS AUTOMATIQUES :\n${resultats || "(tests pas encore lancés)"}\n\nCODE DU CANDIDAT :\n${reponse}`,
          }],
        })
      : await claude().messages.parse({
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
    return Response.json({ ...r.parsed_output, verdict: normaliserVerdict(r.parsed_output.verdict) });
  } catch (e) {
    return erreurAPI(e);
  }
};
