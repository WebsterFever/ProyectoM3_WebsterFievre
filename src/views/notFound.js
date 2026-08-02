export function renderNotFound(container) {
  container.innerHTML = `
    <section class="not-found">
      <h1>404</h1>
      <p>La pagina que buscas no existe.</p>
      <a href="/home" data-link class="btn-primary">Volver al inicio</a>
    </section>
  `;
}
