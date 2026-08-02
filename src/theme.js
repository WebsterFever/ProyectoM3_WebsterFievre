const THEME_KEY = "pim3_theme";

export function loadTheme() {
  return localStorage.getItem(THEME_KEY) || "dark";
}

export function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
}

export function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

export function toggleTheme() {
  const next = loadTheme() === "dark" ? "light" : "dark";
  saveTheme(next);
  applyTheme(next);
  return next;
}
