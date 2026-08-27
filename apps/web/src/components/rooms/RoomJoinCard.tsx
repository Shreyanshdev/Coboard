"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { storage } from "@/lib/storage";
import { Hash, ArrowRight, Plus, Sparkles, Users } from "lucide-react";

interface RoomJoinCardProps {
  onOpenCreateRoom: () => void;
}

export const RoomJoinCard: React.FC<RoomJoinCardProps> = ({ onOpenCreateRoom }) => {
  const router = useRouter();
  const [roomSlug, setRoomSlug] = useState("");
  const [recentRooms, setRecentRooms] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setRecentRooms(storage.getRecentRooms());
  }, []);

  const handleJoin = (slugToJoin?: string) => {
    const targetSlug = (slugToJoin || roomSlug).trim().toLowerCase();
    if (!targetSlug) {
      setError("Please enter a room slug or name");
      return;
    }
    if (targetSlug.length < 2) {
      setError("Room slug must be at least 2 characters");
      return;
    }

    storage.addRecentRoom(targetSlug);
    router.push(`/canvas/${targetSlug}`);
  };

  return (
    <div id="rooms" className="w-full max-w-4xl mx-auto space-y-3 relative z-10 select-none">
      {/* Top Header Row with Playful Annotations */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-[#594d43] uppercase tracking-wider">
            Multiplayer Room Launcher
          </span>
        </div>

        {/* Playful Curvy Arrow Annotation pointing to input */}
        <div className="flex items-center gap-1.5 font-handwriting text-base sm:text-lg text-[#c45a2c] -rotate-1 select-none">
          <span>type any room name to collaborate live</span>
          <svg className="w-5 h-5 text-[#c45a2c]" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M5 8 Q 15 12, 18 24" />
            <path d="M12 20 L 18 24 L 22 17" />
          </svg>
        </div>
      </div>

      {/* Seamless Fluid Blended Input Bar */}
      <div className="p-2 sm:p-2.5 rounded-full bg-[#faf8f5]/95 border border-[#27221e]/10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-2xl flex flex-col sm:flex-row items-center gap-2">
        {/* Input Field */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleJoin();
          }}
          className="flex-1 w-full flex items-center gap-2 px-3 sm:px-4 py-1"
        >
          <Hash size={16} className="text-[#8c7b6f] shrink-0" />
          <input
            type="text"
            placeholder="Enter room slug (e.g. system-design, brainstorm)..."
            value={roomSlug}
            onChange={(e) => {
              setRoomSlug(e.target.value);
              if (error) setError(null);
            }}
            className="w-full bg-transparent text-xs sm:text-sm text-[#27221e] placeholder-[#9a8c80] focus:outline-none font-medium"
          />
        </form>

        {/* Buttons Action Group */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto shrink-0 justify-end px-1 sm:px-0">
          <button
            onClick={() => handleJoin()}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-[#27221e] hover:bg-black text-white text-xs font-semibold shadow-sm hover:scale-102 transition-all cursor-pointer"
          >
            <span>Join Room</span>
            <ArrowRight size={13} />
          </button>

          <button
            onClick={onOpenCreateRoom}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-white hover:bg-[#faf8f5] text-[#3d3128] border border-[#27221e]/10 text-xs font-semibold shadow-xs hover:scale-102 transition-all cursor-pointer"
          >
            <Plus size={13} className="text-[#c45a2c]" />
            <span>New Room</span>
          </button>
        </div>
      </div>

      {/* Error message if invalid */}
      {error && (
        <p className="text-xs text-rose-600 font-medium px-4 text-center sm:text-left">
          {error}
        </p>
      )}

      {/* Recent Rooms Tags & Downward Arrow pointing to Sandbox */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-3 pt-1">
        <div className="flex flex-wrap items-center gap-1.5 justify-center sm:justify-start">
          <span className="font-handwriting text-sm text-[#8a7b6f]">quick jump:</span>
          {recentRooms.length > 0 ? (
            recentRooms.slice(0, 4).map((slug) => (
              <button
                key={slug}
                onClick={() => handleJoin(slug)}
                className="text-[11px] px-3 py-0.5 rounded-full bg-white/70 hover:bg-white text-[#4c3f35] hover:text-black border border-[#27221e]/8 transition-all font-mono cursor-pointer shadow-2xs hover:scale-105"
              >
                #{slug}
              </button>
            ))
          ) : (
            <button
              onClick={() => handleJoin("demo-room")}
              className="text-[11px] px-3 py-0.5 rounded-full bg-white/70 hover:bg-white text-[#4c3f35] hover:text-black border border-[#27221e]/8 transition-all font-mono cursor-pointer shadow-2xs hover:scale-105"
            >
              #demo-room
            </button>
          )}
        </div>

        {/* Downward Curvy Arrow directly welcoming to sandbox */}
        <div className="flex items-center gap-1 font-handwriting text-sm text-[#059669] rotate-1 select-none">
          <span>or sketch in interactive sandbox below</span>
          <svg className="w-4 h-4 text-[#059669]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M10 3 L 10 16 M 5 11 L 10 16 L 15 11" />
          </svg>
        </div>
      </div>
    </div>
  );
};
