/*
 * gemini.js — Adapter between the internal payload and Gemini
 *
 * The frontend sends:
 *   messages: [{ role: "user" | "assistant", content: string }]
 *
 * Gemini expects:
 *   contents: [{ role: "user" | "model", parts: [{ text }] }]
 *
 * The system prompt does not go inside contents[]: it is sent separately as
 * systemInstruction when creating the model (see api/chat.js).
 */
export function toGeminiContents(messages) {
  return messages
    .filter((msg) => msg?.role === "user" || msg?.role === "assistant")
    .map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: String(msg.content ?? "") }],
    }));
}
