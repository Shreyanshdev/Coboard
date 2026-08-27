import { NextRequest, NextResponse } from "next/server";
import { ai, GEMINI_MODEL } from "@/lib/gemini";
import { CanvasElement } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageBase64, position = { x: 300, y: 300 }, fontFamily = "caveat", color = "#10b981" } = body;

    if (!imageBase64 || typeof imageBase64 !== "string") {
      return NextResponse.json({ error: "imageBase64 is required" }, { status: 400 });
    }

    if (!ai) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not set in environment." },
        { status: 500 }
      );
    }

    // Strip data url prefix if present
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const systemInstruction = `
You are a Math Notes & Hand-drawn diagram solver like Apple iPad Math Notes.
Analyze the handwritten sketch or equation in the provided canvas image.
1. Transcribe the equation (e.g. "2 + 2 =", "15 * 8 =", "\\int x^2 dx =").
2. Calculate the exact, simplified mathematical answer (e.g. "4", "120", "\\frac{x^3}{3} + C").
3. Output STRICT JSON in this format:
{
  "equation": "string",
  "solution": "string",
  "explanation": "brief 1 sentence explanation"
}
`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: "image/png",
              },
            },
            {
              text: "Solve this handwritten equation or sketched problem.",
            },
          ],
        },
      ],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.1,
      },
    });

    const rawText = response.text || "";
    if (!rawText) {
      return NextResponse.json({ error: "No response from Gemini Vision" }, { status: 500 });
    }

    const parsed = JSON.parse(rawText);
    const solutionText = parsed.solution || "";

    // Generate handwritten result text element to spawn next to equation
    const answerElement: CanvasElement = {
      id: `math_ai_${Date.now()}`,
      type: "text",
      x: position.x,
      y: position.y,
      text: solutionText,
      strokeColor: color,
      fillColor: "transparent",
      strokeWidth: 2.5,
      roughness: 1.2,
      fontFamily,
      fontWeight: "bold",
      createdAt: Date.now(),
    };

    return NextResponse.json({
      success: true,
      equation: parsed.equation,
      solution: parsed.solution,
      explanation: parsed.explanation,
      element: answerElement,
    });
  } catch (err: any) {
    console.error("[API AI Math Solve Error]:", err);
    return NextResponse.json(
      { error: err.message || "Failed to solve with Gemini Vision" },
      { status: 500 }
    );
  }
}
