import { CanvasElement, Point } from "@/types";

export interface MathSolution {
  expression: string;
  cleanEquation: string;
  result: string;
  isEquation: boolean;
  variableName?: string;
  explanation?: string;
  targetPosition: Point;
  sourceElementIds?: string[];
  boundingBox?: { x: number; y: number; width: number; height: number };
}

// Tokenizer and Safe Math Evaluator
function evaluateSafeArithmetic(expr: string): number | null {
  try {
    let clean = expr
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/x/gi, "*")
      .replace(/\^/g, "**")
      .replace(/pi/gi, String(Math.PI))
      .replace(/\be\b/gi, String(Math.E));

    // Handle percentage calculations: e.g. "20% of 500" or "20% * 500"
    const pctOfMatch = clean.match(/(\d+(?:\.\d+)?)\s*%\s*(?:of|\*)\s*(\d+(?:\.\d+)?)/i);
    if (pctOfMatch) {
      const pct = parseFloat(pctOfMatch[1]);
      const base = parseFloat(pctOfMatch[2]);
      return (pct / 100) * base;
    }

    // Handle standard functions: sqrt, sin, cos, tan, log, abs
    clean = clean.replace(/sqrt\(([^)]+)\)/gi, (_, val) => String(Math.sqrt(evaluateSafeArithmetic(val) || 0)));
    clean = clean.replace(/sin\(([^)]+)\)/gi, (_, val) => String(Math.sin((evaluateSafeArithmetic(val) || 0) * (Math.PI / 180))));
    clean = clean.replace(/cos\(([^)]+)\)/gi, (_, val) => String(Math.cos((evaluateSafeArithmetic(val) || 0) * (Math.PI / 180))));
    clean = clean.replace(/tan\(([^)]+)\)/gi, (_, val) => String(Math.tan((evaluateSafeArithmetic(val) || 0) * (Math.PI / 180))));
    clean = clean.replace(/log\(([^)]+)\)/gi, (_, val) => String(Math.log10(evaluateSafeArithmetic(val) || 0)));
    clean = clean.replace(/abs\(([^)]+)\)/gi, (_, val) => String(Math.abs(evaluateSafeArithmetic(val) || 0)));

    // Security check: only allow digits, operators, parentheses, decimal points, and spaces
    if (!/^[\d\s+\-*/().%*]+$/.test(clean)) {
      return null;
    }

    // Safe evaluation using Function with strictly controlled characters
    const func = new Function(`"use strict"; return (${clean});`);
    const res = func();
    if (typeof res === "number" && !isNaN(res) && isFinite(res)) {
      // Clean precision to avoid 0.0000000000004 floating point artifacts
      return Math.round(res * 1000000) / 1000000;
    }
    return null;
  } catch {
    return null;
  }
}

// Solve simple linear equation: e.g. "2x + 4 = 12" -> "x = 4"
function solveLinearEquation(eq: string): { variable: string; value: number } | null {
  try {
    const parts = eq.split("=");
    if (parts.length !== 2) return null;

    const left = parts[0].trim();
    const right = parts[1].trim();

    // Match patterns like "2x + 4" or "x - 5" on left and a number on right
    const varMatch = left.match(/([a-zA-Z])/);
    if (!varMatch) return null;
    const varName = varMatch[1];

    const rightNum = evaluateSafeArithmetic(right);
    if (rightNum === null) return null;

    // Numerical solver for single variable linear equations f(x) - rightNum = 0
    const f = (xVal: number) => {
      const substituted = left.replace(new RegExp(`([0-9.]*)${varName}`, "g"), (_, coeff) => {
        const c = coeff === "" ? 1 : coeff === "-" ? -1 : parseFloat(coeff);
        return String(c * xVal);
      });
      return evaluateSafeArithmetic(substituted);
    };

    const y0 = f(0);
    const y1 = f(1);
    if (y0 === null || y1 === null || y1 === y0) return null;

    // Linear slope: y = m*x + b => x = (rightNum - b) / m
    const m = y1 - y0;
    const b = y0;
    const solution = (rightNum - b) / m;

    if (!isNaN(solution) && isFinite(solution)) {
      return { variable: varName, value: Math.round(solution * 1000) / 1000 };
    }
    return null;
  } catch {
    return null;
  }
}

