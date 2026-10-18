---
titre: Java pour les programmeurs Python
resume: Lire et écrire du Java impératif à partir de ce qu'on sait en Python — typage statique, compilation, types primitifs, tableaux, boucles, méthodes statiques et chaînes.
duree: 70
objectifs:
  - Expliquer la chaîne compilation (javac) / exécution (JVM) et le typage statique
  - Déclarer des variables de types primitifs et références, et connaître les pièges (division entière, débordement, `==` sur les chaînes)
  - Traduire en Java des fonctions Python simples (conditions, boucles, tableaux, `ArrayList`)
  - Lire un programme Java complet et prédire son affichage
prerequis: [python/fonctions, python/listes]
programme: [lp-java, lp-imperatif]
cartes:
  - q: Compilé ou interprété, Java ?
    r: "Les deux : `javac` **compile** le source `.java` en **bytecode** `.class`, que la **JVM** exécute (interprétation et compilation à la volée). Les erreurs de type sont détectées **avant** l'exécution."
  - q: Typage statique ?
    r: "Chaque variable a un type déclaré, fixé à la compilation (`int n = 3;`) ; le compilateur refuse `n = \"texte\";`. Python est dynamiquement typé : c'est la valeur qui a un type."
  - q: Les 8 types primitifs Java ?
    r: "`byte`, `short`, `int`, `long` (entiers 8/16/32/64 bits), `float`, `double` (flottants), `char` (caractère 16 bits), `boolean`."
  - q: Que vaut `7 / 2` en Java ? et `7 / 2.0` ?
    r: "`3` (division entière entre deux `int`) ; `3.5` (un opérande `double` rend la division flottante)."
  - q: Que vaut `Integer.MAX_VALUE + 1` ?
    r: "`-2147483648` (`Integer.MIN_VALUE`) : les `int` sont sur 32 bits en complément à deux et **débordent** silencieusement."
  - q: Comparer deux chaînes en Java ?
    r: "Avec `s.equals(t)`, pas `s == t` (qui compare les **références**)."
  - q: Tableau ou ArrayList ?
    r: "Un tableau (`int[] t = new int[10];`) a une taille fixe ; une `ArrayList<Integer>` est redimensionnable (`add`, `get`, `set`, `size`), comme une liste Python."
  - q: Signature de la méthode principale ?
    r: "`public static void main(String[] args)`, dans une classe : c'est le point d'entrée du programme."
---

Le programme de l'écrit demande de savoir « lire et écrire des programmes » en Java en plus de Python. Bonne nouvelle : les
**algorithmes sont les mêmes** ; seule la syntaxe change, et surtout la **discipline des types**. Cette leçon part de Python et
montre, construction par construction, l'équivalent Java. Le navigateur ne sait pas exécuter Java : chaque exemple est donc
accompagné de son affichage, à prédire avant de le lire.

## 1. Un programme Java, de bout en bout

```java
// Fichier Bonjour.java : le nom du fichier = le nom de la classe publique
public class Bonjour {
    public static void main(String[] args) {
        String prenom = "Léa";
        int age = 17;
        System.out.println("Bonjour " + prenom + ", tu as " + age + " ans.");
    }
}
```

```text
$ javac Bonjour.java      ← compilation : produit Bonjour.class (bytecode)
$ java Bonjour            ← exécution par la machine virtuelle Java (JVM)
Bonjour Léa, tu as 17 ans.
```

```mermaid legende="Compilation puis exécution : le même bytecode tourne sur toute machine qui a une JVM"
flowchart LR
  S["Bonjour.java<br/>(source)"] -->|"javac<br/>(vérifie les types)"| B["Bonjour.class<br/>(bytecode)"]
  B -->|"java"| J["JVM<br/>interprète + compile à la volée"]
  J --> W["Windows"]
  J --> L["Linux"]
  J --> M["macOS"]
```

