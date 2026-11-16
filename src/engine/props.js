// Props & environments: desks, screens, phones, windows, buildings, mountains, calendars...
import { W, H, PAL, FONT, TAU, clamp, lerp, ease, hash, boil, seg } from './core.js';
import { card, rr, circle, line, halftone, spinner, progress, burst, rays, star, tick, cross } from './gfx.js';
import { txt, wrap } from './type.js';

/** 2.5D floor grid receding to a horizon (miniature-set feel). */
export function floor(ctx, { horizon = 900, color = PAL.paper2, lineColor = 'rgba(13,12,11,0.18)', vx = W / 2, scroll = 0 } = {}) {
  ctx.fillStyle = color;
  ctx.fillRect(-200, horizon, W + 400, H - horizon + 200);
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 3;
  for (let i = -14; i <= 14; i++) {
    ctx.beginPath();
    ctx.moveTo(vx + i * 8, horizon);
    ctx.lineTo(vx + i * 260, H + 200);
    ctx.stroke();
  }
  for (let j = 0; j < 14; j++) {
    const k = ((j + (scroll % 1)) / 14);
    const y = horizon + Math.pow(k, 2.2) * (H - horizon + 200);
    ctx.beginPath();
    ctx.moveTo(-200, y);
    ctx.lineTo(W + 200, y);
    ctx.stroke();
  }
}

/** Study desk with lamp and book stack. */
export function desk(ctx, x, y, s = 1, { t = 0, lamp = true, books = 3, mess = 0 } = {}) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  // legs
  ctx.fillStyle = PAL.ink2;
  ctx.fillRect(-380, 0, 30, 320);
  ctx.fillRect(350, 0, 30, 320);
  // top
  card(ctx, -420, -40, 840, 60, { fill: PAL.paper3, r: 10, shadow: 10 });
  if (lamp) {
    line(ctx, 300, -40, 260, -240, PAL.ink, 14);
    line(ctx, 260, -240, 170, -300, PAL.ink, 14);
    ctx.fillStyle = PAL.red;
    ctx.beginPath();
    ctx.moveTo(110, -330);
    ctx.lineTo(210, -330);
    ctx.lineTo(240, -250);
    ctx.lineTo(80, -250);
    ctx.closePath();
    ctx.fill();
    ctx.lineWidth = 7;
    ctx.strokeStyle = PAL.ink;
    ctx.stroke();
    ctx.save();
    ctx.globalAlpha = 0.25 + Math.sin(t * 20) * 0.01;
    ctx.fillStyle = PAL.yellow;
    ctx.beginPath();
    ctx.moveTo(90, -250);
    ctx.lineTo(230, -250);
    ctx.lineTo(360, -40);
    ctx.lineTo(-40, -40);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  for (let i = 0; i < books; i++) {
    const cols = [PAL.red, PAL.cyan, PAL.yellow, PAL.white];
    card(ctx, -360 + i * 6, -90 - i * 46, 230 - i * 12, 46, { fill: cols[i % 4], r: 6, shadow: 0, lw: 6 });
  }
  for (let i = 0; i < mess; i++) {
    ctx.save();
    ctx.translate(-100 + hash(i, 4) * 300, -50);
    ctx.rotate((hash(i, 5) - 0.5) * 0.8);
    card(ctx, -60, -14, 120, 22, { fill: PAL.white, r: 3, shadow: 0, lw: 4 });
    ctx.restore();
  }
  ctx.restore();
}

/** Laptop/monitor with screen callback screen(ctx, w, h). */
export function monitor(ctx, x, y, w, h, screen, { stand = true, bezel = 26, color = PAL.ink2, crt = false } = {}) {
  ctx.save();
  ctx.translate(x, y);
  if (stand) {
    ctx.fillStyle = color;
    ctx.fillRect(-40, h / 2, 80, 90);
    card(ctx, -160, h / 2 + 80, 320, 30, { fill: color, r: 10, shadow: 0, lw: 6 });
  }
  card(ctx, -w / 2 - bezel, -h / 2 - bezel, w + bezel * 2, h + bezel * 2 + (crt ? 40 : 0), { fill: crt ? PAL.paper3 : color, r: crt ? 34 : 24, shadow: 16 });
  ctx.save();
  rr(ctx, -w / 2, -h / 2, w, h, crt ? 30 : 8);
  ctx.clip();
  ctx.translate(-w / 2, -h / 2);
  screen(ctx, w, h);
  if (crt) {
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    for (let yy = 0; yy < h; yy += 6) ctx.fillRect(0, yy, w, 2);
  }
  ctx.restore();
  rr(ctx, -w / 2, -h / 2, w, h, crt ? 30 : 8);
  ctx.lineWidth = 6;
  ctx.strokeStyle = PAL.ink;
  ctx.stroke();
  if (crt) {
    circle(ctx, w / 2 - 20, h / 2 + 40, 12, PAL.red, PAL.ink, 4);
  }
  ctx.restore();
}