// Detect math in a text string and return solution
export function detectMathInText(
  text: string,
  elementPos: { x: number; y: number; width: number; height: number }
): MathSolution | null {
  if (!text || text.trim().length === 0) return null;

  const lines = text.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i].trim();
    if (!rawLine) continue;

    // Case 1: Linear algebraic equation: e.g. "2x + 6 = 14"
    if (rawLine.includes("=") && /[a-zA-Z]/.test(rawLine)) {
      const eqSol = solveLinearEquation(rawLine);
      if (eqSol) {
        return {
          expression: rawLine,
          cleanEquation: `${eqSol.variable} = ${eqSol.value}`,
          result: `${eqSol.variable} = ${eqSol.value}`,
          isEquation: true,
          variableName: eqSol.variable,
          boundingBox: elementPos,
          targetPosition: {
            x: elementPos.x + elementPos.width + 16,
            y: elementPos.y + i * 28,
          },
        };
      }
    }

    // Case 2: Arithmetic with trailing "=" e.g. "2 + 2 =" or "15 * 8 ="
    const trimmedEq = rawLine.replace(/=\s*$/, "").trim();
    const result = evaluateSafeArithmetic(trimmedEq);

    if (result !== null) {
      // Must contain at least one math operator or function to be a valid expression
      const hasMathSymbol = /[+\-*/×÷%^]|sqrt|sin|cos|tan|log|of/i.test(trimmedEq);
      if (hasMathSymbol) {
        const cleanExpr = trimmedEq.replace(/([+\-*/])/g, " $1 ").replace(/\s+/g, " ").trim();
        return {
          expression: rawLine,
          cleanEquation: `${cleanExpr} = ${result}`,
          result: `= ${result}`,
          isEquation: true,
          boundingBox: elementPos,
          targetPosition: {
            x: elementPos.x + elementPos.width + 16,
            y: elementPos.y + i * 28,
          },
        };
      }
    }
  }

  return null;
}

// Analyze stroke geometry to recognize handwritten digits and math operators
interface StrokeBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
}

function getStrokeBox(points: Point[]): StrokeBox {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const p of points) {
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  }
  const width = Math.max(1, maxX - minX);
  const height = Math.max(1, maxY - minY);
  return {
    minX,
    minY,
    maxX,
    maxY,
    width,
    height,
    centerX: (minX + maxX) / 2,
    centerY: (minY + maxY) / 2,
  };
}

function recognizeSingleStroke(points: Point[], box: StrokeBox): string | null {
  if (points.length < 3) {
    if (box.width < 10 && box.height < 10) return ".";
    return null;
  }

  const pStart = points[0];
  const pEnd = points[points.length - 1];
  const aspect = box.width / box.height;

  let pathLen = 0;
  for (let i = 1; i < points.length; i++) {
    pathLen += Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
  }

  // Horizontal bar: minus '-'
  if (aspect > 2.0 && Math.abs(pStart.y - pEnd.y) < box.height * 0.45) {
    return "-";
  }

  // Vertical line: '1'
  if (aspect < 0.38 && Math.abs(pStart.x - pEnd.x) < box.width * 0.45 && pEnd.y > pStart.y) {
    return "1";
  }

  // Slanted line: '/'
  if (aspect > 0.3 && aspect < 1.2 && pStart.x < pEnd.x && pStart.y > pEnd.y) {
    return "/";
  }

  // Closed loop: '0'
  const distStartEnd = Math.hypot(pStart.x - pEnd.x, pStart.y - pEnd.y);
  if (distStartEnd < box.width * 0.45 && pathLen > (box.width + box.height) * 1.4) {
    return "0";
  }

  // Two '2'
  if (pStart.y < box.centerY && pEnd.y > box.maxY - box.height * 0.35 && pEnd.x > box.minX + box.width * 0.4) {
    return "2";
  }

  // Three '3'
  if (pStart.y < box.centerY && pEnd.y > box.centerY && pEnd.x < box.maxX) {
    let midDips = false;
    for (let i = Math.floor(points.length * 0.25); i < Math.floor(points.length * 0.75); i++) {
      if (points[i].x < box.centerX && points[i].y > box.minY + box.height * 0.25 && points[i].y < box.minY + box.height * 0.75) {
        midDips = true;
        break;
      }
    }
    if (midDips) return "3";
  }

  // Seven '7'
  if (pStart.x < box.centerX && pStart.y < box.minY + box.height * 0.35 && pEnd.y > box.maxY - box.height * 0.35) {
    return "7";
  }

  // Multi-curve digit fallback
  if (pStart.y < box.centerY && pEnd.y > box.centerY) {
    return "2";
  }

  return null;
}

