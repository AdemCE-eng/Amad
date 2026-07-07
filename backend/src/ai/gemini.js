// gemini.js — generates the pet's short Arabic flavor text.
// Safety-first: a strict guardrail keeps the AI from ever giving financial advice,
// and a hardcoded fallback per mood guarantees the demo NEVER shows a blank message.
import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

const USE_MOCK_AI = process.env.USE_MOCK_AI !== "false"; // default: mock
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";
const TIMEOUT_MS = 5000; // flash-lite runs ~1.5-2.5s with the guardrail; leaves margin

// The judge-validation win: the AI is emotionally expressive but financially silent.
const SYSTEM_GUARDRAIL = `أنت حيوان أليف افتراضي لطيف وتعيش داخل تطبيق بنك الإنماء.
مهمتك: التعبير عن مشاعرك في جملة واحدة قصيرة ومشجعة باللهجة السعودية العامية المبسطة والودية بناءً على تصرف المستخدم المالي.
القواعد الصارمة:
- تحدث بلهجة سعودية قريبة للقلب (مثال: كفو، يا خطير، تعبان شوي، الوضع لوز).
- لا تقدم أي نصيحة مالية إطلاقاً.
- لا تقترح شراء أو بيع أو استثمار أي شيء.
- لا تذكر أرقاماً أو مبالغ أو منتجات مالية محددة.
- عبّر فقط عن شعور الحيوان الأليف (سعادة، حزن، قلق، فخر) بأسلوب طفولي مرح.
- جملة واحدة قصيرة فقط، مع إيموجي واحد مناسب.`;

// 5 responses per mood category — The Polished Saudi Dialect Safety Net.
const FALLBACKS = {
  happy: [
    "يا لبييييه! الادخار عندك فوق الريح وأنا طاير من الفرحة! 🌟",
    "كفووو يا وحش! وفرت وضبطتني، أنت بطل اليوم وكل يوم 🏆",
    "يا خطير أنت! أطلق من يوفّر، كذا الحماس ولا بلاش 💚",
    "المود صار في السحاب الحين بفضل ترتيبك، تراك رهيب! 😄",
    "الوضع لوز وطاقتي فُل بسبتك، عشت والله! ✨",
  ],
  neutral: [
    "الأمور طيبة وكل شيء تمام الحمد لله 🙂",
    "أنا جالس أراقبك بهدوء، مستمتع بجوك 👀",
    "يوم هادي وجميل معك، عساك على القوة 🌤️",
    "أنا مرتاح ومبسوط، لا تشيل همي أبداً 😌",
    "وضعنا بالسليم، يلا نكمل يومنا! 🍃",
  ],
  sad: [
    "يا ليتنا مسكنا يدنا شوي.. أحس بضيق 😟",
    "خاطري زعلان نتفة، بس الجايات أفضل أكيد 🥺",
    "أحتاج شوية اهتمام ودعم منك الحين 💧",
    "المود مو ذاك الزود اليوم، الله يعين 😞",
    "ودّي ناخذ نفس عميق ونراجع حساباتنا هدي هدي 😔",
  ],
  sick: [
    "يوجعني بطني.. شكل الميزانية انخرمت 🤒",
    "تعبان ومالي حيل، أحتاجك توقف معي 😖",
    "طاقتي قَضت وقاعد أدوخ فزعتك.. 🥴",
    "آخ يا راسي، جاني دوار مو طبيعي 😵‍💫",
    "تكفى اعتني فيني شوي، صرت مريض 🤧",
  ],
  emergency: [
    "عوافي عوافي، الطوارئ لها أحكامها وأنا معك 🛡️",
    "درع الأمان حاميني، لا تشيل همي ولا تضيق 💙",
    "عادي فداك! أهم شيء راحتك وصحتي بأمان 🤗",
    "خذ اللي تحتاجه، الأزمات تعدي وأنا بخير 🫧",
    "أنا سليم وما فيني إلا العافية، انتبه لنفسك أول 💛",
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
 * @returns {Promise<{text: string, source: "gemini"|"mock"|"fallback"}>}
 */
export async function generatePetMessage(ctx = {}) {
  const category = ctx.category || "neutral";

  if (USE_MOCK_AI || !GEMINI_API_KEY) {
    return { text: fallbackMessage(category), source: "mock" };
  }

  try {
    const prompt = buildPrompt(ctx);
    const result = await withTimeout(getModel().generateContent(prompt), TIMEOUT_MS);
    const text = result?.response?.text?.().trim();
    return text ? { text, source: "gemini" } : { text: fallbackMessage(category), source: "fallback" };
  } catch (err) {
    console.warn(`⚠️  Gemini failed (${err.message}); using fallback.`);
    return { text: fallbackMessage(category), source: "fallback" };
  }
}

function buildPrompt(ctx) {
  switch (ctx.event) {
    case "salary":
      return "قام المستخدم بإيداع راتبه وتم توفير جزء منه تلقائياً. عبّر عن سعادتك وفخرك بلهجة سعودية.";
    case "save":
      return "قام المستخدم بإيداع مبلغ إضافي مباشرة في المدخرات الفورية. عبّر عن فخرك الشديد بهذه العادة الرائعة بلهجة سعودية.";
    case "emergency":
      return "قام المستخدم بسحب مبلغ لحالة طارئة، ودرع الطوارئ يحميك من أي ضرر. طمئنه أنك بخير بلهجة سعودية وعامية.";
    case "purchase":
      return ctx.overBudget
        ? "تجاوز المستخدم ميزانيته بعملية شراء. عبّر عن شعورك بالتعب أو المرض بلطف ودون لوم بلهجة سعودية طفولية."
        : "قام المستخدم بعملية شراء بسيطة ضمن ميزانيته. عبّر عن شعور محايد أو هادئ بلهجة سعودية.";
    case "streak_up":
      return "أكمل المستخدم يوماً جديداً ملتزماً بميزانيته وسلسلة أيامه الجيدة تكبر. عبّر عن فخرك وحماسك بلهجة سعودية.";
    case "streak_frozen":
      return "تجاوز المستخدم ميزانيته اليوم لكن درع الحماية حفظ سلسلة أيامه الجيدة. طمئنه بلطف أن الغلطة تعدي وأنكم مكملين سوا بلهجة سعودية.";
    case "streak_lost":
      return "انقطعت سلسلة الأيام الجيدة للمستخدم. عبّر عن حزن خفيف مع تشجيع صادق على البداية من جديد، دون أي لوم، بلهجة سعودية.";
    case "challenge_done":
      return "أنجز المستخدم تحدي الأسبوع بنجاح. احتفل معه بحماس كبير بلهجة سعودية.";
    case "shop":
      return "أهدى المستخدم حيوانه الأليف إكسسواراً جديداً اشتراه بعملاته. عبّر عن فرحتك الشديدة بالهدية الجديدة بلهجة سعودية طفولية.";
    default:
      return "عبّر عن حالتك العامة بجملة قصيرة بلهجة سعودية.";
  }
}

// Exported for tests / offline use.
export { fallbackMessage, SYSTEM_GUARDRAIL };