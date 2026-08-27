import { useEffect } from "react";
import { CanvasElement } from "@/types";
import { wsManager } from "@/lib/ws";
import { api } from "@/lib/api";

interface UseCanvasKeyboardProps {
  elements: CanvasElement[];
  setElements: React.Dispatch<React.SetStateAction<CanvasElement[]>>;
  selectedIds: string[];
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
  clipboard: CanvasElement[];
  setClipboard: React.Dispatch<React.SetStateAction<CanvasElement[]>>;
  pushHistory: (elements: CanvasElement[]) => void;
  handleUndo: () => void;
  handleRedo: () => void;
  setIsSpacePressed: React.Dispatch<React.SetStateAction<boolean>>;
  roomSlug?: string;
  isPersonal: boolean;
}

export function useCanvasKeyboard({
  elements,
  setElements,
  selectedIds,
  setSelectedIds,
  clipboard,
  setClipboard,
  pushHistory,
  handleUndo,
  handleRedo,
  setIsSpacePressed,
  roomSlug,
  isPersonal,
}: UseCanvasKeyboardProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
        return;
      }

      if (e.code === "Space" && !e.repeat) {
        setIsSpacePressed(true);
      }

      // Undo: Ctrl+Z / Cmd+Z
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }

      // Redo: Ctrl+Y or Ctrl+Shift+Z
      if (
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "z")
      ) {
        e.preventDefault();
        handleRedo();
      }

      // Copy: Ctrl+C
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "c") {
        if (selectedIds.length > 0) {
          const toCopy = elements.filter((el) => selectedIds.includes(el.id));
          setClipboard(toCopy);
        }
      }

      // Paste: Ctrl+V
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "v") {
        if (clipboard.length > 0) {
          e.preventDefault();
          const pasted = clipboard.map((el) => ({
            ...el,
            id: `el_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            x: el.x + 24,
            y: el.y + 24,
            createdAt: Date.now(),
          }));
          const updated = [...elements, ...pasted];
          setElements(updated);
          pushHistory(updated);
          setSelectedIds(pasted.map((p) => p.id));
          if (!isPersonal && roomSlug) {
            pasted.forEach((p) => {
              wsManager.send({ type: "DRAW_ELEMENT", roomId: roomSlug, payload: p });
            });
            api.saveElements(roomSlug, updated);
          } else {
            localStorage.setItem("excalidraw_solo_elements", JSON.stringify(updated));
          }
        }
      }

      // Delete / Backspace
      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedIds.length > 0) {
          e.preventDefault();
          const updated = elements.filter((el) => !selectedIds.includes(el.id));
          setElements(updated);
          pushHistory(updated);
          if (!isPersonal && roomSlug) {
            selectedIds.forEach((id) => {
              wsManager.send({ type: "DELETE_ELEMENT", roomId: roomSlug, payload: { id } });
            });
            api.saveElements(roomSlug, updated);
          } else {
            localStorage.setItem("excalidraw_solo_elements", JSON.stringify(updated));
          }
          setSelectedIds([]);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setIsSpacePressed(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [
    elements,
    selectedIds,
    clipboard,
    handleUndo,
    handleRedo,
    pushHistory,
    setClipboard,
    setElements,
    setIsSpacePressed,
    setSelectedIds,
    roomSlug,
    isPersonal,
  ]);
}