// Recognize multi-stroke clusters and handwritten math equations
export function detectMathInSketches(elements: CanvasElement[]): MathSolution | null {
  const pencilElements = elements.filter(
    (el) => el.type === "pencil" && el.points && el.points.length >= 2
  );

  if (pencilElements.length < 2) return null;

  const strokeData = pencilElements.map((el) => ({
    el,
    box: getStrokeBox(el.points!),
  })).sort((a, b) => a.box.minX - b.box.minX);

  const glyphs: { symbol: string; box: StrokeBox }[] = [];
  const used = new Set<number>();

  for (let i = 0; i < strokeData.length; i++) {
    if (used.has(i)) continue;

    const s1 = strokeData[i];
    let paired = false;

    for (let j = i + 1; j < strokeData.length; j++) {
      if (used.has(j)) continue;
      const s2 = strokeData[j];

      const xOverlap = Math.max(0, Math.min(s1.box.maxX, s2.box.maxX) - Math.max(s1.box.minX, s2.box.minX));
      const yDist = Math.abs(s1.box.centerY - s2.box.centerY);

      // Check for '=' (two horizontal parallel lines)
      const isS1Horiz = s1.box.width / s1.box.height > 1.4;
      const isS2Horiz = s2.box.width / s2.box.height > 1.4;
      if (isS1Horiz && isS2Horiz && (xOverlap > Math.min(s1.box.width, s2.box.width) * 0.3 || Math.abs(s1.box.centerX - s2.box.centerX) < 35) && yDist < 50) {
        used.add(i);
        used.add(j);
        paired = true;
        const combinedBox: StrokeBox = {
          minX: Math.min(s1.box.minX, s2.box.minX),
          minY: Math.min(s1.box.minY, s2.box.minY),
          maxX: Math.max(s1.box.maxX, s2.box.maxX),
          maxY: Math.max(s1.box.maxY, s2.box.maxY),
          width: Math.max(s1.box.maxX, s2.box.maxX) - Math.min(s1.box.minX, s2.box.minX),
          height: Math.max(s1.box.maxY, s2.box.maxY) - Math.min(s1.box.minY, s2.box.minY),
          centerX: (s1.box.centerX + s2.box.centerX) / 2,
          centerY: (s1.box.centerY + s2.box.centerY) / 2,
        };
        glyphs.push({ symbol: "=", box: combinedBox });
        break;
      }

      // Check for '+' (one horizontal and one vertical line intersecting)
      const isS1Vert = s1.box.height / s1.box.width > 1.3;
      const isS2Vert = s2.box.height / s2.box.width > 1.3;
      if (((isS1Horiz && isS2Vert) || (isS1Vert && isS2Horiz)) && Math.abs(s1.box.centerX - s2.box.centerX) < 35) {
        used.add(i);
        used.add(j);
        paired = true;
        const combinedBox: StrokeBox = {
          minX: Math.min(s1.box.minX, s2.box.minX),
          minY: Math.min(s1.box.minY, s2.box.minY),
          maxX: Math.max(s1.box.maxX, s2.box.maxX),
          maxY: Math.max(s1.box.maxY, s2.box.maxY),
          width: Math.max(s1.box.maxX, s2.box.maxX) - Math.min(s1.box.minX, s2.box.minX),
          height: Math.max(s1.box.maxY, s2.box.maxY) - Math.min(s1.box.minY, s2.box.minY),
          centerX: (s1.box.centerX + s2.box.centerX) / 2,
          centerY: (s1.box.centerY + s2.box.centerY) / 2,
        };
        glyphs.push({ symbol: "+", box: combinedBox });
        break;
      }
    }

    if (!paired) {
      used.add(i);
      const recognized = recognizeSingleStroke(s1.el.points!, s1.box);
      if (recognized) {
        glyphs.push({ symbol: recognized, box: s1.box });
      }
    }
  }

  if (glyphs.length < 2) return null;

  glyphs.sort((a, b) => a.box.minX - b.box.minX);
  const equationStr = glyphs.map((g) => g.symbol).join("");
  const lastGlyph = glyphs[glyphs.length - 1];

  const trimmed = equationStr.replace(/=\s*$/, "");
  const result = evaluateSafeArithmetic(trimmed);

  if (result !== null && /[+\-*/]/.test(trimmed)) {
    const minOverallX = Math.min(...glyphs.map((g) => g.box.minX));
    const minOverallY = Math.min(...glyphs.map((g) => g.box.minY));
    const maxOverallX = Math.max(...glyphs.map((g) => g.box.maxX));
    const maxOverallY = Math.max(...glyphs.map((g) => g.box.maxY));
    const sourceIds = pencilElements.map((e) => e.id);

    const cleanExpr = trimmed
      .replace(/([+\-*/])/g, " $1 ")
      .replace(/\s+/g, " ")
      .trim();

    return {
      expression: equationStr,
      cleanEquation: `${cleanExpr} = ${result}`,
      result: `= ${result}`,
      isEquation: true,
      sourceElementIds: sourceIds,
      boundingBox: {
        x: minOverallX,
        y: minOverallY,
        width: maxOverallX - minOverallX,
        height: maxOverallY - minOverallY,
      },
      targetPosition: {
        x: lastGlyph.box.maxX + 18,
        y: lastGlyph.box.centerY - 12,
      },
    };
  }

  return null;
}

