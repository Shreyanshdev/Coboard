import { z } from "zod";

export type ToolType =
  | "select"
  | "hand"
  | "pencil"
  | "highlighter"
  | "rectangle"
  | "circle"
  | "line"
  | "arrow"
  | "text"
  | "eraser"
  | "laser"
  | "image";

export interface Point {
  x: number;
  y: number;
}

export type FontFamily =
  | "handwriting"
  | "kalam"
  | "architect"
  | "chillax"
  | "mono"
  | "sans"
  | string;

export interface ElementBinding {
  elementId: string;
  focus?: number;
  gap?: number;
}

export interface CanvasElement {
  id: string;
  type: ToolType;
  x: number;
  y: number;
  width?: number;
  height?: number;
  points?: Point[];
  angle?: number;
  text?: string;
  strokeColor: string;
  fillColor: string;
  strokeWidth: number;
  roughness: number;
  strokeStyle?: "solid" | "dashed" | "dotted";
  edges?: "round" | "sharp";
  arrowhead?: "sharp" | "sketchy" | "dot" | "bar";
  arrowType?: "straight" | "curved";
  opacity?: number;
  fontFamily?: FontFamily;
  fontWeight?: "normal" | "bold";
  fontStyle?: "normal" | "italic";
  imageUrl?: string;
  dataUrl?: string;
  startBinding?: ElementBinding;
  endBinding?: ElementBinding;
  isMagicShape?: boolean;
  createdAt: number;
}

// Zod Validation Schemas
export const CreateUserSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(6),
  name: z.string().min(2).max(50)
});

export const SigninUserSchema = z.object({
  username: z.string(),
  password: z.string()
});

export const CreateRoomSchema = z.object({
  name: z.string().min(3).max(50),
  slug: z.string().min(2).max(50)
});

export const BindingSchema = z.object({
  elementId: z.string(),
  focus: z.number().optional(),
  gap: z.number().optional()
});

export const ElementSchema = z.object({
  id: z.string(),
  type: z.enum([
    "select",
    "hand",
    "pencil",
    "highlighter",
    "rectangle",
    "circle",
    "line",
    "arrow",
    "text",
    "eraser",
    "laser",
    "image"
  ]),
  x: z.number(),
  y: z.number(),
  width: z.number().optional(),
  height: z.number().optional(),
  points: z.array(z.object({ x: z.number(), y: z.number() })).optional(),
  angle: z.number().optional(),
  text: z.string().optional(),
  strokeColor: z.string(),
  fillColor: z.string(),
  strokeWidth: z.number(),
  roughness: z.number(),
  strokeStyle: z.enum(["solid", "dashed", "dotted"]).optional(),
  edges: z.enum(["round", "sharp"]).optional(),
  arrowhead: z.enum(["sharp", "sketchy", "dot", "bar"]).optional(),
  arrowType: z.enum(["straight", "curved"]).optional(),
  opacity: z.number().optional(),
  fontFamily: z.string().optional(),
  fontWeight: z.enum(["normal", "bold"]).optional(),
  fontStyle: z.enum(["normal", "italic"]).optional(),
  imageUrl: z.string().optional(),
  dataUrl: z.string().optional(),
  startBinding: BindingSchema.optional(),
  endBinding: BindingSchema.optional(),
  isMagicShape: z.boolean().optional(),
  createdAt: z.number()
});

// WebSocket Event Types
export type WSMessageType =
  | "JOIN_ROOM"
  | "LEAVE_ROOM"
  | "DRAW_ELEMENT"
  | "UPDATE_ELEMENT"
  | "DELETE_ELEMENT"
  | "CLEAR_CANVAS"
  | "CURSOR_MOVE"
  | "ROOM_SNAPSHOT"
  | "USER_JOINED"
  | "USER_LEFT";

export interface WSMessage {
  type: WSMessageType;
  roomId: string;
  userId?: string;
  userName?: string;
  payload?: any;
}
