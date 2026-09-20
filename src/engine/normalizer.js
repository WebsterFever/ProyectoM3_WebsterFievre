/*
 * normalizer.js — Robust parsing of the /api/chat response
 *
 * The backend always returns the same shape regardless of the AI provider
 * used behind the scenes (see api/utils/response.js):
 *   { content: [{ type: "text", text }], stop_reason, usage }
 *
 * The UI needs a safe string. This module never breaks if it receives an
 * unexpected shape.
 */
export function normalizeAIResponse(raw) {
  const blocks = Array.isArray(raw?.content) ? raw.content : [];

  const text = blocks
    .filter((block) => block && block.type === "text" && typeof block.text === "string")
    .map((block) => block.text)
    .join("")
    .trim();

  const truncated = raw?.stop_reason === "max_tokens";

  return { text, truncated };
}

export function extractUsage(raw) {
  return {
    inputTokens: raw?.usage?.input_tokens ?? 0,
    outputTokens: raw?.usage?.output_tokens ?? 0,
  };
}
