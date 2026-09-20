import { CHARACTERS } from "../characters.js";
import { escapeHTML } from "../utils.js";

export function renderAbout(container) {
  container.innerHTML = `
    <section class="about-view">
      <h1>About the project</h1>
      <p>
        <strong>Chat with Your Favorite Character</strong> is a Single Page Application
        developed as Integrative Project 3. It lets users have conversations with
        fictional characters using Google Gemini AI, with a secure backend implemented
        through Vercel Serverless Functions so the API key is never exposed in the
        browser.
      </p>

      <h2>Available characters</h2>
      <ul class="about-character-list">
        ${CHARACTERS.map(
          (c) => `
          <li>
            <span class="character-avatar">${c.avatar}</span>
            <div>
              <strong>${escapeHTML(c.name)}</strong>
              <p>${escapeHTML(c.tagline)}</p>
            </div>
          </li>
        `
        ).join("")}
      </ul>

      <h2>Technologies used</h2>
      <ul>
        <li>HTML, CSS, and vanilla JavaScript (ES Modules)</li>
        <li>SPA routing with the History API</li>
        <li>Google Gemini AI (via @google/generative-ai)</li>
        <li>Vercel Serverless Functions</li>
        <li>Vitest for unit tests</li>
        <li>localStorage to persist conversation history</li>
      </ul>

      <h2>Notes</h2>
      <p>
        Each character's conversation history is stored in the browser. You can delete it
        at any time from the Chat view.
      </p>
    </section>
  `;
}
