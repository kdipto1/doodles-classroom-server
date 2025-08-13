import type { VercelRequest, VercelResponse } from "@vercel/node";
import mongoose from "mongoose";
import app from "../src/app";
import config from "../src/config/config";
import { logger } from "../src/logger";

let isConnected = false;
let connectionPromise: Promise<void> | null = null;

const connectToDatabase = async (): Promise<void> => {
  if (isConnected) {
    return;
  }

  // Prevent multiple simultaneous connection attempts
  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = (async () => {
    try {
      // Optimize connection options for serverless
      await mongoose.connect(config.mongoose.url, {
        dbName: "doodles-classroom",
        maxPoolSize: 10, // Maintain up to 10 socket connections
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        bufferCommands: false, // Disable mongoose buffering
      });
      isConnected = true;
      logger.info("Connected to MongoDB");
    } catch (error) {
      logger.error("MongoDB connection error:", error);
      connectionPromise = null; // Reset promise on failure
      throw error;
    }
  })();

  return connectionPromise;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await connectToDatabase();

    // Handle the request using Express app
    return app(req, res);
  } catch (error) {
    logger.error("Handler error:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      ...(config.nodeEnv === "development" && { details: error.message }),
    });
  }
}
