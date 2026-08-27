import { CanvasElement, Point } from "@/types";
import { getCanvasFontCss, ensureFontLoaded } from "@/lib/fonts";

// Deterministic seed generator for stable hand-drawn roughness
function createSeededRandom(seedStr: string) {
  let seed = 0;
  for (let i = 0; i < seedStr.length; i++) {
    seed = (seed << 5) - seed + seedStr.charCodeAt(i);
    seed |= 0;
  }
  return function () {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function getElementCenter(el: CanvasElement): Point {
  const bounds = getElementBounds(el);
  return {
    x: bounds.x + bounds.width / 2,
    y: bounds.y + bounds.height / 2,
  };
}

export function rotatePoint(p: Point, center: Point, angle: number): Point {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const dx = p.x - center.x;
  const dy = p.y - center.y;
  return {
    x: center.x + dx * cos - dy * sin,
    y: center.y + dx * sin + dy * cos,
  };
}

export function isElementInViewport(
  el: CanvasElement,
  viewBounds: { minX: number; minY: number; maxX: number; maxY: number }
): boolean {
  const bounds = getElementBounds(el);
  const padding = 50;
  return (
    bounds.x + bounds.width + padding >= viewBounds.minX &&
    bounds.x - padding <= viewBounds.maxX &&
    bounds.y + bounds.height + padding >= viewBounds.minY &&
    bounds.y - padding <= viewBounds.maxY
  );
}

/**
 * Calculates a guaranteed collision-free placement position on the canvas for newly generated AI elements.
 * Checks viewport center and searches adjacent or unoccupied slots to prevent colliding with existing sketches.
 */
export function findFreeCanvasPlacement(
  existingElements: CanvasElement[],
  boundingWidth: number = 550,
  boundingHeight: number = 350,
  preferredPoint: Point = { x: 150, y: 150 }
): Point {
  if (!existingElements || existingElements.length === 0) {
    return preferredPoint;
  }

  const padding = 45;
  const existingBounds = existingElements.map(getElementBounds);

  const collides = (x: number, y: number, w: number, h: number): boolean => {
    const r1Left = x - padding;
    const r1Right = x + w + padding;
    const r1Top = y - padding;
    const r1Bottom = y + h + padding;

    return existingBounds.some((b) => {
      const r2Left = b.x;
      const r2Right = b.x + b.width;
      const r2Top = b.y;
      const r2Bottom = b.y + b.height;

      return !(r1Right < r2Left || r1Left > r2Right || r1Bottom < r2Top || r1Top > r2Bottom);
    });
  };

  // 1. If preferred position is completely free, use it
  if (!collides(preferredPoint.x, preferredPoint.y, boundingWidth, boundingHeight)) {
    return preferredPoint;
  }

  // 2. Compute overall bounding box of existing elements
  const allMinX = Math.min(...existingBounds.map((b) => b.x));
  const allMaxX = Math.max(...existingBounds.map((b) => b.x + b.width));
  const allMinY = Math.min(...existingBounds.map((b) => b.y));
  const allMaxY = Math.max(...existingBounds.map((b) => b.y + b.height));

  // Option A: Clean column to the right of existing elements
  const candidateRight: Point = { x: allMaxX + 80, y: allMinY };
  if (!collides(candidateRight.x, candidateRight.y, boundingWidth, boundingHeight)) {
    return candidateRight;
  }

  // Option B: Clean row below existing elements
  const candidateBelow: Point = { x: allMinX, y: allMaxY + 80 };
  if (!collides(candidateBelow.x, candidateBelow.y, boundingWidth, boundingHeight)) {
    return candidateBelow;
  }

  // Option C: Search in outward radial steps from preferred point
  const step = 80;
  for (let ring = 1; ring <= 15; ring++) {
    const offsets = [
      { x: ring * step, y: 0 },
      { x: -ring * step, y: 0 },
      { x: 0, y: ring * step },
      { x: 0, y: -ring * step },
      { x: ring * step, y: ring * step },
      { x: -ring * step, y: ring * step },
      { x: ring * step, y: -ring * step },
      { x: -ring * step, y: -ring * step },
    ];

    for (const off of offsets) {
      const candX = preferredPoint.x + off.x;
      const candY = preferredPoint.y + off.y;
      if (!collides(candX, candY, boundingWidth, boundingHeight)) {
        return { x: candX, y: candY };
      }
    }
  }

  // Fallback offset
  return { x: allMaxX + 100, y: allMinY };
}

export function drawRoughElement(
  ctx: CanvasRenderingContext2D,
  el: CanvasElement,
  isSelected: boolean = false,
  opacityMultiplier: number = 1
) {
  ctx.save();

  // Angle / Rotation
  const angle = el.angle || 0;
  const center = getElementCenter(el);
  if (angle !== 0) {
    ctx.translate(center.x, center.y);
    ctx.rotate(angle);
    ctx.translate(-center.x, -center.y);
  }

  // Opacity
  const opacity = ((el.opacity ?? 100) / 100) * opacityMultiplier;
  ctx.globalAlpha = Math.max(0, Math.min(1, opacity));

  ctx.strokeStyle = el.strokeColor || "#27221e";
  ctx.fillStyle = el.fillColor || "transparent";
  ctx.lineWidth = el.strokeWidth || 2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // Stroke style
  if (el.strokeStyle === "dashed") {
    ctx.setLineDash([8, 6]);
  } else if (el.strokeStyle === "dotted") {
    ctx.setLineDash([3, 5]);
  } else {
    ctx.setLineDash([]);
  }

  const roughness = el.roughness ?? 1.4;
  const rng = createSeededRandom(el.id || "default");

  switch (el.type) {
    case "rectangle": {
      const w = el.width || 0;
      const h = el.height || 0;
      const isRound = el.edges !== "sharp";
      const radius = Math.min(16, Math.abs(w) / 4, Math.abs(h) / 4);

      const minX = Math.min(el.x, el.x + w);
      const minY = Math.min(el.y, el.y + h);
      const absW = Math.abs(w);
      const absH = Math.abs(h);

      if (absW <= 0 || absH <= 0) break;

      // Draw background fill
      if (el.fillColor && el.fillColor !== "transparent") {
        ctx.save();
        ctx.fillStyle = el.fillColor;
        if (isRound && radius > 0) {
          ctx.beginPath();
          ctx.roundRect(minX, minY, absW, absH, radius);
          ctx.fill();
        } else {
          ctx.fillRect(minX, minY, absW, absH);
        }
        ctx.restore();
      }

      // Draw Excalidraw double-sketched square / rectangle
      if (isRound && radius > 2) {
        drawExcalidrawRoundedRect(ctx, minX, minY, absW, absH, radius, roughness, rng);
      } else {
        drawDoubleSketchedSharpRect(ctx, minX, minY, absW, absH, roughness, rng);
      }
      break;
    }

    case "circle": {
      const rx = Math.abs(el.width || 0) / 2;
      const ry = Math.abs(el.height || 0) / 2;
      const cx = el.x + (el.width || 0) / 2;
      const cy = el.y + (el.height || 0) / 2;

      if (rx <= 0 || ry <= 0) break;

      if (el.fillColor && el.fillColor !== "transparent") {
        ctx.save();
        ctx.fillStyle = el.fillColor;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Authentic Excalidraw double-pass sketchy ellipse
      drawExcalidrawEllipse(ctx, cx, cy, rx, ry, roughness, rng);
      break;
    }

    case "line": {
      const x2 = el.x + (el.width || 0);
      const y2 = el.y + (el.height || 0);
      drawSketchyLine(ctx, el.x, el.y, x2, y2, roughness, false, rng);
      break;
    }

    case "arrow": {
      const x2 = el.x + (el.width || 0);
      const y2 = el.y + (el.height || 0);
      const arrowHeadStyle = el.arrowhead || "sketchy";
      const isCurved = el.arrowType === "curved";

      if (isCurved) {
        // Curved arrow with organic mid arch
        const midX = (el.x + x2) / 2 - (y2 - el.y) * 0.2;
        const midY = (el.y + y2) / 2 + (x2 - el.x) * 0.2;
        ctx.beginPath();
        ctx.moveTo(el.x, el.y);
        ctx.quadraticCurveTo(midX, midY, x2, y2);
        ctx.stroke();

        if (roughness > 0.4) {
          ctx.beginPath();
          ctx.moveTo(el.x + (rng() - 0.5) * 1.5, el.y + (rng() - 0.5) * 1.5);
          ctx.quadraticCurveTo(midX + (rng() - 0.5) * 2, midY + (rng() - 0.5) * 2, x2, y2);
          ctx.stroke();
        }

        const angle = Math.atan2(y2 - midY, x2 - midX);
        drawArrowHead(ctx, x2, y2, angle, arrowHeadStyle, roughness, rng);
      } else {
        // Direct sketchy arrow line
        drawSketchyLine(ctx, el.x, el.y, x2, y2, roughness, false, rng);
        const angle = Math.atan2(y2 - el.y, x2 - el.x);
        drawArrowHead(ctx, x2, y2, angle, arrowHeadStyle, roughness, rng);
      }
      break;
    }

    case "pencil": {
      if (!el.points || el.points.length === 0) break;
      ctx.save();
      ctx.strokeStyle = el.strokeColor || "#ffffff";
      ctx.lineWidth = el.strokeWidth || 2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      const pts = el.points;
      if (pts.length === 1) {
        ctx.beginPath();
        ctx.arc(pts[0].x, pts[0].y, Math.max(1, (el.strokeWidth || 2) / 2), 0, Math.PI * 2);
        ctx.fillStyle = el.strokeColor || "#ffffff";
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length - 1; i++) {
          const xc = (pts[i].x + pts[i + 1].x) / 2;
          const yc = (pts[i].y + pts[i + 1].y) / 2;
          ctx.quadraticCurveTo(pts[i].x, pts[i].y, xc, yc);
        }
        ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
        ctx.stroke();
      }
      ctx.restore();
      break;
    }

    case "highlighter": {
      if (!el.points || el.points.length === 0) break;
      ctx.save();
      ctx.globalAlpha = 0.35;
      ctx.strokeStyle = el.strokeColor || "#eab308";
      ctx.lineWidth = Math.max(18, (el.strokeWidth || 2.5) * 7);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      const pts = el.points;
      if (pts.length === 1) {
        ctx.beginPath();
        ctx.arc(pts[0].x, pts[0].y, ctx.lineWidth / 2, 0, Math.PI * 2);
        ctx.fillStyle = el.strokeColor || "#eab308";
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length - 1; i++) {
          const xc = (pts[i].x + pts[i + 1].x) / 2;
          const yc = (pts[i].y + pts[i + 1].y) / 2;
          ctx.quadraticCurveTo(pts[i].x, pts[i].y, xc, yc);
        }
        ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
        ctx.stroke();
      }
      ctx.restore();
      break;
    }

    case "text": {
      const fontSize = Math.max(18, (el.strokeWidth || 2) * 9);
      const fontId = el.fontFamily || "caveat";
      ensureFontLoaded(fontId);
      
      const fontCss = getCanvasFontCss(
        fontId,
        fontSize,
        el.fontWeight || "normal",
        el.fontStyle || "normal"
      );

      ctx.font = fontCss;
      ctx.fillStyle = el.strokeColor || "#27221e";
      ctx.textBaseline = "top";

      const lines = (el.text || "").split("\n");
      const lineHeight = fontSize * 1.35;
      lines.forEach((line, idx) => {
        const yPos = el.y + idx * lineHeight;

        if (line.startsWith("[ ] ")) {
          ctx.save();
          ctx.strokeStyle = el.strokeColor || "#27221e";
          ctx.lineWidth = 1.5;
          ctx.strokeRect(el.x, yPos + 3, fontSize * 0.65, fontSize * 0.65);
          ctx.fillText(line.substring(4), el.x + fontSize * 0.9, yPos);
          ctx.restore();
        } else if (line.startsWith("[x] ") || line.startsWith("[X] ")) {
          ctx.save();
          ctx.fillStyle = "#10b981";
          ctx.fillRect(el.x, yPos + 3, fontSize * 0.65, fontSize * 0.65);
          ctx.fillStyle = "#ffffff";
          ctx.font = `bold ${fontSize * 0.55}px sans-serif`;
          ctx.fillText("✓", el.x + 2, yPos + 2);
          ctx.font = fontCss;
          ctx.fillStyle = el.strokeColor || "#27221e";
          ctx.fillText(line.substring(4), el.x + fontSize * 0.9, yPos);
          ctx.restore();
        } else if (line.startsWith("• ") || line.startsWith("- ") || line.startsWith("* ")) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(el.x + fontSize * 0.22, yPos + fontSize * 0.45, fontSize * 0.15, 0, Math.PI * 2);
          ctx.fillStyle = el.strokeColor || "#27221e";
          ctx.fill();
          ctx.fillText(line.substring(2), el.x + fontSize * 0.6, yPos);
          ctx.restore();
        } else {
          ctx.fillText(line, el.x, yPos);
        }
      });
      break;
    }

    case "image": {
      const src = el.imageUrl || el.dataUrl;
      if (src) {
        let img = (globalThis as any).__excalidraw_img_cache?.get(src);
        if (!img) {
          if (!(globalThis as any).__excalidraw_img_cache) {
            (globalThis as any).__excalidraw_img_cache = new Map<string, HTMLImageElement>();
          }
          img = new Image();
          img.src = src;
          (globalThis as any).__excalidraw_img_cache.set(src, img);
        }

        const w = el.width || 200;
        const h = el.height || 150;
        const minX = Math.min(el.x, el.x + w);
        const minY = Math.min(el.y, el.y + h);
        const absW = Math.abs(w);
        const absH = Math.abs(h);

        if (img.complete && img.naturalWidth > 0) {
          ctx.save();
          // subtle rounded corners for image
          ctx.beginPath();
          ctx.roundRect(minX, minY, absW, absH, 8);
          ctx.clip();
          ctx.drawImage(img, minX, minY, absW, absH);
          ctx.restore();
        } else {
          ctx.save();
          ctx.strokeStyle = "#8c7b6f";
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 4]);
          ctx.strokeRect(minX, minY, absW, absH);
          ctx.restore();
        }
      }
      break;
    }
  }

  // Draw selection bounding box and corner handles
  if (isSelected) {
    const bounds = getElementBounds(el);
    ctx.save();
    ctx.strokeStyle = "#8b5cf6";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(bounds.x - 6, bounds.y - 6, bounds.width + 12, bounds.height + 12);

    ctx.setLineDash([]);
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#8b5cf6";
    ctx.lineWidth = 1.5;

    // 4 Corner Handles
    const corners = [
      { x: bounds.x - 6, y: bounds.y - 6 },
      { x: bounds.x + bounds.width + 6, y: bounds.y - 6 },
      { x: bounds.x - 6, y: bounds.y + bounds.height + 6 },
      { x: bounds.x + bounds.width + 6, y: bounds.y + bounds.height + 6 },
    ];
    corners.forEach((c) => {
      ctx.fillRect(c.x - 4, c.y - 4, 8, 8);
      ctx.strokeRect(c.x - 4, c.y - 4, 8, 8);
    });

    // Top-Center Rotation Handle
    const topCenterX = bounds.x + bounds.width / 2;
    const topCenterY = bounds.y - 6;
    const rotY = bounds.y - 24;

    ctx.beginPath();
    ctx.moveTo(topCenterX, topCenterY);
    ctx.lineTo(topCenterX, rotY);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(topCenterX, rotY, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  ctx.restore();
}

function drawDoubleSketchedSharpRect(
  ctx: CanvasRenderingContext2D,
  minX: number,
  minY: number,
  absW: number,
  absH: number,
  roughness: number,
  rng: () => number
) {
  // 4 edges with double sketchy multi-stroke passes and corner overshoots
  drawSketchyLine(ctx, minX, minY, minX + absW, minY, roughness, true, rng);
  drawSketchyLine(ctx, minX + absW, minY, minX + absW, minY + absH, roughness, true, rng);
  drawSketchyLine(ctx, minX + absW, minY + absH, minX, minY + absH, roughness, true, rng);
  drawSketchyLine(ctx, minX, minY + absH, minX, minY, roughness, true, rng);

  if (roughness > 0.4) {
    const j = (rng() - 0.5) * 1.5 * roughness;
    drawSketchyLine(ctx, minX + j, minY - j, minX + absW - j, minY + j, roughness * 0.8, true, rng);
    drawSketchyLine(ctx, minX + absW + j, minY + j, minX + absW - j, minY + absH - j, roughness * 0.8, true, rng);
    drawSketchyLine(ctx, minX + absW - j, minY + absH + j, minX + j, minY + absH - j, roughness * 0.8, true, rng);
    drawSketchyLine(ctx, minX - j, minY + absH - j, minX + j, minY + j, roughness * 0.8, true, rng);
  }
}

function drawExcalidrawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  roughness: number,
  rng: () => number
) {
  // Pass 1: Primary rounded rectangle outline
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.stroke();

  // Pass 2: Secondary offset hand-drawn sketchy pass
  if (roughness > 0.3) {
    const j1 = (rng() - 0.5) * roughness * 1.8;
    const j2 = (rng() - 0.5) * roughness * 1.8;
    ctx.beginPath();
    ctx.moveTo(x + r + j1, y + j2);
    ctx.lineTo(x + w - r - j2, y + j1);
    ctx.quadraticCurveTo(x + w + j1, y - j2, x + w + j2, y + r + j1);
    ctx.lineTo(x + w - j1, y + h - r + j2);
    ctx.quadraticCurveTo(x + w - j2, y + h + j1, x + w - r - j1, y + h + j2);
    ctx.lineTo(x + r - j2, y + h - j1);
    ctx.quadraticCurveTo(x - j1, y + h - j2, x + j2, y + h - r - j1);
    ctx.lineTo(x - j2, y + r + j2);
    ctx.quadraticCurveTo(x + j1, y + j1, x + r + j2, y - j1);
    ctx.stroke();
  }
}

