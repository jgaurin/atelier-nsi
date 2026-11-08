---
titre: Contrôle du chapitre
resume: "Un contrôle de 55 minutes noté sur 20 sur la représentation des données."
duree: 55
controle: true
objectifs:
  - "Convertir entre les bases et utiliser le complément à 2"
  - "Expliquer les limites des flottants"
  - "Dresser une table de vérité"
  - "Comparer des encodages"
prerequis: [premiere-donnees/texte]
---

## Consignes

Durée : **55 minutes**. Le contrôle est noté sur **20 points**. Pas de calculatrice.

## Exercices

::::exercice[Conversions]{niveau=3 type=reponses points=6}
Chaque question vaut 1 point.

1. Écris en décimal le nombre binaire 1011 0110.

   ```python calcul
   print(0b10110110)
   ```

   - 182

1. Écris 77 en binaire, sans zéro au début.

   ```python calcul
   print(format(77, "b"))
   ```

   - 1001101

1. Écris en décimal le nombre hexadécimal A3.

   ```python calcul
   print(0xA3)
   ```

   - 163

1. Écris 240 en hexadécimal.

   ```python calcul
   print(format(240, "X"))
   ```

   - F0

1. Écris en hexadécimal le nombre binaire 1100 1010.

   ```python calcul
   print(format(0b11001010, "X"))
   ```

   - CA

1. Combien de valeurs différentes peut-on écrire sur 12 bits ?

   ```python calcul
   print(2 ** 12)
   ```

   - 4096
   - 4 096
::::

::::exercice[Complément à 2]{niveau=3 type=reponses points=5}
Chaque question vaut 1 point. Tous les nombres sont sur 8 bits.

1. Code −5, sans espace.

   ```python calcul
   print(format(-5 & 0xFF, "08b"))
   ```

   - 11111011

1. Code −64, sans espace.

   ```python calcul
   print(format(-64 & 0xFF, "08b"))
   ```

   - 11000000

1. Quelle est la valeur décimale de 1111 1110 ?

   ```python calcul
   v = 0b11111110
   print(v - 256 if v >= 128 else v)
   ```

   - -2
   - −2

1. Quel est le plus petit entier représentable ?

   ```python calcul
   print(-2 ** 7)
   ```

   - -128
   - −128

1. Deux entiers positifs tiennent sur 8 bits. Sur combien de bits au plus tient leur produit ?

   - 16
::::

::::exercice[Flottants]{niveau=3 type=reponses points=3}
Chaque question vaut 1 point.

1. Écris 0,75 en binaire.

   - 0,11

1. Réponds `True` ou `False` : que vaut cette expression ?

   ```python verifier
   print(0.1 + 0.2 == 0.3)
   ```

   - False

1. Le nombre 0,1 a-t-il une écriture binaire finie ? Réponds par oui ou par non.

   - non
::::

::::exercice[Table de vérité]{niveau=3 type=completer points=4}
Complète la table de `(a and not b) or (not a and b)`. Chaque ligne vaut 0,75 point, la dernière réponse vaut 1 point.

```python calcul
for a in (0, 1):
    for b in (0, 1):
        print(int(a and not b))
        print(int(not a and b))
        print(int((a and not b) or (not a and b)))
print("xor")
```

| a | b | a and not b | not a and b | Résultat |
| --- | --- | --- | --- | --- |
| 0 | 0 | [[0]] | [[0]] | [[0]] |
| 0 | 1 | [[0]] | [[1]] | [[1]] |
| 1 | 0 | [[1]] | [[0]] | [[1]] |
| 1 | 1 | [[0]] | [[0]] | [[0]] |

Cette expression est équivalente à l'opérateur [[xor;ou exclusif]].
::::

::::exercice[Encodage]{niveau=3 points=2}
Explique pourquoi l'UTF-8 a remplacé l'ASCII et l'ISO-8859-1 sur le Web.

:::criteres
- 1 point : l'ASCII et l'ISO-8859-1 ne couvrent qu'un nombre limité de caractères.
- 1 point : l'UTF-8 permet d'écrire tous les alphabets dans un même document.
:::

:::corrige
L'ASCII ne contient pas d'accents et l'ISO-8859-1 se limite aux langues d'Europe de l'Ouest. Le Web a besoin de mélanger toutes les langues : l'UTF-8 permet d'écrire tous les caractères d'Unicode dans un même document, tout en restant compatible avec l'ASCII.
:::
::::
