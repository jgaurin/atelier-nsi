// Les deux collections de contenu : les leçons et les sujets d'épreuve.
// Les modules (chapitres) et le programme officiel sont décrits dans src/data/.
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const carte = z.object({
  q: z.string(),
  r: z.string(),
});

const lecons = defineCollection({
  // src/content/lecons/<module>/<NN>-<nom>.md ; NN donne l'ordre dans le module.
  loader: glob({ pattern: "*/[0-9][0-9]-*.md", base: "./src/content/lecons" }),
  schema: z.object({
    titre: z.string(),
    resume: z.string(),
    duree: z.number().int().positive(),
    objectifs: z.array(z.string()).min(1),
    prerequis: z.array(z.string()).default([]),
    programme: z.array(z.string()).default([]),
    cartes: z.array(carte).default([]),
  }),
});

const sujets = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/sujets" }),
  schema: z.object({
    titre: z.string(),
    epreuve: z.enum(["ecrit1", "ecrit2", "oral1", "oral2"]),
    duree: z.number().int().positive(),
    resume: z.string(),
    themes: z.array(z.string()).default([]),
    ordre: z.number().default(99),
  }),
});

export const collections = { lecons, sujets };
