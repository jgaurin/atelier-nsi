// Onglets repliables (bloc « S'entraîner avec l'IA ») : un clic ouvre un onglet, un second clic sur le même le replie.
// L'onglet ouvert est retenu pour la visite (sessionStorage), pas d'une visite à l'autre.
const CLE = "atelier-nsi:onglet-ia";

document.querySelectorAll<HTMLElement>("[data-ia-outils]").forEach((bloc) => {
  const onglets = [...bloc.querySelectorAll<HTMLButtonElement>("[data-onglet]")];
  const panneau = (o: HTMLButtonElement) => document.getElementById(o.getAttribute("aria-controls")!)!;

  const montrer = (choisi: HTMLButtonElement | null) => {
    for (const o of onglets) {
      const actif = o === choisi;
      o.setAttribute("aria-selected", String(actif));
      o.tabIndex = actif || (!choisi && o === onglets[0]) ? 0 : -1;
      panneau(o).hidden = !actif;
    }
    bloc.toggleAttribute("data-ouvert", Boolean(choisi));
    try {
      if (choisi) sessionStorage.setItem(CLE, choisi.id.split("-")[1]);
      else sessionStorage.removeItem(CLE);
    } catch { /* rien */ }
  };

  onglets.forEach((o, i) => {
    o.addEventListener("click", () => montrer(o.getAttribute("aria-selected") === "true" ? null : o));
    o.addEventListener("keydown", (e) => {
      const pas = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (!pas) return;
      e.preventDefault();
      const suivant = onglets[(i + pas + onglets.length) % onglets.length];
      suivant.focus();
      montrer(suivant);
    });
  });

  let retenu: string | null = null;
  try { retenu = sessionStorage.getItem(CLE); } catch { /* rien */ }
  montrer(onglets.find((o) => o.id.split("-")[1] === retenu) ?? null);
});
