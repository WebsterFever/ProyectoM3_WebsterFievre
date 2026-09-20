import { describe, it, expect } from "vitest";
import { buildPayload, isValidPayload, createSystemPrompt } from "../src/engine/payload.js";
import { getCharacterById } from "../src/characters.js";

const yoda = getCharacterById("yoda");

describe("createSystemPrompt", () => {
  it("returns the character's systemPrompt", () => {
    expect(createSystemPrompt(yoda)).toBe(yoda.systemPrompt);
  });
});

describe("buildPayload", () => {
  it("builds a payload with model, system, messages, max_tokens, and temperature", () => {
    const messages = [{ role: "user", content: "Hello" }];
    const payload = buildPayload(yoda, messages);

    expect(typeof payload.model).toBe("string");
    expect(payload.system).toBe(yoda.systemPrompt);
    expect(payload.messages).toBe(messages);
    expect(typeof payload.max_tokens).toBe("number");
    expect(payload.temperature).toBe(yoda.temperature);
  });

  it("uses a temperature of 0.7 if the character does not define one", () => {
    const payload = buildPayload({ systemPrompt: "test" }, []);
    expect(payload.temperature).toBe(0.7);
  });
});

describe("isValidPayload", () => {
  it("accepts a well-formed payload", () => {
    const payload = buildPayload(yoda, [{ role: "user", content: "Hello" }]);
    expect(isValidPayload(payload)).toBe(true);
  });

  it("rejects a payload without messages[]", () => {
    expect(isValidPayload({ model: "gemini-2.5-flash", system: "x" })).toBe(false);
  });

  it("rejects a message with an invalid role (detects the role: system bug in messages[])", () => {
    const payload = buildPayload(yoda, [{ role: "system", content: "Hello" }]);
    expect(isValidPayload(payload)).toBe(false);
  });
});