export interface AiDiagramOptions {
  roughness?: number;
  palette?: "vibrant" | "neon" | "warm" | "emerald" | "mono";
  fontFamily?: string;
}

// Built-in AI Whiteboard Architecture, Wireframe & Flowchart Generator
export function generateAiDiagram(
  prompt: string,
  startPos: Point = { x: 120, y: 120 },
  options: AiDiagramOptions = {}
): CanvasElement[] {
  const p = prompt.toLowerCase().trim();
  const created: CanvasElement[] = [];
  const now = Date.now();
  const roughness = options.roughness ?? 1.2;
  const fontFamily = options.fontFamily || "caveat";

  const paletteMap = {
    vibrant: { primary: "#8b5cf6", secondary: "#3b82f6", accent: "#ec4899", success: "#10b981", warning: "#f59e0b" },
    neon: { primary: "#06b6d4", secondary: "#a855f7", accent: "#f43f5e", success: "#10b981", warning: "#eab308" },
    warm: { primary: "#f97316", secondary: "#ef4444", accent: "#e11d48", success: "#84cc16", warning: "#facc15" },
    emerald: { primary: "#10b981", secondary: "#14b8a6", accent: "#06b6d4", success: "#22c55e", warning: "#eab308" },
    mono: { primary: "#52525b", secondary: "#71717a", accent: "#3f3f46", success: "#27272a", warning: "#18181b" },
  };

  const colors = paletteMap[options.palette || "vibrant"] || paletteMap.vibrant;
  const makeId = () => `ai_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  // 1. KANBAN SPRINT BOARD
  if (p.includes("kanban") || p.includes("sprint") || p.includes("board") || p.includes("agile")) {
    const colNames = ["📌 To Do", "⚡ In Progress", "✅ Done"];
    const colColors = [colors.primary, colors.warning, colors.success];

    colNames.forEach((col, idx) => {
      const colX = startPos.x + idx * 220;
      const colBox: CanvasElement = {
        id: makeId(),
        type: "rectangle",
        x: colX,
        y: startPos.y,
        width: 190,
        height: 320,
        strokeColor: colColors[idx],
        fillColor: `${colColors[idx]}10`,
        strokeWidth: 2,
        roughness,
        edges: "round",
        createdAt: now,
      };
      const colHeader: CanvasElement = {
        id: makeId(),
        type: "text",
        x: colX + 16,
        y: startPos.y + 14,
        text: col,
        strokeColor: colColors[idx],
        fillColor: "transparent",
        strokeWidth: 2,
        roughness,
        fontFamily,
        fontWeight: "bold",
        createdAt: now,
      };

      // 2 Cards per column
      const card1: CanvasElement = {
        id: makeId(),
        type: "rectangle",
        x: colX + 12,
        y: startPos.y + 55,
        width: 166,
        height: 70,
        strokeColor: colColors[idx],
        fillColor: `${colColors[idx]}18`,
        strokeWidth: 1.5,
        roughness: roughness * 0.9,
        edges: "round",
        createdAt: now,
      };
      const card1Text: CanvasElement = {
        id: makeId(),
        type: "text",
        x: colX + 22,
        y: startPos.y + 70,
        text: idx === 0 ? "Auth API Refactor" : idx === 1 ? "WebSocket Sync" : "Canvas Retina DPI",
        strokeColor: colColors[idx],
        fillColor: "transparent",
        strokeWidth: 1.5,
        roughness,
        fontFamily,
        createdAt: now,
      };

      const card2: CanvasElement = {
        id: makeId(),
        type: "rectangle",
        x: colX + 12,
        y: startPos.y + 140,
        width: 166,
        height: 70,
        strokeColor: colColors[idx],
        fillColor: `${colColors[idx]}18`,
        strokeWidth: 1.5,
        roughness: roughness * 0.9,
        edges: "round",
        createdAt: now,
      };
      const card2Text: CanvasElement = {
        id: makeId(),
        type: "text",
        x: colX + 22,
        y: startPos.y + 155,
        text: idx === 0 ? "Setup Redis Cache" : idx === 1 ? "Dark Mode Palette" : "Prisma Migration",
        strokeColor: colColors[idx],
        fillColor: "transparent",
        strokeWidth: 1.5,
        roughness,
        fontFamily,
        createdAt: now,
      };

      created.push(colBox, colHeader, card1, card1Text, card2, card2Text);
    });
  }

  // 2. MOBILE APP UI WIREFRAME
  else if (p.includes("wireframe") || p.includes("mobile") || p.includes("ui") || p.includes("mockup")) {
    const phoneFrame: CanvasElement = {
      id: makeId(),
      type: "rectangle",
      x: startPos.x,
      y: startPos.y,
      width: 240,
      height: 420,
      strokeColor: colors.primary,
      fillColor: `${colors.primary}08`,
      strokeWidth: 2.5,
      roughness,
      edges: "round",
      createdAt: now,
    };
    const titleText: CanvasElement = {
      id: makeId(),
      type: "text",
      x: startPos.x + 35,
      y: startPos.y + 35,
      text: "📱 Mobile Sign In",
      strokeColor: colors.primary,
      fillColor: "transparent",
      strokeWidth: 2,
      roughness,
      fontFamily,
      fontWeight: "bold",
      createdAt: now,
    };
    const input1: CanvasElement = {
      id: makeId(),
      type: "rectangle",
      x: startPos.x + 20,
      y: startPos.y + 100,
      width: 200,
      height: 45,
      strokeColor: colors.secondary,
      fillColor: `${colors.secondary}12`,
      strokeWidth: 1.5,
      roughness,
      edges: "round",
      createdAt: now,
    };
    const input1Text: CanvasElement = {
      id: makeId(),
      type: "text",
      x: startPos.x + 35,
      y: startPos.y + 112,
      text: "user@example.com",
      strokeColor: colors.secondary,
      fillColor: "transparent",
      strokeWidth: 1.5,
      roughness,
      fontFamily,
      createdAt: now,
    };
    const input2: CanvasElement = {
      id: makeId(),
      type: "rectangle",
      x: startPos.x + 20,
      y: startPos.y + 160,
      width: 200,
      height: 45,
      strokeColor: colors.secondary,
      fillColor: `${colors.secondary}12`,
      strokeWidth: 1.5,
      roughness,
      edges: "round",
      createdAt: now,
    };
    const input2Text: CanvasElement = {
      id: makeId(),
      type: "text",
      x: startPos.x + 35,
      y: startPos.y + 172,
      text: "••••••••••••",
      strokeColor: colors.secondary,
      fillColor: "transparent",
      strokeWidth: 1.5,
      roughness,
      fontFamily,
      createdAt: now,
    };
    const ctaButton: CanvasElement = {
      id: makeId(),
      type: "rectangle",
      x: startPos.x + 20,
      y: startPos.y + 230,
      width: 200,
      height: 48,
      strokeColor: colors.accent,
      fillColor: `${colors.accent}30`,
      strokeWidth: 2,
      roughness,
      edges: "round",
      createdAt: now,
    };
    const ctaText: CanvasElement = {
      id: makeId(),
      type: "text",
      x: startPos.x + 70,
      y: startPos.y + 242,
      text: "Continue ➔",
      strokeColor: colors.accent,
      fillColor: "transparent",
      strokeWidth: 2,
      roughness,
      fontFamily,
      fontWeight: "bold",
      createdAt: now,
    };

    created.push(phoneFrame, titleText, input1, input1Text, input2, input2Text, ctaButton, ctaText);
  }

  // 3. DATABASE ERD (ENTITY RELATIONSHIP SCHEMA)
  else if (p.includes("database") || p.includes("erd") || p.includes("schema") || p.includes("sql") || p.includes("table")) {
    const tables = [
      { name: "Users Table", x: startPos.x, y: startPos.y, fields: ["id: UUID [PK]", "email: String", "name: String"] },
      { name: "Rooms Table", x: startPos.x + 280, y: startPos.y, fields: ["id: UUID [PK]", "slug: String", "ownerId: UUID"] },
    ];

    tables.forEach((tbl) => {
      const box: CanvasElement = {
        id: makeId(),
        type: "rectangle",
        x: tbl.x,
        y: tbl.y,
        width: 190,
        height: 140,
        strokeColor: colors.primary,
        fillColor: `${colors.primary}12`,
        strokeWidth: 2,
        roughness,
        edges: "round",
        createdAt: now,
      };
      const header: CanvasElement = {
        id: makeId(),
        type: "text",
        x: tbl.x + 18,
        y: tbl.y + 14,
        text: `🗄️ ${tbl.name}`,
        strokeColor: colors.primary,
        fillColor: "transparent",
        strokeWidth: 2,
        roughness,
        fontFamily,
        fontWeight: "bold",
        createdAt: now,
      };
      const fieldText: CanvasElement = {
        id: makeId(),
        type: "text",
        x: tbl.x + 18,
        y: tbl.y + 48,
        text: tbl.fields.join("\n"),
        strokeColor: colors.secondary,
        fillColor: "transparent",
        strokeWidth: 1.5,
        roughness,
        fontFamily,
        createdAt: now,
      };
      created.push(box, header, fieldText);
    });

    // Relation Arrow
    const relArrow: CanvasElement = {
      id: makeId(),
      type: "arrow",
      x: startPos.x + 190,
      y: startPos.y + 60,
      width: 90,
      height: 0,
      strokeColor: colors.accent,
      fillColor: "transparent",
      strokeWidth: 2,
      roughness,
      arrowhead: "sketchy",
      createdAt: now,
    };
    created.push(relArrow);
  }

  // 4. MICROSERVICES & API ARCHITECTURE
  else if (p.includes("microservice") || p.includes("k8s") || p.includes("cluster") || p.includes("system") || p.includes("architecture")) {
    const clientBox: CanvasElement = {
      id: makeId(),
      type: "rectangle",
      x: startPos.x,
      y: startPos.y + 40,
      width: 130,
      height: 60,
      strokeColor: colors.secondary,
      fillColor: `${colors.secondary}15`,
      strokeWidth: 2,
      roughness,
      edges: "round",
      createdAt: now,
    };
    const clientText: CanvasElement = {
      id: makeId(),
      type: "text",
      x: startPos.x + 18,
      y: startPos.y + 56,
      text: "👤 Web Client",
      strokeColor: colors.secondary,
      fillColor: "transparent",
      strokeWidth: 2,
      roughness,
      fontFamily,
      createdAt: now,
    };

    const gatewayBox: CanvasElement = {
      id: makeId(),
      type: "rectangle",
      x: startPos.x + 210,
      y: startPos.y + 40,
      width: 150,
      height: 60,
      strokeColor: colors.primary,
      fillColor: `${colors.primary}15`,
      strokeWidth: 2,
      roughness,
      edges: "round",
      createdAt: now,
    };
    const gatewayText: CanvasElement = {
      id: makeId(),
      type: "text",
      x: startPos.x + 225,
      y: startPos.y + 56,
      text: "⚡ API Gateway",
      strokeColor: colors.primary,
      fillColor: "transparent",
      strokeWidth: 2,
      roughness,
      fontFamily,
      createdAt: now,
    };

    const service1: CanvasElement = {
      id: makeId(),
      type: "rectangle",
      x: startPos.x + 440,
      y: startPos.y - 30,
      width: 150,
      height: 55,
      strokeColor: colors.accent,
      fillColor: `${colors.accent}15`,
      strokeWidth: 2,
      roughness,
      edges: "round",
      createdAt: now,
    };
    const service1Text: CanvasElement = {
      id: makeId(),
      type: "text",
      x: startPos.x + 455,
      y: startPos.y - 15,
      text: "🔐 Auth Service",
      strokeColor: colors.accent,
      fillColor: "transparent",
      strokeWidth: 2,
      roughness,
      fontFamily,
      createdAt: now,
    };

    const service2: CanvasElement = {
      id: makeId(),
      type: "rectangle",
      x: startPos.x + 440,
      y: startPos.y + 100,
      width: 150,
      height: 55,
      strokeColor: colors.success,
      fillColor: `${colors.success}15`,
      strokeWidth: 2,
      roughness,
      edges: "round",
      createdAt: now,
    };
    const service2Text: CanvasElement = {
      id: makeId(),
      type: "text",
      x: startPos.x + 455,
      y: startPos.y + 115,
      text: "📦 Order Service",
      strokeColor: colors.success,
      fillColor: "transparent",
      strokeWidth: 2,
      roughness,
      fontFamily,
      createdAt: now,
    };

    // Arrows
    const a1: CanvasElement = {
      id: makeId(),
      type: "arrow",
      x: startPos.x + 130,
      y: startPos.y + 70,
      width: 80,
      height: 0,
      strokeColor: colors.primary,
      fillColor: "transparent",
      strokeWidth: 2,
      roughness,
      arrowhead: "sketchy",
      createdAt: now,
    };
    const a2: CanvasElement = {
      id: makeId(),
      type: "arrow",
      x: startPos.x + 360,
      y: startPos.y + 60,
      width: 80,
      height: -55,
      strokeColor: colors.accent,
      fillColor: "transparent",
      strokeWidth: 2,
      roughness,
      arrowhead: "sketchy",
      createdAt: now,
    };
    const a3: CanvasElement = {
      id: makeId(),
      type: "arrow",
      x: startPos.x + 360,
      y: startPos.y + 80,
      width: 80,
      height: 45,
      strokeColor: colors.success,
      fillColor: "transparent",
      strokeWidth: 2,
      roughness,
      arrowhead: "sketchy",
      createdAt: now,
    };

    created.push(clientBox, clientText, gatewayBox, gatewayText, service1, service1Text, service2, service2Text, a1, a2, a3);
  }

  // 5. BINARY SEARCH TREE / GRAPH
  else if (p.includes("tree") || p.includes("binary") || p.includes("graph") || p.includes("node") || p.includes("algo")) {
    const rootCircle: CanvasElement = {
      id: makeId(),
      type: "circle",
      x: startPos.x + 160,
      y: startPos.y,
      width: 60,
      height: 60,
      strokeColor: colors.accent,
      fillColor: `${colors.accent}20`,
      strokeWidth: 2,
      roughness,
      createdAt: now,
    };
    const rootText: CanvasElement = {
      id: makeId(),
      type: "text",
      x: startPos.x + 182,
      y: startPos.y + 16,
      text: "50",
      strokeColor: colors.accent,
      fillColor: "transparent",
      strokeWidth: 2,
      roughness,
      fontFamily,
      fontWeight: "bold",
      createdAt: now,
    };

    const leftCircle: CanvasElement = {
      id: makeId(),
      type: "circle",
      x: startPos.x + 60,
      y: startPos.y + 110,
      width: 55,
      height: 55,
      strokeColor: colors.primary,
      fillColor: `${colors.primary}20`,
      strokeWidth: 2,
      roughness,
      createdAt: now,
    };
    const leftText: CanvasElement = {
      id: makeId(),
      type: "text",
      x: startPos.x + 78,
      y: startPos.y + 124,
      text: "30",
      strokeColor: colors.primary,
      fillColor: "transparent",
      strokeWidth: 2,
      roughness,
      fontFamily,
      fontWeight: "bold",
      createdAt: now,
    };

    const rightCircle: CanvasElement = {
      id: makeId(),
      type: "circle",
      x: startPos.x + 260,
      y: startPos.y + 110,
      width: 55,
      height: 55,
      strokeColor: colors.success,
      fillColor: `${colors.success}20`,
      strokeWidth: 2,
      roughness,
      createdAt: now,
    };
    const rightText: CanvasElement = {
      id: makeId(),
      type: "text",
      x: startPos.x + 278,
      y: startPos.y + 124,
      text: "70",
      strokeColor: colors.success,
      fillColor: "transparent",
      strokeWidth: 2,
      roughness,
      fontFamily,
      fontWeight: "bold",
      createdAt: now,
    };

    const leftArrow: CanvasElement = {
      id: makeId(),
      type: "arrow",
      x: startPos.x + 165,
      y: startPos.y + 55,
      width: -65,
      height: 55,
      strokeColor: colors.primary,
      fillColor: "transparent",
      strokeWidth: 2,
      roughness,
      arrowhead: "sketchy",
      createdAt: now,
    };

    const rightArrow: CanvasElement = {
      id: makeId(),
      type: "arrow",
      x: startPos.x + 215,
      y: startPos.y + 55,
      width: 60,
      height: 55,
      strokeColor: colors.success,
      fillColor: "transparent",
      strokeWidth: 2,
      roughness,
      arrowhead: "sketchy",
      createdAt: now,
    };

    created.push(rootCircle, rootText, leftCircle, leftText, rightCircle, rightText, leftArrow, rightArrow);
  }

  // 6. DEFAULT FLOWCHART
  else {
    const startBox: CanvasElement = {
      id: makeId(),
      type: "rectangle",
      x: startPos.x,
      y: startPos.y,
      width: 140,
      height: 55,
      strokeColor: colors.success,
      fillColor: `${colors.success}15`,
      strokeWidth: 2,
      roughness,
      edges: "round",
      createdAt: now,
    };
    const startText: CanvasElement = {
      id: makeId(),
      type: "text",
      x: startPos.x + 28,
      y: startPos.y + 16,
      text: "🚀 Start Flow",
      strokeColor: colors.success,
      fillColor: "transparent",
      strokeWidth: 2,
      roughness,
      fontFamily,
      fontWeight: "bold",
      createdAt: now,
    };

    const processBox: CanvasElement = {
      id: makeId(),
      type: "rectangle",
      x: startPos.x + 220,
      y: startPos.y,
      width: 160,
      height: 55,
      strokeColor: colors.primary,
      fillColor: `${colors.primary}15`,
      strokeWidth: 2,
      roughness,
      edges: "sharp",
      createdAt: now,
    };
    const processText: CanvasElement = {
      id: makeId(),
      type: "text",
      x: startPos.x + 236,
      y: startPos.y + 16,
      text: "⚙️ Process Logic",
      strokeColor: colors.primary,
      fillColor: "transparent",
      strokeWidth: 2,
      roughness,
      fontFamily,
      fontWeight: "bold",
      createdAt: now,
    };

    const endBox: CanvasElement = {
      id: makeId(),
      type: "rectangle",
      x: startPos.x + 460,
      y: startPos.y,
      width: 140,
      height: 55,
      strokeColor: colors.warning,
      fillColor: `${colors.warning}15`,
      strokeWidth: 2,
      roughness,
      edges: "round",
      createdAt: now,
    };
    const endText: CanvasElement = {
      id: makeId(),
      type: "text",
      x: startPos.x + 480,
      y: startPos.y + 16,
      text: "✨ Output State",
      strokeColor: colors.warning,
      fillColor: "transparent",
      strokeWidth: 2,
      roughness,
      fontFamily,
      fontWeight: "bold",
      createdAt: now,
    };

    const arr1: CanvasElement = {
      id: makeId(),
      type: "arrow",
      x: startPos.x + 140,
      y: startPos.y + 27,
      width: 80,
      height: 0,
      strokeColor: colors.primary,
      fillColor: "transparent",
      strokeWidth: 2,
      roughness,
      arrowhead: "sketchy",
      createdAt: now,
    };

    const arr2: CanvasElement = {
      id: makeId(),
      type: "arrow",
      x: startPos.x + 380,
      y: startPos.y + 27,
      width: 80,
      height: 0,
      strokeColor: colors.warning,
      fillColor: "transparent",
      strokeWidth: 2,
      roughness,
      arrowhead: "sketchy",
      createdAt: now,
    };

    created.push(startBox, startText, processBox, processText, endBox, endText, arr1, arr2);
  }

  return created;
}
