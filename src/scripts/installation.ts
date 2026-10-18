// Appli installable (PWA) : service worker en production, et invitation d'installation gardée pour la page Réglages
// (Chrome la propose une fois par page ; on la garde pour l'offrir au moment où l'on clique sur « Installer l'appli »).

interface InvitationInstallation extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

let invitation: InvitationInstallation | null = null;

export const installee = () =>
  window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
export const installable = () => invitation !== null;

/** Ouvre la fenêtre d'installation du navigateur ; renvoie true si l'appli a été installée. */
export async function installer() {
  if (!invitation) return false;
  const i = invitation;
  invitation = null;
  await i.prompt();
  const { outcome } = await i.userChoice;
  document.dispatchEvent(new CustomEvent("atelier:installation"));
  return outcome === "accepted";
}

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  invitation = e as InvitationInstallation;
  document.dispatchEvent(new CustomEvent("atelier:installation"));
});
window.addEventListener("appinstalled", () => {
  invitation = null;
  document.dispatchEvent(new CustomEvent("atelier:installation"));
});

// Pas en développement : un service worker garderait des copies des pages du serveur local.
if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => { /* le site marche sans */ });
  });
}
