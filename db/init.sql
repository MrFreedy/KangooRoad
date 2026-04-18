-- ============================================================
-- KANGOOROAD - init.sql
-- ============================================================
 
-- Users
CREATE TABLE users (
    id            SERIAL PRIMARY KEY,
    username      VARCHAR(255) UNIQUE NOT NULL,
    email         VARCHAR(255),
    password      VARCHAR(255) NOT NULL,
    is_admin      BOOLEAN DEFAULT FALSE,
    last_login    DATE,
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
    id           SERIAL PRIMARY KEY,
    section_id   INTEGER REFERENCES sections(id),
    type         VARCHAR(50) NOT NULL,
    content      TEXT NOT NULL,
    options      JSONB,
    "order"      INTEGER,
    is_mandatory BOOLEAN DEFAULT TRUE,
    is_details   BOOLEAN DEFAULT FALSE
);
 
-- Feedbacks
CREATE TABLE feedbacks (
    id              SERIAL PRIMARY KEY,
    form_data       JSONB NOT NULL,
    is_visible      BOOLEAN DEFAULT TRUE,
    submission_date DATE,
    school          VARCHAR(255),
    year            INTEGER,
    city            VARCHAR(255),
    country         VARCHAR(255),
    user_type       VARCHAR(100),
    is_contact      BOOLEAN DEFAULT FALSE,
    firstname       VARCHAR(255),
    lastname        VARCHAR(255),
    email           VARCHAR(255)
);
 
-- ============================================================
-- DONNÉES
-- ============================================================
 
-- Users
INSERT INTO public.users (id, username, password, is_admin, last_login, last_login_ip) VALUES (1, 'mrfreedy', '$2a$12$5dEfy9NiIazLa2fdFRFmN.teztmx2dExadLcUr4Ja7n3D14jTzDDC', true, '2026-04-18', '78.124.117.76');
 
-- Sections
INSERT INTO public.sections (id, name, "order", is_active) VALUES (10, 'Photos et Vidéos 🖼️', 10, true);
INSERT INTO public.sections (id, name, "order", is_active) VALUES (3, 'Détails des Démarches Administratives 📋', 3, true);
INSERT INTO public.sections (id, name, "order", is_active) VALUES (6, 'Culture et Coutumes Locales 🏺', 6, true);
INSERT INTO public.sections (id, name, "order", is_active) VALUES (5, 'Vie Sociale et Intégration 👥', 5, true);
INSERT INTO public.sections (id, name, "order", is_active) VALUES (9, 'Évaluation Générale et Suggestions 💯', 9, true);
INSERT INTO public.sections (id, name, "order", is_active) VALUES (7, 'Logement 🏠', 7, true);
INSERT INTO public.sections (id, name, "order", is_active) VALUES (8, 'Coût de la Vie 💶', 8, true);
INSERT INTO public.sections (id, name, "order", is_active) VALUES (4, 'Aspects Académiques 🏫', 4, true);
INSERT INTO public.sections (id, name, "order", is_active) VALUES (1, 'Informations Personnelles 👤', 1, false);
INSERT INTO public.sections (id, name, "order", is_active) VALUES (2, 'Informations sur la mobilité 🗺️', 2, true);
 
