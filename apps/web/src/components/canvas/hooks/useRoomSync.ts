import { useEffect } from "react";
import { CanvasElement, WSMessage } from "@/types";
import { api } from "@/lib/api";
import { wsManager } from "@/lib/ws";
import { storage } from "@/lib/storage";

interface UseRoomSyncProps {
  roomSlug?: string;
  isPersonal: boolean;
  setElements: React.Dispatch<React.SetStateAction<CanvasElement[]>>;
  setInitialHistory: (elements: CanvasElement[]) => void;
}

export function useRoomSync({
  roomSlug,
  isPersonal,
  setElements,
  setInitialHistory,
}: UseRoomSyncProps) {
  useEffect(() => {
    let isMounted = true;

    if (isPersonal || !roomSlug) {
      // Personal Solo Mode: Load from localStorage
      const saved = localStorage.getItem("excalidraw_solo_elements");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setElements(parsed);
            setInitialHistory(parsed);
          }
        } catch (e) {
          console.error(e);
        }
      }
      return;
    }

    // Collaborative Room Mode: Load from Backend + WebSocket
    api.getRoom(roomSlug).then((res) => {
      if (isMounted && res.success && res.data?.room?.elements) {
        setElements(res.data.room.elements);
        setInitialHistory(res.data.room.elements);
      }
    });

    const user = storage.getUser();
    wsManager.connect(roomSlug, user?.userId, user?.name);

    const unsubscribe = wsManager.subscribe("ALL", (msg: WSMessage) => {
      if (msg.roomId !== roomSlug) return;

      switch (msg.type) {
        case "ROOM_SNAPSHOT": {
          if (msg.payload?.elements) {
            setElements(msg.payload.elements);
            setInitialHistory(msg.payload.elements);
          }
          break;
        }
        case "DRAW_ELEMENT": {
          if (msg.payload) {
            setElements((prev) => {
              if (prev.some((e) => e.id === msg.payload.id)) return prev;
              return [...prev, msg.payload];
            });
          }
          break;
        }
        case "UPDATE_ELEMENT": {
          if (msg.payload?.id) {
            setElements((prev) =>
              prev.map((el) => (el.id === msg.payload.id ? msg.payload : el))
            );
          }
          break;
        }
        case "DELETE_ELEMENT": {
          if (msg.payload?.id) {
            setElements((prev) => prev.filter((el) => el.id !== msg.payload.id));
          }
          break;
        }
        case "CLEAR_CANVAS": {
          setElements([]);
          setInitialHistory([]);
          break;
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
      wsManager.disconnect();
    };
  }, [roomSlug, isPersonal, setElements, setInitialHistory]);
}
