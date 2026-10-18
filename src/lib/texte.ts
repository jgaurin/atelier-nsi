// Mise en forme légère pour les textes courts (cartes de révision) :
// `code`, **gras**, *italique* et $formule$ (KaTeX), au moment de la construction du site.
import katex from "katex";

const echapper = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function enLigne(texte: string): string {
  const morceaux: string[] = [];
  const garder = (html: string) => `\u0000${morceaux.push(html) - 1}\u0000`;
  let s = texte
    .replace(/`([^`]+)`/g, (_, code) => garder(`<code>${echapper(code)}</code>`))
    .replace(/\$([^$]+)\$/g, (_, tex) => garder(katex.renderToString(tex, { throwOnError: false })));
  s = echapper(s)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/\n/g, "<br>");
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => morceaux[Number(i)]);
}

/** Petit hachage stable (djb2) pour identifier une carte par son texte. */
export function hachage(texte: string): string {
  let h = 5381;
  for (let i = 0; i < texte.length; i++) h = ((h << 5) + h + texte.charCodeAt(i)) >>> 0;
  return h.toString(36);
}
