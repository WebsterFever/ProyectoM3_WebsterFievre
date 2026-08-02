import { CHARACTERS } from "../characters.js";
import { escapeHTML } from "../utils.js";

export function renderAbout(container) {
  container.innerHTML = `
    <section class="about-view">
      <h1>Sobre el proyecto</h1>
      <p>
        <strong>Chatea con tu personaje favorito</strong> es una Single Page Application
        desarrollada como Proyecto Integrador 3. Permite mantener conversaciones con
        personajes ficticios usando Google Gemini AI, con un backend seguro implementado
        mediante Vercel Serverless Functions para que la API key nunca quede expuesta en
        el navegador.
      </p>

      <h2>Personajes disponibles</h2>
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

      <h2>Tecnologias utilizadas</h2>
      <ul>
        <li>HTML, CSS y JavaScript vanilla (ES Modules)</li>
        <li>Routing SPA con History API</li>
        <li>Google Gemini AI (via @google/generative-ai)</li>
        <li>Vercel Serverless Functions</li>
        <li>Vitest para tests unitarios</li>
        <li>localStorage para persistir el historial de conversacion</li>
      </ul>

      <h2>Notas</h2>
      <p>
        El historial de cada personaje se guarda en el navegador. Podes borrarlo en
        cualquier momento desde la vista de Chat.
      </p>
    </section>
  `;
}
