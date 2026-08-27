import React, { useEffect } from "react";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = "md",
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthStyles = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#2b241e]/30 backdrop-blur-md transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Container with Warm Aura */}
      <div
        className={`relative w-full ${maxWidthStyles[maxWidth]} bg-[#dedcd9]/90 backdrop-blur-2xl rounded-[36px] p-8 sm:p-9 shadow-[0_25px_60px_rgba(0,0,0,0.12)] z-10 transition-all transform animate-in zoom-in-95 duration-200 border border-white/85 overflow-hidden`}
      >
        {/* Soft Golden Aura at top-center as shown in user screenshot */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#d49942]/25 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-5">
            <div className="space-y-1">
              <h3 className="text-2xl font-light text-[#27221e] tracking-tight">{title}</h3>
              {description && <p className="text-xs text-[#736558] leading-relaxed max-w-xs">{description}</p>}
            </div>
            <button
              onClick={onClose}
              className="text-[#786b5e] hover:text-[#27221e] p-2 rounded-full hover:bg-white/60 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};
