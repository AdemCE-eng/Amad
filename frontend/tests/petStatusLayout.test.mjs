import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (relativePath) => readFile(new URL(relativePath, import.meta.url), 'utf8');

test('Pet Status prioritizes the live savings action before evolution and secondary details', async () => {
  const pet = await read('../src/views/PetRoomView.jsx');
  const message = pet.indexOf('data-testid="pet-status-message"');
  const savings = pet.indexOf('data-testid="pet-savings-summary"');
  const evolution = pet.indexOf('data-testid="pet-evolution-card"');
  const details = pet.indexOf('data-testid="pet-secondary-details"');
  const streak = pet.indexOf('<PetProgressionSections section="status"');

  assert.ok(message > 0);
  assert.ok(message < savings, 'the concise message should lead into savings');
  assert.ok(savings < evolution, 'savings must appear before evolution');
  assert.ok(evolution < details, 'secondary metadata follows the primary financial cards');
  assert.ok(details < streak, 'streak and emergency controls remain secondary');
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
  assert.match(pet, /runAction\(\(\) => api\.save\(amount\)\)/);
  assert.match(pet, /disabled=\{isSubmitting\}/);
});

test('message is concise and live metadata is collapsed behind an accessible disclosure', async () => {
  const pet = await read('../src/views/PetRoomView.jsx');
  const messageStart = pet.indexOf('data-testid="pet-status-message"');
  const savingsStart = pet.indexOf('data-testid="pet-savings-summary"');
  const messageMarkup = pet.slice(messageStart, savingsStart);

  assert.match(messageMarkup, /\{pet\.message\}/);
  assert.doesNotMatch(messageMarkup, /grid-cols-3|المزاج|الحماية|الإكسسوار/);
  assert.match(pet, /const \[detailsOpen, setDetailsOpen\] = useState\(false\)/);
  assert.match(pet, /aria-expanded=\{detailsOpen\}/);
  assert.match(pet, /aria-controls="pet-secondary-details-content"/);
  assert.match(pet, /detailsOpen && \(/);
  assert.match(pet, /MOOD_LABEL\[pet\.mood\]/);
  assert.match(pet, /emergencyShield\.usesRemaining/);
  assert.match(pet, /SHOP_ITEMS\[game\.equipped\]/);
});
