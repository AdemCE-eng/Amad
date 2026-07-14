import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (relativePath) => readFile(new URL(relativePath, import.meta.url), 'utf8');

test('Home shows a compact live Saqr preview only after savings activation', async () => {
  const home = await read('../src/views/HomeView.jsx');
  const quickActionsIndex = home.indexOf('aria-label="الخدمات المصرفية السريعة"');
  const previewIndex = home.indexOf('data-testid="home-saqr-preview"');
  const budgetIndex = home.indexOf('<BudgetOverview');

  assert.match(home, /data-testid="home-saqr-preview"/);
  assert.equal(home.match(/data-testid="home-saqr-preview"/g)?.length, 1);
  assert.ok(quickActionsIndex >= 0 && quickActionsIndex < previewIndex);
  assert.ok(previewIndex < budgetIndex);
  assert.match(home, /\{accountOpen && \(/);
  assert.match(home, /<Mascot emotion=\{emotion\} stage=\{game\.stage\} equipped=\{game\.equipped\}/);
  assert.match(home, /pet\.health/);
  assert.match(home, /game\.streak\.current/);
  assert.match(home, /setActiveView\('pet'\)/);
  assert.match(home, /افتح صقر/);
  assert.doesNotMatch(home, /PetProgressionSections|SHOP_ITEMS|EmergencyWithdrawModal/);
});

test('center navigation uses the real state-driven Mascot and preserves tab order', async () => {
  const [app, nav] = await Promise.all([
    read('../src/App.jsx'),
    read('../src/components/ui/BottomNav.jsx'),
  ]);
  const ids = [...nav.matchAll(/id:\s*['"]([^'"]+)['"]/g)].map((match) => match[1]);

  assert.deepEqual(ids, ['home', 'family', 'pet', 'opportunities', 'rewards']);
  assert.match(nav, /import Mascot from/);
  assert.match(nav, /stage=\{game\?\.stage \?\? 0\}/);
  assert.match(nav, /equipped=\{game\?\.equipped \?\? null\}/);
  assert.match(nav, /bg-coral\/20 border-coral\/60/);
  assert.doesNotMatch(nav, /🐤|🐣|🐥/);
  assert.match(app, /pet=\{pet\} game=\{game\}/);
});
