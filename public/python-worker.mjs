// Exécute du Python dans le navigateur (Pyodide), à l'écart de la page pour ne jamais la bloquer.
// Messages reçus : { type: "run", id, code, tests: [{ label, code }] }
// Messages envoyés : { type: "ready" } | { type: "startup-error", message } | { type: "result", id, result }
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

def _atelier_executer(code, tests_json):
    sortie = io.StringIO()
    ns = {"__name__": "__main__"}
    resultats = []
    erreur = None
    try:
        with contextlib.redirect_stdout(sortie), contextlib.redirect_stderr(sortie):
            exec(compile(code, "<ton-code>", "exec"), ns)
    except BaseException as e:
        erreur = _atelier_erreur(e)
    if erreur is None:
        for test in json.loads(tests_json):
            try:
                with contextlib.redirect_stdout(sortie), contextlib.redirect_stderr(sortie):
                    exec(compile(test["code"], "<test>", "exec"), ns)
                resultats.append({"label": test["label"], "ok": True, "detail": ""})
            except AssertionError:
                resultats.append({"label": test["label"], "ok": False, "detail": _atelier_detail(test["code"], ns)})
            except BaseException as e:
                resultats.append({"label": test["label"], "ok": False, "detail": _atelier_erreur(e)})
    return json.dumps({"tests": resultats, "sortie": sortie.getvalue()[:8000], "erreur": erreur})
`;

let python;
try {
  python = await loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.28.3/full/" });
  python.runPython(EXECUTEUR);
  self.postMessage({ type: "ready" });
} catch (erreur) {
  self.postMessage({ type: "startup-error", message: String(erreur?.message || erreur) });
}

self.onmessage = async ({ data }) => {
  if (!python || data?.type !== "run") return;
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
