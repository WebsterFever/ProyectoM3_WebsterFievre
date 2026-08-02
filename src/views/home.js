import { CHARACTERS } from "../characters.js";
import { getSelectedCharacter, setSelectedCharacter } from "../state.js";
import { hasHistory } from "../storage.js";
import { escapeHTML } from "../utils.js";
import { navigate } from "../router.js";

export function renderHome(container) {
  const current = getSelectedCharacter();

  container.innerHTML = `
    <section class="hero">
      <h1>Chatea con tu personaje favorito</h1>
      <p>Elegi un personaje de la galeria y empeza una conversacion impulsada por inteligencia artificial (Google Gemini).</p>
    </section>

    <section class="gallery" aria-label="Galeria de personajes">
      ${CHARACTERS.map((character) => characterCardHTML(character, character.id === current.id)).join("")}
    </section>

    <section class="hero-cta">
      <p>Vas a chatear con <strong>${escapeHTML(current.name)}</strong>.</p>
      <button id="start-chat-btn" class="btn-primary" type="button">Empezar a chatear</button>
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
      ${hasHistory(character.id) ? '<span class="history-badge">Historial guardado</span>' : ""}
    </article>
  `;
}
