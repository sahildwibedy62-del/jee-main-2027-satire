// Kinetic typography. Typography is a character in this film.
import { PAL, FONT, clamp, lerp, ease, hash, seg, spring, boil, TAU } from './core.js';

/**
 * Core text primitive: fill + thick outline + hard offset shadow, with optional tracking.
 * Returns the measured width.
 */
export function txt(ctx, text, x, y, o = {}) {
  const {
    size = 120,
    font = FONT.display,
    fill = PAL.ink,
    stroke = null,
    lw = 10,
    shadow = 0,
    shadowColor = PAL.ink,
    align = 'center',
    baseline = 'middle',
    track = 0,
    weight = '',
    alpha = 1,
    italic = false,
  } = o;
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.font = `${italic ? 'italic ' : ''}${weight ? weight + ' ' : ''}${size}px "${font}"`;
  ctx.textBaseline = baseline;
  ctx.lineJoin = 'round';
  const chars = [...text];
  const widths = chars.map((c) => ctx.measureText(c).width);
  const total = track ? widths.reduce((a, b) => a + b, 0) + track * (chars.length - 1) : ctx.measureText(text).width;
  let sx = x;
  if (align === 'center') sx = x - total / 2;
  else if (align === 'right') sx = x - total;
  ctx.textAlign = 'left';
  const pass = (dx, dy, mode) => {
    if (!track) {
      if (mode === 'stroke') ctx.strokeText(text, sx + dx, y + dy);
      else ctx.fillText(text, sx + dx, y + dy);
      return;
    }
    let cx = sx;
    chars.forEach((c, i) => {
      if (mode === 'stroke') ctx.strokeText(c, cx + dx, y + dy);
      else ctx.fillText(c, cx + dx, y + dy);
      cx += widths[i] + track;
    });
  };
  if (shadow) {
    ctx.fillStyle = shadowColor;
    if (stroke) {
      ctx.strokeStyle = shadowColor;
      ctx.lineWidth = lw;
      pass(shadow, shadow, 'stroke');
    }
    pass(shadow, shadow, 'fill');
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lw;
    pass(0, 0, 'stroke');
  }
  ctx.fillStyle = fill;
  pass(0, 0, 'fill');
  ctx.restore();
  return total;
}

export function measure(ctx, text, size, font = FONT.display, weight = '') {
  ctx.save();
  ctx.font = `${weight ? weight + ' ' : ''}${size}px "${font}"`;
  const w = ctx.measureText(text).width;
  ctx.restore();
  return w;
}

/** Largest size (<= max) that fits text in width. */
export function fit(ctx, text, maxW, max = 200, font = FONT.display, weight = '') {
  const w = measure(ctx, text, 100, font, weight);
  return Math.min(max, (maxW / w) * 100);
}

/**
 * Smash-in: text slams from huge scale to rest with overshoot, slight rotation,
 * and an impact "thud" settle. t is local time, t0 is impact start.
 */
export function smash(ctx, text, x, y, t, t0, o = {}) {
  const { size = 150, rot = -0.04, from = 3.2, dur = 0.22, maxW = 960, out = null } = o;
  if (t < t0) return 0;
  const p = clamp((t - t0) / dur);
  const s = p < 1 ? lerp(from, 1, ease.inQuad(p)) : 1 + Math.exp(-(t - t0 - dur) * 14) * Math.sin((t - t0 - dur) * 40) * 0.06;
  let a = clamp(p * 3);
  let sc = s;
  if (out) {
    const q = seg(t, out, out + 0.18, ease.inBack);
    sc *= 1 - q;
    a *= 1 - q;
  }
  if (sc <= 0.001) return 0;
  const sz = Math.min(size, fit(ctx, text, maxW, size, o.font || FONT.display));
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot * (1 + (1 - p) * 2));
  ctx.scale(sc, sc);
  ctx.globalAlpha *= a;
  txt(ctx, text, 0, 0, { fill: PAL.yellow, stroke: PAL.ink, lw: sz * 0.12, shadow: sz * 0.08, ...o, size: sz });
  ctx.restore();
  return p;
}

/**
 * Letters assemble one by one. mode: 'drop' | 'scatter' | 'spin' | 'rise' | 'pop'
 */
