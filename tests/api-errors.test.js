import { describe, it, expect } from "vitest";
import { getHttpStatus, isRateLimitError } from "../api/utils/errors.js";

describe("getHttpStatus", () => {
  it("returns error.status when it is a number", () => {
    expect(getHttpStatus({ status: 400 })).toBe(400);
  });

  it("returns 500 by default", () => {
    expect(getHttpStatus({})).toBe(500);
    expect(getHttpStatus(new Error("boom"))).toBe(500);
  });
});

describe("isRateLimitError", () => {
  it("detects status 429", () => {
    expect(isRateLimitError({ status: 429 })).toBe(true);
  });

  it("detects 429 inside the message", () => {
    expect(isRateLimitError({ message: "Error 429 from Gemini" })).toBe(true);
  });

  it("detects 'rate limit' in the message regardless of capitalization", () => {
    expect(isRateLimitError({ message: "Rate Limit exceeded" })).toBe(true);
  });

  it("detects 'quota' in the message (typical of Gemini errors)", () => {
    expect(isRateLimitError({ message: "Quota exceeded for this model" })).toBe(true);
  });

  it("returns false for normal errors", () => {
    expect(isRateLimitError({ status: 500, message: "Internal error" })).toBe(false);
  });
});
