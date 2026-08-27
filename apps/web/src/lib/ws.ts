import { WSMessage, WSMessageType } from "@repo/common";
import { WS_URL } from "./constants";

export class WebSocketManager {
  private socket: WebSocket | null = null;
  private roomId: string | null = null;
  private listeners: Map<WSMessageType | "ALL", Set<(msg: WSMessage) => void>> = new Map();
  private isConnecting: boolean = false;
  private reconnectTimeout: any = null;

  connect(roomId: string, userId?: string, userName?: string) {
    this.roomId = roomId;

    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.send({
        type: "JOIN_ROOM",
        roomId,
        userId,
        userName,
      });
      return;
    }

    if (this.isConnecting) return;
    this.isConnecting = true;

    try {
      this.socket = new WebSocket(WS_URL);

      this.socket.onopen = () => {
        this.isConnecting = false;
        console.log("[WS Client] Connected to WebSocket server");
        if (this.roomId) {
          this.send({
            type: "JOIN_ROOM",
            roomId: this.roomId,
            userId,
            userName,
          });
        }
      };

      this.socket.onmessage = (event) => {
        try {
          const message: WSMessage = JSON.parse(event.data);
          this.notifyListeners(message);
        } catch (e) {
          console.error("[WS Client] Error parsing message:", e);
        }
      };

      this.socket.onerror = (err) => {
        console.warn("[WS Client] WebSocket connection error (using local state fallback):", err);
        this.isConnecting = false;
      };

      this.socket.onclose = () => {
        this.isConnecting = false;
        console.log("[WS Client] WebSocket connection closed");
      };
    } catch (err) {
      this.isConnecting = false;
      console.warn("[WS Client] WebSocket not available, offline mode active.");
    }
  }

  send(message: WSMessage) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    }
  }

  subscribe(type: WSMessageType | "ALL", callback: (msg: WSMessage) => void) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(callback);

    return () => {
      this.listeners.get(type)?.delete(callback);
    };
  }

  private notifyListeners(message: WSMessage) {
    const specific = this.listeners.get(message.type);
    if (specific) {
      specific.forEach((cb) => cb(message));
    }
    const all = this.listeners.get("ALL");
    if (all) {
      all.forEach((cb) => cb(message));
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    this.listeners.clear();
  }
}

export const wsManager = new WebSocketManager();
