import { CHARACTERS, DEFAULT_CHARACTER_ID, getCharacterById } from "./characters.js";
import { loadSelectedCharacter, saveSelectedCharacter } from "./storage.js";

let selectedCharacterId = loadSelectedCharacter() || DEFAULT_CHARACTER_ID;

export function getSelectedCharacter() {
  return getCharacterById(selectedCharacterId) || CHARACTERS[0];
}

export function setSelectedCharacter(characterId) {
  if (!getCharacterById(characterId)) return;
  selectedCharacterId = characterId;
  saveSelectedCharacter(characterId);
}
