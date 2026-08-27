"use client";

import React, { useEffect } from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";

interface ConfirmClearModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  theme: "light" | "dark";
}

export const ConfirmClearModal: React.FC<ConfirmClearModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  theme,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Enter") {
        onConfirm();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, onConfirm]);

  if (!isOpen) return null;

  const isLight = theme === "light";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-150 select-none">
      <div
        className={`relative w-full max-w-sm p-6 rounded-3xl border shadow-2xl backdrop-blur-2xl transition-all ${
          isLight
            ? "bg-white/95 border-black/10 text-[#27221e]"
            : "bg-[#181c28]/95 border-white/10 text-slate-100"
        }`}
      >
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-1.5 rounded-full transition-colors cursor-pointer ${
            isLight ? "hover:bg-black/5 text-[#8c7b6f]" : "hover:bg-white/10 text-slate-400"
          }`}
        >
          <X size={15} />
        </button>

        <div className="flex items-center gap-3 mb-3">
          <div className="p-2.5 rounded-2xl bg-rose-500/10 text-rose-500 dark:text-rose-400 border border-rose-500/20 shadow-xs">
            <Trash2 size={20} />
          </div>
          <div>
            <h3 className="font-bold text-base tracking-tight">Clear Canvas?</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Permanently remove all elements
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-2 mb-6">
          This will wipe the entire canvas clean and remove all drawings and shapes on this board.
          This action cannot be undone.
        </p>

        <div className="flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className={`px-4 py-2 text-xs font-medium rounded-xl border transition-all cursor-pointer ${
              isLight
                ? "bg-slate-100 hover:bg-slate-200 border-black/5 text-[#4a3d34]"
                : "bg-slate-800 hover:bg-slate-700 border-white/10 text-slate-200"
            }`}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white shadow-md transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Trash2 size={13} />
            <span>Clear Canvas</span>
          </button>
        </div>
      </div>
    </div>
  );
};