function drawExcalidrawEllipse(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  roughness: number,
  rng: () => number
) {
  // Pass 1: Main Ellipse
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Pass 2: Overlapping hand-drawn sketchy arc
  if (roughness > 0.3) {
    const jx = (rng() - 0.5) * roughness * 2.0;
    const jy = (rng() - 0.5) * roughness * 2.0;
    const rot = (rng() - 0.5) * 0.05 * roughness;
    ctx.beginPath();
    ctx.ellipse(cx + jx, cy + jy, rx * (0.985 + (rng() - 0.5) * 0.03), ry * (1.015 + (rng() - 0.5) * 0.03), rot, 0.1, Math.PI * 2 + 0.35);
    ctx.stroke();
  }
}

function drawArrowHead(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  style: "sharp" | "sketchy" | "dot" | "bar",
  roughness: number,
  rng: () => number
) {
  const headlen = 18;

  if (style === "dot") {
    ctx.save();
    ctx.fillStyle = ctx.strokeStyle;
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    return;
  }

  if (style === "bar") {
    const perpAngle = angle + Math.PI / 2;
    const barLen = 14;
    const x1 = x - barLen * Math.cos(perpAngle);
    const y1 = y - barLen * Math.sin(perpAngle);
    const x2 = x + barLen * Math.cos(perpAngle);
    const y2 = y + barLen * Math.sin(perpAngle);
    drawSketchyLine(ctx, x1, y1, x2, y2, roughness, false, rng);
    return;
  }

  const a1 = angle - Math.PI / 6;
  const a2 = angle + Math.PI / 6;

  if (style === "sharp") {
    // Sharp solid triangular arrowhead
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - headlen * Math.cos(a1), y - headlen * Math.sin(a1));
    ctx.lineTo(x - headlen * Math.cos(a2), y - headlen * Math.sin(a2));
    ctx.closePath();
    ctx.stroke();
  } else {
    // Sketchy curved double-pass arrowhead
    drawSketchyLine(ctx, x, y, x - headlen * Math.cos(a1), y - headlen * Math.sin(a1), roughness, false, rng);
    drawSketchyLine(ctx, x, y, x - headlen * Math.cos(a2), y - headlen * Math.sin(a2), roughness, false, rng);
  }
}

