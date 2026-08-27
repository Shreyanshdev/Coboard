import React from "react";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "violet" | "emerald" | "amber" | "slate" | "blue" | "glass";
  size?: "sm" | "md";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "glass",
  size = "sm",
  className = "",
}) => {
  const variantStyles = {
    glass: "bg-white/50 text-[#3d3229] border-white/80 shadow-[0_2px_8px_rgba(0,0,0,0.03),inset_0_1px_1px_rgba(255,255,255,0.9)]",
    violet: "bg-[#e8e0f5]/80 text-[#543b78] border-[#cbb6ec]/60",
    emerald: "bg-[#dff3e7]/80 text-[#25633e] border-[#b0e2c2]/60",
    amber: "bg-[#fbedd8]/80 text-[#85531d] border-[#ebd0a3]/60",
    slate: "bg-white/40 text-[#4c4238] border-white/60",
    blue: "bg-[#def0fa]/80 text-[#245876] border-[#a9d8f0]/60",
  };

  const sizeStyles = {
    sm: "px-3 py-0.5 text-[11px]",
    md: "px-3.5 py-1 text-xs font-normal",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-normal tracking-tight backdrop-blur-md ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};

