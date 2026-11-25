// Maths mini-games: Sum Blast, 24, Queens and Mental Math Rush.
// The app passes in a small context (sheet, toast, XP, sound, storage) so this module stays independent.

const el = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
const rnd = (n) => Math.floor(Math.random() * n);
import { legal as chessLegal, make as chessMake, inCheck as chessInCheck, san as chessSan, fromFEN, moveFromUci, uciOf } from './chess.js';

import { GAMES2, PAID2, play2, burst, popText, confetti } from './games2.js';
import { STAGES, openLevels, stageResult, roadHtml, openRoad, gameStars } from './campaign.js';
const BASE_GAMES = [
  { id: 'blockblast', name: 'Block Blast', icon: '🧱', blurb: 'Drop blocks, clear rows and columns, chain combos.', cost: '1⚡ per 3 pieces', cat: 'puzzle',
    how: ['Drag a piece onto the board.', 'Fill a whole row or column to clear it — several at once score big.', 'Every 3 pieces cost 1 ⚡. Stuck? Solve a problem for a second chance.'] },
  { id: 'g24', name: '24', icon: '🎯', blurb: 'Use all four numbers with + − × ÷ to make 24.', cost: 'Free — it’s maths', cat: 'brain',
    how: ['Tap a number, an operation, then another number to combine them.', 'Use all four numbers to make exactly 24.', 'Solve as many as you can in 2 minutes.'] },
  { id: 'chess', name: 'Chess Puzzles', icon: '♞', blurb: 'Find the winning move. Puzzles match your rating.', cost: '1⚡ per puzzle', cat: 'strategy',
    how: ['Your opponent moves first — then find the best reply.', 'Tap a piece, then a square.', 'Solve puzzles to raise your rating; harder ones follow.'] },
];
export const GAMES = [...BASE_GAMES, ...GAMES2];
// The featured game changes every day and pays double XP.
export function gameOfDay(date = new Date()) {
  const d = Math.floor((date.getTime() - date.getTimezoneOffset() * 60000) / 86400000);
  return GAMES[(d * 7 + 3) % GAMES.length].id;
}
const CATS = [['action', '🔥 Action'], ['puzzle', '🧩 Puzzle'], ['brain', '🧠 Brain teasers'], ['strategy', '♟️ Strategy']];

// ------------------------------------------------------------------ hub
export function openGames(ctx) {
  ctx = withHelpers(ctx);
  const best = ctx.bests();
  const gotd = GAMES.find((g) => g.id === gameOfDay());
  const tile = (g) => { const st = gameStars(ctx, g.id); return `<button class="gm-tile" data-g="${g.id}"><span class="gm-icon">${g.icon}</span><b>${g.name}</b><small class="gm-st"><i style="width:${Math.round((st / 36) * 100)}%"></i></small><small>⭐ ${st}/36${best[g.id] != null && best[g.id] > 0 ? ` · Best ${ctx.bestLabel(g.id, best[g.id])}` : ''}</small></button>`; };
  const body = el(`<div class="games-hub">
    <div class="gm-top"><span class="g-charge-static">⚡ <b>${ctx.charges()}</b></span><span class="small">Problems for ⚡: <b>${ctx.gameLevelName()}</b> <button class="link g-level">change</button></span></div>
    ${roadHtml(ctx)}
    <a class="gm-mmo" href="rpg/"><span class="gm-icon">⚔️</span><span><small>NEW · MATHS MMO</small><b>Numeria</b><em>Explore a world, battle with real AMC 8 → AIME problems, raid with friends.</em></span><span class="gm-go">Play ›</span></a>
    <button class="gm-feature" data-g="${gotd.id}"><span class="gm-icon">${gotd.icon}</span><span><small>GAME OF THE DAY · 2× XP</small><b>${gotd.name}</b><em>${gotd.blurb}</em></span></button>
    ${CATS.map(([c, label]) => `<h4 class="gm-cat">${label}</h4><div class="gm-grid">${GAMES.filter((g) => g.cat === c).map(tile).join('')}</div>`).join('')}
    <p class="small">Every problem you get right — in the feed, in Learn, or in a game — earns ⚡. Math Blitz, 24 and Memory Match are free, because they’re maths already.</p></div>`);
  body.querySelectorAll('[data-g]').forEach((b) => b.addEventListener('click', () => startGame(b.dataset.g, ctx)));
  body.querySelector('.g-level').addEventListener('click', () => ctx.pickGameLevel(() => openGames(ctx)));
  body.querySelector('.gm-road').addEventListener('click', () => openRoad(ctx, () => openGames(ctx)));
  ctx.openSheet('Games', body, 'tall');
}
// The first time you open a game, show how to play.
function howTo(ctx, g) {
  return new Promise((resolve) => {
    const body = el(`<div class="howto"><div class="ht-icon">${g.icon}</div><h3>${g.name}</h3><ol>${g.how.map((x) => `<li>${x}</li>`).join('')}</ol><p class="small">${g.cost}</p><button class="btn wide ht-go">Let’s play</button></div>`);
    body.querySelector('.ht-go').addEventListener('click', () => { try { localStorage.setItem(`ms:howto:${g.id}`, '1'); } catch { /* private mode */ } resolve(true); });
    ctx.openSheet('How to play', body, 'tall', Object.assign(() => resolve(false), { onReplace: false }));
  });
}
const seenHow = (id) => { try { return !!localStorage.getItem(`ms:howto:${id}`); } catch { return true; } };
// Helpers every game and the campaign screens can use.
function withHelpers(ctx) {
  if (ctx._h) return ctx;
  const c = { ...ctx, _h: true, confetti, gameMeta: (id) => GAMES.find((g) => g.id === id) };
  c.openGames = () => openGames(c);
  return c;
}
// No options: show the game's level map. { idx }: play a campaign level. { endless: true }: classic mode.
export async function startGame(id, ctx, opt) {
  ctx = withHelpers(ctx);
  const meta = GAMES.find((x) => x.id === id);
  if (opt === undefined && STAGES[id]) {
    return openLevels(ctx, meta, {
      play: (i) => startGame(id, ctx, { idx: i }),
      endless: () => startGame(id, ctx, { endless: true }),
      howTo: async () => { if (await howTo(ctx, meta)) startGame(id, ctx); },
    });
  }
  opt ||= { endless: true };
  if (meta?.how && !seenHow(id) && !(await howTo(ctx, meta))) return;
  const idx = opt.idx;
  const stage = idx != null ? STAGES[id][idx] : null;
  const o = {
    ...opt, stage, p: stage?.p || {},
    end: (body, res) => stageResult(ctx, body, { id, idx, ...res,
      retry: () => startGame(id, ctx, { idx }), next: () => startGame(id, ctx, { idx: idx + 1 }), levels: () => startGame(id, ctx) }),
  };
  const paid = PAID2.has(id) || (stage && (id === 'blockblast' || id === 'chess'));
  if (paid && !opt.run && !(await payOrSolve(ctx, `play ${meta.name}`))) return;
  if (GAMES2.some((g) => g.id === id)) {
    return play2(id, { ...ctx, startGame: (gid, oo) => startGame(gid, ctx, oo ?? { endless: true }) }, o);
  }
  ({ blockblast: blockBlast, chess, g24: game24 })[id](ctx, o);
}

