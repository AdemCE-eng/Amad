import test from 'node:test';
import assert from 'node:assert/strict';
import { CANONICAL_DEMO_ROLE, clearDemoBrowserState } from '../src/lib/demoReset.js';

function storageWith(entries) {
  const values = new Map(Object.entries(entries));
  return {
    get length() { return values.size; },
    key(index) { return [...values.keys()][index] ?? null; },
    getItem(key) { return values.get(key) ?? null; },
    setItem(key, value) { values.set(key, String(value)); },
    removeItem(key) { values.delete(key); },
  };
}

test('full reset clears every Namo journey key without touching unrelated storage', () => {
  const storage = storageWith({
    amad_onboarded: '1',
    namo_active_role: 'ahmed',
    namo_offers_revealed: '1',
    namo_reward_seen_rashid: '123',
    namo_tip_dismissed: '1',
    unrelated_preference: 'keep',
  });

  clearDemoBrowserState(storage);

  assert.equal(storage.getItem('amad_onboarded'), null);
  assert.equal(storage.getItem('namo_active_role'), null);
  assert.equal(storage.getItem('namo_offers_revealed'), null);
  assert.equal(storage.getItem('namo_reward_seen_rashid'), null);
  assert.equal(storage.getItem('namo_tip_dismissed'), null);
  assert.equal(storage.getItem('unrelated_preference'), 'keep');
  assert.equal(CANONICAL_DEMO_ROLE, 'rashid');
});
