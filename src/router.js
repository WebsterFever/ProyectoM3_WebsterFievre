import { renderHome } from "./views/home.js";
import { renderChat } from "./views/chat.js";
import { renderAbout } from "./views/about.js";
import { renderNotFound } from "./views/notFound.js";
import { updateActiveLink } from "./navigation.js";

const routes = {
  "/": renderHome,
  "/home": renderHome,
  "/chat": renderChat,
  "/about": renderAbout,
};

export function normalizePath(path) {
  return path.length > 1 ? path.replace(/\/$/, "") : path;
}

export function resolveView(pathname) {
  return routes[normalizePath(pathname)] || renderNotFound;
}

function render(pathname) {
  const app = document.getElementById("app");
  const path = normalizePath(pathname);
  const view = resolveView(path);

  app.innerHTML = "";
  view(app);
  updateActiveLink(path === "/" ? "/home" : path);
  window.scrollTo(0, 0);
}

export function navigate(path) {
  if (window.location.pathname !== path) {
    window.history.pushState({}, "", path);
  }
  render(path);
}

function handleLinkClick(event) {
  const link = event.target.closest("a[data-link]");
  if (!link) return;

  event.preventDefault();
  navigate(link.getAttribute("href"));
}

export function initRouter() {
  document.addEventListener("click", handleLinkClick);
  window.addEventListener("popstate", () => render(window.location.pathname));
  render(window.location.pathname);
}
