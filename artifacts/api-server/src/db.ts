import mongoose from "mongoose";
import { logger } from "./lib/logger";

export async function connectdb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    logger.error("MONGODB_URI environment variable is not set");
    process.exit(1);
  }
  mongoose.connection.on("connected", () => {
    logger.info("Connected to MongoDB successfully");
  });
  mongoose.connection.on("error", (err) => {
    logger.error({ err }, "MongoDB connection error");
  });
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
    });
  } catch (err) {
    logger.error({ err }, "Failed to connect to MongoDB");
    process.exit(1);
  }
}
