"use client";

import React, { useState, useEffect } from "react";
import { PenTool, Zap, ShieldCheck, ExternalLink, Heart } from "lucide-react";

export const Footer: React.FC = () => {
  const [timeStr, setTimeStr] = useState("05:00 PM");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20 relative z-20">
      {/* High-contrast Warm Studio Card */}
      <div
        className="rounded-[36px] p-8 sm:p-10 text-white relative overflow-hidden border border-white/10 shadow-2xl"
        style={{
          background:
            "radial-gradient(circle at 80% 20%, rgba(220, 100, 45, 0.4), transparent 50%), radial-gradient(circle at 20% 60%, rgba(130, 40, 80, 0.35), transparent 50%), #141210",
        }}
      >
        <div className="relative z-10 space-y-8">
          {/* Top Row: Brand & Tagline */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="font-handwriting text-4xl sm:text-5xl font-bold text-[#faf5ee] lowercase -rotate-2">
                  coboard
                </span>
                <span className="font-handwriting text-xl text-[#f99256] -rotate-3 select-none">
                  ~ whiteboard studio
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#c8bcaf] max-w-md font-normal leading-relaxed">
                A natural, collaborative AI whiteboard engineered for rapid sketches, real-time brainstorms, and architecture topologies.
              </p>
            </div>

            {/* Handwritten Quote Annotation */}
            <div className="flex items-center gap-2 font-handwriting text-xl text-[#fca975] -rotate-2 select-none">
              <span>think in sketches, speak in diagrams</span>
              <svg className="w-5 h-5 text-[#fca975]" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 20 Q 20 10, 35 20" />
                <path d="M25 15 L 35 20 L 28 27" />
              </svg>
            </div>
          </div>

          {/* Middle Row: 3 Feature Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Card 1 */}
            <a
              href="#demo"
              className="bg-[#24201c]/80 hover:bg-[#302a25] p-4.5 rounded-[24px] border border-white/10 transition-all hover:scale-102 shadow-md group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-full bg-[#3d2417] border border-[#d96734]/40 flex items-center justify-center text-[#f78248]">
                  <PenTool size={14} />
                </div>
                <span className="font-handwriting text-lg text-[#f78248] group-hover:translate-x-1 transition-transform">
                  sandbox ↗
                </span>
              </div>
              <h4 className="text-sm font-medium text-[#f5efe9]">Interactive Sandbox</h4>
              <p className="text-[11px] text-[#a89b8e] mt-0.5">Freehand pencil, arrows, shapes, text</p>
            </a>

            {/* Card 2 */}
            <a
              href="#rooms"
              className="bg-[#24201c]/80 hover:bg-[#302a25] p-4.5 rounded-[24px] border border-white/10 transition-all hover:scale-102 shadow-md group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-full bg-[#3d3215] border border-[#dfad42]/40 flex items-center justify-center text-[#f3bf4e]">
                  <Zap size={14} />
                </div>
                <span className="font-handwriting text-lg text-[#f3bf4e] group-hover:translate-x-1 transition-transform">
                  join room ↗
                </span>
              </div>
              <h4 className="text-sm font-medium text-[#f5efe9]">Multi-User Rooms</h4>
              <p className="text-[11px] text-[#a89b8e] mt-0.5">Sub-millisecond WebSocket broadcast</p>
            </a>

            {/* Card 3 */}
            <a
              href="#tools"
              className="bg-[#24201c]/80 hover:bg-[#302a25] p-4.5 rounded-[24px] border border-white/10 transition-all hover:scale-102 shadow-md group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-full bg-[#162f3d] border border-[#5293b0]/40 flex items-center justify-center text-[#7bc1df]">
                  <ShieldCheck size={14} />
                </div>
                <span className="font-handwriting text-lg text-[#7bc1df] group-hover:translate-x-1 transition-transform">
                  12 tools ↗
                </span>
              </div>
              <h4 className="text-sm font-medium text-[#f5efe9]">Vector Toolset</h4>
              <p className="text-[11px] text-[#a89b8e] mt-0.5">RoughJS & Zod validation</p>
            </a>
          </div>

          {/* Bottom Bar: Creator Info & Live Status */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-[#a89b8e] gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-handwriting text-lg text-[#e6ded5]">coboard © {new Date().getFullYear()}</span>
              <span>·</span>
              <div className="flex items-center gap-1.5 text-[#dcd2c7]">
                <span>Designed & Built with</span>
                <Heart size={12} className="text-rose-500 fill-rose-500 animate-pulse" />
                <span>by</span>
                <a
                  href="https://github.com/Shreyanshdev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-amber-400 hover:text-amber-300 underline underline-offset-2 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <span>Shreyansh Gupta</span>
                  <ExternalLink size={10} />
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                WebSocket Online
              </div>
              <span className="font-mono text-[11px] text-[#c0b3a6]">{timeStr}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
