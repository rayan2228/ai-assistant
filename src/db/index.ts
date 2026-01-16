import mongoose from "mongoose";
import { config } from "./../config/index";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.MONGODB_URI!, {
      directConnection: false,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.log(`Error: ${err}`);
    process.exit(1);
  }
};
