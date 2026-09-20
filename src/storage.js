const HISTORY_PREFIX = "pim3_chat_history_";
const CHARACTER_KEY = "pim3_selected_character";

function historyKey(characterId) {
  return `${HISTORY_PREFIX}${characterId}`;
}

export function loadHistory(characterId) {
  try {
    const raw = localStorage.getItem(historyKey(characterId));
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error("Could not read saved history", error);
    return [];
  }
}

export function saveHistory(characterId, messages) {
  try {
    localStorage.setItem(historyKey(characterId), JSON.stringify(messages));
  } catch (error) {
    console.error("Could not save history", error);
  }
}

export function clearHistory(characterId) {
  localStorage.removeItem(historyKey(characterId));
}

export function hasHistory(characterId) {
  const raw = localStorage.getItem(historyKey(characterId));
  if (!raw) return false;
  try {
    return JSON.parse(raw).length > 0;
  } catch {
    return false;
  }
}

export function saveSelectedCharacter(characterId) {
  localStorage.setItem(CHARACTER_KEY, characterId);
}

export function loadSelectedCharacter() {
  return localStorage.getItem(CHARACTER_KEY);
}