export function letters(ctx, text, x, y, t, t0, o = {}) {
  const { size = 140, font = FONT.display, stagger = 0.04, dur = 0.35, mode = 'drop', seed = 3, maxW = 960, track = 4, out = null } = o;
  const sz = Math.min(size, fit(ctx, text, maxW - track * text.length, size, font));
  ctx.save();
  ctx.font = `${sz}px "${font}"`;
  const chars = [...text];
  const ws = chars.map((c) => ctx.measureText(c).width);
  const total = ws.reduce((a, b) => a + b, 0) + track * (chars.length - 1);
  ctx.restore();
  let cx = x - total / 2;
  chars.forEach((c, i) => {
    const lt = t - t0 - i * stagger;
    let p = clamp(lt / dur);
    if (out != null) p *= 1 - seg(t, out + i * stagger * 0.5, out + i * stagger * 0.5 + 0.2, ease.inQuad);
    const w = ws[i];
    if (p > 0 && c !== ' ') {
      const e = mode === 'pop' ? ease.outBack(p, 3) : ease.outBack(p, 1.6);
      let dx = 0, dy = 0, r = 0, s = 1;
      const rnd = hash(i, seed) - 0.5;
      if (mode === 'drop') dy = (1 - e) * -500;
      else if (mode === 'rise') dy = (1 - e) * 400;
      else if (mode === 'scatter') {
        dx = (1 - e) * rnd * 1400;
        dy = (1 - e) * (hash(i, seed + 1) - 0.5) * 1400;
        r = (1 - e) * rnd * 6;
      } else if (mode === 'spin') {
        r = (1 - e) * TAU * (rnd > 0 ? 1 : -1);
        s = e;
      } else if (mode === 'pop') s = e;
      ctx.save();
      ctx.translate(cx + w / 2 + dx, y + dy);
      ctx.rotate(r + boil(t, i + seed, 0.015));
      ctx.scale(s, s);
      ctx.globalAlpha *= clamp(p * 2.5);
      txt(ctx, c, 0, 0, { fill: PAL.yellow, stroke: PAL.ink, lw: sz * 0.12, shadow: sz * 0.07, ...o, size: sz, track: 0 });
      ctx.restore();
    }
    cx += w + track;
  });
}

/**
 * Extruded "3D" block text. depth in px, rotY in radians fakes a Y-axis turn.
 */
export function block3D(ctx, text, x, y, o = {}) {
  const { size = 160, font = FONT.display, depth = 22, face = PAL.yellow, side = PAL.ink, rotY = 0, rotX = 0, dir = [1, 1], stroke = PAL.ink, lw = null } = o;
  const sx = Math.cos(rotY);
  const sy = Math.cos(rotX);
  ctx.save();
  ctx.translate(x, y);
  ctx.transform(sx, 0, Math.sin(rotY) * 0.18, sy, 0, 0);
  const d = Math.max(2, Math.round(depth * (0.6 + 0.4 * Math.abs(Math.sin(rotY) + 0.6))));
  const ddx = dir[0] + Math.sin(rotY) * 1.2, ddy = dir[1] + Math.sin(rotX);
  for (let i = d; i > 0; i--) {
    txt(ctx, text, ddx * i, ddy * i, { size, font, fill: side, track: o.track || 0 });
  }
  txt(ctx, text, 0, 0, { size, font, fill: face, stroke, lw: lw ?? size * 0.07, track: o.track || 0 });
  ctx.restore();
}

/** Text flying toward the camera from depth: z goes 1 (far) -> 0 (at camera). */
export function flyIn(ctx, text, x, y, t, t0, o = {}) {
  const { dur = 0.5, size = 150 } = o;
  const p = clamp((t - t0) / dur);
  if (p <= 0) return;
  const s = 0.05 + ease.outExpo(p) * 0.95;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.globalAlpha *= clamp(p * 4);
  txt(ctx, text, 0, 0, { fill: PAL.yellow, stroke: PAL.ink, lw: size * 0.12, shadow: size * 0.07, ...o, size });
  ctx.restore();
}

/** Text passing *through* the camera (scale explodes, fades). */
export function flyThrough(ctx, text, x, y, t, t0, o = {}) {
  const { dur = 0.6, size = 150 } = o;
  const p = clamp((t - t0) / dur);
  if (p <= 0 || p >= 1) return;
  const s = 0.1 * Math.pow(60, p);
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.globalAlpha *= clamp((1 - p) * 3) * clamp(p * 6);
  txt(ctx, text, 0, 0, { fill: PAL.yellow, stroke: PAL.ink, lw: size * 0.1, ...o, size });
  ctx.restore();
}

/** Mask reveal: text wiped in from left (dir 'x') or from below (dir 'y'). */
export function reveal(ctx, text, x, y, p, o = {}) {
  const { size = 120, dir = 'y', font = FONT.display, bar = PAL.red } = o;
  if (p <= 0) return;
  const w = measure(ctx, text, size, font) + 40;
  const h = size * 1.2;
  ctx.save();
  ctx.beginPath();
  if (dir === 'x') ctx.rect(x - w / 2, y - h / 2, w * clamp(p), h);
  else ctx.rect(x - w / 2, y - h / 2, w, h);
  ctx.clip();
  const dy = dir === 'y' ? (1 - ease.outCubic(clamp(p))) * h : 0;
  txt(ctx, text, x, y + dy, { fill: PAL.ink, ...o, size });
  ctx.restore();
  if (dir === 'x' && p < 1 && bar) {
    ctx.fillStyle = bar;
    ctx.fillRect(x - w / 2 + w * p - 8, y - h / 2, 16, h);
  }
}

