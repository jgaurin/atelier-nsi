// Le programme du concours, ligne par ligne.
// Chaque leçon déclare dans son en-tête (champ `programme`) les lignes qu'elle couvre ;
// la page /parcours/programme/ et `npm run check` s'en servent pour repérer les trous.
//
// Sources :
// - programme spécifique du CAPES externe NSI bac+3, session 2027 (publié en juillet 2026) :
//   https://www.devenirenseignant.gouv.fr/media/20677/download
// - « le programme est constitué des programmes des enseignements d'informatique au lycée » :
//   SNT (seconde) et NSI (première et terminale), en vigueur à la rentrée 2026 ;
// - attendus de l'entretien (seconde épreuve d'admission), arrêté du 17 avril 2025.

export interface LigneProgramme {
  id: string;
  texte: string;
}

export interface SectionProgramme {
  id: string;
  titre: string;
  source: string;
  lignes: LigneProgramme[];
}

export const PROGRAMME: SectionProgramme[] = [
  {
    id: "lp",
    titre: "1. Langage et programmation",
    source: "Programme spécifique 2027",
    lignes: [
      { id: "lp-imperatif", texte: "Connaissances de base sur la programmation impérative" },
      { id: "lp-python", texte: "Maîtrise du langage Python en tant qu'exemple de programmation impérative" },
      { id: "lp-poo", texte: "Bases de la programmation orientée objet : classe, encapsulation, composition, agrégation, héritage, interface et surcharge" },
      { id: "lp-uml", texte: "Diagramme de classes, cas d'utilisation (use case)" },
      { id: "lp-java", texte: "Connaissances de base du langage de POO Java" },
    ],
  },
  {
    id: "asd",
    titre: "2. Algorithmique et structures de données",
    source: "Programme spécifique 2027",
    lignes: [
      { id: "asd-types", texte: "Types simples, spécification (en particulier différence entre type de données abstrait et implémentation)" },
      { id: "asd-lineaires", texte: "Structures linéaires : tableaux, listes, piles, files, file à priorité" },
      { id: "asd-arbres", texte: "Structures arborescentes : arbres, arbres binaires, arbres binaires de recherche" },
      { id: "asd-graphes", texte: "Structures de graphe" },
      { id: "asd-iter-rec", texte: "Expression itérative ou récursive des algorithmes" },
      { id: "asd-recherche-tris", texte: "Recherche, parcours (de structures linéaires et tris)" },
      { id: "asd-gloutons", texte: "Algorithmes gloutons" },
      { id: "asd-dpr", texte: "Diviser pour régner" },
      { id: "asd-progdyn", texte: "Programmation dynamique" },
      { id: "asd-preuve", texte: "Éléments de preuve ou justification d'un algorithme, pas nécessairement formelle" },
      { id: "asd-cout", texte: "Analyse du coût d'un algorithme en nombre d'opérations effectuées (au pire / au mieux)" },
    ],
  },
  {
    id: "id",
    titre: "3. Information et données",
    source: "Programme spécifique 2027",
    lignes: [
      { id: "id-codage", texte: "Codage de l'information, représentation symbolique" },
      { id: "id-types-simples", texte: "Représentation des types simples : booléens, entiers, flottants, chaînes de caractères, tableaux" },
      { id: "id-memoire", texte: "Représentation en mémoire des données" },
      { id: "id-tables", texte: "Données structurées en table" },
      { id: "id-relationnel", texte: "Modèle de données relationnel et bases de données relationnelles" },
      { id: "id-sql", texte: "Pratique d'un SGBD avec la maîtrise du langage de requêtes SQL" },
      { id: "id-web", texte: "Accès à l'information sur le Web" },
      { id: "id-formats", texte: "Bases sur le format des données : HTML, CSS, XML" },
      { id: "id-client-serveur", texte: "Modèle client-serveur et un langage de programmation côté client (par exemple JavaScript)" },
    ],
  },
  {
    id: "asr",
    titre: "4. Architecture, système, réseau",
    source: "Programme spécifique 2027",
    lignes: [
      { id: "asr-organisation", texte: "Organisation générale des ordinateurs et de leurs composants" },
      { id: "asr-von-neumann", texte: "Architecture de von Neumann" },
      { id: "asr-circuits", texte: "Éléments de base sur les circuits et la logique booléenne" },
      { id: "asr-assembleur", texte: "Éléments de programmation en assembleur" },
      { id: "asr-os", texte: "Architecture d'un système d'exploitation et principales fonctionnalités" },
      { id: "asr-processus", texte: "Processus, système de gestion de fichiers, entrées / sorties" },
      { id: "asr-shell", texte: "Commandes de base d'un langage de type shell" },
      { id: "asr-utilisateurs", texte: "Gestion des utilisateurs et des ressources" },
      { id: "asr-couches", texte: "Modèle de référence en couches" },
      { id: "asr-physique-liaison", texte: "Notions de base des couches physique et liaison" },
      { id: "asr-routage", texte: "Couches interconnexion et routage" },
      { id: "asr-transport", texte: "Services de base de la couche transport" },
    ],
  },
  {
    id: "m",
    titre: "5. Mathématiques pour l'informatique",
    source: "Programme spécifique 2027",
    lignes: [
      { id: "m-logique", texte: "Logique des propositions, preuve, preuve par l'absurde" },
      { id: "m-ensembles", texte: "Structures de base : ensembles et relations" },
      { id: "m-denombrement", texte: "Bases de dénombrement" },
      { id: "m-probas", texte: "Probabilités discrètes" },
      { id: "m-graphes", texte: "Structures de graphes : vocabulaire et propriétés élémentaires" },
      { id: "m-automates", texte: "Bases sur les automates et les langages jusqu'aux expressions rationnelles" },
    ],
  },
  {
    id: "nsi1",
    titre: "NSI, classe de première",
    source: "Programme de NSI, voie générale (en vigueur)",
    lignes: [
      { id: "nsi1-histoire", texte: "Histoire de l'informatique" },
      { id: "nsi1-base", texte: "Types et valeurs de base : écriture d'un entier dans une base, entiers relatifs, réels, booléens, texte" },
      { id: "nsi1-construits", texte: "Types construits : p-uplets, tableaux, dictionnaires" },
      { id: "nsi1-tables", texte: "Traitement de données en tables : indexation, recherche, tri, fusion" },
      { id: "nsi1-web", texte: "Interactions homme-machine sur le Web : événements, client-serveur, requêtes HTTP, formulaires" },
      { id: "nsi1-archi", texte: "Architectures matérielles et systèmes d'exploitation : von Neumann, réseau, protocole du bit alterné, commandes de base" },
      { id: "nsi1-langages", texte: "Langages et programmation : constructions élémentaires, spécification, mise au point, bibliothèques" },
      { id: "nsi1-algo", texte: "Algorithmique : parcours séquentiel, tris par insertion et sélection, k plus proches voisins, dichotomie, algorithmes gloutons" },
    ],
  },
  {
    id: "nsit",
    titre: "NSI, classe de terminale",
    source: "Programme de NSI, voie générale (en vigueur)",
    lignes: [
      { id: "nsit-structures", texte: "Structures de données : interface et implémentation, programmation objet, listes, piles, files, dictionnaires, arbres, graphes" },
      { id: "nsit-bdd", texte: "Bases de données : modèle relationnel, SGBD, langage SQL" },
      { id: "nsit-archi", texte: "Composants intégrés (SoC), processus et ordonnancement, interblocage, protocoles de routage" },
      { id: "nsit-securite", texte: "Sécurisation des communications : chiffrement symétrique et asymétrique, HTTPS" },
      { id: "nsit-calculabilite", texte: "Calculabilité, décidabilité ; programme en tant que donnée" },
      { id: "nsit-langages", texte: "Récursivité, modularité, paradigmes de programmation, mise au point des programmes" },
      { id: "nsit-algo", texte: "Algorithmes sur les arbres binaires et les graphes, diviser pour régner, programmation dynamique, recherche textuelle" },
    ],
  },
  {
    id: "snt",
    titre: "SNT, classe de seconde",
    source: "Programme de SNT (2019, en vigueur en 2026 ; révision annoncée pour la rentrée 2027)",
    lignes: [
      { id: "snt-programmation", texte: "Programmation transversale : affectations, conditions, boucles, fonctions" },
      { id: "snt-internet", texte: "Internet" },
      { id: "snt-web", texte: "Le Web" },
      { id: "snt-reseaux-sociaux", texte: "Les réseaux sociaux" },
      { id: "snt-donnees", texte: "Les données structurées et leur traitement" },
      { id: "snt-localisation", texte: "Localisation, cartographie et mobilité" },
      { id: "snt-objets", texte: "Informatique embarquée et objets connectés" },
      { id: "snt-photo", texte: "La photographie numérique" },
    ],
  },
  {
    id: "entretien",
    titre: "Entretien avec le jury (seconde épreuve d'admission)",
    source: "Arrêté du 17 avril 2025",
    lignes: [
      { id: "e-presentation", texte: "Présentation de 5 minutes : motivation et parcours, puis échange" },
      { id: "e-valeurs", texte: "Valeurs de la République, dont la laïcité : les transmettre et les incarner (mise en situation)" },
      { id: "e-metier", texte: "Se projeter dans le métier de professeur" },
      { id: "e-service-public", texte: "Exigences du service public : droits et obligations du fonctionnaire, neutralité" },
      { id: "e-egalite", texte: "Lutte contre les discriminations et les stéréotypes, égalité filles-garçons" },
      { id: "e-ecologie", texte: "Grands enjeux de la transition écologique" },
      { id: "e-eleve", texte: "L'épanouissement de l'élève dans toutes ses dimensions" },
    ],
  },
];

export const TOUTES_LES_LIGNES = PROGRAMME.flatMap((s) => s.lignes);