/** Smartphone with screen callback. */
export function phone(ctx, x, y, w, h, screen, { rot = 0, color = PAL.ink } = {}) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  card(ctx, -w / 2 - 22, -h / 2 - 50, w + 44, h + 100, { fill: color, r: 60, shadow: 18 });
  ctx.save();
  rr(ctx, -w / 2, -h / 2, w, h, 24);
  ctx.clip();
  ctx.translate(-w / 2, -h / 2);
  screen(ctx, w, h);
  ctx.restore();
  rr(ctx, -w / 2, -h / 2, w, h, 24);
  ctx.lineWidth = 4;
  ctx.strokeStyle = PAL.ink;
  ctx.stroke();
  rr(ctx, -50, -h / 2 - 34, 100, 18, 9);
  ctx.fillStyle = '#333';
  ctx.fill();
  ctx.restore();
}

/** Retro OS window with title bar. content(ctx, w, h) draws inside. */
export function win(ctx, x, y, w, h, title, content, { bar = PAL.cyan2, bg = PAL.white, retro = false, shadow = 14 } = {}) {
  ctx.save();
  ctx.translate(x, y);
  card(ctx, -w / 2, -h / 2, w, h, { fill: bg, r: retro ? 10 : 18, shadow });
  ctx.save();
  rr(ctx, -w / 2, -h / 2, w, 70, retro ? 10 : 18);
  ctx.clip();
  if (retro) {
    const g = ctx.createLinearGradient(0, -h / 2, 0, -h / 2 + 70);
    g.addColorStop(0, '#3d8df0');
    g.addColorStop(0.5, '#1f5fd1');
    g.addColorStop(1, '#1749b0');
    ctx.fillStyle = g;
  } else ctx.fillStyle = bar;
  ctx.fillRect(-w / 2, -h / 2, w, 70);
  ctx.restore();
  ctx.beginPath();
  ctx.moveTo(-w / 2, -h / 2 + 70);
  ctx.lineTo(w / 2, -h / 2 + 70);
  ctx.lineWidth = 6;
  ctx.strokeStyle = PAL.ink;
  ctx.stroke();
  txt(ctx, title, -w / 2 + 28, -h / 2 + 37, { size: 32, font: FONT.ui, weight: '800', fill: PAL.white, align: 'left' });
  // buttons
  const bx = w / 2 - 40;
  card(ctx, bx - 22, -h / 2 + 14, 44, 42, { fill: PAL.red, r: 8, shadow: 0, lw: 4 });
  txt(ctx, '×', bx, -h / 2 + 33, { size: 40, font: FONT.ui, weight: '900', fill: PAL.white });
  if (retro) {
    card(ctx, bx - 74, -h / 2 + 14, 44, 42, { fill: '#2f6fe0', r: 8, shadow: 0, lw: 4 });
    card(ctx, bx - 126, -h / 2 + 14, 44, 42, { fill: '#2f6fe0', r: 8, shadow: 0, lw: 4 });
  }
  ctx.save();
  ctx.beginPath();
  ctx.rect(-w / 2, -h / 2 + 73, w, h - 73);
  ctx.clip();
  ctx.translate(-w / 2, -h / 2 + 73);
  content && content(ctx, w, h - 73);
  ctx.restore();
  ctx.restore();
}

/** Error dialog with icon. */
export function errorBox(ctx, x, y, title, msg, { w = 760, h = 300, s = 1, rot = 0, icon = '!', color = PAL.red, retro = false } = {}) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.scale(s, s);
  win(ctx, 0, 0, w, h, title, (c, cw, ch) => {
    circle(c, 90, ch / 2, 52, color, PAL.ink, 7);
    txt(c, icon, 90, ch / 2 + 4, { size: 76, font: FONT.display, fill: PAL.white });
    const lines = wrap(c, msg, cw - 220, 36, FONT.ui, '800');
    lines.forEach((l, i) => txt(c, l, 170, ch / 2 - (lines.length - 1) * 22 + i * 44, { size: 36, font: FONT.ui, weight: '800', fill: PAL.ink, align: 'left' }));
  }, { bar: color === PAL.red ? PAL.red2 : PAL.cyan2, retro });
  ctx.restore();
}

