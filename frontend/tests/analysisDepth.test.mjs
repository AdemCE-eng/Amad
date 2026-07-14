import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (relativePath) => readFile(new URL(relativePath, import.meta.url), 'utf8');

test('family contribution calculation stages a fresh immediate backend request', async () => {
  const family = await read('../src/views/FamilyGoalView.jsx');

  for (const stage of [
    'نحلل دخل والتزامات أفراد العائلة',
    'نحسب القدرة الادخارية لكل فرد',
    'نوزع المساهمات بشكل عادل',
    'الخطة جاهزة',
  ]) assert.match(family, new RegExp(stage));
  assert.match(family, /CONTRIBUTION_MIN_MS = 3200/);
  assert.match(family, /request: \(\) => api\.generatePlan\(\)/);
  assert.match(family, /if \(planRunning\.current\) return/);
  assert.match(family, /setVisiblePlan\(null\)/);
  assert.match(family, /response\.contributionPlan/);
  assert.match(family, /startFrom=\{0\}/);
  assert.match(family, /إعادة المحاولة/);
  assert.match(family, /إعادة حساب الخطة/);
});

test('opportunity analysis uses five stages and waits 4.8 seconds around the live request', async () => {
  const opportunities = await read('../src/views/OpportunitiesView.jsx');

  for (const stage of [
    'نقرأ أنماط مشترياتك',
    'نقدّر احتمالية الشراء',
    'نحلل المواسم وحملات التجار',
    'نقارن فرص التوفير بميزانيتك',
    'نرتب أفضل الفرص لك',
  ]) assert.match(opportunities, new RegExp(stage));
  assert.match(opportunities, /ANALYSIS_MIN_MS = 4800/);
  assert.match(opportunities, /request: \(\) => api\.personalizedRecommendations\('rashid'\)/);
  assert.match(opportunities, /if \(running\.current\) return/);
  assert.match(opportunities, /setOpportunityResult\(null\)/);
  assert.match(opportunities, /setExpanded\(false\)/);
  assert.match(opportunities, /إعادة المحاولة/);
  assert.doesNotMatch(opportunities, /recommendationResult\.source|fallbackReason|data-testid="recommendation-source"/);
});

test('shared staged progress is perceivable without depending on animation', async () => {
  const progress = await read('../src/components/ui/StagedProgress.jsx');
  assert.match(progress, /aria-busy="true"/);
  assert.match(progress, /aria-live="polite"/);
  assert.match(progress, /role="progressbar"/);
  assert.match(progress, /aria-valuenow=\{progress\}/);
  assert.match(progress, /motion-reduce:animate-none/);
  assert.match(progress, /motion-reduce:transition-none/);
});
