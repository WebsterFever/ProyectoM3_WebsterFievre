import { toggleTheme, loadTheme } from "./theme.js";

const links = [
  { path: "/home", label: "Home" },
  { path: "/chat", label: "Chat" },
  { path: "/about", label: "About" },
];

export function renderNavigation() {
  const nav = document.getElementById("navigation");
  const themeIcon = loadTheme() === "dark" ? "☀️" : "🌙";

  nav.innerHTML = `
    <a class="brand" href="/home" data-link data-path="/home">✨ PIM3 Chat</a>
    <div class="nav-links">
      ${links
        .map(
          (link) =>
            `<a href="${link.path}" data-link data-path="${link.path}">${link.label}</a>`
        )
        .join("")}
      <button id="theme-toggle" class="theme-toggle" aria-label="Cambiar tema" type="button">${themeIcon}</button>
    </div>
  `;

  nav.querySelector("#theme-toggle").addEventListener("click", () => {
    const next = toggleTheme();
    nav.querySelector("#theme-toggle").textContent = next === "dark" ? "☀️" : "🌙";
  });
}

export function updateActiveLink(currentPath) {
  const nav = document.getElementById("navigation");
  nav.querySelectorAll("a[data-path]").forEach((a) => {
    a.classList.toggle("active", a.dataset.path === currentPath);
  });
}
