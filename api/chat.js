/*
 * api/chat.js — Vercel Serverless Function for chat
 *
 * Responsibilities:
 * - Receive the generic payload built by src/engine/payload.js.
 * - Read GEMINI_API_KEY from process.env (it never reaches the browser).
 * - Adapt the internal payload to Gemini (api/utils/gemini.js).
 * - Return a shape compatible with src/engine/normalizer.js: content[].
 *
 * This function does not know about characters: the system prompt and temperature are already
 * resolved in the payload sent by the client.
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
    return res.status(405).json({ error: "Method not allowed." });
  }

  try {
    const payload = parseJsonBody(req.body);

    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
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
        error: "Gemini rate limit reached. Try again in a few seconds.",
        retryAfterSeconds: 8,
      });
    }

    return res.status(getHttpStatus(error)).json({
      error: error.message || "Could not get a response from the AI.",
    });
  }
}
