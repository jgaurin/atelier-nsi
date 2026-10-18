---
titre: "Formats de données : XML et JSON"
resume: Représenter et échanger des données structurées avec JSON et XML, les lire et les produire en Python, comprendre bonne formation, validité et échappement, et choisir un format.
duree: 55
objectifs:
  - Lire et écrire des données JSON et XML correctes (syntaxe, types, bonne formation)
  - Convertir entre JSON et structures Python (`json.loads`, `json.dumps`) et parcourir un document XML (`ElementTree`)
  - Distinguer document bien formé et document valide (DTD, schéma)
  - Choisir un format (CSV, JSON, XML) selon les données et l'usage
prerequis: [web/html-css, python/tuples-dictionnaires]
programme: [id-formats, id-web, id-client-serveur, nsi1-tables, snt-donnees]
cartes:
  - q: Les types de valeurs JSON ?
    r: "Objet `{\"clé\": valeur}`, tableau `[…]`, chaîne entre **guillemets doubles**, nombre, `true`, `false`, `null`."
  - q: "Pourquoi `{'nom': 'Léa',}` n'est-il pas du JSON valide ?"
    r: "Les chaînes et les clés doivent être entre guillemets **doubles**, et la virgule finale est interdite. (C'est en revanche un dictionnaire Python correct.)"
  - q: json.loads et json.dumps ?
    r: "`json.loads(texte)` transforme un texte JSON en objets Python (dict, list, str, int/float, True/False/None) ; `json.dumps(objet)` fait l'inverse."
  - q: XML bien formé ?
    r: "Un seul élément racine, toutes les balises fermées, correctement imbriquées, sensibles à la casse, valeurs d'attributs entre guillemets, caractères `<` et `&` échappés (`&lt;`, `&amp;`)."
  - q: Bien formé ou valide ?
    r: "**Bien formé** : respecte la syntaxe XML. **Valide** : en plus, respecte une grammaire donnée (DTD ou schéma XSD) qui fixe quels éléments et attributs sont permis et où."
  - q: Élément ou attribut en XML ?
    r: "Un élément `<titre>…</titre>` peut contenir du texte et d'autres éléments, et se répéter ; un attribut `id=\"3\"` est une valeur simple, unique par élément (souvent une métadonnée : identifiant, unité, langue)."
  - q: CSV, JSON ou XML ?
    r: "CSV : une table (lignes × colonnes), simple et compacte. JSON : données imbriquées, léger, natif en JavaScript (API web). XML : documents structurés, validables par un schéma, avec attributs et texte mêlé (formats bureautiques, flux RSS)."
---

Une table de données se range bien dans un fichier CSV. Mais comment écrire une **fiche de film** avec plusieurs acteurs, chacun ayant
un nom et un rôle, ou la **réponse d'un serveur météo** avec les prévisions heure par heure ? Il faut des formats capables de représenter
des données **imbriquées** (des arbres) sous forme de texte. Les deux plus répandus sur le Web sont **JSON** et **XML**.

## 1. JSON

**JSON** (*JavaScript Object Notation*) reprend la notation des objets JavaScript. Six sortes de valeurs, combinables à volonté :

```json
{
  "titre": "Le Voyage de Chihiro",
  "annee": 2001,
  "note": 8.6,
  "en_salle": false,
  "realisateur": { "nom": "Miyazaki", "prenom": "Hayao" },
  "genres": ["animation", "fantastique"],
  "suite": null
}
```

| JSON | Python |
|---|---|
| objet `{"k": v}` | `dict` |
| tableau `[…]` | `list` |
| chaîne `"…"` | `str` |
| nombre `12`, `8.6` | `int`, `float` |
| `true` / `false` / `null` | `True` / `False` / `None` |

```python exec
import json

texte = '{"titre": "Le Voyage de Chihiro", "annee": 2001, "genres": ["animation", "fantastique"], "suite": null}'
film = json.loads(texte)                 # texte JSON → objets Python
print(type(film), film["annee"] + 1, film["genres"][0], film["suite"])

film["vu"] = True
print(json.dumps(film, ensure_ascii=False))           # objets Python → texte JSON
print(json.dumps({"n": 1, "liste": (1, 2)}))           # un tuple devient un tableau
```

