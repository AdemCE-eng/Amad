// gemini.js — generates the pet's short Arabic flavor text.
// Voice + safety now live in one shared source (shared/rafiqIdentity.js) so
// the live Gemini turn and the offline fallback speak in the SAME character:
// CHARACTER_BRIEF is the system prompt, promptHintFor() steers each turn, and
// fallbackLine() is the offline net — all keyed off the same context resolver.
import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { CHARACTER_BRIEF, fallbackLine, promptHintFor } from "../../../shared/rafiqIdentity.js";

const USE_MOCK_AI = process.env.USE_MOCK_AI !== "false"; // default: mock
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";
const TIMEOUT_MS = 5000; // flash-lite runs ~1.5-2.5s with the guardrail; leaves margin

// Lazily create the client so a missing key never crashes at import time.
let client = null;
function getModel() {
  if (!client) client = new GoogleGenerativeAI(GEMINI_API_KEY);
  return client.getGenerativeModel({
    model: GEMINI_MODEL,
    systemInstruction: CHARACTER_BRIEF,
  });
}

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error("gemini-timeout")), ms)),
  ]);
}

/**
 * Generate the pet message for an event.
 * @param {object} ctx  the `_aiContext` produced by petEngine (category, event, amount, ...)
 * @returns {Promise<{text: string, source: "gemini"|"mock"|"fallback"}>}
 */
export async function generatePetMessage(ctx = {}) {
  if (USE_MOCK_AI || !GEMINI_API_KEY) {
    return { text: fallbackLine(ctx), source: "mock" };
  }

  try {
    const prompt = promptHintFor(ctx);
    const result = await withTimeout(getModel().generateContent(prompt), TIMEOUT_MS);
    const text = result?.response?.text?.().trim();
    return text ? { text, source: "gemini" } : { text: fallbackLine(ctx), source: "fallback" };
  } catch (err) {
    console.warn(`⚠️  Gemini failed (${err.message}); using fallback.`);
    return { text: fallbackLine(ctx), source: "fallback" };
  }
}

// Re-exported for tests / offline use (character + fallback now come from the
// shared identity module).
export { CHARACTER_BRIEF, fallbackLine };
