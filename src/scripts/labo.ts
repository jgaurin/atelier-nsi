// Labo : éditeurs Python et SQL libres, brouillons gardés dans le navigateur.
import { creerEditeur, type Editeur } from "./editeur";
import { executerPython } from "./python";
import { executerSQL, schemaBase } from "./sql";
import { el, tableHTML } from "./dom";

const memoire = (cle: string, defaut: string) => { try { return localStorage.getItem(cle) ?? defaut; } catch { return defaut; } };
const garder = (cle: string, valeur: string) => { try { localStorage.setItem(cle, valeur); } catch { /* rien */ } };

const python = document.querySelector<HTMLElement>('[data-labo="python"]');
if (python) {
  const sortie = python.querySelector<HTMLElement>("[data-sortie]")!;
  const bouton = python.querySelector<HTMLButtonElement>("[data-executer]")!;
  let editeur: Editeur;
  const lancer = async () => {
    bouton.disabled = true;
    sortie.replaceChildren(el("p", { class: "note" }, el("span", { class: "chargement" }, "Exécution…")));
    const r = await executerPython(editeur.valeur());
    const morceaux: Node[] = [];
    if (r.sortie) morceaux.push(el("pre", { class: "resultat-sortie" }, r.sortie));
    if (r.erreur) morceaux.push(el("pre", { class: "resultat-sortie erreur" }, r.erreur));
    if (!morceaux.length) morceaux.push(el("p", { class: "note" }, "Le programme s'est exécuté sans rien afficher (utilise print)."));
    sortie.replaceChildren(...morceaux);
    bouton.disabled = false;
  };
  editeur = creerEditeur(python.querySelector("[data-editeur]")!, {
    texte: memoire("atelier-nsi:labo-python", 'def bonjour(nom):\n    return f"Bonjour {nom} !"\n\nprint(bonjour("Ada"))\n'),
    langage: "python",
    surExecuter: lancer,
    surChangement: (t) => garder("atelier-nsi:labo-python", t),
  });
  bouton.addEventListener("click", lancer);
}

const sql = document.querySelector<HTMLElement>('[data-labo="sql"]');
if (sql) {
  const sortie = sql.querySelector<HTMLElement>("[data-sortie]")!;
  const bouton = sql.querySelector<HTMLButtonElement>("[data-executer]")!;
  const choixBase = sql.querySelector<HTMLSelectElement>("[data-base]")!;
  const schema = sql.querySelector<HTMLDetailsElement>("[data-schema]")!;
  let editeur: Editeur;
  const majSchema = async () => {
    schema.querySelector("ul")?.remove();
    if (!schema.open) return;
    const tables = await schemaBase(choixBase.value);
    schema.append(el("ul", {}, ...tables.map((t) => el("li", {}, el("strong", {}, t.table), ` (${t.colonnes.join(", ")})`))));
  };
  const lancer = async () => {
    bouton.disabled = true;
    const r = await executerSQL(editeur.valeur(), choixBase.value);
    if (r.erreur) sortie.replaceChildren(el("pre", { class: "resultat-sortie erreur" }, r.erreur));
    else {
      const t = r.tables.at(-1);
      sortie.replaceChildren(t ? tableHTML(t.colonnes, t.lignes, 200) : el("p", { class: "note" }, `Requête exécutée (${r.modifiees} ligne(s) modifiée(s)).`));
    }
    bouton.disabled = false;
  };
  editeur = creerEditeur(sql.querySelector("[data-editeur]")!, {
    texte: memoire("atelier-nsi:labo-sql", "SELECT nom, prenom, id_classe\nFROM eleve\nORDER BY nom;\n"),
    langage: "sql",
    surExecuter: lancer,
    surChangement: (t) => garder("atelier-nsi:labo-sql", t),
  });
  bouton.addEventListener("click", lancer);
  schema.addEventListener("toggle", majSchema);
  choixBase.addEventListener("change", majSchema);
}
