// La collection des leçons. Les niveaux et les chapitres sont décrits dans src/data/modules.ts.
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const lecons = defineCollection({
  // src/content/lecons/<chapitre>/<NN>-<nom>.md ; NN donne l'ordre dans le chapitre.
  loader: glob({ pattern: "*/[0-9][0-9]-*.md", base: "./src/content/lecons" }),
  schema: z.object({
    titre: z.string(),
    resume: z.string(),
    duree: z.number().int().positive(),
    objectifs: z.array(z.string()).min(1),
    prerequis: z.array(z.string()).default([]),
    /** Un contrôle n'a pas de cours : seulement des exercices notés. */
    controle: z.boolean().default(false),
    /** Exception au réglage du chapitre : cette leçon demande (ou non) de programmer. */
    programmation: z.boolean().optional(),
  }),
});

export const collections = { lecons };
