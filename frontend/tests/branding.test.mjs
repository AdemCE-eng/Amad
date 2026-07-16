import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';

const read = (relativePath) => readFile(new URL(relativePath, import.meta.url), 'utf8');
const OLD_VISIBLE_BRAND = /\bNamo\b|نامو|alinma-poc/;

test('customer-facing surfaces consistently present Nadeem branding', async () => {
  const files = await Promise.all([
    read('../../README.md'),
    read('../README.md'),
    read('../index.html'),
    read('../src/views/HomeView.jsx'),
    read('../../cheat-controller/index.html'),
    read('../../docs/CURRENT_ARCHITECTURE.md'),
    read('../../ml-service/app/main.py'),
    read('../../scripts/run-project.ps1'),
  ]);
  const visibleSource = files.join('\n');

  assert.match(visibleSource, /Nadeem/);
  assert.match(visibleSource, /نديم/);
  assert.doesNotMatch(visibleSource, OLD_VISIBLE_BRAND);
});

test('README and every shipped SVG are free of old visible branding', async () => {
  const readme = await read('../../README.md');
  assert.match(readme, /visual-design\/assets\/svg\/nadeem-system-architecture\.svg/);

  const svgRoots = [
    ['../../visual-design/assets/svg/', new URL('../../visual-design/assets/svg/', import.meta.url)],
    ['../public/', new URL('../public/', import.meta.url)],
  ];
  let svgCount = 0;
  for (const [prefix, root] of svgRoots) {
    const names = await readdir(root, { recursive: true });
    for (const name of names.filter((entry) => entry.endsWith('.svg'))) {
      const source = await read(`${prefix}${name.replaceAll('\\', '/')}`);
      assert.match(source, /<svg\b/, `${name} is not an SVG document`);
      assert.doesNotMatch(source, OLD_VISIBLE_BRAND, `${name} contains old branding`);
      svgCount += 1;
    }
  }
  assert.ok(svgCount >= 10, 'the complete SVG set was audited');
});
