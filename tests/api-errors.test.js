import { describe, it, expect } from "vitest";
import { getHttpStatus, isRateLimitError } from "../api/utils/errors.js";

describe("getHttpStatus", () => {
  it("devuelve error.status si es un numero", () => {
    expect(getHttpStatus({ status: 400 })).toBe(400);
  });

  it("devuelve 500 por defecto", () => {
    expect(getHttpStatus({})).toBe(500);
    expect(getHttpStatus(new Error("boom"))).toBe(500);
  });
});

describe("isRateLimitError", () => {
  it("detecta status 429", () => {
    expect(isRateLimitError({ status: 429 })).toBe(true);
  });

  it("detecta 429 dentro del mensaje", () => {
    expect(isRateLimitError({ message: "Error 429 from Gemini" })).toBe(true);
  });

  it("detecta 'rate limit' en el mensaje sin importar mayusculas", () => {
    expect(isRateLimitError({ message: "Rate Limit exceeded" })).toBe(true);
  });

  it("detecta 'quota' en el mensaje (tipico de errores de Gemini)", () => {
    expect(isRateLimitError({ message: "Quota exceeded for this model" })).toBe(true);
  });

  it("devuelve false para errores normales", () => {
    expect(isRateLimitError({ status: 500, message: "Internal error" })).toBe(false);
  });
});
