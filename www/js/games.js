// Maths mini-games: Sum Blast, 24, Queens and Mental Math Rush.
// The app passes in a small context (sheet, toast, XP, sound, storage) so this module stays independent.

const el = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
const rnd = (n) => Math.floor(Math.random() * n);

export const GAMES = [
  { id: 'sumblast', name: 'Sum Blast', icon: '💥', blurb: 'Drag through tiles that add up to the target. 90 seconds.' },
  { id: 'g24', name: '24', icon: '🎯', blurb: 'Use all four numbers with + − × ÷ to make 24.' },
  { id: 'queens', name: 'Queens', icon: '♛', blurb: 'Place N queens so no two attack each other.' },
  { id: 'rush', name: 'Mental Math Rush', icon: '⚡', blurb: 'As many sums as you can in 60 seconds.' },
];

// ------------------------------------------------------------------ hub
export function openGames(ctx) {
  const best = ctx.bests();
  const body = el(`<div class="games-hub">${GAMES.map((g) => `
    <button class="game-tile" data-g="${g.id}"><span class="g-icon">${g.icon}</span><span class="g-text"><b>${g.name}</b><small>${g.blurb}</small>${best[g.id] ? `<em>Best: ${ctx.bestLabel(g.id, best[g.id])}</em>` : ''}</span></button>`).join('')}
    <p class="small">Every game earns XP. Your best scores are kept in your profile.</p></div>`);
  body.querySelectorAll('.game-tile').forEach((b) => b.addEventListener('click', () => startGame(b.dataset.g, ctx)));
  ctx.openSheet('Games', body, 'tall');
}
export function startGame(id, ctx) {
  ({ sumblast: sumBlast, g24: game24, queens, rush })[id](ctx);
}

