import { ToolType } from "@repo/common";
import { ToolConfig, DrawingOptions } from "@/types";

export const HTTP_API_URL = process.env.NEXT_PUBLIC_HTTP_URL || "http://localhost:3001";
const rawWs = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080";
export const WS_URL = rawWs.startsWith("https://")
  ? rawWs.replace("https://", "wss://")
  : rawWs.startsWith("http://")
  ? rawWs.replace("http://", "ws://")
  : rawWs;

export const SUPPORTED_TOOLS: ToolConfig[] = [
  { id: "select", label: "Select", iconName: "MousePointer", shortcut: "1", description: "Select, move and resize canvas items" },
  { id: "hand", label: "Hand (Panning)", iconName: "Hand", shortcut: "H", description: "Pan smoothly across the infinite canvas" },
  { id: "pencil", label: "Freehand Draw", iconName: "Pencil", shortcut: "2", description: "Natural fluid sketch drawing" },
  { id: "highlighter", label: "Highlighter", iconName: "Highlighter", shortcut: "D", description: "Translucent marker highlighter" },
  { id: "rectangle", label: "Rectangle", iconName: "Square", shortcut: "3", description: "Hand-drawn box and rounded card shapes" },
  { id: "circle", label: "Ellipse / Circle", iconName: "Circle", shortcut: "4", description: "Organic curves and round nodes" },
  { id: "line", label: "Straight Line", iconName: "Minus", shortcut: "5", description: "Direct connectors and dividers" },
  { id: "arrow", label: "Arrow Pointer", iconName: "ArrowUpRight", shortcut: "6", description: "Flowchart directional pointers" },
  { id: "text", label: "Text Label", iconName: "Type", shortcut: "7", description: "Clean handwritten typography" },
  { id: "image", label: "Insert Image", iconName: "Image", shortcut: "9", description: "Insert image or picture" },
  { id: "laser", label: "Laser Pointer", iconName: "Zap", shortcut: "K", description: "Glowing presentation laser pointer" },
  { id: "eraser", label: "Eraser", iconName: "Eraser", shortcut: "0", description: "Delete elements with a single click" },
];

export const STROKE_COLORS = [
  "#ffffff",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
];

export const FILL_COLORS = [
  "transparent",
  "rgba(239, 68, 68, 0.25)",
  "rgba(249, 115, 22, 0.25)",
  "rgba(234, 179, 8, 0.25)",
  "rgba(34, 197, 94, 0.25)",
  "rgba(6, 182, 212, 0.25)",
  "rgba(59, 130, 246, 0.25)",
  "rgba(139, 92, 246, 0.25)",
  "rgba(236, 72, 153, 0.25)",
];

export const STROKE_WIDTHS = [
  { label: "Thin", value: 1.5 },
  { label: "Medium", value: 3 },
  { label: "Bold", value: 5 },
];

export const ROUGHNESS_LEVELS = [
  { label: "Architect", value: 0 },
  { label: "Artist", value: 1.4 },
  { label: "Cartoonist", value: 2.8 },
];

export const DEFAULT_DRAWING_OPTIONS: DrawingOptions = {
  strokeColor: "#ffffff",
  fillColor: "transparent",
  strokeWidth: 2.5,
  roughness: 1.4,
};