function drawSketchyLine(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  roughness: number,
  overshoot: boolean = false,
  rng: () => number = Math.random
) {
  const os = overshoot && roughness > 0 ? 4 : 0;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const ux = (dx / len) * os;
  const uy = (dy / len) * os;

  const sx = x1 - ux;
  const sy = y1 - uy;
  const ex = x2 + ux;
  const ey = y2 + uy;

  ctx.beginPath();
  ctx.moveTo(sx, sy);

  if (roughness === 0) {
    ctx.lineTo(ex, ey);
    ctx.stroke();
    return;
  }

  const midX1 = (sx + ex) / 2 + (rng() - 0.5) * roughness * 1.6;
  const midY1 = (sy + ey) / 2 + (rng() - 0.5) * roughness * 1.6;
  ctx.quadraticCurveTo(midX1, midY1, ex, ey);
  ctx.stroke();

  if (roughness > 0.5) {
    ctx.beginPath();
    ctx.moveTo(sx + (rng() - 0.5) * 1.4, sy + (rng() - 0.5) * 1.4);
    const midX2 = (sx + ex) / 2 + (rng() - 0.5) * roughness * 2.0;
    const midY2 = (sy + ey) / 2 + (rng() - 0.5) * roughness * 2.0;
    ctx.quadraticCurveTo(midX2, midY2, ex + (rng() - 0.5) * 1.4, ey + (rng() - 0.5) * 1.4);
    ctx.stroke();
  }
}