:::retenir[Ce qui change par rapport à Python]
- **Tout est dans une classe** ; l'exécution commence par `public static void main(String[] args)`.
- Chaque instruction se termine par `;` ; les **blocs** sont délimités par `{ }` (l'indentation n'est que de la présentation).
- **Typage statique** : chaque variable est déclarée avec son type, une fois pour toutes ; le compilateur refuse un programme mal
  typé **avant** de l'exécuter.
:::

## 2. Types et variables

| Python | Java | Remarque |
|---|---|---|
| `n = 3` | `int n = 3;` | entier **32 bits** (débordement !) ; `long` pour 64 bits |
| `x = 2.5` | `double x = 2.5;` | flottant 64 bits (IEEE 754, comme Python) |
| `ok = True` | `boolean ok = true;` | minuscules |
| `c = "a"` (chaîne) | `char c = 'a';` | un caractère, guillemets **simples** |
| `s = "abc"` | `String s = "abc";` | `String` est une classe (type **référence**) |
| `None` | `null` | seulement pour les références |
| `7 // 2`, `7 % 2` | `7 / 2`, `7 % 2` | `/` entre deux entiers = division **entière** |
| `int("42")` | `Integer.parseInt("42")` | conversions explicites |

```java
int a = 7, b = 2;
System.out.println(a / b);            // 3
System.out.println(a / 2.0);          // 3.5
System.out.println((double) a / b);   // 3.5   (conversion explicite, « cast »)
System.out.println(-7 / 2);           // -3    (troncature vers 0 ; Python : -7 // 2 == -4)
System.out.println(-7 % 2);           // -1    (Python : -7 % 2 == 1)
int grand = Integer.MAX_VALUE;        // 2147483647
System.out.println(grand + 1);        // -2147483648 : débordement silencieux
```

:::attention[Les trois pièges classiques]
1. **Division entière** : `1 / 2` vaut `0`. Une moyenne calculée `somme / n` avec deux `int` est fausse.
2. **Débordement** : un `int` est borné à $2^{31}-1$ ; factorielle de 13 déborde déjà (utiliser `long` ou `BigInteger`).
3. **`==` sur les objets** compare les références : pour des chaînes, utiliser `s.equals(t)`.
:::

## 3. Conditions et boucles

```java
// si / sinon si / sinon
if (note >= 16) {
    mention = "TB";
} else if (note >= 14) {
    mention = "B";
} else {
    mention = "";
}

// for « à la C » : initialisation ; condition ; incrément   ≈ for i in range(0, n)
for (int i = 0; i < n; i++) {
    somme += i;
}

// while : identique, avec des parenthèses
while (n > 1) {
    n = (n % 2 == 0) ? n / 2 : 3 * n + 1;   // opérateur ternaire  ≈  x if c else y
}

// for-each  ≈ for x in t
for (int x : t) {
    System.out.println(x);
}
```

Les opérateurs logiques s'écrivent `&&` (et), `||` (ou), `!` (non) ; ils sont **paresseux** comme en Python.

## 4. Tableaux, listes et chaînes

```java
int[] t = {5, 3, 8, 1};           // tableau de taille fixe, initialisé
int[] u = new int[10];            // 10 cases valant 0
t[0] = 7;
System.out.println(t.length);     // 4   (attribut, sans parenthèses)

import java.util.ArrayList;       // (en tête de fichier)
ArrayList<Integer> l = new ArrayList<>();
l.add(4); l.add(9);               // l.append(…)
l.set(0, 1);                      // l[0] = 1
System.out.println(l.get(1) + " " + l.size());   // 9 2

String s = "concours";
s.length();          // 8
s.charAt(0);         // 'c'           ≈ s[0]
s.substring(3, 6);   // "cou"         ≈ s[3:6]
s.indexOf("ou");     // 4             ≈ s.find("ou")
s.equals("CAPES");   // false
```

