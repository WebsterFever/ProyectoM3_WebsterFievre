import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { callAI } from "../src/engine/aiClient.js";

function mockFetchOnce(response) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: response.ok,
      status: response.status,
      json: async () => response.body,
    })
  );
}

describe("callAI", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("sends a POST request to /api/chat with the serialized payload in the body", async () => {
    mockFetchOnce({ ok: true, status: 200, body: { content: [] } });
    const payload = { model: "gemini-2.5-flash", system: "x", messages: [], max_tokens: 200, temperature: 0.7 };

    await callAI(payload);

    expect(fetch).toHaveBeenCalledWith(
      "/api/chat",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
    );
  });

  it("returns the response JSON when response.ok is true", async () => {
    const raw = { content: [{ type: "text", text: "Fuerte con la Fuerza, eres." }] };
    mockFetchOnce({ ok: true, status: 200, body: raw });

    await expect(callAI({})).resolves.toEqual(raw);
  });

  it("throws an error with the backend message when response.ok is false", async () => {
    mockFetchOnce({ ok: false, status: 429, body: { error: "Gemini rate limit reached.", retryAfterSeconds: 8 } });

    await expect(callAI({})).rejects.toThrow("Gemini rate limit reached.");
  });

  it("attaches status and retryAfterSeconds to the thrown error", async () => {
    mockFetchOnce({ ok: false, status: 429, body: { error: "Rate limit", retryAfterSeconds: 8 } });

    try {
      await callAI({});
      throw new Error("should not get here");
    } catch (error) {
      expect(error.status).toBe(429);
      expect(error.retryAfterSeconds).toBe(8);
    }
  });

  it("uses a generic message if the error response does not include 'error'", async () => {
    mockFetchOnce({ ok: false, status: 500, body: {} });
    await expect(callAI({})).rejects.toThrow("HTTP 500");
  });

  it("throws an error if the body is not valid JSON (instead of silently returning empty data)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => {
          throw new SyntaxError("Unexpected token <");
        },
      })
    );

    await expect(callAI({})).rejects.toThrow("The server did not return a valid response.");
  });
});
