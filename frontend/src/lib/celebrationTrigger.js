// The backend timestamp identifies the operation; type + id identify its
// semantic outcome. Together they form a stable event key for deduplication.
export function celebrationEventKey(celebration) {
  const nextAt = Number(celebration?.at) || 0;
  return `${celebration?.type || 'none'}:${celebration?.id || 'none'}:${nextAt}`;
}

export const CELEBRATION_ACK_PREFIX = 'nadeem_celebration_ack_';
const LEGACY_CELEBRATION_ACK_PREFIX = 'namo_celebration_ack_';
let pendingReturnFocus = null;

export function rememberCelebrationReturnFocus(key) {
  pendingReturnFocus = key ? { key, at: Date.now() } : null;
}

export function consumeCelebrationReturnFocus(maxAgeMs = 5000) {
  const remembered = pendingReturnFocus;
  pendingReturnFocus = null;
  if (!remembered || Date.now() - remembered.at > maxAgeMs) return null;
  return remembered.key;
}

export function readCelebrationAcknowledgement(storage, role = 'rashid') {
  if (!storage) return null;
  try {
    return storage.getItem(`${CELEBRATION_ACK_PREFIX}${role}`)
      || storage.getItem(`${LEGACY_CELEBRATION_ACK_PREFIX}${role}`);
  } catch {
    return null;
  }
}

export function acknowledgeCelebration(storage, celebration, role = 'rashid') {
  const key = celebrationEventKey(celebration);
  if (!storage || Number(celebration?.at) <= 0) return key;
  try {
    storage.setItem(`${CELEBRATION_ACK_PREFIX}${role}`, key);
  } catch {
    // A denied browser store should never block the visible confirmation flow.
  }
  return key;
}

// A hydrated event remains pending until its stable key has been explicitly
// acknowledged. The in-memory cursor prevents duplicate queueing during the
// current render lifecycle; the stored acknowledgement prevents replay later.
export function evaluateCelebrationCursor(
  previousCursor,
  celebration,
  { eligible = true, acknowledgedCursor = null } = {}
) {
  const nextAt = Number(celebration?.at) || 0;
  const nextCursor = celebrationEventKey(celebration);
  return {
    nextAt,
    nextCursor,
    shouldQueue: eligible
      && nextAt > 0
      && nextCursor !== previousCursor
      && nextCursor !== acknowledgedCursor,
  };
}
