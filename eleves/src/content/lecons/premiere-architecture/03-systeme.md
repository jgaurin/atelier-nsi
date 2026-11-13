---
titre: Le système d'exploitation
resume: "À quoi sert un système d'exploitation, et ce qui distingue un logiciel libre d'un logiciel propriétaire."
duree: 25
objectifs:
  - "Identifier les fonctions d'un système d'exploitation"
  - "Distinguer systèmes libres et propriétaires"
prerequis: [premiere-architecture/von-neumann]
---

Quand tu enregistres un fichier, ton traitement de texte ne s'occupe pas de savoir sur quelle partie du disque l'écrire. Quand tu imprimes, il ne parle pas directement à l'imprimante. Entre les programmes et le matériel, il y a le **système d'exploitation** : Linux, Windows, macOS, Android ou iOS.

## 1. Ses fonctions

| Il gère… | Ce qu'il fait | Exemple |
| --- | --- | --- |
| le **processeur** | il fait alterner les programmes, très vite | la musique joue pendant que tu écris |
| la **mémoire** | il donne à chaque programme sa zone, sans qu'ils se gênent | un navigateur ne peut pas lire la mémoire d'un autre programme |
| les **fichiers** | il les range sur le disque, dans des dossiers | un document enregistré dans `Documents` |
| les **périphériques** | il commande le clavier, l'écran, l'imprimante | une impression lancée depuis n'importe quel logiciel |
| les **utilisateurs** | il gère les comptes et leurs droits d'accès | Tom ne peut pas ouvrir les fichiers de Léa |

Les programmes ne parlent **jamais directement au matériel** : ils demandent au système, qui vérifie qu'ils en ont le droit, puis agit. C'est plus simple pour les programmes, et plus sûr pour la machine.

## 2. Libre ou propriétaire ?

Un logiciel **libre** donne à chacun quatre libertés : l'**utiliser**, l'**étudier**, le **modifier** et le **redistribuer**. Pour cela, son code source est accessible. **Linux** est libre.

Un logiciel **propriétaire** ne donne pas ces libertés : on ne peut ni lire ni modifier librement son code. **Windows** et **macOS** sont propriétaires.

:::attention
« Libre » ne veut pas dire « gratuit ». Le mot parle de libertés, pas de prix : un logiciel libre peut être vendu, et un logiciel gratuit peut être propriétaire.
:::

Le libre permet de vérifier ce que fait le logiciel, de l'adapter, et de ne pas dépendre d'une seule entreprise. Le propriétaire peut offrir certains logiciels professionnels ou un support commercial.

:::histoire
Unix naît en 1969. Richard Stallman lance le projet GNU en 1983, et Linus Torvalds crée Linux en 1991.
:::

## L'essentiel

- Le système gère le processeur, la mémoire, les fichiers, les périphériques et les utilisateurs.
- Les programmes passent par lui pour accéder au matériel.
- Un logiciel libre peut être utilisé, étudié, modifié et redistribué. Libre ne veut pas dire gratuit.

## Exercices

::::exercice[Système ou application ?]{niveau=1 type=associer}
Indique s'il s'agit d'un système d'exploitation ou d'une application.

| Logiciel | Catégorie |
| --- | --- |
| Linux | système d'exploitation |
| Firefox | application |
| Android | système d'exploitation |
| LibreOffice | application |
::::

::::exercice[Quelle fonction ?]{niveau=1 type=associer}
Associe chaque situation à ce que gère le système d'exploitation.

| Situation | Ressource gérée |
| --- | --- |
| Le navigateur et la musique tournent en même temps | processeur |
| Une photo est enregistrée dans un dossier | fichiers |
| Tu n'as pas accès aux documents d'un autre compte | utilisateurs |
| Une clé USB est reconnue | périphériques |
::::

::::exercice[Libre ou propriétaire ?]{niveau=2}
Ton lycée hésite entre un système libre et un système propriétaire pour ses ordinateurs. Donne un avantage du libre, et une raison qui peut pousser à choisir le propriétaire.

:::criteres
- Un avantage réel du libre : code vérifiable, adaptable, pas de licence à payer pour l'usage, indépendance.
- Une raison valable pour le propriétaire : logiciels indispensables, assistance, habitudes.
:::

:::corrige
Avec un système libre, le code peut être étudié et adapté, et le lycée ne dépend pas d'un seul éditeur. Mais certains logiciels indispensables peuvent n'exister que sur un système propriétaire, et ce choix peut offrir une assistance commerciale.
:::
::::

::::exercice[Les ordinateurs du lycée]{niveau=3}
Dans une salle du lycée, chaque élève a un compte. Léa écoute de la musique en rédigeant un compte rendu, puis imprime son document. Tom tente d'ouvrir un fichier de Léa, et le système le refuse.

1. Quelles ressources le système gère-t-il quand Léa écoute de la musique en rédigeant ? Explique son rôle pour chacune.
2. Quel chemin suit la demande d'impression, du logiciel à l'imprimante ?
3. Pourquoi Tom ne peut-il pas ouvrir ce fichier ? Quelle fonction du système est concernée ?
4. Le lycée installe Linux. Un élève dit : « C'est libre, donc forcément gratuit, et personne ne peut le vendre. » Corrige cette phrase.

:::criteres
- Processeur partagé entre les programmes, mémoire attribuée à chacun.
- L'application passe par le système, qui commande le périphérique.
- Gestion des utilisateurs et des droits.
- Libre parle de libertés : utiliser, étudier, modifier, redistribuer. Un logiciel libre peut être vendu.
:::

:::corrige
1. Le **processeur** : le système fait alterner très vite les deux programmes. La **mémoire** : il attribue une zone à chacun.
2. Le logiciel demande l'impression au **système d'exploitation**, qui commande l'imprimante. Une application ne parle pas directement au matériel.
3. Le système gère les **utilisateurs** et leurs **droits d'accès** : Tom n'a pas le droit de lire ce fichier.
4. « Libre » désigne des libertés : utiliser, étudier, modifier et redistribuer le logiciel. Un logiciel libre n'est donc pas forcément gratuit, et il peut être vendu.
:::
::::
