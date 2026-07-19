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

let sessions: SessionStore = createMemoryStore();
let redisClient: Redis | null = null;

export async function connectRedis(): Promise<void> {
  const redisUrl = process.env.REDIS_URL;

  if (!redisUrl) {
    console.warn("REDIS_URL not set — using in-memory sessions (lost on restart)");
    sessions = createMemoryStore();
    return;
  }

  redisClient = new Redis(redisUrl, {
    maxRetriesPerRequest: 3,
  });

  await redisClient.ping();
  sessions = createRedisStore(redisClient);
  console.log("Connected to Redis for sessions");
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
