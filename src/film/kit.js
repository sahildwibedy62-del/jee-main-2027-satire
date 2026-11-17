// Scene kit: timing helpers bound to the narration, camera, charts, UI mockups,
// stickers and small reusable gags. Everything is a pure function of time so any
// frame can be rendered (and seeked to) deterministically.
import { W, H, PAL, FONT, TAU, clamp, lerp, ease, hash, seg, boil, noise, inr } from '../engine/core.js';
import { paperBG, halftone, card, rr, circle, line, burst, rays, star, heart, spinner, tick, cross, dotFill } from '../engine/gfx.js';
import { txt, wrap, measure } from '../engine/type.js';
import { camera } from '../engine/stage.js';

// ---------- narration timing ----------

/** Build helpers around a [start, end, text] line table. */
export function timing(lines) {
  const LN = lines.map(([s, e, text], i) => ({ i, s, e, text }));
  /** Estimated absolute time a word/phrase is spoken inside line i (char-proportional). */
  const wt = (i, needle, atEnd = false) => {
    const l = LN[i];
    const idx = needle ? l.text.indexOf(needle) : 0;
    const pos = idx < 0 ? 0 : idx + (atEnd ? needle.length : 0);
    return l.s + ((l.e - l.s) * pos) / l.text.length;
  };
  return { LN, wt, s: (i) => LN[i].s, e: (i) => LN[i].e };
}

/** Is narration line i being spoken at time T? (used for mouth flaps) */
export const speaking = (LN, T, ...idx) => idx.some((i) => T >= LN[i].s && T <= LN[i].e);

// ---------- motion helpers ----------

/** Pop-in scale with overshoot (0 before t0). */
export function pop(T, t0, dur = 0.35, k = 2.2) {
  if (T <= t0) return 0;
  return ease.outBack(clamp((T - t0) / dur), k);
}
/** Fade in at a, out at b. */
export function inOut(T, a, b, fi = 0.25, fo = 0.25) {
  return Math.min(clamp((T - a) / fi), 1 - clamp((T - (b - fo)) / fo));
}
/** Slide offset: 1 -> 0 eased between t0 and t0+dur. */
export function slide(T, t0, dur = 0.45, fn = ease.outCubic) {
  return 1 - fn(clamp((T - t0) / dur));
}
/** Run fn with ctx translated/scaled around (x,y) by s and rotated r. */
export function at(ctx, x, y, s, r, fn) {
  if (s <= 0.001) return;
  ctx.save();
  ctx.translate(x, y);
  if (r) ctx.rotate(r);
  ctx.scale(s, s);
  fn(ctx);
  ctx.restore();
}
/** Keyframed camera: kf = [[T, {x,y,z,r}], ...]; extra = {shk} */
export function cam(ctx, T, kf, extra = {}, fn = ease.inOutCubic) {
  let v = kf[0][1];
  if (T >= kf[kf.length - 1][0]) v = kf[kf.length - 1][1];
  else
    for (let i = 0; i < kf.length - 1; i++) {
      const [ta, a] = kf[i], [tb, b] = kf[i + 1];
      if (T >= ta && T <= tb) {
        const p = fn(clamp((T - ta) / (tb - ta)));
        v = {};
        for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) v[k] = lerp(a[k] ?? (k === 'z' ? 1 : 0), b[k] ?? (k === 'z' ? 1 : 0), p);
        break;
      }
    }
  camera(ctx, { ...v, ...extra, t: T });
  return v;
}
/** Parallax layer: shifts content by camera x/y times depth factor. */
export function parallax(ctx, cx, cy, depth, fn) {
  ctx.save();
  ctx.translate(-cx * depth, -cy * depth);
  fn(ctx);
  ctx.restore();
}
/** Camera shake intensity from a list of hit times. */
export function shakes(T, times, k = 1, decay = 0.25) {
  let v = 0;
  for (const t0 of times) if (T >= t0) v = Math.max(v, Math.exp(-(T - t0) / decay) * k);
  return v;
}
export const typed = (text, p) => text.slice(0, Math.floor(text.length * clamp(p)));

// ---------- backgrounds ----------

/** Paper background with halftone corners and optional rotating rays. */
export function backdrop(ctx, T, { tone = 'paper', dots = PAL.paper3, rayColor = null, rx = W / 2, ry = H / 2, raysAlpha = 0.5, fade = 'radial' } = {}) {
  paperBG(ctx, tone, T);
  if (rayColor) rays(ctx, rx, ry, { n: 20, color: rayColor, rot: T * 0.08, r0: 0, r1: 2400, width: 0.5, alpha: raysAlpha });
  if (dots) halftone(ctx, 0, 0, W, H, { color: dots, size: 30, max: 0.4, fade, alpha: 0.55 });
}

