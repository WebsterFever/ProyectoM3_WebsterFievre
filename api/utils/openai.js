/*
 * openai.js — Adaptador entre el payload interno y OpenAI
 *
 * El frontend manda:
 *   system: string
 *   messages: [{ role: "user" | "assistant", content: string }]
 *
 * OpenAI Chat Completions espera:
 *   messages: [{ role: "system" | "user" | "assistant", content: string }]
 *
 * A diferencia de Gemini (que usa "parts"/"model" en vez de "content"/
 * "assistant"), el shape de OpenAI ya coincide casi 1:1 con el contrato
 * interno; el unico trabajo real es anteponer el mensaje de sistema.
 */
export function toOpenAIMessages(system, messages) {
  const history = messages
    .filter((msg) => msg?.role === "user" || msg?.role === "assistant")
    .map((msg) => ({ role: msg.role, content: String(msg.content ?? "") }));

  return [{ role: "system", content: system }, ...history];
}
