import mongoose, { Document, Schema, Model } from "mongoose";
import { CanvasElement } from "@repo/common";

export { mongoose };

// ============================================================================
// USER MODEL DEFINITION
// ============================================================================
export interface IUser extends Document {
  username: string;
  password: string;
  name: string;
  photo?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    photo: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

// ============================================================================
// ROOM MODEL DEFINITION (STRICT CANVAS ELEMENT SCHEMA)
// ============================================================================
export interface IRoom extends Document {
  slug: string;
  name: string;
  adminId: string;
  elements: CanvasElement[];
  createdAt: Date;
  updatedAt: Date;
}

const RoomSchema = new Schema<IRoom>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    adminId: {
      type: String,
      required: true,
      default: "system",
    },
    elements: {
      type: Schema.Types.Mixed,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Room: Model<IRoom> =
  mongoose.models.Room || mongoose.model<IRoom>("Room", RoomSchema);

// ============================================================================
// MONGODB CONNECTION POOL & MANAGER
// ============================================================================
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
      `[MongoDB] Connection notice: Unable to reach MongoDB at ${MONGODB_URI}. Falling back to in-memory mode:`,
      (error as Error).message
    );
    return mongoose;
  }
}