Les génériques (`ArrayList<Integer>`) n'acceptent que des **types références** : on écrit `Integer`, `Double`, `Character`,
`Boolean` (classes « enveloppes »), et Java convertit automatiquement entre `int` et `Integer` (*autoboxing*).

## 5. Fonctions : des méthodes statiques

Une fonction Python devient une **méthode statique** d'une classe, avec les types des paramètres et du résultat (`void` s'il n'y en
a pas) :

```python exec
def maximum(t):
    m = t[0]
    for x in t:
        if x > m:
            m = x
    return m

print(maximum([5, 3, 8, 1]))
```

```java
public class Outils {
    public static int maximum(int[] t) {
        int m = t[0];
        for (int x : t) {
            if (x > m) {
                m = x;
            }
        }
        return m;
    }

    public static void main(String[] args) {
        System.out.println(maximum(new int[] {5, 3, 8, 1}));   // 8
    }
}
```

Java permet la **surcharge** : deux méthodes de même nom mais de paramètres différents (`maximum(int[] t)` et
`maximum(double[] t)`) ; le compilateur choisit d'après les types des arguments. Les paramètres sont passés **par valeur** — mais
pour un tableau ou un objet, la valeur passée est une **référence** : la méthode peut modifier le tableau de l'appelant, exactement
comme en Python.

:::prof
Au lycée, Java n'est pas au programme (Python seul) ; au concours, il faut **lire** sans hésiter un code Java et en **écrire** un
court. La meilleure préparation : réécrire en Java quelques exercices déjà faits en Python (recherche, tris, piles) et les compiler
(un JDK ou un compilateur en ligne suffit). Le typage statique est aussi un bon support de réflexion didactique : quelles erreurs
attrape-t-il, que coûte-t-il en écriture ?
:::

## Exemple guidé

**Problème.** Traduire en Java la recherche dichotomique, puis repérer le bug historique de la version Java standard.

**1. Version Python (référence).**

```python exec
def dichotomie(t, x):
    g, d = 0, len(t) - 1
    while g <= d:
        m = (g + d) // 2
        if t[m] == x:
            return m
        elif t[m] < x:
            g = m + 1
        else:
            d = m - 1
    return -1

t = [1, 3, 5, 7, 9, 11]
print(dichotomie(t, 7), dichotomie(t, 4))
```

**2. Traduction ligne à ligne.**

```java
public static int dichotomie(int[] t, int x) {
    int g = 0, d = t.length - 1;
    while (g <= d) {
        int m = g + (d - g) / 2;     // et non (g + d) / 2 : voir étape 3
        if (t[m] == x) {
            return m;
        } else if (t[m] < x) {
            g = m + 1;
        } else {
            d = m - 1;
        }
    }
    return -1;
}
```

`//` devient `/` (division entière entre `int`) ; `len(t)` devient `t.length` ; les types sont déclarés.

**3. Le débordement.** Avec `(g + d) / 2`, si le tableau a plus d'un milliard de cases, `g + d` peut dépasser $2^{31}-1$ et devenir
**négatif** : indice invalide. Ce bug est resté des années dans la bibliothèque standard Java (corrigé en 2006). `g + (d - g) / 2`
donne le même milieu sans jamais dépasser `d`. En Python, les entiers ne débordent pas : la question ne se pose pas.

## L'essentiel

- `javac` compile en bytecode, la JVM l'exécute ; typage **statique** vérifié à la compilation.
- Tout est dans une classe ; point d'entrée `public static void main(String[] args)` ; `;` et `{ }`.
- Types primitifs (`int`, `long`, `double`, `char`, `boolean`…) et références (`String`, tableaux, objets, `null`).
- Pièges : `/` entier entre `int`, débordement des `int`, `==` contre `.equals` sur les objets, `-7 / 2 == -3`.
- `for (int i = 0; i < n; i++)`, `for (int x : t)`, `while`, `if / else if / else`, `&& || !`, ternaire `c ? a : b`.
- Tableau `int[]` (taille fixe, `t.length`) ; `ArrayList<Integer>` (`add`, `get`, `set`, `size()`) ; `String` : `length()`, `charAt`, `substring`.
- Fonctions = méthodes `static` typées ; surcharge possible ; passage par valeur (de la référence pour les objets).

