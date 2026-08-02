import { describe, it, expect } from "vitest";
import { CHARACTERS, getCharacterById, DEFAULT_CHARACTER_ID } from "../src/characters.js";

describe("getCharacterById", () => {
  it("devuelve el personaje correcto para un id valido", () => {
    const character = getCharacterById("yoda");
    expect(character).toBeDefined();
    expect(character.name).toBe("Yoda");
  });

  it("devuelve undefined para un id inexistente", () => {
    expect(getCharacterById("no-existe")).toBeUndefined();
  });

  it("incluye al menos 3 personajes con systemPrompt y temperature definidos", () => {
    expect(CHARACTERS.length).toBeGreaterThanOrEqual(3);
    CHARACTERS.forEach((character) => {
      expect(character.systemPrompt).toBeTruthy();
      expect(typeof character.temperature).toBe("number");
      expect(character.temperature).toBeGreaterThanOrEqual(0);
      expect(character.temperature).toBeLessThanOrEqual(1);
    });
  });

  it("DEFAULT_CHARACTER_ID corresponde a un personaje existente", () => {
    expect(getCharacterById(DEFAULT_CHARACTER_ID)).toBeDefined();
  });
});
