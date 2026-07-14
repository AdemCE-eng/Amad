export function normalizeNotification(value, id, fallbackRecipient = 'rashid') {
  if (!value || typeof value !== 'object') return null;
  const recipientId = String(value.recipientId || value.userId || fallbackRecipient).toLowerCase();
  return {
    ...value,
    id: String(value.id || id),
    recipientId,
    body: String(value.body || value.message || ''),
    timestamp: Number(value.timestamp || value.createdAt || value.at || 0),
    read: Boolean(value.read),
  };
}

export function notificationsForRecipient(collection, recipientId, fallbackRecipient = recipientId) {
  return Object.entries(collection || {})
    .map(([id, value]) => normalizeNotification(value, id, fallbackRecipient))
    .filter((item) => item && item.recipientId === recipientId)
    .sort((a, b) => b.timestamp - a.timestamp || a.id.localeCompare(b.id));
}

export function mergeNotifications(...groups) {
  const byId = new Map();
  for (const item of groups.flat()) if (item) byId.set(item.id, item);
  return [...byId.values()].sort((a, b) => b.timestamp - a.timestamp || a.id.localeCompare(b.id));
}
