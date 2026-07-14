export const CANONICAL_DEMO_ROLE = 'rashid';

// Browser-only presentation state must never survive a full backend reset.
// Financial and game state remain owned by Firebase; these keys only control
// transient UI choices, notices, and analysis visibility.
export function clearDemoBrowserState(storage = window.localStorage) {
  const keys = [];
  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index);
    if (key === 'amad_onboarded' || key?.startsWith('namo_')) keys.push(key);
  }
  keys.forEach((key) => storage.removeItem(key));
}
