// Configuration du site. Les leçons sont du Markdown enrichi par src/plugins/remark-atelier.mjs.
import { defineConfig } from "astro/config";
import remarkDirective from "remark-directive";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkAtelier from "./src/plugins/remark-atelier.mjs";
import vercel from "@astrojs/vercel";

export default defineConfig({
  // Pas de page d'accueil : le site s'ouvre sur le Parcours (choix de l'objectif, statistiques, leçons).
  redirects: { "/": "/parcours/" },
  // Le site reste statique ; seules les routes /api/… (export const prerender = false) deviennent des fonctions
  // serveur Vercel : l'IA (src/pages/api/), qui a besoin de la clé gardée côté serveur.
  adapter: vercel({ maxDuration: 60 }),
  trailingSlash: "ignore",
  devToolbar: { enabled: false },
  markdown: {
    remarkPlugins: [remarkDirective, remarkMath, remarkAtelier],
    rehypePlugins: [[rehypeKatex, { strict: false, throwOnError: false }]],
    syntaxHighlight: { type: "shiki", excludeLangs: ["mermaid", "math"] },
    shikiConfig: {
      themes: { light: "github-light", dark: "github-dark" },
      wrap: false,
    },
  },
  vite: {
    // Bibliothèques chargées à la demande : on les pré-optimise dès le démarrage du serveur de développement,
    // sinon Vite les réoptimise en cours de session et les pages déjà ouvertes chargent une version périmée.
    optimizeDeps: {
      include: [
        "mermaid", "sql.js", "codemirror", "@codemirror/view", "@codemirror/state", "@codemirror/commands",
        "@codemirror/language", "@codemirror/lang-python", "@codemirror/lang-javascript", "@codemirror/lang-sql", "@lezer/highlight",
        "@supabase/supabase-js",
      ],
    },
    // Sous Windows, un enregistrement produit souvent deux événements « modifié » rapprochés : le serveur réécrivait
    // alors deux fois en même temps son cache de contenu (.astro/data-store.json), la seconde écriture échouait et la
    // collection des leçons se retrouvait vide (toutes les leçons en 404). On attend que le fichier soit stable.
    server: {
      // Les sorties de construction (dist, .vercel) ne doivent pas déclencher le serveur de développement.
      watch: { awaitWriteFinish: { stabilityThreshold: 400, pollInterval: 100 }, ignored: ["**/.vercel/**", "**/dist/**"] },
    },
  },
});
