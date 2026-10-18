// Exemples de code exécutables dans le cours (```python exec / ```sql exec base=… / ```javascript exec).
// « Exécuter » lance l'exemple ; « Modifier » le transforme en éditeur pour expérimenter.
import { executerPython, pythonEstPret } from "./python";
import { executerSQL } from "./sql";
import { executerJS } from "./javascript";
import { bouton, el, tableHTML } from "./dom";
import type { Editeur } from "./editeur";

export function initialiserCodeExec(racine: ParentNode = document) {
  racine.querySelectorAll<HTMLElement>(".code-exec:not([data-pret])").forEach((bloc) => {
    bloc.dataset.pret = "1";
    const langage = bloc.dataset.lang === "sql" ? "sql" : bloc.dataset.lang === "javascript" ? "javascript" : "python";
    const original = bloc.dataset.code ?? "";
    const base = bloc.dataset.base ?? "";
    const pre = bloc.querySelector("pre")!;
    const sortie = el("div", { class: "resultat", "aria-live": "polite" });
    const executer = bouton("▶ Exécuter", "bouton bouton-petit");
    const modifier = bouton("Modifier", "bouton bouton-petit bouton-discret", "Modifier l'exemple pour expérimenter");
    bloc.prepend(el("div", { class: "code-exec-barre" }, el("span", { class: "langage" }, langage === "python" ? "Python" : langage === "javascript" ? "JavaScript" : `SQL · base ${base}`), modifier, executer));
    bloc.append(sortie);

    let editeur: Editeur | null = null;
    let zoneEditeur: HTMLElement | null = null;

    async function lancer() {
      const code = editeur?.valeur() ?? original;
      executer.disabled = true;
      sortie.replaceChildren(el("p", { class: "note" }, el("span", { class: "chargement" },
        langage === "python" && !pythonEstPret() ? "Chargement de Python… (quelques secondes la première fois)" : "Exécution…")));
      if (langage === "python" || langage === "javascript") {
        const r = langage === "python" ? await executerPython(code) : await executerJS(code);
        const morceaux: Node[] = [];
        if (r.sortie) morceaux.push(el("pre", { class: "resultat-sortie" }, r.sortie));
        if (r.erreur) morceaux.push(el("pre", { class: "resultat-sortie erreur" }, r.erreur));
        if (!morceaux.length) morceaux.push(el("p", { class: "note" }, "Le programme s'est exécuté sans rien afficher."));
        sortie.replaceChildren(...morceaux);
      } else {
        const r = await executerSQL(code, base);
        if (r.erreur) sortie.replaceChildren(el("pre", { class: "resultat-sortie erreur" }, r.erreur));
        else {
          const t = r.tables.at(-1);
          sortie.replaceChildren(t
            ? tableHTML(t.colonnes, t.lignes)
            : el("p", { class: "note" }, `Requête exécutée (${r.modifiees} ligne(s) modifiée(s)).`));
        }
      }
      executer.disabled = false;
    }

    executer.addEventListener("click", lancer);
    modifier.addEventListener("click", async () => {
      if (editeur) {
        editeur = null;
        zoneEditeur?.remove();
        pre.hidden = false;
        modifier.textContent = "Modifier";
        sortie.replaceChildren();
        return;
      }
      zoneEditeur = el("div", { class: "editeur-cm" });
      pre.after(zoneEditeur);
      pre.hidden = true;
      modifier.textContent = "Revenir à l'exemple";
      const { creerEditeur } = await import("./editeur");
      editeur = creerEditeur(zoneEditeur, { texte: original, langage, surExecuter: lancer });
      editeur.focus();
    });
  });
}
