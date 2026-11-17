// Renders preview frames / contact sheets of the film in Node for QA.
// Usage: CANVAS_MODULE=/path/to/node_modules/@napi-rs/canvas FONT_DIR=/path/to/node_modules/@fontsource \
//   node tools/preview.mjs <part1|part2|test> <out.png> <t1,t2,...> [cols] [scale]
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { createCanvas, GlobalFonts } = require(process.env.CANVAS_MODULE || '@napi-rs/canvas');
const FD = process.env.FONT_DIR || 'node_modules/@fontsource';
GlobalFonts.registerFromPath(`${FD}/anton/files/anton-latin-400-normal.woff2`, 'Anton');
GlobalFonts.registerFromPath(`${FD}/bangers/files/bangers-latin-400-normal.woff2`, 'Bangers');
for (const w of [500, 700, 800, 900]) GlobalFonts.registerFromPath(`${FD}/inter/files/inter-latin-${w}-normal.woff2`, 'Inter');
for (const w of [400, 700]) GlobalFonts.registerFromPath(`${FD}/jetbrains-mono/files/jetbrains-mono-latin-${w}-normal.woff2`, 'JetBrains Mono');

const { setCanvasFactory } = await import('../src/engine/gfx.js');
setCanvasFactory((w, h) => createCanvas(w, h));
const { renderFrame } = await import('../src/engine/stage.js');
const [which, out, times, colsArg, scaleArg] = process.argv.slice(2);
const mod = await import(`../src/film/${which}.js`);
const film = mod.default;
const ts = times === 'all' ? film.scenes.map((s) => +(s.start + Math.min(1.2, (s.end - s.start) * 0.6)).toFixed(2)) : times.split(',').map(Number);
const cols = +(colsArg || Math.min(ts.length, 4));
const scale = +(scaleArg || 0.25);
const rows = Math.ceil(ts.length / cols);
const { W, H } = await import('../src/engine/core.js');
const fw = W * scale, fh = H * scale;
const sheet = createCanvas(cols * fw, rows * fh);
const sx = sheet.getContext('2d');
const frame = createCanvas(W, H);
const fx = frame.getContext('2d');
let worst = 0;
for (let i = 0; i < ts.length; i++) {
  const t0 = performance.now();
  renderFrame(fx, film, ts[i], { captions: process.env.NOCAP ? false : true });
  worst = Math.max(worst, performance.now() - t0);
  sx.drawImage(frame, (i % cols) * fw, Math.floor(i / cols) * fh, fw, fh);
  sx.fillStyle = '#ff0'; sx.font = '20px Inter'; sx.fillText(ts[i].toFixed(2), (i % cols) * fw + 6, Math.floor(i / cols) * fh + 22);
}
fs.writeFileSync(out, sheet.toBuffer('image/png'));
console.log(`wrote ${out} (${ts.length} frames, worst ${worst.toFixed(0)}ms)`);
