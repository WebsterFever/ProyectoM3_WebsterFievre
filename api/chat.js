/*
 * api/chat.js — Vercel Serverless Function para el chat
 *
 * Responsabilidad:
 * - Recibir el payload generico armado por src/engine/payload.js.
 * - Leer GEMINI_API_KEY desde process.env (nunca llega al navegador).
 * - Adaptar el payload interno a Gemini (api/utils/gemini.js).
 * - Devolver un shape compatible con src/engine/normalizer.js: content[].
 *
 * Esta funcion no conoce personajes: el system prompt y la temperature ya
 * vienen resueltos en el payload que manda el cliente.
 */
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getHttpStatus, isRateLimitError } from "./utils/errors.js";
import { toGeminiContents } from "./utils/gemini.js";
import { parseJsonBody, getMessages, getGenerationSettings } from "./utils/request.js";
import { createChatResponse } from "./utils/response.js";
import { normalizeReply } from "../src/utils.js";

const apiKey = process.env.GEMINI_API_KEY;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metodo no permitido." });
  }

  try {
    const payload = parseJsonBody(req.body);

    if (!apiKey) {
      return res.status(500).json({ error: "Falta configurar GEMINI_API_KEY en el servidor." });
    }

    const messages = getMessages(payload);
    const { system, modelName, temperature, maxTokens } = getGenerationSettings(payload);

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || modelName,
      systemInstruction: system,
    });

    const contents = toGeminiContents(messages);

    const result = await model.generateContent({
      contents,
      generationConfig: {
        temperature,
        maxOutputTokens: maxTokens,
      },
    });

    const text = normalizeReply(result.response.text());

    return res.status(200).json(createChatResponse({ text, payload }));
  } catch (error) {
    console.error("[/api/chat] Error:", error);

    if (isRateLimitError(error)) {
      return res.status(429).json({
        error: "Rate limit de Gemini. Reintenta en unos segundos.",
        retryAfterSeconds: 8,
      });
    }

    return res.status(getHttpStatus(error)).json({
      error: error.message || "No se pudo obtener respuesta de la IA.",
    });
  }
}
