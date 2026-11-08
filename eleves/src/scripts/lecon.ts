// Page de leçon : progression, exercices, code exécutable, schémas, sommaire actif, validation.
import * as progression from "./progression";
import { initialiserExercices, ouvrirExercice } from "./exercices";
import { initialiserCodeExec } from "./code-exec";
import { dessinerSchemas } from "./schemas";
import { annoncer, el } from "./dom";

const article = document.querySelector<HTMLElement>("[data-lecon]");
if (article) {
  const cle = article.dataset.lecon!;
  progression.marquerVue(cle);
  initialiserExercices(article);

  // Exercices repliés : un bouton pour tout déplier (ou tout replier), et le lien #ex-… ouvre l'exercice visé.
  const premier = article.querySelector<HTMLElement>(".bloc-exercices section.exercice");
  if (premier) {
    const tous = () => [...article.querySelectorAll<HTMLElement>(".bloc-exercices section.exercice:not([hidden])")];
    const bouton = el("button", { type: "button", class: "bouton-lien" }, "Tout déplier");
    bouton.addEventListener("click", () => {
      const ouvrir = tous().some((s) => !s.hasAttribute("data-ouvert"));
      tous().forEach((s) => ouvrirExercice(s, ouvrir));
      bouton.textContent = ouvrir ? "Tout replier" : "Tout déplier";
    });
    premier.parentElement!.querySelector(".exercices-intro")?.after(el("div", { class: "exercices-outils" }, bouton));
  }
  window.addEventListener("hashchange", () => {
    const cible = document.getElementById(location.hash.slice(1));
    if (cible?.matches("section.exercice")) ouvrirExercice(cible);
  });
  initialiserCodeExec(article);
  dessinerSchemas(article);

  // Statut écrit à côté des puces d'en-tête.
  const statutTexte = document.querySelector<HTMLElement>(".statut-texte");
  const zone = document.querySelector<HTMLElement>("[data-validation]");
  const boutonValider = zone?.querySelector<HTMLButtonElement>("[data-valider]");
  const titre = zone?.querySelector<HTMLElement>("[data-validation-titre]");

  const majValidation = () => {
    const statut = progression.statutLecon(cle);
    const validee = statut === "validee";
    if (statutTexte) {
      statutTexte.textContent = validee ? "✓ Validé" : "En cours";
      statutTexte.className = `puce statut-texte ${validee ? "puce-vert" : ""}`;
    }
    if (!zone || !boutonValider || !titre) return;
    zone.dataset.validee = validee ? "1" : "0";
    titre.textContent = validee ? "Validé" : "As-tu bien compris ?";
    boutonValider.textContent = validee ? "Annuler la validation" : "Je valide";
    boutonValider.className = validee ? "bouton bouton-second" : "bouton bouton-vert";
  };
  boutonValider?.addEventListener("click", () => {
    const validee = progression.statutLecon(cle) === "validee";
    progression.validerLecon(cle, !validee);
    annoncer(validee ? "Validation annulée." : "Leçon validée.");
    majValidation();
  });
  majValidation();

  // Sommaire : met en évidence la section en cours de lecture.
  const liens = new Map<string, HTMLElement>();
  document.querySelectorAll<HTMLElement>(".sommaire-liste a[data-cible]").forEach((a) => liens.set(a.dataset.cible!, a));
  const titres = [...article.querySelectorAll<HTMLElement>(".contenu h2[id]")];
  if (titres.length && "IntersectionObserver" in window) {
    const visibles = new Set<string>();
    const observateur = new IntersectionObserver((entrees) => {
      for (const e of entrees) {
        if (e.isIntersecting) visibles.add(e.target.id);
        else visibles.delete(e.target.id);
      }
      let actif = titres[0].id;
      for (const t of titres) {
        if (t.getBoundingClientRect().top < window.innerHeight * 0.35) actif = t.id;
      }
      liens.forEach((a, id) => a.classList.toggle("actif", id === actif));
    }, { rootMargin: "0px 0px -60% 0px" });
    titres.forEach((t) => observateur.observe(t));
  }
}
