// Page Parcours : pour chaque objectif, lien « reprendre » (dernière leçon ouverte de l'objectif, sinon la prochaine
// non validée), compteurs et compte à rebours. Les statuts et barres des étapes sont remplis par site.ts.
import * as progression from "./progression";
import { cartesDues } from "./site";

interface Repere { cle: string; titre: string; url: string; module: string }

function remplir() {
  const etat = progression.lire();

  document.querySelectorAll<HTMLAnchorElement>("a[data-reprendre]").forEach((lien) => {
    const ordre: Repere[] = JSON.parse(lien.dataset.reprendre || "[]");
    const derniere = etat.derniere && ordre.find((l) => l.cle === etat.derniere!.lecon);
    const prochaine = ordre.find((l) => !etat.lecons[l.cle]?.validee);
    const cible = derniere && !etat.lecons[derniere.cle]?.validee ? derniere : prochaine;
    const etiquette = lien.querySelector("[data-reprendre-surtitre]")!;
    const titre = lien.querySelector("[data-reprendre-titre]")!;
    if (!ordre.some((l) => etat.lecons[l.cle])) return;          // rien commencé : « Commencer » la première leçon
    if (cible) {
      etiquette.textContent = cible === derniere ? "Reprendre" : "Leçon suivante";
      titre.textContent = cible.titre;
      lien.href = cible.url;
    } else {
      etiquette.textContent = "Parcours terminé";
      titre.textContent = "Réviser les cartes";
      lien.href = "/revisions/";
    }
  });

  document.querySelectorAll<HTMLElement>("[data-progres-global]").forEach((noeud) => {
    const cles: string[] = JSON.parse(noeud.dataset.progresGlobal || "[]");
    noeud.textContent = String(cles.filter((c) => etat.lecons[c]?.validee).length);
  });
  document.querySelectorAll<HTMLElement>("[data-exercices-total]").forEach((noeud) => {
    const ids: string[] = JSON.parse(noeud.dataset.exercicesTotal || "[]");
    noeud.textContent = String(ids.filter((id) => etat.exercices[id]?.statut === "reussi").length);
  });
  const dues = String(cartesDues(etat));
  document.querySelectorAll<HTMLElement>("[data-cartes-dues]").forEach((noeud) => { noeud.textContent = dues; });

  document.querySelectorAll<HTMLElement>("[data-calendrier]").forEach((noeud) => {
    const jours = Math.ceil((Date.parse(noeud.dataset.calendrier!) - Date.now()) / 86_400_000);
    noeud.querySelector("[data-jours]")!.textContent = jours > 0 ? String(jours) : "0";
  });
}

remplir();
progression.surChangement(remplir);
