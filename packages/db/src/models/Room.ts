import mongoose, { Document, Schema, Model } from "mongoose";
import { CanvasElement } from "@repo/common";

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