/** Comic letterbox panels for cinematic framing. */
export function letterbox(ctx, k = 1, size = 70) {
  if (k <= 0) return;
  ctx.fillStyle = PAL.ink;
  ctx.fillRect(0, 0, W, size * k);
  ctx.fillRect(0, H - size * k, W, size * k);
}

/** Soft cloud. */
export function cloud(ctx, x, y, s, fill = PAL.white) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.beginPath();
  ctx.arc(-80, 10, 60, 0, TAU);
  ctx.arc(0, -20, 80, 0, TAU);
  ctx.arc(90, 10, 60, 0, TAU);
  ctx.rect(-80, 10, 170, 60);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.restore();
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.beginPath();
  ctx.moveTo(-140, 70);
  ctx.arc(-80, 10, 60, Math.PI * 0.75, Math.PI * 1.5);
  ctx.arc(0, -20, 80, Math.PI * 1.15, Math.PI * 1.9);
  ctx.arc(90, 10, 60, Math.PI * 1.5, Math.PI * 0.4);
  ctx.lineTo(-140, 70);
  ctx.lineWidth = 7;
  ctx.strokeStyle = PAL.ink;
  ctx.stroke();
  ctx.restore();
}

/** Palm tree. */
export function palm(ctx, x, y, s, T) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.strokeStyle = PAL.ink;
  ctx.lineWidth = 34;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(40, -200, 10, -400);
  ctx.stroke();
  ctx.strokeStyle = '#a0703c';
  ctx.lineWidth = 22;
  ctx.stroke();
  for (let i = 0; i < 6; i++) {
    const a = -Math.PI / 2 + (i - 2.5) * 0.55 + Math.sin(T * 1.5 + i) * 0.05;
    ctx.beginPath();
    ctx.moveTo(10, -400);
    ctx.quadraticCurveTo(10 + Math.cos(a) * 120, -400 + Math.sin(a) * 120 - 40, 10 + Math.cos(a) * 230, -400 + Math.sin(a) * 230 + 60);
    ctx.lineWidth = 34;
    ctx.strokeStyle = PAL.ink;
    ctx.stroke();
    ctx.lineWidth = 22;
    ctx.strokeStyle = '#3fae5a';
    ctx.stroke();
  }
  ctx.restore();
}

// ---------- stickers, labels, cards ----------

/** Rounded label sticker with hard shadow. */
export function sticker(ctx, text, x, y, { size = 44, fill = PAL.yellow, color = PAL.ink, rot = 0, s = 1, font = FONT.display, pad = 26, shadow = 8, weight = '' } = {}) {
  if (s <= 0.001) return;
  const w = measure(ctx, text, size, font, weight) + pad * 2;
  const h = size * 1.5;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.scale(s, s);
  card(ctx, -w / 2, -h / 2, w, h, { fill, r: h * 0.3, shadow, lw: 6 });
  txt(ctx, text, 0, size * 0.04, { size, font, fill: color, weight });
  ctx.restore();
  return w;
}

/** Chapter title card. */
export function chapterCard(ctx, T, t0, kicker, title, { color = PAL.red, y = H / 2 } = {}) {
  const p = pop(T, t0, 0.45);
  at(ctx, W / 2, y, p, -0.03, (c) => {
    card(c, -720, -190, 1440, 380, { fill: PAL.white, r: 26, shadow: 22 });
    c.save();
    rr(c, -720, -190, 1440, 110, 26);
    c.clip();
    c.fillStyle = color;
    c.fillRect(-720, -190, 1440, 110);
    c.restore();
    rr(c, -720, -190, 1440, 380, 26);
    c.lineWidth = 8;
    c.strokeStyle = PAL.ink;
    c.stroke();
    txt(c, kicker, 0, -134, { size: 58, fill: PAL.white, track: 8 });
    txt(c, title, 0, 60, { size: Math.min(150, (1300 / measure(c, title, 100)) * 100), fill: PAL.ink });
  });
}

