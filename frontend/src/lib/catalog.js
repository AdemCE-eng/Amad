// Frontend mirror of the backend catalogs (backend/src/logic/gameEngine.js).
// Static content — titles, icons, prices — so views render without a fetch.

export const ACHIEVEMENTS = {
  first_save: { title: 'أول توفير', desc: 'أودعت أول مبلغ في مدخراتك', nxp: 25, icon: '🌱' },
  streak_3: { title: 'ثلاثة أيام كفو', desc: '3 أيام متتالية داخل الميزانية', nxp: 30, icon: '🔥' },
  budget_week: { title: 'أسبوع منضبط', desc: 'أسبوع كامل داخل الميزانية', nxp: 50, icon: '📅' },
  half_goal: { title: 'نص الطريق', desc: 'وصلت 50٪ من هدف الادخار', nxp: 50, icon: '⛰️' },
  goal_reached: { title: 'تحقق الهدف', desc: 'وصلت هدف الادخار كاملاً', nxp: 100, icon: '🏆' },
  shield_wise: { title: 'درع الحكمة', desc: 'استخدمت درع الطوارئ بحكمة', nxp: 25, icon: '🛡️' },
};

export const SHOP_ITEMS = {
  sunglasses: { name: 'نظارة شمسية', price: 50, icon: '🕶️' },
  cap: { name: 'كاب صقر', price: 100, icon: '🧢' },
  falcon_hood: { name: 'تاج الصقر الملكي', price: 150, icon: '✨', description: 'تاج ذهبي منحني يثبت بانسيابية فوق الرأس.' },
};

// Mirrors backend/src/logic/gameEngine.js so celebration copy is resolved from
// the real event id instead of being hard-coded for one demo challenge.
export const CHALLENGES = {
  less_coffee: { title: 'قهوة أقل هذا الأسبوع', reward: 50, icon: '☕' },
  no_delivery: { title: 'أسبوع بلا توصيل', reward: 40, icon: '🛵' },
  save_thrice: { title: 'وفّر ثلاث مرات', reward: 60, icon: '💰' },
  budget_days: { title: 'خمسة أيام منضبطة', reward: 70, icon: '📅' },
};

export const STAGE_INFO = [
  { name: 'بيضة', icon: '🥚', at: 0 },
  { name: 'فرخ', icon: '🐤', at: 30 },
  { name: 'صقر', icon: '🦅', at: 80 },
];

// Quick-save amount presets (SAR) — the single source for every "save now"
// affordance (Pet Room quick buttons, Home save prompt default). Any future
// savings view must reuse this so the amounts never diverge.
export const SAVE_PRESETS = [100, 500, 1000];

