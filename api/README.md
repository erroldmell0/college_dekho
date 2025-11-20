# College Dekho — ESM API

This is a minimal Express.js API using ES modules (Node ESM). It is intended as a lightweight example and can be extended to use a real MongoDB-backed data layer.

Quick start

1. Copy and edit `.env.example` to create `.env` (set `MONGO_URI` if you want DB connectivity):

```bash
````markdown
# College Dekho — ESM API

This is a minimal Express.js API using ES modules (Node ESM). It is intended as a lightweight example and can be extended to use a real MongoDB-backed data layer.

Quick start

1. Copy and edit `.env.example` to create `.env` (set `MONGO_URI` if you want DB connectivity):

```bash
cd api
cp .env.example .env
# edit .env
```

2. Install dependencies and run in dev mode:

```bash
npm install
npm run dev
```

3. Example endpoints

- `GET /` — root
- `GET /api/ping` — health check
- `GET /api/users` — list users (demo, in-memory)
- `POST /api/users/signup` — create user (demo, in-memory)

Using Atlas connection string

If you want to connect to MongoDB Atlas use a connection string like:

```
MONGO_URI=mongodb+srv://erroldmello2005_db_user:<db_password>@cluster0.0tbzusj.mongodb.net/college_dekho_api?retryWrites=true&w=majority
```

Replace `<db_password>` with the actual password for `erroldmello2005_db_user` before starting the server.

Notes
- This app uses Node ESM (`type: module` in `package.json`).
- Replace the in-memory users store with a real Mongoose model and secure auth for production.

````
