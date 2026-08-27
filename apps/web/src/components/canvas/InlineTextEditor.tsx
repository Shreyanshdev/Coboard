"use client";

import React, { useEffect, useRef } from "react";
import { FontFamily, Point } from "@/types";
import { getFontDefinition, ensureFontLoaded } from "@/lib/fonts";

export interface InlineTextState {
  id: string;
  x: number;
  y: number;
  text: string;
  isNew: boolean;
}

interface InlineTextEditorProps {
  inlineText: InlineTextState;
  setInlineText: React.Dispatch<React.SetStateAction<InlineTextState | null>>;
  panOffset: Point;
  zoom: number;
  fontFamily: FontFamily;
  setFontFamily: (font: FontFamily) => void;
  fontWeight?: "normal" | "bold";
  fontStyle?: "normal" | "italic";
  strokeColor: string;
  strokeWidth: number;
  isLight: boolean;
  commitInlineText: () => void;
}

export const InlineTextEditor: React.FC<InlineTextEditorProps> = ({
  inlineText,
  setInlineText,
  panOffset,
  zoom,
  fontFamily,
  fontWeight = "normal",
  fontStyle = "normal",
  strokeColor,
  strokeWidth,
  commitInlineText,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const previousIdRef = useRef<string | null>(null);

  // Ensure font is loaded into DOM
  useEffect(() => {
    ensureFontLoaded(fontFamily);
  }, [fontFamily]);

  // Auto-focus and place caret at end on mount
  useEffect(() => {
    if (inlineText && inlineText.id !== previousIdRef.current) {
      previousIdRef.current = inlineText.id;
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          const len = textareaRef.current.value.length;
          textareaRef.current.setSelectionRange(len, len);
          adjustSize();
        }
      });
    }
  }, [inlineText]);

  // Dynamically resize textarea to fit text content seamlessly
  const adjustSize = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.max(32, textarea.scrollHeight)}px`;

    // Auto-expand width based on longest line
    const lines = textarea.value.split("\n");
    const maxLineLength = Math.max(1, ...lines.map((l) => l.length));
    textarea.style.width = `${Math.max(60, (maxLineLength + 2) * 16)}px`;
  };

  const fontDef = getFontDefinition(fontFamily);
  const fontSize = Math.max(20, strokeWidth * 9);

  return (
    <div
      className="absolute z-50 pointer-events-auto"
      style={{
        left: `${(inlineText.x + panOffset.x) * zoom}px`,
        top: `${(inlineText.y + panOffset.y) * zoom}px`,
        transform: `scale(${zoom})`,
        transformOrigin: "top left",
      }}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <textarea
        ref={textareaRef}
        value={inlineText.text}
        autoFocus
        onChange={(e) => {
          setInlineText({
            ...inlineText,
            text: e.target.value,
          });
          adjustSize();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.ctrlKey || e.metaKey || !e.shiftKey)) {
            if (e.ctrlKey || e.metaKey) {
              e.preventDefault();
              commitInlineText();
              return;
            }
          }
          if (e.key === "Escape") {
            e.preventDefault();
            commitInlineText();
          }
        }}
        onBlur={() => {
          commitInlineText();
        }}
        placeholder={inlineText.isNew ? "Type..." : ""}
        rows={1}
        className="bg-transparent border border-dashed border-violet-400/40 rounded-none p-0 m-0 leading-tight outline-none resize-none overflow-hidden transition-none shadow-none"
        style={{
          fontFamily: fontDef.cssFamily,
          fontWeight: fontWeight === "bold" ? "bold" : "normal",
          fontStyle: fontStyle === "italic" ? "italic" : "normal",
          color: strokeColor,
          caretColor: strokeColor,
          fontSize: `${fontSize}px`,
          minWidth: "60px",
          minHeight: "32px",
          lineHeight: 1.25,
          letterSpacing: "normal",
        }}
      />
    </div>
  );
};
