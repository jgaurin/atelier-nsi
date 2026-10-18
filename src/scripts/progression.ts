// Progression de l'apprenant, enregistrée dans le navigateur (localStorage).
// Tout passe par ce module. La synchronisation en ligne (synchro.ts) s'abonne aux changements et fusionne
// cet état avec celui du compte (fusion.ts) : chaque changement porte donc sa date (« maj »).

export type StatutExercice = "reussi" | "a-revoir" | "tente";

export interface EtatExercice {
  statut: StatutExercice;
  brouillon?: string;
  maj: string;
}

export interface EtatCarte {
  echeance: string;
  intervalle: number; // en jours
  facilite: number;
  repetitions: number;
  maj?: string; // dernière révision
}

/** Exercice Python créé par l'IA sur une leçon ; supprimé = il ne reste que la date (pour que la suppression se propage). */
export interface ExerciceGenere {
  lecon: string;
  niveau: number;
  cree: string;
  supprime?: string;
  contenu?: {
    titre: string;
    enonce: string;
    depart: string;
    tests: { label: string; code: string }[];
    indices: string[];
    corrige: string;
    explication: string;
  };
}

export interface Etat {
  version: 2;
  /** maj : date de la dernière validation (ou annulation) ; une simple visite ne la change pas. */
  lecons: Record<string, { vue?: string; validee?: string; maj?: string }>;
  exercices: Record<string, EtatExercice>;
  cartes: Record<string, EtatCarte>;
  derniere?: { lecon: string; quand: string };
  chronos: Record<string, { debut: number; ecoule: number; enCours: boolean; maj?: string }>;
  /** Exercices créés par l'IA, par identifiant (« ia-… »). */
  generes: Record<string, ExerciceGenere>;
  /** Date de la dernière remise à zéro faite en étant connecté : tout ce qui est plus ancien est oublié partout. */
  efface?: string;
}

const CLE = "atelier-nsi:v2";
const vide = (): Etat => ({ version: 2, lecons: {}, exercices: {}, cartes: {}, chronos: {}, generes: {} });

let memoire: Etat | null = null;
const abonnes = new Set<(etat: Etat) => void>();

export function lire(): Etat {
  if (memoire) return memoire;
  try {
    const brut = localStorage.getItem(CLE);
    const etat = brut ? (JSON.parse(brut) as Etat) : vide();
    memoire = { ...vide(), ...etat, version: 2 };
  } catch {
    memoire = vide();
  }
  return memoire;
}

function enregistrer() {
  if (!memoire) return;
  try {
    localStorage.setItem(CLE, JSON.stringify(memoire));
  } catch {
    /* stockage plein ou interdit : on garde l'état en mémoire pour cette visite */
  }
  abonnes.forEach((f) => f(memoire!));
}

export function surChangement(f: (etat: Etat) => void) {
  abonnes.add(f);
  return () => abonnes.delete(f);
}

const maintenant = () => new Date().toISOString();

/* Leçons -------------------------------------------------------------- */
export function marquerVue(cle: string) {
  const etat = lire();
  etat.lecons[cle] ??= {};
  etat.lecons[cle].vue ??= maintenant();
  etat.derniere = { lecon: cle, quand: maintenant() };
  enregistrer();
}

export function validerLecon(cle: string, valider = true) {
  const etat = lire();
  etat.lecons[cle] ??= {};
  if (valider) etat.lecons[cle].validee = maintenant();
  else delete etat.lecons[cle].validee;
  etat.lecons[cle].maj = maintenant();
  enregistrer();
}

export function statutLecon(cle: string): "nouvelle" | "vue" | "validee" {
  const l = lire().lecons[cle];
  if (l?.validee) return "validee";
  if (l?.vue) return "vue";
  return "nouvelle";
}

/* Exercices ----------------------------------------------------------- */
export function exercice(id: string): EtatExercice | undefined {
  return lire().exercices[id];
}

export function noterExercice(id: string, statut: StatutExercice) {
  const etat = lire();
  const avant = etat.exercices[id];
  // Un exercice déjà réussi le reste si on le retente sans le finir.
  if (statut === "tente" && avant && avant.statut !== "tente") return;
  etat.exercices[id] = { ...avant, statut, maj: maintenant() };
  enregistrer();
}

export function garderBrouillon(id: string, brouillon: string) {
  const etat = lire();
  const avant = etat.exercices[id];
  etat.exercices[id] = { ...avant, statut: avant?.statut ?? "tente", brouillon, maj: maintenant() };
  enregistrer();
}

/* Cartes de révision -------------------------------------------------- */
export function etatCarte(id: string): EtatCarte | undefined {
  return lire().cartes[id];
}

export function noterCarte(id: string, carte: EtatCarte) {
  lire().cartes[id] = { ...carte, maj: maintenant() };
  enregistrer();
}

/* Chronomètres des sujets --------------------------------------------- */
export function chrono(id: string) {
  return lire().chronos[id] ?? { debut: 0, ecoule: 0, enCours: false };
}

export function majChrono(id: string, valeur: Etat["chronos"][string]) {
  lire().chronos[id] = { ...valeur, maj: maintenant() };
  enregistrer();
}

/* Exercices générés par l'IA ----------------------------------------- */
/** Exercices générés d'une leçon (non supprimés), du plus ancien au plus récent. */
export function exercicesGeneres(lecon: string): [string, ExerciceGenere][] {
  return Object.entries(lire().generes)
    .filter(([, e]) => e.lecon === lecon && !e.supprime && e.contenu)
    .sort(([, a], [, b]) => a.cree.localeCompare(b.cree));
}

export function ajouterExerciceGenere(id: string, exercice: ExerciceGenere) {
  lire().generes[id] = exercice;
  enregistrer();
}

export function supprimerExerciceGenere(id: string) {
  const e = lire().generes[id];
  if (!e) return;
  lire().generes[id] = { lecon: e.lecon, niveau: e.niveau, cree: e.cree, supprime: maintenant() };
  delete lire().exercices[id];
  enregistrer();
}

/* Sauvegarde ---------------------------------------------------------- */
export function exporter(): string {
  return JSON.stringify({ ...lire(), exporte: maintenant() }, null, 2);
}

export function importer(texte: string) {
  const donnees = JSON.parse(texte);
  if (!donnees || donnees.version !== 2) throw new Error("Ce fichier ne vient pas de cette version de l'Atelier.");
  memoire = { ...vide(), ...donnees, version: 2 };
  enregistrer();
}

/** Remet à zéro cet appareil ; avec propager, la remise à zéro s'applique aussi au compte en ligne. */
export function toutEffacer(propager = false) {
  memoire = propager ? { ...vide(), efface: maintenant() } : vide();
  enregistrer();
}

/** Remplace l'état (après une fusion avec le compte en ligne) et prévient les pages ouvertes. */
export function remplacer(etat: Etat) {
  memoire = etat;
  enregistrer();
}
