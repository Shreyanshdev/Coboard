import React from "react";
import { Badge } from "../ui/Badge";
import {
  Zap,
  Users,
  Feather,
  ShieldCheck,
  Maximize2,
  Database,
  Share2,
} from "lucide-react";

export const FeaturesGrid: React.FC = () => {
  const features = [
    {
      icon: <Users className="w-5 h-5 text-[#8c4623]" />,
      title: "Real-Time Multi-User Sync",
      description: "Collaborate synchronously with low-latency WebSockets. Watch teammate strokes and cursor movements appear live.",
      badge: "WebSocket Engine",
    },
    {
      icon: <Feather className="w-5 h-5 text-[#b08020]" />,
      title: "Hand-Drawn Roughness",
      description: "Render artistic sketchy strokes that give sketches a warm, natural hand-drawn quality with customizable roughness.",
      badge: "Organic Roughness",
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#25633e]" />,
      title: "Shared Type Contracts",
      description: "Zero runtime type mismatches. Shared Zod validation schemas across Next.js frontend and Express/WS backend.",
      badge: "Type Safety",
    },
    {
      icon: <Maximize2 className="w-5 h-5 text-[#25576f]" />,
      title: "Infinite Pan & Zoom",
      description: "Unconstrained whiteboard workspace. Pan smoothly with the hand tool or holding spacebar for large-scale architectures.",
      badge: "Infinite Canvas",
    },
    {
      icon: <Database className="w-5 h-5 text-[#80385c]" />,
      title: "Prisma & PostgreSQL Storage",
      description: "Stateful room persistence with automated element versioning and seamless fallback memory store.",
      badge: "Persistent DB",
    },
    {
      icon: <Share2 className="w-5 h-5 text-[#9a5824]" />,
      title: "Instant Room Slugs",
      description: "Shareable lightweight room URLs. Invite teammates to jump directly into your live board with zero configuration.",
      badge: "Instant Links",
    },
  ];

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
        <Badge variant="glass" size="md">
          Core Capabilities
        </Badge>
        <h2 className="text-3xl sm:text-4xl font-light text-[#27221e] tracking-tight">
          Engineered for Team Sketching
        </h2>
        <p className="text-[#6e6054] text-sm sm:text-base leading-relaxed">
          Everything you need for designing systems, diagramming workflows, and team brainstorm sessions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feat, index) => (
          <div
            key={index}
            className="liquid-glass-card p-7 sm:p-8 rounded-[36px] border border-white/80 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-2xl bg-white/70 border border-white/90 shadow-sm flex items-center justify-center">
                  {feat.icon}
                </div>
                <Badge variant="glass" size="sm">
                  {feat.badge}
                </Badge>
              </div>

              <h3 className="text-lg sm:text-xl font-normal text-[#27221e] tracking-tight">{feat.title}</h3>
              <p className="text-xs text-[#736357] leading-relaxed">{feat.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

