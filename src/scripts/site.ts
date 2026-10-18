// Comportements présents sur toutes les pages : thème, pastille des révisions,
// statuts des leçons et barres de progression des modules.
import * as progression from "./progression";
import "./objectif";

function basculerTheme() {
  const racine = document.documentElement;
  const sombre = racine.dataset.theme !== "sombre";
  racine.dataset.theme = sombre ? "sombre" : "clair";
  try { localStorage.setItem("atelier-nsi:theme", racine.dataset.theme); } catch { /* rien */ }
  document.dispatchEvent(new CustomEvent("atelier:theme"));
}

/** Nombre de cartes dont la date de révision est passée. */
export function cartesDues(etat = progression.lire()) {
  const maintenant = Date.now();
  return Object.values(etat.cartes).filter((c) => Date.parse(c.echeance) <= maintenant).length;
}

export function rafraichir() {
  const etat = progression.lire();
  document.querySelectorAll<HTMLElement>("[data-statut-lecon]").forEach((noeud) => {
    noeud.dataset.statut = progression.statutLecon(noeud.dataset.statutLecon!);
  });
  document.querySelectorAll<HTMLElement>("[data-progres]").forEach((noeud) => {
    const cles: string[] = JSON.parse(noeud.dataset.progres || "[]");
    const validees = cles.filter((c) => etat.lecons[c]?.validee).length;
    const pourcentage = cles.length ? Math.round((100 * validees) / cles.length) : 0;
    const barre = noeud.querySelector<HTMLElement>(".barre > span");
    if (barre) barre.style.width = `${pourcentage}%`;
    const texte = noeud.querySelector<HTMLElement>("[data-progres-texte]");
    if (texte) texte.textContent = cles.length ? `${validees} / ${cles.length} validée${validees > 1 ? "s" : ""}` : "en rédaction";
  });
  document.querySelectorAll<HTMLElement>("[data-exercices-reussis]").forEach((noeud) => {
    const ids: string[] = JSON.parse(noeud.dataset.exercicesReussis || "[]");
    const n = ids.filter((id) => etat.exercices[id]?.statut === "reussi").length;
    noeud.textContent = `${n} / ${ids.length}`;
  });
  const dues = cartesDues(etat);
  document.querySelectorAll<HTMLElement>("[data-compte-revisions]").forEach((noeud) => {
    noeud.textContent = dues ? String(dues) : "";
    noeud.dataset.valeur = String(dues);
  });
}

document.querySelectorAll("[data-basculer-theme]").forEach((b) => b.addEventListener("click", basculerTheme));
progression.surChangement(rafraichir);
rafraichir();
