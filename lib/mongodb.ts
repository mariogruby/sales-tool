import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGO;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null; // Fixed type to match mongoose.connect
  };
}

// eslint-disable-next-line prefer-const
let cached = global.mongoose || { conn: null, promise: null };
global.mongoose = cached;

export default async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    console.log("Connecting to MongoDB...");
    cached.promise = mongoose.connect(MONGODB_URI!, { // Non-null assertion since we check MONGODB_URI above
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log("MongoDB connected");
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
}