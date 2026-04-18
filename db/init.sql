-- Users
CREATE TABLE users (
    id          SERIAL PRIMARY KEY,
    username    VARCHAR(255) UNIQUE NOT NULL,
    email       VARCHAR(255) UNIQUE NOT NULL,
    password    VARCHAR(255) NOT NULL,
    is_admin    BOOLEAN DEFAULT FALSE,
    last_login  TIMESTAMP,
    last_login_ip VARCHAR(45)
);

-- Sections
CREATE TABLE sections (
    id        SERIAL PRIMARY KEY,
    name      VARCHAR(255) NOT NULL,
    "order"   INTEGER,
    is_active BOOLEAN DEFAULT TRUE
);

-- Questions
CREATE TABLE questions (
    id         SERIAL PRIMARY KEY,
    section_id INTEGER REFERENCES sections(id),
    label      TEXT NOT NULL
);

-- Feedbacks
CREATE TABLE feedbacks (
    id         SERIAL PRIMARY KEY,
    form_data  JSONB NOT NULL,
    school     VARCHAR(255),
    year       VARCHAR(10),
    city       VARCHAR(255),
    country    VARCHAR(255),
    user_type  VARCHAR(100),
    is_contact BOOLEAN DEFAULT FALSE,
    firstname  VARCHAR(255),
    lastname   VARCHAR(255),
    email      VARCHAR(255),
    is_visible BOOLEAN DEFAULT TRUE
);