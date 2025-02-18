CREATE TABLE aquatica(
    id INTEGER PRIMARY KEY,
    nome text NOT NULL,
    email text NOT NULL UNIQUE,
    senha text NOT NULL
);