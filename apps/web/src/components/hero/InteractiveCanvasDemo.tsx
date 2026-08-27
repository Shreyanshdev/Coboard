"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { CanvasElement, ToolType, Point, FontFamily } from "@/types";
import { SUPPORTED_TOOLS } from "@/lib/constants";
import {
  drawRoughElement,
  isPointInsideElement,
  isElementHitByEraser,
  getElementBounds,
} from "@/lib/canvas-utils";
import {
  MousePointer,
  Hand,
  Pencil,
  Square,
  Circle,
  Minus,
  ArrowUpRight,
  Type,
  Eraser,
  RotateCcw,
  Trash2,
  Pipette,
  Sparkles,
} from "lucide-react";

const TOOL_ICONS: Record<string, React.ReactNode> = {
  select: <MousePointer size={15} />,
  hand: <Hand size={15} />,
  pencil: <Pencil size={15} />,
  rectangle: <Square size={15} />,
  circle: <Circle size={15} />,
  line: <Minus size={15} />,
  arrow: <ArrowUpRight size={15} />,
  text: <Type size={15} />,
  eraser: <Eraser size={15} />,
};

const LIQUID_STROKE_COLORS = [
  "#2d221b",
  "#d96734",
  "#dfad42",
  "#5293b0",
  "#388e5d",
  "#8e44ad",
  "#e03131",
  "#ffffff",
];

const LIQUID_FILL_COLORS = [
  "transparent",
  "rgba(217, 103, 52, 0.25)",
  "rgba(223, 173, 66, 0.25)",
  "rgba(82, 147, 176, 0.25)",
  "rgba(56, 142, 93, 0.25)",
  "rgba(142, 68, 173, 0.25)",
];

