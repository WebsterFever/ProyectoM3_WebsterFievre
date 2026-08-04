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
    <div class="nav-right">
      <button id="theme-toggle" class="theme-toggle" aria-label="Cambiar tema" type="button">${themeIcon}</button>
      <button id="nav-toggle" class="nav-toggle" aria-label="Abrir menu" aria-expanded="false" type="button">
        <span></span><span></span><span></span>
      </button>
    </div>
    <div class="nav-links" id="nav-links">
      ${links
        .map(
          (link) =>
            `<a href="${link.path}" data-link data-path="${link.path}">${link.label}</a>`
        )
        .join("")}
    </div>
  `;

  nav.querySelector("#theme-toggle").addEventListener("click", () => {
    const next = toggleTheme();
    nav.querySelector("#theme-toggle").textContent = next === "dark" ? "☀️" : "🌙";
  });

  const navToggle = nav.querySelector("#nav-toggle");
  const navLinks = nav.querySelector("#nav-links");

  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

export function updateActiveLink(currentPath) {
  const nav = document.getElementById("navigation");
  nav.querySelectorAll("a[data-path]").forEach((a) => {
    a.classList.toggle("active", a.dataset.path === currentPath);
  });
}
