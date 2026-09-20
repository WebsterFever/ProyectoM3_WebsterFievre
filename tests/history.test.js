import { describe, it, expect } from "vitest";
import { getTrimmedHistory } from "../src/engine/history.js";

describe("getTrimmedHistory", () => {
  it("returns the full history if it is below the limit", () => {
    const messages = [{ role: "user", content: "a" }, { role: "assistant", content: "b" }];
    expect(getTrimmedHistory(messages, 10)).toEqual(messages);
  });

  it("trims to the turn limit, keeping the most recent messages", () => {
    const messages = Array.from({ length: 15 }, (_, i) => ({ role: "user", content: `msg-${i}` }));
    const trimmed = getTrimmedHistory(messages, 10);
    expect(trimmed).toHaveLength(10);
    expect(trimmed[0].content).toBe("msg-5");
    expect(trimmed[9].content).toBe("msg-14");
  });

  it("uses 10 as the default limit", () => {
    const messages = Array.from({ length: 12 }, (_, i) => ({ role: "user", content: `${i}` }));
    expect(getTrimmedHistory(messages)).toHaveLength(10);
  });
});
