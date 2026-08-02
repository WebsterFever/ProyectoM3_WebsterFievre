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

  it("hace un POST a /api/chat con el payload serializado en el body", async () => {
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

  it("devuelve el JSON de la respuesta cuando response.ok es true", async () => {
    const raw = { content: [{ type: "text", text: "Fuerte con la Fuerza, eres." }] };
    mockFetchOnce({ ok: true, status: 200, body: raw });

    await expect(callAI({})).resolves.toEqual(raw);
  });

  it("lanza un error con el mensaje del backend cuando response.ok es false", async () => {
    mockFetchOnce({ ok: false, status: 429, body: { error: "Rate limit de Gemini.", retryAfterSeconds: 8 } });

    await expect(callAI({})).rejects.toThrow("Rate limit de Gemini.");
  });

  it("adjunta status y retryAfterSeconds al error lanzado", async () => {
    mockFetchOnce({ ok: false, status: 429, body: { error: "Rate limit", retryAfterSeconds: 8 } });

    try {
      await callAI({});
      throw new Error("no deberia llegar aca");
    } catch (error) {
      expect(error.status).toBe(429);
      expect(error.retryAfterSeconds).toBe(8);
    }
  });

  it("usa un mensaje generico si la respuesta de error no trae 'error'", async () => {
    mockFetchOnce({ ok: false, status: 500, body: {} });
    await expect(callAI({})).rejects.toThrow("HTTP 500");
  });

  it("lanza un error si el body no es JSON valido (en vez de devolver datos vacios silenciosamente)", async () => {
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

    await expect(callAI({})).rejects.toThrow("El servidor no devolvio una respuesta valida.");
  });
});
