// Drawing primitives: paper, halftone, comic shapes, bubbles, rays, grain.
import { W, H, PAL, FONT, TAU, hash, rng, clamp, lerp, ease, boil } from './core.js';

let factory = null;
/** The host (browser or Node preview tool) supplies an offscreen canvas factory. */
export function setCanvasFactory(fn) {
  factory = fn;
}
export function makeCanvas(w, h) {
  if (!factory) throw new Error('Canvas factory not set');
  return factory(w, h);
}

const cache = new Map();
function cached(key, build) {
  if (!cache.has(key)) cache.set(key, build());
  return cache.get(key);
}

// ---------- textures ----------

function paperTexture() {
  return cached('paper', () => {
    const c = makeCanvas(512, 512);
    const x = c.getContext('2d');
    const r = rng(42);
    x.clearRect(0, 0, 512, 512);
    for (let i = 0; i < 9000; i++) {
      const a = r() * 0.07;
      x.fillStyle = r() > 0.5 ? `rgba(90,70,40,${a})` : `rgba(255,255,255,${a * 1.4})`;
      x.fillRect(r() * 512, r() * 512, 1 + r() * 2.2, 1 + r() * 2.2);
    }
    // fibres
    x.strokeStyle = 'rgba(100,80,50,0.06)';
    x.lineWidth = 1;
    for (let i = 0; i < 160; i++) {
      const px = r() * 512, py = r() * 512, a = r() * TAU, l = 6 + r() * 22;
      x.beginPath();
      x.moveTo(px, py);
      x.quadraticCurveTo(px + Math.cos(a + 0.6) * l * 0.5, py + Math.sin(a + 0.6) * l * 0.5, px + Math.cos(a) * l, py + Math.sin(a) * l);
      x.stroke();
    }
    return c;
  });
}

function grainTiles() {
  return cached('grain', () => {
    const tiles = [];
    for (let k = 0; k < 4; k++) {
      const c = makeCanvas(256, 256);
      const x = c.getContext('2d');
      const r = rng(100 + k);
      for (let i = 0; i < 2600; i++) {
        const v = r();
        x.fillStyle = v > 0.5 ? `rgba(255,255,255,${0.05 + r() * 0.06})` : `rgba(0,0,0,${0.05 + r() * 0.07})`;
        x.fillRect(Math.floor(r() * 256), Math.floor(r() * 256), 2, 2);
      }
      tiles.push(c);
    }
    return tiles;
  });
}

function dotTile(size, color, rad) {
  return cached(`dot:${size}:${color}:${rad}`, () => {
    const c = makeCanvas(size, size);
    const x = c.getContext('2d');
    x.fillStyle = color;
    x.beginPath();
    x.arc(size / 2, size / 2, rad, 0, TAU);
    x.fill();
    return c;
  });
}

/** Fills the frame with warm paper + texture. tone: 'paper' | 'dark' | 'yellow' | 'red' | 'cyan' */
export function paperBG(ctx, tone = 'paper', t = 0) {
  const fills = {
    paper: PAL.paper,
    paper2: PAL.paper2,
    dark: PAL.ink,
    yellow: PAL.yellow,
    red: PAL.red,
    cyan: PAL.cyan,
  };
  ctx.fillStyle = fills[tone] || tone;
  ctx.fillRect(-200, -200, W + 400, H + 400);
  texture(ctx, tone === 'dark' ? 0.35 : 1);
}

export function texture(ctx, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  const pat = ctx.createPattern(paperTexture(), 'repeat');
  ctx.fillStyle = pat;
  ctx.fillRect(-200, -200, W + 400, H + 400);
  ctx.restore();
}

