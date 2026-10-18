// Page de leçon : progression, exercices, code exécutable, schémas, sommaire actif, validation.
import * as progression from "./progression";
import { initialiserExercices } from "./exercices";
import { initialiserCodeExec } from "./code-exec";
import { dessinerSchemas } from "./schemas";
import { annoncer, bouton, el } from "./dom";
import { objectifCourant } from "./objectif";
import { objectifParId } from "../data/objectifs";

const article = document.querySelector<HTMLElement>("[data-lecon]");
if (article) {
  const cle = article.dataset.lecon!;
  progression.marquerVue(cle);
  initialiserExercices(article);
  initialiserCodeExec(article);
  dessinerSchemas(article);

  // Objectif « contractuel » : dans les modules disciplinaires, les exercices au-delà du niveau visé
  // (approfondissement, type concours) sont repliés, et affichables en un clic.
  const filtrerExercices = () => {
    const exercices = [...article.querySelectorAll<HTMLElement>("section.exercice")];
    article.querySelector(".objectif-exercices")?.remove();
    for (const e of exercices) if (e.dataset.horsObjectif) { e.hidden = false; delete e.dataset.horsObjectif; }
    const objectif = objectifParId(objectifCourant());
    if (!objectif || !exercices.length || article.dataset.partie === "enseigner") return;
    const avances = exercices.filter((e) => Number(e.dataset.niveau) > objectif.niveauMax);
    if (!avances.length) return;
    for (const e of avances) { e.hidden = true; e.dataset.horsObjectif = "1"; }
    const afficher = bouton("Les afficher", "bouton bouton-petit bouton-second");
    const note = el("div", { class: "objectif-exercices" },
      el("p", {}, `Objectif ${objectif.court.toLowerCase()} : ${avances.length} exercice${avances.length > 1 ? "s" : ""} d'approfondissement ou de type concours, facultatif${avances.length > 1 ? "s" : ""} pour toi, ${avances.length > 1 ? "sont repliés" : "est replié"}.`),
      afficher);
    afficher.addEventListener("click", () => {
      for (const e of avances) { e.hidden = false; delete e.dataset.horsObjectif; }
      note.remove();
    });
    exercices[0].before(note);
  };
  filtrerExercices();
  document.addEventListener("atelier:objectif", filtrerExercices);

  // Statut écrit à côté des puces d'en-tête.
  const statutTexte = document.querySelector<HTMLElement>(".statut-texte");
  const zone = document.querySelector<HTMLElement>("[data-validation]");
  const boutonValider = zone?.querySelector<HTMLButtonElement>("[data-valider]");
  const titre = zone?.querySelector<HTMLElement>("[data-validation-titre]");

  const majValidation = () => {
    const statut = progression.statutLecon(cle);
    const validee = statut === "validee";
    if (statutTexte) {
      statutTexte.textContent = validee ? "✓ Leçon validée" : "En cours";
      statutTexte.className = `puce statut-texte ${validee ? "puce-vert" : ""}`;
    }
    if (!zone || !boutonValider || !titre) return;
    zone.dataset.validee = validee ? "1" : "0";
    titre.textContent = validee ? "Leçon validée" : "As-tu bien compris cette leçon ?";
    boutonValider.textContent = validee ? "Annuler la validation" : "Je valide cette leçon";
    boutonValider.className = validee ? "bouton bouton-second" : "bouton bouton-vert";
  };
  boutonValider?.addEventListener("click", () => {
    const validee = progression.statutLecon(cle) === "validee";
    progression.validerLecon(cle, !validee);
    annoncer(validee ? "Validation annulée." : "Leçon validée : ses cartes rejoignent tes révisions.");
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
