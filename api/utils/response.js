/*
 * response.js — Shape de respuesta compatible con src/engine/normalizer.js
 *
 * Sin importar que proveedor de IA responda por detras, siempre devolvemos
 * este mismo shape para que el frontend no tenga que cambiar si el dia de
 * mañana se cambia Gemini por otro proveedor.
 */
export function createChatResponse({ text, payload }) {
  return {
    id: `msg_gemini_${Date.now()}`,
    type: "message",
    role: "assistant",
    content: [
      {
        type: "text",
        text,
      },
    ],
    stop_reason: "end_turn",
    usage: {
      input_tokens: estimateTokens(JSON.stringify(payload)),
      output_tokens: estimateTokens(text),
    },
  };
}

function estimateTokens(text) {
  return Math.max(1, Math.ceil(String(text).length / 4));
}
