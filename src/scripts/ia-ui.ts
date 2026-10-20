// Briques d'affichage communes aux aides IA (relecture des exercices, oral) : même carte, mêmes icônes, couleurs du thème.
import { el } from "./dom";
import { icone, type NomIcone } from "./icones";

/** En-tête d'une carte IA : pastille étincelles, titre, et à droite un élément facultatif (verdict, note, attente). */
export function enTeteIA(titre: string, droite?: Node | null) {
  return el("div", { class: "ia-tete" },
    el("span", { class: "ia-titre" }, el("span", { class: "ia-pastille" }, icone("etincelles", 14)), titre), droite ?? null);
}

export interface ElementListe { texte: string; detail?: string; icone: NomIcone; ton: "bien" | "revoir" | "faux" }

/** Liste à puces-icônes (points forts, à revoir, critères) ; null si elle est vide. */
export function listeIA(titre: string, elements: ElementListe[]) {
  if (!elements.length) return null;
  return el("section", { class: "ia-bloc" },
    el("h4", {}, titre),
    el("ul", { class: "ia-liste" }, ...elements.map((e) =>
      el("li", { "data-ton": e.ton }, icone(e.icone, 16), el("span", {}, e.texte, e.detail ? el("small", {}, e.detail) : null)))));
}

export const pointsForts = (textes: string[]): ElementListe[] => textes.map((texte) => ({ texte, icone: "valide", ton: "bien" }));
export const pointsARevoir = (textes: string[]): ElementListe[] => textes.map((texte) => ({ texte, icone: "fleche", ton: "revoir" }));

/** Encadré « Conseil ». */
export const conseilIA = (texte: string) =>
  texte.trim() ? el("div", { class: "ia-conseil" }, icone("ampoule", 18), el("p", {}, el("strong", {}, "Conseil. "), texte)) : null;

/** Lignes grises animées pendant l'attente. */
export const squelette = (lignes = 3) => el("div", { class: "ia-squelette" }, ...Array.from({ length: lignes }, () => el("span", {})));

/** Texte de l'IA → nœuds sûrs (jamais d'innerHTML) : paragraphes, listes « - », `code`, **gras**, blocs ```. */
export function miniMarkdown(texte: string): Node[] {
  const noeuds: Node[] = [];
  const enLigne = (ligne: string) => {
    const morceaux: Node[] = [];
    for (const m of ligne.split(/(`[^`]+`|\*\*[^*]+\*\*)/g)) {
      if (!m) continue;
      if (m.startsWith("`") && m.endsWith("`") && m.length > 1) morceaux.push(el("code", {}, m.slice(1, -1)));
      else if (m.startsWith("**") && m.endsWith("**") && m.length > 4) morceaux.push(el("strong", {}, m.slice(2, -2)));
      else morceaux.push(document.createTextNode(m));
    }
    return morceaux;
  };
  texte.replace(/\r/g, "").split(/```/).forEach((partie, i) => {
    if (i % 2 === 1) {
      noeuds.push(el("pre", { class: "code-genere" }, el("code", {}, partie.replace(/^[a-z]*\n/i, "").replace(/\n$/, ""))));
      return;
    }
    for (const paragraphe of partie.split(/\n\s*\n/)) {
      const lignes = paragraphe.split("\n").filter((l) => l.trim());
      if (!lignes.length) continue;
      if (lignes.every((l) => /^\s*[-*] /.test(l))) {
        noeuds.push(el("ul", {}, ...lignes.map((l) => el("li", {}, ...enLigne(l.replace(/^\s*[-*] /, ""))))));
      } else {
        const p = el("p");
        lignes.forEach((l, j) => { if (j) p.append(el("br")); p.append(...enLigne(l.trim())); });
        noeuds.push(p);
      }
    }
  });
  return noeuds;
}
