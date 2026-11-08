---
titre: Le système d'exploitation
resume: "À quoi sert un système d'exploitation, et ce qui distingue un logiciel libre d'un logiciel propriétaire."
duree: 25
objectifs:
  - "Identifier les fonctions d'un système d'exploitation"
  - "Distinguer systèmes libres et propriétaires"
prerequis: [premiere-architecture/von-neumann]
---

Entre le matériel et tes programmes, il y a le **système d'exploitation** : Linux, Windows, macOS, Android, iOS.

## 1. Ses fonctions

| Il gère… | Par exemple |
| --- | --- |
| le **processeur** | il fait alterner les programmes en cours |
| la **mémoire** | il attribue une zone à chaque programme |
| les **fichiers** | il les range sur le disque |
| les **périphériques** | clavier, écran, imprimante |
| les **utilisateurs** | comptes et droits d'accès |

Les programmes ne parlent pas directement au matériel : ils passent par le système.

## 2. Libre ou propriétaire ?

Un logiciel **libre** peut être utilisé, étudié, modifié et redistribué : son code source est accessible. **Linux** est libre. **Windows** et **macOS** sont propriétaires : on ne peut ni lire ni modifier librement leur code.

« Libre » ne veut pas dire « gratuit » : cela parle de libertés, pas de prix.

:::histoire
Unix naît en 1969. Richard Stallman lance le projet GNU en 1983, Linus Torvalds crée Linux en 1991.
:::

## L'essentiel

- Le système gère le processeur, la mémoire, les fichiers, les périphériques et les utilisateurs.
- Il fait le lien entre les programmes et le matériel.
- Un logiciel libre peut être utilisé, étudié, modifié et redistribué.

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
