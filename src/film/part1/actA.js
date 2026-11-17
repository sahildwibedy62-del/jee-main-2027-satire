// PART 1 — ACT A: the hype, the reality check, why registrations *look* low.
// Scenes 01–17. Every draw() receives (ctx, lt, S) where S.t is absolute film time;
// all beats are keyed to narration word times via wt(line, word).
import {
  W, H, PAL, FONT, TAU, clamp, lerp, ease, hash, seg, boil, noise, inr,
  LN, wt, ls, le, talking, brain, idCard,
  pop, inOut, slide, at, cam, parallax, shakes, typed, backdrop, letterbox, cloud, sticker, chapterCard, ticker,
  barChart, lineChart, gauge, browser, field, button, searchBox, post, confetti, sparkles, wobble, emote, screenGlow, diya, firework,
  txt, wrap, measure, fit, smash, letters, block3D, flyIn, reveal, underline, scribbleCircle, stamp, count, punct,
  paperBG, halftone, card, rr, circle, line, burst, rays, star, heart, spinner, tick, cross, speedLines, streaks, bubble, arrow, drop, grawlix, progress, impactFlash, vignette,
  student, head, crowd, mixPose,
  floor, desk, monitor, phone, win, errorBox, toast, dreamBuilding, calendar, clock, notebook, book, paperSheet, scoreCard, server, flames, sun,
  spring, pulse, hit,
} from './common.js';

const F = FONT;

