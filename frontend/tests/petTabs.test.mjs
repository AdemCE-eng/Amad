import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (relativePath) => readFile(new URL(relativePath, import.meta.url), 'utf8');

test('Pet exposes three accessible internal tabs with Status selected by default', async () => {
  const [pet, context] = await Promise.all([
    read('../src/views/PetRoomView.jsx'),
    read('../src/context/AppDataContext.jsx'),
  ]);

  assert.match(pet, /role="tablist"/);
  assert.equal([...pet.matchAll(/role="tab"/g)].length, 1, 'tab role should come from the mapped button template');
  assert.match(pet, /aria-selected=\{selected\}/);
  assert.match(pet, /tabIndex=\{selected \? 0 : -1\}/);
  assert.match(pet, /onKeyDown=\{\(event\) => handleTabKeyDown\(event, index\)\}/);
  assert.match(pet, /ArrowLeft/);
  assert.match(pet, /ArrowRight/);
  assert.match(pet, /bg-coral\/15 border-coral\/45 text-coral/);
  assert.match(pet, /min-h-10/);
  assert.match(pet, /الحالة/);
  assert.match(pet, /التحديات والإنجازات/);
  assert.match(pet, /الإكسسوارات/);
  assert.match(context, /useState\('status'\)/);
  assert.match(context, /setPetActiveTab\('status'\)/);
  assert.match(context, /petActiveTab, setPetActiveTab/);
});

test('Pet uses a balanced top-level product header with contextual live state', async () => {
  const pet = await read('../src/views/PetRoomView.jsx');

  assert.match(pet, /data-testid="pet-product-header"/);
  assert.match(pet, />صقر<\/h1>/);
  assert.match(pet, /رفيقك المالي/);
  assert.match(pet, /مرحلة \{evolution\.currentStage\.name\}/);
  assert.match(pet, /data-testid="pet-nxp-balance"/);
  assert.match(pet, /\{game\.nxp_balance\}/);
  assert.doesNotMatch(pet, /CoinPill/);
  assert.doesNotMatch(pet, /ChevronRight|ChevronLeft/);
  assert.match(pet, /px-5 pt-4 pb-2 flex items-center justify-between/);
});

test('Pet tabs use non-emoji icons and equal-width compact layout', async () => {
  const pet = await read('../src/views/PetRoomView.jsx');

  assert.match(pet, /icon: HeartPulse/);
  assert.match(pet, /icon: Trophy/);
  assert.match(pet, /icon: ShoppingBag/);
  assert.match(pet, /grid grid-cols-3/);
  assert.match(pet, /<TabIcon size=\{12\}/);
});

test('Pet tab panels have distinct status, progression, and accessory ownership', async () => {
  const [pet, sections] = await Promise.all([
    read('../src/views/PetRoomView.jsx'),
    read('../src/components/pet/PetProgressionSections.jsx'),
  ]);

  assert.match(pet, /data-testid="pet-status-panel"/);
  assert.match(pet, /data-testid="pet-progress-panel"/);
  assert.match(pet, /data-testid="pet-accessories-panel"/);
  assert.match(pet, /section="status"/);
  assert.match(pet, /section="progress"/);
  assert.match(pet, /section="accessories"/);
  assert.match(sections, /section === 'status' && <StatusProgress/);
  assert.match(sections, /section === 'progress' && <ChallengesAndAchievements/);
  assert.match(sections, /section === 'accessories' && <Accessories/);
  assert.match(sections, /data-testid="pet-challenge-section"/);
  assert.match(sections, /achievement\.desc/);
  assert.match(sections, /data-testid="equipped-accessory-summary"/);
  assert.match(sections, /api\.buyItem/);
  assert.match(sections, /api\.equipItem/);
});