## Exercices

::::exercice[Division et types]{niveau=1}
Qu'affiche `System.out.println(5 / 2 + 5 % 2 + 1.0 / 2);` ?

- [ ] `3.0`
- [x] `3.5`
- [ ] `4.0`
- [ ] `3`

:::corrige
`5 / 2` vaut `2` (division entière), `5 % 2` vaut `1`, `1.0 / 2` vaut `0.5` : `2 + 1 + 0.5 = 3.5`, affiché `3.5` (le résultat est un
`double`).
:::
::::

::::exercice[Comparer des chaînes]{niveau=1}
Pour tester si la chaîne `reponse` saisie par l'utilisateur vaut `"oui"`, quelle condition Java est correcte ?

- [ ] `reponse == "oui"`
- [x] `reponse.equals("oui")`
- [ ] `reponse = "oui"`
- [ ] `reponse.equal("oui")`

:::corrige
`==` compare les **références** (deux objets `String` distincts peuvent avoir le même contenu) ; `equals` compare le contenu. `=` est
une affectation (refusée par le compilateur dans une condition, car le résultat n'est pas un `boolean`).
:::
::::

::::exercice[Lire un programme Java]{niveau=2}
Quel est l'affichage de ce programme ? Réponds par les nombres affichés, séparés par des espaces.

```java
public class Mystere {
    public static int f(int[] t) {
        int c = 0;
        for (int i = 1; i < t.length; i++) {
            if (t[i] < t[i - 1]) {
                c++;
            }
        }
        return c;
    }

    public static void main(String[] args) {
        int[] a = {3, 1, 4, 1, 5, 9, 2, 6};
        System.out.println(f(a) + " " + a.length / 3);
    }
}
```

:::corrige
`f` compte les **descentes** (`t[i] < t[i-1]`) : 3→1, 4→1, 9→2, soit **3**. `a.length / 3` = `8 / 3` = **2** (division entière).
Affichage : `3 2`.
:::
::::

::::exercice[Traduire en Java]{niveau=2}
Écris en Java une méthode statique `compter(String s, char c)` qui renvoie le nombre d'occurrences du caractère `c` dans la chaîne
`s`, puis une méthode `estPalindrome(String s)`.

:::criteres
- Signatures correctes : `public static int compter(String s, char c)`, `public static boolean estPalindrome(String s)`.
- Parcours avec `s.length()` et `s.charAt(i)` ; comparaison de `char` avec `==` (correcte pour des types primitifs).
- Palindrome : deux indices qui se rapprochent, ou comparaison de `charAt(i)` et `charAt(n - 1 - i)` jusqu'à la moitié ; retour anticipé `false`.
:::

:::corrige
```java
public static int compter(String s, char c) {
    int n = 0;
    for (int i = 0; i < s.length(); i++) {
        if (s.charAt(i) == c) {      // == est correct ici : char est un type primitif
            n++;
        }
    }
    return n;
}

public static boolean estPalindrome(String s) {
    int i = 0, j = s.length() - 1;
    while (i < j) {
        if (s.charAt(i) != s.charAt(j)) {
            return false;
        }
        i++;
        j--;
    }
    return true;
}
```
Le piège à éviter : utiliser `==` pour des `String` ; ici on compare des `char`, c'est donc légitime.
:::
::::

::::exercice[Simuler le débordement]{niveau=3}
Python n'a pas de débordement, mais on peut le **simuler**. Écris `int32(n)` qui renvoie la valeur qu'aurait l'entier `n` stocké
dans un `int` Java (32 bits, complément à deux), puis `factorielle_java(n)` qui calcule $n!$ comme le ferait Java avec des `int`
(chaque multiplication est ramenée sur 32 bits).

```python depart
def int32(n):
    ...

def factorielle_java(n):
    ...
```

```python tests
assert int32(2**31 - 1) == 2147483647, "maximum"
assert int32(2**31) == -2147483648, "débordement"
assert int32(-2**31 - 1) == 2147483647, "débordement négatif"
assert int32(5) == 5 and int32(-5) == -5, "petits entiers"
assert factorielle_java(12) == 479001600, "12! tient dans un int"
assert factorielle_java(13) == 1932053504, "13! déborde"
assert factorielle_java(17) == -288522240, "17! devient négatif"
```

:::corrige
```python solution
def int32(n):
    n = n % 2**32               # représentant dans [0, 2^32[
    return n - 2**32 if n >= 2**31 else n

def factorielle_java(n):
    f = 1
    for k in range(2, n + 1):
        f = int32(f * k)
    return f
```
Un `int` Java garde les 32 bits de poids faible du résultat exact, interprétés en complément à deux : on prend le reste modulo
$2^{32}$, puis les valeurs $\ge 2^{31}$ représentent des négatifs. $13! = 6\,227\,020\,800$ dépasse $2^{31}-1$ : Java affiche
`1932053504`, et $17!$ s'affiche même négatif. C'est pourquoi on utilise `long` (64 bits) ou `BigInteger`.
:::
::::

::::exercice[Python ou Java pour enseigner ?]{niveau=4 duree=20}
Un collègue affirme : « Le typage statique de Java est une perte de temps pour des débutants ; Python est meilleur en tout point. »

1. Donnez deux erreurs qu'un compilateur Java détecte avant l'exécution et qu'un programme Python ne révèle qu'à l'exécution (ou pas
   du tout), avec un exemple de code pour chacune.
