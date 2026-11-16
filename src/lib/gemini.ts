import dns from "node:dns";
import {
  GoogleGenerativeAI,
  GenerationConfig,
  Part,
} from "@google/generative-ai";

dns.setDefaultResultOrder("ipv4first");

const FALLBACK_MODELS = [
  "gemini-3.1-flash-lite",
  "gemini-3.5-flash-lite",
  "gemini-3.8-flash",
  "gemini-3.5-flash",
];

export async function generateWithFallback({
  contents,
  systemInstruction,
  generationConfig,
}: {
  contents: string | Array<string | Part>;
  systemInstruction?: string;
  generationConfig?: GenerationConfig;
}) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing from environment variables.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  let lastError: unknown;

  for (const modelName of FALLBACK_MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction,
        generationConfig,
      });

      const result = await model.generateContent(contents, {
        timeout: 10000,
      });

      return result.response.text();
    } catch (error: any) {
      lastError = error;
      const msg = String(error?.message || "").toLowerCase();
      const isRetryable =
        error?.status === 503 ||
        error?.status === 429 ||
        msg.includes("503") ||
        msg.includes("429") ||
        msg.includes("fetch failed") ||
        msg.includes("timeout") ||
        msg.includes("aborted");

      if (!isRetryable) {
        throw error;
      }
      console.warn(
        `Model ${modelName} failed (${error?.message}), trying next fallback...`,
      );
    }
  }

  throw lastError;
}
