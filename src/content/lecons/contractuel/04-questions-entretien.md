---
titre: S'entraîner aux questions de l'entretien
resume: Une banque de questions fréquentes de l'entretien de recrutement des contractuels — motivation, notions de NSI et SNT à expliquer comme à un élève, programmes et bac, pédagogie, gestion de classe, institution — avec des pistes de réponse et une méthode pour s'entraîner.
duree: 60
objectifs:
  - Répondre de façon structurée et concrète aux questions de motivation
  - Expliquer simplement, avec un exemple, les grandes notions de SNT et de NSI
  - Répondre aux questions de pédagogie et de gestion de classe selon une trame claire
  - S'entraîner à voix haute et s'auto-évaluer
prerequis: [contractuel/recrutement, contractuel/gerer-une-classe]
programme: [e-presentation, e-metier, e-eleve, e-valeurs, snt-programmation, nsi1-langages]
cartes:
  - q: La trame d'une réponse de gestion de classe ?
    r: "Prévention (ce que je mets en place), réaction immédiate calme et graduée, suite (échange, punition prévue au règlement), équipe (professeur principal, CPE, famille)."
  - q: La trame pour expliquer une notion « comme à un élève » ?
    r: "Une image ou une situation familière, la définition en une phrase, un exemple concret (souvent un petit code), et une erreur fréquente à éviter."
  - q: Que répondre si l'on ne connaît pas la réponse ?
    r: "Le dire honnêtement, puis raisonner à voix haute à partir de ce qu'on sait, ou dire comment on chercherait (programme officiel, collègues, inspection)."
  - q: Comment est évaluée la NSI au bac à partir de 2027 ?
    r: "Une épreuve écrite de 3 h 30 (trois exercices, coefficient 0,75) et une épreuve pratique d'1 h sur machine avec dialogue avec l'examinateur (coefficient 0,25), chacune notée sur 20."
  - q: Que retenir pour bien s'entraîner ?
    r: "Répondre à voix haute, se chronométrer (1 à 2 minutes par réponse), s'enregistrer, et vérifier qu'il y a toujours un exemple concret."
---

L'entretien de recrutement est **court** : chaque réponse doit aller droit au but, en une à deux minutes, avec **un exemple concret**. Cette leçon rassemble les
questions qui reviennent le plus souvent. Pour chacune : réfléchis à ta réponse **à voix haute** avant d'ouvrir la piste proposée — c'est la seule façon de
progresser. Les pistes ne sont pas des textes à réciter : le recruteur entend tout de suite une réponse apprise par cœur.

## 1. Motivation et parcours

:::question[Présentez-vous.]
Deux minutes : formation (et ce qu'elle t'a donné), une expérience de transmission ou d'encadrement, pourquoi l'informatique au lycée, ce que tu apportes,
ta disponibilité. Voir l'exemple guidé de la leçon « Le recrutement et l'entretien des contractuels ».
:::

