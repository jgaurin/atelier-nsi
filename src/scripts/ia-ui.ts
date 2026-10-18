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
