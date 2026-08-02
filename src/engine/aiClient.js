/*
 * aiClient.js — Cliente frontend hacia la Serverless Function
 *
 * El unico contacto con la red. La API key nunca aparece en este archivo:
 * vive solo del lado del servidor (api/chat.js).
 */
export async function callAI(payload) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error("El servidor no devolvio una respuesta valida.");
  }

  if (!response.ok) {
    const err = new Error(data.error || `HTTP ${response.status}`);
    err.status = response.status;
    err.retryAfterSeconds = data.retryAfterSeconds;
    throw err;
  }

  return data;
}
