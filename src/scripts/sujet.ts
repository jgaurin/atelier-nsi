// Page d'un sujet d'épreuve : exercices, schémas, code, et chronomètre persistant.
import * as progression from "./progression";
import { initialiserExercices } from "./exercices";
import { initialiserCodeExec } from "./code-exec";
import { dessinerSchemas } from "./schemas";

initialiserExercices();
initialiserCodeExec();
dessinerSchemas();

const zone = document.querySelector<HTMLElement>("[data-chrono]");
if (zone) {
  const id = zone.dataset.chrono!;
  const duree = Number(zone.dataset.duree);
  const affichage = zone.querySelector<HTMLElement>("[data-temps]")!;
  const reste = zone.querySelector<HTMLElement>("[data-reste]")!;
  const basculer = zone.querySelector<HTMLButtonElement>('[data-chrono-action="basculer"]')!;
  const remettre = zone.querySelector<HTMLButtonElement>('[data-chrono-action="remettre"]')!;
  const format = (s: number) => {
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = Math.floor(s % 60);
    return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };
  const ecoule = () => {
    const c = progression.chrono(id);
    return c.ecoule + (c.enCours ? (Date.now() - c.debut) / 1000 : 0);
  };
  const afficher = () => {
    const c = progression.chrono(id);
    const e = ecoule();
    affichage.textContent = format(e);
    basculer.textContent = c.enCours ? "Pause" : e > 0 ? "Reprendre" : "Démarrer";
    reste.textContent = e >= duree ? "Temps écoulé : termine ta phrase et passe à la correction." : `Reste ${format(duree - e)}`;
  };
  basculer.addEventListener("click", () => {
    const c = progression.chrono(id);
    progression.majChrono(id, c.enCours
      ? { debut: 0, ecoule: ecoule(), enCours: false }
      : { debut: Date.now(), ecoule: c.ecoule, enCours: true });
    afficher();
  });
  remettre.addEventListener("click", () => {
    if (!confirm("Remettre le chronomètre à zéro ?")) return;
    progression.majChrono(id, { debut: 0, ecoule: 0, enCours: false });
    afficher();
  });
  afficher();
  setInterval(afficher, 1000);
}