/** Toast notification. */
export function toast(ctx, x, y, w, text, { icon = '!', color = PAL.red, p = 1 } = {}) {
  if (p <= 0) return;
  const e = ease.outBack(clamp(p));
  ctx.save();
  ctx.translate(x + (1 - e) * 600, y);
  card(ctx, -w / 2, -50, w, 100, { fill: PAL.white, r: 24, shadow: 10 });
  circle(ctx, -w / 2 + 56, 0, 30, color, PAL.ink, 5);
  txt(ctx, icon, -w / 2 + 56, 2, { size: 40, font: FONT.display, fill: PAL.white });
  txt(ctx, text, -w / 2 + 104, 2, { size: 32, font: FONT.ui, weight: '800', fill: PAL.ink, align: 'left' });
  ctx.restore();
}

/** Mountain of unresolved question papers with '?' marks. */
export function questionMountain(ctx, cx, base, w, h, t, { seed = 5, rise = 1 } = {}) {
  const r = (i, k = 0) => hash(i, seed + k);
  const n = 140;
  for (let i = 0; i < n; i++) {
    const k = i / n;
    const yy = base - Math.pow(k, 0.9) * h * rise;
    const spread = (1 - k) * w * 0.5 + 30;
    const x = cx + (r(i) - 0.5) * 2 * spread;
    ctx.save();
    ctx.translate(x, yy);
    ctx.rotate((r(i, 1) - 0.5) * 1.2);
    const pw = 130 + r(i, 2) * 40, ph = 170 + r(i, 3) * 40;
    ctx.fillStyle = i % 9 === 0 ? PAL.yellow : PAL.white;
    ctx.fillRect(-pw / 2, -ph / 2, pw, ph);
    ctx.lineWidth = 4;
    ctx.strokeStyle = PAL.ink;
    ctx.strokeRect(-pw / 2, -ph / 2, pw, ph);
    ctx.fillStyle = 'rgba(13,12,11,0.35)';
    for (let l = 0; l < 4; l++) ctx.fillRect(-pw / 2 + 14, -ph / 2 + 20 + l * 22, pw - 28 - (l % 2) * 30, 6);
    if (i % 3 === 0) txt(ctx, '?', 0, 30, { size: 80, font: FONT.comic, fill: PAL.red });
    ctx.restore();
  }
}

/** Generic grand institute building (dream). Not a real campus — a stylised temple of engineering. */
export function dreamBuilding(ctx, cx, base, s, t, { glow = 1, label = 'IIT BOMBAY' } = {}) {
  ctx.save();
  ctx.translate(cx, base);
  ctx.scale(s, s);
  if (glow > 0) {
    rays(ctx, 0, -560, { n: 22, color: PAL.yellow, rot: t * 0.15, r0: 120, r1: 1600, width: 0.45, alpha: 0.55 * glow });
  }
  // steps
  for (let i = 0; i < 4; i++) {
    card(ctx, -520 + i * 24, -40 - i * 36, 1040 - i * 48, 40, { fill: PAL.paper2, r: 4, shadow: 0, lw: 6 });
  }
  // body
  card(ctx, -440, -620, 880, 480, { fill: PAL.white, r: 6, shadow: 18 });
  // columns
  for (let i = 0; i < 6; i++) {
    const x = -380 + i * 152;
    card(ctx, x - 30, -580, 60, 430, { fill: PAL.paper, r: 4, shadow: 0, lw: 5 });
    ctx.strokeStyle = 'rgba(13,12,11,0.3)';
    ctx.lineWidth = 3;
    for (let f = -1; f <= 1; f++) {
      ctx.beginPath();
      ctx.moveTo(x + f * 14, -570);
      ctx.lineTo(x + f * 14, -160);
      ctx.stroke();
    }
  }
  // pediment
  ctx.beginPath();
  ctx.moveTo(-500, -620);
  ctx.lineTo(0, -900);
  ctx.lineTo(500, -620);
  ctx.closePath();
  ctx.fillStyle = PAL.paper;
  ctx.fill();
  ctx.lineWidth = 8;
  ctx.strokeStyle = PAL.ink;
  ctx.stroke();
  // dome
  ctx.beginPath();
  ctx.arc(0, -880, 120, Math.PI, 0);
  ctx.closePath();
  ctx.fillStyle = PAL.yellow;
  ctx.fill();
  ctx.stroke();
  line(ctx, 0, -1000, 0, -1080, PAL.ink, 8);
  ctx.fillStyle = PAL.red;
  ctx.beginPath();
  ctx.moveTo(0, -1080);
  ctx.lineTo(80 + Math.sin(t * 6) * 10, -1060);
  ctx.lineTo(0, -1040);
  ctx.fill();
  ctx.stroke();
  // emblem
  circle(ctx, 0, -720, 62, PAL.yellow, PAL.ink, 7);
  star(ctx, 0, -720, 40, PAL.red, PAL.ink, 4);
  // door with light
  ctx.fillStyle = PAL.yellow;
  rr(ctx, -90, -380, 180, 240, 90);
  ctx.fill();
  ctx.lineWidth = 7;
  ctx.stroke();
  txt(ctx, label, 0, -650 + 0, { size: 1, fill: 'transparent' });
  ctx.restore();
}

