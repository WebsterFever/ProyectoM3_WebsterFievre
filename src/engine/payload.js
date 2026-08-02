/*
 * payload.js — Construccion y validacion del payload interno del chat
 *
 * Contrato que viaja del frontend a /api/chat:
 * {
 *   model: string,
 *   system: string,
 *   messages: [ { role: "user" | "assistant", content: string } ],
 *   max_tokens: number,
 *   temperature: number
 * }
 *
 * El backend no conoce personajes: solo recibe este contrato generico y lo
 * adapta al proveedor de IA que corresponda (Gemini en este proyecto).
 */

const DEFAULT_MODEL = "gemini-2.5-flash";
const DEFAULT_MAX_TOKENS = 200;

export function createSystemPrompt(character) {
  return character.systemPrompt;
}

export function buildPayload(character, messages) {
  return {
    model: DEFAULT_MODEL,
    system: createSystemPrompt(character),
    messages,
    max_tokens: DEFAULT_MAX_TOKENS,
    temperature: character.temperature ?? 0.7,
  };
}

export function isValidPayload(payload) {
  if (typeof payload?.model !== "string") return false;
  if (typeof payload?.system !== "string") return false;
  if (!Array.isArray(payload?.messages)) return false;

  return payload.messages.every((msg) => {
    const hasValidRole = msg?.role === "user" || msg?.role === "assistant";
    const hasTextContent = typeof msg?.content === "string";
    return hasValidRole && hasTextContent;
  });
}
