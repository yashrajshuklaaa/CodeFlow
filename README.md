# CodeFlow

**Learn to type real code — not random words.**

CodeFlow is a touch-typing practice app built for programmers. Instead of drilling `asdf jkl;`, you type real **Go** and **Python** snippets across **10 progressive levels**, so your fingers learn the syntax you actually use every day.

Live demo: [https://codeflow-h14d.onrender.com](https://codeflow-h14d.onrender.com)

---

## What is CodeFlow?

CodeFlow turns coding practice into a focused typing arena. Each level is a short, realistic code sample tied to a concept (loops, errors, concurrency, and more). You type it character by character while the app tracks your **speed (WPM)**, **accuracy**, and **rhythm**.

Switch between languages anytime, climb a WPM ladder that starts at **22 WPM** and rises by **6** each level, and unlock harder drills as you improve.

---

## How it helps you

| Problem | How CodeFlow helps |
|---------|-------------------|
| Looking at the keyboard while coding | Builds muscle memory with real syntax, not pangrams |
| Knowing a language but typing it slowly | Progressive WPM goals (22 → 76) push speed with structure |
| Switching between Go and Python | Dual-track levels + Syntax Academy side-by-side comparisons |
| Guessing if you’re actually improving | Live WPM, accuracy gates (95%+), XP, streaks, and a leaderboard |
| Bad posture / hand strain while grinding | Ergonomics tips and warm-up drills built into the workspace |

**In short:** CodeFlow helps you write code faster and more accurately by training the *physical* skill of typing programming languages — the missing layer between tutorials and real productivity.

---

## What’s inside

- **Typing Arena** — 10 Go + 10 Python levels with WPM goals and accuracy requirements  
- **Syntax Academy** — compare concepts module-by-module; load snippets as custom drills; diagnostic quiz  
- **Stats & feedback** — raw/net WPM, accuracy, backspaces, time, and performance tips  
- **Accounts & leaderboard** — register/login, save scores, compete on net WPM  
- **Ergonomics panel** — posture guidance and daily warm-ups  
- **Light / dark** workspace themes  

---

## Tech stack

| Layer | Tech |
|--------|------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, Motion |
| Backend | Node.js, Express |
| Data | MongoDB (users + leaderboard) |
| Sessions | Redis |
| Deploy | Docker on [Render](https://render.com) |

---

## Setup

### Requirements

- Node.js 22+  
- Docker Desktop (recommended for local MongoDB + Redis)  

### Environment

```bash
cp .env.example .env
```

| Variable | Purpose |
|----------|---------|
| `MONGODB_URI` | MongoDB connection string |
| `REDIS_URL` | Redis connection string (`rediss://...` for Upstash) |
| `NODE_ENV` | `production` on deploy |
| `PORT` | Set automatically by Render |

### Quick start (Docker — full stack)

```bash
docker compose up --build
```

Open [http://localhost:3000](http://localhost:3000)

### Dev (app on host, databases in Docker)

```bash
docker compose up mongo redis -d
npm install
npm run dev
```

`dotenv` loads `.env` by default. You can also use `.env.local` (copy from `.env.example` and rename, or keep both).

### Scripts

| Command | What it does |
|---------|----------------|
| `npm run dev` | Local Express + Vite |
| `npm run build` | Production frontend + server bundle |
| `npm run start` | Run production server |
| `npm run docker:db` | Start only Mongo + Redis |
| `npm run docker:up` | Full Docker stack |

---

## Free deploy (internet)

Keep data permanent by separating hosting from storage:

| Layer | Free service |
|--------|----------------|
| App | [Render](https://render.com) Web Service (Docker) |
| Users / scores | [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) M0 |
| Sessions | [Upstash Redis](https://upstash.com) |

### 1. MongoDB Atlas

1. Create a free **M0** cluster  
2. **Database Access** → create a user  
3. **Network Access** → allow Render’s outbound IPs, or `0.0.0.0/0` for free-tier simplicity  
4. **Connect** → Drivers → copy `mongodb+srv://...` URI  
5. Replace `<password>` with the real DB password and include a DB name, e.g. `/codeflow`

### 2. Upstash Redis

1. Create a free Redis database  
2. Copy the **TLS** URL (`rediss://...`)

### 3. GitHub + Render

1. Push this repo to GitHub  
2. Render → **New Web Service** → connect the repo  
3. Runtime: **Docker** (uses the included `Dockerfile`)  
4. Environment variables:
   - `NODE_ENV` = `production`
   - `MONGODB_URI` = your Atlas URI  
   - `REDIS_URL` = your Upstash URL (`rediss://...`)  
5. Deploy → open your `https://….onrender.com` link  

> Free Render instances sleep after inactivity; the first request after idle may take ~30–60 seconds.

---

## License

Personal / portfolio project — use and adapt as you like.
