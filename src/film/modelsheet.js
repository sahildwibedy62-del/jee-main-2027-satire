// Character model sheet — the recurring cast, expressions and poses, rendered by the same engine as the film.
import { PAL, FONT } from '../engine/core.js';
import { paperBG, halftone, card } from '../engine/gfx.js';
import { txt } from '../engine/type.js';
import { student, head } from '../engine/char.js';

const cast = [
  ['bunty', 'BUNTY', 'happy', 'cheer'],
  ['topper', 'TANMAY (TOPPER)', 'determined', 'armsCross'],
  ['kabir', 'KABIR (OVERCONFIDENT)', 'smug', 'flex'],
  ['sleepy', 'NEEND (SLEEP-DEPRIVED)', 'sleepy', 'slump'],
  ['confused', 'CHAMAN (CONFUSED)', 'confused', 'shrug'],
  ['stressed', 'TENSION (EXAM-STRESSED)', 'scream', 'headgrab'],
];
const exprs = ['neutral', 'happy', 'smug', 'shock', 'angry', 'sad', 'cry', 'love', 'confused', 'scream', 'sleepy', 'blank'];

export default {
  id: 'modelsheet',
  title: 'Character model sheet',
  duration: 6,
  cues: [],
  scenes: [
    {
      id: 'sheet', start: 0, end: 6, title: 'Model sheet', desc: 'Cast, expressions and poses',
      draw(ctx, t) {
        paperBG(ctx, 'paper', t);
        halftone(ctx, 0, 0, 1080, 400, { color: PAL.yellow, fade: 'up', size: 30 });
        txt(ctx, 'THE CAST', 540, 90, { size: 110, fill: PAL.ink });
        cast.forEach(([k, name, e, p], i) => {
          const x = 180 + (i % 3) * 360, y = 760 + Math.floor(i / 3) * 620;
          student(ctx, x, y, 0.5, { t, kind: k, expr: e, pose: p, seed: i + 1 });
          card(ctx, x - 165, y + 16, 330, 56, { fill: PAL.ink, r: 12, shadow: 0, lw: 0 });
          txt(ctx, name, x, y + 46, { size: 26, font: FONT.ui, weight: '800', fill: PAL.yellow });
        });
        exprs.forEach((e, i) => {
          const x = 100 + (i % 6) * 176, y = 1560 + Math.floor(i / 6) * 190;
          head(ctx, x, y, 0.62, { t, kind: 'bunty', expr: e, seed: 3 });
          txt(ctx, e.toUpperCase(), x, y + 88, { size: 22, font: FONT.ui, weight: '800', fill: PAL.ink });
        });
      },
    },
  ],
};
