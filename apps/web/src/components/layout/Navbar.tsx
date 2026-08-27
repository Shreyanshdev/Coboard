"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { LogOut, Plus, LogIn, Paintbrush } from "lucide-react";
import { Button } from "../ui/Button";
import { storage } from "@/lib/storage";
import { UserSession } from "@/types";

interface NavbarProps {
  onOpenAuth: () => void;
  onOpenCreateRoom: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth, onOpenCreateRoom }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [activeTab, setActiveTab] = useState<string>("about");

  useEffect(() => {
    setUser(storage.getUser());
  }, []);

  const handleLogout = () => {
    storage.clearToken();
    setUser(null);
    window.location.reload();
  };

  return (
    <>
      {/* Top viewport subtle fade overlay */}
      <div className="fixed top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#dedcd9] via-[#dedcd9]/85 to-transparent pointer-events-none z-40" />

      {/* Fixed Navbar with generous top margin */}
      <div className="fixed top-6 left-0 right-0 z-50 px-4 sm:px-8 max-w-6xl mx-auto flex items-center justify-between pointer-events-none">
        {/* Brand Logo in Handwritten Typography */}
        <div className="pointer-events-auto">
          <Link
            href="/"
            className="liquid-pill-btn px-4.5 py-1.5 rounded-full inline-flex items-center gap-1.5 group cursor-pointer shadow-sm"
          >
            <span className="font-handwriting text-2xl sm:text-3xl font-bold tracking-tight text-[#2d221b] lowercase -rotate-2">
              coboard
            </span>
          </Link>
        </div>

        {/* Center Navigation Capsule Pill */}
        <nav className="pointer-events-auto hidden sm:flex items-center gap-1 liquid-nav-pill rounded-full p-1 text-xs text-[#5c4e43] shadow-sm">
          <Link
            href="/canvas"
            className="px-4 py-1.5 rounded-full transition-all duration-200 cursor-pointer font-medium text-[#c45a2c] hover:bg-white/60 flex items-center gap-1"
          >
            <Paintbrush size={12} /> Draw Now
          </Link>
          <a
            href="#about"
            onClick={() => setActiveTab("about")}
            className={`px-4 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
              activeTab === "about"
                ? "liquid-tab-active font-medium"
                : "hover:text-[#1f1914] hover:bg-white/50"
            }`}
          >
            About
          </a>
          <a
            href="#demo"
            onClick={() => setActiveTab("demo")}
            className={`px-4 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
              activeTab === "demo"
                ? "liquid-tab-active font-medium"
                : "hover:text-[#1f1914] hover:bg-white/50"
            }`}
          >
            Sandbox
          </a>
          <a
            href="#tools"
            onClick={() => setActiveTab("tools")}
            className={`px-4 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
              activeTab === "tools"
                ? "liquid-tab-active font-medium"
                : "hover:text-[#1f1914] hover:bg-white/50"
            }`}
          >
            Tools
          </a>
        </nav>

        {/* Right Action Buttons */}
        <div className="pointer-events-auto flex items-center gap-2">
          <Link
            href="/canvas"
            className="liquid-pill-btn text-xs px-3.5 h-8.5 rounded-full inline-flex items-center gap-1.5 font-medium text-[#2d221b] hover:text-black shadow-sm"
          >
            <Paintbrush size={12} className="text-[#c45a2c]" />
            <span>Open Canvas</span>
          </Link>

          <Button
            variant="glass"
            size="sm"
            onClick={onOpenCreateRoom}
            leftIcon={<Plus size={13} className="text-[#5a4a3e]" />}
            className="text-xs px-3.5 h-8.5 shadow-sm"
          >
            New Room
          </Button>

          {user ? (
            <div className="flex items-center gap-1">
              <div className="liquid-pill-btn px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                <div className="w-4.5 h-4.5 rounded-full bg-[#3d3128] text-white flex items-center justify-center text-[9px] font-bold">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <span className="text-[11px] text-[#2c241e] font-normal">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                title="Sign Out"
                className="p-1.5 rounded-full hover:bg-white/80 text-[#7a6b5e] hover:text-[#2c241e] transition-colors cursor-pointer"
              >
                <LogOut size={13} />
              </button>
            </div>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={onOpenAuth}
              leftIcon={<LogIn size={13} />}
              className="text-xs px-4.5 h-8.5 shadow-md font-medium"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </>
  );
};
