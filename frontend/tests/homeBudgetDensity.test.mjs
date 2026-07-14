import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (relativePath) => readFile(new URL(relativePath, import.meta.url), 'utf8');

test('Home keeps one compact live Saqr preview before a three-row Budget summary', async () => {
  const [home, budget] = await Promise.all([
    read('../src/views/HomeView.jsx'),
    read('../src/components/ui/BudgetOverview.jsx'),
  ]);
  const previewStart = home.indexOf('data-testid="home-saqr-preview"');
  const previewEnd = home.indexOf('{!accountOpen', previewStart);
  const preview = home.slice(previewStart, previewEnd);

  assert.equal(home.match(/data-testid="home-saqr-preview"/g)?.length, 1);
  assert.ok(home.indexOf('aria-label="الخدمات المصرفية السريعة"') < previewStart);
  assert.ok(previewStart < home.indexOf('<BudgetOverview'));
  assert.match(preview, /size=\{72\}/);
  assert.match(preview, /pet\.health|saqrStatus/);
  assert.match(preview, /game\.streak\.current/);
  assert.match(preview, /game\.equipped/);
  assert.match(preview, /setActiveView\('pet'\)/);
  assert.doesNotMatch(preview, /className="w-full/);

  assert.match(budget, /HOME_CATEGORY_LIMIT = 3/);
  assert.match(budget, /entries\.slice\(0, HOME_CATEGORY_LIMIT\)/);
  assert.match(budget, /entries\.length > HOME_CATEGORY_LIMIT/);
  assert.match(budget, /عرض تفاصيل الميزانية/);
});

test('Budget details owns every category and returns through the shared RTL header', async () => {
  const [details, app, categories] = await Promise.all([
    read('../src/views/BudgetDetailsView.jsx'),
    read('../src/App.jsx'),
    read('../src/components/budget/BudgetCategoryList.jsx'),
  ]);

  assert.match(details, /<NestedPageHeader title="تفاصيل الميزانية"/);
  assert.match(details, /setActiveView\('home'\)/);
  assert.match(details, /budgetEntries\(budgets\)/);
  assert.match(details, /<BudgetCategoryList entries=\{entries\}/);
  assert.match(details, /projectedRollover/);
  assert.match(details, /user\.rolloverTotal/);
  assert.match(categories, /data-testid="budget-category-row"/);
  assert.match(app, /activeView === 'budget-details'/);
  assert.match(app, /'budget-details'\]\.includes\(activeView\)/);
});
