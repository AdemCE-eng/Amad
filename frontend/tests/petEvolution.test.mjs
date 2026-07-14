import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { buildEvolutionPresentation } from '../src/lib/petEvolutionPresentation.js';

const read = (relativePath) => readFile(new URL(relativePath, import.meta.url), 'utf8');

test('canonical reset state keeps the backend stage and explains the next real threshold', () => {
  const evolution = buildEvolutionPresentation({
    stage: 0,
    goalProgress: 24,
    savedAmount: 1200,
    goalAmount: 5000,
  });

  assert.equal(evolution.currentStage.name, 'بيضة');
  assert.equal(evolution.nextStage.name, 'فرخ');
  assert.equal(evolution.progress, 24);
  assert.equal(evolution.remainingPercentage, 6);
  assert.equal(evolution.remainingAmount, 300);
  assert.deepEqual(evolution.milestones.map(({ at }) => at), [0, 30, 80]);
  assert.deepEqual(evolution.milestones.map(({ state }) => state), ['current', 'future', 'future']);
});

test('authoritative middle and final stages produce distinct milestone states', () => {
  const middle = buildEvolutionPresentation({ stage: 1, goalProgress: 50, savedAmount: 2500, goalAmount: 5000 });
  assert.equal(middle.currentStage.name, 'فرخ');
  assert.equal(middle.nextStage.name, 'صقر');
  assert.equal(middle.remainingAmount, 1500);
  assert.equal(middle.remainingPercentage, 30);
  assert.deepEqual(middle.milestones.map(({ state }) => state), ['completed', 'current', 'future']);

  const final = buildEvolutionPresentation({ stage: 2, goalProgress: 90, savedAmount: 4500, goalAmount: 5000 });
  assert.equal(final.currentStage.name, 'صقر');
  assert.equal(final.nextStage, null);
  assert.equal(final.remainingAmount, 0);
  assert.deepEqual(final.milestones.map(({ state }) => state), ['completed', 'completed', 'current']);
});

test('family contribution values cannot alter personal evolution presentation', () => {
  const personal = { stage: 0, goalProgress: 24, savedAmount: 1200, goalAmount: 5000 };
  const before = buildEvolutionPresentation(personal);
  const afterFamilyContribution = buildEvolutionPresentation({ ...personal, familySavedAmount: 9000 });
  assert.deepEqual(afterFamilyContribution, before);
});

test('compact evolution card renders live stages, remaining amount, and a milestone rail', async () => {
  const pet = await read('../src/views/PetRoomView.jsx');

  assert.match(pet, /data-testid="pet-evolution-card"/);
  assert.match(pet, /data-testid="pet-current-stage"/);
  assert.match(pet, /data-testid="pet-next-stage"/);
  assert.match(pet, /data-testid="pet-evolution-progress"/);
  assert.match(pet, /SAR_NUMBER\.format\(evolution\.remainingAmount\)/);
  assert.match(pet, /data-testid="pet-evolution-stage-rail"/);
  assert.match(pet, /data-stage-state=\{milestone\.state\}/);
  assert.match(pet, /data-threshold=\{milestone\.at\}/);
  assert.match(pet, /grid grid-cols-3 gap-2/);
  assert.match(pet, /aria-label="مراحل تطور صقر"/);
  assert.match(pet, /\{evolution\.currentIndex \+ 1\}\/\{evolution\.milestones\.length\}/);
  assert.doesNotMatch(pet, /pet-evolution-fill|pet-evolution-track/);
  assert.match(pet, /aria-label="المرحلة الحالية والتالية"/);
  assert.doesNotMatch(pet, /Lock|CircleDot/);
  assert.doesNotMatch(pet, /h-24|grid-cols-2/);
});
