// Séance de révision espacée (algorithme inspiré de SM-2, simplifié).
import * as progression from "./progression";
import type { EtatCarte } from "./progression";

interface Carte { id: string; lecon: string; module: string; titreModule: string; titreLecon: string; url: string; q: string; r: string }

const JOUR = 86_400_000;
const NOUVELLES_PAR_SEANCE = 15;
const zone = document.querySelector<HTMLElement>("[data-revisions]");

/** Prochain état d'une carte selon la note : 0 à revoir, 1 difficile, 2 bien, 3 facile. */
function planifier(avant: EtatCarte | undefined, note: number, maintenant = Date.now()): EtatCarte {
  const facilite0 = avant?.facilite ?? 2.5;
  const intervalle0 = avant?.intervalle ?? 0;
  let facilite = facilite0;
  let jours: number;
  if (note === 0) {
    facilite = Math.max(1.3, facilite0 - 0.2);
    return { echeance: new Date(maintenant + 10 * 60_000).toISOString(), intervalle: 0, facilite, repetitions: 0 };
  }
  if (!avant || intervalle0 === 0) {
    jours = note === 1 ? 1 : note === 2 ? 1 : 3;
  } else if (note === 1) {
    facilite = Math.max(1.3, facilite0 - 0.15);
    jours = Math.max(1, intervalle0 * 1.2);
  } else if (note === 2) {
    jours = intervalle0 * facilite0;
  } else {
    facilite = facilite0 + 0.15;
    jours = intervalle0 * facilite0 * 1.3;
  }
  jours = Math.min(Math.round(jours), 120);
  return { echeance: new Date(maintenant + jours * JOUR).toISOString(), intervalle: jours, facilite, repetitions: (avant?.repetitions ?? 0) + 1 };
}

function delaiLisible(etat: EtatCarte) {
  if (etat.intervalle === 0) return "10 min";
  return etat.intervalle === 1 ? "1 jour" : `${etat.intervalle} jours`;
}

if (zone) {
  const toutes: Carte[] = JSON.parse(zone.dataset.revisions || "[]");
  const choixModule = zone.querySelector<HTMLSelectElement>("[data-module]")!;
  const seance = document.querySelector<HTMLElement>("[data-seance]")!;
  const fin = document.querySelector<HTMLElement>("[data-fin]")!;
  const q = seance.querySelector<HTMLElement>("[data-question]")!;
  const r = seance.querySelector<HTMLElement>("[data-reponse]")!;
  const origine = seance.querySelector<HTMLElement>("[data-origine]")!;
  const reste = seance.querySelector<HTMLElement>("[data-reste]")!;
  const montrer = seance.querySelector<HTMLButtonElement>("[data-montrer]")!;
  const notes = seance.querySelector<HTMLElement>("[data-notes]")!;

  const disponibles = () => {
    const etat = progression.lire();
    const module = choixModule.value;
    return toutes.filter((c) => (module ? c.module === module : Boolean(etat.lecons[c.lecon]?.validee) || Boolean(etat.cartes[c.id])));
  };

  const compter = () => {
    const maintenant = Date.now();
    const liste = disponibles();
    const dues = liste.filter((c) => { const e = progression.etatCarte(c.id); return e && Date.parse(e.echeance) <= maintenant; });
    const nouvelles = liste.filter((c) => !progression.etatCarte(c.id));
    zone.querySelector("[data-nb-dues]")!.textContent = String(dues.length);
    zone.querySelector("[data-nb-nouvelles]")!.textContent = String(nouvelles.length);
    zone.querySelector("[data-nb-suivies]")!.textContent = String(Object.keys(progression.lire().cartes).length);
    zone.querySelector<HTMLElement>("[data-vide]")!.hidden = liste.length > 0;
    return { dues, nouvelles };
  };

  let file: Carte[] = [];
  let courante: Carte | null = null;

  const suivante = () => {
    courante = file.shift() ?? null;
    if (!courante) {
      seance.hidden = true;
      fin.hidden = false;
      compter();
      return;
    }
    origine.innerHTML = `${courante.titreModule} · <a href="${courante.url}">${courante.titreLecon}</a>`;
    q.innerHTML = courante.q;
    r.innerHTML = courante.r;
    r.hidden = true;
    notes.hidden = true;
    montrer.hidden = false;
    reste.textContent = `${file.length} carte(s) restante(s) après celle-ci`;
    const avant = progression.etatCarte(courante.id);
    notes.querySelectorAll<HTMLElement>("[data-delai]").forEach((s) => (s.textContent = delaiLisible(planifier(avant, Number(s.dataset.delai)))));
    montrer.focus();
  };

  const devoiler = () => {
    if (!courante) return;
    r.hidden = false;
    montrer.hidden = true;
    notes.hidden = false;
  };

  const noter = (note: number) => {
    if (!courante || r.hidden) return;
    const nouvel = planifier(progression.etatCarte(courante.id), note);
    progression.noterCarte(courante.id, nouvel);
    if (note === 0) file.push(courante); // revient en fin de séance
    suivante();
  };

  zone.querySelector("[data-demarrer]")!.addEventListener("click", () => {
    const { dues, nouvelles } = compter();
    file = [...dues, ...nouvelles.slice(0, NOUVELLES_PAR_SEANCE)];
    if (!file.length) {
      fin.hidden = false;
      fin.querySelector("[data-fin-texte]")!.textContent = "Rien à réviser pour l'instant. Valide des leçons ou choisis un module.";
      return;
    }
    fin.hidden = true;
    seance.hidden = false;
    suivante();
    seance.scrollIntoView({ behavior: "smooth", block: "center" });
  });
  montrer.addEventListener("click", devoiler);
  notes.querySelectorAll<HTMLButtonElement>("[data-note]").forEach((b) => b.addEventListener("click", () => noter(Number(b.dataset.note))));
  choixModule.addEventListener("change", compter);
  document.addEventListener("keydown", (e) => {
    if (seance.hidden || (e.target as HTMLElement).closest("select, input, textarea")) return;
    if (e.key === " " && r.hidden) { e.preventDefault(); devoiler(); }
    else if (["1", "2", "3", "4"].includes(e.key)) noter(Number(e.key) - 1);
  });
  compter();
}
