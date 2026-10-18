// Fusion de deux progressions (celle de cet appareil et celle du compte en ligne) : rien de ce qui a été fait
// d'un côté ne se perd. Pour chaque leçon, exercice, carte ou chronomètre, la modification la plus récente
// l'emporte ; une remise à zéro (champ « efface ») oublie tout ce qui lui est antérieur, sur tous les appareils.
// Module pur (sans navigateur) : il est testé directement avec Node.
import type { Etat, EtatCarte, EtatExercice, ExerciceGenere } from "./progression";

type Lecon = Etat["lecons"][string];
type Chrono = Etat["chronos"][string];

const JOUR = 86_400_000;
const RANG = { reussi: 2, "a-revoir": 1, tente: 0 } as const;

const objet = (x: unknown): Record<string, any> => (x && typeof x === "object" && !Array.isArray(x) ? (x as Record<string, any>) : {});
const texte = (x: unknown) => (typeof x === "string" ? x : undefined);
const plusTot = (a?: string, b?: string) => (!a ? b : !b ? a : a < b ? a : b);
const plusTard = (a?: string, b?: string) => (!a ? b : !b ? a : a > b ? a : b);

function sansVides<T extends object>(o: T): T {
  for (const cle of Object.keys(o) as (keyof T)[]) if (o[cle] === undefined) delete o[cle];
  return o;
}

/** Table dont on ne garde que les entrées qui sont des objets. */
function table(x: unknown): Record<string, any> {
  const o = objet(x);
  return Object.values(o).every((v) => objet(v) === v) ? o : Object.fromEntries(Object.entries(o).filter(([, v]) => objet(v) === v));
}

/** Remet en forme un état lu ailleurs (compte en ligne, fichier) ; ce qui n'est pas reconnu est ignoré. */
export function normaliser(x: unknown): Etat {
  const e = objet(x);
  const derniere = objet(e.derniere);
  return sansVides({
    version: 2 as const,
    lecons: table(e.lecons),
    exercices: table(e.exercices),
    cartes: table(e.cartes),
    chronos: table(e.chronos),
    generes: table(e.generes),
    derniere: texte(derniere.lecon) && texte(derniere.quand) ? { lecon: derniere.lecon, quand: derniere.quand } : undefined,
    efface: texte(e.efface),
  });
}

/* Dates qui départagent deux versions --------------------------------- */

/** Dernière décision sur la leçon (validée ou non) : une simple visite ne compte pas. */
const decisionLecon = (l: Lecon) => l.maj ?? l.validee ?? "";
/** Dernière activité sur la leçon, visite comprise (pour la remise à zéro). */
const activiteLecon = (l: Lecon) => plusTard(plusTard(l.maj, l.validee), l.vue) ?? "";
/** Dernière révision de la carte ; avant l'ajout de « maj », on la déduit de l'échéance. */
function revisionCarte(c: EtatCarte) {
  if (c.maj) return c.maj;
  const t = Date.parse(c.echeance) - c.intervalle * JOUR;
  return Number.isFinite(t) ? new Date(t).toISOString() : "";
}

/* Fusion élément par élément ------------------------------------------ */

function fusionLecon(a: Lecon, b: Lecon): Lecon {
  const da = decisionLecon(a), db = decisionLecon(b);
  const recente = da > db ? a : db > da ? b : a.validee ? a : b;
  return sansVides({ vue: plusTot(a.vue, b.vue), validee: recente.validee, maj: recente.maj });
}

function fusionExercice(a: EtatExercice, b: EtatExercice): EtatExercice {
  const ma = a.maj ?? "", mb = b.maj ?? "";
  const recent = ma > mb ? a : mb > ma ? b : RANG[a.statut] >= RANG[b.statut] ? a : b;
  const ancien = recent === a ? b : a;
  // Comme sur un seul appareil : retenter un exercice sans le finir n'efface pas un résultat obtenu.
  const statut = recent.statut === "tente" && ancien.statut !== "tente" ? ancien.statut : recent.statut;
  return sansVides({ statut, brouillon: recent.brouillon ?? ancien.brouillon, maj: recent.maj });
}

function fusionCarte(a: EtatCarte, b: EtatCarte): EtatCarte {
  const ra = revisionCarte(a), rb = revisionCarte(b);
  return ra > rb ? a : rb > ra ? b : a.repetitions >= b.repetitions ? a : b;
}

const fusionChrono = (a: Chrono, b: Chrono): Chrono => ((b.maj ?? "") > (a.maj ?? "") ? b : a);

/** Un exercice généré ne change pas ; seule sa suppression compte, et elle l'emporte. */
const fusionGenere = (a: ExerciceGenere, b: ExerciceGenere): ExerciceGenere => (a.supprime ? a : b.supprime ? b : a);
const quandGenere = (e: ExerciceGenere) => e.supprime ?? e.cree ?? "";

function fusionTable<T>(a: Record<string, T>, b: Record<string, T>, fusion: (x: T, y: T) => T, quand: (x: T) => string, efface?: string) {
  const resultat: Record<string, T> = {};
  for (const cle of new Set([...Object.keys(a), ...Object.keys(b)])) {
    const x = a[cle], y = b[cle];
    const v = x && y ? fusion(x, y) : (x ?? y);
    if (!v || (efface && quand(v) < efface)) continue;
    resultat[cle] = v;
  }
  return resultat;
}

/** Progression qui réunit les deux : c'est elle qu'on garde sur l'appareil et qu'on envoie au compte. */
export function fusionner(local: unknown, distant: unknown): Etat {
  const a = normaliser(local), b = normaliser(distant);
  const efface = plusTard(a.efface, b.efface);
  const derniere = !a.derniere ? b.derniere : !b.derniere ? a.derniere : b.derniere.quand > a.derniere.quand ? b.derniere : a.derniere;
  return sansVides({
    version: 2 as const,
    lecons: fusionTable(a.lecons, b.lecons, fusionLecon, activiteLecon, efface),
    exercices: fusionTable(a.exercices, b.exercices, fusionExercice, (e) => e.maj ?? "", efface),
    cartes: fusionTable(a.cartes, b.cartes, fusionCarte, revisionCarte, efface),
    chronos: fusionTable(a.chronos, b.chronos, fusionChrono, (c) => c.maj ?? "", efface),
    generes: fusionTable(a.generes, b.generes, fusionGenere, quandGenere, efface),
    derniere: derniere && !(efface && derniere.quand < efface) ? derniere : undefined,
    efface,
  });
}

/** Écriture JSON aux clés triées : deux états égaux donnent le même texte, quel que soit l'ordre des clés. */
function stable(x: unknown): string {
  if (Array.isArray(x)) return `[${x.map(stable).join(",")}]`;
  if (x && typeof x === "object") {
    const o = x as Record<string, unknown>;
    return `{${Object.keys(o).filter((k) => o[k] !== undefined).sort().map((k) => `${JSON.stringify(k)}:${stable(o[k])}`).join(",")}}`;
  }
  return JSON.stringify(x);
}

export const identiques = (a: unknown, b: unknown) => stable(normaliser(a)) === stable(normaliser(b));
