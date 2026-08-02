import { initRouter } from "./router.js";
import { renderNavigation } from "./navigation.js";
import { loadTheme, applyTheme } from "./theme.js";

applyTheme(loadTheme());
renderNavigation();
initRouter();
