import mongoose from "mongoose";
import env from "../shared/configs/env";
import { logger } from "../shared/utils/logger";

if (!env.MONGO_URL) {
  throw new Error("Please provide MONGO_URL in the environment variables");
}

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(env.MONGO_URL as string);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(error, "MongoDB Connection Failed:");
    process.exit(1);
  }
};