export function vignette(ctx, strength = 0.45, color = '0,0,0') {
  const g = ctx.createRadialGradient(W / 2, H / 2, H * 0.25, W / 2, H / 2, H * 0.75);
  g.addColorStop(0, `rgba(${color},0)`);
  g.addColorStop(1, `rgba(${color},${strength})`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
}

export function grain(ctx, t, alpha = 1) {
  const tiles = grainTiles();
  const f = Math.floor(t * 12);
  const tile = tiles[f % 4];
  ctx.save();
  ctx.globalAlpha = alpha;
  const ox = Math.floor(hash(f, 3) * 256), oy = Math.floor(hash(f, 5) * 256);
  ctx.translate(-ox, -oy);
  ctx.fillStyle = ctx.createPattern(tile, 'repeat');
  ctx.fillRect(0, 0, W + 256, H + 256);
  ctx.restore();
}

/** Halftone dot field inside rect. `fade` direction: 'none'|'down'|'up'|'radial'. */
export function halftone(ctx, x, y, w, h, { color = PAL.ink, size = 26, max = 0.42, fade = 'down', alpha = 1, angle = 0.4 } = {}) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.fillStyle = color;
  ctx.beginPath();
  const cx = x + w / 2, cy = y + h / 2;
  const ca = Math.cos(angle), sa = Math.sin(angle);
  const R = Math.hypot(w, h) / 2 + size;
  for (let gy = -R; gy < R; gy += size) {
    for (let gx = -R; gx < R; gx += size) {
      const px = cx + gx * ca - gy * sa;
      const py = cy + gx * sa + gy * ca;
      if (px < x - size || px > x + w + size || py < y - size || py > y + h + size) continue;
      let k = 1;
      if (fade === 'down') k = clamp((py - y) / h);
      else if (fade === 'up') k = clamp(1 - (py - y) / h);
      else if (fade === 'radial') k = clamp(Math.hypot(px - cx, py - cy) / (Math.min(w, h) / 2));
      else if (fade === 'center') k = clamp(1 - Math.hypot(px - cx, py - cy) / (Math.min(w, h) / 2));
      const r = size * max * k;
      if (r < 0.6) continue;
      ctx.moveTo(px + r, py);
      ctx.arc(px, py, r, 0, TAU);
    }
  }
  ctx.fill();
  ctx.restore();
}

/** Uniform halftone via pattern (fast). */
export function dotFill(ctx, x, y, w, h, { color = PAL.ink, size = 18, rad = 4, alpha = 1 } = {}) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = ctx.createPattern(dotTile(size, color, rad), 'repeat');
  ctx.fillRect(x, y, w, h);
  ctx.restore();
}

// ---------- shapes ----------

export function rr(ctx, x, y, w, h, r = 18) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Comic panel / card with hard offset shadow. */
export function card(ctx, x, y, w, h, { fill = PAL.white, stroke = PAL.ink, lw = 7, r = 22, shadow = 14, shadowColor = PAL.ink } = {}) {
  if (shadow) {
    ctx.fillStyle = shadowColor;
    rr(ctx, x + shadow, y + shadow, w, h, r);
    ctx.fill();
  }
  ctx.fillStyle = fill;
  rr(ctx, x, y, w, h, r);
  ctx.fill();
  if (lw) {
    ctx.lineWidth = lw;
    ctx.strokeStyle = stroke;
    ctx.lineJoin = 'round';
    ctx.stroke();
  }
}

export function circle(ctx, x, y, r, fill, stroke = PAL.ink, lw = 6) {
  ctx.beginPath();
  ctx.arc(x, y, Math.max(0.1, r), 0, TAU);
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke && lw) {
    ctx.lineWidth = lw;
    ctx.strokeStyle = stroke;
    ctx.stroke();
  }
}

export function line(ctx, x1, y1, x2, y2, color = PAL.ink, lw = 6) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = color;
  ctx.lineWidth = lw;
  ctx.lineCap = 'round';
  ctx.stroke();
}

