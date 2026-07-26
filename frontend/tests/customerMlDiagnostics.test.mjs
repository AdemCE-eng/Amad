import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const opportunitiesViewPath = new URL('../src/views/OpportunitiesView.jsx', import.meta.url);
const apiPath = new URL('../src/lib/api.js', import.meta.url);

test('customer recommendation cards do not render raw ML diagnostics', async () => {
  const source = await readFile(opportunitiesViewPath, 'utf8');
  assert.doesNotMatch(source, /recommendationResult\.source|recommendationResult\.fallbackReason/);
  assert.doesNotMatch(source, /data-testid=["']recommendation-source["']/);
  assert.match(source, /data-testid=["']recommendation-card["']/);
  assert.match(source, /opportunityResult\?\.recommendations \|\| \[\]/);
});

test('fallback recommendations show customer-safe suitability instead of zero percent', async () => {
  const source = await readFile(opportunitiesViewPath, 'utf8');
  assert.match(source, /Number\.isFinite\(value\)/);
  assert.match(source, /'مناسبة'/);
  assert.match(source, /formatPurchaseSuitability\(opportunity\.purchaseProbability\)/);
  assert.doesNotMatch(source, /Math\.round\(opportunity\.purchaseProbability \* 100\)/);
});

test('recommendation API still carries backend metadata to callers', async () => {
  const source = await readFile(apiPath, 'utf8');
  assert.match(source, /personalizedRecommendations/);
  assert.match(source, /\/api\/ml\/recommendations/);
});
