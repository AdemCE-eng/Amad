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

test('full reset clears every Nadeem journey key and legacy key without touching unrelated storage', () => {
  const storage = storageWith({
    amad_onboarded: '1',
    nadeem_active_role: 'ahmed',
    nadeem_offers_revealed: '1',
    nadeem_reward_seen_rashid: '123',
    nadeem_celebration_ack_rashid: 'evolution:stage_1:123',
    nadeem_tip_dismissed: '1',
    namo_legacy_key: 'remove',
    unrelated_preference: 'keep',
  });

  clearDemoBrowserState(storage);

  assert.equal(storage.getItem('amad_onboarded'), null);
  assert.equal(storage.getItem('nadeem_active_role'), null);
  assert.equal(storage.getItem('nadeem_offers_revealed'), null);
  assert.equal(storage.getItem('nadeem_reward_seen_rashid'), null);
  assert.equal(storage.getItem('nadeem_celebration_ack_rashid'), null);
  assert.equal(storage.getItem('nadeem_tip_dismissed'), null);
  assert.equal(storage.getItem('namo_legacy_key'), null);
  assert.equal(storage.getItem('unrelated_preference'), 'keep');
  assert.equal(CANONICAL_DEMO_ROLE, 'rashid');
});
