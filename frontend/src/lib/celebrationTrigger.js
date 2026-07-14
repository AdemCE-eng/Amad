// The timestamp is the backend's authoritative one-shot celebration identity.
// Mounting an existing state, repeating the same timestamp, and reset-to-zero
// never enqueue an overlay. A genuinely new timestamp does.
export function evaluateCelebrationCursor(previousAt, celebration) {
  const nextAt = Number(celebration?.at) || 0;
  if (previousAt === null) return { nextAt, shouldQueue: false };
  return {
    nextAt,
    shouldQueue: nextAt > 0 && nextAt !== previousAt,
  };
}
