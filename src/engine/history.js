/*
 * history.js — Recorte del historial que se manda a la IA
 *
 * El historial completo se persiste en localStorage (ver storage.js) para
 * que el usuario lo vea entero en pantalla. Pero mandarlo entero a la IA en
 * cada request encarece tokens y puede acercarse a limites de la API.
 * getTrimmedHistory() se aplica solo al armar el payload, nunca al historial
 * que se muestra o se guarda.
 */
export function getTrimmedHistory(messages, maxTurns = 10) {
  return messages.slice(-maxTurns);
}
