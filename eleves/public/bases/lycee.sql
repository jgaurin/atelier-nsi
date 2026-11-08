-- Base « lycee » : classes, élèves, matières et notes d'un petit lycée (données fictives).
-- Utilisée par les leçons et exercices SQL de l'Atelier NSI.

CREATE TABLE classe (
  id_classe TEXT PRIMARY KEY,          -- par exemple '1G2'
  niveau    TEXT NOT NULL,             -- 'Seconde', 'Première' ou 'Terminale'
  salle     TEXT
);

CREATE TABLE eleve (
  id_eleve  INTEGER PRIMARY KEY,
  nom       TEXT NOT NULL,
  prenom    TEXT NOT NULL,
  naissance TEXT,                      -- date au format AAAA-MM-JJ, parfois inconnue (NULL)
  id_classe TEXT REFERENCES classe(id_classe)
);

CREATE TABLE matiere (
  id_matiere  INTEGER PRIMARY KEY,
  intitule    TEXT NOT NULL UNIQUE,
  coefficient INTEGER NOT NULL CHECK (coefficient > 0)
);

CREATE TABLE note (
  id_note    INTEGER PRIMARY KEY,
  id_eleve   INTEGER NOT NULL REFERENCES eleve(id_eleve),
  id_matiere INTEGER NOT NULL REFERENCES matiere(id_matiere),
  valeur     REAL NOT NULL CHECK (valeur BETWEEN 0 AND 20),
  date_eval  TEXT NOT NULL
);

INSERT INTO classe VALUES
  ('2D1', 'Seconde', 'B104'),
  ('2D2', 'Seconde', 'B106'),
  ('2D3', 'Seconde', 'B108'),
  ('1G1', 'Première', 'C201'),
  ('1G2', 'Première', 'C203'),
  ('TG1', 'Terminale', 'C301'),
  ('TG2', 'Terminale', NULL);

INSERT INTO eleve VALUES
  (1,  'Martin',   'Léa',     '2010-03-14', '2D1'),
  (2,  'Bernard',  'Hugo',    '2010-07-02', '2D1'),
  (3,  'Dubois',   'Inès',    '2009-11-23', '2D1'),
  (4,  'Thomas',   'Nathan',  '2010-01-30', '2D2'),
  (5,  'Robert',   'Chloé',   NULL,         '2D2'),
  (6,  'Richard',  'Lucas',   '2009-05-17', '1G1'),
  (7,  'Petit',    'Manon',   '2009-09-09', '1G1'),
  (8,  'Durand',   'Adam',    '2008-12-01', '1G1'),
  (9,  'Leroy',    'Jade',    '2009-02-11', '1G2'),
  (10, 'Moreau',   'Gabriel', '2009-06-25', '1G2'),
  (11, 'Simon',    'Louise',  '2008-04-04', 'TG1'),
  (12, 'Laurent',  'Raphaël', '2008-08-19', 'TG1'),
  (13, 'Lefebvre', 'Emma',    '2007-10-30', 'TG1'),
  (14, 'Michel',   'Arthur',  '2008-02-14', 'TG1'),
  (15, 'Garcia',   'Alice',   NULL,         'TG2'),
  (16, 'David',    'Louis',   '2008-06-06', NULL);

INSERT INTO matiere VALUES
  (1, 'Mathématiques', 4),
  (2, 'NSI', 4),
  (3, 'Physique-chimie', 3),
  (4, 'Français', 3),
  (5, 'Anglais', 2);

INSERT INTO note VALUES
  (1,  1, 1, 14.5, '2026-09-20'), (2,  1, 4, 12,   '2026-09-25'), (3,  1, 5, 16,   '2026-10-02'),
  (4,  2, 1, 9,    '2026-09-20'), (5,  2, 4, 11.5, '2026-09-25'), (6,  2, 5, 8,    '2026-10-02'),
  (7,  3, 1, 17,   '2026-09-20'), (8,  3, 3, 15,   '2026-09-28'), (9,  3, 4, 13,   '2026-09-25'),
  (10, 4, 1, 11,   '2026-09-21'), (11, 4, 3, 10,   '2026-09-28'), (12, 4, 5, 13.5, '2026-10-02'),
  (13, 5, 1, 7.5,  '2026-09-21'), (14, 5, 4, 14,   '2026-09-26'),
  (15, 6, 1, 15,   '2026-09-22'), (16, 6, 2, 18,   '2026-09-24'), (17, 6, 3, 12,   '2026-09-29'), (18, 6, 4, 10, '2026-10-01'),
  (19, 7, 1, 12.5, '2026-09-22'), (20, 7, 2, 16,   '2026-09-24'), (21, 7, 5, 17,   '2026-10-03'),
  (22, 8, 1, 6,    '2026-09-22'), (23, 8, 2, 9.5,  '2026-09-24'), (24, 8, 3, 8,    '2026-09-29'),
  (25, 9, 1, 13,   '2026-09-23'), (26, 9, 2, 14,   '2026-09-24'), (27, 9, 4, 15.5, '2026-10-01'),
  (28, 10, 2, 19,  '2026-09-24'), (29, 10, 3, 16,  '2026-09-29'), (30, 10, 5, 12,  '2026-10-03'),
  (31, 11, 1, 18,  '2026-09-23'), (32, 11, 2, 17.5,'2026-09-25'), (33, 11, 3, 14,  '2026-09-30'), (34, 11, 4, 11, '2026-10-02'),
  (35, 12, 1, 10,  '2026-09-23'), (36, 12, 2, 12,  '2026-09-25'), (37, 12, 5, 9,   '2026-10-04'),
  (38, 13, 1, 16,  '2026-09-23'), (39, 13, 2, 20,  '2026-09-25'), (40, 13, 3, 17,  '2026-09-30'),
  (41, 14, 1, 8.5, '2026-09-23'), (42, 14, 2, 11,  '2026-09-25'), (43, 14, 4, 9,   '2026-10-02'),
  (44, 15, 1, 12,  '2026-09-24'), (45, 15, 2, 15,  '2026-09-26');
