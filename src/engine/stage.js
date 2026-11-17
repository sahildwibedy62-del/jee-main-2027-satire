// Scene runner: finds the active scene for a timestamp, renders transitions,
// overlays captions and grain. Pure function of (film, t) -> pixels.
import { W, H, PAL, FONT, clamp, lerp, ease, hash, seg, shake } from './core.js';
import { makeCanvas, grain, vignette, rr, streaks, impactFlash, halftone } from './gfx.js';
import { wrap } from './type.js';

/**
 * Film definition:
 * { id, title, duration, scenes:[{ id, start, end, title, desc, trans, draw(ctx, lt, S) }], cues:[{s,e,text}] }
 * `trans` describes how this scene enters: { type: 'cut'|'smash'|'whip'|'wipe'|'iris'|'zoom'|'glitch'|'tear', dur }
 */
export function sceneAt(film, t) {
  const sc = film.scenes;
  let lo = 0, hi = sc.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (sc[mid].start <= t) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}

let bufA = null, bufB = null;
function buffers() {
  if (!bufA) {
    bufA = makeCanvas(W, H);
    bufB = makeCanvas(W, H);
  }
  return [bufA.getContext('2d'), bufB.getContext('2d')];
}

function drawScene(ctx, film, i, t) {
  const s = film.scenes[i];
  const lt = t - s.start;
  ctx.save();
  s.draw(ctx, lt, { dur: s.end - s.start, t, film, scene: s, p: clamp(lt / (s.end - s.start)) });
  ctx.restore();
}

export function renderFrame(ctx, film, t, opts = {}) {
  const { captions = true, grainOn = true } = opts;
  t = clamp(t, 0, film.duration - 1e-6);
  const i = sceneAt(film, t);
  const s = film.scenes[i];
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = PAL.ink;
  ctx.fillRect(0, 0, W, H);

  // Transition into the current scene (first `dur` seconds), or out (handled by next scene).
  const tr = s.trans || { type: 'cut' };
  const tdur = tr.dur ?? 0.4;
  const into = t - s.start;
  if (i > 0 && tr.type !== 'cut' && into < tdur) {
    const p = into / tdur;
    transition(ctx, film, i, t, tr.type, p, tr);
  } else {
    drawScene(ctx, film, i, t);
  }

  if (grainOn) grain(ctx, t, 0.9);
  if (captions) drawCaption(ctx, film, t);
  ctx.restore();
}

