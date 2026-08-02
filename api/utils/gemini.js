/*
 * gemini.js — Adaptador entre el payload interno y Gemini
 *
 * El frontend manda:
 *   messages: [{ role: "user" | "assistant", content: string }]
 *
 * Gemini espera:
 *   contents: [{ role: "user" | "model", parts: [{ text }] }]
 *
 * El system prompt no va dentro de contents[]: se manda aparte como
 * systemInstruction al crear el modelo (ver api/chat.js).
 */
export function toGeminiContents(messages) {
  return messages
    .filter((msg) => msg?.role === "user" || msg?.role === "assistant")
    .map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: String(msg.content ?? "") }],
    }));
}
