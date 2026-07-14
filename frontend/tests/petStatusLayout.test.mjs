import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (relativePath) => readFile(new URL(relativePath, import.meta.url), 'utf8');

test('Pet Status prioritizes the live savings action before compact evolution and secondary controls', async () => {
  const pet = await read('../src/views/PetRoomView.jsx');
  const message = pet.indexOf('data-testid="pet-status-message"');
  const savings = pet.indexOf('data-testid="pet-savings-summary"');
  const evolution = pet.indexOf('data-testid="pet-evolution-card"');
  const streak = pet.indexOf('<PetProgressionSections section="status"');

  assert.ok(message > 0);
  assert.ok(message < savings, 'the concise message should lead into savings');
  assert.ok(savings < evolution, 'savings must appear before evolution');
  assert.ok(evolution < streak, 'streak and emergency controls remain secondary');
});

test('savings summary uses live values, progress semantics, and existing save actions', async () => {
  const pet = await read('../src/views/PetRoomView.jsx');

  assert.match(pet, /data-testid="pet-saved-amount"/);
  assert.match(pet, /SAR_NUMBER\.format\(user\.savedAmount\)/);
  assert.match(pet, /data-testid="pet-goal-amount"/);
  assert.match(pet, /SAR_NUMBER\.format\(user\.goalAmount\)/);
  assert.match(pet, /data-testid="pet-savings-progress"/);
  assert.match(pet, /role="progressbar"/);
  assert.match(pet, /aria-valuenow=\{goalProgress\}/);
  assert.match(pet, /style=\{\{ width: `\$\{goalProgress\}%` \}\}/);
  assert.match(pet, /SAVE_PRESETS\.map\(\(amount\)/);
  assert.match(pet, /rememberCelebrationReturnFocus\(`pet-save-\$\{amount\}`\)/);
  assert.match(pet, /runAction\(\(\) => api\.save\(amount\)\)/);
  assert.match(pet, /data-focus-return-key=\{`pet-save-\$\{amount\}`\}/);
  assert.match(pet, /disabled=\{isSubmitting\}/);
});

test('status details disclosure and its obsolete state are completely removed', async () => {
  const pet = await read('../src/views/PetRoomView.jsx');
  const messageStart = pet.indexOf('data-testid="pet-status-message"');
  const savingsStart = pet.indexOf('data-testid="pet-savings-summary"');
  const messageMarkup = pet.slice(messageStart, savingsStart);

  assert.match(messageMarkup, /\{pet\.message\}/);
  assert.doesNotMatch(pet, /تفاصيل الحالة|detailsOpen|setDetailsOpen|pet-secondary-details|ChevronDown|MOOD_LABEL|SHOP_ITEMS/);
});

test('financial progress and Saqr growth use distinct visual and semantic structures', async () => {
  const pet = await read('../src/views/PetRoomView.jsx');
  const savingsStart = pet.indexOf('data-testid="pet-savings-summary"');
  const evolutionStart = pet.indexOf('data-testid="pet-evolution-card"');
  const statusControlsStart = pet.indexOf('<PetProgressionSections section="status"');
  const savingsMarkup = pet.slice(savingsStart, evolutionStart);
  const evolutionMarkup = pet.slice(evolutionStart, statusControlsStart);

  assert.match(savingsMarkup, /role="progressbar"/);
  assert.match(savingsMarkup, /data-testid="pet-savings-progress"/);
  assert.match(savingsMarkup, /style=\{\{ width: `\$\{goalProgress\}%` \}\}/);
  assert.match(evolutionMarkup, /<ol/);
  assert.match(evolutionMarkup, /data-testid="pet-evolution-stage-rail"/);
  assert.match(evolutionMarkup, /data-stage-state=\{milestone\.state\}/);
  assert.match(evolutionMarkup, /data-threshold=\{milestone\.at\}/);
  assert.doesNotMatch(evolutionMarkup, /role="progressbar"|pet-evolution-fill|style=\{\{ width:/);
});
