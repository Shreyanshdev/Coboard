"use client";

import React, { useState, useMemo } from "react";
import { Search, Type, ChevronDown, Check } from "lucide-react";
import { FontFamily } from "@/types";
import { AVAILABLE_FONTS, ensureFontLoaded, getFontDefinition } from "@/lib/fonts";

interface FontPickerProps {
  fontFamily: FontFamily;
  setFontFamily: (font: FontFamily) => void;
  isLight: boolean;
}

export const FontPicker: React.FC<FontPickerProps> = ({
  fontFamily,
  setFontFamily,
  isLight,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [category, setCategory] = useState<string>("all");

  const filteredFonts = useMemo(() => {
    return AVAILABLE_FONTS.filter((f) => {
      const matchesCat = category === "all" || f.category === category;
      const matchesSearch =
        !search ||
        f.name.toLowerCase().includes(search.toLowerCase()) ||
        f.category.toLowerCase().includes(search.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [category, search]);

  const activeFontDef = getFontDefinition(fontFamily);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3 py-2 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
          isLight
            ? "bg-black/[0.03] hover:bg-black/[0.06] border-black/10 text-[#27221e]"
            : "bg-white/[0.05] hover:bg-white/[0.08] border-white/10 text-white"
        }`}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <Type size={14} className="text-violet-500 shrink-0" />
          <span
            className="text-xs font-semibold truncate"
            style={{ fontFamily: activeFontDef.cssFamily }}
          >
            {activeFontDef.name}
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-500 font-mono uppercase">
            {activeFontDef.category}
          </span>
          <ChevronDown
            size={13}
            className={`transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {/* Dropdown Menu Modal */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div
            className={`absolute left-0 right-0 bottom-full mb-2 z-50 rounded-2xl border shadow-2xl backdrop-blur-2xl p-2.5 space-y-2 select-none animate-in zoom-in-95 duration-150 ${
              isLight
                ? "bg-white/98 border-black/10 text-[#27221e]"
                : "bg-[#181c28]/98 border-white/15 text-slate-100"
            }`}
            style={{ maxHeight: "300px" }}
          >
            {/* Search Input */}
            <div className="relative">
              <Search
                size={13}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search 40+ fonts..."
                className={`w-full pl-7 pr-2.5 py-1.5 text-xs rounded-lg border outline-none ${
                  isLight
                    ? "bg-black/[0.04] border-black/10 focus:border-violet-500 text-[#27221e]"
                    : "bg-white/[0.06] border-white/10 focus:border-violet-400 text-white"
                }`}
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {[
                { id: "all", label: "All" },
                { id: "handwriting", label: "Handwritten (24)" },
                { id: "sans", label: "Sans (8)" },
                { id: "mono", label: "Mono (5)" },
                { id: "serif", label: "Serif/Display" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`px-2 py-0.5 text-[10px] rounded-full whitespace-nowrap transition-all cursor-pointer ${
                    category === cat.id
                      ? "bg-violet-600 text-white font-semibold"
                      : isLight
                      ? "bg-black/5 text-slate-600 hover:bg-black/10"
                      : "bg-white/10 text-slate-300 hover:bg-white/15"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Fonts List (No scrollbar) */}
            <div className="max-h-48 overflow-y-auto space-y-0.5 pr-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {filteredFonts.map((f) => {
                const isSelected = activeFontDef.id === f.id || fontFamily === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => {
                      ensureFontLoaded(f.id);
                      setFontFamily(f.id);
                      setIsOpen(false);
                    }}
                    className={`w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between text-left transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-violet-600 text-white font-medium shadow-xs"
                        : isLight
                        ? "hover:bg-black/5 text-[#27221e]"
                        : "hover:bg-white/10 text-slate-200"
                    }`}
                  >
                    <span
                      className="text-sm tracking-wide"
                      style={{ fontFamily: f.cssFamily }}
                    >
                      {f.name}
                    </span>
                    {isSelected ? (
                      <Check size={13} className="text-white" />
                    ) : (
                      <span className="text-[9px] opacity-50 uppercase font-mono">
                        {f.category}
                      </span>
                    )}
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
