// Dessine les schémas écrits en Mermaid (```mermaid dans les leçons).
// Mermaid n'est chargé que si la page contient au moins un schéma.

const CLAIR = {
  background: "#ffffff",
  primaryColor: "#ecebfc",
  primaryBorderColor: "#4a3dce",
  primaryTextColor: "#1d1b17",
  secondaryColor: "#e2f3ea",
  secondaryBorderColor: "#18794e",
  tertiaryColor: "#fcefdf",
  tertiaryBorderColor: "#b4600e",
  lineColor: "#57534b",
  textColor: "#1d1b17",
  noteBkgColor: "#fdf5d8",
  noteBorderColor: "#b4600e",
  clusterBkg: "#f6f5f1",
  clusterBorder: "#cfcbbf",
  edgeLabelBackground: "#ffffff",
  attributeBackgroundColorOdd: "#ffffff",
  attributeBackgroundColorEven: "#f6f5f1",
  rowOdd: "#ffffff",
  rowEven: "#f6f5f1",
};

const SOMBRE = {
  background: "#1c1b18",
  primaryColor: "#27244a",
  primaryBorderColor: "#9a90ff",
  primaryTextColor: "#ece9e1",
  secondaryColor: "#17301f",
  secondaryBorderColor: "#5cc993",
  tertiaryColor: "#35250f",
  tertiaryBorderColor: "#f0a35c",
  lineColor: "#b4afa4",
  textColor: "#ece9e1",
  noteBkgColor: "#302a12",
  noteBorderColor: "#f0a35c",
  clusterBkg: "#23221e",
  clusterBorder: "#4a473f",
  edgeLabelBackground: "#1c1b18",
  attributeBackgroundColorOdd: "#23221e",
  attributeBackgroundColorEven: "#1c1b18",
  rowOdd: "#23221e",
  rowEven: "#1c1b18",
};

// Un schéma caché (corrigé pas encore ouvert) ne peut pas être mesuré : Mermaid le dessinerait
// en « Syntax error ». On ne dessine donc un schéma que lorsqu'il est affiché.
let mermaidPret: Promise<any> | null = null;
let themeApplique = "";
const dessines = new Set<HTMLElement>();

function chargerMermaid() {
  mermaidPret ??= import("mermaid").then((m) => m.default);
  return mermaidPret;
}

async function dessiner(blocs: HTMLElement[]) {
  const mermaid = await chargerMermaid();
  const theme = document.documentElement.dataset.theme === "sombre" ? "sombre" : "clair";
  if (theme !== themeApplique) {
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: "strict",
      theme: "base",
      themeVariables: { ...(theme === "sombre" ? SOMBRE : CLAIR), fontFamily: "inherit", fontSize: "15px" },
      flowchart: { curve: "basis", htmlLabels: true, padding: 12 },
    });
    themeApplique = theme;
  }
  for (const bloc of blocs) {
    bloc.dataset.source ??= bloc.textContent ?? "";
    bloc.removeAttribute("data-processed");
    bloc.textContent = bloc.dataset.source;
    dessines.add(bloc);
  }
  try {
    await mermaid.run({ nodes: blocs });
  } catch (e) {
    console.error("Schéma", e);
  }
}

// Schémas pas encore dessinés parce que cachés (corrigé fermé…) : on les guette.
const enAttente = new Set<HTMLElement>();
const estAffiche = (b: HTMLElement) => b.getClientRects().length > 0;
let guetteur: MutationObserver | null = null;

function verifierEnAttente() {
  const prets = [...enAttente].filter(estAffiche);
  if (!prets.length) return;
  for (const b of prets) enAttente.delete(b);
  if (!enAttente.size) {
    guetteur?.disconnect();
    guetteur = null;
  }
  dessiner(prets);
}

function guetter(blocs: HTMLElement[]) {
  for (const b of blocs) enAttente.add(b);
  if (guetteur || typeof MutationObserver === "undefined") return;
  guetteur = new MutationObserver(() => requestAnimationFrame(verifierEnAttente));
  guetteur.observe(document.body, { subtree: true, attributes: true, attributeFilter: ["hidden", "open", "class", "style"] });
}

export function dessinerSchemas(racine: ParentNode = document) {
  const blocs = [...racine.querySelectorAll<HTMLElement>("pre.mermaid")];
  if (!blocs.length) return;
  for (const bloc of blocs) bloc.dataset.source ??= bloc.textContent ?? "";
  const visibles = blocs.filter(estAffiche);
  if (visibles.length) dessiner(visibles);
  guetter(blocs.filter((b) => !estAffiche(b)));
}

// Le thème change → on redessine (avec les nouvelles couleurs) les schémas déjà dessinés.
document.addEventListener("atelier:theme", () => {
  const visibles = [...dessines].filter(estAffiche);
  const caches = [...dessines].filter((b) => !estAffiche(b));
  for (const b of caches) {
    dessines.delete(b);
    b.removeAttribute("data-processed");
    b.textContent = b.dataset.source ?? "";
  }
  if (caches.length) guetter(caches);
  if (visibles.length) dessiner(visibles);
});
