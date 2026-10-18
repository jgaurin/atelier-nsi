---
titre: La programmation objet en Java
resume: Écrire des classes Java complètes — attributs privés, constructeurs, accesseurs, toString et equals, héritage, classes abstraites, interfaces et collections génériques — en comparaison avec Python.
duree: 75
objectifs:
  - Écrire une classe Java avec attributs privés, constructeurs (dont surchargés), accesseurs, `toString` et `equals`
  - Mettre en œuvre l'héritage (`extends`, `super`, `@Override`) et le polymorphisme en Java
  - Utiliser une classe abstraite, une interface (`implements`) et l'interface `Comparable`
  - Lire et écrire du code qui manipule `ArrayList`, `HashMap` et des structures récursives en Java
prerequis: [objet/java-bases, objet/heritage]
programme: [lp-java, lp-poo, lp-uml]
cartes:
  - q: Équivalent Java de `self` ?
    r: "`this`, qui est implicite : dans une méthode, `solde` désigne `this.solde` sauf si une variable locale ou un paramètre porte le même nom (d'où `this.solde = solde;` dans les constructeurs)."
  - q: Constructeur Java ?
    r: "Une méthode sans type de retour, du même nom que la classe ; on peut en écrire plusieurs (surcharge) ; `this(…)` appelle un autre constructeur, `super(…)` celui de la mère (en première ligne)."
  - q: Rôle de `@Override` ?
    r: "Annoncer qu'une méthode redéfinit une méthode héritée : le compilateur signale une erreur si ce n'est pas le cas (faute de frappe, mauvaise signature)."
  - q: "`extends` ou `implements` ?"
    r: "`extends` : hériter d'**une** classe (héritage simple) ; `implements` : réaliser une ou **plusieurs** interfaces."
  - q: À quoi sert `Comparable<T>` ?
    r: "À définir l'ordre naturel des objets via `int compareTo(T autre)` (négatif, nul ou positif) : `Collections.sort` et `TreeMap` l'utilisent. Équivalent de `__lt__`."
  - q: Que sont `toString` et `equals` ?
    r: "Méthodes héritées de `Object`, redéfinies pour l'affichage (`__str__`) et l'égalité de contenu (`__eq__`) ; si l'on redéfinit `equals`, on redéfinit aussi `hashCode`."
  - q: "`static` devant un attribut ou une méthode ?"
    r: "Il appartient à la **classe**, pas aux objets : un compteur partagé, une méthode utilitaire appelée par `Classe.methode()`."
---

La POO en Java reprend exactement les notions vues en Python — classe, encapsulation, héritage, polymorphisme — mais les rend
**explicites** : visibilités vérifiées par le compilateur, types déclarés, redéfinitions annoncées. Cette leçon traduit les classes des
leçons précédentes et ajoute ce qui est propre à Java (surcharge, interfaces, génériques). Les sujets de l'écrit mélangent souvent
les deux langages : il faut passer de l'un à l'autre sans effort.

## 1. Une classe complète

```java
public class Point {
    private double x;                 // attributs privés : encapsulation
    private double y;
    private static int nbPoints = 0;  // attribut de classe

    public Point(double x, double y) {   // constructeur
        this.x = x;                   // this.x : l'attribut ; x : le paramètre
        this.y = y;
        nbPoints++;
    }

    public Point() {                  // constructeur surchargé
        this(0, 0);                   // appelle l'autre constructeur
    }

    public double getX() { return x; }    // accesseurs
    public double getY() { return y; }

    public void translater(double dx, double dy) {
        x += dx;                      // x désigne this.x (pas d'ambiguïté ici)
        y += dy;
    }

    public double distance(Point autre) {
        return Math.sqrt(Math.pow(x - autre.x, 2) + Math.pow(y - autre.y, 2));
    }

    @Override
    public String toString() {        // ≈ __str__
        return "(" + x + ", " + y + ")";
    }

    @Override
    public boolean equals(Object o) { // ≈ __eq__
        if (!(o instanceof Point)) return false;
        Point p = (Point) o;
        return x == p.x && y == p.y;
    }

    @Override
    public int hashCode() {           // obligatoire si equals est redéfini
        return java.util.Objects.hash(x, y);
    }

    public static int getNbPoints() { return nbPoints; }
}
```

