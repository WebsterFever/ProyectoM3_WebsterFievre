import { describe, it, expect } from "vitest";
import { getTrimmedHistory } from "../src/engine/history.js";

describe("getTrimmedHistory", () => {
  it("devuelve todo el historial si es menor al limite", () => {
    const messages = [{ role: "user", content: "a" }, { role: "assistant", content: "b" }];
    expect(getTrimmedHistory(messages, 10)).toEqual(messages);
  });

  it("recorta al limite de turnos, quedandose con los mas recientes", () => {
    const messages = Array.from({ length: 15 }, (_, i) => ({ role: "user", content: `msg-${i}` }));
    const trimmed = getTrimmedHistory(messages, 10);
    expect(trimmed).toHaveLength(10);
    expect(trimmed[0].content).toBe("msg-5");
    expect(trimmed[9].content).toBe("msg-14");
  });

  it("usa 10 como limite por defecto", () => {
    const messages = Array.from({ length: 12 }, (_, i) => ({ role: "user", content: `${i}` }));
    expect(getTrimmedHistory(messages)).toHaveLength(10);
  });
});