export const ACT_A = [
  // ───────────────────────── 01 · NEWS FLASH ─────────────────────────
  {
    id: 's01-news', from: 0, title: 'Breaking: competition kam?', trans: { type: 'cut' },
    sfx: () => [[0.05, 'sting'], [0.3, 'whoosh'], [wt(0, 'competition'), 'thud'], [wt(0, 'kam'), 'slideDown'], [wt(0, 'kam') + 0.5, 'ding']],
    draw(ctx, lt, S) {
      const T = S.t;
      backdrop(ctx, T, { tone: 'red', dots: PAL.red2, rayColor: PAL.red2, raysAlpha: 0.6 });
      ctx.save();
      cam(ctx, T, [[0, { z: 1.12, y: 20 }], [4.2, { z: 1, y: 0 }]], { shk: shakes(T, [wt(0, 'competition')], 0.5) });
      // TV studio monitor with the "headline"
      monitor(ctx, W / 2, 430, 1240, 600, (c, w, h) => {
        paperBG(c, 'dark', T);
        halftone(c, 0, 0, w, h, { color: PAL.ink2, size: 22, fade: 'up', alpha: 0.9 });
        letters(c, 'JEE MAIN 2027', w / 2, 150, T, 0.25, { size: 170, mode: 'drop', maxW: 1100, stagger: 0.05 });
        const tk = wt(0, 'competition');
        smash(c, 'COMPETITION', w / 2 - 110, 350, T, tk, { size: 150, fill: PAL.white, maxW: 800 });
        // down arrow that drops on "kam"
        const tk2 = wt(0, 'kam');
        const dp = seg(T, tk2, tk2 + 0.5, ease.outBounce);
        if (T > tk2) {
          at(c, w - 200, 340 + dp * 40, 1, 0, (cc) => {
            cc.fillStyle = PAL.yellow;
            cc.beginPath();
            cc.moveTo(-50, -130); cc.lineTo(50, -130); cc.lineTo(50, 0); cc.lineTo(100, 0); cc.lineTo(0, 110); cc.lineTo(-100, 0); cc.lineTo(-50, 0);
            cc.closePath(); cc.fill(); cc.lineWidth = 10; cc.strokeStyle = PAL.ink; cc.stroke();
          });
          txt(c, 'KAM?!', w / 2, 500, { size: 90 * pop(T, tk2, 0.3), fill: PAL.yellow, stroke: PAL.ink, lw: 12 });
        }
      }, { stand: false });
      ctx.restore();
      // anchor desk silhouette + live bug
      card(ctx, 90, 70, 200, 70, { fill: PAL.ink, r: 14, shadow: 0, lw: 0 });
      circle(ctx, 130, 105, 14, Math.floor(T * 2) % 2 ? PAL.red : PAL.white, null, 0);
      txt(ctx, 'LIVE', 210, 108, { size: 44, fill: PAL.white });
      ticker(ctx, T, H - 250, 'JEE MAIN 2027 MEIN REGISTRATION KAM?  ASPIRANTS KHUSH  •  CUTOFF GIREGI?  •  EXPERTS: "PADHAI KARO"', { label: 'BREAKING' });
    },
  },

  // ───────────────────────── 02 · GUDGUDI + RISHTA ─────────────────────────
  {
    id: 's02-rishta', from: 1, title: 'Gudgudi aur rishta', trans: { type: 'whip', dur: 0.4 },
    sfx: () => [[ls(1) + 0.3, 'giggle'], [wt(1, 'gudgudi'), 'giggle'], [wt(1, 'IIT'), 'doorbell'], [wt(1, 'director'), 'footsteps'], [wt(1, 'rishta'), 'heart'], [wt(1, 'rishta') + 0.4, 'shehnai']],
    draw(ctx, lt, S) {
      const T = S.t;
      const tDir = wt(1, 'IIT');
      const tRishta = wt(1, 'rishta');
      backdrop(ctx, T, { tone: PAL.yellow, dots: PAL.yellow2, rayColor: '#ffe45c', rx: 640, ry: 520 });
      ctx.save();
      const v = cam(ctx, T, [[ls(1), { x: -260, z: 1.25 }], [tDir - 0.2, { x: -200, z: 1.2 }], [tDir + 1, { x: 0, z: 1 }], [le(1), { x: 30, z: 1.04 }]]);
      floor(ctx, { horizon: 860, color: PAL.paper2 });
      // feather tickling Bunty
      const giggle = Math.sin(T * 22) * 0.06;
      student(ctx, 640, 900, 0.95, { t: T, kind: 'bunty', expr: T > tRishta ? 'love' : 'laugh', pose: T > tRishta ? 'pray' : mixPose('cheer', 'shrug', (Math.sin(T * 10) + 1) / 2), lean: giggle, squash: Math.sin(T * 18) * 0.06, seed: 2 });
      const fx = 640 + 230 + Math.sin(T * 9) * 50, fy = 460 + Math.cos(T * 11) * 30;
      at(ctx, fx, fy, 1, -0.9 + Math.sin(T * 9) * 0.3, (c) => {
        c.fillStyle = PAL.white;
        c.beginPath(); c.ellipse(0, -90, 34, 120, 0, 0, TAU); c.fill(); c.lineWidth = 6; c.strokeStyle = PAL.ink; c.stroke();
        line(c, 0, 40, 0, -200, PAL.ink, 6);
        for (let i = 0; i < 6; i++) line(c, 0, -170 + i * 30, (i % 2 ? 1 : -1) * 28, -150 + i * 30, PAL.ink, 3);
      });
      if (T < tRishta) txt(ctx, 'HEE HEE HEE', 640, 220 + Math.sin(T * 14) * 6, { size: 80, font: F.comic, fill: PAL.white, stroke: PAL.ink, lw: 10, alpha: inOut(T, ls(1) + 0.3, tRishta) });
      // Director arrives with a box of mithai + rishta card
      const walk = seg(T, tDir, tDir + 1.6, ease.outCubic);
      const dx = lerp(2300, 1320, walk);
      student(ctx, dx, 900, 0.95, {
        t: T, kind: 'director', expr: T > tRishta ? 'happy' : 'smug', pose: 'hold', run: walk < 1 && walk > 0, flip: true, seed: 7,
        propFront: (c) => {
          card(c, -150, -330, 300, 110, { fill: PAL.red, r: 10, shadow: 6 });
          txt(c, 'MITHAI', 0, -275, { size: 56, fill: PAL.yellow, stroke: PAL.ink, lw: 6 });
        },
      });
      if (T > tRishta) {
        const k = pop(T, tRishta, 0.45);
        at(ctx, 1000, 330, k, -0.06, (c) => {
          card(c, -250, -110, 500, 220, { fill: PAL.white, r: 24, shadow: 12 });
          heart(c, -170, -10, 52, PAL.red, PAL.ink, 6);
          txt(c, 'RISHTA', 40, -30, { size: 76, fill: PAL.red });
          txt(c, 'FROM: IIT BOMBAY', 40, 50, { size: 30, font: F.ui, weight: '800', fill: PAL.ink });
        });
        for (let i = 0; i < 9; i++) {
          const k2 = ((T - tRishta) * 0.6 + i / 9) % 1;
          heart(ctx, 400 + hash(i, 4) * 1100, 900 - k2 * 800, 22 + hash(i, 5) * 20, PAL.red, PAL.ink, 4);
        }
      }
      ctx.restore();
      void v;
      letterbox(ctx, 1, 60);
    },
  },

  // ───────────────────────── 03 · AKAL KAM ─────────────────────────
  {
    id: 's03-akal', from: 2, title: 'Competition nahi, akal kam', trans: { type: 'smash' },
    sfx: () => [[ls(2) + 0.1, 'party'], [wt(2, 'competition'), 'pop'], [ls(3) - 0.15, 'scratch'], [wt(3, 'akal'), 'shrink'], [wt(3, 'kam'), 'boing']],
    draw(ctx, lt, S) {
      const T = S.t;
      const tAkal = ls(3);
      if (T < tAkal) {
        backdrop(ctx, T, { tone: PAL.cyan, dots: PAL.cyan2, rayColor: '#5fe3f5', ry: 700 });
        ctx.save();
        cam(ctx, T, [[ls(2), { z: 1 }], [tAkal, { z: 1.08, y: -20 }]]);
        floor(ctx, { horizon: 860, color: PAL.paper2 });
        // party: everyone dancing
        const dancers = [['kabir', 420, 'smug', 3], ['bunty', 960, 'happy', 1], ['confused', 1500, 'happy', 5]];
        dancers.forEach(([k, x, e, sd], i) => {
          const ph = T * 8 + i;
          student(ctx, x, 900, 0.82, { t: T, kind: k, expr: e, pose: mixPose('cheer', 'fist', (Math.sin(ph) + 1) / 2), bob: 2, lean: Math.sin(ph * 0.5) * 0.12, seed: sd });
        });
        confetti(ctx, T, ls(2) + 0.1, { x: W / 2, y: 120, n: 120, spread: 700, g: 500 });
        const tc = wt(2, 'competition');
        sticker(ctx, 'COMPETITION KAM!', W / 2, 160, { size: 90, s: pop(T, tc), rot: -0.04 + Math.sin(T * 6) * 0.02 });
        ctx.restore();
      } else {
        // record-scratch freeze: close-up head with brain shrinking out of it
        backdrop(ctx, T, { tone: PAL.ink, dots: PAL.ink2, rayColor: PAL.ink2 });
        const k = seg(T, wt(3, 'akal'), le(3) + 0.1, ease.inOutCubic);
        ctx.save();
        cam(ctx, T, [[tAkal, { z: 1.3 }], [tAkal + 0.4, { z: 1 }]], { shk: shakes(T, [tAkal], 0.6) });
        head(ctx, 700, 600, 2.4, { t: T, kind: 'kabir', expr: 'happy', seed: 3 });
        // x-ray window on the skull
        const r = lerp(150, 26, k);
        circle(ctx, 700, 380, 190, 'rgba(13,12,11,0.75)', PAL.yellow, 8);
        brain(ctx, 700, 380, r, T);
        if (k > 0.9) txt(ctx, '(yahan tha)', 700, 470, { size: 30, font: F.ui, weight: '800', fill: PAL.yellow });
        // akal meter
        card(ctx, 1210, 240, 560, 520, { fill: PAL.white, r: 26, shadow: 16 });
        txt(ctx, 'AKAL-O-METER', 1490, 310, { size: 56, fill: PAL.ink });
        gauge(ctx, 1490, 600, 210, lerp(0.9, 0.03, k), { label: k > 0.6 ? 'KHATRA' : 'FULL', t: T });
        ctx.restore();
        sticker(ctx, 'AKAL KAM!', W / 2, 930, { size: 100, fill: PAL.red, color: PAL.white, s: pop(T, wt(3, 'kam')), rot: 0.03 });
      }
    },
  },

  // ───────────────────────── 04 · INTERNET DISCUSSION ─────────────────────────
  {
    id: 's04-internet', from: 4, title: 'Internet par discussion', trans: { type: 'glitch', dur: 0.35 },
    sfx: () => [0, 1, 2, 3, 4].map((i) => [ls(4) + 0.4 + i * 1.05, 'notif']).concat([[wt(4, 'registration'), 'whoosh']]),
    draw(ctx, lt, S) {
      const T = S.t;
      backdrop(ctx, T, { tone: PAL.paper2, dots: PAL.paper3 });
      const scroll = seg(T, ls(4) + 1.5, le(4) + 0.2, ease.inOutCubic) * 420;
      ctx.save();
      cam(ctx, T, [[ls(4), { z: 1.05, r: -0.02 }], [le(4), { z: 1.12, r: 0.01 }]]);
      browser(ctx, W / 2, 540, 1300, 900, 'forum.jee-gossip.in/thread/2027-registration', (c, w, h) => {
        c.fillStyle = PAL.paper; c.fillRect(0, 0, w, h);
        const posts = [
          ['@iit_ka_sapna', 'BRO registration kam hai is baar!! Competition HALF', PAL.yellow, '41K'],
          ['@cutoff_baba', 'Cutoff 60 percentile jayegi, likh ke le lo', PAL.cyan, '18K'],
          ['@topper_in_making', 'Matlab 50 marks mein bhi IIT? Main toh gaya', PAL.red, '9.2K'],
          ['@jee_bhakt_07', 'NTA ne khud bola (source: mera dost)', PAL.white, '77K'],
          ['@rank_predictor', 'AIR 1 confirm. Padhai ki zaroorat nahi', PAL.yellow, '12K'],
        ];
        posts.forEach(([hd, tx, av, lk], i) => {
          const t0 = ls(4) + 0.4 + i * 1.05;
          const k = pop(T, t0, 0.4);
          if (k <= 0) return;
          post(c, w / 2 + (1 - k) * 300, 140 + i * 250 - scroll, 1000, hd, tx, { s: k, rot: (hash(i, 3) - 0.5) * 0.05, likes: lk, avatar: av, hot: i % 2 === 0 });
        });
      }, { s: 1 });
      ctx.restore();
      txt(ctx, 'REGISTRATION KAM HO RAHA HAI?!', W / 2, 1000, { size: 64, fill: PAL.yellow, stroke: PAL.ink, lw: 12, shadow: 6, alpha: pop(T, wt(4, 'registration')) > 0 ? 1 : 0 });
    },
  },

  // ───────────────────────── 05 · IMAGINARY PERCENTILE ─────────────────────────
  {
    id: 's05-calc', from: 5, title: 'Imaginary percentile', trans: { type: 'zoom', dur: 0.45 },
    sfx: () => {
      const a = [];
      for (let i = 0; i < 10; i++) a.push([ls(5) + 0.6 + i * 0.26, 'click']);
      a.push([wt(5, 'percentile'), 'ding'], [wt(5, 'imaginary'), 'sparkle']);
      return a;
    },
    draw(ctx, lt, S) {
      const T = S.t;
      backdrop(ctx, T, { tone: PAL.paper, dots: PAL.paper3, rayColor: '#efe4c8' });
      ctx.save();
      cam(ctx, T, [[ls(5), { x: 120, z: 1.1 }], [le(5) + 0.3, { x: 0, z: 1 }]]);
      floor(ctx, { horizon: 870 });
      const typing = T > ls(5) + 0.5 && T < wt(5, 'percentile') + 0.2;
      student(ctx, 520, 930, 0.95, { t: T, kind: 'confused', expr: T > wt(5, 'calculate') ? 'stars' : 'happy', pose: typing ? mixPose('type', 'hold', (Math.sin(T * 30) + 1) / 2) : 'hold', seed: 5 });
      // giant calculator
      const val = count(T, ls(5) + 0.6, wt(5, 'percentile'), 12.5, 99.99);
      at(ctx, 1250, 520, 1, 0.04 + wobble(T, wt(5, 'percentile'), 0.05), (c) => {
        card(c, -300, -400, 600, 800, { fill: PAL.ink2, r: 40, shadow: 18 });
        card(c, -250, -350, 500, 170, { fill: '#b8e0a0', r: 14, shadow: 0, lw: 6 });
        txt(c, val.toFixed(2), 220, -262, { size: 110, font: F.mono, fill: PAL.ink, align: 'right' });
        txt(c, '%ILE', -230, -205, { size: 30, font: F.ui, weight: '800', fill: PAL.ink2, align: 'left' });
        for (let r = 0; r < 4; r++) for (let q = 0; q < 4; q++) {
          const id = r * 4 + q;
          const pressed = typing && hash(Math.floor(T * 4), id) > 0.8;
          const lab = ['7', '8', '9', '÷', '4', '5', '6', '×', '1', '2', '3', '−', '0', '.', '=', '+'][id];
          card(c, -250 + q * 128 + (pressed ? 4 : 0), -130 + r * 128 + (pressed ? 4 : 0), 110, 110, { fill: q === 3 ? PAL.yellow : PAL.paper, r: 18, shadow: pressed ? 2 : 8, lw: 5 });
          txt(c, lab, -195 + q * 128 + (pressed ? 4 : 0), -73 + r * 128 + (pressed ? 4 : 0), { size: 56, fill: PAL.ink });
        }
      });
      // thought bubble: imaginary IIT acceptance
      const tb = pop(T, wt(5, 'imaginary'), 0.5);
      if (tb > 0) {
        at(ctx, 520, 230, tb, 0, (c) => {
          bubble(c, -330, -150, 660, 270, 0, 260, { thought: true });
          txt(c, 'AIR 1?? PAKKA!', 0, -30, { size: 72, fill: PAL.red });
          txt(c, '(imaginary)', 0, 50, { size: 38, font: F.ui, weight: '800', fill: PAL.gray2, italic: true });
        });
        sparkles(ctx, 520, 200, 380, T);
      }
      ctx.restore();
      sticker(ctx, 'MAHAAN CALCULATION', 1250, 1000, { size: 46, fill: PAL.red, color: PAL.white, s: pop(T, ls(5) + 0.2), rot: -0.03 });
    },
  },

  // ───────────────────────── 06 · DOMINO LOGIC ─────────────────────────
  {
    id: 's06-domino', from: 6, title: 'Registration kam → selection pakka', trans: { type: 'wipe', color: PAL.cyan },
    sfx: () => [[ls(6), 'thud'], [ls(7), 'thud'], [ls(8), 'thud'], [wt(8, 'selection'), 'stamp'], [wt(8, 'pakka'), 'fanfare']],
    draw(ctx, lt, S) {
      const T = S.t;
      backdrop(ctx, T, { tone: PAL.ink, dots: PAL.ink2, rayColor: '#2a2620' });
      const items = [[ls(6), 'REGISTRATION', PAL.yellow], [ls(7), 'COMPETITION', PAL.cyan], [wt(8, 'cutoff'), 'CUTOFF', PAL.red]];
      const ts = wt(8, 'selection');
      ctx.save();
      cam(ctx, T, [[ls(6), { x: -380, z: 1.15 }], [ls(7), { x: 0, z: 1.1 }], [ls(8), { x: 380, z: 1.15 }], [ts, { x: 0, z: 0.98 }]], {}, ease.outCubic);
      items.forEach(([t0, word, col], i) => {
        const x = 380 + i * 580;
        const k = pop(T, t0, 0.35);
        // Domino falls when the next one lands
        const nextT = i < 2 ? items[i + 1][0] : ts;
        const fall = seg(T, nextT - 0.05, nextT + 0.3, ease.inCubic) * 0.22;
        at(ctx, x, 720, k, fall, (c) => {
          card(c, -240, -420, 480, 420, { fill: col, r: 26, shadow: 16 });
          txt(c, word, 0, -300, { size: fit(c, word, 420, 90), fill: PAL.ink });
          txt(c, 'KAM', 0, -150, { size: 130, fill: PAL.white, stroke: PAL.ink, lw: 12 });
          arrow(c, 0, -90, 0, -20, { color: PAL.ink, lw: 18, head: 50 });
        });
      });
      ctx.restore();
      if (T > ts) {
        impactFlash(ctx, hit(T, ts, 0.15) * 0.6, PAL.yellow);
        stamp(ctx, 'SELECTION PAKKA!', W / 2, 300, T, ts, { size: 150, color: '#2fae5a', rot: -0.08 });
        student(ctx, W / 2, 1100, 0.8, { t: T, kind: 'kabir', expr: 'smug', pose: 'flex', seed: 3, sweat: false });
        confetti(ctx, T, wt(8, 'pakka'), { x: W / 2, y: 300, n: 90 });
      }
    },
  },

  // ───────────────────────── 07 · NAAM vs ADMISSION ─────────────────────────
  {
    id: 's07-naam', from: 9, title: 'Papa ne naam itni jaldi nahi socha', trans: { type: 'tear' },
    sfx: () => [[ls(9) + 0.4, 'tick'], [ls(9) + 1.4, 'tick'], [ls(9) + 2.4, 'tick'], [wt(9, 'naam'), 'baby'], [wt(9, 'jaldi tumne'), 'whoosh'], [wt(9, 'confirm'), 'stamp'], [wt(9, 'confirm') + 0.3, 'ding']],
    draw(ctx, lt, S) {
      const T = S.t;
      const tR = wt(9, 'jitni');
      paperBG(ctx, 'paper', T);
      // LEFT panel: 2009 hospital, papa pondering a name
      const split = lerp(W, W / 2, seg(T, tR - 0.4, tR + 0.2, ease.outExpo));
      ctx.save();
      ctx.beginPath(); ctx.rect(0, 0, split, H); ctx.clip();
      backdrop(ctx, T, { tone: '#d7eef2', dots: '#b6dde4' });
      floor(ctx, { horizon: 860, color: '#e8f3f4', vx: split / 2 });
      calendar(ctx, 220, 260, 0.6, 'SAAL', '2009', { color: PAL.cyan2 });
      student(ctx, split / 2 + 40, 950, 0.9, { t: T, kind: 'clerk', expr: 'confused', pose: 'hold', seed: 8, propFront: (c) => {
        c.fillStyle = PAL.white;
        c.beginPath(); c.ellipse(0, -235, 120, 60, 0, 0, TAU); c.fill(); c.lineWidth = 7; c.strokeStyle = PAL.ink; c.stroke();
        head(c, -60, -260, 0.42, { t: T, kind: 'bunty', expr: 'sleepy', seed: 4 });
      } });
      const days = Math.floor(count(T, ls(9), tR, 1, 47, ease.linear));
      at(ctx, split / 2 + 40, 200, 1, 0, (c) => {
        bubble(c, -280, -120, 560, 220, 30, 140, { thought: true });
        txt(c, 'NAAM... NAAM...?', 0, -40, { size: 60, fill: PAL.ink });
        txt(c, `DIN ${days} / SOCH RAHE HAIN`, 0, 34, { size: 34, font: F.ui, weight: '800', fill: PAL.red });
      });
      clock(ctx, split - 160, 140, 80, T * 6);
      ctx.restore();
      // RIGHT panel: Bunty confirming admission in 0.01s
      if (split < W - 2) {
        ctx.save();
        ctx.beginPath(); ctx.rect(split, 0, W - split, H); ctx.clip();
        backdrop(ctx, T, { tone: PAL.yellow, dots: PAL.yellow2, rayColor: '#ffe45c', rx: split + (W - split) / 2 });
        const cx = split + (W - split) / 2;
        student(ctx, cx - 220, 960, 0.85, { t: T, kind: 'bunty', expr: 'smug', pose: 'fist', seed: 2 });
        const tc = wt(9, 'confirm');
        at(ctx, cx + 170, 520, pop(T, tR, 0.4), 0.05, (c) => {
          paperSheet(c, 0, 0, 380, 500, { title: 'IIT ADMISSION', lines: 7 });
        });
        stamp(ctx, 'CONFIRMED', cx + 170, 560, T, tc, { size: 70, color: '#2fae5a', rot: -0.25 });
        card(ctx, cx - 160, 90, 320, 110, { fill: PAL.ink, r: 20, shadow: 8 });
        txt(ctx, '0.01 SEC', cx, 147, { size: 70, font: F.mono, fill: PAL.yellow });
        ctx.restore();
        line(ctx, split, 0, split, H, PAL.ink, 14);
      }
    },
  },

  // ───────────────────────── 08 · REALITY CHECK ─────────────────────────
  {
    id: 's08-reality', from: 10, title: 'Reality check', trans: { type: 'iris', x: W / 2, y: 460 },
    sfx: () => [[ls(10) + 0.1, 'sparkle'], [wt(10, 'bahar'), 'pop'], [wt(10, 'bahar') + 0.1, 'fall'], [wt(10, 'reality') - 0.05, 'thud'], [wt(10, 'check'), 'stamp']],
    draw(ctx, lt, S) {
      const T = S.t;
      const tPop = wt(10, 'bahar');
      const tCheck = wt(10, 'reality');
      backdrop(ctx, T, { tone: T < tPop ? '#cdb7ff' : PAL.paper2, dots: T < tPop ? '#b49cf0' : PAL.paper3, rayColor: T < tPop ? '#dccbff' : null });
      ctx.save();
      cam(ctx, T, [[ls(10), { z: 1.1 }], [tPop, { z: 1.05 }], [tCheck, { z: 1, y: 40 }]], { shk: shakes(T, [tCheck], 0.8) });
      floor(ctx, { horizon: 900 });
      if (T < tPop) {
        // floating in a dream bubble
        const y = 480 + Math.sin(T * 2) * 20;
        circle(ctx, W / 2, y - 200, 330, 'rgba(255,255,255,0.35)', PAL.ink, 6);
        student(ctx, W / 2, y + 90, 0.75, { t: T, kind: 'bunty', expr: 'love', pose: 'cheer', seed: 2 });
        sparkles(ctx, W / 2, y - 200, 330, T, { n: 9 });
        // needle approaches
        const nx = lerp(1700, W / 2 + 300, seg(T, ls(10) + 0.3, tPop, ease.inCubic));
        at(ctx, nx, y - 300, 1, -0.6, (c) => { line(c, -200, 0, 0, 0, PAL.gray2, 12); circle(c, -210, 0, 18, PAL.red, PAL.ink, 5); });
      } else {
        // popped: falls onto floor
        const fall = seg(T, tPop, tCheck, ease.inQuad);
        burst(ctx, W / 2 + 300, 280, 140 * hit(T, tPop, 0.2), { fill: PAL.white, spikes: 12 });
        txt(ctx, 'POP!', W / 2 + 300, 280, { size: 110 * hit(T, tPop, 0.4), font: F.comic, fill: PAL.red, stroke: PAL.ink, lw: 8 });
        student(ctx, W / 2, lerp(570, 960, fall), 0.75, { t: T, kind: 'bunty', expr: T > tCheck ? 'xx' : 'shock', pose: 'headgrab', squash: T > tCheck ? 0.4 * hit(T, tCheck, 0.3) : -0.2, seed: 2 });
        if (T > tCheck) speedLines(ctx, W / 2, 600, T, { alpha: 0.25 * hit(T, tCheck, 0.6), inner: 500 });
      }
      ctx.restore();
      // the "reality cheque"
      if (T > tCheck - 0.2) {
        const k = 1 - slide(T, tCheck - 0.2, 0.35, ease.outBack);
        at(ctx, lerp(-600, 520, k), 300, 1, -0.07, (c) => {
          card(c, -380, -150, 760, 300, { fill: '#e9f7e4', r: 18, shadow: 14 });
          txt(c, 'BANK OF REALITY', -350, -100, { size: 36, fill: '#2f7a42', align: 'left' });
          txt(c, 'PAY: TUMHE', -350, -20, { size: 44, font: F.ui, weight: '800', fill: PAL.ink, align: 'left' });
          txt(c, 'AMOUNT: 1 REALITY CHECK', -350, 50, { size: 38, font: F.mono, fill: PAL.ink, align: 'left' });
          underline(c, 120, 115, 220, 1, PAL.ink, 5);
        });
        stamp(ctx, 'REALITY CHECK', 1400, 330, T, wt(10, 'check'), { size: 90, rot: 0.1 });
      }
    },
  },

  // ───────────────────────── 09 · SYLLABUS / 50 / CSE DREAM ─────────────────────────
  {
    id: 's09-50marks', from: 11, title: 'Syllabus adhoora, sapna CSE', trans: { type: 'whip', dir: -1 },
    sfx: () => [[ls(11) + 0.3, 'whoosh'], [wt(11, 'mock'), 'pop'], [wt(11, '50'), 'sadTrombone'], [wt(11, 'sapna'), 'sparkle'], [wt(11, 'CSE'), 'ding']],
    draw(ctx, lt, S) {
      const T = S.t;
      const t1 = wt(11, 'mock'), t2 = wt(11, 'sapna');
      backdrop(ctx, T, { tone: PAL.paper, dots: PAL.paper3 });
      ctx.save();
      cam(ctx, T, [[ls(11), { x: -420, z: 1.25 }], [t1 - 0.2, { x: -420, z: 1.25 }], [t1 + 0.4, { x: 0, z: 1.25 }], [t2 - 0.2, { x: 0, z: 1.2 }], [t2 + 0.6, { x: 0, z: 1 }]], {}, ease.inOutCubic);
      // panel 1: syllabus bar
      at(ctx, 540, 360, 1, -0.03, (c) => {
        card(c, -380, -160, 760, 320, { fill: PAL.white, r: 26, shadow: 14 });
        txt(c, 'SYLLABUS', 0, -90, { size: 70, fill: PAL.ink });
        const p = count(T, ls(11) + 0.3, ls(11) + 1.6, 0, 0.32);
        progress(c, -320, -20, 640, 70, p, { fill: PAL.red });
        txt(c, Math.round(p * 100) + '%  (POORA NAHI)', 0, 100, { size: 44, font: F.ui, weight: '800', fill: PAL.red });
      });
      // panel 2: scorecard 50/300
      const sc = Math.round(count(T, t1, wt(11, '50') + 0.3, 0, 50));
      at(ctx, 960, 360, pop(T, t1, 0.4) * 0.62, 0.04, (c) => scoreCard(c, 0, 0, 1, sc, 300));
      // panel 3: dream
      student(ctx, 980, 1020, 0.7, { t: T, kind: 'bunty', expr: T > t2 ? 'love' : 'sad', pose: T > t2 ? 'pray' : 'idle', seed: 2, sweat: T < t2 });
      ctx.restore();
      if (T > t2) {
        const k = pop(T, t2, 0.6);
        at(ctx, 1460, 400, k, 0, (c) => {
          bubble(c, -400, -330, 800, 600, -360, 360, { thought: true });
          dreamBuilding(c, 0, 220, 0.42, T, { glow: 1 });
          sticker(c, 'IIT BOMBAY · CSE', 0, 200, { size: 54, s: pop(T, wt(11, 'CSE'), 0.3) });
        });
      }
    },
  },

  // ───────────────────────── 10 · RETIREMENT IN THE DREAM ─────────────────────────
  {
    id: 's10-retire', from: 12, title: 'IIT ke sapne mein retirement', trans: { type: 'smash' },
    sfx: () => [[ls(12), 'impact'], [ls(13) + 0.2, 'pageFlip'], [ls(13) + 0.9, 'pageFlip'], [ls(13) + 1.5, 'pageFlip'], [wt(13, 'retirement'), 'stamp'], [wt(13, 'retirement') + 0.2, 'creak']],
    draw(ctx, lt, S) {
      const T = S.t;
      const tR = ls(13);
      if (T < tR) {
        backdrop(ctx, T, { tone: PAL.red, dots: PAL.red2, rayColor: PAL.red2 });
        speedLines(ctx, W / 2, H / 2, T, { color: PAL.ink, alpha: 0.35 });
        ctx.save();
        cam(ctx, T, [[0, {}]], { shk: shakes(T, [ls(12)], 1) });
        smash(ctx, 'BHOSDIWALO,', W / 2, H / 2 - 40, T, ls(12), { size: 230, maxW: 1600 });
        ctx.restore();
        return;
      }
      // Old Bunty in a rocking chair, still dreaming of IIT
      backdrop(ctx, T, { tone: '#e9dfc8', dots: PAL.paper3 });
      room(ctx, T, { poster: 'IIT YA KUCH NAHI', windowX: 1500, night: false });
      const yr = Math.floor(count(T, tR + 0.1, wt(13, 'retirement'), 2027, 2071, ease.inOutQuad));
      calendar(ctx, 380, 600, 0.9, 'SAAL', String(yr), { color: PAL.red, rot: -0.05 });
      const rock = Math.sin(T * 2.4) * 0.08;
      at(ctx, 1030, 830, 1, rock, (c) => {
        // rocking chair
        c.lineCap = 'round';
        line(c, -260, 60, 260, 60, PAL.ink, 22);
        c.beginPath(); c.arc(0, -300, 400, Math.PI * 0.35, Math.PI * 0.65); c.lineWidth = 22; c.strokeStyle = '#8a5a2b'; c.stroke();
        card(c, -200, -360, 60, 360, { fill: '#8a5a2b', r: 10, shadow: 0, lw: 6 });
        card(c, -200, -60, 400, 50, { fill: '#a87442', r: 10, shadow: 0, lw: 6 });
        student(c, 0, 40, 0.85, { t: T, kind: 'oldBunty', expr: 'sleepy', pose: 'slump', seed: 9, sit: true });
      });
      const k = pop(T, tR + 0.4, 0.6);
      at(ctx, 1260, 260, k, 0, (c) => {
        bubble(c, -300, -170, 600, 340, -260, 230, { thought: true });
        dreamBuilding(c, 0, 120, 0.26, T, { glow: 0.6 });
        txt(c, 'EK DIN...', 0, 140, { size: 54, fill: PAL.ink });
      });
      stamp(ctx, 'RETIRED (SAPNE MEIN)', W / 2, 980, T, wt(13, 'retirement'), { size: 70, rot: -0.04 });
    },
  },

  // ───────────────────────── 11 · CHAPTER: WHY LOW ─────────────────────────
  {
    id: 's11-chapter', from: 14, title: 'Registration kam kyun dikh raha?', trans: { type: 'halftone', dur: 0.5 },
    sfx: () => [[ls(14), 'whoosh'], [ls(14) + 0.35, 'thud'], [wt(14, 'kam kyun'), 'magnify']],
    draw(ctx, lt, S) {
      const T = S.t;
      backdrop(ctx, T, { tone: PAL.cyan, dots: PAL.cyan2, rayColor: '#5fe3f5' });
      chapterCard(ctx, T, ls(14) + 0.1, 'PEHLE SAMJHO', 'REGISTRATION KAM KYUN?', { color: PAL.ink, y: 470 });
      const tm = wt(14, 'kam kyun');
      const mx = lerp(300, 1500, seg(T, tm, le(14) + 0.3, ease.inOutCubic));
      at(ctx, mx, 700 + Math.sin(T * 4) * 20, pop(T, tm - 0.2, 0.4), -0.4, (c) => {
        circle(c, 0, 0, 120, 'rgba(255,255,255,0.4)', PAL.ink, 16);
        line(c, 90, 90, 230, 230, PAL.ink, 36);
        line(c, 90, 90, 230, 230, '#8a5a2b', 20);
        txt(c, '?', 0, 6, { size: 150, font: F.comic, fill: PAL.red, stroke: PAL.ink, lw: 8 });
      });
    },
  },

  // ───────────────────────── 12 · AADHAAR MISMATCH ─────────────────────────
  {
    id: 's12-aadhaar', from: 15, title: 'Aadhaar mismatch', trans: { type: 'whip' },
    sfx: () => [[ls(15) + 0.1, 'swipe'], [ls(15) + 0.35, 'swipe'], [wt(15, 'mismatch'), 'buzzer'], [wt(15, 'mismatch') + 0.1, 'stamp']],
    draw(ctx, lt, S) {
      const T = S.t;
      backdrop(ctx, T, { tone: '#ffe1c7', dots: '#f6c79e' });
      problemTag(ctx, T, 1, ls(15));
      const k1 = 1 - slide(T, ls(15) + 0.05, 0.4, ease.outBack);
      const k2 = 1 - slide(T, ls(15) + 0.3, 0.4, ease.outBack);
      const tm = wt(15, 'mismatch');
      const jig = T > tm ? Math.sin((T - tm) * 40) * 8 * Math.exp(-(T - tm) * 4) : 0;
      idCard(ctx, lerp(-500, 560, k1) + jig, 520, 1, 'BUNTY KUMAR', { rot: -0.06, title: 'AADHAAR' });
      idCard(ctx, lerp(2400, 1360, k2) - jig, 560, 1, 'BANTY KUMAAR', { rot: 0.05, title: '10TH MARKSHEET', color: PAL.cyan2, bad: T > tm - 0.3 ? 1 : -1 });
      if (T > tm - 0.3) {
        scribbleCircle(ctx, 1258, 560, 60, 50, seg(T, tm - 0.3, tm, ease.linear));
        arrow(ctx, 860, 380, 1180, 470, { color: PAL.red, p: seg(T, tm - 0.2, tm + 0.1), lw: 12 });
      }
      stamp(ctx, 'MISMATCH', W / 2, 880, T, tm, { size: 120 });
    },
  },

  // ───────────────────────── 13 · EWS PENDING ─────────────────────────
  {
    id: 's13-ews', from: 16, title: 'EWS certificate pending', trans: { type: 'wipe', color: PAL.red },
    sfx: () => [[ls(16) + 0.2, 'tick'], [ls(16) + 0.7, 'tick'], [ls(16) + 1.2, 'tick'], [wt(16, 'pending'), 'snore'], [wt(16, 'pending') + 0.2, 'stamp']],
    draw(ctx, lt, S) {
      const T = S.t;
      backdrop(ctx, T, { tone: '#d9d1bd', dots: PAL.paper3 });
      problemTag(ctx, T, 2, ls(16));
      // government counter window
      card(ctx, 280, 160, 1360, 680, { fill: '#b7a98a', r: 12, shadow: 18 });
      card(ctx, 360, 230, 1200, 500, { fill: '#e8f3f4', r: 8, shadow: 0, lw: 8 });
      txt(ctx, 'CERTIFICATE COUNTER · WINDOW 3', W / 2, 200, { size: 44, font: F.ui, weight: '800', fill: PAL.ink });
      student(ctx, 760, 900, 0.85, { t: T, kind: 'clerk', expr: 'sleepy', pose: 'slump', seed: 8 });
      clock(ctx, 1380, 360, 90, T * 4);
      // pile of files growing
      for (let i = 0; i < 9; i++) {
        const k = clamp((T - ls(16) - i * 0.12) * 4);
        if (k > 0) card(ctx, 1060 + (hash(i, 2) - 0.5) * 30, 720 - i * 40 - (1 - k) * 200, 300, 40, { fill: i % 2 ? PAL.paper : '#f3c98b', r: 4, shadow: 0, lw: 5 });
      }
      card(ctx, 260, 760, 1400, 90, { fill: '#8a7a5a', r: 8, shadow: 0, lw: 7 });
      sticker(ctx, 'EWS CERTIFICATE', 1210, 300, { size: 40, fill: PAL.white, rot: 0.05 });
      at(ctx, 1210, 420, 1, 0, (c) => spinner(c, 0, 0, 50, T, PAL.red, 14));
      stamp(ctx, 'PENDING...', W / 2, 960, T, wt(16, 'pending'), { size: 100, color: PAL.ink });
    },
  },

  // ───────────────────────── 14 · DIGILOCKER ─────────────────────────
  {
    id: 's14-digilocker', from: 17, title: 'DigiLocker nahi khul raha', trans: { type: 'glitch', dur: 0.3 },
    sfx: () => [[ls(17) + 0.1, 'tap'], [ls(17) + 0.4, 'tap'], [ls(17) + 0.7, 'tap'], [ls(17) + 1.0, 'tap'], [wt(17, 'khul'), 'error']],
    draw(ctx, lt, S) {
      const T = S.t;
      backdrop(ctx, T, { tone: '#1d2a44', dots: '#24365a', rayColor: '#22355a' });
      problemTag(ctx, T, 3, ls(17));
      ctx.save();
      cam(ctx, T, [[ls(17), { z: 1 }], [le(17), { z: 1.15, y: -40 }]]);
      phone(ctx, W / 2, 520, 420, 760, (c, w, h) => {
        c.fillStyle = PAL.white; c.fillRect(0, 0, w, h);
        c.fillStyle = '#3657c9'; c.fillRect(0, 0, w, 120);
        txt(c, 'DIGI-TIJORI', w / 2, 62, { size: 48, fill: PAL.white });
        // lock
        const shakeL = Math.sin(T * 30) * 6 * (T > wt(17, 'khul') ? 1 : 0);
        circle(c, w / 2 + shakeL, 300, 70, null, PAL.ink, 22);
        card(c, w / 2 - 110 + shakeL, 300, 220, 170, { fill: PAL.yellow, r: 20, shadow: 0, lw: 8 });
        circle(c, w / 2 + shakeL, 380, 18, PAL.ink, null, 0);
        progress(c, 40, 560, w - 80, 40, 0.99, { fill: PAL.cyan });
        txt(c, 'Loading... 99%', w / 2, 640, { size: 34, font: F.ui, weight: '800', fill: PAL.ink });
        spinner(c, w / 2, 700, 24, T, PAL.ink, 8);
      });
      // tapping finger
      const tap = Math.max(0, Math.sin(T * 20));
      at(ctx, W / 2 + 60, 660 + tap * 20, 1, -0.3, (c) => {
        card(c, -36, 0, 72, 300, { fill: PAL.skin, r: 36, shadow: 0, lw: 7 });
      });
      ctx.restore();
      if (T > wt(17, 'khul')) errorBox(ctx, 1450, 300, 'DigiTijori', 'Server busy. Kal try karein.', { w: 620, h: 250, s: pop(T, wt(17, 'khul')), rot: 0.04 });
      txt(ctx, 'TAP TAP TAP', 420, 820, { size: 70, font: F.comic, fill: PAL.yellow, stroke: PAL.ink, lw: 8, alpha: tap > 0.5 ? 1 : 0.6 });
    },
  },

  // ───────────────────────── 15 · OTP NAHI AAYA ─────────────────────────
  {
    id: 's15-otp', from: 18, title: 'OTP nahi aa raha', trans: { type: 'whip', dir: -1 },
    sfx: () => [[ls(18) + 0.2, 'cricket'], [wt(18, 'nahi'), 'cricket'], [le(18) - 0.2, 'tick']],
    draw(ctx, lt, S) {
      const T = S.t;
      backdrop(ctx, T, { tone: PAL.paper2, dots: PAL.paper3 });
      problemTag(ctx, T, 4, ls(18));
      // OTP boxes
      for (let i = 0; i < 6; i++) {
        const k = pop(T, ls(18) + i * 0.06, 0.3);
        at(ctx, 560 + i * 160, 360, k, 0, (c) => {
          card(c, -60, -80, 120, 160, { fill: PAL.white, r: 18, shadow: 10 });
          if (Math.floor(T * 2) % 2 === 0 && i === 0) line(c, 0, -40, 0, 40, PAL.ink, 6);
          else txt(c, '_', 0, 0, { size: 90, fill: PAL.gray });
        });
      }
      const left = Math.max(0, 59 - Math.floor((T - ls(18)) * 1.0));
      txt(ctx, `Resend OTP in 0:${String(left).padStart(2, '0')}`, W / 2, 520, { size: 46, font: F.ui, weight: '800', fill: PAL.gray2 });
      // waiting skeleton-ish Bunty with growing cobwebs
      const web = seg(T, ls(18), le(18) + 0.3, ease.linear);
      student(ctx, W / 2, 1060, 0.62, { t: T, kind: 'sleepy', expr: 'blank', pose: 'phone', seed: 6 });
      ctx.save();
      ctx.globalAlpha = web;
      ctx.strokeStyle = PAL.white;
      ctx.lineWidth = 3;
      for (const [cx, cy, sg] of [[0, 0, 1], [W, 0, -1]]) {
        for (let r = 1; r <= 5; r++) { ctx.beginPath(); ctx.arc(cx, cy, r * 60 * web, sg > 0 ? 0 : Math.PI / 2, sg > 0 ? Math.PI / 2 : Math.PI); ctx.stroke(); }
        for (let a = 0; a < 6; a++) { const an = (a / 5) * Math.PI / 2 + (sg > 0 ? 0 : Math.PI / 2); line(ctx, cx, cy, cx + Math.cos(an) * 320 * web, cy + Math.sin(an) * 320 * web, PAL.white, 3); }
      }
      ctx.restore();
      txt(ctx, '*crickets*', 1560, 900, { size: 48, font: F.comic, fill: PAL.ink, alpha: inOut(T, ls(18) + 0.2, le(18) + 0.2) });
    },
  },

  // ───────────────────────── 16 · SCHOOL REG NUMBER ─────────────────────────
  {
    id: 's16-school', from: 19, title: 'School registration number nahi de raha', trans: { type: 'tear' },
    sfx: () => [[ls(19) + 0.2, 'knock'], [ls(19) + 0.5, 'knock'], [wt(19, 'Registration'), 'doorSlam'], [wt(19, 'nahi'), 'thud']],
    draw(ctx, lt, S) {
      const T = S.t;
      backdrop(ctx, T, { tone: '#f0e3c0', dots: PAL.paper3 });
      problemTag(ctx, T, 5, ls(19));
      const tSlam = wt(19, 'Registration');
      ctx.save();
      cam(ctx, T, [[ls(19), { z: 1 }]], { shk: shakes(T, [tSlam], 0.7) });
      // school building front
      card(ctx, 440, 150, 1040, 720, { fill: '#e7c48e', r: 8, shadow: 16 });
      card(ctx, 520, 190, 880, 100, { fill: PAL.cyan2, r: 6, shadow: 0, lw: 6 });
      txt(ctx, 'SARVODAYA PUBLIC SCHOOL · OFFICE', W / 2, 242, { size: 40, font: F.ui, weight: '800', fill: PAL.white });
      const door = seg(T, tSlam - 0.15, tSlam, ease.inQuad);
      card(ctx, 760, 360, 400, 510, { fill: '#2a241c', r: 4, shadow: 0, lw: 7 });
      ctx.save();
      ctx.translate(760, 360);
      ctx.scale(lerp(0.15, 1, door), 1);
      card(ctx, 0, 0, 400, 510, { fill: '#8a5a2b', r: 4, shadow: 0, lw: 7 });
      ctx.restore();
      if (door < 0.6) student(ctx, 960, 870, 0.55, { t: T, kind: 'clerk', expr: 'smug', pose: 'shrug', seed: 8 });
      if (door >= 1) {
        at(ctx, 960, 560, pop(T, tSlam, 0.3), 0.05, (c) => {
          card(c, -170, -70, 340, 140, { fill: PAL.white, r: 10, shadow: 8 });
          txt(c, 'KAL AANA', 0, -14, { size: 60, fill: PAL.red });
          txt(c, '(roz)', 0, 40, { size: 30, font: F.ui, weight: '800', fill: PAL.ink });
        });
      }
      ctx.restore();
      student(ctx, 1600, 1040, 0.72, { t: T, kind: 'stressed', expr: T > tSlam ? 'scream' : 'confused', pose: T > tSlam ? 'headgrab' : 'point', flip: true, seed: 4 });
      sticker(ctx, 'BOARD REG. NO: ??????', 470, 960, { size: 46, fill: PAL.yellow, s: pop(T, wt(19, 'Board')), rot: -0.04, font: F.mono });
    },
  },

  // ───────────────────────── 17 · SOFTWARE CORRUPT ─────────────────────────
  {
    id: 's17-corrupt', from: 20, title: 'Zindagi ka software corrupt', trans: { type: 'zoom', dur: 0.45 },
    sfx: () => {
      const a = [[ls(20) + 0.2, 'typing'], [wt(20, 'government'), 'glitch']];
      for (let i = 0; i < 6; i++) a.push([wt(20, 'website') + i * 0.35, 'error']);
      a.push([wt(20, 'corrupt'), 'crash']);
      return a;
    },
    draw(ctx, lt, S) {
      const T = S.t;
      const tG = wt(20, 'government');
      const tC = wt(20, 'corrupt');
      room(ctx, T, { night: true, poster: 'PADHO YAAR', windowX: 1620, posterX: 260 });
      ctx.save();
      cam(ctx, T, [[ls(20), { z: 1 }], [tG, { z: 1.1, y: -40 }], [tC, { z: 1.3, y: -80 }]], { shk: shakes(T, [tC], 0.9) + (T > tG ? 0.08 : 0) });
      desk(ctx, W / 2, 860, 1, { t: T, books: 4, lamp: true });
      monitor(ctx, W / 2 - 60, 520, 640, 380, (c, w, h) => {
        if (T < tG) {
          c.fillStyle = PAL.white; c.fillRect(0, 0, w, h);
          txt(c, 'JEE MAIN 2027 · PREP', w / 2, 60, { size: 40, fill: PAL.ink });
          c.fillStyle = 'rgba(13,12,11,0.25)';
          for (let i = 0; i < 6; i++) c.fillRect(40, 110 + i * 40, (w - 80) * (0.5 + hash(i, 3) * 0.5), 14);
        } else {
          c.fillStyle = '#0b2a8a'; c.fillRect(0, 0, w, h);
          const f = Math.floor(T * 15);
          for (let i = 0; i < 10; i++) {
            c.fillStyle = [PAL.red, PAL.cyan, PAL.yellow, PAL.white][i % 4];
            c.globalAlpha = 0.6;
            c.fillRect(0, hash(i, f) * h, w, 6 + hash(i, f + 1) * 30);
          }
          c.globalAlpha = 1;
          txt(c, ':(', 60, 90, { size: 110, font: F.ui, weight: '800', fill: PAL.white, align: 'left' });
          txt(c, 'ZINDAGI.EXE', 60, 220, { size: 52, font: F.mono, fill: PAL.white, align: 'left' });
          txt(c, 'has stopped working', 60, 280, { size: 34, font: F.mono, fill: PAL.white, align: 'left' });
        }
      }, { crt: false });
      student(ctx, W / 2 - 60, 1180, 0.8, { t: T, kind: 'bunty', expr: T > tC ? 'scream' : T > tG ? 'shock' : 'determined', pose: T > tG ? 'headgrab' : 'type', seed: 2 });
      ctx.restore();
      // cascading error windows
      for (let i = 0; i < 6; i++) {
        const t0 = wt(20, 'website') + i * 0.35;
        if (T < t0) continue;
        const msgs = ['Session expired.', 'Captcha galat hai.', 'Photo size > 50KB.', 'Payment failed (paisa kat gaya).', 'Server 404.', 'Please try again later.'];
        errorBox(ctx, 360 + i * 230, 200 + i * 90, 'gov-portal.exe', msgs[i], { w: 620, h: 220, s: pop(T, t0, 0.25), retro: true, rot: (hash(i, 8) - 0.5) * 0.08 });
      }
      if (T > tC) {
        impactFlash(ctx, hit(T, tC, 0.12), PAL.white);
        smash(ctx, 'SOFTWARE CORRUPT', W / 2, 960, T, tC, { size: 140, fill: PAL.red, maxW: 1500 });
      }
    },
  },
];

/** Little "problem #n" counter that slides in on each registration-problem scene. */
function problemTag(ctx, T, n, t0) {
  const k = 1 - slide(T, t0, 0.35, ease.outBack);
  at(ctx, lerp(-300, 220, k), 110, 1, -0.04, (c) => {
    card(c, -170, -55, 340, 110, { fill: PAL.ink, r: 20, shadow: 8 });
    txt(c, `PROBLEM #${n}`, 0, 4, { size: 60, fill: PAL.yellow });
  });
  // pips
  for (let i = 0; i < 5; i++) circle(ctx, 460 + i * 44, 110, 14, i < n ? PAL.red : PAL.white, PAL.ink, 5);
}
