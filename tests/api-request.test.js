import { describe, it, expect } from "vitest";
import { parseJsonBody, getMessages, getGenerationSettings } from "../api/utils/request.js";

describe("parseJsonBody", () => {
  it("parsea un body en formato string", () => {
    expect(parseJsonBody('{"model":"gemini-2.5-flash"}')).toEqual({ model: "gemini-2.5-flash" });
  });

  it("devuelve el body tal cual si ya es un objeto", () => {
    expect(parseJsonBody({ model: "gemini-2.5-flash" })).toEqual({ model: "gemini-2.5-flash" });
  });

  it("devuelve un objeto vacio si el body es undefined o string vacio", () => {
    expect(parseJsonBody(undefined)).toEqual({});
    expect(parseJsonBody("")).toEqual({});
  });
});

describe("getMessages", () => {
  it("devuelve messages[] si esta presente y no vacio", () => {
    const messages = [{ role: "user", content: "Hola" }];
    expect(getMessages({ messages })).toBe(messages);
  });

  it("lanza un error con status 400 si no hay mensajes", () => {
    expect(() => getMessages({ messages: [] })).toThrow();
    try {
      getMessages({});
    } catch (error) {
      expect(error.status).toBe(400);
    }
  });
});

describe("getGenerationSettings", () => {
  it("usa los valores del payload cuando estan presentes", () => {
    const settings = getGenerationSettings({
      system: "Sos Yoda",
      model: "gpt-4o",
      temperature: 0.6,
      max_tokens: 150,
    });
    expect(settings).toEqual({
      system: "Sos Yoda",
      modelName: "gpt-4o",
      temperature: 0.6,
      maxTokens: 150,
    });
  });

  it("aplica defaults razonables si el payload viene incompleto", () => {
    expect(getGenerationSettings({})).toEqual({
      system: "",
      modelName: "gemini-2.5-flash",
      temperature: 0.7,
      maxTokens: 200,
    });
  });
});
