@echo off
title NSI Lycee
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo Node.js n'est pas installe sur cet ordinateur.
  echo Installe la version LTS depuis https://nodejs.org puis relance ce fichier.
  echo.
  pause
  exit /b 1
)

if not exist "node_modules\" (
  echo Premiere utilisation : installation du site. Il faut Internet, cela prend une a deux minutes.
  call npm ci
  if errorlevel 1 (
    echo.
    echo L'installation a echoue. Verifie ta connexion Internet, puis relance ce fichier.
    pause
    exit /b 1
  )
)

echo Preparation du site, environ 30 secondes...
call npm run build
if errorlevel 1 (
  echo.
  echo La preparation du site a echoue.
  pause
  exit /b 1
)

echo.
echo Le site va s'ouvrir dans ton navigateur : http://localhost:4322
echo Pour l'arreter, ferme cette fenetre.
echo.
call npx astro preview --port 4322 --open
pause
