"use client";

import React from "react";
import { ToolType } from "@/types";
import {
  Sun,
  Moon,
  Users,
  Share2,
  Check,
  Save,
  MoreHorizontal,
  Wand2,
  Image as ImageIcon,
  Grid,
  Download,
  Trash2,
} from "lucide-react";

interface ActionIslandProps {
  isLight: boolean;
  theme: "light" | "dark";
  toggleTheme: () => void;
  handleShareOrCollaborate: () => void;
  isSharingRoom: boolean;
  isCopied: boolean;
  isPersonal: boolean;
  handleSave: () => void;
  saveStatus: string | null;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  drawToShape: boolean;
  setDrawToShape: (val: boolean) => void;
  setActiveTool: (tool: ToolType) => void;
  showGrid: boolean;
  setShowGrid: (val: boolean) => void;
  canvasBgColor: string;
  handleSetCanvasBg: (color: string) => void;
  handleExportPNG: () => void;
  handleClear: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ActionIsland: React.FC<ActionIslandProps> = ({
  isLight,
  toggleTheme,
  handleShareOrCollaborate,
  isSharingRoom,
  isCopied,
  isPersonal,
  handleSave,
  saveStatus,
  isMenuOpen,
  setIsMenuOpen,
  drawToShape,
  setDrawToShape,
  setActiveTool,
  showGrid,
  setShowGrid,
  canvasBgColor,
  handleSetCanvasBg,
  handleExportPNG,
  handleClear,
  fileInputRef,
  handleImageUpload,
}) => {
  return (
    <div className="fixed top-2 sm:top-4 right-2 sm:right-4 z-40 flex items-center gap-1.5 pointer-events-auto">
      <div
        className={`flex items-center gap-1 sm:gap-1.5 p-1 rounded-full border shadow-md transition-colors ${
          isLight
            ? "bg-white/90 backdrop-blur-xl border-white/90 text-[#27221e]"
            : "bg-[#1e2330]/90 backdrop-blur-xl border-white/10 text-white"
        }`}
      >
        {/* 1. DESKTOP-ONLY DIRECT THEME SWITCH BUTTON */}
        <button
          onClick={toggleTheme}
          title={isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
          className={`hidden sm:flex p-1.5 sm:p-2 rounded-full transition-all cursor-pointer ${
            isLight
              ? "hover:bg-black/[0.06] text-[#4a3d34]"
              : "hover:bg-white/10 text-amber-300"
          }`}
        >
          {isLight ? <Moon size={14} /> : <Sun size={14} />}
        </button>

        {/* Share / Collaborate Button */}
        <button
          onClick={handleShareOrCollaborate}
          disabled={isSharingRoom}
          className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
            isLight
              ? "hover:bg-black/[0.06] text-[#382f28]"
              : "hover:bg-white/10 text-slate-200"
          }`}
        >
          {isSharingRoom ? (
            <span className="animate-spin text-xs">🌀</span>
          ) : isCopied ? (
            <Check size={13} className="text-emerald-500" />
          ) : isPersonal ? (
            <Users size={13} className="text-violet-400" />
          ) : (
            <Share2 size={13} />
          )}
          <span className="hidden sm:inline">
            {isSharingRoom
              ? "Sharing..."
              : isCopied
              ? "Copied Link"
              : isPersonal
              ? "Collaborate"
              : "Share"}
          </span>
        </button>

        {/* Save Button (Desktop text, mobile icon) */}
        <button
          onClick={handleSave}
          className={`flex items-center gap-1 px-2.5 sm:px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer shadow-sm ${
            isLight
              ? "bg-[#27221e] text-white hover:bg-black"
              : "bg-violet-600 text-white hover:bg-violet-500"
          }`}
        >
          <Save size={13} />
          <span className="hidden sm:inline">{saveStatus || "Save"}</span>
        </button>

        {/* 3-Dot Options Dropdown (Consolidated menu on mobile) */}
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            title="More Canvas Options"
            className={`p-1.5 sm:p-2 rounded-full transition-all cursor-pointer ${
              isMenuOpen
                ? "bg-violet-600 text-white"
                : isLight
                ? "hover:bg-black/[0.06] text-[#4a3d34]"
                : "hover:bg-white/10 text-slate-300 hover:text-white"
            }`}
          >
            <MoreHorizontal size={15} />
          </button>

          {isMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsMenuOpen(false)}
              />
              <div
                className={`absolute right-0 top-10 z-50 w-56 p-1.5 rounded-2xl border shadow-2xl backdrop-blur-2xl transition-all select-none ${
                  isLight
                    ? "bg-white/98 border-black/10 text-[#27221e]"
                    : "bg-[#1c202d]/98 border-white/10 text-slate-100"
                }`}
              >
                {/* Mobile-Only Theme Toggle Row */}
                <div className="sm:hidden pb-1 mb-1 border-b border-black/5 dark:border-white/5">
                  <button
                    onClick={() => {
                      toggleTheme();
                      setIsMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl transition-colors cursor-pointer ${
                      isLight ? "hover:bg-black/5" : "hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {isLight ? (
                        <Moon size={14} className="text-violet-500" />
                      ) : (
                        <Sun size={14} className="text-amber-400" />
                      )}
                      <span className="font-medium">
                        {isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
                      </span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-black/5 dark:bg-white/10">
                      {isLight ? "LIGHT" : "DARK"}
                    </span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    setDrawToShape(!drawToShape);
                    setIsMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl transition-colors cursor-pointer ${
                    isLight ? "hover:bg-black/5" : "hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Wand2 size={14} className="text-violet-500" />
                    <span className="font-medium">Draw to Shape</span>
                  </div>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                      drawToShape
                        ? "bg-violet-500 text-white font-bold"
                        : "bg-slate-200 dark:bg-slate-700 text-slate-500"
                    }`}
                  >
                    {drawToShape ? "ON" : "OFF"}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setActiveTool("laser");
                    setIsMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl transition-colors cursor-pointer ${
                    isLight ? "hover:bg-black/5" : "hover:bg-white/10"
                  }`}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-rose-500"
                  >
                    <path d="M15 4l5 5-10.5 10.5a1.5 1.5 0 0 1-1.06.44H5v-3.44a1.5 1.5 0 0 1 .44-1.06L15 4z" />
                    <path d="M13.5 5.5l5 5" />
                    <circle cx="4" cy="20" r="1.5" fill="#ff0055" stroke="none" />
                    <path
                      d="M2 18l-1-1M6 22l1 1M18 2l1-1M22 6l1 1"
                      stroke="#ff0055"
                      strokeWidth="1.5"
                    />
                  </svg>
                  <span className="font-medium">Laser Presentation</span>
                </button>

                <button
                  onClick={() => {
                    fileInputRef.current?.click();
                    setIsMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl transition-colors cursor-pointer ${
                    isLight ? "hover:bg-black/5" : "hover:bg-white/10"
                  }`}
                >
                  <ImageIcon size={14} className="text-emerald-500" />
                  <span className="font-medium">Insert Image</span>
                </button>

