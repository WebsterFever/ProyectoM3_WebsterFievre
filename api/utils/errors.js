/*
 * errors.js — Traduccion de errores tecnicos a respuestas HTTP controladas
 */
export function getHttpStatus(error) {
  return typeof error?.status === "number" ? error.status : 500;
}

export function isRateLimitError(error) {
  const status = error?.status ?? error?.response?.status;
  const text = String(error?.message ?? "").toLowerCase();
  return status === 429 || text.includes("429") || text.includes("rate limit") || text.includes("quota");
}
