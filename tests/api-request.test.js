import { describe, it, expect } from "vitest";
import { parseJsonBody, getMessages, getGenerationSettings } from "../api/utils/request.js";

describe("parseJsonBody", () => {
  it("parses a body in string format", () => {
    expect(parseJsonBody('{"model":"gemini-2.5-flash"}')).toEqual({ model: "gemini-2.5-flash" });
  });

  it("returns the body unchanged if it is already an object", () => {
    expect(parseJsonBody({ model: "gemini-2.5-flash" })).toEqual({ model: "gemini-2.5-flash" });
  });

  it("returns an empty object if the body is undefined or an empty string", () => {
    expect(parseJsonBody(undefined)).toEqual({});
    expect(parseJsonBody("")).toEqual({});
  });
});

describe("getMessages", () => {
  it("returns messages[] if it is present and not empty", () => {
    const messages = [{ role: "user", content: "Hello" }];
    expect(getMessages({ messages })).toBe(messages);
  });

  it("throws an error with status 400 if there are no messages", () => {
    expect(() => getMessages({ messages: [] })).toThrow();
    try {
      getMessages({});
    } catch (error) {
      expect(error.status).toBe(400);
    }
  });
});

describe("getGenerationSettings", () => {
  it("uses payload values when they are present", () => {
    const settings = getGenerationSettings({
      system: "You are Yoda",
      model: "gpt-4o",
      temperature: 0.6,
      max_tokens: 150,
    });
    expect(settings).toEqual({
      system: "You are Yoda",
      modelName: "gpt-4o",
      temperature: 0.6,
      maxTokens: 150,
    });
  });

  it("applies reasonable defaults if the payload is incomplete", () => {
    expect(getGenerationSettings({})).toEqual({
      system: "",
      modelName: "gemini-2.5-flash",
      temperature: 0.7,
      maxTokens: 200,
    });
  });
});
