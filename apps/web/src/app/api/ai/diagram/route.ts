import { NextRequest, NextResponse } from "next/server";
import { ai, GEMINI_MODEL } from "@/lib/gemini";
import { CanvasElement } from "@/types";
import { generateAiDiagram, AiDiagramOptions } from "@/lib/ai-math-solver";

interface DiagramNode {
  id: string;
  title: string;
  subtitle?: string;
  shape?: "rectangle" | "circle";
  col: number; // 0, 1, 2, 3, 4
  row: number; // 0, 1, 2, 3
}

interface DiagramEdge {
  fromNodeId: string;
  toNodeId: string;
  label?: string; // e.g. "HTTPS", "SQL", "WSS", "gRPC"
}

interface GeminiDiagramResponse {
  diagramTitle: string;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, startPos = { x: 200, y: 150 }, options = {} } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const { roughness = 1.2, palette = "vibrant", fontFamily = "caveat" } = options as AiDiagramOptions;

    // Harmonious Palette maps
    const paletteMap: Record<string, string[]> = {
      vibrant: ["#8b5cf6", "#3b82f6", "#ec4899", "#10b981", "#f59e0b", "#06b6d4"],
      neon: ["#06b6d4", "#a855f7", "#f43f5e", "#10b981", "#eab308", "#38bdf8"],
      warm: ["#f97316", "#ef4444", "#e11d48", "#84cc16", "#facc15", "#fb923c"],
      emerald: ["#10b981", "#14b8a6", "#06b6d4", "#22c55e", "#eab308", "#34d399"],
      mono: ["#52525b", "#71717a", "#3f3f46", "#27272a", "#18181b", "#a1a1aa"],
    };
    const activePalette = paletteMap[palette] || paletteMap.vibrant;

    // 1. If Gemini AI is configured with API key, generate dynamic AI diagram
    if (ai) {
      try {
        const systemInstruction = `
You are a Principal Software Architect and visual design expert specializing in clean, intuitive hand-drawn diagrams for Excalidraw whiteboards.

Given the user prompt, design a highly creative, production-grade visual architecture or flowchart diagram.

Architectural Layout Rules (CRITICAL FOR ZERO OVERLAPS):
1. Break the concept into 4 to 8 distinct components.
2. Structure nodes in a clean 2D grid:
   - col: 0 for Clients / Inputs (🌐 Web Client, 📱 Mobile App)
   - col: 1 for Ingress / Gateway / Auth (⚡ API Gateway, 🛡️ Cloudflare)
   - col: 2 for Core Microservices / Workers (🔐 Auth Service, 📦 Orders Service, 🤖 AI Engine)
   - col: 3 for Data Stores / Caches / Queues (🗄️ PostgreSQL DB, ⚡ Redis Cache, 📨 Kafka Queue)
   - col: 4 for External 3rd-party APIs (💳 Stripe, 📧 SendGrid)
3. Ensure no two nodes share the EXACT same (col, row) coordinates.
4. For each node, include a clear emoji in the title (e.g. 🌐 Web Client, ⚡ API Gateway, 🔐 Auth Service, 🗄️ PostgreSQL DB).
5. Add a 2-4 word subtitle describing the specific role or tech stack.
6. Connect nodes with logical directional edges and short 1-word action labels (e.g. "HTTPS", "gRPC", "SQL", "WSS", "Event").

Output STRICT JSON matching this schema:
{
  "diagramTitle": "string",
  "nodes": [
    {
      "id": "node_1",
      "title": "string with emoji",
      "subtitle": "short 2-4 word description",
      "shape": "rectangle" | "circle",
      "col": 0,
      "row": 0
    }
  ],
  "edges": [
    {
      "fromNodeId": "node_1",
      "toNodeId": "node_2",
      "label": "optional short action"
    }
  ]
}
`;

        const response = await ai.models.generateContent({
          model: GEMINI_MODEL,
          contents: [
            {
              role: "user",
              parts: [{ text: `Design a clean, non-overlapping visual architecture diagram for: "${prompt}"` }],
            },
          ],
          config: {
            systemInstruction,
            responseMimeType: "application/json",
            temperature: 0.2,
          },
        });

        const rawText = response.text || "";
        if (rawText) {
          const parsed: GeminiDiagramResponse = JSON.parse(rawText);

          if (parsed.nodes && parsed.nodes.length > 0) {
            const elements: CanvasElement[] = [];
            const now = Date.now();

            // Generous spacing to guarantee zero collision
            const colSpacing = 300;
            const rowSpacing = 160;
            const nodeMap = new Map<string, { x: number; y: number; width: number; height: number; boxId: string; col: number; row: number }>();

            // Title Banner
            if (parsed.diagramTitle) {
              const titleEl: CanvasElement = {
                id: `gemini_title_${now}`,
                type: "text",
                x: startPos.x,
                y: startPos.y - 50,
                text: `✨ ${parsed.diagramTitle}`,
                strokeColor: activePalette[0],
                fillColor: "transparent",
                strokeWidth: 2.5,
                roughness: 1,
                fontFamily,
                fontWeight: "bold",
                createdAt: now,
              };
              elements.push(titleEl);
            }

            // Track occupied grid cells to ensure zero overlap
            const occupiedCells = new Set<string>();

            // Generate Nodes with Proper Bounding Dimensions
            parsed.nodes.forEach((node, idx) => {
              let nodeCol = typeof node.col === "number" ? node.col : idx % 4;
              let nodeRow = typeof node.row === "number" ? node.row : Math.floor(idx / 4);

              // Auto-resolve cell collisions
              while (occupiedCells.has(`${nodeCol},${nodeRow}`)) {
                nodeRow += 1;
              }
              occupiedCells.add(`${nodeCol},${nodeRow}`);

              const nodeX = startPos.x + nodeCol * colSpacing;
              const nodeY = startPos.y + nodeRow * rowSpacing;

              const titleLen = (node.title || "").length;
              const subLen = (node.subtitle || "").length;
              const maxLen = Math.max(titleLen, subLen);

              const width = node.shape === "circle" ? 95 : Math.max(180, Math.min(250, maxLen * 9 + 40));
              const height = node.shape === "circle" ? 95 : node.subtitle ? 68 : 52;
              const color = activePalette[idx % activePalette.length];
              const boxId = `gemini_box_${now}_${idx}`;

              nodeMap.set(node.id, { x: nodeX, y: nodeY, width, height, boxId, col: nodeCol, row: nodeRow });

              // Container Box
              const shapeElement: CanvasElement = {
                id: boxId,
                type: node.shape === "circle" ? "circle" : "rectangle",
                x: nodeX,
                y: nodeY,
                width,
                height,
                strokeColor: color,
                fillColor: `${color}18`,
                strokeWidth: 2,
                roughness,
                edges: "round",
                createdAt: now,
              };

              // Node Text (Centered and perfectly padded inside box)
              const textContent = node.subtitle
                ? `${node.title}\n${node.subtitle}`
                : node.title;

              const textElement: CanvasElement = {
                id: `gemini_text_${now}_${idx}`,
                type: "text",
                x: nodeX + (node.shape === "circle" ? 14 : 16),
                y: nodeY + (node.shape === "circle" ? 28 : node.subtitle ? 14 : 15),
                text: textContent,
                strokeColor: color,
                fillColor: "transparent",
                strokeWidth: 2,
                roughness,
                fontFamily,
                fontWeight: "bold",
                createdAt: now,
              };

              elements.push(shapeElement, textElement);
            });

            // Generate Smart Non-Overlapping Connecting Arrows
            if (Array.isArray(parsed.edges)) {
              parsed.edges.forEach((edge, eIdx) => {
                const from = nodeMap.get(edge.fromNodeId);
                const to = nodeMap.get(edge.toNodeId);

                if (from && to && from.boxId !== to.boxId) {
                  let startX = from.x;
                  let startY = from.y;
                  let endX = to.x;
                  let endY = to.y;

                  // 1. Horizontal flow (Left -> Right)
                  if (from.col < to.col) {
                    startX = from.x + from.width;
                    startY = from.y + from.height / 2;
                    endX = to.x;
                    endY = to.y + to.height / 2;
                  }
                  // 2. Vertical flow (Top -> Bottom in same column)
                  else if (from.col === to.col && from.row < to.row) {
                    startX = from.x + from.width / 2;
                    startY = from.y + from.height;
                    endX = to.x + to.width / 2;
                    endY = to.y;
                  }
                  // 3. Vertical reverse (Bottom -> Top in same column)
                  else if (from.col === to.col && from.row > to.row) {
                    startX = from.x + from.width / 2;
                    startY = from.y;
                    endX = to.x + to.width / 2;
                    endY = to.y + to.height;
                  }
                  // 4. Reverse horizontal flow (Right -> Left)
                  else {
                    startX = from.x;
                    startY = from.y + from.height / 2;
                    endX = to.x + to.width;
                    endY = to.y + to.height / 2;
                  }

                  const arrowColor = activePalette[(eIdx + 1) % activePalette.length];

                  const arrowElement: CanvasElement = {
                    id: `gemini_arrow_${now}_${eIdx}`,
                    type: "arrow",
                    x: startX,
                    y: startY,
                    width: endX - startX,
                    height: endY - startY,
                    strokeColor: arrowColor,
                    fillColor: "transparent",
                    strokeWidth: 2,
                    roughness: roughness * 1.1,
                    arrowhead: "sketchy",
                    startBinding: { elementId: from.boxId },
                    endBinding: { elementId: to.boxId },
                    createdAt: now,
                  };

                  elements.push(arrowElement);

                  // Cleanly positioned Edge Label (Offset safely above the line to prevent collision)
                  if (edge.label && edge.label.trim()) {
                    const midX = (startX + endX) / 2;
                    const midY = (startY + endY) / 2;

                    const labelOffset = Math.abs(endX - startX) > Math.abs(endY - startY)
                      ? { x: midX - 25, y: midY - 24 } // Horizontal arrow -> float above
                      : { x: midX + 12, y: midY - 10 }; // Vertical arrow -> float to the right

                    const edgeLabel: CanvasElement = {
                      id: `gemini_edgelabel_${now}_${eIdx}`,
                      type: "text",
                      x: labelOffset.x,
                      y: labelOffset.y,
                      text: edge.label.trim(),
                      strokeColor: arrowColor,
                      fillColor: "transparent",
                      strokeWidth: 1.5,
                      roughness: 1,
                      fontFamily,
                      createdAt: now,
                    };
                    elements.push(edgeLabel);
                  }
                }
              });
            }

            return NextResponse.json({
              success: true,
              engine: "gemini-3.7-flash",
              title: parsed.diagramTitle,
              elements,
            });
          }
        }
      } catch (geminiError: any) {
        console.warn("[Gemini API] Failed to generate dynamic diagram, using fallback heuristic:", geminiError.message);
      }
    }

    // 2. Fallback to rich local heuristic generator if Gemini key not set / network issue
    const fallbackElements = generateAiDiagram(prompt, startPos, options);
    return NextResponse.json({
      success: true,
      engine: "local-heuristic-fallback",
      elements: fallbackElements,
    });
  } catch (err: any) {
    console.error("[API AI Diagram Error]:", err);
    return NextResponse.json({ error: err.message || "Failed to process AI diagram" }, { status: 500 });
  }
}