                <button
                  onClick={() => {
                    setShowGrid(!showGrid);
                    setIsMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl transition-colors cursor-pointer ${
                    isLight ? "hover:bg-black/5" : "hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Grid size={14} className="text-cyan-500" />
                    <span className="font-medium">Grid Background</span>
                  </div>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                      showGrid
                        ? "bg-cyan-500 text-white font-bold"
                        : "bg-slate-200 dark:bg-slate-700 text-slate-500"
                    }`}
                  >
                    {showGrid ? "ON" : "OFF"}
                  </span>
                </button>

                {/* Canvas Background Color Options */}
                <div className="px-3 py-2 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      Canvas Color
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {(isLight
                      ? [
                          { name: "Cream", color: "#dedcd9" },
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
                    ).map((bg) => (
                      <button
                        key={bg.color}
                        onClick={() => handleSetCanvasBg(bg.color)}
                        title={bg.name}
                        className={`w-6 h-6 rounded-md border transition-all cursor-pointer ${
                          canvasBgColor.toLowerCase() === bg.color.toLowerCase()
                            ? isLight
                              ? "ring-2 ring-[#27221e] ring-offset-1 scale-105"
                              : "ring-2 ring-violet-400 ring-offset-1 scale-105"
                            : "hover:scale-105 opacity-80"
                        }`}
                        style={{
                          backgroundColor: bg.color,
                          borderColor: isLight
                            ? "rgba(0,0,0,0.15)"
                            : "rgba(255,255,255,0.15)",
                        }}
                      />
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleExportPNG}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl transition-colors cursor-pointer ${
                    isLight ? "hover:bg-black/5" : "hover:bg-white/10"
                  }`}
                >
                  <Download size={14} className="text-amber-500" />
                  <span className="font-medium">Export as PNG</span>
                </button>

                <div className="my-1 border-t border-black/10 dark:border-white/10" />

                <button
                  onClick={() => {
                    handleClear();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
                >
                  <Trash2 size={14} />
                  <span className="font-medium">Clear Canvas</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Hidden File Input for Picture Upload */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </div>
    </div>
  );
};
