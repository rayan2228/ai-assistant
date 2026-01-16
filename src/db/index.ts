import mongoose from "mongoose";
import { config } from "./../config/index";

export const connectDB = async () => {
  try {
    if (!config.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    const conn = await mongoose.connect(config.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`MongoDB Connection Error: ${err}`);
    console.error("Please check:");
    console.error("1. MONGODB_URI is correctly set in .env");
    console.error("2. Your IP is whitelisted in MongoDB Atlas");
    console.error("3. Your internet connection is stable");
    process.exit(1);
  }
};