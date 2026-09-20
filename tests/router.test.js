import { describe, it, expect } from "vitest";
import { resolveView, normalizePath } from "../src/router.js";
import { renderHome } from "../src/views/home.js";
import { renderChat } from "../src/views/chat.js";
import { renderAbout } from "../src/views/about.js";
import { renderNotFound } from "../src/views/notFound.js";

describe("resolveView", () => {
  it("resolves /home to renderHome", () => {
    expect(resolveView("/home")).toBe(renderHome);
  });

  it("resolves /chat to renderChat", () => {
    expect(resolveView("/chat")).toBe(renderChat);
  });

  it("resolves /about to renderAbout", () => {
    expect(resolveView("/about")).toBe(renderAbout);
  });

  it("resolves an unknown route to renderNotFound", () => {
    expect(resolveView("/ruta-inexistente")).toBe(renderNotFound);
  });

  it("resolves /chat/ (with a trailing slash) to renderChat", () => {
    expect(resolveView("/chat/")).toBe(renderChat);
  });
});

describe("normalizePath", () => {
  it("removes the trailing slash from routes longer than one character", () => {
    expect(normalizePath("/chat/")).toBe("/chat");
  });

  it("leaves the root '/' unchanged", () => {
    expect(normalizePath("/")).toBe("/");
  });

  it("leaves a route without a trailing slash unchanged", () => {
    expect(normalizePath("/about")).toBe("/about");
  });
});
