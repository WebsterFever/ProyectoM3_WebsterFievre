/*
 * response.js — Response shape compatible with src/engine/normalizer.js
 *
 * Regardless of which AI provider responds behind the scenes, we always return
 * the same shape so the frontend does not need to change if, in the future,
 * Gemini is replaced by another provider.
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
