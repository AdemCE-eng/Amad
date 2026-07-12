const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

async function post(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body ?? {}),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.ok === false) {
    throw new Error(data.error || 'request_failed');
  }
  return data;
}

async function get(path) {
  const res = await fetch(`${API_BASE}${path}`);
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
  completeChallenge: () => post('/api/demo/complete-challenge'),
  buyItem: (itemId) => post('/api/shop/buy', { itemId }),
  equipItem: (itemId) => post('/api/pet/equip', { itemId }),
  setProfile: (profile) => post('/api/user/profile', profile),

  // ── Notifications
  getNotifications: () => get('/api/user/notifications'),
  addNotification: (notification) => post('/api/user/notifications', notification), // Mostly for testing, backend should handle notifs

  // ── Phase 2A: family goal + explainable contribution plan ──
  familyState: () => get('/api/family/state'),
  generatePlan: () => post('/api/contribution-plan/generate'),

  // ── Phase 2B: predicted offers + parent reward ──
  predictedOffers: () => get('/api/offers/predicted'),
  decideOffer: (offerId, decision) => post('/api/offers/decide', { offerId, decision }),
  settleOffer: (offerId, memberId) => post('/api/offers/settle', { offerId, memberId }),
  sendReward: (body) => post('/api/family/reward', body),
};
