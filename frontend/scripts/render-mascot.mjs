// Golden-frame renderer: server-renders the Mascot in every emotion/stage
// and rasterizes to PNG. Used for cuteness checkpoints and as visual
// regression frames — no browser involved (Framer Motion resolves `animate`
// values as initial inline styles during SSR).
//
//   node scripts/render-mascot.mjs [outDir]
import { build } from 'esbuild';
import { mkdirSync, writeFileSync } from 'fs';
import { pathToFileURL } from 'url';
import path from 'path';
import sharp from 'sharp';

const outDir = process.argv[2] || 'mascot-frames';
mkdirSync(outDir, { recursive: true });
// The bundle must live inside the package so node resolves react/motion.
const bundleDir = path.resolve('scripts/.tmp');
mkdirSync(bundleDir, { recursive: true });

// Bundle Mascot + a render entry to a temp ESM file, then import it.
const entry = `
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import Mascot from './src/components/mascot/Mascot.jsx';
import { EMOTIONS } from './src/components/mascot/emotions.js';

export function renderAll() {
  const frames = {};
  for (const emotion of Object.keys(EMOTIONS)) {
    frames['emotion-' + emotion] = renderToStaticMarkup(
      React.createElement(Mascot, { emotion, stage: 1, size: 240, track: false })
    );
  }
  for (const stage of [0, 1, 2]) {
    frames['stage-' + stage] = renderToStaticMarkup(
      React.createElement(Mascot, { emotion: 'idle', stage, size: 240, track: false })
    );
  }
  for (const acc of ['shemagh', 'sunglasses', 'falcon_hood']) {
    frames['acc-' + acc] = renderToStaticMarkup(
      React.createElement(Mascot, { emotion: 'happy', stage: 1, equipped: acc, size: 240, track: false })
    );
  }
  return frames;
}
`;
writeFileSync(path.join(outDir, '_entry.jsx'), entry);

await build({
  stdin: { contents: entry, resolveDir: process.cwd(), loader: 'jsx' },
  bundle: true,
  format: 'esm',
  platform: 'node',
  jsx: 'automatic',
  packages: 'external', // node resolves react/motion itself; only our JSX gets transpiled
  outfile: path.join(bundleDir, "_bundle.mjs"),
  logLevel: 'silent',
});

const { renderAll } = await import(pathToFileURL(path.join(bundleDir, "_bundle.mjs")).href);
const frames = renderAll();

for (const [name, svg] of Object.entries(frames)) {
  const doc = svg;
  writeFileSync(path.join(outDir, `${name}.svg`), doc);
  await sharp(Buffer.from(doc), { density: 150 })
    .flatten({ background: '#ffffff' })
    .resize(360, 360, { fit: 'contain', background: '#ffffff' })
    .png()
    .toFile(path.join(outDir, `${name}.png`));
}
console.log(`rendered ${Object.keys(frames).length} frames → ${outDir}/`);
