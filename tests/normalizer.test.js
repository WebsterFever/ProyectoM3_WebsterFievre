import { describe, it, expect } from "vitest";
import { normalizeAIResponse, extractUsage } from "../src/engine/normalizer.js";

describe("normalizeAIResponse", () => {
  it("extrae el texto de los bloques type text", () => {
    const raw = {
      content: [{ type: "text", text: "Fuerte con la Fuerza, eres." }],
      stop_reason: "end_turn",
    };
    expect(normalizeAIResponse(raw)).toEqual({
      text: "Fuerte con la Fuerza, eres.",
      truncated: false,
    });
  });

  it("marca truncated cuando stop_reason es max_tokens", () => {
    const raw = { content: [{ type: "text", text: "..." }], stop_reason: "max_tokens" };
    expect(normalizeAIResponse(raw).truncated).toBe(true);
  });

  it("nunca rompe si el shape es inesperado", () => {
    expect(normalizeAIResponse(null)).toEqual({ text: "", truncated: false });
    expect(normalizeAIResponse({})).toEqual({ text: "", truncated: false });
    expect(normalizeAIResponse({ content: "no-es-array" })).toEqual({ text: "", truncated: false });
  });
});

describe("extractUsage", () => {
  it("devuelve 0 por defecto si no hay usage", () => {
    expect(extractUsage({})).toEqual({ inputTokens: 0, outputTokens: 0 });
  });

  it("extrae input_tokens y output_tokens", () => {
    const raw = { usage: { input_tokens: 12, output_tokens: 8 } };
    expect(extractUsage(raw)).toEqual({ inputTokens: 12, outputTokens: 8 });
  });
});
