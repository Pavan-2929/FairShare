import {
  GoogleGenerativeAI,
  GenerationConfig,
  Part,
} from "@google/generative-ai";

// Prefer the latest stable model, then fall back to a cost-efficient model.
const FALLBACK_MODELS = ["gemini-3.8-flash", "gemini-3.5-flash-lite"];

function getErrorDetails(error: unknown) {
  const errorObject =
    typeof error === "object" && error !== null
      ? (error as Record<string, unknown>)
      : undefined;

  const message =
    error instanceof Error
      ? error.message
      : typeof errorObject?.message === "string"
        ? errorObject.message
        : String(error);

  const status =
    typeof errorObject?.status === "number" ? errorObject.status : undefined;

  return { message, status };
}

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
    } catch (error: unknown) {
      lastError = error;

      const { message, status } = getErrorDetails(error);
      const normalizedMessage = message.toLowerCase();

      const isRetryable =
        status === 503 ||
        status === 429 ||
        normalizedMessage.includes("503") ||
        normalizedMessage.includes("429") ||
        normalizedMessage.includes("fetch failed") ||
        normalizedMessage.includes("timeout") ||
        normalizedMessage.includes("aborted");

      if (!isRetryable) {
        throw error;
      }

      console.warn(
        `Model ${modelName} failed: ${message}. Trying the next fallback...`,
      );
    }
  }

  throw lastError ?? new Error("All Gemini models failed.");
}
