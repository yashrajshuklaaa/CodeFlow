# CodeFlow — Coding Speed Test

React 19 + Express app with permanent cloud data:
- **MongoDB** — users & leaderboard
- **Redis** — login sessions
- **Docker** — local full stack

## Quick start (Docker — recommended locally)

```bash
docker compose up --build
```

Open http://localhost:3000

## Dev without Docker app container

1. Start only databases:

```bash
docker compose up mongo redis -d
```

2. Copy env and install:

```bash
cp .env.example .env.local
npm install
npm run dev
```

Load env from `.env.local` by either renaming to `.env` or exporting vars. `dotenv` loads `.env` by default — copy:

```bash
cp .env.example .env
```

## Free forever deploy (internet)

| Layer | Free service |
|--------|----------------|
| App | [Render](https://render.com) Web Service |
| Users / scores | [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) M0 |
| Sessions | [Upstash Redis](https://upstash.com) |

### 1. MongoDB Atlas

1. Create a free **M0** cluster  
2. Database Access → create a user  
3. Network Access → allow `0.0.0.0/0` (so Render can connect)  
4. Connect → Drivers → copy `mongodb+srv://...` URI  

### 2. Upstash Redis

1. Create a free Redis database  
2. Copy the Redis URL (`rediss://...`)  

### 3. GitHub + Render

1. Push this repo to GitHub  
2. Render → **New Web Service** → connect the repo  
3. Settings:
   - **Build:** `npm install && npm run build`
   - **Start:** `npm run start`
   - Or use the included **Dockerfile** (Docker runtime)
4. Environment variables:
   - `NODE_ENV` = `production`
   - `MONGODB_URI` = your Atlas URI  
   - `REDIS_URL` = your Upstash URL  

API routes and UI are unchanged; only storage moved off `db.json`.