/** Scrolling news ticker band. */
export function ticker(ctx, T, y, text, { bg = PAL.red, fg = PAL.white, speed = 260, h = 70, label = 'BREAKING' } = {}) {
  ctx.fillStyle = bg;
  ctx.fillRect(0, y, W, h);
  ctx.save();
  ctx.beginPath();
  ctx.rect(300, y, W - 300, h);
  ctx.clip();
  const tw = measure(ctx, text + '   •   ', 40, FONT.ui, '800');
  const off = (T * speed) % tw;
  for (let x = 300 - off; x < W; x += tw) txt(ctx, text + '   •   ', x, y + h / 2 + 2, { size: 40, font: FONT.ui, weight: '800', fill: fg, align: 'left' });
  ctx.restore();
  ctx.fillStyle = PAL.yellow;
  ctx.fillRect(0, y, 300, h);
  txt(ctx, label, 150, y + h / 2 + 3, { size: 44, fill: PAL.ink, track: 2 });
  line(ctx, 0, y, W, y, PAL.ink, 6);
  line(ctx, 0, y + h, W, y + h, PAL.ink, 6);
}

// ---------- charts ----------

/** Animated vertical bar chart. bars = [{v, label, color}] */
export function barChart(ctx, x, y, w, h, bars, p, { max = null, fmt = (v) => inr(v), stagger = 0.12, labelSize = 30, valueSize = 40, axis = true, gap = 0.3 } = {}) {
  const m = max ?? Math.max(...bars.map((b) => b.v));
  if (axis) {
    line(ctx, x, y + h, x + w, y + h, PAL.ink, 8);
    line(ctx, x, y, x, y + h, PAL.ink, 8);
    ctx.save();
    ctx.setLineDash([12, 14]);
    for (let g = 1; g <= 3; g++) line(ctx, x, y + h - (h * g) / 4, x + w, y + h - (h * g) / 4, 'rgba(13,12,11,0.2)', 3);
    ctx.restore();
  }
  const bw = w / bars.length;
  bars.forEach((b, i) => {
    const k = ease.outBack(clamp((p - i * stagger) / Math.max(0.05, 1 - stagger * (bars.length - 1))), 1.4);
    const bh = (h * b.v * k) / m;
    const bx = x + i * bw + bw * gap * 0.5;
    if (bh > 1) card(ctx, bx, y + h - bh, bw * (1 - gap), bh, { fill: b.color || PAL.yellow, r: 8, shadow: 8, lw: 6 });
    if (b.label) txt(ctx, b.label, bx + (bw * (1 - gap)) / 2, y + h + 38, { size: labelSize, font: FONT.ui, weight: '800', fill: PAL.ink });
    if (k > 0.2) txt(ctx, fmt(b.v * clamp(k)), bx + (bw * (1 - gap)) / 2, y + h - bh - 34, { size: valueSize, fill: PAL.ink, alpha: clamp(k) });
  });
}

/** Animated line chart; pts are [0..1, 0..1] in chart space (y up). */
export function lineChart(ctx, x, y, w, h, pts, p, { color = PAL.red, lw = 14, dots = true, grid = true, dash = null } = {}) {
  if (grid) {
    ctx.save();
    ctx.strokeStyle = 'rgba(13,12,11,0.14)';
    ctx.lineWidth = 3;
    for (let g = 0; g <= 5; g++) {
      ctx.beginPath();
      ctx.moveTo(x, y + (h * g) / 5);
      ctx.lineTo(x + w, y + (h * g) / 5);
      ctx.stroke();
    }
    ctx.restore();
    line(ctx, x, y + h, x + w, y + h, PAL.ink, 8);
    line(ctx, x, y, x, y + h, PAL.ink, 8);
  }
  const P = pts.map(([a, b]) => [x + a * w, y + h - b * h]);
  const n = (P.length - 1) * clamp(p);
  const full = Math.floor(n);
  ctx.save();
  if (dash) ctx.setLineDash(dash);
  ctx.beginPath();
  ctx.moveTo(P[0][0], P[0][1]);
  for (let i = 1; i <= full; i++) ctx.lineTo(P[i][0], P[i][1]);
  let head = P[full];
  if (full < P.length - 1) {
    const f = n - full;
    head = [lerp(P[full][0], P[full + 1][0], f), lerp(P[full][1], P[full + 1][1], f)];
    ctx.lineTo(head[0], head[1]);
  }
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = PAL.ink;
  ctx.lineWidth = lw + 10;
  ctx.stroke();
  ctx.strokeStyle = color;
  ctx.lineWidth = lw;
  ctx.stroke();
  ctx.restore();
  if (dots) for (let i = 0; i <= full; i++) circle(ctx, P[i][0], P[i][1], lw * 0.9, PAL.white, PAL.ink, 6);
  return head;
}