const INITIAL_COBOARD_ELEMENTS: CanvasElement[] = [
  // 1. Coboard Client Box
  {
    id: "demo-client-box",
    type: "rectangle",
    x: 45,
    y: 35,
    width: 175,
    height: 105,
    strokeColor: "#2d221b",
    fillColor: "rgba(217, 103, 52, 0.18)",
    strokeWidth: 2.2,
    roughness: 1.3,
    createdAt: 1,
  },
  {
    id: "demo-client-title",
    type: "text",
    x: 60,
    y: 53,
    text: "Coboard Client",
    strokeColor: "#c45a2c",
    fillColor: "transparent",
    strokeWidth: 2.5,
    roughness: 0,
    fontFamily: "handwriting",
    createdAt: 2,
  },
  {
    id: "demo-client-sub1",
    type: "text",
    x: 60,
    y: 81,
    text: "• Instant Canvas",
    strokeColor: "#2d221b",
    fillColor: "transparent",
    strokeWidth: 1.8,
    roughness: 0,
    fontFamily: "handwriting",
    createdAt: 3,
  },
  {
    id: "demo-client-sub2",
    type: "text",
    x: 60,
    y: 105,
    text: "• 9 Sketchy Tools",
    strokeColor: "#2d221b",
    fillColor: "transparent",
    strokeWidth: 1.8,
    roughness: 0,
    fontFamily: "handwriting",
    createdAt: 4,
  },

  // 2. Arrow to WebSocket Hub
  {
    id: "demo-arrow-1",
    type: "arrow",
    x: 220,
    y: 88,
    width: 85,
    height: 0,
    strokeColor: "#d96734",
    fillColor: "transparent",
    strokeWidth: 2.2,
    roughness: 1.3,
    createdAt: 5,
  },
  {
    id: "demo-arrow-1-text",
    type: "text",
    x: 230,
    y: 64,
    text: "realtime",
    strokeColor: "#d96734",
    fillColor: "transparent",
    strokeWidth: 1.8,
    roughness: 0,
    fontFamily: "handwriting",
    createdAt: 6,
  },

  // 3. Live Room Hub (Center)
  {
    id: "demo-room-box",
    type: "rectangle",
    x: 305,
    y: 35,
    width: 180,
    height: 105,
    strokeColor: "#2d221b",
    fillColor: "rgba(223, 173, 66, 0.22)",
    strokeWidth: 2.2,
    roughness: 1.3,
    createdAt: 7,
  },
  {
    id: "demo-room-title",
    type: "text",
    x: 320,
    y: 53,
    text: "Multiplayer Room",
    strokeColor: "#b88522",
    fillColor: "transparent",
    strokeWidth: 2.5,
    roughness: 0,
    fontFamily: "handwriting",
    createdAt: 8,
  },
  {
    id: "demo-room-sub1",
    type: "text",
    x: 320,
    y: 81,
    text: "• Sub-5ms latency",
    strokeColor: "#2d221b",
    fillColor: "transparent",
    strokeWidth: 1.8,
    roughness: 0,
    fontFamily: "handwriting",
    createdAt: 9,
  },
  {
    id: "demo-room-sub2",
    type: "text",
    x: 320,
    y: 105,
    text: "• Live cursors",
    strokeColor: "#2d221b",
    fillColor: "transparent",
    strokeWidth: 1.8,
    roughness: 0,
    fontFamily: "handwriting",
    createdAt: 10,
  },

  // 4. Arrow to Postgres / Redis
  {
    id: "demo-arrow-2",
    type: "arrow",
    x: 485,
    y: 88,
    width: 85,
    height: 0,
    strokeColor: "#5293b0",
    fillColor: "transparent",
    strokeWidth: 2.2,
    roughness: 1.3,
    createdAt: 11,
  },
  {
    id: "demo-arrow-2-text",
    type: "text",
    x: 495,
    y: 64,
    text: "save state",
    strokeColor: "#5293b0",
    fillColor: "transparent",
    strokeWidth: 1.8,
    roughness: 0,
    fontFamily: "handwriting",
    createdAt: 12,
  },

  // 5. Database Cluster (Right)
  {
    id: "demo-db-box",
    type: "circle",
    x: 575,
    y: 35,
    width: 110,
    height: 105,
    strokeColor: "#2d221b",
    fillColor: "rgba(82, 147, 176, 0.2)",
    strokeWidth: 2.2,
    roughness: 1.3,
    createdAt: 13,
  },
  {
    id: "demo-db-title",
    type: "text",
    x: 588,
    y: 67,
    text: "PostgreSQL",
    strokeColor: "#25576f",
    fillColor: "transparent",
    strokeWidth: 2.2,
    roughness: 0,
    fontFamily: "handwriting",
    createdAt: 14,
  },
  {
    id: "demo-db-sub",
    type: "text",
    x: 598,
    y: 93,
    text: "+ Redis",
    strokeColor: "#2d221b",
    fillColor: "transparent",
    strokeWidth: 1.8,
    roughness: 0,
    fontFamily: "handwriting",
    createdAt: 15,
  },

  // 6. Sticky Note 1 (Green / Mint) - "About Coboard"
  {
    id: "demo-sticky-1",
    type: "rectangle",
    x: 45,
    y: 165,
    width: 280,
    height: 100,
    strokeColor: "#388e5d",
    fillColor: "rgba(56, 142, 93, 0.16)",
    strokeWidth: 2,
    roughness: 1.4,
    createdAt: 16,
  },
  {
    id: "demo-sticky-1-title",
    type: "text",
    x: 60,
    y: 183,
    text: "✨ About Coboard:",
    strokeColor: "#2e7d32",
    fillColor: "transparent",
    strokeWidth: 2.3,
    roughness: 0,
    fontFamily: "handwriting",
    createdAt: 17,
  },
  {
    id: "demo-sticky-1-line1",
    type: "text",
    x: 60,
    y: 210,
    text: "A zero-friction whiteboard built for",
    strokeColor: "#27221e",
    fillColor: "transparent",
    strokeWidth: 1.8,
    roughness: 0,
    fontFamily: "handwriting",
    createdAt: 18,
  },
  {
    id: "demo-sticky-1-line2",
    type: "text",
    x: 60,
    y: 235,
    text: "thinkers, architects & fast teams!",
    strokeColor: "#27221e",
    fillColor: "transparent",
    strokeWidth: 1.8,
    roughness: 0,
    fontFamily: "handwriting",
    createdAt: 19,
  },

  // 7. Sticky Note 2 (Purple / Violet) - "Interactive Instructions"
  {
    id: "demo-sticky-2",
    type: "rectangle",
    x: 350,
    y: 165,
    width: 335,
    height: 100,
    strokeColor: "#8e44ad",
    fillColor: "rgba(142, 68, 173, 0.14)",
    strokeWidth: 2,
    roughness: 1.4,
    createdAt: 20,
  },
  {
    id: "demo-sticky-2-title",
    type: "text",
    x: 365,
    y: 183,
    text: "✎ Try Drawing Right Here:",
    strokeColor: "#6a1b9a",
    fillColor: "transparent",
    strokeWidth: 2.3,
    roughness: 0,
    fontFamily: "handwriting",
    createdAt: 21,
  },
  {
    id: "demo-sticky-2-line1",
    type: "text",
    x: 365,
    y: 210,
    text: "1. Pick Pencil, Shapes, Arrow or Eraser",
    strokeColor: "#27221e",
    fillColor: "transparent",
    strokeWidth: 1.8,
    roughness: 0,
    fontFamily: "handwriting",
    createdAt: 22,
  },
  {
    id: "demo-sticky-2-line2",
    type: "text",
    x: 365,
    y: 235,
    text: "2. Change colors & drag elements around!",
    strokeColor: "#27221e",
    fillColor: "transparent",
    strokeWidth: 1.8,
    roughness: 0,
    fontFamily: "handwriting",
    createdAt: 23,
  },
];

