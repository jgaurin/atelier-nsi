// Petites icônes SVG au trait, de la couleur du texte (style Lucide, licence ISC ; tracés simplifiés).
// Une icône est toujours décorative (aria-hidden) : le bouton qui la porte a son propre aria-label.

const TRACES = {
  etincelles:
    `<path fill="currentColor" stroke="none" d="M10 2.5c.4 3.9 2.6 6.1 6.5 6.5-3.9.4-6.1 2.6-6.5 6.5-.4-3.9-2.6-6.1-6.5-6.5 3.9-.4 6.1-2.6 6.5-6.5z"/>` +
    `<path fill="currentColor" stroke="none" d="M18 13.5c.25 2.1 1.4 3.25 3.5 3.5-2.1.25-3.25 1.4-3.5 3.5-.25-2.1-1.4-3.25-3.5-3.5 2.1-.25 3.25-1.4 3.5-3.5z"/>`,
  micro: `<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M19 10v1a7 7 0 0 1-14 0v-1"/><path d="M12 18v4"/>`,
  stop: `<rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" stroke="none"/>`,
  son: `<path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/>`,
  envoyer: `<path d="M12 19V5"/><path d="m5 12 7-7 7 7"/>`,
  valide: `<path d="M20 6 9 17l-5-5"/>`,
  croix: `<path d="M18 6 6 18"/><path d="m6 6 12 12"/>`,
  alerte: `<circle cx="12" cy="12" r="9.5"/><path d="M12 7.5v5"/><path d="M12 16.2v.1"/>`,
  partiel: `<circle cx="12" cy="12" r="9.5"/><path d="M8 12h8"/>`,
  fleche: `<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>`,
  ampoule: `<path d="M9 18h6"/><path d="M10 21.5h4"/><path d="M8.5 14.5C7 13.2 6 11.4 6 9.5a6 6 0 0 1 12 0c0 1.9-1 3.7-2.5 5-.6.5-1 1.3-1 2H9.5c0-.7-.4-1.5-1-2z"/>`,
  etoile: `<path d="m12 2.8 2.8 5.7 6.3.9-4.6 4.4 1.1 6.3L12 17.1l-5.6 3 1.1-6.3-4.6-4.4 6.3-.9z"/>`,
  recommencer: `<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>`,
  chevron: `<path d="m9 6 6 6-6 6"/>`,
  chargement: `<path d="M21 12a9 9 0 1 1-6.2-8.6"/>`,
  copier: `<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/>`,
  inserer: `<path d="M12 3v11"/><path d="m7 9.5 5 5 5-5"/><path d="M4 20h16"/>`,
  mallette: `<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/><path d="M3 13h18"/>`,
  diplome: `<path d="M22 9 12 4 2 9l10 5 10-5z"/><path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5"/><path d="M22 9v6"/>`,
  reglages: `<circle cx="12" cy="12" r="3"/><path d="M12 2v3"/><path d="M12 19v3"/><path d="m4.9 4.9 2.1 2.1"/><path d="m17 17 2.1 2.1"/><path d="M2 12h3"/><path d="M19 12h3"/><path d="m4.9 19.1 2.1-2.1"/><path d="m17 7 2.1-2.1"/>`,
  theme: `<circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" stroke="none"/>`,
  horloge: `<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>`,
} as const;

export type NomIcone = keyof typeof TRACES;

export function icone(nom: NomIcone, taille = 18, classe = ""): SVGSVGElement {
  const modele = document.createElement("template");
  modele.innerHTML =
    `<svg class="icone icone-${nom}${classe ? ` ${classe}` : ""}" width="${taille}" height="${taille}" viewBox="0 0 24 24" ` +
    `fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${TRACES[nom]}</svg>`;
  return modele.content.firstElementChild as SVGSVGElement;
}

/** Version texte (pour le HTML écrit côté serveur, dans les pages Astro). */
export const iconeHTML = (nom: NomIcone, taille = 18) =>
  `<svg class="icone icone-${nom}" width="${taille}" height="${taille}" viewBox="0 0 24 24" fill="none" stroke="currentColor" ` +
  `stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${TRACES[nom]}</svg>`;
