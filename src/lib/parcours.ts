// Assemble le parcours au moment de la construction du site :
// modules (src/data/modules.ts) + leçons écrites (src/content/lecons) + exercices de chaque leçon.
import { getCollection, render, type CollectionEntry } from "astro:content";
import { MODULES, PARTIES, type Module } from "../data/modules";

export interface ResumeExercice {
  id: string;
  titre: string;
  niveau: number;
  type: "qcm" | "python" | "sql" | "redaction";
}

export interface InfoLecon {
  /** Identifiant stable « module/slug », utilisé pour la progression. */
  cle: string;
  module: string;
  slug: string;
  numero: number;
  titre: string;
  resume: string;
  duree: number;
  url: string;
  ecrite: boolean;
  exercices: ResumeExercice[];
  entree?: CollectionEntry<"lecons">;
}

export interface InfoModule extends Module {
  url: string;
  lecons: InfoLecon[];
  ecrites: InfoLecon[];
}

export const urlLecon = (module: string, slug: string) => `/parcours/${module}/${slug}/`;
export const urlModule = (module: string) => `/parcours/${module}/`;

function decouperId(id: string) {
  const [module, fichier] = id.split("/");
  const m = fichier.match(/^(\d+)-(.+)$/);
  return { module, slug: m ? m[2] : fichier, numero: m ? Number(m[1]) : 0 };
}

let cache: Promise<InfoModule[]> | null = null;

async function construire(): Promise<InfoModule[]> {
  const entrees = await getCollection("lecons");
  const ecrites = new Map<string, InfoLecon>();
  for (const entree of entrees) {
    const { module, slug, numero } = decouperId(entree.id);
    const { remarkPluginFrontmatter } = await render(entree);
    ecrites.set(`${module}/${slug}`, {
      cle: `${module}/${slug}`,
      module,
      slug,
      numero,
      titre: entree.data.titre,
      resume: entree.data.resume,
      duree: entree.data.duree,
      url: urlLecon(module, slug),
      ecrite: true,
      exercices: (remarkPluginFrontmatter?.exercices ?? []) as ResumeExercice[],
      entree,
    });
  }

  return MODULES.map((module) => {
    const prevues = module.plan.map(([slug, titre], i): InfoLecon => {
      const cle = `${module.id}/${slug}`;
      return ecrites.get(cle) ?? {
        cle, module: module.id, slug, numero: i + 1, titre, resume: "", duree: 0,
        url: urlLecon(module.id, slug), ecrite: false, exercices: [],
      };
    });
    // Une leçon écrite mais absente du plan est quand même affichée (à la fin).
    const horsPlan = [...ecrites.values()].filter(
      (l) => l.module === module.id && !module.plan.some(([slug]) => slug === l.slug),
    );
    horsPlan.sort((a, b) => a.numero - b.numero);
    const lecons = [...prevues, ...horsPlan].map((l, i) => ({ ...l, numero: i + 1 }));
    return { ...module, url: urlModule(module.id), lecons, ecrites: lecons.filter((l) => l.ecrite) };
  });
}

export function chargerParcours(): Promise<InfoModule[]> {
  cache ??= construire();
  return cache;
}

export async function parties() {
  const modules = await chargerParcours();
  return PARTIES.map((partie) => ({ ...partie, modules: modules.filter((m) => m.partie === partie.id) }));
}

/** Toutes les leçons écrites, dans l'ordre du parcours. */
export async function leconsEcrites(): Promise<InfoLecon[]> {
  return (await chargerParcours()).flatMap((m) => m.ecrites);
}

export async function voisines(cle: string) {
  const toutes = await leconsEcrites();
  const i = toutes.findIndex((l) => l.cle === cle);
  return { precedente: i > 0 ? toutes[i - 1] : undefined, suivante: i >= 0 ? toutes[i + 1] : undefined };
}

export async function leconParCle(cle: string) {
  return (await leconsEcrites()).find((l) => l.cle === cle);
}
