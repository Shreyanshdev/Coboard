import React, { useRef, useState, useEffect, useCallback } from "react";
import { CanvasElement, ToolType, Point, FontFamily } from "@/types";
import {
  drawRoughElement,
  isElementInViewport,
  isPointInsideElement,
  isElementHitByEraser,
  getElementCenter,
  getResizeHandleAtPosition,
  ResizeHandle,
  detectMagicShape,
  findNearestBindingShape,
  updateBoundArrows,
  isElementInsideBox,
} from "@/lib/canvas-utils";
import { InlineTextState } from "../InlineTextEditor";
import { wsManager } from "@/lib/ws";
import { api } from "@/lib/api";

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

// Premium Custom SVG Cursors
const PENCIL_CURSOR = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'%3E%3Cpath d='M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z' fill='%237c3aed' stroke='%23ffffff' stroke-width='1.5' stroke-linejoin='round'/%3E%3Cpolygon points='2,22 7.5,20.5 3.5,16.5' fill='%232e1065'/%3E%3Cpolygon points='2,22 4,21 3,20' fill='%23ffffff'/%3E%3C/svg%3E") 2 22, crosshair`;

const LASER_CURSOR = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'%3E%3Ccircle cx='12' cy='12' r='9' stroke='%23ff0055' stroke-width='1.5' stroke-dasharray='2 3' opacity='0.7'/%3E%3Ccircle cx='12' cy='12' r='4' fill='%23ff0055'/%3E%3Ccircle cx='12' cy='12' r='1.5' fill='%23ffffff'/%3E%3C/svg%3E") 12 12, crosshair`;

const HIGHLIGHTER_CURSOR = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'%3E%3Cpath d='M9 11l-6 6v4h4l6-6' fill='%23eab308' stroke='%23ffffff' stroke-width='1.5'/%3E%3Cpath d='M14 4l6 6-9 9-6-6 9-9z' fill='%23facc15' stroke='%23ffffff' stroke-width='1.5'/%3E%3Cpolygon points='3,21 5,19 7,21' fill='%23713f12'/%3E%3C/svg%3E") 3 21, crosshair`;

const ERASER_CURSOR = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'%3E%3Ccircle cx='12' cy='12' r='8' fill='rgba(244,63,94,0.25)' stroke='%23f43f5e' stroke-width='1.5'/%3E%3Ccircle cx='12' cy='12' r='1.5' fill='%23f43f5e'/%3E%3C/svg%3E") 12 12, crosshair`;