-- Questions
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (5, 1, 'select', 'Quel était votre âge au moment de la mobilité ?', '["18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30"]', 5, true, false);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (6, 1, 'select', 'Campus 3iL', '["Rodez", "Limoges", "Nantes"]', 6, true, false);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (7, 1, 'select', 'Quel était votre statut étudiant ?', '["Alternant", "Etudiant (cycle initial)"]', 7, true, false);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (8, 2, 'text', 'Pays', null, 1, true, true);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (9, 2, 'text', 'Ville', null, 2, true, true);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (10, 2, 'text', 'Établissement d''accueil', null, 3, true, true);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (11, 2, 'select', 'Type de programme', '["Erasmus", "Echange bilatéral", "Cohorte"]', 4, true, false);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (12, 2, 'date', 'Date de début', null, 5, true, true);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (13, 2, 'date', 'Date de fin', null, 6, true, true);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (14, 2, 'select', 'Moyen de transport pour vous rendre à votre destination', '["Avion", "Train", "Voiture", "Autre"]', 7, true, true);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (15, 2, 'number', 'Prix aller-retour (€)', null, 8, true, false);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (16, 2, 'select', 'Langue d''enseignement', '["Anglais", "Espagnol", "Français", "Autre"]', 9, true, true);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (17, 3, 'select', 'Un passeport est-il obligatoire ?', '["Oui", "Non"]', 1, true, false);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (18, 3, 'select', 'Une durée minimum restante de validité est-elle nécessaire ?', '["Oui", "Non"]', 2, true, true);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (19, 3, 'select', 'Un visa est-il obligatoire ?', '["Oui", "Non"]', 3, true, true);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (20, 3, 'select', 'Avez-vous dû réaliser des démarches pour être autoriser à conduire (permis de conduire)', '["Oui", "Non"]', 4, true, true);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (21, 3, 'select', 'Y''a-t-il des vaccinations obligatoires ?', '["Oui", "Non"]', 5, true, true);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (22, 3, 'select', 'Avez-vous dû souscrire à une assurance spécifique logement ?', '["Oui", "Non"]', 6, true, true);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (23, 3, 'select', 'Avez-vous dû réaliser des démarches particulières pour votre carte bancaire ?', '["Oui", "Non"]', 7, true, true);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (24, 3, 'select', 'Si alternant,  avez-vous eu une mise en veille de votre contrat d''apprentissage ?', '["Oui", "Non"]', 8, true, false);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (25, 3, 'select', 'Avez-vous bénéficier d''aides financières ?', '["Oui", "Non"]', 9, true, true);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (26, 3, 'select', 'Avez-vous dû souscrire à une assurance de santé locale ?', '["Oui", "Non"]', 10, true, true);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (27, 3, 'select', 'Avez-vous souscris une assurance complémentaire de rapatriement ?', '["Oui", "Non"]', 11, true, true);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (28, 3, 'select', 'Avez-vous enregistrer votre séjour sur le site du gouvernement français (Fil d''Ariane)?', '["Oui", "Non"]', 12, true, false);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (29, 3, 'select', 'Avez-vous dû vous enregistrer auprès des autorités locales ?', '["Oui", "Non"]', 13, true, true);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (30, 3, 'select', 'Avez-vous souscrit un abonnement de téléphonie mobile spécifique ?', '["Oui", "Non"]', 14, true, true);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (31, 4, 'dynamic', 'Cours suivis', '{"dynamic": [{"type": "text", "label": "Nom du cours", "mandatory": true}, {"type": "textarea", "label": "Description du cours", "mandatory": true}, {"type": "textarea", "label": "Avis du cours", "mandatory": true}, {"type": "rating", "label": "Notez ce cours", "mandatory": true, "rating_type": "note"}]}', 1, true, true);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (32, 4, 'rating', 'Évaluation de l''enseignement', '{"rating_type": "note"}', 2, true, true);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (33, 4, 'number', 'Heures hebdomadaires de cours', null, 3, true, false);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (34, 4, 'select', 'Avez-vous reçu un soutien académique ?', '["Oui", "Non"]', 4, true, true);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (35, 4, 'rating', 'Évaluation de la facilité d''intégration académique', '{"rating_type": "note"}', 5, true, true);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (36, 4, 'select', 'Avez-vous rencontré des difficultés scolaires ?', '["Oui", "Non"]', 6, true, true);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (37, 4, 'select', 'Avez-vous validé votre mobilité ?', '["Oui", "Non"]', 7, true, false);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (38, 5, 'rating', 'Facilité d''intégration avec les étudiants locaux et internationaux', '{"rating_type": "note"}', 1, true, true);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (39, 5, 'select', 'Activités d''accueil pour les étudiants étrangers', '["Oui", "Non"]', 2, true, true);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (40, 5, 'select', 'Possibilité de participer à des clubs et associations étudiantes', '["Oui", "Non"]', 3, true, true);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (41, 5, 'select', 'Avez-vous contribuer à un club ou une association étudiante ?', '["Oui", "Non"]', 4, true, true);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (42, 5, 'rating', 'Évaluation de la vie sociale étudiante', '{"rating_type": "note"}', 5, true, true);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (43, 5, 'textarea', 'Vos conseils d''intégration pour les futurs étudiants', null, 6, false, true);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (44, 6, 'rating', 'Comment évalueriez-vous l''accueil des habitants envers les étudiants étrangers ?', '{"rating_type": "note"}', 1, true, true);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (45, 6, 'select', 'Avez-vous participé à des activités ou événements culturels locaux ?', '["Oui", "Non"]', 2, true, true);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (46, 6, 'select', 'Avez-vous trouvé certaines coutumes ou traditions locales particulièrement intéressantes ou surprenantes ?', '["Oui", "Non"]', 3, true, true);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (47, 6, 'rating', 'Comment s''est passée votre adaptation aux habitudes de vie locales ?', '{"rating_type": "note"}', 4, true, true);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (48, 6, 'select', 'Avez-vous découvert des plats ou des spécialités locales ?', '["Oui", "Non"]', 5, true, true);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (49, 6, 'select', 'Avez-vous remarqué des différences sociales ou religieuses importantes ?', '["Oui", "Non"]', 6, true, true);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (50, 6, 'textarea', 'Quels conseils donneriez-vous pour une adaptation culturelle réussie ?', null, 7, false, true);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (51, 6, 'select', 'Y a-t-il des ressources qui vous ont aidé à comprendre la culture locale ?', '["Oui", "Non"]', 8, false, true);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (52, 7, 'number', 'Coût mensuel du logement', null, 1, true, true);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (53, 7, 'rating', 'Facilité de trouver un logement', '{"rating_type": "note"}', 3, true, true);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (54, 7, 'select', 'Type de logement', '["Résidence universitaire", "Colocation", "Logement privé", "Famille d''accueil", "Autre"]', 2, true, false);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (55, 7, 'textarea', 'Comment évalueriez vous le coût ? Bon rapport qualité/prix ?', null, 4, false, true);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (56, 7, 'rating', 'Qualité du logement et des installations', '{"rating_type": "note"}', 5, true, true);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (57, 7, 'rating', 'Confort et équipements du logement', '{"rating_type": "note"}', 6, true, true);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (58, 7, 'rating', 'Proximité des transports', '{"rating_type": "note"}', 7, true, true);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (59, 7, 'rating', 'Proximité des commerces', '{"rating_type": "note"}', 8, true, true);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (60, 7, 'rating', 'Sécurité du logement et du quartier', '{"rating_type": "note"}', 9, true, true);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (61, 7, 'textarea', 'Conseils ou recommandations pour trouver un logement similaire', null, 10, false, true);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (62, 8, 'number', 'Budget mensuel total (estimation en €)', null, 1, true, true);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (63, 8, 'select', 'Coût des courses alimentaires et des repas', '["Très bas", "Bas", "Modéré", "Elevé", "Très élevé"]', 2, true, false);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (64, 8, 'textarea', 'Exemple de dépenses alimentaires, bons plans, etc.', null, 3, false, true);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (78, 8, 'select', 'Coût des activités de loisirs et sorties', '["Très bas", "Bas", "Modéré", "Elevé", "Très élevé"]', 4, true, false);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (79, 8, 'textarea', 'Suggestions d''activités abordables ou gratuites', null, 5, false, true);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (80, 8, 'select', 'Coût des services (internet, téléphone, etc.)', '["Très bas", "Bas", "Modéré", "Elevé", "Très élevé"]', 6, true, false);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (81, 8, 'textarea', 'Détails sur les abonnements internet, téléphonie, etc.', null, 7, false, true);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (82, 8, 'select', 'Coût des transports (prix des tickets, abonnement étudiant)', '["Très bas", "Bas", "Modéré", "Elevé", "Très élevé"]', 8, true, false);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (83, 8, 'textarea', 'Suggestions pour réduire les coûts de transport', null, 9, false, true);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (84, 8, 'select', 'Évaluation du coût de la vie par rapport au pays d''origine', '["Très bas", "Bas", "Modéré", "Elevé", "Très élevé"]', 10, true, false);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (92, 9, 'rating', 'Satisfaction générale de l''expérience', '{"rating_type": "note"}', 1, true, true);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (93, 9, 'textarea', 'Recommandations pour améliorer le programme de mobilité', null, 2, false, true);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (94, 9, 'textarea', 'Impact de l''expérience sur vos perspectives académiques et personnelles', null, 3, false, true);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (95, 9, 'textarea', 'Points forts de votre expérience', null, 4, false, true);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (96, 9, 'textarea', 'Défis ou difficultés rencontrées', null, 5, false, true);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (97, 9, 'select', 'Recommanderiez-vous cette mobilité à d''autres étudiants ?', '["Absolument pas", "Probablement", "Absolument"]', 6, true, false);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (98, 10, 'file', 'Si vous souhaitez partager des photos/vidéos de votre mobilité', null, 1, false, true);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (1, 1, 'text', 'Nom', null, 1, true, false);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (2, 1, 'text', 'Prénom', null, 2, true, false);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (3, 1, 'email', 'Email', null, 3, false, false);
INSERT INTO public.questions (id, section_id, type, content, options, "order", is_mandatory, is_details) VALUES (4, 1, 'checkbox', 'En cochant cette case, j''accepte d''être contacté(e) par des étudiants pour partager des informations et des retours d''expérience.', '[]', 4, false, false);
 