export function getElementBounds(el: CanvasElement): {
  x: number;
  y: number;
  width: number;
  height: number;
} {
  switch (el.type) {
    case "image":
    case "rectangle":
    case "circle": {
      const x = Math.min(el.x, el.x + (el.width || 0));
      const y = Math.min(el.y, el.y + (el.height || 0));
      const width = Math.abs(el.width || 0);
      const height = Math.abs(el.height || 0);
      return { x, y, width: Math.max(width, 10), height: Math.max(height, 10) };
    }
    case "line":
    case "arrow": {
      const x = Math.min(el.x, el.x + (el.width || 0));
      const y = Math.min(el.y, el.y + (el.height || 0));
      const width = Math.abs(el.width || 0);
      const height = Math.abs(el.height || 0);
      return { x, y, width: Math.max(width, 10), height: Math.max(height, 10) };
    }
    case "pencil":
    case "highlighter": {
      if (!el.points || el.points.length === 0) {
        return { x: el.x, y: el.y, width: 20, height: 20 };
      }
      const minX = Math.min(...el.points.map((p) => p.x));
      const maxX = Math.max(...el.points.map((p) => p.x));
      const minY = Math.min(...el.points.map((p) => p.y));
      const maxY = Math.max(...el.points.map((p) => p.y));
      return { x: minX, y: minY, width: Math.max(maxX - minX, 10), height: Math.max(maxY - minY, 10) };
    }
    case "text": {
      const lines = (el.text || "").split("\n");
      const fontSize = Math.max(18, (el.strokeWidth || 2) * 9);
      const approxCharWidth = fontSize * 0.55;
      const maxLineLen = Math.max(...lines.map((l) => l.length), 1);
      const width = maxLineLen * approxCharWidth;
      const height = lines.length * (fontSize * 1.25);
      return { x: el.x, y: el.y, width: Math.max(width, 24), height: Math.max(height, 24) };
    }
    default:
      return { x: el.x, y: el.y, width: 20, height: 20 };
  }
}

