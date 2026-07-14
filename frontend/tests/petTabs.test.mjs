import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (relativePath) => readFile(new URL(relativePath, import.meta.url), 'utf8');

test('Pet exposes three accessible compact tabs with Status selected by default', async () => {
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
  assert.match(pet, /h-9 grid grid-cols-3/);
  assert.match(pet, /className=\{`h-8 rounded/);
  assert.match(pet, /bg-coral\/10 border-coral\/35 text-coral/);
  assert.match(pet, /الحالة/);
  assert.match(pet, /التحديات والإنجازات/);
  assert.match(pet, /الإكسسوارات/);
  assert.match(context, /useState\('status'\)/);
  assert.match(context, /setPetActiveTab\('status'\)/);
  assert.match(context, /petActiveTab, setPetActiveTab/);
});

test('Pet uses one compact product-header row with live stage and NXP', async () => {
  const pet = await read('../src/views/PetRoomView.jsx');

  assert.match(pet, /data-testid="pet-product-header"/);
  assert.match(pet, /<header className="h-12 px-5 flex items-center/);
  assert.match(pet, />صقر<\/h1>/);
  assert.match(pet, /data-testid="pet-header-stage"/);
  assert.match(pet, /\{evolution\.currentStage\.name\}/);
  assert.match(pet, /data-testid="pet-nxp-balance"/);
  assert.match(pet, /\{game\.nxp_balance\}/);
  assert.doesNotMatch(pet, /رفيقك المالي/);
  assert.doesNotMatch(pet, /CoinPill/);
  assert.doesNotMatch(pet, /ChevronRight|ChevronLeft/);
});

test('Pet tabs use non-emoji icons that fit the equal-width compact control', async () => {
  const pet = await read('../src/views/PetRoomView.jsx');

  assert.match(pet, /icon: HeartPulse/);
  assert.match(pet, /icon: Trophy/);
  assert.match(pet, /icon: ShoppingBag/);
  assert.match(pet, /grid grid-cols-3/);
  assert.match(pet, /<TabIcon size=\{10\}/);
});

test('Pet tab panels preserve status, progression, and accessory ownership', async () => {
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
