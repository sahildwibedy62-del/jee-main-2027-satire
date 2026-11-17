// Character rig. One parametric 2D cartoon student with variants, expressions and poses.
// Coordinates: origin at the feet centre, figure ~640px tall at scale 1.
import { W, PAL, FONT, TAU, clamp, lerp, ease, hash, boil, noise } from './core.js';
import { circle, drop, heart, star } from './gfx.js';

export const KINDS = {
  bunty: { top: PAL.yellow, trim: PAL.ink, pants: PAL.ink2, hair: 'spiky', hairColor: PAL.ink, chest: '27', hood: true },
  topper: { top: PAL.cyan, trim: PAL.ink, pants: '#2b2b2b', hair: 'parted', hairColor: PAL.ink, glasses: 'round', collar: true },
  kabir: { top: PAL.red, trim: PAL.ink, pants: PAL.ink2, hair: 'quiff', hairColor: PAL.ink, glasses: 'shades', inner: PAL.white, chain: true },
  sleepy: { top: PAL.gray, trim: PAL.ink, pants: PAL.ink2, hair: 'messy', hairColor: PAL.ink, bags: true, hood: true },
  confused: { top: PAL.white, trim: PAL.ink, pants: PAL.ink2, hair: 'curly', hairColor: PAL.ink, chest: '?' },
  stressed: { top: PAL.red, trim: PAL.ink, pants: PAL.ink2, hair: 'wild', hairColor: PAL.ink, bags: true },
  director: { top: PAL.ink2, trim: PAL.ink, pants: PAL.ink2, hair: 'grey', hairColor: '#cfc8bb', suit: true, tie: PAL.red, mustache: true, glasses: 'square' },
  clerk: { top: PAL.paper2, trim: PAL.ink, pants: PAL.gray2, hair: 'bald', hairColor: PAL.ink, mustache: true, glasses: 'square' },
  oldBunty: { top: PAL.yellow, trim: PAL.ink, pants: PAL.ink2, hair: 'grey', hairColor: '#e9e4da', beard: true, hood: true, chest: '27' },
  alien: { top: PAL.cyan, trim: PAL.ink, pants: PAL.ink2, hair: 'antenna', hairColor: PAL.ink, skin: '#7be0a0', chest: '50' },
};

// Pose = [leftUpper, leftFore, rightUpper, rightFore] angles from straight-down, positive = outward.
export const POSES = {
  idle: [0.18, 0.12, 0.18, 0.12],
  cheer: [2.55, 0.35, 2.55, 0.35],
  point: [0.18, 0.12, 1.55, 0.05],
  pointUp: [0.18, 0.12, 2.75, 0.1],
  facepalm: [0.18, 0.12, -0.55, -2.45],
  think: [0.18, 0.12, -0.25, -2.55],
  type: [0.35, -1.45, 0.35, -1.45],
  shrug: [0.95, -2.05, 0.95, -2.05],
  wave: [0.18, 0.12, 2.3, 0.55],
  pray: [-0.15, -2.1, -0.15, -2.1],
  hold: [0.22, -1.35, 0.22, -1.35],
  holdUp: [2.4, -0.2, 2.4, -0.2],
  write: [0.18, 0.12, 0.3, -1.5],
  headgrab: [2.35, 1.85, 2.35, 1.85],
  flex: [1.5, -1.9, 1.5, -1.9],
  armsCross: [-0.1, -1.9, -0.1, -1.95],
  phone: [0.18, 0.12, 0.05, -2.2],
  fist: [0.18, 0.12, 2.6, -0.4],
  slump: [0.05, 0.05, 0.05, 0.05],
};

export function mixPose(a, b, p) {
  const A = typeof a === 'string' ? POSES[a] : a;
  const B = typeof b === 'string' ? POSES[b] : b;
  return A.map((v, i) => lerp(v, B[i], p));
}

const LW = 7;

function armPts(side, a1, a2, shoulderY = -330) {
  const sx = side * 78, sy = shoulderY;
  const d1 = [side * Math.sin(a1), Math.cos(a1)];
  const ex = sx + d1[0] * 100, ey = sy + d1[1] * 100;
  const a = a1 + a2;
  const d2 = [side * Math.sin(a), Math.cos(a)];
  return [sx, sy, ex, ey, ex + d2[0] * 96, ey + d2[1] * 96];
}

