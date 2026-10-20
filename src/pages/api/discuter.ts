// POST /api/discuter : on pose des questions à l'IA sur la relecture d'un exercice (« pourquoi ? », « montre-moi »…).
// Le serveur ne garde rien : le navigateur renvoie l'exercice, la relecture et l'échange à chaque question.
import type { APIRoute } from "astro";
import { champ, claude, erreur, erreurAPI, LIMITES, MODELE, reponseIncomplete, verifierAcces } from "../../lib/ia";

export const prerender = false;

const MAX_QUESTIONS = 8;

const CONSIGNES = `Tu viens de relire la réponse d'un futur professeur de NSI et de SNT (il prépare un entretien de professeur contractuel et le CAPES de NSI) à un exercice. Il te pose maintenant des questions sur ta correction : pourquoi c'est faux, comment faire autrement, un exemple, une notion à réexpliquer.

Réponds à SA question, précisément, comme un bon professeur :
- en français, en le tutoyant, avec des phrases courtes ; 150 mots au plus, sauf s'il demande explicitement du code ou une explication longue ;
- appuie-toi sur sa réponse et sur l'exercice ; donne un exemple concret ou un petit morceau de code quand ça aide (bloc \`\`\`python … \`\`\` ou \`\`\`sql … \`\`\`) ;
- s'il te demande la solution complète, donne-la ; sinon, guide-le plutôt que de tout faire à sa place ;
- si ta relecture contenait une erreur, reconnais-le simplement ;
- si la question n'a rien à voir avec l'exercice ou l'informatique, ramène-le gentiment à l'exercice.
Mise en forme : paragraphes courts, listes « - » si besoin, \`code\` pour les noms ; pas de titres.`;

export const POST: APIRoute = async ({ request }) => {
  const refus = await verifierAcces(request);
  if (refus) return refus;

  let d: Record<string, unknown>;
  try {
    d = await request.json();
  } catch {
    return erreur(400, "Demande illisible.");
  }
  const question = champ(d.question, LIMITES.court).trim();
  if (question.length < 3) return erreur(400, "Écris ta question.");
  const echanges = (Array.isArray(d.echanges) ? d.echanges : []).slice(-MAX_QUESTIONS).map((e) => ({
    question: champ((e as Record<string, unknown>)?.question, LIMITES.court),
    reponse: champ((e as Record<string, unknown>)?.reponse, LIMITES.court),
  }));
  if (echanges.length >= MAX_QUESTIONS) return erreur(429, "Tu as posé beaucoup de questions sur cette correction : relance une relecture pour repartir de zéro.");
  const langage = d.type === "python" ? "Python" : d.type === "sql" ? "SQL" : "rédaction";

  const contexte =
    `TYPE D'EXERCICE : ${langage}\n\nÉNONCÉ :\n${champ(d.enonce, LIMITES.long)}\n\n` +
    `CORRIGÉ DE RÉFÉRENCE :\n${champ(d.corrige, LIMITES.long) || "(pas de corrigé)"}\n\n` +
    (d.resultats ? `RÉSULTAT DES TESTS AUTOMATIQUES :\n${champ(d.resultats, LIMITES.court)}\n\n` : "") +
    `SA RÉPONSE :\n${champ(d.reponse, LIMITES.long)}\n\nTA RELECTURE :\n${champ(d.relecture, LIMITES.long)}`;
  const historique = echanges.map((e, i) => `QUESTION ${i + 1} : ${e.question}\nTA RÉPONSE ${i + 1} : ${e.reponse}`).join("\n\n");

  try {
    const r = await claude().messages.create({
      model: MODELE,
      max_tokens: 6000,
      output_config: { effort: "low" },
      system: CONSIGNES,
      messages: [{
        role: "user",
        content: `${contexte}\n\n${historique ? `ÉCHANGE PRÉCÉDENT :\n${historique}\n\n` : ""}SA NOUVELLE QUESTION : ${question}`,
      }],
    });
    const incomplete = reponseIncomplete(r.stop_reason);
    if (incomplete) return incomplete;
    const texte = r.content.filter((b) => b.type === "text").map((b) => (b as { text: string }).text).join("\n").trim();
    if (!texte) return erreur(502, "L'IA n'a rien répondu. Réessaie.");
    return Response.json({ reponse: texte });
  } catch (e) {
    return erreurAPI(e);
  }
};
