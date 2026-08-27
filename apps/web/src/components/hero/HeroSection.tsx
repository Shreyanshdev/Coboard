"use client";

import React from "react";
import Link from "next/link";
import { RoomJoinCard } from "../rooms/RoomJoinCard";
import { InteractiveCanvasDemo } from "./InteractiveCanvasDemo";
import {
  DotMatrixArrow,
  DraftingNibSvg,
  QuantumSyncSvg,
  RoughPolyhedronSvg,
} from "./HeroSectionComponents";
import { Play, Paintbrush } from "lucide-react";

interface HeroSectionProps {
  onOpenAuth: () => void;
  onOpenCreateRoom: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenAuth, onOpenCreateRoom }) => {
  return (
    <section id="about" className="relative pt-28 sm:pt-36 pb-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto flex flex-col items-center">
      {/* Top Tagline & Handwritten Doodle Accents */}
      <div className="relative text-center mb-8 max-w-2xl mx-auto select-none">
        {/* Handwritten floating note 1 (Terracotta Orange) */}
        <div className="absolute -top-6 -right-6 sm:-right-12 hidden sm:flex items-center gap-1 font-handwriting text-2xl text-[#c45a2c] -rotate-6 select-none pointer-events-none">
          <span>no auth needed!</span>
          <svg className="w-9 h-9 text-[#c45a2c]" viewBox="0 0 50 50" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <path d="M10 15 C 25 10, 40 25, 35 40" />
            <path d="M28 35 L 35 40 L 40 32" />
          </svg>
        </div>

        {/* Handwritten floating note 2 (Sky Blue / Cyan) */}
        <div className="absolute -top-6 -left-6 sm:-left-12 hidden sm:flex items-center gap-1 font-handwriting text-2xl text-[#0284c7] rotate-6 select-none pointer-events-none">
          <svg className="w-9 h-9 text-[#0284c7]" viewBox="0 0 50 50" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <path d="M40 15 C 25 10, 10 25, 15 40" />
            <path d="M22 35 L 15 40 L 10 32" />
          </svg>
          <span>fast &amp; sketchy</span>
        </div>

        <div className="inline-block font-handwriting text-xl text-[#944e26] -rotate-1 mb-1.5 select-none">
          ~ collaborative whiteboard for thinkers &amp; teams
        </div>

        <h1 className="text-3xl sm:text-5xl font-light text-[#27221e] tracking-tight leading-tight">
          Hand-drawn simplicity.{" "}
          <span className="font-handwriting font-bold text-4xl sm:text-6xl text-[#8c4623] inline-block -rotate-2">
            coboard whiteboard.
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-[#706155] mt-2.5 max-w-lg mx-auto leading-relaxed font-normal">
          Open a canvas and start drawing immediately for personal notes. Share and collaborate seamlessly in real-time rooms.
        </p>

        {/* Big Start Drawing CTA with Curvy Arrow */}
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3 relative">
          <Link
            href="/canvas"
            className="px-6 py-2.5 rounded-full bg-[#27221e] hover:bg-black text-white text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 group cursor-pointer hover:scale-105"
          >
            <Paintbrush size={15} className="text-[#c45a2c]" />
            <span>Start Drawing (Free &amp; Solo)</span>
          </Link>

          {/* Curvy Arrow Annotation next to CTA (Emerald Green) */}
          <div className="hidden md:flex items-center gap-1 font-handwriting text-xl text-[#059669] rotate-3 select-none ml-2">
            <svg className="w-7 h-7 text-[#059669]" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round">
              <path d="M35 15 C 25 10, 15 15, 8 26" />
              <path d="M14 26 L 8 26 L 10 19" />
            </svg>
            <span>jump in with 1-click!</span>
          </div>
        </div>
      </div>

      {/* Seamless Fluid Room Launcher (Positioned ABOVE Bento Cards) */}
      <div className="relative z-10 w-full mb-10">
        <RoomJoinCard onOpenCreateRoom={onOpenCreateRoom} />
      </div>

      {/* Compact Bento Grid with Clean Floating Constantly-Spinning Icons */}
      <div className="relative z-10 w-full mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
          {/* Card 1: Personal Canvas (Floating & Constantly Spinning Drafting Nib) */}
          <div className="relative flex flex-col">
            <div className="hidden md:flex items-center justify-center gap-1 font-handwriting text-lg text-[#0284c7] -rotate-2 select-none mb-1.5">
              <span>infinite drawing space</span>
              <svg className="w-5 h-5 text-[#0284c7]" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M5 8 Q 15 12, 18 24" />
                <path d="M12 20 L 18 24 L 22 17" />
              </svg>
            </div>

            <Link
              href="/canvas"
              className="group liquid-glass-card rounded-[32px] p-6 flex flex-col items-center justify-between text-center min-h-[220px] cursor-pointer relative overflow-hidden flex-1 shadow-[0_8px_30px_rgba(0,0,0,0.03)]"
            >
              <div className="card-dot-pattern" />
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#d96734]/12 rounded-full blur-2xl pointer-events-none" />

              {/* Clean Floating Icon with Constant Smooth Spin Animation */}
              <div className="my-2 transition-transform duration-300 relative z-10 animate-[spin_14s_linear_infinite] hover:animate-[spin_4s_linear_infinite]">
                <DraftingNibSvg className="w-11 h-11 drop-shadow-md" />
              </div>

              <div className="space-y-0.5 my-2 relative z-10">
                <h2 className="text-xl font-normal text-[#2d221b] tracking-tight">
                  Personal Canvas
                </h2>
                <p className="text-xs text-[#736357]">
                  Instant drawing, no auth needed
                </p>
              </div>

              <div className="relative z-10">
                <DotMatrixArrow />
              </div>
            </Link>
          </div>

          {/* Card 2: Real-time Sync (Floating & Constantly Spinning Quantum Synapse) */}
          <div className="relative flex flex-col">
            <div className="hidden md:flex items-center justify-center gap-1 font-handwriting text-lg text-[#b45309] rotate-2 select-none mb-1.5">
              <span>sub-5ms WebSocket sync</span>
              <svg className="w-5 h-5 text-[#b45309]" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M5 8 Q 15 12, 18 24" />
                <path d="M12 20 L 18 24 L 22 17" />
              </svg>
            </div>

            <div
              onClick={onOpenCreateRoom}
              className="group liquid-glass-card rounded-[32px] p-6 flex flex-col items-center justify-between text-center min-h-[220px] cursor-pointer relative overflow-hidden flex-1 shadow-[0_8px_30px_rgba(0,0,0,0.03)]"
            >
              <div className="card-dot-pattern" />
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#dfad42]/12 rounded-full blur-2xl pointer-events-none" />

              {/* Clean Floating Icon with Constant Smooth Spin Animation */}
              <div className="my-2 transition-transform duration-300 relative z-10 animate-[spin_8s_linear_infinite] hover:animate-[spin_3s_linear_infinite]">
                <QuantumSyncSvg className="w-11 h-11 drop-shadow-md" />
              </div>

              <div className="space-y-0.5 my-2 relative z-10">
                <h2 className="text-xl font-normal text-[#2d221b] tracking-tight">
                  Real-time Sync
                </h2>
                <p className="text-xs text-[#736357]">
                  Multiplayer rooms with cursors
                </p>
              </div>

              <div className="relative z-10">
                <DotMatrixArrow />
              </div>
            </div>
          </div>

          {/* Card 3: Rough Engine (Floating & Constantly Spinning Geodesic Polyhedron) */}
          <div className="relative flex flex-col">
            <div className="hidden md:flex items-center justify-center gap-1 font-handwriting text-lg text-[#059669] -rotate-3 select-none mb-1.5">
              <span>organic sketchy strokes</span>
              <svg className="w-5 h-5 text-[#059669]" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M5 8 Q 15 12, 18 24" />
                <path d="M12 20 L 18 24 L 22 17" />
              </svg>
            </div>

            <div
              onClick={onOpenCreateRoom}
              className="group liquid-glass-card rounded-[32px] p-6 flex flex-col items-center justify-between text-center min-h-[220px] cursor-pointer relative overflow-hidden flex-1 shadow-[0_8px_30px_rgba(0,0,0,0.03)]"
            >
              <div className="card-dot-pattern" />
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#5293b0]/12 rounded-full blur-2xl pointer-events-none" />

              {/* Clean Floating Icon with Constant Smooth Spin Animation */}
              <div className="my-2 transition-transform duration-300 relative z-10 animate-[spin_10s_linear_infinite] hover:animate-[spin_3s_linear_infinite]">
                <RoughPolyhedronSvg className="w-11 h-11 drop-shadow-md" />
              </div>

              <div className="space-y-0.5 my-2 relative z-10">
                <h2 className="text-xl font-normal text-[#2d221b] tracking-tight">
                  Rough Engine
                </h2>
                <p className="text-xs text-[#736357]">
                  Natural double-sketch physics
                </p>
              </div>

              <div className="relative z-10">
                <DotMatrixArrow />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Live Interactive Whiteboard Sandbox */}
      <div id="demo" className="relative z-10 w-full space-y-3 pt-2 mb-10">
        <div className="flex flex-wrap items-center justify-between px-3 gap-2">
          {/* Violet / Purple Curvy Annotation (Left) */}
          <div className="flex items-center gap-2 font-handwriting text-xl text-[#7c3aed] -rotate-1 select-none">
            <Play className="w-3.5 h-3.5 text-[#7c3aed] fill-[#7c3aed]" />
            <span>live canvas sandbox · fully interactive!</span>
            <svg className="w-6 h-6 text-[#7c3aed]" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round">
              <path d="M10 10 C 20 12, 28 20, 25 32" />
              <path d="M18 28 L 25 32 L 30 25" />
            </svg>
          </div>
          
          {/* Coral / Terracotta Curvy Annotation (Right) */}
          <div className="flex items-center gap-1.5 font-handwriting text-xl text-[#c45a2c] -rotate-2 select-none">
            <span>pick tools &amp; sketch here!</span>
            <svg className="w-6 h-6 text-[#c45a2c]" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round">
              <path d="M10 10 C 20 15, 25 25, 22 35" />
              <path d="M15 30 L 22 35 L 28 28" />
            </svg>
          </div>
        </div>

        <InteractiveCanvasDemo />
      </div>
    </section>
  );
};
