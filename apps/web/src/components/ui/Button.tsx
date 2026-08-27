import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "glass" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "glass",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-300 ease-out cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed select-none rounded-full active:scale-[0.97]";

  const variantStyles = {
    // Liquid glass iOS button (default)
    glass: "liquid-pill-btn text-[#2a241f] hover:text-[#141210] font-normal tracking-tight",
    // Filled warm primary
    primary: "bg-[#2c241e] hover:bg-[#1a1512] text-white shadow-[0_4px_16px_rgba(44,36,30,0.15)] border border-[#44382f]/30",
    // Frosted soft pill
    secondary: "bg-white/60 hover:bg-white/80 text-[#3a3028] border border-white/70 shadow-sm",
    // Outline glass
    outline: "bg-transparent hover:bg-white/40 text-[#3a3028] border border-[#2a241f]/15 hover:border-[#2a241f]/30",
    // Minimal ghost
    ghost: "bg-transparent hover:bg-white/30 text-[#4a3f35] hover:text-[#1e1915]",
    // Danger
    danger: "bg-red-600/90 hover:bg-red-600 text-white shadow-md border border-red-500/30",
  };

  const sizeStyles = {
    sm: "px-4 py-1.5 text-xs gap-1.5 h-8",
    md: "px-5 py-2 text-sm gap-2 h-10",
    lg: "px-7 py-3 text-base gap-2.5 font-medium h-12",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
};

