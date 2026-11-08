// La carte du site : niveaux → chapitres → leçons, établie d'après les programmes officiels.
// Une leçon prévue s'affiche « Bientôt » tant que son fichier n'est pas écrit.
// `programmation: false` : le programme ne demande pas de coder sur ce chapitre,
// le vérificateur (npm run check) y refuse donc tout exercice Python ou SQL.
// Une leçon peut faire exception avec `programmation: true` dans son en-tête.

export interface Partie {
  id: string;
  titre: string;
  description: string;
}

export interface Module {
  id: string;
  partie: string;
  titre: string;
  description: string;
  /** Teinte (0-360) utilisée pour la couleur du chapitre. */
  teinte: number;
  programmation: boolean;
  /** Leçons prévues, dans l'ordre : [slug, titre]. */
  plan: [string, string][];
}

export const PARTIES: Partie[] = [
  { id: "seconde", titre: "SNT · Seconde", description: "Les sept thèmes du programme et les bases de Python." },
  { id: "premiere", titre: "NSI · Première", description: "Le programme de la spécialité en première." },
  { id: "terminale", titre: "NSI · Terminale", description: "Le programme de terminale, pour être prêt le jour du bac." },
];

const CONTROLE: [string, string] = ["controle", "Contrôle du chapitre"];
const SNT = 185;
const PREMIERE = 245;
const TERMINALE = 290;

