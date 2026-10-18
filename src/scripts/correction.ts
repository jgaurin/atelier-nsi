// Point d'entrée unique de la correction des exercices.
//
// Aujourd'hui :
//   - QCM, Python et SQL sont corrigés automatiquement (dans exercices.ts) ;
//   - une rédaction (preuve, trace, analyse…) est auto-évaluée : on montre le corrigé
//     et les critères de réussite, et l'apprenant se positionne.
//
// La relecture par l'IA (Claude Haiku) est un bouton à part, « Faire relire par l'IA » (exercices.ts → /api/relire) :
// elle ne remplace jamais cette auto-évaluation sans qu'on le demande.

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

export function correcteurPourRedaction(): Correcteur {
  return autoEvaluation;
}
