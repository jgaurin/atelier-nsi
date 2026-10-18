// Côté serveur : le contenu d'une leçon tel qu'on le donne à l'IA (oral, exercices générés).
import { getCollection } from "astro:content";
import { moduleParId } from "../data/modules";

/** Contexte de la leçon : titre, objectifs, points clés et cours, sans les exercices. null si la leçon n'existe pas. */
export async function contexteLecon(cle: string) {
  const [module, slug] = cle.split("/");
  const entree = (await getCollection("lecons")).find((e) => {
    const [m, fichier] = e.id.split("/");
    return m === module && fichier.replace(/^\d+-/, "") === slug;
  });
  if (!entree) return null;
  const cours = (entree.body ?? "")
    .replace(/^::::exercice[\s\S]*?^::::\s*$/gm, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .slice(0, 30_000);
  const d = entree.data;
  return {
    titre: d.titre,
    partie: moduleParId(module)?.partie ?? "",
    texte:
      `LEÇON : ${d.titre}\n${d.resume}\n\nOBJECTIFS :\n${d.objectifs.map((o) => `- ${o}`).join("\n")}\n\n` +
      (d.cartes.length ? `POINTS CLÉS :\n${d.cartes.map((c) => `- ${c.q} → ${c.r}`).join("\n")}\n\n` : "") +
      `COURS :\n${cours}`,
  };
}
