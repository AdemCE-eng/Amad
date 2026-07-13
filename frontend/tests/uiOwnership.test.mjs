import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (relativePath) => readFile(new URL(relativePath, import.meta.url), 'utf8');

test('family goal remains a Home-owned nested view and is absent from BottomNav', async () => {
  const [home, nav, app] = await Promise.all([
    read('../src/views/HomeView.jsx'),
    read('../src/components/ui/BottomNav.jsx'),
    read('../src/App.jsx'),
  ]);
  assert.match(home, /الهدف العائلي/);
  assert.match(home, /setActiveView\('family'\)/);
  assert.doesNotMatch(nav, /id:\s*['"]family['"]/);
  assert.match(nav, /id:\s*['"]pet['"]/);
  assert.match(nav, /id:\s*['"]rewards['"]/);
  assert.match(app, /activeView === 'family'/);
});

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

test('Rewards owns distinct value balances and no duplicated Pet progression sections', async () => {
  const rewards = await read('../src/views/RewardsView.jsx');
  assert.match(rewards, /NXP/);
  assert.match(rewards, /أكثر \/ Akthr/);
  assert.match(rewards, /كاش باك/);
  assert.match(rewards, /family-reward-activity/);
  assert.match(rewards, /cashback-milestones/);
  assert.doesNotMatch(rewards, /ChallengeCard|StreakFlame|ACHIEVEMENTS|SHOP_ITEMS|متجر إكسسوارات صقر/);
});