export function isPointInsideElement(point: Point, el: CanvasElement): boolean {
  const center = getElementCenter(el);
  const angle = el.angle || 0;
  const p = angle !== 0 ? rotatePoint(point, center, -angle) : point;

  const bounds = getElementBounds(el);
  const padding = 8;
  return (
    p.x >= bounds.x - padding &&
    p.x <= bounds.x + bounds.width + padding &&
    p.y >= bounds.y - padding &&
    p.y <= bounds.y + bounds.height + padding
  );
}

export type ResizeHandle = "nw" | "ne" | "sw" | "se" | "rot" | null;

export function getResizeHandleAtPosition(point: Point, el: CanvasElement): ResizeHandle {
  const center = getElementCenter(el);
  const angle = el.angle || 0;
  const p = angle !== 0 ? rotatePoint(point, center, -angle) : point;

  const bounds = getElementBounds(el);
  const handleRadius = 14;

  // 1. Check Rotation Handle (top-center)
  const topCenterX = bounds.x + bounds.width / 2;
  const rotY = bounds.y - 24;
  if (Math.hypot(p.x - topCenterX, p.y - rotY) <= handleRadius) {
    return "rot";
  }

  // 2. Check 4 Corner Resize Handles
  const corners: { handle: ResizeHandle; x: number; y: number }[] = [
    { handle: "nw", x: bounds.x - 6, y: bounds.y - 6 },
    { handle: "ne", x: bounds.x + bounds.width + 6, y: bounds.y - 6 },
    { handle: "sw", x: bounds.x - 6, y: bounds.y + bounds.height + 6 },
    { handle: "se", x: bounds.x + bounds.width + 6, y: bounds.y + bounds.height + 6 },
  ];

  for (const c of corners) {
    if (Math.hypot(p.x - c.x, p.y - c.y) <= handleRadius) {
      return c.handle;
    }
  }

  return null;
}

