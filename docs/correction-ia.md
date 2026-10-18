# Correction des rédactions par Claude Haiku — plan d'implémentation

> **Statut : prévu, pas encore implémenté.** Aujourd'hui, les QCM, les exercices Python et SQL sont corrigés automatiquement
> dans le navigateur, et les rédactions (preuves, traces, analyses, mises en situation) sont **auto-évaluées** : l'apprenant
> compare sa réponse au corrigé et aux critères. Ce document décrit comment brancher une correction détaillée par Claude Haiku
> sans rien changer au reste du site.

## 1. Ce qui est déjà prêt

- `src/scripts/correction.ts` définit l'interface commune `Correcteur` (demande → `Correction`) et un `correcteurIA` qui appelle
  `POST /api/corriger`. Il n'est **activé** que si la variable d'environnement publique `PUBLIC_CORRECTION_IA` vaut `1`.
- Chaque exercice de rédaction transmet déjà ce dont le correcteur a besoin : l'**énoncé**, la **réponse** de l'apprenant, le
  **corrigé** et la liste des **critères** (`:::criteres` dans le Markdown).
- La réponse attendue a la forme :

```ts
interface Correction {
  verdict: "juste" | "partiel" | "faux" | "a-evaluer";
  messages: string[];                                  // retours affichés dans l'ordre
  criteres?: { texte: string; atteint: boolean }[];    // un verdict par critère
  source: "auto-evaluation" | "ia";
}
```

## 2. Architecture

```text
navigateur ──POST /api/corriger {énoncé, réponse, corrigé, critères}──▶ fonction serveur Vercel
                                                                       │  (clé ANTHROPIC_API_KEY, côté serveur uniquement)
                                                                       ▼
                                                              API Claude (claude-haiku-5-5)
                                                                       │  sortie JSON structurée
navigateur ◀─────────────── Correction (verdict, messages, critères) ───┘
```

**Règle absolue : la clé d'API ne va jamais dans le navigateur.** Elle est stockée dans les variables d'environnement de Vercel
(`ANTHROPIC_API_KEY`, sans le préfixe `PUBLIC_`), lue uniquement par la fonction serveur. Tout ce qui commence par `PUBLIC_` est
visible par n'importe quel visiteur.

## 3. Étapes

