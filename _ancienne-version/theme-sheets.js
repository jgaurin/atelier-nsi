(function () {
  "use strict";

  const guides = {
    lang: {
      title: "Langages et programmation",
      promise: "Lire, écrire, tester et expliquer un programme, du premier état de ses variables jusqu’à une conception orientée objet.",
      methodTitle: "De l’énoncé au programme fiable",
      method: [
        "Reformule le résultat attendu et fixe le domaine des entrées.",
        "Choisis les données et les opérations qui expriment directement le problème.",
        "Trace une petite exécution à la main avant d’écrire ou modifier le code.",
        "Écris le cas ordinaire, puis les bornes et les cas qui peuvent faire échouer l’hypothèse.",
        "Explique le résultat, les effets de bord, les limites et le coût si la question le demande."
      ],
      why: "Un programme ne se comprend pas seulement par sa syntaxe : il faut suivre les valeurs et les objets, établir ce que les fonctions promettent, puis vérifier que le code respecte cette promesse.",
      diagram: ["Besoin", "Contrat", "État / données", "Code", "Tests", "Justification"],
      checkpoint: "Pour chaque fonction, peux-tu nommer ses entrées, son résultat, ses effets de bord et un test qui pourrait la réfuter ?"
    },
    algo: {
      title: "Algorithmique et structures de données",
      promise: "Modéliser un problème, choisir une structure et défendre la correction ainsi que le coût de l’algorithme.",
      methodTitle: "Construire puis justifier un algorithme",
      method: [
        "Écris les entrées, la sortie, les préconditions et la convention choisie pour les cas limites.",
        "Identifie les opérations dominantes : accès, recherche, insertion, extraction ou parcours.",
        "Choisis le type abstrait et sa représentation en fonction de ces opérations.",
        "Décris l’algorithme avec un invariant ou une décomposition qui explique pourquoi il répond au besoin.",
        "Teste un cas minimal, un cas représentatif et un cas défavorable ; compte le travail en fonction de n."
      ],
      why: "La structure et l’algorithme se choisissent ensemble : une représentation facilite certaines opérations et en rend d’autres coûteuses. La preuve dit pourquoi la réponse est juste ; l’analyse dit combien elle coûte.",
      diagram: ["Spécification", "TAD", "Représentation", "Algorithme", "Preuve", "Complexité"],
      checkpoint: "Peux-tu expliquer ce que l’invariant garantit après chaque étape et donner la forme d’entrée qui réalise le pire cas ?"
    },
    dataweb: {
      title: "Information, données et Web",
      promise: "Comprendre comment une information est codée, structurée, interrogée puis échangée entre composants Web.",
      methodTitle: "Suivre une donnée de bout en bout",
      method: [
        "Précise ce que signifie la donnée et dans quel domaine elle prend ses valeurs.",
        "Choisis une représentation explicite : bits, tableau, table relationnelle, document ou message.",
        "Repère identifiants, références, clés et contraintes qui préservent la cohérence.",
        "Décris la transformation ou la requête et indique ce qui est conservé ou perdu.",
        "Vérifie le résultat avec un jeu de données concret, des valeurs manquantes et un cas inattendu."
      ],
      why: "Le même contenu peut changer de représentation plusieurs fois. Les erreurs apparaissent souvent quand on oublie un type, une clé, une référence, une valeur absente ou la frontière entre navigateur et serveur.",
      diagram: ["Information", "Codage", "Structure", "Traitement", "Échange", "Résultat"],
      checkpoint: "Sais-tu distinguer la valeur, sa représentation, son emplacement et la règle qui autorise sa transformation ?"
    },
    systems: {
      title: "Architecture, systèmes et réseaux",
      promise: "Suivre l’exécution et le transport des données en distinguant les rôles du matériel, du système et des couches réseau.",
      methodTitle: "Suivre un événement dans la machine",
      method: [
        "Identifie la donnée ou l’instruction de départ et l’endroit où elle se trouve.",
        "Repère le composant qui agit : processeur, mémoire, système d’exploitation ou interface réseau.",
        "Décris le transfert et le niveau d’abstraction : registre, mémoire, fichier, trame, paquet ou segment.",
        "Sépare l’adresse de destination, le prochain saut et le service identifié par un port.",
        "Trace l’aller et le retour, puis explique ce que la couche étudiée garantit et ce qu’elle ne garantit pas."
      ],
      why: "Chaque couche fournit des services et masque des détails. Une explication solide garde les niveaux séparés : un port n’est pas une adresse IP, une adresse IP n’est pas une adresse matérielle, et le système d’exploitation n’est pas le processeur.",
      diagram: ["Programme", "OS", "CPU / mémoire", "Liaison", "IP / routeur", "Transport"],
      checkpoint: "Peux-tu nommer le niveau concerné par chaque action et suivre un paquet sans confondre hôte, interface, réseau et application ?"
    },
    math: {
      title: "Mathématiques et informatique théorique",
      promise: "Définir précisément les objets, traduire les énoncés et choisir une preuve ou une construction qui répond à la question.",
      methodTitle: "Rédiger un raisonnement vérifiable",
      method: [
        "Écris le domaine et les quantificateurs : qui est choisi, et pour tous quels objets ?",
        "Traduis les mots en définitions, symboles, ensembles, états ou événements.",
        "Choisis une méthode qui correspond à la forme logique : directe, contraposée, récurrence, dénombrement ou parcours.",
        "Déroule chaque implication et justifie les égalités, les cas et les hypothèses utilisés.",
        "Teste la frontière de l’énoncé ; un contre-exemple suffit à réfuter une affirmation universelle."
      ],
      why: "Un exemple peut aider à découvrir une règle, mais il ne prouve pas une propriété générale. À l’inverse, un seul exemple construit sous les hypothèses suffit parfois à réfuter une proposition universelle.",
      diagram: ["Énoncé", "Domaine", "Définitions", "Méthode", "Étapes", "Conclusion"],
      checkpoint: "Chaque phrase de ta preuve découle-t-elle d’une hypothèse, d’une définition ou d’un résultat déjà établi ?"
    },
    teaching: {
      title: "Enseigner SNT et NSI",
      promise: "Transformer un programme et une notion informatique en une activité accessible, observable et évaluée avec des critères explicites.",
      methodTitle: "Concevoir une séance alignée",
      method: [
        "Pars du programme, du niveau de classe et des connaissances préalables réellement nécessaires.",
        "Formule un objectif observable avec un verbe d’action et une production attendue.",
        "Construis une activité où les élèves prédisent, manipulent, testent et expliquent la notion.",
        "Anticipe les erreurs et prévois des aides graduées sans retirer le cœur de l’apprentissage.",
        "Annonce les critères de réussite, observe les productions et conclus par une trace écrite réutilisable."
      ],
      why: "Une activité ne vaut pas seulement parce qu’elle est motivante ou qu’un programme fonctionne. Elle doit faire travailler l’objectif annoncé et permettre à l’enseignant comme à l’élève de constater ce qui a été compris.",
      diagram: ["Programme", "Objectif", "Activité", "Production élève", "Critères", "Retour"],
      checkpoint: "La production demandée permet-elle vraiment d’observer la compétence annoncée, pour des élèves qui n’avancent pas au même rythme ?"
    },
    interview: {
      title: "Entretien et posture professionnelle",
      promise: "Présenter un parcours sincère et répondre aux situations avec discernement, protection des élèves et connaissance du cadre professionnel.",
      methodTitle: "Répondre à une situation professionnelle",
      method: [
        "Distingue les faits observés des interprétations et demande les précisions nécessaires.",
        "Assure d’abord la sécurité, la dignité et la protection des élèves concernés.",
        "Rappelle calmement la règle ou la valeur en jeu, avec une réponse proportionnée.",
        "Agis dans ton rôle et mobilise l’équipe ou les procédures adaptées quand la situation le nécessite.",
        "Prévois un suivi et explique comment tu vérifieras que la réponse a aidé les élèves."
      ],
      why: "Le jury cherche un raisonnement professionnel, pas une formule magique. Une réponse crédible est concrète, respectueuse, proportionnée et prête à être ajustée aux faits ; elle reconnaît aussi quand il faut s’appuyer sur l’équipe et le cadre officiel.",
      diagram: ["Faits", "Protection", "Cadre", "Action proportionnée", "Équipe", "Suivi"],
      checkpoint: "Ta réponse protège-t-elle les personnes, respecte-t-elle le cadre et prévoit-elle un suivi sans prétendre tout résoudre seul ?"
    }
  };

  window.NSI_THEME_SHEETS = (window.NSI_CURRICULUM || []).map(function (block) {
    const guide = guides[block.id] || guides.lang;
    return {
      id: block.id,
      title: guide.title,
      promise: guide.promise,
      methodTitle: guide.methodTitle,
      method: guide.method,
      why: guide.why,
      diagram: guide.diagram,
      checkpoint: guide.checkpoint,
      courses: block.courses.map(function (course) {
        return { id: course.id, title: course.title, points: course.sheet.slice() };
      })
    };
  });
})();
