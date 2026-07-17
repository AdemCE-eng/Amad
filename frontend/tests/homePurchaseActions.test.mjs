import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (relativePath) => readFile(new URL(relativePath, import.meta.url), 'utf8');

test('Home ends with a removable panel for each cheat-controller purchase scenario', async () => {
  const [home, actions] = await Promise.all([
    read('../src/views/HomeView.jsx'),
    read('../src/components/ui/HomePurchaseActions.jsx'),
  ]);

  assert.match(home, /REMOVABLE_HOME_PURCHASE_ACTIONS/);
  assert.match(home, /<HomePurchaseActions\s*\/>/);
  assert.ok(home.indexOf('<HomePurchaseActions') > home.indexOf('data-testid="home-transactions"'));
  assert.match(actions, /data-testid="home-purchase-actions"/);
  assert.match(actions, /api\.purchase\(amount, category, transactionLabel\)/);
  assert.match(actions, /actionError/);
  for (const category of ['coffee', 'shopping', 'gas', 'groceries', 'dining', 'entertainment', 'subscriptions']) {
    assert.match(actions, new RegExp(`category: '${category}'`));
  }
});
