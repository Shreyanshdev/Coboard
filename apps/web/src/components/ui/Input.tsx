import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightElement, className = "", id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label htmlFor={inputId} className="text-xs font-medium text-[#4a3f36] tracking-normal pl-1">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-4 text-[#786c62] pointer-events-none flex items-center justify-center">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full bg-white/70 backdrop-blur-md border ${
              error
                ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                : "border-white/90 hover:border-white focus:border-[#44382f]/40 focus:bg-white/90 focus:ring-2 focus:ring-black/5"
            } text-[#1f1a16] placeholder:text-[#8c7b6f] font-normal rounded-full py-2.5 ${
              leftIcon ? "pl-11" : "pl-4"
            } ${rightElement ? "pr-12" : "pr-4"} text-sm transition-all duration-200 outline-none shadow-[inset_0_1px_2px_rgba(0,0,0,0.04),0_2px_8px_rgba(0,0,0,0.02)] ${className}`}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 flex items-center">
              {rightElement}
            </div>
          )}
        </div>
        {error && <span className="text-xs text-red-500 font-medium pl-3">{error}</span>}
        {helperText && !error && <span className="text-xs text-[#7d7064] pl-3">{helperText}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
