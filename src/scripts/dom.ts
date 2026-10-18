// Petits outils DOM partagés par les scripts de l'Atelier.

type Enfant = Node | string | null | undefined | false;

export function el<K extends keyof HTMLElementTagNameMap>(
  balise: K,
  attributs: Record<string, string | boolean | undefined> = {},
  ...enfants: Enfant[]
): HTMLElementTagNameMap[K] {
  const noeud = document.createElement(balise);
  for (const [nom, valeur] of Object.entries(attributs)) {
    if (valeur === undefined || valeur === false) continue;
    noeud.setAttribute(nom, valeur === true ? "" : valeur);
  }
  for (const enfant of enfants) if (enfant) noeud.append(enfant);
  return noeud;
}

export function bouton(texte: string, classes = "bouton bouton-petit", titre?: string) {
  return el("button", { type: "button", class: classes, title: titre }, texte);
}

export function differer<T extends unknown[]>(f: (...args: T) => void, ms = 400) {
  let minuterie: ReturnType<typeof setTimeout> | undefined;
  return (...args: T) => {
    clearTimeout(minuterie);
    minuterie = setTimeout(() => f(...args), ms);
  };
}

export function annoncer(texte: string) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = el("div", { id: "toast", class: "toast", role: "status", "aria-live": "polite" });
    document.body.append(toast);
  }
  toast.textContent = texte;
  toast.classList.add("visible");
  clearTimeout((toast as HTMLElement & { _m?: number })._m);
  (toast as HTMLElement & { _m?: number })._m = window.setTimeout(() => toast!.classList.remove("visible"), 2600);
}

export function tableHTML(colonnes: string[], lignes: unknown[][], max = 60) {
  const table = el("table", { class: "table-resultat" },
    el("thead", {}, el("tr", {}, ...colonnes.map((c) => el("th", {}, c)))),
    el("tbody", {}, ...lignes.slice(0, max).map((l) => el("tr", {}, ...l.map((v) => el("td", {}, v === null ? "NULL" : String(v)))))),
  );
  return table;
}
