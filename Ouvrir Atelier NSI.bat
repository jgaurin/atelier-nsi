@echo off
setlocal
cd /d "%~dp0"
title Atelier NSI

where node.exe >nul 2>&1
if errorlevel 1 (
  echo Node.js est introuvable. Installe Node.js ^(version 22.18 ou plus^) depuis https://nodejs.org puis relance ce fichier.
  pause
  exit /b 1
)

if not exist "node_modules\" (
  echo Premiere ouverture : installation des dependances ^(une minute environ^)...
  call npm install
  if errorlevel 1 (
    echo L'installation a echoue. Verifie ta connexion internet puis relance ce fichier.
    pause
    exit /b 1
  )
)

echo Demarrage du serveur local...
start "Atelier NSI - serveur local (fermer cette fenetre pour arreter)" /D "%~dp0" cmd /c "npm run dev -- --port 4321"

for /L %%i in (1,1,60) do (
  powershell.exe -NoProfile -Command "try { $r = Invoke-WebRequest -Uri 'http://localhost:4321/' -TimeoutSec 2 -UseBasicParsing; if ($r.StatusCode -eq 200) { exit 0 } } catch {}; exit 1" >nul 2>&1
  if not errorlevel 1 goto pret
  timeout /t 1 /nobreak >nul
)
echo Le serveur local n'a pas demarre. Regarde la fenetre du serveur pour comprendre pourquoi.
pause
exit /b 1

:pret
start "" "http://localhost:4321/"
