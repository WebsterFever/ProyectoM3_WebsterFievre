import { describe, it, expect, beforeEach } from "vitest";
import { loadHistory, saveHistory, clearHistory, hasHistory } from "../src/storage.js";

const characterId = "yoda-test";

describe("storage (localStorage)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("devuelve un arreglo vacio si no hay historial guardado", () => {
    expect(loadHistory(characterId)).toEqual([]);
    expect(hasHistory(characterId)).toBe(false);
  });

  it("guarda y recupera el historial de un personaje", () => {
    const messages = [{ role: "user", text: "Hola" }];
    saveHistory(characterId, messages);
    expect(loadHistory(characterId)).toEqual(messages);
    expect(hasHistory(characterId)).toBe(true);
  });

  it("borra el historial de un personaje", () => {
    saveHistory(characterId, [{ role: "user", text: "Hola" }]);
    clearHistory(characterId);
    expect(loadHistory(characterId)).toEqual([]);
    expect(hasHistory(characterId)).toBe(false);
  });
});