/** Wall calendar showing a page. */
export function calendar(ctx, x, y, s, top, big, { color = PAL.red, rot = 0, sub = '' } = {}) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.scale(s, s);
  card(ctx, -180, -220, 360, 440, { fill: PAL.white, r: 16, shadow: 14 });
  ctx.save();
  rr(ctx, -180, -220, 360, 110, 16);
  ctx.clip();
  ctx.fillStyle = color;
  ctx.fillRect(-180, -220, 360, 110);
  ctx.restore();
  ctx.lineWidth = 7;
  ctx.strokeStyle = PAL.ink;
  rr(ctx, -180, -220, 360, 440, 16);
  ctx.stroke();
  line(ctx, -180, -110, 180, -110, PAL.ink, 7);
  for (const rx of [-90, 90]) circle(ctx, rx, -220, 16, PAL.paper3, PAL.ink, 6);
  txt(ctx, top, 0, -162, { size: 56, fill: PAL.white });
  txt(ctx, big, 0, 40, { size: big.length > 3 ? 120 : 200, fill: PAL.ink });
  if (sub) txt(ctx, sub, 0, 170, { size: 40, font: FONT.ui, weight: '800', fill: PAL.red });
  ctx.restore();
}

/** Analog clock. */
export function clock(ctx, x, y, r, hours, { face = PAL.white } = {}) {
  circle(ctx, x, y, r, face, PAL.ink, 10);
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * TAU;
    line(ctx, x + Math.cos(a) * r * 0.8, y + Math.sin(a) * r * 0.8, x + Math.cos(a) * r * 0.92, y + Math.sin(a) * r * 0.92, PAL.ink, 6);
  }
  const ha = (hours / 12) * TAU - Math.PI / 2;
  const ma = ((hours % 1) * TAU) - Math.PI / 2;
  line(ctx, x, y, x + Math.cos(ha) * r * 0.5, y + Math.sin(ha) * r * 0.5, PAL.ink, 14);
  line(ctx, x, y, x + Math.cos(ma) * r * 0.78, y + Math.sin(ma) * r * 0.78, PAL.red, 9);
  circle(ctx, x, y, 12, PAL.ink, null, 0);
}

/** Open notebook; lines callback draws content on right page. */
export function notebook(ctx, x, y, w, h, { left = null, right = null, rot = 0 } = {}) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  card(ctx, -w / 2, -h / 2, w, h, { fill: PAL.white, r: 14, shadow: 14 });
  line(ctx, 0, -h / 2, 0, h / 2, PAL.ink, 6);
  ctx.strokeStyle = 'rgba(34,211,238,0.5)';
  ctx.lineWidth = 3;
  for (let yy = -h / 2 + 70; yy < h / 2 - 20; yy += 48) {
    ctx.beginPath();
    ctx.moveTo(-w / 2 + 20, yy);
    ctx.lineTo(w / 2 - 20, yy);
    ctx.stroke();
  }
  // rings
  for (let yy = -h / 2 + 40; yy < h / 2; yy += 70) circle(ctx, 0, yy, 10, PAL.paper3, PAL.ink, 4);
  if (left) {
    ctx.save();
    ctx.translate(-w / 2, -h / 2);
    left(ctx, w / 2, h);
    ctx.restore();
  }
  if (right) {
    ctx.save();
    ctx.translate(0, -h / 2);
    right(ctx, w / 2, h);
    ctx.restore();
  }
  ctx.restore();
}

