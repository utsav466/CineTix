import mongoose from "mongoose";
import { env } from "../config";

let databaseConnected = false;

export async function connectDB(): Promise<void> {
  if (databaseConnected) {
    return;
  }

  try {
    mongoose.set("strictQuery", true);

    await mongoose.connect(env.mongodbUri, {
      serverSelectionTimeoutMS: 10_000,
      connectTimeoutMS: 10_000,
    });

    databaseConnected = true;

    const databaseName =
      mongoose.connection.name || "unknown database";

    console.log(`✅ MongoDB connected: ${databaseName}`);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown MongoDB connection error";

    console.error(`❌ MongoDB connection failed: ${message}`);

    throw error;
  }
}

export async function disconnectDB(): Promise<void> {
  if (!databaseConnected) {
    return;
  }

  await mongoose.disconnect();
  databaseConnected = false;

  console.log("MongoDB disconnected");
}

mongoose.connection.on("error", (error) => {
  console.error("MongoDB runtime error:", error);
});

mongoose.connection.on("disconnected", () => {
  databaseConnected = false;

  if (!env.isTest) {
    console.warn("MongoDB connection lost");
  }
});