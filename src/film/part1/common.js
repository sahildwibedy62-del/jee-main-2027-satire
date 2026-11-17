// Shared imports + helpers for the Part 1 scenes.
import { PART1_LINES } from '../cues.js';
import { timing, speaking } from '../kit.js';
import { card as _card, circle as _circle, rr as _rr } from '../../engine/gfx.js';
import { txt as _txt } from '../../engine/type.js';

export * from '../kit.js';
export { txt, wrap, measure, fit, smash, letters, block3D, flyIn, flyThrough, reveal, underline, scribbleCircle, stamp, count, stretch, punct } from '../../engine/type.js';
export { paperBG, halftone, card, rr, circle, line, burst, rays, star, heart, spinner, tick, cross, dotFill, speedLines, streaks, bubble, arrow, drop, grawlix, progress, impactFlash, vignette } from '../../engine/gfx.js';
export { student, head, crowd, POSES, mixPose } from '../../engine/char.js';
export * from '../../engine/props.js';
export { spring, pulse, hit, keys, shake } from '../../engine/core.js';

export const TL = timing(PART1_LINES);
export const LN = TL.LN;
/** Absolute time at which `needle` is spoken in line i. */
export const wt = TL.wt;
/** Line start / end. */
export const ls = (i) => LN[i].s;
export const le = (i) => LN[i].e;
/** Mouth-flap helper. */
export const talking = (T, ...idx) => speaking(LN, T, ...idx);

/** Simple cartoon brain blob (used for "akal" gags). */
export function brain(ctx, x, y, r, T, { fill = '#ff9db5' } = {}) {
  if (r < 1) return;
  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  for (let i = 0; i <= 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    const k = 1 + 0.08 * Math.sin(a * 7 + T * 2);
    ctx.lineTo(Math.cos(a) * r * 1.2 * k, Math.sin(a) * r * 0.9 * k);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.lineWidth = Math.max(3, r * 0.06);
  ctx.strokeStyle = '#0d0c0b';
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, -r * 0.85);
  ctx.quadraticCurveTo(r * 0.15, 0, 0, r * 0.85);
  for (let i = 0; i < 4; i++) {
    const yy = -r * 0.5 + i * r * 0.32;
    ctx.moveTo(-r * 0.9, yy);
    ctx.quadraticCurveTo(-r * 0.5, yy - r * 0.25, -r * 0.2, yy);
    ctx.moveTo(r * 0.2, yy + r * 0.1);
    ctx.quadraticCurveTo(r * 0.5, yy - r * 0.15, r * 0.9, yy + r * 0.1);
  }
  ctx.lineWidth = Math.max(2, r * 0.045);
  ctx.stroke();
  ctx.restore();
}

/** Aadhaar-style ID card (fictional layout). */
export function idCard(ctx, x, y, s, name, { rot = 0, title = 'AADHAAR', color = '#ff8a3d', bad = -1 } = {}) {
  const cd = _card, tx = _txt, ci = _circle, r = _rr;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.scale(s, s);
  cd(ctx, -330, -200, 660, 400, { fill: '#fffaf0', r: 26, shadow: 16 });
  ctx.save();
  r(ctx, -330, -200, 660, 90, 26);
  ctx.clip();
  ctx.fillStyle = color;
  ctx.fillRect(-330, -200, 660, 90);
  ctx.restore();
  r(ctx, -330, -200, 660, 400, 26);
  ctx.lineWidth = 7;
  ctx.strokeStyle = '#0d0c0b';
  ctx.stroke();
  tx(ctx, title, 0, -154, { size: 50, fill: '#fffaf0', stroke: '#0d0c0b', lw: 8, track: 4 });
  cd(ctx, -290, -80, 170, 210, { fill: '#e6dcc4', r: 14, shadow: 0, lw: 6 });
  ci(ctx, -205, -20, 44, '#c98a5a', '#0d0c0b', 6);
  ctx.fillStyle = '#0d0c0b';
  ctx.beginPath();
  ctx.arc(-205, -32, 46, Math.PI, 0);
  ctx.fill();
  tx(ctx, 'NAAM', -80, -50, { size: 26, font: 'Inter', weight: '800', fill: '#5b564d', align: 'left' });
  // name letters, optionally highlighting a bad index
  ctx.save();
  ctx.font = '800 46px "JetBrains Mono"';
  let cx = -80;
  [...name].forEach((ch, i) => {
    const w = ctx.measureText(ch).width;
    if (i === bad) {
      ctx.fillStyle = 'rgba(255,46,46,0.35)';
      ctx.fillRect(cx - 4, -28, w + 8, 56);
    }
    ctx.fillStyle = i === bad ? '#c41616' : '#0d0c0b';
    ctx.textBaseline = 'middle';
    ctx.fillText(ch, cx, 2);
    cx += w;
  });
  ctx.restore();
  tx(ctx, 'DOB: 01/01/2009', -80, 66, { size: 30, font: 'JetBrains Mono', fill: '#0d0c0b', align: 'left' });
  tx(ctx, 'XXXX XXXX 2027', -80, 116, { size: 30, font: 'JetBrains Mono', fill: '#0d0c0b', align: 'left' });
  ctx.restore();
}
