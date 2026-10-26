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
  // Navigation : l'objectif imposé par la page (les épreuves relèvent du CAPES), sinon celui choisi ; aucun sur les réglages.
  const actif = location.pathname.startsWith("/reglages") ? null : document.body.dataset.objectifPage || id;
  document.querySelectorAll<HTMLElement>("[data-nav-objectif]").forEach((lien) => {
    if (lien.dataset.navObjectif === actif) lien.setAttribute("aria-current", "page");
    else lien.removeAttribute("aria-current");
  });
}

document.querySelectorAll<HTMLElement>("[data-choisir-objectif]").forEach((bouton) => {
  bouton.addEventListener("click", () => choisirObjectif(bouton.dataset.choisirObjectif as IdObjectif));
});
// Un lien ou un raccourci de l'application peut imposer l'objectif dans l'adresse (?objectif=capes).
const demande = new URLSearchParams(location.search).get("objectif");
if (demande === "contractuel" || demande === "capes") {
  try { localStorage.setItem(CLE, demande); } catch { /* rien */ }
}
// Un lien d'objectif le choisit ; déjà sur la page Parcours, on bascule sans recharger.
document.querySelectorAll<HTMLAnchorElement>("[data-nav-objectif]").forEach((lien) => {
  lien.addEventListener("click", (evenement) => {
    choisirObjectif(lien.dataset.navObjectif as IdObjectif);
    if (location.pathname === "/parcours/") {
      evenement.preventDefault();
      history.replaceState(null, "", lien.getAttribute("href"));
      window.scrollTo({ top: 0 });
    }
  });
});
appliquer();
