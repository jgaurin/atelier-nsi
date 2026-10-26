// Exécute du Python dans le navigateur (Pyodide), à l'écart de la page pour ne jamais la bloquer.
// Messages reçus : { type: "run", id, code, tests: [{ label, code }] }
// Messages envoyés : { type: "ready" } | { type: "startup-error", message } | { type: "result", id, result }
//                    | { type: "sortie", id, texte } (ce que le programme affiche, au fil de l'exécution)
import { loadPyodide } from "https://cdn.jsdelivr.net/pyodide/v0.28.3/full/pyodide.mjs";

const EXECUTEUR = `
import ast, contextlib, io, json, traceback

def _atelier_erreur(e):
    tb = traceback.extract_tb(e.__traceback__)
    ligne = next((f.lineno for f in reversed(tb) if f.filename == "<ton-code>"), None)
    message = f"{type(e).__name__}: {e}"
    return message + (f"  (ligne {ligne})" if ligne else "")

def _atelier_detail(code, ns):
    """Pour un test « assert a == b », calcule a et b afin d'afficher obtenu / attendu."""
    try:
        arbre = ast.parse(code)
        derniere = arbre.body[-1]
        if isinstance(derniere, ast.Assert) and isinstance(derniere.test, ast.Compare) \\
                and len(derniere.test.ops) == 1 and isinstance(derniere.test.ops[0], ast.Eq):
            obtenu = eval(compile(ast.Expression(derniere.test.left), "<test>", "eval"), ns)
            attendu = eval(compile(ast.Expression(derniere.test.comparators[0]), "<test>", "eval"), ns)
            return f"obtenu : {obtenu!r}\\nattendu : {attendu!r}"
    except BaseException:
        pass
    return ""

class _AtelierFlux(io.TextIOBase):
    """Garde ce que le programme affiche et le transmet aussitôt à la page (utile si le code ne s'arrête jamais)."""
    def __init__(self, tampon):
        self.tampon = tampon
    def write(self, texte):
        self.tampon.write(texte)
        _atelier_js_flux(texte)
        return len(texte)

def _atelier_executer(code, tests_json):
    sortie = io.StringIO()
    flux = _AtelierFlux(sortie)
    ns = {"__name__": "__main__"}
    resultats = []
    erreur = None
    try:
        with contextlib.redirect_stdout(flux), contextlib.redirect_stderr(flux):
            exec(compile(code, "<ton-code>", "exec"), ns)
    except BaseException as e:
        erreur = _atelier_erreur(e)
    if erreur is None:
        for test in json.loads(tests_json):
            try:
                with contextlib.redirect_stdout(flux), contextlib.redirect_stderr(flux):
                    exec(compile(test["code"], "<test>", "exec"), ns)
                resultats.append({"label": test["label"], "ok": True, "detail": ""})
            except AssertionError:
                resultats.append({"label": test["label"], "ok": False, "detail": _atelier_detail(test["code"], ns)})
            except BaseException as e:
                resultats.append({"label": test["label"], "ok": False, "detail": _atelier_erreur(e)})
    texte = sortie.getvalue()
    if len(texte) > 8000:
        texte = texte[:8000] + "\\n… (affichage arrêté : trop de lignes)"
    return json.dumps({"tests": resultats, "sortie": texte, "erreur": erreur})
`;

// Sortie transmise en direct pour l'exécution en cours, plafonnée pour qu'une boucle de print ne sature pas la page.
const MAX_FLUX = 20000;
let idCourant = 0;
let envoye = 0;
function flux(texte) {
  if (envoye >= MAX_FLUX) return;
  let morceau = String(texte).slice(0, MAX_FLUX - envoye);
  envoye += morceau.length;
  if (envoye >= MAX_FLUX) morceau += "\n… (affichage arrêté : trop de lignes)";
  self.postMessage({ type: "sortie", id: idCourant, texte: morceau });
}

let python;
try {
  python = await loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.28.3/full/" });
  python.globals.set("_atelier_js_flux", flux);
  python.runPython(EXECUTEUR);
  self.postMessage({ type: "ready" });
} catch (erreur) {
  self.postMessage({ type: "startup-error", message: String(erreur?.message || erreur) });
}

self.onmessage = async ({ data }) => {
  if (!python || data?.type !== "run") return;
  idCourant = data.id;
  envoye = 0;
  try {
    // Charge à la demande les modules non inclus par défaut (sqlite3, numpy…) d'après les « import » du code.
    const sources = [data.code, ...(data.tests || []).map((t) => t.code)].join("\n");
    await python.loadPackagesFromImports(sources);
    const executer = python.globals.get("_atelier_executer");
    const json = executer(data.code, JSON.stringify(data.tests || []));
    executer.destroy();
    self.postMessage({ type: "result", id: data.id, result: JSON.parse(json) });
  } catch (erreur) {
    self.postMessage({ type: "result", id: data.id, result: { tests: [], sortie: "", erreur: String(erreur?.message || erreur) } });
  }
};
