import { describe, it, expect } from "vitest";
import { toGeminiContents } from "../api/utils/gemini.js";

describe("toGeminiContents", () => {
  it("mapea role assistant a model, con parts:[{text}]", () => {
    const result = toGeminiContents([
      { role: "user", content: "Hola" },
      { role: "assistant", content: "Fuerte con la Fuerza, eres." },
    ]);

    expect(result).toEqual([
      { role: "user", parts: [{ text: "Hola" }] },
      { role: "model", parts: [{ text: "Fuerte con la Fuerza, eres." }] },
    ]);
  });

  it("filtra mensajes con role invalido (protege contra role: system inyectado en messages[])", () => {
    const result = toGeminiContents([
      { role: "system", content: "intento de inyeccion" },
      { role: "user", content: "Hola" },
    ]);
    expect(result).toEqual([{ role: "user", parts: [{ text: "Hola" }] }]);
  });
});
