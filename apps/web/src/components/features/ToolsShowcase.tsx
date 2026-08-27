"use client";

import React, { useState } from "react";
import { SUPPORTED_TOOLS } from "@/lib/constants";
import { ToolType } from "@/types";
import { Badge } from "../ui/Badge";
import {
  MousePointer,
  Hand,
  Pencil,
  Square,
  Circle,
  Minus,
  ArrowUpRight,
  Type,
  Eraser,
  Command,
} from "lucide-react";

const TOOL_ICONS: Record<string, React.ReactNode> = {
  select: <MousePointer className="w-3.5 h-3.5" />,
  hand: <Hand className="w-3.5 h-3.5" />,
  pencil: <Pencil className="w-3.5 h-3.5" />,
  rectangle: <Square className="w-3.5 h-3.5" />,
  circle: <Circle className="w-3.5 h-3.5" />,
  line: <Minus className="w-3.5 h-3.5" />,
  arrow: <ArrowUpRight className="w-3.5 h-3.5" />,
  text: <Type className="w-3.5 h-3.5" />,
  eraser: <Eraser className="w-3.5 h-3.5" />,
};

export const ToolsShowcase: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolType>("pencil");

  const currentConfig = SUPPORTED_TOOLS.find((t) => t.id === activeTool) || SUPPORTED_TOOLS[0];

  return (
    <section id="tools" className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-handwriting text-2xl text-[#c45a2c] -rotate-3 select-none">
              ~ full tool suite
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-light text-[#27221e] tracking-tight">
            9 Built-In Drawing Primitives
          </h2>
        </div>
        <p className="text-xs text-[#78695d] max-w-sm">
          Synchronized strictly with shared TypeScript types (`@repo/common`).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Compact Horizontal / Grid Tool Selector */}
        <div className="lg:col-span-4 space-y-2">
          {/* Emerald Green Curvy Annotation */}
          <div className="hidden sm:flex items-center gap-1 font-handwriting text-lg text-[#059669] -rotate-2 select-none mb-1">
            <span>press keys 1–9 to switch</span>
            <svg className="w-5 h-5 text-[#059669]" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M5 10 Q 15 15, 18 25" />
              <path d="M12 21 L 18 25 L 22 18" />
            </svg>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-1.5">
            {SUPPORTED_TOOLS.map((tool) => {
              const isSelected = activeTool === tool.id;
              return (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-full border transition-all duration-200 text-left cursor-pointer ${
                    isSelected
                      ? "bg-white text-[#27221e] shadow-sm border-white scale-[1.01]"
                      : "bg-white/40 text-[#6e6054] hover:text-[#27221e] hover:bg-white/70 border-white/60"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-6.5 h-6.5 rounded-full flex items-center justify-center ${
                        isSelected ? "bg-[#2d221b] text-white" : "bg-white/70 text-[#6e6054]"
                      }`}
                    >
                      {TOOL_ICONS[tool.id]}
                    </div>
                    <div>
                      <span className="font-medium text-xs block">{tool.label}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 bg-black/[0.04] px-2 py-0.5 rounded-full text-[10px] font-mono text-[#78695d]">
                    <Command className="w-2 h-2" /> {tool.shortcut}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Detail Card with Handwritten schema indicator */}
        <div className="lg:col-span-8 liquid-glass-card p-6 sm:p-8 rounded-[32px] border border-white/85 shadow-lg relative overflow-hidden flex flex-col justify-between min-h-[340px]">
          {/* Dynamic Dot Matrix Hover Pattern */}
          <div className="card-dot-pattern" />

          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/85 border border-white flex items-center justify-center text-[#27221e] shadow-sm">
                  {TOOL_ICONS[currentConfig.id]}
                </div>
                <div>
                  <h3 className="text-xl font-normal text-[#27221e]">{currentConfig.label}</h3>
                  <p className="text-[11px] text-[#8a5d3b] font-mono">ToolType: &apos;{currentConfig.id}&apos;</p>
                </div>
              </div>

              {/* Sky Blue Curvy Annotation */}
              <div className="font-handwriting text-xl text-[#0284c7] -rotate-2 select-none hidden sm:flex items-center gap-1.5">
                <span>shortcut [{currentConfig.shortcut}]</span>
                <svg className="w-6 h-6 text-[#0284c7]" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M10 20 Q 25 10, 32 25" />
                  <path d="M25 25 L 32 25 L 30 18" />
                </svg>
              </div>
            </div>

            <p className="text-[#64564c] text-xs sm:text-sm leading-relaxed">
              {currentConfig.description}. Customizable stroke &amp; fill colors, variable roughness factors for natural hand-drawn simulation, and real-time WebSocket sync.
            </p>

            {/* Code type contract preview with Warm Gold Curvy Annotation */}
            <div className="relative">
              <div className="bg-white/70 backdrop-blur-md rounded-2xl p-4 border border-white/90 font-mono text-xs text-[#44382f] space-y-1 shadow-inner">
                <div className="flex items-center justify-between">
                  <div className="text-[#8c7b6f] text-[10px]">// Shared TypeScript Schema (@repo/common)</div>
                  <div className="hidden sm:flex items-center gap-1 font-handwriting text-base text-[#b45309] -rotate-1 select-none">
                    <span>zod validated</span>
                    <svg className="w-4 h-4 text-[#b45309]" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                      <path d="M5 8 Q 15 12, 20 22" />
                      <path d="M14 20 L 20 22 L 22 16" />
                    </svg>
                  </div>
                </div>
                <div className="text-[#704214]">
                  interface CanvasElement &#123;
                </div>
                <div className="pl-4 text-[#332a22]">
                  id: string; type: <span className="text-[#b05220] font-semibold">&quot;{currentConfig.id}&quot;</span>; x: number; y: number;
                  strokeColor: string; fillColor: string; roughness: number;
                </div>
                <div className="text-[#704214]">&#125;</div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/60 flex flex-wrap items-center justify-between text-[11px] text-[#736357] gap-2">
            <span className="font-handwriting text-base text-[#7c3aed]">
              ~ 5 handwriting fonts: Caveat, Kalam, Architect, Chillax &amp; Mono!
            </span>
            <span className="text-[#25633e] font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#25633e] animate-pulse" />
              Sub-millisecond WebSocket Broadcast
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
