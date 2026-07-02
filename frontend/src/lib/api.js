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

export const api = {
  salary: (amount, savePercent) => post('/api/simulate/salary', { amount, savePercent }),
  save: (amount) => post('/api/simulate/save', { amount }),
  purchase: (amount, category, label) => post('/api/simulate/purchase', { amount, category, label }),
  emergency: (amount, label) => post('/api/simulate/emergency', { amount, label }),
  setGoal: (goalAmount) => post('/api/user/goal', { goalAmount }),
  reset: () => post('/api/reset'),
};
