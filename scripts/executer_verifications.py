"""Exécute les vérifications préparées par verifier.mjs.

Entrée (stdin) : liste JSON de tâches
  {"id", "nature": "python"|"exemple"|"sql"|"sql-exemple", "code", "tests": [...], "base": "<script SQL>", "erreur_attendue": bool}
Sortie (stdout) : liste JSON {"id", "ok": bool, "message": str}
"""
import contextlib
import io
import json
import sqlite3
import sys


def executer_python(tache):
    espace = {"__name__": "__main__"}
    sortie = io.StringIO()
    try:
        with contextlib.redirect_stdout(sortie), contextlib.redirect_stderr(sortie):
            exec(compile(tache["code"], "<solution>", "exec"), espace)
    except BaseException as e:  # noqa: BLE001
        if tache.get("erreur_attendue"):
            return True, ""
        return False, f"le code lève {type(e).__name__}: {e}"
    if tache.get("erreur_attendue"):
        return False, "l'exemple devait lever une erreur mais s'exécute sans erreur"
    echecs = []
    for test in tache.get("tests", []):
        try:
            with contextlib.redirect_stdout(sortie), contextlib.redirect_stderr(sortie):
                exec(compile(test["code"], "<test>", "exec"), espace)
        except AssertionError:
            echecs.append(f"test échoué : {test['label']}")
        except BaseException as e:  # noqa: BLE001
            echecs.append(f"test « {test['label']} » : {type(e).__name__}: {e}")
    return (not echecs), " ; ".join(echecs)


def executer_sql(tache):
    connexion = sqlite3.connect(":memory:")
    try:
        connexion.execute("PRAGMA foreign_keys = ON")
        if tache.get("base"):
            connexion.executescript(tache["base"])
        code = tache["code"].strip()
        if tache["nature"] == "sql-exemple":
            if tache.get("erreur_attendue"):
                try:
                    connexion.executescript(code)
                except sqlite3.Error:
                    return True, ""
                return False, "l'exemple devait provoquer une erreur SQL"
            connexion.executescript(code)
            return True, ""
        instructions = [i for i in code.split(";") if i.strip()]
        if len(instructions) > 1:
            connexion.executescript(";".join(instructions[:-1]) + ";")
        lignes = connexion.execute(instructions[-1]).fetchall()
        if not lignes:
            return False, "la requête de solution ne renvoie aucune ligne (exercice peu parlant ?)"
        return True, ""
    except sqlite3.Error as e:
        return False, f"erreur SQL : {e}"
    finally:
        connexion.close()


def main():
    taches = json.loads(sys.stdin.buffer.read().decode("utf-8"))
    resultats = []
    for tache in taches:
        if tache["nature"] in ("python", "exemple"):
            ok, message = executer_python(tache)
        else:
            ok, message = executer_sql(tache)
        resultats.append({"id": tache["id"], "ok": ok, "message": message})
    sys.stdout.buffer.write(json.dumps(resultats, ensure_ascii=False).encode("utf-8"))


if __name__ == "__main__":
    main()
