import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (relativePath) => readFile(new URL(relativePath, import.meta.url), 'utf8');

test('purchases do not shake the customer app and the preview action stays contained', async () => {
  const [context, home, styles] = await Promise.all([
    read('../src/context/AppDataContext.jsx'),
    read('../src/views/HomeView.jsx'),
    read('../src/index.css'),
  ]);

  assert.doesNotMatch(context, /setIsShaking|rgba\(239, 68, 68/);
  assert.doesNotMatch(home, /isShaking|animate-screen-shake/);
  assert.doesNotMatch(styles, /@keyframes shakeScreen|\.animate-screen-shake/);
  assert.match(home, /max-w-\[112px\]/);
  assert.match(home, /<span className="truncate">اطلع على/);
});

test('the customer-facing accessory catalog offers a cap while legacy shemagh data stays compatible', async () => {
  const [catalog, mascot, gameEngine] = await Promise.all([
    read('../src/lib/catalog.js'),
    read('../src/components/mascot/Mascot.jsx'),
    read('../../backend/src/logic/gameEngine.js'),
  ]);

  assert.match(catalog, /cap: \{ name: 'كاب صقر'/);
  assert.doesNotMatch(catalog, /شماغ/);
  assert.match(mascot, /id === 'cap' \|\| id === 'shemagh'/);
  assert.match(gameEngine, /itemId === "shemagh" \? "cap" : itemId/);
});
