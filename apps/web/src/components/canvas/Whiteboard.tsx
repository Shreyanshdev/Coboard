"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { CanvasElement, ToolType, Point, FontFamily } from "@/types";
import { getElementBounds } from "@/lib/canvas-utils";
import { detectMathInText, detectMathInSketches, MathSolution } from "@/lib/ai-math-solver";
import { preloadCommonFonts } from "@/lib/fonts";
import { CanvasToolbar, MobileToolDropdown } from "./CanvasToolbar";
import { PropertiesPanel } from "./PropertiesPanel";
import { HeaderIsland } from "./HeaderIsland";
import { ActionIsland } from "./ActionIsland";
import { BottomControlsIsland } from "./BottomControlsIsland";
import { InlineTextEditor, InlineTextState } from "./InlineTextEditor";
import { AiCopilotModal } from "./AiCopilotModal";
import { ConfirmClearModal } from "./ConfirmClearModal";
import { AuthModal } from "@/components/auth/AuthModal";
import { useCanvasHistory } from "./hooks/useCanvasHistory";
import { useCanvasKeyboard } from "./hooks/useCanvasKeyboard";
import { useRoomSync } from "./hooks/useRoomSync";
import { useCanvasDrawing } from "./hooks/useCanvasDrawing";
import { wsManager } from "@/lib/ws";
import { api } from "@/lib/api";
import { storage } from "@/lib/storage";
import { Sliders, X, Sparkles, Plus, Wand2 } from "lucide-react";

interface WhiteboardProps {
  roomId?: string;
  roomSlug?: string;
  isPersonal?: boolean;
}

const isHexLight = (hex: string): boolean => {
  const clean = hex.replace("#", "");
  if (clean.length === 6) {
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 140;
  }
  return false;
};

