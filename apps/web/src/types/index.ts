export type {
  ToolType,
  Point,
  CanvasElement,
  FontFamily,
  ElementBinding,
  WSMessageType,
  WSMessage,
} from "@repo/common";

export {
  CreateUserSchema,
  SigninUserSchema,
  CreateRoomSchema,
  ElementSchema,
  BindingSchema,
} from "@repo/common";

export interface UserSession {
  token: string;
  userId: string;
  name: string;
  username?: string;
}

export interface RoomMetadata {
  id: string;
  slug: string;
  name: string;
  adminId?: string;
  elementCount?: number;
  createdAt?: string;
}

export interface ToolConfig {
  id: import("@repo/common").ToolType;
  label: string;
  iconName: string;
  shortcut: string;
  description: string;
}

export interface DrawingOptions {
  strokeColor: string;
  fillColor: string;
  strokeWidth: number;
  roughness: number;
}
