"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { api } from "@/lib/api";
import { storage } from "@/lib/storage";
import { CreateRoomSchema } from "@/types";
import { Hash, Type, Wand2, ArrowRight, AlertCircle } from "lucide-react";

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateRoomModal: React.FC<CreateRoomModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const generateSlugFromName = (inputName: string) => {
    setName(inputName);
    const generated = inputName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setSlug(generated);
  };

  const handleRandomSlug = () => {
    const adjectives = ["creative", "agile", "visual", "dynamic", "spark", "quantum", "sketch"];
    const nouns = ["canvas", "brainstorm", "sprint", "diagram", "board", "flow", "session"];
    const randAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randNum = Math.floor(100 + Math.random() * 900);
    const randomSlug = `${randAdj}-${randNoun}-${randNum}`;
    const randomName = `${randAdj.charAt(0).toUpperCase() + randAdj.slice(1)} ${randNoun.charAt(0).toUpperCase() + randNoun.slice(1)}`;
    setName(randomName);
    setSlug(randomSlug);
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setServerError(null);

    const parseResult = CreateRoomSchema.safeParse({ name, slug });
    if (!parseResult.success) {
      const fieldErrors: Record<string, string> = {};
      parseResult.error.issues.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    const res = await api.createRoom(name, slug);
    setIsLoading(false);

    if (!res.success) {
      setServerError(res.error || "Could not create room");
      return;
    }

    storage.addRecentRoom(slug);
    onClose();
    router.push(`/canvas/${slug}`);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Whiteboard"
      description="Launch a collaborative real-time drawing session with instant WebSocket synchronization."
    >
      {serverError && (
        <div className="mb-4 p-3 rounded-2xl bg-red-100/80 border border-red-300 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleCreateRoom} className="space-y-4">
        <Input
          label="Room Title / Name"
          placeholder="e.g. System Architecture 2026"
          value={name}
          onChange={(e) => generateSlugFromName(e.target.value)}
          error={errors.name}
          required
        />

        <div className="flex flex-col gap-1 text-left">
          <div className="flex items-center justify-between">
            <label htmlFor="room-slug-input" className="text-xs font-normal text-[#5a4d42]">
              Room Slug (URL Identifier)
            </label>
            <button
              type="button"
              onClick={handleRandomSlug}
              className="text-xs text-[#c9592c] hover:text-[#a03e15] flex items-center gap-1 font-medium transition-colors cursor-pointer"
            >
              <Wand2 size={12} /> Auto-generate
            </button>
          </div>
          <Input
            id="room-slug-input"
            placeholder="e.g. system-arch-2026"
            value={slug}
            onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
            error={errors.slug}
            helperText={`Share URL: /canvas/${slug || "your-slug"}`}
            required
          />
        </div>

        <div className="pt-3">
          <Button
            type="submit"
            variant="primary"
            className="w-full py-3 h-12 text-sm font-medium hover:scale-101 transition-transform"
            isLoading={isLoading}
            rightIcon={<ArrowRight size={16} />}
          >
            Launch Whiteboard
          </Button>
        </div>
      </form>
    </Modal>
  );
};
