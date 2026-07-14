import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (relativePath) => readFile(new URL(relativePath, import.meta.url), 'utf8');

test('Home owns the product header, previews, and four recent transactions', async () => {
  const home = await read('../src/views/HomeView.jsx');
  assert.match(home, /data-testid="namo-home-header"/);
  assert.match(home, /unreadNotificationCount > 0/);
  assert.match(home, /data-testid="home-family-preview"/);
  assert.match(home, /setActiveView\('family'\)/);
  assert.match(home, /data-testid="home-opportunity-preview"/);
  assert.match(home, /setActiveView\('opportunities'\)/);
  assert.match(home, /slice\(0, 4\)/);
  assert.match(home, /transactions\.length > 4/);
  assert.match(home, /setActiveView\('transactions'\)/);
  assert.doesNotMatch(home, /setInterval|addNotification|Edit3/);
});

test('full transactions are sorted, filterable, and return to Home', async () => {
  const transactions = await read('../src/views/TransactionsView.jsx');
  assert.match(transactions, /sort\(\(a, b\) => b\.timestamp - a\.timestamp\)/);
  assert.match(transactions, /transaction\.type === filter/);
  assert.match(transactions, /setActiveView\('home'\)/);
  assert.match(transactions, /data-testid="all-transactions"/);
});
