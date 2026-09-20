export function renderNotFound(container) {
  container.innerHTML = `
    <section class="not-found">
      <h1>404</h1>
      <p>The page you are looking for does not exist.</p>
      <a href="/home" data-link class="btn-primary">Back to home</a>
    </section>
  `;
}
