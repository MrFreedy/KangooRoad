![logo light](https://raw.githubusercontent.com/MrFreedy/KangooRoad/master/frontend/src/assets/logo.svg#gh-dark-mode-only)
![logo dark](https://raw.githubusercontent.com/MrFreedy/KangooRoad/master/frontend/src/assets/logo-dark.svg#gh-light-mode-only)

Application web de collecte et de consultation de feedbacks d'étudiants (mobilité internationale), avec un espace utilisateur et un espace admin. Accessible [ici](http://168.231.87.179:4173/)

## À quoi sert le projet ?

KangooRoad permet de :
- remplir un formulaire multi-étapes de retour d'expérience ;
- consulter les feedbacks publiés avec filtres (année, école, pays, profil) ;
- administrer les sections et les feedbacks (visibilité, édition, suppression) ;
- exporter un feedback en PDF.

## Stack technique

- **Frontend** : React + TypeScript + Vite + Tailwind
- **Backend** : Node.js + Express
- **Base de données** : PostgreSQL
- **Authentification** : JWT (Bearer token)

## Structure du repo

```text
KangooRoad/
├─ frontend/   # application React
├─ backend/    # API Express
├─ db/
│  └─ init.sql # script d'initialisation PostgreSQL
└─ docker-compose.yaml
```

## Prérequis

### Local (hors Docker)
- Node.js 20+ (avec npm)
- PostgreSQL 14+

### Docker
- Docker
- Docker Compose

## Configuration des fichiers `.env` (à faire avant lancement)

### 1) Pour un lancement local (hors Docker)

Créez **`backend/.env`** :

```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=kangooroad
DB_PASSWORD=postgres
DB_PORT=5432
JWT_SECRET=change-me-in-production
JWT_EXPIRES_IN=1h
```

Créez **`frontend/.env`** :

```env
VITE_API_URL=http://localhost:3002
```

### 2) Pour un lancement Docker

Créez **`.env`** à la racine du projet :

```env
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=
```

Dans **`backend/.env`**, utilisez :

```env
DB_HOST=db
```

## Lancer le projet en local (sans Docker)

1. Installer les dépendances :

```bash
cd frontend
npm install

cd ..\backend
npm install
```

2. Initialiser la base de données :

```bash
psql -U postgres -d kangooroad -f .\db\init.sql
```

3. Démarrer l'application :

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

## Lancer avec Docker Compose

Les images étant publiques, lancez simplement :

```bash
docker compose up --build -d
```

L'initialisation de la base est automatique au premier démarrage Docker.

## API (aperçu)

- `POST /users/login`
- `GET /users/me`
- `GET /sections`, `POST /sections`, `PUT /sections/:id`, `DELETE /sections/:id`
- `GET /questions`
- `GET /feedbacks`, `POST /feedbacks`, `PUT /feedbacks/:id`, `DELETE /feedbacks/:id`

La majorité des routes sont protégées par JWT (`Authorization: Bearer <token>`).
