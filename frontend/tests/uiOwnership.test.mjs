import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (relativePath) => readFile(new URL(relativePath, import.meta.url), 'utf8');

test('Pet owns streak, challenge, achievements, and the accessory store', async () => {
  const [pet, progression] = await Promise.all([
    read('../src/views/PetRoomView.jsx'),
    read('../src/components/pet/PetProgressionSections.jsx'),
  ]);
  assert.match(pet, /PetProgressionSections/);
  assert.match(progression, /StreakFlame/);
  assert.match(progression, /ChallengeCard/);
  assert.match(progression, /ACHIEVEMENTS/);
  assert.match(progression, /SHOP_ITEMS/);
  assert.match(progression, /متجر إكسسوارات صقر/);
  assert.match(progression, /api\.buyItem/);
  assert.match(progression, /api\.equipItem/);
});

test('Rewards owns distinct balances without prototype labels or Pet sections', async () => {
  const rewards = await read('../src/views/RewardsView.jsx');
  assert.match(rewards, /NXP/);
  assert.match(rewards, /أكثر \/ Akthr/);
  assert.match(rewards, /كاش باك/);
  assert.match(rewards, /family-reward-activity/);
  assert.match(rewards, /cashback-milestones/);
  assert.doesNotMatch(rewards, /ChallengeCard|StreakFlame|ACHIEVEMENTS|SHOP_ITEMS|متجر إكسسوارات صقر/);
  assert.doesNotMatch(rewards, />\s*MOCK\s*</);
  assert.doesNotMatch(rewards, /تجريبي|محاكاة|بيئة تجريبية/);
});
