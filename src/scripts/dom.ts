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

/**
 * La console d'une exécution : ce que le programme a affiché, puis l'erreur éventuelle, comme dans un terminal.
 * `maj` la remplit pendant l'exécution ; l'élément reste à sa place dans la page.
 */
export function blocConsole(enCours = false, vide = "Rien n'a été affiché.") {
  const texte = el("pre", { class: "console-texte" });
  const erreur = el("pre", { class: "console-texte console-erreur", hidden: true });
  const titre = el("div", { class: "console-titre" }, el("span", {}, "Console"), el("small", {}, enCours ? "en cours…" : ""));
  const bloc = el("div", { class: "console" }, titre, texte, erreur);
  function maj(sortie: string, messageErreur?: string | null, fini = false) {
    texte.textContent = sortie;
    texte.hidden = !sortie && Boolean(messageErreur);
    if (!sortie && !messageErreur) {
      texte.textContent = fini ? vide : "";
      texte.classList.toggle("console-vide", fini);
    } else texte.classList.remove("console-vide");
    erreur.textContent = messageErreur ?? "";
    erreur.hidden = !messageErreur;
    titre.querySelector("small")!.textContent = fini ? "" : "en cours…";
    texte.scrollTop = texte.scrollHeight;
  }
  return { bloc, maj };
}
