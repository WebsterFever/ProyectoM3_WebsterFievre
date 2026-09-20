/*
 * aiClient.js — Frontend client for the Serverless Function
 *
 * The only network contact point. The API key never appears in this file:
 * it exists only on the server side (api/chat.js).
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
    throw new Error("The server did not return a valid response.");
  }

  if (!response.ok) {
    const err = new Error(data.error || `HTTP ${response.status}`);
    err.status = response.status;
    err.retryAfterSeconds = data.retryAfterSeconds;
    throw err;
  }

  return data;
}
