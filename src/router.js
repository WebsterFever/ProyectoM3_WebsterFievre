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

export function resolveView(pathname) {
  return routes[pathname] || renderNotFound;
}

function render(pathname) {
  const app = document.getElementById("app");
  const view = resolveView(pathname);

  app.innerHTML = "";
  view(app);
  updateActiveLink(pathname === "/" ? "/home" : pathname);
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