/** Trophy. */
export function trophy(ctx, x, y, s, label = '1', { color = PAL.yellow } = {}) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  card(ctx, -130, 140, 260, 70, { fill: PAL.ink2, r: 8, shadow: 10 });
  ctx.fillStyle = color;
  ctx.fillRect(-30, 60, 60, 90);
  ctx.strokeStyle = PAL.ink;
  ctx.lineWidth = 7;
  ctx.strokeRect(-30, 60, 60, 90);
  for (const sd of [-1, 1]) {
    ctx.beginPath();
    ctx.arc(sd * 150, -100, 60, 0, TAU);
    ctx.lineWidth = 26;
    ctx.strokeStyle = PAL.ink;
    ctx.stroke();
    ctx.lineWidth = 14;
    ctx.strokeStyle = color;
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(-170, -200);
  ctx.lineTo(170, -200);
  ctx.quadraticCurveTo(160, 60, 0, 70);
  ctx.quadraticCurveTo(-160, 60, -170, -200);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.lineWidth = 8;
  ctx.strokeStyle = PAL.ink;
  ctx.stroke();
  ctx.save();
  ctx.globalAlpha = 0.5;
  ctx.fillStyle = PAL.white;
  ctx.fillRect(-120, -180, 26, 160);
  ctx.restore();
  txt(ctx, label, 0, -70, { size: 150, fill: PAL.ink });
  ctx.restore();
}

/** Laddoo (sweet ball). */
export function laddoo(ctx, x, y, r, t = 0, seed = 1) {
  circle(ctx, x, y, r, '#f5a623', PAL.ink, 6);
  ctx.fillStyle = 'rgba(120,60,0,0.45)';
  for (let i = 0; i < 14; i++) {
    const a = hash(i, seed) * TAU, d = hash(i, seed + 1) * r * 0.75;
    ctx.beginPath();
    ctx.arc(x + Math.cos(a) * d, y + Math.sin(a) * d, r * 0.08, 0, TAU);
    ctx.fill();
  }
  ctx.save();
  ctx.globalAlpha = 0.5;
  circle(ctx, x - r * 0.35, y - r * 0.35, r * 0.18, PAL.white, null, 0);
  ctx.restore();
}

/** Gear. */
export function gear(ctx, x, y, r, rot, fill = PAL.gray, teeth = 10) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.beginPath();
  for (let i = 0; i < teeth * 2; i++) {
    const a0 = (i / (teeth * 2)) * TAU, a1 = ((i + 1) / (teeth * 2)) * TAU;
    const rad = i % 2 ? r : r * 1.22;
    ctx.arc(0, 0, rad, a0, a1);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.lineWidth = 7;
  ctx.strokeStyle = PAL.ink;
  ctx.stroke();
  circle(ctx, 0, 0, r * 0.35, PAL.paper, PAL.ink, 7);
  ctx.restore();
}

/** Score card (mock test result). */
export function scoreCard(ctx, x, y, s, score, total = 300, { title = 'MOCK TEST RESULT', rot = 0, color = PAL.red } = {}) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.scale(s, s);
  card(ctx, -360, -300, 720, 600, { fill: PAL.white, r: 22, shadow: 20 });
  ctx.save();
  rr(ctx, -360, -300, 720, 110, 22);
  ctx.clip();
  ctx.fillStyle = PAL.ink;
  ctx.fillRect(-360, -300, 720, 110);
  ctx.restore();
  txt(ctx, title, 0, -244, { size: 54, fill: PAL.yellow, track: 3 });
  txt(ctx, String(Math.round(score)), -40, 40, { size: 300, fill: color, align: 'right' });
  txt(ctx, '/' + total, 0, 90, { size: 110, fill: PAL.ink, align: 'left' });
  ctx.fillStyle = 'rgba(13,12,11,0.2)';
  ctx.fillRect(-300, 200, 600, 8);
  ctx.fillRect(-300, 236, 420, 8);
  ctx.restore();
}

/** Simple sun / moon. */
export function sun(ctx, x, y, r, t, color = PAL.yellow) {
  rays(ctx, x, y, { n: 16, color, rot: t * 0.3, r0: r * 1.15, r1: r * 1.8, width: 0.5 });
  circle(ctx, x, y, r, color, PAL.ink, 8);
}

