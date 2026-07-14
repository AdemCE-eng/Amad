import { db } from "../firebase.js";
import {
  normalizeRecipientId,
  normalizeStoredNotification,
  sortNotifications,
} from "../logic/notificationEngine.js";

const RECIPIENT_HEADER = "x-namo-demo-user";

export function notificationPath(recipientId) {
  return `/userNotifications/${recipientId}`;
}

export function recipientFromRequest(req) {
  const raw = req.get(RECIPIENT_HEADER);
  if (!raw) return "rashid";
  return normalizeRecipientId(raw);
}

export async function readNotificationsForRecipient(recipientId) {
  const currentSnap = await db.ref(notificationPath(recipientId)).get();
  const current = currentSnap.val() || {};
  const values = Object.entries(current)
    .map(([id, item]) => normalizeStoredNotification(item, id, recipientId))
    .filter(Boolean);

  // Legacy records predate recipient scoping and belonged to Rashid's demo.
  if (recipientId === "rashid") {
    const legacySnap = await db.ref("/user/notifications").get();
    for (const [id, item] of Object.entries(legacySnap.val() || {})) {
      if (current[id]) continue;
      const normalized = normalizeStoredNotification(item, id, "rashid");
      if (normalized) values.push(normalized);
    }
  }
  return sortNotifications(values);
}

export async function markNotificationsReadForRecipient(recipientId) {
  const [currentSnap, legacySnap] = await Promise.all([
    db.ref(notificationPath(recipientId)).get(),
    recipientId === "rashid" ? db.ref("/user/notifications").get() : Promise.resolve(null),
  ]);
  const updates = {};
  for (const [id, item] of Object.entries(currentSnap.val() || {})) {
    if (!item?.read) updates[`${notificationPath(recipientId)}/${id}/read`] = true;
  }
  for (const [id, item] of Object.entries(legacySnap?.val() || {})) {
    if (!item?.read) updates[`/user/notifications/${id}/read`] = true;
  }
  if (Object.keys(updates).length) await db.ref("/").update(updates);
  return Object.keys(updates).length;
}
