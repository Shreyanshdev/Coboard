"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { storage } from "@/lib/storage";
import { Hash, ArrowRight, Plus, Users } from "lucide-react";

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
    <div
      id="rooms"
      className="w-full max-w-xl mx-auto liquid-glass-card p-7 sm:p-9 rounded-[38px] border border-white/85 shadow-xl relative overflow-hidden text-left"
    >
      {/* Dynamic Dot Matrix Hover Pattern */}
      <div className="card-dot-pattern" />

      {/* Soft warm aura glow inside card */}
      <div className="absolute -top-16 -right-16 w-52 h-52 bg-[#d76b32]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-52 h-52 bg-[#e2ad47]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#388e5d] animate-pulse" />
            <span className="text-xs font-normal tracking-wide text-[#594d43]">
              Live Collaboration Hub
            </span>
          </div>
          
          <div className="flex items-center gap-1 font-handwriting text-xl text-[#c45a2c] -rotate-2 select-none">
            <span>instant multiplayer</span>
            <svg className="w-5 h-5 text-[#c45a2c]" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M5 8 Q 15 12, 18 24" />
              <path d="M12 20 L 18 24 L 22 17" />
            </svg>
          </div>
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-light text-[#27221e] tracking-tight">
            Jump into any whiteboard room
          </h2>
          <p className="text-xs sm:text-sm text-[#736357] leading-relaxed">
            Enter an existing room slug or create a brand new space for instant collaborative sketching.
          </p>
        </div>

        {/* Input & Join Button Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleJoin();
          }}
          className="space-y-3"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="Enter room slug (e.g. system-design)"
                value={roomSlug}
                onChange={(e) => {
                  setRoomSlug(e.target.value);
                  if (error) setError(null);
                }}
                error={error || undefined}
                leftIcon={<Hash size={16} className="text-[#8c7b6f]" />}
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="py-2.5 px-6 shrink-0 text-sm font-medium shadow-md hover:scale-102 transition-transform"
              rightIcon={<ArrowRight size={15} />}
            >
              Join Room
            </Button>
          </div>
        </form>

        {/* Action divider & Create button */}
        <div className="pt-3 border-t border-white/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Button
            variant="glass"
            size="sm"
            onClick={onOpenCreateRoom}
            className="w-full sm:w-auto text-xs px-5 py-2 hover:scale-102 transition-all"
            leftIcon={<Plus size={14} className="text-[#7a6b5e]" />}
          >
            Create New Room
          </Button>

          {/* Quick launch suggestions */}
          <div className="flex flex-wrap items-center gap-1.5 justify-center sm:justify-end">
            <span className="font-handwriting text-base text-[#8a7b6f]">recent:</span>
            {recentRooms.slice(0, 3).map((slug) => (
              <button
                key={slug}
                onClick={() => handleJoin(slug)}
                className="text-[11px] px-3.5 py-1 rounded-full bg-white/60 hover:bg-white text-[#4c3f35] hover:text-[#1a1512] border border-white/80 hover:border-white transition-all font-mono cursor-pointer shadow-sm hover:scale-105"
              >
                #{slug}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
