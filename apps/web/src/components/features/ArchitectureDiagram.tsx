import React from "react";
import { Badge } from "../ui/Badge";
import { Layers, Server, Globe, Shield } from "lucide-react";

export const ArchitectureDiagram: React.FC = () => {
  return (
    <section id="architecture" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
        <Badge variant="glass" size="md">
          Monorepo Architecture
        </Badge>
        <h2 className="text-3xl sm:text-4xl font-light text-[#27221e] tracking-tight">
          Modular &amp; Type-Safe by Design
        </h2>
        <p className="text-[#6e6054] text-sm sm:text-base leading-relaxed">
          Clear separation of concerns across dedicated apps and shared packages for maximum scalability.
        </p>
      </div>

      <div className="liquid-glass-card p-8 sm:p-12 rounded-[42px] border border-white/80 relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {/* Web App */}
          <div className="bg-white/65 backdrop-blur-xl border border-white/90 rounded-[30px] p-7 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-white border border-white flex items-center justify-center text-[#8c4623] shadow-sm">
                <Globe className="w-5 h-5" />
              </div>
              <Badge variant="glass" size="sm">apps/web</Badge>
            </div>
            <h3 className="font-normal text-lg text-[#27221e]">Next.js 15 App Router</h3>
            <p className="text-xs text-[#736357] leading-relaxed">
              Modern frontend featuring interactive HTML5 canvas rendering, room management, and reactive WebSocket sync hooks.
            </p>
            <div className="pt-2 border-t border-white/70 text-[11px] font-mono text-[#8c5332]">
              Dependencies: @repo/common, lucide-react, tailwindcss
            </div>
          </div>

          {/* Backend APIs */}
          <div className="bg-white/65 backdrop-blur-xl border border-white/90 rounded-[30px] p-7 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-white border border-white flex items-center justify-center text-[#25576f] shadow-sm">
                <Server className="w-5 h-5" />
              </div>
              <Badge variant="glass" size="sm">apps/http &amp; ws</Badge>
            </div>
            <h3 className="font-normal text-lg text-[#27221e]">Dual Express &amp; WS Backends</h3>
            <p className="text-xs text-[#736357] leading-relaxed">
              Express HTTP API handles authentication and room persistence; WebSocket server delivers sub-millisecond drawing broadcasts.
            </p>
            <div className="pt-2 border-t border-white/70 text-[11px] font-mono text-[#326780]">
              Ports: :3001 (HTTP), :8080 (WS)
            </div>
          </div>

          {/* Shared Contracts */}
          <div className="bg-white/65 backdrop-blur-xl border border-white/90 rounded-[30px] p-7 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-white border border-white flex items-center justify-center text-[#25633e] shadow-sm">
                <Shield className="w-5 h-5" />
              </div>
              <Badge variant="glass" size="sm">packages/common &amp; db</Badge>
            </div>
            <h3 className="font-normal text-lg text-[#27221e]">Contracts &amp; Database</h3>
            <p className="text-xs text-[#736357] leading-relaxed">
              Centralized Zod validation schemas (`ToolType`, `CanvasElement`, `CreateRoomSchema`) and Prisma schema for PostgreSQL.
            </p>
            <div className="pt-2 border-t border-white/70 text-[11px] font-mono text-[#25633e]">
              Zod Schemas + Prisma ORM
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

