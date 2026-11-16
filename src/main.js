import '@fontsource/anton';
import '@fontsource/bangers';
import '@fontsource/inter/800.css';
import '@fontsource/jetbrains-mono';
import { setCanvasFactory } from './engine/gfx.js';
import { renderFrame } from './engine/stage.js';
import sheet from './film/modelsheet.js';

setCanvasFactory((w, h) => {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
});

const ctx = document.getElementById('c').getContext('2d');
await document.fonts.ready;
const t0 = performance.now();
function loop() {
  const t = ((performance.now() - t0) / 1000) % sheet.duration;
  renderFrame(ctx, sheet, t, { captions: false });
  requestAnimationFrame(loop);
}
loop();
