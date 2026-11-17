// Core math, easing, deterministic randomness and palette.
// Everything here is pure: the same input always gives the same output,
// which is what makes frame-accurate rendering at any timestamp possible.

export const W = 1920;
export const H = 1080;
export const FPS = 30;

export const PAL = {
  ink: '#0d0c0b',
  ink2: '#1c1a17',
  paper: '#f3ecdc',
  paper2: '#e6dcc4',
  paper3: '#d6caae',
  yellow: '#ffd60a',
  yellow2: '#e9b800',
  red: '#ff2e2e',
  red2: '#c41616',
  cyan: '#22d3ee',
  cyan2: '#0e9fb8',
  gray: '#8b8477',
  gray2: '#5b564d',
  skin: '#c98a5a',
  skin2: '#a8693e',
  white: '#fffaf0',
};

export const FONT = {
  display: 'Anton',
  comic: 'Bangers',
  ui: 'Inter',
  mono: 'JetBrains Mono',
};

export const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
export const lerp = (a, b, t) => a + (b - a) * t;
export const invLerp = (a, b, v) => (b === a ? 0 : (v - a) / (b - a));
export const remap = (v, a, b, c, d) => lerp(c, d, clamp(invLerp(a, b, v)));
export const TAU = Math.PI * 2;

export const ease = {
  linear: (t) => t,
  inQuad: (t) => t * t,
  outQuad: (t) => 1 - (1 - t) * (1 - t),
  inOutQuad: (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
  inCubic: (t) => t * t * t,
  outCubic: (t) => 1 - Math.pow(1 - t, 3),
  inOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  outQuart: (t) => 1 - Math.pow(1 - t, 4),
  inExpo: (t) => (t === 0 ? 0 : Math.pow(2, 10 * t - 10)),
  outExpo: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  inOutExpo: (t) =>
    t === 0 ? 0 : t === 1 ? 1 : t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2,
  outBack: (t, s = 1.70158) => 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2),
  inBack: (t, s = 1.70158) => (s + 1) * t * t * t - s * t * t,
  outElastic: (t) => {
    if (t === 0 || t === 1) return t;
    return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1;
  },
  outBounce: (t) => {
    const n1 = 7.5625, d1 = 2.75;
    if (t < 1 / d1) return n1 * t * t;
    if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
    if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
    return n1 * (t -= 2.625 / d1) * t + 0.984375;
  },
};

/** Eased 0..1 progress of time t across [a, b]. */
export function seg(t, a, b, fn = ease.inOutCubic) {
  if (t <= a) return 0;
  if (t >= b) return 1;
  return fn((t - a) / (b - a));
}

/** Damped spring response from 0 -> 1 starting at t0 (overshoots then settles). */
export function spring(t, t0 = 0, freq = 3.2, damp = 5) {
  const x = t - t0;
  if (x <= 0) return 0;
  return 1 - Math.exp(-damp * x) * Math.cos(freq * TAU * x);
}

/** 0 -> 1 -> 0 bump centred on `at` with total width `dur`. */
export function pulse(t, at, dur = 0.3) {
  const x = (t - at) / dur;
  if (x <= -0.5 || x >= 0.5) return 0;
  return Math.cos(x * Math.PI);
}

/** Quick attack, slower decay envelope starting at `at`. */
export function hit(t, at, decay = 0.25) {
  const x = t - at;
  if (x < 0) return 0;
  return Math.exp(-x / decay);
}

/** Integer hash -> [0,1). Deterministic across platforms. */
export function hash(n, seed = 0) {
  let x = (Math.floor(n) * 374761393 + seed * 668265263) | 0;
  x = (x ^ (x >>> 13)) * 1274126177;
  x = x ^ (x >>> 16);
  return ((x >>> 0) % 1000000) / 1000000;
}

/** Seeded PRNG (mulberry32). */
export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Smooth 1D value noise in [-1, 1]. */
export function noise(x, seed = 0) {
  const i = Math.floor(x);
  const f = x - i;
  const u = f * f * (3 - 2 * f);
  return lerp(hash(i, seed), hash(i + 1, seed), u) * 2 - 1;
}

/** Hand-drawn "boil": a value that changes on held frames (8 drawings / sec). */
export function boil(t, seed = 0, amp = 1.5, rate = 8) {
  return (hash(Math.floor(t * rate), seed) - 0.5) * 2 * amp;
}

/** Controlled camera shake offset [x, y, rot] with intensity 0..1. */
export function shake(t, intensity, seed = 7) {
  if (intensity <= 0) return [0, 0, 0];
  const k = intensity;
  return [noise(t * 28, seed) * 26 * k, noise(t * 31, seed + 3) * 26 * k, noise(t * 22, seed + 9) * 0.025 * k];
}

/** Indian-system number formatting (15,00,000). */
export function inr(n) {
  const s = String(Math.round(n));
  if (s.length <= 3) return s;
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return rest + ',' + last3;
}

/** Keyframe interpolation: kf = [[time, value], ...], value may be number or array. */
export function keys(t, kf, fn = ease.inOutCubic) {
  if (t <= kf[0][0]) return kf[0][1];
  for (let i = 0; i < kf.length - 1; i++) {
    const [ta, va] = kf[i];
    const [tb, vb] = kf[i + 1];
    if (t <= tb) {
      const p = fn(clamp((t - ta) / (tb - ta)));
      if (Array.isArray(va)) return va.map((v, j) => lerp(v, vb[j], p));
      return lerp(va, vb, p);
    }
  }
  return kf[kf.length - 1][1];
}