function transition(ctx, film, i, t, type, p, tr) {
  const [a, b] = buffers();
  const drawPrev = (c) => {
    c.save();
    c.setTransform(1, 0, 0, 1, 0, 0);
    drawScene(c, film, i - 1, t);
    c.restore();
  };
  const drawNext = (c) => {
    c.save();
    c.setTransform(1, 0, 0, 1, 0, 0);
    drawScene(c, film, i, t);
    c.restore();
  };
  const A = a.canvas, B = b.canvas;
  if (type === 'smash') {
    // Impact frame then hard cut with a decaying shake.
    drawScene(ctx, film, i, t);
    if (p < 0.18) {
      ctx.save();
      ctx.globalCompositeOperation = 'difference';
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
    } else impactFlash(ctx, (1 - p) * 0.35, PAL.yellow);
    return;
  }
  if (type === 'whip') {
    const dir = tr.dir || 1;
    drawPrev(a);
    drawNext(b);
    const e = ease.inOutExpo(p);
    const off = e * W * dir;
    const blur = Math.sin(p * Math.PI);
    const n = 6;
    for (const [img, base] of [[A, -off], [B, W * dir - off]]) {
      for (let k = 0; k < n; k++) {
        ctx.globalAlpha = k === 0 ? 1 : (0.35 * blur) / k;
        ctx.drawImage(img, base + k * 40 * blur * dir, 0);
      }
    }
    ctx.globalAlpha = 1;
    streaks(ctx, t, { alpha: 0.55 * blur, color: PAL.paper, dir });
    return;
  }
  if (type === 'wipe') {
    drawPrev(a);
    drawNext(b);
    ctx.drawImage(A, 0, 0);
    const e = ease.inOutCubic(p);
    const x = lerp(-W * 0.6, W * 1.6, e);
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x - 600, -100);
    ctx.lineTo(x + 300, -100);
    ctx.lineTo(x - 300, H + 100);
    ctx.lineTo(x - 1200, H + 100);
    ctx.lineTo(-2000, H + 100);
    ctx.lineTo(-2000, -100);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(B, 0, 0);
    ctx.restore();
    // colour band
    ctx.fillStyle = tr.color || PAL.yellow;
    ctx.beginPath();
    ctx.moveTo(x + 300, -100);
    ctx.lineTo(x + 460, -100);
    ctx.lineTo(x - 140, H + 100);
    ctx.lineTo(x - 300, H + 100);
    ctx.closePath();
    ctx.fill();
    ctx.lineWidth = 8;
    ctx.strokeStyle = PAL.ink;
    ctx.stroke();
    return;
  }
  if (type === 'iris') {
    drawPrev(a);
    drawNext(b);
    ctx.drawImage(A, 0, 0);
    const r = ease.inOutCubic(p) * 1250;
    const cx = tr.x ?? W / 2, cy = tr.y ?? H / 2;
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, Math.max(1, r), 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(B, 0, 0);
    ctx.restore();
    ctx.beginPath();
    ctx.arc(cx, cy, Math.max(1, r), 0, Math.PI * 2);
    ctx.lineWidth = 18;
    ctx.strokeStyle = PAL.ink;
    ctx.stroke();
    return;
  }
  if (type === 'zoom') {
    // Zoom through the outgoing frame into the incoming one.
    drawPrev(a);
    drawNext(b);
    const e = ease.inOutExpo(p);
    const fx = tr.x ?? W / 2, fy = tr.y ?? H / 2;
    if (p < 0.5) {
      const s = 1 + e * 5;
      ctx.save();
      ctx.translate(fx, fy);
      ctx.scale(s, s);
      ctx.translate(-fx, -fy);
      ctx.drawImage(A, 0, 0);
      ctx.restore();
    } else {
      const s = 0.4 + 0.6 * e;
      ctx.drawImage(A, 0, 0);
      ctx.save();
      ctx.globalAlpha = clamp((p - 0.5) * 4);
      ctx.translate(W / 2, H / 2);
      ctx.scale(lerp(3, 1, e), lerp(3, 1, e));
      ctx.translate(-W / 2, -H / 2);
      ctx.drawImage(B, 0, 0);
      ctx.restore();
      void s;
    }
    impactFlash(ctx, Math.sin(p * Math.PI) * 0.25, PAL.white);
    return;
  }
  if (type === 'glitch') {
    drawPrev(a);
    drawNext(b);
    const src = p < 0.5 ? A : B;
    ctx.drawImage(src, 0, 0);
    const k = Math.sin(p * Math.PI);
    const f = Math.floor(t * 30);
    for (let s = 0; s < 14; s++) {
      const y = hash(s, f) * H;
      const h = 20 + hash(s, f + 1) * 160;
      const dx = (hash(s, f + 2) - 0.5) * 260 * k;
      ctx.drawImage(hash(s, f + 3) > 0.5 ? A : B, 0, y, W, h, dx, y, W, h);
    }
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';
    ctx.globalAlpha = 0.5 * k;
    ctx.fillStyle = PAL.cyan;
    ctx.fillRect(0, hash(f, 9) * H, W, 60);
    ctx.fillStyle = PAL.red;
    ctx.fillRect(0, hash(f, 10) * H, W, 40);
    ctx.restore();
    return;
  }
  if (type === 'tear') {
    // Paper tear: incoming scene revealed under a ripped edge sliding up.
    drawPrev(a);
    drawNext(b);
    ctx.drawImage(B, 0, 0);
    const e = ease.inOutCubic(p);
    const edge = lerp(H + 100, -200, e);
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, -10);
    ctx.lineTo(W, -10);
    for (let i = 0; i <= 24; i++) {
      const x = W - (i / 24) * W;
      ctx.lineTo(x, edge + (hash(i, 31) - 0.5) * 70 - (i % 2) * 20);
    }
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(A, 0, 0);
    ctx.restore();
    ctx.save();
    ctx.beginPath();
    for (let i = 0; i <= 24; i++) {
      const x = W - (i / 24) * W;
      ctx.lineTo(x, edge + (hash(i, 31) - 0.5) * 70 - (i % 2) * 20);
    }
    ctx.lineWidth = 16;
    ctx.strokeStyle = PAL.white;
    ctx.stroke();
    ctx.lineWidth = 4;
    ctx.strokeStyle = PAL.ink;
    ctx.stroke();
    ctx.restore();
    return;
  }
  if (type === 'halftone') {
    drawPrev(a);
    drawNext(b);
    ctx.drawImage(A, 0, 0);
    ctx.save();
    // dot mask growing
    ctx.beginPath();
    const size = 60;
    const r = ease.inOutCubic(p) * size * 0.75;
    for (let y = 0; y < H + size; y += size) for (let x = 0; x < W + size; x += size) {
      ctx.moveTo(x + r, y);
      ctx.arc(x, y, Math.max(0.1, r * (1 + (y / H) * 0.6)), 0, Math.PI * 2);
    }
    ctx.clip();
    ctx.drawImage(B, 0, 0);
    ctx.restore();
    return;
  }
  drawScene(ctx, film, i, t);
}

