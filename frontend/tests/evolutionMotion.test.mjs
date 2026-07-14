import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  acknowledgeCelebration,
  celebrationEventKey,
  consumeCelebrationReturnFocus,
  evaluateCelebrationCursor,
  readCelebrationAcknowledgement,
  rememberCelebrationReturnFocus,
} from '../src/lib/celebrationTrigger.js';
import {
  EVOLUTION_CONFIRM_READY_MS,
  EVOLUTION_EXIT_MS,
  EVOLUTION_PARTICLES,
} from '../src/lib/evolutionMotion.js';

const read = (relativePath) => readFile(new URL(relativePath, import.meta.url), 'utf8');

function storage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
  };
}

test('celebrations remain pending through hydration and complete only after acknowledgement', () => {
  const hydrated = { at: 100, type: 'achievement', id: 'first_save' };
  let decision = evaluateCelebrationCursor(null, hydrated);
  assert.equal(decision.shouldQueue, true, 'an unacknowledged hydrated event remains available');
  let cursor = decision.nextCursor;
  assert.equal(cursor, celebrationEventKey(hydrated));
  assert.equal(evaluateCelebrationCursor(cursor, hydrated).shouldQueue, false, 'the same event cannot queue twice in one lifecycle');

  const browserStorage = storage();
  const acknowledged = acknowledgeCelebration(browserStorage, hydrated, 'rashid');
  assert.equal(readCelebrationAcknowledgement(browserStorage, 'rashid'), acknowledged);
  assert.equal(
    evaluateCelebrationCursor(null, hydrated, { acknowledgedCursor: acknowledged }).shouldQueue,
    false,
    'an explicitly completed event does not replay after hydration'
  );

  rememberCelebrationReturnFocus('pet-save-100');
  assert.equal(consumeCelebrationReturnFocus(), 'pet-save-100');
  assert.equal(consumeCelebrationReturnFocus(), null, 'return focus keys are consumed once');

  const next = { at: 200, type: 'evolution', id: 'stage_1' };
  decision = evaluateCelebrationCursor(cursor, next);
  assert.equal(decision.shouldQueue, true, 'a genuine new event queues once');
  cursor = decision.nextCursor;
  assert.equal(evaluateCelebrationCursor(cursor, next).shouldQueue, false, 'the same event never queues twice');

  const sameTimestampDifferentOutcome = { at: 200, type: 'challenge', id: 'less_coffee' };
  assert.equal(
    evaluateCelebrationCursor(cursor, sameTimestampDifferentOutcome).shouldQueue,
    true,
    'type and id are part of the event identity'
  );

  const otherRoleEvent = { at: 250, type: 'shop', id: 'sunglasses' };
  decision = evaluateCelebrationCursor(null, otherRoleEvent, { eligible: false });
  assert.equal(decision.shouldQueue, false);
  assert.equal(
    evaluateCelebrationCursor(null, otherRoleEvent, { eligible: true }).shouldQueue,
    true,
    'switching back to راشد keeps an unacknowledged event available'
  );

  decision = evaluateCelebrationCursor(null, { at: 0, type: 'none', id: 'none' });
  assert.equal(decision.shouldQueue, false, 'reset itself never queues');
  cursor = decision.nextCursor;
  assert.equal(
    evaluateCelebrationCursor(cursor, { at: 300, type: 'evolution', id: 'stage_1' }).shouldQueue,
    true,
    'a genuinely new post-reset journey can celebrate its threshold'
  );
});

test('evolution particles stay local and deterministic while confirmation waits for the animation', () => {
  assert.ok(EVOLUTION_PARTICLES.length >= 8 && EVOLUTION_PARTICLES.length <= 12);
  for (const particle of EVOLUTION_PARTICLES) {
    assert.ok(Math.abs(particle.x) <= 110);
    assert.ok(particle.y >= -105 && particle.y <= 0);
    assert.ok(particle.size >= 4 && particle.size <= 7);
    assert.ok(particle.duration >= 0.7 && particle.duration <= 1.3);
  }
  assert.equal(EVOLUTION_CONFIRM_READY_MS, 1650);
  assert.equal(EVOLUTION_EXIT_MS, 250);
});

test('hatching is smooth, adult evolution remains separate, and reduced motion is safe', async () => {
  const [overlay, dialog, styles] = await Promise.all([
    read('../src/components/ui/CelebrationOverlay.jsx'),
    read('../src/components/ui/NamoCelebrationDialog.jsx'),
    read('../src/index.css'),
  ]);

  assert.match(overlay, /data-transition-kind=\{isHatch \? 'egg-to-chick' : 'chick-to-adult'\}/);
  assert.match(overlay, /function HatchMotion/);
  assert.match(overlay, /function AdultEvolutionMotion/);
  assert.match(overlay, /data-testid="evolution-shell-top"/);
  assert.match(overlay, /data-testid="evolution-shell-bottom"/);
  assert.match(overlay, /<LocalizedParticles testId="evolution"/);
  assert.doesNotMatch(overlay, /<path|Math\.random|canvas-confetti|burst\(/);
  assert.doesNotMatch(overlay, /schedule\(finishCurrent/);
  assert.match(overlay, /setCanDismiss\(true\)/);
  assert.match(overlay, /reducedMotion \? 0 : EVOLUTION_CONFIRM_READY_MS/);
  assert.match(overlay, /رائع، نكمل/);
  assert.match(overlay, /acknowledgeCelebration\(storage, current, activeRole\)/);
  assert.match(overlay, /returnFocusKey=\{event\.returnFocusKey\}/);
  assert.match(dialog, /role="dialog"/);
  assert.match(dialog, /aria-modal="true"/);
  assert.match(dialog, /dialogRef\.current\?\.focus\(\)/);
  assert.match(dialog, /event\.key === 'Escape'/);
  assert.match(dialog, /event\.key === 'Tab'/);
  assert.match(dialog, /target instanceof HTMLElement\) target\.focus\(\)/);
  assert.match(dialog, /useReducedMotion\(\)/);
  assert.match(styles, /prefers-reduced-motion: reduce/);
  assert.match(styles, /\.namo-celebration-dialog \*/);
});
