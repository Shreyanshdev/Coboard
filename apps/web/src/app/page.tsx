"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/hero/HeroSection";
import { ToolsShowcase } from "@/components/features/ToolsShowcase";
import { Footer } from "@/components/layout/Footer";
import { AuthModal } from "@/components/auth/AuthModal";
import { CreateRoomModal } from "@/components/rooms/CreateRoomModal";

export default function LandingPage() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#dedcd9] text-[#27221e] flex flex-col relative selection:bg-[#cc5a2b]/20 selection:text-[#3a2012] overflow-x-hidden">
      {/* Ambient Diffuse Background Glow Orbs */}
      <div className="ambient-diffuse">
        <div className="orb-copper" />
        <div className="orb-gold" />
        <div className="orb-ice" />
        <div className="orb-sand" />
      </div>

      {/* Navigation */}
      <Navbar
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenCreateRoom={() => setIsCreateRoomOpen(true)}
      />

      {/* Main Streamlined Content */}
      <main className="flex-1 w-full relative z-10">
        <HeroSection
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenCreateRoom={() => setIsCreateRoomOpen(true)}
        />

        <ToolsShowcase />
      </main>

      {/* Aesthetic Rounded Dark Footer */}
      <Footer />

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <CreateRoomModal
        isOpen={isCreateRoomOpen}
        onClose={() => setIsCreateRoomOpen(false)}
      />
    </div>
  );
}