/** Comic explosion / burst. */
export function burst(ctx, x, y, r, { spikes = 14, fill = PAL.yellow, stroke = PAL.ink, lw = 8, seed = 1, inner = 0.68, rot = 0, t = 0, boilAmt = 0 } = {}) {
  ctx.beginPath();
  for (let i = 0; i < spikes * 2; i++) {
    const a = rot + (i / (spikes * 2)) * TAU;
    const jitter = 0.85 + hash(i, seed + Math.floor(t * 8) * boilAmt) * 0.3;
    const rad = (i % 2 === 0 ? r : r * inner) * jitter;
    const px = x + Math.cos(a) * rad, py = y + Math.sin(a) * rad;
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  if (lw) {
    ctx.lineJoin = 'miter';
    ctx.lineWidth = lw;
    ctx.strokeStyle = stroke;
    ctx.stroke();
  }
}

/** Radial sunburst rays. */
export function rays(ctx, x, y, { n = 18, color = PAL.yellow, rot = 0, r0 = 0, r1 = 2400, width = 0.5, alpha = 1 } = {}) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const a = rot + (i / n) * TAU;
    const hw = (TAU / n) * width * 0.5;
    ctx.moveTo(x + Math.cos(a - hw) * r0, y + Math.sin(a - hw) * r0);
    ctx.lineTo(x + Math.cos(a - hw) * r1, y + Math.sin(a - hw) * r1);
    ctx.lineTo(x + Math.cos(a + hw) * r1, y + Math.sin(a + hw) * r1);
    ctx.lineTo(x + Math.cos(a + hw) * r0, y + Math.sin(a + hw) * r0);
  }
  ctx.fill();
  ctx.restore();
}

/** Manga speed lines converging toward (x, y). */
export function speedLines(ctx, x, y, t, { n = 70, color = PAL.ink, inner = 380, alpha = 1, seed = 4, thick = 1 } = {}) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  const f = Math.floor(t * 15);
  ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const a = hash(i, seed + f) * TAU;
    const r0 = inner * (0.8 + hash(i, seed + f + 11) * 0.7);
    const wdt = (0.006 + hash(i, seed + f + 23) * 0.014) * thick;
    const r1 = 2400;
    ctx.moveTo(x + Math.cos(a) * r0, y + Math.sin(a) * r0);
    ctx.lineTo(x + Math.cos(a - wdt) * r1, y + Math.sin(a - wdt) * r1);
    ctx.lineTo(x + Math.cos(a + wdt) * r1, y + Math.sin(a + wdt) * r1);
  }
  ctx.fill();
  ctx.restore();
}

/** Horizontal motion streaks (for whip pans and runs). */
export function streaks(ctx, t, { n = 26, color = PAL.ink, alpha = 0.6, dir = 1, seed = 9, y0 = 0, y1 = H } = {}) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  const f = Math.floor(t * 20);
  for (let i = 0; i < n; i++) {
    const y = lerp(y0, y1, hash(i, seed + f));
    const len = 200 + hash(i, seed + f + 1) * 700;
    const x = hash(i, seed + f + 2) * (W + len) - len;
    ctx.fillRect(x, y, len, 3 + hash(i, seed + 5) * 8);
  }
  ctx.restore();
}

