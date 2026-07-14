import test from 'node:test';
import assert from 'node:assert/strict';
import { runStagedRequest } from '../src/lib/stagedRequest.js';

test('staged request starts the real request immediately and honors minimum duration', async () => {
  let clock = 0;
  const events = [];
  const stages = ['one', 'two', 'three', 'four'];
  const result = await runStagedRequest({
    request: () => { events.push('request'); return { amount: 731 }; },
    stages,
    minimumMs: 3200,
    onStage: (index) => events.push(`stage:${index}`),
    sleep: async (milliseconds) => { clock += milliseconds; },
    now: () => clock,
  });

  assert.deepEqual(events, ['stage:0', 'request', 'stage:1', 'stage:2', 'stage:3']);
  assert.equal(clock, 3200);
  assert.equal(result.amount, 731);
});

test('a slow request holds on the final visual stage until its response arrives', async () => {
  let resolveRequest;
  let settled = false;
  const seen = [];
  const pending = runStagedRequest({
    request: () => new Promise((resolve) => { resolveRequest = resolve; }),
    stages: ['one', 'two', 'three', 'four', 'five'],
    minimumMs: 4800,
    onStage: (index) => seen.push(index),
    sleep: async () => {},
    now: () => 4800,
  }).then((value) => { settled = true; return value; });

  for (let index = 0; index < 12; index += 1) await Promise.resolve();
  assert.deepEqual(seen, [0, 1, 2, 3, 4]);
  assert.equal(settled, false);
  resolveRequest({ ok: true });
  assert.deepEqual(await pending, { ok: true });
});

test('request failure rejects without revealing a stale result', async () => {
  const seen = [];
  await assert.rejects(() => runStagedRequest({
    request: () => Promise.reject(new Error('offline')),
    stages: ['one', 'two'],
    minimumMs: 1000,
    onStage: (index) => seen.push(index),
    sleep: async () => {},
    now: () => 0,
  }), /offline/);
  assert.equal(seen[0], 0);
});
