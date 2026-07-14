import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('one-click launcher enables health-checked ML without blocking fallback startup', async () => {
  const launcher = await readFile(new URL('../../scripts/run-project.ps1', import.meta.url), 'utf8');
  assert.match(launcher, /Ml = Get-AvailablePort 8001/);
  assert.match(launcher, /artifacts\\models\\offer_model\.joblib/);
  assert.match(launcher, /artifacts\\models\\purchase_model\.joblib/);
  assert.match(launcher, /Wait-MlHealth \$mlUrl 60/);
  assert.match(launcher, /USE_ML_SERVICE' 'true'/);
  assert.match(launcher, /ML_SERVICE_TIMEOUT_MS' '1500'/);
  assert.match(launcher, /requirements\.txt/);
  assert.doesNotMatch(launcher, /requirements-dl|train_models|generate_demo_data/);
  assert.match(launcher, /ML service unavailable — deterministic fallback enabled/);
  assert.match(launcher, /Starting backend and Cheat Controller/);
});