/** Speech or thought bubble with tail pointing at (tx, ty). */
export function bubble(ctx, x, y, w, h, tx, ty, { fill = PAL.white, stroke = PAL.ink, lw = 7, thought = false, r = 60, shadow = 0 } = {}) {
  if (thought) {
    // cloud
    const cx = x + w / 2, cy = y + h / 2;
    const bumps = 11;
    ctx.beginPath();
    for (let i = 0; i <= bumps; i++) {
      const a = (i / bumps) * TAU;
      const px = cx + Math.cos(a) * w * 0.5, py = cy + Math.sin(a) * h * 0.5;
      const a2 = ((i + 0.5) / bumps) * TAU;
      const qx = cx + Math.cos(a2) * w * 0.62, qy = cy + Math.sin(a2) * h * 0.64;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.quadraticCurveTo(qx0, qy0, px, py);
      var qx0 = qx, qy0 = qy;
    }
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.lineWidth = lw;
    ctx.strokeStyle = stroke;
    ctx.stroke();
    const dx = tx - cx, dy = ty - cy;
    for (let i = 0; i < 3; i++) {
      const k = 0.62 + i * 0.16;
      circle(ctx, cx + dx * k, cy + dy * k, 26 - i * 7, fill, stroke, lw * 0.8);
    }
    return;
  }
  if (shadow) {
    ctx.save();
    ctx.translate(shadow, shadow);
    bubblePath(ctx, x, y, w, h, tx, ty, r);
    ctx.fillStyle = PAL.ink;
    ctx.fill();
    ctx.restore();
  }
  bubblePath(ctx, x, y, w, h, tx, ty, r);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.lineWidth = lw;
  ctx.lineJoin = 'round';
  ctx.strokeStyle = stroke;
  ctx.stroke();
}

function bubblePath(ctx, x, y, w, h, tx, ty, r) {
  const cx = x + w / 2;
  const below = ty > y + h;
  const bx = clamp(tx, x + r + 20, x + w - r - 80);
  rr(ctx, x, y, w, h, r);
  ctx.moveTo(bx, below ? y + h - 4 : y + 4);
  ctx.lineTo(tx, ty);
  ctx.lineTo(bx + 70, below ? y + h - 4 : y + 4);
  void cx;
}

export function heart(ctx, x, y, s, fill = PAL.red, stroke = PAL.ink, lw = 5) {
  ctx.beginPath();
  ctx.moveTo(x, y + s * 0.35);
  ctx.bezierCurveTo(x - s * 1.1, y - s * 0.4, x - s * 0.45, y - s * 1.05, x, y - s * 0.45);
  ctx.bezierCurveTo(x + s * 0.45, y - s * 1.05, x + s * 1.1, y - s * 0.4, x, y + s * 0.35);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  if (lw) {
    ctx.lineWidth = lw;
    ctx.strokeStyle = stroke;
    ctx.stroke();
  }
}

export function star(ctx, x, y, r, fill = PAL.yellow, stroke = PAL.ink, lw = 5, rot = 0) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = rot - Math.PI / 2 + (i / 10) * TAU;
    const rad = i % 2 ? r * 0.45 : r;
    ctx.lineTo(x + Math.cos(a) * rad, y + Math.sin(a) * rad);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  if (lw) {
    ctx.lineWidth = lw;
    ctx.strokeStyle = stroke;
    ctx.stroke();
  }
}

/** Check mark drawn with progress p (0..1). */
export function tick(ctx, x, y, s, p = 1, color = PAL.ink, lw = 12) {
  const pts = [[-0.5, 0], [-0.15, 0.38], [0.55, -0.5]];
  drawPolyProgress(ctx, pts.map(([a, b]) => [x + a * s, y + b * s]), p, color, lw);
}

/** Cross drawn with progress p. */
export function cross(ctx, x, y, s, p = 1, color = PAL.red, lw = 14) {
  const p1 = clamp(p * 2), p2 = clamp(p * 2 - 1);
  if (p1 > 0) drawPolyProgress(ctx, [[x - s / 2, y - s / 2], [x + s / 2, y + s / 2]], p1, color, lw);
  if (p2 > 0) drawPolyProgress(ctx, [[x + s / 2, y - s / 2], [x - s / 2, y + s / 2]], p2, color, lw);
}

export function drawPolyProgress(ctx, pts, p, color, lw) {
  if (p <= 0) return;
  let total = 0;
  const lens = [];
  for (let i = 1; i < pts.length; i++) {
    const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    lens.push(l);
    total += l;
  }
  let remain = total * clamp(p);
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length && remain > 0; i++) {
    const l = lens[i - 1];
    const k = Math.min(1, remain / l);
    ctx.lineTo(lerp(pts[i - 1][0], pts[i][0], k), lerp(pts[i - 1][1], pts[i][1], k));
    remain -= l;
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = lw;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke();
}