-- Feedbacks (données réelles)
INSERT INTO public.feedbacks (id, form_data, is_visible, submission_date, school, year, city, country, user_type, is_contact, firstname, lastname, email) VALUES (6, '[{"questions": []}]', true, '2024-11-26', 'NDHU', 2024, 'Hualien', 'Taïwan', 'alternant', false, null, null, null);
INSERT INTO public.feedbacks (id, form_data, is_visible, submission_date, school, year, city, country, user_type, is_contact, firstname, lastname, email) VALUES (1, '[{"questions": []}]', true, '2024-11-11', 'UQAC', 2024, 'Chicoutimi', 'Canada', 'alternant', true, 'Manon', 'Famery', 'manonfamery21@gmail.com');
INSERT INTO public.feedbacks (id, form_data, is_visible, submission_date, school, year, city, country, user_type, is_contact, firstname, lastname, email) VALUES (10, '[{"questions": []}]', true, '2024-11-28', 'UQO', 2023, 'Gatineau', 'Canada', 'alternant', false, null, null, null);
INSERT INTO public.feedbacks (id, form_data, is_visible, submission_date, school, year, city, country, user_type, is_contact, firstname, lastname, email) VALUES (17, '[{"questions": []}]', true, '2025-02-25', 'UQO', 2024, 'Gatineau', 'Canada', 'alternant', false, null, null, null);
INSERT INTO public.feedbacks (id, form_data, is_visible, submission_date, school, year, city, country, user_type, is_contact, firstname, lastname, email) VALUES (16, '[{"questions": []}]', true, '2025-02-23', 'Université de Tartu', 2024, 'Tartu', 'Estonie', 'alternant', true, 'Lucas', 'Vogel', 'lucas.vogel007@hotmail.fr');
INSERT INTO public.feedbacks (id, form_data, is_visible, submission_date, school, year, city, country, user_type, is_contact, firstname, lastname, email) VALUES (9, '[{"questions": []}]', true, '2024-11-27', 'UQAC', 2024, 'Chicoutimi', 'Canada', 'alternant', true, 'Loïc', 'CHARRIE', 'loic.charrie.12@gmail.com');
INSERT INTO public.feedbacks (id, form_data, is_visible, submission_date, school, year, city, country, user_type, is_contact, firstname, lastname, email) VALUES (13, '[{"questions": []}]', true, '2025-02-13', 'UQO', 2023, 'Gatineau', 'Canada', 'alternant', true, 'Géraldine', 'JUERY', 'geraldinejuery.pro@gmail.com');
INSERT INTO public.feedbacks (id, form_data, is_visible, submission_date, school, year, city, country, user_type, is_contact, firstname, lastname, email) VALUES (11, '[{"questions": []}]', true, '2025-01-28', 'UHU Huelva', 2022, 'Huelva', 'Espagne', 'alternant', true, 'Wendy', 'ROSIER', 'rosier.wendy98@gmail.com');
INSERT INTO public.feedbacks (id, form_data, is_visible, submission_date, school, year, city, country, user_type, is_contact, firstname, lastname, email) VALUES (7, '[{"questions": []}]', true, '2024-11-26', 'UQAC', 2022, 'Chicoutimi', 'Canada', 'alternant', false, null, null, null);
INSERT INTO public.feedbacks (id, form_data, is_visible, submission_date, school, year, city, country, user_type, is_contact, firstname, lastname, email) VALUES (8, '[{"questions": []}]', true, '2024-11-26', 'UPB', 2022, 'Bucarest', 'Roumanie', 'alternant', true, 'Florian', 'DEWAILLY', 'dewaillymontet.pro@gmail.com');
INSERT INTO public.feedbacks (id, form_data, is_visible, submission_date, school, year, city, country, user_type, is_contact, firstname, lastname, email) VALUES (14, '[{"questions": []}]', true, '2025-02-22', 'UTS Sofia', 2024, 'Sofia', 'Bulgarie', 'alternant', true, 'Dorian', 'Nunez', 'doriannunez64@gmail.com');
INSERT INTO public.feedbacks (id, form_data, is_visible, submission_date, school, year, city, country, user_type, is_contact, firstname, lastname, email) VALUES (15, '[{"questions": []}]', true, '2025-02-22', 'Henallux', 2024, 'Namur', 'Belgique', 'alternant', false, null, null, null);
INSERT INTO public.feedbacks (id, form_data, is_visible, submission_date, school, year, city, country, user_type, is_contact, firstname, lastname, email) VALUES (12, '[{"questions": []}]', true, '2025-01-30', 'Université de Maribor', 2023, 'Maribor', 'Slovénie', 'alternant', true, 'Wassim', 'Mzouri', 'mzouri.wassim@gmail.com');
INSERT INTO public.feedbacks (id, form_data, is_visible, submission_date, school, year, city, country, user_type, is_contact, firstname, lastname, email) VALUES (18, '[{"questions": []}]', true, '2025-04-01', 'Riga Technical University', 2024, 'Riga', 'Lettonie', 'alternant', true, 'Nicolas', 'Ferraye', 'ferraye.nicolas@sfr.fr');
INSERT INTO public.feedbacks (id, form_data, is_visible, submission_date, school, year, city, country, user_type, is_contact, firstname, lastname, email) VALUES (3, '[{"questions": []}]', true, '2024-11-21', 'UQAC', 2023, 'Chicoutimi', 'Canada', 'alternant', true, 'Sam', 'Courchia', 'sam.courchia0@gmail.com');
INSERT INTO public.feedbacks (id, form_data, is_visible, submission_date, school, year, city, country, user_type, is_contact, firstname, lastname, email) VALUES (5, '[{"questions": []}]', true, '2024-11-22', 'UQO', 2024, 'Gatineau', 'Canada', 'alternant', false, null, null, null);
INSERT INTO public.feedbacks (id, form_data, is_visible, submission_date, school, year, city, country, user_type, is_contact, firstname, lastname, email) VALUES (4, '[{"questions": []}]', true, '2024-11-21', 'UQAC', 2024, 'Chicoutimi', 'Canada', 'alternant', true, 'Marius', 'Garnier', 'garnierm@3il.fr');
INSERT INTO public.feedbacks (id, form_data, is_visible, submission_date, school, year, city, country, user_type, is_contact, firstname, lastname, email) VALUES (2, '[{"questions": []}]', true, '2024-11-14', 'UQO', 2023, 'Gatineau', 'Canada', 'alternant', true, 'Alexis', 'Ruel', 'alexis.rue@protonmail.com');
 
-- Réinitialisation des séquences
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('sections_id_seq', (SELECT MAX(id) FROM sections));
SELECT setval('questions_id_seq', (SELECT MAX(id) FROM questions));
SELECT setval('feedbacks_id_seq', (SELECT MAX(id) FROM feedbacks));