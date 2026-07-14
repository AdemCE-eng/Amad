import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (relativePath) => readFile(new URL(relativePath, import.meta.url), 'utf8');

test('BottomNav exposes the final five product destinations with Saqr centered', async () => {
  const [nav, app] = await Promise.all([read('../src/components/ui/BottomNav.jsx'), read('../src/App.jsx')]);
  const ids = [...nav.matchAll(/id:\s*['"]([^'"]+)['"]/g)].map((match) => match[1]);
  assert.deepEqual(ids, ['home', 'family', 'pet', 'opportunities', 'rewards']);
  assert.match(nav, /id:\s*['"]pet['"].*center:\s*true/);
  assert.doesNotMatch(nav, /_transfer|_services|التحويل|الخدمات/);
  assert.match(app, /activeView === 'family'/);
  assert.match(app, /activeView === 'opportunities'/);
});

test('Family owns contributions and rewards but no merchant recommendations', async () => {
  const family = await read('../src/views/FamilyGoalView.jsx');
  assert.match(family, /api\.generatePlan/);
  assert.match(family, /api\.sendReward/);
  assert.match(family, /setActiveView\('home'\)/);
  assert.match(family, /setActiveView\('opportunities'\)/);
  assert.doesNotMatch(family, /personalizedRecommendations|recommendation-card|merchantNameAr/);
});

test('Opportunities owns fresh analysis, ranked cards, and limited expansion', async () => {
  const opportunities = await read('../src/views/OpportunitiesView.jsx');
  assert.match(opportunities, /api\.personalizedRecommendations\('rashid'\)/);
  assert.match(opportunities, /setOpportunityResult\(null\)/);
  assert.match(opportunities, /additional\.slice\(0, 3\)/);
  assert.match(opportunities, /عرض المزيد/);
  assert.match(opportunities, /عرض أقل/);
  assert.match(opportunities, /data-testid="best-opportunity"/);
  assert.match(opportunities, /api\.decideOffer/);
  assert.doesNotMatch(opportunities, /recommendationResult\.source|fallbackReason|data-testid="recommendation-source"/);
});