/** Thick arrow from (x1,y1) to (x2,y2). */
export function arrow(ctx, x1, y1, x2, y2, { color = PAL.ink, lw = 12, head = 40, p = 1 } = {}) {
  const x = lerp(x1, x2, p), y = lerp(y1, y2, p);
  line(ctx, x1, y1, x, y, color, lw);
  const a = Math.atan2(y2 - y1, x2 - x1);
  ctx.beginPath();
  ctx.moveTo(x + Math.cos(a) * head * 0.4, y + Math.sin(a) * head * 0.4);
  ctx.lineTo(x + Math.cos(a + 2.5) * head, y + Math.sin(a + 2.5) * head);
  ctx.lineTo(x + Math.cos(a - 2.5) * head, y + Math.sin(a - 2.5) * head);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

/** Sweat drop. */
export function drop(ctx, x, y, s, fill = PAL.cyan) {
  ctx.beginPath();
  ctx.moveTo(x, y - s);
  ctx.quadraticCurveTo(x + s * 0.8, y + s * 0.1, x, y + s * 0.6);
  ctx.quadraticCurveTo(x - s * 0.8, y + s * 0.1, x, y - s);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = PAL.ink;
  ctx.stroke();
}

/** Grawlix (#@$%!) for censored-by-design rage. */
export function grawlix(ctx, x, y, t, size = 70) {
  const syms = ['#', '@', '$', '%', '!', '&', '*'];
  ctx.save();
  ctx.font = `${size}px ${FONT.comic}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (let i = 0; i < 5; i++) {
    const s = syms[Math.floor(hash(i + Math.floor(t * 10) * 3, 77) * syms.length)];
    const px = x + (i - 2) * size * 0.62;
    const py = y + boil(t, i, 6, 10);
    ctx.lineWidth = 8;
    ctx.strokeStyle = PAL.ink;
    ctx.strokeText(s, px, py);
    ctx.fillStyle = i % 2 ? PAL.red : PAL.yellow;
    ctx.fillText(s, px, py);
  }
  ctx.restore();
}

/** Loading spinner. */
export function spinner(ctx, x, y, r, t, color = PAL.ink, lw = 12) {
  const a = t * 7;
  ctx.beginPath();
  ctx.arc(x, y, r, a, a + Math.PI * 1.4);
  ctx.strokeStyle = color;
  ctx.lineWidth = lw;
  ctx.lineCap = 'round';
  ctx.stroke();
}

/** Simple progress bar. */
export function progress(ctx, x, y, w, h, p, { fill = PAL.yellow, bg = PAL.white, stroke = PAL.ink, lw = 6, segs = 0 } = {}) {
  card(ctx, x, y, w, h, { fill: bg, lw, r: h / 2, shadow: 8 });
  if (segs) {
    const n = Math.floor(segs * clamp(p));
    const sw = (w - 20) / segs;
    ctx.fillStyle = fill;
    for (let i = 0; i < n; i++) ctx.fillRect(x + 10 + i * sw + 3, y + 10, sw - 6, h - 20);
  } else if (p > 0) {
    ctx.save();
    rr(ctx, x, y, w, h, h / 2);
    ctx.clip();
    ctx.fillStyle = fill;
    ctx.fillRect(x, y, w * clamp(p), h);
    ctx.restore();
    rr(ctx, x, y, w, h, h / 2);
    ctx.lineWidth = lw;
    ctx.strokeStyle = stroke;
    ctx.stroke();
  }
}

/** Impact flash frame: inverts to a stark black/yellow silhouette feel. */
export function impactFlash(ctx, k, color = PAL.white) {
  if (k <= 0) return;
  ctx.save();
  ctx.globalAlpha = clamp(k);
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();
}

export { ease };
