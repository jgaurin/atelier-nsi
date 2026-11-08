// Site élèves : entièrement statique, sans compte et sans fonction serveur.
import { defineConfig } from "astro/config";
import remarkDirective from "remark-directive";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkAtelier from "./src/plugins/remark-atelier.mjs";

export default defineConfig({
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
    optimizeDeps: {
      include: [
        "mermaid", "sql.js", "codemirror", "@codemirror/view", "@codemirror/state", "@codemirror/commands",
        "@codemirror/language", "@codemirror/lang-python", "@codemirror/lang-javascript", "@codemirror/lang-sql", "@lezer/highlight",
      ],
    },
    // Sous Windows, un enregistrement produit souvent deux événements « modifié » : on attend que le fichier soit stable.
    server: {
      watch: { awaitWriteFinish: { stabilityThreshold: 400, pollInterval: 100 }, ignored: ["**/dist/**"] },
    },
  },
});
