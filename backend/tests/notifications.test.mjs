import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildNotification,
  normalizeRecipientId,
  normalizeStoredNotification,
  sortNotifications,
} from '../src/logic/notificationEngine.js';

test('notification records have stable recipient-aware fields', () => {
  const item = buildNotification({
    id: 'reward_1', recipientId: 'rashid', type: 'parent_reward',
    title: 'مكافأة', body: 'أحسنت', timestamp: 123,
  });
  assert.deepEqual(item, {
    id: 'reward_1', recipientId: 'rashid', type: 'parent_reward',
    title: 'مكافأة', body: 'أحسنت', timestamp: 123, read: false,
  });
  assert.equal(normalizeRecipientId('ghost'), null);
});

test('legacy records normalize and notifications sort newest first', () => {
  const old = normalizeStoredNotification({ message: 'قديم', createdAt: 1 }, 'old');
  const current = normalizeStoredNotification({ body: 'جديد', timestamp: 2, recipientId: 'rashid' }, 'new');
  assert.equal(old.recipientId, 'rashid');
  assert.equal(old.body, 'قديم');
  assert.deepEqual(sortNotifications([old, current]).map((item) => item.id), ['new', 'old']);
});
