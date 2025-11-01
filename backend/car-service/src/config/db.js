import mongoose from "mongoose";
import { MONGO_URI, DB_NAME, SERVICE } from "../utils/constant.js";
import logger from "../utils/logger.js";

const connectDB = async (retries = 5, delay = 3000) => {
  while (retries) {
    try {
      const connectionInstance = await mongoose.connect(
        `${MONGO_URI}/${DB_NAME}`
      );
      logger.success(
        SERVICE,
        `MongoDB connected on port: ${connectionInstance.connection.port}`
      );
      return;
    } catch (error) {
      retries -= 1;
      logger.warn(
        SERVICE,
        `MongoDB connection failed, retries left: ${retries}`
      );
      if (!retries) {
        logger.error(
          SERVICE,
          `MongoDB connection failed permanently → ${error.message}`
        );
        process.exit(1);
      }
      await new Promise((res) => setTimeout(res, delay));
    }
  }
};

export default connectDB;
