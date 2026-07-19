import Redis from "ioredis";

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 14; // 14 days
const KEY_PREFIX = "codeflow:session:";

type SessionStore = {
  set(token: string, username: string): Promise<void>;
  get(token: string): Promise<string | null>;
  delete(token: string): Promise<void>;
};

function createMemoryStore(): SessionStore {
  const map = new Map<string, string>();
  return {
    async set(token, username) {
      map.set(token, username);
    },
    async get(token) {
      return map.get(token) ?? null;
    },
    async delete(token) {
      map.delete(token);
    },
  };
}

function createRedisStore(client: Redis): SessionStore {
  return {
    async set(token, username) {
      await client.set(`${KEY_PREFIX}${token}`, username, "EX", SESSION_TTL_SECONDS);
    },
    async get(token) {
      return client.get(`${KEY_PREFIX}${token}`);
    },
    async delete(token) {
      await client.del(`${KEY_PREFIX}${token}`);
    },
  };
}

function normalizeRedisUrl(url: string): string {
  // Upstash requires TLS — upgrade redis:// to rediss:// when pointing at Upstash
  if (url.startsWith("redis://") && url.includes("upstash.io")) {
    return "rediss://" + url.slice("redis://".length);
  }
  return url;
}

let sessions: SessionStore = createMemoryStore();
let redisClient: Redis | null = null;

export async function connectRedis(): Promise<void> {
  const rawUrl = process.env.REDIS_URL;

  if (!rawUrl) {
    console.warn("REDIS_URL not set — using in-memory sessions (lost on restart)");
    sessions = createMemoryStore();
    return;
  }

  const redisUrl = normalizeRedisUrl(rawUrl);

  try {
    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      connectTimeout: 10000,
      tls: redisUrl.startsWith("rediss://") ? {} : undefined,
    });

    redisClient.on("error", (err) => {
      console.error("Redis client error:", err.message);
    });

    await redisClient.ping();
    sessions = createRedisStore(redisClient);
    console.log("Connected to Redis for sessions");
  } catch (err) {
    console.error("Redis unavailable — falling back to in-memory sessions:", err);
    if (redisClient) {
      try {
        redisClient.disconnect();
      } catch {
        // ignore
      }
      redisClient = null;
    }
    sessions = createMemoryStore();
  }
}

export function getSessions(): SessionStore {
  return sessions;
}

export async function disconnectRedis(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
}