export function distanceToLineSegment(p: Point, a: Point, b: Point): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const l2 = dx * dx + dy * dy;
  if (l2 === 0) return Math.hypot(p.x - a.x, p.y - a.y);
  let t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / l2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
}

export function isElementHitByEraser(point: Point, el: CanvasElement, radius: number = 14): boolean {
  if (el.type === "pencil" || el.type === "highlighter") {
    if (!el.points || el.points.length === 0) {
      return Math.hypot(point.x - el.x, point.y - el.y) <= radius;
    }
    if (el.points.length === 1) {
      return Math.hypot(point.x - el.points[0].x, point.y - el.points[0].y) <= radius;
    }
    for (let i = 0; i < el.points.length - 1; i++) {
      if (distanceToLineSegment(point, el.points[i], el.points[i + 1]) <= radius) {
        return true;
      }
    }
    return false;
  }

  if (el.type === "line" || el.type === "arrow") {
    const start = { x: el.x, y: el.y };
    const end = { x: el.x + (el.width || 0), y: el.y + (el.height || 0) };
    return distanceToLineSegment(point, start, end) <= radius;
  }

  const bounds = getElementBounds(el);
  return (
    point.x >= bounds.x - radius &&
    point.x <= bounds.x + bounds.width + radius &&
    point.y >= bounds.y - radius &&
    point.y <= bounds.y + bounds.height + radius
  );
}

