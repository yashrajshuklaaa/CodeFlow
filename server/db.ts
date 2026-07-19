import mongoose from "mongoose";

export async function connectDB(): Promise<void> {
  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    throw new Error("Missing MONGODB_URI environment variable");
  }

  await mongoose.connect(mongoURI);
  console.log("Connected to MongoDB");
}

const UserSchema = new mongoose.Schema(
  {
    usernameKey: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    passwordHash: { type: String, required: true },
    xp: { type: Number, default: 0 },
    completedCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const LeaderboardSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    wpm: { type: Number, required: true },
    netWpm: { type: Number, required: true },
    accuracy: { type: Number, required: true },
    lang: { type: String, required: true },
    levelTitle: { type: String, required: true },
    timestamp: { type: String, required: true },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", UserSchema);
export const Leaderboard = mongoose.model("Leaderboard", LeaderboardSchema);