2. Donnez deux difficultés que Java ajoute pour un élève débutant.
3. Comment pourriez-vous, en Python, faire travailler aux élèves la notion de type (programme de NSI) ?

:::criteres
- Deux erreurs détectées à la compilation en Java avec exemple : type incompatible (`int n = "3";`), appel d'une méthode inexistante, oubli de `return` dans une branche, variable non initialisée…, et leur équivalent Python qui échoue tard (branche rarement exécutée).
- Deux difficultés réelles : syntaxe verbeuse (`public static void main`), distinction primitifs / références et `equals`, division entière silencieuse, compilation.
- Pistes en Python : annotations de types (`def f(x: int) -> str`), outil de vérification (mypy), `assert isinstance`, spécifications écrites, préconditions, discussion des erreurs `TypeError`.
:::

:::corrige
1. **Type incompatible** : `int n = "3";` est refusé par `javac` ; en Python, `n = "3"` passe et l'erreur n'apparaît qu'à
   `n + 1` (`TypeError`), peut-être dans une branche rarement exécutée. **Méthode ou attribut inexistant** : `liste.lenght()` est
   refusé à la compilation en Java ; en Python, `l.lenght()` ne plante qu'au moment où la ligne s'exécute. Autres exemples : une
   méthode qui ne renvoie rien dans une branche (`missing return statement`), une variable lue avant d'être initialisée.
2. La **verbosité** (classe, `public static void main(String[] args)`, types partout) qui retarde le premier programme ; la
   distinction **primitifs / références** (`==` contre `equals`, `int` contre `Integer`) ; la **division entière** silencieuse ; le
   cycle compiler / exécuter.
3. Les **annotations de types** (`def moyenne(notes: list[float]) -> float:`) dans les spécifications, vérifiées par un outil comme
   mypy ; des **préconditions** (`assert isinstance(n, int) and n >= 0`) ; faire prévoir le type de chaque expression avant de
   l'exécuter ; analyser des messages `TypeError`. Le débat n'a pas de vainqueur absolu : Python allège la syntaxe pour se concentrer
   sur l'algorithmique, Java rend les types explicites — d'où l'intérêt de les rendre visibles en Python.
:::
::::
