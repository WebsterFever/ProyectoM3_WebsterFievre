const ESCAPE_MAP = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function escapeHTML(text) {
  return String(text).replace(/[&<>"']/g, (char) => ESCAPE_MAP[char]);
}

export function createMessage(role, text) {
  return {
    id:
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    role,
    text,
    timestamp: Date.now(),
  };
}

export function formatTimestamp(timestamp) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function buildChatMessages(messages) {
  return messages.map((message) => ({
    role: message.role === "user" ? "user" : "assistant",
    content: message.text,
  }));
}

export function normalizeReply(text) {
  if (typeof text !== "string" || !text.trim()) {
    throw new Error("Respuesta vacia de la IA");
  }
  return text.trim();
}