export const InteractiveCanvasDemo: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const textInputRef = useRef<HTMLTextAreaElement | null>(null);

  const [selectedTool, setSelectedTool] = useState<ToolType>("pencil");
  const [strokeColor, setStrokeColor] = useState<string>("#2d221b");
  const [fillColor, setFillColor] = useState<string>("rgba(217, 103, 52, 0.25)");
  const [strokeWidth, setStrokeWidth] = useState<number>(2.5);
  const [roughness, setRoughness] = useState<number>(1.4);
  const [fontFamily, setFontFamily] = useState<FontFamily>("handwriting");

  const [elements, setElements] = useState<CanvasElement[]>(INITIAL_COBOARD_ELEMENTS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDraggingSelected, setIsDraggingSelected] = useState<boolean>(false);
  const [dragStartPoint, setDragStartPoint] = useState<Point>({ x: 0, y: 0 });
  const [dragInitialElements, setDragInitialElements] = useState<CanvasElement[]>([]);

  const [inlineText, setInlineText] = useState<{
    id: string;
    x: number;
    y: number;
    text: string;
    isNew: boolean;
  } | null>(null);

  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [currentElement, setCurrentElement] = useState<CanvasElement | null>(null);

  // Eraser drag trail, ghost hover & smooth fade-out dissolve
  const [isErasing, setIsErasing] = useState<boolean>(false);
  const [eraserTrail, setEraserTrail] = useState<Point[]>([]);
  const [erasedIds, setErasedIds] = useState<Set<string>>(new Set());
  const [eraserCursorPos, setEraserCursorPos] = useState<Point | null>(null);
  const fadingElementsRef = useRef<{
    element: CanvasElement;
    startTime: number;
    duration: number;
  }[]>([]);
  const animFrameIdRef = useRef<number | null>(null);

  // Focus inline textarea on mount
  useEffect(() => {
    if (inlineText && textInputRef.current) {
      textInputRef.current.focus();
    }
  }, [inlineText]);

  const handleResetDemo = () => {
    setElements(INITIAL_COBOARD_ELEMENTS);
    setSelectedIds([]);
  };

  // Redraw canvas
  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, rect.width, rect.height);

    // Light subtle grid pattern
    ctx.strokeStyle = "rgba(60, 45, 35, 0.05)";
    ctx.lineWidth = 1;
    const gridSize = 24;
    for (let x = 0; x < rect.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, rect.height);
      ctx.stroke();
    }
    for (let y = 0; y < rect.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(rect.width, y);
      ctx.stroke();
    }

    // 1. Render committed elements (faded ghost if currently hit by eraser)
    elements.forEach((el) => {
      if (inlineText && inlineText.id === el.id) return;
      const isBeingErased = erasedIds.has(el.id);
      const isSelected = selectedIds.includes(el.id);
      drawRoughElement(ctx, el, isSelected, isBeingErased ? 0.22 : 1);
    });

    // 2. Render smooth dissolving / fading elements (dissolve animation)
    const now = performance.now();
    fadingElementsRef.current.forEach((item) => {
      const progress = Math.min(1, Math.max(0, (now - item.startTime) / item.duration));
      const fadeAlpha = 1 - progress;
      if (fadeAlpha > 0.01) {
        drawRoughElement(ctx, item.element, false, fadeAlpha);

        // Gentle floating dissolution dust particles
        const bounds = getElementBounds(item.element);
        ctx.save();
        ctx.fillStyle = `rgba(196, 90, 44, ${fadeAlpha * 0.45})`;
        for (let i = 0; i < 5; i++) {
          const px = bounds.x + (bounds.width * (i + 1)) / 6;
          const py = bounds.y + bounds.height / 2 - progress * 16;
          ctx.beginPath();
          ctx.arc(px, py, Math.max(0.5, 2.5 * (1 - progress)), 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    });

    // 3. Render drafting element
    if (currentElement) {
      drawRoughElement(ctx, currentElement, false);
    }

    // 4. Render eraser drag ribbon trail
    if (isErasing && eraserTrail.length > 1) {
      ctx.save();
      ctx.strokeStyle = "rgba(220, 38, 38, 0.25)";
      ctx.lineWidth = 14;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(eraserTrail[0].x, eraserTrail[0].y);
      for (let i = 1; i < eraserTrail.length; i++) {
        ctx.lineTo(eraserTrail[i].x, eraserTrail[i].y);
      }
      ctx.stroke();
      ctx.restore();
    }

    // 5. Render eraser hover circular ring indicator
    if (selectedTool === "eraser" && eraserCursorPos) {
      ctx.save();
      ctx.strokeStyle = "rgba(196, 90, 44, 0.75)";
      ctx.lineWidth = 1.5;
      ctx.fillStyle = "rgba(196, 90, 44, 0.1)";
      ctx.beginPath();
      ctx.arc(eraserCursorPos.x, eraserCursorPos.y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
  }, [
    elements,
    currentElement,
    selectedIds,
    inlineText,
    erasedIds,
    isErasing,
    eraserTrail,
    selectedTool,
    eraserCursorPos,
  ]);

  const runFadeAnimation = useCallback(() => {
    const now = performance.now();
    fadingElementsRef.current = fadingElementsRef.current.filter(
      (item) => now - item.startTime < item.duration
    );

    redraw();

    if (fadingElementsRef.current.length > 0) {
      animFrameIdRef.current = requestAnimationFrame(runFadeAnimation);
    } else {
      animFrameIdRef.current = null;
    }
  }, [redraw]);

  const triggerEraseElements = useCallback(
    (targetIds: string[]) => {
      if (targetIds.length === 0) return;
      const toFade = elements.filter((el) => targetIds.includes(el.id));
      const remaining = elements.filter((el) => !targetIds.includes(el.id));

      const now = performance.now();
      const newFading = toFade.map((el) => ({
        element: el,
        startTime: now,
        duration: 220,
      }));
      fadingElementsRef.current = [...fadingElementsRef.current, ...newFading];

      setElements(remaining);
      setSelectedIds((prev) => prev.filter((id) => !targetIds.includes(id)));

      if (!animFrameIdRef.current) {
        animFrameIdRef.current = requestAnimationFrame(runFadeAnimation);
      }
    },
    [elements, runFadeAnimation]
  );

  useEffect(() => {
    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, []);

  useEffect(() => {
    redraw();
    const handleResize = () => redraw();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [redraw]);

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const commitInlineText = () => {
    if (!inlineText) return;
    const trimmed = inlineText.text.trim();

    if (trimmed.length > 0) {
      const elementToSave: CanvasElement = {
        id: inlineText.id,
        type: "text",
        x: inlineText.x,
        y: inlineText.y,
        text: inlineText.text,
        strokeColor,
        fillColor: "transparent",
        strokeWidth,
        roughness: 0,
        fontFamily,
        createdAt: Date.now(),
      };

      const existingIndex = elements.findIndex((el) => el.id === inlineText.id);
      let updated: CanvasElement[];
      if (existingIndex >= 0) {
        updated = [...elements];
        updated[existingIndex] = elementToSave;
      } else {
        updated = [...elements, elementToSave];
      }

      setElements(updated);
      setSelectedIds([elementToSave.id]);
    } else if (!inlineText.isNew) {
      setElements((prev) => prev.filter((el) => el.id !== inlineText.id));
    }

    setInlineText(null);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (inlineText) {
      commitInlineText();
    }

    const { x, y } = getCanvasCoordinates(e);

    // Eraser Tool -> Drag or Click
    if (selectedTool === "eraser") {
      setIsErasing(true);
      setEraserTrail([{ x, y }]);
      const hitIds = new Set<string>();
      elements.forEach((el) => {
        if (isElementHitByEraser({ x, y }, el, 16)) {
          hitIds.add(el.id);
        }
      });
      setErasedIds(hitIds);
      return;
    }

    // Inline typing on click (Excalidraw style without any alerts/modals)
    if (selectedTool === "text") {
      setInlineText({
        id: `text_${Date.now()}`,
        x,
        y,
        text: "",
        isNew: true,
      });
      return;
    }

    // Select Tool -> Move & Drag elements
    if (selectedTool === "select") {
      const clickedEl = [...elements].reverse().find((el) => isPointInsideElement({ x, y }, el));
      if (clickedEl) {
        setSelectedIds([clickedEl.id]);
        setIsDraggingSelected(true);
        setDragStartPoint({ x, y });
        setDragInitialElements([...elements]);
      } else {
        setSelectedIds([]);
      }
      return;
    }

    setIsDrawing(true);
    const newEl: CanvasElement = {
      id: `el_${Date.now()}`,
      type: selectedTool,
      x,
      y,
      width: 0,
      height: 0,
      points: selectedTool === "pencil" ? [{ x, y }] : undefined,
      strokeColor,
      fillColor,
      strokeWidth,
      roughness,
      createdAt: Date.now(),
    };
    setCurrentElement(newEl);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const currentPoint = getCanvasCoordinates(e);

    // Eraser Tool - Dynamic Drag Trail, Ghost Hover Highlighting & Ring Indicator
    if (selectedTool === "eraser") {
      setEraserCursorPos(currentPoint);
      if (isErasing) {
        setEraserTrail((prev) => [...prev, currentPoint]);
        setErasedIds((prev) => {
          let hasNew = false;
          const next = new Set(prev);
          elements.forEach((el) => {
            if (!next.has(el.id) && isElementHitByEraser(currentPoint, el, 16)) {
              next.add(el.id);
              hasNew = true;
            }
          });
          return hasNew ? next : prev;
        });
      }
      return;
    }

    if (isDraggingSelected && selectedIds.length > 0) {
      const dx = currentPoint.x - dragStartPoint.x;
      const dy = currentPoint.y - dragStartPoint.y;

      const updated = elements.map((el) => {
        if (!selectedIds.includes(el.id)) return el;
        const initial = dragInitialElements.find((init) => init.id === el.id) || el;

        if (initial.type === "pencil" && initial.points) {
          return {
            ...initial,
            points: initial.points.map((p) => ({ x: p.x + dx, y: p.y + dy })),
          };
        }

        return {
          ...initial,
          x: initial.x + dx,
          y: initial.y + dy,
        };
      });

      setElements(updated);
      return;
    }

    if (!isDrawing || !currentElement) return;

    if (currentElement.type === "pencil" || currentElement.type === "highlighter") {
      const existingPts = currentElement.points || [];
      const lastPt = existingPts[existingPts.length - 1];
      if (!lastPt || Math.hypot(currentPoint.x - lastPt.x, currentPoint.y - lastPt.y) >= 2) {
        setCurrentElement({
          ...currentElement,
          points: [...existingPts, currentPoint],
        });
      }
    } else {
      setCurrentElement({
        ...currentElement,
        width: currentPoint.x - currentElement.x,
        height: currentPoint.y - currentElement.y,
      });
    }
  };

  const handleMouseUp = () => {
    // Eraser Tool -> Smooth Fade-Out Dissolve & Commit
    if (selectedTool === "eraser" || isErasing) {
      if (erasedIds.size > 0) {
        triggerEraseElements(Array.from(erasedIds));
      }
      setIsErasing(false);
      setEraserTrail([]);
      setErasedIds(new Set());
      return;
    }

    if (isDraggingSelected) {
      setIsDraggingSelected(false);
      return;
    }

    if (isDrawing && currentElement) {
      setElements((prev) => [...prev, currentElement]);
      setSelectedIds([currentElement.id]);
      setCurrentElement(null);
      setIsDrawing(false);
    }
  };

  const handleMouseLeave = () => {
    setEraserCursorPos(null);
    if (isErasing) {
      if (erasedIds.size > 0) {
        triggerEraseElements(Array.from(erasedIds));
      }
      setIsErasing(false);
      setEraserTrail([]);
      setErasedIds(new Set());
    }
    if (isDraggingSelected) setIsDraggingSelected(false);
    if (isDrawing && currentElement) {
      handleMouseUp();
    }
  };

  const handleUndo = () => {
    setElements((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setElements([]);
    setSelectedIds([]);
  };

  return (
    <div className="w-full max-w-5xl mx-auto liquid-glass-card rounded-[38px] overflow-hidden border border-white/85 shadow-lg">
      {/* Top Floating Glass Toolbar */}
      <div className="bg-white/50 backdrop-blur-xl border-b border-white/60 p-3 sm:px-5 flex flex-wrap items-center justify-between gap-3">
        {/* Tools Pill */}
        <div className="flex items-center gap-1 bg-white/70 p-1 rounded-full border border-white/80 shadow-xs">
          {SUPPORTED_TOOLS.map((tool) => (
            <button
              key={tool.id}
              onClick={() => {
                if (inlineText) commitInlineText();
                setSelectedTool(tool.id);
              }}
              title={`${tool.label} (${tool.shortcut})`}
              className={`p-2 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
                selectedTool === tool.id
                  ? "bg-[#27221e] text-white shadow-xs scale-105"
                  : "text-[#7a6b5e] hover:text-[#251d17] hover:bg-white/60"
              }`}
            >
              {TOOL_ICONS[tool.id] || <Square size={15} />}
            </button>
          ))}
        </div>

        {/* Color pickers with Custom RGB Picker */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-white/70 px-3 py-1.5 rounded-full border border-white/80 shadow-xs">
            <span className="text-[10px] text-[#7a6b5e] font-medium uppercase tracking-wider">Stroke</span>
            <div className="flex items-center gap-1.5">
              {LIQUID_STROKE_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setStrokeColor(c)}
                  className={`w-4 h-4 rounded-full transition-transform cursor-pointer border ${
                    c === "#ffffff" ? "border-slate-300" : "border-transparent"
                  } ${
                    strokeColor === c ? "ring-2 ring-[#4a3a2e] ring-offset-1 scale-110" : ""
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}

              {/* Custom RGB Picker */}
              <label
                title="Custom RGB Color"
                className="w-4 h-4 rounded-full border border-dashed border-[#8c7b6f] flex items-center justify-center cursor-pointer overflow-hidden relative"
                style={{ backgroundColor: strokeColor }}
              >
                <input
                  type="color"
                  value={strokeColor.startsWith("#") ? strokeColor : "#27221e"}
                  onChange={(e) => setStrokeColor(e.target.value)}
                  className="opacity-0 absolute inset-0 cursor-pointer w-full h-full"
                />
                <Pipette size={9} className="text-white drop-shadow-sm pointer-events-none" />
              </label>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 bg-white/70 px-3 py-1.5 rounded-full border border-white/80 shadow-xs">
            <span className="text-[10px] text-[#7a6b5e] font-medium uppercase tracking-wider">Fill</span>
            <div className="flex items-center gap-1.5">
              {LIQUID_FILL_COLORS.map((fc, i) => (
                <button
                  key={i}
                  onClick={() => setFillColor(fc)}
                  className={`w-4 h-4 rounded-full border border-[#8a7b6f]/30 transition-transform cursor-pointer ${
                    fillColor === fc ? "ring-2 ring-[#4a3a2e] ring-offset-1 scale-110" : ""
                  }`}
                  style={{ backgroundColor: fc === "transparent" ? "#dedcd9" : fc }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Actions (Reset Demo, Undo, Clear) */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleResetDemo}
            title="Reset to Coboard Template"
            className="px-2.5 py-1 text-xs text-[#7a6b5e] hover:text-[#c45a2c] hover:bg-white/70 rounded-full transition-all cursor-pointer flex items-center gap-1 font-medium border border-white/60 bg-white/40 shadow-xs"
          >
            <Sparkles size={13} className="text-[#c45a2c]" />
            <span className="hidden sm:inline font-handwriting text-sm">Demo</span>
          </button>
          <button
            onClick={handleUndo}
            disabled={elements.length === 0}
            title="Undo stroke"
            className="p-2 text-[#7a6b5e] hover:text-[#251d17] hover:bg-white/60 disabled:opacity-30 rounded-full transition-colors cursor-pointer"
          >
            <RotateCcw size={15} />
          </button>
          <button
            onClick={handleClear}
            disabled={elements.length === 0}
            title="Clear canvas"
            className="p-2 text-[#7a6b5e] hover:text-red-600 hover:bg-white/60 disabled:opacity-30 rounded-full transition-colors cursor-pointer"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="relative w-full h-[360px] sm:h-[420px] bg-[#eceae7]/60 cursor-crosshair overflow-hidden select-none">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          className="w-full h-full block"
        />

        {/* INLINE TEXT EDITING (Direct on Canvas with 5 Font Choices) */}
        {inlineText && (
          <div
            className="absolute z-20 flex flex-col gap-1 items-start"
            style={{
              left: `${inlineText.x}px`,
              top: `${inlineText.y}px`,
            }}
          >
            {/* Quick 5-Font Switcher Floating Bar */}
            <div className="flex items-center gap-1 bg-white/95 backdrop-blur-md p-1 rounded-full border border-black/10 shadow-md mb-0.5 select-none">
              {[
                { id: "handwriting" as const, name: "Caveat", preview: "font-handwriting font-bold" },
                { id: "kalam" as const, name: "Kalam", preview: "font-kalam" },
                { id: "architect" as const, name: "Architect", preview: "font-architect" },
                { id: "chillax" as const, name: "Chillax", preview: "font-chillax font-semibold" },
                { id: "mono" as const, name: "Mono", preview: "font-mono" },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFontFamily(f.id)}
                  type="button"
                  title={`Use ${f.name} font`}
                  className={`px-2.5 py-0.5 text-xs rounded-full transition-all cursor-pointer ${
                    fontFamily === f.id
                      ? "bg-[#2d221b] text-white shadow-xs scale-105 font-medium"
                      : "text-[#7a6b5e] hover:bg-black/5"
                  }`}
                >
                  <span className={f.preview}>{f.name}</span>
                </button>
              ))}
            </div>

            <textarea
              ref={textInputRef}
              value={inlineText.text}
              onChange={(e) =>
                setInlineText({
                  ...inlineText,
                  text: e.target.value,
                })
              }
              onBlur={commitInlineText}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  commitInlineText();
                }
              }}
              placeholder="Type note..."
              className={`bg-white/80 dark:bg-black/40 border-2 border-violet-500/80 rounded-xl outline-none resize-none overflow-hidden p-1.5 leading-tight transition-none shadow-md ${
                fontFamily === "kalam"
                  ? "font-kalam"
                  : fontFamily === "architect"
                  ? "font-architect"
                  : fontFamily === "chillax"
                  ? "font-chillax"
                  : fontFamily === "mono"
                  ? "font-mono"
                  : "font-handwriting"
              }`}
              style={{
                color: strokeColor,
                fontSize: `${Math.max(22, strokeWidth * 9)}px`,
                minWidth: "140px",
                minHeight: "40px",
                width: `${Math.max(140, (inlineText.text.length + 3) * 14)}px`,
                height: `${Math.max(40, (inlineText.text.split("\n").length + 1) * 28)}px`,
              }}
            />
          </div>
        )}

        {/* Bottom floating hint tag */}
        <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between pointer-events-none text-xs text-[#736357]">
          <div className="flex items-center gap-2 bg-white/75 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/90 shadow-sm pointer-events-auto">
            <span className="w-2 h-2 rounded-full bg-[#388e5d] animate-pulse" />
            <span>Interactive Live Engine Demo</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 bg-white/75 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/90 shadow-sm pointer-events-auto">
            <span className="font-handwriting text-sm text-[#c45a2c]">drag elements to move</span>
            <span>·</span>
            <span className="text-[#2d221b] font-medium">{elements.length}</span> elements
          </div>
        </div>
      </div>
    </div>
  );
};
