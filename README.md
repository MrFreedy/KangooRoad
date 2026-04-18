# KangooRoad

Application web de collecte et de consultation de feedbacks d'étudiants (mobilité internationale), avec espace utilisateur et administration.

## À quoi sert ce projet ?

KangooRoad permet de :
- remplir un formulaire multi-étapes de retour d'expérience ;
- consulter les feedbacks publiés avec filtres (année, école, pays, profil) ;
- administrer les sections du formulaire et les feedbacks (visibilité, édition, suppression) ;
- exporter un feedback en PDF.

## Stack technique

- **Frontend** : React + TypeScript + Vite + Tailwind
- **Backend** : Node.js + Express
- **Base de données** : PostgreSQL
- **Auth** : JWT (token Bearer)

## Structure du repo

```text
KangooRoad/
├─ frontend/   # application React
├─ backend/    # API Express
├─ db/
│  └─ init.sql # script d'initialisation PostgreSQL
└─ docker-compose.yaml
```

## Lancer le projet en local (sans Docker)

### 1) Prérequis

- Node.js 20+ (avec npm)
- PostgreSQL 14+

### 2) Installer les dépendances

```bash
cd frontend
npm install

cd ..\backend
npm install
```

### 3) Configurer les variables d'environnement

Créez un fichier **`backend/.env`** :

```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=kangooroad
DB_PASSWORD=postgres
DB_PORT=5432
JWT_SECRET=change-me-in-production
JWT_EXPIRES_IN= # Durée d'expiration du JWT (ex: 1h, 7d, 30m). Laisser vide = 1h par défaut.
```

Créez un fichier **`frontend/.env`** :

```env
VITE_API_URL=http://localhost:3002
```

### 4) Préparer la base PostgreSQL

Initialisez la base avec le script fourni :

```bash
psql -U postgres -d kangooroad -f .\db\init.sql
```

Adaptez `-U` et `-d` selon vos identifiants/nom de base.

### 5) Démarrer l'application

Terminal 1 (API) :

```bash
cd backend
npm run dev
```

Terminal 2 (Frontend) :

```bash
cd frontend
npm run dev
```

Accès :
- Frontend : `http://localhost:5173` (ou port affiché par Vite)
- API : `http://localhost:3002`

## Lancer avec Docker Compose (optionnel)

Les images Docker étant publiques, vous pouvez démarrer directement avec :

1. Créez un fichier **`.env`** à la racine du projet avec :

```env
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=
```

2. Lancez Docker Compose :

```bash
docker compose up --build -d
```

L'initialisation de la base se fait automatiquement au premier démarrage Docker.

## API (aperçu)

- `POST /users/login`
- `GET /users/me`
- `GET /sections`, `POST /sections`, `PUT /sections/:id`, `DELETE /sections/:id`
- `GET /questions`
- `GET /feedbacks`, `POST /feedbacks`, `PUT /feedbacks/:id`, `DELETE /feedbacks/:id`

La majorité des routes sont protégées par token JWT (`Authorization: Bearer <token>`).