/** City/window blinds background used for rooms. */
export function room(ctx, t, { wall = PAL.paper, night = false, windowX = 760, poster = 'IIT YA KUCH NAHI' } = {}) {
  ctx.fillStyle = wall;
  ctx.fillRect(-200, -200, W + 400, 1500);
  halftone(ctx, 0, 0, W, 1300, { color: night ? PAL.ink : PAL.paper3, size: 28, max: 0.3, fade: 'down', alpha: 0.6 });
  // window
  card(ctx, windowX - 170, 260, 340, 400, { fill: night ? '#13233a' : PAL.cyan, r: 8, shadow: 12 });
  if (night) {
    circle(ctx, windowX + 60, 360, 46, PAL.paper, PAL.ink, 5);
    for (let i = 0; i < 8; i++) star(ctx, windowX - 140 + hash(i, 3) * 280, 290 + hash(i, 4) * 340, 8, PAL.white, null, 0);
  } else {
    circle(ctx, windowX + 70, 350, 50, PAL.yellow, PAL.ink, 5);
  }
  line(ctx, windowX, 260, windowX, 660, PAL.ink, 8);
  line(ctx, windowX - 170, 460, windowX + 170, 460, PAL.ink, 8);
  // poster
  if (poster) {
    ctx.save();
    ctx.translate(220, 420);
    ctx.rotate(-0.06);
    card(ctx, -150, -190, 300, 380, { fill: PAL.yellow, r: 6, shadow: 10 });
    const ls = wrap(ctx, poster, 240, 60, FONT.display, '');
    ls.forEach((l, i) => txt(ctx, l, 0, -100 + i * 74, { size: 64, fill: PAL.ink }));
    ctx.restore();
  }
  // floor
  ctx.fillStyle = night ? '#2a241c' : PAL.paper3;
  ctx.fillRect(-200, 1300, W + 400, 900);
  line(ctx, -200, 1300, W + 200, 1300, PAL.ink, 8);
}

/** Server rack. */
export function server(ctx, x, y, s, t, { fire = 0 } = {}) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  card(ctx, -160, -420, 320, 840, { fill: PAL.ink2, r: 12, shadow: 16 });
  for (let i = 0; i < 9; i++) {
    const yy = -390 + i * 90;
    card(ctx, -130, yy, 260, 70, { fill: '#2c2a26', r: 6, shadow: 0, lw: 4 });
    for (let l = 0; l < 4; l++) {
      const on = hash(i * 7 + l, Math.floor(t * 8)) > 0.4;
      circle(ctx, 80 - l * 34, yy + 35, 9, on ? (fire > 0.3 ? PAL.red : PAL.cyan) : '#444', null, 0);
    }
  }
  if (fire > 0) flames(ctx, 0, -420, 300 * fire, t);
  ctx.restore();
}

export function flames(ctx, x, y, size, t) {
  for (let i = 0; i < 7; i++) {
    const k = i / 6;
    const fx = x + (k - 0.5) * size * 1.3;
    const fh = size * (0.7 + hash(i, Math.floor(t * 10)) * 0.5);
    ctx.beginPath();
    ctx.moveTo(fx - size * 0.18, y);
    ctx.quadraticCurveTo(fx - size * 0.2, y - fh * 0.5, fx + boil(t, i, 10, 10), y - fh);
    ctx.quadraticCurveTo(fx + size * 0.2, y - fh * 0.5, fx + size * 0.18, y);
    ctx.closePath();
    ctx.fillStyle = i % 2 ? PAL.red : PAL.yellow;
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = PAL.ink;
    ctx.stroke();
  }
}

/** Book (closed or open). */
export function book(ctx, x, y, s, { color = PAL.red, title = 'PHYSICS', rot = 0, open = 0 } = {}) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.scale(s, s);
  if (open > 0) {
    const w = 260 * open;
    card(ctx, -w, -170, w, 340, { fill: PAL.white, r: 8, shadow: 10 });
    card(ctx, 0, -170, 260, 340, { fill: PAL.white, r: 8, shadow: 10 });
    ctx.fillStyle = 'rgba(13,12,11,0.3)';
    for (let i = 0; i < 7; i++) {
      ctx.fillRect(-w + 30, -130 + i * 40, (w - 60) * (0.6 + hash(i, 2) * 0.4), 8);
      ctx.fillRect(30, -130 + i * 40, 200 * (0.6 + hash(i, 3) * 0.4), 8);
    }
  } else {
    card(ctx, -130, -170, 260, 340, { fill: color, r: 10, shadow: 12 });
    ctx.fillStyle = PAL.ink;
    ctx.fillRect(-130, -170, 36, 340);
    const sz = Math.min(64, 1600 / Math.max(4, title.length * 3.2));
    txt(ctx, title, 18, -40, { size: sz, fill: PAL.white, stroke: PAL.ink, lw: 6 });
    ctx.fillStyle = PAL.white;
    ctx.fillRect(-60, 40, 160, 10);
    ctx.fillRect(-60, 70, 120, 10);
  }
  ctx.restore();
}