export const Whiteboard: React.FC<WhiteboardProps> = ({
  roomSlug,
  isPersonal = !roomSlug,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const {
    historyIndex,
    pushHistory,
    setInitialHistory,
    canUndo,
    canRedo,
    undo,
    redo,
  } = useCanvasHistory([]);

  // Drawing settings
  const [activeTool, setActiveTool] = useState<ToolType>("pencil");
  const [strokeColor, setStrokeColor] = useState<string>("#ffffff");
  const [fillColor, setFillColor] = useState<string>("transparent");
  const [strokeWidth, setStrokeWidth] = useState<number>(2.5);
  const [strokeStyle, setStrokeStyle] = useState<"solid" | "dashed" | "dotted">("solid");
  const [roughness, setRoughness] = useState<number>(1.4);
  const [edges, setEdges] = useState<"round" | "sharp">("round");
  const [arrowhead, setArrowhead] = useState<"sharp" | "sketchy" | "dot" | "bar">("sketchy");
  const [arrowType, setArrowType] = useState<"straight" | "curved">("straight");
  const [opacity, setOpacity] = useState<number>(100);
  const [fontFamily, setFontFamily] = useState<FontFamily>("caveat");
  const [fontWeight, setFontWeight] = useState<"normal" | "bold">("normal");
  const [fontStyle, setFontStyle] = useState<"normal" | "italic">("normal");
  const [showProperties, setShowProperties] = useState<boolean>(true);

  // Zoom & Pan
  const [zoom, setZoom] = useState<number>(1.0);
  const [panOffset, setPanOffset] = useState<Point>({ x: 0, y: 0 });
  const [isSpacePressed, setIsSpacePressed] = useState<boolean>(false);

  // Selection & Clipboard
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [clipboard, setClipboard] = useState<CanvasElement[]>([]);

  // Inline Text state
  const [inlineText, setInlineText] = useState<InlineTextState | null>(null);

  // Modals & Menu status
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isSharingRoom, setIsSharingRoom] = useState<boolean>(false);
  const [isAiCopilotOpen, setIsAiCopilotOpen] = useState<boolean>(false);
  const [isConfirmClearOpen, setIsConfirmClearOpen] = useState<boolean>(false);
  const [mathSuggestion, setMathSuggestion] = useState<MathSolution | null>(null);
  const handledMathSignaturesRef = useRef<Set<string>>(new Set());
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [drawToShape, setDrawToShape] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [canvasBgColor, setCanvasBgColor] = useState<string>("#12151c");

  // Multiplayer Room Sync & LocalStorage
  useRoomSync({
    roomSlug,
    isPersonal,
    setElements,
    setInitialHistory,
  });

  // Theme Sync on Mount
  useEffect(() => {
    let resolvedTheme: "light" | "dark" = "dark";
    const savedTheme = localStorage.getItem("coboard_theme") as "light" | "dark" | null;
    const savedBg = localStorage.getItem("coboard_canvas_bg");

    if (savedTheme === "light" || savedTheme === "dark") {
      resolvedTheme = savedTheme;
    } else if (savedBg) {
      resolvedTheme = isHexLight(savedBg) ? "light" : "dark";
    } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      resolvedTheme = "dark";
    } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
      resolvedTheme = "light";
    }

    const resolvedBg = savedBg || (resolvedTheme === "light" ? "#dedcd9" : "#12151c");
    setTheme(resolvedTheme);
    setCanvasBgColor(resolvedBg);
    setStrokeColor(resolvedTheme === "light" ? "#27221e" : "#ffffff");
    preloadCommonFonts();
  }, []);

  const handleUndo = useCallback(() => {
    const updated = undo();
    if (updated !== null) {
      setElements(updated);
      if (!isPersonal && roomSlug) {
        api.saveElements(roomSlug, updated);
      } else {
        localStorage.setItem("excalidraw_solo_elements", JSON.stringify(updated));
      }
    }
  }, [undo, isPersonal, roomSlug]);

  const handleRedo = useCallback(() => {
    const updated = redo();
    if (updated !== null) {
      setElements(updated);
      if (!isPersonal && roomSlug) {
        api.saveElements(roomSlug, updated);
      } else {
        localStorage.setItem("excalidraw_solo_elements", JSON.stringify(updated));
      }
    }
  }, [redo, isPersonal, roomSlug]);

  // Keyboard Shortcuts Hook
  useCanvasKeyboard({
    elements,
    setElements,
    selectedIds,
    setSelectedIds,
    clipboard,
    setClipboard,
    pushHistory,
    handleUndo,
    handleRedo,
    setIsSpacePressed,
    roomSlug,
    isPersonal,
  });

  // Sync styling when a text element is selected
  useEffect(() => {
    if (selectedIds.length === 1) {
      const sel = elements.find((e) => e.id === selectedIds[0]);
      if (sel && sel.type === "text") {
        if (sel.fontFamily) setFontFamily(sel.fontFamily);
        if (sel.fontWeight) setFontWeight(sel.fontWeight);
        if (sel.fontStyle) setFontStyle(sel.fontStyle);
        if (sel.strokeColor) setStrokeColor(sel.strokeColor);
        if (sel.strokeWidth) setStrokeWidth(sel.strokeWidth);
      }
    }
  }, [selectedIds, elements]);

  // Commit Inline Text
  const commitInlineText = useCallback(() => {
    if (!inlineText) return;
    const trimmed = inlineText.text.trim();
    if (trimmed.length > 0) {
      setElements((prev) => {
        const existing = prev.find((e) => e.id === inlineText.id);
        let updated: CanvasElement[];
        if (existing) {
          updated = prev.map((e) =>
            e.id === inlineText.id
              ? {
                  ...e,
                  text: inlineText.text,
                  fontFamily,
                  fontWeight,
                  fontStyle,
                  strokeColor,
                  strokeWidth,
                }
              : e
          );
        } else {
          const newEl: CanvasElement = {
            id: inlineText.id,
            type: "text",
            x: inlineText.x,
            y: inlineText.y,
            text: inlineText.text,
            strokeColor,
            fillColor: "transparent",
            strokeWidth,
            roughness,
            fontFamily,
            fontWeight,
            fontStyle,
            createdAt: Date.now(),
          };
          updated = [...prev, newEl];
        }
        pushHistory(updated);
        if (!isPersonal && roomSlug) {
          const target = updated.find((e) => e.id === inlineText.id);
          if (target) {
            wsManager.send({
              type: existing ? "UPDATE_ELEMENT" : "DRAW_ELEMENT",
              roomId: roomSlug,
              payload: target,
            });
          }
          api.saveElements(roomSlug, updated);
        } else {
          localStorage.setItem("excalidraw_solo_elements", JSON.stringify(updated));
        }
        return updated;
      });
    } else if (!inlineText.isNew) {
      setElements((prev) => {
        const updated = prev.filter((e) => e.id !== inlineText.id);
        pushHistory(updated);
        return updated;
      });
    }
    setInlineText(null);
    setSelectedIds([]);
  }, [inlineText, fontFamily, fontWeight, fontStyle, strokeColor, strokeWidth, roughness, isPersonal, roomSlug, pushHistory]);

  // Generic helper to batch-update and sync selected elements cleanly
  const updateSelectedElements = useCallback(
    (updates: Partial<CanvasElement>, filterType?: string) => {
      if (selectedIds.length === 0) return;
      setElements((prev) => {
        const updated = prev.map((el) => {
          if (!selectedIds.includes(el.id)) return el;
          if (filterType && el.type !== filterType) return el;
          return { ...el, ...updates };
        });
        pushHistory(updated);
        if (!isPersonal && roomSlug) {
          updated
            .filter((el) => selectedIds.includes(el.id))
            .forEach((el) => {
              wsManager.send({ type: "UPDATE_ELEMENT", roomId: roomSlug, payload: el });
            });
          api.saveElements(roomSlug, updated);
        } else {
          localStorage.setItem("excalidraw_solo_elements", JSON.stringify(updated));
        }
        return updated;
      });
    },
    [selectedIds, isPersonal, roomSlug, pushHistory]
  );

  // Clean Real-Time Property Change Handlers
  const handleSetStrokeColor = useCallback(
    (color: string) => {
      setStrokeColor(color);
      updateSelectedElements({ strokeColor: color });
    },
    [updateSelectedElements]
  );

  const handleSetFillColor = useCallback(
    (color: string) => {
      setFillColor(color);
      updateSelectedElements({ fillColor: color });
    },
    [updateSelectedElements]
  );

  const handleSetStrokeWidth = useCallback(
    (width: number) => {
      setStrokeWidth(width);
      updateSelectedElements({ strokeWidth: width });
    },
    [updateSelectedElements]
  );

  const handleSetStrokeStyle = useCallback(
    (style: "solid" | "dashed" | "dotted") => {
      setStrokeStyle(style);
      updateSelectedElements({ strokeStyle: style });
    },
    [updateSelectedElements]
  );

  const handleSetRoughness = useCallback(
    (r: number) => {
      setRoughness(r);
      updateSelectedElements({ roughness: r });
    },
    [updateSelectedElements]
  );

  const handleSetEdges = useCallback(
    (e: "round" | "sharp") => {
      setEdges(e);
      updateSelectedElements({ edges: e });
    },
    [updateSelectedElements]
  );

  const handleSetArrowhead = useCallback(
    (ah: "sharp" | "sketchy" | "dot" | "bar") => {
      setArrowhead(ah);
      updateSelectedElements({ arrowhead: ah });
    },
    [updateSelectedElements]
  );

  const handleSetArrowType = useCallback(
    (at: "straight" | "curved") => {
      setArrowType(at);
      updateSelectedElements({ arrowType: at });
    },
    [updateSelectedElements]
  );

  const handleSetOpacity = useCallback(
    (op: number) => {
      setOpacity(op);
      updateSelectedElements({ opacity: op });
    },
    [updateSelectedElements]
  );

  const handleSetFontFamily = useCallback(
    (font: FontFamily) => {
      setFontFamily(font);
      updateSelectedElements({ fontFamily: font }, "text");
    },
    [updateSelectedElements]
  );

  const handleSetFontWeight = useCallback(
    (weight: "normal" | "bold") => {
      setFontWeight(weight);
      updateSelectedElements({ fontWeight: weight }, "text");
    },
    [updateSelectedElements]
  );

  const handleSetFontStyle = useCallback(
    (style: "normal" | "italic") => {
      setFontStyle(style);
      updateSelectedElements({ fontStyle: style }, "text");
    },
    [updateSelectedElements]
  );

  // Canvas Drawing & Mouse Events Hook
  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleDoubleClick,
    getCursorStyle,
  } = useCanvasDrawing({
    canvasRef,
    elements,
    setElements,
    pushHistory,
    activeTool,
    setActiveTool,
    strokeColor,
    fillColor,
    strokeWidth,
    strokeStyle,
    roughness,
    edges,
    arrowhead,
    arrowType,
    opacity,
    fontFamily,
    setFontFamily,
    zoom,
    setZoom,
    panOffset,
    setPanOffset,
    isSpacePressed,
    selectedIds,
    setSelectedIds,
    inlineText,
    setInlineText,
    commitInlineText,
    drawToShape,
    showGrid,
    theme,
    canvasBgColor,
    isPersonal,
    roomSlug,
    fileInputRef,
  });

  // Math Notes Detection: Checks current text or sketched pencil strokes for math equations
  useEffect(() => {
    let candidateSol: MathSolution | null = null;

    if (inlineText && inlineText.text) {
      candidateSol = detectMathInText(inlineText.text, {
        x: inlineText.x,
        y: inlineText.y,
        width: Math.max(120, inlineText.text.length * 12),
        height: 40,
      });
    } else if (selectedIds.length === 1) {
      const sel = elements.find((e) => e.id === selectedIds[0]);
      if (sel && sel.type === "text" && sel.text) {
        const bounds = getElementBounds(sel);
        candidateSol = detectMathInText(sel.text, bounds);
      }
    }

    if (!candidateSol) {
      candidateSol = detectMathInSketches(elements);
    }

    if (candidateSol) {
      const sig = candidateSol.sourceElementIds && candidateSol.sourceElementIds.length > 0
        ? candidateSol.sourceElementIds.slice().sort().join("_")
        : `${candidateSol.expression}_${Math.round(candidateSol.targetPosition.x / 40)}_${Math.round(candidateSol.targetPosition.y / 40)}`;

      if (!handledMathSignaturesRef.current.has(sig)) {
        setMathSuggestion(candidateSol);
        return;
      }
    }

    setMathSuggestion(null);
  }, [inlineText, selectedIds, elements]);

  // 1-Click Math Suggestion Insertion
  const handleInsertMathResult = () => {
    if (!mathSuggestion) return;
    const { targetPosition, result, sourceElementIds, expression } = mathSuggestion;

    const sig = sourceElementIds && sourceElementIds.length > 0
      ? sourceElementIds.slice().sort().join("_")
      : `${expression}_${Math.round(targetPosition.x / 40)}_${Math.round(targetPosition.y / 40)}`;
    handledMathSignaturesRef.current.add(sig);

    const newEl: CanvasElement = {
      id: `math_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type: "text",
      x: targetPosition.x,
      y: targetPosition.y,
      text: result,
      strokeColor: theme === "light" ? "#7c3aed" : "#a78bfa",
      fillColor: "transparent",
      strokeWidth: strokeWidth || 2.5,
      roughness: 1.2,
      fontFamily,
      createdAt: Date.now(),
    };

    setElements((prev) => {
      const updated = [...prev, newEl];
      pushHistory(updated);
      if (!isPersonal && roomSlug) {
        wsManager.send({ type: "DRAW_ELEMENT", roomId: roomSlug, payload: newEl });
        api.saveElements(roomSlug, updated);
      } else {
        localStorage.setItem("excalidraw_solo_elements", JSON.stringify(updated));
      }
      return updated;
    });

    setMathSuggestion(null);
  };

  // Rewrite / Clean Up Equation in Symmetrical Handwriting
  const handleRewriteMathEquation = () => {
    if (!mathSuggestion) return;
    const { cleanEquation, sourceElementIds, boundingBox, targetPosition, expression } = mathSuggestion;

    const sig = sourceElementIds && sourceElementIds.length > 0
      ? sourceElementIds.slice().sort().join("_")
      : `${expression}_${Math.round(targetPosition.x / 40)}_${Math.round(targetPosition.y / 40)}`;
    handledMathSignaturesRef.current.add(sig);

    const spawnX = boundingBox ? boundingBox.x : targetPosition.x - 80;
    const spawnY = boundingBox ? boundingBox.y : targetPosition.y;

    const cleanEl: CanvasElement = {
      id: `math_clean_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type: "text",
      x: spawnX,
      y: spawnY,
      text: cleanEquation || mathSuggestion.result,
      strokeColor: theme === "light" ? "#27221e" : "#ffffff",
      fillColor: "transparent",
      strokeWidth: strokeWidth || 2.5,
      roughness: 1.2,
      fontFamily,
      createdAt: Date.now(),
    };

    setElements((prev) => {
      const remaining = sourceElementIds && sourceElementIds.length > 0
        ? prev.filter((el) => !sourceElementIds.includes(el.id))
        : prev;

      const updated = [...remaining, cleanEl];
      pushHistory(updated);
      if (!isPersonal && roomSlug) {
        if (sourceElementIds) {
          sourceElementIds.forEach((id) => {
            wsManager.send({ type: "DELETE_ELEMENT", roomId: roomSlug, payload: { id } });
          });
        }
        wsManager.send({ type: "DRAW_ELEMENT", roomId: roomSlug, payload: cleanEl });
        api.saveElements(roomSlug, updated);
      } else {
        localStorage.setItem("excalidraw_solo_elements", JSON.stringify(updated));
      }
      return updated;
    });

    setMathSuggestion(null);
  };

  const handleDismissMathSuggestion = () => {
    if (mathSuggestion) {
      const sig = mathSuggestion.sourceElementIds && mathSuggestion.sourceElementIds.length > 0
        ? mathSuggestion.sourceElementIds.slice().sort().join("_")
        : `${mathSuggestion.expression}_${Math.round(mathSuggestion.targetPosition.x / 40)}_${Math.round(mathSuggestion.targetPosition.y / 40)}`;
      handledMathSignaturesRef.current.add(sig);
    }
    setMathSuggestion(null);
  };

  // Zoom Helpers
  const handleZoomIn = () => setZoom((z) => Math.min(3.0, Math.round((z + 0.1) * 10) / 10));
  const handleZoomOut = () => setZoom((z) => Math.max(0.2, Math.round((z - 0.1) * 10) / 10));
  const handleResetZoom = () => setZoom(1.0);

  const invertElementsForTheme = (els: CanvasElement[], targetTheme: "light" | "dark"): CanvasElement[] => {
    return els.map((el) => {
      let newStroke = el.strokeColor;
      let newFill = el.fillColor;

      if (targetTheme === "light") {
        if (newStroke === "#ffffff" || newStroke === "#fff" || newStroke?.toLowerCase() === "#f8fafc" || newStroke?.toLowerCase() === "#f1f5f9") {
          newStroke = "#27221e";
        }
        if (newFill === "#ffffff" || newFill === "#fff" || newFill?.toLowerCase() === "#f8fafc" || newFill?.toLowerCase() === "#f1f5f9") {
          newFill = "#27221e";
        }
      } else {
        if (newStroke === "#27221e" || newStroke === "#000000" || newStroke === "#000" || newStroke === "#2d221b" || newStroke === "#1e293b") {
          newStroke = "#ffffff";
        }
        if (newFill === "#27221e" || newFill === "#000000" || newFill === "#000" || newFill === "#2d221b" || newFill === "#1e293b") {
          newFill = "#ffffff";
        }
      }

      if (newStroke !== el.strokeColor || newFill !== el.fillColor) {
        return { ...el, strokeColor: newStroke, fillColor: newFill };
      }
      return el;
    });
  };

  // Toggle Theme
  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    const nextBg = nextTheme === "light" ? "#dedcd9" : "#12151c";
    setCanvasBgColor(nextBg);

    localStorage.setItem("coboard_theme", nextTheme);
    localStorage.setItem("coboard_canvas_bg", nextBg);

    if (nextTheme === "dark" && (strokeColor === "#27221e" || strokeColor === "#2d221b" || strokeColor === "#000000")) {
      setStrokeColor("#ffffff");
    } else if (nextTheme === "light" && strokeColor === "#ffffff") {
      setStrokeColor("#27221e");
    }

    setElements((prev) => {
      const inverted = invertElementsForTheme(prev, nextTheme);
      pushHistory(inverted);
      if (!isPersonal && roomSlug) {
        inverted.forEach((el) => {
          wsManager.send({ type: "UPDATE_ELEMENT", roomId: roomSlug, payload: el });
        });
        api.saveElements(roomSlug, inverted);
      } else {
        localStorage.setItem("excalidraw_solo_elements", JSON.stringify(inverted));
      }
      return inverted;
    });
  };

  const handleSetCanvasBg = (color: string) => {
    setCanvasBgColor(color);
    localStorage.setItem("coboard_canvas_bg", color);
    const nextTheme: "light" | "dark" = isHexLight(color) ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("coboard_theme", nextTheme);

    if (nextTheme === "dark" && (strokeColor === "#27221e" || strokeColor === "#2d221b" || strokeColor === "#000000")) {
      setStrokeColor("#ffffff");
    } else if (nextTheme === "light" && strokeColor === "#ffffff") {
      setStrokeColor("#27221e");
    }

    setElements((prev) => {
      const inverted = invertElementsForTheme(prev, nextTheme);
      pushHistory(inverted);
      if (!isPersonal && roomSlug) {
        inverted.forEach((el) => {
          wsManager.send({ type: "UPDATE_ELEMENT", roomId: roomSlug, payload: el });
        });
        api.saveElements(roomSlug, inverted);
      } else {
        localStorage.setItem("excalidraw_solo_elements", JSON.stringify(inverted));
      }
      return inverted;
    });
  };

  // Image Upload Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) return;

      const img = new Image();
      img.onload = () => {
        const maxW = 400;
        const maxH = 320;
        let w = img.naturalWidth || 300;
        let h = img.naturalHeight || 200;
        if (w > maxW || h > maxH) {
          const ratio = Math.min(maxW / w, maxH / h);
          w = Math.round(w * ratio);
          h = Math.round(h * ratio);
        }

        const rect = canvasRef.current?.getBoundingClientRect();
        const centerX = rect ? rect.width / (2 * zoom) - panOffset.x - w / 2 : 100;
        const centerY = rect ? rect.height / (2 * zoom) - panOffset.y - h / 2 : 100;

        const newEl: CanvasElement = {
          id: `img_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          type: "image",
          x: Math.round(centerX),
          y: Math.round(centerY),
          width: w,
          height: h,
          dataUrl,
          imageUrl: dataUrl,
          strokeColor: "transparent",
          fillColor: "transparent",
          strokeWidth: 1,
          roughness: 0,
          createdAt: Date.now(),
        };

        setElements((prev) => {
          const updated = [...prev, newEl];
          pushHistory(updated);
          setSelectedIds([newEl.id]);
          if (!isPersonal && roomSlug) {
            wsManager.send({ type: "DRAW_ELEMENT", roomId: roomSlug, payload: newEl });
            api.saveElements(roomSlug, updated);
          } else {
            localStorage.setItem("excalidraw_solo_elements", JSON.stringify(updated));
          }
          return updated;
        });
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  // Export PNG
  const handleExportPNG = () => {
    if (!canvasRef.current || elements.length === 0) return;
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = `coboard-${roomSlug || "canvas"}-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  // Clear Canvas Trigger (Opens Confirmation Modal)
  const handleClear = () => {
    if (elements.length === 0) return;
    setIsConfirmClearOpen(true);
  };

  const handleConfirmClear = () => {
    setElements([]);
    setSelectedIds([]);
    pushHistory([]);
    if (!isPersonal && roomSlug) {
      wsManager.send({ type: "CLEAR_CANVAS", roomId: roomSlug, payload: {} });
      api.saveElements(roomSlug, []);
    } else {
      localStorage.setItem("excalidraw_solo_elements", JSON.stringify([]));
    }
  };

  // Save Canvas
  const handleSave = async () => {
    if (isPersonal || !roomSlug) {
      localStorage.setItem("excalidraw_solo_elements", JSON.stringify(elements));
      setSaveStatus("Saved locally");
      setTimeout(() => setSaveStatus(null), 2000);
      return;
    }
    setSaveStatus("Saving...");
    try {
      await api.saveElements(roomSlug, elements);
      setSaveStatus("Saved!");
    } catch {
      setSaveStatus("Failed");
    }
    setTimeout(() => setSaveStatus(null), 2000);
  };

  // Collaborate / Share
  const handleShareOrCollaborate = async () => {
    if (!isPersonal && roomSlug) {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
      return;
    }
    const token = storage.getToken();
    if (!token) {
      setIsAuthOpen(true);
      return;
    }
    await convertSoloToCollaborative();
  };

  const convertSoloToCollaborative = async () => {
    setIsSharingRoom(true);
    try {
      const generatedSlug = `room-${Math.random().toString(36).substring(2, 8)}`;
      const res = await api.createRoom(`Board ${generatedSlug.slice(5)}`, generatedSlug);
      if (res.success && res.data?.slug) {
        const newSlug = res.data.slug;
        if (elements.length > 0) {
          await api.saveElements(newSlug, elements);
        }
        window.location.href = `/canvas/${newSlug}`;
      }
    } catch (err) {
      console.error(err);
      setIsSharingRoom(false);
    }
  };

  // Layer Ordering Handlers
  const handleSendToBack = () => {
    if (selectedIds.length === 0) return;
    setElements((prev) => {
      const selected = prev.filter((el) => selectedIds.includes(el.id));
      const unselected = prev.filter((el) => !selectedIds.includes(el.id));
      const updated = [...selected, ...unselected];
      pushHistory(updated);
      if (!isPersonal && roomSlug) api.saveElements(roomSlug, updated);
      return updated;
    });
  };

  const handleSendBackward = () => {
    if (selectedIds.length === 0) return;
    setElements((prev) => {
      const updated = [...prev];
      for (let i = 0; i < updated.length; i++) {
        if (selectedIds.includes(updated[i].id) && i > 0) {
          const temp = updated[i];
          updated[i] = updated[i - 1];
          updated[i - 1] = temp;
        }
      }
      pushHistory(updated);
      if (!isPersonal && roomSlug) api.saveElements(roomSlug, updated);
      return updated;
    });
  };

  const handleBringForward = () => {
    if (selectedIds.length === 0) return;
    setElements((prev) => {
      const updated = [...prev];
      for (let i = updated.length - 1; i >= 0; i--) {
        if (selectedIds.includes(updated[i].id) && i < updated.length - 1) {
          const temp = updated[i];
          updated[i] = updated[i + 1];
          updated[i + 1] = temp;
        }
      }
      pushHistory(updated);
      if (!isPersonal && roomSlug) api.saveElements(roomSlug, updated);
      return updated;
    });
  };

  const handleBringToFront = () => {
    if (selectedIds.length === 0) return;
    setElements((prev) => {
      const selected = prev.filter((el) => selectedIds.includes(el.id));
      const unselected = prev.filter((el) => !selectedIds.includes(el.id));
      const updated = [...unselected, ...selected];
      pushHistory(updated);
      if (!isPersonal && roomSlug) api.saveElements(roomSlug, updated);
      return updated;
    });
  };

  const isLight = isHexLight(canvasBgColor);
  const effectiveTheme: "light" | "dark" = isLight ? "light" : "dark";
  const selectedElement = selectedIds.length === 1 ? elements.find((e) => e.id === selectedIds[0]) : null;

  return (
    <div
      className={`fixed inset-0 w-screen h-screen overflow-hidden select-none transition-colors duration-300 ${
        isLight ? "text-[#27221e]" : "text-slate-100"
      }`}
      style={{ backgroundColor: canvasBgColor }}
    >
      {/* 1. TOP-LEFT FLOATING ISLAND */}
      <HeaderIsland isLight={isLight} isPersonal={isPersonal} roomSlug={roomSlug} />

      {/* 2A. MOBILE TOP-CENTER AI COPILOT ICON (Centered between Left Header and Right Actions) */}
      <div className="fixed top-2 left-1/2 -translate-x-1/2 z-40 pointer-events-auto sm:hidden">
        <button
          onClick={() => setIsAiCopilotOpen(true)}
          title="Open Coboard AI Copilot"
          className={`p-2 rounded-full border shadow-md transition-all cursor-pointer hover:scale-105 active:scale-95 ${
            isLight
              ? "bg-white/95 text-violet-700 border-white/90"
              : "bg-[#181c28]/95 text-violet-300 border-white/10"
          }`}
        >
          <Sparkles size={15} className="text-violet-500 animate-pulse" />
        </button>
      </div>

      {/* 2B. DESKTOP TOP-CENTER TOOLBAR CAPSULE + AI COPILOT BUTTON */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40 pointer-events-auto hidden sm:flex items-center gap-2">
        <CanvasToolbar
          activeTool={activeTool}
          onSelectTool={(tool) => {
            if (inlineText) commitInlineText();
            if (tool === "image") {
              fileInputRef.current?.click();
            } else {
              setActiveTool(tool);
            }
          }}
          onInsertImage={() => fileInputRef.current?.click()}
          theme={effectiveTheme}
        />

        {/* AI Copilot Quick Trigger Button */}
        <button
          onClick={() => setIsAiCopilotOpen(true)}
          title="Open Coboard AI Copilot"
          className={`flex items-center gap-1.5 px-3 py-2 rounded-full border shadow-md font-medium text-xs transition-all cursor-pointer hover:scale-105 active:scale-95 shrink-0 ${
            isLight
              ? "bg-white/90 hover:bg-white text-violet-700 border-white/90"
              : "bg-[#1e2330]/90 hover:bg-[#252b3b] text-violet-300 border-white/10"
          }`}
        >
          <Sparkles size={14} className="text-violet-500 animate-pulse" />
          <span className="hidden md:inline">AI Copilot</span>
        </button>
      </div>

      {/* 3. TOP-RIGHT ACTION ISLAND */}
      <ActionIsland
        isLight={isLight}
        theme={effectiveTheme}
        toggleTheme={toggleTheme}
        handleShareOrCollaborate={handleShareOrCollaborate}
        isSharingRoom={isSharingRoom}
        isCopied={isCopied}
        isPersonal={isPersonal}
        handleSave={handleSave}
        saveStatus={saveStatus}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        drawToShape={drawToShape}
        setDrawToShape={setDrawToShape}
        setActiveTool={setActiveTool}
        showGrid={showGrid}
        setShowGrid={setShowGrid}
        canvasBgColor={canvasBgColor}
        handleSetCanvasBg={handleSetCanvasBg}
        handleExportPNG={handleExportPNG}
        handleClear={handleClear}
        fileInputRef={fileInputRef}
        handleImageUpload={handleImageUpload}
      />

      {/* 4. LEFT FLOATING PROPERTIES DRAWER */}
      <div className="fixed top-14 sm:top-18 left-2 sm:left-4 z-40 pointer-events-auto">
        {showProperties ? (
          <div className="relative">
            <PropertiesPanel
              strokeColor={strokeColor}
              setStrokeColor={handleSetStrokeColor}
              fillColor={fillColor}
              setFillColor={handleSetFillColor}
              strokeWidth={strokeWidth}
              setStrokeWidth={handleSetStrokeWidth}
              strokeStyle={strokeStyle}
              setStrokeStyle={handleSetStrokeStyle}
              roughness={roughness}
              setRoughness={handleSetRoughness}
              edges={edges}
              setEdges={handleSetEdges}
              arrowhead={arrowhead}
              setArrowhead={handleSetArrowhead}
              arrowType={arrowType}
              setArrowType={handleSetArrowType}
              opacity={opacity}
              setOpacity={handleSetOpacity}
              fontFamily={fontFamily}
              setFontFamily={handleSetFontFamily}
              fontWeight={fontWeight}
              setFontWeight={handleSetFontWeight}
              fontStyle={fontStyle}
              setFontStyle={handleSetFontStyle}
              onSendToBack={handleSendToBack}
              onSendBackward={handleSendBackward}
              onBringForward={handleBringForward}
              onBringToFront={handleBringToFront}
              activeTool={activeTool}
              selectedType={selectedElement?.type}
              theme={effectiveTheme}
              canvasBgColor={canvasBgColor}
              setCanvasBgColor={handleSetCanvasBg}
            />
            <button
              onClick={() => setShowProperties(false)}
              title="Hide Styling Panel"
              className={`absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full border shadow-md flex items-center justify-center transition-all cursor-pointer hover:scale-108 ${
                isLight
                  ? "bg-white text-[#5a4d42] hover:text-[#27221e] border-white/90 shadow-sm"
                  : "bg-[#252b3b] text-slate-300 hover:text-white border-white/15"
              }`}
            >
              <X size={12} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowProperties(true)}
            className={`px-3.5 py-1.5 rounded-full border shadow-md flex items-center gap-1.5 text-xs font-medium transition-all cursor-pointer ${
              isLight
                ? "bg-white/85 hover:bg-white text-[#382f28] border-white/90"
                : "bg-[#1e2330]/90 hover:bg-[#252b3b] text-slate-200 border-white/10"
            }`}
          >
            <Sliders size={13} className="text-[#c45a2c]" /> Styling
          </button>
        )}
      </div>

      {/* 5. BOTTOM-LEFT FLOATING CONTROLS ISLAND */}
      <BottomControlsIsland
        isLight={isLight}
        handleUndo={handleUndo}
        canUndo={canUndo}
        handleRedo={handleRedo}
        canRedo={canRedo}
        handleZoomOut={handleZoomOut}
        handleResetZoom={handleResetZoom}
        handleZoomIn={handleZoomIn}
        zoom={zoom}
        handleClear={handleClear}
        hasElements={elements.length > 0}
        selectedCount={selectedIds.length}
      />

      {/* 6. MOBILE BOTTOM-RIGHT FLOATING TOOL SELECTOR */}
      <div className="fixed bottom-2 right-2 z-40 sm:hidden pointer-events-auto flex items-center gap-1.5">
        <MobileToolDropdown
          activeTool={activeTool}
          onSelectTool={(tool) => {
            if (inlineText) commitInlineText();
            if (tool === "image") {
              fileInputRef.current?.click();
            } else {
              setActiveTool(tool);
            }
          }}
          onOpenAi={() => setIsAiCopilotOpen(true)}
          theme={effectiveTheme}
        />
      </div>

      {/* 7. BOTTOM-RIGHT HELPER TAG (DESKTOP) */}
      <div className="fixed bottom-4 right-4 z-40 hidden md:flex items-center gap-2 pointer-events-none">
        <div
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-[11px] shadow-sm ${
            isLight
              ? "bg-white/70 border-white/90 text-[#7a6b5e]"
              : "bg-[#1e2330]/70 border-white/10 text-slate-400"
          }`}
        >
          <span className="font-handwriting text-sm text-[#c45a2c]">Ctrl+Z / Ctrl+Y</span>
          <span>·</span>
          <span>{isPersonal ? "Personal Canvas (Auto-saved)" : "Collaborative Room"}</span>
        </div>
      </div>

      {/* 7. FULLSCREEN CANVAS VIEWPORT */}
      <div className="w-full h-full relative" style={{ cursor: getCursorStyle() }}>
        <canvas
          ref={canvasRef}
          onPointerDown={handleMouseDown}
          onPointerMove={handleMouseMove}
          onPointerUp={handleMouseUp}
          onPointerCancel={handleMouseUp}
          onPointerLeave={handleMouseUp}
          onDoubleClick={handleDoubleClick}
          className="absolute inset-0 block touch-none select-none"
        />

        {/* INLINE TEXT EDITOR OVERLAY */}
        {inlineText && (
          <InlineTextEditor
            inlineText={inlineText}
            setInlineText={setInlineText}
            panOffset={panOffset}
            zoom={zoom}
            fontFamily={fontFamily}
            setFontFamily={setFontFamily}
            fontWeight={fontWeight}
            fontStyle={fontStyle}
            strokeColor={strokeColor}
            strokeWidth={strokeWidth}
            isLight={isLight}
            commitInlineText={commitInlineText}
          />
        )}

        {/* 8. REAL-TIME AI MATH NOTES SUGGESTION PILL */}
        {mathSuggestion && (
          <div
            className="absolute z-50 pointer-events-auto flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/95 dark:bg-[#1c202d]/95 backdrop-blur-2xl border border-violet-500/30 shadow-2xl animate-in zoom-in-95 duration-150 select-none"
            style={{
              left: `${(mathSuggestion.targetPosition.x + panOffset.x) * zoom}px`,
              top: `${(mathSuggestion.targetPosition.y + panOffset.y) * zoom}px`,
              transformOrigin: "top left",
            }}
          >
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 font-mono text-xs font-bold">
              <Sparkles size={12} className="text-violet-500" />
              <span>{mathSuggestion.result}</span>
            </div>

            {/* 1. Insert Answer Only */}
            <button
              onClick={handleInsertMathResult}
              title="Insert answer beside equation"
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold shadow-sm cursor-pointer transition-all hover:scale-105 active:scale-95"
            >
              <Plus size={12} />
              <span>Insert</span>
            </button>

            {/* 2. Rewrite Equation in Symmetrical Typography */}
            <button
              onClick={handleRewriteMathEquation}
              title="Clean up messy sketch into symmetrical handwritten equation"
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-xs font-semibold shadow-sm cursor-pointer transition-all hover:scale-105 active:scale-95"
            >
              <Wand2 size={12} />
              <span>Rewrite</span>
            </button>

            <button
              onClick={handleDismissMathSuggestion}
              title="Dismiss"
              className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X size={12} />
            </button>
          </div>
        )}
      </div>

      {/* AI Copilot Modal */}
      <AiCopilotModal
        isOpen={isAiCopilotOpen}
        onClose={() => setIsAiCopilotOpen(false)}
        onInsertElements={(newEls) => {
          setElements((prev) => {
            const updated = [...prev, ...newEls];
            pushHistory(updated);
            setSelectedIds(newEls.map((e) => e.id));
            if (!isPersonal && roomSlug) {
              newEls.forEach((el) => {
                wsManager.send({ type: "DRAW_ELEMENT", roomId: roomSlug, payload: el });
              });
              api.saveElements(roomSlug, updated);
            } else {
              localStorage.setItem("excalidraw_solo_elements", JSON.stringify(updated));
            }
            return updated;
          });
        }}
        theme={effectiveTheme}
        panOffset={panOffset}
        zoom={zoom}
        existingElements={elements}
      />

      {/* Auth Modal for Seamless Share Onboarding */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={() => {
          setIsAuthOpen(false);
          convertSoloToCollaborative();
        }}
      />

      {/* Confirmation Modal for Clearing Canvas */}
      <ConfirmClearModal
        isOpen={isConfirmClearOpen}
        onClose={() => setIsConfirmClearOpen(false)}
        onConfirm={handleConfirmClear}
        theme={effectiveTheme}
      />
    </div>
  );
};
