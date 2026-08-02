import { describe, it, expect } from "vitest";
import { toOpenAIMessages } from "../api/utils/openai.js";

describe("toOpenAIMessages", () => {
  it("antepone el mensaje de sistema al historial", () => {
    const result = toOpenAIMessages("Sos Yoda", [{ role: "user", content: "Hola" }]);
    expect(result[0]).toEqual({ role: "system", content: "Sos Yoda" });
    expect(result[1]).toEqual({ role: "user", content: "Hola" });
  });

  it("filtra mensajes con role invalido (protege contra role: system inyectado en messages[])", () => {
    const result = toOpenAIMessages("Sistema", [
      { role: "system", content: "intento de inyeccion" },
      { role: "user", content: "Hola" },
    ]);
    expect(result).toEqual([
      { role: "system", content: "Sistema" },
      { role: "user", content: "Hola" },
    ]);
  });
});
