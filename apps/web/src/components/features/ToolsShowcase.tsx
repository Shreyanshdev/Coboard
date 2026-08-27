"use client";

import React, { useState } from "react";
import { SUPPORTED_TOOLS } from "@/lib/constants";
import { ToolType } from "@/types";
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
  Image as ImageIcon,
  Zap,
  Eraser,
  Command,
  Sparkles,
} from "lucide-react";

const TOOL_ICONS: Record<string, React.ReactNode> = {
  select: <MousePointer className="w-4 h-4" />,
  hand: <Hand className="w-4 h-4" />,
  pencil: <Pencil className="w-4 h-4" />,
  highlighter: <Highlighter className="w-4 h-4" />,
  rectangle: <Square className="w-4 h-4" />,
  circle: <Circle className="w-4 h-4" />,
  line: <Minus className="w-4 h-4" />,
  arrow: <ArrowUpRight className="w-4 h-4" />,
  text: <Type className="w-4 h-4" />,
  image: <ImageIcon className="w-4 h-4" />,
  laser: <Zap className="w-4 h-4" />,
  eraser: <Eraser className="w-4 h-4" />,
};

const TOOL_FUN_NOTES: Record<string, { note: string; emoji: string; color: string; arrow: string }> = {
  select: {
    note: '🖱️ "Grab, drag & rotate anything"',
    emoji: "👆",
    color: "#3b82f6",
    arrow: "M10 5 Q 30 15, 45 35 L 36 36 M 45 35 L 43 25",
  },
  hand: {
    note: '✋ "Infinite pan across 10,000px canvas"',
    emoji: "🌍",
    color: "#059669",
    arrow: "M45 5 Q 25 15, 10 35 L 18 37 M 10 35 L 12 25",
  },
  pencil: {
    note: '✏️ "Organic strokes like real sketch paper"',
    emoji: "📝",
    color: "#c45a2c",
    arrow: "M10 10 Q 30 25, 50 40 L 40 42 M 50 40 L 48 30",
  },
  highlighter: {
    note: '🖍️ "40% translucent neon highlighter"',
    emoji: "✨",
    color: "#eab308",
    arrow: "M50 5 Q 30 20, 10 35 L 20 37 M 10 35 L 12 25",
  },
  rectangle: {
    note: '📦 "Rounded sketchy cards & backend boxes"',
    emoji: "📐",
    color: "#8b5cf6",
    arrow: "M10 5 Q 25 20, 45 40 L 35 41 M 45 40 L 44 30",
  },
  circle: {
    note: '⭕ "Hand-drawn ellipses & database bubbles"',
    emoji: "🫧",
    color: "#ec4899",
    arrow: "M45 10 Q 25 25, 10 40 L 19 41 M 10 40 L 12 30",
  },
  line: {
    note: '📏 "Clean dividers & direct system links"',
    emoji: "⚡",
    color: "#64748b",
    arrow: "M10 10 Q 30 25, 50 40 L 41 42 M 50 40 L 49 30",
  },
  arrow: {
    note: '➡️ "Flowchart directional pointers"',
    emoji: "🎯",
    color: "#f97316",
    arrow: "M45 5 Q 25 20, 10 35 L 20 37 M 10 35 L 12 25",
  },
  text: {
    note: '🔤 "5 fonts: Caveat, Kalam, Architect & Mono"',
    emoji: "✍️",
    color: "#6366f1",
    arrow: "M10 5 Q 25 20, 45 40 L 36 41 M 45 40 L 44 30",
  },
  image: {
    note: '🖼️ "Drop memes & architecture mockups"',
    emoji: "📸",
    color: "#14b8a6",
    arrow: "M45 10 Q 25 25, 10 40 L 19 41 M 10 40 L 12 30",
  },
  laser: {
    note: '🪄 "Glows like a sci-fi presentation laser"',
    emoji: "🌟",
    color: "#f43f5e",
    arrow: "M10 10 Q 30 25, 50 40 L 41 42 M 50 40 L 49 30",
  },
  eraser: {
    note: '🧽 "One-click delete unwanted strokes"',
    emoji: "🗑️",
    color: "#ef4444",
    arrow: "M45 5 Q 25 20, 10 35 L 20 37 M 10 35 L 12 25",
  },
};