interface UseCanvasDrawingProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  elements: CanvasElement[];
  setElements: React.Dispatch<React.SetStateAction<CanvasElement[]>>;
  pushHistory: (elements: CanvasElement[]) => void;
  activeTool: ToolType;
  setActiveTool: (tool: ToolType) => void;
  strokeColor: string;
  fillColor: string;
  strokeWidth: number;
  strokeStyle: "solid" | "dashed" | "dotted";
  roughness: number;
  edges: "round" | "sharp";
  arrowhead: "sharp" | "sketchy" | "dot" | "bar";
  arrowType: "straight" | "curved";
  opacity: number;
  fontFamily: FontFamily;
  setFontFamily: (f: FontFamily) => void;
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  panOffset: Point;
  setPanOffset: React.Dispatch<React.SetStateAction<Point>>;
  isSpacePressed: boolean;
  selectedIds: string[];
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
  inlineText: InlineTextState | null;
  setInlineText: React.Dispatch<React.SetStateAction<InlineTextState | null>>;
  commitInlineText: () => void;
  drawToShape: boolean;
  showGrid: boolean;
  theme: "light" | "dark";
  canvasBgColor: string;
  isPersonal: boolean;
  roomSlug?: string;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export function useCanvasDrawing({
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
}: UseCanvasDrawingProps) {
  // Always keep elementsRef in sync synchronously on every render
  const elementsRef = useRef<CanvasElement[]>(elements);
  elementsRef.current = elements;

  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [startPanPoint, setStartPanPoint] = useState<Point>({ x: 0, y: 0 });

  const [isDraggingSelected, setIsDraggingSelected] = useState<boolean>(false);
  const [dragStartPoint, setDragStartPoint] = useState<Point>({ x: 0, y: 0 });
  const [dragInitialElements, setDragInitialElements] = useState<CanvasElement[]>([]);

  const [activeResizeHandle, setActiveResizeHandle] = useState<ResizeHandle>(null);
  const [resizingElement, setResizingElement] = useState<{
    id: string;
    handle: ResizeHandle;
    initialElement: CanvasElement;
    startPoint: Point;
  } | null>(null);
  const [rotatingElement, setRotatingElement] = useState<{
    id: string;
    initialAngle: number;
    center: Point;
    startMouseAngle: number;
  } | null>(null);

  const [currentElement, setCurrentElement] = useState<CanvasElement | null>(null);
  const currentElementRef = useRef<CanvasElement | null>(null);
  const isDrawingRef = useRef<boolean>(false);
  const drawFrameRef = useRef<number | null>(null);

  const laserTrailRef = useRef<{ x: number; y: number; time: number }[]>([]);
  const isDrawingLaserRef = useRef<boolean>(false);
  const laserAnimRef = useRef<number | null>(null);

  const [boxSelectStart, setBoxSelectStart] = useState<Point | null>(null);
  const [boxSelectCurrent, setBoxSelectCurrent] = useState<Point | null>(null);

  const [snapAnchorIndicator, setSnapAnchorIndicator] = useState<Point | null>(null);

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

  const redrawRef = useRef<() => void>(() => {});

  const requestDraw = useCallback(() => {
    if (drawFrameRef.current !== null) return;
    drawFrameRef.current = requestAnimationFrame(() => {
      drawFrameRef.current = null;
      if (redrawRef.current) redrawRef.current();
    });
  }, []);

  const startLaserLoop = useCallback(() => {
    if (laserAnimRef.current !== null) return;
    const loop = () => {
      const now = performance.now();
      laserTrailRef.current = laserTrailRef.current.filter((p) => now - p.time < 1200);
      if (redrawRef.current) redrawRef.current();
      if (laserTrailRef.current.length > 0 || isDrawingLaserRef.current) {
        laserAnimRef.current = requestAnimationFrame(loop);
      } else {
        laserAnimRef.current = null;
      }
    };
    laserAnimRef.current = requestAnimationFrame(loop);
  }, []);

  const runFadeAnimation = useCallback(() => {
    const now = performance.now();
    fadingElementsRef.current = fadingElementsRef.current.filter(
      (item) => now - item.startTime < item.duration
    );
    if (redrawRef.current) redrawRef.current();
    if (fadingElementsRef.current.length > 0) {
      animFrameIdRef.current = requestAnimationFrame(runFadeAnimation);
    } else {
      animFrameIdRef.current = null;
    }
  }, []);

  const triggerEraseElements = useCallback(
    (targetIds: string[]) => {
      if (targetIds.length === 0) return;
      const currentList = elementsRef.current;
      const toFade = currentList.filter((el) => targetIds.includes(el.id));
      const remaining = currentList.filter((el) => !targetIds.includes(el.id));
      const startTime = performance.now();
      const newFading = toFade.map((el) => ({ element: el, startTime, duration: 320 }));
      fadingElementsRef.current = [...fadingElementsRef.current, ...newFading];

      setElements(remaining);
      pushHistory(remaining);
      if (!isPersonal && roomSlug) {
        targetIds.forEach((id) => {
          wsManager.send({ type: "DELETE_ELEMENT", roomId: roomSlug, payload: { id } });
        });
        api.saveElements(roomSlug, remaining);
      } else {
        localStorage.setItem("excalidraw_solo_elements", JSON.stringify(remaining));
      }
      setSelectedIds((prev) => prev.filter((id) => !targetIds.includes(id)));
      if (animFrameIdRef.current === null) {
        animFrameIdRef.current = requestAnimationFrame(runFadeAnimation);
      }
    },
    [isPersonal, roomSlug, pushHistory, runFadeAnimation, setElements, setSelectedIds]
  );

  // Redraw Canvas Render Pipeline (High-DPI Retina Ready)
  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.scale(zoom, zoom);
    ctx.translate(panOffset.x, panOffset.y);

    const rect = canvas.getBoundingClientRect();
    const viewW = rect.width / zoom;
    const viewH = rect.height / zoom;

    // Architectural Grid (Line Mesh + Intersection Dots)
    if (showGrid) {
      const gridSize = 24;
      const startX = -panOffset.x - ((-panOffset.x) % gridSize);
      const startY = -panOffset.y - ((-panOffset.y) % gridSize);

      const isLightBg = isHexLight(canvasBgColor);
      const crossColor = isLightBg ? "rgba(0, 0, 0, 0.05)" : "rgba(255, 255, 255, 0.05)";
      const dotColor = isLightBg ? "rgba(0, 0, 0, 0.18)" : "rgba(255, 255, 255, 0.22)";

      ctx.strokeStyle = crossColor;
      ctx.lineWidth = 1 / zoom;
      ctx.beginPath();
      for (let x = startX; x < startX + viewW + gridSize; x += gridSize) {
        ctx.moveTo(x, -panOffset.y);
        ctx.lineTo(x, -panOffset.y + viewH);
      }
      for (let y = startY; y < startY + viewH + gridSize; y += gridSize) {
        ctx.moveTo(-panOffset.x, y);
        ctx.lineTo(-panOffset.x + viewW, y);
      }
      ctx.stroke();

      ctx.fillStyle = dotColor;
      for (let x = startX; x < startX + viewW + gridSize; x += gridSize) {
        for (let y = startY; y < startY + viewH + gridSize; y += gridSize) {
          ctx.fillRect(x - 0.75 / zoom, y - 0.75 / zoom, 1.5 / zoom, 1.5 / zoom);
        }
      }
    }

    // 1. Committed Elements (with View Frustum Culling for 120 FPS performance)
    const viewBounds = {
      minX: -panOffset.x,
      minY: -panOffset.y,
      maxX: -panOffset.x + viewW,
      maxY: -panOffset.y + viewH,
    };

    elementsRef.current.forEach((el) => {
      if (inlineText && inlineText.id === el.id) return;
      if (!isElementInViewport(el, viewBounds)) return;
      const isBeingErased = erasedIds.has(el.id);
      const isSelected = selectedIds.includes(el.id);
      drawRoughElement(ctx, el, isSelected, isBeingErased ? 0.22 : 1);
    });

    // 2. Fading Elements
    const now = performance.now();
    fadingElementsRef.current.forEach((item) => {
      const progress = Math.min(1, Math.max(0, (now - item.startTime) / item.duration));
      const fadeAlpha = 1 - progress;
      if (fadeAlpha > 0.01) {
        drawRoughElement(ctx, item.element, false, fadeAlpha);
      }
    });

    // 3. Drafting Element
    const drafting = currentElementRef.current || currentElement;
    if (drafting) {
      drawRoughElement(ctx, drafting, false);
    }

    // 4. Laser Pointer Glow Pass (Fluid Continuous Spline)
    const trail = laserTrailRef.current;
    if (trail.length > 0) {
      const nowTime = performance.now();
      ctx.save();
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      if (trail.length === 1) {
        const p = trail[0];
        const alpha = Math.max(0, 1 - (nowTime - p.time) / 1200);
        if (alpha > 0.01) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 4.5, 0, Math.PI * 2);
          ctx.fillStyle = "#ffffff";
          ctx.shadowColor = "#ff0055";
          ctx.shadowBlur = 18;
          ctx.fill();
        }
      } else {
        for (let i = 1; i < trail.length; i++) {
          const p0 = trail[i - 1];
          const p1 = trail[i];
          const alpha = Math.max(0, 1 - (nowTime - p1.time) / 1200);
          if (alpha <= 0.01) continue;

          const pPrev = i > 1 ? trail[i - 2] : p0;
          const xc1 = (pPrev.x + p0.x) / 2;
          const yc1 = (pPrev.y + p0.y) / 2;
          const xc2 = (p0.x + p1.x) / 2;
          const yc2 = (p0.y + p1.y) / 2;

          // 1. Wide Neon Halo Pass
          ctx.beginPath();
          ctx.moveTo(xc1, yc1);
          ctx.quadraticCurveTo(p0.x, p0.y, xc2, yc2);
          ctx.strokeStyle = `rgba(255, 0, 85, ${alpha * 0.45})`;
          ctx.lineWidth = Math.max(4, 12 * alpha);
          ctx.shadowColor = "#ff0055";
          ctx.shadowBlur = 18 * alpha;
          ctx.stroke();

          // 2. Mid Glow Ribbon Pass
          ctx.beginPath();
          ctx.moveTo(xc1, yc1);
          ctx.quadraticCurveTo(p0.x, p0.y, xc2, yc2);
          ctx.strokeStyle = `rgba(255, 38, 95, ${alpha * 0.85})`;
          ctx.lineWidth = Math.max(2.5, 6 * alpha);
          ctx.shadowColor = "#ff0055";
          ctx.shadowBlur = 8 * alpha;
          ctx.stroke();

          // 3. Inner White-Hot Core Pass
          ctx.beginPath();
          ctx.moveTo(xc1, yc1);
          ctx.quadraticCurveTo(p0.x, p0.y, xc2, yc2);
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.95})`;
          ctx.lineWidth = Math.max(1, 2.5 * alpha);
          ctx.shadowBlur = 0;
          ctx.stroke();
        }

        // 4. Bright Leading Tip Flare
        const head = trail[trail.length - 1];
        if (isDrawingLaserRef.current && head) {
          ctx.beginPath();
          ctx.arc(head.x, head.y, 4, 0, Math.PI * 2);
          ctx.fillStyle = "#ffffff";
          ctx.shadowColor = "#ff0055";
          ctx.shadowBlur = 20;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(head.x, head.y, 8, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255, 0, 85, 0.4)";
          ctx.fill();
        }
      }
      ctx.restore();
    }

    // 5. Marquee Box Selection
    if (boxSelectStart && boxSelectCurrent) {
      const minX = Math.min(boxSelectStart.x, boxSelectCurrent.x);
      const maxX = Math.max(boxSelectStart.x, boxSelectCurrent.x);
      const minY = Math.min(boxSelectStart.y, boxSelectCurrent.y);
      const maxY = Math.max(boxSelectStart.y, boxSelectCurrent.y);

      ctx.save();
      const isLightBg = isHexLight(canvasBgColor);
      ctx.fillStyle = isLightBg ? "rgba(139, 92, 246, 0.12)" : "rgba(139, 92, 246, 0.18)";
      ctx.strokeStyle = isLightBg ? "#7c3aed" : "#a78bfa";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 4]);
      ctx.fillRect(minX, minY, maxX - minX, maxY - minY);
      ctx.strokeRect(minX, minY, maxX - minX, maxY - minY);
      ctx.restore();
    }

    // 6. Arrow Snap Indicator
    if (snapAnchorIndicator) {
      ctx.save();
      ctx.strokeStyle = "#8b5cf6";
      ctx.fillStyle = "rgba(139, 92, 246, 0.35)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(snapAnchorIndicator.x, snapAnchorIndicator.y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    // 7. Eraser Drag Trail
    if (isErasing && eraserTrail.length > 1) {
      ctx.save();
      const isLightBg = isHexLight(canvasBgColor);
      ctx.strokeStyle = isLightBg ? "rgba(220, 38, 38, 0.25)" : "rgba(244, 114, 182, 0.35)";
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

    // 8. Eraser Ring
    if (activeTool === "eraser" && eraserCursorPos) {
      ctx.save();
      const isLightBg = isHexLight(canvasBgColor);
      ctx.strokeStyle = isLightBg ? "rgba(196, 90, 44, 0.75)" : "rgba(244, 114, 182, 0.85)";
      ctx.lineWidth = 1.5;
      ctx.fillStyle = isLightBg ? "rgba(196, 90, 44, 0.1)" : "rgba(244, 114, 182, 0.15)";
      ctx.beginPath();
      ctx.arc(eraserCursorPos.x, eraserCursorPos.y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    ctx.restore();
  }, [
    panOffset,
    zoom,
    showGrid,
    canvasBgColor,
    selectedIds,
    inlineText,
    erasedIds,
    isErasing,
    eraserTrail,
    activeTool,
    eraserCursorPos,
    boxSelectStart,
    boxSelectCurrent,
    snapAnchorIndicator,
    currentElement,
    canvasRef,
  ]);

  // Keep redrawRef in sync so callbacks never call stale renders
  useEffect(() => {
    redrawRef.current = redraw;
    redraw();
  }, [redraw, elements]);

  // Window Resize (High-DPI Retina Support)
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const dpr = window.devicePixelRatio || 1;
        const w = window.innerWidth;
        const h = window.innerHeight;
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
        redraw();
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [redraw, canvasRef]);

  // Trackpad Gesture: Pinch-to-Zoom & Two-Finger Pan
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      if (e.ctrlKey || e.metaKey) {
        // Pinch-to-zoom (Trackpad pinch or Ctrl + Mouse Wheel)
        const zoomFactor = Math.exp(-e.deltaY * 0.008);
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        setZoom((prevZoom) => {
          const newZoom = Math.min(3.5, Math.max(0.15, prevZoom * zoomFactor));
          // Anchor zoom at current mouse pointer position
          setPanOffset((prevPan) => ({
            x: prevPan.x + mouseX / newZoom - mouseX / prevZoom,
            y: prevPan.y + mouseY / newZoom - mouseY / prevZoom,
          }));
          return newZoom;
        });
      } else {
        // Two-finger trackpad scroll / canvas pan
        setPanOffset((prevPan) => ({
          x: prevPan.x - e.deltaX / zoom,
          y: prevPan.y - e.deltaY / zoom,
        }));
      }
    };

    canvas.addEventListener("wheel", handleWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", handleWheel);
  }, [canvasRef, zoom, setZoom, setPanOffset]);

  // Multi-Touch Pinch-to-Zoom & Pan for Touchscreens / Tablets
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let initialPinchDist = 0;
    let initialZoom = zoom;
    let initialPan = panOffset;
    let initialMidpoint: Point = { x: 0, y: 0 };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        initialPinchDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
        initialZoom = zoom;
        initialPan = panOffset;
        initialMidpoint = {
          x: (t1.clientX + t2.clientX) / 2,
          y: (t1.clientY + t2.clientY) / 2,
        };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const currentDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
        const currentMid = {
          x: (t1.clientX + t2.clientX) / 2,
          y: (t1.clientY + t2.clientY) / 2,
        };

        if (initialPinchDist > 0) {
          const scaleRatio = currentDist / initialPinchDist;
          const newZoom = Math.min(3.5, Math.max(0.15, initialZoom * scaleRatio));

          const rect = canvas.getBoundingClientRect();
          const midX = initialMidpoint.x - rect.left;
          const midY = initialMidpoint.y - rect.top;

          const dx = (currentMid.x - initialMidpoint.x) / newZoom;
          const dy = (currentMid.y - initialMidpoint.y) / newZoom;

          setZoom(newZoom);
          setPanOffset({
            x: initialPan.x + midX / newZoom - midX / initialZoom + dx,
            y: initialPan.y + midY / newZoom - midY / initialZoom + dy,
          });
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) {
        initialPinchDist = 0;
      }
    };

    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
    };
  }, [canvasRef, zoom, panOffset, setZoom, setPanOffset]);

  const getCanvasPoint = (e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: (e.clientX - rect.left) / zoom - panOffset.x,
      y: (e.clientY - rect.top) / zoom - panOffset.y,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (inlineText) commitInlineText();
    const clickPoint = getCanvasPoint(e);

    // Panning
    if (e.button === 1 || isSpacePressed || activeTool === "hand") {
      setIsPanning(true);
      setStartPanPoint({ x: e.clientX / zoom - panOffset.x, y: e.clientY / zoom - panOffset.y });
      return;
    }

    // Text Tool
    if (activeTool === "text") {
      setInlineText({
        id: `txt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        x: clickPoint.x,
        y: clickPoint.y,
        text: "",
        isNew: true,
      });
      return;
    }

    // Laser Tool
    if (activeTool === "laser") {
      isDrawingLaserRef.current = true;
      laserTrailRef.current.push({ x: clickPoint.x, y: clickPoint.y, time: performance.now() });
      startLaserLoop();
      return;
    }

    // Image Tool
    if (activeTool === "image") {
      fileInputRef.current?.click();
      return;
    }

    // Eraser Tool
    if (activeTool === "eraser") {
      setIsErasing(true);
      setEraserTrail([clickPoint]);
      const hit = elementsRef.current.filter((el) => isElementHitByEraser(clickPoint, el, 16));
      if (hit.length > 0) {
        setErasedIds(new Set(hit.map((el) => el.id)));
      }
      return;
    }

    // Select Tool -> Corner Resizing, Rotation, Moving, or Marquee Box Selection
    if (activeTool === "select") {
      if (selectedIds.length === 1) {
        const selectedEl = elementsRef.current.find((el) => el.id === selectedIds[0]);
        if (selectedEl) {
          const handle = getResizeHandleAtPosition(clickPoint, selectedEl);
          if (handle === "rot") {
            const center = getElementCenter(selectedEl);
            const mouseAngle = Math.atan2(clickPoint.y - center.y, clickPoint.x - center.x);
            setRotatingElement({
              id: selectedEl.id,
              initialAngle: selectedEl.angle || 0,
              center,
              startMouseAngle: mouseAngle,
            });
            return;
          } else if (handle) {
            setResizingElement({
              id: selectedEl.id,
              handle,
              initialElement: { ...selectedEl },
              startPoint: clickPoint,
            });
            return;
          }
        }
      }

      const clickedEl = [...elementsRef.current].reverse().find((el) => isPointInsideElement(clickPoint, el));
      if (clickedEl) {
        if (!selectedIds.includes(clickedEl.id)) {
          setSelectedIds([clickedEl.id]);
        }
        if (clickedEl.type === "text" && clickedEl.fontFamily) {
          setFontFamily(clickedEl.fontFamily);
        }
        setIsDraggingSelected(true);
        setDragStartPoint(clickPoint);
        setDragInitialElements([...elementsRef.current]);
      } else {
        setSelectedIds([]);
        setBoxSelectStart(clickPoint);
        setBoxSelectCurrent(clickPoint);
      }
      return;
    }

    // Drawing Shapes
    isDrawingRef.current = true;
    const newEl: CanvasElement = {
      id: `el_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type: activeTool,
      x: clickPoint.x,
      y: clickPoint.y,
      width: 0,
      height: 0,
      points: activeTool === "pencil" || activeTool === "highlighter" ? [{ x: clickPoint.x, y: clickPoint.y }] : undefined,
      strokeColor,
      fillColor,
      strokeWidth,
      strokeStyle,
      roughness,
      edges,
      arrowhead,
      arrowType,
      opacity,
      createdAt: Date.now(),
    };
    currentElementRef.current = newEl;
    setCurrentElement(newEl);
    requestDraw();
  };

  const handleDoubleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const clickPoint = getCanvasPoint(e);
    const clickedEl = [...elementsRef.current].reverse().find((el) => isPointInsideElement(clickPoint, el));

    if (clickedEl && clickedEl.type === "text") {
      if (clickedEl.fontFamily) {
        setFontFamily(clickedEl.fontFamily);
      }
      setInlineText({
        id: clickedEl.id,
        x: clickedEl.x,
        y: clickedEl.y,
        text: clickedEl.text || "",
        isNew: false,
      });
    } else if (!clickedEl && (activeTool === "select" || activeTool === "text")) {
      setInlineText({
        id: `txt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        x: clickPoint.x,
        y: clickPoint.y,
        text: "",
        isNew: true,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPanning) {
      setPanOffset({
        x: e.clientX / zoom - startPanPoint.x,
        y: e.clientY / zoom - startPanPoint.y,
      });
      return;
    }

    const currentPoint = getCanvasPoint(e);

    // 0. Rotating Element
    if (rotatingElement) {
      const { id, initialAngle, center, startMouseAngle } = rotatingElement;
      const currentMouseAngle = Math.atan2(currentPoint.y - center.y, currentPoint.x - center.x);
      let angleDiff = currentMouseAngle - startMouseAngle;
      let newAngle = initialAngle + angleDiff;

      if (e.shiftKey) {
        const step = Math.PI / 12;
        newAngle = Math.round(newAngle / step) * step;
      }

      const updated = elementsRef.current.map((el) => {
        if (el.id !== id) return el;
        return { ...el, angle: newAngle };
      });

      const boundPropagated = updateBoundArrows(updated);
      setElements(boundPropagated);
      requestDraw();
      return;
    }

    // Laser Tool
    if (activeTool === "laser") {
      if (isDrawingLaserRef.current) {
        laserTrailRef.current.push({ x: currentPoint.x, y: currentPoint.y, time: performance.now() });
        startLaserLoop();
      }
      return;
    }

    // Eraser Tool
    if (activeTool === "eraser") {
      setEraserCursorPos(currentPoint);
      if (isErasing) {
        setEraserTrail((prev) => [...prev, currentPoint]);
        setErasedIds((prev) => {
          let hasNew = false;
          const next = new Set(prev);
          elementsRef.current.forEach((el) => {
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

    // Marquee Box Selection
    if (boxSelectStart) {
      setBoxSelectCurrent(currentPoint);
      const minX = Math.min(boxSelectStart.x, currentPoint.x);
      const maxX = Math.max(boxSelectStart.x, currentPoint.x);
      const minY = Math.min(boxSelectStart.y, currentPoint.y);
      const maxY = Math.max(boxSelectStart.y, currentPoint.y);
      const box = { minX, minY, maxX, maxY };

      const inBox = elementsRef.current.filter((el) => isElementInsideBox(el, box)).map((el) => el.id);
      setSelectedIds(inBox);
      return;
    }

    // Handle Resize/Rot Cursor on Hover
    if (activeTool === "select" && selectedIds.length === 1 && !resizingElement && !isDraggingSelected) {
      const selectedEl = elementsRef.current.find((el) => el.id === selectedIds[0]);
      if (selectedEl) {
        const handle = getResizeHandleAtPosition(currentPoint, selectedEl);
        setActiveResizeHandle(handle);
      } else {
        setActiveResizeHandle(null);
      }
    }

    // 1. Resizing Element
    if (resizingElement) {
      const { initialElement, handle, startPoint } = resizingElement;
      const dx = currentPoint.x - startPoint.x;
      const dy = currentPoint.y - startPoint.y;

      const updated = elementsRef.current.map((el) => {
        if (el.id !== resizingElement.id) return el;
        if (el.type === "text") {
          const scale = 1 + (dx + dy) / 150;
          return {
            ...initialElement,
            strokeWidth: Math.max(1.5, Math.min(8, (initialElement.strokeWidth || 2) * scale)),
          };
        }

        let newX = initialElement.x;
        let newY = initialElement.y;
        let newWidth = initialElement.width || 0;
        let newHeight = initialElement.height || 0;

        if (handle === "se") {
          newWidth = (initialElement.width || 0) + dx;
          newHeight = (initialElement.height || 0) + dy;
        } else if (handle === "ne") {
          newWidth = (initialElement.width || 0) + dx;
          newY = initialElement.y + dy;
          newHeight = (initialElement.height || 0) - dy;
        } else if (handle === "sw") {
          newX = initialElement.x + dx;
          newWidth = (initialElement.width || 0) - dx;
          newHeight = (initialElement.height || 0) + dy;
        } else if (handle === "nw") {
          newX = initialElement.x + dx;
          newY = initialElement.y + dy;
          newWidth = (initialElement.width || 0) - dx;
          newHeight = (initialElement.height || 0) - dy;
        }

        return { ...el, x: newX, y: newY, width: newWidth, height: newHeight };
      });

      const boundPropagated = updateBoundArrows(updated);
      setElements(boundPropagated);
      return;
    }

    // 2. Dragging Selected Elements
    if (isDraggingSelected && selectedIds.length > 0) {
      const dx = currentPoint.x - dragStartPoint.x;
      const dy = currentPoint.y - dragStartPoint.y;

      const updated = elementsRef.current.map((el) => {
        if (!selectedIds.includes(el.id)) return el;
        const initial = dragInitialElements.find((init) => init.id === el.id) || el;
        if ((initial.type === "pencil" || initial.type === "highlighter") && initial.points) {
          return {
            ...initial,
            points: initial.points.map((p) => ({ x: p.x + dx, y: p.y + dy })),
          };
        }
        return { ...initial, x: initial.x + dx, y: initial.y + dy };
      });

      const boundPropagated = updateBoundArrows(updated);
      setElements(boundPropagated);
      return;
    }

    // 3. Drafting Shapes / Freehand
    if (!isDrawingRef.current || !currentElementRef.current) return;
    const cur = currentElementRef.current;

    if (cur.type === "pencil" || cur.type === "highlighter") {
      const existingPts = cur.points || [];
      const lastPt = existingPts[existingPts.length - 1];
      let ptToAdd = currentPoint;

      if (e.shiftKey && existingPts.length > 0) {
        const firstPt = existingPts[0];
        const dx = Math.abs(currentPoint.x - firstPt.x);
        const dy = Math.abs(currentPoint.y - firstPt.y);
        ptToAdd = dx > dy ? { x: currentPoint.x, y: firstPt.y } : { x: firstPt.x, y: currentPoint.y };
      }

      if (!lastPt || Math.hypot(ptToAdd.x - lastPt.x, ptToAdd.y - lastPt.y) >= 1.5) {
        cur.points = [...existingPts, ptToAdd];
        requestDraw();
      }
    } else if (cur.type === "arrow" || cur.type === "line") {
      const nearest = findNearestBindingShape(currentPoint, elementsRef.current, 32, cur.id);
      if (nearest) {
        setSnapAnchorIndicator(nearest.anchorPoint);
        cur.width = nearest.anchorPoint.x - cur.x;
        cur.height = nearest.anchorPoint.y - cur.y;
      } else {
        setSnapAnchorIndicator(null);
        cur.width = currentPoint.x - cur.x;
        cur.height = currentPoint.y - cur.y;
      }
      requestDraw();
    } else {
      cur.width = currentPoint.x - cur.x;
      cur.height = currentPoint.y - cur.y;
      requestDraw();
    }
  };

  const handleMouseUp = () => {
    if (activeTool === "laser" || isDrawingLaserRef.current) {
      isDrawingLaserRef.current = false;
      return;
    }

    if (isPanning) {
      setIsPanning(false);
      return;
    }

    if (boxSelectStart) {
      setBoxSelectStart(null);
      setBoxSelectCurrent(null);
      return;
    }

    if (activeTool === "eraser" || isErasing) {
      if (erasedIds.size > 0) {
        triggerEraseElements(Array.from(erasedIds));
      }
      setIsErasing(false);
      setEraserTrail([]);
      setErasedIds(new Set());
      return;
    }

    // Commit Rotation
    if (rotatingElement) {
      const rotated = elementsRef.current.find((el) => el.id === rotatingElement.id);
      if (rotated && !isPersonal && roomSlug) {
        wsManager.send({ type: "UPDATE_ELEMENT", roomId: roomSlug, payload: rotated });
      }
      pushHistory(elementsRef.current);
      if (!isPersonal && roomSlug) {
        api.saveElements(roomSlug, elementsRef.current);
      } else {
        localStorage.setItem("excalidraw_solo_elements", JSON.stringify(elementsRef.current));
      }
      setRotatingElement(null);
      return;
    }

    // Commit Resizing
    if (resizingElement) {
      const resized = elementsRef.current.find((el) => el.id === resizingElement.id);
      if (resized && !isPersonal && roomSlug) {
        wsManager.send({ type: "UPDATE_ELEMENT", roomId: roomSlug, payload: resized });
      }
      pushHistory(elementsRef.current);
      if (!isPersonal && roomSlug) {
        api.saveElements(roomSlug, elementsRef.current);
      } else {
        localStorage.setItem("excalidraw_solo_elements", JSON.stringify(elementsRef.current));
      }
      setResizingElement(null);
      return;
    }

    // Commit Drag Movement
    if (isDraggingSelected) {
      setIsDraggingSelected(false);
      if (!isPersonal && roomSlug) {
        elementsRef.current.forEach((el) => {
          wsManager.send({ type: "UPDATE_ELEMENT", roomId: roomSlug, payload: el });
        });
        api.saveElements(roomSlug, elementsRef.current);
      } else {
        localStorage.setItem("excalidraw_solo_elements", JSON.stringify(elementsRef.current));
      }
      pushHistory(elementsRef.current);
      return;
    }

    // Commit New Drawing
    if (isDrawingRef.current && currentElementRef.current) {
      let finalEl = { ...currentElementRef.current };
      isDrawingRef.current = false;
      currentElementRef.current = null;
      setCurrentElement(null);

      if (drawToShape && (finalEl.type === "pencil" || finalEl.type === "highlighter") && finalEl.points) {
        const magic = detectMagicShape(finalEl.points);
        if (magic) {
          finalEl = {
            ...finalEl,
            type: magic.type,
            x: magic.x,
            y: magic.y,
            width: magic.width,
            height: magic.height,
            points: undefined,
            isMagicShape: true,
          };
        }
      }

      if (finalEl.type === "arrow" || finalEl.type === "line") {
        const startSnap = findNearestBindingShape({ x: finalEl.x, y: finalEl.y }, elementsRef.current, 32, finalEl.id);
        const endSnap = findNearestBindingShape(
          { x: finalEl.x + (finalEl.width || 0), y: finalEl.y + (finalEl.height || 0) },
          elementsRef.current,
          32,
          finalEl.id
        );
        if (startSnap) finalEl.startBinding = { elementId: startSnap.element.id };
        if (endSnap) finalEl.endBinding = { elementId: endSnap.element.id };
      }

      setSnapAnchorIndicator(null);
      const updated = [...elementsRef.current, finalEl];
      setElements(updated);
      pushHistory(updated);
      setSelectedIds([finalEl.id]);

      if (!isPersonal && roomSlug) {
        wsManager.send({ type: "DRAW_ELEMENT", roomId: roomSlug, payload: finalEl });
        api.saveElements(roomSlug, updated);
      } else {
        localStorage.setItem("excalidraw_solo_elements", JSON.stringify(updated));
      }
    }
  };

  const getCursorStyle = () => {
    if (activeTool === "hand" || isSpacePressed) {
      return isPanning ? "grabbing" : "grab";
    }
    if (activeResizeHandle === "rot" || rotatingElement) {
      return "grab";
    }
    if (activeResizeHandle) {
      if (activeResizeHandle === "nw" || activeResizeHandle === "se") return "nwse-resize";
      if (activeResizeHandle === "ne" || activeResizeHandle === "sw") return "nesw-resize";
    }
    if (activeTool === "text") return "text";
    if (activeTool === "select") {
      return isDraggingSelected ? "grabbing" : "default";
    }
    if (activeTool === "pencil") return PENCIL_CURSOR;
    if (activeTool === "laser") return LASER_CURSOR;
    if (activeTool === "highlighter") return HIGHLIGHTER_CURSOR;
    if (activeTool === "eraser") return ERASER_CURSOR;
    return "crosshair";
  };

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleDoubleClick,
    getCursorStyle,
    requestDraw,
  };
}
