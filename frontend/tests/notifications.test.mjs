import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  mergeNotifications,
  notificationsForRecipient,
} from '../src/lib/notifications.js';

test('unread notifications are isolated to the active recipient', () => {
  const input = {
    a: { id: 'a', recipientId: 'rashid', body: 'راشد', timestamp: 2, read: false },
    b: { id: 'b', recipientId: 'ahmed', body: 'أحمد', timestamp: 3, read: false },
  };
  const rashid = notificationsForRecipient(input, 'rashid');
  assert.equal(rashid.length, 1);
  assert.equal(rashid.filter((item) => !item.read).length, 1);
  assert.equal(notificationsForRecipient(input, 'ahmed')[0].id, 'b');
  assert.deepEqual(mergeNotifications(rashid, rashid).map((item) => item.id), ['a']);
});

test('notification UI uses realtime listeners, stable keys, and safe read handling', async () => {
  const [home, view, hook] = await Promise.all([
    readFile(new URL('../src/views/HomeView.jsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/views/NotificationsView.jsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/lib/useUserNotifications.js', import.meta.url), 'utf8'),
  ]);
  assert.doesNotMatch(home, /setInterval|WOOHOOOO|YOOO|addNotification/);
  assert.match(home, /unreadNotificationCount > 0/);
  assert.match(hook, /watch\(`\/userNotifications\/\$\{recipientId\}`/);
  assert.match(hook, /unsubscribeCurrent\(\)/);
  assert.match(view, /key=\{notification\.id\}/);
  assert.match(view, /markAllNotificationsRead\(activeRole\)\.catch/);
  assert.match(view, /notificationsLoaded/);
});
