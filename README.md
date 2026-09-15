# Task Management API

A full-stack task management application with a Node.js/Express REST API, JWT authentication, bcrypt password hashing, PostgreSQL persistence, and a React/Vite frontend.

## Stack

- Node.js and Express 5
- PostgreSQL via the `pg` connection pool
- JWT and bcryptjs authentication
- React, Vite, and React Router frontend
- Render-ready backend deployment

## Project Structure

```text
task-management-api/
├── src/
│   ├── controllers/
│   ├── database/
│   │   ├── migrations/001_initial.sql
│   │   └── database.js
│   ├── middleware/
│   └── routes/
├── task-management-frontend/
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── server.js
```

## Environment Variables

Copy `.env.example` to `.env` for local development. Never commit `.env`.

```env
PORT=3000
DATABASE_URL=postgresql://username:password@localhost:5432/task_management
JWT_SECRET=your_long_random_secret
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

- `PORT`: server port. Render supplies this value automatically.
- `DATABASE_URL`: PostgreSQL connection string from local PostgreSQL or Render.
- `JWT_SECRET`: long random secret used to sign JWTs.
- `FRONTEND_URL`: comma-separated allowed frontend origins, for example `http://localhost:5173,https://your-app.vercel.app`.
- `NODE_ENV`: use `production` on Render.

## Local PostgreSQL Setup

Install PostgreSQL locally, create a database, and set its connection string in `.env`.

Example with `psql`:

```bash
createdb task_management
```

Then set:

```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/task_management
```

The API automatically runs the SQL files in `src/database/migrations` when it starts. It records applied migrations in `schema_migrations`, so startup is safe to repeat.

Install and run the backend:

```bash
npm install
npm start
```

The API is available at `http://localhost:3000`.

Run the React frontend in a second terminal:

```bash
cd task-management-frontend
npm install
copy .env.example .env
npm run dev
```

On macOS/Linux, use `cp .env.example .env` instead of `copy`.

The frontend uses `VITE_API_URL` from `task-management-frontend/.env`; its local default is `http://localhost:3000/api`.

## Database Schema and Migrations

The initial migration creates:

- `users`: user identity, unique email, bcrypt password hash, and creation timestamp.
- `tasks`: task fields, owner foreign key, status constraint, creation/update timestamps, and an owner index.
- `schema_migrations`: applied migration versions.

Tasks reference users with `ON DELETE CASCADE`. Every task query filters by the authenticated user's ID, so users cannot read or modify another user's tasks.

Migrations run automatically on backend startup. Each migration runs inside a transaction and is recorded only after it succeeds.

## API Endpoints

### Register

`POST /api/auth/register`

```json
{"name":"Mohan","email":"mohan@example.com","password":"secret123"}
```

Returns `201` with the created user. Validation and duplicate email errors return `400`.

### Login

`POST /api/auth/login`

```json
{"email":"mohan@example.com","password":"secret123"}
```

Returns `200` with a JWT and user. Missing input returns `400`; invalid credentials return `401`.

Send the token for task requests:

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

### Tasks

- `POST /api/tasks` creates a task and returns `201`.
- `GET /api/tasks` returns the authenticated user's tasks and `200`.
- `GET /api/tasks/:id` returns one owned task and `200`.
- `PUT /api/tasks/:id` updates `title`, `description`, and/or `status` and returns `200`.
- `DELETE /api/tasks/:id` deletes one owned task and returns `200`.

Valid statuses are `pending`, `in-progress`, and `completed`. Invalid input returns `400`, missing/invalid authentication returns `401`, and an unavailable task returns `404`.

`GET /` returns an API status response. Unknown routes return `404`. Unexpected server/database errors return `500`.

## Render Deployment

1. Push this repository to GitHub.
2. In Render, create a **PostgreSQL** database.
3. In Render, create a **Web Service** from the GitHub repository.
4. Use these service settings:
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Root Directory:** leave blank because the backend is at the repository root.
5. Add these environment variables to the Render web service:
   - `DATABASE_URL`: the internal connection string from the Render PostgreSQL database.
   - `JWT_SECRET`: a new long random production secret.
   - `FRONTEND_URL`: the deployed React/Vercel URL, such as `https://your-app.vercel.app`.
   - `NODE_ENV=production`
6. Deploy. The server listens on Render's `PORT`, connects to PostgreSQL, and runs pending migrations during startup.
7. Verify `https://your-api.onrender.com/` returns the API status response.

Do not put database credentials, JWT secrets, or `.env` files in GitHub. Render environment variables are the production source of truth.

## React/Vercel Connection

In the frontend project, create a Vercel environment variable:

```env
VITE_API_URL=https://your-api.onrender.com/api
```

Redeploy the frontend after adding or changing it. Set the backend `FRONTEND_URL` to the exact Vercel origin, without a trailing path. Multiple origins can be comma-separated.

No endpoint or response changes are required in the existing React frontend; it continues to use the `/api/auth` and `/api/tasks` contracts.

## Validation Checklist

With PostgreSQL running and `.env` configured, test:

1. Register a user.
2. Log in and copy the JWT.
3. Create an authenticated task.
4. List tasks.
5. Get one task.
6. Update the task.
7. Delete the task.
8. Call a protected endpoint without a token and confirm `401`.
9. Send invalid registration/task data and confirm `400`.

Frontend production build:

```bash
cd task-management-frontend
npm run build
```