// 1. Draw to Shape (Magic Shape Recognition & Hold-to-Snap)
export function detectMagicShape(points: Point[]): {
  type: "rectangle" | "circle" | "line";
  x: number;
  y: number;
  width: number;
  height: number;
} | null {
  if (!points || points.length < 4) return null;

  const start = points[0];
  const end = points[points.length - 1];

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (const p of points) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }

  const w = maxX - minX;
  const h = maxY - minY;
  const diag = Math.hypot(w, h);

  if (diag < 12) return null;

  // Check 1: Straight Line / Highlighter Strip
  const startEndDist = Math.hypot(end.x - start.x, end.y - start.y);
  if (startEndDist > 18 && startEndDist > diag * 0.7) {
    let maxDev = 0;
    for (const p of points) {
      const dev = distanceToLineSegment(p, start, end);
      if (dev > maxDev) maxDev = dev;
    }
    if (maxDev < Math.max(16, startEndDist * 0.22)) {
      let finalEndX = end.x;
      let finalEndY = end.y;

      // Axis-alignment lock if within ~14 degrees of horizontal or vertical
      const angle = Math.abs(Math.atan2(end.y - start.y, end.x - start.x));
      if (angle < 0.25 || Math.abs(angle - Math.PI) < 0.25) {
        finalEndY = start.y;
      } else if (Math.abs(angle - Math.PI / 2) < 0.25) {
        finalEndX = start.x;
      }

      return {
        type: "line",
        x: start.x,
        y: start.y,
        width: finalEndX - start.x,
        height: finalEndY - start.y,
      };
    }
  }

  // Check 2: Closed Loop (Circle or Rectangle)
  const closureDist = Math.hypot(end.x - start.x, end.y - start.y);
  const isClosed = closureDist < Math.max(45, diag * 0.35);

  if (isClosed && w > 16 && h > 16) {
    const aspectRatio = w / h;
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    const avgRadius = (w + h) / 4;
    let radiusDevSum = 0;
    for (const p of points) {
      const r = Math.hypot(p.x - cx, p.y - cy);
      radiusDevSum += Math.abs(r - avgRadius);
    }
    const avgRadiusDev = radiusDevSum / points.length;

    if (aspectRatio >= 0.65 && aspectRatio <= 1.5 && avgRadiusDev < avgRadius * 0.28) {
      return {
        type: "circle",
        x: minX,
        y: minY,
        width: w,
        height: h,
      };
    }

    return {
      type: "rectangle",
      x: minX,
      y: minY,
      width: w,
      height: h,
    };
  }

  return null;
}

