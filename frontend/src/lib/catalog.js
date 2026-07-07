// Frontend mirror of the backend catalogs (backend/src/logic/gameEngine.js).
// Static content — titles, icons, prices — so views render without a fetch.

export const ACHIEVEMENTS = {
  first_save: { title: 'أول توفير', desc: 'أودعت أول مبلغ في مدخراتك', coins: 25, icon: '🌱' },
  streak_3: { title: 'ثلاثة أيام كفو', desc: '٣ أيام متتالية داخل الميزانية', coins: 30, icon: '🔥' },
  budget_week: { title: 'أسبوع منضبط', desc: 'أسبوع كامل داخل الميزانية', coins: 50, icon: '📅' },
  half_goal: { title: 'نص الطريق', desc: 'وصلت ٥٠٪ من هدف الادخار', coins: 50, icon: '⛰️' },
  goal_reached: { title: 'تحقق الهدف', desc: 'وصلت هدف الادخار كاملاً', coins: 100, icon: '🏆' },
  shield_wise: { title: 'درع الحكمة', desc: 'استخدمت درع الطوارئ بحكمة', coins: 25, icon: '🛡️' },
};

export const SHOP_ITEMS = {
  sunglasses: { name: 'نظارة شمسية', price: 50, icon: '🕶️' },
  shemagh: { name: 'شماغ وعقال', price: 100, icon: '🔴' },
  falcon_hood: { name: 'برقع الصقر', price: 150, icon: '🪶' },
};

export const STAGE_INFO = [
  { name: 'بيضة', icon: '🥚', at: 0 },
  { name: 'فرخ', icon: '🐤', at: 30 },
  { name: 'صقر', icon: '🦅', at: 80 },
];
