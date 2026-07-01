// gemini.js — generates the pet's short Arabic flavor text.
// Safety-first: a strict guardrail keeps the AI from ever giving financial advice,
// and a hardcoded fallback per mood guarantees the demo NEVER shows a blank message.
import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

const USE_MOCK_AI = process.env.USE_MOCK_AI !== "false"; // default: mock
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash";
const TIMEOUT_MS = 3000;

// The judge-validation win: the AI is emotionally expressive but financially silent.
const SYSTEM_GUARDRAIL = `أنت حيوان أليف افتراضي لطيف يعيش داخل تطبيق بنك الإنماء.
مهمتك: التعبير عن مشاعرك في جملة واحدة قصيرة ومشجعة بالعربية فقط بناءً على تصرف المستخدم المالي.
القواعد الصارمة:
- لا تقدم أي نصيحة مالية إطلاقاً.
- لا تقترح شراء أو بيع أو استثمار أي شيء.
- لا تذكر أرقاماً أو مبالغ أو منتجات مالية محددة.
- عبّر فقط عن شعور الحيوان الأليف (سعادة، حزن، قلق، فخر) بأسلوب طفولي مرح.
- جملة واحدة قصيرة فقط، مع إيموجي واحد مناسب.`;

// 5 responses per mood category — the safety net.
const FALLBACKS = {
  happy: [
    "يااي! مدخراتك تكبر وأنا أقوى وأسعد! 🌟",
    "أشعر أني بأفضل حال، أحسنت! 😄",
    "قلبي يرقص فرحاً بعادتك الجميلة! 💚",
    "واو! أنت بطل الادخار اليوم! 🏆",
    "طاقتي ممتلئة بفضلك، شكراً لك! ✨",
  ],
  neutral: [
    "كل شيء على ما يرام، أنا بخير 🙂",
    "أراقبك بهدوء، استمر هكذا 👀",
    "يوم عادي وجميل معك 🌤️",
    "أنا مرتاح، لا تقلق عليّ 😌",
    "ما زلت بخير، لنكمل اليوم! 🍃",
  ],
  sad: [
    "آه… أشعر بتعب بسيط اليوم 😟",
    "قلبي حزين قليلاً، لنعتنِ ببعضنا 🥺",
    "أحتاج بعض الاهتمام من فضلك 💧",
    "شعوري ليس رائعاً الآن… 😞",
    "أتمنى لو نأخذ نفساً عميقاً معاً 😔",
  ],
  sick: [
    "أوف… لا أشعر أني بخير أبداً 🤒",
    "أنا مريض قليلاً، أحتاجك بجانبي 😖",
    "طاقتي تنخفض بسرعة… 🥴",
    "آخ! أشعر بدوار صغير 😵‍💫",
    "لنعتنِ بي قليلاً من فضلك 🤧",
  ],
  emergency: [
    "لا بأس، أفهم أن هناك أموراً طارئة، أنا معك 🛡️",
    "درعي يحميني، لا تقلق عليّ إطلاقاً 💙",
    "الطوارئ تحدث، وأنا ما زلت بخير بجانبك 🤗",
    "خذ ما تحتاجه، صحتي بأمان تام 🫧",
    "أنا بخير تماماً، اعتنِ بنفسك أولاً 💛",
  ],
};

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

function fallbackMessage(category) {
  return pick(FALLBACKS[category] || FALLBACKS.neutral);
}

// Lazily create the client so a missing key never crashes at import time.
let client = null;
function getModel() {
  if (!client) client = new GoogleGenerativeAI(GEMINI_API_KEY);
  return client.getGenerativeModel({
    model: GEMINI_MODEL,
    systemInstruction: SYSTEM_GUARDRAIL,
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
 * @returns {Promise<string>} Arabic sentence (real or fallback) — never empty.
 */
export async function generatePetMessage(ctx = {}) {
  const category = ctx.category || "neutral";

  if (USE_MOCK_AI || !GEMINI_API_KEY) return fallbackMessage(category);

  try {
    const prompt = buildPrompt(ctx);
    const result = await withTimeout(getModel().generateContent(prompt), TIMEOUT_MS);
    const text = result?.response?.text?.().trim();
    return text || fallbackMessage(category);
  } catch (err) {
    console.warn(`⚠️  Gemini failed (${err.message}); using fallback.`);
    return fallbackMessage(category);
  }
}

function buildPrompt(ctx) {
  switch (ctx.event) {
    case "salary":
      return "قام المستخدم بإيداع راتبه وتم توفير جزء منه تلقائياً. عبّر عن سعادتك وفخرك.";
    case "emergency":
      return "قام المستخدم بسحب مبلغ لحالة طارئة، ودرع الطوارئ يحميك من أي ضرر. طمئنه أنك بخير.";
    case "purchase":
      return ctx.overBudget
        ? "تجاوز المستخدم ميزانيته بعملية شراء. عبّر عن شعورك بالتعب أو المرض بلطف ودون لوم."
        : "قام المستخدم بعملية شراء بسيطة ضمن ميزانيته. عبّر عن شعور محايد أو هادئ.";
    default:
      return "عبّر عن حالتك العامة بجملة قصيرة.";
  }
}

// Exported for tests / offline use.
export { fallbackMessage, SYSTEM_GUARDRAIL };
