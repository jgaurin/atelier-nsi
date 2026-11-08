// Exécute du SQL dans le navigateur avec sql.js (SQLite compilé en WebAssembly).
// Chaque exécution part d'une base neuve, chargée depuis public/bases/<nom>.sql.
import urlWasm from "sql.js/dist/sql-wasm.wasm?url";

export interface TableResultat { colonnes: string[]; lignes: unknown[][] }
export interface ResultatSQL { tables: TableResultat[]; erreur: string | null; modifiees: number }

type Moteur = { Database: new () => BaseSQL };
type BaseSQL = {
  exec(sql: string): { columns: string[]; values: unknown[][] }[];
  getRowsModified(): number;
  close(): void;
};

let moteur: Promise<Moteur> | null = null;
const scripts = new Map<string, Promise<string>>();

function chargerMoteur(): Promise<Moteur> {
  moteur ??= import("sql.js").then(({ default: init }) => init({ locateFile: () => urlWasm }) as Promise<Moteur>);
  return moteur;
}

function scriptBase(nom: string): Promise<string> {
  if (!scripts.has(nom)) {
    scripts.set(nom, fetch(`/bases/${nom}.sql`).then((r) => {
      if (!r.ok) throw new Error(`La base « ${nom} » est introuvable.`);
      return r.text();
    }));
  }
  return scripts.get(nom)!;
}

export function traduireErreur(message: string): string {
  const regles: [RegExp, (m: RegExpMatchArray) => string][] = [
    [/no such table: (\S+)/, (m) => `La table « ${m[1]} » n'existe pas dans cette base. Regarde le schéma.`],
    [/no such column: (\S+)/, (m) => `La colonne « ${m[1]} » n'existe pas (faute de frappe ? table oubliée dans FROM ?).`],
    [/ambiguous column name: (\S+)/, (m) => `La colonne « ${m[1]} » existe dans plusieurs tables : précise laquelle (table.${m[1]}).`],
    [/near "(.+?)": syntax error/, (m) => `Erreur de syntaxe près de « ${m[1]} ».`],
    [/incomplete input/, () => "La requête est incomplète (une parenthèse ou une apostrophe non fermée ?)."],
    [/misuse of aggregate/, () => "Fonction d'agrégat mal placée : un agrégat ne peut pas être dans WHERE (utilise HAVING)."],
    [/UNIQUE constraint failed: (\S+)/, (m) => `Contrainte d'unicité violée sur ${m[1]} : cette valeur existe déjà.`],
    [/FOREIGN KEY constraint failed/, () => "Contrainte de clé étrangère violée : la ligne référencée n'existe pas."],
    [/NOT NULL constraint failed: (\S+)/, (m) => `La colonne ${m[1]} ne peut pas rester vide (NOT NULL).`],
  ];
  for (const [motif, traduction] of regles) {
    const m = message.match(motif);
    if (m) return `${traduction(m)}\n(message de SQLite : ${message})`;
  }
  return message;
}

export async function executerSQL(requete: string, base: string): Promise<ResultatSQL> {
  try {
    const SQL = await chargerMoteur();
    const db = new SQL.Database();
    try {
      if (base) db.exec("PRAGMA foreign_keys = ON;\n" + (await scriptBase(base)));
      const sortie = db.exec(requete);
      return {
        tables: sortie.map((t) => ({ colonnes: t.columns, lignes: t.values })),
        erreur: null,
        modifiees: db.getRowsModified(),
      };
    } finally {
      db.close();
    }
  } catch (e) {
    return { tables: [], erreur: traduireErreur(String((e as Error).message || e)), modifiees: 0 };
  }
}

export async function schemaBase(base: string): Promise<{ table: string; colonnes: string[] }[]> {
  const r = await executerSQL(
    "SELECT m.name, group_concat(p.name || ' ' || p.type || CASE WHEN p.pk THEN ' (clé)' ELSE '' END, ', ') " +
    "FROM sqlite_master m JOIN pragma_table_info(m.name) p WHERE m.type = 'table' GROUP BY m.name ORDER BY m.name;",
    base,
  );
  return (r.tables[0]?.lignes ?? []).map(([table, colonnes]) => ({ table: String(table), colonnes: String(colonnes).split(", ") }));
}

function normaliser(v: unknown): string {
  if (typeof v === "number") return Number.isInteger(v) ? String(v) : v.toFixed(6);
  if (v === null || v === undefined) return "NULL";
  return String(v);
}

/** Compare deux résultats ; l'ordre des lignes ne compte que si la solution trie (ORDER BY). */
export function comparer(obtenu: TableResultat | undefined, attendu: TableResultat | undefined, ordreCompte: boolean) {
  const lignesA = (attendu?.lignes ?? []).map((l) => l.map(normaliser).join("\u0001"));
  const lignesO = (obtenu?.lignes ?? []).map((l) => l.map(normaliser).join("\u0001"));
  const colA = attendu?.colonnes.length ?? 0;
  const colO = obtenu?.colonnes.length ?? 0;
  if (colA !== colO) return { egal: false, raison: `Ton résultat a ${colO} colonne(s), on en attend ${colA}.` };
  if (lignesA.length !== lignesO.length) return { egal: false, raison: `Ton résultat a ${lignesO.length} ligne(s), on en attend ${lignesA.length}.` };
  const a = ordreCompte ? lignesA : [...lignesA].sort();
  const o = ordreCompte ? lignesO : [...lignesO].sort();
  const i = a.findIndex((l, k) => l !== o[k]);
  if (i === -1) return { egal: true, raison: "" };
  if (ordreCompte && [...lignesA].sort().join() === [...lignesO].sort().join()) {
    return { egal: false, raison: "Les bonnes lignes sont là, mais pas dans l'ordre demandé." };
  }
  return { egal: false, raison: "Le nombre de lignes est bon, mais certaines valeurs diffèrent." };
}
