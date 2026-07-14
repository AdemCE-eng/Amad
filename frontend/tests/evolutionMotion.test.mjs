import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { evaluateCelebrationCursor } from '../src/lib/celebrationTrigger.js';
import {
  EVOLUTION_EXIT_MS,
  EVOLUTION_HOLD_MS,
  EVOLUTION_PARTICLES,
  EVOLUTION_TOTAL_MS,
} from '../src/lib/evolutionMotion.js';

const read = (relativePath) => readFile(new URL(relativePath, import.meta.url), 'utf8');

test('evolution queues exactly once for a new threshold event and never replays stale state', () => {
  let cursor = null;
  let decision = evaluateCelebrationCursor(cursor, { at: 100, type: 'evolution' });
  assert.equal(decision.shouldQueue, false, 'mounting an existing event must not replay it');
  cursor = decision.nextAt;

  decision = evaluateCelebrationCursor(cursor, { at: 200, type: 'evolution' });
  assert.equal(decision.shouldQueue, true, 'a genuine new threshold event queues once');
  cursor = decision.nextAt;
  assert.equal(evaluateCelebrationCursor(cursor, { at: 200, type: 'evolution' }).shouldQueue, false);
  assert.equal(evaluateCelebrationCursor(cursor, { at: 200, type: 'evolution' }).shouldQueue, false, 'navigation cannot replay the same identity');

  decision = evaluateCelebrationCursor(cursor, { at: 0 });
  assert.equal(decision.shouldQueue, false, 'reset itself never queues evolution');
  cursor = decision.nextAt;
  decision = evaluateCelebrationCursor(cursor, { at: 300, type: 'evolution' });
  assert.equal(decision.shouldQueue, true, 'a new journey can cross the threshold again');
});

test('localized particles stay bounded, deterministic, and short-lived', () => {
  assert.ok(EVOLUTION_PARTICLES.length >= 10 && EVOLUTION_PARTICLES.length <= 16);
  for (const particle of EVOLUTION_PARTICLES) {
    assert.ok(Math.abs(particle.x) <= 110);
    assert.ok(particle.y >= -105 && particle.y <= 0);
    assert.ok(particle.size >= 4 && particle.size <= 7);
    assert.ok(particle.duration >= 0.7 && particle.duration <= 1.3);
  }
  assert.equal(EVOLUTION_HOLD_MS, 2250);
  assert.equal(EVOLUTION_EXIT_MS, 250);
  assert.equal(EVOLUTION_TOTAL_MS, 2500);
});

test('evolution overlay is an accessible Namo dialog with reduced-motion safeguards', async () => {
  const [overlay, confetti, styles] = await Promise.all([
    read('../src/components/ui/CelebrationOverlay.jsx'),
    read('../src/lib/confetti.js'),
    read('../src/index.css'),
  ]);

  assert.match(overlay, /role="dialog"/);
  assert.match(overlay, /aria-modal="true"/);
  assert.match(overlay, /dialogRef\.current\?\.focus\(\)/);
  assert.match(overlay, /eventObject\.key === 'Escape'/);
  assert.match(overlay, /useReducedMotion\(\)/);
  assert.match(overlay, /!reducedMotion && \(/);
  assert.match(overlay, /data-testid="evolution-local-particles"/);
  assert.match(overlay, /pointer-events-none/);
  assert.doesNotMatch(overlay, /Math\.random/);
  assert.doesNotMatch(confetti, /evolutionStars/);
  assert.match(styles, /prefers-reduced-motion: reduce/);
  assert.match(styles, /\.evolution-dialog \*/);
});