/** Donut chart with animated sweep. parts = [{v, color, label}] */
export function donut(ctx, x, y, r, parts, p, { hole = 0.55, rot = -Math.PI / 2, explode = -1, ex = 0 } = {}) {
  const total = parts.reduce((a, b) => a + b.v, 0);
  let a0 = rot;
  const sweep = TAU * clamp(p);
  parts.forEach((pt, i) => {
    const a = (pt.v / total) * TAU;
    const a1 = Math.min(a0 + a, rot + sweep);
    if (a1 > a0) {
      const mid = (a0 + a1) / 2;
      const off = i === explode ? ex : 0;
      const ox = Math.cos(mid) * off, oy = Math.sin(mid) * off;
      ctx.beginPath();
      ctx.arc(x + ox, y + oy, r, a0, a1);
      ctx.arc(x + ox, y + oy, r * hole, a1, a0, true);
      ctx.closePath();
      ctx.fillStyle = pt.color;
      ctx.fill();
      ctx.lineWidth = 7;
      ctx.strokeStyle = PAL.ink;
      ctx.lineJoin = 'round';
      ctx.stroke();
    }
    a0 += a;
  });
}

/** Semi-circular gauge, v in 0..1. */
export function gauge(ctx, x, y, r, v, { label = '', lo = PAL.red, mid = PAL.yellow, hi = PAL.cyan, t = 0 } = {}) {
  const segs = [lo, mid, hi];
  segs.forEach((c, i) => {
    ctx.beginPath();
    ctx.arc(x, y, r, Math.PI + (i * Math.PI) / 3, Math.PI + ((i + 1) * Math.PI) / 3);
    ctx.arc(x, y, r * 0.62, Math.PI + ((i + 1) * Math.PI) / 3, Math.PI + (i * Math.PI) / 3, true);
    ctx.closePath();
    ctx.fillStyle = c;
    ctx.fill();
    ctx.lineWidth = 7;
    ctx.strokeStyle = PAL.ink;
    ctx.stroke();
  });
  const a = Math.PI + clamp(v + boil(t, 4, 0.01)) * Math.PI;
  line(ctx, x, y, x + Math.cos(a) * r * 0.9, y + Math.sin(a) * r * 0.9, PAL.ink, 14);
  circle(ctx, x, y, 22, PAL.ink, null, 0);
  if (label) txt(ctx, label, x, y + 64, { size: 52, fill: PAL.ink });
}

// ---------- UI mockups ----------

/** Browser window with address bar. content(ctx, w, h) draws in the page area. */
export function browser(ctx, x, y, w, h, url, content, { s = 1, rot = 0, bar = PAL.ink2, loading = -1, t = 0 } = {}) {
  at(ctx, x, y, s, rot, (c) => {
    card(c, -w / 2, -h / 2, w, h, { fill: PAL.white, r: 22, shadow: 18 });
    c.save();
    rr(c, -w / 2, -h / 2, w, 96, 22);
    c.clip();
    c.fillStyle = bar;
    c.fillRect(-w / 2, -h / 2, w, 96);
    c.restore();
    [PAL.red, PAL.yellow, PAL.cyan].forEach((col, i) => circle(c, -w / 2 + 40 + i * 40, -h / 2 + 48, 12, col, PAL.ink, 4));
    card(c, -w / 2 + 170, -h / 2 + 22, w - 220, 52, { fill: PAL.paper, r: 26, shadow: 0, lw: 4 });
    txt(c, url, -w / 2 + 200, -h / 2 + 49, { size: 26, font: FONT.mono, fill: PAL.ink, align: 'left' });
    if (loading >= 0) {
      c.fillStyle = PAL.cyan;
      c.fillRect(-w / 2, -h / 2 + 92, w * clamp(loading), 8);
    }
    c.save();
    c.beginPath();
    c.rect(-w / 2 + 4, -h / 2 + 100, w - 8, h - 104);
    c.clip();
    c.translate(-w / 2, -h / 2 + 100);
    content && content(c, w, h - 100);
    c.restore();
    rr(c, -w / 2, -h / 2, w, h, 22);
    c.lineWidth = 7;
    c.strokeStyle = PAL.ink;
    c.stroke();
    line(c, -w / 2, -h / 2 + 96, w / 2, -h / 2 + 96, PAL.ink, 6);
  });
}