/** Simple chair (for seat grids). */
export function seat(ctx, x, y, s, fill = PAL.paper3) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.fillStyle = fill;
  ctx.strokeStyle = PAL.ink;
  ctx.lineWidth = 6;
  rr(ctx, -40, -70, 80, 60, 10);
  ctx.fill();
  ctx.stroke();
  rr(ctx, -46, -14, 92, 26, 8);
  ctx.fill();
  ctx.stroke();
  line(ctx, -36, 12, -36, 56, PAL.ink, 6);
  line(ctx, 36, 12, 36, 56, PAL.ink, 6);
  ctx.restore();
}

/** Video card used in recommendation feeds. */
export function videoCard(ctx, x, y, w, title, { s = 1, rot = 0, thumb = PAL.red, views = '1.2M views', seed = 1 } = {}) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.scale(s, s);
  const h = w * 0.56;
  card(ctx, -w / 2, -h / 2, w, h + 120, { fill: PAL.white, r: 18, shadow: 10 });
  ctx.save();
  rr(ctx, -w / 2, -h / 2, w, h, 18);
  ctx.clip();
  ctx.fillStyle = thumb;
  ctx.fillRect(-w / 2, -h / 2, w, h);
  halftone(ctx, -w / 2, -h / 2, w, h, { color: PAL.ink, size: 16, max: 0.3, fade: 'up', alpha: 0.5 });
  txt(ctx, hash(seed, 1) > 0.5 ? 'TOPPER SECRET' : 'MUST WATCH', 0, -h / 4 + 10, { size: w * 0.09, fill: PAL.yellow, stroke: PAL.ink, lw: 8 });
  ctx.restore();
  // play
  circle(ctx, 0, 10, w * 0.09, 'rgba(13,12,11,0.75)', null, 0);
  ctx.fillStyle = PAL.white;
  ctx.beginPath();
  ctx.moveTo(-w * 0.03, 10 - w * 0.045);
  ctx.lineTo(w * 0.05, 10);
  ctx.lineTo(-w * 0.03, 10 + w * 0.045);
  ctx.fill();
  const ls = wrap(ctx, title, w - 40, w * 0.06, FONT.ui, '800').slice(0, 2);
  ls.forEach((l, i) => txt(ctx, l, -w / 2 + 20, h / 2 + 34 + i * w * 0.07, { size: w * 0.06, font: FONT.ui, weight: '800', fill: PAL.ink, align: 'left' }));
  txt(ctx, views, -w / 2 + 20, h / 2 + 34 + ls.length * w * 0.07 + 4, { size: w * 0.045, font: FONT.ui, weight: '700', fill: PAL.gray2, align: 'left' });
  ctx.restore();
}

/** A sheet of exam questions (for exam hall / paper). */
export function paperSheet(ctx, x, y, w, h, { rot = 0, title = 'JEE MAIN 2027', lines = 9, qmarks = false } = {}) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  card(ctx, -w / 2, -h / 2, w, h, { fill: PAL.white, r: 6, shadow: 12 });
  txt(ctx, title, 0, -h / 2 + 50, { size: Math.min(52, w * 0.09), fill: PAL.ink });
  ctx.fillStyle = 'rgba(13,12,11,0.28)';
  for (let i = 0; i < lines; i++) {
    const yy = -h / 2 + 110 + i * ((h - 150) / lines);
    ctx.fillRect(-w / 2 + 40, yy, (w - 80) * (0.5 + hash(i, 7) * 0.5), 10);
    if (qmarks && i % 2 === 0) txt(ctx, '?', w / 2 - 40, yy + 6, { size: 44, font: FONT.comic, fill: PAL.red });
  }
  ctx.restore();
}

export { spinner, progress, burst, tick, cross, star };
