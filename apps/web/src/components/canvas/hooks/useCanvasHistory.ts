import { useState, useCallback } from "react";
import { CanvasElement } from "@/types";

export function useCanvasHistory(initialElements: CanvasElement[] = []) {
  const [history, setHistory] = useState<CanvasElement[][]>(() => [initialElements]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const pushHistory = useCallback(
    (newElements: CanvasElement[]) => {
      setHistory((prev) => {
        const updated = prev.slice(0, historyIndex + 1);
        return [...updated, newElements];
      });
      setHistoryIndex((prev) => prev + 1);
    },
    [historyIndex]
  );

  const setInitialHistory = useCallback((newElements: CanvasElement[]) => {
    setHistory([newElements]);
    setHistoryIndex(0);
  }, []);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const undo = useCallback((): CanvasElement[] | null => {
    if (historyIndex > 0) {
      const nextIndex = historyIndex - 1;
      setHistoryIndex(nextIndex);
      return history[nextIndex] || [];
    }
    return null;
  }, [history, historyIndex]);

  const redo = useCallback((): CanvasElement[] | null => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      return history[nextIndex] || [];
    }
    return null;
  }, [history, historyIndex]);

  return {
    history,
    historyIndex,
    pushHistory,
    setInitialHistory,
    canUndo,
    canRedo,
    undo,
    redo,
  };
}
