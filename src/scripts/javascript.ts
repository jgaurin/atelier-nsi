// Exécution des exemples JavaScript des leçons, dans un Worker jetable :
// le code ne peut pas toucher à la page, et une boucle infinie est arrêtée au bout de DELAI_MS.

const DELAI_MS = 4000;

export type ResultatJS = { sortie: string; erreur: string };

const ENVELOPPE = `
const lignes = [];
const texte = (v) => {
  if (typeof v === "string") return v;
  try { return JSON.stringify(v) ?? String(v); } catch { return String(v); }
};
const ecrire = (...args) => lignes.push(args.map(texte).join(" "));
self.console = { log: ecrire, info: ecrire, warn: ecrire, error: ecrire, table: ecrire };
self.onmessage = async (e) => {
  let erreur = "";
  try {
    const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
    await new AsyncFunction(e.data)();
  } catch (err) {
    erreur = (err && err.name ? err.name + " : " : "") + (err && err.message ? err.message : String(err));
  }
  self.postMessage({ sortie: lignes.join("\\n"), erreur });
};
`;

let urlEnveloppe: string | null = null;

export function executerJS(code: string): Promise<ResultatJS> {
  urlEnveloppe ??= URL.createObjectURL(new Blob([ENVELOPPE], { type: "text/javascript" }));
  const worker = new Worker(urlEnveloppe);
  return new Promise((resoudre) => {
    const minuterie = setTimeout(() => {
      worker.terminate();
      resoudre({ sortie: "", erreur: `Arrêt : le programme tourne depuis plus de ${DELAI_MS / 1000} s (boucle infinie ?).` });
    }, DELAI_MS);
    worker.onmessage = (e) => {
      clearTimeout(minuterie);
      worker.terminate();
      resoudre(e.data as ResultatJS);
    };
    worker.onerror = (e) => {
      clearTimeout(minuterie);
      worker.terminate();
      resoudre({ sortie: "", erreur: e.message || "Erreur de syntaxe" });
      e.preventDefault();
    };
    worker.postMessage(code);
  });
}
