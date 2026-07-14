// The backend timestamp identifies the operation; type + id identify its
// semantic outcome. Together they form a stable event key for deduplication.
export function celebrationEventKey(celebration) {
  const nextAt = Number(celebration?.at) || 0;
  return `${celebration?.type || 'none'}:${celebration?.id || 'none'}:${nextAt}`;
}

// Mounting hydrated state, repeating an event, reset-to-zero, and events for
// an inactive demo role never enqueue a dialog. The cursor always advances so
// switching roles later cannot replay an event that belonged to another role.
export function evaluateCelebrationCursor(previousCursor, celebration, { eligible = true } = {}) {
  const nextAt = Number(celebration?.at) || 0;
  const nextCursor = celebrationEventKey(celebration);
  if (previousCursor === null) return { nextAt, nextCursor, shouldQueue: false };
  return {
    nextAt,
    nextCursor,
    shouldQueue: eligible && nextAt > 0 && nextCursor !== previousCursor,
  };
}
