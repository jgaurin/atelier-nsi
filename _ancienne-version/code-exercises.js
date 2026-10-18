/* Exercices originaux de programmation Python pour l'Atelier NSI. */
window.NSI_CODE_EXERCISES = [
  {
    id: "hello-function", level: 1, topic: "Premiers pas", title: "Écrire sa première fonction", time: "8 min",
    goal: "Écris une fonction qui transforme un nom en message de bienvenue.",
    prompt: "Complète saluer(nom). La fonction renvoie le texte « Bonjour, Ada ! » quand nom vaut « Ada ». Elle ne doit pas afficher le texte : elle doit le renvoyer avec return.",
    starter: "def saluer(nom):\n    # Construis puis renvoie le message\n    pass",
    tests: [
      {label:"Un prénom simple", code:'assert saluer("Ada") == "Bonjour, Ada !"'},
      {label:"Un nom composé", code:'assert saluer("Alan Turing") == "Bonjour, Alan Turing !"'},
      {label:"Une chaîne vide", code:'assert saluer("") == "Bonjour,  !"'}
    ],
    hints:["Une f-string peut insérer une variable dans un texte : f\"Bonjour, {nom} !\".","N'oublie pas return : print(...) affiche mais ne renvoie pas le résultat."],
    solution:"def saluer(nom):\n    return f\"Bonjour, {nom} !\"",
    explanation:"Une fonction reçoit une valeur par son paramètre, calcule un résultat, puis le renvoie. Ici, la f-string insère le contenu de nom dans le message."
  },
  {
    id: "positive-count", level: 1, topic: "Premiers pas", title: "Compter les valeurs positives", time: "10 min",
    goal: "Parcourir une liste et mettre à jour un compteur.",
    prompt: "Écris compter_positifs(nombres), qui renvoie le nombre de valeurs strictement supérieures à zéro. Zéro n'est pas positif.",
    starter: "def compter_positifs(nombres):\n    compteur = 0\n    # Parcours la liste et mets le compteur à jour\n    return compteur",
    tests:[{label:"Valeurs positives et négatives",code:"assert compter_positifs([-2, 0, 4, 7]) == 2"},{label:"Aucune valeur positive",code:"assert compter_positifs([-5, 0, -1]) == 0"},{label:"Liste vide",code:"assert compter_positifs([]) == 0"}],
    hints:["Utilise une boucle for pour examiner chaque valeur.","La condition attendue est nombre > 0, puis tu ajoutes 1 au compteur."],
    solution:"def compter_positifs(nombres):\n    compteur = 0\n    for nombre in nombres:\n        if nombre > 0:\n            compteur += 1\n    return compteur",
    explanation:"Le compteur commence à zéro. Il augmente d'une unité pour chaque élément qui respecte la condition. Cette solution parcourt la liste une fois : son coût est O(n)."
  },
  {
    id: "list-maximum", level: 1, topic: "Premiers pas", title: "Trouver le maximum sans trier", time: "12 min",
    goal: "Maintenir un invariant pendant un parcours.",
    prompt: "Écris maximum(nombres) pour une liste non vide. Tu ne dois pas utiliser max() ni trier la liste. La liste peut contenir uniquement des nombres négatifs.",
    starter: "def maximum(nombres):\n    # Choisis une initialisation correcte\n    ...",
    tests:[{label:"Ordre quelconque",code:"assert maximum([3, 9, 2, 5]) == 9"},{label:"Nombres tous négatifs",code:"assert maximum([-8, -3, -11]) == -3"},{label:"Un seul élément",code:"assert maximum([4]) == 4"}],
    hints:["Prends le premier élément comme maximum provisoire, pas zéro.","À chaque élément, remplace le maximum provisoire s'il est plus petit."],
    solution:"def maximum(nombres):\n    meilleur = nombres[0]\n    for nombre in nombres[1:]:\n        if nombre > meilleur:\n            meilleur = nombre\n    return meilleur",
    explanation:"Après chaque étape, meilleur est le maximum des éléments déjà parcourus : c'est l'invariant de boucle. La fonction effectue un seul parcours, donc son coût est O(n)."
  },
  {
    id: "binary-to-decimal", level: 1, topic: "Représentation", title: "Convertir du binaire en décimal", time: "15 min",
    goal: "Relier une représentation binaire à un calcul algorithmique.",
    prompt: "Écris binaire_vers_decimal(bits), où bits est une chaîne non vide contenant des 0 et des 1. N'utilise pas int(bits, 2). Traite les bits de gauche à droite : à chaque étape, double la valeur puis ajoute le bit.",
    starter: "def binaire_vers_decimal(bits):\n    valeur = 0\n    for bit in bits:\n        # Mets à jour la valeur\n        ...\n    return valeur",
    tests:[{label:"Un bit",code:'assert binaire_vers_decimal("1") == 1'},{label:"Plusieurs bits",code:'assert binaire_vers_decimal("10110") == 22'},{label:"Zéros en tête",code:'assert binaire_vers_decimal("00101") == 5'}],
    hints:["La valeur correspondant à un préfixe binaire est doublée quand on ajoute le bit suivant.","Convertis le caractère bit en entier avec int(bit), puis fais valeur = 2 * valeur + int(bit)."],
    solution:"def binaire_vers_decimal(bits):\n    valeur = 0\n    for bit in bits:\n        valeur = 2 * valeur + int(bit)\n    return valeur",
    explanation:"La récurrence valeur = 2 × valeur + bit ajoute le nouveau bit à droite. Cette méthode ne crée pas les puissances de 2 explicitement et prend O(n) opérations."
  },
  {
    id: "factorial", level: 1, topic: "Fonctions", title: "Calculer une factorielle", time: "12 min",
    goal: "Construire une solution itérative et traiter un cas limite.",
    prompt: "Écris factorielle(n) pour un entier n positif ou nul. Par convention, 0! = 1. Tu peux supposer que n est valide.",
    starter: "def factorielle(n):\n    resultat = 1\n    # Multiplie les entiers de 1 à n\n    return resultat",
    tests:[{label:"Cas de base",code:"assert factorielle(0) == 1"},{label:"Petite valeur",code:"assert factorielle(4) == 24"},{label:"Valeur plus grande",code:"assert factorielle(7) == 5040"}],
    hints:["Initialiser resultat à 1 rend le cas n = 0 naturellement correct.","range(1, n + 1) contient 1, 2, ..., n."],
    solution:"def factorielle(n):\n    resultat = 1\n    for valeur in range(1, n + 1):\n        resultat *= valeur\n    return resultat",
    explanation:"La boucle multiplie successivement les facteurs. Pour n, elle réalise n multiplications : temps O(n), mémoire auxiliaire O(1)."
  },
  {
    id: "prime-number", level: 2, topic: "Recherche", title: "Tester si un nombre est premier", time: "15 min",
    goal: "Réduire le nombre de vérifications grâce à un raisonnement mathématique.",
    prompt: "Écris est_premier(n). Un nombre premier est un entier supérieur ou égal à 2 qui n'a aucun diviseur autre que 1 et lui-même. Évite les essais au-delà de la racine carrée de n.",
    starter: "def est_premier(n):\n    if n < 2:\n        return False\n    diviseur = 2\n    # Cherche un diviseur pertinent\n    ...",
    tests:[{label:"Valeur inférieure à 2",code:"assert est_premier(1) is False"},{label:"Nombre premier",code:"assert est_premier(29) is True"},{label:"Nombre composé",code:"assert est_premier(49) is False"},{label:"Plus petit nombre premier",code:"assert est_premier(2) is True"}],
    hints:["Si n possède un diviseur supérieur à sa racine carrée, l'autre facteur est plus petit.","Continue tant que diviseur * diviseur <= n. Si n % diviseur == 0, renvoie False."],
    solution:"def est_premier(n):\n    if n < 2:\n        return False\n    diviseur = 2\n    while diviseur * diviseur <= n:\n        if n % diviseur == 0:\n            return False\n        diviseur += 1\n    return True",
    explanation:"Les diviseurs apparaissent par paires. Au-delà de √n, la paire correspondante a déjà été examinée. Le pire cas demande O(√n) essais."
  },
  {
    id: "palindrome", level: 2, topic: "Chaînes", title: "Reconnaître un palindrome", time: "12 min",
    goal: "Comparer des caractères sans créer de boucle infinie.",
    prompt: "Écris est_palindrome(texte) qui renvoie True si le texte se lit pareil de gauche à droite et de droite à gauche. Ignore les espaces et la casse. Tu peux ignorer la ponctuation.",
    starter: "def est_palindrome(texte):\n    # Normalise les caractères à comparer\n    ...",
    tests:[{label:"Palindrome simple",code:'assert est_palindrome("kayak") is True'},{label:"Espaces et casse",code:'assert est_palindrome("Esope reste ici et se repose") is True'},{label:"Texte non palindrome",code:'assert est_palindrome("python") is False'}],
    hints:["Construis une chaîne normalisée avec les caractères alphanumériques en minuscules.","Compare la chaîne normalisée à sa tranche inversée : texte[::-1]."],
    solution:"def est_palindrome(texte):\n    normalise = \"\".join(caractere.lower() for caractere in texte if caractere.isalnum())\n    return normalise == normalise[::-1]",
    explanation:"La normalisation retire espaces et ponctuation puis met les lettres en minuscules. Le test compare ensuite la séquence à son inverse."
  },
  {
    id: "frequency-table", level: 2, topic: "Dictionnaires", title: "Construire une table de fréquences", time: "15 min",
    goal: "Choisir un dictionnaire pour compter des occurrences.",
    prompt: "Écris frequences(lettres), qui renvoie un dictionnaire indiquant combien de fois chaque élément apparaît. Par exemple, ['a', 'b', 'a'] donne {'a': 2, 'b': 1}.",
    starter: "def frequences(elements):\n    compte = {}\n    # Mets à jour le dictionnaire\n    return compte",
    tests:[{label:"Valeurs répétées",code:"assert frequences(['a', 'b', 'a']) == {'a': 2, 'b': 1}"},{label:"Tous différents",code:"assert frequences([2, 3, 4]) == {2: 1, 3: 1, 4: 1}"},{label:"Entrée vide",code:"assert frequences([]) == {}"}],
    hints:["Pour une nouvelle clé, son compteur de départ est zéro.","Tu peux utiliser compte[element] = compte.get(element, 0) + 1."],
    solution:"def frequences(elements):\n    compte = {}\n    for element in elements:\n        compte[element] = compte.get(element, 0) + 1\n    return compte",
    explanation:"Le dictionnaire associe chaque valeur à son compteur. En moyenne, chaque mise à jour prend un temps constant : le parcours complet est O(n)."
  },
  {
    id: "deduplicate", level: 2, topic: "Listes", title: "Supprimer les doublons en gardant l'ordre", time: "15 min",
    goal: "Préserver un invariant sur la liste résultat.",
    prompt: "Écris sans_doublons(elements), qui renvoie une nouvelle liste avec la première occurrence de chaque élément, dans le même ordre. Ne transforme pas la liste en set.",
    starter: "def sans_doublons(elements):\n    resultat = []\n    # Ajoute seulement les éléments absents du résultat\n    return resultat",
    tests:[{label:"Répétitions mêlées",code:"assert sans_doublons([3, 1, 3, 2, 1]) == [3, 1, 2]"},{label:"Aucun doublon",code:"assert sans_doublons(['a', 'b']) == ['a', 'b']"},{label:"Liste vide",code:"assert sans_doublons([]) == []"}],
    hints:["Parcours les éléments dans l'ordre.","Ajoute un élément uniquement si element not in resultat."],
    solution:"def sans_doublons(elements):\n    resultat = []\n    for element in elements:\n        if element not in resultat:\n            resultat.append(element)\n    return resultat",
    explanation:"La liste résultat ne contient jamais de doublons et respecte l'ordre de première apparition. Cette version utilise une recherche dans résultat à chaque étape et coûte O(n²) au pire."
  },
  {
    id: "linear-search", level: 1, topic: "Recherche", title: "Recherche linéaire", time: "10 min",
    goal: "Retourner une position ou une valeur sentinelle.",
    prompt: "Écris recherche(liste, cible), qui renvoie l'indice de la première occurrence de cible, ou -1 si elle est absente. La liste n'est pas nécessairement triée.",
    starter: "def recherche(liste, cible):\n    # Parcours avec les indices\n    ...\n    return -1",
    tests:[{label:"Valeur présente",code:"assert recherche([7, 2, 9], 2) == 1"},{label:"Valeur absente",code:"assert recherche([7, 2, 9], 4) == -1"},{label:"Doublon",code:"assert recherche([5, 3, 5], 5) == 0"}],
    hints:["enumerate(liste) fournit l'indice et la valeur de chaque élément.","Dès que la valeur égale cible, renvoie son indice."],
    solution:"def recherche(liste, cible):\n    for indice, valeur in enumerate(liste):\n        if valeur == cible:\n            return indice\n    return -1",
    explanation:"Au pire, la recherche examine n éléments : complexité O(n). Une liste non triée ne permet pas d'écarter une partie des valeurs sans les examiner."
  },
  {
    id: "binary-search", level: 2, topic: "Recherche", title: "Recherche dichotomique", time: "18 min",
    goal: "Maintenir un intervalle de recherche et justifier sa réduction.",
    prompt: "Écris recherche_dichotomique(liste, cible) pour une liste triée par ordre croissant. Renvoie l'indice trouvé ou -1. L'algorithme doit réduire l'intervalle de moitié à chaque étape.",
    starter: "def recherche_dichotomique(liste, cible):\n    gauche = 0\n    droite = len(liste) - 1\n    while gauche <= droite:\n        milieu = (gauche + droite) // 2\n        # Compare la valeur du milieu à la cible\n        ...\n    return -1",
    tests:[{label:"Valeur au milieu",code:"assert recherche_dichotomique([1, 3, 5, 7, 9], 5) == 2"},{label:"Valeur en première position",code:"assert recherche_dichotomique([2, 4, 6, 8], 2) == 0"},{label:"Valeur absente",code:"assert recherche_dichotomique([2, 4, 6, 8], 7) == -1"},{label:"Liste vide",code:"assert recherche_dichotomique([], 1) == -1"}],
    hints:["Si liste[milieu] est trop petite, la cible ne peut se trouver qu'à droite.","Si elle est trop grande, diminue droite. Pense au return quand la valeur est trouvée."],
    solution:"def recherche_dichotomique(liste, cible):\n    gauche, droite = 0, len(liste) - 1\n    while gauche <= droite:\n        milieu = (gauche + droite) // 2\n        if liste[milieu] == cible:\n            return milieu\n        if liste[milieu] < cible:\n            gauche = milieu + 1\n        else:\n            droite = milieu - 1\n    return -1",
    explanation:"L'invariant est que la cible, si elle est présente, se trouve dans l'intervalle [gauche, droite]. Chaque comparaison conserve la moitié utile. Le coût est O(log n), à condition que la liste soit triée."
  },
  {
    id: "merge-lists", level: 3, topic: "Tri", title: "Fusionner deux listes triées", time: "18 min",
    goal: "Construire la brique centrale du tri fusion.",
    prompt: "Écris fusionner(a, b), qui renvoie une nouvelle liste triée contenant tous les éléments de a et b. Les deux listes fournies sont déjà triées. Ne les retrie pas à la fin.",
    starter: "def fusionner(a, b):\n    resultat = []\n    i = 0\n    j = 0\n    # Compare les éléments encore disponibles\n    ...\n    return resultat",
    tests:[{label:"Deux listes équilibrées",code:"assert fusionner([1, 4, 8], [2, 3, 9]) == [1, 2, 3, 4, 8, 9]"},{label:"Une liste vide",code:"assert fusionner([], [1, 2]) == [1, 2]"},{label:"Valeurs égales",code:"assert fusionner([1, 2], [1, 2]) == [1, 1, 2, 2]"}],
    hints:["Compare a[i] et b[j] tant que les deux listes ont des éléments.","À la fin, ajoute la partie restante de a ou de b."],
    solution:"def fusionner(a, b):\n    resultat = []\n    i = j = 0\n    while i < len(a) and j < len(b):\n        if a[i] <= b[j]:\n            resultat.append(a[i])\n            i += 1\n        else:\n            resultat.append(b[j])\n            j += 1\n    resultat.extend(a[i:])\n    resultat.extend(b[j:])\n    return resultat",
    explanation:"À chaque itération, le plus petit élément en tête est nécessairement le prochain élément du résultat. Chaque élément est copié une seule fois : coût O(n + m)."
  },
  {
    id: "insertion-sort", level: 3, topic: "Tri", title: "Coder le tri par insertion", time: "20 min",
    goal: "Trier en maintenant une partie déjà ordonnée.",
    prompt: "Écris tri_insertion(valeurs), qui renvoie une nouvelle liste triée par ordre croissant sans utiliser sorted() ni sort(). À chaque étape, insère la valeur courante dans la partie gauche déjà triée.",
    starter: "def tri_insertion(valeurs):\n    resultat = valeurs.copy()\n    for i in range(1, len(resultat)):\n        valeur = resultat[i]\n        j = i - 1\n        # Décale les valeurs trop grandes vers la droite\n        ...\n        resultat[j + 1] = valeur\n    return resultat",
    tests:[{label:"Ordre quelconque",code:"assert tri_insertion([5, 2, 4, 1]) == [1, 2, 4, 5]"},{label:"Valeurs déjà triées",code:"assert tri_insertion([1, 2, 3]) == [1, 2, 3]"},{label:"Doublons et négatifs",code:"assert tri_insertion([0, -1, 0, 3]) == [-1, 0, 0, 3]"}],
    hints:["Tant que j >= 0 et resultat[j] > valeur, décale resultat[j] d'une case.","Après le décalage, j + 1 est la place libre de valeur."],
    solution:"def tri_insertion(valeurs):\n    resultat = valeurs.copy()\n    for i in range(1, len(resultat)):\n        valeur = resultat[i]\n        j = i - 1\n        while j >= 0 and resultat[j] > valeur:\n            resultat[j + 1] = resultat[j]\n            j -= 1\n        resultat[j + 1] = valeur\n    return resultat",
    explanation:"Avant chaque itération, le préfixe resultat[:i] est trié. On y insère la nouvelle valeur en décalant les plus grandes. Le tri est en O(n²) au pire et O(n) quand la liste est déjà triée."
  },
  {
    id: "balanced-parentheses", level: 2, topic: "Structures", title: "Vérifier des parenthèses", time: "18 min",
    goal: "Utiliser une pile pour reconnaître une structure équilibrée.",
    prompt: "Écris parentheses_equilibrees(texte), qui renvoie True si les parenthèses (), crochets [] et accolades {} sont correctement ouvertes et fermées. Les autres caractères peuvent être ignorés.",
    starter: "def parentheses_equilibrees(texte):\n    pile = []\n    correspondance = {')': '(', ']': '[', '}': '{'}\n    # Parcours les caractères et gère la pile\n    ...\n    return len(pile) == 0",
    tests:[{label:"Imbrication correcte",code:'assert parentheses_equilibrees("a{b[c(d)]}") is True'},{label:"Mauvais ordre",code:'assert parentheses_equilibrees("([)]") is False'},{label:"Fermeture sans ouverture",code:'assert parentheses_equilibrees(")") is False'},{label:"Chaîne vide",code:'assert parentheses_equilibrees("") is True'}],
    hints:["À l'ouverture, empile le caractère. À la fermeture, la pile doit être non vide et son sommet doit correspondre.","À la fin, la pile doit être vide."],
    solution:"def parentheses_equilibrees(texte):\n    pile = []\n    correspondance = {')': '(', ']': '[', '}': '{'}\n    for caractere in texte:\n        if caractere in '([{':\n            pile.append(caractere)\n        elif caractere in correspondance:\n            if not pile or pile.pop() != correspondance[caractere]:\n                return False\n    return not pile",
    explanation:"Une pile convient car la dernière parenthèse ouverte doit être la première refermée (LIFO). Chaque caractère est examiné une fois : temps O(n), mémoire O(n) au pire."
  },
  {
    id: "breadth-first", level: 3, topic: "Graphes", title: "Parcours en largeur", time: "22 min",
    goal: "Parcourir un graphe non pondéré avec une file FIFO.",
    prompt: "Écris parcours_largeur(graphe, depart) pour un graphe représenté par un dictionnaire sommet → voisins. Renvoie la liste des sommets dans l'ordre de découverte. Marque chaque sommet dès son ajout à la file.",
    starter: "from collections import deque\n\ndef parcours_largeur(graphe, depart):\n    visites = [depart]\n    file = deque([depart])\n    # Tant que la file n'est pas vide...\n    ...\n    return visites",
    tests:[{label:"Graphe avec embranchement",code:"assert parcours_largeur({'A':['B','C'], 'B':['D'], 'C':['E'], 'D':[], 'E':[]}, 'A') == ['A', 'B', 'C', 'D', 'E']"},{label:"Cycle",code:"assert parcours_largeur({'A':['B'], 'B':['A']}, 'A') == ['A', 'B']"},{label:"Sommet isolé",code:"assert parcours_largeur({'Z':[]}, 'Z') == ['Z']"}],
    hints:["Retire le premier sommet de la file avec popleft().", "Pour chaque voisin non encore visité, ajoute-le aux visites et à la file."],
    solution:"from collections import deque\n\ndef parcours_largeur(graphe, depart):\n    visites = [depart]\n    file = deque([depart])\n    while file:\n        sommet = file.popleft()\n        for voisin in graphe.get(sommet, []):\n            if voisin not in visites:\n                visites.append(voisin)\n                file.append(voisin)\n    return visites",
    explanation:"La file FIFO explore les sommets par distance croissante du départ. Pour éviter une recherche lente dans visites, une version plus efficace utilise un ensemble visited, donnant O(V + E) avec des listes d'adjacence."
  },
  {
    id: "grid-paths", level: 3, topic: "Récursivité", title: "Compter les chemins dans une grille", time: "20 min",
    goal: "Comparer une récurrence récursive et une programmation dynamique.",
    prompt: "Écris nombre_chemins(lignes, colonnes), le nombre de chemins de la case en haut à gauche à celle en bas à droite si tu peux seulement aller à droite ou en bas. Les dimensions sont positives. Ta version doit éviter de recalculer plusieurs fois les mêmes sous-problèmes.",
    starter: "def nombre_chemins(lignes, colonnes):\n    # Construis une table de programmation dynamique\n    ...",
    tests:[{label:"Grille 1 × 1",code:"assert nombre_chemins(1, 1) == 1"},{label:"Grille 2 × 3",code:"assert nombre_chemins(2, 3) == 3"},{label:"Grille 3 × 3",code:"assert nombre_chemins(3, 3) == 6"}],
    hints:["La première ligne et la première colonne ne comportent qu'un chemin.","Dans une case intérieure, le nombre de chemins est la somme du dessus et de la gauche."],
    solution:"def nombre_chemins(lignes, colonnes):\n    table = [[1] * colonnes for _ in range(lignes)]\n    for i in range(1, lignes):\n        for j in range(1, colonnes):\n            table[i][j] = table[i - 1][j] + table[i][j - 1]\n    return table[-1][-1]",
    explanation:"La relation de récurrence est chemins(i,j) = chemins(i-1,j) + chemins(i,j-1). La table évite le recalcul exponentiel de la version récursive naïve et demande O(lignes × colonnes) temps."
  },
  {
    id: "shortest-path-bfs", level: 3, topic: "Graphes", title: "Distance minimale dans un graphe", time: "20 min",
    goal: "Associer BFS et calcul d'une distance minimale non pondérée.",
    prompt: "Écris distance_minimale(graphe, depart, arrivee), qui renvoie le nombre minimal d'arêtes d'un chemin entre deux sommets d'un graphe non orienté, ou -1 s'il n'existe aucun chemin. Chaque arête a le même coût.",
    starter: "from collections import deque\n\ndef distance_minimale(graphe, depart, arrivee):\n    file = deque([(depart, 0)])\n    visites = {depart}\n    # Parcours par distance croissante\n    ...\n    return -1",
    tests:[{label:"Chemin direct",code:"assert distance_minimale({'A':['B'], 'B':['A','C'], 'C':['B']}, 'A', 'B') == 1"},{label:"Chemin avec détour",code:"assert distance_minimale({'A':['B','C'], 'B':['A','D'], 'C':['A','D'], 'D':['B','C']}, 'A', 'D') == 2"},{label:"Sommets déconnectés",code:"assert distance_minimale({'A':['B'], 'B':['A'], 'Z':[]}, 'A', 'Z') == -1"},{label:"Départ et arrivée identiques",code:"assert distance_minimale({'A':[]}, 'A', 'A') == 0"}],
    hints:["Chaque élément de la file est un couple (sommet, distance depuis le départ).","Quand tu découvres un voisin, marque-le immédiatement, puis ajoute (voisin, distance + 1)."],
    solution:"from collections import deque\n\ndef distance_minimale(graphe, depart, arrivee):\n    file = deque([(depart, 0)])\n    visites = {depart}\n    while file:\n        sommet, distance = file.popleft()\n        if sommet == arrivee:\n            return distance\n        for voisin in graphe.get(sommet, []):\n            if voisin not in visites:\n                visites.add(voisin)\n                file.append((voisin, distance + 1))\n    return -1",
    explanation:"BFS visite les sommets par distance croissante. Le premier moment où l'arrivée est retirée de la file donne donc la distance minimale. Pour un graphe non pondéré, le coût est O(V + E)."
  },
  {
    id: "euclid-gcd", level: 2, topic: "Fonctions", title: "Calculer un PGCD par l’algorithme d’Euclide", time: "15 min",
    goal: "Coder une boucle avec un invariant simple et analyser sa terminaison.",
    prompt: "Écris pgcd(a, b) pour deux entiers naturels non tous deux nuls. Utilise l’algorithme d’Euclide : tant que b n’est pas nul, remplace (a, b) par (b, a % b).",
    starter: "def pgcd(a, b):\n    while b != 0:\n        # Mets à jour simultanément a et b\n        ...\n    return a",
    tests:[{label:"Deux entiers ayant un facteur commun",code:"assert pgcd(48, 18) == 6"},{label:"Nombres premiers entre eux",code:"assert pgcd(17, 5) == 1"},{label:"Second argument nul",code:"assert pgcd(9, 0) == 9"},{label:"Ordre inversé",code:"assert pgcd(18, 48) == 6"}],
    hints:["L’affectation simultanée permet d’écrire a, b = b, a % b.","Le reste est strictement inférieur à b lorsque b > 0 : la suite des restes finit par atteindre zéro."],
    solution:"def pgcd(a, b):\n    while b != 0:\n        a, b = b, a % b\n    return a",
    explanation:"L’identité pgcd(a,b) = pgcd(b, a mod b) conserve le résultat. Le second terme décroît strictement dans les naturels positifs, ce qui prouve la terminaison. Le nombre d’étapes est logarithmique en la taille des valeurs."
  },
  {
    id: "binary-search-index", level: 2, topic: "Recherche", title: "Renvoyer l’indice d’une recherche dichotomique", time: "18 min",
    goal: "Maintenir un intervalle candidat et traiter l’absence de la cible.",
    prompt: "Écris indice_dichotomique(valeurs, cible). valeurs est une liste triée croissante. Renvoie un indice où se trouve la cible, ou -1 si elle est absente.",
    starter: "def indice_dichotomique(valeurs, cible):\n    gauche = 0\n    droite = len(valeurs) - 1\n    while gauche <= droite:\n        milieu = (gauche + droite) // 2\n        # Compare valeurs[milieu] à cible\n        ...\n    return -1",
    tests:[{label:"Cible au milieu",code:"assert indice_dichotomique([1, 3, 5, 7, 9], 5) == 2"},{label:"Cible en bordure",code:"assert indice_dichotomique([2, 4, 6], 2) == 0"},{label:"Cible absente",code:"assert indice_dichotomique([2, 4, 6], 5) == -1"},{label:"Liste vide",code:"assert indice_dichotomique([], 5) == -1"}],
    hints:["Si valeurs[milieu] < cible, la cible ne peut se trouver que strictement à droite.","Quand l’intervalle devient vide, gauche > droite et la cible est absente."],
    solution:"def indice_dichotomique(valeurs, cible):\n    gauche = 0\n    droite = len(valeurs) - 1\n    while gauche <= droite:\n        milieu = (gauche + droite) // 2\n        if valeurs[milieu] == cible:\n            return milieu\n        if valeurs[milieu] < cible:\n            gauche = milieu + 1\n        else:\n            droite = milieu - 1\n    return -1",
    explanation:"L’intervalle [gauche, droite] contient toutes les positions encore possibles. Chaque comparaison élimine environ la moitié des candidats : temps O(log n), espace O(1). La précondition de tri est essentielle."
  },
  {
    id: "prefix-sums", level: 2, topic: "Listes", title: "Construire une table de sommes préfixes", time: "15 min",
    goal: "Prétraiter une liste afin de répondre rapidement aux sommes d’intervalles.",
    prompt: "Écris sommes_prefixes(valeurs), qui renvoie une liste p telle que p[i] est la somme des i premiers éléments. La liste résultat commence donc par 0 et a une longueur supérieure de 1 à l’entrée.",
    starter: "def sommes_prefixes(valeurs):\n    prefixe = [0]\n    for valeur in valeurs:\n        # Ajoute la somme cumulée suivante\n        ...\n    return prefixe",
    tests:[{label:"Valeurs positives",code:"assert sommes_prefixes([3, 1, 4]) == [0, 3, 4, 8]"},{label:"Valeurs négatives",code:"assert sommes_prefixes([2, -5, 6]) == [0, 2, -3, 3]"},{label:"Liste vide",code:"assert sommes_prefixes([]) == [0]"}],
    hints:["La nouvelle somme est la dernière somme préfixe plus la valeur courante.","La somme des valeurs d’indices i à j inclus vaut p[j + 1] - p[i]."],
    solution:"def sommes_prefixes(valeurs):\n    prefixe = [0]\n    for valeur in valeurs:\n        prefixe.append(prefixe[-1] + valeur)\n    return prefixe",
    explanation:"Le parcours construit p en O(n). Une fois prétraitée, la somme d’un intervalle inclusif [i,j] se calcule en O(1) par p[j+1]-p[i], si les bornes sont valides."
  },
  {
    id: "depth-first", level: 3, topic: "Graphes", title: "Parcours en profondeur itératif", time: "20 min",
    goal: "Utiliser une pile et un ensemble pour visiter un graphe sans revisiter les sommets.",
    prompt: "Écris parcours_profondeur(graphe, depart) pour un graphe représenté par un dictionnaire sommet → voisins. Renvoie les sommets dans leur ordre de première découverte. Pour préserver l’ordre de la liste des voisins, empile-les dans l’ordre inverse.",
    starter: "def parcours_profondeur(graphe, depart):\n    visites = []\n    vus = set()\n    pile = [depart]\n    while pile:\n        # Retire un sommet et découvre ses voisins\n        ...\n    return visites",
    tests:[{label:"Arbre avec ordre contrôlé",code:"assert parcours_profondeur({'A':['B','C'], 'B':['D'], 'C':[], 'D':[]}, 'A') == ['A', 'B', 'D', 'C']"},{label:"Cycle",code:"assert parcours_profondeur({'A':['B'], 'B':['A']}, 'A') == ['A', 'B']"},{label:"Sommet absent des clés",code:"assert parcours_profondeur({'A':['Z']}, 'A') == ['A', 'Z']"}],
    hints:["Marque un sommet comme vu au moment où tu l’ajoutes à la pile pour éviter les doublons.","`for voisin in reversed(graphe.get(sommet, []))` conserve l’ordre attendu quand la pile est LIFO."],
    solution:"def parcours_profondeur(graphe, depart):\n    visites = []\n    vus = {depart}\n    pile = [depart]\n    while pile:\n        sommet = pile.pop()\n        visites.append(sommet)\n        for voisin in reversed(graphe.get(sommet, [])):\n            if voisin not in vus:\n                vus.add(voisin)\n                pile.append(voisin)\n    return visites",
    explanation:"La pile réalise un parcours en profondeur. Un ensemble donne des tests d’appartenance efficaces ; chaque sommet et chaque arête sont examinés un nombre borné de fois, soit O(V+E)."
  },
  {
    id: "fibonacci-dp", level: 2, topic: "Programmation dynamique", title: "Calculer Fibonacci sans recalculs", time: "16 min",
    goal: "Transformer une définition récursive en calcul itératif mémorisé.",
    prompt: "Écris fibonacci(n) pour n entier naturel, avec F(0)=0 et F(1)=1. Ta solution doit calculer chaque terme une seule fois, sans récursion naïve.",
    starter: "def fibonacci(n):\n    precedent, courant = 0, 1\n    for _ in range(n):\n        # Avance d'un terme\n        ...\n    return precedent",
    tests:[{label:"Premier terme",code:"assert fibonacci(0) == 0"},{label:"Terme suivant",code:"assert fibonacci(1) == 1"},{label:"Valeur intermédiaire",code:"assert fibonacci(8) == 21"},{label:"Valeur plus grande",code:"assert fibonacci(20) == 6765"}],
    hints:["À chaque tour, remplace les deux valeurs par (courant, precedent + courant).","L’affectation simultanée Python permet de conserver l’ancienne valeur de courant."],
    solution:"def fibonacci(n):\n    precedent, courant = 0, 1\n    for _ in range(n):\n        precedent, courant = courant, precedent + courant\n    return precedent",
    explanation:"La boucle applique la récurrence F(n+1)=F(n)+F(n−1) en conservant uniquement deux états. Temps O(n), mémoire O(1), contre un nombre exponentiel d’appels pour la version récursive naïve."
  },
  {
    id: "second-largest-distinct", level: 3, topic: "Parcours et invariants", title: "Trouver le deuxième maximum distinct", time: "20 min",
    goal: "Concevoir un parcours en une passe et expliciter son contrat.",
    prompt: "Écris deuxieme_maximum(valeurs), qui renvoie la deuxième plus grande valeur distincte. Tu ne dois ni trier ni utiliser sorted(). Si moins de deux valeurs distinctes existent, renvoie None.",
    starter: "def deuxieme_maximum(valeurs):\n    plus_grand = None\n    deuxieme = None\n    for valeur in valeurs:\n        # Mets à jour les deux meilleurs distincts\n        ...\n    return deuxieme",
    tests:[{label:"Doublons du maximum",code:"assert deuxieme_maximum([4, 9, 9, 2]) == 4"},{label:"Valeurs négatives",code:"assert deuxieme_maximum([-8, -3, -5]) == -5"},{label:"Une valeur distincte",code:"assert deuxieme_maximum([7, 7]) is None"},{label:"Liste vide",code:"assert deuxieme_maximum([]) is None"}],
    hints:["Si valeur dépasse le maximum, l’ancien maximum devient le deuxième.","Si valeur est strictement inférieure au maximum mais supérieure au deuxième, elle devient le deuxième."],
    solution:"def deuxieme_maximum(valeurs):\n    plus_grand = None\n    deuxieme = None\n    for valeur in valeurs:\n        if plus_grand is None or valeur > plus_grand:\n            deuxieme = plus_grand\n            plus_grand = valeur\n        elif valeur < plus_grand and (deuxieme is None or valeur > deuxieme):\n            deuxieme = valeur\n    return deuxieme",
    explanation:"Après chaque itération, plus_grand et deuxieme sont les deux plus grandes valeurs distinctes déjà vues. La fonction parcourt la liste une fois : O(n) temps et O(1) mémoire."
  },
  {
    id: "run-length-encode", level: 2, topic: "Séquences", title: "Compresser une suite de symboles", time: "16 min",
    goal: "Construire une sortie à partir de séquences consécutives égales.",
    prompt: "Écris encoder_runs(valeurs), qui regroupe les valeurs consécutives identiques sous la forme (valeur, longueur). Par exemple [a,a,b] devient [('a',2),('b',1)]. Une liste vide donne une liste vide.",
    starter: "def encoder_runs(valeurs):\n    if not valeurs:\n        return []\n    resultat = []\n    valeur_courante = valeurs[0]\n    longueur = 1\n    # Parcours à partir du deuxième élément\n    ...\n    return resultat",
    tests:[{label:"Deux séquences",code:"assert encoder_runs(['a', 'a', 'b']) == [('a', 2), ('b', 1)]"},{label:"Toutes différentes",code:"assert encoder_runs([1, 2, 3]) == [(1, 1), (2, 1), (3, 1)]"},{label:"Toutes égales",code:"assert encoder_runs(['x', 'x', 'x']) == [('x', 3)]"},{label:"Vide",code:"assert encoder_runs([]) == []"}],
    hints:["Quand la valeur change, ajoute le groupe terminé puis réinitialise valeur_courante et longueur.","N’oublie pas d’ajouter le dernier groupe après la boucle."],
    solution:"def encoder_runs(valeurs):\n    if not valeurs:\n        return []\n    resultat = []\n    valeur_courante = valeurs[0]\n    longueur = 1\n    for valeur in valeurs[1:]:\n        if valeur == valeur_courante:\n            longueur += 1\n        else:\n            resultat.append((valeur_courante, longueur))\n            valeur_courante = valeur\n            longueur = 1\n    resultat.append((valeur_courante, longueur))\n    return resultat",
    explanation:"L’algorithme ne compare que des voisins et examine chaque élément une fois : O(n) temps. Il produit au plus n groupes. La dernière séquence doit être ajoutée après la boucle."
  },
  {
    id: "dijkstra-weighted", level: 3, topic: "Graphes pondérés", title: "Plus court chemin avec Dijkstra", time: "25 min",
    goal: "Choisir une file de priorité et expliciter les conditions d’application d’un algorithme glouton.",
    prompt: "Écris distance_dijkstra(graphe, depart, arrivee). Le graphe orienté est un dictionnaire sommet → couples (voisin, poids), les sommets sont des chaînes et les poids sont positifs ou nuls. Renvoie la distance minimale, ou None si l’arrivée est inaccessible.",
    starter: "import heapq\n\ndef distance_dijkstra(graphe, depart, arrivee):\n    distances = {depart: 0}\n    tas = [(0, depart)]\n    while tas:\n        # Retire le sommet de distance provisoire minimale\n        ...\n    return None",
    tests:[{label:"Choisir un chemin indirect plus court",code:"assert distance_dijkstra({'A':[('B', 8), ('C', 2)], 'C':[('B', 1)], 'B':[]}, 'A', 'B') == 3"},{label:"Départ égal à l’arrivée",code:"assert distance_dijkstra({'A':[]}, 'A', 'A') == 0"},{label:"Sommet inaccessible",code:"assert distance_dijkstra({'A':[], 'Z':[]}, 'A', 'Z') is None"},{label:"Poids nul",code:"assert distance_dijkstra({'A':[('B', 0)], 'B':[]}, 'A', 'B') == 0"}],
    hints:["Ignore une entrée du tas si sa distance ne correspond plus à distances[sommet].","Quand tu trouves une distance plus petite, mets à jour le dictionnaire et ajoute le nouveau couple au tas."],
    solution:"import heapq\n\ndef distance_dijkstra(graphe, depart, arrivee):\n    distances = {depart: 0}\n    tas = [(0, depart)]\n    while tas:\n        distance, sommet = heapq.heappop(tas)\n        if distance != distances[sommet]:\n            continue\n        if sommet == arrivee:\n            return distance\n        for voisin, poids in graphe.get(sommet, []):\n            candidate = distance + poids\n            if voisin not in distances or candidate < distances[voisin]:\n                distances[voisin] = candidate\n                heapq.heappush(tas, (candidate, voisin))\n    return None",
    explanation:"La file de priorité extrait la plus petite distance provisoire. Avec des poids non négatifs, lorsqu’un sommet est extrait sans entrée périmée, sa distance est définitive. L’algorithme ne convient pas aux poids négatifs. Avec un tas binaire, le coût est O((V+E) log V)."
  }
];
