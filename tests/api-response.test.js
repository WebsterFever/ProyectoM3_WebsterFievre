import { describe, it, expect } from "vitest";
import { createChatResponse } from "../api/utils/response.js";

describe("createChatResponse", () => {
  it("envuelve el texto en el shape content[] con stop_reason y usage", () => {
    const response = createChatResponse({ text: "Hola, joven padawan.", payload: { model: "gemini-2.5-flash" } });

    expect(response.role).toBe("assistant");
    expect(response.content).toEqual([{ type: "text", text: "Hola, joven padawan." }]);
    expect(response.stop_reason).toBe("end_turn");
    expect(response.usage.input_tokens).toBeGreaterThan(0);
    expect(response.usage.output_tokens).toBeGreaterThan(0);
  });
});
