// Point d'entrée unique de la correction des exercices.
//
// Aujourd'hui :
//   - QCM, Python et SQL sont corrigés automatiquement (dans exercices.ts) ;
//   - une rédaction (preuve, trace, analyse…) est auto-évaluée : on montre le corrigé
//     et les critères de réussite, et l'apprenant se positionne.
//
// Plus tard (voir docs/correction-ia.md) : une rédaction pourra être envoyée à un correcteur IA
// côté serveur (Claude Haiku), qui reçoit l'énoncé, la réponse, le corrigé et les critères.
// Il suffira d'activer PUBLIC_CORRECTION_IA et d'ajouter la route /api/corriger : l'interface
// ci-dessous ne changera pas.

export interface DemandeCorrection {
  exercice: string;
  type: "qcm" | "python" | "sql" | "redaction";
  enonce: string;
  reponse: string;
  corrige: string;
  criteres: string[];
}

export interface Correction {
  /** « a-evaluer » : c'est l'apprenant qui juge avec le corrigé et les critères. */
  verdict: "juste" | "partiel" | "faux" | "a-evaluer";
  /** Retours à afficher, dans l'ordre. */
  messages: string[];
  /** Critères vérifiés un par un (correction IA) : true = atteint. */
  criteres?: { texte: string; atteint: boolean }[];
  source: "auto-evaluation" | "ia";
}

export interface Correcteur {
  nom: string;
  disponible(): boolean;
  corriger(demande: DemandeCorrection): Promise<Correction>;
}

/** Correction actuelle des rédactions : l'apprenant compare sa réponse au corrigé. */
export const autoEvaluation: Correcteur = {
  nom: "Auto-évaluation",
  disponible: () => true,
  async corriger(demande) {
    return {
      verdict: "a-evaluer",
      messages: demande.criteres.length
        ? ["Compare ta réponse au corrigé, critère par critère."]
        : ["Compare ta réponse au corrigé : les idées essentielles y sont-elles ?"],
      source: "auto-evaluation",
    };
  },
};

/**
 * Correcteur IA — désactivé tant que la route serveur n'existe pas.
 * La clé d'API ne doit JAMAIS être dans le navigateur : elle reste côté serveur.
 */
export const correcteurIA: Correcteur = {
  nom: "Correction détaillée (IA)",
  disponible: () => import.meta.env.PUBLIC_CORRECTION_IA === "1",
  async corriger(demande) {
    const reponse = await fetch("/api/corriger", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(demande),
    });
    if (!reponse.ok) throw new Error(`La correction IA a échoué (${reponse.status}).`);
    return (await reponse.json()) as Correction;
  },
};

export function correcteurPourRedaction(): Correcteur {
  return correcteurIA.disponible() ? correcteurIA : autoEvaluation;
}
