/*
 * normalizer.js — Parseo robusto de la respuesta de /api/chat
 *
 * El backend siempre devuelve el mismo shape sin importar el proveedor de
 * IA que use por detras (ver api/utils/response.js):
 *   { content: [{ type: "text", text }], stop_reason, usage }
 *
 * La UI necesita un string seguro. Este modulo nunca rompe si llega un
 * shape inesperado.
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