1. **Adaptateur Vercel** : `npx astro add vercel` (ajoute `@astrojs/vercel` et l'option `adapter` dans `astro.config.mjs`).
   Le site reste **statique** : seules les routes qui exportent `export const prerender = false` deviennent des fonctions serveur.
2. **Dépendances** : `npm install --save-exact @anthropic-ai/sdk zod` (versions exactes, comme le reste du projet).
3. **Route** `src/pages/api/corriger.ts` (esquisse en section 4).
4. **Variables d'environnement sur Vercel** : `ANTHROPIC_API_KEY` (secrète), `PUBLIC_CORRECTION_IA=1`, et éventuellement
   `CORRECTION_MOT_DE_PASSE` (section 6).
5. **Interface** : rien à changer dans les leçons ; `correcteurPourRedaction()` choisit automatiquement le correcteur IA quand il
   est disponible, et retombe sur l'auto-évaluation en cas d'erreur (à ajouter : un `try/catch` dans `exercices.ts` qui affiche
   l'auto-évaluation si l'appel échoue).

## 4. Esquisse de la route (à valider au moment de l'implémentation)

Modèle : **`claude-haiku-5-5`** (le Haiku actuel : rapide et très peu coûteux). Sortie : **JSON structuré** validé par un schéma
Zod (`client.messages.parse` + `zodOutputFormat`), ce qui garantit une réponse exploitable sans analyse fragile du texte.

```ts
// src/pages/api/corriger.ts — esquisse
import type { APIRoute } from "astro";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";

export const prerender = false;                 // fonction serveur, pas une page statique

const client = new Anthropic();                 // lit ANTHROPIC_API_KEY côté serveur

const Verdict = z.object({
  verdict: z.enum(["juste", "partiel", "faux"]),
  criteres: z.array(z.object({ texte: z.string(), atteint: z.boolean(), commentaire: z.string() })),
  points_forts: z.array(z.string()),
  a_revoir: z.array(z.string()),
  conseil: z.string(),
});

// Consignes fixes : placées en premier et marquées pour le cache (préfixe identique à chaque appel).
const CONSIGNES = `Tu es correcteur pour un candidat au CAPES de NSI (concours de professeur d'informatique).
Tu reçois l'énoncé d'un exercice, le corrigé de référence, les critères de réussite et la réponse du candidat.
Évalue la réponse critère par critère, avec bienveillance et exigence : un raisonnement juste mais différent du corrigé est
accepté ; une réponse vague ou une affirmation non justifiée ne valide pas un critère. Réponds en français, en tutoyant,
avec des phrases courtes et concrètes. …(barème détaillé, exemples de verdicts)…`;

export const POST: APIRoute = async ({ request }) => {
  const d = await request.json();
  // Garde-fous : taille maximale des champs, mot de passe éventuel (section 6), champs obligatoires.
  if (typeof d.reponse !== "string" || d.reponse.length > 8000) return new Response("Réponse invalide", { status: 400 });

  try {
    const r = await client.messages.parse({
      model: "claude-haiku-5-5",
      max_tokens: 8000,
      output_config: { effort: "medium", format: zodOutputFormat(Verdict) },
      system: [{ type: "text", text: CONSIGNES, cache_control: { type: "ephemeral" } }],
      messages: [{
        role: "user",
        content: `ÉNONCÉ :\n${d.enonce}\n\nCORRIGÉ :\n${d.corrige}\n\nCRITÈRES :\n- ${d.criteres.join("\n- ")}\n\nRÉPONSE DU CANDIDAT :\n${d.reponse}`,
      }],
    });

    if (r.stop_reason === "refusal" || r.stop_reason === "max_tokens" || !r.parsed_output) {
      return Response.json({ erreur: "correction-indisponible" }, { status: 502 });
    }
    const v = r.parsed_output;
    return Response.json({
      verdict: v.verdict,
      messages: [...v.points_forts.map((p) => `✓ ${p}`), ...v.a_revoir.map((p) => `À revoir : ${p}`), v.conseil],
      criteres: v.criteres.map((c) => ({ texte: c.texte, atteint: c.atteint })),
      source: "ia",
    });
  } catch (e) {
    if (e instanceof Anthropic.RateLimitError) return new Response("Trop de demandes, réessaie dans un instant", { status: 429 });
    if (e instanceof Anthropic.APIError) return new Response("Service de correction indisponible", { status: 502 });
    throw e;
  }
};
```

Points d'attention :

- **Réflexion du modèle** : sur Claude Haiku 5.5, la réflexion adaptative est active par défaut et l'effort par défaut est `medium` ;
  on règle la profondeur uniquement avec `output_config.effort` (`low` pour des corrections rapides, `medium` par défaut). Ne pas
  envoyer de `budget_tokens` (refusé par ce modèle). Les jetons de réflexion sont facturés comme des jetons de sortie : `max_tokens`
  doit laisser de la marge (8 000 ici) — une réponse coupée (`stop_reason: "max_tokens"`) est traitée comme une erreur.
- **Refus** : si le modèle refuse (`stop_reason: "refusal"`), il n'y a pas de bascule automatique vers un autre modèle pour Haiku ;
  on renvoie une erreur et le site affiche l'auto-évaluation.
- **Cache** : les consignes fixes sont envoyées en premier avec `cache_control` ; elles ne sont mises en cache que si elles dépassent
  le minimum du modèle (de l'ordre de 512 jetons pour Haiku 5.5 — à vérifier dans la documentation au moment de l'implémentation).
  On le vérifie avec `usage.cache_read_input_tokens` sur deux appels successifs. Rien de variable (date, identifiant) ne doit se
  glisser dans ces consignes.
- **Pas de pré-remplissage** de la réponse de l'assistant (refusé par les modèles actuels) : c'est la sortie structurée qui impose
  le format JSON.
- **Vérifier les noms exacts** (`messages.parse`, `zodOutputFormat`, champs de `usage`) dans la documentation du SDK TypeScript au
  moment d'écrire le code : cette esquisse suit la documentation d'octobre 2026.

## 5. Coût

Avec Claude Haiku 5.5 (0,10 $ par million de jetons en entrée, 0,50 $ en sortie, tarifs d'octobre 2026), une correction typique
(≈ 2 000 jetons d'entrée, ≈ 1 000 jetons de sortie, réflexion comprise) coûte environ **0,07 centime**. Mille corrections : moins
d'un dollar. Le coût réel se mesure avec le champ `usage` de chaque réponse.

## 6. Sécurité et abus

La route est publique : sans protection, n'importe qui pourrait l'appeler et consommer le crédit d'API.

- **Protection simple** (usage personnel) : un mot de passe stocké dans `CORRECTION_MOT_DE_PASSE` (variable serveur) et saisi une fois
  dans les Réglages du site, envoyé dans un en-tête ; la route refuse toute requête sans le bon mot de passe.
- **Limites** : taille maximale de chaque champ (refus au-delà), nombre de requêtes par minute (Vercel ou compteur simple), et un
  **plafond de dépense** mensuel configuré dans la console Anthropic.
- **Données** : seules l'énoncé, la réponse et le corrigé sont envoyés ; aucune donnée personnelle. La progression reste dans le
  navigateur.

## 7. Évaluer la qualité avant de l'ouvrir

Constituer un petit jeu de 20 à 30 rédactions déjà corrigées à la main (bonnes, partielles, fausses, hors sujet), faire tourner la
route dessus, et comparer les verdicts critère par critère. Ajuster les consignes et l'effort tant que l'accord n'est pas
satisfaisant. Ce n'est qu'ensuite qu'on active `PUBLIC_CORRECTION_IA`.