:::question[Pourquoi voulez-vous enseigner ? Pourquoi maintenant ?]
Une raison **personnelle et concrète** (une expérience où tu as aimé expliquer, voir quelqu'un progresser), pas un slogan. « Maintenant » : la fin de tes études,
le besoin d'enseignants en NSI, l'envie de te confronter au terrain avant de passer le concours. Rester positif : ne pas présenter l'enseignement comme un
« plan B ».
:::

:::question[Vous n'avez jamais enseigné : qu'est-ce qui vous fait penser que vous y arriverez ?]
Ne pas nier l'inexpérience ; s'appuyer sur ce qui s'en rapproche (tutorat, cours particuliers, animation, encadrement de stagiaires, présentations orales) et sur
ta **préparation** (connaissance des programmes, gestion de classe travaillée, ressources prêtes). Dire que tu solliciteras l'accompagnement et les collègues.
:::

:::question[Pourquoi pas une carrière d'ingénieur ou de développeur ?]
Assumer : tu connais l'écart de salaire ; ce qui te motive, c'est la transmission et le service public (donner à **tous** les élèves une culture du numérique, y
compris à ceux qui n'ont pas de proches dans le métier). Ton expérience de la programmation est un atout pour faire réaliser des projets concrets.
:::

## 2. Expliquer une notion « comme à un élève »

La trame : **une image familière**, **la définition en une phrase**, **un exemple** (souvent un petit code), **une erreur fréquente**.

:::question[Qu'est-ce qu'une variable ?]
Image : une étiquette posée sur une valeur (plutôt qu'une boîte). Définition : un nom qui désigne une valeur en mémoire. Exemple : `score = 0` puis
`score = score + 10` — on calcule `score + 10`, puis on recolle l'étiquette sur le résultat. Erreur fréquente : lire `=` comme une égalité mathématique.
:::

:::question[Qu'est-ce qu'une boucle, et quelle différence entre for et while ?]
Image : « fais 20 pompes » (on sait combien) contre « cours jusqu'à ce que tu sois essoufflé » (on ne sait pas). `for` répète un nombre de fois connu
(`for i in range(20)`), `while` répète tant qu'une condition est vraie. Erreur fréquente : une boucle `while` dont la condition ne devient jamais fausse.
:::

:::question[Qu'est-ce qu'une fonction ?]
Image : une recette (des ingrédients en entrée, un plat en sortie) qu'on peut refaire à volonté. Exemple : `def aire(longueur, largeur): return longueur * largeur`.
Erreur fréquente : confondre `print` (afficher) et `return` (renvoyer un résultat réutilisable).
:::

:::question[Comment un ordinateur représente-t-il les nombres et le texte ?]
Tout est en **binaire** (0 et 1), comme des interrupteurs. 13 s'écrit 1101 (8 + 4 + 1). Le texte : chaque caractère a un numéro (code Unicode), lui-même écrit en binaire
(UTF-8). Activité classique : les cartes à points pour compter en binaire. Erreur fréquente : croire que 0,1 + 0,2 vaut exactement 0,3 en Python.
:::

:::question[Que se passe-t-il quand on tape une adresse dans un navigateur ?]
Le navigateur demande au **DNS** l'adresse IP du serveur, puis lui envoie une **requête HTTP** ; le serveur répond par la page **HTML** (avec un code : 200 si tout va
bien, 404 si la page n'existe pas) ; le navigateur demande ensuite les images et styles, et affiche. Image : commander au comptoir. Erreur fréquente : confondre
Internet (le réseau) et le Web (un service qui l'utilise).
:::

:::question[Comment un message traverse-t-il Internet ?]
Il est découpé en **paquets** numérotés ; chacun porte l'adresse IP du destinataire ; les **routeurs** les font avancer de proche en proche ; **TCP** vérifie que tout
est arrivé et remet dans l'ordre. Image : une lettre découpée en cartes postales numérotées. Activité : jouer les routeurs en classe.
:::

:::question[Qu'est-ce qu'une base de données et une requête SQL ?]
Des **tables** (comme des tableaux de tableur) reliées par des identifiants ; une requête pose une question : `SELECT nom FROM eleve WHERE classe = '1G2' ORDER BY nom;`.
Image : un fichier élèves bien rangé qu'on interroge. Erreur fréquente : oublier la condition de jointure entre deux tables.
:::

:::question[Qu'est-ce que la récursivité ?]
Une fonction qui s'appelle elle-même sur un problème plus petit, avec un **cas de base** qui arrête. Exemple : la factorielle (`n! = n × (n−1)!`, et `0! = 1`). Image : des
poupées russes. Erreur fréquente : oublier le cas de base (récursion infinie).
:::

:::question[Qu'est-ce qu'une recherche dichotomique ? Pourquoi est-elle efficace ?]
Dans une liste **triée**, on regarde le milieu et on élimine la moitié à chaque étape, comme au jeu du « plus grand, plus petit ». Pour un million d'éléments, environ
20 étapes au lieu d'un million. Erreur fréquente : l'appliquer à une liste non triée.
:::

## 3. Programmes et bac

:::question[Que fait-on en SNT ?]
Un enseignement commun de seconde (1 h 30 par semaine) : sept thèmes (Internet, le Web, les réseaux sociaux, les données structurées, la localisation et la
cartographie, l'informatique embarquée et les objets connectés, la photographie numérique) et de la programmation en Python, avec à chaque fois les enjeux de
société. Mentionner la révision annoncée du programme pour intégrer l'intelligence artificielle.
:::

:::question[Que contient le programme de NSI en première ? En terminale ?]
Première : histoire de l'informatique, représentation des données, données en tables, Web, architecture et systèmes, langages et programmation, algorithmique
(tris, dichotomie, gloutons, k plus proches voisins). Terminale : structures de données (POO, listes, piles, files, arbres, graphes), bases de données (SQL), réseaux et
systèmes, algorithmique (récursivité, diviser pour régner, programmation dynamique). Un quart du temps en projets.
:::

:::question[Comment la NSI est-elle évaluée au baccalauréat ?]
À partir de la session 2027 : une partie écrite de 3 h 30 (trois exercices indépendants, notée sur 20, coefficient 0,75) et une partie pratique d'1 h sur ordinateur
avec un dialogue avec l'examinateur (notée sur 20, coefficient 0,25). La spécialité abandonnée en fin de première est évaluée en contrôle continu.
:::

## 4. Pédagogie

:::question[Comment organisez-vous une séance en salle informatique ?]
Démarrage (question flash), découverte courte, travail des élèves (le plus long, avec indices et défis), bilan et trace écrite ; écrans éteints pendant les consignes ;
plan B papier en cas de panne. Donner un exemple précis de séance.
:::

:::question[Comment gérez-vous l'hétérogénéité ?]
Des activités à niveaux (exercices progressifs), des indices gradués, des défis pour les plus avancés, des binômes à rôles qui tournent, et du temps passé auprès de
ceux qui bloquent. Évaluer les mêmes compétences pour tous, mais varier les aides.
:::

:::question[Comment évaluez-vous ?]
Souvent et court (questions flash, QCM), sur machine (comme à l'épreuve pratique), sur projet avec une grille connue à l'avance et une part individuelle ; des retours
rapides et un corrigé. La note évalue des acquis, jamais le comportement.
:::

:::question[Que pensez-vous de l'usage de l'intelligence artificielle par les élèves ?]
Ni interdiction naïve ni laisser-faire : apprendre à l'utiliser de façon critique (vérifier, tester, comprendre ce qu'elle produit), et évaluer ce qui compte (expliquer
son code, le modifier en direct, raisonner sur papier). Respecter les règles de l'établissement.
:::

## 5. Gestion de classe

:::question[Comment se passe votre premier cours ?]
Accueil à la porte, placement, appel, présentation brève, trois à cinq règles justifiées, une activité dès la première heure, fin dans le calme (voir la leçon « Gérer une
classe »).
:::

:::question[Un élève bavarde sans arrêt et fait rire la classe. Que faites-vous ?]
Prévention (placement, rythme), réaction graduée (regard, rapprochement, rappel, changement de place), échange en fin d'heure, punition prévue au règlement si cela
persiste, information du professeur principal. Jamais d'humiliation, jamais de punition collective.
:::

:::question[Un élève vous insulte. Que faites-vous ?]
Réaction immédiate et calme (« ce que tu viens de dire est inacceptable »), pas d'escalade devant la classe ; si besoin, prise en charge par la vie scolaire ; rapport
écrit au CPE et au chef d'établissement, qui décide d'une éventuelle sanction ; échange ultérieur avec l'élève. Ne pas rester seul.
:::

:::question[Un élève vous dit qu'il est harcelé par des camarades.]
Écouter, remercier, rassurer, ne pas promettre le secret ; transmettre immédiatement au CPE et à la direction (protocole de traitement du harcèlement) ; ne pas
confronter seul les élèves mis en cause ; rester attentif en classe.
:::

## 6. Institution et valeurs

:::question[Quelles sont vos obligations en tant qu'agent public ?]
Neutralité et laïcité, impartialité, discrétion professionnelle, obéissance hiérarchique (sauf ordre manifestement illégal), signalement des situations de danger. Le
contractuel a les mêmes obligations qu'un titulaire.
:::

:::question[Qu'est-ce que la laïcité à l'école ?]
Elle garantit la liberté de conscience et l'égalité de tous les élèves, et protège les élèves de toute pression ; les élèves ne portent pas de signes religieux
ostensibles (loi de 2004) ; le professeur, lui, est soumis à une stricte neutralité. Voir la leçon « Valeurs de la République et laïcité ».
:::

:::question[Comment encourageriez-vous les filles à choisir NSI ?]
Les filles ne représentent qu'environ 15 % des élèves de terminale NSI. Présenter la spécialité à toutes les classes de seconde en SNT, des projets aux thèmes
variés, des modèles féminins (Ada Lovelace, Grace Hopper, Margaret Hamilton), une répartition équitable de la parole et des rôles en classe.
:::

:::prof
Pour t'entraîner efficacement : tire une question au hasard, réponds à voix haute en te chronométrant (1 à 2 minutes), enregistre-toi, puis compare avec la piste.
Vérifie toujours trois choses : un **exemple concret**, une **structure** audible, et pour les questions de classe, l'**équipe** (à qui tu en parles).
:::

## Exemple guidé

**Question.** « Expliquez-moi ce qu'est un dictionnaire en Python, comme vous le feriez à un élève de première. »

**1. Une image** : « un répertoire de téléphone : on cherche par le nom (la **clé**) et on obtient le numéro (la **valeur**). »

**2. La définition** : « une collection d'associations clé → valeur, où l'on retrouve une valeur directement par sa clé, sans tout parcourir. »

**3. Un exemple** :

```python exec
notes = {"Léa": 15, "Hugo": 12}
notes["Inès"] = 17           # ajouter une association
print(notes["Hugo"])          # retrouver par la clé
for nom, note in notes.items():
    print(nom, note)
```

**4. Une erreur fréquente** : demander une clé qui n'existe pas (`notes["Zoé"]` provoque une erreur `KeyError`) — on peut tester avec `if "Zoé" in notes`.

**5. Et en classe ?** « Je le ferais découvrir avec un compteur de mots dans un texte : on voit tout de suite l'intérêt. » Cette dernière phrase montre au recruteur
que tu penses déjà à la classe.

## L'essentiel

- Réponses courtes (1 à 2 minutes), structurées, avec un exemple concret ; honnêteté quand on ne sait pas.
- Expliquer une notion : image familière, définition en une phrase, exemple, erreur fréquente — et une idée d'activité.
- Programmes : SNT (sept thèmes + programmation), NSI première et terminale, bac (écrit 3 h 30 + pratique 1 h, coefficients 0,75 et 0,25).
- Gestion de classe : prévention, réaction graduée, suite, équipe ; institution : neutralité, laïcité, discrétion, signalement.
- S'entraîner à voix haute, chronométré, enregistré.

## Exercices

::::exercice[Expliquer simplement]{niveau=1}
Quelle explication de la notion de **liste** en Python est la plus adaptée à un élève de seconde ?

- [ ] « Une structure de données séquentielle mutable implémentée par un tableau dynamique. »
- [x] « Une suite d'éléments rangés dans l'ordre, comme une liste de courses ; on retrouve chaque élément par sa position, en commençant à 0. »
- [ ] « C'est comme un dictionnaire mais sans clés. »
- [ ] « C'est ce qu'on met entre crochets. »

:::corrige
Une image familière, une définition juste et un détail utile (la numérotation commence à 0). La première est exacte mais incompréhensible pour un élève de seconde ; les
deux dernières sont floues ou trompeuses.
:::
::::

::::exercice[La bonne trame]{niveau=1}
Laquelle de ces réponses à « Un élève refuse de ranger son téléphone » suit la bonne trame ?

- [ ] « Je confisque le téléphone et je le garde jusqu'à la fin de l'année. »
- [ ] « Je l'ignore pour ne pas perdre de temps. »
- [x] « Je lui demande calmement de le ranger en rappelant la règle ; s'il refuse, j'applique ce que prévoit le règlement intérieur, je lui parle en fin d'heure et j'informe le CPE. »
- [ ] « J'appelle immédiatement ses parents pendant le cours. »

:::corrige
Réaction calme, rappel de la règle, application du **règlement intérieur** (qui fixe ce qui est permis pour les téléphones au lycée), échange différé, information de
l'équipe. Une confiscation prolongée n'est pas permise sans cadre ; ignorer installe le désordre ; appeler pendant le cours crée un incident public.
:::
::::

::::exercice[Expliquer une notion de SNT]{niveau=2 duree=10}
Choisis une notion de SNT (pixel, adresse IP, métadonnée, capteur, GPS, cookie…) et rédige ton explication « comme à un élève », selon la trame : image, définition,
exemple, erreur fréquente, idée d'activité.

:::criteres
- Notion réellement au programme de SNT, expliquée de façon juste.
- Les cinq éléments de la trame présents et adaptés à un élève de seconde.
- Idée d'activité concrète et réalisable en classe.
:::

:::corrige
Exemple avec la **métadonnée** : *image* — l'étiquette collée au dos d'une photo papier (date, lieu) ; *définition* — une donnée qui décrit une autre donnée ; *exemple* —
une photo de téléphone contient la date, le modèle de l'appareil et souvent les coordonnées GPS du lieu de prise de vue (données EXIF) ; *erreur fréquente* — croire qu'une
photo ne contient que l'image, et publier sans le savoir l'adresse de son domicile ; *activité* — afficher les métadonnées d'une photo prise par l'élève (avec son accord) et
retrouver le lieu sur une carte, puis apprendre à les supprimer avant publication.
:::
::::

::::exercice[Une question de classe complète]{niveau=3 duree=10}
« Pendant un travail en binômes, deux élèves se disputent violemment à propos de qui tape au clavier, et l'un bouscule l'autre. Que faites-vous ? » Rédige ta réponse
(prévention, réaction immédiate, suite, équipe).

:::criteres
- Réaction immédiate : séparer, faire cesser, mettre en sécurité, calmer la classe, sans entrer dans le conflit.
- Suite : prise en charge par la vie scolaire si nécessaire, rapport écrit, échange avec chacun, sanction décidée par le chef d'établissement si la violence le justifie.
- Prévention : rôles définis et qui tournent dans les binômes, composition réfléchie.
- Équipe : CPE, professeur principal, familles.
:::

:::corrige
**Immédiatement** : je m'interpose verbalement et je sépare les deux élèves (l'un change de poste), je m'assure que personne n'est blessé et je calme la classe ; si l'un reste
très agité, je le fais accompagner à la vie scolaire par un délégué. **Ensuite** : un rapport factuel au CPE et au chef d'établissement (une bousculade est une violence, une
sanction peut être décidée par la direction) ; un échange avec chacun des élèves, séparément, pour comprendre. **Prévention** : dans les binômes, les rôles sont définis (le
pilote tape, le copilote guide) et s'échangent toutes les 15 minutes, au signal ; je compose les binômes moi-même. **Équipe** : professeur principal et familles informés,
selon la décision de la direction.
:::
::::

::::exercice[Un entretien blanc]{niveau=4 duree=30}
Fais-toi interroger (ou interroge-toi en tirant au hasard) sur **six** questions de cette leçon : une de motivation, deux d'explication de notions, une de programmes, une de
pédagogie, une de gestion de classe. Réponds à voix haute en te chronométrant, puis évalue chaque réponse avec la grille ci-dessous.

:::criteres
- Chaque réponse dure entre 1 et 2 minutes et suit une structure audible.
- Chaque réponse contient au moins un exemple concret.
- Les explications de notions sont justes et accessibles à un élève ; les réponses de gestion de classe mentionnent l'équipe.
- Réflexion finale : deux points forts, deux points à retravailler, et les leçons de l'Atelier à revoir.
:::

:::corrige
Production personnelle. Pour t'auto-évaluer : réécoute l'enregistrement et note, pour chaque réponse, sa durée, la présence d'un **exemple concret**, la **justesse** du contenu
(vérifie dans la leçon correspondante du parcours), et pour les questions de classe la présence des quatre temps (prévention, réaction, suite, équipe). Reprends ensuite les
deux réponses les plus faibles le lendemain.
:::
::::