/** Hand-scribbled underline drawn with progress p. */
export function underline(ctx, x, y, w, p, color = PAL.red, lw = 14, seed = 1) {
  if (p <= 0) return;
  ctx.save();
  ctx.beginPath();
  const n = 24;
  const end = Math.floor(n * clamp(p));
  for (let i = 0; i <= end; i++) {
    const k = i / n;
    const px = x + k * w;
    const py = y + Math.sin(k * 9 + seed) * 5 + (hash(i, seed) - 0.5) * 4;
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = lw;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke();
  ctx.restore();
}

/** Hand-drawn circle around a region. */
export function scribbleCircle(ctx, x, y, rx, ry, p, color = PAL.red, lw = 12, seed = 2) {
  if (p <= 0) return;
  ctx.save();
  ctx.beginPath();
  const n = 60;
  const end = Math.floor(n * 1.15 * clamp(p));
  for (let i = 0; i <= end; i++) {
    const a = -1.9 + (i / n) * TAU;
    const j = 1 + (hash(i >> 2, seed) - 0.5) * 0.06 + i / n * 0.05;
    const px = x + Math.cos(a) * rx * j, py = y + Math.sin(a) * ry * j;
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = lw;
  ctx.lineCap = 'round';
  ctx.stroke();
  ctx.restore();
}

/** Rubber stamp slam with rough edge. */
export function stamp(ctx, text, x, y, t, t0, o = {}) {
  const { size = 110, color = PAL.red, rot = -0.18, font = FONT.display, pad = 34 } = o;
  if (t < t0) return;
  const p = clamp((t - t0) / 0.14);
  const s = lerp(2.6, 1, ease.inQuad(p));
  const w = measure(ctx, text, size, font) + pad * 2;
  const h = size * 1.35;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.scale(s, s);
  ctx.globalAlpha *= clamp(p * 2) * 0.95;
  ctx.strokeStyle = color;
  ctx.lineWidth = 12;
  ctx.strokeRect(-w / 2, -h / 2, w, h);
  ctx.lineWidth = 4;
  ctx.strokeRect(-w / 2 + 14, -h / 2 + 14, w - 28, h - 28);
  txt(ctx, text, 0, size * 0.04, { size, font, fill: color, track: 4 });
  // ink speckle knockout
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  for (let i = 0; i < 70; i++) {
    ctx.fillRect((hash(i, 5) - 0.5) * w, (hash(i, 6) - 0.5) * h, 2 + hash(i, 7) * 6, 2 + hash(i, 8) * 4);
  }
  ctx.restore();
}

/** Animated number counter value from a to b between t0..t1 (eased). */
export function count(t, t0, t1, a, b, fn = ease.outCubic) {
  return lerp(a, b, seg(t, t0, t1, fn));
}

/** Stretch text horizontally (tracking + scaleX) for emphasis. */
export function stretch(ctx, text, x, y, p, o = {}) {
  const sx = lerp(0.6, 1, ease.outBack(clamp(p)));
  const track = lerp(60, o.track ?? 6, ease.outCubic(clamp(p)));
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(sx, 1 / Math.max(0.6, sx) * 0.9 + 0.1);
  txt(ctx, text, 0, 0, { ...o, track });
  ctx.restore();
}

/** Word-wrapped paragraph; returns lines. */
export function wrap(ctx, text, maxW, size, font = FONT.ui, weight = '800') {
  ctx.save();
  ctx.font = `${weight} ${size}px "${font}"`;
  const words = text.split(' ');
  const lines = [];
  let cur = '';
  for (const w of words) {
    const test = cur ? cur + ' ' + w : w;
    if (ctx.measureText(test).width > maxW && cur) {
      lines.push(cur);
      cur = w;
    } else cur = test;
  }
  if (cur) lines.push(cur);
  ctx.restore();
  return lines;
}

/** Explosive punctuation: "!" or "?" that springs and wobbles. */
export function punct(ctx, ch, x, y, t, t0, o = {}) {
  if (t < t0) return;
  const s = spring(t, t0, 2.6, 6);
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.sin((t - t0) * 12) * 0.12 * Math.exp(-(t - t0) * 2));
  ctx.scale(s, s);
  txt(ctx, ch, 0, 0, { size: 220, font: FONT.comic, fill: PAL.red, stroke: PAL.ink, lw: 14, shadow: 12, ...o });
  ctx.restore();
}
