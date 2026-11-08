---
titre: Constructions et langages
resume: "Les briques communes à tous les langages de programmation, et comment repérer ce qui change d'un langage à l'autre."
duree: 30
objectifs:
  - "Reconnaître les constructions élémentaires d'un programme"
  - "Repérer les traits communs et les différences entre deux langages"
---

Tous les langages courants reposent sur les mêmes briques, les **constructions élémentaires**.

## 1. Les constructions élémentaires

| Construction | En Python |
| --- | --- |
| Séquence | les instructions, l'une après l'autre |
| Affectation | `x = 3` |
| Conditionnelle | `if`, `elif`, `else` |
| Boucle bornée | `for i in range(5):` |
| Boucle non bornée | `while x > 0:` |
| Appel de fonction | `f(x)` |

## 2. Un même programme, deux langages

Python :

```python
def somme(n):
    s = 0
    for i in range(1, n + 1):
        s = s + i
    return s
```

JavaScript :

```javascript
function somme(n) {
  let s = 0;
  for (let i = 1; i <= n; i++) {
    s = s + i;
  }
  return s;
}
```

- **Mêmes idées** : une fonction, une variable, une boucle bornée, un retour.
- **Syntaxe différente** : en Python, les blocs sont marqués par l'**indentation** ; en JavaScript, par des **accolades**.

:::remarque
Il existe des langages de styles différents (impératif, fonctionnel, objet…), et des langages qui ne servent pas à programmer : HTML décrit une page, SQL interroge une base de données.
:::

## L'essentiel

- Six constructions : séquence, affectation, conditionnelle, boucle bornée, boucle non bornée, appel de fonction.
- Les langages partagent ces idées et diffèrent par leur syntaxe.
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
