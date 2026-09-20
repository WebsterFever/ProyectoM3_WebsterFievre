/*
 * request.js — Helpers for reading the /api/chat request
 *
 * The Serverless Function receives the payload built by src/engine/payload.js.
 * It only validates that it is well formed; it does not rebuild memory or know about
 * characters.
 */
export function parseJsonBody(body) {
  if (typeof body === "string") {
    return JSON.parse(body || "{}");
  }
  return body ?? {};
}

export function getMessages(payload) {
  const messages = Array.isArray(payload?.messages) ? payload.messages : [];

  if (messages.length === 0) {
    const error = new Error("The payload must include messages[]");
    error.status = 400;
    throw error;
  }

  return messages;
}

export function getGenerationSettings(payload) {
  return {
    system: typeof payload?.system === "string" ? payload.system : "",
    modelName: typeof payload?.model === "string" ? payload.model : "gemini-2.5-flash",
    temperature: typeof payload?.temperature === "number" ? payload.temperature : 0.7,
    maxTokens: typeof payload?.max_tokens === "number" ? payload.max_tokens : 200,
  };
}
