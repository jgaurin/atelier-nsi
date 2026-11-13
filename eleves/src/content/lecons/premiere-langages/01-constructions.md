---
titre: Constructions et langages
resume: "Les briques communes à tous les langages de programmation, et comment repérer ce qui change d'un langage à l'autre."
duree: 30
objectifs:
  - "Reconnaître les constructions élémentaires d'un programme"
  - "Repérer les traits communs et les différences entre deux langages"
---

Il existe des centaines de langages de programmation : Python, JavaScript, C, Java… Bonne nouvelle : ils reposent presque tous sur les **mêmes briques**. Quand tu les connais en Python, tu sais les reconnaître ailleurs.

## 1. Les constructions élémentaires

| Construction | Ce qu'elle fait | En Python |
| --- | --- | --- |
| **Séquence** | exécuter des instructions l'une après l'autre | une ligne, puis la suivante |
| **Affectation** | ranger une valeur dans une variable | `x = 3` |
| **Conditionnelle** | exécuter un bloc seulement si une condition est vraie | `if`, `elif`, `else` |
| **Boucle bornée** | répéter un nombre de fois connu à l'avance | `for i in range(5):` |
| **Boucle non bornée** | répéter tant qu'une condition est vraie | `while x > 0:` |
| **Appel de fonction** | exécuter un bloc de code nommé, avec des paramètres | `f(x)` |

Avec ces six briques, on peut écrire n'importe quel algorithme.

## 2. Un même programme, deux langages

Voici une fonction qui calcule 1 + 2 + … + n, d'abord en Python :

```python
def somme(n):
    s = 0
    for i in range(1, n + 1):
        s = s + i
    return s
```

puis en JavaScript :

```javascript
function somme(n) {
  let s = 0;
  for (let i = 1; i <= n; i++) {
    s = s + i;
  }
  return s;
}
```

| | Python | JavaScript |
| --- | --- | --- |
| Définir une fonction | `def` | `function` |
| Créer une variable | `s = 0` | `let s = 0;` |
| Marquer un bloc | l'**indentation** et `:` | des **accolades** `{ }` |
| Fin d'instruction | le retour à la ligne | un point-virgule `;` |
| Boucle de 1 à n | `range(1, n + 1)` | `i = 1; i <= n; i++` |

Les **idées** sont les mêmes : une fonction, un accumulateur, une boucle bornée, un retour. Seule la **syntaxe**, c'est-à-dire la façon de l'écrire, change.

:::methode[Lire un langage inconnu]
Repère les constructions élémentaires : où est la boucle ? la condition ? la fonction ? Comment un bloc commence-t-il et finit-il ? Une fois ces repères trouvés, le programme se lit presque comme du Python.
:::

## 3. Des styles et des langages différents

Il existe des langages de **styles** différents, qu'on appelle des paradigmes : impératif, fonctionnel, objet… Tu les découvriras en terminale.

Il existe aussi des langages qui **ne sont pas** des langages de programmation : **HTML** décrit le contenu d'une page, **SQL** interroge une base de données. On ne peut pas y écrire de boucle comme en Python.

## L'essentiel

- Six constructions élémentaires : séquence, affectation, conditionnelle, boucle bornée, boucle non bornée, appel de fonction.
- Les langages partagent ces idées et diffèrent par leur syntaxe : indentation en Python, accolades en JavaScript.
- HTML et SQL ne sont pas des langages de programmation.

## Exercices

::::exercice[Quelle construction ?]{niveau=1 type=associer}
Associe chaque ligne de code à sa construction.

| Code | Construction |
| --- | --- |
| `age = 17` | affectation |
| `if age >= 18:` | conditionnelle |
| `for i in range(3):` | boucle bornée |
| `while n > 0:` | boucle non bornée |
| `print(age)` | appel de fonction |
::::

::::exercice[Lire un programme]{niveau=1 type=reponses}
Donne ce que le programme affiche.

1. Que s'affiche-t-il ?

   ```python verifier
   x = 3
   x = x * 2
   y = x + 1
   print(y)
   ```

   - 7

1. Que s'affiche-t-il ?

   ```python verifier
   s = 0
   for i in range(4):
       s = s + i
   print(s)
   ```

   - 6

1. Que s'affiche-t-il ?

   ```python verifier
   n = 10
   c = 0
   while n > 1:
       n = n // 2
       c = c + 1
   print(c)
   ```

   - 3
::::

::::exercice[Traduire en Python]{niveau=2 type=completer}
Voici une fonction JavaScript. Complète sa version en Python.

```javascript
function positif(x) {
  if (x > 0) {
    return true;
  }
  return false;
}
```

```python trous
[[def]] positif(x)[[:]]
    if x > 0[[:]]
        return [[True]]
    return [[False]]
```
::::

::::exercice[Comparer deux langages]{niveau=2}
En observant les deux versions de la fonction `somme` du cours, cite deux points communs et deux différences entre Python et JavaScript.

:::criteres
- Deux points communs : fonction, variable, boucle bornée, `return`.
- Deux différences : indentation ou accolades, `def` ou `function`, `let`, points-virgules, écriture de la boucle.
:::

:::corrige
Les deux versions définissent une fonction, utilisent une variable `s`, une boucle bornée et `return`. En revanche, Python marque les blocs par l'indentation et JavaScript par des accolades. Python utilise `def`, JavaScript `function`, et les variables se déclarent avec `let` en JavaScript.
:::
::::

::::exercice[Un langage inconnu]{niveau=3 type=reponses}
Voici une fonction écrite en Lua, un langage que tu n'as jamais vu. Dans ce langage, le premier élément d'un tableau a l'indice 1, et `#t` donne la taille de `t`.

```lua
function compter(t, x)
  local n = 0
  for i = 1, #t do
    if t[i] == x then
      n = n + 1
    end
  end
  return n
end
```

1. Quel mot marque la fin d'un bloc ?

   - end

1. La boucle de cette fonction est-elle bornée ou non bornée ?

   - bornée

1. Par quelle expression Python remplacerait-on `#t` ?

   - len(t)

1. Que renvoie `compter({5, 2, 5}, 5)` ? (`{5, 2, 5}` est un tableau.)

   - 2

1. Dans cette boucle, quelle valeur prend `i` au dernier tour pour un tableau de 3 éléments ?

   - 3

1. En Python, quel `range` parcourt les indices de ce même tableau ?

   - range(len(t))
   - range(0, len(t))

1. Quel caractère Python remplace `then` et `do` à la fin de la ligne ?

   - :
::::