```java
Point a = new Point(3, 4);            // new : création d'un objet
Point o = new Point();
System.out.println(a + " " + a.distance(o));          // (3.0, 4.0) 5.0
System.out.println(a.equals(new Point(3, 4)));        // true
System.out.println(a == new Point(3, 4));             // false : deux objets distincts
System.out.println(Point.getNbPoints());              // 4
```

| Python | Java |
|---|---|
| `class Point:` | `public class Point { … }` |
| `def __init__(self, x, y):` | `public Point(double x, double y) { … }` |
| `self.x` | `this.x` (ou `x` s'il n'y a pas d'ambiguïté) |
| `self._x` (convention) | `private double x;` (vérifié) |
| `Point(3, 4)` | `new Point(3, 4)` |
| `__str__` / `__eq__` / `__lt__` | `toString()` / `equals(Object)` / `compareTo(T)` |
| attribut de classe | `static` |
| plusieurs signatures : paramètres par défaut | **surcharge** : plusieurs constructeurs ou méthodes |

:::remarque
`a.distance(o)` lit `autre.x` alors que `x` est privé : c'est permis, car la visibilité `private` est **par classe**, pas par objet. Une
méthode de `Point` peut lire les attributs privés de n'importe quel `Point`.
:::

## 2. Héritage et polymorphisme

```java
public abstract class Forme {               // classe abstraite : pas de new Forme()
    private String nom;

    public Forme(String nom) { this.nom = nom; }

    public abstract double aire();          // méthode abstraite : pas de corps

    public String decrire() {               // méthode concrète qui utilise aire()
        return nom + " d'aire " + aire();
    }
}

public class Rectangle extends Forme {
    private double l, h;

    public Rectangle(double l, double h) {
        super("rectangle");                 // constructeur de la mère, en 1re ligne
        this.l = l;
        this.h = h;
    }

    @Override
    public double aire() { return l * h; }
}

public class Cercle extends Forme {
    private double r;
    public Cercle(double r) { super("cercle"); this.r = r; }
    @Override
    public double aire() { return Math.PI * r * r; }
}
```

```java
Forme[] formes = { new Rectangle(2, 3), new Cercle(1) };   // type déclaré : Forme
for (Forme f : formes) {
    System.out.println(f.decrire());        // liaison dynamique : aire() de la classe réelle
}
// rectangle d'aire 6.0
// cercle d'aire 3.141592653589793
```

:::retenir[Type déclaré et type réel]
Dans `Forme f = new Cercle(1);`, le **type déclaré** (statique) est `Forme` : le compilateur n'autorise que les méthodes de `Forme`
(`f.aire()` oui, une méthode propre à `Cercle` non). Le **type réel** (dynamique) est `Cercle` : c'est lui qui choisit, à l'exécution,
**quelle version** d'`aire` s'exécute.
:::

## 3. Interfaces

Une interface est un contrat : des signatures de méthodes, sans attributs d'instance. Une classe n'hérite que d'**une** classe mais
peut implémenter **plusieurs** interfaces.

```java
public interface Pile<T> {                  // interface générique
    boolean estVide();
    void empiler(T x);
    T depiler();
}

public class PileTableau<T> implements Pile<T> {
    private java.util.ArrayList<T> elements = new java.util.ArrayList<>();

    public boolean estVide() { return elements.isEmpty(); }
    public void empiler(T x) { elements.add(x); }
    public T depiler() {
        if (estVide()) throw new IllegalStateException("pile vide");
        return elements.remove(elements.size() - 1);
    }
}
```

```java
Pile<String> p = new PileTableau<>();       // on programme « contre l'interface »
p.empiler("a"); p.empiler("b");
System.out.println(p.depiler() + p.depiler());   // ba
```

```mermaid legende="Une interface générique et deux implémentations interchangeables"
classDiagram
  class Pile~T~ {
    <<interface>>
    +estVide() boolean
    +empiler(x: T)
    +depiler() T
  }
  class PileTableau~T~ {
    -elements : ArrayList~T~
  }
  class PileChainee~T~ {
    -sommet : Maillon~T~
  }
  Pile~T~ <|.. PileTableau~T~
  Pile~T~ <|.. PileChainee~T~
```

### Comparable : l'ordre naturel

```java
public class Eleve implements Comparable<Eleve> {
    private String nom;
    private double moyenne;

    public Eleve(String nom, double moyenne) { this.nom = nom; this.moyenne = moyenne; }

    @Override
    public int compareTo(Eleve autre) {     // < 0 : this avant autre ; > 0 : après ; 0 : égaux
        return Double.compare(autre.moyenne, this.moyenne);   // moyenne décroissante
    }

    @Override
    public String toString() { return nom + " (" + moyenne + ")"; }
}

ArrayList<Eleve> classe = new ArrayList<>();
classe.add(new Eleve("Hugo", 12)); classe.add(new Eleve("Léa", 15.5));
java.util.Collections.sort(classe);         // utilise compareTo
System.out.println(classe);                 // [Léa (15.5), Hugo (12.0)]
```

## 4. Collections et structures récursives

| Python | Java (`java.util`) |
|---|---|
| `l = []`, `l.append(x)`, `l[i]`, `len(l)` | `ArrayList<T> l = new ArrayList<>();`, `l.add(x)`, `l.get(i)`, `l.size()` |
| `d = {}`, `d[k] = v`, `d[k]`, `k in d` | `HashMap<K, V> d = new HashMap<>();`, `d.put(k, v)`, `d.get(k)`, `d.containsKey(k)` |
| `d.get(k, 0)` | `d.getOrDefault(k, 0)` |
| `for k, v in d.items():` | `for (Map.Entry<K, V> e : d.entrySet())` |
| `set()`, `s.add(x)`, `x in s` | `HashSet<T>`, `s.add(x)`, `s.contains(x)` |
| `deque` (file) | `ArrayDeque<T>` : `addLast`, `pollFirst` |

```java
// Un nœud d'arbre binaire et sa taille (récursivité) : null joue le rôle de None
class Noeud {
    int valeur;
    Noeud gauche, droit;
    Noeud(int v, Noeud g, Noeud d) { valeur = v; gauche = g; droit = d; }
}

static int taille(Noeud n) {
    if (n == null) return 0;
    return 1 + taille(n.gauche) + taille(n.droit);
}
```

:::prof
Pour un sujet d'écrit, les questions Java portent souvent sur : compléter une classe (constructeur, accesseur), prédire un affichage
(liaison dynamique, `==` contre `equals`, division entière), traduire une méthode Python. S'entraîner à **compiler réellement** quelques
classes (un JDK installé, `javac` et `java` en ligne de commande) évite les erreurs de syntaxe qu'on ne voit pas sur papier : point-virgule,
`new`, type de retour manquant, `String` comparés par `==`.
:::

## Exemple guidé

**Problème.** Compter les mots d'un texte et afficher les trois plus fréquents, en Python puis en Java.

**1. En Python** (référence) :

```python exec
def trois_plus_frequents(texte):
    compte = {}
    for mot in texte.lower().split():
        compte[mot] = compte.get(mot, 0) + 1
    tries = sorted(compte.items(), key=lambda kv: (-kv[1], kv[0]))
    return tries[:3]

print(trois_plus_frequents("le chat et le chien et le lapin"))
```

**2. En Java**, la même structure (dictionnaire → `HashMap`, tri avec un comparateur) :

```java
import java.util.*;

public class Frequences {
    public static List<Map.Entry<String, Integer>> troisPlusFrequents(String texte) {
        HashMap<String, Integer> compte = new HashMap<>();
        for (String mot : texte.toLowerCase().split(" ")) {
            compte.put(mot, compte.getOrDefault(mot, 0) + 1);
        }
        List<Map.Entry<String, Integer>> tries = new ArrayList<>(compte.entrySet());
        tries.sort((a, b) -> a.getValue().equals(b.getValue())
                ? a.getKey().compareTo(b.getKey())          // même effectif : ordre alphabétique
                : b.getValue() - a.getValue());             // effectif décroissant
        return tries.subList(0, Math.min(3, tries.size()));
    }

    public static void main(String[] args) {
        System.out.println(troisPlusFrequents("le chat et le chien et le lapin"));
        // [le=3, et=2, chat=1]
    }
}
```

**3. Comparer.** Même algorithme, même coût ($O(n)$ pour compter, $O(k \log k)$ pour trier les $k$ mots distincts). Java oblige à
nommer les types (`HashMap<String, Integer>`) et utilise une **lambda** `(a, b) -> …` comme comparateur (l'équivalent de `key=`). Les
`Integer` sont comparés avec `equals` : `==` sur deux `Integer` compare des références et n'est fiable que pour les petites valeurs
(entre −128 et 127, mises en cache) — un piège de plus.

## L'essentiel

- Classe Java : attributs `private`, constructeur(s) du nom de la classe (surcharge, `this(…)`), accesseurs, `this` implicite, `new` pour créer.
- Méthodes héritées d'`Object` à redéfinir : `toString`, `equals` (et `hashCode`) ; annoter avec `@Override`.
- Héritage simple `extends`, `super(…)` en première ligne ; classes et méthodes `abstract` ; type déclaré (ce qu'on peut appeler) contre type réel (ce qui s'exécute).
- Interfaces : `implements`, plusieurs possibles ; génériques `<T>` ; `Comparable<T>` et `compareTo` pour l'ordre naturel.
- Collections : `ArrayList`, `HashMap`, `HashSet`, `ArrayDeque` ; `null` pour l'absence ; structures récursives avec des références.

## Exercices

::::exercice[Constructeur et this]{niveau=1}
Dans un constructeur `public Compte(double solde) { solde = solde; }`, que se passe-t-il ?

- [ ] l'attribut `solde` reçoit la valeur du paramètre
- [x] le paramètre est affecté à lui-même : l'attribut garde sa valeur par défaut (0.0)
- [ ] erreur de compilation
- [ ] l'attribut et le paramètre sont fusionnés

:::corrige
Dans le constructeur, `solde` désigne le **paramètre**, qui masque l'attribut : `solde = solde;` ne fait rien d'utile et l'attribut
vaut toujours `0.0` (valeur par défaut d'un `double`). Il faut écrire `this.solde = solde;` — le même piège que l'oubli de `self.` en
Python.
:::
::::

::::exercice[Type déclaré, type réel]{niveau=2}
Avec les classes `Forme`, `Rectangle`, `Cercle` de la section 2, et une méthode `getRayon()` ajoutée **seulement** dans `Cercle`, quelle
instruction est refusée **à la compilation** ?

- [ ] `Forme f = new Cercle(2);`
- [ ] `double a = f.aire();`
- [x] `double r = f.getRayon();`
- [ ] `Cercle c = new Cercle(2); double r = c.getRayon();`

:::corrige
Le type déclaré de `f` est `Forme`, qui n'a pas de `getRayon` : le compilateur refuse, même si l'objet est réellement un `Cercle`. Il
faudrait un transtypage vérifié : `if (f instanceof Cercle) { double r = ((Cercle) f).getRayon(); }`.
:::
::::

::::exercice[Écrire une classe Java]{niveau=2}
Écris la classe Java `Fraction` : attributs privés `num` et `den` (entiers), un constructeur qui lève `IllegalArgumentException` si le
dénominateur est nul et réduit la fraction (dénominateur positif), les méthodes `plus(Fraction f)` et `toString()`, et `equals`.
Une méthode statique `pgcd(int a, int b)` est fournie.

:::criteres
- Attributs `private int num, den;` ; constructeur `public Fraction(int num, int den)` qui teste `den == 0` et lève l'exception avec `throw new IllegalArgumentException(…)`.
- Normalisation : signe sur le numérateur, division par le PGCD (de valeurs absolues).
- `plus` renvoie une **nouvelle** `Fraction` (`new Fraction(num * f.den + f.num * den, den * f.den)`).
- `toString` et `equals(Object o)` avec `@Override`, `instanceof`, transtypage ; mention de `hashCode`.
:::

:::corrige
```java
public class Fraction {
    private int num, den;

    private static int pgcd(int a, int b) {
        return b == 0 ? Math.abs(a) : pgcd(b, a % b);
    }

    public Fraction(int num, int den) {
        if (den == 0) throw new IllegalArgumentException("dénominateur nul");
        if (den < 0) { num = -num; den = -den; }
        int g = pgcd(num, den);            // jamais nul, car den != 0
        this.num = num / g;
        this.den = den / g;
    }

    public Fraction plus(Fraction f) {
        return new Fraction(num * f.den + f.num * den, den * f.den);
    }

    @Override
    public String toString() {
        return den == 1 ? String.valueOf(num) : num + "/" + den;
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Fraction)) return false;
        Fraction f = (Fraction) o;
        return num == f.num && den == f.den;   // grâce à la forme réduite
    }

    @Override
    public int hashCode() { return 31 * num + den; }
}
```
Même invariant qu'en Python (forme irréductible, dénominateur positif) ; `num` et `den` ne changent jamais après la construction :
l'objet est **immuable**, on pourrait les déclarer `final`.
:::
::::

::::exercice[Traduire une classe Java en Python]{niveau=3}
Voici une classe Java. Écris la classe Python équivalente `Tirelire` (mêmes noms de méthodes, attributs « privés » préfixés par `_`).

```java
public class Tirelire {
    private int pieces = 0;
    private boolean cassee = false;
    private static int total = 0;          // pièces dans toutes les tirelires

    public void ajouter(int n) {
        if (cassee || n <= 0) throw new IllegalStateException();
        pieces += n;
        total += n;
    }

    public int casser() {
        if (cassee) throw new IllegalStateException();
        cassee = true;
        total -= pieces;
        int p = pieces;
        pieces = 0;
        return p;
    }

    public static int getTotal() { return total; }
}
```

```python depart
class Tirelire:
    ...
```

```python tests
Tirelire.total = 0
a, b = Tirelire(), Tirelire()
a.ajouter(5); b.ajouter(3); a.ajouter(2)
assert Tirelire.get_total() == 10, "total partagé"
assert a.casser() == 7 and Tirelire.get_total() == 3, "casser"
for action in (lambda: a.ajouter(1), lambda: a.casser(), lambda: b.ajouter(0)):
    try:
        action()
        ok = False
    except Exception:
        ok = True
    assert ok, "opérations interdites"
```

:::corrige
```python solution
class Tirelire:
    total = 0                              # attribut de classe (static)

    def __init__(self):
        self._pieces = 0
        self._cassee = False

    def ajouter(self, n):
        if self._cassee or n <= 0:
            raise RuntimeError("opération impossible")
        self._pieces += n
        Tirelire.total += n

    def casser(self):
        if self._cassee:
            raise RuntimeError("déjà cassée")
        self._cassee = True
        Tirelire.total -= self._pieces
        p, self._pieces = self._pieces, 0
        return p

    @staticmethod
    def get_total():
        return Tirelire.total
```
Les initialisations d'attributs Java (`private int pieces = 0;`) vont dans `__init__` ; `static` devient un attribut de classe (modifié
via `Tirelire.total`, **pas** `self.total += n`, qui créerait un attribut d'instance) et une `@staticmethod`. Les exceptions Java
deviennent des `raise`.
:::
::::

::::exercice[Concevoir avec une interface]{niveau=4 duree=25}
Un logiciel de quiz pour la classe propose des questions de plusieurs sortes : QCM (une seule bonne réponse parmi des choix),
question ouverte numérique (réponse juste à une tolérance près), vrai/faux.

1. Proposez en Java une interface `Question` et trois classes qui l'implémentent (signatures et attributs, corps de `estCorrecte`).
2. Écrivez la méthode `static int score(List<Question> qs, List<String> reponses)`.
3. Interface ou classe abstraite ? Justifiez, en indiquant ce qui pourrait être factorisé.
4. Quel intérêt pédagogique y a-t-il à faire écrire cet exemple à des élèves de terminale (en Python) ?

:::criteres
- Interface avec `String enonce()` et `boolean estCorrecte(String reponse)` (ou équivalent) ; trois classes `implements Question` avec attributs privés adaptés (choix et indice, valeur et tolérance, booléen).
- Conversion de la réponse (`Double.parseDouble`, gestion de `NumberFormatException`) dans la question numérique.
- `score` : boucle sur les indices, appel polymorphe `estCorrecte`, aucun `instanceof`.
- Choix argumenté : interface (contrat pur, possibilité d'implémenter d'autres interfaces) ou classe abstraite si l'on factorise l'énoncé et un barème.
- Intérêt pédagogique : polymorphisme qui évite les `if type`, extension facile (nouveau type de question), travail en équipe sur une interface commune.
:::

:::corrige
1. ```java
   public interface Question {
       String enonce();
       boolean estCorrecte(String reponse);
   }

   public class QCM implements Question {
       private String enonce;
       private String[] choix;
       private int bonne;                      // indice de la bonne réponse
       public QCM(String enonce, String[] choix, int bonne) { … }
       public String enonce() { return enonce; }
       public boolean estCorrecte(String reponse) { return choix[bonne].equals(reponse); }
   }

   public class Numerique implements Question {
       private String enonce;
       private double valeur, tolerance;
       public boolean estCorrecte(String reponse) {
           try {
               return Math.abs(Double.parseDouble(reponse) - valeur) <= tolerance;
           } catch (NumberFormatException e) {
               return false;
           }
       }
       …
   }

   public class VraiFaux implements Question {
       private String enonce;
       private boolean vrai;
       public boolean estCorrecte(String reponse) {
           return reponse.equalsIgnoreCase(vrai ? "vrai" : "faux");
       }
       …
   }
   ```
2. ```java
   static int score(List<Question> qs, List<String> reponses) {
       int s = 0;
       for (int i = 0; i < qs.size(); i++) {
           if (qs.get(i).estCorrecte(reponses.get(i))) s++;   // appel polymorphe
       }
       return s;
   }
   ```
3. Les trois classes répètent l'attribut `enonce` et sa méthode : une **classe abstraite** `QuestionAbstraite implements Question`
   pourrait les factoriser (et un barème commun), en laissant `estCorrecte` abstraite. L'interface reste utile comme **contrat** :
   on peut garder les deux (interface + classe abstraite qui l'implémente partiellement), schéma courant en Java.
4. Le polymorphisme y est **utile** et non artificiel : sans lui, `score` contiendrait une cascade de `if type(q) == …` à modifier à
   chaque nouveau type de question. Les élèves peuvent se répartir les classes autour d'une interface fixée ensemble, puis ajouter
   un type de question sans toucher au reste : ils ressentent l'intérêt de l'encapsulation et de l'extension.
:::
::::
