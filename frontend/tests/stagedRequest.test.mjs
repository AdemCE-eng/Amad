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
    minimumMs: 7500,
    onStage: (index) => seen.push(index),
    sleep: async () => {},
    now: () => 7500,
  }).then((value) => { settled = true; return value; });

  for (let index = 0; index < 12; index += 1) await Promise.resolve();
  assert.deepEqual(seen, [0, 1, 2, 3, 4]);
  assert.equal(settled, false);
  resolveRequest({ ok: true });
  assert.deepEqual(await pending, { ok: true });
});

test('five opportunity stages start immediately and span the 7.5 second presentation', async () => {
  let clock = 0;
  const events = [];
  const result = await runStagedRequest({
    request: () => { events.push(`request:${clock}`); return { source: 'live' }; },
    stages: ['one', 'two', 'three', 'four', 'five'],
    minimumMs: 7500,
    onStage: (index) => events.push(`stage:${index}:${clock}`),
    sleep: async (milliseconds) => { clock += milliseconds; },
    now: () => clock,
  });

  assert.deepEqual(events, [
    'stage:0:0',
    'request:0',
    'stage:1:1500',
    'stage:2:3000',
    'stage:3:4500',
    'stage:4:6000',
  ]);
  assert.equal(clock, 7500);
  assert.equal(result.source, 'live');
});

test('fallback response uses the same 7.5 second visual contract', async () => {
  let clock = 0;
  const events = [];
  const result = await runStagedRequest({
    request: () => { events.push(`request:${clock}`); return { source: 'deterministic-fallback' }; },
    stages: ['one', 'two', 'three', 'four', 'five'],
    minimumMs: 7500,
    onStage: (index) => events.push(`stage:${index}:${clock}`),
    sleep: async (milliseconds) => { clock += milliseconds; },
    now: () => clock,
  });

  assert.equal(events[0], 'stage:0:0');
  assert.equal(events[1], 'request:0');
  assert.equal(events.at(-1), 'stage:4:6000');
  assert.equal(clock, 7500);
  assert.equal(result.source, 'deterministic-fallback');
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
