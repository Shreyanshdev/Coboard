"use client";

import React from "react";
import {
  Pipette,
  ChevronsDown,
  ChevronDown,
  ChevronUp,
  ChevronsUp,
  Bold,
  Italic,
} from "lucide-react";

import { FontFamily } from "@/types";
import { FontPicker } from "./FontPicker";

interface PropertiesPanelProps {
  strokeColor: string;
  setStrokeColor: (color: string) => void;
  fillColor: string;
  setFillColor: (color: string) => void;
  strokeWidth: number;
  setStrokeWidth: (width: number) => void;
  strokeStyle?: "solid" | "dashed" | "dotted";
  setStrokeStyle?: (style: "solid" | "dashed" | "dotted") => void;
  roughness: number;
  setRoughness: (roughness: number) => void;
  edges?: "round" | "sharp";
  setEdges?: (edges: "round" | "sharp") => void;
  arrowhead?: "sharp" | "sketchy" | "dot" | "bar";
  setArrowhead?: (style: "sharp" | "sketchy" | "dot" | "bar") => void;
  arrowType?: "straight" | "curved";
  setArrowType?: (type: "straight" | "curved") => void;
  opacity?: number;
  setOpacity?: (opacity: number) => void;
  fontFamily?: FontFamily;
  setFontFamily?: (font: FontFamily) => void;
  fontWeight?: "normal" | "bold";
  setFontWeight?: (weight: "normal" | "bold") => void;
  fontStyle?: "normal" | "italic";
  setFontStyle?: (style: "normal" | "italic") => void;
  onSendToBack?: () => void;
  onSendBackward?: () => void;
  onBringForward?: () => void;
  onBringToFront?: () => void;
  activeTool?: string;
  selectedType?: string;
  theme?: "light" | "dark";
  canvasBgColor?: string;
  setCanvasBgColor?: (color: string) => void;
}

const STROKE_PALETTE = ["#d0d0d0", "#ff8787", "#38d9a9", "#4dabf7", "#f76707"];

