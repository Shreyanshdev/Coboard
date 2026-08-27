"use client";

import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { api } from "@/lib/api";
import { storage } from "@/lib/storage";
import { CreateUserSchema, SigninUserSchema } from "@/types";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const resetForm = () => {
    setName("");
    setUsername("");
    setPassword("");
    setErrors({});
    setServerError(null);
    setSuccessMessage(null);
  };

  const switchMode = (newMode: "signin" | "signup") => {
    setMode(newMode);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setServerError(null);
    setSuccessMessage(null);

    if (mode === "signup") {
      const parseResult = CreateUserSchema.safeParse({ name, username, password });
      if (!parseResult.success) {
        const fieldErrors: Record<string, string> = {};
        parseResult.error.issues.forEach((err) => {
          if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
        });
        setErrors(fieldErrors);
        return;
      }

      setIsLoading(true);
      const res = await api.signup({ name, username, password });
      setIsLoading(false);

      if (!res.success) {
        setServerError(res.error || "Failed to sign up");
        return;
      }

      if (res.data?.token) {
        storage.setToken(res.data.token);
        storage.setUser({
          token: res.data.token,
          userId: res.data.userId || "user_1",
          name,
          username,
        });
        setSuccessMessage("Account created successfully!");
        setTimeout(() => {
          onClose();
          if (onSuccess) onSuccess();
          window.location.reload();
        }, 800);
      }
    } else {
      const parseResult = SigninUserSchema.safeParse({ username, password });
      if (!parseResult.success) {
        const fieldErrors: Record<string, string> = {};
        parseResult.error.issues.forEach((err) => {
          if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
        });
        setErrors(fieldErrors);
        return;
      }

      setIsLoading(true);
      const res = await api.signin({ username, password });
      setIsLoading(false);

      if (!res.success) {
        setServerError(res.error || "Invalid username or password");
        return;
      }

      if (res.data?.token) {
        storage.setToken(res.data.token);
        storage.setUser({
          token: res.data.token,
          userId: res.data.userId || "user_1",
          name: res.data.name || username,
          username,
        });
        setSuccessMessage("Logged in successfully!");
        setTimeout(() => {
          onClose();
          if (onSuccess) onSuccess();
          window.location.reload();
        }, 800);
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "signin" ? "Welcome Back" : "Create Account"}
      description={
        mode === "signin"
          ? "Sign in to access your persistent whiteboard rooms and saved sketches."
          : "Join now for real-time collaboration with multi-user whiteboard sync."
      }
    >
      {/* Apple-Style Fluid Capsule Toggle Slider */}
      <div className="relative p-1 bg-black/[0.06] rounded-full flex items-center mb-6">
        <div
          className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-300 ease-out ${
            mode === "signin" ? "left-1" : "left-[calc(50%+2px)]"
          }`}
        />
        <button
          type="button"
          onClick={() => switchMode("signin")}
          className={`relative z-10 flex-1 py-2 text-xs font-medium rounded-full transition-colors cursor-pointer text-center ${
            mode === "signin" ? "text-[#27221e]" : "text-[#7d7064] hover:text-[#27221e]"
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => switchMode("signup")}
          className={`relative z-10 flex-1 py-2 text-xs font-medium rounded-full transition-colors cursor-pointer text-center ${
            mode === "signup" ? "text-[#27221e]" : "text-[#7d7064] hover:text-[#27221e]"
          }`}
        >
          Sign Up
        </button>
      </div>

      {serverError && (
        <div className="mb-4 p-3 rounded-2xl bg-red-100/80 border border-red-300 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-3 rounded-2xl bg-emerald-100/80 border border-emerald-300 text-emerald-700 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "signup" && (
          <Input
            label="Full Name"
            placeholder="e.g. Alex Morgan"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            required
          />
        )}

        <Input
          label="Username"
          placeholder="e.g. alexm (3-20 chars)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          error={errors.username}
          required
        />

        <Input
          label="Password"
          type="password"
          placeholder="Minimum 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          required
        />

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            className="w-full py-3 h-12 text-sm font-medium"
            isLoading={isLoading}
          >
            {mode === "signin" ? "Sign In to Coboard" : "Create Account"}
          </Button>
        </div>

        <p className="text-center text-xs text-[#7d7064] pt-2">
          {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => switchMode(mode === "signin" ? "signup" : "signin")}
            className="text-[#c9592c] hover:underline font-medium cursor-pointer"
          >
            {mode === "signin" ? "Sign up here" : "Sign in"}
          </button>
        </p>
      </form>
    </Modal>
  );
};
