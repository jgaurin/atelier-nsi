# L'IA dans l'Atelier (Claude Haiku)

Trois aides, toujours **à la demande** (rien n'est envoyé à l'IA sans un clic) :

| Aide | Où | Comment |
|---|---|---|
| **Faire relire par l'IA** | exercices de rédaction, Python et SQL | `POST /api/relire` : la réponse (ou le code, avec le résultat des tests) est comparée au corrigé ; verdict, points forts, points à revoir, conseil ; critère par critère pour une rédaction, version améliorée de son propre code pour Python et SQL. Pour une rédaction, le verdict note l'exercice (modifiable d'un clic) ; pour du code, ce sont toujours les tests qui notent. |
| **Explique-le à l'oral** / **Entraîne-toi face au jury** | fin de chaque leçon | `POST /api/oral` : une question sur UNE notion de la leçon (ou une question de jury pour les leçons sur le métier), une ou deux relances, puis un bilan noté sur 5 avec une explication modèle. Au plus 3 réponses par séance. |
| **🎤 Dicter**, **🔊 Écouter** | zones de réponse, questions de l'IA | reconnaissance et synthèse vocales du navigateur (Chrome, Edge) : gratuites, sans IA. |

## Architecture

```text
navigateur ──POST /api/relire|oral + jeton de connexion Supabase──▶ fonction serveur Vercel (src/pages/api/)
                                                                    │ 1. vérifie le jeton auprès de Supabase
                                                                    │ 2. l'adresse doit être dans IA_EMAILS_AUTORISES
                                                                    │ 3. appelle Claude avec ANTHROPIC_API_KEY
                                                                    ▼
                                                           API Claude (claude-haiku-5-5, sortie JSON structurée)
```

- Le site reste **statique** ; seules les routes `src/pages/api/*.ts` (`export const prerender = false`) deviennent des fonctions
  serveur grâce à l'adaptateur `@astrojs/vercel` (`astro.config.mjs`, durée maximale 60 s).
- `src/lib/ia.ts` : accès réservé (jeton Supabase + liste d'adresses), limites de taille, messages d'erreur.
- Côté navigateur : `src/scripts/ia.ts` (appels, lecture à voix haute), `src/scripts/dictee.ts`, `src/scripts/oral.ts`,
  et le bouton de relecture dans `src/scripts/exercices.ts`.
- Le contexte d'une leçon pour l'oral est lu **sur le serveur** (titre, objectifs, cartes, cours sans les exercices) : le
  navigateur n'envoie que la clé de la leçon. La leçon est placée dans les consignes avec `cache_control` : les tours suivants
  d'une même séance la relisent depuis le cache.
- Le serveur ne garde rien : à chaque tour de l'oral, le navigateur renvoie tout l'échange.

## Configuration (une fois, sur Vercel)

*Settings → Environment Variables*, environnement **Production** :

| Variable | Valeur |
|---|---|
| `ANTHROPIC_API_KEY` | la clé de l'API Claude (console Anthropic → API Keys). **Secrète : jamais dans le code, jamais `PUBLIC_`.** |
| `IA_EMAILS_AUTORISES` | l'adresse du compte Supabase autorisé (plusieurs : séparées par des virgules). Sans elle, tout est refusé. |

Puis **Redeploy** : Vercel n'applique les variables qu'aux nouveaux déploiements. Fixer aussi une limite de dépense mensuelle dans
la console Anthropic.

## Coût

Claude Haiku 5.5 : 0,10 $ par million de jetons en entrée, 0,50 $ en sortie (octobre 2026). Ordre de grandeur estimé (pas
mesuré) : une relecture ≈ 0,1 centime, une séance orale complète ≈ 1 centime. La consommation réelle se lit dans la console
Anthropic (Usage). Réglages : `effort: "low"` (réponses rapides, 2 à 8 s), `max_tokens` 8 000
(une réponse coupée ou refusée est signalée comme une erreur, jamais affichée à moitié).

## Faire évoluer

- Les consignes (prompts) sont en tête de `src/pages/api/relire.ts` et `src/pages/api/oral.ts`.
- Pour tester en local : la fonction ne tourne pas avec `npm run dev` sans variables ; le plus simple est de tester sur le site en
  ligne après déploiement.