// ------------------------------------------------------------------ 24
// Exact fractions so 8 / (3 − 8/3) works.
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
function frac(n, d = 1) { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d) || 1; return { n: n / g, d: d / g }; }
const fop = (a, b, op) => {
  if (op === '+') return frac(a.n * b.d + b.n * a.d, a.d * b.d);
  if (op === '−') return frac(a.n * b.d - b.n * a.d, a.d * b.d);
  if (op === '×') return frac(a.n * b.n, a.d * b.d);
  if (op === '÷') return b.n === 0 ? null : frac(a.n * b.d, a.d * b.n);
  return null;
};
const fstr = (f) => (f.d === 1 ? String(f.n) : `${f.n}/${f.d}`);
// Find one way to make 24 (returns the expression, or null).
function solve24(cards, T = 24) {
  if (cards.length === 1) return cards[0].v.n === T && cards[0].v.d === 1 ? cards[0].e : null;
  for (let i = 0; i < cards.length; i++) {
    for (let j = 0; j < cards.length; j++) {
      if (i === j) continue;
      const rest = cards.filter((_, k) => k !== i && k !== j);
      for (const op of ['+', '−', '×', '÷']) {
        if ((op === '+' || op === '×') && j < i) continue;
        const v = fop(cards[i].v, cards[j].v, op);
        if (!v) continue;
        const r = solve24([...rest, { v, e: `(${cards[i].e} ${op} ${cards[j].e})` }], T);
        if (r) return r;
      }
    }
  }
  return null;
}
const MIX_TARGETS = [10, 12, 15, 18, 20, 24, 28, 30, 36, 40, 48, 60];
export function new24(target = 24, max = 9) {
  for (;;) {
    const T = target === 'mix' ? MIX_TARGETS[rnd(MIX_TARGETS.length)] : target;
    const nums = Array.from({ length: 4 }, () => 1 + rnd(max));
    const sol = solve24(nums.map((n) => ({ v: frac(n), e: String(n) })), T);
    if (sol) return { nums, T, sol: sol.replace(/^\((.*)\)$/, '$1') };
  }
}
// The 24 board, usable full-screen or inside a feed card.
export function mount24(container, ctx, { onSolve, compact = false, target = 24, max = 9, onNew } = {}) {
  const fresh = () => { const z = new24(target, max); onNew?.(z.T); return z; };
  let puzzle = fresh();
  let cards; let picked = null; let op = null; let history = [];
  const root = el(`<div class="g24 ${compact ? 'compact' : ''}">
    <div class="g24-cards"></div>
    <div class="g24-ops">${['+', '−', '×', '÷'].map((o) => `<button class="g24-op" data-op="${o}">${o}</button>`).join('')}</div>
    <div class="g24-actions"><button class="btn ghost small undo">Undo</button><button class="btn ghost small reset">Reset</button><button class="btn ghost small hint">Show a way</button>${compact ? '' : '<button class="btn ghost small skip">New</button>'}</div>
    <p class="g24-msg small">Tap a number, an operation, then another number.</p></div>`);
  container.appendChild(root);
  const msg = (t) => { root.querySelector('.g24-msg').textContent = t; };
  const reset = () => { cards = puzzle.nums.map((n, i) => ({ id: i, v: frac(n) })); picked = null; op = null; history = []; render(); };
  const render = () => {
    const box = root.querySelector('.g24-cards');
    box.innerHTML = '';
    cards.forEach((c) => {
      const b = el(`<button class="g24-card ${picked === c.id ? 'sel' : ''}">${fstr(c.v)}</button>`);
      b.addEventListener('click', () => tapCard(c.id));
      box.appendChild(b);
    });
    root.querySelectorAll('.g24-op').forEach((b) => b.classList.toggle('sel', b.dataset.op === op));
  };
  const tapCard = (id) => {
    if (picked === null || op === null) { picked = picked === id ? null : id; op = null; render(); return; }
    if (id === picked) { picked = null; op = null; render(); return; }
    const a = cards.find((c) => c.id === picked); const b = cards.find((c) => c.id === id);
    const v = fop(a.v, b.v, op);
    if (!v) { msg('Can’t divide by zero.'); return; }
    history.push(cards);
    const nid = Math.max(...cards.map((c) => c.id)) + 1;
    cards = [...cards.filter((c) => c.id !== a.id && c.id !== b.id), { id: nid, v }];
    picked = nid; op = null;
    ctx.sound('quest');
    render();
    if (cards.length === 1) {
      if (v.n === puzzle.T && v.d === 1) { msg(`${puzzle.T}! Nice.`); ctx.sound('correct'); root.classList.add('won'); { const b = root.getBoundingClientRect(); burst(b.left + b.width / 2, b.top + b.height / 3, { color: ['#4ade80', '#facc15', '#60a5fa'], n: 24 }); popText(b.left + b.width / 2, b.top + b.height / 3, `${puzzle.T}!`); } setTimeout(() => { root.classList.remove('won'); onSolve?.(); }, 700); }
      else { msg(`That makes ${fstr(v)}, not ${puzzle.T}. Undo and try again.`); ctx.sound('wrong'); }
    }
  };
  root.querySelectorAll('.g24-op').forEach((b) => b.addEventListener('click', () => { if (picked === null) { msg('Pick a number first.'); return; } op = b.dataset.op; render(); }));
  root.querySelector('.undo').addEventListener('click', () => { if (history.length) { cards = history.pop(); picked = null; op = null; render(); } });
  root.querySelector('.reset').addEventListener('click', reset);
  root.querySelector('.hint').addEventListener('click', () => { msg(`One way: ${puzzle.sol} = ${puzzle.T}`); root.dataset.hinted = '1'; });
  root.querySelector('.skip')?.addEventListener('click', () => { puzzle = fresh(); root.dataset.hinted = ''; reset(); msg('New numbers.'); });
  reset();
  return {
    next() { puzzle = fresh(); root.dataset.hinted = ''; reset(); msg('Tap a number, an operation, then another number.'); },
    hinted: () => root.dataset.hinted === '1',
  };
}
function game24(ctx, o = {}) {
  const P = o.p || {};
  const TIME = P.time || 120;
  let solved = 0; let left = TIME; let over = false;
  const clock = (t) => `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
  const body = el(`<div class="g24-game"><div class="gb-top"><span class="gb-score">0 solved</span><span class="gb-target">Make <b>${P.target === 'mix' ? '?' : P.target || 24}</b></span><span class="gb-time">${clock(TIME)}</span></div>${o.stage ? `<div class="stage-bar"><b>Level ${o.idx + 1}</b> ${o.stage.starText}</div>` : ''}<div class="g24-slot"></div></div>`);
  let board;
  board = mount24(body.querySelector('.g24-slot'), ctx, {
    target: P.target || 24, max: P.max || 9,
    onNew: (T) => { const b = body.querySelector('.gb-target b'); b.textContent = T; b.animate?.([{ transform: 'scale(1.4)' }, { transform: 'none' }], { duration: 300 }); },
    onSolve: () => {
      if (over) return;
      if (!board.hinted()) solved++;
      body.querySelector('.gb-score').textContent = `${solved} solved`;
      board.next();
    },
  });
  const timer = setInterval(() => {
    if (over) return;
    left--; body.querySelector('.gb-time').textContent = clock(left);
    body.querySelector('.gb-time').classList.toggle('low', left <= 15);
    if (left <= 0) {
      over = true; clearInterval(timer);
      if (o.stage) return o.end(body, { value: solved, big: solved, unit: solved === 1 ? 'puzzle' : 'puzzles', line: 'Puzzles where you used “Show a way” don’t count', share: `I solved ${solved} puzzles on level ${o.idx + 1} of 24 on MathScroll!` });
      const xp = solved * 10; const isBest = ctx.recordBest('g24', solved);
      ctx.gameDone('g24', xp, { solved24: solved });
      showResult(body, ctx, { title: 'Time!', big: solved, unit: solved === 1 ? 'puzzle' : 'puzzles', line: `${isBest ? 'New best! ' : ''}+${xp} XP · puzzles where you used “Show a way” don’t count`, again: () => game24(ctx, { endless: true }), share: `I solved ${solved} “make 24” puzzles in 2 minutes on MathScroll!` });
    }
  }, 1000);
  const stop24 = () => { over = true; clearInterval(timer); }; stop24.onReplace = true;
  ctx.openSheet('24', body, 'tall', stop24);
}

// ------------------------------------------------------------------ shared result screen
function showResult(body, ctx, { title, big, unit, line, again, againLabel, share }) {
  if (/best/i.test(line || '')) confetti();
  body.innerHTML = `<div class="sprint-done game-done"><small class="gd-title">${title}</small><div class="score">${big}<small> ${unit}</small></div><p>${line}</p>
    <button class="btn wide again">${againLabel || 'Play again'}</button><button class="btn ghost wide share-g">Share</button><button class="btn ghost wide more-g">More games</button></div>`;
  body.querySelector('.again').addEventListener('click', again);
  body.querySelector('.share-g').addEventListener('click', () => ctx.shareText(share));
  body.querySelector('.more-g').addEventListener('click', () => openGames(ctx));
}

// ------------------------------------------------------------------ problems inside games
// Shows a real problem over the game. Resolves true/false when answered, null if cancelled.
export function askProblem(ctx, { title, reason }) {
  return new Promise((resolve) => {
    const ov = el(`<div class="g-problem"><div class="gp-head"><b>${title}</b><button class="btn ghost small gp-x">Cancel</button></div><p class="small gp-why">${reason}</p><div class="gp-body sprint-stage"><p class="loader-msg">Finding a problem…</p></div></div>`);
    document.body.appendChild(ov);
    let result = null; let closed = false;
    const close = () => { if (closed) return; closed = true; ov.remove(); resolve(result); };
    ov.querySelector('.gp-x').addEventListener('click', close);
    ctx.problem(ov.querySelector('.gp-body')).then((ok) => {
      result = ok;
      const x = ov.querySelector('.gp-x'); x.textContent = ok ? 'Continue' : 'Try another'; x.classList.remove('ghost');
      if (ok) setTimeout(close, 1300);
    }, () => { ov.querySelector('.gp-body').innerHTML = '<p class="loader-msg">Couldn’t load a problem. Check your connection.</p>'; });
  });
}
const chargePill = (ctx) => `<button class="g-charge" title="⚡ charges — solve a problem to earn one">⚡ <b>${ctx.charges()}</b> <span>+</span></button>`;
function wireCharge(body, ctx) {
  const refresh = () => body.querySelectorAll('.g-charge b').forEach((b) => { b.textContent = ctx.charges(); });
  body.querySelectorAll('.g-charge').forEach((b) => b.addEventListener('click', async () => {
    const ok = await askProblem(ctx, { title: 'Earn ⚡', reason: 'Solve this problem to earn a charge.' });
    refresh();
    if (ok) ctx.toast('+1 ⚡');
  }));
  return refresh;
}
// Spend a charge, or solve problems until you've earned one. Resolves false if you give up.
export async function payOrSolve(ctx, what) {
  while (!ctx.spend(1)) {
    const ok = await askProblem(ctx, { title: 'Need ⚡', reason: `It costs 1 ⚡ to ${what}. Solve this problem to earn it.` });
    if (ok === null) return false;
    if (!ok) ctx.toast('Not quite — here’s another one');
  }
  return true;
}
function spend(ctx, refresh, what) {
  if (ctx.spend(1)) { refresh(); return true; }
  ctx.toast(`${what} costs 1 ⚡ — tap ⚡ to solve a problem and earn one`);
  return false;
}

// ------------------------------------------------------------------ Block Blast
const SHAPES = [
  [[0, 0]], [[0, 0], [0, 1]], [[0, 0], [1, 0]], [[0, 0], [0, 1], [0, 2]], [[0, 0], [1, 0], [2, 0]],
  [[0, 0], [0, 1], [0, 2], [0, 3]], [[0, 0], [1, 0], [2, 0], [3, 0]], [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]],
  [[0, 0], [0, 1], [1, 0], [1, 1]], [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2]],
  [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2]], [[0, 0], [0, 1], [1, 0], [1, 1], [2, 0], [2, 1]],
  [[0, 0], [1, 0], [1, 1]], [[0, 0], [0, 1], [1, 0]], [[0, 0], [0, 1], [1, 1]], [[0, 1], [1, 0], [1, 1]],
  [[0, 0], [1, 0], [2, 0], [2, 1]], [[0, 0], [0, 1], [0, 2], [1, 0]], [[0, 0], [0, 1], [1, 1], [2, 1]], [[0, 2], [1, 0], [1, 1], [1, 2]],
  [[0, 1], [1, 1], [2, 1], [2, 0]], [[0, 0], [1, 0], [1, 1], [1, 2]], [[0, 0], [0, 1], [1, 0], [2, 0]], [[0, 0], [0, 1], [0, 2], [1, 2]],
  [[0, 0], [0, 1], [0, 2], [1, 1]], [[0, 1], [1, 0], [1, 1], [1, 2]], [[0, 0], [1, 0], [2, 0], [1, 1]], [[0, 1], [1, 1], [2, 1], [1, 0]],
  [[0, 1], [0, 2], [1, 0], [1, 1]], [[0, 0], [0, 1], [1, 1], [1, 2]], [[0, 0], [1, 0], [1, 1], [2, 1]], [[0, 1], [1, 1], [1, 0], [2, 0]],
  [[0, 0], [1, 1]], [[0, 1], [1, 0]], [[0, 0], [1, 1], [2, 2]], [[0, 2], [1, 1], [2, 0]],
];
const BB_COLORS = ['#f87171', '#fb923c', '#facc15', '#4ade80', '#22d3ee', '#818cf8', '#e879f9'];
const STONE = '#64748b'; const GEM = '#c084fc';
function blockBlast(ctx, o = {}) {
  const N = 8; const P = o.p || {}; const camp = !!o.stage;
  let board = Array.from({ length: N }, () => Array(N).fill(null));
  let tray = []; let score = 0; let combo = 0; let over = false; let revives = 2; let bombMode = false; let placed = 0;
  let piecesLeft = P.pieces || Infinity; const gems = new Set(); let gemsGot = 0;
  const best = ctx.bests().blockblast || 0;
  const body = el(`<div class="blockblast">
    <div class="gb-top"><span class="gb-score">0</span>${camp ? `<span class="bb-left">🧩 <b>${piecesLeft}</b></span>${P.gems ? `<span class="bb-gems">💎 <b>0</b>/${P.gems}</span>` : ''}` : `<span class="bb-best">Best ${best}</span>`}${chargePill(ctx)}</div>
    ${camp ? `<div class="stage-bar"><b>Level ${o.idx + 1}</b> ${o.stage.starText}${P.gems ? ' · collect every 💎' : ''}</div>` : ''}
    <div class="bb-combo"></div>
    <div class="bb-board"></div>
    <div class="bb-tray"></div>
    <div class="gb-actions"><button class="btn ghost small bb-bomb">💣 Bomb · 1⚡</button><button class="btn ghost small bb-reroll">🔄 Swap pieces · 1⚡</button></div>
    <p class="small bb-help">Drag a piece onto the board. Fill a whole row or column to clear it. ${camp ? `You have ${P.pieces} pieces.${P.stones ? ' Grey stones clear like any block.' : ''}${P.gems ? ' Clear a 💎’s row or column to collect it.' : ''}` : 'Every three pieces cost 1 ⚡.'}</p></div>`);
  const refresh = wireCharge(body, ctx);
  const boardEl = body.querySelector('.bb-board'); const trayEl = body.querySelector('.bb-tray');
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) boardEl.appendChild(el(`<div class="bb-cell" data-r="${r}" data-c="${c}"></div>`));
  const cellEl = (r, c) => boardEl.children[r * N + c];
  const fits = (shape, r0, c0) => shape.every(([r, c]) => r0 + r >= 0 && r0 + r < N && c0 + c >= 0 && c0 + c < N && !board[r0 + r][c0 + c]);
  const fitsAnywhere = (shape) => { for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (fits(shape, r, c)) return true; return false; };
  const dims = (shape) => [Math.max(...shape.map((x) => x[0])) + 1, Math.max(...shape.map((x) => x[1])) + 1];
  const drawBoard = () => {
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
      const e = cellEl(r, c); const v = board[r][c];
      e.style.background = v || ''; e.classList.toggle('full', !!v);
      e.classList.toggle('stone', v === STONE); e.classList.toggle('gem', gems.has(`${r},${c}`));
    }
    const l = body.querySelector('.bb-left b'); if (l) l.textContent = piecesLeft;
    const gg = body.querySelector('.bb-gems b'); if (gg) gg.textContent = gemsGot;
  };
  // Campaign levels start with stones and gems on the board (never a full line).
  const seed = () => {
    const free = []; for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) free.push([r, c]);
    for (let i = free.length - 1; i > 0; i--) { const j = rnd(i + 1); [free[i], free[j]] = [free[j], free[i]]; }
    const ok = (r, c) => board[r].filter(Boolean).length < N - 2 && board.filter((row) => row[c]).length < N - 2;
    let k = 0;
    for (const [r, c] of free) {
      if (k >= (P.stones || 0) + (P.gems || 0)) break;
      if (!ok(r, c)) continue;
      if (k < (P.gems || 0)) { board[r][c] = GEM; gems.add(`${r},${c}`); } else board[r][c] = STONE;
      k++;
    }
  };
  const finishStage = () => {
    if (over) return; over = true;
    const fail = P.gems && gemsGot < P.gems;
    o.end(body, { value: score, fail, big: score, unit: 'points', line: `${P.gems ? `💎 ${gemsGot}/${P.gems}` : ''}${fail ? ' — collect every gem to pass' : ''}`.trim(), share: `I scored ${score} on Block Blast level ${o.idx + 1} on MathScroll!` });
  };
  // Each new set of three pieces costs 1 ⚡ (solve a problem if you're out).
  const buyTray = async () => {
    refresh();
    if (await payOrSolve(ctx, 'get the next three pieces')) { newTray(); refresh(); checkStuck(); } else { trayEl.innerHTML = '<button class="btn wide bb-buy">Solve a problem for the next pieces</button>'; trayEl.querySelector('.bb-buy').addEventListener('click', buyTray); }
  };
  const newTray = () => {
    const n = Math.min(3, piecesLeft);
    for (let tries = 0; tries < 30; tries++) {
      tray = [0, 1, 2].map((k) => (k < n ? { shape: SHAPES[rnd(SHAPES.length)], color: BB_COLORS[rnd(BB_COLORS.length)] } : null));
      if (tray.some((p) => p && fitsAnywhere(p.shape))) break;
    }
    drawTray();
  };
  const pieceHtml = (p, size) => { const [h, w] = dims(p.shape); return `<div class="bb-piece" style="--h:${h};--w:${w};--s:${size}px">${p.shape.map(([r, c]) => `<i style="grid-row:${r + 1};grid-column:${c + 1};background:${p.color}"></i>`).join('')}</div>`; };
  const drawTray = () => {
    trayEl.innerHTML = '';
    tray.forEach((p, i) => {
      const slot = el(`<div class="bb-slot" data-i="${i}">${p ? pieceHtml(p, 18) : ''}</div>`);
      if (p && !fitsAnywhere(p.shape)) slot.classList.add('dead');
      trayEl.appendChild(slot);
    });
  };
  // Lines that would clear if this shape went here.
  const linesFor = (shape, r0, c0) => {
    const filled = (r, c) => board[r][c] || shape.some(([a, b]) => r0 + a === r && c0 + b === c);
    const rows = []; const cols = [];
    for (let r = 0; r < N; r++) if ([...Array(N).keys()].every((c) => filled(r, c))) rows.push(r);
    for (let c = 0; c < N; c++) if ([...Array(N).keys()].every((r) => filled(r, c))) cols.push(c);
    return { rows, cols };
  };
  const clearPreview = () => boardEl.querySelectorAll('.bb-ghost, .will-clear').forEach((e) => { e.classList.remove('bb-ghost', 'will-clear'); e.style.removeProperty('--g'); });
  const place = (i, r0, c0) => {
    const p = tray[i];
    p.shape.forEach(([r, c]) => { board[r0 + r][c0 + c] = p.color; });
    tray[i] = null; placed++; if (camp) piecesLeft--;
    let gained = p.shape.length;
    const { rows, cols } = linesFor([], 0, 0);
    const lines = rows.length + cols.length;
    if (lines) {
      combo++;
      const pts = lines * lines * 10 * Math.max(1, combo);
      gained += pts;
      const doomed = new Set();
      rows.forEach((r) => { for (let c = 0; c < N; c++) doomed.add(`${r},${c}`); });
      cols.forEach((c) => { for (let r = 0; r < N; r++) doomed.add(`${r},${c}`); });
      doomed.forEach((k) => {
        const [r, c] = k.split(',').map(Number); const ce = cellEl(r, c); const b = ce.getBoundingClientRect();
        burst(b.left + b.width / 2, b.top + b.height / 2, { color: board[r][c] || '#facc15', n: 4, spread: 50, size: 7 });
        ce.classList.add('blast'); board[r][c] = null;
        if (gems.delete(k)) { gemsGot++; gained += 50; popText(b.left + b.width / 2, b.top, '💎 +50', '#c084fc'); }
      });
      { const b = boardEl.getBoundingClientRect(); popText(b.left + b.width / 2, b.top + b.height / 2, `+${pts}${combo > 1 ? ` ×${combo}` : ''}`); }
      if (lines >= 3) confetti();
      setTimeout(() => boardEl.querySelectorAll('.blast').forEach((e) => e.classList.remove('blast')), 380);
      ctx.sound(lines >= 2 ? 'crit' : 'correct');
      const comboEl = body.querySelector('.bb-combo');
      comboEl.innerHTML = `<b>${lines >= 3 ? 'Incredible!' : lines === 2 ? 'Double!' : 'Clear!'}</b> +${pts}${combo > 1 ? ` · combo ×${combo}` : ''}`;
      comboEl.classList.remove('show'); void comboEl.offsetWidth; comboEl.classList.add('show');
      if (board.every((row) => row.every((v) => !v))) { gained += 300; setTimeout(() => ctx.toast('Board cleared! +300'), 300); }
    } else {
      ctx.sound('quest');
      if (placed % 3 === 0) combo = 0; // a combo survives a couple of quiet moves
    }
    score += gained;
    body.querySelector('.gb-score').textContent = score;
    setTimeout(drawBoard, lines ? 300 : 0); if (!lines) drawBoard();
    if (camp && piecesLeft <= 0) { drawTray(); setTimeout(finishStage, lines ? 700 : 400); return; }
    if (tray.every((x) => !x)) { drawTray(); setTimeout(camp ? () => { newTray(); checkStuck(); } : buyTray, lines ? 400 : 150); return; }
    drawTray();
    setTimeout(checkStuck, lines ? 320 : 50);
  };
  const checkStuck = () => {
    if (over || tray.every((p) => !p)) return;
    drawTray();
    if (tray.some((p) => p && fitsAnywhere(p.shape))) return;
    stuck();
  };
  const stuck = () => {
    const panel = el(`<div class="bb-stuck"><b>No room left!</b>
      ${revives ? `<p>Solve a problem to clear space and keep your ${score} points. (${revives} left)</p><button class="btn wide revive">Solve to continue</button>` : '<p>No second chances left.</p>'}
      <button class="btn ghost wide end">${camp ? 'Finish level' : 'End game'}</button></div>`);
    body.appendChild(panel);
    panel.scrollIntoView({ block: 'center', behavior: 'smooth' });
    panel.querySelector('.end').addEventListener('click', () => { panel.remove(); end(); });
    panel.querySelector('.revive')?.addEventListener('click', async () => {
      const ok = await askProblem(ctx, { title: 'Second chance', reason: 'Get it right to clear three lines and get fresh pieces.' });
      refresh();
      if (ok === null) return;
      revives--;
      panel.remove();
      if (!ok) { ctx.toast('Not quite.'); return stuck(); }
      // Clear the three fullest rows and give fresh pieces.
      const fullest = [...Array(N).keys()].sort((a, b) => board[b].filter(Boolean).length - board[a].filter(Boolean).length).slice(0, 3);
      fullest.forEach((r) => { for (let c = 0; c < N; c++) { board[r][c] = null; cellEl(r, c).classList.add('blast'); } });
      setTimeout(() => boardEl.querySelectorAll('.blast').forEach((e) => e.classList.remove('blast')), 380);
      drawBoard(); newTray(); ctx.sound('level'); checkStuck();
    });
  };
  const end = () => {
    if (camp) return finishStage();
    if (over) return;
    over = true;
    const xp = Math.min(120, Math.round(score / 15));
    const isBest = ctx.recordBest('blockblast', score);
    ctx.gameDone('blockblast', xp);
    showResult(body, ctx, { title: 'Game over', big: score, unit: 'points', line: `${isBest ? 'New best! ' : ''}+${xp} XP`, again: () => startGame('blockblast', ctx, { endless: true }), share: `I scored ${score} in Block Blast on MathScroll. Beat that!` });
  };
  // ---- dragging
  let drag = null;
  trayEl.addEventListener('pointerdown', (e) => {
    if (over || bombMode) return;
    const slot = e.target.closest('.bb-slot'); if (!slot) return;
    const i = +slot.dataset.i; const p = tray[i]; if (!p) return;
    e.preventDefault();
    const cell = boardEl.getBoundingClientRect().width / N;
    const f = el(`<div class="bb-float">${pieceHtml(p, cell - 3)}</div>`);
    document.body.appendChild(f);
    const [h, w] = dims(p.shape);
    drag = { i, p, f, cell, h, w, slot, pos: null };
    slot.classList.add('lifted');
    move(e);
  });
  const move = (e) => {
    if (!drag) return;
    const { f, cell, h, w } = drag;
    const x = e.clientX - (w * cell) / 2; const y = e.clientY - h * cell - 40; // float above the finger
    f.style.transform = `translate(${x}px, ${y}px)`;
    const b = boardEl.getBoundingClientRect();
    const c0 = Math.round((x - b.left) / cell); const r0 = Math.round((y - b.top) / cell);
    clearPreview();
    if (fits(drag.p.shape, r0, c0)) {
      drag.pos = [r0, c0];
      drag.p.shape.forEach(([r, c]) => { const ce = cellEl(r0 + r, c0 + c); ce.classList.add('bb-ghost'); ce.style.setProperty('--g', drag.p.color); });
      const { rows, cols } = linesFor(drag.p.shape, r0, c0);
      rows.forEach((r) => { for (let c = 0; c < N; c++) cellEl(r, c).classList.add('will-clear'); });
      cols.forEach((c) => { for (let r = 0; r < N; r++) cellEl(r, c).classList.add('will-clear'); });
    } else drag.pos = null;
  };
  const up = () => {
    if (!drag) return;
    const d = drag; drag = null;
    d.f.remove(); d.slot.classList.remove('lifted'); clearPreview();
    if (d.pos) place(d.i, d.pos[0], d.pos[1]);
  };
  window.addEventListener('pointermove', move);
  window.addEventListener('pointerup', up);
  window.addEventListener('pointercancel', up);
  // ---- power-ups
  body.querySelector('.bb-bomb').addEventListener('click', (e) => {
    if (over) return;
    if (bombMode) { bombMode = false; e.currentTarget.classList.remove('on'); return; }
    if (ctx.charges() < 1) { spend(ctx, refresh, 'A bomb'); return; }
    bombMode = true; e.currentTarget.classList.add('on'); ctx.toast('Tap a square to blast a 3×3 area');
  });
  boardEl.addEventListener('click', (e) => {
    if (!bombMode || over) return;
    const t = e.target.closest('.bb-cell'); if (!t) return;
    if (!spend(ctx, refresh, 'A bomb')) return;
    bombMode = false; body.querySelector('.bb-bomb').classList.remove('on');
    const r0 = +t.dataset.r; const c0 = +t.dataset.c;
    for (let r = r0 - 1; r <= r0 + 1; r++) for (let c = c0 - 1; c <= c0 + 1; c++) if (r >= 0 && r < N && c >= 0 && c < N) { if (gems.delete(`${r},${c}`)) gemsGot++; board[r][c] = null; cellEl(r, c).classList.add('blast'); }
    ctx.sound('crit');
    setTimeout(() => { boardEl.querySelectorAll('.blast').forEach((x) => x.classList.remove('blast')); drawBoard(); drawTray(); }, 300);
  });
  body.querySelector('.bb-reroll').addEventListener('click', () => {
    if (over || !spend(ctx, refresh, 'New pieces')) return;
    newTray(); ctx.sound('quest');
  });
  tray = [null, null, null]; if (camp) seed(); drawTray(); drawBoard();
  const stop = () => { over = true; window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up); drag?.f.remove(); };
  stop.onReplace = true;
  ctx.openSheet('Block Blast', body, 'tall', stop);
  if (camp) { newTray(); checkStuck(); } else buyTray();
  body._test = { board: () => board, tray: () => tray, place, fits, gems: () => gems, left: () => piecesLeft };
}

// ------------------------------------------------------------------ Chess puzzles
const GLYPH = { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' };
const glyph = (p) => `<span class="cp ${p >= 'A' && p <= 'Z' ? 'w' : 'b'}">${GLYPH[p.toLowerCase()]}︎</span>`;
const THEME_NAMES = { mateIn1: 'Mate in 1', mateIn2: 'Mate in 2', mateIn3: 'Mate in 3', fork: 'Fork', pin: 'Pin', skewer: 'Skewer', hangingPiece: 'Hanging piece', discoveredAttack: 'Discovered attack', sacrifice: 'Sacrifice', promotion: 'Promotion', endgame: 'Endgame', backRankMate: 'Back-rank mate', deflection: 'Deflection', attraction: 'Attraction', trappedPiece: 'Trapped piece', doubleCheck: 'Double check' };
async function chess(ctx, o = {}) {
  const camp = !!o.stage; const P = o.p || {};
  if (!camp && !(await payOrSolve(ctx, 'play a chess puzzle'))) return;
  const run = o.run || (o.run = { done: 0, solved: 0, mistakes: 0, hints: 0 });
  const rating = camp ? P.rating : ctx.puzzleRating();
  const body = el(`<div class="chess">
    <div class="gb-top"><span class="ch-vs">Rating <b class="ch-rating">${ctx.puzzleRating()}</b></span><span class="ch-status">Loading puzzle…</span>${chargePill(ctx)}</div>
    ${camp ? `<div class="stage-bar"><b>Level ${o.idx + 1} · puzzle ${run.done + 1}/${P.n}</b> ${'❤️'.repeat(Math.max(0, P.lives - run.mistakes))}${'🖤'.repeat(Math.min(P.lives, run.mistakes))}</div>` : ''}
    <div class="ch-cap ch-tags"></div>
    <div class="ch-board"></div>
    <div class="gb-actions"><button class="btn ghost small ch-hint">💡 Hint · 1⚡</button><button class="btn ghost small ch-sol" hidden>Show solution</button><button class="btn small ch-next" hidden>Next puzzle · 1⚡</button></div>
    <p class="small ch-moves"></p></div>`);
  const refresh = wireCharge(body, ctx);
  const boardEl = body.querySelector('.ch-board');
  const setStatus = (t, cls = '') => { const e = body.querySelector('.ch-status'); e.textContent = t; e.className = `ch-status ${cls}`; };
  let s = null; let moves = []; let step = 1; let sel = null; let last = null; let hint = null; let flip = false; let done = false; let failed = false; let busy = true; let puzzle = null; let sans = [];
  ctx.openSheet('Chess puzzle', body, 'tall', Object.assign(() => { done = true; }, { onReplace: true }));
  try { puzzle = await ctx.chessPuzzle(rating); } catch {
    setStatus('Couldn’t load a puzzle — check your connection'); if (!camp || !run.done) ctx.refund(1); refresh(); return;
  }
  s = fromFEN(puzzle.fen); moves = puzzle.moves;
  flip = s.w; // the opponent moves first, so you play the other colour
  body.querySelector('.ch-tags').innerHTML = (puzzle.themes || []).filter((t) => THEME_NAMES[t]).slice(0, 3).map((t) => `<span class="pill">${THEME_NAMES[t]}</span>`).join(' ') + ` <span class="small">Puzzle ${puzzle.rating}</span>`;
  const render = () => {
    boardEl.innerHTML = '';
    const targets = sel !== null && !busy ? chessLegal(s).filter((m) => m.from === sel) : [];
    const checkSq = chessInCheck(s) ? s.b.indexOf(s.w ? 'K' : 'k') : -1;
    for (let d = 0; d < 64; d++) {
      const i = flip ? 63 - d : d; const r = i >> 3; const c = i & 7; const dr = d >> 3; const dc = d & 7;
      const tgt = targets.find((m) => m.to === i);
      const cls = ['ch-sq', (r + c) % 2 ? 'dark' : 'light', sel === i ? 'ch-sel' : '', last && (last.from === i || last.to === i) ? 'ch-last' : '', tgt ? (s.b[i] !== '.' || tgt.epCap != null ? 'tg-cap' : 'tg-dot') : '', i === checkSq ? 'ch-check' : '', hint === i ? 'ch-hintsq' : ''].filter(Boolean).join(' ');
      boardEl.appendChild(el(`<button class="${cls}" data-i="${i}">${s.b[i] !== '.' ? glyph(s.b[i]) : ''}${dc === 0 ? `<small class="rk">${8 - r}</small>` : ''}${dr === 7 ? `<small class="fl">${'abcdefgh'[c]}</small>` : ''}</button>`));
    }
    body.querySelector('.ch-moves').textContent = sans.join('  ');
  };
  const play = (m) => { sans.push(chessSan(s, m)); s = chessMake(s, m); last = m; sel = null; hint = null; ctx.sound(m.cap !== '.' ? 'correct' : 'quest'); };
  const you = () => (flip ? 'Black' : 'White');
  const finish = (solved) => {
    done = true; busy = true;
    const res = ctx.puzzleResult(puzzle.rating, solved);
    body.querySelector('.ch-rating').textContent = `${res.rating} (${res.delta >= 0 ? '+' : ''}${res.delta})`;
    const xp = solved ? Math.max(10, Math.min(40, Math.round((puzzle.rating - 400) / 60))) : 2;
    ctx.recordBest('chess', res.rating);
    ctx.gameDone('chess', xp);
    if (solved) { setStatus(`Solved! +${xp} XP`, 'ok'); ctx.sound('level'); confetti(); } else setStatus('Puzzle failed', 'no');
    body.querySelector('.ch-hint').hidden = true;
    body.querySelector('.ch-next').hidden = false;
    if (camp) {
      run.done++; if (solved) run.solved++; else run.mistakes++;
      const out = run.mistakes >= P.lives; const fin = run.done >= P.n;
      body.querySelector('.ch-next').textContent = out || fin ? 'See results' : `Next puzzle (${run.done + 1}/${P.n})`;
    }
    body.querySelector('.ch-sol').hidden = solved;
    render();
  };
  const opponent = () => {
    busy = true; render();
    setTimeout(() => {
      if (done && !failed) return;
      const m = moveFromUci(s, moves[step - 1]);
      if (m) play(m);
      busy = false;
      if (step >= moves.length) return finish(true);
      setStatus(`${you()} to move — find the best move`); render();
    }, step === 1 ? 700 : 450);
  };
  render(); setStatus('Watch the opponent’s move…');
  opponent();
  boardEl.addEventListener('click', (e) => {
    const sq = e.target.closest('.ch-sq'); if (!sq || busy || done) return;
    const i = +sq.dataset.i;
    if (sel !== null) {
      const m = chessLegal(s).find((x) => x.from === sel && x.to === i);
      if (m) {
        const want = moves[step];
        const exp = moveFromUci(s, want);
        const mine = uciOf(m);
        const right = mine === want || (mine.slice(0, 4) === want.slice(0, 4)) || (step === moves.length - 1 && chessLegal(chessMake(s, m)).length === 0 && chessInCheck(chessMake(s, m)));
        if (right) {
          play(exp && mine.slice(0, 4) === want.slice(0, 4) ? exp : m);
          step += 2;
          if (step - 1 >= moves.length) return finish(true);
          setStatus('Correct! Keep going…', 'ok');
          opponent();
        } else {
          failed = true; sel = null;
          ctx.sound('wrong');
          boardEl.classList.remove('shake'); void boardEl.offsetWidth; boardEl.classList.add('shake');
          hint = exp ? exp.from : null;
          finish(false);
          setStatus('Not the best move', 'no');
        }
        return;
      }
    }
    const p = s.b[i];
    sel = p !== '.' && (p >= 'A' && p <= 'Z') === s.w && sel !== i ? i : null;
    render();
  });
  body.querySelector('.ch-hint').addEventListener('click', () => {
    if (busy || done || !spend(ctx, refresh, 'A hint')) return;
    run.hints++;
    const m = moveFromUci(s, moves[step]); hint = m ? m.from : null; sel = hint; setStatus('Move this piece'); render();
  });
  body.querySelector('.ch-sol').addEventListener('click', () => {
    // Replay the rest of the solution from where you went wrong.
    body.querySelector('.ch-sol').hidden = true;
    const rest = moves.slice(step); let k = 0;
    const tick = () => { if (k >= rest.length || !body.isConnected) return; const m = moveFromUci(s, rest[k++]); if (m) play(m); hint = null; render(); setTimeout(tick, 700); };
    tick();
  });
  body.querySelector('.ch-next').addEventListener('click', () => {
    if (!camp) return startGame('chess', ctx, { endless: true });
    if (run.mistakes >= P.lives || run.done >= P.n) {
      const fail = run.mistakes >= P.lives;
      return o.end(body, { fail, stars: run.mistakes === 0 ? (run.hints ? 2 : 3) : 1, big: `${run.solved}/${P.n}`, unit: 'solved', line: `${run.mistakes} mistake${run.mistakes === 1 ? '' : 's'} · ${run.hints} hint${run.hints === 1 ? '' : 's'}`, share: `I beat chess level ${o.idx + 1} (${P.rating}) on MathScroll!` });
    }
    chess(ctx, o);
  });
}
