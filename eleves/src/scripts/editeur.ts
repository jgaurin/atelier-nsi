// Éditeur de code (CodeMirror 6) : coloration, indentation de 4 espaces, Ctrl+Entrée pour exécuter.
// Chargé seulement sur les pages qui en ont besoin.
import { EditorView, basicSetup } from "codemirror";
import { keymap } from "@codemirror/view";
import { Prec } from "@codemirror/state";
import { indentWithTab } from "@codemirror/commands";
import { HighlightStyle, indentUnit, syntaxHighlighting } from "@codemirror/language";
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import { sql, SQLite } from "@codemirror/lang-sql";
import { tags as t } from "@lezer/highlight";

export interface Editeur {
  valeur(): string;
  definir(texte: string): void;
  focus(): void;
}

const couleurs = HighlightStyle.define([
  { tag: [t.keyword, t.controlKeyword, t.operatorKeyword, t.definitionKeyword, t.moduleKeyword], color: "var(--cm-mot-cle)", fontWeight: "600" },
  { tag: [t.string, t.special(t.string)], color: "var(--cm-chaine)" },
  { tag: [t.comment, t.lineComment, t.blockComment], color: "var(--cm-commentaire)", fontStyle: "italic" },
  { tag: [t.number, t.bool, t.null, t.atom], color: "var(--cm-nombre)" },
  { tag: [t.function(t.variableName), t.function(t.propertyName)], color: "var(--cm-fonction)" },
  { tag: [t.definition(t.variableName), t.definition(t.function(t.variableName))], color: "var(--cm-definition)" },
  { tag: [t.className, t.typeName, t.standard(t.variableName)], color: "var(--cm-classe)" },
  { tag: [t.operator, t.compareOperator, t.arithmeticOperator], color: "var(--cm-operateur)" },
  { tag: t.self, color: "var(--cm-mot-cle)", fontStyle: "italic" },
]);

export function creerEditeur(
  parent: HTMLElement,
  options: { texte: string; langage: "python" | "sql" | "javascript"; surExecuter?: () => void; surChangement?: (texte: string) => void },
): Editeur {
  const executer = options.surExecuter;
  const vue = new EditorView({
    parent,
    doc: options.texte,
    extensions: [
      syntaxHighlighting(couleurs),
      basicSetup,
      indentUnit.of("    "),
      options.langage === "python" ? python() : options.langage === "javascript" ? javascript() : sql({ dialect: SQLite, upperCaseKeywords: true }),
      Prec.highest(keymap.of([
        { key: "Mod-Enter", run: () => { executer?.(); return true; } },
        { key: "Shift-Enter", run: () => { executer?.(); return true; } },
      ])),
      keymap.of([indentWithTab]),
      EditorView.updateListener.of((maj) => {
        if (maj.docChanged) options.surChangement?.(maj.state.doc.toString());
      }),
      EditorView.contentAttributes.of({ "aria-label": options.langage === "python" ? "Éditeur de code Python" : options.langage === "javascript" ? "Éditeur de code JavaScript" : "Éditeur de requête SQL", spellcheck: "false" }),
    ],
  });
  return {
    valeur: () => vue.state.doc.toString(),
    definir: (texte) => vue.dispatch({ changes: { from: 0, to: vue.state.doc.length, insert: texte } }),
    focus: () => vue.focus(),
  };
}
