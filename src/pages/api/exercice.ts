// POST /api/exercice : Claude Haiku crée un exercice Python sur la leçon, au niveau choisi
// (énoncé, code de départ, tests, indices, corrigé). Le navigateur exécute ensuite le corrigé contre les tests
// avant de montrer l'exercice ; s'il échoue, il redemande en joignant le problème (champ « probleme »).
import type { APIRoute } from "astro";
import { z } from "zod/v4";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { contexteLecon } from "../../lib/lecon-ia";
import { champ, claude, erreur, erreurAPI, LIMITES, MODELE, reponseIncomplete, verifierAcces } from "../../lib/ia";

export const prerender = false;

const Exercice = z.object({
  titre: z.string(),
  enonce: z.string(),
  code_depart: z.string(),
  tests: z.array(z.object({ intitule: z.string(), code: z.string() })),
  indices: z.array(z.string()),
  corrige: z.string(),
  explication: z.string(),
});

const NIVEAUX: Record<number, string> = {
  1: "Découverte : application directe d'UNE notion de la leçon, une fonction courte (5 à 10 lignes), environ 5 minutes.",
  2: "Entraînement : combiner deux notions de la leçon, penser aux cas simples et à un cas limite, environ 10 minutes.",
  3: "Approfondissement : un problème moins guidé, des cas limites, une attention à l'efficacité, environ 20 minutes.",
  4: "Type concours : un problème du niveau d'un écrit du CAPES de NSI (plusieurs fonctions possibles, raisonnement), environ 30 minutes.",
};

const CONSIGNES = `Tu crées des exercices de programmation Python pour un futur professeur de NSI et de SNT (lycée), qui prépare un entretien de professeur contractuel et le CAPES de NSI. L'exercice porte sur la leçon fournie et s'exécute dans le navigateur (Pyodide) avec des tests automatiques.

Règles de l'exercice :
- Python 3, bibliothèque standard uniquement ; pas de input(), pas de fichiers, pas de réseau, pas de hasard ; rien d'affiché n'est vérifié.
- L'élève écrit une ou plusieurs FONCTIONS dont le nom et les paramètres sont imposés par l'énoncé et par le code de départ.
- titre : court (2 à 6 mots).
- enonce : en français, en tutoyant ; ce qu'il faut écrire, et au moins un exemple d'appel avec le résultat attendu. Mets le code entre accents graves (\`f(3)\` renvoie \`6\`). Pas de titre ni de liste à puces imbriquée ; des paragraphes courts.
- code_depart : la ou les signatures avec une docstring courte et le corps \`...\` ; il ne doit PAS réussir les tests.
- tests : 3 à 6 tests indépendants, du cas simple aux cas limites. Chaque test est du code Python qui se termine par UNE ligne « assert … » en début de ligne (des lignes de préparation avant sont possibles) ; préfère « assert f(x) == valeur » pour que l'élève voie obtenu / attendu. intitule : quelques mots (« cas simple », « liste vide »…).
- corrige : une solution complète, claire et correcte, avec les mêmes signatures, qui réussit TOUS les tests ; style attendu d'un professeur (noms explicites, pas d'astuce obscure).
- explication : 2 à 4 phrases sur l'idée de la solution et le piège principal.
- indices : 1 ou 2 indices progressifs qui aident sans donner la solution.
Vérifie mentalement chaque test sur ton corrigé avant de répondre : une valeur attendue fausse rend l'exercice inutilisable.`;

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
  const niveau = [1, 2, 3, 4].includes(Number(d.niveau)) ? Number(d.niveau) : 1;
  const public_ = d.objectif === "capes"
    ? "Il prépare le CAPES : niveau de rigueur d'un professeur."
    : "Il prépare un poste de professeur contractuel : niveau de ce qu'on fait faire en classe de lycée, sauf au niveau « Type concours ».";
  const eviter = (Array.isArray(d.eviter) ? d.eviter : []).slice(0, 20).map((t) => champ(t, 120)).filter(Boolean);
  const probleme = champ(d.probleme, LIMITES.court);

  const demande =
    `NIVEAU DEMANDÉ : ${NIVEAUX[niveau]}\n${public_}\n` +
    (eviter.length ? `\nExercices déjà créés sur cette leçon (fais-en un DIFFÉRENT, sur une autre idée) :\n${eviter.map((t) => `- ${t}`).join("\n")}\n` : "") +
    (probleme ? `\nTa proposition précédente était fausse : ${probleme}\nCrée un nouvel exercice, et vérifie chaque test sur ton corrigé.\n` : "") +
    "\nCrée l'exercice.";

  try {
    const r = await claude().messages.parse({
      model: MODELE,
      max_tokens: 16000,
      output_config: { effort: "medium", format: zodOutputFormat(Exercice) },
      system: [
        { type: "text", text: CONSIGNES },
        { type: "text", text: lecon.texte, cache_control: { type: "ephemeral" } },
      ],
      messages: [{ role: "user", content: demande }],
    });
    const incomplete = reponseIncomplete(r.stop_reason);
    if (incomplete) return incomplete;
    const e = r.parsed_output;
    if (!e || !e.tests.length || !e.corrige.trim()) return erreur(502, "L'IA a rendu un exercice incomplet. Réessaie.");
    return Response.json({ ...e, niveau, tests: e.tests.slice(0, 8) });
  } catch (e) {
    return erreurAPI(e);
  }
};
