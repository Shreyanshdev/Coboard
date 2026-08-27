import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
import { WSMessage, CanvasElement } from "@repo/common";
import { connectDB, Room, mongoose } from "@repo/db";

const PORT = process.env.WS_PORT ? parseInt(process.env.WS_PORT) : 8080;
const JWT_SECRET = process.env.JWT_SECRET || "excalidraw_secret_key_123";

// Connect to MongoDB
connectDB().catch((err) => {
  console.warn("[WS-Backend] MongoDB connection notice:", err.message);
});

const wss = new WebSocketServer({ port: PORT });

interface ExtendedWebSocket extends WebSocket {
  id?: string;
  userName?: string;
  currentRoom?: string;
  isAlive?: boolean;
}

// Map of roomId -> Set of connected WebSockets
const rooms = new Map<string, Set<ExtendedWebSocket>>();
// Map of roomId -> Array of current canvas elements for fast 120 FPS in-memory caching
const roomElements = new Map<string, CanvasElement[]>();

function broadcastToRoom(roomId: string, message: any, sender?: ExtendedWebSocket) {
  const clients = rooms.get(roomId);
  if (!clients) return;

  const payload = JSON.stringify(message);
  for (const client of clients) {
    if (client !== sender && client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  }
}

// Helper to debounce-flush canvas state to MongoDB
const saveTimeouts = new Map<string, NodeJS.Timeout>();
function scheduleRoomSave(roomId: string) {
  if (saveTimeouts.has(roomId)) {
    clearTimeout(saveTimeouts.get(roomId)!);
  }

  const timeout = setTimeout(async () => {
    saveTimeouts.delete(roomId);
    if (mongoose.connection.readyState === 1) {
      try {
        const elements = roomElements.get(roomId) || [];
        await Room.findOneAndUpdate(
          { slug: roomId },
          { $set: { elements } },
          { upsert: true }
        );
      } catch (err: any) {
        console.error(`[WS-Backend] Error saving room ${roomId} to MongoDB:`, err.message);
      }
    }
  }, 1000);

  saveTimeouts.set(roomId, timeout);
}

wss.on("connection", (ws: ExtendedWebSocket) => {
  ws.id = `client_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  ws.userName = `User ${ws.id.substring(ws.id.length - 4)}`;
  ws.isAlive = true;

  console.log(`[WS] Client connected: ${ws.id}`);

  ws.on("message", async (data: string) => {
    try {
      const message: WSMessage = JSON.parse(data.toString());
      const { type, roomId, payload } = message;

      if (!roomId) return;

      switch (type) {
        case "JOIN_ROOM": {
          // Leave previous room if any
          if (ws.currentRoom && rooms.has(ws.currentRoom)) {
            rooms.get(ws.currentRoom)?.delete(ws);
          }

          ws.currentRoom = roomId;
          if (!rooms.has(roomId)) {
            rooms.set(roomId, new Set());
          }
          rooms.get(roomId)?.add(ws);

          // Populate cache from MongoDB if missing
          if (!roomElements.has(roomId)) {
            let loaded = false;
            if (mongoose.connection.readyState === 1) {
              try {
                const dbRoom = await Room.findOne({ slug: roomId });
                if (dbRoom && Array.isArray(dbRoom.elements)) {
                  roomElements.set(roomId, dbRoom.elements);
                  loaded = true;
                }
              } catch (e) {
                // fall through
              }
            }
            if (!loaded) {
              roomElements.set(roomId, []);
            }
          }

          // Return room state snapshot to joined client
          const currentElements = roomElements.get(roomId) || [];
          ws.send(
            JSON.stringify({
              type: "ROOM_SNAPSHOT",
              roomId,
              payload: { elements: currentElements },
            })
          );

          // Notify others in room
          broadcastToRoom(
            roomId,
            {
              type: "USER_JOINED",
              roomId,
              userId: ws.id,
              userName: ws.userName,
            },
            ws
          );

          console.log(`[WS] Client ${ws.id} joined room ${roomId}`);
          break;
        }

        case "DRAW_ELEMENT": {
          if (!roomElements.has(roomId)) {
            roomElements.set(roomId, []);
          }
          const elements = roomElements.get(roomId)!;
          if (payload) {
            elements.push(payload);
            scheduleRoomSave(roomId);
          }
          broadcastToRoom(
            roomId,
            {
              type: "DRAW_ELEMENT",
              roomId,
              userId: ws.id,
              payload,
            },
            ws
          );
          break;
        }

        case "UPDATE_ELEMENT": {
          const elements = roomElements.get(roomId);
          if (elements && payload && payload.id) {
            const index = elements.findIndex((e) => e.id === payload.id);
            if (index !== -1) {
              elements[index] = payload;
            } else {
              elements.push(payload);
            }
            scheduleRoomSave(roomId);
          }
          broadcastToRoom(
            roomId,
            {
              type: "UPDATE_ELEMENT",
              roomId,
              userId: ws.id,
              payload,
            },
            ws
          );
          break;
        }

        case "DELETE_ELEMENT": {
          const elements = roomElements.get(roomId);
          if (elements && payload && payload.id) {
            const updated = elements.filter((e) => e.id !== payload.id);
            roomElements.set(roomId, updated);
            scheduleRoomSave(roomId);
          }
          broadcastToRoom(
            roomId,
            {
              type: "DELETE_ELEMENT",
              roomId,
              userId: ws.id,
              payload,
            },
            ws
          );
          break;
        }

        case "CLEAR_CANVAS": {
          roomElements.set(roomId, []);
          scheduleRoomSave(roomId);
          broadcastToRoom(
            roomId,
            {
              type: "CLEAR_CANVAS",
              roomId,
              userId: ws.id,
            },
            ws
          );
          break;
        }

        case "CURSOR_MOVE": {
          broadcastToRoom(
            roomId,
            {
              type: "CURSOR_MOVE",
              roomId,
              userId: ws.id,
              userName: ws.userName,
              payload,
            },
            ws
          );
          break;
        }
      }
    } catch (err) {
      console.error("[WS] Error parsing message:", err);
    }
  });

  ws.on("close", () => {
    if (ws.currentRoom && rooms.has(ws.currentRoom)) {
      rooms.get(ws.currentRoom)?.delete(ws);
      broadcastToRoom(ws.currentRoom, {
        type: "USER_LEFT",
        roomId: ws.currentRoom,
        userId: ws.id,
        userName: ws.userName,
      });
    }
    console.log(`[WS] Client disconnected: ${ws.id}`);
  });
});

console.log(`WebSocket server running on ws://localhost:${PORT}`);
