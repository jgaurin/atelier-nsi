// Transforme le Markdown des leçons en HTML structuré pour l'Atelier.
//
// Ce que le plugin comprend (voir docs/rediger-une-lecon.md) :
//   :::definition / :::retenir / :::attention / :::methode / :::exemple / :::remarque / :::prof
//   :::question[Question ?] ... :::          → question de compréhension repliable
//   ::::exercice[Titre]{#id niveau=2} ... ::::  → exercice (QCM, Python, SQL ou rédaction)
//   ```mermaid legende="..."                  → schéma dessiné dans la page
//   ```python exec   /   ```sql exec base=lycee   /   ```javascript exec → code exécutable dans la page
// et il range la page en blocs : intro, cours, exemple guidé, l'essentiel, exercices.
import { visit, SKIP } from "unist-util-visit";
import { toString } from "mdast-util-to-string";
import { analyserExercice, analyserQuestion, decouperTests, lireMeta, NIVEAUX, TYPES } from "./exercices.mjs";

const ENCADRES = {
  definition: "Définition",
  retenir: "À retenir",
  attention: "Attention",
  methode: "Méthode",
  exemple: "Exemple",
  remarque: "Remarque",
  prof: "Côté enseignant",
};

const bloc = (hName, hProperties, children = []) => ({ type: "atelierBloc", data: { hName, hProperties }, children });
const texte = (value) => ({ type: "text", value });

/** Préfixe des identifiants d'exercices sans #id explicite : « module-lecon » ou « sujet-nom ». */
function prefixeExercices(chemin) {
  const morceaux = String(chemin || "").replace(/\\/g, "/").split("/");
  const fichier = (morceaux.at(-1) || "").replace(/\.md$/, "").replace(/^\d+-/, "");
  const i = morceaux.lastIndexOf("lecons");
  if (i >= 0 && i + 2 < morceaux.length) return `${morceaux[i + 1]}-${fichier}`;
  if (morceaux.includes("sujets")) return `sujet-${fichier}`;
  return fichier || "ex";
}

function transformerExercice(noeud, numero, prefixe) {
  const ex = analyserExercice(noeud);
  const id = ex.id || `${prefixe || "ex"}-${numero}`;
  const enfants = [
    bloc("header", { className: ["exercice-tete"] }, [
      bloc("span", { className: ["exercice-numero"] }, [texte(`Exercice ${numero}`)]),
      bloc("span", { className: ["niveau", `niveau-${ex.niveau}`] }, [texte(`Niveau ${ex.niveau} · ${NIVEAUX[ex.niveau] || ""}`)]),
      bloc("span", { className: ["exercice-type"] }, [texte(TYPES[ex.type] || ex.type)]),
      ...(ex.duree ? [bloc("span", { className: ["exercice-duree"] }, [texte(`≈ ${ex.duree} min`)])] : []),
    ]),
    bloc("h3", { className: ["exercice-titre"] }, ex.titre.length ? ex.titre : [texte(`Exercice ${numero}`)]),
    bloc("div", { className: ["exercice-enonce"] }, ex.enonce),
  ];

  if (ex.type === "quiz" && ex.questions) {
    enfants.push(bloc("ol", { className: ["quiz"] }, ex.questions.children.map((item) => {
      const q = analyserQuestion(item);
      const options = (q.options?.children ?? []).map((li) => {
        const ok = li.checked ? "1" : "0";
        li.checked = null;
        return bloc("li", { "data-ok": ok }, li.children);
      });
      return bloc("li", { className: ["quiz-question"] }, [
        bloc("div", { className: ["quiz-enonce"] }, q.enonce),
        bloc("ul", { className: ["quiz-options"] }, options),
        ...(q.explication ? [bloc("div", { className: ["quiz-explication"], hidden: true }, q.explication.children)] : []),
      ]);
    })));
  } else if (ex.type === "qcm" && ex.options) {
    const bonnes = ex.options.children.filter((li) => li.checked).length;
    ex.options.data = { hName: "ol", hProperties: { className: ["qcm"], "data-multiple": bonnes > 1 ? "1" : "0" } };
    for (const li of ex.options.children) {
      li.data = { hProperties: { "data-ok": li.checked ? "1" : "0" } };
      li.checked = null;
    }
    enfants.push(ex.options);
  } else if (ex.type === "python") {
    enfants.push(bloc("div", {
      className: ["editeur", "editeur-python"],
      "data-depart": ex.depart?.value ?? "",
      "data-tests": JSON.stringify(ex.tests ? decouperTests(ex.tests.value) : []),
    }));
  } else if (ex.type === "sql") {
    const solution = ex.solution?.value ?? "";
    enfants.push(bloc("div", {
      className: ["editeur", "editeur-sql"],
      "data-base": ex.base,
      "data-depart": ex.depart?.value ?? "",
      "data-solution": solution,
      "data-ordre": /\border\s+by\b/i.test(solution) ? "1" : "0",
    }));
  } else {
    enfants.push(bloc("div", { className: ["zone-reponse"] }));
  }
  enfants.push(bloc("div", { className: ["exercice-actions"] }));

  ex.indices.forEach((indice, i) => {
    enfants.push(bloc("div", { className: ["exercice-indice"], hidden: true, "data-indice": String(i + 1) }, [
      bloc("p", { className: ["indice-titre"] }, [texte(ex.indices.length > 1 ? `Indice ${i + 1}` : "Indice")]),
      ...indice.children,
    ]));
  });
  if (ex.criteres) {
    enfants.push(bloc("div", { className: ["exercice-criteres"], hidden: true }, [
      bloc("p", { className: ["criteres-titre"] }, [texte("Critères de réussite")]),
      ...ex.criteres.children,
    ]));
  }
  if (ex.corrige) {
    enfants.push(bloc("div", { className: ["exercice-corrige"], hidden: true }, [
      bloc("p", { className: ["corrige-titre"] }, [texte("Corrigé")]),
      ...ex.corrige.children,
    ]));
  }

  const section = bloc("section", {
    className: ["exercice", `exercice-${ex.type}`],
    id: `ex-${id}`,
    "data-exercice": id,
    "data-type": ex.type,
    "data-niveau": String(ex.niveau),
  }, enfants);
  return { section, resume: { id, titre: ex.titreTexte || `Exercice ${numero}`, niveau: ex.niveau, type: ex.type } };
}

