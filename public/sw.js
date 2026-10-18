// Service worker de l'appli : rend le site installable et garde de quoi travailler hors connexion.
// Règles volontairement étroites :
// - seulement les requêtes GET ; Supabase et les autres sites passent sans être touchés ;
// - pages et fichiers non versionnés : réseau d'abord (toujours la dernière version), copie gardée pour le hors ligne ;
// - fichiers versionnés (/_astro/…, Pyodide v0.28.3) : cache d'abord, ils ne changent jamais.
// Changer VERSION vide les anciennes copies au prochain chargement.
const VERSION = "atelier-nsi-v1";
const PYODIDE = "https://cdn.jsdelivr.net/pyodide/v0.28.3/";

// Si le stockage du navigateur est indisponible, tout passe simplement par le réseau (pas de mode hors ligne).
const ouvrir = () => caches.open(VERSION).catch(() => null);

self.addEventListener("install", (evenement) => {
  evenement.waitUntil(
    ouvrir().then((cache) => cache?.addAll(["/parcours/", "/reglages/", "/revisions/"])).catch(() => {}),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (evenement) => {
  evenement.waitUntil(
    caches.keys()
      .then((noms) => Promise.all(noms.filter((n) => n !== VERSION).map((n) => caches.delete(n))))
      .catch(() => {})
      .then(() => self.clients.claim()),
  );
});

const gardable = (reponse, versionne) =>
  reponse && reponse.status === 200 && !reponse.redirected && (reponse.type === "basic" || (versionne && reponse.type === "cors"));

async function cacheDAbord(requete) {
  const cache = await ouvrir();
  const garde = await cache?.match(requete).catch(() => undefined);
  if (garde) return garde;
  const reponse = await fetch(requete);
  if (cache && gardable(reponse, true)) cache.put(requete, reponse.clone()).catch(() => {});
  return reponse;
}

async function reseauDAbord(requete, page) {
  const cache = await ouvrir();
  try {
    const reponse = await fetch(requete);
    if (cache && gardable(reponse, false)) cache.put(requete, reponse.clone()).catch(() => {});
    return reponse;
  } catch (erreur) {
    const garde = await cache?.match(requete, { ignoreSearch: page }).catch(() => undefined);
    if (garde) return garde;
    // Hors ligne sur une page jamais visitée : on montre le parcours.
    const parcours = page ? await cache?.match("/parcours/").catch(() => undefined) : undefined;
    if (parcours) return parcours;
    throw erreur;
  }
}

self.addEventListener("fetch", (evenement) => {
  const requete = evenement.request;
  if (requete.method !== "GET") return;
  const url = new URL(requete.url);
  if (url.href.startsWith(PYODIDE)) {
    evenement.respondWith(cacheDAbord(requete));
    return;
  }
  if (url.origin !== self.location.origin || requete.headers.has("range")) return;
  if (url.pathname.startsWith("/_astro/")) {
    evenement.respondWith(cacheDAbord(requete));
    return;
  }
  evenement.respondWith(reseauDAbord(requete, requete.mode === "navigate"));
});
