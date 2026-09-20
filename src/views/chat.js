import { getSelectedCharacter } from "../state.js";
import { loadHistory, saveHistory, clearHistory } from "../storage.js";
import { createMessage, formatTimestamp, escapeHTML, buildChatMessages } from "../utils.js";
import { buildPayload, isValidPayload } from "../engine/payload.js";
import { getTrimmedHistory } from "../engine/history.js";
import { callAI } from "../engine/aiClient.js";
import { normalizeAIResponse } from "../engine/normalizer.js";

export function renderChat(container) {
  const character = getSelectedCharacter();
  let messages = loadHistory(character.id);
  let isTyping = false;

  container.innerHTML = `
    <section class="chat-view" style="--accent:${character.color}">
      <header class="chat-header">
        <div class="chat-character">
          <span class="character-avatar">${character.avatar}</span>
          <div>
            <h2>${escapeHTML(character.name)}</h2>
            <p>${escapeHTML(character.tagline)}</p>
          </div>
        </div>
        <button id="clear-history-btn" class="btn-secondary" type="button">Clear history</button>
      </header>

      <div id="messages" class="messages" aria-live="polite"></div>

      <div id="typing-indicator" class="typing-indicator hidden">
        <span class="dot"></span><span class="dot"></span><span class="dot"></span>
        <span class="typing-label">${escapeHTML(character.name)} is typing...</span>
      </div>

      <p id="error-banner" class="error-banner hidden" role="alert"></p>

      <form id="chat-form" class="chat-form">
        <textarea
          id="chat-input"
          class="chat-input"
          placeholder="Type your message..."
          rows="1"
          required
        ></textarea>
        <button type="submit" id="send-btn" class="btn-primary">Send</button>
      </form>
    </section>
  `;

  const messagesEl = container.querySelector("#messages");
  const form = container.querySelector("#chat-form");
  const input = container.querySelector("#chat-input");
  const typingEl = container.querySelector("#typing-indicator");
  const errorEl = container.querySelector("#error-banner");
  const clearBtn = container.querySelector("#clear-history-btn");

  function updateClearButton() {
    clearBtn.disabled = messages.length === 0;
  }

  function renderMessages() {
    messagesEl.innerHTML = messages.map(messageHTML).join("");
    messagesEl.querySelectorAll("[data-copy-index]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const message = messages[Number(btn.dataset.copyIndex)];
        navigator.clipboard?.writeText(message.text).then(() => {
          const original = btn.textContent;
          btn.textContent = "Copied ✓";
          setTimeout(() => (btn.textContent = original), 1200);
        });
      });
    });
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function messageHTML(message, index) {
    const isUser = message.role === "user";
    return `
      <div class="message ${isUser ? "message-user" : "message-character"}">
        <div class="message-bubble">
          <p>${escapeHTML(message.text)}</p>
          <div class="message-meta">
            <span class="message-time">${formatTimestamp(message.timestamp)}</span>
            ${!isUser ? `<button class="copy-btn" data-copy-index="${index}" type="button">Copy</button>` : ""}
          </div>
        </div>
      </div>
    `;
  }

  function setTyping(value) {
    isTyping = value;
    typingEl.classList.toggle("hidden", !value);
    input.disabled = value;
    form.querySelector("#send-btn").disabled = value;
  }

  function showError(message) {
    errorEl.textContent = message;
    errorEl.classList.remove("hidden");
  }

  function hideError() {
    errorEl.classList.add("hidden");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const text = input.value.trim();
    if (!text || isTyping) return;

    hideError();
    const userMessage = createMessage("user", text);
    messages.push(userMessage);
    saveHistory(character.id, messages);
    renderMessages();
    updateClearButton();
    input.value = "";
    input.style.height = "auto";

    setTyping(true);
    try {
      const trimmedHistory = getTrimmedHistory(buildChatMessages(messages), 10);
      const payload = buildPayload(character, trimmedHistory);

      if (!isValidPayload(payload)) {
        throw new Error("Invalid payload. Check the submitted history.");
      }

      const raw = await callAI(payload);
      const { text, truncated } = normalizeAIResponse(raw);

      const characterMessage = createMessage("model", text || "I did not receive any text in the response.");
      messages.push(characterMessage);
      saveHistory(character.id, messages);
      renderMessages();

      if (truncated) {
        showError("The response was cut off due to the token limit.");
      }
    } catch (error) {
      if (error.status === 429) {
        showError("The AI request limit was reached. Wait a few seconds and try again.");
      } else {
        showError("Could not get a response from the AI. Please try again.");
      }
    } finally {
      setTyping(false);
      updateClearButton();
      input.focus();
    }
  }

  form.addEventListener("submit", handleSubmit);

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      form.requestSubmit();
    }
  });

  input.addEventListener("input", () => {
    input.style.height = "auto";
    input.style.height = `${input.scrollHeight}px`;
  });

  clearBtn.addEventListener("click", () => {
    clearHistory(character.id);
    messages = [];
    renderMessages();
    updateClearButton();
  });

  updateClearButton();
  renderMessages();
}
