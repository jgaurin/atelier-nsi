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

::::exercice[Vrai ou faux ?]{niveau=1 type=reponses}
Réponds par vrai ou par faux.

1. Un logiciel libre est forcément gratuit.

   - faux

   > « Libre » parle de libertés. Un logiciel libre peut être vendu.

1. Le code source de Linux est accessible.

   - vrai

1. Une application parle directement au processeur, sans passer par le système.

   - faux

1. Plusieurs programmes peuvent sembler s'exécuter en même temps sur un seul cœur.

   - vrai

   > Le système les fait alterner très vite.
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
