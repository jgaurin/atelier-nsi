-- Base « bibliotheque » : auteurs, livres, adhérents et emprunts d'une médiathèque (données fictives
-- pour les adhérents et les emprunts ; auteurs et titres réels, années de première publication).
-- Utilisée par les leçons et exercices SQL de l'Atelier NSI.

CREATE TABLE auteur (
  id_auteur   INTEGER PRIMARY KEY,
  nom         TEXT NOT NULL,
  prenom      TEXT,
  naissance   INTEGER,            -- année de naissance
  nationalite TEXT
);

CREATE TABLE livre (
  id_livre  INTEGER PRIMARY KEY,
  titre     TEXT NOT NULL,
  id_auteur INTEGER NOT NULL REFERENCES auteur(id_auteur),
  annee     INTEGER,               -- année de première publication
  genre     TEXT,
  pages     INTEGER                -- nombre de pages de l'exemplaire de la médiathèque
);

CREATE TABLE adherent (
  id_adherent INTEGER PRIMARY KEY,
  nom         TEXT NOT NULL,
  prenom      TEXT NOT NULL,
  email       TEXT UNIQUE,
  ville       TEXT,
  inscription TEXT NOT NULL        -- date AAAA-MM-JJ
);

CREATE TABLE emprunt (
  id_emprunt   INTEGER PRIMARY KEY,
  id_livre     INTEGER NOT NULL REFERENCES livre(id_livre),
  id_adherent  INTEGER NOT NULL REFERENCES adherent(id_adherent),
  date_emprunt TEXT NOT NULL,
  date_retour  TEXT                -- NULL tant que le livre n'est pas rendu
);

INSERT INTO auteur VALUES
  (1, 'Hugo', 'Victor', 1802, 'française'),
  (2, 'Camus', 'Albert', 1913, 'française'),
  (3, 'Orwell', 'George', 1903, 'britannique'),
  (4, 'Verne', 'Jules', 1828, 'française'),
  (5, 'Yourcenar', 'Marguerite', 1903, 'française'),
  (6, 'de Beauvoir', 'Simone', 1908, 'française'),
  (7, 'Asimov', 'Isaac', 1920, 'américaine'),
  (8, 'Shelley', 'Mary', 1797, 'britannique'),
  (9, 'de Saint-Exupéry', 'Antoine', 1900, 'française'),
  (10, 'Ernaux', 'Annie', 1940, 'française'),
  (11, 'Knuth', 'Donald', 1938, 'américaine');

INSERT INTO livre VALUES
  (1,  'Les Misérables', 1, 1862, 'roman', 1900),
  (2,  'Notre-Dame de Paris', 1, 1831, 'roman', 940),
  (3,  'L''Étranger', 2, 1942, 'roman', 185),
  (4,  'La Peste', 2, 1947, 'roman', 330),
  (5,  '1984', 3, 1949, 'science-fiction', 390),
  (6,  'La Ferme des animaux', 3, 1945, 'fable', 150),
  (7,  'Vingt mille lieues sous les mers', 4, 1870, 'aventure', 600),
  (8,  'Le Tour du monde en quatre-vingts jours', 4, 1872, 'aventure', 320),
  (9,  'Mémoires d''Hadrien', 5, 1951, 'roman', 360),
  (10, 'Le Deuxième Sexe', 6, 1949, 'essai', 1000),
  (11, 'Fondation', 7, 1951, 'science-fiction', 410),
  (12, 'Les Robots', 7, 1950, 'science-fiction', 320),
  (13, 'Frankenstein', 8, 1818, 'roman', 330),
  (14, 'Le Petit Prince', 9, 1943, 'conte', 100),
  (15, 'Les Années', 10, 2008, 'récit', 250);

INSERT INTO adherent VALUES
  (1, 'Benali', 'Sarah', 'sarah.benali@exemple.fr', 'Lyon', '2023-09-04'),
  (2, 'Nguyen', 'Minh', 'minh.nguyen@exemple.fr', 'Lyon', '2024-01-15'),
  (3, 'Lefèvre', 'Paul', 'paul.lefevre@exemple.fr', 'Villeurbanne', '2022-11-20'),
  (4, 'Diallo', 'Aminata', 'aminata.diallo@exemple.fr', 'Lyon', '2025-03-02'),
  (5, 'Roux', 'Camille', NULL, 'Vénissieux', '2024-06-30'),
  (6, 'Morel', 'Hugo', 'hugo.morel@exemple.fr', 'Villeurbanne', '2025-09-10'),
  (7, 'Garnier', 'Inès', 'ines.garnier@exemple.fr', 'Lyon', '2026-01-08');

INSERT INTO emprunt VALUES
  (1,  5,  1, '2026-09-01', '2026-09-20'),
  (2,  3,  1, '2026-09-21', NULL),
  (3,  11, 2, '2026-08-15', '2026-09-02'),
  (4,  12, 2, '2026-09-03', '2026-09-25'),
  (5,  5,  2, '2026-09-26', NULL),
  (6,  14, 3, '2026-07-10', '2026-07-12'),
  (7,  1,  3, '2026-08-01', '2026-09-30'),
  (8,  7,  4, '2026-09-05', '2026-09-19'),
  (9,  8,  4, '2026-09-20', NULL),
  (10, 10, 5, '2026-06-01', '2026-07-15'),
  (11, 4,  5, '2026-09-28', NULL),
  (12, 13, 6, '2026-09-15', '2026-10-01'),
  (13, 6,  6, '2026-10-02', NULL),
  (14, 14, 1, '2026-05-05', '2026-05-06'),
  (15, 11, 4, '2026-10-01', NULL);
