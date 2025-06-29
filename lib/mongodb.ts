/* eslint-disable */

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGO;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
}

declare global {
  var mongoose: {
    conn: mongoose.Mongoose | null;
    promise: Promise<mongoose.Mongoose> | null;
  };
}

let cached = global.mongoose || { conn: null, promise: null };
global.mongoose = cached;

export default async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    console.log("Connecting to MongoDB...");
    cached.promise = mongoose.connect(MONGODB_URI!, {
      bufferCommands: false,
      // dbName: "easypos"
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log("MongoDB connected");
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.error("Error connecting to MongoDB:", error);

    throw error;
  }
}
