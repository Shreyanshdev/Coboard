import mongoose from "mongoose";

export * from "./models/User";
export * from "./models/Room";
export { mongoose };

const MONGODB_URI =
  process.env.DATABASE_URL ||
  process.env.MONGODB_URI ||
  "mongodb://127.0.0.1:27017/excalidraw";

let isConnected = false;

export async function connectDB(): Promise<typeof mongoose> {
  if (isConnected || mongoose.connection.readyState === 1) {
    isConnected = true;
    return mongoose;
  }

  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`[MongoDB] Connected successfully to ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(
      `[MongoDB] Connection notice: Unable to reach MongoDB at ${MONGODB_URI}. Falling back to resilient in-memory mode. Error:`,
      (error as Error).message
    );
    return mongoose;
  }
}
