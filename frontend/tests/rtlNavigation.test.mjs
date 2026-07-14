import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (relativePath) => readFile(new URL(relativePath, import.meta.url), 'utf8');

test('nested pages share an accessible right-facing RTL back header', async () => {
  const [header, notifications, transactions] = await Promise.all([
    read('../src/components/ui/NestedPageHeader.jsx'),
    read('../src/views/NotificationsView.jsx'),
    read('../src/views/TransactionsView.jsx'),
  ]);

  assert.match(header, /import \{ ChevronRight \}/);
  assert.match(header, /aria-label="رجوع"/);
  assert.match(header, /data-testid="nested-page-header"/);
  assert.match(notifications, /<NestedPageHeader title="الإشعارات"/);
  assert.match(transactions, /<NestedPageHeader title="كل العمليات"/);
  assert.match(notifications, /setActiveView\('home'\)/);
  assert.match(transactions, /setActiveView\('home'\)/);
  assert.doesNotMatch(notifications, /ArrowRight|ChevronRight/);
  assert.doesNotMatch(transactions, /ArrowRight|ChevronRight/);
});

test('top-level Pet destination does not duplicate BottomNav with a back control', async () => {
  const petRoom = await read('../src/views/PetRoomView.jsx');

  assert.doesNotMatch(petRoom, /ChevronRight|NestedPageHeader|setActiveView/);
  assert.match(petRoom, /غرفة \{petName\}/);
  assert.match(petRoom, /<CoinPill coins=\{game\.nxp_balance\}/);
});
