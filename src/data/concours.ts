// Le concours : épreuves (arrêté du 17 avril 2025) et calendrier prévisionnel de la session 2027.
// Calendrier : fiche « Professeurs certifiés (CAPES) » de fonction-publique.gouv.fr — prévisionnel,
// à revérifier sur devenirenseignant.gouv.fr et Cyclades.

export const CALENDRIER = {
  finInscriptions: "2026-11-25T12:00:00+01:00",
  debutEcrits: "2027-03-09T08:00:00+01:00",
  finEcrits: "2027-03-19T18:00:00+01:00",
  libelleEcrits: "du 9 au 19 mars 2027 (prévisionnel)",
  libelleInscriptions: "jusqu'au 25 novembre 2026 à midi",
};

export interface Epreuve {
  id: "ecrit1" | "ecrit2" | "oral1" | "oral2";
  nom: string;
  court: string;
  duree: string;
  coefficient: number;
  resume: string;
  officiel: string;
  conseils: string[];
  sujetZero?: string;
  methode?: string;
}

export const EPREUVES: Epreuve[] = [
  {
    id: "ecrit1",
    nom: "Première épreuve d'admissibilité",
    court: "Écrit 1 — problèmes",
    duree: "4 h",
    coefficient: 3,
    resume: "Analyser et résoudre un ou plusieurs problèmes : programmation, preuve, coût, récursivité, structures de données.",
    officiel: "L'épreuve consiste en l'analyse et la résolution d'un ou plusieurs problèmes. Elle évalue les connaissances disciplinaires ainsi que les capacités de raisonnement, d'argumentation et de programmation du candidat. Une note inférieure ou égale à 5 est éliminatoire.",
    conseils: [
      "Le sujet zéro enchaîne trace d'exécution, invariant et variant, coût au pire et au mieux, version récursive, relation de récurrence, mémoïsation, puis un problème sur le codage d'arbres binaires.",
      "Chaque réponse doit être justifiée : un code sans explication ou un coût sans calcul rapporte peu.",
    ],
    sujetZero: "https://www.devenirenseignant.gouv.fr/media/17160/download",
    methode: "/parcours/epreuves/ecrit-1/",
  },
  {
    id: "ecrit2",
    nom: "Seconde épreuve d'admissibilité",
    court: "Écrit 2 — dossier",
    duree: "4 h",
    coefficient: 2,
    resume: "À partir de documents décrivant une situation concrète et une solution, analyser, compléter et faire évoluer cette solution.",
    officiel: "L'épreuve s'appuie sur un ou plusieurs documents présentant une problématique posée par une situation concrète et des éléments de mise en œuvre d'une ou plusieurs solutions. Le candidat est invité à analyser, le cas échéant à compléter et à faire évoluer la ou les solutions. Elle vise à apprécier la capacité à comprendre et analyser les documents, à construire et exposer un raisonnement. Une note inférieure ou égale à 5 est éliminatoire.",
    conseils: [
      "Le sujet zéro mêle automates, SQL (création de tables, insertions, dépendances fonctionnelles, requêtes), classes Python, diagrammes de classes UML avec cardinalités, assembleur, Java et ordonnancement de processus.",
      "Il faut lire vite du code et des schémas inconnus : entraîne-toi à reformuler ce que fait un code avant d'y toucher.",
    ],
    sujetZero: "https://www.devenirenseignant.gouv.fr/media/17163/download",
    methode: "/parcours/epreuves/ecrit-2/",
  },
  {
    id: "oral1",
    nom: "Première épreuve d'admission",
    court: "Oral 1 — exposé et réalisation",
    duree: "2 h 30 de préparation, puis 1 h (30 min d'exposé, 30 min d'échange)",
    coefficient: 5,
    resume: "À partir d'un corpus de documents, réaliser un programme pendant la préparation, puis le présenter et le relier aux documents.",
    officiel: "Exposé disciplinaire suivi d'échanges avec le jury. La préparation s'appuie sur un corpus de documents autour d'un thème, présentant une problématique et la description d'une réalisation informatique. Le candidat présente la réalisation créée en préparation et une présentation organisée des documents. Le jury apprécie la capacité à faire un exposé clair et argumenté, à communiquer et à interagir. La note 0 est éliminatoire.",
    conseils: [
      "Le sujet zéro demande un démonstrateur de quatre tris (glouton, insertion, fusion, rapide), des mesures de temps, un jeu de tests qui montre par exemple que le tri rapide n'est pas stable, puis une interface Tkinter.",
      "C'est l'épreuve au plus fort coefficient : il faut savoir coder vite et proprement, puis expliquer ses choix.",
    ],
    sujetZero: "https://www.devenirenseignant.gouv.fr/media/18048/download",
    methode: "/parcours/epreuves/oral-1/",
  },
  {
    id: "oral2",
    nom: "Seconde épreuve d'admission",
    court: "Oral 2 — entretien",
    duree: "35 min",
    coefficient: 3,
    resume: "Présentation de 5 minutes (motivation, parcours) et échange, puis 20 minutes sur les valeurs de la République et le métier, avec une mise en situation.",
    officiel: "Entretien avec le jury. Premier temps (15 min) : présentation de 5 minutes de sa motivation et de son parcours, puis 10 minutes d'échange. Second temps (20 min) : questionnements, dont une mise en situation, sur les valeurs de la République dont la laïcité, puis sur l'aptitude à se projeter dans le métier, à incarner les exigences du service public (neutralité, lutte contre les discriminations, égalité filles-garçons), à comprendre les enjeux de la transition écologique et à appréhender l'épanouissement de l'élève. La note 0 est éliminatoire.",
    conseils: [
      "Prépare ta présentation de 5 minutes à l'avance et chronomètre-la.",
      "Pour une mise en situation : faits, cadre (règlement, loi), réponse immédiate, suivi, et qui informer.",
    ],
    methode: "/parcours/entretien/presentation/",
  },
];
