// Comportements présents sur toutes les pages : thème,
// statuts des leçons et barres de progression des modules.
import * as progression from "./progression";
import "./objectif";
import "./synchro";
import "./installation";

function basculerTheme() {
  const racine = document.documentElement;
  const sombre = racine.dataset.theme !== "sombre";
  racine.dataset.theme = sombre ? "sombre" : "clair";
  try { localStorage.setItem("atelier-nsi:theme", racine.dataset.theme); } catch { /* rien */ }
  document.dispatchEvent(new CustomEvent("atelier:theme"));
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
}

document.querySelectorAll("[data-basculer-theme]").forEach((b) => b.addEventListener("click", basculerTheme));
progression.surChangement(rafraichir);
rafraichir();