function drawArm(ctx, pts, sleeve, skin) {
  const [sx, sy, ex, ey, hx, hy] = pts;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(sx, sy);
  ctx.lineTo(ex, ey);
  ctx.lineTo(hx, hy);
  ctx.strokeStyle = PAL.ink;
  ctx.lineWidth = 46 + LW * 2;
  ctx.stroke();
  ctx.strokeStyle = sleeve;
  ctx.lineWidth = 46;
  ctx.stroke();
  circle(ctx, hx, hy, 25, skin, PAL.ink, LW);
}

/**
 * Draw a full-body student.
 * o: { t, kind, expr, pose, look:[x,y], flip, bob, squash, lean, seed, props:{...}, prop(ctx) }
 */
export function student(ctx, x, y, s, o = {}) {
  const t = o.t || 0;
  const K = { ...KINDS[o.kind || 'bunty'], ...(o.style || {}) };
  const skin = K.skin || PAL.skin;
  const seed = o.seed || 1;
  const pose = o.pose ? (typeof o.pose === 'string' ? POSES[o.pose] : o.pose) : POSES.idle;
  const breathe = Math.sin(t * 2.4 + seed) * 0.012;
  const bob = o.bob ? Math.abs(Math.sin(t * o.bob * Math.PI)) * -26 : 0;
  const sq = o.squash || 0; // + squash, - stretch
  ctx.save();
  ctx.translate(x + boil(t, seed, 1.2), y + bob);
  ctx.scale(s * (o.flip ? -1 : 1) * (1 + sq * 0.25), s * (1 - sq * 0.25 + breathe));
  ctx.rotate((o.lean || 0) + boil(t, seed + 5, 0.006));

  // shadow
  ctx.save();
  ctx.globalAlpha = 0.18;
  ctx.fillStyle = PAL.ink;
  ctx.beginPath();
  ctx.ellipse(0, 4, 150, 22, 0, 0, TAU);
  ctx.fill();
  ctx.restore();

  // legs
  const legSpread = o.sit ? 0 : 1;
  ctx.fillStyle = K.pants;
  ctx.strokeStyle = PAL.ink;
  ctx.lineWidth = LW;
  if (!o.noLegs) {
    for (const side of [-1, 1]) {
      const kick = o.run ? Math.sin(t * 14 + (side > 0 ? 0 : Math.PI)) * 40 : 0;
      ctx.beginPath();
      ctx.moveTo(side * 22, -140);
      ctx.lineTo(side * (62 * legSpread + 8) + kick, -10);
      ctx.lineTo(side * (62 * legSpread + 8) + kick + side * -48, -10);
      ctx.lineTo(side * 2, -140);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // shoe
      ctx.fillStyle = PAL.white;
      ctx.beginPath();
      ctx.ellipse(side * (62 * legSpread - 12) + kick + side * 14, -8, 46, 20, 0, 0, TAU);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = K.pants;
    }
  }

  const back = [];
  const front = [];
  const L = armPts(-1, pose[0], pose[1]);
  const R = armPts(1, pose[2], pose[3]);
  // Arms crossing the face/torso go in front.
  const frontArm = (p, a1) => a1 < 0 || (p[5] < -300 && Math.abs(p[4]) < 70);
  (frontArm(L, pose[0]) || o.armsFront ? front : back).push(L);
  (frontArm(R, pose[2]) || o.armsFront ? front : back).push(R);
  back.forEach((p) => drawArm(ctx, p, K.top, skin));

  // torso
  ctx.beginPath();
  ctx.moveTo(-92, -335);
  ctx.quadraticCurveTo(-116, -230, -96, -132);
  ctx.quadraticCurveTo(0, -112, 96, -132);
  ctx.quadraticCurveTo(116, -230, 92, -335);
  ctx.quadraticCurveTo(0, -372, -92, -335);
  ctx.closePath();
  ctx.fillStyle = K.top;
  ctx.fill();
  ctx.lineWidth = LW;
  ctx.strokeStyle = PAL.ink;
  ctx.stroke();
  if (K.inner) {
    ctx.fillStyle = K.inner;
    ctx.beginPath();
    ctx.moveTo(-34, -352);
    ctx.lineTo(34, -352);
    ctx.lineTo(26, -128);
    ctx.lineTo(-26, -128);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
  if (K.suit) {
    ctx.fillStyle = PAL.white;
    ctx.beginPath();
    ctx.moveTo(-36, -354);
    ctx.lineTo(36, -354);
    ctx.lineTo(0, -230);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = K.tie;
    ctx.beginPath();
    ctx.moveTo(-12, -350);
    ctx.lineTo(12, -350);
    ctx.lineTo(18, -250);
    ctx.lineTo(0, -228);
    ctx.lineTo(-18, -250);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
  if (K.hood) {
    ctx.beginPath();
    ctx.moveTo(-70, -350);
    ctx.quadraticCurveTo(0, -300, 70, -350);
    ctx.stroke();
    // drawstrings
    for (const sx of [-24, 24]) {
      ctx.beginPath();
      ctx.moveTo(sx, -326);
      ctx.lineTo(sx + boil(t, sx, 2), -270);
      ctx.lineWidth = 5;
      ctx.stroke();
      circle(ctx, sx, -268, 6, PAL.white, PAL.ink, 4);
    }
    ctx.lineWidth = LW;
    // pocket
    ctx.beginPath();
    ctx.moveTo(-54, -190);
    ctx.lineTo(54, -190);
    ctx.lineTo(66, -146);
    ctx.lineTo(-66, -146);
    ctx.closePath();
    ctx.stroke();
  }
  if (K.collar) {
    ctx.fillStyle = PAL.white;
    for (const sd of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(0, -350);
      ctx.lineTo(sd * 52, -360);
      ctx.lineTo(sd * 30, -318);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
    for (let i = 0; i < 3; i++) circle(ctx, 0, -300 + i * 50, 6, PAL.white, PAL.ink, 4);
  }
  if (K.chain) {
    ctx.beginPath();
    ctx.arc(0, -350, 46, 0.3, Math.PI - 0.3);
    ctx.strokeStyle = PAL.yellow;
    ctx.lineWidth = 8;
    ctx.stroke();
    ctx.strokeStyle = PAL.ink;
    ctx.lineWidth = LW;
  }
  if (K.chest && !K.inner) {
    ctx.save();
    ctx.font = `64px "${FONT.display}"`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = PAL.ink;
    ctx.fillText(K.chest, 0, -236);
    ctx.restore();
  }
  if (o.chestText) {
    ctx.save();
    ctx.font = `46px "${FONT.display}"`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = PAL.ink;
    ctx.fillText(o.chestText, 0, -236);
    ctx.restore();
  }

  if (o.prop) {
    ctx.save();
    o.prop(ctx, R, L);
    ctx.restore();
  }

  // head
  ctx.save();
  const headTilt = (o.tilt || 0) + Math.sin(t * 1.7 + seed) * 0.02;
  ctx.translate(0, -470);
  ctx.rotate(headTilt);
  head(ctx, 0, 0, 1, { ...o, K, skin });
  ctx.restore();

  front.forEach((p) => drawArm(ctx, p, K.top, skin));
  if (o.propFront) {
    ctx.save();
    o.propFront(ctx, R, L);
    ctx.restore();
  }
  ctx.restore();
}

/** Head only (radius ~105 at s = 1). Usable for close-ups. */
export function head(ctx, x, y, s, o = {}) {
  const t = o.t || 0;
  const K = o.K || { ...KINDS[o.kind || 'bunty'], ...(o.style || {}) };
  const skin = o.skin || K.skin || PAL.skin;
  const expr = o.expr || 'neutral';
  const seed = o.seed || 1;
  const look = o.look || [Math.sin(t * 0.7 + seed) * 0.3, 0];
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  const R = 105;

  // hair back layer (for wild/curly)
  if (K.hair === 'wild' || K.hair === 'curly' || K.hair === 'messy') {
    ctx.fillStyle = K.hairColor;
    ctx.beginPath();
    const n = K.hair === 'curly' ? 16 : 11;
    for (let i = 0; i <= n; i++) {
      const a = Math.PI + (i / n) * Math.PI;
      const rr = R + (K.hair === 'wild' ? 46 : 26) + (i % 2 ? 0 : 18) + boil(t, i + seed, 4);
      const px = Math.cos(a) * rr, py = Math.sin(a) * rr - 10;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.lineTo(R, 10);
    ctx.lineTo(-R, 10);
    ctx.closePath();
    ctx.fill();
    ctx.lineWidth = LW;
    ctx.strokeStyle = PAL.ink;
    ctx.stroke();
  }

  // ears
  circle(ctx, -R + 4, 8, 24, skin, PAL.ink, LW);
  circle(ctx, R - 4, 8, 24, skin, PAL.ink, LW);
  // face
  ctx.beginPath();
  ctx.ellipse(0, 0, R, R * 1.02, 0, 0, TAU);
  ctx.fillStyle = skin;
  ctx.fill();
  ctx.lineWidth = LW;
  ctx.strokeStyle = PAL.ink;
  ctx.stroke();

  // blush
  if (['love', 'happy', 'smug', 'shy'].includes(expr)) {
    ctx.save();
    ctx.globalAlpha = 0.45;
    ctx.fillStyle = PAL.red;
    ctx.beginPath();
    ctx.ellipse(-58, 34, 20, 11, 0, 0, TAU);
    ctx.ellipse(58, 34, 20, 11, 0, 0, TAU);
    ctx.fill();
    ctx.restore();
  }

  if (K.beard) {
    ctx.fillStyle = K.hairColor;
    ctx.beginPath();
    ctx.moveTo(-R + 6, 10);
    ctx.quadraticCurveTo(-90, 180, 0, 260 + boil(t, 3, 6));
    ctx.quadraticCurveTo(90, 180, R - 6, 10);
    ctx.quadraticCurveTo(0, 70, -R + 6, 10);
    ctx.fill();
    ctx.stroke();
  }

  // eyes
  eyes(ctx, expr, look, t, seed, K);

  // nose
  ctx.beginPath();
  ctx.moveTo(4, 8);
  ctx.quadraticCurveTo(14, 26, 0, 30);
  ctx.lineWidth = 5;
  ctx.strokeStyle = PAL.ink;
  ctx.stroke();

  if (K.mustache) {
    ctx.fillStyle = K.hairColor === '#cfc8bb' ? '#bdb5a6' : PAL.ink;
    ctx.beginPath();
    ctx.moveTo(0, 38);
    ctx.quadraticCurveTo(-30, 30, -50, 52);
    ctx.quadraticCurveTo(-22, 46, 0, 50);
    ctx.quadraticCurveTo(22, 46, 50, 52);
    ctx.quadraticCurveTo(30, 30, 0, 38);
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.stroke();
  }

  mouth(ctx, expr, t, o.talk, K);

  // hair
  hair(ctx, K, t, seed);

  // extras
  if (K.bags) {
    ctx.strokeStyle = PAL.gray2;
    ctx.lineWidth = 4;
    for (const sx of [-40, 40]) {
      ctx.beginPath();
      ctx.arc(sx, 22, 20, 0.3, Math.PI - 0.3);
      ctx.stroke();
    }
  }
  if (K.glasses === 'round' || K.glasses === 'square') {
    ctx.lineWidth = 6;
    ctx.strokeStyle = PAL.ink;
    for (const sx of [-40, 40]) {
      ctx.beginPath();
      if (K.glasses === 'round') ctx.arc(sx, -4, 32, 0, TAU);
      else ctx.rect(sx - 32, -30, 64, 52);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(-8, -6);
    ctx.lineTo(8, -6);
    ctx.stroke();
    // glint
    ctx.save();
    ctx.globalAlpha = 0.7;
    ctx.strokeStyle = PAL.white;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(-56, -20);
    ctx.lineTo(-44, -30);
    ctx.moveTo(24, -20);
    ctx.lineTo(36, -30);
    ctx.stroke();
    ctx.restore();
  }
  if (K.glasses === 'shades') {
    ctx.fillStyle = PAL.ink;
    ctx.beginPath();
    ctx.moveTo(-80, -30);
    ctx.lineTo(80, -30);
    ctx.lineTo(74, 0);
    ctx.quadraticCurveTo(44, 24, 12, 0);
    ctx.lineTo(-12, 0);
    ctx.quadraticCurveTo(-44, 24, -74, 0);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = PAL.cyan;
    ctx.globalAlpha = 0.8;
    ctx.fillRect(-62, -22, 20, 6);
    ctx.fillRect(30, -22, 20, 6);
    ctx.globalAlpha = 1;
  }
  extras(ctx, expr, t, seed, o);
  ctx.restore();
}

function eyes(ctx, expr, look, t, seed, K) {
  const blinkCycle = (t + hash(seed, 9) * 3) % 3.4;
  let open = blinkCycle < 0.12 ? 0.1 : 1;
  if (expr === 'sleepy' || expr === 'bored') open = 0.35;
  if (expr === 'smug') open = 0.55;
  if (expr === 'angry') open = 0.75;
  const shock = expr === 'shock' || expr === 'scream';
  const lx = clamp(look[0], -1, 1) * 9, ly = clamp(look[1], -1, 1) * 9;
  const browY = { angry: -50, shock: -70, scream: -66, sad: -54, cry: -54, confused: -58, happy: -60, love: -60, smug: -52, determined: -50 }[expr] ?? -56;
  // brows
  ctx.lineWidth = 11;
  ctx.lineCap = 'round';
  ctx.strokeStyle = PAL.ink;
  for (const side of [-1, 1]) {
    let tilt = 0;
    if (expr === 'angry' || expr === 'determined') tilt = 0.4;
    if (expr === 'sad' || expr === 'cry') tilt = -0.35;
    if (expr === 'confused') tilt = side > 0 ? -0.4 : 0.25;
    if (expr === 'smug') tilt = side > 0 ? -0.25 : 0.15;
    const bx = side * 40;
    const by = browY + (expr === 'confused' && side > 0 ? -14 : 0);
    ctx.beginPath();
    ctx.moveTo(bx - side * 24, by - Math.sin(tilt) * -14);
    ctx.lineTo(bx + side * 24, by - Math.sin(tilt) * 14);
    ctx.stroke();
  }
  if (K.glasses === 'shades') return;
  for (const side of [-1, 1]) {
    const ex = side * 40, ey = -4;
    if (expr === 'love') {
      heart(ctx, ex, ey + 6, 26, PAL.red, PAL.ink, 4);
      continue;
    }
    if (expr === 'dizzy' || expr === 'confusedSwirl') {
      ctx.beginPath();
      for (let i = 0; i < 40; i++) {
        const a = i * 0.45 + t * 8 * side;
        const r = i * 0.6;
        ctx.lineTo(ex + Math.cos(a) * r, ey + Math.sin(a) * r);
      }
      ctx.lineWidth = 4;
      ctx.stroke();
      continue;
    }
    if (expr === 'happy' || expr === 'laugh') {
      ctx.beginPath();
      ctx.arc(ex, ey + 8, 18, Math.PI + 0.3, -0.3);
      ctx.lineWidth = 8;
      ctx.stroke();
      continue;
    }
    if (expr === 'xx') {
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.moveTo(ex - 14, ey - 14);
      ctx.lineTo(ex + 14, ey + 14);
      ctx.moveTo(ex + 14, ey - 14);
      ctx.lineTo(ex - 14, ey + 14);
      ctx.stroke();
      continue;
    }
    if (expr === 'stars') {
      star(ctx, ex, ey, 24, PAL.yellow, PAL.ink, 4, t * 3);
      continue;
    }
    const rx = shock ? 28 : 23, ry = (shock ? 34 : 27) * open;
    ctx.beginPath();
    ctx.ellipse(ex, ey, rx, Math.max(2, ry), 0, 0, TAU);
    ctx.fillStyle = PAL.white;
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.stroke();
    if (open > 0.2) {
      const pr = shock ? 7 : expr === 'blank' ? 3 : 11;
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(ex, ey, rx, Math.max(2, ry), 0, 0, TAU);
      ctx.clip();
      circle(ctx, ex + lx, ey + ly, pr, PAL.ink, null, 0);
      circle(ctx, ex + lx + 3, ey + ly - 4, pr * 0.3, PAL.white, null, 0);
      ctx.restore();
    }
    if (open < 1 && open > 0.2) {
      // heavy lid
      ctx.beginPath();
      ctx.moveTo(ex - rx - 2, ey - ry + 2);
      ctx.lineTo(ex + rx + 2, ey - ry + 2);
      ctx.lineWidth = 7;
      ctx.stroke();
    }
  }
}

function mouth(ctx, expr, t, talk, K) {
  ctx.lineWidth = 7;
  ctx.strokeStyle = PAL.ink;
  ctx.lineCap = 'round';
  const my = 58;
  const talkOpen = talk ? Math.abs(Math.sin(t * 16)) * 0.8 + 0.2 : 0;
  const filled = (path) => {
    ctx.beginPath();
    path();
    ctx.closePath();
    ctx.fillStyle = PAL.ink2;
    ctx.fill();
    ctx.stroke();
  };
  switch (expr) {
    case 'happy':
    case 'laugh':
    case 'love':
    case 'stars':
      filled(() => {
        ctx.moveTo(-40, my - 8);
        ctx.quadraticCurveTo(0, my + 52, 40, my - 8);
        ctx.quadraticCurveTo(0, my + 2, -40, my - 8);
      });
      ctx.fillStyle = PAL.red;
      ctx.beginPath();
      ctx.ellipse(0, my + 16, 16, 7, 0, 0, TAU);
      ctx.fill();
      break;
    case 'smug':
      ctx.beginPath();
      ctx.moveTo(-30, my + 4);
      ctx.quadraticCurveTo(10, my + 14, 38, my - 10);
      ctx.stroke();
      break;
    case 'shock':
      filled(() => ctx.ellipse(0, my + 6, 18, 26, 0, 0, TAU));
      break;
    case 'scream':
      filled(() => {
        ctx.moveTo(-34, my - 10);
        ctx.quadraticCurveTo(0, my - 24, 34, my - 10);
        ctx.quadraticCurveTo(30, my + 64, 0, my + 64);
        ctx.quadraticCurveTo(-30, my + 64, -34, my - 10);
      });
      ctx.fillStyle = PAL.red;
      ctx.beginPath();
      ctx.ellipse(0, my + 48, 16, 9, 0, 0, TAU);
      ctx.fill();
      break;
    case 'sad':
    case 'cry':
      ctx.beginPath();
      ctx.moveTo(-30, my + 16);
      ctx.quadraticCurveTo(0, my - 12, 30, my + 16);
      ctx.stroke();
      break;
    case 'angry':
      filled(() => {
        ctx.rect(-36, my - 4, 72, 26);
      });
      ctx.fillStyle = PAL.white;
      ctx.fillRect(-32, my, 64, 9);
      ctx.fillRect(-32, my + 10, 64, 8);
      ctx.strokeRect(-36, my - 4, 72, 26);
      break;
    case 'confused':
    case 'wavy':
      ctx.beginPath();
      for (let i = 0; i <= 12; i++) {
        const k = i / 12;
        ctx.lineTo(-30 + k * 60, my + 6 + Math.sin(k * TAU * 1.5 + t * 6) * 7);
      }
      ctx.stroke();
      break;
    case 'determined':
    case 'neutral':
    case 'bored':
    case 'blank':
      if (talkOpen) {
        filled(() => ctx.ellipse(0, my + 4, 22, 6 + 16 * talkOpen, 0, 0, TAU));
      } else {
        ctx.beginPath();
        ctx.moveTo(-24, my + 4);
        ctx.lineTo(24, my + 4);
        ctx.stroke();
      }
      break;
    case 'sleepy':
      filled(() => ctx.ellipse(10, my + 6, 12, 14 + Math.sin(t * 2) * 4, 0, 0, TAU));
      break;
    case 'xx':
    case 'dizzy':
      filled(() => ctx.ellipse(0, my + 8, 22, 12, 0, 0, TAU));
      break;
    default:
      ctx.beginPath();
      ctx.moveTo(-24, my);
      ctx.quadraticCurveTo(0, my + 16, 24, my);
      ctx.stroke();
  }
}

function hair(ctx, K, t, seed) {
  const R = 105;
  ctx.fillStyle = K.hairColor;
  ctx.strokeStyle = PAL.ink;
  ctx.lineWidth = LW;
  ctx.lineJoin = 'round';
  if (K.hair === 'spiky' || K.hair === 'messy' || K.hair === 'wild') {
    ctx.beginPath();
    ctx.moveTo(-R - 4, 4);
    const spikes = [[-112, -60], [-96, -92], [-104, -132], [-60, -118], [-48, -168], [-12, -128], [18, -178], [40, -124], [86, -152], [86, -104], [124, -98], [100, -50], [108, 4]];
    ctx.quadraticCurveTo(-118, -30, spikes[0][0], spikes[0][1]);
    for (let i = 1; i < spikes.length; i++) {
      const [px, py] = spikes[i];
      ctx.lineTo(px + boil(t, i + seed * 3, 2), py + boil(t, i + seed * 7, 3));
    }
    // fringe back along the forehead
    ctx.lineTo(80, -40);
    ctx.lineTo(56, -64);
    ctx.lineTo(30, -40);
    ctx.lineTo(4, -70);
    ctx.lineTo(-24, -44);
    ctx.lineTo(-50, -70);
    ctx.lineTo(-78, -34);
    ctx.lineTo(-96, -10);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (K.hair === 'parted') {
    ctx.beginPath();
    ctx.moveTo(-R - 2, 0);
    ctx.quadraticCurveTo(-R - 10, -110, -10, -116);
    ctx.quadraticCurveTo(R + 10, -112, R + 2, 0);
    ctx.quadraticCurveTo(80, -60, 20, -66);
    ctx.lineTo(-20, -96);
    ctx.quadraticCurveTo(-70, -60, -R - 2, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (K.hair === 'quiff') {
    ctx.beginPath();
    ctx.moveTo(-R, 0);
    ctx.quadraticCurveTo(-R - 10, -100, -40, -112);
    ctx.quadraticCurveTo(10, -200 + boil(t, seed, 4), 110, -150);
    ctx.quadraticCurveTo(70, -130, 100, -100);
    ctx.quadraticCurveTo(R + 6, -50, R, 0);
    ctx.quadraticCurveTo(60, -70, 0, -66);
    ctx.quadraticCurveTo(-70, -60, -R, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (K.hair === 'curly') {
    for (let i = 0; i < 9; i++) {
      const a = Math.PI + 0.15 + (i / 8) * (Math.PI - 0.3);
      circle(ctx, Math.cos(a) * 90, Math.sin(a) * 86 - 6, 34, K.hairColor, PAL.ink, LW);
    }
  } else if (K.hair === 'grey') {
    ctx.beginPath();
    ctx.moveTo(-R - 4, 10);
    ctx.quadraticCurveTo(-R - 18, -70, -70, -84);
    ctx.quadraticCurveTo(-40, -60, -60, -30);
    ctx.quadraticCurveTo(-90, 0, -R - 4, 10);
    ctx.moveTo(R + 4, 10);
    ctx.quadraticCurveTo(R + 18, -70, 70, -84);
    ctx.quadraticCurveTo(40, -60, 60, -30);
    ctx.quadraticCurveTo(90, 0, R + 4, 10);
    ctx.fill();
    ctx.stroke();
  } else if (K.hair === 'bald') {
    ctx.beginPath();
    ctx.arc(-50, -70, 18, Math.PI, 1.8 * Math.PI);
    ctx.lineWidth = 4;
    ctx.stroke();
  } else if (K.hair === 'antenna') {
    for (const sd of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(sd * 30, -96);
      ctx.quadraticCurveTo(sd * 60, -170, sd * 50 + boil(t, sd, 4), -200);
      ctx.lineWidth = 7;
      ctx.stroke();
      circle(ctx, sd * 50 + boil(t, sd, 4), -206, 16, PAL.yellow, PAL.ink, 6);
    }
  }
}

function extras(ctx, expr, t, seed, o) {
  if (expr === 'cry') {
    for (const sx of [-40, 40]) {
      const k = (t * 1.6 + (sx > 0 ? 0.5 : 0)) % 1;
      drop(ctx, sx + 6, 30 + k * 90, 14, PAL.cyan);
    }
  }
  if (o.sweat) {
    const k = (t * 0.9) % 1;
    drop(ctx, 90, -60 + k * 60, 18, PAL.cyan);
  }
  if (expr === 'angry' || o.vein) {
    ctx.save();
    ctx.translate(66, -82);
    ctx.strokeStyle = PAL.red;
    ctx.lineWidth = 7;
    const s = 1 + Math.sin(t * 14) * 0.12;
    ctx.scale(s, s);
    for (let i = 0; i < 4; i++) {
      ctx.rotate(Math.PI / 2);
      ctx.beginPath();
      ctx.moveTo(6, 6);
      ctx.quadraticCurveTo(8, 18, 22, 18);
      ctx.stroke();
    }
    ctx.restore();
  }
  if (expr === 'sleepy') {
    ctx.save();
    ctx.font = `60px "${FONT.comic}"`;
    ctx.fillStyle = PAL.ink;
    for (let i = 0; i < 3; i++) {
      const k = (t * 0.5 + i / 3) % 1;
      ctx.globalAlpha = 1 - k;
      ctx.fillText('z', 110 + k * 90, -100 - k * 160 - i * 6);
    }
    ctx.restore();
  }
  if (expr === 'confused') {
    ctx.save();
    ctx.font = `90px "${FONT.comic}"`;
    ctx.textAlign = 'center';
    ctx.lineWidth = 8;
    ctx.strokeStyle = PAL.ink;
    ctx.fillStyle = PAL.yellow;
    const y = -170 + Math.sin(t * 4) * 8;
    ctx.strokeText('?', 120, y);
    ctx.fillText('?', 120, y);
    ctx.restore();
  }
}

/** Crowd of simplified student heads/shoulders arranged in rows (exam hall). */
export function crowd(ctx, t, { rows = 10, cols = 12, x0 = 0, y0 = 380, x1 = W, y1 = 1000, keep = 1, seed = 3, desks = true, shrink = 0 } = {}) {
  for (let r = 0; r < rows; r++) {
    const k = r / (rows - 1);
    const y = lerp(y0, y1, ease.inQuad(k));
    const sc = lerp(0.18, 0.62, ease.inQuad(k));
    const span = lerp((x1 - x0) * 0.55, (x1 - x0) * 1.15, k);
    const cx = (x0 + x1) / 2;
    for (let c = 0; c < cols; c++) {
      const id = r * cols + c;
      const h = hash(id, seed);
      if (h > keep) continue;
      // individual shrink-out (pop) as competition "decreases"
      const vanish = shrink > 0 ? clamp((shrink - h * 0.9) * 6) : 0;
      if (vanish >= 1) continue;
      const x = cx - span / 2 + (c + 0.5) * (span / cols) + (hash(id, seed + 1) - 0.5) * 10;
      const s = sc * (1 - ease.inBack(vanish));
      const bob = Math.sin(t * 3 + id) * 3;
      ctx.save();
      ctx.translate(x, y + bob);
      ctx.scale(s, s);
      // shoulders
      const tops = [PAL.yellow, PAL.cyan, PAL.red, PAL.white, PAL.gray];
      ctx.fillStyle = tops[Math.floor(hash(id, seed + 2) * tops.length)];
      ctx.beginPath();
      ctx.moveTo(-90, 120);
      ctx.quadraticCurveTo(-90, 30, 0, 30);
      ctx.quadraticCurveTo(90, 30, 90, 120);
      ctx.closePath();
      ctx.fill();
      ctx.lineWidth = 8;
      ctx.strokeStyle = PAL.ink;
      ctx.stroke();
      circle(ctx, 0, -30, 62, PAL.skin, PAL.ink, 8);
      ctx.fillStyle = PAL.ink;
      ctx.beginPath();
      ctx.arc(0, -40, 64, Math.PI * 1.05, Math.PI * 1.95);
      ctx.closePath();
      ctx.fill();
      if (desks) {
        ctx.fillStyle = PAL.paper3;
        ctx.fillRect(-110, 100, 220, 34);
        ctx.strokeRect(-110, 100, 220, 34);
        ctx.fillStyle = PAL.white;
        ctx.fillRect(-50, 92, 70, 14);
      }
      ctx.restore();
    }
  }
}
