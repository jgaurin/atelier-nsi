// POST /api/oral : entraînement à l'oral sur une leçon (« Explique-le moi »).
// Claude Haiku pose UNE question sur une notion de la leçon, relance une ou deux fois, puis fait un bilan.
// Le serveur ne garde rien : le navigateur renvoie à chaque tour tout l'échange (questions et réponses).
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { z } from "zod/v4";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { moduleParId } from "../../data/modules";
import { champ, claude, erreur, erreurAPI, LIMITES, MODELE, reponseIncomplete, verifierAcces } from "../../lib/ia";

export const prerender = false;

const Tour = z.object({
  reaction: z.string(),
  question: z.string(),
  termine: z.boolean(),
  note: z.number(),
  justesse: z.string(),
  clarte: z.string(),
  points_forts: z.array(z.string()),
  a_ameliorer: z.array(z.string()),
  conseil: z.string(),
  explication_modele: z.string(),
});

const CONSIGNES = `Tu entraînes à l'oral un futur professeur de NSI et de SNT (lycée). Il prépare un entretien de recrutement de professeur contractuel, et peut-être le CAPES de NSI. Il répond à l'oral : sa réponse a été dictée, donc ignore les fautes de frappe, la ponctuation approximative et les petites hésitations.

Déroulé d'une séance :
1. Premier tour : pose UNE question courte et précise, sur UNE seule notion de la leçon fournie (pas toute la leçon). Elle doit pouvoir se traiter en une à deux minutes à l'oral. Varie les angles : expliquer une notion à un élève, donner un exemple, justifier un choix, corriger une erreur d'élève, comparer deux notions, réagir à une situation de classe.
2. Tours suivants : commence par une « reaction » d'une ou deux phrases sur sa dernière réponse (ce qui est juste, ce qui manque), puis soit tu relances avec une seule question qui creuse (« Pourquoi ? », « Un exemple ? », une objection d'élève, une question de jury), soit tu conclus.
3. Conclusion (termine = true) : quand l'essentiel a été dit, quand il bloque, ou quand on te demande le bilan. La question est alors vide, et tu remplis le bilan.

Bilan (seulement quand termine = true ; sinon chaînes vides, listes vides et note 0) :
- note : de 1 à 5 (5 = explication juste, claire, avec un exemple, adaptée au niveau) ;
- justesse : une ou deux phrases sur l'exactitude du contenu ;
- clarte : une ou deux phrases sur la clarté et l'adaptation au niveau des élèves ;
- points_forts et a_ameliorer : 1 à 3 éléments chacun, une phrase courte par élément ;
- conseil : ce qu'il doit travailler en priorité ;
- explication_modele : une explication modèle de 4 à 6 phrases, comme on la dirait à l'oral.

Écris en français, en le tutoyant, avec des phrases courtes faites pour être lues à voix haute (pas de listes ni de Markdown dans les questions). Sois exigeant sur le fond et bienveillant dans le ton. Reste dans le sujet de la leçon.`;

const ROLE_ENSEIGNER = `Cette leçon porte sur le métier : joue le rôle d'un jury d'entretien de recrutement. Pose des questions de jury (mises en situation, gestion de classe, valeurs, motivation, programmes) et relance comme un jury.`;
const ROLE_NOTION: Record<string, string> = {
  contractuel: `Cette leçon porte sur une notion enseignée au lycée. Demande-lui de l'expliquer comme en classe, au niveau des élèves (seconde SNT, première ou terminale NSI) : rigueur, mots simples, exemple concret. Tu peux jouer un élève qui n'a pas compris.`,
  capes: `Cette leçon porte sur une notion du programme du CAPES de NSI. Interroge-le comme un jury de concours : exactitude, vocabulaire précis, justification, et capacité à l'expliquer à des élèves.`,
};

/** Contexte de la leçon : titre, objectifs, points clés et cours, sans les exercices. */
async function contexteLecon(cle: string) {
  const [module, slug] = cle.split("/");
  const entree = (await getCollection("lecons")).find((e) => {
    const [m, fichier] = e.id.split("/");
    return m === module && fichier.replace(/^\d+-/, "") === slug;
  });
  if (!entree) return null;
  const cours = (entree.body ?? "")
    .replace(/^::::exercice[\s\S]*?^::::\s*$/gm, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .slice(0, 30_000);
  const d = entree.data;
  return {
    partie: moduleParId(module)?.partie ?? "",
    texte:
      `LEÇON : ${d.titre}\n${d.resume}\n\nOBJECTIFS :\n${d.objectifs.map((o) => `- ${o}`).join("\n")}\n\n` +
      (d.cartes.length ? `POINTS CLÉS :\n${d.cartes.map((c) => `- ${c.q} → ${c.r}`).join("\n")}\n\n` : "") +
      `COURS :\n${cours}`,
  };
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
  const lecon = await contexteLecon(champ(d.lecon, 200));
  if (!lecon) return erreur(404, "Leçon inconnue.");
  const objectif = d.objectif === "capes" ? "capes" : "contractuel";
  const echanges = (Array.isArray(d.echanges) ? d.echanges : []).slice(0, LIMITES.echanges).map((e) => ({
    question: champ((e as Record<string, unknown>)?.question, LIMITES.court),
    reponse: champ((e as Record<string, unknown>)?.reponse, LIMITES.court),
  }));
  const eviter = (Array.isArray(d.eviter) ? d.eviter : []).slice(0, 8).map((q) => champ(q, 300)).filter(Boolean);
  // Bilan imposé à la demande, ou après trois réponses.
  const bilan = d.terminer === true || echanges.length >= 3;

  const deroule = echanges.length
    ? echanges.map((e, i) => `QUESTION ${i + 1} : ${e.question}\nSA RÉPONSE ${i + 1} : ${e.reponse || "(pas de réponse)"}`).join("\n\n")
    : "(la séance commence)";
  const consigne = !echanges.length
    ? `Pose la première question (termine = false).${eviter.length ? `\nÉvite ces questions, déjà posées récemment :\n${eviter.map((q) => `- ${q}`).join("\n")}` : ""}`
    : bilan
      ? "Réagis à sa dernière réponse puis fais le bilan de toute la séance (termine = true)."
      : "Réagis à sa dernière réponse, puis relance avec une question ou conclus avec le bilan si l'essentiel a été dit.";

  try {
    const r = await claude().messages.parse({
      model: MODELE,
      max_tokens: 8000,
      output_config: { effort: "low", format: zodOutputFormat(Tour) },
      system: [
        { type: "text", text: CONSIGNES },
        // La leçon ne change pas pendant une séance : mise en cache pour les tours suivants.
        {
          type: "text",
          text: `${lecon.partie === "enseigner" ? ROLE_ENSEIGNER : ROLE_NOTION[objectif]}\n\n${lecon.texte}`,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [{ role: "user", content: `DÉROULÉ DE LA SÉANCE :\n${deroule}\n\nCONSIGNE : ${consigne}` }],
    });
    const incomplete = reponseIncomplete(r.stop_reason);
    if (incomplete) return incomplete;
    const t = r.parsed_output;
    if (!t) return erreur(502, "La réponse de l'IA était illisible. Réessaie.");
    // Garde-fous : le bilan arrive au plus tard au 4e tour, et une question n'est jamais vide si la séance continue.
    const termine = t.termine || bilan || !t.question.trim();
    return Response.json({ ...t, termine, question: termine ? "" : t.question, note: Math.max(0, Math.min(5, Math.round(t.note))) });
  } catch (e) {
    return erreurAPI(e);
  }
};
