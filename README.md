text

# Tasks API (Express + PostgreSQL + JWT) — ESM

A simple REST API for daily tasks with user authentication (JWT) and task CRUD, built with Express (ES Modules) and PostgreSQL.

## Features

- Register + Login with hashed passwords (bcrypt)
- JWT-protected routes
- Tasks CRUD per user (users can access only their own tasks)
- Input validation (express-validator)
- Basic security middleware (helmet, cors) + rate limiting

## Tech Stack

- Node.js + Express (ESM)
- PostgreSQL
- pg (node-postgres)
- jsonwebtoken, bcryptjs
- express-validator, helmet, cors, express-rate-limit

## Project Structure

src/
app.js
server.js
db/
pool.js
middleware/
auth.js
validate.js
validators/
auth.js
tasks.js
controllers/
auth.js
tasks.js
routes/
auth.js
tasks.js

text

## Prerequisites

- Node.js 18+ recommended
- PostgreSQL running locally (or any hosted Postgres)

## Setup

### 1) Install dependencies

```bash
npm install


bash
npm i express dotenv pg jsonwebtoken bcryptjs express-validator helmet cors express-rate-limit
npm i -D nodemon
2) Create .env
Create a .env file in the project root:

text
PORT=3000
JWT_SECRET=change_me_in_production

DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/tasksdb
3) Create database schema
Connect with psql (or pgAdmin) and run:

sql
CREATE DATABASE tasksdb;
\c tasksdb

CREATE SCHEMA IF NOT EXISTS api;

CREATE TABLE api.users (
 id UUID PRIMARY KEY,
 email TEXT UNIQUE NOT NULL,
 password_hash TEXT NOT NULL,
 role TEXT NOT NULL DEFAULT 'user',
 created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE api.tasks (
 id UUID PRIMARY KEY,
 user_id UUID NOT NULL REFERENCES api.users(id) ON DELETE CASCADE,
 title TEXT NOT NULL,
 description TEXT NOT NULL DEFAULT '',
 completed BOOLEAN NOT NULL DEFAULT false,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX tasks_user_id_idx ON api.tasks(user_id);

Run

Development
bash
npm run dev

Production
bash
npm start

API Endpoints
Health
GET /health

Auth
POST /api/auth/register

Body: { "email": "a@a.com", "password": "password123" }

Returns: { token, user }

POST /api/auth/login

Body: { "email": "a@a.com", "password": "password123" }

Returns: { token, user }

Tasks (JWT required)
Send header:

text
Authorization: Bearer <token>
GET /api/tasks → list your tasks

POST /api/tasks → create task

Body: { "title": "Buy milk", "description": "optional" }

GET /api/tasks/:id → get one task (only if it’s yours)

PUT /api/tasks/:id → update task (only if it’s yours)

Body: { "title": "...", "description": "...", "completed": true } (any subset)

DELETE /api/tasks/:id → delete task (only if it’s yours)

Notes
Always use parameterized queries ($1, $2, ...) with pg to avoid SQL injection.

JWT_SECRET must be strong in production.

Rate limiting is enabled globally and stricter on /api/auth (recommended).

Common Issues
password authentication failed: check DATABASE_URL user/password and Postgres auth settings.

relation api.users does not exist: run the SQL schema in the correct database.

Invalid or expired token: login again and use the new token.
```
