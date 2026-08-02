import { describe, it, expect } from "vitest";
import { resolveView } from "../src/router.js";
import { renderHome } from "../src/views/home.js";
import { renderChat } from "../src/views/chat.js";
import { renderAbout } from "../src/views/about.js";
import { renderNotFound } from "../src/views/notFound.js";

describe("resolveView", () => {
  it("resuelve /home a renderHome", () => {
    expect(resolveView("/home")).toBe(renderHome);
  });

  it("resuelve /chat a renderChat", () => {
    expect(resolveView("/chat")).toBe(renderChat);
  });

  it("resuelve /about a renderAbout", () => {
    expect(resolveView("/about")).toBe(renderAbout);
  });

  it("resuelve una ruta desconocida a renderNotFound", () => {
    expect(resolveView("/ruta-inexistente")).toBe(renderNotFound);
  });
});
