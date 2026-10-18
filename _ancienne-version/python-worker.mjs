import { loadPyodide } from "https://cdn.jsdelivr.net/pyodide/v314.0.7/full/pyodide.mjs";

let runtime;
try {
  runtime = await loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v314.0.7/full/" });
  self.postMessage({ type: "ready", python: "3.14" });
} catch (error) {
  self.postMessage({ type: "startup-error", message: String(error?.message || error) });
}

self.onmessage = async ({ data }) => {
  if (!runtime || data?.type !== "run") return;
  try {
    runtime.globals.set("__atelier_code", data.code);
    runtime.globals.set("__atelier_tests_json", JSON.stringify(data.tests));
    const json = await runtime.runPythonAsync(`
import contextlib, io, json, traceback

__atelier_output = io.StringIO()
__atelier_namespace = {"__name__": "__main__"}
__atelier_results = []
__atelier_runtime_error = None
try:
    with contextlib.redirect_stdout(__atelier_output), contextlib.redirect_stderr(__atelier_output):
        exec(compile(__atelier_code, "<ton-code>", "exec"), __atelier_namespace, __atelier_namespace)
except BaseException as __atelier_error:
    __atelier_runtime_error = f"{type(__atelier_error).__name__}: {__atelier_error}"

if __atelier_runtime_error is None:
    for __atelier_test in json.loads(__atelier_tests_json):
        try:
            with contextlib.redirect_stdout(__atelier_output), contextlib.redirect_stderr(__atelier_output):
                exec(compile(__atelier_test["code"], "<test>", "exec"), __atelier_namespace, __atelier_namespace)
            __atelier_results.append({"label": __atelier_test["label"], "passed": True, "error": ""})
        except AssertionError as __atelier_error:
            __atelier_results.append({"label": __atelier_test["label"], "passed": False, "error": str(__atelier_error) or "Le résultat ne correspond pas à la valeur attendue."})
        except BaseException as __atelier_error:
            __atelier_results.append({"label": __atelier_test["label"], "passed": False, "error": f"{type(__atelier_error).__name__}: {__atelier_error}"})

json.dumps({"tests": __atelier_results, "output": __atelier_output.getvalue()[:6000], "runtimeError": __atelier_runtime_error})
`);
    runtime.globals.delete("__atelier_code");
    runtime.globals.delete("__atelier_tests_json");
    self.postMessage({ type: "result", id: data.id, result: JSON.parse(json) });
  } catch (error) {
    self.postMessage({ type: "runner-error", id: data.id, message: String(error?.message || error) });
  }
};
