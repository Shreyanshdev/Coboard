"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { LogOut, Plus, LogIn, Paintbrush, Menu, X } from "lucide-react";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

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

      {/* Fixed Navbar Container */}
      <div className="fixed top-3 sm:top-6 left-0 right-0 z-50 px-3 sm:px-8 max-w-6xl mx-auto flex items-center justify-between pointer-events-none">
        {/* Brand Logo in Handwritten Typography */}
        <div className="pointer-events-auto">
          <Link
            href="/"
            className="liquid-pill-btn px-3.5 sm:px-4.5 py-1.5 rounded-full inline-flex items-center gap-1.5 group cursor-pointer shadow-sm"
          >
            <span className="font-handwriting text-2xl sm:text-3xl font-bold tracking-tight text-[#2d221b] lowercase -rotate-2 select-none">
              coboard
            </span>
          </Link>
        </div>

        {/* Center Navigation Capsule Pill (Desktop) */}
        <nav className="pointer-events-auto hidden md:flex items-center gap-1 liquid-nav-pill rounded-full p-1 text-xs text-[#5c4e43] shadow-sm">
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

        {/* Right Action Buttons (Desktop) */}
        <div className="pointer-events-auto hidden md:flex items-center gap-2">
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
            className="text-xs px-3.5 h-8.5 shadow-sm cursor-pointer"
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
              className="text-xs px-4.5 h-8.5 shadow-md font-medium cursor-pointer"
            >
              Sign In
            </Button>
          )}
        </div>

        {/* Mobile Action Hub (Mobile & Tablet) */}
        <div className="pointer-events-auto flex md:hidden items-center gap-1.5">
          <Link
            href="/canvas"
            className="liquid-pill-btn text-xs px-3 py-1.5 rounded-full inline-flex items-center gap-1 font-semibold text-[#c45a2c] shadow-sm"
          >
            <Paintbrush size={13} />
            <span>Draw</span>
          </Link>

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Mobile Menu"
            className="liquid-pill-btn p-2 rounded-full text-[#3d3128] hover:text-black transition-colors cursor-pointer shadow-sm"
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Animated Dropdown Sheet */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-45 md:hidden">
          {/* Backdrop Blur */}
          <div
            className="fixed inset-0 bg-black/25 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Floating Dropdown Card */}
          <div className="fixed top-18 left-3 right-3 p-4 rounded-3xl bg-white/95 border border-black/10 shadow-2xl backdrop-blur-2xl animate-in slide-in-from-top-4 duration-200 select-none">
            <div className="space-y-2">
              <Link
                href="/canvas"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between w-full p-3 rounded-2xl bg-[#c45a2c]/10 text-[#c45a2c] font-semibold text-sm transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Paintbrush size={16} />
                  <span>Start Drawing (Canvas)</span>
                </div>
                <span className="text-xs font-handwriting">Instant</span>
              </Link>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenCreateRoom();
                }}
                className="flex items-center justify-between w-full p-3 rounded-2xl bg-black/[0.04] hover:bg-black/[0.08] text-[#2d221b] font-semibold text-sm transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Plus size={16} className="text-[#c45a2c]" />
                  <span>Create Shared Room</span>
                </div>
                <span className="text-xs text-[#7a6b5e]">Multiplayer</span>
              </button>

              <div className="py-1 border-t border-black/5" />

              <div className="grid grid-cols-3 gap-1.5 text-center text-xs font-medium text-[#5c4e43]">
                <a
                  href="#about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-xl hover:bg-black/5"
                >
                  About
                </a>
                <a
                  href="#demo"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-xl hover:bg-black/5"
                >
                  Sandbox
                </a>
                <a
                  href="#tools"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-xl hover:bg-black/5"
                >
                  Tools
                </a>
              </div>

              <div className="py-1 border-t border-black/5" />

              {/* User Authentication / Profile in Mobile Dropdown */}
              {user ? (
                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-black/[0.03]">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#3d3128] text-white flex items-center justify-center text-[10px] font-bold">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <span className="text-xs font-semibold text-[#2c241e]">{user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs text-rose-600 hover:bg-rose-50 font-medium transition-colors cursor-pointer"
                  >
                    <LogOut size={13} />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenAuth();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-[#2c241e] text-white font-semibold text-xs shadow-md cursor-pointer hover:bg-black transition-all"
                >
                  <LogIn size={14} />
                  <span>Sign In / Create Account</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
