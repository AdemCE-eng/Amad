import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (relativePath) => readFile(new URL(relativePath, import.meta.url), 'utf8');

test('stage zero keeps the original Saqr-in-egg treatment', async () => {
  const mascot = await read('../src/components/mascot/Mascot.jsx');

  assert.match(mascot, /\{stage === 0 && \(/);
  assert.match(mascot, /data-mascot-stage="egg"/);
  assert.match(mascot, /L75,148 L90,160/);
  assert.doesNotMatch(mascot, /Stage zero is a closed egg/);
});

test('onboarding derives a yearly goal and keeps amount fields naturally editable', async () => {
  const sheet = await read('../src/components/ui/SavingsPlanSheet.jsx');

  assert.match(sheet, /<Mascot emotion=\{petName \? 'happy' : 'idle'\} stage=\{0\}/);
  assert.match(sheet, /setGoal\(String\(Math\.max\(1, res\.plan\.monthlyTarget \* 12\)\)\)/);
  assert.match(sheet, /onChange=\{\(e\) => setTarget\(e\.target\.value\)\}/);
  assert.match(sheet, /onChange=\{\(e\) => setGoal\(e\.target\.value\)\}/);
  assert.match(sheet, /هدف مقترح لمدة 12 شهرًا/);
  assert.match(sheet, /disabled=\{targetNum <= 0 \|\| targetNum > incomeNum \|\| goalNum <= 0\}/);
  assert.doesNotMatch(sheet, /القيمة الافتراضية 4000/);
});
