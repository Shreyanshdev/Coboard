import { UserSession } from "@/types";

const TOKEN_KEY = "excalidraw_token";
const USER_KEY = "excalidraw_user";
const RECENT_ROOMS_KEY = "excalidraw_recent_rooms";

export const storage = {
  getToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken: (token: string): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(TOKEN_KEY, token);
  },

  clearToken: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getUser: (): UserSession | null => {
    if (typeof window === "undefined") return null;
    const data = localStorage.getItem(USER_KEY);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  },

  setUser: (user: UserSession): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  getRecentRooms: (): string[] => {
    if (typeof window === "undefined") return ["architecture-sprint", "system-design", "team-brainstorm"];
    const data = localStorage.getItem(RECENT_ROOMS_KEY);
    if (!data) return ["architecture-sprint", "system-design", "team-brainstorm"];
    try {
      return JSON.parse(data);
    } catch {
      return ["architecture-sprint", "system-design", "team-brainstorm"];
    }
  },

  addRecentRoom: (slug: string): void => {
    if (typeof window === "undefined") return;
    const current = storage.getRecentRooms();
    const updated = [slug, ...current.filter((s) => s !== slug)].slice(0, 6);
    localStorage.setItem(RECENT_ROOMS_KEY, JSON.stringify(updated));
  },
};