const FILL_PALETTE = [
  "transparent",
  "rgba(255, 135, 135, 0.25)",
  "rgba(56, 217, 169, 0.25)",
  "rgba(77, 171, 247, 0.25)",
  "rgba(247, 103, 7, 0.25)",
];

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  strokeColor,
  setStrokeColor,
  fillColor,
  setFillColor,
  strokeWidth,
  setStrokeWidth,
  strokeStyle = "solid",
  setStrokeStyle,
  roughness,
  setRoughness,
  edges = "round",
  setEdges,
  arrowhead = "sketchy",
  setArrowhead,
  arrowType = "straight",
  setArrowType,
  opacity = 100,
  setOpacity,
  fontFamily = "caveat",
  setFontFamily,
  fontWeight = "normal",
  setFontWeight,
  fontStyle = "normal",
  setFontStyle,
  onSendToBack,
  onSendBackward,
  onBringForward,
  onBringToFront,
  activeTool = "rectangle",
  selectedType,
  theme = "dark",
  canvasBgColor,
  setCanvasBgColor,
}) => {
  const isLight = theme === "light";
  const isArrowContext = activeTool === "arrow" || selectedType === "arrow";
  const isRectContext = activeTool === "rectangle" || selectedType === "rectangle";
  const isTextContext = activeTool === "text" || selectedType === "text";

  // Shared classes for control buttons (active vs inactive)
  const getButtonClass = (isActive: boolean) =>
    `h-8 rounded-lg border text-xs font-medium flex items-center justify-center transition-all cursor-pointer select-none ${
      isActive
        ? isLight
          ? "bg-[#27221e] text-white border-[#27221e] shadow-sm ring-1 ring-black/10"
          : "bg-violet-600/20 text-violet-200 border-violet-500/60 shadow-sm ring-1 ring-violet-400/30"
        : isLight
        ? "bg-black/[0.03] text-[#5a4d42] border-black/[0.06] hover:bg-black/[0.07] hover:text-[#27221e]"
        : "bg-white/[0.04] text-slate-300 border-white/[0.08] hover:bg-white/[0.08] hover:text-white"
    }`;

  const labelClass = `text-[11px] font-semibold tracking-wide uppercase ${
    isLight ? "text-neutral-500" : "text-slate-400"
  }`;

  return (
    <div
      className={`relative rounded-2xl border shadow-2xl w-64 select-none transition-colors duration-300 ${
        isLight
          ? "bg-white/95 backdrop-blur-2xl border-black/[0.08] text-[#27221e] shadow-[0_12px_32px_rgba(0,0,0,0.06)]"
          : "bg-[#141721]/95 backdrop-blur-2xl border-white/[0.1] text-slate-100 shadow-[0_16px_40px_rgba(0,0,0,0.5)]"
      }`}
    >
      {/* Scrollable container with top/bottom fade mask */}
      <div className="p-3.5 space-y-4 max-h-[calc(100vh-160px)] overflow-y-auto overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [mask-image:linear-gradient(to_bottom,transparent_0%,black_16px,black_calc(100%-16px),transparent_100%)]">
        {/* 1. STROKE COLOR */}
        <div className="space-y-2">
          <label className={labelClass}>Stroke</label>
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1.5 flex-1">
              {STROKE_PALETTE_MAP(STROKE_PALETTE, strokeColor, setStrokeColor, isLight)}
            </div>

            <div className="w-[1px] h-4 bg-black/10 dark:bg-white/10 mx-0.5" />

            {/* Custom Color Input */}
            <div className="relative group">
              <input
                type="color"
                value={strokeColor.startsWith("#") ? strokeColor : "#ffffff"}
                onChange={(e) => setStrokeColor(e.target.value)}
                className="w-6 h-6 rounded-full border border-black/10 dark:border-white/10 p-0 cursor-pointer overflow-hidden opacity-0 absolute inset-0 z-10"
              />
              <button
                type="button"
                className={`w-6 h-6 rounded-full border border-dashed flex items-center justify-center transition-all ${
                  isLight
                    ? "border-black/30 hover:border-black text-[#5a4d42]"
                    : "border-white/30 hover:border-white text-slate-300"
                }`}
                title="Custom Stroke Color"
              >
                <Pipette size={12} />
              </button>
            </div>
          </div>
        </div>

        {/* 2. BACKGROUND / FILL COLOR */}
        {!isTextContext && (
          <div className="space-y-2">
            <label className={labelClass}>Background</label>
            <div className="flex items-center justify-between gap-1">
              <div className="flex items-center gap-1.5 flex-1">
                {FILL_PALETTE.map((c) => {
                  const isSelected = fillColor.toLowerCase() === c.toLowerCase();
                  return (
                    <button
                      key={c}
                      onClick={() => setFillColor(c)}
                      className={`w-6 h-6 rounded-full border transition-all cursor-pointer relative ${
                        isSelected
                          ? isLight
                            ? "ring-2 ring-neutral-900 ring-offset-2 ring-offset-white scale-110"
                            : "ring-2 ring-violet-400 ring-offset-2 ring-offset-[#141721] scale-110"
                          : "border-black/10 dark:border-white/10 hover:scale-105 opacity-90 hover:opacity-100"
                      }`}
                      style={{ backgroundColor: c }}
                      title={c === "transparent" ? "Transparent" : c}
                    >
                      {c === "transparent" && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-full h-[1.5px] bg-rose-500 rotate-45" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="w-[1px] h-4 bg-black/10 dark:bg-white/10 mx-0.5" />

              {/* Custom Fill Color Input */}
              <div className="relative group">
                <input
                  type="color"
                  value={fillColor.startsWith("#") ? fillColor : "#3b82f6"}
                  onChange={(e) => setFillColor(e.target.value)}
                  className="w-6 h-6 rounded-full border border-black/10 dark:border-white/10 p-0 cursor-pointer overflow-hidden opacity-0 absolute inset-0 z-10"
                />
                <button
                  type="button"
                  className={`w-6 h-6 rounded-full border border-dashed flex items-center justify-center transition-all ${
                    isLight
                      ? "border-black/30 hover:border-black text-[#5a4d42]"
                      : "border-white/30 hover:border-white text-slate-300"
                  }`}
                  title="Custom Fill Color"
                >
                  <Pipette size={12} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3. STROKE WIDTH / FONT SIZE SLIDER */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className={labelClass}>
              {isTextContext ? "Font Size" : "Stroke Width"}
            </label>
            <span
              className={`font-mono text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                isLight
                  ? "bg-neutral-200/90 text-neutral-800 border border-black/10"
                  : "bg-white/10 text-violet-300 border border-white/10"
              }`}
            >
              {strokeWidth}px
            </span>
          </div>

          <div className="relative flex items-center py-1">
            <input
              type="range"
              min="1"
              max={isTextContext ? "12" : "10"}
              step="0.5"
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(Number(e.target.value))}
              className={`w-full h-2 rounded-lg appearance-none cursor-pointer accent-violet-600 transition-all ${
                isLight
                  ? "bg-neutral-300 hover:bg-neutral-400/80 ring-1 ring-black/15"
                  : "bg-white/15 hover:bg-white/25 ring-1 ring-white/15"
              }`}
            />
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            {[
              { id: 1.5, label: "Thin" },
              { id: 2.5, label: "Medium" },
              { id: 4.0, label: "Bold" },
              { id: 6.0, label: "Extra" },
            ].map((sw) => (
              <button
                key={sw.id}
                type="button"
                onClick={() => setStrokeWidth(sw.id)}
                className={getButtonClass(Math.abs(strokeWidth - sw.id) < 0.2)}
              >
                <span className="text-[11px]">{sw.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 4. STROKE STYLE (SOLID, DASHED, DOTTED) */}
        {!isTextContext && setStrokeStyle && (
          <div className="space-y-1.5">
            <label className={labelClass}>Stroke Style</label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: "solid" as const, label: "Solid", dash: "border-solid" },
                { id: "dashed" as const, label: "Dashed", dash: "border-dashed" },
                { id: "dotted" as const, label: "Dotted", dash: "border-dotted" },
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => setStrokeStyle(st.id)}
                  className={getButtonClass(strokeStyle === st.id)}
                >
                  <div
                    className={`w-8 h-0 border-t-2 ${st.dash} ${
                      strokeStyle === st.id
                        ? isLight
                          ? "border-white"
                          : "border-violet-300"
                        : isLight
                        ? "border-[#5a4d42]"
                        : "border-slate-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 5. SLOElement Sloppiness / Roughness */}
        {!isTextContext && (
          <div className="space-y-1.5">
            <label className={labelClass}>Sloppiness</label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 0, label: "Architect" },
                { id: 1.4, label: "Artist" },
                { id: 2.8, label: "Cartoonist" },
              ].map((sl) => (
                <button
                  key={sl.id}
                  onClick={() => setRoughness(sl.id)}
                  className={getButtonClass(roughness === sl.id)}
                >
                  <span className="font-handwriting text-base font-bold leading-none">
                    {sl.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 6. ARROWHEAD STYLES */}
        {isArrowContext && setArrowhead && (
          <div className="space-y-1.5">
            <label className={labelClass}>Arrowhead Style</label>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { id: "sharp" as const, label: "➔" },
                { id: "sketchy" as const, label: "⤅" },
                { id: "dot" as const, label: "●➔" },
                { id: "bar" as const, label: "|➔" },
              ].map((ah) => (
                <button
                  key={ah.id}
                  onClick={() => setArrowhead(ah.id)}
                  className={getButtonClass(arrowhead === ah.id)}
                >
                  <span className="text-xs font-semibold">{ah.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 7. ARROW TYPE */}
        {isArrowContext && setArrowType && (
          <div className="space-y-1.5">
            <label className={labelClass}>Arrow Curvature</label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: "straight" as const, label: "Straight (—➔)" },
                { id: "curved" as const, label: "Curved (⤹)" },
              ].map((at) => (
                <button
                  key={at.id}
                  onClick={() => setArrowType(at.id)}
                  className={getButtonClass(arrowType === at.id)}
                >
                  <span className="text-[11px]">{at.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 8. EDGES (ROUND VS SHARP) */}
        {isRectContext && setEdges && (
          <div className="space-y-1.5">
            <label className={labelClass}>Edges</label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: "sharp" as const, label: "Sharp" },
                { id: "round" as const, label: "Round" },
              ].map((ed) => (
                <button
                  key={ed.id}
                  onClick={() => setEdges(ed.id)}
                  className={getButtonClass(edges === ed.id)}
                >
                  <span className="text-[11px]">{ed.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 9. TYPOGRAPHY (40+ FONTS DROPDOWN + BOLD & ITALIC) */}
        {(isTextContext || setFontFamily) && setFontFamily && (
          <div className="space-y-2.5 pt-2 border-t border-black/[0.06] dark:border-white/[0.08]">
            <div className="flex items-center justify-between">
              <label className={labelClass}>Typography</label>
              <span className="text-[10px] text-violet-500 font-mono font-medium">
                42 Fonts
              </span>
            </div>

            {/* Modular 42+ Font Dropdown with Search & Categories */}
            <FontPicker
              fontFamily={fontFamily}
              setFontFamily={setFontFamily}
              isLight={isLight}
            />

            {/* Bold & Italic Style Toggles */}
            <div className="grid grid-cols-2 gap-1.5">
              {setFontWeight && (
                <button
                  type="button"
                  onClick={() =>
                    setFontWeight(fontWeight === "bold" ? "normal" : "bold")
                  }
                  title="Toggle Bold Style"
                  className={getButtonClass(fontWeight === "bold")}
                >
                  <div className="flex items-center gap-1.5">
                    <Bold size={13} />
                    <span className="font-bold">Bold</span>
                  </div>
                </button>
              )}

              {setFontStyle && (
                <button
                  type="button"
                  onClick={() =>
                    setFontStyle(fontStyle === "italic" ? "normal" : "italic")
                  }
                  title="Toggle Italic Style"
                  className={getButtonClass(fontStyle === "italic")}
                >
                  <div className="flex items-center gap-1.5">
                    <Italic size={13} />
                    <span className="italic font-serif">Italic</span>
                  </div>
                </button>
              )}
            </div>
          </div>
        )}

        {/* 10. OPACITY SLIDER */}
        {setOpacity && (
          <div className="space-y-2 pt-2 border-t border-black/[0.06] dark:border-white/[0.08]">
            <div className="flex items-center justify-between">
              <label className={labelClass}>Opacity</label>
              <span
                className={`font-mono text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                  isLight
                    ? "bg-neutral-200/90 text-neutral-800 border border-black/10"
                    : "bg-white/10 text-violet-300 border border-white/10"
                }`}
              >
                {opacity}%
              </span>
            </div>
            <div className="relative flex items-center py-1">
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                className={`w-full h-2 rounded-lg appearance-none cursor-pointer accent-violet-600 transition-all ${
                  isLight
                    ? "bg-neutral-300 hover:bg-neutral-400/80 ring-1 ring-black/15"
                    : "bg-white/15 hover:bg-white/25 ring-1 ring-white/15"
                }`}
              />
            </div>
          </div>
        )}

        {/* 11. LAYERS */}
        <div className="space-y-1.5 pt-2 border-t border-black/[0.06] dark:border-white/[0.08]">
          <label className={labelClass}>Layers</label>
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { icon: ChevronsDown, fn: onSendToBack, title: "Send to back" },
              { icon: ChevronDown, fn: onSendBackward, title: "Send backward" },
              { icon: ChevronUp, fn: onBringForward, title: "Bring forward" },
              { icon: ChevronsUp, fn: onBringToFront, title: "Bring to front" },
            ].map((layer, idx) => {
              const Icon = layer.icon;
              return (
                <button
                  key={idx}
                  onClick={layer.fn}
                  title={layer.title}
                  className={getButtonClass(false)}
                >
                  <Icon size={14} />
                </button>
              );
            })}
          </div>
        </div>

        {/* 12. CANVAS BACKGROUND */}
        {setCanvasBgColor && (
          <div className="space-y-2 pt-2 border-t border-black/[0.06] dark:border-white/[0.08]">
            <label className={labelClass}>Canvas Background</label>
            <div className="flex items-center gap-2">
              {(isLight
                ? [
                    { name: "Warm Cream", color: "#dedcd9" },
                    { name: "Soft White", color: "#f8f9fa" },
                    { name: "Parchment", color: "#f4efe6" },
                    { name: "Pure White", color: "#ffffff" },
                  ]
                : [
                    { name: "Deep Onyx", color: "#12151c" },
                    { name: "Charcoal", color: "#18181b" },
                    { name: "Midnight Navy", color: "#0f172a" },
                    { name: "Pure Black", color: "#000000" },
                  ]
              ).map((bg) => {
                const isSelected =
                  canvasBgColor?.toLowerCase() === bg.color.toLowerCase();
                return (
                  <button
                    key={bg.color}
                    onClick={() => setCanvasBgColor(bg.color)}
                    title={bg.name}
                    className={`w-6 h-6 rounded-full border transition-all cursor-pointer ${
                      isSelected
                        ? isLight
                          ? "ring-2 ring-neutral-900 ring-offset-2 ring-offset-white scale-110"
                          : "ring-2 ring-violet-400 ring-offset-2 ring-offset-[#141721] scale-110"
                        : "border-black/10 dark:border-white/10 hover:scale-105 opacity-80 hover:opacity-100"
                    }`}
                    style={{ backgroundColor: bg.color }}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function STROKE_PALETTE_MAP(
  palette: string[],
  strokeColor: string,
  setStrokeColor: (c: string) => void,
  isLight: boolean
) {
  return palette.map((c) => {
    const isSelected = strokeColor.toLowerCase() === c.toLowerCase();
    return (
      <button
        key={c}
        onClick={() => setStrokeColor(c)}
        className={`w-6 h-6 rounded-full border transition-all cursor-pointer relative ${
          isSelected
            ? isLight
              ? "ring-2 ring-neutral-900 ring-offset-2 ring-offset-white scale-110"
              : "ring-2 ring-violet-400 ring-offset-2 ring-offset-[#141721] scale-110"
            : "border-black/10 dark:border-white/10 hover:scale-105 opacity-90 hover:opacity-100"
        }`}
        style={{ backgroundColor: c }}
      />
    );
  });
}