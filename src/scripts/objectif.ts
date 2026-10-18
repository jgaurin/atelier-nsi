// Objectif de préparation choisi (contractuel ou CAPES) : une préférence de ce navigateur.
// Les boutons [data-choisir-objectif="…"] (accueil, réglages) le changent ; les blocs [data-objectif="…"] s'affichent selon lui.
import { OBJECTIF_PAR_DEFAUT, type IdObjectif } from "../data/objectifs";

const CLE = "atelier-nsi:objectif";

export function objectifCourant(): IdObjectif {
  try {
    const v = localStorage.getItem(CLE);
    if (v === "contractuel" || v === "capes") return v;
  } catch { /* stockage indisponible : objectif par défaut */ }
  return OBJECTIF_PAR_DEFAUT;
}

export function choisirObjectif(id: IdObjectif) {
  try { localStorage.setItem(CLE, id); } catch { /* rien */ }
  appliquer();
  document.dispatchEvent(new CustomEvent("atelier:objectif", { detail: id }));
}

export function appliquer() {
  const id = objectifCourant();
  document.querySelectorAll<HTMLElement>("[data-objectif]").forEach((bloc) => {
    bloc.hidden = bloc.dataset.objectif !== id;
  });
  document.querySelectorAll<HTMLElement>("[data-choisir-objectif]").forEach((bouton) => {
    bouton.setAttribute("aria-checked", String(bouton.dataset.choisirObjectif === id));
  });
}

document.querySelectorAll<HTMLElement>("[data-choisir-objectif]").forEach((bouton) => {
  bouton.addEventListener("click", () => choisirObjectif(bouton.dataset.choisirObjectif as IdObjectif));
});
appliquer();
