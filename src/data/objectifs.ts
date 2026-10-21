// Les objectifs de préparation : chacun choisit, dans l'ordre, les leçons utiles et le niveau à viser.
// Le choix de l'objectif est enregistré dans le navigateur (clé « atelier-nsi:objectif ») ; par défaut : contractuel.

export type IdObjectif = "contractuel" | "capes";

export interface Etape {
  id: string;
  titre: string;
  description: string;
  /** Clés « module/slug » des leçons, dans l'ordre conseillé. */
  lecons: string[];
}

export interface Objectif {
  id: IdObjectif;
  titre: string;
  court: string;
  description: string;
  /** Niveau des exercices à viser (les autres restent accessibles, présentés comme facultatifs). */
  niveauMax: number;
  conseil: string;
  etapes: Etape[];
}

export const OBJECTIF_PAR_DEFAUT: IdObjectif = "contractuel";

export const OBJECTIFS: Objectif[] = [
  {
    id: "contractuel",
    titre: "Entretien de professeur contractuel",
    court: "Contractuel",
    description:
      "Réussir l'entretien de recrutement, puis maîtriser ce qu'on enseigne en SNT et en NSI, au niveau de la classe, et savoir gérer une classe.",
    niveauMax: 2,
    conseil:
      "Pour chaque leçon : le cours, l'exemple guidé et les exercices « Découverte » et « Entraînement ». Les exercices « Approfondissement » et « Type concours » sont facultatifs pour toi.",
    etapes: [
      {
        id: "entretien",
        titre: "Réussir l'entretien",
        description: "Le recrutement, les questions types, la gestion de classe, les programmes et les valeurs du service public.",
        lecons: [
          "contractuel/recrutement",
          "contractuel/questions-entretien",
          "contractuel/gerer-une-classe",
          "contractuel/premiers-cours",
          "lycee/programmes",
          "entretien/valeurs-laicite",
          "entretien/fonctionnaire",
          "entretien/egalite",
        ],
      },
      {
        id: "snt-python",
        titre: "SNT : programmer en Python",
        description: "La programmation au programme de seconde, au niveau des élèves : variables, types, conditions, boucles, fonctions. Une fiche par notion, avec un grand QCM et des exercices.",
        lecons: [
          "snt-python/variables",
          "snt-python/types",
          "snt-python/conditions",
          "snt-python/boucles-bornees",
          "snt-python/boucles-non-bornees",
          "snt-python/fonctions",
        ],
      },
      {
        id: "snt",
        titre: "SNT : les sept thèmes",
        description: "Un cours par thème du programme de seconde, au niveau des élèves : Internet, Web, réseaux sociaux, données, localisation, objets connectés, photographie numérique.",
        lecons: [
          "snt-themes/internet",
          "snt-themes/web",
          "snt-themes/reseaux-sociaux",
          "snt-themes/donnees",
          "snt-themes/localisation",
          "snt-themes/objets-connectes",
          "snt-themes/photo",
        ],
      },
      {
        id: "nsi1",
        titre: "Enseigner la NSI en première",
        description: "Types construits, représentation des données, données en tables, Web, architecture, systèmes et premiers algorithmes.",
        lecons: [
          "python/listes",
          "python/chaines",
          "python/tuples-dictionnaires",
          "python/references",
          "python/tests-erreurs",
          "python/modules-fichiers",
          "representation/bases",
          "representation/entiers",
          "representation/flottants",
          "representation/texte",
          "bdd/tables",
          "web/javascript",
          "architecture/circuits",
          "architecture/von-neumann",
          "systemes/systeme",
          "systemes/fichiers-shell",
          "systemes/utilisateurs-droits",
          "reseaux/physique-liaison",
          "algo/complexite",
          "algo/recherche",
          "algo/tris-simples",
          "algo/gloutons",
          "algo/k-plus-proches-voisins",
        ],
      },
      {
        id: "nsit",
        titre: "Enseigner la NSI en terminale",
        description: "Programmation objet, structures de données, bases de données et SQL, récursivité et algorithmes, processus, réseaux et sécurité.",
        lecons: [
          "objet/classes-objets",
          "objet/encapsulation",
          "structures/types-abstraits",
          "structures/listes-chainees",
          "structures/piles-files",
          "algo/recursivite",
          "structures/arbres-binaires",
          "structures/abr",
          "structures/graphes",
          "structures/parcours-graphes",
          "bdd/modele-relationnel",
          "bdd/sql-selection",
          "bdd/sql-jointures",
          "bdd/sql-modification",
          "bdd/sgbd",
          "algo/diviser-pour-regner",
          "algo/programmation-dynamique",
          "algo/recherche-textuelle",
          "algo/preuve",
          "systemes/processus",
          "reseaux/ip-routage",
          "reseaux/securite",
          "langages/calculabilite",
        ],
      },
      {
        id: "pedagogie",
        titre: "Aller plus loin en classe",
        description: "Concevoir des activités, accompagner chaque élève, réagir aux situations délicates, la transition écologique.",
        lecons: [
          "lycee/didactique",
          "entretien/epanouissement",
          "entretien/mises-en-situation",
          "entretien/transition-ecologique",
        ],
      },
    ],
  },
  {
    id: "capes",
    titre: "CAPES NSI 2027",
    court: "CAPES",
    description: "Tout le programme du concours, du niveau débutant aux exercices de type concours, et la méthode des quatre épreuves.",
    niveauMax: 4,
    conseil: "Fais toutes les leçons du parcours dans l'ordre, jusqu'aux exercices « Type concours », puis entraîne-toi sur les sujets blancs.",
    etapes: [],
  },
];

export const objectifParId = (id: string) => OBJECTIFS.find((o) => o.id === id);
