export const DEMO_RECIPIENT_IDS = Object.freeze(["rashid", "ahmed", "sarah"]);

export function normalizeRecipientId(value, fallback = null) {
  const id = String(value || "").trim().toLowerCase();
  if (DEMO_RECIPIENT_IDS.includes(id)) return id;
  return fallback;
}

export function buildNotification({
  id,
  recipientId,
  type,
  title,
  body,
  timestamp = Date.now(),
  read = false,
  ...optional
}) {
  const recipient = normalizeRecipientId(recipientId);
  if (!recipient) throw new Error("invalid_notification_recipient");
  if (!id || !type || !title || !body) throw new Error("invalid_notification");

  return {
    id: String(id),
    recipientId: recipient,
    type: String(type),
    title: String(title),
    body: String(body),
    timestamp: Number(timestamp) || Date.now(),
    read: Boolean(read),
    ...Object.fromEntries(Object.entries(optional).filter(([, value]) => value !== undefined)),
  };
}

export function normalizeStoredNotification(value, id, fallbackRecipient = "rashid") {
  if (!value || typeof value !== "object") return null;
  const recipientId = normalizeRecipientId(value.recipientId || value.userId, fallbackRecipient);
  if (!recipientId) return null;
  return {
    ...value,
    id: String(value.id || id),
    recipientId,
    body: String(value.body || value.message || ""),
    timestamp: Number(value.timestamp || value.createdAt || value.at || 0),
    read: Boolean(value.read),
  };
}

export function sortNotifications(notifications) {
  return [...notifications].sort((a, b) => b.timestamp - a.timestamp || a.id.localeCompare(b.id));
}
