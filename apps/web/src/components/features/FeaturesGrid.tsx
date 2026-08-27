"use client";

import React from "react";
import {
  Sparkles,
  Zap,
  Calculator,
  Database,
  Palette,
  Bot,
  ExternalLink,
  Heart,
} from "lucide-react";

export const FeaturesGrid: React.FC = () => {
  const playgroundCards = [
    {
      icon: <Sparkles className="w-6 h-6 text-violet-600" />,
      emoji: "🪄",
      title: "Gemini 3.7 Flash Copilot",
      subtitle: "Prompt-to-Architecture Diagramming",
      description:
        "Type any prompt like 'Uber backend architecture' or 'Stripe checkout flow' — Gemini designs an organized, multi-tier topology with non-overlapping ports!",
      funTag: '✨ "Look mom, no manual boxes!"',
      tagColor: "text-violet-700 bg-violet-100 border-violet-200",
      badge: "Gemini 3.7 AI",
      badgeColor: "border-violet-300 text-violet-700 bg-violet-50/80",
      accentBorder: "hover:border-violet-400",
      glowColor: "rgba(139, 92, 246, 0.15)",
      arrowColor: "#8b5cf6",
      arrowPath: "M10 5 Q 35 15, 60 40 L 52 42 M 60 40 L 58 30",
    },
    {
      icon: <Calculator className="w-6 h-6 text-emerald-600" />,
      emoji: "🧮",
      title: "Multimodal Vision Math Solver",
      subtitle: "Sketch Math & Live Calculate",
      description:
        "Scribble equations with your pencil and write '= ?'. Gemini's Vision AI recognizes the strokes, computes the exact result, and rewrites it in handwritten font.",
      funTag: '🎯 "Math homework solved live"',
      tagColor: "text-emerald-700 bg-emerald-100 border-emerald-200",
      badge: "Vision AI",
      badgeColor: "border-emerald-300 text-emerald-700 bg-emerald-50/80",
      accentBorder: "hover:border-emerald-400",
      glowColor: "rgba(16, 185, 129, 0.15)",
      arrowColor: "#10b981",
      arrowPath: "M55 5 Q 30 25, 5 35 L 14 38 M 5 35 L 7 24",
    },
    {
      icon: <Zap className="w-6 h-6 text-amber-600" />,
      emoji: "⚡",
      title: "120 FPS WebSocket Multiplayer",
      subtitle: "Sub-millisecond Real-Time Sync",
      description:
        "Draw collaboratively across the globe. Live remote cursor telemetry, instant shape broadcasting, and shared selection highlights with zero lag.",
      funTag: '🚀 "120 FPS goes brrr"',
      tagColor: "text-amber-700 bg-amber-100 border-amber-200",
      badge: "Real-Time WSS",
      badgeColor: "border-amber-300 text-amber-700 bg-amber-50/80",
      accentBorder: "hover:border-amber-400",
      glowColor: "rgba(245, 158, 11, 0.15)",
      arrowColor: "#f59e0b",
      arrowPath: "M15 5 Q 40 20, 55 45 L 45 45 M 55 45 L 52 35",
    },
    {
      icon: <Database className="w-6 h-6 text-blue-600" />,
      emoji: "🗄️",
      title: "Native MongoDB & Mongoose",
      subtitle: "Strict CanvasElement Type Safety",
      description:
        "Zero 'any' casts. Every shape, arrow, stroke point, and text box is strictly typed and persisted into embedded MongoDB documents with connection pooling.",
      funTag: '🔒 "100% strictly typed"',
      tagColor: "text-blue-700 bg-blue-100 border-blue-200",
      badge: "MongoDB / Mongoose",
      badgeColor: "border-blue-300 text-blue-700 bg-blue-50/80",
      accentBorder: "hover:border-blue-400",
      glowColor: "rgba(59, 130, 246, 0.15)",
      arrowColor: "#3b82f6",
      arrowPath: "M50 10 Q 25 20, 10 40 L 20 40 M 10 40 L 10 30",
    },
    {
      icon: <Palette className="w-6 h-6 text-rose-600" />,
      emoji: "🎨",
      title: "12 Organic Vector Tools",
      subtitle: "Hand-Drawn RoughJS Aesthetic",
      description:
        "Highlighter markers, smart arrows, laser presentation, organic curves, customizable roughness, and 5 curated harmonic color palettes.",
      funTag: '✏️ "Feels like real sketch paper"',
      tagColor: "text-rose-700 bg-rose-100 border-rose-200",
      badge: "Vector Studio",
      badgeColor: "border-rose-300 text-rose-700 bg-rose-50/80",
      accentBorder: "hover:border-rose-400",
      glowColor: "rgba(244, 63, 94, 0.15)",
      arrowColor: "#f43f5e",
      arrowPath: "M10 10 Q 30 35, 55 40 L 46 45 M 55 40 L 52 30",
    },
    {
      icon: <Bot className="w-6 h-6 text-cyan-600" />,
      emoji: "🛡️",
      title: "24/7 Render Keep-Alive Bot",
      subtitle: "Zero Cold Starts on Free Tier",
      description:
        "Built-in auto-pinger daemon pings both HTTP and WebSocket backends every 10 minutes, keeping your Render instances continuously warm and active.",
      funTag: '🤖 "Never sleeps, always awake"',
      tagColor: "text-cyan-700 bg-cyan-100 border-cyan-200",
      badge: "Keep-Alive Bot",
      badgeColor: "border-cyan-300 text-cyan-700 bg-cyan-50/80",
      accentBorder: "hover:border-cyan-400",
      glowColor: "rgba(6, 182, 212, 0.15)",
      arrowColor: "#06b6d4",
      arrowPath: "M55 5 Q 35 30, 10 40 L 20 42 M 10 40 L 12 30",
    },
  ];

  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-20 select-none">
      {/* Playground Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-[#c45a2c]/30 shadow-sm backdrop-blur-md">
          <span className="text-sm">🎡</span>
          <span className="font-handwriting text-base font-bold text-[#c45a2c] -rotate-1">
            interactive playground features
          </span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-light text-[#27221e] tracking-tight">
          Everything You Need to <span className="font-handwriting font-bold text-[#c45a2c] -rotate-2 inline-block">Draw & Think</span>
        </h2>

        <p className="text-[#6e6054] text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
          Combining the warmth of natural hand-drawn sketching with next-generation Gemini 3.7 AI intelligence and sub-millisecond multiplayer sync.
        </p>
      </div>

      {/* 6 Playground Cards Grid with Curvy Arrows & Sticky Tags */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
        {playgroundCards.map((feat, idx) => (
          <div
            key={idx}
            className={`group relative p-7 sm:p-8 rounded-[36px] bg-white/85 backdrop-blur-2xl border border-white/90 shadow-[0_12px_35px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_45px_rgba(0,0,0,0.08)] flex flex-col justify-between overflow-hidden ${feat.accentBorder}`}
            style={{
              boxShadow: `0 10px 30px -10px ${feat.glowColor}`,
            }}
          >
            {/* Playful Floating Sticky Note Callout */}
            <div className="flex items-center justify-between mb-5">
              <div className="w-12 h-12 rounded-2xl bg-white/90 border border-black/5 shadow-sm flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                {feat.emoji}
              </div>

              <span className={`text-[11px] font-semibold px-3 py-1 rounded-full border shadow-sm ${feat.badgeColor}`}>
                {feat.badge}
              </span>
            </div>

            {/* Title & Description */}
            <div className="space-y-2 mb-6">
              <h3 className="text-xl font-bold text-[#27221e] tracking-tight flex items-center gap-1.5">
                <span>{feat.title}</span>
              </h3>
              <p className="text-xs font-semibold text-[#c45a2c] font-mono">
                {feat.subtitle}
              </p>
              <p className="text-xs text-[#736357] leading-relaxed pt-1">
                {feat.description}
              </p>
            </div>

            {/* Handwritten Curvy Arrow & Doodle Sticky Annotation */}
            <div className="pt-4 border-t border-black/5 flex items-center justify-between">
              <div className={`px-2.5 py-1 rounded-xl text-[11px] font-handwriting font-bold border shadow-xs -rotate-2 select-none ${feat.tagColor}`}>
                {feat.funTag}
              </div>

              {/* Colorful Curvy Arrow SVG */}
              <svg
                className="w-14 h-9 -rotate-3 select-none"
                viewBox="0 0 70 50"
                fill="none"
                stroke={feat.arrowColor}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d={feat.arrowPath} />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Creator Showcase Banner with GitHub Profile */}
      <div className="mt-16 text-center">
        <div className="inline-flex flex-col sm:flex-row items-center gap-3 p-3 sm:px-6 sm:py-2.5 rounded-full bg-white/90 border border-[#c45a2c]/25 shadow-lg backdrop-blur-xl hover:scale-102 transition-all">
          <div className="flex items-center gap-2 text-xs text-[#5a4d42] font-medium">
            <span>Designed & Developed with</span>
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
