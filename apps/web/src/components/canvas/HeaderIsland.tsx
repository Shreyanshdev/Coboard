"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface HeaderIslandProps {
  isLight: boolean;
  isPersonal: boolean;
  roomSlug?: string;
}

export const HeaderIsland: React.FC<HeaderIslandProps> = ({
  isLight,
  isPersonal,
  roomSlug,
}) => {
  return (
    <div className="fixed top-2 sm:top-4 left-2 sm:left-4 z-40 flex items-center gap-1.5 pointer-events-auto">
      <div
        className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border shadow-md transition-colors ${
          isLight
            ? "bg-white/90 backdrop-blur-xl border-white/90 text-[#27221e]"
            : "bg-[#1e2330]/90 backdrop-blur-xl border-white/10 text-white"
        }`}
      >
        <Link
          href="/"
          title="Back to Home"
          className={`p-1 rounded-full transition-colors cursor-pointer ${
            isLight
              ? "hover:bg-black/[0.06] text-[#5a4d42]"
              : "hover:bg-white/10 text-slate-400 hover:text-white"
          }`}
        >
          <ArrowLeft size={14} />
        </Link>

        <span className="font-handwriting text-lg sm:text-xl font-bold text-[#c45a2c] lowercase -rotate-2 select-none">
          coboard
        </span>
        <span className="hidden sm:inline text-xs text-[#8c7b6f]">/</span>
        <span className="hidden sm:inline font-mono text-xs font-semibold tracking-tight truncate max-w-[120px]">
          {isPersonal ? "personal" : roomSlug}
        </span>
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            isPersonal ? "bg-amber-400" : "bg-emerald-500 animate-pulse"
          } ml-0.5`}
          title={isPersonal ? "Offline Personal Mode" : "Online Collaborative Room"}
        />
      </div>
    </div>
  );
};
