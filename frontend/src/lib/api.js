const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

function demoHeaders(recipientId) {
  return recipientId ? { 'X-Namo-Demo-User': recipientId } : {};
}

async function post(path, body, recipientId) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...demoHeaders(recipientId) },
    body: JSON.stringify(body ?? {}),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.ok === false) {
    throw new Error(data.error || 'request_failed');
  }
  return data;
}

async function get(path, recipientId) {
  const res = await fetch(`${API_BASE}${path}`, { headers: demoHeaders(recipientId) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.ok === false) {
    throw new Error(data.error || 'request_failed');
  }
  return data;
}

export const api = {
  salary: (amount, savePercent) => post('/api/simulate/salary', { amount, savePercent }),
  save: (amount) => post('/api/simulate/save', { amount }),
  purchase: (amount, category, label) => post('/api/simulate/purchase', { amount, category, label }),
  emergency: (amount, label) => post('/api/simulate/emergency', { amount, label }),
  setGoal: (goalAmount) => post('/api/user/goal', { goalAmount }),
  reset: () => post('/api/reset'),
  advanceDay: () => post('/api/demo/advance-day'),
  advanceWeek: () => post('/api/demo/advance-week'),
  advanceMonth: () => post('/api/demo/advance-month'),
  completeChallenge: () => post('/api/demo/complete-challenge'),
  buyItem: (itemId) => post('/api/shop/buy', { itemId }),
  equipItem: (itemId) => post('/api/pet/equip', { itemId }),
  setProfile: (profile) => post('/api/user/profile', profile),

  // ── Savings plan + category budgets + savings account ──
  suggestPlan: (monthlyIncome) => post('/api/plan/suggest', { monthlyIncome }),
  applyPlan: (body) => post('/api/plan/apply', body),
  openSavings: () => post('/api/savings/open'),

  // ── Notifications
  getNotifications: (recipientId) => get('/api/user/notifications', recipientId),
  addNotification: (notification, recipientId) => post('/api/user/notifications', notification, recipientId),
  markAllNotificationsRead: (recipientId) => post('/api/user/mark-all-notifications-read', null, recipientId),

  // ── Phase 2A: family goal + explainable contribution plan ──
  familyState: () => get('/api/family/state'),
  generatePlan: () => post('/api/contribution-plan/generate'),

  // ── Phase 2B: predicted offers + parent reward ──
  predictedOffers: () => get('/api/offers/predicted'),
  decideOffer: (offerId, decision) => post('/api/offers/decide', { offerId, decision }),
  settleOffer: (offerId, memberId) => post('/api/offers/settle', { offerId, memberId }),
  sendReward: (body) => post('/api/family/reward', body),

  // Fresh personalized analysis. Node delegates to FastAPI when enabled and
  // returns an explicitly labeled deterministic fallback otherwise.
  personalizedRecommendations: (userId = 'rashid') => get(`/api/ml/recommendations?userId=${encodeURIComponent(userId)}`),
};
