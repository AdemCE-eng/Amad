import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { buildCelebrationPresentation } from '../src/lib/celebrationPresentation.js';

const read = (relativePath) => readFile(new URL(relativePath, import.meta.url), 'utf8');

test('achievement, challenge, and shop dialogs display the actual catalog outcome', () => {
  const achievement = buildCelebrationPresentation({ type: 'achievement', id: 'first_save' });
  assert.equal(achievement.title, 'أول توفير');
  assert.equal(achievement.reward, '+25 NXP');
  assert.match(achievement.description, /أول مبلغ/);

  const challenge = buildCelebrationPresentation({ type: 'challenge', id: 'less_coffee' });
  assert.equal(challenge.title, 'قهوة أقل هذا الأسبوع');
  assert.equal(challenge.reward, '+50 NXP');

  const accessory = buildCelebrationPresentation({ type: 'shop', id: 'sunglasses' }, 'صقر');
  assert.equal(accessory.title, 'نظارة شمسية');
  assert.equal(accessory.reward, 'التكلفة: 50 NXP');
  assert.match(accessory.description, /تم تجهيزها الآن/);
});

test('all meaningful rewards share the dark Nadeem dialog while equip changes stay inline', async () => {
  const [overlay, dialog, progression, app] = await Promise.all([
    read('../src/components/ui/CelebrationOverlay.jsx'),
    read('../src/components/ui/NadeemCelebrationDialog.jsx'),
    read('../src/components/pet/PetProgressionSections.jsx'),
    read('../src/App.jsx'),
  ]);

  assert.match(overlay, /<NadeemCelebrationDialog/);
  assert.match(overlay, /variant=\{presentation\.variant\}/);
  assert.match(overlay, /returnFocusKey=\{event\.returnFocusKey \|\| \(event\.type === 'shop' \? `accessory-\$\{event\.id\}` : null\)\}/);
  assert.match(overlay, /if \(activeRole !== 'rashid'\)/);
  assert.match(overlay, /queue\.current = \[\]/);
  assert.match(dialog, /bg-ink-card/);
  assert.match(dialog, /bg-black\/55/);
  assert.match(dialog, /data-focus-return-key/);
  assert.match(progression, /data-focus-return-key=\{`accessory-\$\{id\}`\}/);
  assert.doesNotMatch(dialog, /bg-white(?:\s|"|')/);
  assert.match(progression, /role="status"/);
  assert.match(progression, /aria-live="polite"/);
  assert.match(progression, /data-testid="accessory-equip-feedback"/);
  assert.doesNotMatch(progression, /NadeemCelebrationDialog|role="dialog"/);
  assert.match(app, /activeRole=\{activeRole\}/);
});

test('legacy full-screen confetti is absent from runtime dependencies and customer flows', async () => {
  const [packageJson, rewardNotice, savingsSheet, overlay] = await Promise.all([
    read('../package.json'),
    read('../src/components/ui/RewardNotice.jsx'),
    read('../src/components/ui/SavingsPlanSheet.jsx'),
    read('../src/components/ui/CelebrationOverlay.jsx'),
  ]);
  const runtime = `${packageJson}\n${rewardNotice}\n${savingsSheet}\n${overlay}`;
  assert.doesNotMatch(runtime, /canvas-confetti|from ['"].*confetti|burst\(/);
});
