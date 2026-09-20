import { describe, it, expect } from "vitest";
import { normalizeAIResponse, extractUsage } from "../src/engine/normalizer.js";

describe("normalizeAIResponse", () => {
  it("extracts text from type text blocks", () => {
    const raw = {
      content: [{ type: "text", text: "Fuerte con la Fuerza, eres." }],
      stop_reason: "end_turn",
    };
    expect(normalizeAIResponse(raw)).toEqual({
      text: "Fuerte con la Fuerza, eres.",
      truncated: false,
    });
  });

  it("marks truncated when stop_reason is max_tokens", () => {
    const raw = { content: [{ type: "text", text: "..." }], stop_reason: "max_tokens" };
    expect(normalizeAIResponse(raw).truncated).toBe(true);
  });

  it("never breaks if the shape is unexpected", () => {
    expect(normalizeAIResponse(null)).toEqual({ text: "", truncated: false });
    expect(normalizeAIResponse({})).toEqual({ text: "", truncated: false });
    expect(normalizeAIResponse({ content: "not-an-array" })).toEqual({ text: "", truncated: false });
  });
});

describe("extractUsage", () => {
  it("returns 0 by default when usage is missing", () => {
    expect(extractUsage({})).toEqual({ inputTokens: 0, outputTokens: 0 });
  });

  it("extracts input_tokens and output_tokens", () => {
    const raw = { usage: { input_tokens: 12, output_tokens: 8 } };
    expect(extractUsage(raw)).toEqual({ inputTokens: 12, outputTokens: 8 });
  });
});
