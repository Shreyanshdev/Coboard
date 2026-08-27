import { GoogleGenAI } from "@google/genai";

// Initialize Google Gen AI client with API Key from environment
const apiKey = process.env.GEMINI_API_KEY || "";

export const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Preferred model for fast sub-second structured diagram generation & vision OCR
export const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