// 2. Smart Arrow / Line Snapping & Binding
export function getShapeAnchorPoint(shape: CanvasElement, targetPoint: Point): Point {
  const bounds = getElementBounds(shape);
  const cx = bounds.x + bounds.width / 2;
  const cy = bounds.y + bounds.height / 2;

  if (shape.type === "circle") {
    const rx = bounds.width / 2;
    const ry = bounds.height / 2;
    const theta = Math.atan2(targetPoint.y - cy, targetPoint.x - cx);
    return {
      x: cx + rx * Math.cos(theta),
      y: cy + ry * Math.sin(theta),
    };
  }

  // Rectangular bounding perimeter anchor
  const hw = bounds.width / 2;
  const hh = bounds.height / 2;
  const dx = targetPoint.x - cx;
  const dy = targetPoint.y - cy;

  if (dx === 0 && dy === 0) return { x: cx + hw, y: cy };

  const tanTheta = dy / (dx || 0.0001);
  const tanBox = hh / (hw || 0.0001);

  if (Math.abs(tanTheta) < tanBox) {
    const sign = dx > 0 ? 1 : -1;
    return {
      x: cx + sign * hw,
      y: cy + sign * hw * tanTheta,
    };
  } else {
    const sign = dy > 0 ? 1 : -1;
    return {
      x: cx + (sign * hh) / tanTheta,
      y: cy + sign * hh,
    };
  }
}

export function findNearestBindingShape(
  point: Point,
  elements: CanvasElement[],
  maxDistance = 28,
  ignoreId?: string
): { element: CanvasElement; anchorPoint: Point } | null {
  for (let i = elements.length - 1; i >= 0; i--) {
    const el = elements[i];
    if (el.id === ignoreId) continue;
    if (el.type === "line" || el.type === "arrow" || el.type === "pencil" || el.type === "highlighter") continue;

    const bounds = getElementBounds(el);
    // Check if near perimeter or inside
    if (
      point.x >= bounds.x - maxDistance &&
      point.x <= bounds.x + bounds.width + maxDistance &&
      point.y >= bounds.y - maxDistance &&
      point.y <= bounds.y + bounds.height + maxDistance
    ) {
      const anchorPoint = getShapeAnchorPoint(el, point);
      return { element: el, anchorPoint };
    }
  }
  return null;
}

export function updateBoundArrows(allElements: CanvasElement[]): CanvasElement[] {
  let changed = false;
  const next = allElements.map((el) => {
    if (el.type !== "arrow" && el.type !== "line") return el;
    if (!el.startBinding && !el.endBinding) return el;

    let newX = el.x;
    let newY = el.y;
    const currentEnd = { x: el.x + (el.width || 0), y: el.y + (el.height || 0) };

    const startShape = el.startBinding ? allElements.find((s) => s.id === el.startBinding?.elementId) : null;
    const endShape = el.endBinding ? allElements.find((s) => s.id === el.endBinding?.elementId) : null;

    let targetForStart = currentEnd;
    if (endShape) {
      targetForStart = getElementCenter(endShape);
    }

    if (startShape) {
      const anchor = getShapeAnchorPoint(startShape, targetForStart);
      newX = anchor.x;
      newY = anchor.y;
      changed = true;
    }

    const startPoint = { x: newX, y: newY };
    let newWidth = currentEnd.x - newX;
    let newHeight = currentEnd.y - newY;

    if (endShape) {
      const anchor = getShapeAnchorPoint(endShape, startPoint);
      newWidth = anchor.x - newX;
      newHeight = anchor.y - newY;
      changed = true;
    }

    return {
      ...el,
      x: newX,
      y: newY,
      width: newWidth,
      height: newHeight,
    };
  });

  return changed ? next : allElements;
}

// 3. Marquee Box Multi-Selection
export function isElementInsideBox(
  el: CanvasElement,
  box: { minX: number; minY: number; maxX: number; maxY: number }
): boolean {
  const bounds = getElementBounds(el);
  return (
    bounds.x < box.maxX &&
    bounds.x + bounds.width > box.minX &&
    bounds.y < box.maxY &&
    bounds.y + bounds.height > box.minY
  );
}

