(function () {
  "use strict";

  const official = {
    program: "https://www.devenirenseignant.gouv.fr/media/20677/download",
    exams: "https://www.devenirenseignant.gouv.fr/les-epreuves-du-capes-externe-bac3-section-numerique-et-sciences-informatiques-1459",
    calendar: "https://www.devenirenseignant.gouv.fr/le-calendrier-des-concours-de-recrutement-d-enseignants-du-second-degre-de-la-session-2027-1562",
    subjects: "https://www.devenirenseignant.gouv.fr/sujets-et-rapports-des-jurys-concours-du-Capes-de-2026-1657",
    opened: "https://www.devenirenseignant.gouv.fr/sections-et-options-des-concours-de-recrutement-d-enseignants-du-second-degre-ouvertes-en-2027-1803",
    lycee: "https://eduscol.education.gouv.fr/4368/enseigner-au-lycee-generaltechnologique",
    snt: "https://eduscol.education.gouv.fr/5841/programmes-et-ressources-en-sciences-numeriques-et-technologie-voie-gt",
    sntUpdate: "https://www.education.gouv.fr/le-conseil-superieur-des-programmes/revision-du-programme-de-sciences-numeriques-et-technologie-snt-de-seconde-505738"
  };

  function lesson(id, title, minutes, intro, explanation, example, question, options, answer, feedback, challenge, solution, keywords) {
    return { id, title, minutes, intro, explanation, example, question, options, answer, feedback, challenge, solution, keywords: keywords || [] };
  }

  const groups = [
    { id:"start", title:"Les premiers repères", short:"Fondations", color:"green", icon:"01", desc:"Comprendre ce que fait un programme, manipuler les données et construire un raisonnement pas à pas.", lessons:[
      lesson("f01","Penser en algorithme",14,"Un algorithme est une recette précise qui transforme des données en résultat. On va apprendre à décrire cette recette avant même de toucher au code.","Pour résoudre un problème, commence par préciser les entrées disponibles et la sortie attendue. Découpe ensuite la tâche en petites étapes non ambiguës. Une personne qui suit les étapes doit pouvoir obtenir le résultat sans deviner. Un algorithme ne dépend pas encore du langage : on peut l’écrire en français structuré, puis le traduire en Python.","Entrée : une liste de nombres.\nÉtapes : partir du premier nombre comme maximum ; examiner les suivants ; remplacer le maximum si l’un d’eux est plus grand.\nSortie : le maximum trouvé.","Dans l’algorithme du maximum, que faut-il faire avant de comparer les autres nombres ?",["Initialiser le maximum avec le premier élément","Initialiser le maximum à 0 dans tous les cas","Trier la liste entière","Afficher chaque nombre"],0,"Partir du premier élément fonctionne aussi quand tous les nombres sont négatifs. Une initialisation à 0 donnerait un résultat faux pour [-8, -3, -5].","Écris les étapes d’un algorithme qui compte les valeurs positives d’une liste. Indique ses entrées, sa sortie et son résultat pour [-2, 0, 4, 7].","Entrée : une liste L. Initialiser compteur à 0. Pour chaque valeur x de L, si x > 0, augmenter compteur de 1. Renvoyer compteur. Pour [-2, 0, 4, 7], le résultat est 2.",["algorithme","entrée","sortie","boucle"]),
      lesson("f02","Bits, nombres et logique",16,"Les ordinateurs représentent toute l’information avec deux états, souvent notés 0 et 1. Ces états permettent de coder des nombres, du texte et des images.","Un bit est un chiffre binaire : 0 ou 1. En base 2, chaque position vaut une puissance de 2. Ainsi 1011₂ = 1×8 + 0×4 + 1×2 + 1×1 = 11. Pour coder du texte, une table associe des nombres aux caractères. La logique booléenne manipule vrai et faux avec NON, ET et OU.","En Python, bool(0) vaut False et bool(5) vaut True. L’expression (age >= 18) and (permis) est vraie seulement si les deux conditions sont vraies.","Quelle est la valeur décimale du nombre binaire 1101₂ ?",["11","12","13","14"],2,"1101₂ = 8 + 4 + 0 + 1 = 13. Lis les puissances de 2 de droite à gauche : 1, 2, 4, 8.","Convertis 10110₂ en base 10, puis écris en binaire le nombre décimal 9.","10110₂ = 16 + 4 + 2 = 22. 9 = 8 + 1, donc 1001₂.",["bit","base 2","booléen","ET","OU"]),
      lesson("f03","Représentation en mémoire",17,"Un nombre stocké dans un ordinateur est un motif de bits. Certains nombres, en particulier les décimaux, ne peuvent pas toujours être représentés exactement.","Les entiers ont une représentation finie, souvent sur un nombre fixé de bits. Les nombres flottants utilisent une représentation proche de la notation scientifique en base 2 : certains décimaux comme 0,1 sont approximés. Il peut donc arriver que 0.1 + 0.2 ne soit pas exactement égal à 0.3. Pour comparer des calculs flottants, on vérifie souvent que l’écart est inférieur à une petite tolérance. Les chaînes sont codées avec des normes comme Unicode/UTF-8 ; un tableau représente une séquence ordonnée d’éléments.","En Python, abs((0.1 + 0.2) - 0.3) < 1e-9 teste que l’écart est très petit sans exiger une égalité flottante exacte.","Pourquoi 0.1 + 0.2 == 0.3 peut-il être faux dans un programme ?",["L’ordinateur ne sait pas faire d’addition","Les nombres flottants sont parfois des approximations binaires","0.3 est une chaîne de caractères","L’opérateur == n’existe pas en Python"],1,"Certains décimaux n’ont pas d’écriture binaire finie. Leur approximation peut laisser un très petit écart après le calcul.","Propose une condition Python qui accepte deux nombres flottants a et b comme égaux si leur différence absolue est inférieure à un millionième.","if abs(a - b) < 1e-6: ... . On compare l’écart à une tolérance adaptée au problème plutôt que d’exiger a == b.",["entier","flottant","approximation","Unicode","mémoire"])
    ]},
    { id:"python", title:"Programmer en Python", short:"Python", color:"orange", icon:"Py", desc:"Partir des variables et des conditions, puis écrire des fonctions correctes, les tester et comprendre la récursion.", lessons:[
      lesson("py01","Variables et types",14,"Un programme manipule des valeurs. Une variable donne un nom à une valeur pour pouvoir la réutiliser et la faire évoluer.","Les types simples les plus courants sont int (entier), float (nombre décimal), str (texte) et bool (vrai/faux). L’affectation x = 3 associe la valeur 3 au nom x. Elle ne signifie pas « x égale 3 » en mathématiques : le nom peut ensuite recevoir une autre valeur. Les listes regroupent plusieurs valeurs dans un ordre.","nom = \"Ada\"\nage = 17\nage = age + 1\nprint(nom, age)  # Ada 18", "Après ces instructions, quelle est la valeur et le type de x ?\nx = 7\nx = x / 2",["3, entier","3.5, nombre décimal","3.5, entier","14, nombre décimal"],1,"En Python, l’opérateur / produit un float, même lorsque le résultat est un nombre entier. L’opérateur // effectue une division entière.","Écris une instruction qui stocke le prix 12,5 dans une variable prix, puis une autre qui calcule le prix après une réduction de 20 %.","prix = 12.5\nprix_reduit = prix * 0.8. La variable prix_reduit contient 10.0.",["variable","type","affectation","liste"]),
      lesson("py02","Conditions et boucles",17,"Les conditions permettent de choisir un chemin. Les boucles répètent des instructions sans avoir à les recopier.","if / elif / else choisit un bloc selon une expression booléenne. for parcourt les éléments d’une séquence ou les valeurs de range. while répète tant qu’une condition reste vraie : il faut donc s’assurer qu’elle finira par devenir fausse. L’indentation délimite les blocs en Python et fait partie de la syntaxe.","total = 0\nfor note in [12, 15, 9]:\n    total = total + note\nmoyenne = total / 3", "Combien de fois la boucle affiche-t-elle une étoile ?\nfor i in range(2, 7, 2):\n    print(\"*\")",["2 fois","3 fois","4 fois","5 fois"],1,"range(2, 7, 2) produit 2, 4, 6 : la borne 7 est exclue et le pas vaut 2. La boucle tourne trois fois.","Écris une boucle qui calcule la somme des entiers de 1 à 5 inclus, sans utiliser sum().","total = 0\nfor n in range(1, 6):\n    total = total + n. À la fin, total vaut 15.",["condition","if","for","while","range"]),
      lesson("py03","Fonctions, tests et erreurs",18,"Une fonction donne un nom à une opération réutilisable. Des tests simples permettent de vérifier le résultat et de repérer les cas oubliés.","Une fonction reçoit des paramètres et renvoie éventuellement un résultat avec return. return termine immédiatement l’appel ; print affiche une information mais ne la renvoie pas. On teste les cas ordinaires, les limites (liste vide, zéro, une seule valeur) et les cas invalides prévus par la spécification. Lire un message d’erreur et réduire un bug à un exemple minuscule sont des habitudes essentielles.","def est_pair(n):\n    return n % 2 == 0\n\nassert est_pair(8)\nassert not est_pair(5)","Que vaut résultat ?\ndef carre(x):\n    print(x * x)\n\nrésultat = carre(4)",["16","0","None","Une erreur"],2,"La fonction affiche 16, mais ne contient pas return. Python renvoie donc None à l’appel. Pour obtenir 16 dans résultat, il faudrait return x * x.","Propose trois tests pour une fonction maximum(L) qui doit renvoyer le plus grand élément d’une liste non vide.","Par exemple : maximum([2, 9, 1]) == 9 ; maximum([-8, -3]) == -3 ; maximum([4]) == 4. Le contrat doit préciser que L n’est pas vide (ou définir le comportement sinon).",["fonction","paramètre","return","assert","test"]),
      lesson("py04","Récursion sans mystère",18,"Une fonction récursive résout un problème en appelant la même fonction sur une version plus petite. Elle a toujours besoin d’un cas d’arrêt.","Une définition récursive comporte un cas de base qui répond sans nouvel appel, et un cas récursif qui réduit le problème. Sans cas de base, les appels continuent jusqu’à une erreur de profondeur. Pour prouver la terminaison, on explique pourquoi la taille du problème diminue et finit par atteindre le cas de base. Une boucle peut parfois remplacer une récursion, et inversement.","def somme(n):\n    if n == 0:\n        return 0\n    return n + somme(n - 1)\n\n# somme(3) = 3 + 2 + 1 + 0 = 6", "Quelle est la valeur de f(4) ?\ndef f(n):\n    if n == 1: return 1\n    return n * f(n - 1)",["4","10","24","Aucune, la fonction ne termine pas"],2,"f(4) = 4×f(3) = 4×3×2×1 = 24. Le cas d’arrêt est n == 1.","Repère le cas d’arrêt de somme(n), puis indique ce qui arrive si on enlève le test n == 0.","Le cas d’arrêt est if n == 0: return 0. Sans lui, l’appel passe à -1, -2, etc. : il ne se rapproche jamais de 0 et finit par provoquer une RecursionError.",["récursion","cas de base","terminaison","pile d'appels"])
    ]},
    { id:"algo", title:"Algorithmes et structures", short:"Algo & structures", color:"blue", icon:"∑", desc:"Choisir une structure adaptée, chercher et trier, raisonner sur les coûts, les arbres et les graphes.", lessons:[
      lesson("al01","Listes, parcours et coût",18,"Avant de coder, demande-toi combien d’éléments le programme doit examiner. Cette idée donne une première mesure de son efficacité.","Parcourir une liste de n éléments une fois demande un nombre d’opérations proportionnel à n : on note cela O(n). Deux boucles imbriquées sur la même liste font environ n×n opérations : O(n²). O(1) décrit un coût borné qui ne dépend pas de n. On distingue le meilleur et le pire cas : chercher la première valeur peut réussir en une comparaison, tandis qu’une valeur absente oblige à parcourir toute la liste.","Une recherche linéaire s’arrête quand elle trouve la valeur ; au meilleur cas, une comparaison suffit ; au pire, elle examine les n éléments. Accéder à L[i] dans un tableau Python est en général O(1).","Dans le pire cas, combien d’éléments une recherche linéaire examine-t-elle dans une liste de n éléments ?",["1","log₂(n)","n","n²"],2,"Si la valeur est absente ou en dernière position, la recherche examine toute la liste : n éléments.","Compare le nombre d’itérations de deux boucles imbriquées parcourant chacune n valeurs, pour n = 10 puis n = 100.","Pour n = 10, environ 100 couples d’itérations ; pour n = 100, environ 10 000. Le coût est quadratique : le multiplier n par 10 multiplie le travail par environ 100.",["liste","parcours","meilleur cas","pire cas","O(1)","O(n)","O(n²)"]),
      lesson("al02","Piles, files et priorités",16,"Une structure de données organise l’accès aux éléments. Une pile et une file peuvent toutes deux contenir les mêmes valeurs, mais elles ne les rendent pas dans le même ordre.","Un type abstrait de données (TAD) décrit les valeurs et les opérations attendues sans imposer leur représentation interne. Une implémentation choisit ensuite comment les stocker. Une pile suit LIFO : dernier entré, premier sorti. Une file suit FIFO : premier entré, premier sorti. Une file à priorité rend d’abord l’élément de priorité la plus haute, souvent à l’aide d’un tas.","Pile : empiler A, puis B ; dépiler donne B.\nFile : enfiler A, puis B ; défiler donne A. Le TAD « pile » peut être implémenté avec une liste ou un tableau.","Quel principe est utilisé par un parcours en largeur d’un graphe ?",["LIFO, avec une pile","FIFO, avec une file","L’ordre alphabétique","La priorité la plus petite, toujours"],1,"Le parcours en largeur utilise une file pour visiter les sommets par distance croissante depuis le départ.","Une pile est vide. On empile 4, puis 7, puis on dépile une fois. Quelle valeur reste au sommet ?","Le dépilage enlève 7, le dernier élément empilé. Le sommet est maintenant 4. Le TAD décrit le comportement ; l’implémentation détermine comment le représenter.",["type abstrait de données","implémentation","pile","LIFO","file","FIFO","tas"]),
      lesson("al03","Arbres et graphes",18,"Les arbres et les graphes représentent des relations. On les rencontre dans les dossiers, les réseaux sociaux, les itinéraires et les dépendances.","Un arbre est une structure hiérarchique sans cycle. Dans un arbre binaire, chaque nœud a au plus deux enfants. Un arbre binaire de recherche range les petites clés à gauche et les grandes à droite ; une recherche bien équilibrée coûte O(log n), mais un arbre dégénéré peut coûter O(n). Un graphe contient des sommets et des arêtes. Il peut être orienté, pondéré ou comporter des cycles.","Pour chercher un chemin dans un labyrinthe, modélise chaque case libre par un sommet et chaque déplacement possible par une arête. BFS trouve un chemin avec le moins d’arêtes dans un graphe non pondéré.","Quelle structure convient pour décrire les routes entre des villes ?",["Une pile seulement","Un graphe","Une chaîne de caractères","Un arbre binaire de recherche obligatoire"],1,"Les villes sont des sommets et les routes des arêtes. Si les distances comptent, on peut donner un poids aux arêtes.","Dans un graphe non pondéré, que garantit un parcours en largeur quand il trouve un chemin entre le départ et l’arrivée ?","Il trouve un chemin avec un nombre minimal d’arêtes. BFS explore les sommets par couches de distance.",["arbre","nœud","graphe","sommet","arête","BFS"]),
      lesson("al04","Recherche, tri et stratégie",20,"Plusieurs algorithmes résolvent le même problème avec des compromis différents. Savoir expliquer le choix et son coût est aussi important que produire du code.","La recherche dichotomique divise par deux l’intervalle à chaque étape et coûte O(log n), mais exige une séquence triée. Le tri fusion divise la liste, trie les moitiés puis les fusionne en O(n log n). Une stratégie gloutonne fait à chaque étape le choix local qui semble meilleur ; elle est efficace quand on peut justifier qu’il mène à une solution optimale. La programmation dynamique mémorise les résultats de sous-problèmes qui se répètent.","Pour rendre une somme avec pièces de 1, 5 et 10, prendre la plus grande pièce possible est glouton. Cette règle n’est pas optimale pour tous les systèmes de pièces : il faut justifier le système donné.","Quelle condition est indispensable à la recherche dichotomique classique ?",["La liste doit être triée","Les valeurs doivent être positives","La liste doit avoir une taille paire","La liste doit contenir des chaînes"],0,"À chaque étape, la dichotomie élimine la moitié qui ne peut contenir la valeur. Cela n’est valide que si l’ordre de la liste est connu.","Pour n = 1 024 éléments triés, environ combien de divisions par deux suffisent au pire pour réduire la recherche à un seul élément ?","Dix divisions, car 1 024 = 2¹⁰. La complexité est logarithmique : log₂(1 024) = 10.",["recherche","dichotomie","tri fusion","glouton","programmation dynamique"])
    ]},
    { id:"poo", title:"Objets et conception", short:"POO", color:"lav", icon:"{}", desc:"Modéliser un problème avec des classes, des objets, des responsabilités claires et les bases de Java.", lessons:[
      lesson("oo01","Classes et objets",16,"La programmation orientée objet regroupe des données et les opérations qui les utilisent. Une classe décrit un type d’objet ; un objet est un exemplaire concret.","Un objet possède un état (attributs) et un comportement (méthodes). Le constructeur initialise l’état. L’encapsulation consiste à contrôler la façon dont cet état est consulté ou modifié. On choisit une classe lorsqu’elle représente un concept cohérent du problème, pas simplement pour ranger du code.","class Compteur:\n    def __init__(self):\n        self.valeur = 0\n    def incremente(self):\n        self.valeur += 1\n\nc = Compteur()\nc.incremente()", "Dans l’exemple, qu’est-ce que c ?",["Une classe","Une instance de Compteur","Une méthode","Un module Python"],1,"Compteur est la classe ; c est un objet (une instance) créé à partir de cette classe.","Cite un attribut et une méthode possibles pour une classe Livre utilisée dans une bibliothèque.","Attributs : titre, auteur, disponible. Méthodes possibles : emprunter(), rendre(). Les choix précis dépendent du problème et de ses règles.",["classe","objet","instance","attribut","méthode","encapsulation"]),
      lesson("oo02","Composition, héritage et Java",17,"Une bonne conception rend les responsabilités compréhensibles. La composition assemble des objets ; l’héritage spécialise un type quand la relation « est un » est justifiée.","La composition exprime « possède un » : une Bibliothèque contient des Livres. L’héritage exprime « est un » : un Chien est un Animal. Une interface décrit des opérations attendues sans imposer toute leur implémentation. La surcharge donne plusieurs méthodes de même nom avec des paramètres différents. En Java, les types sont déclarés explicitement et la signature indique notamment le type de retour.","class Animal {\n    public void parler() { }\n}\nclass Chien extends Animal {\n    @Override\n    public void parler() { System.out.println(\"Ouaf\"); }\n}","Une voiture contient un moteur. Quel lien de conception est généralement adapté ?",["Héritage : Voiture extends Moteur","Composition : Voiture possède un Moteur","Surcharge de l’opérateur +","Récursion obligatoire"],1,"Une voiture n’est pas un moteur ; elle en possède un. La composition exprime cette relation sans créer une hiérarchie artificielle.","Donne une raison pour laquelle on préférerait une interface à une classe de base très détaillée.","Une interface permet à différentes classes de promettre les mêmes opérations sans partager une implémentation ou une hiérarchie rigide. C’est utile pour substituer les objets et limiter le couplage.",["composition","héritage","interface","Java","surcharge"])
    ]},
    { id:"data", title:"Données et bases SQL", short:"Données & SQL", color:"orange", icon:"▤", desc:"Structurer l’information, comprendre les tables relationnelles et écrire des requêtes SQL fiables.", lessons:[
      lesson("db01","Tables, clés et relations",18,"Une base relationnelle organise les données dans des tables reliées par des identifiants. Ce modèle évite les répétitions et rend les requêtes composables.","Une table contient des lignes (enregistrements) et des colonnes (attributs). Une clé primaire identifie chaque ligne. Une clé étrangère référence une ligne d’une autre table. La normalisation limite les incohérences : par exemple, ne pas recopier l’adresse d’un client dans chaque commande si elle peut être stockée une seule fois dans une table Client.","CLIENT(id_client, nom)\nCOMMANDE(id_commande, date, id_client)\nid_client dans COMMANDE est une clé étrangère vers CLIENT.","Quel est le rôle d’une clé primaire ?",["Trier automatiquement la table","Identifier de manière unique une ligne","Chiffrer une colonne","Relier tous les serveurs"],1,"La clé primaire permet de désigner chaque enregistrement sans ambiguïté. Une table ne doit pas avoir deux lignes avec la même clé primaire.","Dans une table Emprunt(id, id_livre, id_lecteur, date), quelles colonnes pourraient être des clés étrangères ?","id_livre et id_lecteur peuvent référencer les tables Livre et Lecteur. id est généralement la clé primaire d’Emprunt.",["table","ligne","clé primaire","clé étrangère","relation"]),
      lesson("db02","Écrire des requêtes SQL",19,"SQL sert à interroger et modifier des bases relationnelles. Une requête se lit comme une demande : quelles colonnes, dans quelles tables, avec quels filtres ?","SELECT choisit les colonnes, FROM les tables, WHERE filtre les lignes, ORDER BY trie le résultat. JOIN combine des tables reliées. COUNT, SUM et AVG calculent des agrégats ; GROUP BY forme des groupes avant le calcul. Attention : une condition de jointure oubliée peut produire beaucoup trop de lignes.","SELECT Client.nom, Commande.date\nFROM Client\nJOIN Commande ON Client.id = Commande.id_client\nWHERE Commande.date >= '2026-01-01'\nORDER BY Commande.date;","Que fait WHERE prix > 10 dans une requête ?",["Trie les lignes par prix","Conserve seulement les lignes dont le prix dépasse 10","Calcule la moyenne des prix","Renomme la colonne prix"],1,"WHERE filtre les lignes avant que le résultat soit affiché. ORDER BY sert au tri et AVG au calcul de moyenne.","Écris une requête qui affiche les titres des livres empruntés par le lecteur dont id vaut 3, à partir de Livre(id, titre) et Emprunt(id_livre, id_lecteur).","SELECT Livre.titre FROM Livre JOIN Emprunt ON Livre.id = Emprunt.id_livre WHERE Emprunt.id_lecteur = 3; Les noms de colonnes doivent correspondre au schéma fourni.",["SELECT","WHERE","JOIN","GROUP BY","SQL"])
    ]},
    { id:"web", title:"Web et échanges de données", short:"Web", color:"blue", icon:"⌘", desc:"Lire des formats structurés, comprendre client-serveur et distinguer contenu, présentation et comportement.", lessons:[
      lesson("web01","HTML, CSS, XML et données",17,"Sur le Web, différents langages ont des rôles distincts. Comprendre cette séparation aide à lire les pages et les échanges de données.","HTML décrit la structure et le sens du contenu (titres, liens, formulaires). CSS décrit la présentation. XML encode des données avec des balises structurées et vérifiables. JSON est également fréquent pour échanger des objets et des listes. Une donnée structurée respecte une organisation prévisible, ce qui permet à un programme de la lire.","<article>\n  <h1>Mon cours</h1>\n  <p>Une notion à la fois.</p>\n</article>\n<!-- Le CSS peut ensuite définir les couleurs et espacements. -->","Quel langage sert principalement à définir la présentation visuelle d’une page ?",["HTML","CSS","SQL","HTTP"],1,"HTML structure le contenu ; CSS définit les styles visuels. HTTP est un protocole d’échange, SQL interroge des bases.","Dans un fichier de données JSON, comment représente-t-on l’association entre la clé nom et la valeur Ada ?","Par exemple : {\"nom\": \"Ada\"}. Une paire clé-valeur est séparée par deux-points ; les chaînes sont entre guillemets doubles.",["HTML","CSS","XML","JSON","données structurées"]),
      lesson("web02","Client, serveur et JavaScript",17,"Une page Web résulte souvent d’un échange entre un client (navigateur) et un serveur. Le navigateur peut aussi exécuter du code JavaScript.","Le navigateur envoie une requête au serveur ; le serveur renvoie une réponse, par exemple une page, des données ou une erreur. HTTP définit la forme de nombreux échanges. JavaScript côté client peut réagir à une action, vérifier un formulaire ou demander de nouvelles données. Il ne faut pas confondre l’interface visible, la logique exécutée dans le navigateur et les traitements du serveur.","Cliquer « Rechercher » peut déclencher une requête HTTP. Le serveur cherche les résultats dans ses données puis renvoie une réponse que le navigateur affiche.","Quel élément joue généralement le rôle de client lors de la consultation d’un site ?",["Le navigateur","Le câble réseau","La base de données seule","Le serveur Web"],0,"Le navigateur est le client. Il communique avec le serveur, qui traite la requête et renvoie une réponse.","Explique en une phrase pourquoi une page peut se mettre à jour sans recharger tout le document.","Le code JavaScript du navigateur peut envoyer une requête asynchrone au serveur, recevoir des données et ne mettre à jour qu’une partie de l’interface.",["client","serveur","requête","réponse","JavaScript","HTTP"])
    ]},
    { id:"arch", title:"Architecture et logique", short:"Architecture", color:"lav", icon:"▦", desc:"Relier les représentations binaires au processeur, à la mémoire et à l’exécution des instructions.", lessons:[
      lesson("ar01","Du processeur aux instructions",18,"Un ordinateur exécute des instructions simples en manipulant des données stockées en mémoire. Cette organisation explique ce que signifie « exécuter un programme ».","Dans l’architecture de von Neumann, instructions et données sont stockées en mémoire ; le processeur lit une instruction, la décode puis l’exécute. Il contient notamment une unité de contrôle et des unités de calcul. Les circuits logiques réalisent des opérations booléennes. L’assembleur expose des instructions proches du processeur, comme charger, additionner et sauter.","Une instruction abstraite peut dire : charger la valeur en mémoire dans un registre ; additionner un autre registre ; stocker le résultat. Un langage de haut niveau traduit une intention plus lisible en opérations exécutables.","Dans le cycle d’exécution, quelle action vient après la lecture d’une instruction ?",["L’ordinateur l’oublie","Le processeur la décode","La mémoire se formate","Le réseau l’envoie toujours"],1,"Le processeur lit l’instruction, la décode pour identifier l’opération, puis l’exécute.","Pourquoi un programme Python doit-il être traduit ou interprété avant que le processeur puisse l’exécuter ?","Le processeur comprend un jeu d’instructions machine, pas directement les constructions Python. Un interpréteur ou un compilateur traduit ces constructions vers des opérations que la machine peut exécuter.",["processeur","mémoire","von Neumann","assembleur","registre"]),
      lesson("ar02","Circuits et opérations booléennes",15,"Les portes logiques mettent en œuvre des calculs booléens. En combinant quelques portes, on peut construire des opérations arithmétiques et des composants plus riches.","Une porte ET produit 1 seulement si ses deux entrées valent 1 ; OU produit 1 si au moins une entrée vaut 1 ; NON inverse le bit. XOR vaut 1 quand ses entrées diffèrent. Ces règles se décrivent avec une table de vérité. Un additionneur combine des portes pour calculer la somme de bits et une retenue.","XOR : 0⊕0=0, 0⊕1=1, 1⊕0=1, 1⊕1=0. Pour additionner deux bits, XOR donne le bit de somme et ET donne la retenue.","Avec A=1 et B=1, que valent A ET B et A OU B ?",["0 et 0","0 et 1","1 et 0","1 et 1"],3,"Les deux entrées étant vraies, ET vaut vrai et OU vaut également vrai.","Donne les quatre résultats de la porte XOR pour les couples (0,0), (0,1), (1,0), (1,1).","0, 1, 1, 0. XOR renvoie 1 exactement quand les entrées sont différentes.",["porte ET","porte OU","NON","XOR","table de vérité"])
    ]},
    { id:"systems", title:"Systèmes et réseaux", short:"Systèmes & réseaux", color:"red", icon:"⌁", desc:"Découvrir les processus, fichiers et commandes shell, puis suivre les données sur un réseau en couches.", lessons:[
      lesson("sys01","Système d’exploitation et shell",17,"Le système d’exploitation partage les ressources de l’ordinateur entre les programmes. Le shell permet de demander des actions au système avec des commandes.","Un processus est un programme en cours d’exécution avec un état et des ressources. Le système gère aussi la mémoire, les entrées-sorties, les fichiers, les utilisateurs et les droits. Dans un shell, pwd affiche le dossier courant, ls liste son contenu, cd change de dossier, mkdir crée un dossier. Les chemins relatifs partent du dossier courant ; un chemin absolu part de la racine.","pwd\nls\ncd cours\nmkdir exercices\n# Ces commandes naviguent et organisent les fichiers.","À quoi sert une commande comme cd ?",["À changer le dossier courant","À compiler automatiquement tout programme","À arrêter le processeur","À créer un utilisateur distant"],0,"cd signifie change directory : elle change le répertoire courant du shell.","Tu es dans /home/lea et veux entrer dans le sous-dossier nsi. Quelle commande peux-tu utiliser ?","cd nsi. Le chemin est relatif au dossier courant. On pourrait aussi utiliser un chemin absolu si on le connaît.",["processus","système d’exploitation","shell","chemin","fichier"]),
      lesson("net01","Réseaux, couches et protocoles",19,"Un réseau fait circuler des données entre des machines. Le découpage en couches aide à raisonner séparément sur le support, l’adressage et les échanges applicatifs.","Les modèles en couches organisent les fonctions du réseau. À très gros traits : la couche physique transporte des signaux ; la liaison échange des trames sur un réseau local ; IP assure l’adressage et le routage entre réseaux ; TCP ou UDP transportent les données entre applications ; des protocoles comme HTTP servent aux échanges Web. Une adresse IP désigne une interface réseau ; un port identifie un service ou une application.","Pour afficher une page, HTTP utilise un transport (souvent TCP), qui utilise IP, lui-même transmis sur un support local. Chaque couche s’appuie sur les services de la couche inférieure.","Quel protocole est principalement chargé du routage entre réseaux ?",["HTTP","IP","CSS","SQL"],1,"IP porte l’adressage logique et permet l’acheminement entre réseaux. HTTP est un protocole applicatif du Web.","Quel est l’intérêt de séparer les fonctions réseau en couches ?","Chaque couche fournit un service à la couche supérieure et masque certains détails d’implémentation. On peut faire évoluer une couche sans réécrire tout le système, si les interfaces restent compatibles.",["adresse IP","routage","TCP","UDP","couche réseau"])
    ]},
    { id:"math", title:"Mathématiques discrètes", short:"Maths discrètes", color:"green", icon:"∞", desc:"Utiliser logique, ensembles, dénombrement et probabilités discrètes pour comprendre et justifier des algorithmes.", lessons:[
      lesson("ma01","Logique, ensembles et preuve",18,"L’informatique utilise des raisonnements précis pour décrire les conditions, comparer des valeurs et justifier qu’un algorithme est correct.","Une implication P ⇒ Q est fausse uniquement lorsque P est vraie et Q fausse. Une preuve directe part des hypothèses et enchaîne des conséquences. Une preuve par l’absurde suppose le contraire du résultat et obtient une contradiction. Un ensemble regroupe des éléments ; une relation associe certains couples d’éléments. Ces outils servent aussi à définir des graphes et des relations d’ordre.","Pour prouver que la somme de deux nombres pairs est paire : écrire 2a et 2b ; leur somme vaut 2(a+b), donc est divisible par 2.","Quand l’implication P ⇒ Q est-elle fausse ?",["Quand P et Q sont vraies","Quand P est fausse et Q vraie","Quand P est vraie et Q fausse","Quand P et Q sont fausses"],2,"Une implication affirme que P entraîne Q. Elle échoue seulement si P arrive sans que Q soit vraie.","Donne une preuve directe que la somme d’un nombre pair et d’un nombre impair est impaire.","Écrivons le pair 2a et l’impair 2b+1. Leur somme est 2a+2b+1 = 2(a+b)+1, donc elle est impaire.",["implication","preuve directe","absurde","ensemble","relation"]),
      lesson("ma02","Dénombrement et probabilités",17,"Compter des possibilités et mesurer leur chance aide à analyser des programmes, des tirages et des situations comportant de l’aléatoire.","Pour deux choix indépendants offrant m puis n possibilités, il y a m×n couples possibles. Pour choisir k éléments parmi n sans tenir compte de l’ordre, on utilise le coefficient binomial. Dans un modèle équiprobable, probabilité = nombre de cas favorables / nombre de cas possibles. Il faut préciser les hypothèses : les issues sont-elles réellement toutes aussi probables ?","Un code de 3 chiffres, chaque chiffre de 0 à 9 et répétition autorisée, possède 10×10×10 = 1 000 valeurs possibles.","On lance un dé équilibré à six faces. Quelle est la probabilité d’obtenir un nombre pair ?",["1/6","1/3","1/2","2/3"],2,"Trois faces sont paires (2, 4, 6) parmi six issues équiprobables : 3/6 = 1/2.","Combien de mots binaires de longueur 4 peut-on former ?","Chaque position offre deux choix, indépendants : 2⁴ = 16 mots.",["dénombrement","issues","équiprobable","probabilité","coefficient binomial"])
    ]},
    { id:"formal", title:"Automates et langages", short:"Automates & langages", color:"lav", icon:"↻", desc:"Raisonner sur les chaînes de caractères avec états, transitions, langages et expressions régulières.", lessons:[
      lesson("fo01","Automates finis et expressions régulières",19,"Un automate lit une chaîne symbole par symbole, change d’état et décide si la chaîne appartient au langage reconnu.","Un automate fini est composé d’états, d’un état initial, d’états acceptants et de transitions. Il accepte un mot si le parcours depuis l’état initial finit dans un état acceptant. Une expression régulière décrit des motifs de chaînes : la concaténation, l’alternative et la répétition sont des opérations fondamentales. Il faut distinguer le motif voulu des caractères spéciaux du langage de regex choisi.","Pour reconnaître les mots binaires qui se terminent par 1, deux états suffisent : « dernier symbole différent de 1 » et « dernier symbole égal à 1 », ce dernier étant acceptant.","Dans un automate déterministe, que fait-on pour lire un nouveau symbole ?",["On change d’état selon la transition correspondante","On efface les états précédents","On trie la chaîne","On ajoute toujours un état final"],0,"La transition associe l’état courant et le symbole lu au prochain état. Après le dernier symbole, on vérifie si l’état atteint est acceptant.","Quel type de mots binaires la regex 0*1 reconnaît-elle ?","Zéro ou plusieurs zéros, suivis d’un unique 1 : 1, 01, 001, etc. Elle n’accepte pas 101 ni 00.",["automate","état","transition","langage","expression régulière","regex"])
    ]},
    { id:"school", title:"Programmes du lycée", short:"Programmes lycée", color:"blue", icon:"Lyc", desc:"Relier les notions au programme de SNT et de NSI, lire les textes de référence et choisir des exemples adaptés aux élèves.", lessons:[
      lesson("sch01","Repères SNT et NSI",18,"Pour préparer le concours, il faut connaître les contenus informatiques. Pour enseigner, il faut aussi savoir à quels élèves et à quel programme on s’adresse.","SNT est un enseignement commun de seconde générale et technologique. Les ressources ministérielles couvrent notamment Internet, le Web, les réseaux sociaux, les données structurées, la géolocalisation, les objets connectés et la photographie numérique. NSI est une spécialité du cycle terminal général : elle approfondit les concepts d’informatique par la programmation, les données, les algorithmes, la machine et des projets. Le programme du CAPES 2027 renvoie aux enseignements en vigueur à la rentrée 2026. À partir de la rentrée 2027, le ministère prévoit aussi une heure hebdomadaire consacrée à l’IA dans SNT ; surveille la publication du programme révisé pour ta future pratique.","Une même notion, comme le routage, peut être abordée en SNT par une activité concrète d’itinéraire, puis approfondie en NSI avec un graphe pondéré et l’analyse d’un algorithme.","Le CAPES demande-t-il seulement de mémoriser des outils de programmation ?",["Oui, seulement Python","Non, il porte sur des concepts informatiques reliés aux programmes du lycée et à un programme complémentaire","Oui, seulement Java","Non, uniquement sur la pédagogie"],1,"Le programme officiel inclut de nombreux domaines informatiques. Le concours évalue aussi le raisonnement, l’argumentation, les documents et la réalisation informatique aux oraux.","Choisis une notion du parcours et imagine un exemple SNT accessible, puis une façon de l’approfondir en NSI.","Exemple : les données de localisation. En SNT, comparer des itinéraires ou lire des coordonnées ; en NSI, représenter un réseau par un graphe puis comparer des algorithmes de plus court chemin. Le scénario doit rester aligné sur les programmes en vigueur.",["SNT","NSI","programme","seconde","cycle terminal","projet"]),
      lesson("sch02","Transformer une notion en activité",17,"Un professeur rend une notion observable : les élèves manipulent, prédisent, testent et expliquent. Une activité bien construite relie une tâche à un objectif explicite.","Commence par un objectif précis et un résultat que l’élève peut montrer. Choisis une consigne courte, des données de départ, une progression de difficulté et des critères de réussite. Prévois les obstacles possibles : vocabulaire, syntaxe, environnement technique, gestion de groupe. Une trace écrite formalise ensuite la notion. Un projet peut intégrer plusieurs notions, mais chaque séance doit garder un objectif identifiable.","Objectif : comprendre qu’une recherche linéaire examine les éléments jusqu’à trouver la cible. Activité : les élèves exécutent l’algorithme sur trois listes, notent les comparaisons, puis formulent quand le coût est maximal.","Une activité de programmation est-elle réussie uniquement si tous les élèves finissent le code ?",["Oui, le résultat final est le seul critère","Non, il faut aussi observer le raisonnement, les tests, les échanges et la compréhension visée","Oui, il faut éviter les erreurs","Non, il n’est pas nécessaire d’avoir un objectif"],1,"Le code final ne montre pas à lui seul ce que les élèves ont compris. On définit des critères reliés à l’objectif et on observe aussi les démarches.","Construis un objectif observable et un critère de réussite pour une séance d’introduction aux piles.","Objectif possible : simuler les opérations empiler et dépiler. Critère : l’élève trace correctement l’état de la pile après une séquence donnée et explique l’ordre LIFO.",["objectif","consigne","critère de réussite","trace écrite","différenciation"])
    ]},
    { id:"profession", title:"Métier et entretien", short:"Entretien", color:"orange", icon:"✦", desc:"Préparer ta motivation, les mises en situation et les réponses liées au service public, à l’inclusion et au métier de professeur.", lessons:[
      lesson("pr01","Construire sa présentation de 5 minutes",16,"L’entretien commence par ton parcours et ta motivation. Une présentation claire n’est pas une liste de diplômes : elle relie des expériences à un projet professionnel.","Choisis un fil simple : ce qui t’a conduit à l’informatique, ce qui t’attire dans la transmission, et ce que tu as déjà fait pour vérifier ce projet. Appuie-toi sur deux exemples concrets et explique ce qu’ils t’ont appris. Termine par ce que tu veux construire comme professeur. Prépare un plan, pas un texte récité ; entraîne-toi avec un chronomètre et une version plus courte.","Plan possible : 1) une expérience qui a donné le goût de l’informatique ; 2) une expérience de transmission ou de coopération ; 3) pourquoi le métier et la NSI ; 4) les qualités encore à développer pendant la formation.","Quelle présentation est la plus convaincante ?",["Une liste exhaustive de cours suivis","Un récit court avec des exemples précis et un lien clair avec le métier","Un texte appris mot à mot","Une présentation qui évite de parler de ses expériences"],1,"Le jury cherche à comprendre ta motivation et ton parcours. Des exemples précis rendent ton propos personnel et permettent l’échange.","Note trois expériences ou apprentissages de ton parcours que tu pourrais relier au métier de professeur. Pour chacun, écris ce que cela t’a appris.","Le bon corrigé est personnel : explique une compétence, un obstacle rencontré et le lien avec l’enseignement. Évite les affirmations générales sans exemple.",["motivation","parcours","exemple","présentation","entretien"]),
      lesson("pr02","Répondre à une mise en situation",18,"À l’entretien, le jury veut voir comment tu analyses une situation professionnelle. Une bonne réponse montre une réaction immédiate, une prise en compte des élèves et un suivi adapté.","Clarifie les faits avant de juger. Protège les élèves concernés, pose un cadre calme, rappelle la règle ou la valeur en jeu et adapte la réponse à la situation. Si nécessaire, échange avec les personnes concernées et mobilise l’équipe selon les procédures de l’établissement. Dans tes réponses, parle de neutralité du service public, de lutte contre les discriminations, d’égalité entre filles et garçons, de laïcité, de transition écologique et d’épanouissement des élèves avec des actions concrètes. Le concours évalue ces dimensions à l’oral.","Situation : une élève dit que l’informatique « c’est surtout pour les garçons ». Réponse possible : interrompre calmement le stéréotype, ouvrir un échange respectueux, valoriser des parcours variés et veiller à une répartition équitable de la parole dans les activités.","Quand tu réponds à une situation délicate, quelle démarche est la plus solide ?",["Donner immédiatement une sanction identique dans tous les cas","Décrire les faits, protéger les élèves, rappeler le cadre et proposer un suivi proportionné","Éviter d’intervenir pour rester neutre","Demander aux élèves de régler seuls le problème"],1,"La neutralité ne consiste pas à laisser une situation de discrimination sans réponse. La réponse doit protéger les élèves, s’appuyer sur le cadre et être proportionnée.","Prépare une réponse en quatre étapes à la remarque stéréotypée de l’exemple. Distingue ce que tu fais immédiatement et le suivi après le cours.","Exemple de structure : stopper sans humilier ; rappeler le principe d’égalité ; redonner une place aux élèves concernés et reprendre l’activité ; observer les effets et échanger avec l’équipe si nécessaire. La réponse doit être adaptée aux faits précis.",["valeurs de la République","laïcité","neutralité","égalité","discrimination","inclusion"])
    ]}
  ];

  const lessonIndex = {};
  groups.forEach(function (group) { group.lessons.forEach(function (item) { item.group = group.id; lessonIndex[item.id] = item; }); });
  const totalLessons = Object.keys(lessonIndex).length;
  const syllabusBlocks = window.NSI_CURRICULUM || [];
  const themeSheets = window.NSI_THEME_SHEETS || [];
  const themeSheetIndex = {};
  themeSheets.forEach(function (sheet) { themeSheetIndex[sheet.id] = sheet; });
  const courseIndex = {};
  syllabusBlocks.forEach(function (block) { block.courses.forEach(function (course) { course.blockId = block.id; course.blockTitle = block.title; course.blockRef = block.ref; courseIndex[course.id] = course; }); });
  const syllabusCourses = Object.keys(courseIndex).map(function (id) { return courseIndex[id]; });
  const totalCourses = syllabusCourses.length;
  const courseDepth = window.NSI_COURSE_DEPTH || {};
  function courseNeighbors(course) {
    const index = syllabusCourses.findIndex(function (item) { return item.id === course.id; });
    return {index:Math.max(0,index),previous:index>0?syllabusCourses[index-1]:null,next:index>=0&&index<syllabusCourses.length-1?syllabusCourses[index+1]:null};
  }
  const courseCodeMap = {l01:"hello-function",l02:"positive-count",l03:"frequency-table",l04:"run-length-encode",l05:"prime-number",l06:"grid-paths",a01:"list-maximum",a02:"linear-search",a03:"balanced-parentheses",a04:"depth-first",a05:"breadth-first",a06:"binary-search",a07:"insertion-sort",a08:"dijkstra-weighted",a09:"merge-lists",a10:"fibonacci-dp",a11:"euclid-gcd",a12:"second-largest-distinct",d01:"binary-to-decimal",d04:"deduplicate",m06:"shortest-path-bfs"};
  const flashcards = window.NSI_FLASHCARDS || [];
  const practiceQuestions = window.NSI_PRACTICE_QUESTIONS || [];
  const openSubjects = window.NSI_OPEN_SUBJECTS || [];
  const practiceQuestionIndex = {};
  practiceQuestions.forEach(function (item) { if (groups.some(function (group) { return group.id === item.groupId; })) practiceQuestionIndex[item.id] = item; });

  const examDefinitions = {
    paper1: { title:"Écrit 1 · problèmes et programmation", duration:14400, coef:"Coefficient 3", format:"4 heures", prompts:[
      ["1 · Comprendre et spécifier", "Un établissement souhaite attribuer des créneaux de salle à des ateliers. Définis les entrées et sorties d’une fonction qui vérifie qu’un créneau est libre. Liste au moins deux cas limites à tester."],
      ["2 · Tracer un programme", "Écris une fonction Python qui reçoit une liste d’entiers et renvoie le deuxième plus grand élément distinct. Explique son comportement sur [4, 9, 9, 2] et sur une liste qui ne contient pas deux valeurs distinctes."],
      ["3 · Choisir une structure", "Les ateliers doivent être traités dans l’ordre d’arrivée. Propose une structure adaptée, décris les opérations utiles et explique leur coût attendu."],
      ["4 · Justifier le coût", "Un algorithme compare chaque atelier à tous les autres pour détecter les conflits d’horaires. Exprime son coût en fonction de n, puis propose une amélioration raisonnable et ses conditions."],
      ["5 · Vérifier la correction", "Énonce un invariant ou un argument qui permet de justifier la correction d’un parcours de liste qui calcule le maximum. Précise le cas d’initialisation et ce que garantit chaque itération."]
    ], rubric:["J’ai précisé les entrées, sorties et hypothèses.","J’ai traité les cas limites et testé des exemples.","Mon code est lisible et respecte la spécification.","J’ai expliqué le choix des structures et le coût.","J’ai justifié la correction avec un raisonnement clair."] },
    paper2: { title:"Écrit 2 · étude d’une situation concrète", duration:14400, coef:"Coefficient 2", format:"4 heures", prompts:[
      ["Situation", "Une médiathèque veut créer un outil qui suit les emprunts. Les documents fournis sont un petit schéma de base de données, des extraits de code Python et une description des règles d’emprunt. Votre réponse doit relier les besoins, les données et les traitements."],
      ["1 · Analyser les documents", "Quelles entités et relations déduis-tu des besoins ? Quels éléments du schéma ou du code doivent être clarifiés avant de modifier la solution ?"],
      ["2 · Compléter une solution", "Propose une requête SQL qui liste les emprunts en cours d’un lecteur donné. Explique la jointure et le filtre nécessaires. Indique comment gérer un résultat vide."],
      ["3 · Faire évoluer le programme", "Propose une structure de données et un algorithme pour vérifier si un lecteur a atteint sa limite d’emprunts. Décris au moins deux tests pertinents."],
      ["4 · Argumenter", "Explique une limite ou un risque de ta solution et une amélioration. Relie tes choix aux documents et à la problématique initiale."]
    ], rubric:["J’ai relié chaque réponse aux informations du dossier.","J’ai distingué les faits, les hypothèses et les propositions.","Ma requête SQL respecte le schéma fourni.","Mes évolutions sont cohérentes et testables.","J’ai justifié les compromis et les limites."] },
    oral1: { title:"Oral 1 · exposé disciplinaire", duration:9000, coef:"Coefficient 5", format:"2 h 30 de préparation · 1 h d’épreuve", prompts:[
      ["Sujet de préparation", "À partir d’un corpus sur les graphes et les itinéraires, prépare une réalisation informatique qui aide des élèves à comparer des trajets. Construis un graphe pondéré, implémente ou explique un algorithme, teste-le sur un cas lisible et prépare une présentation reliée aux documents."],
      ["Pendant les 2 h 30", "Repère la problématique et les contraintes du corpus. Définis une représentation des données, construis une réalisation qui fonctionne, prévois un exemple de démonstration, puis organise ton exposé en étapes et réserve du temps aux vérifications."],
      ["Exposé · 30 minutes", "Présente d’abord la problématique et le lien entre les documents. Explique ensuite ta réalisation, tes choix d’algorithmes, les tests et les limites. Termine en montrant ce que les résultats apprennent sur le thème."],
      ["Échange · 30 minutes", "Entraîne-toi à expliquer la correction, le coût, les autres approches possibles, les choix de représentation et ce que tu modifierais si les contraintes changeaient."]
    ], rubric:["J’ai construit une réalisation exécutable ou démontrable.","J’ai relié les documents à la réalisation.","J’ai expliqué mes choix et vérifié des cas pertinents.","Mon exposé suit un fil clair et tient dans le temps.","Je sais répondre en argumentant et en reconnaissant les limites."] },
    oral2: { title:"Oral 2 · motivation et entretien", duration:2100, coef:"Coefficient 3", format:"35 minutes", prompts:[
      ["Présentation · 5 minutes", "Prépare une présentation personnelle qui relie ton parcours, tes expériences et tes raisons de devenir professeur de NSI. Choisis deux exemples précis qui montrent ce que tu as appris et ce que tu apporteras au métier."],
      ["Échange sur ton parcours · 10 minutes", "Pourquoi enseigner la NSI ? Comment expliquerais-tu une notion informatique à des élèves très différents ? Quelle expérience t’a fait évoluer ? Comment réagirais-tu si tu ne connaissais pas immédiatement la réponse à une question d’élève ?"],
      ["Mise en situation · valeurs du service public", "Un élève fait une remarque stéréotypée sur les filles et l’informatique, et plusieurs élèves rient. Que fais-tu dans l’instant ? Comment reprends-tu la situation avec la classe ? Quelles valeurs et obligations professionnelles mobilises-tu ?"],
      ["Mise en situation · accompagnement", "Un groupe d’élèves n’arrive pas à démarrer un projet, tandis qu’un élève avance beaucoup plus vite. Comment organises-tu l’aide, la coopération et la différenciation sans décourager personne ?"]
    ], rubric:["Je donne des exemples personnels, concrets et sincères.","Je montre que je connais les responsabilités du professeur.","Je traite les situations avec calme, équité et discernement.","Je prends en compte l’inclusion et l’épanouissement des élèves.","Je structure mes réponses et j’explique mes choix."] }
  };

  const storageKey = "atelier-nsi-state-v1";
  const defaultState = { done:[], quizAnswers:{}, notes:{}, codeDrafts:{}, codeResults:{}, courseDrafts:{}, courseProgress:{}, courseId:null, curriculumFilter:"Toutes", codeExercise:null, activeDays:[], weekGoal:8, practiceLimit:15, filter:"Toutes", view:"course", currentGroup:null, currentLesson:null, practice:null, exam:null, flashIndex:0, flashRevealed:false, flashFilter:"Toutes", flashSessionLimit:15, flashSession:null, cardProgress:{}, diagnosticDone:false, diagnosticScore:null };
  const codeExercises = window.NSI_CODE_EXERCISES || [];
  let state = loadState();
  let timerHandle = null;
  let toastHandle = null;
  let supabase = null;
  let syncSession = null;
  let syncStatus = "local";
  let syncTimer = null;
  let pythonWorker = null;
  let pythonReadyPromise = null;
  let pythonRunResolver = null;
  let pythonRunId = 0;

  function loadState() {
    try {
      const loaded = Object.assign({}, defaultState, JSON.parse(localStorage.getItem(storageKey) || "{}"));
      if (["home", "curriculum", "path"].indexOf(loaded.view) >= 0) loaded.view = "course";
      if (!courseIndex[loaded.courseId]) loaded.courseId = null;
      return loaded;
    }
    catch (err) { return Object.assign({}, defaultState); }
  }
  function save() {
    state.updatedAt = Date.now();
    try { localStorage.setItem(storageKey, JSON.stringify(state)); } catch (err) {}
    if (syncSession && supabase) {
      clearTimeout(syncTimer);
      syncTimer = setTimeout(pushCloudState, 850);
      syncStatus = "ready";
    }
    updateSyncChrome();
  }
  function esc(value) { return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) { return ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "\"":"&quot;", "'":"&#39;" })[ch]; }); }
  function renderInlineMarkdown(value) {
    return String(value == null ? "" : value).split(/(`[^`]+`|\*\*[^*]+\*\*)/g).map(function(part){
      if(part.length>1&&part[0]==="`") return '<code class="inline-code">'+esc(part.slice(1,-1))+'</code>';
      if(part.indexOf("**")===0&&part.lastIndexOf("**")===part.length-2) return '<strong>'+esc(part.slice(2,-2))+'</strong>';
      return esc(part);
    }).join("");
  }
  function appEl() { return document.getElementById("app"); }
  function pct() { return Math.round(state.done.length / totalLessons * 100); }
  function todayKey(date) { return date.toLocaleDateString("sv-SE"); }
  function logStudy() {
    const day = todayKey(new Date());
    state.activeDays = (state.activeDays || []).filter(function (d) { return d !== day; });
    state.activeDays.push(day);
    state.activeDays = state.activeDays.slice(-90);
  }
  function fmtDays(n) { return n === 1 ? "1 jour" : n + " jours"; }
  function formatClock(seconds) {
    seconds = Math.max(0, seconds);
    const h = Math.floor(seconds / 3600), m = Math.floor((seconds % 3600) / 60), s = seconds % 60;
    return String(h).padStart(2,"0") + ":" + String(m).padStart(2,"0") + ":" + String(s).padStart(2,"0");
  }
  function toast(message) {
    const el = document.getElementById("toast");
    el.textContent = message; el.classList.add("show");
    clearTimeout(toastHandle); toastHandle = setTimeout(function () { el.classList.remove("show"); }, 2300);
  }
  function setView(view) {
    state.view = view; save(); render();
    if (window.innerWidth < 760) document.getElementById("sidebar").classList.remove("open");
    window.scrollTo({ top:0, behavior:"smooth" });
  }
  function nextLesson() {
    for (let i=0;i<groups.length;i++) for (let j=0;j<groups[i].lessons.length;j++) if (state.done.indexOf(groups[i].lessons[j].id) < 0) return {group:groups[i], lesson:groups[i].lessons[j]};
    return {group:groups[0], lesson:groups[0].lessons[0]};
  }
  function dayCount() {
    const firstExam = new Date(2027, 2, 9);
    const today = new Date();
    today.setHours(0,0,0,0);
    return Math.ceil((firstExam.getTime() - today.getTime()) / 86400000);
  }
  function preparationTimelinePct() {
    const start = new Date(2026, 9, 15);
    const end = new Date(2027, 2, 9);
    const today = new Date();
    today.setHours(0,0,0,0);
    return Math.round(Math.max(0, Math.min(1, (today.getTime() - start.getTime()) / (end.getTime() - start.getTime()))) * 100);
  }
  function updateChrome() {
    const remaining = dayCount();
    document.getElementById("days-left").textContent = remaining > 0 ? remaining : "C’est parti";
    const timelineProgress = preparationTimelinePct();
    document.getElementById("goal-track").style.width = timelineProgress + "%";
    const timeline = document.querySelector(".goal-track");
    if (timeline) timeline.setAttribute("aria-valuenow", String(timelineProgress));
    const legacyCount = document.getElementById("nav-count");
    if (legacyCount) legacyCount.textContent = totalLessons - state.done.length;
    const codeCount = document.getElementById("code-count");
    if (codeCount) codeCount.textContent = codeExercises.filter(function (exercise) { return state.codeResults && state.codeResults[exercise.id] && state.codeResults[exercise.id].passed; }).length + "/" + codeExercises.length;
    const courseCount = document.getElementById("course-count");
    if (courseCount) courseCount.textContent = courseCountValidated() + "/" + totalCourses;
    document.getElementById("review-count").textContent = cardsDueNow(reviewCards()).length;
    document.querySelectorAll(".nav-item").forEach(function (button) {
      const route = button.getAttribute("data-nav");
      const active = route === state.view || (route === "path" && state.view === "lesson") || (route === "exams" && state.view === "exam") || (route === "curriculum" && state.view === "course");
      button.classList.toggle("active", active);
    });
  }
  function render() {
    if (timerHandle) { clearInterval(timerHandle); timerHandle = null; }
    updateChrome();
    const views = {path:renderPath,lesson:renderLesson,curriculum:renderCurriculum,course:renderCourse,practice:renderPractice,code:renderCode,exams:renderExams,exam:renderExam,review:renderReview};
    appEl().innerHTML = (views[state.view] || renderCourse)();
    if (state.view === "code") bindCodeWorkbench();
    if ((state.view === "exam" && state.exam) || (state.view === "practice" && state.practice && !state.practice.finished)) startTimerRefresh();
  }

  function groupProgress(group) {
    const done = group.lessons.filter(function (l) { return state.done.indexOf(l.id) >= 0; }).length;
    return { done:done, total:group.lessons.length, pct:Math.round(done / group.lessons.length * 100) };
  }
  function renderGroupCard(group) {
    const p = groupProgress(group);
    return '<article class="module-card" data-action="open-group" data-group="' + group.id + '"><div class="module-card-head"><span class="module-icon ' + group.color + '">' + group.icon + '</span><span class="module-status ' + (p.pct === 100 ? "done" : "") + '">' + (p.pct === 100 ? "Terminé" : p.done + "/" + p.total + " leçons") + '</span></div><h3>' + group.title + '</h3><p>' + group.desc + '</p><div class="module-card-foot"><span>' + group.lessons.length + ' leçons</span><span>' + p.pct + '%</span></div><div class="module-progress"><span style="width:' + p.pct + '%"></span></div></article>';
  }

  function renderPath() {
    const filter = state.filter || "Toutes";
    const groupNames = ["Toutes"].concat(groups.map(function (g) { return g.short; }));
    let filtered = groups;
    if (filter !== "Toutes") filtered = groups.filter(function (g) { return g.short === filter; });
    return '<div class="page-header"><div><div class="eyebrow">Le programme, en clair</div><h1>Mon parcours</h1><p>Chaque notion part des bases et progresse vers les attentes du concours. Avance dans l’ordre ou reviens sur un thème quand tu en as besoin.</p></div><button class="secondary-button" data-action="start-diagnostic">✳ Refaire le diagnostic</button></div>' +
      '<div class="progress-banner"><div class="progress-ring" data-value="' + pct() + '%" style="--progress:' + pct() + '%"></div><div><strong>' + state.done.length + ' leçons validées sur ' + totalLessons + '</strong><p>La progression est enregistrée dans ce navigateur, sur cet appareil.</p></div></div>' +
      '<div class="filter-row">' + groupNames.map(function (name) { return '<button class="filter-chip ' + (filter === name ? "active" : "") + '" data-action="filter" data-filter="' + esc(name) + '">' + esc(name) + '</button>'; }).join("") + '</div>' +
      '<div class="module-grid">' + filtered.map(renderGroupCard).join("") + '</div>' +
      '<div class="section-heading" style="margin-top:28px"><div><div class="section-kicker">Les quatre épreuves</div><h2>Préparation concours intégrée</h2><p>Deux écrits et deux oraux, avec leurs formats officiels.</p></div><button class="text-button" data-nav="exams">Voir les épreuves <span class="tiny-arrow">→</span></button></div>';
  }

  function renderLesson() {
    const group = groups.find(function (g) { return g.id === state.currentGroup; }) || groups[0];
    const index = Math.max(0, Math.min(group.lessons.length - 1, Number(state.currentLesson) || 0));
    const item = group.lessons[index];
    state.currentGroup = group.id; state.currentLesson = index;
    const stored = state.quizAnswers[item.id];
    const complete = state.done.indexOf(item.id) >= 0;
    const nav = group.lessons.map(function (l,i) { return '<button class="' + (i === index ? "active" : "") + '" data-action="lesson-select" data-index="' + i + '">' + (state.done.indexOf(l.id) >= 0 ? "✓ " : (i+1) + ". ") + esc(l.title) + '</button>'; }).join("");
    let options = item.options.map(function (option, i) {
      let cls = "quiz-option";
      if (stored && stored.choice === i) cls += " selected";
      if (stored && i === item.answer) cls += " correct";
      if (stored && !stored.correct && stored.choice === i) cls += " wrong";
      return '<button class="' + cls + '" data-action="answer-lesson" data-choice="' + i + '" ' + (stored ? "disabled" : "") + '><span>' + String.fromCharCode(65+i) + '.</span> ' + esc(option) + '</button>';
    }).join("");
    const unknownOption = '<button class="quiz-option unknown ' + (stored && stored.choice === "unknown" ? "selected" : "") + '" data-action="answer-lesson" data-choice="unknown" ' + (stored ? "disabled" : "") + '><span aria-hidden="true">?</span> Je ne sais pas</button>';
    const feedback = stored ? '<div class="quiz-feedback ' + (!stored.correct && !stored.unknown ? "error" : "") + '">' + (stored.correct ? "Bien vu ! " : stored.unknown ? "Merci de l’indiquer : cette notion est à revoir. " : "On reprend le raisonnement. ") + esc(item.feedback) + (stored.correct ? "" : ' <button class="text-button" style="font-size:9px" data-action="retry-lesson" data-id="'+item.id+'">Réessayer le quiz</button>') + '</div>' : '';
    const savedNote = state.notes[item.id] || "";
    return '<div class="lesson-layout"><aside class="lesson-nav"><div class="lesson-nav-label">' + esc(group.title) + '</div>' + nav + '</aside><article class="lesson-main"><button class="back-link" data-nav="path">← Retour aux thèmes</button><div class="lesson-title-row"><span class="module-icon ' + group.color + '">' + group.icon + '</span><div><h1>' + esc(item.title) + '</h1><div class="lesson-meta"><span>' + group.short + '</span><span>·</span><span>' + item.minutes + ' min</span><span>·</span><span>' + (complete ? "Leçon validée ✓" : "Leçon guidée") + '</span></div></div></div><p class="lesson-intro">' + esc(item.intro) + '</p>' +
      '<section class="lesson-content-card"><h2>Comprendre l’idée</h2><p>' + esc(item.explanation) + '</p><div class="key-takeaway"><span>✦</span><span><b>À retenir</b> · ' + esc(item.keywords.slice(0,3).join(" · ")) + ' : pars toujours de la définition du problème, puis justifie chaque choix.</span></div></section>' +
      '<section class="lesson-content-card"><h2>Exemple commenté</h2><div class="code-block">' + esc(item.example) + '</div><p>Lis chaque étape et demande-toi ce qui est connu avant l’instruction, puis ce qui change après.</p></section>' +
      '<section class="quiz-card"><h3>Vérifie que tu as compris</h3><div class="quiz-question">' + esc(item.question).replace(/\n/g,"<br>") + '</div><div class="quiz-options">' + options + unknownOption + '</div>' + feedback + '</section>' +
      '<section class="exercise-card"><h3>À toi de jouer</h3><p>' + esc(item.challenge) + '</p><textarea class="answer-area" data-note="' + item.id + '" placeholder="Écris tes idées ou ton code ici…">' + esc(savedNote) + '</textarea><div class="exercise-actions"><button class="secondary-button" data-action="reveal-solution" data-id="' + item.id + '">Voir le corrigé détaillé</button><span class="microcopy">Ton brouillon reste enregistré sur cet appareil.</span></div><div id="solution-' + item.id + '" class="solution-box" hidden>' + esc(item.solution).replace(/\n/g,"<br>") + '</div></section>' +
      '<div class="lesson-complete-bar"><p>' + (stored && stored.correct ? "Tu as le feu vert pour valider cette leçon." : "Réponds correctement au quiz pour valider cette leçon.") + '</p><button class="' + (complete ? "secondary-button" : "primary-button") + '" data-action="complete-lesson" data-id="' + item.id + '" ' + (!(stored && stored.correct) && !complete ? "disabled style=\"opacity:.48;cursor:not-allowed\"" : "") + '>' + (complete ? "Leçon validée ✓" : "Valider la leçon") + '</button></div>' +
      (index < group.lessons.length-1 ? '<button class="text-button" style="margin-top:15px" data-action="lesson-select" data-index="' + (index+1) + '">Leçon suivante : ' + esc(group.lessons[index+1].title) + ' →</button>' : '') + '</article></div>';
  }

  function courseProgress(course) {
    const progress = state.courseProgress[course.id] || {};
    const activeIds = new Set(courseTasks(course).map(function (task) { return task.id; }));
    const checked = Array.isArray(progress.checked) ? progress.checked.filter(function (id) { return activeIds.has(id); }) : [];
    const revealed=Array.isArray(progress.revealed)?progress.revealed:[], rubric=Array.isArray(progress.rubric)?progress.rubric:[];
    const required=["application","edge","transfer","exam","drill-advanced"];
    const validated=Boolean(progress.validated&&checked.length>=6&&rubric.length>=3&&required.every(function(id){return checked.indexOf(id)>=0;}));
    return {checked:checked, revealed:revealed, rubric:rubric, validated:validated};
  }
  function courseCountValidated() {
    return syllabusCourses.filter(function (course) { return courseProgress(course).validated; }).length;
  }
  function renderCurriculum() {
    const validated = courseCountValidated();
    return '<div class="page-header curriculum-header"><div><div class="eyebrow">Programme de préparation · session 2027</div><h1>Le parcours, leçon après leçon</h1><p>Une leçon guidée, un exemple manipulable, des exercices progressifs et une fiche globale par thème.</p></div><div class="curriculum-total" aria-label="' + validated + ' leçons validées sur ' + totalCourses + '"><div class="curriculum-total-count"><strong>' + validated + '</strong><span> / ' + totalCourses + '</span></div><small>LEÇONS VALIDÉES</small><span class="module-progress"><span style="width:' + Math.round(100*validated/totalCourses) + '%"></span></span></div></div>' +
      syllabusBlocks.map(function (block) {
        const finished = block.courses.filter(function (course) { return courseProgress(course).validated; }).length;
        return '<section class="curriculum-block"><div class="curriculum-block-head"><div><span class="section-kicker">' + block.courses.length + ' cours · programme officiel</span><h2>' + esc(block.title) + '</h2><p>' + esc(block.ref) + '</p></div><span class="curriculum-block-count">' + finished + ' / ' + block.courses.length + '</span></div><div class="module-progress"><span style="width:' + Math.round(100*finished/block.courses.length) + '%"></span></div><div class="curriculum-course-grid">' + block.courses.map(function (course,index) {
          const progress=courseProgress(course), count=progress.checked.length;
          const badge=progress.validated?'Validée':count?'En cours':'À commencer';
          const taskCount=courseTasks(course).length;
          return '<button class="curriculum-course-card ' + (progress.validated?'is-validated':'') + '" data-action="open-course" data-id="' + course.id + '"><span class="course-card-top"><span class="course-number">' + String(index+1).padStart(2,'0') + '</span><span class="course-status">' + badge + '</span></span><strong>' + esc(course.title) + '</strong><span class="course-card-meta">' + count + ' / ' + taskCount + ' étapes comparées · ' + (progress.validated?'validation enregistrée':course.sheet.length+' repères de fiche') + '</span><span class="module-progress"><span style="width:' + (progress.validated?100:Math.round(100*count/taskCount)) + '%"></span></span></button>';
        }).join("") + '</div></section>';
      }).join("") + '<p class="curriculum-source-note">Les thèmes disciplinaires sont alignés sur le programme spécifique 2027 et les cours lycée sur les programmes en vigueur ; ouvre « Sources officielles » pour consulter les textes de référence.</p>';
  }
  function courseTasks(course) {
    const apply=course.apply, edge=course.edge, transfer=course.transfer, exam=course.exam;
    const deep=courseDepth[course.id]||{};
    const drills=Array.isArray(deep.drills)?deep.drills:[];
    return [
      {id:"recall",level:"Étape 1 · restituer",title:"Rappeler l’idée sans le cours",prompt:"Sans regarder la leçon, explique en quelques lignes la notion « "+course.title+" ». Donne une définition, une propriété et un exemple. Cette étape sert à repérer ce qui reste flou avant les problèmes.",correction:course.lesson+"\n\nRepères à restituer : "+course.sheet.join(" · "),criteria:["La définition est formulée sans recopier une phrase isolée.","Une propriété importante est exacte.","L’exemple correspond réellement à la notion."]},
      {id:"drill-foundation",level:"Étape 2 · consolider",title:(drills[0]&&drills[0].title)||"Exercice de consolidation",prompt:(drills[0]&&drills[0].prompt)||"Explique une propriété centrale de cette notion et illustre-la par un exemple.",correction:(drills[0]&&drills[0].correction)||course.lesson,criteria:["La réponse traite la consigne précise.","Le raisonnement est explicite.","Les notations et hypothèses sont correctes."]},
      {id:"application",level:"Étape 3 · appliquer",title:"Exercice d’application",prompt:apply[0],correction:apply[1],criteria:["Toutes les parties de la consigne sont traitées.","Le résultat est justifié, pas seulement annoncé.","Au moins un cas utile est vérifié."]},
      {id:"edge",level:"Étape 4 · approfondir",title:"Hypothèses et cas limite",prompt:edge[0],correction:edge[1],criteria:["La précondition ou le cas limite est identifié.","Son effet sur la méthode est expliqué.","Le traitement proposé respecte le contrat."]},
      {id:"debug",level:"Étape 5 · déboguer",title:"Diagnostiquer une erreur",prompt:"Un candidat écrit ou affirme : « "+course.pitfall[0]+" » Explique pourquoi le raisonnement ne tient pas, construis un contre-exemple si possible, puis reformule la réponse correcte.",correction:course.pitfall[1],criteria:["La confusion est nommée précisément.","Un effet concret de l’erreur est montré.","La correction est justifiée."]},
      {id:"transfer",level:"Étape 6 · transférer",title:"Résoudre un problème nouveau",prompt:transfer[0],correction:transfer[1],criteria:["La notion utile est reconnue.","La méthode est adaptée au nouveau contexte.","Les limites et hypothèses sont dites."]},
      {id:"drill-advanced",level:"Étape 7 · consolider",title:(drills[1]&&drills[1].title)||"Exercice de consolidation avancé",prompt:(drills[1]&&drills[1].prompt)||"Justifie une limite de la méthode et propose un test qui pourrait la révéler.",correction:(drills[1]&&drills[1].correction)||course.pitfall[1],criteria:["La réponse mobilise plusieurs éléments de la leçon.","Chaque étape est justifiée.","Le résultat est contrôlé par un cas pertinent."]},
      {id:"exam",level:"Étape 8 · niveau concours",title:"Problème de niveau épreuve",prompt:exam[0],correction:exam[1],criteria:["La réponse est structurée et lisible.","Les choix, résultats et hypothèses sont justifiés.","Les limites pertinentes sont traitées.","Une relecture permet de vérifier la cohérence."]},
      {id:"oral",level:"Étape 9 · expliquer",title:"Expliquer la notion à voix haute",prompt:"Prépare une explication de 90 secondes : problème de départ, définition, exemple, justification, piège à éviter et lien avec une autre notion. Parle à voix haute ou écris un plan, puis vérifie que chaque étape est compréhensible sans le cours.",correction:"Repères à faire apparaître : "+course.sheet.join(" · ")+". Une explication solide part du besoin, introduit les mots précis, déroule un exemple et vérifie une limite. Cette activité entraîne l’exposé disciplinaire ; elle ne remplace pas la préparation de l’entretien.",criteria:["Le vocabulaire est exact et expliqué.","L’exemple sert la démonstration.","Le fil tient en 90 secondes et répond au problème posé."]}
    ];
  }
  function courseTaskMinutes(taskId) {
    return {recall:5,"drill-foundation":8,application:8,edge:8,debug:8,transfer:12,"drill-advanced":10,exam:20,oral:6}[taskId]||8;
  }
  function courseTaskHint(taskId) {
    return {
      recall:"Repars de l’objectif de la leçon : formule l’idée avec tes mots, puis invente un mini-exemple qui permet de vérifier chaque terme.",
      "drill-foundation":"Repère d’abord les données et le résultat demandé. Essaie le plus petit exemple non trivial et écris ce qui change à chaque étape.",
      application:"Avant de calculer, reformule la consigne et liste les étapes intermédiaires. Vérifie ensuite que ta réponse traite chaque partie.",
      edge:"Teste un cas très petit, une borne, une valeur vide ou une entrée hors domaine. Dis explicitement si le contrat autorise ce cas.",
      debug:"Cherche la phrase la plus forte dans l’affirmation. Tente de la réfuter avec le plus petit contre-exemple possible, puis écris une version exacte.",
      transfer:"Traduis la situation nouvelle en entrées, résultat attendu et hypothèses. Demande-toi ensuite quelle idée du cours répond au besoin.",
      "drill-advanced":"Compare deux démarches plausibles. Pour chacune, précise ses préconditions, son coût ou sa limite ; cherche un cas où le choix compte.",
      exam:"Structure ta copie : contrat et hypothèses, méthode choisie, raisonnement détaillé, contrôle du résultat, puis limites ou coût lorsque c’est pertinent.",
      oral:"En 90 secondes : besoin, définition, exemple joué étape par étape, justification, piège et lien avec une autre notion. Explique les termes avant de les employer."
    }[taskId]||"Commence par reformuler le problème, puis sépare les données, la méthode et le contrôle du résultat.";
  }
  function workedExampleSteps(course) {
    let lines=String(course.worked||"").split(/\r?\n/).map(function(line){return line.trimEnd();}).filter(function(line){return line.trim();});
    if(lines.length===1&&lines[0].length>75){
      const parts=lines[0].split(/;\s+|(?<=\.)\s+(?=[A-ZÀ-ÖØ-Þ0-9«(])/).map(function(line){return line.trim();}).filter(Boolean);
      if(parts.length>1) lines=parts;
    }
    return lines.length?lines:[String(course.worked||"Exemple à compléter.")];
  }
  function highlightWorkedLine(line, course) {
    const keywords={def:1,return:1,if:1,elif:1,else:1,for:1,while:1,in:1,range:1,break:1,continue:1,class:1,self:1,public:1,private:1,static:1,void:1,int:1,double:1,new:1,SELECT:1,FROM:1,WHERE:1,JOIN:1,ON:1,ORDER:1,BY:1,GROUP:1,HAVING:1,AND:1,OR:1,NOT:1,INSERT:1,UPDATE:1,DELETE:1,TRUE:1,FALSE:1,try:1,except:1,raise:1,assert:1,lambda:1,import:1,as:1,pass:1,async:1,await:1};
    const pattern=/(?:#.*$|\/\/.*$|--.*$|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`[^`]*`|\b[A-Za-z_][A-Za-z_0-9]*\b|\b\d+(?:\.\d+)?\b)/g;
    return String(line).replace(pattern,function(token,offset,whole){
      let cls="";
      if(token[0]==="#"||token.slice(0,2)==="//"||token.slice(0,2)==="--") cls="code-comment";
      else if(token[0]==='"'||token[0]==="'"||token[0]==="`") cls="code-string";
      else if(/^\d/.test(token)) cls="code-number";
      else if(/^(?:True|False|None|true|false|null|undefined)$/.test(token)) cls="code-literal";
      else if(keywords[token]) cls="code-keyword";
      else if(/^[A-Za-z_][A-Za-z_0-9]*$/.test(token)&&/^\s*\(/.test(whole.slice(offset+token.length))) cls="code-call";
      return cls?'<span class="'+cls+'">'+esc(token)+'</span>':esc(token);
    });
  }
  function renderWorkedCode(course, source) {
    return String(source).split("\n").map(function(line,index){return '<span class="code-line"><span class="code-line-number" aria-hidden="true">'+String(index+1).padStart(2,"0")+'</span><span class="code-line-text">'+highlightWorkedLine(line,course)+'</span></span>';}).join("");
  }
  function renderWorkedExampleDisplay(course, source) {
    const narrativeBlocks=["teaching","interview"];
    const looksStructured=/(?:\bdef\s+|\bclass\s+|\b(?:if|for|while|return|assert|SELECT|FROM|WHERE|JOIN|UPDATE|INSERT|DELETE)\b|<\/?[A-Za-z][^>]*>|(?:->|=>|:=)|\b(?:True|False|None)\b|\n\s{2,})/i.test(source);
    if(narrativeBlocks.indexOf(course.blockId)>=0&&!looksStructured||!looksStructured&&String(course.worked||"").length>95){
      return '<blockquote class="worked-example-narrative"><span>MISE EN SITUATION</span><p>'+renderInlineMarkdown(source).replace(/\n/g,"<br>")+'</p></blockquote>';
    }
    const label=course.blockId==='lang'&&/^l0[78]$/.test(course.id)?'Java':course.blockId==='dataweb'&&/^d0[78]$/.test(course.id)?'SQL':course.blockId==='dataweb'&&course.id==='d11'?'XML':course.blockId==='dataweb'&&course.id==='d10'?'HTML / CSS':course.blockId==='systems'&&course.id==='s04'?'Assembleur':course.blockId==='dataweb'&&course.id==='d12'?'JavaScript':course.blockId==='systems'&&/^s0[12]$/.test(course.id)?'Architecture':course.blockId==='math'?'Notation / trace':course.blockId==='algo'?'Pseudo-code / Python':'Exemple guidé';
    return '<div class="worked-code-frame"><div class="worked-code-bar"><span><i></i><i></i><i></i></span><b>'+esc(label)+'</b><span>lecture pas à pas</span></div><pre class="course-worked" aria-live="polite"><code>'+renderWorkedCode(course,source)+'</code></pre></div>';
  }
  function renderInlinePythonExample(exercise) {
    const hasDraft=Object.prototype.hasOwnProperty.call(state.codeDrafts,exercise.id);
    const draft=hasDraft?state.codeDrafts[exercise.id]:exercise.starter;
    const previous=state.codeResults[exercise.id];
    const tests=exercise.tests.map(function(test,index){return '<li><span class="test-index">0'+(index+1)+'</span><span>'+esc(test.label)+'</span></li>';}).join("");
    const result=previous?renderCodeResult(exercise,previous):'<div class="code-result-placeholder"><span>↵</span><p>Lance le code pour voir les tests passer un à un et recevoir une piste si besoin.</p></div>';
    return '<details class="inline-python-details"><summary>Écrire et exécuter ce code · '+exercise.tests.length+' tests automatiques</summary><div class="inline-python-body"><p class="code-task-goal">'+esc(exercise.goal)+'</p><div class="code-prompt"><span class="prompt-label">TA MISSION</span><p>'+esc(exercise.prompt)+'</p></div><details class="code-hints"><summary>Un indice si tu bloques</summary><ol>'+exercise.hints.map(function(hint){return '<li>'+esc(hint)+'</li>';}).join("")+'</ol></details><div class="editor-shell"><div class="editor-bar"><span class="editor-file"><i></i>'+esc(exercise.id)+'.py</span><span>Python · sur cet appareil</span><button class="editor-reset" data-action="reset-code" data-id="'+esc(exercise.id)+'">Réinitialiser</button></div><textarea class="python-editor" data-code-editor="'+esc(exercise.id)+'" aria-label="Éditeur Python · '+esc(exercise.title)+'" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" wrap="off">'+esc(draft)+'</textarea><div class="editor-footer"><span><kbd>Ctrl</kbd> + <kbd>Entrée</kbd> pour exécuter</span><span>Tab pour indenter</span></div></div><div class="code-action-row"><button class="run-code-button" data-action="run-course-code" data-id="'+esc(exercise.id)+'">▶ &nbsp; Exécuter et corriger</button><span class="code-run-note">'+exercise.tests.length+' cas de pratique</span></div><section class="python-result" data-course-code-result="'+esc(exercise.id)+'" aria-live="polite">'+result+'</section><ul class="test-preview">'+tests+'</ul><details class="reference-solution"><summary>Voir le corrigé commenté</summary><pre>'+esc(exercise.solution)+'</pre><p>'+esc(exercise.explanation)+'</p></details><p class="python-runtime-note">Python tourne dans un Web Worker sur cet appareil ; ton code n’est pas envoyé à un serveur. Le premier lancement télécharge l’interpréteur.</p></div></details>';
  }
  function renderCourseExample(course) {
    const steps=workedExampleSteps(course),raw=state.courseProgress[course.id]||{};
    const current=Math.max(0,Math.min(steps.length-1,Number(raw.exampleStep)||0));
    const draftKey=course.id+":example",draft=state.courseDrafts[draftKey]||"";
    const linkedCode=courseCodeMap[course.id];
    const linkedExercise=codeExercises.find(function(item){return item.id===linkedCode;});
    const pythonExample=linkedExercise?renderInlinePythonExample(linkedExercise):'';
    const visible=steps.slice(0,current+1).join("\n");
    const complete=current===steps.length-1;
    const back=current>0?'<button class="secondary-button" data-action="example-step" data-course="'+esc(course.id)+'" data-dir="back">← Revenir</button>':'';
    const forward=complete?'<span class="example-complete-label">Déroulé terminé · compare avec ta prédiction</span>':'<button class="primary-button" data-action="example-step" data-course="'+esc(course.id)+'" data-dir="next">'+(draft.trim()?'Afficher la suite →':'Je bloque · afficher la suite →')+'</button>';
    const reveal='<button class="text-button" data-action="example-step" data-course="'+esc(course.id)+'" data-dir="'+(complete?'reset':'all')+'">'+(complete?'Recommencer depuis le début':'Révéler le déroulé complet')+'</button>';
    const takeaways=complete?'<div class="example-takeaways"><div><b>À retenir</b><ul>'+course.sheet.slice(0,3).map(function(item){return '<li>'+esc(item)+'</li>';}).join('')+'</ul></div><div><b>Piège à éviter</b><p>'+esc(course.pitfall[0])+'</p></div><p class="example-self-check">'+(linkedExercise?'Compare ta prédiction au déroulé, puis teste ton code dans l’atelier juste au-dessus.':'Compare ta prédiction au déroulé et justifie chaque étape avec les repères du cours.')+'</p></div>':'';
    return '<section class="course-content-panel course-example-panel" id="course-example"><div class="section-kicker">EXEMPLE INTERACTIF</div><h2>Observe, prédis, puis déroule</h2><p class="course-muted">Lis ce qui est affiché, écris ce que tu penses qu’il va se passer, puis avance étape par étape. Tu peux révéler la suite même si tu ne sais pas encore.</p><div class="example-step-status"><span>Étape <strong>'+(current+1)+'</strong> / '+steps.length+'</span><span class="example-step-track"><i style="width:'+Math.round(100*(current+1)/steps.length)+'%"></i></span></div>'+renderWorkedExampleDisplay(course,visible)+'<label class="example-prediction-label" for="example-answer-'+esc(course.id)+'">Ta prédiction · brouillon enregistré automatiquement</label><textarea class="example-prediction" id="example-answer-'+esc(course.id)+'" data-course-example-draft="'+esc(draftKey)+'" placeholder="Écris le résultat attendu, la prochaine étape ou la règle que tu observes…">'+esc(draft)+'</textarea><div class="example-actions">'+back+forward+reveal+'</div>'+pythonExample+takeaways+'</section>';
  }
  function renderCourseMethod(course, deep, sheet) {
    const block=syllabusBlocks.find(function(item){return item.id===course.blockId;});
    const currentIndex=block?block.courses.findIndex(function(item){return item.id===course.id;}):-1;
    const previous=currentIndex>0?block.courses[currentIndex-1]:null;
    const steps=(sheet&&sheet.method||[]).map(function(step,index){return '<li><span>'+String(index+1).padStart(2,'0')+'</span><p>'+esc(step)+'</p></li>';}).join('');
    const diagram=(sheet&&sheet.diagram||[]).map(function(label,index){return '<li><span>'+esc(label)+'</span>'+(index<(sheet.diagram.length-1)?'<b aria-hidden="true">→</b>':'')+'</li>';}).join('');
    const prerequisite=previous?'<p class="course-prerequisite">Repère utile si tu bloques : <button class="text-button" data-action="open-course" data-id="'+esc(previous.id)+'">'+esc(previous.title)+' ↗</button>. Tu peux revenir ici ensuite ; aucune étape n’est verrouillée.</p>':'<p class="course-prerequisite">Tu peux commencer ici sans prérequis caché. Les mots nécessaires sont définis dans les explications.</p>';
    return '<section class="course-learning-guide"><div class="section-kicker">LE FIL DE LA NOTION</div><h3>Ce que tu vas apprendre et comment raisonner</h3><p class="course-learning-goal">'+esc(deep.goal||'À la fin, tu dois pouvoir expliquer la notion et la mobiliser sur un problème nouveau.')+'</p>'+prerequisite+'<div class="course-method-title"><strong>'+esc(sheet?sheet.methodTitle:'Une méthode de travail')+'</strong><p>'+esc(sheet?sheet.why:'Commence par comprendre le besoin, formule les hypothèses, puis vérifie chaque étape.')+'</p></div><ol class="course-method-steps">'+steps+'</ol><div class="course-schema-wrap"><span>Le chemin de raisonnement</span><ol class="course-schema" aria-label="'+esc((sheet&&sheet.diagram||[]).join(' puis '))+'">'+diagram+'</ol></div><p class="course-method-check"><b>Vérification active</b> · '+esc(sheet?sheet.checkpoint:'Peux-tu expliquer la méthode avec un exemple qui n’apparaît pas dans le cours ?')+'</p><p class="course-method-transfer">À appliquer maintenant à <strong>'+esc(course.title)+'</strong> : '+esc(course.pitfall[1])+'</p></section>';
  }
  function renderCourseConceptMap(course) {
    const cards=course.sheet.map(function(point,index){
      const parts=point.split(/[:：]/),label=parts.length>1?parts.shift().trim():"Repère clé",detail=parts.join(":").trim()||point;
      return '<article class="concept-map-card"><span>0'+(index+1)+'</span><h4>'+renderInlineMarkdown(label)+'</h4><p>'+renderInlineMarkdown(detail)+'</p></article>';
    }).join('');
    return '<section class="course-concept-map" aria-label="Carte des idées clés de la leçon"><div class="concept-map-heading"><div><span class="section-kicker">CARTE DE LA NOTION</span><h3>'+esc(course.title)+'</h3></div><span>4 repères à relier</span></div><div class="concept-map-grid">'+cards+'</div></section>';
  }
  function renderThemeSheet(sheet) {
    if(!sheet) return '';
    const courses=sheet.courses.map(function(item,index){
      return '<details class="theme-sheet-course"><summary><span>'+String(index+1).padStart(2,'0')+'</span><strong>'+esc(item.title)+'</strong></summary><ul>'+item.points.map(function(point){return '<li>'+esc(point)+'</li>';}).join('')+'</ul><button class="text-button theme-sheet-open-course" data-action="open-course" data-id="'+esc(item.id)+'">Ouvrir cette leçon →</button></details>';
    }).join('');
    const steps=sheet.method.map(function(step,index){return '<li><b>'+String(index+1).padStart(2,'0')+'</b><span>'+esc(step)+'</span></li>';}).join('');
    const diagram=sheet.diagram.map(function(label,index){return '<li><span>'+esc(label)+'</span>'+(index<sheet.diagram.length-1?'<b aria-hidden="true">→</b>':'')+'</li>';}).join('');
    const ref=syllabusBlocks.find(function(block){return block.id===sheet.id;});
    return '<section class="course-sheet" id="course-sheet"><div class="section-kicker">04 · FICHE DE RÉVISION DU THÈME</div><h2>'+esc(sheet.title)+'</h2><p>'+esc(sheet.promise)+' Cette fiche rassemble les repères des '+sheet.courses.length+' leçons du thème ; ouvre chaque partie pour revoir les notions sans multiplier les fiches isolées.</p><div class="theme-sheet-method"><h3>'+esc(sheet.methodTitle)+'</h3><p>'+esc(sheet.why)+'</p><ol>'+steps+'</ol><div class="course-schema-wrap"><span>Schéma de raisonnement</span><ol class="course-schema" aria-label="'+esc(sheet.diagram.join(' puis '))+'">'+diagram+'</ol></div><p class="course-method-check"><b>Question de contrôle</b> · '+esc(sheet.checkpoint)+'</p></div><details class="theme-sheet-details"><summary>Ouvrir les repères des '+sheet.courses.length+' leçons du thème</summary><div class="theme-sheet-course-list">'+courses+'</div></details><div class="course-sheet-footer"><span>Fiche globale · '+sheet.courses.length+' leçons · programme : '+esc(ref?ref.ref:'CAPES NSI bac+3')+'</span><button class="text-button" data-action="print-fiche">Imprimer la fiche du thème</button></div></section>';
  }
  function renderCoursePicker(course) {
    const block=syllabusBlocks.find(function(item){return item.id===course.blockId;});
    if(!block) return '';
    return '<label class="course-picker-label" for="course-picker">Aller directement à une leçon de ce thème<select id="course-picker" class="course-picker" data-course-picker aria-label="Choisir une leçon parmi les '+block.courses.length+' leçons du thème '+esc(block.title)+'">'+block.courses.map(function(item,index){return '<option value="'+esc(item.id)+'" '+(item.id===course.id?'selected':'')+'>'+String(index+1).padStart(2,'0')+' · '+esc(item.title)+'</option>';}).join('')+'</select></label>';
  }
  function renderCourse() {
    const course=courseIndex[state.courseId]||syllabusCourses.find(function(item){return !courseProgress(item).validated;})||syllabusCourses[0];
    if(!course) return '<section class="lesson-content-card"><p>La bibliothèque de cours ne s’est pas chargée.</p></section>';
    state.courseId=course.id;
    const progress=courseProgress(course), tasks=courseTasks(course), checkedCount=progress.checked.length;
    const deep=courseDepth[course.id]||{goal:"",sections:[],drills:[]}, neighbors=courseNeighbors(course), themeSheet=themeSheetIndex[course.blockId];
    const checkedRequired=["application","edge","transfer","exam","drill-advanced"].every(function(id){return progress.checked.indexOf(id)>=0;});
    const rubricNames=["Je sais expliquer la notion sans notes.","Je sais résoudre un exercice nouveau et justifier mes choix.","Je sais repérer une limite et vérifier mon résultat."];
    const exercises=tasks.map(function(task,index){
      const key=course.id+":"+task.id, answer=state.courseDrafts[key]||"";
      const already=progress.checked.indexOf(task.id)>=0, revealed=progress.revealed.indexOf(task.id)>=0;
      const answerId="answer-"+key.replace(/[^a-zA-Z0-9_-]/g,"-");
      return '<details class="course-exercise ' +(already?'exercise-checked':'') +'"><summary><span class="exercise-level">'+esc(task.level)+'</span><strong>'+esc(task.title)+'</strong><span class="exercise-time">~'+courseTaskMinutes(task.id)+' min</span><span class="exercise-checkmark">'+(already?'✓':'＋')+'</span></summary>'+
        '<div class="course-exercise-body"><p class="course-exercise-prompt">'+esc(task.prompt).replace(/\n/g,"<br>")+'</p><details class="exercise-hint"><summary>Besoin d’un indice ?</summary><p>'+esc(courseTaskHint(task.id))+'</p></details>'+
        '<label class="course-answer-label" for="'+answerId+'">Ta réponse · brouillon enregistré automatiquement</label><textarea id="'+answerId+'" class="answer-area course-answer-area" data-course-answer="'+esc(key)+'" placeholder="Écris ton raisonnement, ton code, tes tests ou ton plan…">'+esc(answer)+'</textarea>'+
        '<div class="exercise-actions"><button class="secondary-button" data-action="course-reveal" data-course="'+course.id+'" data-task="'+task.id+'">'+(revealed?'Masquer le corrigé':'Afficher le corrigé de référence')+'</button><button class="'+(already?'secondary-button':'primary-button')+'" data-action="course-mark" data-course="'+course.id+'" data-task="'+task.id+'">'+(already?'Comparé ✓':'J’ai tenté et comparé')+'</button><span class="microcopy">À cocher après avoir rédigé puis comparé.</span></div>'+
        '<div class="solution-box course-solution" '+(revealed?'':'hidden')+'><b>Correction de référence</b><p>'+esc(task.correction).replace(/\n/g,"<br>")+'</p><b>Vérifie ces points</b><ul>'+task.criteria.map(function(x){return '<li>'+esc(x)+'</li>';}).join('')+'</ul></div></div></details>';
    }).join("");
    const chapters=deep.sections||[], splitAt=chapters.length>1?Math.max(1,Math.min(chapters.length-1,Math.ceil(chapters.length/2))):chapters.length;
    const chapterMarkup=chapters.map(function(section,index){return '<section class="lesson-chapter"><div class="lesson-chapter-index">'+String(index+1).padStart(2,"0")+'</div><div><h3>'+esc(section.title)+'</h3><p>'+renderInlineMarkdown(section.text).replace(/\n/g,"<br>")+'</p></div></section>';});
    const lessonSections=chapterMarkup.slice(0,splitAt).concat(renderCourseConceptMap(course),renderCourseExample(course),chapterMarkup.slice(splitAt)).join("");
    const previous=neighbors.previous?'<button class="secondary-button" data-action="open-course" data-id="'+neighbors.previous.id+'">← Leçon précédente</button>':'';
    const next=neighbors.next?'<button class="primary-button" data-action="open-course" data-id="'+neighbors.next.id+'">Leçon suivante : '+esc(neighbors.next.title)+' →</button>':'<button class="primary-button" data-nav="exams">Passer aux épreuves du concours →</button>';
    return '<div class="course-detail-head"><div><button class="back-link" data-nav="curriculum">← Retour au parcours</button><div class="eyebrow">LEÇON '+String(neighbors.index+1).padStart(2,"0")+' / '+totalCourses+' · '+esc(course.blockTitle)+'</div><h1>'+esc(course.title)+'</h1><p>'+esc(course.blockRef)+'</p>'+renderCoursePicker(course)+'</div><div class="course-detail-actions"><button class="primary-button" data-action="scroll-course-section" data-target="course-exercises">Commencer les exercices ↓</button><button class="secondary-button print-fiche-button" data-action="scroll-course-section" data-target="course-sheet">Fiche de révision du thème ↓</button></div></div>'+ 
      '<div class="course-progress-banner"><div><strong>'+checkedCount+' / '+tasks.length+' étapes comparées</strong><p>'+(progress.validated?'Leçon validée. Tu peux poursuivre dans l’ordre ou revenir ici.':checkedRequired?'Les exercices clés sont faits : passe à la validation.':'Suis le fil de haut en bas. Écris avant de regarder un corrigé.')+'</p></div><span class="course-progress-ring" style="--progress:'+Math.round(100*checkedCount/tasks.length)+'%"><span>'+Math.round(100*checkedCount/tasks.length)+'%</span></span></div>'+
      '<div class="course-layout"><article class="course-main-column"><section class="course-content-panel course-lesson-panel" id="course-lesson">'+renderCourseMethod(course,deep,themeSheet)+lessonSections+'</section>'+ 
      '<section class="course-exercise-section" id="course-exercises"><div class="section-kicker">03 · TU T’ENTRAÎNES</div><h2>9 étapes, de la première idée au concours</h2><p class="course-muted">Les exercices de cette unité sont rassemblés ici. Le rappel et l’explication orale travaillent des compétences différentes des problèmes corrigés ; aucun mini-sujet ne recopie ces mêmes questions.</p>'+exercises+'</section>'+
      renderThemeSheet(themeSheet)+
      '<section class="course-validation" id="course-validation"><div class="section-kicker">05 · TU VÉRIFIES</div><h2>Est-ce que tu maîtrises la notion ?</h2><p>Après avoir tenté et comparé au moins 6 activités, dont application, cas limite, transfert, exercice avancé et problème concours, réponds honnêtement à ces trois critères.</p>'+rubricNames.map(function(name,i){return '<label class="course-rubric"><input type="checkbox" data-course-rubric="'+course.id+'" data-index="'+i+'" '+(progress.rubric.indexOf(i)>=0?'checked':'')+'><span>'+esc(name)+'</span></label>';}).join('')+'<button class="primary-button course-validate-button" data-action="course-validate" data-course="'+course.id+'" '+(progress.validated?'disabled':'')+'>'+(progress.validated?'Leçon validée ✓':'Valider cette leçon')+'</button><small class="course-validation-note">C’est une auto-évaluation transparente, pas une note automatique du jury.</small></section><div class="course-next-step">'+previous+next+'</div></article><aside class="course-side-column"><div class="course-side-card course-progress-card"><span class="section-kicker">PROGRESSION</span><strong>'+checkedCount+' / '+tasks.length+'</strong><span>activités comparées</span><div class="module-progress"><span style="width:'+Math.round(100*checkedCount/tasks.length)+'%"></span></div>'+(progress.validated?'<span class="course-complete-tag">Leçon validée ✓</span>':'<span>Le prochain objectif : comparer tes réponses aux corrigés.</span>')+'</div><nav class="course-side-card course-outline" aria-label="Dans cette leçon"><span class="section-kicker">DANS CETTE LEÇON</span><a href="#course-lesson">01 · Comprendre</a><a href="#course-example">02 · Exemple guidé</a><a href="#course-exercises">03 · Exercices</a><a href="#course-sheet">04 · Fiche du thème</a><a href="#course-validation">05 · Valider</a></nav><div class="course-side-card course-order-card"><span class="section-kicker">DANS LE PARCOURS</span><small>'+esc(course.blockTitle)+'</small><strong>'+String(neighbors.index+1).padStart(2,"0")+' / '+totalCourses+'</strong><button class="text-button" data-action="open-course" data-id="'+(neighbors.next?neighbors.next.id:course.id)+'">'+(neighbors.next?'À suivre : '+esc(neighbors.next.title)+' →':'Revoir cette dernière leçon ↻')+'</button></div></aside></div>';
  }

  function renderPractice() {
    if (state.practice) return renderPracticeSession();
    const topicNames = ["Toutes"].concat(groups.map(function (g) { return g.short; }));
    const dueFlashCards=cardsDueNow(reviewCards()).length;
    const limit=Math.max(10,Number(state.practiceLimit)||15);
    const questionCount=groups.reduce(function(total,group){return total+group.lessons.length;},0)+practiceQuestions.length;
    const quizMinutes=Math.max(1,Math.ceil(limit*90/60));
    return '<div class="page-header practice-page-header"><div><div class="eyebrow">S’entraîner pour retenir</div><h1>Entraînement actif</h1><p>'+questionCount+' questions corrigées dans le parcours, plus des sujets ouverts et '+codeExercises.length+' exercices Python à tests automatiques. Les erreurs alimentent tes cartes de révision.</p></div><label class="flash-limit-label" for="practice-session-limit">Questions par série<select class="plan-select" id="practice-session-limit"><option value="10" '+(limit===10?'selected':'')+'>10 questions</option><option value="15" '+(limit===15?'selected':'')+'>15 questions</option><option value="25" '+(limit===25?'selected':'')+'>25 questions</option><option value="40" '+(limit===40?'selected':'')+'>40 questions</option></select></label></div>' +
      '<div class="stats-strip practice-stats"><div class="mini-stat"><span class="mini-stat-icon">✳</span><div><strong>'+questionCount+'</strong><small>questions de quiz corrigées</small></div></div><div class="mini-stat"><span class="mini-stat-icon">⌁</span><div><strong>'+openSubjects.length+'</strong><small>sujets ouverts avec corrigé</small></div></div><div class="mini-stat"><span class="mini-stat-icon">&lt;/&gt;</span><div><strong>'+codeExercises.length+'</strong><small>exercices Python testés</small></div></div></div>'+
      '<div class="practice-grid"><article class="practice-card"><span class="practice-icon">◉</span><h3>Diagnostic de départ</h3><p>12 questions, une dans chaque thème, pour repérer tes acquis sans supposer que tu connais déjà le programme.</p><button class="primary-button" data-action="start-diagnostic">Commencer · 15 min →</button></article>' +
      '<article class="practice-card"><span class="practice-icon">↻</span><h3>Questions mélangées</h3><p>Une série de '+limit+' questions tirées au sort dans le programme. Chaque réponse affiche une explication et toute erreur rejoint les cartes à revoir.</p><button class="secondary-button" data-action="start-practice" data-mode="all">Lancer · env. '+quizMinutes+' min →</button></article>' +
      '<article class="practice-card"><span class="practice-icon">⌖</span><h3>Sujet par thème</h3><p>Choisis un thème pour un quiz ciblé ou un problème ouvert corrigé à comparer après rédaction.</p><select class="plan-select" id="practice-filter" style="margin-bottom:9px">' + topicNames.map(function (name) { return '<option value="' + esc(name) + '">' + esc(name) + '</option>'; }).join("") + '</select><button class="secondary-button" data-action="start-practice" data-mode="theme">Lancer le quiz ciblé →</button><button class="text-button" data-action="start-theme-mock">Sujet ouvert · 30 min →</button></article></div>' +
      '<div class="section-heading"><div><div class="section-kicker">À reprendre</div><h2>' + ((state.diagnosticScore == null) ? "Ta première séance t’attend" : "Revoir les notions") + '</h2><p>' + ((state.diagnosticScore == null) ? "Fais le diagnostic : il te donnera un point de départ, pas une note définitive." : "Les erreurs et les cartes te permettent de revoir les notions à intervalles réguliers.") + '</p></div><button class="text-button" data-nav="review">Réviser les '+dueFlashCards+' cartes du jour →</button></div>' +
      '<section class="panel"><div class="panel-title-row"><h3>La méthode de la séance</h3><span>4 étapes</span></div><div class="rubric-list"><div class="rubric-item">① Essaie de répondre sans regarder le cours.</div><div class="rubric-item">② Explique pourquoi tu as choisi cette réponse.</div><div class="rubric-item">③ Lis le corrigé, même si tu as réussi.</div><div class="rubric-item">④ Revois les notions difficiles dans quelques jours.</div></div></section>';
  }

  function collectQuestions(mode, filter) {
    let pool = [];
    groups.forEach(function (g) {
      if (filter && filter !== "Toutes" && g.short !== filter) return;
      g.lessons.forEach(function (item) { pool.push({group:g, lesson:item}); });
    });
    practiceQuestions.forEach(function (item) {
      const group=groups.find(function (entry) { return entry.id===item.groupId; });
      if (!group || (filter && filter!=="Toutes" && group.short!==filter)) return;
      pool.push({group:group,lesson:{id:item.id,title:item.title,question:item.question,options:item.options,answer:item.answer,feedback:item.feedback,challenge:"Réexplique pourquoi la bonne réponse est correcte et donne un exemple ou un contre-exemple.",solution:item.feedback,keywords:[group.short]}});
    });
    if (mode === "diagnostic") {
      const chosen = [];
      groups.forEach(function (g) {
        const candidates=pool.filter(function (q) { return q.group.id===g.id; });
        if(candidates.length) chosen.push(candidates[Math.floor(Math.random()*candidates.length)]);
      });
      pool.forEach(function (q) { if (chosen.length < 12 && chosen.every(function (x) { return x.lesson.id !== q.lesson.id; })) chosen.push(q); });
      pool = chosen.slice(0,12);
    }
    for (let i=pool.length-1;i>0;i--) { const j=Math.floor(Math.random()*(i+1)); [pool[i],pool[j]]=[pool[j],pool[i]]; }
    return pool.slice(0, mode === "diagnostic" ? 12 : Math.min(Math.max(10,Number(state.practiceLimit)||15),pool.length));
  }

  function renderPracticeSession() {
    const session = state.practice;
    if (session.mode === "theme-mock") return renderThemeMock(session);
    if (session.finished) {
      const score = session.score || 0, n = session.questions.length;
      if (session.mode === "theme-mock") {
        const checked=(session.checked||[]).filter(Boolean).length;
        return '<div class="page-header"><div><div class="eyebrow">Mini-sujet terminé</div><h1>Ton auto-évaluation</h1><p>Tu as travaillé '+esc(session.groupTitle)+'. Compare tes réponses au corrigé, puis note les notions à reprendre.</p></div></div><section class="question-panel" style="text-align:center"><div class="stat-number" style="font-size:42px">'+checked+'<span style="font-size:17px;color:#9ba39a"> / '+session.questions.length+' critères cochés</span></div><p>Ce bilan t’aide à suivre ton entraînement ; il ne constitue pas une note de concours.</p><button class="primary-button" data-action="finish-practice">Retour aux entraînements →</button></section>';
      }
      const ratio=n?score/n:0;
      let advice = ratio < 0.4 ? "C’est un point de départ. Reprends tranquillement les leçons recommandées et reviens refaire une série." : ratio < 0.75 ? "Tu as déjà de bons repères. Revois les questions ratées, puis consolide les thèmes concernés." : "Très bon rappel ! Continue à pratiquer pour rendre ces notions solides et mobilisables en épreuve.";
      if (session.mode === "diagnostic") { state.diagnosticScore = score; save(); }
      return '<div class="page-header"><div><div class="eyebrow">Séance terminée</div><h1>' + (session.mode === "diagnostic" ? "Ton point de départ" : "Bien joué, séance terminée") + '</h1><p>' + esc(advice) + '</p></div></div><section class="question-panel" style="text-align:center"><div class="stat-number" style="font-size:42px">' + score + '<span style="font-size:17px;color:#9ba39a"> / ' + n + '</span></div><p>' + esc(advice) + '</p>' + (session.mode === "diagnostic" ? '<div class="key-takeaway" style="text-align:left"><span>✦</span><span>' + (score < 5 ? "On te conseille de commencer par les premiers repères et Python, sans brûler les étapes." : score < 9 ? "Tu as quelques bases. Commence par Python et les algorithmes, puis complète les thèmes où tu hésites." : "Tu as déjà des repères utiles. Fais tout de même le parcours dans l’ordre pour repérer les angles morts.") + '</span></div>' : '') + '<button class="primary-button" data-action="finish-practice">Retour aux entraînements →</button><button class="text-button" data-nav="path">Explorer le parcours</button></section>';
    }
    const q = session.questions[session.index];
    if (!q) { session.finished = true; return renderPracticeSession(); }
    const item=q.lesson, recorded=session.responses[session.index];
    const opts=item.options.map(function (o,i) {
      let cl="quiz-option"; if(recorded && recorded.choice===i) cl += " selected";
      if(recorded && i===item.answer) cl += " correct";
      if(recorded && !recorded.correct && recorded.choice===i) cl += " wrong";
      return '<button class="'+cl+'" data-action="answer-practice" data-choice="'+i+'" '+(recorded?"disabled":"")+'><span>'+String.fromCharCode(65+i)+'.</span> '+esc(o)+'</button>';
    }).join("");
    const unknownOption='<button class="quiz-option unknown '+(recorded&&recorded.choice==="unknown"?"selected":"")+'" data-action="answer-practice" data-choice="unknown" '+(recorded?"disabled":"")+'><span aria-hidden="true">?</span> Je ne sais pas</button>';
    const feedback=recorded?'<div class="quiz-feedback '+(!recorded.correct&&!recorded.unknown?"error":"")+'">'+(recorded.correct?"Bonne réponse. ":recorded.unknown?"Merci de l’indiquer : cette notion est à revoir. ":"On reprend le raisonnement. ")+esc(item.feedback)+'</div>':'';
    return '<div class="page-header"><div><div class="eyebrow">' + (session.mode === "diagnostic" ? "Diagnostic · aucun prérequis" : esc(q.group.short)) + '</div><h1>' + (session.mode === "diagnostic" ? "Découvrir ton point de départ" : "Entraînement") + '</h1><p>Choisis une réponse, puis prends le temps de comprendre la correction.</p></div><button class="secondary-button" data-action="cancel-practice">Quitter la séance</button></div><div class="question-toolbar"><span class="timer-pill" id="practice-time">' + formatClock(session.duration - Math.floor((Date.now()-session.startedAt)/1000)) + '</span><span class="quiz-progress-text">Question ' + (session.index+1) + ' sur ' + session.questions.length + ' · ' + esc(q.group.title) + '</span></div><section class="question-panel"><h2>' + esc(item.title) + '</h2><p class="quiz-question">' + esc(item.question).replace(/\n/g,"<br>") + '</p><div class="quiz-options">' + opts + unknownOption + '</div>' + feedback + '<div class="question-footer"><span class="microcopy">' + (recorded ? (recorded.correct ? "Réponse enregistrée dans ta progression." : "Cette notion pourra être revue dans les cartes mémoire.") : "Tu peux prendre quelques secondes pour raisonner, ou indiquer que tu ne sais pas encore.") + '</span>' + (recorded ? '<button class="primary-button" data-action="practice-next">' + (session.index === session.questions.length-1 ? "Voir mon résultat" : "Question suivante →") + '</button>' : '') + '</div></section>';
  }

  function renderThemeMock(session) {
    if (session.finished) {
      const checked=(session.checked||[]).filter(Boolean).length;
      return '<div class="page-header"><div><div class="eyebrow">Mini-sujet terminé</div><h1>Ton auto-évaluation</h1><p>Tu as travaillé '+esc(session.groupTitle)+'. Compare tes réponses au corrigé, puis note les notions à reprendre.</p></div></div><section class="question-panel" style="text-align:center"><div class="stat-number" style="font-size:42px">'+checked+'<span style="font-size:17px;color:#9ba39a"> / '+session.questions.length+' critères cochés</span></div><p>Ce bilan t’aide à suivre ton entraînement ; il ne constitue pas une note de concours.</p><button class="primary-button" data-action="finish-practice">Retour aux entraînements →</button></section>';
    }
    const group=groups.find(function(g){return g.id===session.groupId;});
    const subjectMinutes=Math.round(session.duration/60);
    return '<div class="page-header"><div><div class="eyebrow">Mini-sujet · '+esc(session.groupTitle)+'</div><h1>Rédiger et raisonner</h1><p>Traite le problème en plusieurs étapes sans consulter le corrigé. Compare ensuite ta démarche, puis coche le critère d’auto-évaluation.</p></div><button class="secondary-button" data-action="cancel-practice">Quitter le sujet</button></div><div class="question-toolbar"><span class="timer-pill" id="practice-time">'+formatClock(session.duration-Math.floor((Date.now()-session.startedAt)/1000))+'</span><span class="quiz-progress-text">'+(session.questions.length>1?'Épreuve de la notion · ':'Dossier ouvert · ')+'corrigés détaillés · '+subjectMinutes+' min</span></div>'+
      session.questions.map(function(item,i) {
        const key=item.id;
        const answer=(session.answers||{})[key]||"";
        const checked=(session.checked||[])[i]===true;
        return '<section class="exam-card"><div class="exam-meta">QUESTION '+String(i+1).padStart(2,"0")+'</div><h2>'+esc(item.title)+'</h2><p>'+esc(item.challenge)+'</p><textarea class="answer-area" data-theme-answer="'+key+'" placeholder="Rédige ton raisonnement ou ton code ici…">'+esc(answer)+'</textarea><div class="exercise-actions"><button class="secondary-button" data-action="theme-solution" data-id="'+key+'">Comparer au corrigé</button><label class="rubric-item"><input type="checkbox" data-theme-check="'+i+'" '+(checked?"checked":"")+'> J’ai rédigé puis comparé ma réponse au corrigé</label></div><div class="solution-box" id="theme-solution-'+key+'" hidden>'+esc(item.solution).replace(/\n/g,"<br>")+'</div></section>';
      }).join("")+
      '<section class="exam-card\"><h2>Terminer le mini-sujet</h2><p>Tu as gardé tes réponses et peux reprendre plus tard dans l’onglet Entraînement.</p><button class="primary-button" data-action="finish-theme-mock">Voir mon bilan →</button></section>';
  }

  function renderCode() {
    if (!codeExercises.length) return '<section class="code-workbench"><p>Les exercices Python ne sont pas chargés.</p></section>';
    let exercise = codeExercises.find(function (item) { return item.id === state.codeExercise; });
    if (!exercise) { exercise = codeExercises[0]; state.codeExercise = exercise.id; }
    const completed = codeExercises.filter(function (item) { return state.codeResults[item.id] && state.codeResults[item.id].passed; }).length;
    const groupsByTopic = {};
    codeExercises.forEach(function (item) { (groupsByTopic[item.topic] = groupsByTopic[item.topic] || []).push(item); });
    const list = Object.keys(groupsByTopic).map(function (topic) {
      return '<div class="code-topic"><span>' + esc(topic) + '</span>' + groupsByTopic[topic].map(function (item) {
        const passed = state.codeResults[item.id] && state.codeResults[item.id].passed;
        return '<button class="code-exercise-link ' + (item.id === exercise.id ? 'active' : '') + '" data-action="select-code-exercise" data-id="' + esc(item.id) + '"><span class="code-exercise-state ' + (passed ? 'passed' : '') + '">' + (passed ? '✓' : '·') + '</span><span>' + esc(item.title) + '</span><small>' + item.time + '</small></button>';
      }).join('') + '</div>';
    }).join('');
    const previous = state.codeResults[exercise.id];
    const draft = Object.prototype.hasOwnProperty.call(state.codeDrafts, exercise.id) ? state.codeDrafts[exercise.id] : exercise.starter;
    const tests = exercise.tests.map(function (test, index) { return '<li><span class="test-index">0' + (index + 1) + '</span><span>' + esc(test.label) + '</span></li>'; }).join('');
    const previousResult = previous ? renderCodeResult(exercise, previous) : '<div class="code-result-placeholder"><span>↵</span><p>Lance ton code pour voir les tests passer un à un et obtenir une piste si quelque chose bloque.</p></div>';
    const courseReturn=state.courseId&&courseIndex[state.courseId]?'<button class="back-link code-course-return" data-action="return-course">← Retour à la leçon « '+esc(courseIndex[state.courseId].title)+' »</button>':'';
    return courseReturn+'<div class="page-header code-page-header"><div><div class="eyebrow">Écrire · exécuter · comprendre</div><h1>Atelier Python</h1><p>Écris du code Python, lance-le dans ton navigateur et travaille les tests un par un. Chaque exercice part d’une consigne claire, avec des indices et un corrigé expliqué.</p></div><div class="code-score-chip"><strong>' + completed + '<span>/' + codeExercises.length + '</span></strong><small>exercices réussis</small></div></div>' +
      '<div class="code-progress-track"><span style="width:' + Math.round(completed / codeExercises.length * 100) + '%"></span></div>' +
      '<div class="code-lab-layout"><aside class="code-exercise-list"><div class="code-list-head"><strong>Parcours de code</strong><span>' + codeExercises.length + ' exercices</span></div>' + list + '</aside>' +
      '<section class="code-workbench"><div class="code-task-head"><div><div class="code-task-meta"><span class="level-tag level-' + exercise.level + '">' + (exercise.level === 1 ? 'DÉPART' : exercise.level === 2 ? 'CONSOLIDATION' : 'CONCOURS') + '</span><span>' + esc(exercise.topic) + '</span><span>·</span><span>' + esc(exercise.time) + '</span></div><h2>' + esc(exercise.title) + '</h2></div><span class="code-task-complete ' + (previous && previous.passed ? 'passed' : '') + '">' + (previous && previous.passed ? 'Réussi ✓' : 'À faire') + '</span></div>' +
      '<p class="code-task-goal">' + esc(exercise.goal) + '</p><div class="code-prompt"><span class="prompt-label">TA MISSION</span><p>' + esc(exercise.prompt) + '</p></div>' +
      '<details class="code-hints"><summary>Un indice si tu bloques</summary><ol>' + exercise.hints.map(function (hint) { return '<li>' + esc(hint) + '</li>'; }).join('') + '</ol></details>' +
      '<div class="editor-shell"><div class="editor-bar"><span class="editor-file"><i></i>' + esc(exercise.id) + '.py</span><span>Python 3.14 · exécution locale</span><button class="editor-reset" data-action="reset-code" data-id="' + esc(exercise.id) + '">Réinitialiser</button></div><textarea id="python-editor" class="python-editor" data-code-editor="' + esc(exercise.id) + '" aria-label="Éditeur de code Python" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" wrap="off">' + esc(draft) + '</textarea><div class="editor-footer"><span><kbd>Ctrl</kbd> + <kbd>Entrée</kbd> pour exécuter</span><span>Indentation automatique avec Tab</span></div></div>' +
      '<div class="code-action-row"><button class="run-code-button" id="run-python">▶ &nbsp; Exécuter et corriger</button><span class="code-run-note">' + exercise.tests.length + ' tests de pratique · résultats détaillés</span></div>' +
      '<section class="test-panel"><div class="test-panel-head"><div><span class="section-kicker">JE VÉRIFIE</span><h3>Cas à couvrir</h3></div><span class="test-count">' + exercise.tests.length + ' tests</span></div><ul class="test-preview">' + tests + '</ul><p class="test-disclaimer">Ces cas t’aident à vérifier les comportements courants et les limites indiquées. Un passage réussi ne prouve pas à lui seul que tout programme est correct.</p></section>' +
      '<section class="python-result" id="python-result" aria-live="polite">' + previousResult + '</section>' +
      '<details class="reference-solution" id="reference-solution"><summary>Voir le corrigé commenté</summary><pre>' + esc(exercise.solution) + '</pre><p>' + esc(exercise.explanation) + '</p></details>' +
      '<p class="python-runtime-note">Le code s’exécute dans un Web Worker sur cet appareil. Il n’est pas envoyé à un serveur. Le premier lancement télécharge l’interpréteur Python  depuis Pyodide ; les suivants réutilisent le cache du navigateur.</p></section></div>';
  }

  function renderCodeResult(exercise, result) {
    if (result.status === 'running') return '<div class="code-result-loading"><span class="loading-pip"></span><div><strong>' + esc(result.message || 'Python démarre…') + '</strong><small>La première exécution peut prendre quelques secondes.</small></div></div>';
    if (result.runnerError) return '<div class="result-banner result-error"><strong>Le moteur Python n’a pas pu démarrer.</strong><p>' + esc(result.runnerError) + '</p><span>Ouvre la page depuis un site web (http:// ou https://), puis réessaie.</span></div>';
    const tests = result.tests || [];
    const passed = tests.filter(function (test) { return test.passed; }).length;
    let banner = '';
    if (result.runtimeError) {
      const syntax = result.runtimeError.indexOf('SyntaxError:') === 0 || result.runtimeError.indexOf('IndentationError:') === 0;
      banner = '<div class="result-banner result-error"><strong>' + (syntax ? 'Relis la syntaxe et l’indentation.' : 'Ton programme s’est arrêté avant les tests.') + '</strong><p>' + esc(result.runtimeError) + '</p><span>' + (syntax ? 'Vérifie les deux-points, les parenthèses et les blocs indentés.' : 'Lis le nom de l’erreur et l’étape signalée, puis réduis le problème à un petit exemple.') + '</span></div>';
    } else if (result.passed) {
      banner = '<div class="result-banner result-success"><strong>Tous les cas de pratique passent. Bien joué.</strong><p>Tu as réussi ' + passed + ' tests sur ' + tests.length + '. Compare maintenant ta solution au corrigé et explique pourquoi elle fonctionne.</p></div>';
    } else {
      const firstFailed = tests.find(function (test) { return !test.passed; });
      banner = '<div class="result-banner result-error"><strong>' + passed + ' test' + (passed > 1 ? 's' : '') + ' sur ' + tests.length + ' passe' + (passed > 1 ? 'nt' : '') + '.</strong><p>Commence par le cas « ' + esc(firstFailed ? firstFailed.label : 'à compléter') + ' ». ' + esc(firstFailed ? firstFailed.error : '') + '</p><span>Reprends l’invariant et vérifie les cas limites avant de relancer.</span></div>';
    }
    const testRows = tests.length ? '<ul class="result-test-list">' + tests.map(function (test) { return '<li class="' + (test.passed ? 'passed' : 'failed') + '"><b>' + (test.passed ? '✓' : '×') + '</b><span>' + esc(test.label) + '</span>' + (test.error ? '<small>' + esc(test.error) + '</small>' : '<small>Réussi</small>') + '</li>'; }).join('') + '</ul>' : '';
    const output = result.output ? '<details class="program-output"><summary>Sortie de ton programme</summary><pre>' + esc(result.output) + '</pre></details>' : '';
    return banner + testRows + output;
  }

  function bindCodeWorkbench() {
    const editor = document.getElementById('python-editor');
    const runButton = document.getElementById('run-python');
    if (!editor || !runButton) return;
    editor.addEventListener('keydown', function (event) {
      if (event.key === 'Tab') {
        event.preventDefault();
        const start = editor.selectionStart, end = editor.selectionEnd;
        editor.setRangeText('    ', start, end, 'end');
        editor.dispatchEvent(new Event('input', {bubbles:true}));
      }
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') { event.preventDefault(); runCurrentCode(); }
    });
    runButton.addEventListener('click', runCurrentCode);
  }

  function ensurePythonWorker() {
    if (pythonWorker && pythonReadyPromise) return pythonReadyPromise;
    pythonWorker = new Worker('./python-worker.mjs', {type:'module'});
    pythonReadyPromise = new Promise(function (resolve, reject) {
      let settled = false;
      const startupTimeout = setTimeout(function () {
        if (settled) return;
        settled = true;
        terminatePythonWorker();
        reject(new Error('Le téléchargement du moteur Python a dépassé le délai. Vérifie ta connexion puis réessaie.'));
      }, 60000);
      pythonWorker.onmessage = function (event) {
        const message = event.data || {};
        if (message.type === 'ready') {
          settled = true; clearTimeout(startupTimeout); resolve(message);
        } else if (message.type === 'startup-error' && !settled) {
          settled = true; clearTimeout(startupTimeout); terminatePythonWorker(); reject(new Error(message.message));
        } else if ((message.type === 'result' || message.type === 'runner-error') && pythonRunResolver && message.id === pythonRunId) {
          const resolver = pythonRunResolver; pythonRunResolver = null; resolver(message);
        }
      };
      pythonWorker.onerror = function (event) {
        if (!settled) { settled = true; clearTimeout(startupTimeout); terminatePythonWorker(); reject(new Error(event.message || 'Le moteur Python a rencontré une erreur.')); }
        else if (pythonRunResolver) { const resolver = pythonRunResolver; pythonRunResolver = null; resolver({type:'runner-error', id:pythonRunId, message:event.message || 'Erreur du moteur Python'}); }
      };
    });
    return pythonReadyPromise;
  }

  function terminatePythonWorker() {
    if (pythonWorker) pythonWorker.terminate();
    pythonWorker = null; pythonReadyPromise = null;
  }

  async function executePython(code, tests) {
    await ensurePythonWorker();
    const id = ++pythonRunId;
    return new Promise(function (resolve) {
      let settled = false;
      const timeout = setTimeout(function () {
        if (settled) return;
        settled = true; pythonRunResolver = null; terminatePythonWorker();
        resolve({type:'runner-error', id:id, message:'Le programme a dépassé la limite de 7 secondes. Vérifie qu’aucune boucle ne tourne sans fin.'});
      }, 7000);
      pythonRunResolver = function (message) {
        if (settled) return;
        settled = true; clearTimeout(timeout);
        resolve(message);
      };
      pythonWorker.postMessage({type:'run', id:id, code:code, tests:tests});
    });
  }

  async function runPythonExercise(exercise, editor, resultBox, button) {
    if (!exercise || !editor || !resultBox || !button || button.disabled) return;
    state.codeDrafts[exercise.id] = editor.value;
    save();
    button.disabled = true;
    editor.disabled = true;
    button.textContent = '◌  Démarrage de Python…';
    resultBox.innerHTML = renderCodeResult(exercise, {status:'running', message:pythonWorker ? 'Exécution des tests…' : 'Téléchargement de Python…'});
    try {
      const message = await executePython(editor.value, exercise.tests);
      if (message.type === 'runner-error') {
        const result = {runnerError:message.message, ranAt:Date.now()};
        state.codeResults[exercise.id] = result;
        resultBox.innerHTML = renderCodeResult(exercise, result);
      } else {
        const result = message.result || {};
        result.passed = !result.runtimeError && result.tests.length === exercise.tests.length && result.tests.every(function (test) { return test.passed; });
        result.ranAt = Date.now();
        state.codeResults[exercise.id] = result;
        if (result.passed) logStudy();
        resultBox.innerHTML = renderCodeResult(exercise, result);
      }
      save();
      updateChrome();
    } catch (error) {
      const result = {runnerError:String(error && error.message || error), ranAt:Date.now()};
      state.codeResults[exercise.id] = result;
      resultBox.innerHTML = renderCodeResult(exercise, result);
      save();
    } finally {
      button.disabled = false;
      editor.disabled = false;
      button.innerHTML = '▶ &nbsp; Exécuter et corriger';
    }
  }
  async function runCurrentCode() {
    const exercise=codeExercises.find(function(item){return item.id===state.codeExercise;});
    return runPythonExercise(exercise,document.getElementById('python-editor'),document.getElementById('python-result'),document.getElementById('run-python'));
  }
  async function runCourseExampleCode(id) {
    const exercise=codeExercises.find(function(item){return item.id===id;});
    const editor=document.querySelector('[data-code-editor="'+id+'"]');
    const resultBox=document.querySelector('[data-course-code-result="'+id+'"]');
    const button=document.querySelector('[data-action="run-course-code"][data-id="'+id+'"]');
    return runPythonExercise(exercise,editor,resultBox,button);
  }

  function renderExams() {
    const resume=state.exam?'<div class="deadline-note"><span>↗</span><p><strong>Une épreuve est en cours :</strong> '+esc(examDefinitions[state.exam.type].title)+'. Tes réponses sont enregistrées.</p><div class="deadline-note-actions"><button class="text-button" data-action="resume-exam">Reprendre →</button><button class="exam-cancel-button" data-action="cancel-exam">Annuler l’épreuve</button></div></div>':'';
    return '<div class="page-header"><div><div class="eyebrow">Se familiariser avec le format réel</div><h1>Épreuves blanches</h1><p>Entraîne-toi dans les conditions du concours : gestion du temps, rédaction, argumentation et prise de parole. Le calendrier officiel donne une période du 9 au 19 mars 2027 ; les jours précis seront publiés dans le calendrier détaillé.</p></div></div>'+resume+
      '<div class="progress-banner"><div class="progress-ring" data-value="4" style="--progress:100%"></div><div><strong>Deux écrits · deux oraux</strong><p>Les durées et coefficients ci-dessous reprennent les modalités officielles du CAPES NSI bac+3.</p></div></div>' +
      '<div class="practice-grid">' + Object.keys(examDefinitions).map(function (key) {
        const e=examDefinitions[key], icon=key==="paper1"?"⌘":key==="paper2"?"▤":key==="oral1"?"▱":"◉";
        return '<article class="practice-card"><span class="practice-icon">'+icon+'</span><h3>'+esc(e.title)+'</h3><p>'+esc(e.format)+' · '+esc(e.coef)+'. '+e.prompts.length+' étapes de préparation avec espace de rédaction et grille d’auto-évaluation.</p><button class="secondary-button" data-action="start-exam" data-exam="'+key+'">Ouvrir l’épreuve →</button></article>';
      }).join("") + '</div><div class="section-heading"><div><div class="section-kicker">Documents du ministère</div><h2>Les ressources qui font référence</h2><p>Le parcours s’aligne sur les documents officiels de la session 2027 et les sujets déjà publiés.</p></div></div><div><a class="source-link" href="'+official.program+'" target="_blank" rel="noopener">Programme officiel 2027 ↗</a><a class="source-link" href="'+official.exams+'" target="_blank" rel="noopener">Format des épreuves ↗</a><a class="source-link" href="'+official.subjects+'" target="_blank" rel="noopener">Sujets 2026 ↗</a><a class="source-link" href="'+official.calendar+'" target="_blank" rel="noopener">Calendrier 2027 ↗</a></div>';
  }

  function renderExam() {
    if (!state.exam) { state.view="exams"; return renderExams(); }
    const session=state.exam, def=examDefinitions[session.type];
    const remaining=Math.max(0,def.duration-Math.floor((Date.now()-session.startedAt)/1000));
    const oralPhases=session.type==="oral1"?'<section class="exam-card"><h2>Simulation de l’oral · 1 heure</h2><p>Après la préparation, entraîne-toi à tenir un exposé de 30 minutes, puis un échange de 30 minutes. Chaque bouton démarre un chronomètre distinct.</p><div class="question-toolbar"><span class="timer-pill" id="oral-phase-time">'+(session.oralPhaseStartedAt?formatClock(Math.max(0,1800-Math.floor((Date.now()-session.oralPhaseStartedAt)/1000))):"00:30:00")+'</span><span class="quiz-progress-text">'+(session.oralPhase?"Phase en cours : "+(session.oralPhase==="expose"?"exposé":"échange"):"Choisis la phase à simuler.")+'</span></div><button class="secondary-button" data-action="start-oral-phase" data-phase="expose">Démarrer l’exposé · 30 min</button> <button class="secondary-button" data-action="start-oral-phase" data-phase="exchange">Démarrer l’échange · 30 min</button></section>':'';
    const examStepNavigation='<nav class="exam-step-navigation" aria-label="Aller directement à une étape"><span class="exam-step-navigation-label">ALLER À UNE ÉTAPE</span><div>'+def.prompts.map(function(prompt,i){return '<a class="exam-step-link" href="#exam-step-'+(i+1)+'" aria-label="Aller à l’étape '+(i+1)+' : '+esc(prompt[0])+'"><span>'+String(i+1).padStart(2,"0")+'</span><span>'+esc(prompt[0])+'</span></a>';}).join("")+'</div></nav>';
    return '<div class="page-header exam-page-header"><div><div class="eyebrow">Mode épreuve · chronomètre indicatif</div><h1>'+esc(def.title)+'</h1><p>'+esc(def.format)+' · '+esc(def.coef)+'. Réponds dans les zones, puis utilise la grille pour t’auto-évaluer. Tes brouillons sont enregistrés sur cet appareil.</p></div><button class="exam-cancel-button" data-action="cancel-exam">Annuler l’épreuve</button></div><div class="question-toolbar"><span class="timer-pill" id="exam-time">'+formatClock(remaining)+'</span><span class="quiz-progress-text">' + (remaining===0?"Temps écoulé · tu peux terminer ou relire tes réponses.":"Le chronomètre continue même si tu changes de page.") + '</span></div>'+examStepNavigation+oralPhases +
      def.prompts.map(function (prompt,i) {
        const key=session.type+"-"+i, answer=(session.answers||{})[key]||"";
        return '<section class="exam-card exam-step-card" id="exam-step-'+(i+1)+'"><div class="exam-meta">ÉTAPE '+String(i+1).padStart(2,"0")+' / '+String(def.prompts.length).padStart(2,"0")+'</div><h2>'+esc(prompt[0])+'</h2><p>'+esc(prompt[1]).replace(/\n/g,"<br>")+'</p><textarea class="answer-area" data-exam-note="'+key+'" placeholder="Rédige ici ta réponse ou les notes de ton exposé…">'+esc(answer)+'</textarea></section>';
      }).join("") + '<section class="exam-card"><h2>Auto-évaluation avant de terminer</h2><p>Coche les points réellement présents dans ton travail. Cette grille ne remplace pas une notation du jury, mais elle aide à repérer ce que tu peux améliorer.</p><div class="rubric-list">'+def.rubric.map(function (label,i) { const key="rubric-"+i; return '<label class="rubric-item"><input type="checkbox" data-rubric="'+key+'" '+((session.rubric||[]).indexOf(key)>=0?"checked":"")+'> '+esc(label)+'</label>'; }).join("")+'</div><button class="primary-button" data-action="finish-exam">Terminer et enregistrer mon bilan →</button></section>';
  }

  const flashThemes = [
    { id:"Toutes", label:"Tout le programme" }, { id:"python", label:"Python" }, { id:"poo", label:"POO & Java" },
    { id:"algo", label:"Algorithmique" }, { id:"data", label:"Données & SQL" }, { id:"web", label:"Web" },
    { id:"architecture", label:"Architecture" }, { id:"systemes", label:"Systèmes & réseaux" },
    { id:"maths", label:"Maths & théorie" }, { id:"concours", label:"Méthode concours" }
  ];
  function reviewCards() {
    const cards=flashcards.slice();
    Object.keys(state.quizAnswers||{}).forEach(function (id) {
      const response=state.quizAnswers[id], item=lessonIndex[id]||practiceQuestionIndex[id];
      if(response && !response.correct && item) {
        const group=groups.find(function (entry) { return entry.id===(item.group||item.groupId); });
        const extra=Boolean(practiceQuestionIndex[id]);
        const theme=group&&({start:"concours",python:"python",algo:"algo",poo:"poo",data:"data",web:"web",arch:"architecture",systems:"systemes",math:"maths",formal:"maths",school:"concours",profession:"concours"})[group.id]||"concours";
        const correctAnswer=extra&&Array.isArray(item.options)?item.options[item.answer]+". "+item.feedback:item.feedback;
        cards.push({ id:"missed-"+id, theme:theme, themeLabel:group?group.short:"À reprendre", level:"À reprendre", kind:"Erreur de quiz", question:extra?"Refais sans choix proposés : "+item.question:"Sans revoir le cours, explique la notion : "+item.title+".", answer:correctAnswer, explanation:extra?"Justification : "+item.feedback:"Refais ensuite cet exercice : "+item.challenge+"\n\nCorrigé proposé : "+item.solution });
      }
    });
    syllabusCourses.forEach(function (course) { cards.push.apply(cards,courseFlashcards(course)); });
    return cards;
  }
  function cardsForTheme(cards, theme) { return theme && theme!=="Toutes" ? cards.filter(function (card) { return card.theme===theme; }) : cards; }
  function courseFlashTheme(course) {
    if(course.blockId==="lang") return /^l0[78]$/.test(course.id)?{id:"poo",label:"Java & POO"}:{id:"python",label:"Python"};
    if(course.blockId==="algo") return {id:"algo",label:"Algorithmique"};
    if(course.blockId==="dataweb") return /Web|HTML|CSS|XML|client-serveur/i.test(course.title)?{id:"web",label:"Web"}:{id:"data",label:"Données & SQL"};
    if(course.blockId==="systems") return /Réseaux|Adressage|Transport|Processus|Fichiers|Système d’exploitation/i.test(course.title)?{id:"systemes",label:"Systèmes & réseaux"}:{id:"architecture",label:"Architecture"};
    if(course.blockId==="math") return {id:"maths",label:"Maths & théorie"};
    return {id:"concours",label:course.blockId==="teaching"?"Pédagogie":"Entretien"};
  }
  function courseFlashcards(course) {
    const theme=courseFlashTheme(course), cards=[];
    function add(suffix,kind,question,answer,explanation) { cards.push({id:"course-"+course.id+"-"+suffix,theme:theme.id,themeLabel:theme.label,level:"Cours CAPES",kind:kind,question:question,answer:answer,explanation:explanation}); }
    add("definition","Rappel actif","Sans notes, explique l’idée centrale de « "+course.title+" » puis donne une règle ou un exemple.",course.lesson,"Exemple travaillé : "+course.worked+"\nÀ retenir : "+course.sheet.join(" · "));
    const prompts=[
      function(term){return "Reformule avec tes mots le repère « "+term+" » du cours « "+course.title+" ».";},
      function(term){return "Quelle règle pratique résume « "+term+" » dans « "+course.title+" » ?";},
      function(term){return "Sans recopier le cours, rappelle ce qu’il faut vérifier à propos de « "+term+" ».";},
      function(term){return "Quel principe essentiel de « "+course.title+" » est décrit par « "+term+" » ?";}
    ];
    course.sheet.forEach(function(point,index){
      const split=point.split(/[:：]/), term=split.length>1?split.shift().trim():null;
      add("fiche-"+(index+1),"Rappel · idée clé",prompts[index](term||point),point,"Pour bien répondre, précise le sens, puis relie le repère à un exemple ou à une conséquence dans un exercice.");
    });
    add("example","Trace","Explique sans regarder l’exemple travaillé du cours « "+course.title+" ».",course.worked,"Repère l’état de départ, chaque opération et le résultat ; ne te contente pas de recopier le code.");
    add("pitfall","Erreur à corriger","Quelle erreur contient cette affirmation à propos de « "+course.title+" » : « "+course.pitfall[0]+" » ?",course.pitfall[1],"Une réponse de concours précise le cas, justifie la règle et propose un contrôle ou un contre-exemple.");
    return cards;
  }
  function cardsDueNow(cards) {
    const now=Date.now();
    return cards.filter(function (card) { const p=(state.cardProgress||{})[card.id]; return !p || !p.dueAt || p.dueAt<=now; });
  }
  function cardsToRelearn(cards) {
    return cards.filter(function (card) { const p=(state.cardProgress||{})[card.id]; return p && (p.lastRating==="again" || p.lastRating==="hard" || ((p.lapses||0)>0 && (p.streak||0)<2)); });
  }
  function nextFlashInterval(progress, rating) {
    const repetitions=progress.repetitions||0, previous=progress.intervalDays||0;
    if(rating==="again") return { minutes:10, days:0, label:"10 min" };
    if(rating==="hard") { const days=Math.max(1,Math.round((previous||1)*1.2)); return { days:days, label:days+" j" }; }
    if(rating==="good") { const days=repetitions===0?1:repetitions===1?3:Math.max(4,Math.round(previous*2.2)); return { days:days, label:days+" j" }; }
    const days=repetitions===0?4:repetitions===1?10:Math.max(7,Math.round(previous*3));
    return { days:days, label:days+" j" };
  }
  function flashCardCountLabel(count) { return count+(count===1?" carte":" cartes"); }
  function startFlashSession(mode, onlyIds) {
    const all=reviewCards(), theme=state.flashFilter||"Toutes", themed=cardsForTheme(all,theme), now=Date.now();
    let pool;
    if(Array.isArray(onlyIds)) pool=themed.filter(function (card) { return onlyIds.indexOf(card.id)>=0; });
    else if(mode==="weak") pool=cardsToRelearn(themed);
    else if(mode==="due") {
      pool=cardsDueNow(themed);
      for(let i=pool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const swap=pool[i];pool[i]=pool[j];pool[j]=swap;}
      pool.sort(function (a,b) {
        const pa=(state.cardProgress||{})[a.id],pb=(state.cardProgress||{})[b.id];
        const rankA=pa&&pa.lastReviewAt?0:1, rankB=pb&&pb.lastReviewAt?0:1;
        return rankA!==rankB?rankA-rankB:(pa&&pa.dueAt||0)-(pb&&pb.dueAt||0);
      });
    }
    else {
      pool=themed.slice();
      for(let i=pool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const swap=pool[i];pool[i]=pool[j];pool[j]=swap;}
    }
    const limit=Math.max(1,Number(state.flashSessionLimit)||15), ids=pool.slice(0,limit).map(function (card) { return card.id; });
    state.flashSession={mode:mode,theme:theme,ids:ids,index:0,draft:"",revealed:false,failed:[],counts:{again:0,hard:0,good:0,easy:0},completed:ids.length===0,startedAt:now};
    logStudy(); state.view="review"; save(); render();
  }
  function renderFlashOverview(cards, theme, paused) {
    const themed=cardsForTheme(cards,theme), due=cardsDueNow(themed).length, weak=cardsToRelearn(themed).length;
    const progress=state.cardProgress||{};
    const mastered=themed.filter(function (card) { const p=progress[card.id]; return p && (p.repetitions||0)>=3 && (p.intervalDays||0)>=21; }).length;
    const themeButtons=flashThemes.map(function (item) { return '<button class="filter-chip '+(theme===item.id?"active":"")+'" data-action="flash-filter" data-theme="'+esc(item.id)+'" aria-pressed="'+(theme===item.id?'true':'false')+'">'+esc(item.label)+(item.id==="Toutes"?' <span>'+cards.length+'</span>':' <span>'+cardsForTheme(cards,item.id).length+'</span>')+'</button>'; }).join("");
    const dueCopy=due?flashCardCountLabel(due)+" à revoir maintenant, nouvelles cartes incluses.":"Tu es à jour dans ce thème. Tu peux continuer avec les cartes du programme.";
    return '<div class="page-header"><div><div class="eyebrow">Rappel actif · répétition espacée</div><h1>Cartes d’entraînement</h1><p>Réponds sans regarder, écris ta démarche si besoin, puis compare au corrigé. Ta mémoire décide de la prochaine date de révision.</p></div><span class="module-status">'+flashCardCountLabel(themed.length)+'</span></div>'+(paused||'')+
      '<section class="flash-dashboard"><div class="flash-stats"><article><span>À revoir</span><strong>'+due+'</strong><small>nouveautés comprises</small></article><article><span>Difficultés</span><strong>'+weak+'</strong><small>réponses hésitantes ou oubliées</small></article><article><span>Consolidées</span><strong>'+mastered+'</strong><small>révisions espacées réussies</small></article></div>'+
      '<div class="flash-theme-head"><div><strong>Choisir un thème</strong><small>Le filtre s’applique aux sessions et aux compteurs.</small></div><label class="flash-limit-label" for="flash-session-limit">Cartes par session</label><select id="flash-session-limit" class="plan-select"><option value="10" '+(Number(state.flashSessionLimit)===10?'selected':'')+'>10</option><option value="15" '+(Number(state.flashSessionLimit||15)===15?'selected':'')+'>15</option><option value="25" '+(Number(state.flashSessionLimit)===25?'selected':'')+'>25</option><option value="40" '+(Number(state.flashSessionLimit)===40?'selected':'')+'>40</option></select></div>'+
      '<div class="flash-theme-list" aria-label="Thèmes des cartes">'+themeButtons+'</div></section>'+
      '<section class="flash-start-grid"><article class="flash-start-card featured"><div class="flash-start-icon">↻</div><div><span class="eyebrow">MEILLEUR CHOIX AU QUOTIDIEN</span><h2>Révisions du jour</h2><p>'+esc(dueCopy)+'</p></div><button class="primary-button" data-action="start-flash-session" data-mode="due" '+(due===0?'disabled':'')+'>Commencer · '+due+' →</button></article>'+
      '<article class="flash-start-card"><div class="flash-start-icon">⌁</div><div><span class="eyebrow">RENFORCER LES NOTIONS FRAGILES</span><h2>Cartes difficiles</h2><p>Reprends les cartes notées « encore » ou « difficile ».</p></div><button class="secondary-button" data-action="start-flash-session" data-mode="weak" '+(weak===0?'disabled':'')+'>Réviser · '+weak+' →</button></article>'+
      '<article class="flash-start-card"><div class="flash-start-icon">▦</div><div><span class="eyebrow">ENTRAÎNEMENT LIBRE</span><h2>Test mélangé</h2><p>Un échantillon aléatoire de tout le thème, y compris les cartes déjà acquises.</p></div><button class="secondary-button" data-action="start-flash-session" data-mode="all">Lancer le test →</button></article></section>'+
      '<section class="panel flash-howto"><div class="panel-title-row"><h3>Une carte, un vrai rappel</h3><span>4 étapes</span></div><ol><li>Lis la question et réponds de mémoire, à voix haute ou dans la zone.</li><li>Ouvre le corrigé seulement après avoir essayé.</li><li>Compare les idées essentielles, les exemples et les pièges.</li><li>Note honnêtement ta difficulté : la prochaine révision est planifiée.</li></ol><p>Les réponses libres sont comparées à un corrigé guidé ; les exercices Python de l’atelier restent corrigés automatiquement par leurs tests.</p></section>';
  }
  function renderFlashSession(cards, session) {
    if(session.completed || !session.ids.length || session.index>=session.ids.length) {
      const counts=session.counts||{again:0,hard:0,good:0,easy:0}, failed=Array.from(new Set(session.failed||[]));
      const rated=(counts.again||0)+(counts.hard||0)+(counts.good||0)+(counts.easy||0), remembered=(counts.good||0)+(counts.easy||0);
      const intro=rated===0?"Aucune carte n’est due pour le moment dans ce thème.":"Tu as répondu à "+rated+" "+(rated===1?"carte":"cartes")+" et planifié leur prochaine révision.";
      return '<div class="page-header"><div><div class="eyebrow">Session terminée</div><h1>Bon travail, la mémoire se construit par rappels</h1><p>'+esc(intro)+'</p></div><button class="secondary-button" data-action="flash-back-deck">Retour au paquet</button></div><section class="flash-session-summary"><div class="flash-summary-score"><strong>'+remembered+'</strong><span>cartes rappelées sans blocage</span></div><div class="flash-summary-breakdown"><span>Encore à revoir <b>'+((counts.again)||0)+'</b></span><span>Difficile <b>'+((counts.hard)||0)+'</b></span><span>Bien <b>'+((counts.good)||0)+'</b></span><span>Facile <b>'+((counts.easy)||0)+'</b></span></div><p>'+ (failed.length?'Les cartes encore difficiles restent accessibles tout de suite, sans attendre leur prochaine échéance.':'Toutes les cartes de cette session sont planifiées selon ton niveau de rappel.') +'</p><div class="flash-controls">'+(failed.length?'<button class="primary-button" data-action="flash-repeat-difficult">Revoir les '+failed.length+' cartes difficiles →</button>':'')+'<button class="secondary-button" data-action="flash-back-deck">Voir mes paquets</button></div></section>';
    }
    const card=cards.find(function (item) { return item.id===session.ids[session.index]; });
    if(!card) return '<section class="panel"><h2>Cette carte n’est plus dans le paquet.</h2><button class="secondary-button" data-action="flash-back-deck">Revenir aux cartes</button></section>';
    const progress=state.cardProgress&&state.cardProgress[card.id]||{};
    const current=session.index+1, total=session.ids.length, percent=Math.round((session.index/total)*100);
    const ratingButtons=[
      {id:"again",label:"Encore",hint:"bloqué",icon:"↺"},{id:"hard",label:"Difficile",hint:"partiel / hésitant",icon:"~"},
      {id:"good",label:"Bien",hint:"réponse correcte",icon:"✓"},{id:"easy",label:"Facile",hint:"immédiat et précis",icon:"✦"}
    ].map(function (rating) { const delay=nextFlashInterval(progress,rating.id); return '<button class="flash-rating '+rating.id+'" data-action="flash-rate" data-rating="'+rating.id+'"><span class="flash-rating-icon">'+rating.icon+'</span><strong>'+rating.label+'</strong><small>'+rating.hint+'</small><em>'+delay.label+'</em></button>'; }).join("");
    return '<div class="page-header flash-session-header"><div><div class="eyebrow">Session de rappel actif</div><h1>Carte '+String(current).padStart(2,"0")+' <span>/ '+total+'</span></h1><p>Réponds d’abord. Le corrigé et la notation s’affichent après ta tentative.</p></div><button class="secondary-button" data-action="flash-exit">Quitter la session</button></div>'+
      '<div class="flash-session-progress"><div class="flash-progress-track"><span style="width:'+percent+'%"></span></div><span>'+esc(card.themeLabel||"Programme")+' · '+esc(card.level||"Rappel")+' · '+esc(card.kind||"Question")+'</span></div>'+
      '<article class="flash-study-card"><div class="flash-question-label"><span>QUESTION</span><span>'+esc(card.themeLabel||"Programme")+'</span></div><h2>'+esc(card.question)+'</h2><label class="flash-answer-label" for="flash-answer-input">Ta réponse, avant de regarder</label><textarea id="flash-answer-input" class="flash-answer-input" data-flash-answer placeholder="Écris une définition, une trace, du pseudo-code ou les étapes de ton raisonnement…" autocomplete="off">'+esc(session.draft||"")+'</textarea><div class="flash-card-actions">'+(!session.revealed?'<button class="primary-button" data-action="flash-reveal">Afficher le corrigé →</button>':'<span class="flash-compare-note">Compare ta réponse aux idées attendues, puis choisis honnêtement ton niveau.</span>')+'<span class="microcopy">Ton brouillon reste sur cette carte pendant la session.</span></div>'+
      (session.revealed?'<div class="flash-correction"><div><span class="eyebrow">RÉPONSE ATTENDUE</span><p class="flash-answer-text">'+esc(card.answer).replace(/\n/g,"<br>")+'</p></div><div class="flash-explanation"><strong>À retenir / piège à éviter</strong><p>'+esc(card.explanation).replace(/\n/g,"<br>")+'</p></div><div class="flash-rating-head"><strong>Comment l’as-tu rappelée ?</strong><span>La prochaine échéance est indiquée sur chaque bouton.</span></div><div class="flash-ratings">'+ratingButtons+'</div></div>':'')+'</article>'+
      '<div class="flash-session-footer"><span>Après plusieurs bonnes réponses espacées, la carte passe au paquet consolidé.</span><button class="text-button" data-action="flash-exit">Mettre en pause et revenir au paquet</button></div>';
  }
  function renderReview() {
    const cards=reviewCards(), theme=state.flashFilter||"Toutes", session=state.flashSession;
    if(session&&!session.paused) return renderFlashSession(cards,session);
    const paused=session&&!session.completed?'<section class="flash-resume-banner"><span>Session en pause</span><strong>Carte '+Math.min((session.index||0)+1,(session.ids||[]).length)+' / '+(session.ids||[]).length+'</strong><button class="primary-button" data-action="flash-resume">Reprendre ma session →</button></section>':'';
    return renderFlashOverview(cards,theme,paused);
  }
  function rateFlashcard(rating) {
    const session=state.flashSession;
    if(!session||session.completed||!session.ids[session.index]) return;
    const id=session.ids[session.index], now=Date.now();
    state.cardProgress=state.cardProgress||{};
    const progress=state.cardProgress[id]||{repetitions:0,intervalDays:0,lapses:0,streak:0};
    const interval=nextFlashInterval(progress,rating);
    progress.lastRating=rating;
    progress.lastReviewAt=now;
    progress.intervalDays=interval.days;
    progress.dueAt=interval.minutes?now+interval.minutes*60*1000:now+interval.days*86400000;
    progress.repetitions=rating==="again"?0:(progress.repetitions||0)+1;
    progress.lapses=(progress.lapses||0)+(rating==="again"?1:0);
    progress.streak=rating==="again"?0:(progress.streak||0)+1;
    state.cardProgress[id]=progress;
    session.counts=session.counts||{again:0,hard:0,good:0,easy:0};
    session.counts[rating]=(session.counts[rating]||0)+1;
    if((rating==="again"||rating==="hard")&&session.failed.indexOf(id)<0) session.failed.push(id);
    session.index+=1;session.revealed=false;session.draft="";
    if(session.index>=session.ids.length){session.completed=true;logStudy();}
    save();render();
    if(session.completed) toast("Session terminée. Les prochaines révisions sont planifiées.");
  }

  function startPractice(mode) {
    const filter = mode === "theme" ? (document.getElementById("practice-filter") || {}).value || "Toutes" : "Toutes";
    const questions=collectQuestions(mode,filter);
    state.practice={mode:mode,filter:filter,questions:questions,index:0,score:0,responses:{},finished:false,startedAt:Date.now(),duration:mode==="diagnostic"?900:Math.max(600,questions.length*90)};
    logStudy(); state.view="practice"; save(); render();
  }
  function startThemeMock() {
    const chosen=(document.getElementById("practice-filter")||{}).value||"Toutes";
    const candidates=openSubjects.filter(function(subject){const group=groups.find(function(g){return g.id===subject.groupId;});return chosen==="Toutes"||(group&&group.short===chosen);});
    const subject=candidates[Math.floor(Math.random()*candidates.length)]||openSubjects[0];
    const group=groups.find(function(g){return g.id===subject.groupId;})||groups[0];
    state.practice={mode:"theme-mock",groupId:group.id,groupTitle:group.title,questions:[subject],answers:{},checked:[],finished:false,startedAt:Date.now(),duration:1800};
    logStudy();state.view="practice";save();render();
  }
  function startExam(type) {
    state.exam={type:type,startedAt:Date.now(),answers:{},rubric:[]}; logStudy(); state.view="exam"; save(); render();
  }
  function startTimerRefresh() {
    timerHandle=setInterval(function () {
      let target, remaining;
      if(state.view==="exam" && state.exam) { const d=examDefinitions[state.exam.type]; remaining=Math.max(0,d.duration-Math.floor((Date.now()-state.exam.startedAt)/1000)); target=document.getElementById("exam-time"); }
      else if(state.view==="practice" && state.practice && !state.practice.finished) { remaining=Math.max(0,state.practice.duration-Math.floor((Date.now()-state.practice.startedAt)/1000)); target=document.getElementById("practice-time"); }
      if(target) target.textContent=formatClock(remaining);
      if(state.view==="exam"&&state.exam&&state.exam.type==="oral1"&&state.exam.oralPhaseStartedAt){const phaseTarget=document.getElementById("oral-phase-time");if(phaseTarget)phaseTarget.textContent=formatClock(Math.max(0,1800-Math.floor((Date.now()-state.exam.oralPhaseStartedAt)/1000)));}
    },1000);
  }

  function showModal(title, body, actions) {
    const backdrop=document.getElementById("modal-backdrop"), modal=document.getElementById("modal");
    modal.innerHTML='<button class="icon-button close-modal" data-action="close-modal" aria-label="Fermer">×</button><div class="eyebrow">ATELIER NSI</div><h2 id="modal-title">'+esc(title)+'</h2><div>'+body+'</div>'+(actions||"");
    backdrop.hidden=false;
  }
  function closeModal() { document.getElementById("modal-backdrop").hidden=true; }
  function showSources() {
    const links=[["Programme officiel CAPES NSI 2027",official.program],["Description des épreuves",official.exams],["Calendrier de la session 2027",official.calendar],["Sujets et rapports de jury",official.subjects],["Concours ouverts en 2027",official.opened],["Programmes et ressources lycée · éduscol",official.lycee],["Programmes et ressources SNT · éduscol",official.snt],["Révision SNT prévue pour la rentrée 2027",official.sntUpdate]];
    const body='<p>Le parcours suit le programme du concours, les programmes du lycée en vigueur à la rentrée 2026 et les modalités officielles. Le ministère prévoit une évolution de SNT pour la rentrée 2027 ; ce repère concerne ta future pratique et sera à actualiser quand le programme révisé paraîtra.</p>'+links.map(function (l) { return '<a class="source-link" style="display:flex;width:max-content;max-width:100%" target="_blank" rel="noopener" href="'+l[1]+'">'+esc(l[0])+' ↗</a>'; }).join("");
    showModal("Sources officielles",body);
  }
  function updateSyncChrome() {
    const localOnly = !supabase || !syncSession;
    const labels = {local:"Locale · appareil actuel",ready:"Compte prêt",syncing:"Synchronisation…",synced:"Synchronisée",error:"À resynchroniser"};
    const label = localOnly ? (supabase ? "Locale · connexion requise" : "Locale · à configurer") : (labels[syncStatus] || "Compte connecté");
    const profile = document.getElementById("profile-status");
    if (profile) profile.textContent = label;
    const indicator = document.querySelector(".save-indicator");
    if (indicator) indicator.innerHTML = '<span></span>' + (localOnly ? "Sauvegarde locale" : labels[syncStatus] || "Compte connecté");
  }
  function mergeProgress(local, remote) {
    local = local && typeof local === "object" ? local : {};
    remote = remote && typeof remote === "object" ? remote : {};
    const merged = Object.assign({}, defaultState, remote, local);
    merged.done = Array.from(new Set([].concat(remote.done || [], local.done || []))).filter(function (id) { return Boolean(lessonIndex[id]); });
    merged.activeDays = Array.from(new Set([].concat(remote.activeDays || [], local.activeDays || []))).filter(function (day) { return typeof day === "string"; }).sort().slice(-90);
    ["quizAnswers","notes","codeDrafts","codeResults","courseDrafts"].forEach(function (key) { merged[key] = Object.assign({}, remote[key] || {}, local[key] || {}); });
    merged.courseProgress = Object.assign({}, remote.courseProgress || {});
    Object.keys(local.courseProgress || {}).forEach(function (id) {
      const remoteCourse = merged.courseProgress[id] || {}, localCourse = local.courseProgress[id] || {};
      merged.courseProgress[id] = Object.assign({}, remoteCourse, localCourse, {
        checked:Array.from(new Set([].concat(remoteCourse.checked || [], localCourse.checked || []))),
        revealed:Array.from(new Set([].concat(remoteCourse.revealed || [], localCourse.revealed || []))),
        rubric:Array.from(new Set([].concat(remoteCourse.rubric || [], localCourse.rubric || []))),
        validated:Boolean(remoteCourse.validated || localCourse.validated)
      });
    });
    merged.updatedAt = Math.max(Number(local.updatedAt || 0), Number(remote.updatedAt || 0), Date.now());
    return merged;
  }
  async function syncFromCloud(session) {
    if (!supabase || !session || !session.user) return;
    syncSession = session;
    syncStatus = "syncing";
    updateSyncChrome();
    try {
      const response = await supabase.from("learner_state").select("state").eq("user_id", session.user.id).maybeSingle();
      if (response.error) throw response.error;
      if (response.data && response.data.state) state = mergeProgress(state, response.data.state);
      save();
      await pushCloudState();
      render();
    } catch (error) {
      syncStatus = "error";
      updateSyncChrome();
      toast("La progression reste enregistrée ici ; la synchronisation a échoué.");
    }
  }
  async function pushCloudState() {
    if (!supabase || !syncSession || !syncSession.user) return;
    syncStatus = "syncing";
    updateSyncChrome();
    try {
      const userId = syncSession.user.id;
      const response = await supabase.from("learner_state").select("state").eq("user_id", userId).maybeSingle();
      if (response.error) throw response.error;
      if (response.data && response.data.state) state = mergeProgress(state, response.data.state);
      const write = await supabase.from("learner_state").upsert({user_id:userId, state:state, updated_at:new Date().toISOString()}, {onConflict:"user_id"});
      if (write.error) throw write.error;
      try { localStorage.setItem(storageKey, JSON.stringify(state)); } catch (err) {}
      syncStatus = "synced";
    } catch (error) { syncStatus = "error"; }
    updateSyncChrome();
  }
  function openSyncAccount() {
    if (!supabase) {
      showModal("Activer la progression multi-appareil", '<p>La sauvegarde locale fonctionne déjà. Pour retrouver le même parcours sur un téléphone, une tablette et un ordinateur, il faut ajouter les identifiants publics de ton projet Supabase dans <code>config.js</code>, exécuter <code>supabase-schema.sql</code>, puis redéployer. Le guide pas à pas est dans README.md.</p><p>La clé publishable est faite pour être utilisée dans le navigateur. N’ajoute jamais une clé secrète ou <code>service_role</code>.</p>');
      return;
    }
    if (syncSession) {
      showModal("Compte de synchronisation", '<p>Progression synchronisée pour <strong>' + esc(syncSession.user.email || "ce compte") + '</strong>.</p><button class="secondary-button" data-action="sign-out-sync">Se déconnecter sur cet appareil</button>');
      return;
    }
    showModal("Retrouver mon parcours partout", '<p>Entre ton e-mail. Je t’envoie un lien de connexion sans mot de passe ; ouvre-le aussi sur chacun de tes appareils.</p><form id="sync-login-form"><label class="sync-email-label" for="sync-email">Adresse e-mail</label><input class="sync-email-input" id="sync-email" type="email" autocomplete="email" required placeholder="toi@exemple.fr"><button class="primary-button" type="submit">M’envoyer un lien de connexion →</button><p class="sync-form-message" id="sync-form-message" aria-live="polite"></p></form>');
    document.getElementById("sync-login-form").addEventListener("submit", async function (event) {
      event.preventDefault();
      const email = document.getElementById("sync-email").value.trim();
      const message = document.getElementById("sync-form-message");
      const submit = event.currentTarget.querySelector("button[type=submit]");
      submit.disabled = true; message.textContent = "Envoi du lien…";
      const response = await supabase.auth.signInWithOtp({email:email, options:{emailRedirectTo:window.location.origin + window.location.pathname}});
      submit.disabled = false;
      if (response.error) message.textContent = "Envoi impossible : " + response.error.message;
      else message.textContent = "Lien envoyé. Ouvre le message reçu, puis reviens ici : ta progression se synchronisera.";
    });
  }
  async function initializeCloudSync() {
    const config = window.ATELIER_CONFIG || {};
    if (!config.supabaseUrl || !config.supabasePublishableKey) { updateSyncChrome(); return; }
    try {
      const sdk = await import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.117.3/+esm");
      supabase = sdk.createClient(config.supabaseUrl, config.supabasePublishableKey, {auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
      supabase.auth.onAuthStateChange(function (event, session) {
        syncSession = session;
        if ((event === "INITIAL_SESSION" || event === "SIGNED_IN") && session) setTimeout(function () { syncFromCloud(session); }, 0);
        else { if (event === "SIGNED_OUT") syncStatus = "local"; updateSyncChrome(); }
      });
      syncStatus = "ready";
      updateSyncChrome();
    } catch (error) {
      syncStatus = "error";
      updateSyncChrome();
    }
  }
  function showSettings() {
    const syncCopy = syncSession ? '<p>Connecté à <strong>' + esc(syncSession.user.email || "ton compte") + '</strong>. État : ' + esc(syncStatus === "synced" ? "synchronisé" : syncStatus === "error" ? "à resynchroniser" : "en cours") + '.</p>' : '<p>La sauvegarde locale est active. La synchro entre appareils nécessite un compte en ligne, à connecter après la configuration Supabase.</p>';
    const body='<div class="sync-settings-card">' + syncCopy + '<button class="secondary-button" data-action="sync-account">' + (syncSession ? 'Gérer mon compte' : 'Configurer / connecter mon compte') + '</button></div><div class="settings-row"><label for="settings-goal">Rythme hebdomadaire</label><select class="plan-select" id="settings-goal"><option value="5" '+(state.weekGoal==5?"selected":"")+'>5 h</option><option value="8" '+(state.weekGoal==8?"selected":"")+'>8 h</option><option value="12" '+(state.weekGoal==12?"selected":"")+'>12 h</option><option value="16" '+(state.weekGoal==16?"selected":"")+'>16 h</option></select></div><div class="settings-row"><button class="secondary-button" data-action="export-progress">Exporter ma progression</button><label class="secondary-button" for="import-progress-file">Importer une sauvegarde</label><input id="import-progress-file" type="file" accept=\"application/json,.json\" hidden></div><button class="secondary-button" data-action="reset-progress" style="color:#ef9c8e">Réinitialiser ma progression</button>';
    showModal("Réglages",body);
  }
  function openNextLesson() {
    const next=nextLesson(); state.currentGroup=next.group.id; state.currentLesson=next.group.lessons.indexOf(next.lesson); state.view="lesson"; save(); render();
  }

  document.addEventListener("click", function (event) {
    const target=event.target.closest("[data-action],[data-nav]"); if(!target) return;
    const nav=target.getAttribute("data-nav");
    if(nav) { setView(nav); return; }
    const action=target.getAttribute("data-action");
    if(action==="open-course") { const id=target.getAttribute("data-id");if(courseIndex[id]){state.courseId=id;state.view="course";save();render();window.scrollTo({top:0,behavior:"smooth"});}return; }
    if(action==="example-step") { const id=target.getAttribute("data-course"),course=courseIndex[id];if(!course)return;const steps=workedExampleSteps(course),record=state.courseProgress[id]||{checked:[],revealed:[],rubric:[],validated:false},current=Math.max(0,Math.min(steps.length-1,Number(record.exampleStep)||0)),direction=target.getAttribute("data-dir");record.exampleStep=direction==="back"?Math.max(0,current-1):direction==="reset"?0:direction==="all"?steps.length-1:Math.min(steps.length-1,current+1);state.courseProgress[id]=record;save();const panel=document.getElementById("course-example");if(panel)panel.outerHTML=renderCourseExample(course);const focus=document.querySelector('#course-example [data-action="example-step"][data-dir="next"], #course-example .example-complete-label');if(focus&&focus.focus)focus.focus();return; }
    if(action==="run-course-code") { runCourseExampleCode(target.getAttribute("data-id"));return; }
    if(action==="course-reveal") { const id=target.getAttribute("data-course"),task=target.getAttribute("data-task"),course=courseIndex[id],progress=course&&courseProgress(course),box=target.closest(".course-exercise")&&target.closest(".course-exercise").querySelector(".course-solution");if(!progress||!box)return;const seen=progress.revealed.indexOf(task)>=0;if(seen){progress.revealed=progress.revealed.filter(function(x){return x!==task;});box.hidden=true;target.textContent="Afficher le corrigé de référence";}else{progress.revealed.push(task);box.hidden=false;target.textContent="Masquer le corrigé";}state.courseProgress[id]=Object.assign({},state.courseProgress[id]||{},{revealed:progress.revealed});save();return; }
    if(action==="course-mark") { const id=target.getAttribute("data-course"),task=target.getAttribute("data-task"),course=courseIndex[id];if(!course)return;const key=id+":"+task,answer=String(state.courseDrafts[key]||"").trim(),progress=courseProgress(course);if(answer.length<15){toast("Écris d’abord une réponse développée, puis compare-la au corrigé.");const area=document.querySelector('[data-course-answer="'+key+'"]');if(area)area.focus();return;}if(progress.revealed.indexOf(task)<0){toast("Affiche et compare le corrigé avant de cocher cet exercice.");return;}if(progress.checked.indexOf(task)<0)progress.checked.push(task);state.courseProgress[id]=Object.assign({},state.courseProgress[id]||{},{checked:progress.checked,revealed:progress.revealed,rubric:progress.rubric,validated:progress.validated});logStudy();save();render();toast("Exercice comparé et enregistré.");return; }
    if(action==="course-validate") { const id=target.getAttribute("data-course"),course=courseIndex[id];if(!course)return;const progress=courseProgress(course),required=["application","edge","transfer","exam","drill-advanced"],enough=progress.checked.length>=6&&required.every(function(x){return progress.checked.indexOf(x)>=0;});if(!enough){toast("Compare au moins 6 activités, dont application, cas limite, transfert, exercice avancé et concours.");document.getElementById("course-exercises").scrollIntoView({behavior:"smooth"});return;}if(progress.rubric.length<3){toast("Coche les trois critères d’auto-évaluation avant de valider.");return;}progress.validated=true;state.courseProgress[id]=Object.assign({},state.courseProgress[id]||{},{checked:progress.checked,revealed:progress.revealed,rubric:progress.rubric,validated:true});logStudy();save();render();toast("Leçon validée. Tu peux continuer dans le parcours.");return; }
    if(action==="scroll-course-section") { const section=document.getElementById(target.getAttribute("data-target"));if(section)section.scrollIntoView({behavior:"smooth"});return; }
    if(action==="print-fiche") { const details=document.querySelector(".theme-sheet-details"),wasOpen=details&&details.open;if(details)details.open=true;window.print();if(details&&!wasOpen)details.open=false;return; }
    if(action==="select-code-exercise") { const id=target.getAttribute("data-id");if(codeExercises.some(function(item){return item.id===id;})){state.codeExercise=id;state.view="code";save();render();}return; }
    if(action==="return-course") { state.view="course";save();render();return; }
    if(action==="reset-code") { const id=target.getAttribute("data-id"),item=codeExercises.find(function(exercise){return exercise.id===id;});if(item){delete state.codeDrafts[id];delete state.codeResults[id];save();render();toast("Brouillon remis au point de départ.");}return; }
    if(action==="sync-account") { openSyncAccount();return; }
    if(action==="sign-out-sync") { if(supabase)supabase.auth.signOut().then(function(){closeModal();toast("Déconnecté sur cet appareil.");});return; }
    if(action==="start-diagnostic") { startPractice("diagnostic"); return; }
    if(action==="open-next") { openNextLesson(); return; }
    if(action==="open-group") { const g=groups.find(function(x){return x.id===target.getAttribute("data-group");}); if(g){state.currentGroup=g.id;let i=g.lessons.findIndex(function(l){return state.done.indexOf(l.id)<0;});state.currentLesson=i<0?0:i;state.view="lesson";save();render();} return; }
    if(action==="filter") { state.filter=target.getAttribute("data-filter");save();render();return; }
    if(action==="lesson-select") { state.currentLesson=Number(target.getAttribute("data-index"));save();render();window.scrollTo({top:0,behavior:"smooth"});return; }
    if(action==="answer-lesson") { const item=lessonIndex[state.currentGroup ? groups.find(function(g){return g.id===state.currentGroup;}).lessons[state.currentLesson].id : ""]; if(item){ const rawChoice=target.getAttribute("data-choice"),choice=rawChoice==="unknown"?"unknown":Number(rawChoice),correct=choice===item.answer; state.quizAnswers[item.id]={choice:choice,correct:correct,unknown:choice==="unknown"};if(!correct) state.flashIndex=0;save();render(); } return; }
    if(action==="retry-lesson") { const id=target.getAttribute("data-id");delete state.quizAnswers[id];save();render();return; }
    if(action==="complete-lesson") { const id=target.getAttribute("data-id");const a=state.quizAnswers[id];if(a&&a.correct&&state.done.indexOf(id)<0){state.done.push(id);logStudy();save();toast("Leçon validée. Belle avancée !");render();}return; }
    if(action==="reveal-solution") { const el=document.getElementById("solution-"+target.getAttribute("data-id"));if(el)el.hidden=!el.hidden;return; }
    if(action==="start-practice") { startPractice(target.getAttribute("data-mode")||"all");return; }
    if(action==="start-theme-mock") { startThemeMock();return; }
    if(action==="answer-practice") { const s=state.practice;if(!s)return;const q=s.questions[s.index],rawChoice=target.getAttribute("data-choice"),choice=rawChoice==="unknown"?"unknown":Number(rawChoice),correct=choice===q.lesson.answer;s.responses[s.index]={choice:choice,correct:correct,unknown:choice==="unknown"};if(correct)s.score++;state.quizAnswers[q.lesson.id]={choice:choice,correct:correct,unknown:choice==="unknown"};save();render();return; }
    if(action==="practice-next") { const s=state.practice;if(s.index>=s.questions.length-1)s.finished=true;else s.index++;save();render();return; }
    if(action==="theme-solution") { const el=document.getElementById("theme-solution-"+target.getAttribute("data-id"));if(el)el.hidden=!el.hidden;return; }
    if(action==="finish-theme-mock") { if(!state.practice)return;state.practice.checked=state.practice.checked||[];state.practice.finished=true;save();render();return; }
    if(action==="cancel-practice") { state.practice=null;save();render();return; }
    if(action==="finish-practice") { state.practice=null;save();render();return; }
    if(action==="start-exam") { startExam(target.getAttribute("data-exam"));return; }
    if(action==="resume-exam") { state.view="exam";save();render();return; }
    if(action==="cancel-exam") { showModal("Annuler cette épreuve ?",'<p>Les réponses de cette tentative seront supprimées et aucun bilan ne sera enregistré. Cette action ne modifiera pas tes autres progrès.</p>','<div class="exam-cancel-actions"><button class="secondary-button" data-action="close-modal">Continuer l’épreuve</button><button class="exam-cancel-confirm" data-action="confirm-cancel-exam">Oui, annuler l’épreuve</button></div>');return; }
    if(action==="confirm-cancel-exam") { if(!state.exam)return;state.exam=null;state.view="exams";save();closeModal();render();window.scrollTo({top:0,behavior:"smooth"});toast("Épreuve annulée. Aucun bilan n’a été enregistré.");return; }
    if(action==="start-oral-phase") { if(!state.exam)return;state.exam.oralPhase=target.getAttribute("data-phase");state.exam.oralPhaseStartedAt=Date.now();save();render();return; }
    if(action==="finish-exam" || action==="end-exam") { const type=state.exam&&state.exam.type;state.examHistory=state.examHistory||[];if(type)state.examHistory.push({type:type,date:todayKey(new Date()),checked:state.exam.rubric.length});state.exam=null;state.view="exams";save();render();toast("Bilan enregistré dans cet appareil.");return; }
    if(action==="flash-filter") { state.flashFilter=target.getAttribute("data-theme")||"Toutes";save();render();return; }
    if(action==="start-flash-session") { startFlashSession(target.getAttribute("data-mode")||"due");return; }
    if(action==="flash-reveal") { if(state.flashSession&&!state.flashSession.completed){state.flashSession.revealed=true;save();render();}return; }
    if(action==="flash-rate") { if(state.flashSession&&state.flashSession.revealed)rateFlashcard(target.getAttribute("data-rating"));return; }
    if(action==="flash-repeat-difficult") { const ids=state.flashSession&&state.flashSession.failed?state.flashSession.failed.slice():[];startFlashSession("repeat",ids);return; }
    if(action==="flash-resume") { if(state.flashSession){state.flashSession.paused=false;save();render();}return; }
    if(action==="flash-exit") { if(state.flashSession&&!state.flashSession.completed){state.flashSession.paused=true;save();render();}return; }
    if(action==="flash-back-deck") { state.flashSession=null;save();render();return; }
    if(action==="sources") { showSources();return; }
    if(action==="close-modal") { closeModal();return; }
    if(action==="export-progress") { const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const link=document.createElement("a");link.href=url;link.download="atelier-nsi-progression-"+todayKey(new Date())+".json";link.click();setTimeout(function(){URL.revokeObjectURL(url);},1000);toast("Sauvegarde téléchargée.");return; }
    if(action==="reset-progress") { showModal("Tout réinitialiser ?",'<p>Cette action effacera tes leçons validées, réponses et brouillons enregistrés dans ce navigateur.</p><button class="secondary-button" data-action="confirm-reset" style="color:#9c5f51">Oui, effacer ma progression</button>');return; }
    if(action==="confirm-reset") { state=JSON.parse(JSON.stringify(defaultState));save();closeModal();render();toast("Progression réinitialisée.");return; }
  });

  document.addEventListener("change", function (event) {
    const target=event.target;
    if(target.id==="week-goal"||target.id==="settings-goal"){state.weekGoal=Number(target.value);save();if(target.id==="week-goal")toast("Rythme mis à jour.");return;}
    if(target.id==="practice-session-limit"){state.practiceLimit=[10,15,25,40].indexOf(Number(target.value))>=0?Number(target.value):15;save();render();return;}
    if(target.matches("[data-course-picker]")){const id=target.value;if(courseIndex[id]){state.courseId=id;state.view="course";save();render();window.scrollTo({top:0,behavior:"smooth"});}return;}
    if(target.id==="flash-session-limit"){state.flashSessionLimit=Number(target.value)||15;save();render();return;}
    if(target.id==="import-progress-file"&&target.files&&target.files[0]){
      const reader=new FileReader();
      reader.onload=function(){try{const imported=JSON.parse(String(reader.result));if(!imported||!Array.isArray(imported.done))throw new Error("Fichier invalide");state=Object.assign({},defaultState,imported);state.done=imported.done.filter(function(id){return Boolean(lessonIndex[id]);});state.activeDays=Array.isArray(imported.activeDays)?imported.activeDays.filter(function(d){return typeof d==="string";}).slice(-90):[];state.view="course";if(!courseIndex[state.courseId])state.courseId=(syllabusCourses.find(function(course){return !courseProgress(course).validated;})||syllabusCourses[0]).id;state.exam=null;state.practice=null;state.currentGroup=null;state.currentLesson=null;state.weekGoal=[5,8,12,16].indexOf(Number(imported.weekGoal))>=0?Number(imported.weekGoal):8;save();closeModal();render();toast("Progression importée.");}catch(error){toast("Fichier de sauvegarde non reconnu.");}};
      reader.readAsText(target.files[0]);return;
    }
    if(target.matches("[data-rubric]")){if(!state.exam)return;const key=target.getAttribute("data-rubric");state.exam.rubric=state.exam.rubric||[];if(target.checked&&state.exam.rubric.indexOf(key)<0)state.exam.rubric.push(key);if(!target.checked)state.exam.rubric=state.exam.rubric.filter(function(x){return x!==key;});save();return;}
    if(target.matches("[data-theme-check]")){if(!state.practice)return;const index=Number(target.getAttribute("data-theme-check"));state.practice.checked=state.practice.checked||[];state.practice.checked[index]=target.checked;save();return;}
    if(target.matches("[data-course-rubric]")){const id=target.getAttribute("data-course-rubric"),index=Number(target.getAttribute("data-index"));state.courseProgress=state.courseProgress||{};const progress=state.courseProgress[id]||{checked:[],revealed:[],rubric:[],validated:false};progress.rubric=Array.isArray(progress.rubric)?progress.rubric:[];if(target.checked&&progress.rubric.indexOf(index)<0)progress.rubric.push(index);if(!target.checked)progress.rubric=progress.rubric.filter(function(x){return x!==index;});progress.validated=false;state.courseProgress[id]=progress;const validateButton=document.querySelector(".course-validate-button");if(validateButton){validateButton.disabled=false;validateButton.textContent="Enregistrer mon auto-validation";}save();return;}
  });
  document.addEventListener("input", function (event) {
    const target=event.target;
    if(target.matches("[data-flash-answer]")){if(state.flashSession){state.flashSession.draft=target.value;save();}return;}
    if(target.matches("[data-code-editor]")){const id=target.getAttribute("data-code-editor");state.codeDrafts[id]=target.value;if(state.codeResults[id]){delete state.codeResults[id];const inlineResult=document.querySelector('[data-course-code-result="'+id+'"]');if(inlineResult)inlineResult.innerHTML='<div class="code-result-placeholder"><span>↵</span><p>Modifie ton code puis relance les tests.</p></div>';}save();updateChrome();return;}
    if(target.matches("[data-note]")){state.notes[target.getAttribute("data-note")]=target.value;save();return;}
    if(target.matches("[data-course-answer]")){state.courseDrafts[target.getAttribute("data-course-answer")]=target.value;save();return;}
    if(target.matches("[data-course-example-draft]")){state.courseDrafts[target.getAttribute("data-course-example-draft")]=target.value;save();const next=document.querySelector('#course-example [data-action="example-step"][data-dir="next"]');if(next)next.textContent=target.value.trim()?"Afficher la suite →":"Je bloque · afficher la suite →";return;}
    if(target.matches("[data-exam-note]")){if(!state.exam)return;state.exam.answers=state.exam.answers||{};state.exam.answers[target.getAttribute("data-exam-note")]=target.value;save();return;}
    if(target.matches("[data-theme-answer]")){if(!state.practice)return;state.practice.answers=state.practice.answers||{};state.practice.answers[target.getAttribute("data-theme-answer")]=target.value;save();return;}
  });
  document.getElementById("settings-button").addEventListener("click",showSettings);
  document.getElementById("mobile-menu").addEventListener("click",function(){document.getElementById("sidebar").classList.toggle("open");});
  document.getElementById("modal-backdrop").addEventListener("click",function(e){if(e.target.id==="modal-backdrop")closeModal();});
  document.addEventListener("keydown",function(e){
    if(e.key==="Escape")closeModal();
    const editor=e.target.closest&&e.target.closest("[data-code-editor]");
    if(!editor||!editor.closest(".inline-python-body"))return;
    if(e.key==="Tab"){e.preventDefault();editor.setRangeText("    ",editor.selectionStart,editor.selectionEnd,"end");editor.dispatchEvent(new Event("input",{bubbles:true}));}
    if((e.ctrlKey||e.metaKey)&&e.key==="Enter"){e.preventDefault();runCourseExampleCode(editor.getAttribute("data-code-editor"));}
  });

  render();
  initializeCloudSync();
})();