function figureMermaid(code, legende) {
  const enfants = [bloc("pre", { className: ["mermaid"] }, [texte(code)])];
  if (legende) enfants.push(bloc("figcaption", {}, [texte(legende)]));
  return bloc("figure", { className: ["diagramme"] }, enfants);
}

function nomDeBloc(titre) {
  const t = titre.trim().toLowerCase().replace(/’/g, "'");
  if (t.startsWith("exercices")) return "exercices";
  if (t.startsWith("l'essentiel")) return "essentiel";
  if (t.startsWith("exemple guidé")) return "exemple";
  return "cours";
}

export default function remarkAtelier() {
  return (arbre, fichier) => {
    const prefixe = prefixeExercices(fichier.path);
    const exercices = [];

    // 1. Exercices (avant tout le reste : leurs blocs de code ont un rôle particulier).
    let numero = 0;
    visit(arbre, "containerDirective", (noeud, index, parent) => {
      if (noeud.name !== "exercice" || !parent || index == null) return;
      numero += 1;
      const { section, resume } = transformerExercice(noeud, numero, prefixe);
      parent.children[index] = section;
      exercices.push(resume);
      return [SKIP, index + 1];
    });

    // 2. Schémas et code exécutable.
    visit(arbre, "code", (noeud, index, parent) => {
      if (!parent || index == null) return;
      const meta = lireMeta(noeud.meta);
      if (noeud.lang === "mermaid") {
        parent.children[index] = figureMermaid(noeud.value, meta.valeurs.legende);
        return [SKIP, index + 1];
      }
      if (meta.drapeaux.has("exec") && ["python", "sql", "javascript"].includes(noeud.lang)) {
        noeud.meta = null;
        parent.children[index] = bloc("div", {
          className: ["code-exec"],
          "data-lang": noeud.lang,
          "data-code": noeud.value,
          "data-base": meta.valeurs.base || "",
        }, [noeud]);
        return [SKIP, index + 1];
      }
      if (meta.drapeaux.has("solution") || meta.drapeaux.has("depart")) noeud.meta = null;
    });

    // 3. Encadrés et questions de compréhension.
    visit(arbre, "containerDirective", (noeud) => {
      const etiquette = noeud.children[0]?.type === "paragraph" && noeud.children[0].data?.directiveLabel
        ? noeud.children.shift().children
        : null;
      if (ENCADRES[noeud.name]) {
        noeud.data = { hName: "aside", hProperties: { className: ["encadre", `encadre-${noeud.name}`] } };
        noeud.children.unshift(bloc("p", { className: ["encadre-titre"] }, etiquette || [texte(ENCADRES[noeud.name])]));
      } else if (noeud.name === "question") {
        noeud.data = { hName: "details", hProperties: { className: ["question"] } };
        const corps = noeud.children.splice(0);
        noeud.children.push(
          bloc("summary", {}, [bloc("span", { className: ["question-marque"] }, [texte("Question")]), ...(etiquette || [texte("À toi")])]),
          bloc("div", { className: ["question-reponse"] }, corps),
        );
      } else {
        noeud.data = { hName: "div", hProperties: { className: [`bloc-${noeud.name}`] } };
        if (etiquette) noeud.children.unshift(bloc("p", { className: ["bloc-titre"] }, etiquette));
      }
    });

    // 4. Un « :mot » écrit par mégarde dans le texte n'est pas une directive : on le remet tel quel.
    visit(arbre, ["textDirective", "leafDirective"], (noeud, index, parent) => {
      if (!parent || index == null) return;
      const prefixeDirective = noeud.type === "leafDirective" ? "::" : ":";
      const contenu = noeud.children?.length ? `[${toString(noeud)}]` : "";
      parent.children[index] = texte(`${prefixeDirective}${noeud.name}${contenu}`);
    });

    // 5. Rangement de la page en blocs (titres de niveau 2).
    const racine = [];
    let courant = bloc("section", { className: ["bloc", "bloc-intro"] });
    for (const noeud of arbre.children) {
      if (noeud.type === "heading" && noeud.depth === 2) {
        if (courant.children.length) racine.push(courant);
        const nom = nomDeBloc(toString(noeud));
        courant = bloc("section", { className: ["bloc", `bloc-${nom}`] }, [noeud]);
        if (nom === "exercices") {
          courant.children.push(bloc("p", { className: ["exercices-intro"] }, [texte(
            "Du plus simple au niveau concours. Cherche vraiment avant d'ouvrir le corrigé : un indice d'abord, " +
            "le corrigé ensuite. Les exercices Python et SQL se corrigent tout seuls ; pour les autres, compare ta réponse aux critères.",
          )]));
        }
      } else {
        courant.children.push(noeud);
      }
    }
    if (courant.children.length) racine.push(courant);
    arbre.children = racine;

    if (fichier.data?.astro?.frontmatter) fichier.data.astro.frontmatter.exercices = exercices;
  };
}
