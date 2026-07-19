import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { connectDB, User, Leaderboard } from "./server/db";
import { connectRedis, getSessions } from "./server/sessions";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

function hashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return "h_" + hash.toString(36);
}

function createToken(): string {
  return Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
}

async function authenticateToken(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Access token required" });
    return;
  }

  try {
    const username = await getSessions().get(token);
    if (!username) {
      res.status(403).json({ error: "Invalid or expired token" });
      return;
    }
    (req as express.Request & { username: string }).username = username;
    next();
  } catch (err) {
    console.error("Session lookup failed:", err);
    res.status(500).json({ error: "Session service unavailable" });
  }
}

app.post("/api/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password || typeof username !== "string" || typeof password !== "string") {
      res.status(400).json({ error: "Username and password are required" });
      return;
    }

    const trimmedUsername = username.trim();
    if (trimmedUsername.length < 3) {
      res.status(400).json({ error: "Username must be at least 3 characters long" });
      return;
    }

    if (password.length < 5) {
      res.status(400).json({ error: "Password must be at least 5 characters long" });
      return;
    }

    const usernameKey = trimmedUsername.toLowerCase();
    const existing = await User.findOne({ usernameKey });
    if (existing) {
      res.status(409).json({ error: "Username is already taken" });
      return;
    }

    await User.create({
      usernameKey,
      username: trimmedUsername,
      passwordHash: hashPassword(password),
      xp: 0,
      completedCount: 0,
    });

    const token = createToken();
    await getSessions().set(token, trimmedUsername);

    res.status(201).json({
      token,
      user: {
        username: trimmedUsername,
        xp: 0,
        completedCount: 0,
      },
    });
  } catch (err) {
    console.error("Register failed:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: "Username and password are required" });
      return;
    }

    const usernameKey = username.trim().toLowerCase();
    const user = await User.findOne({ usernameKey });

    if (!user || user.passwordHash !== hashPassword(password)) {
      res.status(401).json({ error: "Invalid username or password" });
      return;
    }

    const token = createToken();
    await getSessions().set(token, user.username);

    res.json({
      token,
      user: {
        username: user.username,
        xp: user.xp,
        completedCount: user.completedCount,
      },
    });
  } catch (err) {
    console.error("Login failed:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

app.post("/api/leaderboard", authenticateToken, async (req, res) => {
  try {
    const username = (req as express.Request & { username: string }).username;
    const { wpm, netWpm, accuracy, lang, levelTitle, xpAwarded } = req.body;

    if (
      typeof wpm !== "number" ||
      typeof netWpm !== "number" ||
      typeof accuracy !== "number" ||
      !lang ||
      !levelTitle
    ) {
      res.status(400).json({ error: "Invalid stats payload" });
      return;
    }

    const usernameKey = username.toLowerCase();
    const user = await User.findOne({ usernameKey });

    if (user) {
      if (typeof xpAwarded === "number") {
        user.xp = (user.xp || 0) + xpAwarded;
      }
      user.completedCount = (user.completedCount || 0) + 1;
      await user.save();
    }

    const created = await Leaderboard.create({
      username,
      wpm,
      netWpm,
      accuracy,
      lang,
      levelTitle,
      timestamp: new Date().toISOString(),
    });

    const record = {
      id: String(created._id),
      username: created.username,
      wpm: created.wpm,
      netWpm: created.netWpm,
      accuracy: created.accuracy,
      lang: created.lang,
      levelTitle: created.levelTitle,
      timestamp: created.timestamp,
    };

    res.status(201).json({
      success: true,
      record,
      updatedUser: user
        ? {
            username: user.username,
            xp: user.xp,
            completedCount: user.completedCount,
          }
        : null,
    });
  } catch (err) {
    console.error("Leaderboard submit failed:", err);
    res.status(500).json({ error: "Failed to save score" });
  }
});

app.get("/api/leaderboard", async (_req, res) => {
  try {
    const sorted = await Leaderboard.find()
      .sort({ netWpm: -1, accuracy: -1 })
      .limit(50)
      .lean();

    res.json(
      sorted.map((row) => ({
        id: String(row._id),
        username: row.username,
        wpm: row.wpm,
        netWpm: row.netWpm,
        accuracy: row.accuracy,
        lang: row.lang,
        levelTitle: row.levelTitle,
        timestamp: row.timestamp,
      }))
    );
  } catch (err) {
    console.error("Leaderboard fetch failed:", err);
    res.status(500).json({ error: "Failed to retrieve leaderboard" });
  }
});

app.get("/api/me", authenticateToken, async (req, res) => {
  try {
    const username = (req as express.Request & { username: string }).username;
    const user = await User.findOne({ usernameKey: username.toLowerCase() });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({
      username: user.username,
      xp: user.xp,
      completedCount: user.completedCount,
    });
  } catch (err) {
    console.error("Profile fetch failed:", err);
    res.status(500).json({ error: "Failed to load profile" });
  }
});

async function start() {
  await connectDB();
  await connectRedis();

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(
      `Server running on http://localhost:${PORT} in ${process.env.NODE_ENV || "development"} mode`
    );
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