export const ToolsShowcase: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolType>("pencil");

  const currentConfig = SUPPORTED_TOOLS.find((t) => t.id === activeTool) || SUPPORTED_TOOLS[0];
  const funMeta = TOOL_FUN_NOTES[currentConfig.id] || TOOL_FUN_NOTES["pencil"];

  return (
    <section id="tools" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative z-20 select-none">
      {/* Symmetrical Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/80 border border-[#c45a2c]/30 shadow-sm backdrop-blur-md">
          <Sparkles size={13} className="text-[#c45a2c]" />
          <span className="font-handwriting text-sm font-bold text-[#c45a2c] -rotate-1">
            ~ 12 handcrafted vector tools
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-light text-[#27221e] tracking-tight">
          Everything You Need to <span className="font-handwriting font-bold text-[#c45a2c] -rotate-2 inline-block">Sketch Naturally</span>
        </h2>

        <p className="text-xs sm:text-sm text-[#6e6054] max-w-lg mx-auto leading-relaxed">
          From laser pointers for presentations to multi-tier architecture boxes, all 12 primitives are strictly validated with shared TypeScript schemas.
        </p>
      </div>

      {/* Symmetrical Balanced Layout: 12-Tool Grid (Left) + Interactive Dynamic Showcase (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-stretch">
        {/* Left Side: 12-Tool Symmetrical 2x6 Button Grid */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold text-[#5a4d42]">Click any tool to inspect:</span>
            <div className="flex items-center gap-1 text-[11px] font-handwriting text-[#059669] -rotate-1">
              <span>shortcuts 1–9 &amp; H, D, K</span>
              <svg className="w-4 h-4 text-[#059669]" viewBox="0 0 25 25" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M5 8 Q 12 12, 16 18" />
                <path d="M11 16 L 16 18 L 18 12" />
              </svg>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {SUPPORTED_TOOLS.map((tool) => {
              const isSelected = activeTool === tool.id;
              const meta = TOOL_FUN_NOTES[tool.id] || TOOL_FUN_NOTES["pencil"];

              return (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  className={`group relative p-3 rounded-2xl border transition-all duration-200 text-left flex flex-col justify-between min-h-[76px] cursor-pointer ${
                    isSelected
                      ? "bg-white text-[#27221e] shadow-md border-[#c45a2c]/40 scale-[1.03] ring-2 ring-[#c45a2c]/20"
                      : "bg-white/50 hover:bg-white/80 text-[#5c4e43] border-white/80 hover:scale-[1.01]"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center transition-transform group-hover:rotate-6 ${
                        isSelected
                          ? "bg-[#2d221b] text-white shadow-xs"
                          : "bg-white/80 text-[#5c4e43] border border-black/5"
                      }`}
                    >
                      {TOOL_ICONS[tool.id]}
                    </div>

                    <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-md bg-black/[0.04] text-[#78695d]">
                      {tool.shortcut}
                    </span>
                  </div>

                  <div>
                    <span className="font-semibold text-xs text-[#27221e] block truncate">
                      {tool.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Detail Card with Colorful Rounded Arrow & Playful Sticky Note */}
        <div className="lg:col-span-6 rounded-[32px] p-6 sm:p-8 bg-white/85 border border-white/90 shadow-[0_12px_35px_rgba(0,0,0,0.04)] backdrop-blur-2xl flex flex-col justify-between relative overflow-hidden">
          {/* Subtle background glow */}
          <div
            className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-30 pointer-events-none transition-all duration-500"
            style={{ backgroundColor: funMeta.color }}
          />

          <div className="space-y-5 relative z-10">
            {/* Tool Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md transition-transform duration-300 hover:rotate-12"
                  style={{ backgroundColor: funMeta.color }}
                >
                  {TOOL_ICONS[currentConfig.id]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-[#27221e]">{currentConfig.label}</h3>
                    <span className="text-xl">{funMeta.emoji}</span>
                  </div>
                  <p className="text-xs font-mono text-[#8a5d3b]">ToolType: &apos;{currentConfig.id}&apos;</p>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-1 px-3 py-1 rounded-full bg-black/5 border border-black/5 text-xs font-mono font-semibold text-[#5a4d42]">
                <Command size={12} /> {currentConfig.shortcut}
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-[#64564c] leading-relaxed">
              {currentConfig.description}. Supports customizable stroke width, organic roughness, fill patterns, and instantaneous sub-millisecond WebSocket broadcast.
            </p>

            {/* Funny Handwritten Sticky Tag with Curvy Rounded Arrow */}
            <div className="p-3.5 rounded-2xl bg-black/[0.03] border border-black/5 flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-[#8c7b6f] uppercase tracking-wider block">Pro-Tip &amp; Behavior</span>
                <span className="font-handwriting text-sm font-bold text-[#2d221b] -rotate-1 block">
                  {funMeta.note}
                </span>
              </div>

              {/* Colorful Curvy Arrow */}
              <svg
                className="w-12 h-8 -rotate-2 select-none shrink-0"
                viewBox="0 0 60 45"
                fill="none"
                stroke={funMeta.color}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d={funMeta.arrow} />
              </svg>
            </div>

            {/* Shared TypeScript Schema Box */}
            <div className="bg-white/70 backdrop-blur-md rounded-2xl p-4 border border-white/90 font-mono text-xs text-[#44382f] space-y-1 shadow-inner">
              <div className="flex items-center justify-between text-[#8c7b6f] text-[10px] pb-1 border-b border-black/5">
                <span>// @repo/common/src/types.ts</span>
                <span className="font-semibold text-emerald-600">✓ Zod Validated</span>
              </div>
              <div className="text-[#704214] pt-1">interface CanvasElement &#123;</div>
              <div className="pl-4 text-[#332a22]">
                id: string; type: <span className="font-bold text-[#b05220]">&quot;{currentConfig.id}&quot;</span>;
              </div>
              <div className="pl-4 text-[#78695d]">
                x: number; y: number; width?: number; height?: number;
              </div>
              <div className="pl-4 text-[#78695d]">
                strokeColor: string; fillColor: string; roughness: number;
              </div>
              <div className="text-[#704214]">&#125;</div>
            </div>
          </div>

          {/* Bottom Features Footer */}
          <div className="pt-4 border-t border-black/5 flex flex-wrap items-center justify-between text-[11px] text-[#736357] gap-2 mt-4 relative z-10">
            <span className="font-handwriting text-sm text-[#7c3aed]">
              ~ Supports Caveat, Kalam, Architect &amp; Mono typography
            </span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Real-Time Sync Ready
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