// ------------------------------------------------------------------ Sum Blast
function sumBlast(ctx) {
  const COLS = 6; const ROWS = 7; const TIME = 90;
  const roll = () => [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 8, 9][rnd(15)];
  let grid = Array.from({ length: ROWS }, () => Array.from({ length: COLS }, roll));
  let target = 0; let score = 0; let combo = 0; let left = TIME; let over = false;
  const body = el(`<div class="sumblast">
    <div class="gb-top"><span class="gb-score">0</span><span class="gb-target">Make <b></b></span><span class="gb-time">${TIME}s</span></div>
    <div class="sb-sum"><span>Drag across touching tiles</span></div>
    <div class="sb-grid" style="--cols:${COLS}"></div>
    <div class="gb-actions"><button class="btn ghost small shuffle">Shuffle (−5s)</button></div></div>`);
  const gridEl = body.querySelector('.sb-grid');
  const newTarget = () => { target = 10 + rnd(11); body.querySelector('.gb-target b').textContent = target; };
  const draw = () => {
    gridEl.innerHTML = '';
    grid.forEach((row, r) => row.forEach((v, c) => {
      gridEl.appendChild(el(`<div class="sb-tile v${v}" data-r="${r}" data-c="${c}">${v}</div>`));
    }));
  };
  newTarget(); draw();
  let chain = [];
  const tileAt = (x, y) => { const t = document.elementFromPoint(x, y); return t && t.classList.contains('sb-tile') && gridEl.contains(t) ? t : null; };
  const sumOf = () => chain.reduce((s, t) => s + grid[t.r][t.c], 0);
  const showSum = () => {
    const s = sumOf();
    const box = body.querySelector('.sb-sum');
    box.innerHTML = chain.length ? `<span>${chain.map((t) => grid[t.r][t.c]).join(' + ')} = <b class="${s === target ? 'hit' : s > target ? 'over' : ''}">${s}</b></span>` : '<span>Drag across touching tiles</span>';
    gridEl.querySelectorAll('.sb-tile').forEach((t) => t.classList.toggle('sel', chain.some((x) => x.r === +t.dataset.r && x.c === +t.dataset.c)));
  };
  const add = (t) => {
    const r = +t.dataset.r; const c = +t.dataset.c;
    const i = chain.findIndex((x) => x.r === r && x.c === c);
    if (i >= 0) { if (i === chain.length - 2) chain.pop(); return; } // step back to undo
    const last = chain[chain.length - 1];
    if (last && (Math.abs(last.r - r) > 1 || Math.abs(last.c - c) > 1)) return; // must touch (diagonals ok)
    chain.push({ r, c });
  };
  gridEl.addEventListener('pointerdown', (e) => {
    if (over) return;
    const t = tileAt(e.clientX, e.clientY); if (!t) return;
    gridEl.setPointerCapture?.(e.pointerId);
    chain = []; add(t); showSum();
  });
  gridEl.addEventListener('pointermove', (e) => {
    if (!chain.length || over) return;
    const t = tileAt(e.clientX, e.clientY); if (t) { add(t); showSum(); }
  });
  const release = () => {
    if (!chain.length || over) return;
    const s = sumOf();
    if (s === target && chain.length >= 2) {
      combo++;
      const pts = chain.length * chain.length * 10 * Math.min(combo, 5);
      score += pts;
      body.querySelector('.gb-score').textContent = score;
      ctx.sound(chain.length >= 4 ? 'crit' : 'correct');
      // Burst, then let the tiles above fall and refill from the top.
      chain.forEach((t) => gridEl.querySelector(`[data-r="${t.r}"][data-c="${t.c}"]`)?.classList.add('pop'));
      const pop = el(`<div class="sb-pop">+${pts}${combo > 1 ? ` · combo ×${Math.min(combo, 5)}` : ''}</div>`); body.appendChild(pop); setTimeout(() => pop.remove(), 900);
      const cleared = new Set(chain.map((t) => `${t.r},${t.c}`));
      setTimeout(() => {
        for (let c = 0; c < COLS; c++) {
          const keep = [];
          for (let r = ROWS - 1; r >= 0; r--) if (!cleared.has(`${r},${c}`)) keep.push(grid[r][c]);
          for (let r = ROWS - 1, k = 0; r >= 0; r--, k++) grid[r][c] = k < keep.length ? keep[k] : roll();
        }
        draw(); gridEl.querySelectorAll('.sb-tile').forEach((t) => t.classList.add('drop'));
        newTarget();
      }, 220);
    } else {
      combo = 0;
      if (chain.length > 1) { gridEl.classList.remove('shake'); void gridEl.offsetWidth; gridEl.classList.add('shake'); ctx.sound('wrong'); }
    }
    chain = []; showSum();
  };
  gridEl.addEventListener('pointerup', release);
  gridEl.addEventListener('pointercancel', release);
  body.querySelector('.shuffle').addEventListener('click', () => {
    if (over) return;
    grid = Array.from({ length: ROWS }, () => Array.from({ length: COLS }, roll)); draw(); left = Math.max(1, left - 5);
  });
  const timer = setInterval(() => {
    if (over) return;
    left--; body.querySelector('.gb-time').textContent = `${left}s`;
    body.querySelector('.gb-time').classList.toggle('low', left <= 10);
    if (left <= 0) end();
  }, 1000);
  const end = () => {
    over = true; clearInterval(timer);
    const xp = Math.min(80, Math.round(score / 25));
    const isBest = ctx.recordBest('sumblast', score);
    ctx.gameDone('sumblast', xp);
    showResult(body, ctx, { title: 'Time!', big: score, unit: 'points', line: `${isBest ? 'New best! ' : ''}+${xp} XP`, again: () => sumBlast(ctx), share: `I scored ${score} in Sum Blast on MathScroll. Beat that!` });
  };
  const stopSb = () => { over = true; clearInterval(timer); }; stopSb.onReplace = true;
  ctx.openSheet('Sum Blast', body, 'tall', stopSb);
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
function solve24(cards) {
  if (cards.length === 1) return cards[0].v.n === 24 && cards[0].v.d === 1 ? cards[0].e : null;
  for (let i = 0; i < cards.length; i++) {
    for (let j = 0; j < cards.length; j++) {
      if (i === j) continue;
      const rest = cards.filter((_, k) => k !== i && k !== j);
      for (const op of ['+', '−', '×', '÷']) {
        if ((op === '+' || op === '×') && j < i) continue;
        const v = fop(cards[i].v, cards[j].v, op);
        if (!v) continue;
        const r = solve24([...rest, { v, e: `(${cards[i].e} ${op} ${cards[j].e})` }]);
        if (r) return r;
      }
    }
  }
  return null;
}
export function new24() {
  for (;;) {
    const nums = Array.from({ length: 4 }, () => 1 + rnd(9));
    const sol = solve24(nums.map((n) => ({ v: frac(n), e: String(n) })));
    if (sol) return { nums, sol: sol.replace(/^\((.*)\)$/, '$1') };
  }
}
// The 24 board, usable full-screen or inside a feed card.
export function mount24(container, ctx, { onSolve, compact = false } = {}) {
  let puzzle = new24();
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
      if (v.n === 24 && v.d === 1) { msg('24! Nice.'); ctx.sound('correct'); root.classList.add('won'); setTimeout(() => { root.classList.remove('won'); onSolve?.(); }, 700); }
      else { msg(`That makes ${fstr(v)}, not 24. Undo and try again.`); ctx.sound('wrong'); }
    }
  };
  root.querySelectorAll('.g24-op').forEach((b) => b.addEventListener('click', () => { if (picked === null) { msg('Pick a number first.'); return; } op = b.dataset.op; render(); }));
  root.querySelector('.undo').addEventListener('click', () => { if (history.length) { cards = history.pop(); picked = null; op = null; render(); } });
  root.querySelector('.reset').addEventListener('click', reset);
  root.querySelector('.hint').addEventListener('click', () => { msg(`One way: ${puzzle.sol} = 24`); root.dataset.hinted = '1'; });
  root.querySelector('.skip')?.addEventListener('click', () => { puzzle = new24(); root.dataset.hinted = ''; reset(); msg('New numbers.'); });
  reset();
  return {
    next() { puzzle = new24(); root.dataset.hinted = ''; reset(); msg('Tap a number, an operation, then another number.'); },
    hinted: () => root.dataset.hinted === '1',
  };
}
function game24(ctx) {
  const TIME = 120;
  let solved = 0; let left = TIME; let over = false;
  const body = el(`<div class="g24-game"><div class="gb-top"><span class="gb-score">0 solved</span><span class="gb-target">Make <b>24</b></span><span class="gb-time">2:00</span></div><div class="g24-slot"></div></div>`);
  let board;
  board = mount24(body.querySelector('.g24-slot'), ctx, {
    onSolve: () => {
      if (over) return;
      if (!board.hinted()) solved++;
      body.querySelector('.gb-score').textContent = `${solved} solved`;
      board.next();
    },
  });
  const timer = setInterval(() => {
    if (over) return;
    left--; body.querySelector('.gb-time').textContent = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`;
    body.querySelector('.gb-time').classList.toggle('low', left <= 15);
    if (left <= 0) {
      over = true; clearInterval(timer);
      const xp = solved * 10; const isBest = ctx.recordBest('g24', solved);
      ctx.gameDone('g24', xp, { solved24: solved });
      showResult(body, ctx, { title: 'Time!', big: solved, unit: solved === 1 ? 'puzzle' : 'puzzles', line: `${isBest ? 'New best! ' : ''}+${xp} XP · puzzles where you used “Show a way” don’t count`, again: () => game24(ctx), share: `I solved ${solved} “make 24” puzzles in 2 minutes on MathScroll!` });
    }
  }, 1000);
  const stop24 = () => { over = true; clearInterval(timer); }; stop24.onReplace = true;
  ctx.openSheet('24', body, 'tall', stop24);
}

// ------------------------------------------------------------------ Queens
function queens(ctx, N = null) {
  const level = N || Math.min(8, Math.max(4, (ctx.bests().queens || 3) + 1));
  let Q = new Set();
  const start = Date.now(); let moves = 0;
  const body = el(`<div class="queens"><div class="gb-top"><span>${level}×${level}</span><span class="gb-target">Place <b>${level}</b> queens</span><span class="q-count">0/${level}</span></div>
    <div class="q-board" style="--n:${level}"></div>
    <p class="small">A queen attacks along its row, column and both diagonals. Tap a square to place or remove a queen.</p>
    <div class="gb-actions"><button class="btn ghost small q-clear">Clear</button>${level > 4 ? '<button class="btn ghost small q-easier">Smaller board</button>' : ''}</div></div>`);
  const board = body.querySelector('.q-board');
  const attacks = (a, b) => { const [r1, c1] = a.split(',').map(Number); const [r2, c2] = b.split(',').map(Number); return r1 === r2 || c1 === c2 || Math.abs(r1 - r2) === Math.abs(c1 - c2); };
  const render = () => {
    board.innerHTML = '';
    const list = [...Q];
    const bad = new Set(list.filter((a) => list.some((b) => b !== a && attacks(a, b))));
    for (let r = 0; r < level; r++) {
      for (let c = 0; c < level; c++) {
        const k = `${r},${c}`;
        const hit = !Q.has(k) && list.some((q) => attacks(q, k));
        const sq = el(`<button class="q-sq ${(r + c) % 2 ? 'dark' : 'light'} ${hit ? 'hit' : ''} ${bad.has(k) ? 'bad' : ''}" aria-label="Row ${r + 1}, column ${c + 1}">${Q.has(k) ? '♛' : ''}</button>`);
        sq.addEventListener('click', () => { if (Q.has(k)) Q.delete(k); else Q.add(k); moves++; ctx.sound(Q.has(k) ? 'quest' : 'wrong'); render(); check(); });
        board.appendChild(sq);
      }
    }
    body.querySelector('.q-count').textContent = `${Q.size}/${level}`;
  };
  const check = () => {
    const list = [...Q];
    if (list.length !== level || list.some((a) => list.some((b) => b !== a && attacks(a, b)))) return;
    const secs = Math.round((Date.now() - start) / 1000);
    const xp = level * 10;
    ctx.recordBest('queens', level);
    ctx.gameDone('queens', xp);
    ctx.sound('level');
    setTimeout(() => showResult(body, ctx, { title: 'Solved!', big: `${level}×${level}`, unit: '', line: `${secs}s · ${moves} moves · +${xp} XP`, again: level < 8 ? () => queens(ctx, level + 1) : () => queens(ctx, 8), againLabel: level < 8 ? `Try ${level + 1}×${level + 1}` : 'Play again', share: `I solved the ${level}-queens puzzle on MathScroll in ${secs}s!` }), 500);
  };
  body.querySelector('.q-clear').addEventListener('click', () => { Q = new Set(); render(); });
  body.querySelector('.q-easier')?.addEventListener('click', () => queens(ctx, level - 1));
  render();
  ctx.openSheet('Queens', body, 'tall');
}

// ------------------------------------------------------------------ Mental Math Rush
function rushQuestion(level) {
  const pick = (a, b) => a + rnd(b - a + 1);
  const kinds = level < 4 ? ['add', 'sub', 'mul'] : level < 8 ? ['add', 'sub', 'mul', 'div', 'sq'] : ['add', 'sub', 'mul', 'div', 'sq', 'pct', 'mul2'];
  const k = kinds[rnd(kinds.length)];
  const big = level >= 6;
  if (k === 'add') { const a = pick(big ? 23 : 5, big ? 199 : 49); const b = pick(big ? 17 : 3, big ? 149 : 49); return { q: `${a} + ${b}`, a: a + b }; }
  if (k === 'sub') { const a = pick(big ? 60 : 12, big ? 250 : 80); const b = pick(3, a - 1); return { q: `${a} − ${b}`, a: a - b }; }
  if (k === 'mul') { const a = pick(2, big ? 15 : 12); const b = pick(2, 12); return { q: `${a} × ${b}`, a: a * b }; }
  if (k === 'div') { const b = pick(2, 12); const a = b * pick(2, 12); return { q: `${a} ÷ ${b}`, a: a / b }; }
  if (k === 'sq') { const a = pick(4, big ? 25 : 15); return { q: `${a}²`, a: a * a }; }
  if (k === 'pct') { const p = [10, 20, 25, 50, 75][rnd(5)]; const a = pick(1, 20) * 20; return { q: `${p}% of ${a}`, a: (p * a) / 100 }; }
  const a = pick(11, 39); const b = pick(3, 9); return { q: `${a} × ${b}`, a: a * b };
}
function rush(ctx) {
  const TIME = 60;
  let left = TIME; let score = 0; let streak = 0; let level = 1; let over = false; let cur = rushQuestion(1); let typed = '';
  const body = el(`<div class="rush"><div class="gb-top"><span class="gb-score">0</span><span class="r-streak"></span><span class="gb-time">${TIME}s</span></div>
    <div class="r-q"></div><div class="r-a"></div>
    <div class="r-pad">${['7', '8', '9', '4', '5', '6', '1', '2', '3', '−', '0', '⌫'].map((k) => `<button class="r-key" data-k="${k}">${k}</button>`).join('')}</div></div>`);
  const show = () => { body.querySelector('.r-q').textContent = `${cur.q} = ?`; body.querySelector('.r-a').textContent = typed || ' '; };
  const press = (k) => {
    if (over) return;
    if (k === '⌫') typed = typed.slice(0, -1);
    else if (k === '−') typed = typed.startsWith('-') ? typed.slice(1) : `-${typed}`;
    else if (typed.replace('-', '').length < 6) typed += k;
    show();
    const v = Number(typed);
    if (typed && typed !== '-' && v === cur.a) {
      score++; streak++; level = 1 + Math.floor(score / 4);
      body.querySelector('.gb-score').textContent = score;
      body.querySelector('.r-streak').textContent = streak >= 3 ? `🔥 ${streak}` : '';
      ctx.sound('correct');
      body.querySelector('.r-a').classList.add('ok'); setTimeout(() => body.querySelector('.r-a').classList.remove('ok'), 180);
      typed = ''; cur = rushQuestion(level); show();
    } else if (String(cur.a).length <= typed.replace('-', '').length && v !== cur.a && !String(cur.a).startsWith(typed)) {
      // Wrong answer: lose 2 seconds and the streak.
      streak = 0; left = Math.max(0, left - 2); ctx.sound('wrong');
      body.querySelector('.r-streak').textContent = '';
      const a = body.querySelector('.r-a'); a.classList.remove('shake'); void a.offsetWidth; a.classList.add('shake');
      typed = ''; setTimeout(show, 200);
    }
  };
  body.querySelectorAll('.r-key').forEach((b) => b.addEventListener('pointerdown', (e) => { e.preventDefault(); press(b.dataset.k); }));
  const onKey = (e) => { if (/^[0-9]$/.test(e.key)) press(e.key); else if (e.key === 'Backspace') press('⌫'); else if (e.key === '-') press('−'); };
  document.addEventListener('keydown', onKey);
  show();
  const timer = setInterval(() => {
    if (over) return;
    left--; body.querySelector('.gb-time').textContent = `${left}s`;
    body.querySelector('.gb-time').classList.toggle('low', left <= 10);
    if (left <= 0) {
      over = true; clearInterval(timer); document.removeEventListener('keydown', onKey);
      const xp = score * 2; const isBest = ctx.recordBest('rush', score);
      ctx.gameDone('rush', xp);
      showResult(body, ctx, { title: 'Time!', big: score, unit: 'correct', line: `${isBest ? 'New best! ' : ''}+${xp} XP`, again: () => rush(ctx), share: `I got ${score} right in 60 seconds of Mental Math Rush on MathScroll!` });
    }
  }, 1000);
  const stopRush = () => { over = true; clearInterval(timer); document.removeEventListener('keydown', onKey); }; stopRush.onReplace = true;
  ctx.openSheet('Mental Math Rush', body, 'tall', stopRush);
}

// ------------------------------------------------------------------ shared result screen
function showResult(body, ctx, { title, big, unit, line, again, againLabel, share }) {
  body.innerHTML = `<div class="sprint-done game-done"><small class="gd-title">${title}</small><div class="score">${big}<small> ${unit}</small></div><p>${line}</p>
    <button class="btn wide again">${againLabel || 'Play again'}</button><button class="btn ghost wide share-g">Share</button><button class="btn ghost wide more-g">More games</button></div>`;
  body.querySelector('.again').addEventListener('click', again);
  body.querySelector('.share-g').addEventListener('click', () => ctx.shareText(share));
  body.querySelector('.more-g').addEventListener('click', () => openGames(ctx));
}