// ---------- captions ----------

export function cueAt(film, t) {
  const cues = film.cues;
  for (let i = 0; i < cues.length; i++) {
    const c = cues[i];
    if (t >= c.s - 0.05 && t < c.e + 0.25) return c;
  }
  return null;
}

/**
 * Readable bottom captions with word-by-word emphasis (active word turns yellow).
 * Word timing is estimated proportionally to character count inside each cue.
 */
export function drawCaption(ctx, film, t) {
  const c = cueAt(film, t);
  if (!c) return;
  const size = 40;
  const maxW = 1400;
  const lines = wrap(ctx, c.text, maxW, size, FONT.ui, '800');
  const lh = size * 1.28;
  const boxH = lines.length * lh + 40;
  const y0 = H - 92 - boxH / 2;
  const fadeIn = clamp((t - (c.s - 0.05)) / 0.1);
  const fadeOut = 1 - clamp((t - c.e - 0.1) / 0.15);
  const a = Math.min(fadeIn, fadeOut);
  if (a <= 0) return;
  ctx.save();
  ctx.globalAlpha = a;
  ctx.font = `800 ${size}px "${FONT.ui}"`;
  let maxLineW = 0;
  for (const l of lines) maxLineW = Math.max(maxLineW, ctx.measureText(l).width);
  const bw = maxLineW + 56;
  ctx.fillStyle = 'rgba(13,12,11,0.86)';
  rr(ctx, W / 2 - bw / 2, y0 + (1 - fadeIn) * 14, bw, boxH, 26);
  ctx.fill();
  // timing
  const total = c.text.replace(/\s+/g, '').length;
  const prog = clamp((t - c.s) / Math.max(0.2, c.e - c.s)) * total;
  let acc = 0;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  lines.forEach((l, li) => {
    const words = l.split(' ');
    let lw = ctx.measureText(l).width;
    let x = W / 2 - lw / 2;
    const y = y0 + 20 + lh * li + lh / 2 + (1 - fadeIn) * 14;
    words.forEach((w) => {
      const wl = w.length;
      const active = prog >= acc && prog < acc + wl + 0.5;
      const spoken = prog >= acc + wl;
      ctx.fillStyle = active ? PAL.yellow : spoken ? PAL.white : 'rgba(255,250,240,0.62)';
      ctx.fillText(w, x, y + (active ? -2 : 0));
      x += ctx.measureText(w + ' ').width;
      acc += wl;
    });
  });
  ctx.restore();
}

/** Helper for scenes: apply a camera (centre-based zoom/pan/rotate + shake). */
export function camera(ctx, { x = 0, y = 0, z = 1, r = 0, shk = 0, t = 0, cx = W / 2, cy = H / 2 } = {}) {
  const [sx, sy, sr] = shake(t, shk);
  ctx.translate(cx + sx, cy + sy);
  ctx.rotate(r + sr);
  ctx.scale(z, z);
  ctx.translate(-cx - x, -cy - y);
}

export { halftone, vignette, seg };
