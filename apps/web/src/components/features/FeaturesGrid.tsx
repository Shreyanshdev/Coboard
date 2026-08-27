"use client";

import React from "react";
import { DotMatrixArrow } from "../hero/HeroSectionComponents";
import { ExternalLink, Heart } from "lucide-react";

// ============================================================================
// CUSTOM HANDCRAFTED LUXURY SVGS
// ============================================================================

// 1. Gemini 3.7 AI Star Constellation & Neural Node
const AiConstellationSvg = () => (
  <svg className="w-8 h-8 select-none" viewBox="0 0 40 40" fill="none">
    <path
      d="M20 4 L23.5 15.5 L35 19 L23.5 22.5 L20 34 L16.5 22.5 L5 19 L16.5 15.5 Z"
      fill="url(#ai-grad)"
      stroke="#7c3aed"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <circle cx="31" cy="9" r="2.5" fill="#a78bfa" />
    <circle cx="9" cy="29" r="2" fill="#c4b5fd" />
    <path d="M29 11 L23 16" stroke="#a78bfa" strokeWidth="1.2" strokeDasharray="2 2" />
    <path d="M11 27 L17 22" stroke="#a78bfa" strokeWidth="1.2" strokeDasharray="2 2" />
    <defs>
      <linearGradient id="ai-grad" x1="5" y1="4" x2="35" y2="34" gradientUnits="userSpaceOnUse">
        <stop stopColor="#8b5cf6" stopOpacity="0.25" />
        <stop offset="1" stopColor="#6d28d9" stopOpacity="0.1" />
      </linearGradient>
    </defs>
  </svg>
);

// 2. Multimodal Vision Math Integral & Sigma Glyph
const VisionMathSvg = () => (
  <svg className="w-8 h-8 select-none" viewBox="0 0 40 40" fill="none">
    <path
      d="M12 9 C9 9 7 12 7 16 L7 24 C7 28 9 31 12 31"
      stroke="#059669"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <path
      d="M19 12 L31 12 L24 20 L31 28 L19 28"
      stroke="#059669"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="20" cy="12" r="1.5" fill="#059669" />
    <circle cx="20" cy="28" r="1.5" fill="#059669" />
  </svg>
);

// 3. 120 FPS Dual Orbital Sync Wave & Lightning
const OrbitalSyncSvg = () => (
  <svg className="w-8 h-8 select-none" viewBox="0 0 40 40" fill="none">
    <circle cx="20" cy="20" r="14" stroke="#d97706" strokeWidth="1.8" strokeDasharray="5 3" opacity="0.6" />
    <path
      d="M22 6 L14 21 L20 21 L18 34 L26 19 L20 19 Z"
      fill="#fef3c7"
      stroke="#d97706"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <circle cx="20" cy="6" r="2.5" fill="#f59e0b" />
    <circle cx="20" cy="34" r="2.5" fill="#f59e0b" />
  </svg>
);

// 4. Stacked Database Cluster & Schema Cylinders
const DatabaseClusterSvg = () => (
  <svg className="w-8 h-8 select-none" viewBox="0 0 40 40" fill="none">
    {/* Top Cylinder */}
    <ellipse cx="20" cy="11" rx="13" ry="5" fill="#dbeafe" stroke="#2563eb" strokeWidth="1.8" />
    {/* Middle Cylinder */}
    <path d="M7 11 L7 20 C7 23.5 13 25 20 25 C27 25 33 23.5 33 20 L33 11" stroke="#2563eb" strokeWidth="1.8" />
    {/* Bottom Cylinder */}
    <path d="M7 20 L7 29 C7 32.5 13 34 20 34 C27 34 33 32.5 33 29 L33 20" stroke="#2563eb" strokeWidth="1.8" />
    <circle cx="12" cy="20" r="1.5" fill="#3b82f6" />
    <circle cx="12" cy="29" r="1.5" fill="#3b82f6" />
  </svg>
);

// 5. Dual Angle Vector Drafting Pen Nib
const DraftingPenNibSvg = () => (
  <svg className="w-8 h-8 select-none" viewBox="0 0 40 40" fill="none">
    <path
      d="M20 32 L14 18 L18 6 L22 6 L26 18 Z"
      fill="#ffe4e6"
      stroke="#e11d48"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <line x1="20" y1="18" x2="20" y2="30" stroke="#e11d48" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="20" cy="17" r="2" fill="#e11d48" />
    <path d="M14 18 L26 18" stroke="#e11d48" strokeWidth="1.6" />
  </svg>
);

