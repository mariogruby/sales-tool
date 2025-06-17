import mongoose from "mongoose";

let isConnected = false;

export default async function connectToDatabase() {
    if (isConnected) {
        return;
    }
    
    const MONGODB_URI = process.env.MONGO
    if (!MONGODB_URI) {
        throw new Error("MONGODB_URI is not defined");
    }

    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGODB_URI, {
            bufferCommands: false,
        });

        isConnected = true;
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error;
    }
}
