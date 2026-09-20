/*
 * errors.js — Translation of technical errors into controlled HTTP responses
 */
export function getHttpStatus(error) {
  return typeof error?.status === "number" ? error.status : 500;
}

export function isRateLimitError(error) {
  const status = error?.status ?? error?.response?.status;
  const text = String(error?.message ?? "").toLowerCase();
  return status === 429 || text.includes("429") || text.includes("rate limit") || text.includes("quota");
}