// 6. 24/7 Infinity Heartbeat Keepalive Pulse
const InfinityPulseSvg = () => (
  <svg className="w-8 h-8 select-none" viewBox="0 0 40 40" fill="none">
    <path
      d="M13 15 C7 15 7 25 13 25 C17 25 19 20 20 20 C21 20 23 25 27 25 C33 25 33 15 27 15 C23 15 21 20 20 20 C19 20 17 15 13 15 Z"
      stroke="#0891b2"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="20" cy="20" r="2.5" fill="#06b6d4" />
    <path d="M16 20 L18 16 L22 24 L24 20" stroke="#0891b2" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const FeaturesGrid: React.FC = () => {
  const playgroundCards = [
    {
      customSvg: <AiConstellationSvg />,
      title: "Gemini 3.7 Flash Copilot",
      subtitle: "~ prompt to architecture diagram",
      description:
        "Type any prompt like 'Uber backend' or 'Stripe checkout' — Gemini draws an organized, multi-tier topology with smart ports!",
      funTag: '✨ "look mom, no manual boxes!"',
      tagColor: "text-violet-800 bg-violet-50/90",
      badge: "Gemini 3.7 AI",
      badgeColor: "text-violet-700 bg-violet-50/80",
      accentGlow: "bg-violet-500/12",
      arrowColor: "#8b5cf6",
      arrowPath: "M10 5 Q 35 15, 60 40 L 52 42 M 60 40 L 58 30",
    },
    {
      customSvg: <VisionMathSvg />,
      title: "Multimodal Vision Math Solver",
      subtitle: "~ sketch math & live calculate",
      description:
        "Scribble equations with your pencil and write '= ?'. Vision AI recognizes strokes, computes the exact result & writes it down.",
      funTag: '🎯 "calculus homework solved live"',
      tagColor: "text-emerald-800 bg-emerald-50/90",
      badge: "Vision AI",
      badgeColor: "text-emerald-700 bg-emerald-50/80",
      accentGlow: "bg-emerald-500/12",
      arrowColor: "#10b981",
      arrowPath: "M55 5 Q 30 25, 5 35 L 14 38 M 5 35 L 7 24",
    },
    {
      customSvg: <OrbitalSyncSvg />,
      title: "120 FPS WebSocket Sync",
      subtitle: "~ sub-5ms multiplayer broadcast",
      description:
        "Draw collaboratively across the globe. Live remote cursor telemetry, instant shape broadcasting, and shared highlights with zero lag.",
      funTag: '🚀 "120 FPS goes brrr"',
      tagColor: "text-amber-800 bg-amber-50/90",
      badge: "Real-Time WSS",
      badgeColor: "text-amber-700 bg-amber-50/80",
      accentGlow: "bg-amber-500/12",
      arrowColor: "#f59e0b",
      arrowPath: "M15 5 Q 40 20, 55 45 L 45 45 M 55 45 L 52 35",
    },
    {
      customSvg: <DatabaseClusterSvg />,
      title: "MongoDB & Mongoose Store",
      subtitle: "~ strict CanvasElement types",
      description:
        "Zero 'any' casts. Every stroke, shape, and arrow is strictly typed and persisted into embedded MongoDB documents with connection pooling.",
      funTag: '🔒 "100% strictly typed & safe"',
      tagColor: "text-blue-800 bg-blue-50/90",
      badge: "MongoDB / Mongoose",
      badgeColor: "text-blue-700 bg-blue-50/80",
      accentGlow: "bg-blue-500/12",
      arrowColor: "#3b82f6",
      arrowPath: "M50 10 Q 25 20, 10 40 L 20 40 M 10 40 L 10 30",
    },
    {
      customSvg: <DraftingPenNibSvg />,
      title: "12 Organic Vector Tools",
      subtitle: "~ natural roughjs sketch paper",
      description:
        "Highlighters, smart flowchart arrows, laser pointers, organic shapes, customizable roughness, and 5 handwritten typography choices.",
      funTag: '✏️ "feels like real sketchbook"',
      tagColor: "text-rose-800 bg-rose-50/90",
      badge: "Vector Studio",
      badgeColor: "text-rose-700 bg-rose-50/80",
      accentGlow: "bg-rose-500/12",
      arrowColor: "#f43f5e",
      arrowPath: "M10 10 Q 30 35, 55 40 L 46 45 M 55 40 L 52 30",
    },
    {
      customSvg: <InfinityPulseSvg />,
      title: "24/7 Render Keep-Alive Bot",
      subtitle: "~ zero cold starts on free tier",
      description:
        "Built-in auto-pinger daemon pings both HTTP and WebSocket backends every 10 minutes, keeping your Render instances continuously warm and active.",
      funTag: '🤖 "never sleeps, always awake"',
      tagColor: "text-cyan-800 bg-cyan-50/90",
      badge: "Keep-Alive Bot",
      badgeColor: "text-cyan-700 bg-cyan-50/80",
      accentGlow: "bg-cyan-500/12",
      arrowColor: "#06b6d4",
      arrowPath: "M55 5 Q 35 30, 10 40 L 20 42 M 10 40 L 12 30",
    },
  ];

  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-20 select-none">
      {/* Playground Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 border border-[#27221e]/10 shadow-[0_2px_12px_rgba(0,0,0,0.03)] backdrop-blur-md">
          <span className="font-handwriting text-base font-bold text-[#c45a2c] -rotate-1">
            ~ interactive playground features
          </span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-light text-[#27221e] tracking-tight">
          Crafted with <span className="font-handwriting font-bold text-[#c45a2c] -rotate-2 inline-block">Tactile Warmth</span> &amp; AI Intelligence
        </h2>

        <p className="text-[#6e6054] text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-normal">
          No generic templates. Combining natural hand-drawn physics with next-generation Gemini 3.7 AI and sub-millisecond multiplayer sync.
        </p>
      </div>

      {/* 6 Clean Open Craft Cards with Custom High-Quality SVGs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
        {playgroundCards.map((feat, idx) => (
          <div
            key={idx}
            className="group liquid-glass-card rounded-[32px] p-7 sm:p-8 flex flex-col justify-between min-h-[280px] relative overflow-hidden transition-all duration-300 hover:scale-[1.02] shadow-[0_8px_30px_rgba(0,0,0,0.03)]"
          >
            {/* Dynamic Dot Matrix Hover Pattern */}
            <div className="card-dot-pattern" />

            {/* Soft Ambient Blur Orb matching card theme */}
            <div className={`absolute -top-10 -right-10 w-36 h-36 ${feat.accentGlow} rounded-full blur-2xl pointer-events-none transition-all group-hover:scale-125`} />

            {/* Top Bar: Custom Premium SVG & Clean Handwritten Badge */}
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                {feat.customSvg}
              </div>

              <span className={`text-xs font-handwriting font-bold tracking-wide px-3 py-1 rounded-full shadow-2xs ${feat.badgeColor}`}>
                {feat.badge}
              </span>
            </div>

            {/* Title & Handwritten Subtitle */}
            <div className="space-y-1 mb-6 relative z-10">
              <h3 className="text-xl font-medium text-[#27221e] tracking-tight">
                {feat.title}
              </h3>
              <p className="font-handwriting text-base font-bold text-[#c45a2c] -rotate-1">
                {feat.subtitle}
              </p>
              <p className="text-xs text-[#6e6054] leading-relaxed pt-1.5 font-normal">
                {feat.description}
              </p>
            </div>

            {/* Bottom Row: Pure Handwritten Sticky Tag + Curvy Arrow */}
            <div className="pt-2 flex items-center justify-between relative z-10">
              <div className={`px-3 py-1 rounded-full text-sm font-handwriting font-bold -rotate-2 select-none shadow-2xs ${feat.tagColor}`}>
                {feat.funTag}
              </div>

              <div className="flex items-center gap-2">
                {/* Colorful Curvy Arrow SVG */}
                <svg
                  className="w-11 h-7 -rotate-2 select-none transition-transform group-hover:translate-x-1 duration-200"
                  viewBox="0 0 70 50"
                  fill="none"
                  stroke={feat.arrowColor}
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={feat.arrowPath} />
                </svg>

                <DotMatrixArrow />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Creator Showcase Banner with GitHub Profile */}
      <div className="mt-16 text-center">
        <div className="inline-flex flex-col sm:flex-row items-center gap-3 p-2.5 sm:px-6 sm:py-2.5 rounded-full bg-[#faf8f5]/95 border border-[#27221e]/10 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_14px_35px_rgba(0,0,0,0.08)] transition-all">
          <div className="flex items-center gap-2 text-xs text-[#5a4d42] font-medium">
            <span>Designed &amp; Developed with</span>
            <Heart size={14} className="text-rose-500 fill-rose-500 animate-pulse" />
            <span>by</span>
            <span className="font-bold text-[#2d221b] text-sm">Shreyansh Gupta</span>
          </div>

          <a
            href="https://github.com/Shreyanshdev"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#27221e] hover:bg-black text-white text-xs font-semibold transition-colors shadow-sm cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>@Shreyanshdev</span>
            <ExternalLink size={11} className="opacity-70" />
          </a>
        </div>
      </div>
    </section>
  );
};
