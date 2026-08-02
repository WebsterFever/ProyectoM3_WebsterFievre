import { describe, it, expect } from "vitest";
import {
  escapeHTML,
  createMessage,
  formatTimestamp,
  buildChatMessages,
  normalizeReply,
} from "../src/utils.js";

describe("escapeHTML", () => {
  it("escapa caracteres HTML peligrosos", () => {
    expect(escapeHTML('<script>alert("hi")</script>')).toBe(
      "&lt;script&gt;alert(&quot;hi&quot;)&lt;/script&gt;"
    );
  });

  it("deja intacto un texto sin caracteres especiales", () => {
    expect(escapeHTML("Hola, como estas?")).toBe("Hola, como estas?");
  });
});

describe("createMessage", () => {
  it("crea un mensaje con role, text, id y timestamp", () => {
    const message = createMessage("user", "Hola");
    expect(message.role).toBe("user");
    expect(message.text).toBe("Hola");
    expect(message.id).toBeDefined();
    expect(typeof message.timestamp).toBe("number");
  });
});

describe("formatTimestamp", () => {
  it("devuelve una hora en formato HH:MM", () => {
    const timestamp = new Date("2026-01-01T14:05:00").getTime();
    expect(formatTimestamp(timestamp)).toMatch(/^\d{1,2}:\d{2}/);
  });
});

describe("buildChatMessages", () => {
  it("mapea mensajes de usuario y personaje al formato { role, content } del engine", () => {
    const messages = [
      { role: "user", text: "Hola" },
      { role: "model", text: "Fuerte con la Fuerza, eres" },
    ];
    expect(buildChatMessages(messages)).toEqual([
      { role: "user", content: "Hola" },
      { role: "assistant", content: "Fuerte con la Fuerza, eres" },
    ]);
  });

  it("devuelve un arreglo vacio si no hay mensajes", () => {
    expect(buildChatMessages([])).toEqual([]);
  });
});

describe("normalizeReply", () => {
  it("recorta espacios de la respuesta de la IA", () => {
    expect(normalizeReply("  Hola, joven padawan.  ")).toBe("Hola, joven padawan.");
  });

  it("lanza un error si la respuesta esta vacia", () => {
    expect(() => normalizeReply("   ")).toThrow();
  });
});
