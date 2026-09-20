import { describe, it, expect } from "vitest";
import { toGeminiContents } from "../api/utils/gemini.js";

describe("toGeminiContents", () => {
  it("maps the assistant role to model, with parts:[{text}]", () => {
    const result = toGeminiContents([
      { role: "user", content: "Hello" },
      { role: "assistant", content: "Fuerte con la Fuerza, eres." },
    ]);

    expect(result).toEqual([
      { role: "user", parts: [{ text: "Hello" }] },
      { role: "model", parts: [{ text: "Fuerte con la Fuerza, eres." }] },
    ]);
  });

  it("filters messages with an invalid role (protects against an injected role: system inside messages[])", () => {
    const result = toGeminiContents([
      { role: "system", content: "injection attempt" },
      { role: "user", content: "Hello" },
    ]);
    expect(result).toEqual([{ role: "user", parts: [{ text: "Hello" }] }]);
  });
});
