/*
 * history.js — Trimming the history sent to the AI
 *
 * The full history is persisted in localStorage (see storage.js) so
 * the user can see all of it on screen. But sending all of it to the AI on
 * every request increases token usage and may approach API limits.
 * getTrimmedHistory() is applied only when building the payload, never to the history
 * that is displayed or saved.
 */
export function getTrimmedHistory(messages, maxTurns = 10) {
  return messages.slice(-maxTurns);
}
