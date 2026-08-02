import { describe, it, expect } from "vitest";
import { buildPayload, isValidPayload, createSystemPrompt } from "../src/engine/payload.js";
import { getCharacterById } from "../src/characters.js";

const yoda = getCharacterById("yoda");

describe("createSystemPrompt", () => {
  it("devuelve el systemPrompt del personaje", () => {
    expect(createSystemPrompt(yoda)).toBe(yoda.systemPrompt);
  });
});

describe("buildPayload", () => {
  it("arma un payload con model, system, messages, max_tokens y temperature", () => {
    const messages = [{ role: "user", content: "Hola" }];
    const payload = buildPayload(yoda, messages);

    expect(typeof payload.model).toBe("string");
    expect(payload.system).toBe(yoda.systemPrompt);
    expect(payload.messages).toBe(messages);
    expect(typeof payload.max_tokens).toBe("number");
    expect(payload.temperature).toBe(yoda.temperature);
  });

  it("usa 0.7 de temperature si el personaje no define una", () => {
    const payload = buildPayload({ systemPrompt: "test" }, []);
    expect(payload.temperature).toBe(0.7);
  });
});

describe("isValidPayload", () => {
  it("acepta un payload bien formado", () => {
    const payload = buildPayload(yoda, [{ role: "user", content: "Hola" }]);
    expect(isValidPayload(payload)).toBe(true);
  });

  it("rechaza un payload sin messages[]", () => {
    expect(isValidPayload({ model: "gemini-2.5-flash", system: "x" })).toBe(false);
  });

  it("rechaza un mensaje con role invalido (detecta el bug de role: system en messages[])", () => {
    const payload = buildPayload(yoda, [{ role: "system", content: "Hola" }]);
    expect(isValidPayload(payload)).toBe(false);
  });
});