/** Form field with status. state: 'ok' | 'err' | 'wait' | null */
export function field(ctx, x, y, w, label, value, { state = null, t = 0, h = 78, size = 34 } = {}) {
  txt(ctx, label, x, y - 26, { size: 24, font: FONT.ui, weight: '800', fill: PAL.gray2, align: 'left' });
  const col = state === 'err' ? PAL.red : state === 'ok' ? '#2fae5a' : PAL.ink;
  card(ctx, x, y, w, h, { fill: state === 'err' ? '#ffe3e0' : PAL.white, r: 12, shadow: 0, lw: 6, stroke: col });
  txt(ctx, value, x + 22, y + h / 2 + 2, { size, font: FONT.mono, fill: PAL.ink, align: 'left' });
  const ix = x + w - 44, iy = y + h / 2;
  if (state === 'err') cross(ctx, ix, iy, 30, 1, PAL.red, 9);
  if (state === 'ok') tick(ctx, ix, iy, 40, 1, '#2fae5a', 9);
  if (state === 'wait') spinner(ctx, ix, iy, 18, t, PAL.ink, 7);
}

/** Pill button. */
export function button(ctx, x, y, w, h, text, { fill = PAL.yellow, press = 0, size = 38, color = PAL.ink } = {}) {
  const d = press * 8;
  card(ctx, x - w / 2 + d, y - h / 2 + d, w, h, { fill, r: h / 2, shadow: 10 - d, lw: 6 });
  txt(ctx, text, x + d, y + d + 2, { size, fill: color });
}

/** Search box with typed text and a blinking caret. */
export function searchBox(ctx, x, y, w, text, T, { h = 92, size = 38, icon = true } = {}) {
  card(ctx, x - w / 2, y - h / 2, w, h, { fill: PAL.white, r: h / 2, shadow: 10, lw: 6 });
  if (icon) {
    circle(ctx, x - w / 2 + 52, y - 6, 18, null, PAL.ink, 7);
    line(ctx, x - w / 2 + 64, y + 6, x - w / 2 + 78, y + 20, PAL.ink, 8);
  }
  const tw = txt(ctx, text, x - w / 2 + 100, y + 2, { size, font: FONT.ui, weight: '800', fill: PAL.ink, align: 'left' });
  if (Math.floor(T * 2.5) % 2 === 0) ctx.fillStyle = PAL.ink, ctx.fillRect(x - w / 2 + 106 + tw, y - size / 2, 5, size);
}

/** Social feed post card. */
export function post(ctx, x, y, w, handle, text, { s = 1, rot = 0, likes = '12K', avatar = PAL.yellow, hot = false } = {}) {
  at(ctx, x, y, s, rot, (c) => {
    const lines = wrap(c, text, w - 60, 34, FONT.ui, '800');
    const h = 130 + lines.length * 44 + 60;
    card(c, -w / 2, -h / 2, w, h, { fill: PAL.white, r: 22, shadow: 12 });
    circle(c, -w / 2 + 56, -h / 2 + 58, 30, avatar, PAL.ink, 5);
    txt(c, handle, -w / 2 + 104, -h / 2 + 58, { size: 30, font: FONT.ui, weight: '800', fill: PAL.ink, align: 'left' });
    lines.forEach((l, i) => txt(c, l, -w / 2 + 30, -h / 2 + 130 + i * 44, { size: 34, font: FONT.ui, weight: '800', fill: PAL.ink, align: 'left' }));
    heart(c, -w / 2 + 50, h / 2 - 34, 18, hot ? PAL.red : PAL.white, PAL.ink, 4);
    txt(c, likes, -w / 2 + 80, h / 2 - 36, { size: 28, font: FONT.ui, weight: '800', fill: PAL.gray2, align: 'left' });
    if (hot) txt(c, '🔥', w / 2 - 50, -h / 2 + 58, { size: 44, font: FONT.ui });
  });
}

// ---------- gags ----------

/** Confetti burst from (x, y) starting at t0. */
export function confetti(ctx, T, t0, { x = W / 2, y = H / 2, n = 80, spread = 900, seed = 3, g = 900 } = {}) {
  const dt = T - t0;
  if (dt < 0 || dt > 4) return;
  const cols = [PAL.yellow, PAL.red, PAL.cyan, PAL.white];
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + (hash(i, seed) - 0.5) * 2.4;
    const v = spread * (0.4 + hash(i, seed + 1) * 0.8);
    const px = x + Math.cos(a) * v * dt;
    const py = y + Math.sin(a) * v * dt + 0.5 * g * dt * dt;
    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(dt * (4 + hash(i, seed + 2) * 8));
    ctx.fillStyle = cols[i % 4];
    ctx.fillRect(-10, -5, 20, 10 * Math.abs(Math.cos(dt * 9 + i)));
    ctx.restore();
  }
}