export const MODULES: Module[] = [
  // Seconde -----------------------------------------------------------------
  {
    id: "snt-python", partie: "seconde", teinte: 200, programmation: true,
    titre: "Programmer en Python", description: "Variables, conditions, boucles, fonctions.",
    plan: [["variables", "Variables et affectation"], ["conditions", "Les conditions"], ["boucles", "Les boucles"], ["fonctions", "Les fonctions"], CONTROLE],
  },
  {
    id: "snt-internet", partie: "seconde", teinte: SNT, programmation: false,
    titre: "Internet", description: "Paquets, routage, adresses, DNS, réseaux physiques.",
    plan: [["tcp-ip", "TCP/IP : paquets et routage"], ["dns", "Adresses IP et DNS"], ["reseaux-physiques", "Réseaux physiques et pair-à-pair"]],
  },
  {
    id: "snt-web", partie: "seconde", teinte: SNT, programmation: false,
    titre: "Le Web", description: "HTML, CSS, URL, HTTP, moteurs de recherche, droits.",
    plan: [["html-css", "Pages Web : HTML et CSS"], ["url-http", "URL, HTTP et client-serveur"], ["moteurs-droits", "Moteurs de recherche, sécurité et droits"]],
  },
  {
    id: "snt-reseaux-sociaux", partie: "seconde", teinte: SNT, programmation: false,
    titre: "Les réseaux sociaux", description: "Identité numérique, modèle économique, graphes, cyberviolence.",
    plan: [["usages", "Identité numérique et modèle économique"], ["graphes", "Graphes et petit monde"], ["cyberviolence", "La cyberviolence"]],
  },
  {
    id: "snt-donnees", partie: "seconde", teinte: SNT, programmation: false,
    titre: "Les données structurées", description: "Descripteurs, tables, données ouvertes, nuage.",
    plan: [["descripteurs", "Données, descripteurs et métadonnées"], ["traitement", "Traiter une table"], ["nuage", "Les données dans le nuage"]],
  },
  {
    id: "snt-localisation", partie: "seconde", teinte: SNT, programmation: false,
    titre: "Localisation et cartographie", description: "GPS, trames NMEA, cartes numériques, itinéraires.",
    plan: [["gps", "GPS et trames NMEA"], ["cartes-itineraires", "Cartes numériques et itinéraires"]],
  },
  {
    id: "snt-objets", partie: "seconde", teinte: SNT, programmation: true,
    titre: "Informatique embarquée et objets connectés", description: "Capteurs, actionneurs, IHM, programmes simples.",
    plan: [["embarque", "Systèmes embarqués"], ["programmer-objet", "Programmer un objet connecté"]],
  },
  {
    id: "snt-photo", partie: "seconde", teinte: SNT, programmation: false,
    titre: "La photographie numérique", description: "Pixels, résolution, EXIF, traitement d'image.",
    plan: [["pixels", "Photosites, pixels et résolution"], ["exif-algorithmes", "Métadonnées et algorithmes"], ["traitement-image", "Traiter une image par programme"]],
  },

  // Première ----------------------------------------------------------------
  {
    id: "premiere-donnees", partie: "premiere", teinte: PREMIERE, programmation: false,
    titre: "Représentation des données", description: "Bases, entiers relatifs, flottants, booléens, texte.",
    plan: [["bases", "Écrire un entier dans une base"], ["relatifs", "Les entiers relatifs"], ["flottants", "Les nombres flottants"], ["booleens", "Les booléens"], ["texte", "Représenter du texte"], CONTROLE],
  },
  {
    id: "premiere-construits", partie: "premiere", teinte: PREMIERE, programmation: true,
    titre: "Types construits", description: "p-uplets, tableaux, matrices, dictionnaires.",
    plan: [["tuples", "p-uplets et p-uplets nommés"], ["tableaux", "Les tableaux"], ["matrices", "Compréhensions et matrices"], ["dictionnaires", "Les dictionnaires"], CONTROLE],
  },
  {
    id: "premiere-tables", partie: "premiere", teinte: PREMIERE, programmation: true,
    titre: "Données en tables", description: "CSV, recherche, cohérence, tri, fusion.",
    plan: [["csv", "Importer une table"], ["recherche", "Rechercher et vérifier"], ["tri-fusion", "Trier et fusionner"], CONTROLE],
  },
  {
    id: "premiere-web", partie: "premiere", teinte: PREMIERE, programmation: false,
    titre: "Le Web et les interactions", description: "Composants, événements, client-serveur, formulaires.",
    plan: [["evenements", "Composants et événements"], ["client-serveur", "Client, serveur et HTTP"], ["formulaires", "Les formulaires : GET et POST"], CONTROLE],
  },
  {
    id: "premiere-architecture", partie: "premiere", teinte: PREMIERE, programmation: false,
    titre: "Architecture et système", description: "Von Neumann, langage machine, système, commandes, capteurs.",
    plan: [["von-neumann", "Le modèle de von Neumann"], ["langage-machine", "Dérouler un programme machine"], ["systeme", "Le système d'exploitation"], ["commandes-droits", "Commandes et droits d'accès"], ["capteurs-ihm", "Capteurs, actionneurs et IHM"], CONTROLE],
  },
  {
    id: "premiere-reseaux", partie: "premiere", teinte: PREMIERE, programmation: false,
    titre: "Réseaux", description: "Paquets, encapsulation, bit alterné et réseau local.",
    plan: [["paquets", "Découper les données en paquets"], ["encapsulation", "Protocoles et encapsulation"], ["bit-alterne", "Le protocole du bit alterné"], ["reseau-local", "Le réseau local"], CONTROLE],
  },
  {
    id: "premiere-langages", partie: "premiere", teinte: PREMIERE, programmation: true,
    titre: "Bien programmer", description: "Langages, spécification, tests, bibliothèques.",
    plan: [["constructions", "Constructions et langages"], ["specification", "Spécifier une fonction"], ["tests", "Tester et corriger"], ["bibliotheques", "Utiliser une bibliothèque"], CONTROLE],
  },
  {
    id: "premiere-algo", partie: "premiere", teinte: PREMIERE, programmation: true,
    titre: "Algorithmique", description: "Parcours, tris, dichotomie, gloutons, k plus proches voisins.",
    plan: [["parcours", "Parcourir un tableau"], ["tris", "Tris par sélection et par insertion"], ["dichotomie", "La recherche dichotomique"], ["gloutons", "Les algorithmes gloutons"], ["knn", "Les k plus proches voisins"], CONTROLE],
  },
  {
    id: "premiere-histoire", partie: "premiere", teinte: PREMIERE, programmation: false,
    titre: "Histoire de l'informatique", description: "Les grandes dates et les personnes à connaître.",
    plan: [["reperes", "Repères historiques"]],
  },

  // Terminale ---------------------------------------------------------------
  {
    id: "terminale-structures", partie: "terminale", teinte: TERMINALE, programmation: true,
    titre: "Structures de données", description: "Interface, objets, listes, piles, files, dictionnaires, arbres, graphes.",
    plan: [["interface", "Interface et implémentation"], ["poo", "Programmation objet"], ["lineaires", "Listes, piles et files"], ["dictionnaires", "Dictionnaires, index et clés"], ["arbres", "Les arbres"], ["graphes", "Les graphes"], CONTROLE],
  },
  {
    id: "terminale-bdd", partie: "terminale", teinte: TERMINALE, programmation: true,
    titre: "Bases de données", description: "Modèle relationnel, SGBD, requêtes SQL.",
    plan: [["modele-relationnel", "Le modèle relationnel"], ["sgbd", "Anomalies et SGBD"], ["sql-interroger", "SQL : interroger"], ["sql-modifier", "SQL : modifier"], CONTROLE],
  },
  {
    id: "terminale-archi", partie: "terminale", teinte: TERMINALE, programmation: false,
    titre: "Architecture, systèmes et réseaux", description: "Systèmes sur puce, processus, interblocage, routage, chiffrement.",
    plan: [["soc", "Les systèmes sur puce"], ["processus", "Les processus"], ["interblocage", "L'interblocage"], ["routage", "Le routage : RIP et OSPF"], ["chiffrement", "Sécuriser les communications"], CONTROLE],
  },
  {
    id: "terminale-langages", partie: "terminale", teinte: TERMINALE, programmation: true,
    titre: "Langages et programmation", description: "Récursivité, modularité, paradigmes, bugs, calculabilité.",
    plan: [["recursivite", "La récursivité"], ["modularite", "Modules et API"], ["paradigmes", "Les paradigmes"], ["bugs", "Les bugs typiques"], ["calculabilite", "Calculabilité et décidabilité"], CONTROLE],
  },
  {
    id: "terminale-algo", partie: "terminale", teinte: TERMINALE, programmation: true,
    titre: "Algorithmique", description: "Arbres, graphes, diviser pour régner, programmation dynamique, Boyer-Moore.",
    plan: [["arbres", "Algorithmes sur les arbres"], ["abr", "Arbres binaires de recherche"], ["graphes", "Algorithmes sur les graphes"], ["diviser-regner", "Diviser pour régner"], ["prog-dynamique", "Programmation dynamique"], ["boyer-moore", "Recherche textuelle"], CONTROLE],
  },
];
