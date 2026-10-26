// Lance du Python dans un Web Worker (public/python-worker.mjs) et limite la durée d'exécution.

export interface TestPython { label: string; code: string }
export interface ResultatTest { label: string; ok: boolean; detail: string }
export interface ResultatPython { tests: ResultatTest[]; sortie: string; erreur: string | null }

const DELAI_MS = 8000;
let travailleur: Worker | null = null;
let pret: Promise<void> | null = null;
let compteur = 0;
const enAttente = new Map<number, (r: ResultatPython) => void>();
// Ce que chaque exécution en cours a déjà affiché, et qui le suit à l'écran.
const sorties = new Map<number, string>();
const ecouteurs = new Map<number, (sortie: string) => void>();

function demarrer(): Promise<void> {
  if (pret) return pret;
  travailleur = new Worker("/python-worker.mjs", { type: "module" });
  pret = new Promise((resoudre, rejeter) => {
    travailleur!.onmessage = ({ data }) => {
      if (data.type === "ready") resoudre();
      else if (data.type === "startup-error") rejeter(new Error(data.message));
      else if (data.type === "sortie") {
        const total = (sorties.get(data.id) ?? "") + data.texte;
        sorties.set(data.id, total);
        ecouteurs.get(data.id)?.(total);
      } else if (data.type === "result") {
        enAttente.get(data.id)?.(data.result);
        enAttente.delete(data.id);
      }
    };
    travailleur!.onerror = (e) => rejeter(new Error(e.message || "Python n'a pas pu démarrer."));
  });
  pret.catch(() => arreter());
  return pret;
}

function arreter() {
  travailleur?.terminate();
  travailleur = null;
  pret = null;
}

export function pythonEstPret() {
  return pret !== null;
}

export interface OptionsPython {
  /** Reçoit tout ce que le programme a affiché jusqu'ici, au fil de l'exécution. */
  surSortie?: (sortie: string) => void;
}

/** Exécute `code`, puis chaque test dans le même espace de noms. */
export async function executerPython(code: string, tests: TestPython[] = [], options: OptionsPython = {}): Promise<ResultatPython> {
  try {
    await demarrer();
  } catch (e) {
    return { tests: [], sortie: "", erreur: `Python n'a pas pu se charger (connexion Internet nécessaire la première fois). ${(e as Error).message}` };
  }
  const id = ++compteur;
  if (options.surSortie) ecouteurs.set(id, options.surSortie);
  const finir = (id: number) => { sorties.delete(id); ecouteurs.delete(id); };
  return new Promise((resoudre) => {
    const minuterie = setTimeout(() => {
      const sortie = sorties.get(id) ?? "";
      enAttente.delete(id);
      finir(id);
      arreter(); // le seul moyen d'interrompre une boucle infinie
      resoudre({ tests: [], sortie, erreur: `Exécution interrompue après ${DELAI_MS / 1000} s : ton programme ne s'arrête pas (boucle infinie ?).` });
    }, DELAI_MS + 2000);
    enAttente.set(id, (r) => { clearTimeout(minuterie); finir(id); resoudre(r); });
    travailleur!.postMessage({ type: "run", id, code, tests });
  });
}
