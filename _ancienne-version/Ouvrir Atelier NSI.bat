@echo off
setlocal
cd /d "%~dp0"
where node.exe >nul 2>&1
if errorlevel 1 (
  echo Node.js est introuvable. Installe Node.js puis relance ce fichier.
  pause
  exit /b 1
)
start "Atelier NSI - serveur local (fermer pour arreter)" /D "%~dp0" node.exe serve.mjs
for /L %%i in (1,1,20) do (
  powershell.exe -NoProfile -Command "try { $r = Invoke-WebRequest -Uri 'http://127.0.0.1:4173/' -TimeoutSec 2 -UseBasicParsing; if ($r.StatusCode -eq 200) { exit 0 } } catch {}; exit 1" >nul 2>&1
  if not errorlevel 1 goto ready
  timeout /t 1 /nobreak >nul
)
echo Le serveur local n'a pas demarre. Verifie la fenetre du serveur.
pause
exit /b 1
:ready
start "" "http://localhost:4173/"