/** Twinkling sparkles around a point. */
export function sparkles(ctx, x, y, r, T, { n = 7, seed = 5, color = PAL.yellow } = {}) {
  for (let i = 0; i < n; i++) {
    const a = hash(i, seed) * TAU + T * 0.4;
    const d = r * (0.6 + hash(i, seed + 1) * 0.5);
    const k = Math.max(0, Math.sin(T * 5 + i * 1.7));
    if (k > 0.05) star(ctx, x + Math.cos(a) * d, y + Math.sin(a) * d, 22 * k, color, PAL.ink, 4, T);
  }
}

/** Motion "wobble" for comedic jiggle. */
export const wobble = (T, t0, amt = 0.15, f = 18, d = 4) => (T < t0 ? 0 : Math.sin((T - t0) * f) * amt * Math.exp(-(T - t0) * d));

/** Little sweat/emote marks above a head. */
export function emote(ctx, kind, x, y, T, s = 1) {
  at(ctx, x, y, s, 0, (c) => {
    if (kind === '!') txt(c, '!', 0, Math.sin(T * 10) * 4, { size: 130, font: FONT.comic, fill: PAL.red, stroke: PAL.ink, lw: 10 });
    else if (kind === '?') txt(c, '?', 0, Math.sin(T * 6) * 6, { size: 130, font: FONT.comic, fill: PAL.yellow, stroke: PAL.ink, lw: 10 });
    else if (kind === 'heart') heart(c, 0, Math.sin(T * 6) * 8, 40, PAL.red, PAL.ink, 6);
    else if (kind === 'anger') {
      c.strokeStyle = PAL.red;
      c.lineWidth = 10;
      const sc = 1 + Math.sin(T * 14) * 0.15;
      c.scale(sc, sc);
      for (let i = 0; i < 4; i++) {
        c.rotate(Math.PI / 2);
        c.beginPath();
        c.moveTo(8, 8);
        c.quadraticCurveTo(10, 26, 32, 26);
        c.stroke();
      }
    }
  });
}

/** Flat cartoon smartphone frame drawn around a screen callback (wrapper for brevity). */
export function screenGlow(ctx, x, y, w, h, color = PAL.cyan, k = 1) {
  ctx.save();
  ctx.globalAlpha = 0.25 * k;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, w, h, 0, 0, TAU);
  ctx.fill();
  ctx.restore();
}

/** Diya (oil lamp) with flickering flame. */
export function diya(ctx, x, y, s, T, seed = 1) {
  at(ctx, x, y, s, 0, (c) => {
    const f = 1 + noise(T * 9, seed) * 0.15;
    c.save();
    c.globalAlpha = 0.3;
    circle(c, 0, -60, 70 * f, PAL.yellow, null, 0);
    c.restore();
    c.beginPath();
    c.moveTo(-8, -20);
    c.quadraticCurveTo(-22 * f, -60, 0 + noise(T * 7, seed) * 6, -100 * f);
    c.quadraticCurveTo(22 * f, -60, 8, -20);
    c.closePath();
    c.fillStyle = PAL.yellow;
    c.fill();
    c.lineWidth = 5;
    c.strokeStyle = PAL.ink;
    c.stroke();
    c.beginPath();
    c.moveTo(-80, -20);
    c.quadraticCurveTo(0, 60, 80, -20);
    c.closePath();
    c.fillStyle = '#d9783a';
    c.fill();
    c.lineWidth = 7;
    c.stroke();
    dotFill(c, -50, -14, 100, 18, { color: PAL.yellow, size: 20, rad: 4 });
  });
}

/** Firework burst. */
export function firework(ctx, x, y, T, t0, { color = PAL.yellow, n = 16, r = 220 } = {}) {
  const dt = T - t0;
  if (dt < 0 || dt > 1.6) return;
  const k = ease.outCubic(clamp(dt / 0.9));
  ctx.save();
  ctx.globalAlpha = 1 - clamp((dt - 0.9) / 0.7);
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU;
    const d = r * k;
    line(ctx, x + Math.cos(a) * d * 0.6, y + Math.sin(a) * d * 0.6 + dt * 30, x + Math.cos(a) * d, y + Math.sin(a) * d + dt * 40, color, 10);
  }
  ctx.restore();
}

export { W, H, PAL, FONT, TAU, clamp, lerp, ease, hash, seg, boil, noise, inr };
