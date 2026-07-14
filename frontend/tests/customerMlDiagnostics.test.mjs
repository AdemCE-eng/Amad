import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const opportunitiesViewPath = new URL('../src/views/OpportunitiesView.jsx', import.meta.url);
const apiPath = new URL('../src/lib/api.js', import.meta.url);
const controllerPath = new URL('../../cheat-controller/index.html', import.meta.url);

test('customer recommendation cards do not render raw ML diagnostics', async () => {
  const source = await readFile(opportunitiesViewPath, 'utf8');
  assert.doesNotMatch(source, /recommendationResult\.source|recommendationResult\.fallbackReason/);
  assert.doesNotMatch(source, /data-testid=["']recommendation-source["']/);
  assert.match(source, /data-testid=["']recommendation-card["']/);
  assert.match(source, /opportunityResult\?\.recommendations \|\| \[\]/);
});

test('recommendation API still carries backend metadata to callers', async () => {
  const source = await readFile(apiPath, 'utf8');
  assert.match(source, /personalizedRecommendations/);
  assert.match(source, /\/api\/ml\/recommendations/);
});

test('Cheat Controller owns readable online and fallback status surfaces', async () => {
  const source = await readFile(controllerPath, 'utf8');
  assert.match(source, /id="mlServiceStatus"/);
  assert.match(source, /id="mlFallbackReason"/);
  assert.match(source, /id="mlOfferModel"/);
  assert.match(source, /id="mlPurchaseModel"/);
  assert.match(source, /function renderMlStatus/);
  assert.match(source, /function refreshMlStatus/);
});
