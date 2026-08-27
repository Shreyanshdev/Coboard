"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, X, ArrowRight, Check } from "lucide-react";
import { CanvasElement, Point } from "@/types";
import { generateAiDiagram, AiDiagramOptions } from "@/lib/ai-math-solver";
import { findFreeCanvasPlacement } from "@/lib/canvas-utils";

interface AiCopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertElements: (elements: CanvasElement[]) => void;
  theme: "light" | "dark";
  panOffset: Point;
  zoom: number;
  existingElements?: CanvasElement[];
}

type CategoryTab = "architecture" | "wireframes" | "agile" | "data";

export const AiCopilotModal: React.FC<AiCopilotModalProps> = ({
  isOpen,
  onClose,
  onInsertElements,
  theme,
  panOffset,
  zoom,
  existingElements = [],
}) => {
  const [prompt, setPrompt] = useState("");
  const [activeTab, setActiveTab] = useState<CategoryTab>("architecture");
  const [isGenerating, setIsGenerating] = useState(false);

  // Style Customizer States
  const [roughness, setRoughness] = useState<number>(1.2);
  const [palette, setPalette] = useState<"vibrant" | "neon" | "warm" | "emerald" | "mono">("vibrant");
  const [fontFamily, setFontFamily] = useState<string>("caveat");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isLight = theme === "light";

  const handleGenerate = async (customPrompt?: string) => {
    const textToUse = customPrompt || prompt;
    if (!textToUse.trim()) return;

    setIsGenerating(true);

    // Calculate center of visible screen in canvas coordinate space
    const viewCenterX = Math.round(-panOffset.x + (typeof window !== "undefined" ? window.innerWidth * 0.35 : 300) / zoom);
    const viewCenterY = Math.round(-panOffset.y + (typeof window !== "undefined" ? window.innerHeight * 0.25 : 200) / zoom);

    // Find guaranteed collision-free position avoiding existing sketches
    const spawnPos = findFreeCanvasPlacement(
      existingElements,
      600, // estimated width of generated diagram
      380, // estimated height of generated diagram
      { x: viewCenterX, y: viewCenterY }
    );

    const options: AiDiagramOptions = {
      roughness,
      palette,
      fontFamily,
    };

    try {
      const res = await fetch("/api/ai/diagram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: textToUse,
          startPos: spawnPos,
          options,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.elements && data.elements.length > 0) {
          onInsertElements(data.elements);
          setIsGenerating(false);
          onClose();
          setPrompt("");
          return;
        }
      }
    } catch (e) {
      console.warn("AI Diagram API error, using local fallback generator:", e);
    }

    // Fallback to local heuristic generator with free position
    const elements = generateAiDiagram(textToUse, spawnPos, options);
    onInsertElements(elements);
    setIsGenerating(false);
    onClose();
    setPrompt("");
  };

  const tabs: { id: CategoryTab; label: string }[] = [
    { id: "architecture", label: "Architecture" },
    { id: "wireframes", label: "Wireframes" },
    { id: "agile", label: "Agile & Product" },
    { id: "data", label: "Data & Trees" },
  ];

  const templates: Record<
    CategoryTab,
    { title: string; prompt: string; desc: string; tag: string }[]
  > = {
    architecture: [
      {
        title: "Microservices System Architecture",
        prompt: "microservices",
        desc: "API Gateway, Auth & Order microservices with connected database",
        tag: "System Design",
      },
      {
        title: "OAuth 2.0 & JWT Security Flow",
        prompt: "auth oauth login",
        desc: "Web client, Auth token provider, and Postgres database",
        tag: "Security",
      },
      {
        title: "Kubernetes Cluster Topology",
        prompt: "k8s cluster architecture",
        desc: "Ingress controller routing traffic to scalable worker pods",
        tag: "Cloud Native",
      },
    ],
    wireframes: [
      {
        title: "Mobile App Sign-In & Auth UX",
        prompt: "mobile wireframe login mockup",
        desc: "Phone frame with email, password fields and prominent CTA button",
        tag: "Mobile UX",
      },
      {
        title: "SaaS Dashboard Grid Layout",
        prompt: "dashboard wireframe layout",
        desc: "Sidebar navigation, metrics cards, and data table layout",
        tag: "Web App",
      },
      {
        title: "E-Commerce Checkout Funnel",
        prompt: "checkout wireframe funnel",
        desc: "3-step visual purchase progression with cart item review",
        tag: "Conversion",
      },
    ],
    agile: [
      {
        title: "Sprint Kanban Task Board",
        prompt: "kanban sprint board",
        desc: "To Do, In Progress, and Done lanes with colorful sticky cards",
        tag: "Agile",
      },
      {
        title: "SWOT Strategic Analysis Matrix",
        prompt: "swot matrix analysis",
        desc: "Strengths, Weaknesses, Opportunities, and Threats 2x2 grid",
        tag: "Strategy",
      },
      {
        title: "User Journey Mind Map",
        prompt: "mind map user flow",
        desc: "Central idea bubble connected to branching organic discovery nodes",
        tag: "Discovery",
      },
    ],
    data: [
      {
        title: "Binary Search Tree (BST)",
        prompt: "binary search tree data structure",
        desc: "Root, left and right child nodes with organic directional branches",
        tag: "Algorithms",
      },
      {
        title: "Database Relational ER Schema",
        prompt: "database erd schema tables",
        desc: "Users and Rooms entity tables with primary keys and relationships",
        tag: "PostgreSQL",
      },
      {
        title: "Overlapping Venn Diagram Sets",
        prompt: "venn diagram overlapping",
        desc: "Two intersecting organic circles with joint subset relationship",
        tag: "Logic Sets",
      },
    ],
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop matching Sign in / Sign up Modal */}
      <div
        className="fixed inset-0 bg-[#2b241e]/30 backdrop-blur-md transition-opacity animate-in fade-in select-none"
        onClick={onClose}
      />

      {/* Modal Container with Warm Aura matching AuthModal */}
      <div
        className={`relative w-full max-w-2xl backdrop-blur-2xl rounded-[36px] p-7 sm:p-9 shadow-[0_25px_60px_rgba(0,0,0,0.12)] z-10 transition-all transform animate-in zoom-in-95 duration-200 border overflow-hidden select-none ${
          isLight
            ? "bg-[#dedcd9]/92 border-white/85 text-[#27221e]"
            : "bg-[#161822]/92 border-white/10 text-slate-100"
        }`}
      >
        {/* Soft Golden Aura at top-center as shown in user AuthModal */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-56 h-56 bg-[#d49942]/25 dark:bg-[#d49942]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-light tracking-tight">
                  AI Canvas Architect
                </h3>
                <span className="font-handwriting text-sm text-[#c9592c] dark:text-[#f59e0b] font-bold">
                  sketch mode
                </span>
              </div>
              <p className="text-xs text-[#736558] dark:text-[#a09a90] leading-relaxed">
                Generate organic hand-drawn diagrams, UI wireframes, and sprint boards
              </p>
            </div>

            <button
              onClick={onClose}
              className="text-[#786b5e] hover:text-[#27221e] dark:text-slate-400 dark:hover:text-white p-2 rounded-full hover:bg-white/60 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Apple-Style Fluid Capsule Toggle Slider */}
          <div className="relative p-1 bg-black/[0.06] dark:bg-white/[0.08] rounded-full flex items-center mb-5">
            <div
              className="absolute top-1 bottom-1 bg-white dark:bg-[#252936] rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-300 ease-out"
              style={{
                width: "calc(25% - 2px)",
                left:
                  activeTab === "architecture"
                    ? "4px"
                    : activeTab === "wireframes"
                    ? "calc(25% + 1px)"
                    : activeTab === "agile"
                    ? "calc(50% - 1px)"
                    : "calc(75% - 3px)",
              }}
            />
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`relative z-10 flex-1 py-2 text-xs font-medium rounded-full transition-colors cursor-pointer text-center ${
                  activeTab === t.id
                    ? "text-[#27221e] dark:text-white font-semibold"
                    : "text-[#7d7064] dark:text-slate-400 hover:text-[#27221e] dark:hover:text-white"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Natural Language Prompt Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleGenerate();
            }}
            className="space-y-4"
          >
            <div className="relative">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. Microservices architecture with API Gateway and Postgres..."
                className={`w-full pl-4 pr-32 py-3.5 text-sm rounded-2xl border outline-none transition-all ${
                  isLight
                    ? "bg-white/80 border-black/10 focus:border-[#c9592c] focus:bg-white text-[#27221e] placeholder-[#8c7e72]"
                    : "bg-black/30 border-white/10 focus:border-violet-400 focus:bg-black/50 text-white placeholder-slate-500"
                }`}
                autoFocus
              />
              <button
                type="submit"
                disabled={isGenerating || !prompt.trim()}
                className="absolute right-2 top-2 px-4 py-2 rounded-full bg-[#27221e] hover:bg-[#38322c] dark:bg-white dark:hover:bg-slate-100 disabled:opacity-40 text-white dark:text-[#161822] text-xs font-medium flex items-center gap-1.5 shadow-md cursor-pointer transition-all hover:scale-105 active:scale-95"
              >
                {isGenerating ? (
                  <>
                    <span className="animate-spin text-xs">🌀</span>
                    <span>Drawing...</span>
                  </>
                ) : (
                  <>
                    <span>Generate</span>
                    <ArrowRight size={13} />
                  </>
                )}
              </button>
            </div>

            {/* Quick Add Keyword Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <span className="font-handwriting text-xs text-[#736558] dark:text-slate-400">
                quick tags:
              </span>
              {[
                "+ API Gateway",
                "+ Redis Cache",
                "+ PostgreSQL",
                "+ Mobile Screen",
                "+ To-Do Lane",
                "+ JWT Token",
              ].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() =>
                    setPrompt((prev) => (prev ? `${prev} ${tag}` : tag.replace("+ ", "")))
                  }
                  className={`px-2.5 py-1 rounded-full text-[11px] font-mono transition-all cursor-pointer ${
                    isLight
                      ? "bg-black/5 hover:bg-black/10 text-[#5a4d42]"
                      : "bg-white/10 hover:bg-white/15 text-slate-300"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Curated Template Cards */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[#786b5e] dark:text-slate-400 uppercase tracking-wider">
                  One-Click Templates
                </span>
                <span className="font-handwriting text-xs text-[#c9592c] dark:text-[#f59e0b]">
                  ready to insert
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {templates[activeTab].map((t) => (
                  <button
                    key={t.title}
                    type="button"
                    onClick={() => handleGenerate(t.prompt)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between group ${
                      isLight
                        ? "bg-white/65 hover:bg-white border-white/90 hover:border-[#c9592c]/40 text-[#27221e] shadow-sm hover:shadow-md"
                        : "bg-white/5 hover:bg-white/10 border-white/10 hover:border-violet-500/40 text-slate-100 shadow-sm hover:shadow-md"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold group-hover:text-[#c9592c] dark:group-hover:text-violet-400 transition-colors">
                          {t.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#786b5e] dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {t.desc}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-black/5 dark:border-white/5">
                      <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 font-semibold text-[#736558] dark:text-slate-300">
                        {t.tag}
                      </span>
                      <span className="font-handwriting text-xs text-[#c9592c] dark:text-violet-400 flex items-center gap-0.5">
                        Spawn ➔
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Style & Aesthetic Deck */}
            <div
              className={`p-3.5 rounded-2xl border ${
                isLight
                  ? "bg-black/[0.02] border-black/[0.06]"
                  : "bg-white/[0.03] border-white/[0.06]"
              }`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1. Sloppiness */}
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-[#786b5e] dark:text-slate-400 uppercase tracking-wide">
                    Hand-drawn Vibe
                  </label>
                  <div className="grid grid-cols-3 gap-1">
                    {[
                      { id: 0, label: "Clean" },
                      { id: 1.2, label: "Organic" },
                      { id: 2.4, label: "Rough" },
                    ].map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setRoughness(r.id)}
                        className={`h-7 rounded-lg text-[10px] font-medium flex items-center justify-center transition-all cursor-pointer ${
                          roughness === r.id
                            ? isLight
                              ? "bg-[#27221e] text-white shadow-xs"
                              : "bg-white text-[#161822] shadow-xs"
                            : isLight
                            ? "bg-black/5 text-[#5a4d42] hover:bg-black/10"
                            : "bg-white/10 text-slate-300 hover:bg-white/15"
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Color Mood */}
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-[#786b5e] dark:text-slate-400 uppercase tracking-wide">
                    Color Mood
                  </label>
                  <div className="grid grid-cols-5 gap-1">
                    {[
                      { id: "vibrant" as const, color: "#8b5cf6", name: "Vibrant" },
                      { id: "neon" as const, color: "#06b6d4", name: "Cyber Neon" },
                      { id: "warm" as const, color: "#f97316", name: "Warm Sunset" },
                      { id: "emerald" as const, color: "#10b981", name: "Emerald" },
                      { id: "mono" as const, color: "#52525b", name: "Monochrome" },
                    ].map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setPalette(c.id)}
                        title={c.name}
                        className={`h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                          palette === c.id
                            ? isLight
                              ? "ring-2 ring-[#27221e] scale-105"
                              : "ring-2 ring-white scale-105"
                            : "opacity-80 hover:opacity-100"
                        }`}
                        style={{ backgroundColor: c.color }}
                      >
                        {palette === c.id && <Check size={12} className="text-white" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Typeface */}
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-[#786b5e] dark:text-slate-400 uppercase tracking-wide">
                    Typeface
                  </label>
                  <div className="grid grid-cols-2 gap-1">
                    {[
                      { id: "caveat", label: "Casual (Caveat)" },
                      { id: "kalam", label: "Organic (Kalam)" },
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setFontFamily(f.id)}
                        className={`h-7 rounded-lg text-[10px] font-medium flex items-center justify-center transition-all cursor-pointer ${
                          fontFamily === f.id
                            ? isLight
                              ? "bg-[#27221e] text-white shadow-xs"
                              : "bg-white text-[#161822] shadow-xs"
                            : isLight
                            ? "bg-black/5 text-[#5a4d42] hover:bg-black/10"
                            : "bg-white/10 text-slate-300 hover:bg-white/15"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
