import { describe, it, expect } from "vitest";
import { CHARACTERS, getCharacterById, DEFAULT_CHARACTER_ID } from "../src/characters.js";

describe("getCharacterById", () => {
  it("returns the correct character for a valid id", () => {
    const character = getCharacterById("yoda");
    expect(character).toBeDefined();
    expect(character.name).toBe("Yoda");
  });

  it("returns undefined for a nonexistent id", () => {
    expect(getCharacterById("no-existe")).toBeUndefined();
  });

  it("includes at least 3 characters with defined systemPrompt and temperature values", () => {
    expect(CHARACTERS.length).toBeGreaterThanOrEqual(3);
    CHARACTERS.forEach((character) => {
      expect(character.systemPrompt).toBeTruthy();
      expect(typeof character.temperature).toBe("number");
      expect(character.temperature).toBeGreaterThanOrEqual(0);
      expect(character.temperature).toBeLessThanOrEqual(1);
    });
  });

  it("DEFAULT_CHARACTER_ID corresponds to an existing character", () => {
    expect(getCharacterById(DEFAULT_CHARACTER_ID)).toBeDefined();
  });
});