:::attention[Ce n'est pas un dictionnaire Python]
JSON impose les guillemets **doubles**, interdit la virgule finale et les commentaires, et écrit `true`, `false`, `null`. Les clés
d'un objet sont **toujours des chaînes** : `json.dumps({1: "a"})` donne `{"1": "a"}`, et la clé redevient la **chaîne** `"1"` au retour.
:::

## 2. XML

**XML** (*eXtensible Markup Language*) ressemble à HTML, mais on y **invente ses propres balises** : il décrit des données, pas une
présentation.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<catalogue>
  <film id="f1" annee="2001">
    <titre>Le Voyage de Chihiro</titre>
    <realisateur>Hayao Miyazaki</realisateur>
    <genre>animation</genre>
    <genre>fantastique</genre>
  </film>
  <film id="f2" annee="1997">
    <titre>Princesse Mononoké</titre>
    <realisateur>Hayao Miyazaki</realisateur>
    <genre>animation</genre>
  </film>
</catalogue>
```

:::definition[Bien formé]
Un document XML est **bien formé** s'il respecte la syntaxe : un **unique élément racine** ; toute balise ouverte est **fermée** (ou
auto-fermante : `<vide/>`) ; les éléments sont **correctement imbriqués** ; les noms sont **sensibles à la casse** ; les valeurs
d'attributs sont **entre guillemets** ; les caractères `<` et `&` du texte sont **échappés** en `&lt;` et `&amp;`. Contrairement à HTML,
un analyseur XML **refuse** un document mal formé.
:::

Un document peut en plus être **valide** : conforme à une grammaire (**DTD** ou **schéma XSD**) qui précise quels éléments sont
permis, dans quel ordre, combien de fois, avec quels attributs et quels types. C'est ce qui permet à deux logiciels d'échanger des
documents de façon sûre (factures électroniques, formats bureautiques ODF et OOXML, flux RSS, SVG).

```python exec
import xml.etree.ElementTree as ET

xml = """<catalogue>
  <film id="f1" annee="2001"><titre>Le Voyage de Chihiro</titre><genre>animation</genre><genre>fantastique</genre></film>
  <film id="f2" annee="1997"><titre>Princesse Mononoké</titre><genre>animation</genre></film>
</catalogue>"""
racine = ET.fromstring(xml)
for film in racine.findall("film"):               # les enfants <film>
    titre = film.find("titre").text                 # texte du premier <titre>
    genres = [g.text for g in film.findall("genre")]
    print(film.get("id"), film.get("annee"), titre, genres)    # get : un attribut

try:
    ET.fromstring("<a><b></a></b>")
except ET.ParseError as e:
    print("mal formé :", e)
```

```mermaid legende="Un document XML est un arbre : éléments (nœuds), attributs et textes"
flowchart TD
  C["catalogue"] --> F1["film<br/>id=f1, annee=2001"]
  C --> F2["film<br/>id=f2, annee=1997"]
  F1 --> T1["titre : « Le Voyage de Chihiro »"]
  F1 --> G1["genre : « animation »"]
  F1 --> G2["genre : « fantastique »"]
  F2 --> T2["titre : « Princesse Mononoké »"]
  F2 --> G3["genre : « animation »"]
```

## 3. Choisir un format

| | CSV | JSON | XML |
|---|---|---|---|
| structure | une table | arbre (objets, tableaux) | arbre (éléments, attributs, texte) |
| types | aucun (tout est texte) | chaîne, nombre, booléen, null | texte (types via un schéma) |
| validation | non | possible (JSON Schema) | DTD, XSD, très outillée |
| verbosité | très faible | faible | forte (balises fermantes) |
| usages typiques | données ouvertes tabulaires, tableur | API web, configuration | documents, bureautique, RSS, SVG, échanges normalisés |

Dans une application web, le serveur répond souvent en **JSON** aux requêtes `fetch` du navigateur (leçon précédente) : c'est le format
des **API**. Les sites de données ouvertes (data.gouv.fr) proposent fréquemment le même jeu de données en CSV et en JSON.

:::prof
Le programme de première NSI (données en table) travaille surtout le CSV ; JSON et XML apparaissent en SNT (« Les données
structurées et leur traitement » : métadonnées, formats ouverts) et au concours dans la ligne « bases sur le format des données : HTML,
CSS, XML ». Une activité qui marche bien : récupérer un même jeu de données ouvertes en CSV et en JSON, comparer les fichiers (taille,
lisibilité, imbrication), puis écrire le petit programme qui calcule la même statistique à partir des deux.
:::

## Exemple guidé

**Problème.** Un serveur renvoie la liste des emprunts de la médiathèque en JSON. Produire le même contenu en XML, en échappant
correctement les caractères spéciaux (un titre contient « & »).

**1. Les données.**

```python exec
import json

reponse = '''[
  {"id": 1, "titre": "Tintin & Milou", "rendu": false},
  {"id": 2, "titre": "Les Misérables", "rendu": true}
]'''
emprunts = json.loads(reponse)
print(emprunts[0]["titre"], emprunts[1]["rendu"])
```

**2. Choisir la forme XML.** L'identifiant devient un **attribut** (métadonnée unique), le titre un **élément** (texte libre), le booléen un
attribut `rendu="oui"/"non"`.

**3. Échapper.** Dans le texte XML, `&` doit devenir `&amp;` et `<` devient `&lt;` (et `>` devient `&gt;` par prudence) ; dans un
attribut entre guillemets, `"` devient `&quot;`. On échappe `&` **en premier**, sinon on réécrirait les `&` des entités produites.

```python exec
def echapper(texte):
    return texte.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")

def vers_xml(emprunts):
    lignes = ["<emprunts>"]
    for e in emprunts:
        rendu = "oui" if e["rendu"] else "non"
        lignes.append(f'  <emprunt id="{e["id"]}" rendu="{rendu}"><titre>{echapper(e["titre"])}</titre></emprunt>')
    lignes.append("</emprunts>")
    return "\n".join(lignes)

emprunts = [{"id": 1, "titre": "Tintin & Milou", "rendu": False}, {"id": 2, "titre": "Les Misérables", "rendu": True}]
xml = vers_xml(emprunts)
print(xml)

import xml.etree.ElementTree as ET                 # vérification : le document est bien formé
print(ET.fromstring(xml).find("emprunt/titre").text)
```

**4. Vérifier.** L'analyseur relit le document sans erreur et restitue « Tintin & Milou » : l'échappement est réversible. En pratique,
on laisse une bibliothèque (`ElementTree`, `json`) produire le texte, ce qui évite d'oublier un cas.

## L'essentiel

- JSON : objets `{"k": v}`, tableaux, chaînes en guillemets doubles, nombres, `true`/`false`/`null` ; pas de virgule finale ni de commentaire.
- `json.loads` (texte → Python) et `json.dumps` (Python → texte) ; les clés JSON sont toujours des chaînes.
- XML : balises inventées, une racine, balises fermées et imbriquées, attributs entre guillemets, `&lt;` et `&amp;` ; un document XML est un arbre.
- Bien formé (syntaxe) ≠ valide (conforme à une DTD ou un schéma XSD).
- `ElementTree` : `fromstring`, `find`, `findall`, `.text`, `.get(attribut)`.
- CSV pour une table, JSON pour les API et données imbriquées, XML pour des documents validés et des échanges normalisés.

## Exercices

::::exercice[JSON valide]{niveau=1}
Lequel de ces textes est du JSON valide ?

- [ ] `{'nom': 'Léa', 'age': 17}`
- [ ] `{"nom": "Léa", "age": 17,}`
- [x] `{"nom": "Léa", "notes": [12, 15.5], "delegue": false, "tuteur": null}`
- [ ] `{nom: "Léa", age: 17}`

:::corrige
Le premier utilise des guillemets simples, le deuxième a une virgule finale, le quatrième a des clés sans guillemets (autorisé en
JavaScript, pas en JSON). Le troisième est correct.
:::
::::

::::exercice[XML bien formé]{niveau=1}
Lequel de ces documents XML est bien formé ?

- [ ] `<eleve><nom>Léa</Nom></eleve>`
- [ ] `<eleve age=17><nom>Léa</nom></eleve>`
- [ ] `<nom>Léa</nom><nom>Hugo</nom>`
- [x] `<classe nom="1G2"><eleve>Léa</eleve><eleve>Hugo &amp; Inès</eleve><vide/></classe>`

:::corrige
Le premier ferme `</Nom>` alors que XML est sensible à la casse ; le deuxième a une valeur d'attribut sans guillemets ; le troisième a
deux éléments racines. Le dernier est correct : `&amp;` échappe le `&`, et `<vide/>` est un élément vide auto-fermant.
:::
::::

::::exercice[Exploiter une réponse JSON]{niveau=2}
Écris `moyennes(texte_json)` qui reçoit un texte JSON de la forme
`[{"nom": "Léa", "notes": [12, 16]}, …]` et renvoie un dictionnaire `{nom: moyenne}`, la moyenne étant arrondie à 2 décimales, ou
`None` si l'élève n'a pas de note.

```python depart
import json

def moyennes(texte_json):
    ...
```

```python tests
t = '[{"nom": "Léa", "notes": [12, 16]}, {"nom": "Hugo", "notes": [9, 11.5, 14]}, {"nom": "Inès", "notes": []}]'
assert moyennes(t) == {"Léa": 14.0, "Hugo": 11.5, "Inès": None}, "trois élèves"
assert moyennes("[]") == {}, "liste vide"
```

:::corrige
```python solution
import json

def moyennes(texte_json):
    resultat = {}
    for eleve in json.loads(texte_json):
        notes = eleve["notes"]
        resultat[eleve["nom"]] = round(sum(notes) / len(notes), 2) if notes else None
    return resultat
```
`json.loads` renvoie une liste de dictionnaires : on la parcourt comme n'importe quelle structure Python.
:::
::::

::::exercice[Interroger un document XML]{niveau=2}
Écris `titres_de(xml, realisateur)` qui renvoie la liste des titres (dans l'ordre du document) des films d'un réalisateur, à partir
d'un catalogue de la forme de la section 2 (`<catalogue><film annee="…"><titre>…</titre><realisateur>…</realisateur>…</film>…`).

```python depart
import xml.etree.ElementTree as ET

def titres_de(xml, realisateur):
    ...
```

```python tests
cat = """<catalogue>
<film annee="2001"><titre>Le Voyage de Chihiro</titre><realisateur>Hayao Miyazaki</realisateur></film>
<film annee="2009"><titre>Coraline</titre><realisateur>Henry Selick</realisateur></film>
<film annee="1997"><titre>Princesse Mononoké</titre><realisateur>Hayao Miyazaki</realisateur></film>
</catalogue>"""
assert titres_de(cat, "Hayao Miyazaki") == ["Le Voyage de Chihiro", "Princesse Mononoké"], "deux films"
assert titres_de(cat, "Agnès Varda") == [], "aucun film"
```

:::corrige
```python solution
import xml.etree.ElementTree as ET

def titres_de(xml, realisateur):
    racine = ET.fromstring(xml)
    return [f.find("titre").text for f in racine.findall("film")
            if f.find("realisateur").text == realisateur]
```
`findall("film")` donne les enfants directs `<film>` de la racine ; `find` renvoie le premier sous-élément de ce nom.
:::
::::

::::exercice[De JSON à XML]{niveau=3}
Écris `json_vers_xml(valeur, nom="racine")` qui convertit récursivement une valeur Python issue de JSON en texte XML (sans espaces ni
retours à la ligne) selon ces règles : un dictionnaire donne `<nom>` contenant un élément par clé (dans l'ordre) ; une liste donne
`<nom>` contenant un élément `<item>` par valeur ; `None` donne `<nom/>` ; les booléens donnent `true`/`false` ; tout autre valeur
donne `<nom>texte</nom>` avec le texte **échappé** (`&`, `<`, `>`).

```python depart
def json_vers_xml(valeur, nom="racine"):
    ...
```

```python tests
assert json_vers_xml(3, "n") == "<n>3</n>", "nombre"
assert json_vers_xml(None, "x") == "<x/>", "null"
assert json_vers_xml(True, "ok") == "<ok>true</ok>", "booléen"
assert json_vers_xml("a < b & c", "t") == "<t>a &lt; b &amp; c</t>", "échappement"
assert json_vers_xml([1, "a"], "l") == "<l><item>1</item><item>a</item></l>", "liste"
assert json_vers_xml({"film": {"titre": "Ran", "genres": ["drame"], "suite": None}}) == \
    "<racine><film><titre>Ran</titre><genres><item>drame</item></genres><suite/></film></racine>", "imbrication"
```

:::corrige
```python solution
def json_vers_xml(valeur, nom="racine"):
    if valeur is None:
        return f"<{nom}/>"
    if isinstance(valeur, dict):
        contenu = "".join(json_vers_xml(v, k) for k, v in valeur.items())
    elif isinstance(valeur, list):
        contenu = "".join(json_vers_xml(v, "item") for v in valeur)
    elif isinstance(valeur, bool):
        contenu = "true" if valeur else "false"
    else:
        contenu = str(valeur).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    return f"<{nom}>{contenu}</{nom}>"
```
Le test des booléens passe **avant** le cas général (sinon `str(True)` donnerait `True`) mais après celui des dictionnaires : `bool` est
une sous-classe d'`int`, pas de `dict`. La récursivité suit la structure d'arbre des deux formats. (Une clé JSON qui n'est pas un nom
XML valide, comme `"2e"`, poserait problème : une vraie conversion doit la renommer.)
:::
::::

::::exercice[Choisir un format pour un projet]{niveau=4 duree=20}
Des élèves de terminale développent une application qui affiche les horaires des bus autour du lycée. Ils récupèrent les données de la
métropole, publiées en trois formats : un fichier CSV des arrêts (nom, latitude, longitude), un flux JSON en temps réel des prochains
passages, et un fichier XML de référence des lignes (norme d'échange européenne, validée par un schéma XSD).

1. Pour chacun des trois jeux de données, expliquez pourquoi le format choisi par la métropole est pertinent.
2. Les élèves veulent stocker localement les arrêts favoris de l'utilisateur. Quel format conseillez-vous et pourquoi ?
3. Un élève propose de tout convertir en CSV « pour simplifier ». Quels problèmes cela poserait-il ?
4. Quelles notions du programme de NSI ce projet permet-il de travailler ?

:::criteres
- Justifications : arrêts = table simple (CSV) ; temps réel = données imbriquées échangées par une API web (JSON) ; référentiel normalisé = documents complexes validés par un schéma, échangés entre organismes (XML/XSD).
- Stockage des favoris : JSON (liste d'objets, `json.dump`/`json.load`, lisible, imbriqué si besoin) ou base SQLite, argumenté.
- Limites du CSV : pas d'imbrication (passages multiples par arrêt, lignes avec plusieurs arrêts), pas de types, perte de la validation par schéma, échappement des séparateurs.
- Notions : données en table, formats, requêtes HTTP / API, structures (dictionnaires, listes), tri et recherche, interface, géolocalisation (SNT).
:::

:::corrige
1. **Arrêts en CSV** : ce sont des données **tabulaires** (une ligne par arrêt, colonnes fixes), stables, lourdes en nombre de lignes : le
   CSV est compact et s'ouvre dans un tableur. **Passages en JSON** : la réponse d'une **API** interrogée en direct, imbriquée (un arrêt →
   plusieurs lignes → plusieurs horaires), consommée directement par JavaScript ou `json.loads`. **Référentiel en XML + XSD** : un format
   d'échange **normalisé** entre organismes, complexe (lignes, itinéraires, calendriers), dont la conformité est vérifiée par un schéma
   avant intégration.
2. **JSON** : une liste d'objets `{"id": "…", "nom": "…"}`, lue et écrite en une ligne (`json.load`, `json.dump`), lisible pour le
   débogage, extensible (ajouter une couleur, un ordre). Une petite base SQLite serait justifiée si l'on stockait aussi un historique à
   interroger.
3. Le CSV ne représente qu'une table : il faudrait aplatir les données imbriquées (une ligne par passage, en répétant l'arrêt, ou des
   colonnes `horaire1`, `horaire2`…), perdre les types (tout redevient texte), perdre la validation par le schéma, et gérer les
   séparateurs présents dans les noms (« Gare, quai 2 »). On simplifie le stockage mais on complique tout le reste.
4. Données en table (CSV, tri, filtres), formats JSON/XML et requêtes HTTP vers une API (client-serveur), dictionnaires et listes,
   algorithmes de recherche (arrêt le plus proche : distance, k plus proches voisins), interface homme-machine (événements), et en
   SNT la localisation et la cartographie.
:::
::::
