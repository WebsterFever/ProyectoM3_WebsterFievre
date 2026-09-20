import { CHARACTERS } from "../characters.js";
import { getSelectedCharacter, setSelectedCharacter } from "../state.js";
import { hasHistory } from "../storage.js";
import { escapeHTML } from "../utils.js";
import { navigate } from "../router.js";

export function renderHome(container) {
  const current = getSelectedCharacter();

  container.innerHTML = `
    <section class="hero">
      <h1>Chat with Your Favorite Character</h1>
      <p>Choose a character from the gallery and start an AI-powered conversation using Google Gemini.</p>
    </section>

    <section class="gallery" aria-label="Character gallery">
      ${CHARACTERS.map((character) => characterCardHTML(character, character.id === current.id)).join("")}
    </section>

    <section class="hero-cta">
      <p>You are going to chat with <strong>${escapeHTML(current.name)}</strong>.</p>
      <button id="start-chat-btn" class="btn-primary" type="button">Start chatting</button>
    </section>
  `;

  container.querySelectorAll("[data-character-id]").forEach((card) => {
    card.addEventListener("click", () => {
      setSelectedCharacter(card.dataset.characterId);
      renderHome(container);
    });
  });

  container.querySelector("#start-chat-btn").addEventListener("click", () => {
    navigate("/chat");
  });
}

function characterCardHTML(character, isSelected) {
  return `
    <article
      class="character-card ${isSelected ? "selected" : ""}"
      data-character-id="${character.id}"
      style="--accent:${character.color}"
      role="button"
      tabindex="0"
    >
      <div class="character-avatar">${character.avatar}</div>
      <h3>${escapeHTML(character.name)}</h3>
      <p>${escapeHTML(character.tagline)}</p>
      ${hasHistory(character.id) ? '<span class="history-badge">Saved history</span>' : ""}
    </article>
  `;
}
