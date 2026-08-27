"use client";

import React, { useState } from "react";
import { ToolType } from "@/types";
import { SUPPORTED_TOOLS } from "@/lib/constants";
import {
  MousePointer,
  Hand,
  Pencil,
  Highlighter,
  Square,
  Circle,
  Minus,
  ArrowUpRight,
  Type,
  Eraser,
  Image as ImageIcon,
  ChevronUp,
  Sparkles,
} from "lucide-react";

interface CanvasToolbarProps {
  activeTool: ToolType;
  onSelectTool: (tool: ToolType) => void;
  onInsertImage?: () => void;
  theme?: "light" | "dark";
}

const ICONS: Record<string, React.ReactNode> = {
  select: <MousePointer size={15} />,
  hand: <Hand size={15} />,
  pencil: <Pencil size={15} />,
  highlighter: <Highlighter size={15} />,
  rectangle: <Square size={15} />,
  circle: <Circle size={15} />,
  line: <Minus size={15} />,
  arrow: <ArrowUpRight size={15} />,
  text: <Type size={15} />,
  image: <ImageIcon size={15} />,
  laser: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 4l5 5-10.5 10.5a1.5 1.5 0 0 1-1.06.44H5v-3.44a1.5 1.5 0 0 1 .44-1.06L15 4z" />
      <path d="M13.5 5.5l5 5" />
      <circle cx="4" cy="20" r="1.5" fill="#ff0055" stroke="none" />
      <path d="M2 18l-1-1M6 22l1 1M18 2l1-1M22 6l1 1" stroke="#ff0055" strokeWidth="1.5" />
    </svg>
  ),
  eraser: <Eraser size={15} />,
};

/**
 * 1. MOBILE BOTTOM-RIGHT TOOL SELECTOR DROPDOWN (Pops up upwards)
 */
export const MobileToolDropdown: React.FC<{
  activeTool: ToolType;
  onSelectTool: (tool: ToolType) => void;
  onOpenAi?: () => void;
  theme?: "light" | "dark";
}> = ({ activeTool, onSelectTool, onOpenAi, theme = "light" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isLight = theme === "light";

  const activeToolDef =
    SUPPORTED_TOOLS.find((t) => t.id === activeTool) || SUPPORTED_TOOLS[0];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border shadow-lg transition-all cursor-pointer select-none ${
          isLight
            ? "bg-white/95 border-white/90 text-[#27221e] hover:bg-white"
            : "bg-[#181c28]/95 border-white/10 text-white hover:bg-[#202536]"
        }`}
      >
        <span className="text-[#c45a2c]">{ICONS[activeTool]}</span>
        <span className="text-xs font-semibold">{activeToolDef.label}</span>
        <ChevronUp
          size={13}
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#c45a2c]" : "text-slate-400"
          }`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div
            className={`absolute right-0 bottom-11 z-50 w-64 p-2 rounded-2xl border shadow-2xl backdrop-blur-2xl animate-in zoom-in-95 duration-150 select-none ${
              isLight
                ? "bg-white/98 border-black/10 text-[#27221e]"
                : "bg-[#181c28]/98 border-white/15 text-slate-100"
            }`}
          >
            {/* AI Trigger Option inside Dropdown */}
            {onOpenAi && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenAi();
                }}
                className="w-full flex items-center justify-center gap-2 p-2 mb-1.5 rounded-xl bg-violet-600/10 hover:bg-violet-600/20 text-violet-700 dark:text-violet-300 text-xs font-bold transition-all cursor-pointer border border-violet-500/20"
              >
                <Sparkles size={14} className="text-violet-500 animate-pulse" />
                <span>✨ Coboard AI Copilot</span>
              </button>
            )}

            <div className="grid grid-cols-3 gap-1.5">
              {SUPPORTED_TOOLS.map((tool) => {
                const isSelected = activeTool === tool.id;
                return (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => {
                      onSelectTool(tool.id);
                      setIsOpen(false);
                    }}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl text-center transition-all cursor-pointer ${
                      isSelected
                        ? isLight
                          ? "bg-[#2c241e] text-white shadow-md font-semibold"
                          : "bg-violet-600 text-white shadow-lg font-semibold"
                        : isLight
                        ? "hover:bg-black/5 text-[#5a4d42]"
                        : "hover:bg-white/10 text-slate-300"
                    }`}
                  >
                    <span className="mb-1">{ICONS[tool.id]}</span>
                    <span className="text-[10px] truncate max-w-full">
                      {tool.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

/**
 * 2. DESKTOP TOP-CENTER TOOLBAR (Horizontal strip)
 */
export const CanvasToolbar: React.FC<CanvasToolbarProps> = ({
  activeTool,
  onSelectTool,
  theme = "light",
}) => {
  const isLight = theme === "light";

  return (
    <div
      className={`hidden sm:flex items-center gap-1 p-1 rounded-full border shadow-lg transition-colors duration-300 ${
        isLight
          ? "bg-white/90 backdrop-blur-2xl border-white/90 shadow-[0_8px_25px_rgba(0,0,0,0.06)] text-[#27221e]"
          : "bg-[#181c28]/95 backdrop-blur-2xl border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.5)] text-slate-100"
      }`}
    >
      {SUPPORTED_TOOLS.map((tool) => {
        const isSelected = activeTool === tool.id;
        return (
          <button
            key={tool.id}
            onClick={() => onSelectTool(tool.id)}
            title={`${tool.label} (${tool.shortcut}) — ${tool.description}`}
            aria-label={`${tool.label} (${tool.shortcut})`}
            className={`p-2.5 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
              isSelected
                ? isLight
                  ? "bg-[#2c241e] text-white shadow-md scale-105"
                  : "bg-violet-600 text-white shadow-lg scale-105"
                : isLight
                ? "text-[#6e6054] hover:text-[#27221e] hover:bg-black/[0.05]"
                : "text-slate-400 hover:text-white hover:bg-white/10"
            }`}
          >
            {ICONS[tool.id] || <Square size={15} />}
          </button>
        );
      })}
    </div>
  );
};
