"use client";

import React from "react";
import { RotateCcw, RotateCw, ZoomIn, ZoomOut, Trash2 } from "lucide-react";

interface BottomControlsIslandProps {
  isLight: boolean;
  handleUndo: () => void;
  canUndo: boolean;
  handleRedo: () => void;
  canRedo: boolean;
  handleZoomOut: () => void;
  handleResetZoom: () => void;
  handleZoomIn: () => void;
  zoom: number;
  handleClear: () => void;
  hasElements: boolean;
  selectedCount: number;
}

export const BottomControlsIsland: React.FC<BottomControlsIslandProps> = ({
  isLight,
  handleUndo,
  canUndo,
  handleRedo,
  canRedo,
  handleZoomOut,
  handleResetZoom,
  handleZoomIn,
  zoom,
  handleClear,
  hasElements,
  selectedCount,
}) => {
  return (
    <div className="fixed bottom-2 sm:bottom-4 left-2 sm:left-4 z-40 flex items-center gap-1.5 pointer-events-auto">
      <div
        className={`flex items-center gap-0.5 sm:gap-1 p-1 rounded-full border shadow-md ${
          isLight
            ? "bg-white/90 backdrop-blur-xl border-white/90 text-[#382f28]"
            : "bg-[#1e2330]/90 backdrop-blur-xl border-white/10 text-slate-200"
        }`}
      >
        {/* Backward Action (Undo) */}
        <button
          onClick={handleUndo}
          disabled={!canUndo}
          title="Backward / Undo (Ctrl+Z)"
          className={`p-1.5 rounded-full transition-colors cursor-pointer disabled:opacity-30 ${
            isLight ? "hover:bg-black/[0.05]" : "hover:bg-white/10"
          }`}
        >
          <RotateCcw size={14} />
        </button>

        {/* Forward Action (Redo) */}
        <button
          onClick={handleRedo}
          disabled={!canRedo}
          title="Forward / Redo (Ctrl+Y)"
          className={`p-1.5 rounded-full transition-colors cursor-pointer disabled:opacity-30 ${
            isLight ? "hover:bg-black/[0.05]" : "hover:bg-white/10"
          }`}
        >
          <RotateCw size={14} />
        </button>

        {/* ZOOM CONTROLS */}
        <div className="flex items-center gap-0.5 border-l border-black/10 dark:border-white/10 pl-1">
          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            className={`p-1 rounded-full transition-colors cursor-pointer ${
              isLight ? "hover:bg-black/[0.05]" : "hover:bg-white/10"
            }`}
          >
            <ZoomOut size={13} />
          </button>
          <button
            onClick={handleResetZoom}
            title="Reset Zoom (100%)"
            className="px-1.5 py-0.5 text-[11px] font-mono hover:text-[#c45a2c] cursor-pointer"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            onClick={handleZoomIn}
            title="Zoom In"
            className={`p-1 rounded-full transition-colors cursor-pointer ${
              isLight ? "hover:bg-black/[0.05]" : "hover:bg-white/10"
            }`}
          >
            <ZoomIn size={13} />
          </button>
        </div>

        {/* Clear Canvas */}
        <button
          onClick={handleClear}
          disabled={!hasElements}
          title="Clear Canvas"
          className={`p-1.5 rounded-full transition-colors cursor-pointer disabled:opacity-30 ${
            isLight
              ? "hover:bg-red-50 text-red-600"
              : "hover:bg-red-950/50 text-red-400"
          }`}
        >
          <Trash2 size={14} />
        </button>

        {selectedCount > 0 && (
          <span className="font-handwriting text-xs text-[#c45a2c] px-2 border-l border-black/10 select-none">
            {selectedCount} selected
          </span>
        )}
      </div>
    </div>
  );
};
